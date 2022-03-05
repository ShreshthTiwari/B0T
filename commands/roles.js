module.exports = {
    name : 'roles',
    description : "to view/clear a person's role",
   
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
      if(args[0] && args[0].toLowerCase() == "help"){
        embed.setDescription(`**Roles Help**
        > ${arrow} ${prefix}roles help
        > ${arrow} ${prefix}roles \`<user>\`
        > ${arrow} ${prefix}roles \`<user>\` clear`)
        .setColor(0x2f3136);
        await message.channel.send(embed).catch(error => {});
      }
      else{
        let person;
        if(!args[0]){
          person = message.member;
        }
        else{
          person = await message.guild.members.cache.get(args[0]) || message.mentions.members.first();
        }
        if(!person){
          embed.setDescription(`${cross} User not provided.`)
          .setColor(0xff4747);
          await message.channel.send(embed).catch(error => {});
          await message.reactions.removeAll();
          react(message, '❌');
          return;
        }
        if(args[1] && args[1].toLowerCase() == "clear"){
          if(!person.roles.cache.second()){
            embed.setDescription(`${cross} ${person} already has no roles.`)
            .setColor(0xff4747);
            await message.channel.send(embed).catch(error => {});
            await message.reactions.removeAll();
            react(message, '❌');
            return;
          }
          try{
            let roles = await person.roles.cache.filter(role => role.id != person.guild.id);
            await person.roles.remove(roles).then(async success => {
              embed.setDescription(`${tick} Removed\n${roles}\nfrom ${person}.`)
              .setColor(0x95fd91);
              await message.channel.send(embed).catch(error => {});
            })
          }catch{
            embed.setDescription(`${cross} Error removing roles.\nAre they higher than me?`)
            .setColor(0xff4747);
            await message.channel.send(embed).catch(error => {});
            await message.reactions.removeAll();
            react(message, '❌');
            return;
          }
        }
        else{
          embed.setDescription(`${person.roles.cache
            .sort((a, b) => b.position - a.position)
            .map(r => r)}`);
          await message.channel.send(embed).catch(error => {});
        }
      }
    }
  }        