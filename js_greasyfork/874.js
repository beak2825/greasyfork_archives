// ==UserScript==
// @name           HKG LM finder F
// @namespace      http://userscripts.org/users/peach
// @version        4.2.4
// @description    HKGolden LM finder F
// @homepageURL    https://greasyfork.org/scripts/874-hkg-lm-finder-f
// @include        http://*.hkgolden.com/topics.aspx*
// @include        http://*.hkgolden.com/view.aspx*
// @include        http://*.hkgolden.com/*earch*.aspx*
// @include        http://*.hkgolden.com/secondHand.aspx*
// @exclude        http://*.hkgolden.com/*rofile*age.aspx*
// @exclude        http://m*.hkgolden.com/*
// @exclude        http://m.hkgolden.com/*
// @include        https://*.hkgolden.com/topics.aspx*
// @include        https://*.hkgolden.com/view.aspx*
// @include        https://*.hkgolden.com/*earch*.aspx*
// @include        https://*.hkgolden.com/secondHand.aspx*
// @exclude        https://*.hkgolden.com/*rofile*age.aspx*
// @exclude        https://m*.hkgolden.com/*
// @exclude        https://m.hkgolden.com/*
// @require        http://code.jquery.com/jquery-1.10.2.min.js
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_xmlhttpRequest
// @copyright      2013-2014, Xelio & Peach (The part of the program is based on HKG LM finder)
// @downloadURL https://update.greasyfork.org/scripts/874/HKG%20LM%20finder%20F.user.js
// @updateURL https://update.greasyfork.org/scripts/874/HKG%20LM%20finder%20F.meta.js
// ==/UserScript==

/*
HKG LM finder F (HKGolden LM finder F)
Copyright (C) 2013-2014 Xelio Cheong & Peach (The part of the program is based on HKG LM finder)

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

var $j = jQuery.noConflict();

// Define CSS Style (You can override it by other script, if you want to)
var lmStyle = '<style id="lm-style" type="text/css">';
lmStyle += '#lm-menu li{z-index: 1; position: fixed; left: 0; padding:4px; cursor: pointer; text-decoration: none; color: #808080; background: #FFF;}#lm-menu li:hover{color: #9ACD32}';
lmStyle += 'li#lm-finder{background:none;top: 2px}#lm-mel{top: 28px;}#lm-pm{top:54px}#lm-setting{top:80px}';
lmStyle += '#lm_message{display: none; z-index: 20; position: fixed; left: 50%; top: -30px; width: 600px; margin: 0 0 0 -300px; padding: 2px 0; background: #F7F3F7; border: 1px solid #000; border-width:0 1px 1px; text-align: center;}';
lmStyle += '#lm, #lm-setting{display: none;}';
lmStyle += '#lm_history{z-index: 15; width: 898px; position: fixed; left: 50%; top:0; margin: 42px 0 0 -450px; padding:0; background: #000; border: 1px solid #000; overflow-y: auto;}';
lmStyle += '#lm-finder-2, #lm-mel-2, #lm-pm-2{z-index: 10; position: fixed; left: 50%; top:0; width: 300px; margin: 0 0 0 -450px; padding:12px 0; color:#FFF; text-align: center; cursor: pointer;background: #333;}#lm-finder-2:hover, #lm-mel-2:hover, #lm-pm-2:hover{color: #9ACD32; background: #000;}';
lmStyle += '#lm-finder-2{margin: 0 0 0 -450px}#lm-mel-2{margin: 0 0 0 -150px}#lm-pm-2{margin: 0 0 0 150px}';
lmStyle += '#lm-mask{display: none; z-index: 5; position: fixed; left: 0; top: 0; width: 100%; height: 100%; background: gray;}';
lmStyle += '#lm_history table[cellpadding="2"][cellspacing="1"] > tbody > tr:not(:first-child):not([style]) {display: none;}';
lmStyle += '</style>';

var userID;
var errCode;

var ajaxTimeout = 15000;
var ajaxRequest;
var ajaxRequestTimer;

storeLocal = function(key, value) {
  if(typeof(value) !== 'undefined' && value !== null) {
    localStorage[key] = JSON.stringify(value);
  } else {
    localStorage.removeItem(key);
  }
};

loadLocal = function(key) {
  var objectJSON = localStorage[key];
  if(!objectJSON) return;
  return JSON.parse(objectJSON);
};

deleteLocal = function(key) {
  localStorage.remoteItem(key);
};

// Common functions

changeAndFlashMessage = function(message) {
  var messageDiv = $j('div#lm_message');
  messageDiv.html(message);
  // Show LM message
  messageDiv.stop();
  messageDiv.show().animate({"top": "0"},500);
};

clearMessage = function() {
  var messageDiv = $j('div#lm_message');
  // Hide LM message
  messageDiv.stop();
  messageDiv.delay(1000).animate({"top": "-30px"},1000, function(){messageDiv.hide(); messageDiv.html('');});
};

setup = function() {
  var message = 'Load緊呀等陣啦';
  changeAndFlashMessage(message);
};

handleError = function() {

  var message = '';
  if(errCode=='1'){
    message = '乜野都Load唔倒。';
    changeAndFlashMessage(message);
  } else if(errCode=='2'){
  var lmServer = loadLocal('lmServer') || 'forum6';
    message = '請將"' + lmServer + '.hkgolden.com"放入禁止Cookie清單。';
    changeAndFlashMessage(message);
  } else if(errCode=='3'){
    message = '請使用非會員伺服器。';
    changeAndFlashMessage(message);
  } else if(errCode=='4'){
    message = '搵唔倒起底資料。';
    changeAndFlashMessage(message);
  } else if(errCode=='5'){
    loadtime = parseInt(ajaxTimeout)/1000;
    message = 'Load左'+ loadtime + '秒都未load倒，你遲的再試下啦。';
    changeAndFlashMessage(message);
  } else {
    console.log('server error');
    message = 'Server有問題，你遲的再試下啦。';
  }

  changeAndFlashMessage(message);
};

// LM Start
requestLM = function(page) {

  var message = 'Load 緊';
  changeAndFlashMessage(message);

  //var lmServer = loadLocal('lmServer') || 'forum6';

  var lmServer;
  lmServer = window.location.href.match(/(forum\d+|forum|search|profile|archive)/)[0];

  if(page){storeLocal('lmPage', page);}
  var lmPage = loadLocal('lmPage') || '1';

  //var requestUrl = 'http://' + lmServer + '.hkgolden.com/ProfilePage.aspx?type=history&page=' + lmPage + '&yearFilter=3&filterType=all&sensormode=N&userid=' + userID;

  var requestUrl = '//' + lmServer + '.hkgolden.com/ProfilePage.aspx?type=post&page=' + lmPage + '&yearFilter=3&filterType=all&userid=' + userID;

  GM_xmlhttpRequest({
    method: "GET",
    url: requestUrl,
    timeout: ajaxTimeout,
    onload: function(response) {
      ajaxRequest = null;
      clearTimeout(ajaxRequestTimer);
      if(replaceContent(response)) {
      // success
      } else {
        handleError();
      }
    },
    ontimeout: function() {
      errCode='5';
      handleError();
    }
  });
};

// Handle data response
replaceContent = function(response) {
  var message = 'Load 完';
  changeAndFlashMessage(message);
  clearMessage();
  var data = response.responseText;
  var history;
  var hvCookie;
  var needLogin;

  if(!data || (data.length === 0)) {
    // No history in data response
    console.log('No data response');
    errCode='1';
    return false;
  }
  $j.each($j.parseHTML(data), function(i, el) {
    if(el.id === 'aspnetForm') {
      var doms = $j(el);

      hvCookie = doms.find('#ctl00_ContentPlaceHolder1_mp1');
      needLogin = doms.find('#ctl00_ContentPlaceHolder1_txt_email');
      history = doms.find('#ctl00_ContentPlaceHolder1_dataLabel');
      return false;
    }
  });

  /*if(hvCookie.length !== 0){
    console.log('Requested with Cookie');
    errCode='2';
    return false;
  }*/

  if(needLogin.length !== 0){
    console.log('Need Login');
    errCode='3';
    return false;
  }

    //if(history.find('#history>tbody>tr:eq(2)').length === 0) {
    if(history.find('#post>tbody>tr:eq(2)').length === 0) {
    console.log('No history found');
    //console.log(data);
    errCode='4';
    return false;
  }

  var lmPage = loadLocal('lmPage') || '1';

  $j('div#lm_history').html('<table id="lmTable" cellspacing="0" cellpadding="0" border="0" width="100%">' +
    '<tr><td align="right" class="title"><b><span id="ctl00_ContentPlaceHolder1_atLabel">於三個月內的全部貼文</span></b> ' +
    '<b>第<input name="pageTextBox" type="text" value="' + lmPage + '" id="pageTextBox" onkeypress="return isNumberKey(event)" style="width:25px;">頁</b>' +
    '<input type="submit" name="pageGoBtn" value="Go" id="pageGoBtn">&nbsp;&nbsp;' +
    '<input type="submit" name="previousBtn" value="上一頁" id="previousBtn">' +
    '<input type="submit" name="nextBtn" value="下一頁" id="nextBtn">'+
    '</td></tr></table>' + history.html());

  buttonTriggerLM();

  // Display modal box when history was successfully loaded
  $j('div#lm').fadeIn(800);
  $j('div#lm-mask').fadeTo(500, 0.7);

  // Update modal box height to fit the viewport
  var wHeight = $j(window).height() - 72;
  $j('div#lm_history').css('height', 'auto');
  if($j('div#lm_history').height() > wHeight) $j('div#lm_history').css('height', wHeight+'px');

  console.log('LM request finished');

  return true;
};

buttonTriggerLM = function() {

  lmPageGo = function(e) {
    e.preventDefault();
    var page = history.find('#pageTextBox').val();
    storeLocal('lmPage', page);
    requestLM();
    return false;
  };

  previousBtn = function(e) {
    e.preventDefault();
    var lmPage = loadLocal('lmPage') || '1';
    var page = parseInt(lmPage) - 1;
    if(page<1) { page = '1'; }
    storeLocal('lmPage', page);
    requestLM();
    return false;
  };

  nextBtn = function(e) {
    e.preventDefault();
    var lmPage = loadLocal('lmPage') || '1';
    var page = parseInt(lmPage) + 1;
    storeLocal('lmPage', page);
    requestLM();
    return false;
  };

  var history = $j('div#lm_history');

  history.find('#pageGoBtn').click(lmPageGo);
  history.find('#previousBtn').click(previousBtn);
  history.find('#nextBtn').click(nextBtn);

};
// LM End

// Ming E Lau Start
requestMEL = function() {

  var message = 'Load 緊';
  changeAndFlashMessage(message);

  var bmType = loadLocal('bmType') || 'lastPost';
  var bmPage = loadLocal('bmPage') || '1';

  var requestUrl = '//' + window.location.hostname + '/ProfilePage.aspx?type=bookmark&page=' + bmPage + '&orderType=' + bmType + '&userid=' + userID;

  GM_xmlhttpRequest({
    method: "GET",
    url: requestUrl,
    timeout: ajaxTimeout,
    onload: function(response) {
      ajaxRequest = null;
      clearTimeout(ajaxRequestTimer);
      if(replaceContent2(response)) {
      // success
      } else {
        handleError();
      }
    },
    ontimeout: function() {
      errCode='5';
      handleError();
    }
  });
};

// Handle data response
replaceContent2 = function(response) {
  var message = 'Load 完';
  changeAndFlashMessage(message);
  clearMessage();
  var data = response.responseText;
  var history;

  if(!data || (data.length === 0)) {
    // No history in data response
    console.log('No data response');
    return false;
  }

  $j.each($j.parseHTML(data), function(i, el) {
    if(el.id === 'aspnetForm') {
      var doms = $j(el);
      history = doms.find('#ctl00_ContentPlaceHolder1_dataLabel');
      bmTotal = doms.find('#ctl00_ContentPlaceHolder1_totalBM');
      return false;
    }
  });

  if(history.length === 0) {
    console.log('No history found');
    //console.log(data);
    return false;
  }

  history.find('#bookmark tbody tr').find('td:eq(6)').remove();
  history.find('#bookmark tbody tr:eq(0) td:eq(5)').remove();

  var bmType = loadLocal('bmType') || 'lastPost';
  var bmPage = loadLocal('bmPage') || '1';
  var lp='';
  var bm='';

  if(bmType=='lastPost') {
    lp=' selected="selected"';
  } else {
    bm=' selected="selected"';
  }

  $j('div#lm_history').html('<table id="bookmarkTable" cellspacing="0" cellpadding="0" border="0" width="100%">' + 
    '<tr><td align="right" class="title"><span id="bmTotal">' + bmTotal.html() + '</span>' +
    '<select name="bmOrder" id="bmOrder"><option' + lp + ' value="lastPost">以最後回應時間排列</option><option' + bm + ' value="bookmark">以加入留明時間排列</option></select>' +
    '<b>第<input name="pageTextBox" type="text" value="' + bmPage + '" id="pageTextBox" onkeypress="return isNumberKey(event)" style="width:25px;">頁</b>' +
    '<input type="submit" name="pageGoBtn" value="Go" id="pageGoBtn">&nbsp;&nbsp;' +
    '<input type="submit" name="previousBtn" value="上一頁" id="previousBtn">' +
    '<input type="submit" name="nextBtn" value="下一頁" id="nextBtn">'+
    '</td></tr></table>' + history.html());

  buttonTrigger();

  // Display modal box when history was successfully loaded
  $j('div#lm').fadeIn(800);
  $j('div#lm-mask').fadeTo(500, 0.7);

  // Update modal box height to fit the viewport
  var wHeight = $j(window).height() - 72;
  $j('div#lm_history').css('height', 'auto');
  if($j('div#lm_history').height() > wHeight) $j('div#lm_history').css('height', wHeight+'px');

  console.log('MEL request finished');

  return true;
};

buttonTrigger = function() {

  bmPageGo = function(e) {
    e.preventDefault();
    var page = history.find('#pageTextBox').val();
    var type = history.find('#bmOrder').val();
    storeLocal('bmType', type);
    storeLocal('bmPage', page);
    requestMEL();
    return false;
  };

  previousBtn = function(e) {
    e.preventDefault();
    var bmPage = loadLocal('bmPage') || '1';
    var page = parseInt(bmPage) - 1;
    var type = history.find('#bmOrder').val();
    storeLocal('bmType', type);
    if(page<1) { page = '1'; }
    storeLocal('bmPage', page);
    requestMEL();
    return false;
  };

  nextBtn = function(e) {
    e.preventDefault();
    var bmPage = loadLocal('bmPage') || '1';
    var page = parseInt(bmPage) + 1;
    var type = history.find('#bmOrder').val();
    storeLocal('bmType', type);
    if(page>25) { page = '25'; }
    storeLocal('bmPage', page);
    requestMEL();
    return false;
  };

  var history = $j('div#lm_history');

  history.find('#pageGoBtn').click(bmPageGo);
  history.find('#previousBtn').click(previousBtn);
  history.find('#nextBtn').click(nextBtn);

};
// Ming E Lau End

// PM Start
requestPM = function() {

  var message = 'Load 緊';
  changeAndFlashMessage(message);

  var pmPage = loadLocal('pmPage') || '1';

  var requestUrl = '//' + window.location.hostname + '/ProfilePage.aspx?&type=pm&page=' + pmPage + '&userid=' + userID;

  GM_xmlhttpRequest({
    method: "GET",
    url: requestUrl,
    timeout: ajaxTimeout,
    onload: function(response) {
      ajaxRequest = null;
      clearTimeout(ajaxRequestTimer);
      if(replaceContent3(response)) {
      // success
      } else {
        handleError();
      }
    },
    ontimeout: function() {
      errCode='5';
      handleError();
    }
  });
};

// Handle data response
replaceContent3 = function(response) {
  var message = 'Load 完';
  changeAndFlashMessage(message);
  clearMessage();
  var data = response.responseText;
  var history;

  if(!data || (data.length === 0)) {
    // No history in data response
    console.log('No data response');
    return false;
  }

  $j.each($j.parseHTML(data), function(i, el) {
    if(el.id === 'aspnetForm') {
      var doms = $j(el);
      history = doms.find('#ctl00_ContentPlaceHolder1_dataLabel');
      return false;
    }
  });

  if(history.length === 0) {
    console.log('No history found');
    //console.log(data);
    return false;
  }

  history.find('#pm tbody tr').find('td:eq(3)').remove();

  var pmPage = loadLocal('pmPage') || '1';

  $j('div#lm_history').html('<div id="DivShowPM" style="display:none;"> <div class="TransparentGrayBackground"></div> <div class="ListPMText"> <table width="100%" border="0" cellspacing="1" cellpadding="1" align="center"> <tr> <td> <table width="100%" border="0" cellspacing="0" cellpadding="0"> <tr> <td> <table width="100%" border="0" cellspacing="0" cellpadding="0"> <tr> <td class="title" width="2%"><img src="images/left_menu/p.jpg" alt="" width="22" height="21" /></td> <td class="title" width="98%" align="left"><b>訊息內容 - <span id="spanPMMessageTitle"></span></b></td> </tr> </table> </td> </tr> <tr> <td valign="top"><img src="images/index_images/blank.gif" alt="" width="1" height="1" /></td> </tr> <tr> <td height="8" valign="top" bgcolor="#CCDDEA"><img src="images/index_images/blank.gif" alt="" width="5" height="8" /></td> </tr> <tr> <td valign="top" class="main_table1" align="left"> <div id="divPMMessageBody"></div> </td> </tr> </table> </td> </tr> </table> <input type="Button" value="關閉" onclick="Javascript: $get(\'DivShowPM\').style.display = \'none\';" /> </div> </div>' + 
  '<table id="pmTable" cellspacing="0" cellpadding="0" border="0" width="100%">' +
  '<td align="right" class="title"><b>第<input name="pageTextBox" type="text" value="' + pmPage + '" id="pageTextBox" onkeypress="return isNumberKey(event)" style="width:25px;">頁</b>' +
  '<input type="submit" name="pageGoBtn" value="Go" id="pageGoBtn">&nbsp;&nbsp;' +
  '<input type="submit" name="previousBtn" value="上一頁" id="previousBtn">' +
  '<input type="submit" name="nextBtn" value="下一頁" id="nextBtn">' +
  '</td></tr></table>' + history.html());

  buttonTrigger2();

  // Display modal box when history was successfully loaded
  $j('div#lm').fadeIn(800);
  $j('div#lm-mask').fadeTo(500, 0.7);

  // Update modal box height to fit the viewport
  var wHeight = $j(window).height() - 72;
  $j('div#lm_history').css('height', 'auto');
  if($j('div#lm_history').height() > wHeight) $j('div#lm_history').css('height', wHeight+'px');

  console.log('PM request finished');

  return true;
};

buttonTrigger2 = function() {

  pmPageGo = function(e) {
    e.preventDefault();
    var page = history.find('#pageTextBox').val();
    storeLocal('pmPage', page);
    requestPM();
    return false;
  };

  previousBtn = function(e) {
    e.preventDefault();
    var pmPage = loadLocal('pmPage') || '1';
    var page = parseInt(pmPage) - 1;
    if(page<1) { page = '1'; }
    storeLocal('pmPage', page);
    requestPM();
    return false;
  };

  nextBtn = function(e) {
    e.preventDefault();
    var pmPage = loadLocal('pmPage') || '1';
    var page = parseInt(pmPage) + 1;
    storeLocal('pmPage', page);
    requestPM();
    return false;
  };

  var history = $j('div#lm_history');

  history.find('#pageGoBtn').click(pmPageGo);
  history.find('#previousBtn').click(previousBtn);
  history.find('#nextBtn').click(nextBtn);

};
// PM End

// Setting Start
settingLM = function() {
  var lmServer = loadLocal('lmServer') || 'forum6';
  var serverList = ['forum1', 'forum2', 'forum3', 'forum4', 'forum5', 'forum6', 'forum7', 'forum8', 'forum9', 'forum14', 'forum15', 'archive'];
  var message = '<div id="lm-setting">請選擇起底專用Server <select name="lmServer" id="lmServer">';
  serverList.forEach(function(server) {
   message += '<option value="' + server + '">' + server + '</option>';
  });
  message += '</select> <input type="submit" name="saveSetting" value="Save" id="saveSetting"></div>';

  changeAndFlashMessage(message);


  saveSetting = function(e) {
    e.preventDefault();
    var lmMessage = $j('div#lm_message');
    storeLocal('lmServer', lmMessage.find("#lmServer").val());
    var message = '已Save';
    changeAndFlashMessage(message);
    clearMessage();
    return false;
  };

  setTimeout(function() {
    var lmMessage = $j('div#lm_message');
    lmMessage.find("#lmServer").val(lmServer);
    lmMessage.find('#lm-setting').css("display", "block");
    lmMessage.find('#saveSetting').click(saveSetting);
  }, 100);
};
// Setting End

// Wait 500ms; Sometimes HKG loading is very slow, if after 500ms does not get the userID, this script will not active.
setTimeout(function() {

  // Get User ID
  if($j('#ctl00_ContentPlaceHolder1_view_form').length !== 0) {
    userID = $j('#ctl00_ContentPlaceHolder1_view_form>table:eq(0) a[href^="ProfilePage.aspx?userid="]:eq(0)').attr('href').replace(/[^0-9]/g, '');
  } else {
    userID = $j('.ContentPanel>table:eq(0) a[href^="ProfilePage.aspx?userid="]:eq(0)').attr('href').replace(/[^0-9]/g, '');
  }

  if(userID) {

    $j('head').append(lmStyle);
    $j('body').append('<ul id="lm-menu"><li id="lm-finder">起底</li><li id="lm-mel">名已留</li><li id="lm-pm">PM</li>' + //<li id="lm-setting">設定</li></ul>' +
                      '<div id="lm_message"></div>' +
                      '<div id="lm"><div id="lm_history"></div><div id="lm-finder-2">起底</div><div id="lm-mel-2">名已留</div><div id="lm-pm-2">PM</div></div>' +
                      '<div id="lm-mask"></div>');

    $j('#lm-mel').css("opacity", "0");
    $j('#lm-pm').css("opacity", "0");
    $j('#lm-setting').css("opacity", "0");
    $j('#lm-finder-2').css("opacity", "0.7");
    $j('#lm-mel-2').css("opacity", "0.7");
    $j('#lm-pm-2').css("opacity", "0.7");

    $j('#lm-menu').hover(function(){
      $j('#lm-mel').stop().css("display", "block").animate({"opacity": "1"},500);
      $j('#lm-pm').stop().css("display", "block").animate({"opacity": "1"},500);
      $j('#lm-setting').stop().css("display", "block").animate({"opacity": "1"},500);
    },function(){
      $j('#lm-mel').stop().animate({"opacity": "0"},500, function(){$j('#lm-mel').hide();});
      $j('#lm-pm').stop().animate({"opacity": "0"},500, function(){$j('#lm-pm').hide();});
      $j('#lm-setting').stop().animate({"opacity": "0"},500, function(){$j('#lm-setting').hide();});
    });

    $j('#lm-finder').click(function () {requestLM(1);});
    $j('#lm-finder-2').click(function () {requestLM(1);});

    $j('#lm-mel').click(function () {requestMEL();});
    $j('#lm-mel-2').click(function () {requestMEL();});

    $j('#lm-pm').click(function () {requestPM();});
    $j('#lm-pm-2').click(function () {requestPM();});

    $j('#lm-setting').click(function () {settingLM();});

    closeHistory = function() {
      $j('div#lm').fadeOut(500);
      $j('div#lm-mask').fadeOut(800);
    };

    $j('#lm-mask').click(function () {closeHistory();});
  }

  var script = document.createElement('script');
  script.type = "text/javascript";
  script.innerHTML = "function isNumberKey(evt) { \n\
    var charCode = (evt.which) ? evt.which : event.keyCode \n\
    if (charCode > 31 && (charCode < 48 || charCode > 57)) { \n\
      return false; \n\
    } \n\
    return true; \n\
  } \n\
  function GetMessageBody(id, title) { \n\
    if ($get('ctl00_ContentPlaceHolder1_siteUpdateProgressPM') != null) { \n\
      $get('ctl00_ContentPlaceHolder1_siteUpdateProgressPM').style.display = ''; \n\
      PutBoxToMiddle($get('ctl00_ContentPlaceHolder1_siteUpdateProgressPM'), 150, 30); \n\
    } \n\
    PageMethods.GetPMMessageBody(id, onGetPMBodySucceed, onGetPMBodyFailed); \n\
    $get('spanPMMessageTitle').innerHTML = title; \n\
  } \n\
   \n\
  function onGetPMBodySucceed(result, userContext, methodName) { \n\
    if ($get('ctl00_ContentPlaceHolder1_siteUpdateProgressPM') != null) { \n\
      $get('ctl00_ContentPlaceHolder1_siteUpdateProgressPM').style.display = 'none'; \n\
    } \n\
    $get('divPMMessageBody').innerHTML = result; \n\
    PutBoxToMiddle($get('DivShowPM'), document.documentElement.clientWidth-220, 300); \n\
    $get('DivShowPM').style.display = ''; \n\
    $get('DivShowPM').style.top = '25px'; \n\
  } \n\
   \n\
  function onGetPMBodyFailed(error, userContext, methodName) { \n\
    if ($get('ctl00_ContentPlaceHolder1_siteUpdateProgressPM') != null) { \n\
        $get('ctl00_ContentPlaceHolder1_siteUpdateProgressPM').style.display = 'none'; \n\
    } \n\
    alert('An error occurred') \n\
  }var PageMethods = function() { \n\
  PageMethods.initializeBase(this); \n\
  this._timeout = 0; \n\
  this._userContext = null; \n\
  this._succeeded = null; \n\
  this._failed = null; \n\
  } \n\
  PageMethods.prototype = { \n\
  _get_path:function() { \n\
   var p = this.get_path(); \n\
   if (p) return p; \n\
   else return PageMethods._staticInstance.get_path();}, \n\
  GetPMMessageBody:function(PM_ID,succeededCallback, failedCallback, userContext) { \n\
  return this._invoke(this._get_path(), 'GetPMMessageBody',false,{PM_ID:PM_ID},succeededCallback,failedCallback,userContext); }} \n\
  PageMethods.registerClass('PageMethods',Sys.Net.WebServiceProxy); \n\
  PageMethods._staticInstance = new PageMethods(); \n\
  PageMethods.set_path = function(value) { PageMethods._staticInstance.set_path(value); } \n\
  PageMethods.get_path = function() { return PageMethods._staticInstance.get_path(); } \n\
  PageMethods.set_timeout = function(value) { PageMethods._staticInstance.set_timeout(value); } \n\
  PageMethods.get_timeout = function() { return PageMethods._staticInstance.get_timeout(); } \n\
  PageMethods.set_defaultUserContext = function(value) { PageMethods._staticInstance.set_defaultUserContext(value); } \n\
  PageMethods.get_defaultUserContext = function() { return PageMethods._staticInstance.get_defaultUserContext(); } \n\
  PageMethods.set_defaultSucceededCallback = function(value) { PageMethods._staticInstance.set_defaultSucceededCallback(value); } \n\
  PageMethods.get_defaultSucceededCallback = function() { return PageMethods._staticInstance.get_defaultSucceededCallback(); } \n\
  PageMethods.set_defaultFailedCallback = function(value) { PageMethods._staticInstance.set_defaultFailedCallback(value); } \n\
  PageMethods.get_defaultFailedCallback = function() { return PageMethods._staticInstance.get_defaultFailedCallback(); } \n\
  PageMethods.set_path('/ProfilePage.aspx'); \n\
  PageMethods.GetPMMessageBody= function(PM_ID,onSuccess,onFailed,userContext) {PageMethods._staticInstance.GetPMMessageBody(PM_ID,onSuccess,onFailed,userContext); }";
  document.getElementsByTagName('head')[0].appendChild(script);

}, 500);