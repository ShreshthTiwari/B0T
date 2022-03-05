let userApplications = {};
let responce;
let success = true;
let guild = {};
let questions = [];
let database;
let applicationLogsChannelID;
let transcriptsChannelID;
let botCommandsChannelID;
let canApply;
let prefix = '-';
let Guild;

module.exports = (Discord, client, Keyv, fs, path, messageEmojiFinder, react, emojiIDs) =>{
  client.on('message', async message => {
    const tick = client.emojis.cache.get(emojiIDs.tick);
    const cross = client.emojis.cache.get(emojiIDs.cross);
    const arrow = await client.emojis.cache.get(emojiIDs.arrow);
    if(message.guild){
      database = new Keyv('sqlite://./databases/database.sqlite', {
        table: `${message.guild.id}`
      });
      let checkPrefix = await database.get("botPrefix");
      if(checkPrefix) prefix = checkPrefix;
    }
    let embed = new Discord.MessageEmbed()
    .setColor(0x98dbfa);
    if (message.author.bot){ 
      return;
    }
    let authorId = message.author.id;
    if(message.content.toLowerCase() === `${prefix}apply`){
      if(!message.guild){
        console.log("guild not found");/*************************/
        return;
      }
      guild[authorId] = message.guild.id;
      let directoryLocation = path.join(__dirname, "..", "applications", `${message.guild.id}`);
      await fs.mkdir(directoryLocation, { recursive: true }, (err) => {});
      directoryLocation = path.join(__dirname, "..", "transcripts", `${message.guild.id}`);
      await fs.mkdir(directoryLocation, { recursive: true }, (err) => {});
      database = new Keyv('sqlite://./databases/database.sqlite', {
        table: `${guild[authorId]}`
      });
      botCommandsChannelID = await database.get("botCommandsChannelID");
      if(botCommandsChannelID){
        let botCommandsChannel = message.guild.channels.cache.get(botCommandsChannelID);
        if(botCommandsChannel){
          if((message.channel.id != botCommandsChannelID) && (!message.member.hasPermission("ADMINISTRATOR"))){
            embed.setDescription(`${cross} Please use <#${botCommandsChannelID}>.`)
            .setColor(0xff4747);
            await message.channel.send(embed).then((msg) => setTimeout(function(){msg.delete().catch(error => {});}, 15000)).catch(error => {});
            await message.reactions.removeAll();
            react(message, '❌');
            return;
          }
        }else{
          embed.setDescription(`${cross} Bot commands channel not set.`)
          .setColor(0xff4747);
          await message.channel.send(embed).catch(error => {});
          await message.reactions.removeAll();
          react(message, '❌');
          return;
        }
      }
      applicationLogsChannelID = await database.get("applicationLogsChannelID");
      transcriptsChannelID = await database.get("transcriptsChannelID");
      canApply = await database.get("canApply");
      database.on('error', err => console.log('Connection Error', err));
      if(!applicationLogsChannelID){
        embed.setDescription(`${cross} Application logs channel not set.`)
        .setColor(0xff4747);
        await message.channel.send(embed).catch(error => {});
        await message.reactions.removeAll();
        react(message, '❌');
        return;
      }else{
        let applicationLogsChannel = message.guild.channels.cache.get(applicationLogsChannelID);
        if(!applicationLogsChannel){
          embed.setDescription(`${cross} Application logs channel not set.`)
          .setColor(0xff4747);
          await message.channel.send(embed).catch(error => {});
          await message.reactions.removeAll();
          react(message, '❌');
          return;
        }
      }
      if(!transcriptsChannelID){
        embed.setDescription(`${cross} Trasncripts channel not set.`)
        .setColor(0xff4747);
        await message.channel.send(embed).catch(error => {});
        await message.reactions.removeAll();
        react(message, '❌');
        return;
      }else{
        let transcriptsChannel = message.guild.channels.cache.get(transcriptsChannelID);
        if(!transcriptsChannel){
          embed.setDescription(`${cross} Trasncripts channel not set.`)
          .setColor(0xff4747);
          await message.channel.send(embed).catch(error => {});
          await message.reactions.removeAll();
          react(message, '❌');
          return;
        }
      }
      if(!canApply){
        canApply = "false";
        await database.set("canapply", canApply);
      }
      if(canApply.toLowerCase() == "false"){
        embed.setDescription(`${cross} Applications are closed.`)
        .setColor(0xff4747);
        await message.channel.send(embed).catch(error => {});
        return;
      }
      let blackList = await database.get("applicationBlackList");
      if(blackList){
        let blackListIDs = blackList.split(" ");
        for(let i=0; i<=blackListIDs.length-1; i++){
          if(message.author.id == blackListIDs[i]){
            embed.setDescription(`${cross} You are blacklisted so cannot apply.`)
              .setColor(0xff4747);
            await message.channel.send(embed).catch(error => {});
            return;
          }
        }
      } 
      questions[0] = await database.get(`appQuestion${1}`);
      if(!questions[0]){
        embed.setDescription(`${cross} Application questions not set.`)
        .setColor(0xff4747);
        await message.author.send(embed).catch(error => {});
        return;
      }
      for(let i=1; i<=16; i++){
        questions[i] = await database.get(`appQuestion${i}`);
        if((!questions[i]) || questions[i] == "null"){
          break;
        }
      }
      const logFileLocation = path.join(__dirname, "..", "applications", `${message.guild.id}`, `${message.author.id}.txt`);
      try{
        let findFile = fs.statSync(logFileLocation);
        embed.setDescription(`${cross} There is a pending application by you.`)
        .setColor(0xff4747);
        await message.channel.send(embed).catch(error => {});
        return;
      }catch (error){
        //This error is good. It means file is not present so we will continue creating the file.
      }
      if(!(authorId in userApplications)) {
        userApplications[authorId] = { "step" : 1}
        embed.setDescription(`${tick} Application started!\nPlease check your DM and continue filling the application.`)
        .setColor(0x95fd91);
        let msg = await message.channel.send(embed).catch(error => {});
        Guild = client.guilds.cache.get(guild[authorId]);
        embed.setAuthor("", Guild.iconURL())
        .setTitle("~~>>>~~ __**STAFF APPLICATION**__ ~~<<<~~")
        .setDescription(`Thank you for choosing to apply for ${Guild.name} staff, Please provide clear and honest answers. Good luck!\n
        -${Guild.name} Staff\n
        You can cancel the application at any time by typing \`cancel\` in the answer.\n\n
        **Question 1**- \`${questions[1]}\``)
        .setColor(0x2f3136);
        await message.author.send(embed).catch( async error =>{
          embed.setDescription(`${cross} Couldn't DM you.`)
          .setColor(0xff4747);
          await msg.edit(embed).catch(error => {});
          return;
        });
      }
    }
    else{
      if(message.channel.type == "dm"){
        if(authorId in userApplications){
          Guild = client.guilds.cache.get(guild[authorId]);
          if((!guild[authorId]) || (!database)){
            embed.setDescription(`${cross} Bug encountered.\nPlease report it.\n\`-bot reportBug <msg>\``)
            .setColor(0xff4747);
            await message.author.send(embed).catch(error => {});
            return;  
          }
          let authorApplication = userApplications[authorId];
          if(message.content.toLowerCase() == "cancel"){
            embed.setDescription(`${cross} Application canceled.`)
            .setColor(0xff4747);
            await message.author.send(embed).catch(error => {});
            delete userApplications[authorId];
            delete guild[authorId];
            return;
          }
          else{
            switch(authorApplication.step){
              case 1:
                authorApplication.answer1 = message.content;
                if((!questions[authorApplication.step + 1]) || questions[authorApplication.step + 1] == "null"){
                  authorApplication.step = 16;
                  embed.setDescription(`${tick} All questions asnwered.\nType \`cancel\` to concel the application or any other value to continue.`);
                }else{
                  embed.setDescription(`**Question ${authorApplication.step + 1}**- \`${questions[authorApplication.step + 1]}\``)
                  .setFooter("Type 'cancel' to cancel the application.");                  
                  authorApplication.step ++;
                }
                await message.author.send(embed).catch(error => {});
                break;
              case 2:
                authorApplication.answer2 = message.content;
                if((!questions[authorApplication.step + 1]) || questions[authorApplication.step + 1] == "null"){
                  authorApplication.step = 16;
                  embed.setDescription(`${tick} All questions asnwered.\nType \`cancel\` to concel the application or any other value to continue.`);
                }else{
                  embed.setDescription(`**Question ${authorApplication.step + 1}**- \`${questions[authorApplication.step + 1]}\``)
                  .setFooter("Type 'cancel' to cancel the application.");                  
                  authorApplication.step ++;
                }
                await message.author.send(embed).catch(error => {});
                break;
              case 3:
                authorApplication.answer3 = message.content;
                if((!questions[authorApplication.step + 1]) || questions[authorApplication.step + 1] == "null"){
                  authorApplication.step = 16;
                  embed.setDescription(`${tick} All questions asnwered.\nType \`cancel\` to concel the application or any other value to continue.`);
                }else{
                  embed.setDescription(`**Question ${authorApplication.step + 1}**- \`${questions[authorApplication.step + 1]}\``)
                  .setFooter("Type 'cancel' to cancel the application.");                  
                  authorApplication.step ++;
                }
                await message.author.send(embed).catch(error => {});
                break;
              case 4:
                authorApplication.answer4 = message.content;
                if((!questions[authorApplication.step + 1]) || questions[authorApplication.step + 1] == "null"){
                  authorApplication.step = 16;
                  embed.setDescription(`${tick} All questions asnwered.\nType \`cancel\` to concel the application or any other value to continue.`);
                }else{
                  embed.setDescription(`**Question ${authorApplication.step + 1}**- \`${questions[authorApplication.step + 1]}\``)
                  .setFooter("Type 'cancel' to cancel the application.");                  
                  authorApplication.step ++;
                }
                await message.author.send(embed).catch(error => {});
                break;
              case 5:
                authorApplication.answer5 = message.content;
                if((!questions[authorApplication.step + 1]) || questions[authorApplication.step + 1] == "null"){
                  authorApplication.step = 16;
                  embed.setDescription(`${tick} All questions asnwered.\nType \`cancel\` to concel the application or any other value to continue.`);
                }else{
                  embed.setDescription(`**Question ${authorApplication.step + 1}**- \`${questions[authorApplication.step + 1]}\``)
                  .setFooter("Type 'cancel' to cancel the application.");                  
                  authorApplication.step ++;
                }
                await message.author.send(embed).catch(error => {});
                break;
              case 6:
                authorApplication.answer6 = message.content;
                if((!questions[authorApplication.step + 1]) || questions[authorApplication.step + 1] == "null"){
                  authorApplication.step = 16;
                  embed.setDescription(`${tick} All questions asnwered.\nType \`cancel\` to concel the application or any other value to continue.`);
                }else{
                  embed.setDescription(`**Question ${authorApplication.step + 1}**- \`${questions[authorApplication.step + 1]}\``)
                  .setFooter("Type 'cancel' to cancel the application.");                  
                  authorApplication.step ++;
                }
                await message.author.send(embed).catch(error => {});
                break;
              case 7:
                authorApplication.answer7 = message.content;
                if((!questions[authorApplication.step + 1]) || questions[authorApplication.step + 1] == "null"){
                  authorApplication.step = 16;
                  embed.setDescription(`${tick} All questions asnwered.\nType \`cancel\` to concel the application or any other value to continue.`);
                }else{
                  embed.setDescription(`**Question ${authorApplication.step + 1}**- \`${questions[authorApplication.step + 1]}\``)
                  .setFooter("Type 'cancel' to cancel the application.");                  
                  authorApplication.step ++;
                }
                await message.author.send(embed).catch(error => {});
                break;
              case 8:
                authorApplication.answer8 = message.content;
                if((!questions[authorApplication.step + 1]) || questions[authorApplication.step + 1] == "null"){
                  authorApplication.step = 16;
                  embed.setDescription(`${tick} All questions asnwered.\nType \`cancel\` to concel the application or any other value to continue.`);
                }else{
                  embed.setDescription(`**Question ${authorApplication.step + 1}**- \`${questions[authorApplication.step + 1]}\``)
                  .setFooter("Type 'cancel' to cancel the application.");                  
                  authorApplication.step ++;
                }
                await message.author.send(embed).catch(error => {});
                break;
              case 9:
                authorApplication.answer9 = message.content;
                if((!questions[authorApplication.step + 1]) || questions[authorApplication.step + 1] == "null"){
                  authorApplication.step = 16;
                  embed.setDescription(`${tick} All questions asnwered.\nType \`cancel\` to concel the application or any other value to continue.`);
                }else{
                  embed.setDescription(`**Question ${authorApplication.step + 1}**- \`${questions[authorApplication.step + 1]}\``)
                  .setFooter("Type 'cancel' to cancel the application.");                  
                  authorApplication.step ++;
                }
                await message.author.send(embed).catch(error => {});
                break;
              case 10:
                authorApplication.answer10 = message.content;
                if((!questions[authorApplication.step + 1]) || questions[authorApplication.step + 1] == "null"){
                  authorApplication.step = 16;
                  embed.setDescription(`${tick} All questions asnwered.\nType \`cancel\` to concel the application or any other value to continue.`);
                }else{
                  embed.setDescription(`**Question ${authorApplication.step + 1}**- \`${questions[authorApplication.step + 1]}\``)
                  .setFooter("Type 'cancel' to cancel the application.");                  
                  authorApplication.step ++;
                }
                await message.author.send(embed).catch(error => {});
                break;
              case 11:
                authorApplication.answer11 = message.content;
                if((!questions[authorApplication.step + 1]) || questions[authorApplication.step + 1] == "null"){
                  authorApplication.step = 16;
                  embed.setDescription(`${tick} All questions asnwered.\nType \`cancel\` to concel the application or any other value to continue.`);
                }else{
                  embed.setDescription(`**Question ${authorApplication.step + 1}**- \`${questions[authorApplication.step + 1]}\``)
                  .setFooter("Type 'cancel' to cancel the application.");                  
                  authorApplication.step ++;
                }
                await message.author.send(embed).catch(error => {});
                break;
              case 12:
                authorApplication.answer12 = message.content;
                if((!questions[authorApplication.step + 1]) || questions[authorApplication.step + 1] == "null"){
                  authorApplication.step = 16;
                  embed.setDescription(`${tick} All questions asnwered.\nType \`cancel\` to concel the application or any other value to continue.`);
                }else{
                  embed.setDescription(`**Question ${authorApplication.step + 1}**- \`${questions[authorApplication.step + 1]}\``)
                  .setFooter("Type 'cancel' to cancel the application.");                  
                  authorApplication.step ++;
                }
                await message.author.send(embed).catch(error => {});
                break;
              case 13:
                authorApplication.answer13 = message.content;
                if((!questions[authorApplication.step + 1]) || questions[authorApplication.step + 1] == "null"){
                  authorApplication.step = 16;
                  embed.setDescription(`${tick} All questions asnwered.\nType \`cancel\` to concel the application or any other value to continue.`);
                }else{
                  embed.setDescription(`**Question ${authorApplication.step + 1}**- \`${questions[authorApplication.step + 1]}\``)
                  .setFooter("Type 'cancel' to cancel the application.");                  
                  authorApplication.step ++;
                }
                await message.author.send(embed).catch(error => {});
                break;
              case 14:
                authorApplication.answer14 = message.content;
                if((!questions[authorApplication.step + 1]) || questions[authorApplication.step + 1] == "null"){
                  authorApplication.step = 16;
                  embed.setDescription(`${tick} All questions asnwered.\nType \`cancel\` to concel the application or any other value to continue.`);
                }else{
                  embed.setDescription(`**Question ${authorApplication.step + 1}**- \`${questions[authorApplication.step + 1]}\``)
                  .setFooter("Type 'cancel' to cancel the application.");                  
                  authorApplication.step ++;
                }
                await message.author.send(embed).catch(error => {});
                break;
              case 15:
                authorApplication.answer15 = message.content;
                if((!questions[authorApplication.step + 1]) || questions[authorApplication.step + 1] == "null"){
                  authorApplication.step = 16;
                  embed.setDescription(`${tick} All questions asnwered.\nType \`cancel\` to concel the application or any other value to continue.`);
                }else{
                  embed.setDescription(`**Question ${authorApplication.step + 1}**- \`${questions[authorApplication.step + 1]}\``)
                  .setFooter("Type 'cancel' to cancel the application.");                  
                  authorApplication.step ++;
                }
                await message.author.send(embed).catch(error => {});
                break;
              case 16:
                authorApplication.answer16 = message.content;
                embed.setDescription("**Please cross-check your application.**\nReact with ✅ to send the the application or with ❌ to cancel.");
                responce = await message.author.send(embed).catch(error => {});
                await responce.react('✅').then(
                  responce.react('❌')
                );
                responce.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == '✅' || reaction.emoji.name == '❌'),{max: 1, time: 240000 }).then(async collected => {
                  if (collected.first().emoji.name === '✅') {
                    let directoryLocation = path.join(__dirname, "..", "applications", `${Guild.id}`);
                    await fs.mkdir(directoryLocation, { recursive: true }, (err) => {});
                    let logchannel = client.channels.cache.get(applicationLogsChannelID);
                    const logFileLocation = path.join(__dirname, "..", "applications", `${Guild.id}`, `${message.author.id}.txt`);
                    try{
                      let findFile = fs.statSync(logFileLocation);
                      embed.setDescription(`${cross} There is a pending application by you.`)
                      .setColor(0xff4747);
                      message.channel.send(embed).catch(error => {});
                      return;
                    }catch (error){
                      //This error is good. It means file is not present so we will continue creating the file.
                    }
                    try {
                      fs.writeFile(logFileLocation,
                      "==============================\n" +
                      "NEW APPLICATION" +  
                      "\n==============================\n" +
                      "User- " + message.author.tag +
                      "\nID- " + message.author.id +
                      "\n==============================\n" +
                      "Question 01- " + questions[1] + '\nAnswer 1- ' + authorApplication.answer1 + '\n\n' + 
                      "Question 02- " + questions[2] + '\nAnswer 2- ' + authorApplication.answer2 + '\n\n' + 
                      "Question 03- " + questions[3] + '\nAnswer 3- ' + authorApplication.answer3 + '\n\n' + 
                      "Question 04- " + questions[4] + '\nAnswer 4- ' + authorApplication.answer4 + '\n\n' + 
                      "Question 05- " + questions[5] + '\nAnswer 5- ' + authorApplication.answer5 + '\n\n' + 
                      "Question 06- " + questions[6] + '\nAnswer 6- ' + authorApplication.answer6 + '\n\n' +
                      "Question 07- " + questions[7] + '\nAnswer 7- ' + authorApplication.answer7 + '\n\n' + 
                      "Question 08- " + questions[8] + '\nAnswer 8- ' + authorApplication.answer8 + '\n\n' + 
                      "Question 09- " + questions[9] + '\nAnswer 9- ' + authorApplication.answer9 + '\n\n' + 
                      "Question 10- " + questions[10] + '\nAnswer 10- ' + authorApplication.answer10 + '\n\n' + 
                      "Question 11- " + questions[11] + '\nAnswer 11- ' + authorApplication.answer11 + '\n\n' +
                      "Question 12- " + questions[12] + '\nAnswer 12- ' + authorApplication.answer12 + '\n\n' + 
                      "Question 13- " + questions[13] + '\nAnswer 13- ' + authorApplication.answer13 + '\n\n' +
                      "Question 14- " + questions[14] + '\nAnswer 14- ' + authorApplication.answer14 + '\n\n' + 
                      "Question 15- " + questions[15] + '\nAnswer 15- ' + authorApplication.answer15 + '\n\n' + 
                      "Question 16- " + questions[16] + '\nAnswer 16- ' + authorApplication.answer16 + '\n\n', { flag: 'wx' }, function (err) {
                        if (err){
                          embed.setDescription(`${cross} Error while storing your application.\nPlease report it to the bot dev.\n\`${prefix}bot reportBug <msg>\`.`)
                          .setColor(0xff4747); 
                          message.reply(embed).catch(error => {});
                          success = false;
                          return;
                        }  
                      });
                    }catch(error){
                      embed.setDescription(`${cross} Error while storing your application.\nPlease report it to the bot dev.\n\`${prefix}bot reportBug <msg>\`.`)
                      .setColor(0xff4747); 
                      message.reply(embed).catch(error => {});
                      success = false;
                      return;
                    }
                    if(success){
                      logchannel.send({
                        files: [{
                          attachment: logFileLocation,
                          name: `${message.author.id}.txt`
                        }]
                      }).catch(error => {});
                      let transcriptsChannel = client.channels.cache.get(transcriptsChannelID);
                      transcriptsChannel.send({
                        files: [{
                          attachment: logFileLocation,
                          name: `${message.author.id}.txt`
                        }]
                      }).catch(error => {});
                      let embed = new Discord.MessageEmbed()
                      .setDescription(`${tick} **__THANK YOU__**.\n*Your answers have been successfully recorded*.`)
                      .setThumbnail(message.author.displayAvatarURL())
                      .setColor(0xFFFF00);
                      message.author.send(embed).catch(error => {});
                    }
                    else{
                      embed.setDescription(`${cross} Application canceled.`)
                      .setColor(0xff4747);
                      message.author.send(embed).catch(error => {});
                      delete userApplications[authorId];
                      delete guild[authorId];
                      return;    
                    }
                    delete userApplications[authorId];
                    delete guild[authorId];
                  }else{
                    embed.setDescription(`${cross} Application canceled.`)
                    .setColor(0xff4747);
                    message.reply(embed).catch(error => {});
                    delete userApplications[authorId];
                    delete guild[authorId];
                    return;
                  }
                }).catch(() => {
                  embed.setDescription(`${cross} No responce after 4 minutes, Application canceled.\nIf you feel it's a bug, please report it to the bot dev. \`${prefix}bot reportBug <message>\`.`)
                  .setColor(0xff4747);
                  message.reply(embed).catch(error => {});
                  delete userApplications[authorId];
                  delete guild[authorId];
                  return;
                });
              break;        
            }
          }
        }
        else{
          if(message.content.startsWith('-')){
            let t = await message.content.slice(1);
            let args = t.split(" ");
            embed = new Discord.MessageEmbed()
            .setColor(0x2f3136);
            for(let i=1; i<=args.length; i++){
              t = await t.replace("\n", " \n ").replace(":\n", ": \n").replace("\n:", "\n :").replace(":\n:", ": \n :");
            }
            args = await t.split(/ +/);
            if(!args[0]){
              react(message, '❌');
              return;
            }
            if(args[0].toLowerCase(0) == "help"){
              embed.setTitle("Bot DM Commands Help")
              .setDescription(`
              > ${arrow} -modmail \`<serverID>\` \`<msg>\`
              > ${arrow} -banappeal \`<serverID>\` \`<msg>\``);
              await message.author.send(embed).catch(error => {});
            }
            else if(args[0].toLowerCase() == "modmail" || args[0].toLowerCase() == "banappeal"){
              if(!(args[1] && args[2])){
                embed.setDescription(`${cross} Invalid syntax.`)
                .setColor(0xff4747)
                .setFooter("-help");
                await message.channel.send(embed).catch(error => {});
                return;
              }
              let guildID = args[1];
              let guild = await client.guilds.cache.get(guildID);
              if(!guild){
                embed.setDescription(`${cross} Invalid server ID.`)
                .setColor(0xff4747)
                .setFooter("-help");
                await message.channel.send(embed).catch(error => {});
                return;
              }
              database = new Keyv('sqlite://./databases/database.sqlite', {
                table: `${guildID}`
              });
              let modmailChannelID = await database.get("modMailsChannelID");
              if(!modmailChannelID){
                embed.setAuthor(guild.name, guild.iconURL())
                .setDescription(`${cross} Mod mails Channel not present.`)
                .setColor(0xff4747);
                await message.channel.send(embed).catch(error => {});
                return;
              }
              let modmailChannel = await client.guilds.cache.get(guildID).channels.cache.get(modmailChannelID);
              if(!modmailChannel){
                embed.setAuthor(guild.name, guild.iconURL())
                .setDescription(`${cross} Mod mails Channel not present.`)
                .setColor(0xff4747);
                await message.channel.send(embed).catch(error => {});
                return;
              }
              let msg = messageEmojiFinder(client, message, args.slice(2));
              if(msg.length > 1500){
                msg.length = 1500;
                msg = msg + "...";
              }
              if(args[0].toLowerCase() == "modmail"){
                embed.setAuthor(message.author.username, message.author.displayAvatarURL())
                .setThumbnail(message.author.displayAvatarURL())
                .setColor(0x2f3136)
                .setTitle("New Mail")
                .setDescription(`**ID**- \`${message.author.id}\`
                **Tag**- \`${message.author.tag}\`
                **Message**- 
                ${msg}
                \n-------
                Use \`msg\` or \`msge\` command to respond back.
                -------`);
              }
              else if(args[0].toLowerCase() == "banappeal"){
                let bans = await guild.fetchBans();
                if(bans.size == 0){
                  embed.setAuthor(guild.name, guild.iconURL())
                  .setDescription(`${cross} You are not banned.`)
                  .setColor(0xff4747);
                  await message.channel.send(embed).catch(error => {});
                  return;
                }
                let bUser = bans.find(b => b.user.id == message.author.id)
                if(!bUser){
                  embed.setAuthor(guild.name, guild.iconURL())
                  .setDescription(`${cross} You are not banned.`)
                  .setColor(0xff4747);
                  await message.channel.send(embed).catch(error => {});
                  return;
                }
                embed.setAuthor(message.author.username, message.author.displayAvatarURL())
                .setThumbnail(message.author.displayAvatarURL())
                .setColor(0x2f3136)
                .setTitle("Ban Appeal")
                .setDescription(`**ID**- \`${message.author.id}\`
                **Tag**- \`${message.author.tag}\`
                **Message**- 
                ${msg}
                \n-------
                Use \`msg\` or \`msge\` command to respond back.
                -------`);
              }
              await modmailChannel.send(embed).catch(async error => {
                embed = new Discord.MessageEmbed()
                .setAuthor(guild.name, guild.iconURL())
                .setDescription(`${cross} Error sending the mail.`)
                .setColor(0xff4747);
                await message.channel.send(embed).catch(error => {});
                return;
              });
              embed = new Discord.MessageEmbed()
              .setAuthor(guild.name, guild.iconURL())
              .setDescription(`${tick} Mail sent.`)
              .setColor(0x95fd91);
              await message.channel.send(embed).catch(error => {});
            }
            else{
              react(message, '❌');
            }
          }
        }
      }
    }
  });
}