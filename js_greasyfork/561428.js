// ==UserScript==
// @name         GGn Individual Torrent Bookmarker
// @namespace    delgan-ggn-individual-torrent-bookmarker
// @version      1.0.1
// @license      MIT
// @description  Bookmark single torrents (not groups) on GazelleGames.net
// @author       Delgan
// @match        https://gazellegames.net/torrents.php*
// @match        https://gazellegames.net/bookmarks.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561428/GGn%20Individual%20Torrent%20Bookmarker.user.js
// @updateURL https://update.greasyfork.org/scripts/561428/GGn%20Individual%20Torrent%20Bookmarker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = 'ggn_torrent_bookmarks';

    function getRelativeTime(date) {
        const now = new Date();
        const diffMs = now - date;
        const diffSecs = Math.floor(diffMs / 1000);
        const diffMins = Math.floor(diffSecs / 60);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);
        const diffWeeks = Math.floor(diffDays / 7);
        const diffMonths = Math.floor(diffDays / 30);
        const diffYears = Math.floor(diffDays / 365);

        if (diffYears > 0) {
            return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
        } else if (diffMonths > 0) {
            return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
        } else if (diffWeeks > 0) {
            return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`;
        } else if (diffDays > 0) {
            return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        } else if (diffHours > 0) {
            return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        } else if (diffMins > 0) {
            return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
        } else {
            return 'just now';
        }
    }

    function loadBookmarks() {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    }

    function saveBookmarks(bookmarks) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
    }

    function addBookmark(torrentData) {
        const bookmarks = loadBookmarks();
        const uniqueId = `${torrentData.groupId}-${torrentData.torrentId}`;
        const index = bookmarks.findIndex(b => `${b.groupId}-${b.torrentId}` === uniqueId);

        // Probably already added in another tab, update instead.
        if (index !== -1) {
            torrentData.bookmarkedAt = bookmarks[index].bookmarkedAt;
            // Search page may not have edition info, preserve existing if so.
            if (torrentData.edition === null) {
                torrentData.edition = bookmarks[index].edition;
            }
            bookmarks[index] = torrentData;
        } else {
            bookmarks.push(torrentData);
        }
        saveBookmarks(bookmarks);
    }

    function removeBookmark(groupId, torrentId) {
        const uniqueId = `${groupId}-${torrentId}`;
        const bookmarks = loadBookmarks();
        const index = bookmarks.findIndex(b => `${b.groupId}-${b.torrentId}` === uniqueId);
        if (index !== -1) {
            bookmarks.splice(index, 1);
        }
        saveBookmarks(bookmarks);
    }

    function updateBookmarks(torrentsData) {
        const bookmarks = loadBookmarks();
        torrentsData.forEach(updatedTorrent => {
            const uniqueId = `${updatedTorrent.groupId}-${updatedTorrent.torrentId}`;
            const index = bookmarks.findIndex(b => `${b.groupId}-${b.torrentId}` === uniqueId);
            if (index !== -1) {
                updatedTorrent.bookmarkedAt = bookmarks[index].bookmarkedAt;
                // Search page may not have edition info, preserve existing if so.
                if (updatedTorrent.edition === null) {
                    updatedTorrent.edition = bookmarks[index].edition;
                }
                bookmarks[index] = updatedTorrent;
            }
        });
        saveBookmarks(bookmarks);
    }

    function loadUserBookmarks(importedData) {
        if (!importedData || typeof importedData !== 'object') {
            throw new Error('Invalid import data: not a valid JSON object');
        }

        if (!importedData.version) {
            throw new Error('Invalid import data: missing version field');
        }

        if (!importedData.torrents || !Array.isArray(importedData.torrents)) {
            throw new Error('Invalid import data: missing or invalid torrents array');
        }

        switch (importedData.version) {
            case 1:
                return parseBookmarksV1(importedData);
            default:
                throw new Error(`Unsupported import version: ${importedData.version}`);
        }
    }

    function parseBookmarksV1(importedData) {
        // Poor-man's schema validation.
        const TEMPLATE = {
            groupId: '0',
            torrentId: '0',
            name: '',
            edition: '',
            size: '',
            snatched: 0,
            seeders: 0,
            leechers: 0,
            uploadDate: '',
            uploader: '',
            uploaderId: '',
            groupName: '',
            platformClass: '',
            externalLink: '',
            bookmarkedAt: '',
            updatedAt: ''
        };

        for (let i = 0; i < importedData.torrents.length; i++) {
            const torrent = importedData.torrents[i];
            const templateFields = Object.keys(TEMPLATE);

            for (let j = 0; j < templateFields.length; j++) {
                const field = templateFields[j];

                if (!(field in torrent)) {
                    throw new Error(`Invalid torrent at index ${i}: missing field '${field}'`);
                }

                const expectedType = typeof TEMPLATE[field];
                const actualType = typeof torrent[field];

                if (torrent[field] !== null && actualType !== expectedType) {
                    throw new Error(`Invalid torrent at index ${i}: field '${field}' has wrong type (expected ${expectedType}, got ${actualType})`);
                }
            }
        }

        return Array.from(importedData.torrents);
    }

    function parseTorrentInfoSearchPage(torrentRow, torrentId, groupId) {
        const name = torrentRow.querySelector('td:first-child > a[href]').textContent.trim();
        const externalLink = torrentRow.querySelector('td span a[title="External Link"]')?.href || null;

        const edition = (() => {
            // Iterate backwards looking for "edition_info" row.
            let row = torrentRow.previousElementSibling;
            while (row) {
                const editionText = row.querySelector('td.edition_info strong');
                if (editionText) {
                    // If the edition matches the pattern "Edition (YEAR)", we reformat
                    // it to "YEAR - Edition" for consistency with torrent page.
                    const editionStr = editionText.textContent.trim();
                    const match = editionStr.match(/^(.*)\s+\((\d{4})\)$/);
                    if (match) {
                        return `${match[2]} - ${match[1]}`;
                    } else {
                        return editionStr;
                    }
                }
                // Stop if we hit the group header row.
                if (row.classList.contains('group')) {
                    return null;
                }
                row = row.previousElementSibling;
            }
            return null;
        })();

        const [groupName, platformClass] = (() => {
            // Iterate backwards to find the "group" row.
            let row = torrentRow.previousElementSibling;
            while (row) {
                if (row.classList.contains('group')) {
                    const platformClass = row.querySelector('td.cats_col > div[title]').className;
                    const tdDiv = row.querySelector('td#displayname');
                    const groupplatform = tdDiv.querySelector('#groupplatform');
                    const groupname = tdDiv.querySelector('#groupname');
                    const groupyear = tdDiv.querySelector('#groupyear');

                    // Sometimes there is no platform (e.g. for E-books, OSTs, Apps).
                    // But if there is one, we rebuild the group name for consistency
                    // with torrent page.
                    let groupName = '';
                    groupName += groupplatform ? groupplatform.textContent.trim() : '';
                    groupName += (groupName && groupname) ? ' – ' : '';
                    groupName += groupname ? groupname.textContent.trim() : '';
                    groupName += groupyear ? ` ${groupyear.textContent.trim()}` : '';

                    return [groupName, platformClass];
                }
                row = row.previousElementSibling;
            }
            return [null, null];
        })();

        const cells = torrentRow.querySelectorAll('td');

        const [size, snatched, seeders, leechers] = (() => {
            if (externalLink !== null) {
                const snatched = parseInt(cells[4].textContent.trim().replace(",", ""));
                return [null, snatched, null, null];
            }
            const size = cells[3].textContent.trim();
            const snatched = parseInt(cells[4].textContent.trim().replace(",", ""));
            const seeders = parseInt(cells[5].textContent.trim().replace(",", ""));
            const leechers = parseInt(cells[6].textContent.trim().replace(",", ""));
            return [size, snatched, seeders, leechers];
        })();

        const uploadDateStr = cells[1].querySelector('.time').getAttribute('title');
        const uploadDate = new Date(uploadDateStr).toISOString();

        const [uploader, uploaderId] = (() => {
            const uploaderLinkElem = cells[2].querySelector('a.username[href*="user.php"]');
            if (!uploaderLinkElem) {
                return ['Anonymous', null];
            }
            const uploader = uploaderLinkElem.textContent.trim();
            const href = uploaderLinkElem.getAttribute('href');
            const match = href.match(/[?&]id=(\d+)/);
            const uploaderId = match[1];
            return [uploader, uploaderId];
        })();


        return {
            groupId: groupId,
            torrentId: torrentId,
            name: name,
            edition: edition,
            size: size,
            snatched: snatched,
            seeders: seeders,
            leechers: leechers,
            uploadDate: uploadDate,
            uploader: uploader,
            uploaderId: uploaderId,
            groupName: groupName,
            platformClass: platformClass,
            externalLink: externalLink,
            bookmarkedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
    }

    function parseTorrentInfoTorrentPage(torrentRow, torrentId, groupId) {
        const name = torrentRow.querySelector('td:first-child > a[href]').textContent.trim();
        const externalLink = torrentRow.querySelector('td span a[title="External Link"]')?.href || null;

        const editionCell = torrentRow.parentElement.previousElementSibling.querySelector('td.edition_info strong');
        const edition = editionCell ? editionCell.textContent.trim() : null;

        const cells = torrentRow.querySelectorAll('td');

        const [size, snatched, seeders, leechers] = (() => {
            if (externalLink !== null) {
                const snatched = parseInt(cells[2].textContent.trim().replace(",", ""));
                return [null, snatched, null, null];
            }
            const size = cells[2].textContent.trim();
            const snatched = parseInt(cells[3].textContent.trim().replace(",", ""));
            const seeders = parseInt(cells[4].textContent.trim().replace(",", ""));
            const leechers = parseInt(cells[5].textContent.trim().replace(",", ""));
            return [size, snatched, seeders, leechers];
        })();

        const blockquote = torrentRow.nextElementSibling.querySelector('blockquote');

        const uploadDateStr = blockquote.querySelector('.time').getAttribute('title');
        const uploadDate = new Date(uploadDateStr).toISOString();

        const [uploader, uploaderId] = (() => {
            const uploaderLinkElem = blockquote.querySelector('a[href*="user.php"]');
            if (!uploaderLinkElem) {
                return ['Anonymous', null];
            }
            const uploader = uploaderLinkElem.textContent.trim();
            const href = uploaderLinkElem.getAttribute('href');
            const match = href.match(/[?&]id=(\d+)/);
            const uploaderId = match[1];
            return [uploader, uploaderId];
        })();


        const displayName = document.querySelector('#display_name').cloneNode(true);
        displayName.querySelectorAll('.group_rating').forEach(el => el.remove());
        const groupName = displayName.textContent.trim();

        const platformClass = (() => {
            const curLinkedGroup = document.querySelector('#curlinkedgroup');
            if (curLinkedGroup) {
                return curLinkedGroup.className;
            }
            // Sometimes there is no group links. Fallback: look for platform's name
            // and convert to class.
            const groupPlatform = document.querySelector('#groupplatform');
            if (groupPlatform) {
                return groupPlatform.textContent.trim().toLowerCase().replace(/\s+/g, '');
            }
            // If there is no platform name, it's likely a E-book, OST or App.
            const userScriptData = document.querySelector('#user_script_data');
            const categoryId = userScriptData.getAttribute("data-category-id");
            const categoryMap = {
                "2": "cats_applications",
                "3": "cats_ebooks",
                "4": "cats_ost",
            };
            return categoryMap[categoryId] || null;
        })();

        return {
            groupId: groupId,
            torrentId: torrentId,
            name: name,
            edition: edition,
            size: size,
            snatched: snatched,
            seeders: seeders,
            leechers: leechers,
            uploadDate: uploadDate,
            uploader: uploader,
            uploaderId: uploaderId,
            groupName: groupName,
            platformClass: platformClass,
            externalLink: externalLink,
            bookmarkedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
    }

    function parseTorrentInfo(torrentRow, torrentId, groupId, isSearchPage) {
        // Here are a few edge cases to consider:
        // - No edition info: https://gazellegames.net/torrents.php?id=179698&torrentid=705875
        // - No group links: https://gazellegames.net/torrents.php?id=75783&torrentid=272391
        // - No group platform: https://gazellegames.net/torrents.php?id=148333&torrentid=572780
        // - Internal link: https://gazellegames.net/torrents.php?id=7527&torrentid=530678
        // - External link: https://gazellegames.net/torrents.php?id=3271&linkid=141
        // - Edition not listed in search results: https://gazellegames.net/torrents.php?searchstr=HTML5+Games+Development+by+Example%3A+Beginner%27s+Guide+by+Makzan

        if (isSearchPage) {
            return parseTorrentInfoSearchPage(torrentRow, torrentId, groupId);
        } else {
            return parseTorrentInfoTorrentPage(torrentRow, torrentId, groupId);
        }
    }

    function updateBookmarkButtonState(bmLink, isBookmarked) {
        if (isBookmarked) {
            bmLink.title = 'Remove Bookmark';
            bmLink.classList.add('ggn-bookmarked');
        } else {
            bmLink.title = 'Bookmark this torrent';
            bmLink.classList.remove('ggn-bookmarked');
        }
    }

    function createBookmarkButton(torrentRow, torrentId, groupId, isBookmarked, isSearchPage) {
        const bmLink = document.createElement('a');
        bmLink.href = '#';
        bmLink.textContent = 'BM';

        updateBookmarkButtonState(bmLink, isBookmarked);

        bmLink.addEventListener('click', function (e) {
            e.preventDefault();

            // Current visible state is used as source of truth, since this it was the user is
            // clicking and wants to toggle. That means we ignore actual stored state that might
            // have been modified in another tab.
            const currentlyBookmarked = bmLink.classList.contains('ggn-bookmarked');

            if (currentlyBookmarked) {
                removeBookmark(groupId, torrentId);
                updateBookmarkButtonState(bmLink, false);
            } else {
                const torrentData = parseTorrentInfo(torrentRow, torrentId, groupId, isSearchPage);
                addBookmark(torrentData);
                updateBookmarkButtonState(bmLink, true);
            }
        });

        return bmLink;
    }

    function addBookmarkButtons(bookmarks, isSearchPage = false) {
        // Let's build a hash map to quickly check whether a torrent is bookmarked and
        // highlight the "BM" link appropriately. This is a throwaway, it become useless
        // after the initial iteration (we don't need to update it even if state changes).
        const bookmarksSet = new Set(bookmarks.map(b => `${b.groupId}-${b.torrentId}`));

        const torrentRows = (() => {
            if (isSearchPage) {
                return document.querySelectorAll('tr.group_torrent[class*="edition_"]');
            } else {
                return document.querySelectorAll('tr.group_torrent[id^="torrent"]');
            }
        })();


        let torrentsUpdated = [];
        torrentRows.forEach(row => {
            const firstCell = row.querySelector('td:first-child');

            const [groupId, torrentId] = (() => {
                if (isSearchPage) {
                    const link = firstCell.querySelector(':scope > a[href]').getAttribute('href');
                    const match = link.match(/[?&]id=(\d+).*?[?&](?:torrentid|linkid)=(\d+)/);
                    return [match[1], match[2]];
                } else {
                    const urlParams = new URLSearchParams(window.location.search);
                    const gid = urlParams.get('id');
                    const tid = row.id.replace('torrent', '');
                    return [gid, tid];
                }
            })();

            const isBookmarked = bookmarksSet.has(`${groupId}-${torrentId}`);

            const bmButton = createBookmarkButton(row, torrentId, groupId, isBookmarked, isSearchPage);

            const buttons = firstCell.querySelector('span');

            const closingBracket = buttons.lastChild;
            buttons.insertBefore(document.createTextNode(' | '), closingBracket);
            buttons.insertBefore(bmButton, closingBracket);
            buttons.insertBefore(document.createTextNode(' '), closingBracket);

            // If torrent is already bookmarked, refresh its data.
            if (isBookmarked) {
                const updatedData = parseTorrentInfo(row, torrentId, groupId, isSearchPage);
                torrentsUpdated.push(updatedData);
            }
        });

        // Update stored bookmarks data if any of the torrents on the page were bookmarked.
        if (torrentsUpdated.length > 0) {
            updateBookmarks(torrentsUpdated);
        }
    }

    function init() {
        const bookmarks = loadBookmarks();

        if (window.location.pathname.includes('/bookmarks.php')) {
            initBookmarksPage(bookmarks);
        } else if (window.location.pathname.includes('/torrents.php')) {
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.has('id')) {
                // Page of a torrent group.
                addBookmarkButtons(bookmarks, false);
            } else {
                // Page of search results.
                addBookmarkButtons(bookmarks, true);
            }
        }

        const style = document.createElement('style');
        style.textContent = `
            .ggn-bookmarked {
                font-weight: bold !important;
                color: #d9e473ff !important;
            }
            #individual_torrents_view {
                margin-top: 20px;
            }
            .individual-torrent-row {
                border-bottom: 1px solid #444;
            }
            .individual-torrent-row:hover {
                background-color: rgba(255, 255, 255, 0.05);
            }
            .torrent_table td {
                padding: 6px !important;
            }
            .stats-cell {
                text-align: center !important;
                vertical-align: middle !important;
                width: 16px !important;
            }
            .header-stats-cell {
                text-align: center !important;
                vertical-align: middle !important;
                width: 16px !important;
            }
        `;
        document.head.appendChild(style);
    }

    function initBookmarksPage(bookmarks) {
        const urlParams = new URLSearchParams(window.location.search);
        const bookmarkType = urlParams.get('type');

        // If we're on the individual_torrents page, build it
        if (bookmarkType === 'individual_torrents') {
            buildIndividualTorrentsPage(bookmarks);
            return;
        }

        // Otherwise, just add the "[ Individual Torrents ]" link
        const linkbox = document.querySelector('.linkbox');
        if (!linkbox) {
            return;
        }

        const individualLink = document.createElement('a');
        individualLink.href = 'bookmarks.php?type=individual_torrents';
        individualLink.className = 'brackets';
        individualLink.textContent = ' Individual Torrents ';

        const requestsLink = linkbox.querySelector('a[href*="type=requests"]');
        if (requestsLink && requestsLink.nextSibling) {
            linkbox.insertBefore(individualLink, requestsLink.nextSibling);
        }
    }

    function buildIndividualTorrentsPage(bookmarks) {
        document.title = 'Your bookmarked individual torrents :: GazelleGames.net';

        const thinContainer = document.querySelector('.thin');
        if (!thinContainer) {
            return;
        }

        thinContainer.innerHTML = '';

        const headerDiv = document.createElement('div');
        headerDiv.className = 'header';
        const heading = document.createElement('h2');
        heading.textContent = 'Your bookmarked individual torrents';
        headerDiv.appendChild(heading);
        thinContainer.appendChild(headerDiv);

        const linkbox = document.createElement('div');
        linkbox.className = 'linkbox';
        linkbox.innerHTML = `
            <a href="bookmarks.php?type=torrents" class="brackets"> Torrents </a>
            <a href="bookmarks.php?type=collections" class="brackets"> Collections </a>
            <a href="bookmarks.php?type=requests" class="brackets"> Requests </a>
            <a href="bookmarks.php?type=individual_torrents" class="brackets"> Individual Torrents </a>
            <br><br>
            <a href="#" id="export_bookmarks" class="brackets"> Export Torrents </a>
            <a href="#" id="import_bookmarks" class="brackets"> Import Torrents </a>
            <br><br>
        `;
        thinContainer.appendChild(linkbox);

        const exportButton = document.getElementById('export_bookmarks');
        exportButton.addEventListener('click', function (e) {
            e.preventDefault();
            const exportData = {
                version: 1,
                exportedAt: new Date().toISOString(),
                torrents: loadBookmarks(),
            };
            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'ggn_individual_torrents_' + new Date().toISOString().split('T')[0] + '.json';
            link.click();
            URL.revokeObjectURL(url);
        });

        const importButton = document.getElementById('import_bookmarks');
        importButton.addEventListener('click', function (e) {
            e.preventDefault();

            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'application/json';
            fileInput.addEventListener('change', function () {
                const file = fileInput.files[0];
                if (!file) {
                    return;
                }

                const reader = new FileReader();
                reader.onload = function (event) {
                    try {
                        const importedData = JSON.parse(event.target.result);
                        const newBookmarks = loadUserBookmarks(importedData);
                        const currentBookmarks = loadBookmarks();

                        const currentCount = currentBookmarks.length;
                        const newCount = newBookmarks.length;
                        const confirmed = confirm(
                            `WARNING: This will REPLACE all your existing bookmarks!\n\n` +
                            `Current bookmarks: ${currentCount}\n` +
                            `Bookmarks in file: ${newCount}\n\n` +
                            `Do you want to continue?`
                        );

                        if (!confirmed) {
                            return;
                        }

                        saveBookmarks(newBookmarks);
                        window.location.reload();
                    } catch (err) {
                        alert('Error importing bookmarks: ' + err.message);
                    }
                };
                reader.readAsText(file);
            });
            fileInput.click();

        });

        if (bookmarks.length === 0) {
            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'box pad';
            emptyDiv.setAttribute('align', 'center');
            const emptyHeading = document.createElement('h2');
            emptyHeading.textContent = 'You have not bookmarked any individual torrents.';
            emptyDiv.appendChild(emptyHeading);
            thinContainer.appendChild(emptyDiv);
            return;
        }

        const tableWrapper = document.createElement('div');
        tableWrapper.className = 'thin';

        const table = document.createElement('table');
        table.className = 'torrent_table';
        table.style.width = '100%';

        const thead = document.createElement('tbody');
        const headerRow = document.createElement('tr');
        headerRow.className = 'colhead_dark';
        headerRow.innerHTML = `
            <td width="20px"></td>
            <td width="72px"><strong>Actions</strong></td>
            <td width="50%"><strong>Name</strong></td>
            <td><strong>Edition</strong></td>
            <td><strong>Who</strong></td>
            <td><strong>When</strong></td>
            <td><strong>Size</strong></td>
            <td class="header-stats-cell"><img src="static/styles/game_room/images/snatched.png" alt="Snatches" title="Snatches" onerror="this.style.display='none'"></td>
            <td class="header-stats-cell"><img src="static/styles/game_room/images/seeders.png" alt="Seeders" title="Seeders" onerror="this.style.display='none'"></td>
            <td class="header-stats-cell"><img src="static/styles/game_room/images/leechers.png" alt="Leechers" title="Leechers" onerror="this.style.display='none'"></td>
            <td width="20px"></td>
        `;
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');

        // Iterate backwards to show newest first (bookmarks are added with push(), so oldest-first in array)
        for (let i = bookmarks.length - 1; i >= 0; i--) {
            const bookmark = bookmarks[i];
            const row = document.createElement('tr');
            row.className = 'group_torrent';
            row.style.fontWeight = 'normal';

            // Platform icon cell
            const platformCell = document.createElement('td');
            platformCell.style.textAlign = 'center';
            if (bookmark.platformClass) {
                const platformLink = document.createElement('a');
                platformLink.href = `torrents.php?id=${bookmark.groupId}`;
                platformLink.title = bookmark.groupName || '';
                const platformDiv = document.createElement('div');
                platformDiv.className = bookmark.platformClass;
                platformDiv.style.display = 'inline-block';
                platformDiv.style.width = '16px';
                platformDiv.style.height = '16px';
                platformDiv.style.backgroundSize = 'contain';
                platformLink.appendChild(platformDiv);
                platformCell.appendChild(platformLink);
            } else {
                const placeholderImg = document.createElement('img');
                placeholderImg.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAEElEQVR4AQEFAPr/AAAAAAAABQABZHiVOAAAAABJRU5ErkJggg==';
                placeholderImg.width = 16;
                placeholderImg.height = 16;
                placeholderImg.alt = 'Unknown platform';
                const platformLink = document.createElement('a');
                platformLink.href = `torrents.php?id=${bookmark.groupId}`;
                platformLink.title = bookmark.groupName || '';
                platformLink.appendChild(placeholderImg);
                platformCell.appendChild(platformLink);
            }
            row.appendChild(platformCell);

            // Download buttons cell
            const downloadCell = document.createElement('td');
            const span = document.createElement('span');
            span.style.marginLeft = '0';
            span.appendChild(document.createTextNode('[ '));
            if (bookmark.externalLink === null) {
                const dlLink = document.createElement('a');
                dlLink.href = `torrents.php?action=download&id=${bookmark.torrentId}`;
                dlLink.textContent = 'DL';
                dlLink.title = 'Download';
                span.appendChild(dlLink);
                span.appendChild(document.createTextNode(' | '));
                const flLink = document.createElement('a');
                flLink.href = `torrents.php?action=download&id=${bookmark.torrentId}&usetoken=1`;
                flLink.textContent = 'FL';
                flLink.title = 'Use freeleech token';
                span.appendChild(flLink);
                span.appendChild(document.createTextNode(' | '));
                const rpLink = document.createElement('a');
                rpLink.href = `reportsv2.php?action=report&id=${bookmark.torrentId}`;
                rpLink.textContent = 'RP';
                rpLink.title = 'Report';
                span.appendChild(rpLink);
            } else {
                const lnLink = document.createElement('a');
                lnLink.href = bookmark.externalLink;
                lnLink.textContent = 'LN';
                lnLink.title = 'External Link';
                span.appendChild(lnLink);
                span.appendChild(document.createTextNode(' | '));
                const rpLink = document.createElement('a');
                rpLink.href = `reportsv2.php?action=report&id=${bookmark.torrentId}&type=link`;
                rpLink.textContent = 'RP';
                rpLink.title = 'Report';
                span.appendChild(rpLink);
            }
            span.appendChild(document.createTextNode(' ]'));
            downloadCell.appendChild(span);
            row.appendChild(downloadCell);

            // Name cell
            const nameCell = document.createElement('td');
            nameCell.colSpan = 1;
            const nameLink = document.createElement('a');
            if (bookmark.externalLink === null) {
                nameLink.href = `torrents.php?id=${bookmark.groupId}&torrentid=${bookmark.torrentId}#torrent${bookmark.torrentId}`;
            } else {
                nameLink.href = `torrents.php?id=${bookmark.groupId}&linkid=${bookmark.torrentId}#torrent${bookmark.torrentId}`;
            }
            nameLink.textContent = bookmark.name;
            nameLink.title = bookmark.name;
            nameCell.appendChild(nameLink);
            row.appendChild(nameCell);

            // Edition cell
            const editionCell = document.createElement('td');
            editionCell.style.fontSize = '0.9em';
            if (bookmark.edition !== null) {
                editionCell.style.color = '#aaa';
                editionCell.textContent = bookmark.edition;
            } else {
                const em = document.createElement('em');
                em.textContent = 'Unknown';
                em.style.color = '#888';
                editionCell.appendChild(em);
            }
            row.appendChild(editionCell);

            // Uploader cell
            const uploaderCell = document.createElement('td');
            uploaderCell.className = 'nobr';
            uploaderCell.style.fontSize = '0.9em';
            if (bookmark.uploaderId !== null) {
                const uploaderLink = document.createElement('a');
                uploaderLink.href = `user.php?id=${bookmark.uploaderId}`;
                uploaderLink.textContent = bookmark.uploader;
                uploaderLink.className = 'username';
                uploaderCell.appendChild(uploaderLink);
            } else {
                const em = document.createElement('em');
                em.textContent = bookmark.uploader;
                uploaderCell.appendChild(em);
            }
            row.appendChild(uploaderCell);

            // Age cell with torrent age (not bookmark date)
            const uploadDateCell = document.createElement('td');
            uploadDateCell.className = 'nobr';
            // Parse the date and convert to relative time
            const uploadDate = new Date(bookmark.uploadDate);
            const relativeTime = getRelativeTime(uploadDate);
            uploadDateCell.textContent = relativeTime;
            uploadDateCell.title = uploadDate.toLocaleString();
            uploadDateCell.style.fontSize = '0.9em';
            row.appendChild(uploadDateCell);

            // Size cell
            const sizeCell = document.createElement('td');
            sizeCell.className = 'nobr';
            sizeCell.textContent = bookmark.size || "--";
            row.appendChild(sizeCell);

            // Stats cells
            const snatchedCell = document.createElement('td');
            snatchedCell.className = 'stats-cell';
            snatchedCell.textContent = bookmark.snatched?.toLocaleString() || "--";
            row.appendChild(snatchedCell);

            const seedersCell = document.createElement('td');
            seedersCell.className = 'stats-cell';
            seedersCell.textContent = bookmark.seeders?.toLocaleString() || "--";
            row.appendChild(seedersCell);

            const leechersCell = document.createElement('td');
            leechersCell.className = 'stats-cell';
            leechersCell.textContent = bookmark.leechers?.toLocaleString() || "--";
            row.appendChild(leechersCell);

            // Unbookmark cell
            const unbookmarkCell = document.createElement('td');
            const removeLink = document.createElement('a');
            removeLink.href = '#';
            removeLink.textContent = '[Unbookmark]';
            removeLink.className = 'removebookmark';
            removeLink.title = 'Remove bookmark';
            removeLink.style.margin = '0px';
            removeLink.style.padding = '0px 0px 3px 3px';
            removeLink.addEventListener('click', function (e) {
                e.preventDefault();
                removeBookmark(bookmark.groupId, bookmark.torrentId);
                row.remove();
                if (tbody.children.length === 0) {
                    buildIndividualTorrentsPage([]);
                }
            });
            unbookmarkCell.appendChild(removeLink);
            row.appendChild(unbookmarkCell);

            tbody.appendChild(row);
        }

        table.appendChild(tbody);
        tableWrapper.appendChild(table);
        thinContainer.appendChild(tableWrapper);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
