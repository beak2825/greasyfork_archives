// ==UserScript==
// @name        mmmturkeybacon Butt-in Buttons
// @version     1.10
// @description Adds a PandA (previewandaccept: accepts a HIT from within in the group at random) link/button. Adds a Pick & Roll button that accepts the very HIT you are previewing (if still available) and then skips to a new HIT. Adds the automatically accept checkbox to HIT previews. Shows the Accept button and CAPTCHAs right away. Adds a RandA button that returns a HIT and loads the HIT's PandA URL. Makes the Return button red. Puts the buttons closer to the workspace. Removes the "Total Earned" field.
// @author      mmmturkeybacon
// @namespace   http://userscripts.org/users/523367
// @match       https://www.mturk.com/mturk/preview?*
// @match       https://*.mturk.com/mturk/previewandaccept?*
// @match       https://*.mturk.com/mturk/accept?*
// @match       https://*.mturk.com/mturk/continue?*
// @match       https://*.mturk.com/mturk/submit*
// @match       https://*.mturk.com/mturk/return?*
// //@run-at      document-start
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/9088/mmmturkeybacon%20Butt-in%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/9088/mmmturkeybacon%20Butt-in%20Buttons.meta.js
// ==/UserScript==

// following line borrowed from: https://greasyfork.org/en/scripts/5918-mturk-show-captcha-and-accept-button-asap/code
GM_addStyle("#javascriptDependentFunctionality { display: block !important; }");

$(document).ready(function()
{
    //var GENERIC_BUTTON_COLOR = '#ffd15f';
    //var GENERIC_BUTTON_COLOR = '#fbc134';
    var GENERIC_BUTTON_COLOR = '#a6cdde';
    var RANDA_BUTTON_COLOR = '#ff0000';

    var $isAccepted = $('input[type="hidden"][name="isAccepted"]');
    //if (window.location.href.indexOf('https://www.mturk.com/mturk/preview?') > -1)
    if ($isAccepted.val() == 'false') //preview
    {
        $('a[id="requester.tooltip"]:contains("Requester:")').closest('div[style="width: auto; margin-top: 5px; margin-left: 10px; margin-right: 10px; margin-bottom: 5px;"]').detach().insertAfter('div[id="subtabs_and_searchbar"]');
        $('b:contains("Total Earned")').closest('tr').remove();

        $('input[name="/accept"][src="/media/accept_hit.gif"][type="image"][border="0"]').each(function()
        {
            $(this).closest('td').before('<td rowspan="2" height="26" nowrap="" valign="middle" align="center"><a style="display: block;" name="autoAcceptCheckboxWrapper"><input type="checkbox" onclick="javascript:toggleAllCheckboxes(this);" value="on" name="autoAcceptEnabled" title="Automatically accept the next HIT"></input></a></td>');
        });

        var hitId = $('input[type="hidden"][name="hitId"]').attr('value');
        var prevHitSubmitted = $('input[type="hidden"][name="prevHitSubmitted"]').attr('value');
        var prevRequester = $('input[type="hidden"][name="prevRequester"]').attr('value');
        var requesterId = $('input[type="hidden"][name="requesterId"]').attr('value');
        var prevReward = $('input[type="hidden"][name="prevReward"]').attr('value');
        var hitAutoAppDelayInSeconds = $('input[type="hidden"][name="hitAutoAppDelayInSeconds"]').attr('value');
        var groupId = $('input[type="hidden"][name="groupId"]').attr('value');
        var signature = $('input[type="hidden"][name="signature"]').attr('value');
        var autoAcceptEnabled_param = $('input[value="on"][name="autoAcceptEnabled"][type="checkbox"]').is(':checked') ? '&autoAcceptEnabled=on' : '';

        var panda_URL = 'https://www.mturk.com/mturk/previewandaccept?groupId='+groupId;
        var pick_and_roll_URL = 'https://www.mturk.com/mturk/accept?hitId='+hitId+'&prevHitSubmitted='+prevHitSubmitted+'&prevRequester='+encodeURIComponent(prevRequester).replace(/%20/g,'+')+'&requesterId='+requesterId+'&prevReward='+prevReward+'&hitAutoAppDelayInSeconds='+hitAutoAppDelayInSeconds+'&groupId='+groupId+'&signature='+signature;
        var skip_URL = $('img[src="/media/skip_hit.gif"][height="22"][width="68"][border="0"]').parent().attr('href');

        //* top buttons*/
        var $buttons_table_top = $('td[valign="top"][width="200"][align="center"] > table[cellpadding="0"][cellspacing="0"][border="0"]');
        $buttons_table_top.parent().prev()[0].width = '30%';
        $buttons_table_top.parent()[0].width = '400';
        $buttons_table_top.parent().next()[0].width = '30%';
        var $first_row = $buttons_table_top.find('tr:eq(0)');
        $first_row.after('<tr><td nowrap="" align="center"></td><td nowrap="" align="center"></td><td nowrap="" align="center"></td><td nowrap="" align="center"></td><td nowrap="" align="center"></td></tr>');
        $first_row.remove();

        var $spacer_td = $buttons_table_top.find('tr:eq(1) > td:eq(2)');
        $spacer_td.after('<td rowspan="2" height="26" nowrap="" valign="top" align="center"><button id="mtbpar_pick_btn_top" title="Accept _this_ HIT and Skip to the next one. If this HIT is successfully acccepted it will be in your queue." style="height: 22px; color: #000000; background-color: '+GENERIC_BUTTON_COLOR+'; border-color: #000000; border-radius: 4px; moz-border-radius: 4px; webkit-border-radius: 4px;">Pick & Roll</button></td>');
        $spacer_td.after('<td rowspan="2" height="26" nowrap="" valign="top" align="center"><a id="mtbpar_panda_a_top" href="'+panda_URL+autoAcceptEnabled_param+'"><button id="mtbpar_panda_btn_top" title="A Preview and Accept link. Middle click works for this button." style="height: 22px; color: #000000; background-color: '+GENERIC_BUTTON_COLOR+'; border-color: #000000; border-radius: 4px; moz-border-radius: 4px; webkit-border-radius: 4px;">PandA</button></a></td>');
        $spacer_td.remove();

        //* bottom buttons*/
        var $buttons_table_bottom = $('div[align="center"] > table[cellpadding="0"][cellspacing="0"][border="0"]');
        var $first_row = $buttons_table_bottom.find('tr:eq(0)');
        $first_row.after('<tr><td nowrap="" align="center"></td><td nowrap="" align="center"></td><td nowrap="" align="center"></td><td nowrap="" align="center"></td></tr>');
        $first_row.remove();

        var $spacer_td = $buttons_table_bottom.find('tr:eq(1) > td:eq(2)');
        $spacer_td.after('<td rowspan="2" height="26" nowrap="" valign="top" align="center"><button id="mtbpar_pick_btn_bottom" title="Accept _this_ HIT and Skip to the next one. If this HIT is successfully acccepted it will be in your queue." style="height: 22px; color: #000000; background-color: '+GENERIC_BUTTON_COLOR+'; border-color: #000000; border-radius: 4px; moz-border-radius: 4px; webkit-border-radius: 4px;">Pick & Roll</button></td>');
        $spacer_td.after('<td rowspan="2" height="26" nowrap="" valign="top" align="center"><a id="mtbpar_panda_a_bottom" href="'+panda_URL+autoAcceptEnabled_param+'"><button id="mtbpar_panda_btn_bottom" title="A Preview and Accept link. Middle click works for this button." style="height: 22px; color: #000000; background-color: '+GENERIC_BUTTON_COLOR+'; border-color: #000000; border-radius: 4px; moz-border-radius: 4px; webkit-border-radius: 4px;">PandA</button></a></td>');
        $spacer_td.remove();

        //* listeners */
        $('input[value="on"][name="autoAcceptEnabled"][type="checkbox"]').bind( 'click', function(){autoAcceptEnabled_param = $(this).is(':checked') ? '&autoAcceptEnabled=on' : ''; $('a[id^="mtbpar_panda_a"]').attr('href', panda_URL+autoAcceptEnabled_param)} );
        // preventDefault prevents the form from being submitted as if the Accept button had been pressed.
        $('button[id^="mtbpar_pick_btn"]').bind('click', function(event)
        {
            event.preventDefault();
            $.get(pick_and_roll_URL, function(data)
            {
                var queue_full = $(data).find('span[id="alertboxHeader"]:contains("You have accepted the maximum number of HITs allowed.")').length > 0;
                if (!queue_full)
                {
                    window.location.href = skip_URL
                }
                else
                {
                    alert('You have accepted the maximum number of HITs allowed.');
                }
            })
        });
        $('button[id^="mtbpar_panda_btn"]').bind('click', function(event){ event.preventDefault(); window.location.href = panda_URL+autoAcceptEnabled_param; });
    }
    else if ($isAccepted.val() == 'true') //accepted
    {
        var RETURN_BUTTON_IMAGE = 'data:image/png;base64, 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';

        $('img[src="/media/return_hit.gif"]').attr('src', RETURN_BUTTON_IMAGE);

        $('a[id="requester.tooltip"]:contains("Requester:")').closest('div[style="width: auto; margin-top: 5px; margin-left: 10px; margin-right: 10px; margin-bottom: 5px;"]').detach().insertAfter('div[id="subtabs_and_searchbar"]');
        $('b:contains("Total Earned")').closest('tr').remove();

        //* top buttons*/
        var $buttons_table_top = $('td[valign="top"][width="200"][align="center"] > table[cellpadding="0"][cellspacing="0"][border="0"]');
        $buttons_table_top.parent().prev()[0].width = '30%';
        $buttons_table_top.parent()[0].width = '400';
        $buttons_table_top.parent().next()[0].width = '30%';
        $buttons_table_top.find('tr:eq(1) > td').attr('valign', 'top');

        //* bottom buttons*/
        var $buttons_table_bottom = $('div[align="center"] > table[cellpadding="0"][cellspacing="0"][border="0"]');
        $buttons_table_bottom.find('tr:eq(1) > td').attr('valign', 'top');

        var groupId = $('input[type="hidden"][name="groupId"]').attr('value');
        if (groupId)
        {
            var autoAcceptEnabled = $('input[value="on"][name="autoAcceptEnabled"][type="checkbox"]').is(':checked')
            var autoAcceptEnabled_prop = autoAcceptEnabled ? 'checked="checked"' : '';
            var autoAcceptEnabled_param = autoAcceptEnabled ? '&autoAcceptEnabled=on' : '';

            var panda_URL = 'https://www.mturk.com/mturk/previewandaccept?groupId='+groupId;
            var return_URL = $('a[href^="/mturk/return?"]').attr('href');

            $('input[type="checkbox"][onclick="javascript:toggleAllCheckboxes(this);"]').closest('tr').remove();
            $('[src^="/media/submit"][border="0"]').each(function()
            {
                $(this).closest('td').before('<td rowspan="2" height="26" nowrap="" valign="middle" align="center"><a style="display: block;" name="autoAcceptCheckboxWrapper"><input type="checkbox" onclick="javascript:toggleAllCheckboxes(this);" value="on" name="autoAcceptEnabled" title="Automatically accept the next HIT" '+autoAcceptEnabled_prop+'></input></a></td>');
            });

            //* top buttons*/
            var $first_row = $buttons_table_top.find('tr:eq(0)');
            $first_row.after('<tr><td nowrap="" align="center"></td><td nowrap="" align="center"></td><td nowrap="" align="center"></td><td nowrap="" align="center"></td></tr>');
            $first_row.remove();

            var $spacer_td = $buttons_table_top.find('tr:eq(1) > td:eq(2)');
            $spacer_td.after('<td rowspan="2" height="26" nowrap="" valign="top" align="center"><button id="mtbpar_randa_btn_top" title="Return this HIT and Accept another one." style="height: 22px; color: #000000; background-color: '+RANDA_BUTTON_COLOR+'; border-color: #000000; border-radius: 4px; moz-border-radius: 4px; webkit-border-radius: 4px;">RandA</button></td>');
            $spacer_td.remove();

            //* bottom buttons*/
            var $first_row = $buttons_table_bottom.find('tr:eq(0)');
            $first_row.after('<tr><td nowrap="" align="center"></td></td><td nowrap="" align="center"></td><td nowrap="" align="center"></td></tr>');
            $first_row.remove();

            var $spacer_td = $buttons_table_bottom.find('tr:eq(1) > td:eq(2)');
            $spacer_td.after('<td rowspan="2" height="26" nowrap="" valign="top" align="center"><button id="mtbpar_randa_btn_bottom" title="Return this HIT and Accept another one." style="height: 22px; color: #000000; background-color: '+RANDA_BUTTON_COLOR+'; border-color: #000000; border-radius: 4px; moz-border-radius: 4px; webkit-border-radius: 4px;">RandA</button></td>');
            $spacer_td.remove();

            //* listeners */
            $('input[value="on"][name="autoAcceptEnabled"][type="checkbox"]').bind( 'click', function(){autoAcceptEnabled_param = $(this).is(':checked') ? '&autoAcceptEnabled=on' : ''; $('a[id^="mtbpar_panda_a"]').attr('href', panda_URL+autoAcceptEnabled_param)} );
            // preventDefault prevents the form from being submitted as if the Accept button had been pressed.
            $('button[id^="mtbpar_randa_btn"]').bind('click', function(event){ event.preventDefault(); $.get(return_URL, function(data){window.location.href = panda_URL+autoAcceptEnabled_param}) });
        }
    }
    // else $isAccepted.val() is undefined so it is not a HIT
});