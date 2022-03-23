module.exports = (Keyv, guildID) => {
  const database = new Keyv('sqlite://./databases/database.sqlite', {
    table: `${guildID}`,
    serialize: JSON.stringify,
    deserialize: JSON.parse
  });
  database.on('error', err => console.log('Connection Error', err));
  return database;
}