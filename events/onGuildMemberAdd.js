module.exports = async(Discord, Keyv, member, Canvas, path, database) =>{
  let embed = new Discord.MessageEmbed()
    .setColor(0xff4747);
  let moderateNewUserNames = await database.get("moderateNewUserNames");
  if(!moderateNewUserNames){
    moderateNewUserNames = false;
    await database.set("moderateNewUserNames", moderateNewUserNames);
  }

  if(moderateNewUserNames){
    const gDB = new Keyv('sqlite://./databases/database.sqlite', {
      table: `gDB`
    });
    gDB.on('error', err => console.log('Connection Error', err));
    let count = await gDB.get("illegalNamesCount");
    if(!count){
      count = 0;
      await gDB.set("illegalNamesCount", count);
    }
    const ascii = /^[ -~]+$/;
    if(!ascii.test(member.displayName)){
      let oldName = member.displayName;
      await member.setNickname(`moderated-${++count}`);
      let newName = member.displayName;
      await gDB.set("illegalNamesCount", count);
      embed.setAuthor(member.guild.name, member.guild.iconURL())
      .setDescription(`Your name [${oldName}] contains illegal characters.\nSo i have changed it to [${newName}].\nKindly ask a server staff to change it now.`);
      await member.send(embed).catch(error => {});
    }
  }

  let memberJoinLogsChannelID = await database.get("memberJoinLogsChannelID");
  if(memberJoinLogsChannelID){
    let memberJoinLogsChannel = await member.guild.channels.cache.get(memberJoinLogsChannelID);
    if(memberJoinLogsChannel){
      embed = new Discord.MessageEmbed()
        .setTitle("New Member Joined")
        .setDescription(`**User**- ${member.user}.
        **Name**- \`${member.user.tag}\`.
        **ID**- \`${member.user.id}\`.`)
        .setThumbnail(member.user.displayAvatarURL())
        .setColor(0x95fd91);
      await memberJoinLogsChannel.send(embed).catch(error => {});
    }
  }

  const type = "Welcome";
  const wlCanvasBuilder = require('../builders/wlCanvasBuilder.js');
  wlCanvasBuilder(Discord, member, Canvas, path, database, type);
}