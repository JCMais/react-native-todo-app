// @flow

import {
    GraphQLInt,
} from 'graphql'

import {
    connectionDefinitions,
} from 'graphql-relay'

import { TodoType } from '../type'

export default connectionDefinitions({
    name: 'Todo',
    nodeType: TodoType,
    connectionFields: {
        count: {
            type: GraphQLInt,
        },
    },
});
