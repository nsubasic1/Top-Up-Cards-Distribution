import React, { useState, useEffect } from "react";
import { Modal, Form, Button} from "react-bootstrap";
import { getIndexFromValuta, updateAtributi } from "../Utility/DistributivnaMreza";
import TimePicker from 'react-bootstrap-time-picker';

export default function ProdajnoMjesto(props) {
    const { node, show, setShown } = props;
    const [atributi, setAtributi] = useState(null);
    const [grad, setGrad] = useState(null);
    const [adresa, setAdresa] = useState(null);
    const [geolokacija, setGeolokacija] = useState(null);
    const [radniDani, setRadniDani] = useState([]);
    const [pocetno, setPocetno] = useState("");
    const [krajnje, setKrajnje] = useState("");
    const [osoba, setOsoba] = useState("");
    const [email, setEmail] = useState("");
    const [telefon, setTelefon] = useState("");
    const [prikazi, setPrikazi] = useState(false);
    const dani = ["Ponedjeljak", "Utorak", "Srijeda", "Cetvrtak", "Petak", "Subota", "Nedjelja"]

    const ponistiPromjene = () => {
        setAtributi(null)
        setShown(false);
    }

    useEffect(() => {
        if(show) {
            povuciAtribute()
        }
    }, [node, show])

    useEffect(() => {
        console.log(radniDani)
        setPrikazi(true)
    }, [radniDani])

    const povuciAtribute = async () => {
        if (node != null) {
            const response = await fetch("api/stablo/cvoratributi");
            var data = await response.json();
            
            data.map((atribut) => {
                if (atribut.cvorid == node.id) {
                    setGrad(atribut.grad);
                    setAdresa(atribut.adresa);
                    setGeolokacija(atribut.geolokacija);
                    setRadniDani([...atribut.radnidani.split(',')]);
                    setPocetno(atribut.radnovrijeme.split('-')[0]);
                    setKrajnje(atribut.radnovrijeme.split('-')[1]);
                    setOsoba(atribut.osoba);
                    setTelefon(atribut.telefonosobe);
                    setEmail(atribut.emailosobe);
                }
            })
            setAtributi(data);
        }
    }

    const izmijeniAtribute = async () => {
        var pronadjen = false;
        var atributiCvora = atributi[0]; //inicijalna vrijednost
        atributi.map((atribut) => {
            if (atribut.cvorid == node.id) {
                atribut.grad = grad;
                atribut.adresa = adresa;
                atribut.geolokacija = geolokacija;
                pronadjen = true;
                var str = ""
                radniDani.map(el => str += el.toString() + ",");
                atribut.radnidani = str.slice(0, -1);
                atribut.radnovrijeme = pocetno + "-" + krajnje;
                atribut.osoba = osoba;
                atribut.telefonosobe = telefon;
                atribut.emailosobe = email;
                atributiCvora = atribut;
            }
        })
        

        if (pronadjen) {
            var response = updateAtributi(atributiCvora);
            console.log("Uslo u update!");
        } else {
            console.log("Van opsega niza!");
        }
        setAtributi(null);
        setShown(false);

    if (pronadjen) {
      var response = updateAtributi(atributiCvora);
      console.log("Uslo u update!");
    } else {
      console.log("Van opsega niza!");
    }
    setShown(false);
  };

    return (

        <Modal show={show} onHide={ponistiPromjene}>
            <Modal.Header closeButton>
                <Modal.Title>Postavke distributivnog centra</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {
                    atributi ? (
                        
                        <Form>
                            <Form.Group className="mb-3" controlId="formBasicRadniDani">
                                <Form.Label>Radni dani:</Form.Label>
                                <Form.Check type="checkbox" label={dani[0]} checked={radniDani[0] == 1} onChange={() => {
                                    let niz = radniDani;
                                    niz[0] = niz[0] == 1 ? 0 : 1;
                                    setRadniDani([...niz]);
                                }} />
                                <Form.Check type="checkbox" label={dani[1]} checked={radniDani[1] == 1} onChange={() => {
                                    let niz = radniDani;
                                    niz[1] = niz[1] == 1 ? 0 : 1;
                                    setRadniDani([...niz]);
                                }} />
                                <Form.Check type="checkbox" label={dani[2]} checked={radniDani[2] == 1} onChange={() => {
                                    let niz = radniDani;
                                    niz[2] = niz[2] == 1 ? 0 : 1;
                                    setRadniDani([...niz]);
                                }} />
                                <Form.Check type="checkbox" label={dani[3]} checked={radniDani[3] == 1} onChange={() => {
                                    let niz = radniDani;
                                    niz[3] = niz[3] == 1 ? 0 : 1;
                                    setRadniDani([...niz]);
                                }} />
                                <Form.Check type="checkbox" label={dani[4]} checked={radniDani[4] == 1} onChange={() => {
                                    let niz = radniDani;
                                    niz[4] = niz[4] == 1 ? 0 : 1;
                                    setRadniDani([...niz]);
                                }} />
                                <Form.Check type="checkbox" label={dani[5]} checked={radniDani[5] == 1} onChange={() => {
                                    let niz = radniDani;
                                    niz[5] = niz[5] == 1 ? 0 : 1;
                                    setRadniDani([...niz]);
                                }} />
                                <Form.Check type="checkbox" label={dani[6]} checked={radniDani[6] == 1} onChange={() => {
                                    let niz = radniDani;
                                    niz[6] = niz[6] == 1 ? 0 : 1;
                                    setRadniDani([...niz]);
                                }} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicRadnoVrijeme">
                                <Form.Label>Radno vrijeme:</Form.Label>
                                <div className="row">
                                    <div className="col-6">
                                        <Form.Label>Pocetak:</Form.Label>
                                        <TimePicker start="07:00" end="21:00" step={30} value={pocetno} format="HH:mm" onChange={(time) => {
                                            var date = new Date(null);
                                            date.setSeconds(time);
                                            setPocetno(date.toISOString().substr(11, 5));
                                        }}/>
                                    </div>
                                    <div className="col-6">
                                        <Form.Label>Kraj:</Form.Label>
                                        <TimePicker start="07:00" end="21:00" step={30} value={krajnje} onChange={(time) => {
                                            var date = new Date(null);
                                            date.setSeconds(time);
                                            setKrajnje(date.toISOString().substr(11, 5));
                                        }} />
                                    </div>
                                    </div>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicOsoba">
                                <Form.Label>Odgovorna osoba:</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ime i prezime"
                                    required
                                    value={osoba}
                                    onChange={(e) => {
                                        setOsoba(e.target.value);
                                    }}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Email:</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="primjer@email.com"
                                    required
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                    }}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicTelefon">
                                <Form.Label>Broj telefona:</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="000-111-222"
                                    required
                                    value={telefon}
                                    onChange={(e) => {
                                        setTelefon(e.target.value);
                                    }}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicGrad">
                                <Form.Label>Grad</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Grad"
                                    required
                                    value={grad}
                                    onChange={(e) => {
                                        setGrad(e.target.value);
                                    }}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicAdresa">
                                <Form.Label>Adresa</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Adresa"
                                    required
                                    value={adresa}
                                    onChange={(e) => {
                                        setAdresa(e.target.value);
                                    }}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicGeolokacija">
                                <Form.Label>Geo-lokacija</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Geolokacija"
                                    required
                                    value={geolokacija}
                                    onChange={(e) => {
                                        setGeolokacija(e.target.value);
                                    }}

                                />
                            </Form.Group>
                        </Form>) : (
                        <h3 className="text-center">Ucitavanje atributa, sacekajte...</h3>
                    )
                }
            </Modal.Body>
            <Modal.Footer>
                {/*<p className="text-danger mx-auto" style={{ marginBottom: "0rem" }}>*/}
                {/*    {message}*/}
                {/*</p>*/}
                <Button variant="secondary" onClick={ponistiPromjene}>
                    Odustani
                </Button>
                <Button onClick={izmijeniAtribute}>
                    Prihvati
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
