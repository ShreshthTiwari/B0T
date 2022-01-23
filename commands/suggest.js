module.exports = {
  name: "suggest",
  description: "suggest something",

  async run (Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, e, cmd){
    const tick = await client.emojis.cache.get(e.tick);
    const cross = await client.emojis.cache.get(e.cross);
    if(!cmd){
      cmd = "suggest";
    }
    let embed = new Discord.MessageEmbed()
      .setColor(0x2f3136);
    let n = await database.get(`suggestion_number`);
    if(!n){
      n=0;
      await database.set(`suggestion_number`, n);
    }
    let upID = await database.get('upEmojiID');
    let up = client.emojis.cache.get(upID);
    if(!up){
      up = client.emojis.cache.get(e.up);
    }
    let updownID = await database.get('updownEmojiID');
    let updown = client.emojis.cache.get(updownID);
    if(!updown){
     updown = client.emojis.cache.get(e.updown); 
    }
    let downID = await database.get('downEmojiID');
    let down = client.emojis.cache.get(downID);
    if(!down){
      down = client.emojis.cache.get(e.down);
    }
    if(!(up || updown || down)){
      embed.setDescription(`${cross} Invalid suggestion emojis.`)
        .setColor(0xff4747);
      await message.channel.send(embed).catch(error => {});
      await message.reactions.removeAll();
      react(message, '❌');
      return;
    }
    let suggestionChannelID = await database.get("suggestionChannelID");
    if(!suggestionChannelID){
      await message.channel.send(`${cross} Invalid suggestions channel.`).catch(error => {});
      await message.reactions.removeAll();
      react(message, '❌');
      return;
    }
    const suggestionChannel = message.guild.channels.cache.get(suggestionChannelID);
    if(!suggestionChannel){
      await message.channel.send(`${cross} Invalid suggestions channel.`).catch(error => {});
      await message.reactions.removeAll();
      react(message, '❌');
      return;    
    }
    let suggestionEmbed = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setAuthor(`${message.author.username}`, message.guild.iconURL())
      .setThumbnail(message.author.displayAvatarURL())
      .setFooter(message.guild.name);
    if(message.guild){
      if(!args[0]){
        embed.setDescription(`${cross} Suggest something.`)
          .setColor(0xff4747);
        await message.channel.send(embed).catch(error => {});
        await message.reactions.removeAll();
        react(message, '❌');
        return;  
      }
      let suggestion = messageEmojiFinder(client, message, args.slice(0));
      n = n+1;
      suggestionEmbed.addField(`Suggestion [${n}]`, `${suggestion}`);
      let s, sid;
      s = await suggestionChannel.send(suggestionEmbed).catch(error => {});
      sid = s.id;
      await s.react(up).then(
        s.react(updown),
        s.react(down)
      );
      await database.set(`suggestion_number`, n);
      await database.set(`suggestion${n}_ID`, sid);
      await database.set(`suggestion${n}_content`, suggestion);
      await database.set(`suggestion${n}_isEdited`, "false");
      embed.setDescription(`${tick} Suggestion posted in ${suggestionChannel}.`)
        .setColor(0x95fd91);
      await message.channel.send(embed).catch(error => {});
    }
  }
}