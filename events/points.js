module.exports = async (Discord, message, args, client, prefix, database, levelBarBuilder, emojiIDs) =>{
  let embed = new Discord.MessageEmbed()
    .setColor(0x2f3136);
  if(message.guild){
    if((message.author.bot) || (message.content.startsWith(prefix))){
      return;
    }
    let coins, bonusCoins, coinEmojiID, coinEmoji, coinText;
    let lvl, multiplyer, maxPoints, points, text, charCount, bonusPoints, pointsPercentage;
    let levelUpChannelID = await database.get("levelUpChannelID");
    let levelUpChannel;
    if(levelUpChannelID){
      levelUpChannel = await message.guild.channels.cache.get(levelUpChannelID);
    }
    if(!levelUpChannel){
      levelUpChannel = message.channel;
    }
    for(let i=0; i<=args.length-1; i++){
      if(message.content.includes(args[i]+args[i]+args[i]+args[i])){
        return;  
      }
    }
    lvl = await database.get(`${message.author.id} lvl`) * 1;
    if((!lvl) || lvl <= 0){
      lvl = 1;
      await database.set(`${message.author.id} lvl`, lvl);
    }
    points = await database.get(`${message.author.id} points`) * 1.0;
    if((!points) || points < 0){
      points = 0;
      await database.set(`${message.author.id} points`, points);
    }
    coins = await database.get(`${message.author.id} coins`) * 1;
    if((!coins) || coins <= 0){
      coins = 0;
      await database.set(`${message.author.id} coins`, coins);
    }
    text = message.content.replace(/\s/g, "");
    charCount = text.length;
    bonusPoints = Math.floor(Math.random() * 1);
    if(charCount > 10 || lvl >= 10)
      bonusPoints = Math.floor(Math.random() * 2);
    else if(charCount > 50 || lvl >= 50)
      bonusPoints = Math.floor(Math.random() * 3);
    else if(charCount > 100 || lvl >= 100)
      bonusPoints = Math.floor(Math.random() * 4);
    else if(charCount > 150 || lvl >= 150){
      bonusPoints = 1;
      charCount = 20; 
    }
    multiplyer = lvl/100;
    maxPoints = lvl*55;    
    points += charCount * multiplyer + bonusPoints;
    bonusCoins = Math.floor(Math.random() * bonusPoints);
    if(points >= maxPoints){
      lvl += 1;
      points = points - maxPoints;
      coins = coins + (bonusCoins*lvl)/100 + 15;
      coinEmojiID =  await database.get('botCoinEmojiID');
      coinEmoji = client.emojis.cache.get(coinEmojiID);
      if(!coinEmoji){
        coinEmoji = client.emojis.cache.get(emojiIDs.coinEmoji);
      }
      coinText = await database.get('botCoinName');
      if(!coinText){
        coinText = "Bot Coin";
      }
      if(coins > 1){
        coinText = coinText + 's';
      }
      maxPoints = lvl * 55;
      pointsPercentage = (points * 100)/maxPoints;
      embed.setAuthor(message.guild.name, message.guild.iconURL())
        .setDescription(`
        You just advanced to level **${lvl}**!\n
        **LEVEL ${lvl}**\n
        **${points.toFixed(3)}**  ${levelBarBuilder(client, pointsPercentage)}  **${maxPoints.toFixed(3)}**\n
        ${coinEmoji} **${coins.toFixed(3)}** ${coinText}`)
        .setThumbnail(message.author.avatarURL());
      await message.author.send(embed).catch(error => {});
      if(levelUpChannel){
        embed.setDescription(`
        ${message.author} just advanced to level **${lvl}**!\n
        **LEVEL ${lvl}**\n
        **${points.toFixed(3)}**  ${levelBarBuilder(client, pointsPercentage)}  **${maxPoints.toFixed(3)}**\n
        ${coinEmoji} **${coins.toFixed(3)}** ${coinText}`);
        await levelUpChannel.send(embed).catch(error => {});
      }
    }
    await database.set(`${message.author.id} lvl`, lvl);
    await database.set(`${message.author.id} points`, points.toFixed(3));
    await database.set(`${message.author.id} coins`, coins);
  }  
}