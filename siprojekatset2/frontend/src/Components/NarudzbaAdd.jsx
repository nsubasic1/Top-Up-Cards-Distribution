import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { getIndexFromValuta, getNodesFromParentId, getNodeFromId, postNarudzba, getVrijednostiFromDb } from "../Utility/DistributivnaMreza";
import KasaPromjenaStanja from "./KasaPromjenaStanja";

export default function NarudzbaAdd(props) {
    const { node, show, setShown } = props;

    const ponistiPromjene = () => {
        setShown(false);
        setBrojNarudzbi(0);
    }


    const [valuta, setValuta] = useState("");
    const [ukupnoKartica, setUkupnoKartica] = useState(0);
    const [iznos, setIznos] = useState(0);

    const [valute, setValute] = useState([]);
    const [ukupnoKarticas, setUkupnoKarticas] = useState([]);
    const [iznosi, setIznosi] = useState([]);

    const [naziv, setNaziv] = useState("");
    const [opis, setOpis] = useState("");
    const [brojNarudzbi, setBrojNarudzbi] = useState(0);
    const [message, setMessage] = useState("");
    const [dijete, setDijete] = useState(0);
    const [children, setChildren] = useState([]);
    const [childrenOfParent, setChildrenOfParent] = useState([]);
    const [parent, setParent] = useState([]);
    const [nazivPosiljalaca, setNazivPosiljalaca] = useState("");
    const [valutaVrijednost, setValutaVrijednost] = useState([]);

    const prihvatiNarudzbu = async () => {
        var imeNarudzbe = naziv;
        var brojKartica = ukupnoKarticas;
        var cijena = iznosi;
        var valutaKartica = valute;
        var saljeSe = dijete;
        var pocetniIdvar = node.id;

        const narudzbe = new Array(brojNarudzbi);

        for (var i = 0; i < brojNarudzbi; i++) {
           narudzbe[i] = {
                naziv: imeNarudzbe,
                pocetniId: pocetniIdvar,
                krajnjiId: saljeSe,
                valuta: valutaKartica[i],
                vrijednost: iznosi[i],
                brojKartica: brojKartica[i]
            }
        }

        const response = await postNarudzba(narudzbe);
        setShown(false);
        setBrojNarudzbi(0);
    }

    useEffect(async () => {
        if (node == null) return;

        var vrijednostiPolja = await getVrijednostiFromDb();
        setValutaVrijednost(vrijednostiPolja);

        var children = [];
        var djeca = await getNodesFromParentId(node.id);
        if (node.parentId !== null) {
            var djecaOdRoditelja = await getNodesFromParentId(node.parentId);
            setChildrenOfParent(djecaOdRoditelja);
        }

        for (var i = 0; i < djeca.length; i++) {
            if (djeca[i].type != "Kasa")
                children.push(djeca[i]);
        }
        if (node.parentId != null) {
            var roditelj = await getNodeFromId(node.parentId);
            setParent(roditelj);
            children.push(roditelj);
        }
        setDijete(children[0].id);
        setChildren(children);
        setNazivPosiljalaca(node.title);
    }, [show]);

    const iscrtajProdajno = (kasa) => {
        return <option value={'{ "cijena": "' + kasa.kasavrijednost + '", "valuta":"' + kasa.kasavaluta + '" }'}>{kasa.kasavrijednost + " " + kasa.kasavaluta}</option>
    }

    const iscrtajDistributivni = () => {
        var polja = [];

        valutaVrijednost.bamvrijednosti.map((vrijednost) => {
            polja.push(<option value={'{ "cijena": "' + vrijednost + '", "valuta":"BAM" }'}>{vrijednost + " BAM"}</option>)
        })
    
        valutaVrijednost.eurvrijednosti.map((vrijednost) => {
            polja.push(<option value={'{ "cijena": "' + vrijednost + '", "valuta":"EUR" }'}>{vrijednost + " EUR"}</option>)
        })

        valutaVrijednost.usdvrijednosti.map((vrijednost) => {
            polja.push(<option value={'{ "cijena": "' + vrijednost + '", "valuta":"USD" }'}>{vrijednost + " USD"}</option>)
        })

        valutaVrijednost.hrkvrijednosti.map((vrijednost) => {
            polja.push(<option value={'{ "cijena": "' + vrijednost + '", "valuta":"HRK" }'}>{vrijednost + " HRK"}</option>)
        })

        valutaVrijednost.gbpvrijednosti.map((vrijednost) => {
            polja.push(<option value={'{ "cijena": "' + vrijednost + '", "valuta":"GBP" }'}>{vrijednost + " GBP"}</option>)
        })

        return polja;
    }

    const getInfoFromChildren = () => {
        if (show) {
            var krajnji = node.parentId == dijete ? parent : node.children.filter((child) => child.id == dijete)[0];

            if (node.type !== "Prodajno mjesto" && krajnji.type !== "Prodajno mjesto")
                return iscrtajDistributivni();
            else {
                var djeca = node.parentId == dijete ? childrenOfParent : krajnji.children;
                var primajuceOsteceneKaseKrajnji = djeca.filter((child) => child.type == "Kasa" && (child.kasatype == "Primajuća kasa" || child.kasatype == "Kasa za oštećene kartice"));
                var primajuceOsteceneKasePocetni = node.children.filter((child) => child.type == "Kasa" && (child.kasatype == "Primajuća kasa" || child.kasatype == "Kasa za oštećene kartice"));

                if (primajuceOsteceneKasePocetni.length !== 0 || primajuceOsteceneKaseKrajnji.length !== 0)
                    return iscrtajDistributivni();

                var kase = node.type == "Prodajno mjesto" ? node.children : krajnji.children;

                return kase.map((kasa) => {
                    if (kasa.kasatype == "Prodajna kasa" || kasa.kasatype == "Prodajno-primajuća kasa") {
                        return iscrtajProdajno(kasa);
                    }
                })

            }
        }
    }

    const iscrtajPolja = () => {
        var polja = [];

        for (var i = 0; i < brojNarudzbi; i++) {
            polja.push( 
                <div className='row'>
                    <div className='col'>
                        <Form.Group className="mb-3" controlId="formBasicOpis">
                                <Form.Label>Narudžba {i + 1}:</Form.Label>
                        </Form.Group>
                    </div>
                </div>
            )
            polja.push(
                <div className='row'>
                    <div className='col'>
                        <Form.Group className="mb-3" controlId="formBasicOpis">
                            <Form.Label>Ukupno kartica</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Ukupna količina kartica"
                                required
                                min={0}
                                max={500}
                                step={1}
                                onChange={(e) => {
                                    ukupnoKarticas.push(e.target.value);
                                    setUkupnoKarticas(ukupnoKarticas);
                                }}
                            />
                        </Form.Group>
                    </div>
                </div>
            )

            polja.push(
                <div className="row">
                        <div className="col">
                            <Form.Group className="mb-3" controlid="formBasicOpis" key="4">
                                <Form.Label>Valuta i vrijednost</Form.Label>
                                <Form.Select
                                    className="custom-select"
                                    onChange={(e) => {
                                        var obj = JSON.parse(e.target.value)
                                        valute.push(obj.valuta);
                                        iznosi.push(obj.cijena);
                                        setIznosi(iznosi);
                                        setValute(valute);
                                    }}>
                                    {getInfoFromChildren()}
                                </Form.Select>
                            </Form.Group>
                        </div>
                </div>
            )

        }

        return polja;
    }

    return (
        <Modal show={show} onHide={ponistiPromjene}>
            <Modal.Header closeButton>
                <Modal.Title>Kreiranje narudžbe</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicIme" key="1">
                        <Form.Label>Ime narudžbe</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Naziv"
                            required
                            onChange={(e) => {
                                setNaziv(e.target.value);
                            }}
                        />
                    </Form.Group>
                    <div className="row">
                        <div className="col">
                            <Form.Group className="mb-3" controlid="formBasicOpis" key="5">
                                <Form.Label>Pošiljalac narudžbe</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Pošiljalac narudžbe"
                                    onChange={(e) => {
                                        setNaziv(e.target.value);
                                    }}
                                    value={nazivPosiljalaca}
                                    readOnly={true}
                                />
                            </Form.Group>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <Form.Group className="mb-3" controlid="formBasicOpis" key="6">
                                <Form.Label>Primalac narudžbe</Form.Label>
                                <Form.Select
                                    className="custom-select"
                                    onChange={(e) => {
                                        setDijete(e.target.value)
                                    }}>
                                    
                                    {children.map((child) => {
                                        return (<option value={child.id} >{child.title}</option>)
                                    })}
                                </Form.Select>
                            </Form.Group>
                        </div>
                    </div>
                    <Form.Group className="mb-3" controlId="formBasicOpis">
                        <Form.Label>Broj narudžbi</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Broj narudžbi"
                            required
                            step={1}
                            onChange={(e) => {
                                setBrojNarudzbi(e.target.value);
                            }}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicOpis" key="2">
                        <div className='pt-3' >
                            {iscrtajPolja()}
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
                <Button onClick={prihvatiNarudzbu}>
                    Prihvati
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
