import { graphql } from 'graphql'

import errors from '../../errors'
import { schema } from '../../schema'
import { User } from '../../model'
import { connectToDatabase, clearDatabase, getContext } from '../../../test/helper'

beforeEach( async () => await connectToDatabase() )
afterEach( async () => await clearDatabase() )

it( 'should not change password of non authorized user', async () => {

    const query = `
    mutation ChangeMyPass {
      ChangePassword(input: {
        clientMutationId: "abc"
        oldPassword: "old"
        password: "new"
      }) {
        clientMutationId
        error
      }     
    }`

    const rootValue = {}
    const context   = getContext()

    const result   = await graphql( schema, query, rootValue, context )

    expect( result.errors.length ).toBe( 1 )
    expect( result.errors[0].message ).toBe( errors.INVALID_USER )
} )

it( 'should not change password if oldPassword is invalid', async () => {

    const user = new User( {
        name     : 'user',
        email    : 'awesome@example.com',
        password : 'awesome',
    } )

    await user.save()

    const query = `
    mutation ChangeMyPass {
      ChangePassword(input: {
        clientMutationId: "abc"
        oldPassword: "old"
        password: "new"
      }) {
        clientMutationId
        error
      }
    }`

    const rootValue = {}
    const context   = getContext( user )

    const result           = await graphql( schema, query, rootValue, context )
    const {ChangePassword} = result.data

    expect( ChangePassword.error ).toBe( errors.INVALID_PASSWORD )
} )

it( 'should change password if oldPassword is correct', async () => {

    const password = 'awesome'

    const user = new User( {
        name     : 'user',
        email    : 'awesome@example.com',
        password
    } )
    await user.save()

    const query = `
    mutation ChangeMyPass {
      ChangePassword(input: {
        clientMutationId: "abc"
        oldPassword: "${password}"
        password: "new"
      }) {
        clientMutationId
        error
      }     
    }`

    const rootValue = {}
    const context   = getContext( user )

    const result           = await graphql( schema, query, rootValue, context )
    const { ChangePassword } = result.data

    expect( ChangePassword.error ).toBe( null )
} )
