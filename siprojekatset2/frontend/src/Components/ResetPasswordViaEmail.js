import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router'
import './style/ResetPassEmail.css'

const ResetPasswordViaEmail = () => {
    const [email, setEmail] = useState('')
    const [token, setToken] = useState('')
    const [label, setLabel] = useState('')
    const [showTokenInputField, setShowTokenInputField] = useState(false)
    const [newPassword, setNewPassword] = useState('')
    const [passwordChanged, setPasswordChanged] = useState(false)
    const [error, setError] = useState(false)
    const navigate = useNavigate()

    const handleSendCode = (e) => {
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify({ email }),
            redirect: 'follow'
        };

        setError(false)
        setLabel('Sending...')
        setShowTokenInputField(false)

        fetch("api/korisnik/send-email-password-reset", requestOptions)
            .then(response => response.text())
            .then(result => {
                if (result === 'Zahtjev za ponovno postavljanje lozinke je odobren.') {
                    setLabel('Request for changing the password is approved.')
                    setError(false)
                    setShowTokenInputField(true)
                } else {
                    setLabel('User not found.')
                    setError(true)
                }
            })
            .catch(error => console.log('error', error));
    }

    const handleChangePassword = (e) => {
        if (!newPassword || !token) {
            setLabel('All fields are required!')
            setError(true)
        } else {

            let myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            let requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify({
                    email,
                    token,
                    newPassword
                }),
                redirect: 'follow'
            };

            setLabel('Changing password...')
            setError(false)

            fetch("api/Korisnik/email-password-reset", requestOptions)
                .then(response => {
                    if (response.status === 200) {
                        setShowTokenInputField(false)
                        setLabel('Password changed succesfuly!')
                        setPasswordChanged(true)
                        setError(false)
                    } else if (response.status === 401) {
                        setLabel('Wrong code...')
                        setError(true)
                        setToken('')
                        setNewPassword('')
                    }
                })
                .catch(error => console.log('error', error));
        }
    }

    const handleLoginRedirect = () => {
        navigate('/login')
    }

    return (
        <div className='flex'>
            <h1 className='title'>Promjena passworda</h1>
            <div className='form'>
                <div className='flex'>
                    <label htmlFor='email'>Enter your email:</label>
                    <input className='input' name='email' type='email' placeholder='abc@gmail.com' value={email} onChange={e => setEmail(e.target.value)}></input>
                    <Button className={!passwordChanged ? '' : 'hide'} letiant='primary' onClick={handleSendCode}>Send code to email</Button>
                    <Button className={passwordChanged ? '' : 'hide'} letiant='primary' onClick={handleLoginRedirect}>Log In</Button>
                </div>
                <p className={`label ${error ? 'error' : 'success'}`}>{label}</p>
                <div className={`${showTokenInputField ? 'flex' : 'hide'}`} >
                    <label htmlFor='code'>Enter code you recieved:</label>
                    <input className='input' name='code' type='text' value={token} onChange={e => setToken(e.target.value)} placeholder='Code you recieved in email'></input>
                </div>

                <div className={`${showTokenInputField ? 'flex' : 'hide'}`}>
                    <label htmlFor='code'>Type new password:</label>
                    <input className='input' name='newPassowrd' type='password' value={newPassword} onChange={e => setNewPassword(e.target.value)}></input>
                    <Button letiant='primary' onClick={handleChangePassword}>Change password</Button>
                </div>
            </div>
        </div>
    )
}

export default ResetPasswordViaEmail