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
import { AsyncStorage } from 'react-native'

export default function () {

    return new RelayNetworkLayer( [
        urlMiddleware( {
            url : ( req ) => 'http://localhost:5000/graphql',
        } ),
        batchMiddleware( {
            batchUrl     : ( reqMap ) => 'http://localhost:5000/graphql/batch',
            batchTimeout : 10,
        } ),
        //loggerMiddleware(),
        gqErrorsMiddleware(),
        perfMiddleware(),
        retryMiddleware( {
            fetchTimeout : 15000,
            retryDelays  : ( attempt ) => Math.pow( 2, attempt + 4 ) * 100,
            statusCodes  : [ 500, 503, 504 ]
        } ),
        authMiddleware( {
            token  : AsyncStorage.getItem( 'simpleTodo:authToken' ),
            prefix : ''
        } )
    ] )

}
