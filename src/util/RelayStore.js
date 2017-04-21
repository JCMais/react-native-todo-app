// @flow

// Copied from https://github.com/sibelius/ReactNavigationRelay/blob/master/src/RelayStore.js
import { Environment } from 'react-relay'

import RelayNetworkDebug from 'react-relay/lib/RelayNetworkDebug'

class RelayStore {

    env : Environment

    networkLayer : Object

    taskScheduler : Object

    constructor() {

        this.networkLayer = null
        this.taskScheduler = null

        this.reset()
    }

    reset( networkLayer ) {

        if ( networkLayer !== undefined ) {


            this.networkLayer = networkLayer
        }

        this.env = new Environment()

        if ( this.networkLayer !== null ) {

            this.env.injectNetworkLayer( this.networkLayer )
        }

        if ( this.taskScheduler !== null ) {

            this.env.injectTaskScheduler( this.taskScheduler )
        }

        // Comment/Uncomment the line bellow to enable relay debug (dafult commented)
        // RelayNetworkDebug.init( this.env );
    }

    // Map existing RelayEnvironment methods

    getStoreData() {

        return this.env.getStoreData()
    }

    injectNetworkLayer( networkLayer ) {

        this.networkLayer = networkLayer
        this.env.injectNetworkLayer( networkLayer )
    }

    injectTaskScheduler( taskScheduler ) {

        this.taskScheduler = taskScheduler
        this.env.injectTaskScheduler( taskScheduler )
    }

    primeCache( ...args ) {

        return this.env.primeCache( ...args )
    }

    forceFetch( ...args ) {

        return this.env.forceFetch( ...args )
    }

    read( ...args ) {

        return this.env.read( ...args )
    }

    readAll( ...args ) {

        return this.env.readAll( ...args )
    }

    readQuery( ...args ) {

        return this.env.readQuery( ...args )
    }

    observe( ...args ) {

        return this.env.observe( ...args )
    }

    getFragmentResolver( ...args ) {

        return this.env.getFragmentResolver( ...args )
    }

    applyUpdate = ( ...args ) => {

        return this.env.applyUpdate( ...args )
    }

    commitUpdate = ( ...args ) => {

        return this.env.commitUpdate( ...args )
    }
}

const relayStore = new RelayStore()

export default relayStore
