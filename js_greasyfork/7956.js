// ==UserScript==
// @name            HL eXpansion Pack
// @namespace       http://lei.cz
// @description			Rozšiřuje možnosti Hofylandu - přidává upravitelnou lištu smajlíků
// @icon						data:image/gif;base64,R0lGODlhEAAQAOYAAEBspveZSfrMpP/799Te7PV9F/u+i/V7FK3B2veONTpppVV9sP7q2fzWtT1qpfV+Gvd7EfR5EfWBHkVwqfWAHD5rpT1sqEhzqvaAG/T2+v///n6cw0RvqPWBH/mjWjpno/Z/GnGVw/iwcEVxqZauzXedy//9+/m5gvzfxf3+/tbh7zRlpPegVVh/sfnk0v2NLYijx3OUvviBHPfLpvioZPrBkTxqp/vLo/igVfZ+GMvX5vifVPWAHvmUPYKcvvmwckRwqP3m05642faXRviYR/7Lnf2dSvzz7LDC2oOgxaK41E96sGGFtfWCH/z9///+/faHKvaJLP/48vft5P++h/vVtPzTse7y92qMuoGexf3n1P3KoYihwYmkx/V6EX+iy/aQOfzcv/7y5/mxdfvNpvvOpz9rpuPp8UdyqvipavmmX/vGmf7EkeDi5v/w5PR7E/yiU2+YyPV/Gl2Cs83Y6Fd+sJitykdxqUFtp5yx0Z2z0rzL4PmSOkZxqfWCIP///yH5BAAAAAAALAAAAAAQABAAAAfegH+Cg4SFfwMnNU+GggR6GX9WEWBkWgN/V3QISkgxfTp/LGQGEQlsZ0sADg4VGwtJGThBO2lbP1wrAHgcF1kweQgiYQkBPHBtJXEhFxwVF3ddaw0FcgUeJi4zUypoIxN4WAwCB34UQwYyEC9HX2Z9QHMaN29+fhIPEn4QRUI2fRMt/pShV69gDjUkLPTps+BPFYIF/WDo4UMhwz8o5DSp16EeBj4V/9X5w0BCRwoU6oEwYscfHiZ/pEApcGBHFQkSvFAhoKDChz2CwgSgIUbDmChE3DjRs2FPCkZQ/wQCADs=
// @author          Lei 
// @version         0.4.2
// @grant						none
// @include         *hofyland.cz*
// @require					https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js
// @require					https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js
// @downloadURL https://update.greasyfork.org/scripts/7956/HL%20eXpansion%20Pack.user.js
// @updateURL https://update.greasyfork.org/scripts/7956/HL%20eXpansion%20Pack.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

$(document).ready(function () {

	//localStorage.removeItem("smileList");

	var bgColor, styleInjection, smileList, defaultmileList, newOrderSmileList = [],
		listaSmajliku, prehled, sada, slSettings, slSettingsHTML, slSettingsSummary;

	/**
	 *		Inicializace - pokud existuje seznam smajlíků a zvolená sada v Local Storage, tak se načtou.
	 *									Kdyby seznam byl prázdný, použije se výchozí nastavení
	 *									Když v Local Storage nic není, tak se použije výchozí seznam (a uloží se do Local Storage)
	 */
	function inicialize() {
		if (localStorage.smileList) {
			smileList = JSON.parse(localStorage.smileList);
			if (smileList.length === 0) {
				localStorage.removeItem("smileList");
				localStorage.removeItem("smileListSada");
				alert("Nenalezeny žádné sety smajlíků, obovuji výchozí nastavení.");
				inicialize();
			}
		} else {
			smileList = defaultSmileList;
			localStorage.smileList = JSON.stringify(smileList);
		}
		if (localStorage.smileListSada) {
			sada = parseInt(localStorage.smileListSada);
			if (sada >= smileList.length) {
				sada = smileList.length - 1;
			}
		} else {
			sada = 0;
			localStorage.smileListSada = 0;
		}
	}

	function backgroundColor(element) {
		if (element.css('background-color') === 'rgba(0, 0, 0, 0)') {
			return 'transparent';
		}
		return element.css('background-color');
	}

	var windowsHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
	bgColor = backgroundColor($('#mainw')) === 'transparent' ? backgroundColor($('body')) : backgroundColor($('#mainw'));
	styleInjection = "#vyberSadyWrap {position: relative; display: inline;}" +
		".cf:after { content: ''; display:block; clear:both; }" +
		"#vyberSady {display: none; padding: 25px 5px 5px 5px; position: absolute; top: -10px; right: 0; box-shadow: 0 10px 10px 0 rgba(0, 0, 0, 0.3); background: " + bgColor + ";}" +
		".vyberSady {padding: 5px 15px; margin: 5px auto;}" +
		".vyberSady.active {box-shadow: 0 0 3px #999;}" +
		".vyberSady:hover { box-shadow: 0 0 3px #eee; }" +
		"#vyberSadyWrap:hover #vyberSady {display: block; z-index: 1000; }" +
		"#slSettings { display:none; z-index: 2000; position: fixed; top: 0; left: 0; background: rgba(0, 0, 0, 0.6); height: 100%; width: 100%;}" +
		".closeButton {position: absolute; top: 0; right: 0; color: #fff; background: #d33; width: 40px; height: 25px; line-height: 25px; font-size: 23px; font-weight: 900; margin: 0; padding: 0; text-align: center; cursor: pointer;}" +
		".closeButton:hover { box-shadow: 0 0 3px red; }" +
		".settingsWindowWrap { box-sizing: border-box; padding: 60px; width: 100%; height: 100%; }" +
		".settingsWindow { box-sizing: border-box; padding: 30px; background: #eee; max-width: 100%; max-height: 100%; position: relative;}" +
		".settingsWindow h2 { margin: 10px auto; }" +
		".settingsWindow #slSettingsRowsWrap { width: 100%; height: " + (windowsHeight - 4 * 60) + "px; overflow: auto; }" +
		".settingsWindow #slSettingsRows { display: table; }" +
		".settingsWindow .slRow { background: #eee; border: 1px solid #ddd; padding: 10px; display: table-row; }" +
		".settingsWindow .slRow > div { display: table-cell; vertical-align: middle; }" +
		".settingsWindow .slRow .imgs { width: auto; }" +
		".settingsWindow .slRow .imgs .img { margin: 4px; padding: 10px; cursor: move; position: relative; width: 50px; height: 40px; float: left; border: 1px solid transparent; }" +
		".settingsWindow .slRow .imgs .img:hover {border: 1px solid #ccc; }" +
		".settingsWindow .slRow .imgs .img img { margin: 10px; max-width: 100%; max-height: 100%; }" +
		".settingsWindow .slRow .delete { cursor: pointer; position: absolute; top: 0; right: 0; color: red; font-weight: 900; font-size: 20px;}" +
		".settingsWindow .slRow .addSmile { color: #3a3; font-size: 40px; font-weight: 900; width: 40px; text-align: center; margin: 10px; position: relative; }" +
		".settingsWindow .slRow .addSmile i { cursor: pointer; }" +
		".settingsWindow .rowNr { width: auto; cursor: s-resize; }" +
		".settingsWindow .rowNr strong { width: 2em; height: 2em; color: #fff; background: #22a; border-radius: 50%; border: 1px solid #000; text-align: center; line-height: 1.6em; margin: 10px;  display:block; }" +
		".settingsWindow .settingButtons { margin: 10px auto; }" +
		".settingsWindow .settingButtons a { margin: 10px; cursor: pointer; }" +
		".settingsWindow .settingButtons a i { margin-right: 10px; }" +
		"#importExportDialogOverlay { display: none; z-index: 3000; position: fixed; top: 0; left: 0; background: rgba(0, 0, 0, 0.6); height: 100%; width: 100%;}" +
		"#importExportDialogWrap { position: absolute; top: 50%; left: 50%; height: 300px; width: 500px; margin: -150px 0 0 -250px; background: #eee; padding: 30px; }" +
		"#importExportDialog { height: 100%; width: 100%; }";

	$('<style type="text/css">' + styleInjection + '</style><link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css">').appendTo('head');

	function showSettings() {
		inicialize();
		slSettingsSummary = '<div class="settingsWindow"><h2>Nastavení</h2>\
													<div id="slSettingsRowsWrap">\
													<div id="slSettingsRows">';
		for (var i = 0; i < smileList.length; i++) {
			slSettingsSummary += '<div class="slRow" id="settings_sada_' + i + '">\
															<div class="rowNr"><strong>' + (i + 1) + '.</strong></div>\
															<div class="imgs cf">';
			for (var m = 0; m < smileList[i].length; m++) {
				slSettingsSummary += '	<div class="img" id="smile_' + i + '_' + m + '">\
																	<img src="' + smileList[i][m] + '">\
																	<div id="deleteSmile_' + i + '_' + m + '" class="delete">&times;</div>\
																</div>';
			}
			slSettingsSummary += '	</div>\
															<div class="addSmile"><i class="fa fa-plus-circle" id="addSmile_' + i + '" ></i>\
																<div id="deleteSmileSet_' + i + '" class="delete">&times;</div>\
															</div>\
														</div><!-- /slRow -->';
		}
		slSettingsSummary += '</div><!-- /slSettingRows -->\
													</div><!-- /slSettingRowsWrap -->\
													<div class="settingButtons">\
														<a id="addSmileSet" class="button"><i class="fa fa-plus"></i> Přidat řádek</a>\
														<a id="smileImport" class="button"><i class="fa fa-upload"></i> Import</a>\
														<a id="smileExport" class="button"><i class="fa fa-download"></i> Export</a>\
														<a id="smileReset" class="button"><i class="fa fa-refresh"></i> Reset do výchozího nastavení</a>\
													</div><!-- /settingButtons -->\
													<div id="closeSettings" class="closeButton"><i class="fa fa-times"></i></div>\
													<div id="importExportDialogOverlay">\
														<div id="importExportDialogWrap">\
															<div id="importExportDialog"></div>\
															<div id="closeImportExportDialog" class="closeButton"><i class="fa fa-times"></i></div>\
														</div>\
													</div>\
												</div>';
		$('#settingsWindowWrap').html(slSettingsSummary);
		for (var i = 0; i < smileList.length; i++) {
			(function (sada) {
				$('#addSmile_' + sada).on("click", function () {
					addSmile(sada);
				});
			})(i);
			(function (sada) {
				$('#deleteSmileSet_' + sada).on("click", function () {
					if (confirm("Smazat celý řádek?")) {
						smileList.splice(sada, 1);
						localStorage.smileList = JSON.stringify(smileList);
						inicialize();
						showSettings();
					}
				});
			})(i);
			for (var m = 0; m < smileList[i].length; m++) {
				(function (sada, poradi) {
					$('#deleteSmile_' + sada + '_' + poradi).on("click", function () {
						deleteSmile(sada, poradi);
					});
				})(i, m);
			}
		}
		$("#smileReset").on("click", function (event) {
			if (confirm("Použít výchozí nastavení?")) {
				localStorage.removeItem("smileList");
				localStorage.removeItem("smileListSada");
				inicialize();
				showSettings();
			}
		});
		$("#smileImport").on("click", function (event) {
			$("#importExportDialogOverlay").show("scale", "100%", 300);
			$("#importExportDialog").html('	<textarea style="height: 80%;"></textarea>\
																			<div class="settingButtons">\
																				<a id="importSetAdd" class="button"><i class="fa fa-plus"></i> Přidat za aktuální seznam</a>\
																				<a id="importSetReplace" class="button"><i class="fa fa-refresh"></i> Přepsat aktuální seznam</a>\
																			</div>');
			$("#importSetAdd").on("click", function (event) {
				importSets("add");
			});
			$("#importSetReplace").on("click", function (event) {
				importSets("replace");
			});
		});
		$("#smileExport").on("click", function (event) {
			$("#importExportDialogOverlay").show("scale", "100%", 300);
			$("#importExportDialog").html('<textarea style="height: 100%;">' + JSON.stringify(smileList) + "</textarea>");
			$("#importExportDialog textarea").select();
		});
		$("#closeImportExportDialog").on("click", function (event) {
			$("#importExportDialogOverlay").hide("scale", "100%", 300);
			$("#importExportDialog").html('');
		});
		$("#addSmileSet").on("click", function (event) {
			var placeholder = ["http://www.hofyland.cz/images/smilies/0/1.gif"];
			smileList.push(placeholder);
			localStorage.smileList = JSON.stringify(smileList);
			console.log(smileList);
			inicialize();
			showSettings();
		});
		$("#slSettingsRows").sortable({
			axis: "y",
			update: function (event, ui) {
				var newOrder = $(this).sortable('toArray');
				switchOrder(newOrder);
			}
		});
		$("#slSettingsRows .imgs").sortable({
			connectWith: '#slSettingsRows .imgs',
			update: function (event, ui) {
				var newOrder = [];
				var a = 0;
				$('#slSettingsRows .imgs').each(function () {
					newOrder[a] = $(this).sortable('toArray');
					a++;
				});
				smilePositionChange(newOrder);
			}
		});
		$("#closeSettings").on("click", function (event) {
			slSettings.hide("scale", "100%", 300);
			vykresliListuSmajliku(sada);
		});
	}

	function vykresliListuSmajliku(sada) {
		listaSmajliku = '';
		for (var i = 0; i < smileList[sada].length; i++) {
			listaSmajliku += '<img id="slSmiley_' + sada + '_' + i + '"  src="' + smileList[sada][i] + '"> '
		}
		prehled = '';
		for (var a = 0; a < smileList.length; a++) {
			active = "";
			if (sada === a) {
				active = "active";
			}
			prehled += '<div class="vyberSady ' + active + '" id="slSada_' + a + '"><img src="' + smileList[a][0] + '"></div>';
		}
		prehled += '<input class="button" type="button" id="nastavitSmajliky" value="Nastavení">';
		listaSmajliku += ' <div id="vyberSadyWrap"><input id="slSeznam" class="button" type="button" value="Seznam"><div id="vyberSady">' + prehled + '</div></div> ';
		$('#listaSmajliku').html(listaSmajliku);
		slSettings = $("#slSettings");

		$("#nastavitSmajliky").on("click", function (event) {
			showSettings();
			slSettings.show("scale", "100%", 300);
		});

		for (var m = 0; m < smileList[sada].length; m++) {
			(function (sada, poradi) {
				$('#slSmiley_' + sada + '_' + poradi).on("click", function () {
					vlozit(sada, poradi);
				});
			})(sada, m);
		}

		for (var n = 0; n < smileList.length; n++) {
			(function (sada) {
				$('#slSada_' + sada).on("click", function () {
					vyberSadu(sada)
				});
			})(n);
		}
	}

	function importSets(type) {
		newSets = $.trim($("#importExportDialog textarea").val());
		var error = 'Neplatný formát vstupních dat.';
		if (newSets.length > 20) {
			try {
				newSets = JSON.parse(newSets);
				if (newSets[0].constructor === Array) { // vstup je vícerozměrné pole
					if (type === 'add') {
						for (x = 0; x < newSets.length; x++) {
							smileList.push(newSets[x]);
						}
					} else {
						smileList = newSets;
					}
				} else if (newSets.constructor === Array) { //vstup je pole
					if (type === 'add') {
						smileList.push(newSets);
					} else {
						smileList.splice(0, smileList.length);
						smileList.push(newSets);
					}
				} else throw "Na vstupu není pole";
			} catch (err) {
				console.log(err);
				alert(error);
			}
		} else {
			alert(error);
		}
		localStorage.smileList = JSON.stringify(smileList);
		showSettings();
	}

	function addSmile(sada) {
		var address = prompt("Vložte adresu obrázku, včetně http://");
		if (address !== null) {
			smileList[sada].push(address);
		}
		localStorage.smileList = JSON.stringify(smileList);
		showSettings();
	}

	function deleteSmile(sada, poradi) {
		if (confirm("Opravdu smazat?")) {
			smileList[sada].splice(poradi, 1);
			localStorage.smileList = JSON.stringify(smileList);
		}
		showSettings();
	}

	function vlozit(sada, poradi) {
		var odkaz_na_obrazek = " img:" + smileList[sada][poradi] + " ";
		var cursorPosition;
		textArea = $("textarea")[0];
		cursorPosition = textArea.selectionStart;

		textArea.value = textArea.value.substring(0, cursorPosition) + odkaz_na_obrazek + textArea.value.substring(cursorPosition, textArea.value.length);
		textArea.setSelectionRange(cursorPosition + odkaz_na_obrazek.length, cursorPosition + odkaz_na_obrazek.length);
		textArea.focus();
	}

	function switchOrder(newOrder) {
		var oldPosition;
		for (var n = 0; n < newOrder.length; n++) {
			oldPosition = newOrder[n].slice(14, newOrder[n].length);
			newOrderSmileList[n] = smileList[oldPosition];
		}
		smileList = newOrderSmileList;
		localStorage.smileList = JSON.stringify(smileList);
		showSettings();
	}

	function smilePositionChange(newOrder) {
		var oldPositionSet, oldPositionSmile, helper, listHelper = [];
		for (var m = 0; m < newOrder.length; m++) {
			listHelper = [];
			for (var n = 0; n < newOrder[m].length; n++) {
				helper = newOrder[m][n].split('_');
				oldPositionSet = helper[1];
				oldPositionSmile = helper[2];
				listHelper[n] = smileList[oldPositionSet][oldPositionSmile];
			}
			newOrderSmileList[m] = listHelper;
		}
		smileList = newOrderSmileList;
		localStorage.smileList = JSON.stringify(smileList);
		showSettings();
	}

	function vyberSadu(vyber) {
		localStorage.smileListSada = vyber;
		vykresliListuSmajliku(vyber);
	}

	inicialize();

	if ($(".smiley").length) {
		slSettingsHTML = '<div id="slSettings"><div id="settingsWindowWrap" class="settingsWindowWrap"></div>';
		$(".smiley").parent().html('<div id="listaSmajliku"></div>' + slSettingsHTML);
		vykresliListuSmajliku(sada);
	}

});

var defaultSmileList = [[
"http://www.hofyland.cz/images/smilies/0/1.gif",
"http://www.hofyland.cz/images/smilies/0/2.gif",
"http://www.hofyland.cz/images/smilies/0/3.gif",
"http://www.hofyland.cz/images/smilies/0/4.gif",
"http://www.hofyland.cz/images/smilies/0/5.gif",
"http://www.hofyland.cz/images/smilies/0/6.gif",
"http://www.hofyland.cz/images/smilies/0/7.gif",
"http://www.hofyland.cz/images/smilies/0/8.gif",
"http://www.hofyland.cz/images/smilies/0/9.gif",
"http://www.hofyland.cz/images/smilies/0/10.gif",
"http://www.hofyland.cz/images/smilies/0/11.gif",
"http://www.hofyland.cz/images/smilies/0/12.gif",
"http://www.hofyland.cz/images/smilies/0/13.gif",
"http://www.hofyland.cz/images/smilies/0/14.gif",
"http://www.hofyland.cz/images/smilies/0/15.gif",
"http://www.hofyland.cz/images/smilies/0/16.gif",
"http://www.hofyland.cz/images/smilies/0/18.gif",
"http://www.hofyland.cz/images/smilies/0/19.gif",
"http://www.hofyland.cz/images/smilies/0/20.gif",
"http://www.hofyland.cz/images/smilies/0/21.gif",
"http://www.hofyland.cz/images/smilies/0/22.gif",
"http://www.hofyland.cz/images/smilies/0/23.gif",
"http://www.hofyland.cz/images/smilies/0/24.gif",
"http://www.hofyland.cz/images/smilies/0/25.gif",
"http://www.hofyland.cz/images/smilies/0/26.gif",
"http://www.hofyland.cz/images/smilies/0/27.gif",
"http://www.hofyland.cz/images/smilies/0/28.gif"
],
[
"http://www.hofyland.cz/images/smilies/1/1.gif",
"http://www.hofyland.cz/images/smilies/1/2.gif",
"http://www.hofyland.cz/images/smilies/1/3.gif",
"http://www.hofyland.cz/images/smilies/1/4.gif",
"http://www.hofyland.cz/images/smilies/1/5.gif",
"http://www.hofyland.cz/images/smilies/1/6.gif",
"http://www.hofyland.cz/images/smilies/1/7.gif",
"http://www.hofyland.cz/images/smilies/1/8.gif",
"http://www.hofyland.cz/images/smilies/1/9.gif",
"http://www.hofyland.cz/images/smilies/1/10.gif",
"http://www.hofyland.cz/images/smilies/1/11.gif",
"http://www.hofyland.cz/images/smilies/1/12.gif",
"http://www.hofyland.cz/images/smilies/1/13.gif",
"http://www.hofyland.cz/images/smilies/1/14.gif",
"http://www.hofyland.cz/images/smilies/1/15.gif",
"http://www.hofyland.cz/images/smilies/1/16.gif",
"http://www.hofyland.cz/images/smilies/1/18.gif",
"http://www.hofyland.cz/images/smilies/1/19.gif",
"http://www.hofyland.cz/images/smilies/1/20.gif",
"http://www.hofyland.cz/images/smilies/1/21.gif",
"http://www.hofyland.cz/images/smilies/1/22.gif",
"http://www.hofyland.cz/images/smilies/1/23.gif",
"http://www.hofyland.cz/images/smilies/1/24.gif",
"http://www.hofyland.cz/images/smilies/1/25.gif"
]
];