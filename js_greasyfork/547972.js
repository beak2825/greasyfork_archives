// ==UserScript==
// @name         AMK-Team.ru
// @version      1.2
// @description  Улучшение интерфейса!
// @author       Chypakabra
// @match        https://www.amk-team.ru/forum/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amk-team.ru
// @license      MIT
// @namespace https://greasyfork.org/users/1371434
// @downloadURL https://update.greasyfork.org/scripts/547972/AMK-Teamru.user.js
// @updateURL https://update.greasyfork.org/scripts/547972/AMK-Teamru.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const Bradius = '20px';
    const Bradius2 = '17px';
    const Iradius = '10px'
    var Shadow = 'rgb(0 0 0 / 75%) 5px 5px 5px 1px';
    var ShadowL = 'rgb(75 75 75 / 75%) 0 0 0 1px';
    var ShadowP = 'rgb(75 75 75 / 75%) 0 0 0 2px';
    var str = ''
    let styles = ''
    const amkteam = getComputedStyle(document.documentElement);
    const version = amkteam.getPropertyValue('--amkteam-version').trim();
    const rootStyles = getComputedStyle(document.documentElement);
    const mainColor = rootStyles.getPropertyValue('--focus-bg--color').trim();
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    CustomCSS();
    CustomTheme();
    Online();

    function CustomTheme(){
        if (version == '"4.7.12"') {
            ////////////////////////////////////////// Общие элементы  //////////////////////////////////////////
            const themeColors = {
                '--nav--border-radius': Bradius,
                '--nav-hover--background': '#ffffff30',
                '--user-nav--hover-background': '#ffffff30',
                '--user-nav--radius': Bradius,
                '--box--border-width': '0px',
                '--box--radius': '20px',
                '--breadcrumb--border-radius': Bradius,
                '--focus-social--border-radius': Bradius,
                '--forum-icon--border-radius': Bradius,
                '--commentControlButton--border-radius': Bradius,
                '--user-nav--avatar-padding': '0px',
                '--author-pane-avatar': '160px',
                '--author-pane--spacer': '40px',
                '--avatar--border-radius': '100%',
                '--radius-1': Bradius
            };
            Object.entries(themeColors).forEach(([key, value]) => {document.documentElement.style.setProperty(key, value);});

            ////////////////////////////////////////// Тёмная тема  //////////////////////////////////////////
            if (mainColor == '#343a46') {
                const themeDColors = {
                    '--theme-widget_title_font': '185,185,185',
                    '--theme-section_title': '43,43,55',
                    '--box--border-color': '#bfbfbf4d',
                    '--theme-featured': '94, 190, 155',
                    '--box--backgroundColor': '#3d4552'
                };
                Object.entries(themeDColors).forEach(([key, value]) => {document.documentElement.style.setProperty(key, value);});
            }
            ////////////////////////////////////////// Светлая тема  //////////////////////////////////////////
            if (mainColor == '#d8dde8') {
                const themeLColors = {
                    '--focus-bg--color': 'rgb(var(--theme-main_nav_tab))',
                    '--theme-light_button_font': '0,50,100',
                    '--search--background': '#f0f0f0',
                    '--theme-area_background_reset': '240,240,255',
                };
                Object.entries(themeLColors).forEach(([key, value]) => {document.documentElement.style.setProperty(key, value);});
            }
        }
    }

    function CustomCSS() { ////////////////////////////////// !important //////////////////////////////////  filter: grayscale(100%);
        styles += 'img {border-radius: '+Iradius+';} ';
        styles += '.cAuthorPane_info [data-role="group"] {border-radius: '+Bradius+'; background: rgb(var(--theme-main_nav_tab),0.5);} ';
        styles += '.ipsWidget_title {background: rgb(var(--theme-section_title)); color: rgb(var(--theme-section_title_font));} ';
        styles += '#elSearch_main {background-color: rgb(var(--theme-area_background_reset)); border-radius: '+Bradius+' !important;} ';
        styles += '#elProfileStats {border-radius: 0 0 '+Bradius+' '+Bradius+';} ';
        styles += '#elProfileHeader {border-radius: '+Bradius+' '+Bradius+' 0 0; box-shadow: '+Shadow+';} ';
        styles += '.ipsType_sectionTitle {border-radius: '+Bradius+' '+Bradius+' 0 0!important;} ';
        styles += '.ipsBox ipsPadding ipsResponsive_pull ipsMargin_top {border-radius: '+Bradius+'!important;} ';
        styles += '.ipsBox.ipsSpacer_bottom {border-radius:'+Bradius+'!important; box-shadow:'+Shadow+';} ';
        styles += '.ipsBox ipsResponsive_pull {margin-left:0; margin-right:0; border-radius:'+Bradius+'; box-shadow:'+Shadow+' !important;} ';
        styles += '.ipsGrid.ipsGrid_collapsePhone:not([data-ipsgrid-minitemsize]) > [class*="ipsGrid_span"] {border-radius: 20px!important; background-color: rgb(var(--theme-main_nav_tab),0.5);} ';
        styles += '.ipsQuote_citation.ipsQuote_open, .ipsSpoiler_header.ipsSpoiler_open, .ipsQuote_citation {background: rgb(var(--theme-main_nav_tab),0.5); border-radius: '+Bradius2+' '+Bradius+' 0 0 !important;} ';
        styles += '.ipsQuote_citation.ipsQuote_closed, .ipsSpoiler_header.ipsSpoiler_closed {background: rgb(var(--theme-main_nav_tab),0.5); border-radius: '+Bradius2+' '+Bradius+' '+Bradius+' '+Bradius2+' !important;} ';
        styles += '.ipsMargin_top.ipsClearfix.ipsClear {box-shadow:'+Shadow+';} ';
        styles += '.cForumRow_hidden .cForumTitle {border-radius:'+Bradius+'!important;} ';
        styles += '.ipsTabs_panels.ipsTabs_contained {border-radius: 0 0 '+Bradius+' '+Bradius+';} ';
        styles += 'header[data-role="profileHeader"] .ipsGrid {box-shadow:'+Shadow+';} ';
        styles += '.ipsTabs_panel {background:#00000000} ';
        styles += '.ipsPad, .ipsApp ul.ipsPad, .ipsApp ol.ipsPad {padding: var(--sp-3);border-radius: '+Bradius+';} ';
        styles += '.ipsAreaBackground {background: rgb(var(--theme-main_nav_tab),0.5);} ';
        styles += '[data-focus-blocks~="contrast"] .ipsPager {border-radius: '+Bradius+'; box-shadow: '+Shadow+';} ';
        styles += '[data-focus-blocks~="contrast"] .ipsPageHeader:not(.ipsBox) {border-radius: '+Bradius+';} ';
        styles += '.ipsUserPhoto_tiny {width:44px!important; height:44px!important; box-shadow:'+ShadowP+', rgb(0 0 0 / 75%) 3px 3px 3px 2px;} ';
        styles += '.ipsUserPhoto_medium {width:100px; height:100px;} ';
        styles += '.ipsUserPhoto {box-shadow:'+ShadowP+', rgb(0 0 0 / 75%) 6px 6px 6px 3px;} ';
        styles += '#elUserNav a.ipsUserPhoto {width:44px!important; height:44px!important; padding:0!important; border-radius:100%!important; margin:0!important; box-shadow:'+ShadowP+', rgb(0 0 0 / 75%) 3px 3px 3px 2px;} ';
        styles += '.ipsDataItem_lastPoster.ipsDataItem_withPhoto .ipsUserPhoto {width:44px!important; height:44px!important; box-shadow:'+ShadowP+', rgb(0 0 0 / 75%) 3px 3px 3px 2px;} ';
        styles += '.cStream_members {box-shadow:#;} ';
        styles += '.cStream_members .ipsUserPhoto {box-shadow:'+ShadowP+', '+Shadow+';} ';
        styles += '.cAuthorPane {border-radius: '+Bradius+' 0px 0px '+Bradius+';} ';
        styles += '.svg-container {opacity:0!important;} ';
        styles += '.ipsTabs {background: rgb(var(--theme-area_background_dark)); border-radius: '+Bradius+' '+Bradius+' 0 0;} ';
        styles += '.ipsToolList_horizontal > .ipsToolList_primaryAction .ipsButton:not( .ipsButton_link ) {padding:0 '+Bradius+'; background: rgb(var(--theme-main_nav)); color: rgb(var(--theme-section_title_font));} ';
        styles += 'html[dir="ltr"] .ipsPhotoPanel.ipsPhotoPanel_tiny > div {margin-left: 55px;} ';
        styles += '.ipsPhotoPanel.ipsPhotoPanel_tiny > div {margin-left: 60px;} ';
        styles += '.ipsMargin_bottom {box-shadow: rgb(0 0 0 / 0) 0 0 0 0; !important;} ';
        styles += '.ipsButton {border-radius:'+Bradius+'; box-shadow:'+ShadowL+';} ';
        styles += '.cProfileSidebarBlock.ipsLeaderboard_trophy_1 {box-shadow:'+Shadow+';} ';
        styles += '.cPastLeaders_cell {box-shadow:'+ShadowL+';} ';
        styles += '.ipsMenu {box-shadow:'+Shadow+';} ';
        styles += '.ipsButton_split {box-shadow:'+ShadowL+';} ';
        styles += '.ipsWidget {box-shadow:'+Shadow+';} ';
        styles += '.cProfileRepScore {border-radius:'+Bradius+'; box-shadow:'+Shadow+';} ';
        styles += '[data-focus-post~="no-margin"] .ipsUnreadBar {margin: var(--sp-2)!important; padding: var(--sp-2); border-radius:'+Bradius+'; box-shadow:'+Shadow+';} ';
        styles += '.focus-editor {border-radius:'+Bradius+'; box-shadow:'+Shadow+';} ';
        styles += '.focus-nav-bar {border-radius:'+Bradius+'!important; box-shadow:'+Shadow+'!important;} ';
        styles += '.focus-mega-footer {border-radius:'+Bradius+'; box-shadow:'+Shadow+';} ';
        styles += '.focus-editor-overlay {background:#00000000;} ';
        styles += '.focus-editor__title {background: rgb(var(--theme-section_title)); color: rgb(var(--theme-section_title_font));} ';
        styles += '.focus-search {border-radius:'+Bradius+'; box-shadow: '+ShadowL+', '+Shadow+';} ';
        styles += '.ipsAreaBackground_reset {background:#00000000;} ';
        styles += '.ipsPageHeader {border-radius:'+Bradius+'; box-shadow:'+Shadow+';} ';
        styles += '.ipsApp .ipsBreadcrumb {box-shadow: '+Shadow+'; border-radius: '+Bradius+' !important;} ';
        styles += '.ipsBreadcrumb {border-radius: '+Bradius+' !important;} ';
        styles += '.ipsApp .ipsButton_primary {background: rgb(var(--theme-section_title));} ';
        styles += '[data-focus-post~="no-margin"] #elPostFeed .cPost {border-radius:'+Bradius+'; margin: 0px 0px 0px 0px;} ';
        styles += '#elPostFeed {border-radius:'+Bradius+'; margin: 0px 0px 0px 0px !important;} ';
        styles += '.ipsRecommendedComments .ipsType_sectionHead {box-shadow:'+ShadowL+';} ';
        styles += '.ipsComment.ipsComment_popular {box-shadow: 0px 0px 0px 1px rgba(var(--theme-featured),0.8),0px 0px 0px 5px rgba(var(--theme-featured),0.2), rgb(0 30 0 / 75%) 8px 8px 8px 1px !important;} ';
        styles += '.ipsApp .ipsComment_recommended {box-shadow: 0px 0px 0px 1px rgba(var(--theme-brand_primary),0.9),0px 0px 0px 5px rgba(var(--theme-brand_primary),0.3), rgb(0 0 30 / 75%) 8px 8px 8px 1px !important;} ';
        styles += '.ipsComment_recommendedFlag {background: rgba(var(--theme-brand_primary),0.2); color: rgb(var(--theme-brand_primary));}; ';
        styles += '.ipsDataItem .ipsDataItem_main:only-child {box-shadow: rgb(0 0 0 / 0) 0 0 0 0;} ';
        styles += '.ipsResponsive_pull {margin-left:0; margin-right:0; box-shadow:'+Shadow+'!important; border-radius:'+Bradius+';} ';
        styles += '.ipsApp .ipsButton_light {background: rgba(var(--theme-main_nav_tab),0.5);} ';
        styles += '.ipsStreamItem.ipsStreamItem_contentBlock {padding: var(--sp-5) 0;} ';


        if (mainColor == '#343a46') {
            ////////////////////////////////////////// Тёмная тема  //////////////////////////////////////////
            styles += '.scroll-top-wrapper {background-color: #00000000; color: #ffffff;} ';
        }

        if (mainColor == '#d8dde8') {
            ////////////////////////////////////////// Светлая тема  //////////////////////////////////////////
            styles += '.scroll-top-wrapper {background-color: #00000000; color: #000000;} ';
        }

        if (mediaQuery.matches) {
            ///////////////////////////////// ('Ширина экрана Меньше 767px') /////////////////////////////////
            styles += '.ipsColumn_fluid {border-radius: 0 0 '+Bradius+' '+Bradius+'!important} ';
            styles += '.ipsResponsive_showPhone {border-radius: '+Bradius+' '+Bradius+' 0 0 !important} ';
            styles += '.ipsResponsive_showPhone.ipsResponsive_block {border-radius: 0 !important} ';
            styles += '.cTopicPostArea {border-radius: '+Bradius+'} ';
            styles += '.cPost .cAuthorPane + .ipsColumn {border-radius: 0 0 '+Bradius+' '+Bradius+'!important;} ';
            styles += '.ipsMargin_top {border-radius: '+Bradius+'!important} ';

        } else {
            /////////////////////////////// ('Ширина экрана 767px или больше') ///////////////////////////////
            styles += '.ipsColumn_fluid {border-radius: 0 '+Bradius+' '+Bradius+' 0 !important;} ';
            styles += '.cPost > .ipsColumn_fluid {border-radius:0 '+Bradius+' '+Bradius+' 0!important;} ';

        }

        let styleSheet = document.createElement('style');
        styleSheet.type = 'text/css';
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
    }

    function Online() {
        if (mediaQuery.matches) {
            ////////////////////////////////////////////////////////////////////////// ('Ширина экрана Меньше 767px') //////////////////////////////////////////////////////////////////////////////////////
            let elems = document.getElementsByClassName('cPost ipsBox ipsResponsive_pull  ipsComment  ipsComment_parent ipsClearfix ipsClear ipsColumns ipsColumns_noSpacing ipsColumns_collapsePhone');
            for( let i = 0; i < elems.length; i++) {
                let fu = elems[i].getElementsByClassName('fa fa-circle ipsOnlineStatus_online');
                let UserPhoto = elems[i].getElementsByClassName('ipsUserPhoto ipsUserPhoto_large');
                for( let i = 0; i < fu.length; i++) {
                    UserPhoto[i].setAttribute('style', 'width: 50px; height: 50px; box-shadow: rgb(0 0 0 / 100%) 0 0 0 1px, rgb(36 200 104 / 100%) 0 0 0 3px, rgb(0 50 0 / 75%) 5px 5px 5px 5px;');
                }
            }
        } else {
            ////////////////////////////////////////////////////////////////////////// ('Ширина экрана 767px или больше') //////////////////////////////////////////////////////////////////////////////////
            let elems = document.getElementsByClassName('ipsComment_author cAuthorPane ipsColumn ipsColumn_medium ipsResponsive_hidePhone');
            for( let i = 0; i < elems.length; i++) {
                let fu = elems[i].getElementsByClassName('fa fa-circle ipsOnlineStatus_online');
                let UserPhoto = elems[i].getElementsByClassName('ipsUserPhoto ipsUserPhoto_large');
                for( let i = 0; i < fu.length; i++) {
                    UserPhoto[i].setAttribute('style', 'box-shadow: rgb(0 0 0 / 100%) 0 0 0 1px, rgb(36 200 104 / 100%) 0 0 0 3px, rgb(0 50 0 / 75%) 5px 5px 5px 5px;');
                }
            }
        }
    }
})();