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

        return {
            token : generateToken( user ),
            error : null,
        }
    },
} )
