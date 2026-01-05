// ==UserScript==
// @name        Yahoo dic
// @description Yahoo dictionary
// @namespace   https://greasyfork.org/zh-CN/scripts/YahooDIC
// @include     *
// @version     1.11
// @require	http://code.jquery.com/jquery-2.1.1.min.js
// @require https://greasyfork.org/scripts/6077-kumomine-toast/code/kumomine%20toast.js?version=22889
// @require https://greasyfork.org/scripts/6078-iconcss/code/iconcss.js?version=22894
// @grant          GM_setClipboard
// @grant          GM_openInTab
// @grant          GM_xmlhttpRequest
// @grant          GM_addStyle
// @grant          unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/6027/Yahoo%20dic.user.js
// @updateURL https://update.greasyfork.org/scripts/6027/Yahoo%20dic.meta.js
// ==/UserScript==
var debug = function (msg) {
  if (console.log)
  console.log(msg);
   else
  alert(msg);
};
GM_addStyle('div.divyahoodic div[class^="icon-"],div.divyahoodic div[class*=" icon-"]{ float:right;margin:1px 3px 1px}');
GM_addStyle('.divyahoodic ol div{max-width:300px;}.divyahoodic ol{margin:0px;padding-left: 15px;}.divyahoodic ol h3{margin:0px}.divyahoodic ol h3 a{color:green;} .dichead{height:16px;background-color:#999;} .dicresult{min-width:200px;max-width:400px;max-height:115px;overflow-y:auto;overflow-x:hidden;}'
);
var hist = '';
var loading_1 = 'data:image/gif;base64,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';
var divyahoodic = $('<div class="divyahoodic" style="border: 1px solid #999;z-index:999999;box-shadow: 1px 2px 5px #ccc;display:none;font-size:80%;position:fixed;bottom:25px;left:10px;text-align:left;background-color:#F1FEDD;"><div class="dichead"><div class="icon-remove dicclose" >                               </div><div class="icon-picture picresult" ></div><div class="icon-book yahoodicresult" style="display:none;"></div>                              <div class="icon-heart addfav">                              </div></div><div class="dicresult"></div></div>'
);
$('body').append(divyahoodic);
$('.dicclose').click(function () {
  divyahoodic.hide('fast');
  hist = '';
});
$('.addfav').click(function () {
  addword(hist, function () {
    warn(hist)
  });
});
$('.picresult').click(function () {
  dogetpic(hist);
});
$('.yahoodicresult').click(function () {
  var tmp = hist;
  hist = '';
  dogetdic(tmp);
});

$('.dichead').mousedown(function (e) {
  $(this).css('cursor', 'move');
  var x = e.pageX;
  var y = e.pageY;
  var l = divyahoodic.css('left').replace('px','');
  var b = divyahoodic.css('bottom').replace('px','');
  $(document).bind('mousemove', function (ev) {
    var _x = ev.pageX - x; //获得X轴方向移动的值
    var _y = ev.pageY - y; //获得Y轴方向移动的值
    $('.divyahoodic').css({
      left: Number(l)+_x + 'px',
      bottom: Number(b)-_y + 'px'
    });
  });
});

$(document).mouseup(function (){
  $('.dichead').css('cursor', 'default');
  $(this).unbind('mousemove');
})

function getSelectionText() {
  if (window.getSelection) {
    return window.getSelection().toString();
  }
}
$(document).mouseup(function (event) {
  var text = getSelectionText();
  if (text != '' && text.length <= 20) {
    dogetdic(text);
  }
});
$(document).keydown(function (event) {
  var keycode = (event.keyCode ? event.keyCode : event.which);
  if (keycode == '121') {
    var text = getSelectionText();
    if (text != '') {
      dogetpic(text);
    }
  }
});
function dogetdic(text) {
  if (text == hist) return false;
  hist = text;
  yahoodic(text, function (html) {
    var $dic = $('.dicresult');
    $dic.html('');
    $(html).find('ol[start="1"]').each(function (i, e) {
      $(this).find('a').attr('target', '_blank');
      $dic.append($(this));
    });
    if ($dic.html() == '') {
      $dic.html('<div style="text-align:center;clear:both;">No result for ' + text + '</div>');
    }
    //$dic.prepend('<div class="icon-remove dicclose" > \
    //</div><div class="icon-picture picresult" > \
    //                          </div><div class="icon-heart addfav"> \
    //                           </div>');

    $dic.css('max-height', '115px');
    $('.picresult').show();
    $('.yahoodicresult').hide();
    
    divyahoodic.show();
  });
}
function dogetpic(text) {
  yahoopic(text, function (html) {
    var $dic = $('.dicresult');
    $dic.html('');
    $(html).find('div#gridlist img').each(function (i, e) {
      $dic.append($(this).css('margin-top', '0px').css('margin-left', '10px').css('margin-right', '-12px').prop('outerHTML') + '</br>');
    });
    if ($dic.html() == '') {
      $dic.html('<div style="text-align:center;clear:both;">No result for ' + text + '</div>');
    }
    //$dic.prepend('<div class="icon-remove dicclose" ></div><div class="icon-book dicresult"></div>');
    // $('.dicclose').click(function () {
    //   $dic.hide('fast');
    // });
    //  $('.dicresult').click(function () {
    //    hist='';
    //   dogetdic(text);
    //  });

    $dic.css('max-height', '500px');
    $('.picresult').hide();
    $('.yahoodicresult').show();
    if(divyahoodic.offset().top < $(document).scrollTop()){
      divyahoodic.css('bottom','25px');
    }
    divyahoodic.show();
  });
}
function yahoopic(text, _success) {
  if (text != null && text.trim() != '') {
    var headers = {
      'Referer': 'http://image.search.yahoo.co.jp/search?ei=UTF-8&fr=&p=%E7%9C%9F%E4%B8%AD',
      'Host': '\timage.search.yahoo.co.jp',
      'X-Requested-With': 'XMLHttpRequest',
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:31.0) Gecko/20100101 Firefox/31.0',
      'Pragma': 'no-cache',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache',
      'Accept-Language': 'zh-cn,zh;q=0.8,en-us;q=0.5,en;q=0.3',
      'Accept-Encoding': 'gzip, deflate',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
    };
    //console.log('http://image.search.yahoo.co.jp/search?aq=-1&oq=&ei=UTF-8&p=' + encodeURI(text));
    $('.dicresult').html('<div style="text-align:center;padding: 2px 10px;"><img style="height:14px;" src=\'' + loading_1 + '\' />Searching for ' + text + '</div>');
    divyahoodic.show('fast');
    GM_xmlhttpRequest({
      method: 'GET',
      url: 'http://image.search.yahoo.co.jp/search?aq=-1&oq=&ei=UTF-8&p=' + encodeURI(text),
      synchronous: false,
      headers: headers,
      onload: function (response) {
        //debug(response.responseText);
        if (_success != null)
        _success(response.responseText);
      },
      onerror: function (error) {
        alert('error:' + error);
      }
    });
  }
}
function yahoodic(text, _success) {
  if (text != null && text.trim() != '') {
    var headers = {
      'Referer': 'http://dic.search.yahoo.co.jp/search?ei=UTF-8&fr=&p=%E7%9C%9F%E4%B8%AD',
      'Host': 'dic.search.yahoo.co.jp',
      'X-Requested-With': 'XMLHttpRequest',
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:31.0) Gecko/20100101 Firefox/31.0',
      'Pragma': 'no-cache',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache',
      'Accept-Language': 'zh-cn,zh;q=0.8,en-us;q=0.5,en;q=0.3',
      'Accept-Encoding': 'gzip, deflate',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
    };
    //console.log('http://dic.search.yahoo.co.jp/search?' + 'ei=UTF-8&fr=&p=' + encodeURI(text));
    $('.dicresult').html('<div style="text-align:center;padding: 2px 10px;"><img style="height:14px;" src=\'' + loading_1 + '\' />Searching for ' + text + '</div>');
    divyahoodic.show('fast');
    GM_xmlhttpRequest({
      method: 'GET',
      url: 'http://dic.search.yahoo.co.jp/search?ei=UTF-8&fr=&p=' + text,
      synchronous: false,
      headers: headers,
      onload: function (response) {
        //alert(response.responseText);
        if (_success != null)
        _success(response.responseText);
      },
      onerror: function (error) {
        alert('error:' + error);
      }
    });
  }
}
function addword(text, _success) {
  if (text != null && text.trim() != '') {
    var headers = {
      'Referer': 'http://wordnote.jd-app.com/addnote',
      'Host': 'wordnote.jd-app.com',
      'X-Requested-With': 'XMLHttpRequest',
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:31.0) Gecko/20100101 Firefox/31.0',
      'Pragma': 'no-cache',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache',
      'Accept-Language': 'zh-cn,zh;q=0.8,en-us;q=0.5,en;q=0.3',
      'Accept-Encoding': 'gzip, deflate',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
    };
    GM_xmlhttpRequest({
      method: 'POST',
      url: 'http://wordnote.jd-app.com/addnote',
      synchronous: false,
      headers: headers,
      data: 'word=' + encodeURI(text.trim()),
      onload: function (response) {
        if (response.responseText == 'true') {
          if (_success != null)
          _success();
        }
      },
      onerror: function (error) {
        warn('error:' + error);
      }
    });
  }
}
