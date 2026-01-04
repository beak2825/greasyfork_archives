// ==UserScript==
// @name         GitHub PR List: Show Reviewers
// @version      1.3
// @description  Display reviewers with avatars next to PR title
// @license      GPL
// @match        https://github.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @namespace https://github.com/Myouboku
// @downloadURL https://update.greasyfork.org/scripts/557968/GitHub%20PR%20List%3A%20Show%20Reviewers.user.js
// @updateURL https://update.greasyfork.org/scripts/557968/GitHub%20PR%20List%3A%20Show%20Reviewers.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const TOKEN_KEY = 'gh_token_v2';
    let token = GM_getValue(TOKEN_KEY);

    if (!token) {
        token = prompt(
            'GitHub token missing.\n' +
            'Create a token at: https://github.com/settings/tokens\n' +
            'Required permissions: repo (read)\n\n' +
            'Paste your token:'
        );

        if (!token || token.trim() === '') {
            console.log('GitHub PR Reviewers: token not provided');
            return;
        }

        token = token.trim();
        GM_setValue(TOKEN_KEY, token);
        alert('Token saved. Reload the page.');
        return;
    }

    const style = document.createElement('style');
    style.textContent = `
    .gh-reviewer-container {
        margin-left: 8px;
        display: inline-flex;
        align-items: center;
        vertical-align: middle;
    }
    .gh-reviewer-container a {
        text-decoration: none;
    }
    .gh-reviewer-avatar {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        margin-left: -4px;
        background-color: var(--color-canvas-subtle);
        transition: margin-left 0.2s ease, transform 0.1s ease;
        position: relative;
        z-index: 1;
        box-shadow: 0 0 0 2px #6e7681;
    }
    .gh-reviewer-container a:first-child .gh-reviewer-avatar {
        margin-left: 0;
    }
    .gh-reviewer-container:hover a:not(:first-child) .gh-reviewer-avatar {
        margin-left: 8px;
    }
    .gh-reviewer-avatar:hover {
        transform: scale(1.2);
        z-index: 10;
    }
    .status-APPROVED {
        box-shadow: 0 0 0 2px #2da44e !important;
    }
    .status-CHANGES_REQUESTED {
        box-shadow: 0 0 0 2px #cf222e !important;
    }
    .status-COMMENTED {
        box-shadow: 0 0 0 2px #6e7681 !important;
    }
    .status-PENDING {
        box-shadow: 0 0 0 2px #D29922 !important;
    }
    `;
    document.head.appendChild(style);

    let reviewersData = {};
    let containersByPR = {};

    function processRows() {
        if (!window.location.href.includes('/pulls')) return;

        const repoMatch = window.location.pathname.match(
            /^\/([^/]+)\/([^/]+)\/pulls/
        );
        const isGlobalPage = window.location.pathname === '/pulls' ||
              window.location.pathname.startsWith('/pulls?');

        if (!repoMatch && !isGlobalPage) return;

        const prRows = Array.from(
            document.querySelectorAll(
                '.js-issue-row:not([data-rv-loaded="true"])'
            )
        );

        if (prRows.length === 0) return;

        const prsByRepo = new Map();

        prRows.forEach(row => {
            const link = row.querySelector(
                'a.js-navigation-open[data-hovercard-type="pull_request"]'
            );
            if (!link || row.offsetParent === null) return;

            row.setAttribute('data-rv-loaded', 'true');

            const prPath = link.getAttribute('href').split('/');
            const owner = prPath[1];
            const repo = prPath[2];
            const prNumber = parseInt(prPath[4]);

            const container = document.createElement('span');
            container.className = 'gh-reviewer-container';
            container.innerText = '..';

            containersByPR[prNumber] = container;
            link.parentNode.insertBefore(container, link.nextSibling);

            if (reviewersData[prNumber]) {
                renderReviewers(container, reviewersData[prNumber]);
            } else {
                const repoKey = `${owner}/${repo}`;
                if (!prsByRepo.has(repoKey)) {
                    prsByRepo.set(repoKey, { owner, repo, numbers: [] });
                }
                prsByRepo.get(repoKey).numbers.push(prNumber);
            }
        });

        prsByRepo.forEach(({ owner, repo, numbers }) => {
            fetchPRsReviewers(owner, repo, numbers);
        });
    }

    function fetchPRsReviewers(owner, repo, prNumbers) {
        const prFragments = prNumbers.map((num, i) => `
    pr${i}: pullRequest(number: ${num}) {
        number
        reviewRequests(first: 10) {
            nodes {
                requestedReviewer {
                    ... on User {
                        login
                        avatarUrl
                        url
                    }
                    ... on Bot {
                        login
                        avatarUrl
                        url
                    }
                }
            }
        }
        latestReviews(first: 10) {
            nodes {
                author {
                    ... on User {
                        login
                        avatarUrl
                        url
                    }
                    ... on Bot {
                        login
                        avatarUrl
                        url
                    }
                }
                state
                submittedAt
            }
        }
    }
`).join('\n');

        const query = `
        query($owner: String!, $repo: String!) {
            repository(owner: $owner, name: $repo) {
                ${prFragments}
            }
        }
    `;

        console.log("request");
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://api.github.com/graphql",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            data: JSON.stringify({ query, variables: { owner, repo } }),
            onload: (res) => {
                if (res.status !== 200) {
                    console.error('GraphQL failed:', res.responseText);
                    return;
                }

                const data = JSON.parse(res.responseText);

                if (data.errors) {
                    console.error('GraphQL errors:', data.errors);
                    return;
                }

                const repository = data.data?.repository;
                if (!repository) return;

                Object.keys(repository).forEach(key => {
                    const pr = repository[key];
                    if (!pr || !pr.number) return;

                    const uniqueUsers = new Map();

                    (pr.latestReviews?.nodes || []).forEach(r => {
                        if (r.author && r.state !== 'DISMISSED') {
                            uniqueUsers.set(r.author.login, {
                                login: r.author.login,
                                avatar: r.author.avatarUrl,
                                url: r.author.url,
                                state: r.state,
                            });
                        }
                    });

                    (pr.reviewRequests?.nodes || []).forEach(rr => {
                        const reviewer = rr.requestedReviewer;
                        if (reviewer) {
                            uniqueUsers.set(reviewer.login, {
                                login: reviewer.login,
                                avatar: reviewer.avatarUrl,
                                url: reviewer.url,
                                state: 'PENDING',
                            });
                        }
                    });

                    reviewersData[pr.number] = Object.fromEntries(uniqueUsers);

                    const container = containersByPR[pr.number];
                    if (container) {
                        renderReviewers(container, reviewersData[pr.number]);
                    }
                });
            },
            onerror: (err) => {
                console.error('GraphQL request failed:', err);
            }
        });
    }

    function renderReviewers(container, users) {
        container.innerText = '';

        const usersMap =
              users instanceof Map ?
              users :
        new Map(Object.entries(users));

        if (usersMap.size === 0) {
            container.remove();
            return;
        }

        const prLink = container.previousSibling;
        const prPath = prLink?.getAttribute('href')?.split('/');
        const owner = prPath?.[1];
        const repo = prPath?.[2];

        usersMap.forEach(user => {
            if (user.state === 'DISMISSED') return;

            const link = document.createElement('a');
            link.href = `https://github.com/${owner}/${repo}/pulls?q=is%3Apr+reviewed-by%3A${user.login}+is%3Aopen`;
            link.style.textDecoration = 'none';

            const img = document.createElement('img');
            img.src = user.avatar;
            img.title = `${user.login} [${user.state}]`;
            img.className = `gh-reviewer-avatar status-${user.state}`;

            link.appendChild(img);
            container.appendChild(link);
        });
    }

    setInterval(processRows, 200);
})();