// ==UserScript==
// @name        mmmturkeybacon Expected Earnings - Projected Earnings For Today
// @author      mmmturkeybacon
// @description Shows projected earnings for the current day assuming all HITs are approved. If you complete a HIT after the HIT's status page has been processed by this script it will not be shown in the total until cookies are cleared and the total is recalculated by processing all of the pages again. Bonuses are also not shown in the total. This script was written to prevent miscalculations caused by maximum page rate exceeded errors that plagued the original version.
// @namespace   http://userscripts.org/users/523367
// @match       https://www.mturk.com/mturk/dashboard
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @version     1.02
// @grant       GM_log
// @downloadURL https://update.greasyfork.org/scripts/8352/mmmturkeybacon%20Expected%20Earnings%20-%20Projected%20Earnings%20For%20Today.user.js
// @updateURL https://update.greasyfork.org/scripts/8352/mmmturkeybacon%20Expected%20Earnings%20-%20Projected%20Earnings%20For%20Today.meta.js
// ==/UserScript==

// TODO:
// keep rejected total and scrape it every time (sort by rejected)
// add rejected hits to subtotal and then subtract total rejected sum after totaling
// this assumes the number of rejected hits is small

var STATUSDETAIL_DELAY = 500;
var MPRE_DELAY = 2000;
var STATUSDETAIL_BASE_URL = '/mturk/statusdetail?encodedDate=';
var PROJECTED_EARNINGS_TODAY_DIV_TEXT = 'Projected Earnings For Today ';

var global_run = false;
var page_total = 0;
var subtotal = 0;
var page_num = 1;

var projected_earnings_today_div = document.createElement("DIV");
var projected_earnings_today_field = document.createElement("TD");      

function set_progress_report(text, force)
{
    if (global_run == true || force == true)
    {
        projected_earnings_today_div.innerHTML = text;
    }
}

function scrape($src)
{
    var $reward = $src.find('td[class="statusdetailStatusColumnValue"]:not(:contains("Rejected"))').siblings('td[class="statusdetailAmountColumnValue"]');
    page_total = 0;

    for (var j = 0; j < $reward.length; j++)
    {
        // I'm worried if I use parseFloat errors will accumulate because floats are inexact
        page_total += parseInt($reward.eq(j).text().replace(/[^0-9]/g,''), 10);              
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
                var maxpagerate = $src.find("td[class='error_title']:contains('You have exceeded the maximum allowed page request rate for this website.')");
                if (maxpagerate.length == 0)
                {
                    subtotal += page_total;
                    var date_header = $src.find("td[class='white_text_14_bold']:contains('HITs You Worked On For')").text().replace(/HITs You Worked On For|\(What\'s this\?\)/g, '').trim();
                    set_progress_report('Processing ' + date_header + ' - page ' + page_num);
                    page_num++;

                    scrape($src);

                    $next_URL = $src.find("a[href^='/mturk/statusdetail']:contains('Next')");
                    next_URL = ($next_URL.length != 0) ? $next_URL.attr('href') : '';

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
            /* The page_total isn't added to subtotal before it is saved because the last page
             * might not be a full page. It's easier to rescrape the entire last page than to
             * remember the position of the last HIT scraped on a page. Additionally since HITs
             * are often worked on in an order different than they were accepted there might be
             * a HIT that gets inserted before the last HIT we scraped. */
            setCookie('mmmturkeybacon_projected_earnings_today_subtotal', subtotal, 1);
            setCookie('mmmturkeybacon_projected_earnings_today_last_page', page_num-1, 1);

            global_run = false;
            projected_earnings_today_div.innerHTML = PROJECTED_EARNINGS_TODAY_DIV_TEXT;
            projected_earnings_today_field.innerHTML = '$' + ((subtotal+page_total)/100).toFixed(2);
        }
    }
}


function draw_interface()
{
    var new_row = document.createElement("tr");
    new_row.id = 'projected_earnings_today';

    var projected_earnings_today_clear_cookies_div = document.createElement('DIV');
    projected_earnings_today_clear_cookies_div.innerHTML = '<font color="red">x</font>';
    projected_earnings_today_clear_cookies_div.title = 'Click to clear and recalculate.';
    projected_earnings_today_clear_cookies_div.style.cssText = 'display: inline; cursor: pointer';
    projected_earnings_today_clear_cookies_div.onclick = function(){clearCookies(); start_running(); return false;}; // return false so href isn't followed

    projected_earnings_today_div.title = 'Click to calculate/stop.';
    projected_earnings_today_div.style.cssText = 'display: inline; cursor: pointer';
    projected_earnings_today_div.onclick = function(){start_running(); return false;}; // return false so href isn't followed

    var projected_earnings_today_div_cell = document.createElement('TD');
    projected_earnings_today_div_cell.className = 'metrics-table-first-value';
    projected_earnings_today_div_cell.style.paddingLeft = '3px';
    projected_earnings_today_div_cell.appendChild(projected_earnings_today_clear_cookies_div);
    projected_earnings_today_div_cell.appendChild(document.createTextNode(' '));
    projected_earnings_today_div_cell.appendChild(projected_earnings_today_div);

    new_row.appendChild(projected_earnings_today_div_cell);
    new_row.appendChild(projected_earnings_today_field);

    var $expected_earnings_header = $('tr[id="expected_earnings_row"]');
    if ($expected_earnings_header.length > 0)
    {
        // Approved, Pending, Projected Month, Projected Week, Projected Today
        $expected_earnings_header.nextAll('tr').last().after(new_row);
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

    projected_earnings_today_div.innerHTML = PROJECTED_EARNINGS_TODAY_DIV_TEXT;
    projected_earnings_today_field.innerHTML = '$?.??';

    start_running();
}

function start_running()
{
    if (global_run == false)
    {
        global_run = true;
        page_total = 0;
        subtotal = 0;
        page_num = 1;

        var day_name = $("a[href^='"+STATUSDETAIL_BASE_URL+"']:first").text();
        if (day_name == 'Today')
        {
            var last_date_worked = $("a[href^='"+STATUSDETAIL_BASE_URL+"']:first").attr('href').replace(STATUSDETAIL_BASE_URL, '');
            if(last_date_worked != getCookie('mmmturkeybacon_projected_earnings_today_date'))
            {
               setCookie('mmmturkeybacon_projected_earnings_today_date', last_date_worked, 1);
               setCookie('mmmturkeybacon_projected_earnings_today_subtotal', 0, 1);
               setCookie('mmmturkeybacon_projected_earnings_today_last_page', 1, 1);
            }
    
            subtotal = parseInt(getCookie('mmmturkeybacon_projected_earnings_today_subtotal'), 10);
            page_num = parseInt(getCookie('mmmturkeybacon_projected_earnings_today_last_page'), 10);

            projected_earnings_today_div.innerHTML = PROJECTED_EARNINGS_TODAY_DIV_TEXT;
            projected_earnings_today_field.innerHTML = '$?.??';

            var date_URLs = STATUSDETAIL_BASE_URL + last_date_worked + '&sortType=All&pageNumber=' + page_num;
            statusdetail_loop(date_URLs);
        }
        else
        {
            projected_earnings_today_div.innerHTML = PROJECTED_EARNINGS_TODAY_DIV_TEXT;
            projected_earnings_today_field.innerHTML = '$0.00';
        }
    }
    else
    {
        global_run = false; // this will stop scraping pages prematurely
        projected_earnings_today_div.innerHTML = PROJECTED_EARNINGS_TODAY_DIV_TEXT + '- stoppped! ';
        projected_earnings_today_field.innerHTML = '$?.??';
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
   setCookie('mmmturkeybacon_projected_earnings_today_subtotal', 0, 1);
   setCookie('mmmturkeybacon_projected_earnings_today_last_page', 1, 1);
   return true;
}

draw_interface();