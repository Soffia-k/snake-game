const express = require('express')
const config = require('config')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const path = require('path')
const cors = require('cors')

const app = express()

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))

app.use(express.json({ extended: true }))

if (process.env.NODE_ENV === 'production'){
    app.use('/', express.static(path.join(__dirname, 'client', 'build')))
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

app.use('/api/auth', require('./routes/auth'))
app.use('/api/score', require('./routes/scores'))

const PORT = config.get('port') || 5000
const MONGO_URL = config.get('mongoURL');

async function start() {
    try {
        await mongoose.connect(MONGO_URL)
        app.listen(PORT, () => console.log(`App started on port ${PORT}`))
    } catch (e) {
        console.log('Server error', e.message)
        process.exit()
    }
}

start()