import { commitMutation, graphql } from 'react-relay'

const mutation = graphql`
    mutation ToggleTodoStatusMutation( $input: ToggleTodoStatusInput! ) {
        ToggleTodoStatus(input: $input) {
            error
            todo {
                id
                completedAt
            }
        }
    }
`

function getOptimisticResponse( completed, todo ) {
    return {
        ToggleTodoStatus: {
            error: null,
            todo: {
                id: todo.id,
                completedAt: completed ? (new Date).toISOString() : null,
            },
        },
    }
}
function commit(
    environment,
    completed,
    todo,
    onCompleted,
    onError,
) {
    return commitMutation(
        environment,
        {
            mutation,
            variables: {
                input: { completed, id: todo.id },
            },
            optimisticResponse: () => getOptimisticResponse( completed, todo ),
            onCompleted,
            onError,
        }
    )
}

export default { commit }
