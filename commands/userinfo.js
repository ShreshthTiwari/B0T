module.exports = {
  name : 'userinfo',
  description : 'to get user info',
  alias: ["info"],

  async run(Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, emojiIDs){
    let embed = new Discord.MessageEmbed()
      .setColor(0x2f3136);
    let person = message.author;
    let member = message.member;
    if(args[0]){
      person = personFinder(message, args[0], "user");
      member = personFinder(message, args[0], "member");
      if(!person){
        person = message.author;
        member = message.member;
      }
    }
    let rolemap = member.roles.cache
      .sort((a, b) => b.position - a.position)
      .map(r => r);
    let roleMap = [];
    let extraText = ".";
    let n;
    if(!rolemap){ 
      roleMap = "No roles";
    }else{
      n = rolemap.length;
      if(n>10){
        extraText = ` **+ __${n-10}__ roles**.`
        n = 10;
      }
      for(let i=0; i<=n-1; i++){
        roleMap[i] = rolemap[i];
      }
      roleMap = roleMap.join(", ");
      roleMap = roleMap + extraText;
    }
    embed.setAuthor(`User info for ${person.username}`, person.displayAvatarURL({dynamic: true}))
      .addFields(
        {
          name: "User Tag",
          value: person.tag
        },
        {
          name: "User ID",
          value: person.id 
        },
        {
          name: "Is Bot",
          value: person.bot
        },
        {
          name: "Nickname",
          value: member.nickname || person.username
        },
        {
          name: "Account Created",
          value: new Date(person.createdTimestamp).toLocaleDateString()
        },
        {
          name: "Joined Server",
          value: new Date(member.joinedTimestamp).toLocaleDateString()
        },
        {
          name: `Roles [${member.roles.cache.size}] `,
          value: roleMap
        }
      )
      .setThumbnail(person.displayAvatarURL({dynamic: true}))
    message.channel.send(embed).catch(error => {}); 
  }
}      