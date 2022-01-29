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
  
        //---------------PLAYING STATUS UPDATER-----------------------
        let playingStatusChannelID = await database.get('playingStatusChannelID');
        if(playingStatusChannelID){
          let playingStatusChannel = guild.channels.cache.get(playingStatusChannelID);
          if(playingStatusChannel){
            let IP = await database.get("IP");
            let numericIP = await database.get("numericIP");
            let port = await database.get("port") * 1;
    
            if(!port) port = 25565;
    
            if(numericIP && port){
              if(!IP){
                IP = numericIP;
              }
              let minecraftServerStatusChannelID = await database.get("minecraftServerStatusChannelID");
              let minecraftServerStatusChannel = null;
              let statusMessage = null;
              if(minecraftServerStatusChannelID){
                minecraftServerStatusChannel = await guild.channels.cache.get(minecraftServerStatusChannelID);
                let messages = await minecraftServerStatusChannel.messages.fetch({limit: 10});
                statusMessage = messages.filter(m => m.author.id === client.user.id).last();
              }

              try{
                const rawData = await util.status(numericIP, { port: port}).then(response => {
                  return [response, response.port, response.version, response.onlinePlayers, response.maxPlayers, response.description.descriptionText, response.favicon];
                });
                if(rawData){
                  function edit(data){
                    let rawData = data.split("");
                    let finalData = [];
                    let index = 0;
                    for(let i=0; i<=rawData.length-1; i++){
                      if(rawData[i] == '§'){
                        i++;
                      }else{
                        finalData[index] = rawData[i];
                        index++;
                      }
                    }
                    return finalData.join("");
                  }
                  let version = edit(rawData[2]);
                  let playing = rawData[3];
                  let total = rawData[4];
                  let description = edit(rawData[5]);
                  await playingStatusChannel.setName(`Playing » ${playing}/${total}`);
                  if(minecraftServerStatusChannel){
                    embed.setAuthor(`${guild.name}`, guild.iconURL())
                      .addFields({
                        name: "> IP",
                        value: `\`\`\`\n${IP}\n\`\`\``
                      },
                      {
                        name: "> PORT",
                        value: `\`\`\`\n${port}\n\`\`\``
                      },
                      {
                        name: "> VERSION",
                        value: `\`\`\`\n${version}\n\`\`\``
                      },
                      {
                        name: "> PLAYING",
                        value: `\`\`\`\n${playing}/${total}\n\`\`\``
                      },{
                        name: "> MOTD",
                        value: `\`\`\`\n${description}\n\`\`\``
                      })
                      .setThumbnail("https://cdn.discordapp.com/emojis/913429376215961610.gif?size=4096");
                    if(statusMessage){
                      await statusMessage.edit(embed);
                    }
                    else{
                      await minecraftServerStatusChannel.send(embed);
                    }
                  }
                }else{
                  await playingStatusChannel.setName(`OFFLINE`); 
                  if(minecraftServerStatusChannel){
                    embed.setAuthor(`🔴${guild.name}`, guild.iconURL())
                      .setTitle("OFFLINE")
                      .setColor(0xff4747)
                      .setThumbnail("https://cdn.discordapp.com/emojis/913434792677228544.gif?size=4096");
                    if(statusMessage){
                      await statusMessage.edit(embed);
                    }
                    else{
                      await minecraftServerStatusChannel.send(embed);
                    }
                  }
                }
              }catch{
                await playingStatusChannel.setName(`OFFLINE`);  
                if(minecraftServerStatusChannel){
                  embed.setAuthor(`🔴${guild.name}`, guild.iconURL())
                    .setTitle("OFFLINE")
                    .setColor(0xff4747)
                    .setThumbnail("https://cdn.discordapp.com/emojis/913434792677228544.gif?size=4096");
                  if(statusMessage){
                    await statusMessage.edit(embed);
                  }
                  else{
                    await minecraftServerStatusChannel.send(embed);
                  }
                }
              }
            }
          }
        }
        //---------------STATS CHANNELS UPDATER-------------------
        const statsChannelsUpdater = require("../updater/statsChannelsUpdater.js");
        statsChannelsUpdater(guild, database);
      }
    }
  }, 300000);
}