// @flow
import React from 'react'
import { StatusBar } from 'react-native'
import { StackNavigator } from 'react-navigation'

import getNetworkLayer from './util/getNetworkLayer'
import RelayStore from './util/RelayStore'
import HeaderBackButton from './components/HeaderBackButton'
import Login from './screens/Login'
import Register from './screens/Register'
import TodoList from './screens/TodoList'

import colorPalette from './colorPalette'

RelayStore.injectNetworkLayer( getNetworkLayer() )

StatusBar.setBackgroundColor( colorPalette.statusBar )

export default StackNavigator( {
    Login    : {screen : Login},
    Register : {screen : Register},
    TodoList : {screen : TodoList}
}, {
    initialRouteName   : 'Login',
    initialRouteParams : {
        email    : '',
        password : '',
        redirectedOnLogin : false,
    },
    navigationOptions : ( {navigation} ) => ({
        headerStyle : {
            backgroundColor: colorPalette.bgDark,
        },
        headerTitleStyle : {
            color: '#FFF',
        },
        headerLeft : <HeaderBackButton
            onPress={() => navigation.goBack(null)}
        />
    }),
} )
