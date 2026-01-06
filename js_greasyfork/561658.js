// ==UserScript==
// @version      1.5.1
// @name         🛒 Temu: Show Similar Items Instead of "You May Also Like"
// @description  🔄 Replaces "You May Also Like" with more relevant "Similar Items" for better product comparisons
// @match        *://www.temu.com/*
// [v-DYNAMIC_METAS-v]
// @grant        none
// @run-at       document-start
// [^-DYNAMIC_METAS-^]
// @license      MIT
// @namespace    okagame-x8k2L9zQ
// @author       okagame
// @downloadURL https://update.greasyfork.org/scripts/561658/%F0%9F%9B%92%20Temu%3A%20Show%20Similar%20Items%20Instead%20of%20%22You%20May%20Also%20Like%22.user.js
// @updateURL https://update.greasyfork.org/scripts/561658/%F0%9F%9B%92%20Temu%3A%20Show%20Similar%20Items%20Instead%20of%20%22You%20May%20Also%20Like%22.meta.js
// ==/UserScript==

(function()
{
    'use strict';

    // V- CONSTANTS -V
    const API_PATTERN = "api/poppy/v1/goods_detail";
    const SCENE_ORIGINAL = "goods_detail_like";
    const SCENE_SIMILAR = "goods_detail_sold_out_similar";

    // V- CLEAN CONSOLE -V
    const original_error = console.error;
    console.error = function(...args)
    {
        // Convert arguments to string representation
        const log_str = args.map(arg => {
            if (arg instanceof Error) return arg.message;
            return String(arg);
        }).join(" ");

        // Suppress specific Temu 424 errors (Chat/Auth failures)
        if (log_str.includes("Request failed with status code 424"))
        {
            return;
        }

        // Pass everything else through
        original_error.apply(console, args);
    };

    // V- PROXY XHR OPEN -V
    const original_open = XMLHttpRequest.prototype.open;

    XMLHttpRequest.prototype.open = function(method, url, ...args)
    {
        this._original_url = url;

        if (url.includes(API_PATTERN))
        {
            this._is_target_request = true;

            if (url.includes(SCENE_ORIGINAL))
            {
                url = url.replace(SCENE_ORIGINAL, SCENE_SIMILAR);
            }
        }

        return original_open.call(this, method, url, ...args);
    };

    // V- PROXY XHR SEND -V
    const original_send = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.send = function(body)
    {
        if (this._is_target_request && body)
        {
            try
            {
                const body_obj = JSON.parse(body);

                if (body_obj.scene === SCENE_ORIGINAL)
                {
                    console.log("%c[Temu Script] Sanitizing Payload...", "color: #00ff00; font-weight: bold;");

                    // 1. Swap Scene
                    body_obj.scene = SCENE_SIMILAR;

                    // 2. Sanitize listId
                    if (body_obj.listId && body_obj.listId.includes("_recommend"))
                    {
                        body_obj.listId = body_obj.listId.replace("_recommend", "_sold_out_similar");
                    }

                    // 3. CRITICAL: Remove "Like" parameters that conflict with "Similar" logic
                    delete body_obj.optId;
                    delete body_obj.optType;

                    body = JSON.stringify(body_obj);
                    console.log("New Body:", body);
                }
            }
            catch (error)
            {
                console.error("Temu Script: Failed to parse request body", error);
            }
        }

        return original_send.call(this, body);
    };

})();