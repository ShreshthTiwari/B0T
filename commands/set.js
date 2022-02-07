const defaultAppQuestions = require("../defaultAppQuestions.json");

module.exports = {
  name: "set",
  description: "set values to variables",

async run (Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, emojiIDs) {
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
  if((!args[0]) || args[0].toLowerCase() =='help'){
    if(!args[1]){
      embed.setDescription(`**Set Help**
      ${arrow} ${prefix}set help appQuestions
      ${arrow} ${prefix}set help channels
      ${arrow} ${prefix}set help categories
      ${arrow} ${prefix}set help emojis
      ${arrow} ${prefix}set help misc
      ${arrow} ${prefix}set help roles
      ${arrow} ${prefix}set help stats`);
    }
    else if(args[1].toLowerCase() == "channels"){
      embed.setDescription(`**Set Help Channels**
      > ${arrow} ${prefix}set applicationLogsChannel \`<channel>\`
      > ${arrow} ${prefix}set botCommandsChannel \`<channel>\`
      > ${arrow} ${prefix}set botUpdatesChannel \`<channel>\`
      > ${arrow} ${prefix}set chatBotChannel \`<channel>\`
      > ${arrow} ${prefix}set chatFilterLogsChannel \`<channel>\`
      > ${arrow} ${prefix}set chatLogsChannel \`<channel>\`
      > ${arrow} ${prefix}set countingChannel \`<channel>\`
      > ${arrow} ${prefix}set discordAnnouncementChannel \`<channel>\`
      > ${arrow} ${prefix}set levelUpChannel \`<channel>\`
      > ${arrow} ${prefix}set memeChannel \`<channel>\`
      > ${arrow} ${prefix}set minecraftAnnouncementChannel \`<channel>\`
      > ${arrow} ${prefix}set minecraftServerStatusChannel \`<channel>\`
      > ${arrow} ${prefix}set moderationLogsChannel \`<channel>\`
      > ${arrow} ${prefix}set modMailsChannel \`<channel>\`
      > ${arrow} ${prefix}set playerJoinLogsChannel \`<channel>\`
      > ${arrow} ${prefix}set playerLeaveLogsChannel \`<channel>\`
      > ${arrow} ${prefix}set suggestionChannel \`<channel>\`
      > ${arrow} ${prefix}set ticketChannel \`<channel>\`
      > ${arrow} ${prefix}set transcriptsChannel \`<channel>\`
      > ${arrow} ${prefix}set verificationChannel \`<channel>\`
      > ${arrow} ${prefix}set verificationLogsChannel \`<channel>\``);
    }
    else if(args[1].toLowerCase() == "stats"){
      embed.setDescription(`**Set Help Stats**
      > ${arrow} ${prefix}set botsCountChannel \`<channel>\`
      > ${arrow} ${prefix}set bugTicketsCountChannel \`<channel>\`
      > ${arrow} ${prefix}set memberCountChannel \`<channel>\`
      > ${arrow} ${prefix}set normalTicketsCountChannel \`<channel>\`
      > ${arrow} ${prefix}set playingStatusChannel \`<channel>\`
      > ${arrow} ${prefix}set reportTicketsCountChannel \`<channel>\`
      > ${arrow} ${prefix}set totalMemberCountChannel \`<channel>\`
      > ${arrow} ${prefix}set totalTicketsCountChannel \`<channel>\``);
    }
    else if(args[1].toLowerCase() == "categories"){
      embed.setDescription(`**Set Help Categories**
      > ${arrow} ${prefix}set normalTicketCategoryID \`<categoryID>\`
      > ${arrow} ${prefix}set bugTicketCategoryID \`<categoryID>\`
      > ${arrow} ${prefix}set reportTicketCategoryID \`<categoryID>\`
      > ${arrow} ${prefix}set priorityTicketCategoryID \`<categoryID>\``);
    }
    else if(args[1].toLowerCase() == "roles"){
      embed.setDescription(`**Set Help Roles**
      > ${arrow} ${prefix}set discordAnnouncementPingRole \`<role>\`
      > ${arrow} ${prefix}set extraVerifiedRole \`<role>\`
      > ${arrow} ${prefix}set minecraftAnnouncementPingRole \`<role>\`
      > ${arrow} ${prefix}set mutedRole \`<role>\`
      > ${arrow} ${prefix}set staffRole \`<role>\`
      > ${arrow} ${prefix}set verifiedRole \`<role>\`
      > ${arrow} ${prefix}set priorityTicketRole \`<role>\``);  
    }
    else if(args[1].toLowerCase() == "emojis"){
      embed.setDescription(`**Set Help Emojis**
      > ${arrow} ${prefix}set botCoinEmojiID \`<ID>\`
      > ${arrow} ${prefix}set downEmojiID \`<ID>\`
      > ${arrow} ${prefix}set fEmojiID \`<ID>\`
      > ${arrow} ${prefix}set updownEmojiID \`<ID>\`
      > ${arrow} ${prefix}set upEmojiID \`<ID>\``);
    }
    else if(args[1].toLowerCase() == "misc"){
      embed.setDescription(`**Set Help Misc**
      > ${arrow} ${prefix}set botCoinName \`<name>\`
      > ${arrow} ${prefix}set botPrefix \`<prefix>\`
      > ${arrow} ${prefix}set canApply \`<true/false>\`
      > ${arrow} ${prefix}set defaultAppQuestions
      > ${arrow} ${prefix}set emptyAppQuestions
      > ${arrow} ${prefix}set IP \`<IP>\`
      > ${arrow} ${prefix}set leaveImage \`<url>\`
      > ${arrow} ${prefix}set memesTopic <name>
      > ${arrow} ${prefix}set moderateNewUserNames <true/false>
      > ${arrow} ${prefix}set numericIP \`<numericIP>\`
      > ${arrow} ${prefix}set port \`<port>\`
      > ${arrow} ${prefix}set playerJoinMessage \`<msg>\`
      > ${arrow} ${prefix}set playerJoinMessageColor \`<color>\`
      > ${arrow} ${prefix}set playerLeaveMessage \`<msg>\`
      > ${arrow} ${prefix}set playerLeaveMessageColor \`<color>\`
      [For player join/leave messages, you can use the placeholders- \`{user}\` \`{username}\` \`{userid}\` \`{usertag}\` \`{guild}\` \`{guildid}\`]
      > ${arrow} ${prefix}set welcomeImage \`<url>\``);
    }
    else if(args[1].toLowerCase() == "appquestions"){
      embed.setDescription(`**Set Help appQuestions**
      > ${arrow} ${prefix}set appQuestion\`<number>\` \`<question>\`
      \`Note- "<number>" should be between 1 to 16.\`
      **Eg**- \`\`\`${prefix}set appQuestion1 What is your name?\n.\n.\n.\n${prefix}set appQuestion7 Tell us about yourself.\n.\n.\n.\n${prefix}set appQuestion16 Anything else we need to know?\`\`\``);
    }
    else{
      embed.setDescription(`${cross} Invalid sub-command.`)
      .setColor(0xff4747);
      await message.channel.send(embed).catch(error => {});
      await message.reactions.removeAll();
      react(message, '❌');
      return;
    }
    embed.setColor(0x2f3136);
    await message.channel.send(embed).catch(error => {});      
  }
  else{
    let text;
    if(args[0].includes('Channel')){
      let channelID, channel;
      if(!args[1]){
        channelID = message.channel.id;
        channel = message.channel;
      }
      else{
        channelID = args[1];
        channel = message.guild.channels.cache.get(channelID);
        if(!channel){
          channel = message.mentions.channels.first();
          channelID = channel.id;
        }
        if(!channel){
          embed.setDescription(`${cross} Invalid channel.`)
            .setColor(0xff4747);
          await message.channel.send(embed).catch(error => {});
          await message.reactions.removeAll();
          react(message, '❌');
          return;
        }
      }
      if(args[0] == "totalMemberCountChannel" || args[0] == "memberCountChannel" || args[0] == "botsCountChannel" || args[0] == "playingStatusChannel" || args[0] == "normalTicketsCountChannel" || args[0] == "bugTicketsCountChannel" || args[0] == "reportTicketsCountChannel" || args[0] == "totalTicketsCountChannel"){
        if(channel.type != "voice"){
          embed.setDescription(`${cross} ${channel} is not a voice channel.`)
            .setColor(0xff4747);
          await message.channel.send(embed).catch(error => {});
          await message.reactions.removeAll();
          react(message, '❌');
          return;
        }
      }
      else{
        if(channel.type != "text" && channel.type != "news"){
          embed.setDescription(`${cross} ${channel} is not a text channel.`)
            .setColor(0xff4747);
          await message.channel.send(embed).catch(error => {});
          await message.reactions.removeAll();
          react(message, '❌');
          return;
        }
      }
      if(args[0] == "chatLogsChannel"){
        await database.set(`${args[0]}ID`, channelID);
        text = "chat logs";
      }
      else if(args[0] == "verificationChannel"){
        await database.set(`${args[0]}ID`, channelID);
        text = "verification"
      }
      else if(args[0] == "verificationLogsChannel"){
        await database.set(`${args[0]}ID`, channelID);
        text = "verification"
      }
      else if(args[0] == "memeChannel"){
        await database.set(`${args[0]}ID`, channelID);
        text = "memes";
      }
      else if(args[0] == "botCommandsChannel"){
        await database.set(`${args[0]}ID`, channelID);
        text = "bot commands"
      }
      else if(args[0] == "applicationLogsChannel"){
        await database.set(`${args[0]}ID`, channelID);
        text = "applications logs"
      }
      else if(args[0] == "countingChannel"){
        await database.set(`${args[0]}ID`, channelID);
        text = "counting";
      }
      else if(args[0] == "totalMemberCountChannel"){
        await database.set(`${args[0]}ID`, channelID);
        text = "total member count";
      }
      else if(args[0] == "memberCountChannel"){
        await database.set(`${args[0]}ID`, channelID);
        text = "member count";
      }
      else if(args[0] == "botsCountChannel"){
        await database.set(`${args[0]}ID`, channelID);
        text = "bots count";
      }
      else if(args[0] == "playerJoinLogsChannel"){
        await database.set(`${args[0]}ID`, channelID);
        text = "player join logs";
      }
      else if(args[0] == "playerLeaveLogsChannel"){
        await database.set(`${args[0]}ID`, channelID);
        text = "player leave logs";
      }
      else if(args[0] == "discordAnnouncementChannel"){
        await database.set(`${args[0]}ID`, channelID);
        text = "discord announcement";
      }
      else if(args[0] == "minecraftAnnouncementChannel"){
        await database.set(`${args[0]}ID`, channelID);
        text = "minecraft announcement";
      }
      else if(args[0] == "suggestionChannel"){
        await database.set(`${args[0]}ID`, channelID);
        text = "suggestion";
      }
      else if(args[0] == "chatFilterLogsChannel"){
        await database.set(`${args[0]}ID`, channelID);
        text = "chat filter logs";
      }
      else if(args[0] == "ticketChannel"){
        await database.set(`${args[0]}ID`, channelID);
        text = "ticket";
      }
      else if(args[0] == "transcriptsChannel"){
        await database.set(`${args[0]}ID`, channelID);
        text = "transcripts";
      }
      else if(args[0] == "playingStatusChannel"){
        await database.set(`${args[0]}ID`, channelID);
        text = "minecraft server playing status";
      }
      else if(args[0] == "chatBotChannel"){
        await database.set(`${args[0]}ID`, channelID);
        text = "chat bot";
      }
      else if(args[0] == "levelUpChannel"){
        await database.set(`${args[0]}ID`, channelID);
        text = "level up";
      }
      else if(args[0] == "modMailsChannel"){
        await database.set(`${args[0]}ID`, channelID);
        text = "mod mails";
      }
      else if(args[0] == "normalTicketsCountChannel"){
        await database.set(`${args[0]}ID`, channelID);
        text = "normal tickets count";
      }
      else if(args[0] == "reportTicketsCountChannel"){
        await database.set(`${args[0]}ID`, channelID);
        text = "report tickets count";
      }
      else if(args[0] == "bugTicketsCountChannel"){
        await database.set(`${args[0]}ID`, channelID);
        text = "bug tickets count";
      }
      else if(args[0] == "totalTicketsCountChannel"){
        await database.set(`${args[0]}ID`, channelID);
        text = "total tickets count";
      }
      else if(args[0] == "botUpdatesChannel"){
        await database.set(`${args[0]}ID`, channelID);
        text = "bot updates";
      }
      else if(args[0] == "moderationLogsChannel"){
        await database.set(`${args[0]}ID`, channelID);
        text = "moderation logs";
      }
      else if(args[0] == "minecraftServerStatusChannel"){
        await database.set(`${args[0]}ID`, channelID);
        text = "minecraft server status";
      }
      else{
        embed.setDescription(`${cross} Invalid sub-command.`)
          .setColor(0xff4747);
        await message.channel.send(embed).catch(error => {});
        await message.reactions.removeAll();
        react(message, '❌');
        return;
      }
      embed.setDescription(`${tick} Set "${channel}" as \`${text}\` channel.`)
        .setColor(0x95fd91);
      await message.channel.send(embed).catch(error => {});
    }
    else if(args[0].includes('CategoryID')){
      let categoryID, category;
      if(!args[1]){
        categoryID = message.channel.parentID;
      }
      else{
        categoryID = args[1];
        category = message.guild.channels.cache.get(categoryID);
        if((!category) || (category.type != "category")){
          embed.setDescription(`${cross} Invalid category.`)
            .setColor(0xff4747);
          await message.channel.send(embed).catch(error => {});
          await message.reactions.removeAll();
          react(message, '❌');
          return;
        }
        categoryID = category.id;
      }
      if(args[0] == "normalTicketCategoryID"){
        await database.set(`${args[0]}`, categoryID);
        text = "normal ticket";
      }
      else if(args[0] == "bugTicketCategoryID"){
        await database.set(`${args[0]}`, categoryID);
        text = "bug ticket";
      }
      else if(args[0] == "reportTicketCategoryID"){
        await database.set(`${args[0]}`, categoryID);
        text = "report ticket";
      }
      else if(args[0] == "priorityTicketCategoryID"){
        await database.set(`${args[0]}`, categoryID);
        text = "priority ticket";
      }
      else{
        embed.setDescription(`${cross} Invalid sub-command.`)
          embed.setColor(0xff4747);
        await message.channel.send(embed).catch(error => {});
        await message.reactions.removeAll();
        react(message, '❌');
        return;
      }
      embed.setDescription(`${tick} Set "${category.name}" as \`${text}\` category.`)
        .setColor(0x95fd91);
      await message.channel.send(embed).catch(error => {});
    }
    else if(args[0].includes("Role")){
      let roleID, role;
      if(!args[1]){
        embed.setDescription(`${cross} Invalid syntax.`)
          .setColor(0xff4747);
        await message.channel.send(embed).catch(error => {});
      }
      else{
        roleID = args[1];
        role = message.guild.roles.cache.get(roleID);
        if(!role){
          role = message.mentions.roles.first();
          try{
            roleID = role.id;
          }catch{
            roleID = null;
          }
        }
        if((!role) || (!roleID)){
          embed.setDescription(`${cross} invalid role.\nNote- for @everyone role, provide the server ID.`)
            .setColor(0xff4747);
          await message.channel.send(embed).catch(error => {}); 
          await message.reactions.removeAll();
          react(message, '❌');
        }
        else{
          if(args[0] == "staffRole"){
            await database.set(`${args[0]}ID`, roleID);
            text = "staff";
          }
          else if(args[0] == "discordAnnouncementPingRole"){
            await database.set(`${args[0]}ID`, roleID);
            text = "discord ping";
          }
          else if(args[0] == "minecraftAnnouncementPingRole"){
            await database.set(`${args[0]}ID`, roleID);
            text = "minecraft ping";
          }
          else if(args[0] == "verifiedRole"){
            await database.set(`${args[0]}ID`, roleID);
            text = "verified";
          }
          else if(args[0] == "mutedRole"){
            await database.set(`${args[0]}ID`, roleID);
            text = "muted";
          }
          else if(args[0] == "priorityTicketRole"){
            await database.set(`${args[0]}ID`, roleID);
            text = "priority ticket";
          }
          else if(args[0] == "extraVerifiedRole"){
            let verifiedRolesList = await database.get(`${args[0]}ID`);
            verifiedRolesList = verifiedRolesList + ` ${args[1]}`;
            await database.set(`${args[0]}ID`, verifiedRolesList);
            text = "extra verified";
          }
          else{
            embed.setDescription(`${cross} Invalid sub-command.`)
              .setColor(0xff4747);
            await message.channel.send(embed).catch(error => {});
            await message.reactions.removeAll();
            react(message, '❌');
            return;
          }
          embed.setDescription(`${tick} Set "${role}" as \`${text}\` role.`)
          .setColor(0x95fd91);
          await message.channel.send(embed).catch(error => {});
        }
      }
    }
      else if(args[0].includes("EmojiID")){
        let emojiID, emoji;
        if(!args[1]){
          embed.setDescription(`${cross} Invalid Syntax.`)
            .setColor(0xff4747);
          await message.channel.send(embed).catch(error => {});
          await message.reactions.removeAll();
          react(message, '❌');
        }
        else{
          emojiID = args[1];
          emoji = client.emojis.cache.get(emojiID);
          if(!emoji){
            embed.setDescription(`${cross} Invalid emoji.`)
              .setDescription(0xff4747);
            await message.channel.send(embed).catch(error => {});  
            await message.reactions.removeAll();
            react(message, '❌');
          }
          else{
            if(args[0] == "botCoinEmojiID"){
              await database.set(args[0], emojiID);
              text = "coin";
            }
            else if(args[0] == "upEmojiID"){
              await database.set(args[0], emojiID);
              text = "up";
            }
            else if(args[0] == "updownEmojiID"){
              await database.set(args[0], emojiID);
              text = "updown";
            }
            else if(args[0] == "downEmojiID"){
              await database.set(args[0], emojiID);
              text = "down";
            }
            else if(args[0] == "fEmojiID"){
              await database.set(args[0], emojiID);
              text = "f";
            }
            else{
              embed.setDescription(`${cross} Invalid sub-command.`)
                .setColor(0xff4747);
              await message.channel.send(embed).catch(error => {});
              await message.reactions.removeAll();
              react(message, '❌');
              return;
            }
            embed.setDescription(`${tick} Set "${emoji}" as \`${text}\` emoji.`)
            .setColor(0x95fd91);
            await message.channel.send(embed).catch(error => {});
          }
        }
      }
      else if(args[0].startsWith("appQuestion")){
        let i, question, found = false;
        if(!args[1]){
          embed.setDescription(`${cross} Invalid Syntax.`)
            .setColor(0xff4747);
          await message.channel.send(embed).catch(error => {});
          await message.reactions.removeAll();
          react(message, '❌');
        }
        else{
          if(args[1].toLowerCase() == "null"){
            await database.set(args[0], null);
          }
          question = args.slice(1).join(" ");
          for(i = 1; i<=16; i++){
            if(args[0] == `appQuestion${i}`){
              await database.set(args[0], question);
              found = true;
              break;
            }
          }
          if(!found){
            embed.setDescription(`${cross} invalid sub-command.`)
              .setColor(0xff4747);
            await message.channel.send(embed).catch(error => {});
            await message.reactions.removeAll();
            react(message, '❌');
            return;
          }
          embed.setDescription(`${tick} Set application question ${i}-\n\`\`\`${question}\`\`\``)
          .setColor(0x95fd91);
          await message.channel.send(embed).catch(error => {});
        }
      }
      else{
        if(!args[1]){
          if(args[0] == "defaultAppQuestions"){
            await database.set(`appQuestion1`, defaultAppQuestions.q1);
            await database.set(`appQuestion2`, defaultAppQuestions.q2);
            await database.set(`appQuestion3`, defaultAppQuestions.q3);
            await database.set(`appQuestion4`, defaultAppQuestions.q4);
            await database.set(`appQuestion5`, defaultAppQuestions.q5);
            await database.set(`appQuestion6`, defaultAppQuestions.q6);
            await database.set(`appQuestion7`, defaultAppQuestions.q7);
            await database.set(`appQuestion8`, defaultAppQuestions.q8);
            await database.set(`appQuestion9`, defaultAppQuestions.q9);
            await database.set(`appQuestion10`, defaultAppQuestions.q10);
            await database.set(`appQuestion11`, defaultAppQuestions.q11);
            await database.set(`appQuestion12`, defaultAppQuestions.q12);
            await database.set(`appQuestion13`, defaultAppQuestions.q13);
            await database.set(`appQuestion14`, defaultAppQuestions.q14);
            await database.set(`appQuestion15`, defaultAppQuestions.q15);
            await database.set(`appQuestion16`, defaultAppQuestions.q16);
            embed.setDescription(`${tick} Set the default application questions.`)
            .setColor(0x95fd91);
            await message.channel.send(embed).catch(error => {});
          }
          else if(args[0] == "emptyAppQuestions"){
            for(let i=1; i<=16; i++){
              await database.set(`appQuestion${i}`, null);  
            }
            embed.setDescription(`${tick} Application questions cleared.`)
            .setColor(0x95fd91);
            await message.channel.send(embed).catch(error => {});
          }
          else{
            embed.setDescription(`${cross} Invalid syntax.`)
              .setColor(0xff4747);
            await message.channel.send(embed).catch(error => {});
            await message.reactions.removeAll();
            react(message, '❌');
          }
        }
        else{
          if(args[0] == "IP" || args[0] == "numericIP" || args[0] == "port" || args[0] == "canApply" || args[0] == "welcomeImage" || args[0] == "leaveImage" || args[0] == "botPrefix" || args[0] == "botCoinName" || args[0] == "memesTopic" || args[0] == "moderateNewUserNames" || args[0] == "playerJoinMessageColor" || args[0] == "playerLeaveMessageColor"){
            if((args[0] == "canApply" || args[0] == "moderateNewUserNames") && (!(args[1].toLowerCase() === "true" || args[1].toLowerCase() === "false"))){
              embed.setDescription(`${cross} It can only be \`true\` or \`false\`.`)
                .setColor(0xff4747);
              await message.channel.send(embed).catch(error => {});
              await message.reactions.removeAll();
              react(message, '❌');
              return;
            }
            else if(args[0] == "port" && isNaN(args[1])){
              embed.setDescription(`${cross} Port can only be a number.`)
                .setColor(0xff4747);
              await message.channel.send(embed).catch(error => {});
              await message.reactions.removeAll();
              react(message, '❌');
              return;  
            }
            else if(args[0] == "botCoinName"){
              if(args[2]){
                args[1] = args.slice(1).join(" ");
              }
            }
            await database.set(args[0], args[1]);
            embed.setDescription(`${tick} Set \`${args[0]}\` as \`${args[1]}\`.`)
            .setColor(0x95fd91);
            await message.channel.send(embed).catch(error => {});
          }
          else if(args[0] == "playerJoinMessage" || args[0] == "playerLeaveMessage"){
            let msg = messageEmojiFinder(client, message, args.slice(1));
            await database.set(args[0], msg);
            embed.setDescription(`${tick} Set \`${args[0]}\` as\n ${msg}.`)
              .setColor(0x95fd91);
            await message.channel.send(embed).catch(error => {});
          }
          else{
            embed.setDescription(`${cross} invalid sub-command`)
              .setColor(0xff4747);
            await message.channel.send(embed).catch(error => {});
            await message.reactions.removeAll();
            react(message, '❌');
          }
        }
      }
    }
  }
}