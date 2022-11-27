import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { getIndexFromValuta } from "../Utility/DistributivnaMreza";
import { getChildrenSum } from "../Utility/DistributivnaMreza";
import { dajVrijednostiZaValutu, dajIndexZaVrijednost, dajNizZaValutu, iscrtajPoljaZaValutu, daLiJeKasaPrimajuca } from "../Utility/StabloUI";

export default function KasaPromjenaStanja(props) {
    const { node, show, setShown, edit, treeData, setTreeData, valutaVrijednosti } = props;

    const hideModal = (e) => {
        setShown(false);
    };

    const [bamniz, setBamNiz] = useState([]);
    const [eurniz, setEurNiz] = useState([]);
    const [usdniz, setUsdNiz] = useState([]);
    const [hrkniz, setHrkNiz] = useState([]);
    const [gbpniz, setGbpNiz] = useState([]);
    // Potrebno za rerender stranice
    const [rands, setRands] = useState(true);


    const [trenutnoKartica, setTrenutnoKartica] = useState("");
    const [naziv, setNaziv] = useState("default");
    const [opis, setOpis] = useState("");
    const [kasatype, setKasatype] = useState("Prodajna kasa");
    const [message, setMessage] = useState("");
    const [ukupnoKartica, setUkupnoKartica] = useState(0);
    const [ukupnoNovca, setUkupnoNovca] = useState(0);
    const [valuta, setValuta] = useState("");
    const [vrijednostKartice, setVrijednostKartice] = useState(0);

    const [messages, setMessages] = useState([]);

    //Samo jedna vrijednost
    const [stanje, setStanje] = useState(0);

    useEffect(async () => {
        if (show) {
            setMessage("");
            setNaziv(node.title);
            setKasatype(node.kasatype);
            setUkupnoKartica(node.karticeOgranicenje == null ? 0 : node.karticeOgranicenje[getIndexFromValuta(node.kasavaluta)]);
            setUkupnoNovca(node.novacOgranicenje);
            setVrijednostKartice(node.kasavrijednost);

            if (node.kasatype == "Prodajna kasa" || node.kasatype == "Prodajno-primajuća kasa") {
                var nizVrijednosti = dajVrijednostiZaValutu(node.kasavaluta, valutaVrijednosti);
                var index = dajIndexZaVrijednost(nizVrijednosti, node.kasavrijednost);
                var nizTrenutnih = dajNizZaValutu(node.kasavaluta, [node.trenbam, node.treneur, node.trenusd, node.trenhrk, node.trengbp]);
                
                setStanje(nizTrenutnih[index]);
            }
            else if (node.kasatype == "Primajuća kasa" || node.kasatype == "Kasa za oštećene kartice") {
                setBamNiz([...node.trenbam])
                setEurNiz([...node.treneur])
                setUsdNiz([...node.trenusd])
                setHrkNiz([...node.trenhrk])
                setGbpNiz([...node.trengbp])
                setValuta("BAM");
                setMessages(new Array(node.trenbam.length).fill(""));
            }
        }
    }, [show]);

    useEffect(() => {
        if(show) {
            if(daLiJeKasaPrimajuca(node.kasatype)) {
                var temp = dajNizZaValutu(valuta, [bamniz, eurniz, usdniz, hrkniz, gbpniz]);
                setMessages(new Array(temp.length).fill(""));
            }
        }
      }, [valuta])

    const izmijeniStanje = (e) => {
        var prodajnoMjesto = getChildrenSum(treeData, node.parentId, node, valutaVrijednosti);
        if (kasatype == "Prodajna kasa" || kasatype == "Prodajno-primajuća kasa") {
            if(provjeriOgranicenja(prodajnoMjesto)) {
                node.trenbam.fill(0);
                node.treneur.fill(0);
                node.trenusd.fill(0);
                node.trenhrk.fill(0);
                node.trengbp.fill(0);

                var nizVrijednosti = dajVrijednostiZaValutu(node.kasavaluta, valutaVrijednosti);
                var index = dajIndexZaVrijednost(nizVrijednosti, node.kasavrijednost);
                var nizTrenutnih = dajNizZaValutu(node.kasavaluta, [node.trenbam, node.treneur, node.trenusd, node.trenhrk, node.trengbp]);
                nizTrenutnih[index] = stanje;

                setMessage("");
                setShown(false);
            }
        }
        if (kasatype == "Primajuća kasa" || kasatype == "Kasa za oštećene kartice") {
            if(provjeriOgranicenja(prodajnoMjesto)) {
                node.trenbam = [...bamniz];
                node.treneur = [...eurniz];
                node.trenusd = [...usdniz];
                node.trenhrk = [...hrkniz];
                node.trengbp = [...gbpniz];
                setMessage("");
                setShown(false);
            }
        }
    }

    // Funkcija koja provjerava ogranicenja i postavlja poruku
    const provjeriOgranicenja = (prodajnoMjesto) => {
        setMessage("");
        messages.fill("");
        if (kasatype == "Prodajna kasa" || kasatype == "Prodajno-primajuća kasa") {
            // Ogranicenja prodajnog mjesta
            var ogranicenjeKartice = prodajnoMjesto.karticeOgranicenje[getIndexFromValuta(node.kasavaluta)];
            var ogranicenjeNovac = prodajnoMjesto.novacOgranicenje[getIndexFromValuta(node.kasavaluta)];
            // Trenutni broj kartica i novca u prodajnom mjestu za datu valutu
            var nizVrijednosti = dajVrijednostiZaValutu(node.kasavaluta, valutaVrijednosti);
            var nizTrenutnihProdajnogMjesta = dajNizZaValutu(node.kasavaluta, [prodajnoMjesto.trenbam, prodajnoMjesto.treneur, prodajnoMjesto.trenusd, prodajnoMjesto.trenhrk, prodajnoMjesto.trengbp])
            var trenutnoKartica = nizTrenutnihProdajnogMjesta.reduce((prev, curr) => parseInt(prev) + parseInt(curr))
            var trenutnoNovca = 0;
            nizTrenutnihProdajnogMjesta.forEach((e, index) => trenutnoNovca += e * nizVrijednosti[index]);

            // Provjera na ukupan broj kartica prodajnog mjesta
            if(1 * stanje + 1 * trenutnoKartica > 1 * ogranicenjeKartice) {
                setMessage("Ukupan broj kartica prodajnog mjesta prekoracen\n Trenutno stanje je: " + trenutnoKartica + "/" + ogranicenjeKartice);
                return false;
            }

            // Provjera na ukupan novac prodajnog mjesta
            var index = dajIndexZaVrijednost(nizVrijednosti, node.kasavrijednost);
            if(1 * stanje * nizVrijednosti[index] + 1 * trenutnoNovca > 1 * ogranicenjeNovac) {
                setMessage("Ukupan novac prodajnog mjesta prekoracen\n Trenutno stanje je: " + trenutnoNovca + "/" + ogranicenjeNovac + " " + node.kasavaluta);
                return false;
            }

            // Provjera na specificnu karticu prodajnog mjesta
            var nizOgranicenjaZaValutu = dajNizZaValutu(node.kasavaluta, [prodajnoMjesto.ogrbam, prodajnoMjesto.ogreur, prodajnoMjesto.ogrusd, prodajnoMjesto.ogrhrk, prodajnoMjesto.ogrgbp])
            if(1 * stanje + 1 * nizTrenutnihProdajnogMjesta[index] > 1 * nizOgranicenjaZaValutu[index]) {
                setMessage("Ukupan broj kartica ovog tipa u prodajnom mjestu prekoracen\n Trenutno stanje je: " 
                + nizTrenutnihProdajnogMjesta[index] + "/" + nizOgranicenjaZaValutu[index] + "(" + node.kasavrijednost + " " + node.kasavaluta + ")");
                return false;
            }

            // Provjera na broj kartica kase
            if(1 * stanje > 1 * node.karticeOgranicenje[getIndexFromValuta(node.kasavaluta)]) {
                setMessage("Ukupan broj kartica kase prekoracen");
                return false;
            }

            // Provjera na novac kase
            if(1 * stanje * 1 * nizVrijednosti[index] > 1 * node.novacOgranicenje[getIndexFromValuta(node.kasavaluta)]) {
                setMessage("Ukupan novac kase prekoracen");
                return false;
            }

            return true;
        }
        else {
            // Ogranicenja prodajnog mjesta
            var nadmasen = false;
            var ogranicenjeKartice = prodajnoMjesto.karticeOgranicenje[getIndexFromValuta(valuta)];
            var ogranicenjeNovac = prodajnoMjesto.novacOgranicenje[getIndexFromValuta(valuta)];

            // Trenutni broj kartica i novca u prodajnom mjestu za odabranu valutu u dropdown menu
            var nizVrijednosti = dajVrijednostiZaValutu(valuta, valutaVrijednosti); // niz vrijednosti koje valuta poseduje
            var nizTrenutnihProdajnogMjesta = dajNizZaValutu(valuta, [prodajnoMjesto.trenbam, prodajnoMjesto.treneur, prodajnoMjesto.trenusd, prodajnoMjesto.trenhrk, prodajnoMjesto.trengbp]) // trenutna stanja za svaku vrijednost odabrane valute
            var trenutnoKarticaProdajnogMjesta = nizTrenutnihProdajnogMjesta.reduce((prev, curr) => parseInt(prev) + parseInt(curr)) // Ukupan broj kartica za datu valutu
            var trenutnoNovcaProdajnogMjesta = 0;
            nizTrenutnihProdajnogMjesta.forEach((e, index) => trenutnoNovcaProdajnogMjesta += e * nizVrijednosti[index]) // Ukupan broj novca za datu valutu

            var nizTrenutnihKase = dajNizZaValutu(valuta, [bamniz, eurniz, usdniz, hrkniz, gbpniz]); // Trenutne vrijednosti kase (unesene u formi)
            var trenutnoKarticaKase = nizTrenutnihKase.reduce((prev, curr) => parseInt(prev) + parseInt(curr)) // Ukupan broj karica (zbir svih podataka sa forme)
            var trenutnoNovcaKase = 0;
            nizTrenutnihKase.forEach((e, index) => trenutnoNovcaKase += e * nizVrijednosti[index]) // Ukupan novac kase (zbir svih podataka sa forme)

            // Provjera na ukupan broj kartica prodajnog mjesta
            if(1 * trenutnoKarticaKase + 1 * trenutnoKarticaProdajnogMjesta > 1 * ogranicenjeKartice) {
                setMessage("Ukupan broj kartica prodajnog mjesta prekoracen\n Trenutno stanje je: " + trenutnoKarticaProdajnogMjesta + "/" + ogranicenjeKartice);
                return false;
            }

            // Provjera na ukupan novac prodajnog mjesta
            if(1 * trenutnoNovcaKase + 1 * trenutnoNovcaProdajnogMjesta > 1 * ogranicenjeNovac) {
                setMessage("Ukupan novac prodajnog mjesta prekoracen\n Trenutno stanje je: " + trenutnoNovcaProdajnogMjesta + "/" + ogranicenjeNovac + " " + valuta);
                return false;
            }

            // Provjera na svaku specificnu vrijednost kartice
            var nizOgranicenjaZaValutu = dajNizZaValutu(valuta, [prodajnoMjesto.ogrbam, prodajnoMjesto.ogreur, prodajnoMjesto.ogrusd, prodajnoMjesto.ogrhrk, prodajnoMjesto.ogrgbp])
            var prekoracen = false;

            nizTrenutnihKase.forEach((e, index) => {
                if(1 * e + 1 * nizTrenutnihProdajnogMjesta[index] > 1 * nizOgranicenjaZaValutu[index]) {
                    messages[index] = "Prekoracenje kod prodajnog mjesta (" + nizTrenutnihProdajnogMjesta[index] + "/" + nizOgranicenjaZaValutu[index] + ")";
                    prekoracen = true;
                    setRands(!rands);
                }
            })

            if(prekoracen) {
                return false;
            }

            // Provjera na ukupan broja kartica kase
            console.log(1 * trenutnoKarticaKase, 1 * node.karticeOgranicenje[getIndexFromValuta(valuta)])
            if(1 * trenutnoKarticaKase > 1 * node.karticeOgranicenje[getIndexFromValuta(valuta)]) {
                setMessage("Ukupan broj kartica kase prekoracen, maks: " + node.karticeOgranicenje[getIndexFromValuta(valuta)]);
                return false;
            }

            // Provjerva na novac kase
            if(1 * trenutnoNovcaKase > 1 * node.novacOgranicenje[getIndexFromValuta(valuta)]) {
                setMessage("Ukupan novac kase prekoracen, maks: " + node.novacOgranicenje[getIndexFromValuta(valuta)]);
                return false;
            }

            var nizOgranicenjaZaKasu = dajNizZaValutu(valuta, [node.ogrbam, node.ogreur, node.ogrusd, node.ogrhrk, node.ogrgbp])
            nizTrenutnihKase.forEach((e, index) => {
                if(1 * e > 1 * nizOgranicenjaZaKasu[index]) {
                    messages[index] = "Prekoracenje kod kase, maks: " + nizOgranicenjaZaKasu[index];
                    prekoracen = true;
                    setRands(!rands);
                }
            })

            if(prekoracen) {
                return false;
            }

            return true;
        }
    }

    // Funkcija koja pretvara \n u <br>
    const newLine = (text) => {
        if(!text) {
            return "";
        }
        return text.split('\n').map(str => <div> {str} </div>)
    }

    return (
        <Modal show={show} onHide={hideModal}>
            <Modal.Header closeButton>
                <Modal.Title>{node ? "Izmjena stanja " + node.title : ""}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    {(kasatype == "Prodajna kasa" || kasatype == "Prodajno-primajuća kasa") && 
                        <div>{trenutnoKartica}</div> &&
                        <Form.Group className="mb-3" controlId="formBasicOpis">
                            <Form.Label>Broj kartica na stanju</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Broj kartica na stanju"
                                required
                                value={stanje}
                                min={0}
                                max={100000}
                                step={1}
                                onChange={(e) => {
                                    setStanje(e.target.value);
                                }}
                            /></Form.Group>
                    }
                    {(kasatype == "Primajuća kasa" || kasatype == "Kasa za oštećene kartice") &&
                        <div className='pt-3'>
                            <div className="row">
                                <div className="col">
                                    <Form.Group className="mb-3" controlid="formBasicOpis">
                                    <Form.Label>Valuta</Form.Label>
                                    <Form.Select
                                        className="custom-select"
                                        value={valuta}
                                        onChange={(e) => {
                                            var prodajnoMjesto = getChildrenSum(treeData, node.parentId, node, valutaVrijednosti);
                                            if(provjeriOgranicenja(prodajnoMjesto)) {
                                                setValuta(e.target.value);
                                            }
                                        }}
                                    >
                                        <option value="BAM">BAM</option>
                                        <option value="EUR">EUR</option>
                                        <option value="USD">USD</option>
                                        <option value="HRK">HRK</option>
                                        <option value="GBP">GBP</option>
                                    </Form.Select>
                                    </Form.Group>
                                </div>
                            </div>
                            {iscrtajPoljaZaValutu(valuta, valutaVrijednosti, [bamniz, eurniz, usdniz, hrkniz, gbpniz], setRands, true, messages)}
                        </div>
                    }
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <p
                    className="text-danger mx-auto"
                    style={{ marginBottom: "0rem" }}
                >
                    {newLine(message)}
                </p>
                <Button variant="secondary" onClick={hideModal}>
                    Odustani
                </Button>
                <Button onClick={izmijeniStanje}>Prihvati</Button>
            </Modal.Footer>
        </Modal>
    );
}