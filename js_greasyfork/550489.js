// ==UserScript==
// @name         SH Series Status
// @namespace    ultrabenosaurus.ScribbleHub
// @version      2.3
// @description  Add series status (e.g. hiatus, ongoing) next to the title.
// @author       Ultrabenosaurus
// @license      GNU AGPLv3
// @source       https://greasyfork.org/en/users/437117-ultrabenosaurus?sort=name
// @match        https://www.scribblehub.com/series/*
// @match        https://www.scribblehub.com/series-finder/*
// @match        https://www.scribblehub.com/?s=*
// @icon         https://www.google.com/s2/favicons?domain=scribblehub.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @require      https://update.greasyfork.org/scripts/550787/1667342/UBMonkeyConfig.js
// @downloadURL https://update.greasyfork.org/scripts/550489/SH%20Series%20Status.user.js
// @updateURL https://update.greasyfork.org/scripts/550489/SH%20Series%20Status.meta.js
// ==/UserScript==

var cfg = new MonkeyConfig({
    title: 'SH Series Status Preferences',
    menuCommand: true,
    onSave: function (values) {
        window.location.reload();
    },
    parameters: {
        completed_colour: {
            label: 'Completed Colour',
            type: 'custom',
            html: '<input type="color" />',
            set: function (value, parent) {
                parent.querySelectorAll('input')[0].value = value;
            },
            get: function (parent) {
                return parent.querySelectorAll('input')[0].value;
            },
            default: 'gold'
        },
        ongoing_colour: {
            label: 'Ongoing Colour',
            type: 'custom',
            html: '<input type="color" />',
            set: function (value, parent) {
                parent.querySelectorAll('input')[0].value = value;
            },
            get: function (parent) {
                return parent.querySelectorAll('input')[0].value;
            },
            default: 'darkgreen'
        },
        hiatus_months: {
            label: 'Months for Hiatus',
            type: 'number',
            default: 3
        },
        hiatus_colour: {
            label: 'Hiatus Colour',
            type: 'custom',
            html: '<input type="color" />',
            set: function (value, parent) {
                parent.querySelectorAll('input')[0].value = value;
            },
            get: function (parent) {
                return parent.querySelectorAll('input')[0].value;
            },
            default: 'darkred'
        },
        abandoned_months: {
            label: 'Months for Abandoned',
            type: 'number',
            default: 12
        },
        abandoned_colour: {
            label: 'Abandoned Colour',
            type: 'custom',
            html: '<input type="color" />',
            set: function (value, parent) {
                parent.querySelectorAll('input')[0].value = value;
            },
            get: function (parent) {
                return parent.querySelectorAll('input')[0].value;
            },
            default: 'darkred'
        }
    }
});

/**
* userscript go brrrr
*/
(function() {
    'use strict';

    const _style = "text-transform:capitalize;color:";

    if( window.location.href.includes( '/series/' ) ) {

        //console.log("/series/");
        UBseriesPageStatus( _style );

    } else if(
        window.location.href.includes( '/series-finder/' )
        || window.location.href.includes( '/?s=' )
    ) {

        //console.log("/series-finder/");
        UBseriesFinderStatus( _style );

    }

})();

function UBseriesPageStatus( _style ) {
    document.querySelector('div.fic_stats').insertAdjacentHTML("afterbegin", '<span class="st_item" title="Last Update"><i class="fa fa-clock-o" aria-hidden="true"></i> ' + document.querySelector('div.sb_content.copyright ul.widget_fic_similar li span[title^="Last updated"]:not(:has(span[title^="Last updated"]))').innerText + '</span>');

    const seriesStatus = document.querySelector( 'ul.widget_fic_similar li:last-child span.rnd_stats + span' );
    const ficTitle = document.querySelector( 'div.fic_title' );

    const badMatches = seriesStatus.textContent.match( /\b(?:hiatus|discontinued)\b/i );
    if( badMatches && badMatches.length ) {

        const _daysSince = new Date() - new Date ( seriesStatus.querySelector( 'span' ).textContent );

        if( cfg.get( "abandoned_months" ) <= Math.ceil( _daysSince / (1000 * 3600 * 24 * 30) ) ) {

            seriesStatus.style = _style + cfg.get( "abandoned_colour" ) + ";font-weight:bold;";
            UBaddSeriesStatus( ficTitle, "abandoned", _style + cfg.get( "abandoned_colour" ) + ";" );

        } else {

            seriesStatus.style = _style + cfg.get( "hiatus_colour" ) + ";font-weight:bold;";
            UBaddSeriesStatus( ficTitle, badMatches[0], _style + cfg.get( "hiatus_colour" ) + ";" );

        }
        return true;

    }

    let goodMatches = seriesStatus.textContent.match( /\b(?:ongoing|completed)\b/i );
    if( goodMatches && goodMatches.length ) {

        if ( "ongoing" == goodMatches[0].toLowerCase() ) {

            seriesStatus.style = _style + cfg.get( "ongoing_colour" ) + ";font-weight:bold;";
            UBaddSeriesStatus( ficTitle, goodMatches[0], _style + cfg.get( "ongoing_colour" ) + ";" );
            return true;

        } else if ( "completed" == goodMatches[0].toLowerCase() ) {

            seriesStatus.style = _style + cfg.get( "completed_colour" ) + ";font-weight:bold;";
            UBaddSeriesStatus( ficTitle, goodMatches[0], _style + cfg.get( "completed_colour" ) + ";" );
            return true;

        }

    }

    return false;

}

function UBseriesFinderStatus( _style ) {
    const seriesResults = document.querySelectorAll( 'div.search_main_box' );

    if( 0 != seriesResults.length ) {
        //console.log(seriesResults);

        seriesResults.forEach( function( _series, _i ) {

            const _title = _series.querySelector( 'div.search_title' );

            if( 0!= _series.querySelectorAll( 'div.search_genre a.fic_genre.completed' ).length ) {

                UBaddSeriesStatus( _title, "completed", _style + cfg.get( "completed_colour" ) + ";" );

            } else {

                let _dateText = ''
                if( 0!= _series.querySelectorAll( 'div.search_stats.mb' ).length ) {
                    _dateText = _series.querySelector( 'div.search_stats span:nth-last-child(2)' ).textContent.replace( 'Updated: ', '' );
                } else {
                    _dateText = _series.querySelector( 'div.search_stats span[title="Last Updated"]' ).textContent;
                }
                const _lastUpdate = new Date( _dateText );
                const _daysSince = new Date() - _lastUpdate;

                //console.log(_lastUpdate, _daysSince, Math.ceil( _daysSince / (1000 * 3600 * 24 * 30) ));

                if( cfg.get( "abandoned_months" ) <= Math.ceil( _daysSince / (1000 * 3600 * 24 * 30) ) ) {

                    UBaddSeriesStatus( _title, "abandoned", _style + cfg.get( "abandoned_colour" ) + ";" );

                } else if( cfg.get( "hiatus_months" ) <= Math.ceil( _daysSince / (1000 * 3600 * 24 * 30) ) ) {

                    UBaddSeriesStatus( _title, "hiatus", _style + cfg.get( "hiatus_colour" ) + ";" );

                } else {

                    UBaddSeriesStatus( _title, "ongoing", _style + cfg.get( "ongoing_colour" ) + ";" );

                }

            }
        });

    }
}

function UBaddSeriesStatus(_parent, _status, _style) {
    const statusElem = document.createElement( 'span' );
    statusElem.style = _style;
    statusElem.textContent = " (" + _status + ")";

    if( "hidden" == window.getComputedStyle( _parent ).getPropertyValue( 'overflow' ) ) {
        statusElem.textContent = "(" + _status + ") ";
        _parent.prepend(statusElem);
    } else {
        _parent.append(statusElem);
    }
}