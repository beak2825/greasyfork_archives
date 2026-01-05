// ==UserScript==
// @name        balabol
// @namespace   blbl
// @include     http://chat.sc2tv.ru/index.htm
// @version     2.02
// @grant       GM_xmlhttpRequest
// @run-at      document-start
// @description sc2tv
// @downloadURL https://update.greasyfork.org/scripts/9728/balabol.user.js
// @updateURL https://update.greasyfork.org/scripts/9728/balabol.meta.js
// ==/UserScript==
window.stop();
var D=document;D.querySelector('html').appendChild(D.createElement('body')),div=D.createElement('DIV');
D.body.style.fontFamily='Verdana';

//Замените channelId и chatNickname!
var	refreshTime	        =	5000,		//интервал обновления чата
		min_length		=	4,				//минимальная длина сообщения
		max_length_t	=	50,		//максимальная длина сообщения для перевода
		max_length_s	=	250,		//максимальная длина сообщения
		channelId		=	0,		//id канала на ск2тв
		chatNickname	=	'Adolf[RA]';

var replace=[
//[ что заменить , на что заменить ],
['ё' 			,	'йо'],
['адольф'		,	'руслан'],
['\\.' 			,	'точка'],
['"' 			,	''],
['[+]' 			,	'плюс'],
//смайлы
[':s:peka:' 	,	'пека'],
[':s:five:'		,	'пятюня'],
[':s:omsk:'		,	'омск'],
[':s:joyful:'	,	'хехе'],
[':s:ziga:'		,	'зига']
//после последней замены запятой быть не должно
],

//выражения
expression={
	'welcome'      :	'Здравствуйте, пекаребята',
	'forStreamer'  :	' говорит стримеру ',
	'forUser'      :	' говорит для ',
	'regular'      :	' говорит ',
	'en'           :	' say ',	//фраза для английского перевода
	'fr'           :	' dit ',	//фраза для французского перервода
	'de'           :	' sagt ',	//фраза для немецкого перервода
	'it'           :	' parla '	//фраза для итальянского перервода
},

//команды (вводятся в чате через -, пример "-ди привет")
command={
	'me'	:    'он',
	'en'	:    'сэй',
	'fr'	:    'ди',
	'de'	:    'загт',
	'it'	:    'парла'
},

//список игнорируемых ников. пример: ignor=['Nick1','Nick2','Nick3'],
ignor=[],

replace_length=replace.length;
for(let x=0;x<replace_length;x++)replace[x][0]=new RegExp(replace[x][0],'gi');
for(let x in command)command[x]={'t':new RegExp('^-'+command[x]+' .*'),'m':new RegExp('^-'+command[x]+' (.*)')};

var users={},cid=0,csrfield,cookie,languageId={'ru':43,'en':8,'fr':22,'de':21,'it':38},regexp=[/^\[b\].*?\[\/b\]/,/\[b\](.*?)\[\/b\]/,/(?=(.))\1{4,}/,/^<span class="red" title="(.*?)">.*?<\/span>$/,/\[b\](.*?)\[\/b\],/g,/\[url\](.*?)\[\/url\]/g,/:s:.*?:/g,/[^а-яa-z0-9-+\s]/gi,/audioUpdate\('(.*?)'\)/];
GM_xmlhttpRequest({method:'GET',url:'http://www.ivona.com/',onload:function(requ){
	var a=requ.responseHeaders.match(/Set-Cookie:(?:.|\s)*?HttpOnly/g),b,c;
	if(a!==null)a=a[0];else{alert('Ошибка (0)');return}
	b=a.match(/session-id=(.*?);/);
	c=a.match(/session-id-time=(.*?);/);
	if(b===null||c===null){alert('Ошибка (1). Удалите в браузере куки сайта ivona.com');return}
	cookie=b[0]+' '+c[0]+' LOCALE=en;';
	csrfield=requ.responseText.match(/<input  id='VoiceTesterForm_csrfield' name='csrfield' type='hidden' value="(.*?)"/);
	if(csrfield!==null)csrfield=csrfield[1];else{alert('Ошибка (2)');return}
	say(replacer(expression.welcome),'ru');
}});

setInterval(function(){GM_xmlhttpRequest({method:'GET',url:'http://chat.sc2tv.ru/memfs/channel-'+channelId+'.json',onload:function(requ){try{
	if(requ.statusText==='Not Found'||requ.responseText==='')return;
	var resp=JSON.parse(requ.responseText).messages;
	if(cid===0){cid=parseInt(resp[0].id);return}
	for(let x=0,l=resp.length;x<l;x++){
		if(cid>=parseInt(resp[x].id)){resp.length=x;break}
	}
	if(resp.length===0)return;
	var respl=resp.length,res=resp[0].date+'<br>';
	cid=parseInt(resp[0].id);
	for(let x=0;x<respl;x++){
		if(!users.hasOwnProperty(resp[x].name))users[resp[x].name]=0;
		resp[x].status='';
		resp[x].prio=users[resp[x].name];
	}
	resp.sort(function(a,b){return a.prio-b.prio});
	for(let x=0,text,dlg;x<respl;x++){
		if(ignor.indexOf(resp[x].name)!==-1)continue;//игнорирование
		text=resp[x].message;
		if(regexp[0].test(text)){//обращение к другому
			let gld=text.match(regexp[1])[1];
			if(gld===chatNickname)dlg=expression.forStreamer;else dlg=expression.forUser+gld+' ';
		}
		else if(command.me.t.test(text)){//фраза от 3-го лица
			text=text.match(command.me.m)[1];
			dlg=' ';
		}
		else if(inno(text,resp[x])){//перевод?
			break;
		}
		else dlg=expression.regular;//иначе обычная фраза
		
		text=clear(replacer(text));
		if(text===false){resp[x].status='пропущен';continue}
		if(text.length<min_length||text.length>max_length_s){resp[x].status='пропущен';continue}
		say(resp[x].name+dlg+text,'ru',resp[x].name);resp[x].status='прочитан';
		break;
	}
	for(var x=0;x<respl;x++)res+=resp[x].name+' : '+users[resp[x].name]+' | <i>'+resp[x].status+'</i><br>';
	div.innerHTML=res;
}catch(e){console.log('sc2tv',e)}}})},refreshTime);

function inno(text,resp){
	for(var x in command){
		if(x==='me')continue;
		if(command[x].t.test(text)){
			if(!say2(x,text,resp.name)){resp.status='пропущен';continue}
			resp.status='прочитан c переводом';
			return true
		}
	}
	return false
}
function replacer(s){
	for(var x=0;x<replace_length;x++)s=s.replace(replace[x][0],replace[x][1]);
	return s;
}
function clear(s){
	s=s.replace(regexp[2],'$1').replace(regexp[3],'$1').replace(regexp[4],'').replace(regexp[5],'').replace(regexp[6],'').replace(regexp[7],'');
	var z=s.replace(' ',''),l=z.length,p=0;
	for(let x=0,w={};x<l;x++){
		if(!w.hasOwnProperty(z[x])){w[z[x]]='';p++}
	}
	if(l/p>5)return false;
	s=s.split(' ');
	for(let x=s.length,y,w;--x>-1;){
		l=s[x].length;
		if(l>30)return false;
		for(w={},p=0,y=0;y<l;y++){
			if(!w.hasOwnProperty(s[x][y])){w[s[x][y]]='';p++}
		}
		if(l/p>5)return false;
	}
	return s.join(' ');
}
function say(s,t,n){
	t=languageId[t];
	if(n!==undefined)users[n]++;
	GM_xmlhttpRequest({method:'POST',url:'http://www.ivona.com/let-it-speak/?setLang=en',data:'ext=mp3&voiceSelector='+t+'&text='+s+'&send=Go&csrfield='+csrfield+'&ref-form-name=VoiceTesterForm',headers:{'Host':'www.ivona.com','User-agent':'Mozilla/5.0 (Windows NT 5.1; rv:32.0) Gecko/20100101 Firefox/32.0','Accept':'*/*','Accept-Language':'ru-RU,ru;q=0.8,en-US;q=0.5,en;q=0.3','Accept-Encoding':'gzip, deflate','Content-Type':'application/x-www-form-urlencoded; charset=UTF-8','X-Requested-With':'XMLHttpRequest','Referer':'http://www.ivona.com/','Cookie':cookie,'Connection':'keep-alive','Pragma':'no-cache','Cache-Control':'no-cache'},onload:function(requ){try{
		var aa=requ.responseText.match(regexp[8]);
		if(aa!==null){var au=new Audio();au.src=aa[1];au.play()}else console.log('Ошибка (3)');
	}catch(e){console.log('ivona',e)}}});
}
function say2(l,t,n){
	t=clear(t.match(command[l].m)[1]);
	if(t===false)return false;
	if(t.length<min_length||t.length>max_length_t)return false;
	
	(function(n,t){
		GM_xmlhttpRequest({method:'GET',url:'https://translate.google.ru/translate_a/single?client=t&sl=ru&tl='+l+'&hl=ru&dt=t&ie=UTF-8&oe=UTF-8&q='+t,onload:function(requ2){try{
			say(n+expression[l]+JSON.parse(requ2.responseText.replace(/,,,/g,',').replace(/,,/g,',').replace(/\[,/g,'['))[0][0][0],l,n);
		}catch(e){console.log('google '+l,e)}}});
	})(n,t);
	return true
}
D.body.appendChild(div);