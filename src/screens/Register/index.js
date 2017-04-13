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
import { NavigationActions } from 'react-navigation'

import { isValidEmail, isValidLength } from '../../util/validator'
import { createRenderer } from '../../util/RelayUtils'
import { login } from '../../login'

import FadeInOutView from '../../components/FadeInOutView'
import ViewerQuery from '../../query/ViewerQuery'
import colorPalette from '../../colorPalette'
import errors from '../../errors'

import RegisterEmailMutation from './mutation/RegisterEmailMutation'
import styles from './styles'

// If https://github.com/flowtype/flow-typed/issues/16 is resolved, we can better declare external types, and add the navigation below.
type Props = {
    viewer : {
        email : string
    }
}

class Register extends Component {

    static navigationOptions = {
        header: {
            visible: false,
        }
    }

    constructor( props: Props ) {

        super( props )

        const { params } = this.props.navigation.state

        this.state = {
            email   : params.email || '',
            password: params.password || '',
            name    : params.name || '',
            isValidEmail    : isValidEmail( params.email ),
            isValidPassword : isValidLength( params.password, { min : 3 } ),
            isValidName     : isValidLength( params.name, { min : 1 } )
        }

        console.log( this.state )
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

    onNameInputChange = ( name ) => {

        this.setState({
            name        : name,
            isValidName : !!name
        })
    }

    doLogin = () => {

        // instead of just navigating to the Login screen
        //  we are resetting the stack, this makes sure
        //  the stack doesn't grow out of control

        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'Login', params : {
                    'email'    : this.state.email,
                    'password' : this.state.password
                }})
            ]
        })

        this.props.navigation.dispatch( resetAction )
    }

    doRegister = () => {

        this.props.relay.commitUpdate(
            new RegisterEmailMutation({
                name     : this.state.name,
                email    : this.state.email,
                password : this.state.password,
                viewer   : this.props.viewer
            }),
            {
                onSuccess: response => {

                    const { error, token } = response.RegisterEmail

                    if ( error ) {

                        const msg = ( error === errors.EMAIL_ALREADY_IN_USE ? 'This email is already in use.' : 'Something went wrong.' )

                        Alert.alert(
                            'Oops',
                            msg
                        )

                    } else {

                        // if there are no errors, we got a token
                        // Logging directly after register

                        Alert.alert(
                            'Yay!',
                            'You have successfully registered and logged in.',
                            [
                                {
                                    text : 'OK',
                                    onPress : () => login( response.RegisterEmail.token ).then( () => {
                                        console.log( 'We are logged!' )
                                    })
                                },
                            ],
                            { cancelable: false }
                        )
                    }
                },
            }
        )
    }

    render() {

        // we probably should use a validation library 🤔
        const hasError = !!( this.state.name || this.state.email || this.state.password )
                            && ( !this.state.isValidName || !this.state.isValidEmail || !this.state.isValidPassword )

        return (
            <View style={styles.container}>
                <Text style={styles.title}>Register</Text>
                <TextInput value={this.state.name} style={styles.fieldInput} placeholder="Jon Doe" selectionColor={colorPalette.s1}
                           placeholderTextColor={colorPalette.textInputPlaceholder} underlineColorAndroid={colorPalette.s1}
                           autoCorrect={false} autoFocus={true} onChangeText={this.onNameInputChange} />
                <TextInput value={this.state.email} style={styles.fieldInput} placeholder="your-email@domain.tld"
                           keyboardType="email-address" selectionColor={colorPalette.s1} underlineColorAndroid={colorPalette.s1}
                           autoCorrect={false} onChangeText={this.onEmailInputChange} />
                <TextInput value={this.state.password} style={styles.fieldInput} placeholder="your awesome pass" autoCorrect={false}
                           secureTextEntry={true} selectionColor={colorPalette.s1} underlineColorAndroid={colorPalette.s1}
                           onChangeText={this.onPasswordInputChange} />
                <View style={styles.buttonsWrapper}>
                    <Button color={colorPalette.s4} title="Register" onPress={this.doRegister} disabled={hasError} />
                    <Text> Or </Text>
                    <Button color={colorPalette.s4} title="Get Back to Login" onPress={this.doLogin} disabled={hasError} />
                </View>
                <FadeInOutView isVisible={hasError} style={styles.errorMessageWrapper}>
                    <Text style={styles.errorMessage}>Please input a valid name, email and password.</Text>
                </FadeInOutView>
            </View>
        )
    }
}

// Create a Relay.Renderer container
export default createRenderer( Register, {
    queries: { ...ViewerQuery },
    fragments: {
        viewer: () => Relay.QL`
            fragment on User {
                email
            }
        `,
    },

});
