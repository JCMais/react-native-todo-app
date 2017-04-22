// @flow

import {
    I18nManager,
    StyleSheet,
} from 'react-native'

export default StyleSheet.create( {
    container : {
        alignItems      : 'center',
        flexDirection   : 'row',
        backgroundColor : 'transparent',
    },
    icon      : {
        margin    : 18,
        transform : [{scaleX : I18nManager.isRTL ? -1 : 1}],
    },
} );
