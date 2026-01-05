// ==UserScript==
// @name			Advanced Battle All
// @namespace		using namespace std;
// @description		Генератор ходов(легальный), нумерация противников, расширенная информация в списке выбора противника, сортировка списка, ДЦ, продвинутое расположение бойцов на поле боя как в бою, так и в режиме наблюдения за боем, полный лог боя в НЕ JS-версии, кнопка "Сказать ход", быстрая вставка ника в поле чата. Информация вверху о набитом HP, вашем здоровье и т.д. При щелчке на картинке противника происходит его выбор в качестве цели. .
// @include			http://www.ganjawars.ru/b0/*
// @include			http://www.ganjawars.ru/warlog.php*
// @include			http://battles.ganjawars.ru/warlog.php*
// @include			http://www.ganjawars.ru/wargroup.php*
// @license			MIT
// @version			2.2 [20.09.14]
// @author			MyRequiem
// @downloadURL https://update.greasyfork.org/scripts/7936/Advanced%20Battle%20All.user.js
// @updateURL https://update.greasyfork.org/scripts/7936/Advanced%20Battle%20All.meta.js
// ==/UserScript==

(function() {

	//=============НАСТРОЙКИ====================
	var refreshAppl	= 0;	//обновление заявки после входа в нее (в секундах)
	var refreshBattle = 0;	//обновление страницы после того, как сделали ход (в секундах)

	//P.S.
	//если выставлено "0", то обновление будет происходить с таймаутом по умолчанию, т.е.
	//обновление страницы, когда висим в заявке - 20сек, обновление данных в бою принимает
	//значение исходя из персональных настроек персонажа [http://www.ganjawars.ru/info.edit.php].
	//
	//НЕ РЕКОМЕНДУЕТСЯ СТАВИТЬ ЗНАЧЕНИЯ МЕНЬШЕ 3 СЕК !!!
	//
	//=============КОНЕЦ НАСТРОЕК===============

//------------------------------------------------------------------------------
	function ajaxQuery(url, onsuccess) {
		var xmlHttpRequest = new XMLHttpRequest();
		xmlHttpRequest.open('GET', url, true);
		xmlHttpRequest.send(null);

		var timeout = setTimeout(function() {xmlHttpRequest.abort();}, 10000);

		xmlHttpRequest.onreadystatechange = function() {
			if (xmlHttpRequest.readyState != 4) return;

			clearTimeout(timeout);
			if (xmlHttpRequest.readyState == 4 && xmlHttpRequest.status == 200 && typeof onsuccess != 'undefined') {
				onsuccess(xmlHttpRequest);
			}
		};
	}
//------------------------------------------------------------------------------
	function getPos(obj) {
		var x = 0;
		var y = 0;
		while(obj) {
			x += obj.offsetLeft;
			y += obj.offsetTop;
			obj = obj.offsetParent;
		}
		return {x:x,y:y};
	}
//------------------------------------------------------------------------------
	function getPers(obj) {
		var mass = [];
		var i;
		//если это поки (<b>Seel [Superb]</b>)
		if (/<b>[^<\[]+\[[^<\[]+\]<\/b>/.test(obj.innerHTML)) {
			var b = obj.getElementsByTagName('b');
			for (i = 0; i < b.length; i++) {
				if (/[^<\[]+\[[^<\[]+\]/.test(b[i].innerHTML)) {
					mass[mass.length] = b[i];
				}
			}
		} else {
			var a = obj.getElementsByTagName('a');
			for (i = 0; i < a.length; i++) {
				if (/info\.php\?id=\d+/.test(a[i].href)) {
					mass[mass.length] = a[i];
				}
			}
		}

		return mass;
	}
//------------------------------------------------------------------------------
	function setMyinfo(count) {
		//если здоровье меньше максимального, то меняем цвет
		var color = myPers.hp[1] == myPers.hp[2] ? '#008000' : '#b84906';
		var str = '<span style="font-weight: bold; font-style: italic; color: #0000FF;">HP:</span> ' +
			'<span style="color: ' + color + ';">' + myPers.hp[1] + '</span>/<span style="color: #008000;' +
			'font-weight: bold;">' + myPers.hp[2] + '</span>' + '<span style="margin-left: 20px;">урон: ' +
			myPers.damage[1] + '(<span style="font-weight: bold; color: #FF0000;">' + myPers.damage[2] +
			'</span>)</span><span style="margin-left: 20px;">видимость: <span style="font-weight: bold;">' +
			myPers.visib + '</span></span><span style="margin-left: 20px; font-weight: bold;">' +
			'<span style="color: #FF0000;">' + leftPers.length +'</span> / <span style="color: #0000FF;">' +
			rightPers.length + '</span></span>';

		if (count) str += '<span style="margin-left: 20px;">Сделали ход: ' + count + '/' +
			(leftPers.length + rightPers.length) + '</span>';
		td_info.innerHTML = str;
	}
//------------------------------------------------------------------------------
	function getDataFighters(a) {
		var li = [];
		var aa = a.parentNode.getElementsByTagName('a');
		for (var j = 0; j < aa.length; j++) {
			if (/\/item\.php\?item_id=/.test(aa[j].href)) li[li.length] = aa[j].innerHTML;
		}

		var info = a.parentNode.textContent;
		var obj = {};
		//если пок, то будет не ссылка на перса, а <b> с именем пока
		obj.name = a.firstElementChild ? a.firstElementChild.innerHTML.replace(/&amp;/, '&') : a.innerHTML;
		obj.lvl = a.nextSibling.textContent;
		obj.hp = /HP: \d+\/\d+/.test(info) ? /HP: (\d+)\/(\d+)/.exec(info) : '';
		obj.dist = /расстояние: \d+/.test(info) ? /расстояние: (\d+)/.exec(info)[1] : '';
		obj.visib = /видимость: \d+%/.test(info) ? /видимость: (\d+%)/.exec(info)[1] : '';
		obj.power = /мощность: \d+/.test(info) ? /мощность: (\d+)/.exec(info)[1] : '';
		obj.weapon = '';
		obj.allWeapon = '';
		if (li.length) {
			obj.weapon = li[0];
			for (var i = 0; i < li.length; i++) {
				obj.allWeapon += '<li>' + li[i];
			}
		}

		allFighters[allFighters.length] = obj;

		//в бою
		if (!viewMode) {
			//если это мой перс, то запоминаем его
			if (new RegExp(myId).test(a.href)) {
				myPers = allFighters[allFighters.length - 1];
				myPers.damage = /урон: (\d+) \((\d+)\)/.exec(info);
			}
		}
	}
//------------------------------------------------------------------------------
	function setEnvelope(side) {
		var a = !side ? leftPers : rightPers;
		for (var i = 0; i < a.length; i++) {
			//если это пок, то будет не ссылка, а <b> с именем пока
			var pok = a[i].nodeName == 'B';
			var name = pok ? a[i].innerHTML : a[i].firstElementChild.innerHTML;
			getDataFighters(a[i]);
			//покам писать не будем :)
			if (pok) continue;
			var number = '';
			if (enemy) {
				number = viewMode ? '' :
					(enemy[name] ? (' <span style="font-weight: bold;">' + enemy[name] + '.</span> ') : '');
			}
			var env = ' <img src="' + img_envelope + '" style="width: 15px; cursor: pointer;"> ';
			var span = doc.createElement('span');
			span.innerHTML = !side ? number + env : env + number;
			var before = !side ? a[i].nextElementSibling : a[i];
			a[i].parentNode.insertBefore(span, before);

			span.getElementsByTagName('img')[0].addEventListener('click', function(nik) {
				return function() {
					inp_text.value += nik + ': ';
					inp_text.focus();
				};
			}(name), false);
		}
	}
//------------------------------------------------------------------------------
	function sortList(opt, _this) {
		//если уже нажата
		if (_this.getAttribute('style') == 'cursor: pointer; font-weight: bold;') return;
		var id = +_this.id;
		//выделяем жирным на что нажали, остальные обычным шрифтом
		for (var i = 0; i < 6; i++) {
			if (i == id) {
				doc.getElementById('' + i).setAttribute('style', 'cursor: pointer; font-weight: bold;');
				continue;
			}
			doc.getElementById('' + i).setAttribute('style', 'cursor: pointer;');
		}
		//записываем данные в хранилище
		var mass = st.getItem('adv_battle_' + myId).split('|');
		mass[0] = '' + id;
		st.setItem('adv_battle_' + myId, mass.join('|'));

		//сортируем список по возрастающей
		var rez_1, rez_2, buff;
		var select = opt[0].parentNode;
		var reg = /(\d+)\. \[(\d+)\][^\d]*(\d+)!? \((\d+)%\) \[(\d+) \/ (\d+)\]/;
		for (i = 0; i < opt.length - 1; i++) {
			for (var j = 0; j < opt.length - 1; j++) {
				rez_1 = reg.exec(opt[j].innerHTML);
				rez_2 = reg.exec(opt[j + 1].innerHTML);
				if (!rez_1 || !rez_2) continue;
				rez_1 = +rez_1[id + 1];
				rez_2 = +rez_2[id + 1];
				if (rez_1 > rez_2) {
					buff = select.removeChild(opt[j]);
					select.insertBefore(buff, opt[j + 1]);
				}
			}
		}
	}
//------------------------------------------------------------------------------
	function setSortListEnemy(opt) {
		var target = opt[0].parentNode.parentNode.parentNode.parentNode;
		if (doc.getElementById('walk')) {	//если есть флажок "Подойти ближе"
			target = target.previousElementSibling.firstElementChild;
			target.insertBefore(doc.createElement('br'), target.firstChild);
		} else {
			var tr = doc.createElement('tr');
			tr.innerHTML = '<td colspan="2" style="padding-bottom:5px;"><br></td>';
			target.parentNode.insertBefore(tr, target);
			target = tr.firstElementChild;
		}

		target.innerHTML += '<span style="font-size: 7pt; margin-left: 20px;">' +
			'<span id="0" style="cursor: pointer;">[номер]</span> ' +
			'<span id="1" style="cursor: pointer;">[лвл]</span> ' +
			'<span id="2" style="cursor: pointer;">[дальность]</span> ' +
			'<span id="3" style="cursor: pointer;">[видимость]</span> ' +
			'<span id="4" style="cursor: pointer;">[HP ост.]</span> ' +
			'<span id="5" style="cursor: pointer;">[HP всего]</span>' +
			'</span>';

		for (var i = 0; i < 6; i++) {
			doc.getElementById('' + i).addEventListener('click', function() {sortList(opt, this);}, false);
		}

		var id = st.getItem('adv_battle_' + myId).split('|')[0];
		doc.getElementById(id).click();
	}
//------------------------------------------------------------------------------
	function sayMove() {
		//форма отправки сообщения в чат
		var subm = inp_text.parentNode.lastElementChild.previousElementSibling;
		var str = '~';

		//куда отходим
		var def;
		if (doc.getElementById('defence1').checked) {
			def = '1';
		} else if (doc.getElementById('defence2').checked) {
			def = '2';
		} else if (doc.getElementById('defence3').checked){
			def = '3';
		} else {
			def = getRandom();
		}

		//подходим или нет
		var walk = doc.getElementById('walk');
		if (walk && walk.checked) {
			walk = '1';
		} else {
			walk = '0';
		}

		//номер и ник противника
		var num = '';
		var options = doc.getElementById('euids').getElementsByTagName('option');
		for (var i = 0; i < options.length; i++) {
			if (options[i].selected) {
				var txt = options[i].innerHTML;
				num = /^(\d+)\./.exec(txt)[1];
				break;
			}
		}

		//есть граната
		var grenade = doc.getElementById('bagaboom');
		if (grenade && grenade.checked) {
			str += grenade.nextElementSibling.innerHTML.replace(/: бросить/, '');
			inp_text.value = str + ' в ' + num;
			//запоминаем ход в хранилище (номер, право, лево, отход, грена, подхожу) 'num|0|0|def|1|walk';
			st.setItem('save_stroke_' + myId, num + '|0|0|' + def + '|1|' + walk);
			subm.click();
			return;
		}

		//нет гранаты
		var flag = false;   //направление выстрела не выбрано
		str += num;
		var locst = num + '|';
		//левая рука
		var elem = doc.getElementById('left_attack1');
		if (elem) {
			if (elem.checked) {
				flag = true; str += 'ле '; locst += '1|';
			} else if (doc.getElementById('left_attack2').checked) {
				flag = true; str += 'ц '; locst += '2|';
			} else if (doc.getElementById('left_attack3').checked){
				flag = true; str += 'пр '; locst += '3|';
			} else {
				locst += '0|';
			}
		} else {
			locst += '0|';
		}

		//правая рука
		elem = doc.getElementById('right_attack1');
		if (elem) {
			if (elem.checked) {
				flag = true; str += 'ле '; locst += '1|';
			} else if (doc.getElementById('right_attack2').checked) {
				flag = true; str += 'ц '; locst += '2|';
			} else if (doc.getElementById('right_attack3').checked){
				flag = true; str += 'пр '; locst += '3|';
			} else {
				locst += '0|';
			}
		} else {
			locst += '0|';
		}

		if (!flag) {
			alert('Ход не выбран');
			return;
		}

		locst += def + '|0|' + walk;
		inp_text.value = str;
		//запоминаем ход в хранилище (номер, право, лево, отход, грена, подхожу) 'num|?|?|def|0|walk';
		st.setItem('save_stroke_' + myId, locst);
		subm.click();
	}
//------------------------------------------------------------------------------
	function setHandlerSubmit() {
		var s = doc.createElement('script');
		doc.body.appendChild(s);
		s.innerHTML = "" +
			"function fight_mod() {" +
				"var elem;" +
				"var data = localStorage.getItem('adv_battle_' + " + myId + ").split('|');" +

				//левая рука
				"if (elem = document.getElementById('left_attack1')) {" +
					"if (elem.checked) {" +
						"data[3] = '1';" +
					"} else if (document.getElementById('left_attack2').checked) {" +
						"data[3] = '2';" +
					"} else if (document.getElementById('left_attack3').checked) {" +
						"data[3] = '3';" +
					"}" +
				"} else {" +
					"data[3] = '2';" +
				"}" +

				//правая рука
				"if (elem = document.getElementById('right_attack1')) {" +
					"if (elem.checked) {" +
						"data[4] = '1';" +
					"} else if (document.getElementById('right_attack2').checked) {" +
						"data[4] = '2';" +
					"} else if (document.getElementById('right_attack3').checked) {" +
						"data[4] = '3';" +
					"}" +
				"} else {" +
					"data[4] = '2';" +
				"}" +

				//куда отходим
				"if (document.getElementById('defence1').checked) {" +
					"data[5] = '1';" +
				"} else if (document.getElementById('defence2').checked) {" +
					"data[5] = '2';" +
				"} else if (document.getElementById('defence3').checked) {" +
					"data[5] = '3';" +
				"}" +

				//граната
				"if (elem = document.getElementById('bagaboom')) {" +
					"if (elem.checked) data[6] = '1'; else data[6] = '0';" +
				"}" +

				//подходим или нет
				"if (elem = document.getElementById('walk')) {" +
					"if (elem.checked) data[7] = '1'; else data[7] = '0';" +
				"}" +

				"localStorage.setItem('adv_battle_' + " + myId + ", data.join('|'));" +
				"fight();" +
			"}";
	}
//------------------------------------------------------------------------------
	function getRandom () {return  (Math.round((Math.random() * 1000)) % 3) + 1;} //случайное число от 1 до 3
//------------------------------------------------------------------------------
	function clearStroke() {
		checkDivR.style.display = 'none';
		checkDivL.style.display = 'none';
		checkDivD.style.display = 'none';
		checkDivGr.style.display = 'none';
		checkDivW.style.display = 'none';
	}
//------------------------------------------------------------------------------
	function set_stroke(type) {
		clearStroke();
		var elem, data;

		//если есть запись в хранилище (сказали ход), то устанавливаем именно его
		if (data = st.getItem('save_stroke_' + myId)) {
			data = data.split('|');
			//враг в списке выбора
			var reg = new RegExp('^' + data[0] + '\\.');
			var options = doc.getElementById('euids').getElementsByTagName('option');
			for (var i = 0; i < options.length; i++) {
				if (reg.test(options[i].innerHTML)) {
					options[i].selected = true;
					break;
				}
			}
			//если грена
			if (data[4] == '1') {
				setCheck(checkDivGr, doc.getElementById('bagaboom'));
			} else {
				//левая рука
				if (data[1] != '0') setCheck(checkDivL, doc.getElementById('left_attack' + data[1]));
				//правая рука
				if (data[2] != '0') setCheck(checkDivR, doc.getElementById('right_attack' + data[2]));
			}

			//куда отходим
			setCheck(checkDivD, doc.getElementById('defence' + data[3]));
			//подходим или нет
			if (data[5] == '1') setCheck(checkDivW, doc.getElementById('walk'));

			st.removeItem('save_stroke_' + myId);
			return;
		}

		//устанавливаем последний сохраненный ход
		if (type == 2) {
			data = st.getItem('adv_battle_' + myId).split('|');
			elem = doc.getElementById('left_attack' + data[3]);
			if (elem) setCheck(checkDivL, elem);
			elem = doc.getElementById('right_attack' + data[4]);
			if (elem && (data[6] =='0' || !doc.getElementById('bagaboom'))) setCheck(checkDivR, elem);
			setCheck(checkDivD, doc.getElementById('defence' + data[5]));
			elem = doc.getElementById('bagaboom');
			if (elem && data[6] =='1') setCheck(checkDivGr, elem);
			elem = doc.getElementById('walk');
			if (elem && data[7] =='1') setCheck(checkDivW, elem);
		} else {    //случайный ход
			var two_hand;   //двурукий или нет
			var repeat = doc.getElementById('repeat_two_hand');
			if (/display:\s?;/.test(repeat.parentNode.getAttribute('style'))) two_hand = true;

			var x = getRandom();
			var y = getRandom();
			var z = getRandom();

			//куда уходим
			setCheck(checkDivD, doc.getElementById('defence' + z));

			if (two_hand) {
				//если дублирование запрещено (галочка стоит)
				if (repeat.checked && x == y) {
					while (x == y) {
						x = getRandom();
						y = getRandom();
					}
				}
				setCheck(checkDivL, doc.getElementById('left_attack' + x));
				setCheck(checkDivR, doc.getElementById('right_attack' + y));
			} else {
				elem = doc.getElementById('left_attack1');
				if (elem) {
					setCheck(checkDivL, doc.getElementById('left_attack' + x));
				} else {
					setCheck(checkDivR, doc.getElementById('right_attack' + y));
				}
			}
		}
	}
//------------------------------------------------------------------------------
	function setCheck(div, elem) {
		root.setTimeout(function() {
			var coord = getPos(elem);
			div.style.top = coord.y + 4;
			div.style.left = coord.x - 10;
			div.style.display = '';
		}, 300);
	}
//------------------------------------------------------------------------------
	function getGoButton() {
		var go;
		if (nojs) {
			for (var i = 0; i < a.length; i++) {
				if (/javascript:void\(fight(_mod)?\(\)\)/.test(a[i].href)) {
					go = a[i];
					break;
				}
			}
		} else {
			go = doc.getElementById('movego').parentNode;
		}

		return go;
	}
//------------------------------------------------------------------------------
	function setGenerator() {
		//находим координаты центрального DIV'а, и лепим туда DIV с генератором
		var coord = getPos(bf);
		var div = doc.createElement('div');
		div.setAttribute('style', 'position: absolute; top: ' + (coord.y + 10) + 'px; left: ' + coord.x + 'px;');
		//если две руки, то "не дублировать цель" делаем видимым, иначе скрываем
		var vis = (doc.getElementById('left_attack1') && doc.getElementById('right_attack1')) ? '' : 'none';
		div.innerHTML = '<input type="checkbox" id="rand_stroke"> <span id="set_rand_stroke" ' +
			'style="text-decoration: underline; cursor: pointer; vertical-align: top;">случайный ход</span><br>' +
			'<input type="checkbox" id="save_stroke">  <label for="save_stroke" style="vertical-align: top;">запомнить ход</label><br>' +
			'<span id="span_two_hand" style="display: ' + vis + ';"><input type="checkbox" id="repeat_two_hand"> ' +
			'<label for="repeat_two_hand" style="vertical-align: top;">не дублировать цель</label></span>';
		bf.appendChild(div);

		//чекбоксы
		var chk1 = doc.getElementById('rand_stroke');
		var chk2 = doc.getElementById('save_stroke');
		var chk3 = doc.getElementById('repeat_two_hand');
		var link_rand = doc.getElementById('set_rand_stroke');

		chk1.addEventListener('click', function() {
			var data = st.getItem('adv_battle_' + myId).split('|');
			if (this.checked) {
				chk2.checked = false;
				getGoButton().setAttribute('href', 'javascript:void(fight())');
				data[1] = '1';
				st.setItem('adv_battle_' + myId, data.join('|'));
				set_stroke(1);
			} else {
				data[1] = '0';
				st.setItem('adv_battle_' + myId, data.join('|'));
				clearStroke();
			}

		}, false);

		chk2.addEventListener('click', function() {
			var data = st.getItem('adv_battle_' + myId).split('|');
			var go = getGoButton();

			if (this.checked) {
				chk1.checked = false;
				go.setAttribute('href', 'javascript:void(fight_mod())');
				data[1] = '2';
				st.setItem('adv_battle_' + myId, data.join('|'));
				set_stroke(2);
			} else {
				go.setAttribute('href', 'javascript:void(fight())');
				data[1] = '0';
				st.setItem('adv_battle_' + myId, data.join('|'));
				clearStroke();
			}
		}, false);

		chk3.addEventListener('click', function() {
			var data = st.getItem('adv_battle_' + myId).split('|');
			data[2] = this.checked ? '1' : '0';
			st.setItem('adv_battle_' + myId, data.join('|'));
		}, false);

		link_rand.addEventListener('click', function() {
			set_stroke(1);
		}, false);

		//установим свой обработчик нажатия кнопки "Сделать ход" fight_mod();
		//(если флажок "запомнить ход" установлен, то будет запоминаться последний ход)
		setHandlerSubmit();

		var data = st.getItem('adv_battle_' + myId).split('|');
		if (data[2] == '1') chk3.click();

		if (data[1] == '1') {
			chk1.click();
		} else if (data[1] == '2') {
			chk2.click();
		} else if (st.getItem('save_stroke_' + myId)) {
			//если сказали ход, то будет запись в хранилище
			set_stroke(1);
		}

	}
//------------------------------------------------------------------------------
	function changeLocationFighters() {
		//таблица с расположением бойцов
		var table;

		if (!viewMode) {
			//если ход сделан, то вставляем сохраненную таблицу в документ в JS-версии
			if (/Ждём ход противника/i.test(bf.innerHTML)) {
				if (graphTable && !nojs) {
					var target = bf.getElementsByTagName('a')[0];
					target.parentNode.appendChild(doc.createElement('br'));
					target.parentNode.appendChild(doc.createElement('br'));
					target.parentNode.appendChild(graphTable);
					target.parentNode.appendChild(doc.createElement('br'));
					setTooltipsFighters(graphTable);
					return;
				} else if (nojs) {
					table = bf.previousElementSibling.previousElementSibling;
				}
			} else {	//ход не сделан
				if (nojs) {
					table = bf.getElementsByTagName('table')[0].nextElementSibling.nextElementSibling;
				} else {
					table = bf.getElementsByTagName('table');
					table = table[table.length - 1];
				}
			}
		} else {
			table = divs[0].nextElementSibling.lastElementChild.previousElementSibling;
		}

		table.setAttribute('style', 'border-collapse: collapse;');
		table.setAttribute('background', img_battleField );

		//вставим пустую строку после таблицы
		var br = doc.createElement('br');
		if (!viewMode) table.parentNode.appendChild(br);
		else table.parentNode.insertBefore(br, table.nextElementSibling);

		var leftDC = -1;    //индексы ячеек первого левого и первого правого персонажа от центра (для ДЦ)
		var rightDC = -1;
		var myInd;          //отрицательный индекс ячейки, где стоит мой перс
		var td = table.getElementsByTagName('td');

		for (var i = 0; i < td.length; i++) {
			td[i].setAttribute('style', 'border: 1px dotted #FFFFFF; vertical-align: center;');
			//если в "TD" нет картинки перса
			if (!td[i].getElementsByTagName('img')[0].getAttribute('title')) continue;

			var clone_td = td[i].cloneNode(true);
			td[i].innerHTML = '';
			var img = clone_td.getElementsByTagName('img');

			//узнаем есть ли в ячейке бойцы из разных команд
			var diffCommand = false;
			var reg = /\/(left|right)_.*\.gif/;
			for (var j = 0; j < img.length - 1; j++) {
				//берем из атрибута srs 'left' или 'right'
				if (reg.exec(img[j].src)[1] != reg.exec(img[j + 1].src)[1]) {
					diffCommand = true;
					break;
				}
			}

			var flag = false;
			for (j = 0; j < img.length; j++) {
				//ячейка где находится мой перс
				if (!viewMode && ~img[j].getAttribute('title').indexOf(myPers.name)) myInd = -1 * i;

				//крайний левый и крайний правый персонаж от центра (для ДЦ)
				if (reg.exec(img[j].src)[1] == 'left') {
					leftDC = i;
				} else if (rightDC == -1) {
					rightDC = i;
				}

				var div = doc.createElement('div');
				div.setAttribute('style', 'padding: 2px;');

				if (!diffCommand) {
					td[i].appendChild(div);
					td[i].lastElementChild.appendChild(img[j].cloneNode(true));
				} else {
					if (!flag) {
						var divL = doc.createElement('div');
						divL.setAttribute('style', 'display: inline-block;');
						td[i].appendChild(divL);
						var divR = doc.createElement('div');
						divR.setAttribute('style', 'display: inline-block;');
						td[i].appendChild(divR);
						flag = true;
					}

					div.appendChild(img[j].cloneNode(true));
					if (reg.exec(img[j].src)[1] == 'left') {
						td[i].firstElementChild.appendChild(div);
					} else {
						td[i].lastElementChild.appendChild(div);
					}
				}
			}
		}

		var even;
		var DC = Math.abs(leftDC - rightDC);
		DC = (even = isEven(DC)) ? (leftDC + DC / 2) : (leftDC + Math.floor(DC / 2));

		//если нет изображения моего перса на поле боя (бывает такой глюк)
		//будем отсчитывать от динамического центра
		if (isNaN(myInd)) myInd = -1 * DC;

		//расставляем дальность и ДЦ
		var tr_numbers = doc.createElement('tr');
		table.firstElementChild.insertBefore(tr_numbers, table.firstElementChild.firstElementChild);
		var count = td.length;

		for (i = 0; i < count; i++) {
			var td_num = doc.createElement('td');
			tr_numbers.appendChild(td_num);

			td_num.innerHTML = Math.abs(myInd);
			//если индекс нулевой (там где я стою) то цвет синий
			if (myInd) {
				td_num.setAttribute('style', 'text-align: center; font-size: 7pt; border: 1px dotted #FFFFFF;');
			} else {
				td_num.setAttribute('style', 'text-align: center; font-size: 8pt; color :#0000FF; ' +
					'font-weight: bold; border: 1px dotted #FFFFFF;');
			}
			myInd++;

			if (i != DC) continue;
			td_num.setAttribute('style', 'text-align: center; font-size: 8pt; color: #FF0000; font-weight: bold; ' +
				'border: 1px dotted #FFFFFF;');
			if (!even) {
				DC++;
				even = true;
			}
		}


		if (!viewMode && !nojs) graphTable = table.cloneNode(true);
		setTooltipsFighters(table);
	}
//------------------------------------------------------------------------------
	function changeSelect(select, target) {
		for (var l = 0; l < select.options.length; l++) {
			if (select.options[l].selected && /!/.test(select.options[l].innerHTML)) {
				target.setAttribute('style', 'color: #FF0000;');
				break;
			} else if (select.options[l].selected) {
				target.removeAttribute('style');
				break;
			}
		}
	}
//------------------------------------------------------------------------------
	function setTooltipsFighters(table) {
		var div_ttip = doc.getElementById('div_tooltip');
		//список выбора цели
		var select = doc.getElementById('euids');
		var options = select ? select.getElementsByTagName('option') : '';

		//помещаем "Противник:" (слева от селекта) в span.... если не достаем до выбранного
		//противника, то эта надпись будет красной
		if (select) {
			select.parentNode.removeChild(select.previousSibling);
			var spanCheckRange = doc.createElement('span');
			spanCheckRange.innerHTML = 'Противник: ';
			select.parentNode.insertBefore(spanCheckRange, select);

			select.addEventListener('change', function() {changeSelect(this, spanCheckRange);}, false);
			changeSelect(select, spanCheckRange);
		}


		//картинки бойцов
		var img_fighters = [];
		var img = table.getElementsByTagName('img');
		for (var i = 0; i < img.length; i++) {
			if (img[i].getAttribute('title')) img_fighters[img_fighters.length] = img[i];
		}

		for (i = 0; i < img_fighters.length; i++) {
			var ttl = img_fighters[i].getAttribute('title');
			var ttl_name = /(.*) \[\d+/.exec(ttl);

			//если есть список выбора врага (ход не сделан)
			if (ttl_name && options) {
				var opt = false;
				ttl_name = ttl_name[1].replace(/&amp;/, '&');
				for (var k = 0; k < options.length; k++) {
					var textOptions = options[k].innerHTML.replace(/&amp;/, '&');
					if (~textOptions.indexOf(ttl_name)) {
						opt = options[k];
						break;
					}
				}

				//кликаем по картинке, выбираем цель
				if (opt) {
					img_fighters[i].setAttribute('style', 'cursor: pointer;');
					img_fighters[i].addEventListener('click', function(opt) {
						return function() {
							opt.selected = true;
							changeSelect(select, spanCheckRange);
						};
					}(opt), false);
				}
			}

			for (var j = 0; j < allFighters.length; j++) {
				var pers = allFighters[j];
				if (~ttl.indexOf(pers.name)) {
					var num = viewMode ? '' : enemy[pers.name] ? (enemy[pers.name] + '. ') : '';
					ttl = '<span style="font-weight: bold;">' + num  + '<span style="color: #0000FF;">' + pers.lvl +
						'</span>' + pers.name + ' [' + pers.hp[1] + '/' + pers.hp[2] +
						']</span><div style="color: #b85006; margin-left: 15px;">Видимость: ' + pers.visib +
						'<br><span style="color: #000000;">Мощность: ' + pers.power + '</span></div><div>' +
						pers.allWeapon + '</div>';
					//прозрачность перса в зависимости от его видимости
					var visib = +/\d+/.exec(pers.visib)[0];
					var opacity = (visib / 100).toFixed(1);
					if (opacity < 0.3) opacity = 0.3;
					var temp = img_fighters[i].getAttribute('style');
					temp = temp ? temp : '';
					img_fighters[i].setAttribute('style', temp + ' opacity: ' + opacity + ';');
					break;
				}
			}

			//показываем тултип
			img_fighters[i].addEventListener('mouseover', function(ttl) {
				return function() {
					//относительно чего будем выравнивать тултип
					var obj = viewMode ? {x: divs[0].nextElementSibling.lastElementChild, y: 14} :
						(nojs && /Ждём ход противника/.test(bf.innerHTML) ? {x: bf, y: 0} : {x: inp_text, y: 20});
					div_ttip.innerHTML = ttl;
					div_ttip.style.top = getPos(obj.x).y - obj.y;
					div_ttip.style.left = getPos(this).x - 50;
					div_ttip.style.display = '';
				}
			}(ttl), false);

			//скрываем тултип
			img_fighters[i].addEventListener('mouseout', function() {div_ttip.style.display = 'none';}, false);
			//удаляем title
			img_fighters[i].removeAttribute('title');
		}
	}
//------------------------------------------------------------------------------
	function getLeftRightDivs() {
		if (divs && divs.length == 2) return;
		if (nojs || viewMode) {
			var td = doc.getElementsByTagName('td');
			if (nojs) {
				for (i = 0; i < td.length; i++) {
					var temp = td[i].firstElementChild;
					if (td[i].getAttribute('valign') == 'top' && temp &&
						(temp.nodeName == 'DIV' || temp.nodeName == 'TABLE')) {
						divs[divs.length] = td[i];
						break;
					}
				}

				if (divs.length) divs[divs.length] = td[i].parentNode.lastElementChild;
			} else {
				for (i = 0; i < td.length; i++) {
					if (td[i].getAttribute('valign') == 'top' && td[i].getAttribute('width') == '15%') {
						divs[divs.length] = td[i];
					}
				}
			}
		} else {
			//ищем DIV'ы с бойцами явно, т.к. они меняются местами по ID
			var div = doc.getElementsByTagName('div');
			for (i = 0; i < div.length; i++) {
				if (/listleft|listright/.test(div[i].id)) divs[divs.length] = div[i];
			}
		}
	}
//------------------------------------------------------------------------------
	function setCountStroke(l, r, mode) {
		//считаем количество персонажей, сделавших ход и выводим вверху страницы боя
		//в JS-версии боя подкрашиваем тех, кто сделал ход

		var count = 0;	//количество персонажей, которые сделали ход
		for (i = 0; i < l.length; i++) {
			if (/color:#008800;/.test(l[i].getAttribute('style'))) {
				count++;
				if (mode) leftPers[i].style.color = '#008800';
			}
		}

		for (i = 0; i < r.length; i++) {
			if (/color:#008800;/.test(r[i].getAttribute('style'))) {
				count++;
				if (mode) rightPers[i].style.color = '#008800';
			}
		}

		if (count) setMyinfo(count);
	}
//------------------------------------------------------------------------------
	function setColorFighters() {
		if (!/Ждём ход противника/i.test(bf.innerHTML)) return;

		if (nojs) {
			setCountStroke(leftPers, rightPers);
			return;
		}

		ajaxQuery(root.location.href.replace('btl.php', 'b.php'), function(xhr) {
			var span = doc.createElement('span');
			span.innerHTML = xhr.responseText;

			//ссылки на персонажей с левой и правой стороны списка команд
			var l, r;
			var td = span.getElementsByTagName('td');
			for (i = 0; i < td.length; i++) {
				if (td[i].getAttribute('valign') == 'top' && td[i].firstElementChild &&
					td[i].firstElementChild.nodeName == 'DIV') {
					l = getPers(td[i]);
					r = getPers(td[i].parentNode.lastElementChild);
					break;
				}
			}

			if (!l || !r) return;
			setCountStroke(l, r, 1);
		});
	}
//------------------------------------------------------------------------------
	function start() {
		//сразу скрываем тултип (на всякий случай, если остался)
		doc.getElementById('div_tooltip').style.display = 'none';
		divs = [];
		var i;

		if (!viewMode) {
			//очищаем индикаторы ходов
			clearStroke();

			var opt;
			var select = doc.getElementById('euids');
			//если есть список выбора врагов (ход не сделан)
			if (select) {
				enemy = {};	//обнуляем хэш из списка врагов выпадающего списка (имя --> номер)
				opt = select.getElementsByTagName('option');
				for (i = 0; i < opt.length; i++) {
					var temp = /^(\d+)\. (.+)\[\d+\]/.exec(opt[i].innerHTML);
					if (temp) enemy[temp[2]] = temp[1];
				}

				if (nojs) st.setItem('enemy_' + myId, JSON.stringify(enemy));
			} else if (nojs) {	//nojs mode, ход сделан
				var enem = st.getItem('enemy_' + myId);
				if (enem) enemy = JSON.parse(enem);
				else return;
			} else if (!enemy) {
				return;
			}

			getLeftRightDivs();
		} else {	//в режиме наблюдения за боем
			getLeftRightDivs();
		}

		if (nojs) bf = divs[0].nextElementSibling.lastElementChild;

		//ссылки на персов слева и справа
		leftPers = getPers(divs[0]);
		rightPers = getPers(divs[1]);

		//если в режиме наблюдения бой уже закончился (с левой стороны никого нет)
		if (!leftPers.length) return;

		//расстановка конвертиков, номера бойца и сбор дополнительной информации
		//(если они еще не были установлены)
		if (leftPers[0].nextElementSibling.nodeName != 'SPAN') {
			allFighters.length = 0;
			setEnvelope();	//левая сторона
			setEnvelope(1);	//правая сторона
		}

		if (!viewMode) {
			//в бою установим свои данные вверху
			setMyinfo();

			//расширяем данные в списке выбора
			if (select && opt) {
				var flag_adv = false;
				for (i = 0; i < opt.length; i++) {
					//если до цели не достаем, ставим '!' после дальности
					var flag = /#ffe0e0/.test(opt[i].getAttribute('style')) ? '!' : '';
					for (var j = 0; j < allFighters.length; j++) {
						var fighter = allFighters[j];
						if (~opt[i].innerHTML.indexOf(fighter.name)) {
							opt[i].innerHTML = enemy[fighter.name] + '. ' + fighter.lvl +  ' - ' +
							fighter.dist + flag + ' (' + fighter.visib + ') [' + fighter.hp[1] + ' / ' +
							fighter.hp[2] +  '] ' + fighter.name + ': ' + fighter.weapon + ' &nbsp;';
							if (!flag_adv) flag_adv = true;
							break;
						}
					}
				}

				//сортируем список выбора, если противников больше 2 и список выбора расширен
				if (opt.length > 2 && flag_adv) setSortListEnemy(opt);
				setGenerator();						//установка генератора ходов
				say_move.style.display = '';		//показываем кнопку "Сказать ход"
			} else {    //уже сходили
				say_move.style.display = 'none';	//прячем кнопку "Сказать ход"
				//обновляем данные в бою
				if (refreshBattle && !tm1) {
					tm1 = root.setInterval(refreshBttl, refreshBattle * 1000);
				}
			}
		}

		//изменяем расположение бойцов, ставим тултипы и т.д.
		changeLocationFighters();

		//в JS-версии боя подсвечиваем персонажей, которые уже сделали ход
		//в обоих весиях боя устанавливаем вверху количество персонажей, сделавших ход
		if (!viewMode && !tm) {
			setColorFighters();
			tm = root.setInterval(setColorFighters, 3000);
		}
	}
//------------------------------------------------------------------------------
	function refreshBttl() {
		var linkRefresh = doc.getElementsByTagName('a');
		for (var i = 0; i < linkRefresh.length; i++) {
			if (/обновить/i.test(linkRefresh[i].innerHTML)) {
				linkRefresh[i].click();
				break;
			}
		}
	}
//------------------------------------------------------------------------------
	function isEven(x) {
		if (x % 2 == 0) return 1;
		return false;
	}
//------------------------------------------------------------------------------
	function createCheckDiv() {
		var div = doc.createElement('div');
		div.setAttribute('style', 'display: none; position: absolute; border-radius: 5px; background: #0000FF; width: 7px; height: 7px; top: 0; left: 0;');
		doc.body.appendChild(div);
		return div;
	}
//------------------------------------------------------------------------------
	function setInterfaceChat() {
		//устанавливаем checkbox - "написать для своих" и кнопку "Сказать ход"
		var chk = doc.createElement('input');
		chk.setAttribute('type', 'checkbox');
		chk.setAttribute('style', 'margin-right: 10px;');
		chk.setAttribute('title', 'Сказать только своей команде');
		inp_text.parentNode.insertBefore(chk, inp_text);

		//если отмечен чекбокс, символ '~' стереть будет нельзя
		inp_text.addEventListener('input', function() {
			if (chk.checked && !this.value) this.value = '~';
		}, false);

		//клик по чекбоксу
		chk.addEventListener('click', function() {
			var data = st.getItem('adv_battle_' + myId).split('|');
			if (this.checked) {
				data[8] = '1';
				inp_text.value = '~' + inp_text.value;
			} else {
				data[8] = '0';
				inp_text.value = inp_text.value.replace(/~|\*/, '')
			}

			st.setItem('adv_battle_' + myId, data.join('|'));
			inp_text.focus();
		}, false);

		var data = +st.getItem('adv_battle_' + myId).split('|')[8];
		if (data) chk.click();

		//костыль после отправки сообщения в чат
		root.setInterval(function() {
			if (chk.checked && !inp_text.value) inp_text.value = '~';
		}, 1000);

		say_move.type = 'button';
		say_move.value = 'Сказать ход';
		say_move.setAttribute('style', 'display: none; background-color: #D0EED0; margin-right: 10px;');
		say_move.addEventListener('click', sayMove, false);
		chk.parentNode.insertBefore(say_move, chk);

		//добавляем кнопку "Обновить"
		var but_update = doc.createElement('input');
		but_update.type = 'button';
		but_update.value = 'Обновить';
		but_update.setAttribute('style', 'background-color: #D0EED0;');
		if (!nojs) but_update.setAttribute('onclick', 'javascript:void(updatedata())');
		else but_update.addEventListener('click', function() {root.location.reload();}, false);
		inp_text = inp_text || doc.getElementsByName('oldm')[0];
		inp_text.parentNode.appendChild(but_update);
	}
//------------------------------------------------------------------------------
	function changeMakebf() {	//добавляет в функцию на странице дополнительный код
		root.makebf = function() {
			doc.getElementById("bf").innerHTML = root.waitforturn ? (root.bf2 + root.bf3) : root.bf1;
			doc.getElementById("bfndl").innerHTML = root.bfndl;
			start();
		};
	}
//------------------------------------------------------------------------------
	function try_start() {
		if (viewMode || nojs) {
			if (nojs) setInterfaceChat();
			start();
			return;
		}

		//строка ввода чата
		inp_text = doc.getElementsByName('oldm');
		inp_text = inp_text[0] ? inp_text[0] : false;
		//основное поле боя
		bf = doc.getElementById('bf');

		if (inp_text && bf && !/Загружаются данные/.test(bf.innerHTML)) {
			changeMakebf();
			setInterfaceChat();
			start();
		} else {
			//в JS версии боя ждем загрузки фрейма с данными
			root.setTimeout(try_start, 100);
		}
	}
//------------------------------------------------------------------------------
	var root = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;
	var doc = root.document;
	var st = root.localStorage;
	var loc = root.location.href;

	if (!st) {
		alert('Ваш браузер не поддерживает технологию localStorage.\n'+
			'MyRequiem рекомендует вам скачать и установить один из\n'+
			'ниже перечисленных браузеров или удалите скрипт\n'+
			'Advanced Battlee:\n\nFireFox 4+\nOpera 11+\nChrome 12+');
		return;
	}

	var a = doc.getElementsByTagName('a');

	//обновление страницы, когда висим в заявке
	if (/\/wargroup\.php/.test(loc) && /Вы заявлены на бой/i.test(doc.body.innerHTML) && refreshAppl) {
		root.setTimeout(function() {
			for (var i = 0; i < a.length; i++) {
				if (/Обновить/i.test(a[i].innerHTML)) {
					a[i].click();
					break;
				}
			}
		}, refreshAppl * 1000);

		return;
	}

	//бой или страница наблюдения за боем
	var viewMode = /\/warlog\.php/.test(loc);
	var nojs = /\/b0\/b\.php/.test(loc);
	var myId = /(^|;) ?uid=([^;]*)(;|$)/.exec(doc.cookie)[2];

	//конвертики для вставки ника в чат (рядом с каждым бойцом на поле боя)
	var img_envelope = "data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%10%00%00%00%0D%08%06%00%00%00%A0%BB%EE%24%00%00%00%04gAMA%00%00%AF%C87%05%8A%E9%00%00%00%1AtEXtSoftware%00Paint.NET%20v3.5.100%F4r%A1%00%00%02IIDAT8O%A5%92%DBK%14q%14%C7%A7%BF%A7'%DFz%F0A%8C.V%C2F%10%81%08Q%D1k%3E%84%12V%84%9A%96%97%8D%1E%D2%88%8A(%A1r%23L%BB%10%A9%9B%BB%EE%BA%AB%2B-%99%AE%BA%17%2F%B3%BA%3A%CE%AE%BB%EEef%F67%BF%DF%B73%A3%05%3E%3B%F0%813%BF%1F%E7s%E6%9C3G%00H%87z%2C%C1a%90n%3F%0B%B8%DB%FA%E7%B2%0D%7Dav%EDQ%88_q%86%F8e%E74%AF%EF%9E%E2u%5DA~%A93%C0%2F%3E%98%E4%17%DA%FD%DC%D1%E6%E3%B5-%13fm%EB%B8v%FA%D6%90%7C%F4%BC%D3-%3DvEbz%99%8B%5C%D1%84a%E2%00ez%FF%07%A3%98q%C0%24%F2%25%06eG%E7%C7%9B%5CQ%A9%F9%C5%AC%D8%A5%83%DE%CF2b%9B%062E%81%A5-%8E%98%C2%91P9V%D3%1C%C9%1D%81TN%A0T%06V%14%03%F7%07%D6%B0%98%CC%C1%D1%1D%10RCo%18%06%A9%3F%CD%E4%D0%FBEFb%CB%40N%13%07%12%95%BC%80F%C9%B2j%A0%F3%E3%1A%9E%8Cd%A1%16tK%00%E9%BA3d%0Bf%D79%86B%7B%12%ABJ%D1%00%AC%C4tA%D0%3D%B0%9E6%D03(%E3%E5x%16%DF%22%26%D2%F9%7DA%5D%7B%D0%16D69%FElp%B8%FCi%3C%1C%88%D9%D5%ACDk%06%1B%19%03%1D%EFbx%EEN%E3g%D4%B4%F9%2Fp%DC%F1%D9%82%05%EA%3B%BCj%60xj%1Bo%7D*%9E~%95%11OiHlj%E8%A3%B8%DF%AB%E2%BDO%81gI%87%7Fy_%D0C-%9Cl%F4%40'%C1o%D9%C0%F7_*It%CC%A78F%E7%0Ax%E5%DE%C2kbt%B6%60%7F%5D0%A1a%90%0ALDu%A8%BBV%0BAH%957%C6D%91%F67%12V1%9F4%B0%AC%0A%2Co%0B%24%88(%11%23%E2%0A%C5%B4%95%05jsfE%C7%F0%B4%02y%3B%0FG%D7%A4%90*%EA%DF%242y%9D'%D5%A2%C8%16%19m%80!O%14tF%834mJ%84fA%03%B1Ps%1A%0F-*Zu%A3%2B.Y%7FS%C5%D5%C1%9Dc%0D%3F%CA%95Mc%AC%AAy%9CU%DF%F5%B0%13%F7%3C%ECT%8B%97%D5%B4%7B%D9%19%E2l%C7%1E%E7%3A%BC%E5%9A%D6%D1B%D5%CD%0F%ABV%EE_j%1E%82%D6%A9%EAt%B9%00%00%00%00IEND%AEB%60%82";
	//фон графического расположения бойцов
	var img_battleField = "data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%13%00%00%00%17%08%02%00%00%00f%A3%E3%8D%00%00%00%01sRGB%00%AE%CE%1C%E9%00%00%00%04gAMA%00%00%B1%8F%0B%FCa%05%00%00%00%20cHRM%00%00z%26%00%00%80%84%00%00%FA%00%00%00%80%E8%00%00u0%00%00%EA%60%00%00%3A%98%00%00%17p%9C%BAQ%3C%00%00%00%09pHYs%00%00%0E%C2%00%00%0E%C2%01%15(J%80%00%00%00%1AtEXtSoftware%00Paint.NET%20v3.5.100%F4r%A1%00%00%02tIDAT8O%95%D4Wn%93Q%10%05%E0k%C9%96%FC%E0%3DX%5ETB%E7%01B%11%20%D1%03d)%40%A8%0Ft%01%12%1D%12VAh%89-Q%23%B0%84%A9%C6%BC%C0w9l%00%EB%EA%D7%DC%999g%CE%8C%E7%FF%1B%93%C5c%83%C1%A0%D9lv%3A%9D%D1h%D4%EB%F5%FA%FD~%B7%DB%9DL%26%ADVk%3C%1E3~%FF%FD%B5%DB%EDF%A3!s8%1C2%0A%E4%EA%B5%9D%EF%AF%EExyf%C3%97%BB%07%BE%3F8%CC%18%3F%3A%F2%E2%F4%FAg%F3ky%9C%95s%9B%3C%BF%DD%3F%24%F3%D7%E39%A1%A5%13%D3%E5%F5%C5%AD%9Fn%ED%ED%9F%DF%2C%20C%80%E1%B9%7Cv%A3'%22x9%B8%92%F6%E1%FA.e%DE%5C%9A)%C3%9B%7B%5E%5D%D8%82%03%9F%B0%ABlW%2C%9F%EF%EC%7F~j%5D%FC_%EF%1D%84%FCxcw%D8Q%14%1CX%B9%D0%80%C9V%01%97%F0%CF%85%A32%B4%23%E1%DD%95%ED%BAxzr%0D%D9j%0A%15%94%02R%C1F%B7%F7%FDx8%0B%83E%9D8%3D)why%7By%9BJ%9C*%172%10s%85%5BF%B8%5CU%40D%A4%CE%23*r%80%5DkMHG)%00y%AA%E9%F3%C9%F1)%1E%E2%E1%D9%D2%D2%24%18%9B%A7(%22%3BE%8C%9B%AD%87%D4gg%C8%0C!%AD%BA%0A%81%D5%09qi%8F%C5p2%5E%606%8C%3A%EA%07%1C!T%08U%B5%FF%5B%0A%AF!ST%90%A1%84w'%06q%06H%88c~%99%99%D9(h%60%26%2C%CD%9C%8A%FF%1A%8D%1E%82'%C6%0C%D9%88%A4%86E%AA%04%86%A6%24%C0%7B%D6%1D%A2%1B%3E%01%19%FE%03W%0Dg%2BPh%5B%D4%0Ep%B2%11%01%D7%9A%0Ez2%D4%CC%1Ay%CA%E34%09%ED%D0fo%F0%BAFE%DD%DB%ACxdxf%80%90R3U0%2C%00%60%DAV%8DG%8D%3A!w%60w%B2%F3Zd%0C%B8e8r%F0fu%F8%0D%AC%BEe%E8%15%01sG%81%3B%FB%E8(%A5%A6%1D%8Ax0%BC%F0%3CrJ%16Z%DF%BC%D9%1B%05IP_5%F8%F8%09%01%60%3B%04%D7%3E%C5%F2%1F%A4u%C4%60%26%8C%22%13%96j%5D%15%F1%CC%C6%0B%11X%91%C8%B4%C1%C5Ff%01%B2%09%86%24%83%D4%7C%0D%F2%C6%3A%9C%3C%FF%DE%B2%7C%13%F2f%8A%91%00%A68%C1%F9%7B%F9%F3%1D!J%19F%D1%15%97!%D1%C3%26)%1F%A8L%DF%D5%93_%AA!e%EFhf%FC%01%AD%A2%5D%5D%A8%E8%C6%F1%00%00%00%00IEND%AEB%60%82";
	//таблица с обновленным графическим расположением бойцов
	var graphTable;
	// поле ввода текста чата
	var inp_text;
	if (viewMode) inp_text = doc.getElementsByName('msg')[0];
	else if (nojs) inp_text = doc.getElementsByName('newmessage')[0];
	//контейнеры с инфой о бойцах правой и левой команды
	var divs;
	//поле расстановки ходов
	var bf;

	if (!viewMode) {	//в бою
		//флаг установки интервала запросов для выделения персонажей, сделавших ход в JS-версии боя
		if (!nojs) var tm;
		//флаг установки интервала обновления данных в бою после того, как сделали ход
		var tm1;

		var say_move = doc.createElement('input');	//кнопка "Сказать ход"

		//отметки хода(синие кружочки :)
		var checkDivR = createCheckDiv();   //правая
		var checkDivL = createCheckDiv();   //левая
		var checkDivD = createCheckDiv();   //отход
		var checkDivGr = createCheckDiv();  //грена
		var checkDivW = createCheckDiv();   //подходим

		//данные из списка выбора врагов (имя --> номер)
		var enemy;
		//объект с моими данными для вывода вверху страницы боя (hp, урон, видимость и т.д.)
		var myPers;
		//ячейка для вывода информации своего перса
		for (var i = 0; i < a.length; i++) {
			if (/chat\.ganjawars\.ru/.test(a[i].href)) {
				var parent = a[i].parentNode.parentNode;
				parent.firstElementChild.setAttribute('width', '30%');
				parent.lastElementChild.setAttribute('width', '30%');
				var td_info = doc.createElement('td');
				td_info.setAttribute('width', '40%');
				td_info.setAttribute('style', 'text-align: center;');
				parent.insertBefore(td_info, parent.lastElementChild);
				break;
			}
		}

		//ссылки на персов слева и справа
		var leftPers, rightPers;

		//localStorage config:
		//[0] - метод сортировки списка врагов (0 - 5)
		//[1] - случайный ход или запоминать ход (0,1,2)
		//[2] - дублировать противника или нет (0,1)
		// Запоминаем последний сделаный ход (если включено "запомнить ход")
		//[3] - левая(1-3)
		//[4] - правая(1-3)
		//[5] - куда отходим(1-3)
		//[6] - кидаем грену или нет(0,1)
		//[7] - подходим или нет(0,1)
		//[8] - чекбокс "Сказать своей команде"
		var ls = st.getItem('adv_battle_' + myId);
		if (!ls || ls.split('|').length != 9) st.setItem('adv_battle_' + myId, '0|0|0|2|2|2|0|0|0');
	}

	//tooltip с информацией о бойцах, всплывающий при наведении мышы на изображение бойца на поле боя
	var div = doc.createElement('div');
	div.setAttribute('id', 'div_tooltip');
	div.setAttribute('style', 'display: none; position: absolute; font-size: 8pt; background-color: #FFFFFF; padding: 3px; border: 1px solid #339933; border-radius: 7px;');
	//на всякий случай, если останется виден
	div.addEventListener('click', function() {this.style.display = 'none';}, false);
	doc.body.appendChild(div);

	var allFighters = [];	//массив объектов всех бойцов на поле
	try_start();

	//в НЕ JS-версии делаем полный лог боя
	if (!nojs) return;

	//id боя и лог боя
	var id_b, log;
	for (i = 0; i < a.length; i++) {
		if (/запись всех ходов/i.test(a[i].innerHTML) && /\?bid=(\d+)/.test(a[i].href)) {
			id_b = /\?bid=(\d+)/.exec(a[i].href)[1];
			log = a[i].previousElementSibling.previousElementSibling.getElementsByTagName('div')[0];
			var parnt = a[i].parentNode;
			parnt.removeChild(a[i].previousSibling.previousSibling);
			parnt.removeChild(a[i].previousSibling);
			parnt.removeChild(a[i]);
			break;
		}
	}

	if (!id_b || !log) return;

	var url = 'http://www.ganjawars.ru/b0/btk.php?bid=' + id_b + '&turn=-1&lines=-1';
	ajaxQuery(url, function(xhr) {
		var span = doc.createElement('span');
		span.innerHTML = xhr.responseText;
		var div = span.getElementsByTagName('div');
		for (var i = 0; i < div.length; i++) {
			if (div[i].getAttribute('id') == 'log') {
				log.innerHTML = div[i].innerHTML;
				break;
			}
		}
	});

}());
