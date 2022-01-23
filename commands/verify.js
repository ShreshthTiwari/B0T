const Canvas = require("canvas");
const path = require('path');

module.exports = {
  name : 'verify',
  description : 'for verification',

  async run(Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, e){
    const cross = await client.emojis.cache.get(e.cross);
    let embed = new Discord.MessageEmbed()
    .setColor(0x98dbfa);
    let verificationText;
    const verifiedRoleID = await database.get('verifiedRoleID');
    const verificationChannelID = await database.get('verificationChannelID');
    let extraVerifiedRoleIDsList = await database.get("extraVerifiedRoleID");
    if((!verifiedRoleID) || (!verificationChannelID)){
      embed.setDescription(`${cross} Verification system not setup.`)
      await message.channel.send(embed).then((msg) => setTimeout(function(){msg.delete().catch(error => {});}, 20000)).catch(error => {});
      await message.delete().catch(error => {});
      return;
    }
    const verifiedRole = message.guild.roles.cache.get(verifiedRoleID);
    const verificationChannel = message.guild.channels.cache.get(verificationChannelID);
    if((!verifiedRole) || (!verificationChannel)){
      embed.setDescription(`${cross} Verification system not setup.`);
      await message.channel.send(embed).then((msg) => setTimeout(function(){msg.delete().catch(error => {});}, 20000)).catch(error => {});
      await message.delete().catch(error => {});
      return;
    }
    let verificationLogsChannelID, verificationLogsChannel;
    verificationLogsChannelID = await database.get("verificationLogsChannelID");
    if(verificationLogsChannelID){
      verificationLogsChannel = await message.guild.channels.cache.get(verificationLogsChannelID);
    }
    if(message.channel.id != verificationChannelID) return message.delete().catch(error => {});
    const accountCreatedDateString = new Date(message.author.createdTimestamp).toLocaleDateString();
    const accountCreatedDate = new Date(accountCreatedDateString);
    const guildJoinedDateString = new Date(message.member.joinedTimestamp).toLocaleDateString();
    const guildJoinedDate = new Date(guildJoinedDateString);
    const msTimeDiff = Math.round(Math.abs(guildJoinedDate - accountCreatedDate));
    let days = Math.round(msTimeDiff / (1000 * 60 * 60 * 24));
    let daysText = "day";
    if(message.member.roles.cache.has(verifiedRoleID)){
      verificationText = "Already Verified!";
    }
    else{
      if(days > 1){
        daysText = daysText + 's';
      }
      if(days < 15){
        let waitDays = 15-days;
        let waitDaysText = "day";
        if(waitDays > 1){
          waitDaysText = waitDaysText + 's';
        }
        embed.setAuthor(message.guild.name, message.guild.iconURL())
        .setDescription(`${cross} Couldn't verify your account as it is only \`${days}\` ${daysText} old.
        Account Created- \`${new Date(message.author.createdTimestamp).toLocaleDateString()}\`.
        Date Joined- \`${new Date(message.member.joinedTimestamp).toLocaleDateString()}\`.
        ------------
        Either ask the staff to verify you, or wait for \`${waitDays}\` ${waitDaysText}.
        ------------`)
        .setColor(0xff4747)
        .setThumbnail(message.author.displayAvatarURL({dynamic:true}));
        await message.author.send(embed).catch(error => {});
        embed.setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))
          .setDescription(`User- ${message.author}.
          Name- ${message.author.tag}.
          ID- ${message.author.id}.
          Account Created- ${new Date(message.author.createdTimestamp).toLocaleDateString()}.
          Date Joined- ${new Date(message.member.joinedTimestamp).toLocaleDateString()}.
          Result- Not verified. \`[${days} ${daysText} old]\``)
          .setColor(0xff4747)
          .setThumbnail(message.author.displayAvatarURL({dynamic: true}));
        if(verificationLogsChannel){
          await verificationLogsChannel.send(embed).catch(error => {});
        }
        await message.delete().catch(error => {});
        return;
      }
      try{
        await message.guild.members.cache.get(message.author.id).roles.add(verifiedRoleID).catch(error => {});
        if(extraVerifiedRoleIDsList){
          extraVerifiedRoleIDsList = extraVerifiedRoleIDsList.split(" ");
          for(let i=0; i<=extraVerifiedRoleIDsList.length-1; i++){
            await message.member.roles.add(extraVerifiedRoleIDsList[i]).catch(error => {});
          }
        }
        verificationText = "Successfully Verified!";
      }catch{
        embed.setDescription(`${cross} Couldn't verify you because you are higher than me.`);
        await message.channel.send(embed).then((msg) => setTimeout(function(){msg.delete().catch(error => {});}, 20000)).catch(error => {});
        await message.delete().catch(error => {});
        return;
      }
    }
    let ix = 1000;
    let iy = 350;
    const canvas = Canvas.createCanvas(ix,iy);
    const ctx = canvas.getContext('2d');  
    let background;
    let vimg = await database.get("vimg");
    if(!vimg){
      let n = await database.get("image number");
      if(!n){
        n = 0;
        await database.set("image number", n);
      }
      if(n >= 15 || n < 0)
        n = 0;
      n = n+1;
      await database.set("image number", n);  
      background = await Canvas.loadImage(
        path.join(__dirname, `../backgrounds/background ${n}.jpeg`)
      );
    }
    else{
      background = await Canvas.loadImage(vimg);
    }
    let x = 0;
    let y = 0;
    ctx.drawImage(background, x, y);
    const pfp = await Canvas.loadImage(
      message.guild.iconURL({
        format: 'png'
      })
    );
    x = canvas.width / 2 - pfp.width / 2;
    y = 25;
    ctx.drawImage(pfp, x, y);
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 40pt Arial';
    let text = verificationText;
    x = canvas.width / 2 - ctx.measureText(text).width / 2;
    ctx.fillText(text, x, 100 + pfp.height);
    const attachment = new Discord.MessageAttachment(canvas.toBuffer());
    message.author.send('', attachment).catch(error => {/*nothing DMS are off or blocked*/});
    if(verificationLogsChannel && verificationText != "Already Verified!"){
      embed.setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))
        .setDescription(`User- ${message.author}.
        Name- ${message.author.tag}.
        ID- ${message.author.id}.
        Account Created- ${new Date(message.author.createdTimestamp).toLocaleDateString()}.
        Date Joined- ${new Date(message.member.joinedTimestamp).toLocaleDateString()}.
        Result- Verified. \`[${days} ${daysText} old]\``)
        .setColor(0x95fd91)
        .setThumbnail(message.author.displayAvatarURL({dynamic: true}));
      await verificationLogsChannel.send(embed).catch(error => {});
    }
    await message.delete().catch(error => {});
  }
}