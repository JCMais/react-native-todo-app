import { graphql } from 'graphql'

import errors from '../../../errors'
import { schema } from '../../schema'
import { User } from '../../model'
import { generateToken } from '../../auth'
import { connectToDatabase, clearDatabase, getContext } from '../../../../test/helper'

beforeEach( async () => await connectToDatabase() )
afterEach( async () => await clearDatabase() )

it( 'should not register with the an existing email', async () => {

    const user = new User( {
        name     : 'awesome',
        email    : 'awesome@example.com',
        password : 'awesome'
    } )

    await user.save()

    const query = `
    mutation M {
      RegisterEmail(input: {
        clientMutationId: "abc"
        name: "Awesome"
        email: "awesome@example.com"
        password: "awesome"
      }) {
        clientMutationId
        token
        error
      }     
    }`

    const rootValue = {}
    const context   = getContext()

    const result          = await graphql( schema, query, rootValue, context )
    const { RegisterEmail } = result.data

    expect( RegisterEmail.token ).toBe( null )
    expect( RegisterEmail.error ).toBe( errors.EMAIL_ALREADY_IN_USE )
} )

it( 'should create a new user with parameters are valid', async () => {

    const email = 'awesome@example.com'

    const query = `
    mutation M {
      RegisterEmail(input: {
        clientMutationId: "abc"
        name: "Awesome"
        email: "${email}"
        password: "awesome"
      }) {
        clientMutationId
        token
        error
      }     
    }`

    const rootValue = {}
    const context   = getContext()

    const result          = await graphql( schema, query, rootValue, context )
    const { RegisterEmail } = result.data

    const user = await User.findOne( {
        email,
    } )

    expect( user ).not.toBe( null )
    expect( RegisterEmail.token ).toBe( generateToken( user ) )
    expect( RegisterEmail.error ).toBe( null )
} )
