// @flow
import Relay from 'react-relay'
import React, { Component } from 'react'
import {
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
import errors from '../../../common/errors'

import LoginWithEmailMutation from './mutation/LoginWithEmailMutation'
import styles from './styles'

// If https://github.com/flowtype/flow-typed/issues/16 is resolved,
//    we can better declare external types, and add the navigation below.
// As of right now, it would be needed to copy the flow definitions again, here.
type Props = {
    viewer : {
        email : string
    }
}

class Login extends Component {

    static navigationOptions = {
        title: 'Login',
        headerLeft: null
    }

    constructor( props: Props ) {

        super( props )

        const {params} = props.navigation.state

        this.state = {
            email           : params.email,
            password        : params.password,
            isValidEmail    : isValidEmail( params.email ),
            isValidPassword : isValidLength( params.password, {min : 3} )
        }
    }

    navigateToTodoList = () => {

        // We are resetting the navigation here too, even while we are at the Login screen already,
        //   we don't want the params to be present at the stack.

        const resetAction = NavigationActions.reset({
            index: 1,
            actions: [
                NavigationActions.navigate({ routeName: 'Login', params : {
                    email    : '',
                    password : '',
                    redirectedOnLogin : true,
                }}),
                NavigationActions.navigate({ routeName: 'TodoList', params : {}})
            ]
        })

        this.props.navigation.dispatch( resetAction )
    }

    componentWillMount() {

        const { viewer, navigation } = this.props

        // user already logged in
        if ( viewer && viewer.email && !( navigation.state.params.redirectedOnLogin ) ) {

            this.navigateToTodoList()
        }
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

                        // if there are no errors, then we have token

                        login( response.LoginEmail.token ).then( () => {

                            this.navigateToTodoList()

                        } ).catch( err => {

                            Alert.alert(
                                'Oops',
                                'Something went wrong: ' + err.toString()
                            )

                        })
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

        if ( this.props.navigation.state.params.redirectedOnLogin ) return <View/>

        return (
            <View style={styles.container}>
                <TextInput ref="inputEmail" value={this.state.email} style={styles.fieldInput} placeholder="your-email@domain.tld"
                           keyboardType="email-address" selectionColor={colorPalette.s1} underlineColorAndroid={colorPalette.s1}
                           placeholderTextColor={colorPalette.textInputPlaceholder} autoCorrect={false} autoFocus={true}
                           returnKeyType="next" onChangeText={this.onEmailInputChange}
                           onSubmitEditing={() => this.refs.inputPass.focus()} />
                <TextInput ref="inputPass" value={this.state.password} style={styles.fieldInput} placeholder="your awesome pass"
                           autoCorrect={false} secureTextEntry={true} selectionColor={colorPalette.s1}
                           underlineColorAndroid={colorPalette.s1} placeholderTextColor={colorPalette.textInputPlaceholder}
                           onChangeText={this.onPasswordInputChange} onSubmitEditing={this.doLogin} />
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
