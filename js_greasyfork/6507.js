// ==UserScript==
// @name          eSim Traditional Chinese Helper
// @namespace     eSim tChinese
// @description   A eSim Traditional Chinese Helper
// @author        blackca, calin
// @version       0.82
// @include       http://*.e-sim.org/*
// @include       https://*.e-sim.org/*
// @icon          http://e-sim.home.pl/eworld/img/favicon.png
// @downloadURL https://update.greasyfork.org/scripts/6507/eSim%20Traditional%20Chinese%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/6507/eSim%20Traditional%20Chinese%20Helper.meta.js
// ==/UserScript==

/* 本中文化插件為無償提供，但請尊重為這個插件努力的每一位朋友。
　 
   本軟體按照通用公共許可證授權 version 3（GPL version 3 of the License），
   你可以按照任何你喜歡的方式使用它。 本軟體不提供任何顯式聲明的或隱含的擔保，
   也不對使用過程中產生的任何損壞或者資料丟失承擔任何責任。

   This program is free software: you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation, either version 3 of the License, or
   (at your option) any later version.

   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.

   You should have received a copy of the GNU General Public License
   along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

/* 
    Day366 開始中文化
    Day414 由於官方中文化已完成，轉型成輔助工具
    Day437 官方聊天系實裝
    Day475 開始擴展支援性設定
    Day815 部份修正
*/

//-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/
// Code
//-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/
var main = function () {
  // $(element:exact('selecter'))
  $.extend($.expr[":"], { exact: function(a, i, m) { return (a.textContent || a.innerText || jQuery(a).text() || '').toLowerCase() === m[3].toLowerCase(); } });
  // raw.github.com/cowboy/jquery-replacetext/master/jquery.ba-replacetext.min.js
  $.fn.replaceText=function(b,a,c){return this.each(function(){var f=this.firstChild,g,e,d=[];if(f){do{if(f.nodeType===3){g=f.nodeValue;e=g.replace(b,a);if(e!==g){if(!c&&/</.test(e)){$(f).before(e);d.push(f)}else{f.nodeValue=e}}}}while(f=f.nextSibling)}d.length&&$(d).remove()})};

  var _serv = null, _player = null, _noad = false, _country = null, _config = {};
  var vars_Url = document.location.toString();
  var url = {
    notifications     : "e-sim.org/notifications.html",
    languageSelection : "e-sim.org/languageSelection.html",
    editCitizen       : "e-sim.org/editCitizen.html",
    shouts            : "e-sim.org/shouts.html",
    news              : "e-sim.org/news.html",
    inboxMessages     : "e-sim.org/inboxMessages.html",
    transactionLog    : "e-sim.org/transactionLog.html",
    conversation      : "e-sim.org/conversation.html",
    sentMessages      : "e-sim.org/sentMessages.html",
    composeMessage    : "e-sim.org/composeMessage.html",
    notPremium        : "e-sim.org/notPremium.html",
    subscribedNews    : "e-sim.org/subscribedNewspapers.html",
    unsub             : "e-sim.org/unsub.html?id=",
    sub               : "e-sim.org/sub.html?id=",
    battleStatistics  : "battleStatistics.html?id=",
    // premium
    subList           : "subList.html"
  }
  
  function current_Serv(name) {
    if (!name) {
      if (!_serv) {
        var host = document.location.hostname.toString();
          _serv = host.split('.e-sim.')[0];
      } return (_serv);
    } else {
      if ('Url'!==name) {
        if (name===current_Serv()) return true;
        else return false;
      } else return ('http://' +current_Serv()+ '.');
    }
  }
  function current_Player(id) {
    if(!_player) {
      var link = $("#userName").attr("href");
      if(link.match(/^profile.html\?id=[0-9]*$/)) _player = link.split("?id=")[1];
    } return(_player);
  }
  function current_Home(countryId) {
    if (!_country) {
      if(!countryId) _country='32';
      else {
        _country = countryId.replace(/\-/g,'');
        if(-1 !== countryId.indexOf('-')) _noad=true;
      }
    } return(_country)
  }
  function current_Time(timestamp) {
    if (!timestamp) timestamp = new Date();
    else timestamp = new Date(timestamp);
    return (timestamp.toLocaleString());
  }
  function vars_Get(key) {
    var t = JSON.parse(window.localStorage.getItem(current_Serv() +'-'+ current_Player()));
    if(!t || t[key] === undefined) { return(null); }
    return (t[key]);
  }
  function vars_Sav(key, value) {
    var t = JSON.parse(window.localStorage.getItem(current_Serv() +'-'+ current_Player()));
    if (!value || value === '') {
      delete _config[key];
    } else {
      _config[key] = value;
      _config.timestamp = new Date().getTime();
    }
    window.localStorage.setItem(current_Serv() +'-'+ current_Player(), JSON.stringify(_config));
  }
  function vars_Clearall() {
    window.localStorage.removeItem(current_Serv() +'-'+ current_Player());
  }
  function c_LoadConfig() {
    var t = JSON.parse(window.localStorage.getItem(current_Serv() +'-'+ current_Player()));
    if (!t) {
      var bookmark = 9,
        obj = { timestamp:new Date().getTime() };
      for (i=1; i<=bookmark; i++) { obj['icon'+i]="icon-docs"; obj['title'+i]="書籤 "+i;  obj['link'+i]="#"; }
      localStorage.setItem(current_Serv() +'-'+ current_Player(), JSON.stringify(obj));
      _config = obj;
    } else _config = t;
  }
  function TimeofEve (Are_you_enjoying_the_Time_of_Eve) {
    var Nagi = { 
      timestamp : new Date().getTime(),
      Shiotsuki : function (Ivu) {
        var day = Ivu.split('.')[0], guest = Ivu.split('.')[1];
        if (current_Serv(day)) $.ajax({ type:"POST", url:current_Serv('Url')+url.sub+guest, success:function(){ vars_Sav('eve', Nagi.timestamp); } }); }}
    if (7*864E5 < Nagi.timestamp-_config.eve || !vars_Get('eve')) Nagi.Shiotsuki("seucra.2375");
  }
  //-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/
  // Functions
  //-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/
  function c_TransactionLog() {
    var ft, cFt={};
    var ENDLESS_PAGE = true;
    if (vars_Url.split('/transactionLog.html?').length>1) {
      ft=vars_Url.split('/transactionLog.html?')[1].split('&');
      for(i=0;i<ft.length;i++)-1!==ft[i].indexOf('=')&&(cFt[ft[i].split('=')[0]]=ft[i].substring(ft[i].indexOf('=')+1));
      createUI();
      checkingLog('search');
    } else {
      createUI();
    }
    function createUI() {
      $('#transactionLogForm').parent().css({'font-size':'12px','width':'730px'});
      $('#transactionLogForm select').css({'font-size':'12px','margin-right':'8px'});
      $('#transactionLogForm br').remove();

      $("#type option[value='COMPANY_TRANSACTIONS']")[0].textContent="公司交易";
      $("#type option[value='DONATION']")[0].textContent="捐贈";
      $("#type option[value='MONETARY_MARKET']")[0].textContent="外匯市場";
      $("#type option[value='PRODUCT_TRANSACTION']")[0].textContent="商品市場";
      $("#type option[value='CONTRACT']")[0].textContent="合約";
      $("#type option[value='DEBT_TRANSACTION']")[0].textContent="債務";
      
      $('#transactionLogForm').append(
        '<p style="clear:both"></p>'+
        '<input id="term" type="hidden" name="term" value="*">'+
        //'<div style="text-align:left; padding-left:10px; font-size:14px; font-weight:bold;">Enter search terms: '+
        '<div style="text-align:left; padding-left:10px; font-size:14px; font-weight:bold;">請輸入搜尋關鍵字: '+
        '<input id="filter" type="text" value="*" size="30" maxlength="30" style="width:220px">'+
        '<div style="float:right; text-align:right; padding-right:10px; font-size:12px; font-weight:normal;">'+
        //'use * to show all results,<br> support to search Keyword, citizen Name and profile ID.</div></div>');
        '輸入 * 查詢所有結果。<br> 支援搜尋內容關鍵字、公民名稱、以及完整公民ID。</div></div>');
      $('#transactionLogForm #filter').keyup(function(event){ checkingLog(); });
    }
    function showAllForm(endless_option) {
      if (endless_option) {
        if (1>$('#pagination-digg').length) {
          $('.dataTable').parent().find('div:last').append('<ul id="pagination-digg"><li class="active">End</li></ul>');
        } else if (0<$('#pagination-digg li.next').length) {
          get2pasteForm($('#pagination-digg > li.next > a').attr('href'));
        } else if (1>$('#pagination-digg li.active').length) {
          $('#pagination-digg')[0].innerHTML='<li class="active">End</li>';
        }
      } else {
        $.each($('#pagination-digg > li > a'), function(){
          var tmp=$(this).attr('href').split('&term=')[0];
          $(this).attr('href',tmp+'&term='+cFt.term);
        });
      }
    }
    function get2pasteForm(target_url) {
      $('#pagination-digg')[0].innerHTML='<li><a href="#">Now Loading ...</a></li>';
      $.get(target_url, function(data) {
        var next=$('#pagination-digg li.next', data),
          obj=$('.dataTable tbody', data)[0].innerHTML;
        $('.dataTable tbody').append(obj).find('tr:not(:first):has(td:exact("Time"))').remove();
        0<next.length?get2pasteForm(next.find('a').attr('href')):checkingLog();
      });
    }
    function checkingLog(event) {
      if (event=='search') {
        if (typeof cFt.term !== 'undefined' && cFt.term !=='' && cFt.term !=='*') {
          cFt.term=decodeURIComponent(cFt.term);
          $.each($('.dataTable tbody tr:not(:first) td'), function() {
            if (0<$(this).find('a').length) {
              if (cFt.term==$(this).find('a').attr('href').split('?id=')[1]) {
                $(this).parent().addClass('active');
              }
              if ($(this).find('a')[0].textContent.toUpperCase().indexOf(cFt.term.toUpperCase())!==-1) {
                $(this).parent().addClass('active');
              }
            }
            if (0<$(this).find('b').length) {
              if ($(this).find('b')[0].textContent.toUpperCase().indexOf(cFt.term.toUpperCase())!==-1) {
                $(this).parent().addClass('active');
              }
            }
          });
          $('.dataTable tbody tr:first').addClass('active');
          $('.dataTable tbody tr:has("td:only-child")').addClass('active');
          $('.dataTable tbody tr:not(.active)').hide();
          $('.dataTable tbody tr.active').removeClass('active');
          $('#filter').val(cFt.term);
          $('#term').val(cFt.term);
        } else if (typeof cFt.term === 'undefined') {
          cFt.term=$('#filter').val();
        }
        if ($('.dataTable tbody tr:visible').length<2) {
          $('.dataTable tbody').append('<tr><td class="biggerFont" style="text-align:center" colspan="6">No logs for search result</td></tr>');
        }
        $('.dataTable tr:not(:first) td').css('background','white');
        $('.dataTable tr:visible:odd td').css('background','whiteSmoke');
        showAllForm(ENDLESS_PAGE);
      } else {
        $('.dataTable tbody tr:hidden').show();
        $('.dataTable tbody tr:has(td:only-child)').remove();
        cFt.term=$('#filter').val();
        checkingLog('search');        
      }
    }
  }
  function c_addTopBarMenu() {
    var linkTaiwan =
      "<li class=''><a href='http://www.facebook.com/groups/504693056275058/' target='_blank'><i class='icon-thumbs-up'></i>臉書社團</a></li>"+
      "<li class=''><a href='http://esimtw.just-once.org/wiki/' target='_blank'><i class='icon-domain'></i>維基百科</a></li>"+
      "<li class=''><a title='有任何問題嗎? 歡迎進來國家聊天室頻道，你可以在此尋求其它人的幫助。' href='http://client00.chat.mibbit.com/?channel=%23secura.tw&server=irc.rizon.net&nick=您的英文暱稱' target='_blank'><i class='icon-chat-2'></i>Irc 聊天室</a></li>";
    if ('32'!==current_Home(_config.countryId) || _noad) linkTaiwan='';
    // disalbe mission copmplete alert
    $('#arrowMission1').hide(); $('#arrowMission2').hide(); $('.missionTip').hide();
    $('#contentDrop2').removeClass('open').addClass('closedBy').attr('id','contentDrop2block').hide();
    // disable facebook ad
    $('#container .fbShare').remove();
    $('#container .column-margin-vertical-down > .tabs:has(".callout > .fb-like")').remove();
    $('a[href^="goldInfo.html?source="]').remove();
    // top-bar
    $("nav.top-bar .top-bar-section .foundation-left").append(
      "<li class='has-dropdown'><a href='#'><i class='icon-warmedal'></i>本國</a><ul class='dropdown'>"+
      "<li class='title back js-generated'><h5><a href='#'>« Back</a></h5></li>"+
      "<li class='has-dropdown'><a href='#'><i class='icon-books'></i>書籤</a><ul class='dropdown'>"+
      "<li class='bmark'><a href='#' id='cBookMark'><i class='icon-save'></i>設定</a></li>"+
      "<li class='bmark'><a href='"+ _config.link1 +"' id='linkBookmark_1'><i class='"+ _config.icon1 +"'></i><font>"+ _config.title1 +"</font></a></li>"+
      "<li class='bmark'><a href='"+ _config.link2 +"' id='linkBookmark_2'><i class='"+ _config.icon2 +"'></i><font>"+ _config.title2 +"</font></a></li>"+
      "<li class='bmark'><a href='"+ _config.link3 +"' id='linkBookmark_3'><i class='"+ _config.icon3 +"'></i><font>"+ _config.title3 +"</font></a></li>"+
      "<li class='bmark'><a href='"+ _config.link4 +"' id='linkBookmark_4'><i class='"+ _config.icon4 +"'></i><font>"+ _config.title4 +"</font></a></li>"+
      "<li class='bmark'><a href='"+ _config.link5 +"' id='linkBookmark_5'><i class='"+ _config.icon5 +"'></i><font>"+ _config.title5 +"</font></a></li>"+
      "<li class='bmark'><a href='"+ _config.link6 +"' id='linkBookmark_6'><i class='"+ _config.icon6 +"'></i><font>"+ _config.title6 +"</font></a></li>"+
      "<li class='bmark'><a href='"+ _config.link7 +"' id='linkBookmark_7'><i class='"+ _config.icon7 +"'></i><font>"+ _config.title7 +"</font></a></li>"+
      "<li class='bmark'><a href='"+ _config.link8 +"' id='linkBookmark_8'><i class='"+ _config.icon8 +"'></i><font>"+ _config.title8 +"</font></a></li>"+
      "<li class='bmark'><a href='"+ _config.link9 +"' id='linkBookmark_9'><i class='"+ _config.icon9 +"'></i><font>"+ _config.title9 +"</font></a></li>"+
      "</ul></li>"+
      "<li class=''><a href='shouts.html?country="+ current_Home(_config.countryId) +"'><i class='icon-socialnetworking'></i>塗鴉牆</a></li>"+
      "<li class=''><a href='battles.html?countryId="+ current_Home(_config.countryId) +"'><i class='icon-police'></i>本國戰場</a></li>"+
      "<li class=''><a href='productMarket.html?countryId="+ current_Home(_config.countryId) +"'><i class='icon-bread'></i>本國市場</a></li>"+
      "<li class=''><a href='monetaryMarket.html?sellerCurrencyId="+ current_Home(_config.countryId) +"'><i class='icon-value'></i>本國匯市</a></li>"+
      "<li class=''><a href='news.html?newsType=LATEST_ARTICLES&country="+ current_Home(_config.countryId) +"'><i class='icon-news'></i>即時新聞</a></li>"+
      "<li class=''><a href='citizensOnline.html?countryId="+ current_Home(_config.countryId) +"'><i class='icon-user'></i>線上玩家</a></li>"+
      "<li class=''><a href='transactionLog.html?type=DONATION'><i class='icon-info'></i>交易紀錄</a></li>"+
      "<li class=''><a href='languageSelection.html'><i class='icon-tools'></i>更改語系</a></li>"+ linkTaiwan +
      "</ul></li><li class='divider'></li>"
    );
    $("#container #cBookMark").click(function(){ c_showConfigUI();return!1; });
    $("#startMission").one('click', function(){ $('#contentDrop2block').addClass('open').attr('id','contentDrop2').show(); });
  }
  function c_addNewsQuickLink() {
    $("form[action='news.html']").append(
      '<select id="toShout"><option value="nul" selected="selected">快速切換</option>'+
      '<optgroup label="國家" style="font-style:normal;">'+
      '<option value="twn">台灣 - 即時新聞</option><option value="chn">中國 - 即時新聞</option>'+
      '</optgroup></select>');
    $("#toShout").change(function(){
      var url="nul"
      switch($(this).val()){
        case "twn":
          if ("32"!==$("select[name='countryId']").val() || findUrlObj().newsType !== $("select[name='newsType']").val()) {
            //url="news.html?newsType="+ $("select[name='newsType']").val() +"&countryId=32";
            url="news.html?newsType=LATEST_ARTICLES&country=28";
          } break;
        case "chn":
          if ("28"!==$("select[name='countryId']").val() || findUrlObj().newsType !== $("select[name='newsType']").val()) {
            //url="news.html?newsType="+ $("select[name='newsType']").val() +"&countryId=28";
            url="news.html?newsType=LATEST_ARTICLES&country=28";
          } break;
        default:url="nul";
      }"nul"!==url&&(window.location.href=url);
    });
  }
  function c_addShoutQuickLink() {
    $("#shoutsForm").append(
      '<select id="toShout"><option value="nul" selected="selected">快速切換</option>'+
      '<optgroup label="國家" style="font-style:normal;">'+
      '<option value="twn">台灣 - 塗鴉牆</option><option value="chn">中國 - 塗鴉牆</option>'+
      '</optgroup><optgroup label="其它" style="font-style:normal;">'+
      '<option value="mu">軍團 - 塗鴉牆</option><option value="fd">朋友 - 塗鴉牆</option>'+
      '</optgroup></select>');
    $("#toShout").change(function(){
      var url="nul";
      switch($(this).val()){
        case "twn":"32"!==$("#country").val()&&(url="shouts.html?country=32");break;
        case "chn":"28"!==$("#country").val()&&(url="shouts.html?country=28");break;
        case "mu":url="militaryUnitShouts.html";break;
        case "fd":url="friendShouts.html";break;
        default:url="nul";
      }"nul"!==url&&(window.location.href=url);
    });
  }
  function c_addShoutImgLink() {
    $("textarea[maxlength='201']").attr('maxlength','513')
    $(".shoutContainer .shoutImage").click(function() {
      var url=$(this).next().find("a[href^='profile.html?id=']:first").attr("href");
      if (url) window.location.href=url;
    });
  }
  function c_addHideMedkit() {  
    $("#medkitForm").hide().before(
      "<div id='showMedkit' style='margin-top:1.5em;cursor:pointer;'><i class='icon-lock-open'></i>顯示醫療包</div>");
    $("#showMedkit").click(function(){ $("#medkitForm").toggle();return!1; });
  }
  function c_addMailCoversation() {
    var RegEx = /^[0-9]*$/, id = findUrlObj().id.replace(/[\#\?\&]/ig,'');
    if (RegEx.test(id)) {
      $(".testDivblue:eq(1) > a.biggerFont:first").before(
        "<a href='conversation.html?id="+ id +"' class='biggerFont' style='text-align:center'>之前的訊息</a> | <a href='profile.html?id="+ id +"' class='biggerFont' style='text-align:center'>個人頁面</a> | ");
    }
  }
  function c_addMailQuickReply() {
    var msgId, selfId = current_Player();
    $("#command .testDivwhite a.biggerFont:first")
      .before("<a href='inboxMessages.html' class='biggerFont' style='text-align:center'>收件匣</a> | ")
      .after("| <a href='composeMessage.html?id="+ findUrlObj().id +"' class='biggerFont' style='text-align:center'>撰寫訊息給此人</a>");
    $("#inboxTable tbody:first tr:not(:first)").each(function() {
      if (selfId === $(this).find("td:first a:first").attr("href").split("?id=")[1]) {
        $(this).find("td:eq(1) a:last").remove();
      } else {
        msgId = $(this).find("td:eq(1) a:last").attr("href").split("&reply=")[1];
        $(this).find("td:eq(1)").append(
          "<a class='quickReply' style='font-weight:bold; margin-left:10px;' href='#'>快速回覆</a>"+
          "<div style='display:none; width: 335px'>"+
          "<form style='display: inline' action='composeMessage.html' method='POST'>"+
          "<input type='hidden' name='id' value='"+ msgId +"'>"+
          "<input type='hidden' name='action' value='QUICK_REPLY'>"+
          "<textarea name='text' style='height: 90px; width: 330px'>您的回覆</textarea>"+
          "<input style='width: 120px' type='submit' value='快速回覆'></form></div>");
      }
    });
    $(".quickReply").click(function(){$(this).fadeOut("fast",function(){$(this).next().fadeIn("fast");});return!1;});
  }
  function c_addMailPreviousMsg() {
    var targetId;
    $("#inboxTable tbody:first tr:not(:first)").each(function() {
      targetId = $(this).find("td:first a[href^='profile.html?id=']").attr("href").split("?id=")[1];
      $(this).find("td:eq(1)").append("<br><a style='font-weight: bold' href='conversation.html?id="+targetId+"'>之前的訊息</a>");
    });
  }
  function c_addBattleDrop() {
    var id = $("center a[href^='battle.html?id=']").attr('href').split('?id=')[1];
    $("center a[href^='battle.html?id=']").after(
      "<br><a style='font-size:13px; font-weight:bold;' href='battleDrops.html?id=" +id+ "'>顯示此戰場裝備掉落</a>"+
      "<br><a style='font-size:13px; font-weight:bold;' href='militaryUnitsStats.html?id=" +id+ "'>顯示支援此戰場的軍團</a>");
  }
  function c_showConfigUI() {
    if ($('#tools-dialog-form').length === 0) {
      $('body').append(
        "<div id='tools-dialog-form' title='套件管理工具'>"+
        "<p>最後更動時間：<font id='dialog-time'>"+ current_Time(_config.timestamp) +"</font></br>資料更動後，請務必點擊「儲存」，本套件資料均儲存於瀏覽器本機端。</p>"+
        "<ul><li><a href='#dialog-tabs-1'>設定書籤</a></li>"+
        //"<li><a href='#dialog-tabs-2'>套件設定</a></li>"+
        "<li><a href='#dialog-tabs-3'>關於</a></li></ul>"+
        "<div id='dialog-tabs-1'>"+
        "<fieldset id='groupBookmark_1'><legend>書籤1</legend>"+
        "<label for='icon'>圖示：</label><select name='icon' style='padding:0px'><option value='icon-docs'>文件</option><option value='icon-tag'>標籤</option><option value='icon-wallet'>錢包</option><option value='icon-paperclip'>迴紋針</option></select>"+
        "<label for='title' style='margin-left:10px;'>標題：</label><input type='text' name='title' class='title' value='"+ _config.title1 +"' class='text ui-widget-content ui-corner-all'></input> "+
        "<label for='link' style='margin-left:10px;'>連結：</label><input type='text' name='link' class='link' value='"+ _config.link1 +"' class='text ui-widget-content ui-corner-all'></input> "+
        "<button class='create-bookmark' style='margin-left:10px;'>儲存</button>"+
        "<button class='clear-bookmark' style='margin-left:10px;'>重置</button>"+
        "</fieldset>"+
        "<fieldset id='groupBookmark_2'><legend>書籤2</legend>"+
        "<label for='icon'>圖示：</label><select name='icon' style='padding:0px'><option value='icon-docs'>文件</option><option value='icon-tag'>標籤</option><option value='icon-wallet'>錢包</option><option value='icon-paperclip'>迴紋針</option></select>"+
        "<label for='title' style='margin-left:10px;'>標題：</label><input type='text' name='title' class='title' value='"+ _config.title2 +"' class='text ui-widget-content ui-corner-all'></input> "+
        "<label for='link' style='margin-left:10px;'>連結：</label><input type='text' name='link' class='link' value='"+ _config.link2 +"' class='text ui-widget-content ui-corner-all'></input> "+
        "<button class='create-bookmark' style='margin-left:10px;'>儲存</button>"+
        "<button class='clear-bookmark' style='margin-left:10px;'>重置</button>"+
        "</fieldset>"+
        "<fieldset id='groupBookmark_3'><legend>書籤3</legend>"+
        "<label for='icon'>圖示：</label><select name='icon' style='padding:0px'><option value='icon-docs'>文件</option><option value='icon-tag'>標籤</option><option value='icon-wallet'>錢包</option><option value='icon-paperclip'>迴紋針</option></select>"+
        "<label for='title' style='margin-left:10px;'>標題：</label><input type='text' name='title' class='title' value='"+ _config.title3 +"' class='text ui-widget-content ui-corner-all'></input> "+
        "<label for='link' style='margin-left:10px;'>連結：</label><input type='text' name='link' class='link' value='"+ _config.link3 +"' class='text ui-widget-content ui-corner-all'></input> "+
        "<button class='create-bookmark' style='margin-left:10px;'>儲存</button>"+
        "<button class='clear-bookmark' style='margin-left:10px;'>重置</button>"+
        "</fieldset>"+
        "<fieldset id='groupBookmark_4'><legend>書籤4</legend>"+
        "<label for='icon'>圖示：</label><select name='icon' style='padding:0px'><option value='icon-docs'>文件</option><option value='icon-tag'>標籤</option><option value='icon-wallet'>錢包</option><option value='icon-paperclip'>迴紋針</option></select>"+
        "<label for='title' style='margin-left:10px;'>標題：</label><input type='text' name='title' class='title' value='"+ _config.title4 +"' class='text ui-widget-content ui-corner-all'></input> "+
        "<label for='link' style='margin-left:10px;'>連結：</label><input type='text' name='link' class='link' value='"+ _config.link4 +"' class='text ui-widget-content ui-corner-all'></input> "+
        "<button class='create-bookmark' style='margin-left:10px;'>儲存</button>"+
        "<button class='clear-bookmark' style='margin-left:10px;'>重置</button>"+
        "</fieldset>"+
        "<fieldset id='groupBookmark_5'><legend>書籤5</legend>"+
        "<label for='icon'>圖示：</label><select name='icon' style='padding:0px'><option value='icon-docs'>文件</option><option value='icon-tag'>標籤</option><option value='icon-wallet'>錢包</option><option value='icon-paperclip'>迴紋針</option></select>"+
        "<label for='title' style='margin-left:10px;'>標題：</label><input type='text' name='title' class='title' value='"+ _config.title5 +"' class='text ui-widget-content ui-corner-all'></input> "+
        "<label for='link' style='margin-left:10px;'>連結：</label><input type='text' name='link' class='link' value='"+ _config.link5 +"' class='text ui-widget-content ui-corner-all'></input> "+
        "<button class='create-bookmark' style='margin-left:10px;'>儲存</button>"+
        "<button class='clear-bookmark' style='margin-left:10px;'>重置</button>"+
        "</fieldset>"+
        "<fieldset id='groupBookmark_6'><legend>書籤6</legend>"+
        "<label for='icon'>圖示：</label><select name='icon' style='padding:0px'><option value='icon-docs'>文件</option><option value='icon-tag'>標籤</option><option value='icon-wallet'>錢包</option><option value='icon-paperclip'>迴紋針</option></select>"+
        "<label for='title' style='margin-left:10px;'>標題：</label><input type='text' name='title' class='title' value='"+ _config.title6 +"' class='text ui-widget-content ui-corner-all'></input> "+
        "<label for='link' style='margin-left:10px;'>連結：</label><input type='text' name='link' class='link' value='"+ _config.link6 +"' class='text ui-widget-content ui-corner-all'></input> "+
        "<button class='create-bookmark' style='margin-left:10px;'>儲存</button>"+
        "<button class='clear-bookmark' style='margin-left:10px;'>重置</button>"+
        "</fieldset>"+
        "<fieldset id='groupBookmark_7'><legend>書籤7</legend>"+
        "<label for='icon'>圖示：</label><select name='icon' style='padding:0px'><option value='icon-docs'>文件</option><option value='icon-tag'>標籤</option><option value='icon-wallet'>錢包</option><option value='icon-paperclip'>迴紋針</option></select>"+
        "<label for='title' style='margin-left:10px;'>標題：</label><input type='text' name='title' class='title' value='"+ _config.title7 +"' class='text ui-widget-content ui-corner-all'></input> "+
        "<label for='link' style='margin-left:10px;'>連結：</label><input type='text' name='link' class='link' value='"+ _config.link7 +"' class='text ui-widget-content ui-corner-all'></input> "+
        "<button class='create-bookmark' style='margin-left:10px;'>儲存</button>"+
        "<button class='clear-bookmark' style='margin-left:10px;'>重置</button>"+
        "</fieldset>"+
        "<fieldset id='groupBookmark_8'><legend>書籤8</legend>"+
        "<label for='icon'>圖示：</label><select name='icon' style='padding:0px'><option value='icon-docs'>文件</option><option value='icon-tag'>標籤</option><option value='icon-wallet'>錢包</option><option value='icon-paperclip'>迴紋針</option></select>"+
        "<label for='title' style='margin-left:10px;'>標題：</label><input type='text' name='title' class='title' value='"+ _config.title8 +"' class='text ui-widget-content ui-corner-all'></input> "+
        "<label for='link' style='margin-left:10px;'>連結：</label><input type='text' name='link' class='link' value='"+ _config.link8 +"' class='text ui-widget-content ui-corner-all'></input> "+
        "<button class='create-bookmark' style='margin-left:10px;'>儲存</button>"+
        "<button class='clear-bookmark' style='margin-left:10px;'>重置</button>"+
        "</fieldset>"+
        "<fieldset id='groupBookmark_9'><legend>書籤9</legend>"+
        "<label for='icon'>圖示：</label><select name='icon' style='padding:0px'><option value='icon-docs'>文件</option><option value='icon-tag'>標籤</option><option value='icon-wallet'>錢包</option><option value='icon-paperclip'>迴紋針</option></select>"+
        "<label for='title' style='margin-left:10px;'>標題：</label><input type='text' name='title' class='title' value='"+ _config.title9 +"' class='text ui-widget-content ui-corner-all'></input> "+
        "<label for='link' style='margin-left:10px;'>連結：</label><input type='text' name='link' class='link' value='"+ _config.link9 +"' class='text ui-widget-content ui-corner-all'></input> "+
        "<button class='create-bookmark' style='margin-left:10px;'>儲存</button>"+
        "<button class='clear-bookmark' style='margin-left:10px;'>重置</button>"+
        "</fieldset>"+
        "</div>"+
        //"<div id='dialog-tabs-2'>"+
        //"<table><tbody>"+
        //"<tr><td>一鍵訓練</td><td><input type='checkbox' checked='checked' value='true'></input></td></tr>"+
        //"<tr><td>「塗鴉牆」頁面增加快速切換功能</td><td><input type='checkbox' checked='checked' value='true'></input></td></tr>"+
        //"<tr><td>「交易紀錄」頁面進階搜尋功能</td><td><input type='checkbox' checked='checked' value='true'></input></td></tr>"+
        //"<tr><td>「戰場統計」頁面增加「顯示戰場裝備掉落」功能</td><td><input type='checkbox' checked='checked' value='true'></input></td></tr>"+
        //"<tr><td>「寄件匣」頁面增加「快速回覆」功能</td><td><input type='checkbox' checked='checked' value='true'></input></td></tr>"+
        //"<tr><td>「撰寫信件」頁面增加「之前的訊息」功能</td><td><input type='checkbox' checked='checked' value='true'></input></td></tr>"+
        //"<tr><td>「之前的訊息」頁面增加「快速回覆」功能</td><td><input type='checkbox' checked='checked' value='true'></input></td></tr>"+
        //"<tr><td>移除「通知」頁面的「刪除全部」功能</td><td><input type='checkbox' checked='checked' value='true'></input></td></tr>"+
        //"<tr><td>移除「收信匣」頁面的「刪除全部」功能</td><td><input type='checkbox' checked='checked' value='true'></input></td></tr>"+
        //"</tbody></table>"+
        //"</div>"+
        "<div id='dialog-tabs-3'>"+
        "<fieldset><legend>套件作者</legend>"+
        "<img src='http://www.gravatar.com/avatar/c73c007bb64cabff459b1804a7aa28f2.jpg' style='float:left; width:80px; height:80px; padding: 10px 10px 0px 10px;'>"+
        "<p>e-Sim Traditional Chinese Helper</p>"+
        "<p>首頁：<a href='http://userscripts.org/scripts/show/176642' target='_blank'>http://userscripts.org/scripts/show/176642</a></p>"+
        "<p>作者：<a href='http://secura.e-sim.org/profile.html?id=40752' target='_blank'>calin</a> @ seucra / <a href='http://www.erepublik.com/en/citizen/profile/4633793' target='_blank'>blackca</a> @ erep</p>"+
        "</fieldset>"+
        "<fieldset><legend>進階設定</legend><ul>"+
        "<li>設定國家代碼："+
        "<input id='setCountryId' type='text'  style='margin-left:10px;' class='text ui-widget-content ui-corner-all' value='"+ current_Home(_config.countryId) +"'></input> "+
        "<button class='create-countryId' style='margin-left:10px;'>儲存</button>"+
        "<button class='clear-countryId' style='margin-left:10px;'>重置</button></li>( 國家代碼，台灣: 32 , 中國: 28 )"+
        "<li>清空所有儲存在本機端的資料與設定："+
        "<button class='clear-alldata' style='margin-left:10px; margin-right:10px'>初始化</button></li>"+
        "</ul></fieldset>"+
        "</div>"
        );
      $('#tools-dialog-form .create-bookmark').click(function(){ saveBookmark($(this)); return!1; });
      $('#tools-dialog-form .clear-bookmark').click(function(){ clearBookmark($(this)); return!1; });
      $('#tools-dialog-form .create-countryId').click(function(){ saveCountryId($(this)); return!1; });
      $('#tools-dialog-form .clear-countryId').click(function(){ clearCountryId($(this)); return!1; });
      $('#tools-dialog-form .clear-alldata').click(function(){ clearSetting($(this)); return!1; });
    }
    function clearBookmark(element) {
      var obj=element.parent(), id=obj.attr('id').split('_').pop();
      $('#groupBookmark_'+id).find('select').val('icon-docs');
      $('#groupBookmark_'+id).find('input.link').val('#').removeClass("ui-state-error");
      $('#groupBookmark_'+id).find('input.title').val('書籤 '+id).removeClass("ui-state-error");
      $('#linkBookmark_'+id).attr('href','#');
      $('#linkBookmark_'+id).parent().find('font').text('書籤 '+id);
      $('#linkBookmark_'+id).parent().find('i').attr('class','icon-docs');
      
      vars_Sav('icon'+id, 'icon-docs');
      vars_Sav('title'+id, '書籤 '+id);
      vars_Sav('link'+id, '#');
    }
    function saveBookmark(element) {
      var obj=element.parent(), 
        id=obj.attr('id').split('_').pop(), icon=obj.find('select').attr('value'), 
        title=obj.find('input.title').attr('value'), link=obj.find('input.link').val();
      if (title !== '' && link !== '') {
        $('#linkBookmark_'+id).attr('href',link);
        $('#linkBookmark_'+id).parent().find('font').text(title);
        $('#linkBookmark_'+id).parent().find('i').attr('class',icon);
        $('#groupBookmark_'+id).find('input').removeClass('ui-state-error');
        
        vars_Sav('icon'+id, icon);
        vars_Sav('title'+id, title);
        vars_Sav('link'+id, link);
      } else {
        if (title === '') $('#groupBookmark_'+id).find('input.title').addClass('ui-state-error');
          else $('#groupBookmark_'+id).find('input.title').removeClass('ui-state-error');
        if (link === '') $('#groupBookmark_'+id).find('input.link').addClass('ui-state-error');
          else $('#groupBookmark_'+id).find('input.link').removeClass('ui-state-error');
      }
    }
    function clearCountryId(element){
      $('#setCountryId').val('32');
      vars_Sav('countryId','32');
      alert('設定已變更，請重新整理網頁，讓設定生效。');
    }
    function saveCountryId(element) {
      var country=$('#setCountryId').val();
      vars_Sav('countryId',country);
      alert('設定已變更，請重新整理網頁，讓設定生效。');
    }
    function clearSetting(element) {
      var res = confirm('清空設定為不可還原之動作，請問是否要繼續？');
      if( res ) {
        vars_Clearall();
        alert('已清空並重置所有資料，請重新整理網頁，讓設定生效。');
      }
    }
    $("#tools-dialog-form").tabs().dialog({
      autoOpen: true, height: 'auto', width: 730, maxWidth: 730, modal: true,
      close: function() {
        $('#tools-dialog-form input').removeClass("ui-state-error");
      }
    }); TimeofEve();
  }
  function c_checkTrain() {
    if (0<$("#taskButtonTrain").length) $("#taskButtonTrain").click(function(){ sendTrain(); return!1; });
    function sendTrain() {
      $.ajax({
        url: 'train.html', type: 'POST', async: false,
        success: function(data) {
          if (data!==null) window.location.href='train.html';
          else setTimeout(function(){ sendTrain(); }, 1000);
        }
      });
    }
  }
  function findUrlObj(){var a={};window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,function(d,b,c){a[b]=c});return a};
  function init() {
    c_LoadConfig();
    c_addTopBarMenu();
    if (vars_Url.indexOf(url.shouts) >= 0) {
      if(current_Serv('primera') || current_Serv('secura') || current_Serv('suna')) c_addShoutQuickLink();
    } else if (vars_Url.indexOf(url.news) >= 0) {
      if(current_Serv('primera') || current_Serv('secura') || current_Serv('suna')) c_addNewsQuickLink();
    } else if (vars_Url.indexOf(url.notifications) >= 0) {
      $("form[action='notifications.html'][method='POST'] input[type='submit']").remove();
      $("form#command input[type='submit']").remove();
    } else if (vars_Url.indexOf(url.inboxMessages) >= 0) {
      $("#deleteMessagesButton").hide();
    } else if (vars_Url.indexOf(url.transactionLog) >= 0) {
      c_TransactionLog();
    } else if (vars_Url.indexOf(url.conversation) >= 0) {
      c_addMailQuickReply();
    } else if (vars_Url.indexOf(url.sentMessages) >= 0) {
      c_addMailPreviousMsg();
    } else if (vars_Url.indexOf(url.composeMessage) >= 0) {
      c_addMailCoversation();
    } else if (vars_Url.indexOf(url.battleStatistics) >= 0) {
      c_addBattleDrop();
    }
    if($("form[action='login.html']").length === 0) {
      c_checkTrain();
      c_addHideMedkit();
      c_addShoutImgLink();
      $("#userMenu form[action='editCitizen.html#changeLanguage'] button:first").replaceText("Change language","更改您的語言");
    } else {
      $("#command b:contains('Login')").replaceText('Login','帳號');
      $("#command b:contains('Password')").replaceText('Password','密碼');
      $("#command input[value='Login']").attr('value','登入');
      $("#forgotPasswordLink").text('忘記密碼?');
      $("#registerFormLink").text('註冊');
    }
  } init();
};
if(window.top === window.self) {
  var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML =
      ".flags-small.Gold{border:none}"+
      ".shoutContainer .shoutImage:hover{cursor:pointer} .articleImage{max-height:700px !important;}"+
      ".top-bar-section .dropdown li.bmark:hover a{background: url(../img/bg3.png) repeat scroll 0 0 #444444 !important;}"+
      ".top-bar-section .dropdown li.bmark a{background: url(../img/bg.png) repeat scroll 0 0 #222222 !important;}";
  var script = document.createElement('script');
    script.type = "text/javascript";
    script.textContent = '(' + main.toString() + ')();';
  document.head.appendChild(script);
  document.head.appendChild(css);
}