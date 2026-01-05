// ==UserScript==
// @name        贴吧提醒界面快速回复
// @namespace   
// @include     http://tieba.baidu.com/i/*/replyme
// @version     1.1
// @grant
// @description:zh-cn 直接在i贴吧里”回复我的“里边直接快速回复，回复快捷键：ctrl+回车或者alt+s
// @author      小血
// @description ss
// @downloadURL https://update.greasyfork.org/scripts/6247/%E8%B4%B4%E5%90%A7%E6%8F%90%E9%86%92%E7%95%8C%E9%9D%A2%E5%BF%AB%E9%80%9F%E5%9B%9E%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/6247/%E8%B4%B4%E5%90%A7%E6%8F%90%E9%86%92%E7%95%8C%E9%9D%A2%E5%BF%AB%E9%80%9F%E5%9B%9E%E5%A4%8D.meta.js
// ==/UserScript==
function reply(fid, tid, tbs, kw, pid, ct, $cDiv, oldUrl) {
  var postData = {
    anonymous: 0,
    content: ct,
    fid: fid,
    floor_num: 16,
    ie: 'utf-8',
    kw: kw,
    rich_text: 1,
    lp_sub_type: 0,
    lp_type: 0,
    new_vcode: 1,
    tbs: tbs,
    tid: tid,
    repostid: pid,
    quote_id: pid,
    tag: 11
  }
  //alert(JSON.stringify(postData))
  $.post('http://tieba.baidu.com/f/commit/post/add', postData, function (r) {
    r = JSON.parse(r);
    if (r.err_code == '0') {
      alertEx('回复成功', 2000);
      $cDiv.remove();
    } else if (r.data.vcode.str_reason == '请点击验证码完成发贴') {
      alertEx('回复失败:此次回复内容需要验证码，本脚本赞不支持验证码，需要到帖子页回复，点击关闭跳转至帖子页面', 0)
      $('#msgClose').attr('oldUrl', oldUrl);
    } else {
      alertEx( '回复失败:' + JSON.stringify(r), 0)
    }
  });
}
function alertEx(msg, time) {
  $('#msgContent').text(msg);
  $('#msgDiv').show();
  if (time > 0) {
    setTimeout(function () {
      $('#msgDiv').hide();
    }, time)
  }
}
$(document).ready(function () {
  var zz = '<div id=\'msgDiv\' style=\'display:none;width:100%;height:100%;background:rgba(0,0,0,0.5);position: fixed; top: 0; left: 0;z-index:999997\'>'
  zz += '<div style=\'height:0px; width:0px;top:50%; left:50%;position:fixed;\'>';
  zz += '<div style=\'background:rgb(242,242,242);border:1px solid #ddd; width:260px;height:100px;padding:20px 30px 20px 30px;position:absolute; margin:-150px;border-radius:6px;box-shadow: 0 0 10px #333;text-align:center\'>';
  zz += '<p id=\'msgContent\' style=\'width:100%;text-align:left;line-height:25px;min-height:60px;\'>'
  zz += '</p><span id=\'msgClose\' style=\'background:rgb(242,242,242);border:1px solid #555;color:#000;cursor:pointer;height:24px;text-align:center;width:51px;line-height:24px;display:block;margin:0 auto;\'>关闭</span></div></div></div>';
  $('body').append(zz);
  $('body').on('click', '#msgClose', function () {
    $('#msgDiv').hide();
    oldUrl = $(this).attr('oldUrl');
    if (typeof (oldUrl) != 'undefined' && oldUrl != '') {
      $(this).removeAttr('oldUrl');
      window.open(oldUrl);
    }
  })
  $('#feed .reply').find('a:last').each(function () {
    $(this).attr('target', '')
    $(this).attr('temp', $(this).attr('href'))
    $(this).attr('href', 'javascript:void(0)')
  })
  $('#feed').on('click', '.reply a[href=\'javascript:void(0)\']', function (e) {
    if ($(this).parent().parent().find('.qkContent').length > 0) {
      return;
    }
    temp = $(this).attr('temp');
    temp = temp.substring(temp.indexOf('pid=') + 4)
    if (temp.indexOf('&') != - 1) {
      temp = temp.substring(0, temp.indexOf('&'))
    } else {
      temp = temp.substring(0, temp.indexOf('#'))
    }
    var userName = $(this).parent().parent().parent().find('.replyme_user').text();
    var html = '<div class=\'qkContent\' style=\'text-align:center\'>';
    html += '<textarea style=\'width:90%;\'></textarea>';
    html += '<span class=\'qkSubmit\' pid=\'' + temp + '\' oldUrl=\'' + $(this).attr('temp') + '\' style=\'background:url("http://tb2.bdstatic.com/tb/static-pb/img/pb_css_pic_a630a08.png") no-repeat scroll -344px -7px rgba(0, 0, 0, 0);color:#fff;cursor:pointer;height:24px;text-align:center;width:51px;line-height:24px;float:right;\'>提交</span>'
    html += '</div>';
    $(this).parent().after(html);
    $(this).parent().next().find('textarea').focus().val('回复 ' + userName.substring(0, userName.length - 1) + ' :');
  });
  $('#feed').on('click', '.qkSubmit', function () {
    tempData = eval('(' + $(this).parent().prev().children(':first').attr('data-param') + ')');
    reply(tempData.fid, tempData.tid, tempData.tbs, tempData.kw, $(this).attr('pid'), $(this).prev().val(), $(this).parent(), $(this).attr('oldUrl'));
  })
  $('#feed').on('keydown', 'textarea', function (e) {
    if ((e.keyCode == 83 && e.altKey) || (e.ctrlKey && e.keyCode == 13)) {
      $(this).next().click();
      e.preventDefault();
      return false;
    }
  })
})
