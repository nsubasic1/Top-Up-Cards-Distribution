import React, { useEffect, useState } from "react";
import SingleOrder from './SingleOrder'
const Orders = () => {
    const [narudzbe, setNarudzbe] = useState(null)

    useEffect(() => {
        povuciNarudzbe()
    }, [])

    const povuciNarudzbe = async () => {
        const repsonse = await fetch("api/stablo/getNarudzbe");
        var data = await repsonse.json();
        setNarudzbe(data);
    }
    return (
        <>
            <h2 className="text-center">Tabela narudžbi</h2>
            {
                narudzbe ? (
                    <table className="table table-striped" aria-labelledby="tabelLabel" >
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Naziv</th>
                                <th>Polazište</th>
                                <th>Destinacija</th>
                                <th>Tip kartice</th>
                                <th>Broj kartica</th>
                                <th>Tip</th>
                            </tr>
                        </thead>
                        <tbody>
                            {narudzbe.map((narudzba) => (
                                <SingleOrder
                                    key={narudzba.id}
                                    id={narudzba.id}
                                    naziv={narudzba.naziv}
                                    pocetni={narudzba.pocetniId}
                                    krajnji={narudzba.krajnjiId}
                                    tip={narudzba.vrijednost + " " + narudzba.valuta}
                                    broj={narudzba.brojKartica}
                                    narudzbaTip={narudzba.tip ? narudzba.tip  : "manuelna"}
                                />
                            ))}
                        </tbody>
                    </table >
                ) : (
                    <h3 className="text-center">Učitavanje narudžbi, sačekajte...</h3>
                )
            }
        </>
    );
}




export default Orders;
