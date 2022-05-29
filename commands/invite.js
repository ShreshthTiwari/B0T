module.exports = {
  name : 'invite',
  description : 'discord invite link',
  alias: [],

  async run(Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, emojiIDs){
    const cross = await client.emojis.cache.get(emojiIDs.cross);
    let embed = new Discord.MessageEmbed()
      .setColor(0x2f3136);
    let invite = await database.get(`customCommand_invite`);
    if(!invite){
      invite = await message.channel.createInvite({
        maxAge: 86400,
        maxUses: 1
      }).catch(console.log);
      await message.channel.send(`${invite}`).catch(async err =>{
        embed.setDescription(`${cross} Error creating invite.`)
          .setColor(0xff4747);
        await message.channel.send(embed).then((msg) => setTimeout(function(){msg.delete().catch(error => {});}, 10000)).catch(error => {});
        await message.reactions.removeAll();
        react(message, '❌');
        return;  
      });
    }
  }
}