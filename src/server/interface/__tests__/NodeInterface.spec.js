import { graphql } from 'graphql'
import { toGlobalId } from 'graphql-relay'

import { schema } from '../../schema'
import { User, TodoItem } from '../../model'
import { connectToDatabase, clearDatabase, getContext } from '../../../../test/helper'

beforeEach( async () => await connectToDatabase() )
afterEach( async () => await clearDatabase() )

it( 'should load logged User', async () => {

    const user = new User( {
        name  : 'user',
        email : 'user@example.com',
        password : 'pass'
    } )

    await user.save()

    //language=GraphQL
    const query = `
    query Q( $id: ID! ) {
        node( id: $id ) {
            ... on User {
                name
            }
        }     
    }`

    const rootValue = {}
    const context   = getContext( user )
    const variables = {
        id : toGlobalId( 'User', user.id )
    }

    const result = await graphql( schema, query, rootValue, context, variables )
    const {node} = result.data

    expect( node.name ).toBe( user.name )
} )

it( 'should not load not logged User', async () => {

    const loggedUser = new User( {
        name  : 'Logged User',
        email : 'logged-user@example.com'
    } )

    await loggedUser.save()

    const anotherUser = new User( {
        name  : 'Another User',
        email : 'another-user@example.com'
    } )

    await anotherUser.save()

    //language=GraphQL
    const query = `
        query Q( $id: ID! ) {
            node( id: $id ) {
                ... on User {
                    name
                }
            }
        }`

    const rootValue = {}
    const context   = getContext( loggedUser )
    const variables = {
        id : toGlobalId( 'User', anotherUser.id )
    }

    const result = await graphql( schema, query, rootValue, context, variables )
    const {node} = result.data

    expect( node ).toBe( null )
} )

it( 'should return todo of logged user', async () => {

    const loggedUser = new User( {
        name  : 'Logged User',
        email : 'logged-user@example.com'
    } )

    await loggedUser.save()

    const loggedUserTodo = new TodoItem({
        _author : loggedUser,
        text : 'Pass this test!'
    })

    await loggedUserTodo.save()

    //language=GraphQL
    const query = `
        query Q( $id: ID! ) {
            node( id: $id ) {
                id
                ...on Todo {
                    text
                }
            }
        }`

    const rootValue = {}
    const context   = getContext( loggedUser )
    const variables = {
        id : toGlobalId( 'Todo', loggedUserTodo.id )
    }

    const result = await graphql( schema, query, rootValue, context, variables )

    const {node} = result.data

    expect( node.text ).toBe( loggedUserTodo.text )
} )

it( 'should not return todo of non logged user', async () => {

    const loggedUser = new User( {
        name  : 'Logged User',
        email : 'logged-user@example.com'
    } )

    await loggedUser.save()

    const anotherUser = new User( {
        name  : 'Another User',
        email : 'another-user@example.com'
    } )

    await anotherUser.save()

    const anotherUserTodo = new TodoItem({
        _author : anotherUser,
        text : 'Pass this test!'
    })

    await anotherUserTodo.save()

    //language=GraphQL
    const query = `
        query Q( $id: ID! ) {
            node( id: $id ) {
                id
                ...on Todo {
                    text
                }
            }
        }`

    const rootValue = {}
    const context   = getContext( loggedUser )

    const variables = {
        id : toGlobalId( 'Todo', anotherUserTodo.id ),
    }

    const result = await graphql( schema, query, rootValue, context, variables )

    const {node} = result.data

    expect( node ).toBe( null )
} )
