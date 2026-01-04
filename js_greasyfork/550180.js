// ==UserScript==
// @name         Medium Unlocker (via Freedium)
// @namespace    http://tampermonkey.net/
// @version      0.0.7
// @description  Redirect Medium's premium posts to Freedium, also works for custom domains
// @author       d0gkiller87
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=medium.com
// @grant        none
// @run-at       document-start
// @noframes
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550180/Medium%20Unlocker%20%28via%20Freedium%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550180/Medium%20Unlocker%20%28via%20Freedium%29.meta.js
// ==/UserScript==

/* jshint esversion: 11 */

(function() {
  'use strict';

  function hasMediumLogo() {
    return document.querySelector( '#wordmark-medium-desc' ) !== null;
  }

  function isMediumPost() {
    const path = window.location.pathname;
    const pathParts = path.split( '/' );
    return (
      path !== '/' &&
      ( pathParts[pathParts.length - 1].match( /-[a-f0-9]{12,}$/ ) ) &&
      hasMediumLogo()
    );
  }

  let asking = false;
  function askRedirect() {
    if ( asking ) return;

    asking = true;
    if ( confirm( 'Redirect to Freedium?' ) ) {
      window.location.host = 'freedium-mirror.cfd';
    }
    asking = false;
  }

  if ( window.top !== window.self ) {
    return;
  }

  let cancel_state_change_handler = false;

  const readyStateChangeHandler = document.addEventListener( 'readystatechange', event => {
    if ( document.readyState !== 'interactive' ) return;
    document.removeEventListener( 'readystatechange', readyStateChangeHandler );

    if ( hasMediumLogo() ) {
      const hookedReplaceState = patchHistory( 'replaceState' );
      Object.defineProperty( history, 'replaceState', {
        configurable: false,
        enumerable: true,
        get() {
          return hookedReplaceState;
        },
        set( fn ) {
          // modification blocked
        }
      });
      window.addEventListener( 'replaceState', askRedirect );
    }

    if ( !isMediumPost() ) return;
    if ( cancel_state_change_handler ) return;
    askRedirect();
  });

  function patchHistory( method ) {
    const original = window.history[method];
    return function() {
      const result = original.apply( this, arguments );
      const event = new Event( method );
      event.arguments = arguments;
      window.dispatchEvent( event );
      return result;
    };
  }

  if ( window.performance ) {
    const newNavigations = window.performance.getEntriesByType( 'navigation' );
    for ( const navigation of newNavigations ) {
      if ( navigation.type === 'back_forward' ) {
        cancel_state_change_handler = true;
        document.removeEventListener( 'readystatechange', readyStateChangeHandler );
        return;
      }
    }

    const oldNavigation = window.performance?.navigation?.type;
    if ( oldNavigation && oldNavigation === window.performance.navigation.TYPE_BACK_FORWARD ) {
      cancel_state_change_handler = true;
      document.removeEventListener( 'readystatechange', readyStateChangeHandler );
      return;
    }
  }
})();
