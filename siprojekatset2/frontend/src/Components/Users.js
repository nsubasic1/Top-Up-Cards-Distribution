import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getNeObrisaniKorisnici } from "../Utility/Korisnik";

export default function Users() {
  const [users, setUsers] = useState(null);

  useEffect(async () => {
    const data = await getNeObrisaniKorisnici();
    setUsers(data);
  }, []);

  return (
    <>
      <h1 className="text-center">Tabela korisnika</h1>
      {users && (
        <>
          <div className=" rounded m-3">
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
                      <Link to={`/Edit/${user.id}`}>Izmijeni</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      {!users && (
        <h3 className="text-center">Učitavanje korisnika, sačekajte...</h3>
      )}
    </>
  );
}
