import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import SingleOrderCvor from './SingleOrderCvor'
const Orders = (prop) => {

    const { node, show, setShown, valutaVrijednosti } = prop;
    const [narudzbe, setNarudzbe] = useState(null)

    useEffect(() => {
        povuciNarudzbe()
    }, [node])

    const hideModal = (e) => {
        setShown(false);
    };

    const povuciNarudzbe = async () => {
        if(node != null) {
            const repsonse = await fetch("api/stablo/getNarudzbeById/" + node.id);
            
            var data = await repsonse.json();
            setNarudzbe(data);
        }
    }
    return (
        <Modal size="xl" show={show} onHide={hideModal}>

            <Modal.Header closeButton>
                <Modal.Title>{node ? "Tabela narudzbi za cvor " + node.title : ""}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
            {
                narudzbe ? (
                    <>
                        <h3> Odlazeće narudžbe </h3>
                        <table className="table table-striped" aria-labelledby="tabelLabel" >
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Naziv</th>
                                    <th>Polaziste</th>
                                    <th>Destinacija</th>
                                    <th>Tip kartice</th>
                                    <th>Broj kartica</th>
                                        <th>Tip</th>
                                        <th>    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {narudzbe.map((narudzba) => {
                                    if(narudzba.pocetniId == node.id) {
                                        return <SingleOrderCvor
                                            narudzbaObjekat={narudzba}
                                            key={narudzba.id}
                                            id={narudzba.id}
                                            naziv={narudzba.naziv}
                                            pocetni={narudzba.pocetniId}
                                            krajnji={narudzba.krajnjiId}
                                            tip={narudzba.vrijednost + " " + narudzba.valuta}
                                            vrijednost={narudzba.vrijednost}
                                            valuta={narudzba.valuta}
                                            broj={narudzba.brojKartica}
                                            narudzbaTip={narudzba.tip ? "automatska" : "manuelna"}
                                            narudzbe={narudzbe}
                                            setNarudzbe={setNarudzbe}
                                            valutaVrijednosti={valutaVrijednosti}
                                            allowEdit={true}
                                        />
                                    }
                                })}
                            </tbody>
                        </table >
                        <h3> Dolazeće narudžbe </h3>
                        <table className="table table-striped" aria-labelledby="tabelLabel" >
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Naziv</th>
                                    <th>Polaziste</th>
                                    <th>Destinacija</th>
                                    <th>Tip kartice</th>
                                    <th>Broj kartica</th>
                                        <th>Tip</th>
                                        <th>    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {narudzbe.map((narudzba) => {
                                    if(narudzba.krajnjiId == node.id) {
                                        return <SingleOrderCvor
                                            narudzbaObjekat={narudzba}
                                            key={narudzba.id}
                                            id={narudzba.id}
                                            naziv={narudzba.naziv}
                                            pocetni={narudzba.pocetniId}
                                            krajnji={narudzba.krajnjiId}
                                            tip={narudzba.vrijednost + " " + narudzba.valuta}
                                            broj={narudzba.brojKartica}
                                            narudzbaTip={narudzba.tip ? "automatska" : "manuelna"}
                                            narudzbe={narudzbe}
                                            setNarudzbe={setNarudzbe}
                                            valutaVrijednosti={valutaVrijednosti}
                                            allowEdit={false}
                                        />
                                    }
                                })}
                            </tbody>
                        </table >
                    </>
                ) : (
                    <h3 className="text-center">Ucitavanje narudzbi, sacekajte...</h3>
                )
                }
            </Modal.Body>

            <Modal.Footer>
                <Button variant="primary" onClick={() => {
                    hideModal();
                }}>
                    OK
                </Button>
            </Modal.Footer>

        </Modal>
    );
}




export default Orders;
