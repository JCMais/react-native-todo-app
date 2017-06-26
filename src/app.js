// @flow
import React, { Component } from 'react'
import { StatusBar } from 'react-native'
import { StackNavigator } from 'react-navigation'

import HeaderBackButton from './components/HeaderBackButton'
import SplashScreen from './screens/SplashScreen'
import Login from './screens/Login'
import Register from './screens/Register'
import TodoList from './screens/TodoList'

import colorPalette from './Theme'

// https://github.com/facebook/relay/issues/1704
(function(PolyfillSet) {
    if (!PolyfillSet) {
        return;
    }
    var testSet = new PolyfillSet();
    if (testSet.size === undefined) {
        if (testSet._c.size === 0) {
            Object.defineProperty(PolyfillSet.prototype, 'size', {
                get: function() {
                    return this._c.size;
                },
            });
        }
    }
})(require('babel-runtime/core-js/set').default);

StatusBar.setBackgroundColor( colorPalette.statusBar )

export default StackNavigator( {
    SplashScreen : {screen : SplashScreen},
    Login    : {screen : Login},
    Register : {screen : Register},
    TodoList : {screen : TodoList}
}, {
    initialRouteName   : 'SplashScreen',
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
