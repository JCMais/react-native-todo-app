// @flow
import DataLoader from 'dataloader'
import mongoose from 'mongoose'

import type { TodoInterface, UserInterface, GraphQLContext } from '../../ProjectTypes'
import { TodoItem as TodoModel } from '../model'
import mongooseLoader from './mongooseHelper'
import ConnectionFromMongoCursor from '../connection/ConnectionFromMongoCursor'

export default class Todo {

    _author : mongoose.Types.ObjectId
    _id: mongoose.Types.ObjectId
    id: string
    text: string
    completedAt: Date
    color: string
    order: ?number

    constructor( data: TodoInterface ) {
        (this: TodoInterface); // http://stackoverflow.com/a/38224059

        this._author     = data._author
        this._id         = data._id
        this.id          = data.id
        this.text        = data.text
        this.completedAt = data.completedAt
        data.color       = data.color
        data.order       = data.order
    }

    static getLoader = () => new DataLoader( async ids => mongooseLoader( TodoModel, ids ) )

    static viewerCanSee( viewer: UserInterface, data: TodoInterface ) {

        return data._author.equals( viewer._id )
    }

    static async load( ctx: GraphQLContext, id ) {

        if ( !id ) return null

        const data = await ctx.dataloaders.TodoLoader.load( id )

        if ( !data ) return null

        return Todo.viewerCanSee( ctx.user, data ) ? new Todo( data ) : null
    }

    static async loadTodos( ctx: GraphQLContext, args ) {

        const where = args.search ? { text: { $regex: new RegExp( `^${args.search}`, 'ig' ) } } : {}

        where['_author'] = ctx.user.id

        const todos = TodoModel.find( where, {}, {
            sort:{
                order : 1
            }
        } )

        return ConnectionFromMongoCursor.connectionFromMongoCursor( ctx, todos, args, Todo.load );
    }
}
