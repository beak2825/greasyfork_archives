// ==UserScript==
// @name         Code Injector for sssh coding platform
// @match        *http://course.sssh.tp.edu.tw:8080/*
// @grant        none
// @author       HarvyLiu
// @license      MIT
// @description A script to insert code via a small window into the sssh computer science platform code editor where in most of times copy and paste are restricted.
// @version 0.0.1.20260122135937
// @namespace https://greasyfork.org/users/1108860
// @downloadURL https://update.greasyfork.org/scripts/563624/Code%20Injector%20for%20sssh%20coding%20platform.user.js
// @updateURL https://update.greasyfork.org/scripts/563624/Code%20Injector%20for%20sssh%20coding%20platform.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. Create the UI Container
    const container = document.createElement('div');
    container.style = "position:fixed; top:10px; right:10px; z-index:9999; background:#333; padding:10px; border-radius:8px; display:flex; flex-direction:column; gap:5px; border: 1px solid #555;";

    // 2. Create the Text Area
    const textArea = document.createElement('textarea');
    textArea.placeholder = "Paste your code here...";
    textArea.style = "width:250px; height:150px; background:#1e1e1e; color:#0f0; border:1px solid #444; font-family:monospace; font-size:12px;";

    // 3. Create the Button
    const btn = document.createElement('button');
    btn.innerText = "Inject to Editor";
    btn.style = "background:#007bff; color:white; border:none; padding:5px; cursor:pointer; font-weight:bold;";

    // 4. The Logic: Find the editor and set the value
    btn.onclick = () => {
        try {
            const editorEl = document.querySelector('.ace_editor');
            if (editorEl) {
                const editor = ace.edit(editorEl);
                editor.setValue(textArea.value);
                alert("Code Injected!");
            } else {
                alert("Editor not found!");
            }
        } catch (e) {
            alert("Error: " + e.message);
        }
    };

    // 5. Add to page
    container.appendChild(textArea);
    container.appendChild(btn);
    document.body.appendChild(container);
})();