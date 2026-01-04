// ==UserScript==
// @name         Atomic JS
// @namespace    http://tampermonkey.net/
// @version      35
// @description  ATOMIC ATOM LEARNING
// @author       T_Ranero
// @match        https://app.atomlearning.com/*
// @match        https://app.atomlearning.com/student*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555214/Atomic%20JS.user.js
// @updateURL https://update.greasyfork.org/scripts/555214/Atomic%20JS.meta.js
// ==/UserScript==

    const css = `
    .c-iSBxEZ c-iSBxEZ-ikGFLnC-css {
        scale: 1.3;
    }
    .c-dhzjXW-gkvzBZ-gap-4 {
        gap: var(--space-5);
    }
    .c-ceQiCp[aria-pressed="true"] {
        scale: 0.8;
    }
    .c-ceQiCp[aria-pressed="true"]:hover {
        scale: 0.6;
    }
    .c-kzDvgU-jHjUMV-direction-right {
        background: linear-gradient(to left, rgb(160 255 150 / 82%), transparent);
    }
    .c-kzDvgU-iopgov-direction-left:hover {
        background: linear-gradient(to right, rgb(160 255 150 / 82%), transparent);
    }
    .c-PJLV-iiylJvC-css:hover {
        scale: 1.5;
    }
    .c-kaaUSm-ilhPQCO-css:not([disabled]):hover,
    .c-kaaUSm-ieqceoY-css:not([disabled]):hover,
    .c-kaaUSm-ieqceoY-css:not([disabled]):focus {
        scale: 1.07;
    }
    .c-kaaUSm-ebjJvk-cv:hover {
        scale: 1.15;
    }
    .c-ceQiCp:hover {
        scale: 1.2;
    }
    .c-oUmPa:hover {
        scale: 1.15;
    }
    .c-oUmPa {
        border-radius: var(--radii-round);
    }
    button {
        transition: 500ms ease-out;
    }
    .c-kzDvgU-jHjUMV-direction-right:hover {
        width: 180px;
        background: linear-gradient(to left, rgb(160 255 150 / 82%), transparent);
    }
    .c-kzDvgU-iopgov-direction-left {
        background: linear-gradient(to right, rgb(160 255 150 / 82%), transparent);
    }
    .c-kzDvgU-iopgov-direction-right {
        background: linear-gradient(to right, rgb(160 255 150 / 82%), transparent);
    }
    .c-bemsGI {
        margin-left: 50%;
        overflow: visible;
        transform: translateX(-50%);
    }
    .c-brnaYC {
        content: "";
        position: absolute;
        left: 0px;
        height: 100%;
        width: 100%;
        pointer-events: none;
        box-shadow: none;
        z-index: 1;
    }
    .c-kaaUSm {
        border-radius: var(--radii-round);
    }
    img[data-testid="question-image"] {
        background-color: #fff;
        border: 2px solid #b4beff;
        box-shadow: 0 4px 8px rgba(255, 0, 0, .1);
        border-radius: 8px;
        padding: 10px;
        transition: 500ms ease-out;
    }
    .c-ceQiCp kbd {

        background-color: #94c3aa;
        transition: 100ms ease-out;
        color: #fff;
        border-radius: 10px;
        padding: 4px 8px;
        font-weight: bold;
        :hover {
            scale: 1.5;
        }
    }
    button.c-ceQiCp {
        background: #e1feef;
        border-radius: 20px;
        transition: all 0.3s ease;
    }
    .c-dhzjXW-dvnNgW-gap-3 {
        gap: var(--space-3);
        transition: 500ms ease-out;
    }
    .c-dhzjXW-ihpyPSM-css {
        transition: 200ms cubic-bezier(0.82, -2.22, 1, 1);
        border-radius: 1rem;
        background: hsl(148.97deg 65.59% 88.99%);
        margin-right: var(--space-4);
        overflow: hidden;
        flex-shrink: 0;
    }
    .c-lbKWrY {
        flex-flow: wrap;
        gap: var(--space-3);
        padding: 0 var(--space-4) var(--space-4) var(--space-4);
        background: #e1feef;
    }
    .c-cgyNyA {
        transition: 100ms ease-out;
        display: grid;
        grid-template-columns: auto auto 1fr;
        gap: var(--space-4);
        padding: var(--space-4) var(--space-4) 0 var(--space-4);
        background: #e1feef;
    }
    .c-PJLV.c-jQxwKe {
        transition: 100ms ease-out;
        background-color: #e1feef;
    }
    .c-ceQiCp {
        gap: var(--space-3);
        position: relative;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding: var(--space-3);
        color: var(--colors-grey900);
        border: 1px solid var(--colors-questionAnswerBorder);
        border-radius: var(--radii-0);
        background: white;
        text-align: left;
        transition: 100ms ease-out;
    }
    :root,
    .t-japHGA,
    .t-gHRLwW {
        --colors-primary800: hsl(243.07deg 87.27% 70.96%);
        --colors-questionButtonBackground: hsl(228, 100%, 78%);
        --colors-questionAnswerBackground: hsl(228deg 77.79% 82.94%);
        --colors-questionAnswerBorder: var(--colors-grey600);
        --colors-questionAnswerBorderPressed: hsl(228deg 62.83% 77.09%);
        --fonts-sans: "Comic Sans MS";
        --fonts-mono: 'Comic Sans MS', Consolas, Menlo, monospace;
        --fonts-display: "Comic Sans MS";
        --fonts-body: "Comic Sans MS";
        --colors-textRegular: hsl(0, 0%, 20%);
        --colors-textSubtle: hsl(0, 0%, 33%);
        --colors-textMinimal: hsl(0, 0%, 46%);
        --colors-background: hsl(0, 0%, 96%);
        --colors-backgroundAccent: hsl(215, 100%, 98%);
        --colors-grey100: hsl(0, 0%, 96%);
        --colors-grey200: hsl(0, 0%, 92%);
        --colors-grey300: hsl(0, 0%, 88%);
        --colors-grey400: hsl(0, 0%, 81%);
        --colors-grey500: hsl(0, 0%, 73%);
        --colors-grey600: hsl(0, 0%, 62%);
        --colors-grey700: hsl(0, 0%, 46%);
        --colors-grey800: hsl(0, 0%, 33%);
        --colors-grey900: hsl(0, 0%, 20%);
        --colors-grey1000: hsl(0, 0%, 12%);
        --colors-grey1100: hsl(0, 0%, 10%);
        --colors-grey1200: hsl(0, 0%, 6%);
        --colors-blue100: hsl(215, 100%, 98%);
        --colors-blue200: hsl(212, 100%, 95%);
        --colors-blue300: hsl(211, 100%, 92%);
        --colors-blue400: hsl(211, 100%, 88%);
        --colors-blue500: hsl(212, 100%, 80%);
        --colors-blue600: hsl(213, 100%, 71%);
        --colors-blue700: hsl(214, 100%, 58%);
        --colors-blue800: hsl(217, 92%, 51%);
        --colors-blue900: hsl(223, 79%, 44%);
        --colors-blue1000: hsl(228, 82%, 35%);
        --colors-blue1100: hsl(228, 63%, 23%);
        --colors-blue1200: hsl(227, 57%, 11%);
        --colors-pink100: hsl(311, 100%, 98%);
        --colors-pink200: hsl(310, 100%, 95%);
        --colors-pink300: hsl(311, 100%, 90%);
        --colors-pink400: hsl(313, 100%, 80%);
        --colors-pink500: hsl(313, 83%, 72%);
        --colors-pink600: hsl(315, 82%, 66%);
        --colors-pink700: hsl(316, 63%, 56%);
        --colors-pink800: hsl(317, 63%, 44%);
        --colors-pink900: hsl(318, 63%, 37%);
        --colors-pink1000: hsl(319, 55%, 33%);
        --colors-pink1100: hsl(318, 98%, 16%);
        --colors-pink1200: hsl(318, 97%, 12%);
        --colors-purple100: hsl(246, 83%, 98%);
        --colors-purple200: hsl(244, 74%, 95%);
        --colors-purple300: hsl(246, 76%, 92%);
        --colors-purple400: hsl(246, 74%, 85%);
        --colors-purple500: hsl(249, 72%, 76%);
        --colors-purple600: hsl(252, 70%, 66%);
        --colors-purple700: hsl(256, 65%, 62%);
        --colors-purple800: hsl(252, 51%, 51%);
        --colors-purple900: hsl(257, 54%, 42%);
        --colors-purple1000: hsl(257, 53%, 35%);
        --colors-purple1100: hsl(255, 57%, 23%);
        --colors-purple1200: hsl(255, 76%, 13%);
        --colors-cyan100: hsl(198, 100%, 97%);
        --colors-cyan200: hsl(199, 100%, 94%);
        --colors-cyan300: hsl(201, 100%, 89%);
        --colors-cyan400: hsl(200, 100%, 84%);
        --colors-cyan500: hsl(201, 96%, 73%);
        --colors-cyan600: hsl(202, 85%, 60%);
        --colors-cyan700: hsl(204, 81%, 46%);
        --colors-cyan800: hsl(205, 100%, 38%);
        --colors-cyan900: hsl(206, 100%, 30%);
        --colors-cyan1000: hsl(205, 100%, 21%);
        --colors-cyan1100: hsl(206, 97%, 15%);
        --colors-cyan1200: hsl(207, 73%, 9%);
        --colors-green100: hsl(148, 93%, 94%);
        --colors-green200: hsl(149, 95%, 91%);
        --colors-green300: hsl(147, 87%, 85%);
        --colors-green400: hsl(148, 84%, 70%);
        --colors-green500: hsl(148, 75%, 54%);
        --colors-green600: hsl(148, 77%, 45%);
        --colors-green700: hsl(148, 84%, 36%);
        --colors-green800: hsl(158, 79%, 29%);
        --colors-green900: hsl(166, 71%, 24%);
        --colors-green1000: hsl(166, 67%, 20%);
        --colors-green1100: hsl(169, 88%, 10%);
        --colors-green1200: hsl(155, 92%, 5%);
        --colors-magenta100: hsl(330, 100%, 99%);
        --colors-magenta200: hsl(329, 100%, 96%);
        --colors-magenta300: hsl(332, 100%, 92%);
        --colors-magenta400: hsl(333, 100%, 90%);
        --colors-magenta500: hsl(333, 90%, 80%);
        --colors-magenta600: hsl(333, 87%, 72%);
        --colors-magenta700: hsl(333, 75%, 59%);
        --colors-magenta800: hsl(333, 69%, 49%);
        --colors-magenta900: hsl(333, 74%, 36%);
        --colors-magenta1000: hsl(333, 86%, 25%);
        --colors-magenta1100: hsl(333, 95%, 16%);
        --colors-magenta1200: hsl(334, 62%, 10%);
        --colors-red100: hsl(0, 100%, 99%);
        --colors-red200: hsl(0, 100%, 96%);
        --colors-red300: hsl(0, 100%, 96%);
        --colors-red400: hsl(357, 100%, 93%);
        --colors-red500: hsl(356, 96%, 83%);
        --colors-red600: hsl(357, 90%, 73%);
        --colors-red700: hsl(357, 80%, 59%);
        --colors-red800: hsl(357, 76%, 49%);
        --colors-red900: hsl(357, 73%, 37%);
        --colors-red1000: hsl(357, 79%, 26%);
        --colors-red1100: hsl(357, 91%, 17%);
        --colors-red1200: hsl(357, 73%, 10%);
        --colors-teal100: hsl(180, 83%, 95%);
        --colors-teal200: hsl(180, 75%, 88%);
        --colors-teal300: hsl(180, 71%, 78%);
        --colors-teal400: hsl(179, 70%, 71%);
        --colors-teal500: hsl(179, 65%, 52%);
        --colors-teal600: hsl(179, 76%, 41%);
        --colors-teal700: hsl(179, 91%, 31%);
        --colors-teal800: hsl(178, 100%, 25%);
        --colors-teal900: hsl(180, 100%, 18%);
        --colors-teal1000: hsl(183, 100%, 13%);
        --colors-teal1100: hsl(187, 92%, 10%);
        --colors-teal1200: hsl(186, 56%, 7%);
        --colors-orange100: hsl(45, 100%, 96%);
        --colors-orange200: hsl(46, 100%, 89%);
        --colors-orange300: hsl(46, 100%, 77%);
        --colors-orange400: hsl(44, 100%, 65%);
        --colors-orange500: hsl(41, 100%, 55%);
        --colors-orange600: hsl(29, 100%, 55%);
        --colors-orange700: hsl(35, 95%, 50%);
        --colors-orange800: hsl(22, 94%, 54%);
        --colors-orange900: hsl(22, 100%, 46%);
        --colors-orange1000: hsl(20, 100%, 39%);
        --colors-orange1100: hsl(18, 100%, 27%);
        --colors-orange1200: hsl(18, 100%, 21%);
        --colors-yellow100: hsl(53, 94%, 93%);
        --colors-yellow200: hsl(54, 92%, 85%);
        --colors-yellow300: hsl(54, 92%, 75%);
        --colors-yellow400: hsl(52, 97%, 63%);
        --colors-yellow500: hsl(51, 100%, 46%);
        --colors-yellow600: hsl(49, 100%, 39%);
        --colors-yellow700: hsl(48, 100%, 35%);
        --colors-yellow800: hsl(46, 100%, 30%);
        --colors-yellow900: hsl(44, 100%, 22%);
        --colors-yellow1000: hsl(44, 100%, 18%);
        --colors-yellow1100: hsl(41, 100%, 11%);
        --colors-yellow1200: hsl(39, 100%, 8%);
        --colors-lime100: hsl(73, 94%, 93%);
        --colors-lime200: hsl(73, 94%, 87%);
        --colors-lime300: hsl(73, 90%, 77%);
        --colors-lime400: hsl(74, 82%, 69%);
        --colors-lime500: hsl(74, 68%, 58%);
        --colors-lime600: hsl(74, 77%, 41%);
        --colors-lime700: hsl(75, 100%, 31%);
        --colors-lime800: hsl(75, 100%, 27%);
        --colors-lime900: hsl(75, 100%, 19%);
        --colors-lime1000: hsl(75, 100%, 15%);
        --colors-lime1100: hsl(75, 100%, 9%);
        --colors-lime1200: hsl(74, 100%, 6%);
        --colors-lapis100: hsl(214, 100%, 97%);
        --colors-lapis200: hsl(215, 100%, 95%);
        --colors-lapis300: hsl(202, 100%, 87%);
        --colors-lapis400: hsl(212, 100%, 83%);
        --colors-lapis500: hsl(220, 95%, 76%);
        --colors-lapis600: hsl(230, 84%, 70%);
        --colors-lapis700: hsl(240, 79%, 66%);
        --colors-lapis800: hsl(240, 59%, 52%);
        --colors-lapis900: hsl(240, 58%, 38%);
        --colors-lapis1000: hsl(240, 63%, 29%);
        --colors-lapis1100: hsl(240, 87%, 18%);
        --colors-lapis1200: hsl(240, 97%, 12%);
        --colors-maroon100: hsl(15, 100%, 98%);
        --colors-maroon200: hsl(16, 100%, 93%);
        --colors-maroon300: hsl(16, 100%, 87%);
        --colors-maroon400: hsl(16, 100%, 80%);
        --colors-maroon500: hsl(7, 89%, 70%);
        --colors-maroon600: hsl(7, 78%, 60%);
        --colors-maroon700: hsl(7, 67%, 44%);
        --colors-maroon800: hsl(7, 95%, 32%);
        --colors-maroon900: hsl(349, 89%, 28%);
        --colors-maroon1000: hsl(346, 77%, 26%);
        --colors-maroon1100: hsl(335, 73%, 20%);
        --colors-maroon1200: hsl(335, 81%, 12%);
        --colors-marsh100: hsl(147, 50%, 96%);
        --colors-marsh200: hsl(147, 27%, 88%);
        --colors-marsh300: hsl(147, 26%, 82%);
        --colors-marsh400: hsl(147, 25%, 73%);
        --colors-marsh500: hsl(147, 22%, 60%);
        --colors-marsh600: hsl(147, 15%, 48%);
        --colors-marsh700: hsl(147, 15%, 37%);
        --colors-marsh800: hsl(147, 23%, 29%);
        --colors-marsh900: hsl(147, 25%, 21%);
        --colors-marsh1000: hsl(147, 17%, 18%);
        --colors-marsh1100: hsl(147, 24%, 13%);
        --colors-marsh1200: hsl(147, 14%, 7%);
        --colors-alpha100: hsla(0, 0%, 20%, 0.1);
        --colors-alpha150: hsla(0, 0%, 20%, 0.15);
        --colors-alpha200: hsla(0, 0%, 20%, 0.2);
        --colors-alpha250: hsla(0, 0%, 20%, 0.25);
        --colors-alpha600: hsla(0, 0%, 20%, 0.6);
        --colors-infoLight: hsl(215, 100%, 98%);
        --colors-info: hsl(217, 92%, 51%);
        --colors-infoMid: hsl(223, 79%, 44%);
        --colors-infoDark: hsl(228, 82%, 35%);
        --colors-successLight: hsl(119, 44%, 94%);
        --colors-success: hsl(119, 74%, 84%);
        --colors-successMid: hsl(124, 100%, 22%);
        --colors-successDark: hsl(126, 100%, 17%);
        --colors-dangerLight: hsl(0, 77%, 95%);
        --colors-danger: hsl(0, 100%, 88%);
        --colors-dangerMid: hsl(0, 96%, 41%);
        --colors-dangerDark: hsl(0, 97%, 34%);
        --colors-warningLight: hsl(39, 100%, 94%);
        --colors-warning: hsl(41, 100%, 55%);
        --colors-warningMid: hsl(41, 89%, 48%);
        --colors-warningDark: hsl(41, 100%, 41%);
        --colors-warningText: hsl(24, 100%, 37%);
        --colors-subjectEnglish: hsl(333, 75%, 59%);
        --colors-subjectMaths: hsl(214, 100%, 58%);
        --colors-subjectScience: hsl(256, 65%, 62%);
        --colors-subjectVerbalReasoning: hsl(148, 84%, 36%);
        --colors-subjectNonVerbalReasoning: hsl(41, 100%, 55%);
        --colors-subjectCreativeWriting: hsl(35, 95%, 50%);
        --colors-subjectExamSkills: hsl(257, 53%, 35%);
        --colors-glBlueLight: hsl(222, 68%, 78%);
        --colors-glBluePrimary: hsl(222, 56%, 55%);
        --colors-glBlueDark: hsl(222, 35%, 43%);
        --colors-primary100: hsl(215, 100%, 98%);
        --colors-primary200: hsl(212, 100%, 95%);
        --colors-primary300: hsl(211, 100%, 92%);
        --colors-primary400: hsl(211, 100%, 88%);
        --colors-primary500: hsl(212, 100%, 80%);
        --colors-primary600: hsl(213, 100%, 71%);
        --colors-primary700: hsl(214, 100%, 58%);
        --colors-primary900: hsl(223, 79%, 44%);
        --colors-primary1000: hsl(228, 82%, 35%);
        --colors-primary1100: hsl(228, 63%, 23%);
        --colors-primary1200: hsl(227, 57%, 11%);
        --colors-questionHeaderBackground: rgba(0, 0, 0, .1);
        --colors-questionContentBackground: rgba(0, 0, 0, .1);
        --colors-questionFooterBackground: rgba(0, 0, 0, .1);
        --colors-questionAnswerText: white;
        --colors-questionAnswerLetterPressedBackground: white;
        --colors-questionAnswerLetterBackground: var(--colors-grey600);
        --colors-questionAnswerLetterText: var(--colors-primary1000);
        --colors-questionButtonFocus: var(--colors-primary900);
        --colors-questionButtonActive: var(--colors-primary1000);
        --colors-questionButtonText: white;
        --colors-questionHelpBackground: var(--colors-primary100);
        --colors-questionMiniProgressBar: var(--colors-primary1000);
        --colors-questionMiniProgressBarBackground: var(--colors-primary100);
        --colors-questionNavigationColorSchemeBase: grey1;
        --colors-questionNavigationColorSchemeAccent: primary1;
        --colors-questionProgressBar: var(--colors-primary800);
        --colors-questionTimerBackground: var(--colors-warningLight);
        --colors-questionTimerText: var(--colors-warningDark);
    }
    .c-hASCbp {
        padding: 0px;
    }
    .t-iYqTS {
        --colors-theme100: var(--colors-green100);
        --colors-theme200: var(--colors-green200);
        --colors-theme300: var(--colors-green300);
        --colors-theme400: var(--colors-green400);
        --colors-theme500: var(--colors-green500);
        --colors-theme600: var(--colors-green600);
        --colors-theme700: var(--colors-green700);
        --colors-theme800: var(--colors-green800);
        --colors-theme900: var(--colors-green900);
    }
    .t-ieLEVH {
        --colors-theme100: var(--colors-green100);
        --colors-theme200: var(--colors-green200);
        --colors-theme300: var(--colors-green300);
        --colors-theme400: var(--colors-green400);
        --colors-theme500: var(--colors-green500);
        --colors-theme600: var(--colors-green600);
        --colors-theme700: var(--colors-green700);
        --colors-theme800: var(--colors-green800);
        --colors-theme900: var(--colors-green900);
    }
    .t-jxWorx {
        --colors-theme100: var(--colors-green100);
        --colors-theme200: var(--colors-green200);
        --colors-theme300: var(--colors-green300);
        --colors-theme400: var(--colors-green400);
        --colors-theme500: var(--colors-green500);
        --colors-theme600: var(--colors-green600);
        --colors-theme700: var(--colors-green700);
        --colors-theme800: var(--colors-green800);
        --colors-theme900: var(--colors-green900);
    }
    .t-bzfCfQ {
        --colors-theme100: var(--colors-green100);
        --colors-theme200: var(--colors-green200);
        --colors-theme300: var(--colors-green300);
        --colors-theme400: var(--colors-green400);
        --colors-theme500: var(--colors-green500);
        --colors-theme600: var(--colors-green600);
        --colors-theme700: var(--colors-green700);
        --colors-theme800: var(--colors-green800);
        --colors-theme900: var(--colors-green900);
    }
    .t-idhVZF {
        --colors-theme100: var(--colors-green100);
        --colors-theme200: var(--colors-green200);
        --colors-theme300: var(--colors-green300);
        --colors-theme400: var(--colors-green400);
        --colors-theme500: var(--colors-green500);
        --colors-theme600: var(--colors-green600);
        --colors-theme700: var(--colors-green700);
        --colors-theme800: var(--colors-green800);
        --colors-theme900: var(--colors-green900);
    }
    .t-bXnsNo {
        --colors-theme100: var(--colors-green100);
        --colors-theme200: var(--colors-green200);
        --colors-theme300: var(--colors-green300);
        --colors-theme400: var(--colors-green400);
        --colors-theme500: var(--colors-green500);
        --colors-theme600: var(--colors-green600);
        --colors-theme700: var(--colors-green700);
        --colors-theme800: var(--colors-green800);
        --colors-theme900: var(--colors-green900);
    }

  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);