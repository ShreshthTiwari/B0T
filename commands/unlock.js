module.exports = {
  name : 'unlock',
  description : 'to unlock a channel',

  async run(Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, emojiIDs){
    const tick = await client.emojis.cache.get(emojiIDs.tick);
    const cross = await client.emojis.cache.get(emojiIDs.cross);
    let embed = new Discord.MessageEmbed();
    if(!message.member.hasPermission("ADMINISTRATOR")){
      await message.reactions.removeAll();
      react(message, '❌');
      return;
    }
    let channel = message.mentions.channels.first() || message.channel;
    await channel.setParent(channel.parentID).catch(async error => {
      embed.setDescription(`${cross} Error unlocking the channel.`)
        .setColor(0xff4747);
      await message.channel.send(embed).catch(error => {});
      await message.reactions.removeAll();
      react(message, '❌');
      return;
    });
    if(message.channel.id != channel.id){
      embed.setDescription(`${tick} Unlocked ${channel}.`)
        .setColor(0x95fd91);
      await message.channel.send(embed).catch(error => {});
      embed.setDescription(`${tick} Channel unlocked.`);
      await channel.send(embed).catch(error => {});
    }else{
      embed.setDescription(`${tick} Channel unlocked.`)
        .setColor(0x95fd91);
      await channel.send(embed).catch(error => {});
    }
  }
}