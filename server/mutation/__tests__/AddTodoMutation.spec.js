import { graphql } from 'graphql'
import {
    clearDatabase,
    connectToDatabase,
    createTestLoggedUser,
    getContext,
} from '../../../test/helper'

import errors from '../../../common/errors'
import { schema } from '../../schema'

beforeEach( async () => await connectToDatabase() )
afterEach( async () => await clearDatabase() )

it( 'should require a logged user', async () => {

    //language=GraphQL
    const query = `
        mutation M( $text: String! ) {
            AddTodo(input: {
                clientMutationId: "1"
                text: $text
            }) {
                clientMutationId
                todoEdge {
                    node {
                        text
                    }
                }
                error
            }
        }`

    const rootValue = {}
    const context   = getContext()
    const variables = {
        text: 'Awesome todo',
    }

    const result = await graphql( schema, query, rootValue, context, variables )

    const {data, errors: graphqlErrors} = result

    expect( data.AddTodo ).toBe( null )
    expect( graphqlErrors ).toHaveLength( 1 )
    expect( graphqlErrors[0].message ).toBe( errors.INVALID_USER )
} )

it( 'should not allow invalid text', async () => {

    const loggedUser = await createTestLoggedUser()

    //language=GraphQL
    const query = `
        mutation M( $text: String! ) {
            AddTodo(input: {
                clientMutationId: "1"
                text: $text
            }) {
                clientMutationId
                todoEdge {
                    node {
                        text
                    }
                }
                error
            }
        }`

    const rootValue = {}
    const context   = getContext( loggedUser )
    const variables = {
        text: '      \u0000',
    }

    const result = await graphql( schema, query, rootValue, context, variables )

    const {AddTodo} = result.data

    expect( AddTodo.todoEdge ).toBe( null )
    expect( AddTodo.error ).toBe( errors.INVALID_TODO_TEXT )
} )

it( 'should add the todo to the logged user', async () => {

    const loggedUser = await createTestLoggedUser()

    //language=GraphQL
    const query = `
        mutation M( $text: String! ) {
            AddTodo(input: {
                clientMutationId: "1"
                text: $text
            }) {
                clientMutationId
                todoEdge {
                    node {
                        text
                    }
                }
                error
            }
        }`

    const rootValue = {}
    const context   = getContext( loggedUser )
    const variables = {
        text: "Awesome todo.",
    }

    const result = await graphql( schema, query, rootValue, context, variables )

    const {AddTodo} = result.data

    expect( AddTodo.error ).toBe( null )
    expect( AddTodo.todoEdge ).toBeDefined()
    expect( AddTodo.todoEdge.node.text ).toBe( variables.text )
} )
