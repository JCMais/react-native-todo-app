import React, { Component, PropTypes } from 'react'
import {
    Text,
    View,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

import colorPalette from '../../Theme'
import TouchableItem from '../TouchableItem'
import styles from './styles'

type Props = {
    checked? : boolean,
    checkColor?: string,
    pressColor?: string,
    onStateChange?: () => void,
}

type DefaultProps = {
    checked : boolean,
    checkColor: string,
    pressColor: string,
}

type State = {
    isChecked : boolean
}

export default class Checkbox extends Component {

    static propTypes = {
        checked : PropTypes.bool,
        checkColor: PropTypes.string,
        pressColor: PropTypes.string,
        onStateChange : PropTypes.func,
    }

    static defaultProps: DefaultProps = {
        checked : false,
        checkColor: colorPalette.s4,
        pressColor: colorPalette.s4,
    }

    props : Props

    state : State = {
        isChecked : false
    }

    constructor( props : Props ) {

        super( props )

        this.state = {
            isChecked : !!props.checked
        }
    }

    componentWillReceiveProps( nextProps : Props ) {

        if ( this.state.isChecked !== nextProps.checked ) {

            this.setState( {
                isChecked : nextProps.checked
            } )
        }
    }

    onPress = () => {

        this.setState({
            isChecked : !this.state.isChecked
        }, () => {

            this.props.onStateChange && this.props.onStateChange( this.state.isChecked )
        })
    }

    render() {

        return (
            <TouchableItem hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                delayPressIn={0}
                onPress={this.onPress}
                pressColor={this.props.pressColor}
                style={[styles.container, this.props.style]}
                borderless={false}
            >
                <View width={20} height={20}>
                    { this.state.isChecked
                        && <Icon name="check" size={20} color={this.props.checkColor} />
                    }
                </View>
            </TouchableItem>
        )
    }
}
