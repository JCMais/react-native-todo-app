import { StyleSheet } from 'react-native'

import colorPalette from '../../Theme'

export default StyleSheet.create({
    container : {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colorPalette.bg
    },
    todoList : {
        alignSelf: "stretch",
    },
    noTodosMessageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignSelf: 'center',
    },
    noTodosMessage: {
        fontSize: 20,
        color : colorPalette.text,
    },
    todoRow : {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-start",
        margin: 10
    },
    text : {
        color: colorPalette.text
    },
    separator: {
        alignSelf: "stretch",
        height: 1,
        backgroundColor: '#cccccc',
    },
})
