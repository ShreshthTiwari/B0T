module.exports = {
  name : 'members',
  description : 'member count of the server',

  async run(Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, emojiIDs){
    let embed = new Discord.MessageEmbed()
    .setColor(0x98dbfa);
    if(!message.member.hasPermission("ADMINISTRATOR")){
      await message.reactions.removeAll();
      react(message, '❌');
      return;
    }
    let membersmap = message.guild.members.cache
    .sort((a, b) => b.position - a.position)
    .map(r => r);
    let membersMap = [];
    let extraText = ".";
    let n;
    if(!membersmap){ 
      roleMap = "No members";
    }else{
      n = membersmap.length;
      if(n>50){
        extraText = ` **+ __${n-50}__ members**.`
        n = 50;
      }
      for(let i=0; i<=n-1; i++){
        membersMap[i] = membersmap[i];
      }
      membersMap = membersMap.join("\n> ");
      membersMap = membersMap + extraText;
    }      
    embed.setTitle(`${membersmap.length} Members`)
    .setDescription(`> ${membersMap}`);     
    await message.channel.send(embed).catch(error => {});
    }
}