// ==UserScript==
// @name		UD Never an Option
// @namespace		http://www.cursedtower.com
// @version		1.0
// @description		Removes the 'Suicide Button' from the game.
// @include		http://urbandead.com/*
// @include		http://www.urbandead.com/*
// @downloadURL https://update.greasyfork.org/scripts/6379/UD%20Never%20an%20Option.user.js
// @updateURL https://update.greasyfork.org/scripts/6379/UD%20Never%20an%20Option.meta.js
// ==/UserScript==

/* Urban Dead NaO
 * v1.0
 *
 * Copyright (C) 2014 Dr Heward
 * Author: Elaine M Heward (MEMS) aka Ayelis
 * Last Modified: 2014-04-26
 * 
 * Tested under: Firefox 28.0 on Windows
 *   
 * Changes:
 *   v1.0 - Now works in Firefox
 *
 * Thanks:
 *   Bradley Sattem (Aichon) - For creating UD Barrista
 *   Midianian - For creating UD Building State Colorizer. It gave me the idea for adding cade levels.
 *   Sean Dwyer - For the original AP recovery time concept that I saw.
 *   Vaevictus - For producing QuickLinks. It was the inspiration for what got me started on this.
 *
 */


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// General functions that retrieve information about the character and environment and variables for accessing it all //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

jumpButton = document.evaluate("//form[@action and contains(@action,'map.cgi?jump')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
jumpButton = jumpButton.snapshotItem(0);

remove(jumpButton);

function remove(removeTarget) {
	removeTarget.parentNode.removeChild(removeTarget);
}