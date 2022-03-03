module.exports = {
  name: "claim",
  description: "To claim a ticket",

  async run (Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, emojiIDs) {
    const tick = await client.emojis.cache.get(emojiIDs.tick);
    const cross = await client.emojis.cache.get(emojiIDs.cross);
    let embed = new Discord.MessageEmbed()
      .setColor(0x98dbfa);
    let staffRole, staffRoleID;
    staffRoleID = await database.get("staffRoleID");
    if(staffRoleID){
      staffRole = await message.guild.roles.cache.get(staffRoleID);
      if(staffRole){
        if(!(message.member.roles.cache.has(staffRoleID) || message.member.hasPermission("ADMINISTRATOR"))){
          await message.reactions.removeAll();
          react(message, '❌');
          return;
        }
      }
    }
    else{
      embed.setDescription(`${cross} Staff role not set.`)
        .setColor(0xff4747)
        .setFooter(`${prefix}set staffRole <role>`);
      await message.channel.send(embed).catch(error => {});
      await message.reactions.removeAll();
      react(message, '❌');
      return;
    }
    if (message.channel.name.startsWith("ticket") || message.channel.name.startsWith("bug") || message.channel.name.startsWith("report")){ 
      await message.channel.updateOverwrite(staffRoleID, {
        VIEW_CHANNEL: true,
        SEND_MESSAGES: false
      });
      await message.channel.updateOverwrite(message.author.id, {
        VIEW_CHANNEL: true,
        SEND_MESSAGES: true,
        EMBED_LINKS: true,
        ATTACH_FILES: true,
        READ_MESSAGE_HISTORY: true,
        USE_EXTERNAL_EMOJIS: true
      });
      embed.setDescription(`${tick} Ticket claimed by ${message.author}`)
        .setColor(0x95fd91);
      await message.channel.send(embed).catch(error => {});
    }
    else{
      embed.setDescription(`${cross} Not a ticket channel.`)
        .setColor(0xff4747);
      await message.channel.send(embed).catch(eror => {});
      await message.reactions.removeAll();
      react(message, '❌');
      return;
    }
  }
}