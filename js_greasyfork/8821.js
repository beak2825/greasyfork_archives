// ==UserScript==
// @name        mmmturkeybacon Color Coded Queue
// @version     2.56
// @description Adds Turkopticon ratings. Changes the title row of a HIT's description to match the average of it's Turkopticon ratings. Changes the color of the reward amount to match the color of the Turkopticon rating for pay. Adds colored checkboxes to show/hide colored highlighting. Changes the background color of the HIT title and link to white for Master's HITs. Changes the color of visited links to black. Changes requester's name into a link that searches for HITs by that requester.
// @author      mmmturkeybacon
// @namespace   http://userscripts.org/users/523367
// @match       https://www.mturk.com/mturk/myhits
// @match       https://www.mturk.com/mturk/sortmyhits?*
// @match       https://www.mturk.com/mturk/viewmyhits?*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @grant       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/8821/mmmturkeybacon%20Color%20Coded%20Queue.user.js
// @updateURL https://update.greasyfork.org/scripts/8821/mmmturkeybacon%20Color%20Coded%20Queue.meta.js
// ==/UserScript==

/**********************************************************************/
/* NB: turkopticon.ucsd.edu (TO website) uses yellow for a rating between 2 and 3,
 *     but TO extension uses orange
 *
 * Turkopticon scale
 * green : 3 < average <= 5
 * orange: 2 < average <= 3
 * red   : 1 < average <= 2
 *
 * Color Coded Search scale (so that green represents the very best HITs)
 * green : 4 < average <= 5
 * yellow: 3 < average <= 4  yellow are OK HITs, that's why the yellow has a touch of green
 * orange: 2 < average <= 3
 * red   : 1 < average <= 2
 */

var VISITED_LINK = '#000000'; // black

var LEVEL4_COLOR = {name: 'green', hexcolor: '#66CC66'}; //  (4,5]
//var LEVEL3_COLOR = {name: 'yellow', hexcolor: '#FFFF00'}; // (3,4]  yellow
//var LEVEL3_COLOR = {name: 'yellow', hexcolor: '#CDFF2F'}; // (3,4]  yellow with hint of green
var LEVEL3_COLOR = {name: 'yellow', hexcolor: '#ADFF2F'}; // (3,4]  green yellow
//var LEVEL3_COLOR = {name: 'yellow', hexcolor: '#9CE62A'}; // (3,4]  darker green yellow
var LEVEL2_COLOR = {name: 'orange', hexcolor: '#FF9900'}; // (2,3]
//var LEVEL1_COLOR = {name: 'red', hexcolor: '#FF0000'}; // (1,2]
var LEVEL1_COLOR = {name: 'red', hexcolor: '#DD3030'}; // (1,2]
var LEVEL0_COLOR = {name: 'blue', hexcolor: '#7FAAEB'}; // no rating
var MASTERS = {name: 'masters', hexcolor: '#FFFFFF'}; // white

var COMM_WEIGHT = 1;
var PAY_WEIGHT  = 3;
var FAIR_WEIGHT = 3;
var FAST_WEIGHT = 1;

var SHOW_ALL_DETAILS = false;

/**********************************************************************/

// URLs for testing, learning parameters
//http://mturk-api.istrack.in/multi-attrs.php?ids=ABSF8UXFZYEK6
//http://data.istrack.in/turkopticon.php?data=2.57,2.31,2.89,2.71

var TIMEOUT = 10000; // [ms] milliseconds, 0 means wait forever

var API_BASE = 'https://turkopticon.ucsd.edu/api/';
var API_MULTI_ATTRS_URL = API_BASE + 'multi-attrs.php?ids=';

var API_PROXY_BASE = 'https://mturk-api.istrack.in/';
var API_PROXY_MULTI_ATTRS_URL = API_PROXY_BASE + 'multi-attrs.php?ids=';

var REVIEWS_BASE = 'http://turkopticon.ucsd.edu/';
var HIT_GROUPS_BASE_LINK = '/mturk/searchbar?selectedSearchType=hitgroups&requesterId=';

var level4_color_checkbox;
var level3_color_checkbox;
var level2_color_checkbox;
var level1_color_checkbox;
var level0_color_checkbox;
var $parent_tables;

function process_TO_data(requester_data)
{
    var average = 0;
    var comm_rnd = 0;
    var pay_rnd = 0;
    var fair_rnd = 0;
    var fast_rnd = 0;
    var reviews = 0;
    var tos = 0;

    // after the API update, this if isn't necessary. leaving it in until
    // sure API is stable
    if (requester_data)
    {
        var comm = requester_data.attrs.comm;
        var pay = requester_data.attrs.pay;
        var fair = requester_data.attrs.fair;
        var fast = requester_data.attrs.fast;
        var sum = 0;
        var divisor = 0;

        if (comm > 0)
        {
            sum += COMM_WEIGHT*comm;
            divisor += COMM_WEIGHT;
        }
        if (pay > 0)
        {
            sum += PAY_WEIGHT*pay;
            divisor += PAY_WEIGHT;
        }
        if (fair > 0)
        {
            sum += FAIR_WEIGHT*fair;
            divisor += FAIR_WEIGHT;
        }
        if (fast > 0)
        {
            sum += FAST_WEIGHT*fast;
            divisor += FAST_WEIGHT;
        }
        if (divisor > 0)
        {
            average = sum/divisor;
        }

        comm_rnd = Math.round(comm*4)/4;
        pay_rnd = Math.round(pay*4)/4;
        fair_rnd = Math.round(fair*4)/4;
        fast_rnd = Math.round(fast*4)/4;
        
        if (requester_data.reviews)
        {
            reviews = requester_data.reviews;
        }
        if (requester_data.tos_flags)
        {
            tos = requester_data.tos_flags;
        }
    }

    comm_rnd = comm_rnd.toFixed(2);
    pay_rnd = pay_rnd.toFixed(2);
    fair_rnd = fair_rnd.toFixed(2);
    fast_rnd = fast_rnd.toFixed(2);

    return {comm_rnd:comm_rnd, pay_rnd:pay_rnd, fair_rnd:fair_rnd, fast_rnd:fast_rnd, reviews:reviews, tos:tos, average:average};
}

function determine_color(rating)
{
    // The lowest rating that can be given is a 1.
    // green  is (4,5]
    // yellow is (3,4]
    // orange is (2,3]
    // red    is (1,2]
    // blue   is 0 (no rating)
    // (0,1) is no man's land but I set the lower bound for red to 0 to agree with data.istrack.in

    var color = LEVEL0_COLOR;

    if (rating > 4)
    {
        color = LEVEL4_COLOR;
    }
    else if (rating > 3)
    {
        color = LEVEL3_COLOR;
    }
    else if (rating > 2 )
    {
        color = LEVEL2_COLOR;
    }
    else if (rating > 0)
    {
        color = LEVEL1_COLOR;
    }

    return color;
}

function show_hide_color(color)
{
    switch(color.name)
    {
        case LEVEL4_COLOR.name:
        {
            GM_setValue('level4_color_checkbox_checked', level4_color_checkbox.checked);
            if (level4_color_checkbox.checked == false)
            {
                $('.mtb_'+LEVEL4_COLOR.name).removeClass('mtb_color_coded_'+LEVEL4_COLOR.name);
            }
            else
            {
                $('.mtb_'+LEVEL4_COLOR.name).addClass('mtb_color_coded_'+LEVEL4_COLOR.name);
            }
            break;
        }
        case LEVEL3_COLOR.name:
        {
            GM_setValue('level3_color_checkbox_checked', level3_color_checkbox.checked);
            if (level3_color_checkbox.checked == false)
            {
                $('.mtb_'+LEVEL3_COLOR.name).removeClass('mtb_color_coded_'+LEVEL3_COLOR.name);
            }
            else
            {
                $('.mtb_'+LEVEL3_COLOR.name).addClass('mtb_color_coded_'+LEVEL3_COLOR.name);
            }
            break;
        }
        case LEVEL2_COLOR.name:
        {
            GM_setValue('level2_color_checkbox_checked', level2_color_checkbox.checked);
            if (level2_color_checkbox.checked == false)
            {
                $('.mtb_'+LEVEL2_COLOR.name).removeClass('mtb_color_coded_'+LEVEL2_COLOR.name);
            }
            else
            {
                $('.mtb_'+LEVEL2_COLOR.name).addClass('mtb_color_coded_'+LEVEL2_COLOR.name);
            }
            break;
        }
        case LEVEL1_COLOR.name:
        {
            GM_setValue('level1_color_checkbox_checked', level1_color_checkbox.checked);
            if (level1_color_checkbox.checked == false)
            {
                $('.mtb_'+color.name).removeClass('mtb_color_coded_'+LEVEL1_COLOR.name);
            }
            else
            {
                $('.mtb_'+color.name).addClass('mtb_color_coded_'+LEVEL1_COLOR.name);
            }
            break;
        }
        case LEVEL0_COLOR.name:
        {
            GM_setValue('level0_color_checkbox_checked', level0_color_checkbox.checked);
            if (level0_color_checkbox.checked == false)
            {
                $('.mtb_'+LEVEL0_COLOR.name).removeClass('mtb_color_coded_'+LEVEL0_COLOR.name);
            }
            else
            {
                $('.mtb_'+LEVEL0_COLOR.name).addClass('mtb_color_coded_'+LEVEL0_COLOR.name);
            }
            break;
        }
    }
}

function show_hide_all_colors()
{
    show_hide_color(LEVEL4_COLOR);
    show_hide_color(LEVEL3_COLOR);
    show_hide_color(LEVEL2_COLOR);
    show_hide_color(LEVEL1_COLOR);
    show_hide_color(LEVEL0_COLOR);
}


function create_colored_checkboxes()
{
    var checkbox_div = document.createElement('DIV');
    var level4_color_div = document.createElement('DIV');
    var level3_color_div = document.createElement('DIV');
    var level2_color_div = document.createElement('DIV');
    var level1_color_div = document.createElement('DIV');
    var level0_color_div = document.createElement('DIV');
    level4_color_div.style.cssText = 'display:inline-block; background-color: '+LEVEL4_COLOR.hexcolor+';'
    level3_color_div.style.cssText = 'display:inline-block; background-color: '+LEVEL3_COLOR.hexcolor+';'
    level2_color_div.style.cssText = 'display:inline-block; background-color: '+LEVEL2_COLOR.hexcolor+';'
    level1_color_div.style.cssText = 'display:inline-block; background-color: '+LEVEL1_COLOR.hexcolor+';'
    level0_color_div.style.cssText = 'display:inline-block; background-color: '+LEVEL0_COLOR.hexcolor+';'

    level4_color_checkbox = document.createElement('INPUT');
    level3_color_checkbox = document.createElement('INPUT');
    level2_color_checkbox = document.createElement('INPUT');
    level1_color_checkbox = document.createElement('INPUT');
    level0_color_checkbox = document.createElement('INPUT');
    
    level4_color_checkbox.type = 'checkbox';
    level3_color_checkbox.type = 'checkbox';
    level2_color_checkbox.type = 'checkbox';
    level1_color_checkbox.type = 'checkbox';
    level0_color_checkbox.type = 'checkbox';
    
    level4_color_checkbox.checked = GM_getValue('level4_color_checkbox_checked', true);
    level3_color_checkbox.checked = GM_getValue('level3_color_checkbox_checked', true);
    level2_color_checkbox.checked = GM_getValue('level2_color_checkbox_checked', true);
    level1_color_checkbox.checked = GM_getValue('level1_color_checkbox_checked', true);
    level0_color_checkbox.checked = GM_getValue('level0_color_checkbox_checked', true);
    
    level4_color_checkbox.name = 'level4_color_checkbox';
    level3_color_checkbox.name = 'level3_color_checkbox';
    level2_color_checkbox.name = 'level2_color_checkbox';
    level1_color_checkbox.name = 'level1_color_checkbox';
    level0_color_checkbox.name = 'level0_color_checkbox';
    
    level4_color_checkbox.title = 'Show/Hide '+LEVEL4_COLOR.name+' highlighting.';
    level3_color_checkbox.title = 'Show/Hide '+LEVEL3_COLOR.name+' highlighting.';
    level2_color_checkbox.title = 'Show/Hide '+LEVEL2_COLOR.name+' highlighting.';
    level1_color_checkbox.title = 'Show/Hide '+LEVEL1_COLOR.name+' highlighting.';
    level0_color_checkbox.title = 'Show/Hide '+LEVEL0_COLOR.name+' highlighting.';
    
    level4_color_checkbox.addEventListener('click', function(){show_hide_color(LEVEL4_COLOR);});
    level3_color_checkbox.addEventListener('click', function(){show_hide_color(LEVEL3_COLOR);});
    level2_color_checkbox.addEventListener('click', function(){show_hide_color(LEVEL2_COLOR);});
    level1_color_checkbox.addEventListener('click', function(){show_hide_color(LEVEL1_COLOR);});
    level0_color_checkbox.addEventListener('click', function(){show_hide_color(LEVEL0_COLOR);});

    level4_color_div.appendChild(level4_color_checkbox);
    level3_color_div.appendChild(level3_color_checkbox);
    level2_color_div.appendChild(level2_color_checkbox);
    level1_color_div.appendChild(level1_color_checkbox);
    level0_color_div.appendChild(level0_color_checkbox);
    
    checkbox_div.align = 'center';
    checkbox_div.appendChild(level4_color_div);
    checkbox_div.appendChild(level3_color_div);
    checkbox_div.appendChild(level2_color_div);
    checkbox_div.appendChild(level1_color_div);
    checkbox_div.appendChild(level0_color_div);
    
    return checkbox_div;
}

function turkopticon_error_handler($parent_tables, api_base, requester_IDs_csv)
{
    if (api_base == API_MULTI_ATTRS_URL)
    { // tried main api server and failed, now try mirror
        color_code($parent_tables, API_PROXY_MULTI_ATTRS_URL, requester_IDs_csv);
    }
    else
    {
        $parent_tables.each(function()
        {
            var $requester_ID_link = $(this).find('a[href^="/mturk/contact?subject="]').attr('href');
            var requester_ID = $requester_ID_link.split(/=|&/)[3];
            var title_row = $(this).find('tr').eq(1);

            var link_href = REVIEWS_BASE + requester_ID;
            var link_text = 'Turkopticon reviews';
            var link = '<a href="'+link_href+'" target="_blank">'+link_text+'</a>&nbsp;';
            title_row.after('<tr><td bgcolor="#336699" width="1" valign="middle" align="center"></td><td bgcolor="#CCDDE9" width="18" valign="middle" align="center"></td><td bgcolor="#CCDDE9" width="100%" valign="top" align="right">'+link+'</td><td bgcolor="#CCDDE9" width="8" valign="middle" align="center"></td><td bgcolor="#336699" width="1" valign="middle" align="center"></td></tr>');
        });
    }
}


function color_code($parent_tables, api_base, requester_IDs_csv)
{
    GM_xmlhttpRequest(
    {
        method: 'GET',
        url: api_base+requester_IDs_csv,
        timeout: TIMEOUT,
        onload: function (response)
        {
            try
            {
                var rdata = $.parseJSON(response.responseText);
            }
            catch(e)
            {
                turkopticon_error_handler($parent_tables, api_base, requester_IDs_csv)
            }

            var checkbox_div = create_colored_checkboxes();
            $('table[cellspacing="0"][cellpadding="0"][border="0"][style="margin:5px; clear:both;"]').eq(1).after(checkbox_div);

            $parent_tables.each(function()
            {
                var $requester_ID_link = $(this).find('a[href^="/mturk/contact?"]').attr('href');
                var requester_ID = $requester_ID_link.split(/=|&/)[1];
                var title_row = $(this).find('tr').eq(1);
                //var link_bgcolor = $(this).find('td[width="100%"][valign="middle"][height="20"][align="left"]').attr('bgcolor');

                var pdata = process_TO_data(rdata[requester_ID]);
                var title_color = determine_color(pdata.average);
                var qualified_for = !($(this).find('a[href^="/mturk/notqualified?"]').length > 0);

                $(this).find('td[valign="middle"][nowrap=""][align="left"]').addClass('mtb_'+title_color.name+' mtb_color_coded_'+title_color.name);
                $(this).find('td[valign="middle"][align="left"]').addClass('mtb_'+title_color.name+' mtb_color_coded_'+title_color.name);
                $(this).find('td[valign="middle"][nowrap=""][align="right"]').addClass('mtb_'+title_color.name+' mtb_color_coded_'+title_color.name);
                $(this).find('td[valign="middle"][nowrap=""][align="right"]').attr('width', '100%')

                var link_href = REVIEWS_BASE + requester_ID;
                var link_text = pdata.reviews + ((pdata.reviews != 1) ? ' reviews ' : ' review ');
                link_text = '['+link_text + '|pay: '+pdata.pay_rnd+'|fair: '+pdata.fair_rnd+'|comm: '+pdata.comm_rnd+'|fast: '+pdata.fast_rnd+'|tos: '+pdata.tos+']';
                var link = '<a href="'+link_href+'" target="_blank">'+link_text+'</a>&nbsp;';
                title_row.after('<tr><td bgcolor="#336699" width="1" valign="middle" align="center"></td><td bgcolor="#CCDDE9" width="18" valign="middle" align="center"></td><td bgcolor="#CCDDE9" width="100%" valign="top" align="right" class="mtb_'+title_color.name+' mtb_color_coded_'+title_color.hexcolor+'">'+link+'</td><td bgcolor="#CCDDE9" width="8" valign="middle" align="center"></td><td bgcolor="#336699" width="1" valign="middle" align="center"></td></tr>');

                var pay = 0;
                if (rdata[requester_ID])
                {
                    pay = rdata[requester_ID].attrs.pay;
                }
                var pay_color = determine_color(pay);
                $(this).find('span[class="reward"]').addClass('mtb_'+pay_color.name+' mtb_color_coded_'+pay_color.name);

                // highlight Masters HITs title and link
                var is_masters = $(this).find('a[id^="qualifications.tooltip"]').parent().next('td:contains("Masters")').length > 0;
                if (is_masters)
                {
                    $(this).find('td[valign="middle"][nowrap=""][align="left"]').addClass('mtb_'+MASTERS[0]+' mtb_color_coded_'+MASTERS.name);
                    $(this).find('a[href^="/mturk/continue?hitId="]').addClass('mtb_'+MASTERS.name+' mtb_color_coded_'+MASTERS.name);
                }
            });
            show_hide_all_colors();
        },
        ontimeout: function()
        {
            turkopticon_error_handler($parent_tables, api_base, requester_IDs_csv)
        },
        onerror: function()
        {
            turkopticon_error_handler($parent_tables, api_base, requester_IDs_csv)
        }
    });
}

//$(document).ready(function()
//{
    var is_HIT = $('input[type="hidden"][name="isAccepted"]').length > 0;
    if (is_HIT)
    {
        throw new Error('Not on a search page. Exit.');
    }

    GM_addStyle('a:visited  {color: '+VISITED_LINK+';}                                                \
                .mtb_color_coded_'+LEVEL4_COLOR.name+' {background-color: '+LEVEL4_COLOR.hexcolor+';} \
                .mtb_color_coded_'+LEVEL3_COLOR.name+' {background-color: '+LEVEL3_COLOR.hexcolor+';} \
                .mtb_color_coded_'+LEVEL2_COLOR.name+' {background-color: '+LEVEL2_COLOR.hexcolor+';} \
                .mtb_color_coded_'+LEVEL1_COLOR.name+' {background-color: '+LEVEL1_COLOR.hexcolor+';} \
                .mtb_color_coded_'+LEVEL0_COLOR.name+' {background-color: '+LEVEL0_COLOR.hexcolor+';} \
                .mtb_color_coded_'+MASTERS.name+'   {background-color: '+MASTERS.hexcolor+';}         \
    ');

    if (SHOW_ALL_DETAILS)
    {
        // click 'Show all details'
        $(window).load(function(){$('a[id="expandall"][class="footer_links"][href="#"]:contains("Show all details")').get(0).click();});
    }

    var requester_IDs = new Array();
    
    $parent_tables = $('table[width="100%"][cellspacing="0"][cellpadding="0"][border="0"][height="100%"]');

    $parent_tables.each(function()
    {
        var requester_ID_link = $(this).find('a[href^="/mturk/contact?"]').attr('href');
        var requester_ID = requester_ID_link.split(/=|&/)[1];
        requester_IDs.push(requester_ID);
        var $requester_name = $(this).find('span[class="requesterIdentity"]');
        $requester_name.html('<a href="/mturk/searchbar?selectedSearchType=hitgroups&amp;requesterId='+requester_ID+'">'+$requester_name.text()+'</a>')
        $requester_name.after('&nbsp;['+requester_ID+']');
    });

    // code snippet from http://stackoverflow.com/questions/5381621/jquery-function-to-get-all-unique-elements-from-an-array
    requester_IDs = requester_IDs.filter(function(itm,i,a)
    {
        return i==a.indexOf(itm);
    });
    // end snippet

    var requester_IDs_csv = '';
    for (var i = 0; i < requester_IDs.length-1; i++)
    {
        requester_IDs_csv += requester_IDs[i] + ','
    }
    requester_IDs_csv += requester_IDs[i];

    color_code($parent_tables, API_MULTI_ATTRS_URL, requester_IDs_csv);
//});