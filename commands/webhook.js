module.exports = {
    name : 'webhook',
    description : 'webhook messages',
  
    async run(Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, emojiIDs, helpText){
      const tick = await client.emojis.cache.get(emojiIDs.tick);
      const cross = await client.emojis.cache.get(emojiIDs.cross);
      const arrow = await client.emojis.cache.get(emojiIDs.arrow);
      messageEmojiFinder = require("../editors/messageEmojiFinder.js");
      if(!helpText){
        helpText = "webhook";
      }
      let embed = new Discord.MessageEmbed()
      .setColor(0x98dbfa);
      if(!message.member.hasPermission("ADMINISTRATOR")){
        await message.reactions.removeAll();
        react(message, '❌');
        return;
      }
      if((!args[0]) || args[0].toLowerCase() == "help"){
        embed.setTitle("Webhook Commands Help")
          .setDescription( `
          > ${arrow} ${prefix}${helpText} name \`<name>\`- *To set the name of the webhook*.
          > ${arrow} ${prefix}${helpText} avatar \`<url>\`- *To set the avatar of the webhook*.
          > ${arrow} ${prefix}${helpText} embedColor \`<color>\`- *To set the color of the embed*.
          > ${arrow} ${prefix}${helpText} say \`<msg>\`- *To send a text message via webhook*.
          > ${arrow} ${prefix}${helpText} embed \`<msg>\`- *To send an embed message via webhook*.
          **Note-**
          > You can't use external emojis in a webhook.
          `)
          .setColor(0x2f3136);
        await message.channel.send(embed).catch(error => {});
      }
      else{
        if(!args[1]){
          embed.setDescription(`${cross} Please provide a value.`)
            .setColor(0xff4747);
          await message.channel.send(embed).catch(error => {});
          await message.reactions.removeAll();
          react(message, '❌');
          return;
        }
        else{
          if(args[0].toLowerCase() == "name"){
            let name = args.slice(1).join(" ");
            await database.set("whName", name);
            embed.setDescription(`${tick} Webhook name set as \`${name}\`.`)
              .setColor(0x95fd91);
            await message.channel.send(embed).catch(error => {});
          }
          else if(args[0].toLowerCase() == "avatar"){
            let avatarURL = args[1];
            try{
              embed.setThumbnail(avatarURL);
              let msg = await message.channel.send(embed);
              await msg.delete();
            }catch{
              embed.setDescription(`${cross} Image not loadable.`)
                .setColor(0xff4747);
              await message.channel.send(embed).catch(error => {});
              await message.reactions.removeAll();
              react(message, '❌');
              return;
            }
            await database.set("whURL", avatarURL);
            embed.setDescription(`${tick} Webhook avatar set as`)
              .setImage(avatarURL)
              .setColor(0x95fd91);
            await message.channel.send(embed).catch(error => {});
          }
          else if(args[0].toLowerCase() == "embedcolor"){
            let color = args[1];
            if(color == "null"){
              color = null;
            }
            await database.set("whEmbedColor", color);
            embed.setDescription(`${tick} Webhook embed color set as \`${color}\`.`)
              .setColor(0x95fd91);
            await message.channel.send(embed).catch(error => {});
          }
          else if(args[0].toLowerCase() == "say" || args[0].toLowerCase() == "embed"){
            let channel;
            let arg;
            channel = message.mentions.channels.first();
            if(!channel){
              channel = message.channel;
              arg = args.slice(1);
            }else{
              arg = args.slice(2);
            }
            msg = messageEmojiFinder(client, message, arg);
            if(!msg){
              embed.setDescription(`${cross} Message cannot be empty.`)
                .setColor(0xff4747); 
              await message.channel.send(embed).catch(error => {});
              await message.reactions.removeAll();
              react(message, '❌');
              return;
            }
            if(msg.length >= 2000){
              msg.length = 1997;
              msg = msg + "...";
            }
            let webhookName = await database.get("whName");
            let webhookURL = await database.get("whURL");
            if(!webhookName){
              webhookName = message.guild.name;
            }
            if(!webhookURL){
              webhookURL = message.guild.iconURL();
            }
            let ws, w;
            ws = await channel.fetchWebhooks();
            w = ws.first();
            if(!w){
              await channel.createWebhook(message.guild.name, {
                avatar: message.guild.iconURL({dynamic: true}),
              });
            }
            const webhooks = await channel.fetchWebhooks();
            const webhook = webhooks.first();
            if(args[0].toLowerCase() == "say") {
              try {
                await webhook.send(msg, {
                  username: webhookName,
                  avatarURL: webhookURL,
                }).then(async success => {
                  await webhook.delete().catch(error => {});
                });;
              }catch (error) {
                embed.setDescription(`${cross} Message cannot be empty.`)
                  .setColor(0xff4747)
                  .setFooter(`${prefix}${helpText} help`);
                await message.channel.send(embed);
                await message.reactions.removeAll();
                react(message, '❌');
                return;
              }
            }
            else if(args[0].toLowerCase() == "embed"){
              let color = await database.get("whEmbedColor");
              if(!color){
                color = 0x2f3136;
              }
              embed.setDescription(msg)
              .setColor(color);
              try {
                await webhook.send({
                  username: webhookName,
                  avatarURL: webhookURL,
                  embeds: [embed]
                }).then(async success => {
                  await webhook.delete().catch(error => {});
                });;
              }catch (error) {
                embed.setDescription(`${cross} Embed is empty`)
                  .setColor(0xff4747)
                  .setFooter(`${prefix}${helpText} help`);
                await message.channel.send(embed);
                return;
              }
            }
            await message.delete().catch(error => {});
          }
          else{
            embed.setDescription(`${cross} Invalid sub-command.`)
              .setColor(0xff4747)
              .setFooter(`${prefix}${helpText} help`);
            await message.channel.send(embed);
            await message.reactions.removeAll();
            react(message, '❌');
          }
        }
      }
    }
  }