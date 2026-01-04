// ==UserScript==
// @name         TitanCraft - Parts Display & Filter
// @namespace    TitanCraft
// @version      1.01
// @description  Displays the part names in TitanCraft, and adds a search filter for parts
// @author       Gazza
// @match        ^https://titancraft.com/$
// @icon         https://www.google.com/s2/favicons?sz=64&domain=titancraft.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558934/TitanCraft%20-%20Parts%20Display%20%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/558934/TitanCraft%20-%20Parts%20Display%20%20Filter.meta.js
// ==/UserScript==

/* global $ */

(function() {
    $(document).ready(function() {
        $("head").append(`
            <style>
                #rightside .mainsection.hasassets .assetentry.filtered {
                    display: none;
                }
                #rightside .mainsection.hasassets .assetentry div.part-name {
                    float: left;
                    width: 110px;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    text-wrap: nowrap;
                    text-align: center;
                    font-family: 'cairo-semibold'
                }
                #rightside .mainsection.hasassets .thumbnailitem .icons {
                    bottom: -3px;
                }
                #rightside .mainsection.hasassets .search-container {
                    flex-shrink: 0;
                }
                #rightside .mainsection.hasassets .search-container.hidden {
                    display: none;
                }
                #rightside .mainsection.hasassets .search-container input {
                    width: 90%;
                    height: 20px;
                }
                .parts-tooltip.hidden {
                    display: none;
                }
            </style>
        `);
        $("#rightside .mainsection.hasassets .assetentry *[tooltip-left]").each(function() {
            var $tooltip = $($(this).attr("tooltip-left"));
            var title = $tooltip.find(".title").text();
            $(`<span class="tooltip default tooltip-left parts-tooltip hidden">
                   <div class="icontooltip">
                       <div class="title">${title}</div>
                   </div>
               </span>
               <div class="part-name">${title}</div>
           `).insertBefore($(this));
        });
        $("#rightside .mainsection.hasassets .assetentry .part-name").hover(
            function() {
                $(this).prev().removeClass("hidden");
                $(this).prev().css("top", ($(this).offset().top + 10) + "px");
            },
            function() {
                $(this).prev().addClass("hidden");
            }
        );
        $("#rightside .mainsection.hasassets div.searchbtn").attr("title", "Click to toggle search filter");
        $("#rightside .mainsection.hasassets div.searchbtn").html(`
            <a class="searchbtn">
                <i class="fa fa-search"></i>
            </a>
        `);
        $("#rightside .mainsection.hasassets div.searchbtn").after(`
            <div class="search-container hidden">
                <input class="parts-search-filter" type="text" />
            </div>
        `);
        $("#rightside div.searchbtn").off("click");
        $("#rightside .mainsection.hasassets div.searchbtn").click(function() {
            $(this).next().toggleClass("hidden");
        });
        $("#rightside .mainsection.hasassets .search-container input").keyup(function(e) {
            if (e.keyCode === 32) {
                $(this).val($(this).val() + " ");
            }
            performFilter();
        });
        $(".tabbtn").click(function() {
            $("#rightside .mainsection.hasassets .assetentry.filtered").removeClass("filtered");
            performFilter();
        });
    });

    function performFilter() {
        $(".mainsection.hasassets").each(function() {
            if (!$(this).hasClass("hide")) {
                var filter = $(this).find(".search-container input").val().toLowerCase();
                if (filter.length === 0) {
                    $(this).find(".assetentry.filtered").removeClass("filtered");
                }
                else
                {
                    $(this).find(".assetentry").each(function() {
                        if (!$(this).find(".part-name").text().toLowerCase().includes(filter)) {
                            $(this).addClass("filtered");
                        }
                        else {
                            $(this).removeClass("filtered");
                        }
                    });
                }
            }
        });
    }
})();