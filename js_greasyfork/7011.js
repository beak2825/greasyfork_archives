// ==UserScript==
// @name            Hentai Foundry Direct Links
// @namespace       HentaiFoundryDirectLinks
// @description     Changes gallery links into direct image links for use with DTA!
// @include         http://www.hentai-foundry.com/user-*
// @include         http://www.hentai-foundry.com/user_pictures-*
// @include         http://www.hentai-foundry.com/scraps-*
// @include         http://www.hentai-foundry.com/favorite_pictures-*
// @include         http://www.hentai-foundry.com/recent_pictures-*
// @include         http://www.hentai-foundry.com/featured*
// @include         http://www.hentai-foundry.com/cat-*
// @include         http://www.hentai-foundry.com/pic-*
// @include         http://www.hentai-foundry.com/pic_fullsize-*
// @include         http://www.hentai-foundry.com/pictures/user/*
// @include         http://www.hentai-foundry.com/categories/*
// @version         0.9
// @grant           none
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/7011/Hentai%20Foundry%20Direct%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/7011/Hentai%20Foundry%20Direct%20Links.meta.js
// ==/UserScript==

// ================================================================================
//
// Changes the HREF of anchor tags in the HTML to point directly to the image instead of a page containing it.
// This script is best used in conjunction with the DownThemAll! addon for firefox.
// Create a new filter in DTA! with the regex:
// /pictures\.hentai-foundry\.com\/\w{1}\/[0-9a-zA-Z-_]+\/\d+\.(jpg|png|gif)$/
// Set the renaming mask to:
// *name* - *text*.*ext*
//
// ================================================================================
// Change Log:
//  
// version 1.4
//    * Added support for URLs of type "pic_fullsize-*.php"
//    * Fixed a regex bug dealing with artist names containing hyphens
//    * Added information regarding use of dTa OneClick filtering
// version 1.3
//    * Added support for URLs of type "pic-*.html"
//    * Picture associated text are now renamed as they are in the galleries
// version 1.2
//    * Added table lookup for artist to decide which file type to link
//    * No longer requires input for file type
// version 1.1
//    * Image text in galleries changed to "TITLE - ARTIST" for use with DTA!
//    * Added advanced regex matching for handling multiple pages
//    * Added the use of XPath query for complex DOM traversal and retrieval
// version 1.0
//    * Initial framework for changing links of thumbnail squares
//    * Enter 0, 1, or 2 for extension type
//
// ================================================================================
//window.location.reload(true);
//alert ('Hallo Welt!');



// =====================================================================
//  Find all TD tags with a class of thumb_square
//  For each square in the thumb_squares   
//    Find all anchors in the square
//    Replace the A link around the thumbnail with a direct link
//    Replace the IMG.title with a new format "Title - Artist"
// =====================================================================
  var imageExtensions = [".jpg", ".png", ".gif", ".jpeg", ".bmp", ".tiff", ".swf"];
  var thumbs = xpath("//TD[@class='thumb_square']");
  var pictureTitles = xpath("//span[@class='thumbTitle']");
  var pictureTables = xpath("//td[@class='thumb_square']/table");
  var imageAnchors = xpath("//a[img/@class='thumb']");
  
  for (var i = 0; i < thumbs.snapshotLength; i++) {
	  var pictureTitle = pictureTitles.snapshotItem(i).innerHTML;
	  var aIMG = imageAnchors.snapshotItem(i);
	  //search artist and imagenumber on href link
	  var hrefMatch = aIMG.href.match(/(?:\/pictures\/user\/)(.+\/)/)[1];
	  var artist = hrefMatch.match(/([0-9a-zA-Z-_]+)/)[1];
	  var imageNumber = hrefMatch.match(/(?:\/)([0-9]+)/)[1];
	  
	  //create letter of artist for link
      var letter = artist.charAt(0).toLowerCase();
      if ( /\d/.test(letter) ) { letter = 0; }
	  
	  //Search for any special character and remove them
	  var pictureRemTitle = removeSpecialCharacters(pictureTitle);
	  var artistRemSpec = removeSpecialCharacters(artist);
	  
	  // create link und titele for picture
	  var imageTitel =  pictureRemTitle + ' - ' + artistRemSpec + ' - ' + imageNumber;
      var tmpLink = "http://pictures.hentai-foundry.com/" + letter + "/" + artist + "/" + imageNumber;
	  
	  //change link and titel of thumbnail
      aIMG.href = tmpLink + imageExtensions[0];
      aIMG.firstChild.title = imageTitel;
	  
	  //search parent of titele
	  var titelP = thumbs.snapshotItem(i);
	  var titelK = pictureTables.snapshotItem(i);
	  
	  //create new line after title
	  var br = document.createElement("b");
	  br.innerHTML="<br>";
	  titelP.insertBefore(br, titelK);

	  //create elementes for extralinks for all extensions in "imageExtensions"
	  for (var j = 0; j < imageExtensions.length; j++) {
		fLink = document.createElement("a");
		fLink.setAttribute("class", "extralink");
		fLink.setAttribute("title", imageTitel);
		fLink.href = tmpLink + imageExtensions[j];
		
		//create icons for links
		var fIMG = "<img border='0' alt='extralink " + imageExtensions[j] + "' title='" + imageTitel + "' src='http://img.hentai-foundry.com/themes/Hentai/images/rating_icons/ic_female.gif'>";
		fLink.innerHTML=fIMG;
		
		//include all elements after titel
		titelP.insertBefore(fLink, titelK);
	  }
  }
// =============================================================================================================
// XPath function defined for easy, compact reuse.
function xpath(xpathExpression, contextNode) {
	if (contextNode === undefined) { contextNode = document; }
    return document.evaluate(xpathExpression, contextNode, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
}
// =============================================================================================================
// =============================================================================================================
//Search for  any special characters and remove them
function removeSpecialCharacters(specString) {
	specString = specString.replace(/(&|\+)/g, "and");
	specString = specString.replace(/(\s|-|_|\||\(|\)|\[|\]|\/|\\|\,|\:|\;)/g, ".");
	specString = specString.replace(/[^0-9a-zA-Z.]/g, "");
	specString = specString.replace(/\.+/g, ".");
	specString = specString.replace(/(^\.|\.$)/g, "");
	return specString;
}
// =============================================================================================================
// Very useful function since there isn't an insertAfter function in the DOM.
// Call it inside scripts, it expects insertAfter(the new element to be inserted,
// the element you want it to be inserted after);

//create function, it expects 2 values.
function insertAfter(newElement,targetElement) {
	//target is what you want it to go after. Look for this elements parent.
	var parent = targetElement.parentNode;
    //if the parents lastchild is the targetElement...
		if(parent.lastchild == targetElement) {
			//add the newElement after the target element.
			parent.appendChild(newElement);
		} else {
			// else the target has siblings, insert the new element between the target and it's next sibling.
			parent.insertBefore(newElement, targetElement.nextSibling);
		}
}