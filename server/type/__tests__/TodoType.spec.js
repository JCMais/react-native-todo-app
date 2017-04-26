import { graphql } from 'graphql'

import { schema } from '../../schema'
import { User, TodoItem } from '../../model'
import { connectToDatabase, clearDatabase, getContext } from '../../../test/helper'

beforeEach( async () => await connectToDatabase() )
afterEach( async () => await clearDatabase() )

it( 'should return some todos of logged user', async () => {

    const numberOfTodos = 10
    const first = 7
    const loggedUserTodos = []

    const loggedUser = new User( {
        name  : 'Logged User',
        email : 'logged-user@example.com'
    } )

    await loggedUser.save()

    for ( let i = 0; i < numberOfTodos; i++ ) {

        loggedUserTodos.push({
            _author: loggedUser,
            text   : 'Todo ' + i,
        })
    }

    await TodoItem.insertMany( loggedUserTodos )

    //language=GraphQL
    const query = `
    query Q( $first: Int! ) {
        viewer {
            id
            todos( first: $first ) {
                pageInfo {
                    hasNextPage
                    hasPreviousPage
                }
                edges {
                    node {
                        id
                        text
                    }
                    cursor
                }
            }
        }
    }`

    const rootValue = {}
    const context   = getContext( loggedUser )
    const variables = { first }

    const result = await graphql( schema, query, rootValue, context, variables )

    const { todos } = result.data.viewer

    expect( todos.edges ).toHaveLength( first )
    expect( todos.edges[0].node.text ).toBe( loggedUserTodos[0].text )
} )
