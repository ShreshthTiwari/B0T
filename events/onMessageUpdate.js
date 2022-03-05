module.exports = async (Discord, client, oldMessage, newMessage, database) => {
  if(newMessage.author.id == client.user.id){
    return;
  }
  let chatLogsChannel, chatLogsChannelID;
  chatLogsChannelID = await database.get("chatLogsChannelID");
  if(chatLogsChannelID){
    chatLogsChannel = await newMessage.guild.channels.cache.get(chatLogsChannelID);
    if(chatLogsChannel){
      let embed = new Discord.MessageEmbed()
      .setColor(0x98dbfa);
      let oldMessageContent = oldMessage.content;
      if(oldMessageContent.length > 100){
        oldMessageContent.length = 97;
        oldMessageContent = oldMessageContent + "...";
      }
      let newMessageContent = newMessage.content;
      if(newMessageContent.length > 100){
        newMessageContent.length = 97;
        newMessageContent = newMessageContent + "...";
      }
      embed = new Discord.MessageEmbed()
      .setTitle("Message Updated")
      .setDescription(`**User**- ${newMessage.author}.
      **Name**- \`${newMessage.author.username}\`.
      **ID**- \`${newMessage.author.id}\`.
      **Channel**- ${newMessage.channel}.
      **Message ID**- \`${newMessage.id}\`.
      **Old Message**-\n${oldMessageContent}
      **New Message**-\n${newMessageContent}
      **[Jump To Message](${newMessage.url})**`)
      .setColor(0x95fd91);
      await chatLogsChannel.send(embed).catch(error => {});
    }
  }
}