// Heavily based on https://github.com/facebook/dataloader/blob/master/examples/RethinkDB.md

function indexResults( results, indexField, cacheKeyFn = key => key ) {

    const indexedResults = new Map()

    results.forEach( res => {
        indexedResults.set( cacheKeyFn( res[indexField] ), res )
    })

    return indexedResults;
}

function normalizeResults( keys, indexField, cacheKeyFn = key => key.toString() ) {

    return results => {

        const indexedResults = indexResults( results, indexField, cacheKeyFn )

        return keys.map( val => {

            return indexedResults.get( cacheKeyFn( val ) ) || new Error( `Key not found : ${val}` )
        })
    }
}

export async function mongooseLoader( model, ids: Array<string> ) {

    const results = await model.find( {_id : {$in : ids}} );

    const result = normalizeResults( ids, '_id' )( results );

    //console.log( 'Mongoose Loader called for Model:\n', model.modelName, '\nWith ids:\n', ids, '\nResult:\n', result )

    return result
}
