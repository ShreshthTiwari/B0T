module.exports = {
  name : 'lvltop',
  description : 'to check level leaderboard',
  
  async run(Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, e){
    const leveltop = require('./leveltop.js');
    leveltop.run(Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, e);  
  }
}