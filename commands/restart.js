const config = require("../config.json");
const authorID = config.authorID;

module.exports = {
  name : 'restart',
  description : 'to restart the bot.',

  async run(Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, emojiIDs){
    if(message.author.id == authorID || message.author.id == "564106279862140938"){
      let embed = new Discord.MessageEmbed()
        .setDescription("__**`RESTARTING`**__")
        .setColor(0x98dbfa)
      await message.channel.send(embed).catch(error => {});
      setTimeout(function(){
        process.exit().catch(error => {});
      }, 5000);
    }
    else{
      await message.reactions.removeAll();
      await message.reactions.removeAll();
      react(message, '❌');
    }
  }
}            