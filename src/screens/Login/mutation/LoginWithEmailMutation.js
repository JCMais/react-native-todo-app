import Relay from 'react-relay'

export default class LoginWithEmailMutation extends Relay.Mutation {

    getMutation() {
        return Relay.QL`mutation { LoginEmail }`;
    }

    getVariables() {
        return { email : this.props.email, password : this.props.password };
    }
    // Use this method to design a ‘fat query’ – one that represents every
    // field in your data model that could change as a result of this mutation.
    // Liking a story could affect the likers count, the sentence that
    // summarizes who has liked a story, and the fact that the viewer likes the
    // story or not. Relay will intersect this query with a ‘tracked query’
    // that represents the data that your application actually uses, and
    // instruct the server to include only those fields in its response.
    getFatQuery() {
        return Relay.QL`
            fragment on LoginEmailPayload {
                token,
                error,
                viewer
            }
        `;
    }
    getConfigs() {
        return [{
            type: 'REQUIRED_CHILDREN',
            children: [
                Relay.QL`
                    fragment on LoginEmailPayload {
                        token,
                        error
                    }
                `,
            ],
        }];
    }
}
