// Ovdje lezi 308 linija koda za generisanje regresije,
// medutim zbog promjena zahtjeva sve je nesvjesnije,
// da li ce se ovaj kod ikada vise koristiti,
// zbog nekih osoba koji su ogromni teroristi.
//
// Ja se ne usudjem tebe obrisati,
// a ako neko pokusa bit ce zalosti.
//
// Sada odmaraj, i ne osjecaj se izdan,
// jer ce doci taj veliki dan,
// kad ce te opet neko s radoscu traziti
// jer bolji kod od tebe sigurno ne moze postojati

/* import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import CanvasJSReact from "../Utility/canvasjs.react";
import PolynomialRegression from "js-polynomial-regression";

export default function Predictions(prop) {
    const { node, show, setShown } = prop;

    const [generated, setGenerated] = useState(false);
    const [data, setData] = useState([]);
    const [err, setErr] = useState(false);
    const [loading, setLoading] = useState(false);

    var CanvasJSChart = CanvasJSReact.CanvasJSChart;

    const hideModal = (e) => {
        setGenerated(false);
        setShown(false);
    };

    useEffect(async () => {
        if(show) {
            setErr(false);
            setData([])
            setLoading(true);
            // api/stablo/getTransakcije
            var req = await fetch("api/stablo/getVrijemeTransakcijeByIdCvor/" + node.id)
            var data = await req.json();
            var ukupnaStanjaPoDatumu = []
            data.forEach(novi => {
                var datum1 = new Date(novi.datum)
                var found = false;
                for(var i = 0; i < ukupnaStanjaPoDatumu.length; i++) {
                    var datum2 = new Date(ukupnaStanjaPoDatumu[i].datum)
                    if(datum1.getDate() == datum2.getDate() && datum1.getMonth() == datum2.getMonth() && datum1.getFullYear() == datum2.getFullYear()) {
                        ukupnaStanjaPoDatumu[i].stanje += novi.stanje;
                        found = true;
                        break;
                    }
                }
                if(!found) {
                    var noviDatum = {datum: novi.datum, stanje: novi.stanje}
                    ukupnaStanjaPoDatumu.push(noviDatum);
                }
            });

            var dataZaGraf = []
            for(var i = 0; i < ukupnaStanjaPoDatumu.length; i++) {
                dataZaGraf.push({y: ukupnaStanjaPoDatumu[i].stanje, x: i, label: ukupnaStanjaPoDatumu[i].datum})
            }

            var req = await fetch("api/stablo/praznici")
            var praznici = await req.json();

            var predictData = generisiPredikciju(ukupnaStanjaPoDatumu, praznici)

            for(var i = 0; i < predictData.length; i++) {
                var temp = predictData[i].label.split('/')
                var datum = new Date(temp[2], temp[1] - 1, temp[0]);
                for(var j = 0; j < praznici.length; j++) {
                    var praznik = new Date(praznici[j].datum)
                    if(datum.getDate() == praznik.getDate() && datum.getMonth() == praznik.getMonth() && datum.getYear() == praznik.getYear()) {
                        predictData[i].y *= praznici[j].pojacanje;
                    }
                    else if(datum.getDate() == praznik.getDate() && datum.getMonth() - 1 == praznik.getMonth() && datum.getYear() == praznik.getYear()) {
                        predictData[i].y /= praznici[j].pojacanje;
                    }
                }
            }

            setData(predictData);
            setLoading(false);
        }
        else {
            return [];
        }
    }, [show]);

    const generisiPredikciju = (ukupnaStanjaPoDatumu, praznici) => {
        var prviPon = new Date();
        prviPon.setDate(1);
        while(prviPon.getDay() != 1) {
            prviPon.setDate(prviPon.getDate() + 1);
        }

        // Sta ako je dan ciklusa negativan ??
        var danCiklusa = Math.ceil((new Date() - prviPon) / (1000 * 3600 * 24))

        var prviPonPrethodni = new Date();
        prviPonPrethodni.setMonth(prviPonPrethodni.getMonth() - 1)
        prviPonPrethodni.setDate(1);
        while(prviPonPrethodni.getDay() != 1) {
            prviPonPrethodni.setDate(prviPonPrethodni.getDate() + 1);
        }
        
        var datumCiklusaPrethodni = new Date(prviPonPrethodni.getTime());
        datumCiklusaPrethodni.setDate(datumCiklusaPrethodni.getDate() + danCiklusa)

        var prviPonSljedeci = new Date();
        prviPonSljedeci.setMonth(prviPonSljedeci.getMonth() + 1);
        prviPonSljedeci.setDate(1);
        while(prviPonSljedeci.getDay() != 1) {
            prviPonSljedeci.setDate(prviPonSljedeci.getDate() + 1);
        }

        var brojDanaTrenutnogCiklusa = Math.ceil((prviPonSljedeci - prviPon) / (1000 * 3600 * 24))
        var brojDanaPrethodnogCiklusa = Math.ceil((prviPon - prviPonPrethodni) / (1000 * 3600 * 24))

        var manjiBroj = brojDanaTrenutnogCiklusa < brojDanaPrethodnogCiklusa ? brojDanaTrenutnogCiklusa : brojDanaPrethodnogCiklusa

        var dataZaRegresiju = [];
        var temp1 = new Date(datumCiklusaPrethodni.getTime());
        for(var i = 0; i < 27; i++) {
            var found = false;
            for(var j = 0; j < ukupnaStanjaPoDatumu.length; j++) {

                var temp2 = new Date(ukupnaStanjaPoDatumu[j].datum);
                if(temp1.getFullYear() == temp2.getFullYear() && temp1.getMonth() == temp2.getMonth() && temp1.getDate() == temp2.getDate()) {
                    found = true;
                    //for(var k = 0; k < praznici.length; k++) {
                        //var praznik = new Date(praznici[k].datum)
                        //if(temp2.getDate() == praznik.getDate() && temp2.getMonth() == praznik.getMonth() && temp2.getYear() == praznik.getYear()) {
                        //    ukupnaStanjaPoDatumu[j].stanje /= praznici[k].pojacanje;
                        //}
                    }
                    dataZaRegresiju.push({ x: i, y: ukupnaStanjaPoDatumu[j].stanje, datum: temp1.toString()})
                }
            }
            if(!found) {
                setErr(true)
                return [];
            }
            temp1.setDate(temp1.getDate() + 1)
        }

        var dataZaRegresiju_A = []
        var dataZaRegresiju_B = []
        if(dataZaRegresiju.length > manjiBroj - danCiklusa) {
            dataZaRegresiju_A = dataZaRegresiju.slice(0, manjiBroj - danCiklusa - 1)
            dataZaRegresiju_B = dataZaRegresiju.slice(manjiBroj - danCiklusa, dataZaRegresiju.length)
        }

        else if(dataZaRegresiju.length == manjiBroj - danCiklusa) {
            dataZaRegresiju_A = dataZaRegresiju;
        }
        else {
            throw "nesto ne valja";
        }

        dataZaRegresiju_A = splitDataForRegression(dataZaRegresiju_A);
        dataZaRegresiju_B = splitDataForRegression(dataZaRegresiju_B);

        const modeliA = [];
        const modeliB = [];

        for(var i = 0; i < dataZaRegresiju_A.length; i++) {
            var degree = 5;
            if(dataZaRegresiju_A[i].length == 1) {
                dataZaRegresiju_A[i].push({ x: dataZaRegresiju_A[i][0].x + 1, y:  dataZaRegresiju_A[i][0].y - 2})
                degree = 1;
            }
            while(degree >= 0) {
                var x = PolynomialRegression.read(dataZaRegresiju_A[i], degree)
                if(!isNaN(x.getTerms()[0])) {
                    break;
                }
                degree--;
            }
            modeliA.push(x);
        }
        for(var i = 0; i < dataZaRegresiju_B.length; i++) {
            var degree = 10;
            //if(dataZaRegresiju_B[i].length == 1) {
                //dataZaRegresiju_B[i].push({x: dataZaRegresiju_B[i].x + 1, y: dataZaRegresiju_B[i].y - 2})
            //}
            while(degree >= 0) {
                var x = PolynomialRegression.read(dataZaRegresiju_B[i], degree)
                if(!isNaN(x.getTerms()[0])) {
                    break;
                }
                degree--;
            }
            modeliB.push(x);
        }

        var dataZaPredikcijuA = [];
        var dataZaPredikcijuB = [];

        if(brojDanaTrenutnogCiklusa > brojDanaPrethodnogCiklusa) {
            dataZaPredikcijuA = dataZaRegresiju_A.map(e => {
                var niz = []
                e.forEach(b => niz.push(b.x))
                return niz;
            });
            dataZaPredikcijuB = dataZaRegresiju_B.map(e => {
                var niz = []
                e.forEach(b => niz.push(b.x))
                return niz;
            });

            dataZaPredikcijuA.push([])
            var zadnjiA = dataZaPredikcijuA.length - 1
            var zadnjiB = dataZaPredikcijuB.length - 1

            var temp = dataZaRegresiju_A.length - 1
            var tempNiz = [dataZaRegresiju_A[0][0], dataZaRegresiju_A[temp][dataZaRegresiju_A[temp].length - 1]]
            modeliA.push(PolynomialRegression.read(tempNiz, 1))

            var brojac = dataZaPredikcijuA[zadnjiA - 1][dataZaPredikcijuA[zadnjiA - 1].length - 1] + 1
            var i = 0;
            while(brojac < 27 && i < 7) {
                dataZaPredikcijuA[zadnjiA].push(brojac);
                dataZaPredikcijuB[zadnjiB].pop();
                if(dataZaPredikcijuB[zadnjiB].length == 0) {
                    dataZaPredikcijuB.pop();
                    var zadnjiB = dataZaPredikcijuB.length - 1
                }
                brojac++;
                i++;
            }
        }

        var predictData = []

        for(var i = 0; i < dataZaPredikcijuA.length; i++) {
            for(var j = 0; j < dataZaPredikcijuA[i].length; j++) {
                var y = modeliA[i].predictY(modeliA[i].getTerms(), [dataZaPredikcijuA[i][j]]);
                predictData.push({ x: dataZaPredikcijuA[i][j], y: Math.round(y) })
            }
        }

        for(var i = 0; i < dataZaPredikcijuB.length; i++) {
            for(var j = 0; j < dataZaPredikcijuB[i].length; j++) {
                var y = modeliB[i].predictY(modeliB[i].getTerms(), [dataZaPredikcijuB[i][j]]);
                if(brojDanaTrenutnogCiklusa > brojDanaPrethodnogCiklusa) {
                    predictData.push({ x: dataZaPredikcijuB[i][j] + 7, y: Math.round(y) })
                }
                else {
                    predictData.push({ x: dataZaPredikcijuB[i][j], y: Math.round(y) })
                }
            }
        }

        var d = new Date();
        for(var i = 0; i < predictData.length; i++) {
            predictData[i].label = d.toLocaleDateString('en-GB')
            d.setDate(d.getDate() + 1)
        }

        return predictData;

    } 

    const splitDataForRegression = (data) => {
        var first = 0;
        var dataSplit = []
        for(var i = 1; i < data.length; i++) {
            if(data[i - 1].y < data[i].y) {
                dataSplit.push(data.slice(first, i))
                first = i;
            }
        }
        dataSplit.push(data.slice(first, data.length))
        return dataSplit;
    }

    const options = {
        theme: "light2", // "light1", "dark1", "dark2"
        animationEnabled: true,
        zoomEnabled: true,
        title: {
            text: ""
        },
        data: [{
            type: "area",
            dataPoints: data
        }]
    }

    return (
        <Modal size="lg" show={show} onHide={hideModal}>

            <Modal.Header closeButton>
                <Modal.Title>{node ? "Pregled predikcija za " + node.title : ""}</Modal.Title>
                <div
                    className="spinner-border mx-3"
                    role="status"
                    style={{ display: loading ? "block" : "none" }}
                ></div>
            </Modal.Header>

            <Modal.Body>
                <div>
                   { err ? <h2> Kasa nema dovoljno podataka za predikciju </h2> : <CanvasJSChart options={options}/>}
                </div>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="primary" onClick={() => {
                    hideModal();
                }}>
                    OK
                </Button>
            </Modal.Footer>

        </Modal>
    );
}*/