module.exports = {
  name: "ad",
  description: "advertise your server",
    
  async run (Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, emojiIDs) {
    const ad = require("./ad.js");
    ad.run(Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, emojiIDs);
  }
}        