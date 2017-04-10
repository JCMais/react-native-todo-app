// @flow

import React, { Component } from 'react'
import {
    StyleSheet,
    Text,
    View
} from 'react-native'

export default class Login extends Component {

    static navigationOptions = {
        header: {
            visible: false,
        },
        title: 'Login or Register'
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>
                    Paragráfo Inicial - Título
                </Text>
                <Text style={styles.instructions}>
                    Subtítulo - :D
                </Text>
                <Text style={styles.instructions}>
                    Texto com algum contéudo,{'\n'}
                    Balance para opções de desenvolvimento,{'\n'}
                    como hot reloading.
                </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    }
})
