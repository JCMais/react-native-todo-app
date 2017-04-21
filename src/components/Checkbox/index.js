import React, { Component, PropTypes } from 'react'
import {
    Text,
    View,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

import colorPalette from '../../colorPalette'
import TouchableItem from '../TouchableItem'
import styles from './styles'

type Props = {
    checked? : boolean,
    onStateChange?: () => void,
}

type DefaultProps = {
    checked : boolean,
}

type State = {
    isChecked : boolean
}

export default class Checkbox extends Component {

    static propTypes = {
        checked : PropTypes.bool,
        onStateChange : PropTypes.func,
    }

    static defaultProps: DefaultProps = {
        checked : false,
    }

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
            <TouchableItem
                delayPressIn={0}
                onPress={this.onPress}
                pressColor={colorPalette.s4}
                style={[this.props.style, styles.container]}
                borderless={false}
            >
                <View width={18} height={18}>
                    { this.state.isChecked
                        && <Icon name="check" size={18} color={colorPalette.s4} />
                    }
                </View>
            </TouchableItem>
        )
    }
}
