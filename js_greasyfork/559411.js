// ==UserScript==
// @name        Remove BetterRYM's Media Links
// @namespace   Violentmonkey Scripts
// @match       https://rateyourmusic.com/release/*/*
// @license     MIT
// @version     1.4
// @author      AnotherBubblebath
// @description Remove the current implementation of BetterRYM's media links since they're broken.
// @run-at      document-start
// @icon        https://www.google.com/s2/favicons?sz=64&domain=rateyourmusic.com
// @downloadURL https://update.greasyfork.org/scripts/559411/Remove%20BetterRYM%27s%20Media%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/559411/Remove%20BetterRYM%27s%20Media%20Links.meta.js
// ==/UserScript==

const savedContent = new Map();

const mediaLinksObserver = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (node.id === 'media_link_button_container_top' && node.children.length > 0) {
        savedContent.set(node.id, node.innerHTML);
      }

      let containers;
      try {
        if (node.querySelectorAll('#media_link_button_container_top') && node.querySelectorAll('#media_link_button_container_top').length > 0) {
          containers = node.querySelectorAll('#media_link_button_container_top');
        }
      }
      catch (e) {
        //Don't do anything and just shut up
      }

      if (containers && containers.length > 0) {
        containers.forEach(container => {
          savedContent.set(container.id, container.innerHTML);
        });
      }
    });

    if (mutation.type === 'childList' && mutation.target.id === 'media_link_button_container_top') {
      if (mutation.removedNodes.length > 0 && savedContent.has(mutation.target.id)) {
        mutation.target.innerHTML = savedContent.get(mutation.target.id);
      }
    }
  });

  document.querySelectorAll('#better-rym').forEach(element => element.remove());

  let media = document.querySelectorAll('#media_link_button_container_top')

  media.forEach(link => {
      link.style.display = 'block';
  });
});

if (document.body) {
  mediaLinksObserver.observe(document.body, { childList: true, subtree: true, attributes: true });
} else {
  const bodyObserver = new MutationObserver(() => {
    if (document.body) {
      bodyObserver.disconnect();
      mediaLinksObserver.observe(document.body, { childList: true, subtree: true, attributes: true });
    }
  });
  bodyObserver.observe(document.documentElement, { childList: true });
}