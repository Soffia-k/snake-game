// mongo-init.js
db = db.getSiblingDB('snake_game');

try {
  db.createUser({
    user: 'snake',
    pwd: '6789',
    roles: [
      { role: 'readWrite', db: 'snake_game' },
      { role: 'dbAdmin', db: 'snake_game' },
      { role: "userAdmin", db: "snake_game" }
    ]
  });
  print('✅ Пользователь "snake" создан в базе "snake_game"');
} catch (e) {
  print('⚠️  Пользователь уже существует:', e.message);
}

// ДЛЯ ОТОБРАЖЕНИЯ БАЗЫ ДАННЫХ В КЛИЕНТЕ — добавляем первый документ
try {
  db.info.insertOne({
    initialized: true,
    timestamp: new Date(),
    message: "База snake_game успешно инициализирована!"
  });
  print('✅ База данных "snake_game" создана и заполнена');
} catch (e) {
  print('⚠️  Ошибка при создании данных:', e.message);
}
