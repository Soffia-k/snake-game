// server/db.js
const { MongoClient } = require('mongodb');

const uri = 'mongodb://snake:6789@snake-mongodb:27017/snake_game';

const client = new MongoClient(uri);

async function connectDB() {
  try {
    await client.connect();
    console.log('✅ Подключено к MongoDB в Docker');
    return client.db('snake_game'); // Или любое другое название базы
  } catch (err) {
    console.error('❌ Ошибка подключения к MongoDB:', err);
    process.exit(1);
  }
}

module.exports = { connectDB };


//mongosh "mongodb://snake:6789@snake-mongodb:27017/snake_game"