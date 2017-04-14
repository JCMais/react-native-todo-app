// @flow
import {
    GraphQLBoolean,
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt
} from 'graphql'

import {
    globalIdField,
} from 'graphql-relay'

import { NodeInterface } from '../interface/NodeInterface'

export default new GraphQLObjectType( {
    name        : 'Todo',
    description : 'Todo data',
    fields      : () => ({
        id     : globalIdField( 'Todo' ),
        _id    : {
            type    : GraphQLString,
            resolve : todo => todo.id,
        },
        text   : {
            type    : GraphQLString,
            resolve : todo => todo.text,
        },
        completedAt  : {
            type    : GraphQLString,
            resolve : todo => todo.completedAt ? todo.completedAt.toISOString() : null,
        },
        color  : {
            type    : GraphQLString,
            resolve : todo => todo.color,
        },
        order : {
            type    : GraphQLInt,
            resolve : todo => todo.order,
        },
    }),
    interfaces  : () => [NodeInterface],
} )
