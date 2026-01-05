// ==UserScript==
// @name          GooglePlay direct screenshot links
// @description   Shows all the screenshots without the scrollbox and adds direct links for fullsized versions
// @include       https://play.google.com/store*
// @version       1.0.10
// @author        wOxxOm
// @namespace     wOxxOm.scripts
// @license       MIT License
// @run-at        document-body
// @downloadURL https://update.greasyfork.org/scripts/7885/GooglePlay%20direct%20screenshot%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/7885/GooglePlay%20direct%20screenshot%20links.meta.js
// ==/UserScript==

const GALLERY_ATTR = 'data-slideable-portion-heuristic-width';
const GALLERY_SELECTOR = `[${GALLERY_ATTR}]`;
const FULL_HEIGHT = 2160;
const PREVIEW_HEIGHT = 418;

const mo = new MutationObserver(onMutation);
const observe = () => mo.observe(document, {
  subtree: true,
  childList: true,
  attributes: true,
  attributeFilter: ['style', 'jsdata'],
});
let throttled;
onMutation([{
  addedNodes: [document.body],
  target: document.documentElement,
}]);
observe();
// addEventListener('pageshow', replaceGallery);

async function onMutation(mutations) {
  if (!throttled) {
    throttled = true;
    // await 0;
    replaceGallery();
    throttled = false;
  }
}

function replaceGallery() {
  const node = document.querySelector(GALLERY_SELECTOR);
  if (!node) return;
  mo.disconnect();
  const container = $new('div', {
    style: 'text-align: center',
  });
  const contWidth = node.getBoundingClientRect().width;
  for (const img of node.getElementsByTagName('img')) {
    if (img.nextElementSibling) {
      container.appendChild(img.parentNode);
    } else {
      const src =
        img.dataset.src ||
        (img.srcset || '').match(/https:\S+|$/)[0] ||
        img.src ||
        '';
      const width = img.height && Math.round(PREVIEW_HEIGHT / img.height * img.width);
      const a = $new('a', {
        style: 'margin: 0 4px 4px 0; display: inline-block;',
        href: src.replace(/=.*/, `=h${FULL_HEIGHT}`),
        target: '_blank',
      }, [
        $new('img', Object.assign({
          src: src.replace(/=.*/, `=w${contWidth}-h${PREVIEW_HEIGHT}-rw`),
          height: PREVIEW_HEIGHT,
        }, width && width < contWidth && {
          width,
        })),
      ]);
      container.appendChild(a);
    }
  }
  node.parentNode.replaceWith(container);
  observe();
}

function $new(tag, props, children) {
  const el = document.createElement(tag);
  Object.assign(el, props);
  if (children)
    el.append(...children.filter(Boolean));
  return el;
}
