// @flow

import {
    StyleSheet,
} from 'react-native'

import Theme from '../../Theme';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.bg,
        padding: 20,
        justifyContent: 'center',
    },
    iconContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    icon: {
        fontSize: 90,
        color: Theme.text,
    },
    textContainer: {
        alignItems: 'center',
        marginBottom: 50,
    },
    text: {
        fontSize: 16,
        color: Theme.text,
    },
})
