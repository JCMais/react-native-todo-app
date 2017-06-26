// @flow

import React, { Component } from 'react'
import { Button, Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

import styles from './styles'

type Props = {
    error: Error,
    retry: ?() => void,
}

export default class ErrorView extends Component<void, Props, void> {

    onReload = () => {
        if (this.props.retry) {
            this.props.retry()
        }
    }

    render() {
        const { error } = this.props
        console.log( 'Error:', error )

        // TODO - render a different view based on it
        const hasNoInternetConnection = error && error.toString().indexOf('Network request failed') > -1

        return (
            <View style={styles.container}>
                <View style={styles.iconContainer}>
                    <Icon style={styles.icon} name="frown-o"/>
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.text}>
                        {hasNoInternetConnection ? 'No Internet' : 'Something went wrong'}
                    </Text>
                </View>
                <Button onPress={this.onReload} color='#F1A940' title="Retry" />
            </View>
        )
    }
}
