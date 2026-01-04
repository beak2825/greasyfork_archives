// ==UserScript==
// @name         Lake Land Regional
// @namespace    http://tampermonkey.net/
// @version      2025-10-20
// @description  injecting a text box
// @author       You
// @match        https://doctors.mylrh.org/lrhphysiciangroup
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mylrh.org
// @grant        unsafeWindow
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/553228/Lake%20Land%20Regional.user.js
// @updateURL https://update.greasyfork.org/scripts/553228/Lake%20Land%20Regional.meta.js
// ==/UserScript==



function addStyledSearchBox() {
    const existingSearchArea = document.querySelector('.spec-holder.topgun .searchArea');
    const newSearchWidget = document.createElement('div');
    newSearchWidget.className = 'searchWidget searchWidgetVisible';

    const newSearchboxSpan = document.createElement('span');
    newSearchboxSpan.className = 'searchbox';
    newSearchboxSpan.style.display = 'flex';
    newSearchboxSpan.style.alignItems = 'flex-start';
    newSearchboxSpan.style.gap = '4px';


    const textBox = document.createElement('textarea');
    textBox.style.flexGrow = '1';
    textBox.style.minHeight = '100px';
    textBox.style.resize = 'none';
    textBox.style.fieldSizing = 'content';
    textBox.style.overflow = 'hidden';
    textBox.style.lineHeight = '1.4';
    textBox.style.boxSizing = 'border-box';

    textBox.setAttribute('id', 'myCustomSearchBox');
    textBox.setAttribute('class', 'form-control ui-autocomplete-input');
    textBox.setAttribute('placeholder', 'AI search...');
    textBox.setAttribute('title', 'AI search');
    textBox.setAttribute('autocomplete', 'off');
    textBox.setAttribute('rows', '1');

    const button = document.createElement('a');
    button.setAttribute('class', 'searchlink searchboxgo');
    button.setAttribute('href', '#');
    button.setAttribute('onclick', 'return false;');
    button.setAttribute('rel', 'nofollow');
    button.textContent = 'GO';
    button.style.alignSelf = 'flex-start'; // Keep button at top
    button.style.alignItems = 'flex-start';

    newSearchboxSpan.appendChild(textBox);
    newSearchboxSpan.appendChild(button);
    newSearchWidget.appendChild(newSearchboxSpan);

    const existingDiv = document.getElementsByClassName("top-search")[0];
    existingDiv.appendChild(newSearchWidget);

    // Parent container styles
    newSearchWidget.style.width = '100%';
    newSearchWidget.style.maxWidth = '65%';
    newSearchWidget.style.margin = 'auto';
    newSearchWidget.style.paddingTop = '10px';

    // Initial height calculation
    textBox.style.height = `${textBox.scrollHeight}px`;
    button.style.height = `${textBox.scrollHeight}px`;

    button.addEventListener('click', function() {
        const searchText = textBox.value;
        alert('Custom Search initiated for: ' + searchText);
    });
}


addStyledSearchBox();