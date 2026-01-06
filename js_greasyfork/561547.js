// ==UserScript==
// @name            player.serieturche.eu-e
// @namespace       https://github.com/GavinBrelstaff
// @description     Facilitates access to serieturche.eu
// @description:it  Facilita l'accesso a serieturche.eu
// @match           https://player.serieturche.eu/e/*
// @require         https://cdn.jsdelivr.net/npm/video.js@8.23.4/dist/video.min.js
// @require         https://cdn.jsdelivr.net/npm/videojs-hotkeys@0.2.30/videojs.hotkeys.js
// @grant           none
// @version         1.3
// @license         GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @downloadURL https://update.greasyfork.org/scripts/561547/playerserieturcheeu-e.user.js
// @updateURL https://update.greasyfork.org/scripts/561547/playerserieturcheeu-e.meta.js
// ==/UserScript==

console.clear = () => {}; // protect from console wiping
console.log("*****  IN FRAME ******************************************************************");


window.count=0;
window.code=''; // to contain the parameters
window.code_sub=''; // to contain substitle url
window.subtitles='';


new MutationObserver(async (mutations, observer) => {
    const els = mutations
        .flatMap(e => [...e.addedNodes])
        .filter(e => e.tagName == 'SCRIPT')

    for( el of els )
    {
        window.count++;
        var safe = false;
        var str = '';

        if( el.onerror )  // new workaround for scripts that fail on purpose
        {
          el.onerror=function()
          {
              console.log('adb: FIXED load adsbygoogle');
          };
          console.log( window.count + 'onerror: ' + el.src + '||' + el.onerror.toString() );
        }


        if( el.src ) // script src
        {
            str = el.src;
            safe = false;
        }
        else // inline script code
        {
            str  = el.innerHTML.substring(0,80).replace(/\s*/g,'');
            if( str.startsWith('if(self!=top){mediaplayerdiv2') )
            {  // create video ready for loading m3u8_url
               el.innerHTML = el.innerHTML.substr(18).replace('<video','<video controls="true"');
               safe = true;
            }
            else
            if( str.startsWith('varwaspopplayein=false,') )
            {  // extract any subtitle .ass_url
               window.code_sub = el.innerHTML;
               safe = false;
            }            
            else
            if( str.startsWith('//beforeembed.js') )
            {
               safe = false;
               window.code=el.innerHTML; // trigger to start
            }

        }
        if( ! safe )
        {
           el.remove(); // kill script
           console.log( window.count + 'UNSAFE: ' + str );
        }
        else
           console.log( window.count + ' _SAFE: ' + str );
    }

}).observe(document, {
    childList: true,
    subtree: true,
})


////////////////////////////////////////////////////
// python code: https://github.com/Kodi-vStream/venom-xbmc-addons

function decrypt(str)
{
    str = str.substr(1) // str[1:]
    var j = 0;
    var s2 = '';
    while( j < str.length )
    {
        s2 += '\\u0' + str.substr(j,3); // str[j:(j + 3)]
        j += 3;
    }
    //s2 = decodeURI(s2);
    s2 = JSON.parse('"' + s2 + '"'); // https://www.javaspring.net/blog/how-to-decode-unicode-html-by-javascript/
    return s2
}




window.tries=0;

function random_hexstr(n)
{
  const hexArr='0123456789abcdef'.split(''); // length 16
  var str='';
    for(var i=0; i<n; i++)
    {
        const d = Math.floor(Math.random() * 16);
        str += hexArr[d];
    }
   return(str);
}


// https://sqlpey.com/javascript/how-to-retrieve-dimensions-of-base64-images-in-javascript/
window.fetching = false;

function renderCaptcha( data )
{
  var image = document.getElementById('captcha');
    if( !image )
    {
       image = new Image();
       image.id = 'captcha';
       image.style="position:absolute; left: 0; top: 0; z-index: 100; border:1px solid yellow;"
       image.onload = function(e) {
            const el = e.target; // this
             console.log('image loaded: ' + el.width + ' x ' + el.height );
             console.log('image loaded: Please click');
        };
        image.onerror = function() {
             console.log('image loaded: FAILED ...');
             // restart from here
        };
        image.onclick = function(e) {
            const el = e.target; // this
            if( window.fetching ) {
                console.log('click blocked :' + e.clientX + ', ' + e.clientY );
            }
            else
            {
                console.log('click allowed :' + e.clientX + ', ' + e.clientY );
                window.fetching = true;
                fetch_md5( el.hash_image, e.clientX, e.clientY );
            }
        };
        document.body.append( image );
    }
    image.hash_image = data.hash_image;
    image.src = data.image; // Set source and evoke onload
}

const delay = ms => new Promise(res => setTimeout(res, ms));


async function try_again_image( isec ) {
    try {
        await delay(5000);
        console.log("Waited 5s | isec: " + isec);
        fetch_player_image( );
    } catch (error) {
        console.error(error);
    }
}

async function try_again_md5( hash_image, width, height, isec ) {
    try {
        await delay(5000);
        console.log("Waited 5s | isec: " + isec);
        fetch_md5( hash_image, width, height );
    } catch (error) {
        console.error(error);
    }
}


function fetch_player_image()
{
  console.log('fetch_player_image: ' + window.tries++ );

    fetch('/player/get_player_image.php',
    {
        method: "POST",
        body: JSON.stringify
        ({
          'videoid':  window.videoid, //'34384335',
          'videokey': window.videokey, //'yBnRZTuCOJan',
          'width':    400,
          'height':   400
        }),
        headers: {
          "Content-type": "application/json",
          "Origin": "https://player.serieturche.eu",
          "X-Requested-With": "XMLHttpRequest"
        }
    })
     .then((response) => response.json())
     .then((data) =>
     {
          console.log(data);
          var size=null;
          if( data.success  && data.hash_image )
          {  // extract hash_image, x,y
            try { //  try to retrieve successful click {'x': xval, 'y': yval}
/*
               const coord = localStorage.getItem(data.hash_image);
                  if( coord != null && coord.x && coord.y )
                  {
                    console.log('Retrieved coords: ' + coord.x +'. ' + coord.y);
                    fetch_md5( data.hash_image, coord.x, coord.y ); // skip captcha
                  }
                  else
*/
                renderCaptcha( data );
              } catch (error) {
                  console.error(error);
            }
          } else if( data.try_again && data.try_again == '1')
          {
            console.log('/player/get_player_image.php says TRY AGAIN... ');
            //fetch_player_image();
            try_again_image( data.isec );
          }
      }
    )
}


function fetch_md5( hash_image, x, y ) // from click or algorithm
{
  console.log('fetch_md5: ' + (window.tries++) + ' | coord: ' + x + ',' + y );

    fetch('/player/get_md5.php',
    {
        method: "POST",
        body: JSON.stringify
        ({
        'htoken': '',
        'sh': random_hexstr(40), // 40 char random number as leading zero string
        'ver': '4',
        'secure': '0',
        'adb': window.adbn,
        'v':   window.videokey,
        'token': '',
        'gt': '',
        'embed_from': '0',
        'wasmcheck': 1,
        'adscore': '',
        'click_hash': encodeURIComponent(hash_image), // encodeURIComponent
        'clickx': x,
        'clicky': y
        }),
        headers: {
          "Content-type": "application/json",
          "Origin": "https://player.serieturche.eu",
          "X-Requested-With": "XMLHttpRequest"
        }
    })
     .then((response) => response.json())
     .then((data) =>
     {
          console.log(data);
          var player;
          window.fetching = false; // re-allow clicks
          if( data.try_again && data.try_again == '1')
          {
            console.log('/player/get_md5.php says TRY AGAIN... ');
            //try_again_md5( hash_image, width, height, data.isec );
            try_again_image( data.isec );
          }
          else if( data.obf_link && data.obf_link != '#' )
          {
            console.log('SUCCESS: obf_link: ' + data.obf_link );
         // localStorage.setItem(hash_image, {'x': x, 'y': y});  // store successful click
            const m3u8_url = "https:" + decrypt( data.obf_link ) + '.mp4.m3u8';
            console.log('m3u8_url: ' + m3u8_url );
            player =videojs('#olvideo', {	plugins: { 	hotkeys: {
                        volumeStep: 0.1,
                        seekStep: 5,
                        enableModifiersForNumbers: false,
                      },
                  },
            });
            player.ready(function()
            {
                if( window.subtitles )
                {
                    const myvideo = document.querySelector('#olvideo > video');
                    if( myvideo )
                    {
                        const track = myvideo.addTextTrack("subtitles", "Italiano", "it");
                        track.mode = "showing";
                        for( cue of window.subtitles )
                        {
                           track.addCue(new VTTCue(cue.start, cue.end, cue.text));
                        }                        
                        console.log(track.cues);
                    }
              }
            });

             player.src({
                src: m3u8_url,
                type: 'application/x-mpegURL'
             });
             
             const mycaptcha = document.getElementById('captcha');
             if(mycaptcha) mycaptcha.remove();
             //document.getElementById('olvideo').style.visibility = "visible"; // make visible
             loadcss();
             
             player.play();
             
             // set tab title <meta property="og:title" content="B B G 01">
             const mytitle = document.querySelector('meta[property="og:title"][content]');
             if( mytitle )   document.title = '❣️ ' + mytitle.getAttribute('content');
             
             // eliminate the dull favicon
             var link = document.querySelector("link[rel~='icon']");
             if (!link) {
                link = document.createElement('link');
                link.rel = 'icon';
                document.head.appendChild(link);
             }
             link.href = document.createElement("canvas").toDataURL("image/x-icon"); // blank image
          }
          else
          {
            console.log('/player/get_md5.php BAD obf_link... ');
            //try_again_md5( hash_image, width, height, data.isec );
            // halt here
          }
     }
   )
}


function loadcss()
{
  const mylink = document.createElement('link');
  mylink.rel = "stylesheet";
  mylink.type = "text/css";
  mylink.href = "https://vjs.zencdn.net/7.19.2/video-js.css";
  document.getElementsByTagName('head')[0].appendChild(mylink);
  const timediv = document.getElementById('timeDiv');
  if( timediv ) timediv.remove();
  const mailto = document.querySelector('a[href^="mailto:"]');
  if( mailto ) mailto.remove();
}


const mypid = setInterval(function() // Polling for window.code parameters
{
  if( window.code && window.code.includes('videoid =') )   {
    // userid = "162759", (adbn)
    // server_referer = "https://player.serieturche.eu/f/yBnRZTuCOJan", (videokey)
    // videoid = "34384335",
    const lineArr = window.code.split('\n');
    for(line of lineArr)
    {
       if( line.includes('userid =') )
             window.adbn = line.replace(/.*userid\s*=\s*"([^"]*)".*/, '$1');
       else
       if( line.includes('videoid = ') )
             window.videoid = line.replace(/.*videoid\s*=\s*"([^"]*)".*/, '$1');
       else
       if( line.includes('server_referer = ') )
             window.videokey = line.replace(/.*server_referer\s*=\s*"https\:\/\/player\.serieturche\.eu\/[e-f]\/([^"]*)",/, '$1');
    }
    console.log('videoid  = ' + window.videoid );
    console.log('videokey = ' + window.videokey );
    console.log('adbn     = ' + window.adbn );

     clearInterval(mypid);
     // document.getElementById('olvideo').style.visibility = 'hidden';
     fetch_player_image();  // start the fetching algorithm
  }
}, 500); // every 0.5 sec


async function fetchConvert(suburl) {
  console.log('fetchConvert() ');
  try {
    const response = await fetch(suburl,{
        method: "GET",
        headers: {
          "Content-type": "text/json",
          "Origin": "https://player.serieturche.eu",
          "X-Requested-With": "XMLHttpRequest"
          }
        });
        if (!response.ok) throw new Error('Fetch failed');
      const assText = await response.text();
      console.log('assText: ' + assText);
      if( 0 < assText.length ){
           window.subtitles = assToCueArr(assText);
           console.log('window.subtitles:\n' + window.subtitles );
      }
      else
      console.log('window.subtitles  NONE' );
  } catch (error) {
    alert(error.message);
  }
}

function time_str2secs( time_str )
{
  const myArr = time_str.split(':'); // h:mm:ss.dd
  const h = parseInt(myArr[0]);
  const m = parseInt(myArr[1]);
  const secArr = myArr[2].split('.');
  const s = parseInt(secArr[0]);
  const d = parseInt(secArr[1]);

  return( h*360 + m*60 + s + (0.1*d) );

}

function assToCueArr(assText)
{
 var cueArr=[]; // {start, end, text}
 const lineArr = assText.split(/\r?\n/);
    for( line of lineArr )
    {
      if( line && line.startsWith('Dialogue:'))
      { 
        // Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
        // Dialogue: 0,0:02:16.41,0:02:18.21,Default,,0,0,0,,Sua Santità Sultan Melikşah!
        const myArr = line.split(',');
        cueArr.push( { start: time_str2secs(myArr[1]), end: time_str2secs(myArr[2]), text: filterText(myArr[9]) } );
      }
    }
  return( cueArr );
}

function filterText(str)
{
  str = str.replace(/{[^}]*}/g,''); // {...}
  str = str.replace(/\\N/g,'\n');  // \N
  return(str);
}


const mypid_sub = setInterval(function() // Polling for window.code_sub url
{
  if( window.code_sub && window.code_sub.includes('file2sub') )   {
    // file2sub("https://cdn-s5.cfglobalcdn.com/flv/api/files/srt/2021/03/24/1616595627fcjti-82-tIMf.ass","it","Italian", 'showing', undefined, false);
    const lineArr = window.code_sub.split('\n');
    var suburl = '';
    for(line of lineArr)
    {
       if( line.includes('file2sub') )
       {
           console.log('FOUND  = ' + line );
           suburl = line.replace(/.*file2sub\("([^"]*)".*/, '$1');
           console.log('suburl  = ' + suburl );
           fetchConvert(suburl); 
       }
    }
   clearInterval(mypid_sub);
  }
}, 500); // every 1 sec

