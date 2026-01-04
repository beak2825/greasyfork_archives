// ==UserScript==
// @name Action Menu on Selection
// @namespace http://tampermonkey.net/
// @version 1.0
// @description Contextual popup with quick search links. Supports custom links and language settings.
// @author NoOne
// @license MIT
// @match *://*/*
// @grant GM_addStyle
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_registerMenuCommand
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/559040/Action%20Menu%20on%20Selection.user.js
// @updateURL https://update.greasyfork.org/scripts/559040/Action%20Menu%20on%20Selection.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const PLACEHOLDER_SYMBOL = '❯';
    const ICON_HEIGHT = '15px';
    const STORAGE_KEY = 'TSAB_CustomButtons';
    const TRANSLATE_LANG_KEY = 'TSAB_TranslateTargetLang';
    const DEFAULT_BUTTONS = [];
    const DEFAULT_TRANSLATE_LANG = 'en';

    const ICON_DEFAULT_FALLBACK = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLUxpY2Vuc2U6IENDIEF0dHJpYnV0aW9uLiBNYWRlIGJ5IHp3aWNvbjogaHR0cHM6Ly93d3cuendpY29uLmNvbS8tLT4KPHN2ZyBmaWxsPSIjZmZmIiB3aWR0aD0iODAwcHgiIGhlaWdodD0iODAwcHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cGF0aCBkPSJNMy41MTIxMTcxMiwxNSBMOC4xNzE5MDIyOSwxNSBDOC4wNTk0OTE5NywxNC4wNTIzNTA2IDgsMTMuMDQ0NDU1NCA4LDEyIEM4LDEwLjk1NTU0NDYgOC4wNTk0OTE5Nyw5Ljk0NzY0OTQyIDguMTcxOTAyMjksOSBMMy41MTIxMTcxMiw5IEMzLjE4MDQ2MjY2LDkuOTM4MzM2NzggMywxMC45NDgwOTM3IDMsMTIgQzMsMTMuMDUxOTA2MyAzLjE4MDQ2MjY2LDE0LjA2MTY2MzIgMy41MTIxMTcxMiwxNSBMMy41MTIxMTcxMiwxNSBaIE0zLjkzNTUxOTY1LDE2IEM1LjEyNTkwNDMzLDE4LjM5NTM0NDQgNy4zNTIwNzY3OCwyMC4xODUxMTc3IDEwLjAyODAwOTMsMjAuNzgzMjkyIEM5LjI0ODg5NDUxLDE5LjcyMjc3NTEgOC42NTIxNjEzNiwxOC4wMzcxMzYyIDguMzEzNzUwNjcsMTYgTDMuOTM1NTE5NjUsMTYgTDMuOTM1NTE5NjUsMTYgWiBNMjAuNDg3ODgyOSwxNSBDMjAuODE5NTM3MywxNC4wNjE2NjMyIDIxLDEzLjA1MTkwNjMgMjEsMTIgQzIxLDEwLjk0ODA5MzcgMjAuODE5NTM3Myw5LjkzODMzNjc4IDIwLjQ4Nzg4MjksOSBMMTUuODI4MDk3Nyw5IEMxNS45NDA1MDgsOS45NDc2NDk0MiAxNiwxMC45NTU1NDQ2IDE2LDEyIEMxNiwxMy4wNDQ0NTU0IDE1Ljk0MDUwOCwxNC4wNTIzNTA2IDE1LjgyODA5NzcsMTUgTDIwLjQ4Nzg4MjksMTUgTDIwLjQ4Nzg4MjksMTUgWiBNMjAuMDY0NDgwNCwxNiBMMTUuNjg2MjQ5MywxNiBDMTUuMzQ3ODM4NiwxOC4wMzcxMzYyIDE0Ljc1MTEwNTUsMTkuNzIyNzc1MSAxMy45NzE5OTA3LDIwLjc4MzI5MiBDMTYuNjQ3OTIzMiwyMC4xODUxMTc3IDE4Ljg3NDA5NTcsMTguMzk1MzQ0NCAyMC4wNjQ0ODA0LDE2IEwyMC4wNjQ0ODA0LDE2IFogTTkuMTg0NDAyNjksMTUgTDE0LjgxNTU5NzMsMTUgQzE0LjkzNDAxNzcsMTQuMDYyMzg4MiAxNSwxMy4wNTI4MjU2IDE1LDEyIEMxNSwxMC45NDcxNzQ0IDE0LjkzNDAxNzcsOS45Mzc2MTE4MyAxNC44MTU1OTczLDkgTDkuMTg0NDAyNjksOSBDOS4wNjU5ODIyOSw5LjkzNzYxMTgzIDksMTAuOTQ3MTc0NCA5LDEyIEM5LDEzLjA1MjgyNTYgOS4wNjU5ODIyOSwxNC4wNjIzODgyIDkuMTg0NDAyNjksMTUgTDkuMTg0NDAyNjksMTUgWiBNOS4zMzQ5ODIzLDE2IEM5Ljg1NzE3MDgyLDE4Ljk2NzgyOTUgMTAuOTE4MDcyOSwyMSAxMiwyMSBDMTMuMDgxOTI3MSwyMSAxNC4xNDI4MjkyLDE4Ljk2NzgyOTUgMTQuNjY1MDE3NywxNiBMOS4zMzQ5ODIzLDE2IEw5LjMzNDk4MjMsMTYgWiBNMy45MzU1MTk2NSw4IEw4LjMxMzc1MDY3LDggQzguNjUyMTYxMzYsNS45NjI4NjM4MyA5LjI0ODg5NDUxLDQuMjc3MjI0ODYgMTAuMDI4MDA5MywzLjIxNjcwODA0IEM3LjM1MjA3Njc4LDMuODE0ODgyMzQgNS4xMjU5MDQzMyw1LjYwNDY1NTU2IDMuOTM1NTE5NjUsOCBMMy45MzU1MTk2NSw4IFogTTIwLjA2NDQ4MDQsOCBDMTguODc0MDk1Nyw1LjYwNDY1NTU2IDE2LjY0NzkyMzIsMy44MTQ4ODIzNCAxMy45NzE5OTA3LDMuMjE2NzA4MDQgQzE0Ljc1MTEwNTUsNC4yNzcyMjQ4NiAxNS4zNDc4Mzg2LDUuOTYyODYzODMgMTUuNjg2MjQ5Myw4IEwyMC4wNjQ0ODA0LDggTDIwLjA2NDQ4MDQsOCBaIE05LjMzNDk4MjMsOCBMMTQuNjY1MDE3Nyw4IEMxNC4xNDI4MjkyLDUuMDMyMTcwNDggMTMuMDgxOTI3MSwzIDEyLDMgQzEwLjkxODA3MjksMyA5Ljg1NzE3MDgyLDUuMDMyMTcwNDggOS4zMzQ5ODIzLDggTDkuMzM0OTgyMyw4IFogTTEyLDIyIEM2LjQ3NzE1MjUsMjIgMiwxNy41MjI4NDc1IDIsMTIgQzIsNi40NzcxNTI1IDYuNDc3MTUyNSwyIDEyLDIgQzE3LjUyMjg0NzUsMiAyMiw2LjQ3NzE1MjUgMjIsMTIgQzIyLDE3LjUyMjg0NzUgMTcuNTIyODQ3NSwyMiAxMiwyMiBaIi8+Cjwvc3ZnPgo=';
    const ICON_BRAVE_FULL = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPCEtLUxpY2Vuc2U6IFBELiBNYWRlIGJ5IHB1cHB5bGludXg6IGh0dHBzOi8vZ2l0aHViLmNvbS9wdXBweWxpbnV4LXdvb2YtQ0UvcHVwcHlfaWNvbl90aGVtZS0tPgo8c3ZnIHdpZHRoPSI4MDBweCIgaGVpZ2h0PSI4MDBweCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmVyc2lvbj0iMS4xIj4KICA8ZyB0cmFuc2Zvcm09InNjYWxlKDAuNTIxKSI+CiAgICA8cGF0aCBzdHlsZT0iZmlsbDojRjc2RjMxO3N0cm9rZTpub25lO3N0cm9rZS13aWR0aDoxOyIgZD0ibSA2NiwxNCA2MCwwIDE0LDE2IDEwLC0yIDEwLDEwIDAsMTAgMTQsMjAgLTE4LDcwIGEgMjAgMjAgMCAwIDEgLTgsMTAgbCAtNDAsMzAgYSAyMCAyMCAwIDAgMSAtMjQsMCBsIC00MCwtMzAgYSAyMCAyMCAwIDAgMSAtOCwtMTAgbCAtMTgsLTcwIDE0LC0yMCAwLC0xMCAxMCwtMTAgMTAsMiB6Ii8+CiAgICA8cGF0aCBzdHlsZT0iZmlsbDojRkZGO3N0cm9rZTpub25lOyIgZD0ibSA1Niw0MiAxNCw0IGEgMjAgMjAgMCAwIDAgOCwwIGwgMTQsLTQgYSAyMCwyMCAwIDAgMSA4LDAgbCAxNCw0IGEgMjAgMjAgMCAwIDAgOCwwIGwgMTQsLTQgMjAsMjggYSAxMCAxMCAwIDAgMSAwLDggbCAtMjIsMjIgMyw4IGEgMjAgMTUgMCAwIDEgMCw4IGEgMjUgMjUgMCAwIDEgLTgsOCBhIDggOCAwIDAgMSAtNiwwIGEgNDAgNDAgMCAwIDEgLTIwLC0xNCBhIDQgNCAwIDAgMSAwLC00IGwgMTIsLTEyIGEgNCA0IDAgMCAwIDAsLTQgbCAtNCwtMTIgYSAxMCAxMCAwIDAgMSAyLC03IGEgNDAgNDAgMCAwIDEgMjQsLTEwIGEgNjAgNjAgMCAwIDAgLTMwLDYgbCA0LDI0IGEgNDAsNDAgMCAwIDEgLTMwLDAgbCA0LC0yNCBhIDYwIDYwIDAgMCAwIC0zMCwtNiBhIDQwIDQwIDAgMCAxIDI0LDEwIGEgMTAgMTAgMCAwIDEgMiw3IGwgLTQsMTIgYSA0IDQgMCAwIDAgMCw0IGwgMTIsMTIgYSA0IDQgMCAwIDEgMCw0IGEgNDAgNDAgMCAwIDEgLTIwLDE0IGEgOCA4IDAgMCAxIC02LDAgYSAyNSAyNSAwIDAgMSAtOCwtOCBhIDIwIDE1IDAgMCAxIDAsLTggbCAzLC04IC0yMiwtMjIgYSAxMCAxMCAwIDAgMSAwLC04IHoiLz4KICAgIDxwYXRoIHN0eWxlPSJmaWxsOiNGRkY7c3Ryb2tlOm5vbmU7IiBkPSJtIDkyLDEyMCBhIDEwIDEwIDAgMCAxIDgsMCBsIDIwLDEwIC0yNCwyMCAtMjQsLTIwIHoiLz4KICA8L2c+Cjwvc3ZnPgo=';
    const ICON_TRANSLATE_FULL = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxOS4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApLS0+CjwhLS1MaWNlbnNlOiBDQzAuIE1hZGUgYnkgU1ZHIFJlcG86IGh0dHBzOi8vd3d3LnN2Z3JlcG8uY29tL3N2Zy8yMjMwNDQvdHJhbnNsYXRlLWxhbmd1YWdlLS0+CjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCA1MTEuOTk5IDUxMS45OTkiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMS45OTkgNTExLjk5OTsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgogIDxwYXRoIHN0eWxlPSJmaWxsOiNCOEM5RDk7IiBkPSJNNDYxLjkwOSwxMzMuNTYzSDMyMC43NzhjLTQuOTg2LDAtOS43MDYsMi4yMjYtMTIuODc4LDYuMDc3Yy0zLjE3MiwzLjg0LTQuNDUyLDguOTA0LTMuNTA2LDEzLjc5CglsMzcuMTA4LDE5MS42MDdIMTkwLjMzMWMtNS4wMDksMC05LjczOSwyLjIzNy0xMi45MjIsNi4xMTFjLTMuMTcyLDMuODYyLTQuNDMsOC45Ni0zLjQ1LDEzLjg1N2wyNi43MTMsMTMzLjU2MwoJYzEuNjI1LDguMTE0LDguNTE1LDEzLjExMSwxNS43NzIsMTMuNDIzaDI0NS40NjZjMjcuNjE0LDAsNTAuMDg2LTIyLjQ3Miw1MC4wODYtNTAuMDg2VjE4My42NDkKCUM1MTEuOTk1LDE1Ni4wMzUsNDg5LjUyMywxMzMuNTYzLDQ2MS45MDksMTMzLjU2M3oiLz4KICA8cGF0aCBzdHlsZT0iZmlsbDojRTZGM0ZGOyIgZD0iTTQ2MS45MDksMjgzLjgyMWgtNTAuMDg2di0xNi42OTVjMC05LjIyLTcuNDc1LTE2LjY5NS0xNi42OTUtMTYuNjk1CgljLTkuMjIsMC0xNi42OTUsNy40NzUtMTYuNjk1LDE2LjY5NXYxNi42OTVoLTUwLjA4NmMtOS4yMiwwLTE2LjY5NSw3LjQ3NS0xNi42OTUsMTYuNjk1czcuNDc1LDE2LjY5NSwxNi42OTUsMTYuNjk1aDE3Ljk4MgoJYzMuMTk1LDE5Ljg2MiwxMi4yNjEsMzQuOTE2LDI1LjU1Myw1MC4xNTFjLTcuMTM3LDYuOTU2LTE0LjAzMSwxMy42MDItMjEuOTUsMjEuNTIxYy02LjUyLDYuNTE5LTYuNTIsMTcuMDksMCwyMy42MTEKCWM2LjUxOSw2LjUyLDE3LjA5MSw2LjUyLDIzLjYxMSwwYzcuNzk0LTcuNzkzLDE0LjY3NC0xNC40MjUsMjEuNTg2LTIxLjE2M2M2LjkwMiw2LjcyOSwxMy43ODksMTMuMzY4LDIxLjU4NiwyMS4xNjMKCWM2LjUxOSw2LjUyLDE3LjA5LDYuNTIxLDIzLjYxMSwwYzYuNTItNi41Miw2LjUyLTE3LjA5MSwwLTIzLjYxMWMtNy45MTQtNy45MTQtMTQuODAyLTE0LjU1NS0yMS45NS0yMS41MjEKCWMxMy4yOTMtMTUuMjM0LDIyLjM1Ny0zMC4yODgsMjUuNTUzLTUwLjE1MWgxNy45ODJjOS4yMiwwLDE2LjY5NS03LjQ3NSwxNi42OTUtMTYuNjk1UzQ3MS4xMjksMjgzLjgyMSw0NjEuOTA5LDI4My44MjF6CgkgTTM5NS4xMjgsMzQzLjIyOWMtNy4zMjMtOC43MzYtMTIuMTUyLTE2Ljc1My0xNC42NTItMjYuMDE3aDI5LjMwM0M0MDcuMjc5LDMyNi40NzYsNDAyLjQ0OSwzMzQuNDk0LDM5NS4xMjgsMzQzLjIyOXoiLz4KICA8cGF0aCBzdHlsZT0iZmlsbDojMjg2MENDOyIgZD0iTTM3Ny4yODYsMzU1LjY1NmMtMi41MDQtNi40LTguNjgyLTEwLjYxOC0xNS41NDktMTAuNjE4SDE5MC4zMzFjLTUuMDA5LDAtOS43MzksMi4yMzctMTIuOTIyLDYuMTExCgljLTMuMTcyLDMuODYyLTQuNDMsOC45Ni0zLjQ1LDEzLjg1N2wyNi43MTMsMTMzLjU2M2MxLjYyNSw4LjExNCw4LjUxNSwxMy4xMTEsMTUuNzcyLDEzLjQyM2MwLjQ3OSwwLjAxMSwwLjk1NywwLjAxMSwxLjQzNiwwCgljMy43MDYtMC4xNjcsNy40MTMtMS41ODEsMTAuNDk2LTQuNDE5bDE0NC42OTMtMTMzLjU2M0MzNzguMTIxLDM2OS4zNDYsMzc5Ljc5LDM2Mi4wNTYsMzc3LjI4NiwzNTUuNjU2eiIvPgogIDxwYXRoIHN0eWxlPSJmaWxsOiMxNjdFRTY7IiBkPSJNMzYxLjczNywzNzguNDI4SDUwLjA5Yy0yNy42MTksMC01MC4wODYtMjIuNDY3LTUwLjA4Ni01MC4wODZWNTAuMDg2QzAuMDA0LDIyLjQ2OCwyMi40NzIsMCw1MC4wOSwwCgloMjQ0Ljg2NWM4LDAsMTQuODY5LDUuNjc0LDE2LjM5MSwxMy41MjFsNjYuNzgxLDM0NS4wMzdjMC45NDYsNC44OTItMC4zMzcsOS45NTYtMy41MSwxMy43OTQKCUMzNzEuNDQzLDM3Ni4yLDM2Ni43MjYsMzc4LjQyOCwzNjEuNzM3LDM3OC40Mjh6Ii8+CiAgPHBhdGggc3R5bGU9ImZpbGw6I0U2RjNGRjsiIGQ9Ik0xNjYuOTU4LDI1NS45OTZjLTM2LjgxNCwwLTY2Ljc4MS0yOS45NjctNjYuNzgxLTY2Ljc4MXMyOS45NjctNjYuNzgxLDY2Ljc4MS02Ni43ODEKCWM5LjAzMiwwLDE3LjgwNCwxLjc5MywyNi4wMjEsNS4yODJjOC40NzgsMy42MiwxMi40MjQsMTMuNDM0LDguODA0LDIxLjkxM2MtMy42Miw4LjQ0Ni0xMy40MDIsMTIuNDI0LTIxLjkxMyw4LjgwNAoJYy00LjA0NC0xLjcyOS04LjQxMy0yLjYwOS0xMi45MTMtMi42MDljLTE4LjQyNCwwLTMzLjM5MSwxNC45NjctMzMuMzkxLDMzLjM5MXMxNC45NjcsMzMuMzkxLDMzLjM5MSwzMy4zOTEKCWMxMi4zMjYsMCwyMy4xMTktNi43MTcsMjguOTIzLTE2LjY5NWgtMTIuMjI4Yy05LjIyOCwwLTE2LjY5NS03LjQ2Ny0xNi42OTUtMTYuNjk1YzAtOS4yMjgsNy40NjctMTYuNjk1LDE2LjY5NS0xNi42OTVoMzMuMzkxCgljOS4yMjgsMCwxNi42OTUsNy40NjcsMTYuNjk1LDE2LjY5NUMyMzMuNzM5LDIyNi4wMjgsMjAzLjc3MiwyNTUuOTk2LDE2Ni45NTgsMjU1Ljk5NnoiLz4KPC9zdmc+Cg==';
    const ICON_GOOGLE_FULL = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBMaWNlbnNlOiBMb2dvLiBNYWRlIGJ5IEhhc2hpQ29ycDogaHR0cHM6Ly9naXRodWIuY29tL2hhc2hpY29ycC9kZXNpZ24tc3lzdGVtIC0tPgo8c3ZnIHdpZHRoPSI4MDBweCIgaGVpZ2h0PSI4MDBweCIgdmlld0JveD0iMCAwIDE2IDE2IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiPjxwYXRoIGZpbGw9IiM0Mjg1RjQiIGQ9Ik0xNC45IDguMTYxYzAtLjQ3Ni0uMDM5LS45NTQtLjEyMS0xLjQyMmgtNi42NHYyLjY5NWgzLjgwMmEzLjI0IDMuMjQgMCAwMS0xLjQwNyAyLjEyN3YxLjc1aDIuMjY5YzEuMzMyLTEuMjIgMi4wOTctMy4wMiAyLjA5Ny01LjE1eiIvPjxwYXRoIGZpbGw9IiMzNEE4NTMiIGQ9Ik04LjE0IDE1YzEuODk4IDAgMy40OTktLjYyIDQuNjY1LTEuNjlsLTIuMjY4LTEuNzQ5Yy0uNjMxLjQyNy0xLjQ0Ni42NjktMi4zOTUuNjY5LTEuODM2IDAtMy4zOTMtMS4yMzItMy45NTItMi44ODhIMS44NXYxLjgwM0E3LjA0NCA3LjA0NCAwIDAwOC4xNCAxNXoiLz48cGF0aCBmaWxsPSIjRkJCQzA0IiBkPSJNNC4xODcgOS4zNDJhNC4xNyA0LjE3IDAgMDEwLTIuNjhWNC44NTlIMS44NDlhNi45NyA2Ljk3IDAgMDAwIDYuMjg2bDIuMzM4LTEuODAzeiIvPjxwYXRoIGZpbGw9IiNFQTQzMzUiIGQ9Ik04LjE0IDMuNzdhMy44MzcgMy44MzcgMCAwMTIuNyAxLjA1bDIuMDEtMS45OTlhNi43ODYgNi43ODYgMCAwMC00LjcxLTEuODIgNy4wNDIgNy4wNDIgMCAwMC02LjI5IDMuODU4TDQuMTg2IDYuNjZjLjU1Ni0xLjY1OCAyLjExNi0yLjg5IDMuOTUyLTIuODl6Ii8+PC9zdmc+';
    const ICON_YANDEX_FULL = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLUxpY2Vuc2U6IE1JVC4gTWFkZSBieSBLZW5hbiBHdW5kb2dhbjogaHR0cHM6Ly9naXRodWIuY29tL2tlbmFuZ3VuZG9nYW4vZm9udGlzdG8tLT4KPHN2ZyBmaWxsPSIjZmZmIiB3aWR0aD0iODAwcHgiIGhlaWdodD0iODAwcHgiIHZpZXdCb3g9Ii01LjUgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cGF0aCBkPSJtNS4yIDI0di03Ljc4NmwtNS4yLTEzLjk2NGgyLjYxNmwzLjgzNCAxMC43NjcgNC40MS0xMy4wMThoMi40MDVsLTUuNjU4IDE2LjMwM3Y3LjY5N3oiLz4KPC9zdmc+Cg==';
    const ICON_SITE_PLACEHOLDER = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLUxpY2Vuc2U6IENDIEF0dHJpYnV0aW9uLiBNYWRlIGJ5IHp3aWNvbjogaHR0cHM6Ly93d3cuendpY29uLmNvbS8tLT4KPHN2ZyBmaWxsPSIjZmZmIiB3aWR0aD0iODAwcHgiIGhlaWdodD0iODAwcHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cGF0aCBkPSJNMy41MTIxMTcxMiwxNSBMOC4xNzE5MDIyOSwxNSBDOC4wNTk0OTE5NywxNC4wNTIzNTA2IDgsMTMuMDQ0NDU1NCA4LDEyIEM4LDEwLjk1NTU0NDYgOC4wNTk0OTE5Nyw5Ljk0NzY0OTQyIDguMTcxOTAyMjksOSBMMy41MTIxMTcxMiw5IEMzLjE4MDQ2MjY2LDkuOTM4MzM2NzggMywxMC45NDgwOTM3IDMsMTIgQzMsMTMuMDUxOTA2MyAzLjE4MDQ2MjY2LDE0LjA2MTY2MzIgMy41MTIxMTcxMiwxNSBMMy41MTIxMTcxMiwxNSBaIE0zLjkzNTUxOTY1LDE2IEM1LjEyNTkwNDMzLDE4LjM5NTM0NDQgNy4zNTIwNzY3OCwyMC4xODUxMTc3IDEwLjAyODAwOTMsMjAuNzgzMjkyIEM5LjI0ODg5NDUxLDE5LjcyMjc3NTEgOC42NTIxNjEzNiwxOC4wMzcxMzYyIDguMzEzNzUwNjcsMTYgTDMuOTM1NTE5NjUsMTYgTDMuOTM1NTE5NjUsMTYgWiBNMjAuNDg3ODgyOSwxNSBDMjAuODE5NTM3MywxNC4wNjE2NjMyIDIxLDEzLjA1MTkwNjMgMjEsMTIgQzIxLDEwLjk0ODA5MzcgMjAuODE5NTM3Myw5LjkzODMzNjc4IDIwLjQ4Nzg4MjksOSBMMTUuODI4MDk3Nyw5IEMxNS45NDA1MDgsOS45NDc2NDk0MiAxNiwxMC45NTU1NDQ2IDE2LDEyIEMxNiwxMy4wNDQ0NTU0IDE1Ljk0MDUwOCwxNC4wNTIzNTA2IDE1LjgyODA5NzcsMTUgTDIwLjQ4Nzg4MjksMTUgTDIwLjQ4Nzg4MjksMTUgWiBNMjAuMDY0NDgwNCwxNiBMMTUuNjg2MjQ5MywxNiBDMTUuMzQ3ODM4NiwxOC4wMzcxMzYyIDE0Ljc1MTEwNTUsMTkuNzIyNzc1MSAxMy45NzE5OTA3LDIwLjc4MzI5MiBDMTYuNjQ3OTIzMiwyMC4xODUxMTc3IDE4Ljg3NDA5NTcsMTguMzk1MzQ0NCAyMC4wNjQ0ODA0LDE2IEwyMC4wNjQ0ODA0LDE2IFogTTkuMTg0NDAyNjksMTUgTDE0LjgxNTU5NzMsMTUgQzE0LjkzNDAxNzcsMTQuMDYyMzg4MiAxNSwxMy4wNTI4MjU2IDE1LDEyIEMxNSwxMC45NDcxNzQ0IDE0LjkzNDAxNzcsOS45Mzc2MTE4MyAxNC44MTU1OTczLDkgTDkuMTg0NDAyNjksOSBDOS4wNjU5ODIyOSw5LjkzNzYxMTgzIDksMTAuOTQ3MTc0NCA5LDEyIEM5LDEzLjA1MjgyNTYgOS4wNjU5ODIyOSwxNC4wNjIzODgyIDkuMTg0NDAyNjksMTUgTDkuMTg0NDAyNjksMTUgWiBNOS4zMzQ5ODIzLDE2IEM5Ljg1NzE3MDgyLDE4Ljk2NzgyOTUgMTAuOTE4MDcyOSwyMSAxMiwyMSBDMTMuMDgxOTI3MSwyMSAxNC4xNDI4MjkyLDE4Ljk2NzgyOTUgMTQuNjY1MDE3NywxNiBMOS4zMzQ5ODIzLDE2IEw5LjMzNDk4MjMsMTYgWiBNMy45MzU1MTk2NSw4IEw4LjMxMzc1MDY3LDggQzguNjUyMTYxMzYsNS45NjI4NjM4MyA5LjI0ODg5NDUxLDQuMjc3MjI0ODYgMTAuMDI4MDA5MywzLjIxNjcwODA0IEM3LjM1MjA3Njc4LDMuODE0ODgyMzQgNS4xMjU5MDQzMyw1LjYwNDY1NTU2IDMuOTM1NTE5NjUsOCBMMy45MzU1MTk2NSw4IFogTTIwLjA2NDQ4MDQsOCBDMTguODc0MDk1Nyw1LjYwNDY1NTU2IDE2LjY0NzkyMzIsMy44MTQ4ODIzNCAxMy45NzE5OTA3LDMuMjE2NzA4MDQgQzE0Ljc1MTEwNTUsNC4yNzcyMjQ4NiAxNS4zNDc4Mzg2LDUuOTYyODYzODMgMTUuNjg2MjQ5Myw4IEwyMC4wNjQ0ODA0LDggTDIwLjA2NDQ4MDQsOCBaIE05LjMzNDk4MjMsOCBMMTQuNjY1MDE3Nyw4IEMxNC4xNDI4MjkyLDUuMDMyMTcwNDggMTMuMDgxOTI3MSwzIDEyLDMgQzEwLjkxODA3MjksMyA5Ljg1NzE3MDgyLDUuMDMyMTcwNDggOS4zMzQ5ODIzLDggTDkuMzM0OTgyMyw4IFogTTEyLDIyIEM2LjQ3NzE1MjUsMjIgMiwxNy41MjI4NDc1IDIsMTIgQzIsNi40NzcxNTI1IDYuNDc3MTUyNSwyIDEyLDIgQzE3LjUyMjg0NzUsMiAyMiw2LjQ3NzE1MjUgMjIsMTIgQzIyLDE3LjUyMjg0NzUgMTcuNTIyODQ3NSwyMiAxMiwyMiBaIi8+Cjwvc3ZnPgo=';

    const TRANSLATION_LANGS = {
        'fr': 'French',
        'en': 'English',
        'es': 'Spanish',
        'de': 'German',
        'it': 'Italian',
        'ru': 'Russian',
        'pt': 'Portuguese',
        'zh-CN': 'Chinese (Simplified)',
        'zh-TW' : 'Chinese (Traditional)',
        'ja': 'Japanese'
    };

    GM_addStyle(`
        #selection-panel {
            position: absolute;
            display: none;
            z-index: 10000;
            background: transparent;
            padding: 5px;
            border-radius: 8px;
            pointer-events: none;
            user-select: none;
            transform: scale(1);
            transform-origin: center bottom;
            white-space: nowrap;
        }
        #selection-panel .action-icon {
            height: ${ICON_HEIGHT};
            width: auto;
            display: flex !important;
            flex-shrink: 0;
            object-fit: contain;
            margin: 2px;
        }
        #selection-panel .action-button {
            width: 74px;
            height: 34px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            transition: 0.3s ease;
            margin-right: 5px;
            pointer-events: auto;
            background: linear-gradient(to bottom right, #2e8eff 20%, rgba(46, 142, 255, 0) 40%);
            background-color: rgba(46, 142, 255, 0.2);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-weight: 600;
            text-align: center;
            padding: 0;
            overflow: hidden;
            box-sizing: border-box;
        }
        #selection-panel .action-button:hover, #selection-panel .action-button:focus {
            background-color: rgba(46, 142, 255, 0.7);
            box-shadow: 0 0 10px rgba(46, 142, 255, 0.5);
            outline: none;
        }
        #selection-panel .action-button-inner {
            width: 70px;
            height: 31px;
            border-radius: 6px;
            background-color: #1a1a1a;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 11px;
            color: #fff;
            text-align: center;
            box-sizing: border-box;
            line-height: 1;
            padding: 0 !important;
        }
        #selection-panel #placeholder-button {
            width: 34px;
            height: 34px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            transition: width 0.3s ease, margin-right 0.3s ease, background-color 0.3s ease;
        }
        #selection-panel .placeholder-expanded {
            width: max-content !important;
            margin-right: 5px;
            pointer-events: auto;
            justify-content: flex-start;
        }
        #selection-panel #placeholder-button .action-button-inner {
            width: 30px;
            height: 31px;
            padding: 0;
            overflow: hidden;
            margin-left: 0.17em;
        }
        #selection-panel #placeholder-button.placeholder-expanded .action-button-inner {
            width: calc(100% - 4px);
            justify-content: flex-start;
            padding: 0;
            gap: 0;
            overflow: visible;
        }
        #selection-panel #placeholder-button-content {
            width: 34px !important;
            height: 25px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 11px !important;
            transform: rotateY(0deg);
            transition: transform 0.3s ease !important;
            user-select: none !important;
            line-height: 1 !important;
            white-space: nowrap !important;
            padding: 0 !important;
            margin: 0 !important;
            transform-origin: center !important;
            flex-shrink: 0 !important;
        }
        #selection-panel .rotated {
            transform: rotateY(180deg) !important;
        }
        #selection-panel #placeholder-actions {
            display: none;
            align-items: center;
            height: 100%;
            transition: opacity 0.1s ease 0.2s;
            flex-shrink: 0;
            gap: 2px;
            padding: 0 5px 0 2px;
        }
        #selection-panel .placeholder-expanded #placeholder-actions {
            display: flex;
        }
        #selection-panel .internal-action-button {
            background: none;
            border: none;
            cursor: pointer;
            color: #fff;
            padding: 0 !important;
            width: 25px;
            height: 25px;
            border-radius: 4px;
            transition: background-color 0.2s ease;
            flex-shrink: 0;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
        }
        #selection-panel .internal-action-button:hover {
            background-color: rgba(255, 255, 255, 0.1);
        }

        #tsab-options-modal {
            position: fixed;
            z-index: 10001;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 700px;
            max-width: 90%;
            height: 90%;
            max-height: 90vh;
            background-color: #161a20;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
            color: #fff;
            padding: 20px;
            display: none;
            flex-direction: column;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }
        #tsab-options-modal .modal-icon-preview {
            height: 25px;
            width: 25px;
            margin-right: 10px;
            flex-shrink: 0;
            object-fit: contain;
        }
        #tsab-options-modal #modal-content-container {
            flex-grow: 1;
            overflow-y: auto;
        }
        #tsab-options-modal #modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #444;
            padding-bottom: 10px;
            margin-top: 0;
        }
        #tsab-options-modal #modal-header h2 {
            margin: 0;
            padding: 0;
            border-bottom: none;
        }

        #tsab-options-modal #close-modal-cross {
            background-color: transparent !important;
            border: none;
            cursor: pointer;
            color: #ff4d4d;
            font-size: 20px;
            height: 40px;
            width: 40px;
            font-weight: 800;
            line-height: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            appearance: none;
            -webkit-appearance: none;
        }
        #tsab-options-modal #close-modal-cross:hover,
        #tsab-options-modal #close-modal-cross:focus,
        #tsab-options-modal #close-modal-cross:active {
            background-color: transparent !important;
            box-shadow: none !important;
            outline: none !important;
            color: #ff4d4d !important;
        }

        #tsab-options-modal input[type="text"],
        #tsab-options-modal button:not(.delete-btn):not(#add-edit-button):not(#close-modal-cross),
        #tsab-options-modal .modal-select {
            width: 97%;
            padding: 0px 10px 0px 10px;
            margin-bottom: 10px;
            border-radius: 8px !important;
            background-color: #2b2f34;
            color: #fff;
            box-sizing: border-box;
            border: 1px solid transparent;
            height: 3em !important;
        }

        #tsab-options-modal #add-edit-button {
            width: 97%;
            background-color: #2e8eff;
            border: none;
            font-weight: 700;
            height: 5vh;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            color: #fff;
            appearance: none;
            -webkit-appearance: none;
        }
        #tsab-options-modal #add-edit-button:hover,
        #tsab-options-modal #add-edit-button:focus,
        #tsab-options-modal #add-edit-button:active {
            background-color: #007bff !important;
            box-shadow: none !important;
            outline: none !important;
            color: #fff !important;
        }

        #tsab-options-modal #tsab-custom-buttons-list {
            list-style: none;
            padding: 10px 20px 10px 0px;
            margin-bottom: 10px;
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 15px;
        }

        #tsab-options-modal input[type="text"]:focus,
        #tsab-options-modal .modal-select:focus {
            outline: none;
            border-color: #2e8eff;
            box-shadow: 0 0 5px rgba(46, 142, 255, 0.5);
        }
        #tsab-options-modal .custom-button-item {
            width: 100%;
            height: 100px;
            background: radial-gradient(150% 120% at 35% 100%, #B7B1FF 20%, rgba(255, 255, 255, 0) 70%), #ffffffc7;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            position: relative;
            cursor: grab;
            user-select: none;
            transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
            font-family: inherit;
        }
        #tsab-options-modal .custom-button-item:hover {
            transform: scale(0.97);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        }
        #tsab-options-modal .custom-button-item.dragging {
            opacity: 0.7;
            transform: scale(1.02);
            border: 1px dashed #2e8eff;
        }
        #tsab-options-modal .card-header {
            padding: 10px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            color: #333;
            height: 60px;
            box-sizing: border-box;
        }
        #tsab-options-modal .card-icon-container {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            box-shadow: inset 0px 0px 6px 0px rgba(0, 0, 0, 0.45);
            flex-shrink: 0;
            margin-right: 10px;
            padding: 0 !important;
            overflow: hidden;
        }
        #tsab-options-modal .card-icon {
            width: 30px;
            height: 30px;
            object-fit: contain;
            display: block;
            margin: 0 auto;
            border-radius: 50%;
        }
        #tsab-options-modal .site-name {
            font-weight: 700;
            font-size: 14px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            flex-grow: 1;
            text-align: right;
            color: #1a1a1a;
        }
        #tsab-options-modal .card-body {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 7px 7px 10px;
            box-sizing: border-box;
            flex-grow: 1;
        }
        #tsab-options-modal .delete-btn {
            background-color: rgba(0, 0, 0, 0.06);
            border: none;
            color: rgba(87, 77, 51, 0.66);
            padding: 8px 12px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 700;
            transition: background-color 0.2s ease, transform 0.1s;
            line-height: 1;
            height: 30px;
            align-self: flex-end;
            margin-left: 10px;
            appearance: none;
            -webkit-appearance: none;
        }
        #tsab-options-modal .delete-btn:hover,
        #tsab-options-modal .delete-btn:focus,
        #tsab-options-modal .delete-btn:active {
            background-color: rgba(255, 0, 0, 0.5) !important;
            box-shadow: none !important;
            outline: none !important;
        }
        #tsab-options-modal .edit-info {
            color: #555;
            font-size: 11px;
            font-weight: 600;
            align-self: flex-end;
            margin-bottom: 5px;
            flex-grow: 1;
            text-align: left;
            cursor: pointer;
            transition: color 0.2s;
        }
        #tsab-options-modal .edit-info:hover {
            color: #2e8eff;
        }
        #tsab-options-modal .move-handle {
            display: none;
        }
    `);

    let panel;
    let modal;
    let editingIndex = -1;
    let draggedItem = null;
    let isModalOpen = false;

    function createIconElement(url, isModalPreview = false) {
        const img = document.createElement('img');
        img.src = url;
        img.className = isModalPreview ? 'modal-icon-preview' : 'action-icon';
        if (url && url.startsWith('http') && !url.includes('data:')) {
             img.onerror = function() {
                 this.src = ICON_DEFAULT_FALLBACK;
                 this.className = isModalPreview ? 'modal-icon-preview' : 'action-icon';
                 this.onerror = null;
             };
        } else if (!url) {
            img.src = ICON_DEFAULT_FALLBACK;
        }
        return img;
    }

    function getQuotedText() {
        const text = window.getSelection().toString().trim();
        return text ? `"${text}"` : '';
    }

    function getRawText() {
        return window.getSelection().toString().trim();
    }

    function createButton(idSuffix, text, iconUrl, onClick) {
        const button = document.createElement('button');
        button.id = `action-button${idSuffix.replace(/\s/g, '-')}`;
        button.className = 'action-button';
        button.title = text;

        const inner = document.createElement('div');
        inner.className = 'action-button-inner';

        const iconElement = createIconElement(iconUrl);
        inner.appendChild(iconElement);

        const textNode = document.createElement('span');
        textNode.textContent = text;
        textNode.style.marginLeft = '2px';
        textNode.style.fontSize = '10px';
        inner.appendChild(textNode);

        button.appendChild(inner);

        const clickHandler = (e) => {
            e.preventDefault();
            e.stopPropagation();
            onClick();
        };

        button.addEventListener('click', clickHandler);
        button.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });

        return button;
    }

    function createInternalActionButton(idSuffix, iconUrl, onClick, title) {
        const button = document.createElement('button');
        button.id = `internal-action-button${idSuffix.replace(/\s/g, '-')}`;
        button.className = 'internal-action-button';
        button.title = title || idSuffix.trim();

        const iconElement = createIconElement(iconUrl);
        button.appendChild(iconElement);

        const clickHandler = (e) => {
            e.preventDefault();
            e.stopPropagation();
            onClick();
        };

        button.addEventListener('click', clickHandler);
        button.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });

        return button;
    }

    function initializePanel() {
        panel = document.createElement('div');
        panel.id = 'selection-panel';
        document.body.appendChild(panel);

        const placeholderButton = document.createElement('button');
        placeholderButton.id = 'placeholder-button';

        let isDraggingPanel = false;
        let dragOffsetX = 0;
        let dragOffsetY = 0;

        placeholderButton.addEventListener('mousedown', (e) => {
            if (e.target.id !== 'placeholder-button-content') return;

            isDraggingPanel = true;

            const rect = panel.getBoundingClientRect();
            dragOffsetX = e.clientX - rect.left;
            dragOffsetY = e.clientY - rect.top;

            e.preventDefault();
            e.stopPropagation();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDraggingPanel) return;

            panel.style.left = `${e.clientX - dragOffsetX}px`;
            panel.style.top  = `${e.clientY - dragOffsetY}px`;
        });

        document.addEventListener('mouseup', () => {
            isDraggingPanel = false;
        });
        placeholderButton.className = 'action-button';

        const placeholderInner = document.createElement('div');
        placeholderInner.className = 'action-button-inner';

        const placeholderContent = document.createElement('span');
        placeholderContent.id = 'placeholder-button-content';
        placeholderContent.textContent = PLACEHOLDER_SYMBOL;

        const placeholderActions = document.createElement('div');
        placeholderActions.id = 'placeholder-actions';

        const googleButton = createInternalActionButton(' Google', ICON_GOOGLE_FULL, () => {
            const text = getQuotedText();
            if (text) {
                window.open(`https://www.google.com/search?q=${encodeURIComponent(text)}`, '_blank');
            }
        }, 'Google Search');

        const yandexButton = createInternalActionButton(' Yandex', ICON_YANDEX_FULL, () => {
            const text = getQuotedText();
            if (text) {
                window.open(`https://yandex.com/search/?text=${encodeURIComponent(text)}`, '_blank');
            }
        }, 'Yandex Search');

        placeholderActions.appendChild(googleButton);
        placeholderActions.appendChild(yandexButton);

        placeholderInner.appendChild(placeholderContent);
        placeholderInner.appendChild(placeholderActions);
        placeholderButton.appendChild(placeholderInner);

        placeholderButton.addEventListener('click', (e) => {
            e.preventDefault();
            placeholderButton.classList.toggle('placeholder-expanded');
            placeholderContent.classList.toggle('rotated');
        });

        placeholderButton.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });

        const braveButton = createButton(' brave', ' Brave', ICON_BRAVE_FULL, () => {
            const text = getQuotedText();
            if (text) {
                window.open(`https://search.brave.com/search?q=${encodeURIComponent(text)}`, '_blank');
            }
            hidePanel();
        });

        const translateButton = createButton(' translate', ' Translate', ICON_TRANSLATE_FULL, () => {
            const text = getRawText();
            const targetLang = getTranslateLanguage();

            if (text) {
                const encodedText = encodeURIComponent(text);
                const translateUrl = `https://translate.google.com/?sl=auto&tl=${targetLang}&text=${encodedText}&op=translate`;
                window.open(translateUrl, '_blank');
            }
            hidePanel();
        });

        panel.appendChild(braveButton);
        panel.appendChild(translateButton);
        panel.appendChild(placeholderButton);

        addCustomButtonsToPanel();
    }

    function getSelectionText() {
        const selection = window.getSelection();
        return selection.toString().trim();
    }

    function hidePanel() {
        if (!panel) return;
        panel.style.display = 'none';

        const placeholder = document.getElementById('placeholder-button');
        const content = document.getElementById('placeholder-button-content');
        if (placeholder && content && placeholder.classList.contains('placeholder-expanded')) {
            placeholder.classList.remove('placeholder-expanded');
            content.classList.remove('rotated');
        }
    }

    function showPanel(range) {
        if (!panel) return;

        const selectedText = getSelectionText();
        if (!selectedText) {
            hidePanel();
            return;
        }

        let rect;
        try {
            rect = range.getBoundingClientRect();
        } catch (e) {
            hidePanel();
            return;
        }

        const scrollX = window.scrollX || window.pageXOffset;
        const scrollY = window.scrollY || window.pageYOffset;

        panel.style.display = 'flex';
        panel.style.visibility = 'hidden';

        let x = rect.left + rect.width / 2;
        let y = rect.top;

        panel.style.left = `${x}px`;
        panel.style.top = `${y}px`;

        requestAnimationFrame(() => {
            const panelWidth = panel.offsetWidth;
            const panelHeight = panel.offsetHeight;

            let finalX = x + scrollX - (panelWidth / 2);
            let finalY = y + scrollY - 10 - panelHeight;

            finalX = Math.max(scrollX + 5, Math.min(finalX, scrollX + window.innerWidth - panelWidth - 5));
            finalY = Math.max(scrollY + 5, finalY);

            panel.style.left = `${finalX}px`;
            panel.style.top = `${finalY}px`;
            panel.style.pointerEvents = 'auto';
            panel.style.visibility = 'visible';
        });
    }

    document.addEventListener('mouseup', (event) => {
        if (isModalOpen) return;

        const selection = window.getSelection();
        const selectedText = selection.toString().trim();
        const modalElement = document.getElementById('tsab-options-modal');

        if (selectedText && !event.target.closest('#selection-panel') && !(modalElement && modalElement.contains(event.target))) {
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                showPanel(range);
            }
        } else if (!event.target.closest('#selection-panel') && !(modalElement && modalElement.contains(event.target))) {
            hidePanel();
        }
    });

    document.addEventListener('scroll', hidePanel, true);
    window.addEventListener('resize', hidePanel);

    function getCustomButtons() {
        return GM_getValue(STORAGE_KEY, DEFAULT_BUTTONS);
    }

    function addCustomButtonsToPanel() {
        const placeholderActions = document.getElementById('placeholder-actions');
        if (!placeholderActions) return;

        placeholderActions.querySelectorAll('.custom-button').forEach(btn => btn.remove());

        const customButtons = getCustomButtons();

        customButtons.forEach((btnConfig, index) => {
            const customButton = createInternalActionButton(` custom-${index}`, btnConfig.iconUrl, () => {
                const text = getQuotedText();
                if (text) {
                    const url = btnConfig.url.replace(/text/g, encodeURIComponent(text));
                    window.open(url, '_blank');
                }
            }, btnConfig.name);
            customButton.classList.add('custom-button');
            placeholderActions.appendChild(customButton);
        });
    }

    function saveCustomButtons(buttons) {
        GM_setValue(STORAGE_KEY, buttons);
        addCustomButtonsToPanel();
        renderCustomButtonsList();
    }

    function saveTranslateLanguage(langCode) {
        GM_setValue(TRANSLATE_LANG_KEY, langCode);
    }

    function getTranslateLanguage() {
        return GM_getValue(TRANSLATE_LANG_KEY, DEFAULT_TRANSLATE_LANG);
    }

    function openOptionsModal() {
        const modalElement = document.getElementById('tsab-options-modal');
        if (modalElement) {
            modalElement.style.display = 'flex';
            isModalOpen = true;
            renderCustomButtonsList();
            document.getElementById('translate-target-lang').value = getTranslateLanguage();
            hidePanel();
        }
    }

    function closeOptionsModal() {
        const modalElement = document.getElementById('tsab-options-modal');
        if (modalElement) {
            modalElement.style.display = 'none';
            isModalOpen = false;
            resetForm();
        }
    }

    function resetForm() {
        document.getElementById('button-name').value = '';
        document.getElementById('button-url').value = '';
        document.getElementById('button-icon').value = '';
        document.getElementById('add-edit-button').textContent = 'Add Button';
        editingIndex = -1;
    }

    function editButton(index) {
        const buttons = getCustomButtons();
        const buttonConfig = buttons[index];

        document.getElementById('button-name').value = buttonConfig.name || '';
        document.getElementById('button-url').value = buttonConfig.url;
        document.getElementById('button-icon').value = buttonConfig.iconUrl || '';
        document.getElementById('add-edit-button').textContent = 'Save Changes';
        editingIndex = index;
    }

    function removeButton(index) {
        if (confirm('Are you sure you want to remove this button?')) {
            const buttons = getCustomButtons();
            buttons.splice(index, 1);
            saveCustomButtons(buttons);
            resetForm();
        }
    }

    function handleAddEditButton() {
        let name = document.getElementById('button-name').value.trim();
        const url = document.getElementById('button-url').value.trim();
        let iconUrl = document.getElementById('button-icon').value.trim();

        if (!url) {
            alert('The URL Template field is mandatory.');
            return;
        }

        if (!name) {
            name = 'Custom Button';
        }
        if (!iconUrl) {
            iconUrl = ICON_SITE_PLACEHOLDER;
        }

        let buttons = getCustomButtons();
        const newButton = { name, url, iconUrl };

        if (editingIndex !== -1) {
            buttons[editingIndex] = newButton;
        } else {
            buttons.push(newButton);
        }

        saveCustomButtons(buttons);
        resetForm();
    }

    function handleDragStart(e) {
        draggedItem = this;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', this.dataset.index);
        setTimeout(() => this.classList.add('dragging'), 0);
    }

    function handleDragEnd() {
        this.classList.remove('dragging');
        draggedItem = null;
        document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
    }

    function handleDragOver(e) {
        e.preventDefault();
        if (draggedItem && draggedItem !== this && this.classList.contains('custom-button-item')) {
             e.dataTransfer.dropEffect = 'move';
        }
    }

    function handleDragEnter(e) {
        e.preventDefault();
        if (draggedItem && draggedItem !== this && this.classList.contains('custom-button-item')) {
            this.classList.add('drag-over');
        }
    }

    function handleDragLeave() {
        this.classList.remove('drag-over');
    }

    function handleDrop(e) {
        e.stopPropagation();
        this.classList.remove('drag-over');

        if (draggedItem && draggedItem !== this) {
            const list = document.getElementById('tsab-custom-buttons-list');
            const items = Array.from(list.children);
            const fromIndex = parseInt(draggedItem.dataset.index, 10);
            const toIndex = parseInt(this.dataset.index, 10);

            if (!isNaN(fromIndex) && !isNaN(toIndex)) {
                let buttons = getCustomButtons();
                const [movedItem] = buttons.splice(fromIndex, 1);
                buttons.splice(toIndex, 0, movedItem);
                saveCustomButtons(buttons);
            }
        }
    }

    function renderCustomButtonsList() {
        const list = document.getElementById('tsab-custom-buttons-list');
        if (!list) return;

        Array.from(list.children).forEach(child => {
            child.removeEventListener('dragstart', handleDragStart);
            child.removeEventListener('dragend', handleDragEnd);
            child.removeEventListener('dragover', handleDragOver);
            child.removeEventListener('dragenter', handleDragEnter);
            child.removeEventListener('dragleave', handleDragLeave);
            child.removeEventListener('drop', handleDrop);
            child.remove();
        });

        list.innerHTML = '';
        const buttons = getCustomButtons();

        buttons.forEach((btn, index) => {
            const listItem = document.createElement('li');
            listItem.className = 'custom-button-item';
            listItem.draggable = true;
            listItem.dataset.index = index;

            listItem.addEventListener('dragstart', handleDragStart);
            listItem.addEventListener('dragend', handleDragEnd);
            listItem.addEventListener('dragover', handleDragOver);
            listItem.addEventListener('dragenter', handleDragEnter);
            listItem.addEventListener('dragleave', handleDragLeave);
            listItem.addEventListener('drop', handleDrop);

            const cardHeader = document.createElement('div');
            cardHeader.className = 'card-header';

            const iconContainer = document.createElement('div');
            iconContainer.className = 'card-icon-container';

            const iconElement = createIconElement(btn.iconUrl, true);
            iconElement.className = 'card-icon';
            iconContainer.appendChild(iconElement);
            cardHeader.appendChild(iconContainer);

            const siteNameSpan = document.createElement('span');
            siteNameSpan.className = 'site-name';
            siteNameSpan.textContent = btn.name || 'No Name';
            cardHeader.appendChild(siteNameSpan);

            listItem.appendChild(cardHeader);

            const cardBody = document.createElement('div');
            cardBody.className = 'card-body';

            const editInfoSpan = document.createElement('span');
            editInfoSpan.className = 'edit-info';
            editInfoSpan.textContent = 'EDIT';
            editInfoSpan.addEventListener('click', (e) => {
                e.stopPropagation();
                editButton(index);
            });
            cardBody.appendChild(editInfoSpan);

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = 'Delete';
            deleteBtn.title = 'Remove this custom button';
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                removeButton(index);
            });
            cardBody.appendChild(deleteBtn);

            listItem.appendChild(cardBody);

            list.appendChild(listItem);
        });
    }

    function createLanguageOptions() {
        let optionsHtml = '';
        for (const code in TRANSLATION_LANGS) {
            optionsHtml += `<option value="${code}">${TRANSLATION_LANGS[code]}</option>`;
        }
        return optionsHtml;
    }

    function initializeModal() {
        modal = document.createElement('div');
        modal.id = 'tsab-options-modal';
        modal.innerHTML = `
            <div id="modal-header">
                <h2>Settings</h2>
                <button id="close-modal-cross" title="Close (ESC)">×</button>
            </div>
            <div id="modal-content-container">
                <label for="translate-target-lang">Default Translation Language:</label>
                <select id="translate-target-lang" class="modal-select">
                    ${createLanguageOptions()}
                </select>

                <h3>Add/Edit Custom Expanded Button</h3>
                <label for="button-name">Name</label>
                <input type="text" id="button-name" placeholder="e.g., DuckDuckGo">

                <label for="button-url">URL (Use 'text' as a placeholder):</label>
                <input type="text" id="button-url" placeholder="e.g., https://duckduckgo.com/?q=text">

                <label for="button-icon">Icon URL (HTTPS/BASE64):</label>
                <input type="text" id="button-icon" placeholder="e.g., https://brave.com/favicon.ico">

                <button id="add-edit-button">Add Button</button>

                <h3>Custom Buttons (Drag to Reorder)</h3>
                <ul id="tsab-custom-buttons-list"></ul>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('add-edit-button').addEventListener('click', handleAddEditButton);
        document.getElementById('close-modal-cross').addEventListener('click', closeOptionsModal);

        document.getElementById('translate-target-lang').addEventListener('change', (e) => {
            saveTranslateLanguage(e.target.value);
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isModalOpen) {
                closeOptionsModal();
            }
        });
    }

    initializePanel();
    initializeModal();
    GM_registerMenuCommand('Settings', openOptionsModal);

})();