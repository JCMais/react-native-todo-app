import { StyleSheet } from 'react-native'

import colorPalette from '../../colorPalette'

export default StyleSheet.create({
    container : {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colorPalette.bg
    },
    text : {
        color: colorPalette.text
    },
    separator: {
        height: 1,
        backgroundColor: '#cccccc',
    },
})
