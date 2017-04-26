// @flow

import { GraphQLObjectType } from 'graphql'

import LoginEmail from '../mutation/LoginEmailMutation'
import RegisterEmail from '../mutation/RegisterEmailMutation'
import ChangePassword from '../mutation/ChangePasswordMutation'
import AddTodo from '../mutation/AddTodoMutation'
import ChangeTodoText from '../mutation/ChangeTodoTextMutation'
import ToggleTodoStatus from '../mutation/ToggleTodoStatusMutation'
import DeleteTodo from '../mutation/DeleteTodoMutation'

export default new GraphQLObjectType( {
    name   : 'Mutation',
    fields : () => ({
        // auth
        RegisterEmail,
        LoginEmail,
        ChangePassword,
        AddTodo,
        ChangeTodoText,
        ToggleTodoStatus,
        DeleteTodo,
    }),
} )
