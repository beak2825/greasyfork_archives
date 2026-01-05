// ==UserScript==
// @name        BTN - collapse show info
// @description shrink/expand the show info box
// @namespace   diff
// @match       https://broadcasthe.net/torrents.php
// @grant	none
// @version     0.4.1
// @downloadURL https://update.greasyfork.org/scripts/728/BTN%20-%20collapse%20show%20info.user.js
// @updateURL https://update.greasyfork.org/scripts/728/BTN%20-%20collapse%20show%20info.meta.js
// ==/UserScript==

(function() {
  document.head.insertAdjacentHTML('beforeEnd',
                                   `<style type='text/css'>
                                    .diffshrink{ overflow:auto; height:10em; cursor: pointer;}
                                    .diffpointer { cursor: pointer; }
                                    </style>`);

  const target = document.querySelector('.main_column .head');
  if (!target) return;

  target.innerHTML += ' [shrink/expand]';
  target.classList.add('diffpointer');
  target.parentNode.classList.add('diffshrink');
  target.addEventListener('click', function() {
        this.parentNode.classList.toggle('diffshrink');
    });
  target.parentNode.querySelector('div.body').addEventListener('click', function() {
        this.parentNode.classList.remove('diffshrink');
    });

})();