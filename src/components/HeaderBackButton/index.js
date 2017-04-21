// @flow

import React, { PropTypes } from 'react'
import {
    Text,
    View,
    Platform,
} from 'react-native'

import FontAwesome from 'react-native-vector-icons/FontAwesome'

import TouchableItem from '../TouchableItem'
import styles from './styles'

type Props = {
    onPress?: () => void,
    pressColorAndroid?: ?string,
    title?: ?string,
    tintColor?: ?string,
    truncatedTitle?: ?string,
    width?: ?number,
}

type DefaultProps = {
    pressColorAndroid: ?string,
    tintColor: ?string,
    truncatedTitle: ?string,
}

type State = {
    initialTextWidth?: number,
}

export default class HeaderBackButton extends React.PureComponent<DefaultProps, Props, State> {

    props : Props

    static propTypes = {
        onPress           : PropTypes.func.isRequired,
        pressColorAndroid : PropTypes.string,
        title             : PropTypes.string,
        tintColor         : PropTypes.string,
        truncatedTitle    : PropTypes.string,
        width             : PropTypes.number,
    }

    static defaultProps: DefaultProps = {
        pressColorAndroid : 'rgba(0, 0, 0, .32)',
        tintColor         : Platform.select( {
            ios : '#037aff',
        } ),
        truncatedTitle    : 'Back',
    }

    state: State = {}

    _onTextLayout = ( e ) => {

        if ( !this.state.initialTextWidth ) {

            this.setState( {
                initialTextWidth : e.nativeEvent.layout.x + e.nativeEvent.layout.width,
            } )
        }
    }

    render() {
        const {onPress, pressColorAndroid, width, title, tintColor, truncatedTitle} = this.props

        const renderTruncated = this.state.initialTextWidth && width
            ? this.state.initialTextWidth > width
            : false

        return (
            <TouchableItem
                delayPressIn={0}
                onPress={onPress}
                pressColor={pressColorAndroid}
                style={styles.container}
                borderless
            >
                <View style={styles.container}>
                    <FontAwesome name="chevron-left" style={{margin : 20, color : '#FFF'}}/>
                    {Platform.OS === 'ios' && title && (
                        <Text
                            onLayout={this._onTextLayout}
                            style={[styles.title, {color : tintColor}]}
                            numberOfLines={1}
                        >
                            {renderTruncated ? truncatedTitle : title}
                        </Text>
                    )}
                </View>
            </TouchableItem>
        )
    }
}
