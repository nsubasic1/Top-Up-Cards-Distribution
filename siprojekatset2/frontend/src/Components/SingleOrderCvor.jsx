import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const SingleOrder = (props) => {
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showUredi, setShowUredi] = useState(false);
    const [narudzbaObj, setNarudzbaObj] = useState(JSON.parse(JSON.stringify(props.narudzbaObjekat)))

    const confirm = () => setShow(true);
    const handleClose = () => setShow(false);
    const uredi = () => setShowUredi(true);

    const potvrdi = async () => {
        await fetch(
            "api/stablo/updateNarudzba/",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(narudzbaObj)
            }
        )
        props.setNarudzbe(props.narudzbe.map(n => {
            if(n.id == narudzbaObj.id) {
                n = JSON.parse(JSON.stringify(narudzbaObj))
            }
            return n
        }))
        setShowUredi(false)
    }

    const obrisi = async () => {
        console.log("ok")
        setShow(false);
        await fetch("api/stablo/deleteNarudzba/" + props.id, { method: 'DELETE' });
        props.setNarudzbe(props.narudzbe.filter(n=> n.id != props.id))
    }

    const iscrtajDistributivni = () => {
        var polja = [];

        props.valutaVrijednosti.bamvrijednosti.map((vrijednost) => {
            polja.push(<option value={'{ "cijena": "' + vrijednost + '", "valuta":"BAM" }'}>{vrijednost + " BAM"}</option>)
        })
    
        props.valutaVrijednosti.eurvrijednosti.map((vrijednost) => {
            polja.push(<option value={'{ "cijena": "' + vrijednost + '", "valuta":"EUR" }'}>{vrijednost + " EUR"}</option>)
        })

        props.valutaVrijednosti.usdvrijednosti.map((vrijednost) => {
            polja.push(<option value={'{ "cijena": "' + vrijednost + '", "valuta":"USD" }'}>{vrijednost + " USD"}</option>)
        })

        props.valutaVrijednosti.hrkvrijednosti.map((vrijednost) => {
            polja.push(<option value={'{ "cijena": "' + vrijednost + '", "valuta":"HRK" }'}>{vrijednost + " HRK"}</option>)
        })

        props.valutaVrijednosti.gbpvrijednosti.map((vrijednost) => {
            polja.push(<option value={'{ "cijena": "' + vrijednost + '", "valuta":"GBP" }'}>{vrijednost + " GBP"}</option>)
        })

        return polja;
    }


    return (
        <tr key={props.id}>
            <td>{props.id}</td>
            <td>{props.naziv}</td>
            <td>{props.pocetni}</td>
            <td>{props.krajnji}</td>
            <td>{props.tip}</td>
            <td>{props.broj}</td>
            <td>{props.narudzbaTip}</td>
            <td>{/* props.allowEdit && */ props.narudzbaTip == "automatska" ? (
                <div className="row">
                    <div className="col">
                        < Button size="sm" variant="secondary" onClick={uredi}> Uredi</Button>
                    </div>
                    <div className="col">
                        <Button size="sm" variant="secondary" onClick={confirm}>Obrisi</Button>
                    </div>
                </div>) :
                (<></>)
            }</td>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Brisanje narudzbe</Modal.Title>
                </Modal.Header>
                <Modal.Body>Jeste li sigurni da zelite obrisati narudzbu {props.id}?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Zatvori
                    </Button>
                    <Button variant="primary" onClick={obrisi}>
                        Obrisi
                    </Button>
                    <div
                        className="spinner-border mx-3"
                        role="status"
                        style={{ display: loading ? "block" : "none" }}
                    >
                    </div>
                </Modal.Footer>
            </Modal>

            <Modal show={showUredi} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Promjena narudzbe {props.naziv}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicIme" key="1">
                            <Form.Label>Ime narudžbe</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Naziv"
                                value={narudzbaObj.naziv}
                                required
                                onChange={(e) => {
                                    setNarudzbaObj({...narudzbaObj, naziv: e.target.value})
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
                                        value={narudzbaObj.pocetniId}
                                        readOnly={true}
                                    />
                                </Form.Group>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <Form.Group className="mb-3" controlid="formBasicOpis" key="6">
                                    <Form.Label>Primalac narudžbe</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={narudzbaObj.krajnjiId}
                                        readOnly={true}
                                    />
                                </Form.Group>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <Form.Group className="mb-3" controlid="formBasicOpis" key="4">
                                    <Form.Label>Valuta i vrijednost</Form.Label>
                                    <Form.Select
                                        className="custom-select"
                                        onChange={(e) => {
                                            var obj = JSON.parse(e.target.value)
                                            setNarudzbaObj({...narudzbaObj, valuta: obj.valuta, vrijednost: obj.cijena})
                                            narudzbaObj.valuta = obj.valuta;
                                            narudzbaObj.vrijednost = obj.cijena;
                                        }}>
                                        {iscrtajDistributivni()}
                                    </Form.Select>
                                </Form.Group>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col'>
                                <Form.Group className="mb-3" controlId="formBasicOpis">
                                    <Form.Label>Ukupno kartica</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Ukupna količina kartica"
                                        required
                                        step={1}
                                        value={narudzbaObj.brojKartica}
                                        onChange={(e) => {
                                            console.log(e.target.value)
                                            setNarudzbaObj({...narudzbaObj, brojKartica: e.target.value})
                                        }}
                                    />
                                </Form.Group>
                            </div>
                        </div>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowUredi(false)}>
                        Zatvori
                    </Button>
                    <Button variant="primary" onClick={potvrdi}>
                        Potvrdi
                    </Button>
                    <div
                        className="spinner-border mx-3"
                        role="status"
                        style={{ display: loading ? "block" : "none" }}
                    >
                    </div>
                </Modal.Footer>
            </Modal>
        </tr>

    );
}

export default SingleOrder;
