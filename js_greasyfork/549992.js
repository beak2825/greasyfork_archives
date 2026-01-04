// ==UserScript==
// @name         Bitcointalk PostCheck
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Mostra età del post e differenza tra data di condivisione e data del post
// @author       Ace
// @match        https://bitcointalk.org/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549992/Bitcointalk%20PostCheck.user.js
// @updateURL https://update.greasyfork.org/scripts/549992/Bitcointalk%20PostCheck.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const blockedBoards = [24, 132, 129, 149, 152, 151, 177, 67, 259, 179, 246, 247, 264, 159, 240, 160, 199, 161, 197, 198, 238, 192, 221, 243, 260, 224, 242, 59, 71, 207, 212, 34, 56, 228, 200, 9, 64, 145, 148, 127, 272, 280, 251, 250];

    function parsePostDate(dateText) {
        const months = {
            "January": 0, "February": 1, "March": 2, "April": 3, "May": 4, "June": 5,
            "July": 6, "August": 7, "September": 8, "October": 9, "November": 10, "December": 11
        };

        if (dateText.includes("Today")) return new Date();
        if (dateText.includes("Yesterday")) {
            const d = new Date();
            d.setDate(d.getDate() - 1);
            return d;
        }

        const datePart = dateText.split(',')[0].trim();
        const [monthName, day] = datePart.split(' ');
        const month = months[monthName];
        const yearPart = dateText.split(',')[1];
        let year;
        if (yearPart) year = parseInt(yearPart.trim().split(' ')[0]);

        if (month === undefined || !day || !year) {
            console.error("Formato data non valido:", dateText);
            return null;
        }

        return new Date(year, month, parseInt(day));
    }

    function formatDate(date) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    function getBoardId() {
        const breadcrumbLinks = document.querySelectorAll('a[href*="board="]');
        for (let i = breadcrumbLinks.length - 1; i >= 0; i--) {
            const href = breadcrumbLinks[i].getAttribute('href');
            if (href.includes('board=')) {
                const boardMatch = href.match(/board=(\d+)/);
                if (boardMatch) return boardMatch[1];
            }
        }

        const urlMatch = window.location.href.match(/board=(\d+)/);
        if (urlMatch) return urlMatch[1];

        return null;
    }

    function addSharedDateButtons() {
        if (!window.location.href.includes('topic=5412657')) return;

        const posts = document.querySelectorAll('td.td_headerandpost');
        posts.forEach(post => {
            const dateEl = post.querySelector('.smalltext');
            if (!dateEl) return;
            const postDate = parsePostDate(dateEl.textContent.trim());
            if (!postDate) return;

            const links = post.querySelectorAll('a[href*="index.php?topic="]');
            links.forEach(link => {
                if (link.nextElementSibling?.tagName === 'BUTTON' && link.nextElementSibling.textContent === 'Check Age') return;

                const button = document.createElement('button');
                button.textContent = 'Check Age';
                button.style.marginLeft = '5px';
                button.style.padding = '2px 5px';
                button.style.fontSize = '10px';
                button.style.backgroundColor = '#f0f0f0';
                button.style.border = '1px solid #ccc';
                button.style.borderRadius = '3px';
                button.style.cursor = 'pointer';

                button.onclick = function(e) {
                    e.preventDefault();
                    const href = link.getAttribute('href');
                    const postIdMatch = href.match(/msg(\d+)/);
                    if (!postIdMatch) return;
                    const postId = postIdMatch[1];

                    // Trova la data del post nel topic di Fillippone
                    const fillipponePost = link.closest('td.td_headerandpost');
                    const fillipponePostDateEl = fillipponePost.querySelector('.smalltext');
                    if (!fillipponePostDateEl) {
                        console.error("Non ho trovato la data del post nel topic di Fillippone.");
                        return;
                    }
                    const fillipponePostDate = parsePostDate(fillipponePostDateEl.textContent.trim());
                    if (!fillipponePostDate) {
                        console.error("Formato data non valido nel topic di Fillippone.");
                        return;
                    }

                    // Salva la data del post nel topic di Fillippone come data di condivisione
                    sessionStorage.setItem(`sharedDate_${postId}`, formatDate(fillipponePostDate));
                    console.log(`Data di condivisione salvata per post ${postId}: ${formatDate(fillipponePostDate)}`);
                    window.open(href, '_blank');
                };

                link.parentNode.insertBefore(button, link.nextSibling);
                link.parentNode.insertBefore(document.createTextNode(' '), button);
            });
        });
    }

    function processPosts() {
        const posts = document.querySelectorAll('td.td_headerandpost');
        posts.forEach(post => {
            const postContent = post.querySelector('.post');
            if (!postContent) return;
            const dateEl = post.querySelector('.smalltext');
            if (!dateEl) return;
            const postDate = parsePostDate(dateEl.textContent.trim());
            if (!postDate) return;

            postContent.querySelectorAll('.age-warning').forEach(el => el.remove());

            const warningsContainer = document.createElement('div');
            warningsContainer.style.marginBottom = '10px';

            const boardId = getBoardId();
            if (boardId && blockedBoards.includes(parseInt(boardId))) {
                const bEl = document.createElement('div');
                bEl.className = 'age-warning';
                bEl.style.fontFamily = 'monospace';
                bEl.style.color = 'red';
                bEl.innerHTML = '🚫 <strong>Board denied</strong>';
                warningsContainer.appendChild(bEl);
            }

            const today = new Date();
            const diffDays = Math.floor((today - postDate) / (1000 * 60 * 60 * 24));
            const ageEl = document.createElement('div');
            ageEl.className = 'age-warning';
            ageEl.style.fontFamily = 'monospace';
            ageEl.style.color = diffDays > 120 ? 'red' : 'gray';
            ageEl.innerHTML = `🗓️ <strong>Post is ${diffDays} days old</strong>`;
            warningsContainer.appendChild(ageEl);

            const postLinks = post.querySelectorAll('a[href*="index.php?topic="]');
            let sharedAdded = false;
            postLinks.forEach(link => {
                const href = link.getAttribute('href');
                const postIdMatch = href.match(/msg(\d+)/);
                if (!postIdMatch) return;
                const postId = postIdMatch[1];
                const sharedDateStr = sessionStorage.getItem(`sharedDate_${postId}`);
                if (sharedDateStr && !sharedAdded) {
                    const sharedDate = new Date(sharedDateStr);
                    const daysBetweenPostAndShare = Math.max(0, Math.floor((sharedDate - postDate) / (1000 * 60 * 60 * 24)));
                    const sharedEl = document.createElement('div');
                    sharedEl.className = 'age-warning';
                    sharedEl.style.fontFamily = 'monospace';
                    sharedEl.style.color = daysBetweenPostAndShare >= 120 ? 'red' : 'gray';
                    sharedEl.innerHTML = `🗓️ <strong>Post was ${daysBetweenPostAndShare} days old when shared</strong>`;
                    warningsContainer.appendChild(sharedEl);
                    sharedAdded = true;
                }
            });

            postContent.insertBefore(warningsContainer, postContent.firstChild);
        });
    }

    window.addEventListener('load', function() {
        addSharedDateButtons();
        processPosts();
    });

    window.addEventListener('popstate', processPosts);
    window.addEventListener('hashchange', processPosts);
})();
