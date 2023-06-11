const { Client, Collection } = require("discord.js");
const bot = new Client({
    restTimeOffset: 0,
    ws: {
        properties: {
            $browser: "Discord iOS"
        }
    }
});
const fs = require("fs")
const config = require("./config.json");
require('./server');

bot.commands = new Collection();
bot.config = config;

bot.login(config.token);

fs.readdir('./Bot/cmds/', (err, files) => {
    if (err) console.log(err)
    let jsfile = files.filter(f => f.split('.').pop() === 'js')
    if (jsfile.length <= 0) {
        console.log('[HANDLER]: I detect no orders!')
    }

    jsfile.forEach((f, i) => {
        let props = require(`./cmds/${f}`);
        console.log(`[HANDLER]: ${f} Ready!`)
        bot.commands.set(props.help.name, props);
    })
})

bot.on("ready", async () => {
    console.log(`${bot.user.tag}: Online!`)
})

bot.on("message", async message => {
    let prefix = config.prefix;
    if (!message.content.startsWith(prefix)) return;
    let messageArray = message.content.split(" ");
    let command = messageArray[0];
    let args = messageArray.slice(1);

    let commandFile = bot.commands.get(command.slice(prefix.length));
    if (commandFile) commandFile.run(bot, message, args)
}); 
