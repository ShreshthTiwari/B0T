const path = require('path');
const fs = require('fs');
const dateBuilder = require('../builders/dateBuilder.js');
let date = dateBuilder();
const ticketBuilder = require('../builders/ticketBuilder.js');

module.exports = {
  name: "create",
  description: "To create a ticket",

  async run (Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, emojiIDs, cmd) {
    const tick = await client.emojis.cache.get(emojiIDs.tick);
    const cross = await client.emojis.cache.get(emojiIDs.cross);
    if(!cmd){
      cmd = "create";
    }
    let embed = new Discord.MessageEmbed()
    .setColor(0x98dbfa);
    const staffRoleID = await database.get("staffRoleID");
    const person = message.author.id;
    if(!staffRoleID){
      embed.setDescription(`${cross} Staff role is not set.`)
      .setColor(0xff4747)
      .setFooter(`${prefix}set help roles`);
      await message.channel.send(embed).then((msg) => setTimeout(function(){msg.delete().catch(error => {});}, 10000)).catch(error => {});
      await message.delete().catch(error => {});
      return;
    }else{
      let staffRole = message.guild.roles.cache.get(staffRoleID);
      if(!staffRoleID){
        embed.setDescription(`${cross} Staff role is not set.`)
        .setColor(0xff4747)
        .setFooter(`${prefix}set help roles`);
        await message.channel.send(embed).then((msg) => setTimeout(function(){msg.delete().catch(error => {});}, 10000)).catch(error => {});
        await message.delete().catch(error => {});
        return;
      }
    }
    if(!args[0]){
      embed.setDescription(`${cross} Kindly provide a reason.\nSyntax- -${cmd} \`<reason>\`.`)
      .setColor(0xff4747);
      await message.channel.send(embed).then((msg) => setTimeout(function(){msg.delete().catch(error => {});}, 10000)).catch(error => {});
      await message.delete().catch(error => {});
      return;
    }
    let ticketReason = args.join(" ");
    ticketBuilder(Discord, client,  message, database, fs, path, date, ticketReason, person, staffRoleID);
  }
}