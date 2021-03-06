// @flow
import type { UserInterface } from '../common/ProjectTypes'

import jwt from 'jsonwebtoken'
import { User } from './model'
import { jwtSecret } from './config'

export async function getUser( token: string ) {

    if ( !token ) {
        return {user : null}
    }

    try {

        const decodedToken = jwt.verify( token.substring( 4 ), jwtSecret )

        const user = await User.findOne( {_id : decodedToken.id} )

        return {
            user,
        }

    } catch ( err ) {
        return { user : null }
    }
}

export function generateToken( user: UserInterface ) {
    return `JWT ${jwt.sign( { id : user.id }, jwtSecret )}`
}
