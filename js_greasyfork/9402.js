// ==UserScript==
// @name           Next Notification Button
// @description    Skrypt dodaje przycisk do przechodzenie do pierwszego linku z listy powiadomień.   
// @namespace      http://www.wykop.pl/ludzie/mrleon/
// @author         mrleon
// @version        1.0
// @include        http://www.wykop.pl/wpis/*
// @require        https://ajax.googleapis.com/ajax/libs/jquery/1.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/9402/Next%20Notification%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/9402/Next%20Notification%20Button.meta.js
// ==/UserScript==

var main = function () {
    var button = "<ul><li class='m-hide'><a href='#' id='nextNotification'><span>Następne</span></a></li></ul>";
    var ul = document.getElementsByClassName('info m-reset-float m-hide')[0];
    $(ul).after(button);
    
    var goNext = false;

    $('#nextNotification').click(function (event) {
        goNext = true;
        event.preventDefault();
        wykop._ajaxCall($(this), (wykop.params["base"] + 'ajax2/powiadomienia/hashtags/' + wykop.params["hash"] +"//hash/" + wykop.params["hash"] + wykop.useBrowserNotifications).replace("false", ""));
    });
    
   wykop.handleNotificationsList = function ($el, data)
   { 
       $(".notificationsContainer").hide(); 
       $el.closest(".notification").find(".notificationsContainer").replaceWith(data.html); 
       $el.closest(".notification").find(".notificationsContainer").show(); 
       
       if (goNext)
       {
           var parsed = $.parseHTML(data.html);
           var index = 2;
           if($("div>ul>li:first", parsed).hasClass("type-light-warning"))
           {
               index = 3;
           }
           var url = $("div>ul>li:first>p>a", parsed).eq(index).attr("href");
           window.location.href = url;
       }
   };                           
};

var script = document.createElement('script');
script.textContent = '(' + main.toString() + ')();';
document.body.appendChild(script);