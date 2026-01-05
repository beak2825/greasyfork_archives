// ==UserScript==
// Имя скрипта
// @name WofhSendInfoUserJS
// Описание скрипта
// @description WofhSendInfoUserJS версия 1.0.5
// @author menya
// @license MIT
// @version 1.0.5
// Указываем что бы скрипт работал только на определенном сайте
// @include http://w*.wofh.ru/*
// @namespace https://greasyfork.org/users/5805
// @downloadURL https://update.greasyfork.org/scripts/5684/WofhSendInfoUserJS.user.js
// @updateURL https://update.greasyfork.org/scripts/5684/WofhSendInfoUserJS.meta.js
// ==/UserScript==

// ждем пока все компоненты нового города проинициализируются 11144455
function JustWait() {
    if ($('.smenu-list').length == 0) {
        window.setTimeout(JustWait, 500);
    } else {
        JustDo();
    }
}
function JustDo() {
    $('.smenu-list').append('<li onclick="SendInfo();" ><a class="smenu-itemBtn button1  -js-tid">Отправить инфу</a><a class="smenu-itemIcn -js-tid" style="background:url(https://cdn4.iconfinder.com/data/icons/miu/22/cloud_cloud-upload_-24.png); background-repeat:no-repeat;" data-type="frm" data-title="Отправить инфу"></a></li>');
    $('.smenu-list').append('<script type="text/javascript">function notifyMe(text){if(!("Notification"in window)){alert("This browser does not support desktop notification");}else if(Notification.permission==="granted"){var notification=new Notification(text);}else if(Notification.permission!==\'denied\'){Notification.requestPermission(function(permission){if(!(\'permission\'in Notification)){Notification.permission=permission;}if(permission==="granted"){var notification=new Notification(text);}});}};function SendInfo() { var xhr = new XMLHttpRequest(); var params = JSON.stringify(servodata); xhr.open("POST", "http://wofh.biz/citiesinsert.php", true);  xhr.onreadystatechange = function() { if (xhr.readyState != 4) return;  if (xhr.status == 200) {notifyMe("Информация успешно отправлена."+xhr.statusText);};if (xhr.status != 200) {      notifyMe("Ошибка " + xhr.status + ": " + xhr.statusText);      return;    };   }; xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");  xhr.send(params);    };</script>');
}
// Если новый город
if (typeof servodata.towns == 'object') {
    JustWait();
}
// Если старый город
if (typeof JSN.army.data == 'object') {
    $('body').prepend('<div style="left: 10px; top: 20px; position: absolute;"><button onclick="SendInfo();" id="SendInfo" style="width:36px; height:36px; background:url(https://cdn4.iconfinder.com/data/icons/32px_Mantra/PNG/Cloud%20Upload%20Off.png); background-color:white; " title="Отправить инфу"></button><div>');
    $('body').prepend('<script type="text/javascript">function notifyMe(text){if(!("Notification"in window)){alert("This browser does not support desktop notification");}else if(Notification.permission==="granted"){var notification=new Notification(text);}else if(Notification.permission!==\'denied\'){Notification.requestPermission(function(permission){if(!(\'permission\'in Notification)){Notification.permission=permission;}if(permission==="granted"){var notification=new Notification(text);}});}};function SendInfo() { var xhr = new XMLHttpRequest(); var params = JSON.stringify(JSN.army.data); xhr.open("POST", "http://wofh.biz/citiesinsert.php", true);  xhr.onreadystatechange = function() { if (xhr.readyState != 4) return;  if (xhr.status == 200) {notifyMe("Информация успешно отправлена."+xhr.statusText);};if (xhr.status != 200) {      notifyMe("Ошибка " + xhr.status + ": " + xhr.statusText);      return;    };   }; xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");  xhr.send(params);    };</script>');
}
