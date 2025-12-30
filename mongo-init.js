db = db.getSiblingDB('snake_game')

try {
  db.createUser({
    user: 'snake',
    pwd: '6789',
    roles: [
      { role: 'readWrite', db: 'snake_game' },
      { role: 'dbAdmin', db: 'snake_game' }
    ]
  })
  print('User created');
} catch (e) {
  print('User exists')
}