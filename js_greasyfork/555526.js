// ==UserScript==
// @name         AIPI: AI Studio Prompt Injector
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Inject custom default system prompt into AI Studio requests. Local stored prompt which title ends with "default" will be used.
// @author       concertypin
// @match        https://aistudio.google.com/*
// @connect      alkalimakersuite-pa.clients6.google.com
// @grant        none
// @license      Apache-2.0
// @supportURL   https://gist.github.com/concertypin/12173236c29020dfeb37cd3d0bf1fcc3
// @downloadURL https://update.greasyfork.org/scripts/555526/AIPI%3A%20AI%20Studio%20Prompt%20Injector.user.js
// @updateURL https://update.greasyfork.org/scripts/555526/AIPI%3A%20AI%20Studio%20Prompt%20Injector.meta.js
// ==/UserScript==

function newOpen(...args) {
    const method = args[0];
    const url = args[1];
    this._method = method;
    this._url = url.toString();
    if (args[2] === undefined) {
        return XMLHttpRequest.prototype.originalOpen.apply(this, [
            method,
            url,
            true /* cause it's default */,
            undefined,
            undefined,
        ]
        );
    }
    else {
        const async = args[2];
        const username = args[3];
        const password = args[4];
        return XMLHttpRequest.prototype.originalOpen.apply(this, [
            method,
            url,
            async,
            username,
            password,
        ]);
    }
}
XMLHttpRequest.prototype.originalOpen =
    XMLHttpRequest.prototype.originalOpen || XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = newOpen;
XMLHttpRequest.prototype.originalSend =
    XMLHttpRequest.prototype.originalSend || XMLHttpRequest.prototype.send;
function modifyData(body) {
    let jsonObject = JSON.parse(body);
    if (jsonObject[5] === null) {
        const prompt = JSON.parse(localStorage.aistudio_all_system_instructions).find((i) => i.title.trim().endsWith("default"))?.text;
        console.log("AIPI prompt",prompt)
        if (!prompt)
            return;
        jsonObject[5] = [[[null, prompt]], "user"];
        return JSON.stringify(jsonObject);
    }
    return;
}
XMLHttpRequest.prototype.send = function (body) {
    let modifiedData = body;
    const isPost = this._method && this._method.toUpperCase() === "POST";
    const isTargetUrl = this._url &&
        this._url.includes("https://alkalimakersuite-pa.clients6.google.com/" +
            "$rpc/" +
            "google.internal.alkali.applications.makersuite.v1.MakerSuiteService" +
            "/GenerateContent");
    if (isPost && isTargetUrl)
        console.log("AIPI remote match!")
    if (isPost && isTargetUrl && typeof body === "string") {
        console.log("AIPI hook start!")
        try {
            modifiedData = modifyData(body) ?? body;
        }
        catch (e) {
            console.log("AIPI: Error on modifyData:", e);
        }
    }
    return this.originalSend.call(this, modifiedData);
};
console.log("AIPI: injected!")