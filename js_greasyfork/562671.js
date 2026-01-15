// ==UserScript==
// @name         WaniKani Dark Mode - by SGAIPG
// @description  A simple Dark Mode interface for WaniKani
// @match 	 http://wanikani.com/*
// @match 	 http://www.wanikani.com/*
// @match 	 https://wanikani.com/*
// @match 	 https://www.wanikani.com/*
// @run-at       document-start
// @version 0.0.1.20260114184420
// @namespace https://greasyfork.org/users/1559642
// @downloadURL https://update.greasyfork.org/scripts/562671/WaniKani%20Dark%20Mode%20-%20by%20SGAIPG.user.js
// @updateURL https://update.greasyfork.org/scripts/562671/WaniKani%20Dark%20Mode%20-%20by%20SGAIPG.meta.js
// ==/UserScript==


(function() {
  const css = `
html,
body {
  background-color: #222222 !important;
}
/* ==UserStyle==
@name			WaniKani Dark Mode - by SGAIPG
@description		A simple Dark Mode interface for WaniKani
 @match 	 	http://wanikani.com/*
@match 	 		http://www.wanikani.com/*
@match 	 		https://wanikani.com/*
@match 	 		https://www.wanikani.com/*
@weight 		999
==/UserStyle== */	


	
	

/* -------------- MAIN PAGE -------------- */
/* Main background */
html, body {
  background: #222222 !important;
  background-color: #222222 !important;
}

.site-content-container {
  background: #333333 !important;
}


/* Footer color manipulation */
.footer--illustrated {
	position: relative;
	overflow: hidden; /* ensures pseudo-element doesn’t overflow */
}

.footer--illustrated::before {
	content: "";
	position: absolute;
	top: 0; left: 0; right: 0; bottom: 0;
	background: url("/assets/footer-bg-4d7ea4d5.gif") no-repeat center center/cover;
	filter: invert(0.5) brightness(0.5) contrast(1.1); /* tweak brightness if needed */
	z-index: 0;
}

.footer--illustrated > * {
	position: relative;
	z-index: 1; /* ensures content appears above the background */
}


.site-footer-container {
	background-color: #333333;
}


p a {
	color: #8aabff;
}

.sitemap {
	background-color: #292829;
	border-color: #292829;
}

.sitemap--divider {
	position: relative;
	border: 0px solid #292829;
}

.navigation--open .sitemap--divider::before {
	content: "";
	display: block;
	border-top: 3px solid grey;
	margin: 16px 16px 18px;
}

.sitemap__section--open {
	background-color: #333333;
}

.navigation--open .navigation__toggle {
	background-color: #8e4ebf;
}

.navigation--open:hover .navigation__toggle:hover {
	background-color: #aa00ff;
	transition: border-color 0.3s ease;
}

.navigation__toggle-icon, .navigation__toggle-icon:before, .navigation__toggle-icon:after {
	border: 1px solid lightgrey;
}





/* Plugins */
.generate-image-button {
	background-color: #e7e9eb;
	font-weight: 500;
	color: black;
	padding: 5px;
	padding-left: 10px;
	padding-right: 10px;
	border-radius: 5px;
	border: 2px solid #e7e9eb;
}

.generate-image-button:hover {
	background-color: #606060;
	font-weight: 500;
	color: white;
	padding: 5px;
	padding-left: 10px;
	padding-right: 10px;
	border-radius: 5px;
	border: 2px solid white;
}

.subject-section img {
	border-radius: 10px;
}


/* Logo */
.logo {
  filter: saturate(90%) brightness(100%) contrast(75%) hue-rotate(-35deg);
  /*hue-rotate(250deg);*/
}

/* Header */
.global-header {
	background-color: #292829;
	border-color: #292829;
}

.sitemap {
	color: white;
}

button.sitemap__section-header,
button.search-button,
.sitemap__section-header{
	text-shadow: 0 0px 0 #fff;
	color: lightgrey;
	border-color: #292829;
	transition: border-color 0.3s ease;
}

button.search-button:hover,
button.search-button:focus,
button.sitemap__section-header--levels:hover,
button.sitemap__section-header--levels:focus,
button.sitemap__section-header--help:hover,
button.sitemap__section-header--help:focus{
	border-color: grey;
	transition: border-color 0.3s ease;
}

.sitemap__pages--levels .sitemap__page a {
	background-color: #404040;
}

.sitemap__group-header {
	color: white;
}

#sitemap__levels {
	box-shadow: 20deg;
}

.lesson-and-review-count div {
	color: white;
	border-color: lightgrey;
	border-left: 2px solid;
}

.lesson-and-review-count__item, .lesson-and-review-count__item:hover, .lesson-and-review-count__item:active, .lesson-and-review-count__item:visited {
	border-color: red !important;
	color: red !important;
}

/* Need help box */
.wk-alert{
	/*background-color: #d2e8ff;*/
	background-color: #9a66d8;
	color: white;
	border-color: white;
}

.wk-text,
.wk-alert--cta,
.wk-alert__content a{
	color: white !important;
}

.wk-alert__content--toggleable {
	border-top: 1px solid rgba(300,300,300,.5)
}


/* THEME CONFIGS */
.theme--default, .theme--pastel, .theme--candy, .theme--vintage {
	background-color: #6a6c6d;
	border: 0px;
}


.theme--neon .todays-lessons-widget__subtitle {
	color: white;
}

/* Review forecast box */
.review-forecast-widget__title,
.todays-lessons-widget__title-text, 
.reviews-widget__title-text,
.review-forecast-widget__total,
.review-forecast-widget__icon {
	color: white;
}

.review-forecast-widget__image, .review-forecast-widget__header-image-wrapper {
	flex: 1 1 140px;
	min-width: 0;
	padding-top: 5px;
	padding-bottom: 5px;
}

.review-forecast-widget__day:hover[href]:hover {
	background-color: #505050;
	border-color: #505050;
}

.review-forecast-widget__row:hover[href]:hover {
	background-color: #555555;
}

.review-forecast-widget__header {
	background-color: grey;
	border-bottom: 1px solid grey;
}

.review-forecast-widget{
	border: 3px solid #6a6c6d;
}

.review-forecast-widget__header-count {
	color: white;
}

.review-forecast-widget__header-title {
	color: lightgrey;
}

.review-forecast-widget__increase--positive {
	color: #cae45f;
}

.review-forecast-widget__day-total-value {
	padding-right: 20px;
}

.review-forecast-widget__priority-count {
	color: #eaeaea;
}

/* Study streak box */
.study-streak-widget__title,
.study-streak-widget__count,
.study-streak-widget__best-count-value,
.study-streak-widget__best-title,
.study-streak-widgetbest-count-unit,
.study-streak-widget__day-title,
.study-streak-widget__offerings-title {
	color: white;
}

.study-streak-widget__day:last-child {
	background-color: #858585;
}

/* Mistakes box */
.extra-study-subjects-widget__title-text, .extra-study-flash-card-widget__title-text, .extra-study-multi-button-widget__title {
	color: white;
}

.extra-study-multi-button-widget__button {
	color: #363636;
}

.extra-study-subjects-widget__title-icon, .extra-study-flash-card-widget__title-icon {
	color: #cae45f;
}

.extra-study-subjects-widget--split .extra-study-subjects-widget__subjects-wrapper {
	background-color: grey;
	border-top: 1px solid grey;
}

.extra-study-subjects-widget--split .extra-study-subjects-widget__empty {
	background-color: grey;
	border-top: 1px solid grey;
}

.extra-study-flash-card-widget__subjects-navigation-action *, .extra-study-flash-card-widget__subjects-navigation-label {
	color: white;
}

/* Active items spread box */
.item-spread-graph-widget__title, .item-spread-table-row__icon, .item-spread-table-row__header {
	color: white;
}

.review-forecast-widget__day-header {
	background-color: #292829;
	color: white;
}

.review-forecast-widget__day-header {
	color: white;
}

.review-forecast-widget__detail {
	background-color: #303030;
	border-color: #262626;
}

.review-forecast-widget__day-increase-value {
	color: #35a753;
}

.review-forecast-widget__day-header-button * {
	background-color: #505050;
	color: white;
	border-radius: 6px;
}

.review-forecast-widget__day-header-button:hover * {
	filter: brightness(20%)
	border-radius: 6px;
}

.review-forecast-widget__day-header-button:hover span * {
	background-color: transparent;
	border-radius: 6px;
}


/* Heat map */
.heat-map-widget__header *, .heat-map-widget__selected-work-date, .heat-map-widget__selected-work-value {
	color: white;
}

.heat-map-widget__selected-work-label {
	color: lightgrey;
}

.heat-map-widget__row {
	color: lightgrey;
}

.heat-map-widget__cell--level-0 {
	background-color: #888888;
}



/* Item spread */
.item-spread-graph-widget__details {
	background-color: #292829;
	border: 3px solid grey;
}

.item-spread-legend__label {
	color: white;
}

.item-spread-graph-widget__details-button * {
	background-color: #505050;
	color: white;
	border-radius: 6px;
}

.item-spread-graph-widget__details-button:hover * {
	filter: brightness(20%)
	border-radius: 6px;
}

.item-spread-graph-widget__details-button:hover span * {
	background-color: transparent;
	border-radius: 6px;
}

.item-spread-table-row {
	background-color: #555555;
	border-color: #545454;
	color: white;
}

.item-spread-table-row__icon {
	color: white;
}

.item-spread-table-row__total {
	color: grey;
}

.item-spread-graph-widget__graph-y-axis,
.item-spread-graph-widget__graph-x-axis {
	color: lightgrey;
}

.item-spread-graph-widget__graph-bar-total {
	background-color: #404040;
	padding: 5px;
	width: 35px;
	border-radius: 50px;
	color: white;
}

/* Text */
.wk-text{
	color: white;
}


.todays-lessons-widget__subtitle, .reviews-widget__subtitle {
	color: lightgrey;
}


/* Reviews completed box */
.reviews-completed-widget__current-period,
.reviews-completed-widget__previous-period-count {
	color: white;
}

.reviews-completed-widget__current-period-timeframe {
	color: lightgrey;
}

.reviews-completed-widget__previous-period-timeframe,
.reviews-completed-widget__title {
	color: white;
}


/* Correct percent box*/
.correct-percentage-widget__current-period-percentage,
.correct-percentage-widget__previous-period-percentage{
	color: white;
}

.correct-percentage-widget__title,
.correct-percentage-widget__current-period-timeframe,
.correct-percentage-widget__previous-period-timeframe {
	color: lightgrey;
}

/* Buttons */
.community-banner-widget__button,
.level-progress-widget__navigation-item,
.item-spread-graph-widget__header-button{
	color: #313160;
	background-color: #e5e5e5;
	border-radius: 5px;
}

/* Forecast bar */
.review-forecast-widget__increase-bar{
	border-left: 0px;
	border-radius: 0 5px 5px 0;
}


/* Level progress */
.level-progress-widget {
	color: white;
}

.level-progress-widget__item-type-stat {
	color: white;
	background-color: #808080;
	border: 2px solid #808080;
}

.level-progress-widget__item-type-stat:hover {
	color: white;
	background-color: #606060;
	border: 2px solid #606060;
}

.level-progress-widget__item-type-stat-indicator {
	margin-left: 5px;
	margin-right: 5px;
	border-radius: 10px;
}

.wk-notification--info {
	background-color: #313160;
	border-color: #313160;
	border-radius: 5px;
}

.wk-notification--info .wk-notification__icon {
	color: lightgrey;
}

.wk-notification--success {
	background-color: #35954c;
}

.wk-notification--success .wk-notification__icon {
	color: #e7e9eb;
}

.level-progress-widget__subject-list {
	border: 3px solid #888888;
}

.level-progress-widget__subject-list-header{
	background-color: #292829;
}

.level-progress-widget__subject-list-items {
	background-color: #303030;
	border-color: #262626;
}

.subject-srs-progress__stage-text {
	color: lightgrey;
}

.level-progress-widget__subject-list-button * {
	background-color: #505050;
	color: white;
	border-radius: 6px;
}

.level-progress-widget__subject-list-button:hover * {
	filter: brightness(20%)
	border-radius: 6px;
}

.level-progress-widget__subject-list-button:hover span * {
	background-color: transparent;
	border-radius: 6px;
}


/* Search bar */ 
.search__query,
.search__query::placeholder {
	background-color: #f4f4f4;
	border-color: #f4f4f4;
	color: grey;
}

/* Community banner */
.community-banner-widget {
	color: white;
}

.community-banner-widget__button {
	background-color: #c901e1;
}

.community-banner-widget__button .wk-button__content, .community-banner-widget__button .wk-button__icon {
   color: white;
}


/* -------------- LESSON PART -------------- */

.lesson-container {
	background-color: #333333;
}

.subject-slide {
	background-color: #6a6c6d !important;
	border-radius: 5px;
	border: 0px;
	box-shadow: 0px 0px 0px #e3e3e3;
}

.subject-slide__navigation[data-subject-slides-target="prevButton"] .subject-slide__navigation-icon {
    color: white;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    transition: 0.3s;
}

.subject-slide__navigation[data-subject-slides-target="nextButton"] .subject-slide__navigation-icon {
    color: white;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    transition: 0.3s;
}

.user-note {
	color: lightgrey;
}

.wk-text--bottom-normal {
	color: lightgrey !important;
}

.user-note__character-count {
	color: lightgrey;
}

.user-note__button * {
	color: white !important;
}

.subject-section__content {
	color: lightgrey;
}

.subject-readings-with-audio {
	text-shadow: 0 0px 0 #fff;
}

.subject-collocations, .subject-collocations__title {
	text-shadow: 0 0px 0 #fff;
}

.subject-collocations__title {
	font-weight: bold;
	color: white;
}

.context-sentences p {
	color: lightgrey !important;
}

.subject-slide__navigation:hover div {
	background-color: #444444 !important;
}


/* -------------- QUIZ PART -------------- */

.quiz {
	background-color: #333333;
}

.quiz-progress {
	background-color: #292829;;
}

/* Buttons */
.additional-content__item {
	background-color: #6a6c6d;
	color: white;
	border: 0px;
	border-radius: 5px;
	box-shadow: 0px 0px 0px #6a6c6d;
}

.additional-content__item--disabled {
	color: grey;
}


/* Last items */
.last-item {
	background-color: #d3d3d3 !important;
}

.last-item__label {
	color: #555555;
}

/* Synonyms */
.user-synonyms__form_container {
	background-color: #555555;
	border: 3px solid grey;
}

.user-synonyms__close-button{
	background-color: #777777;
	border: 1px solid lightgrey;
	border-radius: 10px;
	margin-right: 13px;
	margin-top: -3px;
}

.user-synonyms__close-button .wk-button--icon-only .wk-button__content:hover {
	background-color: #999999;
	border-radius: 10px;
}

.user-synonyms__synonym-button {
	background-color: lightgrey;
	border-radius: 5px;
}

.user-synonyms__synonym-button:hover .wk-button__content{
	background-color: lightgrey;
}

.user-synonyms__synonym-button:hover .wk-button__text, .user-synonyms__synonym-button:hover .wk-button__icon{
	background-color: lightgrey;
	color: #f55850;
}

.user-synonyms__close-button svg {
	color: white;
}

.user-synonyms .user-synonyms__item .user-synonym {
	padding: 3px;
	padding-right: 15px;
	padding-left: 15px;
	border-radius: 5px;
	background-color: #555555;
	color: white;
}

.user-synonyms .user-synonyms__item .wk-button {
	border-radius: 5px;
	background-color: lightgrey;
	color: #222222;
}

.user-synonyms .user-synonyms__item .wk-button:hover {
	border-radius: 5px;
	background-color: #777777;
	color: lightgrey;
}


/* Additional content */
.additional-content__content {
	background-color: #6a6c6d;
	color: lightgrey;
	border: 0px;
	border-radius: 5px;
	box-shadow: 0px 0px 0px #6a6c6d;
}

.subject-section__title-text {
	color: white;
}

.additional-content__content * {
	text-shadow: none !important; /* removes any inherited shadow */
	line-height: 1.5;
}

.subject-section__subtitle {
	color: #f2f2f2;
	font-weight: bold;
}

.user-note__buttons span{
	color: white !important;
}

.user-synonyms__buttons span {
	color: white !important;
}

.user-synonyms__buttons > wk-button__text {
	color: blue;
}

.user-synonyms__buttons {
	background-color: #888888;
	border-radius: 5px;
}

.user-note__buttons{
	background-color: #888888;
	border-radius: 5px;
}

.subject-hint {
	color: black;
}

.wk-hint {
	border-radius: 5px;
}

.subject-collocations__pattern-name[aria-selected=true] {
	background-color: #262626;
}

.subject-collocations__pattern-name {
	background-color: #555555;
}

.subject-collocations__patterns { 
	border-right: 1px solid #555555;
}

.subject-section__meanings-title {
	color: white;
	font-style: italic !important;
}

.subject-collocations__title {
	color: white;
}

/* Question type area */
.quiz-input__question-type-container {
	background-color: #292829;
}

/* Colored background */
.quiz-input__question-type-container[data-question-type=meaning] {
	background-color: #292829;
	color: white;
	text-shadow: 0 0px 0 #fff;
	border: 0px;
	background-image: none !important;
}

.quiz-input__question-type-container[data-question-type=reading] {
	background-color: #292829;
	color: white;
	text-shadow: 0 0px 0 #fff;
	border: 0px;
	background-image: none !important;
}

.character-header {
	filter: contrast(70%) saturate(70%);
}

.quiz-input__input{
	background-color: lightgrey;
	border-radius: 5px;
	text-shadow: 0 0px 0 #fff;
	box-shadow: 0px 0px 0 #e1e1e1;
	color: black;
}

.quiz-input__submit-button {
	color: #444444;
}

.quiz-input__input-container{
	color: black;
}

.quiz-footer {
	background-color: #333333;
}


.quiz-footer__content {
	margin-bottom: 15px;
}

.chat-button, .hotkeys-menu {
	border-radius: 0px;
}


/* Misc */
.subject-character-grid__item {
	background-color: #555555;
	border: 0px;
	color: white;
}

.subject-character__reading {
	color: white;
}

.subject-character__meaning {
	color: darkgrey !important;
}

.kana-chart__character-kana {
	color: white;
}

.kana-chart__character {
	background-color: #464646;
}

.kana-chart__tab:not(.kana-chart__tab--selected) {
	color: lightgrey;
}

.kana-chart__tab:not(.kana-chart__tab--selected):hover {
	color: darkgrey;
}

.kana-chart__backspace {
	background-color: #343434;
	color: white;
	
}

.subject-character__meaning {
	color: white !important;
}

.item-info-injector-accordion, .item-info-injector {
	color: white;
	text-shadow: 0 0px 0 #fff;
}

.item-info-injector img {
	border-radius: 7px;
}

.item-info-injector:not(.wk-nav__item):not(.subject-section__meanings) {
	color: white;
	text-shadow: 0 0px 0 #fff;
}

.item-info-injector > h2:not(.subject-section__meanings-title) {
	text-shadow: 0 0px 0 #fff;
}

.subject-readings__reading-title {
	color: white;
}

.subject-legend__item-title {
	color: lightgrey;
}

.subject-character--locked.subject-character--vocabulary .subject-character__characters-text {
	filter: saturate(100%) brightness(110) contrast(110%);
}

.subject-character.subject-character--radical.subject-character--grid.subject-character--locked {
	filter: saturate(110%) brightness(120%) contrast(120%);
}

.wk-nav__header-icon .wk-icon--chevron_right {
	color: white;
}

.last-item {
	box-shadow: 0px 0px 0px #e1e1e1;
	border-radius: 4px;
	background-color: #ffffff;
}

.character-grid__header-content {
	background-color: #d1d3d4;
}


/* Account info */
.public-profile__user-info {
	color: lightgrey;
}

.item-spread-table-widget__header {
	color: white;
}

.public-profile__wall-of-shame {
	color: white;
	text-shadow: 0 0px 0;
}

.public-profile__srs-progress .item-spread-table-row {
	background-color: #555555;
	border-color: #666666;
}

.public-profile__srs-progress .item-spread-table-row__header {
	color: white;
}

.public-profile__srs-progress .item-spread-table-row__indicator {
	color: white;
}

.item-spread-table-widget__detail {
	background-color: gray !important;
	color: white;
}

.item-spread-table-widget__detail .wk-button__content{
	color: #313160;
	background-color: #e5e5e5;
	border-radius: 5px;
}

.public-profile__kanji-progress, .public-profile__vocabulary-progress {
	margin-top: 24px;
	margin-bottom: 15px;
	padding: 10px;
	color: white;
	border-radius: 13px;
	background-color: #6a6c6d;
}

.wk-panel.wk-panel--wall-of-shame-worst-kanji,
.wk-panel.wk-panel--wall-of-shame-worst-vocabulary{
	background-color: #6a6c6d;
}

/* App settings + other panes */

.app-settings .wk-panel__title {
	color: white;
}

.settings-group__item-list {
	color: white;
}

.page-header__title-text {
	color: white;
}

.page-header__title-subtext {
	color: lightgrey;
}

.wk-panel--settings {
	background-color: #6a6c6d;
}

.account-settings .wk-panel__title {
	color: white;
}

.wk-form__label {
	color: white;
}

.wk-form__label-description p {
	color: lightgrey !important;
}

.settings-link, .settings-link:visited {
	color: #8aabff;
}

.wk-form__control-indicator--updated * {
	color: #86b816;
}

.wk-text {
	text-shadow: 0 0px 0 #fff;
}

.api-tokens__token-label, .api-tokens__token-value {
	color: white;
}

.api-tokens__permissions {
	color: lightgrey;
}

.api-tokens .wk-panel__title {
	color: white;
}

.wk-code {
	background-color: #292829;
	border-radius: 5px;
	color: #7f55ad;
}

.wk-form__field p {
	color: white;
}

.danger-zone__list-item {
	color: #fb5b72;
	font-weight: 500;
}

.danger-zone .wk-panel__title {
	color: white;
}

#username_frame strong {
	color: white;
}

/* Subscriptions */
.subscription-plans__plan-description p, .subscription-plans__plan-frequency p {
	color: black !important;
}

.wk-title, .wk-title--large {
	text-shadow: 0 0px 0 #fff;
	color: white;
}

.subscription-faq {
	background-color: #333333;
	padding: 20px;
	border-radius: 20px;
}

.wk-panel--billing-panel .wk-panel__title, .wk-panel--billing-plans .wk-panel__title, .wk-panel--billing-summary .wk-panel__title, .wk-panel__title{
	color: black;
}


.billing-page .wk-panel {
	background-color: #666666;
}

.billing-page .wk-panel__title {
	color: white;
}

.billing-page .wk-panel__content, .billing-panel__content p, .billing-page p {
	color: lightgrey !important;
}

.billing-plans__plan {
	background-color: #444444;
	border: 2px solid #888888;
	border-radius: 10px;
}

.billing-receipts__receipt-date, .billing-receipts__receipt-amount {
	color: #5ed0ff;
	padding-left: 10px;
	padding-right: 10px;
}

.billing-receipts:hover * {
	background-color: #555555;
}


/* Customize dashboard */

.widget-gallery {
	background-color: #777777;
}

.widget-gallery__category-title {
	color: white;
}

.widget-gallery__header-title, .widget-gallery__category-option-title {
	color: white;
}

.widget-gallery__category-description {
	color: lightgrey;
}

.widget-gallery__navigation-toggle *, 
.widget-gallery__close-button *, 
.extra-study-subjects-widget__detail-button *,
.extra-study-single-button-widget__title {
	color: white;
}

.extra-study-multi-button-widget__intro *, .extra-study-single-button-widget__intro * {
	color: lightgrey !important;
}

.widget-gallery__navigation {
	background-color: #555555;
	border-bottom: 2px solid #999999;
}

.widget-gallery__header {
	border-bottom: 2px solid #999999;
}

.widget-gallery__category-options-and-preview {
	background-color: #444444;
}

.widget-gallery__category-option-title, .wk-notification__text {
	color: white;
}

.wk-notification__button * {
	color: white;
	background-color: #002038;
	border-radius: 5px;
}

.wk-notification__button:hover * {
	color: white;
	background-color: #3668df;
	border-radius: 5px;
}

.dashboard-customization-row {
	background-color: #787878;
}

.dashboard-customization-widget-container {
	background-color: #a6a6a6;
}

.dashboard-customization-row__control *, 
.dashboard-customization-widget-container__control--grip *,
.dashboard-customization-widget-container__control * {
	color: white;
}

.empty-widget-preview {
	background-color: #6a6c6d;
}

.page-header__content .page-header__description .wk-text {	
	color: lightgrey !important;
}

	
`;
  const style = document.createElement('style');
  style.textContent = css;
  document.documentElement.appendChild(style);
})();
