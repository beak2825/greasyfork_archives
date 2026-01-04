// ==UserScript==
// @name           GLB Player Page Enhancements S118+
// @namespace      Sea Wasps Org - Tampermonkey
// @description    Puts 5 tabs above the player attributes table, allowing for a more customised look at a player's build.  Also fixed the overflow on speed.
// @namespace      SeattleNiner
// @version        4.2.4
// @include        http://glb.warriorgeneral.com/game/player.pl?player_id=*
// @include        https://glb.warriorgeneral.com/game/player.pl?player_id=*
// @require        https://greasyfork.org/scripts/12092-jquery-javascript-library-v1-4-2/code/jQuery%20JavaScript%20Library%20v142.js?version=71384
// @license MIT
// @grant          GM_setValue
// @grant          GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/559867/GLB%20Player%20Page%20Enhancements%20S118%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/559867/GLB%20Player%20Page%20Enhancements%20S118%2B.meta.js
// ==/UserScript==

// --- USER EDITABLE SETTINGS ---
// Options: 'baseStats', 'normalStats', 'baseBonusStats', 'bonusStats', 'ALG79Stats'
var defaultTab = 'normalStats';

// Set to true to ALWAYS load the defaultTab above.
// Set to false to remember the last tab you clicked.
var persistent = true;
// ------------------------------

var bonus = {'Strength':0,'Speed':0,'Agility':0,'Jumping':0,'Stamina':0,'Vision':0,'Confidence':0,'Blocking':0,'Tackling':0,'Throwing':0,'Catching':0,'Carrying':0,'Kicking':0,'Punting':0};
var colorMajor = '#a03c19', colorMinor = '#a000a0', colorOther = '#606060';
var attColor = [[colorOther, colorOther, '#6060ff'],[colorMinor, colorMinor, '#2020ff'],[colorMajor, colorMajor, 0]];
var allBuilds = {}, position, buildTypes, archetype;

function createLegend() {
	$('.player_stats_table').eq(0).css('margin-bottom', '4px').after(
		'<div id="colorKeyDiv" style="font-weight: bold; text-align: center; margin-bottom: 4px;">Next Auto Level Gain' +
			' = <span id="keyMajor" style="color: ' + attColor[2][0] + '">Major</span>' +
			' / <span id="keyMinor" style="color: ' + attColor[1][0] + '">Minor</span>' +
			' / <span id="keyOther" style="color: ' + attColor[0][0] + '">Zero</span>' +
			'<div id="colorKeyDiv_79" style="font-weight: bold; text-align: center; margin-bottom: 4px;">ALGs to Lv79' +
			' = <span id="keyMajor_79" style="color: ' + attColor[2][0] + '">Major</span>' +
			' / <span id="keyMinor_79" style="color: ' + attColor[1][0] + '">Minor</span>'
	);
}

function createDropDown(buildTypes, archetype) {
	var selectBuild = '<select id="selectBuild" style="float: right; font-weight: normal; font-size: 9px;">';
	$.each(buildTypes, function () {
		selectBuild += '<option value="' + this[0] + '"' + (archetype === this[0] ? ' style="font-weight: bold; color: #a03c19;" selected="selected"' : '') + '>' + this[0] + '</option>';
	});
	selectBuild += '</select>';
	$('#player_stats div.medium_head').eq(0).prepend(selectBuild).change(function (e) {
		highlightAttributes(buildTypes, $(this).find(':selected').val());
	});
}

function highlightAttributes(buildTypes, selectedName) {
	if (!selectedName) selectedName = $('#selectBuild').find(':selected').val();
	if (!selectedName) return;
	var b = allBuilds[selectedName];
	if (!b) {
		$.each(buildTypes, function () {
			if (this[0] === selectedName) {
				allBuilds[selectedName] = b = new build(this);
				return false;
			}
		});
	}
	$('div.stat_head_tall').each(function (i, attName) {
		var a = $(attName).text().slice(0, 3);
		var majmin = b.affectedAtts[a] || 0;
		$(attName).css('color', attColor[majmin][0]).next('div').each(function (j, attVal) {
			$(attVal).css('color', $(attVal).hasClass('stat_value_tall_boosted') ? (attColor[majmin][2] || '') : (attColor[majmin][1] || ''));
		});
	});
	var level = parseInt($('#player_current_stats_table .current_stats_value').eq(0).text().split('/')[0], 10);
	function ALG(l, mm, tgtLv) {
		if (!parseInt(tgtLv, 10) || tgtLv <= l) tgtLv = l + 1;
		if (l >= 79 && tgtLv === 79) return 0;
		var out = 0;
		while (l < tgtLv) {
			var gain = mm * ((l <= 20) ? 1 : (l <= 28) ? 0.75 : (l <= 36) ? 0.5625 : 0.421875) / b.affectedAtts[mm];
			out += gain;
			out = Math.floor(out * 1000) / 1000;
			++l;
		}
		return out;
	}
	if (level >= 79) {
		$('#colorKeyDiv_79').hide();
		$('#keyMajor_79, #keyMinor_79').html('0');
	} else {
		$('#colorKeyDiv_79').show();
		$('#keyMajor_79').html(ALG(level, 2, 79));
		$('#keyMinor_79').html(ALG(level, 1, 79));
	}
	$('#keyMajor').html(ALG(level, 2));
	$('#keyMinor').html(ALG(level, 1));
}

function build(args) {
	this.name = args[0];
	this.affectedAtts = { 0: 14, 1: 0, 2: 0 };
	var me = this;
	if (args[1]) $.each(args[1].split(','), function () { me.affectedAtts[this] = 2; ++me.affectedAtts[2]; --me.affectedAtts[0]; });
	if (args[2]) $.each(args[2].split(','), function () { me.affectedAtts[this] = 1; ++me.affectedAtts[1]; --me.affectedAtts[0]; });
}

function getArchetype() {
	var atImg = $('#player img[src^="/images/game/archetypes/"]');
	return (atImg.length === 1 ? atImg.parent().html().split("'")[1] : 'No Archetype').replace('Linebacker', 'LB').replace(' Receiver', ' Rec');
}

function setupOtherViews() {
	$('#player_stats > table.player_stats_table').before('<div id="statsDivs"><div id="statsTabBar" class="subhead_link_bar" style="width: 500px; position: static;"><div id="tab_baseStats" class="tab_off"><a href="javascript:;">Base</a></div><div id="tab_normalStats" class="tab_off"><a href="javascript:;">Base+EQ</a></div><div id="tab_baseBonusStats" class="tab_off"><a href="javascript:;">Base+Bon</a></div><div id="tab_bonusStats" class="tab_off"><a href="javascript:;">Base+EQ+Bon</a></div><div id="tab_ALG79Stats" class="tab_off"><a href="javascript:;">Base@79</a></div></div><div id="statsTables"><div id="baseStats"></div><div id="normalStats"></div><div id="baseBonusStats"></div><div id="bonusStats"></div><div id="ALG79Stats"></div></div></div>');

	$('#normalStats').hide().append($('#player_stats > table.player_stats_table'));
	$('#baseStats').hide().append($('#normalStats table.player_stats_table').clone());

	$('#baseStats div.stat_value_tall_boosted').each(function () {
		var rawVal = eval($(this).text().replace('(', '').replace('+', '-').replace(')', ''));
		$(this).text(Math.round(rawVal * 100) / 100);
	});

	$('#bonusStats').hide().append($('#normalStats table.player_stats_table').clone());
	$('#baseBonusStats').hide().append($('#baseStats table.player_stats_table').clone());
	$('#ALG79Stats').hide().append($('#baseStats table.player_stats_table').clone());

	$('#player_stats table.column_320').find('tr.alternating_color1, tr.alternating_color2').each(function () {
		if (bonus[$(this).find('td').eq(0).text()] === undefined) return;
		bonus[$(this).find('td').eq(0).text()] = parseFloat($(this).find('td').eq(1).text());
	});

	var major79 = parseFloat($('#keyMajor_79').text()) || 0;
	var minor79 = parseFloat($('#keyMinor_79').text()) || 0;
	var arch = allBuilds[getArchetype()];

	$('#bonusStats, #baseBonusStats, #ALG79Stats, #normalStats').find('div.stat_head_tall').each(function () {
		var a = $(this).text().replace(':', '');
		var $v = $(this).next();
		var isBoostedField = $v.hasClass('stat_value_tall_boosted');
		var currentTabId = $(this).closest('div[id]').attr('id');

		var baseVal = parseFloat($v.text());
		var eqBonus = 0;

		if (isBoostedField) {
			var parts = $v.text().match(/\((.+)\)/);
			if (parts) {
				eqBonus = parseFloat(parts[1].replace('+', ''));
				baseVal = baseVal - eqBonus;
			}
		}

		var newVal = baseVal;
		if (currentTabId === 'bonusStats' || currentTabId === 'normalStats') newVal += eqBonus;
		if (bonus[a] && (currentTabId === 'bonusStats' || currentTabId === 'baseBonusStats')) newVal += bonus[a];
		if (currentTabId === 'ALG79Stats' && arch) {
			var weight = arch.affectedAtts[a.slice(0, 3)] || 0;
			newVal += (weight === 2) ? major79 : (weight === 1 ? minor79 : 0);
		}

		var displayTotal = Math.round(newVal * 100) / 100;
		if (eqBonus !== 0 && (currentTabId === 'bonusStats' || currentTabId === 'normalStats')) {
			$v.text(displayTotal + ' (+' + eqBonus + ')');
		} else {
			$v.text(displayTotal);
		}
	});

	function clickStatsTab(tab) {
		$('#statsTables > div').hide();
		$('#' + tab).show();
		$('#statsTabBar > div').addClass('tab_off').removeClass('tab_on');
		$('#tab_' + tab).addClass('tab_on').removeClass('tab_off');
		var hideBnP = (tab.indexOf('onus') != -1 || tab === 'ALG79Stats');
		$('#player_stats table.column_320').find('tr.alternating_color1, tr.alternating_color2').each(function () {
			var att = $(this).find('td').eq(0).text();
			if (bonus[att] !== undefined) { (hideBnP) ? $(this).hide() : $(this).show(); }
		});
		GM_setValue('statsView', tab);
	}

	$('#tab_normalStats').click(function () { clickStatsTab('normalStats'); });
	$('#tab_baseStats').click(function () { clickStatsTab('baseStats'); });
	$('#tab_baseBonusStats').click(function () { clickStatsTab('baseBonusStats'); });
	$('#tab_bonusStats').click(function () { clickStatsTab('bonusStats'); });
	$('#tab_ALG79Stats').click(function () { clickStatsTab('ALG79Stats'); });

	// Apply persistence logic
	var targetTab = persistent ? defaultTab : GM_getValue('statsView', defaultTab);
    // Safety check in case a legacy "nakedStats" value was stored in user's browser
    if (targetTab === 'nakedStats') targetTab = 'baseStats';
	clickStatsTab(targetTab);
}

function getBuilds(pos) {
	switch(pos) {
		case 'FB': return [['No Archetype','Str,Agi,Blo,Car','Sta,Vis,Con,Tac,Cat'],['Rusher','Agi,Car,Con,Str','Blo,Spe,Sta,Vis'],['Blocker','Agi,Blo,Str,Vis','Car,Con,Spe,Sta'],['Combo Back','Agi,Blo,Car,Str,Vis','Cat,Con,Jum,Spe'],['Scat Back','Agi,Cat,Spe,Vis','Blo,Car,Con,Jum'],['Special Teamer','Agi,Blo,Spe,Sta,Tac','Con,Str,Vis']];
		case 'QB': return [['No Archetype','Str,Sta,Vis,Con,Thr','Spe,Agi,Jum,Cat,Car'],['Pocket Passer','Con,Thr,Vis','Agi,Sta,Str,Car'],['Deep Passer','Str,Thr,Vis','Agi,Con,Sta,Car'],['Scrambler','Agi,Thr,Vis','Con,Spe,Str,Car']];
		case 'HB': return [['No Archetype','Str,Spe,Agi,Vis,Con,Car','Jum,Sta,Blo,Thr,Cat'],['Power Back','Agi,Car,Con,Str','Jum,Spe,Sta,Vis'],['Elusive Back','Agi,Car,Spe,Vis','Cat,Con,Str'],['Scat Back','Agi,Car,Cat,Spe','Con,Jum,Sta,Vis'],['Combo Back','Car,Con,Spe,Str,Vis','Agi,Cat,Jum,Sta'],['Returner','Agi,Car,Spe,Sta,Vis','Con,Jum,Str'],['Special Teamer','Agi,Blo,Spe,Sta,Tac','Con,Str,Vis']];
		case 'WR': return [['No Archetype','Spe,Agi,Jum,Sta,Vis','Con,Car'],['Speedster','Agi,Cat,Con,Spe,Vis','Car,Jum,Sta'],['Possession Rec','Agi,Car,Cat,Jum,Vis','Con,Spe,Sta'],['Power Rec','Agi,Car,Cat,Str,Vis','Con,Spe,Sta'],['Returner','Agi,Car,Spe,Sta,Vis','Con,Jum,Str'],['Special Teamer','Agi,Blo,Spe,Sta,Tac','Con,Str,Vis']];
		case 'TE': return [['No Archetype','Str,Vis,Blo,Cat','Spe,Agi,Sta,Con,Tac,Car'],['Blocker','Agi,Blo,Con,Str,Vis','Cat,Spe,Sta'],['Power Rec','Agi,Car,Con,Cat,Str','Blo,Spe,Sta'],['Receiver','Agi,Car,Cat,Spe,Vis','Blo,Sta,Str'],['Dual Threat','Agi,Blo,Cat,Str,Vis','Con,Jum,Spe'],['Special Teamer','Agi,Blo,Spe,Sta,Tac','Con,Str,Vis']];
		case 'C':  return [['No Archetype','Str,Blo','Agi,Sta,Vis,Con,Tac'],['Pass Blocker','Agi,Blo,Con,Vis','Spe,Sta,Str'],['Run Blocker','Blo,Con,Str,Vis','Agi,Spe,Sta'],['Special Teamer','Agi,Blo,Spe,Sta,Tac','Con,Str,Vis']];
		case 'G':  return [['No Archetype','Str,Con,Blo','Agi,Sta,Vis,Tac'],['Pass Blocker','Agi,Blo,Con,Vis','Spe,Sta,Str'],['Run Blocker','Blo,Con,Str,Vis','Agi,Spe,Sta'],['Special Teamer','Agi,Blo,Spe,Sta,Tac','Con,Str,Vis']];
		case 'OT': return [['No Archetype','Str,Agi,Vis,Con,Blo','Sta,Tac'],['Pass Blocker','Agi,Blo,Con,Vis','Spe,Sta,Str'],['Run Blocker','Blo,Con,Str,Vis','Agi,Spe,Sta'],['Special Teamer','Agi,Blo,Spe,Sta,Tac','Con,Str,Vis']];
		case 'DT': return [['No Archetype','Str,Agi,Tac','Spe,Sta,Vis,Con,Blo'],['Run Stuffer','Agi,Str,Tac,Vis','Con,Spe,Sta'],['Pass Rusher','Agi,Spe,Tac,Vis','Con,Sta,Str'],['Combo Tackle','Spe,Str,Tac,Vis','Agi,Con,Sta'],['Special Teamer','Agi,Blo,Spe,Sta,Tac','Con,Str,Vis']];
		case 'DE': return [['No Archetype','Str,Spe,Agi,Tac','Jum,Sta,Vis,Con,Blo'],['Run Stuffer','Agi,Str,Tac,Vis','Con,Spe,Sta'],['Pass Rusher','Agi,Spe,Tac,Vis','Con,Sta,Str'],['Combo End','Spe,Str,Tac,Vis','Agi,Con,Sta'],['Special Teamer','Agi,Blo,Spe,Sta,Tac','Con,Str,Vis']];
		case 'LB': return [['No Archetype','Str,Agi,Sta,Vis,Con,Tac','Spe,Jum,Blo,Cat'],['Coverage LB','Agi,Jum,Spe,Vis','Con,Sta,Str,Tac'],['Blitzer','Agi,Jum,Spe,Tac','Con,Sta,Str,Vis'],['Hard Hitter','Agi,Str,Tac,Vis','Con,Jum,Spe,Sta'],['Combo LB','Agi,Con,Spe,Tac,Vis','Jum,Sta,Str'],['Special Teamer','Agi,Blo,Spe,Sta,Tac','Con,Str,Vis']];
		case 'CB': return [['No Archetype','Spe,Agi,Jum,Sta,Vis,Cat','Str,Con,Tac,Car'],['Man Specialist','Agi,Jum,Spe,Vis','Cat,Con,Sta,Tac'],['Zone Specialist','Agi,Spe,Tac,Vis','Cat,Con,Jum,Sta'],['Hard Hitter','Spe,Str,Tac,Vis','Agi,Con,Jum,Sta'],['Combo Corner','Agi,Spe,Str,Tac','Con,Jum,Sta,Vis'],['Returner','Agi,Car,Spe,Sta,Vis','Con,Jum,Str'],['Special Teamer','Agi,Blo,Spe,Sta,Tac','Con,Str,Vis']];
		case 'SS': return [['No Archetype','Str,Spe,Sta,Vis,Tac','Agi,Jum,Con,Blo,Cat,Car'],['Man Specialist','Agi,Jum,Spe,Vis','Cat,Con,Sta,Tac'],['Zone Specialist','Agi,Spe,Tac,Vis','Cat,Con,Jum,Sta'],['Hard Hitter','Spe,Str,Tac,Vis','Agi,Con,Jum,Sta'],['Combo Safety','Agi,Spe,Str,Tac','Con,Jum,Sta,Vis'],['Special Teamer','Agi,Blo,Spe,Sta,Tac','Con,Str,Vis']];
		case 'FS': return [['No Archetype','Spe,Sta,Vis,Tac,Cat','Str,Agi,Jum,Con,Blo,Car'],['Man Specialist','Agi,Jum,Spe,Vis','Cat,Con,Sta,Tac'],['Zone Specialist','Agi,Spe,Tac,Vis','Cat,Con,Jum,Sta'],['Hard Hitter','Spe,Str,Tac,Vis','Agi,Con,Jum,Sta'],['Combo Safety','Agi,Spe,Str,Tac','Con,Jum,Sta,Vis'],['Special Teamer','Agi,Blo,Spe,Sta,Tac','Con,Str,Vis']];
		case 'K':  return [['No Archetype','Con,Kic','Str,Spe,Agi,Jum,Vis,Thr'],['Boomer','Con,Kic,Str','Agi,Jum,Vis'],['Technician','Con,Kic,Vis','Agi,Jum,Str']];
		case 'P':  return [['No Archetype','Con,Pun','Str,Spe,Agi,Jum,Vis,Thr'],['Boomer','Con,Pun,Str','Agi,Jum,Vis'],['Technician','Con,Pun,Vis','Agi,Jum,Str']];
	}
}

// EXECUTION
position = $('.position').eq(0).text();
buildTypes = getBuilds(position);
archetype = getArchetype();
createLegend();
createDropDown(buildTypes, archetype);
highlightAttributes(buildTypes, archetype);
setupOtherViews();