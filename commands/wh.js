module.exports = {
  name : 'wh',
  description : 'webhook messages',

  async run(Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, emojiIDs){
    const webhook = require("./webhook.js");
    webhook.run(Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, emojiIDs, "wh")
  }
}