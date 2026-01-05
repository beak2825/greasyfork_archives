// ==UserScript==
// @name         TMD actors photo
// @namespace    http://torrentsmd.com
// @version      2.0
// @description  add photos on actors
// @author       drakulaboy
// @include      *torrentsmd.*/details.php*
// @require     http://code.jquery.com/jquery-2.1.1.js
// @downloadURL https://update.greasyfork.org/scripts/8120/TMD%20actors%20photo.user.js
// @updateURL https://update.greasyfork.org/scripts/8120/TMD%20actors%20photo.meta.js
// ==/UserScript==
$('body')[0].innerHTML = $('body')[0].innerHTML.replace(/(<b>Actori<\/b>\: )(\s*[^<]*)/g, function(str, matchStr, matchActors)
{
    return matchStr + matchActors.split(/\s*,\s*/).map(function(actor)
    {
        return '<a href="http://www.myapifilms.com/imdb?name=' + actor + '">' + actor + '</a>';
    }).join(', ');
});

var persons;

function get(url, cb)
{
  GM_xmlhttpRequest({
     method: "GET",
     headers: {
        "Referer": ""
     },
     url: url,
     onload: function(xhr) { cb( xhr.responseText); },
     overrideMimeType: 'text/plain; charset=x-user-defined'
  });
}

function fetchImageData(el, imdbObj)
{
    get(imdbObj.img, function(bin) {
        var base64img = customBase64Encode(bin);
        setCastStyle(el, 'data:image/jpeg;base64,' + base64img);
    });
}

function setCastStyle(el, img)
{
    el.style.display    = 'block';
    el.style.padding    = '14px 5px 14px 50px';
    el.style.margin     = '2px 0';
    el.style.width      = '120px';
    el.style.background = '#F3F4E7 url("'+img+'") no-repeat 10px 80%';
}

function drawCastBox()
{
    var xpath = '//b[contains(.,"Actori")]/following-sibling::a[following-sibling::b[.="Durata"]]';
    persons = document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    if(!persons.snapshotLength)
        return false;

    var castBox = persons.snapshotItem(0).parentNode.parentNode;
    castBox.after = '';
    for(var i = 0; i < persons.snapshotLength; i++) {
        var el = persons.snapshotItem(i);
        setCastStyle(el,'http://i.media-imdb.com/images/SF984f0c61cc142e750d1af8e5fb4fc0c7/nopicture/small/name.png');
        castBox.appendChild(el);
    }

    return true;
}

function drawImages(text)
{
    var imdbActors = [];
    text.replace(/title="(.*?)".*?loadlate="(.*?)"/gm,
        function(m, n, o) {imdbActors.push({img: o, name: n});}
    );
    for(var i = 0; i < persons.snapshotLength; i++) {
        for(var j = 0; j < imdbActors.length; j++) {
            var ftActor = persons.snapshotItem(i).text.replace(/ \(.+\)/,'').toLowerCase();
            var imdbActor = imdbActors[j].name.toLowerCase().replace(/\./gm,'');
            if(imdbActor == ftActor) {
                fetchImageData(persons.snapshotItem(i), imdbActors[j]);
            }
        }
    }
}

function callImdb()
{
    var xpath = '//a[contains(@href, "http://www.imdb.com/title/")]';
    var imdbUrl = document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0);
    if(!imdbUrl || !drawCastBox())
        return false;
    get(imdbUrl.toString(), drawImages);
}

/* http://stackoverflow.com/questions/8778863/downloading-an-image-using-xmlhttprequest-in-a-userscript */
function customBase64Encode (inputStr) 
{
    var
        bbLen               = 3,
        enCharLen           = 4,
        inpLen              = inputStr.length,
        inx                 = 0,
        jnx,
        keyStr              = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
                            + "0123456789+/=",
        output              = "",
        paddingBytes        = 0;
    var
        bytebuffer          = new Array (bbLen),
        encodedCharIndexes  = new Array (enCharLen);

    while (inx < inpLen) {
        for (jnx = 0;  jnx < bbLen;  ++jnx) {
            /*--- Throw away high-order byte, as documented at:
              https://developer.mozilla.org/En/Using_XMLHttpRequest#Handling_binary_data
            */
            if (inx < inpLen)
                bytebuffer[jnx] = inputStr.charCodeAt (inx++) & 0xff;
            else
                bytebuffer[jnx] = 0;
        }

        /*--- Get each encoded character, 6 bits at a time.
            index 0: first  6 bits
            index 1: second 6 bits
                        (2 least significant bits from inputStr byte 1
                         + 4 most significant bits from byte 2)
            index 2: third  6 bits
                        (4 least significant bits from inputStr byte 2
                         + 2 most significant bits from byte 3)
            index 3: forth  6 bits (6 least significant bits from inputStr byte 3)
        */
        encodedCharIndexes[0] = bytebuffer[0] >> 2;
        encodedCharIndexes[1] = ( (bytebuffer[0] & 0x3) << 4)   |  (bytebuffer[1] >> 4);
        encodedCharIndexes[2] = ( (bytebuffer[1] & 0x0f) << 2)  |  (bytebuffer[2] >> 6);
        encodedCharIndexes[3] = bytebuffer[2] & 0x3f;

        //--- Determine whether padding happened, and adjust accordingly.
        paddingBytes          = inx - (inpLen - 1);
        switch (paddingBytes) {
            case 1:
                // Set last character to padding char
                encodedCharIndexes[3] = 64;
                break;
            case 2:
                // Set last 2 characters to padding char
                encodedCharIndexes[3] = 64;
                encodedCharIndexes[2] = 64;
                break;
            default:
                break; // No padding - proceed
        }

        /*--- Now grab each appropriate character out of our keystring,
            based on our index array and append it to the output string.
        */
        for (jnx = 0;  jnx < enCharLen;  ++jnx)
            output += keyStr.charAt ( encodedCharIndexes[jnx] );
    }
    return output;
}

callImdb();