// ==UserScript==
// @name         hack_ABC
// @namespace    http://www.qianyurui.com
// @version      0.1
// @description  Automatically earn money in Simunomics mini game Always Be Closing
// @author       Qianyu_Ray_Rui
// @match        http://www.simunomics.com/Self-ABC-Play.php
// @grant        none
// @require http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/8085/hack_ABC.user.js
// @updateURL https://update.greasyfork.org/scripts/8085/hack_ABC.meta.js
// ==/UserScript==
// reference http://forums.simunomics.com/viewtopic.php?t=219

$( document ).ready(function() {
    var content = $("i:first").text();
    var str = content.slice(1,-1);
    if (str===""){
        $('input[name="StartBtn"]').click();
    } else {
        if (str === "I absolutely can't buy anything else."||
            str === "OK I have to go."||
            str === "It will be tough to even fit all that in the car."||
            str === "That's all I can afford." ||
            str === "I really can't spend any more." ||
            str === "Wow, that's a lot.  I should be going." ||
            str === "Well if I put that on the emergency card it will just fit."||
            str === "I need to go home and think it over."
           ){
            console.log (str);
            console.log ("c");
            $('input[name="CloseBtn"]').click();
        } else if (
            str === "I'm going to be broke after this."||
            str === "This is more than I've spent in a long time."||
            str === "I'm definitely over budget now."||
            str === "Guess I won't be able to eat out for a while."||
            str === "I hope I have enough to pay for all of that."||
            str === "Even on sale that's still pretty expensive."||
            str === "I'm going to go shop around.  Maybe I'll be back."
        ){
            console.log (str);
            console.log ("s");
            $('input[name="SmallBtn"]').click();
        } else if (
            str === "I can't wait to get that home."||
            str === "Great, thanks for your help."||
            str === "Looks good.  I'd liked to pay with my Visa."||
            str === "This is more than I planned on spending."||
            str === "I'll be paying this off for a while."||
            str === "Well, there goes this month's budget."||
            str === "There goes my paycheck."||
            str === "I'm satisfied.  Do you want to ring me up?"||
            str === "I shouldn't, but sometimes you just have to splurge."||
            str === "That's a little more than I wanted to spend, but I think it's worth the cost."||
            str === "That's about what I came for."||
            str === "Good thing I have a big credit limit."||
            str === "I'll have to tighten my belt a bit after this."||
            str === "I'll be very happy with that."
        ){
            console.log (str);
            console.log ("m");
            $('input[name="MediumBtn"]').click();
        } else {
            console.log (str);
            console.log ("l");
            $('input[name="LargeBtn"]').click();
        }
    }
});