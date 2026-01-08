// ==UserScript==
// @name            player.serieturche.eu-watch_video
// @run-at          document-start
// @namespace       https://github.com/GavinBrelstaff
// @description     Facilitates access to serieturche.eu
// @description:it  Facilita l'accesso a serieturche.eu
// @match           https://player.serieturche.eu/watch_video.php*
// @grant           none
// @version         2.0
// @license         GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @downloadURL https://update.greasyfork.org/scripts/561550/playerserieturcheeu-watch_video.user.js
// @updateURL https://update.greasyfork.org/scripts/561550/playerserieturcheeu-watch_video.meta.js
// ==/UserScript==

console.clear = () => {};

window.count=0;

new MutationObserver(async (mutations, observer) => {
    const els = mutations
        .flatMap(e => [...e.addedNodes])
        .filter(e => ((e.tagName == 'SCRIPT') )) //|| (e.tagName == 'IFRAME'))  )

    for( var el of els )
    {

        window.count++;
        var safe = false;
        var str = '';
        if( el.src ) // script src
        {
            safe = ( el.src.includes('jwplayer')
                  || el.src.includes('jquery.min.js')
                  || el.src.includes('unpkg.com')
                    )
          safe=false;
           str = el.src;
        }
        else // inline code
        {
            str  = el.innerHTML.substring(0,40).replace(/\s*/g,'');
            safe = ( false
                    //str.startsWith('if(self!=top){')
                    // || str.startsWith('varbase=') ||
                    // || str.startsWith('[')
                   );
            ; // examine at script code
        }
        if( ! safe )
        {
           el.remove(); // kill script
           console.log( window.count + 'UNSAFE: ' + str );
        }
        else
           console.log( window.count + '  SAFE: ' + str );
    }

}).observe(document, {
    childList: true,
    subtree: true,
})


const mypid1 = setInterval(function() // Polling for embedded iframe
{
  const el = document.querySelector('#video_div > iframe[src]');
  if( el )
  {
     console.log( 'FOUND iframe **************' );
     document.location.href = el.src;
     clearInterval(mypid1);
  }
}, 500); // every 0.5 sec

