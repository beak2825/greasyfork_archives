// ==UserScript==
// @name         Audible Multi-Region Search
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Search across multiple Audible regions at once and on MAM requests
// @author       You
// @match        https://www.audible.co.uk/*
// @match        https://www.audible.it/*
// @match        https://www.audible.de/*
// @match        https://www.audible.ca/*
// @match        https://www.audible.fr/*
// @match        https://www.audible.com.br/*
// @match        https://www.audible.es/*
// @match        https://www.audible.com/*
// @match        https://www.myanonamouse.net/tor/requests2.php*
// @match        https://www.myanonamouse.net/tor/viewRequest.php/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @connect      audible.co.uk
// @connect      audible.it
// @connect      audible.de
// @connect      audible.ca
// @connect      audible.fr
// @connect      audible.com.br
// @connect      audible.es
// @connect      audible.com
// @connect      audible.com.au
// @connect      audible.in
// @connect      audible.co.jp
// @downloadURL https://update.greasyfork.org/scripts/554379/Audible%20Multi-Region%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/554379/Audible%20Multi-Region%20Search.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // SVG Icons
  const svgIcons = {
    settings: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><g fill="none" fill-rule="evenodd"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.020-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="currentColor" d="M9.965 2.809a1.51 1.51 0 0 0-1.401-.203a10 10 0 0 0-2.982 1.725a1.51 1.51 0 0 0-.524 1.313c.075.753-.058 1.48-.42 2.106c-.361.627-.925 1.106-1.615 1.417a1.51 1.51 0 0 0-.875 1.113a10 10 0 0 0 0 3.44c.093.537.46.926.875 1.114c.69.31 1.254.79 1.616 1.416c.361.627.494 1.353.419 2.106c-.045.452.107.964.524 1.313a10 10 0 0 0 2.982 1.725a1.51 1.51 0 0 0 1.4-.203c.615-.442 1.312-.691 2.036-.691s1.42.249 2.035.691c.37.266.89.39 1.401.203a10 10 0 0 0 2.982-1.725c.417-.349.57-.86.524-1.313c-.075-.753.057-1.48.42-2.106c.361-.627.925-1.105 1.615-1.416c.414-.187.782-.577.875-1.114a10 10 0 0 0 0-3.44a1.51 1.51 0 0 0-.875-1.113c-.69-.311-1.254-.79-1.616-1.417c-.362-.626-.494-1.353-.419-2.106a1.51 1.51 0 0 0-.524-1.313a10 10 0 0 0-2.982-1.725a1.51 1.51 0 0 0-1.4.203C13.42 3.25 12.723 3.5 12 3.5s-1.42-.249-2.035-.691M9 12a3 3 0 1 1 6 0a3 3 0 0 1-6 0"/></g></svg>`,
    search: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="m18.031 16.617l4.283 4.282l-1.415 1.415l-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9s9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617m-2.006-.742A6.98 6.98 0 0 0 18 11c0-3.867-3.133-7-7-7s-7 3.133-7 7s3.133 7 7 7a6.98 6.98 0 0 0 4.875-1.975z"/></svg>`,
    globe: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="m18.031 16.617l4.283 4.282l-1.415 1.415l-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9s9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617m-2.006-.742A6.98 6.98 0 0 0 18 11c0-3.867-3.133-7-7-7s-7 3.133-7 7s3.133 7 7 7a6.98 6.98 0 0 0 4.875-1.975z"/></svg>`,
    bulkSearch: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><g fill="none" fill-rule="evenodd"><path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"/><path fill="currentColor" d="M10.5 2c.58 0 1.15.058 1.699.17a1 1 0 1 1-.398 1.96a6.5 6.5 0 1 0 5.069 7.671a1 1 0 1 1 1.96.398a8.5 8.5 0 0 1-1.457 3.303l-.197.26l3.652 3.652a1 1 0 0 1-1.32 1.498l-.094-.084l-3.652-3.652A8.5 8.5 0 1 1 10.5 2M19 1a1 1 0 0 1 .898.56l.048.117l.13.378a3 3 0 0 0 1.684 1.8l.185.07l.378.129a1 1 0 0 1 .118 1.844l-.118.048l-.378.13a3 3 0 0 0-1.8 1.684l-.07.185l-.129.378a1 1 0 0 1-1.844.117l-.048-.117l-.13-.378a3 3 0 0 0-1.684-1.8l-.185-.07l-.378-.129a1 1 0 0 1-.118-1.844l.118-.048l.378-.13a3 3 0 0 0 1.8-1.684l.07-.185l.129-.378A1 1 0 0 1 19 1m0 3.196a5 5 0 0 1-.804.804q.448.355.804.804q.355-.448.804-.804A5 5 0 0 1 19 4.196"/></g></svg>`,
    // Flag SVGs
    flagUS: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="15" viewBox="0 0 36 36"><path fill="#b22334" d="M35.445 7C34.752 5.809 33.477 5 32 5H18v2zM0 25h36v2H0zm18-8h18v2H18zm0-4h18v2H18zM0 21h36v2H0zm4 10h28c1.477 0 2.752-.809 3.445-2H.555c.693 1.191 1.968 2 3.445 2M18 9h18v2H18z"/><path fill="#eee" d="M.068 27.679q.025.14.059.277q.04.15.092.296c.089.259.197.509.333.743L.555 29h34.89l.002-.004a4 4 0 0 0 .332-.741a4 4 0 0 0 .152-.576c.041-.22.069-.446.069-.679H0c0 .233.028.458.068.679M0 23h36v2H0zm0-4v2h36v-2H18zm18-4h18v2H18zm0-4h18v2H18zM.555 7l-.003.005zM.128 8.044c.025-.102.06-.199.092-.297a4 4 0 0 0-.092.297M18 9h18c0-.233-.028-.459-.069-.68a3.6 3.6 0 0 0-.153-.576A4 4 0 0 0 35.445 7H18z"/><path fill="#3c3b6e" d="M18 5H4a4 4 0 0 0-4 4v10h18z"/><path fill="#fff" d="m2.001 7.726l.618.449l-.236.725L3 8.452l.618.448l-.236-.725L4 7.726h-.764L3 7l-.235.726zm2 2l.618.449l-.236.725l.617-.448l.618.448l-.236-.725L6 9.726h-.764L5 9l-.235.726zm4 0l.618.449l-.236.725l.617-.448l.618.448l-.236-.725l.618-.449h-.764L9 9l-.235.726zm4 0l.618.449l-.236.725l.617-.448l.618.448l-.236-.725l.618-.449h-.764L13 9l-.235.726zm-8 4l.618.449l-.236.725l.617-.448l.618.448l-.236-.725l.618-.449h-.764L5 13l-.235.726zm4 0l.618.449l-.236.725l.617-.448l.618.448l-.236-.725l.618-.449h-.764L9 13l-.235.726zm4 0l.618.449l-.236.725l.617-.448l.618.448l-.236-.725l.618-.449h-.764L13 13l-.235.726zm-6-6l.618.449l-.236.725L7 8.452l.618.448l-.236-.725L8 7.726h-.764L7 7l-.235.726zm4 0l.618.449l-.236.725l.617-.448l.618.448l-.236-.725l.618-.449h-.764L11 7l-.235.726zm4 0l.618.449l-.236.725l.617-.448l.618.448l-.236-.725l.618-.449h-.764L15 7l-.235.726zm-12 4l.618.449l-.236.725l.617-.448l.618.448l-.236-.725l.618-.449h-.764L3 11l-.235.726zM6.383 12.9L7 12.452l.618.448l-.236-.725l.618-.449h-.764L7 11l-.235.726h-.764l.618.449zm3.618-1.174l.618.449l-.236.725l.617-.448l.618.448l-.236-.725l.618-.449h-.764L11 11l-.235.726zm4 0l.618.449l-.236.725l.617-.448l.618.448l-.236-.725l.618-.449h-.764L15 11l-.235.726zm-12 4l.618.449l-.236.725l.617-.448l.618.448l-.236-.725l.618-.449h-.764L3 15l-.235.726zM6.383 16.9L7 16.452l.618.448l-.236-.725l.618-.449h-.764L7 15l-.235.726h-.764l.618.449zm3.618-1.174l.618.449l-.236.725l.617-.448l.618.448l-.236-.725l.618-.449h-.764L11 15l-.235.726zm4 0l.618.449l-.236.725l.617-.448l.618.448l-.236-.725l.618-.449h-.764L15 15l-.235.726z"/></svg>`,
    flagCA: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="15" viewBox="0 0 36 36"><path fill="#d52b1e" d="M4 5a4 4 0 0 0-4 4v18a4 4 0 0 0 4 4h6V5zm28 0h-6v26h6a4 4 0 0 0 4-4V9a4 4 0 0 0-4-4"/><path fill="#eee" d="M10 5h16v26H10z"/><path fill="#d52b1e" d="M18.615 22.113c1.198.139 2.272.264 3.469.401l-.305-1.002a.46.46 0 0 1 .159-.476l3.479-2.834l-.72-.339c-.317-.113-.23-.292-.115-.722l.531-1.936l-2.021.427c-.197.03-.328-.095-.358-.215l-.261-.911l-1.598 1.794c-.227.288-.687.288-.544-.376l.683-3.634l-.917.475c-.257.144-.514.168-.657-.089l-1.265-2.366v.059v-.059l-1.265 2.366c-.144.257-.401.233-.658.089l-.916-.475l.683 3.634c.144.664-.317.664-.544.376l-1.598-1.793l-.26.911c-.03.12-.162.245-.359.215l-2.021-.427l.531 1.936c.113.43.201.609-.116.722l-.72.339l3.479 2.834c.138.107.208.3.158.476l-.305 1.002l3.47-.401c.106 0 .176.059.175.181l-.214 3.704h.956l-.213-3.704c.002-.123.071-.182.177-.182"/></svg>`,
    flagAU: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="15" viewBox="0 0 36 36"><path fill="#00247d" d="M32 5H4q-.308 0-.604.045l-.004 1.754l-2.73-.004A4 4 0 0 0 0 9v18a4 4 0 0 0 4 4h28a4 4 0 0 0 4-4V9a4 4 0 0 0-4-4"/><path fill="#fff" d="m9 26.023l-1.222 1.129l.121-1.66l-1.645-.251l1.373-.94l-.829-1.443l1.591.488L9 21.797l.612 1.549l1.591-.488l-.83 1.443l1.374.94l-1.645.251l.121 1.66zM27.95 9.562l-.799.738l.079-1.086l-1.077-.164l.899-.615l-.542-.944l1.04.319l.4-1.013l.401 1.013l1.041-.319l-.543.944l.898.615l-1.076.164l.079 1.086zm-4 6l-.799.739l.079-1.086l-1.077-.164l.899-.616l-.542-.944l1.04.319l.4-1.013l.401 1.013l1.041-.319l-.543.944l.898.616l-1.076.164l.079 1.086zm9-2l-.799.739l.079-1.086l-1.077-.164l.899-.616l-.542-.944l1.04.319l.4-1.013l.401 1.013l1.041-.319l-.543.944l.898.616l-1.076.164l.079 1.086zm-5 14l-.799.739l.079-1.086l-1.077-.164l.899-.616l-.542-.944l1.04.319l.4-1.013l.401 1.013l1.041-.319l-.543.944l.898.616l-1.076.164l.079 1.086zM31 16l.294.596l.657.095l-.475.463l.112.655L31 17.5l-.588.309l.112-.655l-.475-.463l.657-.095z"/><path fill="#00247d" d="M19 18V5H4c-.32 0-.604.045-.604.045l-.004 1.754l-2.73-.004S.62 6.854.535 7A4 4 0 0 0 0 9v9z"/><path fill="#eee" d="M19 5h-2.331L12 8.269V5H7v2.569L3.396 5.045a3.94 3.94 0 0 0-1.672.665L6.426 9H4.69L.967 6.391a4 4 0 0 0-.305.404L3.813 9H0v5h3.885L0 16.766V18h3.332L7 15.432V18h5v-3.269L16.668 18H19v-2.029L16.185 14H19V9h-2.814L19 7.029z"/><path fill="#cf1b2b" d="M11 5H8v5H0v3h8v5h3v-5h8v-3h-8z"/><path fill="#cf1b2b" d="M19 5h-1.461L12 8.879V9h1.571L19 5.198zm-17.276.71a4 4 0 0 0-.757.681L4.69 9h1.735zM6.437 14L.734 18h1.727L7 14.822V14zM19 17.802v-1.22L15.313 14H13.57z"/></svg>`,
    flagIN: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="15" viewBox="0 0 36 36"><path fill="#138808" d="M0 27a4 4 0 0 0 4 4h28a4 4 0 0 0 4-4v-5H0z"/><path fill="#f93" d="M36 14V9a4 4 0 0 0-4-4H4a4 4 0 0 0-4 4v5z"/><path fill="#f7f7f7" d="M0 13.667h36v8.667H0z"/><circle cx="18" cy="18" r="4" fill="#000080"/><circle cx="18" cy="18" r="3.375" fill="#f7f7f7"/><path fill="#6666b3" d="m18.1 16.75l-.1.65l-.1-.65l.1-1.95zm-.928-1.841l.408 1.909l.265.602l-.072-.653zm-.772.32l.888 1.738l.412.513l-.238-.613zm-.663.508l1.308 1.45l.531.389l-.389-.531zm-.508.663l1.638 1.062l.613.238l-.513-.412zm-.32.772l1.858.601l.653.072l-.602-.265zM14.8 18l1.95.1l.65-.1l-.65-.1zm.109.828l1.909-.408l.602-.265l-.653.072zm.32.772l1.738-.888l.513-.412l-.613.238zm.508.663l1.45-1.308l.389-.531l-.531.389zm.663.508l1.062-1.638l.238-.613l-.412.513zm.772.32l.601-1.858l.072-.653l-.265.602zM18 21.2l.1-1.95l-.1-.65l-.1.65zm.828-.109l-.408-1.909l-.265-.602l.072.653zm.772-.32l-.888-1.738l-.412-.513l.238.613zm.663-.508l-1.308-1.45l-.531-.389l.389.531zm.508-.663l-1.638-1.062l-.613-.238l.513.412zm.32-.772l-1.858-.601l-.653-.072l.602.265zM21.2 18l-1.95-.1l-.65.1l.65.1zm-.109-.828l-1.909.408l-.602.265l.653-.072zm-.32-.772l-1.738.888l-.513.412l.613-.238zm-.508-.663l-1.45 1.308l-.389.531l.531-.389zm-.663-.508l-1.062 1.638l-.238.613l.412-.513zm-.772-.32l-.601 1.858l-.072.653l.265-.602z"/><g fill="#000080"><circle cx="17.56" cy="14.659" r=".2"/><circle cx="16.71" cy="14.887" r=".2"/><circle cx="15.948" cy="15.326" r=".2"/><circle cx="15.326" cy="15.948" r=".2"/><circle cx="14.887" cy="16.71" r=".2"/><circle cx="14.659" cy="17.56" r=".2"/><circle cx="14.659" cy="18.44" r=".2"/><circle cx="14.887" cy="19.29" r=".2"/><circle cx="15.326" cy="20.052" r=".2"/><circle cx="15.948" cy="20.674" r=".2"/><circle cx="16.71" cy="21.113" r=".2"/><circle cx="17.56" cy="21.341" r=".2"/><circle cx="18.44" cy="21.341" r=".2"/><circle cx="19.29" cy="21.113" r=".2"/><circle cx="20.052" cy="20.674" r=".2"/><circle cx="20.674" cy="20.052" r=".2"/><circle cx="21.113" cy="19.29" r=".2"/><circle cx="21.341" cy="18.44" r=".2"/><circle cx="21.341" cy="17.56" r=".2"/><circle cx="21.113" cy="16.71" r=".2"/><circle cx="20.674" cy="15.948" r=".2"/><circle cx="20.052" cy="15.326" r=".2"/><circle cx="19.29" cy="14.887" r=".2"/><circle cx="18.44" cy="14.659" r=".2"/><circle cx="18" cy="18" r=".9"/></g></svg>`,
    flagBR: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="15" viewBox="0 0 36 36"><path fill="#009b3a" d="M36 27a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V9a4 4 0 0 1 4-4h28a4 4 0 0 1 4 4z"/><path fill="#fedf01" d="M32.728 18L18 29.124L3.272 18L18 6.875z"/><circle cx="17.976" cy="17.924" r="6.458" fill="#002776"/><path fill="#cbe9d4" d="M12.277 14.887a6.4 6.4 0 0 0-.672 2.023c3.995-.29 9.417 1.891 11.744 4.595c.402-.604.7-1.28.883-2.004c-2.872-2.808-7.917-4.63-11.955-4.614"/><path fill="#88c9f9" d="M12 18.233h1v1h-1zm1 2h1v1h-1z"/><path fill="#55acee" d="M15 18.233h1v1h-1zm2 1h1v1h-1zm4 2h1v1h-1zm-3 1h1v1h-1zm3-6h1v1h-1z"/><path fill="#3b88c3" d="M19 20.233h1v1h-1z"/></svg>`,
    flagJP: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="15" viewBox="0 0 36 36"><path fill="#eee" d="M36 27a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V9a4 4 0 0 1 4-4h28a4 4 0 0 1 4 4z"/><circle cx="18" cy="18" r="7" fill="#ed1b2f"/></svg>`,
    flagIT: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="15" viewBox="0 0 36 36"><path fill="#ce2b37" d="M36 27a4 4 0 0 1-4 4h-8V5h8a4 4 0 0 1 4 4z"/><path fill="#009246" d="M4 5a4 4 0 0 0-4 4v18a4 4 0 0 0 4 4h8V5z"/><path fill="#eee" d="M12 5h12v26H12z"/></svg>`,
    flagFR: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="15" viewBox="0 0 36 36"><path fill="#ed2939" d="M36 27a4 4 0 0 1-4 4h-8V5h8a4 4 0 0 1 4 4z"/><path fill="#002495" d="M4 5a4 4 0 0 0-4 4v18a4 4 0 0 0 4 4h8V5z"/><path fill="#eee" d="M12 5h12v26H12z"/></svg>`,
    flagES: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="15" viewBox="0 0 36 36"><path fill="#c60a1d" d="M36 27a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V9a4 4 0 0 1 4-4h28a4 4 0 0 1 4 4z"/><path fill="#ffc400" d="M0 12h36v12H0z"/><path fill="#ea596e" d="M9 17v3a3 3 0 1 0 6 0v-3z"/><path fill="#f4a2b2" d="M12 16h3v3h-3z"/><path fill="#dd2e44" d="M9 16h3v3H9z"/><ellipse cx="12" cy="14.5" fill="#ea596e" rx="3" ry="1.5"/><ellipse cx="12" cy="13.75" fill="#ffac33" rx="3" ry=".75"/><path fill="#99aab5" d="M7 16h1v7H7zm9 0h1v7h-1z"/><path fill="#66757f" d="M6 22h3v1H6zm9 0h3v1h-3zm-8-7h1v1H7zm9 0h1v1h-1z"/></svg>`,
    flagUK: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="15" viewBox="0 0 36 36"><path fill="#00247d" d="M0 9.059V13h5.628zM4.664 31H13v-5.837zM23 25.164V31h8.335zM0 23v3.941L5.63 23zM31.337 5H23v5.837zM36 26.942V23h-5.631zM36 13V9.059L30.371 13zM13 5H4.664L13 10.837z"/><path fill="#cf1b2b" d="m25.14 23l9.712 6.801a4 4 0 0 0 .99-1.749L28.627 23zM13 23h-2.141l-9.711 6.8c.521.53 1.189.909 1.938 1.085L13 23.943zm10-10h2.141l9.711-6.8a4 4 0 0 0-1.937-1.085L23 12.057zm-12.141 0L1.148 6.2a4 4 0 0 0-.991 1.749L7.372 13z"/><path fill="#eee" d="M36 21H21v10h2v-5.836L31.335 31H32a4 4 0 0 0 2.852-1.199L25.14 23h3.487l7.215 5.052c.093-.337.158-.686.158-1.052v-.058L30.369 23H36zM0 21v2h5.63L0 26.941V27c0 1.091.439 2.078 1.148 2.8l9.711-6.8H13v.943l-9.914 6.941c.294.07.598.116.914.116h.664L13 25.163V31h2V21zM36 9a3.98 3.98 0 0 0-1.148-2.8L25.141 13H23v-.943l9.915-6.942A4 4 0 0 0 32 5h-.663L23 10.837V5h-2v10h15v-2h-5.629L36 9.059zM13 5v5.837L4.664 5H4a4 4 0 0 0-2.852 1.2l9.711 6.8H7.372L.157 7.949A4 4 0 0 0 0 9v.059L5.628 13H0v2h15V5z"/><path fill="#cf1b2b" d="M21 15V5h-6v10H0v6h15v10h6V21h15v-6z"/></svg>`,
    flagDE: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="15" viewBox="0 0 36 36"><path fill="#ffcd05" d="M0 27a4 4 0 0 0 4 4h28a4 4 0 0 0 4-4v-4H0z"/><path fill="#ed1f24" d="M0 14h36v9H0z"/><path fill="#141414" d="M32 5H4a4 4 0 0 0-4 4v5h36V9a4 4 0 0 0-4-4"/></svg>`,
  };

  // Icon helper function
  function getIcon(iconName) {
    return svgIcons[iconName] || '?';
  }

  // Audible regions configuration - all available regions
  const allRegions = [
    // Americas
    { code: 'US', domain: 'audible.com', flag: getIcon('flagUS'), currency: '$', name: 'United States (English)', language: 'English', languageCode: 'en' },
    { code: 'CA', domain: 'audible.ca/en_CA', flag: getIcon('flagCA'), currency: 'CAD', name: 'Canada (English)', language: 'English', languageCode: 'en' },
    { code: 'BR', domain: 'audible.com.br', flag: getIcon('flagBR'), currency: 'R$', name: 'Brazil', language: 'Português', languageCode: 'pt' },

    // Europe
    { code: 'UK', domain: 'audible.co.uk', flag: getIcon('flagUK'), currency: '£', name: 'UK (English)', language: 'English', languageCode: 'en' },
    { code: 'DE', domain: 'audible.de', flag: getIcon('flagDE'), currency: '€', name: 'Deutschland (Deutsch)', language: 'Deutsch', languageCode: 'de' },
    { code: 'FR', domain: 'audible.fr', flag: getIcon('flagFR'), currency: '€', name: 'France (Français)', language: 'Français', languageCode: 'fr' },
    { code: 'IT', domain: 'audible.it', flag: getIcon('flagIT'), currency: '€', name: 'Italia (Italiano)', language: 'Italiano', languageCode: 'it' },
    { code: 'ES', domain: 'audible.es', flag: getIcon('flagES'), currency: '€', name: 'España (Castellano)', language: 'Español', languageCode: 'es' },

    // Asia & Pacific
    { code: 'AU', domain: 'audible.com.au', flag: getIcon('flagAU'), currency: 'AUD', name: 'Australia (English)', language: 'English', languageCode: 'en' },
    { code: 'IN', domain: 'audible.in', flag: getIcon('flagIN'), currency: 'INR', name: 'India (English)', language: 'English', languageCode: 'en' },
    { code: 'JP', domain: 'audible.co.jp', flag: getIcon('flagJP'), currency: '¥', name: '日本 (日本語)', language: '日本語', languageCode: 'ja' },
  ];

  // Default regions (most commonly used)
  const defaultSelectedRegions = ['US', 'UK', 'CA', 'DE', 'FR', 'IT', 'ES', 'AU'];

  // Helper function to check if a language is not English
  function isNonEnglishLanguage(region) {
    return region.languageCode !== 'en';
  }

  // Helper function to normalize language names to English
  function normalizeLanguageToEnglish(languageName) {
    if (!languageName) return '';

    const languageMap = {
      // English variants
      english: 'English',
      inglese: 'English',
      inglés: 'English',
      anglais: 'English',
      englisch: 'English',
      engels: 'English',

      // Spanish variants
      español: 'Spanish',
      spanish: 'Spanish',
      espagnol: 'Spanish',
      spanisch: 'Spanish',
      spaans: 'Spanish',
      castellano: 'Spanish',

      // French variants
      français: 'French',
      french: 'French',
      francese: 'French',
      französisch: 'French',
      frans: 'French',

      // German variants
      deutsch: 'German',
      german: 'German',
      tedesco: 'German',
      allemand: 'German',
      duits: 'German',

      // Italian variants
      italiano: 'Italian',
      italian: 'Italian',
      italien: 'Italian',
      italienisch: 'Italian',
      italiaans: 'Italian',

      // Portuguese variants
      português: 'Portuguese',
      portuguese: 'Portuguese',
      portoghese: 'Portuguese',
      portugais: 'Portuguese',
      portugees: 'Portuguese',

      // Japanese variants
      日本語: 'Japanese',
      japanese: 'Japanese',
      japonais: 'Japanese',
      japanisch: 'Japanese',
      giapponese: 'Japanese',
      japans: 'Japanese',

      // Chinese variants
      中文: 'Chinese',
      chinese: 'Chinese',
      chinois: 'Chinese',
      chinesisch: 'Chinese',
      cinese: 'Chinese',
      chinees: 'Chinese',

      // Russian variants
      русский: 'Russian',
      russian: 'Russian',
      russe: 'Russian',
      russisch: 'Russian',
      russo: 'Russian',
      russisch: 'Russian',

      // Dutch variants
      nederlands: 'Dutch',
      dutch: 'Dutch',
      néerlandais: 'Dutch',
      niederländisch: 'Dutch',
      olandese: 'Dutch',

      // Korean variants
      한국어: 'Korean',
      korean: 'Korean',
      coréen: 'Korean',
      koreanisch: 'Korean',
      coreano: 'Korean',

      // Polish variants
      polski: 'Polish',
      polish: 'Polish',
      polonais: 'Polish',
      polnisch: 'Polish',
      polacco: 'Polish',

      // Swedish variants
      svenska: 'Swedish',
      swedish: 'Swedish',
      suédois: 'Swedish',
      schwedisch: 'Swedish',
      svedese: 'Swedish',

      // Norwegian variants
      norsk: 'Norwegian',
      norwegian: 'Norwegian',
      norvégien: 'Norwegian',
      norwegisch: 'Norwegian',
      norvegese: 'Norwegian',

      // Danish variants
      dansk: 'Danish',
      danish: 'Danish',
      danois: 'Danish',
      dänisch: 'Danish',
      danese: 'Danish',

      // Finnish variants
      suomi: 'Finnish',
      finnish: 'Finnish',
      finnois: 'Finnish',
      finnisch: 'Finnish',
      finlandese: 'Finnish',
    };

    const normalized = languageMap[languageName.toLowerCase()];
    return normalized || languageName; // Return original if not found in map
  }

  // Add custom CSS
  GM_addStyle(`
    @import url('https://fonts.googleapis.com/css2?family=Momo+Trust+Sans:wght@400;700&display=swap');
    
    a.torTitle.torTitle {
    display: inline;
    }
        #multi-region-search-widget {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 400px;
            background: #232f3e;
            border: 2px solid #ff9900;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            color: white;
            font-family: 'Momo Trust Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            font-size: 14px;
            max-height: 80vh;
            overflow-y: auto;
        }

        #multi-region-search-widget h3 {
            margin: 0 0 15px 0;
            color: #ff9900;
            font-size: 14px;
            text-align: center;
            font-weight: normal;
        }

        #multi-region-search-input {
            width: 100%;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 14px;
            box-sizing: border-box;
        }

        #multi-region-search-btn {
            width: 100%;
            padding: 8px;
            background: #ff9900;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            margin-top: 10px;
        }

        #multi-region-search-btn:hover {
            background: #e68a00;
        }

        #multi-region-search-btn:disabled {
            background: #666;
            cursor: not-allowed;
        }

        .region-results {
            margin-top: 15px;
            border-top: 1px solid #444;
            padding-top: 10px;
        }

        .region-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            margin-bottom: 8px;
            font-weight: bold;
            color: #ff9900;
        }

        .region-header a {
            transition: all 0.2s ease;
            border-radius: 4px;
            padding: 4px 8px;
            flex: 1;
        }

        .region-header a:hover {
            background-color: rgba(255, 153, 0, 0.1);
            transform: translateY(-1px);
            text-decoration: none !important;
        }

        .region-loading {
            color: #ccc;
            font-style: italic;
            flex-shrink: 0;
        }

        .region-error {
            color: #ff6b6b;
            font-style: italic;
        }

        .book-result {
            background: #2a3547;
            margin: 3px 0;
            padding: 6px 8px;
            border-radius: 4px;
            border-left: 3px solid #ff9900;
            transition: background-color 0.2s ease;
        }

        .book-result.plus-available {
            background: #1a4d3a;
            border-left: 3px solid #00d4aa;
            box-shadow: 0 0 8px rgba(0, 212, 170, 0.2);
        }

        .book-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 8px;
            margin-bottom: 2px;
        }

        .book-title {
            font-weight: bold;
            flex: 1;
        }

        .book-price-container {
            flex-shrink: 0;
            text-align: right;
        }

        .book-author-narrator {
            font-size: 11px;
            margin-top: 4px;
            display: flex;
            flex-direction: column;
            gap: 2px;
        }

        .book-title a {
            color: #fff;
            text-decoration: none;
            font-size: 13px;
        }

        .book-title a:hover {
            color: #ff9900;
            text-decoration: underline;
        }

        .book-result.plus-available .book-title a {
            color: #e8f5f1;
        }

        .book-result.plus-available .book-title a:hover {
            color: #00d4aa;
        }

        .book-author {
            color: #7cb7ffff;
            font-size: 11px;
            font-weight: normal;
        }

        .book-narrator {
            color: #ffd700;
            font-size: 11px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 4px;
        }

        .book-narrator::before {
            content: "🎙";
            font-size: 10px;
        }

        .book-result.plus-available .book-author {
            color: #7dd3fc;
        }

        .book-result.plus-available .book-narrator {
            color: #ffd700;
        }

        .book-price {
            color: #00d4aa;
            font-weight: bold;
            font-size: 11px;
        }

        .book-result.plus-available .book-price {
            color: #7fded1;
        }

        .plus-indicator {
            display: inline-block;
            background: #00d4aa;
            color: #1a4d3a;
            font-size: 9px;
            font-weight: bold;
            padding: 1px 4px;
            border-radius: 2px;
            text-transform: uppercase;
        }

        .plus-indicator::before {
            content: "✓ ";
        }

        .language-indicator {
            display: inline-block;
            background: #6366f1;
            color: white;
            font-size: 9px;
            font-weight: bold;
            padding: 2px 6px;
            border-radius: 3px;
            margin-left: 8px;
            text-transform: capitalize;
        }

        .book-result.plus-available .language-indicator {
            background: #3b82f6;
        }

        .close-btn {
            position: absolute;
            top: 5px;
            right: 10px;
            background: none;
            border: none;
            color: #ccc;
            font-size: 18px;
            cursor: pointer;
            padding: 0;
            width: 20px;
            height: 20px;
        }

        .close-btn:hover {
            color: #ff9900;
        }

        .toggle-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff9900;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 10px 15px;
            cursor: pointer;
            z-index: 9999;
            font-size: 14px;
        }

        .toggle-btn:hover {
            background: #e68a00;
        }

        .no-results {
            color: #ccc;
            font-style: italic;
            text-align: center;
            padding: 10px;
        }

        .settings-icon {
            position: absolute;
            top: 8px;
            left: 8px;
            background: none;
            border: none;
            color: #ff9900;
            font-size: 18px;
            cursor: pointer;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            transition: all 0.3s ease;
        }

        .settings-icon:hover {
            background: rgba(255, 153, 0, 0.1);
        }

        .settings-icon.active {
            background: rgba(255, 153, 0, 0.4);
            box-shadow: 0 0 12px rgba(255, 153, 0, 0.6), inset 0 0 8px rgba(255, 153, 0, 0.3);
            transform: rotate(45deg);
            color: #ffb84d;
        }

        .settings-section {
            margin: 15px 0 10px 0;
            padding: 10px;
            background: #1a2332;
            border-radius: 4px;
            border: 1px solid #444;
            max-height: 150px;
            overflow-y: auto;
        }

        .region-checkbox {
            display: flex;
            align-items: center;
            margin: 3px 0;
            font-size: 12px;
        }

        .region-checkbox input[type="checkbox"] {
            margin-right: 6px;
        }

        .region-checkbox label {
            color: #ccc;
            cursor: pointer;
            flex: 1;
        }

        .settings-buttons {
            margin-top: 8px;
            display: flex;
            gap: 8px;
        }

        .settings-btn {
            padding: 4px 8px;
            background: #444;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            font-size: 11px;
        }

        .settings-btn:hover {
            background: #555;
        }

        .priority-regions {
            // border-left: 3px solid #00d4aa;
            // background: #1a4d3a;
        }

        .svg-icon {
            display: inline-block;
            vertical-align: middle;
            width: 16px;
            height: 16px;
        }

        .mam-search-btn {
            background: transparent !important;
            border: 1px solid rgb(255, 153, 0) !important;
            color: #fff !important;
            padding: 2px 3px !important;
            margin-right: 8px !important;
            font-size: 12px !important;
            border-radius: 3px !important;
            cursor: pointer !important;
        }

        .mam-search-btn:hover {
            background: #444 !important;
            color: white !important;
        }

        .mam-bulk-search-btn {
            position: fixed;
            top: 10px;
            right: 20px;
            background: #ff9900 !important;
            border: 1px solid #ff9900 !important;
            color: white !important;
            padding: 8px 12px !important;
            font-size: 12px !important;
            border-radius: 4px !important;
            cursor: pointer !important;
            z-index: 9998;
            transition: background-color 0.2s ease;
            display: inline-flex;
            align-items: center;
            column-gap: 4px;
        }
        .mam-bulk-search-btn svg {
            height: 20px;
            width: 20px;
        } 
        .mam-bulk-search-btn:hover {
            background: #e68a00 !important;
        }

        .mam-bulk-search-btn:disabled {
            background: #666 !important;
            cursor: not-allowed !important;
        }

        .mam-progress-indicator {
            position: fixed;
            top: 60px;
            right: 20px;
            background: #232f3e;
            border: 1px solid #ff9900;
            border-radius: 4px;
            padding: 10px;
            color: white;
            font-size: 12px;
            z-index: 9998;
            display: none;
            max-width: 300px;
        }

        .mam-results-container {
            position: fixed;
            top: 170px;
            right: 20px;
            background: #232f3e;
            border: 1px solid #ff9900;
            border-radius: 4px;
            padding: 15px;
            color: white;
            font-size: 12px;
            z-index: 9998;
            display: none;
            max-width: 400px;
            max-height: 400px;
            overflow-y: auto;
        }

        .mam-results-header {
            color: #ff9900;
            font-weight: bold;
            margin-bottom: 10px;
            padding-bottom: 5px;
            border-bottom: 1px solid #444;
        }

        .mam-result-item {
            background: #1a4d3a;
            margin: 5px 0;
            padding: 8px;
            border-radius: 4px;
            border-left: 3px solid #00d4aa;
        }

        .mam-result-title {
            font-weight: bold;
            color: #e8f5f1;
            margin-bottom: 3px;
        }

        .mam-result-details {
            font-size: 11px;
            color: #ccc;
        }

        .mam-close-results {
            position: absolute;
            top: 5px;
            right: 10px;
            background: none;
            border: none;
            color: #ccc;
            font-size: 16px;
            cursor: pointer;
        }

        .mam-close-results:hover {
            color: #ff9900;
        }
    `);

  let isWidgetVisible = false;
  let widget = null;
  let toggleBtn = null;

  // Settings management
  function getSelectedRegions() {
    // For MAM page, check for bulk search selections first
    if (window.location.hostname === 'www.myanonamouse.net' && window.location.pathname === '/tor/requests2.php') {
      try {
        const mamSaved = localStorage.getItem('mam-selected-regions');
        if (mamSaved) {
          const parsed = JSON.parse(mamSaved);
          return parsed;
        }
      } catch (e) {
        console.error('[Audible Search] Error loading from MAM localStorage:', e);
      }
    }

    // For Audible pages or if no MAM selection, use GM_getValue (Tampermonkey storage)
    try {
      const saved = GM_getValue('audible-search-regions', null);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed;
      }
    } catch (e) {
      console.error('[Audible Search] Error loading from Tampermonkey storage:', e);
    }
    return defaultSelectedRegions;
  }

  function saveSelectedRegions(regions) {
    try {
      // Save to both GM (Tampermonkey) and localStorage (for MAM page)
      GM_setValue('audible-search-regions', JSON.stringify(regions));
      localStorage.setItem('mam-selected-regions', JSON.stringify(regions));
      console.log(`[Audible Search] Saved ${regions.length} selected regions:`, regions);
    } catch (e) {
      console.error('Error saving selected regions:', e);
    }
  }

  function getActiveRegions() {
    const selectedCodes = getSelectedRegions();
    return allRegions.filter((region) => selectedCodes.includes(region.code));
  }

  // Create toggle button
  function createToggleButton() {
    toggleBtn = document.createElement('button');
    toggleBtn.className = 'toggle-btn';
    toggleBtn.innerHTML = `${getIcon('search')} Multi-Region Search`;
    toggleBtn.onclick = toggleWidget;
    document.body.appendChild(toggleBtn);
  }

  // Create the search widget
  function createWidget() {
    widget = document.createElement('div');
    widget.id = 'multi-region-search-widget';
    widget.style.display = 'none';

    widget.innerHTML = `
            <button class="close-btn">×</button>
            <button class="settings-icon" id="settings-toggle">${getIcon('settings')}</button>
            <h3>Audible Multi-Region Search</h3>

            <div class="settings-section" style="display: none;" id="settings-section">
                <div id="region-checkboxes"></div>
                <div class="settings-buttons">
                    <button class="settings-btn" id="select-all-btn">Select All</button>
                    <button class="settings-btn" id="select-default-btn">Default</button>
                    <button class="settings-btn" id="clear-all-btn">Clear All</button>
                </div>
            </div>

            <input type="text" id="multi-region-search-input" placeholder="Enter book title, author, or keywords...">
            <button id="multi-region-search-btn">Search Selected Regions</button>
            <div id="search-results"></div>
        `;

    document.body.appendChild(widget);

    // Initialize settings
    const selectedRegions = getSelectedRegions();
    createRegionCheckboxes();
    updateSearchButtonText();

    // Add event listeners
    document.getElementById('multi-region-search-btn').onclick = performSearch;
    document.getElementById('multi-region-search-input').onkeypress = function (e) {
      if (e.key === 'Enter') performSearch();
    };

    // Settings event listeners
    document.querySelector('.close-btn').onclick = function () {
      widget.style.display = 'none';
      toggleBtn.style.display = 'block';
    };

    document.getElementById('settings-toggle').onclick = toggleSettings;
    document.getElementById('select-all-btn').onclick = selectAllRegions;
    document.getElementById('select-default-btn').onclick = selectDefaultRegions;
    document.getElementById('clear-all-btn').onclick = clearAllRegions;
  }

  // Settings UI functions
  function toggleSettings() {
    const section = document.getElementById('settings-section');
    const settingsIcon = document.getElementById('settings-toggle');

    if (section.style.display === 'none') {
      section.style.display = 'block';
      settingsIcon.classList.add('active');
    } else {
      section.style.display = 'none';
      settingsIcon.classList.remove('active');
    }
  }

  function createRegionCheckboxes() {
    const container = document.getElementById('region-checkboxes');
    const selectedRegions = getSelectedRegions();

    container.innerHTML = allRegions
      .map(
        (region) => `
            <div class="region-checkbox">
                <input type="checkbox" id="region-${region.code}" class="region-checkbox-input"
                       ${selectedRegions.includes(region.code) ? 'checked' : ''}>
                <label for="region-${region.code}">${region.flag} ${region.name}</label>
            </div>
        `
      )
      .join('');

    // Add event listeners to all checkboxes
    container.querySelectorAll('.region-checkbox-input').forEach((checkbox) => {
      checkbox.addEventListener('change', onRegionCheckboxChange);
    });
  }

  function onRegionCheckboxChange() {
    // Auto-save when any checkbox changes
    updateRegionSelection();
  }

  function updateRegionSelection() {
    const selectedRegions = [];
    allRegions.forEach((region) => {
      const checkbox = document.getElementById(`region-${region.code}`);
      if (checkbox && checkbox.checked) {
        selectedRegions.push(region.code);
      }
    });
    saveSelectedRegions(selectedRegions);
    updateSearchButtonText();
  }

  function updateSearchButtonText() {
    const btn = document.getElementById('multi-region-search-btn');
    const activeRegions = getActiveRegions();
    if (btn) {
      btn.textContent = `Search ${activeRegions.length} Region${activeRegions.length !== 1 ? 's' : ''}`;
    }
  }

  function selectAllRegions() {
    allRegions.forEach((region) => {
      const checkbox = document.getElementById(`region-${region.code}`);
      if (checkbox) checkbox.checked = true;
    });
    updateRegionSelection();
  }

  function selectDefaultRegions() {
    allRegions.forEach((region) => {
      const checkbox = document.getElementById(`region-${region.code}`);
      if (checkbox) {
        checkbox.checked = defaultSelectedRegions.includes(region.code);
      }
    });
    updateRegionSelection();
  }

  function clearAllRegions() {
    allRegions.forEach((region) => {
      const checkbox = document.getElementById(`region-${region.code}`);
      if (checkbox) checkbox.checked = false;
    });
    updateRegionSelection();
  }

  // Toggle widget visibility
  function toggleWidget() {
    if (isWidgetVisible) {
      widget.style.display = 'none';
      toggleBtn.style.display = 'block';
    } else {
      widget.style.display = 'block';
      toggleBtn.style.display = 'none';

      // If on an Audible book detail page, auto-fill search field with current book
      if (window.location.hostname.includes('audible.') && window.location.pathname.startsWith('/pd/')) {
        const searchInput = document.getElementById('multi-region-search-input');
        if (searchInput && !searchInput.value) {
          const bookInfo = extractAudibleBookInfo();
          if (bookInfo) {
            searchInput.value = bookInfo;
            searchInput.focus();
            // Auto-trigger search
            setTimeout(performSearch, 100);
          }
        }
      }
    }
    isWidgetVisible = !isWidgetVisible;
  }

  // Extract book title and author from Audible page
  function extractAudibleBookInfo() {
    let bookTitle = null;
    let bookAuthor = null;

    // Method 1: Try to get data from the JSON in adbl-product-metadata
    try {
      const metadataElement = document.querySelector('adbl-product-metadata script[type="application/json"]');
      if (metadataElement) {
        const metadata = JSON.parse(metadataElement.textContent);
        if (metadata.authors && metadata.authors.length > 0) {
          // Get all authors, comma-separated
          bookAuthor = metadata.authors.map(author => author.name).join(', ');
        }
      }
    } catch (e) {
      console.log('Could not parse metadata JSON:', e);
    }

    // Get title using existing methods
    // Method 2: Look for h1 in page content
    let h1 = document.querySelector('h1');
    if (h1) {
      bookTitle = h1.textContent.trim();
    }

    // Method 3: Look for all span elements and find one that looks like a title
    if (!bookTitle) {
      const spans = document.querySelectorAll('span');
      for (const span of spans) {
        const text = span.textContent.trim();
        // Check if this span looks like a title (not too short, not too long)
        if (text.length > 10 && text.length < 200 && !text.includes('@') && !text.includes('submitted')) {
          const style = window.getComputedStyle(span);
          // Check if it's styled like a title (larger font)
          if (parseInt(style.fontSize) > 18) {
            bookTitle = text;
            break;
          }
        }
      }
    }

    // Fallback author methods if JSON didn't work
    if (!bookAuthor) {
      // For author, look within the authors-narrators section specifically
      const authorsSection = document.querySelector('[data-testid="authors-narrators"]');
      
      if (authorsSection) {
        // Get the first link which should be the author
        const authorLink = authorsSection.querySelector('a');
        if (authorLink) {
          bookAuthor = authorLink.textContent.trim();
        }
      }
    }

    // Final fallback if author not found
    if (!bookAuthor) {
      const authorLink = document.querySelector('a[href*="/author/"]');
      if (authorLink) {
        bookAuthor = authorLink.textContent.trim();
      }
    }

    if (bookTitle) {
      return bookAuthor ? `${bookTitle} ${bookAuthor}` : bookTitle;
    }

    return null;
  }

  // Perform search across selected regions
  function performSearch() {
    const query = document.getElementById('multi-region-search-input').value.trim();
    if (!query) return;

    const activeRegions = getActiveRegions();
    if (activeRegions.length === 0) {
      alert('Please select at least one region to search.');
      return;
    }

    const searchBtn = document.getElementById('multi-region-search-btn');
    const resultsDiv = document.getElementById('search-results');

    searchBtn.disabled = true;
    searchBtn.textContent = 'Searching...';
    resultsDiv.innerHTML = '';

    // Track regions with Plus results for reordering
    const regionResults = [];
    let completedSearches = 0;

    // Search each selected region
    activeRegions.forEach((region) => {
      searchRegion(region, query).then((results) => {
        regionResults.push({ region, results });
        completedSearches++;

        if (completedSearches === activeRegions.length) {
          // Sort results: regions with results first (Plus prioritized), then regions with no results at bottom
          const sortedResults = regionResults.sort((a, b) => {
            const aHasResults = a.results.results && a.results.results.length > 0;
            const bHasResults = b.results.results && b.results.results.length > 0;

            // If one has results and the other doesn't, prioritize the one with results
            if (aHasResults && !bHasResults) return -1;
            if (!aHasResults && bHasResults) return 1;

            // If both have no results, keep original order
            if (!aHasResults && !bHasResults) return 0;

            // If both have results, prioritize Plus availability
            const aHasPlus = a.results.results.some((book) => book.isPlusAvailable);
            const bHasPlus = b.results.results.some((book) => book.isPlusAvailable);

            if (aHasPlus && !bHasPlus) return -1;
            if (!aHasPlus && bHasPlus) return 1;
            return 0; // Keep original order for regions with same Plus status
          });

          // Display results in sorted order
          sortedResults.forEach(({ region, results }) => {
            const hasPlus = results.results && results.results.some((book) => book.isPlusAvailable);
            const regionDiv = document.createElement('div');
            regionDiv.className = `region-results${hasPlus ? ' priority-regions' : ''}`;

            // Create Audible search URL for this region
            const baseUrl = region.domain.includes('/') ? `https://www.${region.domain}` : `https://www.${region.domain}`;
            const audibleSearchUrl = `${baseUrl}/search?keywords=${encodeURIComponent(query)}`;

            regionDiv.innerHTML = `
                            <div class="region-header">
                                <a href="${audibleSearchUrl}" target="_blank" style="text-decoration: none; color: inherit; display: flex; align-items: center; gap: 8px;">
                                    <span>${region.flag}</span>
                                    <span>Audible ${region.code}</span>
                                </a>
                                <span class="region-loading">Processing...</span>
                            </div>
                            <div id="results-${region.code}"></div>
                        `;
            resultsDiv.appendChild(regionDiv);
            displayRegionResults(region, results);
          });

          searchBtn.disabled = false;
          updateSearchButtonText();
        }
      });
    });
  }

  // Search a specific region
  function searchRegion(region, query) {
    return new Promise((resolve) => {
      // Use HTML scraping only
      searchRegionHTML(region, query)
        .then((results) => {
          resolve(results);
        })
        .catch((error) => {
          resolve({ error: 'Search failed' });
        });
    });
  }

  // Search using HTML scraping (fallback)
  function searchRegionHTML(region, query) {
    return new Promise((resolve) => {
      // Handle different domain formats
      const baseUrl = region.domain.includes('/') ? `https://www.${region.domain}` : `https://www.${region.domain}`;
      const searchUrl = `${baseUrl}/search?keywords=${encodeURIComponent(query)}`;
      GM_xmlhttpRequest({
        method: 'GET',
        url: searchUrl,
        onload: function (response) {
          try {
            const results = parseSearchResults(response.responseText, region);
            resolve(results);
          } catch (error) {
            resolve({ error: 'Failed to parse results' });
          }
        },
        onerror: function () {
          resolve({ error: 'Network error' });
        },
        ontimeout: function () {
          resolve({ error: 'Request timeout' });
        },
        timeout: 10000,
      });
    });
  }

  // Parse search results from HTML
  function parseSearchResults(html, region) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const results = [];

    // Updated product selectors for current Audible structure - more specific to avoid UI elements
    const productSelectors = [
      '[data-widget="searchResults"] li[data-asin]',
      '[data-widget="searchResults"] li[class*="productListItem"]',
      '.adbl-impression-container[data-asin]',
      'li[data-asin][class*="productListItem"]',
      'li[data-asin].bc-list-item',
      '.search-results li[data-asin]',
      '#searchResults li[data-asin]',
      '[class*="SearchResultsProduct"][data-asin]',
    ];

    let products = [];
    let usedSelector = '';

    for (const selector of productSelectors) {
      products = doc.querySelectorAll(selector);
      if (products.length > 0) {
        usedSelector = selector;
        break;
      }
    }

    // Debug logging

    // If still no products, try more generic selectors
    if (products.length === 0) {
      const fallbackSelectors = ['li[class*="product"]', 'div[class*="product"]', '[data-testid*="product"]', 'li[class*="item"]'];

      for (const selector of fallbackSelectors) {
        products = doc.querySelectorAll(selector);
        if (products.length > 0) {
          usedSelector = selector;
          break;
        }
      }
    }

    for (let i = 0; i < Math.min(products.length, 5); i++) {
      const product = products[i];
      try {
        // Temporarily disable strict validation to get results
        const validationResult = isValidBookProduct(product);

        const title = extractText(product, [
          'h3 a',
          'h2 a',
          '.bc-heading a',
          '[data-test-id="product-title"] a',
          '[data-testid="product-title"] a',
          '.adbl-prod-title a',
          '[class*="productTitle"] a',
          '[class*="title"] a:not([class*="subtitle"])',
        ]);

        const author = extractAllText(product, [
          '.authorLabel a',
          '.bc-author a',
          '[data-test-id="author-name"]',
          '[data-testid="author-name"]',
          '.adbl-prod-author a',
          'span[class*="author"] a',
          'li[class*="author"] a',
          '.author a',
        ]);

        const price = extractText(product, ['.adbl-price', '.bc-price', '[data-test-id="price"]', '[data-testid="price"]', 'span[class*="price"]', '.price-wrapper']);

        const link = extractLink(product, [
          'h3 a',
          'h2 a',
          '.bc-heading a',
          '[data-test-id="product-title"] a',
          '[data-testid="product-title"] a',
          '.adbl-prod-title a',
          '[class*="title"] a',
          '[class*="Title"] a',
          'a[class*="title"]',
        ]);

        // Extract language information
        const language = extractText(product, ['.languageLabel span', '.bc-list-item.languageLabel span', '[class*="language"] span', 'li[class*="language"] span']);

        // Extract narrator information - enhanced with multiple methods
        let narrator = extractAllText(product, [
          // New selectors for modern Audible structure
          '[data-testid="authors-narrators"] [data-testid="line"][key="narrators"] .link',
          '[data-testid="authors-narrators"] [data-testid="line"] .link[href*="virtual-voice"]',
          '[data-testid="line"][key="narrators"] .link',
          '[data-testid="line"][key="narrators"] a',
          // Legacy selectors
          '.narratorLabel a',
          '.bc-list-item.narratorLabel a',
          '[class*="narrator"] a',
          'li[class*="narrator"] a',
          '.narrator a',
          '[data-test-id="narrator-name"]',
          '[data-testid="narrator-name"]',
          'span[data-test-id*="narrator"]',
          'span[data-testid*="narrator"]',
          '[class*="Narrator"] a',
          '.bc-list-item [class*="narrator"]',
        ]);

        // If narrator not found via above methods, try alternative extraction methods
        if (!narrator) {
          const allText = product.textContent;

          // Method 1: Look for narrator/narrated by pattern
          let narratorMatch = allText.match(/(?:Narrator|Narrated by|Read by|Spoken by):\s*([^,\n;•]+)/i);
          if (narratorMatch) {
            narrator = narratorMatch[1].trim();
          }

          // Method 2: Look for narrator without colon
          if (!narrator) {
            narratorMatch = allText.match(/(?:Narrator|Narrated by|Read by):\s+([^\n]+?)(?:\n|$|Series|Language|Runtime)/i);
            if (narratorMatch) {
              narrator = narratorMatch[1].trim();
            }
          }

          // Method 3: Look for narrator in list items without anchor tags
          if (!narrator) {
            const listItems = product.querySelectorAll('li, [role="listitem"]');
            for (const item of listItems) {
              const itemText = item.textContent.toLowerCase();
              if (itemText.includes('narrator') || itemText.includes('narrated')) {
                // Extract the text after the label
                const text = item.textContent.trim();
                const narratorText = text
                  .replace(/^.*?narrator[:\s]*/i, '')
                  .replace(/^.*?narrated\s+by[:\s]*/i, '')
                  .split(/[,\n;•]/)[0]
                  .trim();
                if (narratorText && narratorText.length > 2 && narratorText.length < 100 && !narratorText.match(/^\d+\s+hrs?/)) {
                  narrator = narratorText;
                  break;
                }
              }
            }
          }

          // Method 4: Look through all spans/divs for narrator pattern
          if (!narrator) {
            const allElements = product.querySelectorAll('span, div, li, p');
            for (const elem of allElements) {
              const text = elem.textContent.trim();
              // Match lines that look like "Narrator: Name" or "Narrated by: Name"
              if (text.match(/^(?:Narrator|Narrated by|Read by):\s*[A-Z]/i)) {
                narrator = text
                  .replace(/^(?:Narrator|Narrated by|Read by):\s*/i, '')
                  .split(/[,\n;•]/)[0]
                  .trim();
                if (narrator && narrator.length > 2) break;
              }
            }
          }

          // Method 5: Extract from metadata attributes or data attributes
          if (!narrator) {
            const metaElements = product.querySelectorAll('[data-*], [aria-label*="narrator" i]');
            for (const elem of metaElements) {
              const ariaLabel = elem.getAttribute('aria-label') || '';
              if (ariaLabel.match(/narrator|narrated/i)) {
                narrator = ariaLabel
                  .replace(/.*?narrator[:\s]*/i, '')
                  .replace(/.*?narrated\s+by[:\s]*/i, '')
                  .trim();
                if (narrator && narrator.length > 2) break;
              }
            }
          }

          // Debug: Log if we still don't have narrator for this title
          if (!narrator && title) {
            console.debug(`[Audible Search] No narrator found for: "${title}". Full product text preview:`, allText.substring(0, 800));
          }
        }

        // Check for Plus catalog indicators
        const isPlusAvailable = checkPlusCatalog(product);

        // Clean up language text if found and normalize to English
        let cleanLanguage = '';
        if (language) {
          // Remove language prefixes in various languages and clean up the text
          let rawLanguage = language.replace(/^(Language|Langue|Sprache|Lingua|Idioma|Taal|Språk|Język|Язык):\s*/i, '').trim();
          // Normalize language names to English
          cleanLanguage = normalizeLanguageToEnglish(rawLanguage);
        }

        // Temporarily relaxed validation - add if we have any title
        if (title && title.length > 2) {
          // Skip obvious UI elements
          const lowerTitle = title.toLowerCase();
          if (!lowerTitle.includes('hi,') && !lowerTitle.includes('account') && !lowerTitle.includes('sign in') && !lowerTitle.includes('my pre-orders')) {
            results.push({
              title: title,
              author: author || 'Unknown Author',
              narrator: narrator || '',
              price: isPlusAvailable ? 'Included with Plus' : price || 'Price not available',
              link: link ? (region.domain.includes('/') ? `https://www.${region.domain.split('/')[0]}${link}` : `https://www.${region.domain}${link}`) : null,
              isPlusAvailable: isPlusAvailable,
              language: cleanLanguage,
            });

            // Detailed logging for debugging narrator issues
            if (!narrator) {
              console.debug(`[Audible Search] Result without narrator - ${region.code}: "${title}" by ${author}`);
            }
          }
        }
      } catch (error) {}
    }

    // Summary log
    console.log(`[Audible Search] Parsed ${results.length} results from ${region.code} (${results.filter((r) => r.narrator).length} with narrator)`);
    return { results, error: null };
  }

  // Check if this is a valid book product (not UI elements)
  function isValidBookProduct(container) {
    const hasBookElements = container.querySelector('h3, h2, .bc-heading, [class*="title"], [class*="author"], [class*="price"]');

    // For now, be more permissive - just require some basic structure
    return hasBookElements !== null;
  }

  // Helper function to extract text from multiple possible selectors
  function extractText(container, selectors) {
    for (const selector of selectors) {
      const element = container.querySelector(selector);
      if (element) {
        const text = element.textContent.trim();
        // Additional filtering to avoid UI text
        if (text && text.length > 2 && !text.toLowerCase().includes('hi,')) {
          return text;
        }
      }
    }

    return null;
  }

  // Helper function to extract all matching text from multiple possible selectors (comma-separated)
  function extractAllText(container, selectors) {
    for (const selector of selectors) {
      const elements = container.querySelectorAll(selector);
      if (elements.length > 0) {
        const texts = Array.from(elements)
          .map(el => el.textContent.trim())
          .filter(text => text && text.length > 2 && !text.toLowerCase().includes('hi,'));
        if (texts.length > 0) {
          return texts.join(', ');
        }
      }
    }

    return null;
  }

  // Helper function to extract link from multiple possible selectors
  function extractLink(container, selectors) {
    for (const selector of selectors) {
      const element = container.querySelector(selector);
      if (element && element.href) {
        const url = new URL(element.href);
        return url.pathname + url.search;
      }
    }
    return null;
  }

  // Check if the book is available in Plus catalog
  function checkPlusCatalog(container) {
    const textContent = container.textContent.toLowerCase();
    const fullHTML = container.innerHTML.toLowerCase();

    // Quick check for obvious Plus indicators first
    if (fullHTML.includes('offertype') && fullHTML.includes('borrow')) {
      return true;
    }
    
    if (textContent.includes('añadir a mi biblioteca') || textContent.includes('add to my library')) {
      return true;
    }

    // PRIMARY DETECTION: Look for BOTH play AND add to library buttons (Plus requirement)
    const allButtons = container.querySelectorAll('button');
    const buttonTexts = Array.from(allButtons).map((btn) => ({
      text: btn.textContent.toLowerCase().trim(),
      ariaLabel: (btn.getAttribute('aria-label') || '').toLowerCase(),
      title: (btn.getAttribute('title') || '').toLowerCase(),
    }));

    // Also check form elements that might contain Add to Library functionality
    const allForms = container.querySelectorAll('form');
    const formTexts = Array.from(allForms).map((form) => ({
      text: form.textContent.toLowerCase().trim(),
      innerHTML: form.innerHTML.toLowerCase(),
    }));

    // Check for input fields that indicate Plus content (like offerType="BORROW")
    const plusInputs = container.querySelectorAll('input[value*="BORROW"], input[name="offerType"][value="BORROW"]');
    const hasPlusInputs = plusInputs.length > 0;

    // Quick return if we found strong Plus indicators
    if (hasPlusInputs) {
      return true;
    }

    // First, check if this has non-Plus buttons (immediate exclusion)
    const hasNonPlusButtons = buttonTexts.some(
      (btn) =>
        btn.text.includes('add to cart') ||
        btn.text.includes('try for') ||
        btn.text.includes('add to wish list') ||
        btn.text.includes('añadir al carrito') ||
        btn.text.includes('añadir a la lista de deseos') ||
        btn.text.includes('ajouter au panier') ||
        btn.text.includes('ajouter à la liste de souhaits') ||
        btn.text.includes('in den warenkorb') ||
        btn.text.includes('zur wunschliste hinzufügen') ||
        btn.text.includes('aggiungi al carrello') ||
        btn.text.includes('aggiungi alla lista dei desideri') ||
        btn.text.includes('adicionar ao carrinho') ||
        btn.text.includes('adicionar à lista de desejos') ||
        btn.ariaLabel.includes('add to cart') ||
        btn.ariaLabel.includes('add to wish list')
    );

    if (hasNonPlusButtons) {
      return false;
    }

    // Check for Plus-specific button combinations (BOTH play AND add to library must exist)
    const hasPlayButton = buttonTexts.some(
      (btn) =>
        btn.text.includes('play') ||
        btn.text.includes('reproducir') || // Spanish
        btn.text.includes('lire') || // French
        btn.text.includes('abspielen') || // German
        btn.text.includes('riproduci') || // Italian
        btn.text.includes('reproduzir') || // Portuguese
        btn.text.includes('再生') || // Japanese
        btn.ariaLabel.includes('play') ||
        btn.title.includes('play')
    );

    const hasAddToLibraryButton = buttonTexts.some(
      (btn) =>
        btn.text.includes('add to library') ||
        btn.text.includes('add to my library') ||
        btn.text.includes('añadir a la biblioteca') || // Spanish
        btn.text.includes('añadir a mi biblioteca') || // Spanish variant
        btn.text.includes('ajouter à la bibliothèque') || // French
        btn.text.includes('ajouter à ma bibliothèque') || // French variant
        btn.text.includes('zur bibliothek hinzufügen') || // German
        btn.text.includes('aggiungi alla libreria') || // Italian
        btn.text.includes('aggiungi alla mia libreria') || // Italian variant
        btn.text.includes('adicionar à biblioteca') || // Portuguese
        btn.text.includes('adicionar à minha biblioteca') || // Portuguese variant
        btn.text.includes('ライブラリに追加') || // Japanese
        btn.ariaLabel.includes('add to library') ||
        btn.ariaLabel.includes('add to my library') ||
        btn.title.includes('add to library') ||
        btn.title.includes('add to my library')
    );

    // Also check forms for Add to Library functionality
    const hasAddToLibraryForm = formTexts.some(
      (form) =>
        form.text.includes('add to library') ||
        form.text.includes('add to my library') ||
        form.text.includes('añadir a la biblioteca') ||
        form.text.includes('añadir a mi biblioteca') ||
        form.innerHTML.includes('ucx-add-to-library') || // Specific Audible form class
        form.innerHTML.includes('add-to-library')
    );

    // Plus books detection with multiple fallback methods
    const hasStrongPlusIndicators = 
      (hasAddToLibraryButton || hasAddToLibraryForm) ||
      textContent.includes('añadir a mi biblioteca') ||
      textContent.includes('add to my library') ||
      (fullHTML.includes('offertype') && fullHTML.includes('borrow'));
    
    // Accept if we have play button + library functionality OR strong indicators
    if ((hasPlayButton && (hasAddToLibraryButton || hasAddToLibraryForm)) || hasStrongPlusIndicators) {
      return true;
    }

    // TERTIARY DETECTION: Traditional Plus indicators
    const plusSelectors = [
      '.plus-badge',
      '.adbl-plus-badge',
      '.subscription-badge',
      '.included-badge',
      '[data-test-id*="plus"]',
      '[data-testid*="plus"]',
      '[class*="plus-badge"]',
      '[class*="subscription"]',
      '.ucx-add-to-library-button', // Audible's Add to Library button class
      '#ucx-add-to-library-form', // Audible's Add to Library form ID
      '.adblAddToLibrary', // Audible's Add to Library container class
      '[id*="add-to-library"]',
      '[class*="add-to-library"]',
      '.adblBuyBoxMinervaPlayNow', // Audible's Play button class
      '.adblBuyBoxMinervaResume', // Audible's Resume button class
    ];

    for (const selector of plusSelectors) {
      try {
        const element = container.querySelector(selector);
        if (element) {
          return true;
        }
      } catch (error) {
        continue;
      }
    }

    // QUATERNARY DETECTION: Text-based patterns
    const plusPatterns = [
      /plus.*catalog|catalog.*plus/i,
      /included.*plus|plus.*included/i,
      /free.*plus|plus.*free/i,
      /\$0\.00|\$0\b|free\b/i,
      /included\b/i,
      /plus member/i,
      /add to library/i,
      /add to my library/i,
      /añadir a la biblioteca/i,
      /añadir a mi biblioteca/i,
      /ajouter à la bibliothèque/i,
      /ajouter à ma bibliothèque/i,
      /zur bibliothek hinzufügen/i,
      /aggiungi alla libreria/i,
      /aggiungi alla mia libreria/i,
      /adicionar à biblioteca/i,
      /adicionar à minha biblioteca/i,
      /ucx-add-to-library/i, // Audible's specific class
      /adbladdtolibrary/i, // Audible's container class
      /adbldiscovery.*aycl/i, // Audible's discovery AYCL (Add Your Credits Later)
      /offertype.*borrow/i, // Audible's Plus borrowing
    ];

    for (const pattern of plusPatterns) {
      if (pattern.test(textContent) || pattern.test(fullHTML)) {
        return true;
      }
    }

    return false;
  }

  // Display results for a specific region
  function displayRegionResults(region, searchResult) {
    const regionDiv = document.getElementById(`results-${region.code}`);
    const headerDiv = regionDiv.parentElement.querySelector('.region-header .region-loading');

    if (searchResult.error) {
      headerDiv.textContent = 'Error';
      headerDiv.className = 'region-error';
      regionDiv.innerHTML = `<div class="region-error">${searchResult.error}</div>`;
      return;
    }

    if (!searchResult.results || searchResult.results.length === 0) {
      headerDiv.textContent = 'No results';
      headerDiv.className = 'region-error';
      return;
    }

    headerDiv.textContent = '';
    headerDiv.className = '';

    regionDiv.innerHTML = searchResult.results
      .map((book) => {
        // Check if language is not English (since we normalize to English, just check for "English")
        const isNonEnglish = book.language && book.language.toLowerCase() !== 'english';

        return `
            <div class="book-result${book.isPlusAvailable ? ' plus-available' : ''}">
                <div class="book-header">
                    <div class="book-title">
                        ${book.link ? `<a href="${book.link}" target="_blank">${escapeHtml(book.title)}</a>` : escapeHtml(book.title)}
                        ${isNonEnglish ? `<span class="language-indicator">${escapeHtml(book.language)}</span>` : ''}
                    </div>
                    <div class="book-price-container">
                        <div class="book-price">
                            ${book.isPlusAvailable ? '<span class="plus-indicator">Plus</span>' : escapeHtml(book.price)}
                        </div>
                    </div>
                </div>
                <div class="book-author-narrator">
                    <div>
                        <span class="book-author">${escapeHtml(book.author)}</span>
                        ${book.narrator ? `<span style="color: #9370db;"> | ${escapeHtml(book.narrator)}</span>` : ''}
                    </div>
                </div>
            </div>
          `;
      })
      .join('');
  }

  // Escape HTML to prevent XSS
  function escapeHtml(unsafe) {
    return unsafe.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  // MAM Integration Functions
  function extractTitle(fullTitle) {
    const colonIndex = fullTitle.indexOf(':');
    const dashIndex = fullTitle.indexOf(' - ');

    // Find the earliest delimiter (colon or dash surrounded by spaces)
    let cutIndex = -1;
    if (colonIndex !== -1 && dashIndex !== -1) {
      cutIndex = Math.min(colonIndex, dashIndex);
    } else if (colonIndex !== -1) {
      cutIndex = colonIndex;
    } else if (dashIndex !== -1) {
      cutIndex = dashIndex;
    }

    if (cutIndex !== -1) {
      return fullTitle.substring(0, cutIndex).trim();
    }
    return fullTitle.trim();
  }

  function extractAuthorLastName(fullAuthor) {
    const parts = fullAuthor.trim().split(/\s+/);
    return parts[parts.length - 1]; // Get the last part (last name)
  }

  function createSearchQuery(title, authorLastName) {
    return `${title} ${authorLastName}`.trim();
  }

  function createMAMSearchButtons(torRow) {
    // Extract title and author from the row
    const titleElement = torRow.querySelector('.torTitle');
    const authorElement = torRow.querySelector('.author');

    if (!titleElement || !authorElement) {
      return;
    }

    const fullTitle = titleElement.textContent.trim();
    const fullAuthor = authorElement.textContent.trim();
    const authorLastName = extractAuthorLastName(fullAuthor);

    // Get the category for search logic
    const category = getCategoryFromRow(torRow);
    const isAudiobook = category === 'audiobooks';

    if (!isAudiobook) {
      // Ebooks not supported
      return;
    }

    // Check if title contains "/" - if so, split and create multiple search queries
    let titles = [];
    if (fullTitle.includes('/')) {
      // Split by "/" and clean up each title
      titles = fullTitle
        .split('/')
        .map((t) => {
          const cleaned = extractTitle(t.trim());
          return cleaned.length > 2 ? cleaned : null;
        })
        .filter((t) => t !== null);
    } else {
      // Single title
      const title = extractTitle(fullTitle);
      if (title && title.length > 2) {
        titles = [title];
      }
    }

    // If we have valid titles, create search buttons for each
    if (titles.length === 0) return;

    // Create a container for multiple buttons if needed
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
      display: inline-flex;
      gap: 3px;
      align-items: center;
      vertical-align: middle;
    `;

    titles.forEach((title, index) => {
      const searchQuery = createSearchQuery(title, authorLastName);

      const searchBtn = document.createElement('button');
      searchBtn.className = 'mam-search-btn mam-search-buttons-container';
      searchBtn.style.cssText = `
        background: #ff9900;
        color: white;
        border: none;
        border-radius: 3px;
        padding: 2px 4px;
        cursor: pointer;
        font-size: 9px;
        transition: opacity 0.2s ease;
        display: inline-block;
        vertical-align: middle;
      `;
      searchBtn.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M12.008 17.362L24 9.885v2.028l-11.992 7.509L0 11.912V9.886l12.008 7.477zm0-9.378c-2.709 0-5.085 1.363-6.448 3.47c.111-.111.175-.175.286-.254c3.374-2.804 8.237-2.17 10.883 1.362l1.758-1.124c-1.394-2.044-3.786-3.454-6.48-3.454m0 3.47a4.4 4.4 0 0 0-3.548 1.821a3.6 3.6 0 0 1 2.139-.697c1.299 0 2.455.666 3.232 1.79l1.679-1.045c-.729-1.157-2.028-1.87-3.501-1.87M3.897 8.412c4.943-3.897 11.929-2.836 15.652 2.344l.031.032l1.822-1.125a11.21 11.21 0 0 0-9.394-5.085c-3.897 0-7.366 1.996-9.394 5.085c.364-.412.824-.903 1.283-1.251"/></svg>';

      // Add tooltip showing which title this button searches for
      if (titles.length > 1) {
        searchBtn.title = `Search Audible for: "${searchQuery}" (Book ${index + 1}/${titles.length})`;
      } else {
        searchBtn.title = `Search Audible for: "${searchQuery}"`;
      }

      searchBtn.onclick = () => {
        openMAMSearch(searchQuery);
      };
      searchBtn.onmouseover = () => (searchBtn.style.opacity = '0.8');
      searchBtn.onmouseout = () => (searchBtn.style.opacity = '1');

      buttonContainer.appendChild(searchBtn);
    });

    // Insert the button container before the title
    if (titleElement && titleElement.parentNode) {
      titleElement.parentNode.insertBefore(buttonContainer, titleElement);
    }
  }

  function openMAMSearch(query) {
    // On MAM page, never show toggle button - just show the widget directly
    if (widget.style.display === 'none') {
      widget.style.display = 'block';
      isWidgetVisible = true;
    }

    // Populate the search field
    const multiRegionInput = document.getElementById('multi-region-search-input');
    if (multiRegionInput) {
      multiRegionInput.value = query;
      multiRegionInput.focus();
      multiRegionInput.select();

      // Auto-trigger search after a short delay
      setTimeout(() => {
        const multiRegionBtn = document.getElementById('multi-region-search-btn');
        if (multiRegionBtn) multiRegionBtn.click();
      }, 1000);
    }
  }

  function addMAMSearchButtonsToAll() {
    // Try different selectors
    let torRows = document.querySelectorAll('#torRows .torRow');

    if (torRows.length === 0) {
      torRows = document.querySelectorAll('.torRow');
    }

    if (torRows.length === 0) {
      torRows = document.querySelectorAll('li.torRow');
    }

    if (torRows.length === 0) {
      return;
    }

    torRows.forEach((row, index) => {
      // Skip if already processed
      if (row.querySelector('.mam-search-buttons-container')) {
        return;
      }

      try {
        createMAMSearchButtons(row);
      } catch (error) {}
    });
  }

  // Bulk search functionality
  let bulkSearchInProgress = false;
  let bulkSearchResults = [];

  function createMAMBulkSearchButton() {
    // Create main search button
    const bulkBtn = document.createElement('button');
    bulkBtn.className = 'mam-bulk-search-btn';
    bulkBtn.innerHTML = `${getIcon('bulkSearch')} Check Audible Plus`;
    bulkBtn.title = 'Search Audible Plus across selected regions';
    bulkBtn.style.cssText = `
      position: fixed;
      bottom: 10px;
      top: auto;
      right: 10px;
      z-index: 9999;
      padding: 8px 12px;
      background: #232f3e;
      border: 2px solid #ff9900;
      color: #ff9900;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
      font-size: 12px;
      transition: all 0.2s;
      white-space: nowrap;
      display: flex;
      align-items: center;
      gap: 6px;
    `;
    bulkBtn.onmouseover = () => {
      bulkBtn.style.background = '#ff9900';
      bulkBtn.style.color = '#232f3e';
    };
    bulkBtn.onmouseout = () => {
      bulkBtn.style.background = '#232f3e';
      bulkBtn.style.color = '#ff9900';
    };
    bulkBtn.onclick = () => {
      const checkboxes = document.querySelectorAll('.mam-region-checkbox:checked');
      if (checkboxes.length === 0) {
        alert('Please select at least one region');
        return;
      }
      closeFlyout();
      startBulkSearch('audible-only');
    };
    document.body.appendChild(bulkBtn);

    // Create settings icon button - positioned lower on page and will fly out with panel
    const settingsBtn = document.createElement('button');
    settingsBtn.className = 'mam-settings-btn';
    settingsBtn.innerHTML = getIcon('settings');
    settingsBtn.title = 'Configure regions';
    settingsBtn.style.cssText = `
      position: fixed;
      bottom: 75px;
      right: 0;
      z-index: 9999;
      background: #232f3e;
      border: 1px solid #ff9900;
      border-right: 0;
      border-radius: 4px 0 0 4px;
      color: #ff9900;
      width: 40px;
      height: 40px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: right 0.3s ease;
      padding: 0;
    `;
    document.body.appendChild(settingsBtn);

    // Create settings flyout panel
    const settingsPanel = document.createElement('div');
    settingsPanel.className = 'mam-bulk-settings-panel';
    settingsPanel.style.cssText = `
      position: fixed;
      bottom: 55px;
      right: -245px;
      width: 200px;
      max-height: 80vh;
      background: #232f3e;
      border: 1px solid #ff9900;
      border-radius: 0 0 0 4px;
      padding: 20px;
      color: white;
      font-family: 'Momo Trust Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      font-size: 13px;
      z-index: 9998;
      overflow-y: auto;
      box-shadow: -2px 4px 8px rgba(0,0,0,0.5);
      transition: right 0.3s ease;
      display: flex;
      flex-direction: column;
      gap: 15px;
      border-right: 0;
    `;

    // Create checkbox container - compact grid layout
    const checkboxContainer = document.createElement('div');
    checkboxContainer.style.cssText = `
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
    `;

    // Load saved preferences - use default selected regions
    const savedRegions = localStorage.getItem('mam-selected-regions');
    const selectedRegions = savedRegions ? JSON.parse(savedRegions) : defaultSelectedRegions;

    // Create checkboxes for each region
    allRegions.forEach((region) => {
      const label = document.createElement('label');
      label.style.cssText = 'display: flex; align-items: center; gap: 6px; cursor: pointer; color: #FFB84D; user-select: none; transition: opacity 0.2s; padding: 3px 5px; font-size: 12px;';

      const isSelected = selectedRegions.includes(region.code);
      label.innerHTML = `
        <input type="checkbox" class="mam-region-checkbox" value="${region.code}" ${isSelected ? 'checked' : ''} 
               style="margin: 0; width: 16px; height: 16px; cursor: pointer;">
        <span style="display: inline-flex; align-items: center; gap: 4px; flex: 1;">
          ${region.flag} <strong>${region.code}</strong>
        </span>
      `;

      // Add hover effects
      label.onmouseover = () => (label.style.opacity = '0.8');
      label.onmouseout = () => (label.style.opacity = '1');

      // Add change listener
      const checkbox = label.querySelector('input');
      checkbox.addEventListener('change', (e) => {
        updateSelectedRegions();
      });

      checkboxContainer.appendChild(label);
    });

    settingsPanel.appendChild(checkboxContainer);

    document.body.appendChild(settingsPanel);

    // Function to update selected regions in localStorage
    function updateSelectedRegions() {
      const checkboxes = document.querySelectorAll('.mam-region-checkbox:checked');
      const selected = Array.from(checkboxes).map((cb) => cb.value);
      localStorage.setItem('mam-selected-regions', JSON.stringify(selected));
    }

    // Function to open/close flyout
    function toggleFlyout() {
      const isHidden = settingsPanel.style.right === '-245px';
      settingsPanel.style.right = isHidden ? '0' : '-245px';
      settingsBtn.style.right = isHidden ? '240px' : '0';
    }

    function closeFlyout() {
      settingsPanel.style.right = '-245px';
      settingsBtn.style.right = '0';
    }

    // Settings button toggles flyout, close flyout when clicking outside
    settingsBtn.onclick = toggleFlyout;

    // Close flyout when clicking outside
    document.addEventListener('click', (e) => {
      if (!settingsPanel.contains(e.target) && e.target !== settingsBtn && !settingsBtn.contains(e.target)) {
        closeFlyout();
      }
    });

    // Add CSS animations
    if (!document.querySelector('#mam-flyout-animation')) {
      const style = document.createElement('style');
      style.id = 'mam-flyout-animation';
      style.textContent = `
        @keyframes slideIn {
          from { right: -245px; }
          to { right: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    // Create progress indicator
    const progressDiv = document.createElement('div');
    progressDiv.className = 'mam-progress-indicator';
    progressDiv.id = 'mam-progress-indicator';
    document.body.appendChild(progressDiv);
  }

  function removeAllManualSearchButtons() {
    // Try multiple selectors to catch all manual search buttons
    const selectors = ['.mam-search-buttons-container', '.mam-search-btn', '.mam-search-btn.mam-search-buttons-container'];

    let totalRemoved = 0;
    selectors.forEach((selector) => {
      const buttons = document.querySelectorAll(selector);
      buttons.forEach((button) => {
        button.remove();
        totalRemoved++;
      });
    });
  }

  function addProcessingIndicator(row) {
    // Remove any existing indicators
    const existingIndicator = row.querySelector('.mam-processing-indicator');
    if (existingIndicator) {
      existingIndicator.remove();
    }

    // Add processing indicator using the same search icon
    const indicator = document.createElement('span');
    indicator.className = 'mam-processing-indicator';
    indicator.innerHTML = getIcon('search');
    indicator.style.cssText = `
      color: #ff9900;
      margin-right: 5px;
      animation: pulse 1s infinite;
      display: inline-block;
      vertical-align: middle;
    `;

    // Add CSS for pulse animation if it doesn't exist
    if (!document.querySelector('#mam-pulse-animation')) {
      const style = document.createElement('style');
      style.id = 'mam-pulse-animation';
      style.textContent = `
        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
          100% { opacity: 1; transform: scale(1); }
        }
      `;
      document.head.appendChild(style);
    }

    // Insert at the beginning of the row
    const titleElement = row.querySelector('.torTitle');
    if (titleElement && titleElement.parentNode) {
      titleElement.parentNode.insertBefore(indicator, titleElement);
    }
  }

  function markRowComplete(row, foundPlus, matchResults = []) {
    // Remove processing indicator
    const processingIndicator = row.querySelector('.mam-processing-indicator');
    if (processingIndicator) {
      processingIndicator.remove();
    }

    const titleElement = row.querySelector('.torTitle');
    if (!titleElement) {
      return;
    }

    if (foundPlus && matchResults.length > 0) {
      // Found Plus results - show matched book info
      const indicator = document.createElement('span');
      indicator.className = 'mam-complete-indicator';
      indicator.innerHTML = getIcon('search');
      indicator.style.cssText = `
        color: #00d4aa;
        margin-right: 5px;
        display: inline-block;
        vertical-align: middle;
        filter: drop-shadow(0 0 3px #00d4aa);
      `;
      indicator.title = 'Found in Plus catalog';

      // Create results display
      const resultsDiv = document.createElement('div');
      resultsDiv.className = 'mam-inline-results';

      const containerColor = '#E68A00';
      const containerBg = 'rgba(255, 153, 0, 0.1)';

      resultsDiv.style.cssText = `
        margin-left: 70px;
        margin-right: 270px;
        margin-top: 3px;
        margin-bottom: 5px;
        font-size: 14px;
        color: ${containerColor};
        background: ${containerBg};
        padding: 4px 8px;
        border-radius: 3px;
        border-left: 2px solid ${containerColor};
      `;

      // Create individual clickable divs for each book
      const bookDivs = [];

      matchResults.forEach((regionResult) => {
        regionResult.books.forEach((book) => {
          const bookDiv = document.createElement('div');

          const bgColor = 'rgba(255, 153, 0, 0.1)';
          const hoverColor = 'rgba(255, 153, 0, 0.2)';

          bookDiv.style.cssText = `
            margin: 2px 0;
            padding: 4px 6px;
            background: ${bgColor};
            border-radius: 3px;
            font-size: 12px;
            transition: background-color 0.2s ease;
            display: flex;
            ${book.link ? 'cursor: pointer;' : ''}
          `;

          // Make clickable if book has a link
          if (book.link) {
            bookDiv.onclick = (e) => {
              e.preventDefault();
              // Use the proper background opening method
              openLinkInBackground(book.link);
            };
            bookDiv.onmouseover = () => {
              bookDiv.style.background = hoverColor;
            };
            bookDiv.onmouseout = () => {
              bookDiv.style.background = bgColor;
            };
            bookDiv.title = `Click to open: ${book.title}`;
          }

          const flagColor = '#FFB84D';
          const titleColor = '#E68A00';

          bookDiv.innerHTML = `
            <strong style="display: inline-flex; align-items: center; gap: 3px;">
              <span style="color: ${flagColor}; display: inline-flex; align-items: center; gap: 3px;">
                ${regionResult.region.flag} ${regionResult.region.code}
              </span>:
            </strong> 
            <strong style="margin-left: 5px; color: ${titleColor};">${escapeHtml(book.title)}</strong> 
            ${book.author ? `<span style="color: #ccc; margin-left: 5px;"> by ${escapeHtml(book.author)}</span>` : ''}
            ${book.narrator ? `<span style="color: #ccc; margin-left: 3px;"> | </span><span style="color: #c78bff; margin-left: 3px;">${escapeHtml(book.narrator)}</span>` : ''}
          `;

          bookDivs.push(bookDiv);
        });
      });

      // Add all book divs to the results container
      bookDivs.forEach((bookDiv) => resultsDiv.appendChild(bookDiv));

      // Highlight the entire row
      const rowBg = 'rgba(255, 153, 0, 0.05)';
      const rowBorder = '#E68A00';
      row.style.backgroundColor = rowBg;
      row.style.borderLeft = `3px solid ${rowBorder}`;

      // Insert indicator and results
      if (titleElement.parentNode) {
        titleElement.parentNode.insertBefore(indicator, titleElement);

        // Insert results div right after the title element itself
        if (titleElement.nextSibling) {
          titleElement.parentNode.insertBefore(resultsDiv, titleElement.nextSibling);
        } else {
          titleElement.parentNode.appendChild(resultsDiv);
        }
      }
    } else {
      // Not found - dim the title and add subtle indicator
      const indicator = document.createElement('span');
      indicator.className = 'mam-complete-indicator';
      indicator.innerHTML = getIcon('search');
      indicator.style.cssText = `
        color: #666;
        margin-right: 5px;
        display: inline-block;
        vertical-align: middle;
        opacity: 0.4;
      `;
      indicator.title = 'Checked - not in Plus catalog';

      // Dim the entire title
      titleElement.style.opacity = '0.5';
      titleElement.style.color = '#888';

      // Dim the author element too if it exists
      const authorElement = row.querySelector('.author');
      if (authorElement) {
        authorElement.style.opacity = '0.5';
        authorElement.style.color = '#888';
      }

      row.style.backgroundColor = 'rgba(102, 102, 102, 0.02)';

      // Insert indicator
      if (titleElement.parentNode) {
        titleElement.parentNode.insertBefore(indicator, titleElement);
      }
    }
  }

  function openLinkInBackground(url) {
    GM_openInTab(url, { active: false });
  }

  async function startBulkSearch(mode = 'audible-only') {
    if (bulkSearchInProgress) return;

    const bulkBtn = document.querySelector('.mam-bulk-search-btn');
    const progressDiv = document.getElementById('mam-progress-indicator');
    const resultsDiv = document.getElementById('mam-results-container');

    if (!bulkBtn || !progressDiv) return;

    // Get all request rows
    let torRows = document.querySelectorAll('#torRows .torRow');
    if (torRows.length === 0) {
      torRows = document.querySelectorAll('.torRow');
    }

    if (torRows.length === 0) {
      alert('No requests found on this page');
      return;
    }

    bulkSearchInProgress = true;
    bulkSearchResults = [];

    // Update button state
    bulkBtn.disabled = true;
    bulkBtn.innerHTML = `${getIcon('bulkSearch')} Searching Audible Plus catalog...`;

    // Show progress
    progressDiv.style.display = 'block';
    progressDiv.innerHTML = `Processing 0 of ${torRows.length} requests...`;

    // Remove all manual search buttons since we're doing bulk search
    removeAllManualSearchButtons();

    // Process each request with delay
    for (let i = 0; i < torRows.length; i++) {
      const row = torRows[i];

      // Update progress
      progressDiv.innerHTML = `Processing ${i + 1} of ${torRows.length} requests...<br>Current: ${getRequestTitle(row)}`;

      // Add visual indicator that this row is being processed
      addProcessingIndicator(row);

      // Extract request details
      const requestData = extractRequestData(row);
      if (requestData) {
        const searchQuery = createSearchQuery(requestData.title, requestData.authorLastName);

        // Search all regions for this request
        const results = await searchAllRegionsForPlus(searchQuery, requestData, 'audible-only');

        // Check if we have meaningful results:
        // - Audible results with Plus availability
        const hasValidResults = results.some((result) => {
          return result.books && result.books.some((book) => book.isPlusAvailable);
        });

        if (hasValidResults) {
          bulkSearchResults.push({
            originalTitle: requestData.fullTitle,
            author: requestData.fullAuthor,
            searchQuery: searchQuery,
            results: results,
            rowElement: row,
          });
          // Mark as found with match details
          markRowComplete(row, true, results);
        } else {
          // Mark as checked but not found (dimmed)
          markRowComplete(row, false);
        }
      } else {
        // Mark as skipped (no valid data)
        markRowComplete(row, false);
      }

      // Add minimal delay between requests (100ms - very fast)
      if (i < torRows.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    // Search complete
    bulkSearchInProgress = false;
    bulkBtn.disabled = false;
    bulkBtn.innerHTML = `${getIcon('bulkSearch')} Search `;
    progressDiv.style.display = 'none';

    // No need for modal - all results are already displayed inline
  }

  function extractRequestData(torRow) {
    const titleElement = torRow.querySelector('.torTitle');
    const authorElement = torRow.querySelector('.author');

    if (!titleElement || !authorElement) {
      return null;
    }

    const fullTitle = titleElement.textContent.trim();
    const fullAuthor = authorElement.textContent.trim();

    return {
      fullTitle: fullTitle,
      fullAuthor: fullAuthor,
      title: extractTitle(fullTitle),
      authorLastName: extractAuthorLastName(fullAuthor),
      torRow: torRow, // Include the row element so we can extract category
    };
  }

  function getRequestTitle(torRow) {
    const titleElement = torRow.querySelector('.torTitle');
    return titleElement ? titleElement.textContent.trim().substring(0, 50) + '...' : 'Unknown';
  }

  // MAM category mapping
  const MAM_CATEGORY_MAP = {
    // Audiobooks
    39: 'audiobooks',
    49: 'audiobooks',
    50: 'audiobooks',
    83: 'audiobooks',
    51: 'audiobooks',
    97: 'audiobooks',
    40: 'audiobooks',
    41: 'audiobooks',
    106: 'audiobooks',
    42: 'audiobooks',
    52: 'audiobooks',
    98: 'audiobooks',
    54: 'audiobooks',
    55: 'audiobooks',
    43: 'audiobooks',
    99: 'audiobooks',
    84: 'audiobooks',
    44: 'audiobooks',
    56: 'audiobooks',
    45: 'audiobooks',
    57: 'audiobooks',
    85: 'audiobooks',
    87: 'audiobooks',
    119: 'audiobooks',
    88: 'audiobooks',
    58: 'audiobooks',
    59: 'audiobooks',
    46: 'audiobooks',
    47: 'audiobooks',
    53: 'audiobooks',
    89: 'audiobooks',
    100: 'audiobooks',
    108: 'audiobooks',
    48: 'audiobooks',
    111: 'audiobooks',

    // Ebooks
    60: 'books',
    71: 'books',
    72: 'books',
    90: 'books',
    61: 'books',
    73: 'books',
    101: 'books',
    62: 'books',
    63: 'books',
    107: 'books',
    64: 'books',
    74: 'books',
    102: 'books',
    76: 'books',
    77: 'books',
    65: 'books',
    103: 'books',
    115: 'books',
    91: 'books',
    66: 'books',
    78: 'books',
    67: 'books',
    79: 'books',
    80: 'books',
    92: 'books',
    118: 'books',
    94: 'books',
    120: 'books',
    95: 'books',
    81: 'books',
    82: 'books',
    68: 'books',
    69: 'books',
    75: 'books',
    96: 'books',
    104: 'books',
    109: 'books',
    70: 'books',
    112: 'books',
  };

  // Helper function to extract category from torRow
  function getCategoryFromRow(torRow) {
    const catLink = torRow.querySelector('.catLink div[class^="cat"]');
    if (catLink) {
      const className = catLink.className;
      const categoryMatch = className.match(/cat(\d+)/);
      if (categoryMatch) {
        const categoryNumber = parseInt(categoryMatch[1]);
        return MAM_CATEGORY_MAP[categoryNumber] || 'books'; // Default to books if unknown
      }
    }
    return 'books'; // Default fallback
  }

  // Helper function to check if authors match
  function authorsMatch(requestAuthor, resultAuthor) {
    if (!requestAuthor || !resultAuthor) return false;

    const normalize = (name) => {
      return name
        .toLowerCase()
        .trim()
        .replace(/[,\s]+/g, ' ');
    };

    const reqNorm = normalize(requestAuthor);
    const resNorm = normalize(resultAuthor);

    // Exact match
    if (reqNorm === resNorm) return true;

    // Split into parts and check for common surnames
    const reqParts = reqNorm.split(' ').filter((p) => p.length > 0);
    const resParts = resNorm.split(' ').filter((p) => p.length > 0);

    // If either has only one part, require exact match
    if (reqParts.length <= 1 || resParts.length <= 1) {
      return reqNorm === resNorm;
    }

    // Check if at least one significant part (last name or main word) matches
    // Last parts (surnames) should match
    if (reqParts.length > 0 && resParts.length > 0) {
      const reqLastName = reqParts[reqParts.length - 1];
      const resLastName = resParts[resParts.length - 1];

      // Last name must match (this is the most reliable part)
      if (reqLastName === resLastName) {
        // Also check if first names are similar or missing
        if (reqParts.length === 1) {
          // Request only has last name, any match with that last name is good
          return true;
        }
        if (resParts.length === 1) {
          // Result only has last name, it matches the request's last name
          return true;
        }
        // Both have first names, they should be similar
        const reqFirstInitial = reqParts[0][0];
        const resFirstInitial = resParts[0][0];
        return reqFirstInitial === resFirstInitial;
      }
    }

    return false;
  }

  async function searchAllRegionsForPlus(query, requestData, mode = 'both') {
    const activeRegions = getActiveRegions();

    // Handle Audible searches based on mode and category
    let audiblePromises = [];

    // Get the category to determine if we should search Audible
    const category = requestData?.torRow ? getCategoryFromRow(requestData.torRow) : 'books';

    // Extract author from request data for matching
    const requestAuthor = requestData?.fullAuthor || '';

    if (category !== 'books') {
      // Only search Audible for audiobook categories, skip for ebook categories
      audiblePromises = activeRegions.map(async (region) => {
        try {
          const searchResult = await searchRegion(region, query);

          if (searchResult.results && searchResult.results.length > 0) {
            // Filter for Plus availability AND author match
            const matchingBooks = searchResult.results.filter((book) => {
              // Must have Plus availability
              if (!book.isPlusAvailable) return false;

              // Must have matching author
              if (!authorsMatch(requestAuthor, book.author)) {
                return false;
              }

              return true;
            });

            if (matchingBooks.length > 0) {
              return {
                region: region,
                books: matchingBooks,
              };
            }
          }
        } catch (error) {}
        return null;
      });
    }

    // Wait for all searches to complete
    const audibleResults = await Promise.all(audiblePromises);

    // Return only Audible results
    const allResults = [];
    allResults.push(...audibleResults.filter((result) => result !== null));

    return allResults;
  }

  function initMAMIntegration() {
    // Create bulk search button
    createMAMBulkSearchButton();

    // Automatically add search buttons to existing rows
    setTimeout(() => {
      addMAMSearchButtonsToAll();
    }, 1000);

    // Also try immediately
    addMAMSearchButtonsToAll();

    // Watch for page changes and re-add buttons
    const observer = new MutationObserver((mutations) => {
      let shouldUpdate = false;
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Check if new torRow elements were added
            if (node.classList && node.classList.contains('torRow')) {
              shouldUpdate = true;
            } else if (node.querySelector && node.querySelector('.torRow')) {
              shouldUpdate = true;
            }
            // Also check if the torRows container itself changed
            else if (node.id === 'torRows' || node.querySelector('#torRows')) {
              shouldUpdate = true;
            }
          }
        });
      });

      if (shouldUpdate) {
        setTimeout(() => {
          addMAMSearchButtonsToAll();
        }, 100);
      }
    });

    // Start observing the document for changes
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  // Initialize the script
  function init() {

    // Initialize MAM integration based on page type
    if (window.location.hostname === 'www.myanonamouse.net') {
      if (window.location.pathname === '/tor/requests2.php') {
        // On MAM requests list page
        createWidget();
        setTimeout(initMAMIntegration, 500);
      } else if (window.location.pathname.includes('/tor/viewRequest.php')) {
        // On individual request detail page
        createWidget();
        setTimeout(initViewRequestPage, 1000);
      } else {
        // Other MAM pages - just show widget
        createToggleButton();
        createWidget();
      }
    } else {
      // On Audible pages, show normal toggle button and widget
      createToggleButton();
      createWidget();
    }
  }

  // Run init immediately and also on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Initialize individual request view page
  function initViewRequestPage() {
    // Try multiple selectors to find the title
    let titleElem = document.querySelector('#torDetMainCon .torDetRow:nth-child(1) .torDetRight span.flex');

    // If not found, try alternative selectors
    if (!titleElem) {
      const torDetRows = document.querySelectorAll('#torDetMainCon .torDetRow');
      for (const row of torDetRows) {
        const leftText = row.querySelector('.torDetLeft')?.textContent.trim();
        if (leftText && leftText.toLowerCase().includes('title')) {
          const rightElem = row.querySelector('.torDetRight span.flex');
          if (rightElem) {
            titleElem = rightElem;
            break;
          }
        }
      }
    }

    if (!titleElem) {
      console.warn('[Audible Search] Could not find title element on request page. Debugging info:');
      console.log('torDetMainCon exists:', !!document.querySelector('#torDetMainCon'));
      console.log('torDetRows found:', document.querySelectorAll('#torDetMainCon .torDetRow').length);
      return;
    }

    // Extract title
    const title = titleElem.textContent.trim();

    // Find author - look for row with "Author(s):"
    let author = 'Unknown';
    const torDetRows = document.querySelectorAll('#torDetMainCon .torDetRow');
    for (const row of torDetRows) {
      const leftText = row.querySelector('.torDetLeft')?.textContent.trim();
      if (leftText && leftText.toLowerCase().includes('author')) {
        const authorLink = row.querySelector('.torDetRight a');
        if (authorLink) {
          author = authorLink.textContent.trim();
          break;
        }
      }
    }


    // Create search button container
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
      display: inline-flex;
      gap: 8px;
      align-items: center;
      margin-top: 10px;
      margin-bottom: 10px;
      padding: 8px 0;
    `;

    // Create main search button
    const searchBtn = document.createElement('button');
    searchBtn.className = 'mam-search-btn-individual';
    searchBtn.innerHTML = `${getIcon('search')} Search Audible`;
    searchBtn.style.cssText = `
      background: #ff9900;
      color: white;
      border: none;
      border-radius: 3px;
      padding: 6px 12px;
      cursor: pointer;
      font-size: 12px;
      font-weight: bold;
      transition: opacity 0.2s ease;
      display: inline-flex;
      align-items: center;
      margin-top: -8px;
      gap: 6px;
    `;
    searchBtn.onmouseover = () => (searchBtn.style.opacity = '0.8');
    searchBtn.onmouseout = () => (searchBtn.style.opacity = '1');
    searchBtn.onclick = () => {
      const authorLastName = author.split(/\s+/).pop();
      const searchQuery = createSearchQuery(title, authorLastName);
      openMAMSearch(searchQuery);
    };
    searchBtn.title = `Search Audible for: "${title}"`;

    buttonContainer.appendChild(searchBtn);

    // Find the blockHead div and place button in top-right
    const blockHead = document.querySelector('.blockHead');
    if (blockHead) {
      // Style the button container for top-right positioning
      buttonContainer.style.cssText = `
        position: absolute;
        top: 12px;
        right: 12px;
        display: inline-flex;
        gap: 8px;
        align-items: center;
        margin: 0;
        padding: 0;
      `;
      
      // Make blockHead position relative if not already
      if (window.getComputedStyle(blockHead).position === 'static') {
        blockHead.style.position = 'relative';
      }
      
      blockHead.appendChild(buttonContainer);
    } else {
      console.warn('[Audible Search] Could not find .blockHead div');
    }
  }

})();
