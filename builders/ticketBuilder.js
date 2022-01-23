const e = require("../emojiIDs.json");

module.exports = async(Discord, client, message, database, fs, path, date, ticketReason, person, staffRoleID) => {
  const tick = await client.emojis.cache.get(e.tick);
  const cross = await client.emojis.cache.get(e.cross);
  let embed = new Discord.MessageEmbed()
    .setColor(0x98dbfa);
  async function ticketCreator(ticketTypeSelector, ticketType, ticketTitle, ticketTypeText){
    let directoryLocation = path.join(__dirname, "..", "transcripts", `${message.guild.id}`);
    await fs.mkdir(directoryLocation, { recursive: true }, (err) => {});
    let tempChannel, logFileLocation;
    tempChannel = message.guild.channels.cache.find(ch => ch.name === `${ticketType}-${message.author.id}`);
    if(tempChannel){
      embed.setDescription(`${cross} Please close ${tempChannel} first.`)
        .setColor("RED");       
      await message.channel.send(embed).then((msg) => setTimeout(function(){msg.delete().catch(error => {});}, 10000)).catch(error => {});
      await ticketTypeSelector.delete().catch(error => {});
      await message.delete().catch(error => {});
      return;
    }
    let normalTicketCategoryID = await database.get("normalTicketCategoryID");
    let bugTicketCategoryID = await database.get("bugTicketCategoryID");
    let reportTicketCategoryID = await database.get("reportTicketCategoryID");
    let priorityTicketCategoryID = await database.get("priorityTicketCategoryID"); 
    let priorityTicketRoleID = await database.get("priorityTicketRoleID");
    let priorityTicketRole;
    let ticketChannel;
    if(priorityTicketCategoryID){
      if(priorityTicketRoleID){
        priorityTicketRole = await message.guild.roles.cache.get(priorityTicketRoleID);
        if(priorityTicketRole){
          if(message.member.roles.cache.has(priorityTicketRoleID)){
            normalTicketCategoryID = bugTicketCategoryID = reportTicketCategoryID = priorityTicketCategoryID;
          }
        }
      }
    }
    if(ticketType == "ticket" && normalTicketCategoryID){
      ticketChannel = await message.guild.channels.create(`${ticketType}-${person}`);
      await ticketChannel.setParent(normalTicketCategoryID);
    }
    else if(ticketType == "bug" && bugTicketCategoryID){
      ticketChannel = await message.guild.channels.create(`${ticketType}-${person}`);
      await ticketChannel.setParent(bugTicketCategoryID);
    }
    else if(ticketType == "report" && reportTicketCategoryID){
      ticketChannel = await message.guild.channels.create(`${ticketType}-${person}`);
      await ticketChannel.setParent(reportTicketCategoryID);
    }
    else{
      ticketChannel = await message.guild.channels.create(`${ticketType}-${person}`);
    }  
    await ticketChannel.updateOverwrite(message.guild.id, {
      VIEW_CHANNEL: false,
      SEND_MESSAGES: false
    });
    await ticketChannel.updateOverwrite(message.author.id, {
      VIEW_CHANNEL: true,
      SEND_MESSAGES: true,
      EMBED_LINKS: true,
      ATTACH_FILES: true,
      READ_MESSAGE_HISTORY: true,
      USE_EXTERNAL_EMOJIS: true
    });
    await ticketChannel.updateOverwrite(staffRoleID, {
      VIEW_CHANNEL: true,
      SEND_MESSAGES: true,
      EMBED_LINKS: true,
      ATTACH_FILES: true,
      READ_MESSAGE_HISTORY: true,
      USE_EXTERNAL_EMOJIS: true
    });
    embed.setAuthor(`By- ${message.author.username}`)
      .setThumbnail(message.author.displayAvatarURL())
      .setColor(0x2f3136)
      .setTitle(ticketTitle)
      .setDescription(`ID- ${message.author.id}
        Tag- ${message.author.tag}
        Reason- ${ticketReason}`);
    directoryLocation = path.join(__dirname, "..", "transcripts", `${message.guild.id}`);
    await fs.mkdir(directoryLocation, { recursive: true }, (err) => {});
    logFileLocation = path.join(__dirname, "..", "transcripts", `${message.guild.id}`, `${ticketType}-${message.author.id}.txt`);  
    await fs.appendFileSync(logFileLocation, `-------------------------------------------\nUser -> ${message.author.tag + ' || ' + message.author.id}.\nType -> ${ticketTypeText}.\nReason -> ${ticketReason}.\nDate Opened -> ${date}.\n-------------------------------------------\n`);    
    await ticketChannel.send(embed).catch(error => {});
    await ticketChannel.send(`<@${message.author.id}> <@&${staffRoleID}>`).then((msg) => setTimeout(function(){msg.delete().catch(error => {});}, 500)).catch(error => {});
    
    embed = new Discord.MessageEmbed()
    .setColor(0x98dbfa);
    embed.setDescription(`${tick} Ticket opened.`)
      .setColor(0x95fd91);
    await message.channel.send(embed).then((msg) => setTimeout(function(){msg.delete().catch(error => {});}, 10000)).catch(error => {});
    await ticketTypeSelector.delete().catch(error => {});
    await message.delete().catch(error => {});  
  }
  embed.setTitle("**Ticket Type**")
    .setDescription("1️⃣ Normal ticket.\n2️⃣ Bug Report.\n3️⃣ Player Report.\n❌ Close.");
  let ticketTypeSelector = await message.channel.send(embed).catch(error => {});
  embed = new Discord.MessageEmbed()
    .setColor(0x98dbfa);
  await ticketTypeSelector.react('1️⃣').then(
    ticketTypeSelector.react('2️⃣'),
    ticketTypeSelector.react('3️⃣'),
    ticketTypeSelector.react('❌')
  );
  ticketTypeSelector.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == '1️⃣' || reaction.emoji.name == '2️⃣' || reaction.emoji.name == '3️⃣' || reaction.emoji.name == '❌'),
    { max: 1, time: 30000 }).then(async collected => {
      if (collected.first().emoji.name == '1️⃣') {
        ticketCreator(ticketTypeSelector, 'ticket', 'New Ticket', 'Normal Ticket');
      }
      else if (collected.first().emoji.name == '2️⃣') {
        ticketCreator(ticketTypeSelector, 'bug', 'Bug Report', 'Bug Report Ticket');
      }
      else if (collected.first().emoji.name == '3️⃣') {
        ticketCreator(ticketTypeSelector, 'report', 'Player Report', 'Player Report Ticket');
      } 
      else{
        await ticketTypeSelector.delete().catch(error => {});
        await message.delete().catch(error => {});
      }
    }).catch(async() => {
      await ticketTypeSelector.delete().catch(error => {});
      await message.delete().catch(error => {});
  });
}