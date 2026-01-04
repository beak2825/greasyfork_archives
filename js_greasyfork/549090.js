// ==UserScript==
// @name         Wplace Area Screenshot
// @name:en      Wplace Area Screenshot
// @namespace    https://conurplace.com.ar/
// @version      2.1.0
// @description  Capturas 1:1 precisas en Wplace.live para preservar y restaurar arte
// @description:en  Precise 1:1 screenshots on Wplace.live to preserve and restore artwork
// @author       ThatHorse
// @license      MIT
// @match        https://wplace.live/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      backend.wplace.live
// @run-at       document-end
// @noframes
// @homepageURL  https://conurplace.com.ar/
// @supportURL   https://conurplace.com.ar/
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAACtElEQVRYhdWZPWgUQRiGnxE5K60WUpjkOK7wGkllkYAYsbC1uUCa61OohZBCUBeCFoEr1EKwFsS7zsJOsNEIqfwp7GT9AyFVKrlmLO6+9dvJ7O3O5i45Xxiyt2Fmn3u/H2bnDFlZZkPmwAVg9+rx0aN4FCUxjNgEcGbgRAJpmEE4UZTEnDhuiCKdnPSCo9Cwy+30XqNeq7zexAEBrLUYo+ovqQ48UcAoibF22Knkr0gD7yblYafioAtkrc0Au+5CvsNTKRJjDL1eLwUzxmSG3NfjAg/S+V+TQXo9EQejJM44APBpoQ39PjB08O57OP+9T7vdTh1008CnyoBSrfIgccYYw50d+w8ShqAL7RRawPSciYQ4SuJ06PDkafNdLws6uu6PnC2jQsA8KJ1TeXBfbn1IITVwiLwhdsMnyrQKFRJfeH2wdJe8c4IAdS8bB1Wk7ZU1NrtQu/aIj81LtLpLbK+sAdmQu+u6fXFskbjJq9Wo1zLtwJW41uIGrS4pXKhyc9AH16jX0qE/58KNQurmYohyHXTL3wX5c/EpAPPPfnnz7+XOfa7sb/Dz8+UDa28tF7eXXMC9epwmsDtJoIqkwym5WDXEpRu1wJ1tng5+SFU4KOiD1tpMy9Fwg07EoBONXfzmmSc83N+oDJcLKGEW6dBqsFPNt5nt1dayv6dpyJD8g4AQlwmtr/FK4VR1MhdQF4sxBnvvXKkFx21Uff+vDOjToBNx9dULAN5cny/1sFAgV6UAxcXV6DUA64tz8PhHph2FqGz+FQK6PXF9cQ6A599+A7A6gnS/zCQVFGIBE/nC7L6LHFaFgG6xaPkAfDsh917IK2iQg6GO6K19VR3Ja+dhThlKAbrFMm0orUM7OA0orUqA04bSKg2oNxDThtIKcvA4Djr/iyNg0cxA+g7RRTP3M8Rf1dp7oL2aAjgAAAAASUVORK5CYII=
// @downloadURL https://update.greasyfork.org/scripts/549090/Wplace%20Area%20Screenshot.user.js
// @updateURL https://update.greasyfork.org/scripts/549090/Wplace%20Area%20Screenshot.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Core configuration constants
  const TILE_SIZE = 1000; // Size of each tile in pixels
  const INVERT_Y = false; // Whether to invert Y coordinates
  const FRESH_PAIR_MS = 800; // Max time between tile and pixel events to pair them
  const FRESH_USE_MS = 1500; // Max age of sample to consider it fresh
  const POS_KEY = "was-pos-v121"; // LocalStorage key for window position
  const STATE_KEY = "was-state-v121"; // LocalStorage key for UI state

  const ICON_CAMERA_40 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAACeUlEQVRYhe2YP2gUQRSHvxE5K1MdpDAmhCu8JqRKkYAYsbC1uUCa61OohZAi4B8IpghcoRaCtSDedhZ2go1GSGW0sJMYFWxTyTXPIjeTt3uzuzObvUK4Hwy3e7f73rfvvXk7czDRRBMVyozBpgDss+W+WGKnsp+xAIoIxqRNVwWuG1BExO9IAcfAjg1QA2Whs9GFU+gs8LmaAR1Av99HRLDp1sN+r8cSOxY09TTna2KSfbacE4AvlzuQJCc/ivDgEywcJXQ6HRfBvHJIPexZoNzBMEr28/5e2vHCUXICzCkkkLqnrhSLHTo9edr82AdwcPY4GUY2RCGAXihdU3lw3+59dpAaOEZ5NZhKn1VeqyhKr4alt+i9JxZQQqDKtLuyxmYPGreectC6Rru3yO7KGpBOubbr64mFs1gXb1bzcw2+Hw5y77VRa3OHdg8HF6vcGvTBzc813NDnuXDDlGZrMUa5EcxO/yzI36svAJh5+dtbf2/2HnPjeINfX6+P2N5eLm8vRYDGGOPqUINZqDLpdNparJri4DeJhbvUuhjtpCoclPRBEaF5+Mida7hBt8mg2yw0fnfqOU+ONyrDFQEa3V50ajXYhdYH1ydFhO1lf0/TkDH1BxEpDkmtr/HaiVM1kkWAbrIYY5CHV4IMlq39QlYwoYAjGnSb3Hz7GoD3t2eCnMUCZRUEaKO42nwHwPrsNDz76d6nsQqtvxDAVE9cn50G4NWPPwCsDiGzD1OnolJswax8aS7ai1RR6Irau5UsA/At7WPSC5ERjI2Ib4cXq6gIRhmuuA8esRNxbSlkXVBaZ952jgNKqxLguKFSviKvr/Wfq4km+h/0D/CeWy+Rii3gAAAAAElFTkSuQmCC";
  const ICON_DISCORD_40 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAABBklEQVRYhe2WPRLCIBCFH44H8EhamEJr+tQeyNqe2hRamCPlBlgYGPIDBEgyZNyvSphd8thldwMQBEEQRAos1EFKKc13IQQA4P446LW6KlisfZ9dqMC1CYpgPxoKW1RC7aMF2j6UyhShXoFLiVP4RGZ/B7MX6Ezx0ulVuNK8n2PDz/OcZOfCmuKQFsEYG2Riqh0AcM4BALey0WvHy0s6BeYCCUxlewJli81h7EKP2U+1M+0557iVTcdnUFVr9T4bZvXXVcG2l2IXQgh9whhi/AeTRDVTV6pP17d+9k2HbsP+Ne32ejrsDD3O3S1CQ3/bU/byzmJzPM1VQGNRtR0w+yIhCIL4d75rV63ur/ajUgAAAABJRU5ErkJggg==";
  const ICON_INFO_40 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAABG0lEQVRYhe2Wuw3CMBBAH4g6DV3GSMsArJIdkFIgZQdWyQC0abIDnRvaFKbhLEOCAPssIuHXOYX9ch/7IJPJZJKySrSvBdhVjftw7o9BZ6UQtNvLAQBTttGSaz0vwJMDKLqac390613V2G831BZUJ1mKx8Fw3Z+iU7z4Jlk8mn/10ABa0dMQtAB+92rVH8QJTsSEcTAAP20SOyfmywmxkiH34KycKduArd4TIrjyZUzZJpMDhRq87+Gi6qdYowY3EYKTw57rT4PFv8UagrNNo3UPqkUwRXohrgY/QuZBfxb8JpqxT93L7hWKrnbfQlKerEmKrnZysg6ZrpMI+mJCaARVppk5IUHSHdrRWvPgRDJWTFj8wJrJZDL/zg2DMJXLjcoCgwAAAABJRU5ErkJggg==";
  const ICON_LEFT_40 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAA+klEQVRYhe3YMRKCMBCF4T9ezCNYUXsqD2BhReURPJXlWjGjuIDJLpvMmFcxFPBNEnZDoKenbpLnw0RExnEE4Py4A/C83EzvcAOKiEzXcySUQ12A77gpXsiDBQY6zjMm4N44MAAjcFAIjMJBATASB5nAaBxkAGvg4Mc6GIFbqpubIxg1csMwAHA9nj7urwKjp1VDLgJrrbl5VGArOFCALeHAYbOwd76AKSXXTaw16gi2hFyc4laQq2swGql1k82PJAqp4SDjnyS3/IT/k9Rak1l1sAYyu1BHI4s6SSSyuNVFIU29OAJp3izsjfyPw6Mp2vEb2I/genpq5gUxWYI6whkPdgAAAABJRU5ErkJggg==";
  const ICON_UP_40 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAA3klEQVRYhe3YPRLCIBCG4Q8v5hGsqD2VB7CwovIInsqSVJ8zGgg/uwR19i0TJnmGbRgAy5qb0/xYjDECQAgBAHB+3F/vnpdb17/UgMQxLaQK8BPHNJBiYA7HpEgRsIRjEmQ3sBbHepFdwFYc60E2A3txrBXZBJTiWAuyGqiFY7XIKqA2jtUgi8BROFZCbgJH49gWMgvcC8dyyENq8d44APDeAwCux9Pb8xVwBo6lkCugc071jNhSaszJEc9ApnDADxwWkjv4TRlQmgGlGVCaAaUZUNr/3iyw0XczljW7Bcu5vjCJKzggAAAAAElFTkSuQmCC";
  const ICON_RIGHT_40 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAA90lEQVRYhe3YsQ3CMBBA0Q8dUzECVSoKBmAeBqCgSsUImYryqBwhYkxsn89G+FdRCvIiOUZn6PXqttH+QRGRcRwBOE33+f7jckt6lipQRMRdayHVgK84lwZymwsLNQwDANf9Yb63Ox8XLxKqKBDykcWBkIc0AUI60gwIaUhTIMQjzYEQh/y4J/n2Ne3W7JNeoAXO9Q25AFriXCFklTX4XmhNNgEEPxIaAoIf2RTQV1NA38fSDNCHg0aAoW3m9zZqV9N/dSnFvtDaeaXKGowZpsyBsZOeKTBlDDUDps7IJsCcAb44MPd0oShQ4+jjfw6PXNrHb71e7Z7lyco2rEAf1wAAAABJRU5ErkJggg==";
  const ICON_DOWN_40 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAA6klEQVRYhe3YsQ3CMBBA0W8WYwQq10zFABRUrhiBqSidyiAUJz77HCdC98sgwVOcEF/AsvbNab8gxhjXPg8hAHB9PT/H3reH+HdVwBIupUE2A6W4VCvyVAsbnQG1GVCbAbUZUJsBtS0+C2uftdqWntXZMzgaB+C9B+B+vvwcnwH3wKVyyBnQOafexLaWW+bsEu+BzOGgsGEdtdxrm9nimdoaWdppi5ZyK6RkDBBfa72R0hml6mbohawZoKrvVi2ydrpr+jtpRbaMnoefi//3zULq0O9mUktILQ46AWGO7IGDjkD4InvhLOsITavLvjAjhqhWAAAAAElFTkSuQmCC";
  const ICON_RESET_40 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAABEElEQVRYhe2XvQ3CMBBGPyOGYCb6XM0EDMME1KRnJrYwFZFlYef+7CSSXxmSz08J5zsDg8Hg2ARrQIwx1n6f5xkA8Kb7cu2JD3tdteCaWI5WVCz4T6y0uORes6BlMcuzLMF8Ae3n0uQ0CfXMqwZ7y2lyT9xQLzkACCGwnysKSrcRC9M0AQCur8dy7YZLBLJPzJXyfJtrsLaElJ5yQKFISpK95YBKFbeqYCmsbWYrOcBhmrGQvwAi0rW6FpT+QrnkJoJrRZhKdhfkbmM/ya6C0kZAROHMDfOo5LQHc/KBSi+WNHQrLtNMraFLkQwixx5YvSWbjPylcIlo80OTdrGux06OaI1uB/ecvQ24g8Fgb3wBwP5AriDNomsAAAAASUVORK5CYII=";
  const ICON_BUILD_40 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAADAElEQVRYhe2Zz2sTQRTHv1sjeAhIA0Uqyna6YE9CbbAmJ8PuwV7EvXqS9uDRW089eegp+B9I9l/Qmx6yraekSrcFQWhhO4lipQjx0qOyHmSGmd2Z7m42bSL0C/kxb9/M++TN27ebxMDwinL6G8MEESdlDkgIASEkVyBKKSileaYY/AlA1Ov1cgU8b83NzQGAYQCI2u124QUdx5HGo1qzNIpFVEA6e7/fT13TdV3s7e0BQDFAx3E4gC6Dog/T2tpaKiCTBLi5uaktZEIINjY2tHB3lmpK+Ha7rYSM+x/sdrBQreMw6Ep2CZDBHR0dJQDn5+eV4AxueuZGAkAFFocCgNqKi4VqXekjARJCQClVwohthQWOw+28fwsAiKIItRVXgkyD1UkCFLcwrxgcABiGgQePnqTO0WVNlPIkEQs+66eOogiGkf1iEa81nRKAjuNgMBjwcaVSSYXsvnsjQZ6VPdd1pbM0FyCDm35Z4bbBYJCAbLVaUm0tVOs42O2gtuJyuF8/T3AYdLlPq9UCAN7fhgJk2u6U0aifZlpQhBTF4JhM0+Tv85TQVNzAgLY7Ze0k0zR5FlmQw6ArPcQeybLHxrZtgxAC27YTDT4uKYPi1gGArwig8meQophdNZf12yx3N4ktFoPqAsT9d17PJjKx+NDDi2fqOzjWb9lrZkDTNNHv91OhRF+mreUyGk9PETyu4/mr7/jzRf+B2LWYUpoaq/DdTF6x+hXHZ6kEAJZlcYNlWQjDUHISj8ftYRiid/sqFmdO8fveXSxdn8L95Zs4vuLCNAPlfDGGbm0JUBU4qyzLwgd81R47a14WJdrMpOkSsKguAYuqBAC+7xda5OTbLPZpGQ3rM4JbdXz6eIxrPyh8f78w4MRn0AAQra6ujptDKc/z/m1xli/T4xLf4qJ1OEqJLCXdgUkRB7RtmwOOqyY9z+MsTImbhfX19YsjUsRuNpuSLQEYdxi3OKDv+7l/NT0v+b7Pt5kDTlIvbDQavPVxwEnthf/FpQ7I/5fCRcn4C+eBWZIvaxZJAAAAAElFTkSuQmCC";

  // Application state object - tracks selection bounds and UI state
  const state = {
    absX: null, absY: null, // Current cursor position in absolute coordinates
    lastTileSeen: null,
    minX: null, maxX: null, minY: null, maxY: null, // Selection boundaries
    pts: { minX: null, maxX: null, minY: null, maxY: null },
    tileBase: null,
    minimized: true, // Whether window is collapsed to compact mode
    showInfo: false, // Whether info panel is expanded
    lastTileEvent: null,
    lastPixelEvent: null,
    currentSample: null
  };


  // Load UI state from localStorage on startup
  function loadState() {
    try {
      const saved = localStorage.getItem(STATE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        state.minimized = parsed.minimized !== undefined ? parsed.minimized : true;
        state.showInfo = parsed.showInfo !== undefined ? parsed.showInfo : false;
      }
    } catch (e) {
      console.warn('Error loading state:', e);
    }
  }


  // Save current UI state to localStorage
  function saveState() {
    try {
      localStorage.setItem(STATE_KEY, JSON.stringify({
        minimized: state.minimized,
        showInfo: state.showInfo
      }));
    } catch (e) {
      console.warn('Error saving state:', e);
    }
  }

  const css = `
    :root{
      --was-bg: #c0c0c0;
      --was-bg-strong: #c0c0c0;
      --was-border: #808080;
      --was-border-light: #ffffff;
      --was-border-dark: #404040;
      --was-fg: #000000;
      --was-muted: #404040;
      --was-btn: 52px;
      --was-gap: 10px;
      --was-pad: 10px;
      --was-grip: #000080;
      --was-title-bg: linear-gradient(90deg, #000080 0%, #0000ff 50%, #000080 100%);
    }
    .was-overlay{
      position: fixed; top: 16px; left: 12px; z-index: 2147483647;
      width: calc(var(--was-pad)*2 + var(--was-btn)*3 + var(--was-gap)*2 + 20px);
      max-width: 96vw; border-radius: 0; overflow: visible;
      color: var(--was-fg); background: var(--was-bg);
      border: 2px outset var(--was-bg);
      box-shadow: 2px 2px 4px rgba(0,0,0,0.5);
      backdrop-filter: none; -webkit-backdrop-filter: none;
      font-family: 'MS Sans Serif', sans-serif;
      background-image: 
        linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%),
        linear-gradient(-45deg, rgba(255,255,255,0.1) 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.1) 75%),
        linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.1) 75%);
      background-size: 2px 2px;
      background-position: 0 0, 0 1px, 1px -1px, -1px 0px;
    }

    .was-gripRow{ 
      padding: 6px; 
      background: var(--was-title-bg);
      border-bottom: 1px solid var(--was-border-dark);
      position: relative;
      display: flex;
      align-items: center;
      height: 28px;
    }
    .was-window-icon{
      width: 16px; height: 16px;
      margin-right: 4px;
      image-rendering: pixelated;
      image-rendering: crisp-edges;
      image-rendering: -moz-crisp-edges;
      image-rendering: -webkit-optimize-contrast;
      background: none;
      border: none;
      outline: none;
      pointer-events: none;
    }
    .was-grip{
      flex: 1; height: 26px; 
      background: none;
      cursor: grab; user-select:none;
      display: flex; align-items: center; justify-content: flex-start;
      font: bold 13px 'MS Sans Serif', 'Tahoma', sans-serif;
      color: #ffffff; text-shadow: 1px 1px 0 rgba(0,0,0,0.5);
      -webkit-font-smoothing: none; font-smooth: never;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      padding-left: 8px;
      position: relative;
      z-index: 0;
    }
    .wov-grip.is-dragging{ cursor: grabbing; }
    .was-window-controls{
      display: flex;
      gap: 2px;
    }
    .was-window-btn{
      width: 20px; height: 18px;
      background: var(--was-bg); border: 1px outset var(--was-bg);
      font-size: 10px; font-weight: bold; color: var(--was-fg);
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      font-family: 'MS Sans Serif', sans-serif;
      position: relative;
      z-index: 1;
    }
    .was-overlay:not(.was-collapsed) .was-maximize-btn{ display: none; }
    .was-collapsed .was-close-btn{ display: none; }
    .was-window-btn:hover{ background: #d4d0c8; }
    .was-window-btn:active{ border: 1px inset var(--was-bg); }


    .was-titleRow{ 
      display: none;
    }
    .was-title{
      margin:0; text-align:center; text-transform: none;
      font: bold 11px 'MS Sans Serif', sans-serif;
      letter-spacing: 0; color: var(--was-fg);
      -webkit-font-smoothing: none; font-smooth: never;
      text-shadow: 1px 1px 0 var(--was-border-light);
    }


    .was-three{ padding: var(--was-gap) var(--was-pad) var(--was-gap) var(--was-pad); display:grid; grid-template-columns: repeat(3,1fr); gap: var(--was-gap); }
    .was-square{
      width: var(--was-btn); height: var(--was-btn); border-radius: 0px;
      background: var(--was-bg); border: 2px outset var(--was-bg);
      display:flex; align-items:center; justify-content:center;
      transition: border .1s ease;
      cursor: pointer;
      box-shadow: 1px 1px 2px rgba(0,0,0,0.3);
      padding: 0px;
    }
    .was-square#was-discord{ background: #5662f6; border: 2px outset #5662f6; }
    .was-square#was-info{ background: #4a4284; border: 2px outset #4a4284; }
    .was-square:hover{ background: #d4d0c8; }
    .was-square#was-discord:hover{ background: #7084f8; }
    .was-square#was-info:hover{ background: #5a5296; }
    .was-square:active{ border: 2px inset var(--was-bg); }
    .was-square#was-discord:active{ border: 2px inset #5662f6; }
    .was-square#was-info:active{ border: 2px inset #4a4284; }
    .was-square:active .was-pximg{ transform: translate(1px, 1px); }
    .was-square.is-active .was-pximg{ transform: translate(1px, 1px); }
    .was-square.is-active{ border: 2px inset var(--was-bg); }
    .was-square#was-discord.is-active{ border: 2px inset #5662f6; }
    .was-square#was-info.is-active{ border: 2px inset #4a4284; }
    .was-square#was-info.is-set{ border: 2px inset #4a4284; }

    .was-pximg{ width:40px; height:40px; image-rendering: pixelated; image-rendering: crisp-edges; image-rendering: -moz-crisp-edges; image-rendering: -webkit-optimize-contrast; image-rendering: -o-crisp-edges; -ms-interpolation-mode: nearest-neighbor; object-fit: contain; display:block; pointer-events:none; transition: transform 0.1s ease; }
    .was-info.is-active{ background: #3a3674; border: 2px inset #4a4284; }
    .was-info.is-active .was-pximg{ transform: translate(1px, 1px); }
    .was-btn.is-set{ background: #0a6b59; border: 2px inset #0c816e; }
    .was-btn.is-set .was-pximg{ transform: translate(1px, 1px); }


    .was-grid{ padding: 0 var(--was-pad) var(--was-pad) var(--was-pad); display:grid; grid-template-columns: repeat(3,1fr); gap: var(--was-gap); }
    .was-btn{
      width: var(--was-btn); height: var(--was-btn);
      background: var(--was-bg); border: 2px outset var(--was-bg);
      border-radius: 0px; display:flex; align-items:center; justify-content:center; cursor:pointer;
      transition: border .1s ease;
      box-shadow: 1px 1px 2px rgba(0,0,0,0.3);
      padding: 0px;
    }
    .was-btn#was-left, .was-btn#was-up, .was-btn#was-right, .was-btn#was-down{ background: #0c816e; border: 2px outset #0c816e; }
    .was-btn#was-reset{ background: #a50e1e; border: 2px outset #a50e1e; }
    .was-btn:hover{ background: #d4d0c8; }
    .was-btn#was-left:hover, .was-btn#was-up:hover, .was-btn#was-right:hover, .was-btn#was-down:hover{ background: #1a9b84; }
    .was-btn#was-reset:hover{ background: #c21a2a; }
    .was-btn:active{ border: 2px inset var(--was-bg); }
    .was-btn#was-left:active, .was-btn#was-up:active, .was-btn#was-right:active, .was-btn#was-down:active{ border: 2px inset #0c816e; }
    .was-btn#was-reset:active{ border: 2px inset #a50e1e; }
    .was-btn:active .was-pximg{ transform: translate(1px, 1px); }
    .was-btn.is-set .was-pximg{ transform: translate(1px, 1px); }
    .was-btn.is-set{ border: 2px inset var(--was-bg); }
    .was-btn#was-left.is-set, .was-btn#was-up.is-set, .was-btn#was-right.is-set, .was-btn#was-down.is-set{ border: 2px inset #0c816e; }
    .was-btn#was-reset.is-set{ border: 2px inset #a50e1e; }



    .was-collapsed{ width: 70px; height: 88px; }
    .was-main{ }
    .was-compact{ display:none; }
    .was-collapsed .was-main{ display:none !important; pointer-events:none; }
    .was-collapsed .was-compact{
      display:flex; flex-direction:column;
    }
    

    .was-compact-header{
      width: 100%; background: var(--was-title-bg);
      border-bottom: 1px solid var(--was-border-dark);
      padding: 6px; display: flex; align-items: center;
      cursor: grab; user-select: none;
      height: 28px;
      justify-content: flex-start;
      gap: 4px;
    }
    .was-compact-header.is-dragging{ cursor: grabbing; }
    .was-compact-icon{
      width: 16px; height: 16px;
      margin-right: 4px;
      image-rendering: pixelated;
      image-rendering: crisp-edges;
      image-rendering: -moz-crisp-edges;
      image-rendering: -webkit-optimize-contrast;
      image-rendering: -o-crisp-edges;
      -ms-interpolation-mode: nearest-neighbor;
    }
    

    .was-title-mini{
      font: bold 13px 'MS Sans Serif', 'Tahoma', sans-serif;
      color: #ffffff; text-shadow: 1px 1px 0 rgba(0,0,0,0.5);
      -webkit-font-smoothing: none; font-smooth: never;
      white-space: nowrap;
      flex: 1; text-align: left;
      display: block;
    }
    

    .was-compact-maximize{
      display: none;
    }
    

    .was-mini-content{
      height: 48px;
      background: var(--was-bg);
      border: 1px inset var(--was-bg);
      margin: 2px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-image: 
        radial-gradient(circle at 1px 1px, rgba(0,0,0,0.05) 1px, transparent 0);
      background-size: 8px 8px;
      cursor: pointer;
    }
    .was-mini-icon{
      width: 40px; height: 40px;
      image-rendering: pixelated;
      image-rendering: crisp-edges;
      image-rendering: -moz-crisp-edges;
      image-rendering: -webkit-optimize-contrast;
      image-rendering: -o-crisp-edges;
      -ms-interpolation-mode: nearest-neighbor;
      transition: transform 0.1s ease;
    }
    .was-mini-content:hover .was-mini-icon{
      transform: scale(1.1);
    }
    .was-mini-content:active .was-mini-icon{
      transform: scale(0.95);
    }
    



    .was-status-bar{
      background: var(--was-bg);
      border: 1px inset var(--was-bg);
      padding: 2px 4px;
      font: 11px 'MS Sans Serif', sans-serif;
      color: var(--was-fg);
      height: 16px;
      display: flex;
      align-items: center;
      min-height: 16px;
      box-shadow: inset 1px 1px 2px rgba(0,0,0,0.3);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-top: 0;
    }
    

    .was-info-panel {
      background: var(--was-bg);
      border: 0;
      margin: 0;
      padding: 0;
      font: 11px 'MS Sans Serif', sans-serif;
      color: var(--was-fg);
      line-height: 1.3;
      max-height: 0;
      overflow: hidden;
      transition: all 0.2s ease;
      box-shadow: none;
    }
    
    .was-info-panel.is-expanded {
      border: 1px inset var(--was-bg);
      margin: 2px;
      padding: 8px;
      max-height: 200px;
      overflow-y: auto;
      box-shadow: inset 1px 1px 2px rgba(0,0,0,0.3);
    }
    
    .was-info-panel h4 {
      margin: 0 0 4px 0;
      font: bold 11px 'MS Sans Serif', sans-serif;
      color: var(--was-fg);
      -webkit-font-smoothing: none;
      font-smooth: never;
    }
    
    .was-info-panel p {
      margin: 0 0 4px 0;
      font: 11px 'MS Sans Serif', sans-serif;
      color: var(--was-fg);
      -webkit-font-smoothing: none;
      font-smooth: never;
      line-height: 1.3;
    }
    
    .was-info-panel .was-mono {
      font: 11px 'Courier New', monospace;
      color: var(--was-fg);
      -webkit-font-smoothing: none;
      font-smooth: never;
    }
    
    .was-mini{ 
      font-size:11px; color: var(--was-muted); 
      font-family: 'MS Sans Serif', sans-serif;
      background: var(--was-bg);
      border: 1px inset var(--was-bg);
      padding: 6px;
      background-image: 
        radial-gradient(circle at 1px 1px, rgba(0,0,0,0.05) 1px, transparent 0);
      background-size: 8px 8px;
      margin: 2px;
    }
    .was-mono{ 
      font-variant-numeric: tabular-nums; 
      font-family: 'Courier New', monospace;
      font-size: 10px;
    }
  `;
  if (typeof GM_addStyle === "function") GM_addStyle(css);
  else { const st=document.createElement("style"); st.textContent=css; document.head.appendChild(st); }


  loadState();


  const box = document.createElement("div");
  box.className = "was-overlay";
  box.id = "was";
  if (state.minimized) box.classList.add("was-collapsed");


  const main = document.createElement("div"); main.className = "was-main";


  const gripRow = document.createElement("div"); gripRow.className = "was-gripRow";
  
  const windowIcon = document.createElement("img"); 
  windowIcon.className = "was-window-icon";
  windowIcon.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAC6UExURQAAAIZuBjEwMailqJiYmG9vb8zIzElHSUZFRuXi5frQG8zLzPDu8NbX1qOko4SGhDs7O4mLiY6Qjv/zAPjZWcXExcbHxtTV1MLDwltbW+/r7/XLFry9vLa3turo6qWnpcDBwMbFxvXhlZ+fn56fnqutq8rLytHS0be5t+Ph48zNzOfj55mamZaWln9/f7q5uo6Pjri5uL2+vVZWVqipqJCOkMjJyFBQUK2trURDRMPEw7Kzsp6env///3dS6aQAAAACdFJOUwCfFiND7QAAAAFiS0dEPdBtUVkAAAAHdElNRQfpCQ4GMDdzJhrmAAAAkUlEQVQY04XN1xaCMAyA4RpFKxjqLFipgFvce77/c9nA8bgu/O/ytSdh7DcA+BzzBQuycvQGxRKHcpbtOAYqaHJFtVa3G80WgfQQ/bYlUXUCbaCbQhgFbtzrD+jH0IA7Ggsh1IRgGhEks3kC3mKZ7jBL/ZWK15vtTj+v4P6g8HjSL8Az55erJLjd3wMGX7G/PQDnLA8C88GR5QAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyNS0wOS0xNFQwNjo0ODo1NCswMDowMHWFTfcAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjUtMDktMTRUMDY6NDg6NTQrMDA6MDAE2PVLAAAAKHRFWHRkYXRlOnRpbWVzdGFtcAAyMDI1LTA5LTE0VDA2OjQ4OjU1KzAwOjAw9brfIAAAAABJRU5ErkJggg==";
  windowIcon.alt = "Ícono de aplicación";
  
  const grip = document.createElement("div"); grip.className = "was-grip"; grip.title = "Arrastrar para mover";
  grip.textContent = "Wplace Area Screenshot";
  
  const windowControls = document.createElement("div"); windowControls.className = "was-window-controls";
  const closeBtn = document.createElement("button"); closeBtn.className = "was-window-btn was-close-btn"; closeBtn.textContent = "_"; closeBtn.title = "Minimizar";
  const maximizeBtn = document.createElement("button"); maximizeBtn.className = "was-window-btn was-maximize-btn"; maximizeBtn.textContent = "□"; maximizeBtn.title = "Maximizar/Restaurar";
  
  windowControls.appendChild(closeBtn);
  windowControls.appendChild(maximizeBtn);
  gripRow.appendChild(windowIcon);
  gripRow.appendChild(grip);
  gripRow.appendChild(windowControls);


  const titleRow = document.createElement("div"); titleRow.className = "was-titleRow";
  const title = document.createElement("h3"); title.className = "was-title"; title.textContent = "Wplace Area Screenshot";
  titleRow.appendChild(title);


  const three = document.createElement("div"); three.className = "was-three";

  const discordBtn = document.createElement("button");
  discordBtn.className = "was-square"; discordBtn.id = "was-discord";
  discordBtn.appendChild(img(ICON_DISCORD_40, "Discord 40x40"));

  discordBtn.addEventListener("mouseenter", () => updateStatus("Abrir Discord"));
  discordBtn.addEventListener("mouseleave", () => updateStatus());

  const emptyBtn = document.createElement('div');
    emptyBtn.className = 'was-square';
    emptyBtn.id = 'was-empty';
    emptyBtn.style.visibility = 'hidden';

    const infoBtn = document.createElement('div');
     infoBtn.className = 'was-square';
     infoBtn.id = 'was-info';
     infoBtn.innerHTML = `<img src="${ICON_INFO_40}" class="was-pximg" alt="Info">`;
     infoBtn.addEventListener('mouseenter', () => updateStatus('Info | Información del script'));
     infoBtn.addEventListener('mouseleave', () => updateStatus('Listo | Creado por ThatHorse'));
 
     three.appendChild(discordBtn);
     three.appendChild(emptyBtn);
     three.appendChild(infoBtn);


  const grid = document.createElement("div"); grid.className = "was-grid";
  const leftBtn = btnIcon("was-left", "", ICON_LEFT_40, "Left 40x40");
  const upBtn = btnIcon("was-up", "", ICON_UP_40, "Up 40x40");
  const rightBtn = btnIcon("was-right", "", ICON_RIGHT_40, "Right 40x40");
  const resetBtn = btnIcon("was-reset", "", ICON_RESET_40, "Reset 40x40");
  const downBtn = btnIcon("was-down", "", ICON_DOWN_40, "Down 40x40");
  const buildBtn = btnIcon("was-build", "", ICON_BUILD_40, "Build 40x40");
  
  
  

  leftBtn.addEventListener("mouseenter", () => updateStatus("Límite izquierdo"));
  leftBtn.addEventListener("mouseleave", () => updateStatus());
  
  upBtn.addEventListener("mouseenter", () => updateStatus("Límite superior"));
  upBtn.addEventListener("mouseleave", () => updateStatus());
  
  rightBtn.addEventListener("mouseenter", () => updateStatus("Límite derecho"));
  rightBtn.addEventListener("mouseleave", () => updateStatus());
  
  resetBtn.addEventListener("mouseenter", () => updateStatus("Resetear área"));
  resetBtn.addEventListener("mouseleave", () => updateStatus());
  
  downBtn.addEventListener("mouseenter", () => updateStatus("Límite inferior"));
  downBtn.addEventListener("mouseleave", () => updateStatus());
  
  buildBtn.addEventListener("mouseenter", () => updateStatus("Generar imagen PNG"));
  buildBtn.addEventListener("mouseleave", () => updateStatus());
  
  infoBtn.addEventListener("mouseenter", () => updateStatus("Mostrar/ocultar información"));
  infoBtn.addEventListener("mouseleave", () => updateStatus());
  
  grid.appendChild(leftBtn);
  grid.appendChild(upBtn);
  grid.appendChild(rightBtn);
  grid.appendChild(resetBtn);
  grid.appendChild(downBtn);
  grid.appendChild(buildBtn);


  const infoPanel = document.createElement("div");
  infoPanel.className = "was-info-panel";
  infoPanel.id = "was-info-panel";
  if (state.showInfo) infoPanel.classList.add("is-expanded");
  infoPanel.innerHTML = `
    <h4>Información de Captura</h4>
    <p class="was-mono">Posición: <span id="was-pos">-</span></p>
    <p class="was-mono">Área: <span id="was-area">-</span></p>
    <p class="was-mono">Píxeles: <span id="was-pixels">-</span></p>
    <p class="was-mono">Última muestra: <span id="was-sample">-</span></p>
    <h4>Extremos</h4>
    <p class="was-mono">Min X: <span id="was-ext-minx">-</span>, Max X: <span id="was-ext-maxx">-</span></p>
    <p class="was-mono">Min Y: <span id="was-ext-miny">-</span>, Max Y: <span id="was-ext-maxy">-</span></p>
    <h4>Esquinas</h4>
    <p class="was-mono">Superior-izq: <span id="was-rect-tl">-</span></p>
    <p class="was-mono">Inferior-der: <span id="was-rect-br">-</span></p>
  `;

  main.appendChild(gripRow);
  main.appendChild(titleRow);
  main.appendChild(three);
  main.appendChild(grid);
  main.appendChild(infoPanel);
  

  const statusBar = document.createElement("div");
  statusBar.className = "was-status-bar";
  statusBar.id = "was-status";
  statusBar.textContent = "Listo";
  main.appendChild(statusBar);


  const compact = document.createElement("div"); compact.className = "was-compact";
  

  const compactHeader = document.createElement("div"); compactHeader.className = "was-compact-header"; compactHeader.title = "Arrastrar para mover";

  const compactIcon = document.createElement("img");
  compactIcon.className = "was-compact-icon";
  compactIcon.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAC6UExURQAAAIZuBjEwMailqJiYmG9vb8zIzElHSUZFRuXi5frQG8zLzPDu8NbX1qOko4SGhDs7O4mLiY6Qjv/zAPjZWcXExcbHxtTV1MLDwltbW+/r7/XLFry9vLa3turo6qWnpcDBwMbFxvXhlZ+fn56fnqutq8rLytHS0be5t+Ph48zNzOfj55mamZaWln9/f7q5uo6Pjri5uL2+vVZWVqipqJCOkMjJyFBQUK2trURDRMPEw7Kzsp6env///3dS6aQAAAACdFJOUwCfFiND7QAAAAFiS0dEPdBtUVkAAAAHdElNRQfpCQ4GMDdzJhrmAAAAkUlEQVQY04XN1xaCMAyA4RpFKxjqLFipgFvce77/c9nA8bgu/O/ytSdh7DcA+BzzBQuycvQGxRKHcpbtOAYqaHJFtVa3G80WgfQQ/bYlUXUCbaCbQhgFbtzrD+jH0IA7Ggsh1IRgGhEks3kC3mKZ7jBL/ZWK15vtTj+v4P6g8HjSL8Az55erJLjd3wMGX7G/PQDnLA8C88GR5QAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyNS0wOS0xNFQwNjo0ODo1NCswMDowMHWFTfcAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjUtMDktMTRUMDY6NDg6NTQrMDA6MDAE2PVLAAAAKHRFWHRkYXRlOnRpbWVzdGFtcAAyMDI1LTA5LTE0VDA2OjQ4OjU1KzAwOjAw9brfIAAAAABJRU5ErkJggg==";
  compactIcon.alt = "Ícono de aplicación";
  
  const titleMini = document.createElement("div"); titleMini.className = "was-title-mini"; titleMini.textContent = "WAS";
  const compactMaxBtn = document.createElement("button"); compactMaxBtn.className = "was-compact-maximize"; compactMaxBtn.textContent = "□"; compactMaxBtn.title = "Maximizar"; compactMaxBtn.style.display = "none";
  
  
  compactHeader.appendChild(compactIcon);
  compactHeader.appendChild(titleMini);
  compactHeader.appendChild(compactMaxBtn);
  
  const miniContent = document.createElement("div");
  miniContent.className = "was-mini-content";
  const miniIcon = document.createElement("img"); miniIcon.className = "was-mini-icon"; miniIcon.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAACtElEQVRYhdWZPWgUQRiGnxE5K60WUpjkOK7wGkllkYAYsbC1uUCa61OohZBCUBeCFoEr1EKwFsS7zsJOsNEIqfwp7GT9AyFVKrlmLO6+9dvJ7O3O5i45Xxiyt2Fmn3u/H2bnDFlZZkPmwAVg9+rx0aN4FCUxjNgEcGbgRAJpmEE4UZTEnDhuiCKdnPSCo9Cwy+30XqNeq7zexAEBrLUYo+ovqQ48UcAoibF22Knkr0gD7yblYafioAtkrc0Au+5CvsNTKRJjDL1eLwUzxmSG3NfjAg/S+V+TQXo9EQejJM44APBpoQ39PjB08O57OP+9T7vdTh1008CnyoBSrfIgccYYw50d+w8ShqAL7RRawPSciYQ4SuJ06PDkafNdLws6uu6PnC2jQsA8KJ1TeXBfbn1IITVwiLwhdsMnyrQKFRJfeH2wdJe8c4IAdS8bB1Wk7ZU1NrtQu/aIj81LtLpLbK+sAdmQu+u6fXFskbjJq9Wo1zLtwJW41uIGrS4pXKhyc9AH16jX0qE/58KNQurmYohyHXTL3wX5c/EpAPPPfnnz7+XOfa7sb/Dz8+UDa28tF7eXXMC9epwmsDtJoIqkwym5WDXEpRu1wJ1tng5+SFU4KOiD1tpMy9Fwg07EoBONXfzmmSc83N+oDJcLKGEW6dBqsFPNt5nt1tayv6dpyJD8g4AQlwmtr/FK4VR1MhdQF4sxBnvvXKkFx21Uff+vDOjToBNx9dULAN5cny/1sFAgV6UAxcXV6DUA64tz8PhHph2FqGz+FQK6PXF9cQ6A599+A7A6gnS/zCQVFGIBE/nC7L6LHFaFgG6xaPkAfDsh917IK2iQg6GO6K19VR3Ja+dhThlKAbrFMm0orUM7OA0orUqA04bSKg2oNxDThtIKcvA4Djr/iyNg0cxA+g7RRTP3M8Rf1dp7oL2aAjgAAAAASUVORK5CYII="; miniIcon.alt = "App icon";
  miniContent.appendChild(miniIcon);
  

  miniContent.addEventListener("click", () => {
    state.minimized = false;
    box.classList.remove("was-collapsed");
    updateStatus("Ventana expandida");
    saveState();
  });

  compact.appendChild(compactHeader);
  compact.appendChild(miniContent);

  box.appendChild(main);
  box.appendChild(compact);
  document.body.appendChild(box);


  applyStoredPosition();
  window.addEventListener("resize", clampToViewport);


  function toggleMinimize() {
    state.minimized = !state.minimized;
    box.classList.toggle("was-collapsed", state.minimized);
  }
  
  function toggleMaximize() {
    state.minimized = false;
    box.classList.remove("was-collapsed");
  }
  
  closeBtn.addEventListener("click", () => {
    state.minimized = true;
    box.classList.add("was-collapsed");
    updateStatus("Ventana minimizada");
    saveState();
  });
  

  maximizeBtn.addEventListener("click", () => {
    state.minimized = true;
    box.classList.add("was-collapsed");
    updateStatus("Ventana minimizada");
    saveState();
  });

  

  compactMaxBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    state.minimized = false;
    box.classList.remove("was-collapsed");
    updateStatus("Ventana maximizada");
  });
  

   compactHeader.addEventListener("mousedown", (e) => {
     if (e.target === compactMaxBtn) return;

   });

  discordBtn.addEventListener("click", () => {
    try { window.open("https://conurplace.com.ar", "_blank", "noopener"); }
    catch(_) { location.href = "https://conurplace.com.ar"; }
  });

  function setInfoVisible(flag) {
    state.showInfo = flag;
    if (state.showInfo) {
      infoPanel.classList.add("is-expanded");
    } else {
      infoPanel.classList.remove("is-expanded");
    }
    infoBtn.classList.toggle("is-active", state.showInfo);
    saveState();
  }
  infoBtn.addEventListener("click", () => {
    setInfoVisible(!state.showInfo);
    updateStatus(state.showInfo ? "Panel de información expandido" : "Panel de información contraído");
  });


  function updateStatus(message) {
    const statusBar = document.getElementById("was-status");
    if (statusBar) statusBar.textContent = message || "Listo | Creado por ThatHorse";
  }
  



  // Window dragging functionality
  let dragging = false, dragStartX = 0, dragStartY = 0, originLeft = 0, originTop = 0;
  
  function startDrag(e, el) {
    dragging = true; el.classList.add("is-dragging"); document.body.style.userSelect = "none";
    const r = box.getBoundingClientRect(); originLeft = r.left; originTop = r.top; dragStartX = e.clientX; dragStartY = e.clientY; e.preventDefault();
  }
  
  function onDrag(e) {
    if (!dragging) return;
    box.style.left = (originLeft + (e.clientX - dragStartX)) + "px";
    box.style.top = (originTop + (e.clientY - dragStartY)) + "px";
    box.style.right = "auto"; box.style.position = "fixed";
  }
  
  function endDrag() {
    if (!dragging) return;
    dragging = false; grip.classList.remove("is-dragging"); compactHeader.classList.remove("is-dragging"); document.body.style.userSelect = "";
    clampToViewport(); storePosition();
  }
  grip.addEventListener("mousedown", (e)=>startDrag(e, grip));
  compactHeader.addEventListener("mousedown", (e)=>startDrag(e, compactHeader));
  window.addEventListener("mousemove", onDrag);
  window.addEventListener("mouseup", endDrag);


  // Utility functions for DOM creation
  function img(src, alt){ const i=document.createElement("img"); i.className="was-pximg"; i.src=src; i.alt=alt; return i; }
  function btnIcon(id, titleTxt, base64, alt){
    const b=document.createElement("button"); b.id=id; b.className="was-btn"; b.title=titleTxt; b.appendChild(img(base64, alt)); return b;
  }
  const $ = (id) => document.getElementById(id);


  // Coordinate conversion functions
  function toAbs(tx, ty, pxX, pxY) {
    const absX = tx * TILE_SIZE + pxX;
    const absY = ty * TILE_SIZE + (INVERT_Y ? TILE_SIZE - 1 - pxY : pxY);
    return { absX, absY };
  }
  
  function absToTilePx(absX, absY) {
    const tileX = Math.floor(absX / TILE_SIZE);
    const tileY = Math.floor(absY / TILE_SIZE);
    const pxX = absX % TILE_SIZE;
    const pxTop = absY % TILE_SIZE;
    const pxY = INVERT_Y ? TILE_SIZE - 1 - pxTop : pxTop;
    return { tileX, tileY, pxX, pxY };
  }
  
  // Format coordinates for display
  function fmtSkirkFromAbs(ax, ay) {
    const { tileX, tileY, pxX, pxY } = absToTilePx(ax, ay);
    return `(Tl X: ${tileX}, Tl Y: ${tileY}, Px X: ${pxX}, Px Y: ${pxY})`;
  }
  function setText(id, txt) { const el = $(id); if (el) el.textContent = txt; }
  function updateBtnStates() {
    toggleSet(leftBtn, state.minX != null);
    toggleSet(rightBtn, state.maxX != null);
    toggleSet(upBtn, state.minY != null);
    toggleSet(downBtn, state.maxY != null);
  }
  function toggleSet(btn, isSet) { if (btn) btn.classList.toggle("is-set", !!isSet); }

  function updateHUD() {

    const posText = (state.absX != null && state.absY != null) ? fmtSkirkFromAbs(state.absX, state.absY) : "-";
    setText("was-pos", posText);
    
    const areaText = (state.minX != null && state.maxX != null && state.minY != null && state.maxY != null) ? 
      `${Math.abs(state.maxX - state.minX) + 1} × ${Math.abs(state.maxY - state.minY) + 1}` : "-";
    setText("was-area", areaText);
    
    const pixelsText = (state.minX != null && state.maxX != null && state.minY != null && state.maxY != null) ? 
      ((Math.abs(state.maxX - state.minX) + 1) * (Math.abs(state.maxY - state.minY) + 1)).toLocaleString() : "-";
    setText("was-pixels", pixelsText);
    
    const sampleText = state.currentSample ? fmtSkirkFromAbs(state.currentSample.absX, state.currentSample.absY) : "-";
     setText("was-sample", sampleText);
    

    setText("was-ext-minx", state.pts.minX ? fmtSkirkFromAbs(state.pts.minX.absX, state.pts.minX.absY) : "—");
    setText("was-ext-maxx", state.pts.maxX ? fmtSkirkFromAbs(state.pts.maxX.absX, state.pts.maxX.absY) : "—");
    setText("was-ext-miny", state.pts.minY ? fmtSkirkFromAbs(state.pts.minY.absX, state.pts.minY.absY) : "—");
    setText("was-ext-maxy", state.pts.maxY ? fmtSkirkFromAbs(state.pts.maxY.absX, state.pts.maxY.absY) : "—");
    

    if (state.minX != null && state.minY != null) setText("was-rect-tl", fmtSkirkFromAbs(state.minX, state.minY));
    else setText("was-rect-tl", "—");
    if (state.maxX != null && state.maxY != null) setText("was-rect-br", fmtSkirkFromAbs(state.maxX, state.maxY));
    else setText("was-rect-br", "—");
    
    updateBtnStates();
  }


  (function injectBridge() {
    const s = document.createElement("script");
    s.textContent = `
      (function(){
        const _f = window.fetch;
        window.fetch = async function(...args){
          const res = await _f.apply(this, args);
          try{
            const url = (args[0] instanceof Request) ? args[0].url : String(args[0] || "");
            window.postMessage({ source: "rectsnap", endpoint: url }, "*");
            const clone = res.clone();
            const ct = clone.headers.get("content-type") || "";
            if (ct.includes("application/json")) {
              clone.json().then(function(json){
                window.postMessage({ source: "rectsnap-json", endpoint: url, jsonData: json }, "*");
              }).catch(()=>{});
            }
          } catch(e){}
          return res;
        };
        const _open = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url) {
          try { window.postMessage({ source: "rectsnap-xhr", endpoint: url }, "*"); } catch(_) {}
          return _open.apply(this, arguments);
        };
        try{
          const d = Object.getOwnPropertyDescriptor(Image.prototype, "src");
          if (d && d.set) {
            Object.defineProperty(Image.prototype, "src", {
              get: d.get,
              set: function(v){
                try { window.postMessage({ source: "rectsnap-img", endpoint: String(v || "") }, "*"); } catch(_){}
                return d.set.call(this, v);
              }
            });
          }
        } catch(_){}
      })();
    `;
    (document.head || document.documentElement).appendChild(s);
    s.remove();
  })();

  const mo = new MutationObserver((muts) => {
    for (const m of muts) {
      if (m.type === "attributes" && m.attributeName === "src" && m.target.tagName === "IMG") {
        const v = m.target.getAttribute("src") || "";
        if (v) processEndpoint(v);
      }
      if (m.type === "childList") {
        for (const n of m.addedNodes) {
          if (n.tagName === "IMG") {
            const v = n.getAttribute("src") || "";
            if (v) processEndpoint(v);
          }
        }
      }
    }
  });
  mo.observe(document.documentElement, { attributes: true, childList: true, subtree: true });

  window.addEventListener("message", (ev) => {
    const d = ev.data || {};
    if (!d.endpoint) return;
    if (d.source === "rectsnap" || d.source === "rectsnap-xhr" || d.source === "rectsnap-img") processEndpoint(d.endpoint);
  });

  function processEndpoint(rawUrl) {
    try {
      const url = new URL(rawUrl, location.href);
      const tilesInfo = parseTileFromURL(url);
      if (tilesInfo && tilesInfo.base) state.tileBase = tilesInfo.base;
      if (tilesInfo && Number.isFinite(tilesInfo.tx) && Number.isFinite(tilesInfo.ty)) {
        state.lastTileSeen = { tx: tilesInfo.tx, ty: tilesInfo.ty };
        state.lastTileEvent = { tx: tilesInfo.tx, ty: tilesInfo.ty, base: state.tileBase || tilesInfo.base || null, ts: Date.now() };
      }
      const xy = parsePxXYFromURL(url);
      if (xy) {
        if (xy.pxX === 0 && xy.pxY === 0) return;
        state.lastPixelEvent = { rawX: xy.pxX, rawY: xy.pxY, ts: Date.now() };
      }
      maybeUpdateCurrentSample();
    } catch (_) {}
  }

  function parsePxXYFromURL(u) {
    try {
      const pxX = Number(u.searchParams.get("x"));
      const pxY = Number(u.searchParams.get("y"));
      if (Number.isFinite(pxX) && Number.isFinite(pxY)) return { pxX, pxY };
    } catch (_) {}
    return null;
  }

  function parseTileFromURL(u) {
    try {
      const clean = u.pathname.replace(/\/+/g, "/");
      const parts = clean.split("/").filter(Boolean);
      const i = parts.lastIndexOf("tiles");
      if (i >= 0) {
        const a = parts[i + 1], b = parts[i + 2], c = parts[i + 3];
        if (a && /^\d+$/.test(a) && b && c && /\.png$/i.test(c)) {
          const tx = Number(b), ty = Number(c.replace(/\.png$/i, ""));
          if ([tx, ty].every(Number.isFinite)) {
            const basePath = parts.slice(0, i + 2).join("/"); const base = `${u.origin}/${basePath}`;
            return { tx, ty, base };
          }
        }
        if (a && parts[i + 2] && /\.png$/i.test(parts[i + 2])) {
          const tx = Number(a), ty = Number(parts[i + 2].replace(/\.png$/i, ""));
          if ([tx, ty].every(Number.isFinite)) {
            const basePath = parts.slice(0, i + 1).join("/"); const base = `${u.origin}/${basePath}`;
            return { tx, ty, base };
          }
        }
      }
      const nums = parts.filter((s) => /^\d+$/.test(s)).map(Number);
      if (nums.length >= 2) { const ty = nums.pop(); const tx = nums.pop(); return { tx, ty }; }
    } catch (_) {}
    return null;
  }

  function maybeUpdateCurrentSample() {
    const tEvt = state.lastTileEvent, pEvt = state.lastPixelEvent;
    if (!tEvt || !pEvt) return;
    if (Math.abs(tEvt.ts - pEvt.ts) > FRESH_PAIR_MS) return;
    const offX = Math.floor(pEvt.rawX / TILE_SIZE);
    const offY = Math.floor(pEvt.rawY / TILE_SIZE);
    const pxXmod = pEvt.rawX % TILE_SIZE;
    const pxYmod = pEvt.rawY % TILE_SIZE;
    const finalTx = tEvt.tx + offX, finalTy = tEvt.ty + offY;
    const abs = toAbs(finalTx, finalTy, pxXmod, pxYmod);
    state.absX = abs.absX; state.absY = abs.absY;
    state.currentSample = { absX: abs.absX, absY: abs.absY, ts: Date.now() };
  }

  function hasFreshSample() { return state.currentSample && (Date.now() - state.currentSample.ts <= FRESH_USE_MS); }

  let toastTimer = null;
  function tinyToast(msg) {
    let el = document.getElementById("was-toast");
    if (!el) {
      el = document.createElement("div"); el.id = "was-toast";
      el.style.position = "fixed"; el.style.left = "16px"; el.style.bottom = "16px"; el.style.zIndex = "2147483647";
      el.style.padding = "8px 10px"; el.style.background = "rgba(0,0,0,.75)"; el.style.color = "#fff";
      el.style.fontSize = "12px"; el.style.borderRadius = "8px"; el.style.pointerEvents = "none"; document.body.appendChild(el);
    }
    el.textContent = msg; el.style.opacity = "1"; clearTimeout(toastTimer); toastTimer = setTimeout(() => { el.style.opacity = "0"; }, 1200);
  }
  function requireFreshOrToast() {
    if (hasFreshSample()) return true;
    tinyToast("Clickeá sobre el mapa para refrescar la coordenada actual");
    return false;
  }

  function setMinXFromCurrent() { if (!requireFreshOrToast()) return; state.minX = state.currentSample.absX; state.pts.minX = { absX: state.currentSample.absX, absY: state.currentSample.absY }; updateHUD(); }
  function setMaxXFromCurrent() { if (!requireFreshOrToast()) return; state.maxX = state.currentSample.absX; state.pts.maxX = { absX: state.currentSample.absX, absY: state.currentSample.absY }; updateHUD(); }
  function setMinYFromCurrent() { if (!requireFreshOrToast()) return; state.minY = state.currentSample.absY; state.pts.minY = { absX: state.currentSample.absX, absY: state.currentSample.absY }; updateHUD(); }
  function setMaxYFromCurrent() { if (!requireFreshOrToast()) return; state.maxY = state.currentSample.absY; state.pts.maxY = { absX: state.currentSample.absX, absY: state.currentSample.absY }; updateHUD(); }
  function resetExtremes() {
    state.minX = state.maxX = state.minY = state.maxY = null;
    state.pts.minX = state.pts.maxX = state.pts.minY = state.pts.maxY = null;

    leftBtn.classList.remove("is-set");
    rightBtn.classList.remove("is-set");
    upBtn.classList.remove("is-set");
    downBtn.classList.remove("is-set");
    updateHUD();
    updateStatus("Área reseteada - todos los estados limpiados");
  }


  leftBtn.addEventListener("click", setMinXFromCurrent);
  rightBtn.addEventListener("click", setMaxXFromCurrent);
  upBtn.addEventListener("click", setMinYFromCurrent);
  downBtn.addEventListener("click", setMaxYFromCurrent);
  resetBtn.addEventListener("click", resetExtremes);
  // Main image generation handler
  buildBtn.addEventListener("click", async () => {
    try {
      updateStatus("Generando imagen...");
      await buildAndDownload();
      resetExtremes();
      updateStatus("Imagen generada correctamente");
    } catch (e) {
      updateStatus("Error al generar imagen");
      alert("Failed to create capture: " + (e && e.message ? e.message : e));
    }
  });




  async function buildAndDownload() {
    const base = state.tileBase;
    if (!base) throw new Error("Unknown tile server base. Pan/zoom para auto-detectar (/tiles/...).");
    if (state.minX == null || state.maxX == null || state.minY == null || state.maxY == null) throw new Error("Faltan extremos. Usá los botones primero.");

    const x0 = Math.min(state.minX, state.maxX), y0 = Math.min(state.minY, state.maxY);
    const x1 = Math.max(state.minX, state.maxX), y1 = Math.max(state.minY, state.maxY);
    const width = x1 - x0 + 1, height = y1 - y0 + 1;
    if (width <= 0 || height <= 0) throw new Error("Dimensiones inválidas.");

    const tileStartX = Math.floor(x0 / TILE_SIZE), tileStartY = Math.floor(y0 / TILE_SIZE);
    const tileEndX = Math.floor((x0 + width - 1) / TILE_SIZE), tileEndY = Math.floor((y0 + height - 1) / TILE_SIZE);

    const out = document.createElement("canvas"); out.width = width; out.height = height;
    const ctx = out.getContext("2d"); ctx.imageSmoothingEnabled = false;

    async function fetchTileBitmap(tx, ty) {
      const url = `${base}/${tx}/${ty}.png`; const blob = await fetchTileBlob(url);
      return await createImageBitmap(blob);
    }
    function fetchTileBlob(url) {
      return new Promise((resolve, reject) => {
        try {
          if (typeof GM_xmlhttpRequest === "function") {
            GM_xmlhttpRequest({
              method: "GET", url, responseType: "blob",
              onload: (r) => { if (r.status >= 200 && r.status < 300 && r.response) resolve(r.response); else fallbackImg(); },
              onerror: () => { fallbackImg(); }
            });
          } else { fallbackImg(); }
          function fallbackImg() {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = async () => {
              try {
                const off = new OffscreenCanvas(img.width, img.height);
                const octx = off.getContext("2d"); octx.imageSmoothingEnabled = false; octx.drawImage(img, 0, 0);
                const b = await off.convertToBlob({ type: "image/png" }); resolve(b);
              } catch (err) { reject(err); }
            };
            img.onerror = () => { reject(new Error("Tile fetch failed (img)")); };
            img.src = url;
          }
        } catch (e) { reject(e); }
      });
    }

    for (let ty = tileStartY; ty <= tileEndY; ty++) {
      for (let tx = tileStartX; tx <= tileEndX; tx++) {
        const bmp = await fetchTileBitmap(tx, ty);
        const tileLeft = tx * TILE_SIZE, tileTop = ty * TILE_SIZE;
        const overlapLeft = Math.max(x0, tileLeft), overlapTop = Math.max(y0, tileTop);
        const overlapRight = Math.min(x1, tileLeft + TILE_SIZE - 1), overlapBottom = Math.min(y1, tileTop + TILE_SIZE - 1);
        if (overlapRight < overlapLeft || overlapBottom < overlapTop) continue;
        const srcX = overlapLeft - tileLeft, srcY = overlapTop - tileTop;
        const srcW = overlapRight - overlapLeft + 1, srcH = overlapBottom - overlapTop + 1;
        const dstX = overlapLeft - x0, dstY = overlapTop - y0;
        ctx.drawImage(bmp, srcX, srcY, srcW, srcH, dstX, dstY, srcW, srcH);
      }
    }

    out.toBlob((blob) => {
      if (!blob) return;
      const a = document.createElement("a");
      const ts = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
      a.href = URL.createObjectURL(blob); a.download = `wplace_area_${width}x${height}_${ts}.png`;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => { URL.revokeObjectURL(a.href); }, 1000);
    }, "image/png");
  }


  setInfoVisible(state.showInfo);
  updateHUD();


  // Store current window position to localStorage
  function storePosition(){
    try{
      const r = box.getBoundingClientRect();
      localStorage.setItem(POS_KEY, JSON.stringify({ left: r.left, top: r.top }));
    }catch(_){}
  }
  
  // Restore window position from localStorage
  function applyStoredPosition(){
    try{
      const raw = localStorage.getItem(POS_KEY);
      if (!raw) return;
      const p = JSON.parse(raw);
      if (typeof p.left === "number" && typeof p.top === "number"){
        box.style.left = p.left + "px";
        box.style.top = p.top + "px";
        box.style.right = "auto";
        clampToViewport();
      }
    }catch(_){}
  }
  
  // Keep window within viewport bounds
  function clampToViewport(){
    const vw = window.innerWidth, vh = window.innerHeight;
    const r = box.getBoundingClientRect();
    let L = r.left, T = r.top;
    const maxL = Math.max(0, vw - r.width - 6);
    const maxT = Math.max(0, vh - r.height - 6);
    L = Math.min(Math.max(6, L), maxL);
    T = Math.min(Math.max(6, T), maxT);
    box.style.left = L + "px"; box.style.top = T + "px";
  }
})();