import React, { useEffect, useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { getNeObrisaniKorisnici } from "../Utility/Korisnik";
import { getRole } from "../Utility/UserControl";

export default function KorisniciAdd(prop) {
    const { node, show, setShown} = prop;

    const hideModal = (e) => {
        setShown(false);
    };

    /* const [userinfo, setUserInfo] = useState({odabrani: [],response: []});

    const checkboxClick = (e) => {
        const { id, checked } = e.target;
        const { odabrani } = userinfo;

        // Check
        if (checked) {
            setUserInfo({
                odabrani: [...odabrani, id],
                response: [...odabrani, id],
            });
        }

        // Uncheck
        else {
            setUserInfo({
                odabrani: odabrani.filter((e) => e !== id),
                response: odabrani.filter((e) => e !== id),
            });
        }

    }

    const spremiKorisnikeZaCvor = (e) => {
        var korisnici = userinfo.response.toString();
        //node.korisnikemails = korisnici;
        setUserInfo({
            odabrani: [],
            response: [],
        });
    }*/

    const isChecked = (e) =>{
        if(node == null || node.korisnikemails == null) {
            return;
        }
        if(node.korisnikemails.includes(e)) {
            return true;
        }
        return false;
    }

    const [users, setUsers] = useState(null);

    useEffect(async () => {
        if(getRole() === "user") {
            return;
        }
        var users = await getNeObrisaniKorisnici();
        setUsers(users);
    }, []);

    return (
        <>
            {users && (
                <>
                    <Modal show={show} onHide={hideModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>{node ? node.title : ""}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p>Označite jednog ili više korisnika koje želite dodati</p>
                            <div>{users.map((user) => {
                                return (
                                    <Form key={user.id}>
                                        <Form.Check
                                            type="checkbox"
                                            id={user.email}
                                            defaultChecked={isChecked(user.email)}
                                            label={user.ime + " " + user.prezime}
                                            //onClick={checkboxClick}
                                            onClick = {(e) => {
                                                if(node == null) {
                                                    return;
                                                }
                                                if(node.korisnikemails == null) {
                                                    node.korisnikemails = []
                                                }
                                                if(e.target.checked) {
                                                    node.korisnikemails.push(e.target.id);
                                                }
                                                else {
                                                    node.korisnikemails = node.korisnikemails.filter(k => k != e.target.id);
                                                }
                                            }}
                                        />
                                    </Form>
                                    
                                )
                            })}
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={hideModal}>
                                Odustani
                            </Button>
                            <Button variant="primary" onClick={() => {
                                hideModal();
                            }}>
                                Prihvati
                            </Button>
                        </Modal.Footer>
                    </Modal>{" "}
                </>
            )}
        </>
    );
    
}
