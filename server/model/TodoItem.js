// @flow
import mongoose from 'mongoose'

const Schema = new mongoose.Schema( {
    _author : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text : {
        type     : String,
        required : true,
    },
    completedAt : Date,
    color : String,
    order : {
        type: Number,
        default: 0,
    },
}, {
    timestamps : true,
} )

export default mongoose.model( 'TodoItem', Schema )
