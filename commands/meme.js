const https = require('https');
let url = `https://www.reddit.com/r/memes/hot/.json?limit=100`;
let gMemeURL = {};
let lastImage;
module.exports = {
  name : 'meme',
  description : 'for memes xD',
  
  async run(Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, emojiIDs){
    gMemeURL[message.guild.id] = url;
    let memesTopic = await database.get("memesTopic");
    const tick = await client.emojis.cache.get(emojiIDs.tick);
    const cross = await client.emojis.cache.get(emojiIDs.cross);
    let embed = new Discord.MessageEmbed()
    .setColor(0x2f3136);
    const memeChannelID = await database.get("memeChannelID");
    const botCommandsChannelID = await database.get("botCommandsChannelID");
    if(memesTopic){
      gMemeURL[message.guild.id] = `https://www.reddit.com/r/${memesTopic}/hot/.json?limit=100`;
    }
    if(!memeChannelID){
      embed.setDescription(`${cross} Meme channel not set.`)
      .setColor(0xff4747);
      await message.channel.send(embed).catch(error => {});
      await message.reactions.removeAll();
      react(message, '❌');
      return;
    }
    const memeChannel = message.guild.channels.cache.get(memeChannelID);
    if((!memeChannel) && (message.channel.id != botCommandsChannelID)){
      embed.setDescription(`${cross} Meme channel not set.`)
      .setColor(0xff4747);
      await message.channel.send(embed).catch(error => {});
      await message.reactions.removeAll();
      react(message, '❌');
      return;
    }
    https.get(gMemeURL[message.guild.id], (result) => {
      let body = '';
      result.on('data', (chunk) =>{
        body += chunk;
      });
      result.on('end', async() => {
        let response = await JSON.parse(body);
        let index = await response.data.children[Math.floor(Math.random() * response.data.dist-1) + 1].data;
        let image;
        if(index.post_hint == "image"){
          image = index.preview.images[0].source.url.replace('&amp;', '&');
          lastImage = image;
        }
        else{
          image = lastImage;
        }
        if(image){
          embed.setImage(image);
          await message.channel.send(embed).then(msg => {
            msg.react("🤣");
            msg.react("👍");
            msg.react("🤔");
            msg.react("👎");
            msg.react("🤬");
          }).catch(error => {});
        }
        else{
          return "return";
        }
      });
    });
  }
}