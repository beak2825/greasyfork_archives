// ==UserScript==
// @name         Review/Rec Queue
// @version      0.12
// @description  Changes the queue to include more details.
// @author       Ghost
// @match        http://myanimelist.net/administration.php?go=submissions
// @grant        none
// @namespace https://greasyfork.org/users/10763
// @downloadURL https://update.greasyfork.org/scripts/9955/ReviewRec%20Queue.user.js
// @updateURL https://update.greasyfork.org/scripts/9955/ReviewRec%20Queue.meta.js
// ==/UserScript==

var normalHeader = document.getElementsByClassName('normal_header')[0];    // "Detail Edits" selector
var oldReportNodes = document.getElementsByClassName("borderClass");       // .borderClass selector
var para = oldReportNodes[0].parentNode;                                   // .borderClass parent selector
var reportTable = document.createElement("table");                         // Table init

//Increases the width of #content to the whole width.
document.getElementById("content").getElementsByTagName('td')[0].style.width = "100%";

//Adds the total reports next to 'Detail Edits'.
normalHeader.innerHTML = "Detail Edits ("+$('.borderClass').length+")<div id='queueButtons' style='float: right;'><a id=clearLocal>Reload</a> | <a id=filter>Filter</a></div>";

//Adds the attributes and title headers (#/AM Title/Type/Reported User/Reporter/Edit) to the table
reportTable.setAttribute("id", "reports");
reportTable.setAttribute("style", "border-collapse: collapse; width:100%");
reportTable.innerHTML = "<tr><th id='num'>#&#9660;</th><th>Anime/Manga Title&#9660;</th><th id='type' style='width:80px;'>Type&#9660;</th><th id='edit' style='width:50px;'></th><th id='reported_user' style='width:130px;'>Reported User&#9660;</th><th id='reporter'>Reporter&#9660;</th></tr>";
normalHeader.parentNode.appendChild(reportTable);

//Takes the report div elements and splits the information into a table row which gets added to the table.
for (i = 0; i < oldReportNodes.length; i++) {
    reportRow = document.createElement("tr");
    reportRow.setAttribute("class","reportRow");
    reportRowInfo = oldReportNodes[i].innerHTML;
    reportLink = oldReportNodes[i].getElementsByTagName("a")[0].getAttribute("href");
    reporter = reportRowInfo.split("by ")[1].toString();
    
    reportRow.innerHTML = "<td>"+ (i+1) +"</td><td class=animaTitle>Loading...</td><td class=type>Loading...</td><td class=reportLink><a href="+reportLink+">Open</a></td><td class=reportedUser>Loading...</td><td><a href=http://myanimelist.net/profile/"+ reporter +">"+ reporter +"</a></td>";
    document.getElementById("reports").appendChild(reportRow);
}

//Removes the report div elements
while (oldReportNodes.length-1 !== -1) {
    para.removeChild(oldReportNodes[(oldReportNodes.length-1)]);}

//Adds bottom border to the rows
$('#reports td').css({"border-bottom":"1px lightgray solid", "margin-bottom":"5px", "height":"25px"});
$('#reports th').css("border-bottom","3px black double");


//Function to pull information from the reported Rec/Review
var getReportDetails = function () {
    var $reportLinks = $('.reportLink');
    $reportLinks.each(function(index) {
        
        //Report Link
        var reportLink = $(this).find("a").attr('href');
        
        //Callback text
        var response = "";
        var type = "";
        var anima = "";
        var reportedUser = "";
        
        //If the reportLink + data is already in the localStorage use that, if not AJAX.
        if(localStorage.getItem(reportLink) !== null) {
            reportedUser = localStorage.getItem(reportLink).match(/(Written|Suggested) by.*\n.*profile\/.*"/);
            if (reportedUser !== null){
                reportedUser = reportedUser.toString().match(/\/profile\/.*"/);
                reportedUser = reportedUser.toString().replace("/profile/", "").replace("\"", "");
                }
            else {
                reportedUser = "NaN";
				}
            
            //To run if the reportLink is a review report link / else it is a recommendation link
            if (reportLink.indexOf("type=28") !== -1) {
                anima = localStorage.getItem(reportLink).match(/<a href="\/(anime|manga).php\?id=\d*">.*<\/a>/);
                    if (anima !== null){
                        if (anima.toString().indexOf(",anime") !== -1) {
                            anima = anima[0].toString();
                            type = "Anime Rev.";}
                        else {
                            anima = anima[0].toString();
                            type = "Manga Rev.";}}
                    else {
                        anima = "NaN";}
			}
            else {
                anima = localStorage.getItem(reportLink).match(/<a href="(anime|manga).php\?id=\d*">.*<\/a>.*\n.*<a href="(anime|manga).php\?id=\d*">.*<\/a>/);
                if (anima !== null){
                    if (anima.toString().search(/,anime/g) !== -1) {
                        anima = anima[0].toString();
                        type = "Anime Rec.";}
                    else {
                        anima = anima[0].toString();
                        type = "Manga Rec.";}}
                else {
                    anima = "Nan";}}
            
            //Appends the data from the GET requests
            $('.reportedUser').eq(index).html(reportedUser);
            $('.animaTitle').eq(index).html(anima);
            $('.type').eq(index).html(type);}
        else {
        var ajax = $.ajax({method: "GET", url: reportLink, cache:true, async: false, success: function(text) {
            response = text.slice(text.search("<table id=\"dialog\""), text.search("<!-- end of contentHome -->"));
            
            //Adds to localStorage
            localStorage.setItem(reportLink, response);
            
            reportedUser = response.match(/(Written|Suggested) by.*\n.*profile\/.*"/);
            if (reportedUser !== null){
                reportedUser = reportedUser.toString().match(/\/profile\/.*"/);
                reportedUser = reportedUser.toString().replace("/profile/", "").replace("\"", "");
                }
            else {
                reportedUser = "NaN";
				}
            
            //To run if the reportLink is a review report link / else it is a recommendation link
            if (reportLink.search("type=28") !== -1) {
                anima = response.match(/<a href="\/(anime|manga).php\?id=\d*">.*<\/a>/);
                    if (anima !== null){
                        if (anima.toString().search(",anime") !== -1) {
                            anima = anima[0].toString();
                            type = "Anime Rev.";}
                        else {
                            anima = anima[0].toString();
                            type = "Manga Rev.";}}
                    else {
                        anima = "NaN";}
			}
            else {
                anima = response.match(/<a href="(anime|manga).php\?id=\d*">.*<\/a>.*\n.*<a href="(anime|manga).php\?id=\d*">.*<\/a>/);
                if (anima !== null){
                    if (anima.toString().search(/,anime/g) !== -1) {
                        anima = anima[0].toString();
                        type = "Anime Rec.";}
                    else {
                        anima = anima[0].toString();
                        type = "Manga Rec.";}}
                else {
                    anima = "Nan";}}
            
            //Appends the data from the GET requests
            $('.reportedUser').eq(index).html(reportedUser);
            $('.animaTitle').eq(index).html(anima);
            $('.type').eq(index).html(type);
        }
                          });}
    });
};

//Sorts table, first click A->Z , second click Z->A
$('th').click(function(){
    var table = $('#reports');
    var rows = table.find('tr:gt(1)').toArray().sort(comparer($(this).index()))
    this.asc = !this.asc
    if (!this.asc){rows = rows.reverse()}
    for (var i = 0; i < rows.length; i++){table.append(rows[i])}
})
function comparer(index) {
    return function(a, b) {
        var valA = getCellValue(a, index), valB = getCellValue(b, index)
        return $.isNumeric(valA) && $.isNumeric(valB) ? valA - valB : valA.localeCompare(valB)
    }
}

    //Add Filter to the table headers
function getCellValue(row, index){ return $(row).children('td').eq(index).html() }
    
$('#reports').each(function(){
    var table = $(this)
    var headers = table.find('th').length
    var filterrow = $('<tr>').insertAfter($(this).find('th:last()').parent())
    for (var i = 0; i < headers; i++){
        filterrow.append($('<th>').append($('<input>').attr('type','text').keyup(function(){
	        table.find('tr').show()
            filterrow.find('input[type=text]').each(function(){
	            var index = $(this).parent().index() + 1
	            var filter = $(this).val() != ''
	            $(this).toggleClass('filtered', filter)
	            if (filter){
	                var el = 'td:nth-child('+index+')'
	                var criteria = ":contains('"+$(this).val()+"')"
	                table.find(el+':not('+criteria+')').parent().hide()
	            }
            })
        })))
    }
})

//Hides the report link filter
$('#reports > tbody > tr:nth-child(2) > th:nth-child(4) > input[type="text"]').hide();

//Hides the current filters
$('#reports > tbody > tr:nth-child(2)').hide();

//Toggles view of the filter upon clicking "Filter"
$('#filter').click(function(){
        $('#reports > tbody > tr:nth-child(2)').toggle('display'); 
});

//Adds event listener to "Reload" ancher that clears the localstorage and refreshes the page.
$('#clearLocal').click(function(){
    localStorage.clear();
    location.reload();});

//Adjusts Cursor
document.getElementById("filter").style.cursor = "pointer";
document.getElementById("clearLocal").style.cursor = "pointer";

//Waits until the page has finished loading before getting the report details.
if (document.readyState==="loading") {
    if (window.addEventListener) window.addEventListener("DOMContentLoaded",getReportDetails,false);
    else if (window.attachEvent) window.attachEvent("onload",getReportDetails);
} else if (document.readyState==="complete") {
    getReportDetails();
} else {
    if (window.addEventListener) window.addEventListener("load",getReportDetails,false);
    else if (window.attachEvent) window.attachEvent("onload",getReportDetails);
}