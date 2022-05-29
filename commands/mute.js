module.exports = {
  name: "mute",
  description: "mute the bad guy",
  alias: [],

  async run(Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, emojiIDs){
    const tick = await client.emojis.cache.get(emojiIDs.tick);
    const cross = await client.emojis.cache.get(emojiIDs.cross);
    let time, t = "undefined", type, person, reason;
    let embed = new Discord.MessageEmbed()
    .setColor(0x98dbfa);
    if(!message.member.hasPermission("ADMINISTRATOR")){
      await message.reactions.removeAll();
      react(message, '❌');
      return;
    }
    if(!args[0]){
      embed.setDescription(`${cross} Command Usage-\n\`-mute <user> <time> <reason>\`\n(time formats- s, min, h, d, m)`)
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
    if(person.hasPermission("ADMINISTRATOR")){
      embed.setDescription(`${cross} Can't mute ${person}.`)
      .setColor(0xff4747);
      await message.channel.send(embed).catch(error => {});
      await message.reactions.removeAll();
      react(message, '❌');
      return;
    }
    let mutedRoleID = await database.get("mutedRoleID");
    if(!mutedRoleID){
      embed.setDescription(`${cross} Mute role not set.`)
      .setColor(0xff4747);
      await message.channel.send(embed).catch(error => {});
      await message.reactions.removeAll();
      react(message, '❌');
      return;
    }
    let mutedRole = message.guild.roles.cache.get(mutedRoleID);
    if(!mutedRole){
      embed.setDescription(`${cross} Mute role not set.`)
      .setColor(0xff4747);
      await message.channel.send(embed).catch(error => {});
      await message.reactions.removeAll();
      react(message, '❌');
      return;   
    }
    if(person.roles.cache.has(mutedRoleID)){
      embed.setDescription(`${cross} ${person} is already muted.`)
      .setColor(0xff4747);
      await message.channel.send(embed).catch(error => {});
      await message.reactions.removeAll();
      react(message, '❌');
    }else{
      person.roles.add(mutedRoleID);
      reason = messageEmojiFinder(client, message, args.slice(1));
      if(args[1] && args[1].match(/^\d/)){
        reason = messageEmojiFinder(client, message, args.slice(2));
        if(args[1].endsWith('s')){
          time = args[1].replace(/[a-zA-Z]+/,'');
          type = 'second';
          if(!(isNaN(time))){
            if(time > 1){
              type = type + 's';
            }
            t = time * 1000;
          }
        }
        else if(args[1].endsWith('min')){
          time = args[1].replace(/[a-zA-Z]+/,'');
          type = 'minute';
          if(!(isNaN(time))){
            if(time > 1){
              type = type + 's';
            }
            t = time * 60000;
          }
        }
        else if(args[1].endsWith('h')){
          time = args[1].replace(/[a-zA-Z]+/,'');
          type = 'hour';
          if(!(isNaN(time))){
            if(time > 1){
              type = type + 's';
            }
            t = time * 3600000;
          }
        }
        else if(args[1].endsWith('d')){
          time = args[1].replace(/[a-zA-Z]+/,'');
          type = 'day';
          if(!(isNaN(time))){
            if(time > 1){
              type = type + 's';
            }
            t = time * 86400000;
          }
        }
        else if(args[1].endsWith('m')){
          time = args[1].replace(/[a-zA-Z]+/,'');
          type = 'month';
          if(!(isNaN(time))){
            if(time > 1){
              type = type + 's';
            }
            t = time * 2592000000;
          }
        }
      }
      if(!reason){
        reason = "Not Provided";
      }
      let tempT;
      if(t == "undefined"){
        embed.setDescription(`${tick} Muted ${person} for \`forever\`.\n**Reason**- ${reason}`)
        .setColor(0x95fd91);
        await message.channel.send(embed).catch(error => {});
        embed.setAuthor(message.guild.name, message.guild.iconURL())
        .setDescription(`${cross} Muted for \`forever\`.\nReason- ${reason}`)
        .setColor(0xff4747);
        await person.send(embed).catch(error => {/*nothing DMS are off or blocked*/});
        tempT = "forever";
      }else{
        embed.setDescription(`${tick} Muted ${person} for \`${time} ${type}\`.\nReason- ${reason}`)
        .setColor(0x95fd91);
        await message.channel.send(embed).catch(error => {});
        embed.setAuthor(message.guild.name, message.guild.iconURL())
        .setDescription(`${cross} Muted for \`${time} ${type}\`.\nReason- ${reason}`)
        .setColor(0xff4747);
        await person.send(embed).catch(error => {/*nothing DMS are off or blocked*/});
        tempT = time + " " + type;
        setTimeout(async function(){
          if(person.roles.cache.has(mutedRoleID)){
            person.roles.remove(mutedRoleID);
            embedsetAuthor(message.guild.name, message.guild.iconURL())
            .setDescription(`${tick} Unmuted.`)
            .setColor(0x95fd91);
            await person.send(embed).catch(error => {/*nothing DMS are off or blocked*/});
          }
        }, t);
        await message.delete().catch(error => {});
      }
      let moderationLogsChannel, moderationLogsChannelID;
      moderationLogsChannelID = await database.get("moderationLogsChannelID");
      if(moderationLogsChannelID){
        moderationLogsChannel = await message.guild.channels.cache.get(moderationLogsChannelID);
        if(moderationLogsChannel){
          embed.setAuthor(person.user.username)
          .setDescription(`**User**- ${person}.
          **Name**- ${person.user.tag}.
          **ID**- ${person.id}.
          **Muted By**- ${message.author}.
          **Reason**- ${reason}.
          **For**- ${tempT}.`)
          .setColor(0x95fd91);
          await moderationLogsChannel.send(embed).catch(error => {console.log(error)});
        }
      }
    }
  }
}