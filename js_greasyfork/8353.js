// ==UserScript==
// @name        mmmturkeybacon Seven Days Dashboard and Weekly Total
// @author      mmmturkeybacon
// @description Puts the last seven days, whether they were worked on or not, on the dashboard. Puts the sum of the columns for the week in weekly total fields. Let's you choose which day is the start of the week for calculating the weekly total (the same day is used by mmmturkeybacon Expected Earnings - Projected Earnings This Week). Copy the totals line to generate your own weekly activity report.
// @namespace   http://userscripts.org/users/523367
// @match       https://www.mturk.com/mturk/dashboard
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @version     2.05
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/8353/mmmturkeybacon%20Seven%20Days%20Dashboard%20and%20Weekly%20Total.user.js
// @updateURL https://update.greasyfork.org/scripts/8353/mmmturkeybacon%20Seven%20Days%20Dashboard%20and%20Weekly%20Total.meta.js
// ==/UserScript==

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
var $src;
var months_short = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

if (localStorage.getItem('mmmturkeybacon_seven_days_dashboard_start_of_week') == null)
{
    localStorage.setItem('mmmturkeybacon_seven_days_dashboard_start_of_week', '0');
}


function append_extra_days()
{
    var $last_status_line_link = $('a[href^="/mturk/statusdetail"]').eq(4);
    var last_status_line_date = $last_status_line_link.attr('href').substring(32);
    last_status_line_date = last_status_line_date.substring(4) + last_status_line_date.substring(0,4);

    var six_days_ago = new Date(amazon_time_ms);
    six_days_ago.setUTCDate(six_days_ago.getUTCDate() - 6);
    //http://stackoverflow.com/questions/3605214/javascript-add-leading-zeroes-to-date
    var six_days_ago_date = six_days_ago.getUTCFullYear() + ('0' + (six_days_ago.getUTCMonth()+1)).slice(-2) + ('0' + six_days_ago.getUTCDate()).slice(-2);

    var $extra_days = $src.find('a[href^="/mturk/statusdetail"]').filter(function()
    {
        var mmddyyyy = $(this).attr('href').substring(32);
        var yyyymmdd = mmddyyyy.substring(4) + mmddyyyy.substring(0,4);
        return (yyyymmdd >= six_days_ago_date && yyyymmdd < last_status_line_date);
    });

    for (var i = $extra_days.length-1; i >= 0; i--)
    {
        $extra_days.eq(i).parent().attr('class', 'metrics-table-first-value');
        $last_status_line_link.parent().parent().after($extra_days.eq(i).parent().parent()[0].outerHTML);
    }
}

function insert_missing_days()
{
    var date = new Date(amazon_time_ms);
    var date_today = date.getUTCDate();

    var $insertion_ref = $('th[id="user_activities.date_column_header.tooltip"][class="metrics-table-first-header"]').parent();
    for (var i = 0; i < 7; i++)
    {
        var date_zero_formatted = ('0' + (date.getUTCMonth()+1)).slice(-2) + ('0' + date.getUTCDate()).slice(-2) + date.getUTCFullYear();
        var date_short_formatted = months_short[date.getUTCMonth()] + ' ' + date.getUTCDate() + ', ' + date.getUTCFullYear();

        if (i == 0)
        {
            date_short_formatted = 'Today';
        }

        var $status_line_link = $('a[href$="'+date_zero_formatted+'"]');
        if ($status_line_link.length <= 0)
        {
            $insertion_ref.after('<tr class="even"><td class="metrics-table-first-value"><a href="/mturk/statusdetail?encodedDate='+date_zero_formatted+'">'+date_short_formatted+'</a></td><td>0</td><td>0</td><td>0</td><td>0</td><td><span class="reward">$0.00</span></td></tr>')
            $insertion_ref = $('a[href$="'+date_zero_formatted+'"]').parent().parent();
        }
        else
        {
            $insertion_ref = $status_line_link.parent().parent();
        }
        date.setUTCDate(date.getUTCDate() - 1);
    }
}

function clean_up()
{
    var $status_line_links = $('a[href^="/mturk/statusdetail"]');
    for (var i = $status_line_links.length-1; i >= 7; i--)
    { // remove all status lines that didn't fall in the last 7 days
        $status_line_links.eq(i).parent().parent().remove();
    }
    
    $('th[id="user_activities.date_column_header.tooltip"][class="metrics-table-first-header"]').parent().nextAll('tr').each(function(index)
    {
        $(this).attr('class', ((index % 2 == 0) ? 'even' : 'odd'));
    });
}

function append_weekly_total()
{
    $('tr[id="mtb_total_line"]').remove();

    var week_start = new Date(amazon_time_ms);
    week_start.setUTCDate(week_start.getUTCDate() - ((7 - Number(localStorage.getItem('mmmturkeybacon_seven_days_dashboard_start_of_week')) + week_start.getUTCDay()) % 7));

    var week_start_date_zero_formatted =  week_start.getUTCFullYear() + ('0' + (week_start.getUTCMonth()+1)).slice(-2) + ('0' + week_start.getUTCDate()).slice(-2);
    var week_start_date_short = months_short[week_start.getUTCMonth()] + ' ' + week_start.getUTCDate() + ', ' + week_start.getUTCFullYear();

    var submitted_total = 0;
    var approved_total = 0;
    var rejected_total = 0;
    var pending_total = 0;
    var earnings_total = 0;
    var $this_week = $src.find('a[href^="/mturk/statusdetail"]').filter(function()
    {
        var mmddyyyy = $(this).attr('href').substring(32);
        var yyyymmdd = mmddyyyy.substring(4) + mmddyyyy.substring(0,4);
        return (yyyymmdd >= week_start_date_zero_formatted);
    });
    $this_week.each(function()
    {
        submitted_total += parseInt($(this).parent().parent().find('td:eq(1)').text(), 10);
        approved_total  += parseInt($(this).parent().parent().find('td:eq(2)').text(), 10);
        rejected_total  += parseInt($(this).parent().parent().find('td:eq(3)').text(), 10);
        pending_total   += parseInt($(this).parent().parent().find('td:eq(4)').text(), 10);
        earnings_total  += parseInt($(this).parent().parent().find('span[class="reward"]').text().replace(/[^0-9]/g,''), 10);
    });


    $('a[href^="/mturk/statusdetail"]').last().parent().parent().after('<tr id="mtb_total_line" class="grayHead"><td style="font: bold 12px arial, sans-serif; color: #369; width: 60%; text-align: left; padding-left: 5px; vertical-align: middle">Totals For The Week Beginning '+week_start_date_short+' <select id="mtb_day_select"><option value="0">Sunday</option><option value="1">Monday</option><option value="2">Tuesday</option><option value="3">Wednesday</option><option value="4">Thursday</option><option value="5">Friday</option><option value="6">Saturday</option></select></td><td valign="center" style="font: bold 12px arial, sans-serif; color: #369; vertical-align: middle"><span style="font-size: 0px;">&nbsp;submitted:&nbsp;</span>'+submitted_total+'</td><td style="font: bold 12px arial, sans-serif; color: #369; vertical-align: middle"><span style="font-size: 0px;">&nbsp;approved:&nbsp;</span>'+approved_total+'</td><td style="font: bold 12px arial, sans-serif; color: #369; vertical-align: middle"><span style="font-size: 0px;">&nbsp;rejected:&nbsp;</span>'+rejected_total+'</td><td style="font: bold 12px arial, sans-serif; color: #369; vertical-align: middle"><span style="font-size: 0px;">&nbsp;pending:&nbsp;</span>'+pending_total+'</td><td style="font: bold 12px arial, sans-serif; color: #369; vertical-align: middle"><span class="reward"><img src="#" height="0" width="0" alt="earnings: ">'+'$' + (earnings_total/100).toFixed(2)+'</span></td></tr>');

    $('select[id="mtb_day_select"]').prop('selectedIndex', Number(localStorage.getItem('mmmturkeybacon_seven_days_dashboard_start_of_week')));
    $('select[id="mtb_day_select"]')[0].onchange = function(){localStorage.setItem('mmmturkeybacon_seven_days_dashboard_start_of_week', this.selectedIndex); append_weekly_total();};
}


$(document).ready(function()
{
    $.get('/mturk/status', function(data)
    {
        $src = $(data);
        var maxpagerate = $src.find("td[class='error_title']:contains('You have exceeded the maximum allowed page request rate for this website.')");
        if (maxpagerate.length == 0)
        {
            append_extra_days();
            insert_missing_days();
            clean_up();
            append_weekly_total();
        }
    });
});


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
   setCookie('mmmturkeybacon_seven_days_dashboard_amazon_timezone_offset', 0, 1);
   return true;
}