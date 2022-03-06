const config = require("../config.json");

module.exports = {
  name : 'help',
  description : 'commands list',

  async run(Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, emojiIDs){
    const tick = await client.emojis.cache.get(emojiIDs.tick);
    const cross = await client.emojis.cache.get(emojiIDs.cross);
    const arrow = await client.emojis.cache.get(emojiIDs.arrow);
    let author = await client.users.cache.get(config.authorID).tag;
    let authorImg = await client.users.cache.get(config.authorID).displayAvatarURL({dynamic: true});
    let embed = new Discord.MessageEmbed()
      .setTitle(`${client.user.username} Help`)
      .setColor(0x2f3136)
      .setAuthor(message.guild.name, message.guild.iconURL())
      .setFooter(`Author- ${author}`, authorImg)
      .setThumbnail(message.author.displayAvatarURL());
    
    if(!args[0]){
      embed.setDescription(`
        > ${arrow} ${prefix}help members
        > ${arrow} ${prefix}help admins
      `);
    }
    else{
      if(args[0].toLowerCase() == "members" || args[0].toLowerCase() == "member" || args[0].toLowerCase() == "level" || args[0].toLowerCase() == "fun" || args[0].toLowerCase() == "bot" || args[0].toLowerCase() == "verification" || args[0].toLowerCase() == "server"){
        if(args[0].toLowerCase() == "members" || args[0].toLowerCase() == "member"){
          embed.setDescription(`
            **Members**
            ㅤ➥**Level**
            > ㅤ${arrow} ${prefix}level \`<user>\`
            > ㅤㅤㅤ➥[\`alias - lvl\`]
            > ㅤ${arrow} ${prefix}leveltop \`<page>\`
            > ㅤㅤㅤ➥[\`alias - lvltop\`]
            ㅤ➥**Fun**
            > ㅤ${arrow} ${prefix}afk \`<message>\`
            > ㅤ${arrow} ${prefix}avatar \`<user>\`
            > ㅤㅤㅤ➥[\`alias - pfp\`]
            > ㅤ${arrow} ${prefix}coins \`<user>\`
            > ㅤ${arrow} ${prefix}info \`<user>\`
            > ㅤㅤㅤ➥[\`alias - userinfo\`]
            > ㅤ${arrow} ${prefix}join [\`Under Development\`]
            > ㅤ${arrow} ${prefix}meme
            > ㅤ${arrow} ${prefix}role help
            > ㅤ${arrow} ${prefix}roles help
            ㅤ➥**Bot**
            > ㅤ${arrow} ${prefix}bot help
            > ㅤ${arrow} ${prefix}ping
            ㅤ➥**Verification**
            > ㅤ${arrow} ${prefix}verify
            ㅤ➥**Server**
            > ㅤ${arrow} ${prefix}advertise
            > ㅤㅤㅤ➥[\`alias - ad\`]
            > ㅤ${arrow} ${prefix}apply
            > ㅤ${arrow} ${prefix}create \`<reason>\`
            > ㅤㅤㅤ➥[\`alias - new, t, ticket\`]
            > ㅤ${arrow} ${prefix}status
            > ㅤ${arrow} ${prefix}suggest \`<suggestion>\`
            > ㅤㅤㅤ➥[\`alias - suggestion\`]
          `);
        }
        else if(args[0].toLowerCase() == "level"){
          embed.setDescription(`
            **Members**
            ㅤ➥**Level**
            > ㅤ${arrow} ${prefix}level \`<user>\`
            > ㅤㅤㅤ➥[\`alias - lvl\`]
            > ㅤ${arrow} ${prefix}leveltop \`<page>\`
            > ㅤㅤㅤ➥[\`alias - lvltop\`]
          `);
        }
        else if(args[0].toLowerCase() == "fun"){
          embed.setDescription(`
            **Members**
            ㅤ➥**Fun**
            > ㅤ${arrow} ${prefix}afk \`<message>\`
            > ㅤ${arrow} ${prefix}avatar \`<user>\`
            > ㅤ${arrow} ${prefix}coins \`<user>\`
            > ㅤ${arrow} ${prefix}info \`<user>\`
            > ㅤㅤㅤ➥[\`alias - userinfo\`]
            > ㅤ${arrow} ${prefix}join [\`Under Development\`]
            > ㅤ${arrow} ${prefix}meme
            > ㅤㅤㅤ➥[\`alias - memes\`]
            > ㅤ${arrow} ${prefix}role help
            > ㅤ${arrow} ${prefix}roles help
          `);
        }
        else if(args[0].toLowerCase() == "bot"){
          embed.setDescription(`
            **Members**
            ㅤ➥**Bot**
            > ㅤ${arrow} ${prefix}bot help
            > ㅤ${arrow} ${prefix}ping
          `);
        }
        else if(args[0].toLowerCase() == "verification"){
          embed.setDescription(`
            **Members**
            ㅤ➥**Verification**
            > ㅤ${arrow} ${prefix}verify
          `);
        }
        else if(args[0].toLowerCase() == "server"){
          embed.setDescription(`
            **Members**
            ㅤ➥**Server**
            > ㅤ${arrow} ${prefix}apply
            > ㅤㅤㅤ➥[\`alias - pfp\`]
            > ㅤ${arrow} ${prefix}create \`<reason>\`
            > ㅤㅤㅤ➥[\`alias - new, t, ticket\`]
            > ㅤ${arrow} ${prefix}status
            > ㅤ${arrow} ${prefix}suggest \`<suggestion>\`
            > ㅤㅤㅤ➥[\`alias - suggestion\`]
          `);
        }
        else{
          embed.setDescription(`
            > ${arrow} ${prefix}help members
            > ${arrow} ${prefix}help admins
          `);
        }
      }
      else if(args[0].toLowerCase() == "admins" || args[0].toLowerCase() == "admin" || args[0].toLowerCase() == "messages" || args[0].toLowerCase() == "moderation" || args[0].toLowerCase() == "ticket" || args[0].toLowerCase() == "channel" || args[0].toLowerCase() == "variables" || args[0].toLowerCase() == "appplication" || args[0].toLowerCase() == "misc"){
        if(!message.member.hasPermission("ADMINISTRATOR")){
          await message.reactions.removeAll();
          react(message, '❌');
          return;
        }else{
          if(args[0].toLowerCase() == "admins" || args[0].toLowerCase() == "admin"){
            embed.setDescription(`
               **Admin**
              ㅤ➥**Messages**
              > ㅤ${arrow} ${prefix}dcannounce \`<msg>\`
              > ㅤ${arrow} ${prefix}eembed help.
              > ㅤ${arrow} ${prefix}embed \`<message>\`
              > ㅤ${arrow} ${prefix}mcannounce \`<msg>\`
              > ㅤ${arrow} ${prefix}msg \`<user>\` \`<message>\`
              > ㅤ${arrow} ${prefix}msge \`<user>\` \`<message>\`
              > ㅤ${arrow} ${prefix}say \`<message>\`
              > ㅤ${arrow} ${prefix}webhook help
              > ㅤ${arrow} ${prefix}eid :\`<emojiName>\`:
              > ㅤㅤㅤ➥[\`alias - wh, wb\`]
              ㅤ➥**Moderation**
              > ㅤ${arrow} ${prefix}badword help
              > ㅤㅤㅤ➥[\`alias - badwords\`]
              > ㅤ${arrow} ${prefix}ban \`<user>\`
              > ㅤ${arrow} ${prefix}clear \`<amount>\`
              > ㅤ${arrow} ${prefix}kick \`<user>\`
              > ㅤ${arrow} ${prefix}mute \`<user>\`
              > ㅤ${arrow} ${prefix}nick \`<user>\` \`<name>\`
              > ㅤ${arrow} ${prefix}sping \`<user>\` \`<count>\`
              > ㅤ${arrow} ${prefix}swear help
              > ㅤㅤㅤ➥[\`alias - swears\`]
              > ㅤ${arrow} ${prefix}unmute \`<user>\`
              > ㅤ${arrow} ${prefix}warn \`<user>\`
              > ㅤ${arrow} ${prefix}warns \`<user>\`
              > ㅤ${arrow} ${prefix}members
              ㅤ➥**Ticket**
              > ㅤ${arrow} ${prefix}add \`<user>\`
              > ㅤ${arrow} ${prefix}claim.
              > ㅤ${arrow} ${prefix}close.
              > ㅤ${arrow} ${prefix}remove \`<user>\`
              ㅤ➥**Channel**
              > ㅤ${arrow} ${prefix}clone \`<channel>\`
              > ㅤ${arrow} ${prefix}delete \`<channel>\`
              > ㅤ${arrow} ${prefix}nuke \`<channel>\`
              > ㅤ${arrow} ${prefix}lock \`<channel>\`
              > ㅤ${arrow} ${prefix}unlock \`<channel>\`
              ㅤ➥**Variables**
              > ㅤ${arrow} ${prefix}set help
              ㅤ➥**Application**
              > ㅤ${arrow} ${prefix}application help
              ㅤ➥**Misc**
              > ㅤ${arrow} ${prefix}customcommand help
              > ㅤㅤㅤ➥[\`alias - cc\`]
              > ㅤ${arrow} ${prefix}emojis \`<page>\`
              > ㅤ${arrow} ${prefix}testjoin
            `); 
          }
          else if(args[0].toLowerCase() == "messages"){
            embed.setDescription(`
               **Admin**
              ㅤ➥**Messages**
              > ㅤ${arrow} ${prefix}dcannounce \`<msg>\`
              > ㅤㅤㅤ➥[\`alias - discordannounce\`]
              > ㅤ${arrow} ${prefix}eembed help.
              > ㅤ${arrow} ${prefix}embed \`<message>\`
              > ㅤ${arrow} ${prefix}mcannounce \`<msg>\`
              > ㅤㅤㅤ➥[\`alias - minecraftannounce\`]
              > ㅤ${arrow} ${prefix}msg \`<user>\` \`<message>\`
              > ㅤ${arrow} ${prefix}msge \`<user>\` \`<message>\`
              > ㅤ${arrow} ${prefix}say \`<message>\`
              > ㅤ${arrow} ${prefix}webhook help
              > ㅤ${arrow} ${prefix}eid :\`<emojiName>\`:
              > ㅤㅤㅤ➥[\`alias - wh, wb\`]
            `); 
          }
          else if(args[0].toLowerCase() == "moderation"){
            embed.setDescription(`
               **Admin**
              ㅤ➥**Moderation**
              > ㅤ${arrow} ${prefix}badword help
              > ㅤㅤㅤ➥[\`alias - badwords\`]
              > ㅤ${arrow} ${prefix}ban \`<user>\`
              > ㅤ${arrow} ${prefix}clear \`<amount>\`
              > ㅤ${arrow} ${prefix}kick \`<user>\`
              > ㅤ${arrow} ${prefix}mute \`<user>\`
              > ㅤ${arrow} ${prefix}nick \`<user>\` \`<name>\`
              > ㅤ${arrow} ${prefix}sping \`<user>\` \`<count>\`
              > ㅤ${arrow} ${prefix}swear help
              > ㅤㅤㅤ➥[\`alias - swears\`]
              > ㅤ${arrow} ${prefix}unmute \`<user>\`
              > ㅤ${arrow} ${prefix}warn \`<user>\`
              > ㅤ${arrow} ${prefix}warns \`<user>\`
              > ㅤ${arrow} ${prefix}members
            `); 
          }
          else if(args[0].toLowerCase() == "ticket"){
            embed.setDescription(`
               **Admin**
              ㅤ➥**Ticket**
              > ㅤ${arrow} ${prefix}add \`<user>\`
              > ㅤ${arrow} ${prefix}claim.
              > ㅤ${arrow} ${prefix}close.
              > ㅤ${arrow} ${prefix}remove \`<user>\`
            `); 
          }
          else if(args[0].toLowerCase() == "channel"){
            embed.setDescription(`
               **Admin**
              ㅤ➥**Channel**
              > ㅤ${arrow} ${prefix}clone \`<channel>\`
              > ㅤ${arrow} ${prefix}delete \`<channel>\`
              > ㅤ${arrow} ${prefix}nuke \`<channel>\`
              > ㅤ${arrow} ${prefix}lock \`<channel>\`
              > ㅤ${arrow} ${prefix}unlock \`<channel>\`
            `); 
          }
          else if(args[0].toLowerCase() == "variables"){
            embed.setDescription(`
               **Admin**
              ㅤ➥**Variables**
              > ㅤ${arrow} ${prefix}set help
            `); 
          }
          else if(args[0].toLowerCase() == "application"){
            embed.setDescription(`
               **Admin**
              ㅤ➥**Application**
              > ㅤ${arrow} ${prefix}application help
            `); 
          }
          else if(args[0].toLowerCase() == "misc"){
            embed.setDescription(`
               **Admin**
              ㅤ➥**Misc**
              > ㅤ${arrow} ${prefix}customcommand help
              > ㅤㅤㅤ➥[\`alias - cc\`]
              > ㅤ${arrow} ${prefix}emojis \`<page>\`
              > ㅤ${arrow} ${prefix}testjoin
            `); 
          }
          else{
            embed.setDescription(`
              > ${arrow} ${prefix}help members
              > ${arrow} ${prefix}help admins
            `);
          }
        }
      }
      else{
        embed.setDescription(`
          > ${arrow} ${prefix}help members
          > ${arrow} ${prefix}help admins
        `);
      }
    }
    await message.channel.send(embed).catch( error =>{});
  }
}