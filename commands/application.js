const fs = require("fs");

module.exports = {
  name : 'application',
  description : 'to accept/reject an application',

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
    if((!args[0]) || args[0].toLowerCase() == "help"){
      embed.setDescription(`**Application Command Help**-
      > ${arrow} ${prefix}application reject \`<user>\` \`<reason>\`.
      > ${arrow} ${prefix}application accept \`<user>\` \`<message>\`.
      > ${arrow} ${prefix}application ignore \`<user>\` \`<reason>\`.
      > ${arrow} ${prefix}application blacklist.
      > ${arrow} ${prefix}application blacklist add \`<userID>\`.
      > ${arrow} ${prefix}application blacklist remove \`<userID>\`.`)
        .setColor(0x2f3136);
      await message.channel.send(embed).catch(error => {});
    }else{
      if(args[0].toLowerCase() == "reject" || args[0].toLowerCase() == "accept" || args[0].toLowerCase() == "ignore"){
        if(!args[1]){
          embed.setDescription(`${cross} Please provide a user.`)
            .setColor(0xff4747);
          await message.channel.send(embed).catch(error => {});
          await message.reactions.removeAll();
          react(message, '❌');
          return;
        }
        let applicant = personFinder(message, args[1], "user");
        if(!applicant){
          embed.setDescription(`${cross} Wrong user.`)
            .setColor(0xff4747);
          await message.channel.send(embed).catch(error => {});
          await message.reactions.removeAll();
          react(message, '❌');
          return;  
        }
        let reason = args.slice(2).join(" ");
        if(!reason){
          reason = "Not Provided."
        }
        let checkFile;
        try{
          checkFile = fs.statSync(`./applications/${message.guild.id}/${applicant.id}.txt`);
        }catch{
          //nothing
        }
        if(checkFile){
          fs.unlink(`./applications/${message.guild.id}/${applicant.id}.txt`, (err) => {
            if (err) throw err;
          });
          if(args[0].toLowerCase() == "reject"){
            embed.setDescription(`${cross} Application rejected.\nReason- \`${reason}\``)
              .setAuthor(message.guild.name, message.guild.iconURL())
              .setColor(0xff4747);
            await applicant.send(embed).catch(error => {});
            embed.setDescription(`${tick} Application by ${applicant.tag}[${applicant.id}] rejected.\nReason-${reason}`)
              .setColor(0x95fd91);
            await message.channel.send(embed).catch(error => {}); 
          }
          else if(args[0].toLowerCase() == "accept"){
            embed.setDescription(`${tick} Application accepted.🥳\nMessage from staff- \`${reason}\``)
              .setAuthor(message.guild.name, message.guild.iconURL())
              .setColor(0x95fd91)
            await applicant.send(embed).catch(error => {});
            embed.setDescription(`${tick} Application by ${applicant.tag}[${applicant.id}] accepted.`)
              .setColor(0x95fd91);
            await message.channel.send(embed).catch(error => {});
          }
          else if(args[0].toLowerCase() == "ignore"){
            embed.setDescription(`${tick} Application by ${applicant.tag}[${applicant.id}] ignored.\nReason-${reason}`)
              .setColor(0x95fd91);
            await message.channel.send(embed).catch(error => {});
          }
        }
        else{
          embed.setDescription(`${cross} No new application by that user.`)
            .setColor(0xff4747);
          await message.channel.send(embed).catch(error => {});
        }
      }
      else if(args[0].toLowerCase() == "blacklist"){
        let blackList = await database.get("applicationBlackList");
        let blackListIDs;
        if(!blackList){
          blackList = " ";
          await database.set("applicationBlackList", blackList);
        }
        blackListIDs = blackList.split(" ");
        if(!args[1]){
          blackList = blackListIDs.join("\n");
          embed.setDescription(`Blacklisted IDs- ${blackList}`)
            .setColor("RANDOM");
          await message.channel.send(embed).catch(error => {});
        }
        else{
          if(args[1].toLowerCase() == "remove"){
            for(let i=0; i<=blackListIDs.length-1; i++){
              if(args[2] == blackListIDs[i]){
                if(blackListIDs.length > 1){
                  for(let j=i; j<=blackListIDs.length-2; j++){
                    blackListIDs[j] = blackListIDs[j+1];
                  }
                }
                let t = blackListIDs.pop();
                blackList = blackListIDs.join(" ");
                await database.set("applicationBlackList", blackList);
                embed.setDescription(`${tick} Removed ${args[2]} from application blacklist.`)
                  .setColor(0x95fd91);
                await message.channel.send(embed).catch(error => {});
                return;
              }
            }
            embed.setDescription(`${cross} (${args[2]}) is not blacklisted.`)
              .setColor(0xff4747);
            await message.channel.send(embed).catch(error => {});
          }
          else if(args[1].toLowerCase() == "add"){
            for(let i=0; i<=blackListIDs.length-1; i++){
              if(args[2] == blackListIDs[i]){
                embed.setDescription(`${cross} (${args[2]}) already blacklisted.`)
                  .setColor(0xff4747);
                await message.channel.send(embed).catch(error => {});
                await message.reactions.removeAll();
                react(message, '❌');
                return;
              }
            }
            blackListIDs[blackListIDs.length] = args[2];
            blackList = blackListIDs.join(" ");
            await database.set("applicationBlackList", blackList);
            embed.setDescription(`${tick} (${args[2]}) added to application blacklist.`)
              .setColor(0x95fd91);
            await message.channel.send(embed).catch(error => {});
          }
          else{
            await message.reactions.removeAll();
            react(message, '❌');
            return;
          }
        }
      }
      else{
        await message.reactions.removeAll();
        react(message, '❌');
        return;
      }
    }
  }
}