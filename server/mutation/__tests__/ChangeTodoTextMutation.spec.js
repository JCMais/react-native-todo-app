import { graphql } from 'graphql'
import { toGlobalId } from 'graphql-relay'
import {
    clearDatabase,
    connectToDatabase,
    createTestLoggedUser,
    createTestAnotherUser,
    getContext,
} from '../../../test/helper'

import errors from '../../../common/errors'
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
        mutation M( $id: ID!, $text: String! ) {
            ChangeTodoText(input: {
                clientMutationId: "1"
                id  : $id,
                text: $text
            }) {
                clientMutationId
                todo {
                    text
                }
                error
            }
        }`

    const rootValue = {}
    const context   = getContext( loggedUser )
    const variables = {
        id  : toGlobalId( 'Todo', anotherUserTodo.id ),
        text: 'Modified todo text',
    }

    const result = await graphql( schema, query, rootValue, context, variables )

    const { ChangeTodoText } = result.data

    expect( ChangeTodoText.todo ).toBe( null )
    expect( ChangeTodoText.error ).toBe( null )
} )

it( 'should not allow invalid text', async () => {

    const loggedUser = await createTestLoggedUser()

    const todo = new TodoItem({
        _author : loggedUser,
        text    : 'Awesome todo.',
    })

    await todo.save()

    //language=GraphQL
    const query = `
        mutation M( $id: ID!, $text: String! ) {
            ChangeTodoText(input: {
                clientMutationId: "1"
                id  : $id,
                text: $text
            }) {
                clientMutationId
                todo {
                    text
                }
                error
            }
        }`

    const rootValue = {}
    const context   = getContext( loggedUser )
    const variables = {
        id  : toGlobalId( 'Todo', todo.id ),
        text: '      \u0000',
    }

    const result = await graphql( schema, query, rootValue, context, variables )

    const {ChangeTodoText} = result.data

    expect( ChangeTodoText.todo ).toBe( null )
    expect( ChangeTodoText.error ).toBe( errors.INVALID_TODO_TEXT )
} )

it( 'should change todo text', async () => {

    const loggedUser = await createTestLoggedUser()

    const todo = new TodoItem({
        _author : loggedUser,
        text    : 'Awesome todo.',
    })

    await todo.save()

    //language=GraphQL
    const query = `
        mutation M( $id: ID!, $text: String! ) {
            ChangeTodoText(input: {
                clientMutationId: "1"
                id  : $id,
                text: $text
            }) {
                clientMutationId
                todo {
                    text
                }
                error
            }
        }`

    const rootValue = {}
    const context   = getContext( loggedUser )
    const variables = {
        id  : toGlobalId( 'Todo', todo.id ),
        text: 'New todo text.',
    }

    const result = await graphql( schema, query, rootValue, context, variables )

    const {ChangeTodoText} = result.data

    expect( ChangeTodoText.error ).toBe( null )
    expect( ChangeTodoText.todo.text ).toBe( variables.text )
} )
