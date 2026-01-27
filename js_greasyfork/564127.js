// ==UserScript==
// @name         no-mouse-google
// @namespace    http://tampermonkey.net/
// @version      2026-01-26
// @description  hjkl google
// @author       yabeenico
// @include      https://www.google.com/search?*
// @include      https://www.google.co.*/search?*
// @icon         data:image/gif;base64,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
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/564127/no-mouse-google.user.js
// @updateURL https://update.greasyfork.org/scripts/564127/no-mouse-google.meta.js
// ==/UserScript==
/* eslint-disable no-multi-spaces */
/* eslint-disable no-return-assign */

let selectedIndex = -1;
let selectedColumn = 0;

const itemQuery = '' +
      '#search div[data-hveid][data-ved][lang][class],' +
      '#search div[data-hveid]:has(>div[data-cid]),' +
      '#search div[data-hveid]:has(>div > div[data-cid]),' +
      '#nevermatch';
const cards = Array.from(document.querySelectorAll(itemQuery));
const columns = Array.from(document.querySelectorAll('div[role=listitem]'));

function refresh(){
    console.log('selectedColumn:', selectedColumn);
    console.log('columns:', columns);
    console.log('selectedIndex:', selectedIndex);
    console.log('cards:', cards);
    columns.map(x=>x.style.backgroundColor = null);
    cards.map(x=>x.style.backgroundColor = null);
    if(selectedIndex == -1){
        columns[selectedColumn].style.backgroundColor = '#333';
        columns[selectedColumn].querySelector('a').focus();
    }else{
        cards[selectedIndex].style.backgroundColor = '#333';
        cards[selectedIndex ].querySelector('a').focus();
        cards[selectedIndex].scrollIntoView({
            block: 'center'
        });
    }
}
refresh();

document.addEventListener('keydown', (e) => {
    switch(e.key){
        case 'j':
            if(selectedIndex == -1){
                selectedIndex = 0;
                refresh(-1);
            }else if(selectedIndex < cards.length - 1){
                selectedIndex++;
                refresh();
            }
            break;
        case 'k':
            if(selectedIndex <= -1){
            }else{
                selectedIndex--;
                refresh();
            }
            break;
        case 'h':
            if(selectedIndex == -1){
                if(0 < selectedColumn){
                    selectedColumn--;
                    refresh();
                }
            }
            break;
        case 'l':
            if(selectedIndex == -1){
                if(selectedColumn < columns.length - 2){
                    selectedColumn++;
                    refresh();
                }
            }else{
                window.open(cards[selectedIndex].querySelector('a').href);
            }
            break;
    }
});
