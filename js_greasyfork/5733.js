// ==UserScript==
// @name         HITs Accepted on Dashboard/HIT Scraper Link
// @namespace    http://ericfraze.com
// @version      0.1
// @description  This is a grouped script. If you want just the link, or just the dashboard, find my other scripts on GreasyFork. Shows the number of hits you have accepted, lists theme, and also a link to HIT scraper.
// @author       Eric Fraze
// @match        https://www.mturk.com/mturk/*
// @grant        none
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/5733/HITs%20Accepted%20on%20DashboardHIT%20Scraper%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/5733/HITs%20Accepted%20on%20DashboardHIT%20Scraper%20Link.meta.js
// ==/UserScript==

var hitsAssigned = "N/A (there was an error or something, contact Magnilucent if it happens a lot)";
var hitString = "";
var title = [];
var requester = [];
var pay = [];
var timeLeft = [];
var returnURL = [];
var continueURL = [];

url = window.location.href;

// Make sure we are on the dashboard of mTurk.com
if ( url.indexOf("dashboard") !== -1 ) {
    // Send an AJAX request to the HITs accepted list
    $.ajax({
        url: "https://www.mturk.com/mturk/myhits",
        dataType: "html",
        success: function(data) {
            // Check to see if any HITs are assigned
            if ( $("td:contains('There are currently no HITs assigned to you.')", data).length ) {
                hitsAssigned = 0;
            }else{
                // Get the text that holds the HITs assigned number
                var text = $("td.title_orange_text[style='white-space: nowrap; padding-top: 1ex;']", data).text();

                // Regex to select the number in the string
                var regstring = /(\d{1,2})(\sResults)/;
                var reg = new RegExp(regstring);
                var groups = reg.exec(text);
                
                // Get the number
                hitsAssigned = groups[1];
                
                // Begining of the table used to display the HITs
                hitString = '<table class="metrics-table" width="100%">' +
                    '<tbody><tr class="metrics-table-header-row">' +
                        '<th class="metrics-table-first-header">' +
                          'Title' +
                        '</th>' +
                        '<th>' +
                            'Requester' +
                        '</th>' +
                        '<th>' +
                            'Reward' +
                        '</th>' +
                        '<th style="white-space: nowrap;">' +
                            'Time Left' +
                        '</th>' +
                        '<th>' +
                            'Return' +
                        '</th>' +
                    '</tr>';
                
                // Loop through each HIT on this page
                $('table[width="100%"][height="100%"]', data).each( function(i) {
                    title[i] = $(this).find("a.capsulelink[href='#']").text().trim();
                    requester[i] = $(this).find(".requesterIdentity").text()
                    pay[i] = $(this).find(".reward").text()
                    timeLeft[i] = $(this).find("td[width='25%'] td.capsule_field_text").text().trim();

                    // sign is used to alterate the row backgrounds
                    var sign = "odd"
                    if ( ((i + 1)/2) == Math.round((i + 1)/2) )
                        sign = 'even';
                    
                    // Shorten the time left string
                    timeLeft[i] = timeLeft[i].replace(" minutes", "m").replace(" seconds", "s");;
                    
                    // Construct the return link for this HIT
                    returnURL[i] = $(this).find("a[href^='/mturk/return']").attr("href");

                    // Construct the continue link for this HT
                    continueURL[i] = $(this).find("a[href^='/mturk/continue']").attr("href");
                    
                    // Add the HIT to the table
                    hitString += '<tr class="' + sign + '">' +
                                    '<td class="metrics-table-first-value"><a href="' + continueURL[i] + '">' + (title[i].length > 60 ? title[i].substring(0, 60 - 3) + '...' : title[i]) + '</a></td>' +
                                    '<td style="white-space: nowrap;"><a href="/mturk/searchbar?searchWords=' + encodeURIComponent(requester[i]) + '">' + (requester[i].length > 15 ? requester[i].substring(0, 15 - 3) + '...' : requester[i]) + '</a></td>' +
                                    '<td>' + pay[i] + '</td>' +
                                    '<td>' + timeLeft[i] + '</td>' +
                        			'<td style="text-align: center;"><a href="' + returnURL[i] + '">Return</a></td>' +
                                 '</tr>';
                }); // End loop
                
                // Close the table
                hitString += '</tbody></table>';
            }

            // Add the number and table to the page
            addHitNumber();
        }
    });
}

$(document).ready(function() {
    if ( $("td:contains('Your HIT Status')").length ) {
        // Add the HIT scraper link
        $("#subtabs a:contains('Introduction')").attr("href", "https://www.mturk.com/mturk/findhits?match=true?hit_scraper");
    	$("#subtabs a:contains('Introduction')").text("HIT Scraper");

        // Add the number and table to the page
    	addHitNumber();
    }else{
        // Add the HIT scraper link
       $("#subtabs").prepend("<a class='subnavclass' href='https://www.mturk.com/mturk/findhits?match=true?hit_scraper'>HIT Scraper</a><span class='almostblack_text'>&nbsp;|&nbsp;</span>"); 
    }
});

function addHitNumber() {
    // If the table hasn't been added
    if ( !$("#HITNumber").length ){
        // Add the table and add content
    	$("td:contains('Your HIT Status')").parents("table").before('<table width="760" align="center" cellspacing="0" cellpadding="0"><tbody><tr height="25px"><td width="10" bgcolor="#7fb4cf" style="padding-left: 10px;"></td><td width="100%" bgcolor="#7fb4cf" class="white_text_14_bold"><a href="https://www.mturk.com/mturk/myhits">HITs Assigned to You</a> (<span id="HITNumber">' + hitsAssigned + '</span>)</td><td width="10" align="right" bgcolor="#7fb4cf"></td></tr><tr><td class="container-content" colspan="3"><table class="metrics-table" width="100%"><tbody><tr><td id="HITInfo"></td></tr></tbody></table></td></tr></tbody></table>');
        $("#HITInfo").append(hitString);
    }else{
        // Update table content
        $("#HITNumber").text(hitsAssigned);
        $("#HITInfo").empty();
        $("#HITInfo").append(hitString);
    }
}