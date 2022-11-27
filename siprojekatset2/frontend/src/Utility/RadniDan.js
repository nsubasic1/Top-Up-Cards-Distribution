export const getDani = async () => {
    let token = "bearer " + localStorage.getItem("token");
    const repsonse = await fetch("api/RadniDani/get", {
        headers: { Authorization: token },
    });

    return await repsonse.json();
};

export const updateDan = async (dan) => {
    let token = "bearer " + localStorage.getItem("token");
    var url = "/api/RadniDani/" + dan.id;

    var objekat = {}
    if(dan.radni == 0) {
        objekat = { id: parseInt(dan.id), naziv: dan.naziv, radni: false };
    }
    else {
        objekat = { id: parseInt(dan.id), naziv: dan.naziv, radni: true };
    }

    const response = await fetch(url, {
        method: "PUT",
        body: JSON.stringify(objekat),
        headers: {
            "Content-Type": "application/json",
            Authorization: token,
        },
    });
    return response.ok;
};