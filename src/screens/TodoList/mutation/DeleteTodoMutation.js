import { commitMutation, graphql } from 'react-relay/compat'
import { ConnectionHandler } from 'relay-runtime'

import { removeUpdater } from '../../../relay/utils'

const mutation = graphql`
    mutation DeleteTodoMutation( $input: DeleteTodoInput! ) {
        DeleteTodo(input: $input) {
            error
            deletedId
        }
    }
`

function sharedUpdater( store, user, deletedIds ) {
    const userProxy = store.get( user.id )
    const conn = ConnectionHandler.getConnection(
        userProxy,
        'TodoList_todos',
    )
    for ( id of deletedIds ) {
        ConnectionHandler.deleteNode(
            conn,
            id,
        )
    }
}

function commit( environment, todosIds, user, onCompleted, onError ) {
    return commitMutation(
        environment,
        {
            mutation,
            variables: {
                input: { id: todosIds },
            },
            updater: ( store ) => {
                const payload = store.getRootField( 'DeleteTodo' )
                removeUpdater( store, user.id, 'TodoList_todos', payload.getValue( 'deletedId' ) )
            },
            optimisticUpdater: ( store ) => {
                removeUpdater( store, user.id, 'TodoList_todos', todosIds )
            },
            onCompleted,
            onError,
        },
    )
}

export default { commit }
