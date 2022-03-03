module.exports = async(Discord, client, guild, database, util) => {
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
            if(minecraftServerStatusChannel){
              let messages = await minecraftServerStatusChannel.messages.fetch({limit: 10});
              statusMessage = messages.filter(m => m.author.id === client.user.id).last();
            }
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
              await playingStatusChannel.setName(`Playing » ${playing}/${total}`).catch(error => {});
              if(minecraftServerStatusChannel){
                embed = new Discord.MessageEmbed()
                  .setAuthor(`${guild.name}`, guild.iconURL())
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
                  await statusMessage.edit(embed).catch(error => {});
                }
                else{
                  await minecraftServerStatusChannel.send(embed).catch(error => {});
                }
              }
            }else{
              await playingStatusChannel.setName(`OFFLINE`).catch(error => {}); 
              if(minecraftServerStatusChannel){
                embed = new Discord.MessageEmbed()
                  .setAuthor(`🔴${guild.name}`, guild.iconURL())
                  .setTitle("OFFLINE")
                  .setColor(0xff4747)
                  .setThumbnail("https://cdn.discordapp.com/emojis/913434792677228544.gif?size=4096");
                if(statusMessage){
                  await statusMessage.edit(embed).catch(error => {});
                }
                else{
                  await minecraftServerStatusChannel.send(embed).catch(error => {});
                }
              }
            }
          }catch{
            await playingStatusChannel.setName(`OFFLINE`).catch(error => {});  
            if(minecraftServerStatusChannel){
              embed = new Discord.MessageEmbed()
                .setAuthor(`🔴${guild.name}`, guild.iconURL())
                .setTitle("OFFLINE")
                .setColor(0xff4747)
                .setThumbnail("https://cdn.discordapp.com/emojis/913434792677228544.gif?size=4096");
              if(statusMessage){
                await statusMessage.edit(embed).catch(error => {});
              }
              else{
                await minecraftServerStatusChannel.send(embed).catch(error => {});
              }
            }
          }
        }
      }
    }
}