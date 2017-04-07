import {
    GraphQLString,
    GraphQLNonNull,
} from 'graphql'

import { mutationWithClientMutationId } from 'graphql-relay'

import errors from '../errors'
import UserType from '../type/UserType'
import UserLoader from '../loader/UserLoader'

export default mutationWithClientMutationId( {
    name                : 'ChangePassword',
    inputFields         : {
        oldPassword : {
            type : new GraphQLNonNull( GraphQLString ),
        },
        password    : {
            type        : new GraphQLNonNull( GraphQLString ),
            description : 'user new password',
        },
    },
    outputFields        : {
        error : {
            type    : GraphQLString,
            resolve : ( {error} ) => error,
        },
        me    : {
            type    : UserType,
            resolve : ( obj, args, { user } ) => UserLoader.load( user, user.id ),
        },
    },
    mutateAndGetPayload : async ( { oldPassword, password }, { user } ) => {

        if ( !user ) {

            throw new Error( errors.INVALID_USER )
        }

        const correctPassword = await user.authenticate( oldPassword )

        if ( !correctPassword ) {

            return {
                error : errors.INVALID_PASSWORD,
            }
        }

        user.password = password
        await user.save()

        return {
            error : null,
        }
    },
} )
