// ==UserScript==
// @name        heartland title - clerks toolkit
// @namespace   htiac
// @description Get parcel links when viewing deeds
// @match       *://acclaim.highlandsclerkfl.gov/AcclaimWeb/Details*
// @version     1.0
// @author      ryan@htiac.net
// @connect     *
// @grant       GM_xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/558373/heartland%20title%20-%20clerks%20toolkit.user.js
// @updateURL https://update.greasyfork.org/scripts/558373/heartland%20title%20-%20clerks%20toolkit.meta.js
// ==/UserScript==

let mountPoint;

$(document).ready(() => {
  // we'll use the Document details heading to insert our buttons
  mountPoint = $("h2")[0];

  let bookPage = getBookPage();

  getParcelIdForBookPage(bookPage)
    .then(handleParcelIdResponse)
    .catch(() => {
      renderNotFound("No ParcelId - Connect VPN", "btn btn-sm m-1 btn-danger");
    })
})

const getBookPage = () => {
  let rows = $("#DocumentdetailsDiv > .row");
  let bookPageRow = rows[3];
  let bookPageRowText = $(bookPageRow).text();
  let regexp = new RegExp(`[0-9]+\/[0-9]+`, `gm`);
  let match = bookPageRowText.match(regexp);

  console.log(match);
  return {
    book: match[0].split('/')[0],
    page: match[0].split('/')[1]
  }
}

const getParcelIdForBookPage = (bookPage) => {
  return fetch(
    `https://api.htiac.net/highlands/sales/records?where=(BookNumber,eq,${bookPage.book})~and(PageNumber,eq,${bookPage.page})`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      }
    },
  );
}

const renderNotFound = (message, classes) => {
  const button = $(`<button disabled>${message}</button>`).attr("class", classes);
  button.insertAfter(mountPoint);
}

const renderButton = (parcelId, classes) => {
  const button = $(`<button onClick="window.open('https://www.hcpao.org/Search?id=${parcelId}', '_blank')">Go to parcel ${parcelId}</button>`).attr("class", classes);
  button.insertAfter(mountPoint);
}

const handleParcelIdResponse = async (response)  => {
    responseJson = await response.json();
    console.log(responseJson);
    try {
      responseJson.list.map(record => renderButton(record.ParcelId, "btn btn-sm m-1 btn-outline-primary"))
      if( responseJson.list.length === 0 ) {
        throw new Exception();
      }
    } catch {
      renderNotFound("Parcel ID not found", "btn btn-sm m-1 btn-warning");
    }
}

/* CORS */

const CORSViaGM = document.body.appendChild(Object.assign(document.createElement('div'), { id: 'CORSViaGM' }))

addEventListener('fetchViaGM', e => GM_fetch(e.detail.forwardingFetch))

CORSViaGM.init = function (window) {
  if(!window) throw 'The `window` parameter must be passed in!'
  window.fetch = window.fetchViaGM = fetchViaGM.bind(window)

  // Support for service worker
  window.forwardingFetch = new BroadcastChannel('forwardingFetch')
  window.forwardingFetch.onmessage = async e => {
    const req = e.data
    const { url } = req
    const res = await fetchViaGM(url, req)
    const response = await res.blob()
    window.forwardingFetch.postMessage({ type: 'fetchResponse', url, response })
  }

  window._CORSViaGM && window._CORSViaGM.inited.done()

  const info = '🙉 CORS-via-GM initiated!'
  console.info(info)
  return info
}


function GM_fetch (p) {
  GM_xmlhttpRequest({
    ...p.init,
    url: p.url, method: p.init.method || 'GET',
    onload: responseDetails => p.res(new Response(responseDetails.response, responseDetails))
  })
}

function fetchViaGM(url, init) {
  let _r
  const p = new Promise(r => _r = r)
  p.res = _r
  p.url = url
  p.init = init || {}
  dispatchEvent(new CustomEvent('fetchViaGM', { detail: { forwardingFetch: p } }))
  return p
}