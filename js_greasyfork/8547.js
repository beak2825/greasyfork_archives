// ==UserScript==
// @name        CH Precise Percents
// @author      clickhappier
// @namespace   clickhappier
// @description Adds a more precise/accurate/honest display of your approved/rejected percentages and stats qual values to the MTurk dashboard.
// @include     https://www.mturk.com/mturk/dashboard*
// @version     1.0c
// @require     https://cdnjs.cloudflare.com/ajax/libs/bignumber.js/2.0.3/bignumber.min.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/8547/CH%20Precise%20Percents.user.js
// @updateURL https://update.greasyfork.org/scripts/8547/CH%20Precise%20Percents.meta.js
// ==/UserScript==


// based on 'MTurk Dashboard Change Notifier (with 12-value mod)': https://greasyfork.org/en/scripts/3019-mturk-dashboard-change-notifier-with-12-value-mod

// https://github.com/MikeMcl/bignumber.js/blob/master/README.md , http://mikemcl.github.io/bignumber.js/ 
// - BigNumber math library used to avoid all the wrongness of javascript's built-in math functions
BigNumber.config({ DECIMAL_PLACES : 50, ERRORS : false});


var approvedHITs = new BigNumber(0);
var rejectedHITs = new BigNumber(0);
var approvedPercent = new BigNumber(0);
var rejectedPercent = new BigNumber(0);
var approvedQual = new BigNumber(0);
var rejectedQual = new BigNumber(0);
var approvedPctSpacer = "";
var rejectedPctSpacer = "";

// TCIMT's xpath query getting all table rows that have a 'class' attribute specified
var rows = document.evaluate('//tr[@class]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null); 


// retrieve approved and rejected HITs numbers
for (var i=0; i<rows.snapshotLength; i++) 
{
    var row = rows.snapshotItem(i);

    // HITs You Have Submitted section
    if (row.cells.length == 3)  // table rows with three columns
    {
        if (row.cells[0].textContent.match('... Approved')) 
        {
            approvedHITs = BigNumber( parseFloat(row.cells[1].childNodes[0].textContent) );
        }
        if (row.cells[0].textContent.match('... Rejected')) 
        {
            rejectedHITs = BigNumber( parseFloat(row.cells[1].childNodes[0].textContent) );
        }
    }
}


// perform calculations

// approved percent
if ( !(approvedHITs.equals(0)) || !(rejectedHITs.equals(0)) )  // if at least 1 HIT has been approved or rejected
    { approvedPercent = approvedHITs.dividedBy( approvedHITs.plus(rejectedHITs) ); }
else  // if 0 HITs approved+rejected (very new user)
    { approvedPercent = BigNumber(1); }  // then 100% approved
approvedPercent = BigNumber( approvedPercent.times(100).toFixed(10) );  // x% value rather than 0.x
// approved % qual value
if ( approvedHITs.plus(rejectedHITs).lessThan(100) )  // MTurk API doc says "if a Worker has submitted less than 100 assignments, the Worker's approval rate in the system is 100%."
    { approvedQual = BigNumber(100); }
else
    { approvedQual = approvedPercent.truncated(); }
// output spacer length for alignment
if ( approvedPercent.lessThan(10) ) 
    { approvedPctSpacer = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"; }  // for single-integer-digit values
else 
    { approvedPctSpacer = "&nbsp;&nbsp;&nbsp;&nbsp;"; }

// rejected percent
rejectedPercent = BigNumber(100).minus(approvedPercent);
rejectedPercent = BigNumber( rejectedPercent.toFixed(10) );
// rejected % qual value
rejectedQual = rejectedPercent.truncated();
// output spacer length for alignment
if ( rejectedPercent.lessThan(10) ) 
    { rejectedPctSpacer = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"; }  // for single-integer-digit values
else 
    { rejectedPctSpacer = "&nbsp;&nbsp;&nbsp;&nbsp;"; }


// display results
for (var i=0; i<rows.snapshotLength; i++) 
{
    var row = rows.snapshotItem(i);

    // HITs You Have Submitted section
    if (row.cells.length == 3)  // table rows with three columns
    {
        if (row.cells[0].textContent.match('... Approved')) 
        {
            row.cells[0].innerHTML += '<br><span style="color:grey;" title="Your HIT approval rate with up to 10 decimal places for better precision/accuracy, rather than being rounded to 1 decimal place.">' + approvedPctSpacer + '(' + approvedPercent + '%)</span>';
            row.cells[2].innerHTML += '<br><span style="color:grey;" title="Your actual \'HIT approval rate (%)\' stats qual value is truncated (always rounded down) from the un-rounded percent value. While you have fewer than 100 HITs (unclear whether that\'s approved or approved+rejected), this qual value apparently is always 100 (%). After that, it\'s never really 100% if you have even 1 rejection.">(qual:&nbsp;' + approvedQual + ')</span>';
        }
        if (row.cells[0].textContent.match('... Rejected')) 
        {
            row.cells[0].innerHTML += '<br><span style="color:grey;" title="Your HIT rejection rate with up to 10 decimal places for better precision/accuracy, rather than being rounded to 1 decimal place.">' + rejectedPctSpacer + '(' + rejectedPercent + '%)</span>';
            row.cells[2].innerHTML += '<br><span style="color:grey;" title="Your actual \'HIT rejection rate (%)\' stats qual value is truncated (always rounded down) from the un-rounded percent value.">(qual:&nbsp;' + rejectedQual + ')</span>';
        }
    }
}
