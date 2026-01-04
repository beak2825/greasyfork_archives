// ==UserScript==
// @name         Bluesky - clickable links to images and show uncropped thumbnails
// @namespace    bluesky_linkify
// @version      1.0
// @license      GNU AGPLv3
// @description  All image posts in Bluesky Home, other blog streams and single post views link to their high-res "fullsize" version. Thumbnail images in the stream are modified to display uncropped.
// @author       marp
// @homepageURL  https://greasyfork.org/en/users/204542-marp
// @match        https://bsky.app/
// @match        https://bsky.app/*
// @exclude      https://bsky.app/settings
// @exclude      https://bsky.app/settings/*
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/560454/Bluesky%20-%20clickable%20links%20to%20images%20and%20show%20uncropped%20thumbnails.user.js
// @updateURL https://update.greasyfork.org/scripts/560454/Bluesky%20-%20clickable%20links%20to%20images%20and%20show%20uncropped%20thumbnails.meta.js
// ==/UserScript==

// jshint esversion:11

(function() {
    'use strict';


  // To be used on image elements.
  // replaces "cover" with "contain" to display the image uncropped
  // the additional style settings are for robustness. Currently, all these styles already exist with exactly these values on thumbnail image elements
  function adjustObjectFit(myNode) {
    var myStyle = myNode.getAttribute("style");
    if ( (myStyle !== null) && ( !(myStyle.includes("contain")) ) ) {
      myNode.style.objectFit = "contain";
      myNode.style.objectPosition= "left 50% top 50%";
      myNode.style.width = "100%";
      myNode.style.height = "100%";
      myNode.style.position = "absolute";
      myNode.style.top = "0px";
      myNode.style.left = "0px";
      myNode.style.botom = "";
      myNode.style.right = "";
    }
  }


  // inserts an anchor link that has its default actions (mouse click, etc.) disabled.
  // The link target can still be opened/accessed via middle-mouse click or via right-click | open link in new tab, etc.
  // This way, a mouse click continues to open the normal Bluesky image overlay
  function insertPassiveLinkElement(myDoc, wrapElement, linkTarget) {
    var newnode;
    var parentnode;

    newnode = myDoc.createElement("a");
    newnode.setAttribute("href", linkTarget);
    newnode.setAttribute("target", "_blank");
    newnode.addEventListener("click", (function(e){e.preventDefault();}));
    parentnode = wrapElement.parentNode;
    parentnode.replaceChild(newnode, wrapElement);
    newnode.appendChild(wrapElement);
  }


  // gets URL to fullsize image without specifying the desired image type ("@jpeg")
  // the image eccessed via this seems to default to whatever image type was originally uploaded.
  // BUT: this kind of URL is not normally used by Bluesky page code.
  // -> behavior of image URLs without suffix "@<type>" might stop working with future Bluesky page updates
  // ...but for now, it does exactly what is needed for the purpose of this user script...
  // https://cdn.bsky.app/img/feed_thumbnail/plain/did:plc:jbvnehrrdqoulco4rf5gxg5r/bafkreibvbigkfxovvm44yl6gedii24hvgybmhgg34thbzdv5axgxr7doby@jpeg
  // ->
  // https://cdn.bsky.app/img/feed_fullsize/plain/did:plc:jbvnehrrdqoulco4rf5gxg5r/bafkreibvbigkfxovvm44yl6gedii24hvgybmhgg34thbzdv5axgxr7doby
  function getFullsizeImageURL(imageurl) {
    return imageurl.replace(/(\/img\/feed_)([^\/]+)(\/.+)(@\w+)$/, "$1fullsize$3");
  }


  // process any and all image posts within the context
  function processImages(myDoc, myContext) {
    //console.info("processImages-0 ", myContext);

    if (myContext.nodeType === Node.ELEMENT_NODE) {
      // this assumes that the added node CONTAINS image elements, i.e. is an ancestor of image(s)
      // Currently, in Bluesky, all thumbnail images are leaf nodes, so the above is always true
      // The XPath also checks that there is no parent anchor link element to the img - as that would be an image already processed by this user script
      var matches=myDoc.evaluate("./descendant-or-self::img[contains(@src,'/img/feed_') and not(parent::a) and (ancestor::button/ancestor::div[contains(@data-testid,'Item-by-')])]",
                                 myContext, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
      for(var i=0, el; (i<matches.snapshotLength); i++) {
        el=matches.snapshotItem(i);
        var imageurl = el.src;
        if ((imageurl !== null) && (imageurl.length > 30)) {
          adjustObjectFit(el);
          insertPassiveLinkElement(myDoc, el, getFullsizeImageURL(imageurl));
        }
      }
    }
  }


  // USER SCRIPT ENTRY POINT

  var rootmatch = document.evaluate("//div[@id='root']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
  var rootnode = rootmatch.singleNodeValue;

  if (rootnode !== null) {
      // create an observer instance and iterate through each individual new node
      var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          mutation.addedNodes.forEach(function(addedNode) {
            processImages(mutation.target.ownerDocument, addedNode);
          });
        });
      });

      // configuration of the observer
      var config = { attributes: false, childList: true, characterData: false, subtree: true };

      //process already loaded nodes (the initial posts before scrolling down for the first time)
      processImages(document, rootnode);

      //start the observer for new nodes
      observer.observe(rootnode, config);
  }

})();