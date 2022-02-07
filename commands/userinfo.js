module.exports = {
  name : 'userinfo',
  description : 'to get user info',

  async run(Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, emojiIDs){
    const info = require("./info.js");
    info.run(Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, emojiIDs);
  }
}      