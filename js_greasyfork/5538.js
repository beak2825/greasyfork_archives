// ==UserScript==
// @name            mTurkThemes
// @namespace       http://ericfraze.com
// @version         1.2
// @description     This script provides a UI that allows you to make and share themes for mTurk.com
// @match           https://www.mturk.com/*
// @resource        cssfile https://magnilucent.github.io/mTurk-Themes/css/style.css?version=71234123
// @resource        colpickcssfile https://magnilucent.github.io/mTurk-Themes/css/colpick.css?version=17
// @grant           GM_addStyle
// @grant           GM_getResourceText
// @grant           GM_setClipboard
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_deleteValue
// @copyright       2014+, Eric Fraze
// @require         http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// @require         https://greasyfork.org/scripts/1562-colpick-color-picker/code/colpick%20Color%20Picker.js?version=3858
// @downloadURL https://update.greasyfork.org/scripts/5538/mTurkThemes.user.js
// @updateURL https://update.greasyfork.org/scripts/5538/mTurkThemes.meta.js
// ==/UserScript==

// Add color picker CSS
GM_addStyle(GM_getResourceText("colpickcssfile"));

// The CSS used to apply the themes
var CSSText;

// Holds all the current color states
var variables;

// Groups the variables by color value
var colorGroups;

// Name of current theme
var currentTheme;

// Hiddden "theme" that holds the unsaved changes of a theme
// TODO: Make sure no one can name a name 'unsavedTheme'.
var unsavedTheme = "unsavedTheme";

// The version of the script on last save
var savedVariableVersion;

// The version of the script on last save
var currentVariableVersion = 5;

// List of all themes installed
var themeNames;


// Get last save script version
savedVariableVersion = GM_getValue('savedVariableVersion', -1);

// Check to see if there is a current theme. If not, this is probably the first run.
if (GM_getValue('mturk-current-theme', -1) === -1){
	// Set to default theme if there is no current theme.
	currentTheme = "Default";
}else{
	// Get the current theme name.
	currentTheme = GM_getValue('mturk-current-theme');
}

// Load theme names
if (GM_getValue('mturk-theme-names', -1) === -1){
	themeNames = ['Default'];
}else{
	themeNames = JSON.parse(GM_getValue("mturk-theme-names"));
}

/*****************************************
* Load current theme
******************************************/
// Set variables to defaults
resetVariables();

// Apply the theme
applyTheme(currentTheme);

// Wait for DOM to load
$(document).ready(function() {
	// Add the text used to open the panel
	$("#user_name_field").after(' | <span id="mturkthemeoptions" class="header_links">Theme Options</span>');

	// Add the mTurkTheme panel
	$("body").append('<div id="mturktheme" class=""></div>');

	// Add the toolbar (import/save/undo buttons, ect)
	addToolbar();

	// Add the wrapper for the color list
	$("#mturktheme").append('<div class="color-list-wrapper"></div>');

	// Make the color picker plugin apply on "DOMNodeInserted"
	bindColorPicker();

	// Refresh the color list
	refreshList();
});

// Toolbar has the buttons and theme select
function addToolbar(){
	$("#mturktheme").append('<div class="toolbar"></div>');
	$("#mturktheme .toolbar").append('<div title="New theme" class="icon add"></div>');
	$("#mturktheme .toolbar").append('<select class="theme-select"></select>');
	$("#mturktheme .toolbar").append('<div title="Import theme" class="icon import"></div>');
	$("#mturktheme .toolbar").append('<div title="Export theme" class="icon export"></div>');
	$("#mturktheme .toolbar").append('<div title="Hide" class="icon close"></div>');
	$("#mturktheme .toolbar").append('<div title="Save theme" class="icon save"></div>');
	$("#mturktheme .toolbar").append('<div title="Revert to last save" class="icon revert"></div>');

	 updateThemeList();
}

// Update the theme list in the toolbar
function updateThemeList() {
	var unsavedFlag = "";

	$("#mturktheme .toolbar .theme-select").empty();

	for (var i in themeNames){
		if ( (themeNames[i] == currentTheme) && (GM_getValue('mturk-theme-data-' + unsavedTheme, -1) !== -1) )
			unsavedFlag = "*";
		else
			unsavedFlag = "";

		$("#mturktheme .toolbar .theme-select").append('<option value="' + themeNames[i] + '">' + unsavedFlag + themeNames[i] + unsavedFlag +'</option>');
	}

	$("#mturktheme .toolbar .theme-select").val(currentTheme);
}

// Binds the color picker to each new color list element
function bindColorPicker() {
	// Dynamically binds the color picker to each new color list item
	$("#mturktheme .color-list-wrapper").bind('DOMNodeInserted', function() {
		// Binds the colorpicker to a list item
		$("#mturktheme .variable-group-wrapper .color").colpick({
			// Sets the color of the color picker to the list item's color
			onBeforeShow:function() {
				var oldColor;

				// Returns an RBG version of the background
				oldColor = $(this).css('background-color');

				// Single out the three colors
				oldColor = oldColor.replace("rgb(", "").replace(")","");

				// Make an array of the colors
				oldColor = oldColor.split(", ");

				// This function requires an object to be passed, so send one over.
				$(this).colpickSetColor( { 'r':oldColor[0], 'g':oldColor[1], 'b':oldColor[2] } );
			},
			// Changes the color in the CSS and applies the changes
			onSubmit:function(hsb,hex,rgb,el) {
				var oldColor, variableName;

				// Hides the color picker
				$(el).colpickHide();

				// Using the browser to make the old and new colors the same text value, then comparing them
				$("#mturkthemeoptions").css("border-color", "#" + hex);
				if ( $(el).css('background-color') != $("#mturkthemeoptions").css("border-color") ) {
					// Check if the list item is a single item or a group item
					if ($(el).parent('.variable-color').length) {
						// Single items have the variable name as their name
						variableName = $(el).attr('name');

						// Need to get the color dynamically
						oldColor = variables[getPropertyIndex(variableName)][1];

						// Change the CSS
						setProperty(variableName, oldColor, "#" + hex);

						// Old code that updated the list item. May use this again when RefreshList is updated.
						//$(this).css('background-color', newColor);
					}else{
						// Group items have the color value as their name
						oldColor = $(el).attr('name');


						// Changes the CSS of the entire group
						setGroupProperty(oldColor, "#" + hex);
						
						// Old code that updated the list item. May use this again when RefreshList is updated.
						//$('#mturktheme .color[style="background-color: ' + color + ';"]').css('background-color', newColor);
						//$(this).parent().children(".header").text(newColor);
					}

						// Adds the CSS to the page
						applyCSS();

						// Refreshes the color list
						refreshList();

						// Saves unsaved changes
						// Seems ironic but they need to be saved so they persist through page loads.
						saveTheme(unsavedTheme);

						// Update the theme list to add the unsaved marker
						updateThemeList();
				}
			}
		});
	});
}

$("#mturktheme .variable-color").live('mouseenter', function () {
	var color = $(this).find(".color");
	// Single items have the variable name as their name
	variableName = $(color).attr('name');

	// Need to get the color dynamically
	oldColor = variables[getPropertyIndex(variableName)][1];

	// Change the CSS
	setProperty(variableName, null, "red");

	// Adds the CSS to the page
	applyCSS();
});

$("#mturktheme .variable-color").live('mouseleave', function () {
	var color = $(this).find(".color");
	// Single items have the variable name as their name
	variableName = $(color).attr('name');

	// Need to get the color dynamically
	oldColor = variables[getPropertyIndex(variableName)][1];

	// Change the CSS
	setProperty(variableName, null, oldColor);

	// Adds the CSS to the page
	applyCSS();
});

// Clicking the text makes mTurkTheme slide
$("#mturkthemeoptions").live('click', function () {
	$("#mturktheme").addClass("active");
});

// Expand group list items
$("#mturktheme .variable-group .expand").live('click', function () {
	$(this).parents(".variable-group-wrapper").toggleClass("active");
});

// Add a theme
$("#mturktheme .toolbar .add").live('click', function () {
	var themeName = prompt("Enter the theme name:");
	addTheme(themeName);
});

// Import a theme
$("#mturktheme .toolbar .import").live('click', function () {
	// Get the stringified variables
	var newTheme = prompt("Paste in the theme!");

	// Make sure the user didn't cancel.
	if (newTheme != null) {
		// Reset variables to defaults
		resetVariables();

		// Load variables from stringified variables
		variables = JSON.parse(newTheme);

		// Load changes in unsaved theme so they can be reverted
		saveTheme(unsavedTheme);

		// Apply the changes
		// applyTheme will detect the unsaved changes and load theme
		applyTheme(currentTheme);

		// Refresh the color list
		refreshList();

		// Update the theme list to add the unsaved marker
		updateThemeList();
	}
});

// Switch themes when they are selected in the dropdown box
$("#mturktheme .toolbar .theme-select").live('change', function () {
	// Delete unsaved changes
	deleteTheme(unsavedTheme);

	// Get the theme name
	currentTheme = $("#mturktheme .toolbar .theme-select :selected").attr('value');

	// Set the current theme
	GM_setValue('mturk-current-theme', currentTheme);

	// Apply the theme
	applyTheme(currentTheme);

	// Refresh color list
	refreshList();

	// Update the theme list to add the unsaved marker
	updateThemeList();
});

// Export a theme
$("#mturktheme .toolbar .export").live('click', function () {
	// Set the stringified variables to the clipboard
	GM_setClipboard(JSON.stringify(variables));
	alert("Theme copied to clipboard. Pastebin and share!");
});

// Revert to last save
$("#mturktheme .toolbar .revert").live('click', function () {
	// Delete unsaved changes
	deleteTheme(unsavedTheme);

	// Apply last save
	applyTheme(currentTheme)

	// Refresh color list
	refreshList();

	// Update the theme list to add the unsaved marker
	updateThemeList();
});

// Save theme
$("#mturktheme .toolbar .save").live('click', function () {
	saveTheme(currentTheme);
	deleteTheme(unsavedTheme);

	// Update the theme list to add the unsaved marker
	updateThemeList();
});

// Close the panel
$("#mturktheme .toolbar .close").live('click', function () {
	$("#mturktheme").removeClass("active");
});

function resetVariables() {
	// All of the color variables
	variables = [
		["hit-capsule-title-color", ""],
		["hit-capsule-title-hover-color", ""],
		["hit-capsule-title-visited-color", ""],
		["hit-capsule-link-right-color", ""],
		["hit-capsule-link-right-hover-color", ""],
		["hit-capsule-link-right-visited-color", ""],
		["hit-capsule-field-title-color", ""],
		["hit-capsule-field-text-color", ""],
		["header-link-color", ""],
		["subtab-text-color", ""],
		["separator-text-color", ""],
		["searchbar-text-color", ""],
		["whatis-link-color", ""],
		["dashboard-and-workerID-text-color", ""],
		["if-you-re-not-text-color", ""],
		["link-default-color", ""],
		["link-default-hover-color", ""],
		["link-default-visited-color", ""],
		["show-earnings-details-text-color", ""],
		["button-background-color", ""],
		["button-border-color", ""],
		["button-text-color", ""],
		["tab-text-color", ""],
		["tab-background-color-inactive", ""],
		["tab-border-color-inactive", ""],
		["tab-background-color-active", ""],
		["tab-border-color-active", ""],
		["page-background-color", ""],
		["tab-text-color-active", ""],
		["page-header-background-color", ""],
		["page-header-border-color", ""],
		["default-text-color", ""],
		["search-go-button-background-color", ""],
		["search-go-button-border-color", ""],
		["search-go-button-text-color", ""],
		["table-body-background-color", ""],
		["table-header-background-color", ""],
		["table-header-text-color", ""],
		["table-body-border-color", ""],
		["table-list-text-color", ""],
		["table-list-header-background-color", ""],
		["table-list-header-text-color", ""],
		["table-list-row-even-background-color", ""],
		["table-list-row-border-color", ""],
		["table-list-row-odd-background-color", ""],
		["table-link-color", ""],
		["sort-button-text-color", ""],
		["hit-border-color", ""],
		["hit-header-unqualified-background-color", ""],
		["hit-body-unqualified-background-color", ""],
		["hit-header-qualified-background-color", ""],
		["hit-body-qualified-background-color", ""],
		["page-footer-background-color", ""],
		["footer-text-color", ""],
		["footer-link-text-color", ""],
		["details-link-text-color", ""],
	];

	// Used to dynamically group the list items
	colorGroups = [];
}

// Returns the style element that holds the theme
function getStyle() {
	// Find the correct style element by looking for my comment
	return $( "style:contains('/* mTurk Theme */')" );
}

// Applies CSSText to the style element
function applyCSS() {
	// Replace the text of the style element
	getStyle().text(CSSText);
}

// Makes the regex string used to find and change properties in the CSS
function findPropertyRegex(variableName, flags) {
	// Fancy thing lets flags be optiional.
	flags = typeof flags !== 'undefined' ? flags : 'g';

	// Ugh. Regex. I need to escape the escapes here. Crazy.
	// Select the CSS property by the comment in the line above it.
	// NOTE: This relies on the property you want to change being the FIRST value
	// "border: 1px blue solid ;" will change "1px", not "blue"
	// "border: blue 1px solid;" will change "blue"
	// Group 1: comment & property
	// Group 2: property you want to change (I hope!)
	// Group 3: values after the property
	// Group 4: the semicolon
	var regstring = "(.*\\/\\*\\s" + variableName + "\\s\\*\\/\\s+.*:\\s+)(#*[A-Za-z0-9]+)(.*)(;.*)";

	// Create the RegEx object
	return new RegExp(regstring, flags);
}

// Edits the CSS to set a property
function replaceProperty(regex, str, value) {
	return str.replace(regex, "$1" + value + "$3$4");
}

// Finds the index of a property in variables
function getPropertyIndex (variableName) {
	for (var i in variables) {
		if (variables[i] != null) {
			if (variableName == variables[i][0]) {
				return i;
			}
		}
	}

	return -1;
}


// Gets a property from the CSS
// TODO: I think this function may be pretty unnessary and is slowing down the script
// The "variables" variable has the values too as long as its been applied
function getProperty(variableName) {
	// Get the CSS property regex
	regex = findPropertyRegex(variableName, '');
	// Get the groups
	groups = regex.exec(CSSText);
	if (groups != null) {
		// Return the value
		return groups[2];
	}else{
		console.log("Couldn't find " + variableName);
		var i = getPropertyIndex(variableName);
		delete variables[i];
		return -1;
	}
}

// Set an individual property to a color
function setProperty(variableName, oldColor, newColor) {
	// Get the CSS property regex
	regex = findPropertyRegex(variableName);

	// Replace the color with the one we want.
	CSSText = replaceProperty(regex, CSSText, newColor);

	// Update the color grouping if needed
	if (oldColor !== null) {
		var index = getPropertyIndex(variableName);

		variables[index][1] = newColor;
		
		if (newColor in colorGroups) {
			colorGroups[newColor].push(index);
		}else{
			colorGroups[newColor] = [];
			colorGroups[newColor][0] = index;
		}
		
		var groupIndex = colorGroups[oldColor].indexOf(index);
		delete colorGroups[oldColor][groupIndex];
	}
}

// Set a group of colors to another color
function setGroupProperty (oldColor, newColor) {
	// Update the color grouping
	for (var i in colorGroups[oldColor]) {
		index = colorGroups[oldColor][i];
		variableName = variables[index][0];
		setProperty(variableName, oldColor, newColor);
	}

	delete colorGroups[oldColor];
}

// Refreshes the color lust
// TODO: Make this only update what is needed instead of closing all color groups.
function refreshList () {
	var savedVariables = getSavedVariables(currentTheme);
	// Remove the old color pickers
	$(".colpick").remove();

	// Empty the list
	$("#mturktheme .color-list-wrapper").empty();

	// Refill the list
	for (var color in colorGroups) {
		var colorGroup = colorGroups[color];
		var appendString = "";
		var appendColorString = "";
		var unsavedChanges = false;
		

		for (var ii in colorGroup) {
			var index = colorGroup[ii];
			var variableName = variables[index][0];
			var unsavedText = "";
			if (savedVariables != -1) {
				if (color != savedVariables[index][1]){
					unsavedChanges = true;
					unsavedText = " *";
					console.log("Unsaved color");
				}else{
					unsavedText = "";
				}
			}
			
			appendColorString += '<div class="variable-color"><div class="content">' + variableName + unsavedText + '</div>'
			appendColorString += '<div name = "' + variableName + '" class="color" style="background-color: ' + color + ';"></div></div>';
		}

		if (unsavedChanges) {
			unsavedText = " *";
		}else{
			unsavedText = "";
		}

		appendString = '<div class = "variable-group-wrapper"><div class="variable-group">';
		appendString += '<div class="content">' + color + unsavedText + '</div><div name = "' + color + '" class="color" style="background-color: ' + color + ';"></div>';
		appendString += '<div class="expand"></div></div>';
		appendString += appendColorString;
		appendString += '</div>';
		$("#mturktheme .color-list-wrapper").append(appendString);
	}
}

// Add a theme
// TODO: Make sure the theme doesn't exist.
// TODO: Set the current theme to the new theme
function addTheme(themeName){
	// Add the theme name to the array
	themeNames.push(themeName);
	// Update the theme list to show the added theme
	updateThemeList();
	// Save the name names in local storage
	GM_setValue('mturk-theme-names', JSON.stringify( themeNames ));
	// Save the theme (uses current variables)
	saveTheme(themeName);
}

function deleteTheme(themeName) {
	GM_deleteValue('mturk-theme-data-' + themeName);
}

function saveTheme(themeName) {
	GM_setValue('savedVariableVersion', currentVariableVersion);
	GM_setValue('mturk-theme-data-' + themeName, JSON.stringify(variables));
}

function loadTheme(themeName, overrideUnsaved) {
	if (overrideUnsaved == null)
		overrideUnsaved = false;
	// Check for an unsaved theme
	if ( ( getSavedVariables(unsavedTheme) !== -1 ) && !overrideUnsaved ) {
		console.log("Loading unsaved theme changes");
		variables = getSavedVariables(unsavedTheme);
	}else{
		// Check for an existing theme
		if (getSavedVariables(themeName) !== -1){
				console.log("Loading saved theme");
				variables = getSavedVariables(themeName);
		}else{
			// Load the default CSS if all else fails.
			console.log("Loading default CSS");
			CSSToVariables();
		}
	}
}

function getSavedVariables(themeName) {
	return JSON.parse(GM_getValue('mturk-theme-data-' + themeName, -1));
}

// Apply a theme
function applyTheme(themeName) {
	resetVariables();

	currentTheme = themeName;

	// Get original CSS text
	CSSText = GM_getResourceText("cssfile");
	if (savedVariableVersion != currentVariableVersion){
		console.log("New version!");

		if (getSavedVariables(themeName) !== -1){
			loadTheme(currentTheme, true);
			VariablesToCSS();
			CSSToVariables();
			saveTheme(themeName);
		}

		if (getSavedVariables(unsavedTheme) !== -1){
			loadTheme(currentTheme);
			VariablesToCSS();
			CSSToVariables();
			saveTheme(unsavedTheme);
		}
	}else{
		// Load theme's variables
		loadTheme(currentTheme);

		// Applies the variables to the CSS
		VariablesToCSS();
	}

	// Add the CSS to the page
	if (getStyle().length){
		applyCSS();
	}else{
		GM_addStyle(CSSText);
	}
}

// Applies the variables to the CSS
function VariablesToCSS() {
	var variableName;
	var color;
	for (var i in variables) {
		if (variables[i]) {
			variableName = variables[i][0];
			
			color = variables[i][1];
			if (color == "") {
				color = getProperty(variableName);
			}

			setProperty(variableName, null, color);
			
			if (color in colorGroups) {
				colorGroups[color].push(i);
			}else{
				colorGroups[color] = [];
				colorGroups[color][0] = i;
			}
		}
	}
}

// Converts a CSS string to a variable list.
function CSSToVariables() {
	resetVariables();
	// Load all the color values.
	var variableName;
	var color;
	for (var i in variables) {
		variableName = variables[i][0];
		color = getProperty(variableName);
		console.log(variableName + " | " + color);
		if (color != -1){
			variables[i][1] = color;
			
			if (color in colorGroups) {
				colorGroups[color].push(i);
			}else{
				colorGroups[color] = [];
				colorGroups[color][0] = i;
			}
		}
	}
}