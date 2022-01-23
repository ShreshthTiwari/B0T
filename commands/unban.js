module.exports = {
  name : 'unban',
  description : 'to unban someone',

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
    let userID = args[0];
    await message.guild.fetchBans().then(async bans=> {
      if(bans.size == 0){
        embed.setDescription(`${cross} Ban list is empty.`)
          .setColor(0xff4747);
        await message.chanel.send(embed).catch(error => {});
        await message.reactions.removeAll();
        react(message, '❌');
        return;
      }
      let bUser = bans.find(b => b.user.id == userID)
      if(!bUser){
        embed.setDescription(`${cross} User is not banned.`)
          .setColor(0xff4747);
        await message.channel.send(embed).catch(error => {});
        await message.reactions.removeAll();
        react(message, '❌');
        return;
      }
      await message.guild.members.unban(bUser.user);
      embed.setDescription(`${tick} Unbanned __${userID}__.`)
        .setColor(0x95fd91);
      await message.channel.send(embed).catch(error => {});
      let moderationLogsChannel, moderationLogsChannelID;
      moderationLogsChannelID = await database.get("moderationLogsChannelID");
      if(moderationLogsChannelID){
        moderationLogsChannel = await message.guild.channels.cache.get(moderationLogsChannelID);
        if(moderationLogsChannel){
          let person = await client.users.cache.get(userID);
          if(person){
            embed.setAuthor(person.username)
              .setDescription(`Name- ${person.tag}.
              ID- ${person.id}.
              Unbanned By- ${message.author}.`)
              .setColor(0x95fd91);
          }else{
            embed.setAuthor(person.username)
              .setDescription(`ID- ${person.id}.
              Unbanned By- ${message.author}.`)
              .setColor(0x95fd91);
          }
          await moderationLogsChannel.send(embed).catch(error => {console.log(error)});
        }
      }
      await message.delete().catch(error => {});
    });
  }
}