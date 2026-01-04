// ==UserScript==
// @name         Direct Download for products from Elgato marketplace (working in 2025)
// @namespace    com.elgato
// @description  Downloads Plugins and more from the Elgato store. Reprograms the "Open in Stream Deck" button on product pages
// @author       Thomas R.
// @version      1.0.0
// @license      MIT
// @match        http*://marketplace.elgato.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=marketplace.elgato.com
// @require      https://greasyfork.org/scripts/374849-library-onelementready-es6/code/Library%20%7C%20onElementReady%20ES6.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/556856/Direct%20Download%20for%20products%20from%20Elgato%20marketplace%20%28working%20in%202025%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556856/Direct%20Download%20for%20products%20from%20Elgato%20marketplace%20%28working%20in%202025%29.meta.js
// ==/UserScript==

const downloadFile = async (url, filename) => {
    GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        responseType: 'blob',
        onload: function(response) {
            const blob = response.response;
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(a.href);
        },
        onerror: function(err) {
            console.error('Download error:', err);
        }
    });
};

const handleDownload = async (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    event.currentTarget.querySelectorAll("*").forEach(element => element.style.pointerEvents = 'none');

    const sessionResponse = await fetch('https://marketplace.elgato.com/api/auth/session');
    const sessionJSON = await sessionResponse.json();
    const productId = __NEXT_DATA__.props.pageProps.content.variants[0].id;
    const productName = __NEXT_DATA__.props.pageProps.content.name
    const purchaseResponse = await fetch(`https://mp-gateway.elgato.com/items/${productId}/purchase-link`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${sessionJSON.accessToken}`,
            'Content-Type': 'application/json'
        }});
    const purchaseJSON = await purchaseResponse.json();
    console.log(purchaseJSON.direct_link, `${productName}.zip`);
    downloadFile(purchaseJSON.direct_link, `${productName}.zip`);
}

const init = async () => {
    onElementReady('button[aria-label="Open in Stream Deck"]', false, (element) => {
        console.log(window)
        if (location.pathname.startsWith("/product")) {
            element.addEventListener("click",handleDownload);
        }
    });

    // we can't use clientside navigation because of __NEXT_DATA__
    navigation.addEventListener("navigate", e => {
        if(e.navigationType === 'push' && e.downloadRequest === null ) {
            location = e.destination.url
        }
    });
}

init();
