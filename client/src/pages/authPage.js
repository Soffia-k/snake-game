import React, {useState, useEffect, useContext} from 'react'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'
import { AuthContext } from '../context/authContext'

export const AuthPage = () => {
    const auth = useContext(AuthContext)
    const message = useMessage()
    const {loading, request, error, clearError} = useHttp()
    const [form, setForm] = useState({
        username: '', password: ''
    })

    useEffect( () => {
        message(error)
        clearError()
    }, [error, message, clearError, useMessage])

    const change = event => {
        setForm({ ...form, [event.target.name]: event.target.value })
    }

    const register = async () => {
        try {
            const data = await request('/api/auth/register', 'POST', {...form} )
            message(data.message)
        } catch (e) {}
    }

    const login = async () => {
        try {
            const data = await request('/api/auth/login', 'POST', {...form} )
            auth.login(data.token, data.userId)
        } catch (e) {}
    }

    return (
        <div className="row">
            <div className="col s6 offset-s3">
                <h1 className="center-align">
                    Snake Game
                </h1>
                <div className="card blue lighten-5">
                    <div className="card-content">
                        <span className="card-title center-align" style={{ paddingBottom: 12 }}>Welcome</span>
                        <div>
                            <div className="input-field">
                                <input placeholder="Enter username" id="username" type="text" name="username" className="blue-input" value={form.username} onChange={change} />
                                    <label htmlFor="username">Username</label>
                            </div>
                            <div className="input-field">
                                <input placeholder="Enter password" id="password" type="password" name="password" className="blue-input" value={form.password} onChange={change} />
                                    <label htmlFor="password">Password</label>
                            </div>
                        </div>
                    </div>
                    <div className="card-action center-align">
                        <button className="btn blue lighten-2" style={{ marginRight: 12 }} disabled={loading} onClick={login}>Enter</button>
                        <button className="btn grey lighten-1 black-text" onClick={register} disabled={loading}>Register</button>
                    </div>
                </div>
            </div>
        </div>
    )
}