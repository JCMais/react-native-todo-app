import { AsyncStorage } from 'react-native'

const AUTH_TOKEN_KEY = 'simpleTodo:authToken'

export async function login( jwt ) {
    await AsyncStorage.setItem( AUTH_TOKEN_KEY, jwt )
}

export async function logout() {
    await AsyncStorage.removeItem( AUTH_TOKEN_KEY )
}

export async function getToken() {
    return await AsyncStorage.getItem( AUTH_TOKEN_KEY )
}
