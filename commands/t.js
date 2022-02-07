module.exports = {
  name: "t",
  description: "To create a ticket",

  async run (Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, emojiIDs) {
    const create = require('./create.js');
    create.run(Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, emojiIDs, "t");
  }
}