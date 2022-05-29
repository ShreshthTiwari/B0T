module.exports = {
  name: "clear",
  description: "Clears messages",
  alias: ["purge"],

  async run (Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, emojiIDs) {
    const tick = await client.emojis.cache.get(emojiIDs.tick);
    const cross = await client.emojis.cache.get(emojiIDs.cross);
    let embed = new Discord.MessageEmbed()
    .setColor(0x98dbfa);
    if(!message.member.hasPermission("ADMINISTRATOR")){
      await message.reactions.removeAll();
      react(message, '❌');
      return;
    }
    let amount = args[0];
    if((!amount) || isNaN(amount)){
      embed.setDescription(`${cross} How many messages?`)
      .setColor(0xff4747);
      await message.channel.send(embed).then((msg) => setTimeout(function(){msg.delete().catch(error => {});}, 5000)).catch(error => {});
      await message.reactions.removeAll();
      react(message, '❌');
      return;
    } 
    if(amount < 0){
      amount *= -1;
    }
    else if(amount == 0){
      embed.setDescription(`${cross} At least 1 message required.`)
      .setColor(0xff4747);
      await message.channel.send(embed).then((msg) => setTimeout(function(){msg.delete().catch(error => {});}, 5000)).catch(error => {});
      await message.reactions.removeAll();
      react(message, '❌');
      return;
    } 
    if(amount > 100){
      embed.setDescription(`${cross} Cannot delete more than 100 messages at a time.`)
      .setColor(0xff4747);
      await message.channel.send(embed).then((msg) => setTimeout(function(){msg.delete().catch(error => {});}, 5000)).catch(error => {});
      await message.reactions.removeAll();
      react(message, '❌');
      return;
    } 
    embed.setDescription(`${tick} Removing ${amount} messages!`)
    .setColor(0x95fd91);
    await message.channel.messages.fetch({limit: amount}).then(async messages => {
      message.channel.bulkDelete(messages).catch(async er => {
        embed.setDescription(`${cross} Error while cleaning, maybe they are more than 14 days old.`)
        .setColor(0xff4747);
        await message.channel.send(embed).then((msg) => setTimeout(function(){msg.delete().catch(error => {});}, 5000)).catch(error => {});
        await message.delete().catch(error => {});
        return;
      })
      await message.channel.send(embed).then((msg) => setTimeout(function(){msg.delete().catch(error => {});}, 5000)).catch(error => {});
      await message.delete().catch(error => {});
    });
  }
}