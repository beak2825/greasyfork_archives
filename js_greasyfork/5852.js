// ==UserScript==
// @name		 ogenerationify
// @version	  4.1999.5
// @description  olds' generation
// @include	  https://*hkgalden.com/view*
// @include	  http://*hkgalden.com/view*
// @copyright	1999
// @namespace	1999oldman
// @downloadURL https://update.greasyfork.org/scripts/5852/ogenerationify.user.js
// @updateURL https://update.greasyfork.org/scripts/5852/ogenerationify.meta.js
// ==/UserScript==

String.prototype.repeat = function(num){
	return new Array(num + 1).join(this);
};
String.prototype.insertAt = function(idx,str){
	return this.substr(0, idx) + str + this.substr(idx);
};
var rand = function(min,max){
	return Math.floor(Math.random() * (max - min + 1) + min);
};
var getRandBool = function(){
	return Math.round(Math.random()) < 1;
};
var getRandEmotion = function(){
	var a = ['[369]','#adore#','#yup#','O:-)',':-[','#ass#','[banghead]',':D','[bomb]','[bouncer]','[bouncy]','#bye#','[censored]','#cn#',':o)',':~(','xx(',':-]','#ng#','#fire#','[flowerface]',':-(','fuck','@_@','#good#','#hehe#','#hoho#','#kill2#','#kill#','^3^','#love#','#no#','[offtopic]',':O','[photo]','[shocking]','[slick]',':)','[sosad]','#oh#',':P',';-)','???','?_?','[yipes]','Z_Z'];
	return a[Math.floor(Math.random() * a.length)];
};
var getRandStrike = function(){
	return getRandBool() ? '=' : '-';
};
var getRandQuote = function(){
	return getRandBool() ? (getRandBool() ?['(((',')))'] : [' >>> ','>>> ']) : (getRandBool() ? ['[',']'] : [' ',' ']);
};
var ogenerationify = function(text){
	var rq = getRandQuote();
	text = text.replace(/唔/g, getRandBool() ? '吾' : '唔')
	.replace(/但/g, 'but')
	.replace(/女/g, '囡')
	.replace(/我/g, '阿叔' + (getRandBool() ? '' : '我'))
	.replace(/係/g, getRandBool() ? '糸' : '係')
	.replace(/喎/g, '咼')
	.replace(/好/g, '#good#')
	.replace(/撚(頭|樣)/g, '蒙$1')
	.replace(/老一輩/g, '老#good#輩')
	.replace(/啦/g, 'la')
	.replace(/子|仔/g, getRandBool() ? '仔' : '囝')
	.replace(/ {2,}(.+?) {2,}/, ' '+rq[0]+' $1 '+rq[1]+' ');
    var startStrike = getRandStrike().repeat(rand(4,16));
    text = startStrike + (getRandBool() ? '\n' : ' ') + text;
	for(var i = 0; i < rand(1, Math.round(text.length / 2)); i++){
		var rp = rand(0, text.length - 1);
		if(text.charCodeAt(rp) > 255 || /(\s|=|-)/.test(text.charAt(rp))){
            var rc = getRandBool() ? (getRandBool() ? getRandEmotion() : ' ') : (getRandBool() ? (Math.round(Math.random() * 10) > 6 ? '  ' : '\n') : (getRandBool() ? '..'.repeat(2,4) : getRandStrike().repeat(rand(1,8))));
			text = text.insertAt(rp, rc);
		}
	}
	text += getRandBool() ? getRandEmotion() : getRandEmotion() + getRandStrike().repeat(rand(4,16));
	return text;
};

setTimeout(function(){
	$('#fast_reply [id*="submit_fast_reply"]').click();
	$('#fpy').removeClass('fcs');
	$('#hkga-noti').empty();
	
	var clickEvts = $.grep($._data(document, 'events').click, function(e){
		return e.selector && e.selector.indexOf('submit_fast_reply') > 0 && e.handler.toString().indexOf('/ajax/fastreply') > 0;
	});
    unsafeWindow.ogenerationified = !1;
    for(var i = 0; i < clickEvts.length; i++){
		var origHandler = clickEvts[i].handler,
            origSelector = clickEvts[i].selector;
		clickEvts[i].handler = function(e){
            e.preventDefault();
            var ctn = $('#gae #ta');
            ctn.val(ogenerationify(ctn.val()));
            if(origSelector.indexOf('temp') < 0) origHandler(e);
		};
	}
},1000);