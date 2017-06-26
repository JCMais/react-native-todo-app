import React from 'react'
import { ActivityIndicator, View } from 'react-native'

import Theme from '../../Theme'
import styles from './styles'

export default () =>
    <View style={styles.content}>
        <View style={styles.loading}>
            <ActivityIndicator color={Theme.bgDark} />
        </View>
    </View>
