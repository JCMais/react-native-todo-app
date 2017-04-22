import mongoose from 'mongoose'

import { User } from '../model'
import { connectToDatabase, clearDatabase } from '../../../test/helper'

import { getUser, generateToken } from '../auth'

const { ObjectId } = mongoose.Types

beforeEach( async () => await connectToDatabase() )
afterEach( async () => await clearDatabase() )

describe( 'getUser', () => {

    it( 'should return an user null when token is null', async () => {

        const token  = null
        const { user } = await getUser( token )

        expect( user ).toBe( null )
    } )

    it( 'should return null when token is invalid', async () => {

        const token  = 'invalid token'
        const { user } = await getUser( token )

        expect( user ).toBe( null )
    } )

    it( 'should return null when token do not represent a valid user', async () => {
        const token  = generateToken( {_id : new ObjectId()} )
        const {user} = await getUser( token )

        expect( user ).toBe( null )
    } )

    it( 'should return user from a valid token', async () => {

        const viewer = new User( {
            name    : 'user',
            email   : 'user@example.com',
            password: 'pass'
        } )

        await viewer.save()

        const token  = generateToken( viewer )
        const {user} = await getUser( token )

        expect( user.name ).toBe( viewer.name )
        expect( user.email ).toBe( viewer.email )
    } )
} )
