// ==UserScript==
// @name         GW2WvW.net PvF Expansion Pack 0.5
// @namespace    http://www.gw2wvw.net/
// @version      0.5.2
// @description  Implements "ignore user", quote posts on reply, and visual improvements on the gw2wvw.net forum.
// @author       Anvil Pants
// @include      http://www.gw2wvw.net/*
// @grant        metadata
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/6483/GW2WvWnet%20PvF%20Expansion%20Pack%2005.user.js
// @updateURL https://update.greasyfork.org/scripts/6483/GW2WvWnet%20PvF%20Expansion%20Pack%2005.meta.js
// ==/UserScript==

(function ($)
{
    var oldGetStlyes = $.fn.getStyles;
    jQuery.fn.getStyles = function( elem )
    {
		// Support: IE<=11+, Firefox<=30+ (#15098, #14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		if ( elem.ownerDocument.defaultView.opener ) {
			return elem.ownerDocument.defaultView.getComputedStyle( elem, null );
		}

		return unsafeWindow.getComputedStyle( elem, null );
    };
})(jQuery);

// overload isn't working yet

/**
 * Setup
 */

pvfExpansion = {
    'var': {
        start: new Date().getTime(),
        session: sessionStorage
    },

    init: function () {

        if (document.readyState == "interactive") {
            // Add CSS
            pvfExpansion.addStyle();
        }

        if (document.readyState == "complete") {

            //pvfExpansion.cleanerMarkup();

            // paths where forum-style content appears
            if (document.location.href.match(/^http\:\/\/www\.gw2wvw\.net\/(?:comment\/|content\/|topic\/|user$|users\/)/i)) {
                // hide ignored user posts
                pvfExpansion.fuckThoseGuys();
                pvfExpansion.addForumPostHyperinks();
            }

            pvfExpansion.scrollListener();
        }
    },

    addForumPostHyperinks: function() {
        var searchNodes = document.evaluate("//a[@class='username']", document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
        var resultNodes = [];
        while (aResult = searchNodes.iterateNext()) {
            resultNodes.push(aResult);
        }
        for (var i in resultNodes) {
            if ($(resultNodes[i].parentNode).hasClass('author-pane-line')) {

                var newContainer = document.createElement('div');
                newContainer.setAttribute('class', 'author-pane-line author-pane-link-line');
                // $(newContainer).insertAfter(resultNodes[i].parentNode);
                $(resultNodes[i].parentNode.parentNode).append(newContainer);

                var ignoreLink = document.createElement('a');
                ignoreLink.setAttribute('class', 'author-pane-line author-pane-link');
                ignoreLink.setAttribute('href', '');
                ignoreLink.innerHTML = 'Ignore';
                $(ignoreLink).click({asshole: resultNodes[i].innerHTML},function(e){
                    e.preventDefault();
                    // in case "works for me" turns to shit
                    // http://stackoverflow.com/questions/24642541/gm-getvalue-is-not-defined-in-injected-code
                    //console.log("GM_setValue: ", GM_setValue("extra_markdown", true) );
                    if(pvfExpansion.addIgnoreList(e.data.asshole)) {
                        pvfExpansion.fuckThoseGuys();
                    }
                });
                newContainer.appendChild(ignoreLink);
            }
        }
    },
    
    addForumPostQuote: function() {
        if (document.location.href.match(/^http\:\/\/www\.gw2wvw\.net\/comment\/reply\/.*?/i)) {

            // duplicated from cleanerMarkup()
            $('div.forum-post').find('blockquote').show();
            $('div.forum-post').find('div.quote-snip').remove();
            
            var quotedAuthor = $('div.author-name > a.username').text();
            var quotedPost = $('div.field-name-comment-body > div.field-items > div.field-item').html();
            if (quotedPost === undefined) {
                quotedPost = $('div.field-name-body > div.field-items > div.field-item').html();
            }
            
            //console.log(quotedPost);
            quotedPost = quotedPost.replace(/<p><\/p>|<p>\&nbsp\;<\/p>|\&nbsp\;/gi,' ');
            quotedPost = quotedPost.replace(/<br> ?</gi,'<');
            quotedPost = quotedPost.replace(/> ?<br>/gi,'>');
            //console.log(quotedPost);
            var quoteBuilt = '[quote='+quotedAuthor+']'+quotedPost+'<p>[/quote]</p><p></p>';
            //console.log(quoteBuilt);
            
            $('div#edit-comment-body').css(['visibility', 'display'], ['hidden','none']);
            var ckeditorWaitStop = 50;
            var ckeditorWait = setInterval(function(){
                ckeditorWaitStop++;
                if((CKEDITOR.instances['edit-comment-body-und-0-value'].status === 'ready') || (ckeditorWaitStop > 25)) {

                    //var ckeditorConfig = JSON.stringify(CKEDITOR.instances['edit-comment-body-und-0-value'].config);
                    CKEDITOR.instances['edit-comment-body-und-0-value'].destroy(true);
                    //CKEDITOR.replace('edit-comment-body-und-0-value', ckeditorConfig);
                    CKEDITOR.replace('edit-comment-body-und-0-value');
                    CKEDITOR.instances['edit-comment-body-und-0-value'].setData(quoteBuilt);
                    
                    $('input#edit-submit').toggleClass('form-disabled', false).removeAttr('disabled');

                    clearInterval(ckeditorWait);

                }
            }, 100);
            $('div#edit-comment-body').css(['visibility', 'display'], ['visible','block']);


            console.log(CKEDITOR.instances['edit-comment-body-und-0-value']);
        }
    },

    addStyle: function() {
        var css = document.createElement("style");
        css.media = 'all';
        css.type = 'text/css';
        css.innerHTML = pvfExpansion.var.css;
        document.querySelector('head').appendChild(css);
    },

    cleanerMarkup: function() {

        // forum posts: div.forum-post
        // user page user comments: div.view-userposts li.views-row
        // user page user content: div.view-usercontent div.node
        $('div.forum-post, div.view-userposts li.views-row, div.view-usercontent div.node').each(function(i){

            var postId = $(this).attr('id');
            if ((postId === 'undefined') || !postId) {
                postId = 'fake-post-id-'+i;
            }

            // the "snip" feature is replaced
            $(this).find('blockquote').show();
            $(this).find('div.quote-snip').remove();

            // text not wrapped in <p>
            $(this).find('div.field-item, blockquote, div.author-signature').contents()
            .filter(function() {
                // a non-empty text node
                return ((this.nodeType === 3) && (this.nodeValue) && (this.nodeValue.trim() !== ''));
            })
            .wrap('<p></p>').end();

            // pilcrow cancer
            $(this).find('br').remove();
            $(this).find('p').each(function(i){
                this.innerHTML = this.innerHTML.replace(/&nbsp;/ig,' ');
                if (this.innerHTML.trim() === '') this.remove();
            });
            $(this).find('blockquote').each(function(i){
                this.innerHTML = this.innerHTML.replace(/&nbsp;/ig,' ');
                if (this.innerHTML.trim() === '') this.remove();
            });

            // narrow context to post body
            $(this).find('div.field-name-body, div.field-name-comment-body, div.views-field-comment-body').each(function(i){

                // quote and attribution markup
                $(this).find('blockquote').each(function(i){

                    var quoteId = postId+'-quote-'+i;

                    // used p wrapper instead of div.quote-author, move attribution outside of and above p
                    $(this).children('p:first-child').children('em:first-child').detach().insertBefore($(this).children('p:first-child'));

                    // missing div.quote-author wrapper on attribution
                    $(this).children('em:first-child').wrap('<div class="quote-author"></div>').after(' wrote:');

                    // missing quote-msg class, inconsistent quote-nest-*, which triggers the poorly done "snip" feature
                    $(this).removeClass().addClass('quote-msg').attr('id', quoteId);

                    // remove unneeded "wrote:" text which was repositioned above
                    $(this).children('p:nth-child(2)').each(function(i){
                        if (this.innerHTML && (this.innerHTML !== 'undefined')) {
                            this.innerHTML = this.innerHTML.replace(/^\s*wrote:\s*/i,'');
                            if (this.innerHTML.trim() === '') {
                                $(this).remove();
                            }
                        }
                    });

                    // missing attribution for quote
                    if ($(this).children('.quote-author').length === 0) {
                        $(this).prepend('<div class="quote-author"><em class="placeholder">(unattributed)</em> wrote:</div>');
                    }

                    // content after quote-author wrapped in new collapsible container
                    $(this).append('<div class="quote-container"></div>');
                    $(this).children().not('.quote-container, .quote-author').detach().appendTo($(this).children('.quote-container'));

                    // add comment toggle
                    $(this).children('.quote-author').click({quoteId: quoteId},function(e){
                        $('#'+e.data.quoteId+' > .quote-container:visible').slideUp({
                            duration: 300,
                            start: function(){
                                $('#'+e.data.quoteId+' > .quote-author > .quote-toggle-img').attr('src', pvfExpansion.getImage('plus'));
                            }
                        });
                        $('#'+e.data.quoteId+' > .quote-container:hidden').slideDown({
                            duration: 300,
                            start: function(){
                                $('#'+e.data.quoteId+' > .quote-author > .quote-toggle-img').attr('src', pvfExpansion.getImage('minus'));
                            }
                        });
                    })
                    .append('<img class="quote-toggle-img" src="'+pvfExpansion.getImage('minus')+'">');

                    // configure nested quote series
                    // default: first is open, children and siblings are closed
                    if (i > 0) {
                        $(this).children('.quote-container').hide();
                        $(this).find('.quote-author > .quote-toggle-img').attr('src', pvfExpansion.getImage('plus'));
                    }
                    else {
                        $(this).children('.quote-container').show();
                    }
                });
            });
        });
    },

    getImage: function(img) {
        var images = [];
        images.plus = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAIAAAHDszKLAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAG1JREFUeNpi/PfvHwMQQCiAAGKE8iAAIIAYkHlMSOIMAAGEpg5JPYoyFA5AADFg1YOuBbd2JMACdzAaAAggHO4iAHB6kyxR7AC7ywACjIF49+ILKBJch8tCFlyK4GwmJibCcUmCu1HMIzNUGRgA5mA7unbJ2psAAAAASUVORK5CYII=';
        images.minus = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAIAAAHDszKLAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAGJJREFUeNpi/PfvHwMQQCiAAGKE8iAAIIAYkHlMSOIMAAGEpg5JPYoyFA5AADFg1YOuBbd2JMACdzAaAAggHO4aBAC7ywACjIF49+ILKNJCD2eQ4ncVExMTdtXIElRwCWmqAXd5KdwTk+jOAAAAAElFTkSuQmCC';
        return images[img];
    },

    // http://stackoverflow.com/a/21789375
    hereDoc: function(f) {
        return f.toString().match(/\/\*\s*([\s\S]*?)\s*\*\//m)[1].replace(/(\/\*[\s\S]*?\*) \//g, '$1/');
    },

    getIgnoreList: function() {
        var ignoreList = GM_getValue('gw2wvw_ignore');
        if (!ignoreList) return [];
        return JSON.parse(ignoreList);
    },

    addIgnoreList: function(asshole) {
        asshole = String(decodeURIComponent(asshole));
        var confirmed = confirm('Do you want to ignore "'+asshole+'"?');
        if (asshole !== 'null' && asshole !== 'undefined' && confirmed) {
            var ignoreList = GM_getValue('gw2wvw_ignore');
            if (!ignoreList) ignoreList = [];
            else ignoreList = JSON.parse(ignoreList);
            if (ignoreList.indexOf(asshole) == -1) {
                ignoreList.push(asshole);
                GM_setValue('gw2wvw_ignore', JSON.stringify(ignoreList));
            }
        }
        return confirmed;
    },

    delIgnoreList: function(asshole) {
        asshole = String(decodeURIComponent(asshole));
        var confirmed = confirm('Do you want to stop ignoring "'+asshole+'"?');
        if (asshole !== 'null' && asshole !== 'undefined' && confirmed) {
            var ignoreList = GM_getValue('gw2wvw_ignore');
            if (!ignoreList) return;
            else ignoreList = JSON.parse(ignoreList);
            if (ignoreList.indexOf(asshole) !== -1) {
                ignoreList = $.grep(ignoreList, function(value) {
                    return value != asshole;
                });
                GM_setValue('gw2wvw_ignore', JSON.stringify(ignoreList));
            }
        }
        return confirmed;
    },

    resetIgnoreList: function() {
        GM_setValue('gw2wvw_ignore', '');
    },

    fuckThoseGuys: function() {
        var ignoredUsers = [], hideNodes = [], showNodes = [],
            ignoreUserAlert = null, searchNodes = null,
            ignoreList = pvfExpansion.getIgnoreList();

        // reset all ignored user alerts
        $('.ignore-user-alert').remove();

        /* Look for quoted posts to ignore. */
        $('blockquote > div:first-child > em, blockquote > p:first-child > em').each(function(){
            if (this.innerHTML !== 'undefined') {
                if ($.inArray(this.innerHTML, ignoreList) !== -1) {
                    ignoredUsers.push(this.innerHTML);
                    hideNodes.push($(this).parents('blockquote'));
                }
                else {
                    showNodes.push($(this).parents('blockquote'));
                }
            }
        });

        /* Look for posts to ignore. */
        $('div.author-name > a.username').each(function(){
            if (this.innerHTML !== 'undefined') {
                if ($.inArray(this.innerHTML, ignoreList) !== -1) {
                    ignoredUsers.push(this.innerHTML);
                    hideNodes.push($(this).parents('div.forum-post'));
                }
                else {
                    showNodes.push($(this).parents('div.forum-post'));
                }
            }
        });

        ignoredUsers = pvfExpansion.uniqueArrayEntries(ignoredUsers);

        for (var i in showNodes) {
            $(showNodes[i]).removeClass('ignore-user');
        }

        for (var i in hideNodes) {
            $(hideNodes[i]).addClass('ignore-user');
            ignoreUserAlert = document.createElement('div');
            ignoreUserAlert.setAttribute('class', 'ignore-user-alert');
            ignoreUserAlert.innerHTML = '&nbsp;';
            $(hideNodes[i]).after(ignoreUserAlert);
        }

        if ($(ignoredUsers).length > 0) {
            // create ignored notice block
            var ignoredNotice = document.createElement('ul');
            ignoredNotice.setAttribute('id', 'ignored-notice');
            var ignoredNoticeUser = document.createElement('li');

            ignoredNoticeUser.innerHTML = $(ignoredUsers).length+' user';
            if ($(ignoredUsers).length > 1) {
                ignoredNoticeUser.innerHTML = ignoredNoticeUser.innerHTML+'s';
            }
            ignoredNoticeUser.innerHTML = ignoredNoticeUser.innerHTML+' ignored on page:';

            ignoredNoticeUser.setAttribute('id', 'ignored-notice-heading');
            ignoredNotice.appendChild(ignoredNoticeUser);        
            for (var i in ignoredUsers) {
                var ignoredNoticeUser = document.createElement('li');
                var ignoreLink = document.createElement('a');
                ignoreLink.setAttribute('class', 'author-pane-line author-pane-link-line');
                ignoreLink.setAttribute('href', '');
                ignoreLink.innerHTML = ignoredUsers[i];
                $(ignoreLink).click({asshole: ignoredUsers[i]},function(e){
                    e.preventDefault();
                    // in case "works for me" turns to shit
                    // http://stackoverflow.com/questions/24642541/gm-getvalue-is-not-defined-in-injected-code
                    //console.log("GM_setValue: ", GM_setValue("extra_markdown", true) );
                    if(pvfExpansion.delIgnoreList(e.data.asshole)) {
                        pvfExpansion.fuckThoseGuys();
                    }
                });
                ignoredNoticeUser.appendChild(ignoreLink);
                ignoredNotice.appendChild(ignoredNoticeUser);
            }

            if (document.getElementById('ignored-notice') === null) {
                // add new ignored notice block
                document.getElementsByTagName('body')[0].appendChild(ignoredNotice);
            }
            else {
                $('#ignored-notice').replaceWith(ignoredNotice);
            }
        }
        else {
            $('#ignored-notice').remove();
        }
    },

    scrollListener: function() {
        var scrollPos, anchor, anchorElement;

        // restore saved scroll position
        scrollPos = JSON.parse(pvfExpansion.var.session.getItem('gw2wvw_scrollPos')) || {
            x: 0,
            url: null
        };

        // get anchor from URL
        anchor = document.location.href.match(/\#[^\#\s]+$/i);

        // return to user scroll position
        // obey the anchor when user hasn't previously scrolled
        if ((scrollPos.x === 0) && anchor) {
            anchorElement = document.querySelector(anchor);

            if (anchorElement) {
                anchorElement.scrollIntoView();
                scrollPos = {
                    x: $(unsafeWindow).scrollTop(),
                    url: document.location.href
                };
            }
        }
        else {
            if (scrollPos && (document.location.href == scrollPos.url)) {
                $(unsafeWindow).scrollTop(scrollPos.x);
            }
        }

        // on window scroll
        $(unsafeWindow).scroll(function(){

            // save scroll position
            scrollPos = JSON.parse(pvfExpansion.var.session.getItem('gw2wvw_scrollPos')) || {
                x: 0,
                url: null
            };
            scrollPos.x = $(unsafeWindow).scrollTop();
            scrollPos.url = document.location.href;
            pvfExpansion.var.session.setItem('gw2wvw_scrollPos', JSON.stringify(scrollPos));

        });
    },

    // http://stackoverflow.com/a/10192255
    uniqueArrayEntries: function(array) {
        return $.grep(array, function(el, index) {
            return index === $.inArray(el, array);
        });
    }
};

pvfExpansion.var.css = pvfExpansion.hereDoc(function() {/*
body.html {
  background: #080808 !important;
  margin: 0 !important; 
  padding: 0 !important; 
}

#main, body.overlay, #page, #header, #page-wrapper, #content, #footer-wrapper, #page-title,
#menubar, #menubar .sf-menu > li > a, #navigation, #preview #preview-navigation,
h1, h2, h3, h4, h5, h6, h7, h8, h9 {
  background: transparent !important;
  background-color: transparent !important;
  background-image: none !important;
}

h1, h2, h3, h4, h5, h6, h7, h8, h9 {
  margin-left: 0 !important;
  margin-right: 0 !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
}

#logo, #header-searchbox, #menubar {
  margin: 0 !important; 
  padding: 0 !important; 
}

#page-wrapper {
  width: auto !important;
  margin: 0 !important;
  padding: 0 3% 0 3% !important;
}

#main-wrapper {
  width: auto !important;
  margin: 0 !important;
  padding: 0 !important;
}

#main {
  margin: 10px 0 0 0 !important;
  padding: 0 !important;
}

.node h2 {
  border: none !important;
  margin: 0 0 1em 0 !important;
  padding: 0 !important;
}

.node,
.panel-pane,
.pane-content {
  background: none !important;
  border: none !important;
}

.center-wrapper > .panel-panel {
  width: 48% !important;
}

.center-wrapper > .panel-panel.panel-col-last {
  float: right !important;
}

.pane-front-page .panel-separator {
  margin: 0 0 2em 0 !important;
}

.pane-front-page .view-header {
  margin: 1em 0 !important;
}

.pane-front-page .view-content .node {
  margin: 1em 0 3em 0 !important;
}

.node ul.rate-fivestar-processed {
  padding-left: 0 !important;
}

.node .field-type-taxonomy-term-reference .field-items .field-item:first-child {
  margin-left: 0 !important;
}

.view-header a:not(:hover),
.tabs li a:not(:hover),
.af-button-large:not(:hover),
ul.links a:not(:hover),
ul.pager a:not(:hover) {
  background: none !important;
}

table.sticky-header {
  background: #222 !important;
}

.messages.status {
  background: #511 !important;
  border-color: #922 !important;
  color: #ccc !important;
}

.view-content .views-row,
.view-content .views-table,
.view-content .views-table td,
.view-content .views-table th,
.view-content .views-table tr {
  background: none !important;
}

.view-content .views-row .content {
  clear: both !important;
}

.view-content .views-table{
  cell-spacing: 0 !important;
}

.view-content .views-table th,
.view-content .views-table tr:not(.views-row-last):not(:last-child) {
  border-bottom: 1px solid #555 !important;
}

.view-userposts li.views-row {
  background: none !important;
  list-style: none !important;
  margin: 1em 0 2em 0 !important;
}


/**
 * Superfish Menubar
 * /

#menubar * {
  border: none !important;
}

#menubar .sf-menu li {
  margin: 0 !important;
}

#menubar .sf-menu li > a {
  text-indent: -1em !important;
  padding-left: 2em !important;
}

#menubar .sf-menu li ol  {
  padding-left: .5em !important;
}

#menubar .sf-menu > li {
  margin-bottom: 5px !important;
}

#menubar .sf-menu > li > a.sf-with-ul {
  padding-right: 25px !important;
}


/**
 * Forms
 * /

form fieldset {
  border: none !important;
}

input, select {
  -webkit-filter: invert(100%) grayscale(100%) !important;
  filter: invert(100%) grayscale(100%) !important;
}

.filter-wrapper {
  background-color: transparent !important;
}

label {
  display: inline-block !important;
}

label[for*='author']:after {
  content: ": " !important;
}

.form-item-search-block-form .form-text {
  background: transparent url(http://www.gw2wvw.net/sites/all/themes/mayo/images/xsearch.png.pagespeed.ic.SZj-eBzZGe.png) no-repeat 2px center !important;
  padding-left: 30px !important;
}


/**
 * Avatars
 * /

.user-picture > a > img,
.author-pane-general > .picture > img {
  background: #000 !important;
  border: 2px solid #000 !important; 
  border-radius: 10px !important; 
  padding: 0 !important; 
  margin: 2px 10px !important; 
}


/**
 * Usernames
 * /

.author-name {
  width: 130px !important;
}
.username {
  line-height: 125% !important;
  word-break: break-all !important;
  word-break: break-word !important;
  word-wrap: break-word !important;
  -moz-hyphens: auto !important;
  -webkit-hyphens: auto !important;
  hyphens: auto !important;
}


/**
 * Front page
 * /

body.front .node,
body.front .panel-pane,
body.front .pane-content,
body.front .views-row,
body.front table,
body.front table td {
  background: none !important;
  border-color: transparent !important;
}

/**
 * Front page videos
 * /

body.front table.cols-2 {
  border-collapse: separate !important;
  border-spacing: 10px !important;
}

body.front table.cols-2 td {
  position: relative !important;
  background: #000 !important;
  -webkit-border-radius: 15px !important;
  -moz-border-radius: 15px !important;
  border-radius: 15px !important;
  overflow-y: hidden !important;
  width: 50% !important;
  vertical-align: bottom !important;
}

body.front table.cols-2 td .views-field-title {
  position: absolute !important;
  z-index: 2 !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  background: linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.9) 30%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0) 100%) !important;
  height: 100% !important;
  padding: 0 !important;
}

body.front table.cols-2 td:not(:hover) .views-field-title {
  visibility: hidden !important;
}

body.front table.cols-2 td .views-field-title a {
  display: block !important;
  height: 100% !important;
  padding: .5em .5em 1.5em .5em !important;
  margin: 0 !important;
  text-decoration: none !important;
}

body.front table.cols-2 td .views-field-name,
body.front table.cols-2 td .views-field-term-node-tid {
  position: relative !important;
  z-index: 3 !important;
}

body.front .views-field-field-youtube-video a {
  /**
   * force aspect ratio on youtube thumbnails
   * http://www.sitepoint.com/maintain-image-aspect-ratios-responsive-web-design/
   * /
  display: block !important;
  width: 100% !important;
  position: relative !important;
  height: 0 !important;
  padding: 56.25% 0 0 !important;
  margin: 0 0 1em 0 !important;
  overflow: hidden !important;
}

body.front .views-field-field-youtube-video img {
  position: absolute !important;
  display: block !important;
  max-width: 100% !important;
  max-height: 100% !important;
  left: 0 !important;
  right: 0 !important;
  top: 0 !important;
  bottom: 0 !important;
  margin: auto !important;
}


/**
 * Forum tables
 * /

.forum-table-wrap,
.forum-table tr,
.forum-table td {
  background: none !important;
}

.forum-table tr:not(.views-row-last):not(:last-child) {
  border-bottom: 1px solid #222 !important;
}

.forum-table tr:hover {
  background: #222 !important;
}

.forum-table-topics td.views-field-last-updated {
  width: auto !important;
}


/**
 * Forum posts
 * /

.quote-msg, .quote-msg blockquote {
  background: none !important;
  border: 0 !important;
  border-left: 1px solid #555 !important;
  color: rgb(102, 102, 102) !important;
  font-size: 11pt !important;
  padding: 5px 0 5px 20px !important;
  margin: 1.5em 0 !important;
}

.quote-author {
  display: block !important;
  margin: 0 !important;
  padding: 0 !important;
}

.author-pane-line {
  font-size: .9em !important;
}

.author-pane-line.author-name {
  font-size: 1.5em !important;
}

.author-signature, .post-edited {
  border: none !important; 
  color: #666 !important;
  font-size: .85em !important; 
  margin: 0 0 0 30px !important; 
  padding: 0 !important;
}

.author-signature > blockquote {
  border: none !important; 
  margin: 0 !important; 
  padding: 10px 0 !important;
}

.forum-post {
  background: none !important;
  margin: 0 0 30px 0 !important;
  padding: 10px 20px !important;
}

.forum-post-panel-main {
  border: 0 !important;
}

.forum-post-content {
  padding: .2em 0 1em 2em !important;
}

.forum-post-content, .author-signature {
  /**
   * Force line wrap
   * /
  word-break: break-all !important;
  word-break: break-word !important;
  -moz-hyphens: auto !important;
  -webkit-hyphens: auto !important;
  hyphens: auto !important;
}

.forum-post-content p {
  margin: .75em 0 !important;
}

.forum-post-content > .field-type-text-with-summary {
  /**
   * float clearing caused excessive whitespace in first post of forum thread
   * /
  clear: none !important;
}

.forum-post-footer {
  border: 0 !important;
  background: none !important;
}

.forum-post-info {
  padding: .3em 0 !important;
}

.forum-post-title {
  font-style: italic !important;
  font-size: .9em !important;
  padding: 0 2em !important;
  color: #777 !important;
}

.forum-post-title:before {
  content: "Opening Post:" !important;
  font-style: italic !important;
  font-size: .9em !important;
  padding-right: 1em !important;
}

.forum-jump-links {
  display: none !important;
}

.forum-post-footer ul.links,
.forum-post-footer ul.links > li {
  padding-top: 0 !important;
  padding-right: 0 !important;
  padding-bottom: 0 !important;
  padding-left: 0 !important;
  margin-top: 0 !important;
  margin-right: 0 !important;
  margin-bottom: 0 !important;
  margin-left: 0 !important;
}

.forum-post-footer ul.links > li > a {
  padding-top: .3em !important;
  padding-right: .3em !important;
  padding-bottom: .3em !important;
  padding-left: .3em !important;
  margin-top: 0 !important;
  margin-right: 0 !important;
  margin-bottom: 0 !important;
  margin-left: .3em !important;
}

.forum-post-footer ul.links > li.last > a {
  margin-right: -.3em !important;
}

.forum-post-number {
  margin-right: 0 !important;
}


/**
 * Polls
 * /

.poll > .text, .poll > .total {
  clear: both !important;
  margin: 1em 0 !important;
}

.poll > .bar {
  background: none !important;
  margin: 0 !important;
}
.poll > .bar > .foreground {
  background: #922 !important;
}

.poll > .percent {
  float: right !important;
  margin-top: -1.75em !important;
}

.poll .vote-form,
.poll .vote-form .choices {
  margin: 0 !important;
  text-align: left !important;
}


/**
 * Lightbox
 * /

#outerImageContainer, #imageDataContainer, #bottomNavClose {
  background-color: #000 !important;
}

/**
 * ckEditor
 * /

div.textarea-processed {
  -webkit-filter: invert(90%) brightness(0.8) grayscale(100%) !important;
  filter: invert(90%) brightness(0.8) grayscale(100%) !important;
}


/**
 * PvF Expansion Pack
 * /

.ignore-user {
  display: none !important;
}

.ignore-user-alert {
  background: rgba(10,10,10,0.7) !important;
  border-radius: 10px !important;
  color: #666 !important;
  margin: 1em 20px !important;
  padding: .5em !important;
  min-height: 2em !important;
}

.ignore-user-alert ~ .ignore-user-alert  {
  display: none !important;
}

#ignored-notice { 
  position: fixed !important; 
  z-index: 10000 !important;
  top: 0 !important; 
  left: 0 !important; 
  font-size: 10pt !important; 
  background: black !important; 
  border-bottom-left-radius: 7px !important; 
  border-bottom-right-radius: 7px !important; 
  max-height: 25% !important; 
  overflow-y: auto !important; 
  padding: .25em 1em !important; 
  list-style-type: none !important; 
} 
#ignored-notice:not(:hover) > li:not(#ignored-notice-heading) {
  display: none !important;
} 
#ignored-notice:not(:hover), #ignored-notice:not(:hover) * {
  opacity: 0.5 !important;
}

.quote-toggle-img {
  float: right !important;
}
.forum-post-content .quote-author:hover {
  cursor: pointer !important;
  -webkit-filter: invert(100%) !important;
  filter: invert(100%) !important;
}
*/});


/**
 * Execute code
 */

// Initialize again for every readystatechange
document.onreadystatechange = function () {
    pvfExpansion.init();

    if (document.readyState == 'complete') {
        pvfExpansion.addForumPostQuote();
        pvfExpansion.cleanerMarkup();
    }
};

// Initialize for browser forward/back button
pvfExpansion.init();

// End of line
pvfExpansion.var.end = new Date().getTime();
pvfExpansion.var.time = pvfExpansion.var.end - pvfExpansion.var.start;
console.log('PvF Expansion execution time: ' + pvfExpansion.var.time);
