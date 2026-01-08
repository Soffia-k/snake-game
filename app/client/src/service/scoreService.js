export const scoreService = {
    getUserScores: async () => {
        try {
            const userData = JSON.parse(localStorage.getItem('userData') || '{}')
            const token = userData.token
            const userId = userData.userId
            
            if (!token) {
                throw new Error('No authentication token found. Please login.')
            }
            
            const response = await fetch('http://localhost:5000/api/scores', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            
            const text = await response.text()
            
            if (!response.ok) {
                throw new Error(`Server error ${response.status}: ${text}`)
            }
            
            return JSON.parse(text);
            
        } catch (error) {
            console.error('Error in getUserScores:', error)
            throw error
        }
    },
    
    saveScore: async (points) => {
        try {
            
            const userData = JSON.parse(localStorage.getItem('userData') || '{}')
            const token = userData.token;
            
            if (!token) {
                throw new Error('No authentication token found. Please login.')
            }
            
            const response = await fetch('http://localhost:5000/api/scores/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ points })
            })
            
            const text = await response.text()
            
            if (!response.ok) {
                throw new Error(`Server error ${response.status}: ${text}`)
            }
            
            return JSON.parse(text)
            
        } catch (error) {
            console.error('Error in saveScore:', error)
            throw error
        }
    }
}