import React, { useState } from "react";
import { promijeniRolu } from "../Utility/Korisnik";
import { getRoleName } from "../Utility/Roles";
const RoleChangeUser = (props) => {
  const [selektovanaRola, setSelektovanaRola] = useState(1);
  const [loading, setLoading] = useState(false);
  const [imeRole, setImeRole] = useState(getRoleName(props.uloga_id));

  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  const promijeniRole = async (id, uloga) => {
    var ulogaParsirana = parseInt(uloga);
    let ok = await promijeniRolu(id, ulogaParsirana);
    if (ok) {
      alert("Ažurirana role-a u bazi!");
      setImeRole(getRoleName(selektovanaRola));
      setLoading(false);
        forceUpdate();
        
    }
  };

  const onClickHandler = () => {
    promijeniRole(props.id, selektovanaRola);
    setLoading(true);
  };

  const roleChangeSelected = (event) => {
    setSelektovanaRola(event.target.value);
    console.log(event.target.value);
  };

  return (
    <tr key={props.id}>
      <td>{props.ime}</td>
      <td>{props.prezime}</td>
      <td>{props.email}</td>
      <td>{imeRole}</td>
      <td>
        <select onChange={roleChangeSelected}>
          <option>Odaberite rolu</option>
          <option value="1">Admin</option>
          <option value="2">Korisnik</option>
          <option value="3">Kreator distributivne mreže</option>
        </select>
      </td>
      <td>
        <button type="submit" onClick={onClickHandler}>
          Izmijeni
        </button>
        <span
          className="spinner-border spinner-border-sm mx-1"
          role="status"
          aria-hidden="true"
          style={{ display: loading ? "inline-block" : "none" }}
        ></span>
      </td>
    </tr>
  );
};

export default RoleChangeUser;
