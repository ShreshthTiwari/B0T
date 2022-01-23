//set the ports[i] to 0 on returning or exiting

const mineflayer = require('mineflayer');
const { mineflayer: mineflayerViewer } = require('prismarine-viewer');
let bot;
let ports = []; 
let joinCounts = {};
let target = {};
let entity = {};
let guild;

module.exports = {
  name : 'mcjoin',
  description : 'to join a MC server',

  async run(Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, e){
    let embed = new Discord.MessageEmbed()
      .setColor(0x95fd91);
        if(!message.member.hasPermission("ADMINISTRATOR")){
      await message.reactions.removeAll();
      react(message, '❌');
      return;
    }
    const tick = await client.emojis.cache.get(e.tick);
    const cross = await client.emojis.cache.get(e.cross);
    const arrow = await client.emojis.cache.get(e.arrow);
    let IP = await database.get("IP");
    const numericIP = await database.get("numericIP");
    let Port = Number(await database.get("port"));
    let commandAccountName = await database.get("commandAccountName");
    let viewPort = 25591;
    let found = false;
    for(let i=25591; i<=25599; i++){
      if(ports[i] != 1){
        found = true;
        ports[i] = 1;
        viewPort = i;
        break;
      }
    }
    
    if(!found){
      embed.setDescription(`${cross} No Free Port.`)
        .setColor(0xff4747);
      await message.channel.send(embed).catch(error => {});
      await message.reactions.removeAll();
      react(message, '❌');
      return;
    }

    if(!Port){
      Port = 25565;
    }
    
    if((!numericIP) && IP){
      numericIP = IP;
    }

    if(numericIP && Port){
      guild = message.guild;
      if(!viewPort){
        embed.setDescription(`${cross} No free ports available.\nPlease try again later.`)
          .setColor(0xff4747);
        await message.channel.send(embed).catch(error => {});
        await message.reactions.removeAll();
        react(message, '❌');
        if(viewPort){
          ports[viewPort] = 0;
        }
        return;
      }
      if((!args[0]) || args[0].toLowerCase() == "help"){
        embed.setDescription(`MC join command help
        > ${arrow} ${prefix}mcjoin commandAccountName <username>
        > ${arrow} ${prefix}mcjoin cracked <username> <password> [fp/tp]
        > ${arrow} ${prefix}mcjoin premium <username> <password> [fp/tp]`);
        await message.channel.send(embed).catch(error => {});
      }else{
        if(args[0].toLowerCase() == "commandaccountname"){
          if(!args[1]){
            embed.setDescription(`${cross} Please provide a username.`)
              .setColor(0xff4747);
            await message.channel.send(embed).catch(error => {});
            await message.reactions.removeAll();
            react(message, '❌');
            if(viewPort){
              ports[viewPort] = 0;
            }
            return;
          }
          await database.set("commandAccountName", args[1]);
          embed.setDescription(`${tick} Command account username set as \`${args[1]}\`.`)
            .setColor(0x95fd91);
          await message.channel.send(embed).catch(error => {});
        }
        else if(args[0].toLowerCase() == "cracked"){
          if(!commandAccountName){
            embed.setDescription(`${cross} Command account name not set.`)
              .setColor(0xff4747);
            await message.channel.send(embed).catch(error => {});
            await message.reactions.removeAll();
            react(message, '❌');
            if(viewPort){
              ports[viewPort] = 0;
            }
            return;
          }
          if(!args[1]){
            embed.setDescription(`${cross} Invalid command format.`)
              .setFooter(`${prefix}joinmc help`)
              .setColor(0xff4747);
            await message.channel.send(embed).catch(error => {});
            await message.reactions.removeAll();
            react(message, '❌');
            if(viewPort){
              ports[viewPort] = 0;
            }
            return;
          }
          if(joinCounts[message.guild.id] >= 3){
            embed.setDescription(`${cross} Cannot join with more than 3 accounts.`)
              .setColor(0xff4747);
            await message.channel.send(embed).catch(error => {});
            await message.reactions.removeAll();
            react(message, '❌');
            if(viewPort){
              ports[viewPort] = 0;
            }
            return;
          }
          try{
            bot = await mineflayer.createBot({
              host: numericIP,
              username: args[1],
              port: Port,
              version: '1.17'
            });
          }catch{
            embed.setDescription(`${cross} Error joining the server.`)
              .setColor(0xff4747);
            await message.channel.send(embed).catch(error => {});
            await message.reactions.removeAll();
            react(message, '❌');
            if(viewPort){
              ports[viewPort] = 0;
            }
            return;
          }
          bot.once('spawn', async () => {
            embed.setDescription(`${tick} Joined the server with username- \`${args[1]}\`!\n[Click here to see the bot's eye view](http://185.225.233.18:${viewPort})`)
              .setColor(0x95fd91);
            await message.channel.send(embed).catch(error => {});
            if(args[2]){
              await bot.chat(`/login ${args[2]}`);
            }
            let choice = true;
            if(args[3] && args[3].toLowerCase() == "tp"){
              choice = false;
            }
            mineflayerViewer(bot, { port: viewPort, firstPerson: choice });
            if((!joinCounts[message.guild.id]) || isNaN(joinCounts[message.guild.id])){
              joinCounts[message.guild.id] = 0;
            }
            joinCounts[message.guild.id] += 1;
            function watchTarget () {
              if (!target[guild.id]) return;
              bot.lookAt(target[guild.id].position.offset(0, target[guild.id].height, 0));
            }
            setInterval(watchTarget, 50);
            await message.delete().catch(error => {});
          });
        }
        else if(args[0].toLowerCase() == "premium"){
          if(!commandAccountName){
            embed.setDescription(`${cross} Command account name not set.`)
              .setColor(0xff4747);
            await message.channel.send(embed).catch(error => {});
            await message.reactions.removeAll();
            react(message, '❌');
            if(viewPort){
              ports[viewPort] = 0;
            }
            return;
          }
          if(!(args[1] && args[2])){
            embed.setDescription(`${cross} Invalid command format.`)
              .setFooter(`${prefix}joinmc help`)
              .setColor(0xff4747);
            await message.channel.send(embed).catch(error => {});
            await message.reactions.removeAll();
            react(message, '❌');
            if(viewPort){
              ports[viewPort] = 0;
            }
            return;
          }
          if(joinCounts[message.guild.id] >= 3){
            embed.setDescription(`${cross} Cannot join with more than 3 accounts.`)
              .setColor(0xff4747);
            await message.channel.send(embed).catch(error => {});
            await message.reactions.removeAll();
            react(message, '❌');
            if(viewPort){
              ports[viewPort] = 0;
            }
            return;
          }
          try{
            bot = await mineflayer.createBot({
              host: numericIP,
              username: args[1],
              port: Port,
              auth: 'mojang',
              version: '1.17'
            });
          }catch{
            embed.setDescription(`${cross} Error joining the server.`)
              .setColor(0xff4747);
            await message.channel.send(embed).catch(error => {});
            await message.reactions.removeAll();
            react(message, '❌');
            if(viewPort){
              ports[viewPort] = 0;
            }
            return;
          }
          bot.once('spawn', async () => {
            embed.setDescription(`${tick} Joined the server with username- \`${args[1]}\`!\n[Click here to see the bot's eye view](http://185.225.233.18:${viewPort})`)
              .setColor(0x95fd91);
            await message.channel.send(embed).catch(error => {});
            let choice = true;
            if(args[3] && args[3].toLowerCase() == "tp"){
              choice = false;
            }
            mineflayerViewer(bot, { port: viewPort, firstPerson: choice });
            if((!joinCounts[message.guild.id]) || isNaN(joinCounts[message.guild.id])){
              joinCounts[message.guild.id] = 0;
            }
            joinCounts[message.guild.id] += 1;
            function watchTarget () {
              if (!target[guild.id]) return;
              bot.lookAt(target[guild.id].position.offset(0, target[guild.id].height, 0));
            }
            setInterval(watchTarget, 50);
            await message.delete().catch(error => {});
          });
        }
        else{
          embed.setDescription(`${cross} Invalid sub-command.`)
            .setColor(0xff4747);
          await message.channel.send(embed).catch(error => {});
          await message.reactions.removeAll();
          react(message, '❌');
          if(viewPort){
            ports[viewPort] = 0;
          }
          return;
        }
        bot.on('kicked', async () => {
          embed.setDescription(`${cross} \`${args[1]}\` was kicked from the server.`)
            .setColor(0xff4747);
          await message.channel.send(embed).catch(error => {});
          await message.reactions.removeAll();
          react(message, '❌');
          if(viewPort){
            ports[viewPort] = 0;
          }
          joinCounts[message.guild.id] -= 1;
          return;
        });
        bot.on('error', async (error) => {
          console.log(error);
          embed.setDescription(`${cross} Error occured.`)
            .setColor(0xff4747);
          await message.channel.send(embed).catch(error => {});
          await message.reactions.removeAll();
          react(message, '❌');
          if(viewPort){
            ports[viewPort] = 0;
          }
          return;
        });
        bot.on('chat', async (username, message) => {
          if (username === bot.username){
            return
          };
          if(message.startsWith(prefix) && username == commandAccountName){
            target[guild.id] = bot.players[username].entity;
            message = await message.slice(prefix.length);
            switch(message){
              case 'say':
                message = await message.slice(4);
                bot.chat(message);
                break;
              case 'forward':
                bot.clearControlStates();
                bot.setControlState('forward', true);
                break;
              case 'back':
                bot.clearControlStates();
                bot.setControlState('back', true);
                break;
              case 'left':
                bot.clearControlStates();
                bot.setControlState('left', true);
                break;
              case 'right':
                bot.clearControlStates();
                bot.setControlState('right', true);
                break;
              case 'sprint':
                bot.clearControlStates();
                bot.setControlState('sprint', true);
                break;
              case 'stop':
                bot.clearControlStates();
                break;
              case 'jump':
                bot.setControlState('jump', true);
                bot.setControlState('jump', false);
                break;
              case 'jump a lot':
                bot.setControlState('jump', true);
                break;
              case 'stop jumping':
                bot.setControlState('jump', false);
                break;
              case 'attack':
                entity[guild.id] = bot.nearestEntity()
                if (entity[guild.id]) {
                  bot.attack(entity[guild.id], true);
                } else {
                  bot.chat('No nearby entities.');
                }
                break;
              case 'mount':
                entity[guild.id] = bot.nearestEntity((entity) => { return entity.type === 'object' })
                if (entity[guild.id]) {
                  bot.mount(entity[guild.id]);
                } else {
                  bot.chat('No nearby objects.');
                }
                break;
              case 'dismount':
                bot.dismount();
                break;
              case 'move vehicle forward':
                bot.moveVehicle(0.0, 1.0);
                break;
              case 'move vehicle backward':
                bot.moveVehicle(0.0, -1.0);
                break;
              case 'move vehicle left':
                bot.moveVehicle(1.0, 0.0);
                break;
              case 'move vehicle right':
                bot.moveVehicle(-1.0, 0.0);
                break;
              case 'tp':
                bot.entity.position.y += 10;
                break;
              case 'pos':
                bot.chat(bot.entity.position.toString());
                break;
              case 'yp':
                bot.chat(`Yaw ${bot.entity.yaw}, pitch: ${bot.entity.pitch}`);
                break;
            }
          }
        });
        bot.on('mount', () => {
          bot.chat(`Mounted ${bot.vehicle.objectType}`);
        });
        
        bot.on('dismount', (vehicle) => {
          bot.chat(`Dismounted ${vehicle.objectType}`);
        });
      }
    }
    else{
      embed.setDescription(`${cross} Server IP and Port not set.`)
        .setColor(0xff4747);
      await message.channel.send(embed).catch(error => {});
      await message.reactions.removeAll();
      react(message, '❌');
      if(viewPort){
        ports[viewPort] = 0;
      }
      return;
    }
  }
}