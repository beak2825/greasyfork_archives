// ==UserScript==
// @name            Virtonomica:Склад сбыт
// @namespace      virtonomica
// @description     Склад сбыт
// @version        1.0
// @include        http://*virtonomic*.*/*/main/unit/view/*/sale
// @downloadURL https://update.greasyfork.org/scripts/9566/Virtonomica%3A%D0%A1%D0%BA%D0%BB%D0%B0%D0%B4%20%D1%81%D0%B1%D1%8B%D1%82.user.js
// @updateURL https://update.greasyfork.org/scripts/9566/Virtonomica%3A%D0%A1%D0%BA%D0%BB%D0%B0%D0%B4%20%D1%81%D0%B1%D1%8B%D1%82.meta.js
// ==/UserScript==

var run = function() {
    var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window); 
    var txt = [];
    $ = win.$;
	var i=0;
	var str = $('title').text();
	if(str.search('Склад')==-1){ return; }
	
	function arr(c,k){
		this.c = c;
		this.k = k;
	}
	
	function cpupd(prc1){
		var prc = prc1.val(),
			d = txt[prc1.attr('ids')],
			color = '#000',
			cm = prc * d.c / 100 + d.c,
			ck = cm / d.k;
			if(prc <= 0)
				color = '#f00';
			prc1.css('color',color);
			prc1.next().val(ck.toFixed(2));
			$('input', prc1.closest('td').next()).val(cm.toFixed(2));
	}
	
	function ckupd(ck1){
		var ck = ck1.val(),
			d = txt[ck1.attr('ids')],
			color = '#000',
			cm = d.k * ck,
			prc = cm * 100 / d.c - 100;
			if(prc <= 0)
				color = '#f00';
			
			ck1.prev().css('color',color).val(prc.toFixed(2));
			$('input', ck1.closest('td').next()).val(cm.toFixed(2));
	}
	
    $('.grid tr').each(function() {
		var celsth = $("th", this);
		$(celsth[5]).after('<th style="width:115px;">Проценты/ЦК</th>')
        //if($(this).attr('class')!='even' && $(this).attr('class')!='odd'){ return; }
		var cels = $("td", this);
		if($(cels[5]).text()=='---'){
			$(this).remove();
		}else{
			var prc = $('<input ids="'+i+'" class="prc" type="text" size="5" style="text-align:center;" />').keyup(function(){
				cpupd($(this))
			});
			var ck = $('<input ids="'+i+'" class="ck" type="text" size="5" style="text-align:center;" />').keyup(function(){
				ckupd($(this))
			});
			var c = parseFloat($(cels[9]).text().replace('$', '').replace(/ /g, '')),
				cm = $('.money',cels[12]).val(),
				k = parseFloat($(cels[7]).text().replace('$', '').replace(/ /g, '')),
				d = [];
			d[0] = cm * 100 / c - 100;
			d[1] = cm / k;
			if(d[0] <= 0)
				d[2] = '#F00';
			else
				d[2] = '#000';
			txt[i] = new arr(c,k);
			prc.val(d[0].toFixed(2)).css('color',d[2]);
			ck.val(d[1].toFixed(2));
			$(cels[11]).after('<td></td>').next().append(prc).append(ck);
			i++;
		}
    });
    $('.bperc').click(function(){
		var cp = $(this).prev().val(),
			cm = $(this).next(),
			cels = $(this).parent().parent(),
			cels1 = $("td", cels),
			c = parseFloat($(cels1[9]).text());
			cm.val(( (c / 100 * cp ) + c).toFixed(2));
    })
}

// Хак, что бы получить полноценный доступ к DOM >:]
var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);