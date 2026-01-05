// ==UserScript==
// @name         OnlineSequencer Buttons
// @namespace    https://onlinesequencer.net/members/70888
// @author       ewrruewc
// @version      1.0
// @description  Adds more buttons to the dropdown
// @match        *://onlinesequencer.net/*
// @grant        none
// @license	     MIT
// @downloadURL https://update.greasyfork.org/scripts/561396/OnlineSequencer%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/561396/OnlineSequencer%20Buttons.meta.js
// ==/UserScript==
 
(function(){
	function setDetuneButton() { // im lazy so you get functionButton as the name scheme
		const i = confirm('Tuning (OK = Cents, Cancel = Hertz)'); // i am NOT making a whole new prompt thing for this
		if (i == true) {
			const j = prompt('Cents'), k = parseFloat(j); // parseFloat() is here because some morons might enter "400 Cents" and will be here for every single variable because why not
			if (!isNaN(k)) {
				setDetune(instrument, k);
			} else {
				message('Please enter the detune amount');
			}
		} else {
			const j = prompt('Hertz'), k = parseFloat(j);
			if (!isNaN(k) && k > 0) { // how would someone even put A4=0hz???? every note would be completely broken???? ontop of the that, how many cents would that even be?????
				setDetune(instrument, 1200*Math.log(k/440)/Math.log(2)); // thanks K1ll3rB33 on the OS Wiki for this formula
			} else {
				message('Please enter the detune amount');
			}
		}
	}

	function setTimeSigButton() {
		const i = prompt('Enter time signature (amount of beats per measure)', '4'), j = parseFloat(i);
		if (!isNaN(j) && j > 0) {
				setTimeSig(j);
		} else {
			message('Please enter the time signature');
		}
	}

	function setGridButton() {
		const i = prompt('Grid (denominator of the fraction)','4'), j = parseFloat(i);
		if (!isNaN(j) && j > 0) {
				setGrid(j / 4);
		} else {
				message('Please enter a valid number');
		}
	}

	var menu=document.querySelector('#tools-menu .os-dropdown-menu'); // i almost gave up here it kept putting it in the selection dropdown T_T they use the same class

	function createItem(label,action,handler){
		const li=document.createElement('li'); // matches the actual os buttons unlike the other scripts
		li.textContent=label;
		li.tabIndex = 0;
		li.setAttribute('action',action);
		li.addEventListener('click',handler);
		return li;
	}

	menu.appendChild(createItem('Set Detune','SetDetuneButton()',()=>setDetuneButton())); // if i remove these stupid arrows it prompts the user with all three of these at once for some reason?????
	menu.appendChild(createItem('Set Time Signature','setTimeSigButton()',()=>setTimeSigButton()));
	menu.appendChild(createItem('Set Grid','setGridButton()',()=>setGridButton()));
})();