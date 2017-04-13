export function isValidEmail( email ) {

    if ( !email ) {
        return false
    }

    // Using the pattern from the HTML5 spec https://www.w3.org/TR/html5/forms.html#valid-e-mail-address
    const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    return re.test( email )
}

export function isValidLength( str, {min = 0, max = Number.MAX_VALUE} ) {

    if ( !str && min ) {

        return false
    }

    return str.length >= min && str.length <= max
}
