// ==UserScript==
// @name        Google Classroom - Moonlight2
// @namespace   Tampermonkey Scripts
// @match       https://classroom.google.com/*
// @grant       none
// @version     3.0
// @author      Ha790273
// @icon        https://i.pinimg.com/originals/98/d3/a2/98d3a283f98cded8e639957e935bd373.png
// @license     MIT
// @description Custom Moonlight theme for Google Classroom - Updated 2025

// @downloadURL https://update.greasyfork.org/scripts/558947/Google%20Classroom%20-%20Moonlight2.user.js
// @updateURL https://update.greasyfork.org/scripts/558947/Google%20Classroom%20-%20Moonlight2.meta.js
// ==/UserScript==

// ============ START ============ //
(function() {
    'use strict';

    // Updated CSS for 2025
    const style = `
/* ==================== GOOGLE CLASSROOM MOONLIGHT THEME ==================== */
/* Updated Version 3.0 - 2025 */

@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap');

/* ========== BACKGROUND ========== */
body {
   background: rgba(21,31,46,0.8) url("https://i.imgur.com/LHj4Gil.jpg") center/cover fixed !important;
   background-repeat: no-repeat !important;
   background-size: cover !important;
}

/* ========== GLOBAL SETTINGS ========== */
* {
  font-family: 'Caveat', cursive !important;
  color: #fff !important;
  border-color: rgba(21,31,46,0.8) !important;
  box-shadow: none !important;
}

/* ========== SCROLLBAR ========== */
::-webkit-scrollbar {
    background: transparent;
    width: 8px;
}

::-webkit-scrollbar-corner {
    background: transparent;
}

::-webkit-scrollbar-track {
    background: transparent;
}

::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, rgba(6,171,255,1) 5%, rgba(102,0,204,1) 97%);
    border-radius: 10px;
}

/* ========== ANNOUNCEMENT BOX ========== */
.hgjBDc {
  background: rgba(21,31,46,0.8);
}

.vnnr5e .I9OJHe, 
.vnnr5e .CIy9F {
  background: rgba(21,31,46,0.8);
}

.vnnr5e:not(.RDPZE):hover .I9OJHe, 
.vnnr5e:not(.RDPZE):hover .CIy9F {
  background: rgba(21,31,46,0.8);
}

.qk0lee:focus {
  background: rgba(21,31,46,0.8);
  color: #fff;
}

.Erb9le:not(.RDPZE) .qmMNRc:hover {
  color: #fff;
}

.rxO3db {
  background: rgba(21,31,46,0.8);
}

.e19J0b, 
.Y5sE8d:not(.RDPZE) {
  background: rgba(21,31,46,0.8);
}

.l4V7wb {
  color: #fff;
  background: rgba(21,31,46,0.8);
  border: 1px solid #4c4c4c;
  border-radius: 4px;
}

.T2Ybvb.KRoqRc.editable {
  font-size: 1.5rem;
}

.Erb9le:not(.RDPZE) .qmMNRc.y7OZL .DPvwYc {
  background-image: linear-gradient(to right, #06abff 5%, #6600cc 97%) !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  background-clip: text !important;
}

.Y5sE8d:not(.RDPZE) .snByac {
  font-size: 1.05rem;
  background-image: linear-gradient(to right, #06abff 5%, #6600cc 97%) !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  background-clip: text !important;
}

.Erb9le:not(.RDPZE) .qmMNRc.y7OZL,
.Y5sE8d:not(.RDPZE),
.hVNH5c .K0NPx,
.FtBNWb,
.I7OXgf.ZEeHrd {
  background: rgba(21,31,46,0.8) !important;
}

.jfvobd,
.GWh4Ge .kx3Hed {
  color: #ffffff !important;
}

/* ========== TOP NAVBAR ========== */
.Hwv4mb, 
.xHPsid .hN1OOc {
  font-family: 'Caveat', cursive;
  font-size: 2rem;
}

.DShyMc-MTA5NzA3NjA1MzQy .eumXzf::after,
.eumXzf::after {
  border-image: linear-gradient(to right, #06abff 5%, #6600cc 97%) 1;
  border-image-slice: 9;
}

.DShyMc-MTA5NzA3NjA1MzQy .VnOHwf-Tvm9db,
.VnOHwf-Tvm9db {
  background-image: linear-gradient(to right, #06abff 5%, #6600cc 97%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ========== LOADING GRADIENT ========== */
.DShyMc-AaTFfe .bFjUmb-Ysl7Fe.kRqvHe,
.aP3ZPb.kRqvHe.bFjUmb-Ysl7Fe,
.bFjUmb-Wvd9Cc:not(.O1l69):not(.J1HJOd):not(.TIunU),
.aP3ZPb {
  background: linear-gradient(to right, #06abff 5%, #6600cc 97%) !important;
}

/* ========== JOIN/CREATE CLASS ========== */
.D3oBEe .qTs5Xc, 
.fyExH {
  background: none;
}

[aria-checked="true"] > .rq8Mwb, 
[aria-checked="mixed"] > .rq8Mwb {
  background: rgba(255, 255, 255, 0.77);
  border-radius: 5px;
}

/* ========== FONT FIXES ========== */
/* Material post dates */
.tmMkWb {
  font-family: 'Caveat', cursive;
  font-size: 1.4em;
}

/* Class details */
.uTUgB, 
.csjh4b {
  font-family: 'Caveat', cursive;
}

.csjh4b {
  font-size: 1.78rem;
}

/* Upcoming */
.EZrbnd .sxa9Pc,
.EZrbnd {
  font-family: 'Caveat', cursive;
}

/* Member names */
.asQXV {
  font-family: 'Caveat', cursive;
  font-size: 1.2rem;
}

/* Attachments */
.QDKOcc {
  font-family: 'Caveat', cursive;
  font-size: 1.1rem;
}

/* Due work alert */
.sdDCme {
  font-size: 1.12rem;
}

.VBEdtc-Wvd9Cc:hover {
  color: #fff;
  font-size: 1rem;
}

/* Textarea text */
textarea {
  font-family: 'Caveat', cursive !important;
  font-size: 1.5em !important;
}

/* Default announcement text */
.K6Ovqd {
  font-size: 1.5rem !important;
}

.fidHdf {
  margin: 0 !important;
}

/* Announcement content */
.obylVb:not(:empty) {
  font-size: 1.2rem;
}

/* Comments content */
.tLDEHd {
  font-size: 1.2rem;
  font-family: 'Caveat', cursive;
}

/* Topic names */
.PazDv {
  font-family: 'Caveat', cursive;
  font-size: 2.5rem;
}

/* People list */
.XjYjO {
  font-family: 'Caveat', cursive;
  font-size: 2.5rem;
}

/* Class name */
.YVvGBb {
  font-family: 'Caveat', cursive;
}

.A6dC2c {
  font-size: 1.15rem;
}

.dDKhVc {
  font-size: 1rem;
}

/* Materials, questions, assignments */
.tL9Q4c {
  font-family: 'Caveat', cursive;
  font-size: 1.5rem;
}

.NE9bBb {
  color: #fff !important;
}

/* ========== GRADEBOOK ========== */
.VnOHwf-Tvm9db {
  font-family: 'Caveat', cursive;
}

.EhRlC {
  font-size: 1.5rem !important;
  color: #1e8e3e !important;
}

.lYU7F {
  font-size: 1.5rem !important;
  color: #c5221f !important;
}

.ppMo6b {
  font-size: 1.3rem;
  color: #b3d3ec !important;
}

/* ========== ACCOUNT PANEL ========== */
.gb_1b,
.gb_wb.gb_wb,
.gb_l .gb_mb,
.gb_sb.gb_sb {
  color: #fff;
}

/* ========== GOOGLE DRIVE ATTACHMENT WINDOW ========== */
.yawtRb, 
.TNg8Ce, 
.ye3Lg, 
.Y7Vyje {
  background: none !important;
}

.jfvobd {
  color: #fff;
}

.GWh4Ge .kx3Hed {
  color: rgba(255, 255, 255, 0.68);
}

.w7qIhd {
  background-image: linear-gradient(to right, #06abff 5%, #6600cc 97%) !important;
}

.TNg8Ce .KKjvXb .kx3Hed {
  background-image: linear-gradient(to right, #06abff 5%, #6600cc 97%) !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  background-clip: text !important;
}

.eizQhe-ObfsIf-mJRMzd-PFprWc, 
.eizQhe-ObfsIf-jXK9ad {
  background: rgba(21,31,46,0.8);
}

.ndfHFb-jyrRxf-haAclf .ndfHFb-XuHpsb-haAclf {
  background: none;
}

.eizQhe-ObfsIf-jXK9ad {
  color: rgba(218, 220, 224, 0.45);
}

.pGOlGd .eizQhe-ObfsIf-mJRMzd:not(.eizQhe-ObfsIf-gk6SMd) .eizQhe-mJRMzd-V1ur5d-fmcmS,
.iXlbzd, 
.ndfHFb-jyrRxf-tJHJj-r4nke, 
.ndfHFb-jyrRxf-haAclf .ndfHFb-rBfmuc-E2o6qc-V67aGc,
.eizQhe-jyrRxf-V1ur5d-r4nke > .eizQhe-mJRMzd-V1ur5d-fmcmS, 
.ndfHFb-vWsuo-s4QLm-haAclf > span,
.iXlbzd, 
.pGOlGd .ndfHFb-ObfsIf-haAclf .ndfHFb-rBfmuc-E2o6qc-V67aGc {
  color: rgba(255, 255, 255, 0.77);
}

.ndfHFb-jyrRxf-tJHJj {
  background: none;
}

.ndfHFb-vWsuo-s4QLm-haAclf > span:nth-child(1) {
  border-right: 1px solid rgba(255, 255, 255, 0.77);
  padding-right: 5px;
}

.pGOlGd .eizQhe-ObfsIf-mJRMzd-V1ur5d-haAclf, 
.TgyWAb-ObfsIf-haAclf {
  border-top: 1px solid;
  border-image: radial-gradient(circle, rgba(218, 220, 224, 0.45) 60%, transparent 95%) 1;
  border-image-slice: 9;
}

.picker-dialog.XKSfm-Sx9Kwc {
  background: rgba(21,31,46,0.8) !important;
}

.yawtRb .Icoilb svg, 
.yawtRb .lVYtmc svg, 
.kZyufc svg {
  fill: rgba(255, 255, 255, 0.77);
}

.pGOlGd .ndfHFb-jyrRxf-haAclf .eizQhe-jyrRxf-V1ur5d-haAclf svg {
  fill: #fff;
}

.DrCRke {
  opacity: 0.8;
}

.SI7vke ::-webkit-scrollbar-thumb {
  background: linear-gradient(to right, #06abff 5%, #6600cc 97%);
}

.SI7vke ::-webkit-scrollbar-track {
  background: rgba(21,31,46,0.8) !important;
}

.SI7vke ::-webkit-scrollbar {
  width: 8px !important;
}

.eizQhe-ObfsIf-jXK9ad:hover {
  transform: scale(1.12);
  transition: transform 0.45s ease-out;
  z-index: 999;
}

.ndfHFb-jyrRxf-oKdM2c:hover {
  transform: scale(1.035);
  transition: transform 0.45s ease-out;
  z-index: 999;
}

/* ========== LOGO ========== */
.s7ovNb {
  visibility: hidden;
  overflow: visible;
}

.s7ovNb::after {
  line-height: 3rem;
  overflow: visible;
  visibility: visible;
  position: absolute;
  top: 7px;
  left: 1.2em;
  content: 'Google Classroom';
  font-family: 'Caveat', cursive;
  font-size: 2.8rem;
  background-image: linear-gradient(to right, #06abff 5%, #6600cc 97%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.XIpEib {
  overflow: visible;
}

/* ========== SCHEDULED ========== */
.VBEdtc-Wvd9Cc:hover {
  font-size: 1.5rem !important;
}

.IMvYId, 
.IMvYId:visited {
  font-size: 1.05rem;
}

.DShyMc-MzI2OTAxNzI5NjYw .tUJKGd:not(.xp2dJ):not(.rZXyy):hover.idtp4e,
.p0oLxb > .bnqxkd,
.QkA63b .GJYBjd,
.dKKcxf, 
.RPt7lf.miHM0e > .NE9bBb {
  background: rgba(21,31,46,0.8);
}

.DShyMc-MzI2OTAxNzI5NjYw.bFjUmb-Ysl7Fe, 
.DShyMc-MzI2OTAxNzI5NjYw .bFjUmb-Ysl7Fe, 
.DShyMc-MzI2OTAxNzI5NjYw .VUoKZ {
  background: rgba(21,31,46,0.8) !important;
}

.y2d25,
.GJYBjd:not(.CeoRYc),
.p0oLxb {
  background: rgba(21,31,46,0.9) !important;
}

/* ========== TRANSITIONS ========== */
.GWZ7yf:hover, 
.Aopndd:hover, 
.d4Fe0d:hover, 
.v9TZ3c:hover {
  transform: scale(1.05) !important;
  transition: transform 0.2s linear !important;
}

.ZoT1D:hover.idtp4e,
.tUJKGd:hover .SFCE1b, 
.UISY8d-Ysl7Fe:not(.S6Vdac):hover, 
.OlXwxf.OlXwxf:hover,
.OlXwxf .SFCE1b:hover {
  background: rgba(21,31,46,0.8) !important;
  transform: scale(1.05) !important;
  transition: transform 0.2s linear !important;
}

.GWZ7yf:focus-within {
  transform: scale(1.05) !important;
  transition: transform 0.2s linear !important;
}

.uArJ5e.UQuaGc.kCyAyd.l3F1ye.TNOizd.pOf0gc.UJYYgf:hover {
  transform: scale(1.12);
  transition: transform 0.45s ease-out;
  z-index: 999;
}

.EmVfjc.qs41qe .xq3j6.ERcjC .X6jHbb {
  animation: spinner-left-spin 1333ms cubic-bezier(0.4, 0.0, 0.2, 1) infinite both, 
             loadingAnim 0.5s linear infinite both;
}

@keyframes loadingAnim {
  0% { border-color: #06abff; }
  100% { border-color: #6600cc; }
}

/* ========== TRANSITION FIX ========== */
.Sgw65b {
  overflow: visible !important;
  max-width: 78.1%;
}

/* ========== TRANSPARENCY ========== */
.gHz6xd,
.Aopndd,
.d4Fe0d,
.qk0lee,
.joJglb,
.GWZ7yf,
.IzVHde,
.OX4Vcb,
.ETRkCe,
.Xzp3fc,
.FpfvHe,
.CJXzee,
.pEwOBc,
.feojCc,
.Xi8cpb,
a.Xi8cpb,
.tUJKGd:not(.xp2dJ).ndcsBf .idtp4e,
.DShyMc-MTA5NzA3NjA1MzQy .tUJKGd:not(.xp2dJ).ndcsBf .idtp4e,
.SS7JKe .qRUolc,
.pn5mce .MQL3Ob,
.a4Vkrf,
.ybOdnf:not(.RDPZE).iWO5td,
.jBmls,
.ry3kXd,
.e19J0b .CeoRYc,
.CDELXb,
.I5Bhjd,
.cLpBac,
.dKKcxf,
.STMvPe,
.ncFHed .MocG8c.KKjvXb,
.OA0qNb .LMgvRb[aria-selected="true"],
.tWfTvb [role="option"][aria-selected="true"],
.gb_l.gb_1a.gb_2a,
.x7zFFe table,
.HMUCnd,
.jgvuAb.iWO5td .ncFHed,
.tWfTvb,
.XaepId,
.NE9bBb,
.aVeDNe .MQL3Ob,
.JPdR6b.qjTEB,
.fWf7qe .Yalane,
.z80M1.FwR7Pc,
.FeRvI .oJeWuf,
.z80M1.qs41qe,
.YEeyed,
.VUfVLb,
thead .qwFLJb,
.xdKj9c.kTKNNc,
.Je07k.kTKNNc,
tbody .qwFLJb.kTKNNc,
.ypv4re,
.ypv4re:not(.pco8Kc),
.j70YMc:not(.pco8Kc),
.gb_wb.gb_wb,
.gb_sb.gb_sb,
.gb_Db.gb_Db {
  background: rgba(21,31,46,0.8) !important;
}

.CJXzee a.rUnD6d {
  background: rgba(21,31,46,0.8);
  border-radius: 8px;
  background-clip: padding-box;
}

.l3F1ye:not(.RDPZE) {
  background: rgba(21,31,46,0);
  border-radius: 8px;
}

.OX4Vcb {
  opacity: 0.7;
}

.xdKj9c, 
.Je07k, 
tbody .qwFLJb {
  background: rgba(21,31,46,0.5);
}

.Xzp3fc,
.FpfvHe,
.CJXzee,
.pEwOBc,
.ypv4re {
  border-radius: 8px;
}

.ypv4re {
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;
}

.ypv4re:not(.pco8Kc),
.j70YMc:not(.pco8Kc) {
  border-radius: 5px;
}

.vnnr5e:not(.RDPZE):hover .I9OJHe, 
.vnnr5e:not(.RDPZE):hover .CIy9F {
  background-color: transparent !important;
}

.vnnr5e .CIy9F, 
.vnnr5e .I9OJHe {
  background: none;
}

.gb_Nb > .gb_Mb:hover {
  background: rgba(21,31,46,0.4);
}

.cLpBac,
.fWf7qe .Yalane {
  background-clip: padding-box !important;
}

/* ========== GRADIENT TEXT ========== */
.Shk6y,
.z80M1.FwR7Pc .jO7h3c,
.z80M1.qs41qe .jO7h3c {
  font-size: 1.5rem;
  background-image: linear-gradient(to right, #06abff 5%, #6600cc 97%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.vUBwW .DPvwYc, 
.TGnLfc {
  color: white !important;
}

.DShyMc-MzI2ODk3OTk4MjE5 .mxmXhf {
  fill: #fff !important;
}

/* ========== BORDERS FIX ========== */
.joJglb, 
.BdCNc, 
.d4Fe0d .Aopndd {
  border-color: transparent !important;
}

.u73Apc, 
.uO32ac, 
.gQZxn, 
.ycbm1d, 
.s2g3Xd, 
.n4xA, 
.d6CWTd, 
.tfGBod.tfGBod:not(.xp2dJ), 
.tfGBod.xp2dJ .jWCzBe, 
.tfGBod.xp2dJ .iobNdf, 
.PeGHgb.Q8U8uc .Ono85c+.oh9CFb {
  border-color: #4c4c4c !important;
}

.QkA63b .GJYBjd {
  border: 1px solid #4c4c4c !important;
}

.l4V7wb:not(.Fxmcue) {
  border: none !important;
}
`;

    // Create and inject style element
    const styleElement = document.createElement('style');
    styleElement.type = 'text/css';
    styleElement.id = 'moonlight-theme-styles';
    styleElement.textContent = style;
    
    // Inject into page
    (document.head || document.documentElement).appendChild(styleElement);

    // Create theme toggle button
    function createToggleButton() {
        const toggleBtn = document.createElement('div');
        toggleBtn.innerHTML = '🌙';
        toggleBtn.id = 'moonlight-toggle';
        toggleBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, rgba(6,171,255,1) 0%, rgba(102,0,204,1) 100%);
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 28px;
            z-index: 999999;
            box-shadow: 0 4px 15px rgba(6,171,255,0.4), 0 0 30px rgba(102,0,204,0.3);
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            user-select: none;
        `;

        // Hover effect
        toggleBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.15) rotate(10deg)';
            this.style.boxShadow = '0 6px 20px rgba(6,171,255,0.6), 0 0 40px rgba(102,0,204,0.5)';
        });

        toggleBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
            this.style.boxShadow = '0 4px 15px rgba(6,171,255,0.4), 0 0 30px rgba(102,0,204,0.3)';
        });

        // Toggle theme on/off
        toggleBtn.addEventListener('click', function() {
            const themeStyle = document.getElementById('moonlight-theme-styles');
            if (themeStyle) {
                if (themeStyle.disabled) {
                    themeStyle.disabled = false;
                    this.innerHTML = '🌙';
                    this.style.background = 'linear-gradient(135deg, rgba(6,171,255,1) 0%, rgba(102,0,204,1) 100%)';
                    console.log('🌙 Moonlight Theme enabled');
                } else {
                    themeStyle.disabled = true;
                    this.innerHTML = '☀️';
                    this.style.background = 'linear-gradient(135deg, #ffd93d 0%, #ff9a3d 100%)';
                    console.log('☀️ Moonlight Theme disabled');
                }
            }
        });

        document.body.appendChild(toggleBtn);
    }

    // Wait for DOM to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createToggleButton);
    } else {
        createToggleButton();
    }

    // Log activation
    console.log('%c🌙 Moonlight Theme v3.0 Activated! 🌙', 'color: #06abff; font-size: 16px; font-weight: bold;');
    console.log('%cClick the moon button (bottom-right) to toggle the theme!', 'color: #6600cc; font-size: 12px;');

})();

// ============ END ============ //