// ==UserScript==
// @name         Torrent Mod Toolkit - Non stable
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Common actions for torrent mods
// @icon         https://raw.githubusercontent.com/xzin-CoRK/torrent-mod-toolkit/refs/heads/main/hammer.png
// @author       xzin
// @match        https://*/*torrents*
// @match        https://*/*torrent*
// @match        https://*/details.php*
// @match        https://*/torrents.php*
// @match        https://*/details*
// @exclude      https://redacted.sh/*
// @exclude      https://gazellegames.net/*
// @exclude      https://orpheus.network/*
// @connect      *
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle

// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/561425/Torrent%20Mod%20Toolkit%20-%20Non%20stable.user.js
// @updateURL https://update.greasyfork.org/scripts/561425/Torrent%20Mod%20Toolkit%20-%20Non%20stable.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const version = "1.3";

    var mediainfo;
    var uniqueId;
    var file_structure;
    var imdbId;
    var home_tracker_link;
    var isHidden = false;
    var activeTemplate = null;
    var currentResolution = null;
    var currentReleaseGroup = null;

    const ATH_SEARCH_URL = "https://aither.cc/torrents?imdbId=";
    const AVISTAZ_SEARCH_URL = "https://avistaz.to/movies?search=&imdb=";
    const BHD_SEARCH_URL = "https://beyond-hd.me/torrents/all?search=&imdb=";
    const BLU_SEARCH_URL = "https://blutopia.cc/torrents?imdbId=";
    const BTN_SEARCH_URL = "https://broadcasthe.net/torrents.php?tvdb=";
    const FL_SEARCH_URL = "https://filelist.io/browse.php?search=";
    const HDB_SEARCH_URL = "https://hdbits.org/browse.php?imdb=";
    const HDT_SEARCH_URL = "https://hd-torrents.org/torrents.php?active=0&options=2&search=";
    const HUNO_SEARCH_URL = "https://hawke.uno/torrents?imdbId=";
    const LST_SEARCH_URL = "https://lst.gg/torrents?imdbId=";
    const MTEAM_SEARCH_URL = "https://kp.m-team.cc/browse?keyword=https://www.imdb.com/title/";
    const MTV_SEARCH_URL = "https://www.morethantv.me/torrents/browse?searchtext=";
    const PHD_MOVIES_SEARCH_URL = "https://privatehd.to/movies?search=&imdb=";
    const PHD_TV_SEARCH_URL = "https://privatehd.to/tv-shows?search=&imdb=";
    const PTP_SEARCH_URL = "https://passthepopcorn.me/torrents.php?imdb=";
    const ULCX_SEARCH_URL = "https://upload.cx/torrents?imdbId=";
    const OLDT_SEARCH_URL = "https://oldtoons.world/torrents?imdbId=";
    const CHD_SEARCH_URL = "https://ptchdbits.co/torrents.php?search=";
    const AUD_SEARCH_URL = "https://audiences.me/torrents.php?search=";
    const HHAN_SEARCH_URL = "https://hhanclub.top/torrents.php?search=";
    const ANT_SEARCH_URL = "https://anthelion.me/torrents.php?searchstr=";
    const AB_SEARCH_URL = "https://animebytes.tv/torrents.php?searchstr=";
    const CAPY_SEARCH_URL = "https://capybara.cc/torrents?imdbId=";
    const FNP_SEARCH_URL = "https://fearnopeer.com/torrents?imdbId=";
    const SPL_SEARCH_URL = "https://sportscult.org/browse.php?search=";
    const GPW_SEARCH_URL = "https://greatposterwall.com/torrents.php?searchstr=";
    const PTER_SEARCH_URL = "https://pterclub.net/torrents.php?search=";
    const OMG_SEARCH_URL = "https://omgwtfnzbs.org/browse.php?search=";

    const SRRDB_SEARCH_URL = `https://srrdb.com/browse/imdb:`;

    const CONFIG_URL = "https://gitea.okami.icu/Dooky/Toolkitconfig/raw/branch/main/config.json";
    const CONFIG_CACHE_DURATION = 24 * 60 * 60 * 1000;

    const TRACKER_CONFIGS = {
        'ATH': {
            name: 'Aither',
            buttonId: 'athButton',
            displayOrder: 1,
            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAFu0lEQVRYR5VXWUxVRxj+BcKi7NAaCiRIsQQlqAEpoIAgxgiYxmAkJNIUiA8YRCMiqwsoO4Y1QXxoEx6VHQooqyJla4I80ASxkIYHWSoSEChCofP9uacheu89x0m+HJj578w3/z67SPPQE0ueAu4CTio4iq+hgJnALgFz1c/fq76L4vuPwJTAGxV+F98hgX/VHYVNPh1fiYkkgZ8ErLQQ/JKlv4XwLwL5Avj7//EpgbNipWrHzb7kECWy0FSkwK+S8E4COLxOQFfTTra2thQWFkZHjhyhAwcO0L59+0hPT4/evXtHo6Oj9Pz5c2pubqapKVhA44ApfpBISASg6nFNKtfV1aVbt24xdHR0ZG/66NEjun79Oq2srGiShSa+gzkkAoXinwR10paWlpSYmEgGBgYUGhpK+/fv10oAt29sbOTDS0pKaG5uTpN8rlhIAQF4+4y62zs5OdGLFy/IxsaGNxkZGaHq6mpydHSkvXv3Un19PWskODiYzTAxMUHh4eFsIoyZmRny9fWlN28QEJ8NMPsGBHwE+jTRhN2joqLIwcGB1tbWmEBxcTEdPnyYyS0vL1NISAiNjY1RQkICnT59moyNjfnwiooKevv2rTaNeYFAvECJNqmgoCB6/PgxmZqa0s2bN+nDhw9UWVlJnp6e9PHjR3r16hXFxcXx+t27d2lzc5MuXrxIdXXwaa0jDgRwOEhoHSAQGBhI1tbWfFhZWRm5ubmxbwwPD9OVK1eovLycZmdnORJiYmLktsR6EQggJoPlpGtra8nf35+srKwoPj6eHczV1ZV2795NQ0NDdPXqVSotLWUCNTU1dPnyZbktsd4EAn8IuMhJNzQ0sEMhKq5du0ZFRUV08OBBtvfg4CDPgdT8/Dz7SWxsrNyWWB8DgWkBOznppqYmOn78OFlYWHCMP3jwgJMR7D4wMMBzILWwsMAauHTpktyWWP8LBOYFrOWkYVdowMzMjL29sLCQCeD//v5+unHjBpNaXFxk50PkKBhzILAsYCwn3NLSwhrAjXFYQUEBubi4sEn6+vo4OjC3tLREMFdkJFK+7FgGgQ0BJCOto62tjY4dO0YmJiZ8WF5eHhOAU758+ZKSkpIoPz+fMyAyYUREhNyWWN9UTODp06esgT179vBhubm5TABh2dvbSykpKTy3urpK0Nb58+cVE1Bkgvb2dtYAwg6HZWdnsw+AADJiWloaz62vrzOBc+fOKSHAJlDkhJ2dnUzA0NCQUlNTKSsriw4dOkTm5uZchtPT03kOWbC1tZXOnkV1lx3shIrCsKuri02gr6/Ph927d4/c3d3ZJ3p6euj27ds8t7W1RTDXmTNnZE+XwlBRIuru7iY/Pz+SeoPMzEzy8vIiIyMjwhpqAOZAoKOjg06dOqWEACciRakYakYeQPm9c+cOHyiZBObJyMhgDcAE0NbJkyeVEOBUrKgYwdNhAmgA6gaJEydOcEuGG+NwANURJgkICFBCgIuRbDnGTkg2Pj4+fCAIACjT0MizZ8/o/v377IToGaAtkFMwuBx7C/wmJ4yKd/ToUfZ69IZIx2jR4JSolOgDEZ7ojF6/fk3Ozs5yW2L9e6klQ9uisR6gNRsfH+fb4pYXLlzg3hD1YXt7m0MO7diTJ084RDGH30xOTmojMSsWuSXDwIMhUZM0bg2nwxeFxtvbm+zt7bkVh9N5eHjQ9PQ0p2RkQBQkyL9/Lz2Y1O6cI2ZTJQK4PdpyS00kqqqqOAmhBsDj0QlB1ch8dnZ2HH6oBcnJybSxscHFCHMaBl5HsNHCzodJiJhoEPjsYfLw4UNWOzZErON26kZOTg4XKkQKOubo6Gh1YniYIE22YvHTpxlI4GmmURPajKpgDTf/UTpcHQHM4ZUEf0BH8bWCTZWIwOF+FsADaGHnD9S9jqV1mMJDBel5/q3430AAz3L81kIlDG/bFpCe53D/CYE/BYYF8ERX6xD/ASJxPRuj85L2AAAAAElFTkSuQmCC',
            searchUrl: ATH_SEARCH_URL,
            loggedOutRegex: /Cloudflare|Ray ID|Forgot your password/,
            matchRegex: /torrent-search--list__overview/,
            seedingRegex: /fa-arrow-circle-up|torrent-activity-indicator--seeding/,
            positiveMatch: true,
            idType: 'imdb'
        },
        'PTP': {
            name: 'PassThePopcorn',
            buttonId: 'ptpButton',
            displayOrder: 2,
            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADkAAAA5CAMAAAC7xnO3AAAAV1BMVEUAAAD///9oiM2CacFm5Mj/jGb842dn3auC3X/z82j/uWZw14xudcRwbsBmpdz83GZm4NBq26KP4Hrm9Wr/rmdmr91u2ZNmntln5L/902b/l2Zt1otnseEVRKmYAAAAeUlEQVRIx+3WtwqAMBCAYU2zpNlii+//nAZFCDooSIaQ+5fjhm89LoNCl7u+TpCvM8kopUNda81YVfVu78rS8rEtCkJI4/ZNKYSQkBJjfJerk4sv+SHnUxo1/ZMCJEiQIKOV8pKPe8s8aa317q3x7m2SxfUnxCWhAO24CSsei22B/wAAAABJRU5ErkJggg==',
            searchUrl: PTP_SEARCH_URL,
            loggedOutRegex: /Cloudflare|Ray ID|Keep me logged in|Your popcorn quota/,
            matchRegex: /Your search did not match anything/,
            seedingRegex: /title="Seeding"/,
            positiveMatch: false,
            idType: 'imdb'
        },
        'BTN': {
            name: 'BroadcastTheNet',
            buttonId: 'btnButton',
            displayOrder: 3,
            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwBAMAAAClLOS0AAAAJFBMVEUAAAAKfKcLodkJcJcKnNEKlMoKd6AKirsKc5wKhbQJkMQKga5GWjbDAAAAAXRSTlMAQObYZgAAAWJJREFUOMul0D1PwzAQBmCn0JSPJadKUImlsmCnyh9AkbsjlAjBVBbPZcrAAgvK2DVi6YIQmdj957DfxrGtBJbekNzdYzsXs72C8+H+iPP5X3AzCIdCDMP4H7jtH68fJ0VhIJhAzwPYYoRgHq6haTRwf2gOmJQlwG0ZdbBm7LLbYvIs0589LsuNXpXpsCDEcq6hrje7SnTzC7PmVCkDI13OLSCLiH4A9gZyfRIzoFTSnpy1kN+Zd0wEuBL5ElDgKgArHI2Ge7MjKUNomk8LrzjisWla+EJ9UFUdbBnu7tvCtQNc0QvqOE1XSO5xaQ6YlGwYEA6iuv4I4cHcJqBeh4BGH8a2oZQKYGIbF0qVPkQadgkR+fBMdI4k1pB40JURBVsigF1y5sCrYindlkhK+eTlMgnyNmZmFaH/3m1AWZlYEE2ReCPOKsQb4en/bOpFwoYFfRdT21+g7O9JWD8oTYntEb/z/32K0Kt3+AAAAABJRU5ErkJggg==',
            searchUrl: BTN_SEARCH_URL,
            loggedOutRegex: /Lost your password\?|Service Temporarily Unavailable/,
            matchRegex: /action=download/,
            seedingRegex: /tor_highlight_seed/,
            positiveMatch: true,
            idType: 'tvdb'
        },
        'HDB': {
            name: 'HDBits',
            buttonId: 'hdbButton',
            displayOrder: 4,
            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgBAMAAACBVGfHAAAAGFBMVEVPZHWjt8exxNNfdIV1ipuNorP+/v7Y3+RqcToTAAAA4ElEQVQoz6XITW6DMBCG4ZF8AkjcrkEh2RpNLgA22RvhsEZqZy6QmOt3DKpUWVlUyuufT3qgzvoHVFlQVOmU6W4fFFmvoJYpZep6Az+z9z5WMxFx4T3okrXW8VnS5UKLQJg5BB+fMvqTdIAwsg4hNmNyajYIvxDO3xncBaaR1nWl08jTNN2XAYaeUk3PgxtuAq5n51w8yQzutrg/IPPxlcH5IdDtsA0dHdiOr2jjoWNrZ3mAHaO9xmNLa6QHCrRsEeOhJeIGEQGzXoAyZn8qLYJSYIxRW2AUSOkzkNrl/X4ALOVfoodI6RkAAAAASUVORK5CYII=',
            searchUrl: HDB_SEARCH_URL,
            loggedOutRegex: /Make sure your passcode generating|nginx/,
            matchRegex: /Nothing here!/,
            seedingRegex: /tag tag_seeding/,
            positiveMatch: false,
            idType: 'imdb'
        },
        'LST': {
            name: 'LST.gg',
            buttonId: 'lstButton',
            displayOrder: 5,
            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwAgMAAAAqbBEUAAAACVBMVEUAAAAAAAD///+D3c/SAAAAAXRSTlMAQObYZgAAAKlJREFUKM990rERgzAMBVCnYISk8DQZgQJR0KfxPmwQF9aUkZSzv/8dBwXwsCRzlpJfD5G3Pfo79HRsYwFLyx8roiwOUR6HKItjRAqSZFzI9wqMBVg9HxVyFdm1iap+U24iRZVwDmjH4TglbhdogBWoMxTYrdqAlBliSUABPn0lx69EzuaoBN8n8LKvh/rOhvkMCDfnlgA6+Nv+oI3cYG49hoLHhQeJRuwHxie7qwtJseAAAAAASUVORK5CYII=',
            searchUrl: LST_SEARCH_URL,
            loggedOutRegex: /Cloudflare|Ray ID|Forgot Your Password|Forgot your password|Service Unavailable/,
            matchRegex: /torrent-search--list__overview/,
            seedingRegex: /fa-arrow-circle-up|torrent-activity-indicator--seeding/,
            positiveMatch: true,
            idType: 'imdb'
        },
        'BLU': {
            name: 'Blutopia',
            buttonId: 'bluButton',
            displayOrder: 6,
            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAGFBMVEUAAAABc90AaMX+//8AVcJElNyDtui51vILVXb+AAAAAXRSTlMAQObYZgAAAklJREFUSMeV1U1z2jAQBmBygHMkTLjWio3PoALXRrWdKx+GXksx+JzYcf5+d+uPXTuCmb6TyUyGR+uVNhaDXoabwd1shfLvfDwUQiilbhY5CQSQp1vlG6B8e3kC9Bi+nAAVoeVNpGmEu+HdtZmlraBeBcU5rwgovylPibVOlQpDxXrd8gJ7rZfGPRxkqExT48SAqyHe9Jp9XswOxTcADwy8IiiUZ/zsc+0A+NEFco9gCUu9MAf4pYLM9Rp+sLZnBb7Wf2AfCYK9TvrAOc60llA7VZAoQ7Bh5yCfPgKtHQDvCLw47YGodMZav0GVuUHRB06W4CYwywrgI34DGNVTenOdcwWqcQQSftGsZOmKDvCOpgOCFFAF6oO4dIAsX3ogShUHcYEqJ+AFDgfyl+iDi0HQ/r9+uII/ot6k8muAT+gC72o6YFqdFQE4RszsH3gQMnvhYGUMdoDDbEDZA8dEcVD3KCJdJzkZG5AwTJqW5RGubuMRoCZlQGBh+Ds+rEeVE1iHPeCuPDHVLO8cjGD1tKQWWZv0dsvjKeBg0QUoRMxBoboA43OQWoDA7q8Q3E1iA/DBMoQ8A1AdsG2HXUwuh12MA6crCEH77id7nCVUsgExhoV5mWnvrOcE2C0Y6Lk6p9EamvjOZkUXwOS6k+P5z6WJrokViNAVr8txobzQVODx603qr/NENXEHTUb8llJtbJe5s18ZumVt4nlh6LK3ibiwredbUbSBXk4cPP7XlxqJBkzgj5uC1tsCgA7QGgSDexkKuFzvi/4B/QXy6uI0Y3ArsgAAAABJRU5ErkJggg==',
            searchUrl: BLU_SEARCH_URL,
            loggedOutRegex: /Cloudflare|Ray ID|Forgot your password|Service Unavailable/,
            matchRegex: /torrent-search--list__overview/,
            seedingRegex: /fa-arrow-circle-up|torrent-activity-indicator--seeding/,
            positiveMatch: true,
            idType: 'imdb'
        },
        'BHD': {
            name: 'Beyond-HD',
            buttonId: 'bhdButton',
            displayOrder: 7,
            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABAAgMAAADXB5lNAAAADFBMVEUAAAAmaMr9/f+On/YhYNjYAAAAAXRSTlMAQObYZgAAAQxJREFUOMuF1M3NgkAQBmA5WIL9UIIHBhIPfPevBIxlUAIHh3DkbBUWISWYmBj3ndl3lTXOQeXJzk/iLBsLkXKTRCHyLhKCz1vAngcsPg7wyM6hYoYFezKHGcyRJLJQpFByClZFzfqKqhHaHhBrHmZ8R+gMYpP/wdo4LJOBd9Wz9wU0Or5DrWrgY6j6ZIC76iWBv0Vf8XCo1aI3aPCIMmFyZITOgA4wRWgBc4SGJQAochZALDIQUKRPoM7CDNghxaH6AocsDIAtYFwAe0Cnc6tTCqPIYlD4H9kGKAHH18cNEEY9cacADCwMo1rBaulWa/lrkysuP0uwKi8mYX3F8peQOV8uMo/kXwYU+/UEaSw57h3Xy84AAAAASUVORK5CYII=',
            searchUrl: BHD_SEARCH_URL,
            loggedOutRegex: /FORGET PASSWORD/,
            matchRegex: />N\/A</,
            seedingRegex: /<i class="fal fa-seedling" title="Seeding"/,
            positiveMatch: false,
            idType: 'imdb'
        },
        'AB': {
            name: 'AnimeBytes',
            buttonId: 'abButton',
            displayOrder: 8,
            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAElBMVEUAAADtEGrwLXzzXJr3ibb5r827H5vkAAAAAXRSTlMAQObYZgAAAWZJREFUSMeFld1xhDAMhNc/945MCjgzKQCSBiAVXPpvJheMkS3L431iTp9XK3EeIGWXFT39PAFHb33q9RgAHPSvoNbpbQC6tLf185jNQOOxEU0ADGXNIvvleuT6ybN8OsIOMsaWT2ykW6QDAqC1MgjgFjKnT4YNQKmcfj23lDbdpohF5goIKE6xWxPTlIEeSo9YDe3aHmIrPoptWuIhALGt5x1rrV59FSLyEG2OcE/+qghTLNNfDx2LHVYDEDmlEYDoMXUAx8ChAsjAR94KOiFmRDGm2GbIAGRKCaxdIM/bmzMDUxeIeZxavxIIIwfqjEn307PztmD0lCQAGcK1AK2dv5QlrUdkwFPWS+tARZxJvRml264YUJkncIISsMQEN6gvBhMrHo4qsSFLAmYEuBGAOALMCMAQOEaAGwEwIwBDwLaVpQKwyfrsSqDdVgAE4KOoM6B4zLyd6uMubkADAPvXsnz7qusfG/ZZ3SUO5DgAAAAASUVORK5CYII=',
            searchUrl: AB_SEARCH_URL,
            loggedOutRegex: /Forgot your username|Ray ID/,
            matchRegex: /Translation: No search results/,
            positiveMatch: false,
            idType: 'imdb'
        },
        'FL': {
            name: 'FileList',
            buttonId: 'flButton',
            displayOrder: 9,
            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAElBMVEUfotUje54mZHwpTFssLS8shKW30acsAAAANElEQVQI12MIhQKGEBcwcMXLcGZgMIAwWFzgDAUww4mBGcJwZHERgOhicXFgYHElymSYMwA+oyC+xS3dSAAAAABJRU5ErkJggg==',
            searchUrl: FL_SEARCH_URL,
            loggedOutRegex: /Login on any IP/,
            matchRegex: /Nu s-a găsit nimic!/,
            positiveMatch: false,
            idType: 'imdb'
        },
        'AVISTAZ': {
            name: 'AvistaZ',
            buttonId: 'avistazButton',
            displayOrder: 10,
            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACABAMAAAAxEHz4AAAAMFBMVEUAAAABAAD7EQT7SwP7rgL6gQI2FQfy7uiFe3K3trWUPwqVDgNEQTypcxD9y4P8hV84kwa5AAAAAXRSTlMAQObYZgAAB9BJREFUaN7slstrE1EUxsdVGtHFUbzWOBvvoIIBxTlMwQj2b9BxRAsuRnGsJotoFmNc+ERNJIuKaOtjo6EiqRsrFG02FsEHZOFG/ANcuFOoi+ys5zp3OnNvm0jdCf7KDNPF991zv3MfMf7zn3+PzFjZMOr0/C1rmFlrgHlv7G8GN4zrpbsQYa5cf+9y/SEkNFZYQ+YcaGz6sygMQ/mVLZ+BFRpkJm62ptqzraf1UBi8vgU6G/vJs7XHPCb/lCJnc6DTL4MJKY8tBsc1PfP7tSF7k2v4oDI6npm41Fs/xXW2gcKg0Y+sKF/nebp8iiTzOks9KvfQ9zVgvikW9MY5WlRB6cPS7l3hy7ElkDGMG6tE/JdBcsOolpVC7vMe5P3NMx12ffTeZTDHEgMoQelUSn+O96Y9e8PICCU5ZNNtNZUA+jnsKBtZAHMOzEtG2iExeDA8vPBzvofettuvyICNZUhc9RN9kuSAtSv83q2oOkRuo00f05ZdvDQAJ6kHAIme1ZMCrtrcXlhAZVgs5q3p/Aub7wXWhpcDQCtQ1r8prM19CMcT/QBaNu/Oc7RxkaE2QJEBo8+8GK5BTRQlEO879XOjRpqriGiHFqbZAhFFTg7FWaq8bFTrxi0WhrRla+SWLoDYVVENhiAmsH7/y4wJH0oPoVSj2qtLC9g+jymeBKmwc0j4pjxV3zc6ncZgOb0JULBgIdeHlzCcIgMW5SeGr6rn6nkU2JbwkOwFhQDYbLyhG4FPq0mh+Vv/0953EReZgX4Mvq/rEVIGlV3pFApTASyL2ekE6slyGwXD82j/QIWCDwlFkIj0QuV+a0YGF/jOL6ghHHyZo9S/kyp9BmgvWCHqFGAzPYIXqB6Keg8I3j27RO/DehQOjKqMCqHSdd5gNIXworW0ghYph0gup1Oi1Vwra0cpSr5GPWhhjNjIYk0CnEbiObRmsdwAphmsRgm3hsWYuZRcUAAWiIngI+Z4OAolmkSYNqhIwb5vdKAg7j6u6ImiSKEpDApUDNSrjbcftI0k2/i9SyvRV/Vt+tvxpOkzsgaayzOz4YOZnkSGvKWmK5ZBTuqVayUAyDlDQHV4daPa0Y+CmK/0HFqPhJu6XAPW5th6ArkRgElEEmsZuhhzAdF5NIn0trmK5boFOA2UpfNRN6gsGuyrkBRcWYCK43giAubiHt3gGsZ06RnJuWoB05QC4zPWSPOQMEA8rBtMYozYivs3aAXA7+3EZnzmRxUc1a/kxADjCA5wng+m1R8orNkqAFB9rpZi1lEMfC+aAekih3zUx+ILz/MATrjoaQYDHpIrOlGUbs510I1+12yOL3co5tuce27URkc7Dtd6aQ5toNcBuXy4pC37sBuYR2h9PK8Y7J6kly0NpnmarR5F4BGfVYPbioHvEbaM7pi6lqiNGzziiGpwRzFgHhFnv0418CmCZQyupfUjYgh3eQNxQXuCw30M9p/obbAFgP3BwD34yImaQCHqBsJz/XIGnxL9z2+BlxjoIQIA1UccLfcw+NWOGbw2EURhPDftwcNIsmDaHETxkqviUaRvszWaQHVDKGhkJQ0IChVatgW7ItRbBQst2IOHQK4eDHjy5EUUemhgW0vRW2RPxoP/gLNv5nXbl9nQHoV+tAw0s7/95ntvJt298WLpwoIGFFkZVWvtmAAyWK3638VccC0GSOFXa+sTi2Ak4F509dmsjw7QAso6HEHeNgHCGim6vlZTAHKgNwRFkKuNBtR962GgAVcE6VHSBR01r5IGaCzlHR1iUSTqUgSilgYglXIDXUZPJBqn092yjYCVQ33YrCmAXAC3IJEFDZjKpADctovjZJE9pSUZjgbY2uPkB3FU45ShEbBhk4GeBlQEVxczdPXEmTSAF09xAcqCy6I2wnkMsEwAeeMQAB7se2KYIH8/EuA7O1QJYMuc97+0RIrGL5PTbXasw0ERxCh1XZrHjvUxF7Tapru3DioBpDfsqy2kDwQYPHQ9WgFNs/lDLwHsfPX5MOA8dVWHAJUM0wp9ULB/G7KjR2eLCFMcsABK5Wz/D1Xtrpe0QBEH+QdtdYYDzmlAKetHHtm9mDhAC5bsriagtjlgTANuNmGgAE8BbifnibIQ7oosoJIqsjLcDxtBW10v1U4coIUceCoEOg0MKdpRtCaevN+BWNPMggVbLMPhFBtBY3GdEj1ynsR2qNq3hgFnQanaB39el9RLANYltyRUhBQBD4GaWY+UAG3EAvopsEY2hBABqSQSFcpiFuSYpwgMWgaU049/pI4cSRbsio4Xj6i6CXD2AFDFDHrisFzo4f+YLALDfnJ+AfjcgExPRxJSFxi0oaoQ9KsBM6DT8wjAisjW4LMEKATZ5rSfaQVcIZUBJzOFqixNdhawOmgN0C4LAQG4l9iBzA9GJ87gjuDKqs7OURcZtY6A+Wpf7SKeYgUH3kU8xkEUSUBbcHUUIM8iHG5nx68v+DwC3YJynGAGDBaCej8AYQRgL3MD3EJ1XjZzJR3ADfBCgBP4kALAZLgBrndO3MhlM6CX+jacH66lFAB/c2HOMR0wzV+9mBeR7AQOKD3OHEev5a3MgL25YwHOvIKeETDFAkiv5YoBwK8fTXhpAOyx60evYnUIQOs/rt5+Vpu4x978nsAEIkI8WSa+0e1Phthc3fr5o7X1dXMuc6pT/R/6B6f2DwDSuRMTAAAAAElFTkSuQmCC',
            searchUrl: AVISTAZ_SEARCH_URL,
            loggedOutRegex: /Forgot Your Password/,
            matchRegex: /class="overlay-container"|class="movie-poster/,
            positiveMatch: true,
            idType: 'imdb'
        },
        'CAPY': {
            name: 'Capybara',
            buttonId: 'capyButton',
            displayOrder: 11,
            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwAQMAAABtzGvEAAAABlBMVEUAAAD+sQDn43jsAAAAAXRSTlMAQObYZgAAAIdJREFUGNONzCESwkAQBMBLnVi5Nu6+gcuXkCgukifg8g1kBJKCJwQUNg+gskxmVFxWTNfObV3aOS2zuYjXTOLHNRZuH5KDb6bSI5CVWMRKQS7oSIPEL1mdCRdFdKIK3QuVs07eYiTTXTzAN6YrGH24gWcqoA7JD6Aj50JOTo7Wk9zbljbtmD8BcWoj5tHinwAAAABJRU5ErkJggg==',
            searchUrl: CAPY_SEARCH_URL,
            loggedOutRegex: /Cloudflare|Ray ID|Esqueceu sua senha|Service Unavailable/,
            matchRegex: /torrent-search--list__overview/,
            seedingRegex: /fa-arrow-circle-up|torrent-activity-indicator--seeding/,
            positiveMatch: true,
            idType: 'imdb'
        },
        'FNP': {
            name: 'FearNoPeer',
            buttonId: 'fnpButton',
            displayOrder: 12,
            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwAgMAAAAqbBEUAAAADFBMVEUBAQHY2NhHR0eUlJSEE9rLAAAAwElEQVQoz93NIQ7CMBQG4H9rJiYq52dq8PNc4rUVC6mf2QEWsnCHBYtZQsYBSAhi4Q4NBoFGYTAYeN1usT9pm6/vTx6WkGFYnZ7AZTgyPBG1QEGG744BRtk5INvgwFBWWQYfxG9VJyXXaiAXtpjhIKyoMxdqvvqmZeq8KywiokaWcu3HUOEtSsuRKmoZLyiT3Ii2gDBA0fc7/puxlx9B4EQauKcmMgGpRmyE4YcjGTrWcpqoBrjicf5NkxEhOZaRP01rNfngb+g+AAAAAElFTkSuQmCC',
            searchUrl: FNP_SEARCH_URL,
            loggedOutRegex: /Cloudflare|Ray ID|Forgot Your Password|Forgot your password/,
            matchRegex: /torrent-search--list__overview/,
            seedingRegex: /fa-arrow-circle-up|torrent-activity-indicator--seeding/,
            positiveMatch: true,
            idType: 'imdb'
        },
        'HDT': {
            name: 'HDTorrents',
            buttonId: 'hdtButton',
            displayOrder: 13,
            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgBAMAAACBVGfHAAAAHlBMVEUAAABRUVFhYWEdHR13d3dCQkKRkZGwsLDt7e3Pz89GPqTkAAAArElEQVQoz2MYQBAoKCgYCgQGUD6Lk5KSkiAQKEEFFGEqGQXAFLMDXC+ExazA7MwQwurmysDgDBEQYJ3MoMHePiMBJqAAFNBkT2BqQhaQZEtgSIcJODA2hXoCBcQNlGECHR3TgQLhCIHGUHc2B2SBZgZxFgcGNwZhqADQ0DAWBeYimIACWCBRPQEhkMwQwpSexAATQPhFAUI5ovmWwcxJCQQUBV0QIQYBAQz0AgBNDR38O7n/UwAAAABJRU5ErkJggg==',
            searchUrl: HDT_SEARCH_URL,
            loggedOutRegex: /Cloudflare|Ray ID|not authorized to view this/,
            matchRegex: /No torrents here/,
            positiveMatch: false,
            idType: 'imdb'
        },
        'PHD': {
            name: 'PrivateHD',
            buttonId: 'phdButton',
            displayOrder: 14,
            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgBAMAAACBVGfHAAAAGFBMVEUAAAAAAADruwrhuSTly2XNpRHkwT7NrTZrvVs/AAAAAXRSTlMAQObYZgAAAIJJREFUKM+t0U0KgCAQhuG6Qf/7hA4gEa0FqXV1giBoHYbn7xuJSJTa+G5mfHYykac4fUruty2plQdiG5IwUEhMKaTJwAg4xSbRIADVDtCrPjCq1Qs9NsXVhJET5C3FFwPcCx225QVZg22uZ4Ks/gJGEZSMYGIm53Nh4PcuzimdY7td+tEu563AqZYAAAAASUVORK5CYII=',
            searchUrl: PHD_MOVIES_SEARCH_URL,
            urlTv: PHD_TV_SEARCH_URL, // Use TV shows URL when torrent type is 'tv'
            loggedOutRegex: /Forgot Your Password/,
            matchRegex: /class="overlay-container"|class="movie-poster/,
            positiveMatch: true,
            idType: 'imdb'
        },
        'HUNO': {
            name: 'hawkeuno',
            buttonId: 'hunoButton',
            displayOrder: 15,
            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAolBMVEUAAAAAtPbjdHoAtPbjdHoAtPbjdHoAtPbjdHoAtPbjdHoAtPbjdHoAtPbjdHoAtPbjdHoAtPbjdHoAtPbjdHoAtPbjdHoAtPbjdHoAUnYAtPbjdHoAUnYAUnYAtPbjdHoPqeXTcnoAtPbjdHoAtPbjdHoAUnYcVnYAj8YAY4wAWH7VcnqcaXlVX3cqWHcAru4ApOEAg7YAfa4Als6OZ3hxY3jR+GyyAAAAJHRSTlMAQECgoPDwEBBgYCAg0NDAwICAMDDg4LCw4JCQkIBwcPDgUFBi1PguAAABu0lEQVRYw+2W2XKCQBBFAdkiOy4gbonOjNFoTEzy/78WUGCmZVqtwkfOa9e9xfRGKx0dHXIcNWcgiwy1HPe2eBGQEi8bAPHUpyXhEjNRAwIYvVSR/pgCQk0iH3A5t1gVkTWXc4vhtX5BpPQsW6dSllDfIwivbxRBh3qM988P1OEhPWMPOLyg+i+Wc6AY/bL6BqY/blnBniKYl45ICMY3O7NBH5Ge++fGA0r+KIbWzKCRRFFvRApOrGRDC8Z6HKdmI48WlEfWJa+FxY5V7HP5JWN2DC1sWAKjniDLIz+s5kB9u54r4NCHLxAm0BqduMFmbAuTCd/gEU4EhnPLOGD8YsrxFSLgKCITrp+AgEsFRANPAcy4wQxGfMQgUABzbjCHkbC1wTOf0DqJoIyZIrASy7gWI1NQxraN1L6VLQKohsm4HiazGiYKsJsLMYiixOD7hI+zmcZxKFmLDsE4Vp/wSzFcsJPRlYbq9dZL9e5a391Z6yXZzR8Lqp+2/bU97efKO6dJxjsfUvQVxJEdGGoR0WQHhis7cRIo9/iJ40N5qqFHVmLUDQ2PrLqJzbQ8slDUHEsWsLUcpaOjQ84/6BL1Frw7jUYAAAAASUVORK5CYII=',
            searchUrl: HUNO_SEARCH_URL,
            loggedOutRegex: /Cloudflare|Forgot Your Password|Forgot your password|Service Unavailable/,
            matchRegex: /torrent-listings-name/,
            seedingRegex: /fal fa-leaf|torrent-activity-indicator--seeding/,
            positiveMatch: true,
            idType: 'imdb'
        },
        'ULCX': {
            name: 'UploadCX',
            buttonId: 'ulcxButton',
            displayOrder: 16,
            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAGFBMVEUCAgL////39/fm5uZwcHBKSkoyMjKgoKDkmP8gAAAAWElEQVQI12MAAvYCBghwUoHQLIKCDmCGo5KSCFhAKNhUESTErspsEARRzmwAJPAy0tKYFNLSGBiCBQVDXAUFTRkUgUSwYLkwgyAYlAoyOENYJgwsSmDgAADO1wwnzE+V3gAAAABJRU5ErkJggg==',
            searchUrl: ULCX_SEARCH_URL,
            loggedOutRegex: /Cloudflare|Ray ID|Forgot Your Password|Forgot your password|Service Unavailable/,
            matchRegex: /torrent-search--list__overview/,
            seedingRegex: /fa-arrow-circle-up|torrent-activity-indicator--seeding/,
            positiveMatch: true,
            idType: 'imdb'
        },
        'SPL': {
            name: 'SeedPool',
            buttonId: 'splButton',
            displayOrder: 17,
            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAw1BMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADQ+P/M8f/L7/+73f4aHyUOFBvW/v/X/P/U+//C5/+/5v/A4/+32/+20/GmyvCsyumTsdNre4pdboA/T2E0OTwsMTcgKTQsLzIcJjEWFhTS+f/O8//H7f/J7P/E6f+84P+11vi01fWrz/Ww0O+jxOeXttiGpsqBoMGSqLx9m7yLorl5kq1vg5ljfJlvf49AVGpWYGg3R1lAR04nMT0vMzcLDxQEBwsMCwoHCAnmygrtAAAAB3RSTlMA5bJ+ciy5LvMwCgAAAK9JREFUGNNlT9UOw0AMO2ibK4zKvHbMzPz/X7XrdZsqzQ+RE8uKjQrIlGBMqIw+kECgZkjlrpT72VQPSkW/u1qrn0vcD/ACuG5b3VHPeYKMaDYb7/w620S2lwBQRJYdS50GBtTYiTsJwuvmQGtzGtVjPjHCxtzTdX7Zq7k4ED7TYeMCCweEhYpMbiOcrApG+dsCD59Z+o0T+RvsyGwWAEi/6JnZ1GJQKuXSMBH6X/03UswNMDkCCoYAAAAASUVORK5CYII=',
            searchUrl: SPL_SEARCH_URL,
            loggedOutRegex: /Cloudflare|Ray ID|Forgot Your Password|Forgot your password/,
            matchRegex: /torrent-search--list__overview/,
            seedingRegex: /fa-arrow-circle-up|torrent-activity-indicator--seeding/,
            positiveMatch: true,
            idType: 'imdb'
        },
        'MTV': {
            name: 'MoreThanTV',
            buttonId: 'mtvButton',
            displayOrder: 18,
            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAMFBMVEUAAACLAAB/AACXAgK2Hh7sfn68KSnUcnKlERHMVVXJBgbHNzfbYGCpAgLFRUXsbm7V8QghAAAAAXRSTlMAQObYZgAAAdRJREFUSMfV1L9LAmEYB/B3sTKNejJSCYK3SBrveoemoOEdghYXERpqSK4hBLejiAaFcHTMRQj/gSaXEhpaDB3MOZBWSfoDgnpePeX1uvfewaW+w9293Oee9wfcQ/5dSs79WgUCzr2rLJEbXIO6mWZ1r3ApvnMENdWxgCZJzdsw8c1x6jE1jnxEdqNfsw6KhQIwGGWZ3o9B+qrcq2UQMGaCJJ4mAS8WO4yBJLZGwEZg8WJBfL4xCj5vE1dSqZNvJ1+3FIASv7zrQIjCpi8ILP8CZ5PDHTeoG/7gw1zyBS0T/EGV6gBMB4K8AxDjnIuf4pnzQzeYacMwhlPMDUKvDoji4A6dEqwSEsZqJTeYH0zBACL4bOLVDQINnHjtxQRAALCu2ibO3iUtfFKBqljeKcC+CrScMsqTxPVFcRMRJQi2YRXPLK4EovylCYYa4HUPd6IAeMwLIEIUIEaSuEq8e4KsOOrdkDjyJU/QAkxcrBIMT4DFBahTgJInCFQRrJAjk0UU/0U4+3ZTwmZj5yTgl+nBItWAOQ1YzANQuVM2G+V+76FmWVaGi+SpBNIXFdEmmdzkKA4SXn2SSX3SGAG7MaxgYgUpCblD2s1ypS+WwMc5/yR/Ij/XK54cbp5ZdAAAAABJRU5ErkJggg==',
            searchUrl: MTV_SEARCH_URL,
            loggedOutRegex: /Cloudflare|Ray ID|forgotten password/,
            matchRegex: /action=download/,
            seedingRegex: /Currently Seeding Torrent/,
            positiveMatch: true,
            idType: 'imdb'
        },
        'OLDT': {
            name: 'OldToons',
            buttonId: 'oldtButton',
            displayOrder: 19,
            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAMFBMVEUAAACYmp39/f2Ih4nXmBl1cm+7t7KxpJ3u7e3MycaqezHb2dimi2hXQjnxwK7778qB5DraAAAAAXRSTlMAQObYZgAAA2RJREFUSMfNlF9IFEEcx1cDU+yhH9NZUYKOoMb10LCsGdLbgLT50LGcQiVoVmoRnVlmWnAplXYvdqVWR0WwdbEeIYJFSiF2/VFECP+E0j5J+CI+GoGwzdx5d3txU68ODMvufPb3+/7+zE/aXOtmz3/OzbK8f51nydWuQdFhMdtN5HD1gtC61l4EblMxRT7SiayQ3G/gEIp42gzEUfWppEfal5r5sCoDlKz1ejL3eFMCt5dkQLnzT070n01t4c5PAEf19/dmlUDF1hUCSHPnzp2SBACzgGTN3zcoSuMVAqDM+/aIwszWALl95kyNsBK9LkTwjTkxkK/BlYai5+4GIeFslt1EQRpTKfSikIMlN8skoU6CkL+jWBaa6ARAQxjXCU0AA/wYFyCBiQwOnMK4kJQKPQC6hLGTQGqgCUCGUowxQd7UTQfIBYcYAIhXHKeQcKwWgAHNObx4DmbGaZebxgwoLsSAuu1c0cqClGFU2oACAHAg1MEA7qFfMScmp5dswBYmkhTwRDRwRXsNXa1YXbbJzSIgl+ZzoJW93dJVgwaTAKlO3jXUyTPlYS9PdHWSvmZAUhxn/XUx4OrpgREOJPdtt4/EgJwH45fpi+lkIMOpAQOK2BTJOzM7E6ah1dYkIPMR4eUc9krpgQuzpmEElxOJ8nE1w7whigmbFm9/mMPH9deNto6V/Sw23hD5rF9Gb1dovSf1Km+8UE0sCQ0+mQHtsJ1JkNrqzYmQNyGvk/CL5wIAOVrrrCqzLWgLcF8lYoccgJzoL0ZIp+NxoPuNlEkiAIIDkS93DZXSirx4lgfZP0RhjIais3RHMBSmdCwGdERmTB8BRFD0itAjzx4btPyvCQCgbEjYT19a6+VtdCJp3KQxD1DKo34XLu+2fusBXf1qB7YwmcjDTS2qnkLLCh8JT44lXYyYhOxFw1NkWSPqq6xrHTbgHjgAopO7sGerZf2iA9c/7o6NyfMYAwNK4lf9orVGQ5/z0jcCuNYf6LqvuR07R2vbo7WvtNbp0YS+h10Y4z6lDHd1RwdhtvElbMtDGo6sANvOdzWRYlB1L61I5GgoAjSyHe1JaRsdkM6piY7qx7i4vjZQ29I45OzhEsKqV8rWQzXxlqm/2uLlz643LVLk4nD/YRoUzqupVh78VJm0OdYfHiUPXpH3KX8AAAAASUVORK5CYII=',
            searchUrl: OLDT_SEARCH_URL,
            loggedOutRegex: /Cloudflare|Ray ID|Forgot Your Password|Forgot your password/,
            matchRegex: /torrent-search--list__overview/,
            seedingRegex: /fa-arrow-circle-up|torrent-activity-indicator--seeding/,
            positiveMatch: true,
            idType: 'imdb'
        },
        'AUD': {
            name: 'Audiences',
            buttonId: 'audButton',
            displayOrder: 20,
            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABAAgMAAADXB5lNAAAADFBMVEXi4uIGBgZ0dHSsrKx+oK7NAAABfUlEQVQ4y72QoU7DUBSGL1sm1oHsI9R0BlNTA3aCZBn724klMHAYxgOQ1EwMX4+BNG3F3oBr9ggVGBzJ0iZzGEw5t7TcU4XbnyYn/e6593w54pDplqUqZ6WsQR8IqGRY1qAHnFN5jxvgoDr7eG2ABVy3OkwP49Yb4dicCR7cWtOWBh4cn4MORiuPgyOsRuDgBF+PkAz0YS0QMNDzzAm561jTbE6qOuYsnIVjBuicehgIJ/Ba7lgA3L2DC2DrcdE16OOiW1CT5KI+SJWJkghXdfxsnl1hyczVCpm7+lFQi15i6fhMFTe4e/FIVa8YFMdnK1Zg5Wnzp5iyhjaXddHmAJg7mStA7nrFCug1m6jTqNL5fVl+Uk9jDnW7BzTuAAI1C9PGHJBKA7X7v4mifOMa0W7YiY3UlgrsI3cQ7YdGPEjjChSFa8i8cN8MmYgKDKmjSGwxSPNfYBPICwXc4O9KkbilIb83QuRp9eguUY8m1GE/s7FqSlc0ORXiWBwmP6Rhqjkj5tQlAAAAAElFTkSuQmCC',
            searchUrl: AUD_SEARCH_URL,
            loggedOutRegex: /Cloudflare|Ray ID|SSL \(HTTPS\)/,
            matchRegex: /Nothing found|没有种子|沒有種子/,
            positiveMatch: false,
            idType: 'imdb'
        },
        'HHAN': {
            name: 'HHanClub',
            buttonId: 'hhanButton',
            displayOrder: 21,
            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwAQMAAABtzGvEAAAABlBMVEX/Wj3+8vAVLMrsAAAAZElEQVQY053QMQrAIAwF0C8ZHHsEj1qP5lFyBMdCwfSrlbYIHczw3xIS+LA2b/JWKfCwBJACjuBwQBSoRCGJkRbQHzKjExpmM1yY0Afloxu/yrjiKi6inu4VZOboJcBOsn8bvABlfn9fBntNQQAAAABJRU5ErkJggg==',
            searchUrl: HHAN_SEARCH_URL,
            loggedOutRegex: /Cloudflare|Ray ID|type="password" name="password"/,
            matchRegex: /Nothing found|没有种子|沒有種子/,
            positiveMatch: false,
            idType: 'imdb'
        },
        'GPW': {
            name: 'GreatPosterWall',
            buttonId: 'gpwButton',
            displayOrder: 22,
            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEQAAABJAgMAAAD542j/AAAADFBMVEUAAAAvnMErkbQoh6jzaF/zAAAAAXRSTlMAQObYZgAAAP1JREFUOMuV1D0SgjAQBeAgpnBGyhzBI9DHG6TICgUFjb1HYLyD9/FoTnTdJPsYBykoPpK3m5/BrD+NBxlAaAah5eCVEEUQQvEgQcmZpkJ2KaWOXpV7LQ4aQrEbpNkgbZIAY1A8iNHVI8hYidPB5qGDTQp+/luqB8FSVIujd/As0BFdZZ2SUUsLYk4fWaqGdcuFHHnhWfZcLYtFySvn7bGeRfqxAWQ0TuTGHweRwN1GkZFlkmVEvsazCPGYhYWL9d/JMi29RNJ4S1O1i8WJ/BTPWwbishgtA4sViSCBpdHBptXBuaEL3I9JxOYYFa3uvHSjj6ysP8CtVz+8TuAFMuyeWfAUrHEAAAAASUVORK5CYII=',
            searchUrl: GPW_SEARCH_URL,
            loggedOutRegex: /Cloudflare|Ray ID|remember me|保持登录/,
            matchRegex: /first 0 matches|显示前 0 条匹配/,
            positiveMatch: false,
            idType: 'imdb'
        },
        'PTER': {
            name: 'PTerClub',
            buttonId: 'pterButton',
            displayOrder: 23,
            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAACRlBMVEUAAAD/5M0AAxcBAAsABA4GCREBAAkAAQIAAAwAAgf79/WYXCmYVR8WIS9aPCaHUyQIGCtKNSYAAA8ABBcAAAn/5tAAAAL/5cv/59FmZm8AAAD99OlGW3L///8AAAD////EZhs7MS7mklD2ji4wLC7lgiz/q2P/oUnsk0eeYC8oJyxlSCmxZBw5IAj/oVf/mUFyQSAHDhcdIixONiP/t3PNhEe2eUwzNUA7MDD/p1kWHC7/s2F4UixAKh4WJDjTm2UGFSkUGisqKCkZFybYiU9LQjYADSH/o17jrojSjkwkMj9dTzgDIkEAGjwADiMADCH5y6aBWjiAXkj6q3oqPUoNMEoAAAA3LSf/uYAABRsAAAAAAxj5tnz/2bi2k2sAAhX/47wAABr/5bMdISf/3L3/z6P/zaL/4sr/9d8GEh0AAAAAAAgAEy//7NPQyL///fn/8+gAAAAEAAD/+fP/69f///8AAAD/9eokNkLw7OozPk4AAAD/eQD/bwD/fgz/fQH/fgD/gQD/ewD/dwD/ggD/cgD/hAD/dQD/aAD/YAD/ZACGVSydXimqZSj/lRvgdxnxfBP/gw7/hQj/igP/bACbYTKTWy7/iibAbSbYdyHQciFwQR7/iRz/jgb/hwD/hQD/agCFWTr/lDVZQTX/nzJgRTJ2TjBQPTDWeiz/mitqRytFNSudXymYXCm3aCMhHiCUVR/zfx3mfR3/hBj/eBjZcBT7cxL/hQ75fQ7kYg3/kwz3eQjxdAP3cwD/awD/WwD/VgD5VgCM/EvEAAAAfHRSTlMAWmhYPR2DXlIkI/Lw6OPj4tbWvnt5cGlaVjY1LRQUDP37+ff39/X19fXz8/Pz8fHx8e3t6+vp5+Xj4+Hh4dvZ2dfV1dPTz83Ly8vLycnHx8XBv729vbe1s6+vqaejn52Zj4uHhYN8dm5oaGRaVExKSkhGQkIuLCoiIBYI3zbhUQAAAeFJREFUOMvFkFVz21AQhW9lrJOGG27KzMzMzMzMzO2qumDLkiExhbHMzNz+s65GM1bciV6T7233nJndc0j34Csp7ZVBSQW53t/Se29S4ncySO6rHDG7b9pQ2BwMyJ3RqlcXfNU6plw1ddf6qB8yCDzYMpdS+c8wHzEon9WYZIxREKgFqZ+1w9Ct2RR9+l5iUPy6Nhp5kZX1QwHgsdqXkTdTNy58pwrg+rjzBLnkliTJcXD6dwZA5585LRW5Tk4cqaC9o956lLifUQ5CPmDm2jXvowqQajmS1m/vrGN4NXDCHD15Dfj4r/rjVhfLXuEm9f6yOTr71OAYGn+BGJibRmMzvJ85SncZB9B3WHU6hsQYhlxZtsKwVE74zAUE5FKSpuixgkV8m1Mw6NCxo3sGG80pv5cTi/2PMESweukiSGmhkOCo6x8qLL2qMMIARMuqHEUIo1HO9U9XiMW1BQ1+rK5mTbaqIJSqP5fcJJ24OMmI1T5m7YBkIhGPv23KLSMZnBr4hYFozV38ZPTknPzth53kP9wPKXbfOnbGhhuuKtIFu8MUMES+k3SNa10UQ8hPzxEbyvOa8Eftns/O4B0VUznXZhI7iu8n2ljb3822hm3P68Lh5mlnbQ0Oj9fr8NwiPcQ/+8G7/8ts2csAAAAASUVORK5CYII=',
            searchUrl: PTER_SEARCH_URL,
            loggedOutRegex: /Cloudflare|Ray ID|SSL \(HTTPS\)|Err code/,
            matchRegex: /Nothing found!|没有种子|沒有種子/,
            positiveMatch: false,
            idType: 'imdb'
        },
        'OMG': {
            name: 'OMG',
            buttonId: 'omgButton',
            displayOrder: 24,
            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwAgMAAAAqbBEUAAAADFBMVEUnKCcK/AIhjCEWzhXijGvaAAAA+UlEQVQoz63PMU4DMRAF0MFWChNtS05giQusaGnpaH7sIlrtBSKtqAISwuIMy3KHpE7vQ2DRIBRKIlFSL409s+lx5SeNZv4nmo+B+O2x4r/C6BjGUx0LZpFMV1CHT+ULFhqBNwzmMX4U9ObmuhesI2M4g4xdKEeMmi5ltY1k7sZDjrMhu0aOp90upaeU472gWVKV483x1ZHiRFVrD4O0SH7B25+b1RVD3fb2/6AnmH037rXAAFiOuZN63//cA4549GGXIi+h3ClDOtmQpp1q6WTac+mkPUkKcuGNoQHPYxXQMexxG4bTowLj+ehx+9tOOrlQoBI2dPL+ANGlVMkfLQX5AAAAAElFTkSuQmCC',
            searchUrl: OMG_SEARCH_URL,
            loggedOutRegex: /Cloudflare|Ray ID|Forgot your username/,
            matchRegex: /returned no results/,
            positiveMatch: false,
            idType: 'imdb'
        },
        'ANT': {
            name: 'Anthelion',
            buttonId: 'antButton',
            displayOrder: 25,
            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAAA5FBMVEUAAABwzP9SyP9jx/9SyP9fyf9vzf9vzf9bzv9RyP9RyP9RyP9wzf9Sx/9Rx/9SyP9RyP9SyP9RyP9Rx/9QyP9dy/9Yx/9Sx/9wzP9RyP9SyP9TyP9Rx/9wzf9wzf9RyP9SyP9Syf9RyP9vzf9gyf9Pxv9wzf9RyP9Rx/9vzf9RyP9wzf9Rx/9wzP9wzf9wzf9RyP9vzf9RyP9Rx/9wzf9wzf9RyP9wzf9wzf9SyP9vzf9vzf9vz/9bxP9vzP9wzv9wzf9vzf9wzf9wzf9xz/9Rx/9vzf9wzv9wy/9Syf9vzf9Sx/8AATiWAAAATHRSTlMA2a8Emw4xtAqkhlmOJEerqJZ0NB4TEZJ7eDoWUNW7nylrXjgZBpuPrpNwZGM/J8eKiUAuqIKBdm9nX0ocCMzAWs+toCB8alROS0WA3dP38AAABRdJREFUWMOtl+la4jAUhlPaQmml0AIiZZFNFlkEFEQdFZdxvf/7maRJk5y2wgh8P3i65W16li8BbdOJIumaXugm0c6CQAzSH8jBiXEQ4DM+v6WHqeQhgGt8XmfHtfX+wKciQmNxerI38AifvihCg+KewDFCr4qswS7AIz68js8WMu9hp8TczWbPjwrRG0LHNVhEu0qfvM+elD8IDWXeB74zPtoZ+qeNwY8S7xZfnDzhTO2hL4m3wuevF/hgsQdQ/0gFvBk+7Tyyqe4hdUjT0iX41G+S0/Fa7tTRtJ5ZtvIdJJQkmGcVs68Upsf7rbjGtJ+QlFt+Vvg940i5IC3SZbj/CqNhlxJQuWaG371u45+BIqm9KfA6IjqrpgEw67R0JGmmyKr/zPM0rXrsHxW+E07ZnRJa2p13wg3JtTnTLTL+tOUj1QYJdr5k2lFXGSoh/YnFnbkJKm0uVQo/Om549n0QR4C7OIl1MrWc4PpbgPcq85spiWr5jF14lnArjoNyE5I0aRkq2kueIpddm/AqHB5viJ9QSdywQcIt4Lz1W4M2QrRy7h0AdOSZA+VZreL1NLWmMZ1cP8SkJQ+GWSJVDgRqrCBX9TVN2HhQi6+cc6kxpDQbGAh0w6774M6QeUQ3Cjw+DYacXoLOzkJgtiCsYvHAVxgdwEYEkWeWoPkj5lYFv4SUiZ2AarJBH1eKpLHMK2ZLJLxVOj/fByzccj3z1KXBAEqzukspsoacRkkjf6RWLps+rxmMroJg8GtEbwAIVhcTP0XyoBqRBGUb0Y82WQQB8EVurBzJbEMkVv7GHgnjEroj9Vv9AjS01DEejR235UKkJDMw0x597kUG1qTStsLlsATzIdfLANiijy0AcCKA9GlHFVUEhrtkin14xddKkXUngNOwwTRhJWfCU5yyjQ8AvgsgXZL6Beg8cEL5GOsYA+BKADXYAWR4L9xsqiMbBDPFweCIazCOAE15OahqoURbALhZPdnpjDm1Bt0Ws3RwY1bKmqjNLUCTT7Bjmlqif0NrVPXcoOf8dxjcu6dwBYPHPINzkQ3NZouR7p07OfwunTlZzjcH02a9V08J1e9Cha0ZsguUPvXgzQXP6nAXWTareWY20bKB7j+irsOlYcwWrX7oFJ2YQz/DsiOU+7YrG4GzaC+L3i2prL8gc9nKFwyIMTKBLwHHrsuP2fSLW4k4lRrSumOdm1pgsJ0nGdgFS0COFKFaisHlRvLO4MbPsg46D/z3E25QxG/MRnl/M2C35z9xE7tj+gDAgsl8Fir7Sfvw0ySFeWZlmT9S1UFOXhFQhn4PlHNJ50WSjwNZyfLGjn5xKr4D4ecW/Vd9s0ZnZe8E2RxEQwilOpA3UvneiwJ1TVgI/Ksbv3EvpiHPr3my/oEZVvk+e+u+PRPdEmVEIV3iGKYlE04qQNcxQKMc3r80Aq+gnVnoJ8rcpFIQOIndZLtwWWuk4SqQSTQpD9YgbBMoK+g2kslLzmPdcWkhYFwwJfHyHL90MyR+IEc94MntGuRdoR+lj3D12uSgBGsSSWo/bZ4gVOG8yZcFrrSNhO5qSjiC29WSaWZVNto3JazX/wB6lmuWNK00dS0P2HalG+EN0R56v4jwrvbAfTHTh2vJ7rgXJUZfO9ImbyklTqtdYGpyKCYHNfs1q5i8nUlev0MFQiVhVvdPcHsTr6v+HpjcwBsgdFDgAh0WuEYHBaaS6KDAhY4OCXwGhro38HGtogMC60MDbdA/03tog+lGjQwAAAAASUVORK5CYII=',
            searchUrl: ANT_SEARCH_URL,
            loggedOutRegex: /You appear to have cookies disabled./,
            matchRegex: /Your search did not match anything/,
            seedingRegex: /tl_seeding/,
            positiveMatch: false,
            idType: 'imdb'
        },
        'CHD': {
            name: 'CHDBits',
            buttonId: 'chdButton',
            displayOrder: 26,
            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwBAMAAAClLOS0AAAAFVBMVEUAAADi7fn+//+WAAD2+f3w9fvq8vrkuS/pAAAAAXRSTlMAQObYZgAAAI9JREFUOMtjoA9gUcIADmAJJ0wJFbCEigsGcCJTQjUUAwSRKaGWhgGS8EsoigkmApEgBCSCeEIQCTAbKg5RJISswxgMDMEcqFFgpcLGEADmCCFJQIWwSBiC9BgKYpUAy2BKKCkbAxFJEkCAXwflEgjnEvYgZpAQCkSoFkw7kMFIkgjBlHAFS7Bi5toABroAAIi8c+o/9ah1AAAAAElFTkSuQmCC',
            searchUrl: CHD_SEARCH_URL,
            loggedOutRegex: /Cloudflare|Ray ID|SSL \(HTTPS\)/,
            matchRegex: /Nothing found|没有种子|沒有種子/,
            positiveMatch: false,
            idType: 'imdb'
        },
        'SRRDB': {
            name: 'srrDB',
            buttonId: 'srrdbButton',
            displayOrder: 27,
            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAUVBMVEUAAAAAAAAAAAAAAAAAAAC7u7v///+ZzP/Mmf+Z/5n/mZn//2b/mWaMjIxymL6Ycr5yvnK+cnK+vky+ckxUcY1xVI1nZ2dUjVSNVFSNjTiNVDi2juC+AAAABHRSTlN9PL4AffGBGQAAAMlJREFUWMPtlzcOwzAQBElLVKZy/v9DjXVBLK5Q4StkyJxygJ3uCNAk1qRfY2xi7CtV8LLGpCqw1/EJ7ENFDDvcOTXEdMIdY02MRwhgzwU47LkAhz0XQqASwDUCuFoQAzHwtIDqmPTnrOBJga0viX6Dm9ucaGe4pSuIbgkB7LkAhz0X4LDnQgiUArhcAFcIYiAGnhZQHJPunH/oRbo/sHpH+BXOu4xw/jKAPRfgsOfCZcAJ4DJBDMTAPwR0x6Q/53u/rkb9+VZ//9+xTWbto7vDzQAAAABJRU5ErkJggg==',
            searchUrl: SRRDB_SEARCH_URL,
            loggedOutRegex: /./,
            matchRegex: /No results/,
            positiveMatch: false,
            idType: 'imdb'
        }
    };

    let homeTrackerConfig = [
        {
            url: ATH_SEARCH_URL,
            releaseGroups: ["ATELiER", "Headpatter", "Kitsune", "NAN0", "MainFrame"]
        },
        {
            url: AVISTAZ_SEARCH_URL,
            releaseGroups: ["AppleTor", "DUSKLiGHT", "HBO", "MrHulk"]
        },
        {
            url: BHD_SEARCH_URL,
            releaseGroups: ["BeyondHD", "BMF", "CRFW", "decibeL", "FLUX", "FraMeSToR", "HiFi", "NCmt", "MiU", "PHOENiX", "TheFarm"]
        },
        {
            url: BLU_SEARCH_URL,
            releaseGroups: ["BLURANiUM", "BLUTONiUM", "CultFilms™", "CultFilms", "PmP", "Tux", "WiLDCAT"]
        },
        {
            url: BTN_SEARCH_URL,
            releaseGroups: ["BTN", "CMRG", "iT00NZ", "LAZY", "NTb", "RAWR", "TVSmash"]
        },
        {
            url: FL_SEARCH_URL,
            releaseGroups: ["playBD", "playHD", "playWEB"]
        },
        {
            url: HDB_SEARCH_URL,
            releaseGroups: ["CALiGARi", "CasStudio", "Chotab", "Cinefeel", "CtrlHD", "DON", "EA", "EbP", "HaB", "HDMaNiAcS", "HiP", "KHN", "LoRD", "monkee", "NTG", "REBORN", "RO", "SbR", "SiGMA", "Skazhutin", "TayTO", "ViSUM", "VietHD", "WiLF", "WiHD", "ZoroSenpai", "ZQ"]
        },
        {
            url: HDT_SEARCH_URL,
            releaseGroups: ["KRaLiMaRKo", "HDT", "HiDt", "SPHD", "126811"]
        },
        {
            url: HUNO_SEARCH_URL,
            releaseGroups: ["HONE"]
        },
        {
            url: LST_SEARCH_URL,
            releaseGroups: ["coffee", "L0ST", "SQS", "Yuki"]
        },
        {
            url: MTEAM_SEARCH_URL,
            releaseGroups: ["MTeam", "MWeb"]
        },
        {
            url: MTV_SEARCH_URL,
            releaseGroups: ["hallowed", "TEPES", "PiRAMiDHEAD", "E.N.D", "SMURF", "WDYM", "VaLTiEL"]
        },
        {
            url: PHD_MOVIES_SEARCH_URL, // Default to movies, will be overridden if torrentType is 'tv'
            urlTv: PHD_TV_SEARCH_URL, // TV shows URL
            releaseGroups: ["EPSiLON", "TRiToN","SiGMA"]
        },
        {
            url: PTP_SEARCH_URL,
            releaseGroups: ["PTP", "HANDJOB"]
        },
        {
            url: ULCX_SEARCH_URL,
            releaseGroups: ["BLOOM", "REWiND"]
        },
        {
            url: OLDT_SEARCH_URL,
            releaseGroups: ["OldT"]
        },
        {
            url: HHAN_SEARCH_URL,
            releaseGroups: ["HHWEB"]
        },
        {
            url: CHD_SEARCH_URL,
            releaseGroups: ["CHDWEB"]
        },
        {
            url: AUD_SEARCH_URL,
            releaseGroups: ["ADWeb"]
        },
        {
            url: ANT_SEARCH_URL,
            releaseGroups: ["ANThELIa"]
        }
    ];

    // Config loading for homeTrackerConfig only (tracker button data is hardcoded)
    var externalConfigData = null;

    function validateConfig(config) {
        if (!config || typeof config !== 'object') return false;
        if (!config.homeTrackers || !Array.isArray(config.homeTrackers)) return false;
        for (const tracker of config.homeTrackers) {
            if (!tracker.code || !tracker.url || !Array.isArray(tracker.releaseGroups)) {
                return false;
            }
        }
        return true;
    }

    function convertExternalConfigToInternal(externalConfig) {
        const internalConfig = [];
        for (const tracker of externalConfig.homeTrackers) {
            const entry = {
                url: tracker.url,
                releaseGroups: tracker.releaseGroups
            };
            if (tracker.urlTv) entry.urlTv = tracker.urlTv;
            if (tracker.extraParams) entry.extraParams = tracker.extraParams;
            internalConfig.push(entry);
        }
        return internalConfig;
    }

    function fetchExternalConfig(forceRefresh = false) {
        if (!CONFIG_URL) {
            return Promise.resolve({ config: null, fromCache: false });
        }

        if (!forceRefresh) {
            const cached = GM_getValue("tmt_config_cache", null);
            const cacheTime = GM_getValue("tmt_config_cache_time", 0);

            if (cached && cacheTime && (Date.now() - cacheTime < CONFIG_CACHE_DURATION)) {
                try {
                    const parsed = JSON.parse(cached);
                    if (validateConfig(parsed)) {
                        return Promise.resolve({ config: parsed, fromCache: true });
                    }
                } catch (e) {
                    console.warn("[TMT] Failed to parse cached config:", e);
                }
            }
        }

        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: CONFIG_URL + (CONFIG_URL.includes('?') ? '&' : '?') + '_t=' + Date.now(),
                onload: function(response) {
                    if (response.status === 200) {
                        try {
                            const config = JSON.parse(response.responseText);
                            if (validateConfig(config)) {
                                GM_setValue("tmt_config_cache", response.responseText);
                                GM_setValue("tmt_config_cache_time", Date.now());
                                resolve({ config: config, fromCache: false });
                            } else {
                                console.warn("[TMT] Invalid config structure, using hardcoded config");
                                resolve({ config: null, fromCache: false });
                            }
                        } catch (e) {
                            console.error("[TMT] Failed to parse config JSON:", e);
                            resolve({ config: null, fromCache: false });
                        }
                    } else {
                        console.warn("[TMT] Failed to fetch config, status:", response.status);
                        resolve({ config: null, fromCache: false });
                    }
                },
                onerror: function(error) {
                    console.error("[TMT] Error fetching config:", error);
                    resolve({ config: null, fromCache: false });
                }
            });
        });
    }

    function loadConfig(forceRefresh = false) {
        fetchExternalConfig(forceRefresh).then(result => {
            const { config: externalConfig, fromCache } = result;
            if (externalConfig) {
                const converted = convertExternalConfigToInternal(externalConfig);
                if (converted.length > 0) {
                    homeTrackerConfig = converted;
                    externalConfigData = externalConfig;
                    updateNeedsTitleSearch(externalConfig);
                    buildHomeTrackerLink();

                    if (!fromCache) {
                        showToast("✓ Config updated from external source", 3000);
                    }
                    renderToolkit();
                }
            } else if (forceRefresh) {
                showToast("⚠ Using hardcoded config (external fetch failed)", 3000);
            }
        });
    }

    var externalConfigData = null;

    /**
     * Builds the home tracker link based on current page data
     */
    function extractTVDB() {
        const tvdbElement = document.querySelector('li.meta__tvdb');
        if (!tvdbElement) return null;
        const link = tvdbElement.querySelector('a');
        if (!link || !link.href) return null;
        const match = link.href.match(/[?&]id=(\d+)/);
        return match ? match[1] : null;
    }

    function buildHomeTrackerLink() {
        // Clear home tracker link at the start so it only gets set if a valid tracker is found
        home_tracker_link = null;

        if (!activeTemplate) return;

        const release_group = activeTemplate.extractReleaseGroup();
        if (!release_group) return;

        // Detect torrent type
        const torrentType = activeTemplate.extractTorrentType ? activeTemplate.extractTorrentType() : null;

        const trackerConfig = getHomeTrackerUrl(release_group, torrentType);
        if (trackerConfig && trackerConfig.url) {
            const btnReleaseGroups = ["BTN", "CMRG", "iT00NZ", "LAZY", "NTb", "RAWR", "TVSmash"];
            const isBTNReleaseGroup = btnReleaseGroups.includes(release_group);

            if (needsTitleSearch(release_group)) {
                const torrentTitle = extractTorrentTitle(release_group);
                if (torrentTitle) {
                    home_tracker_link = trackerConfig.url + encodeURIComponent(torrentTitle);
                    if (trackerConfig.extraParams) {
                        home_tracker_link += trackerConfig.extraParams;
                    }
                }
            } else if (isBTNReleaseGroup) {
                const tvdbId = extractTVDB();
                if (tvdbId) {
                    home_tracker_link = trackerConfig.url + tvdbId;
                    if (trackerConfig.extraParams) {
                        home_tracker_link += trackerConfig.extraParams;
                    }
                }
            } else if (imdbId) {
                home_tracker_link = trackerConfig.url + imdbId;

                if (trackerConfig.extraParams) {
                    home_tracker_link += trackerConfig.extraParams;
                }

                // Add filter parameters if enabled and tracker supports them
                const useResolutionFilter = GM_getValue('tmt_filter_resolution', false);
                const useReleaseGroupFilter = GM_getValue('tmt_filter_release_group', false);

                // Determine if tracker supports &name= parameter (UNIT3D trackers)
                const unit3dTrackers = ['LST', 'BLU', 'ATH', 'HUNO', 'ULCX', 'CAPY', 'FNP', 'OLDT'];
                const trackerCode = getTrackerCodeFromUrl(trackerConfig.url);
                const supportsNameParam = unit3dTrackers.includes(trackerCode);

                if (supportsNameParam && (useResolutionFilter || useReleaseGroupFilter)) {
                    const filterParts = [];

                    if (useResolutionFilter) {
                        const resolution = currentResolution || extractResolutionFromTitle();
                        if (resolution) {
                            filterParts.push(resolution);
                        }
                    }

                    if (useReleaseGroupFilter && release_group) {
                        filterParts.push(release_group);
                    }

                    if (filterParts.length > 0) {
                        const filterString = filterParts.join(' ');
                        home_tracker_link += '&name=' + encodeURIComponent(filterString);
                    }
                }
            }
        }
    }

    function getTrackerCodeFromUrl(url) {
        // Map URLs to tracker codes
        const urlMap = {
            'lst.gg': 'LST',
            'blutopia.cc': 'BLU',
            'aither.cc': 'ATH',
            'hawke.uno': 'HUNO',
            'upload.cx': 'ULCX',
            'capybarabr.com': 'CAPY',
            'fearnopeer.com': 'FNP',
            'oldtoons.world': 'OLDT',
            'beyond-hd.me': 'BHD',
            'passthepopcorn.me': 'PTP',
            'broadcasthe.net': 'BTN'
        };

        for (const [domain, code] of Object.entries(urlMap)) {
            if (url.includes(domain)) {
                return code;
            }
        }

        return null;
    }

    // loadConfig() and loadTrackerConfigs() removed - all config now hardcoded

    function getSearchUrlByCode(code) {
        if (externalConfigData && externalConfigData.homeTrackers) {
            const tracker = externalConfigData.homeTrackers.find(t => t.code === code);
            if (tracker) {
                return tracker.url;
            }
        }

        // Fallback to hardcoded URLs
        const hardcodedUrls = {
            "ATH": ATH_SEARCH_URL,
            "PTP": PTP_SEARCH_URL,
            "BTN": BTN_SEARCH_URL,
            "HDB": HDB_SEARCH_URL,
            "LST": LST_SEARCH_URL,
            "BLU": BLU_SEARCH_URL,
            "BHD": BHD_SEARCH_URL,
            "SRRDB": SRRDB_SEARCH_URL
        };

        return hardcodedUrls[code] || null;
    }

    function updateNeedsTitleSearch(externalConfig) {
        window.tmtTitleBasedTrackers = [];
        for (const tracker of externalConfig.homeTrackers) {
            if (tracker.needsTitleSearch) {
                window.tmtTitleBasedTrackers.push(...tracker.releaseGroups);
            }
        }
    }

    function forceRefreshConfig() {
        showToast("🔄 Fetching config...", 2000);
        loadConfig(true);
    }

    function getHomeTrackerUrl(releaseGroup, torrentType = null) {
        for (const config of homeTrackerConfig) {
            if (config.releaseGroups.includes(releaseGroup)) {
                const url = (config.urlTv && torrentType === 'tv') ? config.urlTv : config.url;
                return {
                    url: url,
                    extraParams: config.extraParams || null
                };
            }
        }
        return null;
    }

    function needsTitleSearch(releaseGroup) {
        if (window.tmtTitleBasedTrackers && window.tmtTitleBasedTrackers.length > 0) {
            return window.tmtTitleBasedTrackers.includes(releaseGroup);
        }
        const titleBasedTrackers = ["HHWEB", "ANThELIa", "CHDWEB", "ADWeb"];
        return titleBasedTrackers.includes(releaseGroup);
    }

    function extractTorrentTitle(releaseGroup = null) {
        // Try page title first
        let title = document.querySelector("h1.torrent__name");

        if (!title) {
            title = document.querySelector("h1") ||
                    document.querySelector(".torrent-title h1") ||
                    document.querySelector("h2.torrent__name") ||
                    document.querySelector("h2");
        }

        if (!title) return null;

        const fullTitle = (title.innerText || title.textContent || "").trim();

        let cleanedTitle = fullTitle
            .replace(/\((\d{4})\)/g, ' $1 ')
            .replace(/(\s*)S(\d{1,2})E\d{1,2}(\s*)/gi, '$1S$2$3')
            .replace(/(\s+)E\d{1,2}\s*$/i, '$1')
            .replace(/\s+/g, ' ')
            .trim();

        // Handle AKA pattern - take part before "AKA" and optionally add year/season/episode from after
        const akaIndex = cleanedTitle.search(/\s+AKA\s+/i);
        if (akaIndex !== -1) {
            const beforeAka = cleanedTitle.substring(0, akaIndex).trim();
            const afterAka = cleanedTitle.substring(akaIndex);
            const yearMatch = afterAka.match(/\b(19|20)\d{2}\b/);
            const seasonEpisodeMatch = afterAka.match(/\b(S\d+E\d+)\b/i);
            const seasonPackMatch = afterAka.match(/\b(S\d+)\b/i);
            if (seasonEpisodeMatch) {
                cleanedTitle = beforeAka + ' ' + seasonEpisodeMatch[1];
            } else if (seasonPackMatch) {
                cleanedTitle = beforeAka + ' ' + seasonPackMatch[1];
            } else if (yearMatch) {
                cleanedTitle = beforeAka + ' ' + yearMatch[0];
            } else {
                cleanedTitle = beforeAka;
            }
        }

        if (releaseGroup) {
            const rgPattern = new RegExp(`\\s*[-\\s]+${releaseGroup.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`, 'i');
            cleanedTitle = cleanedTitle.replace(rgPattern, '');
            const rgPattern2 = new RegExp(`\\s+${releaseGroup.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`, 'i');
            cleanedTitle = cleanedTitle.replace(rgPattern2, '');
        }

        const words = cleanedTitle.split(/\s+/);
        const titleWords = [];
        let foundSeason = false;

        for (let i = 0; i < words.length; i++) {
            const word = words[i];

            if (/^S\d{1,2}E\d{1,2}$/i.test(word)) {
                const seasonMatch = word.match(/S(\d{1,2})E\d{1,2}/i);
                if (seasonMatch) {
                    titleWords.push('S' + seasonMatch[1]);
                    foundSeason = true;
                    if (i + 1 < words.length) {
                        const nextWord = words[i + 1];
                        const isTechnicalSpec = /^\d{4}$/.test(nextWord) ||
                                             /^\d+p$/i.test(nextWord) ||
                                             /^\d+i$/i.test(nextWord) ||
                                             /^(NF|AMZN|WEB|DL|WEB-DL|WEBRip|BluRay|Blu-ray|REMUX|UHD|HDR|DV|DDP|DD\+|DTS|AC3|AAC|H\.264|H\.265|x264|x265)/i.test(nextWord);
                        if (!isTechnicalSpec) {
                            break;
                        }
                    } else {
                        break;
                    }
                }
                continue;
            }
            if (/^S\d{1,2}$/i.test(word)) {
                titleWords.push(word);
                foundSeason = true;
                if (i + 1 < words.length) {
                    const nextWord = words[i + 1];
                    const isTechnicalSpec = /^\d{4}$/.test(nextWord) ||
                                         /^\d+p$/i.test(nextWord) ||
                                         /^\d+i$/i.test(nextWord) ||
                                         /^(NF|AMZN|WEB|DL|WEB-DL|WEBRip|BluRay|Blu-ray|REMUX|UHD|HDR|DV|DDP|DD\+|DTS|AC3|AAC|H\.264|H\.265|x264|x265)/i.test(nextWord);
                    if (!isTechnicalSpec) {
                        break;
                    }
                } else {
                    break;
                }
                continue;
            }
            if (/^\d{4}$/.test(word)) {
                if (!foundSeason && releaseGroup === "ANThELIa") {
                    titleWords.push(word);
                    break;
                } else {
                    break;
                }
            }
            if (/^\d+p$/i.test(word) || /^\d+i$/i.test(word) ||
                /^(NF|AMZN|WEB|DL|WEB-DL|WEBRip|BluRay|Blu-ray|REMUX|UHD|HDR|DV|DDP|DD\+|DTS|AC3|AAC|H\.264|H\.265|x264|x265)/i.test(word)) {
                break;
            }
            titleWords.push(word);
        }

        if (titleWords.length > 0) {
            return titleWords.join(' ');
        }

        if (cleanedTitle) {
            return cleanedTitle;
        }

        // Fallback to file structure if page title fails
        if (file_structure) {
            const firstFilename = file_structure.split('\n')[0].trim();
            if (firstFilename) {
                let nameWithoutExt = firstFilename.replace(/\.(mkv|mp4|avi|m4v)$/i, '');
                nameWithoutExt = nameWithoutExt.replace(/S(\d{1,2})E\d{1,2}/gi, 'S$1');
                nameWithoutExt = nameWithoutExt.replace(/E\d{1,2}$/i, '');
                nameWithoutExt = nameWithoutExt.replace(/[-.]([A-Za-z0-9]+)$/, '');
                const parts = nameWithoutExt.split('.');
                const titleParts = [];

                for (let i = 0; i < parts.length; i++) {
                    const part = parts[i];

                    if (/^S\d{1,2}$/i.test(part)) {
                        titleParts.push(part);
                        if (i + 1 < parts.length) {
                            const nextPart = parts[i + 1];
                            const isTechnicalSpec = /^\d{4}$/.test(nextPart) ||
                                                 /^\d+p$/i.test(nextPart) ||
                                                 /^\d+i$/i.test(nextPart) ||
                                                 /^(NF|AMZN|WEB|DL|WEB-DL|WEBRip|BluRay|Blu-ray|REMUX|UHD|HDR|DV|DDP|DD\+|DTS|AC3|AAC|H\.264|H\.265|x264|x265)/i.test(nextPart);
                            if (!isTechnicalSpec) {
                                break;
                            }
                        } else {
                            break;
                        }
                        continue;
                    }

                    if (/^\d{4}$/.test(part) || /^\d+p$/i.test(part) || /^\d+i$/i.test(part) ||
                        /^(NF|AMZN|WEB|DL|WEB-DL|WEBRip|BluRay|Blu-ray|REMUX|UHD|HDR|DV|DDP|DD\+|DTS|AC3|AAC|H\.264|H\.265|x264|x265)/i.test(part)) {
                        break;
                    }
                    titleParts.push(part);
                }

                if (titleParts.length > 0) {
                    return titleParts.join(' ');
                }
            }
        }

        return null;
    }
    /**
     * Helper function to create a toast notification element
     */
    function setupToast() {
        if (document.getElementById("tmt-toast-container")) return;

        const container = document.createElement("div");
        container.id = "tmt-toast-container";
        document.body.appendChild(container);
    }

    /**
     * Helper function to display messages via toast
     */
    function showToast(message, duration = 2500) {
        const container = document.getElementById("tmt-toast-container");
        if (!container) return;
        const toast = document.createElement("div");
        toast.className = "tmt-toast";
        toast.textContent = message;
        container.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add("show"));
        setTimeout(() => {
            toast.classList.remove("show");
            toast.addEventListener("transitionend", () => toast.remove(), { once: true });
        }, duration);
    }

    function extractResolutionFromTitle() {
        let title = document.querySelector("h1.torrent__name");
        if (!title) {
            title = document.querySelector("h1") ||
                    document.querySelector(".torrent-title h1") ||
                    document.querySelector("h2.torrent__name") ||
                    document.querySelector("h2");
        }
        if (!title) return null;

        const titleText = (title.innerText || title.textContent || "").trim();
        const resolutionMatch = titleText.match(/\b(2160p|1080p|1080i|720p|576p|480p)\b/i);
        return resolutionMatch ? resolutionMatch[1] : null;
    }

    function checkTrackerAvailability(trackerCode, searchId, resolution = null, releaseGroup = null) {
        return new Promise((resolve) => {
            const config = TRACKER_CONFIGS[trackerCode];
            if (!config) {
                console.warn(`[TMT] No config found for tracker: ${trackerCode}`);
                resolve('error');
                return;
            }
            const titleBasedTrackers = ['HHAN', 'CHD', 'AUD', 'ANT', 'PTER'];
            let searchUrl;

            if (titleBasedTrackers.includes(trackerCode)) {
                const torrentTitle = extractTorrentTitle();
                if (torrentTitle) {
                    searchUrl = config.searchUrl + encodeURIComponent(torrentTitle);
                } else {
                    searchUrl = config.searchUrl;
                }
            } else {
                searchUrl = config.searchUrl + searchId;
            }

            const timeout = 15000;

            console.log(`[TMT] Checking ${trackerCode} at: ${searchUrl}`);

            GM_xmlhttpRequest({
                method: 'GET',
                url: searchUrl,
                timeout: timeout,
                onload: function(response) {
                    console.log(`[TMT] ${trackerCode} response status: ${response.status}`);

                    if (config.loggedOutRegex && response.responseText.match(config.loggedOutRegex)) {
                        console.log(`[TMT] ${trackerCode}: logged_out`);
                        resolve('logged_out');
                        return;
                    }
                    if (response.status >= 400) {
                        console.log(`[TMT] ${trackerCode}: error (HTTP ${response.status})`);
                        resolve('error');
                        return;
                    }
                    if (config.seedingRegex && response.responseText.match(config.seedingRegex)) {
                        console.log(`[TMT] ${trackerCode}: seeding`);
                        resolve('seeding');
                        return;
                    }

                    const matchFound = response.responseText.match(config.matchRegex);
                    const isPositiveMatch = config.positiveMatch || false;

                    if (isPositiveMatch && !matchFound) {
                        console.log(`[TMT] ${trackerCode}: missing (no basic match)`);
                        resolve('missing');
                        return;
                    }
                    if (!isPositiveMatch && matchFound) {
                        console.log(`[TMT] ${trackerCode}: missing (negative match found)`);
                        resolve('missing');
                        return;
                    }

                    if (resolution || releaseGroup) {
                        let filterMatched = true;

                        if (resolution) {
                            const resolutionRegex = new RegExp(resolution.replace('p', '[pi]'), 'i');
                            if (!response.responseText.match(resolutionRegex)) {
                                console.log(`[TMT] ${trackerCode}: missing (resolution ${resolution} not found)`);
                                filterMatched = false;
                            }
                        }

                        if (releaseGroup && filterMatched) {
                            const releaseGroupRegex = new RegExp(`[-\\s]${releaseGroup.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:[\\s<]|$)`, 'i');
                            if (!response.responseText.match(releaseGroupRegex)) {
                                console.log(`[TMT] ${trackerCode}: missing (release group ${releaseGroup} not found)`);
                                filterMatched = false;
                            }
                        }

                        if (!filterMatched) {
                            resolve('missing');
                            return;
                        }
                    }

                    const result = isPositiveMatch ? (matchFound ? 'found' : 'missing') : (matchFound ? 'missing' : 'found');
                    console.log(`[TMT] ${trackerCode}: ${result} (positive=${isPositiveMatch}, match=${!!matchFound})`);
                    resolve(result);
                },
                onerror: function(error) {
                    console.error(`[TMT] ${trackerCode} request error:`, error);
                    resolve('error');
                },
                ontimeout: function() {
                    console.warn(`[TMT] ${trackerCode} request timeout`);
                    resolve('error');
                }
            });
        });
    }

    function applyTrackerState(buttonId, state) {
        const button = document.getElementById(buttonId);
        if (!button) return;
        const img = button.querySelector('img');
        if (!img) return;
        img.classList.remove('tracker-found', 'tracker-seeding', 'tracker-loading');
        button.style.display = '';
        switch(state) {
            case 'found':
                img.classList.add('tracker-found');
                break;
            case 'seeding':
                img.classList.add('tracker-seeding');
                break;
            case 'missing':
            case 'logged_out':
            case 'error':
                button.style.display = 'none';
                break;
            case 'loading':
                img.classList.add('tracker-loading');
                break;
        }
    }

    async function checkAllTrackers() {
        if (!imdbId) {
            showToast('No IMDb ID found');
            return;
        }
        const loadButton = document.getElementById('tmt-load-links');
        if (loadButton) {
            loadButton.disabled = true;
            loadButton.textContent = 'Searching...';
        }
        const tvdbId = extractTVDB();
        const useResolutionFilter = GM_getValue('tmt_filter_resolution', false);
        const useReleaseGroupFilter = GM_getValue('tmt_filter_release_group', false);

        const resolution = useResolutionFilter ? (currentResolution || extractResolutionFromTitle()) : null;
        const releaseGroup = useReleaseGroupFilter ? currentReleaseGroup : null;

        console.log(`[TMT] Checking with filters: resolution=${resolution}, releaseGroup=${releaseGroup}`);
        const enabledTrackers = getEnabledTrackers();
        const trackerButtons = {};
        enabledTrackers.forEach(code => {
            const config = TRACKER_CONFIGS[code];
            if (config) {
                trackerButtons[code] = {
                    buttonId: config.buttonId,
                    id: config.idType === 'tvdb' ? tvdbId : imdbId
                };
            }
        });

        const availableTrackers = {};
        let delay = 0;
        const promises = [];

        for (const [code, tracker] of Object.entries(trackerButtons)) {
            const promise = new Promise((resolve) => {
                setTimeout(async () => {
                    if (!tracker.id) {
                        resolve();
                        return;
                    }
                    const state = await checkTrackerAvailability(code, tracker.id, resolution, releaseGroup);
                    console.log(`[TMT] ${code}: ${state}`);

                    if (state === 'found' || state === 'seeding') {
                        availableTrackers[code] = {
                            id: tracker.id,
                            state: state
                        };
                    }
                    resolve();
                }, delay);
            });
            promises.push(promise);
            delay += 500;
        }

        await Promise.all(promises);
        const torrentType = activeTemplate && activeTemplate.extractTorrentType ? activeTemplate.extractTorrentType() : null;
        generateTrackerButtons(availableTrackers, torrentType);

        if (loadButton) {
            loadButton.disabled = false;
            loadButton.textContent = 'Finished';
        }
        showToast(`Tracker check complete - ${Object.keys(availableTrackers).length} found`);
    }

    function initializeSettingsModal() {
        let settingsSidebar = document.getElementById('tmt-settings-sidebar');

        // Only create sidebar elements once
        if (!settingsSidebar) {
            settingsSidebar = document.createElement('div');
            settingsSidebar.id = 'tmt-settings-sidebar';
            settingsSidebar.innerHTML = `
                <div id="tmt-settings-content">
                    <span id="tmt-settings-close">&times;</span>
                    <h3>Tracker Settings</h3>

                    <section>
                        <h4>Search Options</h4>
                        <label>
                            <input type="checkbox" id="tmt-setting-filter-resolution" />
                            Filter by resolution
                        </label>
                        <label>
                            <input type="checkbox" id="tmt-setting-filter-release-group" />
                            Filter by release group
                        </label>
                        <label>
                            <input type="checkbox" id="tmt-setting-auto-load" />
                            Always auto-load tracker links
                        </label>
                    </section>

                    <section>
                        <h4>Static Tracker Buttons (Always Visible)</h4>
                        <small style="color: #a0a0a0; display: block; margin-bottom: 10px;">Select trackers to always display in the top row (before search)</small>
                        <div id="tmt-static-tracker-checkboxes"></div>
                    </section>

                    <section>
                        <h4>Searchable Trackers</h4>
                        <small style="color: #a0a0a0; display: block; margin-bottom: 10px;">Select trackers to check when searching (bottom row after search)</small>
                        <div id="tmt-searchable-tracker-checkboxes"></div>
                    </section>
                </div>
            `;
            document.body.appendChild(settingsSidebar);
            const closeBtn = document.getElementById('tmt-settings-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    settingsSidebar.classList.remove('open');
                });
            }
            window.addEventListener('click', (e) => {
                if (e.target === settingsSidebar) {
                    settingsSidebar.classList.remove('open');
                }
            });
            document.getElementById('tmt-setting-filter-resolution').addEventListener('change', (e) => {
                GM_setValue('tmt_filter_resolution', e.target.checked);
            });

            document.getElementById('tmt-setting-filter-release-group').addEventListener('change', (e) => {
                GM_setValue('tmt_filter_release_group', e.target.checked);
            });

            document.getElementById('tmt-setting-auto-load').addEventListener('change', (e) => {
                GM_setValue('tmt_auto_load', e.target.checked);
                const loadBtn = document.getElementById('tmt-load-links');
                if (loadBtn) {
                    if (e.target.checked) {
                        loadBtn.style.display = 'none';
                        if (imdbId) {
                            checkAllTrackers();
                        }
                    } else {
                        loadBtn.style.display = '';
                    }
                }
            });
        }
        const filterByResolution = GM_getValue('tmt_filter_resolution', false);
        const filterByReleaseGroup = GM_getValue('tmt_filter_release_group', false);
        const autoLoad = GM_getValue('tmt_auto_load', false);

        document.getElementById('tmt-setting-filter-resolution').checked = filterByResolution;
        document.getElementById('tmt-setting-filter-release-group').checked = filterByReleaseGroup;
        document.getElementById('tmt-setting-auto-load').checked = autoLoad;
        if (!settingsSidebar.dataset.populated) {
            populateTrackerCheckboxes();
            settingsSidebar.dataset.populated = 'true';
        }

        const settingsBtn = document.getElementById('tmt-settings-btn');
        if (settingsBtn) {
            const newSettingsBtn = settingsBtn.cloneNode(true);
            settingsBtn.parentNode.replaceChild(newSettingsBtn, settingsBtn);

            newSettingsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                settingsSidebar.classList.toggle('open');
            });
        }
    }

    function getEnabledTrackers() {
        return GM_getValue('tmt_enabled_trackers', Object.keys(TRACKER_CONFIGS));
    }

    function saveEnabledTrackers(trackers) {
        GM_setValue('tmt_enabled_trackers', trackers);
    }

    function populateTrackerCheckboxes() {
        const staticContainer = document.getElementById('tmt-static-tracker-checkboxes');
        const searchableContainer = document.getElementById('tmt-searchable-tracker-checkboxes');
        if (!staticContainer || !searchableContainer) return;

        const enabledTrackers = getEnabledTrackers();
        const staticTrackers = getStaticTrackers();

        const sortedCodes = Object.keys(TRACKER_CONFIGS)
            .sort((a, b) => TRACKER_CONFIGS[a].displayOrder - TRACKER_CONFIGS[b].displayOrder);

        sortedCodes.forEach(code => {
            const config = TRACKER_CONFIGS[code];
            const label = document.createElement('label');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.dataset.tracker = code;
            checkbox.checked = staticTrackers.includes(code);

            checkbox.addEventListener('change', (e) => {
                let currentStatic = getStaticTrackers();
                if (e.target.checked) {
                    if (!currentStatic.includes(code)) {
                        currentStatic.push(code);
                    }
                } else {
                    currentStatic = currentStatic.filter(c => c !== code);
                }
                saveStaticTrackers(currentStatic);
                renderToolkit();
            });

            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(` ${config.name} (${code})`));
            staticContainer.appendChild(label);
        });

        sortedCodes.forEach(code => {
            const config = TRACKER_CONFIGS[code];
            const label = document.createElement('label');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.dataset.tracker = code;
            checkbox.checked = enabledTrackers.includes(code);

            checkbox.addEventListener('change', (e) => {
                let enabled = getEnabledTrackers();
                if (e.target.checked) {
                    if (!enabled.includes(code)) {
                        enabled.push(code);
                    }
                } else {
                    enabled = enabled.filter(c => c !== code);
                }
                saveEnabledTrackers(enabled);
            });

            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(` ${config.name} (${code})`));
            searchableContainer.appendChild(label);
        });
    }

    function generateTrackerButtons(availableTrackers, torrentType = null) {
        const container = document.getElementById('dynamic-tracker-row');
        if (!container) return;
        container.innerHTML = '';
        const enabledTrackers = getEnabledTrackers();
        const sortedTrackers = Object.keys(availableTrackers)
            .filter(code => enabledTrackers.includes(code))
            .filter(code => {
                const state = availableTrackers[code].state;
                return state === 'found' || state === 'seeding';
            })
            .sort((a, b) => TRACKER_CONFIGS[a].displayOrder - TRACKER_CONFIGS[b].displayOrder);

        if (sortedTrackers.length > 0) {
            container.style.display = ''; 
            sortedTrackers.forEach(code => {
                const config = TRACKER_CONFIGS[code];
                const tracker = availableTrackers[code];
                let searchUrl = (config.urlTv && torrentType === 'tv') ? config.urlTv : config.searchUrl;
                searchUrl = searchUrl || getSearchUrlByCode(code);
                const titleBasedTrackers = ['HHAN', 'CHD', 'AUD', 'ANT', 'PTER'];
                let finalUrl;

                if (titleBasedTrackers.includes(code)) {
                    const torrentTitle = extractTorrentTitle();
                    if (torrentTitle) {
                        finalUrl = searchUrl + encodeURIComponent(torrentTitle);
                    } else {
                        finalUrl = searchUrl;
                    }
                } else {
                    finalUrl = searchUrl + tracker.id;
                }

                const useResolutionFilter = GM_getValue('tmt_filter_resolution', false);
                const useReleaseGroupFilter = GM_getValue('tmt_filter_release_group', false);
                const unit3dTrackers = ['LST', 'BLU', 'ATH', 'HUNO', 'ULCX', 'CAPY', 'FNP', 'OLDT'];
                const supportsNameParam = unit3dTrackers.includes(code);

                if (supportsNameParam && (useResolutionFilter || useReleaseGroupFilter)) {
                    const filterParts = [];

                    if (useResolutionFilter) {
                        const resolution = currentResolution || extractResolutionFromTitle();
                        if (resolution) {
                            filterParts.push(resolution);
                        }
                    }

                    if (useReleaseGroupFilter && currentReleaseGroup) {
                        filterParts.push(currentReleaseGroup);
                    }

                    if (filterParts.length > 0) {
                        const filterString = filterParts.join(' ');
                        finalUrl += '&name=' + encodeURIComponent(filterString);
                    }
                }

                // BHD uses search parameter for filters (format: ?search=1080p pter&imdb=tt3283556)
                if (code === 'BHD' && (useResolutionFilter || useReleaseGroupFilter)) {
                    const filterParts = [];

                    if (useResolutionFilter) {
                        const resolution = currentResolution || extractResolutionFromTitle();
                        if (resolution) {
                            filterParts.push(resolution);
                        }
                    }

                    if (useReleaseGroupFilter && currentReleaseGroup) {
                        filterParts.push(currentReleaseGroup);
                    }

                    if (filterParts.length > 0) {
                        const filterString = filterParts.join(' ');
                        // BHD URL format: https://beyond-hd.me/torrents/all?search=&imdb=tt3283556
                        // We need to replace "search=" with "search=1080p+pter"
                        finalUrl = finalUrl.replace('search=&', 'search=' + encodeURIComponent(filterString) + '&');
                    }
                }

                const link = document.createElement('a');
                link.id = config.buttonId;
                link.href = finalUrl;
                link.target = '_blank';

                const img = document.createElement('img');
                img.width = 20;
                img.height = 20;
                img.title = config.name;
                img.src = config.icon;
                if (tracker.state) {
                    if (tracker.state === 'found') {
                        img.classList.add('tracker-found');
                    } else if (tracker.state === 'seeding') {
                        img.classList.add('tracker-seeding');
                    }
                }

                link.appendChild(img);
                container.appendChild(link);
                link.addEventListener('click', () => {
                    storeDataForForceLoad();
                });
            });
        } else {
            container.style.display = 'none';
        }
    }

    function filterMkvFilenames(fileStructure) {
        if (!fileStructure) return null;
        const lines = fileStructure.split('\n')
            .map(line => line.trim())
            .filter(line => {
                if (!/\.mkv$/i.test(line)) return false;
                if (/\.sample\.mkv$/i.test(line) || /\.Sample\.mkv$/i.test(line) ||
                    /sample\.mkv$/i.test(line) || /Sample\.mkv$/i.test(line) ||
                    /\bsample\b/i.test(line)) {
                    return false;
                }
                return true;
            });

        return lines.length > 0 ? lines.join("\n") : null;
    }

    /*
    * Extract the unique ID from within mediainfo, if present
    */
    function extractUniqueId(mediainfo) {
        if (!mediainfo) return null;

        const match = mediainfo.match(/Unique\s+ID\s*[:\-]\s*([A-Za-z0-9]+(?:\.[A-Za-z0-9]+)?)/i);
        return match ? match[1].trim() : null;
    }

    function extractOMGSearchTitle() {
        let titleElement = document.querySelector("h1.torrent__name");
        let fullTitle = null;

        if (titleElement) {
            fullTitle = (titleElement.innerText || titleElement.textContent || "").trim();
        } else if (window.location.hostname === 'beyond-hd.me') {
            const nameRow = Array.from(document.querySelectorAll('tr.dotborder')).find(row => {
                const firstTd = row.querySelector('td:first-child');
                return firstTd && firstTd.textContent.trim() === 'Name';
            });
            if (nameRow) {
                const titleTd = nameRow.querySelector('td:nth-child(2)');
                if (titleTd) {
                    fullTitle = titleTd.textContent.trim();
                }
            }
        } else {
            const pageTitle = document.title || "";
            const titleMatch = pageTitle.match(/^(.+?)\s*::/);
            if (titleMatch) {
                fullTitle = titleMatch[1].trim();
                fullTitle = fullTitle.replace(/\s*-\s*Season\s+(\d+)/i, (match, seasonNum) => {
                    const season = parseInt(seasonNum, 10);
                    return ' S' + (season < 10 ? '0' + season : season);
                });
                fullTitle = fullTitle.replace(/\s*\((\d{4})\)\s*/i, ' $1 ');
                fullTitle = fullTitle.replace(/\s+/g, ' ').trim();
            }
        }

        if (!fullTitle) return null;
        let title = fullTitle;
        const akaIndex = title.search(/\s+AKA\s+/i);
        if (akaIndex !== -1) {
            const beforeAka = title.substring(0, akaIndex).trim();
            const afterAka = title.substring(akaIndex);
            const yearMatch = afterAka.match(/\b(19|20)\d{2}\b/);
            const seasonEpisodeMatch = afterAka.match(/\b(S\d+E\d+)\b/i);
            const seasonPackMatch = afterAka.match(/\b(S\d+)\b/i);
            if (seasonEpisodeMatch) {
                title = beforeAka + ' ' + seasonEpisodeMatch[1];
            } else if (seasonPackMatch) {
                title = beforeAka + ' ' + seasonPackMatch[1];
            } else if (yearMatch) {
                title = beforeAka + ' ' + yearMatch[0];
            } else {
                title = beforeAka;
            }
        }

        const seriesMatch = title.match(/(.+?)\s+(S\d+E\d+)/i);
        if (seriesMatch) {
            const titlePart = seriesMatch[1].trim();
            const episodePart = seriesMatch[2];
            const beforeQuality = titlePart + ' ' + episodePart;
            return beforeQuality.split(/\s+\d{3,4}p|\s+\d{3,4}i|\s+(WEB|DL|WEB-DL|WEBRip|BluRay|Blu-ray|REMUX|UHD|HDR|DV|DDP|DD\+|DTS|AC3|AAC|H\.264|H\.265|x264|x265|CR|DSNP|NF|AMZN)/i)[0].trim();
        }
        const seasonPackMatch = title.match(/(.+?)\s+(S\d+)(?!E\d+)/i);
        if (seasonPackMatch) {
            const titlePart = seasonPackMatch[1].trim();
            const seasonPart = seasonPackMatch[2];
            const beforeQuality = titlePart + ' ' + seasonPart;
            return beforeQuality.split(/\s+\d{3,4}p|\s+\d{3,4}i|\s+(REPACK|JAPANESE|WEB|DL|WEB-DL|WEBRip|BluRay|Blu-ray|REMUX|UHD|HDR|DV|DDP|DD\+|DTS|AC3|AAC|H\.264|H\.265|x264|x265|CR|DSNP|NF|AMZN)/i)[0].trim();
        }
        const beforeQuality = title.split(/\s+\d{3,4}p|\s+\d{3,4}i|\s+(WEB|DL|WEB-DL|WEBRip|BluRay|Blu-ray|REMUX|UHD|HDR|DV|DDP|DD\+|DTS|AC3|AAC|H\.264|H\.265|x264|x265|CR|DSNP|NF|AMZN)/i)[0];
        const words = beforeQuality.trim().split(/\s+/);
        const titleWords = [];
        let foundYear = false;

        for (const word of words) {
            if (/^\d{4}$/.test(word)) {
                titleWords.push(word);
                foundYear = true;
                break;
            }
            titleWords.push(word);
        }

        if (!foundYear) {
            const yearMatch = fullTitle.match(/\b(19|20)\d{2}\b/);
            if (yearMatch) {
                titleWords.push(yearMatch[0]);
            }
        }

        return titleWords.length > 0 ? titleWords.join(' ') : null;
    }

    function extractAnimebytesSearchTitle() {
        const titleElement = document.querySelector("h1.torrent__name");
        if (!titleElement) return null;
        const fullTitle = (titleElement.innerText || titleElement.textContent || "").trim();
        if (!fullTitle) return null;
        let title = fullTitle;
        const akaIndex = title.search(/\s+AKA\s+/i);
        if (akaIndex !== -1) {
            title = title.substring(0, akaIndex).trim();
        }
        const seriesMatch = title.match(/(.+?)\s+(S\d+E\d+)/i);
        if (seriesMatch) {
            const titlePart = seriesMatch[1].trim();
            return titlePart.split(/\s+\d{3,4}p|\s+\d{3,4}i|\s+(WEB|DL|WEB-DL|WEBRip|BluRay|Blu-ray|REMUX|UHD|HDR|DV|DDP|DD\+|DTS|AC3|AAC|H\.264|H\.265|x264|x265|CR|DSNP|NF|AMZN|REPACK|JAPANESE)/i)[0].trim();
        }
        const seasonPackMatch = title.match(/(.+?)\s+(S\d+)(?!E\d+)/i);
        if (seasonPackMatch) {
            const titlePart = seasonPackMatch[1].trim();
            return titlePart.split(/\s+\d{3,4}p|\s+\d{3,4}i|\s+(REPACK|JAPANESE|WEB|DL|WEB-DL|WEBRip|BluRay|Blu-ray|REMUX|UHD|HDR|DV|DDP|DD\+|DTS|AC3|AAC|H\.264|H\.265|x264|x265|CR|DSNP|NF|AMZN)/i)[0].trim();
        }
        const beforeQuality = title.split(/\s+\d{3,4}p|\s+\d{3,4}i|\s+(WEB|DL|WEB-DL|WEBRip|BluRay|Blu-ray|REMUX|UHD|HDR|DV|DDP|DD\+|DTS|AC3|AAC|H\.264|H\.265|x264|x265|CR|DSNP|NF|AMZN|REPACK|JAPANESE)/i)[0];
        const words = beforeQuality.trim().split(/\s+/);
        const titleWords = [];
        for (const word of words) {
            if (/^\d{4}$/.test(word) || /^S\d+$/i.test(word)) {
                break;
            }
            if (/^(REPACK|JAPANESE)$/i.test(word)) {
                break;
            }
            titleWords.push(word);
        }

        return titleWords.length > 0 ? titleWords.join(' ') : null;
    }

    function extractResolution(mediainfo) {
        if (!mediainfo) return null;

        const widthMatch = mediainfo.match(/Width\s*[:\-]\s*([\d\s,]+)\s*pixels/i);
        const heightMatch = mediainfo.match(/Height\s*[:\-]\s*([\d\s,]+)\s*pixels/i);

        if (widthMatch && heightMatch) {
            const width = parseInt(widthMatch[1].replace(/[\s,]/g, ''));
            const height = parseInt(heightMatch[1].replace(/[\s,]/g, ''));

            if (width && height) {
                return {
                    width: width,
                    height: height
                };
            }
        }
        return null;
    }

    function getImageDimensions(imageUrl) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const timeout = setTimeout(() => {
                reject(new Error('Image load timeout'));
            }, 10000);

            img.onload = () => {
                clearTimeout(timeout);
                resolve({
                    width: img.naturalWidth,
                    height: img.naturalHeight
                });
            };
            img.onerror = () => {
                clearTimeout(timeout);
                reject(new Error('Failed to load image'));
            };
            img.src = imageUrl;
        });
    }

    async function checkScreenshotResolutions() {
        if (!window.location.hostname.includes('aither.cc')) {
            showToast("This feature only works on aither.cc");
            return;
        }

        if (!mediainfo) {
            showToast("No mediainfo found");
            return;
        }

        const mediainfoResolution = extractResolution(mediainfo);
        if (!mediainfoResolution) {
            showToast("Could not extract resolution from mediainfo");
            return;
        }

        const descriptionSection = document.querySelector('.panel__body.bbcode-rendered') ||
                                   document.querySelector('.bbcode-rendered') ||
                                   document.querySelector('section.panelV2 .panel__body');

        if (!descriptionSection) {
            showToast("Description section not found");
            return;
        }

        const images = descriptionSection.querySelectorAll('img');
        if (images.length === 0) {
            showToast("No images found in description");
            return;
        }

        showToast(`Checking ${images.length} image(s)...`, 2000);

        const results = [];

        for (const img of images) {
            let imageUrl = img.src || img.getAttribute('src');

            if (!imageUrl) continue;

            try {
                const dimensions = await getImageDimensions(imageUrl);
                const matches = dimensions.width === mediainfoResolution.width &&
                               dimensions.height === mediainfoResolution.height;

                results.push({
                    url: imageUrl,
                    width: dimensions.width,
                    height: dimensions.height,
                    matches: matches
                });
            } catch (e) {
                results.push({
                    url: imageUrl,
                    error: true
                });
            }
        }

        showResolutionComparison(mediainfoResolution, results);
    }

    function showResolutionComparison(mediainfoResolution, imageResults) {
        const existing = document.getElementById("tmt-resolution-check-display");
        if (existing) existing.remove();

        const display = document.createElement("div");
        display.id = "tmt-resolution-check-display";

        const matchCount = imageResults.filter(r => r.matches === true).length;
        const totalCount = imageResults.filter(r => !r.error).length;
        const allMatch = matchCount === totalCount && totalCount > 0;
        const hasResults = totalCount > 0;

        display.innerHTML = `
            <div class="header">
                <b>Resolution Check</b>
                <button id="tmt-close-resolution-check">×</button>
            </div>
            <div class="body">
                <div class="data-item">
                    <strong>MediaInfo Resolution:</strong><br>
                    <code>${mediainfoResolution.width} × ${mediainfoResolution.height}</code>
                </div>
                ${hasResults ? `
                <div class="comparison-boxes">
                    <div class="comparison-box ${allMatch ? 'match' : 'no-match'}">
                        <div class="comparison-label">Screenshot Match</div>
                        <div class="comparison-status">${allMatch ? `✓ ${matchCount}/${totalCount} Match` : `✗ ${matchCount}/${totalCount} Match`}</div>
                    </div>
                </div>
                ` : ''}
                <div class="image-results">
                    <strong>Screenshot Results:</strong>
                    ${imageResults.length === 0 ? '<div class="image-result error">No images found</div>' : imageResults.map((result, index) => {
                        if (result.error) {
                            return `<div class="image-result error">Image ${index + 1}: Failed to load</div>`;
                        }
                        const matchClass = result.matches ? 'match' : 'no-match';
                        return `<div class="image-result ${matchClass}">
                            Image ${index + 1}: ${result.width} × ${result.height}
                            ${result.matches ? '✓' : '✗'}
                        </div>`;
                    }).join('')}
                </div>
            </div>
        `;

        document.body.appendChild(display);

        document.getElementById("tmt-close-resolution-check").addEventListener("click", () => {
            display.remove();
        });

        setTimeout(() => {
            if (display.parentNode) {
                display.remove();
            }
        }, 30000);
    }

    function getStaticTrackers() {
        const defaults = ['AB', 'SRRDB', 'OMG'];
        const saved = GM_getValue('staticTrackers', JSON.stringify(defaults));
        try {
            return JSON.parse(saved);
        } catch (e) {
            return defaults;
        }
    }

    function saveStaticTrackers(trackers) {
        GM_setValue('staticTrackers', JSON.stringify(trackers));
    }

    function getTrackerUrl(trackerCode, imdbId, tvdbId = null, torrentType = null) {
        const config = TRACKER_CONFIGS[trackerCode];
        if (!config) return '#';

        if (trackerCode === 'OMG') {
            const omgTitle = extractOMGSearchTitle();
            return omgTitle ? OMG_SEARCH_URL + encodeURIComponent(omgTitle) : OMG_SEARCH_URL;
        }

        if (trackerCode === 'AB') {
            const abTitle = extractAnimebytesSearchTitle();
            return abTitle ? AB_SEARCH_URL + encodeURIComponent(abTitle) : AB_SEARCH_URL;
        }

        const titleBasedTrackers = ['HHAN', 'CHD', 'AUD', 'ANT', 'PTER'];
        if (titleBasedTrackers.includes(trackerCode)) {
            const torrentTitle = extractTorrentTitle();
            if (torrentTitle) {
                let baseUrl = (config.urlTv && torrentType === 'tv') ? config.urlTv : config.searchUrl;
                return baseUrl ? baseUrl + encodeURIComponent(torrentTitle) : '#';
            }
            let baseUrl = (config.urlTv && torrentType === 'tv') ? config.urlTv : config.searchUrl;
            return baseUrl || '#';
        }
        const id = (config.idType === 'tvdb') ? tvdbId : imdbId;
        let baseUrl = (config.urlTv && torrentType === 'tv') ? config.urlTv : config.searchUrl;

        if (!baseUrl || !id) {
            return baseUrl || '#';
        }

        let finalUrl = baseUrl + id;

        // Add filter parameters if enabled and tracker supports them
        const useResolutionFilter = GM_getValue('tmt_filter_resolution', false);
        const useReleaseGroupFilter = GM_getValue('tmt_filter_release_group', false);

        // Determine if tracker supports &name= parameter (UNIT3D trackers)
        const unit3dTrackers = ['LST', 'BLU', 'ATH', 'HUNO', 'ULCX', 'CAPY', 'FNP', 'OLDT'];
        const supportsNameParam = unit3dTrackers.includes(trackerCode);

        if (supportsNameParam && (useResolutionFilter || useReleaseGroupFilter)) {
            const filterParts = [];

            if (useResolutionFilter) {
                const resolution = currentResolution || extractResolutionFromTitle();
                if (resolution) {
                    filterParts.push(resolution);
                }
            }

            if (useReleaseGroupFilter && currentReleaseGroup) {
                filterParts.push(currentReleaseGroup);
            }

            if (filterParts.length > 0) {
                const filterString = filterParts.join(' ');
                finalUrl += '&name=' + encodeURIComponent(filterString);
            }
        }

        return finalUrl;
    }

    function generateStaticRowHtml(imdbId, tvdbId) {
        const staticTrackers = getStaticTrackers();
        if (staticTrackers.length === 0) return '';

        return staticTrackers.map(code => {
            const config = TRACKER_CONFIGS[code];
            if (!config) return '';

            const url = getTrackerUrl(code, imdbId, tvdbId);
            const icon = config.icon || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

            return `
                <a href="${url}" target="_blank">
                    <img width="20" height="20" title="${config.name}" src="${icon}" />
                </a>
            `;
        }).join('');
    }

    /*
    * Inserts the toolkit into the DOM
    * It is necessary to have in its own function with the ability to re-render due to asynchronous nature of fetching mediainfo from HDB
    */
    function renderToolkit() {
        let existingToolkit = document.getElementById("torrentModToolkit");

        // Render element
        const toolkitDiv = document.createElement("div");
        toolkitDiv.id = "torrentModToolkit";

        let mediainfoDisabled = activeTemplate && mediainfo ? ``: ` disabled `;
        let uniqueIdDisabled = activeTemplate && uniqueId ? ``: ` disabled `;
        let fileStructureDisabled = activeTemplate && file_structure ? `` : ` disabled `;
        let homeTrackerDisabled = activeTemplate && home_tracker_link ? `` : ` disabled `;

        var mediainfoButtonHtml = `<button id="copyFullMediainfoBtn"`+ mediainfoDisabled +`>Copy mediainfo</button>`;
        var uniqueIdButtonHtml = `<button id="copyUniqueIDBtn"`+ uniqueIdDisabled +`>Copy Unique ID</button>`;
        var fileStructureButtonHtml = `<button id="copyFileStructureBtn"`+ fileStructureDisabled +`>Copy file name(s)</button>`;
        var homeTrackerButtonHtml = `<button id="homeTrackerBtn"`+ homeTrackerDisabled +`>Go to home tracker</button>`;

        const isAither = window.location.hostname.includes('aither.cc');
        let resolutionCheckButtonHtml = '';
        if (isAither) {
            let resolutionCheckDisabled = (activeTemplate && mediainfo) ? `` : ` disabled `;
            resolutionCheckButtonHtml = `<button id="checkResolutionBtn"` + resolutionCheckDisabled + `>Check screenshot resolution</button>`;
        }

        let OMG_SEARCH_URL = '';
        let ANIMEBYTES_SEARCH_URL = '';
        const omgSearchTitle = extractOMGSearchTitle();
        const animebytesSearchTitle = extractAnimebytesSearchTitle();
        if (omgSearchTitle) {
            OMG_SEARCH_URL = `https://omgwtfnzbs.org/browse?search=${encodeURIComponent(omgSearchTitle)}`;
        }
        if (animebytesSearchTitle) {
            ANIMEBYTES_SEARCH_URL = `https://animebytes.tv/torrents.php?searchstr=${encodeURIComponent(animebytesSearchTitle)}&filter_cat[1]=1`;
        }

        const athUrl = getSearchUrlByCode("ATH") || ATH_SEARCH_URL;
        const ptpUrl = getSearchUrlByCode("PTP") || PTP_SEARCH_URL;
        const btnUrl = getSearchUrlByCode("BTN") || BTN_SEARCH_URL;
        const hdbUrl = getSearchUrlByCode("HDB") || HDB_SEARCH_URL;
        const bluUrl = getSearchUrlByCode("BLU") || BLU_SEARCH_URL;
        const bhdUrl = getSearchUrlByCode("BHD") || BHD_SEARCH_URL;
        const lstUrl = getSearchUrlByCode("LST") || LST_SEARCH_URL;
        const srrdbUrl = getSearchUrlByCode("SRRDB") || SRRDB_SEARCH_URL;

        const tvdbId = extractTVDB();

        toolkitDiv.innerHTML = `
        <div class="header">
            <div style="display: flex; flex-direction: column; gap: 2px;">
                ${CONFIG_URL ? `<a href="#" id="tmt-refresh-config" title="Force refresh config from external source"><img width="20" height="20" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAE/SURBVDhPvdSxSxxREMfxj3ELm1RqY9AmsfKsrMQ0gXQ22ulfcH/Gcn9CWnsRK68RtBZ7SZfYWZpGG+Hg8Gxm5TnsniKSLwzsm3m/Yd6b2ccHM5MdiUVsYSXWN7jEv7TvVXoYYoxJsnHEelnURR+jlkTZRtjP4kw/ia5RYzesDt8kjv0tJyjpFZU9YoAqbwpfje85kBkWlQ1ycAo/sZmdi0UDrjsqa2Mdd7jNx98pqqvLwBSWYowa3V8sfIpgM2fwu/juosIplgvfKk5m8Qvb+BKB+biT82hOGxM8RKc3wneEQzhIozLB8Ut9J3Wh2WmcFc6KwAXmXupaqYqZHEdjn/mMK/yJI7+FQVHEMAfFHX4t1j86xqeKZI+RbIS1vCmzF4Jpv15j/SzOzOO+pVHZRm9J1rCGk/c8X//tgX03Tz/1cLHeVV33AAAAAElFTkSuQmCC" /></a>` : ''}
            </div>
            <div class="center"><b>Torrent Mod Toolkit v` + version + `</b></div>
            <button id="toggleToolkitBtn">▼</button>
        </div>
        <div class="body">
        <!-- Static tracker buttons row (always visible) -->
        <div id="static-tracker-row" class="center pad" style="margin-bottom: 6px;">
            ${generateStaticRowHtml(imdbId, tvdbId)}
        </div>
        <!-- Dynamic tracker buttons row (populated after search) -->
        <div id="dynamic-tracker-row" class="center pad" style="display: none;">
            <!-- Populated by generateTrackerButtons() -->
        </div>
        <div style="display: flex; gap: 6px;">
            <button id="tmt-load-links" title="Check tracker availability" style="flex: 1;">Search</button>
            <button id="tmt-settings-btn" title="Tracker checking settings" style="flex: 1;">Settings</button>
        </div>
        <div><span class="uid">UID: ${uniqueId ? uniqueId : ''}</span></div>
        ` + mediainfoButtonHtml + `
        ` + uniqueIdButtonHtml + `
        ` + fileStructureButtonHtml + `
        ` + homeTrackerButtonHtml + `
        ` + (resolutionCheckButtonHtml ? resolutionCheckButtonHtml : '') + `</div>`;

        if(existingToolkit) {
            existingToolkit.innerHTML = toolkitDiv.innerHTML
        } else {
            document.body.appendChild(toolkitDiv);
        }

        /* ---------------------------------------------------------------------
        * BUTTON HANDLERS
        * ---------------------------------------------------------------------
        */

        // Helper function to store data with force load flag
        function storeDataForForceLoad() {
            if (uniqueId || file_structure) {
                // Extract mediainfo if not already available
                const mediainfoToStore = mediainfo || (activeTemplate && activeTemplate.extractMediainfo ? activeTemplate.extractMediainfo() : null);

                GM_setValue("tmt_search_data", {
                    uniqueId: uniqueId || null,
                    filename: file_structure || null,
                    mediainfo: mediainfoToStore || null,
                    timestamp: Date.now(),
                    forceLoad: true,
                    showOnAither: false
                });
            }
        }

        // Copy entire mediainfo block
        document.getElementById("copyFullMediainfoBtn").addEventListener("click", () => {
            if (!activeTemplate) return showToast("No template for this site");

            if (!mediainfo) return showToast("Mediainfo not found");

            GM_setClipboard(mediainfo);
            showToast("Mediainfo copied");
        });

        // Copy Unique ID
        document.getElementById("copyUniqueIDBtn").addEventListener("click", () => {
            if (!activeTemplate) return showToast("No template for this site");

            if (!mediainfo) return showToast("No mediainfo found");

            if (!uniqueId) return showToast("Unique ID not found");

            GM_setClipboard(uniqueId);
            showToast(`Unique ID copied`);
        });

        // Copy file structure
        document.getElementById("copyFileStructureBtn").addEventListener("click", () => {
            if (!activeTemplate) return showToast("No template for this site")

            GM_setClipboard(file_structure);
            showToast(`File structure copied`);
        })

        // Go to home tracker
        document.getElementById("homeTrackerBtn").addEventListener("click", () => {
            if (!activeTemplate) return showToast("No template for this site")

            // Store data for comparison on the home tracker page (for all sites)
            if (uniqueId || file_structure) {
                let filenameToStore = file_structure || null;

                // Ensure mediainfo is extracted if not already available
                const mediainfoToStore = mediainfo || (activeTemplate.extractMediainfo ? activeTemplate.extractMediainfo() : null);
                GM_setValue("tmt_search_data", {
                    uniqueId: uniqueId || null,
                    filename: filenameToStore,
                    mediainfo: mediainfoToStore || null,
                    timestamp: Date.now(),
                    fromHomeTrackerButton: true,
                    forceLoad: true,
                    showOnAither: false
                });
            }

            window.open(home_tracker_link, '_blank')
        })

        // ATH button - store data when clicked (from any tracker) to compare on Aither
        const athButton = document.getElementById("athButton");
        if (athButton) {
            athButton.addEventListener("click", (e) => {
                if (!activeTemplate) {
                    e.preventDefault();
                    return showToast("No template for this site");
                }

                const filteredFilename = file_structure ? filterMkvFilenames(file_structure) : null;
                if (uniqueId || filteredFilename) {
                    const mediainfoToStore = mediainfo || (activeTemplate.extractMediainfo ? activeTemplate.extractMediainfo() : null);
                    GM_setValue("tmt_search_data", {
                        uniqueId: uniqueId || null,
                        filename: filteredFilename || null,
                        mediainfo: mediainfoToStore || null,
                        timestamp: Date.now(),
                        fromAthButton: true,
                        showOnAither: true
                    });
                    showToast("Data stored for Aither comparison");
                } else {
                    showToast("No data to store (UID or filename missing)");
                }
            });
        }

        // Check screenshot resolution
        const checkResolutionBtn = document.getElementById("checkResolutionBtn");
        if (checkResolutionBtn) {
            checkResolutionBtn.addEventListener("click", () => {
                if (!activeTemplate) return showToast("No template for this site")
                checkScreenshotResolutions();
            })
        }

        // hide toolkit button
        document.getElementById("toggleToolkitBtn").addEventListener("click", (event) => {
            const toolkitBody = document.querySelector("#torrentModToolkit div.body");
            const toggleButton = event.currentTarget;

            if(toolkitBody && !isHidden) {
                toolkitBody.hidden = true;
                isHidden = true;
                toggleButton.textContent = "▲";

            } else if(toolkitBody && isHidden) {
                toolkitBody.hidden = false;
                isHidden = false;
                toggleButton.textContent = "▼";
            }
        })

        // Refresh config button
        const refreshConfigBtn = document.getElementById("tmt-refresh-config");
        if (refreshConfigBtn) {
            refreshConfigBtn.addEventListener("click", (e) => {
                e.preventDefault();
                forceRefreshConfig();
            });
        }

        // Initialize settings modal (only once)
        initializeSettingsModal();

        const trackerButtons = document.querySelectorAll('.center.pad a[target="_blank"]');
        trackerButtons.forEach(button => {
            if (button.id === 'athButton') return;
            button.addEventListener("click", () => {
                storeDataForForceLoad();
            });
        });

        const loadLinksButton = document.getElementById('tmt-load-links');
        if (loadLinksButton) {
            loadLinksButton.addEventListener('click', () => {
                checkAllTrackers();
            });

            // Hide/show Load Links button based on auto-load setting
            const autoLoad = GM_getValue('tmt_auto_load', false);
            if (autoLoad) {
                loadLinksButton.style.display = 'none';
                // Auto-load tracker links
                if (imdbId) {
                    setTimeout(() => checkAllTrackers(), 1000);
                }
            } else {
                loadLinksButton.style.display = '';
            }
        }
    }

    /* ---------------------------------------------------------------------
     * SITE TEMPLATE DEFINITIONS
     * ---------------------------------------------------------------------
     *
     * Each template defines:
     *  - domains: string[] — array of domain names this template handles (optional, used with matchDomains helper)
     *  - matches(url): boolean — decides if this module handles the current site
     *  - extractMediainfo(): string|null — copy the mediainfo based on CSS selector or make separate HTML call to retreive it
     *  - extractFileStructure() : string|null — copy the torrent page's file list
     *  - extractIMDB() : string|null — finds the imdb id
     *  - extractReleaseGroup() : string|null — finds the release group, if present
     */

    function matchDomains(url, domains) {
        try {
            const urlObj = new URL(url);
            const hostname = urlObj.hostname.toLowerCase();
            return domains.some(domain => {
                const domainLower = domain.toLowerCase();
                return hostname === domainLower || hostname.endsWith('.' + domainLower);
            });
        } catch (e) {
            return domains.some(domain => url.toLowerCase().includes(domain.toLowerCase()));
        }
    }

    const siteTemplates = [
        {
            name: "General UNIT3D Template",
            domains: ["aither.cc", "blutopia.cc", "lst.gg", "upload.cx", "oldtoons.world", "hawke.uno", "fearnopeer.com", "capybarabr.com"],
            matches: function(url) { return matchDomains(url, this.domains); },
            extractMediainfo: () => {
                let el = document.querySelector(".torrent-mediainfo-dump pre code[x-ref='mediainfo']");
                if (el) return el.innerText.trim();
                el = document.querySelector(".torrent-mediainfo-dump pre.decoda-code code") ||
                     document.querySelector(".torrent-mediainfo-dump .decoda-code code");
                if (el) return el.innerText.trim();
                el = document.querySelector(".torrent-mediainfo-dump code");
                return el ? el.innerText.trim() : null;
            },
            extractFileStructure: () => {
                const getFilesFromSelector = (selector, container = document, filterExt = true) => {
                    const files = container.querySelectorAll(selector);
                    if (!files || files.length === 0) return null;
                    const fileNames = Array.from(files)
                        .map(f => f.innerText.trim())
                        .filter(f => f && (!filterExt || /\.(mkv|mp4|avi|mov|webm|m4v|flv|wmv|mpg|mpeg|ts|m2ts|vob|iso)$/i.test(f)));
                    return fileNames.length > 0 ? fileNames.join("\n") : null;
                };

                const getFilesFromSpans = (container) => {
                    const spans = container.querySelectorAll("span");
                    const fileNames = [];
                    spans.forEach(span => {
                        const text = span.innerText.trim();
                        if (text && /\.(mkv|mp4|avi|mov|webm|m4v|flv|wmv|mpg|mpeg|ts|m2ts|vob|iso)$/i.test(text) &&
                            !/^\d+\.?\d*\s*(GiB|MiB|KiB|GB|MB|KB|B)$/i.test(text)) {
                            fileNames.push(text);
                        }
                    });
                    return fileNames.length > 0 ? [...new Set(fileNames)].join("\n") : null;
                };

                const selectors = [
                    "table.data-table tbody tr td:nth-child(2)",
                    "table.data-table tr td:nth-child(2)",
                    "div[data-tab='list'] tr td:nth-child(2)",
                    "div[data-tab='list'] td:nth-child(2)"
                ];

                for (const selector of selectors) {
                    const result = getFilesFromSelector(selector);
                    if (result) return result;
                }

                const dialog = document.querySelector("dialog.dialog");
                if (dialog) {
                    for (const selector of ["table.data-table tbody tr td:nth-child(2)", "table.data-table tr td:nth-child(2)"]) {
                        const result = getFilesFromSelector(selector, dialog);
                        if (result) return result;
                    }
                    const summaries = dialog.querySelectorAll("details summary");
                    if (summaries.length > 0) {
                        const fileNames = [];
                        summaries.forEach(summary => {
                            const spans = summary.querySelector("i.fas.fa-file")
                                ? summary.querySelectorAll("span")
                                : summary.querySelectorAll("span[style*='word-break'], span[style*='break-all']") || summary.querySelectorAll("span");
                            spans.forEach(span => {
                                const text = span.innerText.trim();
                                if (text && /\.(mkv|mp4|avi|mov|webm|m4v|flv|wmv|mpg|mpeg|ts|m2ts|vob|iso)$/i.test(text) &&
                                    !/^\d+\.?\d*\s*(GiB|MiB|KiB|GB|MB|KB|B)$/i.test(text)) {
                                    fileNames.push(text);
                                }
                            });
                        });
                        if (fileNames.length > 0) return [...new Set(fileNames)].join("\n");
                    }
                    const spanResult = getFilesFromSpans(dialog);
                    if (spanResult) return spanResult;
                }

                const modal = document.querySelector("#myModal") || document.querySelector(".modal");
                if (modal) {
                    for (const selector of ["table.table-striped tbody tr td:nth-child(2)", "table tbody tr td:nth-child(2)"]) {
                        const result = getFilesFromSelector(selector, modal, false);
                        if (result) return result;
                    }
                    const spanResult = getFilesFromSpans(modal);
                    if (spanResult) return spanResult;
                }

                return null;
            },
            extractIMDB: () => {
                let el = document.querySelector("li.meta__imdb a");
                if (el) {
                    const match = el.href.match(/tt\d{7,8}/);
                    if (match) return match[0];
                }
                let mediainfoEl = document.querySelector(".torrent-mediainfo-dump pre code[x-ref='mediainfo']") ||
                                  document.querySelector(".torrent-mediainfo-dump pre.decoda-code code") ||
                                  document.querySelector(".torrent-mediainfo-dump .decoda-code code") ||
                                  document.querySelector(".torrent-mediainfo-dump code");
                if (mediainfoEl) {
                    const mediainfoText = mediainfoEl.innerText || mediainfoEl.textContent;
                    const imdbMatch = mediainfoText.match(/IMDB\s*:\s*(tt\d{7,8})/i);
                    if (imdbMatch) return imdbMatch[1];
                }

                return null;
            },
            extractReleaseGroup: () => {
                let title = document.querySelector("h1.torrent__name");
                if (!title) {
                    title = document.querySelector("h1") ||
                            document.querySelector(".torrent-title h1") ||
                            document.querySelector("h2.torrent__name");
                }

                if(!title) return null;

                const trimmed = (title.innerText || title.textContent || "").trim();
                const parts = trimmed.split('-');
                if (parts.length > 0) {
                    const lastPart = parts[parts.length - 1].trim();
                    const match = lastPart.match(/^([A-Za-z0-9]+)/);
                return match ? match[1] : null;
            }
                return null;
            },
            extractTorrentType: () => {
                const tvIcon = document.querySelector("i.fa-tv, i.torrent-icon[title*='TV'], i.torrent-icon[title*='Show']");
                if (tvIcon) {
                    return 'tv';
                }
                const movieIcon = document.querySelector("i.fa-film, i.fa-movie, i.torrent-icon[title*='Movie']");
                if (movieIcon) {
                    return 'movie';
                }
                let title = document.querySelector("h1.torrent__name");
                if (!title) {
                    title = document.querySelector("h1") ||
                            document.querySelector(".torrent-title h1") ||
                            document.querySelector("h2.torrent__name") ||
                            document.querySelector("h2");
                }
                if (title) {
                    const titleText = (title.innerText || title.textContent || "").trim();
                    if (/\bS\d{1,2}(?:E\d{1,2})?\b/i.test(titleText)) {
                        return 'tv';
                    }
                }
                const url = window.location.href.toLowerCase();
                if (url.includes('/tv') || url.includes('/series')) {
                    return 'tv';
                }
                if (url.includes('/movie') || url.includes('/film')) {
                    return 'movie';
                }
                const typeElements = document.querySelectorAll('li.meta__type, div.torrent-info__type, span.type');
                for (const el of typeElements) {
                    const text = (el.innerText || el.textContent || '').toLowerCase();
                    if (text.includes('tv') || text.includes('series') || text.includes('episode')) {
                        return 'tv';
                    }
                    if (text.includes('movie') || text.includes('film')) {
                        return 'movie';
                    }
                }

                return null;
            }
        },

        {
            name: "BHD Template",
            domains: ["beyond-hd.me"],
            matches: function(url) { return matchDomains(url, this.domains); },
            extractMediainfo: () => {
                const inline_view = document.querySelector("div.table-torrents tr.libraryinline pre.decoda-code code");
                const torrent_page_view = document.querySelector("div#stats-full pre.decoda-code code");

                return inline_view ? inline_view.innerText.trim() : torrent_page_view ? torrent_page_view.innerText.trim() : null;
            },
            extractFileStructure: () => {
                const match = window.location.href.match(/torrents\/[^.]+\.(\d+)$/);
                if(!match) return null;
                let torrentId = match[1].trim();
                let files = document.querySelectorAll('#modal_torrent_files' + torrentId + ' table tr td:nth-child(2)')
                if(!files) return null;

                const fileNames = Array.from(files)
                    .map(file => {
                        const raw = (file.innerText || file.textContent || "").trim();
                        if (!raw) return null;
                        const extMatch = raw.match(/([^\n]+\.(mkv|mp4|avi|m4v|m2ts|ts|vob|iso))/i);
                        if (extMatch) {
                            return extMatch[1].trim();
                        }
                        if (/-[A-Za-z0-9]+$/.test(raw) && raw.includes('.')) {
                            return raw + '.mkv';
                        }
                        return raw;
                    })
                    .filter(Boolean);

                return fileNames.length > 0 ? fileNames.join("\n") : null;
            },
            extractIMDB: () => {
                const el = document.querySelector("a[title='IMDB']");
                if(!el) return null;
                const match = el.href.match(/tt\d{7,8}/)
                return match ? match[0] : null;
            },
            extractReleaseGroup: () => {
                const title = document.querySelector("div#stats-quick div.text-main span.text-main");
                if(!title) return null;

                const match = title.innerText.match(/-([A-Za-z0-9]+)(\.mkv|\.mp4)?$/);
                return match ? match[1] : null;
            }
        },

        {
            name: "BTN Template",
            domains: ["broadcasthe.net"],
            matches: function(url) { return matchDomains(url, this.domains); },
            extractMediainfo: () => {
                const urlParams = new URLSearchParams(window.location.search);
                const torrentId = urlParams.get('torrentid');
                let blockquotes = [];
                if (torrentId) {
                    const torrentRow = document.querySelector(`tr#torrent_${torrentId}`);
                    if (torrentRow) {
                        blockquotes = torrentRow.querySelectorAll('blockquote');
                    }
                }
                if (blockquotes.length === 0) {
                    blockquotes = document.querySelectorAll('blockquote');
                }

                for (const blockquote of blockquotes) {
                    const text = blockquote.textContent || blockquote.innerText || '';
                    if (text.includes('Unique ID') && text.includes('General')) {
                        return text.trim();
                    }
                }
                return null;
            },
            extractFileStructure: () => {
                const urlParams = new URLSearchParams(window.location.search);
                const torrentId = urlParams.get('torrentid');

                if (torrentId) {
                    const fileTable = document.querySelector(`tr#torrent_${torrentId} table tbody`);
                    if (fileTable) {
                        const files = fileTable.querySelectorAll('tr:not(.colhead_dark) td:first-child');
                        if (files && files.length > 0) {
                            const filenames = Array.from(files)
                                .map(file => {
                                    let filename = file.innerText.trim();
                                    filename = filename.replace(/\s+/g, '-');
                                    return filename;
                                })
                                .filter(f => f && f.endsWith('.mkv'));

                            if (filenames.length > 0) {
                                return filenames.join("\n");
                            }
                        }
                    }
                }

                return null;
            },
            extractIMDB: () => {
                const tvdbElement = document.querySelector('li.meta__tvdb');
                if (!tvdbElement) return null;
                const link = tvdbElement.querySelector('a');
                if (!link || !link.href) return null;
                const match = link.href.match(/[?&]id=(\d+)/);
                return match ? match[1] : null;
            },
            extractReleaseGroup: () => {
                const titleCells = document.querySelectorAll('td[colspan="3"]');
                for (const cell of titleCells) {
                    const text = cell.innerText || cell.textContent || '';
                    const cleanText = text.replace(/^»\s*/, '').trim();
                    const match = cleanText.match(/-([A-Za-z0-9]+)$/);
                    if (match) return match[1];
                }

                return null;
            }
        },

        {
            name: "HDB Template",
            domains: ["hdbits.org"],
            matches: function(url) { return matchDomains(url, this.domains); },
            extractMediainfo: () => {
                const urlParams = new URLSearchParams(window.location.search);
                const torrentId = urlParams.get('id');
                if(!torrentId) return null;

                GM_xmlhttpRequest({
                    method: "GET",
                    url: 'https://hdbits.org/details/mediainfo?id=' + torrentId,
                    onload: function(response) {
                        if (response.status !== 200) {
                            console.error("Failed to fetch:", response.status);
                            return;
                        }

                        mediainfo = response.responseText;
                        uniqueId = extractUniqueId(mediainfo);
                        renderToolkit();

                        // Trigger comparison after mediainfo is loaded
                        setTimeout(() => {
                            autoCompareTorrents();
                        }, 500);
                    }
                });

                return null;
            },
            extractFileStructure: () => {
                const detailsTable = document.querySelector('table#details');
                if (detailsTable) {
                    const downloadLinks = detailsTable.querySelectorAll('a.js-download, a[href*="/download.php/"]');
                    if (downloadLinks && downloadLinks.length > 0) {
                        const filenames = Array.from(downloadLinks)
                            .map(link => {
                                const href = link.getAttribute('href') || '';
                                const filenameMatch = href.match(/\/([^\/]+\.(mkv|mp4|avi|m4v))\.torrent/);
                                if (filenameMatch) {
                                    return filenameMatch[1];
                                }
                                const text = link.textContent || link.innerText || '';
                                const filename = text.replace(/\.torrent$/, '').trim();
                                return filename;
                            })
                            .filter(f => f && (f.toLowerCase().endsWith('.mkv') || f.toLowerCase().endsWith('.mp4') || f.toLowerCase().endsWith('.avi') || f.toLowerCase().endsWith('.m4v')));
                        if (filenames.length > 0) {
                            return filenames.join("\n");
                        }
                    }
                }

                const blocks = [...document.querySelectorAll("div.collapsable")];
                const fileListBlock = blocks.find(el => el.textContent.includes("File list"));
                if (fileListBlock && fileListBlock.nextElementSibling?.classList.contains("hideablecontent")) {
                    let files = fileListBlock.nextElementSibling.querySelectorAll('tr td:first-child');
                    if(files && files.length > 0) {
                        const filenames = Array.from(files)
                        .map(file => file.innerText.trim())
                            .filter(f => f && (f.toLowerCase().endsWith('.mkv') || f.toLowerCase().endsWith('.mp4') || f.toLowerCase().endsWith('.avi') || f.toLowerCase().endsWith('.m4v')));

                        if (filenames.length > 0) {
                            return filenames.join("\n");
                        }
                    }
                }

                const singleFileLink = document.querySelector('a.js-download');
                if (singleFileLink) {
                    const href = singleFileLink.getAttribute('href') || '';
                    const filenameMatch = href.match(/\/([^\/]+\.(mkv|mp4|avi|m4v))\.torrent/);
                    if (filenameMatch) {
                        return filenameMatch[1];
                    }
                    const text = singleFileLink.textContent || singleFileLink.innerText || '';
                    const filename = text.replace(/\.torrent$/, '').trim();
                    if (filename && (filename.toLowerCase().endsWith('.mkv') || filename.toLowerCase().endsWith('.mp4') || filename.toLowerCase().endsWith('.avi') || filename.toLowerCase().endsWith('.m4v'))) {
                        return filename;
                    }
                }

                return null;
            },
            extractIMDB: () => {
                const links = [...document.querySelectorAll('a')];
                const imdbLink = links.find(el => el.href.includes("imdb.com"));
                if(!imdbLink) return null;
                const match = imdbLink.href.match(/tt\d{7,8}/)
                return match ? match[0] : null;
            },
            extractReleaseGroup: () => {
                const title = document.querySelector("div.torrent-title h1");
                if(!title) return null;
                const match = title.innerText.match(/-([A-Za-z0-9]+)$/);
                return match ? match[1] : null;
            }
        },

        {
            name: "Z Network Template",
            domains: ["avistaz.to", "privatehd.to", "cinemaz.to"],
            matches: function(url) { return matchDomains(url, this.domains); },
            extractMediainfo: () => {
                const el = document.querySelector("div#collapseMediaInfo pre");
                return el ? el.textContent.trim() : null;
            },
            extractFileStructure: () => {
                const scripts = document.querySelectorAll('script:not([src])');
                for (const script of scripts) {
                    const scriptText = script.textContent || script.innerText;
                    const torrentFilesIndex = scriptText.indexOf('Torrent.torrentFiles');
                    if (torrentFilesIndex === -1) continue;
                    const commaIndex = scriptText.indexOf(',', torrentFilesIndex);
                    if (commaIndex === -1) continue;
                    let startIndex = scriptText.indexOf('[', commaIndex);
                    let isArray = true;
                    if (startIndex === -1) {
                        startIndex = scriptText.indexOf('{', commaIndex);
                        isArray = false;
                    }
                    if (startIndex === -1) continue;
                    let depth = 0;
                    let endIndex = startIndex;
                    const openChar = isArray ? '[' : '{';
                    const closeChar = isArray ? ']' : '}';
                    for (let i = startIndex; i < scriptText.length; i++) {
                        if (scriptText[i] === openChar) depth++;
                        if (scriptText[i] === closeChar) depth--;
                        if (depth === 0) {
                            endIndex = i + 1;
                            break;
                        }
                    }

                    if (endIndex > startIndex) {
                        try {
                            const jsonStr = scriptText.substring(startIndex, endIndex);
                            const fileData = JSON.parse(jsonStr);
                            const fileNames = [];

                            // Recursive function to extract filenames from children
                            function extractFiles(node) {
                                if (node.children && Array.isArray(node.children)) {
                                    for (const child of node.children) {
                                        if (child.children === false) {
                                            const textMatch = child.text.match(/<span class="file-name">([^<]+)<\/span>/);
                                            if (textMatch) {
                                                const filename = textMatch[1].trim();
                                                if (filename.toLowerCase().endsWith('.mkv')) {
                                                    fileNames.push(filename);
                                                }
                                            }
                                        } else if (child.children && Array.isArray(child.children)) {
                                            extractFiles(child);
                                        }
                                    }
                                }
                            }

                            // Handle both array (movies) and object (series) structures
                            if (Array.isArray(fileData)) {
                                for (const item of fileData) {
                                    if (item.text) {
                                        const textMatch = item.text.match(/<span class="file-name">([^<]+)<\/span>/);
                                        if (textMatch) {
                                            const filename = textMatch[1].trim();
                                            if (filename.toLowerCase().endsWith('.mkv')) {
                                                fileNames.push(filename);
                                            }
                                        }
                                    }
                                }
                            } else if (fileData && typeof fileData === 'object') {
                                extractFiles(fileData);
                            }

                            if (fileNames.length > 0) {
                                return fileNames.join("\n");
                            }
                        } catch (e) {
                            continue;
                        }
                    }
                }

                return null;
            },
            extractIMDB: () => {
                const links = [...document.querySelectorAll('a')];
                const imdbLink = links.find(el => el.href.includes("imdb.com"));
                if(!imdbLink) return null;
                const match = imdbLink.href.match(/tt\d{7,8}/)
                return match ? match[0] : null;
            },
            extractReleaseGroup: () => {
                const title = document.querySelector("a.torrent-filename");
                if(!title) return null;

                const match = title.innerText.match(/-([A-Za-z0-9]+)$/);
                return match ? match[1] : null;
            }
        },

        {
            name: "FL Template",
            domains: ["filelist.io"],
            matches: function(url) { return matchDomains(url, this.domains); },
            extractMediainfo: () => {
                const urlParams = new URLSearchParams(window.location.search);
                const torrentId = urlParams.get('id');
                if(!torrentId) return null;

                GM_xmlhttpRequest({
                    method: "GET",
                    url: 'https://filelist.io/mediainfo.php?id=' + torrentId,
                    onload: function(response) {
                        if (response.status !== 200) {
                            console.error("Failed to fetch:", response.status);
                            return;
                        }

                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, "text/html");
                        const el = doc.querySelector("div.cblock-innercontent");

                        if(!el) return null;

                        mediainfo = el.innerText;
                        uniqueId = extractUniqueId(mediainfo);
                        renderToolkit();
                    }
                });
            },
            extractFileStructure: () => {
                const fileSpans = [...document.querySelectorAll("div.cblock-innercontent > div > div > span")];
                const fileSpan = fileSpans.find(el => el.innerText.includes("Files"));
                if(!fileSpan) return null;
                const temp = document.createElement("div");
                temp.innerHTML = fileSpan.getAttribute('data-original-title');
                const files = temp.querySelectorAll("div[align='left']");
                return Array.from(files)
                    .map(file => file.innerText.trim())
                    .join("\n");
            },
            extractIMDB: () => {
                const links = [...document.querySelectorAll('a')];
                const imdbLink = links.find(el => el.href.includes("imdb.com"));
                if(!imdbLink) return null;
                const match = imdbLink.href.match(/tt\d{7,8}/)
                return match ? match[0] : null;
            },
            extractReleaseGroup: () => {
                const title = document.querySelector("div.cblock-header h4");
                if(!title) return null;

                const match = title.innerText.match(/-([A-Za-z0-9]+)$/);
                return match ? match[1] : null;
            }
        },

         {
            name: "ANT Template",
            domains: ["anthelion.me"],
            matches: function(url) { return matchDomains(url, this.domains); },
            extractMediainfo: () => {
                const visibleTorrentRow = document.querySelector(`tr[id^="torrent_"].pad:not(.hidden)`);
                if (!visibleTorrentRow) return null;
                const match = visibleTorrentRow.id.match(/torrent_(\d+)/);
                if (!match) return null;
                const torrentId = match[1];
                const el = document.querySelector(`tr#torrent_${torrentId} blockquote.mediainfoRaw`);
                return el ? el.textContent.trim() : null;
            },
            extractFileStructure: () => {
                const visibleTorrentRow = document.querySelector(`tr[id^="torrent_"].pad:not(.hidden)`);
                if (!visibleTorrentRow) return null;
                const match = visibleTorrentRow.id.match(/torrent_(\d+)/);
                if (!match) return null;
                const torrentId = match[1];
                const files = document.querySelectorAll(`div#files_${torrentId} tr.row td:first-child`);
                if (!files || files.length === 0) return null;

                const filenames = Array.from(files)
                    .map(file => file.textContent || file.innerText || "")
                    .map(f => f.trim())
                    .filter(f => f.toLowerCase().endsWith('.mkv') || f.toLowerCase().match(/\.(mkv|mp4|avi|m4v|m2ts|ts|vob|iso)$/i));

                return filenames.length > 0 ? filenames.join("\n") : null;
            },
            extractIMDB: () => {
                const links = [...document.querySelectorAll('a')];
                const imdbLink = links.find(el => el.href && el.href.includes("imdb.com"));
                if(!imdbLink) return null;
                const match = imdbLink.href.match(/tt\d{7,8}/)
                return match ? match[0] : null;
            },
            extractReleaseGroup: () => {
                const visibleTorrentRow = document.querySelector(`tr[id^="torrent_"].pad:not(.hidden)`);
                if (!visibleTorrentRow) return null;
                const match = visibleTorrentRow.id.match(/torrent_(\d+)/);
                if (!match) return null;
                const torrentId = match[1];

                const title = document.querySelector(`tr#torrent_${torrentId} div.spoilerContainer input.spoilerButton`);
                if(!title) return null;

                const release_name = title.value || title.textContent || "";
                const match2 = release_name.match(/-([A-Za-z0-9]+)(\.mkv|\.mp4|\.avi)?$/);
                return match2 ? match2[1] : null;
            },
            getDOMHook: () => {
                return document.querySelector('table.torrent_table, table#torrent-table');
            }
        },

        {
            name: "MTV Template",
            domains: ["morethantv.me", "www.morethantv.me"],
            matches: function(url) { return matchDomains(url, this.domains); },
            extractMediainfo: () => {
                const visibleRow = document.querySelector('tr[id^="torrentinfo"]:not(.hidden)');
                if (!visibleRow) return null;
                const rowId = visibleRow.id;
                const torrentId = rowId.replace('torrentinfo', '');
                const contentDiv = visibleRow.querySelector(`div#content${torrentId}`);
                if (contentDiv) {
                    const mediainfoEl = contentDiv.querySelector("div.body div.mediainfo");
                    if (mediainfoEl) return mediainfoEl.textContent.trim();
                }

                return null;
            },
            extractFileStructure: () => {
                const visibleRow = document.querySelector('tr[id^="torrentinfo"]:not(.hidden)');
                if (!visibleRow) return null;
                const rowId = visibleRow.id;
                const torrentId = rowId.replace('torrentinfo', '');
                const filesDiv = visibleRow.querySelector(`div#files_${torrentId}`);
                if (filesDiv) {
                    const rows = filesDiv.querySelectorAll('tr:not(.rowa):not(.smallhead)');
                    if (rows.length > 0) {
                        const filenames = Array.from(rows)
                            .map(row => {
                                const firstCell = row.querySelector('td:first-child');
                                return firstCell ? firstCell.innerText.trim() : null;
                            })
                            .filter(filename => filename && filename.toLowerCase().endsWith('.mkv'));

                        if (filenames.length > 0) {
                            return filenames.join("\n");
                        }
                    }
                }

                return null;
            },
            extractIMDB: () => {
                const visibleRow = document.querySelector('tr[id^="torrentinfo"]:not(.hidden)');
                const searchScope = visibleRow || document;

                const links = [...searchScope.querySelectorAll('a')];
                const imdbLink = links.find(el => el.href && el.href.includes("imdb.com"));
                if (!imdbLink) return null;
                const match = imdbLink.href.match(/tt\d{7,8}/);
                return match ? match[0] : null;
            },
            extractReleaseGroup: () => {
                const visibleRow = document.querySelector('tr[id^="torrentinfo"]:not(.hidden)');
                if (!visibleRow) return null;

                const rowId = visibleRow.id;
                const torrentId = rowId.replace('torrentinfo', '');
                const contentDiv = visibleRow.querySelector(`div#content${torrentId}`);

                if (contentDiv) {
                    const title = contentDiv.querySelector("div.body h1, div.body h2");
                    if (title) {
                        const match = title.innerText.match(/-([A-Za-z0-9]+)$/);
                        if (match) return match[1];
                    }
                }

                return null;
            },
            getDOMHook: () => {
                return document.querySelector('table.torrent_table, table#torrent-table');
            }
        },

        {
            name: "OMGWTFNZBS Template",
            domains: ["omgwtfnzbs.org", "www.omgwtfnzbs.org"],
            matches: function(url) {
                if (!matchDomains(url, this.domains)) return false;
                try {
                    const urlObj = typeof url === 'string' ? new URL(url) : url;
                    return urlObj.pathname && urlObj.pathname.includes('/details');
                } catch (e) {
                    return false;
                }
            },
            extractMediainfo: () => {
                const nfoPre = document.querySelector('div.horizontal-scroll-wrapper.nfo pre');
                return nfoPre ? nfoPre.textContent.trim() : null;
            },
            extractFileStructure: () => {
                const nfoPre = document.querySelector('div.horizontal-scroll-wrapper.nfo pre');
                if (!nfoPre) return null;

                const mediainfo = nfoPre.textContent.trim();
                if (!mediainfo) return null;
                const completeNameMatch = mediainfo.match(/Complete name\s*:\s*(.+)/i);
                if (completeNameMatch && completeNameMatch[1]) {
                    const filename = completeNameMatch[1].trim();
                    if (filename.toLowerCase().endsWith('.mkv')) {
                        return filename;
                    }
                }

                return null;
            },
            extractIMDB: () => {
                const links = [...document.querySelectorAll('a')];
                const imdbLink = links.find(el => el.href && el.href.includes("imdb.com"));
                if (!imdbLink) return null;
                const match = imdbLink.href.match(/tt\d{7,8}/);
                return match ? match[0] : null;
            },
            extractReleaseGroup: () => {
                const titleElement = document.querySelector('span.fls a, span.fls');
                if (titleElement) {
                    const titleText = (titleElement.innerText || titleElement.textContent || "").trim();
                    const match = titleText.match(/[-.]([A-Za-z0-9]+)$/);
                    if (match) return match[1];
                }
                const nfoPre = document.querySelector('div.horizontal-scroll-wrapper.nfo pre');
                if (nfoPre) {
                    const mediainfo = nfoPre.textContent.trim();
                    const completeNameMatch = mediainfo.match(/Complete name\s*:\s*(.+)/i);
                    if (completeNameMatch && completeNameMatch[1]) {
                        const filename = completeNameMatch[1].trim();
                        const match = filename.match(/[-.]([A-Za-z0-9]+)\.mkv$/i);
                        if (match) return match[1];
                    }
                }

                return null;
            }
        },

        {
            name: "HDT Template",
            domains: ["hd-torrents.org"],
            matches: function(url) { return matchDomains(url, this.domains); },
            extractMediainfo: () => {
                const el = document.querySelector("div#technicalInfoHideShowTR font[face='consolas']");
                return el ? el.textContent.trim() : null;
            },
            extractFileStructure: () => {
                const filesDiv = document.querySelector('#files table.detailsright');
                if (filesDiv) {
                    const fileRows = filesDiv.querySelectorAll('tbody tr');
                    if (fileRows && fileRows.length > 1) {
                        const filenames = Array.from(fileRows)
                            .slice(1)
                            .map(row => {
                                const filenameCell = row.querySelector('td.detailsright');
                                return filenameCell ? filenameCell.textContent.trim() : null;
                            })
                            .filter(f => f && f.toLowerCase().endsWith('.mkv'));

                        if (filenames.length > 0) {
                            return filenames.join("\n");
                        }
                    }
                }

                return null;
            },
            extractIMDB: () => {
                const links = [...document.querySelectorAll('a')];
                const imdbLink = links.find(el => el.href.includes("imdb.com"));
                if(!imdbLink) return null;
                const match = imdbLink.href.match(/tt\d{7,8}/)
                return match ? match[0] : null;
            },
            extractReleaseGroup: () => {
                const title = document.querySelector("div#technicalInfoHideShowTR center font[size='4']");
                if(!title) return null;
                const match = title.innerText.match(/-([A-Za-z0-9]+)$/);
                return match ? match[1] : null;
            }
        },

        {
            name: "Animebytes Template",
            domains: ["animebytes.tv"],
            matches: function(url) { return matchDomains(url, this.domains); },
            extractMediainfo: () => {
                let el = document.querySelector(`tr[id^="torrent_"].pad:not(.hide) div[id*="_mediainfo"] div.codeBox pre`);
                if (el) return el.textContent.trim();
                el = document.querySelector(`tr[id^="torrent_"].pad:not(.hide) div[id*="_mediainfo"] pre`);
                if (el) return el.textContent.trim();
                el = document.querySelector("tr.pad:not(.hide) pre.mediainfo, tr.pad:not(.hide) pre.code, tr.pad:not(.hide) code.mediainfo, tr.pad:not(.hide) .mediainfo pre, tr.pad:not(.hide) .mediainfo code");
                if (el) return el.textContent.trim();
                el = document.querySelector("tr.pad:not(.hide) div[id*='mediainfo'] pre, tr.pad:not(.hide) div[id*='mediainfo'] code, tr.pad:not(.hide) div[class*='mediainfo'] pre, tr.pad:not(.hide) div[class*='mediainfo'] code");
                if (el) return el.textContent.trim();
                return null;
            },
            extractFileStructure: () => {
                let files = document.querySelectorAll(`tr[id^="torrent_"].pad:not(.hide) table[id*="filelist_"] tr:not(.colhead_dark) td:first-child`);
                if (files && files.length > 0) {
                    const fileNames = Array.from(files)
                        .map(file => {
                            const text = file.textContent || file.innerText || "";
                            const trimmed = text.trim();
                            if (trimmed.toLowerCase().endsWith('.mkv') || trimmed.toLowerCase().match(/\.(mkv|mp4|avi|m4v|m2ts|ts|vob|iso)$/i)) {
                                return trimmed;
                            }
                            return null;
                        })
                        .filter(f => f !== null);

                    if (fileNames.length > 0) {
                        return fileNames.join("\n");
                    }
                }

                return null;
            },
            extractIMDB: () => {
                const links = [...document.querySelectorAll('a')];
                const imdbLink = links.find(el => el.href && el.href.includes("imdb.com"));
                if (imdbLink) {
                    const match = imdbLink.href.match(/tt\d{7,8}/);
                    if (match) return match[0];
                }
                const imdbText = document.body.innerText || document.body.textContent || "";
                const imdbMatch = imdbText.match(/IMDB[:\s]+(tt\d{7,8})/i);
                if (imdbMatch) return imdbMatch[1];
                return null;
            },
            extractReleaseGroup: () => {
                let title = document.querySelector(`tr[id^="torrent_"].pad:not(.hide) a.torrent-info-link`);
                if (!title) {
                    title = document.querySelector("div#technicalInfoHideShowTR center font[size='4']") ||
                           document.querySelector("span.group_title strong a") ||
                           document.querySelector("h1, h2");
                }
                if (!title) return null;

                const release_name = title.textContent || title.innerText || "";
                const match = release_name.match(/-([A-Za-z0-9]+)(\.mkv|\.mp4|\.avi)?$/);
                return match ? match[1] : null;
            },
            getDOMHook: () => {
                return document.querySelector('table.torrent_table, table#torrent-table');
            }
        },

        {
            name: "Nexus Template",
            domains: ["hhanclub.top", "audiences.me", "ptchdbits.co", "pterclub.net"],
            matches: function(url) { return matchDomains(url, this.domains); },
            extractMediainfo: () => {
                let el = document.querySelector("#mediainfo-raw pre code") ||
                         document.querySelector("#mediainfo-raw pre");
                if (el) return el.textContent.trim();

                el = document.querySelector("#mediainfo-info pre code") ||
                     document.querySelector("#mediainfo-info pre");
                if (el) return el.textContent.trim();
                el = document.querySelector("div.hide div.codemain") ||
                     document.querySelector("div.codemain");
                return el ? el.textContent.trim() : null;
            },
            extractFileStructure: () => {
                const isCHDBits = window.location.hostname.includes('ptchdbits.co');
                const isPTerClub = window.location.hostname.includes('pterclub.net');

                if (isCHDBits) {
                    const descriptionDiv = document.querySelector("div#kdescr, div[id='kdescr']");
                    const codeMain = document.querySelector("div.hide div.codemain") ||
                                   document.querySelector("div.codemain") ||
                                   document.querySelector("fieldset");
                    const searchText = descriptionDiv ? (descriptionDiv.textContent || descriptionDiv.innerText || "") :
                                    codeMain ? (codeMain.textContent || codeMain.innerText || "") : "";

                    if (searchText) {
                        const fileNameMatch = searchText.match(/File\s+Name[.\s:]+:?\s*([^\r\n]+)/i);
                        if (fileNameMatch && fileNameMatch[1]) {
                            let fileName = fileNameMatch[1].trim();
                            if (!/\.(mkv|mp4|avi|m4v)$/i.test(fileName)) {
                                fileName += ".mkv";
                            }
                            if (fileName) {
                                return fileName;
                            }
                        }
                    }

                    const downloadLink = document.querySelector("a.index[href*='download.php'], a[href*='download.php'].index");
                    if (downloadLink) {
                        let linkText = (downloadLink.textContent || downloadLink.innerText || "").trim();
                        linkText = linkText.replace(/^\[CHDBits\]\.?/i, '');
                        linkText = linkText.replace(/\.torrent$/i, '');
                        if (linkText && /\.mkv$/i.test(linkText)) {
                            return linkText;
                        }
                    }
                }

                const spans = document.querySelectorAll("#mediainfo-info span");
                if (spans && spans.length > 0) {
                    for (let i = 0; i < spans.length - 1; i++) {
                        const labelText = (spans[i].textContent || spans[i].innerText || "").trim();
                        const normalized = labelText.replace(/\s+/g, "");
                        if (normalized.startsWith("文件名") || /^file\s*name[:：]?$/i.test(labelText.trim())) {
                            const valueSpan = spans[i + 1];
                            if (!valueSpan) break;
                            let fileName = (valueSpan.textContent || valueSpan.innerText || "").trim();
                            if (isPTerClub) {
                                fileName = fileName.replace(/^MediaInfo\s*-\s*/i, '');
                            }
                            if (fileName && /\.mkv$/i.test(fileName)) {
                                return fileName;
                            }
                            return null;
                        }
                    }
                }

                const codeTopLink = document.querySelector("div.codetop a");
                if (codeTopLink) {
                    let text = (codeTopLink.textContent || codeTopLink.innerText || "").trim();
                    if (isPTerClub) {
                        text = text.replace(/^MediaInfo\s*-\s*/i, '');
                    }
                    if (text && /\.mkv$/i.test(text)) {
                        return text;
                    }
                }

                const codeMain = document.querySelector("div.hide div.codemain") ||
                                 document.querySelector("div.codemain");
                if (codeMain) {
                    const raw = codeMain.textContent || codeMain.innerText || "";
                    const match = raw.match(/Complete name\s*:?\s*(.+?\.mkv)/i);
                    if (match && match[1]) {
                        let fileName = match[1].trim().split(/[\\/]/).pop();
                        if (isPTerClub) {
                            fileName = fileName.replace(/^MediaInfo\s*-\s*/i, '');
                        }
                        if (fileName && /\.mkv$/i.test(fileName)) {
                            return fileName;
                        }
                    }
                }

                return null;
            },
            extractIMDB: () => {
                const imdbLink = document.querySelector("a[href*='imdb.com/title/tt']");
                if (!imdbLink || !imdbLink.href) return null;
                const match = imdbLink.href.match(/tt\d{7,8}/);
                return match ? match[0] : null;
            },
            extractReleaseGroup: () => {
                const titleBlocks = document.querySelectorAll("div.font-bold.leading-6");
                if (!titleBlocks || titleBlocks.length < 2) return null;

                for (let i = 0; i < titleBlocks.length - 1; i++) {
                    const label = (titleBlocks[i].textContent || titleBlocks[i].innerText || "").trim();
                    if (label === "标题" || /^title$/i.test(label)) {
                        const titleDiv = titleBlocks[i + 1];
                        if (!titleDiv) break;
                        const text = (titleDiv.textContent || titleDiv.innerText || "").trim();
                        const match = text.match(/-([A-Za-z0-9]+)$/);
                        return match ? match[1] : null;
                    }
                }

                return null;
            }
        },

        {
            name: "PTP Template",
            matches: (url) => url.includes("passthepopcorn.me"),
            extractMediainfo: () => {
                const visibleTorrentRow = document.querySelector(`tr[id^="torrent_"]:not(.hidden)`);
                if (!visibleTorrentRow) return null;
                const allMediainfoTables = visibleTorrentRow.querySelectorAll('table.mediainfo');
                const allBlockquotes = visibleTorrentRow.querySelectorAll('blockquote.spoiler');
                const oldPattern = visibleTorrentRow.querySelector('table.mediainfo + blockquote.spoiler');
                if (oldPattern) {
                    const blockquoteText = oldPattern.textContent.trim();
                    if (blockquoteText.includes('Source BDInfo') || blockquoteText.includes('Disc Title:')) {
                        for (let i = 0; i < allBlockquotes.length; i++) {
                            const text = allBlockquotes[i].textContent.trim();
                            if (text.includes('General') && !text.includes('Source BDInfo') && !text.includes('Disc Title:')) {
                                const mediainfoMatch = text.match(/General[\s\S]*?$/);
                                return mediainfoMatch ? mediainfoMatch[0].trim() : text;
                            }
                        }
                    } else {
                        const mediainfoMatch = blockquoteText.match(/General[\s\S]*?$/);
                        return mediainfoMatch ? mediainfoMatch[0].trim() : blockquoteText;
                    }
                }

                for (const mediainfoTable of allMediainfoTables) {
                    const blockquote = mediainfoTable.closest('blockquote.spoiler');
                    if (blockquote) {
                        const text = blockquote.textContent.trim();
                        if (text.includes('Source BDInfo') || text.includes('Disc Title:')) {
                            continue;
                        }
                        const mediainfoMatch = text.match(/General[\s\S]*?$/);
                        return mediainfoMatch ? mediainfoMatch[0].trim() : text;
                    }
                }
                for (const blockquote of allBlockquotes) {
                    const text = blockquote.textContent.trim();
                    if (text.includes('General') && !text.includes('Source BDInfo') && !text.includes('Disc Title:') && text.includes('Unique ID')) {
                        const mediainfoMatch = text.match(/General[\s\S]*?$/);
                        return mediainfoMatch ? mediainfoMatch[0].trim() : text;
                    }
                }

                return null;
            },
            extractFileStructure: () => {
                const files = document.querySelectorAll(`tr[id^="torrent_"]:not(.hidden) div[id^="files_"] tr td:first-child`);
                if (!files) return null;

                return Array.from(files)
                    .map(file => file.innerText.trim())
                    .join("\n");
            },
            extractIMDB: () => {
                const links = [...document.querySelectorAll('a')];
                const imdbLink = links.find(el => el.href.includes("imdb.com"));
                if (!imdbLink) return null;
                const match = imdbLink.href.match(/tt\d{7,8}/)
                return match ? match[0] : null;
            },
            extractReleaseGroup: () => {
                const title = document.querySelector(`tr[id^="torrent_"]:not(.hidden) di.movie-page__torrent__panel div.bbcode-table-guard > a`);
                if (!title) return null;

                const release_name = title.value;
                const match = release_name.match(/-([A-Za-z0-9]+)(\.mkv|\.mp4|\.avi)?$/);
                return match ? match[1] : null;
            },
            getDOMHook: () => {
                return document.querySelector('table#torrent-table');
            }
        },

        {
            name: "GreatPosterWall Template",
            matches: (url) => url.includes("greatposterwall.com"),
            extractMediainfo: () => {
                let visibleTorrentRow = document.querySelector(`tr.TableTorrent-rowDetail.Table-row:not(.u-hidden)`);
                if (!visibleTorrentRow) {
                    visibleTorrentRow = document.querySelector(`tr.Table-row:not(.u-hidden)`);
                }
                if (!visibleTorrentRow) return null;

                const mediainfoEl = visibleTorrentRow.querySelector('pre.MediaInfoText');
                if (!mediainfoEl) return null;

                const text = mediainfoEl.textContent.trim();
                if (text.includes('General') || text.includes('Unique ID')) {
                    const match = text.match(/General[\s\S]*?$/);
                    return match ? match[0].trim() : text;
                }
                return null;
            },
            extractFileStructure: () => {
                let visibleTorrentRow = document.querySelector(`tr.TableTorrent-rowDetail.Table-row:not(.u-hidden)`);
                if (!visibleTorrentRow) {
                    visibleTorrentRow = document.querySelector(`tr.Table-row:not(.u-hidden)`);
                }
                if (!visibleTorrentRow) return null;
                const fileNameDivs = visibleTorrentRow.querySelectorAll('div.TorrentDetailfileList-fileName');
                if (fileNameDivs && fileNameDivs.length > 0) {
                    const filenames = Array.from(fileNameDivs)
                        .map(div => {
                            const clone = div.cloneNode(true);
                            const svgs = clone.querySelectorAll('svg');
                            svgs.forEach(svg => svg.remove());
                            return (clone.textContent || clone.innerText || "").trim();
                        })
                        .filter(f => f && /\.(mkv|mp4|avi|m4v|m2ts|ts|vob|iso)$/i.test(f));

                    if (filenames.length > 0) {
                        return filenames.join("\n");
                    }
                }

                const fileListDiv = visibleTorrentRow.querySelector('div.TorrentDetail-fileList');
                if (fileListDiv) {
                    const fileNameDivsInList = fileListDiv.querySelectorAll('div.TorrentDetailfileList-fileName');
                    if (fileNameDivsInList && fileNameDivsInList.length > 0) {
                        const filenames = Array.from(fileNameDivsInList)
                            .map(div => {
                                const clone = div.cloneNode(true);
                                const svgs = clone.querySelectorAll('svg');
                                svgs.forEach(svg => svg.remove());
                                return (clone.textContent || clone.innerText || "").trim();
                            })
                            .filter(f => f && /\.(mkv|mp4|avi|m4v|m2ts|ts|vob|iso)$/i.test(f));

                        if (filenames.length > 0) {
                            return filenames.join("\n");
                        }
                    }
                }

                const mediainfoRow = visibleTorrentRow.querySelector('div.is-mediainfo');
                if (mediainfoRow) {
                    const detailsDiv = mediainfoRow.querySelector('div');
                    if (detailsDiv) {
                        const text = detailsDiv.textContent || detailsDiv.innerText || "";
                        const filenameMatch = text.match(/\|\s*([^\s]+\.(mkv|mp4|avi|m4v|m2ts|ts|vob|iso))/i);
                        if (filenameMatch && filenameMatch[1]) {
                            return filenameMatch[1].trim();
                        }
                    }
                }

                const mediainfoEl = visibleTorrentRow.querySelector('pre.MediaInfoText');
                if (mediainfoEl) {
                    const mediainfoText = mediainfoEl.textContent.trim();
                    const completeNameMatch = mediainfoText.match(/Complete name\s*:?\s*(.+?\.(mkv|mp4|avi|m4v|m2ts|ts|vob|iso))/i);
                    if (completeNameMatch && completeNameMatch[1]) {
                        const filename = completeNameMatch[1].trim().split(/[\\/]/).pop();
                        if (filename) {
                            return filename;
                        }
                    }
                }

                return null;
            },
            extractIMDB: () => {
                let visibleTorrentRow = document.querySelector(`tr.TableTorrent-rowDetail.Table-row:not(.u-hidden)`);
                if (!visibleTorrentRow) {
                    visibleTorrentRow = document.querySelector(`tr.Table-row:not(.u-hidden)`);
                }
                const searchScope = visibleTorrentRow || document;
                const links = [...searchScope.querySelectorAll('a')];
                const imdbLink = links.find(el => el.href && el.href.includes("imdb.com"));
                if (!imdbLink) return null;
                const match = imdbLink.href.match(/tt\d{7,8}/);
                return match ? match[0] : null;
            },
            extractReleaseGroup: () => {
                let visibleTorrentRow = document.querySelector(`tr.TableTorrent-rowDetail.Table-row:not(.u-hidden)`);
                if (!visibleTorrentRow) {
                    visibleTorrentRow = document.querySelector(`tr.Table-row:not(.u-hidden)`);
                }
                if (!visibleTorrentRow) return null;

                const titleCell = visibleTorrentRow.querySelector('td.TableTorrent-cellName, td.Table-cell');
                if (!titleCell) return null;

                const titleText = titleCell.textContent || titleCell.innerText || "";
                const match = titleText.match(/[-.]([A-Za-z0-9]+)(\.mkv|\.mp4|\.avi)?$/);
                return match ? match[1] : null;
            },
            getDOMHook: () => {
                return document.querySelector('table, tbody');
            }
        }

    ];

    /* ---------------------------------------------------------------------
     * SELECT TEMPLATE BASED ON URL, THEN LOAD DATA
     * ---------------------------------------------------------------------
     */

    const currentURL = window.location.href;
    if (currentURL.includes('/similar/') || currentURL.includes('/moderation')) {
        return;
    }
    const url = new URL(currentURL);
    const isAnimebytes = url.hostname.includes('animebytes.tv');
    const isPTP = url.hostname.includes('passthepopcorn.me');
    const isGPW = url.hostname.includes('greatposterwall.com');
    const isMTV = url.hostname.includes('morethantv.me');
    const hasNumericIdInPath = /\/(torrents?|details)\/\d+/.test(url.pathname) ||
                               /\/(torrents?|details)\/.*\.\d+$/.test(url.pathname) ||
                               (/\/(details|torrents)\.php/.test(url.pathname) && url.searchParams.has('id')) ||
                               (url.pathname.includes('/details') && url.searchParams.has('id'));
    if (!hasNumericIdInPath) {
        return;
    }

    activeTemplate = siteTemplates.find((m) => m.matches(currentURL)) || null;
    if (!activeTemplate && isAnimebytes) {
        activeTemplate = siteTemplates.find((m) => m.name === "Animebytes Template") || null;
    }
    const isAnthelion = url.hostname.includes('anthelion.me');
    if (!activeTemplate && isAnthelion) {
        activeTemplate = siteTemplates.find((m) => m.name === "ANT Template") || null;
    }
    if (!activeTemplate && isPTP) {
        activeTemplate = siteTemplates.find((m) => m.name === "PTP Template") || null;
    }
    if(activeTemplate && !isAnimebytes && !isAnthelion && !isPTP && !isMTV && !isGPW) {
        mediainfo = activeTemplate.extractMediainfo();
        uniqueId = extractUniqueId(mediainfo);
        file_structure = activeTemplate.extractFileStructure();
        imdbId = activeTemplate.extractIMDB();
        const release_group = activeTemplate.extractReleaseGroup();
        const torrentType = activeTemplate.extractTorrentType ? activeTemplate.extractTorrentType() : null;

        // Extract resolution and release group for filtering
        currentResolution = extractResolutionFromTitle();
        currentReleaseGroup = release_group;

        buildHomeTrackerLink();
        // Auto-store data only for Aither when page loads
        const isAither = window.location.hostname.includes('aither.cc');
        if (isAither && (uniqueId || file_structure || mediainfo)) {
            const existingData = GM_getValue("tmt_search_data", null);
            if (!existingData || !existingData.showOnAither) {
                GM_setValue("tmt_search_data", {
                    uniqueId: uniqueId || null,
                    filename: file_structure || null,
                    mediainfo: mediainfo || null,
                    timestamp: Date.now(),
                    fromHomeTrackerButton: false,
                    showOnAither: false
                });
            }
        }
    }

    /* ---------------------------------------------------------------------
     * AUTOMATIC TORRENT COMPARISON ON HOME TRACKER
     * ---------------------------------------------------------------------
     * When navigating from another tracker, automatically find matching torrents
     * using stored Unique ID and filename
     */
    function autoCompareTorrents() {
        const searchData = GM_getValue("tmt_search_data", null);
        if (!searchData) return;

        const isAither = window.location.hostname.includes('aither.cc');
        const isAnimebytes = window.location.hostname.includes('animebytes.tv');
        const isAnthelion = window.location.hostname.includes('anthelion.me');
        const isPTP = window.location.hostname.includes('passthepopcorn.me');
        const isMTV = window.location.hostname.includes('morethantv.me');
        const isGPW = window.location.hostname.includes('greatposterwall.com');
        if (searchData.forceLoad || searchData.fromHomeTrackerButton) {
        } else if (isAither) {
            if (!searchData.showOnAither) {
                return;
            }
        }

        if (Date.now() - searchData.timestamp > 5 * 60 * 1000) {
            GM_setValue("tmt_search_data", null);
            return;
        }

        const url = new URL(window.location.href);
        const hasNumericIdInPath = /\/(torrents?|details)\/\d+/.test(url.pathname) ||
                                   /\/(torrents?|details)\/.*\.\d+$/.test(url.pathname) ||
                                   (/\/(details|torrents)\.php/.test(url.pathname) && url.searchParams.has('id')) ||
                                   (url.pathname.includes('/details') && url.searchParams.has('id'));

        // Only show on individual torrent pages (has numeric ID in path, not search results with just imdbId)
        const isIndividualTorrent = hasNumericIdInPath;
        if (!isIndividualTorrent) {
            return;
        }

        if (isAnimebytes || isAnthelion || isPTP || isMTV || isGPW) {
            let visibleTorrentRow = null;
            if (isPTP) {
                visibleTorrentRow = document.querySelector(`tr[id^="torrent_"]:not(.hidden)`);
            } else if (isMTV) {
                visibleTorrentRow = document.querySelector(`tr[id^="torrentinfo"]:not(.hidden)`);
            } else if (isGPW) {
                visibleTorrentRow = document.querySelector(`tr.TableTorrent-rowDetail.Table-row:not(.u-hidden)`);
                if (!visibleTorrentRow) {
                    visibleTorrentRow = document.querySelector(`tr.Table-row:not(.u-hidden)`);
                }
                if (!visibleTorrentRow) {
                    visibleTorrentRow = document.querySelector(`tr.TableTorrent-rowDetail`);
                }
                if (!visibleTorrentRow) {
                    visibleTorrentRow = document.querySelector(`tr[class*="TableTorrent-rowDetail"]`);
                }
            } else {
                visibleTorrentRow = document.querySelector(`tr[id^="torrent_"].pad:not(.hide)`);
                if (!visibleTorrentRow) {
                    visibleTorrentRow = document.querySelector(`tr[id^="torrent_"].pad:not(.hidden)`);
                }
            }
            if (!visibleTorrentRow && !mediainfo && !file_structure) {
                return;
            }
        }

        const { uniqueId: storedUniqueId, filename: storedFilename } = searchData;
        const showAndCompare = () => {
            setTimeout(() => {
                showStoredDataDisplay(searchData);
                findMatchingTorrent(storedUniqueId, storedFilename);
            }, 1000);
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', showAndCompare);
        } else {
            showAndCompare();
        }
    }

    function showStoredDataDisplay(searchData) {
        const existing = document.getElementById("tmt-stored-data-display");
        if (existing) existing.remove();
        const { uniqueId: storedUniqueId, filename: storedFilename } = searchData;
        if (!storedUniqueId && !storedFilename) return;
        let currentUniqueId = uniqueId || null;
        let currentFilename = file_structure || null;
        if (activeTemplate && (!currentUniqueId || !currentFilename)) {
            if (!currentUniqueId) {
                const currentMediainfo = mediainfo || activeTemplate.extractMediainfo();
                if (currentMediainfo) {
                    currentUniqueId = extractUniqueId(currentMediainfo);
                }
            }
            if (!currentFilename) {
                currentFilename = activeTemplate.extractFileStructure();
            }
        }

        // Compare Unique IDs (case-insensitive)
        let uidMatch = false;
        if (storedUniqueId && currentUniqueId) {
            uidMatch = storedUniqueId.toLowerCase() === currentUniqueId.toLowerCase();
        }

        // Compare filenames (case-sensitive - exact match required)
        let filenameMatch = false;
        if (storedFilename && currentFilename) {
            const storedNormalized = storedFilename.trim().replace(/\s+/g, ' ');
            const currentNormalized = currentFilename.trim().replace(/\s+/g, ' ');

            // Check for exact match (case-sensitive)
            if (storedNormalized === currentNormalized) {
                filenameMatch = true;
            } else {
                const storedLines = storedFilename.split('\n').map(f => f.trim()).filter(f => f.length > 0);
                const currentLines = currentFilename.split('\n').map(f => f.trim()).filter(f => f.length > 0);

                if (storedLines.length > 0 && currentLines.length > 0) {
                    const isHHANAUDCHD = window.location.hostname.includes('hhanclub.top') ||
                                       window.location.hostname.includes('audiences.me') ||
                                       window.location.hostname.includes('ptchdbits.co') ||
                                       window.location.hostname.includes('pterclub.net');

                    if (isHHANAUDCHD) {
                        // Check if any stored line matches any current line (case-sensitive)
                        const anyFound = storedLines.some(storedLine => {
                            return currentLines.some(currentLine => currentLine === storedLine);
                        });
                        filenameMatch = anyFound;
                    } else {
                        // For other sites: check if all stored lines exactly match lines in current (case-sensitive)
                        const allFound = storedLines.every(storedLine => {
                            return currentLines.some(currentLine => currentLine === storedLine);
                        });
                        filenameMatch = allFound;
                    }
                }
            }
        }

        const display = document.createElement("div");
        display.id = "tmt-stored-data-display";
        display.innerHTML = `
            <div class="header">
                <b>Stored Comparison Data</b>
                <button id="tmt-close-stored-data">×</button>
            </div>
            <div class="body">
                ${storedUniqueId ? `<div><span class="uid">UID: ${storedUniqueId}</span></div>` : ''}
                ${storedFilename ? `<div class="data-item"><strong>File:</strong> <pre>${storedFilename.split('\n')[0]}</pre></div>` : ''}
                <div class="comparison-boxes">
                    <div class="comparison-box ${uidMatch ? 'match' : 'no-match'}">
                        <div class="comparison-label">UID Match</div>
                        <div class="comparison-status">${uidMatch ? '✓ Match' : '✗ No Match'}</div>
                    </div>
                    <div class="comparison-box ${filenameMatch ? 'match' : 'no-match'}">
                        <div class="comparison-label">Filename Match</div>
                        <div class="comparison-status">${filenameMatch ? '✓ Match' : '✗ No Match'}</div>
                    </div>
                </div>
                <div style="margin-top: 5px;">
                    <button id="btnMediainfoCompare">Mediainfo Compare</button>
                </div>
            </div>
        `;

        document.body.appendChild(display);

        // Close button handler - also clear stored data so it doesn't show again
        document.getElementById("tmt-close-stored-data").addEventListener("click", () => {
            GM_setValue("tmt_search_data", null);
            display.remove();
        });

        document.getElementById("btnMediainfoCompare").addEventListener("click", () => {
            const storedMediainfo = (searchData.mediainfo && searchData.mediainfo !== "null") ? searchData.mediainfo : "";
            let currentMediainfo = mediainfo || "";
            if (!currentMediainfo && activeTemplate && activeTemplate.extractMediainfo) {
                currentMediainfo = activeTemplate.extractMediainfo() || "";
            }

            const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substr(2);
            const body = `--${boundary}\r\nContent-Disposition: form-data; name="mediainfo"\r\n\r\n${storedMediainfo}\r\n--${boundary}\r\nContent-Disposition: form-data; name="mediainfo"\r\n\r\n${currentMediainfo}\r\n--${boundary}--\r\n`;

            GM_xmlhttpRequest({
                method: "POST",
                url: 'https://mediainfo.okami.icu/api/compare',
                headers: { "Content-Type": "multipart/form-data; boundary=" + boundary },
                data: body,
                onload: (response) => {
                    const data = JSON.parse(response.responseText);
                    if (data.url) window.open(data.url, "_blank");
                }
            });
        });

        setTimeout(() => {
            if (display.parentNode) {
                display.remove();
            }
        }, 120000);
    }

    function findMatchingTorrent(storedUniqueId, storedFilename) {
        if (!activeTemplate) return;

        let score = 0;
        let matchFound = false;

        const currentMediainfo = mediainfo || activeTemplate.extractMediainfo();
        const currentUniqueId = currentMediainfo ? extractUniqueId(currentMediainfo) : null;
        const currentFilename = activeTemplate.extractFileStructure();

        if (storedUniqueId && currentUniqueId) {
            if (storedUniqueId.toLowerCase() === currentUniqueId.toLowerCase()) {
                score += 100;
                matchFound = true;
                GM_setValue("tmt_search_data", null);
                return;
            }
        }

        // Compare filenames
        if (storedFilename && currentFilename) {
            const storedParts = storedFilename.split('\n').map(f => f.trim()).filter(f => f.length > 0);
            const currentParts = currentFilename.split('\n').map(f => f.trim()).filter(f => f.length > 0);

            // Check for exact filename matches
            for (const storedPart of storedParts) {
                for (const currentPart of currentParts) {
                    if (storedPart === currentPart) {
                        score += 50;
                        matchFound = true;
                    } else if (storedPart.length > 10 && currentPart.includes(storedPart)) {
                        score += 20;
                        matchFound = true;
                    }
                }
            }
        }

        // Also check the page title/name for matches
        const titleElement = document.querySelector("h1.torrent__name") || document.querySelector("h1") || document.querySelector(".torrent-title h1");
        if (titleElement && storedFilename) {
            const titleText = titleElement.textContent || titleElement.innerText || '';
            const storedParts = storedFilename.split('\n').map(f => f.trim()).filter(f => f.length > 0);

            for (const storedPart of storedParts) {
                if (storedPart.length > 10 && titleText.includes(storedPart)) {
                    score += 15;
                    matchFound = true;
                }
            }
        }

        if (matchFound && score > 0) {
            showToast(`Match found! (Score: ${score})`, 5000);
            GM_setValue("tmt_search_data", null);
            }
        }


    if (!isAnimebytes && !isAnthelion && !isPTP && !isMTV) {
        autoCompareTorrents();
    }

    /* ---------------------------------------------------------------------
     * SET STYLES FOR FLOATING TOOLBAR UI
     * ---------------------------------------------------------------------
     */

    GM_addStyle(`
      #torrentModToolkit {
          position: fixed !important;
          bottom: 20px !important;
          right: 20px !important;
          background-color: #1e2332 !important;
          color: #fff !important;
          padding: 10px 14px !important;
          border-radius: 8px !important;
          border: none !important;
          border-color: transparent !important;
          font-size: 14px !important;
          z-index: 999999 !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.35) !important;
          min-width: 250px !important;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
      }

      #torrentModToolkit,
      #torrentModToolkit div,
      #torrentModToolkit span,
      #torrentModToolkit p,
      #torrentModToolkit a,
      #torrentModToolkit label {
          color: #fff !important;
      }

      #torrentModToolkit a:link,
      #torrentModToolkit a:visited,
      #torrentModToolkit a:hover,
      #torrentModToolkit a:active {
          color: #fff !important;
      }

      #torrentModToolkit * {
          box-sizing: border-box !important;
      }

      #torrentModToolkit .body,
      #torrentModToolkit .header {
          background: transparent !important;
          background-color: transparent !important;
      }

      #torrentModToolkit button:not(#tmt-load-links):not(#tmt-settings-btn) {
          display: block !important;
          width: 100% !important;
          margin-top: 6px !important;
          padding: 6px !important;
          border: none !important;
          border-radius: 4px !important;
          background: #2e3445 !important;
          background-color: #2e3445 !important;
          color: white !important;
          font-size: 13px !important;
          cursor: arrow !important;
      }

      #torrentModToolkit .header {
          display: flex !important;
          flex-direction: row !important;
          align-items: center !important;
          gap: 8px !important;
          background: transparent !important;
      }

      #torrentModToolkit .header .center {
         flex: 1 !important;
         text-align: center !important;
      }

      #torrentModToolkit .header button {
          margin-left: auto !important;
          flex-basis: 12px !important;
          font-weight: bold !important;
          background: none !important;
          color: #fff !important;
      }

      #torrentModToolkit .header a {
          display: inline-block !important;
          text-decoration: none !important;
      }

      #torrentModToolkit .center {
          text-align: center !important;
      }

      #torrentModToolkit .pad {
          padding: 3px !important;
      }

      /* Keep top tracker icons on one line even if site CSS forces links to block */
      #torrentModToolkit .center.pad a {
          display: inline-block !important;
          margin: 0 2px !important;
      }

      #torrentModToolkit .uid {
         font-size: 12px !important;
         color: #fff !important;
      }

      #torrentModToolkit * {
          box-sizing: border-box !important;
      }

      #torrentModToolkit button:not([disabled]):hover {
          background: #2d6cd3 !important;
          cursor: pointer !important;
      }

      #torrentModToolkit button:not(#tmt-load-links):not(#tmt-settings-btn)[disabled] {
          background: #181C25 !important;
      }

      #tmt-toast-container {
            position: fixed;
            bottom: 180px;
            right: 20px;
            z-index: 9999999;
            display: flex;
            flex-direction: column;
            gap: 10px;
            pointer-events: none; /* let clicks pass through */
        }

        .tmt-toast {
            min-width: 180px;
            max-width: 300px;
            background: rgba(0,0,0,0.85);
            color: #fff;
            padding: 10px 14px;
            border-radius: 6px;
            font-size: 13px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.3s ease, transform 0.3s ease;
            pointer-events: auto;
        }

        .tmt-toast.show {
            opacity: 1;
            transform: translateY(0);
        }

        #tmt-stored-data-display {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #1e2332;
            color: #fff;
            padding: 0;
            border-radius: 9.6px;
            font-size: 15.6px;
            z-index: 999998;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            min-width: 384px;
            max-width: 384px;
            overflow: hidden;
        }

        #tmt-stored-data-display .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 9.6px 14.4px;
            border-bottom: 1px solid #2e3445;
            background: #2e3445;
        }

        #tmt-stored-data-display .header b {
            font-size: 14.4px;
        }

        #tmt-stored-data-display .header button {
            background: none;
            border: none;
            color: #fff;
            font-size: 24px;
            cursor: pointer;
            padding: 0;
            width: 28.8px;
            height: 28.8px;
            line-height: 24px;
            border-radius: 4.8px;
        }

        #tmt-stored-data-display .header button:hover {
            background: #3e4455;
        }

        #tmt-stored-data-display .body {
            padding: 12px 14.4px;
        }

        #tmt-stored-data-display .data-item {
            margin-bottom: 4.8px;
        }

        #tmt-stored-data-display .data-item:last-child {
            margin-bottom: 0;
        }

        #tmt-stored-data-display .data-item strong {
            display: block;
            margin-bottom: 2.4px;
            color: #a0a0a0;
            font-size: 10.8px;
            text-transform: uppercase;
        }

        #tmt-stored-data-display code {
            background: #0d1117;
            color: #e0e0e0;
            padding: 2.4px 4.8px;
            border-radius: 3.6px;
            font-family: 'Courier New', monospace;
            font-size: 10.8px;
            word-break: break-all;
            display: inline-block;
            max-width: 100%;
            line-height: 1.44;
        }

        #tmt-stored-data-display pre {
            background: #0d1117;
            color: #e0e0e0;
            padding: 4.8px 7.2px;
            border-radius: 3.6px;
            font-family: 'Courier New', monospace;
            font-size: 10.8px;
            margin: 0;
            white-space: pre-wrap;
            word-wrap: break-word;
            line-height: 1.56;
            max-width: 100%;
        }


        #tmt-load-links {
            display: block !important;
            width: 100% !important;
            margin-top: 6px !important;
            padding: 2px !important;
            border: none !important;
            border-radius: 4px !important;
            background: #2e3445 !important;
            background-color: #2e3445 !important;
            color: white !important;
            font-size: 13px !important;
            cursor: pointer !important;
        }

        #tmt-load-links:hover {
            background: #2d6cd3 !important;
        }

        #tmt-load-links:disabled {
            background: #181C25 !important;
            cursor: not-allowed !important;
            opacity: 0.6;
        }

        .tracker-found {
            border: 2px solid rgb(0, 220, 0) !important;
            border-radius: 3px;
        }

        .tracker-seeding {
            border: 2px solid rgb(0, 220, 220) !important;
            border-radius: 3px;
        }
N
        .tracker-loading {
            opacity: 0.6;
            animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
        }

        .tmt-filters {
            margin: 6px 0;
            padding: 4px 0;
            font-size: 12px;
        }

        .tmt-filter-label {
            display: block;
            margin: 3px 0;
            cursor: pointer;
            color: #fff !important;
        }

        .tmt-filter-label input[type="checkbox"] {
            margin-right: 6px;
            cursor: pointer;
        }

        #tmt-stored-data-display .uid {
            font-size: 14.4px;
        }

        #tmt-stored-data-display .comparison-boxes {
            display: flex;
            gap: 4.8px;
            margin-top: 4.8px;
        }

        #tmt-stored-data-display .comparison-box {
            flex: 1;
            padding: 3.6px 4.8px;
            border-radius: 3.6px;
            text-align: center;
            border: 1px solid;
            transition: all 0.3s;
        }

        #tmt-stored-data-display .comparison-box.match {
            background: rgba(76, 175, 80, 0.2);
            border-color: #4caf50;
        }

        #tmt-stored-data-display .comparison-box.no-match {
            background: rgba(244, 67, 54, 0.2);
            border-color: #f44336;
        }

        #tmt-stored-data-display .comparison-label {
            font-size: 10.8px;
            text-transform: uppercase;
            color: #a0a0a0;
            margin-bottom: 2.4px;
            font-weight: bold;
        }

        #tmt-stored-data-display .comparison-status {
            font-size: 13.2px;
            font-weight: bold;
        }

        #tmt-stored-data-display .comparison-box.match .comparison-status {
            color: #4caf50;
        }

        #tmt-stored-data-display .comparison-box.no-match .comparison-status {
            color: #f44336;
        }

        #tmt-stored-data-display .body button {
            display: block !important;
            width: 100% !important;
            margin-top: 6px !important;
            padding: 6px !important;
            border: none !important;
            border-radius: 4px !important;
            background: #2e3445 !important;
            background-color: #2e3445 !important;
            color: white !important;
            font-size: 13px !important;
            cursor: pointer !important;
        }

        #tmt-stored-data-display .body button:hover {
            background: #2d6cd3 !important;
            background-color: #2d6cd3 !important;
        }

        #tmt-resolution-check-display {
            position: fixed;
            top: 20px;
            left: 20px;
            background: #1e2332;
            color: #fff;
            padding: 0;
            border-radius: 8px;
            font-size: 13px;
            z-index: 999998;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            min-width: 300px;
            max-width: 500px;
            max-height: 500px;
            overflow-y: auto;
        }

        #tmt-resolution-check-display .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 14px;
            border-bottom: 1px solid #2e3445;
            background: #2e3445;
        }

        #tmt-resolution-check-display .header b {
            font-size: 14px;
        }

        #tmt-resolution-check-display .header button {
            background: none;
            border: none;
            color: #fff;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            width: 24px;
            height: 24px;
            line-height: 20px;
            border-radius: 4px;
        }

        #tmt-resolution-check-display .header button:hover {
            background: #3e4455;
        }

        #tmt-resolution-check-display .body {
            padding: 14px;
        }

        #tmt-resolution-check-display .data-item {
            margin-bottom: 12px;
        }

        #tmt-resolution-check-display .data-item strong {
            display: block;
            margin-bottom: 6px;
            color: #a0a0a0;
            font-size: 12px;
            text-transform: uppercase;
        }

        #tmt-resolution-check-display code {
            background: #0d1117;
            padding: 4px 8px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-size: 12px;
        }

        #tmt-resolution-check-display .image-results {
            margin-top: 12px;
        }

        #tmt-resolution-check-display .image-results strong {
            display: block;
            margin-bottom: 8px;
            color: #a0a0a0;
            font-size: 12px;
            text-transform: uppercase;
        }

        #tmt-resolution-check-display .image-result {
            padding: 6px 8px;
            margin-bottom: 4px;
            border-radius: 4px;
            font-size: 12px;
            font-family: 'Courier New', monospace;
        }

        #tmt-resolution-check-display .image-result.match {
            background: rgba(76, 175, 80, 0.2);
            color: #4caf50;
        }

        #tmt-resolution-check-display .image-result.no-match {
            background: rgba(244, 67, 54, 0.2);
            color: #f44336;
        }

        #tmt-resolution-check-display .image-result.error {
            background: rgba(158, 158, 158, 0.2);
            color: #9e9e9e;
        }

        /* Settings Button */
        #tmt-settings-btn {
            display: block !important;
            width: 100% !important;
            margin-top: 6px !important;
            padding: 2px !important;
            border: none !important;
            border-radius: 4px !important;
            background: #2e3445 !important;
            background-color: #2e3445 !important;
            color: white !important;
            font-size: 13px !important;
            cursor: pointer !important;
        }

        #tmt-settings-btn:hover {
            background: #2d6cd3 !important;
        }

        /* Settings Sidebar */
        #tmt-settings-sidebar {
            position: fixed;
            left: 0;
            top: 0;
            width: 320px;
            height: 100vh;
            background-color: #1e2332;
            border-right: 1px solid #888;
            transform: translateX(-100%);
            transition: transform 0.3s ease;
            z-index: 1000000;
            overflow-y: auto;
            padding: 20px;
            box-sizing: border-box;
            color: #fff;
        }

        #tmt-settings-sidebar.open {
            transform: translateX(0);
        }

        #tmt-settings-content h3 {
            margin-top: 0;
            color: #fff;
        }

        #tmt-settings-content h4 {
            margin: 20px 0 10px 0;
            color: #F5C518;
            font-size: 14px;
        }

        #tmt-settings-content section {
            margin-bottom: 25px;
        }

        #tmt-settings-content label {
            display: block;
            margin: 10px 0;
            color: #fff;
            cursor: pointer;
            font-size: 13px;
        }

        #tmt-settings-content input[type="checkbox"] {
            margin-right: 10px;
            cursor: pointer;
        }

        #tmt-settings-close {
            color: #aaa;
            float: right;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
            line-height: 20px;
        }

        #tmt-settings-close:hover,
        #tmt-settings-close:focus {
            color: #fff;
        }
    `);

    setupToast();
    loadConfig(false); // Load homeTrackerConfig from external source
    function initToolkit() {
        const isAnimebytes = window.location.hostname.includes('animebytes.tv');
        const isAnthelion = window.location.hostname.includes('anthelion.me');
        const isPTP = window.location.hostname.includes('passthepopcorn.me');
        const isMTV = window.location.hostname.includes('morethantv.me');
        const isGPW = window.location.hostname.includes('greatposterwall.com');
        if (isAnimebytes || isAnthelion || isPTP || isMTV || isGPW) {
            const renderAnimebytesAnthelionPTP = () => {
                if (document.body) {
                    let visibleTorrentRow = null;
                    if (isPTP) {
                        visibleTorrentRow = document.querySelector(`tr[id^="torrent_"]:not(.hidden)`);
                    } else if (isMTV) {
                        visibleTorrentRow = document.querySelector(`tr[id^="torrentinfo"]:not(.hidden)`);
                    } else if (isGPW) {
                        // Try multiple selectors for GPW
                        visibleTorrentRow = document.querySelector(`tr.TableTorrent-rowDetail.Table-row:not(.u-hidden)`);
                        if (!visibleTorrentRow) {
                            visibleTorrentRow = document.querySelector(`tr.Table-row:not(.u-hidden)`);
                        }
                        if (!visibleTorrentRow) {
                            visibleTorrentRow = document.querySelector(`tr.TableTorrent-rowDetail`);
                        }
                        if (!visibleTorrentRow) {
                            visibleTorrentRow = document.querySelector(`tr[class*="TableTorrent-rowDetail"]`);
                        }
                    } else {
                        visibleTorrentRow = document.querySelector(`tr[id^="torrent_"].pad:not(.hide)`);
                        if (!visibleTorrentRow) {
                            visibleTorrentRow = document.querySelector(`tr[id^="torrent_"].pad:not(.hidden)`);
                        }
                    }
                    if (visibleTorrentRow && activeTemplate) {
                        mediainfo = activeTemplate.extractMediainfo();
                        uniqueId = extractUniqueId(mediainfo);
                        file_structure = activeTemplate.extractFileStructure();
                        imdbId = activeTemplate.extractIMDB();
                        const release_group = activeTemplate.extractReleaseGroup();
                        const torrentType = activeTemplate.extractTorrentType ? activeTemplate.extractTorrentType() : null;
                        buildHomeTrackerLink();
                        // Auto-store data only for Aither when page loads
                        const isAither = window.location.hostname.includes('aither.cc');
                        if (isAither && (uniqueId || file_structure || mediainfo)) {
                            const existingData = GM_getValue("tmt_search_data", null);
                            if (!existingData || !existingData.showOnAither) {
                                GM_setValue("tmt_search_data", {
                                    uniqueId: uniqueId || null,
                                    filename: file_structure || null,
                                    mediainfo: mediainfo || null, // Store mediainfo automatically
                                    timestamp: Date.now(),
                                    fromHomeTrackerButton: false,
                                    showOnAither: false
                                });
                            }
                        }
                        if (isPTP || isMTV || isGPW) {
                            autoCompareTorrents();
                        }
                    }
                    // Render toolkit (with or without data)
                    renderToolkit();
                    const torrentTable = document.querySelector('table.torrent_table, table#torrent-table, table, tbody');
                    let observerKey = 'tmtObserver';
                    if (isAnimebytes) {
                        observerKey = 'tmtAnimebytesObserver';
                    } else if (isAnthelion) {
                        observerKey = 'tmtAnthelionObserver';
                    } else if (isPTP) {
                        observerKey = 'tmtPTPObserver';
                    } else if (isMTV) {
                        observerKey = 'tmtMTVObserver';
                    } else if (isGPW) {
                        observerKey = 'tmtGPWObserver';
                    }
                    if (torrentTable && !window[observerKey]) {
                        window[observerKey] = new MutationObserver(() => {
                            let newVisibleRow = null;
                            if (isPTP) {
                                newVisibleRow = document.querySelector(`tr[id^="torrent_"]:not(.hidden)`);
                            } else if (isMTV) {
                                newVisibleRow = document.querySelector(`tr[id^="torrentinfo"]:not(.hidden)`);
                            } else if (isGPW) {
                                // Try multiple selectors for GPW
                                newVisibleRow = document.querySelector(`tr.TableTorrent-rowDetail.Table-row:not(.u-hidden)`);
                                if (!newVisibleRow) {
                                    newVisibleRow = document.querySelector(`tr.Table-row:not(.u-hidden)`);
                                }
                                if (!newVisibleRow) {
                                    newVisibleRow = document.querySelector(`tr.TableTorrent-rowDetail`);
                                }
                                if (!newVisibleRow) {
                                    newVisibleRow = document.querySelector(`tr[class*="TableTorrent-rowDetail"]`);
                                }
                            } else {
                                newVisibleRow = document.querySelector(`tr[id^="torrent_"].pad:not(.hide)`);
                                if (!newVisibleRow) {
                                    newVisibleRow = document.querySelector(`tr[id^="torrent_"].pad:not(.hidden)`);
                                }
                            }
                            if (newVisibleRow && activeTemplate) {
                                mediainfo = activeTemplate.extractMediainfo();
                                uniqueId = extractUniqueId(mediainfo);
                                file_structure = activeTemplate.extractFileStructure();
                                imdbId = activeTemplate.extractIMDB();
                                const release_group = activeTemplate.extractReleaseGroup();
                                const torrentType = activeTemplate.extractTorrentType ? activeTemplate.extractTorrentType() : null;
                                buildHomeTrackerLink();

                                // Auto-store data only for Aither when page loads
                                const isAither = window.location.hostname.includes('aither.cc');
                                if (isAither && (uniqueId || file_structure || mediainfo)) {
                                    const existingData = GM_getValue("tmt_search_data", null);
                                    if (!existingData || !existingData.showOnAither) {
                                        GM_setValue("tmt_search_data", {
                                            uniqueId: uniqueId || null,
                                            filename: file_structure || null,
                                            mediainfo: mediainfo || null, // Store mediainfo automatically
                                            timestamp: Date.now(),
                                            fromHomeTrackerButton: false,
                                            showOnAither: false
                                        });
                                    }
                                }

                                // Re-render toolkit with new data
                                renderToolkit();

                                // Run comparison now that we have data from the visible torrent
                                autoCompareTorrents();
                            } else if (!newVisibleRow) {
                                mediainfo = null;
                                uniqueId = null;
                                file_structure = null;
                                imdbId = null;
                                renderToolkit();
                            }
                        });

                        // Observe the torrent table for changes
                        window[observerKey].observe(torrentTable, {
                            childList: true,
                            subtree: true,
                            attributes: true,
                            attributeFilter: ['class', 'style']
                        });
                    }
                } else {
                    // Retry if body doesn't exist yet
                    setTimeout(renderAnimebytesAnthelionPTP, 100);
                }
            };

            // Small delay to ensure dynamic content is loaded
            setTimeout(renderAnimebytesAnthelionPTP, 200);
        } else {
            if (document.body) {
                renderToolkit();
            } else {
                if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', renderToolkit);
                } else {
                    setTimeout(initToolkit, 100);
                }
            }
        }
    }

    initToolkit();

})();