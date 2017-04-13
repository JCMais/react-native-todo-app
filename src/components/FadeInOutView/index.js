import React, { Component } from 'react'
import { Animated, StyleSheet } from 'react-native'

type Props = {
    isVisible : boolean
}

export default class FadeInOutView extends Component {

    static propTypes = {
        isVisible : React.PropTypes.bool.isRequired
    }

    constructor( props : Props ) {

        super( props )

        this.state = {
            opacity : new Animated.Value( props.isVisible ? 1 : 0 ),
            children: this.props.children
        }
    }

    insertChildren = () => {

        this.setState({
            children: this.props.children
        })
    }

    removeChildren = () => {

        this.setState({
            children: null
        })
    }

    componentWillReceiveProps( nextProps : Props ) {

        // component being displayed

        if ( !this.props.isVisible && nextProps.isVisible ) {

            this.state.opacity.stopAnimation()

            this.insertChildren()

            Animated.timing(
                this.state.opacity,
                {
                    toValue : 1,
                    delay : 100
                }
            ).start()

        }

        // component being hidden
        if ( this.props.isVisible && !nextProps.isVisible ) {

            Animated.timing(
                this.state.opacity,
                {
                    toValue : 0
                }
            ).start( this.removeChildren )
        }

    }
    render() {
        return (
            <Animated.View
                style={{
                    ...(StyleSheet.flatten( this.props.style )),
                    opacity: this.state.opacity,
                }}
            >
                {this.state.children}
            </Animated.View>
        )
    }
}
