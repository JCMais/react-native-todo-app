import React, { Component } from 'react'
import {
    Alert,
    Text,
    View,
    ListView,
    RefreshControl,
    TouchableHighlight,
} from 'react-native'
import { NavigationActions } from 'react-navigation'
import Relay from 'react-relay'

import { createRenderer } from '../../util/RelayUtils'
import { logout } from '../../login'

import HeaderBackButton from '../../components/HeaderBackButton'
import ViewerQuery from '../../query/ViewerQuery'
import colorPalette from '../../colorPalette'

import styles from './styles'

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

    state = {
        isFetchingTop : false,
        isFetchingEnd : false,
    }

    onRefresh = () => {

        const {isFetchingTop} = this.state

        if ( isFetchingTop ) return

        this.setState( {isFetchingTop : true} )

        this.props.relay.forceFetch( {}, readyState => {

            if ( readyState.done || readyState.aborted ) {

                this.setState( {
                    isFetchingTop : false,
                    isFetchingEnd : false,
                } )
            }
        } )
    }

    onEndReached = () => {

        const {isFetchingEnd} = this.state
        const {todos}         = this.props.viewer

        if ( isFetchingEnd ) return
        if ( !todos.pageInfo.hasNextPage ) return

        this.setState( {isFetchingEnd : true} )

        this.props.relay.setVariables( {
            count : this.props.relay.variables.count + 10,
        }, readyState => {
            if ( readyState.done || readyState.aborted ) {
                this.setState( {isFetchingEnd : false} )
            }
        } )
    }

    renderRow = ( {node} ) => {
        return (
            <TouchableHighlight onPress={() => console.log( node )} underlayColor={colorPalette.s2}>
                <View style={{margin : 20}}>
                    <Text style={{color: colorPalette.text}}>{node.text}</Text>
                </View>
            </TouchableHighlight>
        )
    }

    render() {

        const {todos} = this.props.viewer

        return (
            <View style={styles.container}>
                <ListView dataSource={dataSource.cloneWithRows( todos.edges )}
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
