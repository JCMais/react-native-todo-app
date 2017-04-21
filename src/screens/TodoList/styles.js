import { StyleSheet } from 'react-native'

import colorPalette from '../../colorPalette'

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
