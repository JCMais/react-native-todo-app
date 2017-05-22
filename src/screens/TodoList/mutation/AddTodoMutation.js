import { commitMutation, graphql } from 'react-relay/compat'
import { ConnectionHandler } from 'relay-runtime'

const mutation = graphql`
    mutation AddTodoMutation( $input: AddTodoInput! ) {
        AddTodo(input: $input) {
            error
            todoEdge {
                node {
                    id
                    text
                }
            }
        }
    }
`

function sharedUpdater( store, user, newEdge ) {
    const userProxy = store.get( user.id )
    const conn = ConnectionHandler.getConnection(
        userProxy,
        'TodoList_todos',
    )
    ConnectionHandler.insertEdgeAfter( conn, newEdge )
}

let tempID = 0

function commit( environment, text, user, onCompleted, onError ) {
    return commitMutation(
        environment,
        {
            mutation,
            variables: {
                input: { text },
            },
            updater: ( store ) => {
                const payload = store.getRootField( 'AddTodo' )
                const newEdge = payload.getLinkedRecord( 'todoEdge' )
                sharedUpdater( store, user, newEdge )
            },
            optimisticUpdater: ( store ) => {
                const id = 'client:newTodo:' + tempID++
                const node = store.create( id, 'Todo' )

                node.setValue( text, 'text' )
                node.setValue( id, 'id' )

                const newEdge = store.create(
                    'client:newEdge:' + tempID++,
                    'TodoEdge',
                )
                newEdge.setLinkedRecord( node, 'node' )
                sharedUpdater( store, user, newEdge )
            },
            onCompleted,
            onError,
        },
    )
}

export default { commit }
