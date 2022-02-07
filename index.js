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

const databaseBuilder = require('./builders/databaseBuilder.js');
let database;

const react = require('./editors/react.js');

const emojiIDs = require("./emojiIDs.json");

const messageEmojiFinder = require("./editors/messageEmojiFinder.js");

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
  onReady(Discord, client, Keyv, util);
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
  onGuildJoin(Discord, guild);
});

client.on("guildDelete", async guild => {
  database = databaseBuilder(Keyv, guild.id);
  let onGuildDelete = require("./events/onGuildDelete.js");
  onGuildDelete(guild, database);
});

client.on('messageUpdate', async (oldMessage, newMessage) => {
  database = databaseBuilder(Keyv, newMessage.guild.id);
  let onMessageUpdate = require("./events/onMessageUpdate.js");
  onMessageUpdate(Discord, client, oldMessage, newMessage, database);
});

client.on("messageDelete", async (deletedMessage) => {
  database = databaseBuilder(Keyv, deletedMessage.guild.id);
  let onMessageDelete = require("./events/onMessageDelete.js");
  onMessageDelete(Discord, client, deletedMessage, database);
});

client.on('message', async message => {
  let onMessageCreate = require("./events/onMessageCreate.js");
  onMessageCreate(Discord, client, message, Keyv, databaseBuilder, react, prefix, checkPrefix, fs, path, emojiIDs, messageEmojiFinder);
});

const Application = require('./events/Application.js');
Application(Discord, client, Keyv, fs, path, messageEmojiFinder, react, emojiIDs);

client.login();