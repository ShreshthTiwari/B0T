module.exports = {
  name : 'coins',
  description : 'to get coins info',

  async run(Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, e){
    const tick = await client.emojis.cache.get(e.tick);
    const cross = await client.emojis.cache.get(e.cross);
    let embed = new Discord.MessageEmbed()
      .setColor(0x98dbfa);
    const coinEmojiID =  await database.get('botCoinEmojiID');
    let coinEmoji = client.emojis.cache.get(coinEmojiID);
    let coinText = await database.get('botCoinName');
    if(!coinEmoji){
      coinEmoji = client.emojis.cache.get(e.coinEmoji);
    }
    if(!coinText){
      coinText = "Bot Coin";
    }
    let person, coins; 
    if(!args[0]){
      coins = await database.get(`${message.author.id} coins`);
      if(!coins){
        coins = 0;
        await database.set(`${message.author.id} coins`, coins);
      }
      if(coins > 1)
        coinText = coinText + 's';
      embed.setAuthor(message.author.username)
        .setDescription(`${coinEmoji} **${coins.toFixed(2)}** ${coinText}`)
        .setThumbnail(message.author.displayAvatarURL());
      await message.channel.send(embed).catch(error => {});
    }else{
      person = personFinder(message, args[0], "user");
      if(!person){
        embed.setDescription(`${cross} Wrong user.`)
          .setColor(0xff4747);
        await message.channel.send(embed).catch(error => {});
        await message.reactions.removeAll();
        react(message, '❌');
        return;
      }  
      coins = await database.get(`${person.id} coins`);
      if(!coins){
        coins = 0;
        await database.set(`${person.id} coins`, coins);
      }
      if(coins > 1)
        coinText = coinText + 's';
      embed.setAuthor(person.username, person.displayAvatarURL())
        .setDescription(`${coinEmoji} **${coins.toFixed(3)}** ${coinText}`)
        .setThumbnail(person.displayAvatarURL());
      await message.channel.send(embed).catch(error => {});
    }
  }
}