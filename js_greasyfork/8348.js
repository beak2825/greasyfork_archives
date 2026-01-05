// ==UserScript==
// @name        mmmturkeybacon Expected Earnings - Approved (Awaiting Payment) Earnings
// @version     1.08
// @description Shows the total earnings from all HITs over the past 30 days which have been recently approved but not yet paid out. Mouseover the value field to see the dates of recently approved - pending payment HITs.
// @author      mmmturkeybacon
// @namespace   http://userscripts.org/users/523367
// @match       https://www.mturk.com/mturk/dashboard
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/8348/mmmturkeybacon%20Expected%20Earnings%20-%20Approved%20%28Awaiting%20Payment%29%20Earnings.user.js
// @updateURL https://update.greasyfork.org/scripts/8348/mmmturkeybacon%20Expected%20Earnings%20-%20Approved%20%28Awaiting%20Payment%29%20Earnings.meta.js
// ==/UserScript==


var DATE_LIST_DELAY = 500;
var STATUSDETAIL_DELAY = 500;
var MPRE_DELAY = 2000;
var APPROVED_PENDING_EARNINGS_DIV_TEXT = 'Approved (Awaiting Payment) Earnings ';

var global_run = false;
var statusdetail_loop_finished = false;
var total = 0;
var page_num = 1;

var approved_pending_earnings_div = document.createElement("DIV");
var approved_pending_earnings_field = document.createElement("TD");

var approved_pending_earnings_field_title = '';

//var amazon_timezone_offset = -25200000; //PDT:-25200000, PST:-28800000
var amazon_timezone_offset = parseInt(getCookie('mmmturkeybacon_seven_days_dashboard_amazon_timezone_offset'), 10);
if (!amazon_timezone_offset)
{
    GM_xmlhttpRequest(
    {
        method: 'GET',
        url: 'https://maps.googleapis.com/maps/api/timezone/json?location=47.6097,-122.3331&timestamp='+(new Date()).getTime()/1000+'&sensor=false',
        synchronous: true,
        onload: function (results)
        {
            var rdata = $.parseJSON(results.responseText);
            amazon_timezone_offset = rdata['dstOffset']*1000 + rdata['rawOffset']*1000;
            setCookie('mmmturkeybacon_seven_days_dashboard_amazon_timezone_offset', amazon_timezone_offset, 1);
        }
    });
}

var amazon_time_ms = (new Date()).getTime() + amazon_timezone_offset;

function set_progress_report(text, force)
{
    if (global_run == true || force == true)
    {
        approved_pending_earnings_div.innerHTML = text;
    }
}

function wait_until_finished()
{
    if (global_run == true)
    {
        if (statusdetail_loop_finished == true)
        {
            global_run = false;
            approved_pending_earnings_div.innerHTML = APPROVED_PENDING_EARNINGS_DIV_TEXT;
            approved_pending_earnings_field.innerHTML = '$' + (total/100).toFixed(2);
            approved_pending_earnings_field.title = approved_pending_earnings_field_title.substring(2);
            setCookie('mmmturkeybacon_approved_pending_earnings_total', total, 1);
        }
        else
        {
            setTimeout(function(){wait_until_finished();}, 500);
        }
    }
}

function scrape($src)
{

    var $reward = $src.find('td[class="statusdetailAmountColumnValue"]');

    for (var j = 0; j < $reward.length; j++)
    {
        // I'm worried if I use parseFloat errors will accumulate because floats are inexact
        var reward = parseInt($reward.eq(j).text().replace(/[^0-9]/g,''), 10);
        total += reward;
    }
    
    if ($reward.length > 0)  // if approved hits found on this page
    {
        // this page's date, dropping the comma and year
        var approved_pending_date = $src.find("td[class='white_text_14_bold']:contains('HITs You Worked On For')").text().replace(/HITs You Worked On For|\(What\'s this\?\)/g, '').trim().split(',', 1);  
        if (approved_pending_earnings_field_title.indexOf(approved_pending_date) == -1)
        {
            approved_pending_earnings_field_title += ", " + approved_pending_date;
        }
    }
}

function statusdetail_loop(next_URL)
{
    if (global_run == true)
    {
        if (next_URL.length != 0)
        {
            $.get(next_URL, function(data)
            {
                var $src = $(data);
                var maxpagerate = $src.find('td[class="error_title"]:contains("You have exceeded the maximum allowed page request rate for this website.")');
                if (maxpagerate.length == 0)
                {
                    var date_header = $src.find("td[class='white_text_14_bold']:contains('HITs You Worked On For')").text().replace(/HITs You Worked On For|\(What\'s this\?\)/g, '').trim();
                    set_progress_report('Processing ' + date_header + ' - page ' + page_num);
                    page_num++;
                    scrape($src);
     
                    $next_URL = $src.find('a[href^="/mturk/statusdetail"]:contains("Next")');
                    next_URL = ($next_URL.length != 0) ? $next_URL.attr("href") : "";
                    setTimeout(function(){statusdetail_loop(next_URL);}, STATUSDETAIL_DELAY);
                }
                else
                {
                    setTimeout(function(){statusdetail_loop(next_URL);}, MPRE_DELAY);
                }
            });
        }
        else
        {
            statusdetail_loop_finished = true;
        }
    }
}

function date_list_loop(date_URLs)
{
    if (global_run == true)
    {
        if (date_URLs.length != 0)
        {
            if (statusdetail_loop_finished == true)
            {
                page_num = 1;
                statusdetail_loop_finished = false;

                var next_URL = date_URLs.pop() + '&sortType=Approved&pageNumber=1';
                statusdetail_loop(next_URL);

                setTimeout(function(){date_list_loop(date_URLs);}, DATE_LIST_DELAY);
            }
            else
            {
                setTimeout(function(){date_list_loop(date_URLs);}, DATE_LIST_DELAY);
            }
        }
        else
        {
            wait_until_finished();
        }
    }
}

function draw_interface()
{
    var new_row = document.createElement("tr");
    new_row.id = 'approved_pending_earnings';

    var approved_pending_earnings_clear_cookies_div = document.createElement('DIV');
    approved_pending_earnings_clear_cookies_div.innerHTML = '<font color="red">x</font>';
    approved_pending_earnings_clear_cookies_div.title = 'Click to clear and recalculate.';
    approved_pending_earnings_clear_cookies_div.style.cssText = 'display: inline; cursor: pointer';
    approved_pending_earnings_clear_cookies_div.onclick = function(){clearCookies(); start_running();};

    approved_pending_earnings_div.title = 'Earnings from HITs that have been approved, but not yet paid out. Click to calculate/stop.';
    approved_pending_earnings_div.style.cssText = 'display: inline; cursor: pointer';
    approved_pending_earnings_div.onclick = function(){start_running();};

    var approved_pending_earnings_div_cell = document.createElement("td");
    approved_pending_earnings_div_cell.className = 'metrics-table-first-value';
    approved_pending_earnings_div_cell.style.paddingLeft = '3px';
    approved_pending_earnings_div_cell.appendChild(approved_pending_earnings_clear_cookies_div);
    approved_pending_earnings_div_cell.appendChild(document.createTextNode(' '));
    approved_pending_earnings_div_cell.appendChild(approved_pending_earnings_div);

    new_row.appendChild(approved_pending_earnings_div_cell);
    new_row.appendChild(approved_pending_earnings_field);

    var $expected_earnings_header = $('tr[id="expected_earnings_row"]');
    if ($expected_earnings_header.length > 0)
    {
        // Approved, Pending, Projected Month, Projected Week, Projected Today
        $expected_earnings_header.after(new_row);
        $expected_earnings_header.nextAll('tr').each(function(index)
        {
            $(this).attr('class', ((index % 2 == 0) ? 'odd' : 'even'));
        });
    }
    else
    {
        var $transfer_earnings_row = $('a[href="/mturk/transferearnings"]:contains("Transfer Earnings")').parent().parent();
        $transfer_earnings_row.after('<tr id="expected_earnings_row" class="metrics-table-header-row"><th class="metrics-table-first-header">Expected Earnings</th><th>Value</th></tr>');
        $expected_earnings_header = $('tr[id="expected_earnings_row"]');
        new_row.className = 'odd';
        $expected_earnings_header.after(new_row);
    }

    approved_pending_earnings_div.innerHTML = APPROVED_PENDING_EARNINGS_DIV_TEXT;
    approved_pending_earnings_field.innerHTML = '$?.??';
    var saved_total = parseInt(getCookie('mmmturkeybacon_approved_pending_earnings_total'), 10);
    if (saved_total)
    {
        approved_pending_earnings_field.innerHTML = '$' + (saved_total/100).toFixed(2);
    }
}


function start_running()
{
    if (global_run == false)
    {
        global_run = true;
        statusdetail_loop_finished = true;
        total = 0;
        page_num = 1;
        approved_pending_earnings_field_title = '';

        approved_pending_earnings_div.innerHTML = APPROVED_PENDING_EARNINGS_DIV_TEXT;
        approved_pending_earnings_field.innerHTML = '$?.??';
        approved_pending_earnings_field.title = approved_pending_earnings_field_title;

        $.get('/mturk/status', function(data)
        {
            var $src = $(data);
            var maxpagerate = $src.find("td[class='error_title']:contains('You have exceeded the maximum allowed page request rate for this website.')");
            if (maxpagerate.length == 0)
            {
                var thirty_days_ago = new Date(amazon_time_ms);
                thirty_days_ago.setUTCDate(thirty_days_ago.getUTCDate() - 30);
                //http://stackoverflow.com/questions/3605214/javascript-add-leading-zeroes-to-date
                var thirty_days_ago_date = thirty_days_ago.getUTCFullYear() + ('0' + (thirty_days_ago.getUTCMonth()+1)).slice(-2) + ('0' + thirty_days_ago.getUTCDate()).slice(-2);

                var date_URLs = new Array();
                $src.find('td[class="statusApprovedColumnValue"]').filter(function(){return($(this).text() != '0')}).siblings('td[class="statusDateColumnValue"]').children('a[href^="/mturk/statusdetail"]').filter(function()
                {
                    var mmddyyyy = $(this).attr('href').substring(32);
                    var yyyymmdd = mmddyyyy.substring(4) + mmddyyyy.substring(0,4);
                    return (yyyymmdd >= thirty_days_ago_date);
                }).each(function(){date_URLs.push($(this).attr('href'));});

                date_list_loop(date_URLs);
            }
        });
    }
    else
    {
        global_run = false; // this will stop scraping pages prematurely
        approved_pending_earnings_div.innerHTML = APPROVED_PENDING_EARNINGS_DIV_TEXT + '- stopped! ';
        approved_pending_earnings_field.innerHTML = '$?.??';
    }
}

//
//  Cookie functions copied from http://www.w3schools.com/JS/js_cookies.asp
//

function setCookie(c_name,value,exdays)
{
   var exdate=new Date(); 
   exdate.setDate(exdate.getDate() + exdays);
   var c_value=escape(value) + ((exdays==null) ? '' : '; expires='+exdate.toUTCString());
   document.cookie=c_name + '=' + c_value;
}


function getCookie(c_name)
{
   var i,x,y,ARRcookies=document.cookie.split(';');
   for (i=0;i<ARRcookies.length;i++)
   {
      x=ARRcookies[i].substr(0,ARRcookies[i].indexOf('='));
      y=ARRcookies[i].substr(ARRcookies[i].indexOf('=')+1);
      x=x.replace(/^\s+|\s+$/g,'');
      if (x==c_name)
      {
         return unescape(y);
      }
   }
}

function clearCookies()
{
   setCookie('mmmturkeybacon_approved_pending_earnings_total', 0, 1);
   setCookie('mmmturkeybacon_seven_days_dashboard_amazon_timezone_offset', 0, 1);
   return true;
}

draw_interface();