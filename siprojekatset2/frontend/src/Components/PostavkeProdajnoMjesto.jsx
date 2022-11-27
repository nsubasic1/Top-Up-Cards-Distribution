import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import {
  getIndexFromValuta,
  updateAtributi,
} from "../Utility/DistributivnaMreza";

export default function ProdajnoMjesto(props) {
  const { node, show, setShown } = props;
  const [atributi, setAtributi] = useState(null);
  const [grad, setGrad] = useState(null);
  const [adresa, setAdresa] = useState(null);
  const [geolokacija, setGeolokacija] = useState("");
  const ponistiPromjene = () => {
    setShown(false);
  };

  useEffect(() => {
    povuciAtribute();
  }, [node]);

    const povuciAtribute = async () => {
        if (node != null) {
            const response = await fetch("api/stablo/cvoratributi");
            var data = await response.json();
            setAtributi(data);
            data.map((atribut) => {
                if (atribut.cvorid == node.id) {
                    setGrad(atribut.grad);
                    setAdresa(atribut.adresa);
                    setGeolokacija(atribut.geolokacija);
                }
            })
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
        atributiCvora = atribut;
      }
    });

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
        <Modal.Title>Postavke prodajnog mjesta</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {atributi ? (
          <Form>
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
            <Form.Group className="mb-3" controlId="formBasicGeolokacijaSirina">
              <Form.Label>Geografska širina: </Form.Label>
              <Form.Control
                type="text"
                placeholder="Geografska širina"
                required
                value={geolokacija.split(",")[0]}
                onChange={(e) => {
                  setGeolokacija(
                    e.target.value + "," + geolokacija.split(",")[1]
                  );
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicGeolokacijaVisina">
              <Form.Label>Geografska dužina: </Form.Label>
              <Form.Control
                type="text"
                placeholder="Geografska dužina"
                required
                value={geolokacija.split(",")[1]}
                onChange={(e) => {
                  setGeolokacija(
                    geolokacija.split(",")[0] + "," + e.target.value
                  );
                }}
              />
            </Form.Group>
          </Form>
        ) : (
          <h3 className="text-center">Ucitavanje atributa, sacekajte...</h3>
        )}
      </Modal.Body>
      <Modal.Footer>
        {/*<p className="text-danger mx-auto" style={{ marginBottom: "0rem" }}>*/}
        {/*    {message}*/}
        {/*</p>*/}
        <Button variant="secondary" onClick={ponistiPromjene}>
          Odustani
        </Button>
        <Button onClick={izmijeniAtribute}>Prihvati</Button>
      </Modal.Footer>
    </Modal>
  );
}
