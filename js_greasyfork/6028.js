// ==UserScript==
// @name        mydictionary
// @description mydictionary1
// @namespace   https://greasyfork.org/zh-CN/scripts/mydictionary
// @version     1.1
// @include  *
// @require	http://code.jquery.com/jquery-2.1.1.min.js
// @require https://greasyfork.org/scripts/6077-kumomine-toast/code/kumomine%20toast.js?version=22889
// @require https://greasyfork.org/scripts/6078-iconcss/code/iconcss.js?version=22894
// @grant          GM_setClipboard
// @grant          GM_openInTab
// @grant          GM_xmlhttpRequest
// @grant          GM_addStyle
// @grant          unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/6028/mydictionary.user.js
// @updateURL https://update.greasyfork.org/scripts/6028/mydictionary.meta.js
// ==/UserScript==
String.format = function () {
  if (arguments.length == 0)
  return null;
  var str = arguments[0];
  for (var i = 1; i < arguments.length; i++) {
    var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
    str = str.replace(re, arguments[i]);
  }
  return str;
};
String.prototype.trim = function () {
  return this.replace(/(^\s*)|(\s*$)/g, '');
}
String.prototype.ltrim = function () {
  return this.replace(/(^\s*)/g, '');
}
String.prototype.rtrim = function () {
  return this.replace(/(\s*$)/g, '');
}
var debug = function (msg) {
  if (console.log)
  console.log(msg);
   else
  alert(msg);
};

//------------------------------------------------------------------------------
GM_addStyle('i{display: inline-block;}.hidden { display: none;  } \
           .mydiv_note{background-color: #F7F0D2;z-index:99999999;border: 1px solid #BBB;font-size:80%;font-family: "メイリオ";position:fixed;bottom:10px;right:10px;text-align:left;}');

GM_addStyle('#dvhead { background: none repeat scroll 0% 0% transparent;height:18px;min-width:50px;text-align:center;} \
           #notetbl{background:#F7F0D2; repeat scroll 0% 0% #F0F0F0;width:100%;border-spacing:0px;clear:both;} \
           .ajaxloading{text-align:center;}');

GM_addStyle('#notetbl td { height:20px;text-shadow: 0px 1px 0px #FFF; } \
            .tr1{background: none repeat scroll 0% 0% #DFDFDF} \
            .tr2{background: none repeat scroll 0% 0% #fff} \
            .notetitle{display: inline-block;}');

GM_addStyle('div.mydiv_note [class^="icon-"],div.divyahoodic div[class*=" icon-"]{ margin:2px 3px 2px} \
            .nextpage { visibility: hidden;float:right;padding:0 0px;} \
            .prevpage{visibility: hidden;float:left;padding:0 5px;} \
            .newword{background: none;padding-left:2px;border:0px solid #eee;height:20px} \
            .btnnewword{float:right;}');

GM_addStyle('.mynote{height: 24px;width: 24px;border-radius:3px;box-shadow: 0px 0px 8px #999;}'); 

GM_addStyle('.my_note{border-radius:3px;box-shadow: 0px 0px 8px #999;}');

var page = 0;
var PAGE_SIZE = 25;
var url = function () {
  return 'http://wordnote.jd-app.com/getnote?starttime=&endtime=&index=' + page * PAGE_SIZE + '&size=' + PAGE_SIZE;
};
var mydiv = $('<div class="mydiv_note mynote" > \
                  <i class="icon-book" style="margin: 5px;"></i> \
              </div> \
              <div class="mydiv_note my_note" > \
                  <div id="dvhead"> \
                      <i class="icon-chevron-left prevpage"></i> \
                      <div id="btntitle" class="icon-list-alt notetitle"></div> \
                      <i class="nextpage icon-chevron-right"></i> \
                  </div> \
                  <div class="notecontent"> \
                          <table id="notetbl" > </table> \
                          <div> \
                              <input type="text" class="newword"/> \
                              <i class="btnnewword icon-plus"></i> \
                          </div> \
                  </div> \
              </div> \
              ');
var App = {
  init: function () {
    if(top.location ==self.location){ 
       $('body').append(mydiv);
       $('.my_note').hide();
    }
  },
  show: function () {
    showlist();
  },
  showlist: function () {
    if (page == 0) {
      $('.prevpage').css('visibility', 'hidden');
    } else {
      $('.prevpage').css('visibility', 'visible');
    }
    GM_xmlhttpRequest({
      method: 'GET',
      url: url(),
      onload: function (response) {
        var json = (JSON.parse(response.responseText));
        //alert(response.responseText);
        $('#notetbl').html('');
        $.each(json, function (i, e) {
          var cc = (i % 2 == 0) ? 'tr2' : '';
          $('#notetbl').append('<tr class=\'' + cc + '\'> \
                                    <td> \
                                        <span class="note_s">' + e.word + '</span> \
                                        <input type="text" style="width:100%;display:none;border:0px;"></input> \
                                        <span class="noteid" style="display:none;">'+e.id+'</span> \
                                    </td> \
                                    <td class="oper" style="width:28px"> \
                                        <i class="icon-trash del" style="display:none;float:right;margin:0px;"></i> \
                                        <i class="icon-heart fav" style="display:none;float:right;margin:0px;"></i> \
                                    </td> \
                                </tr>');
        });
          if ($('#notetbl').html() == '') {
            $('.nextpage').css('visibility', 'hidden');
          } else {
            $('.nextpage').css('visibility', 'visible');
            
            $('#notetbl td.oper').hover(function(){$(this).find('i').show();},function(){$(this).find('i').hide();});
            
            $('#notetbl i.fav').click(function(){
              var tr = $(this).closest('tr');
              var note_id = tr.find('span.noteid').html();
              
              updatedate(note_id,function(ret){
                if(ret=='true'){
                 warn("Favrated Success!"); 
                 tr.remove();
                }else{
                  warn(ret);
                }
              });
            });
            
            $('#notetbl i.del').click(function(){
              var note_id = $(this).closest('tr').find('span.noteid').html();
              deletenote(note_id,function(ret){
                if(ret=='true'){
                 warn("Removed Success!"); 
                 App.showlist();
                }else{
                  warn(ret);
                }
              });
            });
            
            $('.note_s').click(function(){
              var span = $(this);
              var old = span.html();
              span.hide();
              var txt = $(this).parent().find('input:first');
              txt.blur(function(){
                if(old != $(this).val()){
                  var note_id = $(this).closest('tr').find('span.noteid').html();
                  updatenote(note_id,$(this).val(),function(){
                     App.showlist();
                  });
                }else{
                  span.show();
                  txt.hide();
                }

               
              });
              txt.val('').show().focus().val(old);
             
            });
            
          }
      },
      onerror: function (err) {
        alert(err.message);
      }
    });
  }
};
function deletenote(id,_onload){
  GM_xmlhttpRequest({
      method: 'POST',
      url: 'http://wordnote.jd-app.com/delnote?id='+id,
      onload: function (response) {
        if (_onload != null)
        _onload(response.responseText);
      },
      onerror: function () {
        alert('error');
      }
    });
}
function updatedate(id,_onload){
  GM_xmlhttpRequest({
      method: 'POST',
      url: 'http://wordnote.jd-app.com/updatedate?id='+id,
      onload: function (response) {
        if (_onload != null)
        _onload(response.responseText);
      },
      onerror: function () {
        alert('error');
      }
    });
}

function updatenote(id,word,_onload){
  GM_xmlhttpRequest({
      method: 'POST',
      url: 'http://wordnote.jd-app.com/updatenote',
      headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
    　data: 'id='+id+'&word='+encodeURI(word),
      onload: function (response) {
        if (_onload != null)
        _onload(response.responseText);
      },
      onerror: function () {
        alert('error');
      }
    });
}
App.init();
$('.mynote').click(function () {
  $('.mynote').hide();
  $('.my_note').show();
  App.showlist();
});



$('#btntitle').click(function () {
  $('.my_note').hide('fast');
  $('.mynote').show();
  
});
$('.nextpage').click(function (e) {
  e.stopPropagation();
  page = page + 1;
  App.showlist();
});
$('.prevpage').click(function (e) {
  e.stopPropagation();
  if (page > 0) {
    page = page - 1;
    App.showlist();
  }
});
$('.btnnewword').click(function (e) {
  var text = $('.newword').val();
  addword(text, function () {
    warn(text);
    $('.newword').val('');
    page = 0;
    App.showlist();
  });
});
function getSelectionText() {
  if (window.getSelection) {
    return window.getSelection().toString();
  }
}
$(document).keydown(function (event) {
  var keycode = (event.keyCode ? event.keyCode : event.which);
  if (keycode == '120') {
    var text = getSelectionText();
    addword(text, function () {
      warn(text);
      $('.newword').val('');
      page = 0;
      App.showlist();
    });
  }
});
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
