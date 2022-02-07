module.exports = async(Discord, client, message, content, database, emojiIDs) =>{
  const tick = await client.emojis.cache.get(emojiIDs.tick);
  const cross = await client.emojis.cache.get(emojiIDs.cross);
  if(!message.member.hasPermission("ADMINISTRATOR")){
    let chatFilterLogsChannelID = await database.get("chatFilterLogsChannelID");
    if(!chatFilterLogsChannelID){
      return;
    }
    let chatFilterLogsChannel = message.guild.channels.cache.get(chatFilterLogsChannelID);
    if(!chatFilterLogsChannel){
      return;
    }
    let chatFilterEmbed = new Discord.MessageEmbed()
      .setTitle("Chat Filter Log")
      .setColor(0x98dbfa);
    let swearsList = await database.get('swearsList');
    let badwordsList = await database.get("badwordsList");
    if((!swearsList) && (!badwordsList)){
      return;
    }
    if(swearsList){
      let swearings = swearsList.split(" ");
      if(swearings){
        for(let i=0; i<=swearings.length-1; i++){
          if(content.includes(swearings[i])){
            await message.reply(`${cross} No swearing bruh.`).then((msg) => setTimeout(function(){msg.delete().catch(error => {});}, 10000)).catch(error => {});
            chatFilterEmbed.setDescription(`
              **User**- ${message.author.tag}\n
              **ID**- ${message.author.id}\n
              **Message**- ${message.content}\n
              **Filtered**- ${swearings[i]}\n
              **Result**- Deleted`);
            await chatFilterLogsChannel.send(chatFilterEmbed).catch(error => {});
            await message.delete().catch(error => {});
            return;
          }
        }
      }
    }
    if(badwordsList){
      let badwords = badwordsList.split(" ");
      if(badwords){
        for(let i=0; i<=badwords.length-1; i++){
          if(content.includes(badwords[i])){
            await message.react("🇳").then(
              message.react("🇴"),
              message.react("🇺")
            );
            chatFilterEmbed.setDescription(`
              **User**- ${message.author.tag}\n
              **ID**- ${message.author.id}\n
              **Message**- ${message.content}\n
              **Filtered**- ${badwords[i]}\n
              **Result**- Reacted with 🇳 🇴 🇺`);
            await chatFilterLogsChannel.send(chatFilterEmbed).catch(error => {});
            return;
          }
        }
      }
    }
  }
}