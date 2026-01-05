// ==UserScript==
// @name          RayFiller
// @namespace     absolut-fair.com
// @description   Helper für RayTime
// @include       https://rayteam.de/RayTIME/Work_time.aspx*
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js
// @version       2.0.2
// @downloadURL https://update.greasyfork.org/scripts/6216/RayFiller.user.js
// @updateURL https://update.greasyfork.org/scripts/6216/RayFiller.meta.js
// ==/UserScript==

var popupStatus=0;

$(document).ready(function () {
	initpop();

	if($("#ctl00_ContentPlaceHolder1_cmd_Edit").length || !$("#ctl00_ContentPlaceHolder1_cmd_Save").length) return console.log("need edit first");
	
	$("#ctl00_ContentPlaceHolder1_cmd_ShowProtocol").after('<input type="button" value="Filler" id="RayFiller" class="Button_80_Y">');
	$("#ctl00_ContentPlaceHolder1_cmd_ShowProtocol").after('<input type="button" value="Paster" id="RayPaster" class="Button_80_Y">');
	$("#RayFiller").click(function(e) {
		e.preventDefault();
		
		$(".table_R").each(function() {
			if($(".ddl_Time:eq(0)",this).val().length>0) return;
			
			$(".ddl_Time:eq(0)",this).val("00:00");
			$(".ddl_Time:eq(1)",this).val("00:00");
			$(".ddl_Minutes",this).val("0");
			$(".ddl_1:eq(2)",this).val("6bbdde0e-a645-493b-98d6-5c97a00c1468");
		});
	});
	
	$("#RayPaster").click(function(e) {
		e.preventDefault();
		openpop("Log-Daten eingeben",'<textarea id="raypaste_txt" placeholder="Timer-Daten einfügen..." style="width:100%; height:150px;"></textarea><br><br><input type="button" id="raypaste_sub" value="Absenden" style="float:right;">',1);
		$("#raypaste_sub").click(function() {
			disablePopup();
			var pasted = $("#raypaste_txt").val(),match,matches = {},regex = /(\d\d\.\d\d\.\d\d\d\d) (\d\d:\d\d:\d\d) - (?:.*?) => (\d\d:\d\d:\d\d)/g;
			while (match = regex.exec(pasted)) 
			{
                console.log(match);
				var donetime = match[3].split(":");
				donetime = parseInt(donetime[0]*60*60) + parseInt(donetime[1]*60) + parseInt(donetime[2]);
				donetime = Math.round( donetime/(15*60) ) * 15;
				
				var starttime = match[2].split(":");
				starttime = starttime[0]*60*60 + starttime[1]*60 + parseInt(starttime[2]);
				starttime = Math.round( starttime/(15*60) ) * 15 * 60;
				var starthour = Math.floor( starttime / (60*60) );
				var startminutes = Math.floor( (starttime - starthour*60*60) / 60 );
				
				if( match[1] in matches ) matches[match[1]][2] = parseInt(matches[match[1]][2]) + parseInt(donetime);
				else matches[match[1]] = [match[1].split("."), [pad(starthour,2),pad(startminutes,2)], donetime];
			}
			
			for(var key in matches)
			{
				var me = matches[key];
				//console.log(me);
				var old_date = new Date(me[0][2], me[0][1], me[0][0], me[1][0], me[1][1]);
				var end_time = newDate(old_date,me[2]);
				var start_time = me[1][0]+":"+me[1][1];
				console.log("date: "+old_date+" // begin: "+start_time+" // end: "+end_time);
				
				var found=0;
				$(".table_R, .table_G, .table_WE").each(function() {
					if( $(".lbl_Table",this).text() == key )
					{
						myparent = this;
						var selid = $(".ddl_1:eq(3)",myparent).attr("id");
						document.getElementById(selid).onchange = undefined;
						
						$(".ddl_Time:eq(0)",myparent).val(start_time);
						$(".ddl_Time:eq(1)",myparent).val(end_time);
						$(".ddl_Minutes",myparent).val("0");
						$(".ddl_1:eq(0)",myparent).val("02debec5-3519-49f7-9ab8-5692395245f1");
						$(".ddl_1:eq(1)",myparent).val("da9844c0-d21b-419e-ad0e-3b7b9a0a95d7");
						$(".ddl_1:eq(2)",myparent).val("3bf8b478-ec83-479f-bd02-91acb5bcec27");
						$(".ddl_1:eq(3)",myparent).val("cec4fe29-71b9-4ff9-842d-fe61017d41f2");
						$(".ddl_1:eq(4)",myparent).val("f4853b68-28c9-4d38-bbe6-4b2a34513890");
						$(".txt_1:eq(0)",myparent).val("0");
						
						found=1;
						return false;
					}
				});
				if(found == 0) alert("Datum "+old_date+" wurde nicht gefunden!");
			}
			
			//console.log(matches);
		});
	});
	
	$(".table_R, .table_G, .table_WE").each(function() {
		$(".Button_15_Edit",this).mousedown(function(event) {
			switch (event.which) {
				case 3:
				{
					event.preventDefault();
					var starttime = prompt("Startzeit (HH:MM","00:00");
					if(!starttime.length) return;
					var endtime = prompt("Endzeit (HH:MM)","00:00");
					if(!endtime.length) return;
					
					var myparent = $(this).closest("tr");
					
					var selid = $(".ddl_1:eq(3)",myparent).attr("id");
					document.getElementById(selid).onchange = undefined;
					
					$(".ddl_Time:eq(0)",myparent).val(starttime);
					$(".ddl_Time:eq(1)",myparent).val(endtime);
					$(".ddl_Minutes",myparent).val("0");
					$(".ddl_1:eq(0)",myparent).val("02debec5-3519-49f7-9ab8-5692395245f1");
					$(".ddl_1:eq(1)",myparent).val("da9844c0-d21b-419e-ad0e-3b7b9a0a95d7");
					$(".ddl_1:eq(2)",myparent).val("3bf8b478-ec83-479f-bd02-91acb5bcec27");
					$(".ddl_1:eq(3)",myparent).val("cec4fe29-71b9-4ff9-842d-fe61017d41f2");
					$(".ddl_1:eq(4)",myparent).val("f4853b68-28c9-4d38-bbe6-4b2a34513890");
					$(".txt_1:eq(0)",myparent).val("0");
					
					break;
				}
			}
		});
	});
});

function dateAdd(date, interval, units) 
{
	var ret = new Date(date);
	switch(interval.toLowerCase()) {
		case 'year'   :  ret.setFullYear(ret.getFullYear() + units);  break;
		case 'quarter':  ret.setMonth(ret.getMonth() + 3*units);  break;
		case 'month'  :  ret.setMonth(ret.getMonth() + units);  break;
		case 'week'   :  ret.setDate(ret.getDate() + 7*units);  break;
		case 'day'    :  ret.setDate(ret.getDate() + units);  break;
		case 'hour'   :  ret.setTime(ret.getTime() + units*3600000);  break;
		case 'minute' :  ret.setTime(ret.getTime() + units*60000);  break;
		case 'second' :  ret.setTime(ret.getTime() + units*1000);  break;
		default       :  ret = undefined;  break;
	}
	return ret;
}

function pad(num, size) 
{
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

function newDate(old_date,minutes)
{
	var ret = new Date(old_date);
	ret.setTime(ret.getTime() + minutes*60000);
	return pad(ret.getHours(),2)+":"+pad(ret.getMinutes(),2);
}

//#############################################################################################
//					Funktionen von andren Leuten (wenn auch editiert)...
//#############################################################################################

String.prototype.between = function(prefix, suffix) {
	s = this;
	var i = s.indexOf(prefix);
	if (i >= 0) {
	s = s.substring(i + prefix.length);
	}
	else {
	return '';
	}
	if (suffix) {
	i = s.indexOf(suffix);
	if (i >= 0) {
	s = s.substring(0, i);
	}
	else {
	return '';
	}
	}
	return s;
}

function openpop(titel,text,ishtml)
{
	$("#popupContact > h1").html(titel);
	if(ishtml) $("#contactArea").html(text);
	else $("#contactArea").text(text);
	$("img","#contactArea").attr({src:"",alt:"Bild"});
	centerPopup();
	loadPopup(); 
	
	$("#contactArea").find("textarea").focus().keypress(function (e) {
		if (e.which == 13) {
			$("#contactArea").find('input[type="submit"]').click();
		}
	});
}

function initpop()
{	
	GM_addStyle("#backgroundPopup{  \
display:none;  \
position:fixed;  \
_position:absolute;   \
height:500%;  \
width:500%;  \
top:-15px;  \
left:-15px;  \
background:#000000;  \
border:1px solid #cecece;  \
z-index:9998;  \
}  \
#popupContact{  \
display:none;  \
position:fixed;  \
_position:fixed;   \
min-width:408px;  \
max-width:80%; \
max-height:80%; \
background:#FFFFFF;  \
border:2px solid #cecece;  \
z-index:9999;  \
padding:12px;  \
font-size:13px;  \
}  \
#popupContact h1{  \
text-align:left;  \
color:#6FA5FD;  \
font-size:22px;  \
font-weight:700;  \
border-bottom:1px dotted #D3D3D3;  \
padding-bottom:2px;  \
margin-bottom:20px;  \
}  \
#popupContactClose{  \
font-size:14px;  \
line-height:14px;  \
right:6px;  \
top:4px;  \
position:absolute;  \
color:#6fa5fd;  \
font-weight:700;  \
display:block;  \
}  \
");

	$("body").before(''+
	'<div id="popupContact">  '+
    '    <a id="popupContactClose">x</a> '+ 
    '    <h1></h1>  '+
    '    <p id="contactArea">  '+
    '    </p>  '+
    '</div> '+
	'<div id="backgroundPopup"></div>');
	
	$("#popupContactClose").click(function() {  
		disablePopup();  
	});  
	
	$("#backgroundPopup").click(function() {  
		disablePopup();  
	});  
	
	$(document).keypress(function(e) {  
		if(e.keyCode==27 && popupStatus==1)
		{  
			disablePopup();  
		}  
	});
}

function loadPopup()
{  
	if(popupStatus==0)
	{  
		$("#backgroundPopup").css({  
			"opacity": "0.7"  
		});  
		$("#backgroundPopup").fadeIn("fast");  
		$("#popupContact").fadeIn("fast");  
		popupStatus = 1;  
	}  
}  

function disablePopup(){   
	if(popupStatus==1)
	{  
		$("#backgroundPopup").fadeOut("fast");  
		$("#popupContact").fadeOut("fast");  
		popupStatus = 0;  
	}  
}  

function centerPopup(){
	var windowWidth = document.documentElement.clientWidth;
	var windowHeight = document.documentElement.clientHeight;
	var popupHeight = $("#popupContact").height();
	var popupWidth = $("#popupContact").width();
	//centering
	$("#popupContact").css({
		"position": "fixed",
		"top": windowHeight/2-popupHeight/2,
		"left": windowWidth/2-popupWidth/2
	});
}
