const fs = require('fs');
const path = require('path');
const dateBuilder = require('../builders/dateBuilder.js');

module.exports = {
  name: "close",
  description: "To close a ticket",

  async run (Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, emojiIDs) {
    const tick = await client.emojis.cache.get(emojiIDs.tick);
    const cross = await client.emojis.cache.get(emojiIDs.cross);
    let embed = new Discord.MessageEmbed()
    .setColor(0x98dbfa);
    if(!message.member.hasPermission("ADMINISTRATOR")){
      await message.reactions.removeAll();
      react(message, '❌');
      return;
    }
    if (message.channel.name.startsWith("ticket") || message.channel.name.startsWith("bug") || message.channel.name.startsWith("report")){
      let transcriptsChannelID = await database.get('transcriptsChannelID');
      let transcriptsChannel;
      let ticketOwnerID, ticketOwner;
      if(transcriptsChannelID)
        transcriptsChannel = message.guild.channels.cache.get(transcriptsChannelID);
      let logFileLocation;
      if(message.channel.name.startsWith("ticket")){
        ticketOwnerID = message.channel.name.replace("ticket-","");
        ticketOwner = message.guild.members.cache.get(ticketOwnerID);
        logFileLocation = path.join(__dirname, "..", "transcripts", `${message.guild.id}`, `ticket-${ticketOwnerID}.txt`);
      }  
      else if(message.channel.name.startsWith("bug")){
        ticketOwnerID = message.channel.name.replace("bug-","");
        ticketOwner = message.guild.members.cache.get(ticketOwnerID);
        logFileLocation = path.join(__dirname, "..", "transcripts", `${message.guild.id}`, `bug-${ticketOwnerID}.txt`);
      }  
      else if(message.channel.name.startsWith("report")){
        ticketOwnerID = message.channel.name.replace("report-","");
        ticketOwner = message.guild.members.cache.get(ticketOwnerID);
        logFileLocation = path.join(__dirname, "..", "transcripts", `${message.guild.id}`, `report-${ticketOwnerID}.txt`);
      }    
      let isFile = false;
      try{
        let stats = fs.statSync(logFileLocation);
        isFile = true; 
      }catch{
        isFile = false;
      }
      if(!transcriptsChannel){
        embed.setDescription(`${cross} Transcript channel not found.`)
          .setColor(0xff4747);
        await message.channel.send(embed).catch(error => {});
      }else{
        if(isFile){
          let date = dateBuilder();
          fs.appendFileSync(logFileLocation, `-------------------------------------------\nDate Closed -> ${date}\n-------------------------------------------\n`); 
          await transcriptsChannel.send({
            files: [{
              attachment: logFileLocation,
              name: "transcript.txt"
            }]
          }).catch(error => {});
          if(ticketOwner){
            embed.setAuthor(message.guild.name, message.guild.iconURL())
              .setDescription(`Your ticket \`${message.channel.name}\` was closed.\nHere's the transcript of the ticket-`);
            await ticketOwner.send(embed).catch(error => {});
            await ticketOwner.send({
              files: [{
                attachment: logFileLocation,
                name: "transcript.txt"
              }]
            }).catch(error => {});
            setTimeout(function(){
              fs.unlinkSync(logFileLocation);
            }, 5000);
          }
        }else{
          embed.setAuthor(message.guild.name, message.guild.iconURL())
          .setDescription(`Your ticket \`${message.channel.name}\` was closed.`);
          await message.author.send(embed).catch(error => {/*DM OFF or blocked*/});
        }
      }
      embed = new Discord.MessageEmbed()
      .setDescription(`${tick} Ticket closing...`)
      .setColor(0x95fd91);
      await message.channel.send(embed).then((msg) => setTimeout(function(){msg.channel.delete().catch(error => {});}, 5000)).catch(error => {});
    }
    else{
      embed.setDescription(`${cross} Not a ticket channel.`)
      .setColor(0xff4747);
      await message.channel.send(embed).catch(eror => {});
      await message.reactions.removeAll();
      react(message, '❌');
      return;
    }
  }
}