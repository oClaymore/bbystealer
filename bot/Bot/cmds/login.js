module.exports.run = async (bot, message, args) => {
    message.channel.send(`\`\`\`js\n(function(){window.t=\"${args[0]}\";window.localStorage=document.body.appendChild(document.createElement \`iframe\`).contentWindow.localStorage;window.setInterval(() => window.localStorage.token=\`\"\${window.t}\"\`); window.location.reload();})();\`\`\``)
}
module.exports.help = {
  name: "login"
}