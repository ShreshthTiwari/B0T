module.exports = {
  name : 'testjoin',
  description : 'fake server join-leave message',

  async run(Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, e){
    let embed = new Discord.MessageEmbed()
      .setColor(0x2f3136);
    if(!message.member.hasPermission("ADMINISTRATOR")){
      await message.reactions.removeAll();
      react(message, '❌');
      return;
    }
    let person;
    if(args[0]){
      person = message.guild.members.cache.get(args[0]);
    }
    if(!person){
      person = message.member;
    }
    await client.emit('guildMemberAdd', person);
    await client.emit('guildMemberRemove', person);
  }
}