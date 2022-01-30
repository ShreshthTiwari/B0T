module.exports = async(guild, database) =>{
  console.log(`Left ${guild.name} -> ${guild.id}`);
  await database.clear();
}