// ==UserScript==
// @name		 Duolingo Language Switcher
// @namespace	 https://www.duolingo.com/derevnia
// @version		 1.1
// @description  Сhange the letters in your preferred language(ru+en) on duolingo.com 
// @include		 https://www.duolingo.com/*
// @author		 derevnia
// @grant		 none
// @downloadURL https://update.greasyfork.org/scripts/9573/Duolingo%20Language%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/9573/Duolingo%20Language%20Switcher.meta.js
// ==/UserScript==
$(document).ready(function(){
var d=[{code:'en',chars:'`qwertyuiop[]asdfghjkl;\'zxcvbnm,.~QWERTYUIOP{}ASDFGHJKL:"ZXCVBNM<>'},{code:'ru',chars:'ёйцукенгшщзхъфывапролджэячсмитьбюЁЙЦУКЕНГШЩЗХЪФЫВАПРОЛДЖЭЯЧСМИТЬБЮ'}];
var f=function(a,b){
var c;for(var i=0;i<d.length;i++){
if(d[i].code===a){c=d[i];break}}
if(c===null)return true;for(i=0;i<b.length;i++){if(c.chars.indexOf(b[i])==-1){return false}}return true};
$(document).keyup(function(e){
function getCaret(el){if(el.selectionStart){return el.selectionStart}else if(document.selection){el.focus();var r=document.selection.createRange();if(r===null){return 0}var re=el.createTextRange(),rc=re.duplicate();re.moveToBookmark(r.getBookmark());rc.setEndPoint('EndToStart',re);return rc.text.length}return 0}function setSelectionRange(input,selectionStart,selectionEnd){if(input.setSelectionRange){input.focus();input.setSelectionRange(selectionStart,selectionEnd)}else if(input.createTextRange){var range=input.createTextRange();range.collapse(true);range.moveEnd('character',selectionEnd);range.moveStart('character',selectionStart);range.select()}}
var x1=document.getElementById('text-input');
var x2=document.getElementById('word-input');
var a=$('#text-input,#word-input');
if(x1){q1=getCaret(x1)}
if(x2){q2=getCaret(x2);if(typeof(a.attr('lang'))=='undefined'){x2.setAttribute('lang','en')}}
if(a.is(':focus')){
if(!f(a.attr('lang'),a.val()))
{if(a.attr('lang')=='ru'){
var g={'`':'ё','q':'й','w':'ц','e':'у','r':'к','t':'е','y':'н','u':'г','i':'ш','o':'щ','p':'з','[':'х',']':'ъ','a':'ф','s':'ы','d':'в','f':'а','g':'п','h':'р','j':'о','k':'л','l':'д',';':'ж','\'':'э','z':'я','x':'ч','c':'с','v':'м','b':'и','n':'т','m':'ь','\,':'б','.':'ю','~':'Ё','Q':'Й','W':'Ц','E':'У','R':'К','T':'Е','Y':'Н','U':'Г','I':'Ш','O':'Щ','P':'З','{':'Х','}':'Ъ','A':'Ф','S':'Ы','D':'В','F':'А','G':'П','H':'Р','J':'О','K':'Л','L':'Д',':':'Ж','"':'Э','Z':'Я','X':'ч','C':'С','V':'М','B':'И','N':'Т','M':'Ь','<':'Б','>':'Ю'};
var b=a.val();var r='';for(var i=0;i<b.length;i++){r+=g[b.charAt(i)]||b.charAt(i)}a.val(r)}
else{
var j={'й':'q','ц':'w','у':'e','к':'r','е':'t','н':'y','г':'u','ш':'i','щ':'o','з':'p','х':'[','ъ':']','ф':'a','ы':'s','в':'d','а':'f','п':'g','р':'h','о':'j','л':'k','д':'l','ж':';','э':'\'','я':'z','ч':'x','с':'c','м':'v','и':'b','т':'n','ь':'m','б':',','ю':'.','Й':'Q','Ц':'W','У':'E','К':'R','Е':'T','Н':'Y','Г':'U','Ш':'I','Щ':'O','З':'P','Х':'{','Ъ':'}','Ф':'A','Ы':'S','В':'D','А':'F','П':'G','Р':'H','О':'J','Л':'K','Д':'L','Ж':':','Э':'"','Я':'Z','Ч':'X','С':'C','М':'V','И':'B','Т':'N','Ь':'M','Б':'<','Ю':'>'};
var k=a.val();
var s='';for(var p=0;p<k.length;p++){s+=j[k.charAt(p)]||k.charAt(p)}a.val(s)}
if (x1){function setCaretToPos(input,pos){setSelectionRange(input,pos,pos)}setCaretToPos(x1,q1);}
if (x2){function setCaretToPos(input,pos){setSelectionRange(input,pos,pos)}setCaretToPos(x2,q2);}
}}})});