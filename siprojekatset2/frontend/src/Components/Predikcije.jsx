import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Calendar, utils } from 'react-modern-calendar-datepicker';
import 'react-modern-calendar-datepicker/lib/DatePicker.css';
import Forma from '../Utility/FormBuilderPredikcije'
import { getPredikcije, getChildrenSum, getIndexFromValuta  } from '../Utility/DistributivnaMreza'
import { dajNizZaValutu, vratiVrijednostIndex, dajVrijednostiZaValutu, dajIndexZaVrijednost} from "../Utility/StabloUI";
import CanvasJSReact from "../Utility/canvasjs.react";

export default function Predikcije(prop) {
    const { node, show, setShown, valutaVrijednosti } = prop;
    const [prikazi, setPrikazi] = useState(false)
    const [predikcije, setPredikcije] = useState({})
    const [brDana, setBrDana] = useState(0)
    const [dataZaGraf, setDataZaGraf] = useState([])
    const [valuta, setValuta] = useState("BAM")
    const [vrijednost, setVrijednost] = useState("2")
    const [loading, setLoading] = useState(true);
    const [isPredictingStanja, setIsPredictingStanja] = useState(false)
    const [ogranicenja, setOgranicenja] = useState({})
    const [predikcijaStanja, setPredikcijaStanja] = useState([])
    const [krajnjaStanja, setKrajnjaStanja] = useState([])
    const [prikaziGraf, setPrikaziGraf] = useState([])
    var CanvasJSChart = CanvasJSReact.CanvasJSChart;

    const hideModal = (e) => {
        setSelectedDay(utils().getToday())
        setShown(false);
        setPrikazi(false);
        setIsPredictingStanja(false);
        setLoading(true);
    };

    const dajPredikcijePoDanu = (vrijednosti) => {
        for (var i = 0; i < vrijednosti.length; i++)
            vrijednosti[i] = vrijednosti[i].split(",");

        return vrijednosti;
    }
    const dajPredikcijeZaValutu = (predikcije) => {
        let predikcijeVrijednosti = predikcije.split(";");
        return dajPredikcijePoDanu(predikcijeVrijednosti);
    }
    useEffect(async () => {
        if (show && node != null) {
            setLoading(true);
            const objekat = await getPredikcije(node.id);
            if (objekat != null) {
                objekat.predikcijebam = dajPredikcijeZaValutu(objekat.predikcijebam);
                objekat.predikcijeeur = dajPredikcijeZaValutu(objekat.predikcijeeur);
                objekat.predikcijeusd = dajPredikcijeZaValutu(objekat.predikcijeusd);
                objekat.predikcijehrk = dajPredikcijeZaValutu(objekat.predikcijehrk);
                objekat.predikcijegbp = dajPredikcijeZaValutu(objekat.predikcijegbp);
            }
            setPredikcije(objekat);
            setDataZaGraf(objekat);
        }
    }, [show])

    useEffect(() => {
        if(show && node != null && node.kasavaluta != null) {
            setVrijednost(node.kasavrijednost)

        }
    }, [node])

    useEffect(async () => {
        if(show && node != null) {
            var temp = await fetch("api/stablo/cvoratributi/" + node.id)
            if(1 * temp.status == 204) {
                setOgranicenja([0])
                return
            }
            var data = await temp.json()
            data.minbam = data.minbam.split(',')
            data.mineur = data.mineur.split(',')
            data.minusd = data.minusd.split(',')
            data.minhrk = data.minhrk.split(',')
            data.mingbp = data.mingbp.split(',')
            data.maxbam = data.maxbam.split(',')
            data.maxeur = data.maxeur.split(',')
            data.maxusd = data.maxusd.split(',')
            data.maxhrk = data.maxhrk.split(',')
            data.maxgbp = data.maxgbp.split(',')
            setOgranicenja(data);
        }
    }, [predikcije])

    useEffect(() => {
        if(show && node != null) {
            if(node.type == "Prodajno mjesto") {
                if(node.children.length == 0) {
                    return (<div> Prodajno mjesto nema kasa </div>)
                }
                var trenutnaStanja = []
                if(node.type == "Prodajno mjesto") {
                    trenutnaStanja = getChildrenSum(prop.treeData, node.id, undefined, valutaVrijednosti)
                }
                else {
                    trenutnaStanja = {trenbam: node.trenbam, treneur: node.treneur, trenusd: node.trenusd, trenhrk: node.trenhrk, trengbp: node.trengbp}
                }
                var nizPredikcija = dajNizZaValutu(valuta, [predikcije.predikcijebam, predikcije.predikcijeeur, predikcije.predikcijeusd, predikcije.predikcijehrk, predikcije.predikcijegbp])
                var nizStanja = [trenutnaStanja.trenbam, trenutnaStanja.treneur, trenutnaStanja.trenusd, trenutnaStanja.trenhrk, trenutnaStanja.trengbp][getIndexFromValuta(valuta)]
                if(ogranicenja != null) {
                    var ogranicenjaMinNiz = [ogranicenja.minbam, ogranicenja.mineur, ogranicenja.minusd, ogranicenja.minhrk, ogranicenja.mingbp][getIndexFromValuta(valuta)]
                    var ogranicenjaMaxNiz = [ogranicenja.maxbam, ogranicenja.maxeur, ogranicenja.maxusd, ogranicenja.maxhrk, ogranicenja.maxgbp][getIndexFromValuta(valuta)]
                }
                else {
                    var ogranicenjaMinNiz = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                    var ogranicenjaMaxNiz = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                }

                var predikcijaStanja = []
                var pocetnaStanja = []
                
                for(var i = 0; i < nizPredikcija.length; i++) {
                    predikcijaStanja.push([])
                    pocetnaStanja.push([])
                    for(var j = 0; j < nizPredikcija[i].length; j++) {
                        predikcijaStanja[i].push(0)
                        pocetnaStanja[i].push(0)
                        if(j == 0) {
                            pocetnaStanja[i][j] = nizStanja[i]
                            predikcijaStanja[i][j] = nizStanja[i] + 1 * nizPredikcija[i][j]
                        }
                        else {
                            pocetnaStanja[i][j] = pocetnaStanja[i][j] + 1 * nizPredikcija[i][j]
                            predikcijaStanja[i][j] = predikcijaStanja[i][j - 1] + 1 * nizPredikcija[i][j]
                        }
                        if(predikcijaStanja[i][j] < 1 * ogranicenjaMinNiz[i]) {
                            pocetnaStanja[i][j] = 1 * ogranicenjaMaxNiz[i];
                            predikcijaStanja[i][j] = 1 * ogranicenjaMaxNiz[i] + 1 * nizPredikcija[i][j];
                            if(predikcijaStanja[i][j] < 9) {
                                predikcijaStanja[i][j] = 0;
                                pocetnaStanja[i][j] = - 1 * nizPredikcija[i][j];
                            }
                        }
                        else if(predikcijaStanja[i][j] > 1 * ogranicenjaMaxNiz[i] && 1 * ogranicenjaMaxNiz[i] > 0) {
                            predikcijaStanja[i][j] = 1 * ogranicenjaMinNiz[i] + 1 * nizPredikcija[i][j];
                            pocetnaStanja[i][j] = 1 * ogranicenjaMinNiz[i]
                        }
                    }
                }
                if(isPredictingStanja) {
                    setDataZaGraf(predikcijaStanja)
                }
                setPredikcijaStanja(predikcijaStanja)
                
                setLoading(false)

                /* var svaPocetnaStanja = []
                for(var i = 0; i < 5; i++) {
                    svaPocetnaStanja.push([])
                    var nizVrijednosti = [valutaVrijednosti.bamvrijednosti, valutaVrijednosti.eurvrijednosti, valutaVrijednosti.usdvrijednosti, valutaVrijednosti.hrkvrijednosti, valutaVrijednosti.gbpvrijednosti]
                    for(var j = 0; j < nizVrijednosti[i].length; j++) {
                        svaPocetnaStanja[i].push([])
                        for(var k = 0; k < ; k++) {
                            svaPocetnaStanja[i][j]
                        }
                    }
                }*/
            }
            else {
                setLoading(false)
            }
        }
    }, [ogranicenja, valuta])

    useEffect(() => {
        if(isPredictingStanja) {
            setDataZaGraf(predikcijaStanja)
        }
        else {
            setDataZaGraf(predikcije)
        }
    }, [isPredictingStanja])

    useEffect(() => {
        if(show) {
            setPrikaziGraf(true)
        }
    }, [dataZaGraf])

    const [selectedDay, setSelectedDay] = useState(utils().getToday())

    const predikcijaZaDatum = (datum) => {
        setSelectedDay(datum)
        var newdate = datum.year + "/" + datum.month + "/" + datum.day;

        var trenutnoIzabraniDatum = new Date(newdate);

        if (predikcije == null) {
            setPrikazi(false)
            alert("Nema podataka")
            return
        }

        trenutnoIzabraniDatum.setHours(0, 0, 0, 0);

        const differenceInDays = (a, b) => Math.floor(
            (a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24)
        )

        var danasnjiDatum = new Date();
        var razlika = differenceInDays(trenutnoIzabraniDatum, danasnjiDatum);

        if (razlika >= 30 || razlika < 0) {
            setPrikazi(false)
            alert("Nema dostupnih podataka za odabrani datum")
            return
        }

        setPrikazi(true);
        setBrDana(razlika);
    }

    const getNaslov = () => "Pregled predikcija čvora " + (node != null ? node.title : "")

    useEffect(() => {
        if(show) {
            var vrijednosti = dajVrijednostiZaValutu(valuta, valutaVrijednosti)
            setVrijednost(vrijednosti[0])
        }
    }, [valuta])

    const generisiGraf = () => {
        if(show && prikaziGraf) {
            if(dataZaGraf == null) {
                return (<div>Učitavanje</div>)
            }
            var niz = [];
            var vrijednosti = [];
            var vrijednostiDropDown = []
            var index = 0;
            
            if(!isPredictingStanja) {
                if(node.kasavaluta == null) {
                    niz = dajNizZaValutu(valuta, [dataZaGraf.predikcijebam, dataZaGraf.predikcijeeur, dataZaGraf.predikcijeusd, dataZaGraf.predikcijehrk, dataZaGraf.predikcijegbp ])
                    vrijednosti = dajVrijednostiZaValutu(valuta, valutaVrijednosti)
                    vrijednostiDropDown = vrijednosti.map(e => <option value={e}>{e + " " + valuta}</option>)
                    index = vratiVrijednostIndex(valutaVrijednosti, vrijednost, valuta)
                }
                else {
                    niz = dajNizZaValutu(node.kasavaluta, [dataZaGraf.predikcijebam, dataZaGraf.predikcijeeur, dataZaGraf.predikcijeusd, dataZaGraf.predikcijehrk, dataZaGraf.predikcijegbp ])
                    vrijednosti = dajVrijednostiZaValutu(node.kasavaluta, valutaVrijednosti)
                    vrijednostiDropDown = (<option> {node.kasavaluta + " " + node.kasavrijednost} </option>)
                    index = vratiVrijednostIndex(valutaVrijednosti, node.kasavrijednost, node.kasavaluta)
                    
                }
            }
            else {
                
                niz = dataZaGraf;
                vrijednosti = dajVrijednostiZaValutu(valuta, valutaVrijednosti)
                vrijednostiDropDown = vrijednosti.map(e => <option value={e}>{e + " " + valuta}</option>)
                index = vratiVrijednostIndex(valutaVrijednosti, vrijednost, valuta)
            }

            if(index == undefined) {
                index = 0
            }

            var points = []
            var datum = new Date()
            for(var i = 0; i < niz[index].length; i++) {
                datum.setDate(datum.getDate() + 1)
                var y = parseInt(niz[index][i])
                points.push({x: i, y: y, label: datum.toLocaleDateString('en-GB')})
            }
            var options = {
                theme: "light2", // "light1", "dark1", "dark2"
                animationEnabled: true,
                zoomEnabled: true,
                title: {
                    text: ""
                },
                data: [{
                    type: "line",
                    dataPoints: points
                }]
            }
            if(isPredictingStanja) {
                var razlicito = true
                var nizVrijednosti = [valutaVrijednosti.bamvrijednosti, valutaVrijednosti.eurvrijednosti, valutaVrijednosti.usdvrijednosti, valutaVrijednosti.hrkvrijednosti, valutaVrijednosti.gbpvrijednosti][getIndexFromValuta(valuta)]
                var ogranicenjaMinNiz = [ogranicenja.minbam, ogranicenja.mineur, ogranicenja.minusd, ogranicenja.minhrk, ogranicenja.mingbp][getIndexFromValuta(valuta)]
                var ogranicenjaMaxNiz = [ogranicenja.maxbam, ogranicenja.maxeur, ogranicenja.maxusd, ogranicenja.maxhrk, ogranicenja.maxgbp][getIndexFromValuta(valuta)]
                var index = dajIndexZaVrijednost(nizVrijednosti, vrijednost)
                var minZaVrijednost = ogranicenjaMinNiz[index]
                var maxZaVrijednost = ogranicenjaMaxNiz[index]
                var datum = new Date()
                var minNiz = []
                var maxNiz = []

                

                if(minZaVrijednost == maxZaVrijednost) {
                    razlicito = false
                }
                if(razlicito) {
                    for(var i = 0; i < 30; i++) {
                        datum.setDate(datum.getDate() + 1)
                        minNiz.push({x: i, y: 1 * minZaVrijednost, label: datum.toLocaleDateString('en-GB')})
                    }

                    options.data.push({dataPoints: minNiz, type: "area", color: "red"})

                    for(var i = 0; i < 30; i++) {
                        datum.setDate(datum.getDate() + 1)
                        maxNiz.push({x: i, y: 1 * maxZaVrijednost, label: datum.toLocaleDateString('en-GB')})
                    }

                    options.data.push({dataPoints: maxNiz, type: "line", color: "red"})
                }
            }
            return (
                <>
                    <div className="row">
                        <div className="col">
                            {node.kasavaluta == null && <Form.Select
                                className="custom-select"
                                value={vrijednost}
                                onChange={(e) => {
                                    setVrijednost(e.target.value)
                                }}>
                                    {vrijednostiDropDown}
                            </Form.Select>}
                            <CanvasJSChart options={options}/>
                        </div>
                    </div>
                </>
            )
        }
    }

    return (
        <Modal size="xl" show={show} onHide={hideModal}>
            <Modal.Header>
                <Modal.Title>{getNaslov()}</Modal.Title>
                <div
                    className="spinner-border mx-3"
                    role="status"
                    style={{ display: loading ? "block" : "none" }}
                ></div>
            </Modal.Header>
            {!loading && <Modal.Body className="show-grid">
                <div className="container">
                    <div className="row">
                        <div className="col my-auto">
                            <Calendar
                                value={selectedDay}
                                onChange={predikcijaZaDatum}
                                colorPrimary="#0d6efd"
                                shouldHighlightWeekends
                            />
                        </div>
                        <div className="col">
                            {
                                prikazi && 
                                <Forma 
                                    data={predikcije}
                                    brDana={brDana} 
                                    valutaVrijednosti={valutaVrijednosti} 
                                    dataZaGraf={dataZaGraf} 
                                    setValutaMain={setValuta}
                                    node={node}
                                    isPredictingStanja={isPredictingStanja}
                                    setIsPredictingStanja={setIsPredictingStanja}
                                    setPrikaziGraf={setPrikaziGraf}
                                />
                            }
                        </div>
                    </div>
                    {prikazi && generisiGraf()}
                </div>
            </Modal.Body>}
            <Modal.Footer>
                <Button onClick={hideModal}>OK</Button>
            </Modal.Footer>

        </Modal>
    );
}
