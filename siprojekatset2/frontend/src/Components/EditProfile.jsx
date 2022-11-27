import React, { useEffect, useState } from "react";
import { Form, Button, Modal, ModalBody, ModalFooter } from "react-bootstrap";
import { getKorisnikByMail } from "../Utility/Korisnik";
import { getPitanja, odgovoriNaPitanje } from "../Utility/Pitanja";
import { getEmail } from "../Utility/UserControl";
import QrCode from "./QrCode";

export default function EditProfile() {
  const [korisnik, setKorisnik] = useState({});
  const [loading, setLoading] = useState(true);
  const [ime, setIme] = useState("");
  const [prezime, setPrezime] = useState("");
  const [email, setEmail] = useState("");
  const [pitanja, setPitanja] = useState([]);
  const [redniBroj, setRedniBroj] = useState(0);
  const [odgovor, setOdgovor] = useState("");
  const [loadingPitanje, setLoadingPitanje] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [loadingPodaci, setLoadingPodaci] = useState(false);
  const [show, setShow] = useState(false);
  const [password, setPassword] = useState("");
  const [ponovljeniPassword, setPonovljeniPassword] = useState("");
  const [serverMessage, setServerMessage] = useState({
    error: false,
    message: "",
  });
  useEffect(async () => {
    let resKorisnik = await getKorisnikByMail(getEmail());
    let resPitanja = await getPitanja();

    setLoading(false);
    setPitanja(resPitanja);
    setKorisnik(resKorisnik);

    setIme(resKorisnik.ime);
    setPrezime(resKorisnik.prezime);
    setEmail(resKorisnik.email);
  }, []);
  const submitPodaci = async (e) => {
    e.preventDefault();
    let token = "bearer " + localStorage.getItem("token");
    setLoadingPodaci(true);
    let response = await fetch("/api/Korisnik/editProfile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ ime: ime, prezime: prezime, email: email }),
    });
    let proba = await response.body.getReader().read();
    localStorage.setItem("token", String.fromCharCode.apply(null, proba.value));
    if (response.ok) {
      setServerMessage({
        error: false,
        message: "Podaci uspješno promijenjeni!",
      });
    } else
      setServerMessage({
        error: true,
        message: "Došlo je do greške!",
      });
    setShow(true);
    setLoadingPodaci(false);
  };
  const submitPassword = async (e) => {
    e.preventDefault();
    if (password != ponovljeniPassword) {
      setServerMessage({
        error: true,
        message: "Passworde koje ste unijeli nisu identični!",
      });
      setShow(true);
      return;
    }
    setLoadingPassword(true);
    let token = "bearer " + localStorage.getItem("token");
    let response = await fetch("/api/Korisnik/changePassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: '"' + password + '"',
    });
    if (response.ok) {
      setServerMessage({
        error: false,
        message: "Password uspješno promijenjen!",
      });
    } else
      setServerMessage({
        error: true,
        message: "Došlo je do greške!",
      });
    setShow(true);
    setLoadingPassword(false);
  };
  const submitPitanje = async (e) => {
    e.preventDefault();
    setLoadingPitanje(true);
    let res = await odgovoriNaPitanje({
      idKorisnik: korisnik.id,
      pitanje: pitanja[redniBroj].tekst,
      odgovor: odgovor,
    });
    setServerMessage(res);
    setShow(true);
    setLoadingPitanje(false);
  };
  return (
    <>
      <h1 className="text-center mb-3">Moj profil</h1>
      {!loading ? (
        <div className="w-75 mx-auto">
          <Form
            onSubmit={submitPodaci}
            className="bg-white rounded border my-2 p-3"
          >
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Ime</Form.Label>
              <Form.Control
                type="text"
                placeholder="Unesite ime"
                required
                value={ime}
                onChange={(e) => {
                  setIme(e.target.value);
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicSurename">
              <Form.Label>Prezime</Form.Label>
              <Form.Control
                type="text"
                placeholder="Unesite prezime"
                required
                value={prezime}
                onChange={(e) => {
                  setPrezime(e.target.value);
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Unesite email adresu"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </Form.Group>

            <Form.Group className="d-flex">
              <Button
                style={{ width: "100px" }}
                variant="primary"
                type="submit"
              >
                Promijeni
              </Button>
              <div
                className="spinner-border mx-3"
                role="status"
                style={{ display: loadingPodaci ? "block" : "none" }}
              >
                <span className="visually-hidden">Učitavanje...</span>
              </div>
            </Form.Group>
          </Form>
          <Form
            onSubmit={submitPassword}
            className="bg-white rounded border my-2 p-3"
          >
            <Form.Group className="mb-3">
              <Form.Label>Novi password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Unesite password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ponovite password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Ponovite password"
                required
                value={ponovljeniPassword}
                onChange={(e) => {
                  setPonovljeniPassword(e.target.value);
                }}
              />
            </Form.Group>
            <Form.Group className="d-flex">
              <Button
                style={{ width: "100px" }}
                variant="primary"
                type="submit"
              >
                Spremi
              </Button>
              <div
                className="spinner-border mx-3"
                role="status"
                style={{ display: loadingPassword ? "block" : "none" }}
              >
                <span className="visually-hidden">Učitavanje...</span>
              </div>
            </Form.Group>
          </Form>
          <Form
            onSubmit={submitPitanje}
            className="bg-white rounded border my-2 p-3"
          >
            <Form.Group className="mb-3">
              <Form.Label>Pitanje</Form.Label>
              <Form.Select onChange={(e) => setRedniBroj(e.target.value)}>
                <option>Odaberi pitanje</option>
                {pitanja.map((pitanje, index) => (
                  <option value={index}>{pitanje.tekst}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Odgovor</Form.Label>
              <Form.Control
                type="text"
                placeholder="Unesite odgovor"
                required
                value={odgovor}
                onChange={(e) => {
                  setOdgovor(e.target.value);
                }}
              />
            </Form.Group>
            <Form.Group className="d-flex">
              <Button
                style={{ width: "100px" }}
                variant="primary"
                type="submit"
              >
                Dodaj
              </Button>
              <div
                className="spinner-border mx-3"
                role="status"
                style={{ display: loadingPitanje ? "block" : "none" }}
              >
                <span className="visually-hidden">Učitavanje...</span>
              </div>
            </Form.Group>
          </Form>
          <div className="bg-white rounded border my-2 p-3">
            <QrCode></QrCode>
          </div>
        </div>
      ) : (
        <h3 className="text-center">Učitavanje...</h3>
      )}
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {serverMessage.error ? "Greška" : "Uspješno"}
          </Modal.Title>
        </Modal.Header>
        <ModalBody>{serverMessage.message}</ModalBody>
        <ModalFooter>
          <Button type="primary" onClick={() => setShow(false)}>
            OK
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
