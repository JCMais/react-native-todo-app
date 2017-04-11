// @flow
import Relay from 'react-relay'
import React, { Component } from 'react'
import {
    StyleSheet,
    Text,
    View
} from 'react-native'

import { createRenderer } from '../../util/RelayUtils'
import ViewerQuery from '../../query/ViewerQuery'

// If https://github.com/flowtype/flow-typed/issues/16 is resolved, we can better declare external types, and add the navigation below.
type Props = {
    viewer : {
        email : string
    }
}

class Login extends Component {

    static navigationOptions = {
        header: {
            visible: false,
        }
    }

    constructor( props: Props ) {

        super( props )

        console.log( props )
    }

    render() {

        return (
            <View style={styles.container}>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    }
})

// Create a Relay.Renderer container
export default createRenderer( Login, {
    queries: { ...ViewerQuery },
    fragments: {
        viewer: () => Relay.QL`
            fragment on User {
                email,
            }
        `,
    },

});
