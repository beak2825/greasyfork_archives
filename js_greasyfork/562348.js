// ==UserScript==
// @name         Inoreader Catppuccin Theme (Userscript)
// @namespace    github.com/catppuccin
// @version      2025.09.06
// @description  Soothing pastel theme for Inoreader (Catppuccin)
// @author       Catppuccin hiyun1137 (assited by Gemini)
// @license      MIT
// @icon         https://raw.githubusercontent.com/catppuccin/catppuccin/main/assets/logos/exports/macchiato_squircle.png
// @match        *://www.inoreader.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/562348/Inoreader%20Catppuccin%20Theme%20%28Userscript%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562348/Inoreader%20Catppuccin%20Theme%20%28Userscript%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIGURATION ---
    // Change these variables to customize the theme.
    // NOTE: In userscripts, unlike userstyles, flavors are selected manually.

    // Select your desired flavor (theme):
    // Options: 'latte', 'frappe', 'macchiato', 'mocha'
    const selectedFlavor = 'macchiato';

    // Select your desired accent color:
    // Options: 'rosewater', 'flamingo', 'pink', 'mauve', 'red', 'maroon', 'peach',
    //          'yellow', 'green', 'teal', 'blue', 'sapphire', 'sky', 'lavender', 'subtext0'
    const accentColorName = 'sky';
    // ---------------------


    // Catppuccin Color Palettes (MOCHA used as default base)
    const palettes = {
        latte: {
            rosewater: '#dc8a78', flamingo: '#dd7878', pink: '#ea76cb', mauve: '#8839ad', red: '#d20f39', maroon: '#e64553', peach: '#fe640b', yellow: '#df8e1d', green: '#40a02b', teal: '#179299', sky: '#04a5e5', sapphire: '#209fb5', blue: '#1e66f5', lavender: '#7287fd', text: '#4c4f69', subtext1: '#5c5f77', subtext0: '#6c6f85', overlay2: '#7c7f93', overlay1: '#8c8fa1', overlay0: '#9ca0b0', surface2: '#acb0be', surface1: '#bcc0cc', surface0: '#ccd0da', base: '#eff1f5', mantle: '#e6e9ed', crust: '#dce0e8'
        },
        frappe: {
            rosewater: '#f2d5cf', flamingo: '#eebebe', pink: '#f4b8e4', mauve: '#ca9ee6', red: '#e78284', maroon: '#ea999c', peach: '#f5c2e7', yellow: '#eed49f', green: '#a6d189', teal: '#81c8be', sky: '#99d1db', sapphire: '#85c1dc', blue: '#89b4fa', lavender: '#babbf1', text: '#c6d0f5', subtext1: '#b5bfe2', subtext0: '#a5adce', overlay2: '#9499c5', overlay1: '#8388b7', overlay0: '#7379a9', surface2: '#62688f', surface1: '#51576d', surface0: '#414559', base: '#303446', mantle: '#292c3c', crust: '#232634'
        },
        macchiato: {
            rosewater: '#f4dbd6', flamingo: '#f0c6c6', pink: '#f5bde6', mauve: '#c6a0f6', red: '#ed8796', maroon: '#ee99a0', peach: '#f5a97f', yellow: '#eed49f', green: '#a6da95', teal: '#8bd5ca', sky: '#91d7e3', sapphire: '#7dc4e4', blue: '#8aadf4', lavender: '#b7bdf8', text: '#cad3f5', subtext1: '#b8c0e0', subtext0: '#a5adcb', overlay2: '#939ab7', overlay1: '#8087a2', overlay0: '#6e738d', surface2: '#5b6078', surface1: '#494d64', surface0: '#363a4f', base: '#24273a', mantle: '#1e2030', crust: '#181926'
        },
        mocha: {
            rosewater: '#f5e0dc', flamingo: '#f2cdcd', pink: '#f5c2e7', mauve: '#cba6f7', red: '#f38ba8', maroon: '#eba0ac', peach: '#fab387', yellow: '#f9e2af', green: '#a6e3a1', teal: '#94e2d5', sky: '#89dceb', sapphire: '#74c7ec', blue: '#89b4fa', lavender: '#b4bbf3', text: '#cdd6f4', subtext1: '#bac2de', subtext0: '#a6adc8', overlay2: '#9399b2', overlay1: '#7f849c', overlay0: '#6c7086', surface2: '#585b70', surface1: '#45475a', surface0: '#313244', base: '#1e1e2e', mantle: '#181825', crust: '#11111b'
        }
    };

    // Get the selected palette
    const currentPalette = palettes[selectedFlavor] || palettes.mocha;
    const accent = currentPalette[accentColorName] || currentPalette.mauve;

    // Apply colors to the root variables (CSS Custom Properties)
    let cssVariables = `
        :root {
            --ctp-rosewater: ${currentPalette.rosewater};
            --ctp-flamingo: ${currentPalette.flamingo};
            --ctp-pink: ${currentPalette.pink};
            --ctp-mauve: ${currentPalette.mauve};
            --ctp-red: ${currentPalette.red};
            --ctp-maroon: ${currentPalette.maroon};
            --ctp-peach: ${currentPalette.peach};
            --ctp-yellow: ${currentPalette.yellow};
            --ctp-green: ${currentPalette.green};
            --ctp-teal: ${currentPalette.teal};
            --ctp-sky: ${currentPalette.sky};
            --ctp-sapphire: ${currentPalette.sapphire};
            --ctp-blue: ${currentPalette.blue};
            --ctp-lavender: ${currentPalette.lavender};

            --ctp-text: ${currentPalette.text};
            --ctp-subtext1: ${currentPalette.subtext1};
            --ctp-subtext0: ${currentPalette.subtext0};
            --ctp-overlay2: ${currentPalette.overlay2};
            --ctp-overlay1: ${currentPalette.overlay1};
            --ctp-overlay0: ${currentPalette.overlay0};
            --ctp-surface2: ${currentPalette.surface2};
            --ctp-surface1: ${currentPalette.surface1};
            --ctp-surface0: ${currentPalette.surface0};
            --ctp-base: ${currentPalette.base};
            --ctp-mantle: ${currentPalette.mantle};
            --ctp-crust: ${currentPalette.crust};

            --ctp-accent: ${accent};
        }
    `;

    // Flattened CSS from the UserStyle (using CSS Custom Properties)
    const inoreaderCSS = `
        body,
        .inno_dialog,
        .reader_pane_view_style_1 .article_subscribed,
        .reader_pane_view_style_4 .article_subscribed,
        .inno_toolbar_switcher_button_active,
        .dashboard_wrapper,
        #sb_tree_part,
        #sb_menu_icon,
        #sb_tp_search_overlay,
        #feed_searcher,
        #wraper.tree_pane_docked #feed_searcher,
        #preferences_main_wrapper,
        .reader_pane_view_style_0 .article_expanded:hover,
        div.article_expanded,
        .article,
        .article_expanded
        .article_footer_placeholder_middle.footerized.article_footer_placeholder_middle_sticky,
        #article_dialog .article_footer_placeholder_top,
        #three_way_contents .article_footer_placeholder_top,
        .article_footer,
        .pricing_plans_row_sticky,
        .searcher_top_bar_wrapper {
            background-color: var(--ctp-base) !important;
        }

        body,
        .article_unreaded .article_tile_title,
        .icon16,
        .icon14,
        .icon19,
        .h6,
        .article_unreaded .article_magazine_content,
        .article_unreaded .article_magazine_title,
        #sb_tp_dock,
        .inno_toolbar_button,
        #sb_rp_heading,
        .article_header_text,
        .article_content,
        .profile_menu_themes_heading,
        .inno_toolbar_switcher_button:hover,
        #sb_rp_heading span.icon16,
        .sub_engagement_number,
        .sub_folder,
        .inline_folders_editor,
        .tf,
        .top_bar_tab,
        .top_bar_tab .icon16,
        #tree_pane .icon16,
        #add_content_simulated_button .plus_img,
        a:link,
        .h4[class*="icon-"],
        h4[class*="icon-"],
        .inno_tabs_wrapper .inno_tabs_header .inno_tabs_tab a:link,
        .inno_tabs_wrapper .inno_tabs_header .inno_tabs_tab a:active,
        .inno_tabs_wrapper .inno_tabs_header .inno_tabs_tab a:visited,
        #tree_pane .plus_img {
            color: var(--ctp-text) !important;
        }
        a.text-color,
        a.nav-item-btn,
        .icon-arrow_collapse {
            color: var(--ctp-text) !important;
        }

        .progress {
            --bs-progress-bar-color: var(--ctp-accent);
            --bs-progress-bar-bg: var(--ctp-accent);
            --bs-bar-bg: var(--ctp-overlay1);
        }

        .text-muted-color {
            color: var(--ctp-subtext0) !important;
        }

        #tree_pane,
        #reader_pane,
        #feeds_nav,
        .tree_ad,
        .article_full_contents,
        .article_unreaded,
        .search_empty_state_mask,
        .library_wrapper_outer,
        .teams_presentation_wrapper,
        .article_subscribed,
        .tr1,
        .search_width_constraint,
        .bg-white {
            background-color: var(--ctp-base) !important;
            color: var(--ctp-text) !important;
        }

        .st_usage_slider_outer {
            background-color: var(--ctp-text);
        }

        .st_usage_slider_inner,
        #text-menu .dropdown-menu,
        .article_unreaded .article_unread_dot .article_unread_dot_internal {
            background-color: var(--ctp-accent);
        }

        .bg-primary {
            background-color: var(--ctp-accent) !important;
        }

        #tree_pane .parent_div_inner_selected .plus_img {
            color: var(--ctp-accent);
        }

        .active-url .item-name,
        .active-url span[class^="icon-"].h4,
        .active-url i[class^="icon-"].h4 {
            color: var(--ctp-accent) !important;
        }

        .icon-logo_circle {
            color: var(--ctp-crust) !important;
        }

        #tabs_pane .nav-item a i,
        #tabs_pane .nav-item a span,
        #tabs_pane #bottom_tabs .nav-item a i {
            color: var(--ctp-crust);
        }

        #tabs_pane .tabs-counter,
        #tabs_pane #bottom_tabs .nav-item a i.icon-full {
            color: var(--ctp-text) !important;
            background-color: var(--ctp-base) !important;
        }

        #hint-pref {
            fill: var(--ctp-accent);
        }

        .article_footer_buttons.icon-article_topbar_read_later_full,
        #reader_pane .ar .article_btns a .h4.icon-saved,
        #reader_pane .ar .article_btns a .h4.star_full,
        span.icon-yellow,
        i.icon-yellow {
            color: var(--ctp-yellow);
        }

        .bg-alt {
            background: var(--ctp-yellow) !important;
        }

        .btn.btn-alt {
            background-color: var(--ctp-yellow);
            border-color: var(--ctp-yellow);
        }

        .bg-success-color.darker {
            background-color: var(--ctp-green) !important;
        }

        .alert_state {
            background-color: var(--ctp-red);
        }

        .icon-mark-as-read-single-unread {
            color: var(--ctp-blue) !important;
        }

        .tabs-counter {
            background-color: var(--ctp-accent) !important;
            outline-color: var(--ctp-accent) !important;
            color: var(--ctp-mantle);
        }

        .active-tab-feeds:not(.active-overlay) #tabs_pane [data-tab="feeds"] i,
        .active-tab-dashboard:not(.active-overlay)
        #tabs_pane
        [data-tab="dashboard"]
        i,
        .active-tab-saved:not(.active-overlay) #tabs_pane [data-tab="saved"] i,
        .active-tab-automation:not(.active-overlay)
        #tabs_pane
        [data-tab="automation"]
        i,
        .active-tab-search:not(.active-overlay) #tabs_pane [data-tab="search"] i,
        .active-tab-add_feed:not(.active-overlay)
        #tabs_pane
        [data-tab="add_feed"]
        i,
        .active-tab-notifications:not(.active-overlay)
        #tabs_pane
        [data-tab="notifications"]
        i,
        .active-tab-preferences:not(.active-overlay)
        #tabs_pane
        [data-tab="preferences"]
        i {
            background-color: var(--ctp-base);
            color: var(--ctp-text) !important;
        }

        .preferences_main_button,
        .preferences_billing_feature_main {
            background-color: var(--ctp-mantle);
            border-color: var(--ctp-surface0);
        }

        .dashboard_gadgets,
        .dashboard_gadgets .content,
        .library_section_main_article,
        .library_secondary_article,
        .library_section_list_articles {
            background-color: var(--ctp-mantle);
        }

        #header_pane,
        .search_context_dropdown.open {
            background-color: var(--ctp-base) !important;
            color: var(--ctp-text);
        }

        .dropdown-menu,
        .ino-autocomplete {
            background-color: var(--ctp-mantle);
        }

        .dropdown-menu .dropdown-header {
            color: var(--ctp-text);
        }

        .dropdown-menu .dropdown-item,
        a:visited {
            color: var(--ctp-subtext0);
        }

        .dropdown-menu .dropdown-item:hover,
        .dropdown-menu .dropdown-item:focus,
        #tree_pane .parent_div_inner:hover,
        #tree_pane .parent_div_inner:active,
        #tree_pane .parent_div_inner:focus,
        .search_context_dropdown.open .search_context_filter:hover,
        .nav.nav-hover .nav-item:hover,
        .lang_bubble:hover,
        #tabs_pane .toggle_sidebar_btn i {
            background-color: var(--ctp-surface0);
        }

        .dropdown-menu .dropdown-item:active {
            background-color: var(--ctp-surface0);
            color: var(--ctp-accent);
        }

        .dropdown-menu .dropdown-item.active,
        #tree_pane .parent_div_inner_selected,
        #tree_pane .parent_div_inner_selected:hover,
        #tree_pane .parent_div_inner_selected a,
        .search_context_dropdown.open .search_context_filter.active,
        .nav.nav-hover .active-url,
        .lang_bubble.lang_bubble_current {
            background-color: var(--ctp-surface1);
            color: var(--ctp-accent);
        }

        .btn.btn-outline-text {
            color: var(--ctp-text);
            border-color: var(--ctp-subtext0);
        }

        .btn.btn-primary,
        .btn.btn-primary:hover {
            color: var(--ctp-text);
            background-color: var(--ctp-accent);
            border-color: var(--ctp-accent);
        }

        .dropdown-menu-active,
        .btn.btn-outline-text:hover {
            color: var(--ctp-text);
            border-color: var(--ctp-subtext0);
            background-color: var(--ctp-surface0);
        }

        input[type="text"]:focus,
        input[type="checkbox"]:focus + label,
        input[type="checkbox"]:active + label,
        input[type="button"]:focus,
        input[type="button"]:active,
        textarea:focus,
        select:focus,
        button:focus,
        input[type="password"]:focus,
        input[type="email"]:focus {
            box-shadow: 0 0 3px var(--ctp-accent) !important;
            border-color: var(--ctp-accent) !important;
        }

        input[type="text"],
        input[type="number"],
        input[type="password"],
        select,
        textarea {
            background-color: var(--ctp-base) !important;
            color: var(--ctp-text) !important;
            border-color: var(--ctp-subtext0);
        }

        .graylink_darker,
        .article_short_contents {
            color: var(--ctp-subtext0);
        }

        div.article_magazine.article_current,
        div.article_magazine.article_bulk_selected {
            box-shadow: 0 0 0 1px var(--ctp-subtext0);
        }
        .view_style_3 #reader_pane .ar.article_current .article_tile_picture {
            box-shadow: inset 3px 3px 0 -2px var(--ctp-accent), inset -3px 2px 0 -2px var(--ctp-accent);
        }
        .view_style_3 #reader_pane .ar.article_current {
            box-shadow: inset 0 0 0 1px var(--ctp-accent);
        }

        .view_style_4 #reader_pane .ar.article_current {
            box-shadow: 0 0 0 1px var(--ctp-accent);
        }
        .view_style_2 #reader_pane .ar.article_current_3way,
        .view_style_2 #reader_pane .ar.article_expanded {
            box-shadow: none;
            border-color: var(--ctp-text);
        }

        .article_magazine_content {
            color: var(--ctp-overlay0);
        }

        .article_magazine_title {
            color: var(--ctp-overlay1);
        }

        .inno_dialog_modal_overlay {
            background-color: var(--ctp-overlay2);
        }

        .subscriptions_legend,
        .preferences_main_button_icon span,
        a.bluelink:link,
        .bluelink,
        .inno_tabs_tab_current,
        .inno_tabs_tab_current:hover,
        .inno_toolbar_button_menu_item_inactive .inno_toolbar_button_menu_icon,
        .inno_toolbar_button_menu_icon,
        #preferences_subscriptions_table span.icon_active,
        .text-primary,
        .inno_tabs_wrapper
        .inno_tabs_header
        .inno_tabs_tab.inno_tabs_tab_current
        a:link,
        .inno_tabs_wrapper
        .inno_tabs_header
        .inno_tabs_tab.inno_tabs_tab_current
        a:active,
        .inno_tabs_wrapper
        .inno_tabs_header
        .inno_tabs_tab.inno_tabs_tab_current
        a:visited {
            color: var(--ctp-accent) !important;
        }

        #new_articles_overlay {
            color: var(--ctp-accent);
            background-color: var(--ctp-base);
        }

        input.apple-switch:checked {
            background-color: var(--ctp-accent);
            border-color: var(--ctp-accent);
        }

        .add_content_simulated_button.expanded {
            background-color: var(--ctp-surface0);
            box-shadow: inset 0 -1px 0 0 var(--ctp-accent);
        }

        .inno_toolbar_button_menu,
        #reader_pane .info_state,
        .inno_dialog_modal .info_state,
        .preferences_interface_helper,
        .sub_folder {
            background-color: var(--ctp-mantle);
            color: var(--ctp-text);
        }

        #profile_menu_themes_wrapper {
            display: none;
        }

        #sb_reading_part,
        #wraper.tree_pane_docked #sb_tree_part {
            box-shadow: none;
        }

        .whitebutton {
            background-color: var(--ctp-base);
            color: var(--ctp-text);
            border-color: var(--ctp-surface0);
        }

        .bluebutton,
        .inno_dialog .inno_dialog_buttonbar_button:nth-child(1) {
            background-color: var(--ctp-accent);
            color: var(--ctp-crust);
            border-style: none;
        }

        .inno_dialog .inno_dialog_buttonbar_button:nth-child(1):hover:enabled {
            background-color: var(--ctp-accent);
            border-color: var(--ctp-accent);
        }

        .inno_dialog_buttonbar_button {
            background-color: var(--ctp-base);
            color: var(--ctp-text);
        }

        .icon_green {
            color: var(--ctp-green);
        }

        .reader_pane_view_style_0 .article_unreaded:hover,
        .reader_pane_view_style_2 .article_unreaded:hover,
        .reader_pane_view_style_2 .article:hover,
        .sd .share_wrapper .icon16:hover,
        .pricing_feature_row:nth-child(odd),
        .pricing_table_row .pricing_table_leftmost_cell,
        .article_footer .share_wrapper:hover {
            background-color: var(--ctp-surface0);
        }

        .add_content_simulated_button_menu,
        .profile_menu_plan_badge {
            background-color: var(--ctp-surface0);
            border-color: var(--ctp-surface0);
            color: var(--ctp-text);
        }

        .catalog_follow_featured_collection,
        .catalog_sub_section_title,
        .search_feed_wrapper {
            border-color: var(--ctp-surface0);
        }

        .border-bottom,
        .header-shadow {
            border-color: var(--ctp-text);
        }

        .pricing_teams_hero {
            background-color: var(--ctp-surface0);
            background-image: none;
        }

        .parent_div_inner:hover,
        .inno_toolbar_button_menu_item:hover,
        .preferences_profile_wrapper,
        code,
        pre {
            background-color: var(--ctp-surface0);
            color: var(--ctp-text);
        }

        .preferences_profile_plan_wrapper,
        .st_subheader,
        .catalog_sub_section_tab.catalog_sub_section_tab_current,
        .catalog_sub_section_tab:hover {
            background: var(--ctp-surface1);
            color: var(--ctp-text);
        }

        .article_footer .article_footer_main_buttons .article_footer_buttons:hover,
        .article_footer
        .article_footer_main_buttons
        .article_footer_buttons_current,
        .article_footer .icon-article_topbar_more_menu:hover,
        .st_header,
        input[type="radio"].filter_radio:checked + label,
        input[type="checkbox"].filter_radio:checked + label {
            background-color: var(--ctp-surface2);
            color: var(--ctp-text);
        }

        input[type="checkbox"].form-check-input:checked,
        input[type="radio"].form-check-input:checked {
            background-color: var(--ctp-accent);
            border-color: var(--ctp-accent);
        }

        .normal_dim {
            color: var(--ctp-subtext1);
        }

        .parent_div_inner_selected,
        #preferences_header,
        #tabs_pane,
        .add_content_simulated_button_menu_line_item:hover {
            background-color: var(--ctp-accent);
            color: var(--ctp-mantle);
        }

        #preferences_header .icon16,
        #preferences_dialog_close_button span.icon16 {
            color: var(--ctp-mantle);
        }

        .article_tile.article_unreaded.article_expanded {
            background-color: var(--ctp-base);
            box-shadow: 0 1px 8px var(--ctp-mantle), 0 1px 3px var(--ctp-mantle);
        }

        div.article_current_3way {
            box-shadow: inset 0 0 0 1 var(--ctp-accent), inset 5px 0 0 0 var(--ctp-accent);
        }

        div.article_tile.article_expanded {
            border-color: var(--ctp-mantle);
        }

        .article_footer_placeholder_top .article_footer,
        .inno_tabs_header,
        .gadget_overview_feed {
            border-color: var(--ctp-surface2);
        }

        .inno_toolbar_switcher:hover .inno_toolbar_switcher_button_active,
        .inno_toolbar_switcher:hover .inno_toolbar_switcher_button_active:hover {
            color: var(--ctp-accent);
            background-color: var(--ctp-base);
            border-color: var(--ctp-accent);
        }

        .inno_tabs_tab:hover {
            color: var(--ctp-accent);
            border-color: var(--ctp-accent);
        }

        #audio_player_nav.is-overlay .tab-content,
        #audio_player_nav .media-player.maximized .container,
        #notifications_nav.is-overlay .tab-content,
        #support_nav.is-overlay .tab-content,
        #profile_nav.is-overlay .tab-content {
            background-color: var(--ctp-base);
        }
    `;

    // Inject the CSS using GM_addStyle (standard Tampermonkey grant)
    GM_addStyle(cssVariables + inoreaderCSS);

})();
