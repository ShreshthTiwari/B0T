module.exports = {
  name : 'testjoin',
  description : 'fake server join-leave message',
  alias: ["tjoin", "tj"],

  async run(Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, emojiIDs){
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