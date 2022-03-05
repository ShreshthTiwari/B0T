module.exports = {
  name: "badword",
  description: "to add or remove badwords",

  async run (Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, emojiIDs, helpText){
    if(!helpText){
      helpText = "badword";
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
    let badwords = await database.get("badwordsList");
    let badwordsList = [];
    if(badwords)
      badwordsList = await badwords.split(" ");
    if(!args[0] || args[0].toLowerCase() == "help"){
      embed.setDescription(`**Badword Command Help**
      > ${arrow} ${prefix}${helpText} add \`<word>\`.
      > ${arrow} ${prefix}${helpText} remove \`<word>\`.
      > ${arrow} ${prefix}${helpText} list.
      > ${arrow} ${prefix}${helpText} clear.`)
      .setColor(0x2f3136);
      await message.channel.send(embed).catch(error => {}); 
    }else{
      if(!args[1]){
        if(args[0].toLowerCase() == 'view' || args[0].toLowerCase() == 'list'){
          if(badwordsList.length <= 0){
            embed.setDescription(`${cross} Empty badwords list.`)
            .setColor(0xff4747);
          }
          else{
            if(badwordsList.length > 900){
              badwordsList.length = 900;
              badwordsList = badwordsList + "...";
            }
            embed.setDescription(`${tick} Badwords list-\n||\`${badwordsList}\`||`);
          }
          await message.channel.send(embed).catch(error => {});
        }
        else if(args[0].toLowerCase() == 'clear'){
          if(badwordsList.length <= 0){
            embed.setDescription(`${cross} Badwords list already empty.`)
            .setColor(0xff4747);
          }
          else{
            await database.set("badwordsList", null);
            embed.setDescription(`${tick} Badwords list cleared.`)
            .setColor(0x95fd91);
          }
          await message.channel.send(embed).catch(error => {});
        }
        else{
          embed.setDescription(`${cross} Please provide a word.`)
          .setColor(0xff4747);
          await message.channel.send(embed).catch(error => {});
          await message.reactions.removeAll();
          react(message, '❌');
          return;
        }
      }
      else{
        args[1] = args[1].toLowerCase();
        if(args[0].toLowerCase() == 'add'){
          for(let i=0; i<=badwordsList.length-1; i++){
            if(args[1] == badwordsList[i]){
              embed.setDescription(`${cross} ${args[i]} already in badwords list.`)
              .setColor(0xff4747);
              await message.channel.send(embed).catch(error => {});
              await message.reactions.removeAll();
              react(message, '❌');
              return;
            }
          }
          badwordsList[badwordsList.length] = args[1];
          await database.set("badwordsList", badwordsList.join(" "));
          embed.setDescription(`${tick} ||${badwordsList[badwordsList.length-1]}|| added to badwords list.`)
          .setColor(0x95fd91);
          await message.channel.send(embed).catch(error => {});
        }
        else if(args[0].toLowerCase() == 'remove'){
          let pos = -1, word;
          for(let i=0; i<=badwordsList.length-1; i++){
            if(args[1] == badwordsList[i]){
              word = badwordsList[i];
              pos = i;
              break;
            }
          }
          if(pos == -1){
            embed.setDescription(`${cross} ${args[1]} not in badwords list.`)
            .setColor(0xff4747);
            await message.channel.send(embed).catch(error => {});
            await message.reactions.removeAll();
            react(message, '❌');
            return;
          }
          for(let i = pos; i <= badwordsList.length-1; i++){
            badwordsList[i] = badwordsList[i+1];
          }
          badwordsList.pop();
          await database.set("badwordsList", badwordsList.join(" "));
          embed.setDescription(`${tick} ||${word}|| removed from badwords list.`)
          .setColor(0x95fd91);
          await message.channel.send(embed).catch(error => {});
        }
      }
    }
  }
}