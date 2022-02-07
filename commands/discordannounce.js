module.exports = {
  name : 'discordannounce',
  description : 'for work on the bot',

  async run(Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, emojiIDs){
    const dcannounce = require("./dcannounce.js");
    dcannounce.run(Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, emojiIDs);
  }    
}