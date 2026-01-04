// ==UserScript==
// @name         NUS Mark all as read
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  On dashboard, marks all announcements as read for all enrolled courses, then reloads page.
// @author       Jae
// @match        https://canvas.nus.edu.sg/
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556904/NUS%20Mark%20all%20as%20read.user.js
// @updateURL https://update.greasyfork.org/scripts/556904/NUS%20Mark%20all%20as%20read.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**
     * Get CSRF token from cookies.
     */
    function getCsrfToken() {
        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === '_csrf_token') return decodeURIComponent(value);
        }
        return null;
    }

    /**
     * Fetch all active course IDs.
     */
    async function getCourseIds() {
        const res = await fetch('/api/v1/courses?enrollment_state=active');
        const data = await res.json();
        return data.map(c => c.id);
    }

    /**
     * Mark all announcements as read for a given course.
     */
    async function markCourseAsRead(courseId, csrfToken) {
        await fetch(`/api/v1/courses/${courseId}/discussion_topics/read_all?only_announcements=true`, {
            method: 'PUT',
            headers: { 'X-CSRF-Token': csrfToken }
        });
    }

    /**
     * Main handler when button is clicked.
     */
    async function handleClick() {
        const csrf = getCsrfToken();
        if (!csrf) return;

        const courseIds = await getCourseIds();
        await Promise.all(courseIds.map(id => markCourseAsRead(id, csrf)));

        location.reload();
    }

    /**
     * Create and show button only on dashboard.
     */
    function setupButton() {
        if (window.location.href !== 'https://canvas.nus.edu.sg/') return;

        const button = document.createElement('button');
        button.textContent = 'Mark All As Read';
        Object.assign(button.style, {
            position: 'fixed',
            top: '15px',
            right: '15px',
            zIndex: '9999',
            padding: '8px 12px',
            backgroundColor: '#005BBB',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.3)'
        });
        button.addEventListener('click', handleClick);
        document.body.appendChild(button);
    }

    window.addEventListener('load', setupButton);
})();
