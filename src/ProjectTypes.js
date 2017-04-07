import mongoose from 'mongoose'

export interface UserInterface {
    id: string,
    _id: mongoose.Types.ObjectId,
    name: string,
    email: string,
    active: boolean,
}
