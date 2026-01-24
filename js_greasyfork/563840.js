// ==UserScript==
// @name         MPP Toggler
// @namespace    http://tampermonkey.net/
// @version      1.0.6
// @description  Allows the user to toggle listeners and senders.
// @author       @sherlockmpp on discord!
// @match        https://hypermod.onrender.com/*
// @match        https://multiplayerpiano.net/*
// @match        https://multiplayerpiano.com/*
// @match        https://mpp.hri7566.info/*
// @match        https://piano.ourworldofpixels.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=multiplayerpiano.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563840/MPP%20Toggler.user.js
// @updateURL https://update.greasyfork.org/scripts/563840/MPP%20Toggler.meta.js
// ==/UserScript==

/* globals MPP */

let Binders = { sendArray: MPP.client.sendArray.bind(MPP.client), chat: MPP.chat.send.bind(MPP.chat), emitter: MPP.client.emit.bind(MPP.client) };
let Disabled = { senders: [], listeners: [] };

console.log("[ SpecialCmds ] Ready for you :3")

MPP.client.sendArray = (data) => {
    data.forEach((msg) => {
        if (msg.m === "dm") return Binders.sendArray([msg]);
        if (Disabled.senders.includes(msg.m)) return;
        return Binders.sendArray([msg]);
    });
};

MPP.chat.send = (msg) => {
    let args = msg.split(" ");
    let command = args[0];
    let prefix = localStorage.prefix || ";";
    if (!command.startsWith(prefix)) return Binders.chat(msg);

    command = command.slice(prefix.length);
    args = args.slice(1);

    let target = args.join(" ");

    if (command === "toggleSender") {
        if (args.length === 0) return MPP.client.sendArray([{ m: "a", message: "Unable to toggle nothing." }]);
        if (Disabled.senders.includes(target)) {
            Disabled.senders.splice(Disabled.senders.indexOf(target, 1));
            MPP.client.sendArray([{ m: "a", message: "Enabled the sender! > " + target }]);
        } else {
            Disabled.senders.push(target);
            MPP.client.sendArray([{ m: "a", message: "Disabled the sender! > " + target }]);
        };
    };

    if (command === "toggleListener") {
        if (args.length === 0) return MPP.client.sendArray([{ m: "a", message: "Unable to toggle nothing." }]);
        if (Disabled.listeners.includes(target)) {
            Disabled.listeners.splice(Disabled.listeners.indexOf(target, 1));
            MPP.client.sendArray([{ m: "a", message: "Enabled the listener! > " + target }]);
        } else {
            Disabled.listeners.push(target);
            MPP.client.sendArray([{ m: "a", message: "Disabled the listener! > " + target }]);
        };
    };
};

MPP.client.emit = (type, data) => {
    if (Disabled.listeners.includes(type)) return;
    return Binders.emitter(type, data);
};