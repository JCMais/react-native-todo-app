import { commitMutation, graphql } from 'react-relay'

const mutation = graphql`
    mutation RegisterEmailMutation( $input: RegisterEmailInput! ) {
        RegisterEmail(input: $input) {
            error
            token
        }
    }
`;

function commit( environment, name, email, password, onCompleted, onError ) {
    return commitMutation(
        environment,
        {
            mutation,
            variables: {
                input: { name, email, password },
            },
            onCompleted,
            onError,
        },
    );
}

export default { commit };
