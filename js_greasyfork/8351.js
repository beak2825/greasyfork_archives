// ==UserScript==
// @name        mmmturkeybacon Expected Earnings - Projected Earnings This Week
// @author      mmmturkeybacon
// @description Shows projected earnings for the current week assuming all HITs are approved. If you complete a HIT after the HIT's status page has been processed by this script it will not be shown in the total until cookies are cleared and the total is recalculated by processing all of the pages again. Bonuses are also not shown in the total. The start of the week is determined by the setting in mmmturkeybacon Seven Days Dashboard and Weekly Total; the default value is Sunday.
// @namespace   http://userscripts.org/users/523367
// @match       https://www.mturk.com/mturk/dashboard
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @version     1.26
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/8351/mmmturkeybacon%20Expected%20Earnings%20-%20Projected%20Earnings%20This%20Week.user.js
// @updateURL https://update.greasyfork.org/scripts/8351/mmmturkeybacon%20Expected%20Earnings%20-%20Projected%20Earnings%20This%20Week.meta.js
// ==/UserScript==

var DATE_LIST_DELAY = 500;
var STATUSDETAIL_DELAY = 500;
var MPRE_DELAY = 2000;
var STATUSDETAIL_BASE_URL = '/mturk/statusdetail?encodedDate=';
var PROJECTED_EARNINGS_WEEK_DIV_TEXT = 'Projected Earnings This Week ';

var global_run = false;
var statusdetail_loop_finished = false;
var resume_date = 0;
var resume_page = 0;
var page_total = 0;
var subtotal = 0;
var page_num = 1;

var projected_earnings_week_div = document.createElement('DIV');
var projected_earnings_week_field = document.createElement('TD');

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

if (localStorage.getItem('mmmturkeybacon_seven_days_dashboard_start_of_week') == null)
{
    localStorage.setItem('mmmturkeybacon_seven_days_dashboard_start_of_week', '0');  // '0' for Sunday, '1' for Monday, etc.
}

if (localStorage.getItem('mmmturkeybacon_projected_earnings_this_week_start_of_week') != localStorage.getItem('mmmturkeybacon_seven_days_dashboard_start_of_week'))
{
    clearCookies();
    localStorage.setItem('mmmturkeybacon_projected_earnings_this_week_start_of_week', localStorage.getItem('mmmturkeybacon_seven_days_dashboard_start_of_week'));
}

function set_progress_report(text, force)
{
    if (global_run == true || force == true)
    {
        projected_earnings_week_div.innerHTML = text;
    }
}

function wait_until_finished()
{
    if (global_run == true)
    {
        if (statusdetail_loop_finished == true)
        {
            /* The page_total isn't added to subtotal before it is saved because the last page
             * might not be a full page. It's easier to rescrape the entire last page than to
             * remember the position of the last HIT scraped on a page. Additionally since HITs
             * are often worked on in an order different than they were accepted there might be
             * a HIT that gets inserted before the last HIT we scraped. */
            setCookie('mmmturkeybacon_projected_earnings_week_total', subtotal+page_total, 7);
            setCookie('mmmturkeybacon_projected_earnings_week_subtotal', subtotal, 7);
            setCookie('mmmturkeybacon_projected_earnings_week_resume_page', page_num, 7);

            global_run = false;
            projected_earnings_week_div.innerHTML = PROJECTED_EARNINGS_WEEK_DIV_TEXT;
            projected_earnings_week_field.innerHTML = '$' + ((subtotal+page_total)/100).toFixed(2);
        }
        else
        {
            setTimeout(function(){wait_until_finished();}, 500);
        }
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
                var maxpagerate = $src.find('td[class="error_title"]:contains("You have exceeded the maximum allowed page request rate for this website.")');
                if (maxpagerate.length == 0)
                {
                    subtotal += page_total;
                    setCookie('mmmturkeybacon_projected_earnings_week_subtotal', subtotal, 7);
                    setCookie('mmmturkeybacon_projected_earnings_week_resume_page', page_num, 7);

                    var date_header = $src.find('td[class="white_text_14_bold"]:contains("HITs You Worked On For")').text().replace(/HITs You Worked On For|\(What\'s this\?\)/g, '').trim();
                    set_progress_report('Processing ' + date_header + ' - page ' + page_num);

                    scrape($src);

                    $next_URL = $src.find('a[href^="/mturk/statusdetail"]:contains("Next")');
                    next_URL = ($next_URL.length != 0) ? $next_URL.attr('href') : '';

                    if (next_URL != 0)
                    {
                        page_num++;
                        next_URL = $next_URL.attr('href');
                    }
                    else
                    {
                        next_URL = '';
                    }

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

                var date_URL = date_URLs.pop();
                var mmddyyyy = date_URL.replace(STATUSDETAIL_BASE_URL, '');
                var yyyymmdd = mmddyyyy.substring(4) + mmddyyyy.substring(0,4);
                setCookie('mmmturkeybacon_projected_earnings_week_resume_date', yyyymmdd, 7);

                var next_URL = date_URL + '&sortType=All&pageNumber=1';
                if (yyyymmdd == resume_date)
                {
                    page_num = resume_page;
                    next_URL = date_URL + '&sortType=All&pageNumber='+resume_page;
                }

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
    var new_row = document.createElement('TR');
    new_row.id = 'projected_earnings_week';

    var projected_earnings_week_clear_cookies_div = document.createElement('DIV');
    projected_earnings_week_clear_cookies_div.innerHTML = '<font color="red">x</font>';
    projected_earnings_week_clear_cookies_div.title = 'Click to clear and recalculate.';
    projected_earnings_week_clear_cookies_div.style.cssText = 'display: inline; cursor: pointer';
    projected_earnings_week_clear_cookies_div.onclick = function(){clearCookies(); start_running();};

    projected_earnings_week_div.title = 'Click to calculate/stop.';
    projected_earnings_week_div.style.cssText = 'display: inline; cursor: pointer';
    projected_earnings_week_div.onclick = function(){start_running();};
    projected_earnings_week_div.onmouseover = function(){var d = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']; this.title = 'Click to calculate/stop.' + ' Week starts on ' + d[Number(localStorage.getItem('mmmturkeybacon_seven_days_dashboard_start_of_week'))] + '.'};

    var projected_earnings_week_div_cell = document.createElement('TD');
    projected_earnings_week_div_cell.className = 'metrics-table-first-value';
    projected_earnings_week_div_cell.style.paddingLeft = '3px';
    projected_earnings_week_div_cell.appendChild(projected_earnings_week_clear_cookies_div);
    projected_earnings_week_div_cell.appendChild(document.createTextNode(' '));
    projected_earnings_week_div_cell.appendChild(projected_earnings_week_div);

    new_row.appendChild(projected_earnings_week_div_cell);
    new_row.appendChild(projected_earnings_week_field);

    var $expected_earnings_header = $('tr[id="expected_earnings_row"]');
    if ($expected_earnings_header.length > 0)
    {

        // Approved, Pending, Projected Month, Projected Week, Projected Today
        var $projected_earnings_today_row = $('tr[id="projected_earnings_today"]');
        if ($projected_earnings_today_row.length > 0)
        {
            $projected_earnings_today_row.before(new_row);
        }
        else
        {
            $expected_earnings_header.nextAll('tr').last().after(new_row);
        }
 
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


    projected_earnings_week_div.innerHTML = PROJECTED_EARNINGS_WEEK_DIV_TEXT;
    projected_earnings_week_field.innerHTML = '$?.??';
    var saved_total = parseInt(getCookie('mmmturkeybacon_projected_earnings_week_total'), 10);
    if (saved_total)
    {
        projected_earnings_week_field.innerHTML = '$' + (saved_total/100).toFixed(2);
    }

}

function start_running()
{
    if (localStorage.getItem('mmmturkeybacon_projected_earnings_this_week_start_of_week') != localStorage.getItem('mmmturkeybacon_seven_days_dashboard_start_of_week'))
    {
        clearCookies();
        localStorage.setItem('mmmturkeybacon_projected_earnings_this_week_start_of_week', localStorage.getItem('mmmturkeybacon_seven_days_dashboard_start_of_week'));
    } 

    if (global_run == false)
    {
        global_run = true;
        statusdetail_loop_finished = true;
        page_total = 0;
        page_num = 1;

        resume_date = getCookie('mmmturkeybacon_projected_earnings_week_resume_date');
        subtotal = parseInt(getCookie('mmmturkeybacon_projected_earnings_week_subtotal'), 10);
        resume_page = parseInt(getCookie('mmmturkeybacon_projected_earnings_week_resume_page'), 10);

        resume_date = (resume_date) ? resume_date : 0;
        subtotal = (subtotal) ? subtotal : 0;
        resume_page = (resume_page) ? resume_page : 1;

        projected_earnings_week_div.innerHTML = PROJECTED_EARNINGS_WEEK_DIV_TEXT;
        projected_earnings_week_field.innerHTML = '$?.??';

        $.get('/mturk/status', function(data)
        {
            var $src = $(data);
            var maxpagerate = $src.find("td[class='error_title']:contains('You have exceeded the maximum allowed page request rate for this website.')");
            if (maxpagerate.length == 0)
            {
                var week_start = new Date(amazon_time_ms);
                week_start.setUTCDate(week_start.getUTCDate() - ((7 - Number(localStorage.getItem('mmmturkeybacon_seven_days_dashboard_start_of_week')) + week_start.getUTCDay()) % 7));

                //http://stackoverflow.com/questions/3605214/javascript-add-leading-zeroes-to-date
                var week_start_date =  week_start.getUTCFullYear() + ('0' + (week_start.getUTCMonth()+1)).slice(-2) + ('0' + week_start.getUTCDate()).slice(-2);

                var begin_date = resume_date;
                if (resume_date < week_start_date)
                {
                    begin_date = week_start_date;
                    clearCookies();
                    resume_date = 0;
                    subtotal = 0;
                    resume_page = 1;
                }

                var date_URLs = new Array();
                $src.find('a[href^="/mturk/statusdetail"]').filter(function()
                {
                    var mmddyyyy = $(this).attr('href').substring(32);
                    var yyyymmdd = mmddyyyy.substring(4) + mmddyyyy.substring(0,4);
                    return (yyyymmdd >= begin_date);
                }).each(function(){date_URLs.push($(this).attr('href'));});

                date_list_loop(date_URLs);
            }
        });
    }
    else
    {
        global_run = false; // this will stop scraping pages prematurely
        projected_earnings_week_div.innerHTML = PROJECTED_EARNINGS_WEEK_DIV_TEXT + '- stopped! ';
        projected_earnings_week_field.innerHTML = '$?.??';
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
   setCookie('mmmturkeybacon_projected_earnings_week_resume_date', 0, 7);
   setCookie('mmmturkeybacon_projected_earnings_week_total', 0, 7);
   setCookie('mmmturkeybacon_projected_earnings_week_subtotal', 0, 7);
   setCookie('mmmturkeybacon_projected_earnings_week_resume_page', 1, 7);
   setCookie('mmmturkeybacon_seven_days_dashboard_amazon_timezone_offset', 0, 1);
   return true;
}

draw_interface();