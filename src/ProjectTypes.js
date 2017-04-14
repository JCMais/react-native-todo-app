import mongoose from 'mongoose'

export interface UserInterface {
    _id: (mongoose.Types.ObjectId),
    id: string,
    name: string,
    email: string,
    active: boolean,
}

export interface TodoInterface {
    _author : (mongoose.Types.ObjectId),
    _id: (mongoose.Types.ObjectId),
    id: string,
    text: string,
    completedAt: Date,
    color: string,
    order: ?number,
}

export type DataLoaders = {
    UserLoader : DataLoader,
    TodoLoader : DataLoader,
}

export type GraphQLContext = {
    user : UserInterface,
    req  : Object,
    dataLoaders : DataLoaders,
}
