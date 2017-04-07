// @flow
import mongoose from 'mongoose';

const {ObjectId} = mongoose.Types;

process.env.NODE_ENV = 'test';

const config = {
    db         : {
        test : 'mongodb://localhost/test',
    },
    connection : null,
};

export async function connectToDatabase() {

    return new Promise( ( resolve, reject ) => {

        if ( config.connection ) {
            return resolve();
        }

        const mongoUri = 'mongodb://localhost/test';

        mongoose.Promise = Promise;

        const options = {
            server : {
                auto_reconnect    : true,
                reconnectTries    : Number.MAX_VALUE,
                reconnectInterval : 1000,
            },
        };

        mongoose.connect( mongoUri, options );

        config.connection = mongoose.connection;

        config.connection
            .once( 'open', resolve )
            .on( 'error', ( e ) => {
                if ( e.message.code === 'ETIMEDOUT' ) {
                    console.log( e );

                    mongoose.connect( mongoUri, options );
                }

                console.log( e );
                reject( e );
            } );
    } );
}

export async function clearDatabase() {

    return mongoose.connection.db.dropDatabase()
}
