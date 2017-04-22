// @flow

import {
    GraphQLID,
    GraphQLString,
    GraphQLNonNull,
} from 'graphql'

import {
    mutationWithClientMutationId,
    fromGlobalId,
} from 'graphql-relay'

import { GraphQLContext } from '../../ProjectTypes'
import { TodoItem } from '../model'
import { TodoLoader } from '../loader'

import { TodoType, UserType } from '../type'

import errors from '../../errors'

export default mutationWithClientMutationId( {
    name        : 'ChangeTodoText',
    inputFields : {
        id   : {
            type: new GraphQLNonNull( GraphQLID )
        },
        text : {
            type : new GraphQLNonNull( GraphQLString ),
        },
    },
    outputFields        : {
        todo : {
            type    : TodoType,
            resolve : async ( { id }, args, ctx, info ) => {

                const todo = await TodoLoader.load( ctx, id )

                if ( !todo ) {

                    return null
                }

                return todo
            }
        },
        viewer : {
            type : UserType,
            resolve: ( result, args, { user } ) => user,
        },
        error : {
            type : GraphQLString,
            resolve : ( { error } ) => error,
        },
    },
    mutateAndGetPayload : async ( { id, text }, { user } : GraphQLContext/*, info*/ ) => {

        // not logged in
        if ( !user ) {

            throw new Error( errors.INVALID_USER )
        }

        // duplication from the the AddTodoMutation
        const noWhiteSpaceText = text.replace( /[\s\0]/g, '' )
        if ( !noWhiteSpaceText.length ) {

            return {
                id   : null,
                error: errors.INVALID_TODO_TEXT,
            }
        }

        text = text.trim()

        const { id: todoId } = fromGlobalId( id )

        const todo = await TodoItem.findById( todoId )

        await todo.update({
            text
        })

        return {
            id : todo.id,
            error : null
        }
    },
} )
