// ==UserScript==
// @name         Twitch disable WYSIWYG 2025 fix
// @namespace    ttv-wysiwyg
// @version      2.0
// @description  Disable the (annoying) WYSIWYG chat input on twitch.tv
// @author       gfish
// @license      MIT
// @match        *://twitch.tv/*
// @match        *://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @run-at       document-start
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/552213/Twitch%20disable%20WYSIWYG%202025%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/552213/Twitch%20disable%20WYSIWYG%202025%20fix.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const REPLACERS = [
        //[/wysiwygErrored:!1/g, 'wysiwygErrored:1'],  // also try this
        [/case"wysiwyginput"/g, 'case"wysiwyginputx"']
    ];
    unsafeWindow.webpackChunktwitch_twilight = unsafeWindow.webpackChunktwitch_twilight || [];
    unsafeWindow.webpackChunktwitch_twilight = new Proxy(unsafeWindow.webpackChunktwitch_twilight, {
        get(target, property) {
            const value = Reflect.get(target, property);
            if (property === 'push') {
                return function (...args) {
                    for (const key in args[0][1]) {
                        let s = args[0][1][key].toString();
                        let changed = false;
                        for (const [searchValue, replaceValue] of REPLACERS) {
                            if (searchValue.test(s)) {
                                s = s.replace(searchValue, replaceValue);
                                changed = true;
                            }
                        }
                        if (changed) {
                            const newFunc = new Function('return ' + s)();
                            console.log(`[Twitch disable WYSIWYG 2025 fix] chunk ${args[0][0]} key ${key}`, 'old', args[0][1][key], 'new', newFunc);
                            args[0][1][key] = newFunc;
                        }
                    }
                    return Reflect.apply(value, target, args);
                };
            }
            return value;
        }
    });
})();