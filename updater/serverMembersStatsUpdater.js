module.exports = async(member, database) => {
  const totalMembersChannelID = await database.get("totalMemberCountChannelID");
  const membersChannelID = await database.get("memberCountChannelID");
  const botsCountChannelID = await database.get("botsCountChannelID");
  const bannedUsersCountChannelID = await database.get("bannedUsersCountChannelID");
  if(totalMembersChannelID){
    let totalMembersChannel = await member.guild.channels.cache.get(totalMembersChannelID);
    if(totalMembersChannel){
      await totalMembersChannel.setName(`All Members: ${member.guild.memberCount}`);
    }
  }
  if(membersChannelID){
    let membersChannel = await member.guild.channels.cache.get(membersChannelID);
    if(membersChannel){
      await membersChannel.setName(`Members: ${member.guild.members.cache.filter(m => !m.user.bot).size}`);
    }
  }
  if(botsCountChannelID){
    let botsCountChannel = await member.guild.channels.cache.get(botsCountChannelID);
    if(botsCountChannel){
      await botsCountChannel.setName(`Bots: ${member.guild.members.cache.filter(m => m.user.bot).size}`);
    }
  }
  if(bannedUsersCountChannelID){
    let bannedUsersCountChannel = await member.guild.channels.cache.get(bannedUsersCountChannelID);
    if(bannedUsersCountChannel){
      let bans = await member.guild.fetchBans();
      await bannedUsersCountChannel.setName(`Banned Users: ${bans.size}`);
    }
  }
}