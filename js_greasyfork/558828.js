// ==UserScript==
// @name            Nova YouTube(Floating video issue fixed)
// @namespace       https://github.com/raingart/Nova-YouTube-extension/
// @version         0.50.0.5
// @description     Powerful control on YouTube
// @name:en         Nova YouTube(Floating video issue fixed)

// @author          raingart <raingart+scriptaddons@protonmail.com>
// @license         Apache-2.0
// @icon            https://raw.github.com/raingart/Nova-YouTube-extension/master/icons/48.png

// @homepageURL     https://github.com/raingart/Nova-YouTube-extension
// @supportURL      https://github.com/raingart/Nova-YouTube-extension/issues
// @contributionURL https://www.patreon.com/raingart
// @contributionURL https://www.buymeacoffee.com/raingart
// @contributionURL https://www.paypal.com/donate/?hosted_button_id=B44WLWHZ8AGU2

// @domain          youtube.com
// @include         http*://www.youtube.com/*
// @include         http*://m.youtube.com/*
// @include         http*://*.youtube-nocookie.com/embed/*
// @include         http*://youtube.googleapis.com/embed/*
// @include         http*://raingart.github.io/options.html*
// @include         http*://raingart.github.io/nova/*

// @exclude         http*://*.youtube.com/*.xml*
// @exclude         http*://*.youtube.com/error*
// @exclude         http*://music.youtube.com/*
// @exclude         http*://accounts.youtube.com/*
// @exclude         http*://studio.youtube.com/*
// @exclude         http*://*.youtube.com/redirect?*
// @exclude         http*://*.youtubetranscript.com/*

// @grant           GM_getResourceText
// @grant           GM_getResourceURL
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_registerMenuCommand
// @grant           GM_notification
// @grant           GM_openInTab
// @grant           unsafeWindow

// @run-at          document-start

// @compatible      chrome >=80 Violentmonkey,Tampermonkey
// @compatible      firefox >=74 Tampermonkey
// @downloadURL https://update.greasyfork.org/scripts/558828/Nova%20YouTube%28Floating%20video%20issue%20fixed%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558828/Nova%20YouTube%28Floating%20video%20issue%20fixed%29.meta.js
// ==/UserScript==
/*jshint esversion: 6 */

if (typeof GM_info === 'undefined') {
alert('Direct Chromium is not supported now');
}
if (!('MutationObserver' in window)) {
errorAlert('MutationObserver not supported');
}
try {
document?.body;
} catch (error) {
errorAlert('Your browser does not support chaining operator');
}
switch (GM_info.scriptHandler) {
case 'Tampermonkey':
case 'Violentmonkey':
case 'ScriptCat':
case 'OrangeMonkey':
break;
case 'FireMonkey':
errorAlert(GM_info.scriptHandler + ' incomplete support', false);
break;
case 'Greasemonkey':
errorAlert(GM_info.scriptHandler + ' is not supported');
break;
case 'Stay':
errorAlert(GM_info.scriptHandler + ' is not tested!\nPlease inform the author about the working status');
break;
default:
if (typeof GM_getValue !== 'function') {
errorAlert('Your ' + GM_info.scriptHandler + ' does not support/no access the API being used. Contact the developer')
}
break;
}
function errorAlert(text = '', stop_execute = true) {
alert(GM_info.script.name + ' Error!\n' + text);
if (stop_execute) {
throw GM_info.script.name + ' crashed!\n' + text;
}
}
window.nova_plugins = [];
window.nova_plugins.push({
id: 'comments-visibility',
title: 'Collapse comments section',
'title:zh': '收起评论区',
'title:ja': 'コメント欄を折りたたむ',
'title:pl': 'Zwiń sekcję komentarzy',
run_on_pages: 'watch, -mobile',
restart_on_location_change: true,
section: 'comments',
_runtime: user_settings => {
NOVA.collapseElement({
selector: '#comments',
label: 'comments',
remove: (user_settings.comments_visibility_mode == 'disable') ? true : false,
});
},
options: {
comments_visibility_mode: {
_tagName: 'select',
label: 'Mode',
'label:zh': '模式',
'label:ja': 'モード',
'label:pl': 'Tryb',
options: [
{
label: 'collapse', value: 'hide', selected: true,
'label:pl': 'zwiń',
},
{
label: 'remove', value: 'disable',
'label:pl': 'usuń',
},
],
},
}
});
window.nova_plugins.push({
id: 'square-avatars',
title: 'Square avatars',
'title:zh': '方形头像',
'title:ja': '正方形のアバター',
'title:pl': 'Kwadratowe awatary',
run_on_pages: '*, -live_chat',
section: 'comments',
desc: 'Make user images squared',
'desc:zh': '方形用户形象',
'desc:ja': 'ユーザー画像を二乗する',
'desc:pl': 'Awatary użytkowniów będą kwadratowe',
_runtime: user_settings => {
NOVA.css.push(
[
'yt-img-shadow',
'.ytp-title-channel-logo',
'#player .ytp-title-channel',
'ytm-profile-icon',
'#ytd-player.ytd-watch-flexy',
'a.ytd-thumbnail',
'#search .ytd-searchbox',
]
.join(',\n') + ` {
border-radius: 0 !important;
}
html {
--yt-button-border-radius: 0;
}`);
NOVA.waitUntil(() => {
if (window.yt && (obj = yt?.config_?.EXPERIMENT_FLAGS) && Object.keys(obj).length) {
yt.config_.EXPERIMENT_FLAGS.web_rounded_thumbnails = false;
return true;
}
}, 100);
},
});
window.nova_plugins.push({
id: 'comments-expand',
title: 'Expand comments',
'title:zh': '展开评论',
'title:ja': 'コメントを展開',
'title:pl': 'Rozwiń komentarze',
run_on_pages: 'watch, -mobile',
section: 'comments',
_runtime: user_settings => {
NOVA.css.push(
`#expander.ytd-comment-renderer {
overflow-x: hidden;
}`);
NOVA.watchElements({
selectors: ['#comments #expander[collapsed] #more:not([hidden])'],
attr_mark: 'nova-comment-expanded',
callback: btn => {
const moreExpand = () => btn.click();
const comment = btn.closest('#expander[collapsed]');
switch (user_settings.comments_expand_mode) {
case 'onhover':
comment.addEventListener('mouseenter', moreExpand, { capture: true, once: true });
break;
case 'always':
moreExpand();
break;
}
},
});
NOVA.watchElements({
//selectors: ['#replies #more-replies button', '#replies #expander-contents ytd-continuation-item-renderer button'],
selectors: ['#replies #collapsed-threads button', '#replies #expander-contents ytd-continuation-item-renderer button'],
attr_mark: 'nova-replies-expanded',
callback: btn => {
const moreExpand = () => {
    console.log(12324);
    btn.click();
}
switch (user_settings.comments_view_reply) {
case 'onhover':
btn.addEventListener('mouseenter', moreExpand, { capture: true, once: true });
break;
case 'always':
moreExpand();
break;
}
},
});
if (NOVA.queryURL.has('lc')) {
NOVA.waitSelector('#comment #linked-comment-badge + #body #expander[collapsed] #more:not([hidden])')
.then(btn => btn.click());
NOVA.waitSelector('ytd-comment-thread-renderer:has(#linked-comment-badge) #replies #more-replies button')
.then(btn => btn.click());
}
},
options: {
comments_expand_mode: {
_tagName: 'select',
label: 'Expand comment',
'label:zh': '展开评论',
'label:ja': 'コメントを展開',
'label:pl': 'Rozwiń komentarz',
options: [
{
label: 'always', value: 'always', selected: true,
'label:zh': '每次',
'label:ja': 'いつも',
'label:pl': 'zawsze',
},
{
label: 'on hover', value: 'onhover',
'label:zh': '悬停时',
'label:ja': 'ホバー時に',
'label:pl': 'przy najechaniu',
},
{
label: 'disable', value: false,
},
],
},
comments_view_reply: {
_tagName: 'select',
label: 'Expand reply',
'label:zh': '展开回复',
'label:ja': '返信を展開',
'label:pl': 'Rozwiń odpowiedź',
options: [
{
label: 'always', value: 'always',
'label:zh': '每次',
'label:ja': 'いつも',
'label:pl': 'zawsze',
},
{
label: 'on hover', value: 'onhover', selected: true,
'label:zh': '悬停时',
'label:ja': 'ホバー時に',
'label:pl': 'przy najechaniu',
},
{
label: 'disable', value: false,
},
],
},
}
});
window.nova_plugins.push({
id: 'comments-popup',
title: 'Comments section in popup',
'title:zh': '弹出窗口中的评论部分',
'title:ja': 'ポップアップのコメントセクション',
'title:pl': 'Sekcja komentarzy w osobnym oknie',
run_on_pages: 'watch, -mobile',
section: 'comments',
_runtime: user_settings => {
if (user_settings['comments_visibility_mode'] == 'disable') return;
const
COMMENTS_SELECTOR = 'html:not(:fullscreen) #page-manager #comments:not([hidden]):not(:empty)',
counterAttrName = 'data-counter';
NOVA.runOnPageLoad(() => {
if (NOVA.currentPage == 'watch') {
NOVA.waitSelector('ytd-comments-header-renderer #title #count:not(:empty)', { destroy_after_page_leaving: true })
.then(countEl => {
if (count = NOVA.extractAsNum.int(countEl.textContent)) {
document.body.querySelector(COMMENTS_SELECTOR)
?.setAttribute(counterAttrName, NOVA.numberFormat.abbr(count));
}
});
}
});
NOVA.waitSelector('#masthead-container')
.then(masthead => {
NOVA.css.push(
`${COMMENTS_SELECTOR},
${COMMENTS_SELECTOR}:before {
position: fixed;
top: ${masthead.offsetHeight || 56}px;
right: 0;
z-index: ${1 + Math.max(getComputedStyle(masthead || movie_player)['z-index'], 601)};
}
${COMMENTS_SELECTOR}:not(:hover):before {
content: attr(${counterAttrName}) " comments ▼";
cursor: pointer;
visibility: visible;
right: 3em;
padding: 0 6px 2px;
line-height: normal;
font-family: Roboto, Arial, sans-serif;
font-size: 11px;
color: #eee;
background-color: rgba(0, 0, 0, .3);
}
${COMMENTS_SELECTOR} {
${(user_settings.comments_popup_width === 100) ? 'margin: 0 1%;' : ''}
padding: 0 15px;
background-color: var(--yt-spec-brand-background-primary);
background-color: var(--yt-spec-menu-background);
background-color: var(--yt-spec-raised-background);
color: var(--yt-spec-text-primary);;
border: 1px solid #333;
max-width: ${user_settings.comments_popup_width || 40}%;
${user_settings['square-avatars'] ? '' : 'border-radius: 12px'};
}
${COMMENTS_SELECTOR}:not(:hover) {
visibility: collapse;
}
${COMMENTS_SELECTOR}:hover {
visibility: visible !important;
}
${COMMENTS_SELECTOR} > #sections > #contents {
overflow-y: auto;
max-height: 82.5vh;
padding-top: 1em;
}
#expander.ytd-comment-renderer {
overflow-x: hidden;
}
${COMMENTS_SELECTOR} #sections {
min-width: 500px;
}
${COMMENTS_SELECTOR} #contents::-webkit-scrollbar {
height: 8px;
width: 10px;
}
${COMMENTS_SELECTOR} #contents::-webkit-scrollbar-button {
height: 0;
width: 0;
}
${COMMENTS_SELECTOR} #contents::-webkit-scrollbar-corner {
background-color: transparent;
}
${COMMENTS_SELECTOR} #contents::-webkit-scrollbar-thumb {
background-color: #e1e1e1;
border: 0;
border-radius: 0;
}
${COMMENTS_SELECTOR} #contents::-webkit-scrollbar-thumb {}
${COMMENTS_SELECTOR} #contents::-webkit-scrollbar-track {
background-color: #666;
border: 0;
border-radius: 0;
}
${COMMENTS_SELECTOR} #contents::-webkit-scrollbar-track:hover {
background-color: #666;
}
ytd-comments-header-renderer {
margin: 10px 0 !important;
}`);
if (user_settings.comments_popup_hide_textarea) {
NOVA.css.push(
`${COMMENTS_SELECTOR} > #sections > #contents {
overflow-y: auto;
max-height: 88vh;
border-top: 1px solid #333;
padding-top: 1em;
}
${COMMENTS_SELECTOR} #header #simple-box {
display: none;
}
ytd-comments-header-renderer #title {
margin: 0 !important;
}`);
}
});
},
options: {
comments_popup_width: {
_tagName: 'input',
label: 'Width',
'label:zh': '宽度',
'label:ja': '幅',
'label:pl': 'Szerokość',
type: 'number',
title: '% of the screen width',
placeholder: '%',
step: 5,
min: 10,
max: 100,
value: 40,
},
comments_popup_hide_textarea: {
_tagName: 'input',
label: 'Hide textarea',
'label:zh': '隐藏文本区域',
'label:ja': 'テキストエリアを隠す',
'label:pl': 'Ukryj obszar tekstowy',
type: 'checkbox',
},
}
});
window.nova_plugins.push({
id: 'comments-sort',
title: 'Comments sort',
'title:zh': '评论排序',
'title:ja': 'コメントの並べ替え',
'title:pl': 'Sortowanie komentarzy',
run_on_pages: 'watch, -mobile',
section: 'comments',
opt_api_key_warn: true,
desc: 'add modal',
_runtime: user_settings => {
const
MAX_COMMENTS = (user_settings['user-api-key'] && +user_settings.comments_sort_max) || 250,
MODAL_NAME_SELECTOR_ID = 'nova-modal-comments',
MODAL_CONTENT_SELECTOR_ID = 'modal-content',
NOVA_REPLYS_SELECTOR_ID = 'nova-replys',
NOVA_REPLYS_SWITCH_CLASS_NAME = NOVA_REPLYS_SELECTOR_ID + '-switch',
BLOCK_KEYWORDS = NOVA.strToArray(user_settings.comments_sort_blocklist?.toLowerCase());
NOVA.waitSelector('#movie_player')
.then(insertButton);
function insertButton() {
NOVA.waitSelector(
user_settings['comments-popup']
? '#masthead-container'
: '#comments ytd-comments-header-renderer #title'
)
.then(menu => {
const btn = document.createElement('span');
btn.setAttribute('data-open-modal', MODAL_NAME_SELECTOR_ID);
btn.title = 'Nova Comments';
btn.textContent = '►';
btn.addEventListener('click', () => {
if (!document.body.querySelector(`#${MODAL_CONTENT_SELECTOR_ID} table`)) {
getComments();
}
btn.dispatchEvent(new CustomEvent(MODAL_NAME_SELECTOR_ID, { bubbles: true, detail: 'test' }));
});
Object.assign(btn.style,
user_settings['comments-popup']
? {
position: 'fixed',
right: '0',
top: 'var(--ytd-masthead-height)',
visibility: 'visible',
'z-index': 1 + Math.max(
NOVA.css.get('.ytp-chrome-top', 'z-index'),
60),
'font-size': '18px',
}
: {
'font-size': '24px',
'text-decoration': 'none',
padding: '0 10px',
'background-color': 'transparent',
border: 'none',
},
{
color: 'orange',
cursor: 'pointer',
});
user_settings['comments-popup']
? menu.append(btn)
: menu.prepend(btn);
insertModal();
NOVA.runOnPageLoad(() => {
if (NOVA.currentPage == 'watch') {
document.getElementById(MODAL_CONTENT_SELECTOR_ID).innerHTML = '<pre>Loading data...</pre>';
}
});
});
}
let commentList = [];
function getComments(next_page_token) {
const params = {
'videoId': NOVA.queryURL.get('v') || movie_player.getVideoData().video_id,
'part': 'snippet,replies',
'maxResults': Math.min(+user_settings.comments_sort_max || 100, 100),
'order': 'relevance',
};
if (next_page_token) {
params['pageToken'] = next_page_token;
}
NOVA.request.API({
request: 'commentThreads',
params: params,
api_key: user_settings['user-api-key'],
})
.then(res => {
if (res?.error) {
if (res.reason) {
document.getElementById(MODAL_NAME_SELECTOR_ID)
.dispatchEvent(new CustomEvent(MODAL_NAME_SELECTOR_ID, { bubbles: true, detail: 'test' }));
return alert(`Error [${res.code}]: ${res.reason}`);
}
else {
return document.getElementById(MODAL_CONTENT_SELECTOR_ID).innerHTML =
`<pre>Error [${res.code}]: ${res.reason}</pre>
<pre>${res.error}</pre>`;
}
}
res?.items?.forEach(item => {
if (comment = item.snippet?.topLevelComment?.snippet) {
commentList.push(
Object.assign(
{ 'totalReplyCount': item.snippet.totalReplyCount },
{ 'id': item.id },
comment,
item.replies,
)
);
}
else {
console.warn('API is change', item);
}
});
if (commentList.length >= MAX_COMMENTS) {
genTable();
}
else if (res?.nextPageToken) {
document.getElementById(MODAL_CONTENT_SELECTOR_ID).innerHTML = `<pre>Loading: ${commentList.length + (user_settings['user-api-key'] ? '' : '/' + MAX_COMMENTS)}</pre>`;
getComments(res?.nextPageToken);
}
else {
genTable();
}
});
}
function genTable() {
if (!commentList.length) {
return document.getElementById(MODAL_CONTENT_SELECTOR_ID).innerHTML = `<pre>Comments empty</pre>`;
}
const ul = document.createElement('tbody');
const channelName = (href = document.body.querySelector('#owner #upload-info #channel-name a[href]')?.href) && new URL(href).pathname;
commentList
.sort((a, b) => b.likeCount - a.likeCount)
.forEach(comment => {
try {
if (!(comment.textDisplay = filterStr(comment.textDisplay, comment.authorDisplayName))) return;
if (comment.textOriginal.length > 100 && comment.textOriginal.split(' ')?.some(word => word.length > 100)) {
console.debug('comment istoo long:\n', comment.textOriginal);
return;
}
const
replyInputName = `${NOVA_REPLYS_SELECTOR_ID}-${comment.id}`,
li = document.createElement('tr');
let replyCount = 0;
li.className = 'item';
if (channelName && comment.authorChannelUrl.includes(channelName)) li.classList.add('author');
li.innerHTML =
`<td>${comment.likeCount}</td>
<td sorttable_customkey="${comment.totalReplyCount}" class="${NOVA_REPLYS_SWITCH_CLASS_NAME}">
${comment.comments?.length
? `<a href="https://www.youtube.com/watch?v=${comment.videoId}&lc=${comment.id}" target="_blank" title="Open comment link">${comment.totalReplyCount}</a> <label for="${replyInputName}"></label>`
: ''}</td>
<td sorttable_customkey="${new Date(comment.publishedAt).getTime()}">${NOVA.formatTimeOut.ago(new Date(comment.publishedAt))}</td>
<td>
<a href="${comment.authorChannelUrl}" target="_blank" title="${comment.authorDisplayName}">
<img src="${comment.authorProfileImageUrl}" alt="${comment.authorDisplayName}" />
</a>
</td>
<td sorttable_customkey="${comment.textOriginal.length}">
<span class="text-overflow-dynamic-ellipsis">${comment.textDisplay}</span>
${appendReplies()}
</td>`;
ul.append(li);
if (replyCount) {
const checkbox = document.createElement('input');
checkbox.type = 'checkbox';
checkbox.id = checkbox.name = replyInputName;
checkbox.addEventListener('change', ({ target }) => {
document.body.querySelector(`table[${NOVA_REPLYS_SELECTOR_ID}="${target.name}"]`)
.classList.toggle('nova-hide');
});
li.querySelector('td label[for]')?.before(checkbox);
}
function appendReplies() {
if (!+comment.totalReplyCount) return '';
const table = document.createElement('table');
table.className = 'nova-hide';
table.setAttribute(NOVA_REPLYS_SELECTOR_ID, replyInputName);
comment.comments
?.forEach(reply => {
if (!(reply.snippet.textDisplay = filterStr(reply.snippet.textDisplay, reply.snippet.authorDisplayName))) return;
replyCount++;
const li = document.createElement('tr');
if (channelName && reply.snippet.authorChannelUrl.includes(channelName)) li.classList.add('author');
li.innerHTML =
`<td>
<a href="${reply.snippet.authorChannelUrl}" target="_blank" title="${reply.snippet.authorDisplayName}">
<img src="${reply.snippet.authorProfileImageUrl}" alt="${reply.snippet.authorDisplayName}" />
</a>
</td>
<td>
<span class="text-overflow-dynamic-ellipsis">
<div class="nova-reply-time-text">${reply.snippet.likeCount
? `${reply.snippet.likeCount} likes` : ''}</div>
<div>${reply.snippet.textDisplay}</div>
</span>
</td>`;
table.append(li);
});
return table.outerHTML;
}
} catch (error) {
console.error('Error comment generate:\n', error.stack + '\n', comment);
}
});
function filterStr(str, user) {
if (keyword = BLOCK_KEYWORDS?.find(keyword => ((user && keyword?.startsWith('@')) ? user : str)
.toLowerCase().includes(keyword))
) {
console.log('comment filter:', `"${keyword}\n"`, str.replace(keyword, `[${keyword}]`));
return;
}
const countWords = (str = '') => str.trim().split(/\s+/).length,
clearOfEmoji = str => str
.replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2580-\u27BF]|\uD83E[\uDD10-\uDDFF]/g, ' ')
.replace(/(?![*#0-9]+)[\p{Emoji}]/gu, ' ')
.replace(/([=:;/.()]{2,}|\))$/g, ' ')
.replace(/\s{2,}/g, ' ')
.replace(/(<br>){3,}/g, '<br><br>')
.replace(/<a[^>]+><\/a>/g, '')
.trim();
if (user_settings.comments_sort_clear_emoji) {
str = clearOfEmoji(str);
if (!str.length) return;
if (+user_settings.comments_sort_min_words
&& countWords(str) <= +user_settings.comments_sort_min_words
) {
return;
}
}
return str;
}
const MODAL_CONTENT_FILTER_SELECTOR_ID = 'nova-search-comment';
document.getElementById(MODAL_CONTENT_SELECTOR_ID).innerHTML =
`<table class="sortable" border="0" cellspacing="0" cellpadding="0">
<thead id="${MODAL_CONTENT_FILTER_SELECTOR_ID}">
<tr>
<th class="sorttable_numeric">likes</th>
<th class="sorttable_numeric">replys</th>
<th class="sorttable_numeric">date</th>
<th class="sorttable_nosort">avatar</th>
<th class="sorttable_numeric">comments (${commentList.length})</th>
</tr>
</thead>
<!-- $ {ul.innerHTML} -->
</table>`;
document.getElementById(MODAL_CONTENT_FILTER_SELECTOR_ID).after(ul);
connectSortable().makeSortable(document.body.querySelector('table.sortable'));
document.body.querySelector(`table.sortable thead`)
.addEventListener('click', ({ target }) => {
if (['input', 'textarea', 'select'].includes(target.localName) || target.isContentEditable) return;
if (containerScroll = document.body.querySelector('.modal-container')) containerScroll.scrollTop = 0;
});
insertFilterInput(MODAL_CONTENT_FILTER_SELECTOR_ID);
NOVA.css.push(
`.nova-hide {
display: none;
}
table[${NOVA_REPLYS_SELECTOR_ID}] {
border: 1px solid #444;
width: auto !important;
}
table[${NOVA_REPLYS_SELECTOR_ID}] td {
padding: auto 10px;
}
.nova-reply-time-text {
font-size: .5em;
font-style: italic;
}
.${NOVA_REPLYS_SWITCH_CLASS_NAME} input[type=checkbox] {
--height: 1.5em;
--disabled-opacity: .7;
background-color: var(--dark-theme-divider-color);
color: var(--dark-theme-text-color);
--off-hover-bg: var(--light-theme-secondary-color);
--checked-bg: #e85717;
--checked-bg-active: var(--dark-theme-divider-color);
--checked-color: var(--dark-theme-text-color);
--text-on: 'HIDE';
--text-on-press: 'SHOW';
--text-off: 'ANS';
--text-off-press: 'HIDE?';
appearance: none;
-webkit-appearance: none;
position: relative;
cursor: pointer;
outline: 0;
border: none;
overflow: hidden;
-webkit-user-select: none;
-moz-user-select: none;
-ms-user-select: none;
user-select: none;
-webkit-backface-visibility: hidden;
backface-visibility: hidden;
font-size: 1em;
width: 4em;
height: 1.7em;
font-weight: bold;
}
.${NOVA_REPLYS_SWITCH_CLASS_NAME} input[type=checkbox]:hover:before {
background-color: var(--off-hover-bg);
}
.${NOVA_REPLYS_SWITCH_CLASS_NAME} input[type=checkbox]:after,
.${NOVA_REPLYS_SWITCH_CLASS_NAME} input[type=checkbox]:before {
position: absolute;
transition: left 200ms ease-in-out;
width: 100%;
line-height: 1.8em;
text-align: center;
}
.${NOVA_REPLYS_SWITCH_CLASS_NAME} input[type=checkbox]:after {
left: 100%;
content: var(--text-on);
font-weight: bold;
}
.${NOVA_REPLYS_SWITCH_CLASS_NAME} input[type=checkbox]:before {
left: 0;
content: var(--text-off);
}
.${NOVA_REPLYS_SWITCH_CLASS_NAME} input[type=checkbox]:active {
background-color: var(--checked-bg);
}
.${NOVA_REPLYS_SWITCH_CLASS_NAME} input[type=checkbox]:active:before {
left: -10%;
content: var(--text-on-press);
}
.${NOVA_REPLYS_SWITCH_CLASS_NAME} input[type=checkbox]:checked {
color: var(--checked-color);
background-color: var(--checked-bg);
}
.${NOVA_REPLYS_SWITCH_CLASS_NAME} input[type=checkbox]:checked:before {
left: -100%;
}
.${NOVA_REPLYS_SWITCH_CLASS_NAME} input[type=checkbox]:checked:after {
left: 0;
}
.${NOVA_REPLYS_SWITCH_CLASS_NAME} input[type=checkbox]:checked:active:after {
left: 10%;
content: var(--text-off-press);
background-color: var(--checked-bg-active);
}
.${NOVA_REPLYS_SWITCH_CLASS_NAME} input[type=checkbox] [disabled] {
cursor: not-allowed;
}
.${NOVA_REPLYS_SWITCH_CLASS_NAME} input[type=checkbox] [disabled] {
opacity: var(--disabled-opacity);
}
`);
}
function insertFilterInput(parent_selector_id = required()) {
if (typeof parent_selector_id !== 'string') {
return console.error('typeof "parent_selector_id":', (typeof parent_selector_id));
}
NOVA.css.push(
`#${parent_selector_id} input {
position: absolute;
top: 0;
right: 0;
}
#${parent_selector_id} input[type=search]:focus,
#${parent_selector_id} input[type=text]:focus {
outline: 1px solid #00b7fc;
}
.nova-mark-text {
background-color: #ff0;
background-color: mark;
}`);
const searchInput = document.createElement('input');
searchInput.setAttribute('type', 'search');
searchInput.setAttribute('placeholder', 'Filter');
['change', 'keyup'].forEach(evt => {
searchInput
.addEventListener(evt, function () {
NOVA.searchFilterHTML({
'keyword': this.value,
'filter_selectors': 'tr.item',
'highlight_selector': '.text-overflow-dynamic-ellipsis',
'highlight_class': 'nova-mark-text',
});
});
searchInput
.addEventListener('click', () => {
searchInput.value = '';
searchInput.dispatchEvent(new Event('change'));
});
});
document.getElementById(parent_selector_id).append(searchInput);
};
function insertModal() {
NOVA.css.push(
`.modal {
--animation-time: .2s;
z-index: 9999;
position: fixed;
top: 0;
left: 0;
background-color: rgba(0, 0, 0, .8);
display: flex;
align-items: center;
justify-content: center;
width: 100%;
height: 100%;
box-sizing: border-box;
visibility: hidden;
opacity: 0;
}
.modal.modal-visible {
animation: microModalFadeIn var(--animation-time) cubic-bezier(0, 0, .2, 1);
backdrop-filter: blur(1em);
visibility: visible;
opacity: 1;
}
@keyframes microModalFadeIn {
from { opacity: 0; }
to { opacity: 1; }
}
.modal-container {
border-radius: 4px;
background-color: silver;
position: relative;
display: flex;
box-sizing: border-box;
overflow-y: auto;
max-width: 70%;
max-height: 100vh;
transform: scale(0.9);
transition: scale var(--animation-time) ease-out;
}
.modal.modal-visible .modal-container {
transform: scale(1);
}
.modal-close {
position: absolute;
top: 0;
right: 0;
cursor: pointer;
font-size: 2em;
padding: 0 5px;
transition: background-color var(--animation-time) ease-out;
}
.modal-close:hover {
background-color: #ea3c3c;
}
.modal-content {
padding: 2rem;
}`);
NOVA.css.push(
`.modal {}
.modal-container {
background-color: var(--yt-spec-brand-background-primary);
background-color: var(--yt-spec-menu-background);
background-color: var(--yt-spec-raised-background);
color: var(--yt-spec-text-primary);
}
.modal-content {
font-size: 12px;
}`);
document.body
.insertAdjacentHTML('beforeend',
`<div id="${MODAL_NAME_SELECTOR_ID}" class="modal" data-modal>
<div class="modal-container">
<div class="modal-close" data-close-modal>✕</div>
<div class="modal-content" id="${MODAL_CONTENT_SELECTOR_ID}"></div>
</div>
</div>`);
const modalShowClass = 'modal-visible';
document.getElementById(MODAL_NAME_SELECTOR_ID)
.addEventListener('click', ({ target }) => {
target.dispatchEvent(new CustomEvent(MODAL_NAME_SELECTOR_ID, { bubbles: true, detail: 'test' }));
});
document.addEventListener(MODAL_NAME_SELECTOR_ID, ({ target }) => {
const
attrModal = target.hasAttribute('data-modal'),
attrOpen = target.getAttribute('data-open-modal'),
attrClose = target.hasAttribute('data-close-modal');
if (attrModal) {
target.classList.remove(modalShowClass);
}
else if (attrOpen && (modal = document.getElementById(attrOpen))) {
modal.classList.add(modalShowClass);
}
else if (attrClose && (modal = target.closest('[data-modal]'))) {
modal.classList.remove(modalShowClass);
}
});
}
function connectSortable() {
NOVA.css.push(
`table.sortable table {
width: 100%;
}
table.sortable thead {
position: sticky;
top: 0px
}
table.sortable th {
text-transform: uppercase;
white-space: nowrap;
}
table.sortable th:not(.sorttable_nosort) {
cursor: pointer;
}
table.sortable th:not(.sorttable_sorted):not(.sorttable_sorted_reverse):not(.sorttable_nosort):hover:after {
position: absolute;
content: " \\25B4\\25BE";
}
thead, th, td {
text-align: center;
}
table tbody {
counter-reset: sortabletablescope;
}
`);
NOVA.css.push(
`#${MODAL_CONTENT_SELECTOR_ID} table {}
#${MODAL_CONTENT_SELECTOR_ID} thead {
background-color: #555;
z-index: 1;
}
#${MODAL_CONTENT_SELECTOR_ID} th {
padding: 5px 3px;
font-weight: 500;
}
#${MODAL_CONTENT_SELECTOR_ID} tr:nth-child(even) {
background-color: var(--yt-spec-menu-background);
}
#${MODAL_CONTENT_SELECTOR_ID} td .text-overflow-dynamic-ellipsis {
display: block;
max-height: 25vh;
overflow-y: auto;
scrollbar-width: thin;
text-align: left;
font-size: 1.2em;
line-height: 1.4;
padding: 10px 5px;
text-overflow: ellipsis;
word-wrap: break-word;
}
#${MODAL_CONTENT_SELECTOR_ID} tr.author {
}
#${MODAL_CONTENT_SELECTOR_ID} .author > td > .text-overflow-dynamic-ellipsis {
background-color: rgba(0, 47, 144, .2);
}
#${MODAL_CONTENT_SELECTOR_ID} td a {
text-decoration: none;
color: var(--yt-spec-call-to-action);
}`);
return sorttable = { selector_tables: "table.sortable", class_sort_bottom: "sortbottom", class_no_sort: "sorttable_nosort", class_sorted: "sorttable_sorted", class_sorted_reverse: "sorttable_sorted_reverse", id_sorttable_sortfwdind: "sorttable_sortfwdind", id_sorttable_sortfrevind: "sorttable_sortrevind", icon_up: "&nbsp;&#x25B4;", icon_down: "&nbsp;&#x25BE;", regex_non_decimal: /[^0-9\.\-]/g, regex_trim: /^\s+|\s+$/g, regex_any_sorttable_class: /\bsorttable_([a-z0-9]+)\b/, init: function () { arguments.callee.done || (arguments.callee.done = !0, sorttable.forEach(document.querySelectorAll(sorttable.selector_tables), sorttable.makeSortable)) }, insert_thead_in_table: function (t) { 0 === t.getElementsByTagName("thead").length && (thead_element = document.createElement("thead"), thead_element.appendChild(t.rows[0]), t.insertBefore(thead_element, t.firstChild)) }, forEach: function (t, e, r) { if (t) { var s = Object; if (t instanceof Function) s = Function; else { if (t.forEach instanceof Function) return void t.forEach(e, r); "string" == typeof t ? s = String : "number" == typeof t.length && (s = Array) } s.forEach(t, e, r) } }, innerSortFunction: function (t) { if (this.classList.contains(sorttable.class_sorted)) return sorttable.reverse(this.sorttable_tbody), this.classList.remove(sorttable.class_sorted), this.classList.add(sorttable.class_sorted_reverse), this.removeChild(document.getElementById(sorttable.id_sorttable_sortfwdind)), sortrevind = document.createElement("span"), sortrevind.id = sorttable.id_sorttable_sortfrevind, sortrevind.innerHTML = sorttable.icon_up, this.appendChild(sortrevind), void t.preventDefault(); if (this.classList.contains(sorttable.class_sorted_reverse)) return sorttable.reverse(this.sorttable_tbody), this.classList.remove(sorttable.class_sorted_reverse), this.classList.add(sorttable.class_sorted), this.removeChild(document.getElementById(sorttable.id_sorttable_sortfrevind)), sortfwdind = document.createElement("span"), sortfwdind.id = sorttable.id_sorttable_sortfwdind, sortfwdind.innerHTML = sorttable.icon_down, this.appendChild(sortfwdind), void t.preventDefault(); theadrow = this.parentNode, sorttable.forEach(theadrow.childNodes, (function (t) { 1 == t.nodeType && (t.classList.remove(sorttable.class_sorted_reverse), t.classList.remove(sorttable.class_sorted)) })), sortfwdind = document.getElementById(sorttable.id_sorttable_sortfwdind), sortfwdind && sortfwdind.parentNode.removeChild(sortfwdind), sortrevind = document.getElementById(sorttable.id_sorttable_sortfrevind), sortrevind && sortrevind.parentNode.removeChild(sortrevind), this.classList.add(sorttable.class_sorted), sortfwdind = document.createElement("span"), sortfwdind.id = sorttable.id_sorttable_sortfwdind, sortfwdind.innerHTML = sorttable.icon_down, this.appendChild(sortfwdind), row_array = [], col = this.sorttable_columnindex, rows = this.sorttable_tbody.rows; for (var e = 0; e < rows.length; e++)row_array[row_array.length] = [sorttable.getInnerText(rows[e].cells[col]), rows[e]]; row_array.sort(this.sorttable_sortfunction), tb = this.sorttable_tbody; for (e = 0; e < row_array.length; e++)tb.appendChild(row_array[e][1]); t.preventDefault(), delete row_array }, makeSortable: function (t) { if (sorttable.insert_thead_in_table(t), null == t.tHead && (t.tHead = t.getElementsByTagName("thead")[0]), 1 == t.tHead.rows.length) { for (var e = [], r = 0; r < t.rows.length; r++)t.rows[r].classList.contains(sorttable.class_sort_bottom) && (e[e.length] = t.rows[r]); if (e) { if (null == t.tFoot) { var s = document.createElement("tfoot"); t.appendChild(s) } for (r = 0; r < e.length; r++)s.appendChild(e[r]) } var o = t.tHead.rows[0].cells; for (r = 0; r < o.length; r++)o[r].classList.contains(sorttable.class_no_sort) || (mtch = o[r].className.match(sorttable.regex_any_sorttable_class), mtch && (override = mtch[1]), mtch && "function" == typeof sorttable["sort_" + override] ? o[r].sorttable_sortfunction = sorttable["sort_" + override] : o[r].sorttable_sortfunction = sorttable.guessType(t, r), o[r].sorttable_columnindex = r, o[r].sorttable_tbody = t.tBodies[0], o[r].addEventListener("click", sorttable.innerSortFunction)) } }, guessType: function (t, e) { return sorttable.sort_alpha }, getInnerText: function (t) { if (!t) return ""; if (void 0 !== t.dataset && void 0 !== t.dataset.value) return t.dataset.value; if (hasInputs = "function" == typeof t.getElementsByTagName && t.getElementsByTagName("input").length, null != t.getAttribute("sorttable_customkey")) return t.getAttribute("sorttable_customkey"); if (void 0 !== t.textContent && !hasInputs) return t.textContent.replace(sorttable.regex_trim, ""); if (void 0 !== t.innerText && !hasInputs) return t.innerText.replace(sorttable.regex_trim, ""); if (void 0 !== t.text && !hasInputs) return t.text.replace(sorttable.regex_trim, ""); switch (t.nodeType) { case 3: if ("input" == t.nodeName.toLowerCase()) return t.value.replace(sorttable.regex_trim, ""); case 4: return t.nodeValue.replace(sorttable.regex_trim, ""); case 1: case 11: for (var e = "", r = 0; r < t.childNodes.length; r++)e += sorttable.getInnerText(t.childNodes[r]); return e.replace(sorttable.regex_trim, ""); default: return "" } }, reverse: function (t) { for (var e = [], r = 0; r < t.rows.length; r++)e[e.length] = t.rows[r]; for (r = e.length - 1; r >= 0; r--)t.appendChild(e[r]) }, sort_numeric: function (t, e) { var r = parseFloat(t[0].replace(sorttable.regex_non_decimal, "")); isNaN(r) && (r = 0); var s = parseFloat(e[0].replace(sorttable.regex_non_decimal, "")); return isNaN(s) && (s = 0), r - s }, sort_alpha: function (t, e) { return t[0] == e[0] ? 0 : t[0] < e[0] ? -1 : 1 }, shaker_sort: function (t, e) { for (var r = 0, s = t.length - 1, o = !0; o;) { o = !1; for (var a = r; a < s; ++a)if (e(t[a], t[a + 1]) > 0) { var n = t[a]; t[a] = t[a + 1], t[a + 1] = n, o = !0 } if (s-- , !o) break; for (a = s; a > r; --a)if (e(t[a], t[a - 1]) < 0) { n = t[a]; t[a] = t[a - 1], t[a - 1] = n, o = !0 } r++ } } };
}
},
options: {
comments_sort_clear_emoji: {
_tagName: 'input',
label: 'Clear of emoji',
type: 'checkbox',
},
comments_sort_min_words: {
_tagName: 'input',
label: 'Min words count',
'label:zh': '最少字数',
'label:ja': '最小単語数',
'label:es': 'Recuento mínimo de palabras',
'label:pl': 'Minimalna liczba słów',
type: 'number',
title: '0 - disable',
placeholder: '0-10',
min: 0,
max: 10,
value: 2,
'data-dependent': { 'comments_sort_clear_emoji': true },
},
comments_sort_max: {
_tagName: 'input',
label: 'Max comments',
type: 'number',
title: '0 - disable',
placeholder: '0-1200',
min: 0,
max: 1200,
value: 100,
},
comments_sort_blocklist: {
_tagName: 'textarea',
label: 'Words/users blocklist',
'label:zh': '被阻止的单词列表',
'label:ja': 'ブロックされた単語のリスト',
'label:pl': 'Lista blokowanych słów',
title: 'separator: "," or ";" or "new line"',
'title:zh': '分隔器： "," 或 ";" 或 "新队"',
'title:ja': 'セパレータ： "," または ";" または "改行"',
'title:pl': 'separator: "," lub ";" lub "now linia"',
placeholder: 'text1\n@userA',
},
},
});
window.nova_plugins.push({
id: 'player-loop',
title: 'Add repeat (loop) playback button',
'title:zh': '添加循环播放按钮',
'title:ja': 'ループ再生ボタンを追加する',
'title:pl': 'Dodaj przycisk odtwarzania pętli',
run_on_pages: 'watch, embed, -mobile',
section: 'control-panel',
_runtime: user_settings => {
NOVA.waitSelector('#movie_player .ytp-left-controls .ytp-play-button')
.then(container => {
const
SELECTOR_CLASS = 'nova-right-custom-button',
btn = document.createElement('button');
btn.className = `ytp-button ${SELECTOR_CLASS}`;
btn.style.opacity = .5;
btn.style.minWidth = getComputedStyle(container).width || '48px';
btn.title = 'Repeat';
btn.innerHTML =
`<svg viewBox="-6 -6 36 36" height="100%" width="100%">
<g fill="currentColor">
<path d="M 7 7 L 17 7 L 17 10 L 21 6 L 17 2 L 17 5 L 5 5 L 5 11 L 7 11 L 7 7 Z M 7.06 17 L 7 14 L 3 18 L 7 22 L 7 19 L 19 19 L 19 13 L 17 13 L 17 17 L 7.06 17 Z"/>
</g>
</svg>`;
btn.addEventListener('click', toggleLoop);
container.after(btn);
NOVA.waitSelector('#movie_player video')
.then(video => {
video.addEventListener('loadeddata', ({ target }) => {
if (movie_player.classList.contains('ad-showing')) return;
if (btn.style.opacity == 1 && !target.loop) target.loop = true;
if (target.loop) btn.style.opacity = 1;
});
});
if (user_settings.player_loop_hotkey) {
const hotkey = user_settings.player_loop_hotkey;
document.addEventListener('keyup', evt => {
if (NOVA.currentPage != 'watch' && NOVA.currentPage != 'embed') return;
if (['input', 'textarea', 'select'].includes(evt.target.localName) || evt.target.isContentEditable) return;
if (evt.ctrlKey || evt.altKey || evt.shiftKey || evt.metaKey) return;
if ((hotkey.length === 1 ? evt.key : evt.code) === hotkey) {
toggleLoop();
}
});
}
function toggleLoop() {
if (!NOVA.videoElement) return console.error('btn > videoElement empty:', NOVA.videoElement);
NOVA.videoElement.loop = !NOVA.videoElement.loop;
btn.style.opacity = NOVA.videoElement.loop ? 1 : .5;
NOVA.showOSD('Loop is ' + Boolean(NOVA.videoElement.loop));
}
});
},
options: {
player_loop_hotkey: {
_tagName: 'select',
label: 'Hotkey',
options: [
{ label: 'none', },
{ label: 'A', value: 'KeyA' },
{ label: 'B', value: 'KeyB' },
{ label: 'C', value: 'KeyC' },
{ label: 'D', value: 'KeyD' },
{ label: 'E', value: 'KeyE' },
{ label: 'F', value: 'KeyF' },
{ label: 'G', value: 'KeyG' },
{ label: 'H', value: 'KeyH' },
{ label: 'I', value: 'KeyI' },
{ label: 'J', value: 'KeyJ' },
{ label: 'K', value: 'KeyK' },
{ label: 'L', value: 'KeyL' },
{ label: 'M', value: 'KeyM' },
{ label: 'N', value: 'KeyN' },
{ label: 'O', value: 'KeyO' },
{ label: 'P', value: 'KeyP' },
{ label: 'Q', value: 'KeyQ' },
{ label: 'R', value: 'KeyR' },
{ label: 'S', value: 'KeyS' },
{ label: 'T', value: 'KeyT' },
{ label: 'U', value: 'KeyU' },
{ label: 'V', value: 'KeyV' },
{ label: 'W', value: 'KeyW' },
{ label: 'X', value: 'KeyX' },
{ label: 'Y', value: 'KeyY' },
{ label: 'Z', value: 'KeyZ' },
0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
']', '[', '+', '-', ',', '.', '/', '<', ';', '\\',
],
},
}
});
window.nova_plugins.push({
id: 'player-live-duration',
title: 'Show duration on live video',
'title:zh': '显示直播视频的时长',
'title:ja': 'ライブビデオの表示時間',
'title:pl': 'Pokaż czas trwania wideo na żywo',
run_on_pages: 'watch, embed, -mobile',
section: 'control-panel',
_runtime: user_settings => {
NOVA.waitSelector('#movie_player video')
.then(video => {
video.addEventListener('canplay', () => {
if (movie_player.getVideoData().isLive
&& (el = document.body.querySelector('#movie_player .ytp-chrome-controls .ytp-live .ytp-time-current'))
) {
el.style.cssText = 'display: block !important; margin-right: 5px;';
}
});
NOVA.css.push(
`#movie_player .ytp-chrome-controls .ytp-time-display.ytp-live {
display: flex !important;
}`);
});
},
});
window.nova_plugins.push({
id: 'player-control-autohide',
title: 'Hide player control panel if not hovered',
'title:zh': '播放器上的自动隐藏控件',
'title:ja': 'プレーヤーのコントロールを自動非表示',
'title:pl': 'Ukrywaj elementy w odtwarzaczu',
run_on_pages: 'watch, embed, -mobile',
section: 'control-panel',
desc: 'Hover controls to display it',
'desc:zh': '将鼠标悬停在它上面以显示它',
'desc:ja': 'カーソルを合わせると表示されます',
'desc:pl': 'Najedź, aby wyświetlić',
'plugins-conflict': 'player-control-below',
_runtime: user_settings => {
if (user_settings['player-control-below']) return;
let selectorHover, selectorGradientHide;
switch (user_settings.player_control_autohide_container) {
case 'player':
selectorHover = 'ytd-watch-flexy:not([fullscreen]) #movie_player:hover .ytp-chrome-bottom';
selectorGradientHide = '#movie_player:not(:hover) .ytp-gradient-bottom';
NOVA.waitSelector('#movie_player')
.then(movie_player => {
triggerOnHoverElement({
'element': movie_player,
'callback': function (hovered) {
if (hovered) fixControlFreeze.mouseMoveIntervalId = fixControlFreeze();
else clearInterval(fixControlFreeze.mouseMoveIntervalId);
},
});
});
break;
default:
selectorHover = '.ytp-chrome-bottom:hover';
selectorGradientHide = '#movie_player:has(.ytp-chrome-bottom:not(:hover)) .ytp-gradient-bottom';
break;
}
NOVA.css.push(
`.ytp-chrome-bottom {
opacity: 0;
}
${selectorHover} {
opacity: 1;
}`);
NOVA.css.push(
`${selectorGradientHide} {
opacity: 0;
}`);
if (user_settings.player_control_autohide_show_on_seek) {
let timeout;
document.addEventListener('seeked', ({ target }) => {
if (NOVA.currentPage != 'watch' && NOVA.currentPage != 'embed') return;
if (el = document.body.querySelector('#movie_player .ytp-chrome-bottom')) {
clearTimeout(timeout);
el.style.opacity = 1;
timeout = setTimeout(() => el.style.removeProperty('opacity'), 1500);
}
});
}
function triggerOnHoverElement({ element = required(), callback = required() }) {
if (!(element instanceof HTMLElement)) return console.error('triggerOnHoverElement:', typeof element);
if (typeof callback !== 'function') return console.error('triggerOnHoverElement callback:', typeof callback);
const isHover = e => e.parentElement.querySelector(':hover') === e;
document.addEventListener('mousemove', function checkHover() {
const hovered = isHover(element);
if (hovered !== checkHover.hovered) {
checkHover.hovered = hovered;
return callback(hovered);
}
});
}
function fixControlFreeze(ms = 2000) {
return setInterval(() => {
if ((NOVA.currentPage === 'watch' || NOVA.currentPage === 'embed')
&& document.visibilityState == 'visible'
&& movie_player.classList.contains('playing-mode')
&& !document.fullscreenElement
) {
movie_player.wakeUpControls();
}
}, ms);
}
},
options: {
player_control_autohide_container: {
_tagName: 'select',
label: 'Hover container',
options: [
{
label: 'player', value: 'player', selected: true,
},
{
label: 'control', value: 'control',
},
],
},
player_control_autohide_show_on_seek: {
_tagName: 'input',
label: 'Show on seeked',
type: 'checkbox',
},
}
});
window.nova_plugins.push({
id: 'player-control-below',
title: 'Control panel below the player',
'title:zh': '控制面板位于播放器下方',
'title:ja': 'プレーヤーの下にあるコントロールパネル',
'title:pl': 'Panel sterowania pod odtwarzaczem',
run_on_pages: 'watch, -mobile',
section: 'control-panel',
_runtime: user_settings => {
NOVA.waitSelector('.ytp-chrome-bottom')
.then(async control_panel => {
if ((heightPanel = NOVA.css.get(control_panel, 'height'))
&& (heightProgressBar = NOVA.css.get('.ytp-progress-bar-container', 'height'))
) {
const height = `calc(${heightPanel} + ${heightProgressBar})` || '51px';
let SELECTOR_CONTAINER = 'ytd-watch-flexy:not([fullscreen])';
if (['force', 'offset'].includes(user_settings.player_full_viewport_mode)) {
SELECTOR_CONTAINER += `:not([theater])`;
}
NOVA.css.push(
`
${SELECTOR_CONTAINER} .caption-window {
margin-bottom: 0;
}
${SELECTOR_CONTAINER} .ytp-gradient-bottom {
transform: translateY(${height});
display: block !important;
opacity: 1 !important;
height: ${height} !important;
padding: 0;
background-color: #0f0f0f; 
}
${SELECTOR_CONTAINER} .ytp-chrome-bottom {
transform: translateY(${height});
opacity: 1 !important;
}
${SELECTOR_CONTAINER} .html5-video-player {
overflow: visible;
}
${SELECTOR_CONTAINER} .ytp-player-content.ytp-iv-player-content {
bottom: ${NOVA.css.get('.ytp-player-content.ytp-iv-player-content', 'left') || '12px'};
}
${SELECTOR_CONTAINER} .ytp-tooltip,
${SELECTOR_CONTAINER} .ytp-settings-menu {
transform: translateY(${height});
}
${SELECTOR_CONTAINER}[theater] > #columns,
${SELECTOR_CONTAINER}:not([theater]) #below {
margin-top: ${height} !important;
}
#ytd-player {
overflow: visible !important;
}
`);
if (user_settings['player-float-progress-bar']) {
NOVA.css.push(
`#movie_player.ytp-autohide .ytp-chrome-bottom .ytp-progress-bar-container {
display: none !important;
}`);
}
fixControlFreeze();
}
});
function fixControlFreeze(ms = 2000) {
if (user_settings.player_hide_elements?.includes('time_display')
|| (user_settings['theater-mode'] && ['force', 'offset'].includes(user_settings.player_full_viewport_mode))
) {
return;
}
return setInterval(() => {
if (user_settings['theater-mode']
&& user_settings.player_full_viewport_mode == 'smart'
&& NOVA.css.get(movie_player, 'z-index') != '2020'
&& NOVA.css.get(movie_player, 'position') != 'fixed'
) {
return;
}
if (NOVA.currentPage == 'watch'
&& document.visibilityState == 'visible'
&& movie_player.classList.contains('playing-mode')
&& !document.fullscreenElement
) {
movie_player.wakeUpControls();
}
}, ms);
}
},
});
window.nova_plugins.push({
id: 'player-hide-elements',
title: 'Hide some player buttons/elements',
'title:zh': '隐藏一些播放器按钮/元素',
'title:ja': '一部のプレーヤーのボタン/要素を非表示にする',
'title:pl': 'Ukryj niektóre przyciski/elementy odtwarzacza',
run_on_pages: 'watch, embed, -mobile',
section: 'control-panel',
_runtime: user_settings => {
const SELECTORS = {
'ambient': '#cinematics-container',
'videowall_endscreen': '.videowall-endscreen',
'card_endscreen': '[class^="ytp-ce-"]',
'watch_later_button': '.ytp-chrome-top-buttons button.ytp-watch-later-button',
'info_button': '.ytp-chrome-top-buttons button.ytp-cards-button',
'prev_button': '.ytp-chrome-bottom .ytp-prev-button',
'play_button': '.ytp-chrome-bottom .ytp-play-button',
'next_button': '.ytp-chrome-bottom .ytp-next-button',
'volume_area': '.ytp-chrome-bottom .ytp-volume-area',
'time_display': '.ytp-chrome-bottom .ytp-time-display'
+ (user_settings['time-remaining'] ? ' span > span:not([id])' : ''),
'time_duration_display': '.ytp-chrome-bottom .ytp-time-duration, .ytp-chrome-bottom .ytp-time-separator',
'chapter_container': '.ytp-chrome-bottom .ytp-chapter-container',
'autonav_toggle_button': '.ytp-chrome-bottom button.ytp-button[data-tooltip-target-id="ytp-autonav-toggle-button"]',
'subtitles_button': '.ytp-chrome-bottom button.ytp-subtitles-button',
'settings_button': '.ytp-chrome-bottom button.ytp-settings-button',
'cast_button': '.ytp-chrome-bottom button.ytp-remote-button',
'size_button': '.ytp-chrome-bottom button.ytp-size-button',
'miniplayer_button': '.ytp-chrome-bottom button.ytp-miniplayer-button',
'logo_button': '.ytp-chrome-bottom .yt-uix-sessionlink',
'fullscreen_button': '.ytp-chrome-bottom button.ytp-fullscreen-button',
'brave_jump_button': '.ytp-chrome-bottom button.ytp-jump-button',
};
const SELECTOR_CONTAINER = '#movie_player';
const toArray = a => Array.isArray(a) ? a : [a];
let list = [];
toArray(user_settings.player_hide_elements)
.forEach(el => (data = SELECTORS[el]) && list.push(`${SELECTOR_CONTAINER} ${data}`));
if (list.length) {
NOVA.css.push(
list.join(',\n') + ` {
display: none !important;
}`);
}
},
options: {
player_hide_elements: {
_tagName: 'select',
label: 'Items',
title: '[Ctrl+Click] to select several',
'title:zh': '[Ctrl+Click] 选择多个',
'title:ja': '「Ctrl+Click」して、いくつかを選択します',
'title:pl': 'Ctrl+kliknięcie, aby zaznaczyć kilka',
multiple: null,
required: true,
size: 10,
options: [
{
label: 'ambient', value: 'ambient',
},
{
label: 'videowall (thumbs)', value: 'videowall_endscreen',
},
{
label: 'card', value: 'card_endscreen',
},
{
label: 'watch-later', value: 'watch_later_button',
},
{
label: 'info (embed)', value: 'info_button',
},
{
label: 'prev', value: 'prev_button',
},
{
label: 'play / stop live', value: 'play_button',
},
{
label: 'next', value: 'next_button',
},
{
label: 'jump (for Brave)', value: 'brave_jump_button',
title: 'Seek backwards/forward 10 seconds'
},
{
label: 'volume', value: 'volume_area',
},
{
label: 'time', value: 'time_display',
},
{
label: 'time duration', value: 'time_duration_display',
},
{
label: 'chapter', value: 'chapter_container',
},
{
label: 'autoplay next', value: 'autonav_toggle_button',
},
{
label: 'subtitles', value: 'subtitles_button',
},
{
label: 'settings', value: 'settings_button',
},
{
label: 'cast', value: 'cast_button',
},
{
label: 'size', value: 'size_button',
},
{
label: 'miniplayer', value: 'miniplayer_button',
},
{
label: 'logo (embed)', value: 'logo_button',
},
{
label: 'fullscreen', value: 'fullscreen_button',
},
],
},
}
});
window.nova_plugins.push({
id: 'player-hotkeys-focused',
title: 'Player shortcuts always active',
'title:zh': '播放器热键始终处于活动状态',
'title:ja': 'プレーヤーのホットキーは常にアクティブです',
'title:pl': 'Klawisze skrótów dla graczy zawsze aktywne',
run_on_pages: 'watch, embed, -mobile',
section: 'control-panel',
_runtime: user_settings => {
document.addEventListener('keyup', evt => {
if (NOVA.currentPage != 'watch' && NOVA.currentPage != 'embed') return;
setPlayerFocus(evt.target);
if (user_settings.hotkeys_disable_numpad && evt.code.startsWith('Numpad')) {
evt.preventDefault();
evt.stopPropagation();
evt.stopImmediatePropagation();
}
});
document.addEventListener('click', evt => evt.isTrusted && setPlayerFocus(evt.target));
function setPlayerFocus(target) {
if (['input', 'textarea', 'select'].includes(target.localName) || target.isContentEditable) return;
movie_player.focus({ preventScroll: true });
}
},
options: {
hotkeys_disable_numpad: {
_tagName: 'input',
label: 'Disable numpad',
type: 'checkbox',
},
}
});
window.nova_plugins.push({
id: 'player-progress-bar-color',
title: 'Player progress bar color',
'title:zh': '播放器进度条颜色',
'title:ja': 'プレーヤーのプログレスバーの色',
'title:pl': 'Kolor paska postępu gracza',
run_on_pages: 'watch, embed, -mobile',
section: 'control-panel',
_runtime: user_settings => {
NOVA.css.push(
`.ytp-swatch-background-color {
background-color: ${user_settings.player_progress_bar_color || '#f00'} !important;
}`);
},
options: {
player_progress_bar_color: {
_tagName: 'input',
type: 'color',
value: '#0089ff',
label: 'Color',
'label:zh': '颜色',
'label:ja': '色',
'label:pl': 'Kolor',
},
}
});
window.nova_plugins.push({
id: 'player-float-progress-bar',
title: 'Float player progress bar',
'title:zh': '浮动播放器进度条',
'title:ja': 'フロートプレーヤーのプログレスバー',
'title:pl': 'Pływający pasek postępu odtwarzacza',
run_on_pages: 'watch, embed, -mobile',
section: 'control-panel',
_runtime: user_settings => {
if (NOVA.currentPage == 'embed') {
if (
document.URL.includes('live_stream')
|| ['0', 'false'].includes(NOVA.queryURL.get('controls'))
) {
return;
}
}
const
SELECTOR_CONTAINER = '#movie_player.ytp-autohide',
SELECTOR_ID = 'nova-player-float-progress-bar',
SELECTOR = '#' + SELECTOR_ID,
CHAPTERS_MARK_WIDTH_PX = '2px',
CHP_JUMP_TOGGLE_CLASS_VALUE = 'nova-chapters-jump-active';
NOVA.waitSelector(`${user_settings['player-control-autohide'] ? '#movie_player' : SELECTOR_CONTAINER} video`)
.then(video => {
const
container = insertFloatBar({
'init_container': movie_player,
'z_index': Math.max(NOVA.css.get('.ytp-chrome-bottom', 'z-index'), 59)
}),
bufferEl = document.getElementById(`${SELECTOR_ID}-buffer`),
progressEl = document.getElementById(`${SELECTOR_ID}-progress`);
renderChapters.init(video);
video.addEventListener('progress', () => container.classList.add('transition'), { capture: true, once: true });
video.addEventListener('loadeddata', resetBar);
document.addEventListener('yt-navigate-finish', resetBar);
video.addEventListener('timeupdate', function () {
if (notInteractiveToRender()) return;
if (!isNaN(this.duration)) {
progressEl.style.transform = `scaleX(${this.currentTime / this.duration})`;
}
});
renderBuffer.apply(video);
video.addEventListener('progress', renderBuffer.bind(video));
video.addEventListener('seeking', renderBuffer.bind(video));
function renderBuffer() {
if (notInteractiveToRender()) return;
if (!isNaN(this.duration) && this.buffered?.length) {
bufferEl.style.transform = `scaleX(${this.buffered.end(this.buffered.length - 1) / this.duration})`;
}
}
function resetBar() {
container.style.display = movie_player.getVideoData().isLive ? 'none' : 'inherit';
container.classList.remove('transition');
bufferEl.style.transform = 'scaleX(0)';
progressEl.style.transform = 'scaleX(0)';
container.classList.add('transition');
renderChapters.init(video);
}
function notInteractiveToRender() {
return (document.visibilityState == 'hidden'
|| movie_player.getVideoData().isLive
);
}
if (user_settings.player_float_progress_bar_hotkey) connectChapterJump();
});
function insertFloatBar({ init_container = movie_player, z_index = 60 }) {
if (!(init_container instanceof HTMLElement)) {
return console.error('vid not HTMLElement:', init_container);
}
return document.getElementById(SELECTOR_ID) || (function () {
init_container.insertAdjacentHTML('beforeend',
`<div id="${SELECTOR_ID}" class="">
<div class="container">
<div id="${SELECTOR_ID}-buffer" class="ytp-load-progress"></div>
<div id="${SELECTOR_ID}-progress" class="ytp-swatch-background-color"></div>
</div>
<div id="${SELECTOR_ID}-chapters"></div>
</div>`);
NOVA.css.push(
`[id|=${SELECTOR_ID}] {
position: absolute;
bottom: 0;
}
${SELECTOR} {
--opacity: ${+user_settings.player_float_progress_bar_opacity || .7};
--height: ${+user_settings.player_float_progress_bar_height || 3}px;
--bg-color: ${NOVA.css.get('.ytp-progress-list', 'background-color') || 'rgba(255,255,255,.2)'};
--zindex: ${z_index};
opacity: var(--opacity);
z-index: var(--zindex);
background-color: var(--bg-color);
width: 100%;
height: var(--height);
visibility: hidden;
}
${SELECTOR_CONTAINER} ${SELECTOR} {
visibility: visible;
}
${SELECTOR_CONTAINER} ${SELECTOR}.transition [id|=${SELECTOR_ID}] {
transition: transform 200ms linear;
}
${SELECTOR}-progress, ${SELECTOR}-buffer {
width: 100%;
height: 100%;
transform-origin: 0 0;
transform: scaleX(0);
}
${SELECTOR}-progress {
z-index: calc(var(--zindex) + 1);
}
${SELECTOR}-chapters {
position: relative;
width: 100%;
display: flex;
justify-content: flex-end;
}
${SELECTOR}-chapters span {
height: var(--height);
z-index: calc(var(--zindex) + 1);
box-sizing: border-box;
padding: 0;
margin: 0;
}
${SELECTOR}-chapters > span:first-child:not([time$="0:00"]), 
${SELECTOR}-chapters > span:not(:first-child) {
border-left: ${CHAPTERS_MARK_WIDTH_PX} solid rgba(255,255,255,.7);
}
${SELECTOR}-chapters > span {
position: relative;
}
${SELECTOR}-chapters > span > span {
position: absolute;
}
.${CHP_JUMP_TOGGLE_CLASS_VALUE} {
visibility: visible !important;
--height: 20px !important;
}
.${CHP_JUMP_TOGGLE_CLASS_VALUE}:not(:hover) {
--bg-color: coral !important;
}
.${CHP_JUMP_TOGGLE_CLASS_VALUE} ${SELECTOR}-chapters span:hover {
border-left: ${CHAPTERS_MARK_WIDTH_PX} solid cornflowerblue !important;
cursor: pointer;
background-color: rgba(255,255,255,.7);
}`);
if (user_settings['player-control-autohide']) {
switch (user_settings.player_control_autohide_container) {
case 'player':
NOVA.css.push(
`${SELECTOR_CONTAINER}:not(:hover) ${SELECTOR} {
visibility: visible !important;
}`);
break;
case 'control':
NOVA.css.push(
`.ytp-chrome-bottom:not(:hover) ~ ${SELECTOR} {
visibility: visible !important;
}`);
break;
}
if (user_settings.player_control_autohide_show_on_seek) {
NOVA.css.push(
`[style*="opacity: 1"] ~ ${SELECTOR} {
visibility: hidden !important;
}`);
}
}
return document.getElementById(SELECTOR_ID);
})();
}
function connectChapterJump() {
let hotkeyActivated;
document.addEventListener('keydown', showChapterSwitch);
document.addEventListener('keyup', showChapterSwitch);
function showChapterSwitch(evt) {
if (NOVA.currentPage != 'watch' && NOVA.currentPage != 'embed') return;
if (['input', 'textarea', 'select'].includes(evt.target.localName) || evt.target.isContentEditable) return;
if ((el = document.getElementById(SELECTOR_ID))
&& el.querySelector('span[time]')
) {
switch (evt.type) {
case 'keydown':
const hotkey = user_settings.player_float_progress_bar_hotkey.length === 1 ? evt.key : evt.code;
if (user_settings.player_float_progress_bar_hotkey == hotkey && !hotkeyActivated) {
el.classList.add(CHP_JUMP_TOGGLE_CLASS_VALUE);
hotkeyActivated = true;
}
break;
case 'keyup':
if (hotkeyActivated) {
hotkeyActivated = false;
el.classList.remove(CHP_JUMP_TOGGLE_CLASS_VALUE);
}
break;
}
}
}
document.getElementById(SELECTOR_ID)
.addEventListener('click', ({ target }) => {
if (!(secTime = target.getAttribute('time'))) return;
const sec = NOVA.formatTimeOut.hmsToSec(secTime);
if (typeof movie_player.seekBy === 'function') {
movie_player.seekTo(sec);
}
else if (NOVA.videoElement) {
NOVA.videoElement.currentTime = sec;
}
}, { capture: true });
}
const renderChapters = {
async init(vid) {
if (NOVA.currentPage == 'watch' && !(vid instanceof HTMLElement)) {
return console.error('vid not HTMLElement:', chaptersContainer);
}
await NOVA.waitUntil(() => !isNaN(vid.duration), 1000);
switch (NOVA.currentPage) {
case 'watch':
this.from_description(vid.duration);
break;
case 'embed':
let chaptersContainer;
await NOVA.waitUntil(() => (
chaptersContainer = document.body.querySelector('.ytp-chapters-container'))
&& chaptersContainer?.children.length > 1
, 1000);
this.renderChaptersMarkers(vid.duration) || this.from_div(chaptersContainer);
break;
}
},
from_description(duration = required()) {
if (isNaN(duration)) return console.error('duration isNaN:', duration);
if (Math.sign(duration) !== 1) return console.error('duration not positive number:', duration);
const selectorTimestampLink = 'a[href*="&t="]';
NOVA.waitSelector(`ytd-watch-metadata #description.ytd-watch-metadata ${selectorTimestampLink}`, { destroy_after_page_leaving: true })
.then(() => this.renderChaptersMarkers(duration));
NOVA.waitSelector(`#comments #comment #comment-content ${selectorTimestampLink}`, { destroy_after_page_leaving: true })
.then(() => {
if (document.body.querySelector(`${SELECTOR}-chapters > span[time]`)) return;
this.renderChaptersMarkers(duration);
});
},
from_div(chaptersContainer = required()) {
if (!(chaptersContainer instanceof HTMLElement)) return console.error('container not HTMLElement:', chaptersContainer);
const
progressContainerWidth = parseInt(getComputedStyle(chaptersContainer).width),
chaptersOut = document.getElementById(`${SELECTOR_ID}-chapters`);
for (const chapter of chaptersContainer.children) {
const
newChapter = document.createElement('span'),
{ width, marginLeft, marginRight } = getComputedStyle(chapter),
chapterMargin = parseInt(marginLeft) + parseInt(marginRight);
newChapter.style.width = ((parseInt(width) + chapterMargin) * 100 / progressContainerWidth) + '%';
chaptersOut.append(newChapter);
}
},
renderChaptersMarkers(duration = required()) {
if (isNaN(duration)) return console.error('duration isNaN:', duration);
if (chaptersContainer = document.getElementById(`${SELECTOR_ID}-chapters`)) {
chaptersContainer.innerHTML = '';
}
const chapterList = NOVA.getChapterList(duration);
chapterList
?.forEach((chapter, i, chapters_list) => {
const newChapter = document.createElement('span');
const nextChapterSec = chapters_list[i + 1]?.sec || duration;
newChapter.style.width = ((nextChapterSec - chapter.sec) * 100 / duration) + '%';
if (chapter.title) newChapter.title = chapter.title;
newChapter.setAttribute('time', chapter.time);
chaptersContainer && chaptersContainer.append(newChapter);
});
return chapterList;
},
};
},
options: {
player_float_progress_bar_height: {
_tagName: 'input',
label: 'Height',
'label:zh': '高度',
'label:ja': '身長',
'label:pl': 'Wysokość',
type: 'number',
title: 'in pixels',
placeholder: 'px',
min: 1,
max: 9,
value: 3,
},
player_float_progress_bar_opacity: {
_tagName: 'input',
label: 'Opacity',
'label:zh': '不透明度',
'label:ja': '不透明度',
'label:pl': 'Przejrzystość',
type: 'number',
placeholder: '0-1',
step: .05,
min: 0,
max: 1,
value: .7,
},
player_float_progress_bar_hotkey: {
_tagName: 'select',
label: 'Hotkey to chapters jump (by click)',
'label:zh': '章节跳转热键（点击）',
'label:ja': '章にジャンプするホットキー (クリックによる)',
options: [
{ label: 'none', },
{ label: 'ShiftL', value: 'ShiftLeft' },
{ label: 'ShiftR', value: 'ShiftRight' },
{ label: 'CtrlL', value: 'ControlLeft' },
{ label: 'CtrlR', value: 'ControlRight' },
{ label: 'AltL', value: 'AltLeft' },
{ label: 'AltR', value: 'AltRight' },
{ label: 'A', value: 'KeyA' },
{ label: 'B', value: 'KeyB' },
{ label: 'C', value: 'KeyC' },
{ label: 'D', value: 'KeyD' },
{ label: 'E', value: 'KeyE' },
{ label: 'F', value: 'KeyF' },
{ label: 'G', value: 'KeyG' },
{ label: 'H', value: 'KeyH' },
{ label: 'I', value: 'KeyI' },
{ label: 'J', value: 'KeyJ' },
{ label: 'K', value: 'KeyK' },
{ label: 'L', value: 'KeyL' },
{ label: 'M', value: 'KeyM' },
{ label: 'N', value: 'KeyN' },
{ label: 'O', value: 'KeyO' },
{ label: 'P', value: 'KeyP' },
{ label: 'Q', value: 'KeyQ' },
{ label: 'R', value: 'KeyR' },
{ label: 'S', value: 'KeyS' },
{ label: 'T', value: 'KeyT' },
{ label: 'U', value: 'KeyU' },
{ label: 'V', value: 'KeyV' },
{ label: 'W', value: 'KeyW' },
{ label: 'X', value: 'KeyX' },
{ label: 'Y', value: 'KeyY' },
{ label: 'Z', value: 'KeyZ' },
0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
']', '[', '+', '-', ',', '.', '/', '<', ';', '\\',
],
},
}
});
window.nova_plugins.push({
id: 'player-quick-buttons',
title: 'Add custom player buttons',
'title:zh': 'カスタム プレーヤー ボタンを追加する',
'title:ja': 'カスタム プレーヤー ボタンを追加する',
'title:pl': 'Dodaj własne przyciski odtwarzacza',
run_on_pages: 'watch, embed, -mobile',
section: 'control-panel',
_runtime: user_settings => {
const
SELECTOR_BTN_CLASS_NAME = 'nova-right-custom-button',
SELECTOR_BTN = '.' + SELECTOR_BTN_CLASS_NAME;
NOVA.waitSelector('#movie_player .ytp-right-controls')
.then(async container => {
NOVA.videoElement = await NOVA.waitSelector('video');
NOVA.css.push(
`${SELECTOR_BTN} {
user-select: none;
}
${SELECTOR_BTN}:hover { color: #66afe9 !important; }
${SELECTOR_BTN}:active { color: #2196f3 !important; }`);
NOVA.css.push(
`${SELECTOR_BTN}[tooltip]:hover::before {
content: attr(tooltip);
position: absolute;
top: -3em;
transform: translateX(-30%);
line-height: normal;
background-color: rgba(28,28,28,.9);
border-radius: .3em;
padding: 5px 9px;
color: white;
font-weight: bold;
white-space: nowrap;
}
html[data-cast-api-enabled] ${SELECTOR_BTN}[tooltip]:hover::before {
font-weight: normal;
}`);
if (user_settings.player_buttons_custom_items?.includes('picture-in-picture')) {
const pipBtn = document.createElement('button');
pipBtn.className = `ytp-button ${SELECTOR_BTN_CLASS_NAME}`;
pipBtn.setAttribute('tooltip', 'Picture in Picture (PiP)');
pipBtn.innerHTML = createSVG();
pipBtn.addEventListener('click', () => document.pictureInPictureElement
? document.exitPictureInPicture() : NOVA.videoElement.requestPictureInPicture()
);
container.prepend(pipBtn);
NOVA.videoElement?.addEventListener('enterpictureinpicture', () => pipBtn.innerHTML = createSVG(2));
NOVA.videoElement?.addEventListener('leavepictureinpicture', () => pipBtn.innerHTML = createSVG());
function createSVG(alt) {
const svg = document.createElement('svg');
svg.setAttribute('width', '100%');
svg.setAttribute('height', '100%');
svg.setAttribute('viewBox', '-8 -6 36 36');
const path = document.createElement('path');
path.setAttribute('fill', 'currentColor');
path.setAttribute('d', alt
? 'M18.5,11H18v1h.5A1.5,1.5,0,0,1,20,13.5v5A1.5,1.5,0,0,1,18.5,20h-8A1.5,1.5,0,0,1,9,18.5V18H8v.5A2.5,2.5,0,0,0,10.5,21h8A2.5,2.5,0,0,0,21,18.5v-5A2.5,2.5,0,0,0,18.5,11Z M14.5,4H2.5A2.5,2.5,0,0,0,0,6.5v8A2.5,2.5,0,0,0,2.5,17h12A2.5,2.5,0,0,0,17,14.5v-8A2.5,2.5,0,0,0,14.5,4Z'
: 'M2.5,17A1.5,1.5,0,0,1,1,15.5v-9A1.5,1.5,0,0,1,2.5,5h13A1.5,1.5,0,0,1,17,6.5V10h1V6.5A2.5,2.5,0,0,0,15.5,4H2.5A2.5,2.5,0,0,0,0,6.5v9A2.5,2.5,0,0,0,2.5,18H7V17Z M18.5,11h-8A2.5,2.5,0,0,0,8,13.5v5A2.5,2.5,0,0,0,10.5,21h8A2.5,2.5,0,0,0,21,18.5v-5A2.5,2.5,0,0,0,18.5,11Z');
svg.append(path);
return svg.outerHTML;
}
}
if (user_settings.player_buttons_custom_items?.indexOf('popup') !== -1 && !NOVA.queryURL.has('popup')) {
const popupBtn = document.createElement('button');
popupBtn.className = `ytp-button ${SELECTOR_BTN_CLASS_NAME}`;
popupBtn.setAttribute('tooltip', 'Open in popup');
popupBtn.innerHTML =
`<svg viewBox="-8 -8 36 36" height="100%" width="100%">
<g fill="currentColor">
<path d="M18 2H6v4H2v12h12v-4h4V2z M12 16H4V8h2v6h6V16z M16 12h-2h-2H8V8V6V4h8V12z" />
</g>
</svg>`;
popupBtn.addEventListener('click', () => {
const { width, height } = NOVA.aspectRatio.sizeToFit({
'srcWidth': NOVA.videoElement.videoWidth,
'srcHeight': NOVA.videoElement.videoHeight,
});
url = new URL(
document.head.querySelector('link[itemprop="embedUrl"][href]')?.href
|| (location.origin + '/embed/' + movie_player.getVideoData().video_id)
);
if (currentTime = Math.trunc(NOVA.videoElement?.currentTime)) url.searchParams.set('start', currentTime);
url.searchParams.set('autoplay', 1);
url.searchParams.set('popup', true);
NOVA.openPopup({ 'url': url.href, 'width': width, 'height': height });
});
container.prepend(popupBtn);
}
if (user_settings.player_buttons_custom_items?.includes('screenshot')) {
const
SELECTOR_SCREENSHOT_ID = 'nova-screenshot-result',
SELECTOR_SCREENSHOT = '#' + SELECTOR_SCREENSHOT_ID;
NOVA.css.push(
SELECTOR_SCREENSHOT + ` {
--width: 400px;
--height: 400px;
position: fixed;
top: 0;
right: 0;
overflow: hidden;
margin: 36px 30px; 
box-shadow: 0 0 15px black;
max-width: var(--width);
max-height: var(--height);
}
${SELECTOR_SCREENSHOT} canvas {
max-width: var(--width);
max-height: var(--height);
}
${SELECTOR_SCREENSHOT} .close-btn {
position: absolute;
bottom: 0;
right: 0;
background-color: rgba(0, 0, 0, .5);
color: white;
cursor: pointer;
font-size: 12px;
display: grid;
height: 100%;
width: 25%;
}
${SELECTOR_SCREENSHOT} .close-btn:hover { background-color: rgba(0, 0, 0, .65); }
${SELECTOR_SCREENSHOT} .close-btn > * { margin: auto; }`);
const screenshotBtn = document.createElement('button');
screenshotBtn.className = `ytp-button ${SELECTOR_BTN_CLASS_NAME}`;
screenshotBtn.setAttribute('tooltip', 'Take screenshot');
screenshotBtn.innerHTML =
`<svg viewBox="0 -166 512 860" height="100%" width="100%">
<g fill="currentColor">
<circle cx="255.811" cy="285.309" r="75.217" />
<path d="M477,137H352.718L349,108c0-16.568-13.432-30-30-30H191c-16.568,0-30,13.432-30,30l-3.718,29H34 c-11.046,0-20,8.454-20,19.5v258c0,11.046,8.954,20.5,20,20.5h443c11.046,0,20-9.454,20-20.5v-258C497,145.454,488.046,137,477,137 z M255.595,408.562c-67.928,0-122.994-55.066-122.994-122.993c0-67.928,55.066-122.994,122.994-122.994 c67.928,0,122.994,55.066,122.994,122.994C378.589,353.495,323.523,408.562,255.595,408.562z M474,190H369v-31h105V190z" />
</g>
</svg>`;
screenshotBtn.addEventListener('click', () => {
const
container = document.getElementById(SELECTOR_SCREENSHOT_ID) || document.createElement('a'),
canvas = container.querySelector('canvas') || document.createElement('canvas'),
context = canvas.getContext('2d'),
mime = `image/${user_settings.player_buttons_custom_screenshot || 'png'}`;
canvas.width = NOVA.videoElement.videoWidth;
canvas.height = NOVA.videoElement.videoHeight;
context.drawImage(NOVA.videoElement, 0, 0, canvas.width, canvas.height);
canvas.title = 'Click to save';
if (textString = document.body.querySelector('.caption-window')?.innerText) {
context.font = `bold ${Math.trunc(canvas.height * .05)}px Arial`;
context.textAlign = 'buttom';
context.textBaseline = 'middle';
context.fillStyle = user_settings.player_buttons_custom_screenshot_subtitle_color || 'white';
context.strokeStyle = user_settings.player_buttons_custom_screenshot_subtitle_shadow_color || 'black';
context.lineWidth = canvas.height / 1000;
let h = canvas.height * .9;
textString
.split('\n')
.forEach((text, i) => {
const
metrics = context.measureText(text),
lineHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent,
textWidth = context.measureText(text).width,
w = (canvas.width / 2) - (textWidth / 2);
context.fillText(text, w, h);
context.strokeText(text, w, h);
h += lineHeight;
});
}
try {
canvas.toBlob(blob => {
container.href = URL.createObjectURL(blob);
if (user_settings.player_buttons_custom_screenshot_to_clipboard && navigator.clipboard?.write) {
navigator.clipboard.write([new ClipboardItem({ [mime]: blob })]);
}
}, mime);
} catch (error) {
}
if (user_settings.player_buttons_custom_screenshot_to_clipboard && navigator.clipboard?.write) {
return NOVA.showOSD('Screenshot copied to clipboard');
}
if (!container.id) {
container.id = SELECTOR_SCREENSHOT_ID;
container.target = '_blank';
if (headerContainer = document.getElementById('masthead-container')) {
container.style.marginTop = (headerContainer?.offsetHeight || 0) + 'px';
container.style.zIndex = +getComputedStyle(headerContainer)['z-index'] + 1;
}
canvas.addEventListener('click', evt => {
evt.preventDefault();
downloadCanvasAsImage(evt.target, mime);
container.remove();
}, { capture: true });
container.append(canvas);
const close = document.createElement('a');
close.className = 'close-btn';
close.innerHTML = '<span>CLOSE</span>';
close.title = 'Close';
close.addEventListener('click', evt => {
evt.preventDefault();
container.remove();
});
container.append(close);
document.body.append(container);
}
});
function downloadCanvasAsImage(canvas, mime = 'image/png') {
const
downloadLink = document.createElement('a'),
downloadFileName =
[
movie_player.getVideoData().title
.replace(/[\\/:*?"<>|]+/g, '')
.replace(/\s+/g, ' ').trim(),
(time = NOVA.formatTimeOut.HMS.abbr(NOVA.videoElement.currentTime)) ? `(${time})` : '',
]
.join(' ');
downloadLink.href = canvas.toDataURL(mime).replace(mime, 'image/octet-stream');
downloadLink.download = `${downloadFileName}.${user_settings.player_buttons_custom_screenshot || 'png'}`
downloadLink.click();
}
container.prepend(screenshotBtn);
}
if (user_settings.player_buttons_custom_items?.includes('thumbnail')) {
const thumbBtn = document.createElement('button');
thumbBtn.className = `ytp-button ${SELECTOR_BTN_CLASS_NAME}`;
thumbBtn.setAttribute('tooltip', 'View Thumbnail');
thumbBtn.innerHTML =
`<svg viewBox="0 -10 21 40" height="100%" width="100%">
<g fill="currentColor">
<circle cx='8' cy='7.2' r='2'/>
<path d='M0 2v16h20V2H0z M18 16H2V4h16V16z'/>
<polygon points='17 10.9 14 7.9 9 12.9 6 9.9 3 12.9 3 15 17 15' />
</g>
</svg>`;
thumbBtn.addEventListener('click', async () => {
const
videoId = NOVA.queryURL.get('v') || movie_player.getVideoData().video_id,
thumbsSizesTemplate = [
'maxres',
'sd',
'hq',
'mq',
''
];
document.body.style.cursor = 'wait';
for (const resPrefix of thumbsSizesTemplate) {
const
imgUrl = `https://i.ytimg.com/vi/${videoId}/${resPrefix}default.jpg`,
response = await fetch(imgUrl);
if (response.status === 200) {
const imageBlob = await response.blob();
const img = new Image();
img.src = URL.createObjectURL(imageBlob);
img.addEventListener('load', () => {
NOVA.openPopup({
'url': imgUrl,
'width': img.width,
'height': img.height,
});
});
document.body.style.removeProperty('cursor');
break;
}
}
});
container.prepend(thumbBtn);
}
if (user_settings.player_buttons_custom_items?.includes('rotate')) {
const
hotkey = user_settings.player_buttons_custom_hotkey_rotate || 'KeyR',
rotateBtn = document.createElement('button');
rotateBtn.className = `ytp-button ${SELECTOR_BTN_CLASS_NAME}`;
rotateBtn.setAttribute('tooltip', `Rotate video (${hotkey.replace('Key', '')})`);
rotateBtn.style.cssText = 'padding: 0 1.1em;';
rotateBtn.innerHTML =
`<svg viewBox="0 0 1536 1536" height="100%" width="100%">
<g fill="currentColor">
<path
d="M1536 128v448q0 26-19 45t-45 19h-448q-42 0-59-40-17-39 14-69l138-138Q969 256 768 256q-104 0-198.5 40.5T406 406 296.5 569.5 256 768t40.5 198.5T406 1130t163.5 109.5T768 1280q119 0 225-52t179-147q7-10 23-12 14 0 25 9l137 138q9 8 9.5 20.5t-7.5 22.5q-109 132-264 204.5T768 1536q-156 0-298-61t-245-164-164-245T0 768t61-298 164-245T470 61 768 0q147 0 284.5 55.5T1297 212l130-129q29-31 70-14 39 17 39 59z"/>
</path>
</g>
</svg>`;
rotateBtn.addEventListener('click', rotateVideo);
document.addEventListener('keyup', evt => {
if (NOVA.currentPage != 'watch' && NOVA.currentPage != 'embed') return;
if (['input', 'textarea', 'select'].includes(evt.target.localName) || evt.target.isContentEditable) return;
if (evt.ctrlKey || evt.altKey || evt.shiftKey || evt.metaKey) return;
if ((hotkey.length === 1 ? evt.key : evt.code) === hotkey) {
rotateVideo();
}
});
function rotateVideo() {
let angle = NOVA.extractAsNum.int(NOVA.videoElement.style.transform) || 0;
const scale = (angle === 0 || angle === 180) ? movie_player.clientHeight / NOVA.videoElement.clientWidth : 1;
angle += 90;
NOVA.videoElement.style.transform = (angle === 360) ? '' : `rotate(${angle}deg) scale(${scale})`;
}
container.prepend(rotateBtn);
}
if (user_settings.player_buttons_custom_items?.includes('aspect-ratio')) {
const
aspectRatioBtn = document.createElement('a'),
aspectRatioList = [
{ '16:9': 'scaleX(1.3333)' },
{ '4:3': 'scaleX(.75)' },
{ '9:16': 'scaleX(1.777777778)' },
{ '21:9': 'scaleY(.7168)' },
{ 'default': 'scale(1)' },
,],
genTooltip = (key = 0) => `next ` + Object.keys(aspectRatioList[key]);
aspectRatioBtn.className = `ytp-button ${SELECTOR_BTN_CLASS_NAME}`;
aspectRatioBtn.style.textAlign = 'center';
aspectRatioBtn.style.fontWeight = 'bold';
aspectRatioBtn.setAttribute('tooltip', genTooltip());
aspectRatioBtn.innerHTML = 'default';
aspectRatioBtn.addEventListener('click', () => {
if (!NOVA.videoElement) return;
const getNextIdx = () => (this.listIdx < aspectRatioList.length - 1) ? this.listIdx + 1 : 0;
this.listIdx = getNextIdx();
NOVA.videoElement.style.transform = Object.values(aspectRatioList[this.listIdx]);
aspectRatioBtn.setAttribute('tooltip', genTooltip(getNextIdx()));
aspectRatioBtn.textContent = Object.keys(aspectRatioList[this.listIdx]);
});
container.prepend(aspectRatioBtn);
}
if (user_settings.player_buttons_custom_items?.includes('watch-later')) {
NOVA.waitSelector('.ytp-watch-later-button')
.then(watchLaterDefault => {
NOVA.css.push(
`.${SELECTOR_BTN_CLASS_NAME} .ytp-spinner-container {
position: relative;
top: 0;
left: 0;
scale: .5;
margin: 0;
}
.${SELECTOR_BTN_CLASS_NAME}.watch-later-btn svg {
scale: .85;
}`);
const watchLaterBtn = document.createElement('button');
watchLaterBtn.className = `ytp-button ${SELECTOR_BTN_CLASS_NAME} watch-later-btn`;
watchLaterBtn.setAttribute('tooltip', 'Watch later');
renderIcon();
watchLaterBtn.addEventListener('click', () => {
watchLaterDefault.click();
renderIcon();
const waitStatus = setInterval(() => {
if (watchLaterDefault.querySelector('svg')) {
clearInterval(waitStatus);
renderIcon();
}
}, 100);
});
[...document.getElementsByClassName(SELECTOR_BTN_CLASS_NAME)].pop()
?.after(watchLaterBtn);
function renderIcon() {
watchLaterBtn.innerHTML = watchLaterDefault.querySelector('.ytp-watch-later-icon')?.innerHTML;
}
});
}
if (user_settings.player_buttons_custom_items?.includes('card-switch')
&& !user_settings.player_hide_elements?.includes('videowall_endscreen')
&& !user_settings.player_hide_elements?.includes('card_endscreen')
) {
const
cardAttrName = 'nova-hide-endscreen',
cardBtn = document.createElement('button');
NOVA.css.push(
`#movie_player[${cardAttrName}] .videowall-endscreen,
#movie_player[${cardAttrName}] .ytp-pause-overlay,
#movie_player[${cardAttrName}] [class^="ytp-ce-"] {
display: none !important;
}`);
cardBtn.className = `ytp-button ${SELECTOR_BTN_CLASS_NAME}`;
cardBtn.innerHTML = createSVG();
if (user_settings.player_buttons_custom_card_switch) {
switchState(movie_player.toggleAttribute(cardAttrName));
}
cardBtn.addEventListener('click', () => switchState(movie_player.toggleAttribute(cardAttrName)));
function switchState(state = required()) {
cardBtn.innerHTML = createSVG(state);
cardBtn.setAttribute('tooltip', `The cards are currently ${state ? 'hidden' : 'showing'}`);
}
function createSVG(alt) {
const svg = document.createElement('svg');
svg.setAttribute('width', '100%');
svg.setAttribute('height', '100%');
svg.setAttribute('viewBox', '-200 0 912 512');
const g = document.createElement('g');
g.setAttribute('fill', 'currentColor');
g.innerHTML = alt
? '<path d="M 409 57.104 C 407.625 57.641, 390.907 73.653, 371.848 92.687 L 337.196 127.293 323.848 120.738 C 301.086 109.561, 283.832 103.994, 265.679 101.969 C 217.447 96.591, 148.112 134.037, 59.026 213.577 C 40.229 230.361, 4.759 265.510, 2.089 270 C -0.440 274.252, -0.674 281.777, 1.575 286.516 C 4.724 293.153, 67.054 352.112, 89.003 369.217 L 92.490 371.934 63.330 401.217 C 37.873 426.781, 34.079 430.988, 33.456 434.346 C 31.901 442.720, 38.176 452.474, 46.775 455.051 C 56.308 457.907, 41.359 471.974, 244.317 269.173 C 350.152 163.421, 429.960 82.914, 431.067 80.790 C 436.940 69.517, 428.155 55.840, 415.185 56.063 C 413.158 56.098, 410.375 56.566, 409 57.104 M 245.500 137.101 C 229.456 139.393, 201.143 151.606, 177.500 166.433 C 151.339 182.839, 120.778 206.171, 89.574 233.561 C 72.301 248.723, 42 277.649, 42 278.977 C 42 280.637, 88.281 323.114, 108.367 339.890 L 117.215 347.279 139.209 325.285 L 161.203 303.292 159.601 293.970 C 157.611 282.383, 157.570 272.724, 159.465 261.881 C 165.856 225.304, 193.011 195.349, 229.712 184.389 C 241.299 180.929, 261.648 179.996, 272.998 182.405 L 280.496 183.996 295.840 168.652 L 311.183 153.309 303.342 149.583 C 292.100 144.242, 277.007 139.186, 267.205 137.476 C 257.962 135.865, 254.565 135.806, 245.500 137.101 M 377.500 163.164 C 374.231 164.968, 369.928 169.297, 368.295 172.423 C 366.203 176.431, 366.351 184.093, 368.593 187.889 C 369.597 189.587, 375.944 195.270, 382.699 200.516 C 406.787 219.226, 444.129 252.203, 462.500 270.989 L 470.500 279.170 459 290.204 C 374.767 371.030, 302.827 418.200, 259.963 420.709 C 239.260 421.921, 213.738 412.918, 179.575 392.352 C 167.857 385.298, 166.164 384.571, 161.448 384.571 C 154.702 384.571, 149.091 388.115, 146.121 394.250 C 143.531 399.600, 143.472 403.260, 145.890 408.500 C 148.270 413.656, 150.468 415.571, 162 422.535 C 198.520 444.590, 230.555 455.992, 256 455.992 C 305.062 455.992, 376.663 414.097, 462 335.458 C 483.584 315.567, 509.652 289.051, 510.931 285.685 C 512.694 281.042, 512.218 273.876, 509.889 270 C 507.494 266.017, 484.252 242.741, 463.509 223.552 C 437.964 199.922, 398.967 167.566, 391.300 163.639 C 387.656 161.773, 380.470 161.526, 377.500 163.164 M 235.651 219.459 C 231.884 220.788, 226.369 223.351, 223.395 225.153 C 216.405 229.389, 206.759 239.019, 202.502 246.010 C 198.959 251.828, 193.677 266.197, 194.194 268.611 C 194.372 269.437, 205.637 258.890, 220.993 243.519 C 249.683 214.801, 249.910 214.427, 235.651 219.459 M 316.962 223.250 C 313.710 224.890, 311.876 226.720, 310.200 230 C 307.188 235.893, 307.781 240.006, 313.805 255 C 317.867 265.109, 318.470 267.589, 318.790 275.500 C 319.554 294.378, 313.786 309.236, 300.522 322.557 C 287.282 335.854, 274.164 341.408, 256 341.408 C 244.216 341.408, 238.392 340.027, 226.837 334.489 C 214.541 328.596, 204.996 330.563, 200.250 339.966 C 191.301 357.697, 210.339 372.220, 247.484 375.998 C 301.141 381.456, 350.063 339.760, 353.664 285.500 C 354.618 271.136, 351.039 249.928, 345.577 237.579 C 342.933 231.601, 337.061 224.600, 332.875 222.435 C 328.782 220.319, 322.095 220.661, 316.962 223.250" fill-rule="evenodd" />'
: `<path d="M 377.5 163.164 C 374.231 164.968 375.944 195.27 382.699 200.516 C 406.787 219.226 444.129 252.203 462.5 270.989 L 470.5 279.17 L 459 290.204 C 374.767 371.03 302.827 418.2 259.963 420.709 C 239.26 421.921 213.738 412.918 179.575 392.352 C 167.857 385.298 166.164 384.571 161.448 384.571 C 154.702 384.571 149.091 388.115 146.121 394.25 C 143.531 399.6 143.472 403.26 145.89 408.5 C 148.27 413.656 150.468 415.571 162 422.535 C 198.52 444.59 230.555 455.992 256 455.992 C 305.062 455.992 376.663 414.097 462 335.458 C 483.584 315.567 509.652 289.051 510.931 285.685 C 512.694 281.042 512.218 273.876 509.889 270 C 507.494 266.017 484.252 242.741 463.509 223.552 C 437.964 199.922 398.967 167.566 391.3 163.639 C 387.656 161.773 380.47 161.526 377.5 163.164 M 316.962 223.25 C 313.71 224.89 311.876 226.72 310.2 230 C 307.188 235.893 307.781 240.006 313.805 255 C 317.867 265.109 318.47 267.589 318.79 275.5 C 319.554 294.378 313.786 309.236 300.522 322.557 C 287.282 335.854 274.164 341.408 256 341.408 C 244.216 341.408 238.392 340.027 226.837 334.489 C 214.541 328.596 204.996 330.563 200.25 339.966 C 191.301 357.697 210.339 372.22 247.484 375.998 C 301.141 381.456 350.063 339.76 353.664 285.5 C 354.618 271.136 351.039 249.928 345.577 237.579 C 342.933 231.601 337.061 224.6 332.875 222.435 C 328.782 220.319 322.095 220.661 316.962 223.25"></path>
<path d="M 377.487 163.483 C 374.218 165.287 369.915 169.616 368.282 172.742 C 366.19 176.75 366.338 184.412 368.58 188.208 C 369.584 189.906 375.931 195.589 382.686 200.835 C 406.774 219.545 444.116 252.522 462.487 271.308 L 470.487 279.489 L 458.987 290.523 C 374.754 371.349 302.814 418.519 259.95 421.028 C 239.247 422.24 213.725 413.237 179.562 392.671 C 167.844 385.617 166.151 384.89 161.435 384.89 C 154.689 384.89 149.078 388.434 146.108 394.569 C 143.518 399.919 143.459 403.579 145.877 408.819 C 148.257 413.975 150.455 415.89 161.987 422.854 C 198.507 444.909 230.542 456.311 255.987 456.311 C 305.049 456.311 376.65 414.416 461.987 335.777 C 483.571 315.886 509.639 289.37 510.918 286.004 C 512.681 281.361 512.205 274.195 509.876 270.319 C 507.481 266.336 484.239 243.06 463.496 223.871 C 437.951 200.241 398.954 167.885 391.287 163.958 C 387.643 162.092 380.457 161.845 377.487 163.483 M 316.949 223.569 C 313.697 225.209 311.863 227.039 310.187 230.319 C 307.175 236.212 307.768 240.325 313.792 255.319 C 317.854 265.428 318.457 267.908 318.777 275.819 C 319.541 294.697 313.773 309.555 300.509 322.876 C 287.269 336.173 274.151 341.727 255.987 341.727 C 244.203 341.727 238.379 340.346 226.824 334.808 C 214.528 328.915 204.983 330.882 200.237 340.285 C 191.288 358.016 210.326 372.539 247.471 376.317 C 301.128 381.775 350.05 340.079 353.651 285.819 C 354.605 271.455 351.026 250.247 345.564 237.898 C 342.92 231.92 337.048 224.919 332.862 222.754 C 328.769 220.638 322.082 220.98 316.949 223.569" transform="matrix(-1, 0, 0, -1, 512.000305, 558.092285)"></path>`;
svg.append(g);
return svg.outerHTML;
}
container.prepend(cardBtn);
}
if (user_settings.player_buttons_custom_items?.includes('quick-quality')) {
const
SELECTOR_QUALITY_CLASS_NAME = 'nova-quick-quality',
SELECTOR_QUALITY = '.' + SELECTOR_QUALITY_CLASS_NAME,
qualityContainerBtn = document.createElement('a'),
SELECTOR_QUALITY_LIST_ID = SELECTOR_QUALITY_CLASS_NAME + '-list',
SELECTOR_QUALITY_LIST = '#' + SELECTOR_QUALITY_LIST_ID,
listQuality = document.createElement('ul'),
SELECTOR_QUALITY_TITLE_ID = SELECTOR_QUALITY_CLASS_NAME + '-title',
qualitySpan = document.createElement('span'),
qualityFormatList = {
highres: { label: '4320p', badge: '8K' },
hd2880: { label: '2880p', badge: '5K' },
hd2160: { label: '2160p', badge: '4K' },
hd1440: { label: '1440p', badge: 'QHD' },
hd1080: { label: '1080p', badge: 'FHD' },
hd720: { label: '720p', badge: 'ᴴᴰ' },
large: { label: '480p' },
medium: { label: '360p' },
small: { label: '240p' },
tiny: { label: '144p' },
auto: { label: 'auto' },
};
NOVA.css.push(
SELECTOR_QUALITY + ` {
overflow: visible !important;
position: relative;
text-align: center !important;
vertical-align: top;
font-weight: bold;
}
${SELECTOR_QUALITY_LIST} {
position: absolute;
bottom: 2.5em !important;
left: -2.2em;
list-style: none;
padding-bottom: 1.5em !important;
z-index: ${1 + Math.max(NOVA.css.get('.ytp-progress-bar', 'z-index'), 31)};
}
html[data-cast-api-enabled] ${SELECTOR_QUALITY_LIST} {
margin: 0;
padding: 0;
bottom: 3.3em;
}
.ytp-big-mode .ytp-menuitem-toggle-checkbox {
width: 3.5em;
height: 1.6em;
}
${SELECTOR_QUALITY}:not(:hover) ${SELECTOR_QUALITY_LIST} {
display: none;
}
${SELECTOR_QUALITY_LIST} li {
cursor: pointer;
white-space: nowrap;
line-height: 1.4;
background-color: rgba(28, 28, 28, 0.9);
margin: .3em 0;
padding: .5em 3em;
border-radius: .3em;
color: white;
}
${SELECTOR_QUALITY_LIST} li .quality-menu-item-label-badge {
position: absolute;
right: 1em;
width: 1.7em;
}
${SELECTOR_QUALITY_LIST} li.active { background-color: #720000; }
${SELECTOR_QUALITY_LIST} li.disable { color: #666; }
${SELECTOR_QUALITY_LIST} li:hover:not(.active) { background-color: #c00; }`);
qualityContainerBtn.className = `ytp-button ${SELECTOR_BTN_CLASS_NAME} ${SELECTOR_QUALITY_CLASS_NAME}`;
qualitySpan.id = SELECTOR_QUALITY_TITLE_ID;
qualitySpan.textContent = qualityFormatList[movie_player.getPlaybackQuality()]?.label || '[N/A]'
listQuality.id = SELECTOR_QUALITY_LIST_ID;
movie_player.addEventListener('onPlaybackQualityChange', quality => {
document.getElementById(SELECTOR_QUALITY_TITLE_ID)
.textContent = qualityFormatList[quality]?.label || '[N/A]'
});
qualityContainerBtn.prepend(qualitySpan);
qualityContainerBtn.append(listQuality);
container.prepend(qualityContainerBtn);
fillQualityMenu();
NOVA.videoElement?.addEventListener('loadeddata', fillQualityMenu);
function fillQualityMenu() {
if (qualityList = document.getElementById(SELECTOR_QUALITY_LIST_ID)) {
qualityList.innerHTML = '';
movie_player.getAvailableQualityLevels()
.forEach(quality => {
const qualityItem = document.createElement('li');
if (qualityData = qualityFormatList[quality]) {
qualityItem.textContent = qualityData.label;
if (badge = qualityData.badge) {
const labelBadge = document.createElement('span');
labelBadge.className = 'quality-menu-item-label-badge';
labelBadge.textContent = badge;
qualityItem.append(labelBadge);
}
if (movie_player.getPlaybackQuality() == quality) {
qualityItem.className = 'active';
}
else {
const maxWidth = (NOVA.currentPage == 'watch'
|| (user_settings['embed-popup'] && NOVA.queryURL.has('popup'))
)
? screen.width
: window.innerWidth;
if ((NOVA.extractAsNum.int(qualityData.label) || 0) <= (maxWidth * 1.3)) {
qualityItem.addEventListener('click', () => {
movie_player.setPlaybackQualityRange(quality, quality);
}, { capture: true });
}
else {
qualityItem.className = 'disable';
qualityItem.title = 'Max (window viewport + 30%)';
}
}
qualityList.append(qualityItem);
}
});
}
}
}
if (user_settings.player_buttons_custom_items?.includes('clock')) {
const clockEl = document.createElement('span');
clockEl.className = 'ytp-time-display';
clockEl.title = 'Now time';
container.prepend(clockEl);
let clockInterval;
if (user_settings.player_buttons_custom_clock_fullcreen) {
document.addEventListener('fullscreenchange', () => {
if (document.fullscreenElement) setIntervalClock();
else {
clearInterval(clockInterval);
clockEl.textContent = '';
}
});
}
else setIntervalClock();
function setIntervalClock() {
clockInterval = setInterval(() => {
if (document.visibilityState == 'hidden'
|| movie_player.classList.contains('ytp-autohide')
) {
return;
}
const formatLength = user_settings.player_buttons_custom_clock_seconds ? 8 : 5;
const time = new Date().toTimeString().slice(0, formatLength);
clockEl.textContent = time;
}, 1000);
}
}
if (user_settings.player_buttons_custom_items?.includes('range-speed')) {
const
speedSlider = document.createElement('input'),
SELECTOR_RANGE_CLASS_NAME = 'nova-range-speed-input',
SELECTOR_RANGE = '.' + SELECTOR_RANGE_CLASS_NAME;
NOVA.css.push(
`${SELECTOR_RANGE}[type="range"] {
height: 100%;
}`);
speedSlider.className = `${SELECTOR_BTN_CLASS_NAME} ${SELECTOR_RANGE_CLASS_NAME}`;
speedSlider.title = 'Playback Rate';
speedSlider.type = 'range';
speedSlider.min = speedSlider.step = +user_settings.rate_step || .1;
speedSlider.max = user_settings.range_speed_unlimit ? +user_settings.rate_default : 2;
speedSlider.value = NOVA.videoElement.playbackRate;
updateTitleForSpeedSlider(NOVA.videoElement.playbackRate);
NOVA.videoElement.addEventListener('ratechange', function () {
speedSlider.value = this.playbackRate;
updateTitleForSpeedSlider(this.playbackRate);
});
speedSlider.addEventListener('change', ({ target }) => playerRate(target.value));
speedSlider.addEventListener('wheel', evt => {
evt.preventDefault();
const rate = NOVA.videoElement.playbackRate + (speedSlider.step * Math.sign(evt.wheelDelta));
playerRate(rate);
speedSlider.value = rate;
}, { capture: true });
container.prepend(speedSlider);
function playerRate(rate) {
if (!user_settings.range_speed_unlimit && rate > 2) return;
NOVA.videoElement.playbackRate = (+rate).toFixed(2);
updateTitleForSpeedSlider(rate);
}
function updateTitleForSpeedSlider(rate) {
speedSlider.title = `Speed (${rate})`;
speedSlider.setAttribute('tooltip', `Speed (${rate})`);
}
}
if (user_settings.player_buttons_custom_items?.includes('toggle-speed')) {
const
speedBtn = document.createElement('a'),
hotkey = user_settings.player_buttons_custom_hotkey_toggle_speed || 'KeyA',
defaultRateText = '1x',
genTooltip = () => `Switch to ${NOVA.videoElement.playbackRate}>${speedBtn.textContent} (${hotkey.replace('Key', '')})`;
let rateOrig = {};
speedBtn.className = `ytp-button ${SELECTOR_BTN_CLASS_NAME}`;
speedBtn.style.textAlign = 'center';
speedBtn.style.fontWeight = 'bold';
speedBtn.innerHTML = defaultRateText;
speedBtn.setAttribute('tooltip', genTooltip());
document.addEventListener('keyup', evt => {
if (NOVA.currentPage != 'watch' && NOVA.currentPage != 'embed') return;
if (['input', 'textarea', 'select'].includes(evt.target.localName) || evt.target.isContentEditable) return;
if (evt.ctrlKey || evt.altKey || evt.shiftKey || evt.metaKey) return;
if ((hotkey.length === 1 ? evt.key : evt.code) === hotkey) {
switchRate();
}
});
speedBtn.addEventListener('click', switchRate);
NOVA.videoElement.addEventListener('ratechange', function () {
speedBtn.setAttribute('tooltip', genTooltip());
if (!user_settings['video-rate']) NOVA.showOSD(this.playbackRate + 'x');
});
function switchRate() {
if (Object.keys(rateOrig).length) {
playerRate.set(rateOrig);
rateOrig = {};
speedBtn.innerHTML = defaultRateText;
}
else {
rateOrig = (typeof movie_player === 'object'
&& (NOVA.videoElement.playbackRate % .25 === 0)
&& (NOVA.videoElement.playbackRate <= 2))
? { 'default': movie_player.getPlaybackRate() }
: { 'html5': NOVA.videoElement.playbackRate };
let resetRate = Object.assign({}, rateOrig);
resetRate[Object.keys(resetRate)[0]] = 1;
playerRate.set(resetRate);
speedBtn.textContent = rateOrig[Object.keys(rateOrig)[0]] + 'x';
}
speedBtn.setAttribute('tooltip', genTooltip());
}
const playerRate = {
set(obj) {
if (obj.hasOwnProperty('html5') || !movie_player) {
NOVA.videoElement.playbackRate = obj.html5;
}
else {
movie_player.setPlaybackRate(obj.default);
}
},
};
container.prepend(speedBtn);
visibilitySwitch();
NOVA.videoElement?.addEventListener('ratechange', visibilitySwitch);
NOVA.videoElement?.addEventListener('loadeddata', () => {
rateOrig = {};
speedBtn.textContent = defaultRateText;
visibilitySwitch();
});
function visibilitySwitch() {
if (!Object.keys(rateOrig).length) {
speedBtn.style.display = (NOVA.videoElement?.playbackRate === 1) ? 'none' : '';
}
}
}
});
},
options: {
player_buttons_custom_items: {
_tagName: 'select',
label: 'Buttons',
'label:zh': '纽扣',
'label:ja': 'ボタン',
'label:pl': 'Przyciski',
title: '[Ctrl+Click] to select several',
'title:zh': '[Ctrl+Click] 选择多个',
'title:ja': '「Ctrl+Click」して、いくつかを選択します',
'title:pl': 'Ctrl+kliknięcie, aby zaznaczyć kilka',
multiple: null,
required: true,
size: 7,
options: [
{
label: 'clock', value: 'clock',
},
{
label: 'quick quality', value: 'quick-quality',
'label:zh': '质量',
'label:ja': '品質',
'label:pl': 'jakość',
},
{
label: 'range speed', value: 'range-speed',
},
{
label: 'toggle speed', value: 'toggle-speed',
'label:zh': '切换速度',
'label:ja': 'トグル速度',
'label:pl': 'szybkość',
},
{
label: 'card-switch', value: 'card-switch',
},
{
label: 'screenshot', value: 'screenshot',
'label:zh': '截屏',
'label:ja': 'スクリーンショット',
},
{
label: 'picture-in-picture', value: 'picture-in-picture',
'label:pl': 'obraz w obrazie',
},
{
label: 'popup', value: 'popup',
'label:zh': '弹出式播放器',
'label:ja': 'ポップアッププレーヤー',
'label:pl': 'w okienku',
},
{
label: 'rotate', value: 'rotate',
'label:zh': '旋转',
'label:ja': '回転する',
'label:pl': 'obróć',
},
{
label: 'aspect-ratio', value: 'aspect-ratio',
},
{
label: 'watch later', value: 'watch-later',
},
{
label: 'preview cover', value: 'thumbnail',
'label:zh': '缩略图',
'label:ja': 'サムネイル',
'label:pl': 'miniaturka',
},
],
},
player_buttons_custom_hotkey_toggle_speed: {
_tagName: 'select',
label: 'Hotkey toggle speed',
'label:zh': '热键切换速度',
'label:ja': '速度を切り替えるためのホットボタン',
'label:pl': 'Skrót przełączania prędkości',
options: [
{ label: 'none', value: false },
{ label: 'A', value: 'KeyA', selected: true },
{ label: 'B', value: 'KeyB' },
{ label: 'C', value: 'KeyC' },
{ label: 'D', value: 'KeyD' },
{ label: 'E', value: 'KeyE' },
{ label: 'F', value: 'KeyF' },
{ label: 'G', value: 'KeyG' },
{ label: 'H', value: 'KeyH' },
{ label: 'I', value: 'KeyI' },
{ label: 'J', value: 'KeyJ' },
{ label: 'K', value: 'KeyK' },
{ label: 'L', value: 'KeyL' },
{ label: 'M', value: 'KeyM' },
{ label: 'N', value: 'KeyN' },
{ label: 'O', value: 'KeyO' },
{ label: 'P', value: 'KeyP' },
{ label: 'Q', value: 'KeyQ' },
{ label: 'R', value: 'KeyR' },
{ label: 'S', value: 'KeyS' },
{ label: 'T', value: 'KeyT' },
{ label: 'U', value: 'KeyU' },
{ label: 'V', value: 'KeyV' },
{ label: 'W', value: 'KeyW' },
{ label: 'X', value: 'KeyX' },
{ label: 'Y', value: 'KeyY' },
{ label: 'Z', value: 'KeyZ' },
0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
']', '[', '+', '-', ',', '.', '/', '<', ';', '\\',
],
'data-dependent': { 'player_buttons_custom_items': ['toggle-speed'] },
},
player_buttons_custom_hotkey_rotate: {
_tagName: 'select',
label: 'Hotkey rotate',
options: [
{ label: 'none', value: false },
{ label: 'A', value: 'KeyA' },
{ label: 'B', value: 'KeyB' },
{ label: 'C', value: 'KeyC' },
{ label: 'D', value: 'KeyD' },
{ label: 'E', value: 'KeyE' },
{ label: 'F', value: 'KeyF' },
{ label: 'G', value: 'KeyG' },
{ label: 'H', value: 'KeyH' },
{ label: 'I', value: 'KeyI' },
{ label: 'J', value: 'KeyJ' },
{ label: 'K', value: 'KeyK' },
{ label: 'L', value: 'KeyL' },
{ label: 'M', value: 'KeyM' },
{ label: 'N', value: 'KeyN' },
{ label: 'O', value: 'KeyO' },
{ label: 'P', value: 'KeyP' },
{ label: 'Q', value: 'KeyQ' },
{ label: 'R', value: 'KeyR', selected: true },
{ label: 'S', value: 'KeyS' },
{ label: 'T', value: 'KeyT' },
{ label: 'U', value: 'KeyU' },
{ label: 'V', value: 'KeyV' },
{ label: 'W', value: 'KeyW' },
{ label: 'X', value: 'KeyX' },
{ label: 'Y', value: 'KeyY' },
{ label: 'Z', value: 'KeyZ' },
0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
']', '[', '+', '-', ',', '.', '/', '<', ';', '\\',
],
'data-dependent': { 'player_buttons_custom_items': ['rotate'] },
},
player_buttons_custom_card_switch: {
_tagName: 'select',
label: 'Default card state',
options: [
{
label: 'show', value: false, selected: true,
},
{
label: 'hide', value: true,
},
],
'data-dependent': { 'player_buttons_custom_items': ['card-switch'] },
},
player_buttons_custom_screenshot: {
_tagName: 'select',
label: 'Screenshot format',
options: [
{
label: 'png', value: 'png', selected: true,
},
{
label: 'jpg', value: 'jpg',
},
{
label: 'webp', value: 'webp',
},
],
'data-dependent': { 'player_buttons_custom_items': ['screenshot'] },
},
player_buttons_custom_screenshot_to_clipboard: {
_tagName: 'input',
label: 'Screenshot copy to clipboard',
type: 'checkbox',
'data-dependent': { 'player_buttons_custom_items': ['screenshot'] },
},
player_buttons_custom_screenshot_subtitle_color: {
_tagName: 'input',
type: 'color',
value: '#ffffff',
label: 'Screenshot subtitle color',
'data-dependent': { 'player_buttons_custom_items': ['screenshot'] },
},
player_buttons_custom_screenshot_subtitle_shadow_color: {
_tagName: 'input',
type: 'color',
value: '#000000',
label: 'Screenshot subtitle shadow color',
'data-dependent': { 'player_buttons_custom_items': ['screenshot'] },
},
range_speed_unlimit: {
_tagName: 'input',
label: 'Range speed unlimit',
type: 'checkbox',
'data-dependent': { 'player_buttons_custom_items': ['range-speed'] },
},
range_speed_unlimit: {
_tagName: 'input',
label: 'Range speed unlimit',
type: 'checkbox',
'data-dependent': { 'player_buttons_custom_items': ['range-speed'] },
},
player_buttons_custom_clock_seconds: {
_tagName: 'input',
label: 'Clock show seconds',
type: 'checkbox',
'data-dependent': { 'player_buttons_custom_items': ['clock'] },
},
player_buttons_custom_clock_fullcreen: {
_tagName: 'input',
label: 'Clock only fullscreen',
type: 'checkbox',
'data-dependent': { 'player_buttons_custom_items': ['clock'] },
},
}
});
window.nova_plugins.push({
id: 'save-channel-state',
title: 'Add button "Save params for the channel"',
'title:zh': '특정 채널에 저장',
'title:ja': '特定のチャンネル用に保存',
'title:pl': 'Zapisz dla określonego kanału',
run_on_pages: 'watch, embed',
section: 'control-panel',
_runtime: user_settings => {
const
SELECTOR_BTN_ID = 'nova-channels-state',
SELECTOR_BTN = '#' + SELECTOR_BTN_ID,
SELECTOR_BTN_CLASS_NAME = 'nova-right-custom-button',
SELECTOR_BTN_LIST_ID = SELECTOR_BTN_CLASS_NAME + '-list',
SELECTOR_BTN_LIST = '#' + SELECTOR_BTN_LIST_ID,
SELECTOR_BTN_TITLE_ID = SELECTOR_BTN_CLASS_NAME + '-title';
NOVA.waitSelector('#movie_player .ytp-right-controls')
.then(container => {
initStyles();
NOVA.runOnPageLoad(async () => {
if (NOVA.currentPage == 'watch' || NOVA.currentPage == 'embed') {
await NOVA.storage_obj_manager.initStorage();
if (btn = document.getElementById(SELECTOR_BTN_ID)) {
btn.append(genList());
}
else {
const btn = document.createElement('button');
btn.id = SELECTOR_BTN_ID;
btn.className = `ytp-button ${SELECTOR_BTN_CLASS_NAME}`;
btn.title = 'Save channel state';
const btnTitle = document.createElement('span');
btnTitle.id = SELECTOR_BTN_TITLE_ID;
btnTitle.style.display = 'flex';
btnTitle.innerHTML =
`<svg width="100%" height="100%" viewBox="0 0 36 36">
<g fill="currentColor">
<path d="M23.4 24.2c-.3.8-1.1 1.4-2 1.4-.9 0-1.7-.6-2-1.4H9.3c-.3 0-.6-.3-.6-.6v-.3c0-.3.3-.6.6-.6h10.1c.3-.9 1.1-1.5 2.1-1.5s1.8.6 2.1 1.5h3.2c.3 0 .6.3.6.6v.3c0 .3-.3.6-.6.6h-3.4zm-7.7-5.3c-.3.9-1.1 1.5-2.1 1.5s-1.8-.6-2.1-1.5H9.3c-.3 0-.6-.3-.6-.6V18c0-.3.3-.6.6-.6h2.2c.3-.8 1.1-1.4 2.1-1.4s1.8.6 2.1 1.4h11.1c.3 0 .6.3.6.6v.3c0 .3-.3.6-.6.6H15.7zm7.9-5.4c-.3.8-1.1 1.4-2.1 1.4-.9 0-1.7-.6-2.1-1.4H9.3c-.3 0-.6-.3-.6-.6v-.3c0-.3.3-.6.6-.6h10.1c.3-.9 1.1-1.6 2.1-1.6s1.9.7 2.1 1.6h3.1c.3 0 .6.3.6.6v.3c0 .3-.3.6-.6.6h-3.1z" />
</g>
</svg>`;
btn.prepend(btnTitle);
btn.append(genList());
container.prepend(btn);
}
btnTitleStateUpdate(Boolean(NOVA.storage_obj_manager.read()));
}
});
});
function btnTitleStateUpdate(state) {
document.getElementById(SELECTOR_BTN_TITLE_ID)
.style.setProperty('opacity', state ? 1 : .3);
}
function genList() {
const ul = document.createElement('ul');
ul.id = SELECTOR_BTN_LIST_ID;
let listItem = [];
listItem.push({
name: 'subtitles',
getCurrentState: () => {
movie_player.toggleSubtitlesOn();
return true;
},
customApply: () => {
document.addEventListener('playing', () => {
if (NOVA.currentPage != 'watch' && NOVA.currentPage != 'embed') return;
movie_player.toggleSubtitlesOn();
}, { capture: true, once: true });
},
});
if (user_settings['video-quality']) {
listItem.push({ name: 'quality', getCurrentState: movie_player.getPlaybackQuality });
}
if (user_settings['video-rate']) {
listItem.push({ name: 'speed', getCurrentState: () => NOVA.videoElement.playbackRate });
}
if (user_settings['video-volume']) {
listItem.push({ name: 'volume', getCurrentState: () => Math.round(movie_player.getVolume()) });
}
if (user_settings['player-resume-playback']) {
listItem.push({ name: 'ignore-playback', label: 'unsave playback time', getCurrentState: () => true });
}
if (user_settings['player-loop']) {
listItem.push({ name: 'loop' });
}
if (user_settings['transcript']) {
listItem.push({ name: 'transcript' });
}
if (user_settings['video-zoom']) {
listItem.push({
name: 'zoom', getCurrentState: () => NOVA.extractAsNum.float(
document.body.querySelector('.html5-video-container').style.transform
)
});
}
listItem.forEach(async element => {
const storage = NOVA.storage_obj_manager._getParam(element.name);
const checkbox = document.createElement('input');
checkbox.type = 'checkbox';
checkbox.id = `checkbox-${element.name}`;
checkbox.checked = Boolean(storage);
checkbox.className = 'ytp-menuitem-toggle-checkbox';
const li = document.createElement('li');
li.innerHTML =
`<label for="checkbox-${element.name}">
${element.label || element.name} <span>${storage || ''}</span>
</label>`;
li.title = storage ? `Currently stored value ${storage}` : 'none';
if (Boolean(storage) && element.hasOwnProperty('customApply') && typeof element.customApply === 'function') {
element.customApply();
}
checkbox.addEventListener('change', () => {
let state;
if (checkbox.checked && (state = element.hasOwnProperty('getCurrentState') ? element.getCurrentState() : true)) {
NOVA.storage_obj_manager.save({ [element.name]: state });
}
else {
NOVA.storage_obj_manager.remove(element.name);
}
li.title = state ? `Currently stored value ${state}` : 'none';
li.querySelector('span').textContent = state || '';
btnTitleStateUpdate(Boolean(state));
});
li.prepend(checkbox);
ul.append(li);
});
if (user_settings['time-jump']) {
const
SLIDER_LABEL = 'skip into',
SLIDER_STORAGE_NAME = 'skip-into',
storage = +NOVA.storage_obj_manager._getParam(SLIDER_STORAGE_NAME);
const slider = document.createElement('input');
slider.type = 'range';
slider.min = 0;
slider.max = 120;
slider.step = 1;
slider.value = storage || 0;
const li = document.createElement('li');
li.innerHTML =
`<label for="checkbox-${SLIDER_STORAGE_NAME}">
${SLIDER_LABEL} <span>${storage || ''}</span>
</label>`;
li.title = 'Simple alternative SponsorBlock';
slider.addEventListener('change', sliderChange);
slider.addEventListener('input', sliderChange);
slider.addEventListener('wheel', evt => {
evt.preventDefault();
evt.target.value = +evt.target.value + Math.sign(evt.wheelDelta);
sliderChange(evt);
});
li.prepend(slider);
ul.append(li);
function sliderChange({ target }) {
if (state = +target.value) {
NOVA.storage_obj_manager.save({ [SLIDER_STORAGE_NAME]: +target.value });
}
else {
NOVA.storage_obj_manager.remove(SLIDER_STORAGE_NAME);
}
li.title = state ? `Currently stored value ${state}` : 'none';
li.querySelector('span').textContent = state || '';
btnTitleStateUpdate(Boolean(state));
}
}
return ul;
}
function initStyles() {
NOVA.css.push(
SELECTOR_BTN + ` {
overflow: visible !important;
position: relative;
text-align: center !important;
vertical-align: top;
font-weight: bold;
}
.ytp-left-controls {
overflow: visible !important;
}
${SELECTOR_BTN_LIST} {
position: absolute;
bottom: 2.5em !important;
left: -2.2em;
list-style: none;
padding-bottom: 1.5em !important;
z-index: calc(${+NOVA.css.get('.ytp-progress-bar', 'z-index')} + 1);
}
html[data-cast-api-enabled] ${SELECTOR_BTN_LIST} {
margin: 0;
padding: 0;
bottom: 3.3em;
}
${SELECTOR_BTN}:not(:hover) ${SELECTOR_BTN_LIST} {
display: none;
}
${SELECTOR_BTN_LIST} li {
cursor: pointer;
white-space: nowrap;
line-height: 1.4;
background-color: rgba(28, 28, 28, .9);
margin: .3em 0;
padding: .5em 1em;
border-radius: .3em;
color: white;
text-align: left !important;
display: grid;
grid-template-columns: auto auto;
align-items: center;
justify-content: start;
}
${SELECTOR_BTN_LIST} li label {
cursor: pointer;
padding-left: 5px;
}
${SELECTOR_BTN_LIST} li.active { background-color: #720000; }
${SELECTOR_BTN_LIST} li.disable { color: #666; }
${SELECTOR_BTN_LIST} li:not(:hover) { opacity: .8; }
${SELECTOR_BTN_LIST} li span:not(:empty):before { content: '('; }
${SELECTOR_BTN_LIST} li span:not(:empty):after { content: ')'; }
${SELECTOR_BTN_LIST} [type="checkbox"] {
appearance: none;
outline: none;
cursor: pointer;
}
${SELECTOR_BTN_LIST} [type="checkbox"]:checked {
background-color: #f00;
}
${SELECTOR_BTN_LIST} [type="checkbox"]:checked:after {
left: 20px;
background-color: white;
}`);
}
},
});
window.nova_plugins.push({
id: 'time-remaining',
title: 'Remaining time',
'title:zh': '剩余时间',
'title:ja': '余日',
'title:pl': 'Pozostały czas',
run_on_pages: 'watch, embed, -mobile',
section: 'control-panel',
desc: 'Remaining time until the end of the video',
'desc:zh': '距离视频结束的剩余时间',
'desc:ja': 'ビデオの終わりまでの残り時間',
'desc:pl': 'Czas pozostały do końca filmu',
_runtime: user_settings => {
const SELECTOR_ID = 'nova-player-time-remaining';
let selectorOutAfter;
switch (user_settings.time_remaining_position) {
case 'description': selectorOutAfter = '#title h1'; break;
default: selectorOutAfter = '.ytp-time-duration, ytm-time-display .time-display-content'; break;
}
NOVA.waitSelector(selectorOutAfter)
.then(container => {
NOVA.waitSelector('video')
.then(video => {
video.addEventListener('timeupdate', setRemaining.bind(video));
video.addEventListener('ratechange', setRemaining.bind(video));
video.addEventListener('ended', () => insertToHTML({ 'container': container }));
document.addEventListener('yt-navigate-finish', () => insertToHTML({ 'container': container }));
});
function setRemaining() {
if (isNaN(this.duration)
|| movie_player.getVideoData().isLive
|| (NOVA.currentPage == 'embed' && document.URL.includes('live_stream'))
|| document.visibilityState == 'hidden'
|| ((user_settings.time_remaining_position != 'description') && movie_player.classList.contains('ytp-autohide'))
) return;
const
currentTime = Math.trunc(this.currentTime),
duration = Math.trunc(this.duration),
delta_ = duration - currentTime,
getPercent = percentage_type_left => {
const
floatRound = pt => (this.duration > 3600)
? pt.toFixed(2)
: (this.duration > 1500)
? pt.toFixed(1)
: Math.round(pt),
calcPercentage = percentage_type_left
? delta_ * 100 / duration
: currentTime * 100 / duration;
return floatRound(calcPercentage) + '%';
},
getTimeLeft = () => NOVA.formatTimeOut.HMS.digit(delta_),
getTimeLeftByRate = () => '-' + NOVA.formatTimeOut.HMS.digit(delta_ / this.playbackRate);
const text = user_settings.time_remaining_format
.replace(/duration(\*speed)|left(\*speed|%)?|done(%)?|'([^']|'')*'/g, partPattern => {
let out;
switch (partPattern) {
case 'left*speed': out = getTimeLeftByRate(); break;
case 'left': out = getTimeLeft(); break;
case 'left%': out = getPercent('L'); break;
case 'done': out = currentTime; break;
case 'done%': out = getPercent(); break;
case 'duration*speed': out = NOVA.formatTimeOut.HMS.digit(duration / this.playbackRate); break;
case 'duration': out = duration; break;
}
return out;
});
if (text) insertToHTML({ 'text': text, 'container': container });
}
function insertToHTML({ text = '', container = required() }) {
if (!(container instanceof HTMLElement)) return console.error('container not HTMLElement:', container);
(document.getElementById(SELECTOR_ID) || (function () {
const el = document.createElement('span');
el.id = SELECTOR_ID;
container.after(el);
return el;
})())
.textContent = ' ' + text;
}
});
},
options: {
time_remaining_format: {
_tagName: 'select',
label: 'Time pattern',
options: [
{
label: 'left*speed', value: 'left*speed', selected: true,
},
{
label: 'left*speed (done%)', value: 'left*speed (done%)',
},
{
label: 'left*speed (left%)', value: 'left*speed (left%)',
},
{
label: 'left', value: 'left',
},
{
label: 'left%', value: 'left%',
},
{
label: 'done%', value: 'done%',
},
{
label: 'left/left*speed', value: 'left/left*speed (done%)',
},
{
label: 'left*speed/duration*speed (done%)', value: 'left*speed/duration*speed (done%)',
},
],
},
time_remaining_position: {
_tagName: 'select',
label: 'Render position',
options: [
{
label: 'player', value: 'player', selected: true,
},
{
label: 'description', value: 'description',
},
],
},
}
});
window.nova_plugins.push({
id: 'embed-show-control-force',
title: 'Force enable control panel (for embed)',
'title:zh': '埋め込みでコントロール パネルを強制的に有効にする',
'title:ja': '强制启用嵌入的控制面板',
'title:pl': 'Wymuś włączenie panelu sterowania w osadzeniu',
run_on_pages: 'embed',
section: 'control-panel',
_runtime: user_settings => {
const href = location.href.replace(/&amp;/g, '&');
if (['0', 'false'].includes(NOVA.queryURL.get('controls', href))) {
NOVA.updateUrl(NOVA.queryURL.remove('controls', href));
}
},
});
window.nova_plugins.push({
id: 'time-jump',
title: 'Jump time/chapter',
'title:zh': '时间跳跃',
'title:ja': 'タイムジャンプ',
'title:pl': 'Skok czasowy',
run_on_pages: 'watch, embed, -mobile',
section: 'control-panel',
desc: 'Use to skip the intro or ad inserts',
'desc:zh': '用于跳过介绍或广告插入',
'desc:ja': 'イントロや広告挿入をスキップするために使用します',
'desc:pl': 'Służy do pomijania wstępu lub wstawek reklamowych',
_runtime: user_settings => {
if (user_settings.time_jump_title_offset) addTitleOffset();
NOVA.waitSelector('#movie_player video')
.then(video => {
let chapterList;
video.addEventListener('loadeddata', () => chapterList = []);
doubleKeyPressListener(timeLeap, user_settings.time_jump_hotkey);
function timeLeap() {
if (movie_player.getVideoData().isLive
|| (NOVA.currentPage == 'embed' && document.URL.includes('live_stream'))
) return;
if (chapterList !== null && !chapterList?.length) {
chapterList = NOVA.getChapterList(movie_player.getDuration()) || null;
}
const
currentTime = movie_player.getCurrentTime(),
nextChapterIndex = chapterList?.findIndex(c => c.sec > currentTime),
separator = ' • ';
let msg;
if (chapterList?.length
&& nextChapterIndex !== -1
) {
const nextChapterData = chapterList?.find(({ sec }) => sec >= currentTime);
seekTime(nextChapterData.sec + .5);
msg = nextChapterData.title + separator + nextChapterData.time;
}
else {
seekTime(+user_settings.time_jump_step + currentTime);
msg = `+${user_settings.time_jump_step} sec` + separator + NOVA.formatTimeOut.HMS.digit(currentTime);
}
NOVA.showOSD(msg);
}
function seekTime(sec) {
if (typeof movie_player.seekBy === 'function') {
movie_player.seekTo(sec);
}
else if (NOVA.videoElement) {
NOVA.videoElement.currentTime = sec;
}
else {
const errorText = '[time-jump] > "seekTime" detect player error';
console.error(errorText);
throw errorText;
}
}
});
function addTitleOffset() {
NOVA.css.push(
`.ytp-tooltip-text:after {
content: attr(data-before);
color: #ffcc00;
}`);
NOVA.waitSelector('.ytp-progress-bar')
.then(progressContainer => {
if (tooltipEl = document.body.querySelector('.ytp-tooltip-text')) {
progressContainer.addEventListener('mousemove', () => {
if (movie_player.getVideoData().isLive
|| (NOVA.currentPage == 'embed' && document.URL.includes('live_stream'))
) return;
const
cursorTime = NOVA.formatTimeOut.hmsToSec(tooltipEl.textContent),
offsetTime = cursorTime - NOVA.videoElement?.currentTime,
sign = (offsetTime >= 1) ? '+' : (Math.sign(offsetTime) === -1) ? '-' : '';
tooltipEl.setAttribute('data-before', ` ${sign + NOVA.formatTimeOut.HMS.digit(offsetTime)}`);
});
progressContainer.addEventListener('mouseleave', () => tooltipEl.removeAttribute('data-before'));
}
});
}
function doubleKeyPressListener(callback = required(), keyNameFilter = required()) {
let
pressed,
isDoublePress,
lastWhich,
lastPressed = keyNameFilter;
document.addEventListener('keyup', keyPress);
function keyPress(evt) {
if (['input', 'textarea', 'select'].includes(evt.target.localName) || evt.target.isContentEditable) return;
pressed = (keyNameFilter.length === 1) || ['Control', 'Shift'].includes(keyNameFilter) ? evt.key : evt.code;
if (isDoublePress && (lastWhich === evt.which) && (pressed === lastPressed)) {
isDoublePress = false;
if (callback && typeof callback === 'function') return callback(evt);
}
else {
isDoublePress = true;
setTimeout(() => isDoublePress = false, 500);
}
if (!keyNameFilter) lastPressed = pressed;
lastWhich = evt.which;
}
}
if (user_settings['save-channel-state']) {
NOVA.waitSelector('#movie_player video')
.then(video => {
NOVA.runOnPageLoad(async () => {
const
CACHE_PREFIX = 'nova-resume-playback-time',
getCacheName = () => CACHE_PREFIX + ':' + (NOVA.queryURL.get('v') || movie_player.getVideoData().video_id);
if ((NOVA.currentPage == 'watch' || NOVA.currentPage == 'embed')
&& !+sessionStorage.getItem(getCacheName())
&& (!NOVA.queryURL.has('t') && !NOVA.queryURL.getHashParam('t'))
&& (userSeek = await NOVA.storage_obj_manager.getParam('skip-into'))
) {
video.addEventListener('playing', timeLeapInto.apply(video, [userSeek]), { capture: true, once: true });
}
});
});
}
else if (+user_settings.skip_into_sec && (!NOVA.queryURL.has('t') && !NOVA.queryURL.getHashParam('t'))) {
NOVA.waitSelector('#movie_player video')
.then(video => {
NOVA.runOnPageLoad(() => {
if (NOVA.currentPage == 'watch') {
video.addEventListener('playing', timeLeapInto.bind(video, user_settings.skip_into_sec), { capture: true, once: true });
}
});
});
}
function timeLeapInto(time_seek = 10) {
if (!time_seek && !user_settings.skip_into_sec_in_music && NOVA.isMusic()) return;
const
CACHE_PREFIX = 'resume-playback-time',
getCacheName = () => CACHE_PREFIX + ':' + (NOVA.queryURL.get('v') || movie_player.getVideoData().video_id);
if (user_settings['player-resume-playback']
&& (saveTime = +sessionStorage.getItem(getCacheName()))
&& (saveTime > (this.duration - 3))
) return;
if ((isNaN(this.duration) || this.duration > 30)
&& (this.currentTime < +time_seek)
) {
this.currentTime = +time_seek;
}
}
},
options: {
time_jump_step: {
_tagName: 'input',
label: 'Step time',
'label:ja': 'ステップ時間',
'label:zh': '步骤时间',
'label:pl': 'Krok czasowy',
type: 'number',
title: 'In seconds',
placeholder: 'sec',
min: 3,
max: 300,
value: 30,
},
time_jump_hotkey: {
_tagName: 'select',
label: 'Hotkey (double click)',
'label:zh': '热键（双击）',
'label:ja': 'Hotkey (ダブルプレス)',
'label:pl': 'Klawisz skrótu (podwójne kliknięcie)',
title: 'by default【Ctrl + Arrows】',
options: [
{ label: 'Shift (any)', value: 'Shift' },
{ label: 'ShiftL', value: 'ShiftLeft' },
{ label: 'ShiftR', value: 'ShiftRight' },
{ label: 'Ctrl (any)', value: 'Control' },
{ label: 'CtrlL', value: 'ControlLeft' },
{ label: 'CtrlR', value: 'ControlRight', selected: true },
{ label: 'AltL', value: 'AltLeft' },
{ label: 'AltR', value: 'AltRight' },
{ label: 'A', value: 'KeyA' },
{ label: 'B', value: 'KeyB' },
{ label: 'C', value: 'KeyC' },
{ label: 'D', value: 'KeyD' },
{ label: 'E', value: 'KeyE' },
{ label: 'F', value: 'KeyF' },
{ label: 'G', value: 'KeyG' },
{ label: 'H', value: 'KeyH' },
{ label: 'I', value: 'KeyI' },
{ label: 'J', value: 'KeyJ' },
{ label: 'K', value: 'KeyK' },
{ label: 'L', value: 'KeyL' },
{ label: 'M', value: 'KeyM' },
{ label: 'N', value: 'KeyN' },
{ label: 'O', value: 'KeyO' },
{ label: 'P', value: 'KeyP' },
{ label: 'Q', value: 'KeyQ' },
{ label: 'R', value: 'KeyR' },
{ label: 'S', value: 'KeyS' },
{ label: 'T', value: 'KeyT' },
{ label: 'U', value: 'KeyU' },
{ label: 'V', value: 'KeyV' },
{ label: 'W', value: 'KeyW' },
{ label: 'X', value: 'KeyX' },
{ label: 'Y', value: 'KeyY' },
{ label: 'Z', value: 'KeyZ' },
0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
']', '[', '+', '-', ',', '.', '/', '<', ';', '\\',
],
},
time_jump_title_offset: {
_tagName: 'input',
label: 'Show time offset on progress bar',
'label:zh': '在进度条中显示时间偏移',
'label:ja': 'プログレスバーに時間オフセットを表示する',
'label:pl': 'Pokaż przesunięcie czasu na pasku postępu',
type: 'checkbox',
title: 'Time offset from current playback time',
'title:zh': '与当前播放时间的时间偏移',
'title:ja': '現在の再生時間からの時間オフセット',
'title:pl': 'Przesunięcie czasu względem bieżącego czasu odtwarzania',
},
skip_into_sec: {
_tagName: 'input',
label: 'Start playback at',
'label:zh': '设置开始时间',
'label:ja': '開始時刻を設定',
'label:pl': 'Ustaw czas rozpoczęcia',
type: 'number',
title: 'in sec / 0 - disable',
placeholder: '1-30',
step: 1,
min: 0,
max: 30,
value: 0,
},
skip_into_sec_in_music: {
_tagName: 'input',
label: 'Apply for music genre',
type: 'checkbox',
'data-dependent': { 'skip_into_sec': "!0" },
},
}
});
window.nova_plugins.push({
id: 'download-video',
title: 'Download video',
'title:zh': '下载视频',
'title:ja': 'ビデオをダウンロードする',
run_on_pages: 'watch, -mobile',
section: 'control-panel',
_runtime: user_settings => {
NOVA.waitSelector('#movie_player .ytp-right-controls')
.then(container => {
const
SELECTOR_BTN_CLASS_NAME = 'nova-video-download',
SELECTOR_BTN = '.' + SELECTOR_BTN_CLASS_NAME,
containerBtn = document.createElement('a'),
SELECTOR_BTN_LIST_ID = SELECTOR_BTN_CLASS_NAME + '-list',
SELECTOR_BTN_LIST = '#' + SELECTOR_BTN_LIST_ID,
dropdownMenu = document.createElement('ul'),
SELECTOR_BTN_TITLE_ID = SELECTOR_BTN_CLASS_NAME + '-title',
SELECTOR_BTN_TITLE = '#' + SELECTOR_BTN_TITLE_ID,
dropdownSpan = document.createElement('span');
NOVA.runOnPageLoad(() => {
if (NOVA.currentPage == 'watch') {
containerBtn.removeEventListener('click', generateMenu);
dropdownMenu.innerHTML = '';
containerBtn.addEventListener('click', generateMenu, { capture: true, once: true });
}
});
NOVA.css.push(
`${SELECTOR_BTN_TITLE} {
display: block;
height: inherit;
}
${SELECTOR_BTN_TITLE}[tooltip]:hover::before {
content: attr(tooltip);
position: absolute;
top: -3em;
transform: translateX(-30%);
line-height: normal;
background-color: rgba(28,28,28,.9);
border-radius: .3em;
padding: 5px 9px;
color: white;
font-weight: bold;
white-space: nowrap;
}
html[data-cast-api-enabled] ${SELECTOR_BTN_TITLE}[tooltip]:hover::before {
font-weight: normal;
}`);
NOVA.css.push(
SELECTOR_BTN + ` {
overflow: visible !important;
position: relative;
text-align: center !important;
vertical-align: top;
font-weight: bold;
}
${SELECTOR_BTN}:hover { color: #66afe9 !important; }
${SELECTOR_BTN}:active { color: #2196f3 !important; }
${SELECTOR_BTN_LIST} {
position: absolute;
bottom: 2.5em !important;
left: -2.2em;
list-style: none;
padding-bottom: 1.5em !important;
z-index: ${1 + Math.max(NOVA.css.get('.ytp-progress-bar', 'z-index'), 31)};
}
html[data-cast-api-enabled] ${SELECTOR_BTN_LIST} {
margin: 0;
padding: 0;
bottom: 3.3em;
}
${SELECTOR_BTN}:not(:hover) ${SELECTOR_BTN_LIST} {
display: none;
}
${SELECTOR_BTN_LIST} li {
cursor: pointer;
white-space: nowrap;
line-height: 1.4;
background-color: rgba(28, 28, 28, .9);
margin: .1em 0;
padding: .5em 2em;
border-radius: .3em;
color: white;
}
${SELECTOR_BTN_LIST} li:hover { background-color: #c00; }`);
containerBtn.className = `ytp-button ${SELECTOR_BTN_CLASS_NAME} ${SELECTOR_BTN_CLASS_NAME}`;
dropdownSpan.id = SELECTOR_BTN_TITLE_ID;
dropdownSpan.setAttribute('tooltip', 'Nova video download 🡇');
dropdownSpan.innerHTML =
`<svg viewBox="0 0 120 120" width="100%" height="100%" style="scale: .6;">
<g fill="currentColor">
<path d="M96.215 105h-72.18c-3.33 0-5.94-2.61-5.94-5.94V75.03c0-3.33 2.61-5.94 5.94-5.94 3.33 0 5.94 2.61 5.94 5.94v18h60.03v-18c0-3.33 2.61-5.94 5.94-5.94 3.33 0 5.94 2.61 5.94 5.94v24.03c.27 3.33-2.34 5.94-5.67 5.94Zm-32.4-34.47c-2.07 1.89-5.4 1.89-7.56 0l-18.72-17.19c-2.07-1.89-2.07-4.86 0-6.84 2.07-1.98 5.4-1.89 7.56 0l8.91 8.19V20.94c0-3.33 2.61-5.94 5.94-5.94 3.33 0 5.94 2.61 5.94 5.94V54.6l8.91-8.19c2.07-1.89 5.4-1.89 7.56 0 2.07 1.89 2.07 4.86 0 6.84l-18.54 17.28Z" />
</g>
</svg>`;
dropdownMenu.id = SELECTOR_BTN_LIST_ID;
containerBtn.prepend(dropdownSpan);
containerBtn.append(dropdownMenu);
container.prepend(containerBtn);
async function generateMenu() {
if (menuList = document.getElementById(SELECTOR_BTN_LIST_ID)) {
APIs.videoId = NOVA.queryURL.get('v') || movie_player.getVideoData().video_id;
const dropdownSpanOrig = dropdownSpan.outerHTML;
dropdownSpan.textContent = '🕓';
let downloadVideoList = [];
switch (user_settings.download_video_mode) {
case 'cobalt':
downloadVideoList = APIs.Cobalt();
break;
case 'loader.to':
downloadVideoList = APIs.loaderTo();
break;
case 'third_party_methods':
downloadVideoList = APIs.third_party();
break;
case 'direct':
downloadVideoList = await APIs.getInternalListUrls()
break;
}
downloadVideoList
.filter(i => i?.codec)
.forEach((item, idx) => {
const menuItem = document.createElement('li');
if (item.quality) {
menuItem.textContent = `${item.codec} / ${item.quality}`;
}
else menuItem.textContent = item.codec;
menuItem.addEventListener('click', () => {
if (item.custom_fn && typeof item.custom_fn === 'function') {
item.custom_fn(item);
}
else if (item.link_new_tab) {
window.open(item.link_new_tab, '_blank');
}
else {
downloadFile(item.link);
}
}, { capture: true });
menuList.append(menuItem);
});
dropdownSpan.innerHTML = dropdownSpanOrig;
}
}
});
const APIs = {
getQualityAvailableList() {
const qualityList = {
highres: 4320,
hd2880: 2880,
hd2160: 2160,
hd1440: 1440,
hd1080: 1080,
hd720: 720,
large: 480,
medium: 360,
small: 240,
tiny: 144,
};
return movie_player.getAvailableQualityData().map(i => qualityList[i.quality]);
},
Cobalt() {
const qualityAvailableList = this.getQualityAvailableList();
let vidlist = [];
['h264', 'vp9']
.forEach(codec => {
qualityAvailableList.forEach(quality => {
vidlist.push(...[
{
codec: codec.toLocaleUpperCase(),
quality: quality,
'data': { 'vCodec': codec, 'vQuality': String(quality) },
'custom_fn': CobaltAPI,
},
]);
});
});
return [
...vidlist,
{ codec: 'mp3', data: { isAudioOnly: true, cCodec: 'mp3' }, custom_fn: CobaltAPI },
{ codec: 'ogg', data: { isAudioOnly: true, cCodec: 'ogg' }, custom_fn: CobaltAPI },
{ codec: 'wav', data: { isAudioOnly: true, cCodec: 'wav' }, custom_fn: CobaltAPI },
{ codec: 'opus', data: { isAudioOnly: true, cCodec: 'opus' }, custom_fn: CobaltAPI },
];
async function CobaltAPI(item) {
const dlink = await fetch('https://co.wuk.sh/api/json',
{
method: 'POST',
headers: {
'Content-Type': 'application/json',
'Accept': 'application/json',
},
body: JSON.stringify({
url: encodeURI('https://www.youtube.com/watch?v=' + APIs.videoId),
filenamePattern: 'basic',
disableMetadata: true,
isNoTTWatermark: true,
...item.data,
}),
})
.then(response => response.json())
.then(json => json.url)
.catch(error => {
console.warn(`Cobalt API: failed fetching: ${error}`)
});
if (!dlink) return console.debug('CobaltAPI empty dlink:', dlink);
downloadFile(dlink);
}
},
loaderTo() {
const genLink = format => `https://loader.to/api/button/?url=${APIs.videoId}&f=${format}&color=0af`;
const qualityAvailableList = this.getQualityAvailableList()?.filter(i => i > 240);
let vidlist = [];
['MP4']
.forEach(codec => {
qualityAvailableList.forEach(quality => {
vidlist.push({
'codec': codec.toLocaleUpperCase(),
'quality': quality,
'link': genLink(quality),
'custom_fn': openPopup,
});
});
});
return [
...vidlist,
{ codec: 'WEBM', quality: '4K', link: genLink('4k'), custom_fn: openPopup },
{ codec: 'WEBM', quality: '8K', link: genLink('8k'), custom_fn: openPopup },
{ codec: 'MP3', link: genLink('mp3'), custom_fn: openPopup },
{ codec: 'M4A', link: genLink('m4a'), custom_fn: openPopup },
{ codec: 'WEBM', link: genLink('webm'), custom_fn: openPopup },
{ codec: 'AAC', link: genLink('aac'), custom_fn: openPopup },
{ codec: 'FLAC', link: genLink('flac'), custom_fn: openPopup },
{ codec: 'OPUS', link: genLink('opus'), custom_fn: openPopup },
{ codec: 'OGG', link: genLink('ogg'), custom_fn: openPopup },
{ codec: 'WAV', link: genLink('wav'), custom_fn: openPopup },
];
function openPopup(item) {
NOVA.openPopup({ 'url': item.url, width: 420, height: 80 });
}
},
third_party() {
return [
{
quality: 'mp3,mp4',
codec: 'yt-download.org',
link_new_tab: 'https://yt-download.org/api/widgetv2?url=https://www.youtube.com/watch?v=' + APIs.videoId,
},
{
quality: 'mp3,mp4',
codec: 'Y2Mate.tools',
link_new_tab: 'https://www.y2mate.com/youtube/' + APIs.videoId,
},
{
quality: 'mp3,mp4',
codec: 'TubeMP3.to',
link_new_tab: 'https://tubemp3.to/' + APIs.videoId,
},
{
quality: 'mp3,mp4',
codec: 'yloader.ws',
link_new_tab: 'https://yloader.ws/yturlmp4/' + APIs.videoId,
},
{
quality: 'mp3,mp4,ogg',
codec: 'yt5s.com',
link_new_tab: 'https://yt5s.com/watch?v=' + APIs.videoId,
},
{
quality: 'mp3,mp4,ogg',
codec: 'x2download.app',
link_new_tab: 'https://x2download.app/watch?v=' + APIs.videoId,
},
{
quality: 'mp3,mp4,ogg',
codec: 'savefrom.net',
link_new_tab: 'https://savefrom.net/https://www.youtube.com/watch?v=' + APIs.videoId,
},
{
quality: 'mp3,mp4',
codec: 'yt1s.ltd',
codec: 'yt1s.com',
link_new_tab: 'https://yt1s.com/watch?v=' + APIs.videoId,
},
{
quality: 'MP3,MP4,M4A,MP4,MKV',
codec: 'clipconverter.cc',
link_new_tab: 'https://www.clipconverter.cc/3/?url=https://www.youtube.com/watch?v=' + APIs.videoId,
},
{
quality: 'mp3',
codec: 'conv2.be',
link_new_tab: 'https://conv2.be/watch?v=' + APIs.videoId,
},
{
quality: 'mp3',
codec: 'YTMP3X.com',
link_new_tab: 'https://ytmp3x.com/' + APIs.videoId,
},
];
},
async getInternalListUrls() {
let decryptSigFn;
const
URL = NOVA.queryURL.set({ 'pbj': 1 }),
headers = {
'x-youtube-client-name': 1,
'x-youtube-client-version': window.ytcfg.data_.INNERTUBE_CONTEXT_CLIENT_VERSION,
};
if (token = window.ytcfg?.data_?.ID_TOKEN) {
headers['x-youtube-identity-token'] = token;
};
return await fetch(URL, { 'headers': headers })
.then(res => res.json())
.then(data => data?.find(i => i.playerResponse?.streamingData)?.playerResponse.streamingData)
.then(async streamingData => {
console.debug('streamingData', streamingData);
const vidListData = [...streamingData.formats, ...streamingData.adaptiveFormats];
decryptSigFn = vidListData.find(o => (o.cipher || o.signatureCipher)) && await getDecryptSigFn();
return vidListData
.map(obj => {
if (dict = parseQuery(obj.cipher || obj.signatureCipher)) {
obj.url = `${dict.url}&${dict.sp}=${encodeURIComponent(decsig(dict.s))}`;
}
if (obj.url) {
let label = obj.mimeType?.match(/codecs="(.*?)"/i)[1].split('.')[0].toLocaleUpperCase();
if (!obj.mimeType?.includes('mp4a') && !obj.mimeType?.includes('audio')) {
label += ' / No Sound';
}
obj.mimeType?.includes('audio')
? obj.qualityLabel = fmtBitrate(obj.bitrate)
: obj.qualityLabel += ' ' + fmtSize(obj.contentLength);
return {
'codec': label,
'quality': obj.qualityLabel,
'link_new_tab': obj.url,
};
}
})
})
.catch(error => {
console.error('Error get vids:', error);
throw error;
});
function parseQuery(str) {
return str && Object.fromEntries(
str
.split(/&/)
.map(c => {
const [key, ...v] = c.split('=');
return [key, decodeURIComponent(v.join('='))];
}) || []
);
}
async function getDecryptSigFn() {
const
basejsUrl = getBasejs() || document.querySelector('script[src$="/base.js"]')?.src,
basejsBlob = await fetch(basejsUrl);
return parseDecSig(await basejsBlob.text());
function getBasejs() {
if (typeof ytplayer === 'object'
&& (endpoint = ytplayer.config?.assets?.js
|| ytplayer.web_player_context_config?.jsUrl)
) {
return 'https://' + location.host + endpoint;
}
}
function parseDecSig(text_content) {
const escapeRegExp = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
try {
if (text_content.startsWith('var script')) {
const obj = {};
eval(text_content);
text_content = obj.innerHTML;
}
const fnNameResult = /=([a-zA-Z0-9\$_]+?)\(decodeURIComponent/.exec(text_content);
const fnName = fnNameResult[1];
const _argNameFnBodyResult = new RegExp(escapeRegExp(fnName) + '=function\\((.+?)\\){((.+)=\\2.+?)}')
.exec(text_content);
const [_, argname, fnBody] = _argNameFnBodyResult;
const helperNameResult = /;([a-zA-Z0-9$_]+?)\..+?\(/.exec(fnBody);
const helperName = helperNameResult[1];
const helperResult = new RegExp('var ' + escapeRegExp(helperName) + '={[\\s\\S]+?};').exec(text_content);
const helper = helperResult[0];
return new Function([argname], helper + '\n' + fnBody);
} catch (error) {
console.error('parseDecSig', error);
}
}
}
function decsig(_sig) {
const sig = eval("(" + decryptSigFn + ") (\"" + _sig + "\")");
return sig;
}
},
};
function downloadFile(url = required()) {
const d = document.createElement('a');
d.style.display = 'none';
d.download = (movie_player.getVideoData().title
.replace(/[\\/:*?"<>|]+/g, '')
.replace(/\s+/g, ' ').trim()) + '.mp4';
d.href = url;
document.body.append(d);
d.click();
d.remove();
}
function fmtBitrate(size) {
return fmtSize(size, ['kbps', 'Mbps', 'Gbps'], 1000);
}
function fmtSize(size, units = ['kB', 'MB', 'GB'], divisor = 1024) {
size = Math.abs(+size);
if (size === 0) return 'n/a';
size /= divisor;
for (let i = 0; i < units.length; ++i) {
if (size < 10) return Math.round(size * 100) / 100 + units[i];
else if (size < 100) return Math.round(size * 10) / 10 + units[i];
else if (size < 1000 || i == (units.length - 1)) return Math.round(size) + units[i];
}
}
function convertSizeToBytes(size) {
const units = {
B: 1,
KB: 1024,
MB: 1024 * 1024,
GB: 1024 * 1024 * 1024,
};
const regex = /^(\d+(?:\.\d+)?)\s*([A-Z]+)$/i;
const match = size.match(regex);
if (!match) return 0;
const value = parseFloat(match[1]);
const unit = match[2].toUpperCase();
if (!units.hasOwnProperty(unit)) return 0;
return value * units[unit];
}
},
options: {
download_video_mode: {
_tagName: 'select',
label: 'Mode',
'label:zh': '模式',
'label:ja': 'モード',
'label:pl': 'Tryb',
options: [
{
label: 'Cobalt', value: 'cobalt', selected: true,
},
{
label: 'loader.to', value: 'loader.to',
},
{
label: 'multi 3rd party', value: 'third_party_methods',
},
{
label: 'direct', value: 'direct',
},
],
},
}
});
window.nova_plugins.push({
id: 'auto-likes',
title: 'Auto-like',
run_on_pages: 'watch, -mobile',
section: 'details-buttons',
_runtime: user_settings => {
if (user_settings['details-buttons']
&& (user_settings.details_buttons_hide?.includes('all') || user_settings.details_buttons_hide.includes('like_dislike'))
) {
return;
}
const SELECTOR_LIKE_BTN = 'ytd-watch-metadata #actions like-button-view-model button';
NOVA.waitSelector('#movie_player video')
.then(video => {
video.addEventListener('loadeddata', () => {
if (user_settings.auto_likes_for_subscribed
|| movie_player.getVideoData().isLive
) {
Timer.disable = true;
}
else Timer.reset.bind(Timer)
});
video.addEventListener('playing', Timer.start.bind(Timer, video.playbackRate));
video.addEventListener('pause', Timer.pause.bind(Timer));
video.addEventListener('timeupdate', function () {
if (Timer.disable || isNaN(this.duration)) return;
if ((+Timer.progressTime / this.duration) > ((Math.trunc(user_settings.auto_likes_percent) / 100) || .8)) {
Timer.disable = true;
setLike();
NOVA.showOSD('Auto-like is activation');
}
});
});
NOVA.runOnPageLoad(async () => {
if (NOVA.currentPage != 'watch') return;
NOVA.waitSelector(`${SELECTOR_LIKE_BTN}[aria-pressed="true"]`, { destroy_after_page_leaving: true })
.then(() => {
if (Timer.disable) return;
Timer.disable = true;
NOVA.showOSD('Auto-like is deactivated');
});
if (user_settings.auto_likes_for_subscribed) {
NOVA.waitSelector('#subscribe-button [subscribed]', { destroy_after_page_leaving: true })
.then(() => {
Timer.disable = false;
NOVA.showOSD('Auto-like is enable');
});
}
});
function setLike() {
const likeBtn = document.body.querySelector(SELECTOR_LIKE_BTN);
if (!isLiked()) likeBtn.click();
function isLiked() {
return likeBtn.getAttribute('aria-pressed') == 'true';
}
}
const Timer = {
progressTime: 0,
start(delta = 1) {
if (this.disable) return;
this.timer = setInterval(function () {
Timer.progressTime += 1 * delta;
}, 1000);
},
pause() {
if (typeof this.timer === 'number') clearInterval(this.timer);
},
reset() {
this.disable = false;
this.progressTime = 0;
},
};
},
options: {
auto_likes_percent: {
_tagName: 'input',
label: 'Watch threshold in %',
'label:zh': '观察阈值（%）',
'label:ja': '監視しきい値 (%)',
'label:pl': 'Próg oglądania w%',
type: 'number',
title: '10-90%',
title: 'Percentage of views at which a video is liked',
'title:zh': '视频在时间进度后被点赞',
'title:ja': '時間の経過後にビデオが「いいね！」される',
placeholder: '%',
step: 5,
min: 10,
max: 90,
value: 80,
},
auto_likes_for_subscribed: {
_tagName: 'input',
label: 'Only for subscribed',
type: 'checkbox',
},
}
});
window.nova_plugins.push({
id: 'video-date-format',
title: 'Date format display',
'title:zh': '显示日期格式',
'title:ja': '日付形式の表示',
run_on_pages: 'watch, -mobile',
section: 'details',
opt_api_key_warn: true,
_runtime: user_settings => {
const
CACHE_PREFIX = 'nova-video-date:',
DATE_SELECTOR_ID = 'nova-video-published-date';
NOVA.runOnPageLoad(async () => {
if (NOVA.currentPage == 'watch') {
await NOVA.waitUntil(() => typeof movie_player === 'object', 1000);
NOVA.waitSelector('#title h1', { destroy_after_page_leaving: true })
.then(el => setVideoDate(el));
}
});
function setVideoDate(container = required()) {
const videoId = NOVA.queryURL.get('v') || movie_player.getVideoData().video_id;
if ((storage = sessionStorage.getItem(CACHE_PREFIX + videoId))
&& storage.format == user_settings.video_date_format
) {
return insertToHTML({ 'text': storage.date, 'container': container });
}
NOVA.request.API({
request: 'videos',
params: {
'id': videoId,
'part': 'snippet,liveStreamingDetails'
+ (user_settings.video_view_count ? ',statistics' : '')
},
api_key: user_settings['user-api-key'],
})
.then(res => {
if (res?.error) return alert(`Error [${res.code}]: ${res.reason}\n` + res.error);
res?.items?.forEach(item => {
let outList = [];
if (user_settings.video_view_count && item.statistics.viewCount) {
switch (user_settings.video_view_count) {
case 'friendly':
outList.push(NOVA.numberFormat.friendly(item.statistics.viewCount), 'views');
break;
default:
outList.push(NOVA.numberFormat.abbr(item.statistics.viewCount), 'views');
break;
}
}
if (item.liveStreamingDetails) {
if (movie_player.getVideoData().isLive || item.snippet.liveBroadcastContent == 'live') {
outList.push('Active Livestream',
NOVA.dateFormat.apply(new Date(item.liveStreamingDetails.actualStartTime), [user_settings.video_date_format])
);
}
else if (item.liveStreamingDetails.actualEndTime) {
const
timeStart = new Date(item.liveStreamingDetails.actualStartTime),
timeEnd = new Date(item.liveStreamingDetails.actualEndTime),
sameDate = timeStart.getDay() === timeEnd.getDay();
outList.push(
document.body.querySelector('ytd-watch-flexy')?.playerData?.videoDetails?.isLiveContent
? 'Streamed'
: 'Premiered'
);
if (!sameDate) outList.push('from');
outList.push(NOVA.dateFormat.apply(timeStart, [user_settings.video_date_format]));
if (!sameDate) {
outList.push('until',
NOVA.dateFormat.apply(timeEnd, [user_settings.video_date_format])
);
}
}
else if (item.snippet.liveBroadcastContent == 'upcoming') {
outList.push('Scheduled',
NOVA.dateFormat.apply(new Date(item.liveStreamingDetails.scheduledStartTime), [user_settings.video_date_format])
);
}
}
else if (item.snippet.publishedAt) {
const publishedDate = new Date(item.snippet.publishedAt);
if (user_settings.video_date_format == 'ago') {
outList.push(NOVA.formatTimeOut.ago(publishedDate), 'ago');
}
else {
outList.push(NOVA.dateFormat.apply(publishedDate, [user_settings.video_date_format]));
}
}
if (outList.length) {
insertToHTML({ 'text': outList.join(' '), 'container': container });
sessionStorage.setItem(CACHE_PREFIX + videoId, JSON.stringify({
'date': outList.join(' '),
'format': user_settings.video_date_format
}));
}
});
});
function insertToHTML({ text = '', container = required() }) {
if (!(container instanceof HTMLElement)) return console.error('container not HTMLElement:', container);
(document.getElementById(DATE_SELECTOR_ID) || (() => {
const el = document.createElement('span');
el.id = DATE_SELECTOR_ID;
el.className = 'style-scope yt-formatted-string bold';
el.style.cssText = 'font-size: 1.35rem; line-height: 2rem; font-weight:400;';
container.after(el);
return el;
})())
.textContent = text;
}
}
},
options: {
video_view_count: {
_tagName: 'select',
label: 'Show views count format',
options: [
{ label: 'disable', value: false, },
{ label: '9.9K', value: 'abbr', selected: true },
{ label: '9,999', value: 'friendly' },
],
},
video_date_format: {
_tagName: 'select',
label: 'Date pattern',
options: [
{ label: 'ago', value: 'ago' },
{ label: 'January 20, 1999', value: 'MMMM D, YYYY' },
{ label: '20 Jan 1999', value: 'D MMM YYYY' },
{ label: '20 Jan 1999 at 23:59', value: 'D MMM YYYY at H:mm', selected: true },
{ label: 'Mon 20/01/1999 23:59', value: 'DDD DD/MM/YYYY H:mm' },
{ label: 'Monday 20/01/1999 23:59', value: 'DDDD DD/MM/YYYY H:mm' },
{ label: '1999/01/20', value: 'YYYY/MM/DD' },
{ label: '1999/01/20 at 23:59', value: 'YYYY/MM/DD at H:mm' },
{ label: '1999-01-20', value: 'YYYY-MM-D' },
{ label: '1999-01-20 at 23:59', value: 'YYYY-MM-D at H:mm' },
{ label: '1999.1.20', value: 'YYYY.M.D' },
{ label: '1999.1.20 at 23:59', value: 'YYYY.M.D at H:mm' },
{ label: '01/20/1999', value: 'MM/DD/YYYY' },
{ label: '01/20/1999 at 23:59', value: 'MM/DD/YYYY at H:mm' },
{ label: '01-20-1999', value: 'MM-D-YYYY' },
{ label: '01-20-1999 at 23:59', value: 'MM-D-YYYY at H:mm' },
{ label: '01.20.1999', value: 'MM.D.YYYY' },
{ label: '01.20.1999 at 23:59', value: 'MM.D.YYYY at H:mm' },
],
},
}
});
window.nova_plugins.push({
id: 'transcript',
title: 'Show transcript',
run_on_pages: 'watch, -mobile',
section: 'details-buttons',
_runtime: user_settings => {
const
BTN_SELECTOR_ID = 'nova-transcript-button',
BTN_SELECTOR = '#' + BTN_SELECTOR_ID;
NOVA.runOnPageLoad(async () => {
if (NOVA.currentPage != 'watch') return;
if (await NOVA.storage_obj_manager.getParam('transcript')) {
NOVA.waitSelector(BTN_SELECTOR, { destroy_after_page_leaving: true })
.then(btn => {
btn.style.display = 'flex';
switch (user_settings.transcript_visibility_mode) {
case 'button': transcriptExpand(); break;
case 'external':
case 'external-popup':
transcriptOpenLink();
break;
}
});
return;
}
switch (user_settings.transcript_visibility_mode) {
case 'expand':
NOVA.waitSelector('[target-id="engagement-panel-searchable-transcript"][visibility="ENGAGEMENT_PANEL_VISIBILITY_HIDDEN"]', { destroy_after_page_leaving: true })
.then(transcriptEl => {
transcriptEl.setAttribute('visibility', 'ENGAGEMENT_PANEL_VISIBILITY_EXPANDED');
});
break;
default:
NOVA.waitSelector(BTN_SELECTOR, { destroy_after_page_leaving: true })
.then(btn => {
btn.style.display = document.body.querySelector('#description ytd-video-description-transcript-section-renderer button, [target-id="engagement-panel-searchable-transcript"]') ? 'flex' : 'none';
});
break;
}
});
switch (user_settings.transcript_visibility_mode) {
case 'button':
NOVA.waitSelector('ytd-watch-metadata #actions #top-level-buttons-computed')
.then(container => {
insertToHTML({ 'container': container, 'position': 'beforebegin' })
.addEventListener('click', transcriptExpand);
});
break;
case 'external':
case 'external-popup':
NOVA.waitSelector('ytd-watch-metadata #actions #top-level-buttons-computed')
.then(container => {
insertToHTML({ 'container': container, 'position': 'beforebegin' })
.addEventListener('click', transcriptOpenLink);
});
break;
}
function transcriptExpand() {
if (btn = document.body.querySelector('#description ytd-video-description-transcript-section-renderer button')) {
btn.click()
}
else if (transcriptEl = document.body.querySelector('[target-id="engagement-panel-searchable-transcript"][visibility="ENGAGEMENT_PANEL_VISIBILITY_HIDDEN"]')) {
transcriptEl.setAttribute('visibility', 'ENGAGEMENT_PANEL_VISIBILITY_EXPANDED');
}
}
function transcriptOpenLink() {
const url = 'https://www.youtubetranscript.com/' + location.search;
window.open(url, '_blank', user_settings.transcript_visibility_mode == 'external-popup'
? `popup=1,toolbar=no,location=no,directories=no,status=no,menubar=no,resizable=yes,copyhistory=no`
: '')
}
function insertToHTML({ container = required(), position = 'beforebegin' }) {
if (!(container instanceof HTMLElement)) return console.error('container not HTMLElement:', container);
return (document.getElementById(BTN_SELECTOR_ID) || (function () {
NOVA.css.push(
`${BTN_SELECTOR} {
border: 0;
cursor: pointer;
text-decoration: none;
font-weight: bold;
margin: 0 var(--ytd-subscribe-button-margin, 12px);
}`);
container.insertAdjacentHTML(position,
`<button id="${BTN_SELECTOR_ID}" style="display:flex" title="Show Transcript" class="style-scope yt-formatted-string bold yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m">
<span class="yt-spec-button-shape-next__icon" style="height:100%">
<svg viewBox="0 0 24 24" height="100%" width="100%">
<g fill="currentColor">
<path d="M20 12V13C20 17.4183 16.4183 21 12 21C7.58172 21 4 17.4183 4 13V12M12 17C9.79086 17 8 15.2091 8 13V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V13C16 15.2091 14.2091 17 12 17Z" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</g>
</svg>
</span>
<span class="yt-spec-button-shape-next__button-text-content" style="align-self:center;">Transcript</span>
</button>`);
return document.getElementById(BTN_SELECTOR_ID);
})());
}
},
options: {
transcript_visibility_mode: {
_tagName: 'select',
label: 'Mode',
'label:zh': '模式',
'label:ja': 'モード',
'label:pl': 'Tryb',
options: [
{
label: 'expand default section', selected: true,
},
{
label: 'add button', value: 'button',
},
{
label: 'link to external', value: 'external',
},
{
label: 'link to external (popup)', value: 'external-popup',
},
],
},
}
});
window.nova_plugins.push({
id: 'video-title-hashtag',
title: 'Title hashtag',
run_on_pages: 'watch',
section: 'details',
_runtime: user_settings => {
let cssObj = {};
switch (user_settings.title_hashtag_visibility_mode) {
case 'uncolorize':
cssObj['color'] = 'var(--yt-endpoint-color, var(--yt-spec-text-primary))';
break;
default:
cssObj['display'] = 'none';
break;
}
if (Object.keys(cssObj).length) {
NOVA.css.push(cssObj, 'h1 a[href*="/hashtag/"]', 'important');
}
},
options: {
title_hashtag_visibility_mode: {
_tagName: 'select',
label: 'Mode',
'label:zh': '模式',
'label:ja': 'モード',
'label:pl': 'Tryb',
options: [
{
label: 'hide', selected: true,
},
{
label: 'uncolorize', value: 'uncolorize',
},
],
},
}
});
window.nova_plugins.push({
id: 'channel-videos-count',
title: 'Show channel videos count',
'title:zh': '显示频道上的视频数量',
'title:ja': 'チャンネルの動画数を表示する',
'title:pl': 'Pokaż liczbę filmów na kanale',
run_on_pages: 'watch, -mobile',
restart_on_location_change: true,
section: 'details',
opt_api_key_warn: true,
desc: 'Display uploaded videos on channel',
'desc:zh': '在频道上显示上传的视频',
'desc:ja': 'アップロードした動画をチャンネルに表示',
'desc:pl': 'Wyświetla przesłane filmy na kanale',
_runtime: user_settings => {
const
CACHE_PREFIX = 'nova-channel-videos-count:',
SELECTOR_ID = 'nova-video-count';
NOVA.waitSelector('#upload-info #owner-sub-count, ytm-slim-owner-renderer .subhead', { destroy_after_page_leaving: true })
.then(el => setVideoCount(el));
async function setVideoCount(container = required()) {
await NOVA.delay(500);
const channelId = NOVA.getChannelId();
if (!channelId) return console.error('setVideoCount channelId: empty', channelId);
if (storage = sessionStorage.getItem(CACHE_PREFIX + channelId)) {
insertToHTML({ 'text': storage, 'container': container });
}
else {
NOVA.request.API({
request: 'channels',
params: { 'id': channelId, 'part': 'statistics' },
api_key: user_settings['user-api-key'],
})
.then(res => {
if (res?.error) return alert(`Error [${res.code}]: ${res.reason}\n` + res.error);
res?.items?.forEach(item => {
if (videoCount = NOVA.numberFormat.abbr(item.statistics.videoCount)) {
insertToHTML({ 'text': videoCount, 'container': container });
sessionStorage.setItem(CACHE_PREFIX + channelId, videoCount);
} else console.warn('API is change', item);
});
});
}
function insertToHTML({ text = '', container = required() }) {
if (!(container instanceof HTMLElement)) return console.error('container not HTMLElement:', container);
(document.getElementById(SELECTOR_ID) || (function () {
container.insertAdjacentHTML('beforeend',
`<span class="date style-scope ytd-video-secondary-info-renderer" style="margin-right:5px;"> • <span id="${SELECTOR_ID}">${text}</span> videos</span>`);
return document.getElementById(SELECTOR_ID);
})())
.textContent = text;
container.title = `${text} videos`;
}
}
},
});
window.nova_plugins.push({
id: 'save-to-playlist',
title: 'Add sort/filter to "Save to playlist" menu',
'title:zh': '将排序/过滤器添加到“保存到播放列表”菜单',
'title:ja': '「プレイリストに保存」メニューにソート/フィルターを追加',
'title:pl': 'Dodaj sortowanie/filtr do menu „Zapisz na liście odtwarzania”.',
run_on_pages: 'home, feed, results, channel, watch, -mobile',
section: 'details-buttons',
_runtime: user_settings => {
NOVA.waitSelector('tp-yt-paper-dialog #playlists')
.then(playlists => {
const container = playlists.closest('tp-yt-paper-dialog');
new IntersectionObserver(([entry]) => {
const searchInput = container.querySelector('input[type=search]');
if (entry.isIntersecting) {
if (user_settings.save_to_playlist_sort) sortPlaylistsMenu(playlists);
if (!searchInput) {
insertFilterInput(
document.body.querySelector('ytd-add-to-playlist-renderer #header ytd-menu-title-renderer')
);
}
}
else if (searchInput) {
searchInput.value = '';
searchInput.dispatchEvent(new Event('change'));
}
})
.observe(container);
});
function sortPlaylistsMenu(playlists = required()) {
if (!(playlists instanceof HTMLElement)) return console.error('playlists not HTMLElement:', playlists);
playlists.append(
...Array.from(playlists.childNodes)
.sort(sortByLabel)
);
function sortByLabel(a, b) {
const getLabel = el => el.innerText.trim();
return stringLocaleCompare(getLabel(a), getLabel(b));
function stringLocaleCompare(a = required(), b = required()) {
return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
}
}
}
function insertFilterInput(container = required()) {
if (!(container instanceof HTMLElement)) return console.error('container not HTMLElement:', container);
const searchInput = document.createElement('input');
searchInput.setAttribute('type', 'search');
searchInput.setAttribute('placeholder', 'Playlists Filter');
Object.assign(searchInput.style, {
padding: '.4em .6em',
border: 0,
outline: 0,
'min-width': '250px',
width: '100%',
height: '2.5em',
color: 'var(--ytd-searchbox-text-color)',
'background-color': 'var(--ytd-searchbox-background)',
});
['change', 'keyup'].forEach(evt => {
searchInput
.addEventListener(evt, function () {
NOVA.searchFilterHTML({
'keyword': this.value,
'filter_selectors': '#playlists #checkbox',
'highlight_selector': '#label',
});
});
searchInput
.addEventListener('click', () => {
searchInput.value = '';
searchInput.dispatchEvent(new Event('change'));
});
});
const containerDiv = document.createElement('div');
Object.assign(containerDiv.style, {
'margin-top': '.5em',
display: 'flex',
gap: '10px',
});
if (!user_settings.save_to_playlist_sort) {
const sortButton = document.createElement('button');
sortButton.textContent = 'A-Z ↓';
Object.assign(sortButton.style, {
padding: '.4em .6em',
border: 0,
outline: 0,
'border-radius': '4px',
color: 'var(--ytd-searchbox-text-color)',
'background-color': 'var(--ytd-searchbox-background)',
'white-space': 'nowrap',
'cursor': 'pointer',
});
sortButton.addEventListener('click', () => {
sortButton.remove();
sortPlaylistsMenu(document.body.querySelector('tp-yt-paper-dialog #playlists'));
}, { capture: true, once: true });
containerDiv.append(sortButton);
}
containerDiv.append(searchInput);
container.append(containerDiv);
};
},
options: {
save_to_playlist_sort: {
_tagName: 'input',
label: 'Default sorting alphabetically',
'label:zh': '默认按字母顺序排序',
'label:ja': 'デフォルトのアルファベット順のソート',
'label:pl': 'Domyślne sortowanie alfabetyczne',
type: 'checkbox',
},
}
});
window.nova_plugins.push({
id: 'description-popup',
title: 'Description section in popup',
'title:zh': '弹出窗口中的描述部分',
'title:ja': 'ポップアップの説明セクション',
'title:pl': 'Opis w osobnym oknie',
run_on_pages: 'watch, -mobile',
section: 'details',
'plugins-conflict': 'description-timestamps-scroll',
_runtime: user_settings => {
const
DESCRIPTION_SELECTOR = 'html:not(:fullscreen) ytd-watch-metadata #description.ytd-watch-metadata:not([hidden]):not(:empty)',
DATE_SELECTOR_ID = 'nova-description-date';
NOVA.waitSelector('#masthead-container')
.then(masthead => {
NOVA.css.push(
`${DESCRIPTION_SELECTOR},
${DESCRIPTION_SELECTOR}:before {
position: fixed;
top: ${masthead.offsetHeight || 56}px;
right: 0;
z-index: ${1 + Math.max(getComputedStyle(masthead || movie_player)['z-index'], 601)};
}
${DESCRIPTION_SELECTOR}:not(:hover):before {
content: "info ▼";
cursor: pointer;
visibility: visible;
right: 12.5em;
padding: 0 8px 2px;
line-height: normal;
font-family: Roboto, Arial, sans-serif;
font-size: 11px;
color: #eee;
background-color: rgba(0, 0, 0, .3);
}
${DESCRIPTION_SELECTOR} {
margin: 0 1%;
overflow-y: auto;
max-height: 88vh;
max-width: 55%;
background-color: var(--yt-spec-brand-background-primary);
background-color: var(--yt-spec-menu-background);
background-color: var(--yt-spec-raised-background);
color: var(--yt-spec-text-primary);;
border: 1px solid #333;
${user_settings['square-avatars'] ? 'border-radius: 0' : ''};
}
${DESCRIPTION_SELECTOR}:not(:hover) {
visibility: collapse;
overflow: hidden;
}
${DESCRIPTION_SELECTOR}:hover {
visibility: visible !important;
}
${DESCRIPTION_SELECTOR}::-webkit-scrollbar {
height: 8px;
width: 10px;
}
${DESCRIPTION_SELECTOR}::-webkit-scrollbar-button {
height: 0;
width: 0;
}
${DESCRIPTION_SELECTOR}::-webkit-scrollbar-corner {
background-color: transparent;
}
${DESCRIPTION_SELECTOR}::-webkit-scrollbar-thumb {
background-color: #e1e1e1;
border: 0;
border-radius: 0;
}
${DESCRIPTION_SELECTOR}::-webkit-scrollbar-track {
background-color: #666;
border: 0;
border-radius: 0;
}
${DESCRIPTION_SELECTOR}::-webkit-scrollbar-track:hover {
background-color: #666;
}`);
});
NOVA.waitSelector(DESCRIPTION_SELECTOR)
.then(descriptionEl => {
descriptionEl.addEventListener('mouseenter', evt => {
document.body.querySelector('#meta [collapsed] #more, [description-collapsed] #description #expand')
?.click();
});
});
if (!user_settings['video-date-format']) {
NOVA.runOnPageLoad(() => (NOVA.currentPage == 'watch') && restoreDateLine());
}
let oldDateText;
function restoreDateLine() {
NOVA.waitSelector('#title h1')
.then(container => {
NOVA.waitSelector('ytd-watch-metadata #description.ytd-watch-metadata')
.then(async textDateEl => {
await NOVA.waitUntil(() => {
if ((text = [...textDateEl.querySelectorAll('span.bold.yt-formatted-string:not(:empty)')]
.map(e => e.textContent)
?.join('').trim()
)
&& text != oldDateText
) {
oldDateText = text;
insertToHTML({ 'text': oldDateText, 'container': container });
return true;
}
}, 1000);
});
});
function insertToHTML({ text = '', container = required() }) {
if (!(container instanceof HTMLElement)) return console.error('container not HTMLElement:', container);
(document.getElementById(DATE_SELECTOR_ID) || (function () {
const el = document.createElement('span');
el.id = DATE_SELECTOR_ID;
el.className = 'style-scope yt-formatted-string bold';
el.style.cssText = 'font-size: 1.35rem; line-height: 2rem; font-weight:400;';
container.after(el);
return el;
})())
.textContent = text;
}
}
},
});
window.nova_plugins.push({
id: 'details-buttons-visibility',
title: 'Buttons hide',
'title:zh': '按钮隐藏',
'title:ja': 'ボタンを非表示にする',
run_on_pages: 'watch, -mobile',
section: 'details-buttons',
_runtime: user_settings => {
const SELECTOR_BTN_CONTAINER = 'ytd-watch-metadata #actions';
if (user_settings.details_buttons_hide?.length
&& (stylesList = getHideButtonsList())
&& stylesList.length
) {
NOVA.css.push(stylesList.join(',\n') + ` {
display: none !important;
background-color: red;
}`);
}
function getHideButtonsList() {
let stylesList = [];
if (user_settings.details_buttons_hide?.includes('subscribe')) {
stylesList.push('#owner #subscribe-button');
}
if (user_settings.details_buttons_hide.includes('join')) {
stylesList.push('#sponsor-button');
}
if (user_settings.details_buttons_hide?.includes('all')) {
stylesList.push(`${SELECTOR_BTN_CONTAINER} button`);
return stylesList;
}
if (user_settings.details_buttons_hide.includes('like_dislike')) {
stylesList.push(`${SELECTOR_BTN_CONTAINER} segmented-like-dislike-button-view-model`);
}
else if (user_settings.details_buttons_hide.includes('dislike')) {
stylesList.push(`${SELECTOR_BTN_CONTAINER} dislike-button-view-model, ${SELECTOR_BTN_CONTAINER} .yt-spec-button-shape-next--segmented-start::after`);
NOVA.css.push(
`${SELECTOR_BTN_CONTAINER} segmented-like-dislike-button-view-model button {
border-radius: 20px;
}`);
}
if (user_settings.details_buttons_hide.includes('download')) {
stylesList.push(`${SELECTOR_BTN_CONTAINER} ytd-download-button-renderer`);
NOVA.css.push(`#flexible-item-buttons { width: inherit; }`);
}
if (CSS.supports('selector(:has(*))')) {
const buttonSelectors = [
`${SELECTOR_BTN_CONTAINER} ytd-button-renderer`,
`${SELECTOR_BTN_CONTAINER} button`,
'ytd-popup-container ytd-menu-service-item-renderer',
];
if (user_settings.details_buttons_hide.includes('share')) {
stylesList.push(buttonSelectors.map(e => `\n${e}:has(path[d^="M15 5.63 20.66"])`));
}
if (user_settings.details_buttons_hide.includes('thanks')) {
stylesList.push(buttonSelectors.map(e => `\n${e}:has(path[d^="M11 17h2v-1h1c.55"])`));
}
if (user_settings.details_buttons_hide.includes('clip')) {
stylesList.push(buttonSelectors.map(e => `\n${e}:has(path[d^="M8 7c0 .55-.45"])`));
}
if (user_settings.details_buttons_hide.includes('save')) {
stylesList.push(buttonSelectors.map(e => `\n${e}:has(path[d^="M22 13h-4v4h"])`));
}
if (user_settings.details_buttons_hide.includes('report')) {
stylesList.push(buttonSelectors.map(e => `\n${e}:has(path[d^="m13.18 4 .24 "])`));
}
if (user_settings.details_buttons_hide.includes('transcript')) {
stylesList.push(buttonSelectors.map(e => `\n${e}:has(path[d^="M5,11h2v2H5V11z"])`));
}
}
return stylesList;
}
let stylesTextHideLabel = '';
if (user_settings.details_buttons_label_hide) {
stylesTextHideLabel +=
`${SELECTOR_BTN_CONTAINER} button [class*=text] {
display: none;
}
${SELECTOR_BTN_CONTAINER} button .yt-spec-button-shape-next__icon {
margin: 0 !important;
}
${SELECTOR_BTN_CONTAINER} segmented-like-dislike-button-view-model button,
${SELECTOR_BTN_CONTAINER} segmented-like-dislike-button-view-model ~ * button,
${SELECTOR_BTN_CONTAINER} button.yt-spec-button-shape-next--size-m {
padding: 0 7px;
}
${SELECTOR_BTN_CONTAINER} ytd-menu-renderer[has-items] yt-button-shape.ytd-menu-renderer {
margin: 0 !important;
}`;
}
if (+user_settings.details_buttons_opacity) {
stylesTextHideLabel +=
`#owner #subscribe-button:not(:hover),
${SELECTOR_BTN_CONTAINER} #menu:not(:hover) {
transition: opacity .2s ease-in-out;
opacity: ${user_settings.details_buttons_opacity || .1};
}`;
}
if (stylesTextHideLabel.length) {
NOVA.css.push(stylesTextHideLabel);
}
},
options: {
details_buttons_label_hide: {
_tagName: 'input',
label: 'Buttons without labels',
'label:zh': '没有标签的按钮',
'label:ja': 'ラベルのないボタン',
'label:pl': 'Guziki bez etykiet',
type: 'checkbox',
title: 'Requires support for css tag ":has()"',
},
details_buttons_opacity: {
_tagName: 'input',
label: 'Opacity',
'label:zh': '不透明度',
'label:ja': '不透明度',
'label:pl': 'Przejrzystość',
type: 'number',
title: '0 - disable',
placeholder: '0-1',
step: .05,
min: 0,
max: 1,
value: .9,
},
details_buttons_hide: {
_tagName: 'select',
label: 'Hide items',
title: '[Ctrl+Click] to select several',
'title:zh': '[Ctrl+Click] 选择多个',
'title:ja': '「Ctrl+Click」して、いくつかを選択します',
'title:pl': 'Ctrl+kliknięcie, aby zaznaczyć kilka',
multiple: null,
size: 8,
options: [
{
label: 'subscribe', value: 'subscribe',
},
{
label: 'join', value: 'join',
},
{
label: 'all (below)', value: 'all',
},
{
label: 'like+dislike', value: 'like_dislike',
},
{
label: 'dislike', value: 'dislike',
},
{
label: 'share', value: 'share',
},
{
label: 'clip', value: 'clip',
},
{
label: 'save', value: 'save',
},
{
label: 'download', value: 'download',
},
{
label: 'thanks', value: 'thanks',
},
{
label: 'report', value: 'report',
},
{
label: 'transcript', value: 'transcript',
},
],
},
}
});
window.nova_plugins.push({
id: 'redirect-disable',
title: 'Clear links from redirect',
'title:zh': '清除重定向中的链接',
'title:ja': 'リダイレクトからリンクをクリアする',
'title:pl': 'Wyczyść linki z przekierowań',
run_on_pages: 'watch, channel',
section: 'details',
desc: 'Direct external links',
'desc:zh': '直接链接到外部站点',
'desc:ja': '外部サイトへの直接リンク',
'desc:pl': 'Bezpośrednie łącza zewnętrzne',
_runtime: user_settings => {
document.addEventListener('click', evt => evt.isTrusted && patchLink(evt.target), { capture: true });
document.addEventListener('auxclick', evt => evt.isTrusted && evt.button === 1 && patchLink(evt.target), { capture: true });
const linkSelector = 'a[href*="/redirect?"]';
function patchLink(target = required()) {
if (!target.matches(linkSelector)) {
if (!(target = target.parentElement.matches(linkSelector))) return;
}
if (q = NOVA.queryURL.get('q', target.href)) {
target.href = decodeURIComponent(q);
}
}
},
});
window.nova_plugins.push({
id: 'description-timestamps-scroll',
title: 'Disable scroll to top on click timestamps',
'title:zh': '没有在时间戳上滚动到播放器',
'title:ja': 'タイムスタンプでプレーヤーにスクロールしない',
'title:pl': 'Brak przejścia do odtwarzacza na znacznikach czasu',
run_on_pages: 'watch, -mobile',
section: 'details',
desc: 'Disable scrolling to player when clicking on timestamps',
'desc:pl': 'Wyłącza przewijanie do odtwarzacza podczas klikania znaczników czasu',
_runtime: user_settings => {
if (user_settings['description-popup']) return;
document.addEventListener('click', evt => {
if (!evt.isTrusted || !evt.target.matches('a[href*="&t="]')) return;
if (sec = parseInt(NOVA.queryURL.get('t', evt.target.href))) {
evt.preventDefault();
evt.stopPropagation();
evt.stopImmediatePropagation();
movie_player.seekTo(sec);
}
}, { capture: true });
},
});
window.nova_plugins.push({
id: 'ad-state',
title: 'Show Ads info',
run_on_pages: 'watch, -mobile',
restart_on_location_change: true,
section: 'details',
_runtime: user_settings => {
const SELECTOR_ID = 'nova-monetization';
NOVA.waitSelector('#title h1', { destroy_after_page_leaving: true })
.then(el => {
if (playerResponse = document.getElementById('page-manager')?.getCurrentData()?.playerResponse) {
let text = [];
if (playerResponse?.paidContentOverlay) text.push('Sponsored');
if (adCount = playerResponse?.adPlacements?.length) text.push(`Ads count ${adCount}`);
if (text.length) insertToHTML({ 'text': `「${text.join(', ')}」`, 'container': el });
}
});
function insertToHTML({ text = '', container = required() }) {
if (!(container instanceof HTMLElement)) return console.error('container not HTMLElement:', container);
(document.getElementById(SELECTOR_ID) || (() => {
const el = document.createElement('span');
el.id = SELECTOR_ID;
el.className = 'style-scope yt-formatted-string bold';
Object.assign(el.style, {
'font-size': '1.35rem',
'line-height': '2rem',
margin: '10px',
});
container.after(el);
return el;
})())
.textContent = text;
}
},
});
window.nova_plugins.push({
id: 'metadata-hide',
title: 'Hide metadata',
run_on_pages: 'watch',
section: 'details',
desc: 'Cover link to games, movies, merch, etc.',
_runtime: user_settings => {
let selectorsList = [
'ytd-watch-metadata > ytd-metadata-row-container-renderer',
'ytd-merch-shelf-renderer, #infocards-section',
];
if (user_settings.description_card_list) {
selectorsList.push('#structured-description ytd-horizontal-card-list-renderer');
}
if (user_settings.description_shorts_remixing) {
selectorsList.push('#structured-description ytd-reel-shelf-renderer');
}
if (user_settings.description_transcript) {
selectorsList.push('#structured-description ytd-video-description-transcript-section-renderer');
}
if (selectorsList.length) {
NOVA.css.push(
selectorsList.join(',\n') + ` {
display: none !important;
background-color: red;
}`);
}
},
options: {
description_card_list: {
_tagName: 'input',
label: 'Chapters/Key moments/Music info',
type: 'checkbox',
},
description_shorts_remixing: {
_tagName: 'input',
label: 'Shorts remixing this video',
type: 'checkbox',
},
description_transcript: {
_tagName: 'input',
label: 'Transcript',
type: 'checkbox',
},
}
});
https://www.youtube.com/watch?v=eB6txyhHFG4 - many dislike count
window.nova_plugins.push({
id: 'return-dislike',
title: 'Show dislike count',
'title:zh': '显示不喜欢计数',
'title:ja': '嫌いな数を表示',
run_on_pages: 'watch, -mobile',
section: 'details-buttons',
desc: 'via by returnyoutubedislike.com',
_runtime: user_settings => {
if (user_settings.details_buttons_label_hide
|| user_settings.details_buttons_hide?.includes('like_dislike')
) {
return;
}
const
CACHE_PREFIX = 'nova-dislikes-count:',
SELECTOR_ID = 'nova-dislikes-count';
NOVA.waitSelector('#actions dislike-button-view-model button', { destroy_after_page_leaving: true })
.then(el => setDislikeCount(el));
NOVA.runOnPageLoad(() => {
if (NOVA.currentPage != 'watch') return;
document.addEventListener('yt-action', dislikeIsUpdated);
});
function dislikeIsUpdated(evt) {
if (NOVA.currentPage != 'watch') return;
switch (evt.detail?.actionName) {
case 'yt-set-active-panel-item-action':
case 'yt-reload-continuation-items-command':
document.removeEventListener('yt-action', dislikeIsUpdated);
NOVA.waitSelector('#actions dislike-button-view-model button', { destroy_after_page_leaving: true })
.then(el => setDislikeCount(el));
break;
}
}
async function setDislikeCount(container = required()) {
const videoId = NOVA.queryURL.get('v') || movie_player.getVideoData().video_id;
if (!videoId) return console.error('return-dislike videoId: empty', videoId);
container.style.width = 'auto';
if (storage = sessionStorage.getItem(CACHE_PREFIX + videoId)) {
insertToHTML({ 'data': JSON.parse(storage), 'container': container });
}
else if (data = await getDislikeCount()) {
insertToHTML({ 'data': data, 'container': container });
}
async function getDislikeCount() {
const videoId = NOVA.queryURL.get('v') || movie_player.getVideoData().video_id;
const fetchAPI = () => fetch(`https://returnyoutubedislikeapi.com/votes?videoId=${videoId}`,
{
method: 'GET',
headers: { 'Content-Type': 'application/json' },
}
)
.then(response => response.json())
.then(json => json.dislikes && ({ 'likes': json.likes, 'dislikes': json.dislikes }))
.catch(error => {
});
if (result = await fetchAPI()) {
sessionStorage.setItem(CACHE_PREFIX + videoId, JSON.stringify(result));
return result;
}
}
function insertToHTML({ data = required(), container = required() }) {
if (!(container instanceof HTMLElement)) return console.error('container not HTMLElement:', container);
const percent = Math.trunc(data.dislikes * 100 / (data.likes + data.dislikes));
const text = `${NOVA.numberFormat.abbr(data.dislikes)} (${percent}%)`;
(document.getElementById(SELECTOR_ID) || (function () {
const el = document.createElement('span');
el.id = SELECTOR_ID;
el.className = 'style-scope yt-formatted-string bold';
el.style.cssText = 'text-overflow:ellipsis; overflow:visible; white-space:nowrap; padding-left:3px;';
return container.appendChild(el);
})())
.textContent = text;
container.title = text;
}
}
},
});
window.nova_plugins.push({
id: 'description-expand',
title: 'Expand description',
'title:zh': '展开说明',
'title:ja': '説明を展開',
'title:pl': 'Rozwiń opis',
run_on_pages: 'watch, -mobile',
section: 'details',
desc: 'on hover',
'plugins-conflict': 'description-popup, comments-sidebar-position-exchange',
_runtime: user_settings => {
if (user_settings['description-popup']) return;
if (user_settings['comments-sidebar-position-exchange']) return;
const SELECTOR_BTN = '[description-collapsed] #description #expand';
switch (user_settings.description_expand_mode) {
case 'onhover':
NOVA.waitSelector(SELECTOR_BTN)
.then(btn => btn.addEventListener('mouseenter', btn.click));
break;
case 'always':
document.addEventListener('yt-page-data-updated', expandSection);
function expandSection() {
if (NOVA.currentPage == 'watch') {
document.body.querySelector(SELECTOR_BTN)?.click();
}
}
break;
}
},
options: {
description_expand_mode: {
_tagName: 'select',
label: 'Mode',
'label:zh': '模式',
'label:ja': 'モード',
'label:pl': 'Tryb',
options: [
{
label: 'always', value: 'always', selected: true,
'label:zh': '每次',
'label:ja': 'いつも',
'label:pl': 'zawsze',
},
{
label: 'on hover', value: 'onhover',
'label:zh': '悬停时',
'label:ja': 'ホバー時に',
'label:pl': 'po najechaniu',
},
],
},
}
});
window.nova_plugins.push({
id: 'subscriptions-home',
title: 'Redirect from home page to subscriptions page',
'title:zh': '从主页重定向到订阅页面',
'title:ja': 'ホーム ページからサブスクリプション ページへのリダイレクト',
'title:pl': 'Przekieruj ze strony głównej na stronę subskrypcji',
run_on_pages: 'home',
restart_on_location_change: true,
section: 'header',
'plugins-conflict': 'page-logo',
_runtime: user_settings => {
location.pathname = '/feed/subscriptions';
},
});
window.nova_plugins.push({
id: 'header-unfixed',
title: 'Header unpinned',
'title:zh': '标题未固定',
'title:ja': 'ヘッダーは固定されていません',
'title:pl': 'Przewijany nagłówek',
run_on_pages: '*, -embed, -mobile, -live_chat',
section: 'header',
desc: 'Prevent header from sticking',
'desc:zh': '防止头部粘连',
'desc:ja': 'ヘッダーがくっつくのを防ぎます',
'desc:pl': 'Nagłówek będzie przewijany wraz ze stroną',
_runtime: user_settings => {
const
CLASS_NAME_TOGGLE = 'nova-header-unfixed',
SELECTOR = 'html.' + CLASS_NAME_TOGGLE;
NOVA.css.push(
`${SELECTOR} #masthead-container {
position: absolute !important;
}
${SELECTOR} #chips-wrapper {
position: sticky !important;
}
${SELECTOR} #header {
margin-top: 0 !important;
}`);
document.documentElement.classList.add(CLASS_NAME_TOGGLE);
if (user_settings.header_unfixed_hotkey) {
const hotkey = user_settings.header_unfixed_hotkey || 'KeyV';
document.addEventListener('keyup', evt => {
if (['input', 'textarea', 'select'].includes(evt.target.localName) || evt.target.isContentEditable) return;
if ((hotkey.length === 1 ? evt.key : evt.code) === hotkey) {
document.documentElement.classList.toggle(CLASS_NAME_TOGGLE);
}
});
}
if (user_settings.header_unfixed_scroll) {
createArrowButton();
document.addEventListener('yt-action', evt => {
switch (evt.detail?.actionName) {
case 'yt-store-grafted-ve-action':
case 'yt-open-popup-action':
scrollAfter();
break;
}
});
function scrollAfter() {
if ((masthead = document.getElementById('masthead'))
&& (topOffset = masthead.offsetHeight)
&& NOVA.isInViewport(masthead)
) {
window.scrollTo({ top: topOffset });
}
}
function createArrowButton() {
const scrollDownButton = document.createElement('button');
scrollDownButton.innerHTML =
`<svg viewBox="0 0 16 16" height="100%" width="100%">
<g fill="currentColor">
<path d="M3.35 4.97 8 9.62 12.65 4.97l.71.71L8 11.03l-5.35-5.35.7-.71z" />
</g>
</svg>`;
scrollDownButton.title = 'Scroll down';
Object.assign(scrollDownButton.style, {
cursor: 'pointer',
'background-color': 'transparent',
color: 'deepskyblue',
border: 'none',
height: '3em',
});
scrollDownButton.addEventListener('click', scrollAfter);
if (endnode = document.getElementById('end')) {
endnode.parentElement.insertBefore(scrollDownButton, endnode);
}
}
}
},
options: {
header_unfixed_scroll: {
_tagName: 'input',
label: 'Scroll after header',
'label:zh': '在标题后滚动',
'label:ja': 'ヘッダーの後にスクロール',
'label:pl': 'Przewiń nagłówek',
type: 'checkbox',
title: 'Makes sense on a small screen',
'title:zh': '在小屏幕上有意义',
'title:ja': '小さな画面で意味があります',
'title:pl': 'Przydatne na małym ekranie',
},
header_unfixed_hotkey: {
_tagName: 'select',
label: 'Hotkey toggle',
options: [
{ label: 'none', value: false },
{ label: 'ShiftL', value: 'ShiftLeft' },
{ label: 'ShiftR', value: 'ShiftRight' },
{ label: 'CtrlL', value: 'ControlLeft' },
{ label: 'CtrlR', value: 'ControlRight' },
{ label: 'AltL', value: 'AltLeft' },
{ label: 'AltR', value: 'AltRight' },
{ label: 'A', value: 'KeyA' },
{ label: 'B', value: 'KeyB' },
{ label: 'C', value: 'KeyC' },
{ label: 'D', value: 'KeyD' },
{ label: 'E', value: 'KeyE' },
{ label: 'F', value: 'KeyF' },
{ label: 'G', value: 'KeyG' },
{ label: 'H', value: 'KeyH' },
{ label: 'I', value: 'KeyI' },
{ label: 'J', value: 'KeyJ' },
{ label: 'K', value: 'KeyK' },
{ label: 'L', value: 'KeyL' },
{ label: 'M', value: 'KeyM' },
{ label: 'N', value: 'KeyN' },
{ label: 'O', value: 'KeyO' },
{ label: 'P', value: 'KeyP' },
{ label: 'Q', value: 'KeyQ' },
{ label: 'R', value: 'KeyR' },
{ label: 'S', value: 'KeyS' },
{ label: 'T', value: 'KeyT' },
{ label: 'U', value: 'KeyU' },
{ label: 'V', value: 'KeyV', selected: true },
{ label: 'W', value: 'KeyW' },
{ label: 'X', value: 'KeyX' },
{ label: 'Y', value: 'KeyY' },
{ label: 'Z', value: 'KeyZ' },
0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
']', '[', '+', '-', ',', '.', '/', '<', ';', '\\',
],
},
},
});
window.nova_plugins.push({
id: 'header-compact',
title: 'Header compact',
'title:zh': '标题紧凑',
'title:ja': 'ヘッダーコンパクト',
'title:pl': 'Kompaktowy nagłówek',
run_on_pages: '*, -embed, -mobile, -live_chat',
section: 'header',
_runtime: user_settings => {
const height = '36px';
NOVA.css.push(
`#masthead #container.ytd-masthead {
max-height: ${height} !important;
}
#masthead #background {
max-height: ${height} !important;
}
#search-form, #search-icon-legacy {
max-height: ${height} !important;
}
body,
html:not(:fullscreen) #page-manager {
--ytd-masthead-height: ${height};
}
#chips-wrapper.ytd-feed-filter-chip-bar-renderer {
--ytd-rich-grid-chips-bar-top: ${height};
}`);
},
});
window.nova_plugins.push({
id: 'search-query',
title: 'Search filter',
'title:zh': '搜索过滤器',
'title:ja': '検索フィルター',
'title:pl': 'Filtry wyszukiwania',
run_on_pages: 'results',
restart_on_location_change: true,
section: 'header',
_runtime: user_settings => {
if (!NOVA.queryURL.has('sp')
&& (sp = user_settings.search_query_date || user_settings.search_query_sort)
) {
location.href = NOVA.queryURL.set({ 'sp': sp });
}
},
options: {
search_query_sort: {
_tagName: 'select',
label: 'Sort by',
'label:zh': '排序方式',
'label:ja': '並び替え',
'label:pl': 'Sortuj według',
options: [
{
label: 'relevance', value: false, selected: true,
},
{
label: 'upload date', value: 'cai%253d',
},
{
label: 'view count', value: 'cam%253d',
},
{
label: 'rating', value: 'cae%253d',
},
],
'data-dependent': { 'search_query_date': false },
},
search_query_date: {
_tagName: 'select',
label: 'Upload date',
'label:zh': '上传日期',
'label:ja': 'アップロード日',
'label:pl': 'Data przesłania',
options: [
{
label: 'all time', value: false, selected: true,
},
{
label: 'last hour', value: 'egiiaq%253d%253d',
},
{
label: 'today', value: 'egiiag%253d%253d',
},
{
label: 'this week', value: 'egiiaw%253d%253d',
},
{
label: 'this month', value: 'egiiba%253d%253d',
},
{
label: 'this year', value: 'egiibq%253d%253d',
},
],
'data-dependent': { 'search_query_sort': false },
},
}
});
window.nova_plugins.push({
id: 'page-logo',
title: 'YouTube logo link',
'title:zh': 'YouTube 徽标',
'title:ja': 'YouTubeロゴ',
run_on_pages: '*, -embed, -mobile, -live_chat',
section: 'header',
_runtime: user_settings => {
NOVA.waitSelector('#masthead a#logo', { destroy_after_page_leaving: true })
.then(async a => {
if (link = new URL(user_settings.page_logo_url_mode)?.href) {
a.href = link;
await NOVA.waitUntil(() => a.data?.commandMetadata?.webCommandMetadata?.url, 1500);
a.data.commandMetadata.webCommandMetadata.url = link;
}
});
},
options: {
page_logo_url_mode: {
_tagName: 'input',
label: 'URL',
type: 'url',
pattern: "https://.*",
placeholder: 'https://youtube.com/...',
value: 'https://youtube.com/feed/subscriptions',
},
}
});
const NOVA = {
waitSelector(selector = required(), limit_data) {
return new Promise((resolve, reject) => {
if (typeof selector !== 'string') {
console.error('wait > selector:', ...arguments);
return reject('wait > selector:', typeof selector);
}
if (limit_data && (!limit_data.hasOwnProperty('destroy_after_page_leaving') && !limit_data.hasOwnProperty('container'))) {
console.error('waitSelector > check format "limit_data":', ...arguments);
return reject('waitSelector > check format "limit_data"');
}
if (limit_data?.container && !(limit_data.container instanceof HTMLElement)) {
console.error('waitSelector > container not HTMLElement:', ...arguments);
return reject('waitSelector > container not HTMLElement');
}
if (selector.includes(':has(') && !CSS.supports('selector(:has(*))')) {
console.warn('CSS ":has()" unsupported');
return reject('CSS ":has()" unsupported');
}
if (element = (limit_data?.container || document.body || document).querySelector(selector)) {
return resolve(element);
}
const observerFactory = new MutationObserver((mutationRecordsArray, observer) => {
for (const record of mutationRecordsArray) {
for (const node of record.addedNodes) {
if (![1, 3, 8].includes(node.nodeType) || !(node instanceof HTMLElement)) continue;
if (node.matches && node.matches(selector)) {
observer.disconnect();
return resolve(node);
}
else if (
(parentEl = node.parentElement || node)
&& (parentEl instanceof HTMLElement)
&& (element = parentEl.querySelector(selector))
) {
observer.disconnect();
return resolve(element);
}
}
}
if (document?.readyState != 'loading'
&& (element = (limit_data?.container || document?.body || document).querySelector(selector))
) {
observer.disconnect();
return resolve(element);
}
});
observerFactory
.observe(limit_data?.container || document.body || document.documentElement || document, {
childList: true,
subtree: true,
attributes: true,
});
if (sec = +limit_data?.destroy_timeout) {
setTimeout(() => {
observerFactory.disconnect();
return reject(`"${selector}" timed out after ${sec} seconds`);
}, sec * 1000);
}
if (limit_data?.destroy_after_page_leaving) {
isURLChange();
window.addEventListener('transitionend', ({ target }) => isURLChange() && observerFactory.disconnect());
function isURLChange() {
return (this.prevURL === document.URL) ? false : this.prevURL = document.URL;
}
}
});
},
waitUntil(condition = required(), timeout = required()) {
if (typeof condition !== 'function') return console.error('waitUntil > condition is not fn:', typeof condition);
return new Promise((resolve) => {
if (result = condition()) {
resolve(result);
}
else {
const waitCondition = setInterval(() => {
if (result = condition()) {
clearInterval(waitCondition);
resolve(result);
}
}, +timeout || 500);
}
});
},
delay(ms = 100) {
return new Promise(resolve => setTimeout(resolve, ms));
},
watchElements_list: {},
watchElements({ selectors = required(), attr_mark, callback = required() }) {
if (!Array.isArray(selectors) && typeof selectors !== 'string') return console.error('watch > selector:', typeof selectors);
if (typeof callback !== 'function') return console.error('watch > callback:', typeof callback);
this.waitSelector((typeof selectors === 'string') ? selectors : selectors.join(','))
.then(video => {
!Array.isArray(selectors) && (selectors = selectors.split(',').map(s => s.trim()));
process();
this.watchElements_list[attr_mark] = setInterval(() =>
document.visibilityState == 'visible' && process(), 1500);
function process() {
selectors
.forEach(selectorItem => {
if (selectorItem.includes(':has(') && !CSS.supports('selector(:has(*))')) {
return console.warn('CSS ":has()" unsupported');
}
if (attr_mark) selectorItem += `:not([${attr_mark}])`;
document.body.querySelectorAll(selectorItem)
.forEach(el => {
if (attr_mark) el.setAttribute(attr_mark, true);
callback(el);
});
});
}
});
},
runOnPageLoad(callback) {
if (!callback || typeof callback !== 'function') {
return console.error('runOnPageLoad > callback not function:', ...arguments);
}
let prevURL = document.URL;
const isURLChange = () => (prevURL === document.URL) ? false : prevURL = document.URL;
isURLChange() || callback();
document.addEventListener('yt-navigate-finish', () => isURLChange() && callback());
},
css: {
push(css = required(), selector, set_important) {
if (typeof css === 'object') {
if (!selector) return console.error('injectStyle > empty json-selector:', ...arguments);
if (selector.includes(':has(') && !CSS.supports('selector(:has(*))')) {
return console.error('CSS ":has()" unsupported', ...arguments);
}
injectCss(selector + json2css(css));
function json2css(obj) {
let css = '';
Object.entries(obj)
.forEach(([key, value]) => {
css += key + ':' + value + (set_important ? ' !important' : '') + ';';
});
return `{ ${css} }`;
}
}
else if (css && typeof css === 'string') {
if (document.head) {
injectCss(css);
}
else {
window.addEventListener('load', () => injectCss(css), { capture: true, once: true });
}
}
else {
console.error('addStyle > css:', typeof css);
}
function injectCss(source = required()) {
let sheet;
if (source.endsWith('.css')) {
sheet = document.createElement('link');
sheet.rel = 'sheet';
sheet.href = source;
}
else {
const sheetId = 'NOVA-style';
sheet = document.getElementById(sheetId) || (function () {
const style = document.createElement('style');
style.type = 'text/css';
style.id = sheetId;
return (document.head || document.documentElement).appendChild(style);
})();
}
sheet.textContent += '\n' + source
.replace(/\n+\s{2,}/g, ' ')
+ '\n';
}
},
get(selector = required(), prop_name = required()) {
return (el = (selector instanceof HTMLElement) ? selector : document.body?.querySelector(selector))
? getComputedStyle(el).getPropertyValue(prop_name) : null;
},
},
isInViewport(el = required()) {
if (!(el instanceof HTMLElement)) return console.error('el is not HTMLElement type:', el);
if (distance = el.getBoundingClientRect()) {
return (
distance.top >= 0 &&
distance.left >= 0 &&
distance.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
distance.right <= (window.innerWidth || document.documentElement.clientWidth)
);
}
},
collapseElement({ selector = required(), label = required(), remove }) {
const selector_id = `${label.match(/[a-z]+/gi).join('')}-prevent-load-btn`;
this.waitSelector(selector.toString())
.then(el => {
if (remove) el.remove();
else {
if (document.getElementById(selector_id)) return;
el.style.display = 'none';
const btn = document.createElement('a');
btn.textContent = `Load ${label}`;
btn.id = selector_id;
btn.className = 'more-button style-scope ytd-video-secondary-info-renderer';
Object.assign(btn.style, {
cursor: 'pointer',
'text-align': 'center',
'text-transform': 'uppercase',
display: 'block',
color: 'var(--yt-spec-text-secondary)',
});
btn.addEventListener('click', () => {
btn.remove();
el.style.display = 'inherit';
window.dispatchEvent(new Event('scroll'));
});
el.before(btn);
}
});
},
aspectRatio: {
sizeToFit({
srcWidth = 0, srcHeight = 0,
maxWidth = screen.width, maxHeight = screen.height
}) {
const aspectRatio = Math.min(maxWidth / +srcWidth, maxHeight / +srcHeight, 1);
return {
width: +srcWidth * aspectRatio,
height: +srcHeight * aspectRatio,
};
},
getAspectRatio({ width = required(), height = required() }) {
const
gcd = (a, b) => b ? gcd(b, a % b) : a,
divisor = gcd(width, height),
w = width / divisor,
h = height / divisor;
return (w > 10 && h > 10 && Math.abs(w - h) <= 2)
? '1:1'
: w + ':' + h;
},
chooseAspectRatio({ width = required(), height = required(), layout }) {
const acceptedRatioList = {
'landscape': {
'1:1': 1,
'3:2': 1.5,
'4:3': 1.33333333333,
'5:4': 1.25,
'5:3': 1.66666666667,
'16:9': 1.77777777778,
'16:10': 1.6,
'17:9': 1.88888888889,
'21:9': 2.33333333333,
'24:10': 2.4,
},
'portrait': {
'1:1': 1,
'2:3': .66666666667,
'3:4': .75,
'3:5': .6,
'4:5': .8,
'9:16': .5625,
'9:17': .5294117647,
'9:21': .4285714286,
'10:16': .625,
},
};
return choiceRatioFromList(this.getAspectRatio(...arguments)) || acceptedRatioList['landscape']['16:9'];
function choiceRatioFromList(ratio = required()) {
const layout_ = layout || ((ratio < 1) ? 'portrait' : 'landscape');
return acceptedRatioList[layout_][ratio];
}
},
calculateHeight: (width = required(), aspectRatio = (16 / 9)) => parseFloat((width / aspectRatio).toFixed(2)),
calculateWidth: (height = required(), aspectRatio = (16 / 9)) => parseFloat((height * aspectRatio).toFixed(2)),
},
openPopup({ url = required(), title = document.title, width = window.innerWidth, height = window.innerHeight, closed_callback }) {
const left = (screen.width / 2) - (width / 2);
const top = (screen.height / 2) - (height / 2);
const win = window.open(url, '_blank', `popup=1,toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=yes,copyhistory=no,width=${width},height=${height},top=${top},left=${left}`);
if (closed_callback && typeof closed_callback === 'function') {
const timer = setInterval(() => {
if (win.closed) {
clearInterval(timer);
closed_callback();
}
}, 500);
}
},
showOSD(text) {
if (!text || !['watch', 'embed'].includes(this.currentPage)) return;
if (typeof this.fadeBezel === 'number') clearTimeout(this.fadeBezel);
const bezelEl = document.body.querySelector('.ytp-bezel-text');
if (!bezelEl) return console.error(`showOSD ${text}=>${bezelEl}`);
const
bezelContainer = bezelEl.parentElement.parentElement,
CLASS_VALUE = 'ytp-text-root',
SELECTOR = '.' + CLASS_VALUE;
if (!this.bezel_css_inited) {
this.bezel_css_inited = true;
this.css.push(
`${SELECTOR} { display: block !important; }
${SELECTOR} .ytp-bezel-text-wrapper {
pointer-events: none;
z-index: 40 !important;
}
${SELECTOR} .ytp-bezel-text { display: inline-block !important; }
${SELECTOR} .ytp-bezel { display: none !important; }`);
}
bezelEl.textContent = text;
bezelContainer.classList.add(CLASS_VALUE);
let ms = 1200;
if ((text = String(text)) && (text.endsWith('%') || text.endsWith('x') || text.startsWith('+'))) {
ms = 600
}
this.fadeBezel = setTimeout(() => {
bezelContainer.classList.remove(CLASS_VALUE);
bezelEl.textContent = '';
}, ms);
},
getChapterList(video_duration = required()) {
if (!['watch', 'embed'].includes(this.currentPage)) return;
switch (NOVA.currentPage) {
case 'embed':
chapsCollect = getFromAPI();
return chapsCollect;
break;
case 'watch':
if ((chapsCollect = getFromDescriptionText() || getFromDescriptionChaptersBlock())
&& chapsCollect.length
) {
return chapsCollect;
}
break;
}
function descriptionExpand() {
document.body.querySelector('#meta [collapsed] #more, [description-collapsed] #description #expand')?.click();
}
function getFromDescriptionText() {
descriptionExpand();
const selectorTimestampLink = 'a[href*="&t="]';
let
timestampsCollect = [],
unreliableSorting;
[
(document.body.querySelector('ytd-watch-flexy')?.playerData?.videoDetails?.shortDescription
|| document.body.querySelector('ytd-watch-metadata #description.ytd-watch-metadata')?.textContent
)
?.split('\n') || [],
[...document.body.querySelectorAll(`#comments #comment #comment-content:has(${selectorTimestampLink})`)]
.map(el => [...el.querySelectorAll(selectorTimestampLink)]
.map(a => ({
'source': 'comment',
'text': `${a.textContent} ${(a.nextSibling || a.previousSibling)?.textContent}`,
}))
)
?.sort((a, b) => b.length - a.length)
?.shift()
|| []
]
?.sort((a, b) => b.length - a.length)
.forEach(chaptersList => {
if (timestampsCollect.length > 1) return;
let prevSec = -1;
chaptersList
.forEach(line => {
unreliableSorting = Boolean(line?.source);
line = (line?.text || line).toString().trim();
if (line.length > 5
&& (timestamp = /((\d?\d:){1,2}\d{2})/g.exec(line))
&& (line.length - timestamp.length) < 200
) {
timestamp = timestamp[0];
const
sec = NOVA.formatTimeOut.hmsToSec(timestamp),
timestampPos = line.indexOf(timestamp);
if (
(unreliableSorting ? true : (sec > prevSec && sec < +video_duration))
&& (timestampPos < 5 || (timestampPos + timestamp.length) === line.length)
) {
if (unreliableSorting) prevSec = sec;
timestampsCollect.push({
'sec': sec,
'time': timestamp,
'title': line
.replace(timestamp, '')
.replace(/\*(.*?)\*/g, '<b>$1</b>')
.trim().replace(/^[\u2011-\u26FF:\-|\[\]]+|[\u2011-\u26FF:\-.;]+$/g, '')
.replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2580-\u27BF]|\uD83E[\uDD10-\uDDFF]/g, '')
.trim()
});
}
}
});
});
if (timestampsCollect.length == 1 && (timestampsCollect[0].sec < (video_duration / 4))) {
return timestampsCollect;
}
else if (timestampsCollect.length > 1) {
if (unreliableSorting) {
timestampsCollect = timestampsCollect.sort((a, b) => a.sec - b.sec);
}
return timestampsCollect;
}
}
function getFromDescriptionChaptersBlock() {
descriptionExpand();
const selectorTimestampLink = 'a[href*="&t="]';
let timestampsCollect = [];
let prevSec = -1;
document.body.querySelectorAll(`#structured-description ${selectorTimestampLink}`)
.forEach(chapterLink => {
const sec = parseInt(NOVA.queryURL.get('t', chapterLink.href));
if (sec > prevSec) {
prevSec = sec;
timestampsCollect.push({
'time': NOVA.formatTimeOut.HMS.digit(sec),
'sec': sec,
'title': chapterLink.textContent.trim().split('\n')[0].trim(),
});
}
});
if (timestampsCollect.length == 1 && (timestampsCollect[0].sec < (video_duration / 4))) {
return timestampsCollect;
}
else if (timestampsCollect.length > 1) {
return timestampsCollect;
}
}
function getFromAPI() {
if (!window.ytPubsubPubsubInstance) {
return console.warn('ytPubsubPubsubInstance is null:', ytPubsubPubsubInstance);
}
if ((ytPubsubPubsubInstance = ytPubsubPubsubInstance.i
|| ytPubsubPubsubInstance.j
|| ytPubsubPubsubInstance.subscriptions_
)
&& Array.isArray(ytPubsubPubsubInstance)
) {
const data = Object.values(
ytPubsubPubsubInstance.find(a => a?.player)?.player.app
)
.find(a => a?.videoData)
?.videoData.multiMarkersPlayerBarRenderer;
if (data?.markersMap?.length) {
return data.markersMap[0].value.chapters
?.map(c => {
const sec = +c.chapterRenderer.timeRangeStartMillis / 1000;
return {
'sec': sec,
'time': NOVA.formatTimeOut.HMS.digit(sec),
'title':
c.chapterRenderer.title.simpleText
|| c.chapterRenderer.title.runs[0].text,
};
});
}
}
}
},
strToArray(str) {
return str
?.trim().split(/[\n,;]/)
.map(e => e.replace(/^(\s+)$/, ''))
.filter(e => e.length);
},
searchFilterHTML({ keyword = required(), filter_selectors = required(), highlight_selector, highlight_class }) {
keyword = keyword.toString().toLowerCase();
document.body.querySelectorAll(filter_selectors)
.forEach(item => {
const
text = item.innerText,
hasText = text?.toLowerCase().includes(keyword),
highlight = el => {
if (el.innerHTML.includes('<mark ')) {
el.innerHTML = el.innerHTML
.replace(/<\/?mark[^>]*>/g, '');
}
item.style.display = hasText ? '' : 'none';
if (hasText && keyword) {
highlightTerm({
'target': el,
'keyword': keyword,
'highlightClass': highlight_class,
});
}
};
(highlight_selector ? item.querySelectorAll(highlight_selector) : [item])
.forEach(highlight);
});
function highlightTerm({ target = required(), keyword = required(), highlightClass }) {
const
content = target.innerText,
pattern = new RegExp('(>[^<.]*)?(' + keyword + ')([^<.]*)?', 'gi'),
highlightStyle = highlightClass ? `class="${highlightClass}"` : 'style="background-color:#afafaf"',
replaceWith = `$1<mark ${highlightStyle}>$2</mark>$3`,
marked = content.replaceAll(pattern, replaceWith);
return (target.innerHTML = marked) !== content;
}
},
isMusic() {
if (!['watch', 'embed'].includes(this.currentPage)) return;
return checkMusicType();
function checkMusicType() {
const
channelName = movie_player.getVideoData().author,
titleStr = movie_player.getVideoData().title.toUpperCase(),
titleWordsList = titleStr?.toUpperCase().match(/\w+/g),
playerData = document.body.querySelector('ytd-watch-flexy')?.playerData;
return [
titleStr,
document.URL,
channelName,
playerData?.microformat?.playerMicroformatRenderer.category,
playerData?.title,
]
.some(i => i?.toUpperCase().includes('MUSIC'))
|| document.body.querySelector('#upload-info #channel-name .badge-style-type-verified-artist')
|| (channelName && /(VEVO|Topic|Records|RECORDS|Recordings|AMV)$/.test(channelName))
|| (channelName && /(MUSIC|ROCK|SOUNDS|SONGS)/.test(channelName.toUpperCase()))
|| titleWordsList?.length && ['🎵', '♫', 'SONG', 'SONGS', 'SOUNDTRACK', 'LYRIC', 'LYRICS', 'AMBIENT', 'MIX', 'VEVO', 'CLIP', 'KARAOKE', 'OPENING', 'COVER', 'COVERED', 'VOCAL', 'INSTRUMENTAL', 'ORCHESTRAL', 'DUBSTEP', 'DJ', 'DNB', 'BASS', 'BEAT', 'ALBUM', 'PLAYLIST', 'DUBSTEP', 'CHILL', 'RELAX', 'CLASSIC', 'CINEMATIC']
.some(i => titleWordsList.includes(i))
|| ['OFFICIAL VIDEO', 'OFFICIAL AUDIO', 'FEAT.', 'FT.', 'LIVE RADIO', 'DANCE VER', 'HIP HOP', 'ROCK N ROLL', 'HOUR VER', 'HOURS VER', 'INTRO THEME']
.some(i => titleStr.includes(i))
|| titleWordsList?.length && ['OP', 'ED', 'MV', 'OST', 'NCS', 'BGM', 'EDM', 'GMV', 'AMV', 'MMD', 'MAD']
.some(i => titleWordsList.includes(i));
}
},
formatTimeOut: {
hmsToSec(str = required()) {
let
parts = str?.split(':'),
t = 0;
switch (parts?.length) {
case 2: t = (parts[0] * 60); break;
case 3: t = (parts[0] * 3600) + (parts[1] * 60); break;
case 4: t = (parts[0] * 86400) + (parts[1] * 3600) + (parts[2] * 60); break;
}
return t + +parts.pop();
},
HMS: {
parseTime(time_sec) {
const ts = Math.abs(+time_sec);
return {
d: Math.trunc(ts / 86400),
h: Math.trunc((ts % 86400) / 3600),
m: Math.trunc((ts % 3600) / 60),
s: Math.trunc(ts % 60),
};
},
digit(time_sec = required()) {
const { d, h, m, s } = this.parseTime(time_sec);
return (d ? `${d}d ` : '')
+ (h ? (d ? h.toString().padStart(2, '0') : h) + ':' : '')
+ (h ? m.toString().padStart(2, '0') : m) + ':'
+ s.toString().padStart(2, '0');
},
abbr(time_sec = required()) {
const { d, h, m, s } = this.parseTime(time_sec);
return (d ? `${d}d ` : '')
+ (h ? (d ? h.toString().padStart(2, '0') : h) + 'h' : '')
+ (m ? (h ? m.toString().padStart(2, '0') : m) + 'm' : '')
+ (s ? (m ? s.toString().padStart(2, '0') : s) + 's' : '');
},
},
ago(date = required()) {
if (!(date instanceof Date)) return console.error('"date" is not Date type:', date);
const samples = [
{ label: 'year', sec: 31536000 },
{ label: 'month', sec: 2592000 },
{ label: 'day', sec: 86400 },
{ label: 'hour', sec: 3600 },
{ label: 'minute', sec: 60 },
{ label: 'second', sec: 1 }
];
const
now = date.getTime(),
seconds = Math.round((Date.now() - Math.abs(now)) / 1000),
interval = samples.find(i => i.sec < seconds),
time = Math.round(seconds / interval.sec);
return `${(now < 0 ? '-' : '') + time} ${interval.label}${time !== 1 ? 's' : ''}`;
},
},
dateFormat(format = 'YYYY/MM/DD') {
if (!(this instanceof Date)) return console.error('dateFormat - is not Date type:', this);
const
twoDigit = n => n.toString().padStart(2, '0'),
date = this.getDate(),
year = this.getFullYear(),
monthIdx = this.getMonth(),
dayWeekIdx = this.getDay(),
hours = this.getHours(),
minutes = this.getMinutes(),
seconds = this.getSeconds();
return format
.replace(/A|Z|S(SS)?|ss?|mm?|HH?|hh?|D{1,4}|M{1,4}|YY(YY)?|'([^']|'')*'/g, partPattern => {
let out;
switch (partPattern) {
case 'YY': out = year.substr(2); break;
case 'YYYY': out = year; break;
case 'M': out = monthIdx + 1; break;
case 'MM': out = twoDigit(monthIdx + 1); break;
case 'MMM': out = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][monthIdx]; break;
case 'MMMM': out = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][monthIdx]; break;
case 'D': out = date; break;
case 'DD': out = twoDigit(date); break;
case 'DDD': out = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'][dayWeekIdx]; break;
case 'DDDD': out = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayWeekIdx]; break;
case 'h': out = (hours % 12) || 12; break;
case 'H': out = hours; break;
case 'HH': out = twoDigit(hours); break;
case 'mm': out = twoDigit(minutes); break;
case 's': out = seconds; break;
case 'ss': out = twoDigit(seconds); break;
case 'SS': out = twoDigit(seconds); break;
case 'A': out = (hours < 12 ? 'AM' : 'PM'); break;
case 'Z': out = ('+' + -this.getTimezoneOffset() / 60)
.replace(/^\D?(\D)/, "$1")
.replace(/^(.)(.)$/, "$10$2") + '00';
break;
}
return out;
});
},
numberFormat: {
abbr(num) {
num = Math.abs(+num);
if (num === 0 || isNaN(num)) return '';
else if (num < 1000) return Math.trunc(num);
else if (num < 1e4) return round(num / 1000) + 'K';
else if (num < 990000) return Math.round(num / 1000) + 'K';
else if (num < 990000000) return Math.round(num / 1e5) / 10 + 'M';
else return Math.round(num / 1e8) / 10 + 'B';
function round(num, sig = 1) {
const prec = Math.pow(10, sig);
return Math.round(num * prec) / prec;
}
},
friendly: num => new Intl.NumberFormat().format(Math.round(num * 10) / 10),
},
extractAsNum: {
float: str => (n = str?.replace(/[^0-9.]/g, '')) && +n,
int: str => (n = str?.replace(/\D+/g, '')) && +n,
},
updateUrl: (new_url = required()) => window.history.replaceState(null, null, new_url),
queryURL: {
has: (query = required(), url_string) => new URL(url_string || location).searchParams.has(query.toString()),
get: (query = required(), url_string) => new URL(url_string || location).searchParams.get(query.toString()),
set(query_obj = {}, url_string) {
if (typeof query_obj != 'object' || !Object.keys(query_obj).length) return console.error('query_obj:', query_obj);
const url = new URL(url_string || location);
Object.entries(query_obj).forEach(([key, value]) => url.searchParams.set(key, value));
return url.toString();
},
remove(query = required(), url_string) {
const url = new URL(url_string || location);
url.searchParams.delete(query.toString());
return url.toString();
},
getHashParam: (query = required(), url_string) => location.hash && new URLSearchParams(new URL(url_string || location).hash.substring(1)).get(query.toString()),
},
request: (() => {
const API_STORE_NAME = 'YOUTUBE_API_KEYS';
async function getKeys() {
NOVA.log('request.API: fetch to youtube_api_keys.json');
return await fetch('https://gist.githubusercontent.com/raingart/ff6711fafbc46e5646d4d251a79d1118/raw/youtube_api_keys.json')
.then(res => res.text())
.then(keys => {
NOVA.log(`get and save keys in localStorage`, keys);
localStorage.setItem(API_STORE_NAME, keys);
return JSON.parse(keys);
})
.catch(error => {
localStorage.removeItem(API_STORE_NAME);
throw error;
})
.catch(reason => console.error('Error get keys:', reason));
}
return {
async API({ request = required(), params = required(), api_key }) {
const YOUTUBE_API_KEYS = localStorage.hasOwnProperty(API_STORE_NAME)
? JSON.parse(localStorage.getItem(API_STORE_NAME)) : await getKeys();
if (!api_key && (!Array.isArray(YOUTUBE_API_KEYS) || !YOUTUBE_API_KEYS?.length)) {
localStorage.hasOwnProperty(API_STORE_NAME) && localStorage.removeItem(API_STORE_NAME);
return console.error('YOUTUBE_API_KEYS empty:', YOUTUBE_API_KEYS);
}
const referRandKey = arr => api_key || 'AIzaSy' + arr[Math.trunc(Math.random() * arr.length)];
const query = Object.keys(params)
.map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
.join('&');
const URL = `https://www.googleapis.com/youtube/v3/${request}?${query}&key=` + referRandKey(YOUTUBE_API_KEYS);
return await fetch(URL)
.then(response => response.json())
.then(json => {
if (!json?.error && Object.keys(json).length) return json;
console.warn('used key:', NOVA.queryURL.get('key', URL));
if (json?.error && Object.keys(json.error).length) {
throw new Error(JSON.stringify(json?.error));
}
})
.catch(error => {
localStorage.removeItem(API_STORE_NAME);
console.error(`Request API failed:${URL}\n${error}`);
if (error?.message && (err = JSON.parse(error?.message))) {
return {
'code': err.code,
'reason': err.errors?.length && err.errors[0].reason,
'error': err.message,
};
}
});
},
};
})(),
getPlayerState(state) {
return {
'-1': 'UNSTARTED',
0: 'ENDED',
1: 'PLAYING',
2: 'PAUSED',
3: 'BUFFERING',
5: 'CUED'
}[state || movie_player.getPlayerState()];
},
videoElement: (() => {
const videoSelector = '#movie_player:not(.ad-showing) video';
document.addEventListener('canplay', ({ target }) => {
target.matches(videoSelector) && (NOVA.videoElement = target);
}, { capture: true, once: true });
document.addEventListener('play', ({ target }) => {
target.matches(videoSelector) && (NOVA.videoElement = target);
}, true);
})(),
getChannelId(api_key) {
const isChannelId = id => id && /UC([a-z0-9-_]{22})$/i.test(id);
let result = [
document.head.querySelector('meta[itemprop="channelId"][content]')?.content,
(document.body.querySelector('ytd-app')?.__data?.data?.response
|| document.body.querySelector('ytd-app')?.data?.response
|| window.ytInitialData
)
?.metadata?.channelMetadataRenderer?.externalId,
document.head.querySelector('link[itemprop="url"][href]')?.href.split('/')[4],
location.pathname.split('/')[2],
document.body.querySelector('#video-owner a[href]')?.href.split('/')[4],
document.body.querySelector('a.ytp-ce-channel-title[href]')?.href.split('/')[4],
document.body.querySelector('ytd-watch-flexy')?.playerData?.videoDetails?.channelId,
((typeof ytcfg === 'object') && (obj = ytcfg.data_?.PLAYER_VARS?.embedded_player_response)
&& NOVA.seachInObjectBy.key({
'obj': JSON.parse(obj),
'keys': 'channelId',
})?.data),
]
.find(i => isChannelId(i));
return result;
},
storage_obj_manager: {
STORAGE_NAME: 'nova-channels-state',
async initStorage() {
this.channelId = location.search.includes('list=')
? (NOVA.queryURL.get('list') || movie_player?.getPlaylistId())
: await NOVA.waitUntil(NOVA.getChannelId, 1000);
},
read(return_all) {
if (store = JSON.parse(localStorage.getItem(this.STORAGE_NAME))) {
return return_all ? store : store[this.channelId];
}
},
write(obj_save) {
if ((storage = this.read('all') || {})) {
if (Object.keys(obj_save).length) {
storage = Object.assign(storage, { [this.channelId]: obj_save });
}
else {
delete storage[this.channelId];
}
}
localStorage.setItem(this.STORAGE_NAME, JSON.stringify(storage));
},
_getParam(key = required()) {
if (storage = this.read()) {
return storage[key];
}
},
async getParam(key = required()) {
if (!this.channelId) await this.initStorage();
return this._getParam(...arguments);
},
save(obj_save) {
if (storage = this.read()) {
obj_save = Object.assign(storage, obj_save);
}
this.write(obj_save);
},
remove(key) {
if ((storage = this.read())) {
delete storage[key];
this.write(storage);
}
},
},
seachInObjectBy: {
key({
obj = required(),
keys = required(),
match_fn = data => data.constructor.name !== 'Object',
multiple = false,
path = ''
}) {
const setPath = d => (path ? path + '.' : '') + d;
let hasKey, results = [];
for (const prop in obj) {
if (obj.hasOwnProperty(prop) && obj[prop]) {
hasKey = keys.constructor.name === 'String' ? (keys === prop) : keys.indexOf(prop) > -1;
if (hasKey && (!match_fn || match_fn(obj[prop]))) {
if (multiple) {
results.push({
'path': setPath(prop),
'data': obj[prop],
});
}
else {
return {
'path': setPath(prop),
'data': obj[prop],
};
}
}
else {
switch (obj[prop].constructor.name) {
case 'Object':
if (result = this.key({
'obj': obj[prop],
'keys': keys,
'path': setPath(prop),
'match_fn': match_fn,
})) {
if (multiple) results.push(result);
else return result;
}
break;
case 'Array':
for (let i = 0; i < obj[prop].length; i++) {
if (result = this.key({
'obj': obj[prop][i],
'keys': keys,
'path': path + `[${i}]`,
'match_fn': match_fn,
})) {
if (multiple) results.push(result);
else return result;
}
}
break;
case 'Function':
if (Object.keys(obj[prop]).length) {
for (const j in obj[prop]) {
if (typeof obj[prop][j] !== 'undefined') {
if (result = this.key({
'obj': obj[prop][j],
'keys': keys,
'path': setPath(prop) + '.' + j,
'match_fn': match_fn,
})) {
if (multiple) results.push(result);
else return result;
}
}
}
}
break;
}
}
}
}
if (multiple) return results;
},
},
log() {
if (this.DEBUG && arguments.length) {
console.groupCollapsed(...arguments);
console.trace();
console.groupEnd();
}
},
};
window.nova_plugins.push({
id: 'page-title-time',
title: 'Show time in tab title',
'title:zh': '在标签标题中显示时间',
'title:ja': 'タブタイトルに時間を表示する',
'title:pl': 'Pokaż czas w tytule karty',
run_on_pages: 'watch',
section: 'other',
_runtime: user_settings => {
NOVA.waitSelector('video')
.then(video => {
document.addEventListener('yt-navigate-start', () => pageTitle.backup = null);
video.addEventListener('playing', pageTitle.save.bind(pageTitle));
video.addEventListener('timeupdate', () => pageTitle.update(video));
video.addEventListener('pause', () => pageTitle.restore(video));
video.addEventListener('ended', () => pageTitle.restore(video));
});
const pageTitle = {
strSplit: ' | ',
saveCheck() {
return (result = (this.backup || document.title).includes(this.strSplit))
? new RegExp(`^((\\d?\\d:){1,2}\\d{2})(${this.strSplit.replace('|', '\\|')})`, '')
.test(document.title)
: result;
},
save() {
if (this.backup
|| movie_player.getVideoData().isLive
|| movie_player.classList.contains('ad-showing')
|| this.saveCheck()
) {
return;
}
this.backup = movie_player.getVideoData().title + ' :: ' + movie_player.getVideoData().author;
},
update(video = NOVA.videoElement) {
if (!this.backup) return;
let newTitleArr = [];
switch (movie_player.getVideoData().isLive ? 'current' : user_settings.page_title_time_mode) {
case 'current':
newTitleArr = [video.currentTime];
break;
case 'current-duration':
if (!isNaN(video.duration)) {
newTitleArr = [video.currentTime, ' / ', video.duration];
}
break;
default:
if (!isNaN(video.duration)) {
newTitleArr = [video.duration - video.currentTime];
}
}
newTitleArr = newTitleArr
.map(t => (typeof t === 'string') ? t : NOVA.formatTimeOut.HMS.digit(t / video.playbackRate))
.join('');
this.set([newTitleArr, this.backup]);
},
restore(video = NOVA.videoElement) {
if (!this.backup) return;
this.set([movie_player.getVideoData().isLive && video.currentTime, this.backup]);
},
set(arr) {
document.title = arr
.filter(Boolean)
.join(this.strSplit);
},
};
},
options: {
page_title_time_mode: {
_tagName: 'select',
label: 'Mode',
'label:zh': '模式',
'label:ja': 'モード',
'label:pl': 'Tryb',
options: [
{
label: 'left', value: 'left', selected: true,
'label:zh': '剩下',
'label:ja': '左',
'label:pl': 'pozostało',
},
{
label: 'current/duration', value: 'current-duration',
'label:zh': '现在/期间',
'label:ja': '現在/期間',
'label:pl': 'bieżący czas',
},
],
},
}
});
window.nova_plugins.push({
id: 'scrollbar-hide',
title: 'Hide scrollbar (for watch page)',
run_on_pages: 'watch, -mobile',
section: 'other',
_runtime: user_settings => {
const HIDE_SCROLL_ATTR = 'nova-scrollbar-hide';
NOVA.css.push(
`html[${HIDE_SCROLL_ATTR}] {
scrollbar-width: none;
}
html[${HIDE_SCROLL_ATTR}] body::-webkit-scrollbar {
width: 0px;
height: 0px;
}`);
NOVA.runOnPageLoad(() => {
const hasAttr = document.documentElement.hasAttribute(HIDE_SCROLL_ATTR);
if ((NOVA.currentPage == 'watch') && !hasAttr) {
document.documentElement.setAttribute(HIDE_SCROLL_ATTR, true);
}
else if ((NOVA.currentPage != 'watch') && hasAttr) {
document.documentElement.removeAttribute(HIDE_SCROLL_ATTR);
}
});
if (user_settings.scrollbar_hide_toggle_on_scroll) {
window.addEventListener('scroll', function blink() {
if (NOVA.currentPage != 'watch') return;
if (document.documentElement.scrollHeight > window.innerHeight) {
if (document.documentElement.hasAttribute(HIDE_SCROLL_ATTR)) {
document.documentElement.removeAttribute(HIDE_SCROLL_ATTR);
}
if (typeof blink.fade === 'number') clearTimeout(blink.fade);
blink.fade = setTimeout(() => {
document.documentElement.setAttribute(HIDE_SCROLL_ATTR, true);
}, 700);
}
});
}
},
options: {
scrollbar_hide_toggle_on_scroll: {
_tagName: 'input',
label: 'Showing on scroll',
type: 'checkbox',
},
}
});
window.nova_plugins.push({
id: 'channel-play-all',
title: 'Add "Play All" button',
'title:zh': '在频道页面添加“Play All”按钮',
'title:ja': 'チャンネルページに「Play All」ボタンを追加',
run_on_pages: 'channel, watch, -mobile',
restart_on_location_change: true,
section: 'channel',
_runtime: user_settings => {
const
SELECTOR_ID = 'nova-play-all-channel-btn',
endpoint = '/playlist?list=';
switch (NOVA.currentPage) {
case 'watch':
if (!user_settings.channel_play_all_in_watch) return;
NOVA.waitSelector('#owner.ytd-watch-metadata')
.then(container => {
if (channelId = NOVA.getChannelId()) {
const btnList = user_settings.channel_play_all_mode
? { id: 'UULF', title: 'All' }
: { id: 'UULP', title: 'MOST POPULAR' };
insertToHTML({
'container': container,
'url': endpoint + btnList.id + channelId.substring(2),
});
function insertToHTML({ url = required(), container = required() }) {
console.debug('insertToHTML', ...arguments);
if (!(container instanceof HTMLElement)) return console.error('container not HTMLElement:', container);
(document.getElementById(SELECTOR_ID) || (function () {
const el = document.createElement('a');
el.id = SELECTOR_ID;
el.className = 'style-scope yt-formatted-string bold yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m';
el.style.cssText = 'margin-left:5px; flex: .6;';
el.textContent = `► Play ${btnList.title}`;
el.title = 'Play all uploads videos from the channel';
return container.appendChild(el);
})())
.href = url;
}
}
});
break;
case 'channel':
let btnList;
switch (NOVA.channelTab) {
case 'videos':
btnList = user_settings.channel_play_all_mode
? { id: 'UULF', title: 'All Videos' }
: { id: 'UULP', title: 'Popular Videos' };
break;
case 'shorts':
btnList = user_settings.channel_play_all_mode
? { id: 'UUSH', title: 'All Shorts' }
: { id: 'UUPS', title: 'Popular Shorts' };
break;
case 'streams':
btnList = user_settings.channel_play_all_mode
? { id: 'UULV', title: 'All Streams' }
: { id: 'UUPV', title: 'Popular Streams' };
break;
}
if (!btnList) return;
NOVA.waitSelector('#header #chips-wrapper')
.then(container => {
container.querySelector(`.${SELECTOR_ID}`)?.remove();
const btn = document.createElement('tp-yt-paper-button');
btn.className = 'style-scope yt-formatted-string bold yt-chip-cloud-chip-renderer 1yt-spec-button-shape-next';
btn.classList.add(SELECTOR_ID);
btn.style.cssText = 'color: wheat; text-wrap: nowrap;';
btn.textContent = `► Play ${btnList.title}`;
btn.addEventListener('click', () => {
if (channelId = NOVA.getChannelId()) {
location.href = endpoint + btnList.id + channelId.substring(2);
}
});
container.append(btn);
});
break;
}
},
options: {
channel_play_all_mode: {
_tagName: 'select',
label: 'Mode',
'label:zh': '模式',
'label:ja': 'モード',
'label:pl': 'Tryb',
options: [
{
label: 'all', value: true,
},
{
label: 'most popular',
},
],
},
channel_play_all_in_watch: {
_tagName: 'input',
label: 'Add in the "watch page" too',
type: 'checkbox',
},
}
});
window.nova_plugins.push({
id: 'channel-default-tab',
title: 'Default tab on channel page',
'title:zh': '频道页默认选项卡',
'title:ja': 'チャンネルページのデフォルトタブ',
'title:pl': 'Domyślna karta na stronie kanału',
run_on_pages: 'channel',
restart_on_location_change: true,
section: 'channel',
_runtime: user_settings => {
if (NOVA.channelTab) return;
if (user_settings.channel_default_tab_mode == 'redirect') {
switch (user_settings.channel_default_tab_thumbs_sort) {
case 'popular':
location.assign(`${location.protocol}//${location.hostname}/${location.pathname}/${user_settings.channel_default_tab}?SRT=P`);
return;
break;
}
location.pathname += '/' + user_settings.channel_default_tab;
}
else {
const tabSelectors = '#tabsContent [role="tab"]';
NOVA.waitSelector(tabSelectors, { destroy_after_page_leaving: true })
.then(() => {
let tabActive;
const tabs = [...document.body.querySelectorAll(tabSelectors)];
switch (user_settings.channel_default_tab) {
case 'videos': tabActive = tabs[1]; break;
default:
location.pathname += '/' + user_settings.channel_default_tab;
}
tabActive?.click();
document.addEventListener('yt-navigate-finish', () => window.dispatchEvent(new Event('resize'))
, { capture: true, once: true });
});
}
},
options: {
channel_default_tab: {
_tagName: 'select',
label: 'Default tab',
'label:zh': '默认标签页',
'label:ja': 'デフォルトのタブ',
'label:pl': 'Domyślna karta',
options: [
{
label: 'videos', value: 'videos', selected: true,
'label:pl': 'wideo',
},
{
label: 'shorts', value: 'shorts',
},
{
label: 'live', value: 'streams',
},
{
label: 'podcasts', value: 'podcasts',
},
{
label: 'releases', value: 'releases',
},
{
label: 'playlists', value: 'playlists',
'label:pl': 'playlista',
},
{
label: 'community', value: 'community',
},
],
},
channel_default_tab_mode: {
_tagName: 'select',
label: 'Mode',
'label:zh': '模式',
'label:ja': 'モード',
'label:pl': 'Tryb',
options: [
{
label: 'click',
'label:pl': 'klik',
},
{
label: 'redirect', value: 'redirect',
'label:pl': 'przekierowanie',
},
],
'data-dependent': { 'channel_default_tab': ['videos'] },
},
channel_default_tab_thumbs_sort: {
_tagName: 'select',
label: 'Sort',
options: [
{
label: 'newest', selected: true,
},
{
label: 'popular', value: 'popular',
},
],
'data-dependent': { 'channel_default_tab_mode': ['redirect'] },
},
}
});
window.nova_plugins.push({
id: 'copy-url',
title: 'Copy URL to clipboard',
'title:zh': '将 URL 复制到剪贴板',
'title:ja': 'URLをクリップボードにコピー',
run_on_pages: 'results, channel, playlist, watch, embed',
section: 'other',
_runtime: user_settings => {
const SELECTOR_ID = 'nova-copy-notification';
document.addEventListener('keydown', evt => {
const hotkeyMod = user_settings.copy_url_hotkey || 'ctrlKey';
if (hotkeyMod == 'ctrlKey' && window.getSelection && window.getSelection().toString()) return;
if (['input', 'textarea', 'select'].includes(evt.target.localName) || evt.target.isContentEditable) return;
if (evt[hotkeyMod] && evt.code === 'KeyC') {
evt.preventDefault();
evt.stopPropagation();
evt.stopImmediatePropagation();
let url;
switch (NOVA.currentPage) {
case 'watch':
case 'embed':
url = 'https://youtu.be/' + (NOVA.queryURL.get('v') || movie_player.getVideoData().video_id);
break;
case 'channel':
url = (channelId = NOVA.getChannelId(user_settings['user-api-key']))
? `https://${location.host}/channel/` + channelId
: location.href;
break
case 'results':
case 'playlist':
url = location.href;
break
}
if (url) {
navigator.clipboard.writeText(url);
showNotification('URL copied');
}
}
});
function showNotification(msg) {
if (typeof showNotification.fade === 'number') {
clearTimeout(showNotification.fade);
clearTimeout(showNotification.hideСompletely);
}
const notify = (document.getElementById(SELECTOR_ID) || (function () {
const el = document.createElement('div');
el.id = SELECTOR_ID;
let initcss = {
position: 'fixed',
'z-index': 9999,
'border-radius': '2px',
'background-color': user_settings.copy_url_color || '#e85717',
'box-shadow': 'rgb(0 0 0 / 50%) 0px 0px 3px',
'border-radius': user_settings['square-avatars'] ? 'inherit' : '12px',
'font-size': `${+user_settings.copy_url_font_size || 1.7}em`,
color: 'var(--yt-spec-text-primary, white)',
padding: '.5em .8em',
cursor: 'pointer',
};
switch (user_settings.copy_url_position) {
case 'top-left':
initcss.top = '60px';
initcss.left = '20px';
break;
case 'bottom-left':
initcss.bottom = '20px';
initcss.left = '20px';
break;
case 'bottom-right':
initcss.bottom = '20px';
initcss.right = '20px';
break;
default:
initcss.top = '60px';
initcss.right = '20px';
break;
}
Object.assign(el.style, initcss);
return document.body.appendChild(el);
})());
notify.textContent = msg;
notify.style.opacity = +user_settings.copy_url_opacity || 1;
notify.style.visibility = 'visible';
showNotification.fade = setTimeout(() => {
notify.style.transition = 'opacity 200ms ease-out';
notify.style.opacity = 0;
showNotification.hideСompletely = setTimeout(() => notify.style.visibility = 'hidden', 5000);
}, 600);
}
},
options: {
copy_url_hotkey: {
_tagName: 'select',
label: 'Hotkey',
'label:zh': '热键',
'label:ja': 'ホットキー',
'label:pl': 'Klawisz skrótu',
options: [
{ label: 'shift+c', value: 'shiftKey', selected: true },
{ label: 'ctrl+c', value: 'ctrlKey' },
],
},
copy_url_position: {
_tagName: 'select',
label: 'Notification position',
options: [
{
label: '↖', value: 'top-left',
},
{
label: '↗', value: 'top-right', selected: true,
},
{
label: '↙', value: 'bottom-left',
},
{
label: '↘', value: 'bottom-right',
},
],
},
copy_url_opacity: {
_tagName: 'input',
label: 'Opacity',
type: 'number',
placeholder: '0.1-1',
step: .1,
min: .1,
max: 1,
value: .8,
},
copy_url_font_size: {
_tagName: 'input',
label: 'Font size',
type: 'number',
title: 'in em',
placeholder: '0.5-3',
step: .1,
min: .5,
max: 3,
value: 1.7,
},
copy_url_color: {
_tagName: 'input',
type: 'color',
value: '#e85717',
label: 'Color',
'label:zh': '颜色',
'label:ja': '色',
'label:pl': 'Kolor',
title: 'default - #e85717',
},
}
});
window.nova_plugins.push({
id: 'rss-link',
title: 'Add RSS feed link',
'title:zh': '添加 RSS 提要链接',
'title:ja': 'RSSフィードリンクを追加',
'title:pl': 'Dodaj kanał RSS',
run_on_pages: 'channel, playlist, -mobile',
restart_on_location_change: true,
section: 'channel',
_runtime: user_settings => {
const
SELECTOR_ID = 'nova-rss-link',
rssLinkPrefix = '/feeds/videos.xml',
playlistURL = rssLinkPrefix + '?playlist_id=' + NOVA.queryURL.get('list'),
genChannelURL = channelId => rssLinkPrefix + '?channel_id=' + channelId;
switch (NOVA.currentPage) {
case 'channel':
NOVA.waitSelector('#channel-header #links-holder #primary-links')
.then(container => {
if (!parseInt(NOVA.css.get('#header div.banner-visible-area', 'height'))) {
container = document.body.querySelector('#channel-header #inner-header-container #buttons');
}
if (url = (document.head.querySelector('link[type="application/rss+xml"][href]')?.href
|| genChannelURL(NOVA.getChannelId(user_settings['user-api-key'])))
) {
insertToHTML({ 'url': url, 'container': container });
}
});
break;
case 'playlist':
NOVA.waitSelector('ytd-playlist-header-renderer .metadata-buttons-wrapper', { destroy_after_page_leaving: true })
.then(container => {
insertToHTML({ 'url': playlistURL, 'container': container, 'is_playlist': true });
});
break;
}
function insertToHTML({ url = required(), container = required(), is_playlist }) {
if (!(container instanceof HTMLElement)) return console.error('container not HTMLElement:', container);
(container.querySelector(`#${SELECTOR_ID}`) || (function () {
const link = document.createElement('a');
link.id = SELECTOR_ID;
link.target = '_blank';
link.title = 'Nova RSS';
link.className = `yt-spec-button-shape-next--overlay`;
link.innerHTML =
`<svg viewBox="-35 -35 55 55" height="100%" width="100%" style="width: auto;">
<g fill="currentColor">
<path fill="#F60" d="M-17.392 7.875c0 3.025-2.46 5.485-5.486 5.485s-5.486-2.46-5.486-5.485c0-3.026 2.46-5.486 5.486-5.486s5.486 2.461 5.486 5.486zm31.351 5.486C14.042.744 8.208-11.757-1.567-19.736c-7.447-6.217-17.089-9.741-26.797-9.708v9.792C-16.877-19.785-5.556-13.535.344-3.66a32.782 32.782 0 0 1 4.788 17.004h8.827v.017zm-14.96 0C-.952 5.249-4.808-2.73-11.108-7.817c-4.821-3.956-11.021-6.184-17.255-6.15v8.245c6.782-.083 13.432 3.807 16.673 9.774a19.296 19.296 0 0 1 2.411 9.326h8.278v-.017z"/>
</g>
</svg>`;
Object.assign(link.style, {
height: '20px',
display: 'inline-block',
padding: '5px',
});
if (is_playlist) {
Object.assign(link.style, {
'margin-right': '8px',
'border-radius': '20px',
'background-color': 'var(--yt-spec-static-overlay-button-secondary)',
color: 'var(--yt-spec-static-overlay-text-primary)',
padding: '8px',
'margin-right': '8px',
'white-space': 'nowrap',
'font-size': 'var(--ytd-tab-system-font-size, 1.4rem)',
'font-weight': 'var(--ytd-tab-system-font-weight, 500)',
'letter-spacing': 'var(--ytd-tab-system-letter-spacing, .007px)',
'text-transform': 'var(--ytd-tab-system-text-transform, uppercase)',
});
}
container.prepend(link);
return link;
})())
.href = url;
}
},
});
window.nova_plugins.push({
id: 'shorts-redirect',
title: 'Redirect Shorts to regular (watch) URLs',
'title:zh': '将 Shorts 重定向到常规（watch）URL',
'title:ja': 'ショートパンツを通常の（watch）URLにリダイレクトする',
'title:pl': 'Przełączaj Shorts na zwykłe adresy URL',
run_on_pages: 'shorts',
restart_on_location_change: true,
section: 'player',
desc: 'Redirect Shorts video to normal player',
'desc:zh': '将 Shorts 视频重定向到普通播放器',
'desc:ja': 'ショートパンツのビデオを通常のプレーヤーにリダイレクトする',
'desc:pl': 'Przełącza krótkie filmy do normalnego odtwarzacza',
_runtime: user_settings => {
location.href = location.href.replace('shorts/', 'watch?v=');
},
});
window.nova_plugins.push({
id: 'collapse-navigation-panel',
title: 'Collapse navigation panel',
'title:zh': '折叠导航面板',
'title:ja': 'ナビゲーション パネルを折りたたむ',
'title:pl': 'Zwiń panel nawigacyjny',
run_on_pages: '*, -watch, -embed, -live_chat',
section: 'other',
_runtime: user_settings => {
NOVA.waitSelector('#guide[opened]')
.then(el => {
document.getElementById('guide-button').click();
el.removeAttribute('opened');
});
},
});
window.nova_plugins.push({
id: 'channel-trailer-stop-preload',
title: 'Stop play channel trailer',
'title:zh': '停止频道预告片',
'title:ja': 'チャンネルの予告編を停止する',
'title:pl': 'Zatrzymaj zwiastun kanału',
run_on_pages: 'channel, -mobile',
restart_on_location_change: true,
section: 'channel',
_runtime: user_settings => {
NOVA.waitSelector('#c4-player.playing-mode', { destroy_after_page_leaving: true })
.then(player => player.stopVideo());
},
});
window.nova_plugins.push({
id: 'default-miniplayer-disable',
title: 'Disable miniplayer',
run_on_pages: 'results, feed, channel, watch, -mobile',
section: 'other',
desc: 'shown on changeable page when playing playlist',
_runtime: user_settings => {
NOVA.css.push(
`.ytp-right-controls .ytp-miniplayer-button {
display: none !important;
}`);
document.addEventListener('yt-action', evt => {
if (evt.detail?.actionName.includes('miniplayer')) {
document.body.querySelector('ytd-miniplayer[active]')
?.remove();
}
});
document.addEventListener('keydown', evt => {
if (['input', 'textarea'].includes(evt.target.localName) || evt.target.isContentEditable) return;
if (evt.ctrlKey || evt.altKey || evt.shiftKey || evt.metaKey) return;
if (NOVA.currentPage == 'watch' && evt.code === 'KeyI') {
evt.preventDefault();
}
}, { capture: true });
},
});
window.nova_plugins.push({
id: 'pages-clear',
title: 'Clear pages of junk',
'title:zh': '清除垃圾页面',
'title:ja': 'ジャンクページをクリアする',
'title:pl': 'Wyczyść strony ze śmieci',
run_on_pages: 'results, feed, watch, embed, -mobile',
section: 'other',
desc: 'Remove the annoying stuff',
'desc:zh': '删除烦人的东西',
'desc:ja': '煩わしいものを取り除く',
'desc:pl': 'Usuń irytujące rzeczy',
_runtime: user_settings => {
let selectorsList = [
'.ytp-paid-content-overlay',
'.iv-branding',
'#movie_player:not(:hover) > [class^="ytp-ce-"]',
'.ytp-cards-teaser-text',
'ytm-paid-content-overlay-renderer',
];
switch (NOVA.currentPage) {
case 'embed':
selectorsList.push([
(user_settings['player-quick-buttons'] && user_settings.player_buttons_custom_items?.includes('card-switch')) || '.ytp-pause-overlay',
'.ytp-info-panel-preview',
]);
break;
default:
selectorsList.push([
'ytd-search-pyv-renderer',
'[class^="ytd-promoted-"]',
'ytd-search-pyv-renderer ~ ytd-shelf-renderer',
'ytd-video-renderer + ytd-shelf-renderer',
'#clarify-box',
'ytd-watch-metadata ytd-info-panel-content-renderer',
'.ytd-watch-flexy.attached-message',
'ytd-popup-container tp-yt-paper-dialog ytd-single-option-survey-renderer',
'#donation-shelf ytd-donation-unavailable-renderer',
`#subscribe-button .smartimation__border,
#subscribe-button .smartimation__background,
ytd-watch-metadata #actions .smartimation__border,
ytd-watch-metadata #actions .smartimation__background`,
'[class^="ytp-cultural-moment"]',
'ytd-donation-unavailable-renderer, .ytd-donation-unavailable-renderer',
'.sparkles-light-cta',
'ytd-feed-nudge-renderer',
]);
if (CSS.supports('selector(:has(*))')) {
selectorsList.push([
'ytd-rich-item-renderer:has(ytd-ad-slot-renderer)',
'#chat[collapsed] #message',
'ytd-popup-container:has(yt-tooltip-renderer[position-type="OPEN_POPUP_POSITION_BOTTOM"])',
]);
}
}
if (selectorsList.length) {
NOVA.css.push(
selectorsList.join(',\n') + ` {
display: none !important;
}`);
}
},
});
window.nova_plugins.push({
id: 'scroll-to-top',
title: 'Add "Scroll to top" button',
'title:zh': '滚动到顶部按钮',
'title:ja': 'トップボタンまでスクロール',
'title:pl': 'Przycisk przewijania do góry',
run_on_pages: '*, -embed, -mobile, -live_chat',
section: 'other',
desc: 'Displayed on long pages',
'desc:zh': '出现在长页面上',
'desc:ja': '長いページに表示されます',
'desc:pl': 'Wyświetlaj na długich stronach',
_runtime: user_settings => {
document.addEventListener('scroll', insertButton, { capture: true, once: true });
function insertButton() {
const SELECTOR_ID = 'nova-scrollTop-btn';
const btn = document.createElement('button');
btn.id = SELECTOR_ID;
Object.assign(btn.style, {
position: 'fixed',
cursor: 'pointer',
bottom: 0,
left: '20%',
visibility: 'hidden',
opacity: .5,
width: '40%',
height: '40px',
border: 'none',
outline: 'none',
'z-index': 99,
'border-radius': '100% 100% 0 0',
'font-size': '16px',
'background-color': 'rgba(0,0,0,.3)',
'box-shadow': '0 16px 24px 2px rgba(0, 0, 0, .14), 0 6px 30px 5px rgba(0, 0, 0, .12), 0 8px 10px -5px rgba(0, 0, 0, .4)',
});
btn.addEventListener('click', () => {
window.scrollTo({
top: 0,
behavior: user_settings.scroll_to_top_smooth ? 'smooth' : 'instant',
});
if (user_settings.scroll_to_top_autoplay && NOVA.currentPage == 'watch'
&& ['UNSTARTED', 'PAUSED'].includes(NOVA.getPlayerState())
) {
movie_player.playVideo();
}
});
const arrow = document.createElement('span');
Object.assign(arrow.style, {
border: 'solid white',
'border-width': '0 3px 3px 0',
display: 'inline-block',
padding: '4px',
'vertical-align': 'middle',
transform: 'rotate(-135deg)',
});
btn.append(arrow);
document.body.append(btn);
NOVA.css.push(
`#${SELECTOR_ID}:hover {
opacity: 1 !important;
background-color: rgba(0,0,0,.6) !important;
}`);
const scrollTop_btn = document.getElementById(SELECTOR_ID);
let sOld;
window.addEventListener('scroll', () => {
const sCurr = document.documentElement.scrollTop > (window.innerHeight / 2);
if (sCurr == sOld) return;
sOld = sCurr;
scrollTop_btn.style.visibility = sCurr ? 'visible' : 'hidden';
});
}
},
options: {
scroll_to_top_smooth: {
_tagName: 'input',
label: 'Smooth',
'label:zh': '光滑的',
'label:ja': 'スムーズ',
'label:pl': 'Płynnie',
type: 'checkbox',
},
scroll_to_top_autoplay: {
_tagName: 'input',
label: 'Unpause a video',
'label:zh': '视频取消暂停',
'label:ja': 'ビデオの一時停止解除',
'label:pl': 'Wyłącz wstrzymanie odtwarzania filmu',
type: 'checkbox',
},
}
});
window.nova_plugins.push({
id: 'pause-background-tab',
title: 'Autopause when switching tabs',
'title:zh': '自动暂停除活动选项卡以外的所有选项卡',
'title:ja': 'アクティブなタブを除くすべてのタブを自動一時停止',
'title:pl': 'Zatrzymanie kart w tle oprócz aktywnej',
run_on_pages: 'watch, embed',
section: 'player',
desc: 'Autopause all background tabs except the active one',
_runtime: user_settings => {
if (location.hostname.includes('youtube-nocookie.com')) {
location.hostname = 'youtube.com';
return;
}
if (typeof window === 'undefined') return;
const
storeName = 'nova-playing-instanceIDTab',
instanceID = String(Math.random()),
removeStorage = () => localStorage.removeItem(storeName);
NOVA.waitSelector('video')
.then(video => {
if (user_settings.pause_background_tab_autoplay_onfocus
&& user_settings.pause_background_tab_autopause_unfocus
) {
} else {
video.addEventListener('playing', checkInstance);
['pause', 'ended'].forEach(evt => video.addEventListener(evt, removeStorage));
window.addEventListener('beforeunload', removeStorage);
window.addEventListener('storage', store => {
if ((!document.hasFocus() || NOVA.currentPage == 'embed')
&& store.key === storeName && store.storageArea === localStorage
&& localStorage.hasOwnProperty(storeName) && localStorage.getItem(storeName) !== instanceID
&& 'PLAYING' == NOVA.getPlayerState()
&& !document.pictureInPictureElement
) {
video.pause();
}
});
function checkInstance() {
if (user_settings.pause_background_tab_autoplay_onfocus !== true
&& localStorage.hasOwnProperty(storeName) && localStorage.getItem(storeName) !== instanceID
&& !document.pictureInPictureElement
) {
video.pause();
}
else {
localStorage.setItem(storeName, instanceID);
}
}
}
if (user_settings.pause_background_tab_autoplay_onfocus) {
window.addEventListener('focus', () => {
if (!localStorage.hasOwnProperty(storeName) && localStorage.getItem(storeName) !== instanceID
&& ['UNSTARTED', 'PAUSED'].includes(NOVA.getPlayerState())
) {
video.play();
}
}, user_settings.pause_background_tab_autoplay_onfocus == 'force' ? false : { capture: true, once: true });
}
if (user_settings.pause_background_tab_autopause_unfocus) {
window.addEventListener('blur', () => {
if ('PLAYING' == NOVA.getPlayerState()
&& !document.pictureInPictureElement
) {
video.pause();
}
});
}
});
},
options: {
pause_background_tab_autoplay_onfocus: {
_tagName: 'select',
label: 'Autoplay on tab focus mode',
'label:zh': '在标签焦点上自动播放',
'label:ja': 'タブフォーカスでの自動再生',
'label:pl': 'Autoodtwarzanie po wybraniu karty',
options: [
{
label: 'disable', selected: true,
},
{
label: 'once for new tab', value: true,
},
{
label: 'always for not started', value: 'force',
},
],
},
pause_background_tab_autopause_unfocus: {
_tagName: 'input',
label: 'Autopause if tab loses focus',
'label:zh': '如果选项卡失去焦点，则自动暂停视频',
'label:ja': 'タブがフォーカスを失った場合にビデオを自動一時停止',
'label:pl': 'Automatycznie wstrzymaj wideo, jeśli karta straci ostrość',
type: 'checkbox',
},
}
});
window.nova_plugins.push({
id: 'video-rate',
title: 'Playback speed control',
'title:zh': '播放速度控制',
'title:ja': '再生速度制御',
'title:pl': 'Kontrola prędkości odtwarzania',
run_on_pages: 'home, results, feed, channel, playlist, watch, embed',
section: 'player',
desc: 'With mouse wheel',
'desc:zh': '带鼠标滚轮',
'desc:ja': 'マウスホイール付き',
'desc:pl': 'Za pomocą kółka myszy',
_runtime: user_settings => {
if (user_settings.rate_overlay_time && +user_settings.rate_default !== 1) {
reCalcOverlayTime();
}
NOVA.waitSelector('#movie_player video')
.then(video => {
const sliderContainer = insertSlider.apply(video);
video.addEventListener('ratechange', function () {
NOVA.showOSD(this.playbackRate + 'x');
if (Object.keys(sliderContainer).length) {
sliderContainer.slider.value = this.playbackRate;
sliderContainer.slider.title = `Speed (${this.playbackRate})`;
sliderContainer.sliderLabel.textContent = `Speed (${this.playbackRate})`;
sliderContainer.sliderCheckbox.checked = (this.playbackRate === 1) ? false : true;
}
});
setDefaultRate.apply(video);
video.addEventListener('loadeddata', setDefaultRate);
if (Object.keys(sliderContainer).length) {
sliderContainer.slider.addEventListener('input', ({ target }) => playerRate.set(target.value));
sliderContainer.slider.addEventListener('change', ({ target }) => playerRate.set(target.value));
sliderContainer.slider.addEventListener('wheel', evt => {
evt.preventDefault();
const rate = playerRate.adjust(+user_settings.rate_step * Math.sign(evt.wheelDelta));
});
sliderContainer.sliderCheckbox.addEventListener('change', ({ target }) => {
target.checked || playerRate.set(1)
});
}
NOVA.runOnPageLoad(async () => {
if (NOVA.currentPage == 'watch' || NOVA.currentPage == 'embed') {
if (user_settings['save-channel-state']) {
if (userRate = await NOVA.storage_obj_manager.getParam('speed')) {
video.addEventListener('playing', () => playerRate.set(userRate), { capture: true, once: true });
}
}
expandAvailableRatesMenu();
}
});
});
if (user_settings.rate_hotkey == 'keyboard') {
document.addEventListener('keydown', evt => {
if (NOVA.currentPage != 'watch' && NOVA.currentPage != 'embed') return;
if (['input', 'textarea', 'select'].includes(evt.target.localName) || evt.target.isContentEditable) return;
if (evt.ctrlKey || evt.altKey || evt.shiftKey || evt.metaKey) return;
let delta;
switch (user_settings.rate_hotkey_custom_up.length === 1 ? evt.key : evt.code) {
case user_settings.rate_hotkey_custom_up: delta = 1; break;
case user_settings.rate_hotkey_custom_down: delta = -1; break;
}
if (delta) {
evt.preventDefault();
if (step = +user_settings.rate_step * Math.sign(delta)) {
const rate = playerRate.adjust(step);
}
}
}, { capture: true });
}
else if (user_settings.rate_hotkey) {
NOVA.waitSelector('.html5-video-container')
.then(container => {
container.addEventListener('wheel', evt => {
evt.preventDefault();
if (evt[user_settings.rate_hotkey] || (user_settings.rate_hotkey == 'none'
&& !evt.ctrlKey && !evt.altKey && !evt.shiftKey && !evt.metaKey)
) {
if (step = +user_settings.rate_step * Math.sign(evt.wheelDelta)) {
const rate = playerRate.adjust(step);
}
}
}, { capture: true });
});
}
if (+user_settings.rate_default !== 1 && user_settings.rate_apply_music) {
NOVA.waitSelector('#upload-info #channel-name .badge-style-type-verified-artist')
.then(icon => playerRate.set(1));
NOVA.waitSelector('#upload-info #channel-name a[href]', { destroy_after_page_leaving: true })
.then(channelName => {
if (/(VEVO|Topic|Records|AMV)$/.test(channelName.textContent)
|| channelName.textContent.toUpperCase().includes('MUSIC')
) {
playerRate.set(1);
}
});
}
const playerRate = {
testDefault: rate => ((+rate % .25) === 0)
&& (+rate <= 2)
&& (+user_settings.rate_default <= 2)
&& (NOVA.videoElement?.playbackRate <= 2)
&& ((NOVA.videoElement?.playbackRate % .25) === 0)
&& (typeof movie_player === 'object' && typeof movie_player.getPlaybackRate === 'function'),
async set(level = 1) {
this.log('set', ...arguments);
if (this.testDefault(level)) {
this.log('set:default');
movie_player.setPlaybackRate(+level) && this.saveInSession(level);
}
else {
this.log('set:html5');
if (NOVA.videoElement) {
NOVA.videoElement.playbackRate = +level;
this.clearInSession();
}
}
},
adjust(rate_step = required()) {
this.log('adjust', ...arguments);
return (this.testDefault(rate_step) && this.default(+rate_step)) || this.html5(+rate_step);
},
default(playback_rate = required()) {
this.log('default', ...arguments);
const playbackRate = movie_player.getPlaybackRate();
const inRange = step => {
const setRateStep = playbackRate + step;
return (.1 <= setRateStep && setRateStep <= 2) && +setRateStep.toFixed(2);
};
const newRate = inRange(+playback_rate);
if (!newRate) return false;
if (newRate && newRate != playbackRate) {
movie_player.setPlaybackRate(newRate);
if (newRate === movie_player.getPlaybackRate()) {
this.saveInSession(newRate);
}
else {
console.error('playerRate:default different: %s!=%s', newRate, movie_player.getPlaybackRate());
}
}
this.log('default return', newRate);
return newRate === movie_player.getPlaybackRate() && newRate;
},
html5(playback_rate = required()) {
this.log('html5', ...arguments);
if (!NOVA.videoElement) return console.error('playerRate > videoElement empty:', NOVA.videoElement);
const playbackRate = NOVA.videoElement.playbackRate;
const inRange = step => {
const setRateStep = playbackRate + step;
return (.1 <= setRateStep && setRateStep <= (+user_settings.rate_max || 2)) && +setRateStep.toFixed(2);
};
const newRate = inRange(+playback_rate);
if (newRate && newRate != playbackRate) {
NOVA.videoElement.playbackRate = newRate;
if (newRate === NOVA.videoElement.playbackRate) {
this.clearInSession();
}
else {
console.error('playerRate:html5 different: %s!=%s', newRate, NOVA.videoElement.playbackRate);
}
}
this.log('html5 return', newRate);
return newRate === NOVA.videoElement.playbackRate && newRate;
},
saveInSession(level = required()) {
try {
sessionStorage['yt-player-playback-rate'] = JSON.stringify({
creation: Date.now(), data: level.toString(),
});
this.log('playbackRate save in session:', ...arguments);
} catch (err) {
console.warn(`${err.name}: save "rate" in sessionStorage failed. It seems that "Block third-party cookies" is enabled`, err.message);
}
},
clearInSession() {
const keyName = 'yt-player-playback-rate';
try {
sessionStorage.hasOwnProperty(keyName) && sessionStorage.removeItem(keyName);
this.log('playbackRate save in session:', ...arguments);
} catch (err) {
console.warn(`${err.name}: save "rate" in sessionStorage failed. It seems that "Block third-party cookies" is enabled`, err.message);
}
},
log() {
if (this.DEBUG && arguments.length) {
console.groupCollapsed(...arguments);
console.trace();
console.groupEnd();
}
},
};
function setDefaultRate() {
if (+user_settings.rate_default !== 1) {
const is_music = NOVA.isMusic();
if (this.playbackRate !== +user_settings.rate_default
&& (!user_settings.rate_apply_music || !is_music)
&& (!isNaN(this.duration) && this.duration > 25)
) {
playerRate.set(user_settings.rate_default);
}
else if (this.playbackRate !== 1 && is_music) {
playerRate.set(1);
}
}
}
function insertSlider() {
const
SELECTOR_ID = 'nova-rate-slider-menu',
SELECTOR = '#' + SELECTOR_ID;
NOVA.css.push(
`${SELECTOR} [type="range"] {
vertical-align: text-bottom;
margin: '0 5px',
}
${SELECTOR} [type="checkbox"] {
appearance: none;
outline: none;
cursor: pointer;
}
${SELECTOR} [type="checkbox"]:checked {
background-color: #f00;
}
${SELECTOR} [type="checkbox"]:checked:after {
left: 20px;
background-color: white;
}`);
const slider = document.createElement('input');
slider.className = 'ytp-menuitem-slider';
slider.type = 'range';
slider.min = +user_settings.rate_step;
slider.max = Math.max((+user_settings.rate_max || 2), +user_settings.rate_default);
slider.step = +user_settings.rate_step;
slider.value = this.playbackRate;
const sliderIcon = document.createElement('div');
sliderIcon.className = 'ytp-menuitem-icon';
const sliderLabel = document.createElement('div');
sliderLabel.className = 'ytp-menuitem-label';
sliderLabel.textContent = `Speed (${this.playbackRate})`;
const sliderCheckbox = document.createElement('input');
sliderCheckbox.className = 'ytp-menuitem-toggle-checkbox';
sliderCheckbox.type = 'checkbox';
sliderCheckbox.title = 'Remember speed';
const out = {};
const right = document.createElement('div');
right.className = 'ytp-menuitem-content';
out.sliderCheckbox = right.appendChild(sliderCheckbox);
out.slider = right.appendChild(slider);
const speedMenu = document.createElement('div');
speedMenu.className = 'ytp-menuitem';
speedMenu.id = SELECTOR_ID;
speedMenu.append(sliderIcon);
out.sliderLabel = speedMenu.appendChild(sliderLabel);
speedMenu.append(right);
document.body.querySelector('.ytp-panel-menu')
?.append(speedMenu);
return out;
}
function expandAvailableRatesMenu() {
if (typeof _yt_player !== 'object') {
return console.error('expandAvailableRatesMenu > _yt_player is empty', _yt_player);
}
if (Object.keys(_yt_player).length
&& (path = NOVA.seachInObjectBy.key({
'obj': _yt_player,
'keys': 'getAvailablePlaybackRates',
})?.path)) {
setAvailableRates(_yt_player, 0, path.split('.'));
}
function setAvailableRates(path, idx, arr) {
if (arr.length - 1 == idx) {
path[arr[idx]] = () => [.25, .5, .75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 3.25, 3.5, 3.75, 4, 10];
}
else {
setAvailableRates(path[arr[idx]], idx + 1, arr);
}
}
}
function reCalcOverlayTime() {
const
ATTR_MARK = 'nova-thumb-overlay-time-recalc';
document.addEventListener('yt-action', evt => {
switch (evt.detail?.actionName) {
case 'yt-append-continuation-items-action':
case 'ytd-update-grid-state-action':
case 'yt-service-request':
case 'ytd-rich-item-index-update-action':
switch (NOVA.currentPage) {
case 'home':
case 'results':
case 'feed':
case 'channel':
case 'watch':
document.body.querySelectorAll(`#thumbnail #overlays #text:not([${ATTR_MARK}])`)
.forEach(overlay => {
if ((timeLabelEl = overlay.textContent.trim())
) {
overlay.setAttribute(ATTR_MARK, true);
const timeSec = NOVA.formatTimeOut.hmsToSec(timeLabelEl);
overlay.textContent =
NOVA.formatTimeOut.HMS.digit(timeSec / user_settings.rate_default);
}
});
break;
}
break;
}
});
}
},
options: {
rate_default: {
_tagName: 'input',
label: 'Speed at startup',
'label:zh': '启动速度',
'label:ja': '起動時の速度',
'label:pl': 'Prędkość przy uruchamianiu',
type: 'number',
title: '1 - default',
step: 0.05,
min: 1,
max: 5,
value: 1,
},
rate_apply_music: {
_tagName: 'select',
label: 'For music genre',
title: 'Extended detection - may trigger falsely',
'title:zh': '扩展检测 - 可能会错误触发',
'title:ja': '拡張検出-誤ってトリガーされる可能性があります',
'title:pl': 'Rozszerzona detekcja - może działać błędnie',
options: [
{
label: 'skip', value: true, selected: true,
'label:zh': '跳过',
'label:ja': 'スキップ',
'label:pl': 'tęsknić',
},
{
label: 'force apply', value: false,
'label:zh': '施力',
'label:ja': '力を加える',
'label:pl': 'zastosować siłę',
},
],
'data-dependent': { 'rate_default': '!1' },
},
rate_overlay_time: {
_tagName: 'input',
label: 'Recalculate time in thumbnail overlay',
type: 'checkbox',
title: 'by "startup" value',
'data-dependent': { 'rate_default': '!1' },
},
rate_hotkey: {
_tagName: 'select',
label: 'Hotkey',
'label:zh': '热键',
'label:ja': 'ホットキー',
'label:pl': 'Klawisz skrótu',
options: [
{ label: 'none', value: false },
{ label: 'alt+wheel', value: 'altKey', selected: true },
{ label: 'shift+wheel', value: 'shiftKey' },
{ label: 'ctrl+wheel', value: 'ctrlKey' },
{ label: 'wheel', value: 'none' },
{ label: 'keyboard', value: 'keyboard' },
],
},
rate_hotkey_custom_up: {
_tagName: 'select',
label: 'Hotkey up',
options: [
{ label: ']', value: ']', selected: true },
{ label: 'none', },
{ label: 'ShiftL', value: 'ShiftLeft' },
{ label: 'ShiftR', value: 'ShiftRight' },
{ label: 'CtrlL', value: 'ControlLeft' },
{ label: 'CtrlR', value: 'ControlRight' },
{ label: 'AltL', value: 'AltLeft' },
{ label: 'AltR', value: 'AltRight' },
{ label: 'ArrowUp', value: 'ArrowUp' },
{ label: 'ArrowDown', value: 'ArrowDown' },
{ label: 'A', value: 'KeyA' },
{ label: 'B', value: 'KeyB' },
{ label: 'C', value: 'KeyC' },
{ label: 'D', value: 'KeyD' },
{ label: 'E', value: 'KeyE' },
{ label: 'F', value: 'KeyF' },
{ label: 'G', value: 'KeyG' },
{ label: 'H', value: 'KeyH' },
{ label: 'I', value: 'KeyI' },
{ label: 'J', value: 'KeyJ' },
{ label: 'K', value: 'KeyK' },
{ label: 'L', value: 'KeyL' },
{ label: 'M', value: 'KeyM' },
{ label: 'N', value: 'KeyN' },
{ label: 'O', value: 'KeyO' },
{ label: 'P', value: 'KeyP' },
{ label: 'Q', value: 'KeyQ' },
{ label: 'R', value: 'KeyR' },
{ label: 'S', value: 'KeyS' },
{ label: 'T', value: 'KeyT' },
{ label: 'U', value: 'KeyU' },
{ label: 'V', value: 'KeyV' },
{ label: 'W', value: 'KeyW' },
{ label: 'X', value: 'KeyX' },
{ label: 'Y', value: 'KeyY' },
{ label: 'Z', value: 'KeyZ' },
0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
'[', '+', '-', ',', '.', '/', '<', ';', '\\',
],
'data-dependent': { 'rate_hotkey': ['keyboard'] },
},
rate_hotkey_custom_down: {
_tagName: 'select',
label: 'Hotkey down',
options: [
{ label: '[', value: '[', selected: true },
{ label: 'none', },
{ label: 'ShiftL', value: 'ShiftLeft' },
{ label: 'ShiftR', value: 'ShiftRight' },
{ label: 'CtrlL', value: 'ControlLeft' },
{ label: 'CtrlR', value: 'ControlRight' },
{ label: 'AltL', value: 'AltLeft' },
{ label: 'AltR', value: 'AltRight' },
{ label: 'ArrowUp', value: 'ArrowUp' },
{ label: 'ArrowDown', value: 'ArrowDown' },
{ label: 'A', value: 'KeyA' },
{ label: 'B', value: 'KeyB' },
{ label: 'C', value: 'KeyC' },
{ label: 'D', value: 'KeyD' },
{ label: 'E', value: 'KeyE' },
{ label: 'F', value: 'KeyF' },
{ label: 'G', value: 'KeyG' },
{ label: 'H', value: 'KeyH' },
{ label: 'I', value: 'KeyI' },
{ label: 'J', value: 'KeyJ' },
{ label: 'K', value: 'KeyK' },
{ label: 'L', value: 'KeyL' },
{ label: 'M', value: 'KeyM' },
{ label: 'N', value: 'KeyN' },
{ label: 'O', value: 'KeyO' },
{ label: 'P', value: 'KeyP' },
{ label: 'Q', value: 'KeyQ' },
{ label: 'R', value: 'KeyR' },
{ label: 'S', value: 'KeyS' },
{ label: 'T', value: 'KeyT' },
{ label: 'U', value: 'KeyU' },
{ label: 'V', value: 'KeyV' },
{ label: 'W', value: 'KeyW' },
{ label: 'X', value: 'KeyX' },
{ label: 'Y', value: 'KeyY' },
{ label: 'Z', value: 'KeyZ' },
0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
']', '+', '-', ',', '.', '/', '<', ';', '\\',
],
'data-dependent': { 'rate_hotkey': ['keyboard'] },
},
rate_step: {
_tagName: 'input',
label: 'Hotkey step',
'label:zh': '步',
'label:ja': 'ステップ',
'label:pl': 'Krok',
type: 'number',
title: '0.25 - default',
placeholder: '0.1-1',
step: 0.05,
min: 0.05,
max: 0.5,
value: 0.25,
},
rate_max: {
_tagName: 'input',
label: 'Hotkey Max',
type: 'number',
title: '2 - default',
placeholder: '2-5',
step: .05,
min: 2,
max: 5,
value: 2,
'data-dependent': { 'rate_hotkey': ['!false', '!'] },
},
}
});
window.nova_plugins.push({
id: 'video-volume',
title: 'Volume',
'title:zh': '体积',
'title:ja': '音量',
'title:pl': 'Głośność',
run_on_pages: 'watch, embed, -mobile',
section: 'player',
desc: 'With mouse wheel',
'desc:zh': '带鼠标滚轮',
'desc:ja': 'マウスホイール付き',
'desc:pl': 'Za pomocą kółka myszy',
_runtime: user_settings => {
NOVA.waitSelector('#movie_player video')
.then(video => {
video.addEventListener('volumechange', function () {
NOVA.showOSD(Math.round(this.volume * 100) + '%');
playerVolume.buildVolumeSlider();
if (user_settings.volume_mute_unsave) {
playerVolume.saveInSession(movie_player.getVolume());
}
});
if (user_settings.volume_loudness_normalization) {
const { set } = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'volume');
Object.defineProperty(HTMLMediaElement.prototype, 'volume', {
enumerable: true,
configurable: true,
set(new_value) {
new_value = movie_player.getVolume() / 100;
set.call(this, new_value);
}
});
}
if (user_settings.volume_hotkey == 'keyboard') {
document.addEventListener('keydown', evt => {
if (NOVA.currentPage != 'watch' && NOVA.currentPage != 'embed') return;
if (['input', 'textarea', 'select'].includes(evt.target.localName) || evt.target.isContentEditable) return;
if (evt.ctrlKey || evt.altKey || evt.shiftKey || evt.metaKey) return;
let delta;
switch (user_settings.volume_hotkey_custom_up.length === 1 ? evt.key : evt.code) {
case user_settings.volume_hotkey_custom_up: delta = 1; break;
case user_settings.volume_hotkey_custom_down: delta = -1; break;
}
if (delta) {
evt.preventDefault();
if (step = +user_settings.volume_step * Math.sign(delta)) {
const volume = playerVolume.adjust(step);
}
}
}, { capture: true });
}
else if (user_settings.volume_hotkey) {
NOVA.waitSelector('.html5-video-container')
.then(container => {
container.addEventListener('wheel', evt => {
evt.preventDefault();
if (evt[user_settings.volume_hotkey] || (user_settings.volume_hotkey == 'none'
&& !evt.ctrlKey && !evt.altKey && !evt.shiftKey && !evt.metaKey)
) {
if (step = +user_settings.volume_step * Math.sign(evt.wheelDelta)) {
const volume = playerVolume.adjust(step);
}
}
}, { capture: true });
});
}
if (defaultLevel = +user_settings.volume_default) {
video.addEventListener('playing', () => {
(defaultLevel > 100)
? playerVolume.unlimit(defaultLevel)
: playerVolume.set(defaultLevel);
}, { capture: true, once: true });
}
if (user_settings['save-channel-state']) {
NOVA.runOnPageLoad(async () => {
if ((NOVA.currentPage == 'watch' || NOVA.currentPage == 'embed')
&& (userVolume = await NOVA.storage_obj_manager.getParam('volume'))
) {
video.addEventListener('playing', () => playerVolume.set(userVolume), { capture: true, once: true });
}
});
}
});
const playerVolume = {
adjust(delta) {
const level = movie_player?.getVolume() + +delta;
return user_settings.volume_unlimit ? this.unlimit(level) : this.set(level);
},
set(level = 50) {
if (typeof movie_player !== 'object' || !movie_player.hasOwnProperty('getVolume')) return console.error('Error getVolume');
const newLevel = Math.max(0, Math.min(100, +level));
if (newLevel !== movie_player.getVolume()) {
movie_player.isMuted() && movie_player.unMute();
movie_player.setVolume(newLevel);
if (newLevel === movie_player.getVolume()) {
}
else {
console.error('setVolumeLevel error! Different: %s!=%s', newLevel, movie_player.getVolume());
}
}
return newLevel === movie_player.getVolume() && newLevel;
},
saveInSession(level = required()) {
const storageData = {
creation: Date.now(),
data: { 'volume': +level, 'muted': (level ? 'false' : 'true') },
};
try {
localStorage['yt-player-volume'] = JSON.stringify(
Object.assign({ expiration: Date.now() + 2592e6 }, storageData)
);
sessionStorage['yt-player-volume'] = JSON.stringify(storageData);
} catch (err) {
console.warn(`${err.name}: save "volume" in sessionStorage failed. It seems that "Block third-party cookies" is enabled`, err.message);
}
},
unlimit(level = 300) {
console.debug('unlimit:', level);
if (level > 100) {
if (!this.audioCtx) {
this.audioCtx = new AudioContext();
const source = this.audioCtx.createMediaElementSource(NOVA.videoElement);
this.node = this.audioCtx.createGain();
this.node.gain.value = Math.trunc(level / 100);
source.connect(this.node);
this.node.connect(this.audioCtx.destination);
}
if (this.node.gain.value < 6) this.node.gain.value += 1;
NOVA.showOSD(movie_player.getVolume() * this.node.gain.value + '%');
}
else {
if (this.audioCtx && this.node.gain.value !== 1) {
this.node.gain.value = 1;
}
this.set(level);
}
},
buildVolumeSlider(timeout_ms = 800) {
if (volumeArea = movie_player?.querySelector('.ytp-volume-area')) {
if (typeof this.showTimeout === 'number') clearTimeout(this.showTimeout);
volumeArea.dispatchEvent(new Event('mouseover', { bubbles: true }));
this.showTimeout = setTimeout(() =>
volumeArea.dispatchEvent(new Event('mouseout', { bubbles: true }))
, timeout_ms);
insertToHTML({
'text': Math.round(movie_player.getVolume()),
'container': volumeArea,
});
}
function insertToHTML({ text = '', container = required() }) {
if (!(container instanceof HTMLElement)) return console.error('container not HTMLElement:', container);
const SELECTOR_ID = 'nova-volume-text';
(document.getElementById(SELECTOR_ID) || (function () {
const SELECTOR = '#' + SELECTOR_ID;
NOVA.css.push(`
${SELECTOR} {
display: none;
text-indent: 2px;
font-size: 110%;
text-shadow: 0 0 2px rgba(0, 0, 0, .5);
cursor: default;
}
${SELECTOR}:after { content: '%'; }
.ytp-volume-control-hover:not([aria-valuenow="0"])+${SELECTOR} {
display: block;
}`);
const el = document.createElement('span');
el.id = SELECTOR_ID;
return container.appendChild(el);
})())
.textContent = text;
container.title = `${text} %`;
}
}
};
},
options: {
volume_default: {
_tagName: 'input',
label: 'Default level',
'label:zh': '默认音量',
'label:ja': 'デフォルトのボリューム',
'label:pl': 'Poziom domyślny',
type: 'number',
title: '0 - auto',
placeholder: '%',
step: 5,
min: 0,
max: 600,
value: 100,
},
volume_hotkey: {
_tagName: 'select',
label: 'Hotkey',
'label:zh': '热键',
'label:ja': 'ホットキー',
'label:pl': 'Klawisz skrótu',
options: [
{ label: 'none', value: false },
{ label: 'wheel', value: 'none', selected: true },
{ label: 'shift+wheel', value: 'shiftKey' },
{ label: 'ctrl+wheel', value: 'ctrlKey' },
{ label: 'alt+wheel', value: 'altKey' },
{ label: 'keyboard', value: 'keyboard' },
],
},
volume_step: {
_tagName: 'input',
label: 'Hotkey step',
'label:zh': '步',
'label:ja': 'ステップ',
'label:pl': 'Krok',
type: 'number',
title: 'in %',
placeholder: '%',
min: 1,
max: 30,
value: 10,
'data-dependent': { 'volume_hotkey': ['!false'] },
},
volume_hotkey_custom_up: {
_tagName: 'select',
label: 'Hotkey up',
options: [
{ label: 'ShiftL', value: 'ShiftLeft' },
{ label: 'ShiftR', value: 'ShiftRight' },
{ label: 'CtrlL', value: 'ControlLeft' },
{ label: 'CtrlR', value: 'ControlRight' },
{ label: 'AltL', value: 'AltLeft' },
{ label: 'AltR', value: 'AltRight' },
{ label: 'A', value: 'KeyA' },
{ label: 'B', value: 'KeyB' },
{ label: 'C', value: 'KeyC' },
{ label: 'D', value: 'KeyD' },
{ label: 'E', value: 'KeyE' },
{ label: 'F', value: 'KeyF' },
{ label: 'G', value: 'KeyG' },
{ label: 'H', value: 'KeyH' },
{ label: 'I', value: 'KeyI' },
{ label: 'J', value: 'KeyJ' },
{ label: 'K', value: 'KeyK' },
{ label: 'L', value: 'KeyL' },
{ label: 'M', value: 'KeyM' },
{ label: 'N', value: 'KeyN' },
{ label: 'O', value: 'KeyO' },
{ label: 'P', value: 'KeyP' },
{ label: 'Q', value: 'KeyQ' },
{ label: 'R', value: 'KeyR' },
{ label: 'S', value: 'KeyS' },
{ label: 'T', value: 'KeyT' },
{ label: 'U', value: 'KeyU' },
{ label: 'V', value: 'KeyV' },
{ label: 'W', value: 'KeyW' },
{ label: 'X', value: 'KeyX' },
{ label: 'Y', value: 'KeyY' },
{ label: 'Z', value: 'KeyZ' },
0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
'[', '+', '-', ',', '.', '/', '<', ';', '\\',
],
'data-dependent': { 'volume_hotkey': ['keyboard'] },
},
volume_hotkey_custom_down: {
_tagName: 'select',
label: 'Hotkey down',
options: [
{ label: 'ShiftL', value: 'ShiftLeft' },
{ label: 'ShiftR', value: 'ShiftRight' },
{ label: 'CtrlL', value: 'ControlLeft' },
{ label: 'CtrlR', value: 'ControlRight' },
{ label: 'AltL', value: 'AltLeft' },
{ label: 'AltR', value: 'AltRight' },
{ label: 'A', value: 'KeyA' },
{ label: 'B', value: 'KeyB' },
{ label: 'C', value: 'KeyC' },
{ label: 'D', value: 'KeyD' },
{ label: 'E', value: 'KeyE' },
{ label: 'F', value: 'KeyF' },
{ label: 'G', value: 'KeyG' },
{ label: 'H', value: 'KeyH' },
{ label: 'I', value: 'KeyI' },
{ label: 'J', value: 'KeyJ' },
{ label: 'K', value: 'KeyK' },
{ label: 'L', value: 'KeyL' },
{ label: 'M', value: 'KeyM' },
{ label: 'N', value: 'KeyN' },
{ label: 'O', value: 'KeyO' },
{ label: 'P', value: 'KeyP' },
{ label: 'Q', value: 'KeyQ' },
{ label: 'R', value: 'KeyR' },
{ label: 'S', value: 'KeyS' },
{ label: 'T', value: 'KeyT' },
{ label: 'U', value: 'KeyU' },
{ label: 'V', value: 'KeyV' },
{ label: 'W', value: 'KeyW' },
{ label: 'X', value: 'KeyX' },
{ label: 'Y', value: 'KeyY' },
{ label: 'Z', value: 'KeyZ' },
0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
'[', '+', '-', ',', '.', '/', '<', ';', '\\',
],
'data-dependent': { 'volume_hotkey': ['keyboard'] },
},
volume_mute_unsave: {
_tagName: 'input',
label: 'Not keep muted state',
'label:zh': '不保存静音模式',
'label:ja': 'マナーモードを保存しない',
'label:pl': 'Nie zachowuj wyciszonego stanu',
type: 'checkbox',
title: 'Only affects new tabs',
'title:zh': '只影响新标签',
'title:ja': '新しいタブにのみ影響します',
'title:pl': 'Dotyczy tylko nowych kart',
},
volume_loudness_normalization: {
_tagName: 'input',
label: 'Stable volume level',
type: 'checkbox',
title: 'Boost volume level',
},
volume_unlimit: {
_tagName: 'input',
label: 'Allow above 100%',
'label:zh': '允许超过 100%',
'label:ja': '100％以上を許可する',
'label:pl': 'Zezwól powyżej 100%',
type: 'checkbox',
title: 'With sound distortion',
'data-dependent': { 'volume_hotkey': ['!false'] },
},
}
});
window.nova_plugins.push({
id: 'player-pin-scroll',
title: 'Pin player while scrolling',
'title:zh': '滚动时固定播放器',
'title:ja': 'スクロール中にプレイヤーを固定する',
'title:pl': 'Przypnij odtwarzacz podczas przewijania',
run_on_pages: 'watch, -mobile',
section: 'player',
desc: 'Show mini player when scrolling down',
_runtime: user_settings => {
if (!('IntersectionObserver' in window)) return alert('Nova\n\nPin player Error!\nIntersectionObserver not supported.');
const
CLASS_VALUE = 'nova-player-pin',
PINNED_SELECTOR = '.' + CLASS_VALUE,
UNPIN_BTN_CLASS_VALUE = CLASS_VALUE + '-unpin-btn',
UNPIN_BTN_SELECTOR = '.' + UNPIN_BTN_CLASS_VALUE;
document.addEventListener('scroll', () => {
NOVA.waitSelector('#ytd-player')
.then(container => {
new IntersectionObserver(([entry]) => {
if (entry.isIntersecting) {
movie_player.classList.remove(CLASS_VALUE);
makeDraggable.reset();
makeDraggable.disable();
}
else if (!document.fullscreenElement
&& document.documentElement.scrollTop
) {
movie_player.classList.add(CLASS_VALUE);
makeDraggable.init(movie_player);
if (makeDraggable.storePos?.X) makeDraggable.moveByCoordinates(makeDraggable.storePos);
}
window.dispatchEvent(new Event('resize'));
}, {
threshold: .5,
})
.observe(container);
});
}, { capture: true, once: true });
NOVA.waitSelector(PINNED_SELECTOR)
.then(async player => {
await NOVA.waitUntil(
() => (NOVA.videoElement?.videoWidth && !isNaN(NOVA.videoElement.videoWidth)
&& NOVA.videoElement?.videoHeight && !isNaN(NOVA.videoElement.videoHeight)
)
, 500);
initMiniStyles();
insertUnpinButton(player);
document.addEventListener('fullscreenchange', () =>
document.fullscreenElement && movie_player.classList.remove(CLASS_VALUE)
);
NOVA.waitSelector('#movie_player video')
.then(video => {
video.addEventListener('loadeddata', () => {
if (NOVA.currentPage != 'watch') return;
NOVA.waitSelector(PINNED_SELECTOR, { destroy_after_page_leaving: true })
.then(() => {
const width = NOVA.aspectRatio.calculateWidth(
movie_player.clientHeight,
NOVA.aspectRatio.chooseAspectRatio({
'width': NOVA.videoElement.videoWidth,
'height': NOVA.videoElement.videoHeight,
'layout': 'landscape',
}),
);
player.style.setProperty('--width', `${width}px !important;`);
});
});
});
if (user_settings.player_float_scroll_after_fullscreen_restore_srcoll_pos) {
let scrollPos = 0;
document.addEventListener('yt-navigate-start', () => scrollPos = 0);
document.addEventListener('fullscreenchange', () => {
if (!document.fullscreenElement
&& scrollPos
&& makeDraggable.storePos
) {
window.scrollTo({
top: scrollPos,
});
}
}, { capture: false });
document.addEventListener('fullscreenchange', () => {
if (document.fullscreenElement) {
scrollPos = document.documentElement.scrollTop;
}
}, { capture: true });
}
});
function initMiniStyles() {
const scrollbarWidth = (window.innerWidth - document.documentElement.clientWidth || 0) + 'px';
const miniSize = NOVA.aspectRatio.sizeToFit({
'srcWidth': NOVA.videoElement.videoWidth,
'srcHeight': NOVA.videoElement.videoHeight,
'maxWidth': (window.innerWidth / user_settings.player_float_scroll_size_ratio),
'maxHeight': (window.innerHeight / user_settings.player_float_scroll_size_ratio),
});
let initcss = {
width: NOVA.aspectRatio.calculateWidth(
miniSize.height,
NOVA.aspectRatio.chooseAspectRatio({ 'width': miniSize.width, 'height': miniSize.height })
) + 'px',
height: miniSize.height + 'px',
position: 'fixed',
'z-index': 'var(--zIndex)',
'box-shadow': '0 16px 24px 2px rgba(0, 0, 0, .14),' +
'0 6px 30px 5px rgba(0, 0, 0, .12),' +
'0 8px 10px -5px rgba(0, 0, 0, .4)',
};
switch (user_settings.player_float_scroll_position) {
case 'top-left':
initcss.top = user_settings['header-unfixed'] ? 0
: (document.getElementById('masthead-container')?.offsetHeight || 0) + 'px';
initcss.left = 0;
break;
case 'top-right':
initcss.top = user_settings['header-unfixed'] ? 0
: (document.getElementById('masthead-container')?.offsetHeight || 0) + 'px';
initcss.right = scrollbarWidth;
break;
case 'bottom-left':
initcss.bottom = 0;
initcss.left = 0;
break;
case 'bottom-right':
initcss.bottom = 0;
initcss.right = scrollbarWidth;
break;
}
NOVA.css.push(initcss, PINNED_SELECTOR, 'important');
NOVA.css.push(
`html[style*="ytrb-bar"] ${PINNED_SELECTOR} {
--zIndex: 1000;
}
${PINNED_SELECTOR} {
--height: ${initcss.height} !important;
--width: ${initcss.width} !important;
width: var(--width) !important;
height: var(--height) !important;
background-color: var(--yt-spec-base-background);
${user_settings['square-avatars'] ? '' : 'border-radius: 12px;'}
margin: 1em 2em;
--zIndex: ${1 + Math.max(
NOVA.css.get('#chat', 'z-index'),
NOVA.css.get('.ytp-chrome-top .ytp-cards-button', 'z-index'),
NOVA.css.get('#chat', 'z-index'),
NOVA.css.get('ytrb-bar', 'z-index'),
601)};
}
${PINNED_SELECTOR} video {
object-fit: contain !important;
}
${PINNED_SELECTOR} .ytp-chrome-controls .nova-right-custom-button,
${PINNED_SELECTOR} .ytp-chrome-controls #nova-player-time-remaining,
${PINNED_SELECTOR} .ytp-chrome-controls button.ytp-size-button,
${PINNED_SELECTOR} .ytp-chrome-controls button.ytp-subtitles-button,
${PINNED_SELECTOR} .ytp-chrome-controls button.ytp-settings-button,
${PINNED_SELECTOR} .ytp-chrome-controls .ytp-chapter-container {
display: none !important;
}`);
NOVA.css.push(`
${PINNED_SELECTOR} .ytp-preview,
${PINNED_SELECTOR} .ytp-scrubber-container,
${PINNED_SELECTOR} .ytp-hover-progress,
${PINNED_SELECTOR} .ytp-gradient-bottom { display:none !important; }
${PINNED_SELECTOR} .ytp-chrome-bottom { width: 96% !important; }
${PINNED_SELECTOR} .ytp-chapters-container { display: flex; }`);
NOVA.css.push(
`${PINNED_SELECTOR} video {
width: var(--width) !important;
height: var(--height) !important;
left: 0 !important;
top: 0 !important;
}
${PINNED_SELECTOR}.ended-mode video {
visibility: hidden;
}`);
    NOVA.waitSelector('#player-container, #secondary, #below')
        .then(() => {
        if (document.querySelector('#player-container')) {
            document.querySelector('#player-container').style.zIndex = '99';
        }
        if (document.querySelector('#below')) {
            document.querySelector('#below').style.zIndex = '88';
        }
        if (document.querySelector('#secondary')) {
            document.querySelector('#secondary').style.zIndex = '77';
        }
    });
}
function insertUnpinButton(player = movie_player) {
NOVA.css.push(
UNPIN_BTN_SELECTOR + ` { display: none; }
${PINNED_SELECTOR} ${UNPIN_BTN_SELECTOR} {
display: inherit !important;
position: absolute;
cursor: pointer;
top: 10px;
left: 10px;
width: 28px;
height: 28px;
color: white;
border: none;
outline: none;
opacity: .1;
${user_settings['square-avatars'] ? '' : 'border-radius: 100%;'}
z-index: var(--zIndex);
font-size: 24px;
font-weight: bold;
background-color: rgba(0, 0, 0, .8);
transition: opacity 100ms linear;
}
${PINNED_SELECTOR}:hover ${UNPIN_BTN_SELECTOR} { opacity: .7; }
${UNPIN_BTN_SELECTOR}:hover { opacity: 1 !important; }`);
const btnUnpin = document.createElement('button');
btnUnpin.className = UNPIN_BTN_CLASS_VALUE;
btnUnpin.title = 'Unpin player';
btnUnpin.textContent = '×';
btnUnpin.addEventListener('click', () => {
player.classList.remove(CLASS_VALUE);
makeDraggable.reset('clear storePos');
window.dispatchEvent(new Event('resize'));
});
player.append(btnUnpin);
document.addEventListener('yt-navigate-start', () => {
if (player.classList.contains(CLASS_VALUE)) {
player.classList.remove(CLASS_VALUE);
makeDraggable.reset();
}
});
}
const makeDraggable = {
attrNameMoving: 'nova-el-moving',
init(el_target = required()) {
this.log('drag init', ...arguments);
if (!(el_target instanceof HTMLElement)) return console.error('el_target not HTMLElement:', el_target);
this.dragTarget = el_target;
document.addEventListener('touchstart', this.dragStart.bind(this));
document.addEventListener('touchend', this.dragEnd.bind(this));
document.addEventListener('touchmove', this.draging.bind(this));
document.addEventListener('mousedown', this.dragStart.bind(this));
document.addEventListener('mouseup', this.dragEnd.bind(this));
document.addEventListener('mousemove', this.draging.bind(this));
},
reset(clear_storePos) {
this.dragTarget?.style.removeProperty('transform');
this.storePos = clear_storePos
? this.xOffset = this.yOffset = 0
: { 'X': this.xOffset, 'Y': this.yOffset };
},
disable() {
this.log('dragDisable', ...arguments);
this.dragTarget = null;
document.removeEventListener('touchstart', this.dragStart);
document.removeEventListener('touchend', this.dragEnd);
document.removeEventListener('touchmove', this.draging);
document.removeEventListener('mousedown', this.dragStart);
document.removeEventListener('mouseup', this.dragEnd);
document.removeEventListener('mousemove', this.draging);
},
dragStart(evt) {
if (!this.dragTarget.contains(evt.target)) return;
this.log('dragStart');
switch (evt.type) {
case 'touchstart':
this.initialX = evt.touches[0].clientX - (this.xOffset || 0);
this.initialY = evt.touches[0].clientY - (this.yOffset || 0);
break;
case 'mousedown':
this.initialX = evt.clientX - (this.xOffset || 0);
this.initialY = evt.clientY - (this.yOffset || 0);
break;
}
this.moving = true;
},
dragEnd(evt) {
if (!this.moving) return;
this.log('dragEnd');
this.initialX = this.currentX;
this.initialY = this.currentY;
this.moving = false;
this.dragTarget.style.pointerEvents = null;
document.body.style.removeProperty('cursor');
this.dragTarget.removeAttribute(this.attrNameMoving);
},
draging(evt) {
if (!this.moving) return;
this.log('draging');
this.dragTarget.style.pointerEvents = 'none';
document.body.style.cursor = 'move';
if (!this.dragTarget.hasAttribute(this.attrNameMoving)) this.dragTarget.setAttribute(this.attrNameMoving, true);
switch (evt.type) {
case 'touchmove':
this.currentX = evt.touches[0].clientX - this.initialX;
this.currentY = evt.touches[0].clientY - this.initialY;
break;
case 'mousemove':
const
rect = this.dragTarget.getBoundingClientRect();
if (rect.left >= document.body.clientWidth - this.dragTarget.offsetWidth) {
this.currentX = Math.min(
evt.clientX - this.initialX,
document.body.clientWidth - this.dragTarget.offsetWidth - this.dragTarget.offsetLeft
);
}
else {
this.currentX = Math.max(evt.clientX - this.initialX, 0 - this.dragTarget.offsetLeft);
}
if (rect.top >= window.innerHeight - this.dragTarget.offsetHeight) {
this.currentY = Math.min(
evt.clientY - this.initialY,
window.innerHeight - this.dragTarget.offsetHeight - this.dragTarget.offsetTop
);
}
else {
this.currentY = Math.max(evt.clientY - this.initialY, 0 - this.dragTarget.offsetTop);
}
break;
}
this.xOffset = this.currentX;
this.yOffset = this.currentY;
this.moveByCoordinates({ 'X': this.currentX, 'Y': this.currentY });
},
moveByCoordinates({ X = required(), Y = required() }) {
this.log('moveByCoordinates', ...arguments);
this.dragTarget.style.transform = `translate3d(${X}px, ${Y}px, 0)`;
},
log() {
if (this.DEBUG && arguments.length) {
console.groupCollapsed(...arguments);
console.trace();
console.groupEnd();
}
},
};
},
options: {
player_float_scroll_size_ratio: {
_tagName: 'input',
label: 'Player size',
'label:zh': '播放器尺寸',
'label:ja': 'プレーヤーのサイズ',
'label:pl': 'Rozmiar odtwarzacza',
type: 'number',
title: 'Less value - larger size',
'title:zh': '较小的值 - 较大的尺寸',
'title:ja': '小さい値-大きいサイズ',
'title:pl': 'Mniejsza wartość - większy rozmiar',
placeholder: '2-5',
step: 0.1,
min: 1,
max: 5,
value: 2.5,
},
player_float_scroll_position: {
_tagName: 'select',
label: 'Player position',
'label:zh': '球员位置',
'label:ja': 'プレイヤーの位置',
'label:pl': 'Pozycja odtwarzacza',
options: [
{
label: '↖', value: 'top-left',
},
{
label: '↗', value: 'top-right', selected: true,
},
{
label: '↙', value: 'bottom-left',
},
{
label: '↘', value: 'bottom-right',
},
],
},
player_float_scroll_after_fullscreen_restore_srcoll_pos: {
_tagName: 'input',
label: 'Restore scrolling back there after exiting fullscreen',
type: 'checkbox',
},
}
});
window.nova_plugins.push({
id: 'video-quality',
title: 'Video quality',
'title:zh': '视频质量',
'title:ja': 'ビデオ品質',
'title:pl': 'Jakość wideo',
run_on_pages: 'watch, embed',
section: 'player',
_runtime: user_settings => {
const qualityFormatListWidth = {
highres: 4320,
hd2880: 2880,
hd2160: 2160,
hd1440: 1440,
hd1080: 1080,
hd720: 720,
large: 480,
medium: 360,
small: 240,
tiny: 144,
};
let selectedQuality = user_settings.video_quality;
NOVA.waitSelector('#movie_player')
.then(movie_player => {
if (user_settings.video_quality_manual_save_in_tab
&& NOVA.currentPage == 'watch'
) {
movie_player.addEventListener('onPlaybackQualityChange', quality => {
if (document.activeElement.getAttribute('role') == 'menuitemradio'
&& quality !== selectedQuality
) {
console.info(`keep quality "${quality}" in the session`);
selectedQuality = quality;
user_settings.video_quality_for_music = false;
user_settings.video_quality_for_fullscreen = false;
}
});
}
if (user_settings['save-channel-state']) {
NOVA.runOnPageLoad(async () => {
if ((NOVA.currentPage == 'watch' || NOVA.currentPage == 'embed')
&& (userQuality = await NOVA.storage_obj_manager.getParam('quality'))
) {
selectedQuality = userQuality;
}
});
}
setQuality();
movie_player.addEventListener('onStateChange', setQuality);
if (user_settings.video_quality_for_fullscreen) {
let selectedQualityBackup = selectedQuality;
document.addEventListener('fullscreenchange', () => {
selectedQuality = document.fullscreenElement
? user_settings.video_quality_for_fullscreen
: selectedQualityBackup;
movie_player.setPlaybackQualityRange(selectedQuality, selectedQuality);
});
}
});
async function setQuality(state) {
if (!selectedQuality) return console.error('selectedQuality unavailable', selectedQuality);
if (user_settings.video_quality_for_music
&& location.search.includes('list=')
&& NOVA.isMusic()
) {
selectedQuality = user_settings.video_quality_for_music;
}
if ((1 == state || 3 == state) && !this.quality_lock) {
this.quality_lock = true;
let availableQualityLevels;
await NOVA.waitUntil(() => (availableQualityLevels = movie_player.getAvailableQualityLevels()) && availableQualityLevels.length, 50);
if (user_settings.video_quality_premium
&& (qualityToSet = [...movie_player.getAvailableQualityData()]
.find(q => //q.quality == selectedQuality
q.isPlayable &&
q.qualityLabel?.toLocaleLowerCase().includes('premium'))?.qualityLabel
)
) {
return setPremium(qualityToSet);
}
const maxWidth = (NOVA.currentPage == 'watch') ? screen.width : window.innerWidth;
const maxQualityIdx = availableQualityLevels.findIndex(i => qualityFormatListWidth[i] <= (maxWidth * 1.3));
availableQualityLevels = availableQualityLevels.slice(maxQualityIdx);
const availableQualityIdx = function () {
let i = availableQualityLevels.indexOf(selectedQuality);
if (i === -1) {
const
availableQuality = Object.keys(qualityFormatListWidth)
.filter(v => availableQualityLevels.includes(v) || (v == selectedQuality)),
nearestQualityIdx = availableQuality.findIndex(q => q === selectedQuality) - 1;
i = availableQualityLevels[nearestQualityIdx] ? nearestQualityIdx : 0;
}
return i;
}();
const newQuality = availableQualityLevels[availableQualityIdx];
if (typeof movie_player.setPlaybackQuality === 'function') {
movie_player.setPlaybackQuality(newQuality);
}
if (typeof movie_player.setPlaybackQualityRange === 'function') {
movie_player.setPlaybackQualityRange(newQuality, newQuality);
}
}
else if (state <= 0) {
this.quality_lock = false;
}
}
async function setPremium(qualityLabel = required()) {
const SELECTOR_CONTAINER = '#movie_player';
const settingsButton = await NOVA.waitSelector(`${SELECTOR_CONTAINER} .ytp-chrome-bottom button.ytp-settings-button[aria-expanded="false"]`);
settingsButton.click();
//const qualityMenuButton = await NOVA.waitSelector(`${SELECTOR_CONTAINER} .ytp-settings-menu [role="menuitem"]:last-child`);
const qualityMenuButton = [...document.body.querySelectorAll(`${SELECTOR_CONTAINER} .ytp-settings-menu [role="menuitem"] .ytp-menuitem-content`)]
.find(menuItem => menuItem.textContent.toLocaleLowerCase().includes('auto') || (NOVA.extractAsNum.int(menuItem.textContent) >= 144));
qualityMenuButton.click();
const qualityItem = [...document.body.querySelectorAll('.ytp-quality-menu [role="menuitemradio"]')]
.find(menuItem => menuItem.textContent.includes(qualityLabel));
await NOVA.delay(1500);
qualityItem.click();
document.body.click();
document.body.querySelector('video').focus();
setQuality.quality_lock = true;
}
NOVA.waitSelector('.ytp-error [class*="reason"]', { destroy_after_page_leaving: true })
.then(error_reason_el => {
if (alertText = error_reason_el.textContent) {
throw alertText;
}
});
},
options: {
video_quality: {
_tagName: 'select',
label: 'Default',
'label:zh': '默认视频质量',
'label:ja': 'デフォルトのビデオ品質',
'label:pl': 'Domyślna jakość',
options: [
{ label: '8K/4320p', value: 'highres' },
{ label: '5K/2880p', value: 'hd2880' },
{ label: '4K/2160p', value: 'hd2160' },
{ label: 'QHD/1440p', value: 'hd1440' },
{ label: 'FHD/1080p', value: 'hd1080', selected: true },
{ label: 'HD/720p', value: 'hd720' },
{ label: '480p', value: 'large' },
{ label: '360p', value: 'medium' },
{ label: 'SD/240p', value: 'small' },
{ label: '144p', value: 'tiny' },
],
},
video_quality_premium: {
_tagName: 'input',
label: 'Use Premium bitrate if available',
type: 'checkbox',
},
video_quality_manual_save_in_tab: {
_tagName: 'input',
label: 'Save manual selection for next video',
'label:zh': '手动选择的质量保存在当前选项卡中',
'label:ja': '手動で選択した品質が現在のタブに保存されます',
'label:pl': 'Właściwości dla obecnej karty',
type: 'checkbox',
title: 'Affects to next videos',
'title:zh': '对下一个视频的影响',
'title:ja': '次の動画への影響',
'title:pl': 'Zmiany w następnych filmach',
},
video_quality_for_music: {
_tagName: 'select',
label: 'For music (in playlists)',
title: 'to save traffic / increase speed',
'title:zh': '节省流量/提高速度',
'title:ja': 'トラフィックを節約/速度を上げる',
'title:pl': 'aby zaoszczędzić ruch / zwiększyć prędkość',
options: [
{ label: 'QHD/1440p', value: 'hd1440' },
{ label: 'FHD/1080p', value: 'hd1080' },
{ label: 'HD/720p', value: 'hd720' },
{ label: 'SD/480p', value: 'large' },
{ label: 'SD/360p', value: 'medium' },
{ label: 'SD/240p', value: 'small' },
{ label: 'SD/144p', value: 'tiny' },
{ label: 'Auto', value: 'auto' },
{ label: 'default', selected: true },
],
},
video_quality_for_fullscreen: {
_tagName: 'select',
label: 'For fullscreen',
options: [
{ label: '8K/4320p', value: 'highres' },
{ label: '4K/2160p', value: 'hd2160' },
{ label: 'QHD/1440p', value: 'hd1440' },
{ label: 'FHD/1080p', value: 'hd1080' },
{ label: 'HD/720p', value: 'hd720' },
{ label: 'SD/480p', value: 'large' },
{ label: 'SD/360p', value: 'medium' },
{ label: 'default', selected: true },
],
},
}
});
window.nova_plugins.push({
id: 'player-resume-playback',
title: 'Remember playback time',
'title:zh': '恢复播放时间状态',
'title:ja': '再生時間の位置を再開します',
'title:pl': 'Powrót do pozycji czasowej odtwarzania',
run_on_pages: 'watch, embed',
section: 'player',
desc: 'On page reload - resume playback',
'desc:zh': '在页面重新加载 - 恢复播放',
'desc:ja': 'ページがリロードされると、再生が復元されます',
'desc:pl': 'Przy ponownym załadowaniu strony - wznawiaj odtwarzanie',
_runtime: user_settings => {
if (!navigator.cookieEnabled && NOVA.currentPage == 'embed') return;
const
CACHE_PREFIX = 'nova-resume-playback-time',
getCacheName = () => CACHE_PREFIX + ':' + (NOVA.queryURL.get('v') || movie_player.getVideoData().video_id);
let cacheName;
NOVA.waitSelector('#movie_player video')
.then(video => {
cacheName = getCacheName();
resumePlayback.apply(video);
video.addEventListener('loadeddata', resumePlayback.bind(video));
video.addEventListener('timeupdate', savePlayback.bind(video));
video.addEventListener('ended', () => sessionStorage.removeItem(cacheName));
if (user_settings.player_resume_playback_url_mark && NOVA.currentPage != 'embed') {
if (NOVA.queryURL.has('t') || NOVA.queryURL.getHashParam('t')) {
document.addEventListener('yt-navigate-finish', connectSaveStateInURL.bind(video)
, { capture: true, once: true });
}
else {
connectSaveStateInURL.apply(video);
}
}
});
function savePlayback() {
if (this.currentTime > 5 && this.duration > 30 && !movie_player.classList.contains('ad-showing')) {
sessionStorage.setItem(cacheName, Math.trunc(this.currentTime));
}
}
async function resumePlayback() {
if (NOVA.queryURL.has('t') || NOVA.queryURL.getHashParam('t')
|| (user_settings['save-channel-state'] && await NOVA.storage_obj_manager.getParam('ignore-playback'))
) {
return;
}
cacheName = getCacheName();
if ((time = +sessionStorage.getItem(cacheName))
&& (time < (this.duration - 1))
) {
this.currentTime = time;
}
}
function connectSaveStateInURL() {
let delaySaveOnPauseURL;
this.addEventListener('pause', () => {
if (this.currentTime < (this.duration - 1) && this.currentTime > 5 && this.duration > 10) {
delaySaveOnPauseURL = setTimeout(() => {
NOVA.updateUrl(NOVA.queryURL.set({ 't': Math.trunc(this.currentTime) + 's' }));
}, 100);
}
});
this.addEventListener('playing', () => {
if (typeof delaySaveOnPauseURL === 'number') clearTimeout(delaySaveOnPauseURL);
if (NOVA.queryURL.has('t')) NOVA.updateUrl(NOVA.queryURL.remove('t'));
});
}
},
options: {
player_resume_playback_url_mark: {
_tagName: 'input',
label: 'Mark time in URL when paused',
'label:zh': '暂停时在 URL 中节省时间',
'label:ja': '一時停止したときにURLで時間を節約する',
'label:pl': 'Zaznacz czas w adresie URL po wstrzymaniu',
type: 'checkbox',
title: 'Makes sense when saving bookmarks',
'title:zh': '保存书签时有意义',
'title:ja': 'ブックマークを保存するときに意味があります',
'title:pl': 'Ma sens podczas zapisywania zakładek',
},
}
});
window.nova_plugins.push({
id: 'video-autostop',
title: 'Stop video preload',
'title:zh': '停止视频预加载',
'title:ja': 'ビデオのプリロードを停止します',
'title:pl': 'Zatrzymaj ładowanie wideo',
run_on_pages: 'watch, embed',
section: 'player',
desc: 'Prevent auto-buffering',
_runtime: user_settings => {
if (user_settings.video_autostop_embed && NOVA.currentPage != 'embed') return;
if (location.hostname.includes('youtube.googleapis.com')) return;
if (NOVA.queryURL.has('popup')) return;
if (NOVA.currentPage == 'embed'
&& window.self !== window.top
&& ['0', 'false'].includes(NOVA.queryURL.get('autoplay'))
) {
return;
}
if (user_settings.video_autostop_peview_thumbnail && NOVA.currentPage == 'watch') {
NOVA.css.push(
`.unstarted-mode {
background: url("https://i.ytimg.com/vi/${NOVA.queryURL.get('v')}/maxresdefault.jpg") center center / contain no-repeat content-box;
}
.unstarted-mode video {
opacity: 0 !important;
}`);
}
NOVA.waitSelector('#movie_player')
.then(async movie_player => {
let disableStop;
document.addEventListener('yt-navigate-start', () => disableStop = false);
await NOVA.waitUntil(() => typeof movie_player === 'object' && typeof movie_player.stopVideo === 'function', 100);
movie_player.stopVideo();
movie_player.addEventListener('onStateChange', onPlayerStateChange.bind(this));
function onPlayerStateChange(state) {
if (user_settings.video_autostop_ignore_playlist && location.search.includes('list=')) return;
if (user_settings.video_autostop_ignore_live && movie_player.getVideoData().isLive) return;
if (!disableStop && state > 0 && state < 5) {
movie_player.stopVideo();
}
}
document.addEventListener('keyup', evt => {
if (NOVA.currentPage != 'watch' && NOVA.currentPage != 'embed') return;
if (['input', 'textarea', 'select'].includes(evt.target.localName) || evt.target.isContentEditable) return;
if (evt.ctrlKey || evt.altKey || evt.shiftKey || evt.metaKey) return;
switch (evt.code) {
case 'KeyK':
case 'Space':
case 'MediaPlay':
case 'MediaPlayPause':
disableHoldStop();
break;
}
});
navigator.mediaSession.setActionHandler('play', disableHoldStop);
document.addEventListener('click', evt => {
if (evt.isTrusted
&& evt.target.closest('#movie_player')
&& !disableStop
) {
evt.preventDefault();
evt.stopImmediatePropagation();
disableHoldStop();
}
}, { capture: true });
function disableHoldStop() {
if (!disableStop) {
disableStop = true;
movie_player.playVideo();
}
}
});
},
options: {
video_autostop_embed: {
_tagName: 'select',
label: 'Apply to video type',
options: [
{
label: 'all', value: false, selected: true,
},
{
label: 'embed', value: 'on',
},
],
},
video_autostop_ignore_playlist: {
_tagName: 'input',
label: 'Ignore playlist',
'label:zh': '忽略播放列表',
'label:ja': 'プレイリストを無視する',
'label:pl': 'Zignoruj listę odtwarzania',
type: 'checkbox',
'data-dependent': { 'video_autostop_embed': false },
},
video_autostop_ignore_live: {
_tagName: 'input',
label: 'Ignore live',
type: 'checkbox',
'data-dependent': { 'video_autostop_embed': false },
},
video_autostop_peview_thumbnail: {
_tagName: 'input',
label: 'Display preview thumbnail',
type: 'checkbox',
title: 'Instead black-screen',
'data-dependent': { 'video_autostop_embed': false },
},
}
});
window.nova_plugins.push({
id: 'subtitle-style',
title: 'Subtitles (captions) style',
'title:zh': '字幕样式',
'title:ja': '字幕スタイル',
'title:pl': 'Styl napisów',
run_on_pages: 'watch, embed, -mobile',
section: 'player',
_runtime: async user_settings => {
const SELECTOR = '.ytp-caption-segment';
let cssObj = {};
if (user_settings.subtitle_transparent) {
cssObj = {
'background': 'Transparent',
'text-shadow':
`rgb(0, 0, 0) 0 0 .1em,
rgb(0, 0, 0) 0 0 .2em,
rgb(0, 0, 0) 0 0 .4em`,
};
}
if (user_settings.subtitle_bold) cssObj['font-weight'] = 'bold';
if (Object.keys(cssObj).length) {
NOVA.css.push(cssObj, SELECTOR, 'important');
}
if (user_settings.subtitle_fixed) {
NOVA.css.push(
`${CSS.supports('selector(:has(*))') ? '#ytp-caption-window-container:has(~ .ytp-chrome-bottom:not(:hover))' : ''} .caption-window:not(:hover) {
margin-bottom: 1px !important;
bottom: 1% !important;
}`);
}
if (user_settings.subtitle_selectable) {
NOVA.watchElements({
selectors: [SELECTOR],
callback: el => {
el.addEventListener('mousedown', evt => evt.stopPropagation(), { capture: true });
el.setAttribute('draggable', 'false');
el.setAttribute('selectable', 'true');
el.style.userSelect = 'text';
el.style.WebkitUserSelect = 'text';
el.style.cursor = 'text';
}
});
}
if (user_settings.subtitle_color != '#ffffff') {
NOVA.css.push(
`${SELECTOR} { color: ${user_settings.subtitle_color} !important;  }`);
}
if (+user_settings.subtitle_font_size) {
NOVA.css.push(
`${SELECTOR} { font-size: calc(32px * ${+user_settings.subtitle_font_size || 1}) !important; }`);
}
if (user_settings.subtitle) {
await NOVA.waitUntil(() => typeof movie_player === 'object' && typeof movie_player.toggleSubtitlesOn === 'function', 500);
movie_player.toggleSubtitlesOn();
}
},
options: {
subtitle: {
_tagName: 'input',
label: 'Subtitles show by default',
type: 'checkbox',
},
subtitle_fixed: {
_tagName: 'input',
label: 'Fixed from below',
'label:zh': '从下方固定',
'label:ja': '下から固定',
'label:pl': 'Przyklejone na dole',
type: 'checkbox',
title: 'Preventing captions jumping up/down when pause/resume',
'title:zh': '暂停/恢复时防止字幕跳上/跳下',
'title:ja': '一時停止/再開時にキャプションが上下にジャンプしないようにする',
'title:pl': 'Zapobieganie przeskakiwaniu napisów w górę/w dół podczas pauzy/wznowienia',
},
subtitle_selectable: {
_tagName: 'input',
label: 'Make selectable',
'label:zh': '使字幕可选',
'label:ja': '字幕を選択可能にする',
'label:pl': 'Ustaw napisy do wyboru',
type: 'checkbox',
},
subtitle_font_size: {
_tagName: 'input',
label: 'Font size',
'label:zh': '字体大小',
'label:ja': 'フォントサイズ',
'label:pl': 'Rozmiar czcionki',
type: 'number',
title: '0 - default',
placeholder: '0-5',
step: 1,
min: 0,
max: 5,
value: 0,
},
subtitle_transparent: {
_tagName: 'input',
label: 'Transparent',
'label:zh': '透明的',
'label:ja': '透明',
'label:pl': 'Przezroczyste',
type: 'checkbox',
},
subtitle_bold: {
_tagName: 'input',
label: 'Bold text',
'label:zh': '粗体',
'label:ja': '太字',
'label:pl': 'Tekst pogrubiony',
type: 'checkbox',
},
subtitle_color: {
_tagName: 'input',
type: 'color',
value: '#ffffff',
label: 'Color',
'label:zh': '颜色',
'label:ja': '色',
'label:pl': 'Kolor',
title: 'default - #FFF',
},
}
});
window.nova_plugins.push({
id: 'video-unblock-region',
title: 'Redirect video not available in your country',
'title:zh': '尝试解锁您所在地区的视频',
'title:ja': 'お住まいの地域の動画のブロックを解除してみてください',
'title:pl': 'Spróbuj odblokować, jeśli film nie jest dostępny w Twoim kraju',
run_on_pages: 'watch, embed, -mobile',
section: 'player',
opt_api_key_warn: true,
desc: 'Some mirrors will partially replace VPNs',
_runtime: user_settings => {
const SELECTOR_EMBED = '#movie_player.ytp-embed-error .ytp-error[role="alert"] .ytp-error-content-wrap-subreason:not(:empty)';
const SELECTOR = `ytd-watch-flexy[player-unavailable] #player-error-message-container #info, ${SELECTOR_EMBED}`;
NOVA.waitSelector(SELECTOR, { destroy_after_page_leaving: true })
.then(async container => {
if (container.querySelector('button')) return;
const videoId = NOVA.queryURL.get('v') || movie_player.getVideoData().video_id;
insertLinks(container, videoId);
function insertLinks(container = required(), video_id = required()) {
if (!(container instanceof HTMLElement)) return console.error('container not HTMLElement:', container);
NOVA.css.push(
`${SELECTOR} ul {
border-radius: 12px;
background-color: var(--yt-spec-badge-chip-background);
font-size: 1.4rem;
line-height: 2rem;
padding: 10px;
}
${SELECTOR} li {
color: var(--yt-spec-text-primary);
}
${SELECTOR} a:not(:hover) {
color: var(--yt-spec-text-primary);
text-decoration: none;
}`);
const ul = document.createElement('ul');
[
{ label: 'hooktube.com', value: 'hooktube.com' },
{ label: 'clipzag.com', value: 'clipzag.com' },
{ label: 'piped.video', value: 'piped.video' },
{ label: 'yewtu.be', value: 'yewtu.be' },
{ label: 'nsfwyoutube.com', value: 'nsfwyoutube.com' },
{ label: 'yout-ube.com', value: 'yout-ube.com' },
{ label: 'riservato-xyz.frama.io', value: 'riservato-xyz.frama.io' },
]
.forEach(domain => {
const li = document.createElement('li');
const a = document.createElement('a');
a.href = `${location.protocol}//${domain.value}${location.port ? ':' + location.port : ''}/watch?v=${video_id}`;
a.target = '_blank';
a.textContent = '→ Open with ' + domain.label;
a.title = 'Open with ' + domain.label;
li.append(a);
ul.append(li);
});
const liAtention = document.createElement('li');
liAtention.className = 'bold style-scope yt-formatted-string';
liAtention.textContent = 'Enable map select allowed country in your VPN';
ul.append(liAtention);
container.append(ul);
}
});
NOVA.waitSelector(`ytd-watch-flexy[player-unavailable], ${SELECTOR_EMBED}`, { destroy_after_page_leaving: true })
.then(el => {
if (user_settings.video_unblock_region_domain
&& el.querySelector('yt-player-error-message-renderer #button.yt-player-error-message-renderer button')
&& confirm('Nova [video-unblock-region]\nThe video is not available in your region, open a in mirror?')
) {
redirect();
}
if (user_settings.video_unblock_region_open_map) {
NOVA.request.API({
request: 'videos',
params: {
'id': NOVA.queryURL.get('v') || movie_player.getVideoData().video_id,
'part': 'contentDetails',
},
api_key: user_settings['user-api-key'],
})
.then(res => {
if (res?.error) return alert(`Error [${res.code}]: ${res?.message}`);
res?.items?.forEach(item => {
if (data = item.contentDetails?.regionRestriction) {
const mapLink = NOVA.queryURL.set(data, 'https://raingart.github.io/region_map/');
NOVA.openPopup({ url: mapLink, width: '1200px', height: '600px' });
}
});
});
}
});
function redirect(new_tab) {
const videoId = NOVA.queryURL.get('v') || movie_player.getVideoData().video_id;
if (new_tab) {
window.open(`${location.protocol}//${user_settings.video_unblock_region_domain || 'hooktube.com'}${location.port ? ':' + location.port : ''}/watch?v=${videoId}`);
}
else {
location.hostname = user_settings.video_unblock_region_domain || 'hooktube.com';
}
}
},
options: {
video_unblock_region_domain: {
_tagName: 'input',
label: 'Redirect to URL',
type: 'text',
list: 'video_unblock_region_domain_help_list',
pattern: "^[a-zA-Z0-9-]{2,20}\.[a-zA-Z]{2,5}$",
title: 'without "https://"',
'title:zh': '没有“https://”',
'title:ja': '「https://」なし',
'title:pl': 'bez „https://”',
placeholder: 'domain.com',
minlength: 5,
maxlength: 20,
},
video_unblock_region_domain_help_list: {
_tagName: 'datalist',
options: [
{ label: 'hooktube.com', value: 'hooktube.com' },
{ label: 'clipzag.com', value: 'clipzag.com' },
{ label: 'piped.video', value: 'piped.video' },
{ label: 'yewtu.be', value: 'yewtu.be' },
{ label: 'nsfwyoutube.com', value: 'nsfwyoutube.com' },
{ label: 'yout-ube.com', value: 'yout-ube.com' },
{ label: 'riservato-xyz.frama.io', value: 'riservato-xyz.frama.io' },
],
},
video_unblock_region_open_map: {
_tagName: 'input',
label: 'Open the map',
'label:zh': '打开可用区域的地图',
'label:ja': '利用可能な地域の地図を開く',
'label:pl': 'Otwórz mapę z dostępnością w regionach',
type: 'checkbox',
title: 'which regions is available',
},
}
});
window.nova_plugins.push({
id: 'video-autopause',
title: 'Video autopause',
'title:zh': '视频自动暂停',
'title:ja': 'ビデオの自動一時停止',
'title:ko': '비디오 자동 일시 중지',
'title:id': 'Jeda otomatis video',
'title:es': 'Pausa automática de video',
'title:it': 'Pausa automatica del video',
'title:pl': 'Automatyczne zatrzymanie wideo',
run_on_pages: 'watch, embed',
section: 'player',
desc: 'Disable autoplay',
'desc:zh': '禁用自动播放',
'desc:ja': '自動再生を無効にする',
'desc:ko': '자동 재생 비활성화',
'desc:it': 'Nonaktifkan putar otomatis',
'desc:es': 'Deshabilitar reproducción automática',
'desc:it': 'Disabilita la riproduzione automatica',
'desc:pl': 'Wyłącz autoodtwarzanie',
'data-conflict': 'video-autostop',
_runtime: user_settings => {
if (user_settings['video-stop-preload'] && !user_settings.stop_preload_embed) return;
if (NOVA.queryURL.has('popup')) return;
if (user_settings.video_autopause_embed && NOVA.currentPage != 'embed') return;
if (NOVA.currentPage == 'embed'
&& window.self !== window.top
&& ['0', 'false'].includes(NOVA.queryURL.get('autoplay'))
) {
return;
}
NOVA.waitSelector('#movie_player video')
.then(video => {
if (user_settings.video_autopause_ignore_live && movie_player.getVideoData().isLive) return;
pauseVideo.apply(video);
NOVA.runOnPageLoad(async () => {
if (!location.search.includes('list=') && NOVA.currentPage == 'watch') {
video.addEventListener('playing', pauseVideo, { capture: true, once: true });
}
});
const backupFn = HTMLVideoElement.prototype.play;
HTMLVideoElement.prototype.play = pauseVideo;
document.addEventListener('keyup', evt => {
if (NOVA.currentPage != 'watch' && NOVA.currentPage != 'embed') return;
if (['input', 'textarea', 'select'].includes(evt.target.localName) || evt.target.isContentEditable) return;
if (evt.ctrlKey || evt.altKey || evt.shiftKey || evt.metaKey) return;
switch (evt.code) {
case 'KeyK':
case 'Space':
case 'MediaPlay':
case 'MediaPlayPause':
restorePlayFn();
break;
}
});
navigator.mediaSession.setActionHandler('play', restorePlayFn);
document.addEventListener('click', evt => {
if (evt.isTrusted
&& evt.target.closest('#movie_player')
) {
restorePlayFn();
}
}, { capture: true });
function pauseVideo() {
movie_player.pauseVideo();
this.paused || this.pause();
};
function restorePlayFn() {
restorePlayFn = function () { }
HTMLVideoElement.prototype.play = backupFn;
movie_player.playVideo();
}
});
},
options: {
video_autopause_ignore_playlist: {
_tagName: 'input',
label: 'Ignore playlist',
'label:zh': '忽略播放列表',
'label:ja': 'プレイリストを無視する',
'label:ko': '재생목록 무시',
'label:id': 'Abaikan daftar putar',
'label:es': 'Ignorar lista de reproducción',
'label:it': 'Ignora playlist',
'label:pl': 'Zignoruj listę odtwarzania',
type: 'checkbox',
'data-dependent': { 'video_autopause_embed': false },
},
video_autopause_ignore_live: {
_tagName: 'input',
label: 'Ignore live',
type: 'checkbox',
'data-dependent': { 'video_autopause_embed': false },
},
video_autopause_embed: {
_tagName: 'select',
label: 'Apply to video type',
options: [
{
label: 'all', value: false, selected: true,
},
{
label: 'embed', value: 'on',
},
],
},
}
});
window.nova_plugins.push({
id: 'video-unblock-warn-content',
title: 'Skip inappropriate/offensive content warn',
run_on_pages: 'watch, embed, -mobile',
section: 'player',
desc: "skip 'The following content may contain suicide or self-harm topics.'",
_runtime: user_settings => {
NOVA.waitSelector('ytd-watch-flexy[player-unavailable] #player-error-message-container #info button', { destroy_after_page_leaving: true })
.then(btn => btn.click());
},
});
window.nova_plugins.push({
id: 'player-disable-fullscreen-scroll',
title: 'Disable scrolling for fullscreen player',
'title:zh': '禁用全屏滚动',
'title:ja': 'フルスクリーンスクロールを無効にする',
'title:pl': 'Wyłącz przewijanie w trybie pełnoekranowym',
run_on_pages: 'watch, -mobile',
section: 'player',
_runtime: user_settings => {
NOVA.css.push(`.ytp-chrome-controls button.ytp-fullerscreen-edu-button { display: none !important; }`);
document.addEventListener('fullscreenchange', () => {
document.fullscreenElement
? document.addEventListener('wheel', lockscroll, { passive: false })
: document.removeEventListener('wheel', lockscroll);
});
function lockscroll(evt) {
evt.preventDefault();
}
},
});
window.nova_plugins.push({
id: 'sponsor-block',
title: 'SponsorBlock',
run_on_pages: 'watch, embed',
section: 'player',
_runtime: user_settings => {
NOVA.waitSelector('#movie_player video')
.then(video => {
const categoryNameLabel = {
sponsor: 'Sponsor',
selfpromo: 'Self Promotion',
interaction: 'Reminder Subscribe',
intro: 'Intro',
outro: 'Credits (Outro)',
preview: 'Preview/Recap',
music_offtopic: 'Non-Music Section',
exclusive_access: 'Full Video Label Only',
};
let segmentsList = [];
let muteState;
let videoId;
video.addEventListener('loadeddata', init.bind(video));
async function init() {
videoId = NOVA.queryURL.get('v') || movie_player.getVideoData().video_id;
segmentsList = await getSkipSegments(videoId) || [];
if (user_settings['player-float-progress-bar'] && segmentsList.length) {
const SELECTOR = '#nova-player-float-progress-bar-chapters > span[time]';
const deflectionSec = 5;
await NOVA.waitSelector(SELECTOR, { destroy_after_page_leaving: true });
document.body.querySelectorAll(SELECTOR)
.forEach((chapterEl, idx, chaptersEls) => {
if (idx === chaptersEls.length - 1) return;
const
chapterStart = Math.trunc(NOVA.formatTimeOut.hmsToSec(chapterEl.getAttribute('time'))),
chapterNextStart = Math.trunc(NOVA.formatTimeOut.hmsToSec(chaptersEls[idx + 1].getAttribute('time')));
for (const [i, value] of segmentsList.entries()) {
const [segmentStart, segmentEnd, category] = value;
if (((Math.trunc(segmentStart) + deflectionSec) <= chapterNextStart)
&& ((Math.trunc(segmentEnd) - deflectionSec) >= chapterStart)
) {
let color;
switch (category) {
case 'sponsor': color = '255, 231, 0'; break;
case 'interaction': color = '255, 127, 80'; break;
case 'selfpromo': color = '255, 99, 71'; break;
case 'intro': color = '255, 165, 0'; break;
case 'outro': color = '255, 165, 0'; break;
default: color = '0, 255, 107'; break;
}
const
newChapter = document.createElement('span'),
startPoint = Math.max(segmentStart, chapterStart),
sizeChapter = chapterNextStart - chapterStart,
getPt = d => (d * 100 / sizeChapter) + '%';
newChapter.title = category;
Object.assign(newChapter.style, {
width: getPt(Math.min(segmentEnd, chapterNextStart) - startPoint),
left: getPt(startPoint - chapterStart),
'background-color': `rgb(${color}, .4`,
});
chapterEl.append(newChapter);
}
}
});
}
}
video.addEventListener('timeupdate', function () {
let segmentStart, segmentEnd, category;
for (let i = 0; i < segmentsList.length; i++) {
[segmentStart, segmentEnd, category] = segmentsList[i];
segmentStart = Math.trunc(segmentStart);
segmentEnd = Math.ceil(segmentEnd);
const inSegment = (this.currentTime > segmentStart && this.currentTime < segmentEnd);
switch (user_settings.sponsor_block_action) {
case 'mute':
if (inSegment && !muteState && !this.muted) {
muteState = true;
movie_player.mute(true);
return novaNotification('muted');
}
else if (!inSegment && muteState && this.muted) {
muteState = false;
movie_player.unMute();
segmentsList.splice(i, 1);
return novaNotification('unMuted');
}
break;
case 'skip':
if (inSegment) {
this.currentTime = segmentEnd;
segmentsList.splice(i, 1);
return novaNotification();
}
break;
}
}
function novaNotification(prefix = '') {
if (!user_settings.sponsor_block_notification) return;
const msg = `${prefix} ${NOVA.formatTimeOut.HMS.digit(segmentEnd - segmentStart)} [${categoryNameLabel[category]}] • ${NOVA.formatTimeOut.HMS.digit(segmentStart)} - ${NOVA.formatTimeOut.HMS.digit(segmentEnd)}`;
console.info(videoId, msg);
NOVA.showOSD(msg);
}
});
});
async function getSkipSegments(videoId = required()) {
const CACHE_PREFIX = 'nova-videos-sponsor-block:';
if (
navigator.cookieEnabled
&& (storage = sessionStorage.getItem(CACHE_PREFIX + videoId))
) {
return JSON.parse(storage);
}
else {
const
actionTypes = (Array.isArray(user_settings.sponsor_block_action)
? user_settings.sponsor_block_action : [user_settings.sponsor_block_action])
|| ['skip', 'mute'],
categories = user_settings.sponsor_block_category || [
'sponsor',
'interaction',
'selfpromo',
'intro',
'outro',
],
params = {
'videoID': videoId,
'actionTypes': JSON.stringify(actionTypes),
'categories': JSON.stringify(categories),
},
query = Object.keys(params)
.map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
.join('&');
const fetchAPI = () => fetch((user_settings.sponsor_block_url || 'https://sponsor.ajay.app')
+ `/api/skipSegments?${query}`,
{
method: 'GET',
headers: { 'Content-Type': 'application/json' },
}
)
.then(response => response.json())
.then(json => json
.map(a => [...a.segment, a.category])
)
.catch(error => {
});
if (result = await fetchAPI()) {
if (navigator.cookieEnabled) {
sessionStorage.setItem(CACHE_PREFIX + videoId, JSON.stringify(result));
}
return result;
}
}
}
},
options: {
sponsor_block_category: {
_tagName: 'select',
label: 'Category',
title: '[Ctrl+Click] to select several',
'title:zh': '[Ctrl+Click] 选择多个',
'title:ja': '「Ctrl+Click」して、いくつかを選択します',
'title:pl': 'Ctrl+kliknięcie, aby zaznaczyć kilka',
multiple: null,
required: true,
size: 7,
options: [
{
label: 'Ads/Sponsor', value: 'sponsor',
},
{
label: 'Unpaid/Self Promotion', value: 'selfpromo',
},
{
label: 'Reminder Subscribe', value: 'interaction',
},
{
label: 'Intro', value: 'intro',
},
{
label: 'Endcards/Credits (Outro)', value: 'outro',
},
{
label: 'Preview/Recap', value: 'preview',
},
{
label: 'Music: Non-Music Section', value: 'music_offtopic',
},
{
label: 'Full Video Label Only', value: 'exclusive_access',
},
],
},
sponsor_block_action: {
_tagName: 'select',
label: 'Mode',
'label:zh': '模式',
'label:ja': 'モード',
'label:pl': 'Tryb',
options: [
{
label: 'skip', value: 'skip', selected: true,
},
{
label: 'mute', value: 'mute',
},
],
},
sponsor_block_url: {
_tagName: 'input',
label: 'URL',
type: 'url',
pattern: "https://.*",
placeholder: 'https://domain.com',
value: 'https://sponsor.ajay.app',
required: true,
},
sponsor_block_notification: {
_tagName: 'input',
label: 'Show OSD notification',
type: 'checkbox',
},
}
});
window.nova_plugins.push({
id: 'embed-popup',
title: 'Open small embedded in popup',
'title:zh': '将嵌入式视频重定向到弹出窗口',
'title:ja': '埋め込まれたビデオをポップアップにリダイレクトします',
'title:pl': 'Przekieruj osadzone wideo do wyskakującego okienka',
run_on_pages: 'embed, -mobile',
section: 'player',
desc: 'if iframe width is less than 720p',
'plugins-conflict': 'player-fullscreen-mode',
_runtime: user_settings => {
if (window.top === window.self
|| location.hostname.includes('googleapis.com')
|| NOVA.queryURL.has('popup')
) {
return;
}
if (user_settings.player_full_viewport_mode == 'redirect_watch_to_embed') return;
if (user_settings['player-fullscreen-mode']) return;
if (window.innerWidth > 720 && window.innerHeight > 480) return;
NOVA.waitSelector('#movie_player video')
.then(video => {
video.addEventListener('playing', createPopup.bind(video), { capture: true, once: true });
});
function createPopup() {
if (this.videoHeight < window.innerWidth && this.videoHeight < window.innerHeight) return;
const { width, height } = NOVA.aspectRatio.sizeToFit({
'srcWidth': this.videoWidth,
'srcHeight': this.videoHeight,
});
movie_player.stopVideo();
const url = new URL(
document.head.querySelector('link[itemprop="embedUrl"][href]')?.href
|| (location.origin + '/embed/' + movie_player.getVideoData().video_id)
);
url.searchParams.set('autoplay', 1);
url.searchParams.set('popup', true);
NOVA.openPopup({ 'url': url.href, 'width': width, 'height': height });
}
},
});
window.nova_plugins.push({
id: 'theater-mode',
title: 'Auto wide player (Theater mode)',
'title:pl': 'Tryb kinowy',
run_on_pages: 'watch, -mobile',
section: 'player',
_runtime: user_settings => {
if (user_settings.player_full_viewport_mode == 'redirect_watch_to_embed') {
return location.assign(`https://www.youtube.com/embed/` + NOVA.queryURL.get('v'));
}
if (user_settings.theater_mode_ignore_playlist && location.search.includes('list=')) return;
NOVA.waitSelector('ytd-watch-flexy:not([player-unavailable])')
.then(el => {
if (isTheaterMode()) return;
NOVA.waitUntil(() => isTheaterMode() ? true : toggleTheater(), 500);
function isTheaterMode() {
return (el.hasAttribute('theater')
|| (typeof el.isTheater_ === 'function' && el.isTheater_())
);
}
function toggleTheater() {
(typeof movie_player === 'object' ? movie_player : document)
.dispatchEvent(
new KeyboardEvent(
'keydown',
{
keyCode: 84,
key: 't',
code: 'KeyT',
which: 84,
bubbles: true,
cancelable: false,
}
)
);
}
if (!user_settings['video-unblock-warn-content']) {
NOVA.waitSelector('ytd-watch-flexy[player-unavailable] yt-player-error-message-renderer #button.yt-player-error-message-renderer button', { destroy_after_page_leaving: true })
.then(btn => btn.click());
}
});
if (user_settings.player_full_viewport_mode == '') return;
if (user_settings['player-fullscreen-mode']
&& !user_settings.player_fullscreen_mode_embed
&& user_settings.player_full_viewport_mode != 'cinema_mode'
) {
return;
}
NOVA.waitSelector('#movie_player')
.then(movie_player => {
const
PLAYER_CONTAINER_SELECTOR = 'ytd-watch-flexy[theater]:not([fullscreen]) #ytd-player',
PINNED_SELECTOR = '.nova-player-pin',
PLAYER_SCROLL_LOCK_CLASS_NAME = 'nova-lock-scroll',
PLAYER_SELECTOR = `${PLAYER_CONTAINER_SELECTOR} #movie_player:not(${PINNED_SELECTOR}):not(.${PLAYER_SCROLL_LOCK_CLASS_NAME})`,
zIndex = Math.max(getComputedStyle(movie_player)['z-index'], 2020);
addScrollDownBehavior();
switch (user_settings.player_full_viewport_mode) {
case 'offset':
NOVA.css.push(
PLAYER_CONTAINER_SELECTOR + ` {
min-height: calc(100vh - ${user_settings['header-compact']
? '36px'
: NOVA.css.get('#masthead-container', 'height') || '56px'
}) !important;
}
ytd-watch-flexy[theater]:not([fullscreen]) #columns {
position: absolute;
top: 100vh;
}
${PLAYER_SELECTOR} {
background-color: black;
}`);
break;
case 'force':
setPlayerFullViewport(user_settings.player_full_viewport_mode_exit);
break;
case 'smart':
if (user_settings.player_full_viewport_mode_exclude_shorts && NOVA.currentPage == 'shorts') {
return;
}
NOVA.waitSelector('video')
.then(video => {
video.addEventListener('loadeddata', function () {
if (user_settings.player_full_viewport_mode_exclude_shorts && this.videoWidth < this.videoHeight) {
return;
}
const miniSize = NOVA.aspectRatio.sizeToFit({
'srcWidth': this.videoWidth,
'srcHeight': this.videoHeight,
'maxWidth': window.innerWidth,
'maxHeight': window.innerHeight,
});
if (miniSize.width < window.innerWidth) {
setPlayerFullViewport('player_full_viewport_mode_exit');
}
});
});
break;
case 'cinema_mode':
NOVA.css.push(
PLAYER_SELECTOR + ` {
z-index: ${zIndex};
}
${PLAYER_SELECTOR}:before {
content: '';
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100%;
background-color: rgba(0, 0, 0, ${+user_settings.cinema_mode_opacity});
opacity: 0;
transition: opacity 400ms ease-in-out;
pointer-events: none;
}
${PLAYER_SELECTOR}.playing-mode:before {
opacity: 1;
}
.ytp-ad-player-overlay,
#playlist:hover,
#masthead-container:hover,
iframe, 
#guide,
[class*="popup"],
[role="navigation"],
[role="dialog"] {
z-index: ${zIndex + 1};
}
#playlist:hover {
position: relative;
}`);
addHideScrollbarCSS();
break;
}
function setPlayerFullViewport(exclude_pause) {
const CLASS_OVER_PAUSED = 'nova-player-fullviewport';
NOVA.css.push(
`${PLAYER_SELECTOR}.playing-mode,
${exclude_pause ? '' : `${PLAYER_SELECTOR}.paused-mode,`}
${PLAYER_SELECTOR}.${CLASS_OVER_PAUSED} {
width: 100vw;
height: 100vh;
position: fixed;
bottom: 0 !important;
z-index: ${zIndex};
background-color: black;
}`);
if (CSS.supports('selector(:has(*))')) {
NOVA.css.push(
`#masthead-container:has( ~ #page-manager ytd-watch-flexy[theater]) {
position: fixed;
z-index: ${zIndex + 1};
opacity: 0;
}
#masthead-container:has( ~ #page-manager ytd-watch-flexy[theater]):hover,
#masthead-container:has( ~ #page-manager ytd-watch-flexy[theater]):focus {
opacity: 1;
}`);
}
addHideScrollbarCSS();
if (user_settings.player_full_viewport_mode_exit) {
NOVA.waitSelector('video')
.then(video => {
video.addEventListener('pause', () => {
if (!document.body.querySelector('.ytp-progress-bar')?.contains(document.activeElement)) {
window.dispatchEvent(new Event('resize'));
}
});
video.addEventListener('play', () => window.dispatchEvent(new Event('resize')));
});
NOVA.waitSelector('.ytp-progress-bar')
.then(progress_bar => {
['mousedown', 'mouseup'].forEach(evt => {
progress_bar.addEventListener(evt, () => {
movie_player.classList.add(CLASS_OVER_PAUSED);
});
});
});
}
}
function addScrollDownBehavior() {
if (activateScrollElement = document.body.querySelector('.ytp-chrome-controls')) {
activateScrollElement.addEventListener('wheel', evt => {
switch (Math.sign(evt.wheelDelta)) {
case -1:
movie_player.classList.add(PLAYER_SCROLL_LOCK_CLASS_NAME);
break;
}
});
document.addEventListener('scroll', evt => {
if (window.scrollY === 0 && movie_player.classList.contains(PLAYER_SCROLL_LOCK_CLASS_NAME)) {
movie_player.classList.remove(PLAYER_SCROLL_LOCK_CLASS_NAME);
}
});
}
}
function addHideScrollbarCSS() {
if (user_settings['scrollbar-hide']) return;
NOVA.css.push(`html body:has(${PLAYER_SELECTOR})::-webkit-scrollbar{ display: none; }`);
}
});
},
options: {
player_full_viewport_mode: {
_tagName: 'select',
label: 'Mode',
'label:zh': '模式',
'label:ja': 'モード',
'label:pl': 'Tryb',
options: [
{
label: 'default', selected: true,
},
{
label: 'cinema', value: 'cinema_mode',
},
{
label: 'full-viewport', value: 'force',
},
{
label: 'full-viewport (auto)', value: 'smart',
},
{
label: 'full-viewport (offset)', value: 'offset',
},
{
label: 'redirect to embedded', value: 'redirect_watch_to_embed',
},
],
},
player_full_viewport_mode_exit: {
_tagName: 'input',
label: 'Exit Fullscreen on video end/pause',
'label:zh': '视频结束/暂停时退出',
'label:ja': 'ビデオが終了/一時停止したら終了します',
'label:pl': 'Wyjdź, gdy film się kończy/pauzuje',
type: 'checkbox',
'data-dependent': { 'player_full_viewport_mode': ['force', 'smart'] },
},
player_full_viewport_mode_exclude_shorts: {
_tagName: 'input',
label: 'Full-viewport exclude shorts',
'label:zh': '全视口不包括短裤',
'label:ja': 'フルビューポートはショートパンツを除外します',
'label:pl': 'Pełny ekran wyklucza krótkie filmy',
type: 'checkbox',
'data-dependent': { 'player_full_viewport_mode': 'smart' },
},
cinema_mode_opacity: {
_tagName: 'input',
label: 'Opacity',
'label:zh': '不透明度',
'label:ja': '不透明度',
'label:pl': 'Przezroczystość',
type: 'number',
title: '0-1',
placeholder: '0-1',
step: .05,
min: 0,
max: 1,
value: .75,
'data-dependent': { 'player_full_viewport_mode': 'cinema_mode' },
},
theater_mode_ignore_playlist: {
_tagName: 'input',
label: 'Ignore playlist',
'label:zh': '忽略播放列表',
'label:ja': 'プレイリストを無視する',
'label:pl': 'Zignoruj listę odtwarzania',
type: 'checkbox',
},
}
});
window.nova_plugins.push({
id: 'player-indicator',
title: 'Custom On-Screen Display (OSD)',
'title:zh': '替换默认指示器',
'title:ja': 'デフォルトのインジケーターを置き換える',
run_on_pages: 'watch, embed, -mobile',
section: 'player',
_runtime: user_settings => {
const
SELECTOR_ID = 'nova-player-indicator-info',
COLOR_OSD = user_settings.player_indicator_color || '#ff0000';
NOVA.waitSelector('#movie_player video')
.then(video => {
video.addEventListener('volumechange', function () {
OSD.show({
'pt': Math.round(movie_player.getVolume()),
'suffix': '%',
'clear_previous_text': true,
});
});
video.addEventListener('ratechange', () => OSD.show({
'pt': video.playbackRate,
'suffix': 'x',
'clear_previous_text': true,
}));
if (user_settings.player_indicator_chapter) {
NOVA.waitSelector('ytd-watch-metadata #description.ytd-watch-metadata')
.then(() => {
const getNextChapterIdx = () => chapterList?.findIndex(c => c.sec > video.currentTime);
let chapterList, lastChapTime = 0;
video.addEventListener('loadeddata', () => chapterList = []);
video.addEventListener('timeupdate', function () {
if (chapterList !== null && !chapterList?.length) {
chapterList = NOVA.getChapterList(movie_player.getDuration()) || null;
}
if (chapterList?.length
&& this.currentTime > lastChapTime
) {
let nextChapterIdx = getNextChapterIdx();
if (nextChapterIdx === -1) nextChapterIdx = chapterList.length;
lastChapTime = chapterList[nextChapterIdx]?.sec;
if (chapterData = chapterList[nextChapterIdx - 1]) {
const separator = ' • ';
const msg = chapterData.title + separator + chapterData.time;
NOVA.showOSD(msg);
}
}
});
video.addEventListener('seeking', () => {
if (chapterList?.length && (nexChapterData = chapterList[getNextChapterIdx()])) {
lastChapTime = nexChapterData.sec;
}
});
});
}
});
NOVA.waitSelector('.ytp-bezel-text')
.then(target => {
new MutationObserver(mutationRecordsArray => {
if (target.textContent) {
let unlimitVol;
if ((target.textContent?.endsWith('%')
&& !(unlimitVol = (user_settings.volume_unlimit && parseInt(target.textContent) > 100))
)
|| ((user_settings['video-rate'] || user_settings.player_buttons_custom_items?.includes('range-speed')) && (target.textContent?.length < 6) && target.textContent?.endsWith('x'))
|| (user_settings['time-jump'] && target.textContent?.startsWith(`+${user_settings.time_jump_step}`))
) {
return;
}
OSD.show({
'pt': target.textContent,
'timeout_ms': (user_settings.player_indicator_chapter_time || 1.8) * 1000,
'clear_previous_text': unlimitVol,
});
}
})
.observe(target, { attributes: true, childList: true });
});
const OSD = {
create() {
NOVA.css.push(
`.ytp-bezel-text-wrapper,
.ytp-doubletap-ui-legacy.ytp-time-seeking,
.ytp-chapter-seek {
display:none !important;
}`);
NOVA.css.push(
`#${SELECTOR_ID} {
--color: white;
--bg-color: rgba(0, 0, 0, ${user_settings.player_indicator_opacity || .3});
--zindex: ${1 + Math.max(NOVA.css.get('.ytp-chrome-top', 'z-index'), 60)};
position: absolute;
right: 0;
z-index: calc(var(--zindex) + 1);
margin: 0 auto;
text-align: center;
opacity: 0;
background-color: var(--bg-color);
color: var(--color);
}
#${SELECTOR_ID} span {
text-overflow: ellipsis;
word-wrap: break-word;
overflow: hidden;
display: -webkit-box;
-webkit-line-clamp: 5; 
line-clamp: 5;
-webkit-box-orient: vertical;
}`);
const template = document.createElement('div');
template.id = SELECTOR_ID;
template.innerHTML = '<span></span>';
movie_player.append(template);
this.container = document.getElementById(SELECTOR_ID);
this.spanOSD = this.container.querySelector('span');
switch (user_settings.player_indicator_type) {
case 'bar-center':
Object.assign(this.container.style, {
left: 0,
bottom: '20%',
width: '30%',
'font-size': '1.2em',
});
Object.assign(this.spanOSD.style, {
'background-color': COLOR_OSD,
transition: 'width 100ms ease-out',
display: 'inline-block',
});
break;
case 'bar-vertical':
Object.assign(this.container.style, {
top: 0,
height: '100%',
width: '25px',
'font-size': '1.2em',
});
Object.assign(this.spanOSD.style, {
position: 'absolute',
bottom: 0,
right: 0,
'background-color': COLOR_OSD,
transition: 'height 100ms ease-out 0s',
display: 'inline-block',
width: '100%',
'font-weight': 'bold',
});
break;
default:
Object.assign(this.container.style, {
top: 0,
width: '100%',
padding: '.2em',
'font-size': '1.55em',
});
}
return this.container;
},
show({ pt = 100, suffix = '', timeout_ms = 800, clear_previous_text }) {
if (typeof this.fade === 'number') clearTimeout(this.fade);
const notify = this.container || this.create();
if (this.oldMsg) {
this.spanOSD.innerText += '\n' + pt + suffix;
}
else {
this.spanOSD.innerHTML = pt + suffix;
}
if (!clear_previous_text) {
this.oldMsg = this.spanOSD.innerText;
clearTimeout(this.timeoutMultiLine);
this.timeoutMultiLine = setTimeout(() => this.oldMsg = null, 600);
}
if (suffix == 'x') {
const maxPercent = (+user_settings.rate_step % .25) === 0 ? 2 : 3;
pt = +pt * 100 / maxPercent;
}
pt = Math.round(pt);
switch (user_settings.player_indicator_type) {
case 'bar-center':
this.spanOSD.style.width = pt + '%';
break;
case 'bar-vertical':
this.spanOSD.style.height = pt + '%';
break;
case 'bar-top':
notify.style.background = `linear-gradient(to right, ${COLOR_OSD}50 ${pt}%, rgba(0,0,0,.8) ${pt}%)`;
this.spanOSD.style.width = pt + '%';
break;
}
notify.style.transition = 'none';
notify.style.opacity = 1;
notify.style.visibility = 'visible';
this.fade = setTimeout(() => {
notify.style.transition = 'opacity 200ms ease-in';
notify.style.opacity = 0;
setTimeout(() => notify.style.visibility = 'hidden', 1000);
}, timeout_ms);
}
};
},
options: {
player_indicator_type: {
_tagName: 'select',
label: 'Mode',
'label:zh': '模式',
'label:ja': 'モード',
'label:pl': 'Tryb',
options: [
{
label: 'text-top', value: 'text-top', selected: true,
},
{
label: 'bar-top', value: 'bar-top',
},
{
label: 'bar-center', value: 'bar-center',
},
{
label: 'bar-vertical', value: 'bar-vertical',
},
],
},
player_indicator_opacity: {
_tagName: 'input',
label: 'Opacity',
'label:zh': '不透明度',
'label:ja': '不透明度',
'label:tr': 'opaklık',
'label:pl': 'Przezroczystość',
type: 'number',
title: 'less value - more transparency',
placeholder: '0-1',
step: .1,
min: .1,
max: .9,
value: .3,
},
player_indicator_color: {
_tagName: 'input',
type: 'color',
value: '#ff0000',
label: 'Color',
'label:zh': '颜色',
'label:ja': '色',
'label:pl': 'Kolor',
'data-dependent': { 'player_indicator_type': '!text-top' },
},
player_indicator_chapter: {
_tagName: 'input',
label: 'Show info at start chapter',
'label:zh': '在开始章节显示信息',
'label:ja': '章の開始時に情報を表示',
'label:pl': 'Pokaż informacje na początku rozdziału',
type: 'checkbox',
},
player_indicator_chapter_time: {
_tagName: 'input',
label: 'Chapter timeout',
type: 'number',
'label:zh': '章节超时',
'label:ja': 'チャプターのタイムアウト',
title: 'in sec',
placeholder: '0-10',
step: .1,
min: .1,
max: 10,
value: 1.8,
'data-dependent': { 'player_indicator_chapter': true },
},
}
});
window.nova_plugins.push({
id: 'disable-player-sleep-mode',
title: 'Disable the "Continue watching?" popup',
'title:zh': '玩家永远保持活跃',
'title:ja': 'プレーヤーは永遠にアクティブなままです',
'title:pl': 'Wyłącz tryb uśpienia odtwarzacza',
run_on_pages: 'watch, -mobile',
section: 'player',
_runtime: user_settings => {
setInterval(() => {
if (!document.hasFocus()) {
document.dispatchEvent(
new KeyboardEvent(
'keyup',
{
keyCode: 143,
which: 143,
bubbles: true,
cancelable: true,
}
)
);
}
}, 1000 * 60 * 5);
},
});
window.nova_plugins.push({
id: 'player-resize-ratio',
title: 'Player force resize 16:9',
run_on_pages: 'watch',
section: 'player',
desc: 'only for 4:3 video',
_runtime: user_settings => {
NOVA.waitSelector('ytd-watch-flexy:not([theater])')
.then(ytd_watch => {
NOVA.waitSelector('#movie_player video', { container: ytd_watch })
.then(video => {
console.assert(ytd_watch.calculateCurrentPlayerSize_, '"ytd_watch" does not have fn "calculateCurrentPlayerSize_"');
const
heightRatio = .5625,
squareAspectRatio = () => {
const aspectRatio = NOVA.aspectRatio.getAspectRatio({
'width': video.videoWidth,
'height': video.videoHeight,
});
return (
(video.videoWidth / video.videoHeight) > 2.3
|| '4:3' == aspectRatio || '1:1' == aspectRatio
);
};
if (ytd_watch.calculateCurrentPlayerSize_ && ytd_watch.updateStyles) {
const backupFn = ytd_watch.calculateCurrentPlayerSize_;
patchYtCalculateFn()
video.addEventListener('loadeddata', () => {
(NOVA.currentPage == 'watch') && patchYtCalculateFn();
});
function sizeBypass() {
let width = height = NaN;
if (!ytd_watch.theater) {
width = movie_player.offsetWidth;
height = Math.ceil(movie_player.offsetWidth / (16 / 9));
if (ytd_watch.updateStyles) {
ytd_watch.updateStyles({
'--ytd-watch-flexy-width-ratio': 1,
'--ytd-watch-flexy-height-ratio': heightRatio,
});
window.dispatchEvent(new Event('resize'));
}
}
return {
'width': width,
'height': height,
};
}
function patchYtCalculateFn() {
ytd_watch.calculateCurrentPlayerSize_ = squareAspectRatio() ? sizeBypass : backupFn;
ytd_watch.calculateCurrentPlayerSize_();
}
}
else {
new MutationObserver(mutationRecordsArray => {
if (!ytd_watch.theater && heightRatio != ytd_watch.style.getPropertyValue('--ytd-watch-flexy-height-ratio')) {
updateRatio();
}
})
.observe(ytd_watch, { attributes: true, attributeFilter: ['style'] });
}
window.addEventListener('resize', updateRatio);
function updateRatio() {
if (squareAspectRatio()) {
ytd_watch.style.setProperty('--ytd-watch-flexy-width-ratio', 1);
ytd_watch.style.setProperty('--ytd-watch-flexy-height-ratio', heightRatio);
}
}
});
});
},
});
window.nova_plugins.push({
id: 'auto-buffer',
title: 'Video preloading/buffering',
run_on_pages: 'watch, embed',
section: 'player',
desc: 'Working while video is paused',
_runtime: user_settings => {
const maxBufferSec = (+user_settings.auto_buffer_sec || 60);
const SELECTOR_CLASS_NAME = 'buffered';
NOVA.css.push(
`.${SELECTOR_CLASS_NAME} .ytp-swatch-background-color {
background-color: ${user_settings.auto_buffer_color || '#ffa000'} !important;
}`);
let stopPreload = true;
let saveCurrentTime = false;
NOVA.waitSelector('#movie_player video')
.then(video => {
let isLive;
video.addEventListener('loadeddata', () => {
saveCurrentTime = false;
isLive = movie_player.getVideoData().isLive;
});
video.addEventListener('playing', function () {
if (!this.paused && saveCurrentTime !== false) {
this.currentTime = saveCurrentTime;
saveCurrentTime = false;
movie_player.classList.remove(SELECTOR_CLASS_NAME);
}
});
document.addEventListener('keydown', evt => {
if (!video.paused || !saveCurrentTime) return;
if (NOVA.currentPage != 'watch' && NOVA.currentPage != 'embed') return;
if (['input', 'textarea', 'select'].includes(evt.target.localName) || evt.target.isContentEditable) return;
if (evt.code == 'ArrowLeft' || evt.code == 'ArrowRight') reSaveTime();
});
document.addEventListener('click', evt => {
if (evt.isTrusted
&& video.paused && saveCurrentTime
&& evt.target.closest('.ytp-progress-bar')
) {
reSaveTime();
}
});
function reSaveTime() {
movie_player.classList.add(SELECTOR_CLASS_NAME);
saveCurrentTime = video.currentTime;
}
video.addEventListener('pause', recordBuffer.bind(video));
video.addEventListener('progress', recordBuffer.bind(video));
function recordBuffer() {
if (!this.paused || !this.buffered?.length) return;
if (stopPreload) return;
const bufferedSeconds = this.buffered.end(this.buffered.length - 1);
if (saveCurrentTime === false) {
movie_player.classList.add(SELECTOR_CLASS_NAME);
saveCurrentTime = this.currentTime;
}
if (saveCurrentTime && ((bufferedSeconds - saveCurrentTime) > maxBufferSec)) {
this.currentTime = saveCurrentTime;
movie_player.classList.remove(SELECTOR_CLASS_NAME);
return;
}
if (!isLive || !isNaN(this.duration)) {
const bufferedPercent = bufferedSeconds / this.duration;
if (bufferedPercent > .9) {
movie_player.classList.remove(SELECTOR_CLASS_NAME); return;
}
}
this.currentTime = bufferedSeconds;
}
});
NOVA.waitSelector('#movie_player .ytp-left-controls .ytp-play-button')
.then(container => {
const
SELECTOR_CLASS = 'nova-right-custom-button',
btn = document.createElement('button');
btn.className = `ytp-button ${SELECTOR_CLASS}`;
Object.assign(btn.style, {
padding: '0 12px',
opacity: .5,
'min-width': getComputedStyle(container).width || '48px',
});
btn.title = 'Preload video';
btn.innerHTML =
`<svg viewBox="0 0 465 465" height="100%" width="100%">
<g fill="currentColor">
<path d="M279.591,423.714c-3.836,0.956-7.747,1.805-11.629,2.52c-10.148,1.887-16.857,11.647-14.98,21.804 c0.927,4.997,3.765,9.159,7.618,11.876c3.971,2.795,9.025,4.057,14.175,3.099c4.623-0.858,9.282-1.867,13.854-3.008 c10.021-2.494,16.126-12.646,13.626-22.662C299.761,427.318,289.618,421.218,279.591,423.714z"/>
<path d="M417.887,173.047c1.31,3.948,3.811,7.171,6.97,9.398c4.684,3.299,10.813,4.409,16.662,2.475 c9.806-3.256,15.119-13.83,11.875-23.631c-1.478-4.468-3.118-8.95-4.865-13.314c-3.836-9.59-14.714-14.259-24.309-10.423 c-9.585,3.834-14.256,14.715-10.417,24.308C415.271,165.528,416.646,169.293,417.887,173.047z"/>
<path d="M340.36,397.013c-3.299,2.178-6.704,4.286-10.134,6.261c-8.949,5.162-12.014,16.601-6.854,25.546 c1.401,2.433,3.267,4.422,5.416,5.942c5.769,4.059,13.604,4.667,20.127,0.909c4.078-2.352,8.133-4.854,12.062-7.452 c8.614-5.691,10.985-17.294,5.291-25.912C360.575,393.686,348.977,391.318,340.36,397.013z"/>
<path d="M465.022,225.279c-0.407-10.322-9.101-18.356-19.426-17.953c-10.312,0.407-18.352,9.104-17.947,19.422 c0.155,3.945,0.195,7.949,0.104,11.89c-0.145,6.473,3.021,12.243,7.941,15.711c2.931,2.064,6.488,3.313,10.345,3.401 c10.322,0.229,18.876-7.958,19.105-18.285C465.247,234.756,465.208,229.985,465.022,225.279z"/>
<path d="M414.835,347.816c-8.277-6.21-19.987-4.524-26.186,3.738c-2.374,3.164-4.874,6.289-7.434,9.298 c-6.69,7.86-5.745,19.666,2.115,26.361c0.448,0.38,0.901,0.729,1.371,1.057c7.814,5.509,18.674,4.243,24.992-3.171 c3.057-3.59,6.037-7.323,8.874-11.102C424.767,365.735,423.089,354.017,414.835,347.816z"/>
<path d="M442.325,280.213c-9.855-3.09-20.35,2.396-23.438,12.251c-1.182,3.765-2.492,7.548-3.906,11.253 c-3.105,8.156-0.13,17.13,6.69,21.939c1.251,0.879,2.629,1.624,4.126,2.19c9.649,3.682,20.454-1.159,24.132-10.812 c1.679-4.405,3.237-8.906,4.646-13.382C457.66,293.795,452.178,283.303,442.325,280.213z"/>
<path d="M197.999,426.402c-16.72-3.002-32.759-8.114-47.968-15.244c-0.18-0.094-0.341-0.201-0.53-0.287 c-3.584-1.687-7.162-3.494-10.63-5.382c-0.012-0.014-0.034-0.023-0.053-0.031c-6.363-3.504-12.573-7.381-18.606-11.628 C32.24,331.86,11.088,209.872,73.062,121.901c13.476-19.122,29.784-35.075,47.965-47.719c0.224-0.156,0.448-0.311,0.67-0.468 c64.067-44.144,151.06-47.119,219.089-1.757l-14.611,21.111c-4.062,5.876-1.563,10.158,5.548,9.518l63.467-5.682 c7.12-0.64,11.378-6.799,9.463-13.675L387.61,21.823c-1.908-6.884-6.793-7.708-10.859-1.833l-14.645,21.161 C312.182,7.638,252.303-5.141,192.87,5.165c-5.986,1.036-11.888,2.304-17.709,3.78c-0.045,0.008-0.081,0.013-0.117,0.021 c-0.225,0.055-0.453,0.128-0.672,0.189C123.122,22.316,78.407,52.207,46.5,94.855c-0.269,0.319-0.546,0.631-0.8,0.978 c-1.061,1.429-2.114,2.891-3.145,4.353c-1.686,2.396-3.348,4.852-4.938,7.308c-0.199,0.296-0.351,0.597-0.525,0.896 C10.762,149.191-1.938,196.361,0.24,244.383c0.005,0.158-0.004,0.317,0,0.479c0.211,4.691,0.583,9.447,1.088,14.129 c0.027,0.302,0.094,0.588,0.145,0.89c0.522,4.708,1.177,9.427,1.998,14.145c8.344,48.138,31.052,91.455,65.079,125.16 c0.079,0.079,0.161,0.165,0.241,0.247c0.028,0.031,0.059,0.047,0.086,0.076c9.142,9.017,19.086,17.357,29.793,24.898 c28.02,19.744,59.221,32.795,92.729,38.808c10.167,1.827,19.879-4.941,21.703-15.103 C214.925,437.943,208.163,428.223,197.999,426.402z"/>
<path d="M221.124,83.198c-8.363,0-15.137,6.78-15.137,15.131v150.747l137.87,71.271c2.219,1.149,4.595,1.69,6.933,1.69 c5.476,0,10.765-2.982,13.454-8.185c3.835-7.426,0.933-16.549-6.493-20.384l-121.507-62.818V98.329 C236.243,89.978,229.477,83.198,221.124,83.198z"/>
</g>
</svg>`;
btn.addEventListener('click', toggleLoop);
container.after(btn);
NOVA.waitSelector('#movie_player video')
.then(video => {
video.addEventListener('loadeddata', ({ target }) => {
stopPreload = movie_player.classList.contains('ad-showing') || !Boolean(user_settings.auto_buffer_default);
btn.style.opacity = stopPreload ? .5 : 1;
});
});
function toggleLoop() {
stopPreload = !stopPreload;
btn.style.opacity = stopPreload ? .5 : 1;
NOVA.showOSD('Preload is ' + Boolean(stopPreload));
if (stopPreload) {
NOVA.videoElement.currentTime = saveCurrentTime;
movie_player.classList.remove(SELECTOR_CLASS_NAME);
}
}
});
},
options: {
auto_buffer_sec: {
_tagName: 'input',
label: 'Sec',
type: 'number',
title: 'buffer time',
placeholder: '10-300',
step: 5,
min: 30,
max: 300,
value: 60,
},
auto_buffer_default: {
_tagName: 'select',
label: 'Default state',
'label:zh': '默认状态',
'label:ja': 'デフォルト状態',
'label:pl': 'Stan domyślny',
options: [
{
label: 'on', value: true, selected: true,
},
{
label: 'off', value: false,
},
],
},
auto_buffer_color: {
_tagName: 'input',
type: 'color',
value: '#ffa000',
label: 'Color',
'label:zh': '颜色',
'label:ja': '色',
'label:pl': 'Kolor',
},
}
});
window.nova_plugins.push({
id: 'video-zoom',
title: 'Zoom video',
'title:zh': '缩放视频',
'title:ja': 'ズームビデオ',
run_on_pages: 'watch, embed, -mobile',
section: 'player',
desc: 'Remove horizontal black bars',
_runtime: user_settings => {
const ZOOM_CLASS_NAME = 'nova-zoom';
NOVA.waitSelector('.html5-video-container')
.then(container => {
let zoomPercent = 100;
if (user_settings.zoom_hotkey == 'keyboard') {
document.addEventListener('keydown', evt => {
if (NOVA.currentPage != 'watch' && NOVA.currentPage != 'embed') return;
if (['input', 'textarea', 'select'].includes(evt.target.localName) || evt.target.isContentEditable) return;
if (evt.ctrlKey || evt.altKey || evt.shiftKey || evt.metaKey) return;
let delta;
switch (user_settings.zoom_hotkey_custom_in.length === 1 ? evt.key : evt.code) {
case user_settings.zoom_hotkey_custom_in: delta = 1; break;
case user_settings.zoom_hotkey_custom_out: delta = -1; break;
}
if (delta) {
evt.preventDefault();
evt.stopPropagation();
evt.stopImmediatePropagation();
if (step = +user_settings.zoom_step * Math.sign(delta)) {
setScale(zoomPercent + step);
}
}
}, { capture: true });
}
else if (user_settings.zoom_hotkey) {
container.addEventListener('wheel', evt => {
evt.preventDefault();
evt.stopPropagation();
if (evt[user_settings.zoom_hotkey] || (user_settings.zoom_hotkey == 'none'
&& !evt.ctrlKey && !evt.altKey && !evt.shiftKey && !evt.metaKey)
) {
if (step = +user_settings.zoom_step * Math.sign(evt.wheelDelta)) {
setScale(zoomPercent + step);
}
}
}, { capture: true });
}
if (hotkey = user_settings.zoom_auto_max_width_hotkey_toggle) {
document.addEventListener('keyup', evt => {
if (NOVA.currentPage != 'watch' && NOVA.currentPage != 'embed') return;
if (['input', 'textarea', 'select'].includes(evt.target.localName) || evt.target.isContentEditable) return;
if (evt.ctrlKey || evt.altKey || evt.shiftKey || evt.metaKey) return;
if ((hotkey.length === 1 ? evt.key : evt.code) === hotkey
&& (maxZoomPercent = geVideoMaxWidthPercent())
) {
setScale(zoomPercent === maxZoomPercent ? 100 : maxZoomPercent);
}
});
}
if (user_settings['save-channel-state']) {
NOVA.runOnPageLoad(async () => {
if ((NOVA.currentPage == 'watch' || NOVA.currentPage == 'embed')
&& (userZoom = await NOVA.storage_obj_manager.getParam('zoom'))
) {
setScale(userZoom * 100);
}
});
}
if (user_settings.zoom_auto_max_width) {
NOVA.waitSelector('video')
.then(video => {
video.addEventListener('loadeddata', () => {
const squareAspectRatio = () => {
const aspectRatio = NOVA.aspectRatio.getAspectRatio({
'width': video.videoWidth,
'height': video.videoHeight,
});
return ('4:3' == aspectRatio || '1:1' == aspectRatio);
};
if (!squareAspectRatio()
&& (maxZoomPercent = geVideoMaxWidthPercent())
&& (Math.trunc(maxZoomPercent) !== 100)
&& (Math.trunc(maxZoomPercent) < 175)
) {
setScale(maxZoomPercent);
}
});
});
}
function setScale(zoom_pt = 100) {
zoom_pt = Math.max(100, Math.min(250, Math.trunc(zoom_pt)));
if (zoom_pt === 100 && container.classList.contains(ZOOM_CLASS_NAME)) {
container.classList.remove(ZOOM_CLASS_NAME);
container.style.removeProperty('transform');
}
else if (zoom_pt !== 100 && !container.classList.contains(ZOOM_CLASS_NAME)) {
container.classList.add(ZOOM_CLASS_NAME);
}
NOVA.showOSD(`Zoom: ${zoom_pt}%`);
if (zoom_pt === zoomPercent) return;
zoomPercent = zoom_pt;
container.style.setProperty('transform', `scale(${zoom_pt / 100})`);
}
function geVideoMaxWidthPercent() {
return Math.trunc(movie_player.clientWidth / NOVA.videoElement.videoHeight * 100);
}
NOVA.css.push(
`.${ZOOM_CLASS_NAME} {
transition: transform 100ms linear;
transform-origin: center;
}
.${ZOOM_CLASS_NAME} video {
position: relative !important;
}`);
});
},
options: {
zoom_hotkey: {
_tagName: 'select',
label: 'Hotkey',
'label:zh': '热键',
'label:ja': 'ホットキー',
'label:pl': 'Klawisz skrótu',
options: [
{ label: 'none', },
{ label: 'wheel', value: 'none' },
{ label: 'shift+wheel', value: 'shiftKey' },
{ label: 'ctrl+wheel', value: 'ctrlKey' },
{ label: 'alt+wheel', value: 'altKey' },
{ label: 'keyboard', value: 'keyboard', selected: true },
],
},
zoom_hotkey_custom_in: {
_tagName: 'select',
label: 'Hotkey zoom in',
options: [
{ label: '+', value: '+', selected: true },
{ label: 'A', value: 'KeyA' },
{ label: 'B', value: 'KeyB' },
{ label: 'C', value: 'KeyC' },
{ label: 'D', value: 'KeyD' },
{ label: 'E', value: 'KeyE' },
{ label: 'F', value: 'KeyF' },
{ label: 'G', value: 'KeyG' },
{ label: 'H', value: 'KeyH' },
{ label: 'I', value: 'KeyI' },
{ label: 'J', value: 'KeyJ' },
{ label: 'K', value: 'KeyK' },
{ label: 'L', value: 'KeyL' },
{ label: 'M', value: 'KeyM' },
{ label: 'N', value: 'KeyN' },
{ label: 'O', value: 'KeyO' },
{ label: 'P', value: 'KeyP' },
{ label: 'Q', value: 'KeyQ' },
{ label: 'R', value: 'KeyR' },
{ label: 'S', value: 'KeyS' },
{ label: 'T', value: 'KeyT' },
{ label: 'U', value: 'KeyU' },
{ label: 'V', value: 'KeyV' },
{ label: 'W', value: 'KeyW' },
{ label: 'X', value: 'KeyX' },
{ label: 'Y', value: 'KeyY' },
{ label: 'Z', value: 'KeyZ' },
0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
']', '[', '-', ',', '.', '/', '<', ';', '\\',
],
'data-dependent': { 'zoom_hotkey': ['keyboard'] },
},
zoom_hotkey_custom_out: {
_tagName: 'select',
label: 'Hotkey zoom out',
options: [
{ label: '-', value: '-', selected: true },
{ label: 'ShiftL', value: 'ShiftLeft' },
{ label: 'ShiftR', value: 'ShiftRight' },
{ label: 'CtrlL', value: 'ControlLeft' },
{ label: 'CtrlR', value: 'ControlRight' },
{ label: 'AltL', value: 'AltLeft' },
{ label: 'AltR', value: 'AltRight' },
{ label: 'A', value: 'KeyA' },
{ label: 'B', value: 'KeyB' },
{ label: 'C', value: 'KeyC' },
{ label: 'D', value: 'KeyD' },
{ label: 'E', value: 'KeyE' },
{ label: 'F', value: 'KeyF' },
{ label: 'G', value: 'KeyG' },
{ label: 'H', value: 'KeyH' },
{ label: 'I', value: 'KeyI' },
{ label: 'J', value: 'KeyJ' },
{ label: 'K', value: 'KeyK' },
{ label: 'L', value: 'KeyL' },
{ label: 'M', value: 'KeyM' },
{ label: 'N', value: 'KeyN' },
{ label: 'O', value: 'KeyO' },
{ label: 'P', value: 'KeyP' },
{ label: 'Q', value: 'KeyQ' },
{ label: 'R', value: 'KeyR' },
{ label: 'S', value: 'KeyS' },
{ label: 'T', value: 'KeyT' },
{ label: 'U', value: 'KeyU' },
{ label: 'V', value: 'KeyV' },
{ label: 'W', value: 'KeyW' },
{ label: 'X', value: 'KeyX' },
{ label: 'Y', value: 'KeyY' },
{ label: 'Z', value: 'KeyZ' },
0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
']', '[', '+', ',', '.', '/', '<', ';', '\\',
],
'data-dependent': { 'zoom_hotkey': ['keyboard'] },
},
zoom_step: {
_tagName: 'input',
label: 'Hotkey step',
'label:zh': '步',
'label:ja': 'ステップ',
'label:pl': 'Krok',
type: 'number',
title: 'in %',
placeholder: '%',
step: 5,
min: 5,
max: 50,
value: 10,
},
zoom_auto_max_width: {
_tagName: 'input',
label: 'Auto fit to width',
type: 'checkbox',
},
zoom_auto_max_width_hotkey_toggle: {
_tagName: 'select',
label: 'Hotkey toggle fit to width',
title: 'exception square video',
options: [
{ label: 'none', value: false },
{ label: 'ShiftL', value: 'ShiftLeft' },
{ label: 'ShiftR', value: 'ShiftRight' },
{ label: 'CtrlL', value: 'ControlLeft' },
{ label: 'CtrlR', value: 'ControlRight' },
{ label: 'AltL', value: 'AltLeft' },
{ label: 'AltR', value: 'AltRight' },
{ label: 'A', value: 'KeyA' },
{ label: 'B', value: 'KeyB' },
{ label: 'C', value: 'KeyC' },
{ label: 'D', value: 'KeyD' },
{ label: 'E', value: 'KeyE' },
{ label: 'F', value: 'KeyF' },
{ label: 'G', value: 'KeyG' },
{ label: 'H', value: 'KeyH' },
{ label: 'I', value: 'KeyI' },
{ label: 'J', value: 'KeyJ' },
{ label: 'K', value: 'KeyK' },
{ label: 'L', value: 'KeyL' },
{ label: 'M', value: 'KeyM' },
{ label: 'N', value: 'KeyN' },
{ label: 'O', value: 'KeyO' },
{ label: 'P', value: 'KeyP' },
{ label: 'Q', value: 'KeyQ', selected: true },
{ label: 'R', value: 'KeyR' },
{ label: 'S', value: 'KeyS' },
{ label: 'T', value: 'KeyT' },
{ label: 'U', value: 'KeyU' },
{ label: 'V', value: 'KeyV' },
{ label: 'W', value: 'KeyW' },
{ label: 'X', value: 'KeyX' },
{ label: 'Y', value: 'KeyY' },
{ label: 'Z', value: 'KeyZ' },
0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
']', '[', '+', '-', ',', '.', '/', '<', ';', '\\',
],
},
}
});
window.nova_plugins.push({
id: 'playlist-collapse',
title: 'Collapse playlist',
'title:zh': '播放列表自动折叠',
'title:ja': 'プレイリストの自動折りたたみ',
'title:pl': 'Automatyczne zwijanie listy odtwarzania',
run_on_pages: 'watch, -mobile',
section: 'playlist',
_runtime: user_settings => {
if (!location.search.includes('list=')) return;
NOVA.waitSelector('#secondary #playlist:not([collapsed]) #expand-button button')
.then(btn => {
btn.click();
});
},
});
window.nova_plugins.push({
id: 'playlist-duration',
title: 'Show playlist duration',
'title:zh': '显示播放列表持续时间',
'title:ja': 'プレイリストの期間を表示',
'title:pl': 'Pokaż czas trwania playlisty',
run_on_pages: 'watch, playlist, -mobile',
restart_on_location_change: true,
section: 'playlist',
_runtime: user_settings => {
const
SELECTOR_ID = 'nova-playlist-duration',
playlistId = NOVA.queryURL.get('list');
if (!playlistId) return;
switch (NOVA.currentPage) {
case 'playlist':
NOVA.waitSelector('#owner-text a')
.then(el => {
if (duration = getPlaylistDuration()) {
insertToHTML({ 'container': el, 'text': duration });
}
else {
getPlaylistDurationFromThumbnails('#primary #thumbnail #overlays #text:not(:empty)')
?.then(duration => insertToHTML({ 'container': el, 'text': duration }));
}
function getPlaylistDuration() {
const vids_list = (document.body.querySelector('ytd-app')?.data?.response || window.ytInitialData)
.contents.twoColumnBrowseResultsRenderer
?.tabs[0].tabRenderer?.content?.sectionListRenderer
?.contents[0].itemSectionRenderer
?.contents[0].playlistVideoListRenderer?.contents
|| document.body.querySelector('ytd-watch-flexy')?.__data.playlistData?.contents
|| document.body.querySelector('ytd-watch-flexy')?.data?.playlist?.playlist?.contents;
const duration = vids_list?.reduce((acc, vid) => acc + (+vid.playlistVideoRenderer?.lengthSeconds || 0), 0);
if (duration) {
return outFormat(duration);
}
}
});
break;
case 'watch':
NOVA.waitSelector('#secondary .index-message-wrapper', { destroy_after_page_leaving: true })
.then(el => {
const waitPlaylist = setInterval(() => {
const
playlistLength = movie_player.getPlaylist()?.length,
playlistList = document.body.querySelector('yt-playlist-manager')?.currentPlaylistData_?.contents
.filter(e => e.playlistPanelVideoRenderer?.lengthText?.simpleText)
.map(e => NOVA.formatTimeOut.hmsToSec(e.playlistPanelVideoRenderer.lengthText.simpleText));
console.assert(playlistList?.length === playlistLength, 'playlist loading:', playlistList?.length + '/' + playlistLength);
if (playlistLength && (playlistList?.length === playlistLength)) {
clearInterval(waitPlaylist);
if (duration = getPlaylistDuration(playlistList)) {
insertToHTML({ 'container': el, 'text': duration });
NOVA.waitSelector('#movie_player video', { destroy_after_page_leaving: true })
.then(video => {
video.addEventListener('ratechange', () => {
insertToHTML({ 'container': el, 'text': getPlaylistDuration(playlistList) });
});
});
}
else if (!user_settings.playlist_duration_progress_type) {
getPlaylistDurationFromThumbnails('#playlist #playlist-items #unplayableText[hidden]')
?.then(duration => insertToHTML({ 'container': el, 'text': duration }));
}
}
}, 2000);
function getPlaylistDuration(total_list) {
const currentIndex = movie_player.getPlaylistIndex();
let elapsedList = [...total_list];
switch (user_settings.playlist_duration_progress_type) {
case 'done':
elapsedList.splice(currentIndex);
break;
case 'left':
elapsedList.splice(0, currentIndex);
break;
}
const sumArr = arr => arr.reduce((acc, time) => acc + +time, 0);
return outFormat(
sumArr(elapsedList),
user_settings.playlist_duration_percentage ? sumArr(total_list) : false
);
}
});
break;
}
function getPlaylistDurationFromThumbnails(items_selector = required()) {
if (container && !(container instanceof HTMLElement)) {
return console.error('container not HTMLElement:', container);
}
return new Promise(resolve => {
let forcePlaylistRun = false;
const waitThumbnails = setInterval(() => {
const
timeStampList = document.body.querySelectorAll(items_selector),
playlistLength = movie_player.getPlaylist()?.length
|| document.body.querySelector('ytd-player')?.player_?.getPlaylist()?.length
|| timeStampList.length,
duration = getTotalTime(timeStampList);
console.assert(timeStampList.length === playlistLength, 'playlist loading:', timeStampList.length + '/' + playlistLength);
if (+duration && timeStampList.length
&& (timeStampList.length === playlistLength || forcePlaylistRun)
) {
clearInterval(waitThumbnails);
resolve(outFormat(duration));
}
else if (!forcePlaylistRun) {
setTimeout(() => forcePlaylistRun = true, 1000 * 3);
}
}, 500);
});
function getTotalTime(nodes) {
const arr = [...nodes]
.map(e => NOVA.formatTimeOut.hmsToSec(e.textContent))
.filter(Number);
return arr.length && arr.reduce((acc, time) => acc + +time, 0);
}
}
function outFormat(duration = 0, total) {
let outArr = [
NOVA.formatTimeOut.HMS.digit(
(NOVA.currentPage == 'watch' && NOVA.videoElement?.playbackRate)
? (duration / NOVA.videoElement.playbackRate) : duration
)
];
if (total) {
outArr.push(`(${Math.trunc(duration * 100 / total) + '%'})`);
if (user_settings.playlist_duration_progress_type) {
outArr.push(user_settings.playlist_duration_progress_type);
}
}
return ' - ' + outArr.join(' ');
}
function insertToHTML({ text = '', container = required() }) {
if (!(container instanceof HTMLElement)) return console.error('container not HTMLElement:', container);
(container.querySelector(`#${SELECTOR_ID}`) || (function () {
const el = document.createElement('span');
el.id = SELECTOR_ID;
return container.appendChild(el);
})())
.textContent = ' ' + text;
}
},
options: {
playlist_duration_progress_type: {
_tagName: 'select',
label: 'Mode',
'label:zh': '模式',
'label:ja': 'モード',
'label:pl': 'Tryb',
label: 'Time display mode',
'title:zh': '时间显示方式',
'title:ja': '時間表示モード',
'title:pl': 'Tryb wyświetlania czasu',
options: [
{
label: 'done', value: 'done',
'label:zh': '结束',
'label:ja': '終わり',
'label:pl': 'zakończone',
},
{
label: 'left', value: 'left',
'label:zh': '剩下',
'label:ja': '残り',
'label:pl': 'pozostało',
},
{
label: 'total', value: false, selected: true,
'label:zh': '全部的',
'label:ja': '全て',
'label:pl': 'w sumie',
},
],
},
playlist_duration_percentage: {
_tagName: 'input',
label: 'Add %',
'label:zh': '显示百分比',
'label:ja': 'パーセンテージを表示',
'label:pl': 'Pokaż procenty',
type: 'checkbox',
'data-dependent': { 'playlist_duration_progress_type': ['done', 'left'] },
},
}
});
window.nova_plugins.push({
id: 'playlist-extended',
title: 'Playlist extended section',
'title:zh': '播放列表扩展部分',
'title:ja': 'プレイリスト拡張セクション',
run_on_pages: 'watch, -mobile',
section: 'playlist',
_runtime: user_settings => {
let height = 90;
if (user_settings['move-to-sidebar']) {
switch (user_settings.move_to_sidebar_target) {
case 'info': height = 84; break;
}
}
NOVA.css.push(
`ytd-watch-flexy:not([theater]) #secondary #playlist {
--ytd-watch-flexy-panel-max-height: ${height}vh !important;
}`);
},
});
window.nova_plugins.push({
id: 'playlist-reverse',
title: 'Add playlist reverse order button',
'title:zh': '添加按钮反向播放列表顺序',
'title:ja': 'ボタンの逆プレイリストの順序を追加',
'title:pl': 'Dodaj przycisk odtwarzania w odwrotnej kolejności',
run_on_pages: 'watch, -mobile',
section: 'playlist',
_runtime: user_settings => {
const
SELECTOR_ID = 'nova-playlist-reverse-btn',
SELECTOR = '#' + SELECTOR_ID,
CLASS_NAME_ACTIVE = 'nova-playlist-reverse-on';
window.nova_playlistReversed;
NOVA.css.push(
SELECTOR + ` {
background: none;
border: 0;
}
yt-icon-button {
width: 40px;
height: 40px;
padding: 10px;
}
${SELECTOR} svg {
fill: white;
fill: var(--yt-spec-text-secondary);
}
${SELECTOR}:hover svg { fill: #66afe9; }
${SELECTOR}:active svg,
${SELECTOR}.${CLASS_NAME_ACTIVE} svg { fill: #2196f3; }`);
if (user_settings.playlist_reverse_auto_enabled && !window.nova_playlistReversed) {
window.nova_playlistReversed = true;
}
NOVA.runOnPageLoad(async () => {
if (location.search.includes('list=') && NOVA.currentPage == 'watch') {
reverseControl();
document.addEventListener('yt-page-data-updated', insertButton, { capture: true, once: true });
}
});
function insertButton() {
NOVA.waitSelector('ytd-watch-flexy.ytd-page-manager:not([hidden]) ytd-playlist-panel-renderer:not([collapsed]) #playlist-action-menu .top-level-buttons:not([hidden]), #secondary #playlist #playlist-action-menu #top-level-buttons-computed', { destroy_after_page_leaving: true })
.then(el => createButton(el));
function createButton(container = required()) {
if (!(container instanceof HTMLElement)) return console.error('container not HTMLElement:', container);
document.getElementById(SELECTOR_ID)?.remove();
const
reverseBtn = document.createElement('div'),
renderTitle = () => reverseBtn.title = `Reverse playlist order is ${window.nova_playlistReversed ? 'ON' : 'OFF'}`;
if (window.nova_playlistReversed) reverseBtn.className = CLASS_NAME_ACTIVE;
reverseBtn.id = SELECTOR_ID;
renderTitle();
reverseBtn.innerHTML =
`<yt-icon-button>
<svg viewBox="0 0 381.399 381.399" height="100%" width="100%">
<g>
<path d="M233.757,134.901l-63.649-25.147v266.551c0,2.816-2.286,5.094-5.104,5.094h-51.013c-2.82,0-5.099-2.277-5.099-5.094 V109.754l-63.658,25.147c-2.138,0.834-4.564,0.15-5.946-1.669c-1.389-1.839-1.379-4.36,0.028-6.187L135.452,1.991 C136.417,0.736,137.91,0,139.502,0c1.576,0,3.075,0.741,4.041,1.991l96.137,125.061c0.71,0.919,1.061,2.017,1.061,3.109 c0,1.063-0.346,2.158-1.035,3.078C238.333,135.052,235.891,135.735,233.757,134.901z M197.689,378.887h145.456v-33.62H197.689 V378.887z M197.689,314.444h145.456v-33.622H197.689V314.444z M197.689,218.251v33.619h145.456v-33.619H197.689z"/>
</g>
</svg>
</yt-icon-button>`;
reverseBtn.addEventListener('click', () => {
reverseBtn.classList.toggle(CLASS_NAME_ACTIVE);
window.nova_playlistReversed = !window.nova_playlistReversed;
if (window.nova_playlistReversed) {
reverseControl();
renderTitle();
fixConflictPlugins();
}
else location.reload();
});
container.append(reverseBtn);
}
}
function fixConflictPlugins() {
document.getElementById('nova-playlist-duration').innerHTML = '&nbsp; [out of reach] &nbsp;';
if (autoplayBtn = document.getElementById('nova-playlist-autoplay-btn')) {
autoplayBtn.disabled = true;
autoplayBtn.title = 'out of reach';
}
}
async function reverseControl() {
if (!window.nova_playlistReversed) return;
if ((ytdWatch = await NOVA.waitSelector('ytd-watch-flexy', { destroy_after_page_leaving: true }))
&& (data = await NOVA.waitUntil(() => ytdWatch.data?.contents?.twoColumnWatchNextResults, 100))
&& (playlist = data.playlist?.playlist)
&& (autoplay = data.autoplay?.autoplay)
) {
playlist.contents.reverse();
playlist.currentIndex = (playlist.totalVideos - playlist.currentIndex) - 1;
playlist.localCurrentIndex = (playlist.contents.length - playlist.localCurrentIndex) - 1;
for (const i of autoplay.sets) {
i.autoplayVideo = i.previousButtonVideo;
i.previousButtonVideo = i.nextButtonVideo;
i.nextButtonVideo = i.autoplayVideo;
}
ytdWatch.updatePageData_(data);
if ((manager = document.body.querySelector('yt-playlist-manager'))
&& (ytdPlayer = document.getElementById('ytd-player'))
) {
ytdPlayer.updatePlayerComponents(null, autoplay, null, playlist);
manager.autoplayData = autoplay;
manager.setPlaylistData(playlist);
ytdPlayer.updatePlayerPlaylist_(playlist);
}
}
scrollToElement(document.body.querySelector('#secondary #playlist-items[selected], ytm-playlist .item[selected=true]'));
}
function scrollToElement(targetEl = required()) {
if (!(targetEl instanceof HTMLElement)) return console.error('targetEl not HTMLElement:', targetEl);
const container = targetEl.parentElement;
container.scrollTop = targetEl.offsetTop - container.offsetTop;
}
},
options: {
playlist_reverse_auto_enabled: {
_tagName: 'input',
label: 'Default enabled state',
'label:zh': '默认启用',
'label:ja': 'デフォルトで有効になっています',
'label:pl': 'Domyślnie włączone',
type: 'checkbox',
},
},
});
window.nova_plugins.push({
id: 'playlist-toggle-autoplay',
title: 'Add playlist autoplay control button',
'title:zh': '播放列表自动播放控制',
'title:ja': 'プレイリストの自動再生コントロール',
'title:pl': 'Kontrola autoodtwarzania listy odtwarzania',
run_on_pages: 'watch, -mobile',
section: 'playlist',
_runtime: user_settings => {
const
SELECTOR_ID = 'nova-playlist-autoplay-btn',
SELECTOR = '#' + SELECTOR_ID;
let sesionAutoplayState = user_settings.playlist_autoplay;
NOVA.css.push(
`#playlist-action-menu .top-level-buttons {
align-items: center;
}
${SELECTOR}[type=checkbox] {
--height: 1em;
width: 2.2em;
}
${SELECTOR}[type=checkbox]:after {
transform: scale(1.5);
}
${SELECTOR}[type=checkbox] {
--opacity: .7;
--color: white;
height: var(--height);
line-height: 1.6em;
border-radius: 3em;
background-color: var(--paper-toggle-button-unchecked-bar-color, black);
appearance: none;
-webkit-appearance: none;
position: relative;
cursor: pointer;
outline: 0;
border: none;
}
${SELECTOR}[type=checkbox]:after {
position: absolute;
top: 0;
left: 0;
content: '';
width: var(--height);
height: var(--height);
border-radius: 50%;
background-color: var(--color);
box-shadow: 0 0 .25em rgba(0, 0, 0, .3);
}
${SELECTOR}[type=checkbox]:checked:after {
left: calc(100% - var(--height));
--color: var(--paper-toggle-button-checked-button-color, var(--primary-color));
}
${SELECTOR}[type=checkbox]:focus, input[type=checkbox]:focus:after {
transition: all 200ms ease-in-out;
}
${SELECTOR}[type=checkbox]:disabled {
opacity: .3;
}`);
NOVA.runOnPageLoad(() => {
if (location.search.includes('list=') && NOVA.currentPage == 'watch') {
insertButton();
}
});
function insertButton() {
NOVA.waitSelector('ytd-watch-flexy.ytd-page-manager:not([hidden]) ytd-playlist-panel-renderer:not([collapsed]) #playlist-action-menu .top-level-buttons:not([hidden]), #secondary #playlist #playlist-action-menu #top-level-buttons-computed', { destroy_after_page_leaving: true })
.then(el => renderCheckbox(el));
function renderCheckbox(container = required()) {
if (!(container instanceof HTMLElement)) return console.error('container not HTMLElement:', container);
document.getElementById(SELECTOR_ID)?.remove();
const checkboxBtn = document.createElement('input');
checkboxBtn.id = SELECTOR_ID;
checkboxBtn.type = 'checkbox';
checkboxBtn.title = 'Playlist toggle autoplay';
checkboxBtn.addEventListener('change', ({ target }) => {
sesionAutoplayState = target.checked;
setAssociatedAutoplay();
});
container.append(checkboxBtn);
checkboxBtn.checked = sesionAutoplayState;
setAssociatedAutoplay();
function setAssociatedAutoplay() {
if (manager = document.body.querySelector('yt-playlist-manager')) {
manager.interceptedForAutoplay = true;
manager.canAutoAdvance_ = checkboxBtn.checked;
checkboxBtn.checked = manager?.canAutoAdvance_;
checkboxBtn.title = `Playlist Autoplay is ${manager?.canAutoAdvance_ ? 'ON' : 'OFF'}`;
if (checkboxBtn.checked) checkHiddenVideo();
}
else console.error('Error playlist-autoplay. Playlist manager is', manager);
async function checkHiddenVideo() {
const ytdWatch = document.body.querySelector('ytd-watch-flexy');
let vids_list;
await NOVA.waitUntil(() => {
if ((vids_list =
ytdWatch?.data?.contents?.twoColumnWatchNextResults?.playlist?.playlist?.contents
|| ytdWatch?.data?.playlist?.playlist?.contents
)
&& vids_list.length) return true;
}, 1000);
const
currentIndex = movie_player.getPlaylistIndex(),
lastAvailableIdx = vids_list.findIndex(i => i.hasOwnProperty('messageRenderer')) - 1;
if (currentIndex === lastAvailableIdx) {
manager.canAutoAdvance_ = false;
alert('Nova [playlist-toggle-autoplay]:\nPlaylist has hide video. Playlist autoplay disabled');
checkboxBtn.checked = false;
}
}
}
}
}
},
options: {
playlist_autoplay: {
_tagName: 'select',
label: 'Default state',
'label:zh': '默认状态',
'label:ja': 'デフォルト状態',
'label:pl': 'Stan domyślny',
options: [
{
label: 'play', value: true, selected: true,
},
{
label: 'stop', value: false,
},
],
},
}
});
window.nova_plugins.push({
id: 'move-to-sidebar',
title: 'Move to sidebar',
'title:zh': '转移到侧边栏',
'title:ja': 'サイドバーに転送',
'title:pl': 'Przenieś na pasek boczny',
run_on_pages: 'watch, -mobile',
section: 'sidebar',
'plugins-conflict': 'description-popup',
_runtime: user_settings => {
if (user_settings.move_to_sidebar_target != 'info' && location.search.includes('list=')) return;
const
SELECTOR_CONTAINER = 'ytd-watch-flexy:not([fullscreen])',
SELECTOR_BELOW = `${SELECTOR_CONTAINER} #below`,
SELECTOR_SECONDARY = `${SELECTOR_CONTAINER} #secondary`;
switch (user_settings.move_to_sidebar_target) {
case 'info':
moveChannelInfo();
break;
case 'description':
if (user_settings['description-popup']) return;
NOVA.waitSelector(`${SELECTOR_BELOW} #description.ytd-watch-metadata`, { destroy_after_page_leaving: true })
.then(description => {
NOVA.waitSelector(`${SELECTOR_SECONDARY}-inner`, { destroy_after_page_leaving: true })
.then(async secondary => {
if (document.body.querySelector('#chat:not([collapsed])')) return;
secondary.prepend(description);
moveChannelInfo();
if (!user_settings['description-popup'] && !user_settings['video-date-format']) {
document.body.querySelector(`${SELECTOR_BELOW} ytd-watch-metadata #title`)
?.append(document.body.querySelector(`${SELECTOR_SECONDARY} #info-container`));
}
else {
document.body.querySelector(`${SELECTOR_SECONDARY} #info-container`)?.remove();
}
NOVA.css.push(
SELECTOR_SECONDARY + ` #owner {
margin: 0;
}
${SELECTOR_SECONDARY} #description.ytd-watch-metadata {
height: fit-content !important;
max-height: 80vh !important;
overflow-y: auto;
}
${SELECTOR_SECONDARY} #description #collapse {
display: none;
}
#ytd-watch-info-text, #info-container a {
display: none;
}`);
document.body.querySelector(`${SELECTOR_SECONDARY} #description #expand`)?.click();
});
});
moveSidebar();
break;
case 'comments':
if (user_settings.comments_visibility_mode == 'disable'
|| user_settings['comments-popup']
) {
return;
}
NOVA.waitSelector(`${SELECTOR_BELOW} #comments`, { destroy_after_page_leaving: true })
.then(comments => {
if (document.body.querySelector('#chat:not([collapsed])')) return;
document.body.querySelector(`${SELECTOR_SECONDARY}`)?.appendChild(comments);
comments.style.cssText = 'height:100vh; overflow-y:auto;';
});
moveSidebar();
break;
}
function moveSidebar() {
NOVA.waitSelector(`${SELECTOR_SECONDARY} #related`, { destroy_after_page_leaving: true })
.then(related => {
if (document.body.querySelector('#chat:not([collapsed])')) return;
document.body.querySelector('#below')?.appendChild(related);
});
}
function moveChannelInfo() {
NOVA.waitSelector(`${SELECTOR_SECONDARY}-inner`, { destroy_after_page_leaving: true })
.then(secondary => {
NOVA.waitSelector(`${SELECTOR_BELOW} ytd-watch-metadata #owner`, { destroy_after_page_leaving: true })
.then(channelInfo => {
secondary.prepend(channelInfo);
});
});
}
},
options: {
move_to_sidebar_target: {
_tagName: 'select',
label: 'Target of movement',
'label:zh': '运动目标',
'label:ja': '移動の対象',
options: [
{ label: 'info', value: 'info' },
{ label: 'info + description', value: 'description', selected: true },
{ label: 'comments', value: 'comments' },
],
},
},
});
window.nova_plugins.push({
id: 'related-visibility',
title: 'Collapse related section',
'title:zh': '收起相关栏目',
'title:ja': '関連セクションを折りたたむ',
'title:pl': 'Zwiń powiązaną sekcję',
run_on_pages: 'watch, -mobile',
section: 'sidebar',
_runtime: user_settings => {
NOVA.collapseElement({
selector: '#secondary #related',
label: 'related',
remove: (user_settings.related_visibility_mode == 'disable') ? true : false,
});
},
options: {
related_visibility_mode: {
_tagName: 'select',
label: 'Mode',
'label:zh': '模式',
'label:ja': 'モード',
'label:pl': 'Tryb',
options: [
{
label: 'collapse', value: 'hide', selected: true,
'label:pl': 'zwiń',
},
{
label: 'remove', value: 'disable',
'label:zh': '消除',
'label:ja': '削除',
'label:pl': 'usunąć',
},
],
},
}
});
window.nova_plugins.push({
id: 'livechat-toggle-mode',
title: '"Livechat" mode instead of "Top chat"',
run_on_pages: 'live_chat, -mobile',
restart_on_location_change: true,
section: 'sidebar',
_runtime: user_settings => {
NOVA.waitSelector('#chat-messages #menu a[aria-selected="false"]')
.then(async btn => {
await btn.click();
});
},
});
window.nova_plugins.push({
id: 'sidebar-thumbs-channel-link-patch',
title: 'Fix channel links in sidebar',
'title:zh': '修复侧边栏中的频道链接',
'title:ja': 'サイドバーのチャネルリンクを修正',
'title:pl': 'Napraw linki do kanałów na pasku bocznym',
run_on_pages: 'watch, -mobile',
section: 'sidebar',
_runtime: user_settings => {
document.addEventListener('click', evt => patchLink(evt), { capture: true });
document.addEventListener('auxclick', evt => evt.button === 1 && patchLink(evt), { capture: true });
function patchLink(evt) {
if (evt.isTrusted
&& NOVA.currentPage == 'watch'
&& evt.target.closest('#channel-name')
&& (link = evt.target.closest('a'))
) {
if ((data = evt.target.closest('ytd-compact-video-renderer, ytd-video-meta-block')?.data)
&& (res = NOVA.seachInObjectBy.key({
'obj': data,
'keys': 'navigationEndpoint',
'match_fn': val => {
return val?.commandMetadata?.webCommandMetadata?.webPageType == 'WEB_PAGE_TYPE_CHANNEL';
},
})?.data)
) {
const
urlOrigData = link.data,
urlOrig = link.href;
link.data = res;
link.href = link.data.commandMetadata.webCommandMetadata.url += (user_settings['channel-default-tab'] && user_settings.channel_default_tab) || '/videos';
evt.target.addEventListener('mouseout', ({ target }) => {
link.data = urlOrigData;
link.href = urlOrig;
}, { capture: true, once: true });
}
}
}
},
});
window.nova_plugins.push({
id: 'livechat-visibility',
title: 'Collapse livechat',
'title:zh': '隐藏实时聊天',
'title:ja': 'ライブチャットを非表示',
'title:pl': 'Ukryj czat na żywo',
run_on_pages: 'watch, -mobile',
restart_on_location_change: true,
section: 'sidebar',
_runtime: user_settings => {
if (user_settings.livechat_visibility_mode == 'disable') {
NOVA.waitSelector('#chat', { destroy_after_page_leaving: true })
.then(chat => {
chat.remove();
});
}
else {
NOVA.waitSelector('#chat:not([collapsed]) #show-hide-button button', { destroy_after_page_leaving: true })
.then(btn => {
btn.click();
});
}
},
options: {
livechat_visibility_mode: {
_tagName: 'select',
label: 'Mode',
'label:zh': '模式',
'label:ja': 'モード',
'label:pl': 'Tryb',
options: [
{
label: 'collapse', value: 'hide', selected: true,
'label:pl': 'zwiń',
},
{
label: 'remove', value: 'disable',
'label:zh': '消除',
'label:ja': '削除',
'label:pl': 'usunąć',
},
],
},
}
});
window.nova_plugins.push({
id: 'thumbs-hide',
title: 'Thumbnails filter',
'title:zh': '缩略图过滤',
'title:ja': 'サムネイルのフィルタリング',
'title:pl': 'Ukryj kilka miniatur',
run_on_pages: 'home, results, feed, channel, watch, -mobile',
section: 'thumbs',
_runtime: user_settings => {
const
SELECTOR_THUMBS_HIDE_CLASS_NAME = 'nova-thumbs-hide',
thumbsSelectors = [
'ytd-rich-item-renderer',
'ytd-video-renderer',
'ytd-playlist-renderer',
'ytd-compact-video-renderer',
'yt-append-continuation-items-action',
'ytm-compact-video-renderer',
'ytm-item-section-renderer'
]
.map(i => `${i}:not(.${SELECTOR_THUMBS_HIDE_CLASS_NAME})`)
.join(',');
document.addEventListener('yt-action', evt => {
switch (evt.detail?.actionName) {
case 'yt-append-continuation-items-action':
case 'ytd-update-grid-state-action':
case 'yt-rich-grid-layout-refreshed':
case 'yt-store-grafted-ve-action':
switch (NOVA.currentPage) {
case 'home':
thumbRemove.live();
thumbRemove.mix();
thumbRemove.watched();
break;
case 'results':
thumbRemove.live();
thumbRemove.shorts();
thumbRemove.mix();
break;
case 'feed':
thumbRemove.live();
thumbRemove.streamed();
thumbRemove.shorts();
thumbRemove.durationLimits();
thumbRemove.premieres();
thumbRemove.mix();
thumbRemove.watched();
break;
case 'watch':
thumbRemove.live();
thumbRemove.mix();
thumbRemove.watched();
break;
}
break;
}
});
document.addEventListener('yt-navigate-finish', () => NOVA.queryURL.has('flow') && insertButton());
insertButton();
function insertButton() {
NOVA.waitSelector('#filter-button, ytd-shelf-renderer #title-container a[href="/feed/channels"]', { destroy_after_page_leaving: true })
.then(container => {
const filterBtn = document.createElement('button');
filterBtn.className = 'style-scope yt-formatted-string bold yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--text';
filterBtn.innerHTML =
`<span class="yt-spec-button-shape-next__icon" style="height:100%">
<svg viewBox="-50 -50 400 400" height="100%" width="100%">
<g fill="currentColor">
<path d="M128.25,175.6c1.7,1.8,2.7,4.1,2.7,6.6v139.7l60-51.3v-88.4c0-2.5,1-4.8,2.7-6.6L295.15,65H26.75L128.25,175.6z" />
</g>
</svg>
</span>`;
filterBtn.title = 'Toggle NOVA plugin [thumbs-hide]';
Object.assign(filterBtn.style, {
border: 0,
cursor: 'pointer',
scale: .7,
});
filterBtn.addEventListener('click', () => {
document.body.classList.toggle('nova-thumbs-unhide');
});
container.after(filterBtn);
});
}
NOVA.css.push(
`body.nova-thumbs-unhide .${SELECTOR_THUMBS_HIDE_CLASS_NAME} {
border: 2px dashed orange;
}
body:not(.nova-thumbs-unhide) .${SELECTOR_THUMBS_HIDE_CLASS_NAME} {
display: none
}`);
if (user_settings.thumbs_hide_shorts) {
const stylesList = [
'ytd-reel-shelf-renderer',
'ytd-rich-grid-row + ytd-rich-section-renderer',
'[is-shorts]',
];
if (CSS.supports('selector(:has(*))')) {
stylesList.push('ytd-guide-entry-renderer:has(path[d^="M10 14.65v-5.3L15"])');
}
NOVA.css.push(stylesList.join(',\n') + `{ display: none !important; }`);
}
const thumbRemove = {
shorts() {
if (!user_settings.thumbs_hide_shorts) return;
if (NOVA.currentPage == 'channel' && NOVA.channelTab == 'shorts') return;
document.body.querySelectorAll('a#thumbnail[href*="shorts/"]')
.forEach(el => {
if (thumb = el.closest(thumbsSelectors)) {
thumb.classList.add(SELECTOR_THUMBS_HIDE_CLASS_NAME);
}
});
},
durationLimits() {
if (!+user_settings.thumbs_hide_min_duration) return;
const OVERLAYS_TIME_SELECTOR = '#thumbnail #overlays #text:not(:empty)';
NOVA.waitSelector(OVERLAYS_TIME_SELECTOR)
.then(() => {
document.body.querySelectorAll(OVERLAYS_TIME_SELECTOR)
.forEach(el => {
if ((thumb = el.closest(thumbsSelectors))
&& (timeSec = NOVA.formatTimeOut.hmsToSec(el.textContent.trim()))
&& (timeSec * (user_settings.rate_default || 1)) < (+user_settings.thumbs_hide_min_duration || 60)
) {
thumb.classList.add(SELECTOR_THUMBS_HIDE_CLASS_NAME);
}
});
});
},
premieres() {
if (!user_settings.thumbs_hide_premieres) return;
document.body.querySelectorAll(
`#thumbnail #overlays [aria-label="Premiere"],
#thumbnail #overlays [aria-label="Upcoming"]`
)
.forEach(el => {
if (thumb = el.closest(thumbsSelectors)) {
thumb.classList.add(SELECTOR_THUMBS_HIDE_CLASS_NAME);
}
});
document.body.querySelectorAll('[class*="badge"] [class*="live-now"]')
.forEach(el => {
if (thumb = el.closest(thumbsSelectors)) {
thumb.classList.add(SELECTOR_THUMBS_HIDE_CLASS_NAME);
}
});
},
live() {
if (!user_settings.thumbs_hide_live) return;
if (NOVA.currentPage == 'channel' && NOVA.channelTab == 'streams') return;
const BLOCK_KEYWORDS = NOVA.strToArray(user_settings.thumbs_hide_live_channels_exception?.toLowerCase());
document.body.querySelectorAll('#thumbnail img[src*="_live.jpg"]')
.forEach(el => {
if (thumb = el.closest(thumbsSelectors)) {
if (BLOCK_KEYWORDS?.includes(thumb.querySelector('#channel-name a')?.textContent.trim().toLowerCase())) {
if (user_settings['search-filter']) {
thumb.style.display = 'block';
}
return;
}
thumb.classList.add(SELECTOR_THUMBS_HIDE_CLASS_NAME);
}
});
},
streamed() {
if (!user_settings.thumbs_hide_streamed) return;
if (NOVA.currentPage == 'channel' && NOVA.channelTab == 'streams') return;
const BLOCK_KEYWORDS = NOVA.strToArray(user_settings.thumbs_hide_live_channels_exception?.toLowerCase());
document.body.querySelectorAll('#metadata')
.forEach(el => {
if (el.querySelector('#metadata-line > span:last-of-type')?.textContent?.split(' ').length === 4
&& (thumb = el.closest(thumbsSelectors))
) {
if (BLOCK_KEYWORDS?.includes(thumb.querySelector('#channel-name a')?.textContent.trim().toLowerCase())) {
if (user_settings['search-filter']) {
thumb.style.display = 'block';
}
return;
}
thumb.classList.add(SELECTOR_THUMBS_HIDE_CLASS_NAME);
}
});
},
mix() {
if (!user_settings.thumbs_hide_mix) return;
document.body.querySelectorAll(
`a[href*="list="][href*="start_radio="]:not([hidden]),
#video-title[title^="Mix -"]:not([hidden])`
)
.forEach(el => {
if (thumb = el.closest('ytd-radio-renderer, ytd-compact-radio-renderer,' + thumbsSelectors)) {
thumb.classList.add(SELECTOR_THUMBS_HIDE_CLASS_NAME);
}
});
},
watched() {
if (!user_settings.thumbs_hide_watched) return;
if (!user_settings['thumbs-watched']) return;
const PERCENT_COMPLETE = +user_settings.thumbs_hide_watched_percent_complete || 90;
document.body.querySelectorAll('#thumbnail #overlays #progress[style*="width"]')
.forEach(el => {
if ((parseInt(el.style.width) > PERCENT_COMPLETE)
&& (thumb = el.closest(thumbsSelectors))
) {
thumb.classList.add(SELECTOR_THUMBS_HIDE_CLASS_NAME);
}
});
},
};
if (user_settings.thumbs_hide_mix) {
NOVA.css.push(
`ytd-radio-renderer {
display: none !important;
}`);
}
},
options: {
thumbs_hide_shorts: {
_tagName: 'input',
label: 'Hide Shorts',
'label:zh': '隐藏短裤',
'label:ja': 'ショーツを隠す',
'label:pl': 'Ukryj YouTube Shorts',
type: 'checkbox',
},
thumbs_hide_min_duration: {
_tagName: 'input',
label: 'Min duration in sec (for regular video)',
'label:zh': '最短持续时间（以秒为单位）',
'label:ja': '秒単位の最小期間',
'label:pl': 'Poniżej czasu trwania w sekundach',
type: 'number',
title: 'in sec / 0 - disable',
placeholder: '60-3600',
step: 1,
min: 0,
max: 3600,
value: 0,
},
thumbs_hide_premieres: {
_tagName: 'input',
label: 'Hide Premieres/Upcoming',
'label:zh': '隐藏首映/即将上映',
'label:ja': 'プレミア公開/近日公開を非表示',
'label:pl': 'Ukrywaj premiery',
type: 'checkbox',
title: 'Premiere Announcements',
},
thumbs_hide_live: {
_tagName: 'input',
label: 'Hide Live now streams',
'label:zh': '隐藏直播',
'label:ja': 'ライブ ストリームを非表示にする',
'label:pl': 'Ukryj strumień (na żywo)',
type: 'checkbox',
title: 'Now airing',
'title:zh': '正在播出',
'title:ja': '放映中',
'title:pl': 'Teraz wietrzenie',
},
thumbs_hide_live_channels_exception: {
_tagName: 'textarea',
label: 'Live channels exception',
'label:zh': '异常通道列表',
'label:ja': '例外チャネルのリスト',
title: 'separator: "," or ";" or "new line"',
'title:zh': '分隔器： "," 或 ";" 或 "新队"',
'title:ja': 'セパレータ： "," または ";" または "改行"',
'title:pl': 'separator: "," lub ";" lub "now linia"',
placeholder: 'channel1\nchannel2',
'data-dependent': { 'thumbs_hide_live': true },
},
thumbs_hide_streamed: {
_tagName: 'input',
label: 'Hide finished streams',
'label:zh': '隐藏完成的流',
'label:ja': '終了したストリームを非表示にする',
'label:pl': 'Ukryj po streamie',
type: 'checkbox',
'data-dependent': { 'thumbs_hide_live': true },
},
thumbs_hide_mix: {
_tagName: 'input',
label: "Hide 'Mix' thumbnails",
'label:zh': '隐藏[混合]缩略图',
'label:ja': '「Mix」サムネイルを非表示',
'label:pl': 'Ukryj miniaturki "Mix"',
type: 'checkbox',
title: '[Mix] offers to rewatch what has already saw',
'title:zh': '[混合]提供重新观看已经看过的内容',
'title:ja': '「Mix」は、すでに見たものを再視聴することを提案します',
'title:pl': '[Mix] proponuje ponowne obejrzenie już obejrzanych filmów',
},
thumbs_hide_watched: {
_tagName: 'input',
label: 'Hide watched',
'label:zh': '隐藏观看',
'label:ja': '監視対象を非表示',
'label:pl': 'Ukryj oglądane',
type: 'checkbox',
title: 'Need to Turn on [YouTube History]',
},
thumbs_hide_watched_percent_complete: {
_tagName: 'input',
label: 'Threshold percent',
type: 'number',
title: 'in %',
placeholder: '%',
step: 5,
min: 5,
max: 100,
value: 90,
'data-dependent': { 'thumbs_hide_watched': true },
},
}
});
window.nova_plugins.push({
id: 'thumbs-clear',
title: 'Thumbnails preview image',
'title:zh': '清除缩略图',
'title:ja': 'サムネイルをクリアする',
'title:pl': 'Wyczyść miniatury',
run_on_pages: 'home, feed, channel, watch',
section: 'thumbs',
desc: 'Replaces the predefined clickbait thumbnails',
'desc:zh': '替换预定义的缩略图',
'desc:ja': '事前定義されたサムネイルを置き換えます',
'desc:pl': 'Zastępuje predefiniowaną miniaturkę',
_runtime: user_settings => {
const
ATTR_MARK = 'nova-thumb-preview-cleared',
thumbsSelectors = [
'ytd-rich-item-renderer',
'yt-append-continuation-items-action',
'ytm-compact-video-renderer',
'ytm-item-section-renderer'
];
let DISABLE_YT_IMG_DELAY_LOADING_default = false;
NOVA.watchElements({
selectors: [
'#thumbnail:not(.ytd-playlist-thumbnail):not([class*=markers]):not([href*="/shorts/"]) img[src]:not([src*="_live.jpg"])',
'a:not([href*="/shorts/"]) img.video-thumbnail-img[src]:not([src*="_live.jpg"])'
],
attr_mark: ATTR_MARK,
callback: async img => {
if (NOVA.currentPage == 'results') return;
if (window.yt?.config_?.DISABLE_YT_IMG_DELAY_LOADING
&& DISABLE_YT_IMG_DELAY_LOADING_default !== window.yt?.config_?.DISABLE_YT_IMG_DELAY_LOADING
) {
DISABLE_YT_IMG_DELAY_LOADING_default = window.yt?.config_?.DISABLE_YT_IMG_DELAY_LOADING;
await NOVA.delay(100);
document.body.querySelectorAll(`[${ATTR_MARK}]`).forEach(e => e.removeAttribute(ATTR_MARK));
}
if ((thumb = img.closest(thumbsSelectors))
&& thumb.querySelector(
`#badges [class*="live-now"],
#overlays [aria-label="PREMIERE"],
#overlays [overlay-style="UPCOMING"]`)
) {
return;
}
if (src = patchImg(img.src)) img.src = patchImg(src);
},
});
if (user_settings.thumbs_clear_overlay) {
NOVA.css.push(
`#hover-overlays {
visibility: hidden !important;
}`);
}
function patchImg(str) {
if ((re = /(\w{2}default|hq\d+)./i) && re.test(str)) {
return str.replace(re, (user_settings.thumbs_clear_preview_timestamp || 'hq2') + '.');
}
}
},
options: {
thumbs_clear_preview_timestamp: {
_tagName: 'select',
label: 'Timestamps moment',
'label:zh': '缩略图时间戳',
'label:ja': 'サムネイルのタイムスタンプ',
'label:pl': 'Znaczniki czasowe miniatur',
title: 'Show thumbnail from video time position',
'title:zh': '从视频时间位置显示缩略图',
'title:ja': 'ビデオの時間位置からサムネイルを表示',
'title:pl': 'Pokaż miniaturkę z pozycji czasu wideo',
options: [
{
label: 'start', value: 'hq1',
'label:zh': '开始',
'label:ja': '始まり',
'label:pl': 'początek',
},
{
label: 'middle', value: 'hq2', selected: true,
'label:zh': '中间',
'label:ja': '真ん中',
'label:pl': 'środek',
},
{
label: 'end', value: 'hq3',
'label:zh': '结尾',
'label:ja': '終わり',
'label:pl': 'koniec',
}
],
},
thumbs_clear_overlay: {
_tagName: 'input',
label: 'Hide overlay buttons on a thumbnail',
'label:zh': '隐藏覆盖在缩略图上的按钮',
'label:ja': 'サムネイルにオーバーレイされたボタンを非表示にする',
'label:pl': 'Ukryj przyciski nakładki na miniaturce',
type: 'checkbox',
title: 'Hide [ADD TO QUEUE] [WATCH LATER]',
},
}
});
window.nova_plugins.push({
id: 'thumbs-title-normalize',
title: 'Decapitalize thumbnails title',
'title:zh': '从大写中删除缩略图标题',
'title:ja': 'サムネイルのタイトルを大文字から外す',
'title:pl': 'Zmniejsz czcionkę w tytule miniatur',
run_on_pages: 'home, feed, channel, watch',
section: 'thumbs',
desc: 'Upper Case thumbnails title back to normal',
'plugins-conflict': 'thumbs-title-lang',
_runtime: user_settings => {
if (user_settings['thumbs-title-lang']) return;
const
VIDEO_TITLE_SELECTOR = [
'#video-title',
'a > [class*="media-item-headline"]',
]
.map(i => i + ':not(:empty)'),
MAX_CAPS_LETTERS = +user_settings.thumbs_title_normalize_smart_max_words || 2,
ATTR_MARK = 'nova-thumb-title-normalized',
clearOfSymbols = str => str.replace(/[\u2011-\u26FF]/g, ' ').replace(/\s{2,}/g, ' '),
clearOfEmoji = str => str.replace(/[^<>=\p{L}\p{N}\p{P}\p{Z}{\^\$}]/gu, ' ').replace(/\s{2,}/g, ' ');
if (user_settings.thumbs_title_show_full) {
NOVA.css.push(
VIDEO_TITLE_SELECTOR.join(',') + `{
display: block !important;
max-height: unset !important;
}`);
}
const UpperCaseLetterRegex = new RegExp("([\-0-9A-ZÀ-ÖØ-ÞĀĂĄĆĈĊČĎĐĒĔĖĘĚĜĞĠĢĤĦĨĪĬĮİĲĴĶĹĻĽĿŁŃŅŇŊŌŎŐŒŔŖŘŚŜŞŠŢŤŦŨŪŬŮŰŲŴŶŸ-ŹŻŽƁ-ƂƄƆ-ƇƉ-ƋƎ-ƑƓ-ƔƖ-ƘƜ-ƝƟ-ƠƢƤƦ-ƧƩƬƮ-ƯƱ-ƳƵƷ-ƸƼǄǇǊǍǏǑǓǕǗǙǛǞǠǢǤǦǨǪǬǮǱǴǶ-ǸǺǼǾȀȂȄȆȈȊȌȎȐȒȔȖȘȚȜȞȠȢȤȦȨȪȬȮȰȲȺ-ȻȽ-ȾɁɃ-ɆɈɊɌɎͰͲͶΆΈ-ΊΌΎ-ΏΑ-ΡΣ-ΫϏϒ-ϔϘϚϜϞϠϢϤϦϨϪϬϮϴϷϹ-ϺϽ-ЯѠѢѤѦѨѪѬѮѰѲѴѶѸѺѼѾҀҊҌҎҐҒҔҖҘҚҜҞҠҢҤҦҨҪҬҮҰҲҴҶҸҺҼҾӀ-ӁӃӅӇӉӋӍӐӒӔӖӘӚӜӞӠӢӤӦӨӪӬӮӰӲӴӶӸӺӼӾԀԂԄԆԈԊԌԎԐԒԔԖԘԚԜԞԠԢԱ-Ֆ֊־٠-٩۰-۹߀-߉०-९০-৯੦-੯૦-૯୦-୯௦-௯౦-౯೦-೯൦-൯๐-๙໐-໙༠-༩၀-၉႐-႙Ⴀ-Ⴥ០-៩᠆᠐-᠙᥆-᥏᧐-᧙᭐-᭙᮰-᮹᱀-᱉᱐-᱙ḀḂḄḆḈḊḌḎḐḒḔḖḘḚḜḞḠḢḤḦḨḪḬḮḰḲḴḶḸḺḼḾṀṂṄṆṈṊṌṎṐṒṔṖṘṚṜṞṠṢṤṦṨṪṬṮṰṲṴṶṸṺṼṾẀẂẄẆẈẊẌẎẐẒẔẞẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼẾỀỂỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰỲỴỶỸỺỼỾἈ-ἏἘ-ἝἨ-ἯἸ-ἿὈ-ὍὙὛὝὟὨ-ὯᾸ-ΆῈ-ΉῘ-ΊῨ-ῬῸ-Ώ‐-―ℂℇℋ-ℍℐ-ℒℕℙ-ℝℤΩℨK-ℭℰ-ℳℾ-ℿⅅↃⰀ-ⰮⱠⱢ-ⱤⱧⱩⱫⱭ-ⱯⱲⱵⲀⲂⲄⲆⲈⲊⲌⲎⲐⲒⲔⲖⲘⲚⲜⲞⲠⲢⲤⲦⲨⲪⲬⲮⲰⲲⲴⲶⲸⲺⲼⲾⳀⳂⳄⳆⳈⳊⳌⳎⳐⳒⳔⳖⳘⳚⳜⳞⳠⳢ⸗⸚〜〰゠꘠-꘩ꙀꙂꙄꙆꙈꙊꙌꙎꙐꙒꙔꙖꙘꙚꙜꙞꙢꙤꙦꙨꙪꙬꚀꚂꚄꚆꚈꚊꚌꚎꚐꚒꚔꚖꜢꜤꜦꜨꜪꜬꜮꜲꜴꜶꜸꜺꜼꜾꝀꝂꝄꝆꝈꝊꝌꝎꝐꝒꝔꝖꝘꝚꝜꝞꝠꝢꝤꝦꝨꝪꝬꝮꝹꝻꝽ-ꝾꞀꞂꞄꞆꞋ꣐-꣙꤀-꤉꩐-꩙︱-︲﹘﹣－０-９Ａ-Ｚ]|\ud801[\udc00-\udc27\udca0-\udca9]|\ud835[\udc00-\udc19\udc34-\udc4d\udc68-\udc81\udc9c\udc9e-\udc9f\udca2\udca5-\udca6\udca9-\udcac\udcae-\udcb5\udcd0-\udce9\udd04-\udd05\udd07-\udd0a\udd0d-\udd14\udd16-\udd1c\udd38-\udd39\udd3b-\udd3e\udd40-\udd44\udd46\udd4a-\udd50\udd6c-\udd85\udda0-\uddb9\uddd4-\udded\ude08-\ude21\ude3c-\ude55\ude70-\ude89\udea8-\udec0\udee2-\udefa\udf1c-\udf34\udf56-\udf6e\udf90-\udfa8\udfca\udfce-\udfff]){2,}", 'g');
NOVA.css.push({
'text-transform': 'uppercase',
}, VIDEO_TITLE_SELECTOR.map(e => `${e}[${ATTR_MARK}]::first-letter`), 'important');
NOVA.watchElements({
selectors: VIDEO_TITLE_SELECTOR,
attr_mark: ATTR_MARK,
callback: async videoTitleEl => {
if (NOVA.currentPage == 'results') return;
let countCaps = 0;
if (user_settings.thumbs_title_clear_emoji) {
videoTitleEl.textContent = clearOfEmoji(videoTitleEl.innerText).trim();
}
if (user_settings.thumbs_title_clear_symbols) {
videoTitleEl.textContent = clearOfSymbols(videoTitleEl.innerText).trim();
}
const normalizedText = videoTitleEl.innerText.replace(UpperCaseLetterRegex, match => {
++countCaps;
return (
/\d/.test(match)
|| (match.length === 1 && /[A-Z]/.test(match))
|| (match.length < 5 && match.length > 1 && ['HD', 'UHD', 'USB', 'TV', 'CPU', 'GPU', 'APU', 'AMD', 'XT', 'RX', 'GTX', 'RTX', 'GT', 'FX', 'SE', 'HP', 'SSD', 'RAM', 'PC', 'FPS', 'RDNA', 'FSR', 'DLSS', 'MSI', 'VR', 'GOTY', 'AAA', 'UI', 'BBC', 'WWE', 'OS', 'OP', 'ED', 'MV', 'PV', 'OST', 'NCS', 'BGM', 'EDM', 'GMV', 'AMV', 'MMD', 'MAD', 'SQL', 'CAPS'].includes(match))
|| (match.length < 5 && /(M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3}))/i.test(match))
) ? match : match.toLowerCase();
});
if (countCaps > MAX_CAPS_LETTERS
|| (countCaps > 1 && normalizedText.split(/\s+/).length === countCaps)
) {
videoTitleEl.innerText = normalizedText;
}
}
});
document.addEventListener('yt-action', evt => {
if (evt.detail?.actionName == 'yt-chip-cloud-chip-select-action') {
window.addEventListener('transitionend', restoreTitle, { capture: true, once: true });
}
});
function restoreTitle() {
const selectorOldTitle = '#video-title-link[title]';
if (NOVA.channelTab == 'videos') {
document.body.querySelectorAll(`${selectorOldTitle} ${VIDEO_TITLE_SELECTOR}[${ATTR_MARK}]`)
.forEach(el => {
if (oldTitle = el.closest(selectorOldTitle)?.title) {
el.innerText = oldTitle;
el.removeAttribute(ATTR_MARK);
}
});
}
}
},
options: {
thumbs_title_show_full: {
_tagName: 'input',
label: 'Show full title',
'label:zh': '显示完整标题',
'label:ja': '完全なタイトルを表示',
'label:pl': 'Pokaż pełny tytuł',
type: 'checkbox'
},
thumbs_title_normalize_smart_max_words: {
_tagName: 'input',
label: 'Max words in uppercase',
'label:zh': '大写字数上限',
'label:ja': '大文字の最大単語数',
'label:pl': 'Maksymalna liczba słów pisanych wielkimi literami',
type: 'number',
placeholder: '1-10',
min: 1,
max: 10,
value: 2,
},
thumbs_title_clear_emoji: {
_tagName: 'input',
label: 'Remove emoji',
'label:zh': '从表情符号中清除标题',
'label:ja': 'クリア絵文字',
'label:pl': 'Usuń emoji',
type: 'checkbox',
},
thumbs_title_clear_symbols: {
_tagName: 'input',
label: 'Remove symbols',
type: 'checkbox',
},
}
});
window.nova_plugins.push({
id: 'thumbs-grid-count',
title: 'Thumbnails count in row',
run_on_pages: 'feed, channel, -mobile',
section: 'thumbs',
_runtime: user_settings => {
const
MathMin_orig = Math.min,
addRowCount = +user_settings.thumbs_grid_count || 1;
Math.min = function () {
return MathMin_orig.apply(Math, arguments)
+ (/calcElementsPerRow/img.test(Error().stack || '') ? addRowCount - 1 : 0);
};
},
options: {
thumbs_grid_count: {
_tagName: 'input',
label: 'Add to row',
type: 'number',
placeholder: '1-10',
step: 1,
min: 1,
max: 10,
value: 1,
},
}
});
window.nova_plugins.push({
id: 'thumbs-watch-later',
title: 'Add "Watch Later" button on thumbnails (for feed page)',
run_on_pages: 'feed, -mobile',
section: 'thumbs',
desc: 'You must be logged in',
_runtime: user_settings => {
const
SELECTOR_OVERLAY_ID_NAME = 'nova-thumb-overlay',
SELECTOR_CLASS_NAME = 'nova-thumbs-watch-later-btn',
thumbsSelectors = [
'ytd-rich-item-renderer',
'ytd-compact-video-renderer',
'yt-append-continuation-items-action',
'ytm-compact-video-renderer',
'ytm-item-section-renderer'
]
.map(i => `${i}:not(.${SELECTOR_CLASS_NAME})`)
.join(',');
document.addEventListener('yt-action', evt => {
switch (evt.detail?.actionName) {
case 'yt-append-continuation-items-action':
case 'ytd-update-grid-state-action':
case 'yt-rich-grid-layout-refreshed':
case 'yt-store-grafted-ve-action':
switch (NOVA.currentPage) {
case 'feed':
document.body.querySelectorAll(thumbsSelectors)
.forEach(thumb => {
thumb.classList.add(SELECTOR_CLASS_NAME);
if (container = thumb.querySelector('a#thumbnail.ytd-thumbnail')) {
const div = document.createElement('div');
div.id = SELECTOR_OVERLAY_ID_NAME;
div.append(renderButton(thumb));
container.append(div);
}
});
break;
}
break;
}
});
NOVA.css.push(
`#${SELECTOR_OVERLAY_ID_NAME} {
position: absolute;
top: 0;
left: 0;
z-index: 999;
}
button.${SELECTOR_CLASS_NAME} {
border: 0;
cursor: pointer;
height: 1.3em;
font-size: 2em;
background-color: transparent;
background-color: var(--yt-spec-static-overlay-background-heavy);
color: var(--yt-spec-static-overlay-text-primary);
}`);
function renderButton(thumb = required()) {
const btn = document.createElement('button');
btn.className = SELECTOR_CLASS_NAME;
btn.innerHTML =
`<svg viewBox="0 0 24 24" height="100%" width="100%">
<g fill="currentColor">
<path d="M14.97 16.95 10 13.87V7h2v5.76l4.03 2.49-1.06 1.7zM12 3c-4.96 0-9 4.04-9 9s4.04 9 9 9 9-4.04 9-9-4.04-9-9-9m0-1c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z" />
</g>
</svg>`;
btn.title = 'Watch Later';
btn.addEventListener('click', async evt => {
evt.preventDefault();
evt.stopPropagation();
evt.stopImmediatePropagation();
if (menu = thumb.querySelector('#menu button')) {
menu.click();
await NOVA.waitSelector('#menu [menu-active]', { container: thumb, destroy_after_page_leaving: true });
if (menuItemEl = document.body.querySelector('tp-yt-iron-dropdown [role="menuitem"]:has(path[d^="M14.97"])')) {
menuItemEl.style.backgroundColor = 'red';
await menuItemEl.click();
menuItemEl.style.removeProperty('backgroundColor');
}
document.body.click();
}
});
return btn;
}
},
});
window.nova_plugins.push({
id: 'thumbs-watched',
title: 'Mark watched thumbnails',
'title:zh': '标记您观看的缩略图',
'title:ja': '視聴したサムネイルにマークを付ける',
'title:pl': 'Oznacz obejrzane miniaturki',
run_on_pages: 'home, results, feed, channel, playlist, watch, -mobile',
section: 'thumbs',
_runtime: user_settings => {
NOVA.css.push(
`a#thumbnail,
a[class*="thumbnail"] {
outline: 1px solid var(--yt-spec-general-background-a);
}
a#thumbnail:visited,
a[class*="thumbnail"]:visited {
outline: 1px solid ${user_settings.thumbs_watched_frame_color || 'red'} !important;
}
ytd-playlist-panel-video-renderer a:visited #meta * {
color: ${user_settings.thumbs_watched_title_color || '#ff4500'} !important;
}`);
if (user_settings.thumbs_watched_title) {
NOVA.css.push(
`a#video-title:visited:not(:hover),
#description a:visited {
color: ${user_settings.thumbs_watched_title_color} !important;
}`);
}
},
options: {
thumbs_watched_frame_color: {
_tagName: 'input',
label: 'Frame color',
'label:zh': '框架颜色',
'label:ja': 'フレームカラー',
'label:pl': 'Kolor ramki',
type: 'color',
value: '#FF0000',
},
thumbs_watched_title: {
_tagName: 'input',
label: 'Set title color',
'label:zh': '您要更改标题颜色吗？',
'label:ja': 'タイトルの色を変更しますか？',
'label:pl': 'Ustaw kolor tytułu',
type: 'checkbox',
},
thumbs_watched_title_color: {
_tagName: 'input',
label: 'Choose title color',
'label:zh': '选择标题颜色',
'label:ja': 'タイトルの色を選択',
'label:pl': 'Wybierz kolor tytułu',
type: 'color',
value: '#ff4500',
'data-dependent': { 'thumbs_watched_title': true },
},
}
});
window.nova_plugins.push({
id: 'search-filter',
title: 'Blocked channels',
'title:zh': '屏蔽频道列表',
'title:ja': 'ブロックされたチャネルのリスト',
'title:pl': 'Zablokowane kanały',
run_on_pages: 'results, feed, -mobile',
section: 'thumbs',
desc: 'Hide channels on the search page',
'desc:zh': '在搜索页面上隐藏频道',
'desc:ja': '検索ページでチャンネルを非表示にする',
'desc:pl': 'Ukryj kanały na stronie wyszukiwania',
_runtime: user_settings => {
const BLOCK_KEYWORDS = NOVA.strToArray(user_settings.search_filter_channels_blocklist?.toLowerCase());
const thumbsSelectors = [
'ytd-rich-item-renderer',
'ytd-video-renderer',
'ytd-playlist-renderer',
'ytm-compact-video-renderer',
]
.join(',');
if (NOVA.isMobile) {
NOVA.watchElements({
selectors: ['#channel-name'],
attr_mark: 'nova-thumb-channel-filtered',
callback: channel_name => {
if (BLOCK_KEYWORDS.includes(channel_name.textContent.trim().toLowerCase())
&& (thumb = channel_name.closest(thumbsSelectors))
) {
thumb.remove();
}
}
});
}
else {
document.addEventListener('yt-action', evt => {
switch (evt.detail?.actionName) {
case 'yt-append-continuation-items-action':
case 'ytd-update-grid-state-action':
case 'yt-rich-grid-layout-refreshed':
case 'yt-store-grafted-ve-action':
document.body.querySelectorAll(
'#channel-name a[href]:first-child'
)
.forEach(channel_name => {
BLOCK_KEYWORDS.forEach(keyword => {
if (keyword.startsWith('@')
&& channel_name.href.includes(keyword)
&& (thumb = channel_name.closest(thumbsSelectors))
) {
thumb.remove();
}
else if ((channel_name.textContent.trim().toLowerCase() == keyword)
&& (thumb = channel_name.closest(thumbsSelectors))
) {
thumb.style.display = 'none';
}
});
});
break;
}
});
if (typeof GM_info === 'object') {
NOVA.waitSelector('tp-yt-iron-dropdown:not([aria-hidden="true"]) ytd-menu-popup-renderer[slot="dropdown-content"] [role="menuitem"]')
.then(container => {
const btn = document.createElement('div');
btn.classList = 'style-scope ytd-menu-service-item-renderer';
Object.assign(btn.style, {
'font-size': '14px',
padding: '9px 15px 9px 56px',
cursor: 'pointer',
});
btn.innerHTML = '<b>Nova block channel</b>';
btn.title = 'Nova block channel';
btn.addEventListener('click', () => {
const currentCannelName = document.querySelector('#menu [menu-active]')
.closest('#details, #meta')
.querySelector('#channel-name a')?.textContent;
if (currentCannelName && confirm(`Add channel [${currentCannelName}] to the blacklist?`)) {
user_settings.search_filter_channels_blocklist += '\n' + currentCannelName;
GM_setValue(configStoreName, user_settings);
}
});
container.after(btn);
});
}
}
},
options: {
search_filter_channels_blocklist: {
_tagName: 'textarea',
label: 'List',
'label:zh': '频道列表',
'label:ja': 'チャンネルリスト',
'label:pl': 'Lista',
title: 'separator: "," or ";" or "new line"',
'title:zh': '分隔器： "," 或 ";" 或 "新队"',
'title:ja': 'セパレータ： "," または ";" または "改行"',
'title:pl': 'separator: "," lub ";" lub "now linia"',
placeholder: 'channel1\nchannel2',
required: true,
},
}
});
window.nova_plugins.push({
id: 'thumbs-title-filter',
title: 'Block thumbnails by title',
'title:zh': '按标题阻止缩略图',
'title:ja': 'タイトルでサムネイルをブロックする',
'title:pl': 'Blokuj miniatury według tytułu',
run_on_pages: '*, -embed, -mobile, -live_chat',
section: 'thumbs',
_runtime: user_settings => {
const BLOCK_KEYWORDS = NOVA.strToArray(user_settings.thumbs_filter_title_blocklist?.toLowerCase());
const thumbsSelectors = [
'ytd-rich-item-renderer',
'ytd-video-renderer',
'ytd-playlist-renderer',
'ytd-compact-video-renderer',
'yt-append-continuation-items-action',
'ytm-compact-video-renderer',
'ytm-item-section-renderer'
]
.join(',');
if (NOVA.isMobile) {
NOVA.watchElements({
selectors: ['#video-title:not(:empty)'],
attr_mark: 'nova-thumb-title-filtered',
callback: video_title => {
BLOCK_KEYWORDS.forEach(keyword => {
if (video_title.textContent.trim().toLowerCase().includes(keyword)
&& (thumb = channel_name.closest(thumbsSelectors))
) {
}
});
}
});
}
else {
document.addEventListener('yt-action', evt => {
switch (evt.detail?.actionName) {
case 'yt-append-continuation-items-action':
case 'ytd-update-grid-state-action':
case 'yt-rich-grid-layout-refreshed':
case 'yt-store-grafted-ve-action':
hideThumb();
break;
}
});
function hideThumb() {
document.body.querySelectorAll('#video-title')
.forEach(titleEl => {
BLOCK_KEYWORDS.forEach(keyword => {
if (titleEl.textContent.toLowerCase().includes(keyword)
&& (thumb = titleEl.closest(thumbsSelectors))
) {
thumb.remove();
}
});
});
}
}
},
options: {
thumbs_filter_title_blocklist: {
_tagName: 'textarea',
label: 'Words list',
'label:zh': '单词列表',
'label:ja': '単語リスト',
'label:pl': 'Lista słów',
title: 'separator: "," or ";" or "new line"',
'title:zh': '分隔器： "," 或 ";" 或 "新队"',
'title:ja': 'セパレータ： "," または ";" または "改行"',
'title:pl': 'separator: "," lub ";" lub "now linia"',
placeholder: 'text1\ntext2',
required: true,
},
}
});
window.nova_plugins.push({
id: 'thumbs-not-interested',
title: 'Add "Not Interested" button on thumbnails',
run_on_pages: 'feed, channel, watch, -mobile',
section: 'thumbs',
desc: 'You must be logged in',
_runtime: user_settings => {
const
SELECTOR_OVERLAY_ID_NAME = 'nova-thumb-overlay',
SELECTOR_CLASS_NAME = 'nova-thumbs-not-interested-btn',
thumbsSelectors = [
'ytd-rich-item-renderer',
'ytd-compact-video-renderer',
'yt-append-continuation-items-action',
'ytm-compact-video-renderer',
'ytm-item-section-renderer'
]
.map(i => `${i}:not(.${SELECTOR_CLASS_NAME})`)
.join(',');
document.addEventListener('yt-action', evt => {
switch (evt.detail?.actionName) {
case 'yt-append-continuation-items-action':
case 'ytd-update-grid-state-action':
case 'yt-rich-grid-layout-refreshed':
case 'yt-store-grafted-ve-action':
case 'yt-forward-redux-action-to-live-chat-iframe':
switch (NOVA.currentPage) {
case 'feed':
case 'watch':
document.body.querySelectorAll(thumbsSelectors)
.forEach(thumb => {
thumb.classList.add(SELECTOR_CLASS_NAME);
if (container = thumb.querySelector('a#thumbnail.ytd-thumbnail')) {
if (user_settings['thumbs-watch-later']) {
NOVA.waitSelector(`#${SELECTOR_OVERLAY_ID_NAME}`, { 'container': container })
.then(container => {
container.append(renderButton(thumb));
});
}
else {
const div = document.createElement('div');
div.id = SELECTOR_OVERLAY_ID_NAME;
div.append(renderButton(thumb));
container.append(div);
}
}
});
break;
}
break;
}
});
if (!user_settings['thumbs-watch-later']) {
NOVA.css.push(
`#${SELECTOR_OVERLAY_ID_NAME} {
position: absolute;
top: 0;
left: 0;
z-index: 999;
}`);
}
NOVA.css.push(
`button.${SELECTOR_CLASS_NAME} {
border: 0;
cursor: pointer;
height: 1.3em;
font-size: 2em;
background-color: transparent;
background-color: var(--yt-spec-static-overlay-background-heavy);
color: var(--yt-spec-static-overlay-text-primary);
}`);
function renderButton(thumb = required()) {
const btn = document.createElement('button');
btn.className = SELECTOR_CLASS_NAME;
btn.innerHTML =
`<svg viewBox="0 0 24 24" height="100%" width="100%">
<g fill="currentColor">
<path d="M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zM3 12c0 2.31.87 4.41 2.29 6L18 5.29C16.41 3.87 14.31 3 12 3c-4.97 0-9 4.03-9 9zm15.71-6L6 18.71C7.59 20.13 9.69 21 12 21c4.97 0 9-4.03 9-9 0-2.31-.87-4.41-2.29-6z" />
</g>
</svg>`;
btn.title = 'Not Interested';
btn.addEventListener('click', async evt => {
evt.preventDefault();
evt.stopPropagation();
evt.stopImmediatePropagation();
if (menu = thumb.querySelector('#menu button')) {
menu.click();
await NOVA.waitSelector('#menu [menu-active]', { container: thumb, destroy_after_page_leaving: true });
if (menuItemEl = document.body.querySelector('tp-yt-iron-dropdown [role="menuitem"]:has(path[d^="M12 2c5.52"])')) {
menuItemEl.style.backgroundColor = 'red';
await menuItemEl.click();
menuItemEl.style.removeProperty('backgroundColor');
}
}
});
return btn;
}
},
});
window.nova_plugins.push({
id: 'thumbs-title-lang',
title: "Show titles original language",
'title:zh': '显示缩略图标题原始语言',
'title:ja': 'サムネイルのタイトルを元の言語で表示する',
run_on_pages: 'feed, channel, watch',
section: 'thumbs',
opt_api_key_warn: true,
'plugins-conflict': 'thumbs-title-normalize',
_runtime: user_settings => {
const
CACHE_NAME = 'thumbs-title',
SELECTOR_THUMBS_PATCHED_ATTR = 'nova-thumbs-title-lang',
thumbsSelectors = [
'ytd-rich-item-renderer',
'ytd-compact-video-renderer',
'yt-append-continuation-items-action',
'ytm-compact-video-renderer',
'ytm-item-section-renderer'
]
.map(i => `${i}:has(a#thumbnail[${SELECTOR_THUMBS_PATCHED_ATTR}][href*="%id%"]) #video-title`)
.join(',');
NOVA.css.push(
`#video-title[${SELECTOR_THUMBS_PATCHED_ATTR}] {
color: #86d2ed
}
*:hover > #video-title[${SELECTOR_THUMBS_PATCHED_ATTR}],
*:not(:hover) > #video-title[${SELECTOR_THUMBS_PATCHED_ATTR}] + #video-title {
display: none !important;
}`);
let
idsToProcess = [],
newCacheItem = {},
timeout;
NOVA.watchElements({
selectors: 'a#thumbnail[href].ytd-thumbnail',
attr_mark: SELECTOR_THUMBS_PATCHED_ATTR,
callback: thumbnail => {
if (id = NOVA.queryURL.get('v', thumbnail.href)) {
idsToProcess.push(id);
run_process();
}
},
});
function run_process(sec = 1) {
clearTimeout(timeout);
timeout = setTimeout(() => {
refreshCache(newCacheItem);
patchThumbs(idsToProcess);
}, 1000 * sec);
}
function patchThumbs(ids = []) {
if (!ids.length) return;
idsToProcess = [];
const cacheData = JSON.parse(sessionStorage.getItem(CACHE_NAME));
const newIds = ids
.filter(id => {
if (cacheData?.hasOwnProperty(id)) {
if (cacheItem = cacheData[id]) {
patchTitle({ 'id': id, 'text': cacheItem.text });
return false;
}
}
return true;
});
requestTitle(newIds);
}
function refreshCache(new_cache = {}) {
newCacheItem = {};
const cacheData = JSON.parse(sessionStorage.getItem(CACHE_NAME)) || {};
sessionStorage.setItem(CACHE_NAME, JSON.stringify(Object.assign(new_cache, cacheData)));
}
function requestTitle(ids = []) {
const YOUTUBE_API_MAX_IDS_PER_CALL = 50;
chunkArray(ids, YOUTUBE_API_MAX_IDS_PER_CALL)
.forEach(id_part => {
NOVA.request.API({
request: 'videos',
params: { 'id': id_part.join(','), 'part': 'snippet' },
api_key: user_settings['user-api-key'],
})
.then(res => {
res?.items?.forEach(item => {
patchTitle({ 'id': item.id, 'text': item.snippet.title });
newCacheItem[item.id] = { 'text': item.snippet.title };
});
run_process(3);
});
});
function chunkArray(array = [], size = 0) {
let chunked = [];
while (array.length) chunked.push(array.splice(0, +size));
return chunked;
}
}
function patchTitle({ id = required(), text = required() }) {
document.querySelectorAll(thumbsSelectors.replaceAll('%id%', id))
.forEach(videoTitleEl => {
if (videoTitleEl.textContent?.trim() == text) return;
const newTitleEl = videoTitleEl.cloneNode(true);
videoTitleEl.before(newTitleEl);
newTitleEl.setAttribute(SELECTOR_THUMBS_PATCHED_ATTR, true);
newTitleEl.textContent = text;
});
}
},
});
const Plugins = {
run: ({ user_settings, app_ver }) => {
if (!window.nova_plugins?.length) return console.error('nova_plugins empty', window.nova_plugins);
if (!user_settings) return console.error('user_settings empty', user_settings);
NOVA.currentPage = (function () {
const
pathnameArray = location.pathname.split('/').filter(Boolean),
{ page, channelTab } = identifyCurrentPage(pathnameArray[0], pathnameArray.pop());
NOVA.channelTab = channelTab;
return page;
})();
NOVA.isMobile = location.host == 'm.youtube.com';
let logTableArray = [],
logTableStatus,
logTableTime;
window.nova_plugins?.forEach(plugin => {
const pagesAllowList = plugin?.run_on_pages?.split(',').map(p => p.trim().toLowerCase()).filter(Boolean);
logTableTime = 0;
logTableStatus = false;
if (!pluginChecker(plugin)) {
console.error('Plugin invalid\n', plugin);
alert('Plugin invalid: ' + plugin?.id);
logTableStatus = 'INVALID';
}
else if (plugin.was_init && !plugin.restart_on_location_change) {
logTableStatus = 'skiped';
}
else if (!user_settings.hasOwnProperty(plugin.id)) {
logTableStatus = 'off';
}
else if (
(
pagesAllowList?.includes(NOVA.currentPage)
|| (pagesAllowList?.includes('*') && !pagesAllowList?.includes('-' + NOVA.currentPage))
)
&& (!NOVA.isMobile || (NOVA.isMobile && !pagesAllowList?.includes('-mobile')))
) {
try {
const startTableTime = performance.now();
plugin.was_init = true;
plugin._runtime(user_settings);
logTableTime = (performance.now() - startTableTime).toFixed(2);
logTableStatus = true;
} catch (err) {
console.groupEnd('plugins status');
console.error(`[ERROR PLUGIN] ${plugin.id}\n${err.stack}\n\nPlease report the bug: https://github.com/raingart/Nova-YouTube-extension/issues/new?body=` + encodeURIComponent(app_ver + ' | ' + navigator.userAgent)) + '&labels=bug&template=bug_report.md&title=pluginRunErr';
if (user_settings.report_issues) {
_pluginsCaptureException({
'trace_name': plugin.id,
'err_stack': err.stack,
'app_ver': app_ver,
'confirm_msg': `ERROR in Nova YouTube™\n\nCrash plugin: "${plugin.title || plugin.id}"\nPlease report the bug or disable the plugin\n\nSend the bug report to developer?`,
});
}
console.groupCollapsed('plugins status');
logTableStatus = 'ERROR';
}
}
logTableArray.push({
'launched': logTableStatus,
'name': plugin?.id,
'time init (ms)': logTableTime,
});
});
console.table(logTableArray);
console.groupEnd('plugins status');
function identifyCurrentPage(page = 'home', channel_tab) {
switch (page) {
case '': page = 'home'; break;
case 'live_chat':
case 'live_chat_replay':
page = 'live_chat'; break;
case 'channel':
case 'c':
case 'user':
page = 'channel';
break;
case 'watch':
case 'clip':
page = 'watch';
break;
default:
if (page?.startsWith('@')
|| /[A-Z\d_]/.test(page)
) {
page = 'channel';
}
break;
}
switch (channel_tab) {
case 'featured':
case 'videos':
case 'shorts':
case 'streams':
case 'podcasts':
case 'releases':
case 'playlists':
case 'community':
case 'channels':
case 'about':
case 'search':
page = 'channel';
channel_tab = channel_tab;
break;
default:
if (channel_tab?.startsWith('UC')) page = 'channel';
channel_tab = false;
break;
}
return {
'page': page,
'channelTab': channel_tab,
};
}
function pluginChecker(plugin) {
const result = plugin?.id && plugin.run_on_pages && 'function' === typeof plugin._runtime;
if (!result) {
console.error('plugin invalid:\n', {
'id': plugin?.id,
'run_on_pages': plugin?.run_on_pages,
'_runtime': 'function' === typeof plugin?._runtime,
});
}
return result;
}
},
}
console.log('%c /• %s •/', 'color:#0096fa; font-weight:bold;', GM_info.script.name + ' v.' + GM_info.script.version);
const
configPage = 'https://raingart.github.io/options.html',
configStoreName = 'user_settings',
user_settings = GM_getValue(configStoreName, null);
if (user_settings?.exclude_iframe && (window.self !== window.top)) {
return console.warn(GM_info.script.name + ': processed in the iframe disable');
}
registerMenuCommand();
if (location.hostname === new URL(configPage).hostname) setupConfigPage();
else {
if ((window.self !== window.top)
&& (!location.pathname.startsWith('/embed') && !location.pathname.startsWith('/live_chat'))
) {
return console.warn('iframe skiped:', location.pathname);
}
if (!user_settings?.disable_setting_button) insertSettingButton();
if (!user_settings || !Object.keys(user_settings).length) {
if (confirm('Active plugins undetected. Open the settings page now?')) window.open(configPage, '_blank');
user_settings['report_issues'] = 'on';
GM_setValue(configStoreName, user_settings);
}
else {
appLander();
const exportedSettings = Object.assign({}, user_settings);
delete exportedSettings['user-api-key'];
delete exportedSettings['sponsor_block'];
delete exportedSettings['sponsor_block_category'];
delete exportedSettings['sponsor_block_url'];
delete exportedSettings['thumbs_filter_title_blocklist'];
delete exportedSettings['search_filter_channels_blocklist'];
delete exportedSettings['thumbs_hide_live_channels_exception'];
delete exportedSettings['comments_sort_blocklist'];
delete exportedSettings['download_video_mode'];
delete exportedSettings['video_unblock_region_domain'];
unsafeWindow.window.nova_settings = exportedSettings;
}
}
function setupConfigPage() {
document.addEventListener('submit', event => {
event.preventDefault();
let obj = {};
for (const [key, value] of new FormData(event.target)) {
if (obj.hasOwnProperty(key)) {
obj[key] += ',' + value;
obj[key] = obj[key].split(',');
}
else {
switch (value) {
case 'true': obj[key] = true; break;
case 'false': obj[key] = false; break;
case 'undefined': delete obj[key]; break;
default: obj[key] = value;
}
};
}
console.debug(`update ${configStoreName}:`, obj);
GM_setValue(configStoreName, obj);
}, { capture: true });
window.addEventListener('DOMContentLoaded', () => {
localizePage(user_settings?.lang_code);
storeData = user_settings;
unsafeWindow.window.nova_plugins = window.nova_plugins;
});
window.addEventListener('load', () => {
document.body?.classList?.remove('preload');
document.body.querySelector('a[href$="issues/new"]')
.addEventListener('click', ({ target }) => {
target.href += '?body=' + encodeURIComponent(GM_info.script.version + ' | ' + navigator.userAgent) + '&labels=bug&template=bug_report.md';
});
});
}
function appLander() {
if (document.readyState == 'loading') {
document.addEventListener('DOMContentLoaded', appRun);
}
else {
appRun();
}
let prevURL = document.URL;
const isURLChanged = () => prevURL == document.URL ? false : prevURL = document.URL;
if (isMobile = (location.host == 'm.youtube.com')) {
window.addEventListener('transitionend', ({ target }) => target.id == 'progress' && isURLChanged() && appRun());
}
else {
document.addEventListener('yt-navigate-start', () => isURLChanged() && appRun());
document.addEventListener('yt-action', reloadAfterMiniplayer);
function reloadAfterMiniplayer(evt) {
if (location.pathname == '/watch'
&& (evt.detail?.actionName == 'yt-cache-miniplayer-page-action')
&& isURLChanged()
) {
document.removeEventListener('yt-action', reloadAfterMiniplayer);
appRun();
}
}
}
function appRun() {
console.groupCollapsed('plugins status');
Plugins.run({
'user_settings': user_settings,
'app_ver': GM_info.script.version,
});
}
}
function registerMenuCommand() {
GM_registerMenuCommand('Settings', () => window.open(configPage, '_blank'));
GM_registerMenuCommand('Import settings', () => {
if (json = JSON.parse(prompt('Enter json file context'))) {
saveImportSettings(json);
}
else if (confirm('Import via file?')) {
const f = document.createElement('input');
f.type = 'file';
f.accept = 'application/JSON';
f.style.display = 'none';
f.addEventListener('change', function () {
if (f.files.length !== 1) return alert('file empty');
const rdr = new FileReader();
rdr.addEventListener('load', function () {
try {
saveImportSettings(JSON.parse(rdr.result));
}
catch (err) {
alert(`Error parsing settings\n${err.name}: ${err.message}`);
}
});
rdr.addEventListener('error', error => alert('Error loading file\n' + rdr?.error || error));
rdr.readAsText(f.files[0]);
});
document.body.append(f);
f.click();
f.remove();
}
function saveImportSettings(json) {
GM_setValue(configStoreName, json);
renameStorageKeys({
'disable_in_frame': 'exclude_iframe',
'custom-api-key': 'user-api-key',
'shorts-disable': 'thumbs_hide_shorts',
'shorts_disable': 'thumbs_hide_shorts',
'premiere-disable': 'thumbs_hide_premieres',
'premieres-disable': 'thumbs_hide_premieres',
'premieres_disable': 'thumbs_hide_premieres',
'thumbs_min_duration': 'thumbs_hide_min_duration',
'shorts_disable_min_duration': 'thumbs_hide_min_duration',
'streams-disable': 'thumbs_hide_live',
'streams_disable': 'thumbs_hide_live',
'live_disable': 'thumbs_hide_live',
'thumbnails-mix-hide': 'thumbs_hide_mix',
'thumb_mix_disable': 'thumbs_hide_mix',
'mix_disable': 'thumbs_hide_mix',
'player_fullscreen_mode_exit': 'player_fullscreen_mode_onpause',
'subtitle-transparent': 'subtitle_transparent',
'video-description-expand': 'description-expand',
'video_quality_in_music': 'video_quality_in_music_playlist',
'player_float_progress_bar_color': 'player_progress_bar_color',
'header-short': 'header-compact',
'player-buttons-custom': 'player-quick-buttons',
'shorts_thumbnails_time': 'shorts-thumbnails-time',
'comments-sidebar-position-exchange': 'move-in-sidebar',
'comments_sidebar_position_exchange_target': 'move_in_sidebar_target',
'streamed_disable_channel_exception': 'thumbs_hide_live_channels_exception',
'streamed_disable_channels_exception': 'thumbs_hide_live_channels_exception',
'video_quality_in_music_quality': 'video_quality_for_music',
'volume_normalization': 'volume_loudness_normalization',
'button_no_labels_opacity': 'details_buttons_opacity',
'details_button_no_labels_opacity': 'details_buttons_opacity',
'button-no-labels': 'details_buttons_label_hide',
'details_button_no_labels': 'details_buttons_label_hide',
'volume-wheel': 'video-volume',
'rate-wheel': 'video-rate',
'video-stop-preload': 'video-autostop',
'stop_preload_ignore_playlist': 'video_autostop_ignore_playlist',
'stop_preload_ignore_live': 'video_autostop_ignore_live',
'stop_preload_embed': 'video_autostop_embed',
'disable-video-cards': 'pages-clear',
'volume_level_default': 'volume_default',
'thumb_filter_title_blocklist': 'thumbs_filter_title_blocklist',
'search_filter_channel_blocklist': 'search_filter_channels_blocklist',
'streamed_disable': 'thumbs_hide_streamed',
'watched_disable': 'thumbs_hide_watched',
'watched_disable_percent_complete': 'thumbs_hide_watched_percent_complete',
'sidebar-channel-links-patch': 'sidebar-thumbs-channel-link-patch',
'move-in-sidebar': 'move-to-sidebar',
'move_in_sidebar_target': 'move_to_sidebar_target',
'skip_into_step': 'skip_into_sec',
'miniplayer-disable': 'default-miniplayer-disable',
'thumbnails_title_normalize_show_full': 'thumbs_title_show_full',
'thumbnails_title_normalize_smart_max_words': 'thumbs_title_normalize_smart_max_words',
'thumbnails_title_clear_emoji': 'thumbs_title_clear_emoji',
'thumbnails_title_clear_symbols': 'thumbs_title_clear_symbols',
'thumbnails-clear': 'thumbs-clear',
'thumbnails_clear_preview_timestamp': 'thumbs_clear_preview_timestamp',
'thumbnails_clear_overlay': 'thumbs_clear_overlay',
'thumbnails-grid-count': 'thumbs-grid-count',
'thumbnails_grid_count': 'thumbs_grid_count',
'thumbnails-watched': 'thumbs-watched',
'thumbnails_watched_frame_color': 'thumbs_watched_frame_color',
'thumbnails_watched_title': 'thumbs_watched_title',
'thumbnails_watched_title_color': 'thumbs_watched_title_color',
'details-buttons': 'details-buttons-visibility',
'comments_sort_words_blocklist': 'comments_sort_blocklist',
'thumbnails-title-normalize': 'thumbs-title-normalize',
'time_remaining_mode': 'time_remaining_format',
});
alert('Settings imported!');
location.reload();
}
});
GM_registerMenuCommand('Export settings', () => {
const d = document.createElement('a');
d.style.display = 'none';
d.download = 'nova_backup.json';
d.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(user_settings));
document.body.append(d);
d.click();
d.remove();
});
}
function renameStorageKeys(key_template_obj = required()) {
let needSave;
for (const oldKey in user_settings) {
if (newKey = key_template_obj[oldKey]) {
console.log(oldKey, '=>', newKey);
needSave = true;
delete Object.assign(user_settings, { [newKey]: user_settings[oldKey] })[oldKey];
}
if (needSave) GM_setValue(configStoreName, user_settings);
}
}
function insertSettingButton() {
NOVA.waitSelector('#masthead #end')
.then(menu => {
const
titleMsg = 'Nova Settings',
a = document.createElement('a'),
SETTING_BTN_ID = 'nova_settings_button';
a.id = SETTING_BTN_ID;
a.href = configPage;
a.target = '_blank';
a.innerHTML =
`<yt-icon-button class="style-scope ytd-button-renderer style-default size-default">
<svg viewBox="-4 0 20 16">
<radialGradient id="nova-gradient" gradientUnits="userSpaceOnUse" cx="6" cy="22" r="18.5">
<stop class="nova-gradient-start" offset="0"/>
<stop class="nova-gradient-stop" offset="1"/>
</radialGradient>
<g fill="deepskyblue">
<polygon points="0,16 14,8 0,0"/>
</g>
</svg>
</yt-icon-button>`;
a.addEventListener('click', null, { capture: true });
a.title = titleMsg;
const tooltip = document.createElement('tp-yt-paper-tooltip');
tooltip.className = 'style-scope ytd-topbar-menu-button-renderer';
tooltip.textContent = titleMsg;
a.appendChild(tooltip);
NOVA.css.push(
`#${SETTING_BTN_ID}[tooltip]:hover:after {
position: absolute;
top: 50px;
transform: translateX(-50%);
content: attr(tooltip);
text-align: center;
min-width: 3em;
max-width: 21em;
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
padding: 1.8ch 1.2ch;
border-radius: .6ch;
background-color: #616161;
box-shadow: 0 1em 2em -0.5em rgb(0 0 0 / 35%);
color: white;
z-index: 1000;
}
#${SETTING_BTN_ID} {
position: relative;
opacity: .3;
transition: opacity 300ms ease-out;
}
#${SETTING_BTN_ID}:hover {
opacity: 1 !important;
}
#${SETTING_BTN_ID} path,
#${SETTING_BTN_ID} polygon {
fill: url(#nova-gradient);
}
#${SETTING_BTN_ID} .nova-gradient-start,
#${SETTING_BTN_ID} .nova-gradient-stop {
transition: 600ms;
stop-color: #7a7cbd;
}
#${SETTING_BTN_ID}:hover .nova-gradient-start {
stop-color: #0ff;
}
#${SETTING_BTN_ID}:hover .nova-gradient-stop {
stop-color: #0095ff;
}`);
menu.prepend(a);
});
}
function _pluginsCaptureException({ trace_name, err_stack, confirm_msg, app_ver }) {
if (confirm(confirm_msg || `Error in ${GM_info.script.name}. Send the bug raport to developer?`)) {
openBugReport();
}
function openBugReport() {
window.open(
'https://docs.google.com/forms/u/0/d/e/1FAIpQLScfpAvLoqWlD5fO3g-fRmj4aCeJP9ZkdzarWB8ge8oLpE5Cpg/viewform' +
'?entry.35504208=' + encodeURIComponent(trace_name) +
'&entry.151125768=' + encodeURIComponent(err_stack) +
'&entry.744404568=' + encodeURIComponent(document.URL) +
'&entry.1416921320=' + encodeURIComponent(app_ver + ' | ' + navigator.userAgent + ' [' + window.navigator.language + ']')
, '_blank');
}
}
user_settings.report_issues && window.addEventListener('unhandledrejection', err => {
if ((err.reason?.stack || err.stack)?.includes('Nova')
&& !((err.reason?.stack || err.stack)?.includes('movie_player is not defined'))
) {
console.error('[ERROR PROMISE]\n', err.reason, '\nPlease report the bug: https://github.com/raingart/Nova-YouTube-extension/issues/new?body=' + encodeURIComponent(GM_info.script.version + ' | ' + navigator.userAgent)) + '&labels=bug&template=bug_report.md&title=unhandledrejection';
_pluginsCaptureException({
'trace_name': 'unhandledRejection',
'err_stack': err.reason.stack || err.stack,
'app_ver': GM_info.script.version,
'confirm_msg': `Failure when async-call of one "${GM_info.script.name}" plugin.\nDetails in the console\n\nOpen tab to report the bug?`,
});
}
});
