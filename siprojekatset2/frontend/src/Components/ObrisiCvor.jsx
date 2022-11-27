import React from "react";
import { Modal, Button } from "react-bootstrap";
export default function ObrisiCvor(props) {
    const { node, show, setShown , setMarkDelete} = props;
    const handleClose = (e) => {
        setShown(false);
    };
    const deleteCvor = (e) => {
        node.delete = true;
        setMarkDelete(true);
        setShown(false);
    };
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Brisanje čvora</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Da li ste sigurni da želite obrisati čvor
                {node ? " " + node.title : ""}?
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Ne
                </Button>
                <Button variant="primary" onClick={deleteCvor}>
                    Da
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
