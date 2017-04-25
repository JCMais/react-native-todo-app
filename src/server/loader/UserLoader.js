// @flow
import DataLoader from 'dataloader'
import mongoose from 'mongoose'

import type { UserInterface, GraphQLContext } from '../../ProjectTypes'
import { User as UserModel } from '../model'
import { mongooseLoader } from './helper/mongoose'

export default class User {

    id: string
    _id: mongoose.Types.ObjectId
    name: string
    email: string
    active: boolean

    constructor( data: UserInterface ) {
        ( this: UserInterface ); // http://stackoverflow.com/a/38224059

        this.id   = data.id
        this._id  = data._id
        this.name = data.name
        this.email  = data.email
        this.active = data.active
    }

    static getLoader = () => new DataLoader( async ids => mongooseLoader( UserModel, ids ) )

    static viewerCanSee( viewer : UserInterface, data : UserInterface ) {

        return viewer.id === data.id
    }

    static async load( ctx : GraphQLContext, id ) {

        if ( !id ) return null

        const data = await ctx.dataloaders.UserLoader.load( id )

        if ( !data ) return null

        return User.viewerCanSee( ctx.user, data ) ? new User( data ) : null
    }
}
