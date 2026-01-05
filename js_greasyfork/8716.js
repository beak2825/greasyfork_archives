// ==UserScript==
// @name        mmmturkeybacon Unclick Radio Button
// @author      mmmturkeybacon
// @description Allows you to unclick (i.e. clear, deselected, uncheck) a radio button by clicking on the radio button or the radio buttons label. This script is a helpful companion to mmmturkeybacon Embiggen Radio Buttons and Checkboxes.
// @namespace   http://userscripts.org/users/523367
// @match       http://*/*
// @match       https://*/*
// @exclude     https://*.surveymonkey.com/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @version     1.00
// @grant       GM_log
// @downloadURL https://update.greasyfork.org/scripts/8716/mmmturkeybacon%20Unclick%20Radio%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/8716/mmmturkeybacon%20Unclick%20Radio%20Button.meta.js
// ==/UserScript==

//NOTE: surveymonkey radio buttons already allow themselves to be unclicked (cleared).

$(window).load(function()
{
    var is_already_checked = null;
    /* When a label that surrounds a radio button is clicked, it triggers a radio button click,
     * which triggers another label click, so it needs to be debounced. */
    var is_in_bounce_interval = false;


    $(document).on('mousedown', 'input[type="radio"]', function(event)
    {
        is_already_checked = $(this).is(':checked')
    });

    $(document).on('click', 'input[type="radio"]', function(event)
    {
        is_in_bounce_interval = true;
        setTimeout(function(){is_in_bounce_interval = false;}, 0);
        if ($(this).is(':checked') && is_already_checked)
        {
            $(this).attr('checked', null);
        }
    });


    $(document).on('click', 'label', function(event)
    {
        var $this = $(this);
        var id = $this.attr('for');

        if (id)
        {
            var $radio = $('input[id="'+id+'"][type="radio"]');
        }
        else
        {
            var $radio = $this.find('input[type="radio"]');
        }

        is_already_checked = $radio.is(':checked');
        if (is_already_checked && !is_in_bounce_interval)
        {
            event.preventDefault();
            $radio.attr('checked', null);
        }
    });
});
