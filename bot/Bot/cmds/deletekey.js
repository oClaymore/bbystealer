const Discord = require("discord.js");
const db = require("quick.db")

module.exports.run = async (bot, message, args) => {
    if (message.author.id !== "Your ID" && message.author.id !== "ID of other adm" && message.author.id !== "ID of other adm") {
        return message.channel.send("You can't.")
    } else {

        const key = args[0];
        if (!key) return message.channel.send("Specify a key")

        const keydb = Object.values(db.get(`keys_${bot.id}`)).find(element => element.cle === key);
        if (!keydb) return message.channel.send('This key does not exist');
        const data = Object.values(db.get(`keys_${bot.id}`));
        const newArray = [];
        for (let d of data) {
            if (d.cle == key) continue;
            else newArray.push(d)
        }
        db.set(`keys_${bot.id}`, newArray);
        return message.channel.send('Key deleted')
    }
}

module.exports.help = {
    name: "deletekey"
}
