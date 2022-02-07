module.exports = {
  name: "suggestion",
  description: "suggest something",

  async run (Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, emojiIDs){
    const suggest = require('./suggest.js');
    suggest.run(Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, emojiIDs, 'suggestion');
  }
}