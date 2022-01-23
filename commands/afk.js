module.exports = {
  name : 'afk',
  description : 'to set afk status',
  
  async run(Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, e){
    const tick = await client.emojis.cache.get(e.tick);
    const cross = await client.emojis.cache.get(e.cross);
    let embed = new Discord.MessageEmbed()
      .setColor(0x2f3136);
    let afkStatus = await database.get(`${message.author.id} afkStatus`);
    let lastDisplayName = await database.get(`${message.author.id} lastDisplayName`);
    if(!afkStatus){
      afkStatus = "false";
      await database.set(`${message.author.id} afkStatus`, "false");
    }
    if(afkStatus == "true"){
      await database.set(`${message.author.id} afkStatus`, "false");
      await message.member.setNickname(lastDisplayName).catch(error => {});
      embed.setDescription(`${tick} AFK cleared.`)
        .setColor("GREEN");
      await message.channel.send(embed).catch(error =>{});
    }
    else{
      let date = new Date();
      date = Math.abs(date);
      let msg = "AFK";
      if(args[0]){
        msg = messageEmojiFinder(client, message, args); 
        if(msg.length > 500){
          msg.length=500;
          msg = msg + "...";
        }
      }
      await database.set(`${message.author.id} afkStatus`, "true");
      await database.set(`${message.author.id} afkMessage`, msg);
      await database.set(`${message.author.id} lastDisplayName`, message.member.displayName);
      await database.set(`${message.author.id} afkSetTime`, date);
      await message.member.setNickname(`[AFK] ${message.member.displayName}`).catch(error => {});
      embed.setDescription(`${tick} AFK set- ${msg}`)
        .setColor("GREEN");
      await message.channel.send(embed).catch(error =>{});
    }      
  }
}