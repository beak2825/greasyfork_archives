// ==UserScript==
// @name        Tsu Helper
// @namespace   tsu-helper
// @description Tsu script that adds a bunch of tweaks to make Tsu more user friendly.
// @include     http://*tsu.co*
// @include     https://*tsu.co*
// @version     2.6
// @copyright   2014-2015 Armando Lüscher
// @author      Armando Lüscher
// @oujs:author noplanman
// @grant       none
// @homepageURL https://j.mp/tsu-helper
// @supportURL  https://j.mp/tsu-helper-issues
// @downloadURL https://update.greasyfork.org/scripts/6372/Tsu%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/6372/Tsu%20Helper.meta.js
// ==/UserScript==

/**
 * For changelog see https://j.mp/tsu-helper-changelog
 */

/**
 * How nice of you to visit! I've tried to make this code as clean as possible with lots of
 * comments for everybody to learn from.
 *
 * Because that is what this life is about, to learn from each other and to grow together!
 *
 * If you have any questions, ideas, feature requests, (pretty much anything) about it, just ask :-)
 *
 * Simply visit the GitHub page here: https://j.mp/tsu-helper-issues and choose "New Issue".
 * I will then get back to you as soon as I can ;-)
 */

// Make sure we have jQuery loaded.
if ( ! ( 'jQuery' in window ) ) { return false; }

// Run everything as soon as the DOM is set up.
jQuery( document ).ready(function( $ ) {

  // Display Debug options? (for public).
  var publicDebug = false;

  /**
   * Base64 library, just decoder: http://www.webtoolkit.info/javascript-base64.html
   * @param {string} e Base64 string to decode.
   */
  function base64_decode(e){var t='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';var n='';var r,i,s;var o,u,a,f;var l=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,'');while(l<e.length){o=t.indexOf(e.charAt(l++));u=t.indexOf(e.charAt(l++));a=t.indexOf(e.charAt(l++));f=t.indexOf(e.charAt(l++));r=o<<2|u>>4;i=(u&15)<<4|a>>2;s=(a&3)<<6|f;n=n+String.fromCharCode(r);if(a!=64){n=n+String.fromCharCode(i);}if(f!=64){n=n+String.fromCharCode(s);}}return n;}

  // Check if a string starts with a certain string.
  'function'!=typeof String.prototype.startsWith&&(String.prototype.startsWith=function(t){return this.slice(0,t.length)==t;});

  // Check if a string ends with a certain string.
  'function'!=typeof String.prototype.endsWith&&(String.prototype.endsWith=function(t){return this.slice(-t.length)==t;});

  // Check if a string contains a certain string.
  'function'!=typeof String.prototype.contains&&(String.prototype.contains=function(t){return this.indexOf(t)>=0;});

  // Add stringify to jQuery (https://gist.github.com/chicagoworks/754454).
  jQuery.extend({stringify:function(r){if('JSON'in window)return JSON.stringify(r);var n=typeof r;if('object'!=n||null===r)return'string'==n&&(r='"'+r+'"'),String(r);var t,i,e=[],o=r&&r.constructor==Array;for(t in r)i=r[t],n=typeof i,r.hasOwnProperty(t)&&('string'==n?i='"'+i+'"':'object'==n&&null!==i&&(i=jQuery.stringify(i)),e.push((o?'':'"'+t+'":')+String(i)));return(o?'[':'{')+String(e)+(o?']':'}');}});

  // Serialize form data to save settings (http://stackoverflow.com/questions/1184624/convert-form-data-to-js-object-with-jquery).
  $.fn.serializeObject=function(){var i={},e=this.serializeArray();return $.each(e,function(){void 0!==i[this.name]?(i[this.name].push||(i[this.name]=[i[this.name]]),i[this.name].push(this.value||"")):i[this.name]=this.value||"";}),i;};

  /**
   * Like WP, return "selected" attribute text.
   * @param  {string} val1 Value to compare.
   * @param  {string} val2 Value to compare with.
   * @return {string}      "Selected" text or nothing.
   */
  function selected( val1, val2 ) {
    return ( val1 === val2 ) ? ' selected="selected"' : '';
  }

  /**
   * Like WP, return "checked" attribute text.
   * @param  {string} val1 Value to compare.
   * @param  {string} val2 Value to compare with.
   * @return {string}      "Checked" text or nothing.
   */
  function checked( val1, val2 ) {
    // Compare to "true" by default.
    val2 = ( undefined === val2 ) ? true : val2;
    return ( val1 === val2 ) ? ' checked="checked"' : '';
  }


  /**
   * All settings related methods and variables.
   */
  var Settings = {
    // All available settings with default values.
    settingsDefault : {
      debugLevel    : 'disabled',  // Debugging level. (disabled,[l]og,[i]nfo,[w]arning,[e]rror)
      hideAds       : false,       // Hide all ads.
      quickMention  : true,        // Add quick mention links.
      emphasizeNRP  : true,        // Emphasize nested replies parents.
      checkSocial   : true,        // Check the social network sharing.
      checkMaxHM    : true,        // Check for maximum hashtags and mentions.
      notifReloaded : 10           // How many items to display on the Notifications popup (0=disabled)
    },

    // Init with default settings on "load".
    settings : {},

    // Name used for the settings cookie.
    cookieName : 'tsu-helper-settings',

    /**
     * Set default settings.
     */
    setDefaults : function( $form ) {
      Settings.populateForm( $form, true );
    },

    /**
     * Load settings from cookie.
     */
    load : function() {
      // Init with defaults and add all loaded settings.
      $.extend( true, Settings.settings, Settings.settingsDefault );

      var savedJSON = $.cookie( Settings.cookieName );
      if ( savedJSON ) {
        $.extend( Settings.settings, $.parseJSON( savedJSON ) );
      }

      return Settings.settings;
    },

    /**
     * Populate the passed form with the current settings.
     * @param {jQuery}  $form    The form to be populated.
     * @param {boolean} defaults Load the default values?
     */
    populateForm : function( $form, defaults ) {
      if ( $form ) {
        for ( var setting in Settings.settings ) {
          if ( Settings.settings.hasOwnProperty( setting ) ) {
            var $input = $( '[name=' + setting + ']', $form );
            var val = ( defaults ) ? Settings.settingsDefault[ setting ] : Settings.settings[ setting ];
            if ( 'checkbox' === $input.attr( 'type' ) ) {
              $input.prop( 'checked', val );
            } else {
              $input.val( val );
            }
          }
        }
      }
    },

    /**
     * Save settings to cookie.
     */
    save : function( $form ) {
      // First save?
      if ( undefined === $.cookie( Settings.cookieName ) && ! confirm( 'Settings will be saved in a cookie. Ok?' ) ) {
        return false;
      }

      // If a form is passed, use those values.
      if ( $form ) {
        // Default to false and then get form settings.
        // This is necessary for checkbox inputs as they are assigned by checked state, not value.
        Settings.settings.hideAds      = false;
        Settings.settings.quickMention = false;
        Settings.settings.emphasizeNRP = false;
        Settings.settings.checkSocial  = false;
        Settings.settings.checkMaxHM   = false;

        $.extend( Settings.settings, $form.serializeObject() );
      }

      $.cookie( Settings.cookieName, $.stringify( Settings.settings ), { expires: 999, path: '/' } );
      return true;
    }
  };
  // Load settings from cookie.
  var settings = Settings.load();


  /**
   * All updater and version related variables.
   */
  var Updater = {
    // The local version.
    localVersion : 2.6,

    // The remote version (loaded in the "check" method).
    remoteVersion : null,

    // URL where to get the newest script.
    scriptURL : 'https://openuserjs.org/install/noplanman/Tsu_Helper.user.js',

    // Version details.
    versionAPIURL : 'https://api.github.com/repos/noplanman/tsu-helper/contents/VERSION',

    // Get the remote version on GitHub.
    init : function() {
      try {
        var response = $.ajax({
          type: 'GET',
          url: Updater.versionAPIURL,
          async: false
        }).fail(function() {
          doLog( 'Couldn\'t get remote version number for Tsu Helper.', 'w' );
        }).responseJSON;

        // Set the remote version.
        Updater.remoteVersion = parseFloat( base64_decode( response.content ) );
        doLog( 'Versions: Local (' + Updater.localVersion + '), Remote (' + Updater.remoteVersion + ')', 'i' );
      } catch( e ) {
        doLog( 'Couldn\'t get remote version number for Tsu Helper.', 'w' );
      }
    },

    /**
     * Is there a newer version available?
     * @return {Boolean} If there is a newer version available.
     */
    hasUpdate : function() {
      return ( Updater.remoteVersion > Updater.localVersion );
    }
  };
  // Initialise the updater to fetch the remote version.
  Updater.init();


  /**
   * TSU constants.
   */
  var TSUConst = {
    // Define the maximum number of hashtags and mentions allowed.
    maxHashtags : 10,
    maxMentions : 10,

    // Texts for all possible notifications.
    kindsTexts : {
      friend_request_accepted              : 'Friend Requests accepted',
      new_comment_on_post                  : 'Comments on your Posts',
      new_comment_on_post_you_commented_on : 'Comments on other Posts',
      new_follower                         : 'New Followers',
      new_like_on_post                     : 'Likes on your Posts',
      new_like_on_comment                  : 'Likes on your Comments',
      new_post_on_your_wall                : 'Posts on your Wall',
      someone_mentioned_you_in_a_post      : 'Mentioned in a Post or Comment',
      someone_shared_your_post             : 'Shares of your Posts',
      donation_received                    : 'Donations received',
      someone_joined_your_network          : 'Users who joined your Network'
    }
  };


  /**
   * Page related things.
   */
  var Page = {

    // The current page.
    current : '',

    /**
     * Get the current page to know which queries to load and observe and
     * also for special cases of how the Friends and Followers details are loaded.
     */
    init : function() {
      doLog( 'Getting current page.', 'i' );

      if ( $( 'body.newsfeed' ).length ) {                 Page.current = 'home';          // Home feed.
      } else if ( $( 'body.notifications.show' ).length
        || $( 'body.notifications.index' ).length ) {      Page.current = 'notifications'; // Show notifications.
      } else if ( $( 'body.search_hashtag' ).length ) {    Page.current = 'hashtag';       // Hashtag page.
      } else if ( $( 'body.profile.diary' ).length ) {     Page.current = 'diary';         // Diary.
      } else if ( $( 'body.show_post' ).length ) {         Page.current = 'post';          // Single post.
      } else if ( $( 'body.dashboard' ).length ) {         Page.current = 'analytics';     // Analytics.
        Observer.queryToObserve = ''; // No observer necessary!
      } else if ( $( 'body.messages' ).length ) {          Page.current = 'messages';      // Messages.
        Observer.queryToLoad    = '.messages_content .message_box';
        Observer.queryToObserve = '.messages_content';
      }

      // Group queries to load.
      if ( Page.is( 'has-posts' ) ) {
        queryToLoad = '.comment';
        // Add userlinks to query.
        Observer.queryToLoadFF = '.card .card_sub .info';
      }

      Observer.queryToLoad += ',' + Observer.queryToLoadFF;

      doLog( 'Current page: ' + Page.current, 'i' );
    },

    /**
     * Check if the passed page is the current one.
     * @param  {string}  pages Comma seperated list of pages.
     * @return {boolean}       If the current page is in the list.
     */
    is : function( pages ) {
      // To make things easier, allow shortcuts.
      pages = pages.replace( /has-userlinks/g, 'has-posts messages' );
      pages = pages.replace( /has-posts/g, 'home hashtag diary post' );

      // Make an array.
      pages = pages.split( ' ' );

      // Is the current page in the passed page list?
      for ( var i = pages.length - 1; i >= 0; i-- ) {
        if ( Page.current === pages[i] ) {
          return true;
        }
      }
      return false;
    }
  };


  /**
   * Quick Mention links.
   */
  var QM = {

    // The currently active textarea to insert the @mentions.
    $activeReplyTextArea : null,

    /**
     * Add text to the passed textarea input field.
     * @param {jQuery} $textArea jQuery object of the textarea input field.
     * @param {string} text      Text to add.
     */
    addTextToTextArea : function( $textArea, text ) {
      if ( $textArea ) {
        var textAreaText = $textArea.val();
        var caretPos1 = $textArea[0].selectionStart;
        var caretPos2 = $textArea[0].selectionEnd;
        $textArea.val( textAreaText.substring( 0, caretPos1 ) + text + textAreaText.substring( caretPos2 ) );
        $textArea[0].selectionStart = $textArea[0].selectionEnd = caretPos1 + text.length;
        $textArea.focus();
      }
    },

    /**
     * Add the @mention links to the replies.
     */
    load : function() {
      // Make sure the setting is enabled and we're on the right page.
      if ( ! settings.quickMention || ! Page.is( 'has-posts' ) ) {
        return;
      }

      doLog( 'Adding Quick Mention links.', 'i' );

      // Process all reply links to autofocus the reply textarea input field.
      $( '.load_more_post_comment_replies' ).not( '.th-qm-reply-processed' ).each(function() {
        var $replyLink = $( this );
        $replyLink.click(function() {
          var $postComment    = $replyLink.closest( '.post_comment' );
          var $replyContainer = $postComment.siblings( '.comment_reply_container' );
          var $textArea       = $replyContainer.children( '.post_write_comment' ).find( '#comment_text' );

          // This gets called before the "official" click, so the logic is inversed!
          // And delay everything a bit too, as it gets lazy-loaded.
          if ( $replyContainer.is( ':visible' ) ) {
            setTimeout(function() {
              // Only set the active textarea null if it's this one.
              if ( $textArea[0] === QM.$activeReplyTextArea[0] ) {
                QM.$activeReplyTextArea = null;
                // Hide all @ links.
                $( '.th-qm-reply' ).hide();
              }
            }, 100);
          } else {
            setTimeout(function() {
              $postComment.find( '.th-qm-reply' ).show();
              $textArea.focus();
            }, 100);
          }
        });
        $replyLink.addClass( 'th-qm-reply-processed' );
      });

      // Process all comment / reply textarea input fields to set themselves as active on focus.
      $( '.post_write_comment #comment_text' ).not( '.th-qm-textarea-processed' ).each(function() {
        $( this ).focusin( function() {
          QM.$activeReplyTextArea = $( this );
          $( '.th-qm-active-input' ).removeClass( 'th-qm-active-input' );
          QM.$activeReplyTextArea.closest( '.expandingText_parent' ).addClass( 'th-qm-active-input' );
        });
        $( this ).addClass( 'th-qm-textarea-processed' );
      });

      // Link for all comments.
      $( '.post_comment_header' ).not( '.th-qm-added' ).each(function() {
        var $head = $( this );
        var $commentArea = $head.closest( '.post_comment' );

        // Get just the last part of the href, the username.
        var hrefBits = $head.find( 'a' ).attr( 'href' ).split( '/' );
        var atUsername = '@' + hrefBits[ hrefBits.length - 1 ] + ' ';

        var $mentionLink = $( '<a/>', {
          class : 'th-qm-reply',
          html  : '@ +',
          title : 'Add ' + atUsername + 'to current reply.',
          click : function() {
            QM.addTextToTextArea( QM.$activeReplyTextArea, atUsername );
          }
        })
        .hide(); // Start hidden, as it will appear with the mouse over event.

        // Show / hide link on hover / blur if there is an active reply input selected.
        $commentArea.hover(
          function() { if ( QM.$activeReplyTextArea && QM.$activeReplyTextArea.length ) { $mentionLink.show(); } },
          function() { $mentionLink.hide(); }
        );

        $head.addClass( 'th-qm-added' );

        // Position the @ link.
        var $profilePic = $head.find( '.post_profile_picture' );
        var offset = $profilePic.position();
        $mentionLink.offset({ top: offset.top + $profilePic.height(), left: offset.left });

        $head.append( $mentionLink );
      });

      // Link for all textareas.
      $( '.post_write_comment' ).not( '.th-qm-added' ).each(function() {
        var $commentArea = $( this );
        var $commentInput = $commentArea.find( '#comment_text' );
        var $head = null;
        var linkElement = null;
        var isReply = $commentArea.hasClass( 'reply' );

        // Is this a nested comment? Then use the previous reply as the username.
        if ( isReply ) {
          $head = $commentArea.closest( '.comment' ).find( '.post_comment .post_comment_header' );
          linkElement = 'a';
        } else {
          // Get the current post to determine the username.
          var $post = $commentArea.closest( '.post' );

          // Defaults as if we have a shared post.
          $head = $post.find( '.share_header' );
          linkElement = '.evac_user a';

          // If it's not a share, get the post header.
          if ( 0 === $head.length ) {
            $head = $post.find( '.post_header' );
            linkElement = '.post_header_pp a';
          }
        }

        // Get just the last part of the href, the username.
        var hrefBits = $head.find( linkElement ).attr( 'href' ).split( '/' );
        var atUsername = '@' + hrefBits[ hrefBits.length - 1 ] + ' ';

        var $mentionLink = $( '<a/>', {
          class : 'th-qm-comment',
          html  : '@ >',
          title : 'Add ' + atUsername + 'to this ' + ( ( isReply ) ? 'reply.' : 'comment.' ),
          click : function() {
            QM.addTextToTextArea( $commentInput, atUsername );
          }
        })
        .hide(); // Start hidden, as it will appear with the mouse over event.

        // Show / hide link on hover / blur.
        $commentArea.hover(
          function() { $mentionLink.show(); },
          function() { $mentionLink.hide(); }
        );

        $commentArea.addClass( 'th-qm-added' );

        $commentArea.find( '.post_profile_picture' ).parent().after( $mentionLink );
      });
    }
  };


  /**
   * The MutationObserver to detect page changes.
   */
  var Observer = {

    // The mutation observer object.
    observer : null,

    // The elements that we are observing.
    queryToObserve : 'body',
    // The query of objects that trigger the observer.
    queryToLoad    : '',
    // The query of userlinks to look for.
    queryToLoadFF  : '',

    /**
     * Start observing for DOM changes.
     */
    init : function() {

      // Check if we can use the MutationObserver.
      if ( 'MutationObserver' in window ) {
        // Are we observing anything on this page?
        if ( '' === Observer.queryToObserve ) {
          return;
        }

        var toObserve = document.querySelector( Observer.queryToObserve );

        if ( toObserve ) {

          doLog( 'Started Observer.', 'i' );

          Observer.observer = new MutationObserver( function( mutations ) {

            function itemsInArray( needles, haystack ) {
              for ( var i = needles.length - 1; i >= 0; i-- ) {
                if ( $.inArray( needles[ i ], haystack ) > -1 ) {
                  return true;
                }
              }
              return false;
            }

            // Helper to determine if added or removed nodes have a specific class.
            function mutationNodesHaveClass( mutation, classes ) {
              classes = classes.split( ' ' );

              // Added nodes.
              for ( var ma = mutation.addedNodes.length - 1; ma >= 0; ma-- ) {
                var addedNode = mutation.addedNodes[ ma ];
                // In case the node has no className (e.g. textnode), just ignore it.
                if ( 'className' in addedNode && 'string' === typeof addedNode.className && itemsInArray( addedNode.className.split( ' ' ), classes ) ) {
                  return true;
                }
              }

              // Removed nodes.
              for ( var mr = mutation.removedNodes.length - 1; mr >= 0; mr-- ) {
                var removedNode = mutation.removedNodes[ mr ];
                // In case the node has no className (e.g. textnode), just ignore it.
                if ( 'className' in removedNode && 'string' === typeof removedNode.className && itemsInArray( removedNode.className.split( ' ' ), classes ) ) {
                  return true;
                }
              }

              return false;
            }

            doLog( mutations.length + ' DOM changes.' );
            doLog( mutations );

            // Only react to changes we're interested in.
            for ( var m = mutations.length - 1; m >= 0; m-- ) {
              var $hoverCard = $( '.tooltipster-user-profile' );

              // Are we on a hover card?
              if ( $hoverCard.length && mutationNodesHaveClass( mutations[ m ], 'tooltipster-user-profile' ) ) {
                FFC.loadUserHoverCard( $hoverCard.find( '.card .card_sub .info' ) );
              }

              // Run all functions responding to DOM updates.
              // When loading a card, only if it's not a hover card, as those get loaded above.
              if ( mutationNodesHaveClass( mutations[ m ], 'post comment message_content_feed message_box' )
                || ( mutationNodesHaveClass( mutations[ m ], 'card' ) && $hoverCard.length === 0 ) ) {
                FFC.loadAll();
                QM.load();
                emphasizeNestedRepliesParents();
                tweakMessagesPage();
              }
            }
          });

          // Observe child and subtree changes.
          Observer.observer.observe( toObserve, {
            childList: true,
            subtree: true
          });
        }
      } else {
        // If we have no MutationObserver, use "waitForKeyElements" function.
        // Instead of using queryToObserve, we wait for the ones that need to be loaded, queryToLoad.
        $.getScript( 'https://gist.github.com/raw/2625891/waitForKeyElements.js', function() {

          doLog( 'Started Observer (waitForKeyElements).', 'i' );

          // !! Specifically check for the correct page to prevent overhead !!

          if ( Page.is( 'has-userlinks' ) ) {
            waitForKeyElements( Observer.queryToLoad, FFC.loadAll() );
          }
          if ( Page.is( 'has-posts' ) ) {
            waitForKeyElements( Observer.queryToLoad, QM.load );
            waitForKeyElements( Observer.queryToLoad, emphasizeNestedRepliesParents );
          }
          if ( Page.is( 'messages' ) ) {
            waitForKeyElements( Observer.queryToLoad, tweakMessagesPage );
          }
        });
      }
    }
  };


  /**
   * Post related things.
   */
  var Posting = {

    // Are we busy waiting for the popup to appear?
    waitingForPopup : false,

    /**
     * Initialise.
     */
    init : function() {
      // Remind to post to FB and Twitter in case forgotten to click checkbox.
      $( '#create_post_form' ).submit(function( event ) {
        return Posting.postFormSubmit( $( this ), event );
      });

      // Set focus to message entry field on page load.
      if ( Page.is( 'home diary' ) ) {
        $( '#text' ).focus();
      }

      // When using the "Create" or "Message" buttons, wait for the post input form.
      $( 'body' ).on( 'click', '.create_post_popup, .message_pop_up', function() {
        if ( ! Posting.waitingForPopup ) {
          if ( $( this ).hasClass( 'create_post_popup' ) ) {
            Posting.waitForPopup( 'post' );
          } else if ( $( this ).hasClass( 'message_pop_up' ) ) {
            Posting.waitForPopup( 'message' );
          }
        }
      });

      // Auto-focus title entry field when adding title.
      $( 'body' ).on( 'click', '.create_post .options .add_title', function() {
        var $postForm  = $( this ).closest( '#create_post_form' );
        var $postTitle = $postForm.find( '#title' );
        // Focus title or text field, depending if the title is being added or removed.
        if ( $postTitle.is( ':visible' ) ) {
          setTimeout( function() { $postForm.find( '#text' ).focus(); }, 50 );
        } else {
          setTimeout( function() { $postTitle.focus(); }, 50 );
        }
      });

      // Auto-focus message entry field when adding/removing image.
      $( 'body' ).on( 'click', '.create_post .options .filebutton, .cancel_icon_createpost', function() {
        var $postText = $( this ).closest( '#create_post_form' ).find( '#text' );
        setTimeout( function() { $postText.focus(); }, 50 );
      });


      /**
       * Open post by double clicking header (only on pages with posts).
       */
      if ( ! Page.is( 'has-posts' ) ) {
        return;
      }

      $( 'body' ).on( 'dblclick', '.post_header_name, .share_header', function( event ) {
        var $post      = $( this ).closest( '.post' );
        var isShare    = $post.find( '.share_header' ).length;
        var isOriginal = ! $( this ).hasClass( 'share_header' );
        $post.find( '#post_link_dropdown a' ).each(function() {
          var linkText = $( this ).text().trim().toLowerCase();
          if ( ( ! isShare && 'open' === linkText )
            || ( ! isOriginal && 'open' === linkText )
            || ( isOriginal && 'open original post' === linkText ) ) {

            var url = $( this ).attr( 'href' );
            // If the shift key is pressed, open in new window / tab.
            if ( event.shiftKey ) {
              window.open( url, '_blank' ).focus();
            } else {
              window.location = url;
            }
            return;
          }
        });
      });
    },

    /**
     * Check for the maximum number of hashtags and mentions.
     * @param  {string}  message The message being posted.
     * @return {boolean}         True = submit, False = cancel, Null = not too many
     */
    checkMaximumHashtagsMentions : function( message ) {
      // Check if the setting is enabled.
      if ( ! settings.checkMaxHM ) {
        return null;
      }

      // Get number of hashtags and mentions in the message.
      var nrOfHashtags = message.split( '#' ).length - 1;
      doLog( nrOfHashtags + ' Hashtags found.' );
      var nrOfMentions = message.split( '@' ).length - 1;
      doLog( nrOfMentions + ' Mentions found.' );

      // If the limits aren't exeeded, just go on to post.
      if ( nrOfHashtags <= TSUConst.maxHashtags && nrOfMentions <= TSUConst.maxMentions ) {
        return null;
      }

      // Set up warning message.
      var warning = 'Limits may be exceeded, check your message!\nAre you sure you want to continue?\n';
      if ( nrOfHashtags > TSUConst.maxHashtags ) {
        warning += '\n' + nrOfHashtags + ' #hashtags found. (Max. ' + TSUConst.maxHashtags + ')';
        doLog( 'Too many hashtags found! (' + nrOfHashtags + ')', 'w' );
      }
      if ( nrOfMentions > TSUConst.maxMentions ) {
        warning += '\n' + nrOfMentions + ' @mentions found. (Max. ' + TSUConst.maxMentions + ')';
        doLog( 'Too many mentions found! (' + nrOfMentions + ')', 'w' );
      }

      // Last chance to make sure about hashtags and mentions.
      return confirm( warning );
    },

    /**
     * Check if the social network sharing has been selected.
     * @param  {jQuery}  $form Form jQuery object of the form being submitted.
     * @return {boolean}       True = submit, False = cancel, Null = all selected
     */
    checkSocialNetworkSharing : function( $form ) {
      // Check if the setting is enabled.
      if ( ! settings.checkSocial ) {
        return null;
      }

      var share_facebook = null;
      var share_twitter  = null;

      // Get all visible (connected) checkboxes. If any are not checked, show warning.
      $form.find( '.checkboxes_options_create_post input:visible' ).each(function() {
        switch ( $( this ).attr( 'id' ) ) {
          case 'facebook': share_facebook = $( this ).prop( 'checked' ); break;
          case 'twitter':  share_twitter  = $( this ).prop( 'checked' ); break;
        }
      });

      // If no social network accounts are connected, just go on to post.
      if ( false !== share_facebook && false !== share_twitter ) {
        return null;
      }

      var post_to = 'OK = Post to Tsu';

      // Share to facebook?
      if ( true === share_facebook ) {
        post_to += ', Facebook';
      }
      // Share to twitter?
      if ( true === share_twitter ) {
        post_to += ', Twitter';
      }

      // Last chance to enable sharing to social networks...
      return confirm( post_to + '\nCancel = Choose other social networks' );
    },

    /**
     * Called on form submit.
     * @param  {jQuery} $form Form jQuery object of the form being submitted.
     * @param  {event}  event The form submit event.
     */
    postFormSubmit : function( $form, event ) {
      // In case the post gets cancelled, make sure the message field is focused.
      var message = $form.find( '#text' ).focus().val();
      var title   = $form.find( '#title' ).val();
      var hasPic  = ( '' !== $form.find( '#create_post_pic_preview' ).text() );

      // Make sure something was entered (title, text or image.
      // Check for the maximum number of hashtags and mentions,
      // and if the Social network sharing warning has been approved.
      if ( ( '' !== message || '' !== title || hasPic )
        && false !== Posting.checkMaximumHashtagsMentions( message )
        && false !== Posting.checkSocialNetworkSharing( $form ) ) {
        doLog( 'Post!' );
        return;
      }


      /**************************
      * CANCEL FORM SUBMISSION! *
      **************************/
      doLog( 'DONT Post!' );

      // Prevent form post.
      event.preventDefault();

      // Hide the loader wheel.
      $form.find( '.loading' ).hide();

      // Make sure to enable the post button again. Give it some time, as Tsu internal script sets it to disabled.
      setTimeout(function(){
        $form.find( '#create_post_button' ).removeAttr( 'disabled' );
      }, 500 );

      return false;
    },

    /**
     * Wait for the fancybox popup to create a new post.
     */
    waitForPopup : function( action ) {
      Posting.waitingForPopup = true;

      var formSelector;
      var inputSelector;
      switch ( action ) {
        case 'post'    :
          formSelector  = '.fancybox-wrap #create_post_form';
          inputSelector = '#text';
          break;
        case 'message' :
          formSelector  = '.fancybox-wrap #new_message';
          inputSelector = '#message_body';
          break;
      }

      var $form = $( formSelector );
      if ( $form.length ) {
        $form.find( inputSelector ).focus();

        // Apply checks to posts only!
        if ( 'post' === action ) {
          $form.submit(function( event ) {
            return Posting.postFormSubmit( $( this ), event );
          });
        }
        Posting.waitingForPopup = false;
        return;
      }

      // Wait around for it longer...
      setTimeout( function() { Posting.waitForPopup( action ); }, 500 );
    }
  };


  /**
   * User object containing info for Friends and Followers counter.
   * @param {string|integer} userID   Depending on the context, this is either the user id as a number or unique username / identifier.
   * @param {string}         userName The user's full name.
   * @param {string}         userUrl  The url to the user profile page.
   */
  function UserObject( userID, userName, userUrl ) {

    // Keep track if this user object has already finished loading.
    this.finished = false;
    this.userID   = userID;
    this.userName = userName;
    this.userUrl  = userUrl;

    // Add to all userObjects list.
    Users.userObjects[ userID ] = this;

    // Queue of user link spans to refresh once the user object has finished loading.
    this.userLinkSpans = [];

    doLog( '(' + userID + ':' + userName + ') New user loaded.' );

    /**
     * Set the friends info.
     * @param {jQuery}  $friendsLink The jQuery <a> object linking to the user's Friends page.
     * @param {[string} friendsUrl   The URL to the user's Friends page.
     * @param {[string} friendsCount The user's number of friends.
     */
    this.setFriendsInfo = function( $friendsLink, friendsUrl, friendsCount ) {
      this.$friendsLink   = $friendsLink;
      this.friendsUrl     = friendsUrl;
      this.friendsCount   = friendsCount;
    };

    /**
     * Set the followers info.
     * @param {jQuery} $followersLink The jQuery <a> object linking to the user's Followers page.
     * @param {string} followersUrl   The URL to the user's Followers page.
     * @param {string} followersCount The user's number of Followers.
     */
    this.setFollowersInfo = function( $followersLink, followersUrl, followersCount ) {
      this.$followersLink   = $followersLink;
      this.followersUrl     = followersUrl;
      this.followersCount   = followersCount;
    };

    /**
     * Return a clone of the Friends page link.
     * @return {jQuery} Friends page link.
     */
    this.getFriendsLink = function() {
      return this.$friendsLink.clone();
    };

    /**
     * Return a clone of the Followers page link.
     * @return {jQuery} Followers page link.
     */
    this.getFollowersLink = function() {
      return this.$followersLink.clone();
    };

    /**
     * Set this user object as finished loading.
     */
    this.setFinished = function() {
      this.finished = true;
      doLog( '(id:' + this.userID + ') Finished loading.' );
    };

    /**
     * Is this user object already loaded?
     * @return {Boolean}
     */
    this.isFinished = function() {
      return this.finished;
    };

    /**
     * Add a user link span to the queue to be refreshed once the user object is loaded.
     * @param  {jQuery} $userLinkSpan The user link span object.
     */
    this.queueUserLinkSpan = function( $userLinkSpan ) {
      this.userLinkSpans.push( $userLinkSpan );
    };

    /**
     * Refresh the passed $userLinkSpan with the user details.
     * @param  {jQuery}  $userLinkSpan The <span> jQuery object to appent the details to.
     * @param  {integer} tries         The number of tries that have already been used to refresh the details.
     */
    this.refresh = function( $userLinkSpan, tries ) {
      if ( undefined === tries || null === tries ) {
        tries = 0;
      }

      // If the maximum tries has been exeeded, return.
      if ( tries > FFC.maxTries ) {
        // Just remove the failed link span, maybe it will work on the next run.
        $userLinkSpan.remove();

        // Remove all queued ones too to prevent infinite loader image.
        for ( var i = this.userLinkSpans.length - 1; i >= 0; i-- ) {
          this.userLinkSpans[ i ].remove();
        }
        this.userLinkSpans = [];

        doLog( '(id:' + this.userID + ') Maximum tries exeeded!', 'w' );
        return;
      }

      if ( this.isFinished() ) {
        // Add the user details after the user link.
        this.queueUserLinkSpan( $userLinkSpan );

        // Update all listening user link spans.
        for ( var i = this.userLinkSpans.length - 1; i >= 0; i-- ) {
          this.userLinkSpans[ i ].empty().append( this.getFriendsLink(), this.getFollowersLink() );
        }

        // Empty the queue, as there is no need to reload already loaded ones.
        this.userLinkSpans = [];

        doLog( '(' + this.userID + ':' + this.userName + ') Friends and Followers set.' );
      } else {
        var t = this;
        setTimeout(function() {
          t.refresh( $userLinkSpan, tries + 1);
        }, 1000);
      }
    };
  }

  /**
   * Friends and Followers counts manager.
   */
  var FFC = {

    // Max number of tries to get friend and follower info (= nr of seconds).
    maxTries : 60,

    /**
     * Load a user link.
     * @param  {jQuery}  $userElement The element that contains the user link.
     * @param  {boolean} onHoverCard  Is this element a hover card?
     */
    loadUserLink : function( $userElement, onHoverCard ) {

      // If this link has already been processed, skip it.
      if ( $userElement.hasClass( 'ffc-processed' ) ) {
        return;
      }

      // Set the "processed" flag to prevent loading the same link multiple times.
      $userElement.addClass( 'ffc-processed' );


      // Because the user link is in a nested entry.
      var $userLink = $userElement.find( 'a:first' );

      // If no link has been found, continue with the next one. Fail-safe.
      if ( 0 === $userLink.length ) {
        return;
      }

      // Add a new <span> element to the user link.
      var $userLinkSpan = $( '<span/>', { html: '<img class="th-ffc-loader-wheel" src="/assets/loader.gif" alt="Loading..." />', class: 'th-ffc-span' } );
      $userLink.after( $userLinkSpan );

      // Special case for these pages, to make it look nicer and fitting.
      if ( onHoverCard ) {
        $userLinkSpan.before( '<br class="th-ffc-br" />' );
      }

      // Get the user info from the link.
      var userName = $userLink.text().trim();
      var userUrl  = $userLink.attr( 'href' );

      // Extract the userID from the url.
      var userID = userUrl.split( '/' )[1];

      // Check if the current user has already been loaded.
      var userObject = Users.getUserObject( userID, true );

      // Add this span to the list that needs updating when completed.
      if ( userObject instanceof UserObject ) {

        // If this user has already finished loading, just update the span, else add it to the queue.
        if ( userObject.isFinished() ) {
          userObject.refresh( $userLinkSpan, 0 );
        } else {
          userObject.queueUserLinkSpan( $userLinkSpan );
        }

        return;
      }

      // Create a new UserObject and load it's data.
      userObject = new UserObject( userID, userName, userUrl );

      // Load the numbers from the user profile page.
      setTimeout( function() { $.get( userUrl, function( response ) {
        // Get rid of all images first, no need to load those, then find the links.
        var $numbers = $( response.replace( /<img[^>]*>/g, '' ) ).find( '.profile_details .numbers a' );

        // If the user doesn't exist, just remove the span.
        if ( 0 === $numbers.length ) {
          $userLinkSpan.remove();
          return;
        }

        // Set up the Friends link.
        var $friends = $numbers.eq( 0 );
        var friendsUrl = $friends.attr( 'href' );
        var friendsCount = $friends.find( 'span' ).text();
        var $friendsLink = $( '<a/>', {
          href: friendsUrl,
          html: friendsCount
        });

        // Set up the Followers link.
        var $followers = $numbers.eq( 1 );
        var followersUrl = $followers.attr( 'href' );
        var followersCount = $followers.find( 'span' ).text();
        var $followersLink = $( '<a/>', {
          href: followersUrl,
          html: followersCount
        });

        // Add titles to pages without posts and not on hover cards.
        if ( ! onHoverCard && ! Page.is( 'has-posts' ) ) {
          $friendsLink.attr( 'title', 'Friends' );
          $followersLink.attr( 'title', 'Followers' );
        }

        // Add the Friends and Followers details, then refresh all userlink spans.
        userObject.setFriendsInfo(   $friendsLink,   friendsUrl,   friendsCount   );
        userObject.setFollowersInfo( $followersLink, followersUrl, followersCount );
        userObject.refresh( $userLinkSpan, 0 );
      })
      .always(function() {
        // Make sure to set the user as finished loading.
        Users.finishedLoading( userID );
      }); }, 100 );
    },

    /**
     * Load the FF counts for a user's hover card.
     * @param  {jQuery} $userHoverCard Hover card selector.
     */
    loadUserHoverCard : function( $userHoverCard ) {
      var t = this;
      // As long as the hover tooltip exists but the card inside it doesn't, loop and wait till it's loaded.
      if ( $( '.tooltipster-user-profile' ).length && $userHoverCard.length === 0 ) {
        setTimeout(function(){
          t.loadUserHoverCard( $( $userHoverCard.selector, $userHoverCard.context ) );
        }, 500);
        return;
      }

      doLog( 'Start loading Friends and Followers (Hover Card).', 'i' );

      FFC.loadUserLink( $userHoverCard, true );
    },

    /**
     * Load Friends and Followers
     * @param {boolean} clean Delete saved details and refetch all.
     */
    loadAll : function( clean ) {
      if ( Page.is( 'has-posts' ) ) {
        return;
      }

      doLog( 'Start loading Friends and Followers.', 'i' );

      // Find all users and process them.
      var $newUserLinks = $( Observer.queryToLoadFF ).not( '.ffc-processed' );

      doLog( 'New user links found: ' + $newUserLinks.length );

      // Load all userlinks.
      $newUserLinks.each(function() {
        var $userElement = $( this );

        // Is this link on a tooltip hover card?
        var onHoverCard = ( $userElement.closest( '.tooltipster-base' ).length !== 0 );

        FFC.loadUserLink( $userElement, onHoverCard );
      });
    }
  };

  /**
   * Manage all users for the Friends and Followers counting.
   */
  var Users = {

    userObjects : {},

    getUserObject : function( userID, setLoading ) {
      if ( Users.userObjects.hasOwnProperty( userID ) ) {
        doLog( '(' + userID + ':' + Users.userObjects[ userID ].userName + ') Already loaded.' );
        return Users.userObjects[ userID ];
      }

      if ( setLoading ) {
        doLog( '(id:' + userID + ') Set to loading.' );
        Users.userObjects[ userID ] = true;
      }

      doLog( '(id:' + userID + ') Not loaded yet.' );
      return false;
    },

    finishedLoading : function( userID ) {
      if ( Users.userObjects.hasOwnProperty( userID ) ) {
        Users.userObjects[ userID ].setFinished();
      }
    }
  };


  // Initialise after all variables are defined.
  Page.init();
  Observer.init();
  Posting.init();


  // Add the required CSS rules.
  addCSS();

  // Add the About (and Settings) window to the menu.
  addAboutWindow();


  // As the observer can't detect any changes on static pages, run functions now.
  FFC.loadAll();
  QM.load();
  emphasizeNestedRepliesParents();
  tweakMessagesPage();


  // Load Notifications Reloaded?
  if ( settings.notifReloaded > 0 ) {
    notifications.urls.notifications = '/notifications/request/?count=' + settings.notifReloaded;
    notifications.get().success(function() {
      $.event.trigger( 'notificationsRender' );
    });
  }

  // Add Notifications Reloaded to the notifications page.
  if ( Page.is( 'notifications' ) ) {

    var $ajaxNRRequest = null;
    var $notificationsList = $( '#new_notifications_list' );

    // Add the empty filter message
    var $emptyFilterDiv = $( '<div>No notifications match the selected filter. Coose a different one.</div>' );

    // Select input to filter kinds.
    var $kindSelect = $( '<select/>', {
      'id'  : 'th-nr-nk-select',
      title : 'Filter by the kind of notification'
    });

    // Select input to filter users.
    var $userSelect = $( '<select/>', {
      'id'  : 'th-nr-nu-select',
      title : 'Filter by user'
    });

    // List the available count options.
    var selectCount = '';
    [ 30, 50, 100, 200, 300, 400, 500 ].forEach(function( val ) {
      selectCount += '<option value="' + val + '">' + val + '</option>';
    });

    /**
     * Filter the current items according to the selected filters.
     * @param {string} which Either "kind" or "user".
     */
    function filterNotifications( which ) {
      var $notificationItems = $notificationsList.find( '.notifications_item' ).show();
      var kindVal = $kindSelect.val();
      var userVal = $userSelect.val();

      if ( undefined === which )
        updateSelectFilters( $notificationItems );

      // Filter kinds.
      if ( '' !== $kindSelect.val() ) {
        $notificationItems.not( '[data-kind="' + kindVal + '"]' ).hide();
      }

      // Filter users.
      if ( '' !== $userSelect.val() ) {
        $notificationItems.not( '[data-user-id="' + userVal + '"]' ).hide();
      }

      var $notificationItemsVisible = $notificationItems.filter( function() { return $( this ).find( '.new_notification:visible' ).length; } );

      if ( $notificationItemsVisible.length ) {
        $emptyFilterDiv.hide();
      } else {
        $emptyFilterDiv.show();
      }

      // The other select filter, not the current one.
      var other = ( 'kind' === which ) ? 'user' : 'kind';

      if ( '' === kindVal && '' === userVal ) {
        updateSelectFilters( $notificationItems, other );
      } else {
        updateSelectFilters( $notificationItemsVisible, which );
      }
    }

    /**
     * Update the entries and count values of the filter select fields.
     * @param  {jQuery} $notificationItems List of notification items to take into account.
     * @param  {string} which              The filter that is being set ("kind" or "user").
     */
    function updateSelectFilters( $notificationItems, which ) {
      // Remember the last selections.
      var lastKindSelected = $kindSelect.val();
      var lastUserSelected = $userSelect.val();

      // The available items to populate the select fields.
      var availableKinds = {};
      var availableUsers = {};

      $notificationItems.each(function() {
        var $notificationItem = $( this );

        // Remember all the available kinds and the number of occurrences.
        if ( availableKinds.hasOwnProperty( $notificationItem.attr( 'data-kind' ) ) ) {
          availableKinds[ $notificationItem.attr( 'data-kind' ) ]++;
        } else {
          availableKinds[ $notificationItem.attr( 'data-kind' ) ] = 1;
        }

        // Remember all the available users and the number of occurrences.
        if ( availableUsers.hasOwnProperty( $notificationItem.attr( 'data-user-id' ) ) ) {
          availableUsers[ $notificationItem.attr( 'data-user-id' ) ].count++;
        } else {
          availableUsers[ $notificationItem.attr( 'data-user-id' ) ] = {
            username  : $notificationItem.attr( 'data-user-name' ),
            count     : 1
          };
        }
      });

      // Update the kinds if the "User" filter has been changed.
      if ( undefined === which || 'user' === which || '' === lastKindSelected ) {
        // List the available kinds, adding the number of occurances.
        $kindSelect.removeAttr( 'disabled' ).html( '<option value="">All Kinds</option>' );
        for ( var key in availableKinds ) {
          if ( TSUConst.kindsTexts.hasOwnProperty( key ) && availableKinds.hasOwnProperty( key ) ) {
            $kindSelect.append( '<option value="' + key + '"' + selected( key, lastKindSelected ) + '>' + TSUConst.kindsTexts[ key ] + ' (' + availableKinds[ key ] + ')</option>' );
          }
        }
      }

      // Update the users if the "Kind" filter has been changed.
      if ( undefined === which || 'kind' === which || '' === lastUserSelected ) {
        // List the available users, adding the number of occurances.
        $userSelect.removeAttr( 'disabled' ).html( '<option value="">All Users - (' + Object.keys( availableUsers ).length + ' Users)</option>' );

        // Sort alphabetically.
        var availableUsersSorted = [];

        for ( var userID in availableUsers ) {
          availableUsersSorted.push( [ userID, availableUsers[ userID ].username.toLowerCase() ] );
        }
        availableUsersSorted.sort( function( a, b ) { return ( a[1] > b[1] ) ? 1 : ( ( b[1] > a[1] ) ? -1 : 0 ); } );

        availableUsersSorted.forEach(function( val ) {
          var userID = val[0];
          if ( availableUsers.hasOwnProperty( userID ) ) {
            $userSelect.append( '<option value="' + userID + '"' + selected( userID, lastUserSelected ) + '>' + availableUsers[ userID ].username + ' (' + availableUsers[ userID ].count + ')</option>' );
          }
        });
      }
    }

    /**
     * Refresh the selected number of notifications.
     */
    var reloadNotifications = function() {
      // If a request is already busy, cancel it and start the new one.
      if ( $ajaxNRRequest ) {
        $ajaxNRRequest.abort();
      }

      doLog( 'Loading ' + $countSelect.val() + ' notifications.', 'i' );

      // Show loader wheel.
      $notificationsList.html( '<img src="/assets/loader.gif" alt="Loading..." />' );

      // Disable select inputs.
      $kindSelect.attr( 'disabled', 'disabled' );
      $userSelect.attr( 'disabled', 'disabled' );

      // Request the selected amount of notifications.
      $ajaxNRRequest = $.getJSON( '/notifications/request/?count=' + $countSelect.val(), function( data ) {

        // Clear the loader wheel.
        $notificationsList.empty();

        // Make sure we have access to the notifications.
        if ( ! data.hasOwnProperty( 'notifications' ) ) {
          // Some error occured.
          $notificationsList.html( '<div>Error loading notifications, please try again later.</div>' );
          return;
        }

        // No notifications.
        if ( 0 === data.notifications.length ) {
          $notificationsList.html( '<div>You don\'t have any notifications.</div>');
          return;
        }

        // Append the notifications to the list. Function used is the one used by Tsu.
        $( data.notifications ).each(function( i, item ) {
          //var $notificationItem = $( window.notifications_fr._templates['new_comment_in_post'](
          var $notificationItem = $( window.notifications_fr._templates.new_comment_in_post(
            item.url,
            item.user,
            item.message,
            item.created_at_int
          ))
          .attr({
            'data-kind'      : item.kind,
            'data-user-id'   : item.user.id,
            'data-user-name' : item.user.first_name + ' ' + item.user.last_name
          });

          $notificationsList.append( $notificationItem );
        });

        // Add the empty filter message.
        $notificationsList.append( $emptyFilterDiv );

        // Filter the notifications to make sure that the previously selected filter gets reapplied.
        filterNotifications();
      })
      .fail(function() {
        $notificationsList.html( '<div>Error loading notifications, please try again later.</div>' );
      });
    };

    var $countSelect = $( '<select/>', {
      'id' : 'th-nc-select',
      html : selectCount
    })
    .change( reloadNotifications );

    $( '<div/>', { 'id'  : 'th-nr-div' } )
    .append( $kindSelect.change( function() { filterNotifications( 'kind' ); } ) )
    .append( $userSelect.change( function() { filterNotifications( 'user' ); } ) )
    .append( $( '<label/>', { html : 'Show:', title : 'How many notifications to show' } ).append( $countSelect ) )
    .append( $( '<i/>', { 'id' : 'th-nr-reload', title : 'Reload notifications' } ).click( reloadNotifications ) ) // Add reload button.
    .appendTo( $( '#new_notifications_wrapper' ) );

    // Reload all notifications and set data attributes.
    reloadNotifications();
  }

  /**
   * Convert timestamp to date and time, simplified date() function from PHP.
   * @param  {string}  format    Format of the date and time.
   * @param  {integer} timestamp UNIX timestamp.
   * @return {string}            The pretty date and time string.
   */
  function phpDate( format, timestamp ) {
    var d = new Date( timestamp * 1000 );

    var months = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];
    var year  = d.getFullYear();
    var month = d.getMonth();
    var day   = d.getDate();
    var hour  = d.getHours();
    var mins  = d.getMinutes();
    var secs  = d.getSeconds();

    // Check date() of PHP.
    var mapObj = {
      H : ( '0' + hour ).slice( -2 ),
      i : ( '0' + mins ).slice( -2 ),
      s : ( '0' + secs ).slice( -2 ),
      Y : d.getFullYear(),
      F : months[ month ],
      m : ( '0' + month ).slice( -2 ),
      d : ( '0' + day ).slice( -2 ),
      j : day
    };

    var re = new RegExp( Object.keys( mapObj ).join( '|' ), 'gi' );
    return format.replace( re, function( matched ){
      return mapObj[ matched ];
    });
  }


  /**
   * Add Post Archive to Analytics page to find previous post easier and add ALL the details!
   */
  if ( Page.is( 'analytics' ) ) {

    /**
     * Update the table zebra striping.
     * @param  {jQuery} $rowsVisible If the visible rows have already been found and passed, use those.
     */
    function paZebra( $rowsVisible ) {
      // If no visible rows have been passed, load them from the table.
      $rowsVisible = $rowsVisible || $paTableBody.find( 'tr:visible' );

      $rowsVisible.filter( ':even' ).addClass( 'th-pa-row-even' ).removeClass( 'th-pa-row-odd' );
      $rowsVisible.filter( ':odd' ).addClass( 'th-pa-row-odd' ).removeClass( 'th-pa-row-even' );
    }

    /**
     * Filter the posts by the selected types and update the table's zebra striping.
     */
    function paFilter() {
      $paFilterCheckboxes.each(function() {
        var $rows = $paTableBody.find( '.th-pa-pt-' + $( this ).attr( 'data-type' ) );
        if ( this.checked ) {
          $rows.show();
        } else {
          $rows.hide();
        }
        $( this ).siblings( 'span' ).html( '(' + $rows.length + ')' );
      });

      var $rowsVisible = $paTableBody.find( 'tr:visible' );
      if ( $rowsVisible.length > 0 ) {
        // Update the zebra striping of the table.
        paZebra( $rowsVisible );
        $paFilterEmpty.hide();
      } else {
        $paFilterEmpty.show();
      }
    }

    /**
     * Get all the posts before the passed post ID.
     * @param  {integer} before The last loaded post ID.
     */
    function paGetPosts( before ) {
      // Disable the filter checkboxes while loading.
      $paFilterCheckboxes.attr( 'disabled', 'disabled' );

      var url = '/api/v1/posts/list/' + window.current_user.id + '?_=' + Date.now() + ( ( undefined !== before ) ? '&before=' + before : '' );
      $.getJSON( url, function( data ) {
        if ( ! data.hasOwnProperty( 'data' ) ) {
          $paLoaderDiv.html( 'Error occured, please try again later.' );
          return false;
        }

        // We have our list of posts, extract all the info and add the rows to the table.
        data.data.forEach(function( post ) {
          // Remember the last post ID.
          $paLoadMorePosts.attr( 'data-before', post.id );

          // Find out what type of post this is.
          var postTypeText  = 'Personal Post';
          var postTypeClass = 'post';
          if ( post.is_share ) {
            postTypeText  = 'Shared Post';
            postTypeClass = 'share';
          } else if ( post.user_id != window.current_user.id ) {
            postTypeText  = 'Wall Post by ' + post.user.full_name;
            postTypeClass = 'wallpost';
          }

          // Put together the post links.
          var postLink = '/' + post.user.username + '/' + post.id
          var originalLink = '';
          if ( post.is_share ) {
            originalLink = '/' + post.original_user.username + '/' + post.shared_id;
          }


          var privacyIcon = '';
          var selectBox =
            '<ul class="privacy_' + post.id + ' black_dropdown_box" >' +
              '<li class="' + ( ( 1 === post.privacy ) ? 'checked_privacy_option' : '' ) + '"><img src="/assets/check_mark.png" height="16" width="16" alt="Check mark" style="display: ' + ( ( 1 === post.privacy ) ? 'inline' : 'none' ) + ';"><a href="/posts/change_privacy/' + post.id + '/1/' + ( post.is_share ? 'share' : 'normal' ) + '" data-method="patch" data-remote="true">only friends</a></li>' +
              '<li class="' + ( ( 0 === post.privacy ) ? 'checked_privacy_option' : '' ) + '"><img src="/assets/check_mark.png" height="16" width="16" alt="Check mark" style="display: ' + ( ( 0 === post.privacy ) ? 'inline' : 'none' ) + ';"><a href="/posts/change_privacy/' + post.id + '/0/' + ( post.is_share ? 'share' : 'normal' ) + '" data-method="patch" data-remote="true">public</a></li>' +
            '</ul>';

          // Depending on the post type, the privacy options are handled differently.
          if ( 'post' === postTypeClass ) {
            privacyIcon =
              '<a href="#" id="privacy_icon">' +
                ( ( 0 === post.privacy ) ? '<span title="Public" class="privacy_icon_public"></span>' : '' ) +
                ( ( 1 === post.privacy ) ? '<span title="Only Friends" class="privacy_icon_private"></span>' : '' ) +
              '</a>' + selectBox;
          } else if ( 'share' === postTypeClass ) {
            privacyIcon =
              '<a href="#" id="privacy_icon">' +
                ( ( 0 === post.privacy ) ? '<span title="Public" class="privacy_icon_public"></span>' : '' ) +
                ( ( 1 === post.privacy ) ? '<span><img alt="Only Friends" title="Only Friends" src="/assets/friends_icon.png" width="16" height="16" /></span>' : '' ) +
              '</a>' + selectBox;
          } else if ( 'wallpost' === postTypeClass ) {
            privacyIcon =
              '<a href="#" id="privacy_icon" title="Can only be changed in Settings &raquo; Privacy &raquo; Post on your Diary">' +
                ( ( 0 === post.privacy ) ? '<span class="privacy_icon_public"></span>' : '' ) +
                ( ( 1 === post.privacy ) ? '<span class="privacy_icon_private"></span>' : '' ) +
              '</a>'; // No select box, as this can't be changed per post. Only in Settings->Privacy for ALL wall posts.
          }


          // The post entry row for the table.
          var $tr = $(
            '<tr data-post-id="' + post.id + '" class="th-pa-pt-' + postTypeClass + '">' +
              '<td>' +
                ( ( post.has_picture ) ? '<a class="th-pa-picture" rel="posts-archive-gallery" href="' + post.picture_url + '"><img alt="' + post.picture_url.split( '/' ).pop() + '" src="' + post.picture_url + '" /></a>' : '' ) +
                '<div class="th-pa-post">' +
                  '<ul class="th-pa-meta">' +
                    '<li title="' + postTypeText + '"><i class="th-icon th-pa-pt"></i></li>' +
                    '<li class="th-pa-privacy privacy_box">' + privacyIcon + '</li>' +
                    '<li class="th-pa-date" data-date="' + post.created_at_int + '" title="' + phpDate( 'd. F Y - H:i:s', post.created_at_int ) + '">' + phpDate( 'd. F', post.created_at_int ) + '</li>' +
                    '<li class="th-pa-expand button th-pa-stealth" title="Expand text">+</li>' +
                    '<li class="th-pa-post-link th-pa-stealth"><a href="' + postLink + '" target="_blank" title="Open post">Open</a></li>' +
                    ( ( post.is_share ) ? '<li class="th-pa-original-link th-pa-stealth"><a href="' + originalLink + '" target="_blank" title="Open original post">Open original</a></li>' : '' ) +
                  '</ul>' +
                  ( ( '' !== post.title   && null !== post.title )   ? '<div class="th-pa-title th-pa-ellipsis">'   + post.title.trim()   + '</div>' : '' ) +
                  ( ( '' !== post.content && null !== post.content ) ? '<div class="th-pa-content th-pa-ellipsis">' + post.content.trim() + '</div>' : '' ) +
                '</div>' +
              '</td>' +
              '<td>' + post.view_count + '</td>' +
              '<td>' + post.like_count + '</td>' +
              '<td>' + post.comment_count + '</td>' +
              '<td>' + post.share_count + '</td>' +
            '</tr>'
          )
          .appendTo( $paTableBody );

          // Make the picture clickable to expand into a Fancybox.
          $tr.find( '.th-pa-picture' ).fancybox( { padding : 0 } );

          $tr.find( '.th-pa-expand' ).click(function() {
            // Are we expanding or extracting.
            if ( '+' === $( this ).text() ) {
              $tr.find( '.th-pa-title, .th-pa-content' ).removeClass( 'th-pa-ellipsis' );
              $( this ).text( '-' ).tooltipster( 'update', 'Collapse text' );
            } else {
              $tr.find( '.th-pa-title, .th-pa-content' ).addClass( 'th-pa-ellipsis' );
              $( this ).text( '+' ).tooltipster( 'update', 'Expand text' );
            }
          });
        });

        // Initialise or update the tablesorter.
        if ( undefined === before ) {
          $paTable
          .tablesorter({
            // First column by date, others by text.
            textExtraction : function( t ) {
              return ( 1 === $( t ).find( '.th-pa-date' ).length ) ? $( t ).find( '.th-pa-date' ).attr( 'data-date' ) : $( t ).text()
            }
          })
          .bind( 'sortEnd', function() {
            paZebra();
          });
        } else {
          $paTable.trigger( 'update' );
        }

        // Update zebra striping.
        paFilter();

        // Are there more posts?
        if ( data.data.length < 10 ) {
          $paLoaderDiv.html( 'No more posts to load.' );
        } else {
          $paLoaderWheel.hide();
          $paLoadMorePosts.show();
        }
      })
      .always(function() {
        // Enable the filter checkboxes.
        $paFilterCheckboxes.removeAttr( 'disabled' );
      });
    }


    // Posts Archive table.
    var $paTable = $( '<table/>', {
      'id'  : 'th-pa-table'
    });

    // Table header.
    var $paTableHeader = $( '<thead/>', {
      html :
        '<tr>' +
          '<th title="Sort by Date">Posts Archive (by Tsu Helper)</th>' +
          '<th title="Sort by Views"><span class="icon view_icon"></span></th>' +
          '<th title="Sort by Likes"><span class="icon like_icon"></span></th>' +
          '<th title="Sort by Comments"><span class="icon comment_icon"></span></th>' +
          '<th title="Sort by Shares"><span class="icon share_icon"></span></th>' +
        '</tr>'
    })
    .appendTo( $paTable );

    // Add a filter to choose which type of posts to display.
    var $paFilter = $( '<div/>', {
      'id' : 'th-pa-filter',
      html :
        'Filter Posts: ' +
        '<ul>' +
          '<li><label><input id="th-pa-cb-post" type="checkbox" checked="checked" data-type="post" />Personal Posts <span></span></label></li>' +
          '<li><label><input id="th-pa-cb-share" type="checkbox" checked="checked" data-type="share" />Shared Posts <span></span></label></li>' +
          '<li><label><input id="th-pa-cb-wallpost" type="checkbox" checked="checked" data-type="wallpost" />Wall Posts by other Users <span></span></label></li>' +
        '</ul>'
    });
    // Call the filter when a checkbox value gets changed.
    var $paFilterCheckboxes = $paFilter.find( 'input[type=checkbox]' ).attr( 'disabled', 'disabled' ).change( function() { paFilter(); } );

    // Message to display if no posts match the chosen filter.
    var $paFilterEmpty = $( '<div/>', {
      'id' : 'th-pa-filter-empty',
      html : 'No posts match the selected filter.'
    })
    .hide();

    // Table body.
    var $paTableBody = $( '<tbody/>' )
    .appendTo( $paTable );

    // The row of the table to display the loading wheel and the "Load More Posts" button.
    var $paLoaderDiv = $( '<div/>', { 'id' : 'th-pa-loader-div' } );

    // Show only the loader wheel to start with.
    var $paLoaderWheel   = $( '<span><img src="/assets/loader.gif" alt="Loading..." />Loading more posts...</span>' )
    .appendTo( $paLoaderDiv );

    // Button to "Load More Posts".
    var $paLoadMorePosts = $( '<span class="button" style="float:none;">Load More Posts</span>' )
    .hide()
    .click(function() {
      $paLoaderWheel.show();
      $paLoadMorePosts.hide();
      paGetPosts( $paLoadMorePosts.attr( 'data-before' ) );
    })
    .appendTo( $paLoaderDiv );

    // Table wrapper.
    $( '<div/>', {
      'id' : 'th-pa-wrapper',
      html : $paTable
    })
    .prepend( $paFilter )
    .append( $paFilterEmpty )
    .append( $paLoaderDiv )
    .insertBefore( $( '.dashboard_post_statistic' ) );

    // Get the first lot of posts.
    paGetPosts();
  }


  /**
   * Add a specific class to all nested reply parent elements to emphasize them.
   */
  function emphasizeNestedRepliesParents() {
    // Make sure the setting is enabled and we're on the right page.
    if ( ! settings.emphasizeNRP || ! Page.is( 'has-posts' ) ) {
      return;
    }

    doLog( 'Emphasizing Nested Replies Parents.', 'i' );

    $( '.post_comment .load_more_post_comment_replies' ).not( '.th-nrp' ).each(function(){
      if ( /\d+/.exec( $( this ).text() ) > 0 ) {
        $( this ).addClass( 'th-nrp' );
      }
    });
  }

  /**
   * Autofocus text input and add line breaks to messages.
   */
  function tweakMessagesPage() {
    // Make sure we're on the right page.
    if ( ! Page.is( 'messages' ) ) {
      return;
    }

    doLog( 'Tweaking messages page.', 'i' );

    // Focus the recipient field if this is a new message.
    if ( document.URL.endsWith( '/new' ) ) {
      $( '.new_message #message_to_textarea' ).focus();
    } else {
      $( '.new_message #message_body' ).focus();
    }

    // Add line breaks to all messages.
    $( '.messages_content .message_box' ).not( '.tsu-helper-tweaked' ).each(function(){
      var $text = $( this ).find( '.message-text' );
      $text.html( $text.html().trim().replace( /(?:\r\n|\r|\n)/g, '<br />' ) );
      $( this ).addClass( 'tsu-helper-tweaked' );
    });
  }

  /**
   * Make a log entry if debug mode is active.
   * @param {string}  logMessage Message to write to the log console.
   * @param {string}  level      Level to log ([l]og,[i]nfo,[w]arning,[e]rror).
   * @param {boolean} alsoAlert  Also echo the message in an alert box.
   */
  function doLog( logMessage, level, alsoAlert ) {
    if ( ! publicDebug && 104738 !== window.current_user.id ) {
      return;
    }

    var logLevels = { l : 0, i : 1, w : 2, e : 3 };

    // Default to "log" if nothing is provided.
    level = level || 'l';

    if ( 'disabled' !== settings.debugLevel && logLevels[ settings.debugLevel ] <= logLevels[ level ] ) {
      switch( level ) {
        case 'l' : console.log(   logMessage ); break;
        case 'i' : console.info(  logMessage ); break;
        case 'w' : console.warn(  logMessage ); break;
        case 'e' : console.error( logMessage ); break;
      }
      if ( alsoAlert ) {
        alert( logMessage );
      }
    }
  }

  /**
   * Add the required CSS rules.
   */
  function addCSS() {
    doLog( 'Added CSS.', 'i' );

    // Remember to take care of setting-specific CSS!
    var settingSpecificCSS = '';

    // Hide Ads.
    if ( settings.hideAds ) {
      settingSpecificCSS +=
      '.homepage_advertisement, .rectangle_advertisement, .skyscraper_advertisement { position: absolute !important; left: -999999999px !important; }';
    }

    // Nested replies parents.
    if ( settings.emphasizeNRP ) {
      settingSpecificCSS +=
      '.th-nrp { text-decoration: underline; color: #777 !important; }';
    }

    // Quick Mention links for comments.
    if ( settings.quickMention ) {
      settingSpecificCSS +=
      '.th-qm-comment, .th-qm-reply { z-index: 1; font-weight: bold; font-size: 0.8em; display: block; position: absolute; background: #1abc9c; color: #fff; border-radius: 3px; padding: 2px; }' +
      '.th-qm-comment { margin-left: 11px; }' +
      '.th-qm-active-input { border-color: rgba(0,0,0,.4) !important; }' +
      '.post_comment { position: relative; }';
    }


    // Add the styles to the head.
    $( '<style>' ).html(
      settingSpecificCSS +

      // Menu item.
      '#th-menuitem-about a:before { display: none !important; }' +
      '#th-menuitem-about a { background-color: #1ea588; color: #fff !important; width: 100% !important; padding: 8px !important; box-sizing: border-box; text-align: center; }' +
      '#th-menuitem-about a:hover { background-color: #1ea588 !important; }' +

      // FFC.
      '.th-ffc-span .th-ffc-loader-wheel { margin-left: 5px; height: 12px; }' +
      '.th-ffc-span a { font-size: smaller; margin-left: 5px; border-radius: 3px; background-color: #1abc9c; color: #fff !important; padding: 1px 3px; font-weight: bold; }' +

      // About & Settings windows.
      '#th-aw,    #th-sw    { width: 400px; height: auto; }' +
      '#th-aw *,  #th-sw *  { box-sizing: border-box; }' +
      '#th-aw h1, #th-sw h1 { margin: 5px; }' +
      '.th-buttons-div { padding: 5px; text-align: center; display: inline-block; border: 1px solid #d7d8d9; width: 100%; line-height: 23px; background-color: #fff; border-radius: 2px; margin-top: 10px; }' +

      // About window.
      '.th-update { background-color: #f1b054 !important; color: #fff !important; }' +
      '#th-aw > div { display: block; margin: 5px 0; }' +
      '#th-aw .card { padding: 5px; min-width: 100%; border: 1px solid #d7d8d9; border-top-left-radius: 30px; border-bottom-left-radius: 30px; }' +
      '#th-aw .card .button { width: 123px; }' +
      '#th-aw-update-button { margin: 5px; }' +
      '#th-aw-settings-button { float: right; height: 32px; width: 32px; background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAJBklEQVRYR5VXe2xbZxU/175+v+JnHMexY+fJwqpKU5HYgCEeg05oG4KBVvFHK7G0K9vatUmbPra6SdemlddHnFJUsTGJvwBpMBVNCMEQBSRUZUBXytq84zjxM7Hjt69fnO8+4tskm9QrXd/X953zO+f7nd/5TMFDHj6fj5abTSVXu0vSmEpBajUJ2Ux6/9DLr157GJPUwwwmY0/4/W67xTzz/K4XpOK5kVAIPvzzh78+9GL/Dx/G5qcCOBsIPCOjpS/korE9GHVRMDp88cKXm5sdf+np6pRCHUACFNSoOmQyGbg/M3tvoH/v58QAfG+99bhGoxzKReLfRzvMRnBbAhgdv/KsQqn+ravdTc1OTyfW1jJfOXP06Cc+v99C05KzTmfbj93ONpyLCBAAIIBqpQa3/vURU2bKP1q6f/93169fL48GAkNyhfxMq8spDS+Fp1OLob6NIDYBwMifU6lV7337m9+givkCFGs1+Mffblbq9epHFCV9rKunl9YqleizzrknFngcIKVhORKuLy8tlaBWnzSaTI9+8YnHqTLamVsMQnAhuAnEAwDOXQt8TylX/eZb6DydTEEul8McS8BstUCuUIRWhx1WojFI4jdhIvHNHRRI8CUZq1BrIJ5IgF6L10iU/dqk10MwGiYgZmb+fbsvEAiUuFn8QdIrU8hj33n6aSqfSUM2lxeFRnBIoFar8lOEkMVDhHd4rSMYKXIDsyeuFL1WC3enpmBlJTE2uPelAw8AIA/j7777Dkaxu8PrpVhoaIjLL+e3Xq1BJptFwmWBwoESzL+ElkKFKUOlWgWVUgVarRrUKjU7ZeMS5fJ5mJyczKXSWfe548dXNgEgbs4Fxv7abLN9yWFvoYh/IUWpVAqWlpfBbreD2WQSRdbIAgERiUQgjRXR6fWAXK5Yp0cVs3H3f3fL+Xzxa76Bgb8LBjaR8Mj58zqtXLa6fdvnaVoqYxGsrq5CIrEKXm870Ei0xsLxZoRMsdYoyCGAhaUQdHo4EISosXiCBPCH468e2ClGvwnAG37/TqvFfMPjdqPQ1KCQL0IQRaarswN5wGsPVgDrCi1zK1/DKxFGsuaoDPg9m89BaGkZurs6cZwE6sifO5/cK8aZWdOlQ5cKn5oB//Wf3e/q7OqW1DkCTc3MgdPRAiqVkiMCuhLohjUPJYZhvxEucAvPxUSgRbBipFIpWCxmdmY4Fq+lM+mDA/37AusARi5fPCyXy/ZWa/Xmeq2u0mg0dLvLRZEoCoUCxBIr4Ha1oWF0jMSjanVgKmUIBherhXI5jgsyX6lU+oxGo9bhcGCsPA68QXswPTsL3R2drFgV8iWYDwWxmKoVrKoMYlygLr/z9qS3w9tls9owxRSsYY1jU2HjjEbjyGgV6PU6jmk8K+9PTVXypWL/8KHBXxB3/f39Mtcjj/zKZDJ+197czFGELBOCWAwtQ5uzlUsOnmaLlc2YVCaHj2//B6jRq2MTDrvjMY2aKx1WTYh7XIFFXPsWNCiTIRn5I4+lhJz474kDBx9df4k3u30+pdegT/X19irE7xNIYIvJzLsn9vHk5SG0vFyjzo5dueWw23doNNrGIL78w9Eo2G02tuaFok6mkhCLRn9+8rXDL4odkfszly/FOjweKy3DheFFANcc9Do9lxFyiCSUBfAmAsAoEQDJAK8/fMIyqIZazAxhu2CgUCzC/OLipO/Q4R4xgP0+n9ai1yX6urv5DHAOc2hDg9K87px9jT9oMxRGAMOXL92yWSw79Dod60ikfUDEg0iwUGzkmwRZPTM3V83nc0MjR4b8xFy/z6d26HS/t1nMXzUam1grQo8olkqgVHCYxLaJTJPGRfn8F4aqQO2HatWKziRqtYrGdishVSBTKtj1z2dzmIBG28ExMDU9XctkcxmpRBJBY25HS4sCK4GqVCuE8BxfyRQMoM72BArKZQYw7RWGYWpor4QluvCAEL3i8+n1SsU9T3t7i0IuRz5KwNnuhlAwCDXsA1ibGBk3pcmgB4+zDfcBVUggL+IrK1DG8lwPHcepNEpUQiWkk0n2NRKyHo0nxlbn5gbJfkFMifXlHBwZOWA1Gy82N9tJJUOT0QRqjQaWFxc5LgjHhobIGmMj5z4QAWpzI/iFICa3wmvCTDFXznRfPPnmomBmkxS/cuyYFVO83NPTQ5NuR4629nZgcC2j4TD7TLJAssE/NNLN0QukKNkuTzsk4jHIpjPsMNKgIrHoxNmh4zsaUWxuK3Bi9Nx7pqam53A309ATvHN7vWxU83OzmPYKRyk2WBI2uXLPaqwmNzahcHgJd8opHmMdarhU88EgU2DyX7j4xsjtLTNwdOT0Sxab7WpnRwe1ihLcoB033Iqa4Ma0prMZNrp8rsCCkSNfNFhFVouFbUvzKL8F3IZtPHRNBrjz8Z3MQize8ku/H7dbogwc9vkstFQSfeLJJyVki82Wkjg6NlhMPhLTaDYCAmU3IKRKmBIDa+k0ttwoFB6oGGGpuOwQezkElkyuXhkeOHLwAQDk4cJPx0+nUmvHnW1OxMJ3N0wtqVlsIEDTqHDiWRtTJKp0UhGshAtjEAPZ1OC5oGAq23F3zK7PJhIOjpz+iYyWXW51OGgiOiUkXzgSKaMoMTrc4DcZDFI5CotYVAQjWNyofFlYS60VCwxTxz2g0mq1YvFgk0Pnq8nkXCEW344b0vSWHBBeHh4+tU8hlQV0BgONu6F0qcTsDE9OTrT29u6Sy+gRg9HoRKJywfHlSIRqFhUSteNGuVz2L92790/Ptm3XMJV7NFotnVpbmytucL5lBgQQR4aH9+HOdtdaJvfstdHRpPD+tVMnnzLoDB9YrbbGXzNMAaobRMKRufOvv+4Vk2/g1KkfULRksFhNfD3ga0T+mRnYRF/Ri5ePHes16HW3WxwOuRA+ib5QyOPeMXlj9MTJZz5r/sZvGzlAoiIdm1wJ44STbAjISXs8Ht3ze3ZPtLlctEAwwu4VLNvQ/MKFt8fHySaFCAWRWvFVuCd/LkhzIFd+A8c5JWAEx+QqnBgpkH04aWkEhHz0auDmVlHe/OOfDn3w/vsTvHHyz4c4IWzP8vfkmZwEDAvg/5gaEzsDHsw6AAAAAElFTkSuQmCC"); }' +
      '.th-aw-donate-buttons { margin: inherit; border-top-left-radius: 20px; border-bottom-left-radius: 20px; }' +
      '.th-aw-donate-paypal { float: left; }' +
      '.th-aw-donate-paypal img { vertical-align: middle; }' +
      '.th-aw-get-in-touch li { display: inline-block; margin-right: 10px; }' +
      '.th-aw-info li { margin: 2px 0; }' +

      // 16px icons.
      '.th-icon        { display: inline-block; width: 16px; height: 16px; vertical-align: text-bottom; }' +
      '.th-icon-bug    { background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADXklEQVQ4T02TYUwTZxjHn3vp3bXXu94hWNIW1EApU6ajshTciHFhumGMLlmyZNvnZXYmW/aFZPswY7JkGOMWE7fol31a4ofFZOyDzkkii5kEBKyEEsEKG2thBUvbu9L2rtf39lyRhUt+uefu3t//fe+e9xjYcQwEg7y1T/nCMulPd0anE9uP+vtfCbEM+wFdMy79PjOzudNhdlzYNTna+3KIE9jr1Kx2UAu8hJDndQTmTcP4+N6fc09wDEWsba8W0NW1T4nF/jKwdEa6O74WBGdUcLqAkDqoVk0olktQLBUvP5xKfINjyj09wbrx8YRqu3YA0/9G10W9bO71mLnVAwp8NlVsBL/fC7JHgkw2D+paGiJiRp9YZ65qnOJz8Y7S3dHHH9krsQNYWZabj7RKnw+9xkaVYITcHPmDbChtQKoOMEkFAloCTp88RTdm79HBscqP8XT5cir1fAndih0gIIHrx91fDQycfM97+ASXXYrTzMIk+Xd2ERqDXvCH36RSSztZnx4xbt2+9fPZkc0L6KSQoh3gQVp/OyPdePXEOyFOFAkR6oEofliciEFrTxhoNgm0mANDK9DJu78svD2svY/OIqIyx/oODhVK+utDe9OR8JE+ztLSKPuA8CIsJ4uwp0UAWi4AVdeBiI0QG7tvDC41TYhu5+zo/ZmovYJdSPvoGfl2Z3dXvZmKA3F5gEgNsFrwgE9UcfY80M0sOPz7IT71OHtsOD+AzlNkww6QkbZf35JvHu7u2MOsLRCg1VqbUzkXBJTSVsuxpZY3RKen5pdP38m/i3eeIXk7wC0IbOh82HPjVDjQLpdTxKqUa05ac0GTtBXAsE7I8QE6HFtd+vaJ/mEmo87i7U07gOvr7fxud0U9dLYFIvt9FmcVMjUpU3RCg7AVZrl3w1yyYnyfcjzQnJ7lxN/x6MrKVhdIm39X4NnKhvxDr3It5BN7mnjNwYMOmsGDyOlgAA9pXTLnVwpj58Zz0ebmhlwymVlFl9Z2IsIiyiHZcfCTTulKk4d7iScmcQDDUIZapSpL1/KVhWtz6qeP8uYMjs0h9tavydtnHgsZk/wXuuUvfS7HUWcdU1+1LH29VJ08H8sNqhX454Ws22+1M2C75rBwI/bmkuzvg5iIhuSRwouZ//8b/wNDgFsg+yoSRgAAAABJRU5ErkJggg=="); }' +
      '.th-icon-idea   { background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACv0lEQVQ4T5WSXUiTURzGn/O++zB1HxTOqav8apZfjBgFflyotewmKBQhL7qxxFAIKiiSopI+vEkwpGTQTXpT0mWUmFRqorlEK/Nzqb3TbeKcujm3ve/bUVJc2kUHDgfO8z+////hPAQ7LNv9Q6fBkgtUOvJH7gEvNsZeH3r1dznZejFdo48jEvaGMru8ItxQDEYeCdG/DH6Rw8pIOzw9zU95/8rdvdUj3Ma7EMBkbcaTqKK68rD4LKozEIVVCnBB9DpBFjgE/AIcr++Z91/uPb8NMH7nwFmlsbhJfawSLKsCYcIhBJfABxwQvBzI/DgYhxVurwTu7uelSTdHm9cgmxMM30r8GHvuYY5cawDDRlJAGJ1gBbzfDt47CXH+B1j7JALxx2F7dqUj5fZEbgjgW3XCkq6sMlKmTAdhlRQgX7cgBJzgPT8hzn0HO2tFMO0Efpnrl9NqrIoQwMC1fQsxpSaVRK6AJEIPQtYAPgircxCXp6kFK90cVvU5mGl64858MKUOAViuxrVpC435TMQEpLIkCqAWRB7wuUCW7CBuJwJ7whEU0zH7tq/1cC1nCgF0X9IWRcRoXmiyA2A8LrDBMICngKAPxO+HIGMQ1Gjh6JTCO+s8c/TRzHomQr6xqyq6fndGdKU6eQbSOc+mKEgJgqpwLIzFYH7Q/jir3l61Yw7aL0ZFSlhSG21QV6h0Ntqd5mCthVQGj1MHW5erOSiI5XkNzuUdAWuX78tUCRKVYkKTuYvmYHG9jmEj4Pzqx6rXk5vX4OrYmt4QCxtCXV2dmKhPRZbRCOvoELr6+jE48AVms3lb/T8BBfkF0GgUmJ1zo/NDByyW/wTkZOfiYKoew6Nj+NzxCb39lp0naG1tVfE8n0IIMdCdQm0k63S6Uy0vW9DW9g4+nxcnCwsXi0tKlBzHNVJ9UBTFKXpOmUym/t+tniogNDUKLAAAAABJRU5ErkJggg=="); }' +
      '.th-icon-heart  { margin-right: 5px; background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACrUlEQVQ4T31T3UsUURQ/987dnR33Y9x1LT92TQSL1upFKQxLrIU1QpKioggKFKG3/o1eo6dQiHrrQUppQVAqoowFMwtiSXzR3dZsPxx3nZ11Zu7tztj6QdKBC+fj/n73d87hIuD2dVjuFIANc/e6FTOAWcrY2Kmx4ku7PuQdxAgNcbcLE6ebmltJxNBox6jyBM3f87U7JNfnw903RU/zMQcwBlph1cx/m65sppOPeSh4w5H7/hMXRFGux1gQkK6WaPrts3Ill7qFvtyVHx46M/BAdnucZn4FgJqAPUFA9W2wOj9dZoxCU2dMomtLQEtZXjcA+xqgIspG6s3zOJq740u29V47CqkFZKz/4hcoILEGhEAYWF0LtVqA3DKmnJxVVLtBweMH0toJix9eF1Hiti/b3nWuzlxeAF21LmwbctZwJQHbp6U8sK3dGhFFIKEOWFxI5NCnG77Z1uMdp9HvJVzZrOwQAOIuJtsxl21Ntmqi2wWG/4i58iM5g94PyiPBUPOjAFJENa+ASffc3MXseIKAoSZQC1ndzWf9cxi9ABAar/gLjaE6SdRyRN0oW2M40DAGcPskKItBPZNae3p+QhmxhML05do+gvGrpga3JG4ppLiu8W3uV4IQAq+fgx2yvpopaqZuRi9ObSRsApskKkeRQxhvapQkl64QJbdLgjACOeCCMvHrmUxJY7oRi84UZ+1h79Ua7/P0Cg7nZMgiMQpkPavZ5dqgBQ7o6fSmRpkRu/QX/A+BlZjgJAQck+FmSZLMgr0GlYNTKVUzqREbeLf9ctX2KagmJ3u8PQiTeLjF47JyK8tctsHBH/eDD1RQJRk/6+0mmExZscFfvnoAeIcgHo9HBEGI8EnbhxdO8hMB/g9sQ3x/AN/5ZhK8PmeaZqK/vz/xXwV7+/yf/wc6MhxIaZWcBAAAAABJRU5ErkJggg=="); }' +
      '.th-icon-heartp { margin-right: 5px; background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAC0klEQVQ4T5VTXUiTURh+zr5vP7rNDV2KTl1Oc6YY9IOQqIVZLAjBKAUvBOmmQBCli+gmKKgMsqTAq7ow8mJEhMHM0goTMkkwIRn+DqeRuuXPdH/fX+f7NMG0iw4czvue532e94dzCP5ztboQ11yN8B8akY3W/oQialyRCKlVAAkD1G9vKlt9IbsP+k0XJIoTkCKGURt4gRsDxPbmsrXHpOW90aHV6D15GRWwmLIVdjC0CO/CIAJrs20EEpOUkNVgSymCIc4CFWER5YIYnemicUvnyb2+pIeOzJONZkMqwpyf0kVoGCPitYnwzH6AJEk4mHkKoVgAMSFIfRFa1gyBFzAy3fWO3O1NnjvmqLKux+ZpEBWQBDAqLeLV+6BVG5WOIjRjmFuCIEblAqHTmGGOy8bw+CuQ2z1p0SOOM5qV8DRCkTWlBYBA5DV4+TSgCNRctmyStzCdVg+zzo6Rib4YueVOHy2wHy8M8z+xHqIlQlBIXAzofh5S7Mp6/RZZlmZg1BuhJhZ4vF8HyI3XtgarZf8jk0mLwIofdMJ407lJ/HudrY0Hy6phMSfDv7yOBf9cPbnoAlOgzeHtGbl03kEEfgXR6wruKVBRY4QlMQFiLB7TvolnN6um6pR3cN114DTLMm/tmTZIqiAW/RuIRngMdkcUoZLKODAMg5RkA0TOgBmfFzwvFN+pnvysCMjrmsvhZAjbbbdlgLCr8M1u4EvPhoIVn9MjLVUPiUvA1KwPgsSXtlSPD8jYtoDsXO0sKFermL6cLCttZxlzc5sVpKfrAN6MSe88JFEsban9rpB3CSgiHYfKVayqL9dupZWsK0Eip8fEzA/6eKTS+3Xftsl7CsiXTR2HTzCEfMzLsSoCnkmaWRJ2kf8pIAONT46WMGrySbYFTiptuzS8I/OOFtxudz6dcj4hRNkULKQ7X/4Xm1lU8jFG/8UQxYcFQRhyOp1D8uVvoY8fXsjKUkIAAAAASUVORK5CYII="); }' +
      '.th-icon-help   { background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACtklEQVQ4T6WTTUhUURTH//dd33uOM8/GQafRZhaSNTmmLWqRIEI7i5blIgqiyBoNkgSjohiK6DuMaoYEKQg3btqYLV0UUUILMy2pheH356i9+XjvzZvbnTcqfiw7cLlwDud3/ufccwn+08jm/FDXoJQvyA0gOAaGagJCGWEfwcjb5XQyEqqv0NfnbAA86vrdQKnwsqBQgV2xQZRlEEKgJ5KIqwkszP1F2mSNLfU7I6uQNcCDrl9BWRbDxT439JQA3WDg2VwEvxiDJBJIOWlMjc4gqRmNrfW7LIgFCIUGpbyArPlKi7EcI0hz3353FB6HaRVaSAgYnFegGiKUPIbxkUnEZjQl1FShWoC7ncMXXW7nM4gKNMNEymQ47NfwZVTCPAceDRjQdR29Iw7IIgVJqZidWWy9fmL3Qwtwu3P4Q7HXU6PySinTBFe8wfZ5uSKfiVefKXKoAMVOMPFnYuDGSX9VtoU3PzWP1yepMd2qvtmO7GUQBAHd3xgoJXDkiZgeH9NDp/bIFuDm6x9aUYmXA7QN1SXKUFumw+20obs/jeWkNVcOkDE7OabfOl2eBVzrGPpUuN1THU/y6iw7uIwdLDVQ4pLwrp9BS604iQC7jWJuemrgzpnybAtX2ocubXPltzFBQUpPrAFq/YRLpugdWs0GqGgDZSoWo4tX75+ruGcBjvNnLN1BtIJCDwy+A6Ye3zKHjEPgybLIEJ2fRtSMOdvPH1haW6TLkYGgKIphh7OIz4FyJUnUlBlQcoH330VeORdUMKEuzcEw9ObHFyqfZqAbVrn5+UCQUCFsdygQJTuP0qwSPhdDjyEeU5FOp1raGquerErc8pkaX/Q6KHMF+R84ywn+FcIwY6zDJAuRcNMhdX1/FqCnpyfAhxXgSdbhrkp+Mvd6G+KQPh7/appmX11dXV8m+A+i8hIg7mH0KgAAAABJRU5ErkJggg=="); }' +

      '.th-icon-manual { margin-right: 10px; float: left; display: inline-block; width: 32px; height: 32px; vertical-align: text-bottom; background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAE/klEQVRYR8WVW0wcVRjH/3vjtjt7mdlFSmkLLtJYWKTF2rpgwXJRY6oxaLVYbR80KYmJocYaTRNjo1Fqi4t9wAcSo9b65qu+GDVqSKppK1qUgLSlQOkChYVlgb36nZm9zHLbYW3sSXYzmXPmfL/z//7fd1S4w0PF4peWluYZzcZXBYvwIC8IhmP1lsrbwcWXVCF/1zNijNWGOOlwOHo4jnPwvGWM54W+prs9NbcDwG4vQtkLrtQA5eXlEYNB72lrO2myWq0wGAziLzs7G5mZmWmzXD7bqhxAb9APdLg6ikmJOwPATtzcfABVVdWIqfC/KsAAeIGHhbeG3qg3a9LWfcmH6/AAB0GwwGTNxZlDpUAk8t8YVCoMDw3B8WKHMhNyHClg4UUA18ESREKhOMAyFPHF2oBqjQajozdQfuhjZQBiCngBZpsN7c/aEQoGVwwixV4jOM2xWa1WhzG3G/cdPqMQgNwv8FIKTu8vigIkshBZISh7FwqFxUXhpPkINNoM3CSAnS93KgPgDBwsZEKzYMOp/YUIBgJJHpDOTP/Rw7N4/kAQs75FzC0sIhAMkzAJZTRaLSYmp9B0/JwygFgVmEmBD5u2ICACyKSOP0oPwXAEUzM+3LDWIrPImRQ8Ri6mQpc1m+xmVVfdvaajsXcindQJmQckE55s2oSA3y/7LnbsBFKQpB8Z98C/5wQcdtuSFKxcQN1/TkCrUQdzcnRdjaXmFrYqAUBVIJAJTZSCD54qIIBFSXSK/culgWWGDBDA+PQcHEc+Q0lRLvyh1GXb238LOVlaqNTwUcZe2VchfBoH4KKNyCjk4v0n8+FfXJA5UHqU/C2NQDCEoTEPwvXvoXCzDQu0Y6oxeGVaXJKVoYn4g+GwPkcn1ShLAbsDxD5AZfjuvjz4FyQAFrK7Z3DZ3kEK6CYFyo58jmJSYD0Asc1y9LrZ5BSIALk48XguFufn40ET5pYpECAF3B5E6ttgVwgg5pwiqukvW6tC//UZGQCVIbsLTFYb3nmMJPX5kk8dbTDne6+J75kJx6d8pMAXuMd+l6jAd2c7U2VBnK872IIsrRr/XPckAFgfYFVgJIC3H+ExLweQ1XdMA1b3w+5pRBpPoaQ4T1EK5HQMYODatFwB6TZkfeB4gwU+rzexfiUASsHwxAzQeBpbSzaIAN8rVODhqAIDV1YBeKvOhLkYwJIWHFeAAEYIINLYjm1b89NSoG9wSp4CA7Vi6gOUgjdrDfAygFUuHQbBynBknJpc40co27YR86TAD18q80Dt8y1kQjX+6r+V7AELecBMAMdq9PDO0uZrAYidkKXABUdZgQiwnsEAevsmk6tAIA8YqRO+vicb3hnanPWBVSBYJxydmEW4oQMV5ZswHwjjx3PKFKhpJgV0avT8PSFTgDUidh1TJ3ytOhOzHglgtREDCBHA9orNIsB6BgP4vXc82QOsCoxUBUedDMCjAMCLUIMLO7ZvEQF+UqjAQ1EFLl12xwEuUh+oiPWBVmdGSgDxNpwkgDoXKisL01Lgwh834wBPGDjua8HCa4x0F7Tu1mEmhQIxgOBeF3beXwQfKfDzV8o8UH2gBTmUgt96xiQANpxO515S4DCXt+Hp5wrc2anyyQDGqBVrHu3E7gckgPUMBvDrRRmA7ONcejbQT69kw0++vdq9a8dGfToA5y+MJhRQEmylNZ3fXG0nGV9K53tqaF3/Aot1QCKE5DaSAAAAAElFTkSuQmCC"); }' +

      // Heartbeat.
      '.th-about-love:hover .th-icon-heart { -webkit-animation: heartbeat 1s linear infinite; -moz-animation: heartbeat 1s linear infinite; animation: heartbeat 1s linear infinite; }' +
      '@keyframes "heartbeat" { 0% { -webkit-transform: scale(1); -moz-transform: scale(1); -o-transform: scale(1); transform: scale(1); } 80% { -webkit-transform: scale(0.9); -moz-transform: scale(0.9); -o-transform: scale(0.9); transform: scale(0.9); } 100% { -webkit-transform: scale(1); -moz-transform: scale(1); -o-transform: scale(1); transform: scale(1); } }' +
      '@-webkit-keyframes "heartbeat" { 0% { -webkit-transform: scale(1); transform: scale(1); } 80% { -webkit-transform: scale(0.9); transform: scale(0.9); } 100% { -webkit-transform: scale(1); transform: scale(1); } }' +
      '@-moz-keyframes "heartbeat" { 0% { -moz-transform: scale(1); transform: scale(1); } 80% { -moz-transform: scale(0.9); transform: scale(0.9); } 100% { -moz-transform: scale(1); transform: scale(1); } }' +
      '@-o-keyframes "heartbeat" { 0% { -o-transform: scale(1); transform: scale(1); } 80% { -o-transform: scale(0.9); transform: scale(0.9); } 100% { -o-transform: scale(1); transform: scale(1); } }' +

      // Settings window.
      '#th-sw label, #th-sw input, #th-sw select { display: inline-block; cursor: pointer; }' +
      '#th-sw form > div { margin: 5px 0; }' +
      '#th-sw-back-button { float: left !important; }' +
      '.th-sw-help { margin-left: 4px; cursor: help; }' +

      // Show custom number of notifications.
      '#new_notifications_wrapper { position: relative; }' +
      '#th-nr-div { position: absolute; top: 0; right: 15px; }' +
      '#th-nr-div select { cursor: pointer; margin: 0 5px; }' +
      '#th-nr-nk-select, #th-nr-nu-select { width: 80px; }' +
      '#th-nr-reload { display: inline-block; height: 16px; width: 16px; vertical-align: text-bottom; cursor: pointer; margin: 0 5px; background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAC2klEQVQ4T32SS08TURiG37l0ept2aGnxAqIoprXVyNqNW1YaF3YhwcR4SVRYiFFJRDHES8UYjBeMMUYj0RhIZCXxFxhDwBAUsKlKJAJFaellpu1MZ+Y4rbEBL5zdOfnOc773Ow+FVVa4/7PA0aQ7rcunL4WC4r9KqdUAV/ujXgfHflcU9ZMKvelcyDf8Z/1fgOv9H30U2HYKZI/JxLq9HgfsVhbRL4uaDj08grHOgVBI+w1aAbj+ItICir7l2+JhPG4ekgLE0xoYGqiwU4gvJjEzlxouKPrBC83+SBFSBlx9Fj2+scbZ6650QNEZSHkdOYUgJ5PSY7yVRoWNILWUwdx8avDd4Nj+gYGQVgJ09n2oNzGmiYC/mhNlBpmsiqwoQpVlsBY7GLMVRM1Dl7OQ87nOjgO+rhURuvoid2pr3C0aa0daVCDGFzRdJ2GKkFeM2fKG4SxQsqmETtB0qdn/evkgf3XwNBLdULuuPpOnkBMzyGfTHV0H/VfOPRgRbDYhSXRtVFWw//JR//Q/f+HikynZW13DFTNL8RiyWmHdjUPBWBFg5vibmaVEa0/brtx/Peh4PCm71lRzqg5IiQXkMgbgZDC2miMrZtD+aGrcWendQTMmQBGRTKQ6wkcDV5YD2h9OdlM0daZ8RjB97ci2zaUZnH04cdnGO8+bbQ44LcDXmTlDFBJGQe3TaJYxPDi8dZOrzV/vAUVRiE4nMPVp8W73sWBrCXDm3sRawpKow+XlBacVa12MMUgR3+bTpQu16wXwDh5JSUdGzGNmJpbT9MLWnuMNs2WRTt1/v48zW17abDw8lXZUVbAQeAbE8CgpaviRVBFfkpCTJMOFfFPPie3PV5hY3LT2ju9mQT024tQ5eBt43lyKnJFkiGLWkCs9awhy5PbJnWUXyh0MDQ0FGIYJFAjdEFkU9iZldkta5qxFgGAuoMouo65C+miitbdGrFFN04YbGxuHfwJN4z4gjV4RIAAAAABJRU5ErkJggg=="); }' +

      // Notifications Reloaded.
      '#new_notifications_popup .notifications, #new_notifications_popup .messages, #new_notifications_popup .friend_requests { max-height: 160px; width: 100%; overflow: auto; }' +
      '#new_notifications_popup .notifications .notifications_item, #new_notifications_popup .messages .notifications_item { width: 100%; }' +

      // Posts Archive.
      '#th-pa-wrapper * { box-sizing: border-box; }' +
      '#th-pa-wrapper { float: left; border: 0px solid rgba(0,0,0,0.1); border-collapse: collapse; width: 100%; background: white; margin: 10px 0; background-color: #f6f7f8; }' +
      '#th-pa-wrapper ul { margin: 0; }' +

      '#th-pa-filter-empty { padding: 10px; font-weight: bold; background-color: #eee; }' +
      '#th-pa-filter { padding: 4px 10px; font-weight: bold; }' +
      '#th-pa-filter ul { display: inline-block; }' +
      '#th-pa-filter label { cursor: pointer; font-weight: normal; }' +

      '#th-pa-table { border: 0; border-collapse: collapse; width: 100%; line-height: 20px; }' +
      '#th-pa-table thead { font-size: 1.5em; background-color: #fff; text-align: left; border-bottom: 1px solid rgba(0,0,0,0.05); }' +
      '#th-pa-table th { padding: 10px; }' +
      '#th-pa-table th:not(:first-child), #th-pa-table td:not(:first-child) { width: 40px; text-align: center; border-left: 1px solid rgba(0,0,0,0.05); }' +

      '.th-pa-row-even { background-color: #eee; }' +
      '.th-pa-row-odd  { background-color: #fff; }' +

      '#th-pa-loader-div { padding: 15px; font-weight: bold; }' +
      '#th-pa-loader-div img { vertical-align: middle; margin-right: 5px; }' +

      '#th-pa-table thead .icon   { margin: 0; width: 24px; height: 24px; }' +
      '#th-pa-table .view_icon    { background-position: -202px -7px; }' +
      '#th-pa-table .share_icon   { background-position: -232px -7px; }' +
      '#th-pa-table .like_icon    { background-position: -263px -7px; }' +
      '#th-pa-table .comment_icon { background-position: -292px -7px; }' +

      '.th-pa-privacy .privacy_icon_private { background: url("/assets/friends_icon.png") no-repeat !important; background-size: 15px !important; }' +
      '.th-pa-privacy #privacy_icon span { width: 15px; height: 15px; }' +
      '.th-pa-privacy #privacy_icon span img { width: 15px; height: 15px; }' +

      '.th-pa-pt-post     .th-pa-pt { background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACkUlEQVQ4T3XSW0hTcRwH8O9/N5vb2XTeNufCG0q2lKWYCoGQURQiPSzpISiIQnzoQkbgS9FDINGjUb30kqQUBEIaURR7qNzyNmuoZdPMXd3cObtfPJ0lyg7T39Phd37/D1/4/Qgy6r0t8BBgL2X2tr9ZliUikXCIoYP9nU2l3u0+yRx+Z/PT+v1KapNls4yZX15o1Xms2xd8mgig71RLAZ0e4gHj3310lVZBJVLZwI+fLhxrKMXKRpx1ekJPAkz4+tk2XYQHvLGu0+WlCiqa3MxKsGT34HSjFtEkCzuHOFzM42AoeoMHjE576coyJWUZG+YB+uNG/F7eAtIV4ZBlf5xd5RAe8NrioavL83ZNYOeAzJJLJYjGCcMDXn110zWV+dTkOD9BXYcR6z5m5336kVBAsEHHozvAA5PysoTUPkqyCwJZjh4a5QWoFed32+j/nlQkgG3Rt5Vg4EPBoEZV21OuboZMqkIo4oPdOYHAnyJQG8ZdEcPJbszNrzPk/lt1n66kbqBS24hQzI1EKgyxMBdCNg8rnknIREboCq9kIVKxADM2D0PujemW2vSdFeGEgwPWkGRj2IyLYTGF0XWmHeZpEzT+W1lAA5dgas7NkLujVWxrfTu+mCcgz49DqQIsnxIoLMnF0bYj+Dz7ER0GKwgR8pBcLoFl1sWQ/pc1S02HDlesOuZhNvmxT0ogVxIYWoogl1RhxrqIisjV7AQnumGecjLk9osDfZpizYC6RAKHy4EFaxCGViUUsmL8dURQQJ1DddnFLCCdYOLb2tYWbj6vHyxS5fdoiimIc1JIxIRwuhnEgs2JQllvdK9dBvzekZ07uPassYcb7OXu42Ayllr0rsWGh+7YRvY8BCDE/XP9AzObEEcy9WOXAAAAAElFTkSuQmCC"); }' +
      '.th-pa-pt-share    .th-pa-pt { background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACaElEQVQ4T4XSX0hTURwH8O+5u9e8btetP1JuLUrBSIuRFUQvlpWQFiihyIJ6sYcei3qqhx6lB4nqxVw9BEX0EPQHKyKE/hCUIpZuRKl3Nsttbrpzt3nd3D3daZPdZnXgci+/c36f++P8fgR565Uv1gWwjvxY7psxRnjedE+h8YvHdtunc3GSf/ilb4Zu32SVNMYKjKHRaTg22FgoGu9Jx3Chce9amj1kAJ6PRGmlo1RKZwoB77cgDrrsmJhNsalw4mZMSZ5t2+ecMwC9nyN0c7lZUlMLgEkwVDEmh9G0ywF1gUHWkZ9BpTueUM8ZgCeDYVpxq1YihMN8ew+0yrplZNy/BGTXnI74Z1IsoCMG4PG7MWXL/QaLvc6Nyb47WDh+FVr1kcUkWQfyl0UsgpoiChlwl3YxQhZvnvGihRfNpKrhBJLxOAJvHyLT3Am2swWRqLKcn/2riSOYpSmVvG+1UteZKxJLJXVBQybyHZlJL0iJDWmrE/LrR9DcN0C2HTBUIPIcfF+jCnnTbKM1hxulTFjO1gCmJqAloiCCCMG5A3PmcshBCr7DUwAMf4kopK/JRqtrt0rpwIix9xwPZnVgIpQGTl2DqeaPCgQOQ76wQl4cKu0Cxy1Nn6DfgcCTqrJ5zDMTArOrQI6eR1HD6YLBEnVgcDikGLpw+6lX2djTaKmoWIPx0QiE1ksoqj+50mSjRAf6PwWNgKd3lJZfr5cIx6HYfRnF+9tXTM4Gs8DHwSkj0P3MT/e4yqRkIql3Qfprcg74MPDDCHTe7fdYV69r+2dm3mZsZvqB4Q70PbP+rP/9/p+T0A8EfwHTFvU4JDA5ZgAAAABJRU5ErkJggg=="); }' +
      '.th-pa-pt-wallpost .th-pa-pt { background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACeElEQVQ4T4WTXUiTURzGn/djc7pPW2vTqZgf3Wh+ZMgM0sI7LaSLjEC60ouii5K8KC9UiOimCLqIMoJIo7S7QIIQEqILNcXUVqx01nTfe91edWvOnd7X5dt0ix44nMOf5/z4f5xDIUmj1uBdgLQnx3bOhBCKZZnnfGit+/TRXN9OnEo2v7VyofICrTpOSApj5rsPZpOOeAJr/ZtBdDVZ9CHRtAvwZj4QKjJlqWNgUgCfv7nRWJmLH6tR4vKuPwryG1dbj+WHJcDQ2TK536AN/+KWaVaTj9quF2DVBgm0YPeiucaMSIzALkCcbv7h2nqkUwI86ai+RRj5daMpB06HC0ZLC8ynOiXA4lICICosQJa4KHEIEAkwcLl2odpy8qB2nxYrPx2wr3hRdHFAAtgFQLJUmXJEohQvAV52WnoLD1X06A1GLC8tIlrYAF3dBemOP8BLZ/ESQ1NYDUUjEuDZpSMlSo3GptLowK9yMLQ9gMJQnG6i27FMlobVFkhkcHNUb1Zw7J268ivn3K/GUHC+BbP2Dygu7UOGLFH3XomAua9+nup9ndeuyJD3l+bX4HBeC/iwE5lyDb44R2FzTKHE1AOzvjUVIKMxY/XyVPdw6VSjpbmaYePYiPqxFd8U6pMJED3iMRoTswuorxpOC5ie8/DUtcHKWFNDPRPc8Ahd5UDIFiiKgUKeDZ3SiJF3YzhzYjwFkCVkMPnJzVMd96qeKtVsG2iKTldrjq4Rx2v70gImpl3bTVQJyygs9Y37I+8ryg4oI7F4otNKFcSxivteiRmMf1z5+w5Ew+3Bycfa7P2pHfvHMIOcb2jXZxJ8yj/ZiPv/tC4Y3L8B/vXnOFesbhoAAAAASUVORK5CYII="); }' +
      '.th-pa-picture { float: right; width: 70px; height: 70px; padding: 5px; text-align: center; }' +
      '.th-pa-picture img { max-width: 60px; max-height: 60px; }' +
      '.th-pa-post { float: left; width: 480px; padding: 5px; min-height: 70px; }' +
      '.th-pa-title { font-weight: bold; }' +
      '.th-pa-title, .th-pa-content { white-space: pre-line; }' +
      '.th-pa-ellipsis { white-space: nowrap; text-overflow: ellipsis; overflow: hidden; }' +
      '.th-pa-meta { opacity: 0.6; }' +
      '#th-pa-table tr:hover .th-pa-meta { opacity: 1; }' +
      '.th-pa-meta li, #th-pa-filter li { display: inline-block; margin-right: 10px; }' +
      '.th-pa-expand { float: none; padding: 0px; width: 13px; height: 13px; vertical-align: text-top; }' +
      '.th-pa-post-link, .th-pa-original-link { float: right; }' +
      '.th-pa-stealth { display: none !important; }' +
      '#th-pa-table tr:hover .th-pa-stealth { display: inline-block !important; }'
    ).appendTo( 'head' );
  }

  /**
   * Add the about window which shows the version and changelog.
   * It also displays donate buttons and an update button if a newer version is available.
   */
  function addAboutWindow() {
    doLog( 'Added about window.', 'i' );

    // About window.
    var $aboutWindow = $( '<div/>', {
      'id' : 'th-aw',
      html :
        '<h1>About Tsu Helper</h1>' +
        '<div class="th-about-love"><i class="th-icon th-icon-heart"></i>Made with love and care.</div>' +
        '<div><ul class="th-aw-info">' +
          '<li>Version <strong>' + Updater.localVersion + '</strong> (<a href="https://j.mp/tsu-helper-changelog" target="_blank">changelog</a>)<br />' +
          '<li>&copy;2014-2015 Armando L&uuml;scher (<a href="/noplanman">@noplanman</a>)<br />' +
          '<li><em>Disclaimer</em>: Tsu Helper is in no way affiliated with Tsu LLC.' +
          '<li>Use it at your own risk.' +
        '</ul></div>' +
        '<div><i class="th-icon-manual"></i>For more details about this script, to see how it works,<br />and an overview of all the features and how to use them,<br /> take a look at the extensive manual <a href="https://j.mp/tsu-helper-readme" target="_blank">here</a>.</div>' +
        '<div><ul class="th-aw-get-in-touch">' +
          '<li>Found a <i class="th-icon th-icon-bug" title="Bug"></i>' +
          '<li>Have a great <i class="th-icon th-icon-idea" title="Idea"></i>' +
          '<li>Just want to say hi?' +
          '<li><a class="message_pop_up fancybox.ajax" href="/messages/new/noplanman">Let me know!</a>' +
        '</ul></div>' +
        '<div>If you like this script and would like to support my work, please consider a small donation. It is very much appreciated <i class="th-icon th-icon-heartp"></i>' +
          '<div class="th-buttons-div th-aw-donate-buttons">' +
            '<a class="th-aw-donate-paypal" href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=CRQ829DME6CNW" target="_blank"><img alt="Donate via PayPal" title="Donate via PayPal" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif" /></a>' +
            '<span>&laquo; PayPal <i> - or - </i> Tsu &raquo;</span>' +
            '<a class="th-aw-donate-tsu button message_pop_up fancybox.ajax donation" href="/users/profiles/donation/104738" title="Donate via Tsu">Donate</a>' +
          '</div>' +
        '</div>' +
        '<div id="th-about-followme">Follow me and stay up to date!</div>' +
        '<div>Iconset <a href="https://www.iconfinder.com/iconsets/essen" target="_blank">Essen</a> by <a href="http://pc.de" target="_blank">PC.de</a></div>'
    });

    // Get my card and add it to the about window.
    $.get( '/users/profile_summary/104738', function( card ) {
      $aboutWindow.find( '#th-about-followme' ).after( card );
    });

    // Settings window.
    var $settingsWindow = $( '<div/>', {
      'id' : 'th-sw',
      html : '<h1>Tsu Helper Settings</h1>'
    });

    // Settings which are only a checkbox.
    var checkboxSettings = '';
    [
      { name : 'hideAds',      txt : 'Hide Ads',                       help : 'Show or Hide all the Ads.' },
      { name : 'quickMention', txt : 'Enable Quick Mentions',          help : 'Add Quick Mention links to comments and replies.' },
      { name : 'emphasizeNRP', txt : 'Emphasize Nested Replies',       help : 'Emphasize the parent of nested comment replies, to make them more visible.' },
      { name : 'checkSocial',  txt : 'Check Social Networks',          help : 'Check if your new post is being shared to your connected Social Network accounts.' },
      { name : 'checkMaxHM',   txt : 'Check Max. Hashtags & Mentions', help : 'Check if the maximum number of Hashtags & Mentions has been reached before posting.' }
    ].forEach(function( item ) {
      checkboxSettings += '<div><label><input type="checkbox" name="' + item.name + '"' + checked( settings[ item.name ] ) + ' />' + item.txt + '</label><i class="th-icon th-icon-help th-sw-help" title="' + item.help + '"></i></div>';
    });

    // The debug level dropdown.
    var debugLevelSettings = ( publicDebug || 104738 === window.current_user.id ) ?
      '<div><label>Debug level: ' +
        '<select name="debugLevel">' +
          '<option value="disabled"' + selected( 'disabled', settings.debugLevel ) + '>Disabled</option>' +
          '<option value="l"' + selected( 'l', settings.debugLevel ) + '>Log</option>' +
          '<option value="i"' + selected( 'i', settings.debugLevel ) + '>Info</option>' +
          '<option value="w"' + selected( 'w', settings.debugLevel ) + '>Warn</option>' +
          '<option value="e"' + selected( 'e', settings.debugLevel ) + '>Error</option>' +
        '</select>' +
      '</label></div>' : '';

    // List the available count options.
    var selectNotifReloaded = '<select name="notifReloaded"><option value="0">Disabled</option>';
    [ 5, 10, 15, 20, 25, 30 ].forEach(function( val ) {
      selectNotifReloaded += '<option value="' + val + '">' + val + '</option>';
    });
    selectNotifReloaded += '</select>';

    var $settingsForm = $( '<form/>', {
      'id' : 'th-settings-form',
      html :
        checkboxSettings +=

        // Notifications Reloaded
        '<div><label>Notifications Reloaded count: ' +
          selectNotifReloaded +
        '</label><i class="th-icon th-icon-help th-sw-help" title="How many notifications to show in the notification popup."></i></div>'

        + debugLevelSettings
    })
    .appendTo( $settingsWindow );

    // Defaults button on Settings window.
    var $defaultsButton = $( '<a/>', {
      'id'  : 'th-sw-defaults-button',
      class : 'button red',
      title : 'Reset to default values',
      html  : 'Defaults',
      click : function() {
        Settings.setDefaults( $settingsForm );
      }
    })
    .appendTo( $settingsWindow.find( 'h1' ) );

    // The state in which the Settings are closed (back or save).
    var settingsCloseState = null;

    // Save button on Settings window.
    var $saveButton = $( '<a/>', {
      'id'  : 'th-sw-save-button',
      class : 'button',
      title : 'Save Settings',
      html  : 'Save',
      click : function() {
        if ( confirm( 'Refresh page now for changes to take effect?' ) ) {
          Settings.save( $settingsForm );
          settingsCloseState = 'save';
          $.fancybox.close();
        }
      }
    });

    // Back button on Settings window.
    var $backButton = $( '<a/>', {
      'id'  : 'th-sw-back-button',
      class : 'button grey',
      title : 'Go Back without saving',
      html  : '&laquo; Back',
      click : function() {
        // Close this window.
        settingsCloseState = 'back';
        $.fancybox.close();
      }
    });

    // Buttons on Settings window.
    $( '<div/>', {
      class : 'th-buttons-div',
      html  : '<span><a href="https://j.mp/tsu-helper-settings" target="_blank">Detailed Help</a></span>'
    })
    .prepend(  $backButton )
    .append(   $saveButton )
    .appendTo( $settingsWindow );


    // Settings button on About window.
    $( '<a/>', {
      'id'  : 'th-aw-settings-button',
      title : 'Change Settings',
      html  : '',
      click : function() {
        // Open settings window in a fancybox.
        Settings.populateForm( $settingsForm );
        $.fancybox( $settingsWindow, {
          closeBtn : false,
          modal : true,
          beforeClose : function() {
            // If the Back button was pressed, reopen the About window.
            if ( 'back' === settingsCloseState ) {
              setTimeout(function() {
                $.fancybox( $aboutWindow );
              }, 10);
              return false;
            }
          },
          afterClose : function() {
            // If the Save button was pressed, reload the page.
            if ( 'save' === settingsCloseState ) {
              location.reload();
              return;
            }
          }
        });
      }
    })
    .appendTo( $aboutWindow.find( 'h1' ) );


    // Check if there is a newer version available.
    if ( Updater.hasUpdate() ) {
      $( '<a/>', {
        'id'  : 'th-aw-update-button',
        class : 'button th-update',
        title : 'Update Tsu Helper to the newest version (' + Updater.remoteVersion + ')',
        href  : Updater.scriptURL,
        html  : 'New Version!',
        click : function() {
          if ( ! confirm( 'Upgrade to the newest version (' + Updater.remoteVersion + ')?\n\n(refresh this page after the script has been updated)' ) ) {
            return false;
          }
        }
      })
      .attr( 'target', '_blank' ) // Open in new window / tab.
      .appendTo( $aboutWindow.find( 'h1' ) );
    }

    // Link in the menu that opens the about window.
    var $aboutWindowLink = $( '<a/>', {
      title : 'About noplanman\'s Tsu Helper',
      html  : 'About Tsu Helper',
      click : function() {
        // Close the menu.
        $( '#navBarHead .sub_nav' ).hide();

        // Open about window in a fancybox.
        $.fancybox( $aboutWindow );
      }
    });

    // Check if there is a newer version available.
    if ( Updater.hasUpdate() ) {
      // Change the background color of the name tab on the top right.
      $( '#navBarHead .tab.name' ).addClass( 'th-update' );
      $aboutWindowLink.addClass( 'th-update' );
    }

    // Add "About" menu item.
    $( '<li/>', { 'id' : 'th-menuitem-about', html : $aboutWindowLink } )
    .appendTo( '#navBarHead .sub_nav' );
  }

});