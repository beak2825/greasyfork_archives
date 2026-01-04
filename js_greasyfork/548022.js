// ==UserScript==
// @name         GameBanana Full Width Mods
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Extends the mod grid across the entire width (homepage and game pages), corrects the display of sections
// @match        https://gamebanana.com/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/548022/GameBanana%20Full%20Width%20Mods.user.js
// @updateURL https://update.greasyfork.org/scripts/548022/GameBanana%20Full%20Width%20Mods.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log("[GB-FULLWIDTH] script actif");

    GM_addStyle(`
        /* Remove Spotlight everywhere */
        #AuxiliaryColumn, #CommunitySpotlight {
            display: none !important;
        }

        /* Main containers expand */
        body, #BodyWrapper, #MainContentWrapper, #ContentGrid {
            max-width: 100% !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            box-sizing: border-box !important;
        }

        #ContentGrid {
            display: block !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 auto !important;
            padding: 0 1rem !important;
        }

        /* All mod modules (homepage + game pages) */
        #SubmissionsListModule,
        .PageModule,
        .Section {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 auto !important;
            box-sizing: border-box !important;
        }
		/* Section column (right, reduced) */
		.xs-h.xs-uh-11.sm-h.sm-uh-8.md-5.lg-4 {
			max-width: 320px !important;
			flex: 0 0 320px !important;
			margin: 0 0 0 auto !important;
			box-sizing: border-box !important;
		}

		/* Main column (mods) → takes up all remaining space */
		.md-7.lg-8 {
			flex: 1 1 auto !important;
			max-width: calc(100% - 320px) !important;
			box-sizing: border-box !important;
		}
		/* Side columns → compact and on the right */
		.xs-12.sm-4.md-4.lg-3,
		.xs-h.xs-uh-11.sm-h.sm-uh-6.md-h.md-uh-5.lg-3 {
			order: 2 !important;               /* places them after the main column */
            max-width: 280px !important;       /* reduced width */
            flex: 0 0 280px !important;        /* fixed width */
            margin-left: auto !important;      /* sticks to the right */
            box-sizing: border-box !important;
		}

		/* Main column → takes up all remaining space */
		.xs-12.sm-8.md-8.lg-6 {
			order: 1 !important;               /* remains before the side columns */
			flex: 1 1 auto !important;
			max-width: calc(100% - 280px) !important;
			margin-right: auto !important;
			box-sizing: border-box !important;
		}



        /* All mod grids */
        .RecordsGrid {
            display: grid !important;
            grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)) !important;
            grid-gap: 16px !important;
            justify-items: center !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 auto !important;
            box-sizing: border-box !important;
        }

        /* Each mod retains its size */
        .Record.Flow.ModRecord {
            width: 100% !important;
            max-width: 220px !important;
            box-sizing: border-box !important;
        }

        /* TopGames remains focused and limited */
        #TopGamesModule {
            width: 100% !important;
            max-width: 1200px !important;
            margin: 0 auto !important;
            padding: 12px 16px !important;
            box-sizing: border-box !important;
        }


        #FeaturesSliderModule {
            width: 100% !important;
            max-width: 75% !important;
            max-height: 100% !important;
        }


/* --- Fix overlapping on mod pages --- */
#ContentGrid row {
    display: flex !important;
    flex-wrap: nowrap !important;
    align-items: flex-start !important;
}

/* Right sidebar (lg-3) → fixed width */
.xs-h.xs-uh-11.sm-h.sm-uh-6.md-h.md-uh-5.lg-3 {
    flex: 0 0 280px !important;
    max-width: 280px !important;
    margin-left: auto !important;
    position: relative !important; /* empêche le chevauchement */
    z-index: 2 !important;
}

/* Main area (#MoreInCategorySubmissionsListModule) → takes the rest */
#MoreInCategorySubmissionsListModule {
    flex: 1 1 auto !important;
    max-width: calc(100% - 280px) !important;
    margin-right: 16px !important;
    position: relative !important;
    z-index: 1 !important;
}
/* --- Fix “More in Category” display (remains in grid instead of vertical) --- */
#MoreInCategorySubmissionsListModule .RecordsGrid {
    display: grid !important;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)) !important;
    grid-gap: 16px !important;
    justify-items: center !important;
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 auto !important;
    box-sizing: border-box !important;
}

/* Each mod retains its normal size */
#MoreInCategorySubmissionsListModule .Record.Flow.ModRecord {
    width: 100% !important;
    max-width: 220px !important;
    box-sizing: border-box !important;
}
/* --- Complete correction "More in Category" --- */
#MoreInCategorySubmissionsListModule {
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 auto !important;
    box-sizing: border-box !important;
}

#MoreInCategorySubmissionsListModule .RecordsGrid {
    display: grid !important;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)) !important;
    gap: 16px !important;
    justify-content: center !important;  /* centre la grille */
    align-items: start !important;
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 auto !important;
    box-sizing: border-box !important;
}

/* Each mod: fixed centered map */
#MoreInCategorySubmissionsListModule .Record.Flow.ModRecord {
    display: flex !important;
    flex-direction: column !important;
    justify-content: flex-start !important;
    align-items: center !important;
    width: 220px !important;   /* Fixed size */
    max-width: 220px !important;
    box-sizing: border-box !important;
}



    `);

    // Observe: correct if GameBanana re-injects inline styles
    const fixGrids = () => {
        document.querySelectorAll(".RecordsGrid").forEach(grid => {
            grid.style.display = "grid";
            grid.style.gridTemplateColumns = "repeat(auto-fill, minmax(220px, 1fr))";
        });
    };

    const obs = new MutationObserver(fixGrids);
    obs.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true
    });
    fixGrids();


})();