import React, { useEffect, useState } from "react";
import { Modal, Form, Button} from "react-bootstrap";
import { dajIndexZaVrijednost, dajNizZaValutu } from "../Utility/StabloUI"
import { getMrezaArrayFromDb, getVrijednostiFromDb, writeMrezaArrayToDb, writeVrijednostiToDb } from "../Utility/DistributivnaMreza";


const Settings = (props) => {
  const [valuta, setValuta] = useState("--");
  const [vrijednostZaBrisanje, setVrijednostZaBrisanje] = useState(0);
  const [vrijednostZaDodavanje, setVrijednostZaDodavanje] = useState(0);
  const [show, setShow] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [loading, setLoading] = useState(false);

  const [valutaVrijednosti, setValutaVrijednosti] = useState();
  // Nizovi za cuvanje vrijednosti za svaku valutu
  const [bamniz, setBamNiz] = useState([]);
  const [eurniz, setEurNiz] = useState([]);
  const [usdniz, setUsdNiz] = useState([]);
  const [hrkniz, setHrkNiz] = useState([]);
  const [gbpniz, setGbpNiz] = useState([]);

  const [message, setMessage] = useState("");

  useEffect(async () => {
    var temp = await getVrijednostiFromDb();
    setValutaVrijednosti(temp);
    updateVrijednosti(temp);

    setValuta("BAM");
  }, [])

  const updateVrijednosti = (vrijednosti) => {
    setMessage("");
    setBamNiz([...vrijednosti.bamvrijednosti]);
    setEurNiz([...vrijednosti.eurvrijednosti]);
    setUsdNiz([...vrijednosti.usdvrijednosti]);
    setHrkNiz([...vrijednosti.hrkvrijednosti]);
    setGbpNiz([...vrijednosti.gbpvrijednosti]);
  }

  const mapirajVrijednosti = () => {
    // Odaberemo vrijednosti koju zelimo mapirati, f-ja jednostavna, redoslijed mora biti ovakav
    var vrijednosti = dajNizZaValutu(valuta, [bamniz, eurniz, usdniz, hrkniz, gbpniz]);
    if(vrijednosti == null) {
      return;
    }
    // Mapiranje vrijednosti
    return vrijednosti.map((e, i) => {
      return(
        <div className="container">
          <div className="row">
            <div style={{width: 80 + "%"}}>
              <button
                disabled
                type="button"
                value={e}
                class="list-group-item list-group-item-action"
              >
                {e}
              </button>
            </div>
            <div style={{width: 20 + "%"}}>
              <Button className="w-100" variant="secondary" onClick={() => potvrdaBrisanja(e)}>Obrisi</Button> 
            </div>
          </div>
        </div>
      )
    });
  }

  const handleShow = () => setShow(true);
  const handleClose=() => setShow(false);

  const potvrdaBrisanja = (vrijednost) => {
    setShow(true);
    setVrijednostZaBrisanje(vrijednost);
  };

  const obrisiVrijednost=async()=>{
      //OVDJE JE KOD ZA BRISANJE VRIJEDNOSTI IZ BAZE. VRIJEDNOST KOJA TREBA BITI OBRISANA JE
      //VRIJEDNOSTZABRISANJE
      var vrijednosti = dajNizZaValutu(valuta,
          [valutaVrijednosti.bamvrijednosti,
          valutaVrijednosti.eurvrijednosti,
          valutaVrijednosti.usdvrijednosti,
          valutaVrijednosti.hrkvrijednosti,
          valutaVrijednosti.gbpvrijednosti]
      );
      setLoading(true);
      var index = dajIndexZaVrijednost(vrijednosti, vrijednostZaBrisanje);
      vrijednosti.splice(index, 1)
      var temp = await getMrezaArrayFromDb();
      for (var i = 0; i < temp.length; i++) {
        var ogranicenjaZaValutu = dajNizZaValutu(valuta, [temp[i].ogrbam, temp[i].ogreur, temp[i].ogrusd, temp[i].ogrhrk, temp[i].ogrgbp])
        var stanjaZaValutu = dajNizZaValutu(valuta, [temp[i].trenbam, temp[i].treneur, temp[i].trenusd, temp[i].trenhrk, temp[i].trengbp])

        if(ogranicenjaZaValutu.length != 0) {
          ogranicenjaZaValutu.splice(index, 1);
        }
        stanjaZaValutu.splice(index, 1);
      }

      writeMrezaArrayToDb(temp);
      await writeVrijednostiToDb(valutaVrijednosti);
      updateVrijednosti(valutaVrijednosti);
      setLoading(false);
      setShow(false);
  }

  const dodajVrijednost = async () => {
    var vrijednosti = dajNizZaValutu(valuta, 
      [valutaVrijednosti.bamvrijednosti,
      valutaVrijednosti.eurvrijednosti, 
      valutaVrijednosti.usdvrijednosti, 
      valutaVrijednosti.hrkvrijednosti, 
      valutaVrijednosti.gbpvrijednosti]
    );
    // Prvo provjeriti da li postoji
    // Ako ova funkcija vrati undefined znaci da ne postoji
    var index = dajIndexZaVrijednost(vrijednosti, vrijednostZaDodavanje);
    if(index != null) {
      setMessage("Vrijednost vec postoji za datu valutu");
      return;
    }
    setLoading(true);
    vrijednosti.push(vrijednostZaDodavanje);
    // Nakon dodavanja moramo uraditi i update cvorova u bazi, da bi ostavili stanje konzistentnim
    // cuvat cemo podatke sortirane
    vrijednosti.sort((a, b) => parseInt(a) - parseInt(b))
    // Index gdje treba ubaciti kod cvorova
    var index = dajIndexZaVrijednost(vrijednosti, vrijednostZaDodavanje);

    // Vraca sve cvorove ali kao niz da bude lakse promjeniti sve
    var temp = await getMrezaArrayFromDb();
    for(var i = 0; i < temp.length; i++) {
      // Ovako se dodaje element na zeljenom indeksu
      var ogranicenjaZaValutu = dajNizZaValutu(valuta, [temp[i].ogrbam, temp[i].ogreur, temp[i].ogrusd, temp[i].ogrhrk, temp[i].ogrgbp])
      var stanjaZaValutu = dajNizZaValutu(valuta, [temp[i].trenbam, temp[i].treneur, temp[i].trenusd, temp[i].trenhrk, temp[i].trengbp])

      if(ogranicenjaZaValutu.length != 0) {
        ogranicenjaZaValutu.splice(index, 0, 0);
      }
      stanjaZaValutu.splice(index, 0, 0);
    }
    // ODKOMENTARISATI TEK KADA BUDEMO 100% DA RADI KAKO TREBA
    // Napisane dvije nove funkcije za upisivanje u bazu
    writeMrezaArrayToDb(temp);
    await writeVrijednostiToDb(valutaVrijednosti);
    updateVrijednosti(valutaVrijednosti);
    setLoading(false);
    setShowInput(false);
  }

  

  return (
    <div style={{width: 50 + '%', "min-width": "500px", margin: 'auto'}}>
      <div className="row">
        <div className="col">
          <Form.Group className="mb-3" controlid="formBasicOpis">
            <Form.Label>Valuta</Form.Label>
            <Form.Select
              className="custom-select"
              value={valuta}
              onChange={(e) => {
                setValuta(e.target.value);
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
        {
          //UMJESTO NIZ NAPISI IME SVOG NIZA IZ USESTATE U KOJI SI STAVILA VRIJEDNOSTI
          mapirajVrijednosti()
        }
        <div style={{padding: "10px"}}>
          <button type="button" onClick={() => setShowInput(true)} class="btn btn-primary w-100">Dodaj novu vrijednost</button>
        </div>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Brisanje vrijednosti</Modal.Title>
          </Modal.Header>
          <Modal.Body>Jeste li sigurni da želite obrisati vrijednost: {vrijednostZaBrisanje}?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Zatvori
            </Button>
            <Button variant="primary" onClick={obrisiVrijednost}>
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

        {
          // Novi modal za prikaz input polja
        }
        <Modal show={showInput} onHide={() => setShowInput(false)}>
          <Modal.Header>Dodavanje vrijednosti</Modal.Header>

          <Modal.Body>
            <Form.Group className="mb-3" controlId="formBasicOpis">
              <Form.Label>Dodavanje vrijednosti</Form.Label>
                <Form.Control
                    type="number"
                    required
                    value={vrijednostZaDodavanje}
                    min={0}
                    max={500000}
                    step={5}
                    onChange={(e) => {
                      setVrijednostZaDodavanje(e.target.value);
                    }}
                />
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
          {
            // Poruka ako dode do greske
          }
          <p className="text-danger mx-auto" style={{ marginBottom: "0rem" }}>
            {message}
          </p>
            <Button variant="secondary" onClick={() => setShowInput(false)}>
              Zatvori
            </Button>
            <Button variant="primary" onClick={dodajVrijednost}>
              Dodaj
            </Button>
            {
              // Spinner za indikaciju ucitavanja (3 puta se radi upis/citanje u bazu sto ce potrajat)
            }
            <div
                className="spinner-border mx-3"
                role="status"
                style={{ display: loading ? "block" : "none" }}
              >
            </div>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default Settings;
