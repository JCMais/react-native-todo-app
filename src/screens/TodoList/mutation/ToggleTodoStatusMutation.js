import Relay from 'react-relay'

export default class ToggleTodoStatusMutation extends Relay.Mutation {

    static fragments = {
        todo: () => Relay.QL`
            fragment on Todo {
                id
                completedAt
            }
        `
    }

    getMutation() {
        return Relay.QL`mutation {
            ToggleTodoStatus
        }`
    }

    getVariables() {
        return {
            id  : this.props.todo.id,
            completed : this.props.completed,
        }
    }

    getFatQuery() {
        return Relay.QL`
            fragment on ToggleTodoStatusPayload {
                todo {
                    completedAt
                }
                viewer {
                    todos
                }
                error
            }
        `
    }

    getConfigs() {
        return [{
            type: 'FIELDS_CHANGE',
            fieldIDs: {
                todo : this.props.todo.id,
            }
        }, {
            type : 'REQUIRED_CHILDREN',
            children: [
                Relay.QL`
                    fragment on ToggleTodoStatusPayload {
                        error,
                    }
                `,
            ],
        }]
    }

    getOptimisticResponse() {
        return {
            todo: {
                id: this.props.todo.id,
                completedAt: (new Date).toISOString(),
            },
        }
    }
}
