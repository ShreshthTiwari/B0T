module.exports = {
  name: "customcommand",
  description: "create custom commands",
  alias: ["cc"],
  
  async run (Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, emojiIDs, helptext){
    const tick = await client.emojis.cache.get(emojiIDs.tick);
    const cross = await client.emojis.cache.get(emojiIDs.cross);
    const arrow = await client.emojis.cache.get(emojiIDs.arrow);
    if(!helptext){
      helptext = "cc";
    }
    let embed = new Discord.MessageEmbed()
    .setColor(0x98dbfa);
    if(!message.member.hasPermission("ADMINISTRATOR")){
      await message.reactions.removeAll();
      react(message, '❌');
      return;
    }
    let key, msg;
    if(args[1]){
      args[1] = args[1].toLowerCase(); 
    }
    if((!args[0]) || args[0].toLowerCase() == 'help'){
      embed.setDescription(`**Custom Commands Help**-
      > ${arrow} ${prefix}${helptext} help.
      > ${arrow} ${prefix}${helptext} create \`<command>\` \`<message>\`.
      > ${arrow} ${prefix}${helptext} update \`<command>\` \`<message>\`.
      > ${arrow} ${prefix}${helptext} remove \`<command>\`.`)
      .setColor(0x2f3136);
      await message.channel.send(embed).catch(error => {});
    }
    else if(args[0].toLowerCase() == 'create' || args[0].toLowerCase() == 'new' || args[0].toLowerCase() == 'make'){
      if(!args[1]){
        embed.setDescription(`${cross} Please provide a word.`)
        .setColor(0xff4747);
        await message.channel.send(embed).catch(error => {});
        await message.reactions.removeAll();
        react(message, '❌');
        return;
      }
      key = await database.get(`customCommand_${args[1]}`);
      if(key){
        embed.setDescription(`${cross} \`${prefix + args[1]}\` already present.`)
        .setColor(0xff4747);
        await message.channel.send(embed).catch(error => {});
        await message.reactions.removeAll();
        react(message, '❌');
        return;
      }
      if(!args[2]){
        embed.setDescription(`${cross} Please provide a message for \`${prefix + args[1]}\`.`)
        .setColor(0xff4747);
        await message.channel.send(embed).catch(error => {});
        await message.reactions.removeAll();
        react(message, '❌');
        return;
      }
      msg = messageEmojiFinder(client, message, args.slice(2));
      await database.set(`customCommand_${args[1]}`, msg);
      embed.setDescription(`${tick} Command- \`${args[1]}\`\nResponse- \`${msg}\``)
        .setColor(0x95fd91);
      await message.channel.send(embed).catch(error => {});
    }
    else if(args[0].toLowerCase() == 'edit' || args[0].toLowerCase() == 'update'){
      if(!args[1]){
        embed.setDescription(`${cross} Please provide a custom command name.`)
        .setColor(0xff4747);
        await message.channel.send(embed).catch(error => {});
        await message.reactions.removeAll();
        react(message, '❌');
        return;
      }
      let key = await database.get(`customCommand_${args[1]}`);
      if(!key){
        embed.setDescription(`${cross} \`${prefix + args[1]}\` not found.`)
        .setColor(0xff4747);
        await message.channel.send(embed).catch(error => {});
        await message.reactions.removeAll();
        react(message, '❌');
        return;
      }
      if(!args[2]){
        embed.setDescription(`${cross} Please provide a message for \`${prefix + args[1]}\`.`)
        .setColor(0xff4747);
        await message.channel.send(embed).catch(error => {});
        await message.reactions.removeAll();
        react(message, '❌');
        return;
      }
      let msg = messageEmojiFinder(client, message, args.slice(2));
      await database.set(`customCommand_${args[1]}`, msg);
      embed.setDescription(`${tick} .\nCommand- \`${args[1]}\`\nResponse- \`${msg}\``)
      .setColor(0x95fd91);
      await message.channel.send(embed).catch(error => {});
    }
    else if(args[0].toLowerCase() == 'remove' || args[0].toLowerCase() == 'reset' || args[0].toLowerCase() == 'clear' || args[0].toLowerCase() == 'delete'){
      if(!args[1]){
        embed.setDescription(`${cross} Please provide a custom command name.`)
        .setColor(0xff4747);
        await message.channel.send(embed).catch(error => {});
        await message.reactions.removeAll();
        react(message, '❌');
        return;
      }
      let key = await database.get(`customCommand_${args[1]}`);
      if(!key){
        embed.setDescription(`${cross} \`${prefix + args[1]}\` not found.`)
        .setColor(0xff4747);
        await message.channel.send(embed).catch(error => {});
        await message.reactions.removeAll();
        react(message, '❌');
        return;
      }
      await database.set(`customCommand_${args[1]}`, null);
      embed.setDescription(`${tick} \`${prefix + args[1]}\` removed.`)
      .setColor(0x95fd91);
      await message.channel.send(embed).catch(error => {});
    }
  }
}