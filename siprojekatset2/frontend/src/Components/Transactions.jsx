import React, { useEffect, useState } from "react";
import SingleOrder from './SingleOrder'
const Transactions = () => {
     const [vrijemetransakcije, setVrijemeTransakcije] = useState(null)

    useEffect(async () => {
       getTransakcijeFromDb()
    }, [])

    
     const getTransakcijeFromDb = async () => {
        let token = "bearer " + localStorage.getItem("token");
         const response = await fetch("api/stablo/getTransakcije", {

            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            }
         });
         var data = await response.json();
         setVrijemeTransakcije(data);

    }

    return (
        <>
            <h2 className="text-center">Tabela transakcija</h2>
            {
                vrijemetransakcije ? (
                    <table className="table table-striped" aria-labelledby="tabelLabel" >
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Id poslovnice</th>
                                <th>Datum</th>
                                <th>Stanje</th>
                                <th>Vrijednost</th>
                                <th>Valuta</th>
                                <th>Vrsta</th>
                            </tr>
                        </thead>
                           <tbody>
                            {vrijemetransakcije.map((v) => (
                                <tr>
                                    <td>
                                        {v.id}</td>
                                    <td>
                                        {v.idCvor}</td>
                                    <td>
                                    {v.datum}</td>
                                    <td>{v.stanje}</td>
                                    <td>{v.vrijednost}</td>
                                    <td>{v.valuta}</td>
                                   <td> {v.vrsta}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table >
                ) : (
                    <h3 className="text-center">Učitavanje transakcija, sačekajte...</h3>
                )
            }
        </>
    );
}




export default Transactions;