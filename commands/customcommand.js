module.exports = {
  name : 'customcommand',
  description : 'create custom commands',
  
  async run(Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, emojiIDs){
    const cc = require("./cc.js");
    cc.run(Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, emojiIDs, "customcommand");
  }
}