module.exports = {
  name : 'kick',
  description : 'to kick someone',

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
    if(!args[0]){
      embed.setDescription(`${cross} Wrong user.`)
        .setColor(0xff4747);
      await message.channel.send(embed).catch(error => {});
      await message.reactions.removeAll();
      react(message, '❌');
      return;  
    }
    let person = await message.guild.members.cache.get(args[0]) || message.mentions.members.first();
    if(!person){
      embed.setDescription(`${cross} Wrong user.`)
        .setColor(0xff4747);
      await message.channel.send(embed).catch(error => {});
      await message.reactions.removeAll();
      react(message, '❌');
      return;
    } 
    if(person.hasPermission("ADMINISTRATOR")){
      embed.setDescription(`${cross} Can't kick them.`)
        .setColor(0xff4747);
      await message.channel.send(embed).catch(error => {}); 
      await message.reactions.removeAll();
      react(message, '❌'); 
      return;
    }
    let reason = messageEmojiFinder(client, message, args.slice(1));
    if(reason){
      reason = "Unspecified";
    }
    embed.setAuthor(message.guild.name, message.guild.iconURL())
      .setDescription(`${cross} You were kicked.\nReason- \`${reason}\``)
      .setColor(0xff4747);
    await person.send(embed).catch(error => {/*nothing DMS are off or blocked*/});
    let moderationLogsChannel, moderationLogsChannelID;
    moderationLogsChannelID = await database.get("moderationLogsChannelID");
    if(moderationLogsChannelID){
      moderationLogsChannel = await message.guild.channels.cache.get(moderationLogsChannelID);
      if(moderationLogsChannel){
        embed.setAuthor(person.user.username)
          .setDescription(`Name- ${person.user.tag}.
          ID- ${person.id}.
          Kicked By- ${message.author}.
          Reason- ${reason}.`)
          .setColor(0x95fd91);
        await moderationLogsChannel.send(embed).catch(error => {});
      }
    }
    await message.guild.members.cache.get(person.id).kick(reason).catch(console.error());
    embed.setDescription(`${tick} Kicked ~~**__${person}__**~~.\nID-${person.id}\nReason- \`${reason}\``)
      .setColor(0x95fd91);
    await message.channel.send(embed).catch(error => {});
  }
}