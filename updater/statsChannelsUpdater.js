module.exports = async(guild, database) => {
  const normalTicketsCountChannelID = await database.get("normalTicketsCountChannelID");
  const bugTicketsCountChannelID = await database.get("bugTicketsCountChannelID");
  const reportTicketsCountChannelID = await database.get("reportTicketsCountChannelID");
  const totalTicketsCountChannelID = await database.get("totalTicketsCountChannelID");
  const totalChannelsCountChannelID = await database.get("totalTicketsCountChannelID");
  const totalRolesCountChannelID = await database.get("totalRolesCountChannelID");
  const totalTextChannelsCountChannelID = await database.get("totalTicketsCountChannelID");
  const totalVoiceChannelsCountChannelID = await database.get("totalVoiceChannelsCountChannelID");
  const totalNewsChannelsCountChannelID = await database.get("totalNewsChannelsCountChannelID");
  if(normalTicketsCountChannelID){
    let normalTicketsCountChannel = await guild.channels.cache.get(normalTicketsCountChannelID);
    if(normalTicketsCountChannel){
      await normalTicketsCountChannel.setName(`Normal Tickets: ${guild.channels.cache.filter(ch => ch.name.startsWith("ticket-")).size}`).catch(error => {});
    }
  }
  if(bugTicketsCountChannelID){
    let bugTicketsCountChannel = await guild.channels.cache.get(bugTicketsCountChannelID);
    if(bugTicketsCountChannel){
      await bugTicketsCountChannel.setName(`Bug Tickets: ${guild.channels.cache.filter(ch => ch.name.startsWith("bug-")).size}`).catch(error => {});
    }
  }
  if(reportTicketsCountChannelID){
    let reportTicketsCountChannel = await guild.channels.cache.get(reportTicketsCountChannelID);
    if(reportTicketsCountChannel){
      await reportTicketsCountChannel.setName(`Report Tickets: ${guild.channels.cache.filter(ch => ch.name.startsWith("report-")).size}`).catch(error => {});
    }
  }
  if(totalTicketsCountChannelID){
    let size = await guild.channels.cache.filter(ch => ch.name.startsWith("ticket-")).size;
    size += await guild.channels.cache.filter(ch => ch.name.startsWith("bug-")).size;
    size += await guild.channels.cache.filter(ch => ch.name.startsWith("report-")).size;
    let totalTicketsCountChannel = await guild.channels.cache.get(totalTicketsCountChannelID);
    if(totalTicketsCountChannel){
      await totalTicketsCountChannel.setName(`Total Tickets: ${size}`).catch(error => {});
    }
  }
  if(totalChannelsCountChannelID){
    let totalChannelsCountChannel = await guild.channels.cache.get(totalChannelsCountChannelID);
    if(totalChannelsCountChannel){
      await totalChannelsCountChannel.setName(`Total Channels: ${guild.channels.cache.size}`).catch(error => {});
    }
  }
  if(totalRolesCountChannelID){
    let totalRolesCountChannel = await database.get(totalRolesCountChannelID);
    if(totalRolesCountChannel){
      await totalRolesCountChannel.setName(`Total Roles: ${guild.roles.cache.size}`).catch(error => {});
    }
  }
  if(totalTextChannelsCountChannelID){
    let totalTextChannelsCountChannel = await guild.channels.cache.get(totalTextChannelsCountChannelID);
    if(totalTextChannelsCountChannel){
      await totalTextChannelsCountChannel.setName(`Total Channels: ${guild.channels.cache.filter(ch => ch.type == "text").size}`).catch(error => {});
    }
  }
  if(totalVoiceChannelsCountChannelID){
    let totalVoiceChannelsCountChannel = await guild.channels.cache.get(totalVoiceChannelsCountChannelID);
    if(totalVoiceChannelsCountChannel){
      await totalVoiceChannelsCountChannel.setName(`Total Channels: ${guild.channels.cache.filter(ch => ch.type == "voice").size}`).catch(error => {});
    }
  }
  if(totalNewsChannelsCountChannelID){
    let totalNewsChannelsCountChannel = await guild.channels.cache.get(totalNewsChannelsCountChannelID);
    if(totalNewsChannelsCountChannel){
      await totalNewsChannelsCountChannel.setName(`Total Channels: ${guild.channels.cache.filter(ch => ch.type == "news").size}`).catch(error => {});
    }
  }
}