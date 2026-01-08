import React from 'react'
import {Routes, Route, Navigate} from 'react-router-dom'
import {ScoresPage} from './pages/scoresPage'
import {PlayPage} from './pages/playPage'
import {AuthPage} from './pages/authPage'

export const useRoutes = (isAuth) => {
    if (isAuth) {
        return (
            <Routes>
                <Route path="/scores" element={<ScoresPage />} />
                <Route path="/play" element={<PlayPage />} />
                <Route path="/" element={<Navigate to="/play" replace />} />
                <Route path="*" element={<Navigate to="/play" replace />} />
            </Routes>
        )
    }

    return (
        <Routes>
            <Route path="/" element={<AuthPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}