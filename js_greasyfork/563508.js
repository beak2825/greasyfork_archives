// ==UserScript==
// @name         Scroll-to-Top Button (Auto hide global)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds a small 'Go to Top' button that only appears when scrolling up.
// @author       You
// @match        *://*/*
// @grant        none
// @run-at       document-body
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563508/Scroll-to-Top%20Button%20%28Auto%20hide%20global%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563508/Scroll-to-Top%20Button%20%28Auto%20hide%20global%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. Create the button element
    const topBtn = document.createElement('div');
    topBtn.innerHTML = '&#8679;'; // Unicode Up Arrow
    topBtn.id = 'vm-scroll-top-btn';

    // 2. Add styles programmatically to ensure it looks consistent everywhere
    // We use a shadow-like ID selector strategy or direct style injection
    Object.assign(topBtn.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '35px',     // Small size
        height: '35px',
        lineHeight: '35px',
        textAlign: 'center',
        background: 'rgba(0, 0, 0, 0.7)', // Dark semi-transparent background
        color: 'white',
        borderRadius: '50%', // Circle shape
        cursor: 'pointer',
        zIndex: '2147483647', // Max z-index to stay on top of everything
        display: 'none',      // Hidden by default
        fontSize: '20px',
        userSelect: 'none',
        fontFamily: 'sans-serif',
        boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
        transition: 'opacity 0.3s ease'
    });

    document.body.appendChild(topBtn);

    // 3. Logic for scroll direction detection
    let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;

    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Logic:
        // 1. scrollTop > 0: Don't show if we are already at the very top.
        // 2. scrollTop < lastScrollTop: Check if current position is less than last (Scrolling UP).
        if (scrollTop > 100 && scrollTop < lastScrollTop) {
            topBtn.style.display = 'block';
        } else {
            // Hide if scrolling down or sitting at the very top
            topBtn.style.display = 'none';
        }

        // Update last scroll position
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, false);

    // 4. Click event to scroll to top smoothly
    topBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        // Optional: Hide button immediately after clicking
        topBtn.style.display = 'none';
    });

})();