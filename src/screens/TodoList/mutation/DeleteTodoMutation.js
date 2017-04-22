import Relay from 'react-relay'

export default class DeleteTodoMutation extends Relay.Mutation {

    static fragments = {
        viewer: () => Relay.QL`
            fragment on User {
                id
            }
        `,
        todos: () => Relay.QL`
            fragment on TodoConnection {
                edges {
                    node {
                        id
                    }
                }
            }
        `
    }

    getMutation() {
        return Relay.QL`
            mutation {
                DeleteTodo
            }
        `
    }

    getVariables() {
        return {
            id : this.props.selectedTodos
        }
    }

    getFatQuery() {
        return Relay.QL`
            fragment on DeleteTodoPayload {
                viewer {
                    todos( first: 10 ) {
                        count
                    }
                }
                deletedId
                error
            }
        `
    }

    getConfigs() {
        return [
            {
                type               : 'NODE_DELETE',
                parentName         : 'viewer',
                parentID           : this.props.viewer.id,
                connectionName     : 'todos',
                deletedIDFieldName : 'deletedId',
            }
        ]
    }
}
