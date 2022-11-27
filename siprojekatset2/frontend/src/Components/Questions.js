import React, { useEffect, useState } from 'react';
import { Form, Button } from "react-bootstrap";
import { useNavigate } from 'react-router';


export default function Questions() {
    const [questions, setQuestions] = useState([]);
    const [hideEmail, setHideEmail] = useState(false);
    const [hideInput, setHideInput] = useState(true);
    const [hidePassword, setHidePassword] = useState(true);
    const [answer, setAnswer] = useState("");
    const [email, setEmail] = useState("");
    const [odabrano, setOdabrano] = useState(0);
    const navigate = useNavigate();

    const getQuestions = e => {
        e.preventDefault()
        fetch('api/Pitanja/get?email=' + email)
            .then(res => res.json())
            .then(data => {
                if (data) {
                    setQuestions(data)
                    setHideEmail(true)
                    setHideInput(false)
                }
                else {
                    alert("Vaš korisnički račun nema omogućenu ovu opciju!")
                }
            }).catch(error => alert("Unijeli ste nepostojeći mail"))
    }
    const validateAnswer = e => {
        e.preventDefault()
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: questions.at(odabrano).id,
                idKorisnik: questions.at(odabrano).idKorisnik,
                pitanje: questions.at(odabrano).pitanje,
                odgovor: answer
            })
        }
        fetch('api/Pitanja/provjeriOdgovor', requestOptions).then(res =>
            res.json()).then(data => {
                if (data == "ok") {
                    setHideInput(true)
                    setHidePassword(false)
                }
                else if (data == "Netacan odgovor") {
                    alert("Answer incorrect")
                }
            })
    }

    const submitHandler = e => {
        e.preventDefault();
        var pass = document.getElementById("formPassword").value;
        var confirm = document.getElementById("formRepeat").value;
        if (pass != confirm) {
            alert("Passwords do not match")
            return
        }
        
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email,
                password : pass,
                odgovor: answer
            })
        }
        fetch('api/Pitanja/promijeniPass', requestOptions).then(res => 
            res.json()).then(data => {
                if (data == "ok") {
                    alert("Password succesfully changed")
                    setTimeout(() => { navigate('/login') }, 2000)
                }
                else if(data == "Netacan odgovor"){
                    alert("Answer incorrect")
                }
            })

    }

    return (
        <div className="mx-auto" style={{ width: "50%" }}>
            <h1 className="mb-4">Security pitanje</h1>
            <div className="bg-white p-3 rounded border-primary border">
                <Form onSubmit={getQuestions} hidden={hideEmail}>
                    <Form.Group onChange={e => setEmail(e.target.value)}>
                        <Form.Label>Unesite e-mail adresu:</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="abc@email.com"
                            required
                            />
                    </Form.Group>
                    <Form.Group className="text-center">
                        <Button className="mt-3" variant="primary" type="submit">
                            Učitaj pitanja
                            </Button>
                    </Form.Group>
                </Form>
                <Form onSubmit={validateAnswer} hidden={hideInput}>
                    <Form.Group  className="mb-3">
                        <Form.Select aria-label="Odaberite jedno pitanje" onChange={e => setOdabrano(e.target.value)}>
                            <option>Odaberite jedno pitanje</option>
                            {questions.map((q, i) =>
                                <option key={ q.id } value={i}> {q.pitanje} </option>
                            )}
                        </Form.Select>
                        <Form.Group onChange={e => setAnswer(e.target.value)}>
                            <Form.Label>Odgovor:</Form.Label>
                            <Form.Control required />
                        </Form.Group>
                        <Form.Group className="text-center">
                            <Button className="mt-3" variant="primary" type="submit">
                                Potvrdi
                            </Button>
                        </Form.Group>
                    </Form.Group>
                </Form>
                <Form onSubmit={submitHandler} hidden={hidePassword}>
                    <Form.Group controlId="formPassword">
                        <Form.Label>Unesite novi password:</Form.Label>
                        <Form.Control
                            type="password"
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formRepeat">
                        <Form.Label>Ponovite unos:</Form.Label>
                        <Form.Control
                            type="password"
                            required
                        />
                    </Form.Group>
                    <Form.Group className="text-center">
                        <Button className="mt-3" variant="primary" type="submit">
                            Izvrši promjenu
                        </Button>
                    </Form.Group>
                </Form>
            </div>
        </div>

        )
}