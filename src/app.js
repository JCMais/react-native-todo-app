// @flow
import { StackNavigator } from 'react-navigation'
import getNetworkLayer from './util/getNetworkLayer'

import RelayStore from './util/RelayStore'
import Login from './screens/Login'
import Register from './screens/Register'

RelayStore.injectNetworkLayer( getNetworkLayer() )

export default StackNavigator( {
    Login : {screen : Login },
    Register: {screen : Register}
}, {
    initialRouteName : 'Login',
    initialRouteParams : {
        email   : '',
        password: '',
    }
} )
