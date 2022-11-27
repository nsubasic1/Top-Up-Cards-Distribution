import React, { useEffect, useState } from "react"
import { Modal, Form, Button } from "react-bootstrap";
import { getIndexFromValuta } from "./DistributivnaMreza"
import IzracunajUkupneKartice from "../Utility/IzracunajUkupneKartice"
import IzracunajUkupniNovac from "../Utility/IzracunajUkupniNovac"
import { dajVrijednostiZaValutu } from "../Utility/StabloUI";

export default function Forma({ data }) {
    const [valuta, setValuta] = useState("BAM")
    const [ukupnoKartica, setUkupnoKartica] = useState(0);
    const [ukupnoNovca, setUkupnoNovca] = useState(0);

    const dajNizZaValutu = (v) => {
        if (v === 'BAM') return data.trenbam;
        else if (v === 'EUR') return data.treneur;
        else if (v === 'USD') return data.trenusd;
        else if (v === 'HRK') return data.trenhrk;
        else if (v === 'GBP') return data.trengbp;
    }

    useEffect(() => {
        refreshVrijednosti(valuta)
    }, [data])

    const refreshVrijednosti = (valuta) => {
        setValuta(valuta)
        setUkupnoKartica(IzracunajUkupneKartice(dajNizZaValutu(valuta)))
        setUkupnoNovca(IzracunajUkupniNovac(dajNizZaValutu(valuta), dajVrijednostiZaValutu(valuta, data)))
    }

    const mapirajPoljaZaVrijednost = (valutaVrijednost, val) => {
        var niz = dajNizZaValutu(val);
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
                            max={500}
                            step={5}
                            disabled
                        /></Form.Group>
                </div>
            )
        })
        var parovi = [];
        for (var i = 0; i < mapirano.length; i += 2) {
            if (mapirano[i + 1] != undefined) {
                parovi.push(<div className="row" key={i}> {mapirano[i]} {mapirano[i + 1]} </div>)
            }
            else {
                parovi.push(<div className="row"> {mapirano[i]} </div>)
            }
        }
        return parovi;
    }

    const odabirVrijednosti = () => {
        if (valuta === 'BAM') {
            return mapirajPoljaZaVrijednost(data.bamvrijednosti, 'BAM');
        }
        else if (valuta === "EUR") {
            return mapirajPoljaZaVrijednost(data.eurvrijednosti, 'EUR');
        }
        else if (valuta === "USD") {
            return mapirajPoljaZaVrijednost(data.usdvrijednosti, 'USD');
        }
        else if (valuta === "HRK") {
            return mapirajPoljaZaVrijednost(data.hrkvrijednosti, 'HRK');
        }
        else if (valuta === "GBP") {
            return mapirajPoljaZaVrijednost(data.gbpvrijednosti, 'GBP');
        }
    }

    return (
        <Form>
            <Form.Group className="mb-3" controlId="formBasicOpis">
                <div className='pt-3' >
                    <div className='row'>
                        <div className='col'>
                            <Form.Group className="mb-3" controlId="formBasicOpis">
                                <Form.Label>Ukupno kartica</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Ukupna količina kartica"
                                    required
                                    value={ukupnoKartica}
                                    min={0}
                                    max={500}
                                    step={5}
                                    disabled
                                /></Form.Group>
                        </div>
                        <div className='col'>

                            <Form.Group className="mb-3" controlId="formBasicOpis">
                                <Form.Label>Ukupno novca</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Ukupna količina novca"
                                    required
                                    value={ukupnoNovca}
                                    min={0}
                                    max={100000}
                                    step={10}
                                    disabled
                                />
                            </Form.Group>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <Form.Group className="mb-3" controlid="formBasicOpis">
                                <Form.Label>Valuta</Form.Label>
                                <Form.Select
                                    className="custom-select"
                                    value={valuta}
                                    onChange={(e) => {
                                        refreshVrijednosti(e.target.value)
                                    }}>
                                    <option value="BAM">BAM</option>
                                    <option value="EUR">EUR</option>
                                    <option value="USD">USD</option>
                                    <option value="HRK">HRK</option>
                                    <option value="GBP">GBP</option>
                                </Form.Select>
                            </Form.Group>
                        </div>
                    </div>
                    {odabirVrijednosti()}
                </div>
            </Form.Group>
        </Form>
    )
}