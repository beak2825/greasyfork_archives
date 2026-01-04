// ==UserScript==
// @name         Lazada Data & Screenshot Tool
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Extracts XPath data to JSON and captures full-page screenshots.
// @author       Gemini
// @match        https://www.lazada.com.ph/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/557514/Lazada%20Data%20%20Screenshot%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/557514/Lazada%20Data%20%20Screenshot%20Tool.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration: The XPaths ---
    const targetPaths = [
        { key: "section_1", path: "/html/body/div[5]/div/div[3]" },
        { key: "section_2", path: "/html/body/div[5]/div/div[12]/div[1]/div/div[3]" },
        { key: "section_3", path: "/html/body/div[5]/div/div[12]/div[1]/div/div[4]" }
    ];

    // --- GUI Styling ---
    const style = document.createElement('style');
    style.innerHTML = `
        #lazada-scraper-gui {
            position: fixed;
            top: 80px;
            right: 20px;
            width: 300px;
            background: #ffffff;
            border: 2px solid #f57224;
            border-radius: 8px;
            padding: 15px;
            z-index: 999999;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            font-family: Roboto, Helvetica, Arial, sans-serif;
            color: #333;
        }
        #lazada-scraper-gui h3 {
            margin: 0 0 10px 0;
            font-size: 16px;
            color: #f57224;
            text-align: center;
        }
        #lazada-scraper-output {
            width: 100%;
            height: 120px;
            margin-bottom: 10px;
            border: 1px solid #ddd;
            background: #f9f9f9;
            font-family: monospace;
            font-size: 11px;
            resize: vertical;
            padding: 5px;
            box-sizing: border-box;
        }
        .lazada-btn {
            display: block;
            width: 100%;
            padding: 8px;
            margin-bottom: 5px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            color: white;
            transition: opacity 0.2s;
        }
        .lazada-btn:hover { opacity: 0.9; }

        #btn-crawl { background-color: #f57224; } /* Orange */
        #btn-copy { background-color: #1a9cb7; }  /* Blue */
        #btn-shot { background-color: #7224f5; }  /* Purple */

        #status-msg {
            font-size: 10px;
            text-align: center;
            color: #666;
            min-height: 15px;
            margin-top: 5px;
        }
    `;
    document.head.appendChild(style);

    // --- Create Interface ---
    const gui = document.createElement('div');
    gui.id = 'lazada-scraper-gui';
    gui.innerHTML = `
        <h3>Lazada Tool v2</h3>
        <textarea id="lazada-scraper-output" placeholder="Results will appear here..."></textarea>
        <button id="btn-crawl" class="lazada-btn">CRAWL DATA</button>
        <button id="btn-copy" class="lazada-btn">COPY JSON</button>
        <button id="btn-shot" class="lazada-btn">📸 SCREENSHOT</button>
        <div id="status-msg">Ready</div>
    `;
    document.body.appendChild(gui);

    // --- Helper: Get Element by XPath ---
    function getElementByXPath(path) {
        return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    // --- Feature 1: Crawl ---
    document.getElementById('btn-crawl').addEventListener('click', () => {
        const resultObj = {};
        const statusDiv = document.getElementById('status-msg');

        targetPaths.forEach(item => {
            const el = getElementByXPath(item.path);
            if (el) {
                resultObj[item.key] = el.innerText.trim().replace(/\s+/g, ' ');
            } else {
                resultObj[item.key] = "ERROR: Element not found";
            }
        });

        const jsonString = JSON.stringify(resultObj, null, 2);
        document.getElementById('lazada-scraper-output').value = jsonString;
        statusDiv.innerText = "Data extracted!";
        statusDiv.style.color = "green";
    });

    // --- Feature 2: Copy ---
    document.getElementById('btn-copy').addEventListener('click', () => {
        const textarea = document.getElementById('lazada-scraper-output');
        const statusDiv = document.getElementById('status-msg');
        if (!textarea.value) return;

        textarea.select();
        if (navigator.clipboard) {
            navigator.clipboard.writeText(textarea.value);
            statusDiv.innerText = "JSON Copied!";
            statusDiv.style.color = "#1a9cb7";
        } else {
            document.execCommand('copy');
        }
    });

    // --- Feature 3: Screenshot ---
    document.getElementById('btn-shot').addEventListener('click', () => {
        const statusDiv = document.getElementById('status-msg');
        statusDiv.innerText = "Capturing... please wait.";

        // 1. Hide the GUI so it doesn't appear in the photo
        gui.style.display = 'none';

        // 2. Wait a small moment to ensure GUI is hidden
        setTimeout(() => {
            // 3. Use html2canvas to capture the body
            html2canvas(document.body, {
                useCORS: true, // Try to fetch cross-origin images (Lazada CDNs)
                allowTaint: true,
                scrollY: -window.scrollY // Capture from the top, not just current view
            }).then(canvas => {
                // 4. Create a download link for the image
                const link = document.createElement('a');
                link.download = 'lazada_product_' + Date.now() + '.png';
                link.href = canvas.toDataURL();
                link.click();

                // 5. Restore GUI
                gui.style.display = 'block';
                statusDiv.innerText = "Screenshot saved!";
                statusDiv.style.color = "#7224f5";
            }).catch(err => {
                console.error(err);
                gui.style.display = 'block';
                statusDiv.innerText = "Screenshot failed (Check Console)";
                statusDiv.style.color = "red";
            });
        }, 200);
    });

})();