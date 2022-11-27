import React from 'react'

export default function IzracunajUkupniNovac(props, brojevi) {
    var suma = 0
    for (let i = 0; i < props.length; i++) {
        suma += props[i] * brojevi[i]*1
    }
    return suma
}
