// ==UserScript==
// @name         Brave Zen Glance
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Alt+Click to preview links in a floating window (Zen Browser Glance style)
// @author       Gemini
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560906/Brave%20Zen%20Glance.user.js
// @updateURL https://update.greasyfork.org/scripts/560906/Brave%20Zen%20Glance.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let glanceContainer = null;

    function createGlance(url) {
        // Remove existing one if it exists
        closeGlance();

        // Create Container
        glanceContainer = document.createElement('div');
        glanceContainer.id = 'zen-glance-overlay';
        
        // Styling to match Zen's sleek look
        Object.assign(glanceContainer.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80vw',
            height: '80vh',
            backgroundColor: '#fff',
            boxShadow: '0 24px 48px rgba(0,0,0,0.3)',
            borderRadius: '12px',
            zIndex: '999999',
            border: '1px solid #ccc',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
        });

        // Header with Close Button
        const header = document.createElement('div');
        Object.assign(header.style, {
            padding: '10px',
            background: '#f1f1f1',
            display: 'flex',
            justifyContent: 'flex-end',
            borderBottom: '1px solid #ddd'
        });

        const closeBtn = document.createElement('button');
        closeBtn.innerText = '✕ Close';
        Object.assign(closeBtn.style, {
            border: 'none',
            background: '#ff4d4d',
            color: 'white',
            borderRadius: '4px',
            padding: '5px 10px',
            cursor: 'pointer',
            fontWeight: 'bold'
        });
        closeBtn.onclick = closeGlance;

        // The Iframe (The Content)
        const iframe = document.createElement('iframe');
        iframe.src = url;
        Object.assign(iframe.style, {
            flex: '1',
            border: 'none',
            width: '100%',
            height: '100%'
        });

        header.appendChild(closeBtn);
        glanceContainer.appendChild(header);
        glanceContainer.appendChild(iframe);
        document.body.appendChild(glanceContainer);

        // Close on "Esc" key
        window.addEventListener('keydown', handleEsc);
    }

    function closeGlance() {
        if (glanceContainer) {
            glanceContainer.remove();
            glanceContainer = null;
            window.removeEventListener('keydown', handleEsc);
        }
    }

    function handleEsc(e) {
        if (e.key === 'Escape') closeGlance();
    }

    // Capture Alt + Click
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (link && e.altKey) {
            e.preventDefault();
            e.stopPropagation();
            createGlance(link.href);
        }
    }, true);
})();