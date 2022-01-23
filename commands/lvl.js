module.exports = {
  name : 'lvl',
  description : 'to check your level',

  async run(Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, e){
    const level = require("./level.js");
    level.run(Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, e, "lvl");
  }
}