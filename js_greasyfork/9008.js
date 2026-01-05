// ==UserScript==
// @name        내카체 Plus
// @namespace   http://www.litehell.info/
// @description 네이버 신-웹 카페채팅 스크립트 확장
// @include     https://chat.cafe.naver.com/room/*
// @include https://chat.cafe.naver.com/room/*
// @version     12.4
// @grant GM_getValue
// @grant GM_setValue
// @run-at 	document-end
// @downloadURL https://update.greasyfork.org/scripts/9008/%EB%82%B4%EC%B9%B4%EC%B2%B4%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/9008/%EB%82%B4%EC%B9%B4%EC%B2%B4%20Plus.meta.js
// ==/UserScript==

if(typeof unsafewindow === "undefined"){
	var unsafewindow = window; // Greasemonkey 감지
}

// APIs
var nccSendChat=function(msg){ // 체팅 보내기
	document.querySelector('textarea#msgInputArea').value=msg;
	document.querySelector('span.hit > button').click();
};
var nccNotification=function(title){ // 알람
	if(!("Notification" in window)){
		alert(title);
	}else if(Notification.permission==="granted"){
		var notif = new Notification(title);
	}else if (Notification.permission !== 'denied'){
		Notification.requestPermission(function(permission){
			if(permission==="granted"){
				var notif= new Notification(title);
			}
		});
	}
}
var nccModifiableMessage=function(msgsn){ // 메세지 편집
	// var i = new nccModifiableMessage(20989); i.SetMessage('ncc API 테스트'); i.SetSenderNickIfCan('Kogorian12');
	var __msgsn=msgsn;
	var qs='#boardBody.chat_msgs > div.msg[msgsn="'+__msgsn+'"]';
	this.SetMessage=function(msg){
		document.querySelector(qs+' > div.say > .bl_pcs > .blm > span').innerHTML=msg;
	}
	this.SetSenderNickIfCan=function(sid){
		if(document.querySelector(qs+' > div.say > p.name')==null) return;
		document.querySelector(qs+' > div.say > p.name').innerHTML=sid;
	}
	this.SetSenderThumbIfCan=function(imguri){
		if(document.querySelector(qs+' > a.thmb > img')==null) return;
		document.querySelector(qs+' > a.thmb > img').setAttribute('src',imguri);
	};
	this.RemoveMe=function(){
		// http://red-team-design.com/removing-an-element-with-plain-javascript-remove-method/
		var elem = document.querySelector(qs)
		elem.parentNode.removeChild(elem);
	}
}
var nccCreateMenu = function(menuname, func){ // 메뉴 생성
	var menuelem=document.querySelector('#roomOptions > .ly_cont > ul.menu'); // 기존 ... 메뉴
	var m=document.createElement('li'); // li 태그 생성
	var aa=document.createElement('a'); // a 태그 생성
	aa.innerHTML=menuname; // a 태그 텍스트 설정
	aa.onclick = func; // a 태그 클릭시 함수 설정
	aa.setAttribute('href','#');
	m.appendChild(aa); // li태그에 a태그 추가
	menuelem.appendChild(m); // ...메뉴에 li 태그 추가
}
// Event
function CEvent(){
	var funcs =[];
	this.addEventHandler = function(func){funcs.push(func);}
	this.removeEventHandler = function(func){funcs.splice(funcs.indexOf(func),1);};
	this.getEventHandlers=function(){return funcs;}
	this.raiseEvent=function(arg){for(var i=0;i<funcs.length;i++){funcs[i](arg);}};
}
// forEach 함수
var forEach=function(arr,func){
	for(var i=0;i<arr.length;i++){
		try{func(arr[i]);}catch(err){}
	}
}
// 메세지 불러오기
var getMessages = function(){
	return document.querySelectorAll('#boardBody.chat_msgs > div.msg');
}
var nccEventOnMessageCreated;
function LoopMsg(){
	var msgs = getMessages();
	forEach(msgs, function(element){
		var _msgsn=element.getAttribute('msgsn');
		if(unsafewindow.__MessagesRead.indexOf(_msgsn)!=-1) return;
		var nic=document.querySelector('#boardBody.chat_msgs > div.msg[msgsn="'+_msgsn+'"] > div.say > p.name');
		if(nic!=null){nic=nic.innerHTML}
			var Arg={
			msgsn:_msgsn,
			message:document.querySelector('#boardBody.chat_msgs > div.msg[msgsn="'+_msgsn+'"] > div.say > div.bl_pcs > div.blm > span').innerHTML,
			senderID:element.getAttribute('targetid'), // 자기가 쓴 글이면 null임.
			senderNick:nic, // 이거도
			IsMyMessage:element.getAttribute('targetid')==null
		};
		while(Arg.message.indexOf('&nbsp;')!=-1){Arg.message=Arg.message.replace('&nbsp;',' ');}
		while(Arg.message.indexOf('<br>')!=-1){Arg.message=Arg.message.replace('<br>',' ');}
		nccEventOnMessageCreated.raiseEvent(Arg);
		console.log('Pushed '+_msgsn);
		unsafewindow.__MessagesRead.push(_msgsn);
	}); // for each end
	
	setTimeout(LoopMsg,1000);
}
function HiddenNCCSettings(){
	// 간지나게 영어로 해봄.
	// 옛날 피쳐폰 0번 꾹 누르면 히든 메뉴 나오고 그랬는데 ㅎㅎ
	var i=prompt('Enter Service Code');
	switch(i){
		case "removeScript":
			GM_setValue('RecentScript','console.log("No Recent Script");');
			if(confirm('reload?')){
				location.reload();
			}
			break;
		case "appendScript":
			var s=prompt("Enter Script. what you entered will be below current script.")
			if(s!=null){
				GM_setValue('RecentScript',GM_getValue('RecentScript','')+"\n"+s);
			}
			if(confirm('reload?')){
				location.reload();
			}
			break;
		case "showScript":
			alert(GM_getValue('RecentScript','No Script'));
			break;
		default:
			alert('Sorry');
	}
}
function LoadScript(){
	try{
	eval(GM_getValue('RecentScript','console.log("No Recent Script!");'));
	console.log('Recent Script Loaded!');
	}catch(err){
		nccNotification('스크립트 로드 중 오류가 발생하였습니다.');
	}
}
function Main(){
	nccEventOnMessageCreated  = new CEvent();
	unsafewindow.__MessagesRead = [];
	LoadScript();
	
	// 기존에 있던 메세지들 추가
	forEach(getMessages(), function(element){
		unsafewindow.__MessagesRead.push(element.getAttribute('msgsn'));
	});

	// 메뉴 추가
	nccCreateMenu('스크립트 실행',function(){GM_setValue('RecentScript',prompt('실행할 스크립트를 입력해주세요.\n입력한 스크립트는 자동으로 기억되며, 후에 채팅창 접속시 자동으로 실행됩니다.'));LoadScript();});
	nccCreateMenu('Hidden NCC Settings',HiddenNCCSettings);

	// 루프 시작
	LoopMsg();
}
if(typeof(Storage) === "undefined"){
	// localStorage 사용 불가시 스크립트 중지
	alert('스크립트를 사용할 수 없습니다.\n최신 버전의 브라우저에서 사용 해 주세요.(Firefox/Chrome 권장)');
} else {
	// 스크립트 실행
	Main();
}