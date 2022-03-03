let ms = require("ms");
let dirtyLinks = ["discorsd.gift", "disocrds.gift"];

module.exports = async(Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, content, emojiIDs) =>{
  const verificationChannelID = await database.get("verificationChannelID");
  const ticketChannelID = await database.get('ticketChannelID');
  if(message.channel.id == verificationChannelID || message.channel.id == ticketChannelID){
    await message.delete().catch(error => {});
    return;
  }
  let embed = new Discord.MessageEmbed()
    .setColor(0x2f3136)
    .setAuthor(`B0T`, client.user.displayAvatarURL({dynamic: true}))
    .setThumbnail(message.guild.iconURL());
  if(content == 'gm') {
    embed.setDescription("Good Morning!");
    await message.channel.send(embed).catch(error => {});
  }
  else if(content == 'gn'){
    embed.setDescription("Good Night!");
    await message.channel.send(embed).catch(error => {});
  }
  else if(content == "prefix?"){
    embed.setDescription(`My prefix is **\`${prefix}\`**`)
      .setFooter(`${prefix}help`);
    await message.channel.send(embed).catch(error => {});
  }
  else if(content == 'rip'){
    const attachment = new Discord.MessageAttachment('https://i.imgur.com/w3duR07.png');
    await message.channel.send(attachment).catch(error => {});
  }
  else if(content == `f`){
    const fid = await database.get('fEmojiID');
    let f = client.emojis.cache.get(fid);
    if(!f){
      f = client.emojis.cache.get(emojiIDs.f);
    }
    await message.react(f);
  }
  if(message.mentions.members.first()){
    let p = personFinder(message, args[0], "member");
    if(p){
      if(p.bot){
        return;
      }
      let staffRoleID = await database.get("staffRoleID");
      if((!message.member.hasPermission("ADMINISTRATOR")) && (!message.member.roles.cache.has(staffRoleID))){
        if(staffRoleID){
          let pRole = await p.roles.cache.first();
          let staffRole = await message.guild.roles.cache.get(staffRoleID);
          if(p.hasPermission("ADMINISTRATOR") || p.roles.cache.has(staffRoleID) || pRole.position >= staffRole.position){
            if(message.content.length > 500){
              message.content.length = 500;
              message.content = message.content + '...';
            }
            if(!(message.channel.name.startsWith("ticket-") || message.channel.name.startsWith("bug-") || message.channel.name.startsWith("report"))){
            embed.setDescription("Do not ping the STAFF!")
              .setColor(0xff4747);
            await message.reply(embed).then((msg) => setTimeout(function(){msg.delete().catch(error => {});}, 5000)).catch(error => {});
            embed.setTitle(`You Were Pinged`)
              .setDescription(`By- ${message.author.tag} | ${message.author.id}
              Guild- ${message.guild} | ${message.guild.id}
              Channel- ${message.channel.name} | ${message.channel.id}
              Content- ${message.content}
              **${message.channel}**`)
              .setColor(0x2f3136);
            await p.send(embed).catch(error => {});
            await message.delete().catch(error => {/*Message not present*/});
            return;
            }
          }
        }
      }
      let afkStatus = await database.get(`${p.id} afkStatus`);
      if(afkStatus && afkStatus == "true"){
        let afkSetTime = await database.get(`${p.id} afkSetTime`);
        let presentTime = new Date();
        presentTime = Math.abs(presentTime);
        let afkTime = presentTime - afkSetTime;
        afkTime = ms(afkTime);
        let msg = await database.get(`${p.id} afkMessage`);
        embed = new Discord.MessageEmbed()
          .setDescription(`${p} is currently AFK: ${msg}`)
          .setColor(0xff4747)
          .setFooter(`For ${afkTime}.`);
        await message.reply(embed).then((msg) => setTimeout(function(){msg.delete().catch(error => {});}, 5000)).catch(error => {});
      }
    }
  }
  let afkStatus = await database.get(`${message.author.id} afkStatus`);
  let lastDisplayName = await database.get(`${message.author.id} lastDisplayName`);
  if(afkStatus && afkStatus == "true" && message.content != `${prefix}afk`){
    embed = new Discord.MessageEmbed()
      .setDescription("Successfully Removed your AFK status.")
      .setColor(0x95fd91);
    await database.set(`${message.author.id} afkStatus`, "false");
    await message.reply(embed).catch(error => {});
    await message.member.setNickname(lastDisplayName).catch(error => {});
  }

  for(let i=0; i<=dirtyLinks.length-1; i++){
    if(content.includes(dirtyLinks[i])){
      await message.delete().catch(error => {});
      await message.member.kick().catch(error => {});
    }
  }
}