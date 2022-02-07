module.exports = {
  name : 'embed',
  description : 'to make the bot say message as an embed',

  async run(Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, emojiIDs){
    const tick = await client.emojis.cache.get(emojiIDs.tick);
    const cross = await client.emojis.cache.get(emojiIDs.cross);
    let embed = new Discord.MessageEmbed()
      .setColor(0x98dbfa);
    if(!message.member.hasPermission("ADMINISTRATOR")){
      await message.reactions.removeAll();
      react(message, '❌');
      return;
    }
    let textChannel;
    textChannel = message.mentions.channels.first();
    msg = messageEmojiFinder(client, message, args.slice(1));
    if(!textChannel){
      textChannel = message.channel;
      msg = messageEmojiFinder(client, message, args);
    }
    if(!msg){
      embed.setDescription(`${cross} Embed cannot be empty.`)
        .setColor(0xff4747); 
      await message.channel.send(embed).catch(error => {});
      await message.reactions.removeAll();
      react(message, '❌');
      return;
    }
    if(msg.length >= 2000){
      msg.length = 1997;
      msg = msg + "...";
    }
    embed.setDescription(`${msg}`);
    await textChannel.send(embed).catch(error => {});
    await message.delete().catch(error => {});
  }
}