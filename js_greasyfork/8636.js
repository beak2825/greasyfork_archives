// ==UserScript==
// @name        Diablo 3 Profiles
// @id          d3profiles
// @namespace   d3profiles
// @description Enhances Diablo 3 profiles with the D3 Progress data
// @include     http*://*.battle.net/d3/*/profile/*-*/hero/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @version     1.9
// @grant       none
// @author      rizzn
// @run-at      document-start
// @license		https://d3profiles.safe-ws.de/include/license.txt
// @icon		https://d3profiles.safe-ws.de/images/diablo.png
// @downloadURL https://update.greasyfork.org/scripts/8636/Diablo%203%20Profiles.user.js
// @updateURL https://update.greasyfork.org/scripts/8636/Diablo%203%20Profiles.meta.js
// ==/UserScript==

/////////////////////////////////////////////////////////////////
/////														/////
/////						SETTINGS						/////
/////														/////
/////////////////////////////////////////////////////////////////

/* var root
	Describes the current root url for server-side scripts.
	Please don't change this or the script won't work anymore.
	You can also use the PHP files in the source code files to
	run it on your own server.
*/
var root = "https://d3profiles.safe-ws.de/live/";

/* var version
	The local script version to compare with the version
	stored on the server. If they don't match and there's
	a new version it will be shown by a small icon.
*/
var version = "v1.9";

/* var versionURL
	Is delivering the current version of the script.
*/
var verionURL = "https://d3profiles.safe-ws.de/include/version.php";

/* var versionCheck
	Enables or disables the version check.
		* true = enabled
		* false = disabled
*/
var versionCheck = true;

/* var url
	The decodeURI() function is used to decode a URI.
*/
var url = decodeURI(location.href);

/* var colorMode
	Let's you switch between coloured or regular text.
		* true = coloured text
		* false = regular text
*/
var colorMode = true;

/* var opacity
	Let's you change the opacity of the D3 Progress window.
		* max = 100
		* min = 0 (invisible)
*/
var opacity = "100";

/* var customDesign
	Switches between clasic layout and custom design.
		* true = new design
		* false = clasic design
*/
var customDesign = true;

/* var bonusStats
	Switches between bonus stats visible or invisible.
		* true = visible
		* false = invisible
*/
var bonusStats = true;

/* var circleView [BETA]
	Switches between text and graphical display.
	Only works if "customDesign" is set to "true".
	Circles currently don't support filtering stats.
		* true = graphical display
		* false = text display
*/
var circleView = false;

/////////////////////////////////////////////////////////////////
/////														/////
/////							EOF							/////
/////														/////
/////////////////////////////////////////////////////////////////


// CORE FUNCTIONS - DO NOTE EDIT/DELETE IF YOU DON'T KNOW WHAT YOU ARE DOING!
$(window).load(function() {
	if(versionCheck === true) {
		$.ajax({
			url:"https://d3profiles.safe-ws.de/include/version.php",
			type:"GET",
			timeout:30000,
			dataType:"json",
			crossDomain:true,
			success:function(data, status, error) {
				//console.log(data);
				if(data.version > version.substr(1, version.length)) {
					$("#d3profiles").append("<div class=\"reload\" style=\"position:absolute; left:8px; top:20px;\"><a href=\""+data.updateURL+"\" target=\"blank\" title=\"New version available\"><img src=\""+root+"assets/update.png\" width=\"16\" height=\"16\" alt=\"16\" /></a></div>");
				}
			},
			error:function(data, status, error) {
				console.warn(data, textStatus, errorThrown);
			}
		});
	}

	$("a.hero-tab").click(function() {
		return false;
	}).append("<div class=\"linkContainer\" style=\"position:absolute; width:97px; height:110px; margin:-70px 0px 0px -7px;\"></div>");

	$(".linkContainer").click(function() {
		var switchHeroID = url.split("/");
		var cleanURL = switchHeroID[0]+"//"+switchHeroID[2]+"/"+switchHeroID[3]+"/"+switchHeroID[4]+"/"+switchHeroID[5]+"/"+switchHeroID[6]+"/"+switchHeroID[7]+"/";
		var newHeroID = $(this).parent("a").attr("href");

		location.href = cleanURL+newHeroID;
	});

	if(customDesign === true) {
		var originalBGPath = $(".profile-sheet").css("background-image").split("\/");
		var cutChars = 11;
		var newBGString = originalBGPath[9].substr(0, originalBGPath[9].length-cutChars);
		if(newBGString.match("-f")) {
			newBGString = newBGString.substr(0, newBGString.length-2);
		}
		$(".profile-sheet").append("<div style=\"position:absolute; background-image:url('"+root+"assets/slots-new.png'); background-repeat:no-repeat; width:282px; height:407px; margin:160px 0px 0px 487px;\"></div>");
		$(".profile-sheet").css({"background-image":"url('"+root+"assets/bgs/"+newBGString+".jpg')"});

		var redesignSlots = new Array("head", "neck", "bracers", "waist", "rightFinger");
		for(var i = 0; i < redesignSlots.length; i++) {
			$(".profile-sheet #paperdoll ul#gear-labels li.gear-label.slot-"+redesignSlots[i]+" a.label-link span").css({"text-shadow":"0px 0px 1px #000000, 0px 0px 5px #000000, 0px 0px 5px #000000, 0px 0px 5px #000000, 0px 0px 5px #000000, 0px 0px 5px #000000, 0px 0px 5px #000000"});
		}

        if(bonusStats === true) {
			template = "<div id=\"d3profiles\" style=\"position:absolute; background-image:url('"+root+"assets/box/top-"+newBGString+".jpg'), url('"+root+"assets/box/middle.jpg'); background-repeat:no-repeat, repeat-y; width:220px; margin:80px 0px 0px 50px; padding:25px 15px 0px 15px; opacity:"+opacity/100+"; -moz-opacity:"+opacity/100+"; filter:alpha(opacity="+opacity+"); box-shadow:inset 1px 1px 2px #000000; -moz-box-shadow:inset 1px 1px 2px #000000; -webkit-box-shadow:inset 1px 1px 2px #000000;\"> \
				<div class=\"crest\" style=\"position:absolute; background-image:url('"+root+"assets/crests/"+newBGString+".png'); background-repeat:no-repeat; width:150px; height:150px; margin:-100px 0px 0px 35px; z-index:1;\"></div> \
				<div class=\"corner lt\" style=\"position:absolute; background-image:url('"+root+"assets/corner-lt.png'); background-repeat:no-repeat; width:268px; height:219px; margin:-76px 0px 0px -61px;\"></div> \
				<h3 class=\"header-3\" style=\"display:inline-block; position:relative; background-color:#000000; margin:0px 0px 0px 23px; padding:2px 5px 1px 5px; z-index:2; opacity:0.85; -moz-opacity:0.85; filter:alpha(opacity=85);\">DIABLOPROGRESS</h3> \
				<div class=\"reload\" style=\"position:absolute; left:225px; top:20px;\"><a href=\"javascript:void(0);\" onclick=\"location.reload();\" title=\"Reload profile\"><img src=\""+root+"assets/reload.png\" width=\"16\" height=\"16\" alt=\"16\" /></a></div> \
				<div class=\"d3pdata\" style=\"position:relative; font-size:11px; margin:5px 0px 0px 30px; text-shadow:1px 1px 0px #222222, 0px 0px 0px #000000, 1px 1px 1px #222222; z-index:2;\">Loading data...</div> \
				<div style=\"background-image:url('"+root+"assets/box/bottom.jpg'); background-repeat:no-repeat; width:250px; height:165px; margin:-80px 0px 0px -15px;\"></div> \
			</div>";
			template += "<div class=\"divisor\" style=\"position:absolute; background-image:url('"+root+"assets/divisor.png'); width:208px; height:15px; margin:55px 0px 0px 525px;\"></div>";
			template += "<div class=\"divisor\" style=\"position:absolute; background-image:url('"+root+"assets/divisor.png'); width:208px; height:15px; margin:113px 0px 0px 525px;\"></div>";
        }
		else {
			template = "<div id=\"d3profiles\" style=\"position:absolute; background-image:url('"+root+"assets/box/top-"+newBGString+".jpg'), url('"+root+"assets/box/middle.jpg'); background-repeat:no-repeat, repeat-y; width:220px; margin:80px 0px 0px 50px; padding:25px 15px 0px 15px; opacity:"+opacity/100+"; -moz-opacity:"+opacity/100+"; filter:alpha(opacity="+opacity+"); box-shadow:inset 1px 1px 2px #000000; -moz-box-shadow:inset 1px 1px 2px #000000; -webkit-box-shadow:inset 1px 1px 2px #000000;\"> \
				<div class=\"crest\" style=\"position:absolute; background-image:url('"+root+"assets/crests/"+newBGString+".png'); background-repeat:no-repeat; width:150px; height:150px; margin:-100px 0px 0px 35px; z-index:1;\"></div> \
				<div class=\"corner lt\" style=\"position:absolute; background-image:url('"+root+"assets/corner-lt.png'); background-repeat:no-repeat; width:268px; height:219px; margin:-76px 0px 0px -61px;\"></div> \
				<h3 class=\"header-3\" style=\"display:inline-block; position:relative; background-color:#000000; margin:0px 0px 0px 23px; padding:2px 5px 1px 5px; z-index:2; opacity:0.85; -moz-opacity:0.85; filter:alpha(opacity=85);\">DIABLOPROGRESS</h3> \
				<div class=\"reload\" style=\"position:absolute; left:225px; top:20px;\"><a href=\"javascript:void(0);\" onclick=\"location.reload();\" title=\"Reload profile\"><img src=\""+root+"assets/reload.png\" width=\"16\" height=\"16\" alt=\"16\" /></a></div> \
				<div class=\"d3pdata\" style=\"position:relative; font-size:12px; margin:5px 0px 0px 5px; text-shadow:1px 1px 0px #222222, 0px 0px 0px #000000, 1px 1px 1px #222222; z-index:2;\">Loading data...</div> \
				<div style=\"background-image:url('"+root+"assets/box/bottom.jpg'); background-repeat:no-repeat; width:250px; height:165px; margin:-80px 0px 0px -15px;\"></div> \
			</div>";
            template += "<div class=\"divisor\" style=\"position:absolute; background-image:url('"+root+"assets/divisor.png'); width:208px; height:15px; margin:55px 0px 0px 525px;\"></div>";
            template += "<div class=\"divisor\" style=\"position:absolute; background-image:url('"+root+"assets/divisor.png'); width:208px; height:15px; margin:113px 0px 0px 525px;\"></div>";
		}
	}
	else {
        template = "<div id=\"d3profiles\" style=\"position:absolute; background-color:#755B40; width:250px; margin:30px 0px 0px 30px; padding:10px; opacity:"+opacity/100+"; -moz-opacity:"+opacity/100+"; filter:alpha(opacity="+opacity+"); box-shadow:inset 1px 1px 2px #000000, 1px 1px 0px #886F54; -moz-box-shadow:inset 1px 1px 2px #000000, 1px 1px 0px #886F54; -webkit-box-shadow:inset 1px 1px 2px #000000, 1px 1px 0px #886F54;\"> \
			<h3 class=\"header-3\">DIABLOPROGRESS</h3> \
			<div class=\"d3pdata\">Loading data...</div> \
			<div class=\"reload\" style=\"position:absolute; left:175px; top:10px;\"><a href=\"javascript:void(0);\" onclick=\"location.reload();\" title=\"Reload profile\"><img src=\""+root+"assets/reload.png\" width=\"16\" height=\"16\" alt=\"16\" /></a></div> \
		</div>";
	}

	$(template).insertBefore(".wrapper .body .body-top .body-bot .profile-wrapper #profile-body .profile-sheet #bonuses");
	$(".wrapper .body .body-top .body-bot .profile-wrapper #profile-body .profile-sheet #bonuses").remove();

	if(url.match("battle.net")) {
		jQuery.support.cors = true;

		var urlCut = url.split("/");

		var D3UserData = urlCut[6].split("-");
		var D3Username = D3UserData[0];
		var D3BattleTag = D3UserData[1];
		var D3HeroName = $("h2.header-2.name").html();
		var D3HeroID = urlCut[8];
		var D3Language = urlCut[4];

		reqURL = root+"load.php?username="+D3Username+"&btag="+D3BattleTag+"&heroname="+D3HeroName+"&heroID="+D3HeroID;

		$.ajax({
			url:reqURL,
			type:"GET",
			timeout:30000,
			dataType:"json",
			crossDomain:true,
			success:function(data, status, error) {
				//console.log(data);
				if(data === "PROFILE_NOT_FOUND") {
					$(".d3pdata").html("Profile not found!");
				}
				else if(data === "WRONG_INPUT") {
					$(".d3pdata").html("Wrong input!");
				}
				else {
					content = "";
					var forbiddenStats = new Array("Paragon 2.0: ", "Profile DPS: ", "Corrected DPS: ", "Elemental DPS: ", "Elemental Elite DPS: ", "Elemental Damage: ", "Toughness: ", "Healing: ");
					var bonusMap = [
									["+Physical Skills Damage: ", "33"],
									["+Cold Skills Damage: ", "34"],
									["+Fire Skills Damage: ", "35"],
									["+Lightning Skills Damage: ", "36"],
									["+Poison Skills Damage: ", "37"],
									["+Arcane Skills Damage: ", "38"],
									["+Holy Skills Damage: ", "39"],
									["Strength: ", "50"],
									["Dexterity: ", "51"],
									["Intelligence: ", "52"],
									["Vitality: ", "53"],
									["Resistance: ", "54"],
									["Armor: ", "60"],
									["Critical Hit Chance: ", "67"],
									["Critical Damage: ", "64"],
									["Area Damage: ", "61"],
									["+Damage Against Elites: ", "75"],
									["Cooldown Reduction: ", "102"],
									["Resource Cost Reduction: ", "103"]
									];
					$.each(data, function(i, item) {
						if(item.char_attr_name === "Last Checked: ") {
							last_checked = item.char_attr_value;
						}
						else {
							if(bonusStats === true) {
								if($.inArray(item.char_attr_name, forbiddenStats) === -1) {
									bonusMap.filter(function(bonusMap) {
										if(item.char_attr_name == bonusMap[0]) {
											if(bonusMap[1] == 50 || bonusMap[1] == 51 || bonusMap[1] == 52) {
												leftValue = "0";
											}
											else {
												leftValue = "-24";
											}
											if(customDesign === true) {
												if(circleView === false) {
													item.char_attr_name = "<a href=\"javascript:void(0);\" class=\"bonus-stat\" data-bonus-index=\""+bonusMap[1]+"\" style=\"color:#A99FFF;\"><span class=\"bonus-stat-button\" style=\"display:inline-block; background-image:url('"+root+"assets/gear-bonus-radio.png'); background-repeat:no-repeat; background-position:"+leftValue+"px 0px; width:23px; height:23px; margin:0px 0px 0px -24px; vertical-align:-10px;\"></span>"+item.char_attr_name+"</a>";
												}
											}
											else {
												item.char_attr_name = "<a href=\"javascript:void(0);\" class=\"bonus-stat\" data-bonus-index=\""+bonusMap[1]+"\" style=\"color:#A99FFF;\"><span class=\"bonus-stat-button\" style=\"display:inline-block; background-image:url('"+root+"assets/gear-bonus-radio.png'); background-repeat:no-repeat; background-position:"+leftValue+"px 0px; width:23px; height:23px; vertical-align:-10px;\"></span>"+item.char_attr_name+"</a>";
											}
										}
									});
								}
							}
							else {
								$("#gear-labels .gear-label .label-link .bonus-value, #gear-labels .gear-label .label-link .weapon-dps").remove();
							}
							if(customDesign === true && circleView === true) {
								var cutComma = new Array("Profile DPS: ", "Corrected DPS: ", "Elemental DPS: ", "Elemental Elite DPS: ", "Elemental Damage: ");
								if($.inArray(item.char_attr_name, cutComma) !== -1) {
									item.char_attr_value = item.char_attr_value.substr(0, item.char_attr_value.length-4);
								}
								item.char_attr_value = item.char_attr_value.replace(".00%", "%");
								var filename = item.char_attr_name.substr(0, item.char_attr_name.length-2).toLowerCase();
								var strFind = new Array(" ", "+", "-2.0", " ");
								var strReplace = new Array("-", "", "", "-");
								for(i = 0; i <= strFind.length-1; i++) {
									filename = filename.replace(strFind[i], strReplace[i]);
								}
								$(".d3pdata").css({"margin":"0px"});
								$(".profile-sheet").css({"height":"820px"});
								if(i < 3) {
									marginTop = "24";
								}
								else {
									marginTop = "8";
								}

								var fontSize = ("12"/item.char_attr_value.length)*8;
								content += "<div style=\"float:left; margin:"+marginTop+"px 0px 0px 7px; line-height:64px;\"> \
												<div style=\"background-image:url('"+root+"assets/circles/"+filename+".png'); width:64px; height:64px;\"><span style=\"display:block; font-size:"+fontSize+"px; font-weight:bold; color:#FFFFFF; text-align:center; text-shadow:0px 0px 2px #000000, 0px 0px 2px #000000, 0px 0px 4px #000000, 0px 0px 4px #000000, 0px 0px 4px #000000, 0px 0px 5px #000000, 0px 0px 5px #000000, 0px 0px 5px #000000; letter-spacing:-0.5px;\">"+item.char_attr_value+"</span></div> \
												<div style=\"background-image:url('"+root+"assets/circles/trait-circle.png'); width:64px; height:64px; margin:-64px 0px 0px 0px;\"></div> \
												<div style=\"font-size:10px; width:64px; height:24px; text-align:center; line-height:12px; overflow:hidden;\"><span style=\"color:#A99FFF;\">"+item.char_attr_name.substr(0, item.char_attr_name.length-2)+"</span></div> \
											</div>";
							}
							else {
								content += "<span style=\"color:#A99FFF;\">"+item.char_attr_name+"</span>"+"<span style=\"color:#D0CCFF;\">"+item.char_attr_value+"</span><br />";
							}
						}
					});

					content = content.replace("Corrected DPS", "Corrected DPS (+set bonuses)");

					if(customDesign === true && circleView === true) {
						content += "<div class=\"clear\"></div>";
					}

					if(bonusStats === true) {
						$(document).on("click", ".bonus-stat", function() {
							var bonusData = $(this).data("bonus-index");
							var gearLabels = $("#gear-labels");
							gearLabels.find(".bonus-value").hide();
							gearLabels.find(".bonus-"+bonusData).show();
							$("span.bonus-stat-button").css({"background-position":"-24px 0px"});
							$(this).children("span.bonus-stat-button").css({"background-position":"0px 0px"});
						});
					}

					if(colorMode === true) {
						descOriginal = new Array(
												"Profile DPS",
												"Corrected DPS",
												"(+set bonuses)",
												"Elemental DPS",
												"Elemental Elite DPS",
												"Toughness",
												"Healing"
												);
						descNew = new Array(
											"<span style=\"color:#73E094;\">Profile DPS</span>",
											"<span style=\"color:#73E094;\">Corrected DPS</span>",
											"<span style=\"color:#FFFF00;\">(+set bonuses)</span>",
											"<span style=\"color:#FF0000;\">Elemental DPS</span>",
											"<span style=\"color:#FF0000;\">Elemental Elite DPS</span>",
											"<span style=\"color:#73E094;\">Toughness</span>",
											"<span style=\"color:#73E094;\">Healing</span>"
											);
						for(i = 0; i <= descOriginal.length-1; i++) {
							content = content.replace(descOriginal[i], descNew[i]);
						}
					}

					if(D3Language !== "en") {
						/* default language */
						languageOriginal = new Array(
											"Paragon 2.0",
											"Profile DPS",
											"Corrected DPS",
											"(+set bonuses)",
											"Elemental DPS",
											"Elemental Elite DPS",
											"Weapon EDamage",
											"+Fire Skills Damage",
											"+Lightning Skills Damage",
											"+Cold Skills Damage",
											"+Physical Skills Damage",
											"+Poison Skills Damage",
											"+Arcane Skills Damage",
											"+Holy Skills Damage",
											"+Damage Against Elites",
											"Toughness",
											"Healing",
											"Area Damage",
											"Critical Hit Chance",
											"Critical Damage",
											"Resistance",
											"Armor",
											"Magic Find",
											"Intelligence",
											"Dexterity",
											"Strength",
											"Vitality",
											"Cooldown Reduction",
											"Resource Cost Reduction"
											);
						if(D3Language === "de") {
							/* translated by rizzn */
							languageNew = new Array("Paragon 2.0", "Profilschaden", "Profilschaden", "(+Set-Bonus)", "Elementarschaden", "Elementarschaden Elite", "Waffen E-Schaden", "+Feuerschaden", "+Blitzschaden", "+Kälteschaden", "+Physischer Schaden", "+Giftschaden", "+Arkanschaden", "+Heiligschaden", "+Schaden gegen Elite", "Zähigkeit", "Heilung", "Flächenschaden", "Kritische Trefferchance", "Kritischer Trefferschaden", "Widerstände", "Rüstung", "Magiefundbonus", "Intelligenz", "Geschicklichkeit", "Stärke", "Vitalität", "Abklingzeitverringerung", "Ressourcenkostenreduzierung");
						}
						else if(D3Language === "es") {
							/* translated by Google Translator */
							languageNew = new Array("Dechado 2.0", "Daños Perfil", "Daños Perfil", "(+Bonus de conjunto)", "Daños Elemental", "Elite daño elemental", "Arma E-Daños", "+Daño de Fuego", "+Daños en la iluminación", "+Daño de Frío", "+Daño Físico", "+Veneno Daño", "+Daño Arcano", "+Daños habilidades Santos", "+Daños contra la elite", "Dureza", "Curación", "Daños en la superficie", "Probabilidad de golpe crítico", "Daños Golpe crítico", "Resistencias", "Armadura", "Fondo Magic Bonus", "Inteligencia", "Habilidad", "Fuerza", "Vitalidad", "Reducción de enfriamiento", "La reducción de costes de recursos");
						}
						else if(D3Language === "fr") {
							/* translated by Google Translator */
							languageNew = new Array("Parangon 2.0", "Dommages profil", "Dommages profil", "(+Bonus d'ensemble)", "Dégâts élémentaires ", "Dégâts élémentaires élite", "Arme E-dommages", "+Dégâts de feu", "+Dégâts de foudre", "+Dégâts de froid", "+Dégâts physiques", "+Dégâts de poison", "+Dégâts des arcanes", "+Dégâts des compétences Saints", "+Dégâts contre élite", "Dureté", "Guérison", "Les défauts de surface", "Chances de coup critique", "Coup critique Dommages", "Résistances", "Armure", "Fonds de bonus magique", "Intelligence", "Compétence", "Force", "vitalité", "Réduction de recharge", "La réduction des coûts des ressources");
						}
						else if(D3Language === "ru") {
							/* translated by Google Translator */
							languageNew = new Array("образец совершенства 2.0", "профиль ДПС", "Исправлены ДПС", "(+установить бонусы)", "Стихии ДПС", "Стихии Элитный ДПС", "Оружие E-Нанесенный", "+огонь навыки повреждение", "+молния навыки повреждение", "+холодный навыки повреждение", "+физический навыки повреждение", "+яд навыки повреждение", "+тайный навыки повреждение", "+святой навыки повреждение", "+Урон против элиты", "прочность", "исцеление", "повреждение область", "Шанс критического удара", "Критический урон", "сопротивлению", "доспехи", "Магия находка", "интеллекту", "ловкости", "силе", "живучести", "снижение отката", "снижение стоимости ресурсов");
						}
						else if(D3Language === "it") {
							/* translated by Google Translator */
							languageNew = new Array("Paragone 2.0", "Profilo DPS", "DPS coretti", "(+impostare i bonus)", "Elementare DPS", "Elementare Elite DPS", "Arma E-Damage", "+Danno Abilità Fuoco", "+Danni Abilità Fulmine", "+Danni Abilità Freddo", "+Danni Abilità Fisiche", "+Danni Abilità Veleno", "+Danni Abilità Arcane", "+Danni Abilità Sacri", "+Danno Contro Elites", "Durezza", "Guarigione", "Danno Area", "Critico colpire possibilità", "Danno critico", "Resistenza", "Armatura", "Trova magia", "Intelligenza", "Destrezza", "Forza", "Vitalità", "Riduzione cooldown", "Riduzione dei costi delle risorse");
						}
						else if(D3Language === "pl") {
							/* translated by Google Translator */
							languageNew = new Array("Paragon 2.0", "Profil DPS", "Poprawione DPS", "(+ zestaw bonusów)", "Elementarna DPS", "Elementarna Elite DPS", "Bron E-Damage", "+Umiejętności Obrażenia ogień", "+Błyskawica Obrażenia Umiejętności", "+Obrażenia Umiejętności zimno", "+Umiejętności Obrażenia fizyczne", "+Umiejętności Trucizny", "+Umiejętności Obrażenia Arcane", "+Obrażenia Umiejętności święte", "+Obrażenia Przeciw elit", "Wytrzymałość", "Uzdrowienie", "Obszar uszkodzenia", "Szansa na trafienie krytyczne trafienie", "Critical Damage", "Odporność", "Pancerz", "Magicznych przedmiotów", "Inteligencja", "Zręczność", "Siła", "Witalność", "Skrócenia czasu odnowienia", "Redukcja kosztów zasobów");
						}
						else {
							languageNew = languageOriginal;
						}
						for(i = 0; i <= languageOriginal.length-1; i++) {
							content = content.replace(languageOriginal[i], languageNew[i]);
						}
					}

					$(".d3pdata").html(content);

					if(customDesign === true) {
						if(circleView === true) {
							$(".d3pdata").append("<p style=\"display:inline; position:absolute; font-size:10px;  margin:0px 0px 0px 15px;\">Last Checked: "+last_checked+"</p>").append("<p style=\"display:inline; position:absolute; font-size:10px; margin:15px 0px 0px 15px;\"><a href=\"http://www.diabloprogress.com/hero/"+D3Username+"-"+D3BattleTag+"/"+D3HeroName+"/"+D3HeroID+"\" target=\"blank\">Visit D3Progress Profile</a></p>");
						}
						else {
							$(".d3pdata").append("<p style=\"display:inline; position:absolute; font-size:10px;\">Last Checked: "+last_checked+"</p>").append("<p style=\"display:inline; position:absolute; font-size:10px; margin:20px 0px 0px 0px;\"><a href=\"http://www.diabloprogress.com/hero/"+D3Username+"-"+D3BattleTag+"/"+D3HeroName+"/"+D3HeroID+"\" target=\"blank\">Visit D3Progress Profile</a></p>");
						}
					}
					else {
						$(".d3pdata").append("<p style=\"display:inline; position:absolute; font-size:10px; margin:-30px 0px 0px 110px;\">Last Checked: "+last_checked+"</p>").append("<p style=\"display:inline; position:absolute; font-size:10px; margin:-17px 0px 0px 110px;\"><a href=\"http://www.diabloprogress.com/hero/"+D3Username+"-"+D3BattleTag+"/"+D3HeroName+"/"+D3HeroID+"\" target=\"blank\">Visit D3Progress Profile</a></p>");
					}
				}
			},
			error:function(data, status, error) {
				console.warn(data, textStatus, errorThrown);
			}
		});
	}
});