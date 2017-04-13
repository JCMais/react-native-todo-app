import { AsyncStorage } from 'react-native'
import RelayStore from './util/RelayStore'
import getNetworkLayer from './util/getNetworkLayer'

export async function login( jwt ) {

    await AsyncStorage.setItem( 'simpleTodo:authToken', jwt )

    console.log( jwt )

    RelayStore.reset( getNetworkLayer() )
}

export async function logout() {

    await AsyncStorage.removeItem( 'simpleTodo:authToken' )

    RelayStore.reset( getNetworkLayer() )

}

