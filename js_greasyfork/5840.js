// ==UserScript==
// @name           易玩通交易频顶处理插件
// @namespace      shirakawahotaru2
// @description    易玩通交易频顶处理插件 白河ほたる
// @include        http://bbs.polchina.com.cn/*
// @developer      白河ほたる
// @grant       GM_xmlhttpRequest
// @version 0.0.1.20141018064055
// @downloadURL https://update.greasyfork.org/scripts/5840/%E6%98%93%E7%8E%A9%E9%80%9A%E4%BA%A4%E6%98%93%E9%A2%91%E9%A1%B6%E5%A4%84%E7%90%86%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/5840/%E6%98%93%E7%8E%A9%E9%80%9A%E4%BA%A4%E6%98%93%E9%A2%91%E9%A1%B6%E5%A4%84%E7%90%86%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==
(function () {
  var log = function (arg) {
    unsafeWindow.console.log(arg);
  }
  function live(targetClass, UpCount, fn) { //元素类型，事件类型，执行函数  
    addListener(document, 'click', function (event) {
      var i = 0;
      var e = event ? event : window.event;
      var target = e.srcElement || e.target;
      while (target.className.indexOf(targetClass) == - 1 && i++ < UpCount) {
        target = target.parentNode;
      }
      if (target.className.indexOf(targetClass) > - 1) {
        fn.apply(target, [
        ]);
      }
    });
  }
  var Storage = {
    getValue: function (key, defaultVal) {
      var value = unsafeWindow.localStorage.getItem(key);
      if (value == null) {
        return defaultVal;
      } else {
        return value;
      }
    },
    setValue: function (key, value) {
      unsafeWindow.localStorage.setItem(key, value);
    },
    deleteValue: function (key) {
      unsafeWindow.localStorage.removeItem(key);
    }
  };
  var $ = function (id) {
    return document.getElementById(id);
  };
  var $tg = function (tgName) {
    return document.getElementsByTagName(tgName);
  };
  var $css = function (cssName) {
    return document.getElementsByClassName(cssName);
  };
  function addListener(element, e, fn) {
    element.addEventListener ? element.addEventListener(e, fn, false)  : element.attachEvent('on' + e, fn)
  };
  function removeListener(element, e, fn) {
    element.removeEventListener ? element.removeEventListener(e, fn, false)  : element.detachEvent('on' + e, fn)
  };
  var Bind = function (object, fun, args) {
    return function () {
      return fun.apply(object, args || []);
    }
  }
  if (window.location.toString().indexOf('tid=1614221') == - 1) {
    setTimeout(function () {
      things();
      setInterval(things, 30000);
      function things() {
        var ret = GM_xmlhttpRequest({
          method: 'GET',
          url: 'http://203.175.159.21:8089/last.php',
          onload: function (res) {
            var jsontext = JSON.parse(res.responseText);
            if (jsontext.result == 'succeed') {
              var f = '';
              if (parseInt(Storage.getValue('update_weigui2', 9999999999), 10) < parseInt(jsontext.id, 10)) {
                f = '<iframe src="http://203.175.159.21:8089/sound.html" style="overflow:hidden;height:0px;width:0px;border: 0px none;" ></iframe>';
              }
              Storage.setValue('update_weigui2', jsontext.id);
              $('ad_headerbanner').innerHTML = f + '<ul id="noty_topRight_layout_container" class="i-am-new" style="bottom: 20px; right: 20px; position: fixed; width: 310px; height: auto; margin: 0px; padding: 0px; list-style-type: none; z-index: 10000000;"><li style="overflow: hidden; background: url(&quot;data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAoCAYAAAAPOoFWAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAPZJREFUeNq81tsOgjAMANB2ov7/7ypaN7IlIwi9rGuT8QSc9EIDAsAznxvY4pXPKr05RUE5MEVB+TyWfCEl9LZApYopCmo9C4FKSMtYoI8Bwv79aQJU4l6hXXCZrQbokJEksxHo9KMOgc6w1atHXM8K9DVC7FQnJ0i8iK3QooGgbnyKgMDygBWyYFZoqx4qS27KqLZJjA1D0jK6QJcYEQEiWv9PGkTsbqxQ8oT+ZtZB6AkdsJnQDnMoHXHLGKOgDYuCWmYhEERCI5gaamW0bnHdA3k2ltlIN+2qKRyCND0bhqSYCyTB3CAOc4WusBEIpkeBuPgJMAAX8Hs1NfqHRgAAAABJRU5ErkJggg==&quot;) repeat-x scroll left top rgb(255, 255, 255); border-radius: 5px 5px 5px 5px; border: 1px solid rgb(204, 204, 204); box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1); color: rgb(68, 68, 68); width: 310px; cursor: pointer;" onclick=\'javascript:window.open("http://bbs.polchina.com.cn/viewthread.php?tid=1614221");\'><div class="noty_bar" id="noty_456082768825927040"><div class="noty_message" style="font-size: 13px; line-height: 16px; text-align: left; padding: 8px 10px 9px; width: auto; position: relative;"><img src="http://203.175.159.21:8089/clock.png"><span class="noty_text"><strong>&nbsp;交易区频顶助手</strong> <br><br> &nbsp;&nbsp;&nbsp;<font color="#444444"> 现仍有共计（<i style="color:red"><b>' + jsontext.count + '</b></i>）用户频顶违规未被处理</font></span></div></div></li></ul>';
            } else {
              $('ad_headerbanner').innerHTML = '';
            }
          }
        })
      }
    }, 0);
    return;
  }
  var user = $('umenu').getElementsByTagName('a') [0].innerHTML;
  try {
    $('f_post').innerHTML = '';
  } catch (e) {
  }
  setTimeout(function () {
    var ret = GM_xmlhttpRequest({
      method: 'GET',
      url: 'http://203.175.159.21:8089/serverstatus.php',
      onload: function (res) {
        var jsontext = JSON.parse(res.responseText);
        $('threadtitle').innerHTML = '<h1>魔力宝贝怀旧服交易区 ★ 频顶用户统计列表（' + jsontext.result + '）</h1>';
      }
    })
  }, 0);
  $css('modaction') [0].innerHTML = '';
  $css('modaction') [1].innerHTML = '';
  $css('modaction') [0].nextSibling.nextSibling.innerHTML = '';
  $css('pstatus') [0].innerHTML = '';
  $css('pagecontrol') [0].innerHTML = '<a id="Logwin" style="color:black;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAmFJREFUeNqkU0toU0EUPTN5eUmTl8TGfmykgqLSBopoiS4Uo6Rx04UKiqBCEUEQC2bhxq0Ld4IionEjrUHEjV2IC0VsiCgS6xdUqKWgNjWaNG0+fUneexlnTBNLjCA4cLh37sycOXPvHcIYw/8MqebcO2v6ZU2UwCqjnwB+Pu1cWk7ya6LFMiaMCmtOUBtckE9SPCd6dx/bk/iWahExz6o29cPjG70snbjOp/GmBGq5ThHcsmNo8NmjB5n3b56PiYh307YB386hwdid89ONBLTmyBJBToVANyPWzs+TL7/KEk4LCF/ExJrYI5kIzEuoE7jsQJtTkDClsJClYFpJ4Q8oaUKUVlJzeSrWHDwm4LRVQWpVGD8nndR0bHzxyeja4KH5dI61Sibos3NsbbuLfKlU0DJfYFlvN83ZreQtz/XlxiSuCw6PhnYtqigXiyirHCUVmfQkLDJ8Nisg0KJIGL89cqlpFeLRKCRKIUkSCKEwDB2ZjAoTr7DVzA/LgN1h/nsZfX4/tAYFFjkvFKCm4Nr3gyg5V/QUKxZopfJvAv5+9i8KXi24MWc+snmedh1VjXykTjCTZEZw+E8FN1PbMV3oAE8aODeHin0HAh1XR9+FGM9snWBqhsnNFLxOeLH3+AA+ZnmP6NW9T1NAcH9f/9jIk1CdYDaFlb5AAEZZg84V6FyBzhWsn0ribvgWJ6wqEDYXPIyH4fsThNKL9T441Eeu8Lqv4Yn64XaRgrsVVLHDEYuz1aKVxB5+FtGeC1sNalksWtrP2BQlsrwKp5p91+W/Xbhp3RXmJmYxVyIi9lOAAQBLvBDiMOy+fQAAAABJRU5ErkJggg==);padding:0px 0px 0px 20px;background-position:0px 10px; background-repeat:no-repeat;" class="right">日志查询</a><a class="right"  style="color:black;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RkVCNUYyMDFCNzlGMTFFMjlCNEVGNTI1RjYyMTQxQjYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RkVCNUYyMDJCNzlGMTFFMjlCNEVGNTI1RjYyMTQxQjYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGRUI1RjFGRkI3OUYxMUUyOUI0RUY1MjVGNjIxNDFCNiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGRUI1RjIwMEI3OUYxMUUyOUI0RUY1MjVGNjIxNDFCNiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PpiHH80AAAFqSURBVHjalJIxSwNBEEZvj60kSJBgZWlleQdBwUrERkuLFLYS0VJCELEKYiEiFgqCcJZXWFgoiliIpXCHWIo/wSKopAqeb2RPlmOTw4WX2czMNzOZrOcNOWEY7gvDchQJy9gmjBSDWZZN/iYp9ebQ9uBUyweMOasrlV/HBwwQaCNepNuTV3Io6GOmTPcaXGsT66Zp+u7YQYXCewgj7DOuWTg0U79Iji4IpMOcFAQRrCFex85jj7AtuIIzqIvGt8V0WeEawTZMwyrswCPswoV8T5Kkn+vsCRbo0jHJSyDj+/hOTPwG7hD37KntAlJ1S0ZEOIGwDk0EXRO/dC32rwCJ9/lPkaVxnYHbsn9GFx0U+sacG0qPvMRPM37f+9+R5lr+BVnclyNBYlWD74iLpqOc7zMIauyhwXXTuA5YbOx6bKrwkEYxItwA2UXF6iZTHEPMnj4GLTGANt0iJojtAvga+NrcX+EhF/wIMACjW3LjqT/dSAAAAABJRU5ErkJggg==);padding:0px 0px 0px 20px;background-position:0px 10px; background-repeat:no-repeat;" id="sumdatewin">操作统计</a>';
  $css('useraction') [0].innerHTML = '';
  function refff() {
    var ret = GM_xmlhttpRequest({
      method: 'GET',
      url: 'http://203.175.159.21:8089/selectnames.php',
      onload: function (res) {
        var jsontext = JSON.parse(res.responseText);
        if (jsontext.result == 'succeed') {
          var str = '';
          for (var i = 0; i < jsontext.data.length; i++) {
            var author = jsontext.data[i].author.replace(/\"/g, '&quot;');
            str = str + '<li class="ff_pd_user" style="list-style-type: none;float:left;margin:3px;padding:5px;border:1px solid black;height:48px;width:180px;" data-uid="' + jsontext.data[i].uid + '" data-author="' + author + '">' +
            '<a href="javascript:void(0);" ><div style="padding:0;height:48px;width:180px;">' +
            '<img src="http://bbs.polchina.com.cn/uc_server/avatar.php?uid=' + jsontext.data[i].uid + '&size=small" style="float:left"><span style="margin:5px">' +
            jsontext.data[i].author.substr(0, 9) + '</span><br/><span style="margin:5px">UID:' + jsontext.data[i].uid + '</span><br/><span style="margin:5px">累计频顶次数:（<i style="color:red;">' + jsontext.data[i].ct + '</i>）</span></div></a></li>'
          }
          $css('t_msgfontfix') [0].innerHTML = '<br/><h3 style=\'padding-left:10px;background-image:url(http://bbs.polchina.com.cn/attachments/forumid_14/1210170853d8fd3052122dccd1.gif);height:20px;background-repeat:no-repeat\'>现仍有共计（<i style=\'color:#999999;\'>' + jsontext.data.length + '</i>）用户频顶违规未被处理</b></h3><br/>' + '<ul id="pduser_list" style="list-style:none;">' + str + '</ul>';
          var pduser_list = $('pduser_list').getElementsByTagName('li');
          $css('authorinfo') [0].innerHTML = '<img src="images/common/online_member.gif" class="authicon"><em>插件已加载</em><span>更新时间：' + new Date().toString() + '</span>';
        } else {
          $css('t_msgfontfix') [0].innerHTML = '<p>暂时没有获取到频顶的相关数据哦</p><div id="logs" style="clear:both"></div>';
          $css('authorinfo') [0].innerHTML = '<img src="images/common/online_member.gif" class="authicon"><em>插件已加载</em><span>更新时间：' + new Date().toString() + '</span>';
        }
      }
    })
  }
  function showlogs() {
    var ret = GM_xmlhttpRequest({
      method: 'GET',
      url: 'http://203.175.159.21:8089/selectlastlog.php',
      onload: function (res) {
        var jsontext = JSON.parse(res.responseText);
        if (jsontext.result == 'succeed') {
          var str = '<tr><td  style=\'text-align:center\' width=\'20%\'>操作人</td><td style=\'text-align:center\' width=\'15%\'>用户UID</td><td style=\'text-align:center\' width=\'35%\'  style=\'text-align:center\' >操作时间</td><td width=\'30%\' style=\'text-align:center\'>操作人IP</td></tr>';
          for (var i = 0; i < jsontext.data.length; i++) {
            str = str + '<tr><td style="text-align:center">' + jsontext.data[i].user + '</td><td  style="text-align:center">' + jsontext.data[i].uid + '</td><td style="text-align:center">' + jsontext.data[i].optime + '</td><td style="text-align:center">' + jsontext.data[i].ip + '</td></tr>';
          }
          $('postmessage_18752159').innerHTML = '<h3 style="background-image:url(http://bbs.polchina.com.cn/attachments/forumid_14/1210170853d8fd3052122dccd1.gif);height:20px;background-repeat:no-repeat;padding-left:10px">最新操作日志</h3><br/><table class="t_table" width="90%">' + str + '</table>';
          $css('authorinfo') [1].innerHTML = '<img src="images/common/online_member.gif" class="authicon"><em>日志已加载</em><span>更新时间：' + new Date().toString() + '</span>';
        }
      }
    })
  }
  refff();
  showlogs();
  setInterval(refff, 30000);
  setInterval(showlogs, 30000);
  live('ff_pd_user', 4, function () {
    Cgetinfouid(this.attributes['data-uid'].value, this.attributes['data-author'].value);
  });
  function Cgetinfouid(uid, name) {
    unsafeWindow['floatwin']('open_uidlist', - 1, 640, 385);
    $('floatwin_uidlist_title').innerHTML = '<span style="color:black;">用户 <font color="red">' + name + '</font>(' + uid + ')的频顶明细列表</span>';
    GM_xmlhttpRequest({
      method: 'GET',
      url: 'http://203.175.159.21:8089/selectuid.php?uid=' + uid,
      onload: function (res) {
        var jsontext = JSON.parse(res.responseText);
        if (jsontext.result == 'succeed') {
          var str = '';
          for (var i = 0; i < jsontext.data.length; i++) {
            var author = jsontext.data[i].author.replace(/\"/g, '&quot;')
            str = str + '<li style="padding-bottom:10px;">[' + jsontext.data[i].type + '] ' + jsontext.data[i].time +
            ' : <a href="http://bbs.polchina.com.cn/viewthread.php?tid=' +
            jsontext.data[i].tid + '" target="_blank">http://bbs.polchina.com.cn/viewthread.php?tid=' +
            jsontext.data[i].tid + '</a></li>';
            if (i != 0 && i < jsontext.data.length - 1) {
              if (jsontext.data[i].guid != jsontext.data[i + 1].guid) {
                str = str + '<li style="padding-bottom:10px;text-align:right"><input class="applythispd" type="button" data-gid="' + jsontext.data[i].guid + '" data-uid="' + jsontext.data[i].uid + '" data-author="' + author + '" value="已处理以上违规" /></li>';
              }
            }
            if (i == jsontext.data.length - 1) {
              str = str + '<li style="padding-bottom:10px;text-align:right"><input class="applythispd" type="button" data-gid="' + jsontext.data[i].guid + '" data-uid="' + jsontext.data[i].uid + '" data-author="' + author + '" value="已处理以上违规" /></li>';
            }
          }
          str = '<hr style="border:1px solid black"/><div style="overflow:auto;height:300px;padding:0 20px;width:580px;"><ul style="text-align:left;">' + str + '</ul></div>';
          $('floatwin_uidlist_content').innerHTML = str;
        } else {
          $('floatwin_uidlist_content').innerHTML = '该用户已无频顶记录。';
        }
      }
    });
  }
  live('applythispd', 1, function () {
    submitguid(this.attributes['data-gid'].value, this.attributes['data-uid'].value, this.attributes['data-author'].value, this);
  });
  function submitguid(guid, uid, name, button) {
    if (confirm('您确定已经处理本次频顶了吗?')) {
      try {
        button.disabled = true;
      } catch (e) {
      }
      GM_xmlhttpRequest({
        method: 'POST',
        data: 'guid=' + guid + '&user=' + user,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        url: 'http://203.175.159.21:8089/removerecord.php',
        onload: function (res) {
          Cgetinfouid(uid, name);
          refff();
          showlogs();
          alert('操作成功！');
        }
      });
    }
  }
  addListener($('Logwin'), 'click', function Logwin() {
    unsafeWindow['floatwin']('open_Logwin', - 1, 640, 385);
    $('floatwin_Logwin_title').innerHTML = '<span style="color:black;">日志记录查询</span>';
    $('floatwin_Logwin_content').innerHTML = '<div style="padding:5px 20px 5px 20px;">用户UID：<input type="text" value="" id="seluid_new">' +
    '&nbsp;<input type="button" class="getuidlog_button" value="查询" onclick="javascript:getuidlog();"></div><div style="padding:5px 20px 5px 20px;overflow:auto;height:280px;" ><ul id="outputlog"></ul></div>';
    $('floatwin_Logwin_content').style.textAlign = 'left';
  });
  live('getuidlog_button', 1, function getuidlog() {
    var uid = $('seluid_new').value;
    GM_xmlhttpRequest({
      method: 'GET',
      url: 'http://203.175.159.21:8089/selectlog.php?uid=' + uid,
      onload: function (res) {
        var jsontext = JSON.parse(res.responseText);
        if (jsontext.result == 'succeed') {
          var str = '';
          for (var i = 0; i < jsontext.data.length; i++) {
            str = str + '<li><span><b>操作人：</b>' + jsontext.data[i].user + '</span>&nbsp;<span><b>操作时间：</b>' +
            jsontext.data[i].optime + '</span>&nbsp;<span><b>操作IP：</b>' +
            jsontext.data[i].ip + '</span></li><li><b>日志详细：</b>&nbsp;' +
            jsontext.data[i].log.replace(/[[]/g, '<br><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>[') +
            '<br/><hr style="border:1px solid black" /></li>';
          }
          $('outputlog').innerHTML = str;
        } else {
          $('outputlog').innerHTML = '<li><b>未查询该UID的相关操作记录</b></li>';
        }
      }
    });
  });
  addListener($('sumdatewin'), 'click', function sumdatewin() {
    unsafeWindow['floatwin']('open_sumdatewin', - 1, 640, 430);
    $('floatwin_sumdatewin_title').innerHTML = '<span style="color:black;">按日期参数统计查询</span>';
    $('floatwin_sumdatewin_content').innerHTML = '<div style="padding:5px 20px 5px 20px;">日期参数：<input type="text" value="" id="seldate_new">' +
    '&nbsp;<input type="button" value="查询" class="sumdatewincount_button"><i style="color:#999999;">&nbsp;格式：yyyy-MM-dd</i></div><iframe id="outputarea" style="padding:5px 20px 5px 20px;overflow:hidden;height:330px;width:600px;border: 0px none;" ></iframe>';
    $('floatwin_sumdatewin_content').style.textAlign = 'left';
  });
  live('sumdatewincount_button', 1, function sumdatewincount() {
    var date = $('seldate_new').value;
    $('outputarea').src = 'http://203.175.159.21:8089/area.php?date=' + date;
  });
}) ();
