// ==UserScript==
// @name        EBay: Custom Page Controls And Seller Block List
// @author		Scott Michaels
// @description Adds more flexibility to eBay search results. Also, includes a seller block list and can filter out result items from blocked sellers.
// @namespace   http://se7en-soft.com
// @include     http*://*.ebay.*/sch/*
// @include		http*://*.ebay.*/dsc/*
// @include		http*://*.ebay.*/mbf/PurchaseHistory?MyEbay*
// @include		http*://*.ebay.*/ws/eBayISAPI.dll?MyEbay*
// @include		http*://*.ebay.com/myb/*
// @version     2017.11.26.2
// @grant		metadata
// @grant       unsafeWindow
// @grant		GM_xmlhttpRequest
// @grant		GM_addStyle
// @grant		GM_getValue
// @grant		GM_setValue
// @grant		GM_deleteValue
// @grant		GM_setClipboard
// @connect     shiptrack.ebay.com
// @connect     *
// @run-at      document-start
// @nocompat    Chrome
// @downloadURL https://update.greasyfork.org/scripts/8334/EBay%3A%20Custom%20Page%20Controls%20And%20Seller%20Block%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/8334/EBay%3A%20Custom%20Page%20Controls%20And%20Seller%20Block%20List.meta.js
// ==/UserScript==

(function(){	
	const nav = navigator;
	const codeName = nav.appCodeName;
	const product = nav.product;
	const vendor = nav.vendor;

    const wait = function(func, howLong) {
        setTimeout(()=>{func();}, howLong);
    };

	const SharedObjects = {
		
		//Variables
		StartupInterval: 0,
		
		//Interval values
		Intervals : {
			Startup: 60,
			Timeout: 100
		},
		
		//local arrays
		Arrays : {
			OriginalPrices: [],
			ResultItems: [],
			FilteredItems: [],
			AllSellerData: [],
			TruncatedSellers: [] //jagged array
		},
		
		//strings
		Constants : {
			IsChrome: vendor === "Google Inc.",
			
			ClipboardIcon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAiJJREFUeNqMU0toE1EUPRkmaYY4pBRMCYKkFQJtSF1UiriwK3WjbkSxKhbiQuhCaDeFLgpi6aa7KoiLBkRBEXUhgtSFi6wsVGgaS2msTVM/MZR+YhOM7czEe19+b0ooXji8zz3nvvuZcTzohTCHAzVLaR2uVU/oPG0PV67WA4WFt21/FnernFKpvKp1GR4RunnT8mtR7Tp3xncycsfP54/Rycz36Zej8MKocD8RbouH7/fWAsyevRLpTiQSONI/BbfbBa/3kHDkcnkUi7v48fgWwuEw3r+IcoATIgPTqqcQHJjCzJOniMWmSeyFrutwOp3IFwr4ncvBd3oIwb6rePc8WtOoplkPwGVdu3EdqZUVNLK29nbBkTW2DEzqjGVZOBoINAxgkq+kKJA1CkerwqIAp14HYRAxNjeHRDqNL9ksUpmMuGMwR9aohmV/4cOFBRjk6QmFbK8blbwdNG9ZoxqmvYT4yDBC98Yxv7xMk3BT94tiZdM0Dcf8fsga1TDsAYJ3x7BHmXRQwxr2gTiyRuFoVXAJo890ke4M9SBJPWB84x7QHYM5skbd21fCyKUN4Tje2dmwB8yRNUo6L2VAzocTE6Lbs/E4vq6t4fPSklgZfC9KqPBZq776CVxsBfyu8hgjg4MizfC+KVSnxJy/9EtlCG+y5Z9Jo41+uZkO9NlqHg8OMuZs7pB4Gz467ogABF+6gORNvQn/Y1slJFnDrfknwAA40SgApj324QAAAABJRU5ErkJggg==",
			CloseButtonIcon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACbklEQVR42qWTXUiTURjH/+/XPt5tbII1lokoSSAV7Cqo0UU5RkVpTIOiUqEb+6DvKKEcBhZhHxfSboS0Dy9aiyxK1rSLWNHdbkQQw5KMZUnb2N53be+7d529OpnOLqLn5jz/85zzO895nnMo/KdRxYIHbpmB2giwn8jfy9bqKoAnUWBSBM6VADRAd295+eU16TTaEok3P4FGMp1aCOttwNBjk8k5odXi1Nzc9QzQsQhggEs9Fkv3vtZWKidJ+DgwgOPJ5MgvYG8+vgp40Wc01m9qaQHFcXjW35+7EIt1ZIEbeYDOBcS8zc1azmZTj8vGYgj5/TgpCKP5BV6DYcdmtxuMxaLGpUgE7T5fOgBYClc4dNFsvn/C6WRpnp+HJBL4EAio/haXC4zJpPqKKKI3GJRvxuNtRD4qLqL7NM8Pnnc4NAWIIgjqSBsMi5t7QqHMXVE8SKS/pAvEdrVrtU+v2O36AqRg+c3XwuGUN51uIvL1im0kZrQC714aDPbqurolgS/j49gjCOHvwDYikysBTGsJeZDjHBurqgBS7SVGujM2PY0DkhSaIZmSmUQxwFQDDPtZdus6qxUUw6iTciajjqxGo465bBafZmfhluX3U8DOPEQF6IDbYzR9prKsjFSMVhdnyImH4/Efef+h2bxaU8hIUTATjWKDotwhr+ysCtADnucs2+nUE4+ikJJlNInit2GgXq0sMOLj+Qo9y5I0cgimUmiU5S4C6Cx+yp4HNH11N8NQDZL0+e385qmFcM12AhniuOpX2WzuiKJ0kct5SrpAkj9WCxydABqI/LqsQ5XryX+YBPoU4N7f2vjP9gfr3dEZbh82JAAAAABJRU5ErkJggg==",
			ReloadButtonIcon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAyUlEQVR42mNkoBAwkqGHHYh/EjLAGIjjgFgaquYJEC8E4nNA3ArEM4H4ETYDmIG4H4j/AfEkIL4HFVcC4jyo+l9APAWIH2IzAKTpIBCvRRMXAGJ1IA4G4gwg1sVmAMjZsUBcgMVLmkDsh8SfDsSf0A2YCMX3GEgAyAasAeIQIvXpAPEVSgyAqyXHC7AYKSAlEJHBBCBeDMRn0Q0AAVzRCAOgaLSHuoABmwGEEhITEBcC8V9cBiB7B5aUQeApEC+CORsZkJOZqGsAAKyGKhGReVeSAAAAAElFTkSuQmCC",
			ShowTopPager: "EBay.SellerBlockList.Property.ShowTopPager",
			RankByPrice: "EBay.SellerBlockList.Property.RankByPrice",
			FixLinks: "EBay.SellerBlockList.Property.FixLinks",
			FilterResults: "EBay.SellerBlockList.Property.FilterResults",
			UsePlaceholders: "EBay.SellerBlockList.Property.UsePlaceholders",
			BlockedSellerList: "EBay.SellerBlockList.Property.BlockedSellersList",
			RemoveSponsoredItems: "Ebay.SellerBlockList.Property.RemoveSponsoredItems",
			//StyleSheetLocation: "https://cdn.se7en-soft.com/greasemonkey/ebayenhancer/ebay.css",
			StyleSheetLocation: "https://gist.githubusercontent.com/se7ensoft/8ae678371193d638cd76a73961fe48a7/raw/41fed22db26e50e823f8d921d830ac466553b867/ebay.css",
			NegativeFeedbackLink: "http://feedback.ebay.com/ws/eBayISAPI.dll?ViewFeedback2&userid=[SELLERNAME]&myworld=true&items=25&iid=-1&de=off&which=negative&interval=365",
            SearchTrackingLink: "https://www.google.com/search?source=hp&ei=cOYaWtmMO4ujggeVnZjACw&q=[TRACKING#]&oq=[TRACKING#]&gs_l=psy-ab.12...0.0.0.1722.0.0.0.0.0.0.0.0..0.0....0...1c..64.psy-ab..0.0.0....0.c9-bd2l-Fo8"
		}
			
	};
	
	//local property object
	const ScriptProps = {};

	const EBayUsabilityEnhancer = {
		
		Initialize : function(){

			//Get object properties setup for access
			Utilities.SetupProperties();
			
			//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			//Get the ball rollin'.
			const pgSetup = this.SetupPage.bind(this);
			SharedObjects.StartupInterval = setInterval(pgSetup, SharedObjects.Intervals.Startup);
			//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		
			if(SharedObjects.Constants.IsChrome)
				document.getElementsByTagName("body")[0].style.overflowY = "auto";
		},
		
		//InjectStyles: Injects a style file from cdn.se7en-soft.com. This file will eventually be hosted elsewhere.
		//This file contains element styles that are used througout this script.
		InjectStyles : function(callback){
			try{
				GM_xmlhttpRequest({
					method: "GET",
					url: SharedObjects.Constants.StyleSheetLocation + "?" + Math.random(),
					onload: function(r){
						const css = r.responseText;
						GM_addStyle(css);
						
						if(callback)
							callback.call(this);
					}
				});
			}catch(e){
				alert(e);
			}
		},
		
		SetupPage : function() {
			const self = this;
			const winLoc = window.location.href;
			
			//determine if we're on the Purchase History page or not.
			if(winLoc.indexOf("PurchaseHistory?") !== -1 || winLoc.indexOf("eBayISAPI.dll?MyEbay") !== -1){
				const ordersDiv = document.getElementById("orders");
				if(ordersDiv){
					clearInterval(SharedObjects.StartupInterval);
					const itemsContainer = ordersDiv.querySelector("div.ajax-wrap div.result-set-r");
					
					if(itemsContainer){
						const itemContainers = itemsContainer.querySelectorAll("div.order-r");
						const len = itemContainers.length;
						for(let i = 0; i < len; i++){
							const item = itemContainers[i];
							
							const sellerLink = item.querySelector("div div a.seller-id");
							if(sellerLink){
								//append X button to allow blocking this seller...
								const sellerName = sellerLink.textContent.trim();
								const img = new Image();
							
								img.setAttribute("style", "height:12px;width:12px;cursor:pointer;");
								img.setAttribute("Seller-ID", sellerName);
								
								sellerLink.parentNode.appendChild(img);
								
								img.onload = function(){
									const seller = this.getAttribute("Seller-ID");
									this.title = "Add seller '" + seller + "' to the block list.";
									this.addEventListener("click", function(){
										SellerManager.ConfirmBlockSeller(seller);
									}, false);
								};
								
								img.src = SharedObjects.Constants.CloseButtonIcon;
							}
						}
					}
				}
				
				const trackingLabelContainers = document.getElementsByClassName("tracking-label");
				if(trackingLabelContainers && trackingLabelContainers.length > 0){
					const containers = [].slice.call(trackingLabelContainers);
					containers.forEach(function(labelContainer, index){
						
						const labelLink = labelContainer.querySelector("a");
						const href = labelLink.dataset.url;
						const b = labelLink.querySelector("b");
						if(b)
							labelLink.removeChild(b);

                        const trackingNumber = labelLink.textContent;
						labelLink.textContent = trackingNumber;

                        const trackingLink = document.createElement("a");
						trackingLink.textContent = " [Tracking # Search]";

                        let tHref = SharedObjects.Constants.SearchTrackingLink.replace("[TRACKING#]", trackingNumber);
                        while(tHref.indexOf("[TRACKING#]") !== -1)
                            tHref = tHref.replace("[TRACKING#]", trackingNumber);

                        trackingLink.href = tHref;
						trackingLink.target = "_blank";

						labelContainer.appendChild(trackingLink);
					});
				}
				
			} else { //we're on an item results page
			
				//find DIV elements for each product item in the search page
				const itmLinks = document.getElementsByClassName("sresult");
				
				//gotz links?
				if(itmLinks && itmLinks.length > 0){
					
					//remove the interval that was set when the function was first kicked off.
					clearInterval(SharedObjects.StartupInterval);
					
					try{
						//download and inject the css styles for our elements
						this.InjectStyles(() => {
							self.BeginOverlayConstruction();
						});
					} catch(e){
						alert(e);
					}

					//get the item prices and stuff them into an array
					Utilities.GetItemPrices();
					
					//loop through the collection of DIV elements
					for(let i = 0; i < itmLinks.length; i++){
					
						//get the DIV at index 'i', from the collection
						const dLnk = itmLinks[i];
						SharedObjects.Arrays.ResultItems.push(dLnk);
					}

				}
			}
		},
		
		//BeginOverlayConstruction: Begins construction of the control and display it on the page.
		BeginOverlayConstruction : function(){

			//create the top pagination bar
			UIBuilder.CreateTopPagerControl();
			
			//create the overlay container
			const overlay = UIBuilder.BuildOverlay();
			
			//add controls to the overlay container
			UIBuilder.BuildOverlayControls(overlay);
			
			const badSellerBox = document.getElementById("GM_eBayOverlay_BadSellerBox");
			UIBuilder.BuildBlockedSellersBox(badSellerBox);
			SellerManager.AddBlockedSellers();
		
			//setup the controls on the overlay container.
			UIBuilder.OverlaySetup();
			
			//show the primary control overlay!
			document.getElementById('GM_eBayOverlayContainer').style.visibility = 'visible';
		},
		
		//ToggleResultOrder: Reorders items from lowest to highest, or returns them to their original order.
		ToggleResultOrder : function(lowToHigh){
			if(SharedObjects.Arrays.OriginalPrices.length == 0) return;
			
			const pArray = SharedObjects.Arrays.OriginalPrices.slice(0);
			
			if(lowToHigh) {
				try{
					pArray.sort(SortFunctions.SortLowToHigh);
				} catch(e){
					alert(e);
				}
			}	
			
			const results = document.getElementById("ListViewInner");
			//var results = document.getElementsByClassName("rsittlref");
			//var resultParent = results[0].parentNode;

			while(results.childNodes.length)
				results.removeChild(results.firstChild);
				
			for(let i = 0; i < pArray.length; i++)
				results.appendChild(pArray[i][0]);
		},
		
		//ToggleLinkFix: Toggles links to open in a new tab/window, or not.
		ToggleLinkFix : function(openNew){
			
			for(let i = 0; i < SharedObjects.Arrays.ResultItems.length; i++){
				const dLnk = SharedObjects.Arrays.ResultItems[i];
				
				//grab the anchor element from the H3 or H4 title element
				const anchor = dLnk.querySelector('h3 a') || dLnk.querySelector("h4 a");
				
				if(anchor){
					if(openNew){
						//get the link pointer location
						const href = anchor.href;
						
						//attach to the 'onClick' event for the anchor element so that it opens the link in a new window/tab
						anchor.setAttribute('onclick',"window.open('" + href + "');return false;");
					} else {
						anchor.removeAttribute('onclick');
					}
				}
			}
		},
		
		//ToggleTopPager: Toggles the visibility of the top pagination control.
		ToggleTopPager : function(show){
			document.getElementById("Pagination2").style.visibility = show ? 'visible' : 'collapse';
		},
		
		//ToggleResultFilterBar: Toggles the display of the filtered result bar.
		ToggleResultFilterBar : function(result, memberName, show){
			let filterBar = result.querySelector("tr.GM_eBayBadSeller_ResultFilterBarContainer");
			
			if(memberName.lastIndexOf("..") !== -1){
				const badSellers = ScriptProps.BlockedSellerList;
	
				const len = badSellers.length;
				for(let i = 0; i < len; i++){
					const bs = badSellers[i].toLowerCase();
						
					let pSellerName;
					if(memberName.lastIndexOf("..") !== -1){
							pSellerName = memberName.substring(0, memberName.lastIndexOf("..") - 1);
					} else 
						pSellerName = memberName;
					
					if(bs.indexOf(pSellerName) !== -1){
						memberName = bs;
						break;
					}
				}
			}

			if(show){
				if(!filterBar){
					
					filterBar = document.createElement("tr");
					filterBar.setAttribute("class", "GM_eBayBadSeller_ResultFilterBarContainer");
					
					const cell = document.createElement("td");
					filterBar.appendChild(cell);
					
					const dvBar = document.createElement("div");
					dvBar.setAttribute("class", "GM_eBayBadSeller_ResultFilterBar");
					cell.appendChild(dvBar);
					
					const table = document.createElement("table");
					table.style.width = "100%";
					const tRow = document.createElement("tr");
					table.appendChild(tRow);
					
					for(let i = 0; i < 4; i++){
						const tCell = document.createElement("td");
						tRow.appendChild(tCell);
					}
					
					dvBar.appendChild(table);
					
					let span = document.createElement("span");
					span.setAttribute("class", "GM_eBayBadSeller_FilterBarHeader");
					span.textContent = "Filtered Result [" + memberName + "]";
					
					tRow.childNodes[0].appendChild(span);
				
					span = document.createElement("span");
					span.setAttribute("class", "GM_ebayHeader");
					
					const link = document.createElement("a");
					link.setAttribute("class", "GM_eBayBadSeller_FilterBarLink");
					link.setAttribute("target", "_blank");
					link.textContent = "(View Listing)";
					link.title = "View item listing.";
					

					let anchor = result.querySelector("h3 a");
					
					if(!anchor)
						anchor = result.querySelector("h4 a");
					
					link.href = anchor.href;
					span.appendChild(link);
					
					tRow.childNodes[2].appendChild(span);
								
					span = document.createElement("span");
					span.title = "Remove";
					span.textContent = "X";
					span.setAttribute("class", "GM_eBayBadSeller_FilterBarCloseButton");
					
					span.addEventListener('click', function(e){
						let p = e.target.parentNode;
						while(p != null){
							if(p.getAttribute("class") == "GM_eBayBadSeller_ResultFilterBarContainer")
								break;
								
							if(p.parentNode != null)
								p = p.parentNode;
							else 
								break;
						}
						
						p.parentNode.setAttribute("data-removed", true);
						p.style.visibility = 'collapse';
					});

					tRow.childNodes[3].appendChild(span);
						
					const tbody = result.querySelector("tbody");
					const id = result.attributes["listingid"].value;
					
					
					const children = [];
					while(result.firstChild){
						children.push(result.firstChild);
						result.removeChild(result.firstChild);
					}
					
					result.style.display = "none";
					
					SharedObjects.Arrays.FilteredItems.push([children,id,memberName]);
						
					if(!ScriptProps.UsePlaceholders)
						filterBar.style.visibility = 'collapse';
					
					if(!result.attributes["data-removed"])
						result.appendChild(filterBar);
						
				} else {		
					filterBar.style.visibility = ScriptProps.UsePlaceholders ? 'visible' : 'collapse';
				}
			} else {
				if(filterBar)
					filterBar.style.visibility = 'collapse';
				
				const id = result.attributes["listingid"].value;
				const len = SharedObjects.Arrays.FilteredItems.length;
				let sellerData, content;
				
				for(let i = 0; i < len; i++){
					const fItem = SharedObjects.Arrays.FilteredItems[i];
					if(fItem[1] == id){
						const seller = SellerManager.GetSellerById(id);
						if(seller && seller.ID.lastIndexOf("...") !== -1){
							const fuzzyMatch = SellerManager.FuzzyMatchedName(seller.ID);
							if(fuzzyMatch){
								content = fItem[0];
								break;
							}
						} else if(seller && seller.ID === memberName){
							content = fItem[0];
							break;
						}
					}
				}
				
				if(content){
					for(let n = 0; n < content.length; n++){
						const c = content[n];
						result.appendChild(c);
					}
					
					if(filterBar)
						result.removeChild(filterBar);
					
					result.style.display = "block";
				}
			}
		},
		
		ToggleRemoveSponsoredItemResults : function(){
			const allItems = document.querySelectorAll("li.sresult.lvresult");
			for(let itm of allItems){ 
				const sponsoredSpan = itm.querySelector("div.promoted-lv");
				if(sponsoredSpan) {
					itm.style.display = ScriptProps.RemoveSponsoredItems ? "none" : "block";
				}
			}
		},

        ToggleRemoveTopRatedItemResults : function(){
            const allItems = document.querySelectorAll("li.sresult.lvresult");
			for(let itm of allItems){
				const sponsoredSpan = itm.querySelector("img.iconETRS2");
				if(sponsoredSpan) {
					itm.style.display = ScriptProps.RemoveTopRatedItems ? "none" : "block";
				}
			}
        },
		
		//ToggleFilterBlockedSellerResults: Toggles blocked seller item results.
		ToggleFilterBlockedSellerResults : function(filterThem){
			const resultCount = SharedObjects.Arrays.OriginalPrices.length;
			
			const fiaLen = SharedObjects.Arrays.FilteredItems.length;
			
			 if(fiaLen > 0){
				for(let i = 0; i < fiaLen; i++){
					const filteredItem = SharedObjects.Arrays.FilteredItems[i];
					const itemId = filteredItem[1];
					const priceItem = Utilities.GetResultItem(itemId);
					if(priceItem){
						const memberName = filteredItem[2];
						this.ToggleResultFilterBar(priceItem, memberName, filterThem);
					}
				}
			}
			
			if(filterThem){
				for(let i = 0; i < resultCount; i++){
					
					const resultItem = SharedObjects.Arrays.OriginalPrices[i][0];
					const listingId = resultItem.attributes["listingid"].value;
					let skip = false;
					
					//loop through the 'SharedObjects.Arrays.FilteredItems' and see if the current 'resultItem' is contained in it.
					//if so, we'll not double process it. The check is based on the listingId value.
					for(let n = 0; n < SharedObjects.Arrays.FilteredItems.length; n++){
						const fi = SharedObjects.Arrays.FilteredItems[n];
						const fid = fi[1];
						if(fid === listingId){
							skip = true;
							break;
						}
					}
									
					//should we skip passed everything and continue?
					if(skip) continue;
					
					const sd = SellerManager.GetSellerById(listingId);
					
					if(sd){
						let userName = sd.ID;

						if(userName.length > 0){
							const fn = SellerManager.FuzzyMatchedName(userName);
							userName = fn || userName;
							if(SellerManager.IsBlockedSeller(userName, true)){
								
								const blockedUserSpan = document.getElementById("EBayEnhancer_BlockedSeller_" + userName);
								blockedUserSpan.style.opacity = "1";
								this.ToggleResultFilterBar(resultItem, userName, true);
							}
						}
					}
				}
			} else {
				for(let i = 0; i < resultCount; i++){
					const result = SharedObjects.Arrays.OriginalPrices[i];
					this.ToggleResultFilterBar(result[0], "", false);
				}
			}
		},
		
		//ToggleFilteredItemPlaceholders: Toggles visibility of removed item placeholders.
		ToggleFilteredItemPlaceholders : function(show){
			const filterBars = document.getElementsByClassName("GM_eBayBadSeller_ResultFilterBarContainer");
			const len = filterBars.length;
			
			if(!show){	
				if(len > 0){
					for(let i = 0; i < len; i++){
						const fbar = filterBars[i];
						fbar.style.visibility = 'collapse';
						fbar.parentNode.style.display = "none";
					}
				}
			} else {
				if(len > 0){
					for(let i = 0; i < len; i++){
						const fbar = filterBars[i];
						const removed = fbar.parentNode.attributes["data-removed"];
						if(removed == undefined){
							fbar.style.visibility = 'visible';
							fbar.parentNode.style.display = "block";
						}
					}
				}
			}
		},
		

		//CleanGMValues: Deletes all saved values associated with this script.
		CleanGMValues : function(){
			GM_deleteValue(SharedObjects.Constants.BlockedSellerList);
			GM_deleteValue(SharedObjects.Constants.FilterResults);
			GM_deleteValue(SharedObjects.Constants.RemoveSponsoredItems);
			GM_deleteValue(SharedObjects.Constants.ShowTopPager);
			GM_deleteValue(SharedObjects.Constants.RankByPrice);
			GM_deleteValue(SharedObjects.Constants.FixLinks);
			GM_deleteValue(SharedObjects.Constants.UsePlaceholders);
		},
		
		ResetAll : function(){
			this.CleanGMValues();
			location.reload();
		}
		
	};

	const UIBuilder = {
		//BuildOverlay: Builds the control overlay.
		BuildOverlay : function(){

			const rightPanel = document.getElementById("RightPanel");

			const overlayContainer = document.createElement("div");
			overlayContainer.id = "GM_eBayOverlayContainer";
			//set the overlay to be initially collapsed. we'll show it after the style sheet has been downloaded and applied.
			overlayContainer.style.visibility = 'collapse';
			rightPanel.insertBefore(overlayContainer, rightPanel.firstChild);
				
			const overlay = document.createElement("div");
			overlay.id = "GM_eBayOverlay";
					
			const img = new Image();
			img.src = SharedObjects.Constants.ReloadButtonIcon;
			img.id = "GM_eBaySettingsResetIcon";
			img.title = "Reset All";
			img.addEventListener('click', function(){
				const result = confirm("Are you sure you want to clear and reset everything? This action cannot be undone.");
				if(result){
					//-----------------------------------
					EBayUsabilityEnhancer.ResetAll();
				}
			});
			overlay.appendChild(img);
			
			let header = document.createElement("h3");
			header.textContent = "Usability Settings";
			header.setAttribute("class", "GM_ebayHeader");
			
			overlay.appendChild(header);
			
			const controlBox = document.createElement("div");
			controlBox.id = "GM_eBayOverlay_ControlBox";
			overlay.appendChild(controlBox);
			
			header = document.createElement("h3");
			header.textContent = "Seller Block List";
			header.setAttribute("class", "GM_ebayHeader");
			
			overlay.appendChild(header);
			
			const badSellerBox = document.createElement("div");
			badSellerBox.id = "GM_eBayOverlay_BadSellerBox";
			overlay.appendChild(badSellerBox);
			
			overlayContainer.appendChild(overlay);
			
			return controlBox;
		},
		
		//BuildOverlayControls: Builds the controls for the overlay container.
		BuildOverlayControls : function(pOverlay){
			const ul = document.createElement("ul");
			ul.style.marginTop = "-8px";
			for(let i = 0; i < 6; i++){
				const li = document.createElement("li");
				ul.appendChild(li);
			}
			
			// -- Top Pager
			let cbContainer = this.BuildCheckbox("Show Pager At Top", "GM_cbShowTopPager");
			cbContainer.title = "Display a pager element at the top of the results view.";
			const cbShowTopPager = cbContainer.firstChild;
				
			cbShowTopPager.addEventListener('change', function(r) {
				const cb = r.target;
				ScriptProps.ShowTopPager = cb.checked;
				EBayUsabilityEnhancer.ToggleTopPager(cb.checked);
			});

			ul.childNodes[0].appendChild(cbContainer);
			// Top Pager --

			// -- Remove Sponsored Items
			cbContainer = this.BuildCheckbox("Remove Sponsored", "GM_RemoveSponsoredItems");
			cbContainer.title = "Remove sponsored item listings.";
			const cbRemoveSponsoredItems = cbContainer.firstChild;
			
			cbRemoveSponsoredItems.addEventListener("change", function(r){
				const cb = r.target;
				ScriptProps.RemoveSponsoredItems = cb.checked;
				EBayUsabilityEnhancer.ToggleRemoveSponsoredItemResults(cb.checked);
			});
			ul.childNodes[1].appendChild(cbContainer);
			// Remove Sponsored Items --

            // -- Remove Top Rated Items
            cbContainer = this.BuildCheckbox("Remove Top Rated", "GM_RemoveTopRatedItems");
            cbContainer.title = "Remove Top Rated item listings.";
            const cbRemoveTopRatedItems = cbContainer.firstChild;
            cbRemoveTopRatedItems.addEventListener("change", (r) => {
                const cb = r.target;
                ScriptProps.RemoveTopRatedItems = cb.checked;
                EBayUsabilityEnhancer.ToggleRemoveTopRatedItemResults(cb.checked);
            });
            ul.childNodes[2].appendChild(cbContainer);
            // Remove Top Rated Items --

			// -- Reorder Price-wise
			cbContainer = this.BuildCheckbox("Order Low To High", "GM_cbRankByPrice");
			cbContainer.title = "Re-order results by price; lowest to highest.";
			const cbReorderByPrice = cbContainer.firstChild;
			
			cbReorderByPrice.addEventListener('change', function(r){
				const cb = r.target;
				ScriptProps.RankByPrice = cb.checked;
				EBayUsabilityEnhancer.ToggleResultOrder(cb.checked);
			});
			
			ul.childNodes[3].appendChild(cbContainer);
			// Reorder Price-wise --
			
			// -- Fix Links
			cbContainer = this.BuildCheckbox("Open In New Tab", "GM_cbTabbedLinks");
			cbContainer.title = "Open item links in a new tab.";
			const cbTabbedLinks = cbContainer.firstChild;
			
			cbTabbedLinks.addEventListener('change', function(r){
				const cb = r.target;
				ScriptProps.FixLinks = cb.checked;
				EBayUsabilityEnhancer.ToggleLinkFix(cb.checked);
			});
			
			ul.childNodes[4].appendChild(cbContainer);
			// -- Fix Links
			
			// -- Filter Bad Sellers
			
			const fDiv = document.createElement("div");
			cbContainer = this.BuildCheckbox("Prune Results", "GM_cbFilterBlockedSellers");
			cbContainer.title = "Remove items posted by blocked sellers.";
			const cbBlockSellers = cbContainer.firstChild;
			cbBlockSellers.addEventListener('change', function(r){
				const cb = r.target;
				ScriptProps.FilterResults = cb.checked;
				document.getElementById('GM_cbFilterBlock_ShowPlaceholders').disabled = !cb.checked;
				EBayUsabilityEnhancer.ToggleFilterBlockedSellerResults(cb.checked);
			});
			
			fDiv.appendChild(cbContainer);
			
			const fUl = document.createElement("ul");
			const fli = document.createElement("li");
			fUl.appendChild(fli);
			
			cbContainer = this.BuildCheckbox("Use Placeholders", "GM_cbFilterBlock_ShowPlaceholders");
			cbContainer.title = "Show placeholders for removed items.";
			const cbPlaceholder = cbContainer.firstChild;
			cbPlaceholder.addEventListener('change', function(r){
				const cb = r.target;
				ScriptProps.UsePlaceholders = cb.checked;
				EBayUsabilityEnhancer.ToggleFilteredItemPlaceholders(cb.checked);
			});
			fli.appendChild(cbContainer);
			
			fDiv.appendChild(fUl);
			
			ul.childNodes[5].appendChild(fDiv);
			// Filter Bad Sellers --
			
			//append the actual list element to the overlay
			pOverlay.appendChild(ul);	
		},
		
		//CreateTopPagerControl: Creates the top pagination control.
		CreateTopPagerControl : function(){
			const paginator = document.getElementById("Pagination");
			if(paginator){
				const pager2 = paginator.cloneNode(true);
				if(pager2){
					pager2.style.visibility = 'collapse';
					pager2.id = "Pagination2";
					pager2.style.marginTop = "10px";
					pager2.style.marginBottom = "10px";
					
					const container = document.getElementById("MessageContainer");
					if(container)
						container.parentNode.insertBefore(pager2, container.nextSibling);
				}
			}
		},
		
		//OverlaySetup: Sets up the controls inside the overlay container.
		OverlaySetup : function(){

			//Checkbox setup: Show Pager At Top
			document.getElementById("GM_cbShowTopPager").checked = ScriptProps.ShowTopPager;
			setTimeout(function(){
				EBayUsabilityEnhancer.ToggleTopPager(ScriptProps.ShowTopPager);
			}, SharedObjects.Intervals.Timeout);
			
			//Checkbox setup: Order Low To High
			document.getElementById("GM_cbRankByPrice").checked = ScriptProps.RankByPrice;
			setTimeout(function(){
				EBayUsabilityEnhancer.ToggleResultOrder(ScriptProps.RankByPrice);
			}, SharedObjects.Intervals.Timeout);
			
			//Checkbox setup: Open In New Tab
			document.getElementById("GM_cbTabbedLinks").checked = ScriptProps.FixLinks;
			setTimeout(function(){
				EBayUsabilityEnhancer.ToggleLinkFix(ScriptProps.FixLinks);
			}, SharedObjects.Intervals.Timeout);
			
			//Checkbox setup: Filter Results
			document.getElementById("GM_cbFilterBlockedSellers").checked = ScriptProps.FilterResults;
			setTimeout(function(){
				EBayUsabilityEnhancer.ToggleFilterBlockedSellerResults(ScriptProps.FilterResults);
			}, SharedObjects.Intervals.Timeout);
			
			document.getElementById("GM_RemoveSponsoredItems").checked = ScriptProps.RemoveSponsoredItems;
			setTimeout(function(){
				EBayUsabilityEnhancer.ToggleRemoveSponsoredItemResults(ScriptProps.RemoveSponsoredItems);
			}, SharedObjects.Intervals.Timeout);

            document.getElementById("GM_RemoveTopRatedItems").checked = ScriptProps.RemoveTopRatedItems;
            setTimeout(()=>{
                EBayUsabilityEnhancer.ToggleRemoveTopRatedItemResults(ScriptProps.RemoveTopRatedItems);
            }, SharedObjects.Intervals.Timeout);

			//Checkbox setup: Use Placeholders
			const cbPlaceHolders = document.getElementById("GM_cbFilterBlock_ShowPlaceholders");
			cbPlaceHolders.checked = ScriptProps.UsePlaceholders;
			cbPlaceHolders.disabled = !ScriptProps.FilterResults;
			setTimeout(function(){
				EBayUsabilityEnhancer.ToggleFilteredItemPlaceholders(ScriptProps.UsePlaceholders);
			}, SharedObjects.Intervals.Timeout);
		},
		
		//BuildBlockedSellerNameLink: Builds a seller name element that allows for copying or removal of the seller from the black list.
		BuildBlockedSellerNameLink : function(sellerName){
			if(!sellerName) return null;
			
			const table = document.createElement('table');
			table.className = "GM_eBayTableElement";
			const row = document.createElement("tr");
			for(let i = 0; i < 3; i++){
				const cell = document.createElement('td');
				row.appendChild(cell);
			}
			
			table.appendChild(row);
			
			const nameSpan = document.createElement("span");
			nameSpan.id = "EBayEnhancer_BlockedSeller_" + sellerName;
			nameSpan.style.fontWeight = "bold";
			nameSpan.style.cursor = "default";
			nameSpan.className = "unselectable";
			let slrName = sellerName;
			if(slrName.length > 13)
				slrName = slrName.substr(0, 12) + "...";
			nameSpan.textContent = slrName;
			nameSpan.title = sellerName;
			nameSpan.style.opacity = ".6"; //set to 60% opacity
			
			
			row.childNodes[0].appendChild(nameSpan);
			
			const copyImage = new Image();
			copyImage.src = SharedObjects.Constants.ClipboardIcon;
			copyImage.style.cursor = "pointer";
			copyImage.title = "Copy the seller name to the clipboard.";
			copyImage.setAttribute('data-sellerName', sellerName);
			copyImage.addEventListener('click', function(r){
				const img = r.target;
				const sn = img.attributes["data-sellerName"].value;
				GM_setClipboard(sn);
			});
			
			const cell1 = row.childNodes[1];
			cell1.style.width = "16px";
			cell1.appendChild(copyImage);
			
			const removeLink = new Image();
			removeLink.src = SharedObjects.Constants.CloseButtonIcon;
			removeLink.setAttribute('data-badSellerName', sellerName);
			removeLink.title = "Remove blocked seller '" + sellerName + "'.";
			removeLink.style.cursor = "pointer";
			removeLink.addEventListener('click', function(r){
				const btn = r.target;
				const sllr = btn.getAttribute('data-badSellerName');
				const result = confirm("Are you sure you want to remove '" + sllr + "' from your seller black list?");
				if(result){
					const badSellers = ScriptProps.BlockedSellerList;
					const idx = badSellers.indexOf(sllr);
					if(idx > -1){
						
						let listings = SellerManager.GetListingsBySeller(sllr);
						
						for(let i = 0; i < listings.length; i++){
							const listing = listings[i][0];
							EBayUsabilityEnhancer.ToggleResultFilterBar(listing, sllr, false);
						}
						
						const remSellers = badSellers.splice(idx, 1);
						ScriptProps.BlockedSellerList = badSellers;

						const ulst = document.getElementById("GM_eBayBadSellers_UList");
						while(ulst.firstChild != null)
							ulst.removeChild(ulst.firstChild);
						
						SellerManager.AddBlockedSellers();
					}
				}
			}, false);
			
			const cell2 = row.childNodes[2];
			cell2.style.width = "16px";
			cell2.appendChild(removeLink);
			
			return table;
		},
		
		//BuildCheckbox: Constructs a checkbox with the given title and id.
		BuildCheckbox : function(title, id){
			const d = document.createElement("div");
			d.setAttribute("class", "cbx unselectable");
			
			const i = document.createElement("input");
			i.id = id;
			i.type = "checkbox";
			
			const l = document.createElement("label");
			l.setAttribute('for', id);
			
			const s = document.createElement("span");
			s.className = "cbx GM_cbx";
			s.textContent = title;
			l.appendChild(s);
			
			d.appendChild(i);
			d.appendChild(l);
			
			return d;
		},
		
		ImportFromFile : function(file){
			const reader = new FileReader();
			reader.onload = function(r){
				const result = r.target.result;
				if(result){
					const names = result.split("\r\n");
					if(names.length > 0){
						//add each name to the bad sellers list.
						for(let x = 0; x < names.length; x++){
							const n = names[x].trim();
							SellerManager.AddBlockedSeller(n, true);
						}
					}
				}
			};
			reader.readAsText(file, "utf-8");
		},
		
		//BuildBlockedSellersBox: Builds the bad sellers control box.
		BuildBlockedSellersBox : function(pOverlay){
			const self = this;
			const ul = document.createElement("ul");
			ul.id = "GM_eBayBadSellers_UList";
			ul.className = "GM_eBayBadSeller_NameLinkList";
			
			const d = document.createElement("div");
			d.style.marginLeft = "8px";
			d.style.display = "table";
			d.style.marginBottom = "5px";
			d.style.marginTop = "-8px";
			
			const txtAddBlockedSeller = document.createElement("input");
			txtAddBlockedSeller.type = "text";
			txtAddBlockedSeller.id = "GM_eBayNewBadSeller_InputBox";
			txtAddBlockedSeller.title = "Type or paste the name of the seller you want to block and press 'Enter'.";
			
			let style = "width:90px;margin:0;";
            if(SharedObjects.Constants.IsChrome)
                style += "height:16px;";
            
			txtAddBlockedSeller.setAttribute("style", style);
			
			txtAddBlockedSeller.addEventListener('keyup', function(e){
				const key = e.keyCode;
				if(key === 13){
					const box = document.getElementById("GM_eBayNewBadSeller_InputBox");
					const txt = box.value.trim();
					box.value = "";
					
					if(SellerManager.AddBlockedSeller(txt, true)){
						//filter results for new seller name...
						const filterUser = ScriptProps.FilterResults;
						if(filterUser != undefined && filterUser){
							EBayUsabilityEnhancer.ToggleFilterBlockedSellerResults(true);
						}
					}
				}
			});
			
			const fileInput = document.createElement("input");
			fileInput.type = "file";
			fileInput.id = "GM_eBayNewBadSeller_fileInput";
			fileInput.style.display = "none";
			fileInput.setAttribute("accept", ".txt");
			
			const btnImportSellers = document.createElement("input");
			btnImportSellers.type = "button";
			btnImportSellers.value = "I";
			btnImportSellers.id = "GM_eBayNewBadSeller_btnImportBadSellers";
			btnImportSellers.setAttribute("style", "height:26px;margin-left:-2px;width:24px;");
			btnImportSellers.title = "Import sellers from a text file.";
			btnImportSellers.onclick = function(){
				fileInput.addEventListener("change", function(evt){
					const files = evt.target.files;
					for(let i = 0; i < files.length; i++){
						const f = files[i];
						
						if(!f.type.match("text/plain"))
							continue;
						
						self.ImportFromFile(f);
					}
				}, false);
				fileInput.click();
			};
			
			const btnExportSellers = document.createElement("input");
			btnExportSellers.type = "button";
			btnExportSellers.value = "O";
			btnExportSellers.id = "GM_eBayNewBadSeller_btnExportSellers";
			btnExportSellers.setAttribute("style", "height:26px;margin-left:-2px;width:24px;");
			btnExportSellers.title = "Export sellers to a text file.";
			btnExportSellers.onclick = function(){
				const badSellers = ScriptProps.BlockedSellerList;
				let agg = "";
				
				for(let i = 0; i < badSellers.length; i++)
					agg += badSellers[i] + "\r\n";
					
				agg = agg.trim();

				const dLink = document.createElement("a");
				dLink.download = "EBayUsabilityEnhancer_BlockedSellersList.txt";
				dLink.href = "data:text/plain," + encodeURI(agg);
				dLink.style.display = "none";
				dLink.textContent = "download";
				document.body.appendChild(dLink);
				dLink.click();
				document.body.removeChild(dLink);
			};
			
			const label = document.createElement("label");
			label.textContent = "Add, Import or Export:";
			label.setAttribute('for', 'GM_eBayNewBadSeller_InputBox');
			
			const table = document.createElement("table");
			table.style.width = "100%";
			
			const row = document.createElement("tr");
			for(let i = 0; i < 2; i++)
				row.appendChild(document.createElement("td"));
			table.appendChild(row);
			
			const copyAllLink = document.createElement("span");
			copyAllLink.textContent = "Copy All";
			copyAllLink.className = "GM_eBayBadSellers_ActionLink";
			copyAllLink.title = "Copy all blocked sellers to the clipboard.";
			copyAllLink.addEventListener('click', function(e){
				//------------------------------------------
				const blockedSellers = ScriptProps.BlockedSellerList;
				if(blockedSellers){
					let sellerList = "";
					for(let i = 0; i < blockedSellers.length; i++)
						sellerList += blockedSellers[i] + ",";
					sellerList = sellerList.substr(0, sellerList.lastIndexOf(","));
					GM_setClipboard(sellerList);
					alert("All blocked sellers have been copied to the system clipboard.");
				}
			});
			
			row.childNodes[0].appendChild(copyAllLink);
			
			const clearLink = document.createElement('span');
			clearLink.textContent = "Remove All";
			clearLink.className = "GM_eBayBadSellers_ActionLink";
			clearLink.title = "Remove all sellers from the block list.";
			clearLink.setAttribute("style", "float:right;margin-right:7px;");
			clearLink.addEventListener('click', function(e){
				let blockedSellers = ScriptProps.BlockedSellerList;
				if(blockedSellers){
					const result = confirm("Are you sure you want to remove all sellers from your block list? This action cannot be undone.");
					if(result){
						//-----------------------------------
						blockedSellers = [];
						ScriptProps.BlockedSellerList = blockedSellers;
						SellerManager.AddBlockedSellers();
					}
				}
			});
			
			row.childNodes[1].appendChild(clearLink);
			
			d.appendChild(label);
			d.appendChild(txtAddBlockedSeller);
			d.appendChild(fileInput);
			d.appendChild(btnImportSellers);
			d.appendChild(btnExportSellers);
			d.appendChild(table);
			
			pOverlay.appendChild(d);

			pOverlay.appendChild(ul);
		}
	};

	const SellerManager = {
		//IsBlockedSeller: Returns whether or not the specified seller name is in the seller black list.
		IsBlockedSeller : function(sellerName, fuzzyMatch){
			if(!sellerName || sellerName.length === 0) return true;
			const badSellers = ScriptProps.BlockedSellerList;
			
			if(fuzzyMatch && fuzzyMatch === true){
				const len = badSellers.length;
				for(let i = 0; i < len; i++){
					const bs = badSellers[i].toLowerCase();
						
					let pSellerName;
					if(sellerName.lastIndexOf("...") !== -1){
							pSellerName = sellerName.substring(0, sellerName.lastIndexOf("...") - 1);
					} else 
						pSellerName = sellerName;
					
					if(bs.indexOf(pSellerName) !== -1)
						return true;
				}
			}
			
			return badSellers.indexOf(sellerName) !== -1;
		},
		
		FuzzyMatchedName : function(fuzzyName){
			if(fuzzyName.lastIndexOf("...") === -1) 
				return null;
			
			const badSellers = ScriptProps.BlockedSellerList,
				len = badSellers.length;
			let retval;
			const tLen = SharedObjects.Arrays.TruncatedSellers.length;
			
			if(tLen > 0){
				//check if we've got a match in the TruncatedSellers array.
				for(let t = 0; t < tLen; t++){
					const pair = SharedObjects.Arrays.TruncatedSellers[t];
					if(pair[0].toLowerCase() === fuzzyName.toLowerCase())
						return pair[1];
				}
			}
			
			for(let n = 0; n < len; n++){
				const bs = badSellers[n].toLowerCase();
				let pSellerName;
				
				if(fuzzyName.lastIndexOf("...") !== -1)
					pSellerName = fuzzyName.substring(0, fuzzyName.lastIndexOf("...")).toLowerCase();
				else 
					pSellerName = fuzzyName.toLowerCase();

				if(bs.indexOf(pSellerName) !== -1){
					retval = bs;
					break;
				}
			}
			
			return retval;
		},
		
		//GetSellerById: Returns a SellerData object based on the supplied listingid parameter.
		GetSellerById : function(listingid){
			const count = SharedObjects.Arrays.AllSellerData.length;
			for(let i = 0; i < count; i++){
				const sellerData = SharedObjects.Arrays.AllSellerData[i];
				const id = sellerData[1];
				if(id === listingid)
					return sellerData[0];
			}
			return null;
		},
		
		//AddBlockedSeller: Creates and adds a bad seller based on the supplied seller name.
		AddBlockedSeller : function(sellerName, bailIfExists){
			sellerName = sellerName.trim();
			
			if(sellerName.length === 0) 
				return false;
			
			const badSellers = ScriptProps.BlockedSellerList;
			if(badSellers.indexOf(sellerName) === -1){
				try{
					badSellers.push(sellerName);
				} catch(e){
					alert("T: " + e);
				}
				
				ScriptProps.BlockedSellerList = badSellers;
			} else if(bailIfExists && bailIfExists === true) {
				return false;
			}
			
			const sellerLink = UIBuilder.BuildBlockedSellerNameLink(sellerName);
			const li = document.createElement("li");
			if(sellerLink)
				li.appendChild(sellerLink);
			
			const uList = document.getElementById("GM_eBayBadSellers_UList");
			if(uList){
				const badSellers = ScriptProps.BlockedSellerList;
				badSellers.sort(SortFunctions.SortAlphaNum);
				const idx = badSellers.indexOf(sellerName);
				if(idx !== -1){
					const liChild = uList.childNodes[idx];
					uList.insertBefore(li, liChild);
				} else {
					uList.appendChild(li);
				}
				return true;
			}
			return false;
		},
		
		//AddBlockedSellers: Adds the stored bad sellers to the page.
		AddBlockedSellers : function(){
			const sellers = ScriptProps.BlockedSellerList;
			if(sellers == undefined) return;
			
			const uList = document.getElementById("GM_eBayBadSellers_UList");
			if(uList){
				while(uList.firstChild) { uList.removeChild(uList.firstChild);}
			}
			
			if(sellers){
				sellers.sort(SortFunctions.SortAlphaNum);
				
				try{
					ScriptProps.BlockedSellerList = sellers;
				} catch(e2){
					//alert("err: " + e2)
				}
			}
				
			if(sellers.length > 0){
				for(let i = 0; i < sellers.length; i++){
					const seller = sellers[i];
					this.AddBlockedSeller(seller);
				}
			}
		},
		
		//GetListingsBySeller: Returns a collection of all listings that belong to the supplied sellerName.
		GetListingsBySeller : function(sellerName){
			const count = SharedObjects.Arrays.AllSellerData.length;
			let listings = [];
			
			sellerName = sellerName.toLowerCase();
			
			for(let i = 0; i < count; i++){
				const sd = SharedObjects.Arrays.AllSellerData[i];
				const id = sd[1];
				let seller = sd[0].ID;
				
				if(seller.lastIndexOf("...") !== -1){
					const badSellers = ScriptProps.BlockedSellerList;
					const len = badSellers.length;
					
					for(let n = 0; n < len; n++){
						const bs = badSellers[n].toLowerCase();
						let pSellerName;
						
						if(seller.lastIndexOf("...") !== -1)
							pSellerName = seller.substring(0, seller.lastIndexOf("...")).toLowerCase();
						else 
							pSellerName = seller.toLowerCase();

						if(bs.indexOf(pSellerName) !== -1){
							seller = bs;
							break;
						}
					}
				}
				
				seller = seller.toLowerCase();
				sellerName = sellerName.toLowerCase();
				
				if(seller === sellerName){
					const priceCount = SharedObjects.Arrays.OriginalPrices.length;
					for(let j = 0; j < priceCount; j++){
						const pd = SharedObjects.Arrays.OriginalPrices[j];
						const pdId = pd[0].attributes["listingid"].value;
						if(id === pdId){
							listings.push(pd);
						}
					}
				}
			}
			
			return listings;
		},
		
		GetSellerData : function(resultNode){
		
			const sellerData = {
				ID: "",
				FeedbackScore: "",
				ReviewCount: ""
			};
			
			const dynDiv = resultNode.querySelector("ul.lvdetails");
			const listingId = resultNode.getAttribute("listingid");
			const len = dynDiv.childNodes.length;
			const self = this;
			
			if(len > 0) {
				
				for(let m = 0; m < len; m++){
					const n = dynDiv.childNodes[m];
					
					
					let spns;
					
					try{
						spns = n.querySelectorAll("span.selrat");
					} catch (e){
						continue;
					}
					
					if(spns){
						const text = n.textContent.trim();
						if(text.indexOf("Seller:") !== -1){
							const idx = text.indexOf("Seller:");
							const idx2 = text.indexOf("(");
							const idx3 = text.indexOf(")");
							
							sellerData.ID = text.substring(idx + 8, idx2).trim();
							
							const img = new Image();
							img.setAttribute("style", "height:12px;width:12px;cursor:pointer;");
							img.setAttribute("Seller-ID", sellerData.ID);
							
							try{
								let revCount = spns[0].textContent.replace("(", "").replace(")", "");
								while(revCount.indexOf(",") != -1)
									revCount = revCount.replace(",","");
								
								sellerData.ReviewCount = parseInt(revCount);
							}catch(e){
								//alert(e);
							}
							
							try{
								const fbScore = parseFloat(spns[1].textContent.replace("%", "").trim());
								
								sellerData.FeedbackScore = fbScore;
								
								const score = sellerData.FeedbackScore;
								let color = "";
								
								if(score >= 99.2){
									//should be ok to buy from this guy.
									color = "green";
								} else if(score >= 98 && score <= 99.1) {
									//better check the neg's!
									color = "#E8823A";
								} else {
									//bad seller!
									color = "red";
								}
								
								spns[1].setAttribute("style", "color:" + color + ";");
								
								const p = spns[0];							
								p.parentNode.appendChild(img);
							} catch(e){
								img.setAttribute("style", "margin-left:5px;height:12px;width:12px;cursor:pointer;");
								n.appendChild(img);
							}
							
							try{
								if(sellerData.ID.lastIndexOf("...") !== -1){
									Utilities.GetFullUserName(listingId, function(lstId, resultText){
										const fullUserName = Utilities.ParseNameFromTextChunk(resultText);
										if(fullUserName){
											
											//add a mapping for the truncated name and the full name.
											SharedObjects.Arrays.TruncatedSellers.push([sellerData.ID, fullUserName]);
											
											img.onload = function(){
												this.title = "Add seller '" + fullUserName + "' to the block list.";
												const seller = this.getAttribute("Seller-ID");
												img.addEventListener("click", function(){
													self.ConfirmBlockSeller(fullUserName);
												}, false);
											};
											
											img.src = SharedObjects.Constants.CloseButtonIcon;
											self.SetupFeedbackLink(fullUserName, dynDiv);
										}
									});
								} else {
									img.onload = function(){
										const seller = this.getAttribute("Seller-ID");
										this.title = "Add seller '" + seller + "' to the block list.";
										img.addEventListener("click", function(){
											self.ConfirmBlockSeller(seller);
										}, false);
									};
									
									img.src = SharedObjects.Constants.CloseButtonIcon;
									
									this.SetupFeedbackLink(sellerData.ID, dynDiv);
								}
							}catch(e){
								alert(e);
							}
						}
					}
				}

			}
			
			
			return sellerData;
		},
		
		ConfirmBlockSeller : function(sellerName){
			if(!sellerName || sellerName.length === 0) return;
			if(SellerManager.IsBlockedSeller(sellerName)){
				alert("Seller '" + sellerName + "' is already in your block list.");
				return;
			}
			
			const msg = "Are you sure you want to block the seller '" + sellerName + "'?";
			if(confirm(msg)) {
				if(SellerManager.AddBlockedSeller(sellerName, true))
					EBayUsabilityEnhancer.ToggleFilterBlockedSellerResults(true);
			}
		},
		
		SetupFeedbackLink : function(sellerName, parentNode){
			const fbLink = document.createElement("a");
			fbLink.href = SharedObjects.Constants.NegativeFeedbackLink.replace("[SELLERNAME]", sellerName);
			fbLink.textContent = "Show Negative Feedback";
			fbLink.title = "Opens the seller's negative feedback ratings page in a new tab.";
			fbLink.setAttribute('target', '_blank');
							
			const li = document.createElement("li");
			li.appendChild(fbLink);
			parentNode.appendChild(li);
		},
		
	};

	const Utilities = {
		
		//SetupProperties: Creates property get/set functions.
		SetupProperties : function(){
			
			Object.defineProperty(ScriptProps, "ShowTopPager",{
				get: function(){ return GM_getValue(SharedObjects.Constants.ShowTopPager); },
				set: function(value){GM_setValue(SharedObjects.Constants.ShowTopPager, value); }
			});
			
			Object.defineProperty(ScriptProps, "RankByPrice", {
				get: function() { return GM_getValue(SharedObjects.Constants.RankByPrice); },
				set: function(value){ GM_setValue(SharedObjects.Constants.RankByPrice, value); }
			});
			
			Object.defineProperty(ScriptProps, "FixLinks", {
				get: function() { return GM_getValue(SharedObjects.Constants.FixLinks); },
				set: function(value) { GM_setValue(SharedObjects.Constants.FixLinks, value); }
			});
				
			Object.defineProperty(ScriptProps, "FilterResults", {
				get: function(){ return GM_getValue(SharedObjects.Constants.FilterResults); },
				set: function(value){ GM_setValue(SharedObjects.Constants.FilterResults, value); }
			});
			
			Object.defineProperty(ScriptProps, 'UsePlaceholders', {
				get: function(){ return GM_getValue(SharedObjects.Constants.UsePlaceholders); },
				set: function(value){ GM_setValue(SharedObjects.Constants.UsePlaceholders, value); }
			});
			
			Object.defineProperty(ScriptProps, "RemoveSponsoredItems", {
				get: function(){ return GM_getValue(SharedObjects.Constants.RemoveSponsoredItems); },
				set: function(value){ GM_setValue(SharedObjects.Constants.RemoveSponsoredItems, value); }
			});

            Object.defineProperty(ScriptProps, "RemoveTopRatedItems", {
                get: function(){return GM_getValue(SharedObjects.Constants.RemoveTopRatedItems);},
                set: function(value){GM_setValue(SharedObjects.Constants.RemoveTopRatedItems, value);}
            });
			
			Object.defineProperty(ScriptProps, "BlockedSellerList", {
				get: function() { 
					const blockList = GM_getValue(SharedObjects.Constants.BlockedSellerList); 
					return blockList != null ? blockList.split(' ') : []; 
				},
				set: function(value) {
					const len = value.length;
					let agg = "";
					for(let i = 0; i < len; i++){
						agg += value[i] + " ";
					}
					agg = agg.trim();
					
					try{
						GM_setValue(SharedObjects.Constants.BlockedSellerList, agg); 
					} catch(e){
						//alert("Err:\r\n" + e);
					}
				}
			});
		},
		
		CreateSelectOption: function(text, val){
			const opt = document.createElement("option");
			opt.value = val;
			opt.textContent = text;
			return opt;
		},

		//GetPageContent: Retrieves the content of the page at the supplied Url.
		GetPageContent : function(url, listingid, callback){
			if(!url) return;

            //GM_xmlhttpRequest onload event is not working. So, we're going old-school, here.
            var oReq = new XMLHttpRequest();
            oReq.addEventListener("load", function(){
                const result = this.responseText;
                if(callback)
                    callback.call(this, listingid, result);
            });
            oReq.open("GET", url, true);
            oReq.send(null);

            // GM_xmlhttpRequest({
            //     method: "GET",
            //     url: url,
            //     onload: function(r){
            //         console.log(r);
            //         const result = r.responseText;
            //         if(callback)
            //             callback.call(this, listingid, result);
            //     },
            //     onerror: function(r) {
            //         console.log(r);
            //     }
            // });
		},
		
		GetFullUserName : function(listingId, callback){
			if(!listingId || listingId.length === 0) return null;
			const url = "//www.ebay.com/itm/" + listingId;
			this.GetPageContent(url, listingId, callback);
		},
		
		//GetResultItem: Returns a result item, from the 'SharedObjects.Arrays.OriginalPrices' array, that matches the supplied 'itemId' parameter value.
		GetResultItem : function(itemId){
			if(!itemId) return null;
			const len = SharedObjects.Arrays.OriginalPrices.length;
			for(let i = 0; i < len; i++){
				const result = SharedObjects.Arrays.OriginalPrices[i][0];
				const id = result.attributes["listingid"].value;
				if(id === itemId)
					return result;
			}
			return null;
		},
		
		//GetItemPrices: Gets an array of items and their prices.
		GetItemPrices : function(){
			const results = document.getElementsByClassName("sresult");
			
			if(results.length > 0 && SharedObjects.Arrays.OriginalPrices.length == 0){
				let pText, nText, result;
				for(let i = 0; i < results.length; i++){
					
					try{
						result = results[i];
						const sd = SellerManager.GetSellerData(result);
						SharedObjects.Arrays.AllSellerData.push([sd, result.attributes["listingid"].value]);

						const prc = result.querySelector("ul.lvprices li.lvprice.prc span");
						
						if(prc){
							pText = prc.innerHTML;
							
							//<span class="prRange">$5.97 <span>to</span> $10.97</span>
							const prRange = prc.querySelector("span.prRange");
							if(prRange)
								pText = prRange.innerHTML;
							
							//the span may contain child elements.
							//in such case, we only want the text that preceeds any elements.
							if(pText.indexOf("<") !== -1)
								pText = pText.substring(0, pText.indexOf("<"));
							
							let price = pText.trim();
							if(price.indexOf(' ') != -1)
								price = price.split(' ')[1].trim();
								
							const n = price[0];
							if(n){
								if(!/\d/.test(n))
									price = price.substring(1);
								nText = result;
								while(price.indexOf(',') > -1) 
									price = price.replace(',','');
								
								if(price){
									SharedObjects.Arrays.OriginalPrices.push([result, price]);
								}
							}
						}
					}catch(e){
						//alert(result.outerHTML);
						//alert(e + "\r\niteration: " + i + "\r\n" + nText);
					}

				}
			}
		},
		
		ParseNameFromTextChunk : function(textChunk){
			if(!textChunk || textChunk.length === 0) return null;
			
			let ridx = textChunk.indexOf("RightSummaryPanel");
			let lidx = textChunk.indexOf("LeftSummaryPanel");
			

			for(let s = ridx; s > 0; s--){
				const chr = textChunk[s];
				if(chr === "<"){
					ridx = s;
					break;
				}
			}
			
			for(let s = lidx; s > 0; s--){
				const chr = textChunk[s];
				if(chr === "<"){
					lidx = s;
					break;
				}
			}
			
			const chunk = textChunk.substring(ridx, lidx);
			const container = document.createElement("div");
			container.style.visibility = "collapse";
			
			container.innerHTML = chunk;
			document.body.appendChild(container);
			
			const cSpan = container.querySelector("div a span.mbg-nw");
			return cSpan.textContent.trim();
		},
		
	};

	const SortFunctions = {
		
		reA : /[^a-zA-Z]/g,
		reN : /[^0-9]/g,
		SortAlphaNum : function(a,b) {
			const aA = a.replace(this.reA, "");
			const bA = b.replace(this.reA, "");
			if(aA === bA) {
				const aN = parseInt(a.replace(this.reN, ""), 10);
				const bN = parseInt(b.replace(this.reN, ""), 10);
				return aN === bN ? 0 : aN > bN ? 1 : -1;
			} else {
				return aA > bA ? 1 : -1;
			}
		},
		
		SortLowToHigh : function(a,b){
			const n1 = parseFloat(a[1]);
			const n2 = parseFloat(b[1]);
			
			if(n1 < n2) return -1;
			if(n1 > n2) return 1;
			return 0;
		}
	};

	String.prototype.splice = function( idx, rem, s ) {
		return (this.slice(0,idx) + s + this.slice(idx + Math.abs(rem)));
	};


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//Get the ball rolling...
	
	
	if(vendor === "Google Inc."){
		EBayUsabilityEnhancer.Initialize();
	} else if (codeName === "Mozilla" && product === "Gecko"){
		document.onreadystatechange = function(){
			if(document.readyState === "complete")
				EBayUsabilityEnhancer.Initialize();
		};
	}
})();