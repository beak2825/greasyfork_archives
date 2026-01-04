// ==UserScript==
// @name         IMDb - Highest Rated by Role
// @namespace    https://greasyfork.org/en/users/1552401-chipfin
// @version      1.1.0
// @description  Turns role labels (Actor, Director, Producer, etc.) under the name header into links that open IMDb search sorted by user rating using fixed credit_categories IDs.
// @author       Gemini
// @license      MIT
// @match        https://www.imdb.com/name/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/560218/IMDb%20-%20Highest%20Rated%20by%20Role.user.js
// @updateURL https://update.greasyfork.org/scripts/560218/IMDb%20-%20Highest%20Rated%20by%20Role.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Configuration
    const TITLE_TYPE = 'feature'; // Use 'feature,tv_movie' to include TV movies
    const SORT = 'user_rating,desc';

    // IMDb credit category concept IDs (Fixed constants)
    const CATEGORY_IDS = {
        'Actor': 'amzn1.imdb.concept.name_credit_category.a9ab2a8b-9153-4edb-a27a-7c2346830d77',
        'Actress': 'amzn1.imdb.concept.name_credit_category.a9ab2a8b-9153-4edb-a27a-7c2346830d77',
        'Director': 'amzn1.imdb.concept.name_credit_category.ace5cb4c-8708-4238-9542-04641e7c8171',
        'Producer': 'amzn1.imdb.concept.name_credit_category.0af123ce-1605-4a51-93cf-7ad477b11832',
        'Writer': 'amzn1.imdb.concept.name_credit_category.c84ecaff-add5-4f2e-81db-102a41881fe3',
        'Cinematographer': 'amzn1.imdb.concept.name_credit_category.9056a29d-42bc-4541-b0db-85d75eb3793b',
        'Editor': 'amzn1.imdb.concept.name_credit_category.d777596b-07c4-406c-8438-e674a2cb539b',
        'Composer': 'amzn1.imdb.concept.name_credit_category.e6205391-7667-4d6d-b6a6-9818b261b045',
        'Soundtrack': 'amzn1.imdb.concept.name_credit_category.5c10255c-e666-419b-ba22-87ba4da2d689',
        'Music Department': 'amzn1.imdb.concept.name_credit_category.5c10255c-e666-419b-ba22-87ba4da2d689'
    };

    function getNameId() {
        const m = location.pathname.match(/\/name\/(nm\d+)/);
        return m ? m[1] : null;
    }

    function linkifyRoles() {
        const nameId = getNameId();
        if (!nameId) return;

        // Locate the main H1 title to find the correct list
        const h1 = document.querySelector('h1[data-testid="hero__pageTitle"]');
        if (!h1) return;

        // The role list is typically a sibling of the H1
        const roleList = h1.parentElement.querySelector('ul.ipc-inline-list');
        if (!roleList) return;

        roleList.querySelectorAll('li.ipc-inline-list__item').forEach(li => {
            // Skip if already a link
            if (li.querySelector('a')) return;

            const role = li.textContent.trim();

            // Only proceed if we have a known ID for this role
            if (!CATEGORY_IDS[role]) return;

            const url =
                'https://www.imdb.com/search/title/?' +
                'title_type=' + TITLE_TYPE +
                '&role=' + nameId +
                '&credit_categories=' + CATEGORY_IDS[role] +
                '&sort=' + SORT;

            const a = document.createElement('a');
            a.href = url;
            a.textContent = role;

            // Styling to match IMDb theme seamlessly
            a.style.color = 'inherit';
            a.style.textDecoration = 'none';
            a.style.cursor = 'pointer';
            a.style.border = 'none';

            // Replace text with link
            li.textContent = '';
            li.appendChild(a);
        });
    }

    // Run initially
    linkifyRoles();

    // Observe body for changes (SPA navigation support)
    new MutationObserver(linkifyRoles)
        .observe(document.body, { childList: true, subtree: true });

})();