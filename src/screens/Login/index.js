// @flow
import Relay from 'react-relay'
import React, { Component } from 'react'
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Button,
    Alert,
} from 'react-native'

import { isValidEmail, isValidLength } from '../../util/validator'
import { createRenderer } from '../../util/RelayUtils'
import { login } from '../../login'

import FadeInOutView from '../../components/FadeInOutView'
import ViewerQuery from '../../query/ViewerQuery'
import colorPalette from '../../colorPalette'
import errors from '../../errors'

import LoginWithEmailMutation from './mutation/LoginWithEmailMutation'
import styles from './styles'

// If https://github.com/flowtype/flow-typed/issues/16 is resolved, we can better declare external types, and add the navigation below.
type Props = {
    viewer : {
        email : string
    }
}

class Login extends Component {

    static navigationOptions = {
        header: {
            visible: false,
        }
    }

    constructor( props: Props ) {

        super( props )

        const { viewer } = props

        // user already logged in
        if ( viewer && viewer.email ) {

            // @TODO redirect to category listing
            console.log( 'You are already logged in.' )
        }


        const { params } = props.navigation.state

        this.state = {
            email : params.email || 'my-email@domain.com',
            password: params.password || 'my secure pass',
            isValidEmail: isValidEmail( params.email || 'my-email@domain.com' ),
            isValidPassword : isValidLength( params.password || 'my secure pass', { min : 3 } )
        }
    }

    componentDidUpdate() {
        //console.log( 'componentDidUpdate: ', arguments )
    }

    onEmailInputChange = ( email ) => {

        this.setState({
            email        : email,
            isValidEmail : isValidEmail( email )
        })
    }

    onPasswordInputChange = ( password ) => {

        this.setState({
            password        : password,
            isValidPassword : !!password
        })
    }

    doLogin = () => {

        this.props.relay.commitUpdate(
            new LoginWithEmailMutation({
                email    : this.state.email,
                password : this.state.password,
                viewer   : this.props.viewer
            }),
            {
                onSuccess: response => {

                    const { error, token } = response.LoginEmail

                    if ( error ) {

                        const msg = ( error === errors.INVALID_EMAIL_PASSWORD ? 'Invalid email or password.' : 'Something went wrong.' )

                        Alert.alert(
                            'Oops',
                            msg
                        )

                    } else {

                        // if there are no errors we have token

                        login( response.LoginEmail.token ).then( () => {
                            console.log( 'We are logged!' )
                        } )
                    }
                },
            }
        )
    }

    doRegister = () => {

        this.props.navigation.navigate( 'Register', {
            'email'    : this.state.email,
            'password' : this.state.password,
            'name'     : ''
        } )
    }

    render() {

        const hasError = !!( this.state.email || this.state.password )
                && (!this.state.isValidEmail || !this.state.isValidPassword )

        return (
            <View style={styles.container}>
                <Text style={styles.title}>Login</Text>
                <TextInput value={this.state.email} style={styles.fieldInput} placeholder="your-email@domain.tld"
                           keyboardType="email-address" selectionColor={colorPalette.s1} underlineColorAndroid={colorPalette.s1}
                           autoCorrect={false} autoFocus={true} onChangeText={this.onEmailInputChange} />
                <TextInput value={this.state.password} style={styles.fieldInput} placeholder="your awesome pass" autoCorrect={false}
                           secureTextEntry={true} selectionColor={colorPalette.s1} underlineColorAndroid={colorPalette.s1}
                           onChangeText={this.onPasswordInputChange} />
                <View style={styles.buttonsWrapper}>
                    <Button color={colorPalette.s4} title="Login" onPress={this.doLogin} disabled={hasError} />
                    <Text> Or </Text>
                    <Button color={colorPalette.s4} title="Register" onPress={this.doRegister} disabled={hasError} />
                </View>
                <FadeInOutView isVisible={hasError} style={styles.errorMessageWrapper}>
                    <Text style={styles.errorMessage}>Please input a valid email and/or password.</Text>
                </FadeInOutView>
            </View>
        )
    }
}

// Create a Relay.Renderer container
export default createRenderer( Login, {
    queries: { ...ViewerQuery },
    fragments: {
        viewer: () => Relay.QL`
            fragment on User {
                email
            }
        `,
    },

});
