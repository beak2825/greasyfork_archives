// ==UserScript==
// @name        Imagenorator
// @namespace   pendevin
// @description turns images into links in specified people's posts
// @include     http://boards.endoftheinter.net/showmessages.php?*
// @include     http://archives.endoftheinter.net/showmessages.php?*
// @include     https://boards.endoftheinter.net/showmessages.php?*
// @include     https://archives.endoftheinter.net/showmessages.php?*
// @require     http://code.jquery.com/jquery-2.1.4.min.js
// @version     3.1
// @downloadURL https://update.greasyfork.org/scripts/6654/Imagenorator.user.js
// @updateURL https://update.greasyfork.org/scripts/6654/Imagenorator.meta.js
// ==/UserScript==


//add userIDs of people whose image settings you want changed
//e.g. LlamaGuy :) and Sabretooth would be const IMAGENORATED=$([1,11256]);
//users whose images should become links
const IMAGENORATED_LINKS = $([]);
//users whose images should become thumbnails
const IMAGENORATED_THUMBS = $([25770, 13466]);
//users whose images should become inline fullsized (quoted images not included)
const IMAGENORATED_FULL = $([]);

//priority is fullsize > thumbs > links if you happen to have a dude on multiple lists


//ll breaks without noconflict jquery
this.$ = this.jQuery = jQuery.noConflict(true);

//livelinks compatiblity *JQUERY
//calls the function on each message-container in a document, including ones added by livelinks
//place is an optional specialized location
function livelinks(func, extraParams, place) {
    if (extraParams == undefined) {
        extraParams = null;
    }
    if (place == undefined) {
        place = '.message-container';
    }
    //run the function on the message-containers currently on the page
    $('#u0_1 ' + place).each(function(i, container) {
        func(container, extraParams);
    });
    //make mutationobserver to run junk on matches
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            $(mutation.addedNodes).find(place).each(function(i, container) {
                func(container, extraParams);
            });
        });
    });
    //run mutationobserver
    observer.observe(document.querySelector('#u0_1'), {
        childList: true
    });
}

//adds a style to a document and returns the style object *JQUERY
//css is a string, id is an optional string that determines the object's id
function addStyle(css, id) {
    //create a style
    var style = $('<style type="text/css">');
    //add the css data to it
    style.html(css);
    if (id) {
        //remove any style that has our id
        $('#' + id).remove();
        //give our style the id after removing the other stuff. idk if it matters, but i'm too lazy to find out
        style.attr('id', id);
    }
    //add the style into the head
    $('head').append(style);
    //we're outta here
    return style;
}

//tags message-tops with userids
//should call it with livelinks imo *JQUERY
function userids(container) {
    $(container).find('.message-top').each(function(i, top) {
        top = $(top);
        //get userid attribute from the profile link
        top.attr('userID', top.children('a[href*="user="]').attr('href').split('user=')[1]);
    });
}

//puts the message body of any quoted-message in its own message div like normal messages for easier styling(hiding)
//livelinks ready *JQUERY
function rearrangeQuotes(container) {
    //this is a for loop or something
    $(container).find('.quoted-message').each(function(i, quote) {
        quote = $(quote);
        //create message div for quote
        var quoteBody = $('<div class="message">');
        //add everything but the message-top to the message div
        quote.contents().each(function(i2, node) {
            node = $(node);
            //make sure we don't do shit with an already parsed quote
            if (!node.hasClass('message-top') && !node.hasClass('message')) {
                quoteBody.append(node);
            }
        });
        //add the new message div to the quoted-message if it's got anything in it
        if (quoteBody.contents()[0]) {
            quote.append(quoteBody);
        }
    });
}

//adds hidden class to posts of ignorated users
//needs stuff and jquery
function ignorate(container) {
    rearrangeQuotes(container);
    userids(container);
    //get the messages and such
    $(container).find('.message').each(function(i, message) {
        message = $(message);

        //get the images then check against filtered ids and execute the thingy
        function doTheThing(list, func, idCheck) {
            //make sure we're only getting the imgs elements from this message and not subordinate ones
            //shit in spoilers oh god this is so long i wish i could select descendents of the selection context with find()
            message.children('.spoiler_closed,.spoiler_opened').children('.spoiler_on_open').children('.imgs').add(message.children('.imgs')).find('a').each(function(i, img) {
                img = $(img);
                $(list).each(function(j, id) {
                    if (idCheck == id) {
                        //do the thing in the function and stuff
                        func(img);
                        //this guy breaks the loop
                        return;
                    }
                });
            });
        }

        //FUCKING SPOILERS, IDIOT
        var idCheck = '1';
        //normal message
        if (message.parent()[0].nodeName == 'TR') {
            idCheck = message.parent().parent().parent().prev().attr('userID');
            doTheThing(IMAGENORATED_LINKS, toLinks, idCheck);
            doTheThing(IMAGENORATED_THUMBS, toThumbs, idCheck);
            doTheThing(IMAGENORATED_FULL, toFull, idCheck);
        }
        //normal quote
        //remember that we've used the rearrange quotes function
        else if (message.parent().hasClass('quoted-message') && message.parent().attr('msgid')) {
            idCheck = message.prev().attr('userID');
            doTheThing(IMAGENORATED_LINKS, toLinks, idCheck);
            //if we're on links, we should make quoted stuff into thumbnails
            if (linkCheck) {
                doTheThing(IMAGENORATED_THUMBS, toThumbs, idCheck);
                doTheThing(IMAGENORATED_FULL, toThumbs, idCheck);
            }
        }
        //anonymous quote in a normal message
        else if (message.parent().parent().hasClass('message') && message.parent().parent().attr('msgid')) {
            idCheck = message.parent().parent().parent().parent().parent().prev().attr('userID');
            doTheThing(IMAGENORATED_LINKS, toLinks, idCheck);
            //if we're on links, we should make quoted stuff into thumbnails
            if (linkCheck) {
                doTheThing(IMAGENORATED_THUMBS, toThumbs, idCheck);
                doTheThing(IMAGENORATED_FULL, toThumbs, idCheck);
            }
        }
        //anonymous quote in a quote. you can't nest farther than this
        else {
            idCheck = message.parent().parent().prev().attr('userID');
            doTheThing(IMAGENORATED_LINKS, toLinks, idCheck);
            //if we're on links, we should make quoted stuff into thumbnails
            if (linkCheck) {
                doTheThing(IMAGENORATED_THUMBS, toThumbs, idCheck);
                doTheThing(IMAGENORATED_FULL, toThumbs, idCheck);
            }
        }
    });
}

//take a message element and turn its images into links
function toLinks(img) {
    //make sure you don't gots links turned on
    if (img.children().length) {
        //hide old image thing
        img.children('.img-placeholder').addClass('hidden');
        //get image name
        var name = decodeURIComponent(img.attr('href').substring(img.attr('href').lastIndexOf('/') + 1));
        //stick name in link content plus a <br>
        var newImg = img.append(name + '<br>');
    }
}

//take a message element and turn its images into thumbnails
function toThumbs(img) {
    //check if links aren't turned on only because you can't reliably distinguish thumbs from fullsize
    //actually i guess you can't check for one but not the other <pre>ugh</pre>
    //hide old image thing
    img.children('.img-placeholder').addClass('hidden');
    //get image source and convert it to thumbnail
    var src = img.attr('imgsrc').replace(/endoftheinter\.net/, 'dealtwith.it').replace(/\/i\/n\//, '/i/t/').replace(/\.\w\w\w\w?$/, '.jpg');
    //add the thumb image maybe it'll work
    img.append('<span class="img-loaded"><img src="' + src + '"></span>');
}

//take a message element and turn its images into fullsize inline images
function toFull(img) {
    //not checking for inline fullsize because i don't think there's really any way to do it guaranteed
    //hide old image thing
    img.children('.img-placeholder').addClass('hidden');
    //get image source and convert it to thumbnail
    var src = img.attr('imgsrc').replace(/endoftheinter\.net/, 'dealtwith.it');
    //add the image
    img.append('<span class="img-loaded"><img src="' + src + '"></span>');
}

//check if we're in link mode i guess
var linkCheck = true;
$('a.img').first().each(function(i, img) {
    linkCheck = ($(img).contents()[0].nodeType == 3)
});
//tag posts with userids
livelinks(ignorate);
addStyle('.hidden{display:none}', 'hidden');
