const Discord = require('discord.js');
require('dotenv').config();
const client  = new Discord.Client();
client.commands = new Discord.Collection();

const util = require('minecraft-server-util');

const Canvas = require('canvas');

const Keyv = require('keyv');

const fs = require("fs");
const { readdirSync } = require('fs');

const { join } = require ('path');
const path = require('path');

const personFinder = require('./finder/personFinder.js');

const levelBarBuilder = require('./builders/levelBarBuilder.js');
const dateBuilder = require('./builders/dateBuilder.js');
const databaseBuilder = require('./builders/databaseBuilder.js');
const react = require('./editors/react.js');
const chatBot = require('./events/chatBot.js');
let database;

const website = require('./website.js');
website();

let prefix = [];
let checkPrefix ;

const commandFiles = readdirSync(join(__dirname, "commands")).filter(file => file.endsWith(".js"));
for(const file of commandFiles){
  const command = require(join(__dirname, "commands", `${file}`));
  client.commands.set(command.name,command);
}

client.on("error", console.error);

client.on('ready', () => {
  const onReady = require('./events/onReady.js');
  onReady(client, Keyv, util);
});

client.on('guildMemberAdd', async member => {
  if(member.guild){
    database = databaseBuilder(Keyv, member.guild.id);
    const onGuildMemberAdd = require('./events/onGuildMemberAdd.js');
    onGuildMemberAdd(Discord, Keyv, member, Canvas, path, database);
  }
});

client.on("guildMemberRemove", async member => {
  if(member.guild){
    database = databaseBuilder(Keyv, member.guild.id);
    const onGuildMemberRemove = require('./events/onGuildMemberRemove.js');
    onGuildMemberRemove(Discord, member, Canvas, path, database);
  }
});

client.on("guildCreate", async guild => {
  let onGuildJoin = require("./events/onGuildJoin.js");
  onGuildJoin(Discord, client, guild);
});

client.on("guildDelete", async guild => {
  let onGuildLeave = require("./events/onGuildLeave.js");
  onGuildLeave(Discord, client, guild);
});

client.on('messageUpdate', async (oldMessage, newMessage) => {
  if(newMessage.author.id == client.user.id){
    return;
  }
  let chatLogsChannel, chatLogsChannelID;
  chatLogsChannelID = await database.get("chatLogsChannelID");
  if(chatLogsChannelID){
    chatLogsChannel = await newMessage.guild.channels.cache.get(chatLogsChannelID);
    if(chatLogsChannel){
      embed = new Discord.MessageEmbed()
        .setColor(0x98dbfa);
      let oldMessageContent = oldMessage.content;
      if(oldMessageContent.length > 100){
        oldMessageContent.length = 97;
        oldMessageContent = oldMessageContent + "...";
      }
      let newMessageContent = newMessage.content;
      if(newMessageContent.length > 100){
        newMessageContent.length = 97;
        newMessageContent = newMessageContent + "...";
      }
      embed = new Discord.MessageEmbed()
        .setTitle("Message Updated")
        .setDescription(`**User**- ${newMessage.author}.
        **Name**- \`${newMessage.author.username}\`.
        **ID**- \`${newMessage.author.id}\`.
        **Channel**- ${newMessage.channel}.
        **Message ID**- \`${newMessage.id}\`.
        **Old Message**-\n${oldMessageContent}
        **New Message**-\n${newMessageContent}
        **[Jump To Message](${newMessage.url})**`)
        .setColor(0x95fd91);
      await chatLogsChannel.send(embed).catch(error => {});
      embed = new Discord.MessageEmbed()
        .setColor(0x98dbfa);
    }
  }
});

client.on("messageDelete", async (deletedMessage) => {
  if(deletedMessage.author.id == client.user.id){
    return;
  }
  let chatLogsChannel, chatLogsChannelID;
  chatLogsChannelID = await database.get("chatLogsChannelID");
  if(chatLogsChannelID){
    chatLogsChannel = await deletedMessage.guild.channels.cache.get(chatLogsChannelID);
    if(chatLogsChannel){
      embed = new Discord.MessageEmbed()
        .setColor(0x98dbfa);
      let content = deletedMessage.content;
      if(content.length > 100){
        content.length = 97;
        content = content + "...";
      }
      embed = new Discord.MessageEmbed()
        .setTitle("Message Deleted")
        .setDescription(`**User**- ${deletedMessage.author}.
        **Name**- \`${deletedMessage.author.username}\`.
        **ID**- \`${deletedMessage.author.id}\`.
        **Channel**- ${deletedMessage.channel}.
        **Message ID**- \`${deletedMessage.id}\`.
        **Content**-\n${content}`)
        .setColor(0x95fd91);
      await chatLogsChannel.send(embed).catch(error => {});
      embed = new Discord.MessageEmbed()
        .setColor(0x98dbfa);
    }
  }
});

const e = require("./emojiIDs.json");

const messageEmojiFinder = require("./editors/messageEmojiFinder.js");

const Application = require('./events/Application.js');
Application(Discord, client, Keyv, fs, path, messageEmojiFinder, react, e);

const points = require('./events/points.js');
const customCommands = require('./events/customcommands.js');
const counting = require('./events/counting.js');
const chatFilter = require('./events/chatFilter.js');
const autoResponder = require('./events/autoResponder.js');
const ticketLogging = require('./events/ticketsLogging.js');
const commandsFinder = require('./events/commandsFinder.js');

//=================================================================================
client.on('message', async message => {
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
    database = databaseBuilder(Keyv, message.guild.id);

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
            **Name**- \`${message.author.username}\`.
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
    counting(Discord, client, message, args, database, prefix[message.guild.id], e);
    //==========Level/Points Section===============================================
    points(Discord, message, args, client, prefix[message.guild.id], database, levelBarBuilder, e);
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
    autoResponder(Discord, client, prefix[message.guild.id], message, args, database, personFinder, messageEmojiFinder, message.content.toLowerCase(), e);
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
      commandsFinder(Discord, client, prefix[message.guild.id], message, args, database, personFinder, messageEmojiFinder, verificationChannelID, react, e);
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
      chatFilter(Discord, client, message, message.content.toLowerCase(), database, e);
      //===========Auto Responder=====================================================
      ticketLogging(message, database, fs, path, dateBuilder);
      //==============================================================================
      chatBot(Discord, client, message, args, database, messageEmojiFinder);
      //=============================================================================
    }
  }
});

client.login();