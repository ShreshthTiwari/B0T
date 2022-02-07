module.exports = {
  name : 'lvl',
  description : 'to check your level',

  async run(Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, emojiIDs){
    const level = require("./level.js");
    level.run(Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, emojiIDs, "lvl");
  }
}