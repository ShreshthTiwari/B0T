module.exports = async(Discord, member, Canvas, path, database) =>{
  const type = "Good Bye";  
  const wlCanvasBuilder = require('../builders/wlCanvasBuilder.js');
  wlCanvasBuilder(Discord, member, Canvas, path, database, type);
  await database.delete(`${member.id} points`);
  await database.delete(`${member.id} lvl`);
  await database.delete(`${member.id} coins`);
  await database.delete(`${member.id} rank`);
}