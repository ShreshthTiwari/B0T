module.exports = {
  name : 'ban',
  description : 'to ban someone',
  alias: [],

  async run(Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, emojiIDs){
    const tick = await client.emojis.cache.get(emojiIDs.tick);
    const cross = await client.emojis.cache.get(emojiIDs.cross);
    let embed = new Discord.MessageEmbed();
    if(!message.member.hasPermission("ADMINISTRATOR")){
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
      embed.setDescription(`${cross} Can't ban them.`)
      .setColor(0xff4747);
      await message.channel.send(embed).catch(error => {});
      await message.reactions.removeAll();
      react(message, '❌');
      return;
    }
    let banReason,banDays;
    if(isNaN(args[1])){
      banReason = messageEmojiFinder(client, message, args.slice(1));
      banDays = "Forever";
    }
    else{
      banDays = args[1];
      banReason = messageEmojiFinder(client, message, args.slice(2));
    }
    if(!banReason){
      banReason = "Unspecified";
    }
    embed.setAuthor(message.guild.name, message.guild.iconURL())
    .setDescription(`${cross} Banned from **${message.guild.name}**.\nReason- \`${banReason}\`\n\n-----\nYou can ban appeal using the command- \`-banappeal ${message.guild.id} <msg>\`\n-----`)
    .setColor(0xff4747);
    await person.send(embed).catch(error => {});
    let moderationLogsChannel, moderationLogsChannelID;
    moderationLogsChannelID = await database.get("moderationLogsChannelID");
    if(moderationLogsChannelID){
      moderationLogsChannel = await message.guild.channels.cache.get(moderationLogsChannelID);
      if(moderationLogsChannel){
        embed.setAuthor(person.user.username)
        .setDescription(`Name- ${person.user.tag}.
        ID- ${person.id}.
        Banned By- ${message.author}.
        Reason- ${banReason}.`)
        .setColor(0x95fd91);
        await moderationLogsChannel.send(embed).catch(error => {});
      }
    }
    if(isNaN(banDays)){
      await message.guild.members.cache.get(person.id).ban({reason: banReason }).catch(error => {});
    }else{
      await message.guild.members.cache.get(person.id).ban({days: banDays ,reason: banReason }).catch(error => {});
    }
    embed.setDescription(`${tick} Banned ~~**__${person}__**~~.\nID-${person.id}\nReason- \`${banReason}\`\nDuration- ${banDays} days.`)
    .setColor(0x95fd91);
    await message.channel.send(embed).catch(error => {});
  }
}