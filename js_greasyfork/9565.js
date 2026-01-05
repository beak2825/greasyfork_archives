// ==UserScript==
// @name           Virtonomica:Снабжение
// @namespace      virtonomica
// @description    Снабжение
// @version        1.6
// @include        https://*virtonomic*.*/*/main/unit/view/*/supply
// @include	   https://virtonomic*.*/*/window/unit/supply/create/*/step2
// @include	   https://virtonomic*.*/*/window/unit/equipment/*
// @downloadURL https://update.greasyfork.org/scripts/9565/Virtonomica%3A%D0%A1%D0%BD%D0%B0%D0%B1%D0%B6%D0%B5%D0%BD%D0%B8%D0%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/9565/Virtonomica%3A%D0%A1%D0%BD%D0%B0%D0%B1%D0%B6%D0%B5%D0%BD%D0%B8%D0%B5.meta.js
// ==/UserScript==

var run=function(){
	function getIdProduct(l){
		var regexp = /\/([a-z0-9\_\-]+)\./,
		temp = regexp.exec(l);
		return temp[1];
	}

	function getIdUnit(){
		var regexp = /\/([0-9]+)\//,
		temp = regexp.exec(document.location.href);
		if(temp[1] === undefined)
			return '0';
		else
			return temp[1];
	}

	function parInt(x){
		return parseInt(x.replace('$', '').replace(/ /g, ''));
	}

	function parFloat(x){
		return parseFloat(x.replace('$', '').replace(/ /g, ''));
	}
	var storage = {
		set : function(unit, col, cach){
			var a = 
			localStorage.setItem(unit, JSON.stringify({
				'col':col,
				'cach':cach
			}));
		},
		
		get : function(unit){
			return localStorage[unit];
		},
		
		getColCach: function(pSnab){
			if(pSnab.type != 'продукты'){
				var unit = 'unit' + getIdUnit() + '_' + pSnab.idProduct;
				var sCol = '';
				var sCach = '';
				var s;
				if(pSnab.type != 'продукты'){
					s = storage.get(unit);
					if(s === undefined){
						storage.set(unit, '', '');
						s = {col:'',cach:'',unit:''};
					}else{
						s = JSON.parse(s);
					}
				}
				s.unit = unit;
				return s;
			}else
				return {col:'',cach:'',unit:'0'};
		}
	}
	function Forms(){
		
		$this = this;
		
		$this.f1 = function(c, c1, k, k1, k2, k3){
			return ((c1 * (k1 - k3) - c * (k - k3)) / (k2 - k3));
		}
		$this.f2 = function(c, x1, k, k1, k2, k3){
			return ((x1 * (k2 - k3) + c * (k1 - k3)) / (k1 - k3));
		}
		$this.f3 = function(c, c1, x1, x2, s1, s2){
			return ((s1 * x1 + s2 * x2) / (c1 - c));
		}
		$this.f4 = function(col1, col2, k1, k2){
			var q = col1 + col2;
			return (((col1 / q) * k1) + ((col2 / q) * k2));
		}
		$this.setCol = function(snab, val){
			if(snab.roditel.type != 'продукты')
				snab.input.val(val)
			else
				snab.temp.text(val)
			snab.col = val;
		}
		
		$this.Calculate1 = function(){
			
			$('.divtemp').text('');
			var c = parseInt($('#sc').val()),
				c1 = parseInt($('#sc1').val()),
				x1 = 0,
				x2 = 0,
				k = parseFloat($('#sk').val()),
				k1 = parseFloat($('#sk1').val()),
				k2 = parseFloat($('#sk2').val()),
				k3 = parseFloat($('#sk3').val()),
				cn1 = 0,
				cn2 = parseFloat($('#scn2').val()),
				cn3 = parseFloat($('#scn3').val());
			x1 = Math.round($this.f1(c, c1, k, k1, k2, k3));
			x2 = Math.round($this.f1(c, c1, k, k1, k3, k2));
			cn1 = $this.f3(c, c1, x1, x2, cn2, cn3).toFixed(2);
			
			if($('#svo').prop('checked')){
				
				if(x1 > $this.snableft.max){
					x1 = $this.snableft.max;
					c1 = Math.round($this.f2(c, x1, k, k1, k2, k3));
					x2 = Math.round($this.f1(c, c1, k, k1, k3, k2));
					cn1 = $this.f3(c, c1, x1, x2, cn2, cn3).toFixed(2);
				}
				if(x2 > $this.snabright.max){
					x2 = $this.snabright.max;
					c1 = Math.round($this.f2(c, x2, k, k1, k3, k2));
					x1 = Math.round($this.f1(c, c1, k, k1, k2, k3));
					cn1 = $this.f3(c, c1, x1, x2, cn2, cn3).toFixed(2);
				}
				$('#sc1').val(c1);
			}
			
			$('#sx1').val(x1);
			$('#sx2').val(x2);
			$('#scn1').val(cn1);
			
			$('#cenacach').text((cn1 / k1).toFixed(2));
			$('#cenacach1').text((cn2 / k2).toFixed(2));
			$('#cenacach2').text((cn3 / k3).toFixed(2));
			
			if($this.snableft)
				$this.snableft.addRas(x1);
			
			if($this.snabright)
				$this.snabright.addRas(x2);
			
			var zap = $('<button>').text('Заполнить').click(function(){
				if(c == 0){
					$this.snableft.input.val(x1);
					$this.snableft.col = x1;
					
					$this.snabright.input.val(x2);
					$this.snabright.col = x2;
				}else{
					$this.snableft.col += x1;
					$this.snableft.input.val($this.snableft.col);
					
					$this.snabright.col += x2;
					$this.snabright.input.val($this.snabright.col);
				}
					
				
				$this.snableft.roditel.raschet();
			});
			$this.panel.html('').append(zap);
			
		}
		
		$this.addSnableft = function(snab){
			this.snableft = snab;
			$('#sk2').val(snab.cach);
			$('#scn2').val(snab.cena);
		}
		
		$this.addSnabright = function(snab){
			this.snabright = snab;
			$('#sk3').val(snab.cach);
			$('#scn3').val(snab.cena);
		}
		
		$this.formSmes = function(poditel){
			
			poditel = '#mainContent';
			
			var closespan = $('<span>', {'style':'float:right;margin-right:10px;color:#f00;font-size:14pt;cursor:pointer;'})
				.html('&#215;')
				.click(function(){
					$(this).closest('div').hide();
				});
			
			var bstyle = 'position:fixed;left:0px;top:0px;';
			if(typeof poditel == 'string')
				$(poditel).after('<div id="mainformc" style="display:none; position:fixed; width:500px; background-color:#fff; border:solid 1px #000; z-index:1001; top:10px; left:10px;"></div>')
			else{
				poditel.append('<div id="mainformc" style="display:none; position:fixed; width:500px; background-color:#fff; border:solid 1px #000; z-index:1001; top:10px; left:10px;"></div>')
				bstyle = '';
			}
			
			var but_show = $('<input>', {
					'type':'button',
					'value':'Форма смеси',
					'style':bstyle
			}).click(function() { 
				$('#mainformc').show(); 
			});
			
			var but_ras = $('<input>', {
					'type':'button',
					'value':'Расчет'
			}).click(function() { 
				$this.Calculate1();
			});
			
			$this.panel = $('<div>');
			
			if(typeof poditel == 'string')
				$(poditel).prepend(but_show);
			else
				poditel.append(but_show);
			
			$('#mainformc')
				.append(closespan)
				.append('<table align="center" width="20%" border="0" class="grid"><tr class="odd" ><th></th><th >В наличии</th><th>Необходимо</th><th colspan=2 scope="col">Продукты</th></tr><tr align="right" class="odd"><th>Количество</th><td><input type=text id="sc" maxlength=11 value="0" size=10 tabindex=1></td><td><input type=text id="sc1" maxlength=11 value="0" size=10 tabindex=3></td><td><input style="background-color:#ddd;" readonly type=text id="sx1" maxlength=11 value="0" size=10></td><td><input style="background-color:#ddd;" readonly type=text id="sx2" maxlength=11 value="0" size=10></td></tr><tr align="right" class="even"><th>Качество</th><td><input type=text id="sk" maxlength=11 value="0" size=10 tabindex=2></td><td><input type=text id="sk1" maxlength=11 value="0" size=10 tabindex=4></td><td><input type=text id="sk2" maxlength=11 value="0" size=10 tabindex=5></td><td><input type=text id="sk3" maxlength=11 value="0" size=10 tabindex=7></td></tr><tr align="right" class="odd"><th>Цена</th><td></td><td ><div id="cenacach" style="color:#f00;"></div><input style="background-color:#ddd;" readonly type=text id="scn1" maxlength=11 value="0" size=10></td><td><div id="cenacach1" style="color:#f00;"></div><input type=text id="scn2" maxlength=11 value="0" size=10 tabindex=6></td><td><div id="cenacach2" style="color:#f00;"></div><input type=text id="scn3" maxlength=11 value="0" size=10 tabindex=8></td></tr></table>')
				.append($this.panel)
				.append(but_ras)
				.append('<label><input type="checkbox" id="svo" />Считать с кол-вом остатков</label>');
			
		}
		
		$this.formAvtoSmes = function(pSnab){
			
			var s = storage.getColCach(pSnab);
			var sCol = s['col'];
			var sCach = s['cach'];
			var unit = s['unit'];
			
			var $this = this;
			
			function r(c1, k1, ar1, ar2, result){
				
				var a1 = ar1;
				var a2 = ar2;
					
				var x1 = Math.round($this.f1(result.col, c1, result.cach, k1, ar1[0].cach, ar2[0].cach));
				var x2 = Math.round($this.f1(result.col, c1, result.cach, k1, ar2[0].cach, ar1[0].cach));
				
				if(x1 > ar1[0].max1){
					x1 = ar1[0].max1;
					var col = Math.round($this.f2(result.col, x1, result.cach, k1, ar1[0].cach, ar2[0].cach));
					x2 = Math.round($this.f1(result.col, col, result.cach, k1, ar2[0].cach, ar1[0].cach));
				}
				
				if(x2 > ar2[0].max1){
					x2 = ar2[0].max1;
					var col = Math.round($this.f2(result.col, x2, result.cach, k1, ar2[0].cach, ar1[0].cach));
					x1 = Math.round($this.f1(result.col, col, result.cach, k1, ar1[0].cach, ar2[0].cach));
				}
				
				if(x1 > 0 && x2 > 0 && x1 <= ar1[0].max1 && x2 <= ar2[0].max1){
					var cach = $this.f4(x1, x2, ar1[0].cach, ar2[0].cach);
					result.cach = $this.f4(result.col, (x1 + x2), result.cach, cach);
					
					ar1[0].col += x1;
					ar2[0].col += x2;
					
					$this.setCol(ar1[0], ar1[0].col);
					$this.setCol(ar2[0], ar2[0].col);
					
					result.col += x1 + x2;
					
					res.html('Общее количество: ' + result.col + '<br>Общее качество: ' + result.cach)
					
					ar1[0].max1 -= x1;
					ar2[0].max1 -= x2;
				}else{
					ar1[0].max1 = 0;
					ar2[0].max1 = 0;
					a1 = ar1.slice(1);
					a2 = ar2.slice(1);
				}
				
				console.log(result.cach)
				
				if(ar1[0].col >= ar1[0].max)
					a1 = ar1.slice(1);
				
				if(ar2[0].col >= ar2[0].max)
					a2 = ar2.slice(1);
				
				return {ar1: a1, ar2: a2, result: result}
			}
			
			var f = $('<div>').css({'position':'absolute','display':'inline-block','background-color':'#fff','border':'solid 1px #000','z-index':'1001'}).appendTo(pSnab.thirstTd);
			var closespan = $('<span>', {'style':'float:right;margin-right:10px;color:#f00;font-size:14pt;cursor:pointer;'})
				.html('&#215;')
				.appendTo(f)
				.click(function(){
					$(this).closest('div').remove();
				});
			if(pSnab.type == 'продукты')
				$('<button>').text('Докупить').css({'margin':'5px'}).appendTo(f).after('<br>').click(function(){
					scladcol.show();
					scladcach.show();
				})
			
			var scladcol = $('<input>', {'type':'text','tabindex':'1'}).css({'margin':'25px 5px 5px 5px'}).val(0).hide().appendTo(f);
			var col = $('<input>', {'type':'text','tabindex':'3'}).css({'margin':'25px 5px 5px 5px'}).val(sCol).append('<br>').appendTo(f).focus();
			var scladcach = $('<input>', {'type':'text','tabindex':'2'}).css({'margin':'5px'}).val(0).hide().appendTo(f);
			var cach = $('<input>', {'type':'text','tabindex':'4'}).css({'margin':'5px'}).val(sCach).appendTo(f);
			col.wrap( "<label>Количество</label>" );
			cach.wrap( "<label>Качество&nbsp;&nbsp;&nbsp;&nbsp;</label>" ).after('<br>');
			col.after('<br>')
			var b = $('<button>').text('Расчет').css({'margin':'5px'}).appendTo(f).click(function(){
				
				var col1 = parseInt(col.val());
				var cach1 = parseFloat(cach.val());
				var ar1 = [], ar2 = [];
				
				$this.scladcol1 = parseInt(scladcol.val());
				$this.scladcach1 = parseFloat(scladcach.val());
				
				for(var i = 0; i < pSnab.snab.length; i++){
					$this.setCol(pSnab.snab[i], 0);
					pSnab.snab[i].max1 = pSnab.snab[i].max;
					
					if(pSnab.type == 'продукты'){
						if(pSnab.snab[i].max > 0 && pSnab.snab[i].ch.prop('checked')){
							if(cach1 > pSnab.snab[i].cach){
								ar1.push(pSnab.snab[i]);
							}else{
								ar2.push(pSnab.snab[i]);
							}
						}
					}else{
						if(pSnab.snab[i].max > 0){
							if(cach1 > pSnab.snab[i].cach){
								ar1.push(pSnab.snab[i]);
							}else{
								ar2.push(pSnab.snab[i]);
							}
						}
					}
				}
				
				ar1.sort(function(obj1, obj2) {
					return obj1.ck - obj2.ck;
				})
				ar2.sort(function(obj1, obj2) {
					return obj1.ck - obj2.ck;
				})
				
				var result = {col: $this.scladcol1, cach: $this.scladcach1};
				
				if(ar1.length > 0 && ar2.length > 0){
					while(true) {
						if(ar1.length > 0 && ar2.length > 0){
							var k = r(col1, cach1, ar1, ar2, result);
							result = k.result;
							ar1 = k.ar1;
							ar2 = k.ar2;
							if(result.col >= col1)
								break;
						}else{
							if(ar1.length == 0)
								alert('Недостаточно товара меньшего качества.');
							if(ar2.length == 0)
								alert('Недостаточно товара большего качества.');
							break;
						}
					}
					
				}
				
				if(pSnab.type == 'продукты'){
					pSnab.zakaz = $this.table;
					pSnab.show()
					pSnab.hide();
				}
					
				pSnab.raschet();
				
				storage.set(unit, col1, cach1);
				
				return false;
			});
			var res = $('<div>', {'color':'red'}).appendTo(f);
			col.focus();
			$this.table = $('<div>').appendTo(f);
		}
		
		$this.formAvtoSmes1 = function(pSnab){
			
			var $this = this;
			
			function r(c1, k1, ar1, ar2, result){
				
				var a1 = ar1;
				var a2 = ar2;
				
				if(result.cach < k1){
					if(ar2[0].max1 > 0){
						result.cach = $this.f4(result.col, 1, result.cach, ar2[0].cach);
						result.col ++;
						ar2[0].max1 --;
						ar2[0].col ++;
						$this.setCol(ar2[0], ar2[0].col);
					}else{
						a2 = ar2.slice(1);
					}
				}
				
				if(result.cach > k1){
					if(ar1[0].max1 > 0){
						result.cach = $this.f4(result.col, 1, result.cach, ar1[0].cach);
						result.col ++;
						ar1[0].max1 --;
						ar1[0].col ++;
						$this.setCol(ar1[0], ar1[0].col);
					}else{
						a1 = ar1.slice(1);
					}
				}
				
				return {ar1: a1, ar2: a2, result: result}
			}
			
			var f = $('<div>').css({'position':'absolute','display':'inline-block','background-color':'#fff','border':'solid 1px #000','z-index':'1001'}).appendTo(pSnab.thirstTd);
			var closespan = $('<span>', {'style':'float:right;margin-right:10px;color:#f00;font-size:14pt;cursor:pointer;'})
				.html('&#215;')
				.appendTo(f)
				.click(function(){
					$(this).closest('div').remove();
				});
			if(pSnab.type == 'продукты')
				$('<button>').text('Докупить').css({'margin':'5px'}).appendTo(f).after('<br>').click(function(){
					scladcol.show();
					scladcach.show();
				})
			var scladcol = $('<input>', {'type':'text','tabindex':'1'}).css({'margin':'25px 5px 5px 5px'}).val(0).hide().appendTo(f);
			var col = $('<input>', {'type':'text','tabindex':'3'}).css({'margin':'25px 5px 5px 5px'}).append('<br>').appendTo(f);
			var scladcach = $('<input>', {'type':'text','tabindex':'2'}).css({'margin':'5px'}).val(0).hide().appendTo(f);
			var cach = $('<input>', {'type':'text','tabindex':'4'}).css({'margin':'5px'}).appendTo(f);
			col.wrap( "<label>Количество</label>" );
			cach.wrap( "<label>Качество&nbsp;&nbsp;&nbsp;&nbsp;</label>" ).after('<br>');
			col.after('<br>')
			var b = $('<button>').text('Расчет').css({'margin':'5px'}).appendTo(f).click(function(){
				
				var col1 = parseInt(col.val());
				var cach1 = parseFloat(cach.val());
				var ar1 = [], ar2 = [];
				
				$this.scladcol1 = parseInt(scladcol.val());
				$this.scladcach1 = parseFloat(scladcach.val());
				
				for(var i = 0; i < pSnab.snab.length; i++){
					$this.setCol(pSnab.snab[i], 0);
					pSnab.snab[i].max1 = pSnab.snab[i].max;
					
					if(pSnab.type == 'продукты'){
						if(pSnab.snab[i].max > 0 && pSnab.snab[i].ch.prop('checked')){
							if(cach1 > pSnab.snab[i].cach){
								ar1.push(pSnab.snab[i]);
							}else{
								ar2.push(pSnab.snab[i]);
							}
						}
					}else{
						if(pSnab.snab[i].max > 0){
							if(cach1 > pSnab.snab[i].cach){
								ar1.push(pSnab.snab[i]);
							}else{
								ar2.push(pSnab.snab[i]);
							}
						}
					}
				}
				
				ar1.sort(function(obj1, obj2) {
					return obj1.ck - obj2.ck;
				})
				ar2.sort(function(obj1, obj2) {
					return obj1.ck - obj2.ck;
				})
				
				var result = {col: $this.scladcol1, cach: $this.scladcach1};
				
				if(ar1.length > 0 && ar2.length > 0){
					while(true) {
						if(ar1.length > 0 && ar2.length > 0){
							var k = r(col1, cach1, ar1, ar2, result);
							result = k.result;
							ar1 = k.ar1;
							ar2 = k.ar2;
							if(result.col >= col1)
								break;
						}else{
							if(ar1.length == 0)
								alert('Недостаточно товара меньшего качества.');
							if(ar2.length == 0)
								alert('Недостаточно товара большего качества.');
							break;
						}
					}
					
				}
				
				if(pSnab.type == 'продукты'){
					pSnab.zakaz = $this.table;
					pSnab.show()
					pSnab.hide();
				}
					
				pSnab.raschet();
					
				
				return false;
			});
			var res = $('<div>', {'color':'red'}).appendTo(f);
			col.focus();
			$this.table = $('<div>').appendTo(f);
		}
		
		$this.formAvtoSmes2 = function(pSnab){
			
			var s = storage.getColCach(pSnab);
			var sCol = s['col'];
			var sCach = s['cach'];
			var unit = s['unit'];
			
			var $this = this;
			
			function podbor(a1, a2, cach, col){
				var aa = [];
				
				for(var i = 0; i < a1.length; i++){
					for(var j = 0; j < a2.length; j++){
						var x1 = Math.round($this.f1(0, col, 0, cach, a1[i].cach, a2[j].cach));
						var x2 = Math.round($this.f1(0, col, 0, cach, a2[j].cach, a1[i].cach));
						if(x1 > 0 && x2 > 0){
							var ck = $this.f4(x1, x2, a1[i].cena, a2[j].cena) / $this.f4(x1, x2, a1[i].cach, a2[j].cach);
							aa.push([a1[i], a2[j], ck]);
						}
					}
				}
				
				aa.sort(function(obj1, obj2) {
					return obj1[2] - obj2[2];
				})
				
				var a1 = [];
				var a2 = [];
				
				for(var i = 0; i < aa.length; i++){
					a1[i] = aa[i][0];
					a2[i] = aa[i][1];
				}
				
				return {'ar1':a1, 'ar2':a2}
			}
			
			function r(c1, k1, ar1, ar2, result){
				
				var a1 = ar1;
				var a2 = ar2;
				
				var x1 = Math.round($this.f1(result.col, c1, result.cach, k1, ar1[0].cach, ar2[0].cach));
				var x2 = Math.round($this.f1(result.col, c1, result.cach, k1, ar2[0].cach, ar1[0].cach));
				
				if(x1 > ar1[0].max1){
					x1 = ar1[0].max1;
					var col = Math.round($this.f2(result.col, x1, result.cach, k1, ar1[0].cach, ar2[0].cach));
					x2 = Math.round($this.f1(result.col, col, result.cach, k1, ar2[0].cach, ar1[0].cach));
				}
				
				if(x2 > ar2[0].max1){
					x2 = ar2[0].max1;
					var col = Math.round($this.f2(result.col, x2, result.cach, k1, ar2[0].cach, ar1[0].cach));
					x1 = Math.round($this.f1(result.col, col, result.cach, k1, ar1[0].cach, ar2[0].cach));
				}
				
				if(x1 > 0 && x2 > 0 && x1 <= ar1[0].max1 && x2 <= ar2[0].max1){
					var cach = $this.f4(x1, x2, ar1[0].cach, ar2[0].cach);
					result.cach = $this.f4(result.col, (x1 + x2), result.cach, cach);
					
					ar1[0].col += x1;
					ar2[0].col += x2;
					
					$this.setCol(ar1[0], ar1[0].col);
					$this.setCol(ar2[0], ar2[0].col);
					
					result.col += x1 + x2;
					
					res.html('Общее количество: ' + result.col + '<br>Общее качество: ' + result.cach)
					
					ar1[0].max1 -= x1;
					ar2[0].max1 -= x2;
				}
				
				if(ar1[0].col >= ar1[0].max){
					a1 = ar1.slice(1);
					a2 = ar2.slice(1);
				}
				
				if(ar2[0].col >= ar2[0].max){
					a1 = ar1.slice(1);
					a2 = ar2.slice(1);
				}
				
				return {ar1: a1, ar2: a2, result: result}
			}
			
			var f = $('<div>').css({'position':'absolute','display':'inline-block','background-color':'#fff','border':'solid 1px #000','z-index':'1001'}).appendTo(pSnab.thirstTd);
			var closespan = $('<span>', {'style':'float:right;margin-right:10px;color:#f00;font-size:14pt;cursor:pointer;'})
				.html('&#215;')
				.appendTo(f)
				.click(function(){
					$(this).closest('div').remove();
				});
			if(pSnab.type == 'продукты')
				$('<button>').text('Докупить').css({'margin':'5px'}).appendTo(f).after('<br>').click(function(){
					scladcol.show();
					scladcach.show();
				})
			var scladcol = $('<input>', {'type':'text','tabindex':'1'}).css({'margin':'25px 5px 5px 5px'}).val(0).hide().appendTo(f);
			var col = $('<input>', {'type':'text','tabindex':'3'}).css({'margin':'25px 5px 5px 5px'}).val(sCol).append('<br>').appendTo(f);
			var scladcach = $('<input>', {'type':'text','tabindex':'2'}).css({'margin':'5px'}).val(0).hide().appendTo(f);
			var cach = $('<input>', {'type':'text','tabindex':'4'}).css({'margin':'5px'}).val(sCach).appendTo(f);
			col.wrap( "<label>Количество</label>" );
			cach.wrap( "<label>Качество&nbsp;&nbsp;&nbsp;&nbsp;</label>" ).after('<br>');
			col.after('<br>')
			var b = $('<button>').text('Расчет').css({'margin':'5px'}).appendTo(f).click(function(){
				
				var col1 = parseInt(col.val());
				var cach1 = parseFloat(cach.val());
				var ar1 = [], ar2 = [];
				
				$this.scladcol1 = parseInt(scladcol.val());
				$this.scladcach1 = parseFloat(scladcach.val());
				
				for(var i = 0; i < pSnab.snab.length; i++){
					$this.setCol(pSnab.snab[i], 0);
					pSnab.snab[i].max1 = pSnab.snab[i].max;
					if(pSnab.snab[i].max1 > 0){
						if(pSnab.type == 'продукты'){
							if(pSnab.snab[i].max > 0 && pSnab.snab[i].ch.prop('checked')){
								if(cach1 > pSnab.snab[i].cach){
									ar1.push(pSnab.snab[i]);
								}else{
									ar2.push(pSnab.snab[i]);
								}
							}
						}else{
							if(pSnab.snab[i].max > 0){
								if(cach1 > pSnab.snab[i].cach){
									ar1.push(pSnab.snab[i]);
								}else{
									ar2.push(pSnab.snab[i]);
								}
							}
						}
					}
				}
				
				ar1.sort(function(obj1, obj2) {
					return obj1.ck - obj2.ck;
				})
				ar2.sort(function(obj1, obj2) {
					return obj1.ck - obj2.ck;
				})
				
				var result = {col: $this.scladcol1, cach: $this.scladcach1};
				
				var p = podbor(ar1, ar2, cach1, col1);
				ar1 = p.ar1;
				ar2 = p.ar2;
				
				if(ar1.length > 0 && ar2.length > 0){
					while(true) {
						if(ar1.length > 0 && ar2.length > 0){
							var k = r(col1, cach1, ar1, ar2, result);
							result = k.result;
							ar1 = k.ar1;
							ar2 = k.ar2;
							if(result.col >= col1)
								break;
						}else{
							if(ar1.length == 0)
								alert('Недостаточно товара меньшего качества.');
							if(ar2.length == 0)
								alert('Недостаточно товара большего качества.');
							break;
						}
					}
					
				}
				
				if(pSnab.type == 'продукты'){
					pSnab.zakaz = $this.table;
					pSnab.show()
					pSnab.hide();
				}
					
				pSnab.raschet();
				
				storage.set(unit, col1, cach1);
				
				return false;
			});
			var res = $('<div>', {'color':'red'}).appendTo(f);
			col.focus();
			$this.table = $('<div>').appendTo(f);
		}
		
		
	}
	function productSnab(col,cach,brend,seb,prod,zakaz,zakup,tr,index,type,thirstTd){
		
		var $this = this;
		
		$this.sort = function(){
			var i = 0, j = 0, n = 0;
			
			$this.ar1 = [];
			$this.ar2 = [];
			
			for(i = 0; i < $this.snab.length; i++){
				if(this.sc.val() > $this.snab[i].cach){
					$this.ar1.push($this.snab[i]);
					$this.snab[i].nameTd.closest('tr').css({'background-color':'#fff'});
				}else{
					$this.ar2.push($this.snab[i]);
					$this.snab[i].nameTd.closest('tr').css({'background-color':'rgb(233, 232, 255)'});
				}
			}
			$this.ar1.sort(function(obj1, obj2) {
				return obj2.ck - obj1.ck;
			})
			$this.ar2.sort(function(obj1, obj2) {
				return obj1.ck - obj2.ck;
			})
			$this.snab = [];
			$this.snab = $this.snab.concat($this.ar1,$this.ar2);
			
			for(i = $this.snab.length-1; i >= 0; i--){
				$this.zakaz.after($this.snab[i].tr)
			}
			
		}
		
		$this.sortqp = function(type){
			if(type=='asc'){
				$this.snab.sort(function(obj1, obj2) {
					return obj1.ck - obj2.ck;
				})
			}
			if(type=='desc'){
				$this.snab.sort(function(obj1, obj2) {
					return obj2.ck - obj1.ck;
				})
			}
			for(var i = $this.snab.length-1; i >= 0; i--){
				$this.th.after($this.snab[i].tr)
			}
		}
		
		$this.raschet = function(){
			
			function f1(col1, col2, k1, k2){
				var q = col1 + col2;
				return (((col1 / q) * k1) + ((col2 / q) * k2));
			}
			
			function isZiro(x){
				if(x == 0)
					return '';
				else
					return x;
			}
			
			if($this.snab.length > 0){
			
				var col = 0;
				var cena = 0;
				var cach = 0;
				var brend = 0;
				var ck = 0;
				
				var col1 = 0;
				var cena1 = 0;
				var cach1 = 0;
				var brend1 = 0;
				var ck1 = 0;
				
				var b = false;
				var style = 'rgb(238, 255, 238)';
				
				for(var i = 0; i < $this.snab.length; i++){
					if($this.snab[i].col > 0){
						cena = f1(col, $this.snab[i].col, cena, $this.snab[i].cena).toFixed(2);
						cach = f1(col, $this.snab[i].col, cach, $this.snab[i].cach).toFixed(2);
						brend = f1(col, $this.snab[i].col, brend, $this.snab[i].brend).toFixed(2);
						ck = (cena / cach).toFixed(2);
						col += $this.snab[i].col;
					}
					
					if($this.snab[i].col > $this.snab[i].max)
						b = true;
					var styleCol = '';
					
					if($this.snab[i].col == $this.snab[i].max)
						styleCol = 'rgb(238, 255, 238)';
					
					if($this.snab[i].col > $this.snab[i].max)
						styleCol = 'rgb(255, 238, 238)';
					
					var t = $this.snab[i].svobTd.closest('td');
					if($this.type == 'shop' || $this.type == 'animalfarm' || $this.type == 'restaurant')
						t = $this.snab[i].svobTd.closest('table').closest('td');
					
					t.css({'background-color': styleCol});
				}
				
				if(b){
					for(var i = 0; i < $this.snab.length; i++){
						var c = $this.snab[i].col;
						if($this.snab[i].col > $this.snab[i].max)
							c = $this.snab[i].max;
						
						if(c > 0){
							cena1 = f1(col1, c, cena1, $this.snab[i].cena).toFixed(2);
							cach1 = f1(col1, c, cach1, $this.snab[i].cach).toFixed(2);
							brend1 = f1(col1, c, brend1, $this.snab[i].brend).toFixed(2);
							ck1 = (cena1 / cach1).toFixed(2);
							col1 += c;
						}
					}
					style = 'rgb(255, 238, 238)';
				}
				
				var zak = col;
				if(col1 > 0)
					zak = col1;
				
				var c2 = cach;
				if(cach1 > 0)
					c2 = cach1;
				
				if(isNaN(col)) col = 0;
				if(isNaN(cach)) cach = 0;
				if(isNaN(brend)) brend = 0;
				if(isNaN(cena)) cena = 0;
				if(isNaN(ck)) ck = 0;
				
				var t;
				
				if($this.type == 'shop')
					t = $('<table class="noborder"><tr class="zak" col="'+zak+'" cach="'+c2+'"><td class="nowrap" align="right">'+sayNumber(col)+'</td><td class="nowrap" align="right">'+isZiro(sayNumber(col1))+'</td></tr>'
						+'<tr><td class="nowrap" align="right">'+cach+'</td><td class="nowrap" align="right">'+isZiro(cach1)+'</td></tr>'
						+'<tr><td class="nowrap" align="right">'+brend+'</td><td class="nowrap" align="right">'+isZiro(brend1)+'</td></tr>'
						+'<tr><td class="nowrap" align="right">'+cena+'</td><td class="nowrap" align="right">'+isZiro(cena1)+'</td></tr>'
						+'<tr><td class="nowrap" align="right">&nbsp;</td><td class="nowrap" align="right">&nbsp;</td></tr>'
						+'<tr><td class="nowrap" align="right">'+ck+'</td><td class="nowrap" align="right">'+isZiro(ck1)+'</td></tr></table>');
				
				if($this.type == 'animalfarm' || $this.type == 'restaurant')
					t = $('<table cellpadding="0" cellspacing="0" class="noborder"><tr class="zak" col="'+zak+'" cach="'+c2+'"><td class="nowrap" align="right">'+sayNumber(col)+'&nbsp;</td><td class="nowrap" align="right">'+isZiro(sayNumber(col1))+'</td></tr>'
						+'<tr><td class="nowrap" align="right">'+cach+'&nbsp;</td><td class="nowrap" align="right">'+isZiro(cach1)+'</td></tr>'
						+'<tr><td class="nowrap" align="right">'+cena+'&nbsp;</td><td class="nowrap" align="right">'+isZiro(cena1)+'</td></tr>'
						+'<tr><td class="nowrap" align="right">'+ck+'&nbsp;</td><td class="nowrap" align="right">'+isZiro(ck1)+'</td></tr></table>');
				
				if($this.type == 'продукты'){
					t = $('<table cellpadding="2" cellspacing="0" class="noborder" style="margin-top: 16px;"><tr><td>Количество</td><td class="nowrap" align="right">'+sayNumber(col)+'</td><td class="nowrap" align="right">'+isZiro(sayNumber(col1))+'</td></tr>'
						+'<tr><td>Качество</td><td class="nowrap" align="right">'+cach+'</td><td class="nowrap" align="right">'+isZiro(cach1)+'</td></tr>'
						+'<tr><td>Цена</td><td class="nowrap" align="right">'+cena+'</td><td class="nowrap" align="right">'+isZiro(cena1)+'</td></tr>'
						+'<tr><td>Цена-качество</td><td class="nowrap" align="right">'+ck+'</td><td class="nowrap" align="right">'+isZiro(ck1)+'</td></tr></table>');
									
				}
				
				if($this.type == 'sklad'){
					
					var ost = $this.col - $this.prod;
					
					var c1 = cena;
					if(cena1 > 0)
						c1 = cena1;
					
					var pcen = f1(ost, zak, $this.seb, c1);
					var pcach = f1(ost, zak, $this.cach, c2);
					
					t = $('<td align="right">'
							+'<table>'
								+'<tr><td colspan="2" align="right"><strong>После пересчета</strong></td></tr>'
								+'<tr><td align="right">На складе:</td><td align="right"><strong>'+sayNumber(ost + zak)+'</strong></td></tr>'
								+'<tr><td align="right">Качество/Себестоимость:</td><td align="right"><strong>'+ pcach.toFixed(2) +'/$'+ pcen.toFixed(2) +'</strong></td></tr>'
								+'<tr><td align="right">Цена-качество:</td><td align="right"><strong>'+(pcen / pcach).toFixed(2)+'</strong></td></tr>'
							+'</table>'
							+'<td align="right" class="zak" col="'+zak+'" cach="'+c2+'"><strong>' + sayNumber(col) + '</strong><br><strong><span class="">'+isZiro(sayNumber(col1))+'<span></strong></td>'
							+'<td></td>'
							+'<td align="right"><strong>'+cena+'</strong><br><strong>'+isZiro(cena1)+'</strong></td>'
							+'<td></td>'
							+'<td align="right"><strong>'+cach+'</strong><br><strong>'+isZiro(cach1)+'</strong></td>'
							+'<td></td>'
							+'<td></td>'
							+'<td></td>');
				}
				$this.zakaz.css({'background-color':style}).html(t);
				
				$('.zak').unbind('click').css({'cursor':'pointer'}).click(function(){
					var col = $(this).attr('col');
					var cach = $(this).attr('cach');
					$('#sc').val(col);
					$('#sk').val(cach);
				});
				
			}
			
		}
		
		$this.hide = function(){
			for(var i=0; i<$this.snab.length; i++){
				if($this.snab[i].col == 0)
					$this.snab[i].tr.hide();
			}
		}
		
		$this.show = function(){
			for(var i=0; i<$this.snab.length; i++){
				$this.snab[i].tr.show();
			}
		}

		$this.checked = function(ch){
			for(i = 0; i < $this.snab.length; i++){
				$this.snab[i].ch.attr("checked", ch); 
			}
		}
		
		$this.col = parInt(col);
		$this.cach = parFloat(cach);
		$this.brend = parFloat(brend);
		$this.seb = parFloat(seb);
		$this.prod = parInt(prod);
		$this.zakaz = zakaz;
		$this.zakup = parInt(zakup);
		$this.tr = tr;
		$this.index = index;
		$this.type = type;
		$this.thirstTd = thirstTd;
		
		$this.ck = parFloat(($this.seb / $this.cach).toFixed(2));
		
		$this.tr.addClass('product' + $this.index);
		
		var td = $('td', tr);
		
		var panel = $('<div>').prependTo(thirstTd);
		
		if($this.type == 'sklad'){
			$this.sc = $('<input>').val($this.cach).appendTo(panel).keyup(function(){
				$this.sort();
			});
		}
		
		$('<div>', {'class':'unit_button btn-success','title':'Автосмесь'}).html('<i class="fa fa-sliders" style="color:#fff"></i>').css({'float':'none','min-width':'20px'}).appendTo(panel).click(function(){
				var forma = new Forms();
				forma.formAvtoSmes2($this);
				return false;
			});
		
		if($this.type == 'продукты'){
			
			$('<div>', {'class':'unit_button btn-success','title':'Показать всё'}).html('<i class="fa fa-eye" style="color:#fff"></i>').css({'float':'none','min-width':'20px'}).appendTo(panel).click(function(){
				$this.show();
				return false;
			});
			
			$this.idProduct = '';
			
		}else{
			if($this.type != 'sclad')
				$this.zakaz.prev().children('table').append('<tr><td>ЦК</td><td class="nowrap" align="right">'+ ($this.seb / $this.cach).toFixed(2) +'</td></tr>');
			
			$this.idProduct = getIdProduct($('img', thirstTd).attr('src'));
		}
		
		if($this.type == 'sklad'){
			
			$this.zakaz = $('<tr>', {'class':'p_title'}).insertAfter(zakaz);
			
			$('<input>').attr({'type':'checkbox', 'checked':'checked', 'id':'psnab' + $this.index}).appendTo(panel).change(function(){
				if($(this).prop('checked'))
					for(var i=0; i<$this.snab.length; i++)
						$this.snab[i].nameTd.closest('tr').show()
				else
					for(var i=0; i<$this.snab.length; i++)
						$this.snab[i].nameTd.closest('tr').hide()
			})
			
			$('<label>').attr({'for':'psnab' + $this.index}).text('Скрыть').appendTo(panel);
		}
	}
	function snab(input,cena,cach,brend,table,roditel,max,svob,nameTd,forma,index){
		var $this = this;
		
		$this.addRas = function(col){
			var ap = $('<a>', {'href':'#', 'style':'margin-right:10px;', 'col':col}).text(' + ').click(function(){
				var c = parInt($this.input.val());
				$this.input.val(c + parInt($(this).attr('col')));
				$this.col = c + parInt($(this).attr('col'));
				$this.roditel.raschet();
				return false;
			});
			var a = $('<a>', {'href':'#', 'col':col}).text(col).click(function(){
				$this.input.val(parInt($(this).attr('col')));
				$this.col = parInt($(this).attr('col'));
				$this.roditel.raschet();
				return false;
			});
			$this.temp.html('').append(ap).append(a);
		}
		
		$this.input = input;
		$this.cena = parFloat(cena);
		$this.cach = parFloat(cach);
		$this.brend = parFloat(brend);
		$this.table = table;
		$this.roditel = roditel;
		$this.max = parInt(max + '');
		
		$this.svobTd = svob;
		$this.nameTd = nameTd;
		$this.index = index;
		$this.roditel.forma = forma;
		
		$this.ck = parFloat(($this.cena / $this.cach).toFixed(2));
		if(isNaN($this.ck) || $this.ck == 'Infinity'){
			$this.ck = '';
			if($this.roditel.type == 'sklad')
				$this.ck = 999999999;
		}
		
		$this.tr = $this.nameTd.closest('tr');
		
		if($this.roditel.type != 'продукты'){
			$this.col = parInt($this.input.val());
		
			var c = svob.html().split('<br>');
			if(c.length == 2){
				var c1 = c[0].split('из');
				var svob = c[0];
				var max = 0;
				if(c1[1]){
					svob = c1[1];
					max = c1[0];
				}
				$this.svob = parInt(svob);
			}else{
				if(svob.text().search('Не огр.') != -1){
					$this.svob = 999999999999999999999;
				}else{
					$this.svob = parInt(svob.text());
				}
			}
			
			if(table[0].localName == 'table')
				table.append('<tr><td nowrap="nowrap">ЦК</td><td align="right" nowrap="nowrap">' + $this.ck + '</td></tr>');
		
			if(table[0].localName == 'td' && $this.ck != 999999999)
				table.append('<span style="display:block;color:#f00;">' + $this.ck + '</span>');
		}else{
			$this.table.after('<td class="supply_data"><span class="idstr" id="td_s'+index+'" style="color:#f00;">'+$this.ck+'</span></td>');
		}
		
		if($this.max == 0 || $this.max > $this.svob)
			$this.max = $this.svob;
		
		if($this.roditel.type != 'продукты'){
			$this.input.keyup(function(){
				$this.col = parInt($this.input.val());
				$this.roditel.raschet();
			})
			
			$this.svobTd.closest('td').css({'cursor':'pointer'}).click(function(){
				$this.input.val($this.max);
				$this.col = parInt($this.input.val());
				$this.roditel.raschet();
			})
		}
		
		var bpl = $('<button>').text('+').click(function(){
			forma.addSnableft($this);
			return false;
		});
		
		var bpr = $('<button>').text('+').click(function(){
			forma.addSnabright($this);
			return false;
		});
		var panel = $('<div>').append(bpl).append(bpr);
		
		
		
		$this.nameTd.closest('tr').addClass('snab' + index);
		$this.temp = $('<div>', {'class':'temp'});
		
		if($this.roditel.type != 'продукты'){
			$this.nameTd.prepend(panel)
			$this.input.before($this.temp);
		}else{
			$this.ch = $('<input>', {'type':'checkbox','checked':'checked'});
			var td = $('<td>').append($this.ch).append($this.temp);
			
			$this.tr.append(td)
		}
		
	}
		
		
	function unit(){
			
		var product = [],
			j = 0,
			i = -1,
			pos = [],
			form;
		form = new Forms();
		
		$('body').prepend('<link href="/css/unit_2016.css?v=4" rel="stylesheet" type="text/css" />');
		
		var img = $('#unitImage img').attr('src');
		if(typeof img !== 'undefined'){
			
			if(img.search('img/v2/units/shop')!=-1){
				form.formSmes();
				$('.list tr').each(function(){
					var tr = $(this);
					var td = $('td', this);
					
					if(tr.hasClass('product_row')){
						
						if(j > 0){
							product[i].snab = pos;
						}
						
						i++;
						
						product[i] = new productSnab(
							$(td[5]).text(),
							$(td[7]).text(),
							$(td[9]).text(),
							$(td[11]).text(),
							$(td[13]).text(),
							$(td[14]),
							$(td[15]).text(),
							tr,
							i,
							'shop',
							td[0].closest('th')
						);
						
						var max = parseInt($('span', td[17]).text().replace('Max: ', '').replace(/ /g, ''));
						if(isNaN(max)) max = 0;
						j = 0;
						pos = [];
						pos[j] = new snab(
							$('input', td[17]),
							$(td[22]).text(),
							$(td[24]).text(),
							$(td[26]).text(),
							$('table', td[20]),
							product[i],
							max,
							$(td[33]),
							$(td[16]),
							form
						);
						j++;
					}
					
					
					
					if(tr.hasClass('sub_row')){
						var max = parseInt($('span', td[1]).text().replace('Max: ', '').replace(/ /g, ''));
						if(isNaN(max)) max = 0;
						
						pos[j] = new snab(
							$('input', td[1]),
							$(td[6]).text(),
							$(td[8]).text(),
							$(td[10]).text(),
							$('table', td[4]),
							product[i],
							max,
							$(td[17]),
							$(td[0]),
							form
						);
						j++;
					}
					
				})
				
				if(j > 0)
					product[i].snab = pos;
				
				for(i = 0; i < product.length; i++)
					product[i].raschet();
			}
			
			if(img.search('img/v2/units/warehouse')!=-1){
				
				form.formSmes();
				
				$('.list tr').each(function(){
					var tr = $(this);
					var td = $('td', this);
					
					if(tr.hasClass('p_title')){
						
						if(j > 0){
							product[i].snab = pos;
						}
						
						i++;
						var ck = $('strong', td[4]).text().split('/');
						
						product[i] = new productSnab(
							$('strong', td[2]).text(),
							ck[0],
							'0',
							ck[1],
							$('strong', td[6]).text(),
							tr,
							$('strong', td[8]).text(),
							tr,
							i,
							'sklad',
							td[0]
						);
						
						j = 0;
						pos = [];
					}
					
					if(tr.hasClass('odd') || tr.hasClass('even')){
						
						var c = $('span', td[8]).html().split('<br>');
						
						var c1 = c[0].split('из')
						
						var svob = c[0];
						var max = 0;
						
						if(c1[1]){
							svob = c1[1];
							max = c1[0];
						}
						
						pos[j] = new snab(
							$('input[type=text]', td[1]),
							$(td[3]).text(),
							$(td[5]).text(),
							'0',
							$(td[3]),
							product[i],
							max,
							$('span', td[8]),
							$(td[0]),
							form,
							j
						);
						j++;
					}
					
					if(tr.hasClass('product_row')){
						
						if(j > 0){
							product[i].snab = pos;
						}
						
						i++;
						
						product[i] = new productSnab(
							$(td[5]).text(),
							$(td[7]).text(),
							$(td[9]).text(),
							$(td[11]).text(),
							$(td[13]).text(),
							$(td[14]),
							$(td[15]).text(),
							tr,
							i
						);
						
						var max = parseInt($('span', td[17]).text().replace('Max: ', '').replace(/ /g, ''));
						if(isNaN(max)) max = 0;
						j = 0;
						pos = [];
						pos[j] = new snab(
							$('input', td[17]),
							$(td[22]).text(),
							$(td[24]).text(),
							$(td[26]).text(),
							$('table', td[20]),
							product[i],
							max,
							$(td[33]),
							$(td[16]),
							form
						);
						j++;
					}
					
					
					
					if(tr.hasClass('sub_row')){
						var max = parseInt($('span', td[1]).text().replace('Max: ', '').replace(/ /g, ''));
						if(isNaN(max)) max = 0;
						
						pos[j] = new snab(
							$('input', td[1]),
							$(td[6]).text(),
							$(td[8]).text(),
							$(td[10]).text(),
							$('table', td[4]),
							product[i],
							max,
							$(td[17]),
							$(td[0]),
							form
						);
						j++;
					}
					
				})
				
				if(i > 0 && j > 0)
					product[i].snab = pos;
				
				for(i = 0; i < product.length; i++){
					product[i].raschet();
					product[i].sort();
				}
			}
		
			if(img.search('img/v2/units/animalfarm')!=-1 || img.search('img/v2/units/workshop')!=-1 || img.search('img/v2/units/repair')!=-1){
				
				form.formSmes();
				
				$(".list th:contains('На складе')[rowspan=2]").after('<th rowspan="2">Заказ</th>');
				
				$('form .list tr').each(function(){
					
					var tr = $(this);
					var th = $('th', this);
					var td = $('td', this);
					var id = tr.attr('id');
					
					
					if(typeof id == 'string'){
						if(id.search('product_row')!=-1){
							
							console.log(i)
							
							if(j > 0){
								product[i].snab = pos;
							}
							
							i++;
							
							var zak = $('<td>', {'rowspan':$(td[3]).attr('rowspan')}).insertAfter($(td[10]));
							
							product[i] = new productSnab(
								$(td[12]).text(),
								$(td[14]).text(),
								'0',
								$(td[16]).text(),
								$(td[5]).text(),
								zak,
								$(td[9]).text(),
								tr,
								i,
								'animalfarm',
								td[0].closest('th')
							);
							
							var max = parseInt($('span', td[18]).text().replace('Max: ', '').replace(/ /g, ''));
							if(isNaN(max)) max = 0;
							j = 0;
							pos = [];
							
							pos[j] = new snab(
								$('input', td[18]),
								$(td[23]).text(),
								$(td[28]).text(),
								'0',
								$('table', td[20]),
								product[i],
								max,
								$(td[36]),
								$(td[17]),
								form
							);
							j++;
						}
						
						if(id.search('product_sub_row')!=-1){
						
							var max = parseInt($('span', td[1]).text().replace('Max: ', '').replace(/ /g, ''));
							if(isNaN(max)) max = 0;
							
							pos[j] = new snab(
								$('input', td[1]),
								$(td[6]).text(),
								$(td[11]).text(),
								'0',
								$('table', td[3]),
								product[i],
								max,
								$(td[19]),
								$(td[0]),
								form
							);
							j++;
						}
					}
					
				})
				
				if(j > 0)
					product[i].snab = pos;
				
				for(i = 0; i < product.length; i++)
					product[i].raschet();
			}
		
			if(img.search('img/v2/units/restaurant')!=-1){
				
				form.formSmes();
				
				$(".list th:contains('На складе')[rowspan=2]").after('<th rowspan="2">Заказ</th>');
				
				$('.list tr').each(function(){
					
					var tr = $(this);
					var th = $('th', this);
					var td = $('td', this);
					var id = tr.attr('id');
					
					
					if(typeof id == 'string'){
						if(id.search('product_row')!=-1){
							
							if(j > 0){
								product[i].snab = pos;
							}
							
							i++;
							
							var zak = $('<td>', {'rowspan':$(td[3]).attr('rowspan')}).insertAfter($(td[10]));
							
							
							product[i] = new productSnab(
								$(td[12]).text(),
								$(td[14]).text(),
								'0',
								$(td[16]).text(),
								'0',
								zak,
								$(td[9]).text(),
								tr,
								i,
								'restaurant',
								td[0].closest('th')
							);
							
							product[i].snab = [];
							
							var max = parseInt($('span', td[1]).text().replace('Max: ', '').replace(/ /g, ''));
							if(isNaN(max)) max = 0;
							j = 0;
							pos = [];
							
							if(td[18]){
								pos[j] = new snab(
									$('input', td[18]),
									$(td[23]).text(),
									$(td[28]).text(),
									'0',
									$('table', td[20]),
									product[i],
									max,
									$(td[36]),
									$(td[17]),
									form
								);
								j++;
							}
						}
						
						if(id.search('product_sub_row')!=-1){
						
							var max = parseInt($('span', td[1]).text().replace('Max: ', '').replace(/ /g, ''));
							if(isNaN(max)) max = 0;
							
							pos[j] = new snab(
								$('input', td[1]),
								$(td[6]).text(),
								$(td[11]).text(),
								'0',
								$('table', td[3]),
								product[i],
								max,
								$(td[19]),
								$(td[0]),
								form
							);
							j++;
						}
					}
					
				})
				
				if(j > 0)
					product[i].snab = pos;
				
				for(i = 0; i < product.length; i++)
					product[i].raschet();
			}
		
		}
		
		if($('#supply_header h1').text().search('Выбор поставщика')!=-1){
			$('#supply_content').css({'padding':'89px 0px 95px 0px'});
			
			var panel = $('<div>').prependTo($('#supply_header'));
			
			$('.supply_addition_info tr').each(function(){
				var tr = $(this);
				var th = $('th', this);
				
				var cach = $(th[0]).text().split('=');
				var col = $(th[2]).text().split('=');
				if(!isNaN(col[1]))
					col[1] = '0';
				
				product = new productSnab(
					col[1],
					cach[1],
					'0',
					'0',
					'0',
					'0',
					'0',
					tr,
					0,
					'продукты',
					panel
				);
			})
			
			$('#supply_content table tr').each(function() {
				var cels = $('th', this);
				$(cels[4]).after('<th><div class="field_title qpsort">Ценакачество<div class="asc" title="сортировка по возрастанию"><a href="#"><img src="/img/up_gr_sort.png"></a></div><div class="desc" title="сортировка по убыванию"><a href="#"><img src="/img/down_gr_sort.png"></a></div></div></th>');
				var th = $('<th>').insertAfter($(cels[6]));
				var ch = $('<input>', {'type':'checkbox','checked':'checked'}).appendTo(th).change(function(){
					product.checked($(this).prop('checked'));
				})
			})
			
			$(".qpsort .asc a").click(function(){
				product.sortqp('asc');
				return false;
			})
			$(".qpsort .desc a").click(function(){
				product.sortqp('desc');
				return false;
			})
			
			offer.forEach(function(x, index){
				
				var tr = $('#r'+index);
				var td = $('td', tr);
				
				var sv = parseInt($(td[3]).text().replace(/ /g, ''));
				
				var brend = parseInt($(td[7]).text());
				if(isNaN(brend)) brend = 0;
				if($(td[3]).text().search('Не огр.') != -1)
					sv = 99999999999999999999;
				
				pos[j] = new snab(
					0,
					x.price+'',
					x.quality+'',
					brend+'',
					$(td[6]),
					product,
					sv + '',
					$(td[3]),
					$(td[0]),
					form
				);
				j++;
				
			});
			
			if(j > 0)
				product.snab = pos;
			
			product.th = $('#supply_content table thead tr');
			
			$('#amountInput').click(function(){
				var $this = $(this);
				var temp = $('.temp', $this.closest('tr').prev());
				$this.val(temp.text());
			})
		}

		if($('.header h3').text().search('Поставщики оборудования')!=-1){
			
			$('#headerWithSeparator').css({'height':'8.5em'});
			$('body').css({'padding-top':'7.5em'});
			
			var f = 0;
			var panel = $('<div>').prependTo($('#headerWithSeparator'));
			var product = new productSnab(
				'0',
				'0',
				'0',
				'0',
				'0',
				'0',
				'0',
				$('<div>'),
				0,
				'продукты',
				panel
			);
			
			offer.forEach(function(x){
				var tr = $('#r'+x.unit);
				var td = $('td', tr);
				
				pos[j] = new snab(
					0,
					x.price+'',
					x.quality+'',
					'0',
					$(td[6]),
					product,
					x.free4buy+'',
					$(td[2]),
					$(td[0]),
					form
				);
				j++;
			})
			
			$('#mainTable tr').each(function() {
				var cels = $('th', this);
				if(f == 0)
					$(cels[2]).attr('colspan','5');
				$(cels[5]).after('<th><div class="field_title qpsort">Ценакачество<div class="asc" title="сортировка по возрастанию"><a href="#"><img src="/img/up_gr_sort.png"></a></div><div class="desc" title="сортировка по убыванию"><a href="#"><img src="/img/down_gr_sort.png"></a></div></div></th>');
				f++;
			})
			
			$(".qpsort .asc a").click(function(){
				product.sortqp('asc');
				return false;
			})
			$(".qpsort .desc a").click(function(){
				product.sortqp('desc');
				return false;
			})
			
			var n = 0;
			
			if(j > 0)
				product.snab = pos;
			
			product.th = $('#table_header');
			
			$('#amountInput').click(function(){
				var $this = $(this);
				var temp = $('.temp', $this.closest('tr').prev());
				$this.val(temp.text());
			})
		}
	}

	unit();
}	
script=document.createElement("script");
script.textContent="("+run.toString()+")();";
document.documentElement.appendChild(script);