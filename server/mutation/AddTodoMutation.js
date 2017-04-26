// @flow

import {
    GraphQLNonNull,
    GraphQLString,
} from 'graphql'
import { mutationWithClientMutationId } from 'graphql-relay'

import type { GraphQLContext } from '../../common/ProjectTypes'

import errors from '../../common/errors'
import ConnectionFromMongoConnection from '../connection/ConnectionFromMongoCursor'
import TodoConnection from '../connection/TodoConnection'
import { TodoLoader } from '../loader'
import { TodoItem } from '../model'
import { UserType } from '../type'

const {edgeType: GraphQLTodoEdge} = TodoConnection

export default mutationWithClientMutationId( {
    name               : 'AddTodo',
    inputFields        : {
        text: {
            type: new GraphQLNonNull( GraphQLString ),
        },
    },
    outputFields       : {
        // https://facebook.github.io/relay/docs/guides-mutations.html#range-add
        // RANGE_ADD expects an edge to be returned by the mutation
        todoEdge: {
            type   : GraphQLTodoEdge,
            resolve: async ( {id}, args, ctx, info ) => {

                const todo = await TodoLoader.load( ctx, id )

                if ( !todo ) {

                    return null
                }

                // As the cursors from Mongo are currently defined just be an offset,
                //  we are using count - 1 as the offset of the newly created item
                // But this can create issues if more than one item are added at the same time
                const count = await TodoItem.find( {}, {}, {
                    _id: {
                        order: 1,
                    },
                } ).count()

                return {
                    cursor: ConnectionFromMongoConnection.offsetToCursor( count - 1 ),
                    node  : todo,
                }
            },
        },
        viewer  : {
            type   : UserType,
            resolve: ( result, args, {user} ) => user,
        },
        error   : {
            type   : GraphQLString,
            resolve: ( {error} ) => error,
        },
    },
    mutateAndGetPayload: async ( {text}, {user}: GraphQLContext/*, info*/ ) => {

        // not logged in
        if ( !user ) {

            throw new Error( errors.INVALID_USER )
        }

        // wow, so much validation whoa
        const noWhiteSpaceText = text.replace( /[\s\0]/g, '' )
        if ( !noWhiteSpaceText.length ) {

            return {
                id   : null,
                error: errors.INVALID_TODO_TEXT,
            }
        }

        const todo = new TodoItem( {
            _author: user,
            text   : text.trim(),
        } )

        await todo.save()

        return {
            id   : todo.id,
            error: null,
        }
    },
} )
