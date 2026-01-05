// ==UserScript==
// @name         TJ NSFW Spoilers
// @icon         http://tjournal.ru/static/main/img/icons/apple-touch-icon-180x180-precomposed.png
// @namespace    x4_tjnsfws
// @version      0.2
// @description  Spoilers for NSFW images in comments
// @author       x4fab
// @match        http://tjournal.ru/*
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/9853/TJ%20NSFW%20Spoilers.user.js
// @updateURL https://update.greasyfork.org/scripts/9853/TJ%20NSFW%20Spoilers.meta.js
// ==/UserScript==

var regex = /\bNSFW\b/;

document.head.appendChild(document.createElement('style')).innerHTML = ''.slice.call(function(){/*
    .media._mod_nsfw .picture {
        position: relative;
    }
    
    .media._mod_nsfw .picture:after {
        position: absolute;
        top: 0; bottom: 0;
        left: 0; right: 0;
        
        border-radius: 4px;
        background: black;
        
        content: "NSFW";
        color: white;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        
        z-index: 1;
        transition: opacity .3s;
    }
    
    .media._mod_nsfw .picture:hover:after {
        opacity: .8;
    }
    
    .media._mod_nsfw .picture._mod_show:after {
        opacity: 0;
    }
*/}, 14, -3);

new MutationObserver(function(mutations) {
	Array.prototype.forEach.call(
        document.querySelectorAll('.b-comment__text'),
        function (e){
            if (regex.test(e.textContent)){
                var m = e.querySelector('.media');
                if (m && !m.classList.contains('_mod_nsfw')){
                    m.classList.add('_mod_nsfw');
                    Array.prototype.forEach.call(
                        m.querySelectorAll('.picture'),
                        function (e){
                            e.addEventListener('click', function (event){
                                if (!this.classList.contains('_mod_show')){
                                    this.classList.add('_mod_show');
                                    event.preventDefault();
                                    event.stopPropagation();
                                }
                            }, false);
                        });
                }
            }
        });
}).observe(document.body, {
	childList: true
});

