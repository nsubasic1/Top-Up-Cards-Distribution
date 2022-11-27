import { dajNizZaValutu } from "./StabloUI";
import { getRole, getEmail } from "./UserControl";
import { dajVrijednostiZaValutu, dajIndexZaVrijednost} from "./StabloUI";

export const getMreza = () => {
  return [
    {
      id: 0,
      title: "Dist centar 1",
      subtitle: "Ovo je glavni distributivni centar",
      distributivniCentar: true,

      children: [
        { id: 1, title: "A", subTitle: "B", distributivniCentar: false },
        {
          id: 2,
          title: "Dist centar 2 ",
          name: "ImeNeko",
          distributivniCentar: true,
          children: [
            {
              id: 3,
              title: "Dist centar Sarajevo",
              distributivniCentar: true,
              children: [
                {
                  id: 4,
                  title: "Konzum Ilidža",
                  subtitle: "Konzum u Sara Centru",
                  distributivniCentar: false,
                },
              ],
            },
            { id: 5, title: "Prodajno mjesto", distributivniCentar: false },
          ],
        },
      ],
    },
  ];
};

const getChildrenRecursiveArray = (element, array) => {
  if(element.childrenId == null) {
    return [];
  }
  var indexes = element.childrenId.split(',');
  var children = [];
  for (var i = 0; i < array.length; i++) {
    if(indexes.includes(array[i].id.toString())) {
      children.push(array[i]);
      array[i].children = getChildrenRecursiveArray(array[i], array);
    }
  }
  return children;
}

export const parseValues = (element) => {
  var temp1 = element.ogrbam.split(',');
  var temp2 = element.ogreur.split(',');
  var temp3 = element.ogrusd.split(',');
  var temp4 = element.ogrhrk.split(',');
  var temp5 = element.ogrgbp.split(',');

  var temp6 = element.trenbam.split(',');
  var temp7 = element.treneur.split(',');
  var temp8 = element.trenusd.split(',');
  var temp9 = element.trenhrk.split(',');
  var temp10 = element.trengbp.split(',');

  var temp11 = element.karticeOgranicenje.split(',')
  var temp12 = element.novacOgranicenje.split(',')

  /* for(var i = 0; i < 5; i++) {
    temp1[i] = parseInt(temp1[i])
    temp2[i] = parseInt(temp2[i])
    temp3[i] = parseInt(temp3[i])
    temp4[i] = parseInt(temp4[i])
    temp5[i] = parseInt(temp5[i])
    temp6[i] = parseInt(temp6[i])
    temp7[i] = parseInt(temp7[i])
    temp8[i] = parseInt(temp8[i])
    temp9[i] = parseInt(temp9[i])
    temp10[i] = parseInt(temp10[i])
    temp11[i] = parseInt(temp11[i])
    temp12[i] = parseInt(temp12[i])
  }*/

  element.ogrbam = temp1;
  element.ogreur = temp2;
  element.ogrusd = temp3;
  element.ogrhrk = temp4;
  element.ogrgbp = temp5;

  element.trenbam = temp6;
  element.treneur = temp7;
  element.trenusd = temp8;
  element.trenhrk = temp9;
  element.trengbp = temp10;

  element["karticeOgranicenje"] = temp11;
  element["novacOgranicenje"] = temp12;

  if(element.korisnikemails != null) {
    element.korisnikemails = element.korisnikemails.split(',');
  }
  else {
    element.korisnikemails = [];
  }

  if(element.children != null) {
    for(var i = 0; i < element.children.length; i++) {
      parseValues(element.children[i]);
    }
  }
}

export const getIndexFromValuta = (valuta) => {
  switch(valuta) {
    case "BAM": return 0;
    case "EUR": return 1;
    case "USD": return 2;
    case "HRK": return 3;
    case "GBP": return 4;
    default: return 0;
  }
}

const serializeValues = (element) => {
  var temp1 = "";
  element.karticeOgranicenje.forEach(e => temp1 += e + ",")
  element.karticeOgranicenje = temp1.substring(0, temp1.length - 1);

  temp1 = "";
  element.novacOgranicenje.forEach(e => temp1 += e + ",")
  element.novacOgranicenje = temp1.substring(0, temp1.length - 1);

  temp1 = "";
  element.ogrbam.forEach(e => temp1 += e + ",")
  element.ogrbam = temp1.substring(0, temp1.length - 1);

  temp1 = "";
  element.ogreur.forEach(e => temp1 += e + ",")
  element.ogreur = temp1.substring(0, temp1.length - 1);

  temp1 = "";
  element.ogrusd.forEach(e => temp1 += e + ",")
  element.ogrusd = temp1.substring(0, temp1.length - 1);

  temp1 = "";
  element.ogrhrk.forEach(e => temp1 += e + ",")
  element.ogrhrk = temp1.substring(0, temp1.length - 1);

  temp1 = "";
  element.ogrgbp.forEach(e => temp1 += e + ",")
  element.ogrgbp = temp1.substring(0, temp1.length - 1);

  temp1 = "";
  element.trenbam.forEach(e => temp1 += e + ",")
  element.trenbam = temp1.substring(0, temp1.length - 1);

  temp1 = "";
  element.treneur.forEach(e => temp1 += e + ",")
  element.treneur = temp1.substring(0, temp1.length - 1);

  temp1 = "";
  element.trenusd.forEach(e => temp1 += e + ",")
  element.trenusd = temp1.substring(0, temp1.length - 1);

  temp1 = "";
  element.trenhrk.forEach(e => temp1 += e + ",")
  element.trenhrk = temp1.substring(0, temp1.length - 1);

  temp1 = "";
  element.trengbp.forEach(e => temp1 += e + ",")
  element.trengbp = temp1.substring(0, temp1.length - 1);

  // Serijalizacija emailova
  var temp15 = "";
  if(element.korisnikemails != null) {
    for(var i = 0; i < element.korisnikemails.length; i++) {
      if(element.korisnikemails[i].length < 3) {
        continue;
      }
      temp15 += element.korisnikemails[i];
      if(i != element.korisnikemails - 2) {
        temp15 += ",";
      }
    }
  }

  element.korisnikemails = temp15;
}

const isChildOfAddedParent = (subtree, element) => {
  if(subtree.children == null) {
    return false;
  }
  if(subtree.children.length == 0) {
    return false;
  }
  if(subtree.children.includes(element)) {
    return true;
  }
  for(var i = 0; i < subtree.children.length; i++) {
    if(isChildOfAddedParent(subtree.children[i], element)) {
      return true;
    }
  }
  return false;
}

const getChildrenRecursiveTree = (element, currentId, array) => {
  element.id = currentId.id;
  serializeValues(element)
  array.push(element);
  currentId.id = currentId.id + 1;
  if(element.children == null || element.children.length == 0) {
    element.childrenId = null;
    return;
  }
  element.childrenId="";
  for(var i = 0; i < element.children.length; i++) {
    element.children[i].parentId = element.id;
    getChildrenRecursiveTree(element.children[i], currentId, array);
    element.childrenId += element.children[i].id + ",";
  }
  element.childrenId = element.childrenId.slice(0, -1);
}

export const getMrezaFromDb = async () => {
  let token = "bearer " + localStorage.getItem("token");
  const response = await fetch("api/stablo/getnovi", {
      method: "GET",
      headers: {
          "Content-Type": "application/json",
          Authorization: token,
      }
  });


  var tree = [];
  var data = await response.json();
  for (var i = 0; i < data.length; i++) {
      if (data[i].parentId == null) {
          tree.push(data[i]);
          break;
      }
  }
  tree[0].children = getChildrenRecursiveArray(tree[0], data);
  parseValues(tree[0])

  if(getRole() === 'user') {
    var subtrees = [];
    for(var i = 0; i < data.length; i++) {
      if(data[i].korisnikemails.includes(getEmail())) {
        var conatinedInTree = false;
        for(var j = 0; j < subtrees.length; j++) {
          if(isChildOfAddedParent(subtrees[j], data[i])) {
            conatinedInTree = true;
            break;
          }
        }
        if(conatinedInTree) {
          continue;
        }
        else {
          subtrees.push(data[i]);
        }
      }
    }
    return subtrees;
  }

  return tree;
}

export const getMrezaArrayFromDb = async () => {
  let token = "bearer " + localStorage.getItem("token");
  const response = await fetch("api/stablo/getnovi", {
      method: "GET",
      headers: {
          "Content-Type": "application/json",
          Authorization: token,
      }
  });
  var data = await response.json();
  for(var i = 0; i < data.length; i++) {
    parseValues(data[i]);
  }
  return data;
}

export const getMrezaLengthFromDb = async () => {
    let token = "bearer " + localStorage.getItem("token");
    const response = await fetch("api/stablo/getnovi", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: token,
        }
    });
    var data = await response.json()
    return data.length;
}

export const writeTreeToDb = async (tree) => {
  if(tree.length != 0) {
    var array = [];
    var currentId = {id: 1};
    getChildrenRecursiveTree(tree[0], currentId, array);
  }
  let token = "bearer " + localStorage.getItem("token");
  const response = await fetch("api/stablo/postnovi", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          Authorization: token,
      },
      body: JSON.stringify(array)
  });
}

export const writeMrezaArrayToDb = async (data) => {
  for(var i = 0; i < data.length; i++) {
    serializeValues(data[i]);
  }
  let token = "bearer " + localStorage.getItem("token");
  const response = await fetch("api/stablo/postnovi", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          Authorization: token,
      },
      body: JSON.stringify(data)
  });
}

export const getNodesFromParentId = async (currentId) => {

    const upit = "/api/stablo/getCvoroviParentId/"+currentId;
    const response = await fetch(upit, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
    const data = await response.json();
    return data;
}

export const getNodeFromId = async (id) => {
    const upit = "/api/stablo/getNodeFromId/" + id;
    const response = await fetch(upit, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
    const data = await response.json();
    return data;
}

/*export const postNarudzba = async (naziv, kartice, iznos, valuta, krajnjiId, pocetniId) => {
    let res = await fetch("/api/stablo/postNarudzbe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            naziv: naziv,
            pocetniid: pocetniId,
            krajnjiid: krajnjiId,
            valuta: valuta,
            vrijednost: iznos,
            brojkartica: kartice
        }),
    });
    return res;
};*/

export const postNarudzba = async (narudzbe) => {
    let res = await fetch("/api/stablo/postNarudzbe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(narudzbe),
    });
    return res;
};

export const updateAtributi = async (atributi) => {
    let res = await fetch("/api/stablo/updatecvoratributi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(atributi),
    });
    return res;
};

const findNodeById = (node, id) => {
    if (node.id == id) {
        return node;
    }
    if (node.children == null || node.children.length == 0) {
        return undefined;
    }
    var found = undefined;
    for (var i = 0; i < node.children.length; i++) {
        found = findNodeById(node.children[i], id);
        if (found != undefined) {
            return found;
        }
    }
}

export const getChildrenSum = (tree, id, currentNode, valutaVrijednosti) => {
    var parent = findNodeById(tree[0], id);
    var newNode = {
      karticeOgranicenje: parent.karticeOgranicenje,
      novacOgranicenje: parent.novacOgranicenje,
      ogrbam: parent.ogrbam,
      ogreur: parent.ogreur,
      ogrusd: parent.ogrusd,
      ogrhrk: parent.ogrhrk,
      ogrgbp: parent.ogrgbp,
      trenbam: new Array(parent.ogrbam.length).fill(0),
      treneur: new Array(parent.ogreur.length).fill(0),
      trenusd: new Array(parent.ogrusd.length).fill(0),
      trenhrk: new Array(parent.ogrhrk.length).fill(0),
      trengbp: new Array(parent.ogrgbp.length).fill(0)
    };
    var temp = parent.children;
    for(var i = 0; i < temp.length; i++) {
      if(temp[i] == currentNode) {
        continue;
      }
      if (temp[i].kasatype === "Prodajna kasa" || temp[i].kasatype === "Prodajno-primajuća kasa") {
        var nizVrijednosti = dajVrijednostiZaValutu(temp.kasavaluta, valutaVrijednosti);
        var index = dajIndexZaVrijednost(nizVrijednosti, temp[i].kasavrijednost);
        var nizTrenutnihProdajnogMjesta = dajNizZaValutu(temp[i].kasavaluta, [newNode.trenbam, newNode.treneur, newNode.trenusd, newNode.trenhrk, newNode.trengbp])
        var nizTrenutnihKase = dajNizZaValutu(temp[i].kasavaluta, [temp[i].trenbam, temp[i].treneur, temp[i].trenusd, temp[i].trenhrk, temp[i].trengbp])
        nizTrenutnihProdajnogMjesta[index] += 1 * nizTrenutnihKase[index];
      }
      else {
        newNode.trenbam = newNode.trenbam.map((value, index) => 1 * value + 1 * temp[i].trenbam[index]);
        newNode.treneur = newNode.treneur.map((value, index) => 1 * value + 1 * temp[i].treneur[index]);
        newNode.trenusd = newNode.trenusd.map((value, index) => 1 * value + 1 * temp[i].trenusd[index]);
        newNode.trenhrk = newNode.trenhrk.map((value, index) => 1 * value + 1 * temp[i].trenhrk[index]);
        newNode.trengbp = newNode.trengbp.map((value, index) => 1 * value + 1 * temp[i].trengbp[index]);
      }
    }
    return newNode;
}

export const getVrijednostiFromDb = async () => {
  const upit = "/api/stablo/vrijednosti";
  const response = await fetch(upit, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });
  var vrijednosti = await response.json();
  vrijednosti.bamvrijednosti = vrijednosti.bamvrijednosti.split(',');
  vrijednosti.eurvrijednosti = vrijednosti.eurvrijednosti.split(',');
  vrijednosti.usdvrijednosti = vrijednosti.usdvrijednosti.split(',');
  vrijednosti.hrkvrijednosti = vrijednosti.hrkvrijednosti.split(',');
  vrijednosti.gbpvrijednosti = vrijednosti.gbpvrijednosti.split(',');
  return vrijednosti;
}

export const writeVrijednostiToDb = async (vrijednosti) => {
  let token = "bearer " + localStorage.getItem("token");

  var temp1 = "";
  vrijednosti.bamvrijednosti.forEach(e => temp1 += e + ",")
  vrijednosti.bamvrijednosti = temp1.substring(0, temp1.length - 1);

  temp1 = "";
  vrijednosti.eurvrijednosti.forEach(e => temp1 += e + ",")
  vrijednosti.eurvrijednosti = temp1.substring(0, temp1.length - 1);

  temp1 = "";
  vrijednosti.usdvrijednosti.forEach(e => temp1 += e + ",")
  vrijednosti.usdvrijednosti = temp1.substring(0, temp1.length - 1);

  temp1 = "";
  vrijednosti.hrkvrijednosti.forEach(e => temp1 += e + ",")
  vrijednosti.hrkvrijednosti = temp1.substring(0, temp1.length - 1);

  temp1 = "";
  vrijednosti.gbpvrijednosti.forEach(e => temp1 += e + ",")
  vrijednosti.gbpvrijednosti = temp1.substring(0, temp1.length - 1);

  const response = await fetch("api/stablo/vrijednostipost", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          Authorization: token,
      },
      body: JSON.stringify(vrijednosti)
  });

  vrijednosti.bamvrijednosti = vrijednosti.bamvrijednosti.split(',');
  vrijednosti.eurvrijednosti = vrijednosti.eurvrijednosti.split(',');
  vrijednosti.usdvrijednosti = vrijednosti.usdvrijednosti.split(',');
  vrijednosti.hrkvrijednosti = vrijednosti.hrkvrijednosti.split(',');
  vrijednosti.gbpvrijednosti = vrijednosti.gbpvrijednosti.split(',');
}

export const getVrijemeTransakcijeByIdCvor = async (id) => {
    const upit = "/api/stablo/getVrijemeTransakcijeByIdCvor/" + id;
    const response = await fetch(upit, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
        
    });
    let niz = await response.json();
    let noviNiz = [];

    for (let i = 0; i < niz.length; i++) {
        let objekat = {};
        objekat.bamvrijednosti = niz[i].bamvrijednosti.split(',');
        objekat.eurvrijednosti = niz[i].eurvrijednosti.split(',');
        objekat.usdvrijednosti = niz[i].usdvrijednosti.split(',');
        objekat.hrkvrijednosti = niz[i].hrkvrijednosti.split(',');
        objekat.gbpvrijednosti = niz[i].gbpvrijednosti.split(',');
        objekat.trenbam = niz[i].trenbam.split(',');
        objekat.treneur = niz[i].treneur.split(',');
        objekat.trenusd = niz[i].trenusd.split(',');
        objekat.trengbp = niz[i].trengbp.split(',');
        objekat.trenhrk = niz[i].trenhrk.split(',');
        objekat.datum = Date.parse(niz[i].datum);
        objekat.datumString = niz[i].datum;
        objekat.stanje = niz[i].stanje;
        objekat.vrijednost = niz[i].vrijednost;
        objekat.valuta = niz[i].valuta;
        objekat.idCvor = niz[i].idCvor;
        objekat.vrsta = niz[i].vrsta;
        noviNiz.push(objekat);
    }
    return noviNiz;
}

export const getPredikcije = async (id) => {
  const upit = "/api/stablo/predikcija/" + id;
  const response = await fetch(upit, {
      method: "GET",
      headers: {
          "Content-Type": "application/json"
      }
  });
  const data = await response;
  if (data.status == 204) return null;
  return data.json();
}

export const getStanje = async (id, datum1,datum2) => {
    const upit = "/api/stablo/getStanja/" + id + '/' + datum1 + '/' + datum2;
    const response = await fetch(upit, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
    let niz = await response.json();
    let noviNiz = [];

    for (let i = 0; i < niz.length; i++) {
        let objekat = {};
        objekat.bamvrijednosti = niz[i].bamvrijednosti.split(',');
        objekat.eurvrijednosti = niz[i].eurvrijednosti.split(',');
        objekat.usdvrijednosti = niz[i].usdvrijednosti.split(',');
        objekat.hrkvrijednosti = niz[i].hrkvrijednosti.split(',');
        objekat.gbpvrijednosti = niz[i].gbpvrijednosti.split(',');
        objekat.trenbam = niz[i].trenbam.split(',');
        objekat.treneur = niz[i].treneur.split(',');
        objekat.trenusd = niz[i].trenusd.split(',');
        objekat.trengbp = niz[i].trengbp.split(',');
        objekat.trenhrk = niz[i].trenhrk.split(',');
        objekat.datum = Date.parse(niz[i].datum);
        objekat.datumString = niz[i].datum;
        objekat.stanje = niz[i].stanje;
        objekat.vrijednost = niz[i].vrijednost;
        objekat.valuta = niz[i].valuta;
        objekat.idCvor = niz[i].idCvor;
        objekat.vrsta = niz[i].vrsta;
        noviNiz.push(objekat);
    }
    return noviNiz;
}

export const getTransakcije = async (id, datum1, datum2) => {
    const upit = "/api/stablo/getTransakcijeByDay/" + id + '/' + datum1 + '/' + datum2;
    const response = await fetch(upit, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }

    });
    let niz = await response.json();
    let noviNiz = [];

    for (let i = 0; i < niz.length; i++) {
        let objekat = {};
        objekat.bamvrijednosti = niz[i].bamvrijednosti.split(',');
        objekat.eurvrijednosti = niz[i].eurvrijednosti.split(',');
        objekat.usdvrijednosti = niz[i].usdvrijednosti.split(',');
        objekat.hrkvrijednosti = niz[i].hrkvrijednosti.split(',');
        objekat.gbpvrijednosti = niz[i].gbpvrijednosti.split(',');
        objekat.trenbam = niz[i].trenbam.split(',');
        objekat.treneur = niz[i].treneur.split(',');
        objekat.trenusd = niz[i].trenusd.split(',');
        objekat.trengbp = niz[i].trengbp.split(',');
        objekat.trenhrk = niz[i].trenhrk.split(',');
        objekat.datum = Date.parse(niz[i].datum);
        objekat.datumString = niz[i].datum;
        objekat.stanje = niz[i].stanje;
        objekat.vrijednost = niz[i].vrijednost;
        objekat.valuta = niz[i].valuta;
        objekat.idCvor = niz[i].idCvor;
        objekat.vrsta = niz[i].vrsta;
        noviNiz.push(objekat);
    }
    return noviNiz;
}

export const getCvoratributiByCvorId = async (id) => {
    console.log(id);
    const upit = "/api/stablo/cvoratributi/" + id;
    const response = await fetch(upit, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }

    });
    let cvor = await response;
    if (cvor.status === 204) return null;
    return cvor.json();
}

export const postCvoratributi = async (cvoratributi) => {
    const res = await fetch("/api/stablo/cvoratributi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cvoratributi)
    });
    return res;
}