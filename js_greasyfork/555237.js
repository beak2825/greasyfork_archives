// ==UserScript==
// @name         CyTube Chat Username Colorizer
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Applies stable HSL-based coloring to usernames in CyTube chat using character-code hashing. Safe and standalone from other UI scripts.
// @author       You
// @match        https://cytu.be/r/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555237/CyTube%20Chat%20Username%20Colorizer.user.js
// @updateURL https://update.greasyfork.org/scripts/555237/CyTube%20Chat%20Username%20Colorizer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function colorChatNames() {
        document.querySelectorAll('#messagebuffer div strong').forEach(strong => {
            const name = strong.textContent.trim();
            if (!name || strong.dataset.colorStyled === 'true') return;

            const hash = Array.from(name).reduce((acc, char) => acc + char.charCodeAt(0), 0);
            const hue = hash % 360;
            const sat = 60 + (hash % 30);
            const light = 45 + (hash % 20);

            strong.style.color = `hsl(${hue}, ${sat}%, ${light}%)`;
            strong.dataset.colorStyled = 'true';
        });
    }

    const observer = new MutationObserver(() => colorChatNames());
    observer.observe(document.body, { childList: true, subtree: true });

    setInterval(colorChatNames, 2000);
})();