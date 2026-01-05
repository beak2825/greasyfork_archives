// ==UserScript==
// @name         MBTA-trip-planner
// @namespace    http://www.ziffusion.com/
// @description  MBTA Trip Planner - support for favorites
// @author       Ziffusion
// @match        https://www.mbta.com/trip-planner*
// @grant        none
// @version      3.1
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/9166/MBTA-trip-planner.user.js
// @updateURL https://update.greasyfork.org/scripts/9166/MBTA-trip-planner.meta.js
// ==/UserScript==

var selects = [];

var labels = JSON.parse(localStorage.getItem("labels"));

if (!labels) labels = {"Michaels": "34 Cambridge St, Burlington, MA 01803"};

function update_select(select, input) {

    var options = [];
    $.each(labels, function(label, value) {
        options.push(label);
    });
    options.sort(function (a, b) {
        return a.toLowerCase().localeCompare(b.toLowerCase());
    });

    select.empty();

    var option = $("<option />").text("--select--").attr("value", "");
    select.append(option);

    var valueInput = input.val();
    var selected = false;
    $.each(options, function(idx, label) {
        var value = labels[label];
        option = $("<option />").text(label).attr("value", value);
        if (!selected && value == valueInput) {
            selected = true;
            option.attr("selected", "selected");
        }
        select.append(option);
    });
}

function update() {
    localStorage.setItem("labels", JSON.stringify(labels, null, 4));
    $.each(selects, function (idx, arr) {
        update_select(arr[0], arr[1]);
    });
}

var style = "height:28px; box-sizing:border-box;";

function setup_address(id) {
    var input = $('#' + id);
    var parent = input.parent();
    var div = $('<div></div>');
    var label = $('<label class="addresses">&nbsp</label>');
    var select = $('<select style="' + style + '" />');
    var name = $('<input type="text" size="8" value="" style="' + style + '" />');
    var add = $('<input type="button" value="  +  " style="' + style + '" />');
    var del = $('<input type="button" value="  -  " style="' + style + '" />');

    select.change(function () {
        input.val(select.val());
        input.change();
    });

    add.click(function () {
        var value = input.val().trim();
        if (!value) return;
        var label = name.val().trim();
        if (!label) {
            alert("Please enter a label.");
            return;
        }
        labels[label] = value;
        update();
    });

    del.click(function () {
        var label = select.find(":selected").text();
        delete labels[label];
        update();
    });

    parent.after(div);
    div.append(label);
    label.after(del);
    del.after(select);
    select.after(name);
    name.after(add);

    selects.push([select, input]);
}

function setup_datetime() {
    var fs = $("#preference_settings");
    var date = $("#datepicker");
    var div = $('<div></div>');
    var now = $('<input type="button" value="  .  " style="' + style + '" />');
    now.click(function () {
        var dt = new Date();
        date.val(dt.toLocaleDateString());
    });
    fs.append(div);
    div.append(now);
}

function init() {
    
    setup_address("from");
    setup_address("to");
    // setup_datetime();
    update();
}

init();