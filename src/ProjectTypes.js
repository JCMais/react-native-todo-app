import mongoose from 'mongoose'

export interface UserInterface {
    id: string,
    _id: mongoose.Types.ObjectId,
    name: string,
    email: string,
    active: boolean,
}

export type DataLoaders = {
    User : DataLoader
}

export type GraphQLContext = {
    user : UserInterface,
    req  : Object,
    dataLoaders : DataLoaders
}
