import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
export default function SignUpForm() {
  const [message, setMessage] = useState({ err: false, poruka: "" });
  const [loading, setLoading] = useState(false);
  const submitHandler = (e) => {
      e.preventDefault();
      if (document.getElementById("formBasicPassword").value.length >= 1 && document.getElementById("formBasicPassword").value.length < 8) {
          document.getElementById("formBasicPassword").value = "";
          setMessage({ err: true, poruka: "Password mora imati najmanje 8 karaktera!" });
          throw message.err;
      }
     
      var ime = document.getElementById("formBasicName").value;
    var prezime = document.getElementById("formBasicSurename").value;
    var email = document.getElementById("formBasicEmail").value;
    var password = document.getElementById("formBasicPassword").value;
    var rola = document.getElementById("formBasicRole").value;
    const korisnik = {
      ime: ime,
      prezime: prezime,
      email: email,
      password: password,
      rola: rola,
    };
    console.log(korisnik);
    setLoading(true);
    fetch("api/Register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(korisnik),
    })
      .then((response) => {
        setLoading(false);
        if (response.status >= 200 && response.status < 300) {
          console.log("Sve OK: " + response.status);
          setMessage({ err: false, poruka: "Korisnik uspješno dodan!" });
          setTimeout(() => {
            window.location.reload(true);
          }, 2000);
        } else {
          response.text().then(result => {
            if(result === "Korisnik sa ovim e-mailom vec postoji!")
              setMessage({ err: true, poruka: result});
            else  
            setMessage({ err: true, poruka: "Došlo je do greške!"});
          })
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className="mx-auto" style={{ width: "50%" }}>
      <h1 className="mb-4">Dodavanje korisnika</h1>
      <div className="bg-white p-3 rounded border-primary border">
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Label>Ime</Form.Label>
            <Form.Control type="text" placeholder="Unesite ime" required />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicSurename">
            <Form.Label>Prezime</Form.Label>
            <Form.Control type="text" placeholder="Unesite prezime" required />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Unesite email adresu"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Unesite password"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicRole">
            <Form.Label>Rola</Form.Label>
            <Form.Select required>
              <option>Odaberite rolu</option>
              <option value="1">Admin</option>
              <option value="2">Korisnik</option>
              <option value="3">Kreator distributivne mreže</option>
            </Form.Select>
          </Form.Group>
          <div className="d-flex align-items-center">
            <Button variant="primary" type="submit">
              Save
            </Button>
            <div
              className="spinner-border mx-3"
              role="status"
              style={{ display: loading ? "block" : "none" }}
            >
              <span className="visually-hidden">Učitavanje...</span>
            </div>
            <h5
              className={
                !message.err
                  ? "text-success mx-5 text-center"
                  : "text-danger mx-5 text-center"
              }
            >
              {message.poruka}
            </h5>
          </div>
        </Form>
      </div>
    </div>
  );
}
