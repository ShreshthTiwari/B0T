module.exports = {
    name : 'wb',
    description : 'webhook messages',
  
    async run(Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, e){
      const webhook = require("./webhook.js");
      webhook.run(Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, e, "wb")
    }
  }