// @flow

import {
    nodeDefinitions,
    fromGlobalId,
} from 'graphql-relay'

import { UserLoader, TodoLoader } from '../loader'
import { TodoType, UserType } from '../type'

const { nodeInterface, nodeField } = nodeDefinitions(

    // A method that maps from a global id to an object
    async ( globalId, ctx ) => {

        const { id, type } = fromGlobalId( globalId )

        if ( type === 'User' ) {

            return await UserLoader.load( ctx, id )
        }

        if ( type === 'Todo' ) {

            return await TodoLoader.load( ctx, id )
        }
    },
    // A method that maps from an object to a type
    ( obj ) => {

        if ( obj instanceof UserLoader ) {

            return UserType
        }

        if ( obj instanceof TodoLoader ) {

            return TodoType
        }
    },
)

export const NodeInterface = nodeInterface
export const NodeField     = nodeField
