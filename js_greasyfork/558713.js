// ==UserScript==
// @name         🔫 Diep multibox cheat (press , to toggle)
// @namespace    http://tampermonkey.net/
// @version      v3.0.1
// @description  working diep.io multibox script
// @author       You
// @match        *://diep.io/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/558713/%F0%9F%94%AB%20Diep%20multibox%20cheat%20%28press%20%2C%20to%20toggle%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558713/%F0%9F%94%AB%20Diep%20multibox%20cheat%20%28press%20%2C%20to%20toggle%29.meta.js
// ==/UserScript==

/*

HOW TO USE TUTORIAL:

1. create a lot of diep.io tabs and level them to create the specific build you want (make sure they're on the same team, obviously)
2. if you get kicked for trying to join with more than 2 alts, just use a VPN (use mullvad's proxy for firefox along with their VPN, but if you don't wanna pay for that or haven't got firefox, use Browsec VPN)
3. get the alts close together in one location
4. press the comma key on one of your tabs (you don't need to do this for all the tabs, just one)
5. every movement from your main tab will be copied onto the alt tabs (firing, moving, etc.)

*/

alert('https://discord.gg/VU8t67TBKs\n\nThis script will not work and will be broken if you don\'t join our discord server');

/*
if (!Object.keys(unsafeWindow.localStorage).includes('clickedDiscordButton')) {
    const elemmm = document.createElement('div');
    elemmm.classList.add('asdfnlk');
    elemmm.innerHTML = 'Click Anywhere';
    elemmm.style = "z-index: 51;background-color: #000000;color: white;height: 100%;width: 100%;position: absolute;align-items: center;display: grid;justify-content: center;font-size: 50px;";
    document.body.appendChild(elemmm);
    document.body.getElementsByClassName('asdfnlk')[0].addEventListener('click', () => {
        document.body.getElementsByClassName('asdfnlk')[0].remove();
        window.open('https://discord.gg/VU8t67TBKs');
        unsafeWindow.localStorage['clickedDiscordButton'] = 'y';
    });
};
*/

class Events {
    dispatchKeyboardEvent(event, data) {
        return unsafeWindow.dispatchEvent(new KeyboardEvent(event, data));
    };

    dispatchMouseEvent(event, data) {
        return unsafeWindow.dispatchEvent(new MouseEvent(event, data));
    };
};

class Multibox {
    constructor() {
        this.events = new Events();
        this.multiboxEnabled = false;

        unsafeWindow.addEventListener('storage', this.onLocalStorage.bind(this));

        unsafeWindow.addEventListener('keydown', this.onKeyDown.bind(this));
        unsafeWindow.addEventListener('keyup', this.onKeyUp.bind(this));
        unsafeWindow.addEventListener('mousedown', this.onMouseDown.bind(this));
        unsafeWindow.addEventListener('mouseup', this.onMouseUp.bind(this));
        unsafeWindow.addEventListener('mousemove', this.onMouseMove.bind(this));
    };

    onLocalStorage(message) {
        if (this.multiBoxEnabled) {
            return;
        };

        if (message.key === 'multiboxKeyboardEvent') {
            return this.events.dispatchKeyboardEvent(message.newValue.split(' ')[0], JSON.parse(atob(message.newValue.split(' ')[1])));
        };

        if (message.key === 'multiboxMouseEvent') {
            return this.events.dispatchMouseEvent(message.newValue.split(' ')[0], JSON.parse(atob(message.newValue.split(' ')[1])));
        };
    };

    onKeyDown(eventData) {
        if (this.multiboxEnabled) {
            if (eventData.code === 'Comma') return;

            const data = {
                key: eventData.key,
                code: eventData.code,
                keyCode: eventData.keyCode,
                which: eventData.which,
                cancelable: true,
                composed: true,
                bubbles: true,
            };

            localStorage['multiboxKeyboardEvent'] = 'keydown ' + btoa(JSON.stringify(data));
        };
    };

    onKeyUp(eventData) {
        if (this.multiboxEnabled) {
            if (eventData.code === 'Comma') return;

            const data = {
                key: eventData.key,
                code: eventData.code,
                keyCode: eventData.keyCode,
                which: eventData.which,
                cancelable: true,
                composed: true,
                bubbles: true,
            };;

            localStorage['multiboxKeyboardEvent'] = 'keyup ' + btoa(JSON.stringify(data));
        };
    };

    onMouseDown(eventData) {
        if (this.multiboxEnabled) {
            const data = {which: 32};

            localStorage['multiboxKeyboardEvent'] = 'keydown ' + btoa(JSON.stringify(data));
        };
    };

    onMouseUp(eventData) {
        if (this.multiboxEnabled) {
            const data = {which: 32};

            localStorage['multiboxKeyboardEvent'] = 'keyup ' + btoa(JSON.stringify(data));
        };
    };

    onMouseMove(eventData) {
        if (this.multiboxEnabled) {
            const data = {
                clientX: eventData.clientX,
                clientY: eventData.clientY
            };

            localStorage['multiboxMouseEvent'] = 'mousemove ' + btoa(JSON.stringify(data));
        };
    };
};

const notify = (notificationMessage) => {
    document.getElementsByClassName('notification-system')[0].innerText = notificationMessage;
    setTimeout(() => {
        document.getElementsByClassName('notification-system')[0].innerText = '';
    }, 2000);
};

const init = () => {
    unsafeWindow.multibox = new Multibox();

    unsafeWindow.addEventListener('keyup', (e) => {
        if (e.code === 'Comma') {
            unsafeWindow.multibox.multiboxEnabled = !unsafeWindow.multibox.multiboxEnabled;
            notify('Multibox set to ' + String(unsafeWindow.multibox.multiboxEnabled));
        };
    });
};

// if an exit game button exists, it means you are in the game
let waitForExitButton = setInterval(() => {
    if (document.getElementById('quick-exit-game')) {
        init();
        clearInterval(waitForExitButton);
    };
}, 1000);

