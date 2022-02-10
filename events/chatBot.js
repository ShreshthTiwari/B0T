const ChatBot = require('discord-chatbot');
const chatBot = new ChatBot({name: "B0T", gender: "Male"});
const config = require("../config.json");

module.exports = async(Discord, client, message, args, database, messageEmojiFinder) =>{
  let author = await client.users.cache.get(config.authorID).username || "ShreshthTiwari";
  let chatBotChannelID = await database.get("chatBotChannelID");
  if(chatBotChannelID){
    let chatBotChannel = message.guild.channels.cache.get(chatBotChannelID);
    if(chatBotChannel){
      if(message.channel.id == chatBotChannelID){
        message.channel.startTyping();
        let input = message.content;
        if(!input){
          return;
        }
        if(input.length > 500){
          input.length= 500;
        }
        let reply = await chatBot.chat(input);
        reply = reply.replace("Udit", author).replace("Pro", message.author.username).replace(" An",message.author.username).replace("Aryan",message.author.username);
        message.channel.stopTyping();
        await message.channel.send(reply).catch(error => {});
      }
    }
  }
}