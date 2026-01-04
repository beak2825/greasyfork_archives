// ==UserScript==
// @name         Bitcointalk User Notes Pro
// @version      1.0.28
// @description  Visualizza e gestisci le note utente con tag personalizzati solo nei thread e nei profili di Bitcointalk.
// @author       Ace
// @match        https://bitcointalk.org/*
// @grant        GM.setValue
// @grant        GM.getValue
// @namespace    https://github.com/ace-d-portugal
// @require      https://cdn.jsdelivr.net/npm/dompurify@3.0.5/dist/purify.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549016/Bitcointalk%20User%20Notes%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/549016/Bitcointalk%20User%20Notes%20Pro.meta.js
// ==/UserScript==

(function() {
'use strict';

const getValue = typeof GM_getValue === 'undefined' ? GM.getValue : GM.getValue;
const setValue = typeof GM_setValue === 'undefined' ? GM.setValue : GM.setValue;

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
    // Controlla se il link è all'interno di un post (thread)
    let container = link.closest('.poster_info');
    if (container) return container;

    // Controlla se il link è nella pagina del profilo utente
    if (window.location.href.includes('action=profile')) {
        const profileContainer = document.querySelector('.profile_info');
        if (profileContainer) return profileContainer;
    }

    // Se non è in un post o in un profilo, ignora
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
    if (!noteContainer) return; // Ignora se non è in un contesto valido

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

window.addEventListener('load', () => {
    injectStyles();
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

    console.log('Bitcointalk User Notes Pro is running!');
});

})();

