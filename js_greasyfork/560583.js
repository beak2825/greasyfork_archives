// ==UserScript==
// @name         Bitcointalk All-in-One Enhancer
// @namespace    Violentmonkey Scripts
// @version      1.0.0
// @description  Tema AMOLED, gestione merit, note utente con tag, e thread pinnati per Bitcointalk.
// @match        https://bitcointalk.org/*
// @match        https://bitcointalk.org/index.php?board=*
// @grant        GM.setValue
// @grant        GM.getValue
// @author       Ace D.Portugal
// @license      MIT
// @require      https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.3.1.min.js
// @require      https://cdn.jsdelivr.net/npm/dompurify@3.0.5/dist/purify.min.js
// @downloadURL https://update.greasyfork.org/scripts/560583/Bitcointalk%20All-in-One%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/560583/Bitcointalk%20All-in-One%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Funzioni per GM storage
    const getValue = typeof GM_getValue === 'undefined' ? GM.getValue : GM.getValue;
    const setValue = typeof GM_setValue === 'undefined' ? GM.setValue : GM_setValue;

    // Funzioni per le note utente
    const getNotes = async () => {
        try {
            const notes = await getValue('notes');
            return notes ? JSON.parse(notes) : {};
        } catch (error) {
            return {};
        }
    };

    const setNotes = async (notes) => {
        await setValue('notes', JSON.stringify(notes));
    };

    const getUserNote = async (userId) => {
        const notes = await getNotes();
        return notes[userId];
    };

    const setUserNote = async (userId, note, tags = []) => {
        const notes = await getNotes();
        notes[userId] = { text: note, tags };
        await setNotes(notes);
    };

    const deleteUserNote = async (userId) => {
        const notes = await getNotes();
        delete notes[userId];
        await setNotes(notes);
    };

    const getSavedTags = async () => {
        try {
            const savedTags = await getValue('savedTags');
            return savedTags ? JSON.parse(savedTags) : {};
        } catch (error) {
            return {};
        }
    };

    const setSavedTags = async (tags) => {
        await setValue('savedTags', JSON.stringify(tags));
    };

    const findUserContainer = (link) => {
        let container = link.closest('.poster_info');
        if (container) return container;

        if (window.location.href.includes('action=profile')) {
            const profileContainer = document.querySelector('.profile_info');
            if (profileContainer) return profileContainer;
        }

        return null;
    };

    const openNoteModal = async (userId, existingNote = '', existingTags = []) => {
        const savedTags = await getSavedTags();

        const modal = document.createElement('div');
        modal.id = 'note-modal';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        modal.style.display = 'flex';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
        modal.style.zIndex = '1000';

        const modalContent = document.createElement('div');
        modalContent.style.backgroundColor = 'white';
        modalContent.style.padding = '20px';
        modalContent.style.borderRadius = '10px';
        modalContent.style.width = '500px';
        modalContent.style.maxHeight = '80vh';
        modalContent.style.overflowY = 'auto';

        const tagsHTML = Object.entries(savedTags).map(([tag, style]) => {
            return `<span class="saved-tag" style="background-color: ${style.backgroundColor}; color: ${style.color}; padding: 2px 6px; border-radius: 10px; margin: 2px; display: inline-block; cursor: pointer;">${tag}</span>`;
        }).join('');

        modalContent.innerHTML = `
            <h2 style="margin-top: 0;">Edit Note</h2>
            <textarea id="note-text" style="width: 100%; min-height: 100px; margin: 10px 0;">${existingNote}</textarea>
            <div style="margin: 10px 0;">
                <label for="note-tags">Tags:</label>
                <div id="tags-container" style="margin-top: 5px; border: 1px solid #ddd; padding: 10px; border-radius: 5px; min-height: 50px; display: flex; flex-wrap: wrap; gap: 3px;">
                    ${existingTags.map(tag => {
                        const style = savedTags[tag] || { backgroundColor: '#757575', color: 'white' };
                        return `<span class="tag-badge" style="background-color: ${style.backgroundColor}; color: ${style.color}; padding: 2px 6px; border-radius: 10px; margin: 2px; display: inline-block;">${tag}</span>`;
                    }).join('')}
                </div>
                <div style="margin-top: 10px;">
                    <label>Saved Tags:</label>
                    <div id="saved-tags-container" style="margin-top: 5px; display: flex; flex-wrap: wrap; gap: 3px;">
                        ${tagsHTML}
                    </div>
                    <div style="margin-top: 10px;">
                        <input type="text" id="new-tag-name" placeholder="New Tag Name" style="padding: 5px; margin-right: 5px;">
                        <button id="add-new-tag" style="padding: 5px 10px; background-color: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer;">Add New Tag</button>
                        <div id="color-picker-container" style="margin-top: 10px; display: none;">
                            <div style="margin-bottom: 10px;">
                                <label>Background Color:</label>
                                <input type="color" id="background-color-picker" value="#757575" style="margin-left: 10px;">
                            </div>
                            <div style="margin-bottom: 10px;">
                                <label>Text Color:</label>
                                <input type="color" id="text-color-picker" value="#ffffff" style="margin-left: 10px;">
                            </div>
                            <button id="save-new-tag" style="padding: 5px 10px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">Save Tag</button>
                        </div>
                    </div>
                </div>
            </div>
            <div style="display: flex; justify-content: space-between; margin-top: 10px;">
                <button id="delete-note" style="padding: 5px 10px; background-color: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">Delete Note</button>
                <div>
                    <button id="cancel-note" style="padding: 5px 10px; background-color: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 10px;">Cancel</button>
                    <button id="save-note" style="padding: 5px 10px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">Save</button>
                </div>
            </div>
        `;

        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        let newTagName = '';
        let backgroundColor = '#757575';
        let textColor = '#ffffff';

        document.getElementById('add-new-tag').addEventListener('click', () => {
            newTagName = document.getElementById('new-tag-name').value.trim();
            if (newTagName) {
                document.getElementById('color-picker-container').style.display = 'block';
            }
        });

        document.getElementById('background-color-picker').addEventListener('input', (e) => {
            backgroundColor = e.target.value;
        });

        document.getElementById('text-color-picker').addEventListener('input', (e) => {
            textColor = e.target.value;
        });

        document.getElementById('save-new-tag').addEventListener('click', async () => {
            if (newTagName) {
                const savedTags = await getSavedTags();
                savedTags[newTagName] = { backgroundColor, color: textColor };
                await setSavedTags(savedTags);
                document.getElementById('color-picker-container').style.display = 'none';
                document.getElementById('new-tag-name').value = '';
                const savedTagsContainer = document.getElementById('saved-tags-container');
                savedTagsContainer.innerHTML += `<span class="saved-tag" style="background-color: ${backgroundColor}; color: ${textColor}; padding: 2px 6px; border-radius: 10px; margin: 2px; display: inline-block; cursor: pointer;">${newTagName}</span>`;
                newTagName = '';
                backgroundColor = '#757575';
                textColor = '#ffffff';
            }
        });

        document.querySelectorAll('.saved-tag').forEach(tagElement => {
            tagElement.addEventListener('click', async () => {
                const tagName = tagElement.textContent;
                const tagsContainer = document.getElementById('tags-container');
                const existingTag = Array.from(tagsContainer.querySelectorAll('.tag-badge')).find(el => el.textContent === tagName);
                if (!existingTag) {
                    const savedTags = await getSavedTags();
                    const style = savedTags[tagName] || { backgroundColor: '#757575', color: 'white' };
                    tagsContainer.innerHTML += `<span class="tag-badge" style="background-color: ${style.backgroundColor}; color: ${style.color}; padding: 2px 6px; border-radius: 10px; margin: 2px; display: inline-block;">${tagName}</span>`;
                }
            });
        });

        document.getElementById('save-note').addEventListener('click', async () => {
            const noteText = document.getElementById('note-text').value;
            const tagBadges = document.querySelectorAll('#tags-container .tag-badge');
            const tags = Array.from(tagBadges).map(tag => tag.textContent);
            await setUserNote(userId, noteText, tags);
            document.body.removeChild(modal);
            updateAllNotes();
        });

        document.getElementById('delete-note').addEventListener('click', async () => {
            if (confirm('Are you sure you want to delete this note?')) {
                await deleteUserNote(userId);
                document.body.removeChild(modal);
                updateAllNotes();
            }
        });

        document.getElementById('cancel-note').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    };

    const updateNoteElement = async (link) => {
        const userIdMatch = link.href.match(/u=(\d+)/);
        if (!userIdMatch) return;
        const userId = userIdMatch[1];

        const noteContainer = findUserContainer(link);
        if (!noteContainer) return;

        const existingNoteDiv = noteContainer.querySelector('.user-note-div');
        if (existingNoteDiv) existingNoteDiv.remove();

        const noteData = await getUserNote(userId);
        const savedTags = await getSavedTags();

        const noteDiv = document.createElement('div');
        noteDiv.className = 'user-note-div';
        noteDiv.style.marginTop = '5px';
        noteDiv.style.fontSize = '0.9em';

        if (noteData) {
            const tagsHTML = noteData.tags.map(tag => {
                const style = savedTags[tag] || { backgroundColor: '#757575', color: 'white' };
                return `<span class="tag-badge" style="background-color: ${style.backgroundColor}; color: ${style.color}; padding: 2px 6px; border-radius: 10px; margin: 2px; display: inline-block;">${tag}</span>`;
            }).join('');

            noteDiv.innerHTML = `
                <div>📃 ${DOMPurify.sanitize(noteData.text)}</div>
                ${noteData.tags.length > 0 ? `<div style="margin-top: 3px; display: flex; flex-wrap: wrap; gap: 3px;">${tagsHTML}</div>` : ''}
                <span class="edit-note" style="cursor: pointer; color: #2e518b; margin-left: 5px; font-weight: bold;">✏️</span>
                <span class="delete-note" style="cursor: pointer; color: #f44336; margin-left: 5px; font-weight: bold;">🗑️</span>
            `;
        } else {
            noteDiv.innerHTML = '<span class="add-note" style="cursor: pointer; font-weight: bold; color: #2e518b;">➕ Add Note</span>';
        }

        noteContainer.appendChild(noteDiv);

        noteDiv.querySelector('.edit-note')?.addEventListener('click', async () => {
            const noteData = await getUserNote(userId);
            openNoteModal(userId, noteData?.text || '', noteData?.tags || []);
        });

        noteDiv.querySelector('.add-note')?.addEventListener('click', () => {
            openNoteModal(userId);
        });

        noteDiv.querySelector('.delete-note')?.addEventListener('click', async () => {
            if (confirm('Are you sure you want to delete this note?')) {
                await deleteUserNote(userId);
                updateAllNotes();
            }
        });
    };

    const updateAllNotes = async () => {
        const userLinks = document.querySelectorAll('a[href*="action=profile;u="]');
        for (const link of userLinks) {
            await updateNoteElement(link);
        }
    };

    const injectStyles = () => {
        const style = document.createElement('style');
        style.textContent = `
            .user-note-div {
                margin-top: 5px;
                font-size: 0.9em;
            }
            .edit-note, .add-note, .delete-note {
                cursor: pointer;
                font-weight: bold;
            }
            .edit-note {
                color: #2e518b;
            }
            .delete-note {
                color: #f44336;
            }
            .tag-badge {
                display: inline-block;
            }
        `;
        document.head.appendChild(style);
    };

    // Funzioni per Bitcointalk Mobile Enhancer
    let sMerit = null;

    const rankTable = [
        { name: "Brand New", merit: 0, activity: 0 },
        { name: "Newbie", merit: 0, activity: 1 },
        { name: "Jr. Member", merit: 1, activity: 30 },
        { name: "Member", merit: 10, activity: 60 },
        { name: "Full Member", merit: 100, activity: 120 },
        { name: "Sr. Member", merit: 250, activity: 240 },
        { name: "Hero Member", merit: 500, activity: 480 },
        { name: "Legendary", merit: 1000, activity: 775 },
        { name: "🌀 Mythical", merit: 1500, activity: 1200 },
        { name: "🔺 Ascendant", merit: 2500, activity: 2000 },
        { name: "🌌 Celestial", merit: 5000, activity: 3000 },
        { name: "♾️ Immortal", merit: 10000, activity: 4000 }
    ];

    function getCsrfToken() {
        const logoutLink = document.querySelector('td.maintab_back a[href*="index.php?action=logout;sesc="]');
        if (!logoutLink) return null;
        const match = /;sesc=(.*)/.exec(logoutLink.href);
        return match ? match[1] : null;
    }

    function sendMerit(msgId, merits, sc, popup) {
        const formData = new FormData();
        formData.append('merits', merits);
        formData.append('msgID', msgId);
        formData.append('sc', sc);

        fetch('https://bitcointalk.org/index.php?action=merit', {
            method: 'POST',
            credentials: 'include',
            body: formData,
        })
        .then(response => response.text())
        .then(data => {
            if (data.includes('<title>An Error Has Occurred!</title>')) {
                alert('Errore nell\'invio del merit.');
            } else if (data.includes(`#msg${msgId}`)) {
                alert('Merit inviato con successo!');
                fetchSmerit();
                popup.style.display = 'none';
            } else {
                alert('Risposta del server indeterminata.');
            }
        })
        .catch(() => alert('Errore di rete.'))
        .finally(() => {
            const submitBtn = popup.querySelector('input[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.value = 'Invia';
            }
        });
    }

    function openMeritPopup(msgId, sc) {
        let popup = document.getElementById(`merit-popup-${msgId}`);
        if (popup) {
            popup.remove();
        }

        popup = document.createElement('div');
        popup.id = `merit-popup-${msgId}`;
        popup.className = 'merit-popup';
        popup.style.position = 'absolute';
        popup.style.right = '40px';
        popup.style.zIndex = '10000';
        popup.style.display = 'none';

        popup.innerHTML = `
            <form>
                <div style="margin-bottom: 8px;">
                    Merit points: <input size="4" name="merits" value="1" type="text" style="text-align: center;" />
                </div>
                <div style="text-align: right;">
                    <input value="Invia" type="submit" style="margin-left: 8px;" />
                </div>
            </form>
        `;

        popup.querySelector('form').onsubmit = (e) => {
            e.preventDefault();
            const merits = e.target.elements['merits'].value;
            const submitBtn = e.target.querySelector('input[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.value = 'Invio...';

            sendMerit(msgId, merits, sc, popup);
        };

        return popup;
    }

    function addMeritPopups() {
        const sc = getCsrfToken();
        if (!sc) return;

        document.querySelectorAll('a[href*="index.php?action=merit;msg="]').forEach(link => {
            const msgId = /msg=([0-9]+)/.exec(link.href)[1];
            const popup = openMeritPopup(msgId, sc);
            link.parentNode.insertBefore(popup, link.nextSibling);

            link.onclick = (e) => {
                e.preventDefault();
                popup.style.display = popup.style.display === 'none' ? 'block' : 'none';
            };
        });
    }

    function fetchSmerit() {
        const meritPage = 'https://bitcointalk.org/index.php?action=merit';
        fetch(meritPage, { credentials: 'include', redirect: 'manual' })
        .then(res => {
            if (res.type === 'opaqueredirect' || res.status === 0 || res.status === 302) {
                sMerit = '?';
                updateSmeritIndicator();
                return null;
            }
            return res.text();
        })
        .then(html => {
            if (!html) return;
            const match = html.match(/You\s+have\s+(?:<b>)?(\d+)(?:<\/b>)?\s+sendable/i);
            sMerit = match ? match[1] : '?';
            updateSmeritIndicator();
        })
        .catch(() => {
            sMerit = 'x';
            updateSmeritIndicator();
        });
    }

    function updateSmeritIndicator() {
        let indicator = document.getElementById('smerit-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'smerit-indicator';
            document.body.appendChild(indicator);
        }
        indicator.textContent = `🪙 ${sMerit ?? '...'}`;
    }

    function fixQuotes() {
        document.querySelectorAll('.quote').forEach(quote => {
            if (quote.classList.contains('enhanced')) return;
            quote.classList.add('enhanced');

            if (quote.scrollHeight > 140) {
                const button = document.createElement('div');
                button.className = 'show-more';
                button.textContent = 'Mostra tutto';
                button.onclick = () => {
                    quote.classList.add('expanded');
                    button.remove();
                };
                quote.appendChild(button);
            }
        });
    }

    function addButtons() {
        document.querySelectorAll('td[class^="windowbg"] > div:nth-child(2)').forEach(post => {
            if (post.closest('.windowbg:first-child')) return;
            if (post.querySelector('.mobile-buttons')) return;

            const links = post.querySelectorAll('a');
            let quote, report, merit;

            links.forEach(a => {
                const href = a.getAttribute('href') || '';
                if (href.includes('quote')) quote = a;
                if (href.includes('report')) report = a;
                if (href.includes('merit')) merit = a;
            });

            const box = document.createElement('div');
            box.className = 'mobile-buttons';

            if (quote) {
                const q = quote.cloneNode(true);
                q.textContent = 'Quote';
                box.appendChild(q);
            }
            if (report) {
                const r = report.cloneNode(true);
                r.textContent = 'Report';
                box.appendChild(r);
            }

            post.appendChild(box);
        });
    }

    function addRankBarsInThreads() {
        document.querySelectorAll('td.poster_info').forEach(avatarCell => {
            if (avatarCell.querySelector('.rank-container')) return;

            const text = avatarCell.textContent;
            const meritMatch = text.match(/Merit:\s*(\d+)/i);
            const activityMatch = text.match(/Activity:\s*(\d+)/i);
            if (!meritMatch || !activityMatch) return;

            const merit = parseInt(meritMatch[1], 10);
            const activity = parseInt(activityMatch[1], 10);

            let currentRankIndex = 0;
            for (let i = 0; i < rankTable.length; i++) {
                if (merit >= rankTable[i].merit && activity >= rankTable[i].activity) {
                    currentRankIndex = i;
                }
            }

            const currentRank = rankTable[currentRankIndex];
            const nextRank = rankTable[Math.min(currentRankIndex + 1, rankTable.length - 1)];

            let totalProgress;
            if (currentRankIndex === rankTable.length - 1) {
                totalProgress = 100;
            } else {
                const meritProgress = Math.min(
                    (merit - currentRank.merit) / (nextRank.merit - currentRank.merit || 1),
                    1
                );
                const activityProgress = Math.min(
                    (activity - currentRank.activity) / (nextRank.activity - currentRank.activity || 1),
                    1
                );
                totalProgress = Math.min(meritProgress, activityProgress) * 100;
            }

            const container = document.createElement('div');
            container.className = 'rank-container';

            const rankName = document.createElement('div');
            rankName.className = 'rank-name';
            rankName.textContent = currentRank.name;
            container.appendChild(rankName);

            const bar = document.createElement('div');
            bar.className = 'rank-progress-bar';
            const fill = document.createElement('div');
            fill.className = 'rank-progress-fill';
            fill.style.width = totalProgress + '%';
            bar.appendChild(fill);
            container.appendChild(bar);

            avatarCell.appendChild(container);
        });
    }

    function removeOfficialRank() {
        document.querySelectorAll('td.poster_info div.smalltext').forEach(div => {
            const rankTexts = [
                "Brand New", "Newbie", "Jr. Member", "Member",
                "Full Member", "Sr. Member", "Hero Member", "Legendary"
            ];
            let lines = div.innerHTML.split('<br>');
            lines = lines.filter(line => {
                return !rankTexts.some(rank => line.includes(rank));
            });
            div.innerHTML = lines.join('<br>');
        });
    }

    function getLoggedInUsername() {
        const helloElement = document.querySelector('#hellomember b');
        if (!helloElement) {
            console.error("Utente loggato non trovato.");
            return null;
        }
        const userName = helloElement.textContent.replace(/\*/g, '').trim();
        console.log("Utente loggato trovato:", userName);
        return userName;
    }

    function highlightUserMerits() {
        const loggedInUser = getLoggedInUsername();
        if (!loggedInUser) {
            console.error("Utente loggato non trovato.");
            return;
        }

        console.log("Evidenzio i merit per l'utente:", loggedInUser);

        const meritElements = document.querySelectorAll('div.smalltext i');
        meritElements.forEach(el => {
            if (el.textContent.includes('Merited by')) {
                const meritLinks = el.querySelectorAll('a');
                let totalMerits = 0;

                meritLinks.forEach(link => {
                    const meritText = link.nextSibling?.textContent.trim();
                    if (!meritText) return;

                    const meritCountMatch = meritText.match(/\((\d+)\)/);
                    const meritCount = meritCountMatch ? parseInt(meritCountMatch[1], 10) : 0;
                    totalMerits += meritCount;

                    const linkUserName = link.textContent.replace(/\*/g, '').trim();
                    if (linkUserName === loggedInUser) {
                        link.style.fontWeight = 'bold';
                        link.style.color = '#3b82f6';
                        console.log(`Merit di ${loggedInUser} evidenziato:`, link);
                    }
                });

                if (!el.querySelector('.total-merit')) {
                    const totalElement = document.createElement('span');
                    totalElement.className = 'total-merit';
                    totalElement.style.fontWeight = 'bold';
                    totalElement.style.color = 'black';
                    totalElement.textContent = `Total Merit: ${totalMerits} `;

                    el.innerHTML = totalElement.outerHTML + el.innerHTML;
                }
            }
        });
    }

    const lightTheme = `
        body {
            font-family: "Segoe UI", sans-serif !important;
            font-size: 16px;
            background: #f9fafb !important;
            color: #222;
        }
        table, .windowbg, .windowbg2 {
            background: #fff !important;
            border-radius: 10px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            border: 1px solid #e5e7eb !important;
        }
        td.poster_info {
            width: 70px !important;
            max-width: 70px !important;
            background: #fff !important;
            text-align: center;
            padding: 4px !important;
        }
        td.poster_info img {
            max-width: 48px !important;
            height: auto;
            border-radius: 6px;
        }
        .quote {
            background: #e0f2fe;
            border-left: 4px solid #3b82f6;
        }
        .mobile-buttons a {
            background: #3b82f6;
            color: white !important;
        }
        .mobile-buttons a:hover {
            background: #1d4ed8;
        }
        #smerit-indicator {
            background: #10b981;
            color: white;
        }
        .rank-progress-bar {
            background: #ddd;
        }
        .rank-progress-fill {
            background: #3b82f6;
            height: 6px;
            border-radius: 3px;
        }
        .merit-popup {
            background: #f0f0f0 !important;
            color: #333 !important;
            border: 1px solid #ccc !important;
            border-radius: 6px !important;
            padding: 10px !important;
            font-size: 14px !important;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1) !important;
        }
        .merit-popup input[type="text"] {
            background: #fff !important;
            color: #333 !important;
            border: 1px solid #ccc !important;
            padding: 4px 8px !important;
            border-radius: 4px !important;
        }
        .merit-popup input[type="submit"] {
            background: #3b82f6 !important;
            color: white !important;
            border: none !important;
            padding: 6px 12px !important;
            border-radius: 4px !important;
            cursor: pointer !important;
        }
        .merit-popup input[type="submit"]:hover {
            background: #1d4ed8 !important;
        }
    `;

    const darkTheme = `
        body, td, tr, th {
            font-family: "Segoe UI", sans-serif !important;
            font-size: 16px;
            background: #000000 !important;
            color: #e5e7eb !important;
        }
        table, .windowbg, .windowbg2, td.td_headerandpost, table.bordercolor {
            background: #0a0a0a !important;
            color: #f1f1f1 !important;
            border-radius: 10px;
            box-shadow: 0 0 8px rgba(0,0,0,0.8);
            border: 1px solid #222 !important;
        }
        td.titlebg, td.catbg {
            background: #111 !important;
            color: #00d4ff !important;
            font-weight: bold;
        }
        td.titlebg a, td.catbg a {
            color: #00d4ff !important;
            font-weight: bold;
            text-decoration: none !important;
        }
        td.poster_info {
            width: 70px !important;
            max-width: 70px !important;
            background: #0a0a0a !important;
            text-align: center;
            padding: 4px !important;
            color: #f1f1f1 !important;
        }
        td.poster_info small {
            color: #a0a0a0 !important;
            font-size: 11px;
        }
        td.poster_info img {
            max-width: 48px !important;
            border-radius: 6px;
            box-shadow: 0 0 6px rgba(0,0,0,0.8);
        }
        .quote {
            background: #111111 !important;
            border-left: 4px solid #00d4ff !important;
            color: #f8f8f8 !important;
        }
        .quote cite, .quote .quoteheader {
            color: #00d4ff !important;
            font-weight: bold;
        }
        .quote .quote {
            background: #1a1a1a !important;
            border-left: 3px solid #0077ff !important;
        }
        .mobile-buttons a {
            background: linear-gradient(135deg, #00d4ff, #0077ff);
            color: white !important;
            box-shadow: 0 0 6px rgba(0, 122, 255, 0.6);
        }
        .mobile-buttons a:hover {
            background: linear-gradient(135deg, #00aaff, #0055cc);
        }
        #smerit-indicator {
            background: linear-gradient(135deg, #10b981, #065f46);
            color: white !important;
            box-shadow: 0 0 6px rgba(16, 185, 129, 0.6);
        }
        .rank-progress-bar {
            background: #1f1f1f;
        }
        .rank-progress-fill {
            background: linear-gradient(90deg, #00d4ff, #0077ff);
            height: 6px;
            border-radius: 3px;
        }
        a.board, a:link, a:visited {
            color: #00d4ff !important;
            font-weight: bold;
            text-decoration: none !important;
        }
        a:hover {
            color: #ffffff !important;
            text-decoration: underline !important;
        }
        .smerit_received, .smerit_given, .activity {
            color: #00d4ff !important;
            font-weight: bold;
            background: #111111 !important;
            padding: 2px 4px;
            border-radius: 4px;
            display: inline-block;
        }
        .smerit_received a, .smerit_given a, .activity a {
            color: #00d4ff !important;
            text-decoration: none !important;
        }
        .smerit_received:hover, .smerit_given:hover, .activity:hover {
            color: #ffffff !important;
            background: #0077ff !important;
        }
        .smalltext, .smalltext a {
            color: #c0c0c0 !important;
        }
        .smalltext a:hover {
            color: #00d4ff !important;
        }
        input, select, textarea {
            background: #111 !important;
            color: #f1f1f1 !important;
            border: 1px solid #333 !important;
            border-radius: 6px !important;
            padding: 4px 6px !important;
        }
        input[type="submit"], input[type="button"], button {
            background: linear-gradient(135deg, #00d4ff, #0077ff) !important;
            color: #fff !important;
            border: none !important;
            padding: 6px 12px !important;
            border-radius: 6px !important;
            cursor: pointer !important;
        }
        input[type="submit"]:hover, input[type="button"]:hover, button:hover {
            background: linear-gradient(135deg, #00aaff, #0055cc) !important;
        }
        tr td:nth-child(1) .trust img {
            filter: brightness(2) contrast(2) !important;
        }
        .merit-popup {
            background: #1e1e1e !important;
            color: #e0e0e0 !important;
            border: 1px solid #444 !important;
            border-radius: 6px !important;
            padding: 10px !important;
            font-size: 14px !important;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3) !important;
        }
        .merit-popup input[type="text"] {
            background: #2d2d2d !important;
            color: #e0e0e0 !important;
            border: 1px solid #444 !important;
            padding: 4px 8px !important;
            border-radius: 4px !important;
        }
        .merit-popup input[type="submit"] {
            background: linear-gradient(135deg, #00d4ff, #0077ff) !important;
            color: white !important;
            border: none !important;
            padding: 6px 12px !important;
            border-radius: 4px !important;
            cursor: pointer !important;
        }
        .merit-popup input[type="submit"]:hover {
            background: linear-gradient(135deg, #00aaff, #0055cc) !important;
        }
    `;

    const commonStyles = `
        .quote { max-height: 120px; overflow: hidden; padding: 8px; border-radius: 6px; position: relative; margin: 6px 0; }
        .quote.expanded { max-height: none !important; }
        .quote .show-more { position: absolute; bottom: 4px; right: 6px; font-size: 12px; background: rgba(0,0,0,0.3); color: #fff; padding: 2px 6px; border-radius: 4px; cursor: pointer; }
        .mobile-buttons { display: flex; gap: 6px; margin-top: 8px; flex-wrap: wrap; font-size: 14px; }
        .mobile-buttons a { padding: 6px 10px; border-radius: 20px; text-decoration: none; transition: background 0.2s; }
        #smerit-indicator { position: fixed; top: 14px; left: 14px; background: #6b7280; color: white; padding: 6px 10px; font-size: 13px; border-radius: 10px; z-index: 9999; font-weight: bold; }
        #theme-toggle { position: fixed; top: 14px; right: 14px; background: #6b7280; color: white; padding: 6px 10px; font-size: 13px; border-radius: 10px; z-index: 9999; cursor: pointer; }
        .rank-container { margin-top: 6px; text-align: center; font-size: 12px; font-weight: bold; }
        .rank-name { margin-bottom: 2px; }
        .rank-progress-bar { width: 100%; margin: 0 auto; height: 6px; border-radius: 3px; }
        .rank-progress-fill { height: 6px; border-radius: 3px; }
    `;

    const style = document.createElement("style");
    document.head.appendChild(style);

    function applyTheme(theme) {
        const css = (theme === 'dark' ? darkTheme : lightTheme) + commonStyles;
        style.textContent = css;
        localStorage.setItem('bitcointalk-theme', theme);
    }

    const toggle = document.createElement("div");
    toggle.id = "theme-toggle";
    toggle.textContent = "🔆🌘";
    toggle.onclick = () => {
        const current = localStorage.getItem('bitcointalk-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(current);
    };
    document.body.appendChild(toggle);

    // Funzioni per BitcoinTalk Pinned Threads
    function savePinnedThreads(pinnedThreads) {
        localStorage.setItem('pinnedThreads', JSON.stringify(pinnedThreads));
    }

    function loadPinnedThreads() {
        const pinnedThreads = localStorage.getItem('pinnedThreads');
        return pinnedThreads ? JSON.parse(pinnedThreads) : [];
    }

    function createPinnedTable() {
        const pinnedThreads = loadPinnedThreads();
        if (pinnedThreads.length === 0) return;

        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.marginBottom = '10px';
        table.style.borderCollapse = 'collapse';
        table.style.backgroundColor = '#f5f5f5';
        table.style.border = '1px solid #ddd';

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const headers = ['', 'Thread', 'Autore'];

        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.style.padding = '8px';
            th.style.textAlign = 'left';
            th.style.borderBottom = '1px solid #ddd';
            th.textContent = headerText;
            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');

        pinnedThreads.forEach(thread => {
            const row = document.createElement('tr');
            row.style.borderBottom = '1px solid #ddd';

            const removeCell = document.createElement('td');
            removeCell.style.padding = '8px';
            removeCell.style.textAlign = 'center';
            const removeButton = document.createElement('button');
            removeButton.textContent = '❌';
            removeButton.style.cursor = 'pointer';
            removeButton.style.background = 'none';
            removeButton.style.border = 'none';
            removeButton.onclick = () => removePinnedThread(thread.id);
            removeCell.appendChild(removeButton);
            row.appendChild(removeCell);

            const titleCell = document.createElement('td');
            titleCell.style.padding = '8px';
            const titleLink = document.createElement('a');
            titleLink.href = thread.url;
            titleLink.textContent = thread.title;
            titleLink.style.fontWeight = 'bold';
            titleCell.appendChild(titleLink);
            row.appendChild(titleCell);

            const authorCell = document.createElement('td');
            authorCell.style.padding = '8px';
            const authorLink = document.createElement('a');
            authorLink.href = thread.authorUrl;
            authorLink.textContent = thread.author;
            authorCell.appendChild(authorLink);
            row.appendChild(authorCell);

            tbody.appendChild(row);
        });

        table.appendChild(tbody);

        const navBar = document.querySelector('table[style="margin-left: 10px;"]');
        const bodyArea = document.querySelector('div#bodyarea');

        if (navBar) {
            navBar.after(table);
        } else if (bodyArea) {
            const firstChild = bodyArea.firstChild;
            if (firstChild) {
                bodyArea.insertBefore(table, firstChild);
            } else {
                bodyArea.appendChild(table);
            }
        }
    }

    function addPinnedThread(threadId, title, url, author, authorUrl) {
        const pinnedThreads = loadPinnedThreads();
        const threadExists = pinnedThreads.some(thread => thread.id === threadId);

        if (!threadExists) {
            pinnedThreads.push({ id: threadId, title, url, author, authorUrl });
            savePinnedThreads(pinnedThreads);
            alert('Thread aggiunto ai pinnati!');
            location.reload();
        } else {
            alert('Thread già presente nei pinnati!');
        }
    }

    function removePinnedThread(threadId) {
        let pinnedThreads = loadPinnedThreads();
        pinnedThreads = pinnedThreads.filter(thread => thread.id !== threadId);
        savePinnedThreads(pinnedThreads);
        alert('Thread rimosso dai pinnati!');
        location.reload();
    }

    function addPinButtons() {
        const threadRows = document.querySelectorAll('table.bordercolor tbody tr:not(:first-child)');

        threadRows.forEach(row => {
            const titleLink = row.querySelector('td:nth-child(3) a[href*="topic="], td:nth-child(4) a[href*="topic="]');
            if (!titleLink) return;

            const firstCell = row.querySelector('td:first-child');
            if (!firstCell || firstCell.querySelector('.pin-button')) return;

            const pinButton = document.createElement('button');
            pinButton.textContent = '📌';
            pinButton.style.cursor = 'pointer';
            pinButton.style.marginLeft = '5px';
            pinButton.style.background = 'none';
            pinButton.style.border = 'none';
            pinButton.className = 'pin-button';

            const threadId = titleLink.href.match(/topic=(\d+)/)[1];
            const title = titleLink.textContent.trim();
            const url = titleLink.href;
            const authorCell = row.querySelector('td:nth-child(4) a, td:nth-child(5) a');
            const author = authorCell ? authorCell.textContent.trim() : 'N/A';
            const authorUrl = authorCell ? authorCell.href : '#';

            pinButton.onclick = () => addPinnedThread(threadId, title, url, author, authorUrl);

            firstCell.appendChild(pinButton);
        });
    }

    // Avvio
    applyTheme(localStorage.getItem('bitcointalk-theme') || 'light');
    updateSmeritIndicator();
    addMeritPopups();
    addButtons();
    fixQuotes();
    addRankBarsInThreads();
    removeOfficialRank();
    injectStyles();

    if (document.querySelector('a[href*="action=profile"]')) {
        fetchSmerit();
    }

    setTimeout(highlightUserMerits, 2000);

    window.addEventListener('load', () => {
        updateAllNotes();

        const observer = new MutationObserver(async (mutations) => {
            let needsUpdate = false;
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.querySelectorAll('a[href*="action=profile;u="]').length > 0 || node.matches('a[href*="action=profile;u="]')) {
                            needsUpdate = true;
                            break;
                        }
                    }
                }
                if (needsUpdate) break;
            }
            if (needsUpdate) {
                await updateAllNotes();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        console.log('Bitcointalk All-in-One Enhancer is running!');

        // Esegui le funzioni per i thread pinnati
        if (window.location.href.includes('index.php?board=')) {
            createPinnedTable();
            addPinButtons();
        }
    });
})();