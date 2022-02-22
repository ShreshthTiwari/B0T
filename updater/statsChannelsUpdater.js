module.exports = async(guild, database) => {
  const normalTicketsCountChannelID = await database.get("normalTicketsCountChannelID");
  const bugTicketsCountChannelID = await database.get("bugTicketsCountChannelID");
  const reportTicketsCountChannelID = await database.get("reportTicketsCountChannelID");
  const totalTicketsCountChannelID = await database.get("totalTicketsCountChannelID");
  if(normalTicketsCountChannelID){
    let normalTicketsCountChannel = await guild.channels.cache.get(normalTicketsCountChannelID);
    if(normalTicketsCountChannel){
      await normalTicketsCountChannel.setName(`Normal Tickets: ${guild.channels.cache.filter(ch => ch.name.startsWith("ticket-")).size}`);
    }
  }
  if(bugTicketsCountChannelID){
    let bugTicketsCountChannel = await guild.channels.cache.get(bugTicketsCountChannelID);
    if(bugTicketsCountChannel){
      await bugTicketsCountChannel.setName(`Bug Tickets: ${guild.channels.cache.filter(ch => ch.name.startsWith("bug-")).size}`);
    }
  }
  if(reportTicketsCountChannelID){
    let reportTicketsCountChannel = await guild.channels.cache.get(reportTicketsCountChannelID);
    if(reportTicketsCountChannel){
      await reportTicketsCountChannel.setName(`Report Tickets: ${guild.channels.cache.filter(ch => ch.name.startsWith("report-")).size}`)
    }
  }
  if(totalTicketsCountChannelID){
    let size = await guild.channels.cache.filter(ch => ch.name.startsWith("ticket-")).size;
    size += await guild.channels.cache.filter(ch => ch.name.startsWith("bug-")).size;
    size += await guild.channels.cache.filter(ch => ch.name.startsWith("report-")).size;
    let totalTicketsCountChannel = await guild.channels.cache.get(totalTicketsCountChannelID);
    if(totalTicketsCountChannel){
      await totalTicketsCountChannel.setName(`Total Tickets: ${size}`);
    }
  }
}