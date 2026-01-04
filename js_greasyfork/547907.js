// ==UserScript==
// @name         Nitrome Game Redirector
// @namespace    http://ts8zs.com/
// @version      0.5
// @description  Redirect Nitrome flash preloader to actual SWF game file
// @author       Ts8zs
// @license     GPL
// @match        http://www.nitrome.com/games/preloader_frame*
// @match        http://www.nitrome.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547907/Nitrome%20Game%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/547907/Nitrome%20Game%20Redirector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check for swfurl every 0.5 seconds
    const interval = setInterval(function() {
        // Check if swfurl variable exists
        if (typeof swfurl !== 'undefined' && swfurl) {
            // Clear the interval to prevent further checks
            clearInterval(interval);
            
            // Open the SWF URL in a new tab
            window.open(swfurl, '_blank');
            
            // Optionally, update the current page content to inform the user
            document.body.innerHTML = `
                <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                            background: #000; color: #fff; display: flex; justify-content: center; 
                            align-items: center; flex-direction: column; font-family: Arial, sans-serif;">
                    <h1>Nitrome Game Redirector</h1>
                    <p>Open Game in:</p>
                    <p> <a href="#" id="embed-swf-link">this tab</a></p>
                    <p><a href="${swfurl}" target="_blank">new tab</a></p>
                </div>
            `;
            
            // 添加点击事件，将页面替换为嵌入的SWF
            document.getElementById('embed-swf-link').addEventListener('click', function(e) {
                e.preventDefault();
                document.body.innerHTML = `
                    <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                                background: #000; display: flex; justify-content: center; 
                                align-items: center;">
                        <object type="application/x-shockwave-flash" data="${swfurl}" 
                                style="width: 100%; height: 100%;">
                            <param name="movie" value="${swfurl}">
                            <param name="quality" value="high">
                            <param name="bgcolor" value="#000000">
                            <param name="play" value="true">
                            <param name="loop" value="true">
                            <param name="wmode" value="window">
                        </object>
                    </div>
                `;
            });
            
            clearInterval(interval);
        }
    }, 500); // 500ms = 0.5 seconds
})();