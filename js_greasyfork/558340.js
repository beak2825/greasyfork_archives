// ==UserScript==
// @name         OWOP Christmas theme
// @namespace    https://greasyfork.org/en/users/1502179/
// @version      1.0
// @description  'Tis the season to be jolly
// @author       NothingHere7759
// @match        https://ourworldofpixels.com/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuMTGKCBbOAAAAuGVYSWZJSSoACAAAAAUAGgEFAAEAAABKAAAAGwEFAAEAAABSAAAAKAEDAAEAAAADAAAAMQECABEAAABaAAAAaYcEAAEAAABsAAAAAAAAAKOTAADoAwAAo5MAAOgDAABQYWludC5ORVQgNS4xLjExAAADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlgAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAADY5TB4zfSjcAAABM1JREFUeF7t3SGOlWcUgOGZbgGLahOaYFCso2UDGBRiku6gWyAZMQrDBhpsfdUoDAKBGssawH+q9x5yP37e55HHzL1/Zt785py5vmLkjye/fl1nXM77T5+v1xn/3y/rAOgQAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAg7/C717n38t//8tY64oFcv3qyjizr6PQJvABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABC2fZd5us9vH5+dpvcIdt8T8AYAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYeNd5KPv8z/c3a+jkzy7fbeOTvLl4+06uqhHT2/W0Uk+3LxcRyd5/Pr5OkrZfU/AGwCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCEjXaJr36AewDTff6p6T2Aqek9genzm37/3Z9/9z0C9wCAbQQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwq537/NPTf+//dSHm5fr6KJ277Oz1/SegDcACBMACBMACBMACBMACBMACBMACBMACBMACBMACBMACBMACBMACBMACBMACDv8PYCp6T2B6T2A3fv80+8/NX1+U7uf/5R7AMDZBADCBADCBADCBADCBADCBADCBADCBADCBADCBADCBADCBADCBADCBADC8vcAju7h7n4dneTZ7bt1dFG77wFM7b4n4B4AcDYBgDABgDABgDABgDABgDABgDABgDABgDABgDABgDABgDABgDABgDABgLDD3wOY/n/76T76dB98us+/2/SewPT5T00//9SXj7fr6CTuAQBnEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIO/w9gOk+/XQffLrPPf38u02f3/QewPTn7zb9/XEPADibAECYAECYAECYAECYAECYAECYAECYAECYAECYAECYAECYAECYAECYAEDY4e8BHN2jpzfr6FB27/NPf/5uj18/X0cncQ8AOJsAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQNj1OjjV0e8JPNzdr6OTTPe5d98D2L1PX78H8Pe//62jk7z/9Hn0N+wNAMIEAMIEAMIEAMIEAMIEAMIEAMIEAMIEAMIEAMIEAMIEAMIEAMIEAMIEAMJGu8RXP8E9gKOb3jPYbXoPYGp6T2C6zz/lHgBwNgGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAsNEu8ffgnsBeu+8J7L4H8Ofvv62ji5ru8095A4AwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYCwrbvI38P0nsCUewR7vXrxZh1d1O59/ilvABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABB26F3mH8HuewR1R9/H380bAIQJAIQJAIQJAIQJAIQJAIQJAIQJAIQJAIQJAIQJAIQJAIQJAIQJAIQJAIR9A0Mnt3XJU9iAAAAAAElFTkSuQmCC
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558340/OWOP%20Christmas%20theme.user.js
// @updateURL https://update.greasyfork.org/scripts/558340/OWOP%20Christmas%20theme.meta.js
// ==/UserScript==

// Credits: Aha - original design

(() => {
    const waitUntil = (probe, cb, t = 100) => {
        const id = setInterval(() => { try { if (probe()) { clearInterval(id); cb(); } } catch { } }, t);
    };

    // Main style element
    document.getElementsByTagName("style")[0].innerHTML = `:root {
    /* colors */
    --light: #ECD592;
    --light-plus: #F7E3A3;
    --light-minus: #CCB77E;
    --light-sel: #db8;
    --medium: #A22C28;
    --text: #9F8141;
    --text-shadow: #4F2622;
    --unloaded-avg: #D7BD7D;
    --close-btn: #ff7979;
    --link: #82c9ff;
    --link-visited: #ab80f9;
    --link-hover: #76b0dc;
    --msg-none: #999;
    --msg-user: #3ab2ff;
    --msg-mod: #86ff41;
    --msg-admin: #ff4f4f;
    --msg-dc: #6cffe7;
    --msg-server: #ff41e4;
    --msg-tell: #ffb735;

    /* images */
    --btn: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAMAAABhEH5lAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJUExURaIsKE8mIgAAAKEORuAAAAADdFJOU///ANfKDUEAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAWdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjH3g/eTAAAAtGVYSWZJSSoACAAAAAUAGgEFAAEAAABKAAAAGwEFAAEAAABSAAAAKAEDAAEAAAADAAAAMQECAA4AAABaAAAAaYcEAAEAAABoAAAAAAAAAKOTAADoAwAAo5MAAOgDAABQYWludC5ORVQgNS4xAAMAAJAHAAQAAAAwMjMwAaADAAEAAAABAAAABaAEAAEAAACSAAAAAAAAAAIAAQACAAQAAABSOTgAAgAHAAQAAAAwMTAwAAAAABU9XsNJigOlAAAAM0lEQVQoU2NgwA6Y4ABTBCaGLAIRQxUBi6ELMQ5OIUZGdLeCRVDEoCJIYnARBgZGGABxADy2AeLOWZ8iAAAAAElFTkSuQmCC);
    --btn-pressed: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAMAAABhEH5lAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAGUExURaIsKAAAAJAETP4AAAACdFJOU/8A5bcwSgAAAAlwSFlzAAAOwwAADsMBx2+oZAAAABZ0RVh0U29mdHdhcmUAUGFpbnQuTkVUIDUuMfeD95MAAAC0ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIADgAAAFoAAABphwQAAQAAAGgAAAAAAAAAo5MAAOgDAACjkwAA6AMAAFBhaW50Lk5FVCA1LjEAAwAAkAcABAAAADAyMzABoAMAAQAAAAEAAAAFoAQAAQAAAJIAAAAAAAAAAgABAAIABAAAAFI5OAACAAcABAAAADAxMDAAAAAAFT1ew0mKA6UAAAAnSURBVChTY2AgHjDCAaYITAxZBCKGKgIWGyJCmB7C9DYsJBBiIA4AibIA5QmtH2EAAAAASUVORK5CYII=);
    --gui: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGIAAABQCAMAAADVyVCaAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAhUExURU8mIqIsKMGlaHhiMuzVkp+BQSYtNf///8LR4Ns+PgAAAJs0ChkAAAALdFJOU/////////////8ASk8B8gAAAAlwSFlzAAALEwAACxMBAJqcGAAAABZ0RVh0U29mdHdhcmUAUGFpbnQuTkVUIDUuMfeD95MAAAC0ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAIAAAAxAQIADgAAAFoAAABphwQAAQAAAGgAAAAAAAAASRkBAOgDAABJGQEA6AMAAFBhaW50Lk5FVCA1LjEAAwAAkAcABAAAADAyMzABoAMAAQAAAAEAAAAFoAQAAQAAAJIAAAAAAAAAAgABAAIABAAAAFI5OAACAAcABAAAADAxMDAAAAAA+Ac9C512e8wAAAPLSURBVFhHtZhZduMgEEVxK5Hl7H/BfWqeGETsvJ+IQe8aqAKU9vN5NZYUU/P7EoBCFJVYqex+FBYfIFdhaq39Y/E7/GKyQA9f9AOfIgxAEEVAw8SiteM4DtdhiIgEMqWhYINZkIN53EZkApriSLDBPISgJtuI4zgCAurBQkyMQC6wDNTaby8EMmMYvrSyWP2EjGArYhBiORHLiQwdmcCMm4hlOGg9IcR0B7EKaq0eI9aptUhNqYXJGSCyRUHkDaWUudJHhQyp1/P3QgZ4wk+WGPksgmY8Ej6+mTOB8+5PEChNQZo0rc299spePsmhqNXxnccjlHNz68WsyCU5FqmutZBagPAMbHYd+mkhChlICAwDS18sQl6oJbUag1pzOqoqghNGGbwBGQNecTnlt1q19QpJHhHMMANiyNRq2roOwVoUkvxvEJbkVFLEUSeKHVoLR1LtUBTWCR6wwrDVgFrtrdojCn+THwUxrAoV38dm12HsDqoRxdWBACa+uGiOqhHF1b4TeMTyqt2rRtTnVSLqD5QiCossbswz7+X6ThQ2tPZlAoQ99tV4rSdrkeQR3/DjbiDQftihKIzCaejQ6OcvJsoLEN/Zf47AMcyCNgkQdSDfQ4KMYgcBi98ZhqRNCR0oynrck6xFXhMy5uMuvMCzNB5nliIeEWKIBIGOeKxa1UKGgNf6iAC5l3peHuEhEeEv2POjoqOIMEhE0MaJdRBRO4CKEEhA0LFKeycG7Q6hg6ijEACPghMj+kyUEVSS3NMbVFyLzdQLCAZowMjlxEfUW6NggNug5DvTReg7a6GANIqc3b+OqCTZB7dybKABYryZ7+ttxHmeZ66LYkTZzu8izp/z+ZwzGFGOjA3EdS0QfOfRDZSV+w0E5suJ2r1HRS3cUWG579yjcIH5D8pV9eURt+5RsLxPsL6eqAueoSr3U20HLdhd4i8UKA4ZgMjRNEdcVyIgYxJWgKgDsXuUDwUUxGgiEGOMWN+jMqMSaEW8rZfutCqPkH+F0gWBX4HVKBoCLLv1XH1wBTUqwRi9QcAwsrOKEP5rnRhgFwj6fYiDeL3MnZ63EHg4ESIQHOL1MgY//xZho7BPUJioitibKI+Qf67bPQqHcb1euiL0PCYsEV5uvS+35vA8GUQnopBAuRcZPvtg8gmAG8qMYHkRx+BuIIVAm8iF+9/Jj86xyG2DzW5S6ga5SDepcISQsWpKCDut3aXMkBiJgAeE+o+3DlLYzO3Zf0+WfySR/JE01Z3zIg9hU3cQG5+OPTGibOfvuQZJXmTGJxHv3aPu6D+in9gr1/24pwAAAABJRU5ErkJggg==);
    --border-small: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAMAAAAMCGV4AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAPUExURU8mIuzVkp+BQaIsKAAAAJySQ64AAAAFdFJOU/////8A+7YOUwAAAAlwSFlzAAAOwwAADsMBx2+oZAAAABZ0RVh0U29mdHdhcmUAUGFpbnQuTkVUIDUuMfeD95MAAAC0ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAIAAAAxAQIADgAAAFoAAABphwQAAQAAAGgAAAAAAAAAYAAAAAEAAABgAAAAAQAAAFBhaW50Lk5FVCA1LjEAAwAAkAcABAAAADAyMzABoAMAAQAAAAEAAAAFoAQAAQAAAJIAAAAAAAAAAgABAAIABAAAAFI5OAACAAcABAAAADAxMDAAAAAAY6QmxFJO/cwAAABCSURBVBhXrY9JDsAwCMQ8wP/fXDEJitpe4wPICLEA1ECjcGpCDoeAQl11p6j2PSEZ3+PylufScZHG+7/3/e5///cAxe4BsuHhl8oAAAAASUVORK5CYII=);
    --unloaded: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAGUExURezVksGlaJLJ5oEAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAWdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjH3g/eTAAAAtGVYSWZJSSoACAAAAAUAGgEFAAEAAABKAAAAGwEFAAEAAABSAAAAKAEDAAEAAAACAAAAMQECAA4AAABaAAAAaYcEAAEAAABoAAAAAAAAAGAAAAABAAAAYAAAAAEAAABQYWludC5ORVQgNS4xAAMAAJAHAAQAAAAwMjMwAaADAAEAAAABAAAABaAEAAEAAACSAAAAAAAAAAIAAQACAAQAAABSOTgAAgAHAAQAAAAwMTAwAAAAAGOkJsRSTv3MAAAAGUlEQVQY02NgEIRCRgEIhAswQAUYGeioBgAynwRBjdQjAgAAAABJRU5ErkJggg==);
    --win-out: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAASUExURU8mIv///9BsXaIsKK+/0gAAAI8lQLQAAAAGdFJOU///////ALO/pL8AAAAJcEhZcwAADsEAAA7BAbiRa+0AAAAWdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjH3g/eTAAAAtGVYSWZJSSoACAAAAAUAGgEFAAEAAABKAAAAGwEFAAEAAABSAAAAKAEDAAEAAAACAAAAMQECAA4AAABaAAAAaYcEAAEAAABoAAAAAAAAANl2AQDoAwAA2XYBAOgDAABQYWludC5ORVQgNS4xAAMAAJAHAAQAAAAwMjMwAaADAAEAAAABAAAABaAEAAEAAACSAAAAAAAAAAIAAQACAAQAAABSOTgAAgAHAAQAAAAwMTAwAAAAABG5q1ivDjZSAAAAo0lEQVQoU4VSQRLEIAhLAvz/yzugYqdjXU4NKRpMEBEAEI+aGAFQYsJVAyclmlGQRIpcOGdogGWrqI0BCco+zNzNNy7KbXxWPbBTgOhT5MYIWCqylt84hbhZ/tNbTYxA7bSIQQIpPsC+pznToKR90Ys6TDn5j7oceKB66iR+UJeVPx/q8rw3U9o6TyuruaxswzMY0iMAHZvKjGpmxuYWts+I/gDRTgZtM2pY5wAAAABJRU5ErkJggg==);
    --win-in: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAMAAAAMCGV4AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJUExURezVkk8mIgAAANN/gfoAAAADdFJOU///ANfKDUEAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAWdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjH3g/eTAAAAtGVYSWZJSSoACAAAAAUAGgEFAAEAAABKAAAAGwEFAAEAAABSAAAAKAEDAAEAAAADAAAAMQECAA4AAABaAAAAaYcEAAEAAABoAAAAAAAAAKOTAADoAwAAo5MAAOgDAABQYWludC5ORVQgNS4xAAMAAJAHAAQAAAAwMjMwAaADAAEAAAABAAAABaAEAAEAAACSAAAAAAAAAAIAAQACAAQAAABSOTgAAgAHAAQAAAAwMTAwAAAAABU9XsNJigOlAAAAK0lEQVQYV2NgYGBghAEGEGBkZIIDkAgSl4kJjcvENOB8BjQuunsZkFQAOQCxCAGEKksiEwAAAABJRU5ErkJggg==);
    --gui-plus: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJUExURU8mIsGlaAAAAHmSZGkAAAADdFJOU///ANfKDUEAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAWdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjH3g/eTAAAAtGVYSWZJSSoACAAAAAUAGgEFAAEAAABKAAAAGwEFAAEAAABSAAAAKAEDAAEAAAACAAAAMQECAA4AAABaAAAAaYcEAAEAAABoAAAAAAAAAGAAAAABAAAAYAAAAAEAAABQYWludC5ORVQgNS4xAAMAAJAHAAQAAAAwMjMwAaADAAEAAAABAAAABaAEAAEAAACSAAAAAAAAAAIAAQACAAQAAABSOTgAAgAHAAQAAAAwMTAwAAAAAGOkJsRSTv3MAAAALUlEQVQYV2NgAgMGBigNIRkZoQzSuAwgwMgIpphALAQASyBz0RSjG0UyF+4FAGt2AQXunXMIAAAAAElFTkSuQmCC);
    --gui-load: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJUExURU8mIsGlaAAAAHmSZGkAAAADdFJOU///ANfKDUEAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAIAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAYAAAAAEAAABgAAAAAQAAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABMz8BIJY/XoAAAADpJREFUGFeVjEkKACAMA9P8/9GSRQQ9OYe0QxfQAK3JmTa/Ckj9DR4F9VmtEVq1q7JnV5jq4VG/2nABaUsAzzGLRbEAAAAASUVORK5CYII=);
    --gui-save: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJUExURU8mIsGlaAAAAHmSZGkAAAADdFJOU///ANfKDUEAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAIAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAYAAAAAEAAABgAAAAAQAAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABMz8BIJY/XoAAAADtJREFUGFdtj1EOADAEQ6v3P/RSDIvx46VFCuIWSQJW/aJ4okE4ChvrtI++FVpiKIVLbVuo+vAxdwSlODWEAHd3CzBmAAAAAElFTkSuQmCC);
}

/*! Generated by Font Squirrel (https://www.fontsquirrel.com) on September 7, 2017 */
/* Source: http://www.dafont.com/pixel-operator.font */
@font-face {
    font-family: pixel-op;
    src: url(/font/pixeloperator..woff2) format('woff2'),
        url(/font/pixeloperator..woff) format('woff');
    font-weight: normal;
    font-style: normal;
}

::-webkit-scrollbar {
    width: 16px;
    height: 16px;
}

::-webkit-scrollbar-corner {
    background-color: rgba(0, 0, 0, 0);
}

/*::-webkit-scrollbar-track {
	height: 16px;
	width: 16px;
	border: 6px solid;
	border-image: url(img/button_pressed.png) 6 repeat;
	background-color: #4d313b;
	border-width: 6px;
	background-origin: border-box;
	background-repeat: no-repeat;
}*/
::-webkit-scrollbar-button {
    height: 16px;
    width: 16px;
    border: 6px solid;
    border-image: var(--btn) 6 repeat;
    background-image: var(--gui);
    background-color: var(--light);
    border-width: 6px;
    background-origin: border-box;
    background-repeat: no-repeat;
}

::-webkit-scrollbar-button:hover {
    background-color: var(--light-plus);
}

::-webkit-scrollbar-button:active {
    background-color: var(--light-minus);
    border-image: var(--btn-pressed) 6 repeat;
}

::-webkit-scrollbar-button:disabled {
    background-color: var(--light-minus);
    border-image: var(--btn-pressed) 6 repeat;
}

::-webkit-scrollbar-button:vertical:increment {
    background-position: -32px 0px;
}

::-webkit-scrollbar-button:vertical:increment:disabled {
    background-position: -48px 0px;
}

::-webkit-scrollbar-button:vertical:decrement {
    background-position: 0px 0px;
}

::-webkit-scrollbar-button:vertical:decrement:disabled {
    background-position: -16px 0px;
}

::-webkit-scrollbar-button:horizontal:increment {
    background-position: 0px 16px;
}

::-webkit-scrollbar-button:horizontal:increment:disabled {
    background-position: -16px 16px;
}

::-webkit-scrollbar-button:horizontal:decrement {
    background-position: -32px 16px;
}

::-webkit-scrollbar-button:horizontal:decrement:disabled {
    background-position: -48px 16px;
}

::-webkit-scrollbar-thumb {
    border: 6px solid;
    border-image: var(--btn) 6 repeat;
    background-color: var(--light);
    border-width: 6px;
}

::-webkit-scrollbar-thumb:hover {
    background-color: var(--light-plus);
}

::-webkit-scrollbar-thumb:active {
    background-color: var(--light-minus);
    border-image: var(--btn-pressed) 6 repeat;
}

.context-menu {
    position: absolute;
    border: 5px var(--light) solid;
    -o-border-image: var(--border-small) 5 repeat;
    border-image: var(--border-small) 5 repeat;
    border-image-outset: 1px;
    background-color: var(--medium);
    box-shadow: 0px 0px 5px #000;
}

/*.context-menu>button {}*/

html,
body {
    font: 16px pixel-op, sans-serif;
    width: 100%;
    height: 100%;
    margin: 0;
    touch-action: none;
    position: fixed;
}

body {
    background-color: var(--unloaded-avg);
    background-image: var(--unloaded);
    background-size: 16px;
}

html {
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
}

hr {
    border-color: rgba(0, 0, 0, 0.2);
}

.hide {
    display: none !important;
}

.selectable {
    -webkit-user-select: text;
    -moz-user-select: text;
    user-select: text;
}

.centered {
    position: absolute;
    padding-top: 1px;
    /* fix captcha window not being pixel perfect */
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.centeredChilds {
    display: flex;
    justify-content: center;
    align-items: center;
}

/* css for improved tooltips */
#tooltip {
    position: absolute;
    z-index: 100;
    border: 5px var(--medium) solid;
    -o-border-image: var(--border-small) 5 repeat;
    border-image: var(--border-small) 5 repeat;
    border-image-outset: 1px;
    /* background-color: #5c0c91; */
    box-shadow: 0px 0px 5px #000;
    background-color: var(--medium);
    color: #fff;
    text-shadow: -1px 0 #000, 0 1px #000, 1px 0 #000, 0 -1px #000;
    pointer-events: none;
}

/* .tooltip {
	pointer-events: none;
	position: absolute;
	top: 0;
	left: 0;
	opacity: 0.9;
} */

.owopdropdown {
    pointer-events: none !important;
    padding: 0 !important;
    padding-top: 1px !important;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    border: none !important;
    background-color: rgba(0, 0, 0, 0) !important;
    transition: transform 0.5s ease-out;
}

button.winframe:active {
    -o-border-image: inherit;
    border-image: inherit;
}

.whitetext,
#xy-display,
#chat,
#dev-chat,
#playercount-display,
#topright-displays,
#topleft-displays>*,
.generic-display {
    color: #FFF;
    font: 16px pixel-op, sans-serif;
    text-shadow: -1px 0 #000, 0 1px #000, 1px 0 #000, 0 -1px #000;
}

img,
#tool-select {
    image-rendering: pixelated;
}

#load-scr {
    position: absolute;
    height: 100%;
    width: 100%;
    text-align: center;
    font: 0/0 a;
    pointer-events: none;
    transition: transform 1.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);
    background-image: var(--unloaded);
    box-shadow: 0 0 5px #000;
}

#load-scr:before {
    content: ' ';
    display: inline-block;
    vertical-align: middle;
    height: 100%;
}

#load-ul {
    display: inline-block;
    vertical-align: middle;
    list-style-type: none;
    padding: 0;
    margin: 0;
    max-height: 100vh;
    max-width: 60%;
    min-width: 224px;
    pointer-events: initial;
    transition: transform 1s;
}

.uk-notice.framed {
    max-height: 70vh;
    overflow-y: auto;
}

#noscript-msg,
#status {
    font: 16px pixel-op;
}

#status-msg {
    vertical-align: super;
    text-shadow: -1px 0 #000, 0 1px #000, 1px 0 #000, 0 -1px #000, 0 0 2px #000;
}

#spinner {
    margin-right: 8px;
}

#viewport,
#windows,
#animations {
    position: absolute;
}

#windows {
    pointer-events: none;
    width: 100%;
    height: 100%;
    z-index: 6;
}

#windows>div,
.winframe {
    /* Frame */
    position: absolute;
    pointer-events: initial;
    background-color: var(--light);
    border: 11px var(--light) solid;
    border-width: 11px;
    -o-border-image: var(--win-out) 11 repeat;
    border-image: var(--win-out) 11 repeat;
    border-image-outset: 1px;
    box-shadow: 0px 0px 5px #000;
}

#windows>div>span {
    /* Title */
    display: block;
    pointer-events: none;
    margin-top: -7px;
    text-shadow: 1px 1px var(--text-shadow);
    color: var(--text);
    margin-bottom: 3px;
    min-width: 100%;
    text-align: center;
}

.windowCloseButton {
    /* Close button */
    position: absolute;
    right: 0;
    top: -2px;
    width: 9px;
    height: 9px;
    padding: 0;
    background-image: var(--gui);
    background-position: -48px -32px;
    background-color: var(--close-btn);
    border: none;
}

button.windowCloseButton:active {
    background-image: var(--gui);
    background-position: -48px -41px;
}

.wincontainer {
    /* Item container of windows */
    overflow: auto;
    min-width: 100%;
    /* width: 0;  Older browsers fix */
    height: 100%;
    margin: 0 -5px -5px -5px;
    background-color: var(--medium);
    border: 5px var(--medium) solid;
    border-width: 5px;
    -o-border-image: var(--win-in) 5 repeat;
    border-image: var(--win-in) 5 repeat;
}

#windows>div>div input {
    border: 6px var(--medium) solid;
    -o-border-image: var(--border-small) 6 repeat;
    border-image: var(--border-small) 6 repeat;
    border-image-outset: 1px;
}

#windows>div>div input:focus {
    outline: none;
}

#windows>div>div>* {
    box-sizing: border-box;
}

button {
    border: 6px var(--light) outset;
    -o-border-image: var(--btn) 6 repeat;
    border-image: var(--btn) 6 repeat;
    background-color: var(--light);
    transition: filter 0.125s;
}

button:hover {
    filter: brightness(110%);
    transition: filter 0.125s;
}

button:active {
    border-style: inset;
    -o-border-image: var(--btn-pressed) 6 repeat;
    border-image: var(--btn-pressed) 6 repeat;
    filter: brightness(90%);
    transition: none;
}

button:focus {
    outline: none;
}

#clusters>canvas {
    position: absolute;
    background-image: var(--unloaded);
    background-size: 8px;
}

#animations {
    top: 0;
    left: 0;
}

#palette {
    position: absolute;
}

#xy-display,
.generic-display {
    padding-left: 2px;
}

#playercount-display {
    padding-right: 2px;
}

#palette,
#topright-displays>*,
#topleft-displays>* {
    pointer-events: none;
    transform: translateY(-100%);
    transition: transform 0.75s;
}

#topleft-displays>*,
#topright-displays>* {
    pointer-events: none;
    transition: transform 0.75s;
}

#notice-display {
    pointer-events: all;
    cursor: pointer;
    z-index: 5;
}

#notice-display>* {
    pointer-events: none;
}

#topright-displays,
#topleft-displays {
    position: absolute;
    pointer-events: none;
}

/* #xy-display, #palette {
	position: absolute;
}
#xy-display, #playercount-display, #palette, #topright-displays > * {
	pointer-events: none;
	transform: translateY(-100%);
	transition: transform 0.75s;
}
#topright-displays {
	position: absolute;
	pointer-events: none;
}
#xy-display {
	padding-left: 2px;
	left: -4px;
	top: -4px;
} */

#topright-displays {
    right: -4px;
    top: -4px;
}

#topleft-displays {
    left: -4px;
    top: -4px;
}

#topright-displays>*,
#topleft-displays>* {
    display: inline-block;
    min-height: 8px;
}

#topright-displays:not(.hideui) #dinfo-display[data-pm]:not([data-pm="1"]) {
    transform: initial;
}

#dinfo-display {
    position: relative;
}

#dinfo-display::before {
    content: '' attr(data-pm) 'x boost for ' attr(data-tmo) '!';
    border-right: 1px dashed #00000077;
    margin-right: 1px;
}

#dinfo-hlp {
    pointer-events: all;
    background-color: #00000044;
    border-radius: 100%;
    padding: 0 4px;
    cursor: help;
}

#dinfo-hlp-box {
    display: none;
    position: absolute;
    top: 150%;
    left: -5px;
    width: 150%;
    box-sizing: border-box;
    z-index: 100;
}

#dinfo-hlp:hover~#dinfo-hlp-box {
    display: block;
}

#toole-container {
    overflow: hidden;
}

#playercount-display,
#xy-display,
#palette,
.framed,
#pbucket-display,
#rank-display,
.generic-display {
    border: 5px var(--light) solid;
    -o-border-image: var(--border-small) 5 repeat;
    border-image: var(--border-small) 5 repeat;
    border-image-outset: 1px;
    background-color: var(--medium);
    box-shadow: 0px 0px 5px #000;
}

.generic-display:active {
    border: 5px var(--light) solid;
    -o-border-image: var(--border-small) 5 repeat;
    border-image: var(--border-small) 5 repeat;
    border-image-outset: 1px;
    background-color: var(--medium);
    box-shadow: 0px 0px 5px #000;
    filter: brightness(90%);
}

#toole-container>button>div {
    /* ugly */
    position: fixed;
    margin: -18px -4px;
    width: 36px;
    height: 36px;
}

#toole-container>button {
    position: relative;
    display: inline-block;
    width: 40px;
    height: 40px;
    padding: 0;
}

#toole-container>button.selected {
    background-color: var(--light-sel);
}

#tool-select>button>div {
    position: absolute;
    width: 36px;
    height: 36px;
    margin-left: 50%;
    transform: translate(-50%, -50%);
}

#palette {
    right: -5px;
    top: 50%;
    transform: translateY(-50%) translateX(200%);
    width: 45px;
    height: 40px;
    box-sizing: border-box;
}

#palette-bg {
    position: absolute;
    height: 100%;
    width: 44px;
    top: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.3);
    transition: transform 0.75s;
    pointer-events: none;
}

#palette-opts {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    position: absolute;
    right: 50px;
    box-sizing: border-box;
    pointer-events: all;
}

#palette-create {
    background-image: var(--gui-plus);
    background-repeat: no-repeat;
    box-sizing: border-box;
    width: 24px;
    min-height: 24px;
    margin-bottom: 4px;
    cursor: pointer;
}

#palette-load {
    background-image: var(--gui-load);
    background-repeat: no-repeat;
    box-sizing: border-box;
    width: 24px;
    min-height: 24px;
    cursor: pointer;
}

#palette-save {
    background-image: var(--gui-save);
    background-repeat: no-repeat;
    box-sizing: border-box;
    width: 24px;
    min-height: 24px;
    margin-top: 4px;
    cursor: pointer;
}

#picker-anchor {
    position: absolute;
    right: 50px;
    top: -30px;
}

#color-picker {
    position: absolute;
    left: -100%;
}

#palette-colors {
    position: absolute;
    left: -1px;
    top: -9px;
    transition: transform 0.2s ease-out;
}

#palette-colors>div {
    width: 32px;
    height: 32px;
    margin: 8px 0;
    border: 1px solid rgba(0, 0, 0, 0.3);
    box-sizing: border-box;
    pointer-events: all;
    cursor: pointer;
}

#player-list {
    max-height: 300px;
    overflow-y: scroll;
}

#player-list>table {
    border-collapse: collapse;
    border: 1px solid #000;
    color: #fff;
    text-shadow: -1px 0 #000, 0 1px #000, 1px 0 #000, 0 -1px #000;
    padding: 2px;
}

#player-list>table>tr:nth-child(odd) {
    background-color: rgba(0, 0, 0, 0.1);
}

#player-list>table>tr:nth-child(even) {
    background-color: rgba(0, 0, 0, 0.3);
}

#player-list>table>tr:first-child {
    text-align: left;
    background-color: rgba(0, 0, 0, 0.5);
}

#player-list td,
#player-list th {
    padding: 2px 6px;
}

#player-list>table>tr>td:nth-child(1) {
    border-right: 1px solid rgba(0, 0, 0, 0.5);
}

#player-list>table>tr>td:nth-child(2) {
    border-right: 1px solid rgba(0, 0, 0, 0.3);
}

#help-button {
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 0;
    margin: 16px;
    transition: transform 0.75s;
}

#help-button>img {
    width: 64px;
    display: block;
}

#help {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    max-width: 800px;

    background-color: var(--light);
    border: 11px var(--light) solid;
    border-width: 11px;
    -o-border-image: var(--win-out) 11 repeat;
    border-image: var(--win-out) 11 repeat;
    border-image-outset: 1px;
    box-shadow: 0px 0px 5px #000;
    max-height: 96%;
    display: flex;
    flex-direction: column;
}



#help>.title {
    display: block;
    pointer-events: none;
    margin-top: -7px;
    text-shadow: 1px 1px var(--text-shadow);
    color: var(--text);
    margin-bottom: 3px;
    min-width: 100%;
    text-align: center;
}

#help>.content {
    overflow: auto;
    flex-grow: 1;
    max-height: 100%;
    min-width: 100%;
    /* width: 0;  Older browsers fix */
    height: 100%;
    margin: 0 -5px -5px -5px;
    background-color: var(--medium);
    border: 5px var(--medium) solid;
    border-width: 5px;
    -o-border-image: var(--win-in) 5 repeat;
    border-image: var(--win-in) 5 repeat;
}

#help>.content>.links {
    text-align: center;
}

#help>.content>.links>* {
    display: inline-block;
    vertical-align: middle;
    width: 76px;
}

#help>.content>.links>* img {
    width: 100%;
}

#help.hidden {
    display: none;
}

#chat {
    transform: translateY(100%);
}

#chat,
#dev-chat {
    position: absolute;
    right: 0;
    bottom: 0;
    min-width: 20%;
    max-width: 450px;
    /* max-height: 40%; // causes problems on old browsers */
    display: flex;
    font-family: pixel-op, monospace;
    flex-direction: column;
    background-color: transparent;
    pointer-events: none;
    overflow: hidden;
    transition: background-color 0.2s, box-shadow 0.2s, transform 0.75s;
    animation-fill-mode: forwards;
}

#dev-chat {
    left: 0;
    right: initial;
}

#chat.active,
#dev-chat.active {
    background-color: rgba(0, 0, 0, 0.8);
    box-shadow: 0px 0px 5px #000;
    pointer-events: all;
    overflow-y: auto;
}

@keyframes fade {
    from {
        opacity: 1;
    }

    to {
        opacity: 0;
    }
}

#chat-messages>li {
    background-color: rgba(0, 0, 0, 0.8);
    animation-name: fade;
    animation-duration: 3s;
    animation-delay: 15s;
    animation-fill-mode: forwards;
    transition: background-color 0.2s;
    white-space: pre-wrap;
}

#chat-messages>li a:link {
    color: var(--link);
}

#chat-messages>li a:visited {
    color: var(--link-visited);
}

#chat-messages>li a:hover {
    color: var(--link-hover);
}

#chat-messages>li.playerMessage {
    color: var(--msg-none);
}

#chat-messages>li.userMessage>.nick {
    color: var(--msg-user);
}

#chat-messages>li.modMessage {
    color: var(--msg-mod);
}

#chat-messages>li.adminMessage,
#chat-messages>li.serverError,
#chat-messages>li.serverRaw {
    color: var(--msg-admin);
}

#chat-messages>li.discord>.nick {
    color: var(--msg-dc);
}

#chat-messages>li.serverInfo {
    color: var(--msg-server);
}

#chat-messages>li.whisper,
#chat-messages>li>.whisper {
    color: var(--msg-tell);
}

#chat-messages .emote {
    max-width: 1.375em;
    max-height: 1.375em;
    vertical-align: bottom;
    image-rendering: auto;
}

#chat-messages.active>li {
    background-color: initial;
    animation-duration: 0s;
    animation-direction: reverse;
}

#chat-messages,
#dev-chat-messages {
    flex: 1;
    margin: 0;
    padding: 0;
    font-size: 16px;
    max-height: 40vh;
    word-wrap: break-word;
    overflow: inherit;
    vertical-align: bottom;
}

#chat-input {
    flex: 0 1 auto;
    height: 16px;
    color: #FFF;
    pointer-events: all;
    border: 1px solid #666;
    padding: 4px;
    background: rgba(0, 0, 0, 0.8);
    font-family: pixel-op, sans-serif;
    font-size: 16px;
    resize: none;
    overflow-y: scroll;
    display: none;
}

#chat-input:focus {
    outline: none;
}

#chat-input::-moz-placeholder {
    color: #BBB;
}

#chat-input::placeholder {
    color: #BBB;
}

#captchawdow {
    margin: -4px;
}

.rainbow-container {
    position: relative;
    display: inline-block;
}

.rainbow {
    background: linear-gradient(to right, #db2a2a, #d16d15, #d4b413, #18fa14, #192abf, #760dd9, #db2a2a);
    -webkit-background-clip: text;
    background-clip: text;
    background-repeat: repeat-x;
    color: transparent;
    animation: rainbow_animation 6s linear infinite;
    background-size: 400% 100%;
    text-shadow: none;
    position: relative;
    z-index: 1;
}

@keyframes rainbow_animation {
    0% {
        background-position: 0 0;
    }

    100% {
        background-position: 132% 0;
    }
}

.rainbow-back {
    text-shadow: -1px 0 #000, 0 1px #000, 1px 0 #000, 0 -1px #000;
    color: #000;
    position: absolute;
    left: 0;
    z-index: 0;
}

#keybind-settings {
    display: flex;
    flex-direction: row;
}

#keybinddiv {
    flex-grow: 1;
}

#keybindopts {
    text-align: right;
}

.color-picker-frame {
    border: 5px var(--medium) solid;
    -o-border-image: var(--border-small) 5 repeat;
    border-image: var(--border-small) 5 repeat;
    border-image-outset: 1px;
    box-shadow: 0px 0px 5px #000;
    padding: 5px;
    position: absolute;
    background-color: var(--medium);
    display: flex;
    align-items: stretch;
}

.color-picker-container {
    position: relative;
    width: 200px;
    height: 200px;
    display: flex;
    flex-direction: row;
    align-items: stretch;
    gap: 5px;
}

.color-picker-canvas {
    width: 100%;
    height: 100%;
}

.color-picker-slider {
    width: 10px;
    height: 100%;
    border-radius: 24px;
    flex-shrink: 0;
}

.draggableHandle {
    width: 6px;
    height: 6px;
    border: 2px solid #333;
    border-radius: 50%;
    position: absolute;
    cursor: grab;
    z-index: 5;
}

.picker-dragging {
    cursor: grabbing;
}

.palette-load {
    display: flex;
    flex-direction: column;
    align-items: stretch;
}

.palette-load-top {
    flex: 1;
}

.palette-load-bottom {
    display: flex;
    flex-direction: column;
}

.palette-load-palette-container {
    display: flex;
    flex-direction: column;
    max-width: 400px;
    overflow-y: scroll;
    align-items: stretch;
}

.palette-button-row {
    display: flex;
    flex-direction: row;
    gap: 2px;
}

.palette-load-selection-container {
    display: flex;
    flex-direction: column;
}

/*.palette-load-preview {}*/

.palette-load-button-contianer {
    display: flex;
    flex-direction: row;
}`;
    // Link images (Wiki, Discord, Reddit, Facebook)
    const linkImgs = document.querySelectorAll(".links img");
    linkImgs[0].src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAlCAMAAAAZd2syAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAqUExURfq4KgAAAOzVkvjw2J+BQZmXkU8mIv/Jk////6+/0v+AAM5nAKhUAAAAAPxx3hMAAAAOdFJOU/////////////////8ARcDcyAAAAAlwSFlzAAAOwwAADsMBx2+oZAAAABh0RVh0U29mdHdhcmUAUGFpbnQuTkVUIDUuMS45bG7aPgAAALZlWElmSUkqAAgAAAAFABoBBQABAAAASgAAABsBBQABAAAAUgAAACgBAwABAAAAAgAAADEBAgAQAAAAWgAAAGmHBAABAAAAagAAAAAAAABgAAAAAQAAAGAAAAABAAAAUGFpbnQuTkVUIDUuMS45AAMAAJAHAAQAAAAwMjMwAaADAAEAAAABAAAABaAEAAEAAACUAAAAAAAAAAIAAQACAAQAAABSOTgAAgAHAAQAAAAwMTAwAAAAAEzPwEglj9egAAABFUlEQVQ4T43UWRaDIAwFUF6QyiD7325PBpC2YMlPirlGtICr1Tnn6jK06qoDAB7MQ6rVORAR8WAeUmUuP/wiPtlB5H3wnjhbkuExspdcJi54HyzJkEvM+BW0FxEXOFtSd8grVGmnl4lCkGxJHTVmN0+C+zY2oPZ1PqAxewKDE0SIiIMM4Z7bwFglxHhf/mbIGYgxATGl1Bv+soIUBQEygRlTZeY81wxoJue8YDIzNcgcT0yAuDJnMjeuQ7s9MnEMu1owfhNkLBlBmcY/pm79UMLV5oZcrgd2tS9SrjVr7Uop/PgvNqw3mTuT+96+3sYl3rdwV331bu6FzZ21s0+l2f9dr99j7wzZPZHs756Esc3Tcu/sfQOBQxL+CbmhowAAAABJRU5ErkJggg==";
    linkImgs[1].src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAlCAMAAAAZd2syAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAnUExURf///wAAAOzVkvjw2J+BQZmXkU8mIg0cNRp+tjuy1xpNag1OgQAAADhgwsEAAAANdFJOU////////////////wA96CKGAAAACXBIWXMAAAsRAAALEQF/ZF+RAAAAGHRFWHRTb2Z0d2FyZQBQYWludC5ORVQgNS4xLjlsbto+AAAAtmVYSWZJSSoACAAAAAUAGgEFAAEAAABKAAAAGwEFAAEAAABSAAAAKAEDAAEAAAACAAAAMQECABAAAABaAAAAaYcEAAEAAABqAAAAAAAAAC8ZAQDoAwAALxkBAOgDAABQYWludC5ORVQgNS4xLjkAAwAAkAcABAAAADAyMzABoAMAAQAAAAEAAAAFoAQAAQAAAJQAAAAAAAAAAgABAAIABAAAAFI5OAACAAcABAAAADAxMDAAAAAAI92S+okw2kgAAAEzSURBVDhPjZRZFsMgCEUVYxVx/+vtYVA0SU/lhxpuH+BA6D2EEPpP02joIcYYefFuEu0hRAAAXrybRBmXH+mH7dgFkFJOCdibk+W1Yh/5DBxIKZuTJYcY4xZUC4AD7M0pd0kLXeT0M0DORSzbUvIPzP4MUEqpiIi1lDK4NDCHhFGrDhpmGQoi8oZO0rjstU2qteaKys3aVi1VM6fcDfODxNaEe2BcvWPKch937EG5nGMm1jjZioncgs2yOW70aGLDLLC4kXVLumczf09KGthqC4i0Y1BQAWxLG49OWY7DelIGNhXbT6FyWM9yiOnu7hj5LRKx1qqKbRhzE+QC66AGNu4bUV2MjJr3zW8vDZKIHrd3ewsk9vYWDl/WyTsVsf+vXvfjbIacTqT7VHMz7HBans3eLztOFa0iswc8AAAAAElFTkSuQmCC";
    linkImgs[2].src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAlCAMAAAAZd2syAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAhUExURf///wAAAOzVkvjw2J+BQZmXkU8mIiYtNcLR4Ns+PgAAAO9AWl4AAAALdFJOU/////////////8ASk8B8gAAAAlwSFlzAAALEQAACxEBf2RfkQAAABh0RVh0U29mdHdhcmUAUGFpbnQuTkVUIDUuMS45bG7aPgAAALZlWElmSUkqAAgAAAAFABoBBQABAAAASgAAABsBBQABAAAAUgAAACgBAwABAAAAAgAAADEBAgAQAAAAWgAAAGmHBAABAAAAagAAAAAAAAAvGQEA6AMAAC8ZAQDoAwAAUGFpbnQuTkVUIDUuMS45AAMAAJAHAAQAAAAwMjMwAaADAAEAAAABAAAABaAEAAEAAACUAAAAAAAAAAIAAQACAAQAAABSOTgAAgAHAAQAAAAwMTAwAAAAACPdkvqJMNpIAAABMUlEQVQ4T42UWxLDIAhFCcaC7n/BnQtofHUafgA5QYgi1UpEVH+KR6nSdV0XnLNYtBJdzMxwzmJR4GakHzJjN3NKOSWGDmXuPWIfW2YEUsqhzEUIGFrwXMwIQOckImIu820tVEvnFHPOpiULUeO4YZ5jEGFRlUjfsBViANgUklMKzDdasC45P7Xhawuidq+/L/XasERECKsfkcLG0oxhSRvTSLjgBkx1oYzzdidspZybMe5VzZw1MXW6MpC900MypFsxrJbyEG6fsFIeLuwN0xO2bYp0Wkqv0O2tBUunQx+wPdmE4Q+jGIfs8IKaMTswtTOXMCOw3DcPdgmq37d+e1saTxpUv73jLIzXcpmFfbJCzZN1mNPutjm1ZP+n3v/Huzfk7Yu0vmqPBPbytXz39n4B8yIQ+aQB5egAAAAASUVORK5CYII=";
    linkImgs[3].src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAlCAMAAAAZd2syAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAkUExURf///wAAAOzVkvjw2J+BQZmXkU8mIiYtNXhVp5lp28up+QAAAIkF1xsAAAAMdFJOU///////////////ABLfzs4AAAAJcEhZcwAACxEAAAsRAX9kX5EAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAIAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAALxkBAOgDAAAvGQEA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAAAj3ZL6iTDaSAAAAOVJREFUOE+tlNkWhSAIRRHyRvr//3sXg1k2yEPnBZGdQwJQKwBAfZRFoUJKKYlzL41WgISIKM69NCq4DuhBZ2xBJMpEKNaNussR++k0SoAou1FXQoLJFWwtRAmIdWPcoleoupxNI+as1o1x2DD/+EaybsMatA5qoGO+w8rbSexc7mdT7Extm2H9bANWSilzrMhTTjGl5pgzn2BF9rQbvGGejDMssKm9wo75K1wxFtAx5heMmQHABp9gtuEU6xqwlm8X6fSeb8HsDdZCsLIidaqLzave/kesh0Q70tjVuhwLdstY7/0Dkj4VvFUCyw4AAAAASUVORK5CYII=";
    // Favicon
    document.querySelector('link').href = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuMTGKCBbOAAAAuGVYSWZJSSoACAAAAAUAGgEFAAEAAABKAAAAGwEFAAEAAABSAAAAKAEDAAEAAAADAAAAMQECABEAAABaAAAAaYcEAAEAAABsAAAAAAAAAKOTAADoAwAAo5MAAOgDAABQYWludC5ORVQgNS4xLjExAAADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlgAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAADY5TB4zfSjcAAABM1JREFUeF7t3SGOlWcUgOGZbgGLahOaYFCso2UDGBRiku6gWyAZMQrDBhpsfdUoDAKBGssawH+q9x5yP37e55HHzL1/Zt785py5vmLkjye/fl1nXM77T5+v1xn/3y/rAOgQAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAg7/C717n38t//8tY64oFcv3qyjizr6PQJvABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABC2fZd5us9vH5+dpvcIdt8T8AYAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYeNd5KPv8z/c3a+jkzy7fbeOTvLl4+06uqhHT2/W0Uk+3LxcRyd5/Pr5OkrZfU/AGwCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCEjXaJr36AewDTff6p6T2Aqek9genzm37/3Z9/9z0C9wCAbQQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwq537/NPTf+//dSHm5fr6KJ277Oz1/SegDcACBMACBMACBMACBMACBMACBMACBMACBMACBMACBMACBMACBMACBMACBMACDv8PYCp6T2B6T2A3fv80+8/NX1+U7uf/5R7AMDZBADCBADCBADCBADCBADCBADCBADCBADCBADCBADCBADCBADCBADCBADC8vcAju7h7n4dneTZ7bt1dFG77wFM7b4n4B4AcDYBgDABgDABgDABgDABgDABgDABgDABgDABgDABgDABgDABgDABgDABgLDD3wOY/n/76T76dB98us+/2/SewPT5T00//9SXj7fr6CTuAQBnEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIO/w9gOk+/XQffLrPPf38u02f3/QewPTn7zb9/XEPADibAECYAECYAECYAECYAECYAECYAECYAECYAECYAECYAECYAECYAECYAEDY4e8BHN2jpzfr6FB27/NPf/5uj18/X0cncQ8AOJsAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQNj1OjjV0e8JPNzdr6OTTPe5d98D2L1PX78H8Pe//62jk7z/9Hn0N+wNAMIEAMIEAMIEAMIEAMIEAMIEAMIEAMIEAMIEAMIEAMIEAMIEAMIEAMIEAMJGu8RXP8E9gKOb3jPYbXoPYGp6T2C6zz/lHgBwNgGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAsNEu8ffgnsBeu+8J7L4H8Ofvv62ji5ru8095A4AwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYCwrbvI38P0nsCUewR7vXrxZh1d1O59/ilvABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABB26F3mH8HuewR1R9/H380bAIQJAIQJAIQJAIQJAIQJAIQJAIQJAIQJAIQJAIQJAIQJAIQJAIQJAIQJAIR9A0Mnt3XJU9iAAAAAAElFTkSuQmCC";
    // Help button image
    document.querySelector('#help-button img').src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAMUExURU8mIsGlaHhiMgAAAPl27qQAAAAEdFJOU////wBAKqn0AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAFnRFWHRTb2Z0d2FyZQBQYWludC5ORVQgNS4x94P3kwAAALRlWElmSUkqAAgAAAAFABoBBQABAAAASgAAABsBBQABAAAAUgAAACgBAwABAAAAAgAAADEBAgAOAAAAWgAAAGmHBAABAAAAaAAAAAAAAABgAAAAAQAAAGAAAAABAAAAUGFpbnQuTkVUIDUuMQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAkgAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABjpCbEUk79zAAAAJ9JREFUOE+dkVEOwCAIQxne/86Lo2iLJMvGj9C+GKk2qAwl2mkrslszu1BMrG7bgVRAfSJwVn8TBXD3FoDvTwEFwYC7zxWDaAD4IFogNFz3FfBXYBYBOewc4M9HxkYKxFc2Pn/W4yOlBgCVgaavAAe6tANQvwXI/g5QoKlRr4GmRj0FShIPK1BWdLL6hArEFiLxMLCFSDwMbCESD7+2uAHKhAhYbO481AAAAABJRU5ErkJggg==";
    // Loading screen logo and spinner
    document.querySelector('#logo').src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHAAAABfCAYAAAAwGkOoAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAWdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjH3g/eTAAAAtGVYSWZJSSoACAAAAAUAGgEFAAEAAABKAAAAGwEFAAEAAABSAAAAKAEDAAEAAAADAAAAMQECAA4AAABaAAAAaYcEAAEAAABoAAAAAAAAAKOTAADoAwAAo5MAAOgDAABQYWludC5ORVQgNS4xAAMAAJAHAAQAAAAwMjMwAaADAAEAAAABAAAABaAEAAEAAACSAAAAAAAAAAIAAQACAAQAAABSOTgAAgAHAAQAAAAwMTAwAAAAABU9XsNJigOlAAATwklEQVR4Xu2dfYgeVxXGz922ZlMqeXlFsNpIowbR2pVCE6om2SUB3VKkERRLqRZLFaFEqLZqaU1psCi1xb+ECFJQSogINhBKl8KGfNRUElHcVEWjiTa1rYjL1sZm2zS5/rHzTJ955tw7M+++2ybiA5eZe+beO++c35z7MTObBHtzFdTwf1lUQ05L6cClbPt8UegKpFDrOsN28rDbOx806DU3QWo6braIk6uG1c75oNy15o5BHhjPZhl7qTYnzGmx9c9ltbk2lGlTVhUFUApWym424ImhxdTtosWeJ+eALm1zWa3nHWMbfoMHrA1Iz2bm/JA2GqROGy1Vu12kv0HzagtOnrcshcSJbVoW8mzuiXLqWt4GrGNOPc3n5F5sQql2PTsD463avboK6GwC5Fkqo6rZvBOl1FS26XhKWk/zKVsb1S5Y5LXrAeC8AhuRfZTxpOCwrzBbQ0ydiJUr0+WY5j2po9Q2iDwnmNOunlvzbEce8LDV4ywF5CUPpvf7S5t3IlbquNr5Aj2l7Jaoq/u5+jnxxfN+7px8PrUhP2JmIcb4zyKfVQjhcgF01szO0Jb3GWJjJOYc4x3TC9Y8S52gUnvOcWxrqxQ8S/xunCuVL7vHGOMLxb6tWr0Ku66OHz1e7ocQVgu012SL1BpiyimeXS+syabHWV5e2/Js2E9JoXkXzdJ2eQzj/TLFGJ+xFuBUABlC+FABDOm05DtB9JyRs1UuRhygAzgfYzvn9TinlDO5PKQXhnwTxGALUJ7TA6wQwvvMbCTG+Cdz4E3NHKnkocmxKyt5gnhVAc5LDJHHRr6mUp5TVbCpQ3nrJZTlPGy8H2KM/yDbohRCeG/igvnCQ4zxr5SvQYG4CzQplwKnYpDHjx63EMLHzOzVRPIgJqNQnalieADB8BRkG6C1bYzxRMqBXVQ450O20ObTelzV5ZwAiTqAd81lK83M7JfPnnDzECBSFG4ogM2b2SuUNBIRhQBpDFEdyoJN4Y2Y2QW0j3wouplsd8QqBvUQY/wTO/Pg9CP20U03Vcq2US5arDiuNpVGlXaD0NTMEbvmspXW6/fMzGxuds5++eyJsjyOA6QThZ8geKcEpAfRjcIUwBq8GOMrUiapJifZ6xfxYVuIlt9ynZlf7bOxq8e5+JIJwNjxKoWoddSeEkdhCGFzAY4TIKI7xcQmORZy98aCvYy6GOOpNmDaqriIjxQ3x8FVq1fZwelH7JIVK+2tK95tL734jJ188YSd/PffKvWenzlgZmaPTx8yM7Od+2crx1nsUHb21MwRmxy70j3OXaMXPVyGj2mXCnFXKgA/S+BeLpJCPN00Fo6Urb8ujkqGOHTFGJ8ys0uQ/+imm2zs6nF76cVn7IUTTybh5TQ1c6RMnlJ2k2PoGpvE55ocu9J6/V4lKVDSW4p0kZldSImHJ2YAVQJOwTA8bLWBRv34vkk3sSiaS4DQyRerEwBrCY91zWUryzSIUhHF4vY1SqEMRMBD8uAxH2UQzAEIafSNmDNJUEAeqCbFGH+uNo28QcRRYBJd008dpJLV/PRTB0uH8yTFE7efU6KMRp3C0+TKA+hF30gI4e1SbmhqGls1+i4dW1/JtxEgYXvnD39o008drMEzcvj9P/tpecxTrqtuIYams3pANIdHRR5AyI3CN1qDwoNzAQq6+zOfdRMfMydKWdwlJrrHmpxyCksBcV7tpRiKVyjVyFA0aOSpnYWoQleokHSSwd0g73MdFXeJmGXmInFq5khZh4YhBef5vFFeVHmVy0Z1HPS0ep2/CH/i0fvV1FoML7eEYGAepLZqquNElAtxqljQs0II36gYFiEPoKq8Q0IIlZC5+d4pzpa6ZEX94tp2fRBHWZvIgwYF1lW9YnapcNB18yzWiT4WFue8QPdsXL5UG4CttXrdTXbVdXfZW1e826667q4yEnPwtBv98X2TLijP9mYLNwpAakIZVgjh3orhdTGwlGrHte/FFoMrZkoXFeuW0RjjcXa6t2y46rq77DePfafMM8CPf+ruct+TtudFX64LTUnbtUwPsmvSv+E2T73+G3Ltec9y6SH21uJpC56+nDSzl4rtf4p0ynkm6j5OS0Wghm4lpBNdQSleiGv0dRkHPXjDFNatTzx6f5lMQKWEm4iF9rwhhMS+5DcN+saByybFALVgBRpsIYT3U969i48++YiZA6+LlhqeFefQ38gQZ/YeLu0TO3ZTKV88hMz8ap8dnF7wg1WHiiZ4fFxh1pSKQFau0aTUMV20WHi7Jtfbrsn1tv+Be2z/A/foYRccS7vH/sbxylh2w4Z+5bgVbZ7899/shRNPls9yE2I/KjiGibJIXL/cegArBWifT5pVzjme2GGDwNs2OlpCw/jV31h/HaXg1o7fZmvHbyvzz88cqJ3Xa8fM7NpNa82cNo2GkERX6sFSkAotKQ8gSxssI5DHQe5G9WI88TgIeAxRnTgMeb8Ls8i147d1PqcHjvWOlevcrlT8qMmza92KUgC1IDd4JoTwATneSXDWYiMvJS9qHv7+Q2oqxd1jE5g24q507OpxnZHCtwwtF4G6rUgBciE+gXeymtpcuAcI9XTsGUQTO3bb2K13qLki7ioxc8yBm92zT00VcTcMPT9zwH0t5kDyklfWlQJUoaKeoAYwdfEpKSwPbFdN7NhdewoD5+/cP1sb4zxwWqYJnhURjG6Y62M27kj9mfJzo1IAuTJDq0Qgj4NNC3RLQOoKPid96gFhYsNrtxy467fsLO3WsIRAHe/c2k4hhcT+VWiah0p7CqA5lSsgQwgflONZ5eB5x9pq2+iomkohenhMZHAaMddv2WnXb9lpvX6v0q4HRyOVhXN49civ8Cfb1M42Vx5ArzFNZ4sPbVrJu9BB4SGKtu86VtrGJtZUIO1/4J4KPO4GFRoL3S/gabsp4SmORnVGTRC9vGvzAKo8eMmJjMpz1KDwWHx3w8lYuHuRp0p0b6Vy8Hbun7Wb751KRnPqBinEvuQ89nnbqBxAboThMcTO46AHr8mZXaSTDs1bcb5ev1c7L0+sAG92z77KQwJ+WPDw9x9yYT0+fajWtkj9qQlleOsqB9CcyhWITeOgXpgHz4poyl3w49OHypTS7J59FVjadVrR7QKeJcY2SNvrqkzbKWgeMPV/TbnX9/yq33u1tKx4vfRHfr2EpywKKQXP6EnO3OycfXnze/SwK7xK2jY6amMTa0p7asaYcujc7FwljzGQ2/S0eeqA3bChXz5S05tLX3XR66Tb6bXRSUp4jYQPe1t/Wt8GYBCAFxUAl+vfNZizxrMCoAfP5FGcOjQlANHyKVBdpG3uvfGTlbwRQE/bdx2r/Y7ia+xv0pfYDO8kvR/kr7IXDdCK6OMovJC+Kh6NMf7F5M26AsxFH3dpXXV4x8O25sZb1JwVf7eS+rxepUCtuFEUIGbG3vUUAO8kgBqB+LReAfKksdbNDgIQUbiMovD3KYApeBjzvIttq9/t3WNXTGys2Pjc3rtKfGSEvyTyvl1pKwWbqk/d51clAgERQJv+LqITQJMuVAEmx0E40YM3CDj9xOFdn/+CXfzOy+3id62yl/9+3F5+7q+25sZbyvOuXneTXbJipf3mse/UIGrEAWiX39NWPEMvvkTjP2YBvP9Q98njHwBy9DHEhXY7AAyJcXA0xnhUx0GdzHQBp8BYvDZ729qN9q9De2zv1gdt6/x82aVdu2mtXTq23t6xcl3tz9Q4anr9ns3NzjX+ptSQYImlk4C7r4AyL9/CYCKjf5mEPy1D9J1JjX9G8FIQU91o4zj4xKP32/MzB1qBywFj6cJ6+WXvsVPPHisB8iz22k1ra9Fncq42377wTNMKeHj7gHNhxingvltE0asEkP+UjOEh+uYl+rITGOsAEPC8bnTUGwdxp6fAtYVmDjjV3q0PmpmVECGcG+faPHXAdk2ut/7GcRu79Y5yIoKItSKito2O2tb5eTMBCHhoV6+xmKg8VDie4eGvcBkgIMLOf53b+IedUJeFPBrhBs/SnVJRb0gf1zbBU+G8Cg9Ce/zbrt+ys/Z5BbR91zF7fPpQCfjQvh+UxxLXCJ/wPx2i/5CB/gVu6u/hFVoFnknk5aLQGwcvlHHwzzoO5qSO9aSL8pkfLUSaiiOQI+rjn7rb5mbnynUc4HH0mTwUgBCBlnnAoN00zTa/TbNJRBhHH/Yx7umfVXswzQPYFIGQF4kahe73osePHi8TS+Go+OUsUtObdogfGvT6PZvYsbsGD7p209rKNzpjE2tqT2F6/Z5t33Wslky+76EbGBAwngEOQOlaT6FxTwfV4FkHgOY0hpOctYXnopXvRRlaCKHWNzldT6m+fMYHeRHoPa/UNWev37O9Wx+02T37ynYRfeg+WdptH97xcO1m6vV7dunY+tS3NgqPISLhOCAqQCM/J8UAUwU9cHyH8HRXwX06hPC54ge3kjoP0u878bAZH99+5bnyny+ribtGbueW279Wwsjp4ndebkbfz+D9n94oJEQV4KTgARySRh+DdKXjnuah3HKisiY0s+VmdnGxRRqNMf7EZKnhjU+sDV//tpk4XSMOAL1ZI8YnPJzGGwosH27Y0K89dDYan70HBg9tr3bj+tyTHplhzXcqs2RAV5rqRpsAuv/YXc6GiQwvJ3hNyBCXF/tlijH+RCc6mNY3ScFZAd2bwLBuvnfKto2O2sS2O2zs1jvKG0bfJlgxdmLiw/r7zK/tiomNNbs5Q0EB8HaauAAelgwAqOOgF4WWgWeW+eMWld4J3I1iEsPdxqv0I/kpRE1N8Lz3cv2N45V6ue4T4vEPwvtBJIyFOta9/NzCP6umdm2PJmo6vvEWvtKuk6MuBw2Klog2S9g5CrGo565UIxHRWO7HGHebdKM6tkEKzRzYHH3mPFw2elzm7Q9TNO5/hW5YffLCi3adhTLEpugr7R4oyDuWGgt1PAREhrnMzJbFGB/TcZBnl23A6eRlqWB0VQhhCy0TGGBq3YeI9KLQlhIgj4UKEZEIkBWYMcY9Og7yh0isHDgbArwcqOIPMblLQ2TwPid0kacFICceVgYd+yp2DxLLO+5FYUhEInerePD9C5NuVJ/KMDiAVXDmdIM5ICmFEL4lTlNIHkDewvk6B1CIyAMeA9ToawXPEoBUXhlEoEaijokAiWVGCdED6IGD+MmNgrPqGPSgM0FQJ6mzNK+QPKiwo31MTjgKGdq8rAMXHX2WgKPyymhXmoMIkOUyI8Z42BsHFRprZu/hyvNJiKMuhPA9cozO9BimgkjBUZtuFaJGIRJgYs2XG/tqkAq5dg+OJ69cV4jlhEb/fVBzulGVAhRweIXDUcBbD2QOVM7u2QBQf4M+ecHv8brOs8XleKA8m1nh6EGFRvnO0QvCj+U787QNOF7xIzHcAAKPnaZTebwB14+JOL1E/2JEyq7H9c06v3Hg2aY35gEe+1Ll2Uq1BZhqRE/MELHPd+VrZvYa/qXeYSjG+DXnrufxhwEqGA9QKvE3LLrPEHW2iRuKewKF1+TfpNoCtExjsHMXwCAVIrYVNb1ewiseLwop+hggzwA5MlJRyFB0q1HG+4AGcEgcfaluk+GpfzXvqgvANmKIDFAhvmbSjXozy7aKMd7jRKAHUCNGk8JBXd56sHimyVHH8OAD+MMy8FrLm5w0KVUnN6nRN/jLiu9ojnjLCZYXmQqb3gC8Qs6Fo9GV6TgEZ+Jm422bZE6e63ObqfbRhsqzuUrByClXRyEywAtkOZH8EIqlsDzJGwAe97CPiHiVegHuHRSOl8zJs02Px4a2UV7l2ZLKwcgpVw/HRgiiPqXBetD9r2y6qgB4m9NtAqiOR14EWsbJnGcb59Wea4vrsDxbVjkQTUrVzUUhL+rxOeLTXQF6S5AQwpdkjGoCqNHHELFVZ+sW4nyqnpZRebZGpSC0Ua5uKgp1Ub88xviHNgAVWvGpOoBgnGOASAwQE50zBK0JHttz+54t1w4rZW9UDkIbpepzFCICGSI/3K59lm8OMFuAdmexyzPa1MwT8OZlVqjdpwcQ+55jPRuEY14Zz2YZeyulALRVrj66UCSMg5XJTIyxTqpQCOGLBfALqB04HtNzBYh0imwafRqBHizNezbNqxZ7vFE5AG2VasPrRkfkATe/ta98BFXY8EoKAI0czwBPUzfqrcl0CaHjH9qFUvtt1LZ823JZXaCGAZQCaHJMIxJgeR9bI1ApWIi6VNKFNIPzIk+3ObUpk9Ji6tY0DICWgQg7b73Ex4wci3GOu0okBdYEz4s8hahK2QfVsNsbGkBrAZHzHlgTh57NAOQIVBvDy3WbKXiaH5aWpF117mLltceQMA4GWVbwx1AY9y4qynC3agQBUcWQNXGZFEBbKucWWsq2XYcvVl6bsOm6EJMazEwBFAnA0QZHJxJDYqCA9j8LzxLOHoa8doMkQNQEoDiubQEgtgyIo+2MwH6j4C1Fm0mpc4YpbRt5DyIiDRCRR8SiLgNgiKnE5azYh4bp6GG21Unq5GHKazsFMZW8NkzAKEwPMhLXH0SD1lsypRw0LHntpyB6Wy4H5/FWYcHO+wyvC4AuZd80eQ4etrxzKJxcUilA3k/lYWtSmzLnlDwHLYW88yhE3ue8SqFodOlW9z01HT9n5TloqeSdi21N4DwpJAWheVXT8XNew3wS00YpMLB3cajCY2le1XT8vFHKoUup1Dk9u2fLOT93DGpT5ryR56A3Qrnz5o55agukbbnzSl2dNUy1PTeXGxTCoPXOebV14lLpjTj//yw8M7P/AswlQ5qipEy0AAAAAElFTkSuQmCC";
    document.querySelector('#spinner').src = "data:image/gif;base64,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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";

    // Toolset and unloaded pattern
    waitUntil(() => OWOP?.options?.toolSetUrl, () => { OWOP.options.toolSetUrl = 'data:image/png;base64,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'; });
    waitUntil(() => OWOP?.options?.unloadedPatternUrl, () => { OWOP.options.unloadedPatternUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAGUExURezVksGlaJLJ5oEAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAWdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjH3g/eTAAAAtGVYSWZJSSoACAAAAAUAGgEFAAEAAABKAAAAGwEFAAEAAABSAAAAKAEDAAEAAAACAAAAMQECAA4AAABaAAAAaYcEAAEAAABoAAAAAAAAAGAAAAABAAAAYAAAAAEAAABQYWludC5ORVQgNS4xAAMAAJAHAAQAAAAwMjMwAaADAAEAAAABAAAABaAEAAEAAACSAAAAAAAAAAIAAQACAAQAAABSOTgAAgAHAAQAAAAwMTAwAAAAAGOkJsRSTv3MAAAAGUlEQVQY02NgEIRCRgEIhAswQAUYGeioBgAynwRBjdQjAgAAAABJRU5ErkJggg=='; });
    waitUntil(() => OWOP?.cursors?.slotset, () => {
        let slotcanvas = document.createElement("canvas");
        !function popOut(canvas, img) {
            canvas.width = img.width, canvas.height = img.height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            for (var idat = ctx.getImageData(0, 0, canvas.width, canvas.height), u32dat = new Uint32Array(idat.data.buffer), clr = function clr(x, y) {
                return x < 0 || y < 0 || x >= idat.width || y >= idat.height ? 0 : u32dat[y * idat.width + x]
            }, i = u32dat.length; i--;) 0 !== u32dat[i] && (u32dat[i] = 4280822946);
            for (var y = idat.height; y--;)
                for (var x = idat.width; x--;) 4280822946 !== clr(x, y) || clr(x, y - 1) && clr(x - 1, y) || clr(x - 1, y - 1) || (u32dat[y * idat.width + x] = 4280428111);
            for (y = idat.height; y--;)
                for (x = idat.width; x--;) 4280428111 === clr(x, y - 1) && 4280428111 === clr(x - 1, y) && (u32dat[y * idat.width + x] = 4280428111);
            ctx.putImageData(idat, 0, 0)
        }(slotcanvas, OWOP.cursors.set);
        slotcanvas.toBlob((function (blob) {
            OWOP.cursors.slotset = URL.createObjectURL(blob);
        }));
    });

    // Neko Script
    let t = Date.now() + 60000;
    waitUntil(() => NS?.dataImages || t < Date.now(), () => {
        if (t < Date.now()) return;
        NS.dataImages.close = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAMUExURU8mIqIsKOzVktTAg8hXuSEAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuMTGKCBbOAAAAuGVYSWZJSSoACAAAAAUAGgEFAAEAAABKAAAAGwEFAAEAAABSAAAAKAEDAAEAAAACAAAAMQECABEAAABaAAAAaYcEAAEAAABsAAAAAAAAAGAAAAABAAAAYAAAAAEAAABQYWludC5ORVQgNS4xLjExAAADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlgAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAAAGNdRzso9yOwAAAE5JREFUGNM9jcENwDAIA2GDmg1iFkDq/rvVbtLy4WRxOOKbxJ5IetGwgGpBKeIIwFWdhqICA6hgA19dikUfj0XpbdEP5zy0gjtP6ZV/+wNzJQkc/aDvpwAAAABJRU5ErkJggg==";
        NS.dataImages.lock = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAMUExURU8mIqIsKOzVktTAg8hXuSEAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuMTGKCBbOAAAAuGVYSWZJSSoACAAAAAUAGgEFAAEAAABKAAAAGwEFAAEAAABSAAAAKAEDAAEAAAACAAAAMQECABEAAABaAAAAaYcEAAEAAABsAAAAAAAAAGAAAAABAAAAYAAAAAEAAABQYWludC5ORVQgNS4xLjExAAADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlgAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAAAGNdRzso9yOwAAAEVJREFUGNN1zcENACEIRFG0AqEDoQEi/fcms8SNF//pHSBDdGpcJTQDxCLWBJyoA+rMYgnDubULeNKC9wN5IL4So7b/9Q2rTwoQLGAjiwAAAABJRU5ErkJggg==";
        NS.dataImages.unlock = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAMUExURU8mIqIsKOzVktTAg8hXuSEAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuMTGKCBbOAAAAuGVYSWZJSSoACAAAAAUAGgEFAAEAAABKAAAAGwEFAAEAAABSAAAAKAEDAAEAAAACAAAAMQECABEAAABaAAAAaYcEAAEAAABsAAAAAAAAAGAAAAABAAAAYAAAAAEAAABQYWludC5ORVQgNS4xLjExAAADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlgAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAAAGNdRzso9yOwAAADxJREFUGNNjYIABRkEIgDKUlCAMIWVjKMOAAcYQRGIogYAymKFspKTMCGIYMMEYQjgYxmAAZAhA7IbbDgCZlQoYvimZfgAAAABJRU5ErkJggg==";
        NS.dataImages.maximize = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAMUExURU8mIqIsKOzVktTAg8hXuSEAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuMTGKCBbOAAAAuGVYSWZJSSoACAAAAAUAGgEFAAEAAABKAAAAGwEFAAEAAABSAAAAKAEDAAEAAAACAAAAMQECABEAAABaAAAAaYcEAAEAAABsAAAAAAAAAGAAAAABAAAAYAAAAAEAAABQYWludC5ORVQgNS4xLjExAAADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlgAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAAAGNdRzso9yOwAAADZJREFUGNNjYIABRkEIADGEDGEMA0IMJRBQBjKMjY2MjY0ZGRgFGJgMgMYR0C4MYwgywBggAABukAkINh8nIAAAAABJRU5ErkJggg==";
        NS.dataImages.minimize = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAMUExURU8mIqIsKOzVktTAg8hXuSEAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuMTGKCBbOAAAAuGVYSWZJSSoACAAAAAUAGgEFAAEAAABKAAAAGwEFAAEAAABSAAAAKAEDAAEAAAACAAAAMQECABEAAABaAAAAaYcEAAEAAABsAAAAAAAAAGAAAAABAAAAYAAAAAEAAABQYWludC5ORVQgNS4xLjExAAADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlgAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAAAGNdRzso9yOwAAACFJREFUGNNjYIABRkEIIJGhBALKQIYxGDAyMApAjCPPQAARogfGHJpHQAAAAABJRU5ErkJggg==";
    });
    waitUntil(() => document.querySelectorAll("#optionsMinimize").length || t < Date.now(), () => {
        if (t < Date.now()) return;

        // Options background
        let divList = document.querySelectorAll("#optionsMinimize>div");
        divList[0].style.backgroundColor = "var(--medium)";
        divList[0].style.boxShadow = divList[0].style.boxShadow.replace(/rgb\(.+?\)/, "var(--text-shadow)");
        divList[2].style.backgroundColor = "var(--medium)";
        divList[2].style.boxShadow = divList[2].style.boxShadow.replace(/rgb\(.+?\)/, "var(--text-shadow)");
        document.querySelector("#optionsMaximize>div").style.backgroundColor = "var(--medium)";

        // Button background
        document.querySelector("#optionsMinimize>style").innerHTML = document.querySelector("#optionsMinimize>style").innerHTML.replace(`button.on {
								background: #9a937b;
							}`, `button.on {
                                background-color: var(--light-sel);
							}`);

        // Icons tab
        document.querySelector(".NSspan1").parentElement.querySelector("style").innerHTML = document.querySelector(".NSspan1").parentElement.querySelector("style").innerHTML.replace(`.NSdiv2 {
							background: #aba389;
							color: #7e635c;
							border-radius: 6px;
							border: initial;
							padding: 4px;
							text-shadow: 1px 1px #4d313b;
						}`, `.NSdiv2 {
							background: var(--light);
							color: var(--text);
							border-radius: 6px;
							border: initial;
							padding: 4px;
							text-shadow: 1px 1px var(--text-shadow);
						}`).replace(`.NSdiv1 {
							background-image: url("https://ourworldofpixels.com/img/toolset.png");
							width: 36px;
							height: 36px;
						}`, `.NSdiv1 {
							background-image: url("${OWOP.options.toolSetUrl}");
							width: 36px;
							height: 36px;
						}`);

        // Dropdown and patterns tab background
        let nsStyle = document.createElement("style");
        nsStyle.innerHTML = `.ns_dropdown {
            background-color: var(--light);
        }
        .ns_container {
            background-color: var(--medium);
            box-shadow: inset 3px 2px 0px 0px var(--text-shadow);
        }`;
        document.head.appendChild(nsStyle);

        // Toolset
        document.querySelector("div:has(>#toole-container)>style").remove();
        NS.localStorage.cursors.cursor.icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAMAAADW3miqAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAbUExURU8mInqZcDRQKiAxGks9H3hiMp+BQcGlaAAAAPjL3PIAAAAJdFJOU///////////AFNPeBIAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuMTGKCBbOAAAAuGVYSWZJSSoACAAAAAUAGgEFAAEAAABKAAAAGwEFAAEAAABSAAAAKAEDAAEAAAADAAAAMQECABEAAABaAAAAaYcEAAEAAABsAAAAAAAAAKOTAADoAwAAo5MAAOgDAABQYWludC5ORVQgNS4xLjExAAADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlgAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAADY5TB4zfSjcAAAAQFJREFUOE/NkkESwyAMA2WbOvn/izsyEIyT6fTWcoTNWijg/GKhbjytn0AA8OGDBXXwEZ2QKCChC3THJ6RqKmEj2qd386IBUxUD6UEO8waRoS58wTNBhrgjZhY6hZI2OosJsR0QUTGVOm5SPFSxYC5RuiaHiHUfUYZ7gGwczpE3aIjUOKijF7OCi8xZMZRFTCYHBxvoJeRZeybARCkk0+LnVOg8I5VGoa2lZ1Eq6LlU2stfAA4f1MoknEVGpbm7HxeTTcbrU9fcW3O/PZVBscjIQpXXnkYoegI6KFpHi5FIzjPgyF3m4MMSTPaUMkczwM5smdZtdiY3nlbZfYbK+kfoDaMRHIHKlMslAAAAAElFTkSuQmCC";
        NS.localStorage.cursors.move.icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAMAAADW3miqAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAASUExURU8mIsGlaJ+BQXhiMks9HwAAAB1TnoEAAAAGdFJOU///////ALO/pL8AAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuMTGKCBbOAAAAuGVYSWZJSSoACAAAAAUAGgEFAAEAAABKAAAAGwEFAAEAAABSAAAAKAEDAAEAAAADAAAAMQECABEAAABaAAAAaYcEAAEAAABsAAAAAAAAAKOTAADoAwAAo5MAAOgDAABQYWludC5ORVQgNS4xLjExAAADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlgAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAADY5TB4zfSjcAAAAMxJREFUOE+tlFESwyAIRAXp/a/cEQRZU6md6X5ksuuLRjBprwu1Pfik36GWBHm+Bx0hcnEBsasXUGssIsLFcoNiIVYI8mzGgsIKYYyugOIVFOoBeT4uqy4IRW4QkZeQpStkmvWaUMSrBOoQOgmgMYFOEhe92SBrmVgxhYjVbZBO3sV2J8xd3dVy1ugvL47QoQQZGsaheQqe0FC0JRocebjV4HUK4ll1ru0URIzuAkqnIMcA2e5my2AAIPKqVp+UjqsKKOsAXf0wjvof9AZasREbsK3inQAAAABJRU5ErkJggg==";
        NS.localStorage.cursors.pipette.icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAMAAADW3miqAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAASUExURU8mIsGlaJ+BQXhiMks9HwAAAB1TnoEAAAAGdFJOU///////ALO/pL8AAAAJcEhZcwAADsIAAA7CARUoSoAAAAAZdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuMTGKCBbOAAAAuGVYSWZJSSoACAAAAAUAGgEFAAEAAABKAAAAGwEFAAEAAABSAAAAKAEDAAEAAAACAAAAMQECABEAAABaAAAAaYcEAAEAAABsAAAAAAAAAPJ2AQDoAwAA8nYBAOgDAABQYWludC5ORVQgNS4xLjExAAADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlgAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABc7WH6CeiquwAAALdJREFUOE+t0lEOxCAIBNAB3PtfeQPYVg1DmuzyQaK+KCr4vAicE1X8ghDzmRkCgEi5XCJAxIXnGJ8gjSoAVbVQNVLTDI68GlWRy9TI95LYqSl8Ij8zh+e6R1RuNq6tKgSMPMwzKdwvN8T8nejt/A3Vhj8mvV2YXKXfshj6wZt5ZvdRaXZEzIaYWRE1C+LmQY25UWcu1JqJop+pWRE1iaIpuAk0G4eaiXwbbiZqyV1Ta85+quN/6AsdgBS/iXoO4QAAAABJRU5ErkJggg==";
        NS.localStorage.cursors.zoom.icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAMAAADW3miqAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAVUExURU8mIsGlaJ+BQXhiMks9H9rJpQAAAC8DU7YAAAAHdFJOU////////wAaSwNGAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAGXRFWHRTb2Z0d2FyZQBQYWludC5ORVQgNS4xLjExiggWzgAAALhlWElmSUkqAAgAAAAFABoBBQABAAAASgAAABsBBQABAAAAUgAAACgBAwABAAAAAwAAADEBAgARAAAAWgAAAGmHBAABAAAAbAAAAAAAAACjkwAA6AMAAKOTAADoAwAAUGFpbnQuTkVUIDUuMS4xMQAAAwAAkAcABAAAADAyMzABoAMAAQAAAAEAAAAFoAQAAQAAAJYAAAAAAAAAAgABAAIABAAAAFI5OAACAAcABAAAADAxMDAAAAAA2OUweM30o3AAAADVSURBVDhPrdLbDsQgCARQGHT//5M3g3itmmaz89JUTlpE5fMisi7s8jsSz/A+FmOppa3MoBhVVaCrByIxBmR7JKJmydPVgmi8DIDPonYI7ElVD2gyXa0IgXLW/BLpHTk7IkzIrijnrBeE5GQwE+KZJg4xBrBDNBwTGaPVDMgPH9wd4G1ZNRMqRxZnR1KLDYlooMulax96kIZEhLcMsHbThkT7FdkZlY2ZTd0uqPbsZGMC9ZbXuqcg/ohorUaiJys/W6uRuju7mGFOZ9MmfjPTfTrmf+gLMwkWZlIDA+YAAAAASUVORK5CYII=";
        NS.localStorage.cursors.export.icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAMAAADW3miqAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAbUExURU8mInqZcKIsKDRQKiAxGtBsXcGlaHhiMgAAAMcIAGAAAAAJdFJOU///////////AFNPeBIAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuMTGKCBbOAAAAuGVYSWZJSSoACAAAAAUAGgEFAAEAAABKAAAAGwEFAAEAAABSAAAAKAEDAAEAAAADAAAAMQECABEAAABaAAAAaYcEAAEAAABsAAAAAAAAAKOTAADoAwAAo5MAAOgDAABQYWludC5ORVQgNS4xLjExAAADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlgAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAADY5TB4zfSjcAAAALRJREFUOE+t09EOwyAIBVBWme3/f/ECCAIr1iy7T4pnKdgOro1ALtxlE0EdQ8tM9LIclLnNqHEYyfILSTkich5ZNaH2O0JGuEQ4kCmPjreG0dwFVOURUfUZQURo4WNZQgcM6G466D28YJ043BN0UhvoVFVdJiFT1lNovKGgoerpGInKH6zlZCOq/COwGEqnTBlIf5GPJYKUrNC8zHQ6Qmg+pUaukxL5bmvkd27tE+oVCvkf+gDrWhhjF5thqQAAAABJRU5ErkJggg==";
        NS.localStorage.cursors.fill.icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAMAAADW3miqAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAYUExURU8mIp+BQcGlaEs9H6+/0v///3hiMgAAAA91RzcAAAAIdFJOU/////////8A3oO9WQAAAAlwSFlzAAAOwwAADsMBx2+oZAAAABl0RVh0U29mdHdhcmUAUGFpbnQuTkVUIDUuMS4xMYoIFs4AAAC4ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEQAAAFoAAABphwQAAQAAAGwAAAAAAAAAo5MAAOgDAACjkwAA6AMAAFBhaW50Lk5FVCA1LjEuMTEAAAMAAJAHAAQAAAAwMjMwAaADAAEAAAABAAAABaAEAAEAAACWAAAAAAAAAAIAAQACAAQAAABSOTgAAgAHAAQAAAAwMTAwAAAAANjlMHjN9KNwAAABHElEQVQ4T62TC47EMAhDIRD2/jde2UnIr13tSMNIo4a+2i5J5ecfJWfjqT6GBLWss5YmmUdudkRUVR+pbIgU3Dczu6ixbgwQ90urLydTq4seVFsl417dBdFeIDCVQqFlo3g9mBQ6qIRaHjJxUgvk1buZRtmohBwEGMiAWsY1ocrQgbGTOqFO9cw0U4vpt0CZmWYWkxoQp6mRlIWWuCApyINI3Sw0pXpwZC44LI0yg2ZK4R9MrZi5UEYRCFc71PbMxAQ20EH4MqS6HWcNqdBiEQFP/BYIhjxrEozDvTshhiLDNBAKvt7+dtg14STavmy50w5ubV7QIZbMtMungNHwOgWeUPtGIxZm2q2980OeJrN3rbdsb/XnzVHfg34BJVQYOqQhq00AAAAASUVORK5CYII=";
        NS.localStorage.cursors.line.icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAMAAADW3miqAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAASUExURU8mItBsXaIsKP///6+/0gAAANIyMgYAAAAGdFJOU///////ALO/pL8AAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuMTGKCBbOAAAAuGVYSWZJSSoACAAAAAUAGgEFAAEAAABKAAAAGwEFAAEAAABSAAAAKAEDAAEAAAADAAAAMQECABEAAABaAAAAaYcEAAEAAABsAAAAAAAAAKOTAADoAwAAo5MAAOgDAABQYWludC5ORVQgNS4xLjExAAADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlgAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAADY5TB4zfSjcAAAAKlJREFUOE/VkUESxSAIQ2P03//Kf6BWAZXprlMWXcTXEAC/B4Uo7OolCBnd34CMup6AUhLqhlgTarRjrUdqBm9nryFnXlNNvIwI8DCj1Y4dnWQ6Otb/N7z8BYJ59woXiAn67gtpvCLUO5J20gXSjpVUr1sKiGZugkxmhSQzyWrHixAkDukvtIUK/e4jJJE0j/VaIPWSdZodrJCaKdty6Pom7UYlwXf1WegPITYVzl+snIYAAAAASUVORK5CYII=";
        NS.localStorage.cursors.paste.icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAMAAADW3miqAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAASUExURU8mIv///9BsXaIsKK+/0gAAAI8lQLQAAAAGdFJOU///////ALO/pL8AAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuMTGKCBbOAAAAuGVYSWZJSSoACAAAAAUAGgEFAAEAAABKAAAAGwEFAAEAAABSAAAAKAEDAAEAAAADAAAAMQECABEAAABaAAAAaYcEAAEAAABsAAAAAAAAAKOTAADoAwAAo5MAAOgDAABQYWludC5ORVQgNS4xLjExAAADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlgAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAADY5TB4zfSjcAAAASpJREFUOE+tk9GOxCAMA23H9/+/fHKALu2y0p50eUAQRslAKX6+CDwTp/g7hMSeWPltumLfHzvXBAAl6oCtdSOs8sCOECDR1d0c7AA1U4BICSjeqV4AJAuk7Arx8J+QVKBmvzf/TMIEMqCj/4BIQjIyHvwxmWxDH/xfEPnwFzxrNSRJMO/+ZaI2qAJVmi1/iknnIAty2jkdp79cZKBRapzOLXr5R76kaHapCSnll39zGXcoVqPI8M900X0LE3KubvlH0TlATC8o1NzMANsQnUoblIb28A8Vv8rFN7OgvExPf1PdT/mON2j8BvEXXOmXF/O68Q2Lf4qhPzLrHZr+eQE9MOVGfoeGvxty1WIe0GhZFdT3l/mg0NDzjd9j/isv5ARN7JbYF5/i/6BfeD0PuNx2Pl4AAAAASUVORK5CYII=";
        NS.localStorage.cursors.copy.icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAMAAADW3miqAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAMUExURU8mIv///6+/0gAAAFkthB8AAAAEdFJOU////wBAKqn0AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAGXRFWHRTb2Z0d2FyZQBQYWludC5ORVQgNS4xLjExiggWzgAAALhlWElmSUkqAAgAAAAFABoBBQABAAAASgAAABsBBQABAAAAUgAAACgBAwABAAAAAwAAADEBAgARAAAAWgAAAGmHBAABAAAAbAAAAAAAAACjkwAA6AMAAKOTAADoAwAAUGFpbnQuTkVUIDUuMS4xMQAAAwAAkAcABAAAADAyMzABoAMAAQAAAAEAAAAFoAQAAQAAAJYAAAAAAAAAAgABAAIABAAAAFI5OAACAAcABAAAADAxMDAAAAAA2OUweM30o3AAAADrSURBVDhPrdOBCsMwCARQ6/7/n8d5pzXWwQYLYzTJQ8+y2euLZfNgW78jw+oHed4ec/V73tSDmV1YC8s9ibuTrUgkujnYgmiq31SxkWE/j1RHy0Iw6vfIj4cshH5r/kIstuc3GVzLVD+ke6Iz/1XqRjjp+TGmNxQxXc2yX7RjqYmqGE9YitNx4sqPYlAxC8qsqH0Spcr8HxEzKEgOgG0hqkSXuUf4gUL5rfKNYQJNR2VC8S0zEP8GcY+ieOllbsRiVPmjAh0op6yV5kTMr0zRUscHYkut85c5VAYv80Aas5MNiR0HffNp/Q+9AXITCXr7a0oiAAAAAElFTkSuQmCC";
        NS.localStorage.cursors.write.icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAMAAADW3miqAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAPUExURU8mIsGlaJ+BQXhiMgAAAIiCuYEAAAAFdFJOU/////8A+7YOUwAAAAlwSFlzAAAOwwAADsMBx2+oZAAAABl0RVh0U29mdHdhcmUAUGFpbnQuTkVUIDUuMS4xMYoIFs4AAAC4ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEQAAAFoAAABphwQAAQAAAGwAAAAAAAAAo5MAAOgDAACjkwAA6AMAAFBhaW50Lk5FVCA1LjEuMTEAAAMAAJAHAAQAAAAwMjMwAaADAAEAAAABAAAABaAEAAEAAACWAAAAAAAAAAIAAQACAAQAAABSOTgAAgAHAAQAAAAwMTAwAAAAANjlMHjN9KNwAAAAsUlEQVQ4T72SUQ7DMAhDDcn9zzxBu8aYKes0bc5HgTxhkgbzhqCFV/ohBKDXNE9pUVKYuSulKcxvQO4+9lA0Aoa2Ushj7vfQnHsIsBGQ+gmUu81PoDzY+aE6x7BjU1tV6NzbQzF2RtWP4suttSpQ3uShb6D4b2bmsUJEMZR77iNWufQCLbfqd0X530jciqA6K6fPoB0ozRuUr2SJ/Rakz4MKC9LnQQWaqTCl8hG01Z+hB+XgEDCU5m1rAAAAAElFTkSuQmCC";
    });
})();