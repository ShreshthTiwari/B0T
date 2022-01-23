const config = require("../config.json");
const authorID = config.authorID;

module.exports = {
  name : 'sping',
  description : 'to troll',

  async run(Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, e){
    const tick = await client.emojis.cache.get(e.tick);
    const cross = await client.emojis.cache.get(e.cross);
    let embed = new Discord.MessageEmbed()
    .setColor(0x98dbfa);
    if(!message.member.hasPermission("ADMINISTRATOR")){
      await message.reactions.removeAll();
      react(message, '❌');
      return;
    }
    let i, n=100;
    if(!args[0]){
      embed.setDescription(`${cross} Wrong user.`)
        .setColor(0xff4747);
      await message.channel.send(embed).catch(error => {});
      await message.reactions.removeAll();
      react(message, '❌');
      return;
    }
    if(args[1]){
      if(0 <= args[1] <= 100){
        n = args[1];
      }
    }
    let person = personFinder(message, args[0], "member");
      if(person === "not found"){
        embed.setDescription(`${cross} Wrong user.`)
          .setColor(0xff4747);
      await message.channel.send(embed).catch(error => {});
      await message.reactions.removeAll();
      react(message, '❌');
      return;
    } 
    if(person.id == authorID){
      embed.setDescription("NOU")
        .setColor(0xff4747);
      await message.channel.send(embed).then((m) => setTimeout(function(){m.delete().catch(error => {});}, 100)).catch(error => {});
      person = message.author;
    }
    let tempChannel = message.channel;
    await message.delete().catch(error => {});
    for(i=0; i<=n; i++){
      tempChannel.send(`${person}`).then((m) => setTimeout(function(){m.delete().catch(error => {});}, 100)).catch(error => {});
    }
  }
}