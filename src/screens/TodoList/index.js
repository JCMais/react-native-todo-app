import React, { Component } from 'react'
import {
    Alert,
    Button,
    ListView,
    RefreshControl,
    Text,
    TouchableHighlight,
    View,
} from 'react-native'
import { NavigationActions } from 'react-navigation'
import Relay from 'react-relay'
import Prompt from 'react-native-prompt'

import { createRenderer } from '../../util/RelayUtils'
import { logout } from '../../login'

import Checkbox from '../../components/Checkbox'
import HeaderBackButton from '../../components/HeaderBackButton'

import ViewerQuery from '../../query/ViewerQuery'
import colorPalette from '../../colorPalette'

import styles from './styles'

type State = {
    isFetchingTop : boolean,
    isFetchingBottom: boolean,
    isPromptVisible : boolean,
}

const dataSource = new ListView.DataSource( { rowHasChanged : ( todo1, todo2 ) => todo1.id !== todo2.id } )

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
                            text    : 'Logout',
                            onPress : () => logout().then( () => {

                                // not using navigation.goBack( null ) because we want to reset the params

                                const resetAction = NavigationActions.reset( {
                                    index   : 0,
                                    actions : [
                                        NavigationActions.navigate( {
                                            routeName : 'Login', params : {
                                                email             : '',
                                                password          : '',
                                                redirectedOnLogin : false
                                            }
                                        } )
                                    ]
                                } )

                                navigation.dispatch( resetAction )

                            } ).catch( err => {

                                Alert.alert(
                                    'Oops',
                                    'Something went wrong: ' + err.toString()
                                )
                            } )
                        },
                        {
                            text : 'Cancel'
                        }
                    ]
                )
            }}
        />,
    })

    state : State = {
        isFetchingTop : false,
        isFetchingBottom : false,
        isPromptVisible : false,
    }

    onRefresh = () => {

        const {isFetchingTop} = this.state

        if ( isFetchingTop ) return

        this.setState( {isFetchingTop : true} )

        this.props.relay.forceFetch( {}, readyState => {

            // @TODO handle error
            if ( readyState.done || readyState.aborted || readyState.error ) {

                this.setState( {
                    isFetchingTop : false,
                    isFetchingBottom : false,
                } )
            }
        } )
    }

    onEndReached = () => {

        const {isFetchingBottom} = this.state
        const {todos}         = this.props.viewer

        if ( isFetchingBottom ) return
        if ( !todos.pageInfo.hasNextPage ) return

        this.setState( {isFetchingBottom : true} )

        this.props.relay.setVariables( {
            count : this.props.relay.variables.count + 10,
        }, readyState => {
            if ( readyState.done || readyState.aborted ) {
                this.setState( {isFetchingBottom : false} )
            }
        } )
    }

    onTodoStatusChange = ( state ) => {
        console.log( state )
    }

    renderRow = ( {node} ) => {
        return (
            <TouchableHighlight onLongPress={() => console.log( 'Long press on node: ', node )} onPress={() => console.log( node )}
                                underlayColor={colorPalette.s2} style={{backgroundColor: colorPalette.todo0}}>
                <View style={styles.todoRow}>
                    <Checkbox checked={false} style={{marginRight:15}} onStateChange={this.onTodoStatusChange}/>
                    <Text style={{color: colorPalette.text}}>{node.text}</Text>
                </View>
            </TouchableHighlight>
        )
    }

    onAddTodoButtonPress = () => {

        this.setState({
            isPromptVisible : true
        })
    }

    render() {

        const {todos} = this.props.viewer

        return (
            <View style={styles.container}>
                <Prompt
                    title="Write the Todo"
                    visible={ this.state.isPromptVisible }
                    onCancel={ () => this.setState({
                        isPpromptVisible: false,
                    }) }
                    onSubmit={ (value) => this.setState({
                        isPromptVisible: false,
                    }) }/>
                <ListView style={styles.todoList} dataSource={dataSource.cloneWithRows( todos.edges )}
                          renderRow={this.renderRow} onEndReached={this.onEndReached}
                          enableEmptySections={true} removeClippedSubviews={true}
                          pageSize={2} initialListSize={2} scrollRenderAheadDistance={1000}
                          renderSeparator={ ( secID, rowID ) => <View style={styles.separator} key={rowID}/> }
                          refreshControl={
                              <RefreshControl
                                  refreshing={this.state.isFetchingTop}
                                  onRefresh={this.onRefresh}
                              />
                          }
                />
                <View style={{backgroundColor: colorPalette.bgDark, padding: 8, alignSelf: "stretch"}}>
                    <Button onPress={this.onAddTodoButtonPress} title="Add Todo" color={colorPalette.s3}/>
                </View>
            </View>
        )
    }
}

export default createRenderer( TodoList, {
    queries: ViewerQuery,
    initialVariables: {
        count: 5,
    },
    fragments: {
        viewer: () => Relay.QL`
            fragment on User {
                todos( first: $count ) {
                    pageInfo {
                        hasNextPage
                    }
                    edges {
                        node {
                            id
                            text
                        }
                    }
                }
            }
        `,
    },
})
