
const personFinder = require('../finder/personFinder.js');

const levelBarBuilder = require('../builders/levelBarBuilder.js');
const dateBuilder = require('../builders/dateBuilder.js');
const chatBot = require('../events/chatBot.js');

const points = require('../events/points.js');
const customCommands = require('../events/customcommands.js');
const counting = require('../events/counting.js');
const chatFilter = require('../events/chatFilter.js');
const autoResponder = require('../events/autoResponder.js');
const ticketLogging = require('../events/ticketsLogging.js');
const commandsFinder = require('../events/commandsFinder.js');

module.exports = async (Discord, client, message, Keyv, databaseBuilder, react, prefix, checkPrefix, fs, path, emojiIDs, messageEmojiFinder) => {
  let embed = new Discord.MessageEmbed()
  .setColor(0x98dbfa);
  if(message.guild){
    if(!message.guild.me.hasPermission("ADMINISTRATOR")){
      embed.setDescription("I don't have the **__`ADMINISTRATOR`__** permission.\nPlease invite me again with my default role.")
      .setColor(0xff4747);
      await message.channel.send(embed).catch(error => {});
      await message.guild.leave().catch(error => {});
      return;
    }
    let database = databaseBuilder(Keyv, message.guild.id);

    //---------------------------------Chat Logs---------------------------------
    if(message.author.id != client.user.id){
      let chatLogsChannel, chatLogsChannelID;
      chatLogsChannelID = await database.get("chatLogsChannelID");
      if(chatLogsChannelID){
        chatLogsChannel = await message.guild.channels.cache.get(chatLogsChannelID);
        if(chatLogsChannel){
          embed = new Discord.MessageEmbed()
          .setColor(0x98dbfa);
          let content = message.content;
          if(content.length > 100){
            content.length = 97;
            content = content + "...";
          }
          embed = new Discord.MessageEmbed()
          .setTitle("New Message")
          .setDescription(`**User**- ${message.author}.
          **Name**- \`${message.author.tag}\`.
          **ID**- \`${message.author.id}\`.
          **Channel**- ${message.channel}.
          **Message ID**- \`${message.id}\`.
          **Content**-\n${content}
          **[Jump To Message](${message.url})**`)
          .setColor(0x95fd91);
          await chatLogsChannel.send(embed).catch(error => {});
          embed = new Discord.MessageEmbed()
            .setColor(0x98dbfa);
        }
      }
    }
    //-----------------------------------------------------------------------------
    prefix[message.guild.id] = "-";
    checkPrefix = await database.get("botPrefix");
    if(checkPrefix){
      prefix[message.guild.id] = checkPrefix;
    }

    let args = message.content.split(/ +/);
    //==========Counting Section===================================================
    counting(Discord, client, message, args, database, prefix[message.guild.id], emojiIDs);
    //==========Level/Points Section===============================================
    points(Discord, message, args, client, prefix[message.guild.id], database, levelBarBuilder, emojiIDs);
    //==========Keeping the verification Channel Clean From Bots' Messages=========
    const verificationChannelID = await database.get("verificationChannelID");
    const ticketChannelID = await database.get('ticketChannelID');
    if(message.author.bot){
      if(message.channel.id == verificationChannelID && message.author.id != client.user.id){
        await message.delete();
      }
      return;
    }
    //===============================================================================
    autoResponder(Discord, client, prefix[message.guild.id], message, args, database, personFinder, messageEmojiFinder, message.content.toLowerCase(), emojiIDs);
    //===========Tickets Logging====================================================
    if(message.content.startsWith(prefix[message.guild.id])){
      let t = await message.content.slice(prefix[message.guild.id].length);
      for(let i=1; i<=args.length; i++){
        t = await t.replace("\n", " \n ").replace(":\n", ": \n").replace("\n:", "\n :").replace(":\n:", ": \n :");
      }
      args = await t.split(/ +/);
      //==========Custom Commands====================================================
      customCommands(Discord, client, message, args, database, messageEmojiFinder);
      //==========Commands Finder====================================================
      commandsFinder(Discord, client, prefix[message.guild.id], message, args, database, personFinder, messageEmojiFinder, verificationChannelID, react, emojiIDs);
      //=============================================================================
    }
    else{
      if(!message.member.hasPermission("ADMINISTRATOR")){
        if(message.channel.id == verificationChannelID){
          await message.delete().catch(error => {});
          return;
        }
        if(message.channel.id == ticketChannelID){
          await message.delete().catch(error => {});
          return;
        }
      }
      //===========Chat Filter=======================================================
      chatFilter(Discord, client, message, message.content.toLowerCase(), database, emojiIDs);
      //===========Auto Responder=====================================================
      ticketLogging(message, database, fs, path, dateBuilder);
      //==============================================================================
      chatBot(Discord, client, message, args, database, messageEmojiFinder);
      //=============================================================================
    }
  }
}