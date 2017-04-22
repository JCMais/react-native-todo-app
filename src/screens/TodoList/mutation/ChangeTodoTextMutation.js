import Relay from 'react-relay'

export default class ChangeTodoTextMutation extends Relay.Mutation {

    static fragments = {
        todo: () => Relay.QL`
            fragment on Todo {
                id
                text
            }
        `
    }

    getMutation() {
        return Relay.QL`mutation {
            ChangeTodoText
        }`
    }

    getVariables() {
        return {
            id  : this.props.todo.id,
            text: this.props.text
        }
    }

    getFatQuery() {
        return Relay.QL`
            fragment on ChangeTodoTextPayload {
                todo {
                    text
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
                    fragment on ChangeTodoTextPayload {
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
                text: this.props.text,
            },
        }
    }
}
