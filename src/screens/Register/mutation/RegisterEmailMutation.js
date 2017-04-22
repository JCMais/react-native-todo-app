import Relay from 'react-relay'

export default class RegisterEmailMutation extends Relay.Mutation {

    getMutation() {
        return Relay.QL`mutation { RegisterEmail }`;
    }

    getVariables() {
        return { name : this.props.name, email : this.props.email, password : this.props.password };
    }
    getFatQuery() {
        return Relay.QL`
            fragment on RegisterEmailPayload {
                token,
                error
            }
        `;
    }
    getConfigs() {
        return [{
            type: 'REQUIRED_CHILDREN',
            children: [
                Relay.QL`
                    fragment on RegisterEmailPayload {
                        token,
                        error
                    }
                `,
            ],
        }];
    }
}
