import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { getIndexFromValuta, getCvoratributiByCvorId, postCvoratributi } from "../Utility/DistributivnaMreza";

export default function CvorOgranicenjaKartice(props) {
    const { node, show, setShown, valutaVrijednosti } = props;
    const [cvoratributiDB, setCvoratributiDB] = useState({});
    const [minUkupnaVrijednostNiz, setMinUkupnaVrijednostNiz] = useState([0, 0, 0, 0, 0]);
    const [mintUkupnaVrijednostNiz, setMintUkupnaVrijednostNiz] = useState([0, 0, 0, 0, 0]);
    const [minbamniz, setMinBamNiz] = useState([0,0,0,0,0,0]);
    const [mineurniz, setMinEurNiz] = useState([0,0,0,0,0,0]);
    const [minusdniz, setMinUsdNiz] = useState([0,0,0,0,0]);
    const [minhrkniz, setMinHrkNiz] = useState([0,0,0,0,0,0]);
    const [mingbpniz, setMinGbpNiz] = useState([0,0,0,0,0]);
    const [maxbamniz, setMaxBamNiz] = useState([0,0,0,0,0,0]);
    const [maxeurniz, setMaxEurNiz] = useState([0,0,0,0,0,0]);
    const [maxusdniz, setMaxUsdNiz] = useState([0,0,0,0,0]);
    const [maxhrkniz, setMaxHrkNiz] = useState([0,0,0,0,0,0]);
    const [maxgbpniz, setMaxGbpNiz] = useState([0,0,0,0,0]);

    const ponistiPromjene = () => {
        setShown(false);
    }

    const dodajOgranicenja = async (e) => {
        var poruka = "";
        for (var i = 0; i < minbamniz.length; i++) {
            if (1 * maxbamniz[i] < 1 * minbamniz[i]) poruka += "Maksimalni broj kartica iznosa " + valutaVrijednosti.bamvrijednosti[i] + " valute BAM  je manji od minimalne dozvoljene vrijednosti\n"
        }

        for (var i = 0; i < mineurniz.length; i++) {
            if (1 * maxeurniz[i] < 1 * mineurniz[i]) poruka += "Maksimalni broj kartica iznosa " + valutaVrijednosti.eurvrijednosti[i] + " valute EUR  je manji od minimalne dozvoljene vrijednosti\n"
        }

        for (var i = 0; i < minusdniz.length; i++) {
            if (1 * maxusdniz[i] < 1 * minusdniz[i]) poruka += "Maksimalni broj kartica iznosa " + valutaVrijednosti.usdvrijednosti[i] + " valute USD  je manji od minimalne dozvoljene vrijednosti\n"
        }

        for (var i = 0; i < minhrkniz.length; i++) {
            if (1 * maxhrkniz[i] < 1 * minhrkniz[i]) poruka += "Maksimalni broj kartica iznosa " + valutaVrijednosti.hrkvrijednosti[i] + " valute HRK  je manji od minimalne dozvoljene vrijednosti\n"
        }

        for (var i = 0; i < mingbpniz.length; i++) {
            if (1 * maxgbpniz[i] < 1 * mingbpniz[i]) poruka += "Maksimalni broj kartica iznosa " + valutaVrijednosti.gbpvrijednosti[i] + " valute GBP  je manji od minimalne dozvoljene vrijednosti\n"
        }

        if (poruka != "") {
            alert(poruka);
        } else {
            var cvornovi = {
                Id: 0,
                cvorid: node.id,
                radnidani: "aaa",
                radnovrijeme: "111",
                osoba: "aaa",
                telefonosobe: "111",
                emailosobe: "aaa",
                grad: "aaa",
                adresa: "aaa",
                geolokacija: "aaa",
                minbam: minbamniz.join(","),
                mineur: mineurniz.join(","),
                minusd: minusdniz.join(","),
                minhrk: minhrkniz.join(","),
                mingbp: mingbpniz.join(","),
                maxbam: maxbamniz.join(","),
                maxeur: maxeurniz.join(","),
                maxusd: maxusdniz.join(","),
                maxhrk: maxhrkniz.join(","),
                maxgbp: maxgbpniz.join(","),
                minvrijednost: minUkupnaVrijednostNiz.join(","),
                mintransfer: mintUkupnaVrijednostNiz.join(",")
            };

            if (cvoratributiDB != null) {
                cvornovi = cvoratributiDB;
                cvornovi.minbam = minbamniz.join(",");
                cvornovi.mineur = mineurniz.join(",");
                cvornovi.minusd = minusdniz.join(",");
                cvornovi.minhrk = minhrkniz.join(",");
                cvornovi.mingbp = mingbpniz.join(",");
                cvornovi.maxbam = maxbamniz.join(",");
                cvornovi.maxeur = maxeurniz.join(",");
                cvornovi.maxusd = maxusdniz.join(",");
                cvornovi.maxhrk = maxhrkniz.join(",");
                cvornovi.maxgbp = maxgbpniz.join(",");
                cvornovi.minvrijednost = minUkupnaVrijednostNiz.join(",");
                cvornovi.mintransfer = mintUkupnaVrijednostNiz.join(",");
            }

            const responsePost = await postCvoratributi(cvornovi);
            setShown(false);
        }
    }

    const [rands, setRands] = useState(true);

    const [valuta, setValuta] = useState("");
    const [naziv, setNaziv] = useState("");
    const [opis, setOpis] = useState("");
    const [minUkupnaVrijednost, setMinUkupnaVrijednost] = useState(0);
    const [mintUkupnaVrijednost, setMintUkupnaVrijednost] = useState(0);
    const [tipOgranicenjaBrKartica, setTipOgranicenjaBrKartica] = useState("");

    const getNaslov = () =>
        "Postavljanje ograničenja za kartice čvora " + naziv;

    useEffect(async () => {
        if (node == null) return;
        if (show) {
            const response = await getCvoratributiByCvorId(node.id);
            setValuta("BAM")
            setTipOgranicenjaBrKartica("MIN");
            if (response == null) {
                setMinUkupnaVrijednost(0);
                setMintUkupnaVrijednost(0);

                setMinUkupnaVrijednostNiz([0, 0, 0, 0, 0]);
                setMintUkupnaVrijednostNiz([0, 0, 0, 0, 0]);
                setMinBamNiz(new Array(valutaVrijednosti.bamvrijednosti.length).fill(0))
                setMinEurNiz(new Array(valutaVrijednosti.eurvrijednosti.length).fill(0))
                setMinUsdNiz(new Array(valutaVrijednosti.usdvrijednosti.length).fill(0))
                setMinHrkNiz(new Array(valutaVrijednosti.hrkvrijednosti.length).fill(0))
                setMinGbpNiz(new Array(valutaVrijednosti.gbpvrijednosti.length).fill(0))

                setMaxBamNiz(new Array(valutaVrijednosti.bamvrijednosti.length).fill(0))
                setMaxEurNiz(new Array(valutaVrijednosti.eurvrijednosti.length).fill(0))
                setMaxUsdNiz(new Array(valutaVrijednosti.usdvrijednosti.length).fill(0))
                setMaxHrkNiz(new Array(valutaVrijednosti.hrkvrijednosti.length).fill(0))
                setMaxGbpNiz(new Array(valutaVrijednosti.gbpvrijednosti.length).fill(0))
            } else {
                setMinUkupnaVrijednost(response.minvrijednost.split(",")[0]);

                setMinUkupnaVrijednostNiz(response.minvrijednost.split(","));
                setMintUkupnaVrijednost(response.mintransfer.split(",")[0]);

                setMintUkupnaVrijednostNiz(response.mintransfer.split(","));
                setMinBamNiz(response.minbam.split(","))
                setMinEurNiz(response.mineur.split(","))
                setMinUsdNiz(response.minusd.split(","))
                setMinHrkNiz(response.minhrk.split(","))
                setMinGbpNiz(response.mingbp.split(","))

                setMaxBamNiz(response.maxbam.split(","))
                setMaxEurNiz(response.maxeur.split(","))
                setMaxUsdNiz(response.maxusd.split(","))
                setMaxHrkNiz(response.maxhrk.split(","))
                setMaxGbpNiz(response.maxgbp.split(","))
            }
            setNaziv(node.title)
            setCvoratributiDB(response)
        }
    }, [show]);

    const saveValues = () => {
        var temp2 = [...minUkupnaVrijednostNiz];

        var tempt2 = [...mintUkupnaVrijednostNiz];

        temp2[getIndexFromValuta(valuta)] = minUkupnaVrijednost;

        tempt2[getIndexFromValuta(valuta)] = mintUkupnaVrijednost;

        setMinUkupnaVrijednostNiz([...temp2]);

        setMintUkupnaVrijednostNiz([...tempt2]);
    }

    useEffect(() => {
        if (node == null) return;
        if (show) {
            setMinUkupnaVrijednost(minUkupnaVrijednostNiz[getIndexFromValuta(valuta)]);
            setMintUkupnaVrijednost(mintUkupnaVrijednostNiz[getIndexFromValuta(valuta)]);
            setTipOgranicenjaBrKartica("MIN");
        }
    }, [valuta])

    const dajNizZaValutu = (v, tip) => {
        if (tip == "MIN") {
            if (v === 'BAM') return minbamniz;
            else if (v === 'EUR') return mineurniz;
            else if (v === 'USD') return minusdniz;
            else if (v === 'HRK') return minhrkniz;
            else if (v === 'GBP') return mingbpniz;
        }
        if (v === 'BAM') return maxbamniz;
        else if (v === 'EUR') return maxeurniz;
        else if (v === 'USD') return maxusdniz;
        else if (v === 'HRK') return maxhrkniz;
        else if (v === 'GBP') return maxgbpniz;
    }
    const mapirajPoljaZaVrijednost = (valutaVrijednost, val) => {
        var niz = dajNizZaValutu(val, tipOgranicenjaBrKartica);
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
                            step={1}
                            onChange={(e) => {
                                niz[index] = e.target.value;
                                setRands(!rands)
                            }}
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
            return mapirajPoljaZaVrijednost(valutaVrijednosti.bamvrijednosti, 'BAM');
        }
        else if (valuta === "EUR") {
            return mapirajPoljaZaVrijednost(valutaVrijednosti.eurvrijednosti, 'EUR');
        }
        else if (valuta === "USD") {
            return mapirajPoljaZaVrijednost(valutaVrijednosti.usdvrijednosti, 'USD');
        }
        else if (valuta === "HRK") {
            return mapirajPoljaZaVrijednost(valutaVrijednosti.hrkvrijednosti, 'HRK');
        }
        else if (valuta === "GBP") {
            return mapirajPoljaZaVrijednost(valutaVrijednosti.gbpvrijednosti, 'GBP');
        }
    }

    return (
        <Modal show={show} onHide={ponistiPromjene}>
            <Modal.Header closeButton>
                <Modal.Title>{getNaslov()}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicOpis">
                        <div className='pt-3' >
                            <div className='row'>
                                <div className='col'>
                                    <Form.Group className="mb-3" controlId="formBasicOpis">
                                        <Form.Label>Minimalna ukupna vrijednost</Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="Minimalna ukupna vrijednost"
                                            required
                                            value={minUkupnaVrijednost}
                                            step={1}
                                            onChange={(e) => {
                                                setMinUkupnaVrijednost(e.target.value);
                                                minUkupnaVrijednostNiz[0] = e.target.value;
                                            }}
                                        />
                                    </Form.Group>
                                </div>

                                <div className='col'>
                                    <Form.Group className="mb-3" controlId="formBasicOpis">
                                        <Form.Label>Minimalni broj kartica za transfer</Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="Minimalni broj kartica za transfer"
                                            required
                                            value={mintUkupnaVrijednost}
                                            step={1}
                                            onChange={(e) => {
                                                setMintUkupnaVrijednost(e.target.value);
                                                mintUkupnaVrijednostNiz[0] = e.target.value;
                                            }}
                                        />
                                    </Form.Group>
                                </div>

                                <div className="col">
                                    <Form.Group className="mb-3" controlid="formBasicOpis">
                                        <Form.Label>Valuta</Form.Label>
                                        <Form.Select
                                            className="custom-select"
                                            value={valuta}
                                            onChange={(e) => {
                                                saveValues();
                                                setValuta(e.target.value)
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
                            <div className='row'>
                                <div className="col">
                                    <Form.Group className="mb-3" controlid="formBasicOpis">
                                        <Form.Label>Tip ograničenja na broj kartica</Form.Label>
                                        <Form.Select
                                            className="custom-select"
                                            value={tipOgranicenjaBrKartica}
                                            onChange={(e) => {
                                                setTipOgranicenjaBrKartica(e.target.value)
                                            }}>
                                            <option value="MIN">Minimalni broj kartica</option>
                                            <option value="MAX">Maksimalni broj kartica</option>
                                        </Form.Select>
                                    </Form.Group>
                                </div>
                            </div>
                            {odabirVrijednosti()}
                        </div>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={ponistiPromjene}>
                    Odustani
                </Button>
                <Button onClick={dodajOgranicenja}>
                    Prihvati
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
