module.exports = {
  name : 'meme',
  description : 'for memes xD',
  
  async run(Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, emojiIDs){
    const meme = require("./meme.js");
    meme.run(Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, emojiIDs);
  }
}