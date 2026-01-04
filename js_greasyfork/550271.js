// ==UserScript==
// @name         Others' challenge results
// @namespace    http://tampermonkey.net/
// @version      2025-09-23
// @description  Shows where other people went on a challenge round as you play it, similar to Geoguessr
// @author       You
// @match        *://geotastic.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geotastic.net
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550271/Others%27%20challenge%20results.user.js
// @updateURL https://update.greasyfork.org/scripts/550271/Others%27%20challenge%20results.meta.js
// ==/UserScript==
// === BEGIN MD5 ===
// credit: https://www.myersdaily.org/joseph/javascript/md5-text.html
function md5cycle(x, k) {
    var a = x[0],
        b = x[1],
        c = x[2],
        d = x[3];

    a = ff(a, b, c, d, k[0], 7, -680876936);
    d = ff(d, a, b, c, k[1], 12, -389564586);
    c = ff(c, d, a, b, k[2], 17, 606105819);
    b = ff(b, c, d, a, k[3], 22, -1044525330);
    a = ff(a, b, c, d, k[4], 7, -176418897);
    d = ff(d, a, b, c, k[5], 12, 1200080426);
    c = ff(c, d, a, b, k[6], 17, -1473231341);
    b = ff(b, c, d, a, k[7], 22, -45705983);
    a = ff(a, b, c, d, k[8], 7, 1770035416);
    d = ff(d, a, b, c, k[9], 12, -1958414417);
    c = ff(c, d, a, b, k[10], 17, -42063);
    b = ff(b, c, d, a, k[11], 22, -1990404162);
    a = ff(a, b, c, d, k[12], 7, 1804603682);
    d = ff(d, a, b, c, k[13], 12, -40341101);
    c = ff(c, d, a, b, k[14], 17, -1502002290);
    b = ff(b, c, d, a, k[15], 22, 1236535329);

    a = gg(a, b, c, d, k[1], 5, -165796510);
    d = gg(d, a, b, c, k[6], 9, -1069501632);
    c = gg(c, d, a, b, k[11], 14, 643717713);
    b = gg(b, c, d, a, k[0], 20, -373897302);
    a = gg(a, b, c, d, k[5], 5, -701558691);
    d = gg(d, a, b, c, k[10], 9, 38016083);
    c = gg(c, d, a, b, k[15], 14, -660478335);
    b = gg(b, c, d, a, k[4], 20, -405537848);
    a = gg(a, b, c, d, k[9], 5, 568446438);
    d = gg(d, a, b, c, k[14], 9, -1019803690);
    c = gg(c, d, a, b, k[3], 14, -187363961);
    b = gg(b, c, d, a, k[8], 20, 1163531501);
    a = gg(a, b, c, d, k[13], 5, -1444681467);
    d = gg(d, a, b, c, k[2], 9, -51403784);
    c = gg(c, d, a, b, k[7], 14, 1735328473);
    b = gg(b, c, d, a, k[12], 20, -1926607734);

    a = hh(a, b, c, d, k[5], 4, -378558);
    d = hh(d, a, b, c, k[8], 11, -2022574463);
    c = hh(c, d, a, b, k[11], 16, 1839030562);
    b = hh(b, c, d, a, k[14], 23, -35309556);
    a = hh(a, b, c, d, k[1], 4, -1530992060);
    d = hh(d, a, b, c, k[4], 11, 1272893353);
    c = hh(c, d, a, b, k[7], 16, -155497632);
    b = hh(b, c, d, a, k[10], 23, -1094730640);
    a = hh(a, b, c, d, k[13], 4, 681279174);
    d = hh(d, a, b, c, k[0], 11, -358537222);
    c = hh(c, d, a, b, k[3], 16, -722521979);
    b = hh(b, c, d, a, k[6], 23, 76029189);
    a = hh(a, b, c, d, k[9], 4, -640364487);
    d = hh(d, a, b, c, k[12], 11, -421815835);
    c = hh(c, d, a, b, k[15], 16, 530742520);
    b = hh(b, c, d, a, k[2], 23, -995338651);

    a = ii(a, b, c, d, k[0], 6, -198630844);
    d = ii(d, a, b, c, k[7], 10, 1126891415);
    c = ii(c, d, a, b, k[14], 15, -1416354905);
    b = ii(b, c, d, a, k[5], 21, -57434055);
    a = ii(a, b, c, d, k[12], 6, 1700485571);
    d = ii(d, a, b, c, k[3], 10, -1894986606);
    c = ii(c, d, a, b, k[10], 15, -1051523);
    b = ii(b, c, d, a, k[1], 21, -2054922799);
    a = ii(a, b, c, d, k[8], 6, 1873313359);
    d = ii(d, a, b, c, k[15], 10, -30611744);
    c = ii(c, d, a, b, k[6], 15, -1560198380);
    b = ii(b, c, d, a, k[13], 21, 1309151649);
    a = ii(a, b, c, d, k[4], 6, -145523070);
    d = ii(d, a, b, c, k[11], 10, -1120210379);
    c = ii(c, d, a, b, k[2], 15, 718787259);
    b = ii(b, c, d, a, k[9], 21, -343485551);

    x[0] = add32(a, x[0]);
    x[1] = add32(b, x[1]);
    x[2] = add32(c, x[2]);
    x[3] = add32(d, x[3]);

}

function cmn(q, a, b, x, s, t) {
    a = add32(add32(a, q), add32(x, t));
    return add32((a << s) | (a >>> (32 - s)), b);
}

function ff(a, b, c, d, x, s, t) {
    return cmn((b & c) | ((~b) & d), a, b, x, s, t);
}

function gg(a, b, c, d, x, s, t) {
    return cmn((b & d) | (c & (~d)), a, b, x, s, t);
}

function hh(a, b, c, d, x, s, t) {
    return cmn(b ^ c ^ d, a, b, x, s, t);
}

function ii(a, b, c, d, x, s, t) {
    return cmn(c ^ (b | (~d)), a, b, x, s, t);
}

function md51(s) {
    var n = s.length,
        state = [1732584193, -271733879, -1732584194, 271733878],
        i;
    for (i = 64; i <= s.length; i += 64) {
        md5cycle(state, md5blk(s.slice(i - 64, i)));
    }
    s = s.slice(i - 64);
    var tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (i = 0; i < s.length; i++)
        tail[i >> 2] |= s[i] << ((i % 4) << 3);
    tail[i >> 2] |= 0x80 << ((i % 4) << 3);
    if (i > 55) {
        md5cycle(state, tail);
        for (i = 0; i < 16; i++) tail[i] = 0;
    }
    tail[14] = n * 8;
    md5cycle(state, tail);
    return new Uint8Array((new Int32Array(state)).buffer);
}

/* there needs to be support for Unicode here,
 * unless we pretend that we can redefine the MD-5
 * algorithm for multi-byte characters (perhaps
 * by adding every four 16-bit characters and
 * shortening the sum to 32 bits). Otherwise
 * I suggest performing MD-5 as if every character
 * was two bytes--e.g., 0040 0025 = @%--but then
 * how will an ordinary MD-5 sum be matched?
 * There is no way to standardize text to something
 * like UTF-8 before transformation; speed cost is
 * utterly prohibitive. The JavaScript standard
 * itself needs to look at this: it should start
 * providing access to strings as preformed UTF-8
 * 8-bit unsigned value arrays.
 */
function md5blk(s) {
    /* I figured global was faster.   */
    var md5blks = [],
        i; /* Andy King said do it this way. */
    for (i = 0; i < 64; i += 4) {
        md5blks[i >> 2] = s[i] +
            (s[i + 1] << 8) +
            (s[i + 2] << 16) +
            (s[i + 3] << 24);
    }
    return md5blks;
}

function add32(a, b) {
    return (a + b) & 0xFFFFFFFF;
}
// === END MD5 ===
const PASSWORD = "4317969d37f68d4f54eae689d8088eba";

function evpBytesToKey(salt, password, keyLen = 32, ivLen = 16) {
    let d = new Uint8Array(0);
    let passwdArr = new Uint8Array(PASSWORD.split('').map(k => k.charCodeAt(0)));
    while (d.length < (keyLen + ivLen)) {
        let rem = d.slice(-16);
        let toHash = new Uint8Array(rem.length + passwdArr.length + salt.length);
        toHash.set(rem, 0);
        toHash.set(passwdArr, rem.length);
        toHash.set(salt, rem.length + passwdArr.length);
        let addD = md51(toHash);
        let newD = new Uint8Array(d.length + addD.length);
        newD.set(d, 0);
        newD.set(addD, d.length);
        d = newD;
    }
    return {
        key: d.slice(0, keyLen),
        iv: d.slice(keyLen, keyLen + ivLen)
    }
}
async function aesDecrypt(ct, salt) {
    const keyIv = evpBytesToKey(salt, PASSWORD);
    const cryptoKey = await crypto.subtle.importKey("raw", keyIv.key, "AES-CBC", false, ["decrypt"]);
    const decrypted = await crypto.subtle.decrypt({
        name: "AES-CBC",
        iv: keyIv.iv
    }, cryptoKey, ct);
    return new TextDecoder().decode(decrypted);
}
async function decodeEncdata(json) {
    const salt = Uint8Array.fromHex(json.s);
    const ct = Uint8Array.fromBase64(json.ct);
    return JSON.parse(await aesDecrypt(ct, salt));
}
const challengeDropsRegex = /getChallengeDrops.php\?id=(\d+)/;
const lastRoundSeenRegex = /updateLastRoundSeen.php/;
const challengePickRegex = /updateChallengePick.php/;
const finishRegex = /finishChallenge.php/;
const itemsRegex = /getItems.php/;


const lineSymbol = {
    path: 'M 0,-1 0,1',
    strokeOpacity: 1,
    scale: 2,
};

window.markersToClear = [];
window.finished = new Set();
var checkInterval = setInterval(function() {
    if (typeof google === 'object' && typeof google.maps === 'object' && typeof google.maps.Map === 'function') {
        
        var originalMap = google.maps.Map;
        google.maps.Map = function() {
            var instance = new originalMap(...arguments);
            window.capturedMap = instance
            return instance
        }
        clearInterval(checkInterval); // Stop checking once the module is loaded
    }
}, 10);

function getMarkerUrl(itemUid) {
    if (!window.items) {
        return null;
    }
    for (var item of window.items) {
        if (item.uid === itemUid && item.type == "marker") {
            return `https://static.geo.edutastic.de/${item.imageUrl}`;
        }
    }
}

function fetchChallengeResults(challengeId) {
    fetch(`https://backend01.geotastic.net/v1/challenge/getChallengeResults.php?id=${challengeId}`, {
        headers: {
            'X-Auth-Token': window.localStorage.token
        }
    }).then(
        (result) => {
            result.json().then(
                (json) => {
                    
                    window.challengeResults = json
                }
            )
        }
    );
}
var oldOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function(method, url) {
    
    // starting a challenge
    if (method === "GET" && challengeDropsRegex.test(url)) {
        window.challengeId = challengeDropsRegex.exec(url)[1];
        if (finished.has(window.challengeId)) {
            return oldOpen.apply(this, arguments);
        }
        window.roundNo = -1;
        fetchChallengeResults(window.challengeId);
        
        this.addEventListener("load", function() {
            const response = JSON.parse(this.responseText);
            const encoded = JSON.parse(response.encData);
            decodeEncdata(encoded).then((result) => {
                window.challengeDrops = result
            });
        });
    }
    // new round
    else if (method === "POST" && lastRoundSeenRegex.test(url)) {
        window.roundNo++;
        for (var m of window.markersToClear) {
            m.setMap(null);
        }
    }
    // end round
    else if (method === "POST" && challengePickRegex.test(url)) {
        //find top 5
        let topResults = window.challengeResults.data.sort((a, b) => ((b.picks[window.roundNo] ? b.picks[window.roundNo].score : (-1)) - (a.picks[window.roundNo] ? a.picks[window.roundNo].score : (-1)))).slice(0, 5);
       
        window.markersToClear = [];
        for (var result of topResults) {
            if(!result.picks[window.roundNo]){
                continue;
            }
            let markerItemUid = result.userData.markerItemUid;
            let markerUrl = getMarkerUrl(markerItemUid);
            let markerSettings = {
                position: {
                    lat: result.picks[window.roundNo].lat,
                    lng: result.picks[window.roundNo].lng
                },
                map: window.capturedMap,
            };
            if (markerUrl) {
                markerSettings.icon = markerUrl;
            }
            window.markersToClear.push(new google.maps.Marker(
                markerSettings
            ));
            window.markersToClear.push(new google.maps.Polyline({
                path: [{
                        lat: window.challengeDrops[window.roundNo].lat,
                        lng: window.challengeDrops[window.roundNo].lng
                    },
                    {
                        lat: result.picks[window.roundNo].lat,
                        lng: result.picks[window.roundNo].lng
                    }
                ],
                map: window.capturedMap,
                strokeOpacity: 0,
                icons: [{
                    icon: lineSymbol,
                    offset: "0",
                    repeat: "15px",
                }, ],
            }));

        }
    }
    // load items(markers)
    else if (method === "GET" && itemsRegex.test(url)) {
        this.addEventListener('load', function() {
            window.items = JSON.parse(this.responseText).data;
        });
    } else if (method === "POST" && finishRegex.test(url)) {
        window.finished.add(challengeId);
    }
    return oldOpen.apply(this, arguments);
}
