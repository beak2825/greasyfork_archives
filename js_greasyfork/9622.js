// ==UserScript==
// @name         energ1zer's Primedice Add-On Suite
// @namespace    http://cntrlcntr.pw
// @version      0.1
// @description  A collection of helpful, user-made addons that are all activated automatically every time one visits Primedice.
// @author       energ1zer
// @grant        none
// @include      *primedice.com*
// @exclude 
// @downloadURL https://update.greasyfork.org/scripts/9622/energ1zer%27s%20Primedice%20Add-On%20Suite.user.js
// @updateURL https://update.greasyfork.org/scripts/9622/energ1zer%27s%20Primedice%20Add-On%20Suite.meta.js
// ==/UserScript==

// --------------------------------
// PrimeDice - Bet Amount to USD
// --------------------------------
// By: paradocks for mah niggah dank
// --------------------------------
var loss = '.live-data__profit-lost';
var win = '.live-data__profit-won';
var currentprice;

function btcPrice() {
    var result = null;
    $.ajax({
        url: 'https://blockchain.info/q/24hrprice',
        type: 'get',
        dataType: 'html',
        async: false,
        success: function(data) {
            result = data;
        }
    });
    currentprice = result;
    start();
}
btcPrice();

function start() {
    setInterval(function() {
        var curPrice = currentprice;
        for(i = 0; i < $(loss).length; i++) {
            var newValue = $(loss)[i].innerText.substr(0, 11);
            var USD = (currentprice * (newValue)).toFixed(2);
            $(loss)[i].innerText = newValue + '($' + USD + ')';


        }
        for(i = 0; i < $(win).length; i++) {
            var newValue = $(win)[i].innerText.substr(0, 10);
            var USD = (currentprice * (newValue)).toFixed(2);
            $(win)[i].innerText = newValue + '($' + USD + ')';

        }
    }, 1500);
}
// USD Converter End
/*
// Serlite's Faucet Timer
*/
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
/*
//
*/
