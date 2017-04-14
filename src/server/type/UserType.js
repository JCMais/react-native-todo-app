// @flow
import {
    GraphQLBoolean,
    GraphQLObjectType,
    GraphQLString,
} from 'graphql'

import {
    globalIdField,
    connectionArgs,
} from 'graphql-relay'

import { NodeInterface } from '../interface/NodeInterface'
import { TodoLoader } from '../loader'
import TodoConnection from '../connection/TodoConnection'

export default new GraphQLObjectType( {
    name        : 'User',
    description : 'User data',
    fields      : () => ({
        id     : globalIdField( 'User' ),
        _id    : {
            type    : GraphQLString,
            resolve : user => user.id,
        },
        name   : {
            type    : GraphQLString,
            resolve : user => user.name,
        },
        email  : {
            type    : GraphQLString,
            resolve : user => user.email,
        },
        active : {
            type    : GraphQLBoolean,
            resolve : user => user.active,
        },
        todos : {
            type: TodoConnection.connectionType,
            args: {
                ...connectionArgs,
                search: {
                    type: GraphQLString,
                },
            },
            resolve : async ( obj, args, ctx, info ) => await TodoLoader.loadTodos( ctx, args ),
        }
    }),
    interfaces  : () => [NodeInterface],
} )
