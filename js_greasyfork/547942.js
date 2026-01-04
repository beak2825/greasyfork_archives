// ==UserScript==
// @name         shooo
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  shooshoo
// @author       moomoo
// @match        https://splix.io/
// @icon         https://avatars.githubusercontent.com/u/189983996
// @grant        none
// @run-at       document-start
// ==/UserScript==

await(async function () {
    const currentVersion = '0.2.2'
    const cacheBust = Math.floor(Date.now()/(60*1000)) // 60s
    const latest = (await (await fetch(`https://update.greasyfork.org/scripts/547942/shooo.js?v=${cacheBust}`)).text())
    const match = latest.match(/@version\s+([0-9]+\.[0-9]+\.[0-9]+)/);
    const isLatestVersion = match && match[1] === currentVersion;
    if (isLatestVersion){
       console.log('0.2.2');
       // main code here
    } else {
       console.log('recurse to latest version');
       await (new Function("return (async () => { " + latest + " })()"))();
    }
})()