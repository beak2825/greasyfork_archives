// ==UserScript==
// @version       2.0.1
// @include       *.fanfiction.net/s/*
// @namespace     ffnet
// @name          Fanfiction.net story export script.
// @author        Alssn
// @description   Writes all chapters of the story on one page.
// @require		  http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @grant         GM.setClipboard
// @grant         GM_xmlhttpRequest
// @connect       fanfiction.net
// @downloadURL https://update.greasyfork.org/scripts/6272/Fanfictionnet%20story%20export%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/6272/Fanfictionnet%20story%20export%20script.meta.js
// ==/UserScript==

//Chapters are downloaded with a delay to prevent ff.net from limiting connections
var chapters=[];
var settings;

var style = $(`<style type='text/css'>
    .ffne {margin-left: 0.9em;}
    .ffne_action {padding-right: 8px; cursor:pointer;}
    .ffne .ffne_input {width: 40px; height: 1em;}
    .ffne label {display: inline;}
    .ffne_action:hover{}
    .ffne_toggle {text-decoration: underline 1px dotted;}
    #ffneSettingsContainer {width: 100%; text-align:center; margin-top: 4px;}
    #ffneSettingsContainer span {margin-left: 12px;}
    #ffne_export{ }
    #ffne_button{font-size:1.3em;cursor:pointer;line-height: 1em;padding-right: 7px;}
    .ffne_hidden{display:none;}
</style>`)

$('body').append(style);
loadSettings();

drawUI();


function drawUI(){
    var storyLength = getLength();
    var currentChapter = document.getElementById('chap_select').value;
    // creating links
    var node = $('.lc').first();
    var exportMenu = $('<span class="ffne"><span id="ffne_button" class="xcontrast_txt">fE</span></span>');
    var exportContainer = $('<span id="ffne_export"></span>');
    var addIndexButton = $('<span href="javascript:" class="ffne_action" title="Create table of contents">Index</span>');
    var expAllButton = $('<span href="javascript:" class="ffne_action" id="exportAllButton" title="Show the whole story on one page">Export</span>');
    var expButton = $('<span href="javascript:" class="ffne_action" title="Leave only raw text">Text</span>');
    var copyButton = $('<span href="javascript:" class="ffne_action" id="ffneCopyButton" title="Copy compiled text to the clipboard">Copy</span>');

    //Settings
    var settingsSection = $('<span class="ffne_settings"></span>');
    var settingsToggle = $('<span class="ffne_action ffne_toggle" id="ffneOptionsToggle" title="Click to toggle options display">Options</span>');
    var settingsContainer = $('<div class="ffne" id="ffneSettingsContainer"></div>');
    var settingsDelay = $('<span class="ffne_action" title="Request delay in milliseconds"><label for="ffneInputDelay">Delay&nbsp;</label><input type="text" id="ffneInputDelay" class="ffne_input" value="'+settings.delay+'"></span>');
    var headersSwitch = $(`<span class="ffne_action" title="Add headers when exporting"><input type="checkbox" id="ffneCheckboxHeaders" ${settings.addHeaders? "checked" : ""}><label for="ffneCheckboxHeaders">&nbsp;Add headers</label></span>`);
    var chapterSelection = $(`<span class="ffne_action" title="Chapter selection">
                <input type="checkbox" id="ffneCheckboxChapters" ${settings.limitChapters?"checked":""}>
                <label for="ffneCheckboxChapters">Limit chapters:</label>
                <input type="number" min="1" max="${storyLength}" class="ffne_input" id="ffneInputChapterStart" value="${currentChapter}"> -
                <input type="number" min="1" max="${storyLength}" class="ffne_input" id="ffneInputChapterEnd" value="${storyLength}">
    </span>`);
    settingsSection.append(settingsToggle);
    settingsContainer.append(headersSwitch, settingsDelay, chapterSelection);

    //Draw
    exportMenu.append(exportContainer);
    exportContainer.append(expAllButton,'|&nbsp;',addIndexButton,'|&nbsp;',expButton, copyButton,'|&nbsp;', settingsSection);
    node.append(exportMenu);
    settingsContainer.insertAfter(node.parent());

    //Event handlers
    var chaptersCheckbox = $('#ffneCheckboxChapters')[0];
    chaptersCheckbox.addEventListener('change',function(){setSetting('limitChapters',chaptersCheckbox.checked);});
    var headersCheckbox = $('#ffneCheckboxHeaders')[0];
    headersCheckbox.addEventListener('change',function(){setSetting('addHeaders',headersCheckbox.checked);});
    var delayInput = $('#ffneInputDelay')[0];
    delayInput.addEventListener('change',function(){setSetting('delay',delayInput.value);});
    expAllButton.click(exportStory);
    expButton.click(exportCh);
    settingsToggle.click(toggleSettingsDisplay);
    addIndexButton.click(addIndex);
    copyButton.click(copyText);
    $('#ffne_button').click(function(){
        var cont = $('#ffne_export');
        if (cont.hasClass('ffne_hidden')){cont.removeClass('ffne_hidden');}else{cont.addClass('ffne_hidden')}
    });

    showSettings(settings.displaySettings);
}


//Add table of contents
function addIndex(){
    var chapters = $('div[name="ffnee_chapter"]');
    var index = $('<div id="ffnee_index"><h2>Table of contents</h2></div>');
    var toC = $('<ol></ol>');
    index.append(toC);
    for (var i=0;i<chapters.length;i++){
        var item = $(chapters[i]); //chapter we are currently processing
        toC.append($('<li><a href="#'+item.attr('id')+'">'+item.attr('title')+'</a></li>'));
    }
    $('#storytext').prepend(index);
}
//adding headers, as entered by author
function addHeaders(){
    var chapters = document.getElementsByName('ffnee_chapter');
    for (var i=0;i<chapters.length;i++){
        var item = chapters.item(i); //chapter to which we are adding a header
        var header = document.createElement('p');
        header.innerHTML = '<h2>Chapter '+(i+1)+': '+item.getAttribute('title')+'</h2>';
        item.insertBefore(header,item.firstChild);
    }
}
function addTitle(){
    var titleText = $('b.xcontrast_txt','#profile_top').first().html();
    var title = $('<h1>'+titleText+'</h1>');
    var authorText = $('a.xcontrast_txt[href^="/u/"]','#profile_top').first().html();
    var author = $('<h2>'+authorText+'</h2>');
    var storytext = $('#storytext');
    storytext.prepend(title, author);
}
function exportCh(){
    document.body.innerHTML='<div style=\'padding-left:2em;padding-right:2em;padding-top:1em;\'>'+document.getElementById('storytextp').innerHTML+'</div>';
}
function copyText(){
    GM.setClipboard(document.getElementById('storytextp').innerText);
}
function exportStory(e){
    var limitChapters = document.getElementById('ffneCheckboxChapters').checked;
    var storyLength=getLength();
    if (storyLength == 1){
        expText.nodeValue = 'Oneshot';
        return;
    }
    let startChapter = 0;
    let endChapter = storyLength;
    if (limitChapters){
        startChapter = document.getElementById('ffneInputChapterStart').value-1;
        endChapter = Math.max(document.getElementById('ffneInputChapterEnd').value, startChapter+1);
    }
    exportChapters(e, startChapter, endChapter);
}

function exportChapters(e,start,end){
    // Main actions
    // Progress indicator
    settings.delay = document.getElementById('ffneInputDelay').value;
    var expDiv = document.getElementById('exportAllButton');
    var expText = expDiv.childNodes[0];
    var hr=location.href;
    var chapterNumIndex=hr.search(/\/\d{1,3}\//);
    //Getting number of chapters
    var storyLength = end-start;
    let i = start;
    var totalStoryLength = storyLength;//reference
    console.log('retrieving '+totalStoryLength+' chapters');
    console.log('start index is: '+(start+1)+', end is: '+end);
    setTimeout(function tick(){
        console.log(`Starting to load chapter ${i+1}`);
        loadChapter(i+1,function(response,num){
            console.log('Loaded chapter '+(num+1));
            chapters[num]=parseChapter(response, num+1);
            expText.nodeValue = 'Export: Chapter '+String(totalStoryLength-storyLength+1)+' out of '+totalStoryLength;
            storyLength--;
            if (storyLength==0){
                console.log(chapters);
                parseStory(chapters);
                expText.nodeValue='Story (again)';
            }
        });
        i++;
        if (i<end){
            setTimeout(tick, settings.delay);
        }
    }, settings.delay);

}
// Converting chapters' array into a whole;
function parseStory(chapters){
    var numCh= chapters.length;
    //document.body.innerHTML=chapters[0];
    var appendNode=document.getElementById('storytext');
    appendNode.innerHTML= '';
    var firstChapter=true;
    for (var i=0;i<numCh;i++){
        if (chapters[i]!=undefined){
            //findHeader(chapters[i]);  //smart header search
            var st=chapters[i];
            st.setAttribute('name','ffnee_chapter');
            st.setAttribute('id','ffnee_ch'+i);
            if (firstChapter){
                firstChapter=false;
            }else {
                st.style.marginTop='10em';
            }
            appendNode.appendChild(st);
        }
    }
    let headersEnabled = document.getElementById('ffneCheckboxHeaders').checked;
    if (headersEnabled){
        addHeaders();
    }
    addTitle();
}
function parseChapter(chapterHtml, chapterNumber){

    var t=document.createElement('div');
    t.innerHTML=chapterHtml;
    //extracting text only
    var ev='.//div[@id=\'storytext\']';
    var xpathResult = document.evaluate(ev,t,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    var chapterContent=document.createElement('div');
    const chapName = getChapterName(t);
    chapterContent.setAttribute('title',chapName);
    chapterContent.innerHTML = xpathResult.snapshotItem(0).innerHTML;
    console.log(`Parsing chapter ${chapterNumber}. Title: ${chapName}`);
    return chapterContent;
}
function getChapterName(obj){
    let select = obj.querySelector('#chap_select');
    return select.options[select.selectedIndex].innerHTML.split(/[. ]{2}/)[1];
}
//  Getting number of chapters;
function getLength(){
    var chNum = document.getElementById('chap_select');
    if (chNum==null){
        numChapters = 1;
    }else {
        var numChapters = chNum.getElementsByTagName('option').length;
    }
    return (numChapters);
}
function testReaponseHandler(){
    console.log(this.responseText);
}
// This function loads chapters and extracts chapter's number and title
function loadChapter(num,callback){
    var replStr='\/'+String(num)+'\/';
    var hr=location.href;
    var currentURL=hr.replace(/\/\d{1,3}\//,replStr);
    try{
        var req = new XMLHttpRequest();
        req.open('get',currentURL,true);
        req.onload= function(){
            callback(req.responseText,num-1);
        };
        req.send();
    }catch (e) {
        console.log(e);
    }
}

function toggleSettingsDisplay(){
    showSettings(!settings.displaySettings);
}

function showSettings(show){
    var settingsContainer = document.getElementById('ffneSettingsContainer');
    if (show){
        settingsContainer.classList.remove('ffne_hidden');
        document.getElementById('ffneOptionsToggle').textContent = "Hide options";
    }else{
        settingsContainer.classList.add('ffne_hidden');
        document.getElementById('ffneOptionsToggle').textContent = "Show options";
    }
    setSetting('displaySettings', show);
}

function loadSettings(){
    try{
        settings = JSON.parse(localStorage.ffneSettings);
        console.log("Loaded settings.", settings);
    }
    catch {
        console.log('[ffne] No settings detected. Creating');
        settings = {
            delay: 300,
            displaySettings: true
        };
        saveSettings();
    }
}

function saveSettings(){
    localStorage.ffneSettings = JSON.stringify(settings);
}

function setSetting(name, value){
    settings[name] = value;
    saveSettings();
}

