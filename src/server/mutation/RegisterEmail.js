// @flow

import {
    GraphQLString,
    GraphQLNonNull,
} from 'graphql'

import { mutationWithClientMutationId } from 'graphql-relay'

import errors from '../../errors'
import { User, TodoItem } from '../model'
import { generateToken } from '../auth'

export default mutationWithClientMutationId( {
    name                : 'RegisterEmail',
    inputFields         : {
        name     : {
            type : new GraphQLNonNull( GraphQLString ),
        },
        email    : {
            type : new GraphQLNonNull( GraphQLString ),
        },
        password : {
            type : new GraphQLNonNull( GraphQLString ),
        },
    },
    outputFields        : {
        token : {
            type    : GraphQLString,
            resolve : ( {token} ) => token,
        },
        error : {
            type    : GraphQLString,
            resolve : ( {error} ) => error,
        },
    },
    mutateAndGetPayload : async ( { name, email, password } ) => {

        let user = await User.findOne( { email : email.toLowerCase() } )

        // not validating the input here
        //  We are trusting the client, but keep in mind
        //  this should not happen in a real app.

        if ( user ) {

            return {
                token : null,
                error : errors.EMAIL_ALREADY_IN_USE,
            }
        }

        user = new User( {
            name,
            email,
            password,
        } )

        await user.save()

        // @TODO Remove the code below
        // Create some random TodoItems for testing purposes only.

        await TodoItem.create([{
            _author : user,
            text    : 'Call my cousing to go bowling'
        }, {
            _author : user,
            text    : 'Finish Skyrim'
        }, {
            _author : user,
            text    : 'Finish this app'
        }, {
            _author : user,
            text    : 'Get a job',
            order   : -1
        }])

        return {
            token : generateToken( user ),
            error : null,
        }
    },
} )
