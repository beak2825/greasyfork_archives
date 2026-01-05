// ==UserScript==
// @name        GM_option
// @namespace   https://greasyfork.org/ja/scripts/9507
// @homepageURL https://greasyfork.org/ja/scripts/9507
// @license     http://creativecommons.org/licenses/by-nc-sa/4.0/
// @include     http://*
// @include     https://*
// @include     file:*
// @copyright   Noi & Noisys & NoiSystem & NoiProject
// @author      noi
// @description support tool for UserConfig.(library)
// @version     1.04
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @grant       GM_log
// ==/UserScript==

/*************************************************************************
[about]

This script is the library to make a setting screen.
I made this support tool in order to make more easily.

*************************************************************************
[How to use]

Sample code is end of this Script.
Plz test it.


If savedata is none....?
<first start-up or no savedata or parameter(HTML tag) changed>
This script make GM_option window and save default.
<next time>
This script never make GM_option window without running open-function.

<@grant>----------------------------------------------
you need to add @grant.
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @grant       GM_registerMenuCommand

GM_setValue and GM_getValue and GM_deleteValue is required.
GM_registerMenuCommand is optional.


<start function>----------------------------------------------
GM_option.open(String,String,HashArray);

first String is HTML Tag(header ex: style or script or etc...)
second String is HTML Tag(document.body).
third HashArray is optional,it's messages for dialog.

Message List
'save'   -  when click save button.
'reset'  -  when click reset button.(discard changes)
'clear'  -  when click clear button.(delete savedata)
'delete' -  when click del button.(delete multiple)


<user function>--------------------------------------
At first,get user's settings.
GM_option.get();

return hashArray(Associative array).


<HTML tag>-------------------------------------------
use form inputs.
'name' is save-key.
'value' is save-data.

ex)
HTML tag is...
<input type="text" name="this_is_Key" value="this_is_Data" />

Save Data is...
{"this_is_Key":"this_is_Data"}


<multiple text>--------------------------------------
'name' is ****_multiple9999.(required)
9999 is number of array.(required)
'value' is default.(optional)
'defArray' is default array.(optional)
<button id="this_is_required"> is addButton.(required)

ex)
HTML tag is...
<input type="text" name="freeName_multiple2" value="data1" /> <input type="text" name="freeName_multiple2" value="data2" /> <button id="addButton">add</button>

Save Data is...
{"freeName_multiple2":[["data1","data2"],["data3","data4"], and more ]}
"data3" and "data4" are input by user.

ex2)
HTML tag is...
<input type="text" name="freeName_multiple2" defArray="data1-2,data1-3,data1-4" value="data1-1" /> <input type="text" name="freeName_multiple2" defArray="data2-2,data2-3,data2-4" value="data2-1" /> <button id="addButton">add</button>

Save Data is...
{"freeName_multiple2":[["data1-1","data2-1"],["data1-2","data2-2"],["data1-3","data2-3"],["data1-4","data2-4"],["data1-5","data2-5"], and more ]}
"data1-5" and "data2-5" are input by user.

## caution ##
If elements's 'name' are same, defArray are same array.length.

<select-multiple(HTML5)>----------------------------
selected is checked.(optional)

ex)
HTML tag is...
<select name="selectName" multiple size=5>
<option name="optionName1" value="data1"         >item1</option>
<option name="optionName2" value="data2" selected>item2</option>
<option name="optionName3" value="data3"         >item3</option>
<option name="optionName4" value="data4" selected>item4</option>
<option name="optionName5" value="data5"         >item5</option>

Save Data is...
{"selectName":"{\"data2\":true,\"data4\":true}"}

To use...
var userSettings = GM_option.get();
var selectArray = JSON.parse(userSettings['selectName']);


<addEventListener>----------------------------------
'GM_option_loaded'

this event is dispatched...
when made GM_option frame                    (@first start-up)
when loaded User's Settings from GM_getValue (@next time)

ex)
window.addEventListener('GM_option_loaded',userFunction,false);


<access GM_option document>----------------------------------
GM_option.frame
GM_option.doc

ex)
var frame = GM_option.frame;
var doc = GM_option.doc.head;
var head = GM_option.doc.body;
var form = GM_option.doc.opForm;


<other function>----------------------------------
after GM_option opened
GM_option.show();  - show GM_option
GM_option.close(); - hide GM_option
GM_option.save();  - save settings & reload
GM_option.reset(); - discard changes
GM_option.clear(); - delete SaveData & reload


*************************************************************************
[history]

10/07/2016 - v1.04 add:multiple設定でreadonly属性の引き継ぎ
04/30/2015 - v1.03 add:sandbox
04/29/2015 - v1.01 add:第二引数(body)に変更があった場合は変更箇所の初期値を保存する。初期値配列の指定方法追加。
04/29/2015 - v1.01 fix:入力欄でENTERキーを押すとaddボタンを押した時と同じ動作をするバグ。第一引数(head)にスクリプトタグを指定しても動作しないバグ修正。resetボタン修正
04/26/2015 - v1.0  release
*************************************************************************/

var GM_option = {
	init: function(){
		GM_option.defScroll = window.onscroll;	//save default scroll
		var head = GM_option.head;
		var htmlText = GM_option.htmlText;

		//iframe
		var obj = GM_option.frame = window.document.createElement('iframe');
		obj.id = 'GM_option';
		obj.srcdoc = '<head>' + GM_option.head + '</head><body style="background:white;">' + GM_option.htmlText + '</body>';
		obj.setAttribute('style','position:fixed;top:0;left:0;right:0;bottom:0; margin:auto; z-index:999999;width:calc(100% - 40px);height:calc(100% - 60px); max-height:90%; max-width:90%; overflow:auto; visibility:hidden; border:none;');
		obj.sandbox = "allow-same-origin  allow-scripts";
		document.body.appendChild(obj);

		obj.addEventListener('load', GM_option.make(head,htmlText) ,false);
	},
	open: function(head,htmlText,msgArray){
		GM_option.get();
		if(htmlText) GM_option.htmlTextCheck(htmlText);

		var oType = Object.prototype.toString.call(htmlText).slice(8, -1);
		if(!htmlText && htmlText != 'String' && !htmlText.match(/\<.*?\>/)){
			alert('second parameter(htmltext) is not correct.');
			return;
		} 
		if(!GM_option.event){
			GM_option.event = document.createEvent('HTMLEvents');
		        GM_option.event.initEvent('GM_option_loaded', true, false);

			GM_option.msgArray = msgArray;
		}

		if(!GM_option.makeFlg && GM_option.saveData){
			GM_option.makeFlg = true;
			
			window.dispatchEvent(GM_option.event);
			return;
		}

		GM_option.head = head || '';
		GM_option.htmlText = htmlText = [
			'<form name="opForm" action="javascript:void(0);" onSubmit="return false;">',
			'<table id="opTable" style="padding:20px;height:98%;width:98%;"><tr><td align="center" valign="middle">',
			htmlText,
			'<span id="consol">',
			'<input type="button" id="saveConfig" value="save" title="save option" /> ',
			'<input type="button" id="resetConfig" value="reset" title="Revert To Last Save" /> ',
			'<input type="button" id="clearConfig" value="clear" title="clear userSettings" /> ',
			'<button id="closeConfig" title="close option window">close</button>',
			'</span>',
			'</td></tr></table></form>'
		].join('');

		if(htmlText && (!GM_option.frame || !GM_option.layer)) GM_option.init();
		GM_option.show();
	},
	make: function() { return function(){
		var head = GM_option.head;
		var htmlText = GM_option.htmlText;

		this.removeEventListener("load", GM_option.make(head,htmlText) ,false);

		var opDoc = GM_option.doc = this.contentDocument;

		//close
		var closeButton = opDoc.getElementById('closeConfig');
		closeButton.addEventListener('click',GM_option.close,false);

		//save
		var saveButton = opDoc.getElementById('saveConfig');
		saveButton.addEventListener('click',GM_option.save,false);

		//clear
		var defaultButton = opDoc.getElementById('clearConfig');
		defaultButton.addEventListener('click',GM_option.clear,false);

		//reset
		var resetButton = opDoc.getElementById('resetConfig');
		resetButton.addEventListener('click',GM_option.reset,false);

		GM_option.load();	//デフォルト読み込み
		if(!GM_option.saveData || GM_option.htmlChangeFlg) GM_option.save();
		

		//layer
		var layer = GM_option.layer = window.document.createElement('div');
		layer.id = 'opLayer';
		layer.setAttribute('style','position:fixed; top:0px; left:0px; width:100%; height:100%; background-color:black; z-index:5000; opacity:0.7;');
		document.body.appendChild(layer);
		
		layer.addEventListener('click', GM_option.close,false);

		window.addEventListener('beforeunload', function() {
			window.removeEventListener("beforeunload", arguments.callee,false);
			layer.removeEventListener('click', GM_option.close,false);
			closeButton.removeEventListener('click',GM_option.close,false);
			saveButton.removeEventListener('click',GM_option.save,false);
			defaultButton.removeEventListener('click',GM_option.clear,false);
			resetButton.removeEventListener('click',GM_option.reset,false);

			GM_option.remove();
		},false);

		if(GM_option.makeFlg) GM_option.show();
		else{
			GM_option.load();
			GM_option.close();
			
			window.dispatchEvent(GM_option.event);
		}
		GM_option.makeFlg = true;

		opDoc = style = head = htmlText = null;
	}},
	show: function(){
		if(!GM_option.frame || !GM_option.layer) return;
		GM_option.scrollStop(true);
		GM_option.frame.style.visibility = 'visible';
		GM_option.layer.style.visibility = 'visible';
	},
	save: function(clickFlg){
		if(clickFlg){
			var txt = 'Do you want to save?(ok:reload)';
			if(GM_option.msgArray) txt = GM_option.msgArray['save'] || txt;
			if(confirm(txt) == false) return
		}

		var userData = GM_option.get();
		var form = GM_option.doc.opForm;
		var array={};
		var multiArray = {};
		for(var i=0,j=form.length;i<j;i++){
			var obj = form[i];
			var name =obj.name;
			if(!name) continue;
			switch(obj.type){
				case 'checkbox':
					if(obj.checked)array[name] = true;
					else array[name] = false;
					continue;
				case 'radio':
					if(obj.checked)array[name] = obj.value;
					continue;
				case 'text':
					if(!name.match(/_multiple(\d+)$/)){
						array[name] = obj.value;
						continue;
					}else{
						var num = RegExp.$1;
						if(!array[name])array[name] = [];
						var arrayNum = array[name].length - 1;
						if(arrayNum < 0) arrayNum = 0;

						if(!array[name][arrayNum]) array[name][arrayNum] = [];
						if(array[name][arrayNum].length < num) array[name][arrayNum].push(obj.value);
						else{
							arrayNum++;
							if(!array[name][arrayNum]) array[name].push([]);
							array[name][arrayNum].push(obj.value);
						}

						if(!obj.hasAttribute('defArray') || (userData && userData[name])) continue;

						if(!multiArray[name]) multiArray[name] = [];
						multiArray[name].push(obj.getAttribute('defArray'));

						continue;
					}
					continue;
				case 'select-one':
					var opt = obj.getElementsByTagName('option');
					for(var op=0,opLength=opt.length;op<opLength;op++){
						var optObj = opt[op];
						if(optObj.selected){ array[name] = optObj.value; break;}
					}
					continue;
				case 'select-multiple':
					var opt = obj.getElementsByTagName('option');
					var tmpArray = {};
					for(var op=0,opLength=opt.length;op<opLength;op++){
						var optObj = opt[op];
						if(optObj.selected) tmpArray[optObj.value] = true;
					}
					array[name] = JSON.stringify(tmpArray);
					continue;
				default:

					array[name] = obj.value;
					continue;
			}
		}
		//example) multiArray is {"textTest5_5_multiple3":["aa,22,33,44","bb,44,55,66","cc,88,99,00"]}
		//want to change "textTest5_5_multiple3" to "textTest5_5_multiple3":[["dataA","Multi test2","Multi testA"],["aa","bb","cc"],["22","44","88"],["33","55","99"],["44","66","00"]]
		for(var key in multiArray){
			var num = parseInt(key.replace(/.*_multiple(\d+)$/,"$1"));
			var multiList = multiArray[key];
			for(var i=0,j=multiList.length;i<j;i++){
				var multiData = multiList[i].split(',');
				for(var x=0,y=multiData.length;x<y;x++){
					var next = x+1;
					if(!array[key][next]) array[key][next] = [];
					array[key][next][i] = multiData[x];
				}
			}
		}

		GM_option.saveData = JSON.stringify(array);

		GM_setValue('opData',GM_option.saveData);
		if(clickFlg) location.reload();
	},
	//discard changes
	reset: function(){
		var txt = 'discard changes?';
		if(GM_option.msgArray) txt = GM_option.msgArray['reset'] || txt;
		if(confirm(txt) == false) return;

		var dels = GM_option.doc.getElementsByClassName('delSpans');
		for (var i = dels.length-1; i >= 0; i--) {
			dels[i].parentNode.removeChild(dels[i]);
		}
		GM_option.doc.opForm.reset();
		GM_option.load();

	},
	//delete SaveData
	clear: function(){
		var txt = 'delete settings?(ok:reload)';
		if(GM_option.msgArray) txt = GM_option.msgArray['clear'] || txt;
		if(confirm(txt) == false) return;

		GM_deleteValue('opData');
		GM_option.close();
		location.reload();
	},
	//delete line for Multiple
	deleteLine: function(e){
		var txt = 'delete this line?';
		if(GM_option.msgArray) txt = GM_option.msgArray['delete'] || txt;
		if(confirm(txt) == false) return;

		e.target.removeEventListener("click", arguments.callee,false);
		e.target.parentNode.parentNode.removeChild(e.target.parentNode);
	},
	//GM_option.saveData is String,return object Array
	get: function(){
		if(GM_option.saveData) return JSON.parse(GM_option.saveData);
		if(!GM_getValue('opData')) return undefined;

		GM_option.saveData = GM_getValue('opData');
		return JSON.parse(GM_option.saveData);
	},
	//set data
	load: function(){
		var userSet = GM_option.get();
		if(userSet == undefined) return;
		var form = GM_option.doc.opForm;
		var lastName = "";
		var cntMulti = 0;
		var multipleArray = {};

		for(var i=0,j=form.length;i<j;i++){
			var obj = form[i];
			var name = obj.name;
			var readonly = '';
			if(obj.getAttribute('readonly') == 'readonly') readonly = 'readonly="readonly"';
			var userData = userSet[name];
			if(userData == undefined) continue;
			switch(obj.type){
				case 'checkbox':
					if(userData)obj.setAttribute('checked',true);
					else obj.removeAttribute('checked');
					continue;
				case 'radio':
					if(obj.value == userData)obj.setAttribute('checked',true);
					else obj.removeAttribute('checked');
					continue;
				case 'textarea':
					obj.innerHTML = obj.value = userData;
					continue;
				case 'text':
					if(!name.match(/_multiple(\d+)$/)){
						obj.setAttribute('value',userData);
						continue;
					}else{
						var num = RegExp.$1;
						if(lastName != name){
							lastName = name;
							cntMulti = 0;
						}


						obj.setAttribute('value',userData[Math.floor(cntMulti / num)][cntMulti % num]);

						cntMulti++;

						if(num == cntMulti){
							var addObj = obj.parentNode.getElementsByTagName('button');
							if(!addObj[0]){
								alert('addButton is nothing for multiple select.');
								GM_option.remove();
								return;
							}
							var id = addObj[0].id;

							GM_option.addMultiple(name,num,id,readonly);
							j = form.length;
						}


						continue;
					}
					continue;
				case 'select-one':
					var opt = obj.getElementsByTagName('option');
					for(var op=0,opLength=opt.length;op<opLength;op++){
						var optObj = opt[op];
						if(optObj.value == userData) optObj.setAttribute('selected',true);
						else optObj.removeAttribute('selected');
					}
					continue;
				case 'select-multiple':
					var tmpArray = JSON.parse(userData);
					var opt = obj.getElementsByTagName('option');
					for(var op=0,opLength=opt.length;op<opLength;op++){
						var optObj = opt[op];
						if(tmpArray[optObj.value]) optObj.setAttribute('selected',true);
						else optObj.removeAttribute('selected');
					}
					continue;
				default:
					obj.setAttribute('value',userData);
					continue;
			}
		}
	},
	close: function(){
		GM_option.scrollStop(false); 
		if(!GM_option.frame) return;

		GM_option.frame.style.visibility = 'hidden';
		if(!GM_option.layer) return;
		GM_option.layer.style.visibility = 'hidden';
	},
	remove: function(){
		if(GM_option.frame) document.body.removeChild(GM_option.frame);
		if(GM_option.layer) document.body.removeChild(GM_option.layer);
		GM_option = null;
	},
	scrollStop: function(stopFlg){
		GM_option.scrollY = document.documentElement.scrollTop || document.body.scrollTop;

		if(stopFlg) window.onscroll = function () { window.scrollTo(0, GM_option.scrollY); };
		else window.onscroll = GM_option.defScroll;
	},
	//make line for Multiple
	addLine: function(obj,txt,addID){
		var num = parseInt(obj.getAttribute('num')) || 0;
		var strID = addID + '_delItem' + num;
		if(GM_option.doc.getElementById(strID)) return false;
		obj.parentNode.insertAdjacentHTML('beforeend',txt + '<button id="' + strID + '">del</button></span>');

		//del button
		var delButton = GM_option.doc.getElementById(strID);
		delButton.addEventListener('click',GM_option.deleteLine,true);
		window.addEventListener('beforeunload', function() {
			window.removeEventListener("beforeunload", arguments.callee,false);
			delButton.removeEventListener('click',GM_option.deleteLine,true);
		},false);


		obj.setAttribute('num',num + 1);
		return true;
	},
	//Multiple main
	addMultiple: function(name,num,addID,readonly){
		var addButton = GM_option.doc.getElementById(addID);
		var strTxt = '<span class="delSpans"><br>';
		for(var x=0;x<num;x++){
			strTxt += '<input type="text" name="' + name + '" ' + readonly + ' /> ';
		}

		//addEvent
		if(!addButton.hasAttribute('num')){
			var addEvent = function(e){
				GM_option.addLine(e.target,strTxt,addID);
			};
			addButton.addEventListener('mouseup',addEvent,false);
			window.addEventListener('beforeunload', function() {
				window.removeEventListener("beforeunload", arguments.callee,false);
				addButton.removeEventListener('click',addEvent,false);
			},false);
		}

		//addInput(複数選択肢)
		var testArray = GM_option.get()[name];
		addButton.setAttribute('num',1);
		for(var i=1,j=testArray.length;i<j;i++){
			if(!GM_option.addLine(addButton,strTxt,addID)) break;
		}
	},
	htmlTextCheck: function(htmlText){
		var txt = GM_getValue('htmlText');
		if(!txt || (txt && txt != htmlText)){
			GM_setValue('htmlText',htmlText);
			if(!txt) return;
			GM_option.saveData = null;
			GM_option.htmlChangeFlg = true;
		}
	}
};



//sample code
/*********************************************************************************************************************


//sample header(ex:style, script etc...)
const strHeader = [
	'<style id ="cfgCSS" type="text/css">',
	'#cfgTable{ border: solid #ccc 1px; border-spacing:0; border-radius:6px 6px 0 0; -webkit-border-radius:6px 6px 0 0; box-shadow: 0 1px 1px #ccc; -webkit-box-shadow: 0 1px 1px #ccc; }',
	'#cfgTable tr:hover{ transition: all 0.1s ease-in-out; background:#fbf8e9; -webkit-transition: all 0.1s ease-in-out; }',
	'#cfgTable th, #cfgTable td{ border-left: 1px solid #ccc; border-top: 1px solid #ccc; vertical-align: top; white-space: nowrap; padding: 3px; }',
	'#cfgTable th{ color: #151; background: #E3F6E7;}',
	'#cfgTitle, #cfgTable th:first-child, #cfgTable td:first-child { border-left: none;}',
	'#cfgTable tr:first-child th:first-child{ border-top: none; color: #151; border-bottom: 3px solid #036; background: #A0D0A0; padding: 6px; }',
	'#cfgTable label{ padding:1px 5px 2px 5px; }',
	'#cfgTable label:hover{ background:#ada; }',
	'</style>'
].join('');


//sample HTML
var strHTML = [
'<table id="cfgTable" align="center">',
 '<thead>',
 '<tr>',
  '<th id="cfgTitle" colspan=2>Config Title</th>',
 '</tr>',
 '<tr>',
  '<th>Settings</th>',
  '<th>Select</th>',
 '</tr>',
 '</thead>',
 '<tbody>',
 '<tr>',
  '<td>',
   'checkbox test',
  '</td>',
  '<td>',
   '<input type="checkbox" id="flg1" name="check1" checked />',
   '<label for="flg1">check1</label>',
   '<input type="checkbox" id="flg2" name="check2" />',
   '<label for="flg2">check2</label>',
   '<input type="checkbox" id="flg3" name="check3" />',
   '<label for="flg3">check3</label>',
  '</td>',
 '</tr>',
 '<tr>',
  '<td>',
   'radiobutton test1',
  '</td>',
  '<td>',
   '<input type="radio" id="firstOn" name="radio1" value=true checked />',
   '<label for="firstOn">on</label>',
   '<input type="radio" id="firstOff" name="radio1" value=false />',
   '<label for="firstOff">off</label>',
  '</td>',
 '</tr>',
 '<tr>',
  '<td>',
   'radiobutton test2',
  '</td>',
  '<td>',
   '<input type="radio" id="secondOn" name="radio2" value="1" />',
   '<label for="secondOn">type1</label>',
   '<input type="radio" id="secondOff" name="radio2" value="2" checked />',
   '<label for="secondOff">type2</label>',
  '</td>',
 '</tr>',
 '<tr>',
  '<td>text(inline) test</td>',
  '<td>',
   '<input type="text" name="textTest1" value="input text" />',
  '</td>',
 '</tr>',
 '<tr>',
  '<td>textarea test</td>',
  '<td>',
   '<textarea name="textarea">textarea test\rthis\ris\rsample\rdata</textarea>',
  '</td>',
 '</tr>',
 '<tr>',
  '<td>text(inline) for Multiple test</td>',
  '<td>',
   '<input type="text" name="textTest3_multiple1" value="test" /> <button id="addItem">add</button>',
  '</td>',
 '</tr>',
 '<tr>',
  '<td>text(inline) for Multiple test1</td>',
  '<td>',
   '<input type="text" name="textTest3_3_multiple1" defArray="BB,CC,DD" value="AA" /> <button id="addItem1">add</button>',
  '</td>',
 '</tr>',
 '<tr>',
  '<td>text(inline) for Multiple test2</td>',
  '<td>',
   '<input type="text" name="textTest4_multiple2" value="data1" /> <input type="text" name="textTest4_multiple2" value="Multi test" /> <button id="addItem2">add</button>',
  '</td>',
 '</tr>',
 '<tr>',
  '<td>text(inline) for Multiple test3</td>',
  '<td>',
   '<input type="text" name="textTest5_multiple3" value="dataA" /> <input type="text" name="textTest5_multiple3" value="Multi test2" /> <input type="text" name="textTest5_multiple3" value="Multi testA" /> <button id="addItem3">add</button>',
  '</td>',
 '</tr>',
 '<tr>',
  '<td>text(inline) for Multiple test4</td>',
  '<td>',
   '<input type="text" name="textTest5_5_multiple3" defArray="aa,22,33,44" value="dataA" readonly="readonly" /> <input type="text" name="textTest5_5_multiple3" defArray="bb,44,55,66" value="Multi test2" readonly="readonly" /> <input type="text" name="textTest5_5_multiple3" defArray="cc,88,99,00" value="Multi testA" readonly="readonly" /> <button id="addItem4">add</button>',
  '</td>',
 '</tr>',
 '<tr>',
  '<td>select option test</td>',
  '<td>',
   '<select name="select">',
    '<option name="nameop1" value="op1">item1</option>',
    '<option name="nameop2" value="op2" selected>item2</option>',
    '<option name="nameop3" value="op3">item3</option>',
   '</select>',
  '</td>',
 '</tr>',
 '<tr>',
  '<td>select option test2</td>',
  '<td>',
   '<select name="select2" size=5>',
    '<option name="nameopA" value="opA">itemA</option>',
    '<option name="nameopB" value="opB" selected>itemB</option>',
    '<option name="nameopC" value="opC">itemC</option>',
    '<option name="nameopD" value="opE">itemE</option>',
    '<option name="nameopE" value="opF">itemF</option>',
   '</select>',
  '</td>',
 '</tr>',
 '<tr>',
  '<td>select option test3 multiple</td>',
  '<td>',
   '<select name="select3" multiple size=5>',
    '<option name="nameopAA" value="opAA">itemAA</option>',
    '<option name="nameopBB" value="opBB" selected>itemBB</option>',
    '<option name="nameopCC" value="opCC">itemCC</option>',
    '<option name="nameopDD" value="opEE" selected>itemEE</option>',
    '<option name="nameopEE" value="opFF">itemFF</option>',
   '</select>',
  '</td>',
 '</tr>',
 '</tbody>',
'</table>',
].join('');




//userFunction(sample)
var userConfig = function(){
	var options = GM_option.get();	//load userConfig Data(hashArray)

	//example
	var strTxt = "";
	var check1 = options['check1'];
	strTxt += 'check1:' + check1 + '\n';

	var check2 = options['check2'];
	strTxt += 'check2:' + check2 + '\n';

	var check3 = options['check3'];
	strTxt += 'check3:' + check3 + '\n';

	var radio1 = options['radio1'];
	if(radio1 == 'true') strTxt += 'radio1:on\n';
	else  strTxt += 'radio1:off\n';

	var radio2 = options['radio2'];
	strTxt += 'radio2:' + radio2 + '\n';

	var textTest1 = options['textTest1'];
	strTxt += 'textTest1:' + textTest1 + '\n';

	var textarea = options['textarea'];
	textarea = textarea.split('\n');
	for(var i=0,j=textarea.length;i<j;i++){
		strTxt += 'textarea[' + i + ']:' + textarea[i] + '\n';
	}

	var expand = function(text){
		var obj = eval(text);
		for(var i=0,j=obj.length;i<j;i++){
			var objTemp = obj[i];
			for(var x=0,y=objTemp.length;x<y;x++){
				strTxt += text + '[' + i + '][' + x + ']:' + objTemp[x] + '\n';
			}
		}
	};

	var textTest3_multiple1 = options['textTest3_multiple1'];
	expand('textTest3_multiple1');


	var textTest3_3_multiple1 =  options['textTest3_3_multiple1'];
	expand('textTest3_3_multiple1');

	var textTest4_multiple2 = options['textTest4_multiple2'];
	expand('textTest4_multiple2');


	var textTest5_multiple3 = options['textTest5_multiple3'];
	expand('textTest5_multiple3');

	var textTest5_5_multiple3 = options['textTest5_5_multiple3'];
	expand('textTest5_5_multiple3');

	var select = options['select'];
	strTxt += 'select:' + select + '\n';

	var select2 = options['select2'];
	strTxt += 'select2:' + select2 + '\n';

	var select3 = JSON.parse(options['select3']);
	for(var key in select3){
		strTxt += 'select3:' + key + '\n';
	}

	alert(strTxt);


	//make OpenButton(sample)
	var openButton = document.createElement('button');
	openButton.id = 'openButton';
	openButton.innerHTML = 'click here!(open GM_option)';
	openButton.style = 'position:fixed;top:0;left:0;right:0;bottom:0;margin:auto; height:100px;';
	document.body.appendChild(openButton);
	
	var openConfig = function(){
		GM_option.open(strHeader,strHTML);
	}
	openButton.addEventListener('click', openConfig,false);

	window.addEventListener('beforeunload', function() {
		window.removeEventListener("beforeunload", arguments.callee,false);
		openButton.removeEventListener('click',openConfig,false);
		userConfig = null;
	},false);
}

//optional messages
var msgArray = {
	'save':'save?(ok:reload)',
	'reset':'discard changes?(load savedata)',
	'clear':'delete your settings?(ok:reload)',
	'delete':'delete this line?(Don\'t forget to save.)',
};
window.addEventListener('GM_option_loaded',userConfig,false);	//userFunction
GM_option.open(strHeader,strHTML,msgArray);	//load

//script menu
GM_registerMenuCommand('Open GM_option',function(){
	GM_option.open(strHeader,strHTML,msgArray);
});



window.addEventListener('beforeunload', function() {
	window.removeEventListener("beforeunload", arguments.callee,false);
	window.removeEventListener('GM_option_loaded',userConfig,false);
},false);



*********************************************************************************************************************/