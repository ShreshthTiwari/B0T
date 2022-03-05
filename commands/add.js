module.exports = {
  name : 'add',
  description : 'to add a person to a ticket',

  async run(Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, emojiIDs){
    const tick = await client.emojis.cache.get(emojiIDs.tick);
    const cross = await client.emojis.cache.get(emojiIDs.cross);
    let embed = new Discord.MessageEmbed();
    if(!message.member.hasPermission("ADMINISTRATOR")){
      await message.reactions.removeAll();
      react(message, '❌');
      return;
    }
    if(message.channel.name.startsWith("ticket-") || message.channel.name.startsWith("bug-") || message.channel.name.startsWith("report-")){
      if(!args[0]){
        embed.setDescription(`${cross} Please provide a user.`)
        .setColor(0xff4747);
        await message.channel.send(embed).catch(error => {});
        await message.reactions.removeAll();
        react(message, '❌');
        return;
      }
      let person = personFinder(message, args[0], "member");
      if(!person){
        embed.setDescription(`${cross} Wrong user.`)
        .setColor(0xff4747);
        await message.channel.send(embed).catch(error => {});
        await message.reactions.removeAll();
        react(message, '❌');
        return;
      } 
      await message.channel.updateOverwrite(person, {
        VIEW_CHANNEL: true,
        SEND_MESSAGES: true,
        EMBED_LINKS: true,
        ATTACH_FILES: true,
        READ_MESSAGE_HISTORY: true,
        USE_EXTERNAL_EMOJIS: true,
        CHANGE_NICKNAME: true
      }).catch(console.error);
      embed.setDescription(`${tick} ${person} added.`)
        .setColor(0x95fd91);
      await message.channel.send(embed).catch(error => {});  
    }
    else{
      embed.setDescription(`${cross} Not a ticket channel.`)
      .setColor(0xff4747);
      await message.channel.send(embed).catch(error => {});
      await message.reactions.removeAll();
      react(message, '❌');
    }
  }
}