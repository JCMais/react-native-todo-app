// @flow

import {
    I18nManager,
    Platform,
    StyleSheet,
} from 'react-native'

export default StyleSheet.create( {
    container     : {
        alignItems      : 'center',
        flexDirection   : 'row',
        backgroundColor : 'transparent',
    },
    title         : {
        fontSize     : 17,
        paddingRight : 10,
    },
    icon          : Platform.OS === 'ios'
        ? {
            marginLeft     : 10,
            marginRight    : 22,
            marginVertical : 16,
            transform      : [{scaleX : I18nManager.isRTL ? -1 : 1}],
        }
        : {
            margin     : 18,
            transform  : [{scaleX : I18nManager.isRTL ? -1 : 1}],
        },
    iconWithTitle : Platform.OS === 'ios'
        ? {
            marginRight : 5,
        }
        : {},
} );
