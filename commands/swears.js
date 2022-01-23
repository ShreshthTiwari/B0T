module.exports = {
  name: "swears",
  description: "to add or remove swears",

  async run (Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, e) {
    const swear = require("./swear.js");
    swear.run(Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, e, "swears");
  }
}