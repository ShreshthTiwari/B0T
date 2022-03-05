module.exports = async(Discord, member, Canvas, path, database) =>{
  let embed = new Discord.MessageEmbed()
  .setColor(0xff4747);
  let memberLeaveLogsChannelID = await database.get("memberLeaveLogsChannelID");
  if(memberLeaveLogsChannelID){
    let memberLeaveLogsChannel = await member.guild.channels.cache.get(memberLeaveLogsChannelID);
    if(memberLeaveLogsChannel){
      embed.setTitle("Member Left")
      .setDescription(`**User**- ${member.user}.
      **Name**- \`${member.user.tag}\`.
      **ID**- \`${member.user.id}\`.`)
      .setThumbnail(member.user.displayAvatarURL())
      .setColor(0xff4747);
      await memberLeaveLogsChannel.send(embed).catch(error => {});
    } 
  }

  const type = "Good Bye";  
  const wlCanvasBuilder = require('../builders/wlCanvasBuilder.js');
  wlCanvasBuilder(Discord, member, Canvas, path, database, type);
  await database.delete(`${member.id} points`);
  await database.delete(`${member.id} lvl`);
  await database.delete(`${member.id} coins`);
  await database.delete(`${member.id} rank`);
}