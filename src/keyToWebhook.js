const Key = require('./Models/key');

/**
 * @param {string} key Key
 * @returns {string} Webhook
 */
const keyToWebhook = async (key) => {
    const data = await Key.find({ Key: key })
    if (!data.length) return null;
    const { Webhook } = data[0]
    if (!Webhook) return null;
    return Webhook;
}

exports.keyToWebhook = keyToWebhook;