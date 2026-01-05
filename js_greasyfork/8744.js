// ==UserScript==
// @name         Hasta Scripti Alpha
// @namespace    http://www.popmundo.com/World/Popmundo.aspx/Character/2630740
// @version      0.1.201
// @description  enter something useful
// @author       Anthony McDonald
// @require      http://code.jquery.com/jquery-2.1.3.min.js
// @match        http://*.popmundo.com/World/Popmundo.aspx/Character/Diary/*
// @match        http://*.popmundo.com/World/Popmundo.aspx/City/PeopleOnline/*
// @match        http://*.popmundo.com/World/Popmundo.aspx/Locale/CharactersPresent/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/8744/Hasta%20Scripti%20Alpha.user.js
// @updateURL https://update.greasyfork.org/scripts/8744/Hasta%20Scripti%20Alpha.meta.js
// ==/UserScript==

$(document).ready(function() {
    var $currentPage=window.location.pathname;
    var $diary=$("#content").html();
    
    if ($currentPage.match(/\/World\/Popmundo.aspx\/City\/PeopleOnline/g) || $currentPage.match(/\/World\/Popmundo.aspx\/Locale\/CharactersPresent/g)) {
        $("#content").html($diary.replace(/Character/g, "Character/Diary"));
        $("tr").click(function() {
            $(this).hide("fast");
        });
    }
    
    if ($currentPage.match(/\/World\/Popmundo.aspx\/Character\/Diary/g)) {
        if (($diary.indexOf("Kendimi iyi hissetmiyorum. Sanırım hastalanıyorum.") > -1) || ($diary.indexOf("Kendimi garip hissediyorum... Doktor sorunumun") > -1) || ($diary.indexOf("beni gerçekten çok yoruyor.") > -1)) {
//keep the tab open
        }
        else
        {
            window.close();
        }
    }
});