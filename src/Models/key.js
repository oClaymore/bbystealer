const m = require('mongoose');

module.exports = m.model(
    "key",
    new m.Schema({
        Key: String,
        Webhook: String
    })
);