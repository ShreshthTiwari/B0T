module.exports = {
  name : 'leveltop',
  description : 'to check level leaderboard',

  async run(Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, e){
    const tick = await client.emojis.cache.get(e.tick);
    const cross = await client.emojis.cache.get(e.cross);
    let embed = new Discord.MessageEmbed()
      .setTitle("Level Top List")
      .setColor(0x98dbfa);
    let membersIDMapTemp = message.guild.members.cache
      .filter(m => !m.user.bot)
      .sort((a, b) => b.position - a.position)
      .map(r => r.id);
    let rank = membersIDMapTemp.length; 
    if(membersIDMapTemp.length <= 0){
      embed.setDescription(`${cross} Empty.`)
        .setColor(0xff4747);
      await message.channel.send(embed).catch(error => {});
      await message.reactions.removeAll();
      react(message, '❌');
      return;
    }
    let membersIDTempMap = [];
    for(let i=0; i<=membersIDMapTemp.length-1; i++){
      membersIDTempMap[i] = membersIDMapTemp[i];
    }
    let levelsMap = [];
    let membersIDMap = [];
    let index = 0;
    for(let i=0; i<=membersIDTempMap.length-1; i++){
      let level = await database.get(`${membersIDTempMap[i]} lvl`);
      let points;
      if((!level) || isNaN(level) || (level < 1)){
        level = 1;
      }
      if(level <= 1){
        points = await database.get(`${membersIDTempMap[i]} points`) * 1.0;
      }
      if(level > 1 || points > 1){
        levelsMap[index] = level;
        membersIDMap[index++] = membersIDTempMap[i];
        await database.set(`${membersIDMap[i]} lvl`, level);
      }
    }

    let temp;
    for(let i=0; i<=levelsMap.length-1; i++){
      for(let j=0; j<=levelsMap.length-1-i; j++){
        if(levelsMap[j] < levelsMap[j+1]){
          temp = levelsMap[j];
          levelsMap[j] = levelsMap[j+1];
          levelsMap[j+1] = temp;
          temp = membersIDMap[j];
          membersIDMap[j] = membersIDMap[j+1];
          membersIDMap[j+1] = temp;
        }
      }
    }

    for(let i=0; i<=membersIDMap.length-1; i++){
      if(message.author.id == membersIDMap[i]){
        rank = i+1;
      }
      await database.set(`${membersIDMap[i]} rank`, i+1);
    }

    if(rank == 1){
      rank = `\`#${rank}\`` + "🥇";
    }else if(rank == 2){
      rank = `\`#${rank}\`` + "🥈";
    }else if(rank == 3){
      rank = `\`#${rank}\`` + "🥉";
    }else{
      rank = `\`#${rank}\``;
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
        if(((((page-1)*10)+1) > membersIDMap.length)){
          page = 1;
        }else{
          start += (page-1)*10;
          stop += (page-1)*10;
        }
      }
    }
    if(stop > membersIDMap.length-1){
      stop = membersIDMap.length-1;
    }
    let topLevelsMap = [];
    let coinText = "coin";
    for(let i=start; i<=stop; i++){
      coinText = "coin";
      let coins = await database.get(`${membersIDMap[i]} coins`);
      if(coins > 1){
        coinText += "s";
      }
      topLevelsMap[i] = `> ${i+1}. <@${membersIDMap[i]}> » Level ${levelsMap[i]}. [${coins.toFixed(3)} ${coinText}]`;
    }
    topLevelsList = topLevelsMap.join("\n");
    if((!topLevelsList) || topLevelsList == ""){
      topLevelsList = "The list is empty, you must start chatting to level up and get yourself ranked here."
    }else{
      topLevelsList = topLevelsList + `\n\n**Your Rank**- ${rank}`;
    }
    embed.setAuthor(`${membersIDMap.length} Members`)
      .setDescription(topLevelsList)
      .setFooter(`Page- ${page}/${Math.floor(membersIDMap.length/10)+1}`);
    await message.channel.send(embed).catch(error => {});
  }
}