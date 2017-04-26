// @flow

import {
    GraphQLID,
    GraphQLList,
    GraphQLNonNull,
    GraphQLString,
} from 'graphql'
import {
    toGlobalId,
    fromGlobalId,
    mutationWithClientMutationId,
} from 'graphql-relay'

import type { GraphQLContext } from '../../common/ProjectTypes'

import errors from '../../common/errors'
import { TodoItem } from '../model'
import { TodoLoader } from '../loader'
import { UserType } from '../type'

export default mutationWithClientMutationId( {
    name        : 'DeleteTodo',
    inputFields : {
        id : {
            type : new GraphQLList( new GraphQLNonNull( GraphQLID ) ),
        }
    },
    outputFields        : {
        deletedId : {
            type    : new GraphQLList( GraphQLID ),
            resolve : ( { id }, args, ctx, info ) => id.map( id => toGlobalId( 'Todo', id ) ),
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
    mutateAndGetPayload : async ( { id }, ctx : GraphQLContext/*, info*/ ) => {

        const {user} = ctx

        // not logged in
        if ( !user ) {

            throw new Error( errors.INVALID_USER )
        }

        const todosToRemove = []

        // Id is already an array since we defined it as a List,
        //  and per graphql spec, even if it was single item, it would be be coerced to a List with 1 item.
        // http://facebook.github.io/graphql/#sec-Lists
        for ( const todoId of id ) {

            const todo = await TodoLoader.load( ctx, fromGlobalId( todoId ).id )

            if ( todo ) todosToRemove.push( todo )
        }

        const ids = todosToRemove.reduce( ( ids, todo ) => [...ids, todo.id], [] )

        await TodoItem.remove({
            _id : { $in : ids }
        })

        return {
            id : ids,
            error : null
        }
    },
} )
