// @flow

import {
    GraphQLNonNull,
    GraphQLString,
} from 'graphql'
import { mutationWithClientMutationId } from 'graphql-relay'

import errors from '../../common/errors'
import { UserType } from '../type'

export default mutationWithClientMutationId( {
    name               : 'ChangePassword',
    inputFields        : {
        oldPassword: {
            type: new GraphQLNonNull( GraphQLString ),
        },
        password   : {
            type       : new GraphQLNonNull( GraphQLString ),
            description: 'user new password',
        },
    },
    outputFields       : {
        error: {
            type   : GraphQLString,
            resolve: ( {error} ) => error,
        },
        viewer   : {
            type   : UserType,
            resolve: ( result, args, {user} ) => user,
        },
    },
    mutateAndGetPayload: async ( {oldPassword, password}, {user} ) => {

        if ( !user ) {

            throw new Error( errors.INVALID_USER )
        }

        const correctPassword = await user.authenticate( oldPassword )

        if ( !correctPassword ) {

            return {
                error: errors.INVALID_PASSWORD,
            }
        }

        user.password = password

        await user.save()

        return {
            error: null,
        }
    },
} )
