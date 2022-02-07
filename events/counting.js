module.exports = async(Discord, client, message, args, database, prefix, emojiIDs) =>{
  const tick = await client.emojis.cache.get(emojiIDs.tick);
  const cross = await client.emojis.cache.get(emojiIDs.cross);
  if(message.guild){
    const countingChannelID = await database.get("countingChannelID");
    if(!countingChannelID){
      return;
    }
    const countingChannel = message.guild.channels.cache.get(countingChannelID);
    if(!countingChannel){
      return;
    }
    if(message.author.bot){
	  if((message.channel.id == countingChannel.id) && isNaN(message.content)){
	    await message.delete().catch(error => {});
	  }
	  return;
	}
    if(message.member.hasPermission("ADMINISTRATOR")){
      let embed = new Discord.MessageEmbed()
        .setAuthor(message.guild.name, message.guild.iconURL())
        .setColor(0x95fd91);
      if(args[0] == `${prefix}setCount`){
        if((!args[1]) || (isNaN(args[1]))){
          embed.setDescription(`${cross} Provide a count number.`)
            .setColor(0xff4747);
          await message.author.send(embed).catch(error => {});
        }
        else{  
          let n = args[1] *1;
          await database.set("num", n);
          await database.set("lastSender", null);
          embed.setDescription(`${tick} Count set to \`${args[1]}\`.`);
          await message.author.send(embed).catch(error => {});
        }
      }
      if(args[0] == `${prefix}resetCount`){
        await database.set("num", 0);
        await database.set("lastSender", null);
        embed.setDescription(`${cross} Count resetted to \`0\`.`);
        await message.author.send(embed).catch(error => {});
      }
    }
    if(message.channel.id != countingChannelID){
      return;
    }
    let checknum = await database.get("num");
    if(!checknum){
      checknum = 0;
      await database.set("num", 0);
    }
    let lastSender = await database.get("lastSender");
    if((message.author.id === lastSender) || (args[1]) || (args[0] != checknum+1)){
      message.delete().catch(error => {});
      return;   
    }
    await database.set("lastSender", message.author.id);
    checknum++;
    await database.set("num", checknum);
    
    let ws, w;
    ws = await message.channel.fetchWebhooks();
    w = ws.first();
    if(!w){
      await message.channel.createWebhook(message.author.username, {
        avatar: message.author.displayAvatarURL({dynamic: true}),
      });
    }
    try {
      const webhooks = await message.channel.fetchWebhooks();
      const webhook = webhooks.first();
      await webhook.send(args[0], {
        username: message.author.username,
        avatarURL: message.author.displayAvatarURL(),
      });
    }catch (error) {
      console.log(`Webhook creation error in Guild- ${message.guild}, ${message.guild.id} Channel- ${message.channel.id}`);
    }
    let coins = await database.get(`${message.author.id} coins`) * 1;
    if((checknum % 2 != 0) && (checknum % 3 != 0) && (checknum % 5 != 0) && (checknum % 2 != 0)){
      coins += 20;
      await database.set(`${message.author.id} coins`, coins);
    }
    await message.delete().catch(error => {});
  }
}