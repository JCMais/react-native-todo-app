import React, {
    Component,
    PropTypes,
} from 'react'
import {
    Alert,
    Text,
    TextInput,
    TouchableHighlight,
    View,
} from 'react-native'
import Relay from 'react-relay'

import colorPalette from '../../../../colorPalette'
import Checkbox from '../../../../components/Checkbox'
import errors from '../../../../errors'
import ChangeTodoTextMutation from '../../mutation/ChangeTodoTextMutation'
import ToggleTodoStatusMutation from '../../mutation/ToggleTodoStatusMutation'

import styles from './styles'

type Props = {
    todo: Object,
    isSelected: boolean,
    onLongPress: () => void,
    onDoublePress: () => void,
    onPress: () => void,
    onTodoCompletedStatusChanged: () => void,
    delayDoublePress: number,
}

type DefaultProps = {
    delayDoublePress: number,
}

type State = {
    lastPress: number,
    editing: boolean,
    text: string,
}

class Todo extends Component {

    static propTypes = {
        todo                        : PropTypes.object.isRequired,
        onLongPress                 : PropTypes.func,
        onDoublePress               : PropTypes.func,
        onPress                     : PropTypes.func,
        onTodoCompletedStatusChanged: PropTypes.func,
        delayDoublePress            : PropTypes.number,
    }

    static defaultProps = {
        delayDoublePress: 300,
    }

    props: Props

    state: State

    constructor( props ) {

        super( props )

        const {todo} = props

        this.state = {
            lastPress: 0,
            editing  : false,
            text     : todo.text,
        }
    }

    onTodoStatusChange = ( isCompleted ) => {

        this.props.relay.commitUpdate(
            new ToggleTodoStatusMutation( {
                todo     : this.props.todo,
                completed: isCompleted,
            } ),
            {
                onSuccess: response => {

                    const {error} = response.ToggleTodoStatus

                    if ( error ) {

                        Alert.alert(
                            'Oops',
                            'Something went wrong.',
                        )

                    } else {

                        // unfortunately the order cannot be updated without a forceFetch
                        // atleast I could not find a way to do it. Mostly related: https://github.com/facebook/relay/issues/1462
                        this.props.onTodoCompletedStatusChanged && this.props.onTodoCompletedStatusChanged()
                    }
                },
            },
        )
    }

    onPress = () => {

        const now = Date.now()
        const dt  = now - this.state.lastPress

        if ( dt < this.props.delayDoublePress ) {

            this.props.onDoublePress && this.props.onDoublePress( this.props.todo )

            this.setState( ( {editing} ) => ({
                editing: !editing,
            }) )
        }

        this.props.onPress && this.props.onPress( this.props.todo )

        this.setState( {
            lastPress: now,
        } )
    }

    onTodoInputBlur = () => {

        this.setState( {
            editing: false,
        } )

        if ( this.state.text !== this.props.todo.text ) {
            this.props.relay.commitUpdate(
                new ChangeTodoTextMutation( {
                    todo: this.props.todo,
                    text: this.state.text,
                } ),
                {
                    onSuccess: response => {

                        const {error} = response.ChangeTodoText

                        if ( error ) {

                            const msg = error === errors.INVALID_TODO_TEXT ? 'Invalid todo text.' : 'Something went wrong.'

                            Alert.alert(
                                'Oops',
                                msg,
                            )
                        }
                    },
                },
            )
        }
    }

    render() {

        const {todo, isSelected} = this.props

        const {editing} = this.state

        return (
            <TouchableHighlight onLongPress={() => this.props.onLongPress( todo )} onPress={this.onPress}
                                underlayColor={colorPalette.s2}
                                style={[this.styles, {backgroundColor: colorPalette.bg}]}>
                <View style={[styles.todoRow, {backgroundColor: isSelected ? colorPalette.statusBar : colorPalette.bgDark}]}>
                    <Checkbox checked={!!todo.completedAt} checkColor='#FFF' pressColor={colorPalette.s1} style={styles.checkbox}
                              onStateChange={this.onTodoStatusChange}/>
                    { editing
                        ? <TextInput style={styles.input} defaultValue={todo.text} autoFocus={true}
                                     onChangeText={text => this.setState( {text} )} onBlur={this.onTodoInputBlur}
                                     underlineColorAndroid='transparent' width={100} height={20}/>
                        : <Text style={styles.text}>{todo.text}</Text> }
                </View>
            </TouchableHighlight>
        )
    }
}

export default Relay.createContainer( Todo, {
    fragments: {
        todo : () => Relay.QL`
            fragment on Todo {
                id
                text
                completedAt
                ${ChangeTodoTextMutation.getFragment( 'todo' )}
                ${ToggleTodoStatusMutation.getFragment( 'todo' )}
            }
        `,
    },
})
