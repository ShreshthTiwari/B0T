module.exports = async (Discord, client, deletedMessage, database) => {
  if(deletedMessage.author.id == client.user.id){
    return;
  }
  let chatLogsChannel, chatLogsChannelID;
  chatLogsChannelID = await database.get("chatLogsChannelID");
  if(chatLogsChannelID){
    chatLogsChannel = await deletedMessage.guild.channels.cache.get(chatLogsChannelID);
    if(chatLogsChannel){
      let embed = new Discord.MessageEmbed()
        .setColor(0x98dbfa);
      let content = deletedMessage.content;
      if(content.length > 100){
        content.length = 97;
        content = content + "...";
      }
      embed = new Discord.MessageEmbed()
        .setTitle("Message Deleted")
        .setDescription(`**User**- ${deletedMessage.author}.
        **Name**- \`${deletedMessage.author.tag}\`.
        **ID**- \`${deletedMessage.author.id}\`.
        **Channel**- ${deletedMessage.channel}.
        **Message ID**- \`${deletedMessage.id}\`.
        **Content**-\n${content}`)
        .setColor(0x95fd91);
      await chatLogsChannel.send(embed).catch(error => {});
    }
  }
}