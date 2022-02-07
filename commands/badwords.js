module.exports = {
  name: "badwords",
  description: "to add or remove badwords",

  async run (Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, emojiIDs){
    const badword = require("./badword.js");
    badword.run(Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, emojiIDs, "badwords");
  }
}