// ==UserScript==
// @name        mmmturkeybacon Embiggen Radio Buttons and Checkboxes
// @version     1.22
// @description Adds a colored label around radio buttons and checkboxes that increases the area that registers a click. If the button/box is clicked the label turns green. This script lets you more effectively click while requiring less precision and makes it easier to see which items are selected. I can't guarantee this script won't foul up a page's layout. If it does disable it. mmmturkeybacon Unclick Radio Button is a helpful companion to this script.
// @author      mmmturkeybacon
// @namespace   http://userscripts.org/users/523367
// @match       http://*/*
// @match       https://*/*
// //@match       https://*.mturk.com/mturk/preview*
// //@match       https://*.mturk.com/mturk/accept*
// //@match       https://*.mturk.com/mturk/continue*
// //@match       https://*.mturk.com/mturk/submit*
// //@match       https://*.mturk.com/mturk/return*
// //@match       https://*.mturkcontent.com/dynamic/hit?*
// //@match       https://*.amazonaws.com/mturk_bulk/hits*
// //@match       https://*.crowdcomputingsystems.com/mturk-web/*
// //@match       https://*.qualtrics.com/*
// //@match       https://*.surveygizmo.com/*
// //@match       https://*.surveymonkey.com/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/8715/mmmturkeybacon%20Embiggen%20Radio%20Buttons%20and%20Checkboxes.user.js
// @updateURL https://update.greasyfork.org/scripts/8715/mmmturkeybacon%20Embiggen%20Radio%20Buttons%20and%20Checkboxes.meta.js
// ==/UserScript==

/*
Examples:
http://i.imgur.com/6AK6fqq.png
http://i.imgur.com/ZmKaA1o.png

For testing and debugging:
https://www.surveymonkey.com/s/ProfessionalProcesses
https://www.surveygizmo.com/s3/2046887/73e44deab261
https://msuccas.co1.qualtrics.com/SE/?SID=SV_0ilMmQXcdpZQ04d
https://princetonsurvey.az1.qualtrics.com/SE/?SID=SV_8jDoy6P7ibFZN0p
https://www.mturkcontent.com/dynamic/hit?assignmentId=ASSIGNMENT_ID_NOT_AVAILABLE&hitId=3DIIW4IV8PEUCG2TZJS01EOATJII4F
https://www.mturkcontent.com/dynamic/hit?assignmentId=3TVSS0C0E27JP3NPE9RZ73RPA20TWR&hitId=3BS6ERDL93DBRFESBZ9FFLF63626DW&workerId=ASSIGNMENT_ID_NOT_AVAILABLE&turkSubmitTo=https%3A%2F%2Fwww.mturk.com
https://s3.amazonaws.com/mturk_bulk/hits/138816851/qUqSeewj13pzxUGTsERnXg.html?assignmentId=ASSIGNMENT_ID_NOT_AVAILABLE&hitId=39KMGHJ4RY9B0N33T566YLUDOYX006
https://s3.amazonaws.com/mturk_bulk/hits/138909729/mndG5I_WE1o9e66s6lB8ZA.html?assignmentId=ASSIGNMENT_ID_NOT_AVAILABLE&hitId=3DGDV62G7OEP3AI3W6SRGMH1P9TP2S
http://fordhambusiness.az1.qualtrics.com/jfe/form/SV_5sv1TzUahXAxhch?MID=
https://hbs.qualtrics.com/jfe/form/SV_cwjMpy2RQqAJbFz

https://yalesurvey.qualtrics.com/SE/?SID=SV_2l4AAdCJIsONZMp

*/

var SIZE = 54; // pixels

var TOP_SPACING = (1/2)*SIZE + 1;
var RIGHT_SPACING = (2/10)*SIZE;
var BOTTOM_SPACING = (1/2)*SIZE + 1;
var LEFT_SPACING = (4/10)*SIZE;

var UNCHECKED_COLOR = '#00f';
var CHECKED_COLOR = '#0f0';
var DISABLED_COLOR = '#999';
var OPACITY = 0.25;

var radio_button_index = 0;
var checkbox_index = 0;
var radio_button_queue_count = 0;
var checkbox_queue_count = 0;
var already_ran = false;

function addstyle()
{
    if (already_ran == false)
    {
        already_ran = true;
        GM_addStyle('                                                                                        \
            @font-face {                                                                                     \
                font-family: "icomoon";                                                                      \
                src: url(data:application/x-font-ttf;charset=utf-8;base64,AAEAAAALAIAAAwAwT1MvMg8SB4AAAAC8AAAAYGNtYXDqkerWAAABHAAAAFRnYXNwAAAAEAAAAXAAAAAIZ2x5ZtKphoMAAAF4AAABvGhlYWQFnF7hAAADNAAAADZoaGVhB8IDyQAAA2wAAAAkaG10eBIAAAAAAAOQAAAAIGxvY2EBdgEAAAADsAAAABJtYXhwAAsALAAAA8QAAAAgbmFtZVcZpu4AAAPkAAABRXBvc3QAAwAAAAAFLAAAACAAAwQAAZAABQAAApkCzAAAAI8CmQLMAAAB6wAzAQkAAAAAAAAAAAAAAAAAAAABEAAAAAAAAAAAAAAAAAAAAABAAADqVgPA/8AAQAPAAEAAAAABAAAAAAAAAAAAAAAgAAAAAAACAAAAAwAAABQAAwABAAAAFAAEAEAAAAAMAAgAAgAEAAEAIOpT6lb//f//AAAAAAAg6lLqVf/9//8AAf/jFbIVsQADAAEAAAAAAAAAAAAAAAAAAQAB//8ADwABAAAAAAAAAAAAAgAANzkBAAAAAAEAAAAAAAAAAAACAAA3OQEAAAAAAQAAAAAAAAAAAAIAADc5AQAAAAACAAD/wAQAA8AAEAAXAAABISIGFREUFjMhMjY1ETQmIwEnNxcBFwEDgP0ANUtLNQMANUtLNf5A7VqTATNa/nMDwEs1/QA1S0s1AwA1S/zl7lqSATJa/nIAAgAA/8AEAAPAABAAFQAAASEiBhURFBYzITI2NRE0JiMRIREhEQOA/QA1S0s1AwA1S0s1/QADAAPASzX9ADVLSzUDADVL/IADAP0AAAIAAP/ABAADwAAUACEAAAEiDgIVFB4CMzI+AjU0LgIjESImNTQ2MzIWFRQGIwIAaruLUFCLu2pqu4tQUIu7ajVLSzU1S0s1A8BQi7tqaruLUFCLu2pqu4tQ/YBLNTVLSzU1SwACAAD/wAQAA8AAFAApAAABIg4CFRQeAjMyPgI1NC4CIxEiLgI1ND4CMzIeAhUUDgIjAgBqu4tQUIu7amq7i1BQi7tqUItpPDxpi1BQi2k8PGmLUAPAUIu7amq7i1BQi7tqaruLUPyAPGmLUFCLaTw8aYtQUItpPAABAAAAAQAAtaMOVF8PPPUACwQAAAAAANE+jTIAAAAA0T6NMgAA/8AEAAPAAAAACAACAAAAAAAAAAEAAAPA/8AAAAQAAAAAAAQAAAEAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAgAAAAQAAAAEAAAABAAAAAQAAAAAAAAAAAoAFAAeAEoAcACiAN4AAAABAAAACAAqAAIAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAADgCuAAEAAAAAAAEADgAAAAEAAAAAAAIADgBHAAEAAAAAAAMADgAkAAEAAAAAAAQADgBVAAEAAAAAAAUAFgAOAAEAAAAAAAYABwAyAAEAAAAAAAoANABjAAMAAQQJAAEADgAAAAMAAQQJAAIADgBHAAMAAQQJAAMADgAkAAMAAQQJAAQADgBVAAMAAQQJAAUAFgAOAAMAAQQJAAYADgA5AAMAAQQJAAoANABjAGkAYwBvAG0AbwBvAG4AVgBlAHIAcwBpAG8AbgAgADEALgAwAGkAYwBvAG0AbwBvAG5pY29tb29uAGkAYwBvAG0AbwBvAG4AUgBlAGcAdQBsAGEAcgBpAGMAbwBtAG8AbwBuAEYAbwBuAHQAIABnAGUAbgBlAHIAYQB0AGUAZAAgAGIAeQAgAEkAYwBvAE0AbwBvAG4ALgAAAAADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA) format("truetype"),                                                                                          \
                     url(data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAAAWYAAsAAAAABUwAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABPUy8yAAABCAAAAGAAAABgDxIHgGNtYXAAAAFoAAAAVAAAAFTqkerWZ2FzcAAAAbwAAAAIAAAACAAAABBnbHlmAAABxAAAAbwAAAG80qmGg2hlYWQAAAOAAAAANgAAADYFnF7haGhlYQAAA7gAAAAkAAAAJAfCA8lobXR4AAAD3AAAACAAAAAgEgAAAGxvY2EAAAP8AAAAEgAAABIBdgEAbWF4cAAABBAAAAAgAAAAIAALACxuYW1lAAAEMAAAAUUAAAFFVxmm7nBvc3QAAAV4AAAAIAAAACAAAwAAAAMEAAGQAAUAAAKZAswAAACPApkCzAAAAesAMwEJAAAAAAAAAAAAAAAAAAAAARAAAAAAAAAAAAAAAAAAAAAAQAAA6lYDwP/AAEADwABAAAAAAQAAAAAAAAAAAAAAIAAAAAAAAgAAAAMAAAAUAAMAAQAAABQABABAAAAADAAIAAIABAABACDqU+pW//3//wAAAAAAIOpS6lX//f//AAH/4xWyFbEAAwABAAAAAAAAAAAAAAAAAAEAAf//AA8AAQAAAAAAAAAAAAIAADc5AQAAAAABAAAAAAAAAAAAAgAANzkBAAAAAAEAAAAAAAAAAAACAAA3OQEAAAAAAgAA/8AEAAPAABAAFwAAASEiBhURFBYzITI2NRE0JiMBJzcXARcBA4D9ADVLSzUDADVLSzX+QO1akwEzWv5zA8BLNf0ANUtLNQMANUv85e5akgEyWv5yAAIAAP/ABAADwAAQABUAAAEhIgYVERQWMyEyNjURNCYjESERIREDgP0ANUtLNQMANUtLNf0AAwADwEs1/QA1S0s1AwA1S/yAAwD9AAACAAD/wAQAA8AAFAAhAAABIg4CFRQeAjMyPgI1NC4CIxEiJjU0NjMyFhUUBiMCAGq7i1BQi7tqaruLUFCLu2o1S0s1NUtLNQPAUIu7amq7i1BQi7tqaruLUP2ASzU1S0s1NUsAAgAA/8AEAAPAABQAKQAAASIOAhUUHgIzMj4CNTQuAiMRIi4CNTQ+AjMyHgIVFA4CIwIAaruLUFCLu2pqu4tQUIu7alCLaTw8aYtQUItpPDxpi1ADwFCLu2pqu4tQUIu7amq7i1D8gDxpi1BQi2k8PGmLUFCLaTwAAQAAAAEAALWjDlRfDzz1AAsEAAAAAADRPo0yAAAAANE+jTIAAP/ABAADwAAAAAgAAgAAAAAAAAABAAADwP/AAAAEAAAAAAAEAAABAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAIAAAAEAAAABAAAAAQAAAAEAAAAAAAAAAAKABQAHgBKAHAAogDeAAAAAQAAAAgAKgACAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAA4ArgABAAAAAAABAA4AAAABAAAAAAACAA4ARwABAAAAAAADAA4AJAABAAAAAAAEAA4AVQABAAAAAAAFABYADgABAAAAAAAGAAcAMgABAAAAAAAKADQAYwADAAEECQABAA4AAAADAAEECQACAA4ARwADAAEECQADAA4AJAADAAEECQAEAA4AVQADAAEECQAFABYADgADAAEECQAGAA4AOQADAAEECQAKADQAYwBpAGMAbwBtAG8AbwBuAFYAZQByAHMAaQBvAG4AIAAxAC4AMABpAGMAbwBtAG8AbwBuaWNvbW9vbgBpAGMAbwBtAG8AbwBuAFIAZQBnAHUAbABhAHIAaQBjAG8AbQBvAG8AbgBGAG8AbgB0ACAAZwBlAG4AZQByAGEAdABlAGQAIABiAHkAIABJAGMAbwBNAG8AbwBuAC4AAAAAAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==) format("woff");                                                                                             \
                                                                                                            \
                font-weight: normal;                                                                        \
                font-style: normal;                                                                         \
            }                                                                                               \
            input[type=radio],                                                                              \
            input[type=checkbox] {                                                                          \
                display: visible;                                                                           \
            }                                                                                               \
            input[type=radio] + div,                                                    \
            input[type=checkbox] + div {                                                \
                /*float: left; !important;*/                                                                \
                display: inline-block !important;                                                           \
                width: 0px !important;                                                                      \
                height: 0px !important;                                                                     \
                z-index: 100 !important;                                                                    \
            }                                                                                               \
            input[type=radio] + div > div.mtb_embiggen_icon,                      \
            input[type=checkbox] + div > div.mtb_embiggen_icon {                  \
                margin: 0px !important;                                                                     \
                padding: 0px !important;                                                                    \
                z-index: 100 !important;                                                                    \
            }                                                                                               \
            input[type=radio] + div > div.mtb_embiggen_icon::before,              \
            input[type=checkbox] + div > div.mtb_embiggen_icon::before {          \
                font-family: "icomoon" !important;                                                          \
                speak: none !important;                                                                     \
                font-style: normal !important;                                                              \
                font-weight: normal !important;                                                             \
                font-variant: normal !important;                                                            \
                font-size: '+SIZE+'px !important;                                                           \
                text-transform: none !important;                                                            \
                line-height: 1 !important;                                                                  \
                opacity: '+OPACITY+' !important;                                                            \
                /* Better Font Rendering =========== */                                                     \
               -webkit-font-smoothing: antialiased !important;                                              \
               -moz-osx-font-smoothing: grayscale !important;                                               \
            }                                                                                               \
            input[type=radio]:disabled + div > div.mtb_embiggen_icon::before,     \
            input[type=checkbox]:disabled + div > div.mtb_embiggen_icon::before { \
                color: '+DISABLED_COLOR+';                                                                  \
            }                                                                                               \
            input[type=radio]:focus + div > div.mtb_embiggen_icon::before,        \
            input[type=checkbox]:focus + div > div.mtb_embiggen_icon::before {    \
                outline: 1px dotted !important;                                                             \
            }                                                                                               \
            input[type=radio] + div > div.mtb_embiggen_icon::before {             \
                content: "\\ea56" !important;                                                               \
                color: '+UNCHECKED_COLOR+';                                                                 \
            }                                                                                               \
            input[type=radio]:checked + div > div.mtb_embiggen_icon::before {     \
                content: "\\ea55" !important;                                                               \
                color: '+CHECKED_COLOR+';                                                                   \
            }                                                                                               \
            input[type=checkbox] + div > div.mtb_embiggen_icon::before {          \
                content: "\\ea53" !important;                                                               \
                color: '+UNCHECKED_COLOR+';                                                                 \
            }                                                                                               \
            input[type=checkbox]:checked + div > div.mtb_embiggen_icon::before {  \
                content: "\\ea52" !important;                                                               \
                color: '+CHECKED_COLOR+';                                                                   \
            }                                                                                               \
        ');
    }
}


function embiggen_radio_button(new_radio_button)
{
    addstyle();
    var $radio_button = $(new_radio_button);
    $radio_button.attr('mtb_embiggened', 'true');
    var offset = {};
    var center_offset = {};

    $radio_button.css('display', 'visible');
    $radio_button.css('opacity', '1.0');

    var container_height = $radio_button.outerHeight(true);
    var container_width = $radio_button.outerWidth(true);
    var TOP_MARGIN = Math.round(TOP_SPACING - container_height/2);
    var RIGHT_MARGIN = Math.round(RIGHT_SPACING - container_width/2);
    var BOTTOM_MARGIN = Math.round(BOTTOM_SPACING - container_height/2);
    var LEFT_MARGIN = Math.round(LEFT_SPACING - container_width/2);
    //var MARGIN = TOP_MARGIN+'px '+RIGHT_MARGIN+' px'+BOTTOM_MARGIN+' px'+LEFT_MARGIN+' px';

    $radio_button.wrap('<label>');
    $radio_button.parent().append('<div><div class="mtb_embiggen_icon"></div></div>');
    $radio_button.parent().wrap('<div style="display: inline-block; height: '+container_height+'px; width: '+container_width+'px; margin: '+TOP_MARGIN+'px '+RIGHT_MARGIN+'px '+BOTTOM_MARGIN+'px '+LEFT_MARGIN+'px ">');
    var $this_container = $radio_button.parent().parent();

    var $this_div = $this_container.find('input[type="radio"] + div');
    var $this_icon = $this_container.find('input[type="radio"] + div > div[class="mtb_embiggen_icon"]');

    var icon_abs_top = -SIZE/2+'px';
    var icon_abs_left = -SIZE/2+'px';

    $this_icon.css({"position": "absolute", "top": icon_abs_top, "left": icon_abs_left});

    if (document.domain.indexOf('surveymonkey') > -1)
    {
        var $next_label = $this_container.parent('.qOption').children('label');
        if ($next_label.length > 0)
        {
            $next_label.css('display', 'inline');
            $next_label.find('img').css('visibility', 'hidden');
        }
    }
    else if (document.domain.indexOf('surveygizmo') > -1)
    {
        $radio_button.css('position', 'static');            
    }
    else if (document.domain.indexOf('qualtrics') > -1)
    {
        $radio_button.css('float', 'none');
        $('span[class="LabelWrapper"]').css('float', 'none');           
    }

    offset = $radio_button.offset();
    center_offset.top = offset.top + $radio_button.height()/2;
    center_offset.left = offset.left + $radio_button.width()/2;
    $this_div.offset(center_offset);

    // Don't hide the radio buttons so that the Tab key can still be used to navigate to between them.
    //$radio_button.css('visibility', 'hidden');

    // Invisible and Tab key still works to navigate
    //$radio_button.css('opacity', '0');

    radio_button_queue_count--;
}

function embiggen_checkbox(new_checkbox)
{
    addstyle();
    var $checkbox = $(new_checkbox);
    $checkbox.attr('mtb_embiggened', 'true');
    var offset = {};
    var center_offset = {};

    $checkbox.css('display', 'visible');

    var container_height = $checkbox.outerHeight(true);
    var container_width = $checkbox.outerWidth(true);
    var TOP_MARGIN = Math.round(TOP_SPACING - container_height/2);
    var RIGHT_MARGIN = Math.round(RIGHT_SPACING - container_width/2);
    var BOTTOM_MARGIN = Math.round(BOTTOM_SPACING - container_height/2);
    var LEFT_MARGIN = Math.round(LEFT_SPACING - container_width/2);
    //var MARGIN = TOP_MARGIN+'px '+RIGHT_MARGIN+' px'+BOTTOM_MARGIN+' px'+LEFT_MARGIN+' px';

    $checkbox.wrap('<label>');
    $checkbox.parent().append('<div><div class="mtb_embiggen_icon"></div></div>');
    $checkbox.parent().wrap('<div style="display: inline-block; height: '+container_height+'px; width: '+container_width+'px; margin: '+TOP_MARGIN+'px '+RIGHT_MARGIN+'px '+BOTTOM_MARGIN+'px '+LEFT_MARGIN+'px ">');
    var $this_container = $checkbox.parent().parent();

    var $this_div = $this_container.find('input[type="checkbox"] + div');
    var $this_icon = $this_container.find('input[type="checkbox"] + div > div[class="mtb_embiggen_icon"]');

    var icon_abs_top = -SIZE/2+'px';
    var icon_abs_left = -SIZE/2+'px';

    $this_icon.css({"position": "absolute", "top": icon_abs_top, "left": icon_abs_left});

    if (document.domain.indexOf('surveymonkey') > -1)
    {
        var $next_label = $this_container.parent('.qOption').children('label');
        if ($next_label.length > 0)
        {
            $next_label.css('display', 'inline');
            $next_label.find('img').css('visibility', 'hidden');
        }
    }
    else if (document.domain.indexOf('surveygizmo') > -1)
    {
        $checkbox.css('position', 'static');            
    }
    else if (document.domain.indexOf('qualtrics') > -1)
    {
        $checkbox.css('float', 'none');
        $('span[class="LabelWrapper"]').css('float', 'none');           
    }

    offset = $checkbox.offset();
    center_offset.top = offset.top + $checkbox.height()/2;
    center_offset.left = offset.left + $checkbox.width()/2;
    $this_div.offset(center_offset);

    // Don't hide the checkboxes so that the Tab key can still be used to navigate to between them.
    //$checkbox.css('visibility', 'hidden');

    checkbox_queue_count--;
}

function queue_radio_button(new_radio_button)
{
    (function(new_radio_button, radio_button_queue_count){setTimeout(function(){embiggen_radio_button(new_radio_button)}, radio_button_queue_count*10) })(new_radio_button, radio_button_queue_count);
    radio_button_queue_count++;
}

function queue_checkbox(new_checkbox)
{
    (function(new_checkbox, checkbox_queue_count){setTimeout(function(){embiggen_checkbox(new_checkbox)}, checkbox_queue_count*10) })(new_checkbox, checkbox_queue_count);
    checkbox_queue_count++;
}

$(window).load(function()
//$(document).ready(function()
{
    var selector_prefix = ($('div[id="hit-wrapper"]').length > 0) ? 'div[id="hit-wrapper"] ' : '';
    if (selector_prefix || document.domain != 'www.mturk.com')
    { // if selector_prefix is non-empty then it is an internal HIT
        var radio_buttons = document.querySelectorAll(selector_prefix+'input[type="radio"]:not([mtb_embiggened="true"])');
        //Array.prototype.forEach.call(radio_buttons, queue_radio_button);
        Array.prototype.forEach.call(radio_buttons, embiggen_radio_button);

        var checkboxes = document.querySelectorAll(selector_prefix+'input[type="checkbox"]:not([mtb_embiggened="true"])');
        //Array.prototype.forEach.call(checkboxes, queue_checkbox);
        Array.prototype.forEach.call(checkboxes, embiggen_checkbox);

        //http://stackoverflow.com/questions/25711476/why-is-my-mutationobserver-callback-not-being-executed-for-some-new-tags
        var observer = new MutationObserver(function(mutations, obs)
        {
            for(var i=0; i<mutations.length; ++i)
            {
                for(var j=0; j<mutations[i].addedNodes.length; ++j)
                {
                    var newTag = mutations[i].addedNodes[j];
                    if (newTag.querySelectorAll)
                    {
                        //Array.prototype.forEach.call(
                        //newTag.querySelectorAll('input[type="radio"]:not([mtb_embiggened="true"])'), queue_radio_button);
                        //Array.prototype.forEach.call(
                        //newTag.querySelectorAll('input[type="checkbox"]:not([mtb_embiggened="true"])'), queue_checkbox);
                        Array.prototype.forEach.call(
                        newTag.querySelectorAll('input[type="radio"]:not([mtb_embiggened="true"])'), embiggen_radio_button);
                        Array.prototype.forEach.call(
                        newTag.querySelectorAll('input[type="checkbox"]:not([mtb_embiggened="true"])'), embiggen_checkbox);
                    }
                }
            }
        });

        observer.observe(document.documentElement,
        {
            childList: true,
            subtree: true
        });

        //setTimeout(function(){observer.disconnect()}, 10000);
    }

});