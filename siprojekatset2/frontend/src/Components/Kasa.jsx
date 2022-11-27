import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { getIndexFromValuta } from "../Utility/DistributivnaMreza";
import { mapirajVrijednostiDropDown, dajVrijednostiZaValutu, daLiJeKasaPrimajuca } from "../Utility/StabloUI";

export default function Kasa(props) {
    const { node, show, setShown, edit, treeData, setTreeData, valutaVrijednosti } = props;

    const hideModal = (e) => {
        setShown(false);
    };

    const dodajKasu = async (e) => {
        var novi = {}
        novi.id = Math.max.apply(Math, node.children.map(c => c.id)) + 1
        novi.parentId = node.id
        novi.children = []
        novi.childrenId = null


        novi.karticeOgranicenje = new Array(5).fill(0)
        novi.novacOgranicenje = new Array(5).fill(0)

        novi.ogrbam = [...bamniz]
        novi.ogreur = [...eurniz]
        novi.ogrusd = [...usdniz]
        novi.ogrhrk = [...hrkniz]
        novi.ogrgbp = [...gbpniz]

        novi.trenbam = new Array(bamniz.length).fill(0);
        novi.treneur = new Array(eurniz.length).fill(0);
        novi.trenusd = new Array(usdniz.length).fill(0);
        novi.trenhrk = new Array(hrkniz.length).fill(0);
        novi.trengbp = new Array(gbpniz.length).fill(0);

        novi.kasatype = kasatype;
        if (kasatype === "Prodajna kasa" || kasatype === "Prodajno-primajuća kasa") {
            novi.karticeOgranicenje[getIndexFromValuta(valuta)] = ukupnoKartica;;
            novi.novacOgranicenje[getIndexFromValuta(valuta)] = ukupnoNovca;
            novi.kasavaluta = valuta;
            novi.kasavrijednost = vrijednostKartice;
        }
        else {
            novi.ogrbam = [...bamniz]
            novi.ogreur = [...eurniz]
            novi.ogrusd = [...usdniz]
            novi.ogrhrk = [...hrkniz]
            novi.ogrgbp = [...gbpniz]
            novi.karticeOgranicenje = [...ukupnoKarticaNiz];
            novi.novacOgranicenje = [...ukupnoNovcaNiz];
        }

        novi.type = "Kasa"
        novi.title = naziv
        novi.subtitle = opis
        if (node.children == null) {
            node.children = []
        }
        node.children.push(novi)
        setTreeData([treeData[0]])
        setShown(false);
    };

    const izmijeniKasu = (e) => {
        node.kasatype = kasatype;
        if (!daLiJeKasaPrimajuca(kasatype)) {
            node.karticeOgranicenje[getIndexFromValuta(valuta)] = ukupnoKartica;;
            node.novacOgranicenje[getIndexFromValuta(valuta)] = ukupnoNovca;
            node.kasavaluta = valuta;
            node.kasavrijednost = vrijednostKartice;
        }
        else {
            node.ogrbam = [...bamniz]
            node.ogreur = [...eurniz]
            node.ogrusd = [...usdniz]
            node.ogrhrk = [...hrkniz]
            node.ogrgbp = [...gbpniz]
            node.karticeOgranicenje = [...ukupnoKarticaNiz];
            node.novacOgranicenje = [...ukupnoNovcaNiz];
            node.karticeOgranicenje[getIndexFromValuta(valuta)] = ukupnoKartica
            node.novacOgranicenje[getIndexFromValuta(valuta)] = ukupnoNovca;
        }

        node.title = naziv;
        node.subtitle = opis;
        setTreeData([treeData[0]])
        setShown(false);
    }

    const [ukupnoKarticaNiz, setUkupnoKarticaNiz] = useState([0, 0, 0, 0, 0]);
    const [ukupnoNovcaNiz, setUkupnoNovcaNiz] = useState([0, 0, 0, 0, 0]);

    const [bamniz, setBamNiz] = useState([]);
    const [eurniz, setEurNiz] = useState([]);
    const [usdniz, setUsdNiz] = useState([]);
    const [hrkniz, setHrkNiz] = useState([]);
    const [gbpniz, setGbpNiz] = useState([]);
    // Posto se pristupa elementima niza, ovo potrebno za rerender
    const [rands, setRands] = useState(true);

    const [opis, setOpis] = useState("");
    const [kasatype, setKasatype] = useState("Prodajna kasa");
    const [message, setMessage] = useState("");
    const [ukupnoKartica, setUkupnoKartica] = useState(0);
    const [ukupnoNovca, setUkupnoNovca] = useState(0);
    const [valuta, setValuta] = useState("");
    const [vrijednostKartice, setVrijednostKartice] = useState(0);

    const [selectedValue, setSelectedValue] = useState('');
    //Funkcija da mi vrati broj cvorova u bazi kako bih znao novi id 

    const postaviOdabranuVrijednost = (vrijednost) => {
        setSelectedValue(vrijednost);
    }

    const resetFields = () => {
        setUkupnoNovca(0)
        setUkupnoKartica(0)
    }

    const getNaslov = () => (edit ? "Izmjena kase" : "Kreiranje kase");

    const [naziv, setNaziv] = useState("");

    useEffect(() => {
        if (show) {
            if (edit) {
                setKasatype(node.kasatype);
                if(daLiJeKasaPrimajuca(node.kasatype)) {
                    setValuta("BAM");
                    setUkupnoNovca(node.novacOgranicenje == null ? 0 : node.novacOgranicenje[getIndexFromValuta("BAM")])
                    setUkupnoKartica(node.karticeOgranicenje == null ? 0 : node.karticeOgranicenje[getIndexFromValuta("BAM")])

                    setUkupnoKarticaNiz(node.karticeOgranicenje == null ? [0, 0, 0, 0, 0] : [...node.karticeOgranicenje]);
                    setUkupnoNovcaNiz(node.novacOgranicenje == null ? [0, 0, 0, 0, 0] : [...node.novacOgranicenje]);

                    setBamNiz([...node.ogrbam])
                    setEurNiz([...node.ogreur])
                    setUsdNiz([...node.ogrusd])
                    setHrkNiz([...node.ogrhrk])
                    setGbpNiz([...node.ogrgbp])
                }
                else {
                    setValuta(node.kasavaluta)
                    setVrijednostKartice(node.kasavrijednost)
                    setUkupnoNovca(node.novacOgranicenje == null ? 0 : node.novacOgranicenje[getIndexFromValuta(node.kasavaluta)])
                    setUkupnoKartica(node.karticeOgranicenje == null ? 0 : node.karticeOgranicenje[getIndexFromValuta(node.kasavaluta)])
                }

                setNaziv(node.title);
                setOpis(node.subtitle);

            } else {
                setBamNiz(new Array(valutaVrijednosti.bamvrijednosti.length).fill(0))
                setEurNiz(new Array(valutaVrijednosti.eurvrijednosti.length).fill(0))
                setUsdNiz(new Array(valutaVrijednosti.usdvrijednosti.length).fill(0))
                setHrkNiz(new Array(valutaVrijednosti.hrkvrijednosti.length).fill(0))
                setGbpNiz(new Array(valutaVrijednosti.gbpvrijednosti.length).fill(0))

                resetFields()
                setVrijednostKartice(dajVrijednostiZaValutu("BAM", valutaVrijednosti)[0]);
                setNaziv("")
                setOpis("")
                setMessage("")
                setValuta("BAM")
                setNaziv("");
                setOpis("");
            }
        }
    }, [show]);

    const saveValues = () => {
        var temp1 = [...ukupnoKarticaNiz];
        var temp2 = [...ukupnoNovcaNiz];

        temp1[getIndexFromValuta(valuta)] = ukupnoKartica;
        temp2[getIndexFromValuta(valuta)] = ukupnoNovca;

        setUkupnoKarticaNiz([...temp1]);
        setUkupnoNovcaNiz([...temp2]);
    }

    useEffect(() => {
        if(show && (kasatype === "Primajuća kasa" || kasatype === "Kasa za oštećene kartice")) {
            setUkupnoKartica(ukupnoKarticaNiz[getIndexFromValuta(valuta)]);
            setUkupnoNovca(ukupnoNovcaNiz[getIndexFromValuta(valuta)]);
        }
    }, [valuta])

    const dajNizZaValutu = (v) => {
        if(v === 'BAM') return bamniz;
        else if(v === 'EUR') return eurniz;
        else if(v === 'USD') return usdniz;
        else if(v === 'HRK') return hrkniz;
        else if(v === 'GBP') return gbpniz;
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
                            onChange={(e) => {
                                niz[index] = e.target.value;
                                setRands(!rands);
                            }}
                        /></Form.Group>
                </div>
            )
        })
        var parovi = [];
        for(var i = 0; i < mapirano.length; i += 2) {
            if(mapirano[i + 1] != undefined) {
                parovi.push(<div className="row" key={i}> {mapirano[i]} {mapirano[i + 1]} </div>)
            }
            else {
                parovi.push(<div className="row"> {mapirano[i]} </div>)
            }
        }
        return parovi;
    }

    const odabirVrijednosti = () => {
        if(valuta === 'BAM') {
            return mapirajPoljaZaVrijednost(valutaVrijednosti.bamvrijednosti, 'BAM');
        }
        else if(valuta === "EUR") {
            return mapirajPoljaZaVrijednost(valutaVrijednosti.eurvrijednosti, 'EUR');
        }
        else if(valuta === "USD") {
            return mapirajPoljaZaVrijednost(valutaVrijednosti.usdvrijednosti, 'USD');
        }
        else if(valuta === "HRK") {
            return mapirajPoljaZaVrijednost(valutaVrijednosti.hrkvrijednosti, 'HRK');
        }
        else if(valuta === "GBP") {
            return mapirajPoljaZaVrijednost(valutaVrijednosti.gbpvrijednosti, 'GBP');
        }
    }

    return (
        <Modal show={show} onHide={hideModal}>
            <Modal.Header closeButton>
                <Modal.Title>{getNaslov()}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicIme">
                        <Form.Label>Naziv kase</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Naziv"
                            required
                            value={naziv}
                            onChange={(e) => {
                                setNaziv(e.target.value);
                            }}
                        />

                        <Form.Label>Opis kase</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Opis"
                            required
                            value={opis}
                            onChange={(e) => {
                                setOpis(e.target.value);
                            }}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicOpis">
                        <Form.Label>Tip kase</Form.Label>
                        <Form.Select
                            className="custom-select"
                            value={kasatype}
                            onChange={(e) => {
                                setKasatype(e.target.value);
                                resetFields();
                            }}>
                            <option value="Prodajna kasa">Prodajna kasa</option>
                            <option value="Primajuća kasa">Primajuća kasa</option>
                            <option value="Prodajno-primajuća kasa">Prodajno-primajuća kasa</option>
                            <option value="Kasa za oštećene kartice">Kasa za oštećene kartice</option>
                        </Form.Select>
                        <Form.Label>Valuta</Form.Label>
                        <Form.Select
                            className="custom-select"
                            value={valuta}
                            onChange={(e) => {
                                saveValues();
                                setValuta(e.target.value);
                            }}>
                            <option value="BAM">BAM</option>
                            <option value="EUR">EUR</option>
                            <option value="USD">USD</option>
                            <option value="HRK">HRK</option>
                            <option value="GBP">GBP</option>
                        </Form.Select>
                        {(kasatype == "Prodajna kasa" || kasatype == "Prodajno-primajuća kasa") &&
                            <>
                                <Form.Label>Vrijednost kartica</Form.Label>
                                <Form.Select
                                    className="custom-select"
                                    value={vrijednostKartice}
                                    onChange={(e) => {
                                        setVrijednostKartice(e.target.value);
                                        setUkupnoNovca(e.target.value * ukupnoKartica)
                                    }}>
                                    {mapirajVrijednostiDropDown(valuta, valutaVrijednosti)}
                                </Form.Select>
                                <div className="pt-3">
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
                                                    onChange={(e) => {
                                                        setUkupnoKartica(e.target.value);
                                                        setUkupnoNovca(e.target.value * vrijednostKartice)
                                                    }}
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
                                                    onChange={(e) => {
                                                        setUkupnoNovca(ukupnoKartica * vrijednostKartice);
                                                    }}
                                                />
                                            </Form.Group>

                                        </div>
                                    </div>
                                </div>
                            </>
                        }
                        {(kasatype === "Primajuća kasa" || kasatype === "Kasa za oštećene kartice") &&
                            
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
                                                    onChange={(e) => {
                                                        setUkupnoKartica(e.target.value);
                                                    }}
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
                                                    onChange={(e) => {
                                                        setUkupnoNovca(e.target.value);
                                                    }}
                                                />
                                            </Form.Group>

                                        </div>
                                    </div>
                                {odabirVrijednosti()}
                            </div>
                        }
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <p
                    className="text-danger mx-auto"
                    style={{ marginBottom: "0rem" }}
                >
                    {message}
                </p>
                <Button variant="secondary" onClick={hideModal}>
                    Odustani
                </Button>
                <Button onClick={edit ? izmijeniKasu : dodajKasu}>Prihvati</Button>
            </Modal.Footer>
        </Modal>
    );
}
