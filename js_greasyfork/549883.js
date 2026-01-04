// ==UserScript==
// @name        Flight Rising: Forum & BBCode Tweaks
// @namespace   https://github.com/dragonjpg
// @author      dragon.jpg
// @description Adds more button to the BBCode tag bar across the site, quick ping buttons to posts, and allows you to bookmark threads to quickly return to later. Optionally can also keep track of subscribed threads and add buttons to quickly jump to a user's avatar dragon, den, or to begin a forum search for posts by them. Supports settings backups via JSON. The settings menu can be found on the index page of the forums.
// @match       https://*.flightrising.com/dragon/*
// @match       https://*.flightrising.com/clan-profile/*
// @match       https://*.flightrising.com/forums*
// @match       https://*.flightrising.com/msgs/*
// @grant       none
// @version     1.0.1
// @license     MIT
// @icon        https://www.google.com/s2/favicons?sz=64&domain=flightrising.com
// @downloadURL https://update.greasyfork.org/scripts/549883/Flight%20Rising%3A%20Forum%20%20BBCode%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/549883/Flight%20Rising%3A%20Forum%20%20BBCode%20Tweaks.meta.js
// ==/UserScript==

'use strict';

// ---- CONSTANTS ------------------------------------------ //
// unique prefix for local storage
const LOCAL_STORAGE_PREFIX = `fr-fbtweaks`;

// BASE 64 IMAGE ASSETS
const ASSETS = {
  settings : "data:image/png;base64,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",
  threadlist : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC8AAAAvCAMAAABE+WOeAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAjdQTFRFAAAAqqqAhYJ6hoF5hoF5hYF6hYF5hYF6hoF6h4F7h4F7hoF5hoN5qqqqhoJ7paKcy8nG7+/u/Pz7////+fn46+vpysnFyMfDycfEhoN54+Lh/v7+8e7s6+fk7ern9PHwhoF5ysjF9PLx6eXh6ubihYJ6h4R76ubj6eXg6OTe6OTfhYJ6hoJ6zczI7Ojl6eTg6OPezszJhYJ6hYJ68O/u8u/u9fPx+fj4//7+/f38/f399/X08u/thoJ5+/v77enl6+fj8O3r1NHPm5WQd29oe3NsbGVf0M7MoZyXeXFqrKej6uXitrKuenJs/Pz81NHQoZuW4d/d9fTy09HOfHRt1dPR2NbU6eXi+/r5kouG1tTSn5qV19XTenJr6OTg3tza1dLQ3dvZwLy55+Pdw8C9o52Z+vr65+LcxcG+qaSgkIqEgnt05+Pe6OPd5uLb5uLc5uHa5eHa5eDZ5uHb5eHZ5ODX5eDY5N/W49/V5ODY393b5ODW497V5N/Xq6ah9fPw497U5uXkopyX7uzn4t3TzcrH+Pf1+Pf0+Pb0qqWg49/W/fz8gnp0ubWx6eTe4t3S4t7T9vXyop2YeHBplpCLmZOOhn95+ff14dzR7+3o6Ofl6ujn6Obl4dzQ4d3R4t7U5uPa9/b08/Lxy8jGu7ezz83KhoJ5+Pj44t3U5+Lb5+TbhoF57Ozr6+jg4NvP7+zm4d3S4t3R7evk4dzSkpKS5OPh4NvQhYF6ycjEhoJ5hoF6h4F7hoJ5R03qiAAAAL10Uk5TAAZWpt/5//PXVVHbUgOJ/////////////1T////////j/////+Rb/////1yr//////+s4P////////////j///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////L/////2f//////////B///iv+TlFP6BSSdMAAAA6tJREFUeJyNlmlIVFEUgM9Jm0VzK2eaScsMR1usaKUIwaDCAstKqLAdM4J2ox2CaKcSClpMs9T80ULZooYUZAsUFWT1w8xs0coZW13eqKOve+6bOznjvOzCe+edM989c+65757zEGggH6A6ENs0dpk/0c0P29RZMXpio8IHoB303fnHFgl0cgPxgXYIcfyH/++g+8148zcIbQHdv9wz/ywWbT30+YIY8TnsNwR1XYAGsKWz+18QWBvxFqPf630Z7tfVJbs6ZKE20wSHZMHYNzGfwQ88eK0IT7a7JjTDgNexOObliOpBX514EL4lYcE3ih5TATAYbQpvehdZPhzjHk9gs2rI1L+pyutqh/AJZvmV3CijBgIgFNoJL4eRShj4fJiOxNNxDrZNLwbWkdEH6oHln/iQGDLYqiY6g9U/mtTMhP+DONrSgLIQxfzDxVMaRt6L/wUuXkP+73K+950p3PrMxQeTOq50mk3k+klMP9qB2wkUiak4WDH/FLyBtAb7aJFtcxH378H3tLl4LdtJG4wCFf8Gxezi+45l2i11Plwx1wjeSFmsc+MtlRWJrYLvq5jrBN+/1Z1n+Xk4EwsBnPnx5JOeMe1TZ/8wu7YtEq84/RsVs1XwyXRcrv3lIQor2T26zlTB/S8AeMD+rEDwKU0evNswFSdx2Stf8Iskpl7ujve/IPjFHUzNV+eTlSzkuXh6PS+o8wu57JEr+CWU/3PqfAqXmhzBL6fTnqfOL1L4bMGnUjw56vxiLn3PCn4FVY7zavz408u41J4S/Cris73z5sjs1Ab+5H9C8GukHgCZxBsGH+sMrysDy0VY38yVjizBb7CzBJ0gfvLRdP4bIp2dw+y8Tz20WsHBcNDFO9gGhx7YVgLT94GHf8YH/eCKfFLwO5G90Nrdu67DLPeyK5XAnDMf97zniv644PdK31j52b7/huRtxfO2buGyNcONZxPi4wu98PO3rOIyfIfgD/EoEDdmeOkCuDadjp9DZ95MfMHS86tTI3nFwKoj3uJJj6LjAS3aTVQ/L6UUrMzED03eSLcxVE6j+szr/xmw1neDhxpX8PrP+0sW7Y7V5E5Ud1YGtWMq7y+sfwW3Q47SIK1hdK9lV5jb1Fow+i4Dn58RGQj6drjKXthMm9FLFDpW4XVgtxrSAHJng4/E8lc8C66ndLtc1h2hcDrv75cTQT+gJu6hOjvpfvhHCW7ObVC+H0qT/uf7IfALOL83AC29yktmqLNFCSMaK3l3+APwaVPAyAgsAgAAAABJRU5ErkJggg==",
  watch : "data:image/png;base64,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",
  unwatch : "data:image/png;base64,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"
}

// NEW BBCODE TAGS TO ADD
// images are so small we can use base64 so we don't have to load any external resources :)
const BBCODE_TAG_LIST = [
  {
    tag : "size",
    title: "Size",
    prompt : "Enter Size (0-7):",
    src : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAMAAADzapwJAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAH5QTFRF////d3d3AAAAh4eH9vb2Nzc3UVFR/Pz8BgYGFBQU9/f3QkJCYGBgAQEB+vr6CwsLR0dHdnZ2LS0tMzMz+/v7BwcHJSUlOzs7/v7+GRkZPT097+/vERERREREampqISEhJycnOjo639/fHBwcMjIy7e3tKSkp3t7eHh4eNDQ0keobGgAAAJJJREFUeJxjZMAKGKkkzAiTYvzLwMDCyMj4EyzM8QsqzP6dgYsRiL+AhZm4P/N9YfvB8o/3I4PAJ6A0/3uQsBDjW5F3wq8ZxBhfSjC+BApLPINaCVINMUj6udQTuEsGUlj2KZCQeYQmLMH+GMT7ABFWeAQk5O8DCSXG+0B8GyKsdgdIiII8yKDOyPjnNvWiARsAAMMlOxe2AGyyAAAAAElFTkSuQmCC",
    prepend : true,
    type: 2
  },
  {
    tag : "color",
    title: "Color",
    prompt : "Enter Color:",
    src : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAMAAADzapwJAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAP9QTFRF////WVlZJSUl5+fntra2nZ2d+vr6V1dXAAAAKCgo7Ozs/v7+Z2dnMzMz7u7u8/PzPj4+MjIyXV1dRUVFLCws6urq+Pj4Q0NDJycn6Ojo+/v7SEhI6enpTk5OKSkp7e3t+fn5QkJCISEh4eHh/Pz8U1NTExMTMTExNTU1GRkZWlpaHR0d29vb9PT0SkpKFRUV9/f39vb2PT09e3t7o6Oj5OTkbGxsfX19UVFRXFxcgICAGBgYa2tr2tra9fX15eXl4+PjDg4OEhIS1tbWdHR0yMjIDAwMDw8P0dHRBgYGr6+vCgoKzMzMcnJyODg4w8PDCAgIx8fHy8vLycnJAQEBFG6EXwAAAONJREFUeJxjZMAKGKkmzMjI+JeBgYWR8ReKMDsjCPxhYGX8hCzMz/iDk/HbL8GvPIyvkc0WY/zIIADU8PaX1BMkYSnm10CphwqMz6UY78KFVRgfywEFb4B0KX54DhPWuqcMtvQCgyHjNe2zUGGTK4w6p6FOMLukfxIqbHHBEOar/+eN78EMsTmD8J46HyPjQYiwA+NxmKgV416Xk/++Qqx0ZTwEEbVn3GHPtd9pG9Tdrmx7QZQd2xYG390MbptgIejPuIOBwZltPQOD6mMGq33wgA06aHzWfh2QEfxOeONv6sQOAFbNPRePoS6cAAAAAElFTkSuQmCC",
    prepend : true,
    type: 2
  },
  {
    tag : "font",
    title: "Font",
    prompt : "Enter Font:",
    src : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAMAAADzapwJAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAI1QTFRF////+Pj4Ozs7PDw8pqamAAAARkZG5eXlAQEBhoaGDAwMh4eHISEhYGBgxsbGwMDAx8fHZmZmICAg/v7+aGho9/f3CwsLgICAEBAQ+vr6oaGhv7+/qKioSUlJAgIC6urqiYmJ4ODgJiYmRERE8/Pz8vLyKCgo4eHhHh4eampqIiIiDg4Orq6uCgoKb29vBU3rhwAAALtJREFUeJyd0WkLgkAQBuAZKu2wpEJMgkCoyP//TyI6oKAyiCg6SCuP3GYTyaNPzodl99lheJdF+FuYkxExYFkuIjA/ywIDdDMs4hsKzElzxS+BJ9hplpwyvEQrxY0nVOEBtWuSm1adktzlU4IVvLQOoJ7buI8zhVao+wjqLs5C9L6OGWMeOiwNNz+m0DIfqt287jpi3RXNHi5pNwi2ui0tQh6taOnPvjH53TRkgxqHOOGBjDkdx/l/J1Ef8m81F83+da4AAAAASUVORK5CYII=",
    prepend : true,
    type: 2
  },
  {
    tag : "spoiler",
    title: "Spoiler",
    src : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAMAAADzapwJAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAM9QTFRF////Ly8vjIyMpKSkBQUFTk5O8PDwlJSUBgYGAAAAVFRU/v7+zMzMGxsbISEhExMTgICAZWVlOjo6f39/9fX17OzsPz8/Xl5el5eXrKysMjIyLCws/f39d3d3ioqKU1NT4ODg3Nzcra2tCwsLZGRkNzc32NjYJSUlcnJy9PT0TExMmJiYhoaGAgICXV1d+fn56enpfX19vb29MzMz5ubmn5+fnZ2d4+PjFRUVwsLCFxcX8vLy+Pj4BAQEkZGRx8fHQEBAb29vAwMDbW1tycnJTiBy4AAAAK1JREFUeJxjZMAKGKkkzMj4D5swMyMYwAQYv0IN4QEK/mdiYPzBycjw+zf3G5jZooyf+V4ySHwUeM4gxfgUYaUM4xvRR/Kv/v5iUGC8j+wSJUbG12K3MR2oxvhI/gYWd2sy3lO+iimsfVUH6KKLaMIGNzXOG91VYTyDKmx6RfcUg/kpc8bjSMLC34CEIeNRm0/8jIcQwvaM14Cm7wey2K0Z92ILQZePp6kXDdgAAOpQKxe4Kac1AAAAAElFTkSuQmCC",
    prepend : false,
    type: 1
  },
  {
    tag : "sup",
    title: "Superscript",
    src : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAMAAADzapwJAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAANVQTFRF////5ubmh4eHsbGx2dnZBwcHAAAAGRkZ4uLiCQkJDw8POjo66+vrs7OzkJCQz8/PLy8vS0tLERERhISE9fX1n5+flZWV/v7+Q0NDHR0dycnJqqqqCwsL39/fcnJyCAgI2NjYi4uLAQEBx8fH3t7eISEh+fn5KioqJycnBQUFdnZ28PDwMzMza2tr0tLSBgYGLS0t+/v7Xl5esLCwTU1Nd3d3cHBw8vLywMDAnp6ewcHBHBwcvr6+8/Pze3t7LCwscXFxbW1tPz8/dXV14ODgU1NTrq6uwGXS2QAAANJJREFUeJxjZMAKGDEEGBn/YgqzAIV/YgpzMP5l+QYR5v7NyPoFSPP+ZOD4xP8dJizwjYH7PZAp+IWB9y1CWITxI4PAK3HGd8KMzxikX4sxPoaaLfdCkpHxqQzjXQaVRwwM8rehwmqM95UY76pcY2DQZrzFoH4Z5hI9xusMWoznMbxjdIVB9yyGL8Gqv91CEwaarXf5v/5pNGGzC8JyjOdALkESVhE9y2ByDOhKU0bGwwhhybcMFoeAJkkeZ7A6gBB2ZGR8B3KbCzCYduEIb9oLAwDorToXi8UCmAAAAABJRU5ErkJggg==",
    prepend : false,
    type: 1
  },
  {
    tag : "sub",
    title: "Subscript",
    src : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAMAAADzapwJAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAANVQTFRF////Ojo6AAAAGRkZ6+vrs7OzkJCQLy8vS0tL5ubmERERhISE9fX1n5+flZWV/v7+Q0NDHR0dycnJcnJyCAgI2NjYi4uLAQEBx8fH+fn5KioqJycnBQUFdnZ20tLSBgYGLS0t+/v7Xl5esLCwh4eHsbGxTU1Nd3d32dnZBwcHcHBw8vLywMDA4uLiCQkJDw8P3t7enp6ewcHBHBwcvr6+8/Pzz8/Pe3t7LCwscXFxbW1tPz8/dXV14ODgU1NTrq6uqqqqCwsL39/fISEh8PDwMzMza2trhIE6HwAAAMxJREFUeJxjZMAKGKklzAgEf4A0618Gll8IYfbfDGw/GBg4GX8wcH5FCPMwfmXg+cTPCETvUMwWfi/EyPhGlPEFqpWSjC8kGZ9JP0Z3iRzjYyC+j+FApQcMincx3A1W/fM5kMUpzXgbyWyVu/9VbzIwaDDeZPwLE9a6wS/FeA3kEl3GK7oXIcIGjBcZDM4BXWnIyHja7AxMWPAjg+lJoEnypxjMjyOErRgZn4LcZsv4l+WgwyF7xn0YIWhwiYHBcS+GsAvjXgaXXdSJHQCOGzoXYsiYnQAAAABJRU5ErkJggg==",
    prepend : false,
    type: 1
  },
  {
    tag : "columns",
    title: "Table",
    prompt : "Enter Number of Columns (1-6):",
    src : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAMAAADzapwJAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAFRQTFRF////rq6uJiYmAAAANjY2zMzMGhoaTExMMDAwCwsLCgoKCQkJ6urq1dXVAgIC29vbycnJFhYWt7e3MjIyLy8vY2Nj1tbWZmZmPz8/QEBAeXl56OjotZuPCgAAAGJJREFUeJxjZMAKGKklzMiILMnI+BsizPYXRSXLT4gwM6oBrD9gwmwgzT/BFNMPhDDIFJ7vzL+AFO+3wSfM95UH5O7PfP9Aaj4KvIUIi7xH8aXQa4iwGHJQAcPtKRWjAQsAAMyHMhexonoAAAAAAElFTkSuQmCC",
    prepend : false,
    type: 2
  },
  {
    tag : "hidden",
    title: "Hidden",
    prompt : "Hidden Title (Leave Blank for Default Title)",
    src : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAMAAADzapwJAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAVZQTFRF////7e3tZGRkFBQUAAAAYmJiaGhoFxcXAQEBAgICERERBAQEBQUFBgYG2traICAgqamp1dXVv7+/39/fGBgYZmZm9/f3xsbGQ0NDDQ0NU1NT5+fn6OjoOjo6GRkZBwcHc3Nzzc3N1tbWmJiYMDAwwsLC/Pz8cHBwDg4Ovb29ampqJSUloKCgwcHBra2tbW1tq6urCgoKKSkpgoKCDw8Prq6uo6OjISEh9vb2mpqa19fXJCQkMjIy+fn5h4eHPj4+QEBAf39/wMDA2NjYlpaW8/PzUlJSLi4ukZGRHR0dS0tLWlpaRERE/v7+7u7ukpKSjIyMSEhI3d3dCQkJ0NDQ7OzsgYGBpaWlAwMDW1tbxcXFFRUVdHR0fn5+ycnJEhISi4uL3Nzc6enp3t7eNDQ0KioqdnZ2VFRUFhYW+/v7bm5uGxsbzs7Or6+ve3t7iIiIl5eXODg47MP6QwAAAQ9JREFUeJxjZMAKGBkYgQBF6D8QMDKw/sdQy/SLkYH9Lwua6j9s3xgZWBjYQcKMEE2M/xn//2D4AxLm+oSimu8bRJib8QOQJ8jI+BZFmIcF5Jo3DAyijIxPEcJcfCBhxq88jIz3lW4jhD+pgYQfKDJeUf7DdxkurMB40YDxsh5Q6rQZI+M1qDAvr/RxBiuwQQcZHBjPQoXtDtnvVZUHC29nUNA6AjPEFijwWG5jwE6P9UGMjLtgwu73lVaFA50IdOB5o8UIl8QBvfLtvP98aSYm53kIYYZkoDG31RiPgIxbhBBmyGRhvMOo8ngdg8CvtCkQ4ZxLyCElevIJSJjtH9ZoCD3xHE009+4mRgylYAAAEi9kF6wxwu4AAAAASUVORK5CYII=",
    prepend : false,
    type: 2
  },
  {
    tag : "rule",
    title: "Horizontal Rule",
    src : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWBAMAAAA2mnEIAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAACFQTFRF////oqKiOTk5MzMzpKSkDg4OAAAAUFBQ3NzcbGxsZWVlxXi5VAAAAC9JREFUeJxjZEAARpqzhRQhrI93GBnCBCDs/7MZGco+QFXMZGTohKp5l0F79yAAAB6uCBfXxtvzAAAAAElFTkSuQmCC",
    prepend : false,
    type: 3
  }
];

// -- END -------------------------------------- //

// MAIN
function FBTinit() {
  console.log("[FR: FORUM & BBCODE TWEAKS] by dragonjpg\n\tabout & help: https://github.com/dragonjpg/flight-rising-misc");

  // set up defaults on first run
  if(localStorage.getItem(`${LOCAL_STORAGE_PREFIX}-setup`)  == null) { firstRun(); }

  // most areas use a textarea called message...
  var textarea_to_affect = 'message',
      element_to_wait_for = '#bbcode-tag-bar',
      repeat = false;

  // ...except for clan profiles, which use one named clan_bio. we must also wait until the modal is dynamically added to the page.
  if (/clan-profile/.test(window.location.href)) {
    textarea_to_affect = 'clan_bio';
    element_to_wait_for = '.ui-dialog:not([style*="display: none"]):has(#bbcode-tag-bar) #bbcode-tag-bar';
    var recursive_condition_to_wait_for = `.ui-dialog[style*="display: none"]:has(#bbcode-tag-bar)`;
    repeat = true;
  }

  if (window.location.href.match("flightrising.com/forums")) {
    let add_more_actions = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}-more-post-actions`),
        forum_search_link = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}-forum-search-link`);
    loadSettingsAndThreadTracker();
    quickPing(document.querySelectorAll(".post .post-frame"));
    if (add_more_actions == "true" || forum_search_link == "true") { morePostActions(document.querySelectorAll(".post .post-frame"), add_more_actions, forum_search_link); }
  }
  bbcodeButtons(textarea_to_affect, element_to_wait_for, repeat, recursive_condition_to_wait_for);
}

// GENERAL FORUMS SETTINGS / THREAD TRACKER
function loadSettingsAndThreadTracker() {

  // thread tracker gets added to pages of forums where forum control bar is present
  if (document.querySelector("#forum-controls")) {
    console.log("\t[F&BT] ADD THREAD TRACKER BUTTON");
    const head = document.head || document.getElementsByTagName('head')[0],
      style = document.createElement('style');
    let css = `
    .bbcode-button {
      padding: 0;
      height: 47px;
      width: 47px;
      box-sizing: border-box;
      position: relative;
      z-index: 5;
      cursor: pointer;
    }
    .bbcode-modal:not(.hide) + .bbcode-button.modal {
      z-index: 11;
    }
    .bbcode-modal:not(.hide) + .bbcode-button.modal::before {
      content: '';
      position:fixed;
      top: 0px;
      left: 0px;
      width: 100%;
      height: 100%;
      border: none;
      background: rgba(0,0,0,0.5);
      outline: none;
      border: none;
    }
    .ui-modal-content {
      position: relative;
      border: 0;
      padding: .5em 1em;
      background: none;
      overflow: auto;
    }
    .bbcode-modal {
      position: absolute;
      width: var(--width, 250px);
      min-height: 200px;
      z-index: 101;
      top: 50px;
      box-sizing: border-box;
      left: var(--left, -50%);
    }
    .bbcode-modal .ui-widget-content h3:first-child {
      margin-top: 0;
    }
    .bbcode-modal img {
      vertical-align: middle;
      border: 1px solid var(--borders, #ccc);
      margin-left: 0.5em;
    }
    .bbcode-modal a {
      color: var(--link, #731d08)
    }
    .check-list, .button-list {
      display: grid;
      text-align: left;
      grid-gap: 0.5em;
      margin: 0.8em 0 0.5em;
    }
    .col-2 {
      grid-template-columns: 1fr 1fr;
    }
    .check-list label {
      display: grid;
      grid-template-columns: 25px auto;
      align-items: center;
    }
    .button-list {
      flex-wrap: wrap;
    }
    .threads {
      margin: 10px 0 10px 5px;
      max-height: 16em;
      overflow: auto;
      padding-right: 0.6em;
    }
    .threads li {
      display: flex;
      margin-bottom: 0.5em;
    }
    .threads li::before {
      content: '•' / '';
      margin-right: 5px;
    }
    .threads li i {
      margin-left: auto;
    }
    .threads li > a, .threads li > i {
      text-overflow: ellipsis;
      display: inline-block;
      overflow-x: hidden;
      white-space: pre;
      line-height: 1.3em;
      max-width: 100%;
    }
    .threads.show-authors li > a {
      max-width: 70%;
    }
    .threads.show-authors li > i {
      max-width: 30%;
    }
    button.rmv-setting {
      padding: 0.5em !important;
      width: 100%;
    }
    .rmv-bookmark {
      margin-left: auto;
      color: rgba(var(--error, 150, 0, 0),0.3);
      background: none;
      border: none;
      position: relative;
      cursor: pointer;
      font-weight: bold;
      transition: 0.3s color;
    }
    .rmv-bookmark:hover {
      color: rgba(var(--error, 150, 0, 0),1);
    }
    .rmv-bookmark.tipsy::after {
      font-weight: normal;
      left: unset;
      right: 1em;
      top: -0.3em;
      min-width: 25px;
    }
    .threads.show-authors li > i + .rmv-bookmark {
      margin-left: 0.4em
    }
    #backup-zone #data {
      grid-column: 1 / 3;
      resize: none;
      height: 150px;
      width: 100%;
      font-size: 10px;
      font-family: monospace;
    }
    .expand-setting {
      cursor: pointer;
      background: none;
      border: none;
      color: inherit;
      font: inherit;
      display: inline-flex;
      justify-content: space-between;
      width: 100%;
    }
    .expand-setting span {
      margin-left: auto;
    }
    .expand {
      max-height: 0px;
      overflow: hidden;
      transition: max-height 0.3s, opacity: 0.3s;
    }
    .expand.expanded {
      max-height:500px;
      opacity: 1;
    }
    .expander :is(.on,.off) {
      pointer-events: none;
    }
    .post-action-quick-ping.tipsy::after { top: calc(100% + 6px); left: calc(50% - 40px); }
    .post-action-quick-ping:hover::after, .post-action-quick-ping:focus::after { display: block; }
    .thread-locked { pointer-events: none !important; user-select: none; opacity: 0.5; }
    .tipsy::after {
      content: attr(data-tipsy); min-width: 150px; max-width: 300px; height: auto; line-height: 120%;
      font-size: 1rem; color: var(--text, #000); background: var(--tooltip-bg, #fff); border-radius: 10px;
      font-size: inherit; position: absolute; border:1px solid var(--borders, #888);box-shadow:rgba(0, 0, 0, 0.5) 1px 1px 6px;
      top: 112%; left: calc(50% - 100px); padding: 8px; box-sizing: border-box; z-index: 2;right:unset;bottom:unset;
      text-align: left;
      display: none;
    }
    .tipsy:hover::after { display: block !important; }
    .bbcode-modal:not(.hide) + .bbcode-button.modal::after { display: none !important; }
    .threads:empty::before { content: "No threads found."; display: block; font-style: italic; margin-bottom: 1.2em; }
    .toggled[data-toggled="0"] .on { display: none; }
    .toggled[data-toggled="1"] .off { display: none; }
    .hide {
      display: none !important;
    }
    `;
    if (localStorage.getItem(`${LOCAL_STORAGE_PREFIX}-more-post-actions`) == "true") {
      css += `
      .post-frame {
        min-height: 330px;
      }`;
    }

    head.appendChild(style);
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));

    var forum_controls = document.querySelector("#forum-controls"),
        subscribe_button = document.querySelector("span:has(#toggle-subscribe)");

    // create thread tracker modal + button
    var threads_modal = createForumControlsModal("threads",`Thread Tracker`,`<div class="common-dialog-section" id="bbcode-threads"><div id="bookmarked"><h3>Bookmarked:</h3><ul class="threads"></ul></div><div id="starred"></div></div>`,`--left: -80%; width: 425px;`),
        threads_button = createForumControlsButton("threads", `Tap this button to view your tracked threads.`, threads_modal, ASSETS.threadlist);
    threads_button.addEventListener("click", function(e) { loadTrackedThreads() });

    // change where thread tracker button is placed based on whether we're inside an actual thread or not
    if (document.querySelector(".post")) {
      subscribe_button.before(threads_button);
    } else {
      forum_controls.prepend(threads_button);
    }
    threads_button.before(threads_modal); // its associated modal goes directly before it

    // ADD SETTINGS BUTTON - only applies to forum landing page
    if (document.querySelector(`#forum-header[data-level="forum"]`)) {
      console.log("\t[F&BT] ON FORUM INDEX, ADD SETTINGS BUTTON");
      var settings_modal =  createForumControlsModal("settings", `Forum & BBCode Tweaks Script Settings`, `<div class="common-dialog-section" id="settings-list"><h3>Thread Tracker:</h3><div id="tracker-settings" class="check-list"></div><h3>Miscellaneous:</h3><div id="misc-settings" class="check-list"></div><h3>Additional BBCode Buttons:</h3><div id="tags" class="check-list col-2"></div><h3><button class="expand-setting expander toggled" data-target="#backup-zone" data-toggled="0">Backups: <span class="off">☰</span><span class="on">✕</span></h3><div id="backup-zone" class="button-list col-2 expand"></div><h3><button class="expand-setting expander toggled" data-target="#danger-zone" data-toggled="0">Reset: <span class="off">☰</span><span class="on">✕</span></h3><div id="danger-zone" class="button-list col-2 expand"></div></div>`,`--width: 350px;`),
        settings_button =  createForumControlsButton("settings", `Tap this button to adjust Forum & BBCode Tweaks Script Settings.`, settings_modal, ASSETS.settings);

      threads_modal.before(settings_button, " ");
      settings_button.before(settings_modal);

      // add functionality to collapseable sections inside settings modal
      document.querySelectorAll(`button.expander`).forEach(btn => {
        btn.addEventListener("click", function(e) {
          let target= document.querySelector(this.getAttribute("data-target")),
              on = this.getAttribute("data-toggled");
          this.setAttribute("data-toggled", (on == 1) ? 0 : 1);
          target.classList.toggle("expanded");

        });
      });
      // add functionality to settings button
      settings_button.addEventListener("click", function(e) { loadSettings();})

      // backup section
      let backup_zone = settings_modal.querySelector("#settings-list #backup-zone");
      backup_zone.innerHTML += `<textarea id="data"></textarea>`;
      [{type:"import",label:"Import JSON"},{type:"export",label:"Export JSON"}].forEach(obj => {
        let button = document.createElement("button");
        button.classList = (obj.type == "import") ? "rmv-setting redbutton anybutton" : "rmv-setting thingbutton beigebutton";
        button.id = `backup-${obj.type}`;
        button.innerText = obj.label;
        button.addEventListener("click", function(e) { backup(obj.type) });
        backup_zone.prepend(button);
      });
      backup_zone.querySelector("#backup-import").disabled = true;
      // dynamically enable import button based on whether or not textarea is empty
      ['change','keyup'].forEach(event => {
        backup_zone.querySelector("#data").addEventListener(event, function(e) {
          if(this.value.length > 0) {
              document.querySelector('#backup-zone #backup-import').disabled = false;
          } else {
              document.querySelector('#backup-zone #backup-import').disabled = true;
          }
        })
      });

      // add danger zone buttons for resetting stuff
      let danger_zone = settings_modal.querySelector("#settings-list #danger-zone");
      [{type:"bookmarks",label:"Clear All Bookmarks"},{type:"starred",label:"Clear Starred Thread List"},{type:"checkmarks",label:"Reset All Checkmarks"},{type:"reset",label:"Reset All Settings"}].forEach(obj => {
        let button = document.createElement("button");
        button.classList = (obj.type == "reset") ? "rmv-setting redbutton anybutton" : "rmv-setting thingbutton beigebutton";
        button.innerText = obj.label;
        button.addEventListener("click", function(e) { clearData(obj.type) });
        danger_zone.append(button);
      });
    }

  // THREAD TRACKER - add bookmark button
  if (document.querySelector(".post .post-frame")) {
    //add bookmarker
    let saved_bookmarks = JSON.parse(localStorage.getItem(`${LOCAL_STORAGE_PREFIX}-bookmarks`)),
        already_bookmarked = (saved_bookmarks.find((element) => element.id == window.location.href.split(".com/")[1].split("/")[2])) ? true : false; // getting whether or not we've bookmarked thread already which will set toggle button to 'on'
    // create & add bookmarking thread
    var bookmarker = createForumToggleButton("bookmarks",`Add this thread to your Bookmarks.`,ASSETS.watch,`Remove this thread from your Bookmarks.`,ASSETS.unwatch, already_bookmarked);
    threads_button.after(" ", bookmarker);
    // add bookmarking functionality
    bookmarker.addEventListener("click", function (e) { threadWatcher(e,`bookmarks`) });
    // will only keep track of when you star/unstar if you enable it
    if (localStorage.getItem(`${LOCAL_STORAGE_PREFIX}-star-tracker`) == "true") { document.querySelector("#toggle-subscribe").addEventListener("click", function (e) { threadWatcher(e,`starred`) }); };
  }
}

function loadSettings() {
  var bbcode_tags_settings = settings_modal.querySelector("#settings-list #tags"),
          thread_tracker_settings = settings_modal.querySelector("#settings-list #tracker-settings"),
          misc_settings = settings_modal.querySelector("#settings-list #misc-settings"),
          backup_zone = settings_modal.querySelector("#settings-list #backup-zone"),
          exported_backup = backup_zone.querySelector("#data"),
          danger_zone = settings_modal.querySelector("#settings-list #danger-zone");

  bbcode_tags_settings.innerHTML = '';
  thread_tracker_settings.innerHTML = '';
  misc_settings.innerHTML = '';
  exported_backup.value = '';
  backup_zone.querySelector("#backup-import").disabled = true;
  document.querySelector(`button.expander[data-target="#danger-zone"]`).setAttribute("data-toggled",0);
  danger_zone.classList.remove("expanded");
  document.querySelector(`button.expander[data-target="#backup-zone"]`).setAttribute("data-toggled",0);
  backup_zone.classList.remove("expanded");

      // adding list of tags and their saved values
      BBCODE_TAG_LIST.forEach(tag => {
        let check = createCheck(tag.tag, tag.title, tag.src);
        if (tag.prepend) {
          bbcode_tags_settings.prepend(" ", check);
        } else {
          bbcode_tags_settings.append(check, " ");
        }
      });
      // append tracker settings
      thread_tracker_settings.append(createCheck(`star-tracker`, `Track Starred Threads`));
      thread_tracker_settings.append(createCheck(`show-authors`, `Show Thread Authors if Available`));
      misc_settings.append(createCheck(`ping-autofocus`, `Focus Quick Reply when Quick Ping is Clicked`));
      misc_settings.append(createCheck(`more-post-actions`, `Add Links to Author's Avatar Dragon and Hibden`));
      misc_settings.append(createCheck(`forum-search-link`, `Turn the Post Count Stat into a link to a forum search for recent posts by the author`));
    }
}

// ----------------------------------------------- //
//                  BBCODE STUFF                   //
// ----------------------------------------------- //
function bbcodeButtons(textarea_to_affect, element_to_wait_for, repeat, recursive_condition_to_wait_for = null) {
  // we won't bother to do anything unless the BBCode bar will actually exist on the page
  if ( document.querySelector("textarea#message") || document.querySelector("#clan-profile-set-clan-bio") ) {
    if (repeat) {
      // sooo on clan profiles the clan bio modal is re-created EVERY time it's opened, so we must use a recursive function to keep observing after the modal is closed
      clanProfileHandler(textarea_to_affect, element_to_wait_for, recursive_condition_to_wait_for);
    } else {
      // elsewhere it's available on page load and never removed, so we can just run the button creation function once and be done
      createBBCodeButtons(document.querySelector(element_to_wait_for), textarea_to_affect, element_to_wait_for);
    }
  } else {
    console.log("\t[F&BT] BBC: No BBCode controls present on page, skipping.");
  }
}

// recursive function to handle the unique property of the clan bio modal
function clanProfileHandler(textarea_to_affect, element_to_wait_for, recursive_condition_to_wait_for) {
  // recursive -> wait for modal to open, then do stuff with it
   return waitForElement(element_to_wait_for).then((bbcode_controls) => {
     // once the modal is opened and the bar exists, we add the buttons
     createBBCodeButtons(bbcode_controls, textarea_to_affect, element_to_wait_for);
     // then we start waiting for modal to be closed.
     console.log("\t[F&BT] BBC: Waiting for clan bio modal to be closed.");
     waitForElement(recursive_condition_to_wait_for).then((closed_dialog) => {
       // when it's closed, we then use recursion to start observing for the modal to be opened again
       console.log("\t[F&BT] BBC: Clan bio modal closed, waiting for it to be reopened.");
       return clanProfileHandler(textarea_to_affect, element_to_wait_for, recursive_condition_to_wait_for);
     });
  });
}

// function to create & add the additional bbcode buttons
function createBBCodeButtons(bbcode_controls, textarea_to_affect, element_to_wait_for) {
  console.log(`\t[F&BT] BBC: ${element_to_wait_for} found! adding new buttons.`);

  // fix quick reply header covering the additional buttons in forum threads
  if (document.querySelector(".editor-text-header")) { document.querySelector(".editor-text-header").style = "position: static;"; }

  // loop thru & create buttons for each of our tags
  BBCODE_TAG_LIST.forEach(tag => {
    var getSavedVal = localStorage.getItem( `${LOCAL_STORAGE_PREFIX}-${tag.tag}` );
    // only add to bar if we saved it
    if (getSavedVal == 'true' || getSavedVal == null) {
      var button = document.createElement("img");
      button.src = tag.src;
      button.alt = tag.title;
      button.title = tag.title;
      button.name = `btn${tag.title.replace(/\s/g, '')}`;
      button.setAttribute("data-tag",tag.tag);
      if (tag.type == 2) {
        // tags with prompts
        button.setAttribute("data-prompt",tag.prompt);
        button.classList = `bbc-prompt`;
      } else if (tag.type == 3) {
        // tags without closing tags
        button.classList = `bbc-single`;
      } else {
        // regular tags with opening and closing tags
        button.classList = `bbc-normal`;
      }
      // add to front or end of list. i like font, color, & size buttons to be at the front with b/i/u/etc so i set it up to do that :)
      if (tag.prepend) {
        bbcode_controls.prepend(" ", button);
      } else {
        bbcode_controls.append(button, " ");
      }
    }
    if (getSavedVal == null) { localStorage.setItem(`${LOCAL_STORAGE_PREFIX}-${tag.tag}`, 'true'); console.log(`\t\t\t[F&BT] Initialized default value for ${tag.tag}`) }; // setting to true on the first run of the script
  });

  var count = 0;
  // for some reason it just didn't want to work when i was setting the click events in the above loop, so we just do it after in separate loops since we need to set up different functions for different behaviors anyways
  document.querySelectorAll('.bbc-prompt').forEach(bbcode => {
    // buttons with prompts get their own special function based on the dev's doURL function
    let tag = bbcode.getAttribute("data-tag"), prompt = bbcode.getAttribute("data-prompt");
    bbcode.addEventListener("click", function (e) {
     doPromptedTag(tag, prompt, textarea_to_affect);
    });
    count++;
  });
  // non-prompt buttons can just use the site existing's doAddTags function
  document.querySelectorAll('.bbc-normal').forEach(bbcode => {
    let tag = bbcode.getAttribute("data-tag");
    bbcode.addEventListener("click", function (e) {
      doAddTags(`[${tag}]`,`[/${tag}]`,textarea_to_affect);
    });
    count++;
  });
  //separate for single tag
  document.querySelectorAll('.bbc-single').forEach(bbcode => {
    let tag = bbcode.getAttribute("data-tag");
    bbcode.addEventListener("click", function (e) {
      doAddTags(`[${tag}]`,``,textarea_to_affect);
    });
    count++;
  });

  console.log(`\t[F&BT] BBC: Done! ${count} BBCode buttons successfully added.`);
}

// function to handle any tag that needs a prompt
function doPromptedTag(tag, prompt_text, textarea_id) {
    var textarea = document.getElementById(textarea_id),
        prompt_val = prompt(prompt_text, ""),
        scrollTop = textarea.scrollTop,
        scrollLeft = textarea.scrollLeft;

  // INPUT VALIDATION
  if (tag == "hidden" & prompt_val == "") { prompt_val = "Hidden"; } // set default title for hidden
  if ((tag == "size" & prompt_val != null) && (isNaN(parseInt(prompt_val)) || prompt_val > 7 || prompt_val < 0)) { prompt_val = (prompt_val > 7) ? 7 : 0; }; // clamp range for size between 0-7

  // DO STUFF
  if (prompt_val != "" && prompt_val != null && tag == "columns") {
      // special case for columns... how many columns? if your response was a huge number or invalid you get 1 column. otherwise it'll format it nicely for you, placing any highlighted text in the first column
      if(isNaN(parseInt(prompt_val)) || (prompt_val > 6 || prompt_val < 1)) { prompt_val = (prompt_val > 6) ? 6 : 1; }
      var col = "\n[nextcol]\n",
          col_inner = '';
      // loop and add more [nextcol]s for 2+ cols
      for (let i = 1; i < parseInt(prompt_val); i++) {
        col_inner += col;
      }
      // appending logic copied from doUrl function
      if (document.selection) {
            textarea.focus();
            var sel = document.selection.createRange();
            sel.text = (sel.text == "") ? `[${tag}]\n${col_inner}\n[/${tag}]` : `[${tag}]\n${sel.text}${col_inner}\n[/${tag}]`;
        } else {
            var len = textarea.value.length,
                start = textarea.selectionStart,
                end = textarea.selectionEnd,
                sel = textarea.value.substring(start, end);
          var rep = (sel == "") ? `[${tag}]\n${col_inner}\n[/${tag}]` : `[${tag}]\n${sel}${col_inner}\n[/${tag}]`;
          textarea.value = textarea.value.substring(0, start) + rep + textarea.value.substring(end, len);
          textarea.scrollTop = scrollTop;
          textarea.scrollLeft = scrollLeft;
        }
    } else if (prompt_val != "" && prompt_val != null) {
        // for most tags like color, font, size, etc. we can just re-use the same block
        var tag1 = tag, tag2 = tag;

        // special check for the one tag that requires a slightly different tag format
        if ((tag == "hidden")) { tag1 = `${tag} title`; };

        // appending logic copied from doUrl function
        if (document.selection) {
            textarea.focus();
            var sel = document.selection.createRange();
            sel.text = (sel.text == "") ? `[${tag1}="${prompt_val}"][/${tag2}]` : `[${tag1}="${prompt_val}"]${sel.text}[/${tag2}]`;
        } else {
            var len = textarea.value.length,
                start = textarea.selectionStart,
                end = textarea.selectionEnd,
                sel = textarea.value.substring(start, end);
          var rep = (sel == "") ? `[${tag1}="${prompt_val}"][/${tag2}]` : `[${tag1}="${prompt_val}"]${sel}[/${tag2}]`;
          textarea.value = textarea.value.substring(0, start) + rep + textarea.value.substring(end, len);
          textarea.scrollTop = scrollTop;
          textarea.scrollLeft = scrollLeft;
        }
    }
}

// ----------------------------------------------- //
//                 THREAD TRACKER                  //
// ----------------------------------------------- //

function loadTrackedThreads() {

  let track_starred = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}-star-tracker`),
      bookmark_container = document.querySelector("#bbcode-threads #bookmarked ul"),
      bookmarks = JSON.parse(localStorage.getItem(`${LOCAL_STORAGE_PREFIX}-bookmarks`)),
      show_authors = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}-show-authors`);
  bookmark_container.innerHTML = ""; // we re-fresh the list every time modal is opened

  if (show_authors == "true") {
    bookmark_container.classList.add("show-authors");
  } else {
    bookmark_container.classList.remove("show-authors");
  }
  bookmarks.forEach(bookmark => {
    let li = document.createElement("li");
    li.innerHTML = `<a href="${bookmark.url}">${bookmark.title}</a>`;
    bookmark_container.append(li);
    if (bookmark.author.name != undefined && bookmark.author.link != undefined && show_authors == "true") {
      li.innerHTML += `<i>by <a href="${bookmark.author.link}">${bookmark.author.name}</a></i>`;
    }
    li.innerHTML += `<button class="rmv-bookmark" title="Remove Bookmark" data-thread-id="${bookmark.id}">X</button>`;
  });
  bookmark_container.querySelectorAll(".rmv-bookmark").forEach(button => {
    button.addEventListener("click", function(e) {
      removeBookmark(e);
    });
  });

  // bbcode-starred
  if(track_starred == "true") {
     var star_container = document.querySelector("#bbcode-threads #starred"),
         stars = JSON.parse(localStorage.getItem(`${LOCAL_STORAGE_PREFIX}-starred`));
    star_container.innerHTML = `<h3>Starred:</h3><ul class="threads"></ul>`;
    let stars_threads = star_container.querySelector(".threads");
    stars.forEach(star => {
      let li = document.createElement("li");
      li.innerHTML = `<a href="${star.url}">${star.title}</a>`;
      stars_threads.append(li);
      if (star.author.name != undefined && star.author.link != undefined && show_authors == "true") {
        li.innerHTML += `<i>by <a href="${star.author.link}">${star.author.name}</a></i>`;
      }
    });
  } else {
    document.querySelector("#bbcode-threads #starred").innerHTML = "";
  }
}

function threadWatcher(event, type) {
  var url_splice = window.location.href.split(".com/")[1],
      subsplice = url_splice.split("/"),
      author = (subsplice.length == 3 || (subsplice.length > 3 && subsplice[3] == 1)) ? document.querySelector(".post-author-username") : "",
      topic = document.querySelector("#topic-header strong").innerText,
      topic_id = subsplice[2],
      thread_link = `/${subsplice[0]}/${subsplice[1]}/${subsplice[2]}`,
      thread_list = JSON.parse(localStorage.getItem(`${LOCAL_STORAGE_PREFIX}-${type}`));

  // check if found
  let found = thread_list.find((element) => element.id == topic_id);

  if (type == `starred` && found == undefined && event.target.src.includes(`/buttton_subscribed.png`)) {
    // handling for already starred threads so it'll properly toggle, otherwise the starred status will be out of sync with the site
      console.log("\t\t[F&BT] thread was already starred before script was installed, will not track until it's starred again");
  } else if (found == undefined) {
    // we clicked to star or bookmark
    let new_thread = {
      title : topic,
      id : topic_id,
      author: {
        link : author.href,
        name : author.innerText
      },
      url : thread_link,
      saved : Date.now()
    };
    thread_list.push(new_thread);
    console.log(`\t[F&BT] saved thread #${topic_id} to ${type}`)
  } else {
    // we clicked to unstar/unbookmark
    let removed = thread_list.indexOf(found);
    thread_list.splice(removed,1);
    console.log(`\t[F&BT] removed thread #${topic_id} from ${type}`)
  }
  localStorage.setItem(`${LOCAL_STORAGE_PREFIX}-${type}`,JSON.stringify(thread_list));
  // uncomment line below to list threads for debug purposes:
  // console.log(`saved threads for ${type}:\n${JSON.stringify(thread_list, null, 4)}`);
}


// ----------------------------------------------- //
//                  QUICK PING                     //
// ----------------------------------------------- //

function quickPing(posts) {
  if (posts.length > 0) {
    console.log(`\t[F&BT] Quick Ping: Adding buttons to ${posts.length} post(s).`);
    // set up ping button template to clone
    const pingButton = document.createElement("div"),
          autofocus = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}-ping-autofocus`);
    pingButton.classList = "post-action post-action-quick-ping tipsy";
    pingButton.style = "cursor: pointer; position: relative;";
    pingButton.innerHTML = `<img src="/static/cms/icons/484.png" alt="Ping">`;

    let thread_locked = false;

    // checking if thread is locked
    if (document.querySelector("#lockmsg") != null) {
        console.log("\t[F&BT] Quick Ping: Thread is locked, disabling useless quote and ping buttons.");
        thread_locked = true
    }

    // loop thru posts, skipping blocked posts or our own posts
    posts.forEach((post) => {
        //skip our own posts or blocked posts
        if (post.querySelector(".post-author-username") == null) {
            //console.log("\t\t[F&BT] Quick Ping: Blocked post, skipping");
        } else if (post.querySelector(".post-author-actions") == null) {
            //console.log("\t\t[F&BT] Quick Ping: It's your post, skipping");
            if (thread_locked) {
                post.querySelector(".post-action-quote").setAttribute("disabled","disabled");
                post.querySelector(".post-action-quote").classList.add("thread-locked");
            }
        } else {
            //clone the premade button
            var copiedPingButton = pingButton.cloneNode(true);

            // set data-name & title
            copiedPingButton.setAttribute("data-name",post.querySelector(".post-author-username").innerText);
            copiedPingButton.setAttribute("data-tipsy",`Click to ping ${copiedPingButton.getAttribute("data-name")} in a quick reply.`);

            // add the button to the page and insert it into the post header after the quote button
            post.querySelector(".post-header .post-actions").appendChild(copiedPingButton);
            post.querySelector(".post-header .post-actions .post-action-quote").after(copiedPingButton);

            // if thread is locked we're gonna disable the quote & ping buttons because they don't do anything anyways. this is kinda just for looks lol
            if (thread_locked) {
                [post.querySelector(".post-action-quote"), copiedPingButton].forEach((ele) => {
                    ele.setAttribute("disabled","disabled");
                    ele.classList.add("thread-locked");
                });
            } else {
                // otherwise we'll add a click event
                copiedPingButton.addEventListener("click",function (e) {
                    // grab username
                    var username = this.getAttribute("data-name");
                    // use the existing site function that's used to add BBCode tags to textareas to append the ping to the reply box.
                    doAddTags(`@${username} `,'','message');
                    // like the quote button, will immediately focus the reply box after appending ping
                    if (autofocus == "true") { document.querySelector("#message").focus(); }
                });
            }
        }
    });
    console.log("\t[F&BT] Quick Ping: Done!");
  }
}
function morePostActions(posts, add_more_actions, forum_search_link) {
  posts.forEach(post => {
    if (post.querySelector(".post-author-username") != null) {

      let stats = post.querySelector(".post-author-stats"),
          author = post.querySelector(".post-author-username").innerText;

      // optional begin a forum search link
      if (forum_search_link == "true") {
        let post_count_stat = stats.querySelector(`.post-author-stat[data-stat="post"]`);
        post_count_stat.innerHTML = `<a href="https://${window.location.hostname}/search/forums?poster=${author}&sort=recent&submit=Search%2BForums" class="post-stat-count" title="Recent Posts by ${author}">${post_count_stat.querySelector(".post-stat-count").innerText}</a>`;
      }
      // add additional posts actions, skipping admins
      if (add_more_actions == "true" && !post.parentNode.classList.contains("post-admin")) {
        let avvie = stats.querySelector(".post-author-stat").cloneNode(),
            den = stats.querySelector(".post-author-stat").cloneNode(),
            den_link = stats.querySelector(`.post-author-stat[data-stat="dragon"] a`).href.replace("lair","den"),
            dragon = post.querySelector(`.post-author-avatar img`).src.split("/");
        dragon = dragon[dragon.length-1].replace("p.png","")
        avvie.setAttribute("data-stat","avatar-dragon");
        den.setAttribute("data-stat","den");
        avvie.innerHTML = `<a href="https://${window.location.hostname}/dragon/${dragon}" title="Avatar Dragon"><img src="/static/cms/icons/171.png"></a>`;
        den.innerHTML = `<a href="${den_link}" title="Hibernal Den"><img src="/static/cms/icons/10.png"></a>`;
        stats.append(avvie,den);
      }
    }
  })
}

// function to wait until an element exists to start doing things
// FROM: https://stackoverflow.com/a/61511955
function waitForElement(selector) {
  console.log(`\t[F&BT] Waiting for '${selector}'...`);

  return new Promise(resolve => {
      if (document.querySelector(selector)) {
          return resolve(document.querySelector(selector));
      }

      const observer = new MutationObserver(mutations => {
        // if it aint there we observe until it is
          if (document.querySelector(selector)) {
              observer.disconnect();
              resolve(document.querySelector(selector)); // returns the element for us to do stuff with once it shows up
          }

      });
      observer.observe(document.body, {
          childList: true,
          subtree: true
      });
  });
}


// ----------------------------------------------- //
//               SETTINGS STUFF                    //
// ----------------------------------------------- //

function firstRun() {
  if (localStorage.getItem(`${LOCAL_STORAGE_PREFIX}-starred`) == null) { localStorage.setItem(`${LOCAL_STORAGE_PREFIX}-starred`,"[]"); console.log("\t\t\t[F&BT] Created local storage for starred threads")};
  if (localStorage.getItem(`${LOCAL_STORAGE_PREFIX}-bookmarks`) == null) { localStorage.setItem(`${LOCAL_STORAGE_PREFIX}-bookmarks`,"[]");  console.log("\t\t\t[F&BT] Created local storage for bookmarked threads")};
  if (localStorage.getItem(`${LOCAL_STORAGE_PREFIX}-show-authors`) == null) { localStorage.setItem(`${LOCAL_STORAGE_PREFIX}-show-authors`,"true");  console.log("\t\t\t[F&BT] Initialized default value for showing thread authors")};
  if (localStorage.getItem(`${LOCAL_STORAGE_PREFIX}-star-tracker`) == null) { localStorage.setItem(`${LOCAL_STORAGE_PREFIX}-star-tracker`,"true");  console.log("\t\t\t[F&BT] Initialized default value for tracking starred threads")};
  if (localStorage.getItem(`${LOCAL_STORAGE_PREFIX}-ping-autofocus`) == null) { localStorage.setItem(`${LOCAL_STORAGE_PREFIX}-ping-autofocus`,"true");  console.log("\t\t\t[F&BT] Initialized default value for quick ping autofocus")};
  if (localStorage.getItem(`${LOCAL_STORAGE_PREFIX}-more-post-actions`) == null) { localStorage.setItem(`${LOCAL_STORAGE_PREFIX}-more-post-actions`,"true");  console.log("\t\t\t[F&BT] Initialized default value for additional user buttons in forum posts.")};
  if (localStorage.getItem(`${LOCAL_STORAGE_PREFIX}-forum-search-link`) == null) { localStorage.setItem(`${LOCAL_STORAGE_PREFIX}-forum-search-link`,"true");  console.log("\t\t\t[F&BT] Initialized default value for author forum search link.")};
  BBCODE_TAG_LIST.forEach(tag => {
    if (localStorage.getItem(`${LOCAL_STORAGE_PREFIX}-${tag.tag}`) == null) { localStorage.setItem(`${LOCAL_STORAGE_PREFIX}-${tag.tag}`,"true"); console.log(`\t\t\t[F&BT] Initialized default value for ${tag.tag} button`)}
  });
  localStorage.setItem(`${LOCAL_STORAGE_PREFIX}-setup`,"finished");
}

function updateSetting( e ) {
  localStorage.setItem( `${LOCAL_STORAGE_PREFIX}-${e.target.name}`, e.target.checked );
}

function clearThreadList(type) {
  localStorage.setItem( `${LOCAL_STORAGE_PREFIX}-${type}`, `[]` );
}

// create checkbox element & update local settings based on
function createCheck( name, label, image = null ) {
  let itemContainer = document.createElement('div'),
    getSavedVal = localStorage.getItem( `${LOCAL_STORAGE_PREFIX}-${name}` );

  image = (image == null) ? " " : `<img src="${image}"> `;

  itemContainer.innerHTML = `<label for="${name}"><span class="common-checkbox" data-selected="0"><input type="checkbox" id="${name}" name="${name}" /></span><span>${image}${label}</span>`;

  let checkboxInput = itemContainer.querySelector("input");
  checkboxInput.checked = (getSavedVal == 'true' || getSavedVal == null ) ? true : false;
  if (getSavedVal == null) { localStorage.setItem( `${LOCAL_STORAGE_PREFIX}-${name}` , 'true'); console.log(`\t\t\t[F&BT] Initialized default value for ${name}`) };
  isChecked(checkboxInput);
  checkboxInput.addEventListener('click', (event) => { updateSetting(event); isChecked(checkboxInput);  });

  return itemContainer;
}

// using logic of hoard setting checkboxes
function isChecked(checkbox) {
  if (checkbox.checked) {
    checkbox.parentNode.setAttribute("data-selected",1)
  } else {
    checkbox.parentNode.setAttribute("data-selected",0)
  }
}

function removeBookmark(event) {
  let topic_id = parseInt(event.target.getAttribute("data-thread-id")),
      thread_list = JSON.parse(localStorage.getItem(`${LOCAL_STORAGE_PREFIX}-bookmarks`)),
      found = thread_list.find((element) => element.id == topic_id);
  // as long as thread actually exists we'll delete it from array
  if (found != undefined) {
    let removed = thread_list.indexOf(found);
    thread_list.splice(removed,1);
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}-bookmarks`,JSON.stringify(thread_list));
    console.log(`\t[F&BT] removed thread #${topic_id} from bookmarks.`);
    // edge case of deleting a bookmark via modal when inside the bookmarked thread. toggles the bookmark button back to unbookmarked
    if (window.location.href.match(topic_id)) {
      let bookmark_button = document.querySelector(".bbcode-bookmarks-button");
      bookmark_button.setAttribute("data-toggled",0);
      bookmark_button.setAttribute("data-tipsy",bookmark_button.getAttribute("data-tipsy-0"));
    }
    event.target.parentNode.remove();
  } else {
      console.log(`\t\t[F&BT] something went wrong removing ${topic_id} from bookmarks.`)
  }
}

function clearData(type) {
  switch(type) {
    case "reset":
      //reset all settings
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}-starred`,"[]");
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}-bookmarks`,"[]");
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}-star-tracker`,"true");
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}-ping-autofocus`,"true");
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}-show-authors`,"true");
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}-more-post-actions`,"true");
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}-forum-search-link`,"true");
      BBCODE_TAG_LIST.forEach(tag => {
        localStorage.setItem( `${LOCAL_STORAGE_PREFIX}-${tag.tag}` , 'true');
      });
      alert(`[F&BT] Successfully Reset all settings`);
      document.querySelector(".bbcode-settings-button").click();
      document.querySelector(".bbcode-settings-button").click();
      break;
    case "checkmarks":
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}-star-tracker`,"true");
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}-ping-autofocus`,"true");
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}-show-authors`,"true");
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}-more-post-actions`,"true");
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}-forum-search-link`,"true");
      BBCODE_TAG_LIST.forEach(tag => {
        localStorage.setItem( `${LOCAL_STORAGE_PREFIX}-${tag.tag}` , 'true');
      });
      alert(`[F&BT] Reset all checkbox settings to their defaults.`);
      document.querySelector(".bbcode-settings-button").click();
      document.querySelector(".bbcode-settings-button").click();
      break;
    case "starred":
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}-starred`,"[]");
      alert(`[F&BT] Cleared saved starred threads`);
      break;
    case "bookmarks":
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}-bookmarks`,"[]");
      alert(`[F&BT] Cleared saved bookmarks`)
      break;
    default:
      alert(`[F&BT] ERROR! Invalid action specified, doing nothing.`);
  }
}

function backup(action) {

  let backup_json;

  if (action == "import") {
    // attempt to load
    try {
      // --- JSON VALIDATION --------------------------------------------- //
      // doing all these checks now
      var backup_data = document.querySelector("#backup-zone #data").value;
      if (backup_data.length <= 0 || backup_data == null || backup_data == undefined) {
        throw new TypeError("Not valid JSON.");
      }
      // try to parse input as JSON, will throw error if there's something wrong with it and spit out the error
      backup_json = JSON.parse(backup_data);

      // check if keys exist
      var star_tracker = backup_json['star_tracker'],
          show_authors = backup_json['show_authors'],
          ping_autofocus = backup_json['ping_autofocus'],
          more_post_actions = backup_json['more_post_actions'],
          add_forum_search_link = backup_json['add_forum_search_link'],
          bookmarks = backup_json[`bookmarks`],
          starred = backup_json[`starred`];

      // check the T/F settings
      if (!(star_tracker == "true" || star_tracker == "false") || !(show_authors == "true" || show_authors == "false") || !(ping_autofocus == "true" || ping_autofocus == "false") || !(more_post_actions == "true" || more_post_actions == "false") || !(add_forum_search_link == "true" || add_forum_search_link == "false")) {
        throw new TypeError(`Invalid value(s) for "star_tracker", "show_authors", "ping_autofocus", "more_post_actions", or "add_forum_search_link". All keys must exist and be either "true" or "false"`);
      }

      // check if all tags are there
      BBCODE_TAG_LIST.forEach(tag => {
        let found = backup_json['bbcode-enabled'].find((element) => element.tag == tag.tag);
        if (found == undefined) {
          throw new Error(`${tag.tag} is missing from backup data.`);
        } else if (!(found.enabled == "true" || found.enabled == "false")) {
          throw new TypeError(`Invalid value for ${found.tag} setting. It must be "true" or "false"`)
        };
      });

      // make sure we have arrays in bookmark
      if (!(Array.isArray(bookmarks) && Array.isArray(starred))) {
        throw new TypeError("Bookmarks and/or Starred is missing or malformed.")
      }

      // validate existence of all necessary keys in bookmarks/threads
      for (const [index, bookmark] of bookmarks.entries()) {
        if (bookmark.title == undefined || bookmark.id == undefined || bookmark.author == undefined || bookmark.url == undefined || bookmark.saved == undefined) {
          throw new ReferenceError(`Bookmarks entry #${index+1} is missing one or more of the required values to import.`)
        }
        // author checking, we need either an empty obj or an obj that has keys for name + link
        if ((bookmark.author.name == undefined || bookmark.author.link == undefined)) {
          if (!(Object.keys(bookmark.author).length == 0 && bookmark.author.constructor == Object)) { //if it's an empty obj, which is the default output, we don't care
            throw new ReferenceError(`Bookmarks entry #${index+1} has malformed author key. It should either be an empty object {} in the case that author data is unavailable, or contain both keys for "name" and "link".`)
          }
        }
      };
      for (const [index, thread] of starred.entries()) {
        if (thread.title == undefined || thread.id == undefined || thread.author == undefined || thread.url == undefined || thread.saved == undefined) {
          throw new ReferenceError(`Bookmarks entry #${index+1} is missing one or more of the required keys to import.`)
        }
        // author checking, we need either an empty obj or an obj that has keys for name + link
        if ((thread.author.name == undefined || thread.author.link == undefined)) {
          if (!(Object.keys(thread.author).length == 0 && thread.author.constructor == Object)) { //if it's an empty obj, which is the default output, we don't care
            throw new ReferenceError(`Starred threads entry #${index+1} has malformed author key. It should either be an empty object {} in the case that author data is unavailable, or contain both keys for "name" and "link".`)
          }
        }
      };
      // --- END VALIDATION ---------------------------------------------- //

      // if all of the above checks passed we can proceed with overwriting the local storage
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}-bookmarks`,JSON.stringify(bookmarks));
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}-starred`,JSON.stringify(starred));
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}-star-tracker`,star_tracker);
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}-show-authors`,show_authors);
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}-ping-autofocus`,ping_autofocus);
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}-more-post-actions`,more_post_actions);
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}-forum-search-link`,add_forum_search_link);
      // bbcode tags
      BBCODE_TAG_LIST.forEach(tag => {
        let found = backup_json['bbcode-enabled'].find((element) => element.tag == tag.tag);
        localStorage.setItem(`${LOCAL_STORAGE_PREFIX}-${tag.tag}`,found.enabled);
      });

      alert(`[F&BT] Successfully imported settings!`);

      // the lazy way to refresh the modal content :)
      document.querySelector(".bbcode-settings-button").click();
      document.querySelector(".bbcode-settings-button").click();

    } catch (err) {
      alert(`[F&BT] Something is wrong with your backup data:\n\n${err}`);
      console.log(`\t[F&BT] Error! ${err}`)
    }
  } else { // otherwise just assume we're exporting
    backup_json = {};

    backup_json[`star_tracker`] = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}-star-tracker`);
    backup_json[`show_authors`] = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}-show-authors`);
    backup_json[`ping_autofocus`] = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}-ping-autofocus`);
    backup_json[`more_post_actions`] = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}-more-post-actions`);
    backup_json[`add_forum_search_link`] = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}-forum-search-link`);

    backup_json[`bookmarks`] = JSON.parse(localStorage.getItem(`${LOCAL_STORAGE_PREFIX}-bookmarks`));
    backup_json[`starred`] = JSON.parse(localStorage.getItem(`${LOCAL_STORAGE_PREFIX}-starred`));

    backup_json[`bbcode-enabled`] = [];
    BBCODE_TAG_LIST.forEach(tag => {
      let obj = {
        tag : tag.tag,
        enabled :  localStorage.getItem( `${LOCAL_STORAGE_PREFIX}-${tag.tag}` )
      }
      backup_json["bbcode-enabled"].push(obj);
    });
    // trigger onchange event to enable import button when the value of the backup textarea is changed
    var event = new Event('change');
    document.querySelector("#backup-zone #data").value = JSON.stringify(backup_json, null, 4);
    document.querySelector("#backup-zone #data").dispatchEvent(event);
  }
}


// ----------------------------------------------- //
//               MODALS N BUTTONS                  //
// ----------------------------------------------- //

function createForumControlsModal(name, title, content, style = "") {
  var modal = document.createElement("div");
  modal.classList = `ui-dialog ui-corner-all ui-widget ui-widget-content ui-front bbcode-${name}-modal bbcode-modal hide`;
  modal.setAttribute("aria-labeled-by",`ui-bbcode-${name}`);
  modal.setAttribute("data-open","0");
  modal.setAttribute("data-name",name);
  modal.style = style;
  modal.innerHTML = `<div class="ui-dialog-titlebar ui-corner-all ui-widget-header ui-helper-clearfix"><span id="ui-bbcode-${name}" class="ui-dialog-title">${title}</span>
    </div>
  <div class="ui-modal-content ui-widget-content">
  </div>
  `;
  modal.querySelector(".ui-widget-content").innerHTML = content;
  return modal;
}

function createForumControlsButton(name, tooltip, modal, image) {
  var btn = document.createElement("span");
  btn.setAttribute("aria-role","button");
  btn.setAttribute("tabindex",0);
  btn.classList = `bbcode-${name}-button bbcode-button modal tipsy`;
  btn.setAttribute("data-tipsy", tooltip);
  btn.innerHTML = `<img src="${image}" role="button" alt="${name} button">`;
  btn.addEventListener("click", function(event) {
    // close any open modals
    document.querySelectorAll(`.bbcode-modal[data-open="1"]`).forEach(open => {
      if (modal.getAttribute("data-name") != open.getAttribute("data-name")) {
        open.classList.add("hide"); open.setAttribute("data-open","0");
      } })
    modal.classList.toggle("hide");
    let status = (modal.getAttribute("data-open") == "0") ? "1" : "0";
    modal.setAttribute("data-open",status);
  });
  return btn;
}

function createForumToggleButton(name, tooltip, image, toggled_tooltip, toggle_image, start_enabled = false) {
  var btn = document.createElement("span");
  btn.setAttribute("aria-role","button");
  btn.setAttribute("tabindex",0);
  btn.classList = `bbcode-${name}-button bbcode-button toggled tipsy`;
  btn.setAttribute("data-tipsy-0", tooltip);
  btn.setAttribute("data-tipsy-1", toggled_tooltip);

  if(start_enabled) {
    btn.setAttribute("data-tipsy", toggled_tooltip);
    btn.setAttribute("data-toggled", "1");
  } else {
    btn.setAttribute("data-tipsy", tooltip);
    btn.setAttribute("data-toggled", "0");
  }

  btn.innerHTML = `<img src="${image}" role="button" alt="${name} button" class="off"><img src="${toggle_image}" role="button" alt="${name} button" class="on">`;
  btn.addEventListener("click", function(event) {
    console.log("clicked ${name}");
    if (btn.getAttribute("data-toggled") == "0") {
      btn.setAttribute("data-toggled", "1");
      btn.setAttribute("data-tipsy", btn.getAttribute("data-tipsy-1"));
    } else {
      btn.setAttribute("data-toggled", "0");
      btn.setAttribute("data-tipsy", btn.getAttribute("data-tipsy-0"));
    }
  });
  return btn;
}

FBTinit();