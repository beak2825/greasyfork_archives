// ==UserScript==
// @name        网页文本转链接(双击版)
// @description 高性能文本转链接方案
// @version     1.0
// @author      WJ
// @match       *://*/*
// @license     MIT
// @grant       none
// @run-at      document-idle
// @namespace   https://greasyfork.org/users/914996
// @downloadURL https://update.greasyfork.org/scripts/548725/%E7%BD%91%E9%A1%B5%E6%96%87%E6%9C%AC%E8%BD%AC%E9%93%BE%E6%8E%A5%28%E5%8F%8C%E5%87%BB%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548725/%E7%BD%91%E9%A1%B5%E6%96%87%E6%9C%AC%E8%BD%AC%E9%93%BE%E6%8E%A5%28%E5%8F%8C%E5%87%BB%E7%89%88%29.meta.js
// ==/UserScript==

(() => {
  // 1. URL 正则
  const tlds = [
    'app','aero','aer','art','asia','beer','biz','cat','cc','chat','ci','cloud',
    'club','cn','com','cool','coop','co','dev','edu','email','fit','fun','gov',
    'group','hk','host','icu','info','ink','int','io','jobs','kim','love','ltd',
    'luxe','me','mil','mobi','moe','museum','name','net','nl','network','one',
    'online','org','plus','post','press','pro','red','ren','run','ru','shop',
    'site','si','space','store','tech','tel','top','travel','tv','tw','uk','us',
    'video','vip','wang','website','wiki','wml','work','ws','xin','xyz','yoga','zone'
  ].join('|');
  const urlRegex = new RegExp(
    String.raw`(?:(?:https?:\/\/)|(?:www\.|wap\.))[\w.:/?=%&#@+~-]{1,50}\.[\w]{2,15}\b[\w.:/?=%&#@+~-]*|`+
    String.raw`(?<!(https?:|@)\S*)\b[\w:.-]{1,50}\.(?:${tlds})\b[\w.:/?=%&#@+~-]*`,
    'gi'
  );

  // 2. 检查节点是否需处理
  const guard = root => root && !root.closest?.(`
    :is(a,applet,area,button,canvas,code,cite,embed,frame,frameset,head,video,form,
    iframe,img,input,map,meta,noscript,object,option,pre,script,select,style,svg,textarea),
    [contenteditable],.WJ_modal,.ace_editor,.CodeMirror,.monaco-editor,.cm-editor`);

  // 3. 点击处理节点
  document.addEventListener('dblclick', e => {
    const textNo = document.caretPositionFromPoint?.(e.clientX, e.clientY)?.offsetNode;
    const parent = textNo?.parentElement;
    if (parent.classList.contains('WJ-YDJ') || textNo?.nodeType !== 3 || !guard(e.target)) return;
    parent.classList.add('WJ-YDJ');
    const raw = textNo.textContent;
    if (!/\.\w{2,15}\b/g.test(raw)) return;
    const rawg = raw.replace(urlRegex, m =>
      `<a style="text-decoration:underline" href="${m.startsWith('http') ? m : 'https://' + m}">${m}</a>`);
    if (raw !== rawg) textNo.replaceWith(document.createRange().createContextualFragment(rawg))
  },true);
})();