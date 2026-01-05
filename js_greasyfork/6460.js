// ==UserScript==
// @name        KAT - Highlight Blogger's Comments
// @namespace   HighlightComments
// @version     1.07
// @description Adds an icon next to a comment in a blog post, if they're the blogger
// @require https://greasyfork.org/scripts/6250-waitforkeyelements/code/waitForKeyElements.js?version=23756
// @match     http://kat.cr/blog/*/post/*/
// @match     https://kat.cr/blog/*/post/*/
// @downloadURL https://update.greasyfork.org/scripts/6460/KAT%20-%20Highlight%20Blogger%27s%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/6460/KAT%20-%20Highlight%20Blogger%27s%20Comments.meta.js
// ==/UserScript==

var temp = location.pathname;
temp = temp.split("/");
var user = temp[2];
var current = 0;
var blogger = '<img alt="blogger" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEUAAAAPCAYAAACyTgIjAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuM4zml1AAAAKzSURBVFhH7ZVraxNBFIb3P4mIIohUW0FERMQPgiLiB61SlcbEXqihMUkNYm0NaURDam2j1lLvVaqtVo0Xqi2GliAVQcE/YcqU52Rn3Q1D2GA/mQ687MycM7Nznj1n1lprPtrC/LS6ENim2o6tqysRM7HbGLwtEmgwLqoHxUJNZigm53qSjeFvW14uGR1N6mrZqD6/7hW9ehRWfeFdMt97fqcaz570+Haf2axejneq+XdX1fvJHtXfvduxdTSvV2OZZtlnbqZP3b/ZYlw3O3VJpXv2yXz2ykGZ04q0bpH36/HkWLus1fvUIhtFuQHkTqbd6GhSPNQgB6DPgb59yUg/FdurZp5EPL4LH1JqKHlYAOD7c3FYXWzbLjZ8n+YCArnzxAY1kjoi/fCpTer710EBwDqCHOw/JGsej7SKn/sdjNmLPR7eOq3yz+Ieu1/ZOGoHgtxQome3quLsdelXQiEr+Mp6jDg0SnQ0OjArRcYQvMlWDQp9zvDxRcJj9ysbiWXlp3JGh2oCyu+le6qQT8pTB1AJha/rHiMCoOTIAm3LDRwVyJQR4+kHXU7guoTIKMa8a2ku65SK3vNX8bbM8YEAznytspFYVqn0Rw2nyy/0K3emkOqLn9KSFZVQMpcPqLcTUWeMRm8cl8CuJfY7ELR+FIbkOXE36Llf3O+rlimUGeXqvrdqkY2k3GoF4z4kokQAUAmFS5AvyJMxNc+huZCBCYRkdI/jr6EQFNmgL0y/UOgD+5/LRzfAmBxNIkjKhoOSJRyICxEoOo0RwVBC3B2A48nfRu/Dxct6fIGFtI3LGX9slMTz0XMyz32kywdRKvhSktg5B3CBrvfyKxuFt5kcV0vVfpP8cZDJxgcgUJNttWVj8LZYsMnoXA+KBhvNUIqFN2I0LfqfFQ/tUMRuY1hr3mZZKztEhIRMPlEcAAAAAElFTkSuQmCC" />';

var owner = $('.commentownerLeft:eq(0)').find("a").html();
if (owner == user) { $('.commentownerLeft:eq(0)').append(blogger); }

function addIcon(jNode)
{
    $('.commentownerLeft:gt(' + current + ')').each(function()
    {
        owner = $(this).find("a").html();
        if (owner == user) { $(this).append(blogger); }
    });
    current = $('.commentownerLeft').length - 1;    
}

waitForKeyElements (".commentThread", addIcon);