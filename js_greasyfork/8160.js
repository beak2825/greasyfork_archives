// ==UserScript==
// @name         Generate ibis entry
// @namespace    http://ibis.gen/
// @version      0.1
// @description  enter something useful
// @author       You
// @match        https://ibis.infinity-software.com/timeentry/TimeEntryHome.aspx
// @grant        none
// @require 	 //cdnjs.cloudflare.com/ajax/libs/moment.js/2.9.0/moment.min.js
// @downloadURL https://update.greasyfork.org/scripts/8160/Generate%20ibis%20entry.user.js
// @updateURL https://update.greasyfork.org/scripts/8160/Generate%20ibis%20entry.meta.js
// ==/UserScript==


$(function() {
    $('body').append("<input id='from' type='text' style='position: fixed; right: 125px; top: 100px; width: 80px' />");
    $('body').append("<span  style='position: fixed; right: 110px; top: 100px; font-size: 10px'>to</span>")
    $('body').append("<input id='to' type='text' style='position: fixed; right: 25px; top: 100px; width: 80px' />");
    $('body').append("<textarea id='notes' style='position: fixed; right: 25px; top: 130px; width: 180px' />");
    $('body').append("<button id='run' style='position: fixed; right: 25px; top: 165px'>Generate</button>");
    
    $("#run").click(generate);
    
    function run(entry) {
        $("#txtDate").val(entry.date);
        $("#ddlStartTime").val('9:00 AM');
        $("#ddlEndTime").val('5:00 PM');
        $("#ddlProject").val(1515).change();
        $("#ddlRole").val(284).change();
        $("#ddlWorkType").val(100).change();
        $("#txtPublicNotes").val(entry.note);
        
        setTimeout(function() {
        	$("#btnSaveEntry")[0].click();
        }, 1000);
    }
    
    function generate() {
        var entry = load();
        
        if(entry.from === '') { return; }
        
        // clear the last saved entry to start a new one
        if(!clearLastEntry()) { return; };
        
        var current = moment(entry.from).add(entry.current, 'days').format('MM/DD/YYYY');
        
        // save data
        entry.current += 1;
        save(entry);
        
        run({
        	date: current,
            note: entry.note
        });
    }
    
    function save(data) {
        var diff = moment(data.from).add(data.current-1 ,'days').diff(moment(data.to), 'days');
        console.log(diff);
        if(diff === 0) {
        	localStorage.removeItem('auto-ibis');
        }
        else{
    		localStorage.setItem("auto-ibis", JSON.stringify(data));
        }
    }
    
    function load(){
        return JSON.parse(localStorage.getItem("auto-ibis")) || {
            from    : $("#from").val(),
            to      : $("#to").val(),
            note    : $("#notes").val(),
            current : 0
        };
    }
    
    function clearLastEntry(){
        if($("#txtDate").val() !== '') {
         	$("#txtDate").val('').change();
            $("#btnUndoAction")[0].click();
            return false;
        }
        
        return true;
    }
    
    generate();
});