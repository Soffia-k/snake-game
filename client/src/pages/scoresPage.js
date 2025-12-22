import React, {useState, useEffect, useContext} from 'react'
import {AuthContext} from '../context/authContext'
import {scoreService} from '../service/scoreService'

export const ScoresPage = () => {
    const [scores, setScores] = useState([])
    const [error, setError] = useState(null)
    const { userId } = useContext(AuthContext)

    useEffect(() => {
        fetchScores()
    }, [userId])

    const fetchScores = async () => {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}')
        const token = userData.token
        
        if (!token) {
            setError('Please login to see scores')
            setScores([])
            return
        }

        try {
            setError(null)
            
            const data = await scoreService.getUserScores()
            
            if (Array.isArray(data)) {
                setScores(data)
            } else if (data && data.message) {
                setError('Server: ' + data.message)
                setScores([])
            } else {
                setError('Invalid response from server')
                setScores([])
            }
            
        } catch (error) {
            setError(error.message || 'Failed to load scores')
            setScores([])
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'No date'
        try {
            const date = new Date(dateString)
            return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
        } catch (e) {
            return 'Invalid date'
        }
    }

    return (
        <div>
            <h1>Game Results</h1>
            
            {error && (
                <div>
                    Error: {error}
                </div>
            )}
        
            <div>
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {scores.map((score, index) => (
                                <tr key={score._id || index}>
                                    <td style={{ padding: 12 }}>
                                        {formatDate(score.date)}
                                    </td>
                                    <td>
                                        {score.points || 0}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}