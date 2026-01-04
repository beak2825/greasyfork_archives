// ==UserScript==
// @name         ChatGTP answer alert
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Notify when ChatGPT is done answering.
// @author       Jonathan Lepage
// @match        https://chatgpt.com/c/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552811/ChatGTP%20answer%20alert.user.js
// @updateURL https://update.greasyfork.org/scripts/552811/ChatGTP%20answer%20alert.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("Answer detection script")
    let thinking = false
    setInterval(() => {
        //console.log("Checking for answer. hidden=", document.hidden, " hasFocus=", document.hasFocus())
        if (document.querySelector('button[aria-label="Stop streaming"]')) {
            if (!thinking) {
                thinking = true
                console.log("Thinking")
            }
        } else {
            if (thinking) {
                thinking = false
                console.log("Answer is ready")
                if (document.hidden || !document.hasFocus()) {
                    console.log("Tab is not focused: Showing notification")
                    const notif = new Notification("Answer is ready")
                    notif.onclick = () => {
                        window.focus();
                        notif.close();
                    };
                    chime()
                } else {
                    console.log("Tab is focused: Skipping notification")
                }
            }
        }
    }, 100)

    function chime() {
        const context = new AudioContext()
        const gainNode = context.createGain()
        gainNode.connect(context.destination)
        gainNode.gain.value = 0.2

        const biquadFilter = context.createBiquadFilter()
        biquadFilter.type = "lowpass"
        biquadFilter.frequency.value = 2000
        biquadFilter.connect(gainNode)

        const notes = [0, 12, 24]

        let startTime = context.currentTime
        for (const [index, note] of notes.entries()) {
            const freq = 440 * Math.pow(2, note / 12)
            const duration = 0.06

            const oscillator = context.createOscillator()
            oscillator.connect(biquadFilter)
            oscillator.type = "sawtooth"
            oscillator.frequency.value = freq
            oscillator.start(startTime)
            oscillator.stop(startTime + duration)
            startTime += duration
        }
    }
})();