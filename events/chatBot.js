var axios = require("axios").default;

module.exports = async(Discord, client, message, args, database, messageEmojiFinder) =>{
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
        let options = {
          method: 'GET',
          url: 'https://acobot-brainshop-ai-v1.p.rapidapi.com/get',
          params: {bid: '178', key: 'sX5A2PcYZbsN5EY6', uid: 'mashape', msg: input},
          headers: {
            'x-rapidapi-host': 'acobot-brainshop-ai-v1.p.rapidapi.com',
            'x-rapidapi-key': '7f8f23af7bmsh9c042bc55e9bff3p1be1acjsn651ba219ed58'
          }
        };
        setTimeout(function(){}, 2000)        
        await message.channel.stopTyping();
        axios.request(options).then(async function (response) {
          await message.reply(response.data.cnt).catch(error => {});
        }).catch(function (error) {
          console.error(error);
        });
      }
    }
  }
}



/*
const chatBot = require('djs-chatbot');

module.exports = async(Discord, client, message, args, database, messageEmojiFinder) =>{
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
        let reply = await chatBot.chat({ Message: input });
        message.channel.stopTyping();
        await message.reply(reply).catch(error => {});
      }
    }
  }
}
*/