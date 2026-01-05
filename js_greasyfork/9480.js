// ==UserScript==
// @name Operacje
// @namespace http://fotka.com/profil/Shaitan
// @include http://fotka.com/profil/*
// @description Skrypt pozwalający sprawdzić ostatnie operacje moderatora z poziomu profilu
// @version 1.1
// @copyright 2014, Shaitan
// @grant          unsafeWindow
// @run-at         document-end
// @downloadURL https://update.greasyfork.org/scripts/9480/Operacje.user.js
// @updateURL https://update.greasyfork.org/scripts/9480/Operacje.meta.js
// ==/UserScript==
const $ = unsafeWindow.$;
var l = $("#profile-box-data-header");
if (l != null){
var a = document.createElement("A");
a.href = "/przyjaciel/friend/operations/?id=" + unsafeWindow._currentProfile.id;
var p = document.createElement("IMG");
{
p.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAIAAAAC64paAAAABnRSTlMA+wD4APEgL4Y/AAAACXBIWXMAAC4jAAAuIwF4pT92AAACu0lEQVR4nH1UXUhTYRh+v3POju5P51aruaklTY1pbQkaCUXlwIxKCSKS6CK6segiKrwyhMCEKCLsopsoiqAfMbowArW8sRsFy9Rpps7p1P2dbWfHs52/LqZzjrMePvj4nud73u/9ft4PcWwYtmNibnUlyAgiAgCEEIEjkkCWndri3bqMmSjdPO32jf8NlJWYDPnqjHl+ivYFKVupYZdeK2P+OPArwogH9pkhOybnvaXmvCNVJckhkeze9f/s/TZ5yVntXaOSjILAHbaSRIIfm1qUJClJ6lTK7vc/cIRqK4sBAAOAmUV/a1ePSZ+3tEalWm4uWWjU7bHs4HghnTdo1S333lI0u7Fy27M+Js4teAMakkhlGGPYyjIzw8THpz0cL6R490pw2R/pejXY2XoKTczM2i8/liTQaZQNDiuOY//ZMy+IfSPTEYbVqHLmetpwi905ODILAGyC9wTCCkAsm6BjrCCICgJXK8lojPUHo3SM9VH0sMsdYeIAkOCE6goLXlB+1LXgSwZmOd4TilKxdVGQWs4e7rjZdOaEfczlGRqdWQiE/6yFWG4r/70mPbbs2/ZIJEkKMXHXavDGow+zSz4ACLJxd5gOrcc3j3wDy/4wJmZwaYjQLAAghGRVQQLMWKCV1QAgnuABQN4KYCzQYPYyUzYzL4rZJABwWAux03X7s+qSBACCXAhSgdfXWLFD5eZaW5GslySJzQiZuHDyoCFfhQHAg+uNOLZta2olefeKM1kk15rrGuts6apWndN+tR5SVfXwzff2519TMkJIn6eKxlgMQypljiiKVHQ9KWEIve642HSsEtJL8v6L/s6XA9kvDgCAJPDuO80tDY6NNdI/gy/DrltPPs97Q7JOu7Xw6e1z1RWWrQQzviGOFz4N/e4dmhid8qwEaQwhizG/1lZ0/niVs8aa8WD+AeubRGF9CegsAAAAAElFTkSuQmCC";
}
p.title = "Operacje";
p.style.position = "relative";
p.style.top = "3px";
p.style.marginLeft = "4px";
a.appendChild(p);
l.append(a);
}