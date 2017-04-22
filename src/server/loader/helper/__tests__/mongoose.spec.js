import { User } from '../../../model'
import { connectToDatabase, clearDatabase } from '../../../../../test/helper'

import mongooseHelper from '../mongoose'

beforeEach( async () => await connectToDatabase() )
afterEach( async () => await clearDatabase() )

it( 'should retrieve all saved entities and give errors for missing ones', async () => {

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

    // only save user1 and user3
    await user1.save()
    await user3.save()

    const idsToRetrieve = [ user1.id, user2.id, user3.id ]

    const results = await mongooseHelper( User, idsToRetrieve )

    expect( results ).toHaveLength( 3 )
    expect( results[0].id ).toBe( user1.id )
    expect( results[1] ).toBeInstanceOf( Error )
    expect( results[2].id ).toBe( user3.id )
} )
