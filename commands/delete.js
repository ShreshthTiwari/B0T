module.exports = {
    name : 'delete',
    description : 'to delete a channel',
    alias: [],
  
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
      embed.setDescription("Deleting the Channel in `5` seconds!");
      await message.channel.send(embed).then(async (msg) => setTimeout(async function(){
          embed.setDescription("Deleting the Channel in `4` seconds!");
          await msg.edit(embed).then(async (msg) => setTimeout(async function(){
            embed.setDescription("Deleting the channel in `3` seconds!");
            await msg.edit(embed).then(async (msg) => setTimeout(async function(){
              embed.setDescription("Deleting the channel in `2` seconds!");
              await msg.edit(embed).then(async (msg) => setTimeout(async function(){
                embed.setDescription("Deleting the channel in `1` second!");
                await msg.edit(embed).then(async (msg) => setTimeout(async function(){
                  embed.setDescription("Deleting the channel!");
                  await msg.edit(embed).then(async (msg) => setTimeout(async function(){
                    embed.setDescription("**CHANNEL DELETED**")
                      .setImage("https://i.ibb.co/R49Kjf3/wasted.jpg");
                    await msg.edit(embed).then(async (msg) => setTimeout(async function(){
                      let moderationLogsChannel, moderationLogsChannelID;
                      moderationLogsChannelID = await database.get("moderationLogsChannelID");
                      if(moderationLogsChannelID){
                        moderationLogsChannel = await message.guild.channels.cache.get(moderationLogsChannelID);
                        if(moderationLogsChannel){
                          embed = new Discord.MessageEmbed()
                            .setTitle("Channel Deleted")
                            .setDescription(`**Channel Name**- \`${message.channel.name}\`.
                            **Channel ID**- \`${message.channel.id}\`.
                            **Deleted By**- ${message.author}.
                            **ID**- \`${message.author.id}\`.`)
                            .setColor(0x95fd91);
                          await moderationLogsChannel.send(embed).catch(error => {console.log(error)});
                        }
                      }
                      await channel.delete().catch(error => {});
                    },1000)).catch(error => {});
                  },1000)).catch(error => {});
                },1000)).catch(error => {});
              },1000)).catch(error => {});
            },1000)).catch(error => {});
          },1000)).catch(error => {});
      }, 1000)).catch(error => {});
    }
  }