// ==UserScript==
// @name           hwm_miniart
// @namespace      http://anykey.asvip.ru/
// @description    Наборы миниартефактов магов (by Сойот & Demin)
// @homepage       https://greasyfork.org/users/1602-demin
// @icon           http://i.imgur.com/LZJFLgt.png
// @version        1.2
// @encoding 	   utf-8
// @include        http://www.heroeswm.ru/*
// @include        http://qrator.heroeswm.ru/*
// @include        http://178.248.235.15/*
// @exclude        */rightcol.php*
// @exclude        */ch_box.php*
// @exclude        */chat*
// @exclude        */ticker.html*
// @exclude        */frames*
// @exclude        */brd.php*
// @grant          GM_deleteValue
// @grant          GM_getValue
// @grant          GM_listValues
// @grant          GM_setValue
// @grant          GM_addStyle
// @grant          GM_log
// @grant          GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/9601/hwm_miniart.user.js
// @updateURL https://update.greasyfork.org/scripts/9601/hwm_miniart.meta.js
// ==/UserScript==

(function() {

var version = '1.2';


if (typeof GM_deleteValue != 'function') {
	this.GM_getValue=function (key,def) {return localStorage[key] || def;};
	this.GM_setValue=function (key,value) {return localStorage[key]=value;};
	this.GM_deleteValue=function (key) {return delete localStorage[key];};
}
if (typeof GM_listValues != 'function') {
	this.GM_listValues=function () {
		var values = [];
		for (var i=0; i<localStorage.length; i++) {
			values.push(localStorage.key(i));
		}
		return values;
	}
}


var script_num = 9601;
var script_name = "hwm_miniart: Наборы миниартефактов магов (by Сойот & Demin)";
update_n(version,script_num,script_name);

var url_cur = location.href;
var url = 'http://'+location.hostname+'/';


Function.prototype.bind = function(object)
{
	var method = this;
    return function()
		{
			return method.apply(object, arguments);
    }
};

var regexp_art = /(<td><img[^>]+><\/td>)<td><b>[^<]+<\/b><\/td>(?:(<td><img[^>]+><\/td>)<td><b>[^<]+<\/b><\/td>)?(?:(<td><img[^>]+><\/td>)<td><b>[^<]+<\/b><\/td>)?(?:(<td><img[^>]+><\/td>)<td><b>[^<]+<\/b><\/td>)?<\/tr>(?:<\/tbody>)?<\/table>(?:<\/td>)?<td[^>]+>&nbsp;<b>([^(]+)\n? \([\d]+\)<\/b>&nbsp;&nbsp;<\/td><form[^>]+>(?:<\/form>)?<td[^>]+><input[^>]+>\n<input[^>]+value\=['"]([\d]+)['"][^>]*>/g;

var mage_army = {
"\u0413\u0440\u0435\u043C\u043B\u0438\u043D\u044B": 1,
"\u0421\u0442\u0430\u0440\u0448\u0438\u0435 \u0433\u0440\u0435\u043C\u043B\u0438\u043D\u044B": 1,
"\u041A\u0430\u043C\u0435\u043D\u043D\u044B\u0435 \u0433\u043E\u0440\u0433\u0443\u043B\u044C\u0438": 2,
"\u041E\u0431\u0441\u0438\u0434\u0438\u0430\u043D\u043E\u0432\u044B\u0435 \u0433\u043E\u0440\u0433\u0443\u043B\u044C\u0438": 2,
"\u0416\u0435\u043B\u0435\u0437\u043D\u044B\u0435 \u0433\u043E\u043B\u0435\u043C\u044B": 3,
"\u0421\u0442\u0430\u043B\u044C\u043D\u044B\u0435 \u0433\u043E\u043B\u0435\u043C\u044B": 3,
"\u041C\u0430\u0433\u0438": 4,
"\u0410\u0440\u0445\u0438\u043C\u0430\u0433\u0438": 4,
"\u0414\u0436\u0438\u043D\u043D\u044B": 5,
"\u0414\u0436\u0438\u043D\u043D\u044B \u0441\u0443\u043B\u0442\u0430\u043D\u044B": 5,
"\u041F\u0440\u0438\u043D\u0446\u0435\u0441\u0441\u044B \u0440\u0430\u043A\u0448\u0430\u0441": 6,
"\u0420\u0430\u0434\u0436\u0438 \u0440\u0430\u043A\u0448\u0430\u0441": 6,
"\u041A\u043E\u043B\u043E\u0441\u0441\u044B": 7,
"\u0422\u0438\u0442\u0430\u043D\u044B": 7
};
var _saveFunc;
var dress_count;

var restriction = false;
var fonts = document.getElementsByTagName('font');
for (var i = 0; i < fonts.length; i++)
	if (fonts[i].innerHTML == '\u0412\u044B \u043D\u0430\u0445\u043E\u0434\u0438\u0442\u0435\u0441\u044C \u0432 \u0437\u0430\u044F\u0432\u043A\u0435 \u043D\u0430 \u0431\u043E\u0439. \u0412\u0430\u0448\u0438 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F \u043E\u0433\u0440\u0430\u043D\u0438\u0447\u0435\u043D\u044B!')
		restriction = true;
		
if (url_cur.match(/magearts\.php/))
{
	var miniarts = {};
	if (!restriction)
	{
		var art_id;
		var as = document.getElementsByTagName('a');
		for (var i = 0; i < as.length; i++)
			if (art_id = as[i].href.match(/magearts\.php\?sale=1\&id=(\d+)/))
				miniarts[art_id[1]] = 1;
	}
			
	var els_b = document.getElementsByTagName('b');
	for (var i = 0; i < els_b.length; i++)
		if (els_b[i].innerHTML == '\u0421\u043E\u0431\u0440\u0430\u0442\u044C \u043D\u043E\u0432\u044B\u0439 \u043C\u0438\u043D\u0438-\u0430\u0440\u0442\u0435\u0444\u0430\u043A\u0442.')
		{
			var t1 = els_b[i].parentNode.parentNode.parentNode.parentNode.parentNode;
			var br1 = document.createElement('br');
			var br2 = document.createElement('br');
			var t2 = document.createElement('table');
			t2.width = t1.width;
			t2.align = t1.align;
			t2.className = t1.className;
			t2.innerHTML = "<tr><td class=\"wbwhite\" align=\"center\">\
	<embed width=\"60\" height=\"50\" align=\"middle\" pluginspage=\"http://www.macromedia.com/go/getflashplayer\" type=\"application/x-shockwave-flash\" name=\"showarmy1\" wmode=\"opaque\" flashvars=\"param=16710900^gremlinani|||||||^\" src=\"swffiles/showarmy1.swf?ver=48\">\
	</td><td class=\"wbwhite\" align=\"center\">\
	<embed width=\"60\" height=\"50\" align=\"middle\" pluginspage=\"http://www.macromedia.com/go/getflashplayer\" type=\"application/x-shockwave-flash\" name=\"showarmy1\" wmode=\"opaque\" flashvars=\"param=16710900^gargolyani|||||||^\" src=\"swffiles/showarmy1.swf?ver=48\">\
	</td><td class=\"wbwhite\" align=\"center\">\
	<embed width=\"60\" height=\"50\" align=\"middle\" pluginspage=\"http://www.macromedia.com/go/getflashplayer\" type=\"application/x-shockwave-flash\" name=\"showarmy1\" wmode=\"opaque\" flashvars=\"param=16710900^golemani|||||||^\" src=\"swffiles/showarmy1.swf?ver=48\">\
	</td><td class=\"wbwhite\" align=\"center\">\
	<embed width=\"60\" height=\"50\" align=\"middle\" pluginspage=\"http://www.macromedia.com/go/getflashplayer\" type=\"application/x-shockwave-flash\" name=\"showarmy1\" wmode=\"opaque\" flashvars=\"param=16710900^mageani|||||||^\" src=\"swffiles/showarmy1.swf?ver=48\">\
	</td><td class=\"wbwhite\" align=\"center\">\
	<embed width=\"60\" height=\"50\" align=\"middle\" pluginspage=\"http://www.macromedia.com/go/getflashplayer\" type=\"application/x-shockwave-flash\" name=\"showarmy1\" wmode=\"opaque\" flashvars=\"param=16710900^djinnani||||||||^\" src=\"swffiles/showarmy1.swf?ver=48\">\
	</td><td class=\"wbwhite\" align=\"center\">\
	<embed width=\"60\" height=\"50\" align=\"middle\" pluginspage=\"http://www.macromedia.com/go/getflashplayer\" type=\"application/x-shockwave-flash\" name=\"showarmy1\" wmode=\"opaque\" flashvars=\"param=16710900^rakshasani|||||||^\" src=\"swffiles/showarmy1.swf?ver=48\">\
	</td><td class=\"wbwhite\" align=\"center\">\
	<embed width=\"60\" height=\"50\" align=\"middle\" pluginspage=\"http://www.macromedia.com/go/getflashplayer\" type=\"application/x-shockwave-flash\" name=\"showarmy1\" wmode=\"opaque\" flashvars=\"param=16710900^colossusani|||||||^\" src=\"swffiles/showarmy1.swf?ver=48\">\
	</td><td colspan=3 class=\"wbwhite\" align=\"center\"></tr>";
			
			var set_value_cur = get_current_art_set(document.body.innerHTML).split("\n");
			var set_id_cur = 'set';
			for (var j = 0; j < 7; j++)
				set_id_cur += '_' + set_value_cur[j*2];
			var set_exist = false;

			var temp_list = GM_listValues();
			for (var t in temp_list) {
				set_id = temp_list[t];
				if ((set_id.split('_'))[0] != 'set')
					continue;
				var set_value = GM_getValue(set_id).split("\n");
				var tr = document.createElement('tr');
				tr.id="set_row_" + set_id;
				tr.setAttribute('name', set_value[0]);
				if (set_id == set_id_cur)
				{
					set_exist = true;
					GM_setValue("hwm_miniart_cur", 'miniart_on_' + set_id);
					//tr.className = "wbcapt";
					tr.className = "wblight";
				} else
					tr.className = "wbwhite";
				for (var j = 0; j < 7; j++)
				{
					var td = create_cell(tr);
					if (!restriction && set_value[j*2 + 1] != ' ' && miniarts[set_value[j*2 + 1]] != 1)
						td.style.background = '#FF9999';
					td.setAttribute('name', 'miniart_' + set_value[j*2 + 1]);
					td.innerHTML = "<table cellspacing=0 cellpadding=0><tr>" + set_value[j*2 + 2] + "</tr></table>";
				}
				t2.appendChild(tr);
				var td = create_cell(tr);
				td.innerHTML = "<input type=\"text\" id=\"set_name_" + set_id + "\" value=\"" + set_value[0] + "\" style=\"width: 173px;\">";
				td = create_cell(tr);
				td.innerHTML = "<input type=\"submit\" value=\"Save\" id=\"save_button_" + set_id + "\" class=\"cbtn\">";
				td = create_cell(tr);
				td.innerHTML = "<input type=\"submit\" value=\"Del\" id=\"del_button_" + set_id + "\" class=\"cbtn\">";
			}
			t1.parentNode.insertBefore(t2, t1.nextSibling);
			t1.parentNode.insertBefore(br1, t1.nextSibling);
			t1.parentNode.insertBefore(br2, t1.nextSibling);
			
			if (!set_exist && !restriction)
			{
				GM_deleteValue("hwm_miniart_cur");
				var tr = document.createElement('tr');
				tr.id="set_row";
				tr.className = "wblight";
				for (var j = 0; j < 7; j++)
				{
					var td = create_cell(tr);
					td.setAttribute('name', 'miniart_new_' + set_value_cur[j*2]);
					td.innerHTML = "<table cellspacing=0 cellpadding=0><tr>" + set_value_cur[j*2 + 1] + "</tr></table>";
				}
				var td = create_cell(tr);
				td.innerHTML = "<input type=\"text\" id=\"set_name\" value=\"\" style=\"width: 173px;\">";
				td = create_cell(tr);
				td.innerHTML = "<input type=\"submit\" value=\"Save\" id=\"save_button\" class=\"cbtn\">";
				td = create_cell(tr);
				td.innerHTML = "<input type=\"submit\" value=\"Del\" id=\"del_button\" class=\"cbtn\" style=\"display:none\">";
				t2.appendChild(tr);

				$('save_button').addEventListener("click", _saveFunc = function() {set_save();}, false);
			}
			var temp_list2 = GM_listValues();
			for (var t2 in temp_list2) {
				set_id = temp_list2[t2];
				if ((set_id.split('_'))[0] != 'set')
					continue;
				var btn = $("save_button_" + set_id);
				btn.addEventListener("click", function() {set_rename(this);}.bind(btn), false);
				btn = $("del_button_" + set_id);
				btn.addEventListener("click", function() {set_delete(this);}.bind(btn), false);
			}
		}
		
	var as = document.getElementsByTagName('a');
	for (var i = 0; i < as.length; i++)
	{
		var art_id;
		if (art_id = as[i].href.match(/magearts\.php\?sale=1\&id=(\d+)/))
		{
			art_id = art_id[1];
			var els;
			if (els = document.getElementsByName('miniart_' + art_id))
			{
				if (els.length > 0)
				{
					as[i].parentNode.parentNode.id = 'miniart2_' + art_id;
					as[i].parentNode.parentNode.addEventListener("mouseover", function() {miniart_highlight(this, true);}.bind(as[i].parentNode.parentNode), false);
					as[i].parentNode.parentNode.addEventListener("mouseout", function() {miniart_highlight(this, false);}.bind(as[i].parentNode.parentNode), false);
					as[i].title = '\u0412\u0445\u043E\u0434\u0438\u0442 \u0432 \u0441\u0435\u0442\u044B:'
					for (var j = 0; j < els.length; j++)
					{
						if (j > 0)
							as[i].title += ',';
						as[i].title += ' ' + els[j].parentNode.getAttribute('name');
					}
					as[i].style.color = '#882C08';
				} else
					as[i].style.color = '#598808';
			}
		}
	}
	
}

var title_panel = '\u041C\u0438\u043D\u0438\u043A\u0438';
var coop = '<br><center style="font-size:10px;font-weight:normal"><a href="magearts.php" style="font-size:10px;">\u041A\u0443\u0437\u043D\u044F \u043C\u0438\u043D\u0438\u0430\u0440\u0442\u043E\u0432</a></center>' ;
	
if( !$('hwm_skill_td') )
{
	var imgs = document.getElementsByTagName( 'img' );
	for( var i2 = 0; i2 < imgs.length; i2++ )
	{
		var el1 = imgs[i2];
		if( el1.src.indexOf( 'logob_eng.jpg' ) > -1 )
		{
			el1.parentNode.setAttribute( 'id' , 'hwm_skill_td' ) ;
		}
	}
}

if( !$('hwm_skill_td') ) return;
var miniart_menu = document.createElement( 'div' );
miniart_menu.id = 'miniart_menu';
addStyle( '#miniart_menu { position:absolute;margin:-22px 0 0 -55px; }' );
$('hwm_skill_td').appendChild(miniart_menu);
lay = document.createElement( 'layer' );
lay.id = 'layer_miniart' ;
lay.setAttribute( 'z-index' , 1 ) ;
miniart_menu.appendChild( lay ) ;

da = document.createElement( 'div' );
lay.appendChild( da ) ;

da.id = 'hwm_miniart_get' ;
addStyle( '#hwm_miniart_get { position: absolute;text-align:left;background:#6b6b69;color:#f5c137;border: 1px solid #f5c137;padding: 2px 5px;font-weight:bold; }' );
addStyle( '#hwm_miniart_get A { color:#f5c137;font-weight:normal; }' );
title = document.createElement( 'b' );
title.innerHTML = title_panel;
title.style.cursor = 'pointer' ;
title.addEventListener( "click", display_sets , false );
da.appendChild( title ) ;

d1 = document.createElement( 'div' );
d1.id = 'hwm_miniart_sets' ;
addStyle( '#hwm_miniart_sets { padding: 5px; display:none; }' );

var body = document.getElementsByTagName('body');
el = document.createElement('div');
el.setAttribute('style' ,'position: absolute; top: 5px;text-align:left;width:90; z-index: 2');
body[0].insertBefore( el , body[0].firstChild );
var i_cur = GM_getValue("hwm_miniart_cur", '');
var temp_list = GM_listValues();
for (var t in temp_list) {
	set_id = temp_list[t];
	if ((set_id.split('_'))[0] != 'set')
		continue;
	var set_value = GM_getValue(set_id).split("\n");
	var td = document.createElement( 'div' );
	td.setAttribute( 'sets' , set_id ) ;
	var bt = document.createElement( 'a' );
	bt.href = 'javascript:void(0);';
	bt.id = "miniart_on_" + set_id;
	if(i_cur == bt.id)
	{
		bt.style.fontWeight = 'bold';
		bt.style.color = '#0f0';
	}
	bt.style.whiteSpace = 'nowrap';
	bt.addEventListener("click", function() {set_on(this);}.bind(bt), false);
	bt.innerHTML = set_value[0];
	td.appendChild(bt);
	d1.appendChild(td);
}
da.appendChild(d1);

dver = document.createElement( 'div' );
dver.innerHTML = coop ;
d1.appendChild( dver ) ;	

function miniart_highlight(elm, light)
{
	var els;
	if (els = document.getElementsByName('miniart_' + (elm.id.split('_'))[1]))
		for (var i = 0; i < els.length; i++)
				els[i].style.background = light ? '#FFDDDD' : '';
}

function display_sets()
{
	div_miniart_sets = $( 'hwm_miniart_sets' ) ;
	div_miniart_gets = $( 'hwm_miniart_get' ) ;
	if( div_miniart_sets )
	{
		visible = div_miniart_sets.style.display ;
		div_miniart_gets.style.zIndex = 3 ;
		div_miniart_sets.style.display = visible == 'block' ? 'none' : 'block' ;
	}
}

function create_cell (tr)
{
	var td = document.createElement('td');
	td.style.border = '1px solid #5D413A';
	td.align = "center";
	tr.appendChild(td);
	return td;
}

function set_save()
{
	if ($('set_name').value == '')
	{
		alert ('\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0438\u043C\u044F \u0441\u0435\u0442\u0430');
		return;
	}

	var current_set = get_current_art_set(document.body.innerHTML);
	var set_value = current_set.split("\n");
	var set_id = 'set';
	for (var i = 0; i < 7; i++)
		set_id += '_' + set_value[i*2];

	GM_setValue(set_id, $('set_name').value + "\n" + current_set);
	var btn = $('save_button');
	btn.removeEventListener("click", _saveFunc, false);
	btn.id = 'save_button_' + set_id;
	btn.addEventListener("click", function() {set_rename(this);}.bind(btn), false);
	btn = $('del_button');
	btn.id = 'del_button_' + set_id;
	btn.addEventListener("click", function() {set_delete(this);}.bind(btn), false);
	btn.style.display = '';
	$('set_row').id = 'set_row_' + set_id;
	$('set_name').id = 'set_name_' + set_id;
}

function  set_rename(btn)
{
	var set_id = btn.id.substring(12);
	var set_value = GM_getValue(set_id).split("\n");
	set_value[0] = $('set_name_' + set_id).value;
	GM_setValue(set_id, set_value.join("\n"));
}

function set_delete(btn)
{
	var set_id = btn.id.substring(11);
	var tr = $('set_row_' + set_id);
	tr.parentNode.removeChild(tr);
	GM_deleteValue(set_id);
}

function get_current_art_set(html_str)
{
	var arts = '';
	var set_value = [];
	for (var i = 0; i < 7; i++)
	{
		set_value[i] = " \n";
	}
	for (var i = 0; ( arts = regexp_art.exec(html_str)) != null; i++)
	{
		set_value[mage_army[arts[5]] - 1] = arts[6] + "\n" +
			((arts[1] === undefined) ? "" : arts[1]) +
			((arts[2] === undefined) ? "" : arts[2]) +
			((arts[3] === undefined) ? "" : arts[3]) +
			((arts[4] === undefined) ? "" : arts[4]);
	}
	return set_value.join("\n");
}

function set_on(link)
{
	var i_cur = GM_getValue("hwm_miniart_cur", '') ;
	if(i_cur != '' && $(i_cur) != null)
	{
		$(i_cur).style.fontWeight = 'normal';
		$(i_cur).style.color = '#f5c137';
		GM_deleteValue("hwm_miniart_cur");
	}
	title.innerHTML = title_panel + '<img id="miniart_loading" border="0" align="absmiddle" src="i/mus_loading.gif" width=11 height=11/>';
	var req = new XMLHttpRequest();
	req.link = link;
	req.open('GET', url + 'magearts.php', true);
	req.overrideMimeType('text/plain; charset=windows-1251');
	req.setRequestHeader('Accept', 'text/xml');
	req.onreadystatechange = function() {set_on2(this);}.bind(req);
	req.send('');
}

function set_on2(req)
{
	dress_count = 0;
	if (req.readyState == 4 && req.status == 200)
	{
		var cur_set = get_current_art_set(req.responseText).split("\n");
		var set_value = GM_getValue('set_' + req.link.id.substring(15),'').split("\n");
		for (var i = 0; i < 7; i++)
		{
			var data;
			var dress = false;
			if (set_value[i*2 + 1] != ' ')
			{
				if (set_value[i*2 + 1] != cur_set[i*2])
				{
					data = 'dress=1&maid=' + set_value[i*2 + 1] + '&who=' + (i+1);
					dress = true;
				}
			} else {
				if (cur_set[i*2] != ' ')
				{
					data = 'dress=1&maid=' + cur_set[i*2] + '&who=0';
					dress = true;
					for (var j = 0; j < 7; j++)
						if (set_value[j*2 + 1] == cur_set[i*2])
						{
							dress = false;
							break;
						}
				}
			}
			if (dress)
			{
				dress_count++;
				var req2 = new XMLHttpRequest();
				req2.link = req.link;
				req2.open('POST', url + 'magearts.php', true);
				req2.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
				req2.onreadystatechange = function() {set_on3(this);}.bind(req2);
				req2.send(data);
			}
		}
		if (dress_count == 0)
			dress_complete(req.link.id);
	}
}

function set_on3(req)
{
	if (req.readyState == 4 && req.status == 200)
		if (--dress_count == 0)
			dress_complete(req.link.id);
}

function dress_complete(set_name)
{
	var set_ = $(set_name)
	if (set_)
	{
		set_.style.fontWeight = 'bold';
		set_.style.color = '#0f0';
		GM_setValue("hwm_miniart_cur", set_name);
	}
	title.innerHTML = title_panel;
}

function $(d) { return document.getElementById(d); }

function addStyle( css )
{
	var h , style ;
	h = document.getElementsByTagName('head')[0];
	if( !h ) return;
	style = document.createElement( 'style' );
	style.type = 'text/css';
	style.innerHTML = css;
	h.appendChild( style );
}

function addEvent(elem, evType, fn) {
	if (elem.addEventListener) {
		elem.addEventListener(evType, fn, false);
	}
	else if (elem.attachEvent) {
		elem.attachEvent("on" + evType, fn);
	}
	else {
		elem["on" + evType] = fn;
	}
}

function update_n(a,b,c,d,e){if(e){e++}else{e=1;d=(Number(GM_getValue(b+'_update_script_last2','0'))||0)}if(e>3){return}var f=new Date().getTime();var g=document.querySelector('#update_demin_script2');if(g){if((d+86400000<f)||(d>f)){g=g.innerHTML;if(/100000=1.1/.exec(g)){var h=new RegExp(b+'=(\\d+\\.\\d+)=(\\d+)').exec(g);var i=/url7=([^%]+)/.exec(g);if(a&&h&&i){if(Number(h[1])>Number(a))setTimeout(function(){if(confirm('\u0414\u043E\u0441\u0442\u0443\u043F\u043D\u043E \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0435 \u0441\u043A\u0440\u0438\u043F\u0442\u0430: "'+c+'".\n\u0423\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u043D\u0443\u044E \u0432\u0435\u0440\u0441\u0438\u044E \u0441\u0435\u0439\u0447\u0430\u0441?\n\nThere is an update available for the script: "'+c+'".\nWould you like install the script now?')){if(typeof GM_openInTab=='function'){GM_openInTab(i[1].replace(/\s/g,'')+h[2])}else{window.open(i[1].replace(/\s/g,'')+h[2],'_blank')}}},500)}GM_setValue(b+'_update_script_last2',''+f)}else{setTimeout(function(){update_n(a,b,c,d,e)},1000)}}}else{var j=document.querySelector('body');if(j){var k=GM_getValue(b+'_update_script_array2');if(e==1&&((d+86400000<f)||(d>f)||!k)){if(k){GM_deleteValue(b+'_update_script_array2')}setTimeout(function(){update_n(a,b,c,d,e)},1000);return}var l=document.createElement('div');l.id='update_demin_script2';l.setAttribute('style','position: absolute; width: 0px; height: 0px; top: 0px; left: 0px; display: none;');l.innerHTML='';j.appendChild(l);if((d+86400000<f)||(d>f)||!k){var m=new XMLHttpRequest();m.open('GET','photo_pl_photos.php?aid=1777'+'&rand='+(Math.random()*100),true);m.onreadystatechange=function(){update(m,a,b,c,d,e)};m.send(null)}else{document.querySelector('#update_demin_script2').innerHTML=k;setTimeout(function(){update_n(a,b,c,d,e)},10)}}}}function update(a,b,c,d,e,f){if(a.readyState==4&&a.status==200){a=a.responseText;var g=/(\d+=\d+\.\d+(=\d+)*)/g;var h='';var i=/(url7=[^%]+\%)/.exec(a);if(i){h+=i[1]}while((i=g.exec(a))!=null){if(h.indexOf(i[1])==-1){h+=' '+i[1]}};GM_setValue(c+'_update_script_array2',''+h);var j=document.querySelector('#update_demin_script2');if(j){j.innerHTML=h;setTimeout(function(){update_n(b,c,d,e,f)},10)}}}

})();
