module.exports = {
  name : 'role',
  description : "to add/remove a person's role",
 
  async run(Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, emojiIDs){
    const tick = await client.emojis.cache.get(emojiIDs.tick);
    const cross = await client.emojis.cache.get(emojiIDs.cross);
    const arrow = await client.emojis.cache.get(emojiIDs.arrow);
    let embed = new Discord.MessageEmbed()
      .setColor(0x98dbfa);
    if(!message.member.hasPermission("ADMINISTRATOR")){
      await message.reactions.removeAll();
      react(message, '❌');
      return;
    }
    if((!args[0]) || args[0].toLowerCase() == "help"){
      embed.setDescription(`**Role Help**
      > ${arrow} ${prefix}role help
      > ${arrow} ${prefix}role add \`<user>\` \`<role>\`
      > ${arrow} ${prefix}role remove \`<user>\` \`<role>\``)
      .setColor(0x2f3136);
      await message.channel.send(embed).catch(error => {});
    }
    else if(args[0].toLowerCase() == "add" || args[0].toLowerCase() == "remove"){
      let person = await message.mentions.members.first() || await message.guild.members.cache.get(args[1]);
      let role = await message.mentions.roles.first() || await message.guild.roles.cache.get(args[2]);
      if((!args[1]) || (!person)){
        embed.setDescription(`${cross} User not provided.`)
        .setColor(0xff4747);
        await message.channel.send(embed).catch(error => {});
        await message.reactions.removeAll();
        react(message, '❌');
        return;
      }
      if((!args[2]) || (!role)){
        embed.setDescription(`${cross} Role not provided.`)
        .setColor(0xff4747);
        await message.channel.send(embed).catch(error => {});
        await message.reactions.removeAll();
        react(message, '❌');
        return;
      }
      if(args[0].toLowerCase() == "add"){
        if(person.roles.cache.has(role)){
          embed.setDescription(`${cross} ${person} already has ${role}.`)
          .setColor(0xff4747);
          await message.channel.send(embed).catch(error => {});
          await message.reactions.removeAll();
          react(message, '❌');
          return;
        }
        try{
          await person.roles.add(role).then(async success => {
            embed.setDescription(`${tick} Added ${role} to ${person}.`)
            .setColor(0x95fd91);
            await message.channel.send(embed).catch(error => {});
          })
        }catch{
          embed.setDescription(`${cross} Error adding ${role}.\nAre they higher than me?`)
          .setColor(0xff4747);
          await message.channel.send(embed).catch(error => {});
          await message.reactions.removeAll();
          react(message, '❌');
          return;
        }
      }
      else{
        if(person.roles.cache.has(role)){
          embed.setDescription(`${cross} ${person} is already missing ${role}.`)
          .setColor(0xff4747);
          await message.channel.send(embed).catch(error => {});
          await message.reactions.removeAll();
          react(message, '❌');
          return;
        }
        try{
          await person.roles.remove(role).then(async success => {
            embed.setDescription(`${tick} Removed ${role} from ${person}.`)
            .setColor(0x95fd91);
            await message.channel.send(embed).catch(error => {});
          })
        }catch{
          embed.setDescription(`${cross} Error removing ${role}.\nAre they higher than me?`)
          .setColor(0xff4747);
          await message.channel.send(embed).catch(error => {});
          await message.reactions.removeAll();
          react(message, '❌');
          return;
        }
      }
    }
    else{
      embed.setDescription(`${cross} Invalid sub-command.`)
      .setColor(0xff4747);
      await message.channel.send(embed).catch(error => {});
      await message.reactions.removeAll();
      react(message, '❌');
      return;
    }
  }
}        