// ==UserScript==
// @name       Ikariam Auto Builder script
// @namespace  http://google.com/
// @version    3.2.0
// @description  Ikariam Auto Builder HACK lets you add your building to an upgrading queue (YES! NOW YOU CAN DO IT FOR FREE!).
// @unwrap
// @include      *://s*.ikariam.gameforge.com/*
// @match	*://s*.ikariam.gameforge.com/*
// @copyright  2017-2024, Daniels Šatcs, shatz.dan@gmail.com
// @grant unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/8254/Ikariam%20Auto%20Builder%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/8254/Ikariam%20Auto%20Builder%20script.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

iframe = document.createElement('iframe');
document.body.appendChild(iframe);
console = { error: iframe.contentWindow.console.log, log: function() {}};


var key_currentUpdateInterval = "current_update_interval";

var updateInterval = getValue(key_currentUpdateInterval, 600000);
var timerUpdateInterval = 1000; //In ms (1000 ms = 1s). This indicates how often will be the timer refreshed. RECOMMENDED: 1000

//TRANSLATIONS//
var addToQueueText = "Add to queue"; //This appears on the button
var queueEmptyText = "The building queue is empty in the selected city"; //This appears when the queue is empty

var VERBOSE = true; //Set to true to print (to console) information about what is going on.
var RELOAD_AFTER = false; //Reload the page after going through all cities.
var queuePrefix = "IAcity_"; //do NOT change this!
var separator = ";"; ////do NOT change this!

//Script entry point:
if(getValue("IA_lastUpdate") === undefined) setTimeout(start,5000);
else start();

function changeUpdateInterval(){
    updateInterval = Math.floor((Math.random() * (900000-600000+1)) + 600000); //Math.round((Math.random() * (Max-Min)) + Min);
    setValue(key_currentUpdateInterval, updateInterval);
    return updateInterval;
}

function callFunc(f,params){
    f.apply(this, params);
}

function UpdateContext(cityId, cityCount) {
    this.cityId = cityId;
    this.cityCount = cityCount;
}

window.doAfterLoading = doAfterLoading;

function doAfterLoading(f){
    if(!isLoading()){
        var params = Array.prototype.slice.call(arguments);
        params.shift();
        f.apply(this,params);
    }
    else setTimeout(callFunc, 100, doAfterLoading, arguments);
}

function clickCityInDropDown(id, callback){
    $("div#dropDown_js_citySelectContainer div.bg ul li")[id-1].click();
    if(callback !== undefined) callback();
}

function goToCity(id, callback){
    $("div#js_citySelectContainer span").click();
    setTimeout(clickCityInDropDown, 100, id, callback); //Must wait here a little, bacause city drop down doesn't open immediately
}

function getCityName(){
    return $("div#js_citySelectContainer span a").text();
}

function getQueue(){
    var raw = getValue(queuePrefix + getCityName());
    if(raw === undefined) return [];
    return raw.split(separator);
}

function canUpgrade() {
    return enoughResources()
       && !isUpgrading()
}

function inBuildingView() {
    return $("#buildingUpgrade").length > 0; // The building upgrade window is open
}

function enoughResources() {
    return inBuildingView() && $("div#buildingUpgrade ul.resources li.red").length === 0; // No resource is displayed as red (i.e. enough resources)
}


function addToQueue(id) {
    if (canUpgrade())
    {
        $("ul.actions li.upgrade a").click();
    }
    else {
        var before = getValue(queuePrefix + getCityName());
        if(before === undefined){
            setValue(queuePrefix + getCityName(), id);
        }
        else setValue(queuePrefix + getCityName(), before + separator + id);
        updateQueueView();
    }
}

function removeFromQueue(number){
    console.error("Removing building " + number + " from update queue of city " + getCityName());
    var before = getValue(queuePrefix + getCityName());
    if(before !== undefined){
        var after = "";
        var items = before.split(separator);
        for(var i = 0; i < items.length; i++){
            if(i != number) after = after + items[i] + separator;
        }

        after = after.substring(0,after.length-1);

        if(after === ""){
            deleteValue(queuePrefix + getCityName());
        }
        else {
            setValue(queuePrefix + getCityName(), after);
        }
    }
    updateQueueView();
}

function upgradeBuilding(updateContext){
    if($("div#buildingUpgrade ul.resources li.red").length === 0){ //If the city has enough resources for an upgrade
        $("ul.actions li.upgrade a").click(); //Clicks upgrade button
        doAfterLoading(closeWindow, updateContext);
        removeFromQueue(0);
        if (VERBOSE) console.error("Upgrading and removing from queue!")
    }
    else {
        if (VERBOSE) console.error("Not enough resources, skipping");
        setTimeout(closeWindow, 100, updateContext);
    }
}

function closeWindow(updateContext){
    $("div.close").click();
    if(updateContext.cityId + 1 <= updateContext.cityCount) {
        updateContext.cityId += 1;
        setTimeout(processCity, getCitySkipDelay(), updateContext);
    }
    else if(RELOAD_AFTER) location.reload();
}

function getCitySkipDelay(){
    return Math.floor(Math.random() * (1000 - 500 + 1)) + 500; //Math.floor(Math.random() * (max - min + 1)) + min; Time to pause before going to the next city. Just for aesthetic purposes.
}

function isLoading(){
    return $("div#loadingPreview").css("display") != "none";
}
function isUpgrading(){
  return $("div.buildingUpgradeIcon:visible").length > 0;
}

function countdownPopupClose() {
    var el = $("#closePopupButton");
    timeLeft = el.text().substring(6);
    timeLeft -= 1;
    el.text("Close " + timeLeft);
    if (timeLeft <= 0) {
        hideUpgradePopup();
    }
    else setTimeout(countdownPopupClose, 1000);

}

function doWorkInCity(updateContext){
    var info = "<li style='list-style: unset;'>" + getCityName() + ": ";

    if (VERBOSE) console.error("   ==========   CITY = " + (updateContext.cityId + "   ==========   "));
    var q = getQueue();
    var upgrading = isUpgrading();
    if(q.length === 0 || upgrading) { //Can't upgrade anything in this city. Go to the next city in that case.
        if(VERBOSE) {
            causes = []; if (q.length === 0) causes.push("queue is empty"); if (upgrading) causes.push("something is upgrading");
            info += "Nothing to do because " + causes.join(", ") + "</li>";
            console.error("Skipping city " + updateContext.cityId + ": " + causes.join(", "));
        }
        if(updateContext.cityId + 1 <= updateContext.cityCount) {
            updateContext.cityId += 1;
            setTimeout(processCity, getCitySkipDelay(), updateContext); // Go to next city
        }
        else {
            if (RELOAD_AFTER) location.reload();
            else {
              $("#IAB-upgrade-popup").append("<b>Done! See you next time (check countdown above the advisors)</b>");
              $("#IAB-upgrade-popup").append('<a class="button" id="closePopupButton" onclick="hideUpgradePopup()">Close 15</a>');
              setTimeout(countdownPopupClose, 1000);
            }
        }// Optionally reload the page after all cities are visited (can help prevent Chrome from eathing up all RAM).
    }
    else {
        if (VERBOSE) console.error("Trying to upgrade... (since queue not empty and nothing upgrading a.t.m.");
        var enoughResources = $("#js_CityPosition" + q[0] + "ScrollName").css("color") != "rgb(170, 3, 3)"
        info += "Next in queue: " + getBuildingTitle(q[0]) + (enoughResources ? " <span style='color: green;'>Upgrading!</span>" : " <span style='color: red;'>Not enough resources, not removing from queue</span>");
        openBuilding(q[0]);
        doAfterLoading(upgradeBuilding, updateContext);
    }
    $("#upgradeProgressList").append(info);
}

function anyWindowOpen(){
    return $("div.accordionContent").length !== 0;
}

function processCity(updateContext){
    if(anyWindowOpen()){
        $("div.close").click();
        setTimeout(processCity, 100, updateContext);
        return;
    }

    goToCity(updateContext.cityId, function(){
        doAfterLoading(doWorkInCity, updateContext);
    });
}

function getBuildingTitle(id){
    return $("a#js_CityPosition" + id + "Link").attr('title');
}

function updateQueueView() {
    $("div#IA_queue").text("");
    var queue = getQueue();
    if(queue.length !== 0){
        for(var i = 0; i < queue.length; i++){
            $("div#IA_queue").append('<p align="center" style="cursor:default; padding: 8px;">' + getBuildingTitle(queue[i]) + '<a onclick="removeFromQueue('+i+')" style="cursor:pointer;">&#10006;</a></p>');
        }
    }
    else $("div#IA_queue").append('<p align="center">' + queueEmptyText + '</p>');
}

function update(){
    if($("div.close").length > 0) $("div.close").click(); //Close opened windows
    setValue("IA_lastUpdate", Date.now());
    changeUpdateInterval();

    var dialogCss = `position: fixed;
width: 500px;
height: 200px;
top: 50%;
left: 50%;
margin-top: -100px; /* Negative half of height. */
margin-left: -250px; /* Negative half of width. */
background-color: rgb(250, 243, 215);
z-index: 100;
padding: 20px;
overflow: scroll;`;

    $("body").append(`
<div id="IAB-upgrade-popup" style="${dialogCss}">
 <h2 style="font-size: 120%; font-weight: 700;"> Trying to upgrade buildings from the queue ... </h2>
 <ol id="upgradeProgressList">

 </ol>
</div>
`);

    var cityCount = getCityCount();
    processCity(new UpdateContext(1, cityCount));
}

function hideUpgradePopup() {
  $("#IAB-upgrade-popup").remove();
}



function openBuilding(id){
    $("a#js_CityPosition" + id + "Link").click();
}

function getCityCount(){
    return $("li.ownCity").length;
}

function setValue(key,value) {
    localStorage[key]=value;
}

function getValue(key,def) {
    return localStorage[key] || def;
}

function deleteValue(key) {
    return delete localStorage[key];
}

function timerUpdateFunc(){
    var time = parseInt(getValue("IA_lastUpdate")) + parseInt(updateInterval) - parseInt(Date.now());
    time = Math.floor(time / 1000); //seconds
    var minutes = Math.floor(time / 60);
    time -= minutes * 60;
    if (time < 10) time = "0" + time; //replace 2:9 with 2:09
    $("li#IA_timer").text(minutes + ":" + time);
    if(minutes < 0){
        update();
    }
}

function addButton(buildingId) {
    var canUpgradeImmediately = canUpgrade();
    console.error("Can upgrade " + canUpgradeImmediately);
    var buttonText = addToQueueText;
    if(anyWindowOpen() && inBuildingView() && $("div#IAButtonContainer").length === 0) {
        if($("ul.actions li.upgrade a").length > 0) {
            if (!canUpgradeImmediately) $("div#buildingUpgrade").append('<div style="margin: 20px;" id="IAButtonContainer"><a class="button" id="IAButton" onclick="addToQueue('+ buildingId + ');">' + buttonText + '</a></div>');
            if (!canUpgradeImmediately && !enoughResources()) $("div#buildingUpgrade").append('<div style="margin: 20px;"><i>Upgrade will stay in the queue until you collect necessary resources or you remove it from the queue.</i></div>');
        }
    }
    else setTimeout(addButton, 100, buildingId);
}

function addAdvisor() {
    $("div#advisors ul").prepend('<li class="advisor_bubble">' +
                    '<a id="js_GlobalMenu_builder" href="javascript:advisorWindow()" title="Overview of towns and finances" class="normalactive">' +
                        '<span class="smallFont">Auto builder</span>' +
                    '</a>' +
                    '<a id="js_GlobalMenu_builderPremium" class="plus_button plusteaser" title="View building queues"></a>' +
                '</li>');

    var container = $("div#advisors");
    container.width(container.width() / 4 * 5);
}

function advisorWindow() {
    var html = '<div id="architect_c" class="templateView focusable focus" style="left: 725px; top: -56px; right: auto; z-index: 98;">' +
        '<div id="architect" class="mainContentBox contentBox01h toggleMenu"><div class="hd header mainHeader draggable"><h3 id="js_mainBoxHeaderTitle">Auto Builder`s Office</h3><div id="js_backlinkButton" class="back" title="Hideout"></div><div class="close"></div></div><div class="bd mainContentScroll" style="height: 350px;"><div class="scroll_area scroll_disabled"><div class="scroll_arrow_top"></div><div class="scroller" style="width: 5px; top: 0px; left: 0px;"></div><div class="scroll_arrow_bottom"></div></div><div class="mainContent minimizableContent" style="top: 0px;"><div class="center" style="height: 60px; padding-bottom: 8px;"><a onclick="ajaxHandlerCall(\'?view=premium\');return false;"><img class="clickable" src="//gf1.geo.gfsrv.net/cdn0f/d3040171fefe8f8a0bbc75f6c8b344.jpg"></a></div>' +
'        <div id="reductionBuilding">' +
'            <div class="buildingDescription">' +
'                <h1>Auto Builder\`s Office</h1>' +
'                                    <p></p>' +
'                            </div>' +
'                            <div class="contentBox01h">' +
'                <div class="buildingPictureImg"><img src="//gf1.geo.gfsrv.net/cdn6b/898c4f2181909413623c079be63094.png"></div>' +
'                <h3 class="header">Building queues in your cities</h3>' +
'                <div class="content">' +
'                </div>' +
'                <div class="footer"></div>' +
'                </div>        </div>' +
'    </div></div><div class="ft footer"></div></div></div>';
    $("div#container").append(html);
}


function start(){
    if($("#btn-login").length > 0) return;
    //addAdvisor();

    try{
        getCityCount();
    }
    catch(e){
        alert("Sorry, Ikariam Auto Builder Hack won't work in this browser. Please use Chrome or Opera!");
    }

    if(getValue("IA_lastUpdate") === undefined) {

        alert("Welcome to Ikariam Auto Builder Hack!\nAfter you click OK, the hack will go through all your cities. It is required for the script to work!\n\nHelp on script usage can be found here:\nhttp://goo.gl/myneJb");
        update();
    }

    $("a[id^='js_CityPosition']").click(function(){
        var htmlID = $(this).attr('id');
        var id = htmlID.split("Link")[0].substring(15,htmlID.length + 1 - 4);
        doAfterLoading(addButton, id);
    });

    //Add CSS styling for add to queue button
    $("head").append("<style>div.addToQueueCityButton {z-index: 9000; cursor: pointer; position: absolute;right: 0px;bottom: 0px;border-top-left-radius: 3px;border-top-right-radius: 3px;border-bottom-left-radius: 3px;border-bottom-right-radius: 3px; background-color: rgba(200,200,200, 1); -webkit-transition: background-color 300ms linear;-moz-transition: background-color 300ms linear;-o-transition: background-color 300ms linear;-ms-transition: background-color 300ms linear;transition: background-color 300ms linear;} div.addToQueueCityButton:hover { background-color: rgba(200,100,100,1);}</style>");

    //Append queue table
    $("div.city_water_bottom").append('<div id="IA_queue" style="background-color: #DDD; width: 300px; position: absolute; left: 810px; border-radius: 4px; border: 1px solid #555"></div>');

    //Append timer
    $("DIV#GF_toolbar ul").append('<li id="IA_timer"></li> <img id="doCheckButton" alt="Check upgrades now" src="http://res.cloudinary.com/dshatz/image/upload/v1505664588/refresh_etrdy3.png" style="height: 1em; cursor:pointer;">');
    $("DIV#GF_toolbar ul").append('<li id="IA_script_feedback"><a target="_blank" href="https://greasyfork.org/en/scripts/8254-ikariam-auto-builder-hack">Auto-Builder</a></li>');

    $("#doCheckButton").click(update);

    updateQueueView();

    setInterval(updateQueueView,1000);

    timerUpdateFunc();

    setInterval(timerUpdateFunc, timerUpdateInterval);
}
