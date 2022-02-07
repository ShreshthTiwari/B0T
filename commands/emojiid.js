module.exports = {
  name : 'emojiid',
  description : 'to get ID of an emoji',
  
  async run(Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, emojiIDs){
    const eid = require("./eid.js");
    eid.run(Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, emojiIDs);
  }
}