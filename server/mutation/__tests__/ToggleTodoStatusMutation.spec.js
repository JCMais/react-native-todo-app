import { graphql } from 'graphql'
import { toGlobalId } from 'graphql-relay'
import {
    clearDatabase,
    connectToDatabase,
    createTestAnotherUser,
    createTestLoggedUser,
    getContext
} from '../../../test/helper'

import { TodoItem } from '../../model'
import { schema } from '../../schema'

beforeEach( async () => await connectToDatabase() )
afterEach( async () => await clearDatabase() )

it( 'should not modify a todo from another user', async () => {

    const loggedUser  = await createTestLoggedUser()
    const anotherUser = await createTestAnotherUser()

    const anotherUserTodo = new TodoItem({
        _author : anotherUser,
        text    : 'Another user awesome todo.'
    })

    await anotherUserTodo.save()

    //language=GraphQL
    const query = `
        mutation M( $id: ID!, $completed: Boolean! ) {
            ToggleTodoStatus(input: {
                clientMutationId: "1"
                id  : $id,
                completed: $completed
            }) {
                clientMutationId
                todo {
                    completedAt
                }
                error
            }
        }`

    const rootValue = {}
    const context   = getContext( loggedUser )
    const variables = {
        id       : toGlobalId( 'Todo', anotherUserTodo.id ),
        completed: true,
    }

    const result = await graphql( schema, query, rootValue, context, variables )

    const { ToggleTodoStatus } = result.data

    expect( ToggleTodoStatus.todo ).toBe( null )
    expect( ToggleTodoStatus.error ).toBe( null )
} )

it( 'should mark todo as completed on completed = true', async () => {

    const loggedUser = await createTestLoggedUser()

    const todo = new TodoItem({
        _author : loggedUser,
        text    : 'Awesome todo.',
    })

    await todo.save()

    //language=GraphQL
    const query = `
        mutation M( $id: ID!, $completed: Boolean! ) {
            ToggleTodoStatus(input: {
                clientMutationId: "1"
                id  : $id,
                completed: $completed
            }) {
                clientMutationId
                todo {
                    completedAt
                }
                error
            }
        }`

    const rootValue = {}
    const context   = getContext( loggedUser )
    const variables = {
        id       : toGlobalId( 'Todo', todo.id ),
        completed: true,
    }

    const result = await graphql( schema, query, rootValue, context, variables )

    const {ToggleTodoStatus} = result.data

    expect( ToggleTodoStatus.todo.completedAt ).not.toBeNull()
    expect( ToggleTodoStatus.error ).toBe( null )
} )

it( 'should unmark todo as completed on completed = false', async () => {

    const loggedUser = await createTestLoggedUser()

    const todo = new TodoItem({
        _author : loggedUser,
        text    : 'Awesome todo.',
        completedAt : (new Date)
    })

    await todo.save()

    //language=GraphQL
    const query = `
        mutation M( $id: ID!, $completed: Boolean! ) {
            ToggleTodoStatus(input: {
                clientMutationId: "1"
                id  : $id,
                completed: $completed
            }) {
                clientMutationId
                todo {
                    completedAt
                }
                error
            }
        }`

    const rootValue = {}
    const context   = getContext( loggedUser )
    const variables = {
        id       : toGlobalId( 'Todo', todo.id ),
        completed: false,
    }

    const result = await graphql( schema, query, rootValue, context, variables )

    const {ToggleTodoStatus} = result.data

    expect( ToggleTodoStatus.todo.completedAt ).toBeNull()
    expect( ToggleTodoStatus.error ).toBe( null )
} )
