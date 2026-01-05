//
// Written by Glenn Wiking
// Script Version: 1.0.2f
// Date of issue: 08/11/14
// Date of resolution: 06/12/14
//
// ==UserScript==
// @name        ShadeRoot GOOGLE
// @namespace   GOOGLE
// @description Eye-friendly magic in your browser for Google
// @include        http://*.userscripts-mirror.org*
// @include        https://*.userscripts-mirror.org*
// @include        http://*.userscripts.org*
// @include        https://*.userscripts.org*
// @include        http://*.google.*
// @include        https://*.google.*
// @include        http://*.adwords-community.*
// @include        https://*.adwords-community.*
// @include        http://*.gstatic.*
// @include        https://*.gstatic.*
// @include        http://*.gmail.*
// @include        https://*.gmail.*
// @include        http://*.g.co/*
// @include        https://*.g.co/*
// @include        http://*goo.gl/*
// @include        https://*goo.gl/*

// @exclude        http://*.blogger.*
// @exclude        https://*.blogger.*
// @exclude        http://*.youtube.*
// @exclude        https://*.youtube.*
// @version        1.0.2f
// @icon           https://i.imgur.com/9YTCBcn.png
// @downloadURL https://update.greasyfork.org/scripts/6853/ShadeRoot%20GOOGLE.user.js
// @updateURL https://update.greasyfork.org/scripts/6853/ShadeRoot%20GOOGLE.meta.js
// ==/UserScript==

function ShadeRootGOOGLE(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

ShadeRootGOOGLE(
  'html, iframe html, .vasq, .srp, .vsh, #gsr, .sbdd_a, .gstl_0 {background: none repeat scroll 0% 0% #1B1715 !important;}'
  +
  'body, .t3, .Bha, .Nn {background: #1B1715 !important; color: #B2B2B2 !important;}'
  +
  'iframe {opacity: .9 !important;}'
  +
  '*::-moz-selection {background-color: rgba(110, 23, 12, 1);}'
  +
  '.fbar, #mngb, #gb, .gb_Sb, .gb_Bb, .gb_Sb, .gb_Pc, #top_nav {background-color: #282828 ! important; color: #D5D5D5 ! important;}'
  +
  '#hdtbSum, #hdtbMenus, .r-top_nav-1, #appbar, {background-color: #323232 ! important; color: #D5D5D5 ! important;}'
  +
  '.sbib_a, .sbib_b, #gbqfqw, #gbfwa, #gbqfqwb, #hdtb.notl a, #hdtb.notl div, #hdtb.notl li {background-color: #393939 ! important; color: #B2B2B2 ! important;}'
  +
  '#bottomads, #tadsb {display: none; visibility: hidden;}'
  + 
  '#topabar, #appbar, #hdtb, #hdtb_s {background: #282524; height: 38px !important; line-height: 36px !important; color: #DE2211, border-bottom: 0px}'
  +
  '#fbar {border-top: 0px solid red !important}'
  +
  '#hdtbSum, body.vasq #hdtbSum, #hdtb_s, #hdtb_msb {border-bottom: 0px solid red !important; height: 38px !important; line-height: 36px !important;}'
  +
  '#hdtb_msb .hdtb_mitem.hdtb_msel, .hdtb_mitem hdtb_msel hdtb_imb, .hdtb_mitem.hdtb_msel_pre {color: #DE3228 !important; height: 25px !important; margin: 0px !important; border-bottom: 0px !important; border-top: 3px solid #DE3228 !important;}'
  +
  '.gbqfif, .gbqfsf, #gs_lc0, #sb_ifc0, .sbib_b {color: #D5D5D5;}'
  +
  '.fl, .sbdd_b, .sbsb_a, .sbsb_b, .sbsb_c gbqfsf, #sbse0, .sbqs_a, .sbqs_c, .sbqs_c b, .sbsb_i, .sbqs_b, #gbqfqwb, .gbqfqwc, #gbqfqwb:hover, .gbqfqwc:hover, #gbqfqwb:focus, .gbqfqwc:focus, .hdtb-tl:focus, #hdtb-tls:focus, #hdtb_more_mn:focus, .hdtb-mn-c:focus, .hdtb-mn-o:focus, #hdtb_msb a:focus, {color: #525150; background: #222120; border: 0px !important;}'
  +
  '.gbqfqw, gbqfqw.gbqfqw:active, .gbqfqw.gbqfqwf.gbqfqwf {border-color: #842213 !important}'
  +
  '.g, .r, .g h3 a, .r h3 a, .g a, .r a {color: #A41D10 !important}'
  +
  '.sbpqs_a, .sbpqs_a:hover {color: #D5D5D5 !important;}'
  +
  '.sbsb_d:hover {background-color: #222120;}'
  +
  '#ires .kv {background: #1B1715 !important;}'
  +
  '.f a:link, #reauthEmail, ._SWb a.fl, .fl a {color: rgba(195, 174, 174, 1) !important;}'
  +
  '.hdtb-mn-cont {margin-top: -8px;}'
  +
  '#hdtbMenus {background: none repeat scroll 0% 0% #393939;}'
  +
  '.hdtb-loc, .cdr_sep {border-top: 1px solid #671411;}'
  +
  '#hdtb_msb .hdtb-tl-sel, #hdtb_msb .hdtb-tl-sel:hover {background: -moz-linear-gradient(center top , rgba(200, 29, 29, 1), rgba(155, 19, 19, 1)) repeat scroll 0% 0% transparent !important; border: 1px solid rgba(189, 26, 26, 1) !important;}'
//  '._OQb, .search-3-OVN8GL2ohwA {background: #552020 !important}'
  +
  '#nqsbq, ._vVc, .ktf, .std, ._zF, .search-3-YQV3zrMHrCg {background: #353231 !important}'
  + 
  '._zF:focus, .mslg .ab_button:focus, .mslg .kpgrb:focus, .ktf:focus, ._OQb .search-3-OVN8GL2ohwA {border: 1px solid #552120 !important}'
  +
  '.ab_button {background-image: -moz-linear-gradient(center top , #B44422, #A43311) ! important;}'
  +
  '._zF, .mslg .ab_button, .mslg .kpgrb, .gb_W {border: 1px solid #552120 !important;}'
  +
  '#rd-more-link, .fl, .XFe a {color: #DE2211 !important opacity: .8 !important}'
  +
  '.a, cite, cite a:link, cite a:visited, .cite, .cite:link, #_bGc > i, .bc a:link {color: #842213 !important; opacity: .7 !important;}'
  +
  '#fbar {background: none !important;}'
  +
  '.hdtb_mitem.hdtb_imb:first-child, #center_col {margin-left: 0 !important;}'
  +
  '#hdtb_msb {margin-left: 120px !important;}'
  +
  '#search {margin-top: 12px !important;}'
  +
  '#hdtbSum, body.vasq #hdtbSum, #hdtb_s, #hdtb_msb {height: 38px !important; line-height: 34px !important;}'
  +
  'img.iuth, ._lyb a img {opacity:.82;}'
  +
  '.th {border: 1px solid #552120 !important;}'
  +
  '.brs_col, .brs_col a {color:#B42520 !important;}'
  +
  '#fsl a, #fsr a, #footer-list li, #footer-list li a, .banner h2 {color: #A41D10 !important; text-shadow: 1px 1px 2px rgba(70, 18, 15, 0.92);}'
  +
  '#hplogosh {background-color: rgba(125, 22, 15, 0.80) !important;}'
  +
  '#hplogo {opacity: .85;}'
  +
  '#navcnt td {opacity: .72;}'
  +
  '.ab_dropdown {background: #343230; color:#D5D4D2 !important;}'
  +
  '.action-menu-item:hover {background: #545250 !important;}'
  +
  '.gb_Oa, .gb_Ta {opacity: .85}'
  +
  '#swml a {color: #808080 !important;}'
  +
  '.hdtb-mn-o, .hdtb-mn-c {border: 1px solid #841310 !important; box-shadow: 0px 2px 4px #552120 !important; opacity: .72;}'
//  +
//  '#hdtbSum {border-bottom: none;}'
// LIGHT TEXT
  +
  '.st {color: #aaa;}'
  +
  '.f, .f a:link, #reauthEmail {color: #dedede !important;}'
  +
  'a {color: #cdcdcd !important;}'
  +
  '.st {color: #808080 !important;}'
  +
  'body .spell, .spell_orig {color: #842213 !important;}'
// SEARCH BUTTONS
  +
  '.gbqfba, #gbqfwba, #gbqfba:hover, #gbqfbb:hover, .jsb, .a-b-p, .gb_f gb_4b, #gb_70, .gb_6b, .gb_W, .gb_V, .gb_Va, #gbqfb, .gbqfb, .gbqfba, #hdtb_tls:hover, .gb_Zb, .gbp1, .gb_V, .a-b-p:focus, .b-c-U ,  .jfk-button-standard.jfk-button-checked, #gt-langs .jfk-button-standard, .e_md #gt-sl-gms, .e_md #gt-tl-gms, #gt-submit.jfk-button, .ita-kd-inputtools-div, #gt-pb-sw1 .jfk-button, .b-c-R, .b-c-Ba {background: -moz-linear-gradient(center top , #B44422, #A43311) repeat scroll 0% 0% transparent !important; color: #FEE !important; box-shadow: 0px 0px 0px rgba(0,0,0,0) !important; outline: 0px solid #992822 !important;}'
  +
  '.gbqfba:focus, .gb_V, .a-b-p:focus, .b-c-R:focus {border: 1px solid #B44422; outline: none; !important;}'
  +
  '.gb_na .gb_V, .gb_Zb, .gbp1, .gb_V, .gb_V:hover, .b-c-U, .b-c-R:hover, .b-c-Ba:hover {border: 1px solid #B44422 !important;}'
  +
  '.gbqfba:hover {border-color: rgba(120, 25, 25, 1);}'
  +
  '#hdtb_tls:hover, gb_V {border: 1px solid #841310; color: #FEE !important;}'
  +
  '.ab_button.selected, .ab_button.selected:hover, .ab_button:hover, .a-b-p:hover {border: 1px solid #841310;}'
  +
  '.hdtb-mn-o, .hdtb-mn-c {padding-top: 0px !important; padding-bottom: 0px !important; background: #393939 !important;}'
  +
  '.Gc.esw, .Dg, .t-Pa-mb-c.b-c-R, .Ul, .tKc, .FP {background-color: rgba(158, 50, 50, 1) !important; border: 1px solid #943422 !important}'
  +
  '.Gc.eswd:hover {border-color: rgba(119, 24, 24, 1); box-shadow: 0px 1px 0px rgba(122, 30, 19, 0.1);}'
  +
  '.fr > .vt, {border-top: 0px solid #841310;}'
  +
  '.jfk-button-standard.jfk-button-checked, #gt-langs .jfk-button-standard, .e_md #gt-sl-gms, .e_md #gt-tl-gms, #gt-submit.jfk-button {border: 1px solid #992822 !important;}'
  +
  '.b-c-Ba.b-c-I, {background: none repeat scroll 0% 0% rgba(141, 52, 33, 1) !important;}'
  +
  '.jfk-button-standard:focus, .jfk-button-hover, .jfk-button-hover:hover {border: 1px solid #992822 !important;}'
  +
  '.d-u-F:hover {background-color: #B91616 !important; background-image: -moz-linear-gradient(center top , #B91616, #B91616) !important; border: 1px solid #A51206; !important}'
  +
  '.tKc, .FP {color: #EDD !important;}'
// IMAGES  
  +
  '#ifbc, .prc, #ifbd, #ires, #cnt {background: #1B1715 !important; padding-top: 0px !important;}'
  +
  '#ifbc {height: 125px;}'
  +
  '.sbdd_b, .sbsb_a, .sbsb_b, .sbsb_c, .gbqfsf, .sbse2, .sbqs_a, .sbqs_c {color: #929190; background: #222120; border: 0px !important;}'
  +
  '.sbsb_c {padding: 0px !important; margin-left: 10px !important; margin-right: 10px !important;}'
  +
  '.spell i, .spell_orig a {color: #929190}'
  +
  '.rg_fbl, .nj {color: #929190 !important; border: 1px solid rgba(221, 28, 28, 0.54) !important; padding: 0px !important; margin: 0px 28px 0px -12px !important; opacity: .80;}'
  +
  '#ifb {color: #929190 !important; margin-left: 12px !important; margin-top: 8px;}'
  +
  '.ucd, ._Ocs, .rg_bb_label, .rg_bb_i {color: #FFF !important; opacity: 1 !important;}'
  +
  '.ucd:hover, ._Ocs:hover, .rg_bb_label:hover, .rg_bb_i:hover, .rg_fbl nj:hover, #ifb a:hover {background-color: #666261 !important; opacity: 1 !important;}'
  +
  '.rg_fbl nj, #ifb a {background-color: #565251 !important;}' 
  +
  '.rg_l, #navcnt {opacity: .85; !important}'
  +
  '.rg_anbg, .rg_ilmbg {background: none repeat scroll 0% 0% rgba(78,20,20,0.8) !important;}'
  +
  '.mw {margin-left:108px;}'
  +
  '#hdtb.notl a:hover {color: #FEE !important;}'
  +
  '.ab_dropdownrule {display: none;}'
  +
  '.rg_fbl:hover {box-shadow: 0px 0px rgba(0, 0, 0, 0) !important;}'
// MAPS
  +
  '.gb_Pc, .gb_5 {background-color: rgba(40, 40, 40, 0) !important;}'
  +
  '#app-container {opacity: .70 !important;}'
  +
  '#omnibox, .cards-card, .cards-expanded {opacity: .88;}'
  +
  '#searchboxinput, .tactile-searchbox-input {color: rgba(71,15,15,1) !important;}'
// SHOPPING
  +
  '.pslimg a.psliimg {opacity: 0.8;}'
  +
  '.pswtr, .r-topstuff-4, ._wbd, .pswtr-btn {display: none;}'
  +
  '#rhs_block, #tvcap {display: none;}'
// CHROME PLUG
  +
  '.gb_tb, .gb_wb, .gb_Ia {background-color: #842213 !important;}'
// LOGIN
  +
  '.clearfix {background-color: #1B1715;}'
  +
  '.google-footer-bar {border-top: 1px solid rgba(221, 28, 28, 0.54); background-color: #282828;}'
  +
  '.lang-chooser, .lang-chooser option {background-color: #651715 !important; color: #D5D5D5 !important; border: 0px solid #642422 !important;}'
  +
  '.rc-button-submit, .rc-button-submit:visited {border: 1px solid #841310; color: #FEE !important; background-color: #B44422; background: -moz-linear-gradient(center top , #B44422, #A43311) repeat scroll 0% 0% transparent;}'
  +
  '.rc-button-submit:hover {border: 1px solid #841310; background-color: #C54422; background: -moz-linear-gradient(center top , #C54422, #A43311) repeat scroll 0% 0% transparent; opacity: .92;}'
  +
  '.main .card {background: #393836}'
  +
  '#profile-img {opacity: .85}'
  +
  '#Passwd, #Email {background: #686762; color: #A41D10; text-shadow: 1px 1px 2px rgba(70, 18, 15, 0.25); border: 1px solid #994220}'
  +
  '#account-chooser-link, #link-forgot-passwd {color: #992622 !important}'
  +
  '.one-google img, .profile-img {opacity: .75}'
// OVERLAYS
  +
  '.gb_D, .gb_Pc {background: #393939 !important; border-bottom: #992622;}'
  +
  '.gb_ra {background: #323130 !important; border-top: 1px solid #992622;}'
  +
  '.gb_ka a {color: #D52F26 !important;}'
  +
  '.gb_oa {background: rgba(188, 31, 12, 0.7) !important;}'
  +
  '.d-u-F, .d-u-F.d-u-D {background: none repeat scroll 0% 0% rgba(213, 38, 17, 1) !important; border: 1px solid rgba(185, 22, 22, 1);}'
  +
  '.d-u-Q, .qYaiXb  {border: 1px solid rgba(78, 71, 71, 0.5) !important; background-color: #353230; color: #FEE !important; background-image: -moz-linear-gradient(center top , rgba(81, 62, 62, .8), rgba(60, 58, 58, .8)) !important;}'
  +
  '.Wf-dg-qf {background-color: rgba(18, 12, 12, 1) !important; border-top: 0px solid #992622;}'
  +
  '.Wf-Yf-Xb-qf, .Wf-Xf-Kf  {border-bottom: 1px solid rgba(108, 13, 9, 1) !important; box-shadow: 0px 1px 5px 1px rgba(108, 13, 9, 1) !important; color: #994220}' 
  +
  '#picker:ht, .Wf-Ie-rc, .Wf-bg-fc, .Wf-Ie-qf {display:none !important;}'
  +
  '.Wf-Yf-Xb-Zf-Wb-ag .Wf-Yf-Xb-vh {color: #992622;}'
  +
  '.Wf-Yf-Xb-Zf-Wb-ag .a-Zf-w {border-width: 0px 0px 2px; border-style: none none solid; border-color: -moz-use-text-color -moz-use-text-color #992622 !important;}'
  +
  '.gb_F {background-color: #393939 !important;}'
  +
  '.gb_C {background-color: #732214 !important;}'
  +
  '.gb_m {border: 0px solid #000;}'
  +
  '.gb_db, .gb_eb {color: #EDD !important;}'
  +
  '.gb_ga {border-color: transparent transparent #393939;}'
  +
  '.gb_m:hover:not(.gb_n), .gb_H {border: 1px solid #732214; !important}'
  +
  '.gb_m:hover .gb_r {background: none !important;}'
  +
  '.fc, .fc .UK, .kc, .re, .d-A-B, .d-A, .d-A:hover, .fc .Hc, .ub .g-h-f-ci {background-color: #393939 !important; color: #EDD;}'
  +
  '.g-h-f-vc-B, .fc .df, .Rd, .g-h-f-N-N, .FC, .Wf-dh .Wf-jh-Oc-qb {background-color: #671B12 !important; color: #EDD !important;}'
  +
  '.d-cm, .LSc, .gb_H {display: none;}'
  +
  '.fc .df, .gb_D {border: 0px !important;}'
  +
  '.gb_Ob .gb_ga {border-bottom-color: #671B12;}'
  +
  '.gb_Ha {height: 261px;}'
  +
  '.aac, .MNn0h, .f4a.B70Reb, .Y9b {background: #393939 !important; color #EDD !important;}'
  +
  '.Kza {background-color: rgba(110, 13, 13, 1) !important;}'
  +
  '.Kza:before, .Kza:after {border-color: #681313 rgba(201, 38, 38, 0) #FFF !important;}'
  +
  '.gb_H {background: none repeat scroll 0% 0% #732214;}'
  +
  '.GjrNhc {background-color: #671B12 !important; color: #EDD !important; border: 1px solid rgba(108, 13, 9, 1) !important;}'
  +
  '.qYaiXb {background-color: #671B12 !important;background-image: -moz-linear-gradient(center top , #671B12, #671B12) !important;}'
  +
  '.tOzlkd .FtSs3d, .C6UQ {background-color: #1B1715;}'
  +
  '.bdu4nd {background-color: #1B1715;}'
  +
  '.gb_m {border: 0px solid #000 !important;}'
  +
  '.gb_m:hover:not(.gb_n), .gb_m:hover {border: 1px solid #732214 !important;}'
  +
  '#fsett {background: none repeat scroll 0% 0% #262522 !important; border: 1px solid rgba(60, 19, 12, 1) !important;}'
  +
  '.maia-nav-x {background: none repeat scroll 0% 0% #262522 !important;}'
  +
  '.gb_ga {border-color: #393939 !important;}'
  +
  '.jobs-topstories {border: 1px solid rgba(89, 25, 25, 1); box-shadow: 0px 1px 3px rgba(81, 19, 19, 1);}'
  +
  '.gweb-pagination-nav ul {background-color: rgba(84, 15, 15, 1) !important;}'
  +
  '.f4a.tta {background-color: #393939 !important;}'
  +
  '.YGETNc {color: #953431 !important;}'
  +
  '.asa {border-top: 1px solid #841C1B;}'
  +
  '.z-b-G:focus, .z-b-G {outline: none !important; border: 0px none !important;}'
  +
  '.xa {background-color: rgba(58, 5, 5, 1) !important;}'
  +
  '.Bb {border-bottom: 0px solid none !important;}'
  +
  '.g-h-f-V-nb {border-color: #7C1010 !important;}'
  +
  '.QYd, .hDc, .d-s, .d-s:focus, .d-s:hover, .d-s:active {color: #953531 !important;}'
  +
  '.mYd, .OCc, .yB {background-color: #413939; border-bottom: 1px solid #252221; color: #EDD;}'
  +
  '.z8c {background-color: #323030; border-left: 2px solid #953531; color: #EDD;}'
  +
  '.yB {border: 1px solid rgba(81, 9, 9, 1);}'
  +
  '.eda {color: #EDD !important;}'
  +
  '.nw {border: 0px solid none; display: none;}'
  +
  '.gb_Q {color: rgba(204, 11, 11, 1);}'
  +
  '.duf3d {border: 1px solid rgba(93, 15, 15, 1) !important; background-color: rgba(53, 15, 15, 1) !important;}'
  +
  '.ktf {border-color: rgba(116, 9, 9, 1) rgba(137, 9, 9, 1) rgba(98, 9, 9, 1) !important;}'
  +
  '.kpbb {background-color: rgba(141, 31, 12, 1) !important; background-image: -moz-linear-gradient(center top , rgba(138, 30, 12, 1), rgba(117, 25, 10, 1)) !important; border: 1px solid rgba(174, 34, 11, 1) !important;}'
// ACCOUNT & SETTINGS
  +
  '.Qc {background-color: rgba(57, 18, 18, 0.85) !important;}'
  +
  '.QC {border-bottom: 1px solid rgba(125, 7, 7, .92) !important;}'
  +
  '.PC .e6 img, .W5 {opacity: .85;}'
  +
  '.Yb {background: #282524;}'
  +
  '.Eb {color: #FEE !important;}'
  +
  '.Qe:before {border-left: 1px solid #992622;}'
  +
  '.Eb.Ld, .Se, .Eb:hover, .Se .Eb:hover {border-bottom-color: rgba(125, 7, 7, .92);}'
  +
  '.Uc, .fOa, .INc, {background-color: #343230;}'
  +
  '.Uc, .ZJ, .fOa, .vld {background-color: rgba(45, 43, 43, 1) !important; opacity: 1;}'
  +
  '.nLb {border-bottom: 1px solid rgba(140, 53, 50, 0.9);}'
  +
  '.JNc, .Uc.YJ, .t3, .Bha, .Ryb, .v0c {background: #1B1715 !important;}'
  +
  '.M3, .qna, .gPa {background: #1B1715 !important;}'
  +
  '.HNc {color: rgba(189, 40, 40, 1) !important; background-color}'
  +
  '.jkb, .PSa, .d-y-r-c {color: #FEE !important;}'
  +
  '.Uc.YJ, .INc, #gt-appbar, #gt-apb-main {background: #2D2B2B !important;}'
  +
  '.uoGTZe {background: #8B2925 !important;}'
  +
  '.jw, .Bha .jw {background: rgba(0,0,0,0) !important;}'
  +
  '.iqa, .Sb, .sda, .je, {background-color: rgba(81,41,41,1) !important;}'
  +
  '.P4, .Cy.P4, .Cy:hover, .XO.d-y-r-c {border-color: #992622 !important; color: #992622 !important;}'
  +
  '.SOb {background: -moz-linear-gradient(center top , #B44422, #A43311) repeat scroll 0% 0% transparent !important; color: #FEE !important;}'
  +
  '.pMc {color: #FEE !important;}'
  +
  '.xLa img, .Wza img, .dkb {opacity: .8}'
  +
  '.ve, .Ct, .Bba, .lU, .jU, .Sb, .Ue {background: #2D2B2B !important; color: #B2B2B2 !important; border-color: rgba(0,0,0,0) !important; border 0px !important; border-width: 0px !important;}'
  +
  '.z4, .H3c, .z4 .H3c {background: rgba(122, 22, 10, 0.92) !important;}'
  +
  '.Ide, .BIa, .Mde, .yVd {background-color: #2D2B2B; border: 0px !important; border-width: 0px !important;}'
  +
  '.Xld.d-s, .LLd.d-s, .U1d.d-s, .V1d.d-s, .W1d.d-s, .UGd.d-s {color: rgba(185, 48, 39, 1) !important;}'
  +
  '.BIa:hover, .Hyc:hover, .Ide:hover {color: #A43311;}'
  +
  '.G-q, .avb, G-q avb, .aqd, .Pvd, .Ypd {background: rgba(95, 13, 13, 1) !important; color: #B2B2B2 !important;}'
  +
  '.Cqc {background: #A43311 !important; color: #C2C2C2 !important;}'
  +
  '.d-s {color: #C88480;}'
  +
  '.Be .l7, .es, .kqa .es, .kqa, .Be .k7 {background-color: rgba(123, 31, 31, 1) ;border-top: 1px solid #7B1F1F; color: #E4E4E4}'
  +
  '.iH {border-top: 1px solid rgba(123, 31, 31, 1);}'
  +
  '.kqa .es {border-left: 0px solid rgba(123, 31, 31, 1) !important; border-right: 0px solid rgba(123, 31, 31, 1) !important; border-color: #EDD !important;}'
  +
  '.jqa .cv {display: none;}'
  +
  '.es {border-color: rgba(213, 0, 0, 0) rgba(251, 0, 0, 0) -moz-use-text-color; border-top: 0px;}'
  +
  '.dv, .dv a {color: rgba(123, 31, 31, 1);}'
  +
  '.Be .dv, .aj:hover .dv {color: rgba(188, 31, 31, 1);}'
  +
  '.ve {border-width: 0px 0px 0px;}'
  +
  '.Ee {border-width: 0px 0px 0px;}'
  +
  '.Yp {background: #282626; !important}'
  +
  '.hf.DX, .hf.WC {background-color: rgba(78, 14, 14, 1);}'
  +
  '.HX {border-bottom: 0px solid rgba(78, 14, 14, 1);}'
  +
  '.iGqbIb {display: none;}'
  +
  '.nMa, .zj, .Xc {background: #2D2B2B; color: #E4E4E4;}'
  +
  '.edk5Ge {border-bottom: 0px solid #000}'
  +
  '.gsl0xd {border-left: 0px solid #000}'
  +
  '.v8iSuf, body.iM3vKf, .WopYHf {background: #282626;}'
  +
  '.ICsgXc {background: #C2C2C2; border: 0px !important}'
  +
  '.edk5Ge, .wrE5bd, .v8iSuf {background: rgba(143, 28, 28, 1); border: 0px !important;}'
  +
  '.Ahnnze {border: 0px !important;}'
  +
  '.xa {background-color: rgba(68, 54, 54, 1);}'
  +
  'Uc.YJ {background: none repeat scroll 0% 0% rgba(45, 43, 43, 0.73) !important;}'
  +
  '.fr, .WR, .TC, .vy {background-color: rgba(0,0,0,0);}'
  +
  '.Bl {display: none;}'
  +
  '.ys, .bD, .sh > .Ee {background: #2D2B2B !important;}'
  +
  '.wu {background-color: rgba(65, 48, 48, 1); border: 1px solid rgba(81, 44, 44, 1);}'
  +
  '.b-hb:focus, .b-hb {border: 1px solid #512C2C; background: rgba(65, 48, 48, 1)}'
  +
  '.v8iSuf, .v8iSuf div {background-color: rgba(144, 22, 22, 1) !important;}'
  +
  '.xa, .Qk, .afa, .mo {background-color: rgba(81, 35, 35, 1) !important); color: #E4E4E4;}'
  +
  '.WK, .Sb, .Gb, .RTIH7 {background: #242220 !important}'
  +
  '.qxxOMd {color: #E4E4E4 !important}'
  +
  '.vD {color: #211 !important}'
  +
  '.BJb {background-color: rgba(255, 255, 255, 0) !important;}'
  +
  '.gsl0xd {border-left: 0px !important}'
  +
  '.gB {background: #282626; color: #EDD;}'
  +
  '.b2, .R4, .Xha {background-color: #8F1C1C; border: 0px}'
  +
  '.rj, .Ug, .cja {color: #8F1C1C !important}'
  +
  '.rj:hover, .Ug:hover {color: #654848}'
  +
  '.em, .em:before {background: none;}'
  +
  '.oB {border-top: 1px solid rgba(98, 31, 31, .92);}'
  +
  '.d-s:hover, .o-U-s:hover, .ob a, .Jk a, .ob a:hover, .Jk a:hover, .d-s, .d-s a {color: rgba(188, 31, 31, 1); !important}'
  +
  '.gb_va, .gb_Da {border-top: 1px solid rgba(104, 25, 25, 0.2) !important; background: #323130 !important;}'
  +
  '.gb_Ba, .gb_Ca {color: #EDD !important;}'
  +
  '.gb_ga {background: #393939;}'
  +
  '.gb_Fa, .gb_Fa a {color: #D52F26 !important;}'
  +
  '.z4 .H3c {opacity: .82;}'
  +
  '.gPa .Xia {color: rgba(132, 17, 17, 0.95) !important;}'
  +
  '.Zmjtc {color: rgba(177, 171, 171, 0.95) !important;}'
  +
  '.QVb, .hE, .ho {opacity: .8;}'
  +
  '.juqF8b:hover {background-color: rgba(102, 19, 15, 1);}'
  +
  '.juqF8b .TYml9c.d-s {color: #EDD !important;}'
  +
  '.fa-pEc, .gb_6, .gbip, .gb_6 .gbip, .y4 {opacity: .8;}'
  +
  '.Uc.ZJ, .VVa, {opacity: .92;}'
  +
  '.fa-pEc table, .jcb {background: none repeat scroll 0% 0% rgba(38, 17, 17, 1); border-color: rgba(92, 19, 19, .9) rgba(92, 19, 19, .9) rgba(71, 19, 19, .9);}'
  +
  '.Axc, .DUb {color: #A43311 !important;}'
  +
  '.CUb, .EUb, .bGa {border-bottom: 0px solid #000; background-color: #1B1715 !important;}' 
  +
  '.Ee {background-color: #2D2B2B !important;}'
  +
  '.F9a, .Cr {color: #CDCDCD !important;}'
  +
  '.rga .Cr.Aha {border-bottom: 1px solid rgba(60, 31, 31, 0) !important;}'
  +
  '.Sb {background: none repeat scroll 0% 0% #2D2B2B !important;}'
  +
  '.d-r {background: none repeat scroll 0% 0% #2D2B2B; border: 1px solid rgba(90, 37, 37, 0.2); box-shadow: 0px 2px 40px rgba(0, 0, 0, 0.4);}'
  +
  '.d-cm {border-top: 0px solid #000;}'
  +
  '.t-C-z .V-X {background-color: #2D2B2B; !important}'
  +
  '.cp, .cp:hover, .Pf {background: #8A371E; border: 0px solid rgba(0,0,0,0) !important; color: #EDD;}'
  +
  '.d-r, .d-r:hover, .gb_Ua .gb_ga, .gb_Ob .gb_ga {color: #EDD !important; background: #393939 !important; border-bottom-color: #393939 !important;}'
  +
  '.Wf-Ah-Bh.Wf-Yf-qf {background-color: rgba(86, 25, 25, 1) !important; border-right: 1px solid rgba(126, 26, 26, 1) !important;}'
  +
  '.Wf-jh-Oc, .Wf-jh, .Wf-dh.Wf-je-ye {background: #393939 !important;}'
  +
  '.Wf-Jk.Wf-Ah-Bh {border-bottom: 0px solid #000;}'
  +
  '.Wf-je-Gg {background-color: #312E2C; background-image: none; border-color: #312E2C;}'
  +
  '.a-ub-eb, .Wf-je-Gg-Mc, .a-b-c {color: #EDD !important;}'
  +
  '.Wf-dg-qf {background-color: rgba(26, 23, 23, 1) !important;}'
  +
  '.Xq {border: 1px solid rgba(99, 19, 19, 1) !important;}'
  +
  '.d-Pb, .d-Pb:focus, .o-E-N, .o-E-N:focus, .zC, .ZJa, .fEa, .Vga, .Daa, .MEa, .Lea, .pq, .vpa {border: 1px solid rgba(99, 19, 19, 1) !important; background-color: rgba(65, 48, 48, 1); border: 1px solid rgba(81, 44, 44, 1); color: #EDD !important;}'
  +
  '.Wf-je-Gg {border-color: #E5E5E5; border-color: rgba(48, 41, 41, 1) !important;}'
  +
  '.Wf-Pc-je-fk {background: none repeat scroll 0% 0% rgba(125, 24, 24, 1) !important;}'
  +
  '.pq, .UH {border: 0px solid #000 !important;}'
  +
  '.Lea {background: none repeat scroll 0% 0% #403131 !important;}'
  +
  '.b-Rv.iba .d-Jd-B, .d-A-B, .d-Kc-L, .d-Jd-Nb .EOa, .b-Rv.iba .EOa  {color: #D14836 !important;}'
  +
  '.gb_wa:hover, .gb_wa {background: none repeat scroll 0% 0% #323130; color: #D52F26 !important;}'
  +
  '.maia-locales select, .maia-locales options {background: #282828; color: #EDD !important; border: 1px solid rgba(77, 13, 7, 1) !important;}'
  +
  '.maia-locales select, .Uu {border: 1px solid rgba(77, 13, 7, 1) !important;}'
  +
  '#maia-signature {opacity: .75 !important;}'
  +
  '#maia-nav-x {background: #2F2F2F;  border-bottom: 1px solid rgba(77, 13, 7, 1) !important;}'
  +
  '.Ji, .Wx, .tw, .Yt {background: #3E1818 !important;}'
  +
  '.Ji a, .Wx a, .tw a, .Yt a{color: #EDD !important;}'
  +
  '.Bha .Yp {background: rgba(0,0,0,0) !important;}'
  +
  '.N17q2c, .J9wCee {background-color: rgba(39, 22, 22, 1);}'
  +
  '.d-A, .d-A:hover {border: medium none !important;}'
  +
  '.vREfpe, .cWrSy {background-color: #B44422 !important; background: -moz-linear-gradient(center top , #B44422, #A43311) repeat scroll 0% 0% transparent !important; color: #FFF;}'
  +
  '.sNX7Sb, .eoF83d, .xGv7Bd, .sNX7Sb:active, .eoF83d:active, .xGv7Bd:active {color: #EDD; background: #2D2B2B !important; border-top: 0px solid #EEE !important;}'
  +
  '.HIk0v, .ZLUNB, .MMP6yc {background: #393939; color: #EDD;}'
  +
  '.IuTM5c, .IuTM5c:hover {background: none repeat scroll 0% 0% rgba(75, 75, 75, 1);}'
  +
  '.IuTM5c:hover, .nN35, .Txql0d, .Txql0d a {color: #EDD !important;}'
  +
  '.IuTM5c.TEPfHc {background: none repeat scroll 0% 0% rgba(168, 30, 14, 1);}'
  +
  '.ZLUNB, .kv {color: #A42529;}'
  +
  '.a-w-v.a-Za-Bb {background-color: rgba(39, 39, 39, 1);}'
  +
  '.a-La-jb-xc-ba-nb, .a-La-jb-xc-ba-nb a, .ej {background-color: rgba(80, 21, 21, 1); color: #EDD;}'
  +
  '.a-ec, .ej, .yx, .Nf, .q9, .yg {background: none;}'
  +
  '.xdJMjf, .WhFo9c, .kv, .hn, .kS.ve, .Yp, .yt, .Xa, .gn {background: #393939 !important; background-color: #393939 !important; border-top: 0px solid #000 !important;}'
  +
  '.fr > .vt, .A,r .vt {border-top: 0px solid #000;}'
  +
  '.kv, .kv:hover, .Nu.Hh, .Ou.Gh, .Ou.Gh:hover, .Ou.Nu, .Ou.Nu:hover {background-color: rgba(72, 31, 24, 1);}'
  +
  '.je, .kf, .Mc, .pf, .yg, .lmb, .tsb .AIa, .omb {opacity: .8 !important;}'
  +
  '.gi, .xda, .vt {border-bottom: 0px solid #000 !important; border-top: 0px solid #000 !important;}'
  +
  '.yd.b-i {background-color: #7B1F1F !important; border-color: #7B1F1F transparent;}'
  +
  '.gEc {background-color: transparent !important;}'
  +
  '.QZb {border: 1px solid #4B0F0F; background-color: #2D2D2D;}'
  +
  '.t-C-Kj, .ttc {background: none repeat scroll 0px 0px #351F1F; border: 0px solid #000;}'
  +
  '.t-C-z {background: none repeat scroll 0px 0px #351F1F; border: 1px solid #4B0F0F;}'
  +
  '.xa {background-color: rgba(42, 15, 15, 1);}'
  +
  '.Qk, .V-X.t-C-I, .V-X.t-C-I:hover {background-color: #2D2D2D;}'
  +
  '.aSa, .aSa div, .aSa li, .bJb, .bJb:focus, .aJb {background-color: rgba(62, 11, 3, 1) !important; border-bottom: 0px solid transparent; border: 0px solid transparent;}'
  +
  '.o-U-s, .gRc, .kZa .o-U-s, .Mb .ara .o-U-s {color: #EDD !important;}'
  +
  '.pMa:after {background-color: transparent; background-image: none !important;}'
  +
  '.tsc, .xXa {background-color: #2D2B2B !important;}'
  +
  '.bSa.o-E-N:focus, .bJb, .bJb:focus {border: 1px solid #631313 !important;}'
  +
  '.d-y-r-c, .d-y-r-c:hover, .d-y-r-c:focus, .o-ld-Su-ld-Uj, .o-ld-Su-ld-Uj:hover, .o-ld-Su-ld-Uj:focus {background-color: #413030; background-image: none !important; border: 1px solid #631313;}'
  +
  '.V-X:hover, .V-X:focus, .V-X:active, .V-X, .o-ld-Su-ld-Uj:active, .o-ld-Su-ld-Uj:focus {background-color: #3E0B03 !important;}'
  +
  '.t-Pa-mb-c.b-c-Ba {border-color: rgba(129, 18, 18, 1);}'
  +
  '.o-Pe-r-c-ha, .VRd, .Kra, .LXa, .Kra:hover, .LXa:hover {color: #851515 !important;}'
  +
  '.C6c {background-color: #631313 !important;}'
  +
  '.ka-N-ka, .XGb {color: #EDD !important;}'
  +
  '.Enb, .lob, .pBa, .wja {background: #1B1715 !important;}'
  +
  '.HBc {background: #2D2B2B !important; border-bottom: 1px solid #842213; border-top: 1px solid #842213;}'
  +
  '.vya, .Vua {background-color: rgba(119, 29, 29, 1);}'
  +
  '.b-hb, .b-hb:focus, .SPb, .SPb:focus {color: #EDD !important;}'
  +
  '.RRd {background-color: #2D2B2B;}'
  +
  '.Hza.b-c-R {border-color: rgba(108, 26, 26, 1) !important;}'
  +
  '.G-q-Ya {background: rgba(12,5,5,4) !important;}'
  +
  '.qYb .G-q-B {background-color: rgba(33, 27, 27, 1) !important;}'
  +
  '.Eha {opacity: .8;}'
  +
  '.Dha {background-color: rgba(51, 25, 25, 1) !important;}'
  +
  '.fXb, .YSKYmf {background-color: #2D2B2B;}'
  +
  '.XGb:hover {background-color: rgba(51, 25, 25, 1) !important;}'
  +
  '.oA {background-color: transparent !important; border: 0px solid #000 !important;}'
  +
  '.eh {background-color: rgba(119, 29, 29, 1);}'
  +
  '.iN, .EV, .My, .kq {background-color: transparent !important; background: none repeat scroll 0% 0% rgba(39, 11, 11, 1) !important; border-bottom: 0px solid #000 !important; border-color: rgba(101, 7, 7, 1) transparent transparent;}'
  +
  '.z-b-G:focus {border: 1px solid #000 !important;}'
  +
  '.lZ .kq {display: none;}'
  +
  '.Ff, .Ff:focus {border: 0px solid transparent !important; border-color: 0px solid transparent !important; border-bottom: 0px solid transparent !important;}'
  +
  '.My {border-color: rgba(102, 29, 29, 1) transparent transparent;}'
  +
  '.z-b-G:focus {border: none;}'
  +
  '.Mna {background-color: rgba(51, 23, 23, 1);}'
  +
  '.Mna:before {background: none;}'
  +
  '.uLU1ye {border-right: 1px solid rgba(102, 29, 29, 1);}'
  +
  '.fRnlh {color: rgba(147, 24, 24, 1) !important;}'
  +
  '.Fw, .dm {background-color: #1B1715 !important;}'
//  '.ICsgXc *, .Eg, .KzhQXc, .a-E, .WopYHf, .aZzjbc {display: none;}'
// TRANSLATE
  +
  '#gt-appbar {border-bottom: 0px solid #A43311;}'
  +
  'div.gb_tb.gb_wb.gb_Ia div span::after {content: ".. before it becomes mandatory!" !important;}'
  +
  '.Qk {background: #545250 !important;}'
  +
  '.Xia {color: rgba(132, 17, 17, 0.95) !important;}'
  +
  '.Mnc9Jf, .OdC7u {border-color: #2D2B2B -moz-use-text-color -moz-use-text-color; border-width: 0px; background-color: #2D2B2B !important;}'
  +
  '#gt-text-c, #gt-apb-main {background: none repeat scroll 0% 0% #1B1715;}'
  +
  '#gt-ft-mkt a {color: #842213 !important;}'
  +
  '#gt-res-wrap, .gt-hl-layer {background: none repeat scroll 0% 0% rgba(57, 51, 51, 1) !important; border: 1px solid rgba(53, 36, 36, 1) !important;}'
  +
  '#gt-ft-res {border-top: 1px solid #393939; background-color: #393939;}'
  +
  '#gt-apb-main a {color: #A43311 !important;}'
  +
  '#result_box.short_text, #source.short_text {color: #EDD !important;}'
  +
  '#gt-src-wrap {border-style: none !important; border-right: 0px solid #D9D9D9 !important;}'
  +
  '#gt-feedback {color: #EDD !important;}'
  +
  '#ft-l a, #ft-r a, .maia-aux ul a {color: #A41D10 !important; text-shadow: 1px 1px 2px rgba(70, 18, 15, 0.92);}'
  +
  '.Rd, .g-h-f-vc-B {border: 1px solid rgba(131, 11, 11, 1) !important;}'
  +
  '.gt-card-ttl-txt, .gt-def-row, .gt-rw-span {color: #EDD;}'
  +
  '.goog-menu {background: #2D2B2B; border: 1px solid #1B1715; color: #EDD !important;}'
  +
  '.goog-menuitem-emphasize-highlight, #gt-tl-gms-menu .goog-menuitem-group .goog-option-selected, .goog-option-selected .goog-menuitem-content, .goog-option-selected .goog-menuitem-content, #gt-sl-gms-menu .goog-menuitem-group .goog-option-selected {background-color: #424242; color: #EDD !important;}'
  +
  '.goog-menuitem-group .goog-menuitem, #gt-tl-gms-menu .goog-menuitem-group .goog-menuitem:hover, .goog-menuitem-emphasize-highlight, .goog-menuitem-emphasize-highlight:hover, #gt-sl-gms-menu .goog-menuitem-group .goog-option-selected, .goog-option-selected:hover {border: 0px solid #000 !important; color: #EDD !important;}'
  +
  '.goog-menuseparator {display: none;}'
  +
  '.goog-menuitem-group .goog-menuitem, #gt-tl-gms-menu .goog-menuitem-group .goog-menuitem:hover, .goog-menuitem-emphasize-highlight, .goog-menuitem-emphasize-highlight:hover, #gt-sl-gms-menu .goog-menuitem-group .goog-option-selected:hover, .goog-option-selected:hover, #gt-sl-gms-menu .goog-menuitem-group .goog-menuitem, #gt-tl-gms-menu .goog-menuitem-group .goog-menuitem, #gt-sl-gms-menu .goog-menuitem, #gt-tl-gms-menu .goog-menuitem:hover, goog-menuitem-group:hover {border: 0px solid #000 !important;}'
  +
  '#gt-src-wrap div textarea:focus, #gt-src-wrap div textarea {background-color: transparent !important; border: 0px none #000 !important;}'
  +
  '#gt-sl-gms-menu, #gt-tl-gms-menu {background: #553230 !important;}'
  +
  '._Oj div:nth-child(1), ._yf,  {background: none repeat scroll 0% 0% #292424 !important; border-bottom: 0px none #000 !important;}'
  +
  '._Bmb {visibility: hidden; background: none repeat scroll 0% 0% rgba(0, 0, 0, 0) !important;}'
  +
  '._Vkb span, ._Vkb span a {color: #EDD !important;}'
  +
  '._YR .jfk-textinput, ._Ai .jfk-textinput, ._Ai select, ._Ai div select {background: rgba(42, 24, 24, 1) !important; border: 1px solid #530505 !important; color: #EDD !important;}'
  +
  '.jfk-button-action:focus {box-shadow: 0px 0px 0px 1px rgba(143, 27, 27, 1) inset;}'
  +
  '.bottom-wrapper .appbar_b {border-bottom: 0px none #000;}'
  +
  '.bottom-wrapper div:nth-of-type(2) {border-bottom: 0px none #000 !important;}'
// PRODUCTS
  +
  '#corp-crumb, #maia-header, #maia-footer-global {background: #2F2F2F !important; border-bottom: 0px solid #000 !important;}'
  +
  '.products-section h2 {border-bottom: 1px solid rgba(62, 17, 17, 1);}'
  +
  'products-section ul, .break p, .products-section p {color: #EDD !important;}'
  +
  '#maia-footer-local {background: none repeat scroll 0% 0% rgba(38, 23, 23, 1); border: 0px solid #000 !important;}'
  +
  '.maia-notification {background: rgba(62, 17, 17, 1); border: 0px solid;}'
  +
  '#maia-footer-global {border-top: 0px solid #000;}'
// PRIVACY & ABOUT
  +
  '#about-initiatives, #about-latest-doodle img, .maia-article img, .students-section img, .jobs-photos img {opacity: .7;}'
  +
  '#about-ten-things h3, #about-corp-sites div h3, #about-corp-sites h3, #about-main h3, #about-mission blockquote {color: rgba(132, 17, 17, 0.95) !important;}'
  +
  '#about-mission {border-bottom: 1px solid rgba(69, 10, 10, 1);}'
  +
  'div#corp-crumb li {color: #EDD;}'
  +
  '.maia-search input[type="text"]:focus, .maia-search input, .maia-search input[type="text"]:hover, .maia-search input[type="text"], .maia-search input, #filter-cat, #filter-lang, #filter-reg {color: #EDD; background: #282828 !important; border-color: rgba(117, 26, 11, 1); border-width: 1px ;border-style: solid; border-right: 1px solid #741919; border-color: rgba(116, 25, 25, 1) rgba(117, 24, 24, 1) rgba(117, 26, 26, 1) !important;}'
  +
  '#maia-nav-y li, .press-directory li {border: 0px solid rgba(84, 17, 9, 1); border-bottom: 1px solid rgba(84, 17, 9, 1);}'
  +
  '.maia-promo, .maia-aside {background: none repeat scroll 0% 0% rgba(69, 18, 9, 1); border-color: rgba(99, 18, 9, 1);}'
  +
  '.maia-super, .press-releases a, .press-images-title strong, .press-directory-title a {color: #541109 !important;}'
  +
  '.frame .goog-zippy-expanded a {background: none repeat scroll 0% 0% #451209 !important; border: 1px solid #631209 !important;}'
  +
  '.frame .goog-zippy-collapsed a {background: none repeat scroll 0% 0% rgba(45, 35, 33, 1); border: 1px solid rgba(68, 29, 19, 1);}'
  +
  '.nae {background-color: #1B1715 !important;}'
  +
  '.jobs-home-main {background: none repeat scroll 0% 0% rgba(45, 25, 25, 1);}'
  +
  '.jobs-home-main h1 {text-shadow: 0px 1px 1px rgba(24, 12, 12, 1);}'
  +
  '.jobs-stories-container, .gweb-pagination {background: none repeat scroll 0% 0% #530F0F !important;}'
  +
  '.jobs-stories-container div:first-child {background: #1B1715;}'
  +
  '.gweb-pagination-nav {border-top: 1px solid #530F0F;}'
  +
  '.gweb-pagination-nav ul, .jobs-topstory img {border-color: rgba(0,0,0,0) !important; !important; border: 0px solid; margin-top: 6px;}'
  +
  '.jobs-topstory-desc {border-bottom: 1px dashed #591919;}'
  +
  '.jobs-topstory img, .maia-signature {opacity: .75;}'
  +
  '.jfk-bubble {background-color: rgba(122, 9, 9, 1); border-color: rgba(186, 31, 31, 1) #BA1F1F #BA1F1F !important;}'
  +
  '.jfk-bubble-arrowleft .jfk-bubble-arrowimplafter, .jfk-bubble-arrowright .jfk-bubble-arrowimplafter {border-color: transparent #7A0909 !important;}'
  +
  '.jfk-bubble-closebtn:focus {border: 1px solid #7A0909 !important;}'
  +
  '.policies-video {border: 1px solid rgba(122, 19, 19, 1);}'
// CAREERS
  +
  '.info-bar {background-color: #A53412; border: 1px solid rgba(152, 24, 24, 0.8);}'
  +
  '.kd-button, .kd-button:hover, .kd-button:focus, .kd-button .small .left .selected {background-color: rgba(53, 11, 11, 1); background-image: -moz-linear-gradient(center top , rgba(152, 15, 15, 1), rgba(134, 18, 18, 1)); border: 1px solid rgba(152, 24, 24, 0.8);}'
  +
  '.garage-scroll, .garage-center, .garage-main-content {background: none repeat scroll 0% 0% #1B1715 !important;}'
  +
  '.sr-content {color: #777;}'
  +
  '.garage-main-content, .garage-main-content a {color: #EDD !important;}'
  +
  '.greytext panel-title {background: #1B1715 !important;}'
  +
  '.corp-crumb {background: none repeat scroll 0% 0% #393939 !important; color: #EDD !important; border-bottom: 0px solid #000 !important;}'
  +
  '.maia-footer-local {background: none repeat scroll 0% 0% #261717 !important;}'
  +
  '.maia-footer-global, .garage-footer {background: #2F2F2F !important; border-top: 0px solid #000 !important;}'
  +
  '.centered, .loggedout-main, .loggedout-secondary {background: rgba(68, 16, 16, 1) !important; border: 0px solid #000 !important; color: #EDD !important;}'
  +
  '.loggedout-secondary, .person-connection-images img {opacity: .85;}'
  +
  '.kd-appbar, .panel-title {background: #393939; color: #EDD;}'
  +
  '.panel-title-deco {display: none;}'
  +
  '.garage-center {border-left: 0px solid #000 !important;}'
  +
  '.gadget, .filter-title, .filter-title div, .filter-title a, .filter-title div a {border-color: rgba(140, 54, 54, 1) rgba(96, 18, 18, 1) -moz-use-text-color; background: none repeat scroll 0% 0% rgba(48, 48, 48, 1) !important; color: #EDD important;}'
  +
  'a.title.heading, a.title.heading a {color: rgba(87, 27, 27, 1) !important; border: 0px solid #000;}'
  +
  '.gadget .title {background-color: rgba(126, 110, 110, 1); background-image: -moz-linear-gradient(center top , rgba(99, 52, 52, 1), rgba(101, 39, 39, 1)); border: 0px solid #000 !important;}'
  +
  '.source, .source:hover {color: rgba(153, 27, 0, 1);}'
  +
  '.centered {padding-top: 8px !important;}'
  +
  '.kd-appbar {border-bottom: 1px solid rgba(77, 15, 15, 1) !important;}'
  +
  '.navigation, .title .heading {color: #EDD;}'
  +
  '.fakecheckbox, .kd-button, .kd-button .mini {border-bottom: 1px solid #8C3636 !important;}'
  +
  '.primary-filters input.ghost-text[type="text"], .primary-filters input.ghost-text[type="text"]:hover, .primary-filters input.ghost-text[type="text"]:focus, .primary-filters input[type="text"]:focus {background: #323232 !important; border: 1px solid #8C3636 !important; color: #EDD !important;}'
  +
  '.filter-title {border-bottom: 1px solid #601212;}'
  +
  '.corp-crumb ol li:nth-child(3), .kd-count, .kd-count span, .kd-buttonbar .mid {color: #922222 !important;}'
  +
  '.kd-button.selected, .kd-button .small .disabled, .kd-button:first-child {background-color: rgba(131, 15, 15, 1); background-image: -moz-linear-gradient(center top , #980F0F, #861212); border: 1px solid #951717;}'
  +
  '.kd-menulist.offset, .kd-menulist.offset a, .kd-menulistitem {background: #363434; color: #EDD !important;}'
  +
  '.kd-menurule {border: 1px solid rgba(108, 16, 16, 0.25) !important}'
  +
  '.maia-tabset-contents {background: none repeat scroll 0% 0% rgba(32, 23, 23, 1);}'
  +
  '.jobs-locations-list ul ul {border-left: 1px dashed rgba(75, 17, 17, 1);}'
  +
  '.maia-tabset-horizontal .maia-tabset-nav ul, .maia-tabset-horizontal .maia-tabset-nav ul, #location-tabs {background: -moz-linear-gradient(center top, rgba(75, 16, 16, 1) 0%, rgba(65, 14, 14, 1) 100%) repeat scroll 0% 0% transparent; border: 0px solid #000 !important;}'
  +
  '.maia-tabset-nav-active, maia-tabset-nav-active a, .maia-tabset-nav li.maia-tabset-nav-active a {background-color: rgba(110, 23, 23, 1) !important; border: 0px solid #000 !important;}'
  +
  '#jobs-map, #jobs-locations {border: 1px solid rgba(71, 14, 14, 1); box-shadow: 0px 1px 5px #541515;}'
  +
  '.maia-tabset-nav, location-tabs li, .maia-tabset-horizontal .maia-tabset-nav li, .maia-tabset-contents {border: 0px solid #000 !important;}'
  +
  '#jobs-map:before {content: "If this does not display, try disabling Dark BG Bodies (not recommended)."}'
  +
  '.jobs-teams li {border-bottom: 1px solid #751A1A !important; border-color: #751A1A !important}'
  +
  '.jobs-teams ul li {border-color: #751A1A !important;}'
  +
  '.jobs-life-hiring {border-left: 1px dashed #751A1A !important;}'
  +
  '.gweb-pagination-content img {opacity: .8;}'
// OLD GOOGLE (LANG. SPECIF.)
  +
  '.lst {background: #393939 !important; border: 1px solid #721414 !important; padding: 4px 4px 4px 6px !important; color: #B2B2B2 !important;}'
  +
  '.lsbb, .lsb {border-color: rgba(191, 43, 43, 1) rgba(176, 37, 37, 1) rgba(138, 31, 31, 1) rgba(144, 32, 32, 1); background: -moz-linear-gradient(center top , #B44422, #A43311) repeat scroll 0% 0% transparent !important; color: #EDD !important;}'
  +
  '#fll a {color: #A41D10 !important; text-shadow: 1px 1px 2px rgba(70, 18, 15, 0.92);}'
  +
  '.ts tbody tr td a img {opacity: .8;}'
  +
  '.ts, .bdr {background: #1B1715; !important; border: 0px solid; border-color: rgba(191, 43, 43, 1) rgba(176, 37, 37, 1) rgba(138, 31, 31, 1) rgba(144, 32, 32, 1);}'
  +
  '.ts input, .bdr input, #numsel, .bdr select {background: #393939; color: #EDD !important;}'
  +
  '.bdr input, .bdr select {border: 1px solid; border-color: rgba(191, 43, 43, 1) rgba(176, 37, 37, 1) rgba(138, 31, 31, 1) rgba(144, 32, 32, 1);}'
  +
  '#ssform tr, .ts td, .ts td b {background: #1B1715 !important; border: 0px solid #000; color: #EDD !important;}'
  +
  'table.ts, .footer a {border-top: 0px solid #000 !important; color: #A41D10 !important; text-shadow: 1px 1px 2px rgba(70, 18, 15, 0.92); text-decoration: none !important;}'
  +
  '#hplogo div {color: #A42320 !important;}'
  +
  '.bottom-wrapper div:nth-of-type(2) {background: none repeat scroll 0% 0% rgba(41, 36, 36, 1) !important; border-bottom: 0px none #000;}'
  +
  '._Mib {border-top: 1px solid rgba(83, 5, 5, 1) !important;}'
  +
  '.bottom-links-wrapper {background-color: rgba(21, 15, 15, 1) !important;}'
  +
  '.bottom-links a {color: #A41D10 !important; text-shadow: 1px 1px 2px rgba(70, 18, 15, 0.25);}'
  +
  '.jfk-scrollbar .bottom-wrapper div:nth-of-type(2) {background: none !important;}'
  +
  '._yf label {color: #EDD;}'
  +
  '.sfbgg {background: none repeat scroll 0% 0% #1B1715 !important; border-bottom: 0px none #E5E5E5;}'
  +
  '.images_table img {border: 1px solid rgba(93, 19, 19, 1); opacity: .8;}'
  +
  '.csb {opacity: .75;}'
  +
  '#mn tbody tr:nth-of-type(3) td:nth-of-type(1) div, #mn tbody tr:nth-of-type(3) td:nth-of-type(3) div, .tn {border-bottom: 1px solid rgba(75, 25, 25, 1) !important;}'
  +
  '.ds {border-right: 0px none #902020;}'
  +
  '.lsbb:hover, .lsb:hover, .lsbb:focus, .lsb:focus {border: 1px solid rgba(147, 23, 20, .8) !important;}'
  +
  '.lst-a, .lst-a:hover, .lst-a:focus {background: none repeat scroll 0% 0% #393939; border-width: 0px; border-style: solid; border-right: 0px solid #000; border-color: none;}'
  +
  '.ts td b, ._Bmc a, #fll a, #bfl a {color: #A41D10 !important;}'
  +
  '.gbts, #gbi4i {opacity: 0.9;}'
  +
  '.gbgsc, .category-img {opacity: 0.8;}'
  +
  '.carousel-container--processed + .footer-links-container {background-color: #1B1715;}'
  +
  '.primary-footer .carousel-countainer {background-image: -moz-linear-gradient(center top , #481B1B 0%, rgba(194, 154, 154, 0) 100%), -moz-linear-gradient(center bottom , #EEE 0%, rgba(215, 196, 196, 1) 100%); background-color: #F5F5F5;}'
  +
  '.carousel-container--processed {background: rgba(50, 9, 9, 1);}'
  +
  '.hcfe .accordian-homepage-title {background-color: rgba(120, 20, 20, 1);}'
  +
  '.accordion-homepage > .parent {background-color: rgba(68, 64, 64, 1) !important; border-bottom: 1px solid rgba(96, 21, 21, 1);}'
  +
  '.accordion-homepage > .parent:first-of-type {border-top: 1px solid rgba(111, 22, 22, 1);}'
  +
  '.accordion-homepage .parent, .goog-zippy-collapsed, .goog-zippy-header {background-color: #393330 !important;}'
  +
  '.parent a h3 {color: #A42320 !important;}'
  +
  '.esc-separator {background-color: rgba(0,0,0,0) !important;}'
  +
  '.floating-extension-wrapper {border-left: 1px solid rgba(95, 18, 18, 1) !important;}'
  +
  '.esc-thumbnail-wrapper .esc-thumbnail-image {border: 1px solid rgba(78, 18, 18, 1);}'
  +
  '.gpost-bubble {border: 1px solid rgba(81, 13, 13, 1) !important;}'
  +
  '#settings-button, .jfk-button-standard, .gpost-body-text span, .sg table.sports-menu td.tab, .goog-inline-block .jfk-button-label {color: #EDD !important;}'
  +
  '.esc-lead-article-title a, .esc-layout-table .article, .esc-lead-article-title .article, .story .title .article, .small-story .title .article, .weather-providers .article, .al-link-wrapper .article {background-image: none !important; background-color: #292525; color: #EDD;}'
  +
  '.media-strip .media-strip-image {border: 1px solid #4E1212;}'
  +
  '.basic-title .text {background: none repeat scroll 0% 0% #841111 !important;}'
  +
  '.sg table.sports-menu td.tab {border-color: rgba(99, 20, 20, 1) #631414 -moz-use-text-color;}'
  +
  '.sg table.sports-menu {border-bottom: 1px solid #631414; color: #EDD !important;}'
  +
  '.sg .show-more {background-color: rgba(89, 12, 12, 1);}'
  +
  '.epg .source-preference-text {background-color: #841111; color: #EDD !important;}'
  +
  '.epg .source-preference-table {border: 1px solid #631414 !important;}'
  +
  '.media-strip-image-item-tooltip .title-text, .title .titletext, .al .al-link-wrapper .titletext {color: #A42118 !important;}'
  +
  '.esc-body .titletext, .wg .forecast-day-today, .esc .entity-annotation-promote-button, .esc .entity-annotation-demote-button {color: #A7271F !important;}'
  +
  '.wg .forecast-day, .entity-annotation-text, .entity-annotation-text .entity-name, .al .al-snippet-text, .jfk-button-label {color: #EDD;}'
  +
  '.media-strip-separator-cell .separator {border-left: 1px solid rgba(111, 25, 25, 1) !important;}'
  +
  '.media-strip .media-strip-video, .media-strip .media-strip-image {border: 1px solid rgba(194, 29, 29, 1) !important;}'
  +
  '#main-wrapper .footer {max-width: 100% !important;}'
  +
  '.in-header #appbar, .yesscript #appbar {background: none repeat scroll 0% 0% #393939;}'
  +
  '.content-header .header-table {background-color: #410909;}'
  +
  '.gadget .dsg .separator, .share-box .bubble-arrow, .share-box .bubble-arrow-left-icon {display: none;}'
  +
  '.dsg .share-box-wrapper .share-box {border: 1px solid #6C1818; color: #666;}'
  +
  '.goog-flat-menu-button.goog-flat-menu-button-focused, .main-appbar .goog-flat-menu-button {border-color: #711919; color: #EDD;}'
  +
  '.rcp .goog-menu, #anchorman-edition-menu {background: #553230 !important;}'
  +
  '.browse-links {border-bottom-color: rgba(105, 25, 25, 1);}'
  +
  '.sidebar .clustersearch-box .clustersearch-label, .clustersearch-box .q {background-color: rgba(65, 23, 23, 1); border: 1px solid rgba(108, 18, 18, 1) !important;}'
  +
  '.clustersearch-submit {background: rgba(101, 15, 15, 1) !important; border: 1px solid rgba(108, 18, 18, 1) !important;}'
  +
  '.clustersearch-label {margin-bottom: 6px !important;}'
  +
  '#story-articles .topic {background: none repeat scroll 0% 0% #292525 !important;}'
  +
  '.footer #pagination {opacity: .75;}'
  +
  '.story .thumbnail img {border: 1px solid rgba(78, 11, 11, 1); opacity: .8;}'
  +
  '.thumbnail .article {background-image: none !important; background-color: #292525;}'
  +
  '.sports-score-row-rest {border-bottom: 0px none #000;}'
  +
  '.sg .sports-score-row-rest {border-bottom: 1px solid rgba(137, 37, 37, 1);}'
  +
  '.sg .sports-score-row-first {border-top: 1px solid #892525; border-bottom: 1px solid #892525;}'
  +
  '.sg .sports-gadget-layout-table td:hover {background: #433 !important;}'
  +
  '.gadget .title {background-color: #303030 !important; background-image: none !important;}'
  +
  '.title .article {background-color: #303030 !important;}'
  +
  '.gadget-wrapper h2.text .title {background-color: #841111 !important;}'
  +
  '.weather-providers .titletext, .weather-providers .titletext a {background-color: #303030; color: #EDD !important;}'
  +
  '.story .title .article, .small-story .title .article {background-color: #292525 !important;}'
  +
  '#contentPane .Lsc {background-color: rgba(90, 44, 36, 1); color: #EDD;}'
  +
  '.result tbody tr td span {color: #A43330 !important;}'
  +
  '.result tbody tr td {color: #EDD;}'
  +
  '#search form div h1, #first_row div, #first_row div h4, #first_row {color: #EDD !important;}'
  +
  '.kd-whiteRuled {border-top: 1px solid rgba(84, 27, 27, 1);}'
  +
  '.bar_blue, .kd-content-sidebar li a:hover {background-color: rgba(113, 29, 15, 1);}'
  +
  '#first_row div table tbody tr td, .bd-buttonbar .kd-button, .bd-buttonbar .kd-button:hover {color: #EDD;}'
  //+
  //'#center_col {position: absolute; left: 160px; top: 28px;}'
  +
  '.result img {opacity: .8; border: 1px solid rgba(89, 14, 14, 1) !important;}'
  +
  '.privacy-videos object, .privacy-videos iframe {border: 1px solid rgba(110, 17, 17, 1);}'
//PHOTOS (PAGE) & CALENDAR
  +
  '.iph-dialog, .iph-dialog:focus {background: #2D2B2B !important; border: 1px solid rgba(89, 11, 11, 1) !important;}'
  +
  '.iph-dialog-title, .iph-dialog-title a, .EAzCCd, .clb, .IUc, .d-k-l, .SBb {color: #EDD !important;}'
  +
  '.iph-dialog button:hover {border: 1px solid rgba(89,11,11,1);}'
  +
  '.iph-dialog-pointer-up {opacity: .5;}'
  +
  '.RpghWd a, .RpghWd img, .igpJ3, .QLb, .ntb, .Dz {opacity: .8;}'
  +
  '.Dtc {border-left: 1px solid rgba(191,43,43,1);}'
  +
  '.w7b {border-right: 1px solid rgba(102,15,15,1);}'
  +
  '.Itc {background-color: rgba(46, 45, 45, .95); border: 1px solid rgba(89, 11, 11, 1);}'
  +
  '.FOb, .LOb {background-color: rgba(108, 20, 20, 1);}'
  +
  '.mtb {background-color: #2D2B2B !important;}'
  +
  '.EOb {color: rgba(102,15,15,1);}'
  +
  '.u4a, .d-s, .d-s:focus, .d-s:hover, .d-s:active {color: #EDD !important;}'
  +
  '.xr {color: rgba(108, 20, 20, 1) !important;}'
  +
  '.mJd, .TOb {background-color: #851616 !important; background: #851616; background: -moz-linear-gradient(top, #851616 0%, #851616 100%);}'
  +
  '.HBb, .WSb {border-top: 0px solid #000 !important; border-bottom: 0px solid #000 !important;}'
  +
  '.Gmc {background-color: rgba(84, 38, 38, 1);}'
  +
  '.gbqfqwb, .gbqfwf, .gbqfwf:focus {background: #393939 !important; background-color: #393939 !important; border-right: 1px solid #842213;}'
  +
  '.f a:link, #reauthEmail, ._SWb a.fl, .fl a, .f {color: rgba(195, 174, 174, 1) !important;}'
  +
  '._IId, ._uOc {color: #842213 !important; font-weight: bold;}'
  +
  '.qJd {opacity: .8;}'
  +
  '.caloobedlgc, #mb0, #mb1 {background: rgba(60, 11, 11, 1);}'
  +
  '.caloobedlgsm {opacity: .8;}'
  +
  '.jfk-button-action, .jfk-button-action:focus, .jfk-button-action:active, .caloobeok .jfk-button .jfk-button-action, .jfk-button:focus, .jfk-button:active {border-color: 1px solid #72190B; border: 1px solid #72190B;}'
  +
  '.caloobedlg-bg, .caloobedlg-bg {background: none repeat scroll 0% 0% rgba(27, 19, 19, 0.7) !important;}'
  +
  '.caloobedlg {background: none repeat scroll 0% 0% #000 !important; border: 1px solid #641713 !important;}'
  +
  '#vr-nav, #mainnav {background: none repeat scroll 0% 0% #1B1715; border-bottom: 0px solid #EBEBEB;}'
  +
  '#mb0, #mb1 {border: 0px solid #000;}'
  +
  '.lk, .lk a {color: rgba(183, 32, 7, 1) !important;}'
  +
  '.dpdiv, #dp_0_tbl, calHeader, calHeader:focus, calHeader:hover, #clst_my, #clst_fav, .dp-weekendh {color: #EDD !important; background: none repeat scroll 0% 0% rgba(56, 22, 20, 1);}'
  +
  '#dp_0_tbl td, .dp-monthtable, .dp-days {background: #642220 !important; color: #EDD !important;}'
  +
  '.goog-menu {background: #1B1715 !important; border: 1px solid #642220;}'
  +
  '.goog-menuitem, .goog-menuitem:hover {background: #553230 !important; color: #EDD !important;}'
  +
  '.trans-strip {display: none;}'
  +
  '.ca-evp5.rb-ro-35.rb-n, .ca-evp7.rb-ro-35.rb-n, .ca-evp10.rb-ro-35.rb-n, .ca-evp14.rb-ro-35.rb-n, .ca-evp12.rb-ro-35.rb-n, .ca-evp15.rb-ro-20.rb-n, .ca-evp16.rb-ro-20.rb-n, .ca-evp17.rb-ro-20.rb-n, .ca-evp18.rb-ro-20.rb-n .goog-imageless-button {background-color: rgba(218, 167, 167, 1) !important; color: #EDD; border: 1px solid #851616;}'
  +
  '.wk-weektop, .wk-dummyth, .wk-dayname, .wk-allday, .tg-times-pri, .tg-times-sec {background-color: #393939 !important; border-top: 0px solid #000; color: #EDD !important;}'
  +
  '.tg-col, .tg-weekend, .tg-col-eventwrapper {backgound-color: #312626 !important; border: 1px solid #642220;}'
  +
  '.tg-time-pri, .wk-scrolltimedevents, .tg-timedevents {border-color: transparent !important; border-left: 0px solid #000; border-bottom: 0px solid #000;}'
  +
  '.tg-col, .tg-weekend, .tg-col-eventwrapper, .st-bg-table, .st-bg, .st-bg-fc {background: #312626 !important;}'
  +
  '#weekViewAllDayBgwk {border-color: rgba(140, 23, 23, 1);}'
  +
  '.tg-times-pri, .tg-times-sec {border-left: 0px solid #000;}'
  +
  '#gridcontainer, .goog-inline-block {background: transparent !important;}'
  +
  '.bubblemain, .bubble {background: none repeat scroll 0% 0% rgba(62, 6, 6, 1); border: 1px solid rgba(84, 8, 8, 1) !important;}'
  +
  '.goog-imageless-button, .goog-flat-menu-button {background-color: rgba(164, 18, 18, 1) !important; border: 1px solid #643330; color: #EDD;}'
  +
  '.textbox-fill-input, .mv-container, .mv-dayname {background-color: #393939; border: 0px solid #000; color: #EDD !important;}'
  +
  '.prong-lt, .prong-dk, .bottom-prong, .st-dtitle, .st-dtitle-fr, .st-dtitle-fc, .st-dtitle-nonmonth {border-color: rgba(84, 8, 8, 1) !important;}'
  +
  '.listv {background: none repeat scroll 0% 0% rgba(65, 53, 53, 1);}'
  +
  '.lv-lastevent {background: none repeat scroll 0% 0% rgba(69, 40, 40, 1);}'
  +
  '.lv-alt {background: none repeat scroll 0% 0% rgba(57, 52, 52, 1);}'
  +
  '.lv-lastevent .lv-eventcell, .lv-datecell, .mv-event-container {border-bottom: 0px solid #000; border-right: 0px solid #000; border-top: 0px solid #000;}'
  +
  '.lv-up, .lv-down {opacity: .7;}'
  +
  '.st-bg-table, .st-bg, .st-bg-fc {background: #312626; border-left: 0px solid #000;}'
  +
  '.st-dtitle, .st-dtitle-fr, .st-dtitle-fc, .st-dtitle-nonmonth {background: rgba(64, 12, 10, 1) !important; color: #EDD;}'
  +
  '.goog-imageless-button-focused, .goog-imageless-button-focused:focus, .goog-imageless-button-focused:active, .goog-imageless-button-focused:hover {border: 1px solid rgba(164, 18, 18, 1);}'
  +
  '#sbody {background: rgba(83, 43, 43, 1) !important; border-top: 2px solid rgba(0, 0, 0, 0) !important;}'
  +
  '.centered {background: none repeat scroll 0% 0% rgba(41, 37, 37, 1) !important;}'
  +
  'section-stream-content {background: #000 !important;}'
  +
  '.pinning-enabled .left-nav-pinned, .anchorman-blended-story, .blended-wrapper {background: #292525;}'
  +
  '.basic-title, .basic-title .text, .esc-separator {background: #392220; color: #EDD !important;}'
  +
  '.titletext {color: #643330 !important;}'
  +
  '.promo-container {background-color: rgba(65, 9, 9, 1); border: 1px solid rgba(108, 24, 24, 1); color: #EDD !important;}'
  +
  '.rt-col .basic-title, .basic-title {background-color: rgba(132, 17, 17, 1); border-bottom: 1px solid rgba(60, 4, 4, 1);}'
  +
  '.wg .weather-gadget-title {border-bottom: 1px solid rgba(108, 24, 24, 1) !important;}'
  +
  '.media-strip-image-item-tooltip, .media-strip-video-item-tooltip {background-color: rgba(38, 12, 12, 1); border: 1px solid #392220;}'
  +
  '.epg .stories-wrapper, .epg .logo-strip-table-wrapper {border: 0px solid #000; border-color: rgba(0,0,0,0);}'
  +
  '.jfk-button-standard, .jfk-button-standard:hover, .gb-button-callout-hilite, .search-inputs .submit, .TI .Ss, .T-I-atl, .TI .T-I-ax7:focus, .J-J5-Ji, .TI .aCI, #:kn.ok, .T-I J-J5-Ji, .T-I-atl, .L3, .G-atb .T-I-ax7 {background-color: rgba(117, 23, 23, 1) !important; background-image: -moz-linear-gradient(center top , rgba(165, 22, 22, 1), rgba(117, 19, 19, 1)) !important; border: 1px solid rgba(114, 9, 9, 1) !important;}'
  +
  '.search-inputs .text, .search-input-text {background: #393939 !important;}'
  +
  '.search-input-text {border-width: 0px;}'
  +
  '.search-input-submit, .search-inputs {border: 1px solid rgba(120, 30, 30, 1); background: none !important;}'
  +
  '.group-research, .group-webstore, .dI:focus, select {border: 1px solid rgba(129, 29, 13, 1);}'
  +
  '.baseline a {color: rgba(129, 29, 13, 1) !important;}'
  +
  '.aAU, #loading, .Kj-JD-Jh {background: #292929 !important;}'
  +
  '.e {color: #842220 !important;}'
  +
  '.Kj-JD aYZ, .aYZ, .Kj-JD {background: none repeat scroll 0% 0% padding-box rgba(74, 21, 21, 1) !important; border: 1px solid rgba(129, 10, 10, 1) !important;}'
  +
  '.aY6 {color: #EDD !important;}'
  +
  '.aY4 {opacity: .8;}'
  +
  '.T-I-atl, .T-I-atl:focus, .G-atb .T-I-ax7, .TI .aCI, .T-I-ax7:focus, .T-I-ax7:active, .T-I-ax7:hover, .T-I-ax7 {background-color: rgba(189, 52, 30, 1) !important; background-image: -moz-linear-gradient(center top , rgba(225, 15, 0, 1), rgba(171, 37, 15, 1)) !important; border: 1px solid rgba(230, 36, 13, 1) !important;}'
  +
  '.b8 .vh {border-color: rgba(209, 41, 13, 1) !important; background-color: rgba(168, 35, 6, 1) !important;}'
  +
  '.qZ {border-bottom: 1px solid rgba(180, 13, 13, 1) !important; background: #282828;}'
  +
  '.no, .aeJ {background: #393939 !important;}'
  +
  '#lpt, .J-M {background-color: rgba(173, 39, 17, 1);}'
  +
  '.r4 {background-color: rgba(42, 38, 38, 1) !important;}'
  +
  '.v .fY, .TN:hover {background-color: #643330 !important;}'
  +
  '.dt, .sA {color: #842320 !important;}'
  +
  '.v .f1 {background: #643330 !important;}'
  +
  '.qK, .Vb, .J-Z {background: rgba(126, 57, 57, 1) !important;}'
  +
  '.cf tr td {border-color: -moz-use-text-color -moz-use-text-color rgba(101, 0, 0, 1);}'
  +
  '.r7 td.r8, .r7 td.r9, .dI, .dI:focus {border-color: -moz-use-text-color -moz-use-text-color rgba(99, 9, 9, 1) !important;}'
  +
  '.Am, .Al, .Ar, .Au, .As, .v9 input, .sE, .sG, .Vf, .qL, #stb {background: #4D2A2A !important; color: #EDD;}'
  +
  '.J-M, .asi, .SK, .J-M a, .asi a, .SK a {border: 1px solid #643330 !important; background: rgba(133, 29, 27, 1) !important;}'
  +
  '.J-N, .J-N a {color: #EDD !important;}'
  +
  '.aj5.J-KU-Jg, .J-KU-Jg, .aj5.J-KU-Jg, .um {border-top: 0px solid #000 !important; border-bottom: 0px solid #000 !important; background: transparent;}'
  +
  '.p4a {background-color: rgba(65, 19, 19, 1); border-color: rgba(168, 17, 17, 1);}'
  +
  '.cE {background-color: rgba(53, 30, 30, 1); border-color: rgba(168, 17, 17, 1);}'
  +
  '.aAU {background: #000;}'
  +
  '.wk-full-mode .wk-today {background: none repeat scroll 0% 0% rgba(152, 25, 25, 1) !important; border-left: 1px solid #981919; border-top: 1px solid #981919; border-right: 1px solid #981919 !important;}'
  +
  '.wk-full-mode .wk-tomorrow {border-left: 1px solid #981919 !important;}'
// DRIVE & GMAIL
  +
  '.header, .aKm {background: #393939; border-bottom: 1px solid rgba(90, 15, 15, 1);}'
  +
  '.cta a, .gb-button-callout-hilite {background-color: rgba(117, 23, 23, 1) !important; background-image: -moz-linear-gradient(center top, rgba(165, 22, 22, 1), rgba(117, 19, 19, 1)) !important; border: 1px solid rgba(114, 9, 9, 1) !important;}'
  +
  '.devices {opacity: .8;}'
  +
  '.gbqfif, .a-La-jb-Kfa {color: #EDD !important;}'
  +
  '.J-KU-Jg-K9.aAA .J-KU-KO.aAy, .aAy.aKe-aLe.J-KU-KO, .aRz .J-KU, .aKk, .aKh .aPb {background: none repeat scroll 0% 0% rgba(167, 56, 56, 0.9) !important;}'
  +
  '.BltHke.nH.oy8Mbf.aE3 {background: #000;}'
  +
  '.um, .adl, .gK, .hP, .iw, .gD, .vC {color: #EDD !important;}'
  +
  '.F colgroup col, .cf colgroup col, .zt colgroup col, .F .cf .zt {background: #000 !important; background-color: #000 !important;}'
  +
  '.aDP {opacity: .72;}'
  +
  '.Bu {background: rgba(50, 32, 30, 1); color: #EDD !important;}'
  +
  '.adI, .amn, .nr, .aeS {background-color: #5C0F0F !important; border: 1px solid rgba(129, 26, 20, 1) !important; border-color: rgba(129, 26, 20, 1) !important;}'
  +
  '.a3s div, .a3s div div {background: #2C2C2C !important; border: 0px solid #000; border-right: 0px solid #000; border-left: 0px solid #000; border-bottom: 0px solid #000; border-top: 0px solid #000;}'
  +
  '.nr, .dI, .Ar, .tMHS5d, .amo, .amr {border-right: 0px solid #000 !important; border-width: 1px !important; border-color: #5C0F0F !important;}'
  +
  '.hx, .ie, .xu, .iq, .a-Nb-B {border-top: 0px solid #000 !important;}'
  +
  '.G-atb {border-bottom: 1px solid rgba(33, 14, 14, 1) !important;}'
  +
  '.nr, ._huc img, .ic-chart {display: opacity: .8;}'
  +
  '.hx .h7 .Bk .G2, .a-Za-Bb {border-color: rgba(107, 19, 19, 1) !important; border-bottom: 0px none rgba(107, 19, 19, 1); border-top: 0px none #000;}'
  +
  '.a-G-q-Ya {background: none repeat scroll 0% 0% rgba(32, 25, 25, 1);}'
  +
  '.a-w-Ra {background: #000;}'
  +
  '.a-La-jb-xc-ba-nb .d-xc-L {border-color: -moz-use-text-color -moz-use-text-color rgba(209, 35, 14, 1) !important;}'
  +
  '.a-G-q {border: 0px none #000 !important;}'
  +
  '.GY {background-color: #A43311 !important;}'
  +
  '.Gmc {background-color: #2D2B2B !important;}'
  +
  '.fjfe-recentquotes, #navmenu li, .fjfe-nav-item {background-color: #1B1715; color: #EDD;}'
  +
  '#navmenu li:hover, .fjfe-nav-item:hover, fjfe-nav-item a, fjfe-nav-item a:hover {background-color: #A43311 !important;}'
  +
  '.goog-tab-selected a.t b.t {background: none repeat scroll 0% 0% #1B1715 !important;}'
  +
  '#gf-foot {border-top: 1px solid rgba(71, 17, 17, 1); border-color: rgba(71, 17, 17, 1);}'
  +
  '.hdg:not(.top):not(.goog-tab-bar) {border-width: 0px medium medium !important; border-color: rgba(71, 17, 17, 1);}'
  +
  '.cta, .cta:hover {background: none repeat scroll 0% 0% transparent !important; border: 0px solid #A50E0E !important;}'
  +
 '.install-win {opacity: .8;}'
  +
  'h1.center {color: rgba(180, 19, 19, 1) !important;}'
  +
  '.a-i-h-ea-m, .a-i-h-ea, .a-i-h-ea-s, .a-i-h-oc > .a-i-h-ea-s > .a-i-h-ea-x, .a-i-h-ea-qc {background: none repeat scroll 0% 0% padding-box rgba(62, 40, 40, 1) !important; color: #EDD;}'
  +
  '.a-i-h-ud {background-color: rgba(36, 24, 24, 1) !important;}'
  +
  '.a-i-h-r-Ob {background: none repeat scroll 0% 0% rgba(21, 11, 11, 1) !important;}'
  +
  '.a-i-h-Bc-m > .j-ja-e, .a-i-h-bc-m > .j-ja-e {background-color: rgba(164, 49, 30, 1) !important;}'
  +
  '#init-spinner-container {background-color: #433 !important; background: #433 !important;}'
  +
  '.a-i-h-ea-x, .a-i-h-Tb-s-B, .a-i-h-s-Be, .a-i-h-s-x {color: #EDD !important;}'
  +
    // THE DESTROYER // '.a-i-h-vb-Ah {background-color: rgba(71, 20, 20, 1);'   +
  '.submit_as_link {color: #A22 !important;}'
  +
  '.a-i-h-Gb-Kb-e.a-i-h-Kb-e, .a-i-h-D-Kb-e.a-i-h-Kb-e {background-color: rgba(164, 34, 13, 1) !important;}'
  +
  '.f-e-ua, .j-Sa-jb, .f-e, .a-i-h-e-m > .f-e  {display: none; background-color: rgba(186, 40, 16, 1) !important; background-image: -moz-linear-gradient(center top , #BA2810, rgba(153, 32, 12, 1)) !important; border: 1px solid rgba(189, 39, 14, 1) !important;}'
  +
  '.a-gb-Ba {background-color: rgba(38, 32, 32, 1) !important;}'
  +
  '.a-Q-I {background-color: #282828 !important; border-top: 0px solid #000 !important; color: #EDD !important;}'
  +
  '.aKi {border-bottom: 1px none #000 !important;}'
  +
  '.aKm {background: none repeat scroll 0% 0% rgba(21, 19, 19, 0) !important; border-color: rgba(215, 215, 215, 0) !important;}'
  +
  '.yO {background: none repeat scroll 0% 0% rgba(59, 37, 37, 0.85) !important; color: #EDD !important;}'
  +
  '.zE {background: none repeat scroll 0% 0% rgba(74, 36, 36, 0.9) !important; color: #EDD !important;}'
  +
  '.x7 {background: none repeat scroll 0% 0% rgba(144, 67, 46, 1) !important; color: #EDD !important;}'
  +
  '.y2, .Dj, .md div, .mj div, .ma span span, .go {color: #A99 !important;}'
  +
  '.w-asV {margin-bottom: 0px !important;}'
  +
  '.gb_Sb:before, .aKo {background: none !important;}'
  +
  '.dI, .dI:focus, .nr, .nr:focus, .Ao, .dH input, .dH input:focus, .dH input:active {border: 1px solid rgba(74, 36, 36, 0.9) !important; background: #282828 !important;}'
  +
  '.J-KU-Jg-K9.aAA .J-KU-KO.aAy {background: none repeat scroll 0% 0% rgba(116, 22, 22, 0.9) !important;}'
  +
  '.aKk {opacity: .72;}'
  +
  '.amq img {opacity: 8;}'
  +
  '.T-ays {border: 1px solid rgba(80, 12, 12, 1) !important;}'
  +
  '.J-Kh {border-top: 1px solid rgba(104, 21, 21, 1) !important;}'
  +
  '.a3s div, .a3s div div {background: none repeat scroll 0% 0% #32201E !important; color: #EDD !important;}'
  +
  '.J-N-JT, .J-N-JW {background: #741410 !important;}'
  +
  '.nr, .tMHS5d, .amr {border-color: rgba(0,0,0,0) !important;}'
  +
  '.iH, .asa {border-top: none !important;}'
  +
  '.a3s table {border: 0px none #000 !important;}'
  +
  '.uq {border: 1px solid #A43330 !important;}'
  +
  '.air .CJ, .n4 {color: #EDD !important;}'
  +
  '.aJ7 .aI0, .aI0, .aJc {border-color: rgba(71, 22, 22, 0) !important;}'
  +
  '.v .fZ, .fZ, .fY div {background: rgba(152, 52, 52, 1) !important;}'
  +
  '.qK {border-width: 0px !important;}'
  +
  '#96:settings.J-N.aMU .J-N-Jz {display: none !important;}'
  +
  '.alO {background-color: #2A2626 !important;}'
  +
  '.alP, .alR, .l6, .l7, .l8 {color: #A43330 !important;}'
  +
  '.rZ {background-color: rgba(101, 9, 9, 1) !important;}'
  +
  '.alZ, #:kx input, .rU button, button#:4m, button#:4l {border: 1px solid rgba(140, 29, 29, 1) !important;}'
  +
  '.amb, .amc, .su, .al9 {display: none;}'
  +
  '.sb:after {content: "Themes are not available with Dark BG Bodies installed. Deactivate this Greasemonkey script to be able to select default Google themes here."; padding-bottom: 8px !important;}'
  +
  '.a-pa-mb-Wh-hk {border-left: 1px solid rgba(80, 11, 11, 1);}'
  +
  '.section-filetypes, .section-filesanywhere, .section-share, .section-download, .section-divider, .section-further, .section-apps, .section-intro {background: rgba(27, 23, 23, 1) !important; color: #DCC !important;}'
  +
  '.column-left.with-example .example, .static-example, .one-whole img {border-radius: 8px; opacity: .8;}'
  +
  '.nav-dark, .hoverable {background: #433 !important;}'
  +
  '.nav-dark .header:before, .nav-dark .header {background: none repeat scroll 0% 0% #393939 !important;}'
  +
  '.nav-dark nav .go-to-drive, .nav-light nav .go-to-drive, .nav-dark nav .go-to-drive:hover {background: none repeat scroll 0% 0% rgba(113, 37, 25, 1);}'
  +
  '.signature-wrapper #maia-signature, .signature-wrapper {background: none repeat scroll 0% 0% rgba(33, 25, 25, 0);}'
  +
  '.section-headline, .section-headline-large, .section-headline-gray, .heading-headline {color: #DCC !important;}'
  +
  '.tabs-tab {opacity: .8; border-color: rgba(87, 17, 17, 1); color: rgba(188, 164, 161, 1) !important;}'
  +
  '.section-divider {border-bottom: 1px solid rgba(72, 11, 11, 1);}'
  +
  '.hoverable .tabs-tab:hover {background: none repeat scroll 0% 0% rgba(156, 31, 17, 1); border-bottom-color: rgba(173, 48, 28, 1);}'
  +
  '.tabs-tab.tab-is-active, .tabs-tab.tab-is-active:hover {background: #622; border-bottom-color: rgba(155, 31, 11, 1);}'
  +
  '.hoverable .tabs-tab.tab-is-active:hover {background: #822 !important;}'
  +
  'p#google-apps, .VIpgJd-gqMrKb {display: none;}'
  +
  '.dropdown-trigger {background: none repeat scroll 0% 0% rgba(129, 29, 17, 1);}'
  +
  '.dropdown-wrapper .dropdown-list {background: none repeat scroll 0% 0% rgba(63, 56, 56, 1);}'
  +
  '.dropdown-list a {border-color: rgba(96, 16, 16, 1);}'
  +
  '.buttons-sprite, .dropdown-list .download-desktop a, .dropdown-list .download-android a, .dropdown-list .download-ios a {opacity: .8;}'
  +
  '#partner-logos {background: rgba(59, 11, 11, 1) !important;}'
  +
  '.section-get-started {margin: 0px 0px;}'
  +
  '.section-intro h2 {text-shadow: 1px 1px 2px rgba(48, 25, 25, 1);}'
  +
  '.jcJzye-tJHJj-ZMv3u {background: none repeat scroll 0% 0% rgba(92, 13, 13, 1); border-bottom: 1px solid rgba(111, 19, 19, 1);}'
  +
  '.N39BZd-PDZ57 ol {border-bottom: 1px solid rgba(105, 43, 43, 1);}'
  +
  '.N39BZd-PDZ57 ol li {background: none repeat scroll 0% 0% rgba(150, 30, 30, 1); border: 1px solid rgba(156, 44, 44, 1); color: #EDD;}'
  +
  '.N39BZd-Q4BLdf {background: none repeat scroll 0% 0% rgba(80, 23, 23, 1); border: 1px solid rgba(110, 25, 25, 1); color: #EDD;}'
  +
  '.f7jHSc, .f7jHSc strong, .IfAw2c, #marketingDiv h2, .De8GHd-bN97Pc h2, .VIpgJd-j7LFlb {color: #EDD !important;}'
  +
  '#signupDiv input[type="text"], #businessSize, #geo-select {background: #422; border-color: rgba(200, 32, 32, 1) rgba(191, 30, 30, 1) rgba(156, 25, 25, 1) !important; box-shadow: 0px 1px 2px rgba(104, 14, 14, 0.2) inset !important; color: #EDD;}'
  +
  '.x1bKod th, .x1bKod td {border-color: rgba(167, 15, 15, 1) rgba(150, 16, 16, 1); background: #533; color: #EDD;}'
  +
  '.tk3N6e-LgbsSe-JIbuQc, .tk3N6e-LgbsSe-JIbuQc:hover, .tk3N6e-LgbsSe-JIbuQc:focus {background-color: rgba(173, 33, 10, 1); background-image: -moz-linear-gradient(center top , #AD210A, rgba(131, 36, 15, 1)); border: 1px solid rgba(167, 37, 16, 1); color: #EDD;}'
  +
  '#marketingDiv div img, .a-v-yc-m {opacity: .8;}'
  +
  '.VIpgJd-xl07Ob, .VIpgJd-j7LFlb-sn54Q {background: none repeat scroll 0% 0% #653434;}'
  +
  '.action-card ul.dual-action li:first-child {border-right: 1px solid rgba(93, 9, 9, 1);}'
  +
  ':not(.a-T-Vf-da) > .a-T-F:hover {background-color: rgba(84, 17, 17, 1);}'
  +
  '.j-Sa-jb, .f-e {border: 0px none #000 !important;}'
  +
  '.k-v-wa-xa {background-color: rgba(72, 41, 41, 1);}'
  +
  '.k-v-wa-xa img {opacity: .8;}'
  +
  '.a-Ib-up-P, .j-Sa-jb, .j-ja-C-e-of, .Sc-vj, .j-C-yj {color: #EDD !important;}'
  +
  '.j-C, .a-eg-L-P {background: rgba(72, 41, 41, 1); color: #EDD !important;}'
  +
  '.j-K-rc .j-K-s,.j-K-ha .j-K-s {color: #433}'
  +
  '.j-K-rc, .j-K-rc:hover {background: rgba(80, 20, 20, 1) !important; color: #EDD !important;}'
  +
  '.j-qn {border-top: 1px solid rgba(132, 20, 20, 1);}'
  +
  '.yn-Bn .Sc-m {border-top: 1px solid rgba(84, 14, 14, 1) !important;}'
  +
  '.a-pa-mb-Wh-hk, .a-pa-mb-Wh-hk:hover, .a-pa-mb-Wh-hk:focus, .a-pa-mb-Wh-hk:active {border-left: 1px solid #540E0E;}'
  +
  '.f-ia {background-color: rgba(101, 40, 40, 1); border-color: rgba(146, 28, 28, 1) rgba(131, 22, 22, 1) rgba(140, 19, 19, 1);}'
  +
  '.Sc-na-Q, .Sc-df-t-H-Ca, .Sc-df-t a, .Sc-df-t-H-wk, .a-t-Q-L-m, .f-na, .j-N, .j-N-ha, .j-N-da, .a-eg-kc-wa, .k-q-fc-pj {color: #EDD !important;}'
  +
  '.a-t {background-color: rgba(60, 39, 39, 1) !important; color: rgba(225, 195, 195, 1) !important;}'
  +
  '.a-t-Ua {border-bottom: 1px solid rgba(53, 7, 7, 1) !important;}'
  +
  '.a-t-Q {background-color: rgba(86, 11, 11, 1); border-bottom: 1px solid #5F0E0E;}'
  +
  '.a-t-Q-wn:focus, .a-t-Q-wn:hover {background-color: rgba(156, 32, 32, 1);}'
  +
  '.a-t-F-da {background-color: rgba(120, 26, 11, 1);}'
  +
  '.a-e-Rc {border-right: 1px solid rgba(114, 23, 23, 1);}'
  +
  '.a-Sd-m {background-color: rgba(66, 9, 9, 1) !important; border-left: 1px solid rgba(98, 12, 12, 1) !important; border-top: 1px solid rgba(65, 5, 5, 1) !important;}'
  +
  '.j-K-rc, .j-K-ha {background-color:#433; border-color:#433;}'
  +
  '.a-Sd-N-I > .j-N-I {border-top: 1px solid rgba(119, 19, 19, 1);}'
  +
  '.w-u-m {background-color: #420909 !important;}'
  +
  '.j-N-I {background: none repeat scroll 0% 0% rgba(101, 47, 41, 1);}'
  +
  '.a-Sd-N-I > .j-N-I > .j-N.j-N-da > .a-N-tb-m > .a-N-tb {border-bottom: 4px solid rgba(190, 36, 22, 1);}'
  +
  '.a-Sd-N-I > .j-N-I > .j-N, .w-u-kc-La-dg-x, .a-pa-mb-td-Z-H-s, .a-pa-mb-Lf-H, .j-C a, .j-C-yj a, .j-C, .j-C-yj, .j-K, .j-K:hover, .j-qn, .j-qn:hover, .j-Rg, .j-Rg:hover, .j-K-rc, .j-C-yj, .f-na, .f-na-lm, .w-y-q-Q, .w-y-Iq, .w-y-q-m {color: #EDD !important;}'
  +
  '.k-q-vd-Rc {border-top: 1px solid rgba(107, 7, 7, 1);}'
  +
  'iframe #content, iframe #content table tbody tr td {background: none repeat scroll 0% 0% rgba(81, 37, 37, 1);}'
  +
  '.switcherItemActive {background-color: rgba(132, 26, 26, 1); border-left: 1px solid rgba(159, 16, 16, 1); border-bottom: 1px solid #9F1010; border-right: 1px solid #9F1010 !important;}'
  +
  '.colHead_0 tbody tr td {background-color: #443232 !important;}'
  +
  '.tblGenFixed td.hd {background-color: rgba(123, 25, 25, 1) !important;}'
  +
  '.tblGenFixed {border-bottom: 1px solid rgba(96, 13, 13, 1) !important;}'
  +
  '.rb-ub-zn-jd {background-color: rgba(89, 46, 46, 1); background-image: linear-gradient(45deg, rgba(81, 29, 29, 1) 25%, rgba(126, 43, 43, 1) 25%, transparent 75%, rgba(149, 73, 73, 1) 75%, rgba(113, 51, 51, 1)), linear-gradient(45deg, rgba(134, 32, 32, 1) 25%, rgba(168, 34, 34, 1) 25%, rgba(156, 26, 26, 1) 75%, rgba(129, 18, 18, 1) 75%, rgba(119, 25, 25, 1));}'
  +
  '.rb-ub-zn-jd img {opacity: .8;}'
  +
  '.k-q-xa {border: 0px none rgba(0, 0, 0, 0);}'
  +
  '.w-y {border-radius: 5px; background-color: rgba(57, 37, 37, 1) !important;}'
  +
  '.j-ji-Ob, .kb-r-Ob {background: none repeat scroll 0% 0% rgba(71, 27, 27, 1);}'
  +
  '.kb-r-L {background-color: #2A1414 !important; border-bottom: 1px solid #2A1414 !important;}'
  +
  '.kb-r-s {background-color: rgba(111, 22, 22, 1) !important;}'
  +
  '.f-Qh {border-color: rgba(140, 28, 28, 1) rgba(107, 23, 23, 1) #6B1717 !important; background: rgba(54, 34, 34, 1) !important; color: #EDD !important;}'
  +
  '.kb-r-Pb .j-ee-ua, .kb-r-Pb .j-ee-ua:hover, .kb-r-Pb .j-ee-ua:focus, .kb-r-Pb button, .f-Qh:focus {border: 1px solid rgba(153, 33, 13, 1) !important;}'
  +
  '.k-v-n-L-m {background-color: #931B0D !important;}'
  +
  '.k-v-n-d-m {background-color: rgba(173, 34, 11, 1) !important;}'
  +
  '.a-v-yc-Jj-od-Fd {background: rgba(90, 2, 2, 1) !important; color: #EDD !important;}'
  +
  '.k-v-L {color: #EDD !important;}'
  +
  '.Ya-n-vb {background-color: rgba(57, 32, 32, 1);}'
  +
  '.Wb-ca-d {opacity: .8;}'
  +
  '.n-Wf-n-P:hover, .ec-Na-Hb .n-Wf-n-P:focus:hover {background-color: rgba(162, 32, 10, 1) !important; border: 1px solid rgba(122, 15, 15, 1) !important; color: #EDD !important;}'
  +
  '.kb-r {background: none repeat scroll 0% 0% padding-box #6F1616 !important;}'
  +
  '.webstore-qb-S-cb-mg-yj, .webstore-test-id-wall-tile-ribbon-sponsored, .webstore-S-ig-cb-Gb-mg, .webstore-D, .webstore-qb-S-cb-mg-yj a, .webstore-test-id-wall-tile-ribbon-sponsored a, .webstore-S-ig-cb-Gb-mg a, .webstore-D a {color: #EDD !important;}'
// OLD DRIVE
  +
  '.loadingstatusbox {background-color: rgba(164, 45, 26, 1) !important; border-color: -moz-use-text-color rgba(143, 33, 10, 1) #8F210A !important;}'
  +
  '#doclist .viewpane {background-color: rgba(41, 31, 31, 1) !important;}'
  +
  '.viewpane-toolbar {border-bottom: 1px solid rgba(90, 20, 20, 1) !important;}'
  +
  '.info-panel {background-color: #291F1F; border-left: 1px solid #5A1414 !important;}'
  +
  '.viewpane .promo-banner {background-color: #291F1F !important; border-bottom: 1px solid #5A1414 !important;}'
  +
  '.doclistview-inner, .doclistview-inner-ie {background-color: #291F1F !important;}'
  +
  '.folder-path-container {background-color: rgba(96, 23, 23, 1) !important; border-bottom: 1px solid rgba(134, 16, 16, 1) !important;}'
  +
  '.view-info-visible .doclistview-list.density-tiny .doclist-container {background: rgba(42, 11, 11, 1) !important;}'
  +
  '.doclist-header th {background: none repeat scroll 0% 0% rgba(63, 36, 36, 1) !important;}'
  +
  '.doclist-header th {border-bottom: 1px solid rgba(74, 25, 25, 1) !important;}'
  +
  '.doclist-tr-active .doclist-td-active {border-left: 2px solid rgba(177, 47, 25, 1) !important;}'
  +
  '.doclist-tr-underlined .doclist-td, .doclist-tr-underlined .doclist-td-content, .doclist-tr-underlined .doclist-td-checkbox, .doclist-tr-underlined .doclist-td-date, .doclist-tr-underlined .doclist-td-info-toggle, .doclist-tr-underlined .doclist-td-modifiers, .doclist-tr-underlined .doclist-td-name, .doclist-tr-underlined .doclist-td-owners, .doclist-tr-underlined .doclist-td-quota, .doclist-tr-underlined .doclist-td-spacing, .doclist-tr-underlined .doclist-td-share-date, .doclist-tr-underlined .doclist-td-star, .doclist-tr-underlined .doclist-td-trash {border-bottom: 1px solid rgba(74, 11, 11, 1) !important;}'
  +
  '.doclist-tr-hover {{background: none repeat scroll 0% 0% rgba(94, 24, 20, 1) !important;}'
  +
  '.doclist-name {border: 1px solid rgba(59, 32, 32, 0) !important; color: #EDD !important;}'
  +
  '.product-logo {border-bottom: 1px solid #5A1414 !important;}'
  +
  '.navpane {background-color: #291F1F !important;}'
  +
  '.storage-unified {background-color: #291F1F !important;}'
  +
  '.storage-unified .sw-container {border-top: 1px solid #5A1414 !important;}'
  +
  '.fixed-margin .nav-tree-folder-view div.goog-list {background: #291F1F !important;}'
  +
  ' .goog-list, .goog-listitem-highlight {color: #EDD !important; background: none repeat scroll 0% 0% #291F1F !important;}'
  +
  '.navpane .navpane-top-list .goog-listitem {border: 1px solid rgba(77, 34, 34, 1) !important;}'
  +
  '.download-link-pane-hover:hover, .download-link-pane-hover:focus {background-color: rgba(95, 31, 31, 1) !important;}'
  +
  '.info-panel-tab-bar .goog-tab.goog-tab-selected {background-color: #291F1F !important; color: #EDD !important;}'
  +
  '.activity-list-container {background-color: #601717 !important;}'
  +
  '.activity-list-static-header .activity-event-section-title {background-color: #291F1F !important;}'
  +
  '.activity-event-section-title, .activity-event-details-container, .activity-event-details-header, .activity-event-annotation {color: #EDD !important;}'
  +
  '.activity-list-refresh-button-header {background-color: #291F1F !important;}'
  +
  '.activity-event {background-color: rgba(50, 16, 16, 1) !important; border-color: rgba(113, 15, 15, 0.92) !important;}'
  +
  '.activity-event-target:hover, .activity-event-target:active, .activity-event-target:focus {background-color: rgba(104, 10, 10, 1) !important;}'
  +
  '.info-panel-tab-bar {border-bottom: 1px solid #5A1414 !important;}'
  +
  '.filter-selector {background-color: #553230 !important;}'
// ACTIVITY FEED
  +
  '.acts, .thead {background-color: rgba(90, 24, 16, 1) !important;}'
  +
  '.fs td table, .fs td table tbody, {border: 1px solid #843330 !important;}'
  +
  '.fs td {border: 0px solid #000;}'
// CALL
  +
  '.Kj-JD-K7, .Kj-JD-Jz {background-color: rgba(255, 255, 255, 0) !important; color: #EDD !important;}'
  +
  '.Kj-JD-Jz a, .Kj-JD-Jz .e {color: #943330 !important;}'
  +
  '.Hy .m, .Hy .n, .Hy .k, .Hy .m {background: none repeat scroll 0% 0% #420E0E;}'
  +
  '.QlkKEc {background: none repeat-x scroll left -5px rgba(98, 59, 59, 1) !important; border-left: 0px solid #000; border-right: 0px solid #000;}'
  +
  '.AC0ztc, .IqUkI {border-color: -moz-use-text-color -moz-use-text-color #782E2E !important;}'
  +
  '.AC0ztc, .IqUkI, .AC0ztc {background-color: rgba(152, 81, 81, 1) !important; background: rgba(152, 81, 81, 1) !important;}'
  +
  '.lB4kbc {background-color: #782E2E !important;}'
  +
  '.lB4kbc .J-N {border: 1px solid rgba(92, 17, 17, 1) !important; background-image: -moz-linear-gradient(center top , rgba(165, 22, 22, 1), rgba(117, 19, 19, 1)) !important}; color: #EDD;}'
  +
  '.ioIxMc {background-color: rgba(183, 44, 21, 1) !important;}'
  +
  '.hxa9qe {background: #623B3B;}'
  +
  '.IqUkI {background-color: #A51616 !important; border-style: none !important;}'
  +
  '.a1z {background-color: rgba(165, 90, 90, 1) !important;}'
  +
  '.Fbsvsc {background: none !important; border-left: 0px none #000 !important;}'
  +
  '.eUmSL, .Fbsvsc {border: 0px solid #000 !important;}'
  +
  '.lB4kbc, .QlkKEc {border-left: 1px solid rgba(156, 24, 24, 1) !important; border-right: 1px solid #9C1818 !important;}'
  +
  '.ioIxMc {background-color: rgba(170, 34, 12, 1) !important;}'
  +
  '.hxa9qe, .standard .header h1 {color: rgba(227, 167, 167, 1) !important;}'
  +
  '.AD {opacity: .92;}'
  +
  '.pluginchecker-prompt-message {background-color: rgba(149, 24, 24, 1) !important; color: #EDD !important;}'
  +
  '.pluginchecker-prompt-beak {border-color: transparent transparent #951818 !important;}'
  +
  '.g-button, .g-button-basic {background-color: #1B1715; border: 1px solid #1B1715;}'
  +
  '.screenshot, #main img, .header img {opacity: .8 !important;}'
  +
  '.standard .footer {border-top: 1px solid rgba(92, 23, 23, 1);}'
  +
  '.g-button div span span, .g-button div span, .g-button div span span a {background: none; opacity: .85;}'
  +
  '.g-button div {border-radius: 6px;}'
//BUSINESS
  +
  '.G-q-B {background-color: #5F0D0D;}'
  +
  '.G-q-ea button {border: 0px solid #000; border-color: 0px solid #000;}'
  +
  '.wp1zy, .ejd, .Vjd, .Vjd a, .RSc, .N6b, .FJb, .iWd, .Ggc, .Lha, .IAc, .MAc {color: #EDD !important;}'
  +
  '.CL2kvf {background-color: #7B1F1F;}'
  +
  '.PzKDq {background-color: rgba(180, 25, 11, 1);}'
  +
  '.cjd {border-left: 1px solid #7B1F1F;}'
  +
  '.gjd, .Zjd, .f0b, .Lcb td, .cqHuy td, .R6bemf td, .z151Ld {color: #7B1F1F;}'
  +
  '.WjVAde {opacity: .8;}'
  +
  '.s5k47c a, .b3vX8b, .footer-links-container a, ._kuc a, .fjfe-footer-links a {color: #A41D10 !important; text-shadow: 1px 1px 2px rgba(70, 18, 15, 0.92);}'
  +
  '.eLP4K {background-color: #3B2222;}'
  +
  '.Ae4kFe {border-top: 1px solid #591515;}'
  +
  '.afC0Vc:hover, .afC0Vc:focus, .clrlHc:hover, .clrlHc:focus {background-color: rgba(86, 43, 43, 1);}'
  +
  '.xVd {display: none;}'
  +
  '.Ncb {background-color: #2D2B2B;}'
  +
  '.uga .wXa .D0a {background: none repeat scroll 0% 0% rgba(66, 39, 39, 1);}'
  +
  '.ws .Smb {background-color: rgba(90, 22, 22, 1) !important;}'
  +
  '.g-h-f-za, .g-h-f-za:hover {background: -moz-linear-gradient(center top , rgba(189, 41, 17, 1), rgba(140, 36, 14, 1)) repeat scroll 0% 0% transparent; border: 1px solid rgba(183, 38, 14, 1);}'
  +
  '.g-h-f-p-aa {background: none repeat scroll 0% 0% rgba(68, 27, 27, 1); border: 1px solid rgba(108, 16, 16, 1);}'
  +
  '.uga {background-color: rgba(77, 16, 16, 1);}'
  +
  '.Buc .Ncb .B7c {border-bottom: 1px solid rgba(53, 10, 10, 1);}'
  +
  '.Qpa.Ppe {background-color: #282828;}'
  +
  '.P1Ktjc, .RLfR7d {background-color: #2D2B2B; border-bottom: 1px solid #2D2B2B; color: #EDD !important;}'
  +
  '.appbar, .fjfe-nav-item {border-bottom: 1px solid rgba(66, 39, 39, 1) !important;}'
// PLAYSTORE
  +
  '.action-bar, .hover-target, .menu-link .id-no-menu-change .selected {background: none repeat scroll 0% 0% #282828;}'
  +
  '.nav .store .sub-nav {background: none repeat scroll 0% 0% #393939 !important; border-top: 1px solid #371D1D;}'
  +
  '.nav-container, .hover-zone {background-color: rgba(57, 29, 29, 0.95) !important; color: #EDD !important;}'
  +
  '.cluster-background .id-track-click, .preview-overlay-container {opacity: .8;}'
  +
  '.card-content .id-track-click .id-track-impression {background: none repeat scroll 0% 0% rgba(59, 54, 54, 1) !important;}'
  +
  '.reason-set {background: none repeat scroll 0% 0% rgba(78, 19, 19, 1) !important;}'
  +
  '.button.apps, .play-button.apps.small, .play-button.books.small, .play-button.devices.small, .play-button.magazines.small, .play-button.movies.small, .play-button.music.small, .play-button.tv.small, .play-button.neutral.small {background-color: rgba(150, 39, 21, 1) !important;}'
  +
  '.paragraph-end {display: none !important;}'
  +
  '.card.apps .cover {background-color: rgba(111, 24, 24, 1);}'
  +
  '.card.small .details {background-color: #342828;}' 
  +
  '.card-content, .card .cover {background: none repeat scroll 0% 0% rgba(29, 4, 4, 1) !important;}'
  +
  '.placeholder-background {background: rgba(54, 17, 17, 1) !important;}'
  +
  '.image-container, .promotion-container, .cluster-background .id-track-click, .has-background {opacity: .7;}'
  +
  '.footer {background: none repeat scroll 0% 0% rgba(42, 38, 38, 1) !important;}'
  +
  '.action-bar-aux:last-child .play-button.small {border: 1px solid rgba(176, 15, 15, 1);}'
  +
  'body-content-loading-overlay {background: none repeat scroll 0% 0% rgba(80, 24, 24, 0.95) !important;}'
  +
  '.show-all-hover-zone {background-color: rgba(111, 15, 15, 1) !important;}'
  +
  '#footer-content {background: none repeat scroll 0% 0% #1B1715; padding-bottom: 1em;}'
  +
  '.dropdown-submenu, .dropdown-sub-submenu {background: none repeat scroll 0% 0% #371D1D; border: 1px solid rgba(89, 19, 8, 1);}'
  +
  '.empty-cluster {background: #393939; box-shadow: 0px 2px 4px #393939; color: #EDD !important;}'
  +
  '.books.play-button, .books.play-button:hover {background-color: rgba(174, 46, 18, 1) !important;}'
  +
  '.empty-cluster-description, .hero-wrapper-b p, .show-more-content {color: #EDD;}'
  +
  '.contact-enabled .search-panel .suggestions-container, .body-content-loading-overlay {background: #333 !important;}'
  +
  '.search-panel-body, .gssb_m, gssb_a ,gssb_a:hover {background: #433 !important;}'
  +
  '.jfk-textinput:focus {border: 1px solid rgba(147, 34, 16, 1);}'
  +
  '.search-panel .modal-dialog, .search-panel, .modal-dialog {border-color: #000 !important;}'
  +
  '.contact-enabled .search-panel .suggestions-container {border-right: 0px solid #4E1313;}'
  +
  '.action-bar-spacer {background: #4E1313 !important;}'
  +
  '.gssb_e, .additional-links-container {border-width: 0px !important; border-right: 0px solid #000 !important;}'
  +
  '.oe .gd, .action-bar-link a, .action-bar-link a:visited, {background: none repeat scroll 0% 0% rgba(170, 41, 20, 1); border-color: rgba(183, 38, 14, 1); color: #000;}'
  +
  '.ctp-header.black .ctp-header-align-inner {background: none repeat scroll 0% 0% rgba(48, 32, 32, 0.7); color: #EDD !important;}'
  +
  '.action-bar-cart-item, .action-bar-cart-item:hover {background: #A93917 !important;}'
  +
  '.empty-library, .empty-lib-p {background-color: #371D1D; color: #EDD !important;}'
  +
  '.child-submenu-link-wrapper:hover, .parent-submenu-link:hover, .leaf-submenu-link:hover {background: none repeat scroll 0% 0% rgba(80, 60, 60, 1);}'
  +
  '.submenu-divider {border-bottom: 1px solid rgba(83, 20, 20, 1);}'
  +
  '.info-container, .details-info, .details-section-divider {background: #1B1715 !important; border-bottom: 0px solid #000;}'
  +
  '.details-section {background-color: rgba(35, 28, 28, 1) !important;}'
  +
  '.cover-image {box-shadow: 0px 0px 4px rgba(38, 6, 6, 1) !important;}'
  +
  '.rating-box, .score-container, .rating-histogram, .score {background: none repeat scroll 0% 0% rgba(56, 16, 16, 1);}'
  +
  '.bar-number, .score, .heading, .title, .text-node, .ep-feature-desc, .id-app-orig-desc, .recent-change {color: #EDD !important;}'
  +
  '.expand-button:hover, .expand-next:hover, .expand-prev:hover, .expand-button:hover, .play-button:hover, .expand-next.expand-button:hover, expand-button expand-prev:hover, .play-button.icon-button, .play-button.apps {background: #B44422 !important; background-color: #B44422 !important;}'
  +
  '.document-title, .hdg h3, .appbar-snippet-primary {color: rgba(170, 20, 20, 1) !important;}'
  +
  '.hero-outer, .hero-inner {background: #1B1715 !important;}'
  +
  '.maia-cols > div > * > img, .maia-cols > div > img, .cover-image, .thumbnails .screenshot, .full-screenshot, .clickable, .author-image, .expand-button, .SP_menu_button {opacity: .8;}'
  +
  '.maia-col-4 .promo, #maia-main .features, .vertical-details, .show-more-end {background: none !important;}'
  +
  '.cta, .cta:hover {background: none repeat scroll 0% 0% rgba(84, 66, 66, 1); border: 1px solid rgba(165, 14, 14, 1); outline: 0px solid rgba(165, 14, 14, 1);}'
  +
  '#play-footer-nav li {border-right: 1px solid #530F0F !important;}'
  +
  '.maia-col-3 .retail {border-right: 1px solid #530F0F !important;}'
  +
  '.features .maia-cols {border-bottom: 1px solid #530F0F !important;}'
  +
  '.introduction .features {border: 0px solid #000 !important; border-width: 0px;}'
  +
  '.developer-reply, .review-panel-content {background: none repeat scroll 0% 0% rgba(74, 13, 13, 1);}'
  +
  '.box-arrow-up {border-bottom: 10px solid rgba(74, 13, 13, 1);}'
  +
  '.write-review-triangle-container {display: none !important;}'
  +
  '.review-input-text-box {border: 1px solid rgba(83, 34, 34, 1); background: rgba(63, 50, 50, 1);}'
  +
  '.ctp-header.no-banner, .apps .ctp-header.no-banner {background-color: rgba(95, 20, 8, 1) !important;}'
  +
  '.ctp-header-content, .ctp-header.black, .series-name, .ctp-header.no-banner, .description, .ctp-header-content {background-color: #140303 !important;}'
  +
  '.fjfe-nav-item, .fjfe-recentquotes, .fjfe-nav-item a {background-color: #1B1715 !important; color: #A42320;}'
  +
  '.SP_menu_button {border: 1px solid rgba(104, 11, 11, 1);}'
  +
  '.gf-reorder-menu {background-color: #000; border-color: rgba(111, 16, 16, 1) !important;}'
  +
  '.fjfe-recentquotes h4, .hdg h3 {border-top: 0px solid #000 !important; color: #EDD !important;}'
  +
  '.quick-rating-container {border-top: 0px none #1D0404 !important;}'
// SHOPPING
  +
  '#maia-nav-root {background: #393939 !important; border-bottom: 0px solid #000;}'
  +
  '.maia-button:hover, .maia-button:focus, .maia-button, a.maia-button {background: #B44422 !important; background-color: #B44422 !important; color: #EDD !important;}'
  +
  '.main-image, .suez-col-4 img, img.tabset-photo {opacity: .8;}'
  +
  '.maia-cols > div > iframe {border: 1px solid #842320;}'
  +
  '#maia-nav-root li ul, #maia-nav-root li:hover a {background-color: #304F8A !important;}'
  +
  '.google-js .gweb-tabset-content-active, .gweb-tabset-contents, .gweb-tabset-y {background: rgba(38, 28, 28, 1);}'
  +
  '.gweb-tabset-nav-active, .gweb-tabset-y .gweb-tabset-nav li.gweb-tabset-nav-active, .gweb-tabset-nav-active a, li.gweb-tabset-nav-active a, li.gweb-tabset-nav-active:active {background-color: rgba(98, 22, 22, 1) !important;}'
  +
  '.gweb-tabset-nav li.gweb-tabset-nav-active a {background: none repeat scroll 0% 0% rgba(92, 25, 25, 1) !important; 0px solid !important;}'
  +
  '.gweb-tabset-nav li a, .gweb-tabset, .gweb-tabset:after {text-shadow: none; border: 0px solid !important;}'
  +
  '.gweb-tabset-nav li, .gweb-tabset-y .gweb-tabset-nav li, .gweb-tabset-y .gweb-tabset-nav ul {border-top-width: 0px !important; border-bottom-width: 0px !important;}'
  +
  '.gweb-tabset-contents {border-left-color: #642320 !important;}'
  +
  '.f-e-ua {display: none; box-shadow: none; background-color: rgba(213, 51, 24, 1) !important; background-image: -moz-linear-gradient(center top , rgba(215, 39, 11, 1), rgba(186, 29, 3, 1)) !important; border: 1px solid rgba(165, 33, 18, 1) !important;}'
  +
  '._huc img {opacity: .8;}'
  +
  '._wed {border-bottom: 1px solid rgba(96, 11, 11, 1) !important;}'
  +
  '.search-inputs .submit {background: none repeat scroll 0% 0% rgba(161, 20, 20, 1);}'
// PRODUCTFORUMS
  +
  '.jfk-button-standard {background-color: rgba(188, 21, 21, 1) !important; background-image: -moz-linear-gradient(center top , #BC1515, rgba(156, 30, 30, 1)) !important;}'
  +
  '.GBT-Y1EDKXC, .GBT-Y1EDA-C {border-top: 0px solid #000 !important;}'
  +
  '.gwt-Label .dragdrop-dropTarget, .GBT-Y1EDG-C div, .gux-confirm-panel-c, .jfk-button-action, .maia-button:hover, .maia-button:focus, .maia-button {background: rgba(188, 42, 18, 1) !important; background-color: rgba(188, 42, 18, 1) !important; border: 1px solid rgba(161, 47, 23, 1) !important;}'
  +
  '.GBT-Y1EDOOC {border-bottom: 1px solid #842213 !important;}'
  +
  '.gux-confirm-panel-c {background: rgba(146, 32, 7, 1) !important; opacity: .7; color: #842320 !important;}'
  +
  '.GBT-Y1EDE-C, .GBT-Y1EDMP td a, #sg-ft, .gpf-slide-text, .gpf-slide-title {color: #EDD !important;}'
  +
  '.GBT-Y1EDGHB, a.GBT-Y1EDJ-C, .gpf-slide-image-container img, .gwt-Image {opacity: .8;}'
  +
  '._username, _username a, #tm-tl, .GBT-Y1EDJ-B, .GBT-Y1EDDVC, .GBT-Y1EDEY, .GBT-Y1EDEY a {color: #EDD !important;}'
  +
  '.GBT-Y1EDAJB, .GBT-Y1EDAJB div, .GBT-Y1EDAJB a, .GBT-Y1EDAJB div a {color: rgba(191, 93, 93, 1) !important;}'
  +
  '.GBT-Y1EDMP td {border-bottom: 1px solid rgba(84, 13, 13, 1) !important;}'
  +
  '.GBT-Y1EDIVC .GBT-Y1EDKL.GBT-Y1EDML {border: 0 !important;}'
  +
  '.GBT-Y1EDC5B .GBT-Y1EDE5B {border-left: 1px solid rgba(84, 13, 13, 1) !important;}'
  +
  '.GBT-Y1EDO3B {border: 1px solid #842213 !important;}'
  +
  '.GBT-Y1EDNRC, .GBT-Y1EDC0C:hover, .GBT-Y1EDE-C:hover, .GBT-Y1EDF-C:hover {background-color: rgba(152, 49, 49, 1) !important;}'
  +
  '.jfk-button-standard:hover, .jfk-button-standard:active, .jfk-button-standard:focus {border: 0px none #000 !important;}'
  +
  '.gux-dropdown-c, .gux-dropdown-b {background-color: rgba(158, 31, 16, 1) !important; border: 1px solid rgba(122, 17, 17, 1) !important; outline: 0px none #000 !important; color: #EDD;}'
  +
  '.gux-combo-item-selected, .google-js {background-color: rgba(128, 21, 18, 1) !important; color: #EDD;}'
  +
  '.gux-combo-item-separator, .GBT-Y1EDEUC {border-top: 1px solid rgba(123, 8, 8, 1) !important;}'
  +
  '.suggestions-container {background-color: rgba(68, 51, 49, 1) !important;}'
  +
  '.gwt-PopupGlass, .gwt-PopupPanelGlass, .modal-dialog-bg {background-color: rgba(56, 10, 10, 1) !important;}'
  +
  '.GBT-Y1EDI2C .GBT-Y1EDG2C, .GBT-Y1EDI2C th {color: rgba(179, 36, 12, 1) !important;}'
  +
  '.GBT-Y1EDE2C {border-bottom: 1px solid rgba(86, 9, 9, 1) !important;}'
  +
  '#gwt-uid-132 {display: none !important;}'
  +
  '.gwt-ScrollTable .headerTable td {border-right: 1px solid rgba(86, 9, 9, 1) !important; border-bottom: 1px solid rgba(86, 9, 9, 1) !important;}'
  +
  '.GBT-Y1EDEUC:last-child, .GBT-Y1EDN1C {border-bottom: 1px solid #7B0808 !important;}'
  +
  '.GBT-Y1EDI1C:hover, .GBT-Y1EDP0C:hover {background-color: rgba(84, 0, 0, 1) !important;}'
  +
  '.GBT-Y1EDJ1C, .GBT-Y1EDA1C, .GBT-Y1EDJ1C span {color: rgba(231, 45, 14, 1); !important;}'
  +
  '.GBT-Y1EDKL {border-bottom: 0px none #000 !important;}'
  +
  '.GBT-Y1EDBJ, .GBT-Y1EDORC:focus, input[type="password"]:focus, textarea:focus, .editable:focus {border: 1px solid rgba(152, 34, 15, 1) !important; background-color: rgba(75, 12, 12, 1) !important; color: #EDD !important;}'
  +
  '.GBT-Y1EDOO tr, .GBT-Y1EDGN tr {background-color: rgba(62, 46, 46, 0.8) !important;}'
  +
  '.GBT-Y1EDGN td {border-bottom: 1px solid rgba(108, 19, 19, 1) !important;}'
  +
  '.GBT-Y1EDOO tr.selected td:first-child, .GBT-Y1EDGN tr.selected td:first-child {border-left: 2px solid rgba(171, 44, 24, 1) !important;}'
  +
  '.GCJGRCPBPOC {border-bottom: 1px solid rgba(60, 10, 10, 1) !important;}'
  +
  '#gbqfqw, #gbfwa, #gbqfqwb, #gbqfq, .gwt-SuggestBoxPopup .item, .GCJGRCPBI-B, .GCJGRCPBPIB, .GCJGRCPBG-C, .GCJGRCPBN-C div a, .GCJGRCPBD0C a, .GCJGRCPBD0C a:visited {color: #EDD !important;}'
  +
  '.gwt-SuggestBoxPopup {background: none repeat scroll 0% 0% rgba(51, 16, 16, 1) !important;}'
  +
  '.gwt-SuggestBoxPopup, .gwt-PopupPanel, .modal-dialog, .GCJGRCPBJOC {border: 1px solid rgba(72, 6, 6, 1) !important;}'
  +
  '.gwt-SuggestBoxPopup .item {background-color: rgba(96, 15, 11, 1) !important; color: #EDD !important;}'
  +
  '.gux-confirm-panel-c {background: none repeat scroll 0% 0% rgba(66, 19, 12, 1) !important;}'
  +
  '.GCJGRCPBC-C {border-top: 1px solid #3C0A0A !important;}'
  +
  '.GCJGRCPBB5B .GCJGRCPBD5B {border-left: 1px solid #3C0A0A !important;}'
  +
  '.GCJGRCPBN3B {border: 1px solid rgba(117, 12, 12, 1) !important;}'
  +
  '.GCJGRCPBFFC, .GCJGRCPBGJB.GCJGRCPBJEC, .GCJGRCPBOM {border-bottom: 1px solid rgba(75, 7, 7, 1) !important;}'
  +
  '.GCJGRCPBI-C div {background-color: #36140F !important; border: 2px solid #792816 !important;}'
  +
  '.GCJGRCPBHJB {border-left: 1px solid rgba(45, 21, 17, 1) !important;}'
  +
  '.GCJGRCPBGJB.GCJGRCPBMEC {border-top: 1px solid #4B0707 !important;}'
  +
  '.GCJGRCPBMXC {border-top: 1px solid rgba(15, 2, 2, 1) !important;}'
  +
  'GCJGRCPBI-B {color: rgba(186, 29, 29, 1) !important;}'
  +
  '.GCJGRCPBLRC, .GCJGRCPBE0C:hover {background-color: rgba(68, 25, 25, 1) !important;}'
  +
  '.gux-confirm-panel-c {background: none !important;}'
  +
  '.GCJGRCPBN-C div.GCJGRCPBE-C a:hover, .GCJGRCPBN-C div.GCJGRCPBKYC a:hover {background-color: rgba(77, 12, 12, 1) !important;}'
  +
  '.GCJGRCPBFVC, .gpf-slide-title, .gpf-slide-text {color: #EDD !important;}'
  +
  '.GCJGRCPBAJ iframe html {background: none repeat scroll 0% 0% #0E0E0E !important;}'
  +
  '.GCJGRCPBCJ {background-image: radial-gradient(farthest-side at 50% 0px , rgba(111, 14, 14, 0.5), rgba(51, 17, 17, 0)) !important;}'
  +
  '.GCJGRCPBKVC input[type="text"]:focus, .GCJGRCPBKVC input[type="password"]:focus, .GCJGRCPBKVC textarea:focus, .GCJGRCPBKVC .editable:focus {border: 1px solid rgba(123, 27, 12, 1) !important;}'
  +
  '.GCJGRCPBPI, .GCJGRCPBMRC {background: rgba(47, 29, 29, 1) !important;}'
  +
  '.gpf-content-links ul li a, .GCJGRCPBCJD h4, .GCJGRCPBCG {color: rgba(170, 34, 12, 1) !important;}'
  +
  '.GCJGRCPBOI .jfk-button-action input[type="text"], input[type="password"], .GCJGRCPBGY input, .GCJGRCPBBJ input, .GCJGRCPBPI, .GCJGRCPBMRC {border-color: rgba(95, 26, 26, 1) rgba(119, 20, 20, 1) rgba(77, 10, 10, 1) !important;}'
  +
  '.gpf-slide-standard-left .gpf-slide-image-container img, #ep-carousel img, .GCJGRCPBK-B, .GCJGRCPBEHB div div a img {opacity: .8;}'
  +
  '#maia-main .maia-button:hover, #maia-main .maia-button:focus, #maia-main .maia-button, .maia-button, a.maia-button {background-color: rgba(144, 30, 11, 1) !important; background-image: -moz-linear-gradient(center top , rgba(146, 30, 11, 1), rgba(108, 25, 11, 1)) important; color: #EDD !important;}'
  +
  '.GCJGRCPBP1C {border-bottom: 1px solid #3C0A0A !important;}'
  +
  '.GCJGRCPBL1C span, .GCJGRCPBL1C, .GCJGRCPBC1C, .GCJGRCPBNR {color: rgba(153, 32, 12, 1) !important;}'
  +
  '.GCJGRCPBK1C:hover, .GCJGRCPBB1C:hover {background-color: rgba(50, 16, 16, 1) !important;}'
  +
  '.GCJGRCPBFAE {background-color: rgba(42, 29, 29, 1) !important; color: #EDD !important; border-color: rgba(122, 12, 12, 1) rgba(137, 11, 11, 1) rgba(87, 11, 11, 1) !important;}'
  +
  '.GCJGRCPBCHC .GCJGRCPBGGC.GCJGRCPBCEC {background-color: rgba(119, 24, 8, 1) !important;}'
  +
  '.GCJGRCPBCHC .GCJGRCPBGGC {background-color: rgba(65, 25, 19, 1) !important;}'
  +
  '.GCJGRCPBMG, .GCJGRCPBPF {opacity: 0.7 !important;}'
  +
  '.GCJGRCPBEHB {border-top: 1px solid rgba(93, 18, 18, 1) !important;}'
  +
  '.jfk-button-standard.GCJGRCPBIY {border: 1px solid rgba(138, 16, 16, 1) !important;}'
  +
  '.jfk-button-default {background-color: rgba(141, 27, 9, 1) !important; background-image: -moz-linear-gradient(center top , rgba(132, 31, 15, 1), rgba(87, 17, 6, 1)) !important; border: 1px solid rgba(129, 34, 19, 1) !important;}'
  +
  '.GCJGRCPBMXB {background: rgba(50, 23, 23, 1) !important; border: 1px solid rgba(113, 27, 27, 1) !important;}'
  +
  '.GCJGRCPBCJB {border-bottom: 1px solid rgba(89, 13, 13, 1) !important;}'
  +
  '.GCJGRCPBCIB {background-color: #1B1715 !important;}'
  +
  '.GCJGRCPBMID {background-color: rgba(74, 11, 11, 1) !important; border-color: rgba(135, 17, 17, 1) rgba(101, 8, 8, 1) rgba(92, 14, 14, 1) rgba(117, 15, 15, 1) !important;}'
  +
  '.GCJGRCPBOID {color: #EDD !important;}'
  +
  '.GCJGRCPBFPD, .GCJGRCPBEPD {border-bottom: 1px solid rgba(66, 11, 11, 1) !important;}'
  +
  '.GCJGRCPBFM {border-top: 1px solid rgba(66, 17, 17, 1) !important;}'
  +
  '.GCJGRCPBMO tr.selected td:first-child, .GCJGRCPBLM tr.selected td:first-child {border-left: 2px solid rgba(161, 39, 19, 1) !important;}'
  +
  '.GCJGRCPBMO tr, .GCJGRCPBLM tr {background-color: rgba(41, 21, 21, 0.8) !important;}'
  +
  '.GCJGRCPBLM td {border-bottom: 1px solid #4B0707 !important;}'
  +
  '.GCJGRCPBMOC, .GCJGRCPBCTC {color: rgba(178, 80, 64, 1) !important;}'
  +
  '.GCJGRCPBGUC {border-top: 1px solid rgba(65, 12, 12, 1) !important;}'
  +
  'rect {opacity: .62 !important;}'
  +
  '.GCJGRCPBGUC:last-child {border-bottom: 1px solid #3C0A0A !important;}'
  +
  '.GCJGRCPBMSC {display: none !important;}'
  +
  '.popupContent input[type="text"], .popupContent input[type="password"] {background: rgba(47, 28, 28, 1) !important; color: #EDD; border-color: rgba(128, 13, 13, 1) rgba(149, 12, 12, 1) rgba(95, 11, 11, 1) !important;}'
// COMPANY & COMMUNITIES
  +
  '#maia-nav-y ul ul {border-top: 1px solid rgba(168, 9, 9, 1);}'
  +
  '.maia-cols strong, .address strong, .maia-article strong, .dZd, .uWWUIe {color: #A43330 !important;}'
  +
  '#map {background: none repeat scroll 0% 0% rgba(54, 10, 10, 1); border: 1px solid rgba(104, 12, 12, 1);}'
  +
  '#maia-header h2:before {border-color: #800F0F !important;}'
  +
  '.frame h3 a, .J-at1-auR, .Kj-JD-Jl button:focus {background: none repeat scroll 0% 0% rgba(144, 24, 5, 1) !important; border: 1px solid rgba(180, 39, 9, 1) !important;}'
  +
  '#company-toc ul {border-color: rgba(144, 24, 5, 1); !important;}'
  +
  '#carousel, .gDc, .H0d {opacity: 0.8;}'
  +
  '.iZd, .hf, .MZd, .MZd, .XZd, .Y0d, .wTc {background-color: rgba(84, 10, 5, 1) !important; color: #EDD !important;}'
  +
  '.XZd {border-left: 2px solid rgba(174, 45, 17, 1);}'
  +
  '.UCc, .UCc:last-child, .d-s, .ob, .UCc a, .d-s a, .ob a {border-bottom: 1px solid rgba(62, 42, 42, 1) !important; color: #EDD !important;}'
  +
  '.TZd {color: #EDD !important;}'
  +
  '.TCc .SZd:hover {border-left: 2px solid rgba(164, 39, 18, 1) !important;}'
  +
  '.g0d {border-bottom: 1px solid rgba(62, 42, 42, 1) !important;}'
  +
  '.Ct {background: none repeat scroll 0% 0% rgba(198, 88, 88, 0) !important;}'
  +
  '.d273ob {background-color: rgba(162, 34, 12, 1) !important;}'
  +
  '.G-q-O, .G-q-O-E {background-color: rgba(0,0,0,0) !important; color: #EDD !important;}'
  +
  '.yd.b-i .b-i-Aa .b-i-Q, .yd.b-i .b-i-Fa .b-i-Q, .yd.b-i .b-i-Aa .b-i-T, .yd.b-i .b-i-Fa .b-i-T {border-color: #7B1F1F transparent;}'
  +
  '.k9c, .k9c:hover {background-color: rgba(89, 17, 17, 1) !important;}'
  +
  '.QCc {border-top: 1px solid rgba(89, 23, 20, 1) !important;}'
  +
  '.b-p {border: 0px none #000 !important; box-shadow: none;}'
  +
  '.WV, .VV {background-color: rgba(155, 22, 6, 1) !important;}'
  +
  '.ob, .d-s a, .ob a {border-bottom: 0px none !important;}'
  +
  '.wPb, .dgb {background-color: rgba(72, 15, 6, 1) !important;}'
  +
  '.EPb {border-color: rgba(69, 12, 12, 1) !important; opacity: .8;}'
  +
  '.modal-dialog, .modal-dialog-title, .describe-panel, .panel {background: rgba(80, 13, 13, 1) !important; color: #EDD !important;}'
  +
  '.G-q, .G-q-B, .b-KJ-s, .b-KJ-nza {background: none repeat scroll 0% 0% rgba(56, 34, 34, 1) !important; color: #EDD !important;}'
  +
  '.b-KJ-Vja, .b-KJ-B {border-bottom: 0px none #000; border-top: 0px none #000;}'
  +
  '.b-KJ-O, #highlights-switch {color: #A43330 !important;}'
// SAFETY CENTER
  +
  '.article, .topic, .promo:nth-child(2n) {background: none repeat scroll 0% 0% rgba(59, 41, 41, 1); background-image: linear-gradient(to right, rgba(93, 27, 27, 1) 0px, rgba(47, 32, 32, 1) 50%, #5D1B1B 51%, #2F2020 100%) !important;}'
  +
  '.topic {background: none repeat scroll 0% 0% rgba(56, 44, 44, 1) !important;}'
  +
  '.topic h1, .article-nav h2, .topic .tools h2, h1.maia-display {color: #EDD !important;}'
  +
  '.hero-nav li {background: none repeat scroll 0% 0% #461E1E; border-right: 1px solid rgba(96, 62, 62, 1);}'
  +
  '.hero-nav li.active a, .promo:nth-child(2n-1) {background: #382C2C !important;}'
  +
  '.hero-nav {background: none repeat scroll 0% 0% rgba(81, 27, 27, 0.5);}'
  +
  '.cards-nav a {background: none repeat scroll 0% 0% rgba(45, 15, 15, 1) !important;}'
  +
  '.hero-story {background: none no-repeat scroll center center / cover rgba(51, 9, 9, 1);}'
  +
  '.tools-filter {background: none repeat scroll 0% 0% rgba(60, 32, 32, 1);}'
  +
  '.tools.maia-stage {background: none repeat scroll 0% 0% rgba(38, 28, 28, 1);}'
  +
  '#maia-main img, .maia-aux img {opacity: .8;}'
// PREFERENCES
  +
  '.sect {border-bottom: 1px solid rgba(66, 5, 5, 1); color: #EDD;}'
  +
  '.mitem:hover {background: none repeat scroll 0% 0% rgba(78, 18, 18, 1);}'
  +
  '.langanchormore, .langanchorless {border-bottom: 3px solid rgba(158, 34, 14, 1) !important;}'
  +
  '.subsect .jfk-textinput, .subsect .jfk-textinput:focus {border-color: #833 !important; background: #443330; color: #EDD !important;}'
  +
  '.highlight-off, a.highlight-off {background: none repeat scroll 0% 0% rgba(255, 255, 255, 0);}'
// INSIGHTS
  +
  '.EUYhrc {background-color: rgba(77, 21, 21, 1); border-color: #4D1515 #4D1515 -moz-use-text-color;}'
  +
  '.rDa .nia, .G-q-ea button:focus, .G-q-ea button:hover {border: 1px solid rgba(93, 18, 18, 1);}'
  +
  '.nlasvb, .jZQCGf, .ZKc, .xid, .wid, .tL6Txe, .ez1w7 a, .yuc {color: #EDD !important;}'
  +
  '.CJc {background: rgba(24, 3, 3, 0.67) !important;}'
  +
  '.IKrPcc {background: none repeat scroll 0% 0% rgba(62, 32, 32, 1);}'
  +
  '.o7b, .p4b {background: none repeat scroll 0% 0% #393939;}'
  +
  '.GroZaf {background-color: #4D1515; border-color: -moz-use-text-color #4D1515 #4D1515;}'
  +
  '.nynXfe {border-left: 1px solid rgba(83, 24, 24, 1);}'
  +
  '.knnqid.DX2B6-P-I .DX2B6-P-ka, .tid {color: rgba(198, 177, 177, 1);}'
  +
  '.sid, .XqaYje {background-color: rgba(92, 14, 14, 1);}'
  +
  '.Smb {background-color: rgba(93, 13, 13, 1);}'
  +
  '.lQd {background: rgba(111, 17, 17, 1);}'
  +
  '.r8c {background-color: rgba(44, 35, 35, 1); color: #DCC;}'
  +
  '.WXd {border-bottom: 1px solid rgba(93, 21, 21, 1);}'
  +
  '.dpb, .umNHB {opacity: .8;}'
// ADVERTISING
  +
  '.suez-sitemap {border-top: 1px dashed rgba(95, 21, 21, 1) !important;}'
  +
  '.ads-testimonial blockquote {background: rgba(80, 43, 43, 0.9); color: #DCC !important;}'
  +
  '#root .umFGB, #root .umDAB, #root .aw3ProgressBarV2StepText {background-color: rgba(93, 31, 31, 1) !important; border-bottom: 1px solid rgba(75, 9, 9, 1) !important; color: #EDD;}'
  +
  '#root .umP5 {background: none repeat scroll 0% 0% rgba(47, 41, 41, 1) !important; border-bottom: 1px solid rgba(63, 27, 27, 1) !important;}'
  +
  '#root .umGHB, .umBAB b, .umHW b, .umFBB {color: #EDD;}'
  +
  '.umAUB, .umAUB:focus {background: #544 !important; border: 1px solid rgba(128, 26, 9, 1) !important; color: #EDD !important;}'
  +
  '.umPBB, .umNBB, .umACB {background: none repeat scroll 0% 0% rgba(81, 70, 70, 1) !important; border: 1px solid rgba(78, 24, 24, 0.2) !important;}'
  +
  '.umNBB {background: none repeat scroll 0% 0% rgba(81, 37, 37, 1) !important;}'
  +
  '.goog-button-base-outer-box, .aw-save-button.goog-button-base-focused .goog-button-base-content {background: rgba(179, 19, 19, 1) !important; border-top: 1px solid rgba(135, 39, 39, 1) !important; border-bottom: 1px solid rgba(132, 19, 19, 1) !important; color: #EDD;}'
  +
  '.goog-button-base-inner-box, .aw-save-button.goog-button-base-focused .goog-button-base-content {border-left: 1px solid #902B2B !important; border-right: 1px solid #862121 !important;}'
  +
  '.goog-button-base-content, .gwt-Label {color: #EDD !important;}'
  +
  '.gb_ub div span:after {content: ".. before it becomes mandatory!"}'
  +
  '.prod-bar {background-color: #2D2D2D; border-bottom: 1px solid rgba(60, 22, 22, 1);}'
  +
  '.home-right {border-left: 1px solid rgba(71, 16, 16, 1);}'
  +
  'h1.home-title, .home-content, .GG2CFPACGJ {color: #DCC !important;}'
  +
  '.home-left img {opacity: .8;}'
  +
  '#maia-main #stage {border-bottom: 1px solid rgba(83, 19, 19, 1);}'
  +
  '.promo, .promo a {border: 1px solid #571818;}'
  +
  '#status-bar.divided {border-bottom: 1px solid rgba(90, 33, 33, 1);}'
  +
  '.right-col #main-content {border-left: 1px solid #5A2121;}'
  +
  '.GG2CFPACNEB {border-bottom: 1px solid rgba(108, 27, 27, 1) !important;}'
  +
  '.GG2CFPACGMB th, .GG2CFPACKMB {border-bottom: 0px none rgba(0,0,0,0) !important;}'
  +
  '.GG2CFPACKV.GG2CFPACBV:focus, .GG2CFPACKV.GG2CFPACGV, .GG2CFPACKV.GG2CFPACBV:hover {border-color: #A43330 !important;}'
  +
  '.GG2CFPACKV.GG2CFPACNV {border-color: #651515 !important;}'
  +
  '.gwt-PopupPanel .popupContent {border: 1px solid rgba(116, 16, 16, 1); color: #EDD !important;}'
  +
  '.gwt-PopupPanel {background: none repeat scroll 0% 0% rgba(102, 24, 24, 1); box-shadow: 0px 2px 16px rgba(89, 20, 20, 1) !important; color: #EDD !important;}'
  +
  '.GG2CFPACCD, li.item a:hover, .GG2CFPACCJ:hover {background-color: rgba(107, 66, 66, 1) !important;}'
  +
  '.wmt #footer {border-top: 1px solid rgba(69, 13, 13, 1) !important;}'
  +
  '.GG2CFPACDMB img {border: 1px solid rgba(87, 15, 15, 1) !important;}'
  +
  '.doc-root #footer a {color: #A41D10 !important; text-shadow: 1px 1px 2px rgba(70, 18, 15, 0.92) !important;}'
  +
  '.goog-flat-menu-button-hover, #help-dialog-button:focus, #help-dialog-button:hover {border-color: #A41D10 !important; color: #EDD !important;}'
  +
  '.ltr .goog-menu {background: #553230 !important; background-color: #553230 !important}'
// INVESTOR RELATIONS
  +
  '.gweb-tabset-x .gweb-tabset-nav li, .gweb-tabset-x .gweb-tabset-nav ul {background: rgba(96, 78, 78, 1); border-right-width: 0px !important;}'
  +
  '.gweb-tabset-x .gweb-tabset-contents {border-top-width: 0px;}'
  +
  '.maia-notification b {color: #A43330;}'
  +
  '.gweb-tabset {box-shadow: 0px 0px 0px 0px rgba(198, 198, 198, 0), 0px 0px 0px 0px rgba(128, 128, 128, 0);}'
  +
  '.maia-article div table tbody tr {background-color: rgba(92, 59, 59, 1);}'
  +
  '.maia-article th {background-color: rgba(96, 29, 29, 1) !important;}'
  +
  '.maia-article td, .maia-article th {border: 1px solid rgba(81, 24, 24, 1) !important;}'
  +
  '#maia-nav-y li li:after {border-color: rgba(101, 31, 31, 1);}'
  +
  '.contact-section {border-top: 1px dashed rgba(93, 23, 23, 1) !important;}'
  +
  '#contact-security select {background: rgba(81, 40, 40, 1); color: #EDD !important;}'
// PLAYSTORE TERMS & ABOUT
  +
  '#play-header {background: none repeat scroll 0% 0% rgba(50, 42, 42, 1);}'
  +
  '.play-contained p strong {color: rgba(203, 70, 70, 1) !important;}'
  +
  '.play-contained select {background: #433 !important; color: #EDD;}'
  +
  '.nocontent .secondary-footer-container {background-color: rgba(54, 14, 14, 1); border-top: 1px solid rgba(88, 3, 3, 1);}'
  +
  '.footer-links-container {background-color: rgba(23, 17, 17, 1); border-top: 1px solid rgba(45, 11, 11, 1);}'
  +
  '.goog-slider-horizontal .goog-slider-scale {border-top: 1px solid rgba(90, 7, 7, 1);}'
  +
  '#article_survey_full, #article_feedback_reason {color: #EDD !important;}'
  +
  '.goog-slider-thumb, .goog-slider-thumb:hover {background-color: rgba(108, 23, 23, 1); background-image: -moz-linear-gradient(center top , rgba(173, 26, 26, 1), rgba(131, 19, 19, 1)); border: 1px solid rgba(171, 33, 33, 1);}'
  +
  '.contact-form .character-limit {background-color: rgba(0,0,0,0;) !important;}'
  +
  '.field--textarea .article_feedback_comment {border: 1px solid #98220F !important; background-color: #4B0C0C !important;}'
  +
  '.article-survey:hover > .ratings > .highlight {color: #EDD !important;}'
  +
  '.paper-left .primary-container, .paper-center .primary-container, .paper-right .primary-container {box-shadow: 0px -30px 30px -4px rgba(99, 27, 27, 1);}'
  +
  '.content-container .action, .content-container .alert, .content-container .essential, .content-container .example, .content-container .fact, .content-container .filelink, .content-container .filelink-drawing, .content-container .filelink-file, .content-container .filelink-form, .content-container .filelink-pdf, .content-container .filelink-presentation, .content-container .filelink-site, .content-container .filelink-spreadsheet, .content-container .image-highlight, .content-container .key-concept, .content-container .lightbulb, .content-container .next-step, .content-container .note, .content-container .pull-example, .content-container .pull-fact, .content-container .pull-nextstep, .content-container .pull-note, .content-container .pull-tip, .content-container .privacy, .content-container .summary, .content-container .summaryBox, .content-container .tip, .content-container .warning {border-bottom: 1px solid rgba(110, 23, 23, 1); border-top: 1px solid #6E1717;}'
  +
  '.content-container .embedded-video-custom-container {border-bottom: 1px dashed rgba(104, 23, 23, 1); border-top: 1px dashed #681717;}'
  +
  '.topic-content img, .production-selector-subtitle img {opacity: .8;}'
  +
  '.content-container .zippy {border-top: 1px dashed #7E0D0D; border-bottom: 1px dashed #7E0D0D;}'
  +
  '.modal-dialog-content {background-color: rgba(54, 45, 45, 1);}'
  +
  '.esc-flow-content .title-bar {box-shadow: 0px 1px 4px 0px rgba(99, 35, 35, 1);}'
  +
  '.troubleshooter .node {background-color: #362D2D;}'
  +
  '.esc-flow-content .drawer {background-color: rgba(81, 18, 18, 1); border-top: 1px solid rgba(72, 19, 19, 0.33);}'
  +
  'tbl-layout .tbl-data td {border-bottom: 1px solid rgba(75, 14, 14, 1) !important;}'
  +
  '.tbl-controls, .tbl-data td, .tbl-controls {border-bottom: 1px solid rgba(75, 14, 14, 1) !important; border-top: 1px solid rgba(75, 14, 14, 1) !important;}'
  +
  '.header-container .header-title {color: rgba(177, 50, 50, 1);}'
  +
  '.google-and-status-bars .goog-menu {background: none repeat scroll 0% 0% #553230 !important;}'
  +
  '.grid .message-read-false {color: #EDD !important;}'
// MERCHANTS
  +
  '.GK-KXYABEYD {border-bottom: 1px solid rgba(80, 13, 13, 1) !important;}'
  +
  '#header-top-section {background: rgba(29, 29, 29, 1); border-bottom: 1px solid rgba(48, 8, 8, 1);}'
  +
  '.GK-KXYABFRC {border-color: rgba(203, 49, 24, 1) !important;}'
  +
  '.lia-form .gwt-TextBox:focus, .lia-form .gwt-TextBox, .searchbox .lia-component-common-widget-search-form-message input.search-input {border: 1px solid rgba(167, 40, 20, 1) !important; color: #EDD !important;}'
  +
  '.gwt-TextBox, #lia-body .search-input, input.aw-text:focus, textarea:focus, .GK-KXYABJ4C, .GK-KXYABPVC {background: #544 !important; border: 1px solid rgba(107, 30, 20, 1) !important; color: #EDD !important;}'
  +
  '.GK-KXYABHJD {color: #EDD !important;}'
  +
  '.products #footer {border-top: 1px solid rgba(127, 25, 20, 1);}'
  +
  '.feedback-module .user-feedback {background-color: #444; border: 1px solid rgba(122, 17, 17, 1); box-shadow: 0px 0px 6px 3px rgba(92, 21, 21, 0.87);}'
  +
  '.ServiceNodeInfoHeader, .min-width, .lia-content {background: rgba(29, 24, 24, 1) !important;}'
  +
  'center .maia-nav {border-bottom: 0px none #000;}'
  +
  '.lia-quilt-row-header, #lia-body .lia-content .google-breadcrumb {background: #1D1818 !important; color: #EDD !important;}'
  +
  '.lia-page .header-wrapper {background-color: rgba(33, 30, 30, 1); border-bottom: 1px solid rgba(84, 8, 8, 1); border-top: 1px solid rgba(78, 25, 25, 1);}'
  +
  '.fixed-search-wrapper {background: none repeat scroll 0% 0% #1D1818;}'
  +
  '.lia-quilt-column-alley-inner .slider {background: -moz-linear-gradient(center top , #B11818, #750F0F) repeat scroll 0% 0% transparent; border: 1px solid rgba(138, 18, 18, 1);}'
  +
  '.lia-quilt-column-alley {color: #EDD !important;}'
  +
  '.lia-panel-content div a, .user-avatar a img {opacity: .8;}'
  +
  '.lia-content .custom-search-wrapper {background: none repeat scroll 0% 0% rgba(164, 32, 32, 1);}'
  +
  '#lia-body .search-wrapper-arrow {display: none !important;}'
  +
  '#lia-body .lia-content input.lia-button {background-color: rgba(182, 44, 22, 1) !important; background-image: -moz-linear-gradient(center top , rgba(203, 45, 11, 1), rgba(150, 40, 16, 1)) !important; border: 1px solid rgba(143, 34, 16, 1);}'
  +
  '.lia-panel-heading-bar {background-color: rgba(255, 255, 255, 0) !important;}'
  +
  '.lia-decoration-border-content .lia-panel-heading-bar-wrapper {border-bottom: 0px none rgba(96, 11, 11, 1) !important;}'
  +
  '.lia-panel-heading-bar-title .user_count, .lia-component-common-widget-breadcrumb ul.lia-list-standard-inline li.final-crumb, .lia-breadcrumb-node span {color: #EDD !important;}'
  +
  '.custom-search-wrapper {background: rgba(141, 54, 54, 1) !important;}'
  +
  '#browse-wrapper .lia-component-forums-widget-message-list, #topics-div #browse-wrapper .lia-component-forums-widget-message-list {background: -moz-linear-gradient(center top , rgba(62, 51, 51, 1), rgba(74, 57, 57, 1)) repeat scroll 0px 0px rgba(57, 48, 48, 0); border: 1px solid rgba(98, 15, 15, 1); box-shadow: 0px 1px 2px 2px rgba(62, 42, 42, 1) inset;}'
  +
  '.lia-content table.lia-list-wide tr.lia-list-row-float td {background-color: #3E3333 !important;}'
  +
  '.lia-quilt-column-main-content table.lia-list-wide td, .lia-content .lia-quilt-column-main-content table.lia-list-wide th {border-bottom: 1px solid rgba(99, 19, 19, 1);}'
  +
  '#lia-body .lia-content #pref-button-stream, #lia-body .lia-content #pref-button-browse {background: none repeat scroll 0px 0px rgba(120, 26, 26, 1); border: 1px solid rgba(150, 26, 26, 1);}'
  +
  '.lia-content .lia-menu-navigation {background-color: #781A1A !important; border: 1px solid #961A1A !important;}'
  +
  '#lia-body .lia-content table.lia-list-wide tr.lia-list-row-float td {background-color: #3E3333 !important;}'
  +
  '#lia-body .lia-content a.lia-button, #lia-body .lia-content span.lia-button, #lia-body .lia-content input.lia-button, #lia-body .lia-content button.lia-button, #lia-body .lia-content .lia-button-wrapper-secondary a.lia-action-reply, #lia-body .lia-content .lia-button-wrapper-secondary a.reply-link, #lia-body .lia-content .lia-button-wrapper-secondary a.delete-link, #lia-body .lia-content .lia-component-forums-action-escalate-message-button a.escalate-message, #lia-body .lia-content .lia-button-wrapper-secondary a.escalate-message, #lia-body .lia-content .lia-button-wrapper-start-now .start-now-button, #lia-body .lia-content a.lia-button.lia-button-secondary, #lia-body .lia-content span.lia-button.lia-button-secondary, #lia-body .lia-content button.lia-button.lia-button-secondary, #lia-body .lia-content input.lia-button.lia-button-secondary, #lia-body .lia-content .custom-adoption-button {background: none repeat scroll 0px 0px rgba(120, 26, 26, 1); border: 1px solid rgba(150, 26, 26, 1);}'
  +
  '.lia-content .lia-quilt-column-main-content table.lia-list-wide th, .lia-content .lia-quilt-column-main-content table.lia-list-wide td, .lia-list-wide td {border-bottom: 1px solid rgba(95, 25, 25, 1) !important;}'
  +
  '#lia-body .lia-content table.lia-list-slim td.lia-data-cell-integer, #lia-body .lia-content table.lia-list-slim td.lia-data-cell-integer a, #lia-body .lia-content table.lia-list-wide td.lia-data-cell-integer, #lia-body .lia-content table.lia-list-wide td.lia-data-cell-integer a {border: 0px none !important;}'
  +
  '.lia-list-row, .lia-content td.customreplies .comments, td.kudosCountColumn span.MessageKudosCount, #lia-body .lia-content ul.lia-paging-full .lia-paging-page-first > span.lia-link-disabled, li.lia-paging-page-ellipsis .lia-link-disabled {color: #EDD !important;}'
  +
  '#lia-body .lia-content .lia-quilt-footer {background-color: #1D1818;}'
  +
  '.awr-footer {border-top: 1px solid rgba(57, 16, 16, 1);}'
  +
  '.lia-content .lia-quilt-column-main-content {border-left: 1px solid rgba(47, 11, 11, 1) !important; border-right: 1px solid #2F0B0B !important;}'
  +
  '.lia-quilt-column-main-content .custom-search-wrapper #custom-search-border {background: none repeat scroll 0% 0% #1D1818; border-color: #1D1818 #1D1818 #211E1E;}'
  +
  '.lia-quilt-column-main-content .lia-component-common-widget-search-form input.search-input {background: #443 !important;}'
  +
  '#header-user-info .user-nav-wrapper {;}'
  +
  '.custom-search-wrapper #custom-search-border {background: none repeat scroll 0% 0% rgba(255, 255, 255, 0) !important; border-color: rgba(247, 247, 247, 0) rgba(217, 217, 217, 0) rgba(217, 217, 217, 0) !important;}'
  +
  '.external-site-nav a {background: none !important; border: 0px !important;}'
  +
  '#lia-body button.lia-button.lia-button-secondary, #lia-body input.lia-button.lia-button-secondary, #lia-body .custom-adoption-button, #lia-body .accept-tos, #lia-body input[type="submit"], .group_comment_button a {background-color: rgba(167, 39, 18, 1) !important; background-image: -moz-linear-gradient(center top , #A72712, rgba(122, 31, 11, 1)) !important; border: 1px solid rgba(162, 37, 16, 1) !important; content: "Search" !important;}'
  +
  '#submitContext_5dc65b302d4291:after {content: "Search";}'
  +
  '.lia-content .topic-item .root-message {background: -moz-linear-gradient(center top , rgba(68, 49, 49, 1), rgba(56, 40, 40, 1)) repeat scroll 0% 0% transparent !important; border: 1px solid rgba(99, 20, 20, 1) !important; box-shadow: 0px 1px 2px 2px rgba(62, 29, 29, 1) inset !important;}'
  +
  '.group_comment_button a, .comment_footer a {background: none repeat scroll 0% 0% rgba(168, 25, 25, 1); color: #EDD !important;}'
  +
  '.lia-panel-status-banner-note {background-color: rgba(99, 11, 11, 1) !important;}'
  +
  '.policy-container .policy-body {background-color: rgba(72, 49, 49, 1); border: 1px solid rgba(84, 30, 30, 1);}'
  +
  '.promotion-container {border-top: 0px none #EEE !important;}'
  +
  '.top-nav > li:hover > a {background-color: rgba(84, 12, 12, 1); border-color: rgba(80, 11, 11, 1) rgba(80, 11, 11, 1) rgba(80, 11, 11, 1);}'
  +
  '.view-cap, .view-container-border {background-color: rgba(68, 20, 12, 1);}'
  +
  '.agenda .underflow-top, .agenda .event, .agenda .day {border-bottom: 1px solid rgba(138, 54, 40, 1);}'
  +
  '.agenda .underflow-top {background: rgba(53, 41, 41, 1);}'
  +
  '.agenda .date-label, .agenda .event {background: none repeat scroll 0% 0% #8F2F1F !important; border-top: 1px solid rgba(98, 22, 10, 1) !important;}'
  +
  '.agenda-scrollboxBoundary, .agenda, .agenda .underflow-bot {background-color: rgba(65, 46, 42, 1) !important;}'
  +
  '.agenda-more {color: rgba(195, 64, 35, 1);}'
  +
  '.subscribe-image, #lia-body .lia-content img {opacity: .8; border-radius: 6px;}'
  +
  'h2.custom-header, .lia-panel-heading-bar-title, #lia-body .lia-content .lia-quilt-column-main-content table.lia-list-wide th, #lia-body .lia-content .lia-quilt-column-main-content table.lia-list-wide th a, .lia-data-cell-integer {color: #EDD !important;}'
  +
  '.ui-rtsr-unselected {background-color: #5A0F0F; color: rgba(213, 202, 200, 1);}'
  +
  '.ui-rtsr-selected {background-color: rgba(75, 48, 42, 1);}'
  +
  '.today-button {border: 1px solid #843330 !important;}'
  +
  '.post_wrap {background: -moz-linear-gradient(center top , #751B1B, rgba(89, 14, 14, 1)) repeat scroll 0% 0% transparent;}'
  +
  '.lia-content .lia-panel-status-inline-note {background-color: rgba(98, 9, 9, 1) !important;}'
  +
  '.lia-content table.lia-list-statistics {border-bottom: 2px solid rgba(72, 10, 10, 1);}'
  +
  '#lia-body.ViewProfilePage .lia-content .lia-quilt-column-main-content .lia-panel-standard > .lia-decoration-border > .lia-decoration-border-content > div > .lia-panel-content-wrapper {background: -moz-linear-gradient(center top , rgba(131, 29, 29, 1), rgba(96, 10, 10, 1)) repeat scroll 0px 0px transparent; border: 1px solid rgba(98, 24, 24, 1);}'
  +
  '#lia-body .lia-content table.lia-list-statistics {border-bottom: 0px none #000;}'
  +
  '.grey_block {background: none repeat scroll 0% 0% rgba(26, 13, 13, 1);}'
  +
  '#lia-body .lia-content .lia-panel-feedback-inline-note, #lia-body .lia-content .lia-panel-feedback-banner-note, .lia-content .lia-panel-feedback-banner-note .lia-text {background-color: #781A1A;}'
  +
  '.portal-container .show-all:after {background: none repeat scroll 0% 0% rgba(143, 29, 29, 1); border: 1px solid rgba(98, 13, 13, 1);}'
  +
  '.portal-container .all-hc-container--showing {border-bottom: 1px solid rgba(87, 15, 15, 1); border-top: 1px solid rgba(87, 15, 15, 1);}'
  +
  '.portal-container .show-all {border-top: 1px solid rgba(99, 13, 13, 1);}'
  +
  '.portal-container .product-selector li > a, .portal-container .list-of-hcs .hc-title, .primary-article img {opacity: 0.8;}'
  +
  '.top-nav > li ul a:hover {background-color: rgba(120, 19, 19, 1) !important;}'
  +
  '.info-bar-container--notification {background-color: rgba(125, 25, 13, 1);}'
  +
  '.contact-flow, .contact-bubble .primary-article, .channel .description {background: rgba(96, 12, 12, 1) !important;}'
  +
  '.contact-flow .channel h3 {border-top: 1px solid rgba(47, 29, 29, 1);}'
  +
  '.channel-name, .wait-prefix, .wait-amount {color: #EDD !important;}'
  +
  '#header-user-info .user-nav-wrapper {background: none repeat scroll 0% 0% rgba(107, 3, 3, 1); border: 1px solid rgba(116, 11, 11, 1); box-shadow: 0px 4px 5px 0px rgba(66, 14, 14, 1);}'
  +
  '.user-nav-wrapper:after {border-color: none !important;}'
// LESSER
  +
  '.primary-container--accordion.primary-container--accordion--CHROME, .primary-container--accordion {opacity: .72;}'
  +
  '.maia-col-9 h1, .maia-col-9 h2, .maia-col-3 h3, .maia-col-3 p, a.maia-button.maia-button-secondary {color: #DCC !important;}'
  +
  '.nik-tabs .nik-active h3, .nik-tabs h3:hover, .nik-tabs h3 {background: -moz-linear-gradient(center top , rgba(132, 20, 20, 1), rgba(110, 19, 19, 1)) repeat scroll 0% 0% transparent;}'
  +
  '.nik-slider div:not(:last-child):after {border-color: rgba(89, 28, 28, 1);}'
  +
  'a.maia-media img, img.maia-media {outline: 1px solid rgba(95, 15, 15, 1);}'
  +
  '.primary-article .table-of-contents:after {background-image: radial-gradient(ellipse closest-side, rgba(104, 19, 19, 1) 0px, rgba(102, 38, 38, 0) 100%);}'
  +
  '.content-container h3.subheading, .content-container h4.subheading {border-top: 1px dashed rgba(78, 16, 16, 1);}'
  +
  '.lia-content .lia-form input[type="text"] {background: rgba(74, 57, 57, 1) !important; border-color: rgba(129, 24, 24, 1) rgba(144, 37, 37, 1) rgba(104, 24, 24, 1) !important; color: #EDD !important;}'
  +
  '.accountchooser-card ol li {border-bottom: 1px solid rgba(90, 13, 13, 1);}'
  +
  '.main .banner h1, span.account-name, .example h4 {color: #EDD !important;}'
  +
  '.accountchooser-card ol li button:focus {border-left: 4px solid rgba(218, 56, 22, 1);}'
  +
  '.accountchooser-card ol li button img, .language-selector input {opacity: .8;}'
  +
  '.carousel-container .related-item {opacity: 0.8 !important;}'
  +
  '.content-container .nice-table td {background-color: rgba(74, 12, 12, 1); border-color: rgba(107, 15, 15, 1);}'
  +
  '.content-container .product-link-container:before {border-top: 1px dashed rgba(107, 25, 25, 1) !important;}'
  +
  '.gb_R, .maia-col-4 .sidebar li, .maia-cols .sidebar li a, .maia-aux h1, .webstore-S-cb-xc, .webstore-S-cb-Rf-nb, .webstore-S-ig-cb {color: #EDD !important;}'
  +
  '.maia-cols .sidebar li {border-bottom: 1px solid rgba(76, 14, 14, 1);}'
  +
  '#maia-nav-root li ul, #maia-nav-root li:hover a, .webstore-S-ig-cb, .webstore-S-Z, .webstore-S-cb-xc {background-color: rgba(75, 20, 11, 1) !important;}'
  +
  '#maia-nav-root li li {border-top: 1px solid rgba(95, 21, 9, 1);}'
  +
  '.footer-links .language-selector, .footer-links .language-selector > select {background: rgba(44, 34, 34, 1) !important; color: #EDD !important;}'
  +
  '.content-container .zippy, .content-container .zippy:visited {background: #393330;}'
  +
  '.j-K, .j-K.j-K-rc, .j-K-Za, .j-K-s, .j-K:hover, .j-K.j-K-rc:hover, .j-K-Za:hover, .j-K-s:hover, .webstore-Cb-Db, .webstore-S-cb-xc {color: #EDD !important;}'
  +
  '.webstore-S-hg-cb, .webstore-S-ig-cb, .webstore-S-hb-cb, .webstore-S-s-ig-cb, .webstore-S-ne-cb, .webstore-S-Ne-cb, .webstore-S-Z, .webstore-S-ad-cb, .webstore-S-bb-cb, .webstore-S-s-Ib, .webstore-S-nf-ej-Ib, .webstore-Pc-k-V, .webstore-S-cb-Hd-Cb, .webstore-Rf-r-V, .webstore-Rf-r-V a {color: #EDD !important;}'
  +
  '.kb-r-L {background-color: rgba(95, 17, 17, 1) !important; border-bottom: 1px solid rgba(59, 2, 2, 1) !important; color: #EDD !important;}'
  +
  '.webstore-ae-Pf-Pd-lc {background: none repeat scroll 0% 0% #7A4D4D; border-color: rgba(117, 25, 25, 1) #751919 #751919;}'
  +
  '.webstore-dropdown-select-menuitem-highlight {color: #EDD !important; background-color: #943330 !important;}'
  +
  '.webstore-qb-S-sh-Ii, .webstore-qb-S-Je, .webstore-Pc-r {background: none repeat scroll 0% 0% rgba(39, 10, 10, 1) !important;}'
  +
  '.j-ji, .kb-r {background: none repeat scroll 0% 0% padding-box rgba(42, 20, 20, 1) !important;}'
  +
  '.f-na {border: 1px solid rgba(68, 23, 23, 1) !important;}'
  +
  '.l5, .pls-vertShim {background-color: rgba(96, 14, 14, 1) !important;}'
// WALLET
  +
  '.GBBCW1XDF5B .appBar {background: none repeat scroll 0% 0% #481818; border-bottom: 1px solid #360909 !important;}'
  +
  '.GBBCW1XDIP .GBBCW1XDAQ {border-color: rgba(90, 19, 19, 1);} border: 1px solid rgba(90, 19, 19, 1) !important;}'
  +
  '.kd-list tbody tr:hover {border-color: rgba(90, 19, 19, 1) !important;}'
  +
  '.container-bottom .leftnav .link:hover {background-color: rgba(75, 21, 21, 1) !important;}'
  +
  '.GBBCW1XDII:focus, .GBBCW1XDII.GBBCW1XDNI, .GBBCW1XDII.GBBCW1XDNI:hover {border: 1px solid rgba(137, 32, 15, 1) !important;}'
  +
  '.GBBCW1XDII, .GBBCW1XDII:hover {background-color: rgba(147, 17, 17, 1) !important; background-image: -moz-linear-gradient(center top , rgba(161, 19, 19, 1), rgba(140, 10, 10, 1)) !important;}'
  +
  '.transactionsTable tbody td div, .transactionsTable tbody td {color: #EDD !important}'
  +
  '.expandableLeftNavPanel {border-top: 1px solid #651A0E !important;}'
  +
  '.GBBCW1XDIAC .list .list-item, .kd-list tbody tr {border-color: #651A0E #651A0E -moz-use-text-color !important;}'
  +
  '.actionsContainer, .GBBCW1XDBME {border-left: 1px solid #651A0E !important;}'
  +
  '.GBBCW1XDIAC .list {box-shadow: 0px 3px 3px -2px rgba(114, 16, 16, 1) !important;}'
  +
  '.mockCardContainer {border-color: rgba(78, 18, 9, 1) #4E1209 #4E1209 #4E1209 !important;}'
  +
  '.checkout-footer {border-top: 1px solid #651A0E !important;}'
  +
  '.GBBCW1XDICD {background-color: #1B1715 !important; border: 1px solid #1B1715 !important;}'
  +
  '.GBBCW1XDBR {background: none repeat scroll 0% 0% rgba(129, 5, 5, 1) !important;}'
  +
  '.gwt-debug-noItemsPanel-image, .GBBCW1XDKCD .gwt-Image {opacity: .5 !important;}'
  +
  '.GBBCW1XDFME, .GBBCW1XDJC, .GBBCW1XDKD {border-bottom: 1px solid #651A0E !important;}'
  +
  '.GBBCW1XDJHD {border-bottom: 1px solid rgba(84, 9, 9, 1) !important; background: #481818 !important;}'
  +
  '.GBBCW1XDFAC, .GBBCW1XDPM, .receipt-main-section, .GBBCW1XDMD, .GBBCW1XDDC {background-color: rgba(56, 40, 40, 1) !important;}'
  +
  '.receipt-main-section {border-color: #651A0E #651A0E -moz-use-text-color !important;}'
  +
  '.receipt-section {border-top: 1px solid #651A0E !important;}'
  +
  '.GBBCW1XDDC {background: none repeat scroll 0% 0% #382828 !important;}'
  +
  '.gwt-debug-receiptView-eventTable, .GBBCW1XDND, .GBBCW1XDDC, .GBBCW1XDKC, .GBBCW1XDLC, .GBBCW1XDEC, .GBBCW1XDOQE {color: #EDD !important;}'
  +
  '.GBBCW1XDHP:hover .GBBCW1XDJP:hover {background: #742926 !important;}'
  +
  '.small-receipt .receipt-main-section:after, .receipt-wrapper .receipt-main-section:after {opacity: .2 !important;}'
  +
  '.GBBCW1XDBTC {border: 1px solid #651A0E !important;}'
  +
  '.GBBCW1XDIME {border-bottom: 0px none #EFEFEF !important;}'
  +
  '.goog-button-base-outer-box, .aw-save-button.goog-button-base-focused .goog-button-base-content {background: none !important;}'
  +
  '.GBBCW1XDFDD {border: 1px solid rgba(81, 19, 19, 1) !important;}'
  +
  '.GBBCW1XDETB, .GBBCW1XDDJ, .GBBCW1XDII {background-color: rgba(129, 27, 27, 1); background-image: -moz-linear-gradient(center top , #811B1B, rgba(119, 13, 13, 1)) !important; border: 1px solid rgba(152, 19, 19, 1) !important; color: #EDD !important}'
  +
  '.GBBCW1XDII:focus, .GBBCW1XDII.GBBCW1XDNI {border: 1px solid rgba(182, 30, 6, 1) !important;}'
  +
  '.GBBCW1XDHTB, .GBBCW1XDGTB {background-color: rgba(71, 48, 48, 1) !important; color: #EDD !important;}'
  +
  '.GBBCW1XDJTB {background: none repeat scroll 0% 0% rgba(95, 24, 24, 1) !important; border: 1px solid rgba(108, 12, 12, 1) !important;}'
  +
  '.GBBCW1XDOGD, .GBBCW1XDOUE {color: #EDD !important;}'
// DOCS
  +
  '.ww-help-txt, .goog-toolbar-button-inner-box {color: #EDD !important;}'
  +
  '.ww-content tbody tr {background: none repeat scroll 0% 0% #500D0D !important;}'
  +
  '.modal-dialog-buttons button:focus, .modal-dialog-buttons button:hover {border: 1px solid rgba(183, 46, 24, 1);}'
  +
  '.ww-icons {opacity: .8;}'
  +
  '#docs-chrome {background: none repeat scroll 0% 0% rgba(99, 40, 40, 1);}'
  +
  '#docs-toolbar-wrapper {background-color: rgba(89, 51, 51, 1) !important; background-image: -moz-linear-gradient(center top , rgba(152, 19, 19, 1), rgba(149, 17, 17, 1)) !important; border-top: 1px solid rgba(183, 35, 35, 1); border-bottom: 1px solid rgba(116, 22, 22, 1);}'
  +
  '#docs-editor-container, #docs-editor {background: none repeat scroll 0% 0% rgba(30, 17, 17, 1) !important;}'
  +
  '#docs-branding-container.docs-branding-forms {background-color: rgba(135, 25, 7, 1);}'
  +
  '.goog-toolbar-separator.goog-inline-block {border-left: 1px solid rgba(119, 27, 27, 1);}'
  +
  '.docs-menubar .goog-control:hover {border: 1px solid rgba(143, 21, 21, 1) !important;}'
  +
  '.goog-menu-vertical {background: none repeat scroll 0% 0% rgba(86, 48, 42, 1) !important;}'
  +
  '.goog-toolbar-button-selected, .goog-toolbar-button-checked, .goog-toolbar-menu-button-open, .goog-toolbar-button-selected:hover, .goog-toolbar-button-checked:hover, .goog-toolbar-menu-button-open:hover {border-color: rgba(108, 5, 5, 1);}'
  +
  '.settings-panel {background-color: #393330; border: 1px solid rgba(105, 24, 24, 1);}'
  +
  '.ss-page-tab-triangle {border-top: 20px solid rgba(120, 30, 30, 1);}'
  +
  '.ss-page-tab {background-color: #781E1E;}'
  +
  '#domain-settings .goog-zippy-expanded:before, #domain-settings .goog-zippy-collapsed:before {background-color: rgba(129, 20, 20, 1);}'
  +
  '.page-divide {background-color: #632828;}'
  +
  '.ss-form-editor {background-color: #393330; border: 1px solid #720909;}'
  +
  '.hovering-textarea-container:hover {background-color: #393330;}'
  +
  '.ss-formwidget-div {background-color: #393330;}'
  +
  '.hovering-textarea-container textarea, .hovering-textarea-container input {border: 1px solid rgba(99, 18, 18, 1);}'
  +
  '#widget-container .jfk-textinput {border-color: #921B1B #921B1B #921B1B !important;}'
  +
  '.hovering-textarea-container:hover textarea.jfk-textinput:focus, .hovering-textarea-container textarea.jfk-textinput:focus, .hovering-textarea-container:hover input.jfk-textinput:focus {border: 1px solid #921B1B !important;}'
  +
  '.ss-header, .ss-formwidget-fieldlabel, .ss-widget-nodrag span, .ss-page-tab-text, .Nd-ie-cb {color: #EDD !important;}'
  +
  'ss-formwidget-selection {background-color: rgba(132, 34, 18, 1) !important;}'
  +
  '.ss-formwidget-container .ss-form-entry, .ss-formwidget-container:hover .ss-form-entry:hover {background-color: rgba(69, 38, 38, 1);}'
  +
  '#docs-editor .jfk-textinput {background: none repeat scroll 0% 0% #4E4040 !important;}'
  +
  '.hovering-textarea-container textarea.confirmation-textarea {border: 1px solid #631212 !important;}'
  +
  '.Yf-Kf-Hd-ye, .Yf-Zf-Kf .Yf-Hd-sj-tj {background-color: rgba(51, 40, 40, 1);}'
  +
  '.Yf-Zf-Kf .Yf-ag-Xb-qf {border-bottom: 1px solid rgba(80, 19, 19, 1);}'
  +
  '.Yf-Kf-Hd-ye .Yf-eb-Ic, .Yf-Zf-Kf .Yf-Hd-sj-tj .Yf-eb-Ic {border-top: 1px solid rgba(96, 14, 14, 1);}'
  +
  '.Yf-Zf-Kf .Yf-ag-Xb-qf {box-shadow: 0px 1px 5px 1px rgba(75, 39, 39, 1);}'
  +
  '.Yf-fg-qf {background-color: rgba(78, 7, 7, 1); border-top: 1px solid rgba(92, 8, 8, 1);}'
  +
  '.Yf-Kf-Hd-ye .Yf-qj-rj, .Yf-Zf-Kf .Yf-Hd-sj-tj .Yf-qj-rj {background-color: rgba(158, 46, 28, 1); border-color: rgba(188, 65, 45, 1);}'
  +
  '.Yf-kc-ak {border: 1px solid rgba(125, 19, 19, 1); background: none repeat scroll 0% 0% #533737;}'
  +
  '.Yf-kc-V {background-color: #843232;}'
  +
  '.Nd-ie-oe-O {background-color: rgba(65, 4, 4, 1);}'
  +
  '.a-kb {background: none repeat scroll 0% 0% #653E3E;}'
  +
  '.Yf-ag-Xb-bg-Wb-cg .a-bg-w {border-color: -moz-use-text-color -moz-use-text-color rgba(170, 39, 18, 1);}'
  +
  '.a-R-kb-u, .a-R-kb-u:hover, .a-R-kb-u:focus {background-color: rgba(134, 28, 28, 1); background-image: -moz-linear-gradient(center top , rgba(185, 10, 10, 1), rgba(155, 17, 17, 1)); border: 1px solid rgba(185, 12, 12, 1);}'
  +
  '.Yf-dg-eb img .Yf-ag-Xb-eb img {opacity: .8;}'
  +
  '.hovering-textarea-container:hover textarea.jfk-textinput {border-color: #631212 #631212 #631212 !important;}'
  +
  '#domain-settings {color: #EDD !important;}'
  +
  '#docs-editor .jfk-textinput, #gbg6 #gbi4t, #gbg4 #gbgs4d {color: #EDD !important;}'
  +
  '.script-promo-menu-item-description, .script-promo-menu-item-title {color: #EDD !important;}'
  +
  '.hovering-textarea-container:hover input.jfk-textinput {border-color: #631212 #631212 #631212 !important;}'
  +
  '#settings-summary-overlay {background-color: transparent; background-image: -moz-linear-gradient(left center , rgba(150, 29, 29, 0) 80%, rgba(102, 32, 32, 1));}'
  +
  '.modal-dialog-content {background-color: #500D0D !important;}'
  +
  '.modal-dialog-content .jfk-textinput, .modal-dialog-buttons button:focus, .modal-dialog-buttons .goog-buttonset-action {border: 1px solid #631212 !important;}'
  +
  '.modal-dialog-content .jfk-textinput {background: #822 !important; color: #EDD;}'
  +
  '.goog-inline-block .jfk-textinput {border-color: rgba(171, 40, 40, 1) rgba(170, 22, 22, 1) rgba(135, 24, 24, 1); background: #822 !important; color: #EDD;}'
  +
  '#mail-dialog-email-section {background-color: #500D0D;}'
  +
  '.mail-dialog-email-header {background: none repeat scroll 0% 0% rgba(90, 62, 62, 1); border-right: 1px solid rgba(144, 18, 18, 1); border-color: rgba(137, 29, 29, 1) #891D1D #891D1D; color: #EDD;}'
  +
  '#t-edit-theme .goog-toolbar-button-inner-box:after {content: " (outside Dark BG Bodies)"}'
  +
  '.fb-sidebar-content {border-left: 1px solid rgba(111, 26, 26, 1); border-color: rgba(131, 23, 23, 1);}'
  +
  '.fb-sidebar-container {background-color: rgba(30, 25, 25, 1);}'
  +
  '.fb-import-theme-tile {border: 1px solid rgba(89, 18, 18, 1);}'
  +
  '.fb-theme-tile-name {background-color: rgba(93, 14, 14, 0.8); border-top: 1px solid rgba(81, 23, 23, 1); color: #EDD;}'
  +
  '.fb-theme-tile-window, .fb-theme-tile {border: 1px solid rgba(102, 27, 27, 1);}'
  +
  '.fb-theme-tile.goog-control-selected .fb-theme-tile-name {background-color: rgba(174, 42, 21, 1); border-color: rgba(216, 55, 20, 1);}'
  +
  '.fb-theme-tile.goog-control-selected .fb-theme-tile-window {border: 2px solid rgba(143, 29, 11, 1);}'
  +
  '.fb-theme-tile-button-text, .fb-theme-tile-button-text:hover, .docs-title-untitled {color: #EDD !important;}'
  +
  '.docs-title-widget-enabled:hover .docs-title {background-color: rgba(238, 238, 238, 0);}'
  +
  '.ss-formwidget-selection {background: rgba(190, 33, 20, 0) !important;}'
  +
  '.ss-other-options-content {background-color: #393330; border: 0px solid #393330;}'
  +
  '.webstore-Cb-Db, .webstore-S-cb-xc {background-color: #2B0D0D; border-bottom: 1px solid rgba(105, 17, 17, 1); border-right: 1px solid rgba(75, 15, 15, 1);}'
  +
  '.webstore-S-ig-cb-Gb {opacity: .8;}'
  +
  '.webstore-qb-ac-Db-Mg-Dd {border: 1px solid rgba(123, 42, 42, 1); box-shadow: 0px 2px 2px rgba(92, 41, 41, 1) inset, 0px 1px 1px rgba(92, 59, 59, 1); background-color: rgba(114, 83, 83, 1);}'
  +
  '.modal-dialog-content, .modal-dialog-content a, .webstore-Pf-df .webstore-ae-Pf-Pd, .webstore-qb-ac-Db-Mg-Dd, .label-input-label, .webstore-qb-S-r {color: #EDD !important;}'
  +
  '.webstore-widget .modal-dialog-title {border-bottom: 1px solid rgba(60, 11, 11, 1);}'
  +
  '.webstore-S-cb-Hd-Cb, .webstore-S-Z, .webstore-S-cb-xc {background-color: rgba(59, 9, 9, 1);}'
  +
  '.webstore-S-hg-cb, .webstore-S-ig-cb, .webstore-S-hb-cb, .webstore-S-s-ig-cb, .webstore-S-ne-cb, .webstore-S-Ne-cb, .webstore-S-Z, .webstore-S-ad-cb, .webstore-S-bb-cb, .webstore-S-s-Ib, .webstore-S-nf-ej-Ib {border-bottom: 1px solid rgba(89, 18, 18, 1); border-right: 1px solid rgba(89, 18, 18, 1);}'
  +
  '.webstore-S-cb .webstore-S-hg-cb-Gb, .webstore-S-cb .webstore-S-s-ig-cb-Gb, .webstore-S-cb .webstore-S-ig-cb-Gb {border: 1px solid rgba(65, 15, 15, 1);}'
  +
  '.webstore-ae-Pf-Pd, .webstore-ae-Pf-Pd:hover, .webstore-ae-Pf-Pd:focus {border: 1px solid rgba(102, 21, 21, 1) !important;}'
  +
  '#grant_heading {color: #A43330 !important;}'
  +
  '.scope_spacer {border-top: 1px solid rgba(83, 16, 16, 1);}'
  +
  '#scope_list {border-bottom: 1px solid rgba(83, 16, 16, 1);}'
  +
  '.splash-screen-header {background-color: rgba(93, 28, 28, 1); border-bottom: 1px solid rgba(146, 27, 27, 1);}'
  +
  '.splash-screen {background-color: rgba(47, 33, 33, 1);}'
  +
  '.splash-screen-left {border-right: 1px solid rgba(87, 23, 23, 1);}'
  +
  '.goog-link-button, .goog-link-button:hover, .editor {color: rgba(179, 35, 11, 1);}'
  +
  '.splash-screen-footer {background-color: rgba(74, 20, 20, 1); border-top: 1px solid rgba(65, 13, 13, 1);}'
  +
  '.goog-modalpopup-bg, .modal-dialog-bg {background: none repeat scroll 0% 0% rgba(56, 29, 29, 1);}'
  +
  '#docs-toolbar-wrapper {box-shadow: 0px 1px 0px 0px rgba(134, 32, 32, 1) inset !important;}'
  +
  '.docs-branding-scripts {background-color: #6E170C !important;}'
  +
  '.resource-list .project-items-list .selected, .resource-list .project-items-list .selected:hover {background-color: rgba(86, 41, 41, 1) !important;}'
  +
  '.workspace .gwt-SplitLayoutPanel-HDragger {background-color: #971212 !important; border-left: 1px solid #771B1B !important;}'
  +
  '.resource-list {background-color: #1B1715 !important;}'
  +
  '.resource-list .project-items-list .item {border-bottom: 1px solid rgba(84, 30, 30, 1) !important;}'
  +
  '.editor .gwt-TabLayoutPanelTabs {background-color: #562929 !important; border-bottom: 1px solid rgba(75, 21, 21, 1); border-left: 1px solid #4B1515 !important;}'
  +
  '.editor .code-area .CodeMirror-gutter {border-left: 1px solid rgba(119, 22, 22, 1) !important; border-right: 1px solid rgba(74, 14, 14, 1) !important; background-color: #562929 !important;}'
  +
  '.editor .gwt-TabLayoutPanelTab-selected {background-color: #961212 !important;}'
  +
  '.editor .gwt-TabLayoutPanelTab {background-color: #961212; border: 1px solid rgba(176, 29, 29, 1) !important; border-bottom: 1px solid rgba(62, 14, 14, 1) !important;}'
  +
  '.editor .gwt-TabLayoutPanelTabs {border-bottom: 1px solid rgba(62, 14, 14, 1) !important;}'
  +
  '.cm-variable {color: #EDD !important;}'
  +
  '.ss-edit-link, .ss-edit-link:active, .ss-edit-link:visited, .ss-edit-link:hover, .ss-edit-link:link {border: 1px solid rgba(96, 24, 24, 1);}'
  +
  '.ss-closed-form {background-color: #393330; border: 1px solid #691818;}'
  +
  '.hovering-textarea-container textarea.closed-form-textarea {border: 1px solid rgba(104, 17, 17, 1);}'
  +
  '#analytics-container {background-color: #1B1715;}'
  +
  '.ss-summary h1 {border-top: 1px solid rgba(81, 13, 13, 1);}'
  +
  '.jfk-butterBar-info {background-color: #AD3A27; border-color: #C82316; color: #EDD !important;}'
  +
  '.folders-popup-summary {background: none repeat scroll 0% 0% rgba(81, 13, 13, 1); color: #EDD !important;}'
  +
  '.folders-popup {background-color: rgba(63, 42, 42, 1); border: 1px solid rgba(102, 25, 25, 1);}'
  +
  '.goog-tree-root {border: 1px solid rgba(117, 7, 7, 1);}'
  +
  '.folders-popup .goog-tree-item .selected, .goog-tree-item-label {background: none repeat scroll 0% 0% rgba(83, 48, 48, 1); color: #EDD;}'
  +
  '.folder-creation-link {color: rgba(204, 43, 17, 1);}'
  +
  '.docs-omnibox-autocomplete .ac-active {background-color: #6E170C;}'
  +
  '.docs-omnibox-autocomplete .ac-renderer, .docs-omnibox-autocomplete .ac-renderer:hover {box-shadow: 0px 2px 4px #651919; border: 1px solid rgba(171, 25, 25, 1); background-color: #6E170C; color: #EDD !important;}'
  +
  '.goog-toolbar {background: none repeat scroll 0% 0% #961212; border-top: 1px solid #9C1919; border-bottom: 1px solid #9C1919;}'
  +
  '.CSS_SHORTCUTS_HELP_POPUP {background: none repeat scroll 0px center rgba(69, 15, 15, 1) !important; color: #EDD;}'
  +
  '.CSS_SHORTCUTS_HELP_POPUP_CONTENT_HEADER, .CSS_SHORTCUTS_HELP_POPUP_TEAROFF_LINK, .CSS_SHORTCUTS_HELP_POPUP_TEAROFF_LINK_CONTAINER {color: rgba(188, 38, 13, 1);}'
  +
  '.CSS_SHORTCUTS_HELP_POPUP_KEY_MNEMONIC, .gbmlbw a, .gbmlb {color: #BC260D !important;}'
  +
  '.gbm {border: 1px solid rgba(83, 23, 23, 1) !important; background: none repeat scroll 0% 0% #501C1C !important;}'
  +
  '#gbd4 .gbmc {background: none repeat scroll 0% 0% #631E1E;}'
  +
  '#gbmpdv, #gbmpdv:hover {background: none repeat scroll 0% 0% rgba(75, 64, 64, 1); border-bottom: 1px solid rgba(80, 35, 35, 1); box-shadow: 0px 2px 4px rgba(93, 28, 28, 0.3);}'
  +
  '.gbps, .gbps2, .Ya-la-L, .Ya-la-Vh, .Ya-la-ob, .Ya-la-Vh b, .Ya-la-Vh a, .docs-title-inner {color: #EDD !important;}'
  +
  '.gbqfbb {background-color: rgba(147, 17, 17, 1); background-image: -moz-linear-gradient(center top , rgba(158, 25, 25, 1), rgba(126, 9, 9, 1)); color: #EDD !important;}'
  +
  '.gbto #gbs {background: none repeat scroll 0% 0% rgba(71, 15, 15, 1);}'
  +
  '.permissions-list-container {border-top: 1px solid rgba(41, 22, 22, 1);}'
  +
  '.inviter-invite-area {background-color: #500D0D;}'
  +
  '.permissions-list td {border-bottom: 1px solid rgba(38, 23, 23, 1);}'
  +
  '.vpc-change-link {color: rgba(204, 43, 17, 1);}'
  +
  '.share-fmb-disabled {color: rgba(212, 26, 26, 1);}'
  +
  '.W-ub-ii-la .a-t-F:hover:not(.a-t-F-da) {background-color: rgba(137, 17, 17, 1);}'
  +
  '.k-ba-q-P {color: rgba(195, 23, 23, 1); text-shadow: 1px 1px 2px rgba(70, 18, 15, 0.92) !important;}'
  +
  '.Ya-la-fg {border-bottom: 1px solid #540E0E;}'
  +
  '#docs-branding-container.docs-branding-documents {background-color: #86200A;}'
  +
  '.kix-ruler-background-inner {background-color: #632828 !important;}'
  +
  '#kix-ruler {border-bottom: 1px solid rgba(90, 19, 19, 1);}'
  +
  '.kix-zoomdocumentplugin-outer {opacity: .9;}'
  +
  '.jfk-bubble.jfk-bubble-promo {background-color: #F9EDBE; border: 1px solid #F0C36D;}'
  +
  '.jfk-bubble {background-color: #7A0909; border-color: rgba(171, 42, 20, 1) rgba(168, 36, 14, 1) #BA1F1F !important;}'
  +
  '.docs-homescreen-warmwelcome-drivebanner {background-color: rgba(137, 31, 14, 1);}'
  +
  '.docs-homescreen-warmwelcome-title, .docs-homescreen-warmwelcome-mobileappdetail {color: #EDD !important;}'
  +
  '.docs-homescreen-warmwelcome-desc {color: #DCC !important;}'
  +
  '.docs-homescreen-button-blue {background-color: rgba(164, 30, 8, 1);}'
  +
  '.docs-homescreen-modaldialog {box-shadow: none !important;}'
  +
  '.docs-homescreen-leftnavbar-menuheader {border-bottom: 1px solid rgba(123, 17, 17, 1);}'
  +
  '.docs-homescreen-editorbar-docs {background-color: rgba(104, 21, 7, 1);}'
  +
  '.docs-homescreen-grid-header, .docs-homescreen-list-header {background: none repeat scroll 0% 0% rgba(74, 51, 51, 1); color: #EDD !important;}'
  +
  '.docs-homescreen-grid-item {opacity: .8; background-color: rgba(120, 31, 31, 1); border-color: rgba(93, 15, 15, 1) #5D0F0F #5D0F0F;}'
  +
  '.docs-homescreen-grid-item-metadata-container {border-top: 1px solid rgba(110, 18, 18, 1);}'
  +
  '.docs-homescreen-list-item {background-color: rgba(65, 23, 23, 1);}'
  +
  '.docs-homescreen-list-container .docs-homescreen-item-section {border-color: rgba(77, 7, 7, 1) rgba(80, 11, 11, 1) rgba(83, 9, 9, 1);}'
  +
  '.docs-homescreen-list-item-title, .docs-homescreen-list-item-icon, .docs-homescreen-list-item-hover-icon, .docs-homescreen-list-item-owner, .docs-homescreen-list-item-time, .docs-homescreen-list-header {color: #EDD !important;}'
  +
  '.goog-control-hover {background: #833 !important; background-color: #833 !important;}'
// SPREADSHEETS
  +
  '#docs-editor .grid-container, #t-formula-bar-input-container, #formula-bar table, #t-formula-bar-input {background-color: #282828 !important;}'
  +
  'div.row-headers-background, div.column-headers-background {background: none repeat scroll 0% 0% #632828 !important;}'
  +
  '.waffle-background-container {background-color: rgba(71, 26, 26, 1) !important;}'
  +
  '.grid-table-container {background: rgba(0,0,0,0.3) !important;}'
  +
  '#docs-branding-container.docs-branding-spreadsheets {background-color: #86200A !important;}'
  +
  '.apps-toast, .apps-toast-fill, .apps-toast-content, .apps-toast-title {opacity: .3 !important;}'
  +
  '.grid-bottom-bar {border-top: 1px solid rgba(92, 21, 21, 1) !important;}'
  +
  '.waffle-disclaimer {background-color: #632828 !important; color: #EDD !important; border-bottom: 1px solid #862020 !important;}'
  +
  '.grid-bottom-bar tbody tr {background: none repeat scroll 0% 0% #632828 !important;}'
  +
  '.docs-sheet-active-tab {color: rgba(228, 190, 190, 1) !important; border-color: rgba(194, 47, 47, 1) rgba(158, 29, 29, 1) rgba(155, 35, 35, 1) !important;}'
  +
  '#docs-sheet-message-container {border-left: 1px solid rgba(132, 25, 25, 1) !important;}'
  +
  '.docs-sheet-message-container-button {background-color: #632828 !important; background-image: -moz-linear-gradient(center top , #AD1010, rgba(140, 12, 12, 1)) !important;}'
  +
  '.docs-sheet-status-container, .docs-sheet-status-container:hover {border-left: 1px solid rgba(119, 20, 20, 1) !important;}'
  +
  '.waffle-input-box-locator {background-color: rgba(153, 40, 22, 1) !important;}'
  +
  '#t-formula:after {content: "The canvas will not be affected by Dark BG Bodies"; color: #EDD !important;}'
  +
  '.waffle-formula-preview-decorator {background: none repeat scroll 0% 0% rgba(75, 23, 23, 1) !important;}'
  +
  '.dcs-a-dcs-cb-dcs-tb {background-color: #632828;}'
  +
  '.docs-docos-activitybox {background: none repeat scroll 0% 0% rgba(89, 37, 37, 1) !important; border: 1px solid rgba(149, 23, 23, 1) !important; box-shadow: 0px 2px 4px rgba(74, 17, 17, 0.4) !important;}'
  +
  '.dcs-r-dcs-je-dcs-lf-dcs-l-dcs-lc, .dcs-a-dcs-wc-dcs-uc-dcs-xc, .dcs-a-dcs-cb-dcs-tb .dcs-a-dcs-wc-dcs-uc-dcs-l, .dcs-a-dcs-cb-dcs-tb .dcs-a-dcs-sh-dcs-l {color: #EDD !important;}'
  +
  '.dcs-a-dcs-cb-dcs-tb {background-color: rgba(108, 33, 33, 1) !important;}'
  +
  '.dcs-r-dcs-je-dcs-lf-dcs-l, .dcs-a-dcs-wc-dcs-uc-dcs-l {background: rgba(108, 33, 33, 1) !important;}'
  +
  '.dcs-a-dcs-d .dcs-a-dcs-ob-dcs-bg.dcs-a-dcs-fb {background: none repeat scroll 0% 0% rgba(60, 47, 47, 1) !important;}'
  +
  '.dcs-a-dcs-d .dcs-a-dcs-ag-dcs-e-dcs-f {background: none repeat scroll 0% 0% rgba(105, 24, 24, 1) !important;}'
  +
  '.dcs-a-dcs-rd-dcs-sd, .dcs-a-dcs-fb-dcs-o-dcs-ne div {background-color: rgba(161, 54, 31, 1) !important;}'
  +
  '.dcs-a-dcs-fb-dcs-hc, .dcs-a-dcs-hc, .g-hovercard {color: #EDD !important;}'
  +
  '.dcs-j-dcs-l-dcs-me {background-color: rgba(173, 29, 29, 1) !important; background-image: -moz-linear-gradient(center top , #AD1D1D, rgba(140, 23, 23, 1)) !important; color: #EDD !important;}'
  +
  '.dcs-r-dcs-lf {background: none repeat scroll 0% 0% #563535; border: 1px solid rgba(132, 12, 12, 0.4);}'
  +
  '.dcs-r-dcs-s-dcs-nf, .dcs-r-dcs-s-dcs-qh {background-color: rgba(161, 54, 31, 1) !important; border-color: #(101, 33, 27, 1) !important;}'
  +
  '.dcs-r-dcs-lf {background: none repeat scroll 0% 0% rgba(57, 26, 26, 1) !important;}'
// SLIDES & DRAWINGS
  +
  '.punch-choosethemedialog-thumbnail-content {border: 1px solid rgba(116, 24, 24, 1) !important;}'
  +
  '.punch-choosethemedialog-separator-line {border-bottom: 0px none #000 !important;}'
  +
  '.punch-choosethemedialog-separator-label {background: none repeat scroll 0% 0% #741818 !important;}'
  +
  '.punch-slidethumbnailcontrol-checked {outline: 2px solid rgba(183, 44, 21, 1) !important;}'
  +
  '.punch-slidethumbnailcontrol {border: 1px solid rgba(138, 64, 64, 1) !important; outline: 2px solid rgba(27, 21, 21, 1) !important;}'
  +
  '.punch-choosethemedialog-options {border-bottom: 1px solid #741818 !important;}'
  +
  '.Hd-ie-je-Ic > .Nd-ie-je.Nd-ie-w > .Nd-ie-oe-Mc-Ic, .ke-le-Ob .Hd-ie-je-Ic:focus > .Nd-ie-je.Nd-ie-w > .Nd-ie-oe-Mc-Ic {background-color: rgba(147, 25, 5, 1) !important;}'
  +
  '.Yf-ag-Xb-bg-Wb-cg .a-bg-w, .Yf-ag-Xb-bg-Wb-cg .a-bg, .Yf-ag-Xb-bg-Wb-cg .a-kb-u, .punch-filmstrip-thumbnail-pagenumber {color: #EDD !important;}'
  +
  '.d-u-Q, .qYaiXb {background-color: rgba(141, 30, 11, 1) !important; background-image: -moz-linear-gradient(center top , rgba(138, 36, 19, 0.8), rgba(113, 8, 8, 0.8)) !important;}'
  +
  '.Yf-ag-Xb-bg-Wb-cg .a-bg-w, .a-bg-v {border-color: -moz-use-text-color -moz-use-text-color #AA2712 !important;}'
  +
  '.filmstrip {background: none repeat scroll 0% 0% rgba(39, 29, 29, 1) !important;}'
  +
  '.punch-filmstrip-thumbnail-border {stroke: rgba(125, 29, 29, 1) !important;}'
  +
  '.punch-filmstrip-thumbnail-border-inner, #canvas-container {opacity: .88 !important;}'
  +
  '#workspace-container, .canvas-container {background-color: #271D1D !important; opacity: .88 !important;}'
  +
  '#speakernotes {background: none repeat scroll 0% 0% rgba(68, 11, 11, 1) !important; color: #EDD !important;}'
  +
  '#filmstrip-dragger, #speakernotes-dragger {border-color: rgba(117, 20, 20, 1) !important; background-color: rgba(141, 4, 4, 1) !important;}'
  +
  '#canvas-container .canvas {box-shadow: 0px 0px 2px rgba(126, 22, 22, 1) !important;}'
  +
  '.canvas-vert-border, .canvas-horiz-border {border: 1px solid rgba(144, 40, 40, 1) !important;}'
  +
  '.punch-filmstrip-scroll {border-right: 1px solid rgba(105, 21, 21, 1) !important; opacity: .88 !important;}'
  +
  '#docs-branding-container a {background: #6E170C !important;}'
  +
  '.docs-findinput-container {background: none repeat scroll 0% 0% rgba(62, 47, 47, 1) !important; border-color: rgba(129, 37, 37, 1) rgba(129, 35, 35, 1) rgba(135, 24, 24, 1) !important;}'
// FUSIONTABLES
  +
  '.ft-modal-dialog {background: none repeat scroll 0% 0% rgba(65, 46, 46, 1) !important; border: 1px solid rgba(107, 35, 35, 1) !important;}'
  +
  '.ft-modal-dialog-bg, .ft-modal-dialog-content, .import-wizard-file-chooser-search {background-color: rgba(60, 17, 17, 1) !important;}'
  +
  '.ft-modal-dialog-title {background-color: #412E2E !important; color: #EDD !important;}'
  +
  '.dssp-importResource {border-top: 1px solid #6B2323 !important;}'
  +
  '.dssp-importResourceTab-selected, .dssp-importResourceTab-selected:hover, .gwt-HTML, .gwt-FileUpload {background-color: rgba(125, 31, 31, 1); color: #EDD !important;}'
  +
  '.dssp-importSideBar {border-right: 1px solid #6E170C !important;}'
  +
  '.dssp-importButtonsPanel, .dssp-importDialogHelp {border-top: 1px solid #6E170C !important;}'
  +
  '.common-share-button .goog-button-base-outer-box, .common-share-button .goog-button-base-inner-box, .common-share-button .goog-button-base-top-shadow, .common-share-button .goog-button-base-content {background-color: rgba(146, 35, 16, 1) !important;}'
  +
  '.GIUORE0DCG:focus, .GIUORE0DHB {border: 1px solid rgba(150, 34, 15, 1) !important;}'
  +
  '.GIUORE0DCG, .GIUORE0DHB {background-color: rgba(165, 21, 21, 1) !important; background-image: -moz-linear-gradient(center top , #A51515, rgba(131, 18, 18, 1)) !important; color: #EDD !important;}'
  +
  '.dssp-importResourceTab-selected, .dssp-importResourceTab-selected:hover {background-color: #7D1F1F !important;}'
  +
  '.gwt-HTML, .gwt-FileUpload {background-color: rgba(125, 31, 31, 0) !important;}'
  +
  '.dssp-importResourceTab:hover {background-color: rgba(146, 0, 0, 1) !important;}'
  +
  '.GNV4XGXBNAB {background: none repeat scroll 0% 0% #1B1715 !important;}'
  +
  '.gwt-HorizontalSplitter .Bar, .gwt-SplitLayoutPanel .gwt-SplitLayoutPanel-HDragger {background-color: rgba(87, 13, 13, 1) !important;}'
  +
  '.facet-column-selector .goog-button-base-outer-box, .facet-column-selector .goog-button-base-inner-box, .facet-column-selector .goog-button-base-top-shadow, .facet-column-selector .goog-button-base-content, .gux-menu-button-selected-hover {background-color: rgba(168, 42, 21, 1) !important;}'
  +
  '.viz-tabs .gwt-TabLayoutPanelTabs {background-color: rgba(113, 8, 8, 1) !important;}'
  +
  '.gwt-TabLayoutPanelTabs {background-color: #710808; border-bottom: 1px solid rgba(89, 12, 12, 1);}'
  +
  '.GNV4XGXBMD div {background: none repeat scroll 0% 0% #710808 !important;}'
  +
  '.viz-tabs .gwt-TabLayoutPanelTab, .viz-tabs .gwt-TabLayoutPanelTab-selected {background-color: rgba(158, 21, 21, 1) !important; border-color: rgba(201, 18, 18, 1) rgba(188, 63, 63, 1) -moz-use-text-color -moz-use-text-color !important; color: #EDD !important;}'
  +
  '.sourcepage-topmenu, .gwt-MenuBar {background-color: #9E1515; color: #EDD !important;}'
  +
  '.GNV4XGXBHC.GNV4XGXBOC, .GNV4XGXBGD.GNV4XGXBOC {border-right: 1px solid rgba(134, 23, 23, 1) !important;}'
  +
  '.GNV4XGXBHC.GNV4XGXBOC {border: 2px solid rgba(0, 0, 0, 0) !important;}'
  +
  '.GNV4XGXBFD, .GNV4XGXBGC {background: none repeat scroll 0% 0% rgba(113, 77, 77, 1) !important;}'
  +
  '.GNV4XGXBMC, .GNV4XGXBFC {border-right: 1px solid rgba(126, 32, 32, 1) !important;}'
  +
  '.GNV4XGXBMC {border-color: rgba(147, 25, 25, 0.1) !important; background: #710808 !important; color: #EDD !important;}'
  +
  '.gwt-InlineHTML, .current-query-sql, .mainTitle {color: #EDD !important;}'
  +
  '.GNV4XGXBBG {border: 1px solid rgba(204, 45, 19, 1) !important; background-color: rgba(164, 40, 19, 1) !important; background-image: -moz-linear-gradient(center top , #AB2913, rgba(137, 38, 22, 1)) !important;}'
  +
  '.GNV4XGXBMD div {background: none repeat scroll 0% 0% #1B1715 !important;}'
  +
  '.GNV4XGXBGD {border: 2px solid #714D4D !important;}'
  +
  '.gwt-TabLayoutPanelTabs {border-bottom: 1px solid rgba(75, 12, 12, 1) !important;}'
  +
  '.GNV4XGXBGD.GNV4XGXBOC {border: 2px solid rgba(245, 245, 245, 0) !important;}'
  +
  '.sourcepage-topmenu table, .gwt-MenuBar table {background: #710808 !important; color: #EDD !important;}'
  +
  '.viz-tabs .gwt-MenuItem {color: #EDD !important;}'
  +
  '.viz-tabs .gwt-TabLayoutPanelTab-selected {background: none repeat scroll 0% 0% #9E1515;}'
  +
  '.GNV4XGXBHC, .GNV4XGXBARB {border: 0px solid rgba(255, 255, 255, 0);}'
  +
  '.fusion-color0, .GNV4XGXBARB {background-color: rgba(132, 21, 21, 1) !important;}'
  +
  '.GNV4XGXBHC {border: 0px solid #714D4D !important;}'
  +
  'td.GNV4XGXBFC.GNV4XGXBGD div, .GNV4XGXBGC div, .GNV4XGXBGC div, .GNV4XGXBI- table tbody tr div {background: none repeat scroll 0% 0% #714D4D !important; color: #EDD !important;}'
  +
  '.gwt-DialogBox, .gwt-DialogBox .dialogContent, .ft-modal-dialog-title {background: none repeat scroll 0% 0% rgba(89, 28, 18, 1) !important; border: 1px solid rgba(119, 16, 16, 1) !important;}'
  +
  '.GNV4XGXBEJB, .gwt-CheckBox label {color: #EDD !important;}'
  +
  '.GNV4XGXBMK, .GNV4XGXBMK:focus, .GNV4XGXBMK:hover {background-color: rgba(159, 18, 18, 1) !important; background-image: -moz-linear-gradient(center top , rgba(155, 20, 20, 1), rgba(138, 10, 10, 1)) !important; border: 1px solid rgba(167, 40, 20, 1) !important; color: #EDD !important;}'
  +
  '.GNV4XGXBHJB {border-bottom: 1px solid rgba(140, 26, 26, 1) !important;}'
  +
  '.googft-card-view {border: 1px solid rgba(161, 30, 30, 1) !important; background: rgba(98, 66, 66, 1) !important; color: #EDD !important;}'
  +
  '.GNV4XGXBOD, .GNV4XGXBOE, .GNV4XGXBPE, .GNV4XGXBFE, .GNV4XGXBGE, .GNV4XGXBIE, .GNV4XGXBJE, .GNV4XGXBBF, .GNV4XGXBCF {border: 2px solid rgba(99, 28, 28, 1) !important; background: none repeat scroll 0% 0% rgba(98, 25, 25, 1) !important;}'
  +
  '.GNV4XGXBND, .GNV4XGXBPD {border: 2px solid #621919 !important;}'
  +
  '.viz-tab-first {border-left: 0px solid #000 !important;}'
  +
  '.gwt-MenuItem-selected {background: #843330 !important;}'
  +
  '.GNV4XGXBOIB {border-top: 1px solid rgba(108, 9, 9, 1) !important;}'
  +
  '.gux-combo-item, .gux-combo-item-selected {color: #EDD !important;}'
// OLD DRIVE
  +
  '.jfk-scrollbar .doclist-name {border: 1px solid rgba(255, 255, 255, 0) !important; color: #EDD !important;}'
  +
  '.info-panel-tab-bar .goog-tab.goog-tab-selected {background-color: rgba(238, 238, 238, 0) !important;}'
  +
  '.info-panel-tab-bar .goog-tab-bar-top .goog-tab, .activity-event-section-title, .activity-event-details-header, .activity-event-details, .activity-event-details-container, .activity-event-target.activity-event-target-first, .activity-event-parent, .activity-event-target {color: #EDD !important;}'
  +
  '.activity-list-container, .activity-list-refresh-button-header {background-color: #601717 !important;}'
  +
  '.activity-event {background-color: #2A0B0B !important;}'
  +
  '.activity-event-parent, .activity-event-target.activity-event-target-first {border-bottom: 1px solid rgba(92, 17, 17, 1) !important;}'
  +
  '.activity-event-target {border-top: 1px solid #5C1111 !important;}'
  +
  '.activity-event-target:hover, .activity-event-target:active, .activity-event-target:focus {background-color: rgba(117, 20, 20, 1) !important;}'
  +
  '.info-panel-tab-bar {border-bottom: 1px solid rgba(83, 14, 14, 1) !important;}'
  +
  '.doclist-tr-hover {background-color: #601717 !important;}'
  +
  '.activity-list-static-header .activity-event-section-title {background-color: #601717 !important;}'
  +
  '.dadialog-subheading, .decorated-link {color: rgba(204, 50, 17, 1) !important;}'
  +
  '.dadialog-row {border-top: 1px solid rgba(57, 14, 14, 1) !important;}'
  +
  '.jfk-scrollbar .jfk-tooltip {border: 1px solid rgba(99, 24, 24, 1) !important;}'
  +
  '#doclist .navpane {background-color: #291F1F !important;}'
  +
  '.product-logo {border-bottom: 1px solid #5A1414 !important;}'
  +
  '.goog-list, .goog-list:hover, .goog-list:focus {color: #EDD !important; background: none repeat scroll 0% 0% #291F1F !important;}'
  +
  '.navpane-top-list .goog-listitem {border: 1px solid rgba(89, 33, 33, 1) !important;}'
  +
  '.promo-banner-ndpb {border-color: #5A1414 !important;}'
  +
  '.webstore-R-O-Ob {background: none repeat scroll 0% 0% rgba(32, 25, 25, 1) !important;}'
  +
  '.webstore-C-db-Pe {border-top: 1px solid rgba(77, 23, 23, 1) !important; border-bottom: 0px solid rgba(92, 23, 23, 1) !important;}'
  +
  '.webstore-hb-Jd-jd-Qh .webstore-Pb-ab-uc {background-color: rgba(42, 27, 27, 1) !important; box-shadow: 0px 1px 3px rgba(26, 13, 13, 1) inset !important;}'
  +
  '.webstore-hb-Jd-Pc .webstore-W-ci-Y {border-top: 1px dashed rgba(108, 16, 16, 1) !important;}'
  +
  '.webstore-hb-Jd-Pc .webstore-di-Sh-Gb-Cb-Ig {border: 2px solid rgba(111, 15, 15, 1) !important; box-shadow: -1px 1px 5px rgba(87, 11, 11, 1) !important;}'
  +
  '.webstore-hb-Jd-Pc .webstore-W-rb-W, .webstore-W-rb-ei, .webstore-Pb-ab-tf, .dadialog-subheading {color: #EDD !important;}'
  +
  '.webstore-button-toggle.webstore-button-toggle-checked, .webstore-button-toggle.webstore-button-toggle-selected {border: 1px solid rgba(146, 23, 23, 1) !important; color: rgba(227, 208, 208, 1) !important; background-color: rgba(164, 25, 25, 1) !important; background-image: linear-gradient(to bottom, rgba(168, 17, 17, 1), rgba(132, 11, 11, 1)) !important; box-shadow: 0px 1px 2px rgba(86, 13, 13, 0.1) inset !important;}'
  +
  '.jfk-scrollbar .navpane {background-color: #291F1F !important;}'
  +
  '.jfk-scrollbar .product-logo {border-bottom: 1px solid #5A1414 !important;}'
  +
  '.jfk-scrollbar .goog-list, .jfk-scrollbar .density-tiny {background: none repeat scroll 0% 0% #291F1F !important;}'
  +
  '.navpane .navpane-top-list .goog-listitem {border: 1px solid rgba(75, 36, 36, 1) !important; color: #EDD !important;}'
  +
  '.download-link-pane {color: rgba(182, 22, 22, 1) !important;}'
  +
  '.promo-banner-ndpb {border-color: #5A1414 !important;}'
  +
  '.nav-tree-folder-view .goog-tree-row {border: 1px solid rgba(95, 32, 32, 1) !important;}'
  +
  '.goog-listitem-highlight {background: #601717 !important; background-color: #601717 !important}'
  +
  '.storage-unified .sw-container {border-top: 1px solid rgba(83, 23, 23, 1) !important;}'
  +
  '.storage-unified {background-color: #291F1F !important;}'
  +
  '.viewpane .promo-banner, .doclist-header {color: #EDD !important;}'
// RESEARCH
  +
  '.bsf, .ssb {border-top: 1px solid rgba(84, 11, 11, 1); border-bottom: 1px solid rgba(63, 7, 7, 1);}'
  +
  '.imp {background-color: #1B1715; border: 1px solid #1B1715; color: #EDD !important;}'
  +
  'td.preview-table-subject {background-color: rgba(98, 27, 27, 1) !important;}'
  +
  '.preview-table td {border: 1px solid rgba(74, 21, 21, 1); color: #EDD !important;}'
  +
  '.f td.first, .f th.first, .f .l {border-left: 1px solid rgba(149, 29, 29, 1) !important;}'
  +
  '.f td.first, .f th.first, .f .wt td, .f .wt th {border-color: -moz-use-text-color -moz-use-text-color rgba(149, 25, 25, 1);}'
  +
  '#navbar.n {opacity: .72 !important;}'
  +
  '.preview .subject {background-color: rgba(126, 43, 30, 1) !important;}'
  +
  '.panel .lnsep {border-bottom: 1px solid rgba(56, 19, 19, 1) !important;}'
  +
  '.panel li:hover {background-color: rgba(135, 30, 30, 1) !important;}'
// DEVELOPERS
  +
  'body.docs #gc-appnav, .docs .memitem table #gc-appnav {background: none repeat scroll 0% 0% rgba(87, 11, 11, 1) !important;}'
  +
  '#gc-appbar {border-bottom: 1px solid rgba(77, 15, 15, 1) !important;}'
  +
  '.main .gc-toc li a, .main .gc-toc li .tlw-title {color: rgba(180, 21, 21, 1) !important;}'
  +
  'body.docs h1, body.docs h1 code, body.docs .page-title, .slim #gc-appbar, .slim #gc-main, body.docs h2, body.docs h2 code, #gc-content h2, #gc-content h3, .pln {color: #EDD !important;}'
  +
  'body.docs h2:after, .docs .memitem table h2:after {background: none repeat scroll 0% 0% #4D0F0F !important;}'
  +
  'body.docs pre, .docs .memitem table pre {background-color: rgba(60, 3, 3, 1) !important; border: 1px solid rgba(84, 6, 6, 1) !important;}'
  +
  '#gc-content .special {background-color: rgba(81, 19, 9, 1) !important; border-left-color: rgba(158, 30, 9, 1) !important;}'
  +
  'form.search input:not([type]), form.search input[type="text"], form.search textarea {border-right: 1px solid rgba(158, 20, 20, 1) !important; border-color: rgba(156, 25, 25, 1) rgba(156, 34, 34, 1) rgba(126, 13, 13, 1) !important; background: rgba(56, 45, 45, 1) !important; color: #EDD !important;}'
  +
  'body a.button-blue.big, body .button-blue.big, body button.button-blue.big, #searchbox .button-blue {background-color: rgba(129, 29, 12, 1) !important; border-color: rgba(146, 34, 15, 1) !important; background-image: -moz-linear-gradient(center top , rgba(177, 41, 19, 1), rgba(138, 31, 13, 1)) !important;}'
  +
  '.maia-max #maia-header #search-wrapper #searchbox {background-color: #382D2D !important;}'
  +
  '.kd-button, .service-name, .editor .illustration-caption, .illustration-caption {color: #EDD !important;}'
  +
  '.kd-menulistitem:hover, .kd-menulistitem.selected {background-color: rgba(93, 20, 20, 1) !important;}'
  +
  '.carousel > .frame {border: 1px solid rgba(89, 22, 22, 1) !important;}'
  +
  '.carousel {background-color: rgba(53, 6, 6, 1) !important; box-shadow: 2px 1px 12px rgba(71, 8, 8, 1) !important;}'
  +
  '.carousel > a {background-color: rgba(135, 16, 16, 1) !important;}'
  +
  '.features {background: none repeat scroll 0% 0% #1B1715 !important;}'
  +
  '.middlefeature {background: none repeat scroll 0% 0% rgba(35, 25, 25, 1) !important; border: 1px solid rgba(66, 15, 15, 1) !important;}'
  +
  '.item-card {border: 1px solid rgba(74, 14, 14, 1) !important; box-shadow: 3px 3px 6px 0px rgba(63, 13, 13, 0.6) !important;}'
  +
  '.item-card img, .carousel .scale, #gplus-icon, #forms-icon, .maia-max .illustration, .maia-max .editor {opacity: .8 !important;}'
  +
  '#sandbar {background: none repeat scroll 0% 0% rgba(69, 36, 36, 1); border-bottom: 1px solid rgba(78, 27, 27, 1);}'
  +
  '.button-container .button:focus, .button-container .button, .button-container .button:hover, .button-blue, .button-blue:hover, .button-blue:focus {border: 1px solid rgba(117, 28, 13, 1) !important; background: -moz-linear-gradient(center top , rgba(174, 17, 17, 1), rgba(131, 12, 12, 1)) repeat scroll 0% 0% transparent !important;}'
  +
  '.docs #gc-appnav + #gc-appbar, .docs .memitem table #gc-appnav + #gc-appbar {opacity: 0.72 !important;}'
  +
  '.maia-max hr {background-color: rgba(84, 17, 17, 1) !important; border-color: rgba(84, 12, 12, 1) -moz-use-text-color -moz-use-text-color !important;}'
  +
  'body.docs a code, body.docs a kbd, .docs .memitem table a code, .docs .memitem table a kbd {color: rgba(185, 40, 16, 1) !important;}'
  +
  '.maia-max .button {-moz-linear-gradient(center top , rgba(149, 32, 32, 1), rgba(113, 15, 15, 1)) repeat scroll 0% 0% transparent;}'
  +
  '.main .gc-toc a:hover {background-color: rgba(86, 10, 10, 1) !important;}'
  +
  '.docs table th {border: 1px solid rgba(168, 39, 18, 1) !important;}'
  +
  '.main tr th {background-color: rgba(165, 37, 15, 1) !important;}'
  +
  'body.docs table td {border: 1px solid rgba(84, 18, 18, 1) !important;}'
  +
  '.warning {background-color: rgba(125, 8, 8, 1) !important;}'
// THINK INSIGHTS
  +
  '#lcs-nav-x, #lcs-nav-x.lcs-compact h1 {color: #EDD !important; background: -moz-linear-gradient(center top , rgba(144, 36, 14, 1) 0%, rgba(123, 29, 14, 1) 100%) repeat scroll 0% 0% transparent !important;}'
  +
  '#lcs-nav-x ul ul {background: none repeat scroll 0% 0% #571C1C !important;}'
  +
  '#lcs-nav-x ul ul li {border-bottom: 1px dotted rgba(240, 177, 177, 1) !important;}'
  +
  '#lcs-nav-x li:hover a {background: none repeat scroll 0% 0% #571C1C !important;}'
  +
  '.lcs-intro .head {background: none repeat scroll 0% 0% rgba(87, 16, 16, 1) !important;}'
  +
  '.lcs-banner.yellow {background: none repeat scroll 0% 0% rgba(57, 14, 7, 1) !important;}'
  +
  '.lcs-article .lcs-col-article {background: none repeat scroll 0% 0% rgba(30, 16, 15, 1) !important;}'
  +
  '.lcs-article .lcs-col-aside {background: none repeat scroll 0% 0% #390E07 !important;}'
  +
  '.lcs-ancillary.horizontal {background: none repeat scroll 0% 0% #390E07 !important; border-top: 1px solid #2C0E0E !important;}'
  +
  '.lcs-ancillary.horizontal .item {border-right: 1px solid rgba(105, 21, 21, 1) !important;}'
  +
  '.lcs-ancillary .item, .lcs-product-detail.product .features-list li {border-bottom: 1px dotted rgba(89, 28, 28, 1) !important;}'
  +
  '.lcs-share.full {border-top: 1px solid rgba(87, 23, 23, 1) !important; border-bottom: 1px solid #571717 !important;}'
  +
  '#lcs .clearfix {border-radius: 5px; !important;}'
  +
  '#lcs .footer {background: none repeat scroll 0% 0% #261717 !important;}'
  +
  '.lcs-title, .lcs-title strong {color: #EDD !important;}'
  +
  '.lcs-intro .rundown {border-top: 1px solid rgba(8, 2, 2, 1) !important;}'
  +
  '.lcs-ancillary a.image img {outline: 1px solid rgba(102, 24, 24, 1) !important;}'
  +
  '.lcs-products-tools .lcs-tools-banner {background: none repeat scroll 0% 0% #390E07 !important;}'
  +
  '.lcs-creative-sandbox-v2, .lcs-creative-sandbox-scrollfloater {background: none repeat scroll 0% 0% #1B1715 !important;}'
  +
  '.lcs-products-tools.secondary-landing .items .image img {outline: 1px solid rgba(128, 22, 22, 1) !important;}'
  +
  '.lcs-products-tools.secondary-landing .items > div {border-bottom: 1px dotted rgba(92, 20, 20, 1) !important;}'
  +
  '#lcs .hr {border-bottom: 1px dotted rgba(107, 27, 27, 1) !important;}'
  +
  '.lcs-search-grid .lcs-col-sub {background: none repeat scroll 0% 0% #1B1715 !important;}'
  +
  '.lcs-ancillary.rail {border-top: 1px solid #591C1C !important;}'
  +
  '.lcs-search-grid .ttl-main {background: none repeat scroll 0% 0% rgba(80, 17, 17, 1);}'
  +
  '.lcs-search-grid .lcs-col-main {background: none repeat scroll 0% 0% #501111; box-shadow: -5px 0px 3px -2px rgba(78, 16, 16, 1);}'
  +
  '.lcs-search-grid .intro {border-bottom: 1px dotted rgba(32, 25, 25, 1) !important; color: #EDD !important;}'
  +
  '.lcs-search-filters .column-container > li {border-color: rgba(33, 11, 11, 1) !important;}'
  +
  '.lcs-search-filters .column-container > li {background-color: rgba(56, 25, 25, 1) !important;}'
  +
  '.lcs-banner.has-image {opacity: 0.8 !important;}'
  +
  '.lcs-search-filters .filter-group > div.filter-container {background: none repeat scroll 0% 0% rgba(36, 28, 28, 1) !important; border-color: rgba(99, 14, 14, 1) !important;}'
  +
  '.lcs-search-filters .column-container .column.expanded {border-bottom-color: #241C1C !important;}'
  +
  '.lcs-search-filters .column.expanded {background-color: #241C1C !important;}'
  +
  '.lcs-search-filters .filter, .lcs-intro h1, .lcs-intro .rundown .summary {color: #EDD !important;}'
  +
  '.lcs-cards.featured {border: 1px solid rgba(78, 11, 11, 1) !important; box-shadow: 0px 2px 2px -1px rgba(18, 7, 7, 1) !important;}'
  +
  '.lcs-cards.featured > .img {border: 1px solid rgba(93, 17, 17, 1) !important;}'
  +
  '.lcs-campaign-v2 .module.overview {background: none repeat scroll 0% 0% rgba(47, 3, 3, 1) !important;}'
  +
  '.lcs-campaign-v2 .module.story, .lcs-campaign-v2 .module.results, .lcs-campaign-v2 .module.team, .lcs-campaign-v2 .module.more-like-this {background-image: none !important; background-color: rgba(33, 6, 6, 1) !important;}'
  +
  '.lcs-campaign-v2 .module.more-like-this select {border-color: -moz-use-text-color -moz-use-text-color rgba(105, 27, 14, 1) !important; color: rgba(111, 30, 17, 1) !important;}'
  +
  '.lcs-campaign-v2 .module.results .stats li {border-right: 1px dotted rgba(105, 27, 14, 1);}'
  +
  '#maia-main form input:focus:not([type]), #maia-main form input[type="text"]:focus, #maia-main form textarea:focus {border-color: rgba(162, 43, 23, 1);}'
  +
  '#maia-main form input:not([type]), #maia-main form input[type="text"], #maia-main form textarea {background: rgba(45, 33, 33, 1) !important; border-right: 1px solid rgba(122, 26, 26, 1) !important; border-color: rgba(117, 22, 22, 1) rgba(141, 17, 17, 1) rgba(110, 13, 13, 1) !important; color: #EDD;}'
  +
  '.lcs-cards-overview > li:after {background: linear-gradient(to bottom, rgba(62, 6, 6, 0) 0%, rgba(78, 15, 15, 1) 80%) repeat scroll 0% 0% transparent;}'
  +
  '.lcs-cards > li {border: 1px solid rgba(84, 17, 17, 1); box-shadow: 0px 2px 2px -1px rgba(56, 11, 11, 1);}'
  +
  '.lcs-banner.red-dark, .lcs-banner.teal, .lcs-banner.green, .lcs-banner.green-light {background-color: #390E07 !important;}'
  +
  '.lcs-infographic {border: 1px solid rgba(77, 17, 17, 1) !important;}'
// PARTNERS
  +
  '.header-container .header-bg {background-color: rgba(77, 20, 20, 1) !important;}'
  +
  '#section-01, #section-05 {background-color: rgba(44, 20, 20, 1); opacity: 0.72;}'
  +
  '.phone .email .body, .phone.agency .email .body p.heading {color: #633 !important;}'
  +
  '#section-03, .badge-content .badge-img {opacity: .8;}'
  +
  '.content h2 {color: rgba(146, 25, 25, 1) !important;}'
  +
  '#section-04 .columns .col {background: none !important;}'
  +
  'p.learn-more {border-top: 1px solid rgba(78, 22, 22, 1) !important;}'
  +
  '.GOKM5YFBE1 {background-color: rgba(59, 11, 11, 1) !important; border-bottom: 1px solid rgba(68, 22, 22, 1) !important; border-top: 1px solid rgba(72, 21, 21, 1) !important;}'
  +
  '.GOKM5YFBO0 {background-color: rgba(54, 10, 10, 1) !important;}'
  +
  '.header-mask {background: none repeat scroll 0% 0% rgba(33, 17, 17, 1) !important;}'
  +
  '.global {background: none repeat scroll 0% 0% rgba(47, 20, 15, 1); border: 1px solid rgba(69, 26, 19, 1);}'
  +
  '.global > .maia-col-3:after, .segment .maia-col-3:first-child:after {border-right: 1px dashed rgba(102, 15, 15, 1);}'
  +
  '.bs-hero {background: -moz-linear-gradient(center top , #1B1715 0%, #1B1715 100%) repeat-x scroll left bottom / 165px 165px #1B1715 !important;}'
  +
  '.google-js .gweb-pagination-ready {border-radius: 12px !important;}'
  +
  '.gweb-pagination-nav {border-top: 0px solid #1B1715 !important;}'
  +
  '.overview-page #maia-footer {background: none repeat scroll 0% 0% #261717 !important;}'
  +
  '.overview-gradient {background: linear-gradient(to bottom, rgba(56, 5, 5, 1) 0px, rgba(56, 7, 7, 1) 50%, rgba(80, 9, 9, 1) 60%, rgba(35, 5, 5, 1) 100%) repeat scroll 0px 0px transparent !important; border-bottom: 1px solid rgba(50, 11, 11, 1) !important;}'
// MY BUSINESS
  +
  '.xi {background-color: rgba(81, 11, 11, 1); border-bottom: 1px solid rgba(74, 16, 16, 1); border-top: 1px solid rgba(99, 15, 15, 1);}'
  +
  '.av, .yr {color: #EDD !important;}'
  +
  '.c-E-j-d, .Re.e-d {background-color: rgba(167, 25, 25, 1) !important; background-image: -moz-linear-gradient(center top , rgba(143, 19, 19, 1), rgba(120, 5, 5, 1)) !important; border: 1px solid rgba(144, 16, 16, 1) !important;}'
  +
  '.hk .Of, .hk .Of:focus {border-color: #A12713 -moz-use-text-color #A22D19 rgba(158, 43, 24, 1); background: rgba(52, 32, 32, 1) !important; color: #EDD !important;}'
  +
  '.hk .Pc {border-color: rgba(54, 21, 16, 1) !important;}'
  +
  '.hk .Pc:hover, .hk .Pc:focus, .hk .Pc:active {background: rgba(94, 26, 26, 1) !important;}'
  +
  '#gbq1 {background: none repeat scroll 0% 0% #393939 !important;}'
  +
  '.rg .Ml {color: rgba(216, 49, 22, 1) !important;}'
  +
  '.Qpa.Ppe, .gmb-footer-bar-container {background-color: rgba(56, 8, 8, 1);}'
  +
  '.P1Ktjc, .gmb-header-bar {background-color: #2D2B2B; border-bottom: 1px solid rgba(39, 24, 24, 1);}'
  +
  '.z151Ld, .gmb-signup-title {color: rgba(188, 43, 43, 1);}'
  +
  '.gmb-header-bar {background-color: rgba(48, 41, 41, 1); border-bottom: 1px solid rgba(59, 35, 35, 1); border-top: 1px solid rgba(77, 46, 46, 1);}'
  +
  '.gmb-header-title, .checkbox-label, .gmb-signup-section {color: #EDD !important;}'
  +
  '.gmb-header-bar-container {border-top: 1px solid rgba(71, 42, 42, 1);}'
  +
  'select.gmb-signup-select:focus, select.gmb-signup-select:hover, input.gmb-signup-input:focus, input.gmb-signup-input:hover {border: 1px solid rgba(137, 27, 9, 1);}'
  +
  '.gmb-signup-section #recaptcha_widget.recaptcha-widget, .main select.gmb-signup-select, .main input.gmb-signup-input {background: #000 !important; border: 1px solid rgba(86, 12, 12, 1) !important; color: #EDD;}'
  +
  '.gmb-signup-idv input[type="submit"]:focus, input.g-button.gmb-signup-button-back:focus, input.g-button.gmb-signup-button-create:focus {outline: 4px solid rgba(199, 220, 252, 0);}'
  +
  '.gmb-signup-idv input[type="submit"]:focus, .gmb-signup-idv input[type="submit"]:hover, input.g-button.gmb-signup-button-create:focus, input.g-button.gmb-signup-button-create:hover {border: 1px solid rgba(146, 34, 15, 1) !important; color: #EDD;}'
  +
  '.gmb-signup-button-create {background-color: rgba(141, 25, 6, 1) !important; border: 1px solid rgba(86, 23, 12, 1) !important;}'
  +
  '.gmb-signup-button-back {border: 1px solid rgba(86, 23, 12, 1) !important;}'
  +
  '.g-button-white:hover {background: none repeat scroll 0% 0% rgba(53, 20, 20, 1); color: #EDD;}'
  +
  '.wrapper {background-color: #1B1715;}'
// FLIGHTS
  +
  '.GHDPAWGMXC {border-bottom: 1px solid rgba(81, 10, 10, 1) !important;}'
  +
  '.GHDPAWGB2B {background: none repeat scroll 0% 0% rgba(54, 38, 38, 1) !important;}'
  +
  '.GHDPAWGKN, .GHDPAWGKN:focus {background-color: rgba(113, 18, 18, 1) !important; background-image: -moz-linear-gradient(center top , rgba(161, 18, 18, 1), rgba(129, 18, 18, 1)) !important; border: 1px solid rgba(89, 11, 11, 1) !important;}'
  +
  '.GHDPAWGGSB {border-top: 3px solid rgba(149, 34, 15, 1) !important;}'
  +
  '.GHDPAWGGUB {background-color: #362626 !important;}'
  +
  '.GHDPAWGI4 {background: none repeat scroll 0% 0% rgba(108, 16, 16, 1) !important; border-color: rgba(156, 20, 20, 1) rgba(153, 20, 20, 1) rgba(132, 16, 16, 1) !important;}'
  +
  '.GHDPAWGLTB .popupContent {background: none repeat scroll 0% 0% rgba(75, 32, 32, 1) !important; box-shadow: 1px 2px 5px rgba(77, 22, 22, 0.25) !important;}'
  +
  '.GHDPAWGLTB, .GHDPAWGDPB, .GHDPAWGDPB:focus, .GHDPAWGDPB:hover, .GHDPAWGDPB:active {border: 1px solid rgba(116, 12, 12, 1) !important;}'
  +
  '.GHDPAWGBOB {background-color: #6C1010 !important;}'
  +
  '.GHDPAWGO1B, .GHDPAWGPXC, .GHDPAWGKN, .GHDPAWGKN.GHDPAWGJXB {color: #EDD !important;}'
  +
  '.GHDPAWGHSB {opacity: 0.8 !important;}'
  +
  '.GHDPAWGERB, .GHDPAWGETB {background: none repeat scroll 0% 0% rgba(57, 12, 12, 0.7) !important;}'
  +
  '.GHDPAWGAS.GHDPAWGNR.GHDPAWGGS, .GHDPAWGAS.GHDPAWGNR.GHDPAWGGS:hover {border-color: rgba(129, 22, 22, 1);}'
// CHROME
  +
  '.webstore-O-P-Ib {background-color: rgba(71, 20, 20, 1) !important;}'
  +
  '.webstore-O-P-Ob {background-color: rgba(42, 27, 27, 1) !important;}'
  +
  '.webstore-qb-O-P-Ke-kf, .webstore-qb-O-P-Ke, .webstore-O-P-nd {background-color: rgba(144, 20, 20, 1) !important; background-image: -moz-linear-gradient(center top , rgba(125, 19, 19, 0.74) 0%, rgba(147, 49, 49, 0.72) 20%, rgba(21, 18, 18, 0.05) 100%) !important; color: #EDD !important;}'
  +
  '.webstore-O-P-nd.webstore-tab-selected {background: none repeat scroll 0% 0% rgba(102, 38, 38, 1) !important; box-shadow: 0px 3px 2px -2px rgba(59, 18, 18, 0.25) inset !important;}'
  +
  '.webstore-qb-O-P-Ke-kf, .webstore-qb-O-P-Ke, .webstore-O-P-nd {border-top: 1px solid rgba(113, 23, 23, 1) !important; border-right: 1px solid rgba(69, 38, 38, 1) !important;}'
  +
  '.webstore-Ah {background: none repeat scroll 0% 0% rgba(137, 38, 22, 1) !important; border: 1px solid rgba(153, 60, 45, 1) !important;}'
  +
  '.webstore-qb-O-P-Ke-kf, .webstore-qb-O-P-Ke, .webstore-O-P-nd {border-bottom: 1px solid rgba(123, 27, 27, 1) !important; box-shadow: 0px 2px 1px 1px rgba(135, 30, 30, 1) inset !important;}'
  +
  '.webstore-O-P-Hb, .webstore-e-t, .webstore-kb-T-vb, .webstore-Vb-nd-bc-Db-t, .webstore-Vb-nd-bc-Db-Wb, .webstore-Vb-nd-bc-C-cc, .webstore-Vb-nd-bc-C-rh, .webstore-menuitem-content {color: #EDD !important;}'
  +
  '.webstore-Of-P {background-color: #2A1B1B !important;}'
  +
  '.webstore-button.webstore-ae-sc-fe {border-color: rgba(147, 46, 29, 1) !important; background-color: rgba(144, 43, 26, 1) !important; background-image: linear-gradient(to bottom, rgba(161, 37, 17, 1), rgba(128, 30, 14, 1)) !important;}'
  +
  '.webstore-Vb-nd-ec.webstore-ec-Pc-wc {border: 2px solid rgba(90, 26, 15, 1) !important;}'
  +
  '.webstore-Vb-nd-bc-C-Bc-i {color: rgba(144, 49, 33, 1) !important; text-shadow: 0px 1px rgba(158, 19, 19, 0.8) !important;}'
  +
  '.webstore-Pc-P-V {background-color: rgba(44, 15, 15, 0.55) !important;}'
  +
  '.webstore-qi, .webstore-S-ig-cb-Gb, .webstore-S-Z-ec.webstore-ec-bc-cd {opacity: .8;}'
  +
  '.webstore-hb-Jd-Hb, .webstore-button-toggle, .webstore-S-hg-cb-Hb, .webstore-S-ig-cb-Hb, .webstore-S-s-ig-cb-Hb, .webstore-S-ne-cb-Hb, .webstore-S-Ne-cb-Hb, .webstore-ah-sc-bh, .webstore-S-db-Ib-Hb {color: #EDD !important;}'
  +
  '.webstore-button-toggle {border: 1px solid rgba(84, 9, 9, 1) !important; background-color: rgba(125, 41, 41, 1) !important; background-image: linear-gradient(to bottom, rgba(81, 12, 12, 1), rgba(60, 5, 5, 1)) !important;}'
  +
  '.webstore-H-nd-Ib {text-shadow: 0px 1px rgba(75, 8, 8, 0.8) !important; color: rgba(135, 19, 19, 1) !important;}'
  +
  '.webstore-If-nd .webstore-If-Fc, .webstore-If-nd .webstore-Lh-Fc {border-top: 1px solid rgba(84, 18, 18, 1) !important; border-left: 1px solid #541212 !important;}'
  +
  '.webstore-Rf-r-V {background: #443 !important;}'
  +
  '.webstore-ac-Db {background-color: rgba(42, 25, 25, 1) !important;}'
  +
  '.webstore-Pc-ac-Jd {border-right: 1px solid rgba(42, 18, 18, 1) !important;}'
  +
  '.webstore-Pc-k-V {background-color: rgba(21, 5, 5, 1) !important; border-left: 1px solid rgba(90, 18, 18, 1) !important;}'
  +
  '.webstore-ac-Db-Rb-zg {text-shadow: 0px 1px rgba(255, 255, 255, 0) !important;}'
  +
  '.webstore-qb-ac-Db-Mg input:focus, .webstore-qb-ac-Db-Mg input.webstore-ac-Db-ad-Nb-Ng-Og {border: 1px solid rgba(129, 41, 27, 1) !important;}'
  +
  '.webstore-ac-Db-Pg-Bc-Vc {background: none repeat scroll 0% 0% rgba(105, 29, 17, 1) !important;}'
  +
  '.webstore-S-db-Ib {background-color: rgba(41, 25, 25, 1) !important; border-right: 1px solid rgba(56, 33, 33, 1) !important; border-bottom: 1px solid rgba(48, 14, 14, 1) !important;}'
  +
  '.webstore-S-db-Ib-i:focus, .webstore-S-db-Ib-i:hover {background-color: rgba(56, 31, 31, 1) !important;}'
  +
  '.webstore-menu {background: none repeat scroll 0% 0% #471818 !important; border: 1px solid rgba(110, 16, 16, 0.74) !important;}'
  +
  '.webstore-S-Z .webstore-qi, .webstore-S-cb-rc .webstore-qi, .webstore-ec-V {opacity: 1 !important;}'
  +
  '.webstore-S-Z-ec, .webstore-S-s-Ib-xc {opacity: .72 !important;}'
  +
  '.webstore-S-s-Ib {background-color: rgba(72, 10, 10, 1) !important;}'
  +
  '.webstore-S-ig-cb-kg, .webstore-S-ne-cb-kg {color: #EDD !important;}'
// FONTS
  +
  '.main-panel div div div #header {background-color: rgba(66, 14, 14, 1) !important;}'
  +
  '.GFJLF-C {background: rgba(33, 20, 20, 1) !important;}'
  +
  '.use .section, .use .card {border-bottom: 1px solid rgba(89, 17, 17, 1) !important;}'
  +
  '.use .card {background: none repeat scroll 0% 0% rgba(36, 19, 19, 1) !important; box-shadow: 0px 1px 1px rgba(54, 14, 14, 1) !important; border: 1px solid rgba(75, 10, 10, 1);}'
  +
  '.collection {background: none repeat scroll 0% 0% rgba(30, 10, 10, 1) !important; border-top: 1px solid rgba(48, 8, 8, 1) !important; border-bottom: 1px solid rgba(47, 9, 9, 1) !important;}'
  +
  '.quick-use-nav .summary, .fontlist .identifier {color: #EDD !important;}'
  +
  '.content div h2 {border-top: 1px solid rgba(57, 11, 11, 1) !important;}'
  +
  'pre {background-color: rgba(59, 24, 19, 1); border: 1px solid rgba(81, 19, 19, 1);}'
  +
  '.GFJLF-G.GFJLF-H {border-top: 1px solid rgba(150, 25, 25, 1) !important; border-left: 1px solid rgba(165, 26, 26, 1) !important; border-right: 1px solid rgba(170, 24, 24, 1) !important; border-bottom: 1px solid rgba(87, 10, 10, 1) !important;}'
  +
  '.GFJLF-F {border-bottom: 1px solid #541111 !important;}'
  +
  '.fontcard {border: 1px solid rgba(74, 18, 18, 1) !important; background: none repeat scroll 0% 0% rgba(53, 5, 5, 1) !important; box-shadow: 0px 1px 1px rgba(23, 3, 3, 1) !important;}'
  +
  '.fontlist .fontcard:hover, .paragraphview .fontcard:hover, .glyphview .fontcard:hover {box-shadow: 0px 1px 1px rgba(119, 16, 16, 1) !important;}'
  +
  '.GFJLF-NG.GFJLF-CG:hover, .GFJLF-NG.GFJLF-IG {border-color: rgba(161, 33, 12, 1) !important;}'
  +
  '.filters .tools {background: none repeat scroll 0% 0% rgba(86, 18, 18, 1) !important; border: 1px solid rgba(95, 18, 18, 1) !important;}'
  +
  '.filters .tools .toolheader {background: no-repeat scroll 5px 8px #561212 !important;}'
  +
  '.GFJLF-G.GFJLF-H {border-bottom: 1px solid rgba(98, 24, 24, 1) !important;}'
  +
  '.GFJLF-NG {border-color: rgba(128, 31, 15, 1) !important;}'
  +
  '.expand a {border: 1px solid rgba(0, 0, 0, 0.1) !important; background-color: rgba(111, 16, 16, 1) !important;}'
  +
  '.ita-kd-icon-button {border: 1px solid rgba(119, 21, 21, 1) !important; background-color: rgba(122, 18, 18, 1); background-image: -moz-linear-gradient(center top , rgba(134, 13, 13, 1), rgba(101, 16, 16, 1)) !important;}'
  +
  '.GFJLF-CB {border-color: rgba(137, 26, 26, 1) !important;}'
  +
  '.collection .collectionitem {border-bottom: 1px solid rgba(57, 11, 11, 1) !important;}'
  +
  '.collectionitem span, .oops, .collection .emptycollection {color: #EDD !important;}'
  +
  '.GFJLF-LB {border-bottom: 1px solid rgba(75, 13, 13, 1) !important;}'
  +
  '.GFJLF-FQ {background-color: rgba(56, 15, 15, 1) !important; border: 1px solid rgba(96, 14, 14, 1) !important; box-shadow: 3px 3px 10px rgba(39, 6, 6, 1) !important;}'
  +
  '.GFJLF-HQ {background: rgba(107, 21, 21, 1) !important; border: 1px solid rgba(135, 13, 13, 1) !important;}'
  +
  '.static-content {border: 1px solid #211414 !important; background: none repeat scroll 0% 0% #211414 !important; box-shadow: 0px 1px 1px #211414 !important;}'
  +
  'body.docs code, body.docs pre, body.docs kbd, .docs .memitem table code, .docs .memitem table pre, .docs .memitem table kbd {color: rgba(186, 37, 13, 1) !important;}'
  +
  'div.ss-form-container, .popup {background-color: #1B1715 !important; border: 1px solid rgba(51, 13, 13, 1) !important;}'
  +
  'div.ss-form-container {background-image: none !important;}'
  +
  'h1.ss-form-title {border-bottom: 1px solid rgba(57, 5, 5, 1) !important;}'
  +
  '.ss-form-entry input, .ss-q-long, .ss-q-short {background: rgba(41, 27, 27, 1) !important; color: #EDD !important; border: 1px solid #622;}'
  +
  '.disclaimer-separator {border-top: 1px solid rgba(53, 13, 13, 1) !important;}'
  +
  '.GFJLF-C {margin-top: 0px !important;}'
  +
  '.GFJLF-G.GFJLF-H {border-bottom: 1px solid rgba(131, 20, 20, 1) !important;}'
  +
  '.popup, .homepage #container, .unsupported #container {background-color: #380F0F !important;}'
  +
  '.gwt-TextBox {box-shadow: 0px 1px 1px rgba(51, 7, 7, 1) !important;}'
  +
  '#container h1 {color: rgba(234, 67, 39, 1);}'
  +
  '.homepage #container, .unsupported #container {background-color: #661818 !important; border: 1px solid #661818 !important; box-shadow: 3px 3px 10px rgba(62, 21, 21, 1) !important;}'
  +
  '.gwt-PopupPanel, .hoverpopup, .hovercard, .normal-appearance {background: #211414 !important;}'
  +
  '.gwt-PopupPanel, .hoverpopup {border: 1px solid #600; box-shadow: 3px 3px 10px rgba(62, 21, 21, 1) !important;}'
  +
  '.GFJLF-MB.GFJLF-NB {border-top: 1px solid rgba(132, 18, 18, 1) !important;}'
// GMAIL NOTSIGNEDUP
  +
  '#features-inbox-expand-button, #features-inbox-collapse-button {background: linear-gradient(to bottom, rgba(102, 10, 10, 1) 0px, rgba(93, 9, 9, 1) 24%, rgba(75, 13, 13, 1) 95%, rgba(81, 10, 10, 1) 100%) repeat scroll 0% 0% transparent;}'
  +
  '#inbox-one {border-top: 2px solid #544 !important; background-color: rgba(105, 11, 11, 1);}'
  +
  '.features-inbox-tab {background-color: rgba(71, 43, 43, 1) !important; border-top: 2px solid rgba(57, 29, 29, 1) !important; border-left: 1px solid rgba(105, 12, 12, 1) !important;}'
  +
  '#features-action, .gmail-features-video, .attachments-bg, .gmail-step gmail-features-hangouts, .gmail-contrast, .features-compose-animation, .gmail-step, .gmail-features-drive, .gmail-tablet-features, .mobile-features, .gmail-work {opacity: .7;}'
// GOO.GL
  +
  '.gbh, .gbd {border-top: 1px solid rgba(135, 29, 12, 1) !important;}'
  +
  '.GJUPD0RBFJ {background: none repeat scroll 0% 0% rgba(68, 14, 14, 1) !important; border-bottom: 1px solid rgba(48, 14, 14, 1) !important;}'
  +
  '.GJUPD0RBFJ a img, .GJUPD0RBAQ {opacity: .8 !important;}'
  +
  '.GJUPD0RBPP {background-color: rgba(56, 27, 27, 1) !important; border: 1px solid rgba(86, 13, 13, 1) !important;}'
  +
  '.GJUPD0RBOP, .GJUPD0RBOP div {color: #EDD !important;}'
  +
  '.GJUPD0RBGQ, .GJUPD0RBGQ:focus {box-shadow: 0px 1px 2px rgba(140, 11, 11, 0.3) inset !important; border: 1px solid rgba(140, 34, 17, 1) !important; background-color: rgba(63, 47, 47, 1) !important;}'
  +
  'a.gb1, a.gb2, a.gb3, a.gb4, .GJUPD0RBOO, .GJUPD0RBNO a, .GJUPD0RBBO a {color: rgba(191, 40, 15, 1) !important;}'
  +
  '.GJUPD0RBFD {color: #EDD !important; border-top: 1px solid rgba(95, 17, 17, 1) !important; border-bottom: 1px solid #5F1111 !important;}'
  +
  '.GJUPD0RBML {box-shadow: 0px 1px 1px rgba(135, 24, 24, 0.25) !important; background-color: rgba(107, 23, 23, 1) !important; border: 1px solid rgba(116, 21, 21, 1) !important; color: #EDD !important; background-image: -moz-linear-gradient(center top , rgba(126, 17, 17, 1), rgba(89, 6, 6, 1)) !important;}'
  +
  '.GJUPD0RBKL {background: -moz-linear-gradient(center top , rgba(141, 14, 14, 1), rgba(113, 15, 15, 1)) repeat scroll 0% 0% rgba(123, 19, 19, 1) !important; border: 1px solid rgba(129, 15, 15, 1) !important;}'
  +
  '.GJUPD0RBIK, .GJUPD0RBIL {background-color: rgba(138, 29, 11, 1) !important; border: 1px solid rgba(141, 28, 10, 1) !important; color: #EDD !important; background-image: -moz-linear-gradient(center top , rgba(149, 28, 8, 1), rgba(119, 24, 8, 1)) !important;}'
  +
  '.GJUPD0RBHJ {border-top: 1px solid rgba(99, 24, 24, 1) !important;}'
// FIX
  +
  '#mngb, #gb, .gb_Sb, .gb_Bb, .gb_Sb, .gb_Pc, #top_nav {background-color: #393939 !important;}'
  +
  '#vasquette .gb_f {color: rgba(71, 16, 16, 1) !important;}'
  +
  '#omnibox .searchbox, #cards .cards-card {background-color: rgba(78, 68, 68, 1);}'
  +
  '.sbox-focus {border: 1px solid rgba(53, 20, 20, 1) !important;}'
  +
  '.suggestions > tbody > tr + tr .suggest {border-top: 1px solid rgba(147, 7, 7, 1) !important;}'
  +
  '.suggest-bg {background: rgba(63, 39, 39, 1) !important;}'
  +
  '#app-container .gb_Pc {background-color: rgba(57, 57, 57, 0.3) !important;}'
  +
  '.suggest-query, .cards-intent-map-title, .cards-intent-map-show, .G-atb .T-I-ax7 {color: #EDD !important;}'
  +
  '.cards-vertical-divider {background: -moz-linear-gradient(center top , rgba(123, 15, 15, 1), rgba(182, 17, 17, 1), rgba(108, 18, 18, 1)) repeat scroll 0% 0% transparent !important;}'
  +
  '.aAU .yb, .hR {background-color: rgba(147, 30, 11, 1) !important; color: #EDD !important;}'
  +
  '.aAU .ya {border-bottom: 1px solid rgba(98, 12, 12, 1) !important;}'
  +
  '.a3s div div table tbody tr td {background-color: #2C1818 !important;}'
  +
  '.hU .hM {background-color: rgba(87, 20, 20, 1) !important;}'
  +
  '.hV .hM {background-color: rgba(36, 31, 31, 1) !important;}'
  +
  '.Kj-JD-K7, .Kj-JD-Jz {background-color: #4A1515; color: #EDD !important;}'
  +
  '.ajn {opacity: .8;}'
  +
  'li.vk_c, .vk_c, .vk_cxp, .vk_ic {background: #1B1715 !important;}'
  +
  '.fac-ch .pclose rect {fill: rgba(69, 11, 11, 1) !important;}'
  +
  '.fac-hdot-c0 {background: none repeat scroll 0% 0% rgba(150, 33, 14, 1) !important;}'
  +
  '.lcht-hldr text {fill: rgba(173, 24, 24, 1) !important;}'
  +
  '.lcht-hldr text.outline {fill: rgba(0, 0, 0, 0) !important; stroke: rgba(35, 13, 13, 1) !important;}'
  +
  '.lcht-hldr svg .line-c0 {stroke-width: 3 !important; stroke: rgba(138, 22, 8, 1) !important;}'
  +
  '._OJ li {border-left: 1px solid rgba(131, 38, 38, 1) !important;}'
  +
  '._cvd {border-bottom: 1px solid rgba(81, 24, 24, 1) !important;}'
  +
  '.CToWUd {border: 1px solid rgba(102, 18, 18, 1);}'
  +
  '#gb-main #cnt #center_col {margin-left: 212px !important;}'
  +
  '.calcell span font {color: rgba(165, 37, 15, 1) !important;}'
  +
  '.rg_l {background: none repeat scroll 0% 0% rgba(32, 19, 19, 1) !important;}'
  +
  '.webstore-If-eh-ec.webstore-ec-bc-cd-V, .webstore-If-eh-ec.webstore-ec-ac-cd-V {border-top: 1px solid #750C0C !important; border-left: 1px solid #660C0C !important; border-right: 1px solid #6C1414 !important; background-color: #5F0B0B !important;}'
  +
  '.webstore-If-eh-Ib {color: #EDD !important; text-shadow: text-shadow: 0px 1px rgba(84, 10, 10, 0.5) !important;}'
  +
  '.webstore-If-eh-ec.webstore-ec-gc, .webstore-If-eh-ec.webstore-ec-gc-Gb {border-top: 1px solid #680B0B !important;}'
  +
  '.GFJLF-MB.GFJLF-NB {border-top: 1px solid rgba(111, 10, 10, 1); border-left: 1px solid #6F0A0A !important; border-right: 1px solid #6F0A0A !important; border-bottom: 1px solid rgba(128, 13, 13, 1) !important;}'
  +
  '._eF, ._eF {color: rgba(159, 23, 23, 1) !important;}'
  +
  '#duf3toe {background-color: rgba(71, 13, 4, 1) !important; color: #EDD !important;}'
//BUG-DAY 9/12/'14
  +
  '.gb_ta {background: none repeat scroll 0% 0% rgba(62, 11, 11, 1) !important;}'
  +
  '.gb_ka a {color: #EDD !important;}'
  +
  '.gb_qa {background: none repeat scroll 0% 0% rgba(95, 21, 9, 0.7) !important;}'
  +
  '.gb_Db .gb_Cb, .gb_h.gb_Qc {background: #393939 !important;}'
  +
  '.gb_ia {border-color: transparent transparent rgba(66, 9, 9, 1);}'
  +
  '.gb_V .gb_I {background: rgba(47, 35, 35, 1) !important;}'
  +
  '.gb_E {background: none repeat scroll 0% 0% rgba(74, 9, 9, 1);}'
  +
  '.gb_o {border: 1px solid #2F2323 !important;}'
  +
  '.gb_o:hover:not(.gb_p), .gb_e:hover {border: 1px solid rgba(89, 5, 5, 1);}'
  +
  '.gb_o:hover .gb_t {background: none repeat scroll 0% 0% #2F2323;}'
  +
  '.gb_Qa .gb_Sa {background-color: #393939 !important;}'
  +
  '#gbsfw.gb_Rb, #gbsfw.gb_ab {background: none repeat scroll 0% 0% rgba(75, 13, 13, 1); border-color: #4B0D0D;}'
  +
  '.gb_X {background: none repeat scroll 0% 0% rgba(120, 11, 11, 1); border: 1px solid rgba(146, 21, 21, 1);}'
  +
  '.pog .eqp-pane-wrapper {background-color: #410909 !important;}'
  +
  '.pog .topic-list-row, .pog .source-list-row, .pog .suggest-topic-list-row {border-bottom-color: rgba(117, 37, 37, 1) !important;}'
  +
  '.pog .topic-list-row, .pog .source-list-row, .pog .suggest-topic-list-row {border-top: 1px solid rgba(86, 72, 72, 0.4) !important;}'
  +
  '.pog .topic-autocomplete-wrapper {background-color: rgba(68, 7, 7, 1); border-top: 1px solid rgba(56, 16, 16, 1);}'
  +
  '.pog .select-source-autocomplete-wrapper {background-color: #440707 !important; border-top: 1px solid rgba(110, 6, 6, 1) !important;}'
  +
  '.topic-list-row, .source-list-row {background: rgba(48, 21, 21, 1) !important;}'
  +
  '.pog .eqp-pane-footer {background-color: #440707;}'
  +
  '#table-ds-rs, #table-bs-rs, #table-sc {border-top: 1px solid rgba(69, 13, 4, 1) !important;}'
  +
  '.settings .ds1, .settings .ds2, .settings .ds3 {border-right: 1px solid #841111;}'
  +
  '.lsbb1, .lsbb2, .lsbb3 {background: none repeat scroll 0px 0px rgba(125, 19, 19, 1); border-color: rgba(141, 13, 13, 1) rgba(144, 17, 17, 1) rgba(93, 9, 9, 1);}'
  +
  '.modal-dialog-buttons {background-color: #500D0D !important;}'
  +
  '.gray_bg, .sidesearch {background-color: #1B1715;}'
  +
  '.Bb, .Bb:hover {background: none repeat scroll 0% 0% rgba(105, 18, 18, 1);}'
  +
  '.vD, .kvc, .secondary-sub-nav-option .sub-nav-link {color: #EDD !important;}'
  +
  '.eh.c-P-p, .c-P-B {background-color: #500D0D !important;}'
  +
  '.gb_xa {background: none repeat scroll 0% 0% rgba(63, 5, 5, 1) !important;}'
  +
  '.gb_Fa, .gb_I, .gb_o:hover .gb_t {background: none repeat scroll 0% 0% rgba(36, 18, 18, 1) !important;}'
  +
  '.gb_Ia {color: rgba(170, 43, 22, 1) !important;}'
  +
  '.gb_tb, .gb_wb, .gb_Ia, .gb_va:hover, .gb_Da:hover {background-color: #241212 !important; color: #EDD !important;}'
  +
  '.gb_va, .gb_Da {background: none repeat scroll 0% 0% #3F0505 !important;}'
  +
  '.gb_E {background: none repeat scroll 0% 0% rgba(81, 9, 9, 1) !important;}'
  +
  '.gb_J {border-bottom: 0px none #B24220;}'
  +
  '.gb_V, .gb_V:hover {border: 1px solid rgba(86, 21, 11, 1) !important;}'
  +
  '.no-focus-outline button {background: rgba(162, 14, 14, 1) !important;}'
  +
  '.gb_pa .gb_X, .gb_pa .gb_X:hover {background: none repeat scroll 0% 0% rgba(180, 31, 7, 1) !important;}'
  +
  '.gb_o, .gb_J {border: 0px none #000 !important;}'
  +
  '.gb_F {background: none repeat scroll 0% 0% rgba(87, 14, 14, 1) !important; border: 1px solid rgba(60, 8, 8, 1) !important;}'
  +
  '.sbibod, .kpbb, .kpbb:hover, .kpbb:focus {border-color: #631010 #7E0909 #660E0E !important;}'
  +
  '.sbhcn, .sbfcn {border-color: #831010 #8E0909 #860E0E !important;}'
  +
  '#epbar {border: 1px solid rgba(68, 7, 7, 1) !important;}'
  +
  '#epb-ok {background-color: rgba(116, 26, 12, 1) !important; background-image: -moz-linear-gradient(center top , rgba(146, 31, 12, 1), rgba(119, 26, 10, 1)) !important; border: 1px solid rgba(143, 32, 14, 1) !important;}'
  +
  '#maia-nav-x li {color: #EDD !important;}'
  +
  '.gb_Z {border: 1px solid rgba(140, 38, 22, 1) !important;}'
  +
  '.google-header-bar {background: none repeat scroll 0% 0% #1B1715 !important; border-bottom: 1px solid #1B1715 !important;}'
  +
  '.signuponepage .signup-box {background: none repeat scroll 0% 0% rgba(68, 15, 15, 1) !important;}'
  +
  '.form-element strong {color: #EDD !important;}'
  +
  '.signup-box input[type="email"]:focus, .signup-box input[type="number"]:focus, .signup-box input[type="password"]:focus, .signup-box input[type="tel"]:focus, .signup-box input[type="text"]:focus, .signup-box input[type="url"]:focus {border: 1px solid rgba(131, 30, 13, 1) !important; background: none repeat scroll 0% 0% rgba(59, 31, 31, 1) !important;}'
  +
  '.signup-box input[type="email"], .signup-box input[type="number"], .signup-box input[type="password"], .signup-box input[type="tel"], .signup-box input[type="text"], .signup-box input[type="url"] {border: 1px solid rgba(131, 30, 13, 1) !important; background: none repeat scroll 0% 0% rgba(59, 31, 31, 1) !important;}'
  +
  '#recaptcha_widget.recaptcha-widget {background: none repeat scroll 0% 0% rgba(50, 14, 14, 1) !important; border: 1px solid rgba(84, 27, 27, 1) !important;}'
  +
  '.g-button-submit, .g-button-submit:hover {background-color: #951D09 !important; background-image: -moz-linear-gradient(center top , rgba(149, 29, 9, 1), rgba(110, 24, 10, 1)) !important;}'
  +
  '.recaptcha-widget #recaptcha_image {border-bottom: 1px solid rgba(104, 7, 7, 1) !important;}'
  +
  '.talk_number_input td, .i18n_phone_number_input td, .talk_number_input th, .i18n_phone_number_input th {border-color: #6E0808 rgba(129, 13, 13, 1) rgba(90, 8, 8, 1) !important;}'
  +
  '.clearfix .side-content img {opacity: .8;}'
  +
  '.g-button-submit:hover, .g-button-submit:focus {border: 1px solid rgba(141, 31, 12, 1) !important;}'
  +
  '.identity-prompt-account-public-name, .signin-card #reauthEmail, .banner h2, .banner h1 {color: #EDD !important;}'
  +
  '.wrapper .google-footer-bar {border-top: 1px solid rgba(77, 21, 21, 1) !important;}'
  +
  '.wrapper .content .card {background-color: rgba(69, 9, 9, 1);}'
  +
  '.wrapper input[type="email"]:focus, .wrapper input[type="number"]:focus, .wrapper input[type="password"]:focus, .wrapper input[type="tel"]:focus, .wrapper input[type="text"]:focus, .wrapper input[type="url"]:focus, .signin-card #Passwd, .signin-card #Passwd:focus {border: 1px solid rgba(167, 37, 16, 1) !important; background: #422 !important;}'
  +
  '.need-help, #account-chooser-link, .lk-online, .al-ctrl, .al-desc-self, .vk_ans {color: rgba(188, 38, 13, 1) !important;}'
  +
  '.rc-button-submit, .rc-button-submit:visited {border: 1px solid rgba(158, 30, 10, 1) !important; color: #EDD !important; background-color: rgba(149, 30, 16, 1) !important; background-image: -moz-linear-gradient(center top , rgba(165, 31, 9, 1), rgba(129, 26, 9, 1)) !important;}'
  +
  '.ucw_selector:focus {border-color: rgba(150, 29, 9, 1) !important;}'
  +
  '.ucw_selector {border: 1px solid rgba(113, 19, 19, 1) !important; background-color: #422 !important; color: #EDD !important;}'
  +
  '.ucw_data {border-color: rgba(143, 25, 25, 1) rgba(105, 15, 15, 1) rgba(104, 14, 14, 1) !important; background-color: #611 !important; color: #EDD !important;}'
  +
  '.vk_arc {border-top: 1px solid rgba(59, 13, 13, 1) !important;}'
  +
  '.vk_ard:after {border-top: 16px solid rgba(62, 10, 10, 1) !important;}'
  +
  '.vk_ard:before {border-top: 16px solid rgba(80, 16, 16, 1) !important;}'
  +
  '.vk_ard, .vk_aru {background-color: rgba(63, 15, 15, 1) !important;}'
  +
  '.esc-flow-content .title-bar {box-shadow: 0px 1px 4px 0px rgba(56, 19, 19, 1) !important; border-bottom: 1px solid rgba(75, 9, 9, 0.33) !important;}'
  +
  '.esc-flow-content .drawer {box-shadow: 0px 8px 6px -6px rgba(84, 15, 15, 1) inset !important; background-color: rgba(101, 17, 17, 1) !important; border-top: 1px solid rgba(111, 10, 10, 0.33)  !important;}'
  +
  '.related-item .icon {opacity: .8;}'
  +
  '.loc-en #set {background: none repeat scroll 0% 0% rgba(74, 12, 12, 1) !important;}'
  +
  '.stitle, #svalues thead th, #svalues th.head, #svalues tr.head, .svalues-head, #svalues table.rows th, #svalues table.rows td, .svalues-comment, .caldesc, .gb_fb, .fake-link, .person-name {color: #EDD !important;}'
  +
  '.stabs-selected {background: none repeat scroll 0% 0% rgba(122, 17, 17, 1) !important;}'
  +
  '#svalues th, #svalues td {border-bottom: 1px solid rgba(69, 12, 12, 1) !important;}'
  +
  '.loc-en .bottom-buttons .buttons {background: none repeat scroll 0% 0% rgba(39, 23, 23, 1) !important;}'
  +
  '.loc-en .privacy-policy {background: none repeat scroll 0% 0% #271717 !important; border-top: 5px solid rgba(66, 14, 14, 1) !important;}'
  +
  'table#swapTzContainer td#swapTzDeco {border-color: rgba(69, 13, 13, 1) !important;}'
  +
  '.no-focus-outline .play-button {background-color: rgba(180, 15, 15, 1) !important;}'
  +
  '.person-image {border: 5px solid rgba(123, 34, 34, 1) !important; opacity: .8;}'
  +
  '.a-Za-Bb {background-color: rgba(54, 28, 28, 1) !important;}'
  +
  '.a-lsa .a-Lc {background: rgba(30, 12, 12, 1) !important;}'
  +
  '#currency_value .ch, .chb {color: #EDD !important;}'
  +
  '.vk_ans span, .linkbtn {color: rgba(164, 27, 27, 1) !important;}'
  +
  '.id-compare-bar-wrapper {background-color: rgba(69, 22, 22, 1) !important;}'
  +
  '.news-item, .rss-item {background: none repeat scroll 0% 0% rgba(66, 20, 20, 1) !important;}'
  +
  '#chart_anchor {opacity: 0.7 !important;}'
  +
  '.klcar {margin-left: 666px !important;}'
  +
  '.klbar {border-bottom: 1px solid rgba(78, 15, 15, 1) !important;}'
  +
  '.klnav {background: none repeat scroll 0% 0% rgba(102, 14, 14, 0.8) !important;}'
  +
  '#fkbx, #fkbx:hover, #fkbx:focus {border: 1px solid #AB4141 !important; border-top-color: #8C2A2A !important;}'
  +
  '._ogd {color: #EDD !important;}'
  +
  '#_cZ ._u6 {border: 1px solid rgba(111, 23, 8, 1) !important;}'
  +
  '.iri {border: 1px solid #600 !important; border-radius: 3px !important; background: -moz-linear-gradient(center top , rgba(200, 29, 29, 1), rgba(155, 19, 19, 1)) repeat scroll 0% 0% transparent !important; color: #EDD !important;}'
  +
  '.gscp_a {background: none repeat scroll 0% 0% rgba(168, 64, 47, 1) !important; border: 1px solid rgba(194, 40, 15, 1) !important;}'
  +
  '.vk_ans, .vk_bk, .leg_calc, .vk_ans, #gsr, .gb_i, .gb_Pa, #gbq1 {background-color: rgba(29, 25, 24, 1) !important;}'
  +
  '#gb, .gb_Pa {height: 40px !important; top: 310px !important; display: none;}'
  +
  '#topabar {margin-top: 1em;}'
  +
  '#hdtbSum {margin-top: 8px;}'
  +
  '#hdtb-msb {max-height: 38px;}'
  +
  'body.vasq #hdtb-msb .hdtb-mitem.hdtb-msel, body.vasq #hdtb-msb .hdtb-mitem.hdtb-msel-pre {height: 33px;}'
  +
  '#slim_appbar {margin-top: -20px;}'
  +
  '.sbibod {background: #393939;}'
  +
  '._pl ._rl, ._qL ._rl {color: rgba(152, 8, 8, 1) !important;}'
  +
  '._Db ._tf, ._o3g, ._o3g a {color: rgba(105, 20, 20, 1) !important;}'
  +
  '.rllt__action-button:not(:last-child) ._nMg {border-right: 1px solid rgba(122, 26, 26, 1) !important;}'
  +
  '._qJg, ._m3g {border-top: 1px solid #7A1A1A !important;}'
  +
  '._Db._nu:before {box-shadow: 0px 0px 12px 0px rgba(174, 30, 30, 0.5) !important;}'
  +
  '.wot-popup-layer {opacity: .6; pointer-events: none;}'
  +
  '#qbp {background: rgb(72, 40, 40) none repeat scroll 0% 0% !important;}'
  +
  '#qbdp, #qbup {background: #6E5151 none repeat scroll 0% 0% !important; border-top: 1px solid #651C1C !important;}'
  +
  '#qbdp, #qbup, #qbhwr {color: #EDD !important;}'
  +
  '#lst-ib, .gsfi {color: #EDD !important;}'
  +
  '#searchform, .gb_db, .gb_tf, .gb_R, .gb_sf, .gb_T {height: 2em !important;}'
);