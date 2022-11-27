import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Form, Button } from "react-bootstrap";

const QrCodeValidator = (props) => {
  const [validated, setValidated] = useState(false);
  const [qrCodeInput, setQrCodeInput] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const { state } = useLocation();
  const qrCodeInputChangeHandler = (event) => {
    setQrCodeInput(event.target.value);
  };

  const submitHandler = async function (e) {
    e.preventDefault();
    try {
      const config = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: state.email,
          password: state.password,
          qrcodekey: qrCodeInput,
        }),
      };

      var sol = await fetch("api/Login/validateqrcode", config);
      var data = await sol.text();

      if (data == "valid") {
        localStorage.setItem("token", state.token);
        setValidated(true);
      } else {
        setStatusMessage("Failed to validate QR Code.");
      }
    } catch (error) {
      setStatusMessage("Failed to validate QR Code.");
    }
  };

  useEffect(() => {
    if (validated) {
      window.location.reload(false);
    }
    if (!state.usesqrcode) {
      localStorage.setItem("token", state.token);
      window.location.reload(false);
    }
  });

  return (
    <div className="new-qr-code-validator w-25 mx-auto bg-white border rounded p-3 border-primary">
      <Form onSubmit={submitHandler}>
        <p>Input your 6 digit code</p>

        <Form.Control
          type="text"
          name="qrCodeInput"
          id="qrCodeInput"
          required
          value={qrCodeInput}
          maxLength="6"
          onChange={qrCodeInputChangeHandler}
        />
        <Form.Group className="text-center">
          <Button className="mt-3" type="submit">
            Validate code
          </Button>
        </Form.Group>
        {statusMessage && (
          <div className="text-danger text-center mt-3">{statusMessage}</div>
        )}
        {validated && <Navigate to="/" />}
        {!state.usesqrcode && <Navigate to="/" />}
      </Form>
    </div>
  );
};

export default QrCodeValidator;
