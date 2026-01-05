// ==UserScript==
// @name         FP Custom Forums
// @namespace    http://fpcf.spiderschwe.in
// @version      2
// @description  Puts old forums back into Facepunch
// @author       DrTaxi
// @match        http://facepunch.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/7514/FP%20Custom%20Forums.user.js
// @updateURL https://update.greasyfork.org/scripts/7514/FP%20Custom%20Forums.meta.js
// ==/UserScript==

var fpcf_uri = "http://fpcf.spiderschwe.in";
var fpcf_thread_created = false;

function insertNotice(notice) {
    notice = $("<div class='notice'>" + notice + "</div>");
    $("#content_inner").prepend(notice);
}

function replaceBreadcrumb(data) {
    navbit_fp = $(".navbit").first().next();
    navbit_fp.text("> " + data.category);
    forumlink = navbit_fp.next().html("&gt; <a></a>").find("a").first();
    forumlink.attr("href", fpcf_uri + "/forum/" + data.slug + "/1");
    forumlink.text(data.name);
}

window.fpcfDisableHiding = function() {
    localStorage.setItem("fpcf-disable-hiding", "yes");
    alert("Thread hiding has been disabled.");
}

window.fpcfEnableHiding = function() {
    localStorage.setItem("fpcf-disable-hiding", "no");
    alert("Thread hiding has been enabled.");
}

// thanks http://stackoverflow.com/questions/2090551/parse-query-string-in-javascript
function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
}

$(document).ready(function(){
    
    $.ajax({
        type: 'get',
        url: fpcf_uri + "/api/version",
        dataType: 'json',
        beforeSend: function(xhr) {
            xhr.withCredentials=true;
        },
        success: function(data, textStatus, XMLHttpRequest) {
            if(XMLHttpRequest.status == 200 && data > 2) {
                localStorage.setItem("fpcf-current-version", data);
                insertNotice("<b>A new version of FPCF is available</b>. <a href='"+fpcf_uri+"'>Go here for more information.</a>");
            }
        }
    });
    
    if(window.location.pathname == "/showthread.php" && localStorage.getItem("fpcf-posticon") !== null) {
        
        if($(".nodecontrols:first > a").first().next().attr("name") != 1 || $(".username:first").text().trim() != $("#navbar-login > a").text().trim() || $(".navbit:first").next().next().find("a").text().trim() != "General Discussion") {
            // no more reliable way to check whether this is your freshly created thread
            insertNotice("<b>FPCF thread was not created</b>");
        } else {
            fpcf_thread_created = true;
            $.ajax({
                type: 'post',
                url: fpcf_uri + "/api/create_thread",
                dataType: 'json',
                beforeSend: function(xhr) {
                    xhr.withCredentials=true;
                },
                data: JSON.stringify({
                    id: vB_Editor['vB_Editor_QR'].config.vbulletin.parentcontentid,
                    user_id: vB_Editor['vB_Editor_QR'].config.vbulletin.userid,
                    user_name: $(".username:first").text().trim(),
                    name: $("#lastelement").text().trim(),
                    posticon: localStorage.getItem("fpcf-posticon"),
                    slug: localStorage.getItem("fpcf-slug"),
                    first_post_id: $(".postcontainer").first().attr("id").substring(5)
                }),
                success: function(data, textStatus, XMLHttpRequest) {
                    if(XMLHttpRequest.status == 200) {
                        insertNotice("FPCF thread created.");
                        replaceBreadcrumb(data);
                    } else {
	                    insertNotice("<b style='color: red'>FPCF thread creation failed!</b>");
                    }
                },   
                error:function (xhr, ajaxOptions, thrownError){
                    insertNotice("<b style='color: red'>FPCF thread creation failed!</b>");
                }
            });
        }
        
        localStorage.removeItem("fpcf-posticon");
        localStorage.removeItem("fpcf-slug");
    }
    
    if(window.location.pathname == "/" || window.location.pathname == "/forum.php") {
        
        $.ajax({
            type: 'get',
            url: fpcf_uri + "/api/boards",
            dataType: 'json',
            beforeSend: function(xhr) {
                xhr.withCredentials=true;
              },
            success: function(data, textStatus, XMLHttpRequest){
                if(XMLHttpRequest.status == 200) {
                    // babbys first templating engine
                    cat_template = $("<table class=\"forums\" cellpadding=\"6\">\r\n\t<thead>\r\n\t\t<tr class=\"forumhead foruminfo L1\" style=\"background-color: #74C365\">\r\n\t\t\t<td>\r\n\t\t\t\t<h2 class=\"fpcf-categoryname\"></h2>\r\n\t\t\t</td>\r\n\t\t\t<td class=\"last_post_column\">\r\n&nbsp;\r\n\t\t\t</td>\r\n\r\n\t\t</tr>\r\n\t\t\r\n\t</thead>\r\n\t\r\n\t<tbody class=\"forumbit_nopost L1\">\r\n\t\t<!-- Title strecher row -->\r\n\t\t<tr><td></td>\r\n<td class=\"last_post_column\"></td></tr>\r\n\t</tbody>\r\n\t\r\n\r\n</table>");
                    forum_template = $("\r\n\t\t<tr class=\"forumbit_post L2\">\r\n\t<td class=\"foruminfo\" style=\"background-position: 6px center;background-repeat: no-repeat;padding-left: 29px;\">\r\n\t\t<div class=\"forumdata\">\r\n\t\t\t<h2 class=\"forumtitle\"><a class=\"fpcf-forumname\"></a></h2>\r\n\t\t\t<p class=\"forumdescription\"></p>\r\n\t\t\t\r\n\t\t\t\r\n\t\t</div>\r\n\t</td>\r\n\r\n\t<td class=\"alt forumlastpost last_post_column\">\r\n\t\t\r\n\t\r\n\r\n\t\t<div class=\"LastPostAvatar\">\r\n<a class=\"fpcf-lastposterlink\"><img src=\"/p.gif\" width=\"100%\" height=\"100%\"></a>\r\n</div>\r\n\t\r\n\t<p class=\"lastposttitle\">\r\n\t\r\n\t\r\n\t<a class=\"threadtitle\"></a>\r\n\t</p>\r\n\r\n\t<p class=\"lastpostdate\"></p>\r\n\r\n\t</td>\r\n\r\n</tr>");
                    
                    for(i = 0; i < data.length; i++) {
                        cat = cat_template.clone();
                        cat_tbody = cat.find("tbody").first();
                        cat.find(".fpcf-categoryname").first().text(data[i].name);
                        
                        for(j = 0; j < data[i].forums.length; j++) {
                            forumdata = data[i].forums[j];
                            forum = forum_template.clone();
                            forum.find(".foruminfo").first().css("background-image", "url('"+forumdata.icon+"')");
                            forum.find(".fpcf-forumname").first().attr("href", fpcf_uri+"/forum/"+forumdata.slug+"/1");
                            forum.find(".fpcf-forumname").first().text(forumdata.name);
                            forum.find(".forumdescription").first().text(forumdata.description);
                            if(forumdata.last_post !== null) {
                                forum.find(".LastPostAvatar").first().css("background-image", "url('/image.php?u="+forumdata.last_post.poster_id+"')");
                                forum.find(".fpcf-lastposterlink").first().attr("href", "/members/"+forumdata.last_post.poster_id);
                                forum.find(".fpcf-lastposterlink").first().find("img").first().attr("alt", forumdata.last_post.poster_name);
                                forum.find(".fpcf-lastposterlink").first().find("img").first().attr("title", forumdata.last_post.poster_name);
                                forum.find(".threadtitle").first().attr("href", "showthread.php?t="+forumdata.last_post.thread_id+"&goto=newpost&fpcf="+forumdata.slug);
                                forum.find(".threadtitle").first().attr("title", forumdata.last_post.thread_name);
                                forum.find(".threadtitle").first().text(forumdata.last_post.thread_name);
                                forum.find(".lastpostdate").first().html(forumdata.last_post.time + " <a href='showthread.php?t="+forumdata.last_post.thread_id+"&amp;p="+forumdata.last_post.post_id+"&amp;fpcf="+forumdata.slug+"#post"+forumdata.last_post.post_id+"'><img src='fp/vb/buttons/lastpost.gif' alt='Go to last post' title='Go to last post'></a>")
                            }
                            forum.appendTo(cat_tbody);
                        }
                        
                        if(data[i].is_right) {
                            cat.appendTo($(".FrontPageForums").last());
                        } else {
                            cat.appendTo($(".FrontPageForums").first());
                        }
                    }
                } else {
                    insertNotice("FPCF boards list failed to load.");
                }
            },
            error:function (xhr, ajaxOptions, thrownError){
                insertNotice("FPCF boards list failed to load.");
            }
        });
       
    } else if(window.location.pathname == "/newthread.php" && getQueryVariable("f") == 6 && window.location.search.indexOf("fpcf") > -1) {
        form = $(".vbform").first();
        form.attr("action", form.attr("action") + "&fpcf=" + getQueryVariable("fpcf"));
        $("[name='sbutton']").click(function(e) {
            localStorage.setItem("fpcf-posticon", "http://facepunch.com" + $("#display_posticon").attr("src"));
            localStorage.setItem("fpcf-slug", getQueryVariable("fpcf"));
        });
        $("<style>.button { background: #74C365 !important; }</style>").appendTo("head");
        insertNotice("<b>You are technically posting in General Discussion.</b> GD rules apply. Make sure your thread title makes sense to GD readers.");
        $.ajax({
            type: 'get',
            url: fpcf_uri + "/api/board/" + getQueryVariable("fpcf"),
            dataType: 'json',
            beforeSend: function(xhr) {
                xhr.withCredentials=true;
            },
            success: function(data, textStatus, XMLHttpRequest) {
                if(XMLHttpRequest.status == 200) {
                    $(".rfloat").first().text("Forum: " + data.name);
                    data.slug = getQueryVariable("fpcf");
                    replaceBreadcrumb(data);
                } else {
                    insertNotice("<b style='color: red'>Error finding FPCF forum.</b> Your thread will probably not appear in FPCF.");
                }
            },   
            error:function (xhr, ajaxOptions, thrownError){
                insertNotice("<b style='color: red'>Error finding FPCF forum.</b> Your thread will probably not appear in FPCF.");
            }
        });
    } else if(window.location.pathname == "/showthread.php" && !fpcf_thread_created && $(".navbit:last > a").text() == "General Discussion") {
        $.ajax({
            type: 'get',
            url: fpcf_uri + "/api/read_thread/" + vB_Editor['vB_Editor_QR'].config.vbulletin.parentcontentid + "/" + $(".postcontainer").last().attr("id").substring(5),
            dataType: 'json',
            beforeSend: function(xhr) {
                xhr.withCredentials=true;
            },
            success: function(data, textStatus, XMLHttpRequest) {
                if(XMLHttpRequest.status == 200) {
                    replaceBreadcrumb(data);
                }
            }
        });
    } else if(window.location.pathname == "/forumdisplay.php" && getQueryVariable("f") == 6) {
        if(localStorage.getItem("fpcf-disable-hiding") == "yes") {
            insertNotice("You have disabled hiding of FPCF threads in General Discussion. <a href='javascript:fpcfEnableHiding();'>Click here to reenable</a>");
        } else {
            threads = [];
            $(".threadbit").each(function(){
                threads.push($(this).attr("id").substring(7))
            });
            
            $.ajax({
                type: 'post',
                url: fpcf_uri + "/api/gd_threads",
                dataType: 'json',
                beforeSend: function(xhr) {
                    xhr.withCredentials=true;
                },
                data: JSON.stringify(threads),
                success: function(data, textStatus, XMLHttpRequest) {
                    if(XMLHttpRequest.status == 200) {
                        for(i = 0; i < data.length; i++) {
                            $("#thread_" + data[i]).remove();
                        }
                        insertNotice("As you're in General Discussion, FPCF threads have been removed from view. (Count: " + data.length + "). <a href='javascript:fpcfDisableHiding();'>Click here to disable this feature.</a>");
                    } else {
                        insertNotice("Failed to remove FPCF threads.");
                    }
                }
            });
        }
    }
        
});