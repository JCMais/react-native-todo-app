// @flow
import mongoose from 'mongoose'
import TodoItem from './TodoItem'

const Schema = new mongoose.Schema( {
    name : {
        type     : String,
        required : true,
    },
    color : String,
    order : {
        type: Number,
        default: 0,
    },
    todos : [TodoItem.schema]
}, {
    timestamps : true,
} )

export default mongoose.model( 'TodoCategory', Schema )
