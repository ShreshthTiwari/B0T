module.exports = {
  name : 'say',
  description : 'to make the bot say a message',
  alias: [],
  
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
    if(textChannel){
      msg = await messageEmojiFinder(client, message, args.slice(1));
    }else{
      textChannel = message.channel;
      msg = await messageEmojiFinder(client, message, args);
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