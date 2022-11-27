import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

export default function ProdajnoMjestoInfo(prop) {
  const { node, show, setShown } = prop;
  const hideModal = (e) => {
    setShown(false);
  };
  return (
    <Modal show={show} onHide={hideModal}>
      <Modal.Header closeButton>
        <Modal.Title>{node ? node.title : ""}, id: {node ? node.id : ""}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>{node ? node.subtitle : ""}</p>
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={hideModal}>OK</Button>
      </Modal.Footer>
    </Modal>
  );
}
