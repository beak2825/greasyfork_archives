// ==UserScript==
// @name         Bustago
// @namespace    https://github.com/tark1998/bustago-popupblcoker
// @version      2025-12-24
// @description  Block every custom popup and confirm message of Bustago
// @author       You
// @match        https://www.bustago.or.kr/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=or.kr
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560059/Bustago.user.js
// @updateURL https://update.greasyfork.org/scripts/560059/Bustago.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.confirm = function(message) {
        console.log("Confirm dialog intercepted. Message: " + message);
        // Return true to automatically confirm (click OK)
        if (message.includes("취소수수료")){ return true; }
        else{ return false;}
    };

    function terSelectAlert(selectCase,str,mode,roundTicketCd,terCode,area,terminalNm,searchNm,orderCreateDays,arr_cd,arr_nm,cd,nm) {
        if(selectCase=="1"){
            runTerminalEndList(mode,roundTicketCd,terCode,area,terminalNm,searchNm,orderCreateDays,arr_cd,arr_nm);
        }else if(selectCase=="2"){
            runTerminalSet(cd,nm,orderCreateDays);
        }else if(selectCase=="3"){
            runArrTerminalEndList(mode,roundTicketCd,terCode,area,terminalNm,searchNm,orderCreateDays,arr_cd,arr_nm);
        }else if (selectCase=="4"){
            runArrDepterminalSet(cd,nm,orderCreateDays);
        }
    }
    addJS_Node (terSelectAlert);

    function terLayerAlert(str,arr_nm) {
        if(arr_nm == undefined){
            $('#finishTerminalNm').focus();
        }else if(arr_nm != undefined){
            terminalEndListSearch('',$("#finishTerminalNm").val());
        }
    }
    addJS_Node (terLayerAlert);

    function layerAlert(str) {
        return
    }
    addJS_Node (layerAlert);
    
    function addJS_Node (text, s_URL, funcToRun, runOnLoad) {
        var D                                   = document;
        var scriptNode                          = D.createElement ('script');
        if (runOnLoad) {
            scriptNode.addEventListener ("load", runOnLoad, false);
        }
        scriptNode.type                         = "text/javascript";
        if (text)       scriptNode.textContent  = text;
        if (s_URL)      scriptNode.src          = s_URL;
        if (funcToRun)  scriptNode.textContent  = '(' + funcToRun.toString() + ')()';

        var targ = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
        targ.appendChild (scriptNode);
    }
})();
