module.exports = {
  name : 'msg',
  description : 'to dm someone',

  async run(Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, emojiIDs){
    const tick = await client.emojis.cache.get(emojiIDs.tick);
    const cross = await client.emojis.cache.get(emojiIDs.cross);
    let embed = new Discord.MessageEmbed()
    .setColor(0x98dbfa);
    if(!message.member.hasPermission("ADMINISTRATOR")){
      await message.reactions.removeAll();
      react(message, '❌');
      return;
    }
    reciever = personFinder(message, args[0], "user");
    if(!reciever){
      embed.setDescription(`${cross} Wrong user.`)
      .setColor(0xff4747);
      await message.channel.send(embed).catch(error => {});
      await message.reactions.removeAll();
      react(message, '❌');
      return;
    }  
    if(reciever.id == client.user.id){
      embed.setDescription(`${cross} Really?`)
      .setColor(0xff4747);
      await message.channel.send(embed).catch(error => {});
      await message.reactions.removeAll();
      react(message, '❌');
      return;
    }
    let msg = messageEmojiFinder(client, message, args.slice(1));
    msg = msg + `\n-${message.guild}`;
    embed.setDescription(`${tick} Messaged ${reciever}`)
    .setColor(0x95fd91);
    let embd = await message.channel.send(embed).catch(error => {});
    reciever.send(msg).catch( error =>{
      embed.setDescription(`${cross} Message not sent.`)
      .setColor(0xff4747);
      embd.edit(embed).catch(error => {});
      message.reactions.removeAll();
      react(message, '❌');
    });
  }
}