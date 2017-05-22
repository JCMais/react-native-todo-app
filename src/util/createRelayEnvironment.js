// @flow

import {
    Environment,
    Network,
    RecordSource,
    Store,
    ConnectionHandler,
    ViewerHandler,
} from 'relay-runtime'

import DateHandler from '../handler/DateHandler'
import { getToken } from '../auth'

// See https://facebook.github.io/relay/docs/relay-environment.html
//  and https://facebook.github.io/relay/docs/network-layer.html
// Define a function that fetches the results of an operation (query/mutation/etc)
// and returns its results as a Promise:
async function fetchQuery( operation, variables, cacheConfig, uploadables ) {

    const token = await getToken()

    const headers = {
        Accept        : 'application/json',
        'Content-Type': 'application/json',
    }

    if ( token ) {
        headers.Authorization = token;
    }

    return fetch( 'http://localhost:5000/graphql', {
        method : 'POST',
        headers,
        body : JSON.stringify({
            query: operation.text,
            variables,
        }),
    }).then( response => {
        return response.json();
    });
}

// Create a network layer from the fetch function
const network = Network.create( fetchQuery );

const source = new RecordSource();
const store  = new Store( source );

function handlerProvider( handle ) {
    switch ( handle ) {
        // Augment (or remove from) this list:
        case 'connection': return ConnectionHandler
        case 'viewer': return ViewerHandler
        case 'date': return DateHandler
    }
    throw new Error(
        `handlerProvider: No handler provided for ${handle}`
    );
}

const env = new Environment( {
    network,
    store,
    handlerProvider,
} );

export default env
