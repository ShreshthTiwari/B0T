const Keyv = require("keyv");
const config = require("../config.json");

let coolDownList = [];

module.exports = {
  name: "ad",
  description: "advertise your server",
  
  async run (Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, emojiIDs) {
    const tick = await client.emojis.cache.get(emojiIDs.tick);
    const cross = await client.emojis.cache.get(emojiIDs.cross);
    let embed = new Discord.MessageEmbed()
    .setColor(0x98dbfa);
    let advertisementEmbed = new Discord.MessageEmbed()
    .setColor(0x98dbfa);

    for(let i=0; i<=coolDownList.length-1; i++){
      if(coolDownList[i] == message.guild.id && message.author.id !== config.author){
        embed.setDescription(`${cross} This server was recently advertised.\nPlease wait for some time before advertising again.`)
        .setColor(0xff4747);
        await message.channel.send(embed).catch(error => {});
        await message.reactions.removeAll();
        react(message, '❌');
        return;
      }
    }

    const thisServerDescription = await database.get("serverDescription");
    const thisServerAdvertisementColor = await database.get("serverAdvertisementColor");
    const thisServerAdvertisementImage = await database.get("serverAdvertisementImage");
    const thisServerAdvertisementThumbnail = await database.get("serverAdvertisementThumbnail");
    if(!thisServerDescription){
      embed.setDescription(`${cross} Set a server description first.`)
      .setColor(0xff4747);
      await message.channel.send(embed).catch(error => {});
      await message.reactions.removeAll();
      react(message, '❌');
      return;
    }
    async function checkImage(img){
      try{
        let tembed = new Discord.MessageEmbed()
        .setThumbnail(img);
        let msg = await message.channel.send(tembed);
        await msg.delete();
        return true;
      }catch{
        return false;
      }
    }
    if(thisServerAdvertisementImage){
      let flag = false;
      flag = checkImage(thisServerAdvertisementImage);
      if(flag){
        advertisementEmbed.setImage(thisServerAdvertisementImage);
      }
    }
    if(thisServerAdvertisementThumbnail){
      let flag = false;
      flag = checkImage(thisServerAdvertisementThumbnail);
      if(flag){
        advertisementEmbed.setThumbnail(thisServerAdvertisementThumbnail);
      }
    }
    if(thisServerAdvertisementColor){
      advertisementEmbed.setColor(thisServerAdvertisementColor);
    }
    if(thisServerDescription.length > 1500){
      thisServerDescription.length = 1497;
      thisServerDescription = thisServerDescription + "...";
    }
    advertisementEmbed.setAuthor(message.guild.name, message.guild.iconURL())
    .setDescription(thisServerDescription);

    let AdsCount = 0;

    const guildsIDsMap = await client.guilds.cache
    .sort((guild1, guild2) => guild1.position - guild2.position)
    .map(guild => guild.id);  
    for(let i=0; i<=guildsIDsMap.length-1; i++){
      if(guildsIDsMap[i] == message.guild.id){
        continue;
      }
      let db = new Keyv('sqlite://./databases/database.sqlite', {
        table: `${guildsIDsMap[i]}`
      });
      db.on('error', err => console.log('Connection Error', err));

      let serverAdvertisementChannelID = await db.get("serverAdvertisementChannelID");
      if(serverAdvertisementChannelID){
        let serverAdvertisementChannel = await client.guilds.cache.get(guildsIDsMap[i]).channels.cache.get(serverAdvertisementChannelID);
        if(serverAdvertisementChannel){
          await serverAdvertisementChannel.send(advertisementEmbed).catch(error => {});
          AdsCount++;
        }
      }
    }

    let serverText = "server";
    if(AdsCount > 1){
      serverText = serverText + 's';
    }
    embed.setDescription(`${tick} Advertised in \`${AdsCount}\` ${serverText}.`)
    .setColor(0x95fd91);
    await message.channel.send(embed).catch(error => {});

    coolDownList[coolDownList.length] = message.guild.id;

    setInterval(async () => {
      coolDownList = await coolDownList.filter(async guildID => {
        return guildID !== message.guild.id;
      });
    }, 14400000);
  }
}        