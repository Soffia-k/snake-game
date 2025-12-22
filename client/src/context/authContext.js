import {createContext} from 'react'

function func () {}

export const AuthContext = createContext({
    token: null,
    userId: null,
    login: func,
    logout: func,
    isAuth: false
})