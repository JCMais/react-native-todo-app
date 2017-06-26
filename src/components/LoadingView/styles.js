// @flow

import {
    StyleSheet,
} from 'react-native'

import Theme from '../../Theme'

export default StyleSheet.create({
    content: {
        flex: 1,
        alignItems: 'stretch',
        backgroundColor: Theme.bg,
    },
    loading: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
})
