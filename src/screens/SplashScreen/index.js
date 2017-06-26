import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';

import { getToken } from '../../auth';
import LoadingView from '../../components/LoadingView';

export default class SplashScreen extends Component {

    static navigationOptions = {
        header: null,
    }

    async componentDidMount() {
        const token = await getToken();

        if ( token ) {
            this.navigateToTodoList();
        } else {
            this.navigateToLogin();
        }
    }

    navigateToTodoList = () => {

        // We are resetting the navigation here too, even while we are at the Login screen already,
        //   we don't want the params to be present at the stack.

        const goToTodoList = NavigationActions.reset( {
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

        this.props.navigation.dispatch( goToTodoList )
    }

    navigateToLogin = () => {

        // We are resetting the navigation here too, even while we are at the Login screen already,
        //   we don't want the params to be present at the stack.

        const goToLogin = NavigationActions.reset( {
            index  : 0,
            actions: [
                NavigationActions.navigate( {
                    routeName: 'Login', params: {
                        email    : '',
                        password : '',
                        redirectedOnLogin : false,
                    },
                } ),
            ],
        } )

        this.props.navigation.dispatch( goToLogin )
    }

    render() {
        return <LoadingView/>
    }
}
