// @flow

import React, { Component } from 'react'
import {
    Alert,
    BackHandler,
    Button,
    ListView,
    RefreshControl,
    Text,
    View,
} from 'react-native'
import Prompt from 'react-native-prompt'
import Swipeout from 'react-native-swipeout'
import Icon from 'react-native-vector-icons/FontAwesome'
import {
    NavigationActions,
    withNavigation,
} from 'react-navigation'
import Relay, { graphql } from 'react-relay'

import { createQueryRenderer } from '../../relay/utils';
import errors from '../../../common/errors'
import { logout } from '../../auth'
import colorPalette from '../../Theme'
import HeaderBackButton from '../../components/HeaderBackButton'
import HeaderIconButton from '../../components/HeaderIconButton'

import TodoItem from './components/TodoItem'

import AddTodoMutation from './mutation/AddTodoMutation'
import DeleteTodoMutation from './mutation/DeleteTodoMutation'

import styles from './styles'

type Todo = {
    id: string,
}

type State = {
    isFetchingTop: boolean,
    isFetchingBottom: boolean,
    isPromptVisible: boolean,
    selectedTodosIds: Array<string>,
    currentTodoWithOpenedSwipe: Todo,
}

const FETCH_N_ITEMS_AT_SCROLL_END = 10

const todosDataSource = new ListView.DataSource( { rowHasChanged: ( todo1, todo2 ) => todo1.id !== todo2.id } )

const initialVariables = { count: 10, cursor: null }

const askForLogoutAndGoBackToLoginScreen = ( navigation ) => {
    Alert.alert(
        'Are you sure?',
        'Do you really want to logout?',
        [
            {
                text: 'Logout',
                onPress: () => logout().then( () => {

                    // not using navigation.goBack( null ) because we want to reset the params

                    const resetAction = NavigationActions.reset( {
                        index: 0,
                        actions: [
                            NavigationActions.navigate( {
                                routeName: 'Login', params: {
                                    email: '',
                                    password: '',
                                    redirectedOnLogin: false,
                                },
                            } ),
                        ],
                    } )

                    navigation.dispatch( resetAction )

                } ).catch( err => {

                    Alert.alert(
                        'Oops',
                        'Something went wrong: ' + err.toString(),
                    )
                } ),
            },
            {
                text: 'Cancel',
            },
        ],
    )
}

class TodoList extends Component {

    static navigationOptions = ( { navigation } ) => ({
        title: 'Todo List',
        headerLeft: <HeaderBackButton
            onPress={() => askForLogoutAndGoBackToLoginScreen( navigation )}
        />,
        headerRight: navigation.state.params.right,
    })

    state: State

    constructor( props ) {

        super( props )

        this.state = {
            isFetchingTop: false,
            isFetchingBottom: false,
            isPromptVisible: false,
            selectedTodosIds: [],
            currentTodoWithOpenedSwipe: null,
        }
    }

    componentWillMount() {
        this._backHandlerListener = BackHandler.addEventListener(
            'hardwareBackPress',
            () => {
                askForLogoutAndGoBackToLoginScreen( this.props.navigation )
                return true
            },
        );
    }

    componentWillUnmount() {
        BackHandler.removeEventListener( this._backHandlerListener )
    }

    componentWillUpdate( nextProps, nextState: State ) {

        if ( !!this.state.selectedTodosIds.length !== !!nextState.selectedTodosIds.length ) {

            this.props.navigation.setParams( {
                right: !!nextState.selectedTodosIds.length && <HeaderIconButton onPress={this.removeSelectedTodos} iconName="trash"/>,
            } )
        }
    }

    onRefresh = () => {

        const { todos } = this.props.viewer

        this.setState( {
            isLoading: true,
        } )

        this.props.relay.refetchConnection( todos.edges.length, ( err ) => {

            if ( err ) {
                Alert.alert(
                    'Oops',
                    'Something went wrong while fetching new items: ' + err.toString(),
                )
            }

            this.setState( {
                isLoading: false,
            } )
        } )
    }

    onEndReached = () => {

        const { relay } = this.props;

        if ( !relay.hasMore() || relay.isLoading() ) {
            return;
        }

        this.setState( {
            isLoading: true,
        } )

        relay.loadMore( FETCH_N_ITEMS_AT_SCROLL_END, ( err ) => {

            if ( err ) {
                Alert.alert(
                    'Oops',
                    'Something went wrong while fetching new items: ' + err.toString(),
                )
            }

            this.setState( {
                isLoading: false,
            } );
        } );
    }

    isTodoSelected = ( todo: Todo ) => {
        return this.state.selectedTodosIds.indexOf( todo.id ) !== -1
    }

    selectTodo = ( todo: Todo ) => {

        if ( !this.isTodoSelected( todo ) ) {

            this.setState( {
                selectedTodosIds: [...this.state.selectedTodosIds, todo.id],
            } )
        }
    }

    deselectOrSelectTodo = ( todo: Todo ) => {

        if ( this.isTodoSelected( todo ) ) {

            this.setState( ( { selectedTodosIds } ) => ({
                selectedTodosIds: selectedTodosIds.filter( selectedTodoId => selectedTodoId !== todo.id ),
            }) )

            // only select new nodes on press if there are already selected nodes.
        } else if ( this.state.selectedTodosIds.length ) {

            this.selectTodo( todo )
        }
    }

    onSwipeClose = ( todo: Todo ) => {

        if ( this.state.currentTodoWithOpenedSwipe && this.state.currentTodoWithOpenedSwipe.id === todo.id ) {
            this.setState( {
                currentTodoWithOpenedSwipe: null,
            } )
        }

    }

    onSwipeOpen = ( todo: Todo ) => {
        this.setState( {
            currentTodoWithOpenedSwipe: todo,
        } )
    }

    renderRow = ( { node: todo } ) => {

        const isSelected = this.isTodoSelected( todo )

        return (
            <Swipeout right={[
                {
                    text: 'Delete',
                    backgroundColor: '#ff4254',
                    onPress: () => this.removeTodo( todo ),
                },
            ]} style={{ marginVertical: 10, marginHorizontal: 5 }} autoClose={true}
                      close={this.state.currentTodoWithOpenedSwipe && this.state.currentTodoWithOpenedSwipe !== todo}
                      onClose={() => this.onSwipeClose( todo )} onOpen={() => this.onSwipeOpen( todo )}>
                <TodoItem
                    key={todo.id} onLongPress={this.selectTodo} onPress={this.deselectOrSelectTodo}
                    onTodoCompletedStatusChanged={() => this.props.relay.refetchConnection( this.props.viewer.todos.edges.length )}
                    isSelected={isSelected}
                    todo={todo}
                />
            </Swipeout>
        )
    }

    onAddTodoButtonPress = () => {

        this.setState( {
            isPromptVisible: true,
        } )
    }

    addTodo = ( value ) => {

        this.setState( {
            isPromptVisible: false,
        } )

        const onCompleted = ( { AddTodo } ) => {

            const { error } = AddTodo

            if ( error ) {

                const msg = error === errors.INVALID_TODO_TEXT ? 'Invalid todo text.' : 'Something went wrong.'

                Alert.alert(
                    'Oops',
                    msg,
                )

            }
        }

        // @TODO Handle onError duplication
        const onError = error => {
            Alert.alert(
                'Oops',
                'Something went wrong: ' + error.toString(),
            )
        }

        AddTodoMutation.commit(
            this.props.relay.environment,
            value,
            this.props.viewer,
            onCompleted,
            onError,
        )
    }

    removeSelectedTodos = () => {

        if ( !this.state.selectedTodosIds.length ) {
            return
        }

        const onCompleted = response => {

            this.setState( {
                selectedTodosIds: [],
            } )

            const { error } = response.DeleteTodo

            if ( error ) {

                Alert.alert(
                    'Oops',
                    'Something went wrong.',
                )

            }
        }

        // @TODO Handle onError duplication
        const onError = error => {
            Alert.alert(
                'Oops',
                'Something went wrong: ' + error.toString(),
            )
        }

        DeleteTodoMutation.commit(
            this.props.relay.environment,
            this.state.selectedTodosIds,
            this.props.viewer,
            onCompleted,
            onError,
        )
    }

    removeTodo = ( todo: Todo ) => {

        const onCompleted = response => {

            const { error } = response.DeleteTodo

            if ( error ) {

                Alert.alert(
                    'Oops',
                    'Something went wrong.',
                )

            } else {

                if ( this.isTodoSelected( todo ) ) {

                    this.deselectOrSelectTodo( todo )
                }
            }
        }

        // @TODO Handle onError duplication
        const onError = error => {
            Alert.alert(
                'Oops',
                'Something went wrong: ' + error.toString(),
            )
        }

        DeleteTodoMutation.commit(
            this.props.relay.environment,
            [todo],
            this.props.viewer,
            onCompleted,
            onError,
        )
    }

    render() {

        const { todos } = this.props.viewer

        return (
            <View style={styles.container}>
                <Prompt
                    title="Write the Todo"
                    visible={ this.state.isPromptVisible }
                    onCancel={ () => this.setState( {
                        isPromptVisible: false,
                    } ) }
                    onSubmit={ this.addTodo }/>
                { todos.edges.length
                    ? <ListView style={styles.todoList} dataSource={todosDataSource.cloneWithRows( todos.edges )}
                                renderRow={this.renderRow} onEndReached={this.onEndReached}
                                enableEmptySections={true} removeClippedSubviews={true}
                                pageSize={2} initialListSize={initialVariables.count} scrollRenderAheadDistance={100}
                                renderSeparator={ ( secID, rowID ) => <View style={styles.separator} key={rowID}/> }
                                refreshControl={
                                    <RefreshControl
                                        refreshing={this.state.isFetchingTop}
                                        onRefresh={this.onRefresh}
                                    />
                                }/>
                    : <View style={styles.noTodosMessageContainer}><Text style={styles.noTodosMessage}><Icon
                        style={styles.noTodosMessage} name="frown-o"/> No todos available</Text></View>
                }
                <View style={{ backgroundColor: colorPalette.bgDark, padding: 8, alignSelf: "stretch" }}>
                    <Button onPress={this.onAddTodoButtonPress} title="Add Todo" color={colorPalette.s3}/>
                </View>
            </View>
        )
    }
}

const TodoListPaginationContainer = Relay.createPaginationContainer(
    TodoList,
    graphql`
        fragment TodoList_viewer on User {
            id
            todos(
                first: $count
                after: $cursor
            ) @connection(key: "TodoList_todos") {
                pageInfo {
                    hasNextPage
                    endCursor
                }
                edges {
                    cursor
                    node {
                        id
                        ...TodoItem_todo
                    }
                }

            }
        }
    `,
    {
        direction: 'forward',
        getConnectionFromProps( props ) {
            return props.viewer && props.viewer.todos;
        },
        getFragmentVariables( prevVars, totalCount ) {
            return {
                ...prevVars,
                count: totalCount,
            };
        },
        getVariables( props, { count, cursor }, fragmentVariables ) {
            console.log( props, count, cursor, fragmentVariables );
            return {
                count,
                cursor,
            };
        },
        query: graphql`
            query TodoListPaginationQuery(
            $count: Int!
            $cursor: String
            ) {
                viewer {
                    ...TodoList_viewer
                }
            }
        `,
    },
)

export default createQueryRenderer(TodoListPaginationContainer, TodoList, {
    query: graphql`
        query TodoListQuery (
          $count: Int!
          $cursor: String
        ) {
            viewer {
                ...TodoList_viewer
            }
        }
    `,
    variables: initialVariables,
})
