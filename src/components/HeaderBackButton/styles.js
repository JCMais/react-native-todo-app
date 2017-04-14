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
            height         : 20,
            width          : 12,
            marginLeft     : 10,
            marginRight    : 22,
            marginVertical : 12,
            resizeMode     : 'contain',
            transform      : [{scaleX : I18nManager.isRTL ? -1 : 1}],
        }
        : {
            height     : 24,
            width      : 24,
            margin     : 16,
            resizeMode : 'contain',
            transform  : [{scaleX : I18nManager.isRTL ? -1 : 1}],
        },
    iconWithTitle : Platform.OS === 'ios'
        ? {
            marginRight : 5,
        }
        : {},
} );
