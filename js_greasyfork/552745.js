// ==UserScript==
// @name        Komica catbox player
// @description Make catbox URLs display as embedded videos and image
// @match       *://*.komica1.org/*/*
// @namespace   0.30000000000000004
// @version     4.0
// @downloadURL https://update.greasyfork.org/scripts/552745/Komica%20catbox%20player.user.js
// @updateURL https://update.greasyfork.org/scripts/552745/Komica%20catbox%20player.meta.js
// ==/UserScript==
(function() {
  'use strict';
  const links = document.querySelectorAll(
    'a[href*="files.catbox.moe"], a[href*="dec.2chan.net/up/src/"], a[href*="dec.2chan.net/up2/src/"], a[href*="pbs.twimg.com/media/"]'
  );

  links.forEach(a => {
    const button = document.createElement('span');
    button.textContent = ' [展開]';
    button.style.cursor = 'pointer';
    button.style.color = '#00f';
    button.onmouseenter = () => button.style.color = '#f0f';
    button.onmouseleave = () => button.style.color = '#00f';

    button.onclick = () => {
      const next = button.nextSibling;
      if (next && (next.tagName === 'IMG' || next.tagName === 'VIDEO')) {
        next.remove();
        button.textContent = ' [展開]';
        return;
      }

      const url = a.href;
      const isImage =
        url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ||
        url.includes('pbs.twimg.com/media/');

      if (isImage) {
        const img = document.createElement('img');
        img.src = url;
        img.style.display = 'block';
        img.style.marginTop = '5px';
        img.style.maxWidth = '640px';
        img.style.width = '100%';
        img.style.height = 'auto';
        button.insertAdjacentElement('afterend', img);
      } else {
        const video = document.createElement('VIDEO');
          video.src = a.href;
          video.width = 640;
          video.height = 360;
          video.autoplay = true;
          video.muted = true;
          video.controls = true;
          video.style.display = 'block';
          video.style.marginTop = '5px';
          video.style.backgroundColor = 'black';
          button.insertAdjacentElement('afterend', video);
          button.textContent = ' [收起]';
      }

      button.textContent = ' [收起]';
    };

    a.insertAdjacentElement('afterend', button);
  });
})();
