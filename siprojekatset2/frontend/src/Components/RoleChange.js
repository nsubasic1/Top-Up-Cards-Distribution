import React, { useEffect, useState } from "react";
import RoleChangeUser from "./RoleChangeUser";
import "./style/RoleChange.css";
import { getNeObrisaniKorisnici } from "../Utility/Korisnik";
const RoleChange = () => {
  const [korisnici, setKorisnici] = useState(null);
  useEffect(() => {
    povuciKorisnike();
  }, []);

  const povuciKorisnike = async () => {
    const data = await getNeObrisaniKorisnici();
    setKorisnici(data);
  };

  return (
    <>
      <h1 className="text-center">Tabela korisnika</h1>
      {korisnici ? (
        <div>
          <table className="table table-striped" aria-labelledby="tabelLabel">
            <thead>
              <tr>
                <th>Ime</th>
                <th>Prezime</th>
                <th>Email</th>
                <th>Rola</th>
                <th>Izbor nove role</th>
                <th>Akcije</th>
              </tr>
            </thead>
            <tbody>
              {korisnici.map((korisnik) => (
                <RoleChangeUser
                  key={korisnik.id}
                  id={korisnik.id}
                  ime={korisnik.ime}
                  prezime={korisnik.prezime}
                  password={korisnik.password}
                  email={korisnik.email}
                  uloga_id={korisnik.uloga_id}
                />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <h3 className="text-center">Učitavanje korisnika, sačekajte...</h3>
      )}
    </>
  );
};

export default RoleChange;
