// ==UserScript==
// @name         Fitgirl Repacks - Steam Integration
// @namespace    https://greasyfork.org/id/users/1217958
// @version      1.2
// @description  Adds Steam Store information (Reviews, Tags, System Requirements, Age Rating) directly to FitGirl Repacks game pages.
// @author       rawracli
// @match        https://fitgirl-repacks.site/*
// @icon         https://fitgirl-repacks.site/wp-content/uploads/2016/08/cropped-icon-32x32.jpg
// @grant        GM_xmlhttpRequest
// @connect      store.steampowered.com
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/563941/Fitgirl%20Repacks%20-%20Steam%20Integration.user.js
// @updateURL https://update.greasyfork.org/scripts/563941/Fitgirl%20Repacks%20-%20Steam%20Integration.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function run() {
        const isSinglePage = document.body.classList.contains('single-post') ||
            (window.location.protocol === 'file:' && document.querySelector('h1.entry-title'));

        if (!isSinglePage) {
            return;
        }

        const existingLink = findExistingSteamLink();
        if (existingLink) {
            updateBasicLinks(existingLink);
            fetchSteamPage(existingLink);
        } else {
            const term = getSearchTerm();
            if (term) {
                const placeholderUrl = 'https://store.steampowered.com/search/?term=' + encodeURIComponent(term);
                updateBasicLinks(placeholderUrl);

                fetchSteamLinkBackground(term, (directUrl) => {
                    if (directUrl) {
                        updateBasicLinks(directUrl);
                        fetchSteamPage(directUrl);
                    }
                });
            }
        }
    }

    function getSearchTerm() {
        let term = "";
        const path = window.location.pathname;

        if (path.length > 1 && !path.includes('index.php')) {
            term = path.replace(/^\/|\/$/g, '');
        }

        if (!term || window.location.protocol === 'file:') {
            const h1 = document.querySelector('h1.entry-title');
            if (h1) {
                let raw = h1.textContent;
                term = raw.split(/ – | - |\+/)[0].trim();
            }
        }
        return term;
    }

    function findExistingSteamLink() {
        const steamLink = document.querySelector('a[href^="http://store.steampowered.com/app/"], a[href^="https://store.steampowered.com/app/"]');
        return steamLink ? steamLink.href : null;
    }

    function updateBasicLinks(url) {
        const title = document.querySelector('h1.entry-title');
        if (title) {
            let link = title.querySelector('a');
            if (!link) {
                const inner = title.innerHTML;
                title.innerHTML = `<a href="${url}" target="_blank" title="Go to Steam">${inner}</a>`;
                link = title.querySelector('a');
            } else {
                link.href = url;
                link.target = "_blank";
            }
        }

        const content = document.querySelector('.entry-content');
        if (content) {
            const img = content.querySelector('img');
            if (img) {
                const parent = img.parentElement;
                if (parent.tagName === 'A') {
                    parent.href = url;
                    parent.target = "_blank";
                } else {
                    const a = document.createElement('a');
                    a.href = url;
                    a.target = '_blank';
                    img.parentNode.insertBefore(a, img);
                    a.appendChild(img);
                }
            }
        }
    }

    function fetchSteamLinkBackground(term, callback) {
        if (typeof GM_xmlhttpRequest === 'undefined') { callback(null); return; }

        const searchUrl = `https://store.steampowered.com/search/?term=${encodeURIComponent(term)}&category1=998`;

        GM_xmlhttpRequest({
            method: "GET",
            url: searchUrl,
            onload: function (response) {
                if (response.status === 200) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, "text/html");
                    const firstResult = doc.querySelector('#search_resultsRows > a');
                    if (firstResult) {
                        callback(firstResult.href);
                    } else {
                        callback(null);
                    }
                } else {
                    callback(null);
                }
            },
            onerror: () => callback(null)
        });
    }

    function fetchSteamPage(url) {
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            headers: {
                "Cookie": "birthtime=568022401; lastagecheckage=1-0-1988; wants_mature_content=1"
            },
            onload: function (response) {
                if (response.status === 200) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, "text/html");
                    extractAndInject(doc);
                }
            }
        });
    }

    function extractAndInject(doc) {
        const data = {
            reviews: extractReviews(doc),
            tags: extractTags(doc),
            ageRating: extractAgeRating(doc),
            sysReqs: extractSysReqs(doc)
        };
        injectToFitGirl(data);
    }

    function extractReviews(doc) {
        const reviews = Array.from(doc.querySelectorAll('.user_reviews_summary_row'));
        let targetRow = reviews.find(r => r.textContent.includes('All Reviews'));
        if (!targetRow) targetRow = reviews.find(r => r.textContent.includes('Recent Reviews'));

        if (targetRow) {
            const summary = targetRow.querySelector('.summary');
            if (summary) {
                let text = summary.textContent.replace(/\s+/g, ' ').trim();
                text = text.replace(/English Reviews\s*/i, '');

                return text;
            }
        }
        return null;
    }

    function extractTags(doc) {
        const tags = Array.from(doc.querySelectorAll('.glance_tags.popular_tags .app_tag'))
            .map(t => t.textContent.trim())
            .filter(t => t !== '+');
        return tags;
    }

    function extractAgeRating(doc) {
        const rating = doc.querySelector('.shared_game_rating');
        return rating ? rating.outerHTML : null;
    }

    function extractSysReqs(doc) {
        const reqs = doc.querySelector('.sysreq_contents');
        return reqs ? reqs.innerHTML : null;
    }

    function injectToFitGirl(data) {
        const content = document.querySelector('.entry-content');
        if (!content) return;

        const metaDivs = document.querySelectorAll('.entry-header .entry-meta');
        let targetMeta = null;
        for (let div of metaDivs) {
            if (div.querySelector('.entry-date') || div.querySelector('.byline')) {
                targetMeta = div;
                break;
            }
        }

        if (targetMeta && data.reviews) {
            const reviewSpan = document.createElement('span');
            reviewSpan.className = 'steam-reviews';
            const starSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="11" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16" style="margin-right: 1px;"><path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"></path></svg>`;

            reviewSpan.innerHTML = `${starSvg} ${data.reviews}`;
            targetMeta.appendChild(reviewSpan);
        }

        if (data.ageRating) {
            const ageDiv = document.createElement('div');
            ageDiv.innerHTML = data.ageRating;
            ageDiv.style.marginTop = '10px';
            ageDiv.style.border = '1px solid #333';
            ageDiv.style.padding = '5px';
            ageDiv.style.backgroundColor = '#1b2838';

            const style = document.createElement('style');
            style.textContent = `
                .shared_game_rating { display: flex; gap: 10px; font-family: Arial, sans-serif; color: #acb2b8; }
                .game_rating_icon img { width: 50px; }
                .game_rating_descriptors { font-size: 11px; }
                .descriptorText { margin: 0px; }
            `;
            document.head.appendChild(style);

            const firstP = content.querySelector('p');
            if (firstP) {
                const helperDiv = document.createElement('div');
                helperDiv.innerHTML = data.ageRating;
                const ratingRoot = helperDiv.querySelector('.shared_game_rating');

                if (ratingRoot) {
                    const iconDiv = ratingRoot.querySelector('.game_rating_icon');
                    const agencyDiv = ratingRoot.querySelector('.game_rating_agency');
                    const descriptorsDiv = ratingRoot.querySelector('.game_rating_descriptors');
                    ratingRoot.innerHTML = '';

                    const detailsDiv = document.createElement('div');
                    detailsDiv.className = 'game_rating_details';
                    if (iconDiv) detailsDiv.appendChild(iconDiv);
                    ratingRoot.appendChild(detailsDiv);

                    if (agencyDiv) {
                        if (descriptorsDiv) {
                            agencyDiv.appendChild(descriptorsDiv);
                        }
                        ratingRoot.appendChild(agencyDiv);
                    }

                    ratingRoot.appendChild(document.createElement('br'));

                    const ageContainer = document.createElement('div');
                    ageContainer.style.marginTop = '10px';
                    ageContainer.style.border = '1px solid';
                    ageContainer.style.padding = '5px';
                    ageContainer.style.display = 'inline-block';
                    ageContainer.appendChild(ratingRoot);

                    firstP.parentNode.insertBefore(ageContainer, firstP.nextSibling);

                    let nextElem = ageContainer.nextElementSibling;
                    if (nextElem && nextElem.tagName === 'P') {
                        if (!nextElem.textContent.trim() || nextElem.innerHTML.includes('&nbsp;')) {
                            nextElem.remove();
                        }
                    }
                }
            }
        }

        if (data.tags && data.tags.length > 0) {
            const links = content.querySelectorAll('a');
            let tagsElement = null;

            const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT, null, false);
            while (walker.nextNode()) {
                if (walker.currentNode.textContent.includes('Genres/Tags:')) {
                    tagsElement = walker.currentNode.parentNode;
                    break;
                }
            }

            if (tagsElement) {
                const fullText = tagsElement.textContent.toLowerCase();

                const existingTagLinks = tagsElement.querySelectorAll('a[href*="/tag/"]');
                const existingTagCount = existingTagLinks.length;

                const maxSteamTags = Math.max(0, 10 - existingTagCount);

                const newTags = data.tags.filter(tag => {
                    return !fullText.includes(tag.toLowerCase());
                });

                const tagsToAdd = newTags.slice(0, maxSteamTags);

                if (tagsToAdd.length > 0) {
                    const steamTagsSpan = document.createElement('span');
                    steamTagsSpan.style.color = '#888';
                    steamTagsSpan.textContent = ', ' + tagsToAdd.join(', ');

                    const companyNode = Array.from(tagsElement.childNodes).find(n =>
                        n.textContent && (n.textContent.includes('Company:') || n.textContent.includes('Companies:'))
                    );

                    if (companyNode) {
                        const prev = companyNode.previousSibling;
                        if (prev && prev.tagName === 'BR') {
                            tagsElement.insertBefore(steamTagsSpan, prev);
                        } else {
                            tagsElement.insertBefore(steamTagsSpan, companyNode);
                        }
                    } else {
                        tagsElement.appendChild(steamTagsSpan);
                    }
                }
            }
        }

        const spoilers = content.querySelectorAll('.su-spoiler');
        let descSpoiler = null;
        spoilers.forEach(s => {
            if (s.textContent.includes('Game Description')) descSpoiler = s;
        });

        if (descSpoiler && data.sysReqs) {
            const newSpoiler = document.createElement('div');
            newSpoiler.className = 'su-spoiler su-spoiler-style-fancy su-spoiler-icon-plus';
            newSpoiler.setAttribute('data-scroll-offset', '0');

            newSpoiler.innerHTML = `
                <div class="su-spoiler-title" tabindex="0" role="button">
                    <span class="su-spoiler-icon"></span>System Requirements
                </div>
                <div class="su-spoiler-content su-u-clearfix su-u-trim steam-sys-reqs">
                    ${data.sysReqs}
                </div>
            `;

            descSpoiler.parentNode.insertBefore(newSpoiler, descSpoiler.nextSibling);

            const srStyle = document.createElement('style');
            srStyle.textContent = `
                .steam-sys-reqs br { display: none; } 
                .steam-sys-reqs strong { color: #66c0f4; font-weight: normal; } 
                
                .steam-sys-reqs .game_area_sys_req { 
                    display: block; 
                    margin-bottom: 15px; 
                    border-bottom: 1px solid rgba(255,255,255,0.1); 
                    padding-bottom: 10px;
                }
                .steam-sys-reqs .game_area_sys_req.active { display: block; }
                
                .steam-sys-reqs .game_area_sys_req_leftCol, 
                .steam-sys-reqs .game_area_sys_req_rightCol { 
                    float: left; 
                    width: 48%; 
                    margin-right: 2%; 
                }
                
                .steam-sys-reqs ul { list-style: none; padding: 0; margin: 0; }
                .steam-sys-reqs ul.bb_ul { padding-left: 0; }
                .steam-sys-reqs li { 
                    margin-bottom: 4px; 
                    line-height: 1.4; 
                    color: #acb2b8; 
                    font-size: 12px; 
                }

                .steam-sys-reqs::after, .steam-sys-reqs .game_area_sys_req::after { 
                    content: ""; display: table; clear: both; 
                }
                
                @media(max-width: 600px) {
                    .steam-sys-reqs .game_area_sys_req_leftCol, 
                    .steam-sys-reqs .game_area_sys_req_rightCol { 
                        float: none; width: 100%; margin-bottom: 10px; 
                    }
                }
            `;
            document.head.appendChild(srStyle);
        }
    }

    run();
})();
