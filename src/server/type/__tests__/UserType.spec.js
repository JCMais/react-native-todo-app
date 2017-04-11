import { graphql } from 'graphql'

import { schema } from '../../schema'
import { User } from '../../model'
import { connectToDatabase, clearDatabase, getContext } from '../../../../test/helper'

beforeEach( async () => await connectToDatabase() )
afterEach( async () => await clearDatabase() )

it( 'should return current logged user', async () => {

    const user = new User( {
        name     : 'user',
        email    : 'user@example.com'
    } )

    await user.save()

    const query = `
    query Q {
        viewer {
            name
            email
        }
    }`

    const rootValue = {}
    const context   = getContext( user )

    const result   = await graphql( schema, query, rootValue, context )

    const { viewer } = result.data

    expect( viewer.name ).toBe( user.name )
    expect( viewer.email ).toBe( user.email )
})
