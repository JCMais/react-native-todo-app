import color from 'color'

const palette = {
    s0 : '#87A236',
    s1 : '#DFF2A2',
    s2 : '#B1CA65',
    s3 : '#607914',
    s4 : '#3D5100',
}

export default {
    bg : palette.s0,
    bgDark : ( new color( palette.s0 ) ).darken( 0.5 ).rgb().string(),
    text : ( new color( palette.s4 ) ).darken( 0.8 ).rgb().string(),
    textInput : ( new color( palette.s4 ) ).darken( 0.6 ).rgb().string(),
    textInputPlaceholder : ( new color( palette.s4 ) ).alpha( 0.4 ),

    errorBg : '#CC2326',

    ...palette
}
