export const getKorisnici = async () => {
  let token = "bearer " + localStorage.getItem("token");
  const response = await fetch("api/korisnik/get", {
    headers: { Authorization: token },
  });
  return await response.json();
};
export const getNeObrisaniKorisnici = async () => {
  let token = "bearer " + localStorage.getItem("token");
  const repsonse = await fetch("api/korisnik/get_notdeleted", {
    headers: { Authorization: token },
  });

  return await repsonse.json();
};
export const deleteKorisnik = async (korisnik) => {
  let token = "bearer " + localStorage.getItem("token");
  let res = await fetch("/api/korisnik/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: token },
    body: JSON.stringify({
      id: korisnik.id,
      ime: korisnik.ime,
      prezime: korisnik.prezime,
      password: korisnik.password,
      email: korisnik.email,
    }),
  });
  return res;
};
export const getKorisnik = async (id) => {
  const url = "/api/korisnik/edit/" + id;
  const token = "bearer " + localStorage.getItem("token");
  const repsonse = await fetch(url, {
    headers: { Authorization: token },
  });
  return await repsonse.json();
};

export const getKorisnikByMail = async (email) => {
  const url = "/api/korisnik/postemail";
  const repsonse = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email }),
  });
  return await repsonse.json();
};

export const promijeniRolu = async (idKorisnika, uloga_id) => {
  let token = "bearer " + localStorage.getItem("token");
  const objekat = { id: idKorisnika, uloga_id: uloga_id };
  const response = await fetch("api/korisnik/updateRole", {
    method: "PUT",
    body: JSON.stringify(objekat),
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  });
  return response.ok;
};

export const azurirajKorisnika = async (id, noviPodaci) => {
  let token = "bearer " + localStorage.getItem("token");
  var url = "/api/korisnik/edit/" + id;

  let res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: token },
    body: JSON.stringify({
      ime: noviPodaci.ime,
      prezime: noviPodaci.prezime,
      password: noviPodaci.password,
      email: noviPodaci.email,
    }),
  });
  return res;
};
