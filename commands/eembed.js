module.exports = {
  name : 'eembed',
  description : 'to make extensive embeds',
  
  async run(Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, emojiIDs){
    const tick = await client.emojis.cache.get(emojiIDs.tick);
    const cross = await client.emojis.cache.get(emojiIDs.cross);
    const arrow = await client.emojis.cache.get(emojiIDs.arrow);
    let isNull = false;
    let embed = new Discord.MessageEmbed()
      .setColor(0x98dbfa);
    let tembed = new Discord.MessageEmbed();
    let value, worked = false;
    async function checkLink(value, link){
      try{
        tembed.setThumbnail(link);
        let msg = await message.channel.send(tembed);
        await msg.delete();
      }catch{
        if(!isNull){
          embed.setDescription(`${cross} Image not loadable.`)
            .setColor(0xff4747);
          await message.channel.send(embed).catch(error => {});
          await database.set(`eembed${value}`, null);
          await message.reactions.removeAll();
          react(message, '❌');
          return false;
        }
      }
      return true;
    }
    if(!message.member.hasPermission("ADMINISTRATOR")){
      await message.reactions.removeAll();
      react(message, '❌');
      return;
    }
    if((!args[0]) || args[0].toLowerCase() == "help"){
      embed.setDescription(`**Extensive Embed Help**
      **Variables**
      ㅤㅤ\`(Provide value as "null" to clear variables.)\`
      > ㅤㅤ${arrow} ${prefix}eembed set webhookname \`<name>\`
      > ㅤㅤ${arrow} ${prefix}eembed set webhookpfp \`<imageURL>\`
      > ㅤㅤ${arrow} ${prefix}eembed set author \`<name>\`
      > ㅤㅤ${arrow} ${prefix}eembed set authorimage \`<imageURL>\`
      > ㅤㅤ${arrow} ${prefix}eembed set title \`<msg>\`
      > ㅤㅤ${arrow} ${prefix}eembed set thumbnail \`<imageURL>\`
      > ㅤㅤ${arrow} ${prefix}eembed set description \`<msg>\`
      > ㅤㅤ${arrow} ${prefix}eembed set image \`<imageURL>\`
      > ㅤㅤ${arrow} ${prefix}eembed set color \`<color>\`
      > ㅤㅤ${arrow} ${prefix}eembed set timestamp \`<true/false>\`
      > ㅤㅤ${arrow} ${prefix}eembed set footer \`<msg>\`
      > ㅤㅤ${arrow} ${prefix}eembed set footerimage \`<imageURL>\`
      **Loading**
      > ㅤㅤ${arrow} ${prefix}eembed load
      > ㅤㅤ${arrow} ${prefix}eembed load \`<channel>\`
      **Cleaning**
      > ㅤㅤ${arrow} ${prefix}eembed clean
      **Note-**
      > ㅤㅤ${arrow} Use this invisible character for spacing- \`ㅤ\`.
      > ㅤㅤ${arrow} You can't use external emojis in a webhook.
      `)
      .setColor(0x2f3136);
      await message.channel.send(embed).catch(error => {});
    }
    else if(args[0].toLowerCase() == "set"){
      if(!args[1]){
        embed.setDescription(`${cross} Incomplete command.`)
          .setColor(0xff4747)
          .setFooter(`${prefix}eembed help`);
        await message.channel.send(embed).catch(error => {});
        await message.reactions.removeAll();
        react(message, '❌');
        return;
      }
      if(!args[2]){
        embed.setDescription(`${cross} Please provide a value.`)
          .setColor(0xff4747)
          .setFooter(`${prefix}eembed help`);
        await message.channel.send(embed).catch(error => {});
        await message.reactions.removeAll();
        react(message, '❌');
        return;
      }
      args[1] = args[1].toLowerCase();
      if(args[1] == "webhookname"){
        value = args.slice(2).join(" ");
        if(args[2].toLowerCase() == "null"){
          value = null;
          isNull = true;
        }
        await database.set(`eembed${args[1]}`, value);
      }
      else if(args[1] == "webhookpfp"){
        value = args[2];
        if(args[2].toLowerCase() == "null"){
          value = null;
          isNull = true;
        }
        worked = checkLink(args[1], value);
        if(!worked){
          return;
        }
        await database.set(`eembed${args[1]}`, value);
        embed.setImage(value);
        value = "null";
      }
      else if(args[1] == "author"){
        value = args.slice(2).join(" ");
        if(args[2].toLowerCase() == "null"){
          value = null;
          isNull = true;
        }
        await database.set(`eembed${args[1]}`, value);
      }
      else if(args[1] == "authorimage"){
        value = args[2];
        if(args[2].toLowerCase() == "null"){
          value = null;
          isNull = true;
        }
        worked = checkLink(args[1], value);
        if(!worked){
          return;
        }
        await database.set(`eembed${args[1]}`, value);
        embed.setImage(value);
        value = "null";
      }
      else if(args[1] == "title"){
        value = args.slice(2).join(" ");
        if(args[2].toLowerCase() == "null"){
          value = null;
          isNull = true;
        }
        await database.set(`eembed${args[1]}`, value);
      }
      else if(args[1] == "thumbnail"){
        value = args.slice(2).join(" ");
        if(args[2].toLowerCase() == "null"){
          value = null;
          isNull = true;
        }
        worked = checkLink(args[1], value);
        if(!worked){
          return;
        }
        await database.set(`eembed${args[1]}`, value);
        embed.setImage(value);
        value = "null";
      }
      else if(args[1] == "description"){
        value = args.slice(2).join(" ");
        if(args[2].toLowerCase() == "null"){
          value = null;
          isNull = true;
        }
        await database.set(`eembed${args[1]}`, value);
      }
      else if(args[1] == "image"){
        value = args.slice(2).join(" ");
        if(args[2].toLowerCase() == "null"){
          value = null;
          isNull = true;
        }
        worked = checkLink(args[1], value);
        if(!worked){
          return;
        }
        await database.set(`eembed${args[1]}`, value);
        embed.setImage(value);
        value = "null";
      }
      else if(args[1] == "color"){
        value = args.slice(2).join(" ");
        if(args[2].toLowerCase() == "null"){
          value = null;
          isNull = true;
        }
        await database.set(`eembed${args[1]}`, value);
      }
      else if(args[1] == "timestamp"){
        args[2] = args[2].toLowerCase();
        if(args[2].toLowerCase() == "true" || args[2].toLowerCase() == "false"){
          value = args[2];
        }
        else{
          embed.setDescription(`${cross} It can only be \`true\` or \`false\`.`)
            .setColor(0xff4747);
          await message.channel.send(embed).catch(error => {});
          await message.reactions.removeAll();
          react(message, '❌');
          return;
        }
        await database.set(`eembed${args[1]}`, value);
      }
      else if(args[1] == "footer"){
        value = args.slice(2).join(" ");
        if(args[2].toLowerCase() == "null"){
          value = null;
          isNull = true;
        }
        await database.set(`eembed${args[1]}`, value);
      }
      else if(args[1] == "footerimage"){
        value = args[2];
        if(args[2].toLowerCase() == "null"){
          value = null;
          isNull = true;
        }
        worked = checkLink(args[1], value);
        if(!worked){
          return;
        }
        await database.set(`eembed${args[1]}`, value);
        embed.setImage(value);
        value = "null";
      }
      else{
        embed.setDescription(`${cross} sub-command not found.`)
          .setColor(0xff4747)
          .setFooter(`${prefix}eembed help`);
        await message.channel.send(embed).catch(error => {});
        await message.reactions.removeAll();
        react(message, '❌');
        return;
      }
      await embed.setDescription(`${tick} Set \`extensive embed ${args[1]}\` as \`${value}\`.`)
        .setColor(0x95fd91);
      await message.channel.send(embed).catch(error => {});
    }
    else if(args[0].toLowerCase() == "load"){
      let channel = message.channel;
      if(args[1]){
        channel = message.mentions.channels.first();
        if(!channel){
          channel = message.guild.channels.cache.get(args[1]);
          if(!channel){
            channel = message.channel;
          }
        }
      }
      let webhookname = await database.get(`eembedwebhookname`);
      let webhookpfp = await database.get(`eembedwebhookpfp`);
      let author = await database.get(`eembedauthor`);
      let authorimage = await database.get(`eembedauthorimage`);
      let title = await database.get(`eembedtitle`);
      let thumbnail = await database.get(`eembedthumbnail`);
      let description = await database.get(`eembeddescription`);
      let image = await database.get(`eembedimage`);
      let color = await database.get(`eembedcolor`);
      let timestamp = await database.get(`eembedtimestamp`);
      let footer = await database.get(`eembedfooter`);
      let footerimage = await database.get(`eembedfooterimage`);
      function replaceEmojis(text){
        text = text.replace("\n", " \n ").replace(":\n", ": \n").replace("\n:", "\n :").replace(":\n:", ": \n :");
        let tempArgs = text.split(" ");
        text = messageEmojiFinder(client, message, tempArgs);
        return text;
      }
      if(author || authorimage){
        if(author && authorimage){
          embed.setAuthor(author,authorimage);
        }else if(author){
          embed.setAuthor(author);
        }else if(authorimage){
          embed.setAuthor('',authorimage);
        }
      }
      if(title){
        title = replaceEmojis(title);
        embed.setTitle(title);
      }
      if(thumbnail){
        embed.setThumbnail(thumbnail);
      }
      if(description){
        description = replaceEmojis(description);
        embed.setDescription(description);
      }
      if(image){
        embed.setImage(image);
      }
      if(color){
        embed.setColor(color);
      }
      if(timestamp == "true"){
        embed.setTimestamp();
      }
      if(footer || footerimage){
        if(footer && footerimage){
          embed.setFooter(footer, footerimage);
        }else if(footer){
          embed.setFooter(footer);
        }else if(footerimage){
          embed.setFooter('', footerimage);
        }
      }
      if(webhookname || webhookpfp){
        let ws, w;
        ws = await channel.fetchWebhooks();
        w = ws.first();
        if(!w){
          await channel.createWebhook(message.author.username, {
            avatar: message.author.displayAvatarURL({dynamic: true}),
          });
        }
        if(!webhookname){
          webhookname = message.author.username;
        }
        if(!webhookpfp){
          webhookpfp = message.author.displayAvatarURL({dynamic: true});
        }
        try {
          const webhooks = await channel.fetchWebhooks();
          const webhook = webhooks.first();
          await webhook.send({
            username: webhookname,
            avatarURL: webhookpfp,
            embeds: [embed]
          }).then(async success => {
            await webhook.delete().catch(error => {});
          });;
        }catch (error) {
          embed.setDescription(`${cross} Embed is empty.`)
            .setColor(0xff4747)
            .setFooter(`${prefix}eembed help`);
          await message.channel.send(embed);
          return;
        }
      }else{
        await channel.send(embed).catch(async error => {
          embed.setDescription(`${cross} Embed is empty.`)
            .setColor(0xff4747)
            .setFooter(`${prefix}eembed help`);
          await message.channel.send(embed);
        });
      }
    }
    else if(args[0].toLowerCase() == "clean"){
      await database.set(`eembedauthor`, null);
      await database.set(`eembedauthorimage`, null);
      await database.set(`eembedtitle`, null);
      await database.set(`eembedthumbnail`, null);
      await database.set(`eembeddescription`, null);
      await database.set(`eembedimage`, null);
      await database.set(`eembedcolor`, null);
      await database.set(`eembedfooter`, null);
      await database.set(`eembedfooterimage`, null);
      await database.set(`webhookname`, null);
      await database.set(`webhookpfp`, null);
    }
    else{
      embed.setDescription(`${cross} sub-command not found.`)
        .setColor(0xff4747)
        .setFooter(`${prefix}eembed help`);
      await message.reactions.removeAll();
      react(message, '❌');
      return;
    }
  }
}