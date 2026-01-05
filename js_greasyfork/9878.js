// ==UserScript==
// @name         TrustScan Update
// @namespace    http://www.hackforums.net/member.php?action=profile&uid=1769039
// @version      1.0
// @description  Update for Hackforums Trust Scan
// @author       LazySoftware
// @match        http://www.hackforums.net/trustscan.php?uid=*
// @downloadURL https://update.greasyfork.org/scripts/9878/TrustScan%20Update.user.js
// @updateURL https://update.greasyfork.org/scripts/9878/TrustScan%20Update.meta.js
// ==/UserScript==

// ======== Fix Table ======== \\

document.getElementsByClassName("thead")[1].colSpan = "3";
document.getElementsByClassName("tborder")[1].insertRow(1).innerHTML = "<td class='tcat' colspan='1' width='76%'><span class='smalltext'><strong><a href=''>Information</a> </strong></span></td><td class='tcat' align='center' ><span class='smalltext'><strong><a href='' rel='nofollow'>Result</a> </strong></span></td><td class='tcat' align='center' width='7%''><span class='smalltext'><strong><a href='' rel='nofollow'>Score</a> </strong></span></td>";
document.getElementsByClassName("tborder")[1].insertRow(document.getElementsByClassName("tborder")[1].rows.length).innerHTML = "<td class='trow1' width='80%'>Trust Score:</td><td class='trow1' align='center'>0%</td><td class='trow1' align='center'>0/0</td>";

for (i=2;i<13;i++){
	var newCell = document.getElementsByClassName("tborder")[1].rows[i].insertCell(2);
	newCell.innerHTML = "<td class='trow1' align='center'>0/0</td>";
	newCell.className = "trow1";
	newCell.align = "center";
}

// ======== Gather all data ======== \\

var TrustScan_Header = document.getElementsByClassName("tborder")[1].rows[0];
var Information_Header = document.getElementsByClassName("tborder")[1].rows[1];
var Gauth_Data = document.getElementsByClassName("tborder")[1].rows[2];
var LastEmail_Data = document.getElementsByClassName("tborder")[1].rows[3];
var CountryLogins_Data = document.getElementsByClassName("tborder")[1].rows[4];
var LoginIPs_Data = document.getElementsByClassName("tborder")[1].rows[5];
var UniqueISPs_Data = document.getElementsByClassName("tborder")[1].rows[6];
var MatchingRegistration_Data = document.getElementsByClassName("tborder")[1].rows[7];
var MatchingRegion_Data = document.getElementsByClassName("tborder")[1].rows[8];
var IPMatching_Data = document.getElementsByClassName("tborder")[1].rows[9];
var DealDisputes_Data = document.getElementsByClassName("tborder")[1].rows[10];
var PasswordReset_Data = document.getElementsByClassName("tborder")[1].rows[11];
var IPChangeDate_Data = document.getElementsByClassName("tborder")[1].rows[12];
var TrustScore_Data = document.getElementsByClassName("tborder")[1].rows[13];

// ======== Trust Score Editting ======== \\

function updateScore(rowData, updatedScore, scoreMax) {
	rowData.getElementsByTagName("td")[2].innerHTML = updatedScore + "/" + scoreMax;
}

function getData(rowData) {
	return rowData.getElementsByTagName("td")[1].innerHTML;
}

// ======== Trust Score Calcularor ======= \\

	var totalTrustScore = 0;
    var checkHacked = 0;

	// Gauth/2FA activation date:
	if (getData(Gauth_Data) == "Not Activated") {
		updateScore(Gauth_Data, 0, 20);
	} else {
		updateScore(Gauth_Data, 20, 20);
		totalTrustScore += 20;
	}

	// Last Email Change:
	if (getData(LastEmail_Data) == "No Changes") {
		updateScore(LastEmail_Data, 10, 10);
		totalTrustScore += 10;
	} else {
		updateScore(LastEmail_Data, 5, 10);
		totalTrustScore += 5;
        checkHacked += 1;
	}

	// Number of Unique Country Logins:
	if (getData(CountryLogins_Data) == "1") {
		updateScore(CountryLogins_Data, 20, 20);
		totalTrustScore += 20;
	} else if (getData(CountryLogins_Data) == 2) {
		updateScore(CountryLogins_Data, 10, 20);
		totalTrustScore += 10;
	} else if (getData(CountryLogins_Data) > 2) {
		updateScore(CountryLogins_Data, 0, 20);
        checkHacked += 1;
	}

	// Number of Unique Login IP's:
	updateScore(LoginIPs_Data, "N", "A");

	// Number of Unique ISP's:
	if (getData(UniqueISPs_Data) == "1") {
		updateScore(UniqueISPs_Data, 20, 20);
		totalTrustScore += 20;
	} else if (getData(UniqueISPs_Data) == 2) {
		updateScore(UniqueISPs_Data, 10, 20);
		totalTrustScore += 10;
	} else if (getData(UniqueISPs_Data) > 2) {
		updateScore(UniqueISPs_Data, 0, 20);
        checkHacked += 1;
	}

	// Matching registration and last IP:
	updateScore(MatchingRegistration_Data, "N", "A");

	// Matching region of registration and latest IP:
	updateScore(MatchingRegion_Data, "N", "A");

	// Latest IP Matching Other Members:
	if (getData(IPMatching_Data) > 0) {
		updateScore(IPMatching_Data, 0, 30);
        checkHacked += 5;
	} else {
		updateScore(IPMatching_Data, 30, 30);
		totalTrustScore += 30;
	}

	// Deal Disputes (Claimant/Defendant):
	if (getData(DealDisputes_Data).split('/')[1] > 0) {
		updateScore(DealDisputes_Data, 0, 100);
	} else {
		updateScore(DealDisputes_Data, 100, 100);
		totalTrustScore += 100;
	}

	// Password Reset in Last Week:
	if (getData(PasswordReset_Data) == "No") {
		updateScore(PasswordReset_Data, 50, 50);
		totalTrustScore += 50;
	} else {
		updateScore(PasswordReset_Data, 0, 50);
        checkHacked += 5;
	}

	// Last Login IP Change Date:
	updateScore(IPChangeDate_Data, "N", "A");

	// Update Trust Score:
	updateScore(TrustScore_Data, totalTrustScore, 250);
	TrustScore_Data.getElementsByTagName("td")[1].innerHTML = totalTrustScore / 250 * 100 + "%";


// ======== Deal Disputes Warning ======== \\

var DealDisputesCount = getData(DealDisputes_Data).split('/')[1];

if (DealDisputesCount > 0) {
    document.getElementsByClassName("tborder")[1].insertAdjacentHTML("beforeBegin", "<div class='red_alert'><b>WARNING:</b>This user has open scam reports!<br></div>");
}

// ======== Add Pro/Con Table ======== \\

document.getElementsByClassName("tborder")[1].insertAdjacentHTML("afterend", "<br><table border='0' cellspacing='1' cellpadding='4' class='tborder'><tbody><tr><td class='thead'><strong>More Information</strong></td></tr><tr><td class='trow1'>Pros;<span style='color: white;'><ul id='pros'></ul></span>Cons;<span style='color: white;'><ul id='cons'></ul></span></td></tr></tbody></table>");

if ((totalTrustScore / 250 * 100) < 70) {
    document.getElementById("cons").innerHTML += "This users trust score is below 70%!<br>"; 
} else {
    document.getElementById("pros").innerHTML += "This users trust score is above 70%<br>"; 
}

if (DealDisputesCount > 0) {
    document.getElementById("cons").innerHTML += "This user has an open scam report!<br>"; 
} else {
    document.getElementById("pros").innerHTML += "This user has no open scan reports.<br>"; 
}

if (checkHacked > 3) {
    document.getElementById("cons").innerHTML += "This user may have been hacked recently! (Scored: " + checkHacked + "/18)<br>"; 
} else {
    document.getElementById("pros").innerHTML += "This user seems to have not been hacked.<br>"; 
}