module.exports = async(Discord, client, guild) =>{
  let embed = new Discord.MessageEmbed()
    .setColor(0x2f3136);
  embed.setDescription(`> Thank you for inviting me to the server.
    > Use the command \`-help\` to see all the available commands.`)
    .setImage("https://c.tenor.com/EvX-zXwvou4AAAAC/cat-love.gif");
  await guild.channels.cache.filter(ch => ch.type == "text").first().send(embed).catch(error => {});
}