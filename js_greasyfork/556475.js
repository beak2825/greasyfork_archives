// ==UserScript==
// @name          Undetectorized
// @namespace     bypass.focus.fixed
// @version       6.0
// @author        @DoesBadThingsGuy
// @icon          https://i.imgur.com/l8qT82q.jpeg
// @description   Keeps sites blind to tab switches and window blur. Fully blocks all focus and visibility checks.. like, waay more solid than the “Always On Focus” scripts. Btw Shoutout to daijro.
// @include       *
// @run-at        document-start
// @downloadURL https://update.greasyfork.org/scripts/556475/Undetectorized.user.js
// @updateURL https://update.greasyfork.org/scripts/556475/Undetectorized.meta.js
// ==/UserScript==

(function() {
    const uw = unsafeWindow;
    const patch = () => {
        try {
            uw.document.hasFocus = () => true;
            uw.hasFocus = () => true;
            Object.defineProperty(document, "visibilityState", { get: () => "visible" });
            ["hidden","mozHidden","msHidden","webkitHidden"].forEach(p =>
                Object.defineProperty(document, p, { value: false })
            );
            window.onblur = null;
            window.onfocus = null;
            document.onblur = null;
            document.onfocus = null;
            window.focus = () => true;
            document.focus = () => true;
            window.onbeforeunload = null;
            document.onbeforeunload = null;
            Object.defineProperty(window, "onbeforeunload", {
                set: () => true,
                get: () => null
            });
        } catch(e){}
    };

    const blockEvents = () => {
        try {
            const evs = [
                "visibilitychange","webkitvisibilitychange","mozvisibilitychange","msvisibilitychange",
                "blur","focus","focusin","focusout",
                "mouseleave","mouseout","mouseenter","mouseover",
                "pageshow","pagehide","resume","freeze"
            ];
            const handler = e => {
                e.stopImmediatePropagation();
                e.stopPropagation();
                e.preventDefault();
            };
            evs.forEach(ev => {
                window.addEventListener(ev, handler, true);
                document.addEventListener(ev, handler, true);
            });
        } catch(e){}
    };

    const hookAddEvent = () => {
        try {
            const blocked = [
                "visibilitychange","webkitvisibilitychange","mozvisibilitychange","msvisibilitychange",
                "blur","focus","focusin","focusout",
                "mouseleave","mouseout","mouseenter","mouseover",
                "beforeunload",
                "pageshow","pagehide","resume","freeze"
            ];
            const orig = EventTarget.prototype.addEventListener;
            EventTarget.prototype.addEventListener = function(type, listener, opts) {
                if (blocked.includes(type)) return;
                return orig.call(this, type, listener, opts);
            };
        } catch(e){}
    };

    const patchTiming = () => {
    try {
        const base = performance.now();
        performance.now = () => base + Math.random() * 0.01;

        const oRAF = uw.requestAnimationFrame;
        let lastCall = 0;
        const minInterval = 111; // ~9 FPS -> 1000ms / 9 ≈ 111ms

        uw.requestAnimationFrame = cb => {
            const now = performance.now();
            const delay = Math.max(0, minInterval - (now - lastCall));
            lastCall = now + delay;
            return setTimeout(() => cb(performance.now()), delay);
        };

        const oTO = uw.setTimeout;
        uw.setTimeout = (fn, t) => oTO(fn, 0);
    } catch(e){}
};

    patch();
    blockEvents();
    hookAddEvent();
    patchTiming();

    setInterval(() => {
        patch();
        hookAddEvent();
        patchTiming();
    }, 100);

})();