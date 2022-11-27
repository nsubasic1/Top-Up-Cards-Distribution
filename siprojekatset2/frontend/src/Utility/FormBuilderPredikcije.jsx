import React, { useEffect, useState } from "react"
import { Modal, Form, Button } from "react-bootstrap";
import { dajIndexZaVrijednost, dajVrijednostiZaValutu } from "../Utility/StabloUI";
import { getChildrenSum, getIndexFromValuta } from "./DistributivnaMreza";


export default function Forma(prop) {
    const { data, brDana, valutaVrijednosti, setValutaMain, node, isPredictingStanje, setIsPredictingStanja, setPrikaziGraf } = prop;
    const [valuta, setValuta] = useState("BAM")

    const dajNizZaValutu = (v) => {
        if (v === 'BAM') return data.predikcijebam;
        else if (v === 'EUR') return data.predikcijeeur;
        else if (v === 'USD') return data.predikcijeusd;
        else if (v === 'HRK') return data.predikcijehrk;
        else if (v === 'GBP') return data.predikcijegbp;
    }

    useEffect(() => {
        refreshVrijednosti(valuta)
    }, [brDana])

    const refreshVrijednosti = (valuta) => {
        setValuta(valuta)
        setValutaMain(valuta)
    }

    const mapirajPoljaZaVrijednost = (valutaVrijednost, val) => {
        if (data == null) return;

        var niz = dajNizZaValutu(val);
        var mapirano = valutaVrijednost.map((v, index) => {
            return (
                <><Form.Label>Kartica od {v} {valuta}: {niz[index][brDana]}</Form.Label> <br/></>
            )
        })
        var parovi = []
        for(var i = 0; i < mapirano.length; i++) {
            parovi.push(mapirano[i])
        }
        return (
            <div>
                <Form.Group className="mb-3" controlId="formBasicOpis">
                    {parovi}
                </Form.Group>
            </div>
        );
    }

    const odabirVrijednosti = () => {
        if (valuta === 'BAM') {
            return mapirajPoljaZaVrijednost(dajVrijednostiZaValutu('BAM', valutaVrijednosti), 'BAM');
        }
        else if (valuta === "EUR") {
            return mapirajPoljaZaVrijednost(dajVrijednostiZaValutu('EUR', valutaVrijednosti), 'EUR');
        }
        else if (valuta === "USD") {
            return mapirajPoljaZaVrijednost(dajVrijednostiZaValutu('USD', valutaVrijednosti), 'USD');
        }
        else if (valuta === "HRK") {
            return mapirajPoljaZaVrijednost(dajVrijednostiZaValutu('HRK', valutaVrijednosti), 'HRK');
        }
        else if (valuta === "GBP") {
            return mapirajPoljaZaVrijednost(dajVrijednostiZaValutu('GBP', valutaVrijednosti), 'GBP');
        }
    }

    const dajPredikciju = () => {
        var niz = dajNizZaValutu(node.kasavaluta)
        var vrijednosti = dajVrijednostiZaValutu(node.kasavaluta, valutaVrijednosti)
        var index = dajIndexZaVrijednost(vrijednosti, node.kasavrijednost)
        return niz[index][brDana]
    }

    const generisiPredikcijeStanja = () => {
        return (<div> Ok </div>)
    }

    return (
        <Form>
            <Form.Group className="mb-3" controlId="formBasicOpis">
                { node.kasavaluta == null &&
                <div className='pt-3' >
                    <div className="row">
                        <div className="col">
                            {node.type != 'Kasa' && <Form.Group className="mb-3" controlid="formBasicOpis">
                                <Form.Label> Tip predikcije </Form.Label>
                                <Form.Select
                                    className="custom-select"
                                    value={isPredictingStanje}
                                    onChange={(e) => {
                                        setPrikaziGraf(false)
                                        setIsPredictingStanja(e.target.value === 'true')
                                    }}>
                                    <option value={false}> Predikcija transakcija </option>
                                    <option value={true}> Predikcija stanja </option>
                                </Form.Select>
                            </Form.Group>}
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
                    {/* isPredictingStanje ? generisiPredikcijeStanja() : odabirVrijednosti() */}
                </div>}
                {
                    node.kasavaluta != null &&
                    <div className="row">
                        <div className="col">
                            <Form.Group className="mb-3" controlid="formBasicOpis">
                                <Form.Label>Kartica od {node.kasavaluta + node.kasavrijednost}: {dajPredikciju()}</Form.Label>
                            </Form.Group>
                        </div>
                    </div>
                }
            </Form.Group>
        </Form>
    )
}