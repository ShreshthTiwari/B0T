module.exports = {
  name : 'remove',
  description : 'to remove a person from a ticket',
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
    if(message.channel.name.startsWith("ticket-") || message.channel.name.startsWith("bug-") || message.channel.name.startsWith("report-")){
      if(!args[0]){
        await message.channel.send(`${cross} Please provide a user.`).catch(error => {});
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
        VIEW_CHANNEL: false,
        SEND_MESSAGES: false,
        EMBED_LINKS: false,
        ATTACH_FILES: false,
        READ_MESSAGE_HISTORY: false,
        USE_EXTERNAL_EMOJIS: false,
        CHANGE_NICKNAME: false
      }).catch(console.error);
      embed.setDescription(`${tick} ${person} removed.`)
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