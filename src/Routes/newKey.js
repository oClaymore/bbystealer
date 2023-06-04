const Key = require('../Models/key');

module.exports = async (req, res) => {
    const { key, webhook } = req.body
    if (!key) return;
    if (!webhook) return;
    const data = await Key.find({ Key: key })
    if (data.length) return res.send('Exist');
    const newData = new Key({ Key: key, Webhook: webhook })
    await newData.save()
    res.sendStatus(200)
    return;
}