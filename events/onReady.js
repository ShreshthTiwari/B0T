//response.host, response.port, response.version
const config = require("../config.json");

module.exports = async (Discord, client, Keyv, util) =>{
  let embed = new Discord.MessageEmbed()
  .setColor(0x2f3136);
  let author = await client.users.cache.get(config.authorID).username;
  const guildsCount = await client.guilds.cache.size;
  const usersCount = await client.users.cache.size;
  const channelsCount = await client.channels.cache.size;
  const ticketsCount = await client.channels.cache.filter(ch => ch.name.startsWith("ticket")).size;

  let guildText = "server";
  let userText = "user";
  let channelText = "channel";
  let ticketText = "ticket";

  if(guildsCount > 1) guildText = guildText + 's';
  if(usersCount > 1) userText = userText + 's';
  if(channelsCount > 1) channelText = channelText + 's';
  if(ticketsCount > 1) ticketText = ticketText + 's';

  let index = 0;

  const activitiesList = [
    `Over ${guildsCount} ${guildText}`,
    `Over ${usersCount} ${userText}`,
    `Over ${channelsCount} ${channelText}`,
    `Over ${ticketsCount} ${ticketText}`,
    `For prefix?`,
    `${author}`,
    `With ${author}`
  ];  
  
  console.log(`-------------------------------------\n${client.user.tag} is online!\n-------------------------------------`);
  
  setInterval(async () => {
    if(index>=6)
      await client.user.setActivity(activitiesList[index], {type: "PLAYING"})
        .catch(console.error);
    else
      await client.user.setActivity(activitiesList[index], {type: "WATCHING"})
        .catch(console.error);
    index++;
    if(index >= activitiesList.length) index = 0;
  }, 10000);
  
  //---------------------------MINECRAFT SERVER PLAYING STATUS UPDATER | STATS CHANNELS UPDATER-------------------------------
  const guildsMap = client.guilds.cache
  .sort((guild1, guild2) => guild1.position - guild2.position)
  .map(guild => guild.id);  
  setInterval(async () => {
    for(let i=0; i<=guildsMap.length-1; i++){
      let guild = client.guilds.cache.get(guildsMap[i]);
      if(guild){
        let database = new Keyv('sqlite://./databases/database.sqlite', {
          table: `${guild.id}`
        });
        database.on('error', err => console.log('Connection Error', err));
        //---------------MINECRAFT SERVER STATUS UPDATER-----------------------
        const minecraftServerStatusUpdater = require("./minecraftServerStatusUpdater.js");
        minecraftServerStatusUpdater(Discord, client, guild, database, util);
        //---------------STATS CHANNELS UPDATER-------------------
        const statsChannelsUpdater = require("../updater/statsChannelsUpdater.js");
        statsChannelsUpdater(guild, database);
      }
    }
  }, 300000);
}