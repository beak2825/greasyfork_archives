// ==UserScript==
// @name         Hide Kanji
// @version      1.2
// @grant        none
// @match        https://www.renshuu.org/*
// @description  Pretty basic Renshuu.org script to hide the kanji from the terms view page until the "Show" button is pressed, so you can read the definition without being spoiled on how the kanji looks. Only works in "basic" terms view, since the others show the kanji in the mnemonic and radical sections and I'm too lazy to hide those.
// @namespace    ch4xm.github.io
// @downloadURL https://update.greasyfork.org/scripts/555242/Hide%20Kanji.user.js
// @updateURL https://update.greasyfork.org/scripts/555242/Hide%20Kanji.meta.js
// ==/UserScript==

let currentPageText = '';
let pageObserver = null;

const startObserver = new MutationObserver((_, observer) => {
    if (document.getElementById('thelist')) {
        observer.disconnect();
        observeKanjiList();
    }
});
startObserver.observe(document.body, { childList: true, subtree: true });

function observeKanjiList() {
    const kanjiList = document.getElementById('thelist');
    if (kanjiList) hideKanjiList();

    // Find the element with "Page: x of y"
    const pageLabel = Array.from(document.querySelectorAll('*')).find((el) => el.textContent.trim().startsWith('Page:'));

    if (pageLabel && !pageObserver) {
        currentPageText = pageLabel.textContent;

        pageObserver = new MutationObserver(() => {
            if (pageLabel.textContent !== currentPageText) {
                currentPageText = pageLabel.textContent;
                hideKanjiList();
            }
        });

        pageObserver.observe(pageLabel, {
            childList: true,
            characterData: true,
            subtree: true,
        });
    }
}

observeKanjiList();

function createShowKanjiButton(kanjiLabel) {
    const showKanjiButton = document.createElement('button');
    showKanjiButton.textContent = 'Show';
    showKanjiButton.style.fontSize = '16px';
    showKanjiButton.style.display = 'flex';
    showKanjiButton.style.backgroundColor = '#2f3030';
    showKanjiButton.style.color = '#ffffff';
    showKanjiButton.style.border = 'none';
    showKanjiButton.style.margin = 0;
    showKanjiButton.style.height = '100%';
    showKanjiButton.style.width = '100%';
    showKanjiButton.style.padding = '0px 35px';
    showKanjiButton.style.justifyContent = 'center';
    showKanjiButton.style.alignItems = 'center';
    showKanjiButton.style.transition = 'background-color 0.15s';

    showKanjiButton.onclick = () => {
        kanjiLabel.style.display = '';
        showKanjiButton.remove();
    };

    showKanjiButton.onmouseover = () => {
        showKanjiButton.style.cursor = 'pointer';
        showKanjiButton.style.backgroundColor = '#1f1f1f';
    };

    showKanjiButton.onmouseout = () => {
        showKanjiButton.style.backgroundColor = '#2f3030';
    };

    return showKanjiButton;
}

function hideKanjiList() {
    const kanjiList = document.getElementById('thelist');
    if (!kanjiList) return;

    const kanjiCards = kanjiList.getElementsByClassName('flexterm');
    if (!kanjiCards?.length) return;

    for (const card of kanjiCards) {
        const kanjiLabel = card.querySelector('.print_term > div > span');
        if (!kanjiLabel) continue;

        const parent = kanjiLabel.parentNode;

        // Skip if this card already has a Show button
        if (parent.querySelector('button')) continue;

        kanjiLabel.style.display = 'none';
        kanjiLabel.style.padding = '0px 25px';

        parent.style.display = 'flex';
        parent.style.justifyContent = 'center';
        parent.style.alignItems = 'center';
        parent.style.width = '100px';
        parent.style.height = '85px';
        parent.style.textAlign = 'center';

        parent.appendChild(createShowKanjiButton(kanjiLabel));
    }
}
