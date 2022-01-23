module.exports = (client, message, args) => {
  for(let i=0; i<= args.length-1; i++){
    if(args[i].startsWith(':') && args[i].endsWith(':')){
      let emojiName = args[i].slice(1, -1);
      let emoji;
      if(message.guild){
        emoji = message.guild.emojis.cache.find(e => e.name == emojiName);
      }
      if(!emoji)
        emoji = client.emojis.cache.find(e => e.name == emojiName);
      if(emoji){
        if(emoji.animated){
          args[i] = `<a:${emoji.name}:${emoji.id}>`;
        }else{
          args[i] = `<:${emoji.name}:${emoji.id}>`;
        }    
      }else{
        args[i] = ":" + emoji + ":";
      }
    }
  }
  let t = args.join(" ");
  for(let i=1; i<=args.length; i++){
    t = t.replace(" \n ", "\n").replace(": \n", ":\n").replace("\n :", "\n:").replace(": \n :", ":\n:");
  }
  return t; 
}