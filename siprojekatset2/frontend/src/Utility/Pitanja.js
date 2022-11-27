export const getPitanja = async () => {
  const url = "/api/Pitanja/getAll";

  const repsonse = await fetch(url);
  return await repsonse.json();
};
export const odgovoriNaPitanje = async (pio) => {
  let res = await fetch("/api/Pitanja/dodajOdgovor", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pio),
  });
  if (res.ok) {
    return { error: false, message: "Pitanje za oporavak uspješno dodano!" };
  }
  return { error: true, message: "Došlo je do greške!" };
};
