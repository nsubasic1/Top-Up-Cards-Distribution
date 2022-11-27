import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { Calendar, utils } from 'react-modern-calendar-datepicker';
import 'react-modern-calendar-datepicker/lib/DatePicker.css';
import Forma from '../Utility/FormBuilder'
import { getVrijemeTransakcijeByIdCvor, getStanje, getTransakcije } from '../Utility/DistributivnaMreza'
import DataTable from 'react-data-table-component'

export default function Kalendar(prop) {
    const { node, show, setShown, valutaVrijednosti } = prop;
    const [data, setData] = useState([])
    const [vrijednostiDan, setVrijednostiDan] = useState({})
    const [pocetno, setPocetno] = useState({})
    const [stanje, setStanje] = useState({})
    const [prikazi, setPrikazi] = useState(false)
    const [izabraniString, setIzabraniString] = useState("")
    const [noviString, setNoviString] = useState("")
    const [transakcije, setTransakcije] = useState(null)
    const [toggle, setToggle] = useState("1")
    const kolone = [
        {
            name: 'Vrijeme',
            selector: row => row.datumString.substring(row.datumString.indexOf('T') + 1),
            compact: true,
        },
        {
            name: 'Promjena stanja',
            selector: row => row.vrsta == "podizanje" ? row.stanje * -1 : row.stanje * 1,
            compact: true,
        },
        {
            name: 'Vrijednost',
            selector: row => row.vrijednost,
            compact: true,
        },
        {
            name: 'Valuta',
            selector: row => row.valuta,
            compact: true,
        }
    ]

    const hideModal = (e) => {
        setSelectedDay(utils().getToday())
        setTransakcije(null)
        setShown(false);
        setPrikazi(false);
    };

    const [selectedDay, setSelectedDay] = useState(utils().getToday())

    useEffect(async () => {
        if (data.length <= 1) {
            setTransakcije(null)
            setPrikazi(false)

            if(show)
                alert("Nema dostupnih podataka za odabrani datum")
        }
        else {
            setVrijednostiDan(data[1])
            setPocetno(data[0])
            setToggle("1")
            setStanje(vrijednostiDan)
            setTransakcije(await getTransakcije(node.id, noviString, izabraniString))

        }
    }, [data])

    const historijaZaDatum = async (datum) => {
        setSelectedDay(datum)
        var newdate = datum.year + "/" + datum.month + "/" + datum.day;

        var noviDatum = new Date(newdate);
        noviDatum.setHours(0, 0, 0, 0);

        var izabraniDatum = new Date(new Date(newdate).setDate(noviDatum.getDate() + 1));

        const offset = izabraniDatum.getTimezoneOffset()

        var noviDatumString = new Date(noviDatum.getTime() - (offset * 60 * 1000)).toISOString().split('T')[0] + "T00:00:00";

        var izabraniDatumString = new Date(izabraniDatum.getTime() - (offset * 60 * 1000)).toISOString().split('T')[0] + "T00:00:00";

        setIzabraniString(izabraniDatumString)
        setNoviString(noviDatumString)

        setData(await getStanje(node.id, noviDatumString, izabraniDatumString));

    }

    useEffect(async () => {
        setStanje(vrijednostiDan)
    }, [vrijednostiDan])

    useEffect(async () => {
        if (stanje.bamvrijednosti != null)
            setPrikazi(true)
    }, [stanje])

    const getNaslov = () => "Historija čvora " + (node != null ? node.title : "")

    return (
        <Modal size="xl" show={show} onHide={hideModal}>
            <Modal.Header>
                <Modal.Title>{getNaslov()}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="show-grid">
                <div className="container">
                    <div className="row">
                        <div className="col my-auto">
                            <Calendar
                                value={selectedDay}
                                onChange={historijaZaDatum}
                                maximumDate={utils().getToday()}
                                colorPrimary="#0d6efd"
                                shouldHighlightWeekends
                            />
                        </div>
                        <div className="col">
                            {prikazi && <select
                                className="form-select"
                                value={toggle}
                                onChange={(e) => {
                                        
                                    setToggle(e.target.value)
                                    if (e.target.value == "0") setStanje(pocetno)
                                    else setStanje(vrijednostiDan)
                                }}>
                                <option value="0">Prikazi pocetno stanje</option>
                                <option value="1">Prikazi krajnje stanje</option>
                            </select>}
                            {
                                prikazi && <Forma data={stanje} />
                            }
                        </div>
                        <div className="col-12">
                            {prikazi && <h3>Transakcije tokom dana : </h3>}
                            <DataTable columns={kolone} data={transakcije ? transakcije : []} pagination />
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={hideModal}>OK</Button>
            </Modal.Footer>

        </Modal>
    );





}
