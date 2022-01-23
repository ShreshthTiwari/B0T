module.exports = {
  name : 'say',
  description : 'to make the bot say a message',

  async run(Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, e){
    const tick = await client.emojis.cache.get(e.tick);
    const cross = await client.emojis.cache.get(e.cross);
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
      embed.setDescription(`${cross} Message cannot be empty.`)
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
    await textChannel.send(msg).catch(error => {});
    await message.delete().catch(error => {});
  }
}