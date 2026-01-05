// ==UserScript==
// @name           Size and color of rating according to it, no Zero (Лепра 2.0)
// @version        1.0
// @author         Gipnokote
// @description    Увеличивает размер и меняет цвет шрифта оценки в зависимости от рейтинга. Делает оценку O белой.
// @namespace      https://leprosorium.ru/
// @include        https://leprosorium.ru/comments/*
// @include        https://*.leprosorium.ru/comments/*
// @include        https://leprosorium.ru/users/*
// @downloadURL https://update.greasyfork.org/scripts/8952/Size%20and%20color%20of%20rating%20according%20to%20it%2C%20no%20Zero%20%28%D0%9B%D0%B5%D0%BF%D1%80%D0%B0%2020%29.user.js
// @updateURL https://update.greasyfork.org/scripts/8952/Size%20and%20color%20of%20rating%20according%20to%20it%2C%20no%20Zero%20%28%D0%9B%D0%B5%D0%BF%D1%80%D0%B0%2020%29.meta.js
// ==/UserScript==

var time = (new Date()).getTime();
var divs = $$('.vote_result')
var divslen = divs.length;
var comment;
var rating;
var notPost = false;
var good_limit = 300;
for(var i = 0; i < divslen; i++) {
      comment = divs[i];			           
			rating = getRating(comment);			
			if ((rating>good_limit*2))
				comment.style.color = "#0000"+d2h(rating);
			if ((rating>good_limit) && (rating<good_limit*2))
				comment.style.color = "#00"+d2h(good_limit*2-rating-1)+d2h(rating);
			if (rating>0 && rating<=good_limit)
				comment.style.color = "#00"+d2h(rating)+"00";
			if (rating<0 && rating >=-good_limit)
				comment.style.color = "#"+d2h(rating)+"0000";
			if (rating<-good_limit)
				comment.style.color = "#ff0000";
			if (rating==0)
				comment.style.color = "#ffffff";
			if(rating<0) rating=0;
			comment.style.fontSize = Math.min(16,9+2*Math.log(Math.abs(rating)+1)) + "px";
      if(rating>99) {
        comment.style.width="45px";
      }
      if(rating>999) {
        comment.style.width="55px";
      }	    
}

function getRating(div) {
	var r = div.innerHTML;
	return parseInt(r, 10);
}

function d2h(d) {d=Math.abs(d); d=d%good_limit; d=good_limit/4+3*d/4; d=Math.round(256*d/good_limit); var str=d.toString(16); if (str.length==2) return str; else return "0"+str;}
