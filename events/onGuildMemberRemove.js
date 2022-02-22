module.exports = async(Discord, member, Canvas, path, database) =>{

  let memberLeaveLogsChannelID = await database.get("memberLeaveLogsChannelID");
  if(memberLeaveLogsChannelID){
    let memberLeaveLogsChannel = await database.get("memberLeaveLogsChannelID");
    if(memberLeaveLogsChannel){
      embed.setTitle("Member Left")
        .setDescription(`**User**- ${message.author}.
        **Name**- \`${message.author.tag}\`.
        **ID**- \`${message.author.id}\`.`)
        .setColor(0x95fd91);
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