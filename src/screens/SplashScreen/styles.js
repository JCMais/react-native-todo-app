import { StyleSheet } from 'react-native'

import colorPalette from '../../Theme'
import color from 'color'

export default StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colorPalette.bg,
    },
    title : {
        fontSize: 23,
        textAlign: 'center',
        marginBottom: 10,
        color: '#FFF',
        alignSelf: 'stretch',
        padding: 10,
        backgroundColor: colorPalette.bgDark,
    },
    errorMessageWrapper : {
        backgroundColor: colorPalette.errorBg,
        padding: 5,
        marginTop: 10,
    },
    fieldInput : {
        fontSize: 20,
        textAlign: 'center',
        margin: 5,
        alignSelf: 'stretch',
        color: colorPalette.s4,
    },
    buttonsWrapper : {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    button : {
        backgroundColor: colorPalette.mainText,
    },
    errorMessage : {
        color: '#FFF',
    }
})
