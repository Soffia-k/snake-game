const express = require('express')
const config = require('config')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const path = require('path')
const cors = require('cors')

const app = express()

app.use(cors({
  origin: true,
  credentials: true
}))

app.use(express.json({ extended: true }))

app.use('/api/auth', require('./routes/auth'))
app.use('/api/scores', require('./routes/scores'))

if (process.env.NODE_ENV === 'production'){
    app.use('/', express.static(path.join(__dirname, 'client', 'build')))
    app.get('*', (req, res) => {
        if (req.path.startsWith('/api/')) {
            return res.status(404).json({ 
                error: 'API endpoint not found',
                path: req.path 
            })
        }
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

const PORT = config.get('port') || 5000
const MONGO_URL = config.get('mongoURL');

async function start() {
    try {
        app.listen(PORT, '0.0.0.0', () => 
            console.log(`Server started on http://0.0.0.0:${PORT}`)
        )
        await mongoose.connect(MONGO_URL)
    } catch (e) {
        console.log('Server error', e.message)
        process.exit()
    }
}

start()