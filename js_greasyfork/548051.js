// ==UserScript==
// @name         common_function_libs
// @namespace    common_function_libs_cc
// @description  abstraction function for google vision api / function to get base64 of a img element
// @version      0.0.0
// @author       cg
// @match        https://orders.ibon.com.tw/*
// @match        https://tixcraft.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        unsafeWindow
// @grant        GM.xmlHttpRequest
// @connect      vision.googleapis.com
// @connect      self
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548051/common_function_libs.user.js
// @updateURL https://update.greasyfork.org/scripts/548051/common_function_libs.meta.js
// ==/UserScript==

(function() {
    'use strict';
    unsafeWindow.libs = unsafeWindow.libs || {};

    const STR_PURIFY_MODE = {
        DIGIT_ONLY: 0,
        ENG_LETTER_ONLY: 1,
        DIGIT_ENG_LETTER_ONLY: 2,
    };

    unsafeWindow.libs.googleVisionApiWrp = async function(api_key, base64_img, str_purify_mode) {
        const url = `https://vision.googleapis.com/v1/images:annotate?key=${api_key}`;
        const body = JSON.stringify({
            requests: [
                {
                    image: {
                        content: base64_img
                    },
                    features: [
                        {
                            type: "TEXT_DETECTION",
                            maxResults: 1
                        }
                    ]
                }
            ]
        });
        try {
            const response = await GM.xmlHttpRequest({
                method: 'POST',
                url: url,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: body, // Use 'data' instead of 'body'
                responseType: 'json' // Automatically parses the JSON response
            });

            const data = response.response;

            // Check for errors first
            if (data.responses && data.responses[0].error) {
                console.error("API Error:", data.responses[0].error.message);
                return null;
            }

            const textDetections = data.responses[0].textAnnotations;
            if (textDetections && textDetections.length > 0) {
                // The first annotation is the full text
                var text = textDetections[0].description;
                if (str_purify_mode == STR_PURIFY_MODE.DIGIT_ONLY) {
                    text = text.replaceAll(/[^0-9]/g, '');
                } else if (str_purify_mode == STR_PURIFY_MODE.ENG_LETTER_ONLY) {
                    text = text.replaceAll(/[^a-zA-Z]/g, '');
                } else if (str_purify_mode == STR_PURIFY_MODE.DIGIT_ENG_LETTER_ONLY) {
                    text = text.replaceAll(/[^0-9a-zA-Z]/g, '');
                }

                return text;
            }

            return null;

        } catch (error) {
            console.error("Network or Fetch Error:", error);
            return null;
        }
    }

    unsafeWindow.libs.getBase64Img = function(element) {
        const canvas = document.createElement('canvas');
        canvas.width = element.width;
        canvas.height = element.height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(element, 0, 0, element.width, element.height);

        return canvas.toDataURL('image/jpeg').split(',')[1];
    }

    // Your code here...
})();