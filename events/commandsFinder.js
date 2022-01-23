const e = require("../emojiIDs.json");

module.exports = async(Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, verificationChannelID, react, e) => {
  const tick = await client.emojis.cache.get(e.tick);
  const cross = await client.emojis.cache.get(e.cross);
  let embed = new Discord.MessageEmbed()
  .setColor(0xff4747);
  let command = args.shift().toLowerCase();
  const botCommandsChannelID = await database.get('botCommandsChannelID');
  const memeChannelID = await database.get('memeChannelID');
  const ticketChannelID = await database.get('ticketChannelID');
  const staffRoleID = await database.get('staffRoleID');
  
  if(message.author.bot){
    return;
  }
  if(!message.member.hasPermission("ADMINISTRATOR")){
    if(!botCommandsChannelID){
      embed.setDescription(`${cross} Bot commands channel not set.`);
      await message.reply(embed).then((msg) => setTimeout(function(){msg.delete().catch(error => {});}, 15000)).catch(error => {});
      await message.delete().catch(error => {});
      return;
    }else{
      let botCommandsChannel = client.channels.cache.get(botCommandsChannelID);
      if(!botCommandsChannel){
        embed.setDescription(`${cross} Bot commands channel not set.`);
        await message.reply(embed).then((msg) => setTimeout(function(){msg.delete().catch(error => {});}, 15000)).catch(error => {});
        await message.delete().catch(error => {});
        return;
      }
    }
    if(message.channel.id != ticketChannelID && message.channel.id != memeChannelID && message.channel.id != botCommandsChannelID && message.channel.id != verificationChannelID && !(message.channel.name.startsWith("ticket-") || message.channel.name.startsWith("bug-") || message.channel.name.startsWith("report-"))){
      embed.setDescription(`${cross} Please use <#${botCommandsChannelID}>.`);
      await message.reply(embed).then((msg) => setTimeout(function(){msg.delete().catch(error => {});}, 15000)).catch(error => {});
      await message.delete().catch(error => {});
      return;
    }
    if(message.channel.id == ticketChannelID){
      if(command != "t" && command != "ticket" && command != "new" && command != "create"){
        embed.setDescription(`${cross} Please use <#${botCommandsChannelID}>.`);
        await message.reply(embed).then((msg) => setTimeout(function(){msg.delete().catch(error => {});}, 15000)).catch(error => {});
        await message.delete().catch(error => {});
        return;        
      }
    }
    if(message.channel.id == memeChannelID){
      if(command != "meme"){
        embed.setDescription(`${cross} Please use <#${botCommandsChannelID}>.`);
        await message.reply(embed).then((msg) => setTimeout(function(){msg.delete().catch(error => {});}, 15000)).catch(error => {});
        await message.delete().catch(error => {});
        return;
      }
    }
    if(message.channel.name.startsWith("ticket-") || message.channel.name.startsWith("bug-") || message.channel.name.startsWith("report-")){
      if((!message.member.roles.cache.has(staffRoleID)) && command != "claim" && command != "close"){
        embed.setDescription(`${cross} Please use <#${botCommandsChannelID}>.`);
        await message.reply(embed).then((msg) => setTimeout(function(){msg.delete().catch(error => {});}, 15000)).catch(error => {});
        await message.delete().catch(error => {});
        return;
      }
    }
    if(message.channel.id == verificationChannelID){
      if(command != "verify"){
        await message.delete().catch(error => {});
        return;
      }
    }
  }
  const customCommand = await database.get(`customCommand_${command}`);
  if((!client.commands.has(command)) && command.toLowerCase() != "apply" && (!customCommand) && command.toLowerCase() != "play" && command.toLowerCase() != "skip" && command.toLowerCase() != "stop"){
    if(message){
      react(message, '❌');
    }
    return;
  }else{
    react(message, '✅').catch(err => {
      //mf blocked the bot.
    });
  }
  if(client.commands.has(command)){
    let returnValue;
    do{
      returnValue = await client.commands.get(command).run(Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, e);
    } while(returnValue == "return");
  }
}