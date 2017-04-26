// @flow

import {
    GraphQLString,
    GraphQLNonNull,
} from 'graphql'
import { mutationWithClientMutationId } from 'graphql-relay'

import { UserType } from '../type'
import errors from '../../common/errors'
import { User } from '../model'
import { generateToken } from '../auth'

export default mutationWithClientMutationId( {
    name                : 'LoginEmail',
    inputFields         : {
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
        viewer : {
            type : UserType,
            resolve: ( {user} ) => user,
        },
        error : {
            type    : GraphQLString,
            resolve : ( {error} ) => error,
        },
    },
    mutateAndGetPayload : async ( { email, password } ) => {

        const user = await User.findOne( { email : email.toLowerCase() } )

        if ( !user ) {

            return {
                token : null,
                user  : null,
                error : errors.INVALID_EMAIL_PASSWORD,
            }
        }

        const correctPassword = await user.authenticate( password )

        if ( !correctPassword ) {

            return {
                token : null,
                user  : null,
                error : errors.INVALID_EMAIL_PASSWORD,
            }
        }

        return {
            token : generateToken( user ),
            user  : user,
            error : null,
        }
    },
} )
