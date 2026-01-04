// ==UserScript==
// @name        reorx hackernews tweak
// @namespace   Violentmonkey Scripts
// @match       https://news.ycombinator.com/*
// @grant       GM_addStyle
// @version     1.1
// @author      Reorx
// @license MIT
// @description 1/20/2024, 11:14:57 AM
// @downloadURL https://update.greasyfork.org/scripts/554303/reorx%20hackernews%20tweak.user.js
// @updateURL https://update.greasyfork.org/scripts/554303/reorx%20hackernews%20tweak.meta.js
// ==/UserScript==

const linksPanelClass = 'links-panel';

GM_addStyle(`
:root {
  --hn-font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol',sans-serif;
/*   --hn-font-family: Verdana, Geneva, sans-serif; */
  --hn-font-family-mono: monospace;
  --hn-font-size: 15px;
  --hn-font-size-mono: 13px;
  --hn-gray-9: #131313;
  --hn-signature: #ff6600;
}

/* layout */
#hnmain {
  width: 1080px !important;
}

/* typography */
html body  { font-family: var(--hn-font-family); font-size: var(--hn-font-size); }
#hnmain {
  /* override */
  td    { font-family: var(--hn-font-family); font-size: var(--hn-font-size);  }

  .admin td   { font-family: var(--hn-font-family); font-size: var(--hn-font-size);  }
  .subtext td { font-family: var(--hn-font-family); font-size:   var(--hn-font-size);  }

  input    { font-family: var(--hn-font-family-mono); font-size: var(--hn-font-size-mono); }
  input[type=submit] { font-family: var(--hn-font-family); margin-top: -20px; }
  textarea { font-family: var(--hn-font-family-mono); font-size: var(--hn-font-size-mono);  }

  a:link    {  text-decoration:none; }
  a:visited {  text-decoration:none; }
  a:hover { text-decoration: underline; }

  .default { font-family: var(--hn-font-family); font-size:  var(--hn-font-size); }
  .admin   { font-family: var(--hn-font-family); font-size: var(--hn-font-size); }
  .title   { font-family: var(--hn-font-family); font-size:  calc(var(--hn-font-size) + 2px); }
  .subtext { font-family: var(--hn-font-family); font-size:   calc(var(--hn-font-size) - 2px); padding-bottom: 2px; }
  .yclinks { font-family: var(--hn-font-family); font-size:   var(--hn-font-size); }
  .pagetop { font-family: var(--hn-font-family); font-size:  var(--hn-font-size); }

  .toptext { color: var(--hn-gray-9); padding-top: 8px; }
  .comhead { font-family: var(--hn-font-family); font-size:   calc(var(--hn-font-size) - 2px); }
  .comment { font-family: var(--hn-font-family); font-size:   var(--hn-font-size); color: var(--hn-gray-9); }
  /* highlight link in user text */
  .toptext a, .commtext a { color: blue; }
  .reply {
    u { text-decoration: none; }
    a { color: #828282; }
  }

  /* newly added */
  .titleline a { color: var(--hn-gray-9); }
  .comment pre { font-size: var(--hn-font-size-mono); }
}

/* elements */
.titleline {
  display: block;
  margin-bottom: 2px;
}

textarea {
  display: block;
  height: 3em;
}

.comment-tree {
  margin-top: -25px;
}

.score, .hnuser {
  color: var(--hn-signature);
}

/* links panel */

.${linksPanelClass} {
  position: fixed;
  right: 12px;
  bottom: 0;
  width: 430px;
  background: #fff;
  border: 1px solid var(--hn-signature);
  border-bottom: 0;
  display: flex;
  flex-direction: column;

  .title {
    font-size: 1.2em;
    padding: 6px 12px;
    color: var(--hn-signature);
    border-bottom: 1px solid var(--hn-signature);
    background: rgba(255, 102, 0, .1);
    flex-shrink: 0;
    cursor: pointer;
  }
  .links {
    overflow-y: auto;
    padding: 8px 12px;
    max-height: 600px;
  }

  .link-item {
    margin-bottom: 8px;
  }
  .url {
    color: #000;
    padding: 2px 0;
    &:hover {
      color: blue;
    }
  }
  .url,
  .comment-item {
    display: inline-block;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .comments {
    .comment-item {
      padding: 2px 0 2px 12px;
      border-left: 1px solid transparent;
      cursor: pointer;
      color: #828282;
    }
    .comment-item:hover {
      border-color: #aaa;
      background: #eee;
    }
  }
}
`);

const sublineLinks = document.querySelectorAll('.subline > a');
// comments page does not have .subline
if (sublineLinks.length > 0) {
  const commentsCountLink = sublineLinks[sublineLinks.length - 1];
  commentsCountLink.style.color = 'var(--hn-signature)';
}


function createEl(tagName, {innerText, className, id, attrs}, appendTo) {
  const el = document.createElement(tagName)
  if (innerText) el.innerText = innerText;
  if (className) el.className = className;
  if (id) el.id = id;
  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) {
      el.setAttribute(k, v);
    }
  }
  if (appendTo) appendTo.appendChild(el);
  return el;
}

/* collect links in comments */
function initLinksPanel() {
  // loop links
  const ignoredHosts = ['localhost','127.0.0.1', '0.0.0.0'];
  const linkCommentsMap = {};
  document.querySelectorAll('.commtext a:not([href^="reply?"])').forEach(a => {
    const url = a.href;
    if (!url) return;
    const urlObj = new URL(url);
    if (ignoredHosts.includes(urlObj.hostname)) return;
    if (!(url in linkCommentsMap)) {
      linkCommentsMap[url] = []
    }
    const comments = linkCommentsMap[url];

    // create comment object
    const comtr = a.closest('.comtr');
    let commtext = comtr.querySelector('.commtext');
    if (commtext.querySelector('.reply')) {
      commtext = commtext.cloneNode(true);
      commtext.querySelector('.reply').remove()
    }
    const comment = {
      id: comtr.id,
      username: comtr.querySelector('.hnuser').textContent,
      age: comtr.querySelector('.age').textContent,
      content: commtext.textContent.slice(0, 100).trim(),
    }
    // push only if not exists
    if (!comments.find(c => c.id === comment.id)) {
      comments.push(comment);
    }
  })

  // cancel the function if no links found
  const linksCount = Object.keys(linkCommentsMap).length;
  if (linksCount === 0) {
    return
  }

  // create links panel elements
  const panel = createEl('div', {
    className: linksPanelClass,
  }, document.body);
  // title
  const titleEl = createEl('div', {
    className: 'title',
    innerText: `Links in comments (${linksCount})`,
    title: 'click to toggle the links panel'
  }, panel)
  // links
  const linksEl = createEl('div', { className: 'links', }, panel);

  // click titleEl to hide linksEl
  titleEl.addEventListener('click', () => {
    linksEl.style.display = linksEl.style.display === 'none' ? 'block' : 'none';
  })

  const createLinkEl = (url, comments) => {
    const el = createEl('div', { className: 'link-item', }, linksEl);
    const urlEl = createEl('a', {
      className: 'url',
      // remove url schema
      innerText: url.replace(/^https?:\/\//, ''),
      attrs: {
        href: url,
        target: '_blank',
      }
    }, el);
    const commentsEl = createEl('div', { className: 'comments', }, el);
    comments.forEach(comment => {
      const commentEl = createEl('a', {
        // NOTE clicky is a HN built-in class that will help to jump to the comment without changing the url
        className: 'comment-item clicky',
        innerText: `@${comment.username}: ${comment.content}`,
        attrs: { href: `#${comment.id}`, title: comment.age, },
      }, commentsEl);
      commentsEl.appendChild(commentEl);
    });
    return el;
  };

  // sort links by comments length and then loop the links to create elements
  Object.entries(linkCommentsMap).sort(
    (a, b) => b[1].length - a[1].length
  ).forEach(i => {
    const [url, comments] = i;
    createLinkEl(url, comments);
  });

}

// run initLinksPanel only if url matches https://news.ycombinator.com/item?id=…
if (/news\.ycombinator\.com\/item\?id=\d+/.test(location.href)) {
  initLinksPanel();
}

// add submitted link after submit link
const usernameLink = document.querySelector('#me');
const username = usernameLink.textContent;

// Find the submit link
const submitLink = document.querySelector('a[href="submit"]');
const linksContainer = submitLink.parentElement;

// Create the new submitted link
const dimmedColor = 'rgb(186 75 0)';

function newSubLink(href, text) {
    const sl = document.createElement('a');
    sl.href = href;
    sl.textContent = text;
    sl.style.color = dimmedColor;
    return sl
}

function separatorNode() {
    const sp = document.createElement('span');
    sp.textContent = ' | ';
    sp.style.color = dimmedColor;
    return sp
}


linksContainer.append(
    separatorNode()
)
linksContainer.append(
    newSubLink('/submitted?id=' + username, 'submitted')
)
linksContainer.append(
    separatorNode()
)
linksContainer.append(
    newSubLink('/favorites?id=' + username, 'favorites')
)