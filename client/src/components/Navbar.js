import React, { useContext } from "react"
import {NavLink, useNavigate} from 'react-router-dom'
import {AuthContext} from '../context/authContext'

export const Navbar = () => {
    const navigate = useNavigate()
    const auth = useContext(AuthContext)
    const logout = event => {
        event.preventDefault()
        auth.logout()
        navigate("/")
    }
    return(
        <nav>
            <div className="nav-wrapper blue lighten-4 center-align">
                <span className="brand-logo">Snake game</span>
                <ul id="nav-mobile" className="right hide-on-med-and-down">
                    <li>
                        <NavLink to ="/play">Play</NavLink>
                    </li>
                    <li>
                        <NavLink to ="/scores">Scores</NavLink>
                    </li>
                    <li>
                        <a href="/" onClick={logout}>Exit game</a>
                    </li>
                </ul>
            </div>
        </nav>
    )
}