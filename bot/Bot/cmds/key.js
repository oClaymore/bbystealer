const Discord = require("discord.js");
const db = require("quick.db")

module.exports.run = async (bot, message, args) => {
    if (message.author.id !== "ADM Discord ID" && message.author.id !== "ADM Discord ID 2" && message.author.id !== "ADM Discord ID 3") {
        return message.channel.send("You can't")
    } else {

        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!user) return message.channel.send("Specify a user")

        let key = `SUDRY-${random(4)}-${random(4)}`

        console.log(key)
        message.channel.send(new Discord.MessageEmbed()
          .setDescription(`${user} __Look DM:__`)
          .setColor("2f3136")
          .setFooter("RustlerStealer")
          .setAuthor('RustlerStealer', 'https://c.tenor.com/T3So8nwWyDkAAAAC/grunge-girl-aesthetic.gif')
          .setTimestamp()
        );
        user.send(`Hey, thanks for using Rustler Stealer!\nYour key: \`${key}\``).catch(() => {})
        db.push(`keys_${bot.id}`, { id: user.id, cle: key })
        const SudryLOGS = new Discord.MessageEmbed()
        .setAuthor('RustlerStealer', 'https://c.tenor.com/T3So8nwWyDkAAAAC/grunge-girl-aesthetic.gif')
        .setColor('2f3136')
        .addFields(
          {            
          name: "Author:",
          value: `*<@${message.author.id}> (${message.author.id})*`,
          inline: true
        },
        {            
          name: "Member:",
          value: `*<@${user.id}> (${user.id})*`,
          inline: true
         },
        {
          name: "Key:",
          value: `*${key}*`,
          inline: true
        }, )
        .setTimestamp()
        .setFooter('RustlerStealer');
    
      let SudryLog = bot.channels.cache.get(bot.config.logs);
      SudryLog.send(SudryLOGS);
    }
}

function random(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

module.exports.help = {
    name: "key"
}