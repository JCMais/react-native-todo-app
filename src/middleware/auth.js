// mostly based on https://github.com/nodkz/react-relay-network-layer/blob/master/src/middleware/auth.js

type AuthMiddlewareOptions = {
    token : Promise<string>,
    tokenRefresh: Function,
    allowEmptyToken: boolean,
    prefix: string,
    header: string,
}

class WrongTokenError extends Error {

    constructor( msg, res = {} ) {

        super( msg );
        this.res  = res;
        this.name = 'WrongTokenError';
    }
}

export default function middleware( opts : AuthMiddlewareOptions = {} ) {

    const {
              token,
              tokenRefresh,
              allowEmptyToken = false,
              prefix          = 'Bearer ',
              header          = 'Authorization',
          } = opts;

    let tokenRefreshInProgress = null

    return ( next ) => ( req ) => {

        return token.then( token => {

            if ( !token ) {

                if ( tokenRefresh && !allowEmptyToken ) {

                    throw new WrongTokenError( 'Token not provided, try fetch new one' );
                }

            } else {

                req.headers[header] = `${prefix}${token}`
            }

            return next( req )

        } ).catch( err => {

            if (
                err &&
                err.fetchResponse &&
                err.fetchResponse.status === 401 &&
                tokenRefresh
            ) {

                throw new WrongTokenError(
                    'Received status 401 from server',
                    err.fetchResponse
                )

            } else {

                throw err
            }

        } ).catch( err => {

            if ( err.name === 'WrongTokenError' ) {

                if ( !tokenRefreshInProgress ) {

                    tokenRefreshInProgress = tokenRefresh( req, err.res ).then( newToken => {
                        tokenRefreshInProgress = null
                        return newToken
                    } )
                }

                return tokenRefreshInProgress.then( newToken => {
                    req.headers[header] = `${prefix}${newToken}`
                    return next( req )
                } )
            }

            throw err;

        } )
    }
}
