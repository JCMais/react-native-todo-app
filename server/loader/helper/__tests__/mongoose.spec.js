import { User } from '../../../model'
import { connectToDatabase, clearDatabase } from '../../../../test/helper'

import { mongooseLoader } from '../mongoose'

beforeEach( async () => await connectToDatabase() )
afterEach( async () => await clearDatabase() )

describe( 'mongooseLoader', () => {

    it( 'should retrieve all ids in the correct order', async () => {

        const user1 = new User({
            name : 'User #1',
            email: 'user-1@email.com',
        })

        const user2 = new User({
            name : 'User #2',
            email: 'user-2@email.com',
        })

        const user3 = new User({
            name : 'User #3',
            email: 'user-3@email.com',
        })

        await user1.save()
        await user2.save()
        await user3.save()

        const idsToRetrieve = [ user2.id, user1.id, user3.id ]

        const results = await mongooseLoader( User, idsToRetrieve )

        expect( results ).toHaveLength( 3 )
        expect( results[0].id ).toBe( user2.id )
        expect( results[1].id ).toBe( user1.id )
        expect( results[2].id ).toBe( user3.id )
    } )


    it( 'should give errors for missing ids', async () => {

        const user1 = new User({
            name : 'User #1',
            email: 'user-1@email.com',
        })

        const user2 = new User({
            name : 'User #2',
            email: 'user-2@email.com',
        })

        const user3 = new User({
            name : 'User #3',
            email: 'user-3@email.com',
        })

        await user1.save()
        await user3.save()

        const idsToRetrieve = [ user1.id, user2.id, user3.id ]

        const results = await mongooseLoader( User, idsToRetrieve )

        expect( results ).toHaveLength( 3 )
        expect( results[0].id ).toBe( user1.id )
        expect( results[1] ).toBeInstanceOf( Error )
        expect( results[2].id ).toBe( user3.id )
    } )
})
