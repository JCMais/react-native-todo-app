import { graphql } from 'graphql'
import {
    toGlobalId,
} from 'graphql-relay'
import {
    clearDatabase,
    connectToDatabase,
    createTestLoggedUser,
    createTestAnotherUser,
    getContext,
} from '../../../../test/helper'

import errors from '../../../errors'
import { TodoItem } from '../../model'
import { schema } from '../../schema'

beforeEach( async () => await connectToDatabase() )
afterEach( async () => await clearDatabase() )

it( 'should only delete the todo of the logged user', async () => {

    const loggedUser  = await createTestLoggedUser()
    const anotherUser = await createTestAnotherUser()

    const loggedUserTodo = new TodoItem({
        _author: loggedUser,
        text   : 'Logged user todo.',
    })

    const anotherUserTodo = new TodoItem({
        _author : anotherUser,
        text    : 'Another user awesome todo.',
    })

    await loggedUserTodo.save()
    await anotherUserTodo.save()

    //language=GraphQL
    const query = `
        mutation M( $id: [ID!] ) {
            DeleteTodo(input: {
                clientMutationId: "1"
                id  : $id
            }) {
                clientMutationId
                deletedId
                error
            }
        }`

    const rootValue = {}
    const context   = getContext( loggedUser )
    const variables = {
        id  : [toGlobalId( 'Todo', loggedUserTodo.id ), toGlobalId( 'Todo', anotherUserTodo.id )],
    }

    const result = await graphql( schema, query, rootValue, context, variables )

    const { DeleteTodo } = result.data

    expect( DeleteTodo.deletedId ).toHaveLength( 1 )
    expect( DeleteTodo.deletedId[0] ).toBe( variables.id[0] )
    expect( DeleteTodo.error ).toBe( null )
} )
