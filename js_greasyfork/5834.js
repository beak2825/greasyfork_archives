// ==UserScript==
// @name        KAT - Old BBCode Toolbar
// @namespace   OldBBCodeToolbar
// @version     1.06
// @description  Reverts to the old toolbar
// @require https://greasyfork.org/scripts/6250-waitforkeyelements/code/waitForKeyElements.js?version=23756
// @match      http://kat.cr/*
// @match      https://kat.cr/*
// @downloadURL https://update.greasyfork.org/scripts/5834/KAT%20-%20Old%20BBCode%20Toolbar.user.js
// @updateURL https://update.greasyfork.org/scripts/5834/KAT%20-%20Old%20BBCode%20Toolbar.meta.js
// ==/UserScript==

var image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAATsAAAAUCAYAAADyUZqQAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIE1hY2ludG9zaCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpBOThFQ0Y0QjU5MjYxMUUxQkRFN0Y0NzhFN0JCRDE4RCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpBOThFQ0Y0QzU5MjYxMUUxQkRFN0Y0NzhFN0JCRDE4RCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjBCMTMxQzg0NTdGNzExRTFCREU3RjQ3OEU3QkJEMThEIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkE5OEVDRjRBNTkyNjExRTFCREU3RjQ3OEU3QkJEMThEIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+KC002AAACAVJREFUeNrsnHlMFFccx3+DKN1qAStHUq96A551AatFLd4imlQTgk3Uqt1d2/5hU22MtiWpNVoTmxhTo7sEY2tiLKlWEU+EViRahfFoKBbFFrwSUIpScKUFpu/3lllm2VmdaznM++ry5r3fm3PffOb3e+/NcoIgABMTE9OLLo7BjomJicGOqcMk6PhiOCJ2BZmYGOy6DOwy+DrV660092p32CkFs77jinXvw1lRCqaBIwB4kjEX6T7XQ/Zlmm6ChbbvFO/7q7WzNO3ji22n2YPLIAWyS9C1dIkPhnhzLU1jOTsEjF/c4VD+aEuWrO1BLUB4sCtFZW5ZIKgHnk0AnocCvobmEqx/EtC5gMfzEZBAIWgm/+26oLBw5Tavsur7V6F70KsQ3GeAl+3ovs9VXifWdjsl7Eh7FJ7TwHU1LLntq9lm2/VxXbkyI47LiPM1EnIT3uxDcoNoWZFgI96NDT6eXgnnH5lUbzN1M0/P98AGMyeXVwq6nesXyNqfOJvgaWMTPGlopPmU9VkqgWcTnBX7oQTqICwuD+qbbxLIrSGwq4OSU++SslQ4W7wN4qfsh4oTlULU3MOGfE/NTQ1w5fQmqHt0h+Z7hfaHYfEWWeipwJ1XSdo3OR75jWtmMiK1N+zawkO82cUyTPUAQLp9u90KVqu6p7J0ffE45Mq0gE66rtrzLSmrEq5dL4OqR/+4yxJiwsBsNnNytojQV2Dx/EmcEtBJIYfC/Nc7qiExHnSBzpftecCTgu7S/dbyGqcAvU0cTQECWj7dYWSIE/amzVMJPJ6CrS4/CYbNCsaYFUrukvD1IYlfzWaIeiORAtD08DhERRwx7KaQgg6Fy1UVJwnsrNoBqsC1a2bu34sXxtpsDve3qhZ07RyicUo8XSnoxkYPhegh4bTs8uXLkHHqLty430DXl7MRVAlKgNdWCLqyCQDrxtfqAp0Uargs2pQAT06toPPU749NMLlns7rwlXbKAXRz/gGfptla2gsPMWG9YN9mB+A/8iBB7lEVOIYICdZbfmlP90rPw4DoFOhhCtXWlpoFQ+owaVdAR+zU4RAbrr3TXRAEm/hRE8aKoMu5cAXikt+HVavSEXIwebQLbsNfC6J1RFtByUOYNToQfskuVhS+Cv/95VGOHp2FHOHWXcFguRysG3RyZc/y/qQS4YapHOj0yjy7ivh0vOtDwIbeHpgJCHnMO8BJ4IcyQW9D9hcS2d+rDENZraBrcdu8P1rqMPnXszOiP0zOqyMhLNdZAKf3vDE8Ra9t6epMsG/8kIIuNXmi23791gMYG0Lu0X4TCOTNFHbDo+Ng0+5DiH2fx4b9cdtzg92hK0IP4WYh+XRyNBYCvcQW6B1ZX4m3pWbQafHwsF8On5nPgtztx65n6t8klFUsnqfjDhRiBG5tn4tWa+tlc1a0pFDjtzaCoSz25QV0C9LGOtKUps1dDolzlvqs8+WOPPdyQe4BOJVlZ4Rqb9gZ2WfXGb06X+eixrvD/jcE2pLUFBqejuj/EsTFpXtWirwI8W8toKAbGNpIvUCEny/hNBKbo9Vru/hrNYGf0w3B2NQkSDhwHEbmRVLoiSGyXogphSIKByDkAgQRcHrF82YIaXqHhpEYzkrVZIqCviMmQWN1oaF9dkGmfrKenVbQiSFq7rE9dFg2ce6yZ9Y9h6A7vJvRqSv32XVGr04KtrZAkxvl9SUxhEWIzZzo8uhK7zyFpopKiEkY2ALEUbQe6tvMC8R2z23zJbu1mQAvgKbpcXEwkouk4WsBAV2RhYei3EhotirvC3se8NSAzq+iHXE8OPkaME2zQOyidQD/NnjW6RFEYVt8ZCGBnXG7DokYRf5mej7MXp+oa5vi4EMOAR4uTfMBvIK8TDjx0y5Gpq4OO394dQhQBKcUpHrDWS1ea8zQCM75OExAr+5E9mHg716kXtvbyaPoiCvP89SGfXSiDUG3esns5+7L3gIzS2EhEHcR9gXWg50sWzSepy/gqQEdPgV2rl8g4Ojq7g1zvOxxBD4Hb7o8oUXDXJBatfkMjsQqnFxs55wV+wXsr7uUvxzCE7+H8H59PGrUP6qH8sxPYKr5OB3LqHnQ15A2hVNM0JOTjshGvj5JX/Qg6X/LOZqBbQymJ73nCbrcH+DYwZ2MSv5yaOQmvxs9z85f89f0ztdrr+PUGFoLe36TD0v32sJhSWNP6JZR7mVbMeaB4jcV9M6zE48TgScnEYKrNp+kqXLQiTFsrOAMK6WLl/KnQDfTDAgbMo7mH966Ck3OMzDVeZz27RXwg0HrSCy+QSGdVFxbfRuunE7zqDN4XAr0j05y53FS8fzlymcSrPtgqlfbmpm8AmbMc3l4585kQrYM6LbuOsveoPCnZ2f0ze0vWHSV49Qq7KNrq9h0M0ST8BVIKmdfMUadh/esvMIHBIfz5uRsUq9PNehoKFvEmXhOwNHW+Cn5dD4diBH7IIlHREBXwveGBJ3XGwcgaiqvQ/m1g162qvILENj9ZejTd5ymUVk5p+I08fBwsnGPIBNk/8g8uhcqjDWyf62rgUuLcLR16EWg8+nE9OexPJRxrWlbu71jvg/Za40Q9OX1KQeewJU4OEGcS+fp+RHQgQt0Vru+d2Tx1bDis9t92jGkvVG4F6DQ5eUZATvUqawMRqGODGOZOl4vyq+eiGGuJs9OIpwwLM2L/XPzP8vvEj8EsNY6WdM+tjnOsTCWwY6pq4Gb/fQUE4MdExMTE4MdExMTk379L8AAWOMw6r0J0DwAAAAASUVORK5CYII";

function changeToolbar (jNode) 
{
    $(".bbedit-toolbar > span[class!='bbedit-spoiler']").css("background-image", "url(" + image + ")");
    $(".bbedit-b").css("background-position", "0px 0px");
    $(".bbedit-i").css("background-position", "-20px 0px");
    $(".bbedit-u").css("background-position", "-40px 0px");
    $(".bbedit-s").css("background-position", "-60px 0px");
    $(".bbedit-url").css("background-position", "-80px 0px");
    $(".bbedit-image").css("background-position", "-100px 0px");
    $(".bbedit-code").css("background-position", "-120px 0px");
    $(".bbedit-quote").css("background-position", "-140px 0px");
    $(".bbedit-smiles").css("background-position", "-163px 0px");
    $(".bbedit-user").css("background-position", "-190px 0px");
    $(".bbedit-torrent").css("background-position", "-215px 0px");
}

waitForKeyElements (".bbedit-toolbar", changeToolbar);