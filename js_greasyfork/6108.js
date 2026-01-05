// ==UserScript==
// @name        Tsu Friends and Followers
// @namespace   tsu-friends-and-followers
// @description Tsu script to display Friends and Followers of all users on the current page
// @include     http://*tsu.co*
// @include     https://*tsu.co*
// @version     1.2
// @author      Armando Lüscher
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/6108/Tsu%20Friends%20and%20Followers.user.js
// @updateURL https://update.greasyfork.org/scripts/6108/Tsu%20Friends%20and%20Followers.meta.js
// ==/UserScript==

/**
 * Display Friends and Followers of all user links on the current page.
 * Automatically loads new data for newly appearing user links.
 *
 * waitForKeyElements is used in case the current browser does not support the MutationObserver.
 *
 * For changelog see https://github.com/noplanman/tsu-friends-and-followers/blob/master/CHANGELOG.md
 */

$( document ).ready(function () {

  /***************
  HELPER FUNCTIONS
  ***************/

  /**
   * Base64 library, just decoder: http://www.webtoolkit.info/javascript-base64.html
   * @param {string} e Base64 string to decode.
   */
  function base64_decode(e){var t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";var n="";var r,i,s;var o,u,a,f;var l=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(l<e.length){o=t.indexOf(e.charAt(l++));u=t.indexOf(e.charAt(l++));a=t.indexOf(e.charAt(l++));f=t.indexOf(e.charAt(l++));r=o<<2|u>>4;i=(u&15)<<4|a>>2;s=(a&3)<<6|f;n=n+String.fromCharCode(r);if(a!=64){n=n+String.fromCharCode(i)}if(f!=64){n=n+String.fromCharCode(s)}}return n}

  /**
   * Check if a string starts with a certain string.
   */
  if ( 'function' !== typeof String.prototype.startsWith ) {
    String.prototype.startsWith = function( str ) {
      return ( this.slice( 0, str.length ) == str );
    };
  }

  /**
   * Check if a string ends with a certain string.
   */
  if ( 'function' !== typeof String.prototype.endsWith ) {
    String.prototype.endsWith = function( str ) {
      return ( this.slice( -str.length ) == str );
    };
  }

  /**
   * Check if a string contains a certain string.
   */
  if ( 'function' !== typeof String.prototype.contains ) {
    String.prototype.contains = function( str ) {
      return ( this.indexOf( str ) >= 0 );
    };
  }


  // Add the required CSS rules.
  addCSS();

  // Output console messages?
  var debug = false;

  // Remember the user objects that are currently loading.
  var userObjectsBusyLoading = [];

  // The user objects that have finished loading.
  var userObjects = [];

  // Max number of tries to get friend and follower info.
  var maxTries = 60;

  // Add all the sub nav items.
  addSubNavItems();

  // URL where to get the newest script.
  var scriptURL = 'https://greasyfork.org/scripts/6108-tsu-friends-and-followers/code/Tsu%20Friends%20and%20Followers.user.js';

  var localVersion = 1.2;
  var getVersionAPIURL = 'https://api.github.com/repos/noplanman/tsu-friends-and-followers/contents/VERSION';
  // Check for remote version number.
  checkRemoteVersion();


  // Get the current page and start the observer to automatically update user links.
  setTimeout( function() {
    getCurrentPage();
    startObserver();
  }, 500);

  // Pages with preloaded data should be processed instantly,
  // as the observer can't necessarily detect any change in those.
  setTimeout( function() {
    loadFriendsAndFollowers();
  }, 1500);


  var currentPage;
  /**
   * Get the current page to know which queries to load and observe and
   * also for special cases of how the Friends and Followers details are loaded.
   */
  function getCurrentPage() {
    doLog( 'Getting current page.' );
    if( $( 'body.newsfeed' ).length ) {
      // Home feed.
      currentPage    = 'home';
      queryToLoad    = '.evac_user';
      queryToObserve = 'body.newsfeed';
    } else if ( $( 'body.discover' ).length ) {
      currentPage    = 'discover';
      queryToLoad    = 'body.discover .tree_child_fullname';
      // No observer necessary!
      // TODO: Also, with observer, this page goes crazy...
      queryToObserve = '';
    } else if ( $( '#profile_feed' ).length ) {
      // Diary
      currentPage    = 'diary';
      queryToLoad    = '.evac_user';
      queryToObserve = '#profile_feed';
    } else if ( $( 'body.tree' ).length ) {
      // Family tree.
      currentPage    = 'tree';
      queryToLoad    = 'body.tree .tree_child_fullname';
      queryToObserve = '.tree_page';
    } else if ( document.URL.contains( '/post/' ) ) {
      // Single post.
      currentPage    = 'post';
      queryToLoad    = '.evac_user';
      queryToObserve = '.post';
    } else if ( document.URL.endsWith( '/friends' ) ) {
      // Friends.
      currentPage    = 'friends';
      queryToLoad    = '.card .card_sub .info';
      queryToObserve = '.profiles_list';
    } else if ( document.URL.endsWith( '/followers' ) ) {
      // Followers.
      currentPage    = 'followers';
      queryToLoad    = '.card .card_sub .info';
      queryToObserve = '.profiles_list';
    } else if ( document.URL.endsWith( '/following' ) ) {
      // Following.
      currentPage    = 'following';
      queryToLoad    = '.card .card_sub .info';
      queryToObserve = '.profiles_list';
    } else if ( document.URL.contains( '/messages/' ) || document.URL.endsWith( '/messages' ) ) {
      // Messages.
      currentPage    = 'messages';
      queryToLoad    = '.message_box .content';
      queryToObserve = '.messages_content';
    }
    doLog( 'Current page: ' + currentPage );
  }


  // The elements that we are looking for. Get set in getCurrentPage();
  var queryToLoad;
  /**
   * Load Friends and Followers
   * @param {boolean} clean Delete saved details and refetch all.
   */
  function loadFriendsAndFollowers( clean ) {
    if ( clean ) {
      if ( confirm( 'Reload all Friend and Follower details of all users on the current page?' ) ) {
        doLog( '- (clean) Start loading Friends and Followers.' );

        // Reset lists.
        userObjectsBusyLoading = [];
        userObjects = [];

        // Remove all existing user links spans and brs.
        $( '.tff-span, .tff-br' ).remove();
        $( '.tff-processed' ).removeClass( 'tff-processed' );
      } else {
        return;
      }
    } else {
      doLog( '- Start loading Friends and Followers.' );
    }

    // Special case for "Discover Users".
    if ( 'discover' == currentPage ) {
      $( '#discover .user_card_1_wrapper' ).each(function() {
        $currentUserLink = $( this ).find( '.tree_child_fullname' );
        var userID;
        var classes = $( this ).find( '.follow_button' ).attr( 'class' ).split( ' ' );
        var search = 'follow_button_';
        for ( var i = classes.length - 1; i >= 0; i-- ) {
          if ( search == classes[i].slice( 0, search.length ) ) {
            userID = classes[i].substr( search.length );
            break;
          }
        }

        // Make the username a link to the profile.
        $currentUserLink.html( $( '<a/>', {
          href: '/users/' + userID,
          html: $currentUserLink.html()
        }));
      });
    }

    // Find all users and process them.
    $allUserLinks = $( queryToLoad );
    doLog( 'User links found: ' + $allUserLinks.length );
    $allUserLinks.each(function() {
      var $currentUserLink = $( this );

      // If this link is on a tooltip, ignore it!
      if ( $currentUserLink.closest( '.tooltipster-base' ).length ) {
        return;
      }

      // Try to get a numeric user id.
      var userID = $currentUserLink.attr( 'user_id' );

      // Special case for comments, because the html is "a.evac_user" instead of a nested entry "div.evac_user a".
      if ( 'a' != $currentUserLink.prop( 'tagName' ).toLowerCase() ) {
        $currentUserLink = $currentUserLink.find( 'a:first' );
      }

      // If no link has been found, continue with the next one. Fail-safe.
      if ( 0 === $currentUserLink.length ) {
        return;
      }

      // If the user link has already been processed, continue with the next one.
      if ( $currentUserLink.hasClass( 'tff-processed' ) || $currentUserLink.siblings( '.tff-span' ).length ) {
        return;
      }

      // Add a new <span> element to the user link.
      var $userLinkSpan = $( '<span/>', { html: '<img class="tff-loader-wheel" src="/assets/loader.gif" title="Loading..." />', 'class': 'tff-span' } );
      $currentUserLink.after( $userLinkSpan );

      // Special case for these pages, to make it look nicer and fitting.
      if ( 'friends' == currentPage || 'followers' == currentPage || 'following' == currentPage || 'discover' == currentPage ) {
        $userLinkSpan.before( '<br class="tff-br" />' );
      }

      // Get the user info from the link.
      var userName = $currentUserLink.text().trim();
      var userUrl  = $currentUserLink.attr( 'href' );

      // Special case for the Discover page to get the userID.
      if ( 'discover' == currentPage ) {
        userID = userUrl.split( '/' )[2];
      } else {
        userID = userID || userUrl.split( '/' )[1];
      }

      // Check if the current user has already been loaded.
      if ( userBusyLoading( userID, true ) ) {
        refreshUserObject( userID, $userLinkSpan, 0 );
        $currentUserLink.addClass( 'tff-processed' );
        return;
      }

      var loadedUserObject = userLoaded( userID );
      if ( loadedUserObject instanceof UserObject ) {
        refreshUserObject( loadedUserObject, $userLinkSpan, 0 );
        $currentUserLink.addClass( 'tff-processed' );
        return;
      }

      // Load the numbers from the user profile page.
      $( '<span/>' ).load( userUrl + ' .profile_details .numbers', function( response, status ) {
        if ( 'success' == status ) {
          var $numbers = $( 'a', this );

          var $friends = $( $numbers[0] );
          var friendsUrl = $friends.attr( 'href' );
          var friendsCount = $friends.find( 'span' ).text();
          var $friendsLink = $( '<a/>', {
            title: 'Friends',
            href: friendsUrl,
            html: friendsCount
          });

          var $followers = $( $numbers[1] );
          var followersUrl = $followers.attr( 'href' );
          var followersCount = $followers.find( 'span' ).text();
          var $followersLink = $( '<a/>', {
            title: 'Followers',
            href: followersUrl,
            html: followersCount
          });

          // Add the user details after the user link.
          refreshUserObject( userID, $userLinkSpan );

          addUserObject( userID, userName, userUrl, $friendsLink, friendsUrl, friendsCount, $followersLink, followersUrl, followersCount );
          $currentUserLink.addClass( 'tff-processed' );

        } else if ( 'error' == status ) {
          doLog( response, 'e' );
          $(this).html( 'n/a' );
        }

        // Make sure to set the user as finished loading.
        finishedLoading( userID );
      });
    });
  }

  var busyLoading = false;
  /**
   * If already busy loading, just wait a while before initiating another load.
   */
  var delayLoadFriendsAndFollowers = function() {
    if ( ! busyLoading ) {
      loadFriendsAndFollowers();
      setTimeout(function() {
        busyLoading = false;
      }, 2000 );
    }
    busyLoading = true;
  };


  /**
   * UserObject "class".
   * @param {string|integer} userID         Depending on the context, this is either the user id as a number or unique username / identifier.
   * @param {string}         userName       The user's full name.
   * @param {string}         userUrl        The url to the user profile page.
   * @param {jQuery}         $friendsLink   The jQuery <a> object linking to the user's Friends page.
   * @param {[string}        friendsUrl     The URL to the user's Friends page.
   * @param {[string}        friendsCount   The user's number of friends.
   * @param {jQuery}         $followersLink The jQuery <a> object linking to the user's Followers page.
   * @param {string}         followersUrl   The URL to the user's Followers page.
   * @param {string}         followersCount The user's number of Followers.
   */
  function UserObject( userID, userName, userUrl, $friendsLink, friendsUrl, friendsCount, $followersLink, followersUrl, followersCount ) {
    this.userID         = userID.trim();
    this.userName       = userName.trim();
    this.userUrl        = userUrl.trim();
    this.$friendsLink   = $friendsLink;
    this.friendsUrl     = friendsUrl.trim();
    this.friendsCount   = friendsCount.trim();
    this.$followersLink = $followersLink;
    this.followersUrl   = followersUrl.trim();
    this.followersCount = followersCount.trim();

    // Return a clone of the Friends page link.
    this.getFriendsLink = function() {
      return this.$friendsLink.clone();
    };

    // Return a clone of the Followers page link.
    this.getFollowersLink = function() {
      return this.$followersLink.clone();
    };
  }

  /**
   * Add a user object to the userObjects array.
   * See param info for UserObject().
   */
  function addUserObject( userID, userName, userUrl, $friendsLink, friendsUrl, friendsCount, $followersLink, followersUrl, followersCount ) {
    userObjects.push( new UserObject( userID, userName, userUrl, $friendsLink, friendsUrl, friendsCount, $followersLink, followersUrl, followersCount ) );
    doLog( '(' + userID + ':' + userName + ') New user loaded.' );
  }

  /**
   * Check to see if the user is still being loaded.
   * @param  {integer|string} userID     User ID as a numeric value or username string.
   * @param  {boolean}        setLoading If the user isn't being loaded yet, should it be set as loading?
   * @return {boolean}                   If the user is busy loading.
   */
  function userBusyLoading( userID, setLoading ) {
    for ( var i = userObjectsBusyLoading.length - 1; i >= 0; i-- ) {
      if ( userID == userObjectsBusyLoading[i] ) {
        return true;
      }
    }
    // If the user isn't loading and it should be set, add to loading list.
    if ( setLoading ) {
      userObjectsBusyLoading.push( userID );
    }
    return false;
  }

  /**
   * A user object has finished loading, remove it from the busyLoading array.
   * @param  {integer|string} userID User ID as a numeric value or username string.
   */
  function finishedLoading( userID ) {
    for ( var i = userObjectsBusyLoading.length - 1; i >= 0; i-- ) {
      if ( userID == userObjectsBusyLoading[i] ) {
        doLog( '(id:' + userID + ') Finished loading.' );
        delete userObjectsBusyLoading[i];
        return;
      }
    }
  }

  /**
   * Check if a user has already been loaded, if so, return the requested user object.
   * @param  {integer|string}     userID User ID as a numeric value or username string.
   * @return {boolean|UserObject}        If the user has been loaded, return user object, else return false.
   */
  function userLoaded( userID ) {
    for ( var i = userObjects.length - 1; i >= 0; i-- ) {
      if ( userID == userObjects[i].userID ) {
        doLog( '(' + userObjects[i].userID + ':' + userObjects[i].userName + ') Already loaded.' );
        return userObjects[i];
      }
    }
    doLog( '(id:' + userID + ') Not loaded yet.' );
    return false;
  }

  /**
   * Refresh the passed $userLinkSpan with the user details.
   * @param  {integer|UserObject} userID        The userID or userObject to get the details from.
   * @param  {jQuery}             $userLinkSpan The <span> jQuery object to appent the details to.
   * @param  {integer}            tries         The number of tries that have already been used to refresh the details.
   */
  function refreshUserObject( userID, $userLinkSpan, tries ) {
    if ( undefined === tries || null === tries ) {
      tries = 0;
    }

    // If the user object has been passed, use it and reset the userID. Otherwise, get the loaded user object if available.
    var userObject;
    if ( userID instanceof UserObject ) {
      userObject = userID;
      userID = userObject.userID;
    } else {
      userObject = userLoaded( userID );
    }

    // If the maximum tries has been exeeded, return.
    if ( tries > maxTries ) {
      // Just remove the failed link span, maybe it will work on the next run.
      $userLinkSpan.remove();

      doLog( '(id:' + userID + ') Maximum tries exeeded!', 'w' );
      return;
    }

    if ( userObject instanceof UserObject ) {
      // Add the user details after the user link.
      $userLinkSpan.empty().append( userObject.getFriendsLink(), userObject.getFollowersLink() );
      doLog( '(' + userObject.userID + ':' + userObject.userName + ') Friends and Followers set.' );
    } else {
      setTimeout(function() {
        refreshUserObject( userID, $userLinkSpan, tries + 1);
      }, 500);
    }
  }


  // The elements that we are observing. Get set in getCurrentPage().
  var queryToObserve;
  /**
   * Start observing for DOM changes.
   */
  function startObserver() {
    // The discover page needs special treatement here, as it doesn't need an observer.
    if ( 'discover' == currentPage ) {
      return;
    }

    doLog( 'Start Observer.', 'i' );
    // Check if we can use the MutationObserver.
    if ( 'MutationObserver' in window ) {
      var toObserve = document.querySelector( queryToObserve );
      if ( toObserve ) {
        var observer = new MutationObserver( function( mutations ) {
          doLog( mutations.length + ' DOM changes.' );
          doLog( mutations );

          var reload = false;
          // Ignore post and comment time updates.
          for ( var i = mutations.length - 1; i >= 0; i-- ) {
            var classes = mutations[i].target.className;
            if ( ! classes.contains( 'comment_time_from_now' ) && ! classes.contains( 'time_to_update' ) ) {
              reload = true;
              break;
            }
          }

          if ( reload ) {
            delayLoadFriendsAndFollowers();
          }
        });

        // Observe child and subtree changes.
        observer.observe( toObserve, {
          childList: true,
          subtree: true
        });
      }
    } else {
      // If we have no MutationObserver, use "waitForKeyElements" function.
      // Instead of using queryToObserve, we wait for the ones that need to be loaded, queryToLoad.
      $.getScript( 'https://gist.github.com/raw/2625891/waitForKeyElements.js', function() {
        waitForKeyElements( queryToLoad, delayLoadFriendsAndFollowers );
      });
    }
  }


  /**
   * Add the required CSS rules.
   */
  function addCSS() {
    doLog( 'Added CSS.' );
    $( '<style>' )
      .html( '\
        .tff-span a {\
          font-size: smaller;\
          margin-left: 5px;\
          border-radius: 3px;\
          background-color: #1ABC9C;\
          color: #fff !important;\
          padding: 2px 4px 0;\
        }\
        .tff-span .tff-loader-wheel {\
          margin-left: 5px;\
          height: 12px;\
        }\
        .user_card_1_wrapper .tree_child_fullname {\
          height: 32px !important;\
        }\
        #tff-menuitem-update a:before {\
          display: none !important;\
        }\
      ')
      .appendTo( 'head' );
  }

  /**
   * Add sub nav items to the menu.
   */
  function addSubNavItems() {
    doLog( 'Loading Sub Nav Items...' );

    // Load Friends and Followers
    if ( 0 === $( '#tff-menuitem-load-friends-and-followers' ).length ) {
      var $loadFriendsAndFollowersAnchor = $( '<a/>', { html: 'Load Friends and Followers' } );
      $loadFriendsAndFollowersAnchor.click( function() { loadFriendsAndFollowers( true ); } );

      var $loadFriendsAndFollowersListItem = $( '<li/>', { 'id': 'tff-menuitem-load-friends-and-followers' ,html: $loadFriendsAndFollowersAnchor } );

      $( '#navBarHead .sub_nav' ).append( $loadFriendsAndFollowersListItem );
      doLog( '- "Load Friends and Followers" appended.' );
    }

    doLog( 'Sub Nav Items loaded.' );
  }


  /**
   * Make a log entry if debug mode is active.
   * @param {string}  logMessage Message to write to the log console.
   * @param {string}  level      Level to log ([l]og,[i]nfo,[w]arning,[e]rror).
   * @param {boolean} alsoAlert  Also echo the message in an alert box.
   */
  function doLog( logMessage, level, alsoAlert ) {
    if ( debug ) {
      switch( level ) {
        case 'i': console.info( logMessage );  break;
        case 'w': console.warn( logMessage );  break;
        case 'e': console.error( logMessage ); break;
        default: console.log( logMessage );
      }
      if ( alsoAlert ) {
        alert( logMessage );
      }
    }
  }

  /**
   * Get the remote version on GitHub and add a menuitem and notification if a newer version is found.
   */
  function checkRemoteVersion() {
    $.getJSON( getVersionAPIURL, function ( response ) {
      var remoteVersion = parseFloat( base64_decode( response.content ) );
      doLog( 'Versions: Local (' + localVersion + '), Remote (' + remoteVersion + ')', 'i' );

      // Check if there is a newer version available.
      if ( remoteVersion > localVersion ) {
        // Change the background color of the name tab on the top right.
        $( '#navBarHead .tab.name' ).css( 'background-color', '#F1B054' );

        // Make sure the update link doesn't already exist!
        if ( 0 === $( '#tff-menuitem-update' ).length ) {
          var $updateLink = $( '<a/>', {
            title: 'Update Friends and Followers script to the newest version (' + remoteVersion + ')',
            href: scriptURL,
            html: 'Update Tsu F&F!'
          })
          .attr( 'target', '_blank' ) // Open in new window / tab.
          .css( { 'background-color' : '#F1B054', 'color' : '#fff' } ) // White text on orange background.
          .click(function() {
            if ( ! confirm( 'Upgrade to the newest version (' + remoteVersion + ')?\n\n(refresh this page after the script has been updated)' ) ) {
              return false;
            }
          });

          $( '<li/>', { 'id': 'tff-menuitem-update', html: $updateLink } )
          .appendTo( '#navBarHead .sub_nav' );
        }

      }
    })
    .fail(function() { doLog( 'Couldn\'t get remote version number for TFF.', 'w' ); });
  }

})();