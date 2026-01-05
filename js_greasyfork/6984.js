// ==UserScript==
// @name         GR.jQ II - GayRomeo meets jQuery
// @description  This script was deleted from Greasy Fork, and due to its negative effects, it has been automatically removed from your browser.
// @name:de         GR.jQ II - GayRomeo meets jQuery
// @description:de  Vergrössert Vorschaubilder (in Suchergebnissen und im Profil)

// @namespace http://greasyfork.org/users/7597

// @version      3.7.0.1
// @date    25.10.2019

// @homepageURL http://greasyfork.org/de/scripts/6984  


// @match        *://*.planetromeo.com/*

// @match       *://*classic.planetromeo.com/*
// @match       *://83.98.143.20/*

// @exclude     *://*.planetromeo.com/*main/heartbeat.php
// @exclude     *://83.98.143.20/*main/heartbeat.php

// @exclude      *://*.planetromeo.com/*mitglieder/administration/pictures/edit.php*
// @exclude      *://83.98.143.20/*mitglieder/administration/pictures/edit.php*

// @-exclude      *://*.planetromeo.com/main/index.php
// @-exclude      *://*.planetromeo.com/main/

// @-grant       GM_registerMenuCommand

// ^^ Avoid interference with GR-Tools - picture galerie

// Note:
//       go back to Version 3.1 in userscripts history for a
//       more detailed and precise include/exclude list
//
//
/*
   == History ==

    3.7 oct '19
      * Restores blur out tiles on the Planet Romeo visitors tab for non-plus users

~~~ classic Planet Romeo ~~~
    3.6.5 oct '16
      * added: clickable footprints
      
    3.6.3 jan '16
      * bugfix: linkify was applied more than once when combined GR.jQ with GR optimisier
      * bugfix: GR.jQ broke 'New ROMEOS in da hood' on the titlepage
      * Updated GR-Ads remover


    3.6.2 jun '15
      * made GR.jQ II work again on Firefox (was somehow broken since 3.4)
      * Fixed EnableZoom
      * Removed gayromeo.com since this domain will get shut down

    3.6
      * repairFootprint - reenable footprint when you did a top footprint search
      * Added: config EnableZoom -  to enable/disable the GR-jQ basic function 
                                    to show a big preview when mouse is over some thumb
      * club link color bugfix ( since a yellow link text on white background is shity contrast)
      * improved url-parse RE-pattern now it'll also catch links like:  chrome://extensions
      * Updated jquery to 2.1.3

    3.5
      * Added: Multi PicUploadTool -currently(9.jan) in alpha-state

    3.4
      * Added: Allow right Click
      * Remove GR-Ads-Banner ('#div-gpt-ad')
      * Bugfix: Addzoom() fucked up preview div when called twice

    3.3
      * Enlarges Thumbs in search result by 40% (ZoomHack)

    3.2
      * bugfix for GR-Tools administrate user galerie & empty club galerie
      * added 'New' Galerie button for own user galerie


    3.0
      * Link Beautifier
      * included all GR-Sites ()

    2.9
      * Design changes (code & css)
      * Reduced server load

    2.8
      * PoorMan's Plus - ReEnable TextTemplates for non Plus user
      * PoorMan's Plus - Workaround for Saved search

    2.7
      * http text to link

    2.5
      * Auto close empty galerie's & close when mouse is over 'close album'
      * support for GR-Optimiser

    2.4 june 2013
        * Add pictures to other users galerie ( Open galerie and then use 'Add pictures from' link under each folder)
        * open galerie(instead of profile) when you click on the Thumbnail image
            -> enable/disable via script var  'opt_QuickGallerieLink'

    2.3 may 2013
        * Added edit comments

    2.1
        * Add PicID to thumbnails
            -> enable/disable via script var  'opt_ShowID'

 */
// @downloadURL https://update.greasyfork.org/scripts/6984/GRjQ%20II%20-%20GayRomeo%20meets%20jQuery.user.js
// @updateURL https://update.greasyfork.org/scripts/6984/GRjQ%20II%20-%20GayRomeo%20meets%20jQuery.meta.js
// ==/UserScript==
