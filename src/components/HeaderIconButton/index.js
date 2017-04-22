// @flow

import React, { PropTypes } from 'react'
import {
    View,
} from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome'

import TouchableItem from '../TouchableItem'
import styles from './styles'

type Props = {
    onPress: () => void,
    iconName: string,
    pressColorAndroid?: ?string,
    tintColor?: ?string,
    width?: ?number,
}

type DefaultProps = {
    pressColorAndroid: string,
    tintColor: string,
    width    : number
}

export default class HeaderIconButton extends React.PureComponent<DefaultProps, Props, State> {

    static propTypes = {
        onPress           : PropTypes.func.isRequired,
        iconName          : PropTypes.string.isRequired,
        pressColorAndroid : PropTypes.string,
        tintColor         : PropTypes.string,
        width             : PropTypes.number,
    }

    static defaultProps: DefaultProps = {
        pressColorAndroid : 'rgba(0, 0, 0, .32)',
        tintColor         : '#FFF',
        width             : 18
    }

    props : Props

    render() {
        const {onPress, iconName, pressColorAndroid, width, tintColor} = this.props

        return (
            <TouchableItem
                delayPressIn={0}
                onPress={onPress}
                pressColor={pressColorAndroid}
                style={styles.container}
                borderless
            >
                <View style={styles.container}>
                    <Icon name={iconName} color={tintColor} size={width} style={styles.icon}/>
                </View>
            </TouchableItem>
        )
    }
}
