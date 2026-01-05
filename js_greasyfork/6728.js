// ==UserScript==
// @name           1fichier tools
// @namespace      surrealmoviez.info
// @description    Tools to manage 1fichier links easily
// @require        http://code.jquery.com/jquery-1.11.1.min.js
// @include        http://www.1fichier.com/console/*
// @include        http://www.1fichier.com/*/console/*
// @include        http://1fichier.com/console/*
// @include        http://1fichier.com/*/console/*
// @include        https://www.1fichier.com/console/*
// @include        https://www.1fichier.com/*/console/*
// @include        https://1fichier.com/console/*
// @include        https://1fichier.com/*/console/*
// @grant          none
// @version        1.2.3
// @downloadURL https://update.greasyfork.org/scripts/6728/1fichier%20tools.user.js
// @updateURL https://update.greasyfork.org/scripts/6728/1fichier%20tools.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

// Creates an array of direct links
function createArrayLinks() {
    var links = [];
    $("li.file.ext_gif.ui-selectee.ui-selected").each(function () {
        var temp_id = $(this).attr("rel");
        var id_start = temp_id.lastIndexOf("_") + 1;
        var id = "https://1fichier.com/?" + temp_id.substring(id_start);
        links.push(id);
    });
    return (links);
}

// Retrieves all IDs of the folders in the current account as an array
function getFoldersIds() {

    var folders_droppable = ["0"];
    var folders_ids = ["0"];
    var temp_html = "";

    while (folders_droppable.length !== 0) {
        $.ajax({
            type: "GET",
            url: "/console/dirs.pl?dir_id=" + folders_droppable[0] + "&map=0&start=0&fk=false",
            async: false,
            success: function (text) {
                temp_html = text;
            }
        });

        $(temp_html).find('li').each(function () {
            if (!$(this).hasClass('root') && $("div > a", $(this)).text() !== "Ignore") {
                folders_ids.push($(this).attr('rel'));
            }
            if ($(this).hasClass('fcp')) {
                folders_droppable.push($(this).attr('rel'));
            }
        });
        folders_droppable.shift();
    }

    return folders_ids;
}

// Extracts the ID, query ID, name and upload date of all files in the current folder
// Returns an array of [id, id_ref, date, name]. Date as yyyy-mm-dd
function extractFoldersData(folder_ids) {

    var collection = [];

    for (var i = 0; i < folder_ids.length; i++) {
        $.ajax({
            type: "GET",
            url: "/console/files.pl?dir_id=" + folder_ids[i] + "&oby=",
            async: false,
            success: function (data) {
                $("li.file", $(data)).each(function () {
                    var current = [];
                    var temp_id = $(this).attr("rel");
                    current[0] = temp_id.substring(temp_id.lastIndexOf("_") + 1);
                    current[1] = "selected%5B%5D=" + temp_id;
                    current[2] = formatDate($(this).find("div.dD").text());
                    current[3] = $(this).find("div.dF").text();
                    collection.push(current);
                });
            },
            error: function (request, status, error) {
                console.log("Error in extractFoldersData()\nStatus: " + status + ", error: " + error + "\n" + request.responseText);
            }
        });
    }

    return (collection);
}

// Groups the ref_ids to make the info requests
// Returns an array of querries
function createQueries(folders_data) {

    var array_id_ref = [];
    for (var i = 0; i < folders_data.length; i++) {
        array_id_ref.push(folders_data[i][1]);
    }
    var array_queries = []; // Array containing all IDs in the current folder
    var size_split = 150; // Number of files to send in each info request

    while (array_id_ref.length !== 0) {
        var current = array_id_ref.splice(0, size_split);
        array_queries.push(current.join("&"));
    }

    return (array_queries);
}

// Returns the id, total downloads and last download date of all files in the account
// Returns an array with [id, total_downloads, date_last_download]. Date as yyyy-mm-dd
function retrieveInfo(array_queries) {

    var files_info = [];

    for (var i = 0; i < array_queries.length; i++) {
        $.ajax({
            method: "POST",
            async: false,
            url: "/console/info.pl",
            data: array_queries[i],
            success: function (data) {
                files_info = files_info.concat(extractStats(data));
            }
        });
    }

    return files_info;

}

// Extracts the info of the curent query
// Returns an array of [id, total_downloads, date_last_download]. Date as yyyy-mm-dd
function extractStats(data) {

    var info = [];
    $("tr td:has(a):first-child", $(data)).each(function () {
        var id = $("a", $(this)).attr("href");
        id = id.substring(id.lastIndexOf('?') + 1);
        var total_downloads, date_last_download;
        var $nextTr = $(this).parent().next("tr");
        // Check if a "not downloaded yet" message is present
        if ($("td", $nextTr).length === 1) {
            total_downloads = 0;
            date_last_download = "NO_DOWNLOADS";
        } else {
            var $lastDownloadTr = $(this).parent().nextUntil('tr:not(.t,.t1)').last();
            var $totalTr = $lastDownloadTr.next();
            total_downloads = $('td:eq(2)', $totalTr).text();
            date_last_download = $('td:eq(1) > a', $lastDownloadTr).text();
        }
        info.push([id, total_downloads, date_last_download]);
    });

    return info;

}

// Returns a date in the format yyyy-mm-dd
function formatDate(uglyDate) {
    var arr_date = uglyDate.split("/");
    if (arr_date.length === 3) {
        arr_date[2] = arr_date[2].substring(0, arr_date[2].indexOf(" "));
        var niceDate = arr_date[2] + "-" + arr_date[1] + "-" + arr_date[0];
    } else {
        console.log("Error parsing date: " + uglyDate);
        niceDate = uglyDate;
    }

    return (niceDate);
}

// Checks if the link weren't downloaded since a given ammount of days
// Returns an array with the file name and the download link as a string, containing only the endangered ones
function checkEndangered(date_last_download, milliseconds_now) {

    var danger_time = 45; // days since the last download. Files are stored for 90 days
    danger_time = danger_time * 86400000; // days to milliseconds
    var milliseconds_last_download = Date.parse(date_last_download);

    if (milliseconds_now - milliseconds_last_download > danger_time) {
        return true;
    }

    return false;
}

// Creates a table containing all file names and time since the last download
// Displayed in a new window
function createExtensiveTable(complete_info) {
    //[id, total_downloads, date_last_download, name]

    complete_info = sortArrayOfArrays(complete_info, 3);

    var page_beginning = "<html><head><title>Files Summary</title></head><body>"
            + "<table align='center' border='0'  width='80%' cellpadding='1' cellspacing='0'>"
            + "<tr style='background-color:#484848; color:#EAE9E9'><th>File name</th><th>Link</th><th>Total downloads</th><th>Time since last download</th>";
    var page_end = "</table></body></html>";
    var table = "";

    var els = complete_info.length;
    var milliseconds_date_now = Date.now();
    var row_colour = "#F8F7F7";
    var grand_total = 0;

    for (var i = 0; i < els; i++) {
        var milliseconds_last_download = milliseconds_date_now - Date.parse(complete_info[i][2]);
        var real_time_last_download = convertMS(milliseconds_last_download);
        table += "<tr style='background-color:" + row_colour + "'><td>" + complete_info[i][3] + "</td><td>http://" + complete_info[i][0] + ".1fichier.com/</td><td>" + complete_info[i][1] + "</td><td>" + real_time_last_download + "</td></tr>";

        if (i % 2 === 0)
            row_colour = "#DAD9D9";
        else
            row_colour = "#F8F7F7";

        grand_total += parseInt(complete_info[i][1]);
    }

    table += "<tr style='background-color:" + row_colour + "'><td></td><td></td><td><b>" + grand_total + "</b></td><td></td></tr>";

    var page_table = page_beginning + table + page_end;

    var j = window.open('', '_blank');
    j.document.write(page_table);
    j.stop();

}

// Converts milliseconds to a string formatted as "X days Y hours"
function convertMS(ms) {
    var d, h, m, s;
    s = Math.floor(ms / 1000);
    m = Math.floor(s / 60);
    s = s % 60;
    h = Math.floor(m / 60);
    m = m % 60;
    d = Math.floor(h / 24);
    h = h % 24;
    return (" " + d + " days " + h + " hours ");
}

function sortArrayOfArrays(array, index) {
    var sortedArray = array.sort(function (a, b) {
        return a[index] > b[index] ? 1 : -1;
    });

    return sortedArray;
}

function dogbert() {

    $("#transparentLayerWaiting").show();
    $("#containerWaiting").show();

    var now = Date.now();
    var list_endangered_links = [];

    var folder_ids = getFoldersIds();
    var folders_data = extractFoldersData(folder_ids);
    var array_queries = createQueries(folders_data);
    var files_info = retrieveInfo(array_queries);

    if (folders_data.length !== files_info.length) {
        alert("Something failed! " + folders_data.length + " files were detected in the folders but " + files_info.length + " were processed for information.\nPlease try again and inform this error if it persists over days.");
    } else {
        folders_data = sortArrayOfArrays(folders_data, 0);
        files_info = sortArrayOfArrays(files_info, 0);

        for (var i = 0; i < files_info.length; i++) {
            if (folders_data[i][0] === files_info[i][0]) {
                if (files_info[i][2] === "NO_DOWNLOADS") {
                    files_info[i][2] = folders_data[i][2];
                }
                if (checkEndangered(files_info[i][2], now)) {
                    list_endangered_links.push(folders_data[i]);
                }
            } else {
                alert("The IDs of an element didn't match, the process wasn't accurate any more and was stopped.\nPlease reload the page, try again and report this error if the problem persists.");
                break;
            }
        }
    }

    var complete_info = [];
    for (var i = 0; i < folders_data.length; i++) {
        complete_info.push([files_info[i][0], files_info[i][1], files_info[i][2], folders_data[i][3]]);
    }

    if (list_endangered_links.length === 0) {
        $("#clean_links").val("No links dying in the next 2 weeks found :)");
        $('#message_links').html("<br>" + files_info.length + " link(s) in " + folder_ids.length + " folder(s) checked<br>Click <a href='#' id='ext_table' style='color:#E6E6E6; text-decoration:underline; font-weight: bold;'><b>here</b></a> for a detailed list (opens in a new window)");
    } else {
        var readeable_endangered_links = [];
        for (var i = 0; i < list_endangered_links.length; i++) {
            readeable_endangered_links.push(list_endangered_links[i][3] + " - http://" + list_endangered_links[i][0] + ".1fichier.com/");
        }
        readeable_endangered_links.sort(function (a, b) {
            return a.localeCompare(b);
        });
        $("#clean_links").val("Dying in 2 weeks or less:\n\n" + readeable_endangered_links.join("\n"));
        $('#message_links').html("<br>" + list_endangered_links.length + " endangered link(s) found<br>" + files_info.length + " link(s) in " + folder_ids.length + " folder(s) checked<br>Click <a href='#' id='ext_table' style='color:#E6E6E6; text-decoration:underline; font-weight: bold;'><b>here</b></a> for a detailed list (opens in a new window)");
    }

    $('#ext_table').click(function (event) {
        event = event || window.event;
        createExtensiveTable(complete_info);
        return false;
    });

    $("#transparentLayer").show();
    $("#container").show();
    $("#transparentLayerWaiting").hide();
    $("#containerWaiting").hide();
    list_endangered_links = "";
    $("#clean_links").select();
}

// New elements for the page
{
    var img_endangered = '<div id="div_endangered" style="position: fixed; bottom: 0px; left: 0px; z-index: 3000">'
            + '<img id="img_endangered" src="http://i.imgur.com/x3CC8ht.png" alt="Retrieve endangered links" title="Retrieve endangered links">'
            + '</div>';

    var winHeight = $(window).height();
    var winWidth = $(window).width();
    var marginTop = Math.floor((winHeight - 400) / 2);
    var marginLeft = Math.floor((winWidth - 470) / 2);
    var marginTopW = Math.floor((winHeight - 200) / 2);
    var marginLeftW = Math.floor((winWidth - 200) / 2);

    var div_links = '<div id="transparentLayer" style="display: none; opacity: 0.9; position: fixed; top: 0px; left: 0px; right: 0px; bottom: 0px; background-color: black; z-index: 5001;"></div>'
            + '<div id="container" style="display: none; position: fixed; top: ' + marginTop + 'px; left: ' + marginLeft + 'px; z-index: 6001">'
            + '<textarea id="clean_links" style="width:450px; height:300px; background-color:#D1C5C5; float:top;"></textarea>'
            + '<div id="message_links" style="width:450px; height:120px; float:bottom; color:silver;"></div>'
            + '</div>';

    var div_waiting = '<div id="transparentLayerWaiting"  style="display: none; opacity: 0.9; position: fixed; top: 0px; left: 0px; right: 0px; bottom: 0px; background-color: black; z-index: 3001;"></div>'
            + '<div id="containerWaiting" style="display: none; position: fixed; top: ' + marginTopW + 'px; left: ' + marginLeftW + 'px;  z-index: 4001">'
            + '<img src="http://i.imgur.com/uQqkT4p.png" title="absolutely">'
            + '</div>';

    $("body").append(div_links + img_endangered + div_waiting);

    var interval = window.setInterval(function () {
        if ($('#dirTree > .jqFT').length === 1 && $('#fileTree #sable').length === 1) {
            $('#dirTree').append('<textarea id="links-display" style="bottom: 10px; height: 150px; width: 95%; margin-top: 15px;"></textarea>');
            $('#links-display').click(function () {
                this.select();
            });
            $('#dirTree, #fileTree').bind('mousedown.namespace', function (e) {
                $(document).one('mouseup click', function () {
                    $('#links-display').val(createArrayLinks().join("\n"));
                    $(document).unbind('mousedown.namespace');
                    $('#links-display').select();
                });
            });
            window.clearInterval(interval);
        }
    }, 500);
}

// Show/hide containers method, Wally's and Show links functions setters
{
    $(document).mouseup(function (e) {
        var container_sel = $("#container");
        var container_tohide1 = $("#transparentLayer");
        var container_tohide2 = $("#container");
        if (container_sel.has(e.target).length === 0) {
            container_tohide1.hide();
            container_tohide2.hide();
        }
    });
}

// Setter for Dogbert's function
$('#img_endangered').click(function () {
    dogbert();
});