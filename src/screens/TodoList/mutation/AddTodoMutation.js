import Relay from 'react-relay'

export default class AddTodoMutation extends Relay.Mutation {

    static fragments = {
        viewer: () => Relay.QL`
            fragment on User {
                id
            }
        `,
    }

    getMutation() {
        return Relay.QL`mutation {
            AddTodo
        }`;
    }

    getVariables() {
        return {
            text : this.props.text
        }
    }

    getFatQuery() {
        return Relay.QL`
            fragment on AddTodoPayload {
                todoEdge
                viewer {
                    todos
                }
                error
            }
        `;
    }

    getConfigs() {
        return [{
            type: 'RANGE_ADD',
            parentName: 'viewer',
            parentID: this.props.viewer.id,
            connectionName: 'todos',
            edgeName: 'todoEdge',
            rangeBehaviors: {
                '': 'prepend',
            },
        }, {
            type: 'REQUIRED_CHILDREN',
            children: [Relay.QL`
                fragment on AddTodoPayload {
                    todoEdge
                    error
                }
            `],
        }];
    }
}
