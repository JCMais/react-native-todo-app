import { commitMutation, graphql } from 'react-relay'

const mutation = graphql`
    mutation ChangeTodoTextMutation( $input: ChangeTodoTextInput! ) {
        ChangeTodoText(input: $input) {
            error
            todo {
                id
                text
            }
        }
    }
`

function getOptimisticResponse( text, todo ) {
    return {
        ChangeTodoText: {
            error: null,
            todo: {
                id: todo.id,
                text,
            },
        },
    }
}
function commit(
    environment,
    text,
    todo,
    onCompleted,
    onError,
) {
    return commitMutation(
        environment,
        {
            mutation,
            variables: {
                input: { text, id: todo.id },
            },
            optimisticResponse: () => getOptimisticResponse( text, todo ),
            onCompleted,
            onError,
        }
    )
}

export default { commit }
