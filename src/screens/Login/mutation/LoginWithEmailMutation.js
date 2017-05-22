import { commitMutation, graphql } from 'react-relay'

const mutation = graphql`
    mutation LoginWithEmailMutation( $input: LoginEmailInput! ) {
        LoginEmail(input: $input) {
            error
            token
        }
    }
`;

function commit( environment, email, password, onCompleted, onError ) {
    return commitMutation(
        environment,
        {
            mutation,
            variables: {
                input: { email, password },
            },
            onCompleted,
            onError,
        },
    );
}

export default { commit };
