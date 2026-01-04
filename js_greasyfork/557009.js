// ==UserScript==
// @name         AoPS Alcumus Problem Translator
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Translates Alcumus problem descriptions to Chinese using free LLM.
// @author       Dakai
// @match        https://artofproblemsolving.com/alcumus/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @require      https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js
// @resource     KATEX_CSS https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557009/AoPS%20Alcumus%20Problem%20Translator.user.js
// @updateURL https://update.greasyfork.org/scripts/557009/AoPS%20Alcumus%20Problem%20Translator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // *** IMPORTANT:  REPLACE WITH YOUR ACTUAL GEMINI API KEY ***
    const GEMINI_API_KEY = ""; // Replace with your actual API key
    const OPENROUTER_API_KEY=""
    const OPENROUTER_MODELS = ['x-ai/grok-4.1-fast:free', 'moonshotai/kimi-k2:free', 'mistralai/mistral-small-3.1-24b-instruct:free', 'google/gemini-2.0-flash-exp:free'];

   // Load KaTeX CSS
    const katexCSS = GM_getResourceText("KATEX_CSS");
    GM_addStyle(katexCSS);
     // Styling for the button
    GM_addStyle(`
        .translate-button {
            background-color: #4CAF50; /* Green */
            border: none;
            color: white;
            padding: 5px 10px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 14px;
            margin: 4px 2px;
            cursor: pointer;
            border-radius: 5px; /* Rounded corners */
        }

        .translated-text {
            margin-top: 10px;
            padding: 10px;
            border: 1px solid #ccc;
            background-color: #f9f9f9;
            white-space: pre-wrap; /*  Preserve line breaks AND wrap text*/
        }
    `);

        let currentOpenRouterModelIndex = 0; // Keep track of the current model

        function translateWithOpenRouter(text, callback) {
        if (!OPENROUTER_API_KEY) {
            callback("Translation failed: OpenRouter API key is missing.");
            return;
        }

        const model = OPENROUTER_MODELS[currentOpenRouterModelIndex];
        const apiUrl = "https://openrouter.ai/api/v1/chat/completions";

        const requestData = {
            model: model,
            messages: [{ role: "user",
                                    content: `Translate the following English text to Simplified Chinese. Keep all LaTeX math expressions in their original form surrounded by $ for inline math and $$ for display math. Only translate the non-mathematical English text: ${text}`

                       }],
        };

        GM_xmlhttpRequest({
            method: "POST",
            url: apiUrl,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "HTTP-Referer": "https://artofproblemsolving.com", // Required by OpenRouter
                "X-Title": "AoPS Alcumus Translator" // Required by OpenRouter
            },
            data: JSON.stringify(requestData),
            onload: function(response) {
                if (response.status >= 200 && response.status < 300) {
                    try {
                        const jsonResponse = JSON.parse(response.responseText);
                        if (jsonResponse.choices && jsonResponse.choices.length > 0 && jsonResponse.choices[0].message && jsonResponse.choices[0].message.content) {
                            const translatedText = jsonResponse.choices[0].message.content;
                            callback(translatedText);
                        } else {
                            callback(`Translation failed: OpenRouter - Unexpected API response format (Model: ${model})`);
                            console.error("OpenRouter - Unexpected API response format:", jsonResponse, model);
                        }
                    } catch (e) {
                        callback(`Translation failed: OpenRouter - Could not parse API response (Model: ${model})`);
                        console.error("OpenRouter - Error parsing API response:", e, response.responseText, model);
                    }
                } else {
                    callback(`Translation failed: OpenRouter - API error ${response.status} - ${response.statusText} (Model: ${model})`);
                    console.error("OpenRouter - API error:", response.status, response.statusText, response.responseText, model);
                }
            },
            onerror: function(error) {
                callback(`Translation failed: OpenRouter - Network error (Model: ${model})`);
                console.error("OpenRouter - Network error:", error, model);
            }
        });
    }



    function translateToChinese(text, callback) {
        if (GEMINI_API_KEY)  { // Try Gemini first if a key is provided
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`;

            const requestData = {
                contents: [{
                    parts: [{
                      text: `Translate the following English text to Simplified Chinese. Keep all LaTeX math expressions in their original form surrounded by $ for inline math and $$ for display math. Only translate the non-mathematical English text: ${text}`
                    }]
                }]
            };

            GM_xmlhttpRequest({
                method: "POST",
                url: apiUrl,
                headers: {
                    "Content-Type": "application/json"
                },
                data: JSON.stringify(requestData),
                onload: function(response) {
                    if (response.status === 503) {
                       console.warn("Gemini API overloaded, falling back to OpenRouter.");
                        //If gemini failed, immediately proceed to OpenRouter.
                        currentOpenRouterModelIndex = 0;  //Reset to the first model
                        translateWithOpenRouter(text, callback);

                    } else if (response.status >= 200 && response.status < 300) {
                        try {
                            const jsonResponse = JSON.parse(response.responseText);
                            if (jsonResponse.candidates && jsonResponse.candidates.length > 0 && jsonResponse.candidates[0].content && jsonResponse.candidates[0].content.parts && jsonResponse.candidates[0].content.parts.length > 0) {
                                const translatedText = jsonResponse.candidates[0].content.parts[0].text;
                                callback(translatedText);
                            } else {
                                 console.warn("Gemini API returned unexpected format, falling back to OpenRouter.");
                                currentOpenRouterModelIndex = 0;  //Reset to the first model
                                translateWithOpenRouter(text, callback);
                            }
                        } catch (e) {
                            console.warn("Gemini API returned invalid JSON, falling back to OpenRouter.");
                            currentOpenRouterModelIndex = 0;  //Reset to the first model
                            translateWithOpenRouter(text, callback);
                        }
                    } else {
                        console.warn("Gemini API error, falling back to OpenRouter.");
                        currentOpenRouterModelIndex = 0;  //Reset to the first model
                        translateWithOpenRouter(text, callback);
                    }
                },
                onerror: function(error) {
                    console.warn("Gemini API network error, falling back to OpenRouter.");
                    currentOpenRouterModelIndex = 0;  //Reset to the first model
                    translateWithOpenRouter(text, callback);
                }
            });
        } else {
            console.log("No Gemini API key provided, using OpenRouter directly.");
            translateWithOpenRouter(text, callback); //If no Gemini Key is provided, proceed to OpenRouter.
        }
    }

    function getTextWithAlt(element) {
        let text = "";
        for (const node of element.childNodes) {
            if (node.nodeType === Node.TEXT_NODE) {
                text += node.textContent;
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.tagName === 'IMG') {
                    if (node.alt) {
                        text += node.alt; // Append the alt text
                    }
                } else {
                    text += getTextWithAlt(node); // Recursive call for other elements
                }
            }
        }
        console.log(text);
        return text;
    }


    function renderKaTeX(element) {
        if (typeof renderMathInElement === 'undefined') {
            console.error('KaTeX auto-render not loaded');
            return;
        }

        try {
            // Use KaTeX auto-render to find and render all math
            renderMathInElement(element, {
                delimiters: [
                    {left: '$$', right: '$$', display: true},
                    {left: '$', right: '$', display: false},
                ],
                throwOnError: false,
                errorColor: '#cc0000'
            });
            console.log('✓ KaTeX rendering complete!');
        } catch (err) {
            console.error('✗ KaTeX rendering error:', err);
        }
    }


    function displayTranslatedText(translatedText, translatedTextDiv) {
        translatedTextDiv.textContent = translatedText; // Use textContent first to avoid HTML injection
        translatedTextDiv.style.display = "block";

        console.log('📝 Content to render:', translatedText);
        console.log('📝 KaTeX available:', typeof katex !== 'undefined');

        // Render math with KaTeX
        if (typeof katex !== 'undefined') {
            // Simple approach: manually parse and render
            renderMathInText(translatedTextDiv, translatedText);
        } else {
            console.error('✗ KaTeX not loaded!');
        }
    }

    function renderMathInText(element, text) {
        // Clear the element
        element.innerHTML = '';

        // Regular expression to match $...$ and $$...$$
        const mathRegex = /(\$\$[\s\S]+?\$\$|\$[^\$\n]+?\$)/g;

        let lastIndex = 0;
        let match;

        while ((match = mathRegex.exec(text)) !== null) {
            // Add text before the math
            if (match.index > lastIndex) {
                const textNode = document.createTextNode(text.substring(lastIndex, match.index));
                element.appendChild(textNode);
            }

            // Render the math
            const mathText = match[0];
            const isDisplay = mathText.startsWith('$$');
            const mathContent = isDisplay ? mathText.slice(2, -2) : mathText.slice(1, -1);

            const span = document.createElement('span');
            try {
                katex.render(mathContent, span, {
                    displayMode: isDisplay,
                    throwOnError: false,
                    errorColor: '#cc0000'
                });
                console.log('✓ Rendered:', mathContent.substring(0, 30) + '...');
            } catch (err) {
                console.error('✗ Failed to render:', mathContent, err);
                span.textContent = mathText; // Fallback to original text
            }
            element.appendChild(span);

            lastIndex = match.index + match[0].length;
        }

        // Add remaining text
        if (lastIndex < text.length) {
            const textNode = document.createTextNode(text.substring(lastIndex));
            element.appendChild(textNode);
        }
    }

  function addButton(problemTextDiv) {
        if (problemTextDiv) {
            const translateButton = document.createElement("button");
            translateButton.classList.add("translate-button");
            translateButton.textContent = "Translate to Chinese";
            problemTextDiv.parentNode.insertBefore(translateButton, problemTextDiv.nextSibling);

            const translatedTextDiv = document.createElement("div");
            translatedTextDiv.classList.add("translated-text");
            translatedTextDiv.style.display = "none";
            problemTextDiv.parentNode.insertBefore(translatedTextDiv, translateButton.nextSibling);

            translateButton.addEventListener("click", function() {
                const problemText = getTextWithAlt(problemTextDiv);
                translateButton.disabled = true;
                translateButton.textContent = "Translating...";

                translateToChinese(problemText, function(translatedText) {
                    displayTranslatedText(translatedText, translatedTextDiv);
                    translateButton.textContent = "Translate to Chinese";
                    translateButton.disabled = false;
                });
            });
        }
    }

    function observeForProblemText() {
        const observer = new MutationObserver(function(mutations) {
            const problemTextDiv = document.querySelector(".alc-problem-text");
            if (problemTextDiv) {
                addButton(problemTextDiv);
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    window.addEventListener("load", observeForProblemText);
})();