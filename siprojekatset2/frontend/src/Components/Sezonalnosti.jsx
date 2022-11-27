
import React, { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { Modal,Form, Button } from "react-bootstrap";
import { useAlert } from 'react-alert'
export default function Sezonalnosti(prop) {
    const { node, show, setShown } = prop;
    const [otvorenModal, setOtvorenModal] = useState(false);
    const [loading, setLoading] = useState(true);

    const [broj, setBroj]=useState();

    const [startDate, setStartDate] = useState(new Date());
    const [startDate2, setStartDate2] = useState(new Date());
    const [otvorenoBrisanje, setOtvorenoBrisanje]=useState();

    const [nazivSezonalnosti, setNazivSezonalnosti]=useState('');
    const [datumSezonalnosti, setDatumSezonalnosti]=useState(new Date());
    const [pojacanjeSezonalnosti, setPojacanjeSezonalnosti]=useState('');

    const [sezonalnosti, setSezonalnosti]= useState([]);
    
    useEffect(async () => {
      var data = await fetch("api/stablo/praznici");
      var niz = await data.json();
      setSezonalnosti(niz);
      setLoading(false);
    }, [])

    function potvrdaBrisanja(e) {
      setBroj(e.id)
      setOtvorenoBrisanje(true);
    }


     // Mapiranje vrijednosti
    const mapirajVrijednosti = () => {
     return sezonalnosti.map((e, i) => {
      return(
        <div className="container">
          <div className="row">
            <div style={{width: 80 + "%"}}>
              <button
                disabled
                type="button"
                value={e.naziv}
                className="list-group-item list-group-item-action"
              >
                {'Naziv: '+e.naziv}
                <br></br>
                {'Datum: '+ (new Date(e.datumpocetni)).toLocaleDateString('en-GB')+' - '+(new Date(e.datumkrajnji)).toLocaleDateString('en-GB')}
                <br></br>
                {'Pojacanje: ' + Math.round(e.pojacanje * 100 - 100) + '%'}
              </button>
            </div>
            <div style={{width: 20 + "%"}}>
              <Button className="w-100" variant="secondary" onClick={() => potvrdaBrisanja(e)}>Obrisi</Button> 
            </div>
          </div>
        </div>
      )
    });
  }

    //Dodavanje sezonalnosti
    async function dodajVrijednosti() {
      const ids=Math.floor(Math.random()*10000)+1;
      setLoading(true)
      setDatumSezonalnosti(startDate)
      
      const novaSezonalnost={id:ids,naziv:nazivSezonalnosti, datumpocetni:startDate.toISOString(),datumkrajnji:startDate2.toISOString(), pojacanje: (pojacanjeSezonalnosti / 100. + 1).toString()} 
      setSezonalnosti([...sezonalnosti, novaSezonalnost])

      await fetch("api/praznik/post", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(novaSezonalnost)
      })
      setLoading(false)
      setOtvorenModal(false)
    }
    //Brisanje sezonalnosti
    const brisanje = async (id) =>{
      setLoading(true);
      await fetch("api/praznik/delete/" + id, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
      });
      setSezonalnosti(sezonalnosti.filter((sez)=>sez.id!==id))
      setLoading(false);
      setOtvorenoBrisanje(false)
    }
    return (
    <div style={{width: 50 + '%', "minWidth": "500px", margin: 'auto'}}>
     <div className="row">
         <div className="col">
            <Form.Group  className="mb-3" controlid="formBasicOpis">
              {
          sezonalnosti.length>0 ? mapirajVrijednosti() : 
          (<div
            className="spinner-border mx-3"
            role="status"
            style={{ display: loading ? "block" : "none" }}
          ></div>)
              }
            <div style={{padding: "10px"}}>
          <button type="button" onClick={() => setOtvorenModal(true)} className="btn btn-primary w-100">Dodaj sezonalnost</button>
            </div>
            </Form.Group>
         </div>
         

         {
           //Modal dodavanja sezonanosti
         }
    <Modal show={otvorenModal} onHide={() => setOtvorenModal(false)}> 
    <Modal.Header>Definisanje parametara</Modal.Header>
          <Modal.Body>
            <Form.Group>
            <Form.Label>Naziv</Form.Label>
            <Form.Control type='text' 
            required
            value={nazivSezonalnosti}
            onChange={(e) => {
              setNazivSezonalnosti(e.target.value);
            }}
            />

            <Form.Label>Datum</Form.Label>
            <Form.Group>
              <div style={{display:'inline-flex'}}>
            <DatePicker selected={startDate} onChange={(date) => setStartDate(date)}/>
            <span> do </span>
            <DatePicker selected={startDate2} onChange={(date) => setStartDate2(date)}/>
            </div>
            </Form.Group>
            <Form.Label>Pojačanje(%)</Form.Label>
            <Form.Control type='text'
             required
             value={pojacanjeSezonalnosti}
             onChange={(e) => {
               setPojacanjeSezonalnosti(e.target.value);
             }}
             />
        
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
          <Button variant="secondary" onClick={() => setOtvorenModal(false)}>
              Zatvori
            </Button>
            <Button variant="primary" onClick={() => dodajVrijednosti()}>
              Dodaj
            </Button>
            <div
              className="spinner-border mx-3"
              role="status"
              style={{ display: loading ? "block" : "none" }}
            ></div>
          </Modal.Footer>
    </Modal>

     {
     //Modal brisanje sezonalnosti
     }
    <Modal show={otvorenoBrisanje} onHide={()=>setOtvorenoBrisanje(false)}>
      <Modal.Header>
        <Form.Label>Brisanje sezonalnosti</Form.Label>
      </Modal.Header>
      <Modal.Body>
        <Form.Label>Da li ste sigurni da zelite obrisati sezonalnost?</Form.Label>
      </Modal.Body>
      <Modal.Footer>
      <Button variant="secondary" onClick={() => setOtvorenoBrisanje(false)}>
              Ne
            </Button>
            <Button variant="primary" onClick={()=>brisanje(broj)}>
              Da
            </Button>
            <div
              className="spinner-border mx-3"
              role="status"
              style={{ display: loading ? "block" : "none" }}
            ></div>
      </Modal.Footer>
    </Modal>
       </div>
      </div>
    );}

 