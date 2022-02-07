module.exports = {
  name: "swears",
  description: "to add or remove swears",

  async run (Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, emojiIDs) {
    const swear = require("./swear.js");
    swear.run(Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, emojiIDs, "swears");
  }
}