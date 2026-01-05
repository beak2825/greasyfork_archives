// ==UserScript==
// @name       RYM Classical Releases Editor
// @namespace  https://greasyfork.org/pl/users/11557
// @version    1.0
// @description  Script for more efficient classical releases editing on RYM
// @match      https://rateyourmusic.com/releases/ac?*
// @copyright  2012+, Kamil Orłowski
// @downloadURL https://update.greasyfork.org/scripts/9971/RYM%20Classical%20Releases%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/9971/RYM%20Classical%20Releases%20Editor.meta.js
// ==/UserScript==

var $worksXml, $composersXml, options;


function setWork(row, shortcut) {
    var trackTitle = $('#track_track_title' + row).val();
    if(trackTitle.lastIndexOf("[Work", 0) === 0) {
        var indexOfComma = trackTitle.indexOf(',') + 1;
        trackTitle = trackTitle.substr(indexOfComma,trackTitle.length-indexOfComma-1);  
    }
    $('#track_track_title' + row).val('[Work' + shortcut + ',' + trackTitle + ']');
}   

function showDropdowns() {
    $('.select_work').remove();

    $('.tracks tr').each(function(i) {
        if(i > 0) {
            var select = '<select class="select_work" id="select_' + i + '">' + options + '</select>';
            $(select).insertAfter($(this).find('td:eq(3)'));
        }
    });

    $('.select_work').change(function() {
        var row = parseInt($(this).attr('id').substr(7)) + 1;
        var shortcut = $(this).find(':selected').attr('value');

        setWork(row, shortcut);
        if($('#isMulti').prop('checked')) {
            $worksXml.find('work[id="' + shortcut + '"] part').each(function() {
                row++;
                var part = $(this).attr('id');
                setWork(row, part);
            });
        }
    });
}

function getComposers() {
    $.get('https://dl.dropboxusercontent.com/u/48631739/works/composers.xml', function(data) {
        $composersXml = $(data);
        var composers = "<option></option>";
        $composersXml.find('composer').each(function() {
            composers += '<option value="' +  $(this).attr("id") + '">' + $(this).attr("name") + "</option>";
        });
        $("#select_composer").html(composers);
    }, 'xml');
}

function loadWorks() {
    var composer = $("#select_composer").find(':selected').attr('value');
    console.log(composer);
    if(composer !== undefined) {
        var url = 'https://dl.dropboxusercontent.com/u/48631739/works/' + composer + '.xml';
        $.get(url, function(data) {
            $worksXml = $(data);
            options = "<option></option>";

            $worksXml.find('work').each(function() {
                options += '<option value="' + $(this).attr("id") + '">' + $(this).attr("op") + '|' + $(this).attr("name") + '</option>';
                var op = $(this).attr("op");
                $(this).find('part').each(function() {
                    options += '<option value="' + $(this).attr("id") + '">' + op + '.' + $(this).attr("no") + '|' + $(this).attr("name") + '</option>';
                });
            }); 

            showDropdowns();
        }, "xml");
    }
}

var but = '<a class="ratingbutton" id="loadworks"">Load Works</a>';
but += '<select id="select_composer"></select><br>';     
but += '<input type="checkbox" id="isMulti"> Auto-select parts';
but += '<a class="ratingbutton" id="resetdrop"">Reset drop-downs</a><br>';

$(but).insertAfter('#track_num');

getComposers();

$('#loadworks').click(loadWorks);
$('#resetdrop').click(showDropdowns);
$('table#tracks.tracks').width("2000px");