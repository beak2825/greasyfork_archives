// ==UserScript==
// @name          Checkering It Twice
// @description   Find out in a single click who needs to be checked out.
// @version       1.4
// @author        Klimtog (Parts of Utilibot's Love Finder script were cannibalized in this, too, so thanks to him)
// @include       *127.0.0.1:*/searchplayer.php*
// @include       *kingdomofloathing.com/searchplayer.php*
// @include       *localhost:60080/searchplayer.php*
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @namespace https://greasyfork.org/users/3824
// @downloadURL https://update.greasyfork.org/scripts/6693/Checkering%20It%20Twice.user.js
// @updateURL https://update.greasyfork.org/scripts/6693/Checkering%20It%20Twice.meta.js
// ==/UserScript==
var show = 2; //1 = show people even after you've hit them twice
			  //2 = hide people you've beaten twice
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
		if(offensiveWins>0){crushedPlayerIdsList[playerId]=playerId + ',1';}
		if(offensiveWins>1){crushedPlayerIdsList[playerId]=playerId + ',2';}
	}
   
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

function highlightTable(tbl, show)
{
	var l=tbl.rows.length;
	for(var i=1;i<l;i++)
	{
		if(typeof crushedPlayerIdsList[tbl.rows[i].cells[1].firstChild.data]!='undefined')
		{
			//console.log(i);
			if(parseInt(crushedPlayerIdsList[tbl.rows[i].cells[1].firstChild.data].split(',')[1])==2){
				if(show==2){
					tbl.rows[i].style.display="none";
				} else {
					tbl.rows[i].style.backgroundColor="red";
				}
			}else if(parseInt(crushedPlayerIdsList[tbl.rows[i].cells[1].firstChild.data].split(',')[1])==1){
				tbl.rows[i].style.backgroundColor="#3C8D0D";
			}
		}
	}
}

var $stl = jQuery.noConflict();

$stl(document).ready(function() {
	var alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
	$stl('form[action="searchplayer.php"]').parent().prepend('<div id="stlplayersearch"><center><a id="klimtogstl" style="cursor:pointer;text-decoration:underline;color: blue;">who have I not loved</a><br />HC: <input type="checkbox" name="stlcheck" id="stlcheck" checked /></center></div><br />');
	
	$stl('#klimtogstl').click(function(){
		if ($stl('#stlcheck').is(':checked')) {
			$stl('input[name="hardcoreonly"]').val(1);
		} else {
			$stl('input[name="hardcoreonly"]').val(2);	
		}
		$stl('input[name="pvponly"]').prop('checked', true);
		$stl('input[name="startswith"]').val(1);
		for (var i = 0; i < alphabet.length; i++) {
			$stl('input[name="searchstring"]').val(alphabet[i]);
			var looped = 0;
			var wholeTable = "";
			$stl.ajax({
				type: 'POST',
				url:  'searchplayer.php',
				data: $stl('form').serialize(),
				dataType: 'html',
				success: function(html) {
					looped = looped+1;
						table1 = html.split('<u>Fame</u></b></td></tr>');
						table2 = table1[1].split('</table>');
						wholeTable = wholeTable + table2[0];
					if(looped==26){
						$stl('form[action="searchplayer.php"]').prepend('<table id="psearch" align=center><tr><td class=small><b><u>Name</u></b></td><td class=small><b><u>PlayerID</u></b></td><td class=small><b><u>Level</u></b></td><td class=small><b><u>Class</u></b></td><td class=small><b><u>Fame</u></b></td></tr>');
						$stl('#psearch').append(wholeTable);
						$stl('#psearch').append('</table>');
						var tbl1=getPlayerDataTable();
						if(tbl1.rows&&tbl1.rows.length>1)
						makeRequest('GET','/peevpee.php?place=logs&mevs=1&oldseason=0',
						function(x){
							var d=document.createElement('div');
							d.innerHTML=x.responseText;
							parseTable(getRecordTable(d));
							highlightTable(tbl1, show);
						});
					}
				}
			});
		}
	});
});