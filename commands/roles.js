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
        > ${arrow} ${prefix}roles \`<user>\``)
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
        let rolesMap = await person.roles.cache
        .sort((a, b) => b.position - a.position)
        .map(r => r);
        let rolesArray = [];
        for(let i=0; i<=rolesMap.length-1; i++){
          rolesArray[i] = rolesMap[i];
        }
        let rolesList;
        if(rolesArray.length > 50){
          rolesArray.length = 50;
          rolesList = rolesArray.join(" , ");
          rolesList = rolesList + ` , +${rolesArray.length-50} roles.`
        }
        else{
          rolesList = rolesArray.join(" , ");
          rolesList = rolesList + ".";
        }
        embed.setAuthor("", person.user.displayAvatarURL({dynamic: true}))
        .setTitle(`${person.user.username}'s Roles List`)
        .setThumbnail(person.user.displayAvatarURL({dynamic: true}))
        .setDescription(`${rolesList}`)
        .setColor(0x2f3136);
        await message.channel.send(embed).catch(error => {});
      }
    }
  }        