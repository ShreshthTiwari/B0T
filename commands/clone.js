module.exports = {
  name : 'clone',
  description : 'to clone a channel',
  alias: [],
  
  async run(Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, emojiIDs){
    const tick = await client.emojis.cache.get(emojiIDs.tick);
    const cross = await client.emojis.cache.get(emojiIDs.cross);
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
    let clonedChannel = await channel.clone().catch(async error => {
      embed.setDescription(`${cross} Error cloning the channel.`);
      await message.channel.send(embed).catch(error => {});
      return;
    });
    embed.setDescription(`${tick} Channel cloned. ${message.channel} => ${clonedChannel}`)
    .setImage("https://i.ibb.co/4mRRszS/homer-simpson-guanchidoguan.gif")
    .setColor(0x95fd91);
    await message.channel.send(embed).catch(error => {});
    let moderationLogsChannel, moderationLogsChannelID;
    moderationLogsChannelID = await database.get("moderationLogsChannelID");
    if(moderationLogsChannelID){
      moderationLogsChannel = await message.guild.channels.cache.get(moderationLogsChannelID);
      if(moderationLogsChannel){
        embed = new Discord.MessageEmbed()
        .setTitle("Channel Cloned")
        .setDescription(`**Parent Channel**- ${message.channel}.
        **Parent Channel ID**- \`${message.channel.id}\`.
        **Cloned Channel**- ${clonedChannel}.
        **Cloned Channel ID**- \`${clonedChannel.id}\`.
        **Cloned By**- ${message.author}.
        **Cloner ID**- \`${message.author.id}\`.`)
        .setColor(0x95fd91);
        await moderationLogsChannel.send(embed).catch(error => {console.log(error)});
      }
    }
  }
}