import { graphql } from 'graphql'
import { toGlobalId } from 'graphql-relay'

import { schema } from '../../schema'
import { User } from '../../model'
import { connectToDatabase, clearDatabase } from '../../../test/helper'

beforeEach( async () => await connectToDatabase() )
afterEach( async () => await clearDatabase() )

it( 'should load Viewer', async () => {

    const user = new User( {
        name     : 'user',
        email    : 'user@example.com',
        password : 'user'
    } )

    await user.save()

    const query = `
    query Q {
      node(id: "${toGlobalId( 'Viewer', user._id )}") {
        ... on Viewer {
          me {
             name
          }
        }
      }     
    }
  `

    const rootValue = {}
    const context   = {user}

    const result = await graphql( schema, query, rootValue, context )
    const {node} = result.data

    expect( node.me.name ).toBe( user.name )
} )

it( 'should load User', async () => {

    const user = new User( {
        name  : 'user',
        email : 'user@example.com',
        password : 'pass'
    } )

    await user.save()

    const query = `
    query Q {
      node(id: "${toGlobalId( 'User', user._id )}") {
        ... on User {
          name
        }
      }     
    }
  `

    const rootValue = {}
    const context   = {}

    const result = await graphql( schema, query, rootValue, context )
    const {node} = result.data

    expect( node.name ).toBe( user.name )
} )
