// ==UserScript==
// @name         tensor.art profile download
// @namespace    http://tampermonkey.net/
// @version      2025-12-12v2
// @description  try to take over the world!
// @author       You
// @match        https://tensor.art/u/*
// @match        https://tensorhub.art/en-US/u/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tensor.art
// @grant        GM_download
// @grant        GM.download
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/548902/tensorart%20profile%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/548902/tensorart%20profile%20download.meta.js
// ==/UserScript==
//https://api.tensor.art/community-web/v1/post/list
/* eslint-disable */
// eslint-disable-line
// eslint-disable-next-line(function() {
    'use strict';
function doc_keyUp(e) {
  switch(e.keyCode)
  {
  case 220: //\
    console.log('starting');
    dlimages(false);
    break;
  case 221: //]
    console.log('starting');
    dlimages(true);
    break;
   default:
     break;
  }
}
document.addEventListener('keyup', doc_keyUp, false);

function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];

    while (c.charAt(0) === ' ') {
      c = c.substring(1, c.length);
    }
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
  }
  return null;
}
async function dlimages(onePage) {
    const token = getCookie('ta_token_prod');
    console.log('token'+token);
	let cursor = 0;
	let images = []
    const originalUrl = window.location.href;
	const currentURL = originalUrl.split('/');
    const uIndex = currentURL.indexOf('u');
	const userid = currentURL[uIndex+1];
    let result;
    console.log("https://api."+currentURL[2]+"/community-web/v1/post/list")

	do {
        const data = "{\"cursor\":\""+cursor+"\",\"filter\":{},\"size\":\"40\",\"userId\":\""+ userid +"\",\"sort\":\"NEWEST\",\"visibility\":\"PRIVATE\"}";
        console.log(data);
		const r = await GM.xmlHttpRequest ({
		  method: "POST",
		  url: "https://api."+currentURL[2]+"/community-web/v1/post/list",
		  headers: {
			"User-Agent": "yo-momma",
			"Accept": "*/*",
			"Accept-Language": "en-US,en;q=0.5",
            //"Accept-Encoding": "gzip, deflate, br, zstd",
			"Content-Type": "application/json",
            "Content-Length": data.length,
            "Referer": originalUrl,
			"X-Request-Sign": "ZjIyN2UxOThkYjMwYzA3MzI5YjI3OTRjYTIxZGMyZDhjMGE5ODU3ZjZlNmE2ZDFmNGU1MzY3OTkyYmQ0OTk2Mg==",
			"X-Request-Timestamp": "1764723083451",
			"X-Request-Package-Sign-Version": "0.0.1",
			"X-Request-Sign-Version": "v1",
			"X-Request-Sign-Type": "HMAC_SHA256",
			"X-Request-Package-Id": "3000",
            "Origin": originalUrl,
			"Sec-Fetch-Dest": "empty",
			"Sec-Fetch-Mode": "cors",
			"Sec-Fetch-Site": "same-site",
			"x-echoing-env": "",
			"Authorization": "Bearer "+token,
            "Connection": "keep-alive",
            "DNT": 1,
            "Priority": "u=4",
            "TE": "trailers"
		  },
		  data: data
		});
		console.log(r);
		result = JSON.parse(r.responseText);
        console.log(result.data.items);
		result.data.items.forEach(post=>{
			post.images.forEach(image=>{
				images.push(image);
			})
		});
		cursor = result.data.cursor;
	} while(result.data.items.length&&!onePage);

    console.log(images);
    dlimages(images);

async function dlimages(images) {
   let currentDownloads = 0;
   while (images.length > 0) {
      if (currentDownloads > 5) {
         await sleep(200);
         continue;
      }

      var item = images.shift();

      (function(_item) {
          const split = _item.url.split('.');
          const dl = {
            url: _item.url,
            name: userid+'/'+_item.id+'.'+split[split.length-1],
            saveAs: false,
            conflictAction: 'overwrite',
            onerror: function(error) {
               queue.unshift(_item);
               currentDownloads--;
            },
            onload: function() {
                const blob = new Blob([JSON.stringify(_item)], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);

                GM_download({
                    url: url,
                    name: userid+'/'+_item.id+'.json',
                    saveAs: false, // Prompts the user to choose a save location
                    conflictAction: 'overwrite',
                });
                currentDownloads--;
            }
         };
          console.log(dl);
         GM_download(dl);

         currentDownloads++;
      })(item);
   }
};

function sleep(ms) {
   return new Promise(resolve => setTimeout(resolve, ms));
}
}