import React, { Component } from 'react'
import {
    Alert,
    Button,
    ListView,
    RefreshControl,
    Text,
    View,
} from 'react-native'
import Prompt from 'react-native-prompt'
import Swipeout from 'react-native-swipeout'
import Icon from 'react-native-vector-icons/FontAwesome'
import { NavigationActions } from 'react-navigation'

import Relay from 'react-relay'
import colorPalette from '../../colorPalette'
import HeaderBackButton from '../../components/HeaderBackButton'
import HeaderIconButton from '../../components/HeaderIconButton'

import errors from '../../errors'
import { logout } from '../../login'

import ViewerQuery from '../../query/ViewerQuery'

import { createRenderer } from '../../util/RelayUtils'

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
    selectedTodos: Array<string>,
    currentTodoWithOpenedSwipe: Todo,
}

const FETCH_N_ITEMS_AT_SCROLL_END = 10

const todosDataSource = new ListView.DataSource( {rowHasChanged: ( todo1, todo2 ) => todo1.id !== todo2.id} )

class TodoList extends Component {

    static navigationOptions = ( {navigation} ) => ({
        title      : 'Todo List',
        headerLeft : <HeaderBackButton
            onPress={() => {

                Alert.alert(
                    'Are you sure?',
                    'Do you really want to logout?',
                    [
                        {
                            text   : 'Logout',
                            onPress: () => logout().then( () => {

                                // not using navigation.goBack( null ) because we want to reset the params

                                const resetAction = NavigationActions.reset( {
                                    index  : 0,
                                    actions: [
                                        NavigationActions.navigate( {
                                            routeName: 'Login', params: {
                                                email            : '',
                                                password         : '',
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
            }}
        />,
        headerRight: navigation.state.params.right,
    })

    state: State

    constructor( props ) {

        super( props )

        this.state = {
            isFetchingTop             : false,
            isFetchingBottom          : false,
            isPromptVisible           : false,
            selectedTodos             : [],
            currentTodoWithOpenedSwipe: null,
        }
    }

    componentWillUpdate( nextProps, nextState: State ) {

        if ( !!this.state.selectedTodos.length !== !!nextState.selectedTodos.length ) {

            this.props.navigation.setParams( {
                right: !!nextState.selectedTodos.length && <HeaderIconButton onPress={this.removeSelectedTodos} iconName="trash"/>,
            } )
        }
    }

    onRefresh = () => {

        const {isFetchingTop} = this.state

        if ( isFetchingTop ) return

        this.setState( {isFetchingTop: true} )

        this.props.relay.forceFetch( {}, readyState => {

            // @TODO handle error
            if ( readyState.done || readyState.aborted || readyState.error ) {

                this.setState( {
                    isFetchingTop   : false,
                    isFetchingBottom: false,
                } )
            }
        } )
    }

    onEndReached = () => {

        const {isFetchingBottom} = this.state
        const {todos}            = this.props.viewer

        if ( isFetchingBottom ) return
        if ( !todos.pageInfo.hasNextPage ) return

        this.setState( {isFetchingBottom: true} )

        this.props.relay.setVariables( {
            count: this.props.relay.variables.count + FETCH_N_ITEMS_AT_SCROLL_END,
        }, readyState => {
            if ( readyState.done || readyState.aborted ) {
                this.setState( {isFetchingBottom: false} )
            }
        } )
    }

    isTodoSelected = ( todo: Todo ) => {

        return this.state.selectedTodos.indexOf( todo.id ) !== -1
    }

    selectTodo = ( todo: Todo ) => {

        if ( !this.isTodoSelected( todo ) ) {

            this.setState( {
                selectedTodos: [...this.state.selectedTodos, todo.id],
            } )
        }
    }

    deselectOrSelectTodo = ( todo: Todo ) => {

        if ( this.isTodoSelected( todo ) ) {

            this.setState( ( {selectedTodos} ) => ({
                selectedTodos: selectedTodos.filter( selectedTodoId => selectedTodoId !== todo.id ),
            }) )

            // only select new nodes on press if there are already selected nodes.
        } else if ( this.state.selectedTodos.length ) {

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

    renderRow = ( {node: todo} ) => {

        const isSelected = this.isTodoSelected( todo )

        return (
            <Swipeout right={[
                {
                    text           : 'Delete',
                    backgroundColor: '#ff4254',
                    onPress        : () => this.removeTodo( todo ),
                },
            ]} style={{marginVertical: 10, marginHorizontal: 5}} autoClose={true}
                      close={this.state.currentTodoWithOpenedSwipe && this.state.currentTodoWithOpenedSwipe !== todo}
                      onClose={() => this.onSwipeClose( todo )} onOpen={() => this.onSwipeOpen( todo )}>
                <TodoItem key={todo.id} onLongPress={this.selectTodo} onPress={this.deselectOrSelectTodo}
                      onTodoCompletedStatusChanged={() => this.props.relay.forceFetch()} isSelected={isSelected} todo={todo}/>
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

        this.props.relay.commitUpdate(
            new AddTodoMutation( {
                viewer: this.props.viewer,
                text  : value,
            } ),
            {
                onSuccess: response => {

                    const {error} = response.AddTodo

                    if ( error ) {

                        const msg = error === errors.INVALID_TODO_TEXT ? 'Invalid todo text.' : 'Something went wrong.'

                        Alert.alert(
                            'Oops',
                            msg,
                        )

                    }
                },
            },
        )
    }

    removeSelectedTodos = () => {

        if ( !this.state.selectedTodos.length ) {
            return
        }

        this.props.relay.commitUpdate(
            new DeleteTodoMutation( {
                viewer       : this.props.viewer,
                todos        : this.props.viewer.todos,
                selectedTodos: this.state.selectedTodos,
            } ),
            {
                onSuccess: response => {

                    this.setState( {
                        selectedTodos: [],
                    } )

                    const {error} = response.DeleteTodo

                    if ( error ) {

                        Alert.alert(
                            'Oops',
                            'Something went wrong.',
                        )

                    }
                },
            },
        )
    }

    removeTodo = ( todo: Todo ) => {

        this.props.relay.commitUpdate(
            new DeleteTodoMutation( {
                viewer       : this.props.viewer,
                todos        : this.props.viewer.todos,
                selectedTodos: [todo.id],
            } ),
            {
                onSuccess: response => {

                    const {error} = response.DeleteTodo

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
                },
            },
        )
    }

    render() {

        const {todos} = this.props.viewer

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
                                pageSize={2} initialListSize={2} scrollRenderAheadDistance={1000}
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
                <View style={{backgroundColor: colorPalette.bgDark, padding: 8, alignSelf: "stretch"}}>
                    <Button onPress={this.onAddTodoButtonPress} title="Add Todo" color={colorPalette.s3}/>
                </View>
            </View>
        )
    }
}

export default createRenderer( TodoList, {
    queries         : ViewerQuery,
    initialVariables: {
        count: FETCH_N_ITEMS_AT_SCROLL_END,
    },
    fragments       : {
        viewer: () => Relay.QL`
            fragment on User {
                ${AddTodoMutation.getFragment( 'viewer' )}
                ${DeleteTodoMutation.getFragment( 'viewer' )}
                todos( first: $count ) {
                    pageInfo {
                        hasNextPage
                    }
                    edges {
                        node {
                            id
                            ${TodoItem.getFragment( 'todo' )}
                        }
                    }
                    count
                    ${DeleteTodoMutation.getFragment( 'todos' )}
                }
            }
        `,
    },
})
