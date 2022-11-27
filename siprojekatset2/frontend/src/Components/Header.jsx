import React from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { adminRoles, korisnikRoles, kreatorDistMrežeRoles, signedInRoles } from "../Utility/Roles";
import { getRole, isAdmin, isLoggedIn } from "../Utility/UserControl";

export default function Header() {
return (
<>
    <Navbar bg="dark" variant = "dark">
    <Container>
        <NavLink
        to="/"
        className="navbar-brand"
        style={{ marginRight: "2rem" }}
        >
        Top-Up cards
        </NavLink>

        <Nav className="me-auto">
        <NavLink to="/" className="nav-link ">
            Početna
        </NavLink>

        {adminRoles.includes(getRole()) && (
            <>
            <NavDropdown
                id="nav-dropdown-dark-example"
                title="Admin panel"
                menuVariant="dark"
            >
                <NavLink to="/addUser" className="dropdown-item ">
                Dodaj korisnika
                </NavLink>
                <NavLink to="/users" className="dropdown-item ">
                Korisnici
                </NavLink>
                <NavLink to="/logs" className="dropdown-item ">
                Logovi
                </NavLink>

                <NavLink to="/delete" className="dropdown-item ">
                Brisanje korisnika
                </NavLink>

                <NavLink to="/roleChange" className="dropdown-item ">
                Promijeni role
                </NavLink>

                  

                </NavDropdown>

                <NavDropdown
                    id="nav-dropdown-dark-example"
                    title="Kreator panel"
                    menuVariant="dark"
                >
                    <NavLink to="/postavke" onClick={() => { }} className="dropdown-item">
                        Postavke
                    </NavLink>
                    <NavLink to="/transakcije"  className="dropdown-item">
                        Transakcije
                    </NavLink>
                    <NavLink to="/orders" className="dropdown-item">
                        Pregled narudžbi
                    </NavLink>
                    
                </NavDropdown>
            </>

        )}

        {korisnikRoles.includes(getRole()) && (
            <>
            <NavDropdown
                id="nav-dropdown-dark-example"
                title="Korisnik panel"
                menuVariant="dark"
            >
                
                <NavLink to="/radnidani" className="dropdown-item">
                Definisanje radnih dana
                </NavLink>
                <NavLink to="/sezonalnosti" className="dropdown-item">
                Definisanje sezonalnosti
                </NavLink>

                </NavDropdown>

            </>

        )}

        {signedInRoles.includes(getRole()) && (
          <>
            <NavLink to="/distMreze" onClick={() => {}} className="nav-link">
            Distributivne mreže
            </NavLink>
                              
          </>
        )}
        </Nav>

        <Nav className="ml-auto">
        {!isLoggedIn() ? (
            <>
            <NavLink to="/login" className="nav-link">
                Prijava
            </NavLink>
            </>
        ) : (
            <>
            <NavLink
                to="/editProfile"
                onClick={() => {}}
                className="nav-link"
            >
                Moj profil
            </NavLink>
            <NavLink to="/logout" onClick={() => {}} className="nav-link">
                Odjavi se
            </NavLink>
            </>
        )}
        </Nav>
    </Container>
    </Navbar>
</>
);
}
