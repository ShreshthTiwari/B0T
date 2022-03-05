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
        try{
          if(!message.content){
            return;
          }
          let input = message.content;
          if(input.length > 500){
            input.length= 500;
          }
          let reply = await chatBot.chat(input).catch(error => {console.log(error)});
          reply = reply.replace("Udit", author)
          .replace("Pro ", message.author.username)
          .replace("Pro,", message.author.username)
          .replace("Pro.", message.author.username)
          .replace("Pro!", message.author.username)
          .replace("An ",message.author.username)
          .replace("An,",message.author.username)
          .replace("An.",message.author.username)
          .replace("An!",message.author.username)
          .replace("Aryan",message.author.username);
          await message.channel.send(reply).catch(error => {});
        }catch{
          return;
        }
      }
    }
  }
}