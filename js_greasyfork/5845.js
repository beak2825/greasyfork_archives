// ==UserScript==
// @name           RightMove blacklist properties
// @description    Allows user to mark properties on RightMove as 'never show again'
// @include        http://www.rightmove.co.uk/*
// @version        1.1
// @namespace https://greasyfork.org/users/6137
// @downloadURL https://update.greasyfork.org/scripts/5845/RightMove%20blacklist%20properties.user.js
// @updateURL https://update.greasyfork.org/scripts/5845/RightMove%20blacklist%20properties.meta.js
// ==/UserScript==


//=====================================================================================
// HIDE PROPERTIES FROM LIST & GRID VIEW
//=====================================================================================

function HidePropertiesFromListView() {
    //
    // Check all the list items to remove blacklisted properties (hide them)
    //

    //Get all properties shown in list
    var properties = $('li.summary-list-item');
    //For each...
    var numremoved = 0;
    $.each(properties, function(i,v) {
        //Check ID
        var propertyId = /summary([0-9]{8})/.exec($(v).attr('id'))[1];
        if (GetBlacklistIds().indexOf(propertyId) != -1) {
            numremoved++;
            $(v).hide();
        }
    });
    //Message to user
    if (numremoved > 0) {
        if ($('#numberOfPropertiesRemoved').length == 0) {
            var b = $('<b></b>').attr('id', 'numberOfPropertiesRemoved').text(numremoved);
            var msg = $('<h4></h4>').attr('style', "color: red").append('Hiding ').append(b).append(' properties you never want to see again.');
            $('#numberOfProperties').after(msg);
        }
        $('#numberOfPropertiesRemoved').text(numremoved);
    }
    
    //UI to blacklist from list view (not on grid view)
    $.each(properties, function(i,v) {
        var propertyId = /summary([0-9]{8})/.exec($(v).attr('id'))[1];
        var propertyInfo = {
            link:  $('#prop'+propertyId).attr('href'),
            thumb: $('img', $('#prop'+propertyId)).attr('src'),
            title: $('strong', $('.displayaddress', v)).text()
        };
        var a = $('<a></a>').attr('id', 'link-blacklist-'+propertyId).attr('href', '#').text('Never show property again');
        a.addClass('priority2').attr('style', 'background-position: 0 -810px;');//add icon
        var li = $('<li></li>').append(a);
        a.click(function(e) {
            //Blacklist & immediately hide
            AddToBlacklist(propertyId, propertyInfo);
            $('#summary' + propertyId).hide();
        });
        $('ul', $('.moreinfo', v)).append(li);
    });
};

//=====================================================================================
// HIDE PROPERTIES FROM MAP VIEW
//=====================================================================================

function HidePropertiesFromMapView() {
    
    //
    // Override the markers function to remove blacklisted properties
    //
    var rmsr = RIGHTMOVE.namespace("RIGHTMOVE.MAPS.SEARCHRESULTS");
    if (rmsr.MapView) {
        rmsr.MapView.prototype.updateMarkers = overrideFunction(rmsr.MapView.prototype.updateMarkers, function(callback, a) {
            //Create a new list of properties removing all the ones that are blacklisted
            var trimmedlist = [];
            $.each(a.results.mappedProperties, function(i,v) {
                if (GetBlacklistIds().indexOf(v.id.toString()) == -1) {
                    trimmedlist.push(v);
                }
            });
            //Message to user
            var numremoved = -(trimmedlist.length - a.results.mappedProperties.length);
            if (numremoved > 0) {
                if ($('#numberOfPropertiesRemoved').length == 0) {
                    var b = $('<b></b>').attr('id', 'numberOfPropertiesRemoved').text(numremoved);
                    var msg = $('<h4></h4>').attr('style', "color: red").append('Hiding ').append(b).append(' properties you never want to see again.');
                    $('#numberOfProperties').after(msg);
                }
                $('#numberOfPropertiesRemoved').text(numremoved);
            }
            //And then call the original RightMove function
            a.results.mappedProperties = trimmedlist;
            return callback.call(this, a);
        });
        
        //
        // Override the addSummaries function to add UI control for blacklisting properties
        //
        rmsr.PropertyPopup.prototype.addSummaries = overrideFunction(rmsr.PropertyPopup.prototype.addSummaries, function(callback, a) {
            //Call real function first
            var ret = callback.call(this, a);
            //Then add additional buttons
            $.each( $('.propertysummary'), function(i, v) {
                var $v = $(v);
                var moreinfo = $('.moreinfo', $v);
                var propertyId = $(moreinfo).attr('id');
                var propertyInfo = {
                    link:  $('a.photo', $v).attr('href'),
                    thumb: $('img', $('a.photo', $v)).attr('src'),
                    title: $('h2.address', $v).text()
                };
                console.log(propertyId);
                var a = $('<a></a>').attr('id', 'link-blacklist-'+propertyId).attr('href', '#').text('Never show property again');
                var li = $('<li></li>').append(a);
                a.click(function(e) {
                    //Blacklist & immediately hide
                    AddToBlacklist(propertyId, propertyInfo);
                    $('#propertysummary-' + propertyId).hide();
                });
                $('ul', moreinfo).append(li);
            });
            return ret;
        });
    }
};


//=====================================================================================
// HIDE PROPERTY FROM DETAILS VIEW
//=====================================================================================

function HidePropertiesFromDetailsView() {
    var rhsPanel = $('#secondaryContent');
    if (rhsPanel.length > 0) {
        var propertyId = /property-([0-9]{8})[.]html/.exec($('meta[property="og:url"]').attr('content'))[1];
        var propertyInfo = {
            link:  $('meta[property="og:url"]').attr('content'),
            thumb: $('meta[property="og:image"]').attr('content'),
            title: $('address', $('.property-header-bedroom-and-price')).text()
        };
        console.log(propertyId);
        console.log(GetBlacklistIds());
        var saveProperty = $('.property-actions-save');
        var li = $('<li></li>').addClass('bdr-b');
        if (GetBlacklistIds().indexOf(propertyId) == -1) {
            var aBl = $('<a></a>').addClass('icon-before icon-house-pin-tiny button secondary').attr('href', '#').text('Never show property again');
            aBl.click(function(e) {
                //Blacklist & immediately hide
                AddToBlacklist(propertyId, propertyInfo);
                var p = $('<p></p>').attr('style', 'color: red').text('This property is hidden from results');
                aBl.after(p);
                aBl.hide();
            });
            li.append(aBl);
        } else {
            var p = $('<p></p>').attr('style', 'color: red').text('This property is hidden from results');
            li.append(p);
        }
        saveProperty.after(li);
    }
};

//=====================================================================================
// CONTROL BLACKLIST FROM MYRIGHTMOVE
//=====================================================================================

function AddBlacklistTabToMyRightmove() {
    
    var myrm = $('.myrightmovetopnav');
    if (myrm.length > 0) {
        var title = $('<a></a>').attr('href', '#').text('Blacklist');
        var tab = $('<li></li>').addClass('blacklist').append(title);
        $('.savedproperty').after(tab);
        title.click(function(e) {
            //Restore currently selected tab to a hyperlink
            var current = $('.selected', $('.myrightmovetopnav'));
            var currentLabel = $('strong', current);
            var link = '';
            if (current[0].className.indexOf('alerts') != -1)
                link = "/user/saved-searches/redirect.html";
            else if (current[0].className.indexOf('savedproperty') != -1)
                link = "/user/shortlist/redirect.html";
            else if (current[0].className.indexOf('drawnareas') != -1)
                link = "/user/drawn-areas.html";
            else if (current[0].className.indexOf('homeideas') != -1)
                link = "/user/home-ideas.html";
            else if (current[0].className.indexOf('mydetails') != -1)
                link = "/user/details.html";
            else
                link = "/user/investor.html";
            var newlink = $('<a></a>').attr('href', link).text(currentLabel.text());
            currentLabel.after(newlink);
            currentLabel.hide();
            current.removeClass('selected');
            //Make blacklist tab selected
            var blacklistTab = $('.blacklist');
            blacklistTab.addClass('selected');
            blacklistTab.append($('<strong></strong>').text($('a', blacklistTab).text()));
            $('a', blacklistTab).hide();
            //Clear or hide current page content
            $('#myrightmovesubtabs').hide();
            var myrmc = $('#myrightmove');
            myrmc.empty();
            
            //
            // Add content
            //
            
            // Top bar (actions)
            var divTop = $('<div></div>').addClass('savedpropertycontainer clearfix').attr('id', 'savedpropertycontainer-top');
            var ulTop = $('<ul></ul>').attr('id', 'shortlistlinks');
            var aClearBl = $('<a></a>').addClass('priority2 deselect-all').attr('id', 'link-deselect-top').attr('href', '#').text('Clear Blacklist');
            var liClearBl = $('<li></li>');
            aClearBl.click(function(e) {
                //Handler to clear the blacklist
                ClearBlacklist(); 
                $('.shortlist').empty();
            });
            divTop.append(ulTop.append(liClearBl.append(aClearBl)));
            myrmc.append(divTop);
            
            // Main body (properties)
            var list = $('<ol></ol>').addClass('shortlist').attr('id', 'summaries');
            $.each(GetBlacklistIds(), function(i,v) {
                var propertyInfo = GetBlacklistPropertyInfo(v);
                var item = $('<li></li>').addClass('summary-list-item');
                //Photo thumb
                var photoDiv1 = $('<div></div>').addClass('photoswrapper');
                var photoDiv2 = $('<div></div>').addClass('photos');
                var photoDiv3 = $('<div></div>').addClass('photoframe');
                var photoa = $('<a></a>').addClass('photo').attr('href', propertyInfo.link);
                var photoi = $('<img></img>').addClass('fixedPic').attr('src', propertyInfo.thumb);
                photoDiv1.append(photoDiv2.append(photoDiv3.append(photoa.append(photoi))));
                //Actions
                var moreinfo = $('<div></div>').addClass('moreinfo');
                var aRestore = $('<a></a>').addClass('priority2').attr('style', 'background-position: 0 -731px;').attr('href', '#').text('Start showing this property again');
                aRestore.click(function(e) {
                    RemoveFromBlacklist(v);
                    item.hide();
                });
                moreinfo.append($('<ul></ul>').append($('<li></li>').append(aRestore)));
                //All details
                var div1 = $('<div></div>').addClass('summarymaincontent');
                var div3 = $('<div></div>').addClass('details clearfix');
                var property = $('<a></a>').attr('href', propertyInfo.link).text(propertyInfo.title);
                item.append(div1.append(photoDiv1, div3.append(property).append(moreinfo)));
                list.append(item);
            });
            myrmc.append(list);
        });
    }
    
};


//=====================================================================================
// UTILS
//=====================================================================================

//
// Utility to override a function
//
function overrideFunction(originalfn, newfn) {
    var callback = originalfn
    return function(arg) {
        return newfn.call(this, callback, arg);
    };
};

//
// Utility to get blacklist property IDs only
//
function GetBlacklistIds() {
    return Object.keys(window.RMGM.BlacklistProperties);
};

//
// Utility to get the property info for a blacklisted property
function GetBlacklistPropertyInfo(propertyId) {
    return window.RMGM.BlacklistProperties[propertyId];
};

//
//
// Utility to add a property to the blacklist & persist
//
function AddToBlacklist(propertyId, info) {
    console.log('about to blacklist ' + propertyId);
    console.log(info);

    //Add to blacklist    
    window.RMGM.BlacklistProperties[propertyId] = info;
    //Persist blacklist
    GM_setValue('RMGM_Blacklist', JSON.stringify(window.RMGM.BlacklistProperties));
};

//
// Clear the blacklist
//
function ClearBlacklist() {
    //Persist emtpy blacklist
    GM_setValue('RMGM_Blacklist', JSON.stringify({}));
};

//
// Remove 1 property from blacklist
//
function RemoveFromBlacklist(propertyId) {
    //Remove from blacklist    
    delete window.RMGM.BlacklistProperties[propertyId];
    //Persist blacklist
    GM_setValue('RMGM_Blacklist', JSON.stringify(window.RMGM.BlacklistProperties)); 
}
                
//=====================================================================================
// MAIN
//=====================================================================================

// Restore blacklist from storage
var blacklist = GM_getValue('RMGM_Blacklist');
if (blacklist == undefined) {
    blacklist = {};
} else {
    blacklist = JSON.parse(blacklist);
}

// Global settings/state for the RightMoveGreaseMonkey script
// This object is shared between all RightMoveGreasyMonkey scripts
if (window.RMGM === undefined) window.RMGM = {};
window.RMGM.BlacklistProperties =  blacklist;   //stores the property blacklist


// Hide blacklisted properties
HidePropertiesFromListView();
HidePropertiesFromMapView();
HidePropertiesFromDetailsView();
// Add UI
AddBlacklistTabToMyRightmove();