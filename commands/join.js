const ytdl = require('ytdl-core');

module.exports = {
  name : 'join',
  description : 'make the bot join the VC channel ur in',

  async run(Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, emojiIDs){
    const tick = await client.emojis.cache.get(emojiIDs.tick);
    const cross = await client.emojis.cache.get(emojiIDs.cross);
    let embed = new Discord.MessageEmbed()
      .setColor(0xff4747);
    if(message.member.voice.channel) {
      if(!args[0]){
        embed.setDescription(`${cross} Provide a link also.`)
          .setFooter(`${prefix}join <link>`);
        await message.channel.send(embed).catch(error => {});
        await message.reactions.removeAll();
        react(message, '❌');
        return;
      }
      let videoLink = args[0];
      message.member.voice.channel.join().then(connection => {
    	  const stream = ytdl(videoLink);
	      const dispatcher = connection.play(stream);
	      dispatcher.on('finish', () => voiceChannel.leave());
      });  
    } 
    else{
      await message.reply('You need to join a voice channel first!').catch(error => {});
      await message.reactions.removeAll();
      react(message, '❌');
    }  
  }
}