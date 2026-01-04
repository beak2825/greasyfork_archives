// ==UserScript==
// @name Supprime le curseur poisson de leconcorde.fr
// @description Remove fish cursor from leconcorde.fr
// @description:fr Supprime le curseur poisson de leconcorde.fr
// @namespace manal.xyz
// @match https://leconcorde.fr/*
// @version 1
// @grant none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557311/Supprime%20le%20curseur%20poisson%20de%20leconcordefr.user.js
// @updateURL https://update.greasyfork.org/scripts/557311/Supprime%20le%20curseur%20poisson%20de%20leconcordefr.meta.js
// ==/UserScript==

document.getElementById('cursor').style.display = 'none';

const styleElement = document.createElement('style');
styleElement.textContent = 'html * {cursor: auto}';
document.getElementsByTagName('head')[0].appendChild(styleElement);