import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { azurirajKorisnika, getKorisnik } from "../Utility/Korisnik";
export default function Edit() {
  const [user, setUser] = useState(null);
  const [ime, setIme] = useState(null);
  const [prezime, setPrezime] = useState(null);
  const [password, setPassword] = useState(null);
  const [email, setEmail] = useState(null);
  const [message, setMessage] = useState("");
  const { id } = useParams();

  useEffect(async () => {
    const data = await getKorisnik(id);
    setUser(data);
    setIme(data.ime);
    setPrezime(data.prezime);
    setPassword(data.password);
    setEmail(data.email);
  }, []);

  let handleSubmit = async (e) => {
    e.preventDefault();
    if(password.length < 8){
      setMessage("Password mora imati najmanje 8 karaktera!");
    }
    else{
      let korisnik = {
        ime: ime,
        prezime: prezime,
        password: password,
        email: email,
      };
      let res = await azurirajKorisnika(id, korisnik);
      if (res.status === 200) {
        setMessage("Uspjesno izmijenjeno");
      } else {
        res.text().then(result => {
          setMessage(result);
        })
        
      }
    }
  };

  return (
    <>
      {user && (
        <div>
          <h3 className="text-center">
            Izmjena podataka korisniku: {user.ime}
          </h3>

          <div
            className=" mx-auto bg-white p-3 rounded border-primary border"
            style={{ width: "50%" }}
          >
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formBasicIme">
                <Form.Label>Ime</Form.Label>
                <Form.Control
                  type="text"
                  value={ime}
                  onChange={(e) => {
                    setIme(e.target.value);
                  }}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPrezime">
                <Form.Label>Prezime</Form.Label>
                <Form.Control
                  type="text"
                  value={prezime}
                  onChange={(e) => {
                    setPrezime(e.target.value);
                  }}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Unesite password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  required
                />
              </Form.Group>
              <div className="d-flex align-items-center">
                <Button variant="primary" type="submit">
                  Save
                </Button>
                <h5
                  className={
                    message == "Uspjesno izmijenjeno"
                      ? "text-success mx-5 text-center"
                      : "text-danger mx-5 text-center"
                  }
                >
                  {message}
                </h5>
              </div>
            </Form>
          </div>
        </div>
      )}
      {!user && (
        <h2 className="text-center">Učitavanje korisnika, sačekajte...</h2>
      )}
    </>
  );
}
