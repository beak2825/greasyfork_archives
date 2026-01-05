// ==UserScript==
// @name        F-List Kinks Calculator
// @namespace   flistkinkscalculator
// @description Generates an estimated compatibility score when comparing character kinks.
// @version     1.1.2
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABh0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzT7MfTgAAA4dJREFUWIXFl19oHFUUxn/nbswsbRBDS2jzog9BH2JdhFokVJqA0AcfpI2CoKAvYqlUaqFQUGnBCi2KihYJNCp5FamCCg0V3aBg81LQog/+oVk27UOyNG0C7Y7ZuceHZGbu7E5mdtMUD/twvjsz53733O+cu1dUlf/TugBEBABVPQicCgJbcF+y1obPSSMcfu/6xpjEO43AXvG6u14FZkSkEsYRVUVEUNUh4J2rc4veC0c+fLx5knjetIxJEjlQVbHWsnVLr3/uzOGLwBTwOVCJCAB7gBOjx74YtkEDMYkEbIiJCDZo8PDAdt5+ZaQMjAAk8jRf+Z3bS9c3fHKAxr91bi9dZ6pcTox3tbypirt9J18s4ft+xxN6nsebE7/GAwWT+l4rAWneURgYGOiYQLVaTcQxq8KwNlibgLUBgmBMM4X1mRtntZDQLALhQ+PI+NMLs8Ds+gi45RCWesgkjYC1AUiS+bX5G+uaHJJxNOo1ORkQkk1k7OjeyD/w7mTHODRrQg1kZEBtgIhp6WLxisy6cZiLTA1YGyCS3LtqtRoHFOkYx2Ta0ED4sODU7Hvn/or8QsF0jENrRCLM00BTBj54bSTyX//ox1x8ZF/cM97/6u/IN5EI86oASZaPY83jneDQzWxEcRWsoQEjuThBwMGmnS0I+4B7vn/8zRVnFZKLXUv7n5AjwtYMnDrwROQfG/spF7vmxhHTpgjvlgbCerB5IhS5Mw1MT087eHvkS7tl2Mz87GSyseTh3270OziO3XYj6unp2bDj2DXP8yjc42VnAGC2OsMfl5Jiiv8J68qvaR9FzGqzl5ZKCG3zfX30PbAjuxEBmKUKmybH2Qz0eR43fR8feH5iAmMMjUYjdQKRtSc3xqyegnU23RzMJvDD12d5VsYpeR67tm1jslIBYHR0NDU4rByxzcdsmtXrdS788mc2Ad/3eRA4NDhIwRge6+2lfPnymqsLv6nVarkElpeXW8YSBB7d8RAvHTrOy8Ui1lpUlYXFRRSYm5vLDF4sFiNfNXk5Aeju7qa/v5/h3f+kEpgBFk8fP8wbJ8+gqswvLPDJk89w8Psvsdby1unx3BXm2fDunTy3by+s3I6A+GY0BHwG3A9c/E5kDyBPqZar58/fe2n//keevnXr5ztmsGJTInIiqqy0y+a3YGulkgKMwdB8qZSvsA4tuuimEaiVSkHKN3eFwH8EALqp+4E4kAAAAABJRU5ErkJggg==
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @match       *://www.f-list.net/c/*
// @grant       unsafeWindow
// @grant       GM.getValue
// @grant       GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/5977/F-List%20Kinks%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/5977/F-List%20Kinks%20Calculator.meta.js
// ==/UserScript==

/* globals $ exportFunction */

var FList = unsafeWindow.FList;

// Descriptions for your scores.
var ratingNames = [
	{score: -1.00, confidence: 0.00, desc: "Uncertain"},
	{score: -1.00, confidence: 0.20, desc: "Are you fucking kidding me?"},
	{score: -0.30, confidence: 0.15, desc: "Hell No!"},
	{score: -0.15, confidence: 0.15, desc: "Nope"},
	{score:  0.00, confidence: 0.15, desc: "Terrible"},
	{score:  0.20, confidence: 0.20, desc: "Poor"},
	{score:  0.40, confidence: 0.20, desc: "Average"},
	{score:  0.60, confidence: 0.30, desc: "Good"},
	{score:  0.75, confidence: 0.40, desc: "Very Good"},
	{score:  0.85, confidence: 0.50, desc: "Excellent!"}
];

// The different scoring matrices available for selection.
// 1st dimension is your character's kink. 2nd dimension is the other character.
var scoringProfiles = [
	{
		name: "Unbiased",
		matrix: {
			fave:  {fave: 4, yes: 3, maybe: 1, no:-2},
			yes:   {fave: 3, yes: 3, maybe: 1, no:-1},
			maybe: {fave: 1, yes: 1, maybe: 1, no: 0},
			no:    {fave:-2, yes:-1, maybe: 0, no: 0}
		}
	}, {
		name: "Self-Biased",
		matrix: {
			fave:  {fave: 4, yes: 3, maybe: 2, no:-4},
			yes:   {fave: 3, yes: 3, maybe: 1, no:-2},
			maybe: {fave: 1, yes: 1, maybe: 1, no: 0},
			no:    {fave:-1, yes:-1, maybe: 0, no: 0}
		}
	}
];

// Giving/Receiving kink pairs
var asymmetricalKinks = {
	16  : 163, 163 : 16, // Rimming
	157 : 137, 137 : 157, // Anal
	158 : 141, 141 : 158, // Oral
	340 : 229, 229 : 340, // Vaginal
	514 : 512, 512 : 514, // Fellatio
	515 : 513, 513 : 515, // Cunnilingus
	422 : 423, 423 : 422 // Vore
};

// Class names for fave, yes, maybe, no
var quickCompareClasses = [
	'Character_QuickCompareNo',
	'Character_QuickCompareMaybe',
	'Character_QuickCompareYes',
	'Character_QuickCompareFave'
];


var statusText = $('<span id="KinkCalculatorStatus" style="padding-left:0.5em">');
var scoringProfileSelector = $('<select id="KinkCalculatorProfileSelector">').width('auto');

for (var p in scoringProfiles) {
	scoringProfileSelector.append($('<option>').val(p).append(scoringProfiles[p].name));
}

// Insert our own controls.
$('#Character_QuickCompareClear').after(statusText);
$('#Character_QuickCompareSelect').width('auto').after(scoringProfileSelector).after(" Scoring profile: ");

// Insert our own function into the default Quick Compare function.
var oldCompare = FList.Character_quickCompare;

var newCompare = function(clear) {
	console.log("Running a comparison...");
	oldCompare(clear);
	kinkCalculator(clear);
};

exportFunction(newCompare, FList, {defineAs: "Character_quickCompare"});


function kinkCalculator(clear) {
	statusText.empty();

	$('.KinkCalculatorBreakdown, .KinkCalculatorAsym').remove();

	if (clear) return;

	statusText.text("Getting character kinks...");

	var char1 = {
		id:   $('#Character_QuickCompareSelect').val(),
		name: $('#Character_QuickCompareSelect').find(":selected").text()
	};
	var char2 = {
		id:   $('#profile-character-id').val(),
		name: $('#profile-character-name').val()
	};
	var profile = scoringProfileSelector.val();

	var dataSource = '/json/getFetishes.php';
	$.getJSON(dataSource, {character_id: char1.id, id_only: true}, function (a) {
		$.getJSON(dataSource, {character_id: char2.id, id_only: true}, function (b) {
			char1.kinks = a;
			char2.kinks = b;
			showScore(char1, char2, profile);
		});
	});
}


function calculateKinks(kinks1, kinks2, matrix) {
	var total = 0;
	var gross = 0;
	var positive = 0;
	var negative = 0;
	var neutral = 0;
	var misses = 0;

	for (var fid1 in kinks1) {
		var fid2 = asymmetricalKinks[fid1] ? asymmetricalKinks[fid1] : fid1;

		if (kinks2[fid2]) {
			var v = matrix[kinks1[fid1]][kinks2[fid2]];
			total += v;
			gross += Math.abs(v);

			if (v > 0) positive++;
			else if (v < 0) negative++;
			else neutral++;

			var fItem1 = $('#Character_ListedFetish' + fid1);
			var fItem2 = $('#Character_ListedFetish' + fid2);

			if (fid1 !== fid2) {
				// Remap the highlighted kink element
				fItem2.addClass(fItem1.attr('class'))
					.attr('title', 'Kinks Calculator re-mapped to this kink using its giving/receiving rules')
					.append(' <b class="KinkCalculatorAsym">&#8651;</b>');

				if (!fItem1.data('KinkCalculatorValue')) {
					fItem1.removeClass(quickCompareClasses.join(' ') + ' Character_QuickCompareActive');
				}
			}

			fItem2.data('KinkCalculatorValue', v)
				.append(' <b class="KinkCalculatorBreakdown">' + (v < 0 ? '' : '+') + v + '</b>');
		}
		else {
			misses++;
		}
	}

	var score = total / gross;
	var certainty = (3*positive + 2*negative + neutral) / (3*positive + 2*negative + neutral + misses);

	var rating = getRating(score, certainty);

	return {
		total:     total,
		gross:     gross,
		positive:  positive,
		negative:  negative,
		neutral:   neutral,
		misses:    misses,
		score:     score,
		rating:    rating,
		certainty: certainty
	};
}

function getRating(score, confidence) {
	var rating = "?";

	for (var r in ratingNames) {
		if (score >= ratingNames[r].score && confidence >= ratingNames[r].confidence) {
			rating = ratingNames[r].desc;
		}
	}

	return rating;
}

function showScore(char1, char2, profile) {
	statusText.text("Scoring...");

	var result = calculateKinks(jsonKinksToMap(char1.kinks), jsonKinksToMap(char2.kinks), scoringProfiles[profile].matrix);

	var altColorMode = GM.getValue('altColorMode', false);

	var breakdownDetails =
		"Compare " + char1.name + " (" + char1.id + ") and " + char2.name+ " (" + char2.id + ")\n\n" +
		"Hits: " + result.positive + " positive, " + result.negative + " negative, " + result.neutral + " neutral\n" +
		"Misses: " + result.misses + "\n" +
		"Points (sum of all hit values): " + result.total + "\n" +
		"Gross (sum of absolute hit values): " + result.gross + "\n" +
		"Score (points / gross): " + toPercent(result.score, 1) + "\n" +
		"Confidence (based on hits / hits + misses): " + toPercent(result.certainty, 1);

	statusText.empty().append(
		'<b>Score:</b> ',
		$('<a href="#">' + toPercent(result.score, 0) + '</a>').click(function(){alert(breakdownDetails); return false;}),
		' &nbsp; ',
		'<b>Confidence:</b> ' + toPercent(result.certainty, 0) + ' &nbsp; ',
		'<b>Rating:</b> ' + result.rating + ' &nbsp; ',
		$('<label for="KinkCalculatorAltColorMode"> Color based on points</label>')
			.prepend($('<input type="checkbox" id="KinkCalculatorAltColorMode"/>')
				.attr('checked', altColorMode ? 'checked' : null)
				.change(toggleQuickCompareColors))
	);

	toggleQuickCompareColors();
}


function toggleQuickCompareColors() {
	var altColorMode = $('#KinkCalculatorAltColorMode').is(':checked');
	GM.setValue('altColorMode', altColorMode);

	var classesJoined = quickCompareClasses.join(' ');

	$('.Character_QuickCompareActive').each(function(idx, el) {
		var e = $(el);

		if (altColorMode) {
			e.data('OldClasses', e.attr('class'));
			e.removeClass(classesJoined);
			var v = parseInt(e.data('KinkCalculatorValue'));
			var c = v > 3 ? 3 : v > 0 ? 2 : v < 0 ? 0 : 1;
			e.addClass(quickCompareClasses[c]);
		}
		else {
			e.attr('class', e.data('OldClasses'));
		}
	});
}


function toPercent(x, dp) {
	return isNaN(x) ? "?" : (x * 100).toFixed(dp) + "%";
}


function jsonKinksToMap(json) {
	var map = {};
	$.each(json.fetishes, function (yif, f) {map[f.fid] = f.choice;});
	return map;
}
