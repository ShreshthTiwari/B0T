module.exports = {
  name : 'mcannounce',
  description : 'to make a minecraft announcement',

  async run(Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, e){
    const tick = await client.emojis.cache.get(e.tick);
    const cross = await client.emojis.cache.get(e.cross);
    let embed = new Discord.MessageEmbed()
      .setColor(0x98dbfa);
    if(!message.member.hasPermission("ADMINISTRATOR")){
      await message.reactions.removeAll();
      react(message, '❌');
      return;
    }
    let announcementChannelID = await database.get("minecraftAnnouncementChannelID");
    if(!announcementChannelID){
      embed.setDescription(`${cross} Minecraft announcement channel not set.`)
        .setColor(0xff4747);
      await message.channel.send(embed).catch(error => {});
      await message.reactions.removeAll();
      react(message, '❌');
      return;
    } 
    let announcementChannel = message.guild.channels.cache.get(announcementChannelID);
    if(!announcementChannel){
      embed.setDescription(`${cross} Minecraft announcement channel not present.`)
        .setColor(0xff4747);
      await message.channel.send(embed).catch(error => {});
      await message.reactions.removeAll();
      react(message, '❌');
      return;
    }
    if(!args[0]){
      embed.setDescription(`${cross} Message not provided.`)
        .setColor(0xff4747);
      await message.channel.send(embed).catch(error => {});
      await message.reactions.removeAll();
      react(message, '❌');
      return;
    }
    let pingRoleID = await database.get("minecraftAnnouncementPingRoleID");
    if(!pingRoleID){
      pingRoleID = "undefined";
    }
    let pingRole = message.guild.roles.cache.get(pingRoleID);
    let announcement = messageEmojiFinder(client, message, args);
    embed.setTitle("**Announcement**")
      .setDescription(`${announcement}`);

    let ws, w;
    ws = await announcementChannel.fetchWebhooks();
    w = ws.first();
    if(!w){
      await announcementChannel.createWebhook(message.guild.name, {
        avatar: message.guild.iconURL({dynamic: true}),
      });
    }
    const webhooks = await announcementChannel.fetchWebhooks();
    const webhook = webhooks.first();
    try {
      await webhook.send({
        username: message.guild.name,
        avatarURL: message.guild.iconURL({dynamic: true}),
        embeds: [embed]
      });
    }catch (error) {
      embed.setDescription(`${cross} Message cannot be empty.`)
        .setColor(0xff4747)
        .setFooter(`${prefix}${helpText} help`);
      await message.channel.send(embed);
      await message.reactions.removeAll();
      react(message, '❌');
      return;
    }

    if(pingRole){
      await announcementChannel.send(`${pingRole}`).then((msg) => setTimeout(function(){msg.delete().catch(error => {});}, 500)).catch(error => {});  
    }
    embed = new Discord.MessageEmbed()
      .setDescription(`${tick} Message announced.`)
      .setColor(0x95fd91);
    await message.channel.send(embed).catch(error => {});
  }
}