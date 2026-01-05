// ==UserScript==
// @name         CHG Crucible Checklist
// @namespace    http://onai.net/userscripts/
// @version      0.1.2
// @description  Adds development checklist to Crucible
// @author       Kevin Gwynn <kevin.gwynn@gmail.com>
// @match        https://itcentral.chgcompanies.com/crucible/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/8038/CHG%20Crucible%20Checklist.user.js
// @updateURL https://update.greasyfork.org/scripts/8038/CHG%20Crucible%20Checklist.meta.js
// ==/UserScript==

console.log('Initialize CHG Crucible Checklist 0.1.2...');

jQuery(function() {
    // To remove, execute the below statement:
    //jQuery('#checklistTab,#chgChecklist,#chgStyle').remove();

    var standardsUrl = 'https://itcentral.chgcompanies.com/confluence/display/FOXDEV/Salesforce+Apex+Style+Guide';
    
    var tab = jQuery('<div id="checklistTab" />')
        .html('CHG Checklist')
        .click(function() { jQuery('#chgChecklist').toggle(); })
    ;
    var div = jQuery('<div id="chgChecklist" />')
        .html('<ol>' +
              '<li>Demo<ul><li>Run through QA tests with Code Reviewer, QA, and BA.</li></ul></li>' +
              '<li>Readable<ul><li>See <a href="'+standardsUrl+'">code standards</a></li></ul></li>' +
              '<li>Reusable<ul><li>See <a href="'+standardsUrl+'">code standards</a></li></ul></li>' +
              '<li>Secure<ul><li>Check malicious intent, bad input</li></ul></li>' +
              '<li>Error Handling<ul><li>Friendly error messages?</li><li>Unexpected errors logged?</li></ul></li>' +
              '<li>Unit Tests<ul><li>Are the changes covered by tests?</li><li>Are there meaningful assertions?</li></ul></li>' + 
              '<li>Performance</li>' + 
              '<li>Scalable</li>' + 
              '<li>Regression<ul><li>Check to see if the code is being used elsewhere</li></ul></li>' +
              '</ol>')
    	.click(function() { jQuery(this).hide(); })
    ;
    var style = jQuery('<style type="text/css" id="chgStyle" />');
    style.html('#checklistTab { position:fixed; opacity:0.85; bottom:0px; right:100px; width:140px; height:20px; color:#333; background-color:#CCC; border-top:2px solid #666; border-right:2px solid #666; border-left:2px solid #666; font-size:12pt; text-align:center; padding-top:2px; cursor:pointer; }' +
               '#chgChecklist ul { padding-left:8px; margin-left:8px; padding-top:2px; list-style-type: disc; list-style-position: inside; }' + 
               '#chgChecklist ol { list-style-type: decimal; list-style-position: inside; font-weight:bold; }' +
               '#chgChecklist li { margin:2px; padding:2px; }' + 
               '#chgChecklist ul li { font-weight:normal; }' + 
               '#chgChecklist { display:none; opacity:0.95; position:fixed; z-index:1000; bottom:28px; right:5px; width:240px; height:500px; color:#333; background-color:#CCC; border:2px solid black; font-size:10pt; padding:5px; }');
    jQuery('BODY').prepend(style).append(tab).append(div);
});
