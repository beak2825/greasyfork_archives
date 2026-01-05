// ==UserScript==
// @name        Deviantart for DownThemAll
// @namespace   VelgorDeviantart
// @description Generate links, for DownThemAll, with the full direct image url and new Tags.
// @include     *://*.deviantart.com/gallery/?catpath=*
// @include     *://*.deviantart.com/gallery/?offset=*
// @include     *://*.deviantart.com/gallery/
// @version     0.9.8.0
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/7010/Deviantart%20for%20DownThemAll.user.js
// @updateURL https://update.greasyfork.org/scripts/7010/Deviantart%20for%20DownThemAll.meta.js
// ==/UserScript==

// Use *title*.*ext* as DownThemAll renaming tag
// Need Autopager if you want download all Pages at Once 
// todo:
// maybe make script work without Autopager
// img name has a "/" in it (DownThemAll will make a Folder of that)
// cant get full img from gifs and swf
// mess with "thumb hasprint" class in thumb
// not working in gallery folders



// remove gallery folders
if (document.getElementById("gmi-GMFrame_Gruser") != null) {
	var galleryFolders = document.getElementById("gmi-GMFrame_Gruser");
	galleryFolders.parentNode.removeChild(galleryFolders);
}

// remove MoreLikeThis
var mltLink = document.getElementsByClassName("mlt-link");
var mltIcon = document.getElementsByClassName("mlt-icon");

for (var i = mltLink.length - 1; i >= 0; i--) {
	mltLink[i].setAttribute( 'class', 'mltL' );
}
for (var i = mltIcon.length - 1; i >= 0; i--) {
	mltIcon[i].setAttribute( 'class', 'mltI' );
}

// remove box from literature or tutorial content
var isLit = document.getElementsByClassName("thumb lit");

for (var i = isLit.length - 1; i >= 0; i--) {    
	isLit[i].setAttribute( 'class', 'thumb' );
}

// get category and set a new tag
var cate = document.getElementsByClassName("tt-fh");

for (var i = cate.length - 1; i >= 0; i--) {
    var cAtt = document.createAttribute("category");
    thumbCategory = cate[i].getAttribute( 'category' );
    thumbCategory = thumbCategory + "/";
    cAtt.value = thumbCategory;
    cate[i].firstElementChild.firstElementChild.lastElementChild.firstElementChild.setAttributeNode(cAtt);
}

// get img id and set a new tag
var collID = document.getElementsByClassName("tt-fh");

for (var i = collID.length - 1; i >= 0; i--) {
    var cAtt = document.createAttribute("imgid");
    thumbCollID = collID[i].getAttribute( 'collect_rid' );
    thumbCollID = thumbCollID.replace('1:', '');
    cAtt.value = thumbCollID;
    
    collID[i].children[0].children[0].lastElementChild.children[0].setAttributeNode(cAtt);
}

// no nsfwfilter for thumbmals and set a new tag
var isNSFW = document.getElementsByClassName("thumb ismature");

for (var i = isNSFW.length - 1; i >= 0; i--) {
    var cAtt = document.createAttribute("f18");
    cAtt.value = "f18Content";
    isNSFW[i].setAttributeNode(cAtt);
    
	isNSFW[i].setAttribute( 'class', 'thumb' );
}

// generate thumb link for the full image
var thumbnode = document.getElementsByClassName("thumb");
var names = document.getElementsByClassName("tt-fh-oe");
var thumbCategory = '';
var thumbID = '';

for (var j = thumbnode.length - 1; j >= 0; j--) {

	var thumbLink = thumbnode[j].getAttribute( 'data-super-full-img' );
    // get other link, if no bigger full img is given
    if (thumbLink == null) {
		thumbLink = thumbnode[j].getAttribute( 'data-super-img' );
	}
	var thumbLongName = thumbnode[j].getAttribute( 'title' );
	var thumbShortName = names[j].textContent;
    // nsfw content, paid link or literature?
	if (thumbLink == null) {
		thumbShortName = '<b style="font-size:320%; color: red;"> invalid link </b>';
	}
    
    // look if img has gallections and add them as a tag
    var thumbGallections = '';
    var gallectionsNodes = thumbnode[j].parentElement.parentElement.nextElementSibling
        .lastElementChild.firstElementChild.children;
        
    if (thumbnode[j].parentElement.parentElement.nextElementSibling
        .lastElementChild.firstElementChild.classList == "gallections") { //check if img has gallections
            for (var g = 0; g < gallectionsNodes.length; g++) {
                thumbGallections = thumbGallections + ' [' + gallectionsNodes[g].textContent + ']';
        }
    }

    // add category from img 
    thumbCategory = thumbnode[j].getAttribute( 'category' );
    
    // add id tag from img 
    thumbID = thumbnode[j].getAttribute( 'imgid' );

    // F18 tag for NSFW content  
    var thumbF18 = '';
    if (thumbnode[j].getAttribute( 'f18' ) != null) {
		thumbF18 = '[F18]';
	}

    
    // generate htmlcode for the full img link
	thumbnode[j].innerHTML += '<p>' + ' <a href="' + thumbLink + '" title="' + thumbCategory + ' ' + thumbLongName
        + thumbGallections + ' [' + thumbID + '] ' + thumbF18 + '"> ' + thumbShortName + ' </a> </p>';
}
