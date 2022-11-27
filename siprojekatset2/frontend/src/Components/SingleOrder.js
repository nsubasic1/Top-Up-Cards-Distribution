import React from "react";

const SingleOrder = (props) => {
 
    return (
        <tr key={props.id}>
          <td>{props.id}</td>
          <td>{props.naziv}</td>
          <td>{props.pocetni}</td>
          <td>{props.krajnji}</td>
          <td>{props.tip}</td>
          <td>{props.broj}</td>
          <td>{props.narudzbaTip}</td>
      </tr>
  );
}

export default SingleOrder;
