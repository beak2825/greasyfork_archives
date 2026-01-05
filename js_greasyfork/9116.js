// ==UserScript==
// @name        YouTube - whitelist channels in uBlock
// @namespace   https://github.com/SivaMachina
// @author      Siva Machina
// @credits     Alex Vallet, Gantt, Gingerbread Man
// @description Helps whitelist YouTube channels in uBlock
// @include     http://*.youtube.com/*
// @include     https://*.youtube.com/*
// @version     1.0
// @grant       none
// @license     http://creativecommons.org/licenses/by-sa/4.0/
// @supportURL  none
// @downloadURL https://update.greasyfork.org/scripts/9116/YouTube%20-%20whitelist%20channels%20in%20uBlock.user.js
// @updateURL https://update.greasyfork.org/scripts/9116/YouTube%20-%20whitelist%20channels%20in%20uBlock.meta.js
// ==/UserScript==

// For static pages
var uo = document.querySelector('#watch7-content link[href*="/user/"]');
var uv = document.querySelector('.yt-user-info > a[href*="/channel/"]');
if (uo) {
  addMenu();
  var ut = uo.href.slice(uo.href.lastIndexOf("/")+1);
  if (location.href.search("&user=") == -1) location.replace(location.href+"&user="+ut);
}
else if (uv) {
  addMenu();
  var ut = uv.textContent;
  if (location.href.search("&user=") == -1) location.replace(location.href+"&user="+ut);
}

// For dynamic content changes, like when clicking a video on the main page.
// This bit is based on Gantt's excellent Download YouTube Videos As MP4 script:
// https://github.com/gantt/downloadyoutube
var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.addedNodes !== null) {
      for (i = 0; i < mutation.addedNodes.length; i++) {
        if (mutation.addedNodes[i].id == "watch7-container") {
          addMenu();
          var uo = document.querySelector('#watch7-content link[href*="/user/"]');
          var uv = document.querySelector('.yt-user-info > a[href*="/channel/"]');
          if (uo) {
            addMenu();
            var ut = uo.href.slice(uo.href.lastIndexOf("/")+1);
            if (location.href.search("&user=") == -1) location.replace(location.href+"&user="+ut);
            break;
          }
          else if (uv) {
            addMenu();
            var ut = uv.textContent;
            if (location.href.search("&user=") == -1) location.replace(location.href+"&user="+ut);
            break;
          } 
        }
      }
    }
  });
});
observer.observe(document.body, {childList: true, subtree: true});

// Add the context menu to the user name below the video
// Only works in Firefox
function addMenu() {

  var uh = document.getElementById("watch7-user-header");
  var menu = document.createElement("menu");
  menu.setAttribute("id", "abpfilter");
  menu.setAttribute("type", "context");
  var mione = document.createElement("menuitem");
  // uBlock is registered under the GPLv3 license 
  mione.setAttribute("label", "Ublock: toggle whitelist filter uBlock"); 
  mione.setAttribute("icon","data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gQ3JlYXRlZCB3aXRoIElua3NjYXBlIChodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy8pIC0tPgoKPHN2ZwogICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgIHhtbG5zOmNjPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyMiCiAgIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyIKICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgd2lkdGg9IjEyOCIKICAgaGVpZ2h0PSIxMjgiCiAgIGlkPSJzdmcyIgogICB2ZXJzaW9uPSIxLjEiCiAgIGlua3NjYXBlOnZlcnNpb249IjAuNDguNCByOTkzOSIKICAgc29kaXBvZGk6ZG9jbmFtZT0idWJsb2NrLnN2ZyIKICAgaW5rc2NhcGU6ZXhwb3J0LWZpbGVuYW1lPSIvaG9tZS9yaGlsbC9wZXJtYWhvbWUvd29ya3Nob3AvdWJsb2NrL3NyYy9pbWcvaWNvbl8xNi5wbmciCiAgIGlua3NjYXBlOmV4cG9ydC14ZHBpPSIxMS4yNSIKICAgaW5rc2NhcGU6ZXhwb3J0LXlkcGk9IjExLjI1Ij4KICA8ZGVmcwogICAgIGlkPSJkZWZzNCI+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDM3NzAiPgogICAgICA8c3RvcAogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojMDAwMDAwO3N0b3Atb3BhY2l0eToxOyIKICAgICAgICAgb2Zmc2V0PSIwIgogICAgICAgICBpZD0ic3RvcDM3NzIiIC8+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiMwMDAwMDA7c3RvcC1vcGFjaXR5OjA7IgogICAgICAgICBvZmZzZXQ9IjEiCiAgICAgICAgIGlkPSJzdG9wMzc3NCIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8aW5rc2NhcGU6cGF0aC1lZmZlY3QKICAgICAgIGlzX3Zpc2libGU9InRydWUiCiAgICAgICBpZD0icGF0aC1lZmZlY3QzOTk1IgogICAgICAgZWZmZWN0PSJzcGlybyIgLz4KICAgIDxyYWRpYWxHcmFkaWVudAogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50Mzc3MCIKICAgICAgIGlkPSJyYWRpYWxHcmFkaWVudDM3NzYiCiAgICAgICBjeD0iODIuMTQ1NDIyIgogICAgICAgY3k9IjgxLjA1NTE5NyIKICAgICAgIGZ4PSI4Mi4xNDU0MjIiCiAgICAgICBmeT0iODEuMDU1MTk3IgogICAgICAgcj0iMjIuNTczMzIzIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgxLDAsMCwxLjI1ODQzMTgsMCwtMjAuOTQ3MjM4KSIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiAvPgogIDwvZGVmcz4KICA8c29kaXBvZGk6bmFtZWR2aWV3CiAgICAgaWQ9ImJhc2UiCiAgICAgcGFnZWNvbG9yPSIjNDA0MDQwIgogICAgIGJvcmRlcmNvbG9yPSIjNjY2NjY2IgogICAgIGJvcmRlcm9wYWNpdHk9IjEuMCIKICAgICBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMCIKICAgICBpbmtzY2FwZTpwYWdlc2hhZG93PSIyIgogICAgIGlua3NjYXBlOnpvb209IjIiCiAgICAgaW5rc2NhcGU6Y3g9Ijc1LjM4MjYyMyIKICAgICBpbmtzY2FwZTpjeT0iMTE1LjEwMjcxIgogICAgIGlua3NjYXBlOmRvY3VtZW50LXVuaXRzPSJweCIKICAgICBpbmtzY2FwZTpjdXJyZW50LWxheWVyPSJsYXllcjEiCiAgICAgc2hvd2dyaWQ9InRydWUiCiAgICAgaW5rc2NhcGU6d2luZG93LXdpZHRoPSIxODA0IgogICAgIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9IjEwMzAiCiAgICAgaW5rc2NhcGU6d2luZG93LXg9IjYiCiAgICAgaW5rc2NhcGU6d2luZG93LXk9IjI1IgogICAgIGlua3NjYXBlOndpbmRvdy1tYXhpbWl6ZWQ9IjAiCiAgICAgZml0LW1hcmdpbi10b3A9IjUiCiAgICAgZml0LW1hcmdpbi1sZWZ0PSI1IgogICAgIGZpdC1tYXJnaW4tcmlnaHQ9IjUiCiAgICAgZml0LW1hcmdpbi1ib3R0b209IjUiCiAgICAgaW5rc2NhcGU6c25hcC1iYm94PSJ0cnVlIgogICAgIHNob3dndWlkZXM9InRydWUiCiAgICAgaW5rc2NhcGU6Z3VpZGUtYmJveD0idHJ1ZSIKICAgICBzaG93Ym9yZGVyPSJ0cnVlIgogICAgIGlua3NjYXBlOnNob3dwYWdlc2hhZG93PSJmYWxzZSIKICAgICBib3JkZXJsYXllcj0iZmFsc2UiPgogICAgPGlua3NjYXBlOmdyaWQKICAgICAgIHR5cGU9Inh5Z3JpZCIKICAgICAgIGlkPSJncmlkMzA1OSIKICAgICAgIGVtcHNwYWNpbmc9IjgiCiAgICAgICB2aXNpYmxlPSJ0cnVlIgogICAgICAgZW5hYmxlZD0idHJ1ZSIKICAgICAgIHNuYXB2aXNpYmxlZ3JpZGxpbmVzb25seT0idHJ1ZSIKICAgICAgIGRvdHRlZD0iZmFsc2UiIC8+CiAgPC9zb2RpcG9kaTpuYW1lZHZpZXc+CiAgPG1ldGFkYXRhCiAgICAgaWQ9Im1ldGFkYXRhNyI+CiAgICA8cmRmOlJERj4KICAgICAgPGNjOldvcmsKICAgICAgICAgcmRmOmFib3V0PSIiPgogICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2Uvc3ZnK3htbDwvZGM6Zm9ybWF0PgogICAgICAgIDxkYzp0eXBlCiAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vcHVybC5vcmcvZGMvZGNtaXR5cGUvU3RpbGxJbWFnZSIgLz4KICAgICAgICA8ZGM6dGl0bGU+PC9kYzp0aXRsZT4KICAgICAgICA8ZGM6ZGVzY3JpcHRpb24+VXNlIGdyYXkgNTAlIGZvciB0aGUgJnF1b3Q7b2ZmJnF1b3Q7IGNvbG9yPC9kYzpkZXNjcmlwdGlvbj4KICAgICAgPC9jYzpXb3JrPgogICAgPC9yZGY6UkRGPgogIDwvbWV0YWRhdGE+CiAgPGcKICAgICBpbmtzY2FwZTpsYWJlbD0icG9seWdvbiIKICAgICBpbmtzY2FwZTpncm91cG1vZGU9ImxheWVyIgogICAgIGlkPSJsYXllcjEiCiAgICAgc3R5bGU9ImRpc3BsYXk6aW5saW5lIgogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xNy44NzI1NDgsLTE3LjMyNTM1KSI+CiAgICA8cGF0aAogICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIKICAgICAgIGlkPSJwYXRoMzc4OCIKICAgICAgIGQ9Im0gMTkuMzcyNTU0LDU0LjEwNzYxMiAwLDU0LjQzNTQ4OCAzNS4yODIyNTUsMzUuMjgyMjQgNTQuNDM1NDkxLDAgMzUuMjgyMjQsLTM1LjI4MjI0IDAsLTU0LjQzNTQ4OCAtMzUuMjgyMjQsLTM1LjI4MjI1NiAtNTQuNDM1NDkxLDAgeiIKICAgICAgIHN0eWxlPSJmaWxsOiM4MDAwMDA7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOiNmZmZmZmY7c3Ryb2tlLXdpZHRoOjMuMDAwMDEyODY5OTk5OTk5OTQ7c3Ryb2tlLWxpbmVjYXA6YnV0dDtzdHJva2UtbGluZWpvaW46bWl0ZXI7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2Utb3BhY2l0eToxO3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtkaXNwbGF5OmlubGluZSIKICAgICAgIHNvZGlwb2RpOm5vZGV0eXBlcz0iY2NjY2NjY2NjIgogICAgICAgaW5rc2NhcGU6ZXhwb3J0LWZpbGVuYW1lPSIvaG9tZS9yaGlsbC9wZXJtYWhvbWUvd29ya3Nob3AvdWJsb2NrL3BsYXRmb3JtL2Nocm9taXVtL2ltZy9icm93c2VyaWNvbnMvaWNvbjM4LW9mZi5wbmciCiAgICAgICBpbmtzY2FwZTpleHBvcnQteGRwaT0iMjYuNzE5OTk5IgogICAgICAgaW5rc2NhcGU6ZXhwb3J0LXlkcGk9IjI2LjcxOTk5OSIgLz4KICAgIDxnCiAgICAgICB0cmFuc2Zvcm09InNjYWxlKDAuOTUwMjk1MzksMS4wNTIzMDQ0KSIKICAgICAgIHN0eWxlPSJmb250LXNpemU6MTAwLjIxOTQ1OTUzcHg7Zm9udC1zdHlsZTpub3JtYWw7Zm9udC12YXJpYW50Om5vcm1hbDtmb250LXdlaWdodDpub3JtYWw7Zm9udC1zdHJldGNoOm5vcm1hbDt0ZXh0LWFsaWduOmNlbnRlcjtsaW5lLWhlaWdodDoxMjUlO2xldHRlci1zcGFjaW5nOjBweDt3b3JkLXNwYWNpbmc6MHB4O3RleHQtYW5jaG9yOm1pZGRsZTtmaWxsOiNmZmZmZmY7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOiNmZmZmZmY7c3Ryb2tlLXdpZHRoOjEuOTk5OTk5NzY7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2Utb3BhY2l0eToxO2ZvbnQtZmFtaWx5OlVidW50dTstaW5rc2NhcGUtZm9udC1zcGVjaWZpY2F0aW9uOlVidW50dSIKICAgICAgIGlkPSJ0ZXh0MzgzMiI+CiAgICAgIDxwYXRoCiAgICAgICAgIGQ9Im0gMTEwLjM1Nzg0LDEwMi4yMzU4NiBjIC0yLjQ1NzUxLDAuNTM2MjUgLTUuNzAzNDUsMS4xMDQ2MiAtOS43Mzc4MiwxLjcwNTA5IC00LjAzNDQ2NSwwLjYwMDQ4IC04LjcwMjU5MywwLjkwMDcyIC0xNC4wMDQzOTgsMC45MDA3MiAtNC42MTAxMjUsMCAtOC40OTAzNjIsLTAuNTg0MTcgLTExLjY0MDcyNSwtMS43NTI1IC0zLjE1MDQwNywtMS4xNjgzMyAtNS42ODU4NCwtMi44MjE5MyAtNy42MDYzMDUsLTQuOTYwODA5IC0xLjkyMDQ5NCwtMi4xMzg4NzIgLTMuMzAzNDA2LC00LjY2MTA3NSAtNC4xNDg3MzUsLTcuNTY2NjE4IC0wLjg0NTM1LC0yLjkwNTUxNiAtMS4yNjgwMTksLTYuMTI5MTI1IC0xLjI2ODAxLC05LjY3MDgzNSBsIDAsLTI5LjI2MzI5OSAxMC43MTc0MTYsMCAwLDI3LjI2MDAxMSBjIC0xLjllLTUsNi4zNDUyOTMgMS4xNTI1MDQsMTAuODg3NjA0IDMuNDU3NTcyLDEzLjYyNjk0NyAyLjMwNTAyMiwyLjczOTM2NSA2LjE4NTg0Niw0LjEwOTA0MSAxMS42NDI0ODMsNC4xMDkwMzQgMS4xNTEzMTYsN2UtNiAyLjM0MTk0NCwtMC4wMzMxMyAzLjU3MTg4NiwtMC4wOTk0IDEuMjI5ODY3LC0wLjA2NjI2IDIuMzgyMzksLTAuMTQ5MzQ4IDMuNDU3NTcyLC0wLjI0OTI2NSAxLjA3NTA5OCwtMC4wOTk5IDIuMDU0Njg1LC0wLjIwMDMyMSAyLjkzODc2LC0wLjMwMTI1NyAwLjg4Mzk4NiwtMC4xMDA5MjIgMS41MTgyODQsLTAuMjE3NjUyIDEuOTAyODk2LC0wLjM1MDE5NCBsIDAsLTQzLjk5NTg3NyAxMC43MTc0MDgsMCB6IgogICAgICAgICBzdHlsZT0iZmlsbDojZmZmZmZmO3N0cm9rZTojZmZmZmZmO3N0cm9rZS13aWR0aDoxLjk5OTk5OTc2O2ZvbnQtZmFtaWx5OlVidW50dTstaW5rc2NhcGUtZm9udC1zcGVjaWZpY2F0aW9uOlVidW50dSIKICAgICAgICAgaWQ9InBhdGgyOTkzIgogICAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIiAvPgogICAgICA8dGV4dAogICAgICAgICB4bWw6c3BhY2U9InByZXNlcnZlIgogICAgICAgICBzdHlsZT0iZm9udC1zaXplOjQwcHg7Zm9udC1zdHlsZTpub3JtYWw7Zm9udC13ZWlnaHQ6bm9ybWFsO2xpbmUtaGVpZ2h0OjEyNSU7bGV0dGVyLXNwYWNpbmc6MHB4O3dvcmQtc3BhY2luZzowcHg7ZmlsbDojMDAwMDAwO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lO2ZvbnQtZmFtaWx5OlNhbnMiCiAgICAgICAgIHg9Ijk1LjUiCiAgICAgICAgIHk9IjkwLjUiCiAgICAgICAgIGlkPSJ0ZXh0Mjk5MiIKICAgICAgICAgc29kaXBvZGk6bGluZXNwYWNpbmc9IjEyNSUiCiAgICAgICAgIHRyYW5zZm9ybT0ibWF0cml4KDEuMDUyMzA0NCwwLDAsMC45NTAyOTUzNywxOC44MDczNjEsMTYuNDY0MikiPjx0c3BhbgogICAgICAgICAgIHNvZGlwb2RpOnJvbGU9ImxpbmUiCiAgICAgICAgICAgaWQ9InRzcGFuMjk5NCI+PC90c3Bhbj48L3RleHQ+CiAgICAgIDxwYXRoCiAgICAgICAgIHNvZGlwb2RpOnR5cGU9ImFyYyIKICAgICAgICAgc3R5bGU9ImZpbGw6bm9uZTtzdHJva2U6I2ZmZmZmZjtzdHJva2Utd2lkdGg6NC4wNDUyMDA4MjtzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1vcGFjaXR5OjE7c3Ryb2tlLWRhc2hhcnJheTpub25lIgogICAgICAgICBpZD0icGF0aDI5OTYiCiAgICAgICAgIHNvZGlwb2RpOmN4PSI5OCIKICAgICAgICAgc29kaXBvZGk6Y3k9IjkwIgogICAgICAgICBzb2RpcG9kaTpyeD0iNi4wMDAwMDI0IgogICAgICAgICBzb2RpcG9kaTpyeT0iMTAiCiAgICAgICAgIGQ9Ik0gMTA0LDkwIEEgNi4wMDAwMDI0LDEwIDAgMSAxIDkxLjk5OTk5OCw5MCA2LjAwMDAwMjQsMTAgMCAxIDEgMTA0LDkwIHoiCiAgICAgICAgIHRyYW5zZm9ybT0ibWF0cml4KDAuOTY0NjExNTcsMCwwLDAuNTcwMTc3MjQsMjUuMjk2NjQ0LDQ5LjI0OTM4OCkiIC8+CiAgICA8L2c+CiAgPC9nPgogIDxnCiAgICAgaW5rc2NhcGU6Z3JvdXBtb2RlPSJsYXllciIKICAgICBpZD0ibGF5ZXI1IgogICAgIGlua3NjYXBlOmxhYmVsPSJ0ZXh0IgogICAgIHN0eWxlPSJkaXNwbGF5OmlubGluZSIKICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTcuODcyNTQ4LC0xNy4zMjUzNSkiIC8+Cjwvc3ZnPgo=");
  menu.appendChild(mione);
  document.body.appendChild(menu);
  uh.setAttribute("contextmenu","abpfilter");

  function abpShowFilter() {
    var fpo = "*youtube.com/*&user=";
    var fpt = "*";
    if (uo) var ut = uo.href.slice(uo.href.lastIndexOf("/")+1);
    else if (uv) var ut = uv.textContent;
    var ffl = fpo+ut+fpt;
    var wh = document.getElementById("watch8-action-buttons");
    var wlf = wh.parentNode.querySelector("#whitelistfilter");
    if (!wlf && ffl) {
      var div = document.createElement("div");
      div.setAttribute("id","whitelistfilter");
      div.innerHTML = "Add the following filter to uBlock:";
      var textarea = document.createElement("textarea");
      textarea.setAttribute("style", "display: block; font-family: monospace");
      textarea.setAttribute("spellcheck","false");
      textarea.setAttribute("rows","1");
      textarea.setAttribute("cols",ffl.length);
      textarea.innerHTML = ffl;
      div.appendChild(textarea);
      wh.parentNode.appendChild(div);
      textarea.focus();
    }
    else wh.parentNode.removeChild(wlf);
  }

  mione.addEventListener("click",abpShowFilter,false);

}