const Discord = require("discord.js");
const db = require("quick.db")

module.exports.run = async (bot, message, args) => {
    const key = args[0];
    if (!key) return message.channel.send(`Invalid argument! Use: ${bot.config.prefix}getrole <key>`);
    const keydb = Object.values(db.get(`keys_${bot.id}`)).find(element => element.cle === key);
    if (!keydb) return message.channel.send("Your key is invalid.");
    if (keydb.id !== message.author.id) return message.channel.send("You don't own that key, silly.");
    await message.member.roles.add(bot.config.customerRole)
    .then(() => {
      return message.channel.send('Ready!')
    })
    .catch(() => {
      return message.channel.send('An error occured')
    })
};

module.exports.help = {
  name: "getrole"
}
