import { StyleSheet } from 'react-native'

import colorPalette from '../../../../Theme'

export default StyleSheet.create({
    todoRow : {
        flexDirection: "row",
        justifyContent: "flex-start",
        backgroundColor: colorPalette.bgDark,
        padding: 10,
        shadowColor: '#CCC',
        shadowOpacity: 0.9,
        shadowOffset: {
            width: 5,
            height: 5
        },
        shadowRadius: 5,
        elevation: 5,
    },

    checkbox : {
        marginRight:15,
        borderColor: '#FFF',
    },

    text : {
        color: '#FFF',
        flex: 0.9,
    },

    input : {
        padding: 0,
        flex: 0.9,
        color: '#FFF',
    },
})
