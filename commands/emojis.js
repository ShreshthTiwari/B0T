module.exports = {
  name : 'emojis',
  description : 'list of emojis bot has access to',

  async run(Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, emojiIDs){
    let embed = new Discord.MessageEmbed()
      .setColor(0x98dbfa);
    if(!message.member.hasPermission("ADMINISTRATOR")){
      await message.reactions.removeAll();
      react(message, '❌');
      return;
    }
    let guildIDsMap = client.guilds.cache
      .sort((a, b) => b.position - a.position)
      .map(g => g.id);
    let emojis = [];
    let emojiNames = [];
    let indexEmojiNames = 0;
    let indexEmojis = 0;
    for(let i=0; i<=guildIDsMap.length-1; i++){
      let guild = client.guilds.cache.get(guildIDsMap[i]);
      if(guild){
        let emojiNamesMap = guild.emojis.cache
          .sort((a, b) => b.position - a.position)
          .map(emojiIDs => emojiIDs.name);
        let emojisMap = guild.emojis.cache
          .sort((a, b) => b.position - a.position)
          .map(emojiIDs => emojiIDs.id);
        for(let j=0; j<=emojisMap.length-1; j++){
          emojiNames[indexEmojiNames] = emojiNamesMap[j];
          emojis[indexEmojis] = emojisMap[j];
          ++indexEmojiNames;
          ++indexEmojis;
        }
      }
    }
    let emojiName1, emojiName2, temp;
    for(let i=0; i<=emojiNames.length-2; i++){
      for(let j=0; j<=emojiNames.length-2-i; j++){
        emojiName1 = emojiNames[j];
        if(emojiName1.charAt(0) >= "A" && emojiName1.charAt(0) <= "Z"){
          emojiName1 = emojiName1.toLowerCase();
        }
        emojiName2 = emojiNames[j+1];
        if(emojiName2.charAt(0) >= "A" && emojiName2.charAt(0) <= "Z"){
          emojiName2 = emojiName2.toLowerCase();
        }
        if(emojiNames[j].charAt(0) > emojiNames[j+1].charAt(0)){
          temp = emojiNames[j];
          emojiNames[j] = emojiNames[j+1];
          emojiNames[j+1] = temp;
          temp = emojis[j];
          emojis[j] = emojis[j+1];
          emojis[j+1] = temp;
        }
      }
    }
    let page = 1;
    let start = 0;
    let stop = 9;
    if(args[0] && (!isNaN(args[0]))){
      page = args[0] * 1;
      if(page < 1){
        page = 1;
      }
      else if(page > 1){
        if(((((page-1)*10)+1) > emojis.length)){
          page = 1;
        }else{
          start += (page-1)*10;
          stop += (page-1)*10;
        }
      }
    }
    if(stop > emojis.length-1){
      stop = emojis.length-1;
    }
    let emojisMap = [];
    let emoji;
    for(let i=start; i<=stop; i++){
      emoji = client.emojis.cache.get(emojis[i]);
      emojisMap[i] = `${i+1}. ${emoji} » \`:${emojiNames[i]}:\` [\`${emoji.id}\`]`;
    }
    emojisList = emojisMap.join("\n");
    embed.setAuthor(`${emojis.length} Emojis`)
      .setTitle("Emojis List")
      .setDescription(emojisList)
      .setFooter(`Page- ${page}/${Math.floor(emojis.length/10)+1}`);
    await message.channel.send(embed).catch(async error => {});
  }
}