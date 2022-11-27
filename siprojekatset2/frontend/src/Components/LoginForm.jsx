import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { Navigate } from "react-router";
import { isLoggedIn } from "../Utility/UserControl";
import { Link } from "react-router-dom";
export default function LoginForm() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [signed, setSigned] = useState(false);
  const [usesqrcode, setUsesQrCode] = useState("");
  const [nextState, setNextState] = useState({email: "", password: "", token: "", usesqrcode: false});
  const submitHandler = (e) => {
    e.preventDefault();
    var email = document.getElementById("formBasicEmail").value;
    var password = document.getElementById("formBasicPassword").value;

    const podaci = {
      email: email,
      password: password,
    };
    setNextState(prevState => {
      return {...prevState, email: email, password: password}
    })
    setLoading(true);
    setMessage("");
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(podaci),
    };
    fetch("api/Login/login", requestOptions)
      .then((response) => {
        setLoading(false);
        if (!response.ok) {
            response.text().then(message => {
                setMessage(message);
            })
        } else {
          return response.body;
        }
      })
      .then((body) => body.getReader().read())
      .then((data) => {
          var result = String.fromCharCode.apply(null, data.value);
          setNextState(prevState => {
            return {...prevState, token: result}
          })
      })
      .catch((e) => {});
  };

  useEffect( async function() {
    if(nextState.token !== "") {
      const config = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "email": nextState.email
        })
      };
      var response = await fetch("api/korisnik/postemail", config);
      var korisnik = await response.json();
      setNextState(prevState => {
        return {...prevState, usesqrcode: korisnik.usesqrcode}
      })
      setSigned(true);
    }
  })

  return !signed ? (
    <div className="mx-auto" style={{ width: "50%" }}>
      <h1 className="mb-4">Prijava korisnika</h1>
      <div className="bg-white p-3 rounded border-primary border">
        <Form onSubmit={submitHandler}>
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
          <div className="mb-2">
            <Link to="/resetPassword">Zaboravili ste password?</Link>
          </div>
          <div className="d-flex align-items-center">
            <Button variant="primary" type="submit">
              Prijava
            </Button>
            <div
              className="spinner-border mx-3"
              role="status"
              style={{ display: loading ? "block" : "none" }}
            >
              <span className="visually-hidden">Učitavanje...</span>
            </div>
            <p
              className="text-danger mx-5 text-center"
              style={{ marginBottom: "0rem" }}
            >
              {message}
            </p>
          </div>
        </Form>
      </div>
    </div>
  ) : (
    signed && <Navigate to="/QrCodeValidator" state={nextState}></Navigate>
  );
}
