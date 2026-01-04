// ==UserScript==
// @name         CodeHS Brython Graphics Patcher
// @namespace    https://thetridentguy.com/
// @version      0.1.0
// @description  Patches CodeHS Brython runtimes.
// @author       TheTridentGuy
// @match        https://*.codehs.me/__codehs__/index.html*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=codehs.com
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/553240/CodeHS%20Brython%20Graphics%20Patcher.user.js
// @updateURL https://update.greasyfork.org/scripts/553240/CodeHS%20Brython%20Graphics%20Patcher.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const patch = `
import traceback
def _patch_handler(handler):
    def patched_handler(callback):
        def patched_callback(*args, **kwargs):
            try: 
                callback(*args, **kwargs)
            except:
                print()
                print(traceback.format_exc())
        handler(patched_callback)
    return patched_handler

add_mouse_click_handler = _patch_handler(add_mouse_click_handler)
add_key_down_handler = _patch_handler(add_key_down_handler)
add_key_up_handler = _patch_handler(add_key_up_handler)\n`
    let old_append_child = HTMLBodyElement.prototype.appendChild;
    HTMLBodyElement.prototype.appendChild = function(element){
        if(element.tagName == "SCRIPT"){
            let original_code = element.innerHTML.split("\n")
            element.innerHTML = original_code.slice(0,2).join("\n") + patch + original_code.slice(2).join("\n");
        }
        return old_append_child.call(this, element);
    };
})();