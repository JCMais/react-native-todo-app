// @flow

import { GraphQLObjectType } from 'graphql'
import { NodeField } from '../interface/NodeInterface'

import UserLoader from '../loader/UserLoader'
import { UserType } from './'

export default new GraphQLObjectType( {
    name        : 'Query',
    description : 'The root of all... queries',
    fields      : () => ({
        node   : NodeField,
        viewer : {
            type    : UserType,
            args    : {},
            resolve : async ( obj, args, ctx, info ) => await UserLoader.load( ctx, ctx.user ? ctx.user.id : null ),
        },
    }),
} )
