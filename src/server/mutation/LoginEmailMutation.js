// @flow

import { GraphQLString, GraphQLNonNull } from 'graphql'
import { mutationWithClientMutationId } from 'graphql-relay'

import UserType from '../type/UserType'
import errors from '../../errors'
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
        viewer : {
            type : UserType,
            resolve: ( {user} ) => user,
        },
        token : {
            type    : GraphQLString,
            resolve : ( {token} ) => token,
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
                error : errors.INVALID_EMAIL_PASSWORD,
                user  : null
            }
        }

        const correctPassword = await user.authenticate( password )

        if ( !correctPassword ) {

            return {
                token : null,
                error : errors.INVALID_EMAIL_PASSWORD,
                user  : null
            }
        }

        return {
            token : generateToken( user ),
            user  : user,
            error : null,
        }
    },
} )
