// @flow
import mongoose from 'mongoose'

const Schema = new mongoose.Schema( {
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
