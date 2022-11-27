import React from "react";
import { Modal, Button } from "react-bootstrap";
import { getIndexFromValuta, getVrijednostiFromDb } from "../Utility/DistributivnaMreza";
import { dajIndexZaVrijednost, dajNizZaValutu, dajVrijednostiZaValutu } from "../Utility/StabloUI";

export default function KasaInfo(prop) {
    const { node, show, setShown, valutaVrijednosti } = prop;
    const hideModal = (e) => {
    setShown(false);
    };

    const getStringFromIndex = (index) => {
        switch(index) {
            case 0: return "BAM";
            case 1: return "EUR";
            case 2: return "USD";
            case 3: return "HRK";
            case 4: return "GBP";
            default: return "UNKNOWN";
        }
    }

    const infoKasa = () => {
        if(node.kasatype == "Prodajna kasa" || node.kasatype == "Prodajno-primajuća kasa") {
            var vrijednosti = dajVrijednostiZaValutu(node.kasavaluta, valutaVrijednosti);
            var index = dajIndexZaVrijednost(vrijednosti, node.kasavrijednost);
            var stanje = dajNizZaValutu(node.kasavaluta, [node.trenbam, node.treneur, node.trenusd, node.trenhrk, node.trengbp]);
            return (<p>Broj kartica vrijednosti {vrijednosti[index]}{node.kasavaluta} : {stanje[index]}</p>)
        }
        else {
            var nizoviStanja = [node.trenbam, node.treneur, node.trenusd, node.trenhrk, node.trengbp];
            var nizoviVrijednosti = [valutaVrijednosti.bamvrijednosti, valutaVrijednosti.eurvrijednosti, valutaVrijednosti.usdvrijednosti, valutaVrijednosti.hrkvrijednosti, valutaVrijednosti.gbpvrijednosti]

            
            var podaci = [];
            for(var i = 0; i < 5; i++) {
                for(var j = 0; j < nizoviStanja[i].length; j++) {
                    podaci.push(<><p>Broja kartica vrijednosti {nizoviVrijednosti[i][j]} {getStringFromIndex(i)}: {nizoviStanja[i][j]}</p></>);
                }
            }
            return podaci;
        }
        /* return (
            <div>{
                (node.kasatype == "Prodajna kasa" || node.kasatype == "Prodajno-primajuća kasa") ? (
                    <>
                        <p> {node ? node.kasatype : ""}  </p>
                        <p> Valuta: {node ? node.kasavaluta : ""} <br />
                            Vrijednost kartica: {node ? node.kasavrijednost : ""} <br />
                            Broj kartica: {getCardNumber()}
                        </p>
                    </>
                ) : (
                        <>
                            <p> {node ? node.kasatype : ""} </p>
                            <p> Valuta: {node ? node.kasavaluta : ""} <br />
                                Broj kartica vrijednosti 2: {node ? node.tren2[getIndexFromValuta(node.kasavaluta)] : ""} <br />
                                Broj kartica vrijednosti 5: {node ? node.tren5[getIndexFromValuta(node.kasavaluta)] : ""} <br />
                                Broj kartica vrijednosti 10: {node ? node.tren10[getIndexFromValuta(node.kasavaluta)] : ""} <br />
                                Broj kartica vrijednosti 20: {node ? node.tren20[getIndexFromValuta(node.kasavaluta)] : ""} <br />
                                Broj kartica vrijednosti 50: {node ? node.tren50[getIndexFromValuta(node.kasavaluta)] : ""} <br />
                                Broj kartica vrijednosti 100: {node ? node.tren100[getIndexFromValuta(node.kasavaluta)] : ""} <br />
                            </p>
                        </>

                     )
            }
            </div>
        );*/
    }

  return (
    <Modal show={show} onHide={hideModal}>
      <Modal.Header closeButton>
        <Modal.Title>{node ? node.title : ""}, id: {node ? node.id : ""}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
          <p>{node ? infoKasa() : ""}</p>
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={hideModal}>OK</Button>
      </Modal.Footer>
    </Modal>
  );
}
