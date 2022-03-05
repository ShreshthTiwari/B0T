module.exports = {
    name : 'nuke',
    description : 'to nuke a channel',
  
    async run(Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, emojiIDs){
      let channel = message.mentions.channels.first();
      if(!channel){
        channel = message.channel;
      }
      let embed = new Discord.MessageEmbed()
      .setColor(0xff4747);
      if(!message.member.hasPermission("ADMINISTRATOR")){
        await message.reactions.removeAll();
        react(message, '❌');
        return;
      }
      let nukedChannelName = message.channel.name;
      let nukedChannelID = message.channel.id;
      let newChannel, newChannelID;
      let nuker = message.author;
      let nukerID = message.author.id;
      embed.setDescription("Nuking the Channel in `5` seconds!");
      await message.channel.send(embed).then(async (msg) => setTimeout(async function(){
          embed.setDescription("Nuking the Channel in `4` seconds!");
          await msg.edit(embed).then(async (msg) => setTimeout(async function(){
            embed.setDescription("Nuking the channel in `3` seconds!");
            await msg.edit(embed).then(async (msg) => setTimeout(async function(){
              embed.setDescription("Nuking the channel in `2` seconds!");
              await msg.edit(embed).then(async (msg) => setTimeout(async function(){
                embed.setDescription("Nuking the channel in `1` second!");
                await msg.edit(embed).then(async (msg) => setTimeout(async function(){
                  embed.setDescription("Nuke Launched!");
                  await msg.edit(embed).then(async (msg) => setTimeout(async function(){
                    embed.setDescription("**CHANNEL NUKED**")
                      .setImage("https://i.ibb.co/Bcskp4q/nuked.gif");
                    await msg.edit(embed).then(async (msg) => setTimeout(async function(){
                      await channel.clone().then(async (ch) => setTimeout(async function(){
                        newChannel = ch;
                        newChannelID = ch.id;
                        await channel.delete().catch(error => {});
                        let moderationLogsChannel, moderationLogsChannelID;
                        moderationLogsChannelID = await database.get("moderationLogsChannelID");
                        if(moderationLogsChannelID){
                          moderationLogsChannel = await message.guild.channels.cache.get(moderationLogsChannelID);
                          if(moderationLogsChannel){
                            embed = new Discord.MessageEmbed()
                            .setTitle("Channel Nuked")
                            .setDescription(`**Nuked Channel Name**- \`${nukedChannelName}\`.
                            **Nuked Channel ID**- \`${nukedChannelID}\`.
                            **New Channel**- <#${newChannelID}>.
                            **New Channel ID**- \`${newChannelID}\`.
                            **Nuked By**- ${nuker}.
                            **ID**- \`${nukerID}\`.`)
                            .setColor(0x95fd91);
                            await moderationLogsChannel.send(embed).catch(error => {console.log(error)});
                          }
                        }
                      },1000)).catch(error => {});
                    },1000)).catch(error => {});
                  },1000)).catch(error => {});
                },1000)).catch(error => {});
              },1000)).catch(error => {});
            },1000)).catch(error => {});
          },1000)).catch(error => {});
      }, 1000)).catch(error => {});
    }
  }