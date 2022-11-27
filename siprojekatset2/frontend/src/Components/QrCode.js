import React, { useState, useEffect } from "react";
import { getEmail } from "../Utility/UserControl";

const QrCode = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [qrCodeUrl, setQrCodeUrl] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [checked, setChecked] = useState(false);

    const seeIfUsesQr = async() => {
        var email = getEmail();
        try {
            const config = {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(email)
            };

            const rawResponse = await fetch("/api/Login/usesqrcode", config);
            const data = await rawResponse.text();

            if (data == "false") setChecked(false);
            else setChecked(true);

        } catch (error) {
        }
    }

    const loadQrCodeUrl = async () => { 
        setIsLoading(true);
        var email = getEmail();
        try { 
            const config = {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(email)
            };
            const rawResponse = await fetch("/api/Login/qrcode", config);
            const data = await rawResponse.text();

            

            setQrCodeUrl(data);
        } catch (error) {
            setErrorMessage("Failed to load QR Code.");
        }

        setIsLoading(false);
    };

    const handleChange = async() => {
        var email = getEmail();
        try {
            const config = {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(email)
            };

            await fetch("/api/Login/switchusesqr", config);
        } catch (error) {
        }

        setChecked(!checked);
    }

    const Checkbox = ({ label,value , onChange }) => {
        return (
            <label>
                <input type="checkbox" checked={value} onChange={onChange} />
                {label}
            </label>
        );
    };


    useEffect(() => {

        loadQrCodeUrl();

        seeIfUsesQr();
    }, []);

    return (
        <div className="qr-code">
            {isLoading ? (
                "loading..."
            ) : errorMessage ? (
                <div className="error-message">{errorMessage}</div>
            ) : (
                        <>
                            <Checkbox
                                label={"Enable Two Factor Authorization"}
                                value={checked}
                                onChange={handleChange}
                            />

                            {checked && <h1>Please scan your QR Code for Two factor authorization. </h1>}
                            {checked && <img src={qrCodeUrl} alt="qr-code" />}
                </>
            )}
        </div>
    );
};

export default QrCode;