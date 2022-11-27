import { Modal, Form, Button } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { getIndexFromValuta } from "../Utility/DistributivnaMreza";
import { iscrtajPoljaZaValutu, dajNizZaValutu, dajVrijednostiZaValutu } from "../Utility/StabloUI";
import "../App.css"

export default function IzmjeniStanje(props) {
  const { node, show, setShown, treeData, setTreeData, valutaVrijednosti } = props;

  const ponistiPromjene = () => {
    setShown(false);
  };

  const [bamniz, setBamNiz] = useState([]);
  const [eurniz, setEurNiz] = useState([]);
  const [usdniz, setUsdNiz] = useState([]);
  const [hrkniz, setHrkNiz] = useState([]);
  const [gbpniz, setGbpNiz] = useState([]);
  // Potrebno za rerender stranice
  const [rands, setRands] = useState(true);

  const [valuta, setValuta] = useState("EUR");
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (node) {
      setMessage("");
      setBamNiz(node.trenbam == null ? [] : [...node.trenbam])
      setEurNiz(node.treneur == null ? [] : [...node.treneur])
      setUsdNiz(node.trenusd == null ? [] : [...node.trenusd])
      setHrkNiz(node.trenhrk == null ? [] : [...node.trenhrk])
      setGbpNiz(node.trengbp == null ? [] : [...node.trengbp])
      var temp = dajNizZaValutu(valuta, [bamniz, eurniz, usdniz, hrkniz, gbpniz]);
      setMessages(new Array(temp.length).fill(""));
    }
  }, [show]);

  useEffect(() => {
    var temp = dajNizZaValutu(valuta, [bamniz, eurniz, usdniz, hrkniz, gbpniz]);
    if(show) {
      setMessages(new Array(temp.length).fill(""));
    }
  }, [valuta])

    const saveValues = () => {
      node.trenbam = [...bamniz];
      node.treneur = [...eurniz];
      node.trenusd = [...usdniz];
      node.trenhrk = [...hrkniz];
      node.trengbp = [...gbpniz];
    }

    const save = (e) => {
      if (validiraj()) {
        saveValues();
        setShown(false);
      }
    };

    const resetMessages = () => {
      messages.forEach(m => m = "");
      setMessage("");
    }

    const validiraj = () => {
        resetMessages();

        var nizTrenutni = dajNizZaValutu(valuta, [bamniz, eurniz, usdniz, hrkniz, gbpniz]);
        var ukupnoKartica = nizTrenutni.reduce((prev, curr) => (parseInt(prev) + parseInt(curr)))

        if (ukupnoKartica > 1 * node.karticeOgranicenje[getIndexFromValuta(valuta)]) {
            setMessage("Ukupno kartica mora biti maks. " + node.karticeOgranicenje[getIndexFromValuta(valuta)])
            return false;
        }

        var ukupnoNovca = 0;
        var vrijednosti = dajVrijednostiZaValutu(valuta, valutaVrijednosti);
        nizTrenutni.forEach((e, index) => ukupnoNovca += e * vrijednosti[index]);

        if (ukupnoNovca > 1 * node.novacOgranicenje[getIndexFromValuta(valuta)]) {
            setMessage("Ukupni novac mora biti maks. " + node.novacOgranicenje[getIndexFromValuta(valuta)])
            return false;
        }

        var nizOgranicenja = dajNizZaValutu(valuta, [node.ogrbam, node.ogreur, node.ogrusd, node.ogrhrk, node.ogrgbp])
        var prekoraceno = false;
        nizTrenutni.forEach((e, index) => {
          if(1 * e > nizOgranicenja[index]) {
            prekoraceno = true;
            messages[index] = "Dozvoljeno maks: " + nizOgranicenja[index];
            setRands(!rands);
          }
        })

        if(prekoraceno) {
          return false;
        }

        return true;
    }

  return (
    <Modal show={show} onHide={(e) => setShown(false)}>
      <Modal.Header closeButton>
        <Modal.Title>{"Izmijeni stanje"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicOpis">
            <div className="row">
              <div className="col">
                <Form.Group className="mb-3" controlid="formBasicOpis">
                  <Form.Label>Valuta</Form.Label>
                  <Form.Select
                    className="custom-select"
                    value={valuta}
                    onChange={(e) => {
                        if (validiraj()) {
                            setValuta(e.target.value);
                            saveValues();
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
            <div className="pt-3">
              { iscrtajPoljaZaValutu(valuta, valutaVrijednosti, [bamniz, eurniz, usdniz, hrkniz, gbpniz], setRands, true, messages) }
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <p className="text-danger mx-auto" style={{ marginBottom: "0rem" }}>
          {message}
        </p>
        <Button variant="secondary" onClick={ponistiPromjene}>
          Odustani
        </Button>
        <Button onClick={save}>Prihvati</Button>
      </Modal.Footer>
    </Modal>
  );
}
