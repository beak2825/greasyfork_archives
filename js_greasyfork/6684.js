// ==UserScript==
// @name          Share The Love Checker
// @description   Find out in a single click who needs to be loved.
// @version       1.7
// @author        Klimtog
// @include       *127.0.0.1:*/searchplayer.php*
// @include       *kingdomofloathing.com/searchplayer.php*
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @require 	  https://greasyfork.org/scripts/5233-jquery-cookie-plugin/code/jQuery_Cookie_Plugin.js?version=18550
// @namespace 	  https://greasyfork.org/users/3824
// @downloadURL https://update.greasyfork.org/scripts/6684/Share%20The%20Love%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/6684/Share%20The%20Love%20Checker.meta.js
// ==/UserScript==
(function(s){var t=function(t,i){var h={action:"start"};this.options=s.extend(h,i),this.$el=s(t),this.secsNum=0,this.minsNum=0,this.hrsNum=0,this.secsStr="00",this.minsStr="00",this.hrsStr="00",this.timerId=null,this.delay=1e3,this.isTimerRunning=!1,void 0!==this.options.seconds&&(this.hrsNum=Math.floor(this.options.seconds/3600),this.minsNum=Math.floor((this.options.seconds-3600*this.hrsNum)/60),this.secsNum=this.options.seconds-3600*this.hrsNum-60*this.minsNum,this.timeToString())};t.prototype.init=function(){switch(this.options.action){case"start":this.isTimerRunning||this.startTimer();break;case"pause":this.pauseTimer();break;case"resume":this.isTimerRunning||this.startTimerInterval();break;case"reset":this.secsNum=0,this.minsNum=0,this.hrsNum=0;break;case"get_seconds":return 3600*this.hrsNum+60*this.minsNum+this.secsNum-1}},t.prototype.pauseTimer=function(){clearInterval(this.timerId),this.isTimerRunning=!1},t.prototype.startTimer=function(){this.updateTimerDisplay(),this.incrementTime(),this.startTimerInterval()},t.prototype.startTimerInterval=function(){var s=this;this.timerId=setInterval(function(){s.incrementTime()},this.delay),this.isTimerRunning=!0},t.prototype.updateTimerDisplay=function(){this.hrsNum>0&&(this.options.showHours=!0),this.options.showHours?this.$el.html(this.hrsStr+":"+this.minsStr+":"+this.secsStr):this.$el.html(this.minsStr+":"+this.secsStr)},t.prototype.timeToString=function(){this.secsStr=10>this.secsNum?"0"+this.secsNum:this.secsNum,this.minsStr=10>this.minsNum?"0"+this.minsNum:this.minsNum,this.hrsStr=10>this.hrsNum?"0"+this.hrsNum:this.hrsNum},t.prototype.incrementTime=function(){this.timeToString(),this.updateTimerDisplay(),this.secsNum++,0==this.secsNum%60&&(this.minsNum++,this.secsNum=0),this.minsNum>59&&0==this.minsNum%60&&(this.hrsNum++,this.minsNum=0)};var i="timer";s.fn[i]=function(s){"string"==typeof s&&(s={action:s}),this.data("plugin_"+i)instanceof t||this.data("plugin_"+i,new t(this,s));var h=this.data("plugin_"+i);return h.options.action=s.action,h.init(),this}})(jQuery);

(function(t){t.tinyTimer=function(e){var n,a=this,i=(a.options=e).element,o=new Date(e.from||e.to).getTime(),r=!!e.from||-1,u=Math,s=function(){};a.interval=setInterval(n=function(){if(!a.paused){var n=u.max(u.round((Date.now()-o)*r/1e3),0),l={S:n,s:n%60,M:u.floor(n/=60),H:u.floor(n/=60),D:u.floor(n/=24)};l.m=l.M%60,l.h=l.H%24,l.d=l.D,l.text=(e.format||"%-H{:}%0m:%0s").replace(/%(-?)(0?)([dhms])(\s*)(?:\{(.+?)\})?/gi,e.replacer||function(t,e,n,a,i,o){var r=l[a];return(o=(o||"").split("|"))[2]=o[2]||(o[1]=o[1]||o[0]),!r&&e?"":(r>9?"":n)+r+i+o[+(1!=r)+(1!=r&&(2>r%10||r%10>4)||r>10&&20>r)]}),i?t(i).html(l.text):i=a,(e.onTick||s).call(i,a.val=l),0>r&&!n&&(clearInterval(a.interval),(e.onEnd||s).call(i,l))}},1e3),n(),a.pause=a.stop=function(){a.paused=Date.now()},a.resume=function(){o-=(a.paused-Date.now())*r,a.paused=0},a.start=function(){a.paused=0}},t.fn.tinyTimer=function(e){return this.each(function(){t(this).data("tinyTimer",new t.tinyTimer(t.extend(e,{element:t(this)})))})}})(jQuery);

function getRecordTable(e)
{
	var tables=e.getElementsByTagName('table'),l=tables.length;
	for(var i=0;i<l;i++)
	{
		try{
		if(tables[i].rows[0].cells[0].firstChild.data=='Who')return tables[i];
		}catch(E){}
	}
	return {};
}


function makeRequest(method,url,callback)
{
	var x=new XMLHttpRequest();
	x.open('GET','/peevpee.php?place=logs&mevs=1&oldseason=0');
	x.onreadystatechange=function()
	{
		if(x.readyState!=4)return;
		callback(x);
	}
	x.send(null);
}


function lrtrim(str)
{
	return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

var crushedPlayerIdsList={};

function parseTable(tbl)
{
	var l=tbl.rows.length;
	for(var i=1;i<l;i++)
	{
		var anchors=tbl.rows[i].cells[0].getElementsByTagName('a');
		if(!anchors.length)continue;
		var playerId=anchors[0].getAttribute('href').match(/who=(\d+)/)[1];
		//var playerName=lrtrim(tbl.rows[i].cells[0].firstChild.data||"");
		var offensiveWins=tbl.rows[i].cells[2].firstChild.data.match(/^(\d+)/)[1];
		offensiveWins = parseInt(offensiveWins);
		if(offensiveWins>0){
			crushedPlayerIdsList[playerId]=playerId;
		}
	}
	crushedPlayerIdsList[yourId]=yourId;
}

function getPlayerDataTable()
{
	var tables=unsafeWindow.document.getElementsByTagName('table'),l=tables.length;
	for(var i=0;i<l;i++)
	{
		if(tables[i].rows[0].cells[0].innerHTML=='<b><u>Name</u></b>')return tables[i];
	}
	return {};
}

var peopleLeft = 0;
var peopleTotal = 0;

function highlightTable(tbl)
{
	var l=tbl.rows.length;
	peopleLeft = 0;
	peopleTotal = 0;
	for(var i=1;i<l;i++)
	{
		peopleTotal+=1;
		if(typeof crushedPlayerIdsList[tbl.rows[i].cells[1].firstChild.data]!='undefined') {
			tbl.rows[i].style.backgroundColor="red";
		} else {
			peopleLeft+=1;
		}
	}
}

$(document).ready(function() {
	
	$.get('charsheet.php', function (data) {
		idLink = data.split("showplayer.php?who=");
		idLink = idLink[1].split('">');
		yourId = parseInt(idLink[0]);
	});
	
	var alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
	$('form[action="searchplayer.php"]').parent().prepend('<div id="stlplayersearch"><center style="display: none;" id="stlsearching">Searching...</center><center id="stlcenter"><a id="klimtogstl" style="cursor:pointer;text-decoration:underline;color: blue;">who have I not loved</a><br />HC: <input type="checkbox" name="stlcheck" id="stlcheck" /><p id="lastSearched" style="font-size: 10px;"></p></center></div><center><p id="hidelove" style="cursor: pointer; display: none; font-size: 10px; color: blue; text-decoration: underline;">hide/show people you have loved<span class="sharenumber"></span></p></center>');
	
	$('#hidelove').click(function(){
		$('tr[style*="red"]').toggle();
	});
	
	if($.cookie('lastSearch')){
		var lastSearch = new Date($.cookie('lastSearch'));
		$('#lastSearched').html('<span id="lastSearch"></span> since your last search');
		$('#lastSearch').tinyTimer({ from: lastSearch, format: '%H:%0m:%0s' });
	}
	
	var firstloop = 0;
	
	$('#klimtogstl').click(function(){
		if ($('#stlcheck').is(':checked')) {
			$('input[name="hardcoreonly"]').val(1);
		} else {
			$('input[name="hardcoreonly"]').val(2);	
		}
		$('input[name="pvponly"]').prop('checked', true);
		$('input[name="startswith"]').val(1);
		$('#stlcenter').toggle();
		$('#stlsearching').toggle();
		$('#hidelove').hide();
		for (var i = 0; i < alphabet.length; i++) {
			$('input[name="searchstring"]').val(alphabet[i]);
			var looped = 0;
			var wholeTable = "";
			$.ajax({
				type: 'POST',
				url:  'searchplayer.php',
				data: $('form').serialize(),
				dataType: 'html',
				success: function(html) {
					looped = looped+1;
					table1 = html.split('<u>Fame</u></b></td></tr>');
					if(table1.length == 1) {
						table1[1] = "Nothing</table>";
					}
					table2 = table1[1].split('</table>');
					wholeTable = wholeTable + table2[0];
					if(looped==26){
						if(firstloop==0){
							$('form[action="searchplayer.php"]').prepend('<div id="stlcontainer"></div>');
							firstloop += 1;
						}
						$('#stlcontainer').html('');
						$('#stlcontainer').prepend('<table id="psearch" align=center><tr><td class=small><b><u>Name</u></b></td><td class=small><b><u>PlayerID</u></b></td><td class=small><b><u>Level</u></b></td><td class=small><b><u>Class</u></b></td><td class=small><b><u>Fame</u></b></td></tr>');
						$('#hidelove').show();
						$('#psearch').append(wholeTable);
						$('#psearch').append('</table>');
						$('#stlcenter').toggle();
						$('#stlsearching').toggle();
						var tbl1=getPlayerDataTable();
						if(tbl1.rows&&tbl1.rows.length>1) {
							makeRequest('GET','/peevpee.php?place=logs&mevs=1&oldseason=0',
							function(x){
								var d=document.createElement('div');
								d.innerHTML=x.responseText;
								parseTable(getRecordTable(d));
								highlightTable(tbl1);
								$('.sharenumber').html(' - ' + peopleLeft + ' people left ('+ peopleTotal +' total)');
								currentDate = new Date();
								$.cookie('lastSearch', currentDate, { expires: 7 });
								lastSearch = currentDate;
								$('#lastSearch').remove();
								$('#lastSearched').html('<span id="lastSearch"></span> since your last search');
								$('#lastSearch').tinyTimer({ from: lastSearch, format: '%H:%0m:%0s' });
							});
						}
					}
				}
			});
		}
	});
});