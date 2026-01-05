// ==UserScript==
// @id             InoSMI_HideComments
// @name           HideComment
// @version        1.03
// @namespace      MIT
// @author         
// @description    скрипт ведения игнор-листа на ИноСМИ
// @include        http://inosmi.ru/*
// @require        http://code.jquery.com/jquery.min.js
// @require        https://greasyfork.org/scripts/8269-jq-dom-observer-function/code/JQ_DOM_observer_function.js?version=38428
// @grant          FUNCTION
// @downloadURL https://update.greasyfork.org/scripts/7059/HideComment.user.js
// @updateURL https://update.greasyfork.org/scripts/7059/HideComment.meta.js
// ==/UserScript==

//прототип очистки массива
Array.prototype.clean = function() {
	// сортировка массива
	this.sort();
	// очистка массива от пустых переменных
	for (var i = this.length - 1; i > 0; i--) {
		if (this[i] == "")
			this.splice( i, 1);
	}
	// очистка массива от повторяющихся элементов
	for (var i = this.length - 1; i > 0; i--) {
		if (this[i] == this[i-1])
			this.splice( i, 1);
	}
	return this;
};

var to_hide = new Array();
var anticlone = "false";

$(document).ready(function() {
	//инициируем и считываем массив игноров
	if (localStorage.getItem('to_hide')) {
		to_hide = localStorage.getItem('to_hide').split(",");
	}
	else {
		to_hide.push('u_193012875');
		to_hide.push('u_207772399');
	}
	to_hide.clean();
	
	//считываем значение переменной anticlone
	if (localStorage.getItem('anticlone')) {
		anticlone = localStorage.getItem('anticlone');
	}
	
	//добавляем ссылку управления антиклоном
	$("div.addComment").before('<div><center><a id="anticlone"></a></center></div><br>');
	if (anticlone=="true") {
		$("a[id='anticlone']").html('<b>Скрыть невидимые знаки в никах</b>');
	}
	else {
		$("a[id='anticlone']").html('<b>Показать невидимые знаки в никах</b>');
	}
	
	//отслеживаем событие управление антиклоном
	$("a[id='anticlone']").click(function() {
		if (anticlone=="true") {
			anticlone = "false";
			$(this).html('<b>Показать невидимые знаки в никах</b>');
		}
		else {
			anticlone = "true";
			$(this).html('<b>Скрыть невидимые знаки в никах</b>');
		}
		localStorage.setItem('anticlone', anticlone);
		DoHideComment();
	});
	
	//скрываем комментарии после загрузки страницы
	DoHideComment();
	
	//отслеживаем событие добавления нового контента (разворачивание веток)
	$("li[id*='comment']").observe("childlist", "ul li:first", function() {
		DoHideComment();
	});
});

//функция скрытия комментариев
function DoHideComment() {
	if (to_hide.length != 0) {
		$.each(to_hide,  function() {		
			var obj = $("span[id*="+this+"]").parent();
			obj.html('Комментарий "'+$("span[id*="+this+"]").html()+'" скрыт скриптом');
			obj.append('<br><a class="unhide" id="'+this+'">Снять игнор</a>');
			obj.next().hide();
			obj.next().next().hide();
		});
	}
	
	//показываем или скрываем плюсы в никах
	$("span.orang").each(function() {
		var nick = $(this).html();
		if (anticlone=="true") {
			nick = nick.replace(/\s/g,'+');
		}
		else {
			nick = nick.replace(/\+/g,' ');
		}
		$(this).html(nick);
	});
	
	//отслеживаем клик по нику для добавления в игнор
	$("span[id*='u_']").unbind("click").click(function() {
		var obj = $(this).attr("id").substr(0,11);
		if (confirm('Добавить пользователя ID='+obj+' в игнор-лист?')) {
			to_hide.push(obj);
			localStorage.setItem('to_hide', to_hide);
			DoHideComment();
		}
	});
	//остлеживаем событие снятия игнора
	$(".unhide").unbind("click").one("click", function() {
		var obj = $(this).attr("id");
		if (confirm('Вы действительно хотите снять игнор c пользователя?')) {
			to_hide.splice($.inArray(obj, to_hide), 1);
			localStorage.setItem('to_hide', to_hide);
			location.reload();
		}
	});
}