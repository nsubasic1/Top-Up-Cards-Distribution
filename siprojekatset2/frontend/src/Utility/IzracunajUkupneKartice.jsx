import React from 'react'

export default function IzracunajUkupneKartice(props) {
    var suma = 0
    for (let i = 0; i < props.length; i++) {
        suma+= props[i]*1
    }
    return suma;
}
