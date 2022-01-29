module.exports = async(Discord, client, guild, database) =>{
  console.log(`Left ${guild.name} -> ${guild.id}`);
  await database.clear();
}