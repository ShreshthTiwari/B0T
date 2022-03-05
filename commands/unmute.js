module.exports = {
  name: "unmute",
  description: "unmute the bad guy",
  
  async run(Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, emojiIDs){
    const tick = await client.emojis.cache.get(emojiIDs.tick);
    const cross = await client.emojis.cache.get(emojiIDs.cross);
    let person;
    let embed = new Discord.MessageEmbed()
    .setColor(0x98dbfa);
    if(!message.member.hasPermission("ADMINISTRATOR")){
      await message.reactions.removeAll();
      react(message, '❌');
      return;
    }
    if(!args[0]){
      embed.setDescription(`${cross} Provide a user.`)
      .setColor(0xff4747);
      await message.channel.send(embed).catch(error => {});
      await message.reactions.removeAll();
      react(message, '❌');
      return;
    }
    person = personFinder(message, args[0], "member");
    if(!person){
      embed.setDescription(`${cross} Wrong user.`)
      .setColor(0xff4747);
      await message.channel.send(embed).catch(error => {});
      await message.reactions.removeAll();
      react(message, '❌');
      return;
    }
    let mutedRoleID = await database.get("mutedRoleID");
    if(!mutedRoleID){
      embed.setDescription(`${cross} Muted role not set.`)
      .setColor(0xff4747);
      await message.channel.send(embed).catch(error => {});
      await message.reactions.removeAll();
      react(message, '❌');
      return;
    }
    let mutedRole = message.guild.roles.cache.get(mutedRoleID);
    if(!mutedRole){
      embed.setDescription(`${cross} Muted role not set.`)
      .setColor(0xff4747);
      await message.channel.send(embed).catch(error => {});
      await message.reactions.removeAll();
      react(message, '❌');
      return;   
    }
    if(person.roles.cache.has(mutedRoleID)){
      person.roles.remove(mutedRoleID);
      embed.setDescription(`${tick} Unmuted ${person}.`)
      .setColor(0x95fd91);
      await message.channel.send(embed).catch(error => {});
      embed.setAuthor(message.guild.name, message.guild.iconURL())
      .setDescription(`${tick} Unmuted.`)
      .setColor(0x95fd91);
      await person.send(embed).catch(error => {});
      let moderationLogsChannel, moderationLogsChannelID;
      moderationLogsChannelID = await database.get("moderationLogsChannelID");
      if(moderationLogsChannelID){
        moderationLogsChannel = await message.guild.channels.cache.get(moderationLogsChannelID);
        if(moderationLogsChannel){
          embed.setAuthor(person.user.username)
          .setDescription(`User- ${person}.
          Name- ${person.user.tag}.
          ID- ${person.id}.
          Unmuted By- ${message.author}.`)
          .setColor(0x95fd91);
          await moderationLogsChannel.send(embed).catch(error => {console.log(error)});
        }
      }
    }else{
      embed.setDescription(`${cross} ${person} not muted.`)
      .setColor(0xff4747);
      await message.channel.send(embed).catch(error => {});
    }
    await message.delete().catch(error => {});
  }
}