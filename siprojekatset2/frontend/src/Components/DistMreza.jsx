import React, { useEffect, useState } from "react";
import SortableTree from "@nosferatu500/react-sortable-tree";
import "@nosferatu500/react-sortable-tree/style.css";
import {
    getMreza,
    getMrezaFromDb,
    writeTreeToDb,
} from "../Utility/DistributivnaMreza";
import { DropdownButton, Dropdown, Button } from "react-bootstrap";
import { parseValues, getVrijednostiFromDb, getMrezaLengthFromDb } from "../Utility/DistributivnaMreza";
import DistInfo from "./DistInfo";
import DistCentar from "./DistCentar";
import ProdajnoMjestoInfo from "./ProdajnoMjestoInfo";
import ProdajnoMjesto from "./ProdajnoMjesto";
import { BsShop, BsTruck } from "react-icons/bs";
import { FaCashRegister } from "react-icons/fa";
import ObrisiCvor from "./ObrisiCvor";
import Kasa from "./Kasa";
import KasaInfo from "./KasaInfo";
import { getRole } from "../Utility/UserControl";
import KorisniciAdd from "./KorisniciAdd";
import KasaPromjenaStanja from "./KasaPromjenaStanja";
import NarudzbaAdd from "./NarudzbaAdd";
import IzmjeniStanje from "./DistStanje";
import Kalendar from "./Kalendar";
import OrdersCvor from "./OrdersCvor";
import OfflinePredikcije from "./Predikcije";
import PostavkeProdajnoMjesto from "./PostavkeProdajnoMjesto";
import PostavkeDistributivniCentar from "./PostavkeDistributivniCentar";
import CvorOgranicenjaKartice from "./CvorOgranicenjaKartice"

export default function DistMreza() {
    const [areEnabled, setAreEnabled] = useState([])
    const [treeData, setTreeData] = useState({});
    const [node, setNode] = useState(null);
    const [showDCInfo, setShowDCInfo] = useState(false);
    const [showProdajnoInfo, setShowProdajnoInfo] = useState(false);
    const [showDCAdd, setShowDCAdd] = useState(false);
    const [showProdajnoMjestoAdd, setShowProdajnoMjestoAdd] = useState(false);
    const [showPostavkeProdajnoMjesto, setShowPostavkeProdajnoMjesto] = useState(false);
    const [showPostavkeDistributivniCentar, setShowPostavkeDistributivniCentar] = useState(false);
    const [edit, setEdit] = useState(false);
    const [showKasa, setShowKasa] = useState(false);
    const [showKasaInfo, setShowKasaInfo] = useState(false);
    const [showKorisniciAdd, setShowKorisniciAdd] = useState(false);
    const [showDeletePrompt, setShowDeletePrompt] = useState(false);
    const [markDelete, setMarkDelete] = useState(false);
    const [rerenderTree, setRerenderTree] = useState(false);
    const [loading, setLoading] = useState(false);
    const [kasaPromjena, setKasaPromjena] = useState(false);
    const [showNarudzbaAdd, setShowNarudzbaAdd] = useState(false);
    const [showIzmjeniStanje, setShowIzmjeniStanje] = useState(false);
    const [valutaVrijednosti, setValutaVrijednosti] = useState();
    const [showKalendar, setShowKalendar] = useState(false);
    const [showPredikcije, setShowPredikcije] = useState(false);
    const [showOrders, setShowOrders] = useState(false);
    const [showOfflinePredikcije, setShowOfflinePredikcije] = useState(false);
    var aktivirani = []
    const [showCvorOgrKartice, setShowCvorOgrKartice] = useState(false);

    useEffect(async () => {
        var tree = await getMrezaFromDb();
        var vrijednosti = await getVrijednostiFromDb();
        if(tree.length == 0) {
            tree.push({title: "Nemate dodijeljenih cvorova"});
        }
        setValutaVrijednosti(vrijednosti);
        setTreeData(tree);
    }, []);

    const onclickHandle = async () => {
        if (getRole() === 'user') {
            alert("Korisnik nema pravo snimanja stanja!");
            return;
        }
        setLoading(true);
        await writeTreeToDb(treeData);
        parseValues(treeData[0]);
        setTreeData([treeData[0]]);
        setLoading(false);
        alert("Podaci uspjesno spaseni!");
    };
    function azurirajID(node) {
        if (!node.children) return;

        for (let dijete of node.children) {
            dijete.parentId = node.id;
            azurirajID(dijete);
        }
    }

    useEffect(() => {
        if (markDelete) {
            brisanjeCvora(treeData[0]);
            setMarkDelete(false);
        }
    }, [markDelete]);


    useEffect(() => {
        if (!treeData[0]) return;
        azurirajID(treeData[0]);
    }, [treeData]);

    useEffect(async () => {
        //umjesto ovog treba povući stanja svih cvorova iz baze(enabled/disabled)
        var length = await getMrezaLengthFromDb()
        //zakucani na true jer u bazi nema stanja
        setAreEnabled(new Array(length).fill(true))
    }, [])

    const returnButtons = (node) => {
        if (getRole() != "user") {
            if (node.type == "Distributivni centar") {
                return (
                    <>
                        <DropdownButton size="sm" title="" variant={areEnabled[node.id - 1] ? "primary" : "secondary"}>
                            <Dropdown.Item
                                onClick={() => {
                                    setNode(node);
                                    setShowDCInfo(true);
                                }}
                            >
                                Informacije
                            </Dropdown.Item>
                            <Dropdown.Item
                                onClick={() => {
                                    var fresh = [...areEnabled]
                                    fresh[node.id - 1] = !fresh[node.id - 1]
                                    setAreEnabled(fresh)
                                }}
                            >
                                {areEnabled[node.id - 1] ? <>Deaktiviraj čvor</> : <>Aktiviraj čvor</> }
                            </Dropdown.Item>
                            {areEnabled[node.id - 1] && <>
                                <Dropdown.Divider />
                                <Dropdown.Item
                                    onClick={() => {
                                        setEdit(false);
                                        setNode(node);
                                        setShowDCAdd(true);
                                    }}
                                >
                                    Kreiraj distributivni centar
                                </Dropdown.Item>
                                <Dropdown.Item
                                    onClick={(e) => {
                                        setEdit(false);
                                        setNode(node);
                                        setShowProdajnoMjestoAdd(true);
                                    }}
                                >
                                    Kreiraj prodajno mjesto
                                </Dropdown.Item>
                                <Dropdown.Item
                                    onClick={(e) => {
                                        //setEdit(false);
                                        setNode(node);
                                        setShowNarudzbaAdd(true);
                                    }}
                                >
                                    Kreiraj narudžbu
                                </Dropdown.Item>
                                <Dropdown.Item
                                    onClick={(e) => {
                                        //setEdit(false);
                                        setNode(node);
                                        setShowOrders(true);
                                    }}
                                >
                                    Prikaži narudžbe
                                </Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item
                                    onClick={(e) => {
                                        setEdit(true);
                                        setNode(node);
                                        setShowDCAdd(true);
                                    }}
                                >
                                    Izmijeni distributivni centar
                                </Dropdown.Item>
                                <Dropdown.Item
                                    onClick={() => {
                                        setEdit(false);
                                        setNode(node);
                                        setShowIzmjeniStanje(true);
                                    }}
                                >
                                    Izmijeni stanje
                                </Dropdown.Item>
                                <Dropdown.Item
                                    onClick={(e) => {
                                        setNode(node);
                                        setShowKalendar(true);
                                    }}
                                >
                                    Prikaži historiju čvora
                                </Dropdown.Item>
                                <Dropdown.Item
                                    onClick={(e) => {
                                        setNode(node);
                                        setShowDeletePrompt(true);
                                    }}
                                >
                                    Obriši distributivni centar
                                </Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item
                                    onClick={(e) => {
                                        setNode(node);
                                        setShowKorisniciAdd(true);
                                    }}
                                >
                                    Dodaj korisnike
                                </Dropdown.Item>
                                <Dropdown.Item
                                    onClick={(e) => {
                                        setNode(node);
                                        setShowOfflinePredikcije(true);
                                    }}
                                >
                                    Pogledaj predikcije
                                </Dropdown.Item>
                                <Dropdown.Item
                                onClick={(e) => {
                                    setNode(node);
                                    setShowPostavkeDistributivniCentar(true);
                                }}
                            >
                                Postavke
                            </Dropdown.Item>

                            <Dropdown.Divider />
                            <Dropdown.Item
                                onClick={(e) => {
                                    setNode(node);
                                    setShowCvorOgrKartice(true);
                                }}
                            >
                                Postavi ograničenja za kartice
                            </Dropdown.Item>
                            </>}

                            
                        </DropdownButton>
                    </>
                );
            } else if (node.type == "Prodajno mjesto") {
                return (
                    <>
                        <DropdownButton size="sm" title="" variant={areEnabled[node.id - 1] ? "primary" : "secondary"}>
                            <Dropdown.Item
                                onClick={(e) => {
                                    setNode(node);
                                    setShowProdajnoInfo(true);
                                }}
                            >
                                Informacije
                            </Dropdown.Item>
                            <Dropdown.Item
                                onClick={() => {
                                    var fresh = [...areEnabled]
                                    fresh[node.id - 1] = !fresh[node.id - 1]
                                    setAreEnabled(fresh)
                                }}
                            >
                                {areEnabled[node.id - 1] ? <>Deaktiviraj čvor</> : <>Aktiviraj čvor</>}
                            </Dropdown.Item>
                            {areEnabled[node.id - 1] && <>
                                <Dropdown.Divider />
                                <Dropdown.Item
                                    onClick={(e) => {
                                        setEdit(false);
                                        setNode(node);
                                        setShowKasa(true);
                                    }}
                                >
                                    Dodaj kasu
                                </Dropdown.Item>
                                <Dropdown.Item
                                    onClick={(e) => {
                                        //setEdit(false);
                                        setNode(node);
                                        setShowNarudzbaAdd(true);
                                    }}
                                >
                                    Kreiraj narudžbu
                                </Dropdown.Item>
                                <Dropdown.Item
                                    onClick={(e) => {
                                        //setEdit(false);
                                        setNode(node);
                                        setShowOrders(true);
                                    }}
                                >
                                    Prikaži narudžbe
                                </Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item
                                    onClick={(e) => {
                                        setEdit(true);
                                        setNode(node);
                                        setShowProdajnoMjestoAdd(true);
                                    }}
                                >
                                    Izmijeni prodajno mjesto
                                </Dropdown.Item>
                                <Dropdown.Item
                                    onClick={(e) => {
                                        setNode(node); setShowKalendar(true);
                                    }}
                                >
                                    Prikaži historiju čvora
                                </Dropdown.Item>
                                <Dropdown.Item
                                    onClick={(e) => {
                                        setNode(node);
                                        setShowDeletePrompt(true);
                                    }}
                                >
                                    Obriši prodajno mjesto
                                </Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item
                                    onClick={(e) => {
                                        setNode(node);
                                        setShowKorisniciAdd(true);
                                    }}
                                >
                                    Dodaj korisnike
                                </Dropdown.Item>
                                <Dropdown.Item
                                    onClick={(e) => {
                                        setNode(node);
                                        setShowOfflinePredikcije(true);
                                    }}
                                >
                                    Pogledaj predikcije
                                </Dropdown.Item>
                                <Dropdown.Item
                                onClick={(e) => {
                                    setNode(node);
                                    setShowPostavkeProdajnoMjesto(true);
                                }}
                            >
                                Postavke
                            </Dropdown.Item>

                            <Dropdown.Divider />
                            <Dropdown.Item
                                onClick={(e) => {
                                    setNode(node);
                                    setShowCvorOgrKartice(true);
                                }}
                            >
                                Postavi ograničenja za kartice
                            </Dropdown.Item>
                                </>}
                        </DropdownButton>
                    </>
                );
            }
            return (
                <>
                    <DropdownButton size="sm" title="" variant={areEnabled[node.id - 1] ? "primary" : "secondary"}>
                        <Dropdown.Item
                            onClick={(e) => {
                                setNode(node);
                                setShowKasaInfo(true);
                            }}
                        >
                            Informacije
                        </Dropdown.Item>
                        <Dropdown.Item
                            onClick={() => {
                                var fresh = [...areEnabled]
                                fresh[node.id - 1] = !fresh[node.id - 1]
                                setAreEnabled(fresh)
                            }}
                        >
                            {areEnabled[node.id - 1] ? <>Deaktiviraj čvor</> : <>Aktiviraj čvor</>}
                        </Dropdown.Item>
                        {areEnabled[node.id - 1] && <>
                            <Dropdown.Divider />
                            <Dropdown.Item
                                onClick={(e) => {
                                    setEdit(true);
                                    setNode(node);
                                    setShowKasa(true);
                                }}
                            >
                                Izmijeni kasu
                            </Dropdown.Item>


                            <Dropdown.Item
                                onClick={(e) => {
                                    setNode(node);
                                    setKasaPromjena(true);
                                }}
                            >
                                Promjeni stanje
                            </Dropdown.Item>
                            <Dropdown.Item
                                onClick={(e) => {
                                    setNode(node);
                                    setShowKalendar(true);
                                }}
                            >
                                Prikaži historiju čvora
                            </Dropdown.Item>
                            <Dropdown.Item
                                onClick={(e) => {
                                    //setEdit(false);
                                    setNode(node);
                                    setShowOrders(true);
                                }}
                            >
                                Prikaži narudžbe
                            </Dropdown.Item>
                            <Dropdown.Item
                                onClick={(e) => {
                                    setNode(node);
                                    setShowDeletePrompt(true);
                                }}
                            >
                                Obriši kasu
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item
                                onClick={(e) => {
                                    setNode(node);
                                    setShowKorisniciAdd(true);
                                }}
                            >
                                Dodaj korisnike
                            </Dropdown.Item>
                            <Dropdown.Item
                                onClick={(e) => {
                                    setNode(node);
                                    setShowOfflinePredikcije(true);
                                }}
                            >
                                Pogledaj predikcije
                            </Dropdown.Item>
                        </>}
                        </DropdownButton>
                    </>
                );
        } else {
            if (node.type == "Distributivni centar") {
                return (
                    <>
                        <DropdownButton size="sm" title="" variant={areEnabled[node.id - 1] ? "primary" : "secondary"}>
                            <Dropdown.Item
                                onClick={() => {
                                    setNode(node);
                                    setShowDCInfo(true);
                                }}
                            >
                                Informacije
                            </Dropdown.Item>
                            <Dropdown.Item
                                onClick={() => {
                                    var fresh = [...areEnabled]
                                    fresh[node.id - 1] = !fresh[node.id - 1]
                                    setAreEnabled(fresh)
                                }}
                            >
                                {areEnabled[node.id - 1] ? <>Deaktiviraj čvor</> : <>Aktiviraj čvor</>}
                            </Dropdown.Item>
                            {areEnabled[node.id - 1] && <>
                                <Dropdown.Item
                                    onClick={(e) => {
                                        //setEdit(false);
                                        setNode(node);
                                        setShowNarudzbaAdd(true);
                                    }}
                                >
                                    Kreiraj narudžbu
                                </Dropdown.Item>
                                <Dropdown.Item
                                    onClick={(e) => {
                                        setNode(node);
                                        setShowKalendar(true);
                                    }}
                                >
                                    Prikaži historiju čvora
                                </Dropdown.Item>
                                <Dropdown.Item
                                    onClick={(e) => {
                                        setNode(node);
                                        setShowOfflinePredikcije(true);
                                    }}
                                >
                                    Pogledaj predikcije
                                </Dropdown.Item></>}
                        </DropdownButton>
                    </>
                );
            } else if (node.type == "Prodajno mjesto") {
                return (
                    <>
                        <DropdownButton size="sm" title="" variant={areEnabled[node.id - 1] ? "primary" : "secondary"}>
                            <Dropdown.Item
                                onClick={(e) => {
                                    setNode(node);
                                    setShowProdajnoInfo(true);
                                }}
                            >
                                Informacije
                            </Dropdown.Item>
                            <Dropdown.Item
                                onClick={(e) => {
                                    setNode(node);
                                    setShowNarudzbaAdd(true);
                                }}
                            >
                                Kreiraj narudžbu
                            </Dropdown.Item>
                            <Dropdown.Item
                                onClick={(e) => {
                                    setNode(node);
                                    setShowKalendar(true);
                                }}
                            >
                                Prikaži historiju čvora
                            </Dropdown.Item>
                            <Dropdown.Item
                                onClick={(e) => {
                                    setNode(node);
                                    setShowOfflinePredikcije(true);
                                }}
                            >
                                Pogledaj predikcije
                            </Dropdown.Item>
                            {areEnabled[node.id - 1] && <>
                                <Dropdown.Item
                                    onClick={(e) => {
                                        //setEdit(false);
                                        setNode(node);
                                        setShowNarudzbaAdd(true);
                                    }}
                                >
                                    Kreiraj narudžbu
                                </Dropdown.Item>
                                <Dropdown.Item
                                    onClick={(e) => {
                                        setNode(node);
                                        setShowKalendar(true);
                                    }}
                                >
                                    Prikaži historiju čvora
                                </Dropdown.Item>
                                <Dropdown.Item
                                    onClick={(e) => {
                                        setNode(node);
                                        setShowOfflinePredikcije(true);
                                    }}
                                >
                                    Pogledaj offline predikcije
                                </Dropdown.Item>
                                <Dropdown.Item
                                    onClick={(e) => {
                                        setNode(node);
                                        setShowPredikcije(true);
                                    }}
                                >
                                    Pogledaj predikcije
                                </Dropdown.Item></>}
                        </DropdownButton>
                    </>
                );
            }
            return (
                <>
                    <DropdownButton size="sm" title="" variant={areEnabled[node.id - 1] ? "primary" : "secondary"}>

                        <Dropdown.Item
                            onClick={(e) => {
                                setNode(node);
                                setShowKasaInfo(true);
                            }}
                        >
                            Informacije
                        </Dropdown.Item>
                        <Dropdown.Item
                            onClick={() => {
                                var fresh = [...areEnabled]
                                fresh[node.id - 1] = !fresh[node.id - 1]
                                setAreEnabled(fresh)
                            }}
                        >
                            {areEnabled[node.id - 1] ? <>Deaktiviraj čvor</> : <>Aktiviraj čvor</>}
                        </Dropdown.Item>
                        {areEnabled[node.id - 1] && <>
                            <Dropdown.Item
                                onClick={(e) => {
                                    setNode(node);
                                    setShowKalendar(true);
                                }}
                            >
                                Prikaži historiju čvora
                            </Dropdown.Item>
                            <Dropdown.Item
                                onClick={(e) => {
                                    setNode(node);
                                    setShowOfflinePredikcije(true);
                                }}
                            >
                                Pogledaj predikcije
                            </Dropdown.Item></>}
                    </DropdownButton>
                </>
            );
        }
    }


    const brisanjeCvora = async (node) => {
        if (node.children.length != 0) {
            for (var i = 0; i < node.children.length; i++) {
                if (node.children[i].delete == true) {
                    node.children.splice(i, 1);
                    setRerenderTree(!rerenderTree)
                } else if (node.children[i].children == null) {

                } else if (node.children[i].children.length != 0) {
                    brisanjeCvora(node.children[i])
                }
            }
        }
        await setTreeData([treeData[0]])
    }

    const returnIcons = (node) => {
        if (node.type == "Distributivni centar") {
            return <BsTruck className="mx-2" />;
        } else if (node.type == "Prodajno mjesto") {
            return <BsShop className="mx-2" />;
        }
        return <FaCashRegister className="mx-2"></FaCashRegister>;
    };
    return (
        <div style={{ height: 700 }}>
            <div className="d-flex align-items-center">
                {getRole() != 'user' && <Button onClick={onclickHandle}>Save</Button>}
                <div
                    className="spinner-border mx-3"
                    role="status"
                    style={{ display: loading ? "block" : "none" }}
                >
                </div>
            </div>
            <div style={{
                height: 700,
                marginTop: "25px",
                border: "3px solid gray"
            }}>
                <SortableTree
                    treeData={treeData}
                    onChange={(treeData) => {
                        setTreeData(treeData);
                    }}
                    generateNodeProps={(rowInfo) => {
                        const { node } = rowInfo;
                        return {
                            buttons: [returnIcons(node), returnButtons(node)],
                        };
                    }}
                    canDrag={(rowInfo) => {
                        const { node, nextParent } = rowInfo;
                        return node.type != "Kasa";
                    }}
                    canDrop={(rowInfo) => {
                        const { node, nextParent } = rowInfo;
                        return (
                            nextParent &&
                            nextParent.type == "Distributivni centar" &&
                            node.type != "Kasa"
                        );
                    }}
                />
                <DistInfo
                    node={node}
                    show={showDCInfo}
                    setShown={setShowDCInfo}
                ></DistInfo>
                <IzmjeniStanje
                    node={node}
                    show={showIzmjeniStanje}
                    setShown={setShowIzmjeniStanje}
                    valutaVrijednosti={valutaVrijednosti}
                ></IzmjeniStanje>
                <Kalendar
                    node={node}
                    show={showKalendar}
                    setShown={setShowKalendar}
                    valutaVrijednosti={valutaVrijednosti}
                ></Kalendar>
                <ProdajnoMjestoInfo
                    node={node}
                    show={showProdajnoInfo}
                    setShown={setShowProdajnoInfo}
                ></ProdajnoMjestoInfo>
                <DistCentar
                    node={node}
                    show={showDCAdd}
                    setShown={setShowDCAdd}
                    edit={edit}
                    treeData={treeData}
                    setTreeData={setTreeData}
                    valutaVrijednosti={valutaVrijednosti}
                ></DistCentar>
                <ProdajnoMjesto
                    node={node}
                    show={showProdajnoMjestoAdd}
                    setShown={setShowProdajnoMjestoAdd}
                    edit={edit}
                    treeData={treeData}
                    setTreeData={setTreeData}
                    valutaVrijednosti={valutaVrijednosti}
                ></ProdajnoMjesto>
                <PostavkeProdajnoMjesto
                    node={node}
                    show={showPostavkeProdajnoMjesto}
                    setShown={setShowPostavkeProdajnoMjesto}
                ></PostavkeProdajnoMjesto>
                <PostavkeDistributivniCentar
                    node={node}
                    show={showPostavkeDistributivniCentar}
                    setShown={setShowPostavkeDistributivniCentar}
                ></PostavkeDistributivniCentar>
                <Kasa
                    node={node}
                    show={showKasa}
                    setShown={setShowKasa}
                    edit={edit}
                    treeData={treeData}
                    setTreeData={setTreeData}
                    valutaVrijednosti={valutaVrijednosti}
                ></Kasa>
                <ObrisiCvor
                    node={node}
                    show={showDeletePrompt}
                    setShown={setShowDeletePrompt}
                    setMarkDelete={setMarkDelete}
                ></ObrisiCvor>
                <KasaInfo
                    node={node}
                    show={showKasaInfo}
                    setShown={setShowKasaInfo}
                    valutaVrijednosti={valutaVrijednosti}
                ></KasaInfo>
                <KorisniciAdd
                    node={node}
                    show={showKorisniciAdd}
                    setShown={setShowKorisniciAdd}
                ></KorisniciAdd>
                <KasaPromjenaStanja
                    node={node}
                    show={kasaPromjena}
                    setShown={setKasaPromjena}
                    treeData={treeData}
                    setTreeData={setTreeData}
                    valutaVrijednosti={valutaVrijednosti}
                ></KasaPromjenaStanja>
                <NarudzbaAdd
                    node={node}
                    show={showNarudzbaAdd}
                    setShown={setShowNarudzbaAdd}
                ></NarudzbaAdd>
                <OfflinePredikcije
                    node={node}
                    show={showOfflinePredikcije}
                    setShown={setShowOfflinePredikcije}
                    valutaVrijednosti={valutaVrijednosti}
                    treeData={treeData}
                ></OfflinePredikcije>
                <OrdersCvor
                    node = {node}
                    show = {showOrders}
                    setShown = {setShowOrders}
                    valutaVrijednosti={valutaVrijednosti}
                ></OrdersCvor>
                <CvorOgranicenjaKartice
                    node={node}
                    show={showCvorOgrKartice}
                    setShown={setShowCvorOgrKartice}
                    valutaVrijednosti={valutaVrijednosti}
                ></CvorOgranicenjaKartice>
            </div>
        </div>
    );
}
