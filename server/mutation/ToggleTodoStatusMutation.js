// @flow

import {
    GraphQLBoolean,
    GraphQLID,
    GraphQLNonNull,
    GraphQLString,
} from 'graphql'

import {
    fromGlobalId,
    mutationWithClientMutationId,
} from 'graphql-relay'

import type { GraphQLContext } from '../../common/ProjectTypes'

import errors from '../../common/errors'
import { TodoLoader } from '../loader'
import { TodoItem } from '../model'
import { TodoType, UserType } from '../type'

export default mutationWithClientMutationId( {
    name               : 'ToggleTodoStatus',
    inputFields        : {
        id       : {
            type: new GraphQLNonNull( GraphQLID ),
        },
        completed: {
            type: new GraphQLNonNull( GraphQLBoolean ),
        },
    },
    outputFields       : {
        todo  : {
            type   : TodoType,
            resolve: async ( {id}, args, ctx, info ) => {

                const todo = await TodoLoader.load( ctx, id )

                if ( !todo ) {

                    return null
                }

                return todo
            },
        },
        viewer: {
            type   : UserType,
            resolve: ( result, args, {user} ) => user,
        },
        error : {
            type   : GraphQLString,
            resolve: ( {error} ) => error,
        },
    },
    mutateAndGetPayload: async ( {id, completed}, {user}: GraphQLContext/*, info*/ ) => {

        // not logged in
        if ( !user ) {

            throw new Error( errors.INVALID_USER )
        }

        const {id: todoId} = fromGlobalId( id )

        const todo = await TodoItem.findById( todoId )

        if ( !todo ) {

            throw new Error( errors.INVALID_USER )
        }

        // nothing to change
        if ( !!completed === !!todo.completedAt ) {

            return {
                id   : null,
                error: null,
            }
        }

        await todo.update( {
            completedAt: completed ? Date.now() : null,
        } )

        return {
            id   : todo.id,
            error: null,
        }
    },
} )
