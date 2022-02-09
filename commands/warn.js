module.exports = {
  name : 'warn',
  description : 'to warn someone',

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
    let person, warnReason = "Not Defined", warnsCount, warnsText = "warning";
    if((!args[0]) || args[0].toLowerCase() == "help"){
      embed.setTitle("Warn Help")
        .setDescription(`
        > ${arrow} ${prefix}warn help
        > ${arrow} ${prefix}warn \`<user>\``);
      await message.channel.send(embed).catch(error => {});
    }
    else{
      person = personFinder(message, args[0], "member");
      if(!person){
        embed.setDescription(`${cross} Wrong user.`)
          .setColor(0xff4747);
        await message.channel.send(embed).catch(error => {});
        await message.delete().catch(error => {});
        return;
      }  
      if((person.id == message.author.id) || person.hasPermission("ADMINISTRATOR")){
        embed.setDescription(`${cross} Can't warn them.`)
          .setColor(0xff4747);
        await message.channel.send(embed).catch(error => {});
        await message.delete().catch(error => {});
        return;
      }
      warnsCount = await database.get(`${person.id} warns`);
      if((!warnsCount) || (warnsCount < 0)){
        warnsCount = 0;
        await database.set(`${person.id} warns`, warnsCount);
      }
      if(args[1]){
        warnReason = args.slice(1).join(" ");
      }
      warnsCount++;
      if(warnsCount > 1)
        warnsText = warnsText + 's';
      await database.set(`${person.id} warns`, warnsCount);
      embed.setTitle(`Warned ${person.user.username}`)
        .setDescription(`Reason- ${warnReason}.`)
        .setFooter(`${warnsCount} ${warnsText}`);
      await message.channel.send(embed).catch(error => {});
      embed.setAuthor(message.guild.name, message.guild.iconURL())
        .setTitle(`You were warned`)
        .setDescription(`Reason- ${warnReason}.`)
        .setFooter(`${warnsCount} ${warnsText}`)
        .setColor(0xff4747);
      await person.send(embed).catch(error => {});
      let moderationLogsChannel, moderationLogsChannelID;
      moderationLogsChannelID = await database.get("moderationLogsChannelID");
      if(moderationLogsChannelID){
        moderationLogsChannel = await message.guild.channels.cache.get(moderationLogsChannelID);
        if(moderationLogsChannel){
          embed = new Discord.MessageEmbed()
            .setAuthor(person.user.username)
            .setDescription(`User- ${person}.
            Name- ${person.user.tag}.
            ID- ${person.id}.
            Warned By- ${message.author}.
            Reason- ${warnReason}.
            Warns- ${warnsCount} ${warnsText}.`)
            .setColor(0x95fd91);
          await moderationLogsChannel.send(embed).catch(error => {});
        }
      }
    }
    await message.delete().catch(error => {});
  }
}