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
                // In case ordering is needed, we could do it like the following:
                //  https://github.com/graphql/graphql-relay-js/issues/20#issuecomment-220494222
                search: {
                    type: GraphQLString,
                },
                hideCompleted: {
                    type: GraphQLBoolean,
                    defaultValue: false,
                },
            },
            resolve : async ( obj, args, ctx, info ) => await TodoLoader.loadTodos( ctx, args ),
        }
    }),
    interfaces  : () => [NodeInterface],
} )
