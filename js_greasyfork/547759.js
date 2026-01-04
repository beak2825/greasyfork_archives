// ==UserScript==
// @name         Flight Rising: More Dragon Share Widgets
// @namespace    https://github.com/dragonjpg
// @version      1.0.2
// @description  adds more share widgets and an alt tag of the dragon's name and id to the original full-size widget. utilizes FR's existing "frCopyToClipboard" function
// @author       dragon.jpg
// @license      MIT
// @match        https://www1.flightrising.com/dragon/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=flightrising.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547759/Flight%20Rising%3A%20More%20Dragon%20Share%20Widgets.user.js
// @updateURL https://update.greasyfork.org/scripts/547759/Flight%20Rising%3A%20More%20Dragon%20Share%20Widgets.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // function to round id # to generate dragon image urls
    function shortID(id) {
        var short = 1;
        if (id > 100) {
            short = parseInt(id.toString().slice(0, -2)) + 1;
        }
        return short;
    }

    // necessary css for tooltips :)
    var css = `.tip { position: relative; } .tip::after { content: attr(data-tip); width: 180px; height: auto; line-height: 120%;
        color: var(--text, #000); background: var(--tooltip-bg, #fff); border-radius: 10px;
        font-size: inherit; position: absolute; border:1px solid var(--borders, #888);box-shadow:rgba(0, 0, 0, 0.5) 1px 1px 6px;
        top: 10%; right: 100%; padding: 8px; box-sizing: border-box; z-index: 2; display: none; text-align: center; pointer-events: none; }
        .tip:hover::after, .tip:focus::after, .tip:focus-within::after { display: block; } .tip.copied-msg::after { content: 'Copied to clipboard!'; } `,
        head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style');

    head.appendChild(style);
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));

    // define the share dialog for future use + also get the existing fullsize widget so we can modify it below
    var dragon_share_dialog = document.querySelector("#dragon-profile-share-dialog"),
        all_shares = dragon_share_dialog.querySelectorAll(" .dragon-profile-share-option"),
        widget = all_shares[2];

    // create a template mirroring the existing widget code for our new share widgets
    var temp = document.createElement("div");
    temp.classList = "dragon-profile-share-option";
    temp.innerHTML = `<div class="dragon-profile-share-label">
      Widget:
    </div>
    <div class="dragon-profile-share-field">
      <input type="text" size="10" value="">
    </div>
    <span class="dragon-profile-share-icon tip" data-share="" data-tip="">
      <img id="dragon-profile-share-widget" src="/static/layout/copy.png" role="button" alt="copy widget to clipboard" tabindex="0">
    </span>`;

    // grab dragon id & name from the dragon profile header.
    // i included separate name and number variables in case you want to edit the strings and customize the generated alt tag
    var id = parseInt(document.querySelector(".dragon-profile-header-number").innerText.slice(2, -1)),
        short_id = shortID(id),
        name = document.querySelector(".dragon-profile-header-name").innerText,
        number = `(#${id})`;

    // clone the template
    var avatar = temp.cloneNode(true),
        lair = temp.cloneNode(true),
        coli = temp.cloneNode(true);

    // FULLSIZE
    // fix the fullsize share widget bc it has no alt tag, which drives me nuts
    widget.querySelector(".dragon-profile-share-label").innerText = "Fullsize Widget:";
    var orig_widget = `[url=https://www1.flightrising.com/dragon/${id}][img alt="${name} ${number}"]https://www1.flightrising.com/rendern/350/${short_id}/${id}_350.png[/img][/url]`;
    widget.querySelector(".dragon-profile-share-field input").value = orig_widget;
    widget.querySelector(".dragon-profile-share-icon").setAttribute("data-share",orig_widget);

    // AVATAR
    // append new share widget to page & update label
    widget.after(avatar);
    avatar.setAttribute("id","share_avatar");
    avatar.querySelector(".dragon-profile-share-label").innerText = "Avatar Widget:";
    // build the bbcode
    var avatar_share = `[url=https://www1.flightrising.com/dragon/${id}][img alt="${name} ${number}"]https://flightrising.com/rendern/portraits/${short_id}/${id}p.png[/img][/url]`;
    // set the correct attributes so pseudo tooltips + copying will work
    avatar.querySelector(".dragon-profile-share-field input").value = avatar_share;
    avatar.querySelector(".dragon-profile-share-icon").setAttribute("data-share",avatar_share);
    avatar.querySelector(".dragon-profile-share-icon").setAttribute("data-tip",`Copy the Avatar Widget to the clipboard.`);
    // click event
    avatar.querySelector(".dragon-profile-share-icon").addEventListener("click",function (e) {
        // get the info we need from the other two buttons + the alt text from the dragon image itself
        var widget_share = this.getAttribute("data-share");

        // copy the string to the clipboard using FR's existing function that the two original buttons use ;)
        if (frCopyToClipboard(widget_share)) {
            e.preventDefault();
            this.classList.add("copied-msg");
            this.querySelector("img").focus();
        }
    });
    // tab navigation support
    avatar.querySelector(".dragon-profile-share-icon").addEventListener("keyup",function (e) {
        if (e.key === "Enter") {
            // get the info we need from the other two buttons + the alt text from the dragon image itself
            var widget_share = this.getAttribute("data-share");

            // copy the string to the clipboard using FR's existing function that the original share widget uses ;)
            if (frCopyToClipboard(widget_share)) {
                e.preventDefault();
                this.classList.add("copied-msg");
                this.querySelector("img").focus();
            }
        }
    });

    // LAIR
    // append new share widget to page & update label
    avatar.after(lair);
    lair.setAttribute("id","share_lair");
    lair.querySelector(".dragon-profile-share-label").innerText = "Lair Widget:";
    // build the bbcode
    var lair_share = `[url=https://www1.flightrising.com/dragon/${id}][img alt="${name} ${number}"]https://flightrising.com/rendern/avatars/${short_id}/${id}.png[/img][/url]`;
    // set the correct attributes so pseudo tooltips + copying will work
    lair.querySelector(".dragon-profile-share-field input").value = lair_share;
    lair.querySelector(".dragon-profile-share-icon").setAttribute("data-share",lair_share);
    lair.querySelector(".dragon-profile-share-icon").setAttribute("data-tip",`Copy the Lair Portrait Widget to the clipboard.`);
    // click event
    lair.querySelector(".dragon-profile-share-icon").addEventListener("click",function (e) {
        // get the info we need from the other two buttons + the alt text from the dragon image itself
        var widget_share = this.getAttribute("data-share");

        // copy the string to the clipboard using FR's existing function that the two original buttons use ;)
        if (frCopyToClipboard(widget_share)) {
            e.preventDefault();
            this.classList.add("copied-msg");
            this.querySelector("img").focus();
        }
    });
    // tab navigation support
    lair.querySelector(".dragon-profile-share-icon").addEventListener("keyup",function (e) {
        if (e.key === "Enter") {
            // get the info we need from the other two buttons + the alt text from the dragon image itself
            var widget_share = this.getAttribute("data-share");

            // copy the string to the clipboard using FR's existing function that the original share widget uses ;)
            if (frCopyToClipboard(widget_share)) {
                e.preventDefault();
                this.classList.add("copied-msg");
                this.querySelector("img").focus();
            }
        }
    });


    // COLI
    // dragon gods don't have coli portraits so we're only gonna do stuff for the coli portrait if it's a normal dragon
    if (id > 11) {
        // append new share widget to page & update label
        lair.after(coli);
        coli.setAttribute("id","share_coli");
        coli.querySelector(".dragon-profile-share-label").innerText = "Coli Widget:";
        // build the bbcode
        var coli_share = `[url=https://www1.flightrising.com/dragon/${id}][img alt="${name} ${number}"]https://flightrising.com/rendern/coliseum/portraits/${short_id}/${id}.png[/img][/url]`;
        // set the correct attributes so pseudo tooltips + copying will work
        coli.querySelector(".dragon-profile-share-field input").value = coli_share;
        coli.querySelector(".dragon-profile-share-icon").setAttribute("data-share",coli_share);
        coli.querySelector(".dragon-profile-share-icon").setAttribute("data-tip",`Copy the Coliseum Portrait Widget to the clipboard.`);
        // click event
        coli.querySelector(".dragon-profile-share-icon").addEventListener("click",function (e) {
            // get the info we need from the other two buttons + the alt text from the dragon image itself
            var widget_share = this.getAttribute("data-share");

            // copy the string to the clipboard using FR's existing function that the original share widget uses ;)
            if (frCopyToClipboard(widget_share)) {
                e.preventDefault();
                this.classList.add("copied-msg");
                this.querySelector("img").focus();
            }
        });
        // tab navigation support
        coli.querySelector(".dragon-profile-share-icon").addEventListener("keyup",function (e) {
            if (e.key === "Enter") {
                // get the info we need from the other two buttons + the alt text from the dragon image itself
                var widget_share = this.getAttribute("data-share");

                // copy the string to the clipboard using FR's existing function that the original share widget uses ;)
                if (frCopyToClipboard(widget_share)) {
                    event.preventDefault();
                    this.classList.add("copied-msg");
                    this.querySelector("img").focus();
                }
            }
        });
    }

    // remove tooltip text when mousing out or focusing elsewhere w/ tab for all new widgets
    ['mouseleave', 'mouseenter', 'focusout'].forEach(function(event) {
        lair.querySelector(".dragon-profile-share-icon").addEventListener(event,function (e) {
            this.classList.remove("copied-msg");
            this.querySelector("img").blur();
        });
        avatar.querySelector(".dragon-profile-share-icon").addEventListener(event,function (e) {
            this.classList.remove("copied-msg");
            this.querySelector("img").blur();
        });
        if (id > 11) {
            coli.querySelector(".dragon-profile-share-icon").addEventListener(event,function (e) {
                this.classList.remove("copied-msg");
                this.querySelector("img").blur();
            });
        }
    });

})();
