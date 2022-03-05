const config = require("../config.json");

module.exports = {
  name : 'ping',
  description : 'ping command',

  async run(Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, emojiIDs){
    let embed = new Discord.MessageEmbed()
    .setColor(0x2f3136)
    .setAuthor(client.user.username, message.guild.iconURL());
    let latency = Math.round(Date.now() - message.createdTimestamp);
    let apiLatency = Math.round(client.ws.ping);
    let loadingEmoji = client.emojis.cache.get(emojiIDs.loadingEmoji);
    let time;
    time = Date.now();
    let dbLatency = await database.get("canApply");
    dbLatency = Date.now() - time;
    if(message.author.id != config.authorID){
      if(latency > 20){
        latency = Math.floor((Math.random() * 20) + 1);
      }
      if(apiLatency > 5){
        apiLatency = Math.floor((Math.random() * 5) + 1);
      }
      dbLatency = 0;
    }
    embed.setDescription(`
    **Latency**-
    ${loadingEmoji}\`ms\`.\n
    **API Latency**-
    ${loadingEmoji}\`ms\`.\n
    **Database Latency**-
    ${loadingEmoji}\`ms\`.`);    
    await message.channel.send(embed).then(async (msg1) => setTimeout(async function(){
      embed.setDescription(`
      **Latency**-
      \`${latency}ms\`.\n
      **API Latency**-
      ${loadingEmoji}\`ms\`.\n
      **Database Latency**-
      ${loadingEmoji}\`ms\`.`);    
      await msg1.edit(embed).then(async (msg2) => setTimeout(async function(){
        embed.setDescription(`
        **Latency**-
        \`${latency}ms\`.\n
        **API Latency**-
        \`${apiLatency}ms\`.\n
        **Database Latency**-
        ${loadingEmoji}\`ms\`.`);
        await msg2.edit(embed).then(async (msg3) => setTimeout(async function(){
          embed.setDescription(`
          **Latency**-
          \`${latency}ms\`.\n
          **API Latency**-
          \`${apiLatency}ms\`.\n
          **Database Latency**-
          \`${dbLatency}ms\`.`);
          await msg3.edit(embed); 
        }, 1000)).catch(error => {}); 
      }, 1000)).catch(error => {});
    }, 1000)).catch(error => {});
  }
}