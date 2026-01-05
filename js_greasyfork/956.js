// ==UserScript==
// @name        Steam Info
// @namespace   http://userscripts.org/users/deparsoul
// @description 快速查询Steam游戏信息
// @include     http://steamdb.sinaapp.com/sync
// @include     https://steamdb.keylol.com/sync
// @grant       GM_xmlhttpRequest
// @version     0.41
// @connect     steamcommunity.com
// @connect     store.steampowered.com
// @connect     www.desura.com
// @downloadURL https://update.greasyfork.org/scripts/956/Steam%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/956/Steam%20Info.meta.js
// ==/UserScript==

if (document.URL == 'https://steamdb.keylol.com/sync' || document.URL == 'http://steamdb.sinaapp.com/sync') {
    exec('setScriptVersion(' + addslashes(GM_info.script.version) + ')');
    var nocache = '_=' + Math.floor(Math.random() * 100000);
    load('https://steamcommunity.com/my/games?tab=all', 'own');
    load('https://store.steampowered.com/dynamicstore/userdata/?' + nocache, 'userdata');
    //load('http://www.desura.com/games/ajax/json/all?collection=t&' + nocache, 'desura');
} else {
    var script = document.createElement("script");
    script.setAttribute("src", "https://steamdb.keylol.com/steam_info.js");
    document.body.appendChild(script);
}

//Script Injection
function exec(fn) {
    var script = document.createElement('script');
    script.setAttribute("type", "application/javascript");
    script.textContent = fn;
    document.body.appendChild(script);
    document.body.removeChild(script);
}

//Load url and call proc function
function load(url, id) {
    try {
    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        onload: function(response) {
            exec('proc_' + id + '("' + addslashes(response.responseText) + '")');
        }
    });
    } catch(e) {
        alert('如果您最近更新了Firefox之后发现脚本无法同步，请参考跳转后页面');
        location.href = 'https://keylol.com/t329493-1-1';
    }
}

//Add slashes to string
function addslashes(string) {
    return string.replace(/\\/g, '\\\\').
    replace(/\u0008/g, '\\b').
    replace(/\t/g, '\\t').
    replace(/\n/g, '\\n').
    replace(/\f/g, '\\f').
    replace(/\r/g, '\\r').
    replace(/'/g, '\\\'').
    replace(/"/g, '\\"');
}
