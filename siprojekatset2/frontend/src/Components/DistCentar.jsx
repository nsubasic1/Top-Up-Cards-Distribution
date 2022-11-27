import React, { useEffect, useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { getIndexFromValuta } from "../Utility/DistributivnaMreza";

export default function DistCentar(props) {
    const { node, show, setShown, edit, treeData, setTreeData, valutaVrijednosti } = props;

    const ponistiPromjene = () => {
        setShown(false);
    }
    
    const dodajDC = async (e) => {
        setMessage("")
        var novi = {}
        novi.id = Math.max.apply(Math, node.children.map(c => c.id)) + 1
        novi.parentId = node.id
        novi.children = []
        novi.childrenId = null

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

        novi.karticeOgranicenje = [...ukupnoKarticaNiz]
        novi.novacOgranicenje = [...ukupnoNovcaNiz];

        novi.karticeOgranicenje[getIndexFromValuta(valuta)] = ukupnoKartica;
        novi.novacOgranicenje[getIndexFromValuta(valuta)] = ukupnoNovca;

        novi.title = naziv;
        novi.subtitle = opis;
        novi.type = "Distributivni centar"
        node.children.push(novi)
        setShown(false)
        setTreeData([treeData[0]])
    };

    const editDC = async (e) => {
        node.karticeOgranicenje = [...ukupnoKarticaNiz]
        node.novacOgranicenje = [...ukupnoNovcaNiz];

        node.karticeOgranicenje[getIndexFromValuta(valuta)] = ukupnoKartica;
        node.novacOgranicenje[getIndexFromValuta(valuta)] = ukupnoNovca;

        node.ogrbam = [...bamniz]
        node.ogreur = [...eurniz]
        node.ogrusd = [...usdniz]
        node.ogrhrk = [...hrkniz]
        node.ogrgbp = [...gbpniz]

        node.title = naziv;
        node.subtitle = opis;
        setMessage("");
        setShown(false);
    };

    const [valuta, setValuta] = useState("");
    const [naziv, setNaziv] = useState("");
    const [opis, setOpis] = useState("");
    const [message, setMessage] = useState("");

    const [ukupnoKarticaNiz, setUkupnoKarticaNiz] = useState([0, 0, 0, 0, 0]);
    const [ukupnoNovcaNiz, setUkupnoNovcaNiz] = useState([0, 0, 0, 0, 0]);

    const [bamniz, setBamNiz] = useState([]);
    const [eurniz, setEurNiz] = useState([]);
    const [usdniz, setUsdNiz] = useState([]);
    const [hrkniz, setHrkNiz] = useState([]);
    const [gbpniz, setGbpNiz] = useState([]);
    // Posto se pristupa elementima niza, ovo potrebno za rerender
    const [rands, setRands] = useState(true);


    const [ukupnoKartica, setUkupnoKartica] = useState(0);
    const [ukupnoNovca, setUkupnoNovca] = useState(0);

    useEffect(() => {
        if(show) {
            setValuta("BAM")
            if (edit) {
                setUkupnoNovca(node.novacOgranicenje == null ? 0 : node.novacOgranicenje[getIndexFromValuta(valuta)])
                setUkupnoKartica(node.karticeOgranicenje == null ? 0 : node.karticeOgranicenje[getIndexFromValuta(valuta)])

                setUkupnoKarticaNiz(node.karticeOgranicenje == null ? [0, 0, 0, 0, 0] : [...node.karticeOgranicenje]);
                setUkupnoNovcaNiz(node.novacOgranicenje == null ? [0, 0, 0, 0, 0] : [...node.novacOgranicenje]);

                setBamNiz([...node.ogrbam])
                setEurNiz([...node.ogreur])
                setUsdNiz([...node.ogrusd])
                setHrkNiz([...node.ogrhrk])
                setGbpNiz([...node.ogrgbp])

                setNaziv(node.title);
                setOpis(node.subtitle);
            } else {
                setUkupnoNovca(0)
                setUkupnoKartica(0)

                setUkupnoKarticaNiz([0, 0, 0, 0, 0]);
                setUkupnoNovcaNiz([0, 0, 0, 0, 0]);
                setBamNiz(new Array(valutaVrijednosti.bamvrijednosti.length).fill(0))
                setEurNiz(new Array(valutaVrijednosti.eurvrijednosti.length).fill(0))
                setUsdNiz(new Array(valutaVrijednosti.usdvrijednosti.length).fill(0))
                setHrkNiz(new Array(valutaVrijednosti.hrkvrijednosti.length).fill(0))
                setGbpNiz(new Array(valutaVrijednosti.gbpvrijednosti.length).fill(0))

                setNaziv("")
                setOpis("")
                setMessage("")
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
        if(show) {
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

    const naslov = () =>
        edit ? "Izmjena distributivnog centra" : "Kreiranje distributivnog centra";
    return (
        <Modal show={show} onHide={ponistiPromjene}>
            <Modal.Header closeButton>
                <Modal.Title>{naslov()}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicIme">
                        <Form.Label>Naziv distributivnog centra</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Naziv"
                            required
                            value={naziv}
                            onChange={(e) => {
                                setNaziv(e.target.value);
                            }}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicOpis">
                        <Form.Label>Opis distributivnog centra</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Opis"
                            required
                            value={opis}
                            onChange={(e) => {
                                setOpis(e.target.value);
                            }}
                        />
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

                            <div className="row">
                                <div className = "col">
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
                            {odabirVrijednosti()}
                        </div>
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
                <Button variant="secondary" onClick={ponistiPromjene}>
                    Odustani
                </Button>
                <Button onClick={!edit ? dodajDC : editDC}>Prihvati</Button>
            </Modal.Footer>
        </Modal>
    );
}
