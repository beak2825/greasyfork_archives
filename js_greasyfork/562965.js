// ==UserScript==
// @name         Greasyfork Unlisted Scripts Adder
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Adds unlisted scripts if missing, styles added scripts dark green, limits to 500 scripts, saves unlisted IDs to localStorage, press G 5 times to open data in new tab, infinite scrolling, unlisted mode
// @author       beak2825 / jarivivi / perosonsybs@gmail.com
// @match        https://greasyfork.org/*/scripts?*sort=created*
// @match        https://greasyfork.org/*/scripts?*unlisted*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562965/Greasyfork%20Unlisted%20Scripts%20Adder.user.js
// @updateURL https://update.greasyfork.org/scripts/562965/Greasyfork%20Unlisted%20Scripts%20Adder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const isUnlistedMode = location.search.includes('unlisted');
    let ol = document.getElementById('browse-script-list');
    if (!ol && isUnlistedMode) {
        ol = document.createElement('ol');
        ol.id = 'browse-script-list';
        ol.className = 'script-list';
        document.body.appendChild(ol);
        const h1 = document.querySelector('h1');
        if (h1) h1.textContent = 'Unlisted Scripts';
    }
    if (!ol) return;

    // Hide pagination
    const pagination = document.querySelector('.pagination');
    if (pagination) pagination.style.display = 'none';

    // Add Unlisted link
    const sortAs = document.querySelectorAll('a[href*="?sort="]');
    if (sortAs.length) {
        const container = sortAs[0].parentNode;
        const unlistedA = document.createElement('a');
        unlistedA.href = '/en/scripts?unlisted';
        unlistedA.textContent = 'Unlisted';
        unlistedA.style.marginLeft = '10px';
        container.appendChild(unlistedA);
    }

    let unlistedIds = JSON.parse(localStorage.getItem('unlistedIds') || '[]');
    const unlistedSet = new Set(unlistedIds);

    let loading = false;
    let currentPage = 1;
    let count = 0;
    let timer;

    document.addEventListener('keydown', e => {
        if (e.key === 'g' || e.key === 'G') {
            count++;
            clearTimeout(timer);
            timer = setTimeout(() => { count = 0; }, 2000);
            if (count === 5) {
                const data = localStorage.getItem('unlistedIds');
                if (data) {
                    const blob = new Blob([data], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    window.open(url);
                }
                count = 0;
            }
        }
    });

    if (isUnlistedMode) {
        handleUnlistedMode();
    } else {
        handleRegularMode();
    }

    function handleRegularMode() {
        const lis = Array.from(ol.querySelectorAll('li'));
        if (lis.length >= 500) return;

        const currentIds = new Set(lis.map(li => parseInt(li.dataset.scriptId)));
        let maxId = Math.max(...currentIds);
        let minId = Math.min(...currentIds);

        // Probe +1 to +20
        const upperProbes = [];
        for (let i = 1; i <= 20; i++) {
            upperProbes.push(maxId + i);
        }

        Promise.all(upperProbes.map(id => fetch(`https://api.greasyfork.org/scripts/${id}.json`).then(res => res.ok ? res.json() : null).catch(() => null)))
            .then(datas => {
                const added = [];
                datas.filter(data => data && !data.deleted).forEach(data => {
                    if (!currentIds.has(data.id)) {
                        const li = createLiFromData(data);
                        li.style.backgroundColor = 'darkgreen';
                        insertByDate(li, data.created_at);
                        unlistedSet.add(data.id);
                        added.push(data.id);
                    }
                });
                if (added.length) {
                    localStorage.setItem('unlistedIds', JSON.stringify(Array.from(unlistedSet)));
                    maxId = Math.max(maxId, ...added);
                }
            });

        // Probe gaps between min and max
        const missing = [];
        for (let id = maxId - 1; id > minId; id--) {
            if (!currentIds.has(id)) missing.push(id);
        }

        Promise.all(missing.map(id => fetch(`https://api.greasyfork.org/scripts/${id}.json`).then(res => res.ok ? res.json() : null).catch(() => null)))
            .then(datas => {
                datas.filter(data => data && !data.deleted).forEach(data => {
                    if (!currentIds.has(data.id)) {
                        const li = createLiFromData(data);
                        li.style.backgroundColor = 'darkgreen';
                        insertByDate(li, data.created_at);
                        unlistedSet.add(data.id);
                    }
                });
                localStorage.setItem('unlistedIds', JSON.stringify(Array.from(unlistedSet)));
            });

        // Infinite scroll for regular
        window.addEventListener('scroll', () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && !loading) {
                loadNextRegularPage(minId);
            }
        });
    }

    function loadNextRegularPage(currentMinId) {
        loading = true;
        currentPage++;
        fetch(`https://api.greasyfork.org/en/scripts.json?sort=created&page=${currentPage}&filter_locale=0`)
            .then(res => res.json())
            .then(datas => {
                if (!datas.length) {
                    loading = false;
                    return;
                }
                const newIds = datas.map(d => d.id);
                const newMaxId = Math.max(...newIds);
                const newMinId = Math.min(...newIds);
                datas.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                datas.forEach(data => {
                    const li = createLiFromData(data);
                    ol.appendChild(li);
                });

                // Probe gaps
                const gapStart = currentMinId - 1;
                const gapEnd = newMaxId + 1;
                if (gapStart >= gapEnd) {
                    const gaps = [];
                    for (let id = gapStart; id >= gapEnd; id--) {
                        gaps.push(id);
                    }
                    Promise.all(gaps.map(id => fetch(`https://api.greasyfork.org/scripts/${id}.json`).then(res => res.ok ? res.json() : null).catch(() => null)))
                        .then(gdatas => {
                            gdatas.filter(data => data && !data.deleted).forEach(data => {
                                const li = createLiFromData(data);
                                li.style.backgroundColor = 'darkgreen';
                                insertByDate(li, data.created_at);
                                unlistedSet.add(data.id);
                            });
                            localStorage.setItem('unlistedIds', JSON.stringify(Array.from(unlistedSet)));
                            loading = false;
                        });
                } else {
                    loading = false;
                }
            }).catch(() => loading = false);
    }

    function handleUnlistedMode() {
        ol.innerHTML = '';
        unlistedIds = Array.from(unlistedSet).sort((a, b) => b - a);
        let currentIndex = 0;
        const batchSize = 30;
        let probeMin = unlistedIds.length ? Math.min(...unlistedIds) - 1 : 562961; // fallback to some high ID

        const loadBatch = () => {
            const batch = unlistedIds.slice(currentIndex, currentIndex + batchSize);
            if (!batch.length) return;
            Promise.all(batch.map(id => fetch(`https://api.greasyfork.org/scripts/${id}.json`).then(res => res.ok ? res.json() : null).catch(() => null)))
                .then(datas => {
                    datas.filter(data => data && !data.deleted).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).forEach(data => {
                        const li = createLiFromData(data);
                        li.style.backgroundColor = 'darkgreen';
                        ol.appendChild(li);
                    });
                    currentIndex += batchSize;
                });
        };

        loadBatch();

        window.addEventListener('scroll', () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && !loading) {
                loading = true;
                if (currentIndex < unlistedIds.length) {
                    loadBatch();
                    loading = false;
                } else {
                    const probes = [];
                    for (let i = 0; i < 20; i++) {
                        probes.push(probeMin - i);
                    }
                    Promise.all(probes.map(id => fetch(`https://api.greasyfork.org/scripts/${id}.json`).then(res => res.ok ? res.json() : null).catch(() => null)))
                        .then(datas => {
                            const newDatas = datas.filter(data => data && !data.deleted);
                            newDatas.forEach(data => {
                                unlistedSet.add(data.id);
                                unlistedIds.push(data.id);
                            });
                            unlistedIds.sort((a, b) => b - a);
                            localStorage.setItem('unlistedIds', JSON.stringify(unlistedIds));
                            newDatas.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).forEach(data => {
                                const li = createLiFromData(data);
                                li.style.backgroundColor = 'darkgreen';
                                ol.appendChild(li);
                            });
                            if (newDatas.length) {
                                probeMin = Math.min(...newDatas.map(d => d.id)) - 1;
                            } else {
                                probeMin -= 20;
                            }
                            loading = false;
                        });
                }
            }
        });
    }

    function insertByDate(newLi, createdStr) {
        const newDate = new Date(createdStr);
        let inserted = false;
        Array.from(ol.children).forEach(child => {
            if (inserted) return;
            const childDateStr = child.querySelector('.script-list-created-date relative-time')?.getAttribute('datetime');
            if (childDateStr) {
                const childDate = new Date(childDateStr);
                if (newDate > childDate) {
                    ol.insertBefore(newLi, child);
                    inserted = true;
                }
            }
        });
        if (!inserted) ol.appendChild(newLi);
    }

    function createLiFromData(data) {
        // Same as previous version, no change needed
        const li = document.createElement('li');
        li.dataset.scriptId = data.id;
        li.dataset.scriptName = data.name;
        const authors = {};
        data.users.forEach(u => { authors[u.id] = u.name; });
        li.dataset.scriptAuthors = JSON.stringify(authors);
        li.dataset.scriptDailyInstalls = data.daily_installs;
        li.dataset.scriptTotalInstalls = data.total_installs;
        li.dataset.scriptRatingScore = data.fan_score;
        const createdDate = new Date(data.created_at).toISOString().split('T')[0];
        li.dataset.scriptCreatedDate = createdDate;
        const updatedDate = new Date(data.code_updated_at).toISOString().split('T')[0];
        li.dataset.scriptUpdatedDate = updatedDate;
        li.dataset.scriptType = 'public';
        li.dataset.scriptVersion = data.version;
        li.dataset.sensitive = data.sensitive || 'false';
        li.dataset.scriptLanguage = 'js';
        li.dataset.cssAvailableAsJs = 'false';
        li.dataset.codeUrl = data.code_url;

        const article = document.createElement('article');
        li.appendChild(article);

        const h2 = document.createElement('h2');
        article.appendChild(h2);

        const a = document.createElement('a');
        a.className = 'script-link';
        const slug = data.name.toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-').replace(/^-|-$/g, '');
        a.href = `/en/scripts/${data.id}-${slug}`;
        a.textContent = data.name;
        h2.appendChild(a);

        const badge = document.createElement('span');
        badge.className = 'badge badge-js';
        badge.title = 'User script';
        badge.textContent = 'JS';
        h2.appendChild(badge);

        const sep = document.createElement('span');
        sep.className = 'name-description-separator';
        sep.textContent = ' - ';
        h2.appendChild(sep);

        const desc = document.createElement('span');
        desc.className = 'script-description description';
        desc.textContent = data.description;
        h2.appendChild(desc);

        const meta = document.createElement('div');
        meta.className = 'script-meta-block';
        article.appendChild(meta);

        const dl = document.createElement('dl');
        dl.className = 'inline-script-stats';
        meta.appendChild(dl);

        const dtAuthor = document.createElement('dt');
        dtAuthor.className = 'script-list-author';
        dtAuthor.innerHTML = '<span>Author</span>';
        dl.appendChild(dtAuthor);

        const ddAuthor = document.createElement('dd');
        ddAuthor.className = 'script-list-author';
        const spanAuthor = document.createElement('span');
        data.users.forEach(u => {
            const aUser = document.createElement('a');
            const userSlug = u.name.toLowerCase().replace(/ /g, '-');
            aUser.href = `/en/users/${u.id}-${userSlug}`;
            aUser.textContent = u.name;
            spanAuthor.appendChild(aUser);
        });
        ddAuthor.appendChild(spanAuthor);
        dl.appendChild(ddAuthor);

        const dtDaily = document.createElement('dt');
        dtDaily.className = 'script-list-daily-installs';
        dtDaily.innerHTML = '<span>Daily installs</span>';
        dl.appendChild(dtDaily);

        const ddDaily = document.createElement('dd');
        ddDaily.className = 'script-list-daily-installs';
        ddDaily.innerHTML = `<span>${data.daily_installs}</span>`;
        dl.appendChild(ddDaily);

        const dtTotal = document.createElement('dt');
        dtTotal.className = 'script-list-total-installs';
        dtTotal.innerHTML = '<span>Total installs</span>';
        dl.appendChild(dtTotal);

        const ddTotal = document.createElement('dd');
        ddTotal.className = 'script-list-total-installs';
        ddTotal.innerHTML = `<span>${data.total_installs}</span>`;
        dl.appendChild(ddTotal);

        const dtRatings = document.createElement('dt');
        dtRatings.className = 'script-list-ratings';
        dtRatings.innerHTML = '<span>Ratings</span>';
        dl.appendChild(dtRatings);

        const ddRatings = document.createElement('dd');
        ddRatings.className = 'script-list-ratings';
        ddRatings.dataset.ratingScore = data.fan_score;
        const spanRatings = document.createElement('span');
        spanRatings.innerHTML = `
<span class="good-rating-count" title="Number of people who rated it Good or added it to favorites;">${data.good_ratings}</span>
<span class="ok-rating-count" title="Number of people who rated it OK;">${data.ok_ratings}</span>
<span class="bad-rating-count" title="Number of people who rated it Bad;">${data.bad_ratings}</span>
`;
        ddRatings.appendChild(spanRatings);
        dl.appendChild(ddRatings);

        const dtCreated = document.createElement('dt');
        dtCreated.className = 'script-list-created-date';
        dtCreated.innerHTML = '<span>Created</span>';
        dl.appendChild(dtCreated);

        const ddCreated = document.createElement('dd');
        ddCreated.className = 'script-list-created-date';
        const spanCreated = document.createElement('span');
        const relCreated = document.createElement('relative-time');
        relCreated.datetime = data.created_at;
        relCreated.prefix = '';
        const createdObj = new Date(data.created_at);
        relCreated.title = createdObj.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short' });
        relCreated.textContent = createdDate;
        spanCreated.appendChild(relCreated);
        ddCreated.appendChild(spanCreated);
        dl.appendChild(ddCreated);

        const dtUpdated = document.createElement('dt');
        dtUpdated.className = 'script-list-updated-date';
        dtUpdated.innerHTML = '<span>Updated</span>';
        dl.appendChild(dtUpdated);

        const ddUpdated = document.createElement('dd');
        ddUpdated.className = 'script-list-updated-date';
        const spanUpdated = document.createElement('span');
        const relUpdated = document.createElement('relative-time');
        relUpdated.datetime = data.code_updated_at;
        relUpdated.prefix = '';
        const updatedObj = new Date(data.code_updated_at);
        relUpdated.title = updatedObj.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short' });
        relUpdated.textContent = updatedDate;
        spanUpdated.appendChild(relUpdated);
        ddUpdated.appendChild(spanUpdated);
        dl.appendChild(ddUpdated);

        return li;
    }
})();