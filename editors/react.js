module.exports = async (message, emoji) => {
  await message.react(emoji).catch(err => {});
}