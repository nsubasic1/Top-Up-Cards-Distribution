import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";

export const dajIndexZaVrijednost = (nizVrijednosti, vrijednost) => {
    for(var i = 0; i < nizVrijednosti.length; i++) {
        if(1 * vrijednost == 1 * nizVrijednosti[i]) {
            return i;
        }
    }
}

export const dajNizZaValutu = (v, nizovi) => {
    if(v === 'BAM') return nizovi[0];
    else if(v === 'EUR') return nizovi[1];
    else if(v === 'USD') return nizovi[2];
    else if(v === 'HRK') return nizovi[3];
    else if(v === 'GBP') return nizovi[4];
}

export const dajVrijednostiZaValutu = (valuta, valutaVrijednosti) => {
    if(valutaVrijednosti == null) {
        return;
    }
    switch(valuta) {
        case "BAM":
            return valutaVrijednosti.bamvrijednosti;
        case "EUR":
            return valutaVrijednosti.eurvrijednosti;
        case "USD":
            return valutaVrijednosti.usdvrijednosti;
        case "HRK":
            return valutaVrijednosti.hrkvrijednosti;
        case "GBP":
            return valutaVrijednosti.gbpvrijednosti;
        default:
            return valutaVrijednosti.bamvrijednosti;
    }
}

export const iscrtajPoljaZaValutu = (valuta, valutaVrijednosti, nizovi, setRands, hasMessage = false, messages = []) => {
    var valutaVrijednost = dajVrijednostiZaValutu(valuta, valutaVrijednosti);
    var niz = dajNizZaValutu(valuta, nizovi);
    if(valutaVrijednost == null || niz == null || niz.length == 0) {
        return;
    }
    var mapirano = valutaVrijednost.map((v, index) => {
        return (
            <div className="col">
                <Form.Group className="mb-3" controlId="formBasicOpis">
                    <Form.Label>Kartica od {v} {valuta}</Form.Label>
                    <Form.Control
                        type="number"
                        required
                        value={niz[index]}
                        min={0}
                        max={500000}
                        step={5}
                        onChange={(e) => {
                            niz[index] = e.target.value;
                            setRands((prevState, props) => !prevState);
                        }}
                    />
                        <p className="text-danger mx-auto" style={{ marginBottom: "0rem" }}>
                            {hasMessage && messages[index]}
                        </p>
                    </Form.Group>
            </div>
        )
    })
    var parovi = [];
    for(var i = 0; i < mapirano.length; i += 2) {
        if(mapirano[i + 1] != undefined) {
            parovi.push(<div className="row" key={valuta + i}> {mapirano[i]} {mapirano[i + 1]} </div>)
        }
        else {
            parovi.push(<div className="row" key={valuta + i}> {mapirano[i]} </div>)
        }
    }
    return parovi;
}

export const mapirajVrijednostiDropDown = (valuta, valutaVrijednosti) => {
    if(valutaVrijednosti == undefined) {
        return;
    }
    var vrijednosti = dajVrijednostiZaValutu(valuta, valutaVrijednosti);
    var temp = vrijednosti.map(v => {
        return (<option value={v} key={v + valuta}> {v} </option>)
    })
    return temp;
}

export const vratiVrijednostIndex = (valutaVrijednosti, vrijednost, valuta) => {
    var vrijednosti = dajVrijednostiZaValutu(valuta, valutaVrijednosti);
    for(var i = 0; i < vrijednosti.length; i++) {
        if(parseInt(vrijednost) == parseInt(vrijednosti[i])) {
            return i;
        }
    }
}

export const daLiJeKasaPrimajuca = (kasatype) => {
    if(kasatype === "Primajuća kasa" || kasatype === "Kasa za oštećene kartice") {
        return true;
    }
    else {
        return false;
    }
}