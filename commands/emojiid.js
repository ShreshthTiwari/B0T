module.exports = {
  name : 'emojiid',
  description : 'to get ID of an emoji',
  alias: ["eid"],

  async run(Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, emojiIDs){
    const tick = await client.emojis.cache.get(emojiIDs.tick);
    const cross = await client.emojis.cache.get(emojiIDs.cross);
    let embed = new Discord.MessageEmbed()
      .setColor(0xff4747);
    if(!message.member.hasPermission("ADMINISTRATOR")){
      await message.reactions.removeAll();
      react(message, '❌');
      return;
    }
    let emojiName;
    if(args[0] && args[0].startsWith(':') && args[0].endsWith(':')){
      emojiName = args[0].slice(1, -1);
    }
    else{
      embed.setDescription(`${cross} Please provide emoji name as \`:<emoji_name>:\`.`);
      await message.channel.send(embed).catch(error => {});
      await message.reactions.removeAll();
      react(message, '❌');
      return;
    }
    let emoji = client.emojis.cache.find(emojiIDs => emojiIDs.name == emojiName);
    if(emoji){
      await message.channel.send(`${emoji} [\`${emoji.id}\`]`).catch(error => {});
    }
    else{ 
      embed.setDescription(`${cross} No emoji found with name \`${args[0]}\`.`);
      await message.channel.send(embed).catch(error => {});
      await message.reactions.removeAll();
      react(message, '❌');
      return;
    }
  }
}