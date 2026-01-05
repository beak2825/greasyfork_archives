// ==UserScript==
// @name        Bangumi Repost Status
// @namespace   org.upsuper.bangumi
// @include     /^http://(bangumi\.tv|bgm\.tv|chii\.in)/((user/[^/]+/)?timeline)?(\?.*)?$/
// @version     1.0
// @description 转发 Bangumi 时间线上的所有消息
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/667/Bangumi%20Repost%20Status.user.js
// @updateURL https://update.greasyfork.org/scripts/667/Bangumi%20Repost%20Status.meta.js
// ==/UserScript==

function $(id) { return document.getElementById(id); }
function $t(text) { return document.createTextNode(text); }

var $say = $('SayInput');
var $tmlContent = $('tmlContent');

function updateItem($li) {
  var $date = $li.getElementsByClassName('date')[0];
  $date.insertBefore($t(' · '), $date.firstChild);
  var $repost = document.createElement('a');
  $repost.href = 'javascript:void(0)';
  $repost.className = 'tml_comment l __u_repost';
  $repost.dataset.id = $li.id;
  $repost.textContent = '转发';
  $date.insertBefore($repost, $date.firstChild);
}

function updateTimeline() {
  var $ulList = document.querySelectorAll('#timeline>ul');
  for (var i = 0; i < $ulList.length; i++) {
    var $liList = $ulList[i].childNodes;
    for (var j = 0; j < $liList.length; j++)
      updateItem($liList[j]);
  }
}

function repostItem($li) {
  var $info = $li.getElementsByClassName('info')[0];
  var $div = document.createElement('div');
  $div.innerHTML = $info.innerHTML;

  $div.removeChild($div.getElementsByClassName('date')[0]);

  var $links = $div.getElementsByTagName('a');
  for (var i = 0; i < $links.length; i++) {
    var $link = $links[i];
    var match = $link.pathname.match(/^\/user\/([^\/]+)$/);
    if (match) {
      if ($link.textContent.trim())
        $link.textContent = '@' + match[1];
    }

    var $small = $link.getElementsByTagName('small')[0];
    if ($small)
      $link.removeChild($small);
  }

  var $sub = $div.getElementsByClassName('info_sub')[0];
  if ($sub) {
    if ($sub.getElementsByClassName('tip_j')[0])
      $sub.textContent = '';
    else
      $sub.textContent = '(' + $sub.textContent.trim() + ')';
  }

  var $quote = $div.getElementsByClassName('quote')[0];
  if ($quote)
    $quote.textContent = '『' + $quote.textContent.trim() + '』';

  var text = $div.textContent;
  text = text.replace(/\s+/g, ' ').trim();
  $say.value = '转' + text;
  $say.focus();
  $say.setSelectionRange(0, 0);
}

var dirty = false;
function markTimelineDirty() {
  if (!dirty) {
    dirty = true;
    setTimeout(function () {
      dirty = false;
      updateTimeline();
    }, 10);
  }
}

if ($tmlContent) {
  $tmlContent.addEventListener('DOMSubtreeModified', function (e) {
    if (e.target.id == 'tmlContent')
      markTimelineDirty();
  });
  $tmlContent.addEventListener('click', function (e) {
    if (e.target.classList.contains('__u_repost'))
      repostItem($(e.target.dataset.id));
  });
  markTimelineDirty();
}
