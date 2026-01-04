// ==UserScript==
// @name         OWOP Follower
// @namespace    https://greasyfork.org/en/users/1474965/
// @version      2.0
// @description  Teleports you wherever the last pixel was placed
// @author       thisisks
// @match        https://ourworldofpixels.com/*
// @match        https://pre.ourworldofpixels.com/*
// @exclude      https://ourworldofpixels.com/api/*
// @exclude      https://pre.ourworldofpixels.com/api/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/551836/OWOP%20Follower.user.js
// @updateURL https://update.greasyfork.org/scripts/551836/OWOP%20Follower.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    const button = document.createElement('button');
    button.textContent = 'Follower: OFF';
    Object.assign(button.style, {
        position: 'fixed',
        top: '10px',
        right: '10px',
        zIndex: '9999',
        padding: '8px 12px',
        backgroundColor: '#222',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px'
    });
    document.body.appendChild(button);
 
    let emitEnabled = false;
 
    button.addEventListener('click', () => {
        emitEnabled = !emitEnabled;
        button.textContent = `Follower: ${emitEnabled ? 'ON' : 'OFF'}`;
        button.style.backgroundColor = emitEnabled ? '#7b2121' : '#222';
    });
 
    OWOP.on(OWOP.events.net.world.tilesUpdated, (log) => {
        if (emitEnabled) {
            OWOP.emit(29, log[0].x, log[0].y);
 
        }
    });
})();