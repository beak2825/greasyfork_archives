// ==UserScript==
// @name           Danbooru Ajax Interface
// @namespace      http://danbooru.donmai.us
// @description    New interface to search images on Booru-style sites.
// @match          *://danbooru.donmai.us/
// @match          *://danbooru.donmai.us/#*
// @match          *://*.gelbooru.com/
// @match          *://*.gelbooru.com/#*
// @match          *://konachan.com/
// @match          *://konachan.com/#*
// @match          *://konachan.net/
// @match          *://konachan.net/#*
// @match          *://yande.re/post
// @match          *://yande.re/post#*
// @version        4.6692016
// @grant          GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/5851/Danbooru%20Ajax%20Interface.user.js
// @updateURL https://update.greasyfork.org/scripts/5851/Danbooru%20Ajax%20Interface.meta.js
// ==/UserScript==

// NEW SITES CAN BE ADDED NOW
var sites = [
    {
        name    :   "Danbooru",                                 // Site name
        site    :   "donmai\.us",                               // Regular expression check on current url
        post    :   "/posts.xml",                               // Relative url to xml post API
        note    :   "/notes.xml",                               // Relative url to xml note API
        list    :   "/posts/",                                  // Relative url to post listing
        page    :   "/posts/",                                  // Relative url to post page
        query   :   function(tags, images, page, postid) {      // Query passed to API
                        return (postid ? "?limit=99999&search[is_active]=true&search[post_id]=" + postid : "?tags=" + tags + (page ? "&page=" + page + "&limit=" + images : ""));
                    }
    },
    {
        name    :   "Gelbooru",
        site    :   "(www\.)?gelbooru\.",
        post    :   "/index.php?page=dapi&s=post&q=index",
        note    :   "/index.php?page=dapi&s=note&q=index&post_id=",
        list    :   "/index.php?page=post&s=list",
        page    :   "/index.php?page=post&s=view&id=",
        query   :   function(tags, images, page, postid) {
                        return (postid ? postid : "&tags=" + tags + "&limit=" + images + "&pid=" + (page - 1));
                    }
    },
    {
        name    :   "Konachan",
        site    :   "konachan\.",
        post    :   "/post.xml",
        note    :   "/note.xml?post_id=",
        list    :   "/post/",
        page    :   "/post/show/",
        query   :   function(tags, images, page, postid) {
                        return (postid ? postid : "?tags=" + tags + "&limit=" + images + "&page=" + page);
                    }
    },
    {
        name    :   "Yande.re",
        site    :   "yande\.re",
        post    :   "/post.xml",
        note    :   "/note.xml?post_id=",
        list    :   "/post/",
        page    :   "/post/show/",
        query   :   function(tags, images, page, postid) {
                        return (postid ? postid : "?tags=" + tags + "&limit=" + images + "&page=" + page);
                    }
    }
];

// CONSTANTS
const ratio = ((1 + Math.sqrt(5)) / 2);
const d = document;
const cacheExpires = 1000 * 60 * 60 * 24 * 7; // cache expires in 7 days : (ms * s * m * h * d)

// PAGE CLEANING
while(d.documentElement.firstChild)
    d.documentElement.removeChild(d.documentElement.firstChild);

// IMPORTANT VARIABLES
var booru, storage, requestPost, requestNote, requestCount, requestCache, requestTag, reqTagTimer, tagTimer, noteclearTimer, content;
var tags = "", images = 20, page = 1, rating = "s", sampleRate = 1, blacklist = "spoilers \nguro \nscat ";
var cacheHide = [], cacheID = [], cacheTags = [];
var domParser = new DOMParser();
var xsltText = "<xsl:stylesheet version='1.0' xmlns:xsl='http://www.w3.org/1999/XSL/Transform'><xsl:template match='*'><xsl:copy><xsl:for-each select='*|@*'><xsl:copy><xsl:for-each select='*|@*'><xsl:attribute name='{name()}'><xsl:value-of select='.|text()'/><xsl:if test='@nil'>false</xsl:if></xsl:attribute></xsl:for-each></xsl:copy></xsl:for-each></xsl:copy></xsl:template></xsl:stylesheet>";

for(var i = 0; i < sites.length; i++)
    if(new RegExp(sites[i].site).test(window.location.hostname))
        booru = sites[i];

if(checkStorage()) {
    getStorage();
    window.addEventListener("unload", setStorage); // save last search when page is changed/closed
}

// SCRIPT STARTS HERE
d.documentElement.appendChild(d.createElement("HEAD"));
d.documentElement.appendChild(d.createElement("BODY"));
d.documentElement.firstChild.appendChild(title = d.createElement("TITLE"));
title.appendChild(d.createTextNode(booru.name));

var fa = d.createElement("LINK");
fa.setAttribute("rel", "stylesheet");
fa.setAttribute("href", "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css");
d.head.appendChild(fa);

var dai_css = d.createElement("STYLE");
dai_css.setAttribute("type", "text/css");
dai_css.appendChild(d.createTextNode("body { margin: 4px; } a { text-decoration: none; color: #0000EE; } img { border: 0px; } .thumb { border: 1px solid WhiteSmoke; min-width: 150px; min-height: 150px; max-width: 150px; max-height: 150px; margin: -1px 0px 0px -1px; padding: 1px; display: flex; justify-content: center; align-items: center; font-size: small; overflow: hidden; } .yellow { background-color: LightYellow; } .red { background-color: MistyRose; } .trans { border: 1px solid Black; background-color: LightYellow; position: absolute; } *:not(body) { transition: all 2s ease-in-out 0s; }"));

d.body.appendChild(searchTable = d.createElement("TABLE"));
searchTable.appendChild(searchTr = d.createElement("TR"));
searchTr.setAttribute("style", "vertical-align: top;");
searchTr.appendChild(searchTd = d.createElement("TD"));
searchTd.setAttribute("style", "text-align: center;");

searchForm = d.createElement("FORM");
searchForm.addEventListener("submit", function(event) {
    tags = aTags.value;
    page = Math.max(1, parseInt(aPage.value, 10));
    images = Math.max(1, Math.min(parseInt(aImages.value, 10), 200));
    rating = (aRS.checked ? "s" : "") + (aRQ.checked ? "q" : "") + (aRE.checked ? "e" : "") + (aFIT.checked ? "f" : "") + (aSD && aSD.checked ? "d" : "");
    search(tags, page);
    event.preventDefault();
}, false);

searchForm.appendChild(aLink = d.createElement("A"));
aLink.setAttribute("href", booru.list);
aLink.setAttribute("tabindex", "1");
aLink.appendChild(d.createTextNode(booru.name));

searchForm.appendChild(d.createElement("BR"));

searchForm.appendChild(aTags = d.createElement("INPUT"));
aTags.setAttribute("type", "text");
aTags.setAttribute("style", "width: 80%");
aTags.setAttribute("value", tags);
aTags.setAttribute("tabindex", "2");
aTags.setAttribute("list", "autocomplete");
aTags.addEventListener("change", function(event) {
    aPage.value = 1;
}, false);

searchForm.appendChild(aDatalist = d.createElement("DATALIST"));
aDatalist.setAttribute("id", "autocomplete");
if(cacheTags.length == 0) {
    popularTags = "touhou kantai_collection idolmaster vocaloid fate_(series) mahou_shoujo_madoka_magica".split(" ").reverse();
    for(var i in popularTags) {
        cacheTags.push({ tag : popularTags[i], expires : Date.now() + cacheExpires });
    }
}
for(var i = cacheTags.length - 1; i >= Math.max(cacheTags.length - 6, 0); i--) { // last 6 added values first
    var tagoption = d.createElement("OPTION");
    tagoption.setAttribute("value", cacheTags[i].tag + " ");
    aDatalist.appendChild(tagoption);
}

aTags.addEventListener("input", function(e) {
    clearTimeout(tagTimer);
    clearTimeout(reqTagTimer);
    if(requestTag)
        requestTag.abort();
    tagTimer = setTimeout(function() {
        lookuptag = aTags.value.split(" ").pop();
        if(!lookuptag)
            return;
        taglist = aTags.value.split(" ");
        taglist.pop();
        taglist = taglist.join(" ");
        if(taglist.length > 0)
            taglist += " ";

        while(aDatalist.hasChildNodes())
            aDatalist.removeChild(aDatalist.firstChild);
        aDL = d.createElement("DATALIST"); // adding new datalist to main datalist updates the main list contents
        for(var a = cacheTags.length - 1; a >= 0 && aDL.childNodes.length < 6; a--) {
            if(cacheTags[a] && cacheTags[a].tag.toLowerCase().startsWith(lookuptag.toLowerCase())) {
                aOptionTag = d.createElement("OPTION");
                aOptionTag.setAttribute("value", cacheTags[a].tag ? taglist + cacheTags[a].tag + " " : "");
                aDL.appendChild(aOptionTag);
            }
        }
        aDatalist.appendChild(aDL);
        aTags.focus();
    }, 10);
    if(booru.name != "Danbooru")
      return;
    reqTagTimer = setTimeout(function() {
        lookuptag = aTags.value.split(" ").pop();
        if(!lookuptag)
            return;
        requestTag = xmlhttpRequest({
            method : "GET",
            url : window.location.origin + "/tags.xml?search[hide_empty]=yes&search[order]=count&search[name_matches]=" + lookuptag + "*",
            headers : {
                "Accept" : "application/xml"
            },
            overrideMimeType : "application/xml; charset=utf-8",
            onload : function(response) {
                xmldoc = domParser.parseFromString(response.responseText, "application/xml");
                atags = xmldoc.evaluate("tags/tag/name", xmldoc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

                taglist = aTags.value.split(" ");
                taglist.pop();
                taglist = taglist.join(" ");
                if(taglist.length > 0)
                    taglist += " ";
                if(atags.snapshotItem(0))
                    while(aDatalist.hasChildNodes())
                        aDatalist.removeChild(aDatalist.firstChild);
                aDL = d.createElement("DATALIST"); // adding new datalist to main datalist updates the main list contents
                for(var a = 0; a < 6; a++) {
                    atag = atags.snapshotItem(a);
                    aOptionTag = d.createElement("OPTION");
                    aOptionTag.setAttribute("value", atag ? taglist + atag.textContent + " " : "");
                    aDL.appendChild(aOptionTag);
                }
                aDatalist.appendChild(aDL);
                aTags.focus();
            }
        });
    }, 3000);
}, false);

searchForm.appendChild(d.createTextNode(" "));
searchForm.appendChild(aBlacklink = d.createElement("A"));
aBlacklink.setAttribute("href", "#");
aBlacklink.setAttribute("style", "color: red; float: right");
aBlacklink.setAttribute("title", "Blacklist");
aBlacklink.appendChild(d.createTextNode("[B]"));
aBlacklink.addEventListener("click", function(e) {
    if(aBlacklist.style.getPropertyValue("opacity") == "0") {
        aBlacklist.style.setProperty("height", "15em", "");
        aBlacklist.style.setProperty("opacity", "1", "");
    } else {
        aBlacklist.style.setProperty("height", "0em", "");
        aBlacklist.style.setProperty("opacity", "0", "");
    }
}, false);

searchForm.appendChild(d.createElement("BR"));
searchForm.appendChild(aBlacklist = d.createElement("TEXTAREA"));
aBlacklist.setAttribute("style", "box-sizing: border-box; height: 0em; min-width: 100%; opacity: 0");
aBlacklist.appendChild(d.createTextNode(blacklist));

searchForm.appendChild(d.createElement("BR"));
searchForm.appendChild(aReply = d.createElement("SPAN"));
aReply.appendChild(d.createTextNode("Nobody here but us chickens!"));

searchForm.appendChild(d.createElement("P"));

// Slider
aTableBar = d.createElement("TABLE");
aTableBar.appendChild(d.createElement("TR"));
aTableBar.setAttribute("style", "border-collapse: collapse; border: 1px solid Black; width: 100%; padding: 0px");
aLeftBar = d.createElement("TD");
aLeftBar.setAttribute("style", "padding: 0px;");
aTableBar.firstChild.appendChild(aLeftBar);
aCenterBar = d.createElement("TD");
aCenterBar.setAttribute("style", "border: 1px solid Black; padding: 1.5px 0px; background-color: WhiteSmoke; width: 25%; min-width: 1px;");
aTableBar.firstChild.appendChild(aCenterBar);
aRightBar = d.createElement("TD");
aRightBar.setAttribute("style", "padding: 0px; width: 100%;");
aTableBar.firstChild.appendChild(aRightBar);
searchForm.appendChild(aTableBar);

// Search options
aTable = d.createElement("TABLE");
aTr1 = d.createElement("TR");

aTd1 = d.createElement("TD");
aTd1.appendChild(d.createTextNode("Page:"));
aTr1.appendChild(aTd1);

aTd2 = d.createElement("TD");
aPage = d.createElement("INPUT");
aPage.setAttribute("type", "text");
aPage.setAttribute("size", "1");
aPage.setAttribute("value", page);
aPage.setAttribute("tabindex", "3");
aTd2.appendChild(aPage);
aTr1.appendChild(aTd2);

aTd3 = d.createElement("TD");
aTd3.setAttribute("style", "text-align: left;");
aTd3.setAttribute("rowspan", "3");

aRS = d.createElement("INPUT");
aRS.setAttribute("type", "checkbox");
if(/s/.test(rating))
    aRS.setAttribute("checked", "checked");
aLS = d.createElement("LABEL");
aLS.appendChild(aRS);
aLS.appendChild(d.createTextNode("Safe"));

aTd3.appendChild(aLS);
aTd3.appendChild(d.createElement("BR"));

aRQ = d.createElement("INPUT");
aRQ.setAttribute("type", "checkbox");
if(/q/.test(rating))
    aRQ.setAttribute("checked", "checked");
aLQ = d.createElement("LABEL");
aLQ.appendChild(aRQ);
aLQ.appendChild(d.createTextNode("Questionable"));

aTd3.appendChild(aLQ);
aTd3.appendChild(d.createElement("BR"));

aRE = d.createElement("INPUT");
aRE.setAttribute("type", "checkbox");
if(/e/.test(rating))
    aRE.setAttribute("checked", "checked");
aLE = d.createElement("LABEL");
aLE.appendChild(aRE);
aLE.appendChild(d.createTextNode("Explicit"));

aTd3.appendChild(aLE);
aTd3.appendChild(d.createElement("BR"));

aSD = d.createElement("INPUT");
if(booru.name == "Danbooru") {
    aSD.setAttribute("type", "checkbox");
    if(/d/.test(rating))
        aSD.setAttribute("checked", "checked");
    aLD = d.createElement("LABEL");
    aLD.appendChild(aSD);
    aLD.appendChild(d.createTextNode("Show deleted"));

    aTd3.appendChild(aLD);
    aTd3.appendChild(d.createElement("BR"));

    aSD.addEventListener("change", function(event) {
        for(var i in cacheHide)
            content.insertBefore(cacheHide[i], content.childNodes[cacheHide[i].style.getPropertyValue("order")]);

        setTimeout(function() { // transitions are stupid
            deletedlist = d.evaluate("//DIV[contains(@class, 'red')]", d, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
            if(aSD.checked) {
                for(var n = 0, deleted = null; deleted = deletedlist.snapshotItem(n++); n) {
                    deleted.style.setProperty("opacity", "1", "");
                    deleted.style.setProperty("padding", "1px", "");
                    deleted.style.setProperty("margin", "-1px 0px 0px -1px", "");
                    deleted.style.setProperty("border-width", "1px", "");
                    deleted.style.setProperty("min-width", "150px", "");
                    deleted.style.setProperty("max-width", "150px", "");
                }
            } else {
                cacheHide.length = 0;
                for(var n = 0, deleted = null; deleted = deletedlist.snapshotItem(n++); n) {
                    deleted.style.setProperty("opacity", "0", "");
                    deleted.style.setProperty("padding", "0px", "");
                    deleted.style.setProperty("margin", "0px", "");
                    deleted.style.setProperty("border-width", "0px", "");
                    deleted.style.setProperty("min-width", "0px", "");
                    deleted.style.setProperty("max-width", "0px", "");
                    cacheHide.push(deleted);
                }
            }
        }, 25);
    }, false);
} else {
    rating.replace("d", "");
}
aTr1.appendChild(aTd3);

aTr2 = d.createElement("TR");

aTd4 = d.createElement("TD");
aTd4.appendChild(d.createTextNode("Images:"));
aTr2.appendChild(aTd4);

aTd5 = d.createElement("TD");
aImages = d.createElement("INPUT");
aImages.setAttribute("type", "text");
aImages.setAttribute("size", "1");
aImages.setAttribute("value", images);
aImages.setAttribute("tabindex", "4");
aTd5.appendChild(aImages);
aTr2.appendChild(aTd5);

aTr3 = d.createElement("TR");

aTd6 = d.createElement("TD");
aTd6.setAttribute("colspan", "2");
aFIT = d.createElement("INPUT");
aFIT.setAttribute("type", "checkbox");
aFIT.setAttribute("tabindex", "5");
if(/f/.test(rating))
    aFIT.setAttribute("checked", "checked");
aLF = d.createElement("LABEL");
aLF.appendChild(aFIT);
aLF.appendChild(d.createTextNode("Fit width"));

aTd6.appendChild(aLF);
aTr3.appendChild(aTd6);

aTable.appendChild(aTr1);
aTable.appendChild(aTr2);
aTable.appendChild(aTr3);
searchForm.appendChild(aTable);

searchForm.appendChild(d.createElement("HR"));

searchForm.appendChild(aPrev = d.createElement("INPUT"));
aPrev.setAttribute("type", "button");
aPrev.setAttribute("value", "<");
aPrev.setAttribute("disabled", "disabled");
aPrev.addEventListener("click", function(event) {
    search(tags, --page);
}, false);

searchForm.appendChild(aSearch = d.createElement("INPUT"));
aSearch.setAttribute("type", "submit");
aSearch.setAttribute("value", "Search");

searchForm.appendChild(aNext = d.createElement("INPUT"));
aNext.setAttribute("type", "button");
aNext.setAttribute("value", ">");
aNext.setAttribute("disabled", "disabled");
aNext.addEventListener("click", function(event) {
    search(tags, ++page);
}, false);

searchForm.appendChild(d.createElement("HR"));

searchForm.appendChild(aTagsDisplay = d.createElement("DIV"));
aTagsDisplay.setAttribute("style", "overflow-x: hidden; overflow-wrap: break-word;");

searchTd.appendChild(searchForm);
searchTr.appendChild(imagesLayer = d.createElement("TD"));

fixsize = (searchTd.getBoundingClientRect().right - searchTd.getBoundingClientRect().left) + "px";
searchTd.style.setProperty("min-width", fixsize, "important");
searchTd.style.setProperty("max-width", fixsize, "important");

// "Lightbox"
overlay = d.createElement("DIV");
overlay.setAttribute("style", "display: none; position: fixed; top: 0px; left: 0px; width: 100%; height: 100%; background-color: Black; opacity: 0.8;");
innerDisplay = d.createElement("DIV");
innerDisplay.setAttribute("id", "innerDisplay");
innerDisplay.setAttribute("style", "background-color: White; display: inline-table; padding: 10px; min-width: 200px; min-height: 200px; border-radius: 10px; margin: auto;");
display = d.createElement("DIV");
display.setAttribute("style", "display: none; position: fixed; top: 0px; left: 0px; width: 100%; height: 100%; text-align: center; justify-content: space-between; overflow: auto;");
display.appendChild(innerDisplay);

prevImage = d.createElement("DIV");
prevImage.setAttribute("id", "prevImage");
prevImage.setAttribute("style", "display: flex; justify-content: center; align-items: center; position: fixed; top: 0px; left: 0px; background-image: linear-gradient(to right, Black, Transparent); color: White; font-size: xx-large; width: 30px; height: 100%; opacity: 0;");
prevImage.setAttribute("class", "fa fa-chevron-left");

nextImage = d.createElement("DIV");
nextImage.setAttribute("id", "nextImage");
nextImage.setAttribute("style", "display: flex; justify-content: center; align-items: center; position: fixed; top: 0px; right: 0px; background-image: linear-gradient(to left, Black, Transparent); color: White; font-size: xx-large; width: 30px; height: 100%; opacity: 0;");
nextImage.setAttribute("class", "fa fa-chevron-right");

d.body.insertBefore(display, d.body.firstChild);
d.body.insertBefore(overlay, d.body.firstChild);

prevImage.addEventListener("click", function(e) {
    next = openimage.parentNode.previousElementSibling || openimage.parentNode.parentNode.lastChild;
    next.firstChild.firstChild.dispatchEvent(new MouseEvent("click", { "bubbles" : true, "cancelable": true }));
}, false);
prevImage.addEventListener("mouseover", function(e) {
    prevImage.style.setProperty("opacity", "1", "");
}, false);
prevImage.addEventListener("mouseout", function(e) {
    prevImage.style.setProperty("opacity", "0", "");
}, false);

nextImage.addEventListener("click", function(e) {
    next = openimage.parentNode.nextElementSibling || openimage.parentNode.parentNode.firstChild;
    next.firstChild.firstChild.dispatchEvent(new MouseEvent("click", { "bubbles" : true, "cancelable": true }));
}, false);
nextImage.addEventListener("mouseover", function(e) {
    nextImage.style.setProperty("opacity", "1", "");
}, false);
nextImage.addEventListener("mouseout", function(e) {
    nextImage.style.setProperty("opacity", "0", "");
}, false);

display.addEventListener("click", function(e) {
    if(e.target.id || d.evaluate("ancestor-or-self::div[contains(@id, 'bodynote')]", e.target, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue)
        return;
    d.body.style.setProperty("overflow", "auto", "");
    overlay.style.setProperty("display", "none", "");
    display.style.setProperty("display", "none", "");
    while(innerDisplay.hasChildNodes())
        innerDisplay.removeChild(innerDisplay.firstChild);
}, false);

display.addEventListener("dblclick", function(e) {
    d.body.style.setProperty("overflow", "auto", "");
    overlay.style.setProperty("display", "none", "");
    display.style.setProperty("display", "none", "");
    while(innerDisplay.hasChildNodes())
        innerDisplay.removeChild(innerDisplay.firstChild);
}, false);

// CTRL+S to save image
var keylistener = function(event) {
    if(display.style.getPropertyValue("display") == "none")
        return
    else
    if(event.ctrlKey && event.keyCode == 83) { // CTRL+S
        event.preventDefault();
        event.stopPropagation();
    } else
    if(aFIT.checked && event.keyCode == 37) { // LEFT KEY
        next = openimage.parentNode.previousElementSibling || openimage.parentNode.parentNode.lastChild;
        next.firstChild.firstChild.dispatchEvent(new MouseEvent("click", { "bubbles" : true, "cancelable": true }));
    } else
    if(aFIT.checked && event.keyCode == 39) { // RIGHT KEY
        next = openimage.parentNode.nextElementSibling || openimage.parentNode.parentNode.firstChild;
        next.firstChild.firstChild.dispatchEvent(new MouseEvent("click", { "bubbles" : true, "cancelable": true }));
    }
};
var saveimage = function(event) {
    if(event.ctrlKey && event.keyCode == 83) { // CTRL+S
        var sauce = openimage.href.match(/[^\/]+$/)[0];
        if(/%/.test(sauce))
            sauce = decodeURIComponent(sauce);
        var imgdown = d.createElement("A");
        imgdown.setAttribute("download", sauce);
        imgdown.setAttribute("href", openimage.href);
        d.body.appendChild(imgdown);
        imgdown.dispatchEvent(new MouseEvent("click"));
        imgdown.remove();
    }
};
window.addEventListener("keydown", keylistener, false);
window.addEventListener("keyup", saveimage, false);

if(!window.location.origin)
    window.location.origin = (window.location.protocol + "//" + window.location.host);

if(window.location.hash)
    search(window.location.hash.split("#")[1], 1);

function search(newtags, newpage) {
    if(requestPost)
        requestPost.abort();
    if(requestNote)
        requestNote.abort();
    if(requestCount)
        requestCount.abort();
    if(requestCache)
        requestCache.abort();
    if(requestTag)
        requestTag.abort();

    clearTimeout(tagTimer);
    clearTimeout(reqTagTimer);

    aTags.value = tags = newtags;
    aPage.value = page = newpage;
    aImages.value = images;
    blacklist = aBlacklist.value.trim();

    aPrev.disabled = (newpage < 2);
    aRS.checked = /s/.test(rating);
    aRQ.checked = /q/.test(rating);
    aRE.checked = /e/.test(rating);

    if(/^s(?!q|e)/.test(rating))
        newtags += " rating:safe";
    if(/^q(?!e)/.test(rating))
        newtags += " rating:questionable";
    if(/^e/.test(rating))
        newtags += " rating:explicit";
    if(/^qe/.test(rating))
        newtags += " -rating:safe";
    if(/^se/.test(rating))
        newtags += " -rating:questionable";
    if(/^sq(?!e)/.test(rating))
        newtags += " -rating:explicit";

    if(imagesLayer.hasChildNodes())
        imagesLayer.removeChild(imagesLayer.firstChild);
    while(aDatalist.hasChildNodes())
        aDatalist.removeChild(aDatalist.firstChild);

    imagesLayer.appendChild(d.createTextNode("Loading..."));
    requestPost = xmlhttpRequest({
        method : "GET",
        url : window.location.origin + booru.post + booru.query(encodeURIComponent(newtags.trim()), images, page),
        headers : {
            "Accept" : "application/xml"
        },
        overrideMimeType : "application/xml; charset=utf-8",
        onload : function(response) {
            getContent(domParser.parseFromString(response.responseText, "application/xml"), newtags);
        }
    });
    saveValues();
}

function showContent(xmldoc) {
    if(imagesLayer.hasChildNodes())
        imagesLayer.removeChild(imagesLayer.firstChild);

    aReply.textContent = "Nobody here but us chickens!";

    var posts = xmldoc.evaluate("posts", xmldoc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if(!posts) {
        reason = xmldoc.evaluate("response/@reason | result/text()", xmldoc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if(reason)
            imagesLayer.textContent = reason.nodeValue;
        else
            imagesLayer.textContent = "Something broke.";
        return;
    }
    var post = xmldoc.evaluate("posts/post", xmldoc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    if(((parseInt(posts.getAttribute("offset"), 10) + 1) > posts.getAttribute("count")) & posts.getAttribute("count") > 0) {
        search(tags, Math.ceil(parseInt(posts.getAttribute("count"), 10) / images));
        return;
    }

    if(posts.getAttribute("count") > 0)
        aReply.textContent = "Found " + posts.getAttribute("count") + ", showing " + (parseInt(posts.getAttribute("offset"), 10) + 1) + "-" + (Math.min(posts.getAttribute("count"), parseInt(posts.getAttribute("offset"), 10) + parseInt(images, 10)));
    aLeftBar.style.setProperty("width", (posts.getAttribute("offset") / posts.getAttribute("count") * 100) + "%");
    aCenterBar.style.setProperty("width", (images / posts.getAttribute("count") * 100) + "%");

    aNext.disabled = (page >= Math.ceil(posts.getAttribute("count") / images));

    imagesLayer.appendChild(content = d.createElement("DIV"));
    content.setAttribute("style", "display: flex; flex-flow: row wrap;");
    content.setAttribute("id", "content");
    cacheHide.length = 0;

    for(var i = 0; i < images; i++) {
        data = post.snapshotItem(i);
        if(data) {
            if(!data.getAttribute("preview-file-url") && booru.name == "Danbooru")
                if(!checkCache(data))
                    continue;
            content.appendChild(thumb = d.createElement("DIV"));
            if(!!data.getAttribute("last-noted-at") && data.getAttribute("last-noted-at") != "false")
                data.setAttribute("has_notes", "true");
            var image = d.createElement("IMG");
            image.setAttribute("src", data.getAttribute("preview_url") || data.getAttribute("preview-file-url"));
            image.setAttribute("id", data.getAttribute("id"));
            image.setAttribute("alt", data.getAttribute("tag-string") || domParser.parseFromString(data.getAttribute("tags").trim(), "text/html").documentElement.textContent);
            image.setAttribute("title", image.getAttribute("alt") + " rating:" + data.getAttribute("rating").replace(/^e$/, "Explicit").replace(/s$/, "Safe").replace(/q$/, "Questionable") + " score:" + data.getAttribute("score"));

            if(/\.zip$/.test(data.getAttribute("file_url")) || /\.zip$/.test(data.getAttribute("file-url"))) {
                data.setAttribute("file_url", (data.getAttribute("preview_url") || data.getAttribute("file-url")).replace("preview/", "sample/sample-").replace("data/", "data/sample/sample-").replace(".zip", ".webm"));
                data.setAttribute("file-url", data.getAttribute("file_url"));
            }
            image.setAttribute("fullsize", data.getAttribute("file_url") || data.getAttribute("file-url"));
            image.setAttribute("fullwidth", data.getAttribute("width") || data.getAttribute("image-width"));
            image.setAttribute("fullheight", data.getAttribute("height") || data.getAttribute("image-height"));
            image.setAttribute("notes", data.getAttribute("has_notes"));
            if(data.getAttribute("last_noted_at"))
                image.setAttribute("notes", "true");
            image.setAttribute("md5", data.getAttribute("md5"));

            // Show tags on sidebar
            image.addEventListener("click", function(event) {
                if(aTagsDisplay.hasChildNodes())
                    aTagsDisplay.removeChild(aTagsDisplay.firstChild);
                aTagsDisplay.appendChild(d.createElement("DIV"));

                var tagnames = this.getAttribute("alt").split(" ");
                for(var t = 0; t < tagnames.length; t++) {
                    var taglink = d.createElement("A");
                    taglink.appendChild(d.createTextNode(tagnames[t]));
                    taglink.setAttribute("href", "#" + tagnames[t]);
                    taglink.addEventListener("click", function(event) {
                        aTags.value = event.target.textContent;
                        aPage.value = 1;
                        aSearch.dispatchEvent(new MouseEvent("click"));
                        event.preventDefault();
                    }, false);
                    aTagsDisplay.firstChild.appendChild(taglink);
                    aTagsDisplay.firstChild.appendChild(document.createElement("BR"));
                }

                // CTRL + click to show only the tags
                if(event.ctrlKey)
                    return;

                // "Lightbox" by VIPPER ("How do I jQuery?")
                while(innerDisplay.hasChildNodes())
                    innerDisplay.removeChild(innerDisplay.firstChild);

                innerDisplay.appendChild(prevImage);
                innerDisplay.appendChild(nextImage);

                if(/\.swf$/.test(this.getAttribute("fullsize")))
                    fullsize = d.createElement("EMBED");
                else if(/\.webm$|\.zip$|\.mp4$/.test(this.getAttribute("fullsize"))) {
                    fullsize = d.createElement("VIDEO");
                    fullsize.setAttribute("controls", true);
                    fullsize.setAttribute("loop", true);
                    fullsize.setAttribute("autoplay", true);
                    if(/\.zip$/.test(this.getAttribute("fullsize")))
                        this.setAttribute("fullsize", this.getAttribute("fullsize").replace("data/", "data/sample/sample-").replace(".zip", ".webm"));
                } else {
                    fullsize = d.createElement("IMG");
                    fullsize.addEventListener("click", function(event) {
                        noteDivs = d.evaluate("./DIV[starts-with(@id, 'note')]", innerDisplay, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                        for(var n = 0, note = null; note = noteDivs.snapshotItem(n++); n) {
                            if(note.style.getPropertyValue("visibility") == "visible")
                                note.style.setProperty("visibility", "hidden", "");
                            else
                                note.style.setProperty("visibility", "visible", "");
                        }
                    }, false);
                }
                fullsize.setAttribute("src", this.getAttribute("fullsize"));
                fullsize.setAttribute("width", this.getAttribute("fullwidth"));
                fullsize.setAttribute("height", this.getAttribute("fullheight"));
                fullsize.setAttribute("id", this.getAttribute("id"));
                fullsize.setAttribute("notes", this.getAttribute("notes"));
                fullsize.setAttribute("md5", this.getAttribute("md5"));
                fullsize.style.setProperty("transition-property", "none", "");

                var pagelink = d.createElement("A");
                pagelink.setAttribute("href", booru.page + fullsize.getAttribute("id") + "?tags=" + encodeURIComponent(tags.trim()));
                pagelink.appendChild(d.createTextNode(fullsize.getAttribute("id")));

                innerDisplay.appendChild(fullsize);
                innerDisplay.appendChild(d.createElement("BR"));
                innerDisplay.appendChild(pagelink);

                overlay.style.setProperty("display", "", "");
                display.style.setProperty("display", "flex", "");
                display.scrollTo(0, 0);
                d.body.style.setProperty("overflow", "hidden", "");

                sampleRate = 1;
                clientH = parseInt(document.documentElement.clientHeight, 10);
                clientW = Math.min(parseInt(document.documentElement.clientWidth, 10), parseInt(document.body.clientWidth, 10)) - 20;

                if(aFIT.checked && this.getAttribute("fullwidth") > clientW) {
                    if(parseInt(this.getAttribute("fullheight"), 10) + 40 > clientH) {
                        sampleRate = (document.documentElement.clientWidth - (window.outerWidth - window.innerWidth) - 21) / this.getAttribute("fullwidth");
                    } else {
                        sampleRate = (document.documentElement.clientWidth - 20) / this.getAttribute("fullwidth");
                    }
                    fullsize.setAttribute("width", this.getAttribute("fullwidth") * sampleRate + "px"); // 100%
                    fullsize.setAttribute("height", this.getAttribute("fullheight") * sampleRate + "px"); // auto
                }
                nextImage.style.setProperty("right", (display.scrollHeight > clientH ? (window.outerWidth - window.innerWidth + 1) : 0) + "px");

                if(this.getAttribute("notes") == "true")
                    //fullsize.addEventListener("load", function(e) {
                        requestNote = xmlhttpRequest({
                            method : "GET",
                            url : window.location.origin + booru.note + booru.query(null, null, null, fullsize.getAttribute("id")),
                            headers : {
                                "Accept" : "application/xml"
                            },
                            overrideMimeType : "application/xml; charset=utf-8",
                            onload : function(response) {
                                getNotes(domParser.parseFromString(response.responseText, "application/xml"), response.responseURL);
                            }
                        });
                    //}, false);
            }, false);

            var link = d.createElement("A");
            link.setAttribute("href", data.getAttribute("file_url") || data.getAttribute("file-url"));
            link.setAttribute("alt", data.getAttribute("id"));
            link.appendChild(image);
            link.addEventListener("click", function(event) {
                openimage = event.target.parentNode;
                // preload next images
                new Image().setAttribute("src", (openimage.parentNode.nextElementSibling || openimage.parentNode.parentNode.firstChild).firstChild.href);
                new Image().setAttribute("src", (openimage.parentNode.previousElementSibling || openimage.parentNode.parentNode.lastChild).firstChild.href);
                event.preventDefault();
            }, false);

            thumb.classList.add("thumb");
            if(booru.name == "Danbooru")
                thumb.style.setProperty("order", i, "");
            thumb.appendChild(link);
            if(/true/.test(data.getAttribute("has_notes")))
                thumb.classList.add("yellow");
            if(/deleted/.test(data.getAttribute("status")) || /true/.test(data.getAttribute("is-deleted"))) {
                thumb.classList.add("red");
                thumb.addEventListener("transitionend", function() {
                    if(!aSD.checked)
                        this.remove();
                }, false);
                if(!aSD.checked) {
                    thumb.style.setProperty("opacity", "0", "");
                    thumb.style.setProperty("padding", "0", "");
                    thumb.style.setProperty("margin", "0", "");
                    thumb.style.setProperty("border-width", "0px", "");
                    thumb.style.setProperty("min-width", "0px", "");
                    thumb.style.setProperty("max-width", "0px", "");
                    cacheHide.push(thumb);
                    thumb.remove();
                }
            }
            taglist = image.getAttribute("alt") + " ";
            blacklisted = blacklist.split("\n");
            for(var b = 0; b < blacklisted.length; b++) {
                bLine = blacklisted[b].replace(/\s\s+/g, " ").trim().split(" "); // normalize
                var todelete = 0;
                for(var c = 0; c < bLine.length; c++) {
                    if(bLine[c] == "")
                        break;
                    if(taglist.indexOf(bLine[c] + " ") >= 0)
                        todelete++;
                }
                if(todelete == bLine.length)
                    thumb.remove();
            }
        }
    }
}

function getContent(xmldoc, newtags) {
    if(booru.name == "Danbooru") { // Inject the count where it should be by default...
        requestCount = xmlhttpRequest({
            method : "GET",
            url : window.location.origin + "/counts/posts.xml" + booru.query(encodeURIComponent(newtags)),
            headers : {
                "Accept" : "application/xml"
            },
            overrideMimeType : "application/xml; charset=utf-8",
            onload : function(response) {
                newxmldoc = domParser.parseFromString(response.responseText, "application/xml");
                count = newxmldoc.evaluate("counts/posts", newxmldoc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                posts = xmldoc.evaluate("posts", xmldoc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                if(posts) {
                    posts.setAttribute("count", count ? count.textContent.trim() : "0");
                    posts.setAttribute("offset", (page - 1) * images);
                    // processing of new XML back to legacy format, how did I even learn this?
                    var xsltProcessor = new XSLTProcessor();
                    xsltProcessor.importStylesheet(domParser.parseFromString(xsltText, "text/xml"));
                    xmldoc = xsltProcessor.transformToDocument(xmldoc);
                }
                showContent(xmldoc);
            }
        });
    } else {
        if(booru.name == "Gelbooru") { // Gelbooru has new a new xml format?
            var xsltProcessor = new XSLTProcessor();
            xsltProcessor.importStylesheet(domParser.parseFromString(xsltText, "text/xml"));
            xmldoc = xsltProcessor.transformToDocument(xmldoc);
        }
        showContent(xmldoc);
    }
}

function checkCache(data) {
    var cached = false;
    for(var i in cacheID)
        if(data.getAttribute("id") == cacheID[i].id && cacheID[i].file != "null") { // insert the cached url directly to data
            cached = true;
            data.setAttribute("file-url", cacheID[i].file);
            data.setAttribute("preview-file-url", "/data/preview/" + cacheID[i].file.match(/[a-f0-9]{32}/)[0] + ".jpg");
            data.setAttribute("md5", cacheID[i].file.match(/[a-f0-9]{32}/)[0]);
            cacheID[i].expires = Math.abs(Date.now() + cacheExpires);
            break;
        }
    return cached;
    /*
    if(!cached)
        requestCache = xmlhttpRequest({
            method : "GET",
            url : window.location.origin + "/posts/" + data.getAttribute("id"),
            headers : {
                "Accept" : "text/html"
            },
            onload : function(response) {
                parsedPage = domParser.parseFromString(response.responseText, "text/html");
                parsed = parsedPage.getElementById("image-container");
                if(!parsed)
                    return;
                id = parsed.getAttribute("data-id");
                file = parsed.getAttribute("data-file-url");
                if(/\.zip$/.test(file))
                    file = parsed.getAttribute("data-large-file-url");
                cacheID.push({ id : id, file : file, expires : Math.abs(Date.now() + cacheExpires) });
                image = d.getElementById(id);
                if(!image) // check the deleted images too
                    for(var i in cacheHide)
                        if(cacheHide[i].firstChild.firstChild.getAttribute("id") == id)
                            image = cacheHide[i].firstChild.firstChild;
                if(!image)
                    return;
                image.setAttribute("fullsize", file);
                image.setAttribute("src", "/data/preview/" + file.match(/[a-f0-9]{32}/)[0] + ".jpg");
                image.setAttribute("md5", file.match(/[a-f0-9]{32}/)[0]);
                image.parentNode.setAttribute("href", file);
            }
        });
    */
}

function showNotes(note, id) {
    var offsetx = Math.max(10, fullsize.getBoundingClientRect().left); //+ (d.documentElement.scrollLeft || d.body.scrollLeft);
    var offsety = Math.max(10, fullsize.getBoundingClientRect().top); //+ (d.documentElement.scrollTop || d.body.scrollTop);
    var vp_bottom = Math.max(window.innerHeight, innerDisplay.getBoundingClientRect().bottom - innerDisplay.getBoundingClientRect().top);

    for(var i = 0, ndata = null; ndata = note.snapshotItem(i++); i) {
        if(id.match(/[0-9]+$/)[0] != fullsize.getAttribute("id"))
            continue;
        if(d.getElementById("note" + ndata.getAttribute("id")))
            continue;

        var noteDiv = d.createElement("DIV");
        noteDiv.setAttribute("id", "note" + ndata.getAttribute("id"));
        noteDiv.setAttribute("class", "trans");
        noteDiv.setAttribute("style", "opacity: 0.4; transition: none !important;");
        noteDiv.style.setProperty("left", ndata.getAttribute("x") * sampleRate + offsetx + "px", "");
        noteDiv.style.setProperty("top", ndata.getAttribute("y") * sampleRate + offsety + "px", "");
        noteDiv.style.setProperty("width", ndata.getAttribute("width") * sampleRate + "px", "");
        noteDiv.style.setProperty("height", ndata.getAttribute("height") * sampleRate + "px", "");
        noteDiv.addEventListener("mouseover", function(event) {
            noteclearTimer = setTimeout(function() {
                d.getElementById("body" + this.getAttribute("id")).style.setProperty("display", "", "");
            }.bind(this), 100);
        }, false);
        noteDiv.addEventListener("mouseout", function(event) {
            noteclearTimer = setTimeout(function() {
                d.getElementById("body" + this.getAttribute("id")).style.setProperty("display", "none", "");
            }.bind(this), 200);
        }, false);
        innerDisplay.appendChild(noteDiv);

        var noteBody = d.createElement("DIV");
        noteBody.innerHTML = ndata.getAttribute("body");
        noteBody.setAttribute("id", "bodynote" + ndata.getAttribute("id"));
        noteBody.setAttribute("class", "trans");
        noteBody.setAttribute("style", "color: Black; text-align: left; padding: 4px; z-index: 1" + i + ";");
        noteBody.addEventListener("mouseover", function(event) {
            clearTimeout(noteclearTimer);
            this.style.setProperty("display", "", "");
        }, false);
        noteBody.addEventListener("mouseout", function(event) {
            this.style.setProperty("display", "none", "");
        }, false);
        innerDisplay.appendChild(noteBody);

        // this sucks, find another method!
        var w = ndata.getAttribute("width") * sampleRate;
        var h = ndata.getAttribute("height") * sampleRate;
        if(w < h) { // FUCK YEAH XOR SWAP
            w ^= h;
            h ^= w;
            w ^= h;
        }
        while(w / h > ratio) {
            w -= ratio;
            h += ratio;
        }

        noteBody.style.setProperty("min-width", "-moz-min-content", "");
        noteBody.style.setProperty("min-width", "-webkit-min-content", "");
        noteBody.style.setProperty("max-width", w + "px", "");

        ntop = (ndata.getAttribute("y") * sampleRate) + (ndata.getAttribute("height") * sampleRate) + offsety + 5;
        nheight = noteBody.getBoundingClientRect().bottom - noteBody.getBoundingClientRect().top;
        if(ntop + nheight > vp_bottom)
            noteBody.style.setProperty("top", vp_bottom - nheight + "px", "");
        else
            noteBody.style.setProperty("top", ntop + "px", "");

        noteBody.style.setProperty("left", ndata.getAttribute("x") * sampleRate + offsetx + "px", "");
        noteBody.style.setProperty("display", "none", "");
    }
}

function getNotes(xmldoc, id) {
    if(booru.name == "Danbooru") { // Parses the nodes as attributes for each note
        var xsltProcessor = new XSLTProcessor();
        xsltProcessor.importStylesheet(domParser.parseFromString(xsltText, "text/xml"));
        xmldoc = xsltProcessor.transformToDocument(xmldoc);
        showNotes(xmldoc.evaluate("notes/note", xmldoc, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null), id);
    } else {
        showNotes(xmldoc.evaluate("notes/note[@is_active = 'true']", xmldoc, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null), id);
    }
}

function saveValues() { // sanitize and save as string
    tags = ("" + tags).replace(",", "");
    images = ("" + images).replace(",", "");
    page = ("" + page).replace(",", "");
    rating = ("" + rating).replace(",", "");
    blacklist = ("" + blacklist).replace(",", "");
    var cachedTags = tags.trim().split(" ");
    var cached = false;
    for(var i in cachedTags) {
        for(var j in cacheTags)
            if(cachedTags[i] == cacheTags[j].tag) {
                delete cacheTags[j];
                break;
            }
        cacheTags.push({ tag : cachedTags[i], expires : Date.now() + cacheExpires });
    }
}

function setStorage() {
    saveValues(); // double sure that it was saved
    if(!checkStorage())
        return;
    storage.setItem("dai-tags", tags);
    storage.setItem("dai-images", images);
    storage.setItem("dai-page", page);
    storage.setItem("dai-rating", rating);
    storage.setItem("dai-blacklist", blacklist);
    var cachedID = "";
    for(var i in cacheID) // save as a shorter CSV string : id,file,expires,
        cachedID += cacheID[i].id + "," + cacheID[i].file + "," + cacheID[i].expires + ",";
    storage.setItem("dai-cacheID", cachedID);
    var cachedTags = "";
    for(var i in cacheTags) // save as a shorter CSV string : tag,expires,
        cachedTags += cacheTags[i].tag ? cacheTags[i].tag + "," + cacheTags[i].expires + "," : "";
    storage.setItem("dai-cacheTags", cachedTags);
}

function getStorage() { // load as string
    tags = storage.getItem("dai-tags") || tags;
    images = parseInt(storage.getItem("dai-images") || images, 10);
    page = parseInt(storage.getItem("dai-page") || page, 10);
    rating = storage.getItem("dai-rating") || rating;
    blacklist = storage.getItem("dai-blacklist") || blacklist;
    var cachedID = (storage.getItem("dai-cacheID") || "").split(",");
    for(var i = 0; i < cachedID.length - 1; i += 3) // load the cached ids
        if(cachedID[i+2] > Date.now()) // but only if not expired
            cacheID.push({ id : cachedID[i], file : cachedID[i+1], expires : cachedID[i+2] });
    var cachedTags = (storage.getItem("dai-cacheTags") || "").split(",");
    for(var i = 0; i < cachedTags.length - 1; i += 2) // load the cached tags
        if(cachedTags[i+1] > Date.now()) // but only if not expired
            cacheTags.push({ tag : cachedTags[i], expires : cachedTags[i+1] });
}

function checkStorage() {
    try {
        storage = window.localStorage, test = "__storage_test__";
        storage.setItem(test, test);
        storage.removeItem(test);
        return true;
    } catch(e) {
        console.log(e);
        if(e == QUOTA_EXCEEDED_ERR) { // not my fault
            storage.setItem("dai-cacheID", "");
            storage.setItem("dai-cacheTags", "");
        }
        return false;
    }
}

function xmlhttpRequest(request) {
    var xReq = new XMLHttpRequest();
    if(!!request.overrideMimeType)
        xReq.overrideMimeType(request.overrideMimeType);
    xReq.open(request.method, request.url, true);
    if(!!request.headers)
        Object.getOwnPropertyNames(request.headers).forEach(function(header) {
            xReq.setRequestHeader(header, request.headers[header]);
        });
    xReq.onreadystatechange = function(e) {
        if(xReq.readyState == 4)
            if(xReq.status > 0)
                request.onload(xReq);
    };
    xReq.send(null);
    return xReq;
}

d.head.appendChild(dai_css);

// clear old GM values
GM_deleteValue("tags");
GM_deleteValue("images");
GM_deleteValue("page");
GM_deleteValue("rating");
GM_deleteValue("column");