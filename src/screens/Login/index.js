// @flow

import React, { Component } from 'react'
import {
    Alert,
    Button,
    Text,
    TextInput,
    View
} from 'react-native'
import {
    NavigationActions,
    withNavigation
} from 'react-navigation'
import Relay, { graphql } from 'react-relay'
import hoistStatics from 'hoist-non-react-statics'

import errors from '../../../common/errors'
import colorPalette from '../../colorPalette'
import FadeInOutView from '../../components/FadeInOutView'
import { login } from '../../auth'
import environment from '../../util/createRelayEnvironment'

import {
    isValidEmail,
    isValidLength
} from '../../util/validator'

import LoginWithEmailMutation from './mutation/LoginWithEmailMutation'
import styles from './styles'

// Waiting for a fix from https://youtrack.jetbrains.com/issue/WEB-16606
//  to use the genereated file.
type Props = {
    viewer: {
        email: string
    }
}

@withNavigation
class Login extends Component {

    static navigationOptions = {
        title     : 'Login',
        headerLeft: null,
    }

    constructor( props: Props ) {

        super( props )

        const {params} = props.navigation.state

        this.state = {
            email          : params.email,
            password       : params.password,
            isValidEmail   : isValidEmail( params.email ),
            isValidPassword: isValidLength( params.password, {min: 3} ),
        }
    }

    navigateToTodoList = () => {

        // We are resetting the navigation here too, even while we are at the Login screen already,
        //   we don't want the params to be present at the stack.

        const resetAction = NavigationActions.reset( {
            index  : 1,
            actions: [
                NavigationActions.navigate( {
                    routeName: 'Login', params: {
                        email            : '',
                        password         : '',
                        redirectedOnLogin: true,
                    },
                } ),
                NavigationActions.navigate( {routeName: 'TodoList', params: {}} ),
            ],
        } )

        this.props.navigation.dispatch( resetAction )
    }

    componentWillMount() {

        const {viewer, navigation} = this.props

        // user already logged in
        if ( viewer && viewer.email && !( navigation.state.params.redirectedOnLogin ) ) {

            this.navigateToTodoList()
        }
    }

    onEmailInputChange = ( email ) => {

        this.setState( {
            email       : email,
            isValidEmail: isValidEmail( email ),
        } )
    }

    onPasswordInputChange = ( password ) => {

        this.setState( {
            password       : password,
            isValidPassword: !!password,
        } )
    }

    doLogin = () => {
        const { email, password } = this.state

        const onCompleted = ({ LoginEmail }) => {
            const {error, token} = LoginEmail

            if ( error ) {

                const msg = ( error === errors.INVALID_EMAIL_PASSWORD ? 'Invalid email or password.' : 'Something went wrong.' )

                Alert.alert(
                    'Oops',
                    msg,
                )

            } else {

                // if there are no errors, then we have a token

                login( token ).then( () => {

                    this.navigateToTodoList()

                } ).catch( err => {

                    Alert.alert(
                        'Oops',
                        'Something went wrong: ' + err.toString(),
                    )

                } )
            }
        }

        // @TODO Handle onError duplication
        const onError = error => {
            Alert.alert(
                'Oops',
                'Something went wrong: ' + error.toString(),
            )
        }

        LoginWithEmailMutation.commit(
            this.props.relay.environment,
            email, password,
            onCompleted, onError,
        )
    }

    doRegister = () => {

        this.props.navigation.navigate( 'Register', {
            'email'   : this.state.email,
            'password': this.state.password,
            'name'    : '',
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
                           onSubmitEditing={() => this.refs.inputPass.focus()}/>
                <TextInput ref="inputPass" value={this.state.password} style={styles.fieldInput} placeholder="your awesome pass"
                           autoCorrect={false} secureTextEntry={true} selectionColor={colorPalette.s1}
                           underlineColorAndroid={colorPalette.s1} placeholderTextColor={colorPalette.textInputPlaceholder}
                           onChangeText={this.onPasswordInputChange} onSubmitEditing={this.doLogin}/>
                <View style={styles.buttonsWrapper}>
                    <Button color={colorPalette.s4} title="Login" onPress={this.doLogin} disabled={hasError}/>
                    <Text> Or </Text>
                    <Button color={colorPalette.s4} title="Register" onPress={this.doRegister} disabled={hasError}/>
                </View>
                <FadeInOutView isVisible={hasError} style={styles.errorMessageWrapper}>
                    <Text style={styles.errorMessage}>Please input a valid email and/or password.</Text>
                </FadeInOutView>
            </View>
        )
    }
}

// https://facebook.github.io/relay/docs/fragment-container.html
const LoginFragmentContainer = Relay.createFragmentContainer(
    Login,
    graphql`
        fragment Login_viewer on User {
            email
        }
    `,
)

// https://facebook.github.io/relay/docs/query-renderer.html
// @TODO Handle QueryRenderer duplication
const LoginQueryRenderer = () => {
    return (
        <Relay.QueryRenderer
            environment={environment}
            query={graphql`
                query LoginQuery {
                    viewer {
                        ...Login_viewer
                    }
                }
            `}
            render={( { error, props } ) => {

                if ( error ) {

                    // @TODO do something on error

                } else if ( props ) {

                    return <LoginFragmentContainer viewer={props.viewer} />
                }

                return <Text>Loading...</Text>
            }}
        />
    )
}

export default hoistStatics( LoginQueryRenderer, Login )
