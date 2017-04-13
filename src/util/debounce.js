// http://underscorejs.org/docs/underscore.html#section-83
export default function debounce( fn, delay = 600, immediate = false ) {

    let timeout, args, context, timestamp, result

    const later = function () {

        const last = Date.now() - timestamp

        if ( last < delay && last >= 0 ) {

            timeout = setTimeout( later, delay - last )

        } else {

            timeout = null

            if ( !immediate ) {

                result = fn.apply( context, args )

                if ( !timeout ) context = args = null
            }
        }
    };

    return function () {

        context     = this
        args        = arguments
        timestamp   = Date.now()
        const shouldCallNow = immediate && !timeout
        if ( !timeout ) timeout = setTimeout( later, delay )
        if ( shouldCallNow ) {
            result  = fn.apply( context, args )
            context = args = null
        }

        return result
    }
}
