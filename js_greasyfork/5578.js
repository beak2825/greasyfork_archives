// ==UserScript==
// @name           Reddit - Load 'Continue this thread' inline
// @description    Changes 'Continue this thread' links to insert the linked comments into the current page
// @author         James Skinner <spiralx@gmail.com> (http://github.com/spiralx)
// @namespace      http://spiralx.org/
// @version        2.3.3
// @license        MIT
// @icon           data:image/png;base64,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
// @match          *://*.reddit.com/r/*/comments/*
// @match          *://*.reddit.com/user/*/comments/*
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_setValue
// @grant          GM_registerMenuCommand
// @grant          GM_addStyle
// @grant          GM_addValueChangeListener
// @grant          GM.getValue
// @grant          GM.setValue
// @grant          GM.deleteValue
// @grant          GM.registerMenuCommand
// @grant          GM.addStyle
// @grant          GM.addValueChangeListener
// @run-at         document-end
// @require        https://unpkg.com/jquery@3/dist/jquery.min.js
// @require        https://unpkg.com/mutation-summary@1/dist/umd/mutation-summary.js
// @require        https://greasyfork.org/scripts/371339-gm-webextpref/code/GM_webextPref.js?version=961539
// @downloadURL https://update.greasyfork.org/scripts/5578/Reddit%20-%20Load%20%27Continue%20this%20thread%27%20inline.user.js
// @updateURL https://update.greasyfork.org/scripts/5578/Reddit%20-%20Load%20%27Continue%20this%20thread%27%20inline.meta.js
// ==/UserScript==

/* jshint asi: true, esnext: true, laxbreak: true */
/* global jQuery, MutationSummary, GM_webextPref */

/*
==== 2.3.3 (2022.10.13) ====
* Actually fix bug supposedly fixed by previous version...

==== 2.3.2 (2022.08.28) ====
* Fix bug where clicking on "Continue this thread" after hover loading was triggered would open the comment's page

==== 2.3.1 (2022.06.26) ====
* Use GM_webextPref library to support Greasemonkey 4 users

==== 2.3.0 (2022.05.03) ====
* Fix centred text in expand links
* Add configuration for expanding links by moving the mouse over the text "Continue this thread" or "Load more comments"

==== 2.2.1 (2022.05.02) ====
* Make expand links a block again so they stretch across whole width

==== 2.2.0 (2022.05.01) ====
* Use MonkeyConfig library to provide settings for intersection observer behaviour
* CHanged styling of expandos and replaced icon with emoji ↘️

==== 2.1.0 (2022.04.17) ====
* Use IntersectionObserver to automatically open "Load more comments" when they scroll into view
* Put above behaviour behind USE_INTERSECTION_OBSERVER feature flag

==== 2.0.0 (2022.04.02) ====
* Added MIT license
* Expand non-top level collapsed comments on load
* Expand collapsed comments inserted from clicking "Load more comments" or "Continue this thread"
* Script now also runs on posts made to a user's homepage
* Remove old code handling "Load more comments" links
* Tidied up old code and updated to use current JS features

==== 1.9.7 (2021.11.05) ====
* Use MutationSummary from unpkg.com instead of Greasyfork

==== 1.9.6 (2020.08.08) ====
* Reduced size of load more links compared to comment text
* Fixed script icon
* Removed some unnecessary code

==== 1.9.5 (2018.07.11) ====
* Updated jQuery to v3 and source from unpkg.com
* Add downloadURL to update from Gist

==== 1.9.4 (2018.02.11) ====
* Added @icon field in metadata as SVG wasn't displaying on the installed userscript page

==== 1.9.3 (2017.12.03) ====
* Changed base-64 encoded PNG icons to an SVG icon

==== 1.9.2 (2017.10.11) ====
* Gets correct comment ID for links
* Changed location in comment HTML to use as its root
* Get children of first comment when it is already on the page

==== 1.9.1 (2017.10.11) ====
* Fix broken $target selector

==== 1.9.0 ====
* Catch failed loads, log them to the console and then restore original load link

*/

; (async ($, MutationSummary) => {

  const config = GM_webextPref({
    navbar: false,
    default: {
      autoExpandWhenVisible: false,
      expandOnMouseOver: false,
      expandOnMouseOverDelay: 500,
    },
    body: [
      {
        key: 'autoExpandWhenVisible',
        label: 'Automatically expand any links when they come into view?',
        type: 'checkbox',
      },
      {
        key: 'expandOnMouseOver',
        label: 'Expand links when you move the mouse over them?',
        type: 'checkbox',
      },
      {
        key: 'expandOnMouseOverDelay',
        label: 'Delay between when you move the mouse over a link and it expands (ms)',
        type: 'number',
      },
    ],
    onSave(newSettings) {
      settings = newSettings
      createOrDestroyIntersectionObserver()
      addOrRemoveMouseoverHandler()
    },
  })

  await config.ready()

  config.on('change', changedSettings => {
    settings = { ...settings, ...changedSettings }
    createOrDestroyIntersectionObserver()
    addOrRemoveMouseoverHandler()
  })

  let settings = config.getAll()

  // --------------------------------------------------------------------

  $.fn.extend({
    spinner(options) {
      options = {
        replace: true,
        mode: 'append',
        steps: 3,
        size: 24,
        colour: '#28f',
        step_duration: 0.25,
        ...options
      }

      const $spinner = $('<div class="pulsar-horizontal"></div>')
        .css({
          padding: `${options.size * 0.25}px`,
          height: `${options.size}px`
        })

      const total_duration = (options.steps + 1) * options.step_duration

      for (let i = 0; i < options.steps; i++) {
        const delay = i * options.step_duration

        $('<div></div>')
          .css({
            width: `${options.size}px`,
            height: `${options.size}px`,
            backgroundColor: options.colour,
            animationDuration: `${total_duration}s`,
            animationDelay: `${delay}s`
          })
          .appendTo($spinner)
      }

      if (options.replace) {
        this.empty()
      }

      return options.mode === 'prepend'
        ? this.prepend($spinner)
        : this.append($spinner)
    },

    log(name = '$') {
      const title = [ `%c${name}%c : %c${this.length}%c ${this.length > 1 ? 'items' : 'item'}`, 'font-weight: bold', '', 'color: #05f', '' ]

      if (this.length > 0) {
        console.group(...title)
        console.info(this)
        console.groupEnd()
      } else {
        console.info(...title)
      }

      return this
    }
  })

  // --------------------------------------------------------------------

  async function loadAndInsertComments(cid, $span, $target) {
    $target.data('loading', 'true')
    $span.spinner()

    const data = await $.get(postUrl + cid)

    const $comments = $('.nestedlisting > .thing > .child > .sitetable', data)

    $target
      .empty()
      .append($comments)
      .find('.usertext.border .usertext-body')
        .css('animation', 'fadenewpost 4s ease-out 4s both')
  }

  // --------------------------------------------------------------------

  function getCommentId(linkElem) {
    const m = linkElem.pathname.match(/\/([a-z0-9]+)\/?$/)
    if (!m) {
      throw new Error(`No comment ID parsed from link URL "${linkElem.href}"`)
    }
    return m[1]
  }

  // --------------------------------------------------------------------

  function processDeepThreadSpans(deepThreadSpans) {
    const $deepThreadSpans = $(deepThreadSpans)
      .filter(':not([data-comment-ids])')

    // console.info(`processDeepThreadSpans: processing ${$deepThreadSpans.length}/${deepThreadSpans.length} deep thread spans`)

    $deepThreadSpans.each(function () {
      const $span = $(this)
      const $target = $span.closest('.child')

      const $a = $span.children('a')
      const cid = getCommentId($a[ 0 ])

      let first = true

      $span
        .attr('data-comment-ids', cid)
        .addClass('expand-inline')

      $a
        .wrapInner('<span class="expand-text"></span>')
        .on('click', event => {
          const loading = $target.data('loading')

          if (first && !loading) {
            first = false
            loadAndInsertComments(cid, $span, $target)
          }

          return false
        })
    })
  }

  // --------------------------------------------------------------------

  function uncollapseComments($collapsedComments) {
    $collapsedComments
      .removeClass('collapsed')
      .addClass('noncollapsed')
      .find('> .entry .tagline .expand')
        .text('[-]')
  }

  function uncollapseAllComments($collapsedComments, depth = 3) {
    // console.log($collapsedComments, depth)

    if ($collapsedComments.length > 0 && depth > 0) {
      uncollapseComments($collapsedComments)

      requestAnimationFrame(() => {
        uncollapseAllComments($collapsedComments.find('.thing.comment.collapsed'), depth - 1)
      })
    }
  }

  // --------------------------------------------------------------------

  const rootUrl = `https://${location.hostname}/`
  const postUrl = $('.thing.link > .entry a.comments').prop('href')

  // console.info(`%cSite:%c ${rootUrl}\n%cPost:%c ${postUrl}`, 'font-weight: bold', '', 'font-weight: bold', '')

  // --------------------------------------------------------------------

  let intersectionObserver = null

  function createOrDestroyIntersectionObserver() {
    if (settings.autoExpandWhenVisible && !intersectionObserver) {
      intersectionObserver = new IntersectionObserver(
        (entries, observer) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.click()
              observer.unobserve(entry.target)
            }
          }
        },
        {
          threshold: 0.5
        }
      )

      $('span.morecomments, span.deepthread').each(function() {
        intersectionObserver.observe(this.firstElementChild)
      })

      console.log('IntersectionObserver created')
    } else if (!settings.autoExpandWhenVisible && intersectionObserver) {
      intersectionObserver.disconnect()
      intersectionObserver = null
      console.log('IntersectionObserver destroyed')
    }
  }

  createOrDestroyIntersectionObserver()

  // --------------------------------------------------------------------

  function addOrRemoveMouseoverHandler() {
    $('.commentarea').off('mouseenter.spiralx')

    if (settings.expandOnMouseOver) {
      const hoveredElems = new WeakMap()

      $('.commentarea')
        .on('mouseenter.spiralx', '.expand-text', function() {
          const elem = this

          const timeoutId = setTimeout(() => {
            hoveredElems.delete(elem)
            elem.click()
          }, settings.expandOnMouseOverDelay)

          hoveredElems.set(elem, timeoutId)
        })
        .on('mouseleave.spiralx', '.expand-text', function() {
          const timeoutId = hoveredElems.get(this)

          if (timeoutId) {
            clearTimeout(timeoutId)
            hoveredElems.delete(this)
          }
        })
    }
  }

  addOrRemoveMouseoverHandler()

  // --------------------------------------------------------------------

  function markAsExpand(selectorOrElements, observe = true) {
    const $elems = $(selectorOrElements)
      .addClass('expand-inline')
      .children('a')
      .wrapInner('<span class="expand-text"></span>')

    if (intersectionObserver) {
      $elems.each(function() {
        intersectionObserver.observe(this.firstElementChild)
      })
    }
  }

  // --------------------------------------------------------------------

  // Uncollapse non-top level comments on page load
  uncollapseAllComments($('.thing.comment .thing.comment.collapsed'))

  const observer = new MutationSummary({
    callback([ deepThreadSpans, moreCommentsSpans, comments ]) {
      // console.log(`Added ${deepThreadSpans.added.length} deep thread spans and ${moreCommentsSpans.added.length} more comment spans`)

      markAsExpand(moreCommentsSpans.added)

      processDeepThreadSpans(deepThreadSpans.added)

      const $collapsedComments = $(comments.added).filter('.collapsed')
      uncollapseAllComments($collapsedComments)
    },
    rootNode: document.body,
    queries: [
      { element: 'span.deepthread' },
      { element: 'span.morecomments' },
      { element: '.thing.comment' },
    ]
  })

  // To process spans in the HTML source
  markAsExpand('span.morecomments', false)

  processDeepThreadSpans($('span.deepthread'))

  // --------------------------------------------------------------------

  $(document.body).append(`<style type="text/css">
    .expand-inline {
      display: block;
      padding: 0;
    }
    .expand-inline:after {
      display: none !important;
    }
    .expand-inline a {
      display: block;
      text-align: left;
    }
    .expand-inline a:before {
      content: "↘️";
      padding-right: 0.4em;
    }
    .expand-inline a:hover {
      background-color: rgba(0, 105, 255, 0.05);
      text-decoration: none;
    }
    .pulsar-horizontal {
      display: inline-block;
    }
    .pulsar-horizontal > div {
      display: inline-block;
      border-radius: 100%;
      animation-name: pulsing;
      animation-timing-function: ease-in-out;
      animation-iteration-count: infinite;
      animation-fill-mode: both;
    }
    @keyframes pulsing {
      0%, 100% {
        transform: scale(0);
        opacity: 0.5;
      }
      50% {
        transform: scale(1);
        opacity: 1;
      }
    }
    @keyframes fadenewpost {
      0% {
        background-color: #ffc;
        padding-left: 5px;
      }
      100% {
        background-color: transparent;
        padding-left: 0;
      }
    }
  </style>`)

})(jQuery, MutationSummary?.MutationSummary)

jQuery.noConflict(true)
