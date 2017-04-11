// @flow
import {
    RelayNetworkLayer,
    urlMiddleware,
    batchMiddleware,
    loggerMiddleware,
    gqErrorsMiddleware,
    perfMiddleware,
    retryMiddleware,
    authMiddleware,
} from 'react-relay-network-layer'
import { StackNavigator } from 'react-navigation'
import { AsyncStorage } from 'react-native'

import RelayStore from './util/RelayStore'
import Login from './screens/Login'

RelayStore.injectNetworkLayer( new RelayNetworkLayer( [
    urlMiddleware( {
        url : ( req ) => 'http://localhost:5000/graphql',
    } ),
    batchMiddleware( {
        batchUrl     : ( reqMap ) => 'http://localhost:5000/graphql/batch',
        batchTimeout : 10,
    } ),
    loggerMiddleware(),
    gqErrorsMiddleware(),
    perfMiddleware(),
    retryMiddleware( {
        fetchTimeout : 15000,
        retryDelays  : ( attempt ) => Math.pow( 2, attempt + 4 ) * 100,
        statusCodes  : [ 500, 503, 504 ]
    } ),
    authMiddleware( {
        token : AsyncStorage.getItem( 'simpleTodo:authToken' ),
    } )
] ) )

export default StackNavigator( {
    Login : {screen : Login}
}, {
    initialRouteName : 'Login',
} )
