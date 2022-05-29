module.exports = {
  name : 'warns',
  description : "to check someone's warnings",
  alias: [],

  async run(Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, emojiIDs){
    const tick = await client.emojis.cache.get(emojiIDs.tick);
    const cross = await client.emojis.cache.get(emojiIDs.cross);
    let embed = new Discord.MessageEmbed()
    .setColor(0x98dbfa);
    if(!message.member.hasPermission("ADMINISTRATOR")){
      await message.reactions.removeAll();
      await message.react('❌');
      return;
    }
    let person, warnsCount, warnsText = "warning";
    person = personFinder(message, args[0], "user");
    if((!person) || (!args[0])){
      person = message.author;
    }
    warnsCount = await database.get(`${person.id} warns`);
    if(!warnsCount){
      warnsCount = 0;
      await database.set(`${person.id} warns`, warnsCount);
    }
    if(warnsCount > 1)
      warnsText = warnsText + 's';
    if((!args[0]) || args[0].toLowerCase() == "help"){
      embed.setTitle("Warns Help")
      .setDescription(`
      > ${arrow} ${prefix}warns help
      > ${arrow} ${prefix}warns \`<user>\`
      > ${arrow} ${prefix}warns clear \`<user>\`
      > ${arrow} ${prefix}warns set \`<user>\` \`<amount>\``);
      await message.channel.send(embed).catch(error => {});
    }
    else if(args[0].toLowerCase() == "clear"){
      person = personFinder(message, args[0], "user");
      if((!person) || (!args[0])){
        person = message.author;
      }
      await database.set(`${person.id}`, 0);
      embed.setTitle(`${person.username}'s warnings`)
      .setDescription(`${tick} Cleared ${person}'s warnings.\nThey now have 0 warning.`)
      .setColor(0x95fd91);
      await message.channel.send(embed).catch(error => {});
      let moderationLogsChannel, moderationLogsChannelID;
      moderationLogsChannelID = await database.get("moderationLogsChannelID");
      if(moderationLogsChannelID){
        moderationLogsChannel = await message.guild.channels.cache.get(moderationLogsChannelID);
        if(moderationLogsChannel){
          console.log("moderation Channel found");
          embed.setAuthor(person.username)
          .setDescription(`User- ${person}.
          Name- ${person.tag}.
          ID- ${person.id}.
          Warnings Updated By- ${message.author}.
          Total Warnings- ${warnsCount} ${warnsText}.`)
          .setColor(0x95fd91);
          await moderationLogsChannel.send(embed).catch(error => {});
        }
      }
    }
    else if(args[0].toLowerCase() == "set"){
      person = personFinder(message, args[0], "user");
      if((!person) || (!args[0])){
        person = message.author;
      }
      warnsText = "warning";
      if((!args[2]) || (isNaN(args[2]))){
        warnsCount = 0;
        await database.set(`${person.id}`, warnsCount);
        embed.setTitle(`${person.username}'s warnings`)
        .setDescription(`${tick} Cleared ${person}'s warnings.\nThey now have 0 ${warnsText}.`)
        .setColor(0x95fd91);
      }else{
        warnsCount = args[2] * 1;
        if(warnsCount > 1){
          warnsText = warnsText + 's';
        }
        await database.set(`${person.id}`, warnsCount);
        embed.setTitle(`${person.username}'s warnings`)
        .setDescription(`${tick} Updated ${person}'s warnings.\nThey now have ${warnsCount} ${warnsText}.`)
        .setColor(0x95fd91);
      }
      await message.channel.send(embed).catch(error => {});
      let moderationLogsChannel, moderationLogsChannelID;
      moderationLogsChannelID = await database.get("moderationLogsChannelID");
      if(moderationLogsChannelID){
        moderationLogsChannel = await message.guild.channels.cache.get(moderationLogsChannelID);
        if(moderationLogsChannel){
          console.log("moderation Channel found");
          embed.setAuthor(person.username)
          .setDescription(`User- ${person}.
          Name- ${person.tag}.
          ID- ${person.id}.
          Warnings Updated By- ${message.author}.
          Total Warnings- ${warnsCount} ${warnsText}.`)
          .setColor(0x95fd91);
          await moderationLogsChannel.send(embed).catch(error => {});
        }
      }
    }
    else{
      embed.setTitle(`${person.username}'s warnings`)
      .setDescription(`${warnsCount} ${warnsText}.`);
      await message.channel.send(embed).catch(error => {});
    }
  }
}