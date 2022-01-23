const util = require('minecraft-server-util');

module.exports = {
  name : 'status',
  description : 'status of MC server.',

  async run(Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, e){
    const tick = await client.emojis.cache.get(e.tick);
    const cross = await client.emojis.cache.get(e.cross);
    let embed = new Discord.MessageEmbed()
      .setColor(0x2f3136);
    let IP = await database.get("IP");
    const numericIP = await database.get("numericIP");
    let Port = Number(await database.get("port"));  
    if((!Port) || isNaN(Port)){
      Port = 25565;
    }
    if(numericIP && Port){
      if(!IP){
        IP = numericIP;
      }
      try{
        const rawData = await util.status(numericIP, { port: Port}).then(response => {
          return [response, response.port, response.version, response.onlinePlayers, response.maxPlayers, response.description.descriptionText, response.favicon];
        });
        if(rawData){
          function edit(data){
            let rawData = data.split("");
            let finalData = [];
            let index = 0;
            for(let i=0; i<=rawData.length-1; i++){
              if(rawData[i] == '§'){
                i++;
              }else{
                finalData[index] = rawData[i];
                index++;
              }
            }
            return finalData.join("");
          }
          let version = edit(rawData[2]);
          let playing = rawData[3];
          let total = rawData[4];
          let description = edit(rawData[5]);
          embed.setAuthor(`${message.guild.name}`, message.guild.iconURL())
            .addFields({
              name: "> IP",
              value: `\`\`\`\n${IP}\n\`\`\``
            },
            {
              name: "> PORT",
              value: `\`\`\`\n${Port}\n\`\`\``
            },
            {
              name: "> VERSION",
              value: `\`\`\`\n${version}\n\`\`\``
            },
            {
              name: "> PLAYING",
              value: `\`\`\`\n${playing}/${total}\n\`\`\``
            },{
              name: "> MOTD",
              value: `\`\`\`\n${description}\n\`\`\``
            })
            .setThumbnail("https://cdn.discordapp.com/emojis/913429376215961610.gif?size=4096");
        }else{
          embed.setAuthor(`🔴${message.guild.name}`, message.guild.iconURL())
            .setTitle("OFFLINE")
            .setColor(0xff4747)
            .setThumbnail("https://cdn.discordapp.com/emojis/913434792677228544.gif?size=4096");
        }
      }catch{
        embed.setDescription(`${cross} Error connecting.`)
          .setColor(0xff4747);
        await message.reactions.removeAll();
        react(message, '❌');
      }
      await message.channel.send(embed).catch(error => {});
    }
    else{
      embed.setDescription(`${cross} invalid IP and Port.`)
        .setColor(0xff4747);
      await message.channel.send(embed).catch(error => {});
      await message.reactions.removeAll();
      react(message, '❌');
    }
  }
}