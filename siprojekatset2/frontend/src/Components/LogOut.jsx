import React, { useEffect } from "react";
import { Navigate } from "react-router";
import { getEmail } from "../Utility/UserControl";

export default function LogOut() {
    const zapisiLog = async () => {
        var email = getEmail();
        const config = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(email)
        };
        await fetch("/api/korisnik/logout", config);
    }
    useEffect(() => {
        zapisiLog();
        localStorage.removeItem("token");
        window.location.reload(true);
    });
    return <Navigate to="/login"></Navigate>;
}
