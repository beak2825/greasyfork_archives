// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  This makes HRMS more user friendly and easy to use
// @author       You
// @match        https://hrms.indianrail.gov.in/HRMS/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gov.in
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561498/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/561498/New%20Userscript.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    $(document).ready(function() {
    var currentUrl = window.location.href;
    var nav = `<li class="nav-item">
                <a class="nav-link" href="https://hrms.indianrail.gov.in/HRMS/ipass/accept-promotion-office-order">Promotion Order</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="https://hrms.indianrail.gov.in/HRMS/ipass/new-joinee-onboarding-process-approve">On-Boarding</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="https://hrms.indianrail.gov.in/HRMS/ipass/accept-new-joinee-office-order">New Joinee</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="https://hrms.indianrail.gov.in/HRMS/ipass/accept-regular-posting-office-order">Regular Posting</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="https://hrms.indianrail.gov.in/HRMS/ipass/accept-exit-office-order">Exit Order</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="https://hrms.indianrail.gov.in/HRMS/leave-management/all-leave-encashment-pending">Leave Encashment</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="https://hrms.indianrail.gov.in/HRMS/transfer/forward-mutual-transfer-requests">Mutual Transfer</a>
            </li>`;
    $('#myMenu').append(nav);


    if (currentUrl === "https://hrms.indianrail.gov.in/HRMS/loan-advances/submitted-pf-loan-applications") {
        console.log('On submitted applications page - clicking fetch link');

        $('#pfLoanListBody tr:last-child #fetch-pf-loan-application').click();
    }


    else if (currentUrl === "https://hrms.indianrail.gov.in/HRMS/loan-advances/get-pf-loan-application") {
        console.log('On loan application page - filling form and submitting');

        $('#remarksForPfLoan').val('OK');

        $('#print-pf-loan-application-button').click();

        setTimeout(function() {
            var yesButton = $('button.bootbox-accept');
            if (yesButton.length > 0) {
                console.log('Clicking Yes button in confirmation popup');
                yesButton.click();

                setTimeout(function() {
                    var digitalSignButton = $('#digital-sign');
                    if (digitalSignButton.length > 0) {
                        console.log('Clicking Sign Digitally button');
                        digitalSignButton.click();

                        setTimeout(function() {
                            var yesButton = $('button.bootbox-accept');
                            if (yesButton.length > 0) {
                                console.log('Clicking Yes button in final confirmation popup');
                                yesButton.click();

                                setTimeout(function() {
                                    var signButton = $('#pdf-sign');
                                    if (signButton.length > 0) {
                                        console.log('Digitally sigining');
                                        signButton.click();

                                        setTimeout(function() {
                                            var okButton = $('button.ok');
                                            if (okButton.length > 0) {
                                                console.log('OK');
                                                okButton.click();
                                            }
                                        }, 4000);
                                    }
                                }, 1000);
                            }
                        }, 1000);
                    }
                }, 2500);

            }
        }, 1000);

        console.log('Form filled and submitted');
    }

    else if (currentUrl === "https://hrms.indianrail.gov.in/HRMS/leave-management/get-leave-application") {
        console.log('On leave application page');

        if($('#infoCertified').text() == 'NO') {
            alert('Leave not certified');
            return;
        }
        $("#process-leave-application-btn").after('<button onclick="forwardIt()" type="button" class="btn zoom" id="forward-btn">Forward</button>');
    }

    else if (currentUrl === "https://hrms.indianrail.gov.in/HRMS/organization/map-org-employees") {
        console.log('On map org employee page');

        $("#reset").after('<button onclick="selectSection()" type="button" class="btn zoom" id="forward-btn">Select Employees</button>');
    }


    else if (currentUrl === "https://hrms.indianrail.gov.in/HRMS/assign-bill-unit") {
        console.log('On Assign Bill Unit page');

        var ids = prompt('Enter HRMS ids with comma').replace(/\s+/g, '').split(",");
        for (i = 0; i < ids.length; i++) {
            $("#addRowButton").click(); console.log(ids[i]); $("#ipasEmployeeId" + i).val(ids[i]).change();
        }
    }

    else if (currentUrl === "https://hrms.indianrail.gov.in/HRMS/leave-management/periodic-credit-of-leave") {
        console.log('On Periodic Credit leave page');

        $("#fetch-employee-list").after('<button type="button" onclick="leaveCreditReport()" class="btn btn-primary-grad" id="fetch-report">Get Report</button>');
    }

    else if (currentUrl === "https://hrms.indianrail.gov.in/HRMS/leave-management/updation-of-initial-balance") {
        console.log('On Initial leave vetting page');

        $("#proceedProcess").after('<button type="button" onclick="leaveVettingReport()" class="btn btn-primary" id="fetch-report">Get Report</button>');
    }

    else if (currentUrl === "https://hrms.indianrail.gov.in/HRMS/transfer/forward-mutual-transfer-requests") {
        console.log('On Mutual transfer page');
        $('#fetch-transfer-proposal-details').click(function() {
            mutualTransfer();
        });
    }

	else if (currentUrl.indexOf("https://hrms.indianrail.gov.in/HRMS/groupb-my-inbox") == 0) {

		$("#groupBPendingAppnListTable tr td:last-child a")[Math.floor(Math.random() * $("#groupBPendingAppnListTable tr").length)].click();
	}

	else if (currentUrl === "https://hrms.indianrail.gov.in/HRMS/groupb-my-inbox/groupb-flow") {

		if($($("#remarksHistoryTable tbody tr td")[0]).text() == "1") window.location.assign("https://hrms.indianrail.gov.in/HRMS/groupb-my-inbox");
		$("select#action").val(1).trigger('change'); 
		$("textarea#remarks").val("Examine");
		var dept = $("#applicationBaiscDetailTable tbody tr td:nth-child(9)").text();
		if (dept.indexOf("OPERATING") == 0) {
			var chos = 'DSIOGM';
		}
		else if (dept.indexOf("ELECTRICAL") == 0) {
			var chos = 'GRUUNU';
		}
		else if (dept.indexOf("MECHANICAL") == 0) {
			var chos = 'MJBMPA';
		}

		$('#forwardTo').append($('<option>', {value:chos})); 
		$("#forwardTo").val(chos);
                setTimeout(function() {
		    $("#submitApplicationBtn").click();
                }, 1000);


	}

    else {
        console.log('Not on expected pages. Current URL:', currentUrl);
    }

    window.selectSection = function () {
        var ids = prompt('Enter HRMS ids with comma').trim().split(" ");
        var new_section = prompt('Enter New Section');
        var non_matchingRows = [];

        $('#mappingEmpListTable tr').each(function() {
            var $row = $(this);
            var firstTdText = $row.find('td:first label').text().trim();

            if (ids.includes(firstTdText)) {
                console.log(firstTdText);
                $row.find('input.addToOrg').prop('checked', true).trigger('change');
                $row.find('.sectionId option:contains('+new_section+')').filter(function() {
                    return $(this).text() === new_section;
                }).prop('selected', true).trigger('change');
            }
            else {
                non_matchingRows.push(firstTdText);
            }
        });

        alert(non_matchingRows);
    };

    window.forwardIt = function () {
        $('#leaveAction').val('F').trigger('change');
        $('#modifySearchRange').click();
        var dept = '';
        var authority = '';
        var empDetails1 = $('#empDetails1').text();
        if (empDetails1.indexOf("COMMERCIAL") == 0) {
            dept = 'COMMERCIAL';
            authority = 'GAUPWX';
        }
        else if (empDetails1.indexOf("OPERATING") == 0) {
            dept = 'OPERATING';
            authority = 'ULLDXE';
        }
        else if (empDetails1.indexOf("ELECTRICAL") == 0) {
            dept = 'ELECTRICAL';
            var empDetails = $('#empDetails').text();
            if (empDetails.indexOf(" TRD ") > 0) {
                authority = 'SR DEE/TRD';
            }
            else if (empDetails.indexOf("GENERAL") > 0) {
                authority = 'SR DEE/G';
            }
            else {
                var match = $("label#sancAuthorityDetails").text().match(/\((.*?)\)/);
                if (match != null) authority = match[1];
        }

        }
        $('#remarks').val('Forwarded for suitable action please');

        setTimeout(function() {
            if (dept == '') {
                $('#searchRangeBtn').click();
                return;
            }
            $('#frwDept option:contains('+dept+')').prop('selected', true).trigger('change');
            console.log(dept + " department selected in popup.");

            setTimeout(function() {
                $('#searchRangeBtn').click();
                if (authority == '') {
                    return;
                }
                $('#frwAuthority option:contains('+authority+')').prop('selected', true).trigger('change');
                console.log(dept + " " + authority + " authority selected.");
                $('#process-leave-application-btn').click();

                setTimeout(function() {
                    //$('button[data-bb-handler="confirm"]').click();
                }, 500);
            }, 500);

        }, 500);
    };


    window.leaveCreditReport = async function () {
        var billUnitCount = $("#billUnit").children().length;
        var output = '';
        var count = '';
        var txt = '';
        for (var i=1; i < billUnitCount; i++) {
            $(`#billUnit option:eq(${i})`).prop("selected", true);
            $("#fetch-employee-list").click();
            count = $("#empCount").text();

            if (count != '0') {
                txt = $(`#billUnit option:eq(${i})`).val() + " \t" + count + " ";
                $("#employeeListTBody tr").each(function() {
                    txt += $(this).find("td:eq(3)").text().substring(0,3) + ",";
                });

                $("#proceedButtonDiv").after(`<div>${txt}</div>`)
            }
            await delay(500);
        }
    }

    window.leaveVettingReport = async function () {
        var billUnitCount = $("#billUnit1").children().length;
        var output = '';
        var count = '';
        var txt = '';
        for (var i=1; i < billUnitCount; i++) {
            $(`#billUnit1 option:eq(${i})`).prop("selected", true);
            $("#proceedProcess").click();
            await delay(100);
            if ($(".loading-overlay-content").is(":visible")) {
                await delay(3000);
            }

            if ($("div.alertify .ok").length == 0) {
                console.log("hello");
                txt = $(`#billUnit1 option:eq(${i})`).val() + " \t";
                $("#initialLeaveBalanceTBody tr").each(function() {
                    txt += $(this).find("td:eq(5) input").val().substring(0,3) + ",";
                });
                $("#resetButton").after(`<div>${txt}</div>`)
            }
            else {
                $("div.alertify button.ok").click();
            }
        }
    }

    window.mutualTransfer = async function () {
        await delay(3000);
        var edu1 = $('#educationalQualification1').val();
        if(edu1 == '') throw new Error("Something went badly wrong!");

        var edu2 = $('#educationalQualification2').val();
        var comm1 = $('#community1').val();
        var comm2 = $('#community2').val();
        var med1 = $('#existingMedicalClassification1').val();
        var med2 = $('#existingMedicalClassification2').val();
        var div1 = $('#unitDivisionName1').val();
        var div2 = $('#unitDivisionName2').val();
        var cur1 = $('#departmentName1').val() + '-> ' + $('#designationName1').val() + '- L' + $('#payLevel1').val();
        var cur2 = $('#departmentName2').val() + '-> ' + $('#designationName2').val() + '- L' + $('#payLevel2').val();
        var bef1 = $('#postOfInitialAppointment1').val() + '- L' + $('#gradePayOfInitialAppointment1').val();
        var bef2 = $('#postOfInitialAppointment2').val() + '- L' + $('#gradePayOfInitialAppointment2').val();
        var rem1 = $('#remarks1').val();
        var rem2 = $('#remarks2').val();


        var insert = `
        <div style="width: 30%">
        <table class="table color-table table-bordered table-padding-5">
          <thead>
            <tr>
              <th></th>
              <th>Emp 1</th>
              <th>Emp 2</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Education</td><td>${edu1}</td><td>${edu2}</td></tr>
            <tr><td>Community</td><td>${comm1}</td><td>${comm2}</td></tr>
            <tr><td>Medical</td><td>${med1}</td><td>${med2}</td></tr>
            <tr><td>Division</td><td>${div1}</td><td>${div2}</td></tr>
            <tr><td>Current</td><td>${cur1}</td><td>${cur2}</td></tr>
            <tr><td>Before</td><td>${bef1}</td><td>${bef2}</td></tr>
            <tr><td>Remarks</td><td>${rem1}</td><td>${rem2}</td></tr>
          </tbody>
        </table>`;

        $('#employeeDataDiv table.color-table').after(insert);
    }

    window.delay = function (ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
});
























































































































})();

