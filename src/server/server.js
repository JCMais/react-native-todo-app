// @flow
import 'babel-polyfill'
import 'isomorphic-fetch'
import 'source-map-support/register'

import Koa from 'koa'
import Router from 'koa-router'

import cors from 'koa-cors'
import convert from 'koa-convert'
import logger from 'koa-logger'
import bodyParser from 'koa-bodyparser'

import graphqlHttp from 'koa-graphql'
import graphqlBatchHttpWrapper from 'koa-graphql-batch'

import { print } from 'graphql/language'; // ES6

import connectDatabase from './database'
import dataLoaders from './loader'
import { getUser } from './auth'
import { schema } from './schema'
import { jwtSecret, graphqlPort } from './config'

const app = new Koa()
const router = new Router()

app.keys = jwtSecret

// https://github.com/nodkz/react-relay-network-layer/blob/master/examples/dataLoaderPerBatchRequest.js

const graphqlSettingsPerReq = async ( req ) => {

    const { user } = await getUser( req.header.authorization )

    console.log( 'Header: ', req.header.authorization )
    console.log( 'User: ', user ? user.name : 'Anonymous' )

    const generatedDataLoaders = {}

    Object.keys( dataLoaders ).forEach( item => { generatedDataLoaders[item] = dataLoaders[item].getLoader() } )

    return {

        graphiql    : process.env.NODE_ENV !== 'production',
        schema,
        context     : {
            user,
            req,
            dataLoaders : generatedDataLoaders
        },
        extensions( { document, variables, operationName, result } ) {

            console.log( 'Query: ', print( document ) )
            console.log( 'Variables: ', variables )
            console.log( 'Result: ', variables )

            return {}
        },
        formatError : ( error ) => {
            console.log( error.message )
            console.log( error.locations )
            console.log( error.stack )

            return {
                message   : error.message,
                locations : error.locations,
                stack     : process.env.NODE_ENV === 'development' ? error.stack.split( '\n' ) : null,
            }
        },
    }
}

const graphqlServer = convert( graphqlHttp( graphqlSettingsPerReq ) )

// graphql batch query route
router.all(
    '/graphql/batch',
    bodyParser(),
    graphqlBatchHttpWrapper( graphqlServer )
)

// graphql standard route
router.all(
    '/graphql',
    graphqlServer
)


app.use( logger() )
app.use( convert( cors() ) )
app.use( router.routes() ).use( router.allowedMethods() )

// we need to capture the resulting promise, because babel has an issue
//  compilling the below IIFE.
const executionPromise = (async () => {

    try {

        const info = await connectDatabase()
        console.log( `Connected to ${info.host}:${info.port}/${info.name}` )

    } catch ( error ) {

        console.error( 'Unable to connect to database' )
        process.exit( 1 )
    }

    await app.listen( graphqlPort )
    console.log( `Server started on port ${graphqlPort}` )

})()
