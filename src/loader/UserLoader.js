// @flow
import DataLoader from 'dataloader'
import mongoose from 'mongoose'

import { UserInterface } from '../ProjectTypes'
import { User as UserModel } from '../model'
import ConnectionFromMongoCursor from '../connection/ConnectionFromMongoCursor'

export default class User {

    id: string
    _id: mongoose.Types.ObjectId
    name: string
    email: string
    active: boolean

    static userLoader = new DataLoader( ids => {

        return Promise.all( ids.map( id => UserModel.findOne( {_id : id} ) ) )
    })

    constructor( data: UserInterface, viewer: UserInterface ) {
        ( this: UserInterface ); // http://stackoverflow.com/a/38224059

        this.id   = data.id
        this._id  = data._id
        this.name = data.name

        // you can only see your own email, and your active status
        //console.log( viewer, data, viewer.id === data.id, viewer._id === data._id )
        if ( viewer && viewer._id.equals( data._id ) ) {

            this.email  = data.email
            this.active = data.active
        }
    }

    static viewerCanSee( viewer, data ) {

        // Anyone can se another user
        return true
    }

    static async load( viewer, id ) {

        if ( !id ) return null

        const data = await User.userLoader.load( id )

        if ( !data ) return null

        return User.viewerCanSee( viewer, data ) ? new User( data, viewer ) : null
    }

    static async loadUsers( viewer, args ) {

        const where = args.search ? { name : { $regex : new RegExp( `^${args.search}`, 'ig' ) } } : {}

        const users = UserModel.find( where, { _id : 1 } )

        return ConnectionFromMongoCursor.connectionFromMongoCursor( viewer, users, args, User.load )
    }
}
