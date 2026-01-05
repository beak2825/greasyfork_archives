// ==UserScript==
// @name         City Find Hax
// @namespace    City Find Hax
// @version      0.2
// @description  amazing script
// @author       AquaRegia
// @match        http://www.torn.com/city.php*
// @match        https://www.torn.com/city.php*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/8540/City%20Find%20Hax.user.js
// @updateURL https://update.greasyfork.org/scripts/8540/City%20Find%20Hax.meta.js
// ==/UserScript==

$(unsafeWindow).load(function()
{
    data = JSON.parse(atob(unsafeWindow[Object.keys(unsafeWindow).filter(function(e)
    {
        return e.substr(0, 1) === "h" ? true : false;
    }).pop()]));
    
    $("h4").after
    (
        $("<div></div>").html
        (
            "Number of items currently in the city: " + data.length + 
            "<br/>" + 
            "Latest item spawned: " + (data.length > 0 ? data[data.length-1].title : "Nothing, not even a shitty kitten plushie :(") +
            (data.length > 1 ? (
            "<br/>" + 
            "Spawn rate (all time): " + function(a, b)
            {
                return ((a - b)/(data.length - 1)/3600).toFixed(1) + " hours per spawn";
                
            }(parseInt(data[data.length-1].tc, 36), parseInt(data[0].tc, 36)) + 
            "<br/>" + 
            "Spawn rate (last " + Math.min(5, data.length) + "): " + function(a, b)
            {
                return ((a - b)/(Math.min(5, data.length) - 1)/3600).toFixed(1) + " hours per spawn";
            }(parseInt(data[data.length-1].tc, 36), parseInt(data[data.length-(Math.min(5, data.length))].tc, 36))) : "")
        ).css("clear", "left")
        .css("margin-bottom", "-20px")
    )
});