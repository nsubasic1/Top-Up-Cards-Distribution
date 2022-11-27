import { getDani, updateDan } from "../Utility/RadniDan";
import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";

export default function RadniDani() {
    const [dani, setDani] = useState(null);
    const [show, setShow] = useState(false);
    const [trenutniDan, setTrenutniDan] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(async () => {
        var data = await getDani();
        setDani(data);
    }, []);

    const promijeniDan = async (dan) => {
        if (dan.radni == 1) {
            dan.radni = 0;
        }
        else {
            dan.radni = 1;
        }

        let res = await updateDan(dan);
        setTrenutniDan(null);
        setLoading(false);
    };

    const trenutniStatusDana = (radni) => {
        if (radni == 1) {
            return <>Radni</>;
        }
        else {
            return <>Neradni</>;
        }
    }

    return (
        <>
            <h1 className="text-center">Raspored radnih i neradnih dana u sedmici</h1>
            {dani && (
                <>
                    <table id="tabela" className="table table-striped" aria-labelledby="tabelLabel">
                        <thead>
                            <tr>
                                <th>Dani u sedmici</th>
                                <th>Trenutno stanje</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {dani.map((dan) => (
                                <tr key={dan.id}>
                                    <td>{dan.naziv}</td>
                                    <td>{trenutniStatusDana(dan.radni)}</td>
                                    <td>
                                        <button
                                            onClick={(e) => {
                                                setLoading(true)
                                                setShow(true);
                                                promijeniDan(dan)
                                            }}
                                            variant="outlined">
                                            Izmijeni
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
            {!dani && (
                <h3 className="text-center">Učitavanje rasporeda, sačekajte...</h3>
            )}
            <Modal show={show}>
                <Modal.Header closeButton>
                    <Modal.Title>Izmjena statusa dana</Modal.Title>
                    <div
                    className="spinner-border mx-3"
                    role="status"
                    style={{ display: loading ? "block" : "none" }}
                    ></div>
                </Modal.Header>
                {!loading && <Modal.Body>
                    Status dana {trenutniDan ? " " + trenutniDan.naziv : ""} je uspješno izmijenjen
                </Modal.Body>}
                <Modal.Footer>
                    {!loading && <Button variant="primary" onClick={() => {setShow(false)}}>
                        OK
                    </Button>}
                </Modal.Footer>
            </Modal>
        </>
    );
}
