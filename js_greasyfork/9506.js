// ==UserScript==
// @name        BULSATCOM IPTV
// @namespace   bulsat
// @include     *test.iptv.bulsat.com/iptv-login.php*
// @version     1.1.3
// @grant       none
// @grant       GM_info
// @description Bulsatcom IPTV extended.
// @downloadURL https://update.greasyfork.org/scripts/9506/BULSATCOM%20IPTV.user.js
// @updateURL https://update.greasyfork.org/scripts/9506/BULSATCOM%20IPTV.meta.js
// ==/UserScript==

//========================================================================================================================================================================================================================================================================================================================================
	
var sttngs = ""; var user; var pass; var width; var height; var rmvprg = {}; var catNm = {}; var catPr = {}; var loginCnt = 0; var maxwidth = 1280; var d = new Date(); var month = d.getMonth()+1; var day = d.getDate(); var checkDate = d.getFullYear() + '-' + (month<10 ? '0' : '') + month + '-' + (day<10 ? '0' : '') + day;
	
//========================================================================================================================================================================================================================================================================================================================================

	user 	 = '';					// e-mail
	pass 	 = '';					// парола
     
	defprg 	 = 'bTV HD';			// програма тръгваща по подразбиране
				 
	rmvprg 	 = [					// списък с каналите за изтриване

			   ];
	
	catNm[0] = 'ОБЩИ';
	catPr[0] = [
				'БНТ 1 HD',
				'bTV HD',
				'Nova TV',
				'TV7',
				'Diema',
				'KinoNova',
				'FOX',
				'Fox Life',
				'Fox Crime',
				'bTV Cinema',
				'bTV Action',
				'bTV Comedy',
				'Kanal 3',
				'TV+',
				'F+',
				'F+ HD',
				'БНТ HD',
				'БНТ 2',
				'BNT world',
				'News 7 HD',
				'BiT',
				'ТВ Европа',
				'Bulgaria ON Air',
				'Bloomberg TV Bulgaria',
				'Bulgaria 24',
				'Evrokom',
				'Черно Море',
				'TV Zagora',
                'TV Stara Zagora',
				'PO TV Trakia',
				'TV 1 HD',
                'Stoychev HD',
                'BHTV',
				'TVT',
				'Agro TV',
				'Skat',
				'Alfa',
                'Bulsat Info Channel',
			   ];
			   
	catNm[1] = 'Спортни';
	catPr[1] = [
				'Ring HD',
				'Nova Sport',
				'Nova Sport HD',
				'SPORT+ HD',
				'Sportal HD',
				'Мотоспорт HD',
				'AMS HD',
				'Fight Box HD',
				'Fast&FunBox HD',
				'Fight World HD',
			   ];
				 			 
	catNm[2] = 'Научно популярни';
	catPr[2] = [
				'NGC HD',
				'National Geogrphic WILD HD',
				'Hobby TV',
				'Hobby TV HD',
				'Hobby lov HD',
				'Destination BG HD',
				'Българска история HD',
				'History Channel HD',
				'Travel Channel',
                'Travel TV',
				'Travel TV HD',
				'От близо HD',
				'24 Kitchen',
				'Fiesta TV',
				'Хайде в кухнята HD',
				'Fine Living',
				'Food network HD',
                'Телекафе',
				'Viasat History',
				'Viasat Explorer',
				'Viasat Nature',
				'Da Vinci Learning',
				'Outdoor HD',
				'DocuBox HD',
                'The World',
                'RTDoc',
				'Охота и рыбалка',
                'The Medical Channel',
                'WNESS TV HD',
                'In LIFE TV',
			   ];
				 			 
	catNm[3] = 'Филмови';
	catPr[3] = [
				'AXN',
				'AMC',
				'Cinema + HD',
				'Action + HD',
				'Comedy + HD',
                'Film + HD',
				'Kanal 4',
				'FILMBOX HD',
				'FilmBoxPlus HD',
				'Art House',
				'TV1000',
                'TV 1000 Russкое Kino',
				'CBS Drama',
				'CBS Reality',
				'bTV Lady',
				'Diema Family',
			   ];
				 			 
	catNm[4] = 'Музикални';
	catPr[4] = [
				'Planeta HD',
				'Planeta',
				'Fen TV HD',
				'Balkanica HD',
				'BOX TV HD',
				'The Voice',
				'City TV',
                '359TV HD',
				'Magic TV',
				'BG Top Music',
				'BG Music Channel HD',
				'Iconcert HD',
				'MTV Hits',
				'MTV Rock',
				'MTV Live HD',
				'Amoreyo',
				'Cubayo',
				'Partys',
                'RCK TV',
				'VH1',
				'VH1 Classic',
				'Deluxe Lounge HD',
				'Deluxe Music HD',
				'Mezzo',
				'Mezzo Live HD',
                'Jukebox',
				'Jukebox HD',
				'360TuneBox HD',
                'Музыка',
				'DSTV',
				'Roma TV',
				'DM Sat',
				'Music BOX RU',
				'Music BOX UA',
				'KCN Music 2',
				'KCN Music 3',
				'BN Music',
				'Duga TV',
				'Planeta Folk',
				'Fen Folk TV',
				'Folklor TV',
				'Tiankov Folk HD',
				'Tiankov Orient HD',
				'Tiankov Pop Folk',
			   ];
				 			 
	catNm[5] = 'Детски';
	catPr[5] = [
				'Super 7',
				'Ekids',
				'CN',
				'Disney channel',
				'Disney Junior',
				'Nick Jr.',
				'Nickelodeon',
				'Nickelodeon HD',
				'Boomerang',
				'nickelodeon',
				'KiKa HD',
                'RiC',
				'Duck TV SD',
				'Jim Jam',
				'Fix&Foxi',
				'MadScreenBox HD',
				'Детский Мир',
				'Карусель',
				];
				 			 
	catNm[6] = 'Чуждестранни';
	catPr[6] = [
				'Fashion TV',
				'FashionBox HD',
				'Fashion One HD',
                'CODE FASHION TV',
				'SKY NEWS',
                'RAI News',
				'CNN',
				'Deutsche welle',
                'Eurochannel',
                'Еnglish HD',
				'Perviy Kanal',
				'Russia Today',
				'PTP Планета',
				'Дом кино',
				'Nashe kino',
				'MirTv',
				'Русия 24',
				'24 техно',
                'Время',
				'Перец',
                'RTP Int.',
				'RTL HD',
				'RTL 2 HD',
				'Super RTL HD',
				'RTL Nitro HD',
				'VOX HD',
				'Pro 7 HD',
				'ZDF HD',
				'ARD HD',
				'SAT1',
                'n-TV HD',
                'N24',
                'Sixx',
                'Kabeleins',
				'3SAT HD',
				'ARTE HD',
				'France 24',
				'France 2',
				'TV5',
                'TVE',
				'Rai Uno',
				'Euro D',
				'Show Turk',
                'Kral TV',
                'Star TV',
				'NTV Avrupa',
                'ATV',
				'Al Jazeera',
			   ];
				 			 
	catNm[7] = 'Радиа';
	catPr[7] = [
                'Дарик радио',
                'Radio Focus',
                'Radio Nova',
                'BTV radio',
                'Bulgaria On Air',
                'horizont',
                'Hristo Botev BNR',
                'Radio Varna',
                'BG radio',
                'Radio Zorana',
                'Veselina',
                'veronika',
                'Radio Payner',
                'Radio Ultra',
                'Folk radio Nazdrave',
                'Folk Radio',
                'Radio Chanove',
                'vitosha',
                'njoy',
                'The Voice 2',
                'Radio Fresh',
                'Radio City',
                'nrj',
                '100 HIT radio',
                'Top 100 Station',
                'Radio Family',
                'NDR Blue',
                'Radio Fantasy',
                'Radio 1',
                'FM+',
                'Melody',
                'Magic FM',
                'Radio Maq',
                'Power FM',
                'Kid Red Radio',
                'Radio5 nostalgia',
                'Raven Radio',
                '4U 80s',
                'zrock',
                'tangramegarock',
                'Star FM',
                'radio1rock',
                'One Hip Hop',
                'ALPHA radio',
                'House Music radio',
                'jazzfm',
                'Jazz FM Lounge',
                'SKY radio Greece',
			   ];
			   
	// Проверка за нова версия
	$.getJSON( "https://dl.dropboxusercontent.com/u/9691030/IPTV/data.txt", function(data) {
		if(data.version != GM_info.script.version) {
			if(localStorage.getItem("checkDate") != checkDate) {
				localStorage.setItem("checkDate", checkDate);
				alert("Има нова версия на скрипта: v" + data.version);
			}
		}
	});
	
//================================================================================================================

	var sUser = localStorage.getItem("user");
	var sPass = localStorage.getItem("pass");
	var sDefprg = localStorage.getItem("defprg");
		
	if(!user) {
		if(sUser) {
			user = sUser;
		}
	}
		
	if(!pass) {
		if(sPass) {
			pass = sPass;
		}
	}
		
	if(sDefprg) {
		defprg = sDefprg;
	}	
					  
//================================================================================================================

$(document).ready(function() {
	
	// Визуални промени	
	$("head").append('<link href="https://dl.dropboxusercontent.com/u/9691030/IPTV/files/favicon.ico" rel="shortcut icon" type="image/x-icon" />');		
	$("body").css("cssText", "overflow:hidden;");
	
    var mySort = setInterval( function() {
		
		$(".row").remove();
	
		if($("#btv").length) {
			
			// Визуални промени			
			$("#jw").css("cssText", "width:100%;height:100%;");
			$("#playlist").css("cssText", "height:100%;overflow:hidden;");
			
			// Всички програми
			var programs = {};
			$("#playlist a").each(function() {
				var id = $(this).attr('href').match(/\d+/g);
				var name = $(this).find('h2').text(); 
				$(this).attr('rel', (parseInt(id) + 1000));
				$(this).addClass('cat0');
				$(this).css("cssText", "height:58px;");
				if(programs[name]) {
					programs[name + " 2"] = $(this).attr('id');
				}
				else {
					programs[name] = $(this).attr('id');
				}
			});
			
			// Групиране на програмите
			for (i = 10; i >= 0; i--) {
				if(catPr[i]) {
					$.each(catPr[i], function(index, value) { 
						$('#' + programs[value]).removeClass('cat0').addClass('cat'+i);
						$('#' + programs[value]).attr('rel', ((i * 100) + index));
					});
				}
			}
			
			// Изтриване на програмите
			$.each(rmvprg, function(index, value) { 
				$('#' + programs[value]).remove();
			});
			
			// Сортиране на програмите
			$('#playlist a').sort(function(a, b){
				var e1 = parseInt($(a).attr('rel'))
				var e2 = parseInt($(b).attr('rel'))
				return e1 > e2 ? 1 : e1 < e2 ? -1 : 0;
			}).appendTo('#playlist')
			
		}	
		
		// Автоматично логване
		if(loginCnt<50) {
			if($('#user').length && $('#pw').length) {
				if(user && pass) {
					$('#user').val(user);
					$('#pw').val(pass);
					$("#auth").trigger('click');
				}
			}
			loginCnt++;
		}
		$("#auth").click(function() {
			localStorage.setItem("user", $("#user").val());
			localStorage.setItem("pass", $("#pw").val());
		});
		
		// Спиране на скрипта, задаване на начална програма, добавяне на категориите
		if($("#btv").length) { 
			clearInterval(mySort);
			user = localStorage.getItem("user");
			pass = localStorage.getItem("pass");
			
			if(programs[defprg]) {
				//$("#" + programs[defprg]).get(0).click();
			}
			
			$('<style type="text/css">#epg ul{width:auto;float:left;margin-left:50px;}</style>').appendTo(document.head);
			$('<style type="text/css">.cat{float:left;display:block;width:32px;height:34px;border-left:1px solid #111012;}</style>').appendTo(document.head);
			$('<style type="text/css">.c0{background: #191C1F url("https://dl.dropboxusercontent.com/u/9691030/IPTV/files/cat0.png") 0 0 no-repeat;} .c0:hover{background: #24292D url("https://dl.dropboxusercontent.com/u/9691030/IPTV/files/cat0.png") 0 -32px no-repeat;} .cat-active{background-color:#24292D;background-position: 0 -32px;}</style>').appendTo(document.head);
			$('<style type="text/css">.c1{background: #191C1F url("https://dl.dropboxusercontent.com/u/9691030/IPTV/files/cat1.png") 0 0 no-repeat;} .c1:hover{background: #24292D url("https://dl.dropboxusercontent.com/u/9691030/IPTV/files/cat1.png") 0 -32px no-repeat;} .cat-active{background-color:#24292D;background-position: 0 -32px;}</style>').appendTo(document.head);
			$('<style type="text/css">.c2{background: #191C1F url("https://dl.dropboxusercontent.com/u/9691030/IPTV/files/cat2.png") 0 0 no-repeat;} .c2:hover{background: #24292D url("https://dl.dropboxusercontent.com/u/9691030/IPTV/files/cat2.png") 0 -32px no-repeat;} .cat-active{background-color:#24292D;background-position: 0 -32px;}</style>').appendTo(document.head);
			$('<style type="text/css">.c3{background: #191C1F url("https://dl.dropboxusercontent.com/u/9691030/IPTV/files/cat3.png") 0 0 no-repeat;} .c3:hover{background: #24292D url("https://dl.dropboxusercontent.com/u/9691030/IPTV/files/cat3.png") 0 -32px no-repeat;} .cat-active{background-color:#24292D;background-position: 0 -32px;}</style>').appendTo(document.head);
			$('<style type="text/css">.c4{background: #191C1F url("https://dl.dropboxusercontent.com/u/9691030/IPTV/files/cat4.png") 0 0 no-repeat;} .c4:hover{background: #24292D url("https://dl.dropboxusercontent.com/u/9691030/IPTV/files/cat4.png") 0 -32px no-repeat;} .cat-active{background-color:#24292D;background-position: 0 -32px;}</style>').appendTo(document.head);
			$('<style type="text/css">.c5{background: #191C1F url("https://dl.dropboxusercontent.com/u/9691030/IPTV/files/cat5.png") 0 0 no-repeat;} .c5:hover{background: #24292D url("https://dl.dropboxusercontent.com/u/9691030/IPTV/files/cat5.png") 0 -32px no-repeat;} .cat-active{background-color:#24292D;background-position: 0 -32px;}</style>').appendTo(document.head);
			$('<style type="text/css">.c6{background: #191C1F url("https://dl.dropboxusercontent.com/u/9691030/IPTV/files/cat6.png") 0 0 no-repeat;} .c6:hover{background: #24292D url("https://dl.dropboxusercontent.com/u/9691030/IPTV/files/cat6.png") 0 -32px no-repeat;} .cat-active{background-color:#24292D;background-position: 0 -32px;}</style>').appendTo(document.head);
			$('<style type="text/css">.c7{background: #191C1F url("https://dl.dropboxusercontent.com/u/9691030/IPTV/files/cat7.png") 0 0 no-repeat;} .c7:hover{background: #24292D url("https://dl.dropboxusercontent.com/u/9691030/IPTV/files/cat7.png") 0 -32px no-repeat;} .cat-active{background-color:#24292D;background-position: 0 -32px;}</style>').appendTo(document.head);
			$('<style type="text/css">.settings{background: #191C1F url("https://dl.dropboxusercontent.com/u/9691030/IPTV/files/settings.png") 0 0 no-repeat;} .settings:hover{background: #24292D url("https://dl.dropboxusercontent.com/u/9691030/IPTV/files/settings.png") 0 -32px no-repeat;}</style>').appendTo(document.head);
			$("#playlist").before('<div id="cat" style="width:288px; height:34px; position:absolute; top:0px; left:0px; right:0px; bottom:0px; background:#191C1F; border-bottom:1px solid #111012;"></div>');
			$("#cat").append('<a id="cat0" class="cat c0 cat-active" href="javascript:showCat(0)" title="'+catNm[0]+'"></a>')
			$("#cat").append('<a id="cat1" class="cat c1" href="javascript:showCat(1)" title="'+catNm[1]+'"></a>');
			$("#cat").append('<a id="cat2" class="cat c2" href="javascript:showCat(2)" title="'+catNm[2]+'"></a>');
			$("#cat").append('<a id="cat3" class="cat c3" href="javascript:showCat(3)" title="'+catNm[3]+'"></a>');
			$("#cat").append('<a id="cat4" class="cat c4" href="javascript:showCat(4)" title="'+catNm[4]+'"></a>');
			$("#cat").append('<a id="cat5" class="cat c5" href="javascript:showCat(5)" title="'+catNm[5]+'"></a>');
			$("#cat").append('<a id="cat6" class="cat c6" href="javascript:showCat(6)" title="'+catNm[6]+'"></a>');
			$("#cat").append('<a id="cat7" class="cat c7" href="javascript:showCat(7)" title="'+catNm[7]+'"></a>');
			$("#cat7").after('<a id="settings" class="cat settings" style="margin:0 5px;width:22px;border-right:1px solid #111012;cursor:pointer;cursor:hand;" title="Настройки"></a>');
			
			sttngs += '<div style="position:absolute;width:100%;padding:5px 25px 25px;background:#000000;border:4px double #ff9e02;color:#fff;">'; 
			sttngs += '<h2 style="width:100%;color:#ff9e02;text-align:center;">BULSATCOM IPTV v' + GM_info.script.version + '</h2>';
			sttngs += '<fieldset style="padding:5px 10px 10px;border:1px solid #fff;">';
			sttngs += '<legend style="padding:0 5px;color:#fff;font-weight:bold;">Автоматично логване</legend>';
			sttngs += '<input style="padding:5px;margin:5px 0;color:black;" id="userSave" type="text" value="' + user + '" autocomplete="off" placeholder="Потребител">';
			sttngs += '<input style="padding:5px;margin:5px 0;color:black;" id="passSave" type="text" value="' + pass + '" autocomplete="off" placeholder="Парола">';
			sttngs += '</fieldset>';
			sttngs += '<fieldset style="margin:20px 0 0;padding:5px 10px 10px;border:1px solid #fff;">';
			sttngs += '<legend style="padding:0 5px;color:#fff;font-weight:bold;">Програма по подразбиране</legend>';
			sttngs += '<select id="defprgSave" style="width:100%;padding:5px;color:black;">';
			$.each(programs, function(index) { 
				sttngs += '<option value="' + index + '"' + (defprg==index ? ' selected="selected"' : '') + '>' + index + '</option>';
			});
			sttngs += '</select>';
			sttngs += '</fieldset>';
			sttngs += '<div style="float:left;width:29%;margin:30px 5px 0;background:#ff9e02;"><a style="width:100%;text-decoration:none;color:#000;font-weight:bold;display:block;text-align:center;padding:2px 0;cursor:pointer;cursor:hand;" id="reset">RESET</a></div>';
			sttngs += '<div style="float:left;width:29%;margin:30px 5px 0;background:#ff9e02;"><a style="width:100%;text-decoration:none;color:#000;font-weight:bold;display:block;text-align:center;padding:2px 0;cursor:pointer;cursor:hand;" href="https://dl.dropboxusercontent.com/u/9691030/IPTV/BULSATCOM_IPTV.user.js">UPDATE</a></div>';
			sttngs += '<div style="float:left;width:29%;margin:30px 5px 0;background:#ff9e02;"><a style="width:100%;text-decoration:none;color:#000;font-weight:bold;display:block;text-align:center;padding:2px 0;cursor:pointer;cursor:hand;" id="save"">SAVE</a></div>';
			sttngs += '<div style="float:left;width:100%;margin:30px 0 5px 0;background:#ff9e02;"><input name="auth" id="auth" type="button" value="Изход от Вашия профил" onclick="do_it();"></div>';
			sttngs += '</div>';

			$("body").append('<div id="settingsBlock" style="display:none;z-index:999998;position:fixed;top:0;width:100%;height:100%;background:rgba(0,0,0,0.6);"></div>');
			$("body").append('<div id="settingsOptions" style="display:none;z-index:999999;position:fixed;top:100px;width:300px;left:50%;margin-left:-175px;">' + sttngs + '</div>');
			
			$("#settings").click(function() { $("#settingsBlock, #settingsOptions").show() });
			$("#reset").click(function() { localStorage.clear(), location.reload() });
			$("#settingsBlock, #save").click(function() {	
				$("#settingsBlock, #settingsOptions").hide();
				localStorage.setItem("user", $("#userSave").val());
				localStorage.setItem("pass", $("#passSave").val());
				localStorage.setItem("defprg", $("#defprgSave").val());
			});
			$("#auth").click(function() {	
				$("#settingsBlock, #settingsOptions").hide();
			});
			
			$("#playlist a").each(function() { $(this).hide(); });
			$("#playlist a.cat0").each(function() { $(this).show(); });
						
			if(get_width() < maxwidth) { 
				width = get_width(); height = width / (16/9);
				$("#wrap").css("cssText", "width:" + width + "px;height:" + height + "px;padding:0;");
				$(".playlist").css("cssText", "width:288px;height:" + height  + "px;position:fixed;top:0;left:0;").hide(); 
				$("#cat").css("cssText", "width:288px; height:34px; float:left; background:#191C1F; border-bottom:1px solid #111012;position:fixed;top:0;left:0;");
				$("#playlist").css("cssText", "width:288px; height:" + (height - 34) + "px; background:#191C1F;overflow:hidden;position:fixed;top:34px;left:0;"); 
				$("#epg").css("cssText", "width:" + width + "px;margin-top:-79px;position:relative; background:#191C1F;").hide(); 
				$("#jw, #cat, #playlist, #ascrail2000, use").mouseenter(function(){$(".playlist").show();}).mouseleave(function(){$(".playlist").hide();});
			    $("#epg, #cat, #playlist, #ascrail2000, use").mouseenter(function(){$("#epg").hide();}).mouseleave(function(){$("#epg").hide();});
			}
			else {
				width = get_width() - 288; height = width / (16/9);
				$("#wrap").css("cssText", "width:" + (width + 288) + "px;height:" + height + "px;padding:0;");
				$(".playlist").css("cssText", "width:288px;height:" + height  + "px;position:relative;top:0;left:0;").show(); 
				$("#cat").css("cssText", "width:288px; height:34px; float:left; background:#191C1F; border-bottom:1px solid #111012;position:absolute;top:0"); 
				$("#playlist").css("cssText", "width:288px; height:" + (height - 34) + "px; background:#191C1F;overflow:hidden;position:absolute;top:34px;"); 
				$("#epg").css("cssText", "width:" + width + "px;margin-top:-79px;position:relative; background:#191C1F;").hide(); 
				$("#epg, #cat, #playlist, #ascrail2000, use").mouseenter(function(){$("#epg").show();}).mouseleave(function(){$("#epg").hide();});
			}
			jwplayer().resize(width,height);
		}

    }, 200);

	$(window).resize(function() {
		if(get_width() >= maxwidth) { 
			width = get_width() - 288; height = width / (16/9);
			$("#wrap").css("cssText", "width:" + (width + 288) + "px;height:" + height  + "px;padding:0;");
			$(".playlist").css("cssText", "width:288px;height:" + height  + "px;position:relative;top:0;left:0;").show(); 
			$("#cat").css("cssText", "width:288px; height:34px; float:left; background:#191C1F; border-bottom:1px solid #111012;position:absolute;top:0;"); 
			$("#playlist").css("cssText", "width:288px; height:" + (height - 34) + "px; background:#191C1F;overflow:hidden;position:absolute;top:34px;"); 
			$("#epg").css("cssText", "width:" + width + "px;margin-top:-79px;position:relative; background:#191C1F;").hide(); 
			$("#jw, #cat, #playlist, #ascrail2000, use").mouseenter(function(){$(".playlist").show();}).mouseleave(function(){$(".playlist").show();});
			$("#epg, #cat, #playlist, #ascrail2000, use").mouseenter(function(){$("#epg").show();}).mouseleave(function(){$("#epg").hide();});
		} 
		else { 
			width = get_width(); height = width / (16/9);
			$("#wrap").css("cssText", "width:" + width + "px;height:" + height + "px;padding:0;");
			$(".playlist").css("cssText", "width:288px;height:" + height  + "px;position:fixed;top:0;left:0;").hide(); 
			$("#cat").css("cssText", "width:288px; height:34px; float:left; background:#191C1F; border-bottom:1px solid #111012;position:fixed;top:0;left:0;"); 
			$("#playlist").css("cssText", "width:288px; height:" + (height - 34) + "px; background:#191C1F;overflow:hidden;position:fixed;top:34px;left:0;"); 
			$("#epg").css("cssText", "width:" + width + "px;margin-top:-79px;position:fixed; background:#191C1F;").hide(); 
			$("#jw, #cat, #playlist, #ascrail2000, use").mouseenter(function(){$(".playlist").show();}).mouseleave(function(){$(".playlist").hide();});
			$("#jw, #epg, #cat, #playlist, #ascrail2000, use").mouseenter(function(){$("#epg").hide();}).mouseleave(function(){$("#epg").hide();});
		}
		jwplayer().resize(width,height);
	});
	
	function get_width() {
        var correction = ($(window).width() >= maxwidth ? 288 : 0);
		var h = (($(window).width() - correction) / (16/9))
		if($(window).height() < h) {
			return (($(window).height() * (16/9)) + correction);
		}
		else {
			return $(window).width();
		}
	}
	
});

function showCat(id) {
	$("#cat a").removeClass('cat-active');
	$("#cat #cat"+id).addClass('cat-active');
	$("#playlist a").each(function() { $(this).hide(); });
	$("#playlist a.cat"+id).each(function() { $(this).show(); });
	$("#playlist").getNiceScroll().resize();
}

// Script Insert
var script = document.createElement('script');
script.textContent = showCat;
document.body.appendChild(script);