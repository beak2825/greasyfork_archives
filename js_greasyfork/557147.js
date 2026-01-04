// ==UserScript==
// @name         17lands Draft Log Comments
// @namespace    http://tampermonkey.net/
// @version      2025-12-02
// @description  Tool for making comments to a 17lands draft log.
// @author       matt.giesmann@gmail.com (@iluvatar777)
// @match        https://www.17lands.com/draft/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=17lands.com
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557147/17lands%20Draft%20Log%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/557147/17lands%20Draft%20Log%20Comments.meta.js
// ==/UserScript==

function init() {
    const userid = localStorage.getItem(getStorageKey('userid', true));

    // add html to dom
    const el=document.getElementById('app')?.children[1]?.children[0];
    const mainDiv = document.createElement('div');
    mainDiv.id = 'comment-main';
    mainDiv.innerHTML = `
     <div id='comment-text-area' style='position: absolute; bottom: 5px; left: 5px; z-index: 100; width: calc(100% - 23px); padding: 10px; margin-left: 5px; background: rgba(0, 0, 0, .75); border: 1px solid #CCCCCC; border-radius:5px;'>
           <div id='comment-controls' style='margin: 3px 0 7px 0; min-width: 600px; background: rgba(0, 0, 0, .5)'>
               <span>Add comments to draft log</span>
               <button id='comment-button-export' title='export comments of current user'>export</button>
               <button id='comment-button-import' title='import other user comments from clipboard'>import</button>
               <span id='comment-id-span' style='display: inline-block;' title='changing will clear existing comments'>
                   user id: <span id='comment-user-id' style='color:#CCCCFF; text-decoration: underline; cursor: pointer'>${userid}</span>
                   <input id='comment-user-id-input' style='display:none'></input>
               </span>
               <button id='comment-button-clear' style='margin-left: 20px;'>clear comment</button>
           </div>
           <div id='comment-other-comments' style='width: auto; margin-right: 20px'></div>
           <textarea id='comment-textarea' style='width: stretch; margin-right: 20px'></textarea>
       </div>
    `;
    el.appendChild(mainDiv);

    if (userid === null) {
        toggleLogin();
    }

    //add listenrs
    window.navigation.addEventListener('navigate', handleNav);
    window.addEventListener("beforeunload", function(e){
        localStorage.removeItem(getStorageKey('pick'))
    });
    window.addEventListener('load', () => {
        // initial load of comments
        const intv = setInterval(() => {
            const url = window.location.href.split('/');
            if (url.length === 7) {
                handleNav({'destination':{'url': url.join('/')}});
                clearInterval(intv);
            }
        }, 50);
    });

    const clearButton = document.getElementById('comment-button-clear')
    clearButton.addEventListener("click", clearCurrentComment, false);
    const exportButton = document.getElementById('comment-button-export')
    exportButton.addEventListener("click", exportComments, false);
    const importButton = document.getElementById('comment-button-import')
    importButton.addEventListener("click", importCommentsFromClipboard, false);
    const userIdDisplay = document.getElementById('comment-user-id')
    userIdDisplay.addEventListener("click", toggleLogin, false);
    const userIdInput = document.getElementById('comment-user-id-input')
    userIdInput.addEventListener("blur", userIdUpdate, false);
    const testArea = document.getElementById('comment-textarea')
    testArea.addEventListener("focus", highlightLogin, false);
}

function handleNav(event) {
    const url = event.destination.url.split('/');
    if (url.length !== 7) {
        //pick not in URL, ignore
        return;
    }
    const userid = localStorage.getItem(getStorageKey('userid', true));
    const oldPick = localStorage.getItem(getStorageKey('pick'));
    const newPick = 'p' + url[5] + 'p' + url[6];
    const draftid = url[4];
    localStorage.setItem(getStorageKey('pick'), newPick);

    if ((oldPick === newPick)) return;

    const allComments = loadCommentsFromStorage(draftid) || {};
    const newPickComments = allComments[newPick] || {};
    const oldPickText = document.getElementById('comment-textarea').value;
    document.getElementById('comment-textarea').value = JSON.stringify((newPickComments[userid]) || '').slice(1, -1).replaceAll('\\\\','\\').replaceAll('\\n','\n');

    displayOtherComments(newPick);
    if (oldPick) {
        storeText(draftid, oldPick, userid, oldPickText);
    }
}

function displayOtherComments(pick = '') {
    const url = window.location.href.split('/');
    pick = pick || 'p' + url[5] + 'p' + url[6];
    const draftid = url[4];
    const allComments = loadCommentsFromStorage(draftid) || {};
    const pickComments = allComments[pick];
    const userid = localStorage.getItem(getStorageKey('userid', true));
    const colors = ['CCFFCC', 'CCCCFF', 'FFCCCC', 'FFFFCC', 'FFCCFF', 'CCFFFF'];
    let c = 0;

    const otherCommentDiv = document.getElementById('comment-other-comments');
    otherCommentDiv.innerHTML = '';
    if (pickComments) {
        for (const key of Object.keys(pickComments)) {
            if (key === userid) continue;
            otherCommentDiv.innerHTML = otherCommentDiv.innerHTML +
                `<div style='color:#${colors[c % colors.length]}'>
                    <div style='display: inline-block; vertical-align: top; margin-right: 5px;'>${key}:</div>
                    <div style='display: inline-block;'>${pickComments[key].replace('\n','<br/>')}</div>
                </div>`;
            c = c + 1;
        }
    }
}

function clearCurrentComment() {
    const url = window.location.href.split('/');
    const userid = localStorage.getItem(getStorageKey('userid', true));
    const pick = 'p' + url[5] + 'p' + url[6];
    const draftid = url[4];
    storeText(draftid, pick, userid, '');
    document.getElementById('comment-textarea').value = '';
}

function storeText(draftid, pick, userid, text) {
    const allComments = loadCommentsFromStorage(draftid) || {};
    const oldPickComments = allComments[pick] || {};
    if ((text === '') && (allComments[pick] !== undefined)) {
        delete allComments[pick][userid];
    } else {
        oldPickComments[userid] = text;
        allComments[pick] = oldPickComments;
    }
    setCommentsFromStorage(draftid, allComments);
}

function loadCommentsFromStorage(draftid) {
    return JSON.parse(localStorage.getItem(getStorageKey('comments')));
}

function setCommentsFromStorage(draftid, comments) {
    return localStorage.setItem(getStorageKey('comments'), JSON.stringify(comments));
}

function getCurrentPick(padded = false) {
    const url = window.location.href.split('/');
    if (url.length !== 7) { //pick not in URL, ignore
        return;
    }
    return 'p' + url[5] + 'p' + url[6] + (padded && url[6] < 10 ? ' ' : '');
}

function getStorageKey(item = '', global = false) {
    const url = window.location.href.split('/');
    if ((!global) && (url.length !== 7)) { //pick not in URL, ignore for draft specific
        return;
    }
    return '17lcomments' + (global ? '' : '|' + url[4]) + (item !== '' ? '|' + item : '');
}

function exportComments() {
    const userid = localStorage.getItem(getStorageKey('userid', true));
    const url = window.location.href.split('/');
    const draftid = url[4];
    const pick = 'p' + url[5] + 'p' + url[6];
    const pickText = document.getElementById('comment-textarea').value;

    storeText(draftid, pick, userid, pickText);

    const allComments = loadCommentsFromStorage(draftid);
    const allUsers = [userid];
    const out = [];
    out.push(userid + '|' + url.slice(0,-2).join('/') + ' ')
    for (const pack of [1,2,3]) {
        out.push('');
        for (const n of [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]) {
            const pick = 'p' + pack + 'p' + n;
            if (allComments[pick] && allComments[pick][userid]) {
                out.push(pick + ': ' + allComments[pick][userid]);
            }
        }
    }
    copyToClipboard(out.join('\n'));
}

function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text)
        .then(() => console.log('Comments copied to clipboard!'))
        .catch(err => console.error('Failed to copy text: ', err));
     } else {
         console.log('clipboard not supported')
     }
}

function importCommentsFromClipboard() {
    navigator.clipboard.readText()
    .then(text => {
        const headerRegex = /(\S+)\|https\:\/\/www\.17lands\.com\/draft\/([a-f0-9]+)/;
        const commentRegex = /(p\dp\d{1,2}) ?\: (.+)/;

        const lines = text.split('\n');
        let userid = '';
        let draft = '';
        let pick = '';
        let comment = '';
        for (const line of lines) {
            const headerMatch = line.match(headerRegex);
            if (headerMatch !== null) {
                userid = headerMatch[1];
                draft = headerMatch[2];
                continue;
            }
            const commentMatch = line.match(commentRegex);
            if ((commentMatch !== null) && (userid !== '')) {
                pick = commentMatch[1];
                comment = commentMatch[2];
                storeText(draft, pick, userid, comment);
            }
            if ((commentMatch === null) && (headerMatch === null) && (line.trim() !== '')) {
                console.log(line)
                comment = comment + '\n' + line.trim();
                storeText(draft, pick, userid, comment);
            }
        }
    })
    .catch(err => {
        console.error('Failed to read clipboard contents: ', err);
    });
}

function toggleLogin(forceDisplayMode = false) {
    const nameDisplay = document.getElementById('comment-user-id');
    const nameInput = document.getElementById('comment-user-id-input');
    const idSpan = document.getElementById('comment-id-span');
    const textArea = document.getElementById('comment-textarea');
    const userid = localStorage.getItem(getStorageKey('userid', true));

    const inputMode = nameDisplay.style && (nameDisplay.style.display === 'none');
    if (inputMode || (forceDisplayMode === true)) {
        nameDisplay.innerHTML = userid;
        nameDisplay.style.display = null;
        nameInput.style = 'display: none';
        idSpan.style.border = '';
        idSpan.style.margin = '';
        textArea.disabled = false;
    } else {
        nameDisplay.style.display = 'none';
        nameInput.style = null;
        nameInput.value = userid;
    }
}

function userIdUpdate() {
    const userId = document.getElementById('comment-user-id-input').value;
    if (userId !== '' ) {
        localStorage.setItem(getStorageKey('userid', true), userId);
        toggleLogin(true);
    }
}

function highlightLogin(){
    const userInput = document.getElementById('comment-user-id-input').value;
    if (userInput !== '') {
        userIdUpdate();
    }
    const userid = localStorage.getItem(getStorageKey('userid', true));
    const idSpan = document.getElementById('comment-id-span');
    const textArea = document.getElementById('comment-textarea');
    if (userid === null) {
        idSpan.style.border = '3px solid yellow';
        idSpan.style.margin = '-3px';
        textArea.disabled = true;
    } else {
        idSpan.style.border = '';
        idSpan.style.margin = '';
        textArea.disabled = false;
    }
}

(function() {
    'use strict';
    init();
})();