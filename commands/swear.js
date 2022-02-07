module.exports = {
  name: "swear",
  description: "to add or remove swears",

  async run (Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, emojiIDs, helpText) {
    if(!helpText){
      helpText = "swear";
    }
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
    var swears = await database.get("swearsList");
    var swearsList = [];
    if(swears)
      swearsList = await swears.split(" ");
    if(args[1])
      args[1] = args[1].toLowerCase();
    if((!args[0]) || args[0].toLowerCase() == "help"){
      embed.setDescription(`**Swear Help**
      > ${arrow} ${prefix}${helpText} add \`<word>\`
      > ${arrow} ${prefix}${helpText} remove \`<word>\`
      > ${arrow} ${prefix}${helpText} view
      > ${arrow} ${prefix}${helpText} clear`);
      await message.channel.send(embed).catch(error => {});  
    }
    else if(args[0].toLowerCase() == 'add'){
      if(!args[1]){
        embed.setDescription(`${cross} Please provide a word.`)
          .setColor(0xff4747);
        await message.channel.send(embed).catch(error => {});
        await message.reactions.removeAll();
        react(message, '❌');
        return;
      }
      for(let i=0; i<=swearsList.length-1; i++){
        if(args[1] == swearsList[i]){
          embed.setDescription(`${cross} World already in swears list.`)
            .setColor(0xff4747);
          await message.channel.send(embed).catch(error => {});
          await message.delete().catch(error => {});
          return;
        }
      }
      swearsList[swearsList.length] = args[1];
      await database.set("swearsList", swearsList.join(" "));
      embed.setDescription(`${tick} ||${swearsList[swearsList.length-1]}|| added to swears list.`)
        .setColor(0x95fd91);
      await message.channel.send(embed).catch(error => {});
      await message.delete().catch(error => {});
    }
    else if(args[0].toLowerCase() == 'remove'){
      let pos = -1, word;
      if(!args[1]){
        embed.setDescription(`${cross} Please provide a word.`)
          .setColor(0xff4747);
        await message.channel.send(embed).catch(error => {});
        await message.reactions.removeAll();
        react(message, '❌');
        return;
      }
      for(let i=0; i<=swearsList.length-1; i++){
        if(args[1] == swearsList[i]){
          word = swearsList[i];
          pos = i;
          break;
        }
      }
      if(pos == -1){
        embed.setDescription(`${cross} ||${args[1]}|| not present in swears list.`)
          .setColor(0xff4747);
        await message.channel.send(embed).catch(error => {});
        await message.reactions.removeAll();
        react(message, '❌');
        return;
      }
      for(let i = pos; i <= swearsList.length-1; i++){
        swearsList[i] = swearsList[i+1];
      }
      swearsList.pop();
      await database.set("swearsList", swearsList.join(" "));
      embed.setDescription(`${tick} ||${word}|| removed from swears list.`)
        .setColor(0x95fd91);
      await message.channel.send(embed).catch(error => {});
    }
    else if(args[0].toLowerCase() == 'view' || args[0].toLowerCase() == 'list'){
      if(swearsList.length <= 0){
        embed.setDescription(`${cross} Empty badwords list.`)
          .setColor(0xff4747);
        await message.reactions.removeAll();
        react(message, '❌');
      }
      else{
        embed.setDescription(`Swears list-\n\`${swearsList}\``);
      }
      await message.channel.send(embed).then((msg) => setTimeout(function(){msg.delete().catch(error => {});}, 10000)).catch(error => {});
    }
    else if(args[0].toLowerCase() == 'clear'){
      if(swearsList.length <= 0){
        embed.setDescription(`${cross} Swears list already empty.`)
          .setColor(0xff4747);
        await message.reactions.removeAll();
        react(message, '❌');
      }
      else{
        await database.set("swearsList", null);
        embed.setDescription(`${tick} Swears list cleared.`)
          .setColor(0x95fd91);
      }
      await message.channel.send(embed).catch(error => {});
    }
  }
}