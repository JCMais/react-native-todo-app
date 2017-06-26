import hoistStatics from 'hoist-non-react-statics'
import type { ReactClass } from 'react'
import React from 'react'
import type {
    GraphQLTaggedNode,
    Variables
} from 'react-relay'
import { QueryRenderer } from 'react-relay'
import { ConnectionHandler } from 'relay-runtime'
import ErrorView from '../components/ErrorView'
import LoadingView from '../components/LoadingView'

import Environment from './environment'

type Config = {
    query: ?GraphQLTaggedNode,
    queriesParams?: ?( props: Object ) => Object,
    variables?: Variables,
}

let i = 0;

export function createQueryRenderer( FragmentComponent: ReactClass<*>,
                                     Component: ReactClass<*>,
                                     config: Config, ): ReactClass<*> {
    const { query, queriesParams } = config;
    const variables = config.variables || {};
    class QueryRendererWrapper extends React.Component {
        render() {
            const queryVariables = queriesParams ? queriesParams( this.props ) : variables;
            return (
                <QueryRenderer
                    environment={Environment}
                    query={query}
                    variables={queryVariables}
                    render={( { error, props, retry } ) => {
                        if ( error ) {
                            return <ErrorView error={error} retry={retry}/>;
                        }

                        if ( props ) {
                            return <FragmentComponent {...this.props} {...props} />;
                        }

                        return <LoadingView />;
                    }}
                />
            );
        }
    }

    return hoistStatics( QueryRendererWrapper, Component )
}

export function removeUpdater( store, parentId, connectionName, deletedID ) {
    const connection = ConnectionHandler.getConnection(
        store.get( parentId ),
        connectionName,
    )

    if ( Array.isArray( deletedID ) ) {
        for ( id of deletedID ) {
            ConnectionHandler.deleteNode(
                connection,
                id,
            )
        }
    } else {
        ConnectionHandler.deleteNode(
            connection,
            deletedID,
        )
    }
}
