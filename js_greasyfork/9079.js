// ==UserScript==
// @name			Timeliner
// @namespace		http://www.lukanovak.si/userscripts
// @version			1.3.2
// @copyright		Luka Novak
// @description		Script that generates the timeline for Blogger
// @author			Luka Novak
// @icon			http://are4s.com/images/icons/blogger_logo.gif
// @include			*www.blogger.com*
// @exclude			*choose-gadget*
// @exclude			*rearrange*
// @exclude			*change-favicon*
// @downloadURL https://update.greasyfork.org/scripts/9079/Timeliner.user.js
// @updateURL https://update.greasyfork.org/scripts/9079/Timeliner.meta.js
// ==/UserScript==

if (window.top != window.self)  //don't run on frames or iframes
{
    //Optional: GM_log ('In frame');
    return;
}

function setCookie(c_name,value,exdays) {
	var exdate=new Date();
	exdate.setDate(exdate.getDate() + exdays);
	var c_value=value + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
	document.cookie=c_name + "=" + c_value;
	return false;
};

function getCookie(c_name) {
	var i,x,y,ARRcookies = document.cookie.split(";");
	for (i = 0; i < ARRcookies.length; i++) {
		x = ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
		y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
		x = x.replace(/^\s+|\s+$/g,"");
		if (x == c_name)
			return y;
	}
	return false;
};

function getYear(arr,i){
	var matches = /[/][0-9]{4}[/]/.exec(arr[i]);
	var m=matches[0].substring(1,matches[0].length-1);
	return m;
}

function getMonth(arr,i){
	var matches = /[/][0-9]{2}[/]/.exec(arr[i]);
	var m=matches[0].substring(1,matches[0].length-1);
	if(m.charAt(0)=="0"){
		m=m.substring(1);
	}
	return m;
}

function printMonth(arr,i){
	if(document.getElementById('combo').value=="slo"){
		var monthsslo=["Januar","Februar","Marec","April","Maj","Junij","Julij","Avgust","September","Oktober","November","December"];	
		return monthsslo[getMonth(arr,i)-1];
	}
	else if(document.getElementById('combo').value=="eng"){
		var monthseng=["January","February","March","April","May","June","July","August","September","October","November","December"];
		return monthseng[getMonth(arr,i)-1];
	}
	else if(document.getElementById('combo').value=="ger"){
		var monthsger=["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];
		return monthsger[getMonth(arr,i)-1];
	}
		else if(document.getElementById('combo').value=="esp"){
		var monthsesp=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
		return monthsesp[getMonth(arr,i)-1];
	}
		else if(document.getElementById('combo').value=="fre"){
		var monthsfre=["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
		return monthsfre[getMonth(arr,i)-1];
	}
		else if(document.getElementById('combo').value=="dut"){
		var monthsdut=["Januari","Februari","Maart","April","Mei","Juni","Juli","Augustus","September","October","November","December"];
		return monthsdut[getMonth(arr,i)-1];
	}
}
function printYear(arr,i){
	if(document.getElementById('combo').value=="slo"){
		return "Leto "+getYear(arr,i);
	}
	else if(document.getElementById('combo').value=="eng"){
		return "Year " +getYear(arr,i);
	}
	else if(document.getElementById('combo').value=="ger"){
		return "Jahr " +getYear(arr,i);
	}
	else if(document.getElementById('combo').value=="esp"){
		return "Año " +getYear(arr,i);
	}
	else if(document.getElementById('combo').value=="fre"){
		return "Année " +getYear(arr,i);
	}
	else if(document.getElementById('combo').value=="dut"){
		return "Jaar " +getYear(arr,i);
	}	
}

function save(urls,titles){
	if(window.location.href.indexOf('publishedposts')<0){
		alert("Error: You are on the wrong site. Please click \"Posts\" on the left and then click \"Published\". Not \"All\", but \"PUBLISHED\"!\n\n(Thant's because we want no drafts in the timeline).\n\nThanks.");
	}
	else{
	
	outer=document.getElementsByClassName('blogg-visible-on-select');
	for(j=0;j<outer.length;j++){
		inner=outer[j].getElementsByTagName('a');
		for(i=0;i<inner.length;i++){
		  if(inner[i].getAttribute('href')!=null&&inner[i].getAttribute('href').indexOf('blogspot')>=0){
			urls[urls.length]=inner[i].getAttribute('href');
		  }
		}
	}
	
	prepare=document.getElementsByTagName('a');
	for(j=0;j<prepare.length;j++){
		if(prepare[j].getAttribute('href')!=null && prepare[j].getAttribute('href').indexOf('postNum')>=0 && prepare[j].getAttribute('href').indexOf('src=postname')>=0){
		titles[titles.length]=prepare[j].innerHTML;
		}
	  }
		alert("Links saved: "+titles.length);

	}
}
function generate(urls,titles){
	var linesIn=new Array();
	var lines=new Array();

	for(i=0;i<urls.length;i++){
		linesIn[i]="<a href=\""+urls[i]+"\">"+titles[i]+"</a>"+"<br>";
	}

	for(i=linesIn.length-1;i>=0;i--){
		lines[lines.length]=linesIn[i];
	}	

	output="";	

	output+="<h3><u>"+printYear(lines,0)+"</u></h3><br>";	
	output+="<h3>"+printMonth(lines,0)+" "+getYear(lines,0)+"</h3><br>";	
	output+=lines[0];
	
	for(i=1;i<lines.length;i++){
		if(getMonth(lines,i)!=getMonth(lines,i-1)){
			if(getYear(lines,i)!=getYear(lines,i-1)){
				output+="<br><h3><u>"+printYear(lines,i)+"</u></h3>";	
			}
			output+="<br><h3>"+printMonth(lines,i)+" "+getYear(lines,i)+"</h3><br>";
		}
		output+=lines[i];
	}

	document.getElementById('ta').value=output;
}

body=document.body;

div = document.createElement("div");
	div.setAttribute('id','thegui');
	div.style.position = "fixed";
	div.style.display = "block";
	div.style.width = "175px";
	div.style.opacity= 0.9;
	div.style.zIndex = 999998;
	div.style.bottom = "+20px";
	div.style.right = "+20px";
	div.style.backgroundColor = "white";
	div.style.border = "2px solid grey";
	div.style.padding = "10px";
	div.style.fontSize = "medium";
	div.innerHTML = '<table><tr><td><p><img src="http://findicons.com/files/icons/2155/social_media_bookmark/32/blogger.png"><b><span style="font-size:large"> Timeliner</span></b> <span style="font-size:small">1.3.2</span><p></td></tr></table><br>';
	div.innerHTML += ' 1. <button id="begin">Begin</button><br><br> 2. <button id="save">Save links</button><br><br>';
	div.innerHTML += ' 3. Output language:<br>';
	div.innerHTML += '&nbsp;&nbsp;&nbsp;&nbsp;<select id="combo" style="font-size:medium"><option value="eng">English</option><option value="slo">Slovene</option><option value="ger">German</option><option value="esp">Spanish</option><option value="fre">French</option><option value="dut">Dutch</option></select><br><br>';
	
	div.innerHTML += ' 4. <button id="generate">Generate</button>';
	div.innerHTML += '<br><br>Output code: <br>';
	div.innerHTML += '<textarea style="width:95%" id="ta"></textarea>';
	body.appendChild(div);

var titles=new Array();
var urls=new Array();

if(getCookie("prepare")==false || getCookie("prepare")=="0"){
	document.getElementById('begin').disabled=false;
	document.getElementById('save').disabled=true;
	document.getElementById('generate').disabled=true;
}
else if(getCookie('prepare')=="1"){
	document.getElementById('begin').disabled=true;
	document.getElementById('save').disabled=false;
	document.getElementById('generate').disabled=false;
	setTimeout(function(){alert("The pages are prepared, you can start saving the links.")},5000);
	setCookie("prepare","0",365);
}

//events
document.getElementById('save').onclick = function () {
    save(urls,titles);
}

document.getElementById('generate').onclick = function () {
    generate(urls,titles);
	document.getElementById('begin').disabled=false;
	document.getElementById('save').disabled=true;
	document.getElementById('generate').disabled=true;
}

document.getElementById('begin').onclick = function () {
	if(window.location.href.indexOf('publishedposts')<0){
		alert("Error: You are on the wrong site. Please click \"Posts\" on the left and then click \"Published\". Not \"All\", but \"PUBLISHED\"!\n\n(Thant's because we want no drafts in the timeline).\n\nThanks.");
	}
	else{
		setCookie("prepare","1",365);
		location.reload();
	}
}