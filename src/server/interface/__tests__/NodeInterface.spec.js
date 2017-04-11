import { graphql } from 'graphql'
import { toGlobalId } from 'graphql-relay'

import { schema } from '../../schema'
import { User } from '../../model'
import { connectToDatabase, clearDatabase, getContext } from '../../../../test/helper'

beforeEach( async () => await connectToDatabase() )
///afterEach( async () => await clearDatabase() )

it( 'should load logged User', async () => {

    const user = new User( {
        name  : 'user',
        email : 'user@example.com',
        password : 'pass'
    } )

    await user.save()

    const query = `
    query Q {
        node(id: "${toGlobalId( 'User', user.id )}") {
            ... on User {
                name
            }
        }     
    }`

    const rootValue = {}
    const context   = getContext( user )

    const result = await graphql( schema, query, rootValue, context )
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

    const query = `
    query Q {
        node(id: "${toGlobalId( 'User', anotherUser.id )}") {
            ... on User {
                name
            }
        }     
    }`

    const rootValue = {}
    const context   = getContext( loggedUser )

    const result = await graphql( schema, query, rootValue, context )
    const {node} = result.data

    expect( node ).toBe( null )
} )
