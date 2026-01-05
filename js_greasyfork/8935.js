// ==UserScript==
// @name            Primedice 3 Faucet Timer
// @namespace       
// @description     Displays time since faucet claim button was last clicked, no more guessing when the timer is up!
// @include         *primedice.com*
// @exclude         
// @version         0.4
// @grant none
// @author Serlite
// @downloadURL https://update.greasyfork.org/scripts/8935/Primedice%203%20Faucet%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/8935/Primedice%203%20Faucet%20Timer.meta.js
// ==/UserScript==

var sinceLastClaim = 0;
var $fTimer = null;
var $fTimerWrapper = null;
var fIntervalRef = null;
var fTimerHider = {17: false, 18: false, 90:false};

initializeTimer();

// Creates GUI and begins timer countdown
function initializeTimer(){

	if (!window.jQuery.ui){
		$("body").append("<script src='//ajax.googleapis.com/ajax/libs/jqueryui/1.11.1/jquery-ui.js'></script>");
	}

	// Delay to allow jQuery UI to load
	setTimeout(function(){
		$("body").append("<div class='faucet-timer' style='background:#FFF; border:2px solid #b4b9cd; position:fixed; z-index:9999; top:100px; left:200px; color:#6d738c; padding:15px; font-size:1em'><p style='margin-bottom:10px;'>Since last claim:</p><p><span class='time-counter' style='font-weight:bold;'>00:00</span></p></div>");

		// Caching reference
		$fTimer = $(".faucet-timer .time-counter");
		$fTimerWrapper = $(".faucet-timer");
		$fTimerWrapper.draggable();

		fIntervalRef = setInterval(updateFaucetTime, 1000);

		// Reset timer if claim button is pressed
		$(document).on("click", "button.btn.btn--primary.btn--huge.btn--block", function(){
			if ($(this).text() == "Claim"){
				sinceLastClaim = 0;
				writeFaucetTime(formattedFaucetTime());
				setTimerCol();

				// Reset interval ensure precision
				clearInterval(fIntervalRef);
				fIntervalRef = setInterval(updateFaucetTime, 1000);
			}
		});

		// Register key down in combo
		$(document).keydown(function(e){
			if (e.keyCode in fTimerHider){
				fTimerHider[e.keyCode] = true;

				// Ctrl + Alt + Z, toggle visible
				if (fTimerHider[17] && fTimerHider[18] && fTimerHider[90]){
					$fTimerWrapper.toggle();
				}
			}
		});

		// Register key up in combo
		$(document).keyup(function(e){
			if (e.keyCode in fTimerHider){
				fTimerHider[e.keyCode] = false;
			}
		});

	}, 1500);
}

// Increment timer value
function updateFaucetTime(){
	sinceLastClaim++;
	writeFaucetTime(formattedFaucetTime());
	setTimerCol();
}

// Format time into more readable string
function formattedFaucetTime(){
	var minutes = Math.floor(sinceLastClaim/60).toString();
	var seconds = (sinceLastClaim%60).toString();

	// Adding leading zeroes
	if (minutes.length == 1){
		minutes = "0" + minutes;
	}
	if (seconds.length == 1){
		seconds = "0" + seconds;
	}

	return (minutes + ":" + seconds);
}

// Change timer text
function writeFaucetTime(faucetTime){
	$fTimer.text(faucetTime);
}

// Change colour according to time
function setTimerCol(){
	if (sinceLastClaim >= 180){
		$fTimer.css("color","#5fb365");
	}
	else{
		$fTimer.css("color","#6d738c");
	}
}