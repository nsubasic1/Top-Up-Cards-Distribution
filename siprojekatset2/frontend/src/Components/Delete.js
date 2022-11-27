import React, { useState, useEffect, useReducer } from "react";
import { Modal, Button } from "react-bootstrap";
import { getNeObrisaniKorisnici, deleteKorisnik } from "../Utility/Korisnik";
export default function Delete() {
  const [users, setUsers] = useState(null);
  const [reducerValue, forceUpdate] = useReducer((x) => x - 1, 0);
  const [userToBeDeleted, setUserToBeDeleted] = useState(null);
  const [show, setShow] = useState(false);
  useEffect(async () => {
    let data = await getNeObrisaniKorisnici();
    setUsers(data);
  }, [reducerValue]);

  const deleteUser = async (e, korisnik = userToBeDeleted) => {
    e.preventDefault();
    let res = await deleteKorisnik(korisnik);
    if (res.status == 200) {
      forceUpdate();
      setShow(false);
      setUserToBeDeleted(null);
    }
  };
  const handleClose = () => {
    setShow(false);
    setUserToBeDeleted(null);
  };

  return (
    <>
      <h1 className="text-center mb-3">Tabela korisnika</h1>
      {users && (
        <>
          <table className="table table-striped" aria-labelledby="tabelLabel">
            <thead>
              <tr>
                <th>Ime</th>
                <th>Prezime</th>

                <th>Email</th>
                <th>Akcije</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.ime}</td>
                  <td>{user.prezime}</td>

                  <td>{user.email}</td>
                  <td>
                    <button
                      onClick={(e) => {
                        setUserToBeDeleted(user);
                        setShow(true);
                      }}
                      variant="outlined"
                    >
                      Obriši
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Brisanje korisnika</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Da li ste sigurni da želite obrisati korisnika{" "}
              {userToBeDeleted ? userToBeDeleted.email : ""}?
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Ne
              </Button>
              <Button variant="primary" onClick={deleteUser}>
                Da
              </Button>
            </Modal.Footer>
          </Modal>{" "}
        </>
      )}
      {!users && (
        <h3 className="text-center">Učitavanje korisnika, sačekajte...</h3>
      )}
    </>
  );
}
