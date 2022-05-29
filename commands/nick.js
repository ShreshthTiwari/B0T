module.exports = {
    name : 'nick',
    description : 'to nickname someone',
    alias: [],
  
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
      let person = message.guild.members.cache.get(args[0]) || message.mentions.members.first();
      let nick;
      if(!person){
        person = message.member;
        nick = args.join();
      }
      else{
        if(!args[1]){
          nick = person.user.username;
        }else{
          nick = args.slice(1).join(" ");
        }
      }
      if(nick.length <= 0){
        embed.setDescription(`${cross} Nickname cannt be empty.`)
        .setColor(0xff4747);
        await message.channel.send(embed).catch(error => {});
        await message.reactions.removeAll();
        react(message, '❌');
        return;
      }
      embed.setDescription(`${tick} Nickname changed ${person.user.username} ${arrow} ${person}`)
      .setColor(0x95fd91);
      let embd = await message.channel.send(embed).catch(error => {});
      message.guild.members.cache.get(person.id).setNickname(`${nick}`).catch( error =>{
        embed.setDescription(`${cross} Error changing nickname of ${person}.\nMaybe his role is higher than mine.`)
        .setColor(0xff4747);
        embd.edit(embed).catch(error => {});
        message.reactions.removeAll();
        react(message, '❌');
      });
    }
  }