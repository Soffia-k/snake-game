// service/scoreService.js
export const scoreService = {
    getUserScores: async () => {
        try {
            console.log('=== GET USER SCORES START ===');
            
            // Получаем данные из userData (как в useAuth)
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            const token = userData.token;
            const userId = userData.userId;
            
            console.log('UserData from localStorage:', userData);
            console.log('Token exists?', !!token);
            console.log('User ID:', userId);
            
            if (!token) {
                throw new Error('No authentication token found. Please login.');
            }
            
            console.log('Sending request with token...');
            
            const response = await fetch('http://localhost:5000/api/score', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            const text = await response.text();
            console.log('Response status:', response.status);
            console.log('Response text:', text);
            
            if (!response.ok) {
                throw new Error(`Server error ${response.status}: ${text}`);
            }
            
            return JSON.parse(text);
            
        } catch (error) {
            console.error('Error in getUserScores:', error);
            throw error;
        }
    },
    
    saveScore: async (points) => {
        try {
            console.log('=== SAVE SCORE START ===');
            
            // Получаем данные из userData
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            const token = userData.token;
            
            console.log('Token exists?', !!token);
            console.log('Points to save:', points);
            
            if (!token) {
                throw new Error('No authentication token found. Please login.');
            }
            
            const response = await fetch('http://localhost:5000/api/score/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ points })
            });
            
            const text = await response.text();
            console.log('Save response:', response.status, text);
            
            if (!response.ok) {
                throw new Error(`Server error ${response.status}: ${text}`);
            }
            
            return JSON.parse(text);
            
        } catch (error) {
            console.error('Error in saveScore:', error);
            throw error;
        }
    }
};