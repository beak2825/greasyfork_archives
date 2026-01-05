// ==UserScript==
// @name         WME Norm Name
// @namespace    https://greasyfork.org/users/5252
// @version      0.4.3
// @description  Standardize street names according to local and national convention
// @include      https://beta.waze.com/*editor*
// @include      https://www.waze.com/*editor*
// @exclude      https://www.waze.com/*user/editor/*
// @author       sketch,bgodette
// @copyright    2015-18 sketch,bgodette,davielde,TheLastTaterTot,justins83
// @grant        none
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/8548/WME%20Norm%20Name.user.js
// @updateURL https://update.greasyfork.org/scripts/8548/WME%20Norm%20Name.meta.js
// ==/UserScript==
// After testing the popup, change line 109.  It now says "if (true) in order to show the popup on every load. -- Voludu

function initNormNotice(){
    var panelHeight=350, panelWidth=540;

    $("<style>")
    .prop("type", "text/css")
    .html('.NormPG { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);' +
          '          width: ' + panelWidth + 'px; ' + //height: ' +    // + panelHeight + 'px; '
          '          padding: 10px 20px; margin: 0; overflow-y: auto; overflow-x: auto; word-wrap: break-word;' +
          '          background-color: white; box-shadow: 0px 5px 20px #555555;' +
          '          border: 1px solid #858585; border-radius: 10px; }\n' +
          ".NormPG h2  { margin-top:10px; margin-bottom: 10px; font-size: 20pt; font-weight: bold; text-align: left; color: #C0C0C0 }\n" +
          '.NormPG-hr  { display: block; border: 0; height: 0; border-top: 1px solid rgba(0, 0, 0, 0.1);' +
          '             border-bottom: 1pxi solid rgba(255, 255, 255, 0.3);' +
          '             margin-top: 8px; margin-bottom: 12px; }\n' +
          '.NormPG-btn-container { position: relative; display: table; margin: 15px auto 10px; vertical-align: middle; padding: 0}\n' +
          '.NormPG-btn { margin: 0px 5px; padding: 0px 15px; display: inline-block; height: 32px; }\n'
    )
    .appendTo("head");


    var NormNoticeDiv= '<div id="NormNoticePanel" class="NormPG" >' +
        '<h2>Norm Name</h2>' +
        '<div id="NormNotice">Test</div>' +
        '<div class="NormPG-btn-container">' +
                '       <button id="btnNormOK" class="btn btn-default NormPG-btn">OK</button></div>' +
        "</div>";
    ($('#map').append(NormNoticeDiv));

    $('#NormNoticePanel').hide();

    $('#btnNormOK').click (function() {
        $('#NormNoticePanel').hide();
    });
}

function NormNotice(NormNoticeText){
    $("#NormNotice").html(NormNoticeText);
    $("#NormNoticePanel").show();
}

function initNormName(){
    //Alert on update
    var updateAlert = true;
    var normVersion = GM_info.script.version;
    var normChanges = `
<p>Hey. It's Norm. I'm new today. My version number is <b>` + normVersion + `</b>.</p>
<p style=\"color: red;\">Always open the console (F12) and check every single change I make BEFORE you save.
I'm only as good as my regex, and I've been known to make serious mistakes, especially when segment names are mangled in unexpected ways.</p>
<p>Check out all my cool new stuff.<ul>
       <li>Script: ∅</li>
       <li>National: fix for something that made "Exit 70: S:" happen for some reason</li>
       <li>New states: ∅</li>
       <li>Updated states:<ul>
       		<li><b>La.</b>: "State Rd" handling</li>       
       </ul></li>
       <li>Bugs fixed: ∅</li>
</ul></p>`;


    if (updateAlert && localStorage.normVersion !== normVersion) {
        initNormNotice();
        NormNotice(normChanges);
        localStorage.normVersion = normVersion;
    }

    //Get stored keyboard shortcut
    if (localStorage.NormName) {
        var nnShortcut = JSON.parse(localStorage.NormName);
    }
    else{
        var nnShortcut = '';
    }
    //Save keyboard shortcut
    function saveNNShortcut(){
        nnShortcut = W.accelerators.Actions.normName.shortcut.keyCode;
        localStorage.NormName = JSON.stringify(nnShortcut);
    }
    window.addEventListener("beforeunload", saveNNShortcut, false);

    //Only allow if rank 4 or higher
    var rankCheck = W.loginManager.user.normalizedLevel;
    if(rankCheck >= 4){
       //Add icon to toolbar
        $('<div class="NormNameIcon toolbar-separator toolbar-button">').prependTo($('#edit-buttons div:first-child').first());
        $('#edit-buttons')[0].style.width = ($('#edit-buttons')[0].offsetWidth+62)+'px';

        var normCss = '#toolbar .NormNameIcon { width: 62px; float: right; margin: 0px; background-color: transparent; background-size: initial; background-position: 50% 50%; background-repeat: no-repeat; background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4AAAA8CAYAAAA+CQlPAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAB3RJTUUH4AINBxQmq9Z+sgAABMRJREFUaN7tmj9oG3cUx9/dCbsIGqfpELoVDIXKUy9oLjIxJEvhQIm6KE3SThI1BDoII3CuGOGhZDjwUUqTISqEQ6aiWUoRyB0NJpfBnAMGka3gwVBhoiLb6nWwnvjp9NP90f1+p1PSBx50FtLv8973/fk9G+B/e7dMiMMhMsWyTb5uaKqUkKR/31pwJ7Cb7WxtCDMLHgSUN7wwK9Cs4YVZAWbtAGEWoVk4QOR9qKufLJlxdK4YxaF4w8dK6lHIPIzkRXhHTYwy2oV8zoyLwhJReLeQz5nLS4uwkJwHJa2a9b0D6vv0qiHPbI47PY/QAAALyfnB83anO/IMrb53MLET/OY694gjNMIiKA0YTUmnQEmrZrvThabV4qIEkbfE3QC97CI1UrC9uWayznUximiHgUcLAj9VqW9vrg1FmwV8bKVOkxkWsbDWtFoQ+4gX8jkzW6rIbgp4KwcY2rDStFoTRZ+VYrj2ca+KWsjnTCWdGgEapwTyPU4FxaaPIzRGGntvQ7uY1MheTOvPzkGHV6S55HhDU02cvEgQp/RpQ4leNWSdU+uKLMeXlxYHPbzd6Q5eo8zHXVjwWbZUkVlX8UiqujNnnbIdKCGfM8nI61VD5nmD4wKOMqcVqKbVAiWdojpgud/m2p2u7wLGYhnBNOK0G1fTag1dVGi3NLy8jIs2D9kzyfFMsWyvrK6P5CXmN4LSABaS84MqjrXA6aiZKW4YxabV8j2jowPwJyj81HduGFVsWSur63K704X63sFQpffbp/3cxxuampxacSMHF93xOyxaOjGoYMFjMaYmJOmfqUrd76YEpewEJJXQtFq+ilpDUy/FbgNDG1T0qiHjshEvLk7pB6niCUk6mfoAQ8qdBN7eXBu6pmI6FPI5k/eEFtnktry0CNCHxqElDBw6kfwsFstHJlLf2doQaIdBSSvpFDQ01aQNKFjpaf0bP5Oc+sjvCfOnYi6zOgKQBWpwUdEu1sbZUkV269Uk4Mrquhy2b3NbRGSKZZu8TnoNLmT1Jh3lR8YNTZ1LSNJZbCY3jC5P6H4lPwt7VuarJ7elIgk8Sf9nIXHmEcfVk9dSkYTWq4YcBLqhqe+xOq/AEtrZ08niFUTKd24pJgDA01pdZhllpuAs//MBgdEQnAe8EAdoBP7i2qcAAPD8xash6NjkeG13/yNe0H6cfd7rCS9f//VBpBGv7e5/rleNP3kBP3/xakTmHgVPWlldt3e2Nmxu4G5RvnNLMb0O64R17t4QmpbjTntYvG8+3HoycQ0QfEb5Y71qvA5Sif1C04D9Rvzbr768+dOzX3/vnp6SCkgkJKk3MXhtd18CgMsAcPexUf+B/HCvioyHJp+RkvaC9gs+PzcH924rL3/8xfiMkgIiAIjjnCAAAByfdBIfvp88J39x48H39tc55efHRv2b07MzsG07UCuiGQk/DjhIfoeZ9EYeHp90rhSf/PYHAPx9dGhdn6T/hjWW4OMcIBLAyUyxbGdLleP+8yss/wf1aa0u8wCatDCLAADnvZ6ULVXe8PpSWs5HGW0avNi/6A/l99GhJR8dWlOLThTmOrmFhUd5e7W6aUheDDt6Bi1sbvBROSZTLNsi77yOS6S5rp6c9ui7wlQj62b/AVCQ6GsMUWDwAAAAAElFTkSuQmCC)}' +
            '.col-offset-330 #toolbar .NormNameIcon:hover, #toolbar .NormNameIcon:focus, #toolbar .NormNameIcon:active { background-image: url(data:image/png;base64,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) }';
        $("<style>")
            .prop("type", "text/css")
            .html(normCss)
            .appendTo('head');

        //Click event
        $('.NormNameIcon').click(mainNormName);

        //Keyboard shortcut
        addKeyboardShortcutToEditor(nnShortcut);
    }
}

function addKeyboardShortcutToEditor(nnShortcut){
    W.accelerators.Groups['normname']=[];
    W.accelerators.Groups['normname'].members=[];
    I18n.translations[I18n.currentLocale()].keyboard_shortcuts.groups['normname'] = [];
    I18n.translations[I18n.currentLocale()].keyboard_shortcuts.groups['normname'].description = 'Norm Name';
    I18n.translations[I18n.currentLocale()].keyboard_shortcuts.groups['normname'].members = [];
    I18n.translations[I18n.currentLocale()].keyboard_shortcuts.groups.normname.members['normName'] = 'Normalize street names';
    W.accelerators.addAction('normName', {group: 'normname'});
    W.accelerators.events.register('normName', null, mainNormName);
    W.accelerators._registerShortcuts({nnShortcut: "normName"});
}

function mainNormName(){
  var UpdateObject, AddOrGetCity, AddOrGetStreet;
    if (typeof(require) !== "undefined") {
        UpdateObject = require("Waze/Action/UpdateObject");
        AddOrGetCity = require("Waze/Action/AddOrGetCity");
        AddOrGetStreet = require("Waze/Action/AddOrGetStreet");
    } else {
        UpdateObject = W.Action.UpdateObject;
        AddOrGetCity = W.Action.AddOrGetCity;
        AddOrGetStreet = W.Action.AddOrGetStreet;
    }
  function to_decimal(name) {
    var newname = name;
    var newnum = newname.match(/^(([NSEW] )?I|US|SR|SH|CR)-\d+ \d+\s?\/\s?\d+/);
    if (newnum) {
      var orig = newnum[0];
      var deci = orig.split("-");
      var repl = deci[0] + "-";
      deci = deci[1].split(" ");
      if (deci.length == 2) {
        bits = deci[1].split("/");
      } else {
        bits = [deci[1], deci[3]];
      }
      deci = deci[0];
      var numer = parseInt(bits[0],10);
      var denom = parseInt(bits[1],10);
      if (denom !== 0) {
        numer = numer + (denom * deci);
        var frac = numer / denom;
        repl = repl.concat(frac);
        newname = newname.replace(orig, repl);
      }
    }
    return (newname);
  }

  function state_transforms(name, state) {
    var newname = name;
    switch(state) {
      case "Alabama":
        newname = newname.replace(/\bCo(unty)? R((oa)?d|(ou)?te) /ig, "CR-");
        newname = newname.replace(/\bCo(unty)? H(igh)?wa?y /ig, "CR-");
        newname = newname.replace(/\b(State|Al(abama?)) H(igh)?wa?y /ig, "SR-");
        newname = newname.replace(/\bState R(ou)?te /ig, "SR-");
        newname = newname.replace(/\bS[HR]-\s?(\d+)/ig, "SR-$1");
        newname = newname.replace(/\bS[HR] (\d+)/ig, "SR-$1");
        newname = newname.replace(/\bAL-\s?(\d+)/ig, "SR-$1");
        newname = newname.replace(/\bAL (\d+)/ig, "SR-$1");
        break;
      case "Arkansas":
      	newname = newname.replace(/\bCo(unty)? R((oa)?d|(ou)?te) /ig, "CR-");
        newname = newname.replace(/\bCo(unty)? H(igh)?wa?y /ig, "CR-");
        newname = newname.replace(/\bAr(kansas)? H(igh)?wa?y /ig, "AR-");
        newname = newname.replace(/\bState H(igh)?wa?y /ig, "AR-");
        newname = newname.replace(/\bState R(ou)?te /ig, "AR-");
        newname = newname.replace(/\bState Spur (\d+)/ig, "AR-$1 SPUR");
        newname = newname.replace(/\bHwy (\d+(\-\d)?) Spu?r/ig, "AR-$1 SPUR");
        newname = newname.replace(/\bS[HR](-\d+)/g, "AR$1");
        newname = newname.replace(/(\s|^)AR-\s?(\d+)/ig, "$1AR-$2");
        newname = newname.replace(/(\s|^)AR (\d+)/ig, "$1AR-$2");
      	break;
      case "Colorado":
        newname = newname.replace(/^Alley$/, "");
        newname = newname.replace(/^([NSEW] )?Rd /i, "$1CR-");
        newname = newname.replace(/^([NSEW] )?C ?R ?(\d+)/i, "$1CR-$2");
        newname = newname.replace(/^([NSEW] )?Co Rd /i, "$1CR-");
        newname = newname.replace(/^([NSEW] )?Cty Rd /i, "$1CR-");
        newname = newname.replace(/^(\w+) Co Rd (\d+)/i, "$1 CR-$2");
        newname = newname.replace(/^Rcr /i, "CR-");
        newname = newname.replace(/^Co Hwy /i, "CR-");
        newname = newname.replace(/^([NSEW] )?Hwy /i, "$1SH-");
        newname = newname.replace(/State Hwy /i, "SH-");
        newname = newname.replace(/State Rte /i, "SH-");
        newname = newname.replace(/State Route /i, "SH-");
        newname = newname.replace(/(^|\s)S[RH]-\s?(\d+)/ig, "$1SH-$2");
        /* convert fractional notation to decimal notation */
        newname = to_decimal(newname);
        break;
      case "Florida":
        newname = newname.replace(/\bCo(unty)? R((oa)?d|(ou)?te) /ig, "CR-");
        newname = newname.replace(/\bCo(unty)? H(igh)?wa?y /ig, "CR-");
        newname = newname.replace(/\bState H(igh)?wa?y /ig, "SR-");
        newname = newname.replace(/\bState R(ou)?te /ig, "SR-");
        newname = newname.replace(/\bS[HR]-\s?(\d+)/ig, "SR-$1");
        newname = newname.replace(/\bS[HR] (\d+)/ig, "SR-$1");
        newname = newname.replace(/\bFL-\s?(\d+)/ig, "SR-$1");
        newname = newname.replace(/\bFL (\d+)/ig, "SR-$1");
        break;
      case "Georgia":
        newname = newname.replace(/\bCo(unty)? R((oa)?d|(ou)?te) /ig, "CR-");
        newname = newname.replace(/\bCo(unty)? H(igh)?wa?y /ig, "CR-");
        newname = newname.replace(/\bState H(igh)?wa?y /ig, "SR-");
        newname = newname.replace(/\bState R(ou)?te /ig, "SR-");
        newname = newname.replace(/\bS[HR]-\s?(\d+)/ig, "SR-$1");
        newname = newname.replace(/\bS[HR] (\d+)/ig, "SR-$1");
        newname = newname.replace(/\bGA-\s?(\d+)/ig, "SR-$1");
        newname = newname.replace(/\bGA (\d+)/ig, "SR-$1");
        break;
      case "Illinois":
        newname = newname.replace(/\bCo(unty)? R((oa)?d|(ou)?te) /ig, "CR-");
        newname = newname.replace(/^Rcr /i, "CR-");
        newname = newname.replace(/\bCo(unty)? H(igh)?wa?y /ig, "CR-");
        newname = newname.replace(/\bCty H(igh)?wa?y /ig, "CR-");
        newname = newname.replace(/\bC(oun)?ty (\d+)$/ig, "CR-$2");
        newname = newname.replace(/\bCTH-/, "CR-");
        newname = newname.replace(/\bCR-([A-Z]?\d{1,2}$)/ig, "CH-$1");
        newname = newname.replace(/\bCH-(0{1,4})\b/ig, "CR-$1");
        newname = newname.replace(/\bState H(igh)?wa?y /ig, "SR-");
        newname = newname.replace(/\bState R(ou)?te /ig, "SR-");
        newname = newname.replace(/\bS[HR]-\s?(\d+)/ig, "SR-$1");
        newname = newname.replace(/\bS[HR] (\d+)/ig, "SR-$1");
        newname = newname.replace(/\bIL-\s?(\d+)/ig, "SR-$1");
        newname = newname.replace(/\bIL (\d+)/ig, "SR-$1");
        break;
      case "Indiana":
        newname = newname.replace(/In(diana)? H(igh)?wa?y /ig, "IN-");
        newname = newname.replace(/State H(igh)?wa?y /ig, "IN-");
        newname = newname.replace(/State R(ou)?te /ig, "IN-");
        newname = newname.replace(/State R(oa)?d /ig, "IN-");
        newname = newname.replace(/State Spur (\d+)/ig, "IN-$1 SPUR");
        newname = newname.replace(/\bS[HR]- ?(\d+)/ig, "IN-$1");
        newname = newname.replace(/\bS[HR] (\d+)/g, "IN-$1");
        newname = newname.replace(/(\s|^)IN-\s?(\d+)/ig, "$1IN-$2");
        newname = newname.replace(/(\s|^)IN (\d+)/ig, "$1IN-$2");
        newname = newname.replace(/\bCo(unty)? R((oa)?d|(ou)?te) /ig, "CR-");
        newname = newname.replace(/^Rcr /i, "CR-");
        newname = newname.replace(/\bCo(unty)? H(igh)?wa?y /ig, "CH-");
        newname = newname.replace(/\bCounty (\d+)/ig, "CH-($1)");
        newname = newname.replace(/\bI-164\b/, "I-69");
        break;
      case "Iowa":
        newname = newname.replace(/\bCo(unty)? R((oa)?d|(ou)?te) /ig, "CR-");
        newname = newname.replace(/^Rcr /i, "CR-");
        newname = newname.replace(/\bCo(unty)? H(igh)?wa?y /ig, "CR-");
        newname = newname.replace(/\bI(ow)?a H(igh)?wa?y /ig, "IA-");
        newname = newname.replace(/\bState H(igh)?wa?y /ig, "IA-");
        newname = newname.replace(/\bState R(ou)?te /ig, "IA-");
        newname = newname.replace(/\bS[HR](-\d+)/, "IA$1");
        newname = newname.replace(/\bIA-\s?(\d+)/ig, "IA-$1");
        newname = newname.replace(/\bIA (\d+)/ig, "IA-$1");
        break;
      case "Kansas":
        newname = newname.replace(/\bState H(igh)?wa?y /ig, "K-");
        newname = newname.replace(/\bState R(ou)?te /ig, "K-");
        newname = newname.replace(/(\s|^)S[HR]-\s?(\d+)/ig, "$1K-$2");
        newname = newname.replace(/(\s|^)S[HR] (\d+)/ig, "$1K-$2");
        newname = newname.replace(/\bCo(unty)? R((oa)?d|(ou)?te) /ig, "CR-");
        newname = newname.replace(/\bKS-\s?(\d+)/ig, "K-$1");
        newname = newname.replace(/\bKS? (\d+)\b/ig, "K-$1");
        break;
      case "Louisiana":
        newname = newname.replace(/\bCo(unty)? R((oa)?d|(ou)?te) /ig, "Parish Rd ");
        newname = newname.replace(/\bCR-? ?(\d)/i, "Parish Rd $1");
        newname = newname.replace(/\bL(ouisian)?a H(igh)?wa?y /ig, "LA-");
        newname = newname.replace(/\bState H(igh)?wa?y /ig, "LA-");
        newname = newname.replace(/\bState R((ou)?te|d) /ig, "LA-");
        newname = newname.replace(/\bState Spu?r (\d+)/i, "LA-$1 SPUR");
        newname = newname.replace(/\bHwy (\d+(\-\d)?) Spu?r/i, "LA-$1 SPUR");
        newname = newname.replace(/\bS[HR](-\d+)/g, "LA$1");
        newname = newname.replace(/\bS\s?R\s(\d+)\b/g, "LA-$1");
        newname = newname.replace(/\bLA-\s?(\d+)/ig, "LA-$1");
        newname = newname.replace(/\bLA ?(\d+)\b/ig, "LA-$1");
        newname = newname.replace(/\bLA-(71|79|80|167)\b/ig, "US-$1");
        newname = newname.replace(/^(?!Old )Hwy (\d)\b/ig,"LA-$1");
        newname = newname.replace(/^(?!Old )Hwy (11|51|61|65|71|79|80|84|90|165|167|171|190|371|425)\b/ig, "US-$1");
        newname = newname.replace(/^(?!Old )Hwy (?!63)(\d\d)\b/ig, "LA-$1");
        newname = newname.replace(/^(?!Old )Hwy (\d{3,4})\b/ig, "LA-$1");
        newname = newname.replace(/\bU(\s|-)turn/i, "U turn");
        newname = newname.replace(/\bExpy\b/ig, "Expwy");
        newname = newname.replace(/\bBrg\b/g, 'Br');
        newname = newname.replace(/^([NSWE] )?Ave( [NSEW])$/g, '$1Avenue$2.');
        newname = newname.replace(/^([NSEW] )?Ave( [A-DF-MO-RT-VX-Z])$/g, '$1Avenue$2');
        newname = newname.replace(/^LA-7\b/, 'US-371');
        newname = newname.replace(/\bLsu\b/ig, 'LSU');
        newname = newname.replace(/\bLeo Kerner ?\/ ?Lafitte Pkwy\b/g, 'Leo Kerner Lafitte Pkwy');
        newname = newname.replace(/^Forest Rd (\d+)$/i, 'FS-$1');
        break;
      case "Maine":
    	newname = newname.replace(/\bState H(igh)?wa?y /ig, "SR-");
        newname = newname.replace(/\bState R(ou)?te /ig, "SR-");
        newname = newname.replace(/\bS[HR]-\s?(\d+)/ig, "SR-$1");
        newname = newname.replace(/\bS[HR] (\d+)/ig, "SR-$1");
        newname = newname.replace(/\bME-\s?(\d+)/ig, "SR-$1");
        newname = newname.replace(/\bME (\d+)/ig, "SR-$1");
        newname = newname.replace(/\bRte (1A?|2|201A?|202|302)\b/ig, "US-$1");
        newnmae = newname.replace(/\bRte (?![12])(\d[AB]?)\b/ig, "SR-$1");
        newname = newname.replace(/\bRte (\d\d[AB]?)\b/ig, "SR-$1");
        newname = newname.replace(/\bRte (?!(?:20[12]|301))(\d{3}[AB]?)\b/ig, "SR-$1");
      	break;
      case "Michigan":
        newname = newname.replace(/^([NSEW] )?Co Rd /i, "$1CR-");
        newname = newname.replace(/^Rcr /i, "CR-");
        newname = newname.replace(/^Co Hwy /i, "CR-");
        newname = newname.replace(/State Hwy /ig, "M-");
        newname = newname.replace(/State Rte /ig, "M-");
        newname = newname.replace(/State Route /ig, "M-");
        newname = newname.replace(/\bS[HR](-\d+)/g, "M$1");
        newname = newname.replace(/(\s)M-\s?(\d+)/ig, "$1M-$2");
        break;
      case "Minnesota":
        newname = newname.replace(/\bCo(unty)? R((oa)?d|(ou)?te) /ig, "CR-");
        newname = newname.replace(/^Rcr /i, "CR-");
        newname = newname.replace(/\bCo(unty)? H(igh)?wa?y /ig, "CH-");
        newname = newname.replace(/\bMinn(esota)? H(igh)?wa?y /ig, "MN-");
        newname = newname.replace(/\bState H(igh)?wa?y /ig, "MN-");
        newname = newname.replace(/\bState R(ou)?te /ig, "MN-");
        newname = newname.replace(/\bS[HR](-\d+)/g, "MN$1");
        newname = newname.replace(/\bMN-\s?(\d+)/ig, "MN-$1");
        newname = newname.replace(/\bMN (\d+)/ig, "MN-$1");
        break;
      case "Mississippi":
        newname = newname.replace(/\bCo(unty)? R((oa)?d|(ou)?te) /ig, "CR-");
        newname = newname.replace(/^Rcr /i, "CR-");
        newname = newname.replace(/\bCo(unty)? H(igh)?wa?y /ig, "CR-");
        newname = newname.replace(/\bState Hwy /ig, "MS-");
        newname = newname.replace(/\bState Rte /ig, "MS-");
        newname = newname.replace(/\bState Route /ig, "MS-");
        newname = newname.replace(/(\s|^)S[HR]-\s?(\d+)/g, "$1MS-$2");
        newname = newname.replace(/(\s|^)MS-\s?(\d+)/ig, "$1MS-$2");
        newname = newname.replace(/(\s|^)MS (\d+)/ig, "$1MS-$2");
        break;
      case "Missouri":
        newname = newname.replace(/\bCo(unty)? R((oa)?d|(ou)?te) /ig, "CR-");
        newname = newname.replace(/\bCo(unty)? H(igh)?wa?y /ig, "CR-");
        newname = newname.replace(/^(?:Adair|Andrew|Atchison|Audrain|Bar(?:ry|ton)|Bates|Benton|Bollinger|Boone|Buchanan|Butler|Cal(?:dwell|laway)|Cape Girardeau|Car(?:roll|ter)|Cass|Cedar|Ch(?:ariton|ristian)|Cla(?:rk|y)|Clinton|Co(?:le|oper)|Crawford|Da(?:de|llas|viess)|DeKalb|Dent|Douglas|Dunklin|Franklin|Gasconade|Gentry|Greene|Grundy|Harrison|Henry|Hickory|Holt|Howard|Howell|Iron|Jackson|Jasper|J(?:effer|ohn)son|Knox|La(?:cled|fayett|wrenc)e|Lewis|Lin(?:col)?n|Livingston|Ma(?:c|dis)on|Mari(?:es|on)|McDonald|M(?:erc|ill)er|Mississippi|Mon(?:iteau|roe|tgomery)|Morgan|New(?: Madrid|ton)|Nodaway|Oregon|Osage|Ozark|Pe(?:miscot|rry|ttis)|Phelps|Pike|Platte|Polk|Pu(?:laski|tnam)|Ra(?:lls|ndolph|y)|Reynolds|Ripley|Saline|Schuyler|Scot(?:land|t)|Sh(?:annon|elby)|S(?:ain)?t\.? (?:Charles|Clair|Francois|Louis)|Ste\.? Genevieve|Sto(?:ddard|ne)|Sullivan|Taney|Texas|Vernon|Wa(?:rren|shington|yne)|Webster|Worth|Wright)(?:(?: Co(?:unty)?)? R(?:oa)?d)? (\d+)/i, "CR-$1");
        newname = newname.replace(/\bState H(igh)?wa?y (\d+)\b/ig, "MO-$2");
        newname = newname.replace(/\bState R(ou)?te (\d+)\b/ig, "MO-$2");
        newname = newname.replace(/\bState H(igh)?wa?y ([A-Z]{1,2})\b/ig, "SH-$2");
        newname = newname.replace(/\bState R(ou)?te ([A-Z]{1,2})\b/ig, "SH-$2");
        newname = newname.replace(/\bS[HR]-\s?(\d+)/g, "MO-$1");
        newname = newname.replace(/\bMO-\s?(\d+)/ig, "MO-$1");
        newname = newname.replace(/\bMO (\d+)/ig, "MO-$1");
        newname = newname.replace(/\bMO ([A-Z]{1,2})/ig, "SH-$1");
        newname = newname.replace(/\bHwy (24|36|40|50|54|56|60|61|62|63|65|67|69|71|136|159|160|166|169|275|400|412)\b/ig, "US-$1");
        newname = newname.replace(/\bHwy (?!59)(\d\d)\b/ig, "MO-$1");
        newname = newname.replace(/\bHwy (\d(\d\d)?)\b/ig, "MO-$1");
        newname = newname.replace(/\bSH-[A-Z]{1,2}\b/ig, function(v) { return v.toUpperCase(); });
      	break;
      case "Nebraska":
        newname = newname.replace(/\bCo(unty)? R((oa)?d|(ou)?te) /ig, "CR-");
        newname = newname.replace(/^Rcr /i, "CR-");
        newname = newname.replace(/\bCo(unty)? H(igh)?wa?y /ig, "CR-");
        newname = newname.replace(/\bState H(igh)?wa?y /ig, "N-");
        newname = newname.replace(/\bState R(ou)?te /ig, "N-");
        newname = newname.replace(/\bS[HR](-\d+)/g, "N$1");
        newname = newname.replace(/\b(?:N-|Hwy )S-?(\d{1,2}[A-Ma-m])/ig, "S-$1");
        newname = newname.replace(/\b(?:N-|Hwy )(\d{1,2}[A-Ma-m]) \(?Spur\)?/ig, "S-$1");
        newname = newname.replace(/(?:N-|State )?Spur (\d{1,2}[A-Ma-m])/ig, "S-$1");
        newname = newname.replace(/Hwy (\d{1,2}[A-Ma-m]) Spu?r/ig, "S-$1");
        newname = newname.replace(/\b(?:N-|Hwy )L-?(\d{1,2}[A-Xa-x])/ig, "L-$1");
        newname = newname.replace(/\b(?:N-|Hwy )(\d{1,2}[A-Xa-x]) \(?Link\)?/ig, "L-$1");
        newname = newname.replace(/(?:N-|State )?Link (\d{1,2}[A-Xa-x])/ig, "L-$1");
        newname = newname.replace(/\b(N|L|S)-\d{1,2}[a-x]\b/ig, function(v) { return v.toUpperCase(); });
        break;
      case "New York":
        newname = newname.replace(/\bCo(unty)? R((oa)?d|(ou)?te?) /ig, "CR-");
        newname = newname.replace(/NY (Hwy|Ro?u?te?) /ig, "NY-");
        newname = newname.replace(/State Hwy /ig, "NY-");
        newname = newname.replace(/State Rte? /ig, "NY-");
        newname = newname.replace(/State Route /ig, "NY-");
        newname = newname.replace(/State Spur (\d+)/ig, "NY-$1 SPUR");
        newname = newname.replace(/\bS[HR](-\d+)/ig, "NY$1");
        newname = newname.replace(/(\s|^)NY-\s?(\d+)/ig, "$1NY-$2");
        newname = newname.replace(/(\s|^)NY (\d+)/ig, "$1NY-$2");
        newname = newname.replace(/\bEx(p|w)y\b/ig, "Expwy");
        newname = newname.replace(/\b(Ro?u?te |RT-|RT )(1|4|6|9W?|11|20|44|62|202|209|219|220|20A|62 BUS)\b/ig, "US-$2");
        newname = newname.replace(/\b(Ro?u?te |RT-|RT )(?!2)(\d)\b/ig, "NY-$2");
        newname = newname.replace(/\b(Ro?u?te |RT-|RT )(?!15)(\d\d)\b/ig, "NY-$2");
        newname = newname.replace(/\b(Ro?u?te |RT-|RT )(\d{3})\b/ig, "NY-$2");
        newname = newname.replace(/\bTunl\b/ig, "Tun");
        newname = newname.replace(/\bLong Is\b/ig, "Long Island");
        break;
      case "New Jersey":
        newname = newname.replace(/\bCo(unty)? R((oa)?d|(ou)?te) /ig, "CR-");
        newname = newname.replace(/^Rcr /i, "CR-");
        newname = newname.replace(/\bCo(unty)? H(igh)?wa?y /ig, "CR-");
        newname = newname.replace(/\bState Hwy /ig, "SR-");
        newname = newname.replace(/\bState Rte /ig, "SR-");
        newname = newname.replace(/\bState Route /ig, "SR-");
        newname = newname.replace(/\bS[HR]-\s?(\d+)/ig, "SR-$1");
        newname = newname.replace(/\bS[HR] (\d+)/ig, "SR-$1");
        newname = newname.replace(/\bNJ-\s?(\d+)/ig, "SR-$1");
        newname = newname.replace(/\bNJ (\d+)/ig, "SR-$1");
        break;
      case "North Dakota":
        newname = newname.replace(/\bCo(unty)? R((oa)?d|(ou)?te) /ig, "CR-");
        newname = newname.replace(/^Rcr /i, "CR-");
        newname = newname.replace(/\bCo(unty)? H(igh)?wa?y /ig, "CR-");
        newname = newname.replace(/\bCo(unty)? (\d+)/ig, "CR-$2");
        newname = newname.replace(/\bN(orth)? ?D(akota)? H(igh)?wa?y /ig, "ND-");
        newname = newname.replace(/\bState H(igh)?wa?y /ig, "ND-");
        newname = newname.replace(/\bState R(ou)?te /ig, "ND-");
        newname = newname.replace(/\bS[HR](-\d+)/g, "ND$1");
        newname = newname.replace(/\bND-\s?(\d+)/ig, "ND-$1");
        newname = newname.replace(/\bND (\d+)/ig, "ND-$1");
        break;
      case "Ohio":
        newname = newname.replace(/\bCo(unty)? R((oa)?d|(ou)?te) /ig, "CR-");
        newname = newname.replace(/^Rcr /i, "CR-");
        newname = newname.replace(/\bCo(unty)? H(igh)?wa?y /ig, "CR-");
        newname = newname.replace(/\b(Twp|Township) R((oa)?d|(ou)?te) /ig, "TR-");
        newname = newname.replace(/\bTo?w(nshi)?p H(igh)?wa?y /ig, "TR-");
        newname = newname.replace(/\bC-?(\d)/ig, "CR-$1");
        newname = newname.replace(/\bT-?(\d)/ig, "TR-$1");
        newname = newname.replace(/\bState Hwy /ig, "SR-");
        newname = newname.replace(/\bState Rte /ig, "SR-");
        newname = newname.replace(/\bState Route /ig, "SR-");
        newname = newname.replace(/\bS[HR]-\s?(\d+)/ig, "SR-$1");
        newname = newname.replace(/\bS[HR] (\d+)/ig, "SR-$1");
        newname = newname.replace(/\bOH-\s?(\d+)/ig, "SR-$1");
        newname = newname.replace(/\bOH (\d+)/ig, "SR-$1");
        break;
      case "Oklahoma":
        newname = newname.replace(/\bCo(unty)? R((oa)?d|(ou)?te) /ig, "CR-");
        newname = newname.replace(/\bCo(unty)? H(igh)?wa?y /ig, "CR-");
        newname = newname.replace(/\bState H(igh)?wa?y /ig, "SH-");
        newname = newname.replace(/\bState R(ou)?te /ig, "SH-");
        newname = newname.replace(/\b(State|Ok(lahoma?)) H(igh)?wa?y /ig, "SH-");
        newname = newname.replace(/(\s|^)S[HR]-\s?(\d+)/ig, "$1SH-$2");
        newname = newname.replace(/(\s|^)S[HR] (\d+)/ig, "$1SH-$2");
        newname = newname.replace(/\bOK-\s?(\d+)/ig, "SH-$1");
        newname = newname.replace(/\bOK (\d+)/ig, "SH-$1");
        newname = newname.replace(/(N|S) (\d{1,3})(st|nd|rd|th) East (Ave|Pl|Cir|Ct)/ig, "$1 $2$3 E $4");
        newname = newname.replace(/(N|S) (\d{1,3})(st|nd|rd|th) West (Ave|Pl|Cir|Ct)/ig, "$1 $2$3 W $4");
        break;
      case "Pennsylvania":
        newname = newname.replace(/\bState Hwy /ig, "SR-");
        newname = newname.replace(/\bState Rte /ig, "SR-");
        newname = newname.replace(/\b(PA|State) Route /ig, "SR-");
        newname = newname.replace(/(\s|^)S[HR]-\s?(\d+)/ig, "$1SR-$2");
        newname = newname.replace(/(\s|^)S[HR] (\d+)/ig, "$1SR-$2");
        newname = newname.replace(/\bP(enn(sylvani)?)?a Tpke?\b/ig, "Penna. Tpk");
        break;
      case "South Carolina":
        newname = newname.replace(/\bState H(igh)?wa?y /ig, "SC-");
        newname = newname.replace(/\bState R(ou)?te /ig, "SC-");
        newname = newname.replace(/(\s|^)S[HR]-\s?(\d+)/ig, "$1SC-$2");
        newname = newname.replace(/(\s|^)S[HR] (\d+)/ig, "$1SC-$2");
        newname = newname.replace(/.+(S-\d\d?-\d+)/i, "$1");
        break;
      case "South Dakota":
        newname = newname.replace(/\bCo(unty)? R((oa)?d|(ou)?te) /ig, "CR-");
        newname = newname.replace(/^Rcr /i, "CR-");
        newname = newname.replace(/\bCo(unty)? H(igh)?wa?y /ig, "CR-");
        newname = newname.replace(/\bS(outh)? ?D(akota)? H(igh)?wa?y /ig, "SD-");
        newname = newname.replace(/\bState H(igh)?wa?y /ig, "SD-");
        newname = newname.replace(/\bState R(ou)?te /ig, "SD-");
        newname = newname.replace(/\bS[HR](-\d+)/g, "SD$1");
        newname = newname.replace(/\bSD-\s?(\d+)/ig, "SD-$1");
        newname = newname.replace(/\bSD (\d+)/ig, "SD-$1");
        break;
      case "Texas":
        newname = newname.replace(/\bState Hwy /ig, "SH-");
        newname = newname.replace(/\bState Rte /ig, "SH-");
        newname = newname.replace(/\bState Route /ig, "SH-");
        newname = newname.replace(/\bState Highway /ig, "SH-");
        newname = newname.replace(/\bS[HR]-\s?(\d+)/ig, "SH-$1");
        newname = newname.replace(/\bS[HR] (\d+)/g, "SH-$1");
        newname = newname.replace(/\bFarm(\s|-)to(\s|-)market\b/ig, "FM");
        newname = newname.replace(/^Farm R(oa)?d (\d{2,}\b)/i, "FM $2");
        newname = newname.replace(/\bRanch(\s|-)to(\s|-)market\b/ig, "RM");
        newname = newname.replace(/^Ranch R(oa)?d (\d{2,}\b)/i, "RM $2");
        newname = newname.replace(/\bCo(unty)? R((oa)?d|(ou)?te) /ig, "CR-");
        newname = newname.replace(/\b([NS][EW])CR\s?(\d{2,4})\b/ig, "$1 CR-$2");
        newname = newname.replace(/\b([NS][EW])\s?(\d{4})\b/ig, "$1 CR-$2");
        newname = newname.replace(/\b(CR-\d+) Rd\b/ig, "$1");
        newname = newname.replace(/\b([NS])E CR-\b/ig, "$1E CR-");
        newname = newname.replace(/\b([NS])W CR-\b/ig, "$1W CR-");
        newname = newname.replace(/^Pvt Rd (\d{2,})\b/i, "Private Rd $1");
        newname = newname.replace(/^Pr (\d{2,})\b/i, "Private Rd $1");
        newname = newname.replace(/^U(\s|-)turn/i, "Turnaround");
        newname = newname.replace(/\bState Loop /ig, "Loop ");
        newname = newname.replace(/\bState Spur /ig, "Spur ");
        newname = newname.replace(/\bPark Road /ig, "Park Rd ");
        break;
      case "Utah":
        newname = newname.replace(/\bState (Hwy|Rte) /ig, "SR-");
        newname = newname.replace(/\bS[HR]-\s?(\d+)/ig, "SR-$1");
        newname = newname.replace(/\bS[HR] (\d+)/g, "SR-$1");
        break;
      case "West Virginia":
        newname = newname.replace(/\bW(est)? ?V(irginia)? H(igh)?wa?y /ig, "WV-");
        newname = newname.replace(/\bState H(igh)?wa?y /ig, "WV-");
        newname = newname.replace(/\bState R(ou)?te /ig, "WV-");
        newname = newname.replace(/\bS[HR]- ?(\d+)/ig, "WV-$1");
        newname = newname.replace(/\bS[HR] (\d+)/g, "WV-$1");
        newname = newname.replace(/\bWV-\s?(\d+)/ig, "WV-$1");
        newname = newname.replace(/\bWV (\d+)/ig, "WV-$1");
        newname = newname.replace(/\bCo(unty)? R((oa)?d|(ou)?te) /ig, "CR-");
        newname = newname.replace(/\bCo(unty)? (Trunk )?(H(igh)?wa?y )?(\d{1,3}\b)/ig, "CR-$5");
        newname = newname.replace(/\bCounty (\d+)/ig, "CR-$1");
        newname = newname.replace(/\bCTH-/ig, "CR-");
        newname = newname.replace(/\bCH-/ig, "CR-");
        newname = newname.replace(/ \(ALT\)( |$)/ig, " ALT$1");
        newname = newname.replace(/\bCR-(\d{1,3}) \/ (\d{1,2})\b/ig, "CR-$1/$2");
        break;
      case "Wisconsin":
        newname = newname.replace(/\bWis?(consin)? Hwy /ig, "WIS-");
        newname = newname.replace(/\bState Hwy /ig, "WIS-");
        newname = newname.replace(/\bState R((ou)?te|d) /ig, "WIS-");
        newname = newname.replace(/\bState Spur (\d+)/ig, "WIS-$1 SPUR");
        newname = newname.replace(/\bS[HR]- ?(\d+)/ig, "WIS-$1");
        newname = newname.replace(/\bS[HR] (\d+)/g, "WIS-$1");
        newname = newname.replace(/\bWIS?-\s?(\d+)/ig, "WIS-$1");
        newname = newname.replace(/\bWIS? (\d+)/ig, "WIS-$1");
        newname = newname.replace(/\bCo(unty)? R((oa)?d|(ou)?te) /ig, "CH-");
        newname = newname.replace(/\bCo(unty)? (Trunk )?(H(igh)?wa?y )?([A-Z]{1,3}\b)/ig, "CH-$5");
        newname = newname.replace(/\bCounty (\d+)\b/ig, "CH-($1)");
        newname = newname.replace(/\bCTH-/ig, "CH-");
        newname = newname.replace(/\bCR-/ig, "CH-");
        newname = newname.replace(/^Forest Rd /i, 'FR-');
        newname = newname.replace(/\bCH-[A-Za-z]{1,4}\b/ig, function(v) { return v.toUpperCase(); });
        break;
      case "Wyoming":
        newname = newname.replace(/\bWyo(ming)? H(igh)?wa?y /ig, "WY-");
        newname = newname.replace(/\bState H(igh)?wa?y /ig, "WY-");
        newname = newname.replace(/\bState R(ou)?te /ig, "WY-");
        newname = newname.replace(/\bS[HR]- ?(\d+)/ig, "WY-$1");
        newname = newname.replace(/\bS[HR] (\d+)/g, "WY-$1");
        newname = newname.replace(/\bWYO?-\s?(\d+)/ig, "WY-$1");
        newname = newname.replace(/\bWYO? (\d+)/ig, "WY-$1");
        newname = newname.replace(/\bCo(unty)? R((oa)?d|(ou)?te) /ig, "CR-");
        newname = newname.replace(/^Rcr /i, "CR-");
        newname = newname.replace(/\bCo(unty)? H(igh)?wa?y /ig, "CH-");
    }
    return(newname);
  }

  function transform_name(street, city) {
    var newname = street.name;
    /* remove leading/trailing whitespace */
    newname = newname.replace(/^(.*)\s+$/, "$1");
    newname = newname.replace(/^\s+(.*)$/, "$1");

    /* convert two or more whitespaces into a single ' ' */
    newname = newname.replace(/\s{2,}/g, ' ');

    /* replace ',' with '/', adding any necessary spaces around it is done later */
    newname = newname.replace(/,/g, "/");

    /* make sure there's spaces around '/' */
    newname = newname.replace(/(.)\s?\/\s?(.)/g, "$1 / $2");

    /* fix fractions - hamfisted second attempt */
    newname = newname.replace(/(\s\d) \/ (\d{1,2}\s)/g, "$1/$2");

    /* fix runways */
    newname = newname.replace(/\b((0?[1-9]|[1-2][0-9]|3[0-6])[LCR]?)\s\/\s((0?[1-9]|[1-2][0-9]|3[0-6])[LCR]?)\b/i, "$1/$3");

    newname = newname.replace(/^To:? /i, "to ");
    newname = newname.replace(/ To /, " to ");
    newname = newname.replace(/^US ?FS (\d+) R(oa)?d\b/i, "FS-$1");
    newname = newname.replace(/^US ?FS (\d+)$/i, "FS-$1");    
    newname = newname.replace(/^US Hwy Fs Rd /i, "FS-");
    newname = newname.replace(/^U S F S Rd /i, "FS-");
    newname = newname.replace(/^US-Fs Rd /i, "FS-");
    newname = newname.replace(/^US ?FS Rd /i, "FS-");
    newname = newname.replace(/^Fs? Rd? /i, "FS-");
    newname = newname.replace(/^F[sr] (\d)/i, "FS-$1");
    newname = newname.replace(/^F S /i, "FS-");

    /* convert Interstate and US Highway formats anywhere in the name to short-form */
    newname = newname.replace(/(^| )US Highway /ig, "$1US-");
    newname = newname.replace(/(^| )US Hwy Route /ig, "$1US-");
    newname = newname.replace(/(^| )US Hwy Rte /ig, "$1US-");
    newname = newname.replace(/(^| )US Hwy /ig, "$1US-");
    newname = newname.replace(/(^| )US Rte /ig, "$1US-");
    newname = newname.replace(/(^| )US Route /ig, "$1US-");
    newname = newname.replace(/(^| )US-\s?/ig, "$1US-");
    newname = newname.replace(/(^| )US\s?(\d+)/ig, "$1US-$2");
    newname = newname.replace(/US-9\s+([EW])/ig, "US-9$1");
    newname = newname.replace(/US-\d+\s?[NSEW]/ig, function(v) { return v.toUpperCase(); });

    newname = newname.replace(/(^| )I-\s?/ig, "$1I-");
    newname = newname.replace(/(^| )I\s?(\d+)/g, "$1I-$2");

    newname = newname.replace(/(^| )SR-\s?/ig, "$1SR-");
    newname = newname.replace(/(^| )SR\s?(\d+)/ig, "$1SR-$2");
    newname = newname.replace(/(^| )SH-\s?/ig, "$1SH-");
    newname = newname.replace(/(^| )SH\s?(\d+)/ig, "$1SH-$2");
    newname = newname.replace(/(^| )CR-\s?/ig, "$1CR-");
    newname = newname.replace(/(^| )CR\s?(\d+)/ig, "$1CR-$2");

    newname = newname.replace(/(\d+\w? ([NSEW] )?)(Busn?|BL|BS|Business)\b/ig, "$1BUS");
    newname = newname.replace(/(\d+\w? ([NSEW] )?)BUS\.? (Loop|Lp|Spur)\b/ig, "$1BUS");
    /* \d matches '.' so the above replace doesn't consume '.' after BUS, so consume it here */
    newname = newname.replace(/\bBUS\./g, "BUS");

    /* bannered routes */
    newname = newname.replace(/(\d+\w? ([NSEW] )?)Spu?r\b/i, "$1SPUR");
    newname = newname.replace(/(\d+\w? ([NSEW] )?)Alt\b/i, "$1ALT");
    newname = newname.replace(/(\d+\w? ([NSEW] )?)By-?p(ass)?\b/i, "$1BYP");
    newname = newname.replace(/(\d+\w? ([NSEW] )?)Conn(ector)?\b/i, "$1CONN");
    newname = newname.replace(/(\d+\w? ([NSEW] )?)Tru?c?k\b/i, "$1TRUCK");

    /* new unnumbered exit standard */
    newname = newname.replace(/^Exit:? to:?/i, "to");
    newname = newname.replace(/^Exit: /i, "to ");
    newname = newname.replace(/^Exit/i, "Exit");

    /* convert all ':' after the first ':' to a ' / ' */
    newname = newname.replace(/^([^:]+:)([^:]+):/g, "$1$2 /");
    newname = newname.replace(/^((?!Exit[^:]+))([^:]+):/g, "$1$2 /");
    newname = newname.replace(/^(to [^:]+):(.*)$/i, "$1 /$2"); /* redundant? */

    newname = newname.replace(/^(Exit \d+[\w\-]*)( \/ | \- | )/i, "$1: ");
    newname = newname.replace(/^(Exit \d+[\w\-]*):(\w)/i, "$1: $2");
    newname = newname.replace(/^Exit (\w+ )/i, "to $1");
    
    /* don't want Exit 70: S: right? */
    newname = newname.replace(/^(Exit \d+[\w\-]*): ?(\w)(:| \/)/i, "$1$2:");

    /* saint */
    newname = newname.replace(/((^|\/ |\bto )(([NEWS]{1,2}|Rue|Place|Old) )?)S(ain)?t /g, '$1St. ');
/*    newname = newname.replace(/\bSaint\b/, 'St.'); */

	/* doctor */
    newname = newname.replace(/((^|\/ |\bto )([NEWS]{1,2} )?)Dr /g, '$1Dr. ');

    /* bridge */
    newname = newname.replace(/\bBrg\b/, "Br");

    /* "Doctor" & "Saint" not likely at string end â€“Â probably "Drive" */
    newname = newname.replace(/\b(Dr|St)\.$/, "$1");

    /* bye bye nasty old 'N' 'S' 'E' 'W' format */
    newname = newname.replace(/( |^|-)'([NSEW])'( |$)/g, '$1$2.$3');
    
    /* Trce deprecated */
    newname = newname.replace(/\bTrce\b/g, 'Trace');

    /* State specific name transformations */
    var state = W.model.states.get(city.attributes.stateID);
    newname = state_transforms(newname, state.name);

    return(newname);
  }

  function remove_city(v, name, city)
  {
    var newcity = city.getID();
    var state = W.model.states.get(city.attributes.stateID);
    if (state.name.match(/^(Upper Franconia)$/)) { /* states that remove city name from Fway */
      if (name.match(/^I-\d+ [NSEW]$/) || v.attributes.roadType == 18) { /* Interstates and Railroads */
        var oldcity = W.model.cities.get(strt.cityID);
        var oldstate = W.model.states.get(oldcity.attributes.stateID);
        var oldcnt = W.model.countries.get(oldcity.countryID);
        newobj = W.model.cities.getByAttributes({isEmpty: true, stateID: oldcity.attributes.stateID, countryID: oldcity.countryID});
        if (!newobj[0]) {
          var t = W.model.states.get(oldcity.attributes.stateID);
          var e = W.model.countries.get(oldcity.countryID);
          W.model.actionManager.add(new AddOrGetCity(t, e, "", true));
          newobj = W.model.cities.getByAttributes({isEmpty: true, stateID: oldcity.attributes.stateID, countryID: oldcity.countryID});
        }
        if (newobj[0]) {
          newcity = newobj[0].id;
          oldstate = W.model.states.get(newobj[0].stateID);
          oldcnt = W.model.countries.get(newobj[0].countryID);
        }
       /* if (v.attributes.roadType == 18 && (v.attributes.lockRank < 1 || v.attributes.fwdDirection === false || v.attributes.revDirection === false)) {
          W.model.actionManager.add(new UpdateObject(v, {lockRank: 1, fwdDirection: true, revDirection: true}));
        } */
      }
    }
    else if (state.name.match(/^(Colorado|Illinois|Indiana|Iowa|Kansas|Louisiana|Michigan|Minnesota|Mississippi|Missouri|New York|(North|South) Dakota|Ohio|Oklahoma|Pennsylvania|Wisconsin)$/)) /* states that don't remove city name from Fway */
    {
      if (v.attributes.roadType === 18) { /* Railroads */
        var oldcity = W.model.cities.get(strt.cityID);
        var oldstate = W.model.states.get(oldcity.attributes.stateID);
        var oldcnt = W.model.countries.get(oldcity.attributes.countryID);
        //newobj = W.model.cities.getByAttributes({isEmpty: true, stateID: oldcity.attributes.stateID, countryID: oldcity.attributes.countryID});
        newobj = find_empty_city(oldcity.attributes.stateID, oldcity.attributes.countryID);
        if (!newobj) {
          var t = W.model.states.get(oldcity.attributes.stateID);
          var e = W.model.countries.get(oldcity.attributes.countryID);
          W.model.actionManager.add(new AddOrGetCity(t, e, "", true));
          //newobj = W.model.cities.getByAttributes({isEmpty: true, stateID: oldcity.attributes.stateID, countryID: oldcity.attributes.countryID});
          newobj = find_empty_city(oldcity.attributes.stateID, oldcity.attributes.countryID);
        }
        if (newobj) {
          newcity = newobj.attributes.id;
          oldstate = W.model.states.get(newobj.attributes.stateID);
          oldcnt = W.model.countries.get(newobj.attributes.countryID);
        }
      /*  if (v.attributes.roadType == 18 && (v.attributes.lockRank < 1 || v.attributes.fwdDirection === false || v.attributes.revDirection === false)) {
          W.model.actionManager.add(new UpdateObject(v, {lockRank: 1, fwdDirection: true, revDirection: true}));
        } */
      }
    }
    return(newcity);
  }
    
    function find_empty_city(stateID, countryID)
    {
        var newobj;
        W.model.cities.getObjectArray().some(function(city){
            if (city.attributes.stateID === stateID && city.attributes.countryID === countryID && city.attributes.isEmpty){
                newobj = city;
                return true;
            }
            return false;
        });
        return newobj;
    }

  function get_new_sid(newname, newcity)
  {
    if (newname === "" || newname === null) {
      newobj = W.model.streets.getByAttributes({isEmpty: true, cityID: newcity});
    } else {
      newobj = W.model.streets.getByAttributes({isEmpty: false, cityID: newcity, name: newname});
    }
    if (!newobj[0]) {
      if (newname === "" || newname === null) {
        W.model.actionManager.add(new AddOrGetStreet(newname, W.model.cities.get(newcity), true));
        newobj = W.model.streets.getByAttributes({isEmpty: true, cityID: newcity, name: newname});
      } else {
        W.model.actionManager.add(new AddOrGetStreet(newname, W.model.cities.get(newcity), false));
        newobj = W.model.streets.getByAttributes({isEmpty: false, cityID: newcity, name: newname});
      }
      if (newobj[0]) {
        return(newobj[0].id);
      }
    } else {
      return(newobj[0].id);
    }
  }

  function onScreen(obj) {
    if (obj.geometry) {
      return(W.map.getExtent().intersectsBounds(obj.geometry.getBounds()));
    }
    return(false);
  }

  var primary_hn_count = 0;

  _.each(W.model.segments.objects, function(v, k) {
      
    if (v.attributes.junctionID === null && onScreen(v) && v.isGeometryEditable()) {
      if (v.attributes.primaryStreetID) {
        strt = W.model.streets.get(v.attributes.primaryStreetID);
        if (strt) {
          var newname = strt.name;
          var newcity = strt.cityID;
          var city = W.model.cities.get(strt.cityID);
            
          if (strt.name && (primary_hn_count < 10 || v.attributes.hasHNs === false) && !strt.name.match(/http:\/\//i)) {
            /* don't change names on railroads and runways */
            if (v.attributes.roadType != 18 && v.attributes.roadType != 19) {
              newname = transform_name(strt, city);
            }
            newcity = remove_city(v, newname, city);
          }
          var newcname = W.model.cities.get(newcity);
          if (newname != strt.name || newcity != strt.cityID) {
            console.log("sid: " + v.getID() + " Pri: old: " + strt.name + ", " + city.attributes.name + " new: " + newname + ", " + newcname.attributes.name);
            var newid = get_new_sid(newname, newcity);
            W.model.actionManager.add(new UpdateObject(v, {primaryStreetID: newid, separator: false}));
            if (v.attributes.hasHNs) {
              primary_hn_count++;
              if (primary_hn_count == 10) {
                console.log("Changed the primary street name on 10 segments with house numbers, not changing more, consider saving now.");
              }
            }
          }
        }
      }
      if (v.attributes.streetIDs) {
        var i;
        var newsid = [];
        var updated = false;
        for (i = 0; i < v.attributes.streetIDs.length; i++) {
          strt = W.model.streets.get(v.attributes.streetIDs[i]);
          if (strt) {
            var newname = strt.name;
            var newcity = strt.cityID;
            var city = W.model.cities.get(strt.cityID);
            if (strt.name && !strt.name.match(/http:\/\//i)) {
              /* don't change names on railroads and runways */
              if (v.attributes.roadType != 18 && v.attributes.roadType != 19) {
                newname = transform_name(strt, city);
              }
              newcity = remove_city(v, newname, city);
            }
            var newcname = W.model.cities.get(newcity);
            if (newname != strt.name || newcity != strt.cityID) {
              console.log("sid: " + v.getID() + " Alt[" + i + "] old: " + strt.name + ", " + city.attributes.name + " new: " + newname + ", " + newcname.attributes.name);
              updated = true;
              newsid.push(get_new_sid(newname, newcity));
            } else {
              newsid.push(strt.id);
            }
          }
        }
        if (updated) {
          W.model.actionManager.add(new UpdateObject(v, {streetIDs: newsid, separator: false}));
        }
      }
    }
  });
}

function bootstrap(tries = 1) {
    if (W && W.loginManager && W.loginManager.user && W.accelerators) {
        initNormName();
        var normQuoteNum = Math.floor(Math.random() * 11);
        var normQuote = ["I think, ah, I think my buzzer's broken.", "Ah, tough luck there, buddy, huh?", "Yeah, that was 'Footloose.' Good flick, Footloose.", "Yeah, it's a rectangle.", "Why don't you let me buy a vowel?", "Yeah, that's right. Turd Ferguson. It's a funny name.", "Yeah, well, that's your opinion.", "That was a funny dog, Scooby Doo. He drove around in a van and, ah, solved mysteries.", "Ha ha. Yeah. I found this backstage. An oversized hat. It's funny.", "It's funny. It's funny because it's ah, bigger than, ah... you know, a normal hat."];
        console.log('Norm Name:', 'Initialized.', normQuote[normQuoteNum]);
    } else if(tries < 1000){
        window.setTimeout(() => bootstrap(tries++), 100);
    }
}

bootstrap();