// ==UserScript==
// @name         Web Test Linkedin Profile Helper
// @version      0.3
// @description  Helps complete the linkedin pages
// @author       Tjololo
// @match        https://s3.amazonaws.com/mturk_bulk/hits*
// @require      http://code.jquery.com/jquery-git.js
// @grant        GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/710
// @downloadURL https://update.greasyfork.org/scripts/9112/Web%20Test%20Linkedin%20Profile%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/9112/Web%20Test%20Linkedin%20Profile%20Helper.meta.js
// ==/UserScript==

var url = $('a:first').attr("href");

console.log(url);

getLinkedinPage(url);

function getLinkedinPage(url)
{
    GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        synchronous: true,

        onload: function (xhr) {
            r = xhr.responseText;
            //console.log(r);
            var ret="";
            try{
                getInfo(r);
            }
            catch(err){
                $('#Q1ProfileFound[value="No"]').click();
                console.log(err);
                //console.log(r);
                return r;
            }
        }
    });
}

function getInfo(obj){
    var html = $.parseHTML(obj);
    var el = $( '<div></div>' );
    var finalUrl = [];
    el.html(html);
    //Loaded, first&last name, wells fargo advisors logo
    if ($("#headline", el).length == 0)
        $('#Q1ProfileFound[value="No"]').click();
    else{
        $('#Q1ProfileFound[value="Yes"]').click();
        var jobTitle = $("#headline", el).text().split(" at")[0];
        var name = $("span.full-name", el).text();
        var profilePic = ($("div.profile-picture", el).length > 0);
        var externalSite = ($("#website", el).length == 0 ? false : true);
        var connections = $("div.member-connections", el).text().replace(/[^\d]/g,'');
        var summary = ($("div.summary-header", el).length == 0 ? false : true);
        var summaryText = $("#summary-item", el).text();
        var skills = ($("ul.skills-section li", el).length != 0 ? true : false);
        var education = ($("#background-education", el).length != 0 ? true : false);
        var interests = ($("#interests", el).length == 0 ? false : true);
        var personalLink = $("dl.public-profile dd", el).text();
        console.log($("ul.groups-container li", el));
        var volunteer = ($("#background-volunteering", el).length != 0 ? true : false);
        var backgroundPic = $("#background-experience", el).find("img").attr("data-li-src");
        $("#Q5fLogo").parent().parent().parent().parent().prev().append('<img src='+backgroundPic+' />');
        if (!backgroundPic || backgroundPic.length <= 0)
            $("input[id*=Logo][value='No logo']").click();
        $("#background", el).find("header").eq(0).find("img.lazy-load").each(function() {
            var image = $(this).attr("data-li-src");
            $("#Q5eLogo").closest("tr").append("<td><img src=\""+image+"\" /></td>");
        });
        $("input[id*=FullName]").closest("tr").append("<td>"+name+"</td>");
        if (profilePic)
            $("input[id*=ProfilePhoto][value='Yes']").click();
        else
            $("input[id*=ProfilePhoto][value='No']").click();
        if (externalSite)
            $("input[id*=LinktoWebpage][value='Yes']").click();
        else
            $("input[id*=LinktoWebpage][value='No']").click();
        if (summary){
            $("input[id*=Summary][value='Yes']").click();
            $("input[id*=First]").parent().parent().parent().parent().prev().append('<br />'+summaryText);
        }
        else
            $("input[id*=Summary][value='No']").click();
        if (summaryText.indexOf(" intended for use") > -1)
            $('input[id*=Disclosure][value="Yes"]').click();
        else
            $('input[id*=Disclosure][value="No"]').click();
        if (skills)
            $("input[id*=Skills][value='Yes']").click();
        else
            $("input[id*=Skills][value='No']").click();
        if (education)
            $("input[id*=Education][value='Yes']").click();
        else
            $("input[id*=Education][value='No']").click();
        if (interests)
            $("input[id*=Interests][value='Yes']").click();
        else
            $("input[id*=Interests][value='No']").click();
        if (volunteer)
            $("input[id*=Volunteer][value='Yes']").click();
        else
            $("input[id*=Volunteer][value='No']").click();
        $("input[id*=JobTitle]").val(jobTitle);
        if (jobTitle.toLowerCase().indexOf("financial advisor") > -1){
            $('input[id*=FinancialAdvisor][value="Yes"]').click();
        }
        else{
            $('input[id*=FinancialAdvisor][value="No"]').click();
        }
        $("#Q3ProfileURL").val(personalLink);
        $("#Q4Connections").val(connections);
    }
}