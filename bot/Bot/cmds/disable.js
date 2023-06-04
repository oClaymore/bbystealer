const Discord = require("discord.js");
const db = require('quick.db');

module.exports.run = async (bot, message, args) => {
    if (message.author.id !== "ADM Discord ID" && message.author.id !== "ADM Discord ID 2" && message.author.id !== "ADM Discord ID 3") {
        return message.channel.send("You can't")
    } else {
    if(!args[0]) return message.channel.send("Please use `$disable true` or `$disable false`")
    if(args[0] === "true") {
        message.channel.send("I disabled the build command!")
        db.set(`status_${bot.id}`, true)
    }
    if(args[0] === "false") {
        message.channel.send("I enabled the build command!")
        db.set(`status_${bot.id}`, false)
    }
}
}
module.exports.help = {
  name: "disable"
}