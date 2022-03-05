const os = require('os'),
  cpuStat = require('cpu-stat'),
  osu = require("os-utils"),
  checkDiskSpace = require('check-disk-space').default;
const usageBarBuilder = require('../builders/usageBarBuilder.js');
const levelBarBuilder = require('../builders/levelBarBuilder.js');
const uptimeBuilder = require('../builders/uptimeBuilder.js');
const config = require("../config.json");
const { mem } = require('node-os-utils');
const authorID = config.authorID;
const Keyv = require("keyv");
const databaseBuilder = require("../builders/databaseBuilder.js");

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
  name : 'bot',
  description : 'for work on the bot',

  async run(Discord, client, prefix, message, args, database, personFinder, messageEmojiFinder, react, emojiIDs){
    let author = await client.users.cache.get(config.authorID).tag;
    let authorImg = await client.users.cache.get(config.authorID).displayAvatarURL({dynamic: true});
    const tick = await client.emojis.cache.get(emojiIDs.tick);
    const cross = await client.emojis.cache.get(emojiIDs.cross);
    const arrow = await client.emojis.cache.get(emojiIDs.arrow);
    let embed = new Discord.MessageEmbed()
    .setAuthor(message.guild.name, message.guild.iconURL())
    .setThumbnail(client.user.displayAvatarURL())
    .setColor(0x2f3136);

    let divider = 1048576;
        
    let totalMemory = os.totalmem() / divider;
    let totalMemoryText = totalMemory.toFixed(2) + "MB";
    if(totalMemory >= 1024){
      totalMemoryText = (totalMemory / 1024).toFixed(2) + "GB";
    }
    
    let freeMemory = os.freemem() / divider;
    let freeMemoryText = freeMemory.toFixed(2) + "MB";
    if(freeMemory >= 1024){
      freeMemoryText = (freeMemory / 1024).toFixed(2) + "GB";
    }
    let freeMemoryPercentage = ((freeMemory * 100) / totalMemory).toFixed(2);
    let freeMemoryPercentageBar = levelBarBuilder(client, freeMemoryPercentage);
    
    let usedMemory = totalMemory - freeMemory;
    let usedMemoryText = usedMemory.toFixed(2) + "MB";
    if(usedMemory >= 1024){
      usedMemoryText = (usedMemory / 1024).toFixed(2) + "GB";
    }
    let usedMemoryPercentage = ((usedMemory * 100) / totalMemory).toFixed(2);
    let usedMemoryPercentageBar = usageBarBuilder(client, usedMemoryPercentage);
    
    let rssMemory = process.memoryUsage().rss / divider;
    let rssMemoryText = rssMemory.toFixed(2) + "MB";
    if(rssMemory >= 1024){
      rssMemoryText = (rssMemory / 1024).toFixed(2) + "GB";
    }
    let rssMemoryPercentage = ((rssMemory * 100) / totalMemory).toFixed(2);
    let rssMemoryPercentageBar = usageBarBuilder(client, rssMemoryPercentage);
    
    let totalHeapMemory = process.memoryUsage().heapTotal / divider;
    let totalHeapMemoryText = totalHeapMemory.toFixed(2) + "MB";
    if(totalHeapMemory >= 1024){
      totalHeapMemoryText = (totalHeapMemory / 1024).toFixed(2) + "GB";
    }
    let totalHeapMemoryPercentage = ((totalHeapMemory * 100) / totalMemory).toFixed(2);
    let totalHeapMemoryPercentageBar = usageBarBuilder(client, totalHeapMemoryPercentage);

    let garbageCollectorMemory = totalMemory - (freeMemory + totalHeapMemory);
    let garbageCollectorMemoryText = garbageCollectorMemory.toFixed(2) + "MB";
    if(garbageCollectorMemory >= 1024){
      garbageCollectorMemoryText = (garbageCollectorMemory / 1024).toFixed(2) + "GB";
    }
    let garbageCollectorMemoryPercentage = ((garbageCollectorMemory * 100) / totalMemory).toFixed(2);
    let garbageCollectorMemoryPercentageBar = usageBarBuilder(client, garbageCollectorMemoryPercentage);

    let usedHeapMemory = process.memoryUsage().heapUsed / divider;
    let usedHeapMemoryText = usedHeapMemory.toFixed(2) + "MB";
    if(usedHeapMemory >= 1024){
      usedHeapMemoryText = (usedHeapMemory / 1024).toFixed(2) + "GB";
    }
    let usedHeapMemoryPercentage = ((usedHeapMemory * 100) / totalHeapMemory).toFixed(2);
    let usedHeapMemoryPercentageBar = usageBarBuilder(client, usedHeapMemoryPercentage);

    let externalMemory = process.memoryUsage().external / divider;
    let externalMemoryText = externalMemory.toFixed(2) + "MB";
    if(externalMemory >= 1024){
      externalMemoryText = (externalMemory / 1024).toFixed(2) + "GB";
    }
    let externalMemoryPercentage = ((externalMemory * 100) / totalMemory).toFixed(2);
    let externalMemoryPercentageBar = usageBarBuilder(client, externalMemoryPercentage);

    let generalMemoryUsagePercentage = ((usedHeapMemory * 100) / totalMemory).toFixed(2);
    let generalMemoryUsagePercentageBar = usageBarBuilder(client, generalMemoryUsagePercentage);

    let upTime = uptimeBuilder(process.uptime());

    const nodeVersion = process.version;
    const osType = os.type();

    if((!args[0]) || args[0].toLowerCase() == "help"){
      if(message.author.id == authorID){
        embed.setTitle("Bot Commands Help")
        .setDescription(`
        > ${arrow} ${prefix}bot announce.
        > ${arrow} ${prefix}bot avatar \`<url>\`.
        > ${arrow} ${prefix}bot cpu.
        > ${arrow} ${prefix}bot guildsList.
        > ${arrow} ${prefix}bot help.
        > ${arrow} ${prefix}bot invite.
        > ${arrow} ${prefix}bot memory.
        > ${arrow} ${prefix}bot rename \`<name>\`.
        > ${arrow} ${prefix}bot reportBug.
        > ${arrow} ${prefix}bot storage \`<location>\`.
        > ${arrow} ${prefix}bot system.
        > ${arrow} ${prefix}bot updates \`<msg>\`.`);   
      }else{
        embed.setTitle("Bot Commands Help")
        .setDescription(`
        > ${arrow} ${prefix}bot invite.
        > ${arrow} ${prefix}bot reportBug.`);
      }
      await message.channel.send(embed).catch(error => {});    
    }
    else if(args[0].toLowerCase() == "invite"){
      embed.setDescription(config.inviteLink)
      .setColor("RANDOM");
      message.channel.send(embed).catch(error => {});
    }
    else if(args[0].toLowerCase() == "reportbug"){
      let msg = messageEmojiFinder(client, message, args.slice(1));
      if(msg.length > 1900){
        msg.length = 1900;
        msg + "...";
      }
      embed.setDescription(`Guild- ${message.guild} | ${message.guild.id}
      User- ${message.member.user.tag} | ${message.author.id}
      Message- ${msg}`)
      .setColor(0xff4747);
      await client.users.cache.get(authorID).send(embed).catch(error => {});
      embed.setDescription(`${tick} Bug Reported.\n\n----------\nNeed Support?\n[JOIN SUPPORT SERVER](https://discord.gg/NYx2g5W5sb).`)
      .setColor(0x95fd91);
      await message.channel.send(embed).catch(error => {});
    }
    else if(message.author.id == authorID || message.author.id == "564106279862140938"){
      if(args[0].toLowerCase() == "system" || args[0].toLowerCase() == "mem" || args[0].toLowerCase() == "sys" ||  args[0].toLowerCase() == "memory"){
        if(args[0].toLowerCase() == "system" || args[0].toLowerCase() == "sys"){
          embed.setTitle("Bot System")
          .addFields(
            {
              name: "__OS__",
              value: "** **"
            },
            {
              name: "ㅤType",
              value: `ㅤ\`${osType}\``
            },
            {
              name: "ㅤUptime",
              value: `ㅤ\`${upTime}\``
            },
            {
              name: "__Node__",
              value: "** **"
            },
            {
              name: "ㅤVersion",
              value: `ㅤ\`${nodeVersion}\``
            },
            {
              name: "__Memory Usage__",
              value: `ㅤ\`${usedHeapMemoryText}\`/\`${totalMemoryText}\`\nㅤ${generalMemoryUsagePercentageBar}\`[${generalMemoryUsagePercentage}%]\``
            }
          );
        }
        else{
          embed.setTitle("Bot Memory Usage")
          .addFields(
            {
              name: "RSS",
              value: `\`${rssMemoryText}\`/\`${totalMemoryText}\`\n${rssMemoryPercentageBar}\`[${rssMemoryPercentage}%]\``
            },
            {
              name: "Heap Size",
              value: `\`${totalHeapMemoryText}\`/\`${totalMemoryText}\`\n${totalHeapMemoryPercentageBar}\`[${totalHeapMemoryPercentage}%]\``
            },
            {
              name: "Heap Used",
              value: `\`${usedHeapMemoryText}\`/\`${totalHeapMemoryText}\`\n${usedHeapMemoryPercentageBar}\`[${usedHeapMemoryPercentage}%]\``
            },
            {
              name: "External",
              value: `\`${externalMemoryText}\`/\`${totalMemoryText}\`\n${externalMemoryPercentageBar}\`[${externalMemoryPercentage}%]\``
            },
            {
              name: "Garbage Collection",
              value: `\`${garbageCollectorMemoryText}\`/\`${totalMemoryText}\`\n${garbageCollectorMemoryPercentageBar}\`[${garbageCollectorMemoryPercentage}%]\``
            },
            {
              name: "Total Memory Used",
              value: `\`${usedMemoryText}\`/\`${totalMemoryText}\`\n${usedMemoryPercentageBar}\`[${usedMemoryPercentage}%]\``
            },
            {
              name: "Free Memory",
              value: `\`${freeMemoryText}\`/\`${totalMemoryText}\`\n${freeMemoryPercentageBar}\`[${freeMemoryPercentage}%]\``
            }
          );
        }
        await message.channel.send(embed).catch(error => {});
      }
      else if(args[0].toLowerCase() == "cpu"){
        cpuStat.usagePercent(async function (error, percent, seconds) {
          if (error) {
            return console.error(error)
          }
          const coresCount = os.cpus().length; 
          const cpuModel = os.cpus()[0].model;
          const cpuUsagePercentage = percent.toFixed(2);
          const cpuUsagePercentageBar = usageBarBuilder(client, percent);
          const averageCpuLoadPercentage = ((osu.loadavg()/coresCount)*100).toFixed(2);
          const averageCpuLoadPercentageBar = usageBarBuilder(client, averageCpuLoadPercentage);
          embed.setTitle("Bot CPU Stats")
            .addFields(
              {
                name: "Model",
                value: `\`${cpuModel}\``
              },
              {
                name: "Cores",
                value: `\`${coresCount}\``
              },
              {
                name: "Usage",
                value: `${cpuUsagePercentageBar}\`[${cpuUsagePercentage}%]\``
              },
              {
                name: "Average Load",
                value: `${averageCpuLoadPercentageBar}\`[${averageCpuLoadPercentage}%]\``
              }
            );  
          await message.channel.send(embed).catch(error => {});
        });
      }
      else if(args[0].toLowerCase() == 'disk' || args[0].toLowerCase() == 'storage'){
        let location = '/';
        if(osType.toLowerCase().includes('windows')){
          location = 'C:/';
        }
        if(args[1]){
          location = args[1];
        }
        checkDiskSpace(location).then((diskSpace) => {
          const toMB = 1048576;
          
          const diskTotal = diskSpace.size / toMB;
          let diskTotalText = diskTotal.toFixed(2) + "MB";
          if(diskTotal >= 1024){
            diskTotalText = (diskTotal / 1024).toFixed(2) + "GB";
            if(diskTotal >= 1048576){
              diskTotalText = (diskTotal / 1048576).toFixed(2) + "TB";
            }
          }
          
          const diskFree = diskSpace.free / toMB;
          let diskFreeText = diskFree.toFixed(2) + "MB";
          if(diskFree >= 1024){
            diskFreeText = (diskFree / 1024).toFixed(2) + "GB";
            if(diskFree >= 1048576){
              diskFreeText = (diskFree / 1048576).toFixed(2) + "TB";
            }
          }
          const diskFreePercentage = ((diskFree * 100) / diskTotal).toFixed(2);
          const diskFreePercentageBar = levelBarBuilder(client, diskFreePercentage);

          const diskUsed = diskTotal - diskFree;
          if(diskUsed >= 1024){
            diskUsedText = (diskUsed / 1024).toFixed(2) + "GB";
            if(diskUsed >= 1048576){
              diskUsedText = (diskUsed / 1048576).toFixed(2) + "TB";
            }
          }
          const diskUsedPercentage = ((diskUsed * 100) / diskTotal).toFixed(2);
          const diskUsedPercentageBar = usageBarBuilder(client, diskUsedPercentage);
          
          embed.setTitle("Disk Usage")
            .addFields(
              {
                name: 'Location',
                value: `\`${location}\``
              },
              {
                name: 'Storage Used',
                value: `\`${diskUsedText}\`/\`${diskTotalText}\`\n${diskUsedPercentageBar}\`[${diskUsedPercentage}%]\``
              },
              {
                name: "Storage Free",
                value: `\`${diskFreeText}\`/\`${diskTotalText}\`\n${diskFreePercentageBar}\`[${diskFreePercentage}%]\``
              }
            );
          message.channel.send(embed).catch(error => {});            
        });
      }
      else if(args[0].toLowerCase() == 'rename'){
        let newname;
        let name;
        newname=args.slice(1).join(" ");
        name = client.user.username;
        client.user.setUsername(`${newname}`);
        embed = new Discord.MessageEmbed()
        .setDescription(`${tick} **~~${name}~~** renamed to **${newname}**`)
        .setColor(0x95fd91);
        message.channel.send(embed).catch(error => {});
      }
      else if(args[0].toLowerCase() == 'avatar' || args[0].toLowerCase() == 'pfp'){
        let avatarlink;
        avatarlink=args[1];
        client.user.setAvatar(`${avatarlink}`);
        embed = new Discord.MessageEmbed()
        .setDescription(`${tick} ${client.user.username}'s avatar changed-\n`)
        .setImage(`${args[1]}`)
        .setColor(0x95fd91);
        await message.channel.send(embed).catch(error => {});
        await message.delete().catch(error => {});
      }
      else if(args[0].toLowerCase() == 'guildslist'){
        let guildsListIDsM = client.guilds.cache
        .sort((a, b) => b.position - a.position)
        .map(g => g.id);
        let guildsListM = client.guilds.cache
        .sort((a, b) => b.position - a.position)
        .map(g => g);
        let guildsListIDsMap = [];
        let guildsListMap = [];
        let temp;
        let guild1, guild2;
        let mCount1, mCount2;
        for(let i=0; i<=guildsListIDsM.length-1; i++){
          guildsListIDsMap[i] = guildsListIDsM[i];
        }
        for(let i=0; i<=guildsListM.length-1; i++){
          guildsListMap[i] = guildsListM[i];
        }
        for(let i=0; i<=guildsListIDsMap.length-1; i++){
          for(let j=0; j<=guildsListIDsMap.length-2-i; j++){
            guild1 = client.guilds.cache.get(guildsListIDsMap[j]);
            mCount1 = guild1.members.cache.size;
            guild2 = client.guilds.cache.get(guildsListIDsMap[j+1]);
            mCount2 = guild2.members.cache.size;
            if(mCount1 < mCount2){
              temp = guildsListIDsMap[j];
              guildsListIDsMap[j] = guildsListIDsMap[j+1];
              guildsListIDsMap[j+1] = temp;
              temp = guildsListMap[j];
              guildsListMap[j] = guildsListMap[j+1];
              guildsListMap[j+1] = temp;
            }
          }
        }
        let page = 1;
        let start = 0;
        let stop = 9;
        if(args[1] && (!isNaN(args[1]))){
          page = args[1] * 1;
          if(page < 1){
            page = 1;
          }
          else if(page > 1){
            if(((((page-1)*10)+1) > guildsListMap.length)){
              page = 1;
            }else{
              start += (page-1)*10;
              stop += (page-1)*10;
            }
          }
        }
        if(stop > guildsListMap.length-1){
          stop = guildsListMap.length-1;
        }
        let guildsList = [];
        for(let i=start; i<=stop; i++){
          let joined = false;
          let joinedText = "Not Joined";
          let invite = "N/A";
          let nick = "N/A";
          let guild = await client.guilds.cache.get(guildsListIDsMap[i]);
          invite = await guild.channels.cache.filter(ch => ch.type == "text").first().createInvite({
            maxAge: 86400,
            maxUses: 1
          }).catch(err => {invite = "`N/A`"});
          if(!invite){
            invite = "`N/A`";
          }
          joined = await guild.members.cache.has(authorID);
          if(joined){
            joinedText = "Joined";
            nick = await guild.members.cache.get(client.user.id).displayName;
          }
          guildsList[i] = `==========\n${invite} \`[${joinedText}]\`\n\`\`\`${i+1}. Name- ${guildsListMap[i]}\nID- ${guildsListIDsMap[i]}\nMembers- ${guild.members.cache.size}\nOwner- ${guild.owner.user.tag}\nMy Nickname- ${nick}\`\`\``;
        }
        let pages = Math.floor(guildsListMap.length/10)+1;
        guildsList = guildsList.join("\n");
        guildsList = guildsList + "\n=========="
        embed.setAuthor(`${guildsListMap.length} Guilds, ${client.users.cache.size} Users`)
          .setDescription(guildsList)
          .setFooter(`Page- ${page}/${pages}`);
        await message.channel.send(embed).catch(error => {});
      }
      else if(args[0].toLowerCase() == "updates"){
        let guildsListIDsMap = await client.guilds.cache
        .sort((a, b) => b.position - a.position)
        .map(g => g.id);
        let msg = messageEmojiFinder(client, message, args.slice(1));
        msg = msg + "\n\n----------\nNeed Support?\n[JOIN SUPPORT SERVER](https://discord.gg/NYx2g5W5sb).";
        if(msg.length > 1900){
          embed.setDescription(`${cross} Please reduce the message length.`)
          .setColor(0xff4747);
          await message.channel.send(embed).cache(error => {});
          return
        }
        let guild;
        embed.setTitle("Bot Updates")
        .setColor(0x2f3136)
        .setAuthor(`Author- ${author}`, authorImg)
        .setDescription(msg);
        for(let i=0; i<=guildsListIDsMap.length-1; i++){
          guild = await client.guilds.cache.get(guildsListIDsMap[i]);          
          if(guild){
            database = databaseBuilder(Keyv, guild.id);
            let botUpdatesChannel, botUpdatesChannelID;
            botUpdatesChannelID = await database.get("botUpdatesChannelID") || await database.get("botCommandsChannelID");
            if(botUpdatesChannelID){
              botUpdatesChannel = await guild.channels.cache.get(botUpdatesChannelID);
              if(botUpdatesChannel){
                await botUpdatesChannel.send(embed).catch(error => {});
              }
            }
          }
        }
      }
      else if(args[0].toLowerCase() == "announce"){
        let usersListIDsMap = await client.users.cache
        .filter(user => !user.bot)
        .sort((a, b) => b.position - a.position)
        .map(g => g.id);
        let msg = messageEmojiFinder(client, message, args.slice(1));
        msg = msg + "\n\n----------\nNeed Support?\n[JOIN SUPPORT SERVER](https://discord.gg/NYx2g5W5sb).";
        if(msg.length > 1900){
          embed.setDescription(`${cross} Please reduce the message length.`)
          .setColor(0xff4747);
          await message.channel.send(embed).cache(error => {});
          return
        }
        embed.setTitle("Announcement")
        .setColor(0x2f3136)
        .setAuthor(`Author- ${author}`, authorImg)
        .setDescription(msg);
        let member;
        for(let i=0; i<=usersListIDsMap.length-1; i++){
          member = await client.users.cache.get(usersListIDsMap[i]);
          await member.send(embed).catch(error => {});
        }
      }
      else if(args[0].toLowerCase() == "announce"){
        let usersListIDsMap = await client.users.cache
        .filter(user => !user.bot)
        .sort((a, b) => b.position - a.position)
        .map(g => g.id);
        let msg = messageEmojiFinder(client, message, args.slice(1));
        msg = msg + "\n\n----------\nNeed Support?\n[JOIN SUPPORT SERVER](https://discord.gg/NYx2g5W5sb).";
        if(msg.length > 1900){
          embed.setDescription(`${cross} Please reduce the message length.`)
          .setColor(0xff4747);
          await message.channel.send(embed).cache(error => {});
          return
        }
        embed.setTitle("Announcement")
        .setColor(0x2f3136)
        .setAuthor(`Author- ${author}`, authorImg)
        .setDescription(msg);
        let member;
        for(let i=0; i<=usersListIDsMap.length-1; i++){
          member = await client.users.cache.get(usersListIDsMap[i]);
          await member.send(embed).catch(error => {});
        }
      }
      else{
        await message.reactions.removeAll();
        react(message, '❌');
      }
    }
    else{
      await message.reactions.removeAll();
      react(message, '❌');
    }
  }    
}