const { connectDB } = require('./test_db');

async function startServer() {
  const db = await connectDB();
  const collection = db.collection('test');
  await collection.insertOne({ hello: 'docker-mongo' });
  console.log('Данные успешно записаны в MongoDB!');
}

startServer().catch(console.error);
