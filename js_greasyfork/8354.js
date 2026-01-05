// ==UserScript==
// @name          Manga Loader
// @description   Load all manga in current page, only available on 178.com and dm5.com
// @author        Chris (http://chrisyip.im)
// @include       http://*.178.com/*
// @include       http://*.dm5.com/*
// @include       http://*.dmzj.com/*
// @include       http://www.manhua8.com/manhua/*
// @include       http://www.manhua8.net/manhua/*
// @include       http://www.manhua1.com/manhua/*
// @include       http://www.manhua2.com/manhua/*
// @include       http://www.073.cc/mmm/*
// @include       http://www.476.cc/anime/*
// @include       http://www.tuku.cc/comic/*
// @version       1.3.21
// @namespace https://greasyfork.org/users/8856
// @downloadURL https://update.greasyfork.org/scripts/8354/Manga%20Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/8354/Manga%20Loader.meta.js
// ==/UserScript==

/* global $ */

(function (window) {
  'use strict'

  var style, script, init, resize

  var MutationObserver = window.MutationObserver || window.WebKitMutationObserver

  resize = function () {
    document.body.style.width = getComputedStyle(document.querySelector('html')).width
  }

  init = function () {
    'use strict'

    let load_dm5, load_178, load_manhua8, load_073, selector, callback
    let SetBookmarker = window.SetBookmarker
    let ajaxloadimage = window.ajaxloadimage
    let nextChapterMsgBox = window.nextChapterMsgBox

    load_dm5 = function () {
      if (!/^\/m\d+/.test(location.pathname)) {
        return
      }

      var reNotAllowedImage = /\d+_\d{5,}/

      var next_chapter_box = document.createElement('div')
      next_chapter_box.id = 'next_chapter_box'
      next_chapter_box.style.display = 'none'
      next_chapter_box.innerHTML = '<a class="close">X</a><p>已经是最后一页。<a class="add-bookmark">加入书签</a>。</p>'
      next_chapter_box.addEventListener('click', function (e) {
        if (e.target.className.includes('add-bookmark')) {
          this.style.display = 'none'
          SetBookmarker(window.DM5_CID, window.DM5_MID, window.DM5_IMAGE_COUNT, window.DM5_USERID)
        }
        if (e.target.className.includes('close')) {
          this.style.display = 'none'
        }
      }, false)

      function showEnd () {
        if (!next_chapter_box.hasAttribute('data-show')) {
          $.ajax({
            url: window.DM5_CURL_END,
            dataType: 'html',
            success: function (data) {
              var link = $(data).find('.finalPage a[href*="addbookmarker"]')
                          .siblings().find('[alt="继续阅读下一章"]').parent().get(0)
              var s = link ? '继续观看：' + link.outerHTML : '这已经是最新章节。'
              next_chapter_box.innerHTML += s
              document.body.appendChild(next_chapter_box)
              next_chapter_box.style.display = 'block'
              var rect = next_chapter_box.getBoundingClientRect()
              next_chapter_box.style.marginTop = '-' + rect.height / 2 + 'px'
              next_chapter_box.style.marginLeft = '-' + rect.width / 2 + 'px'
              next_chapter_box.setAttribute('data-show', true)
            },
            error: function () {
              location.href = window.DM5_CURL_END
            }
          })
        } else {
          return next_chapter_box.style.display === 'none' && (next_chapter_box.style.display = 'block')
        }
      }

      function initDM5 () {
        var container = document.createElement('div')
        container.classList.add('ml-image-container')

        container.addEventListener('click', function (e) {
          var node = e.target

          if (node.tagName !== 'IMG') {
            return
          }

          if (node.nextElementSibling) {
            var path = location.pathname.match(/^(\/m\d+)/)[1] + '-p' + (Math.floor(node.getAttribute('data-index')) + 1)
            location.href = path
          } else {
            showEnd()
          }
        }, false)

        var originalContainer = document.querySelector(selector)
        originalContainer.style.display = 'none'

        var cpImg = originalContainer.querySelectorAll('[id*=cp_image]')

        originalContainer.parentElement.insertBefore(container, originalContainer)

        let pager = document.getElementById('search_fy')
        let pages = pager.children

        let currentPage = pager.querySelector('.current')

        currentPage = currentPage ? Math.floor(currentPage.textContent) : 1

        let lastPage = -1

        if (pages.length) {
          lastPage = Math.floor(pages[pages.length - 1].textContent)
        }

        var observer = new MutationObserver(function (mutationRecord) {
          mutationRecord.forEach(function (mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
              var addedNodes = [].filter.call(mutation.addedNodes, function (node) {
                return /cp_image/.test(node.id)
              })

              if (addedNodes.length > 0) {
                loadImage(addedNodes)
              }
            }
          })
        })

        function loadImage (nodes) {
          setTimeout(function () {
            if (currentPage > lastPage) {
              container.appendChild(nodes[0].cloneNode())
              return observer.disconnect()
            }

            var node

            if (nodes.length > 1) {
              node = [].filter.call(nodes, function (node) {
                return !reNotAllowedImage.test(node.src) && node.style.display !== 'none'
              })
            } else {
              node = nodes[0]
            }

            var img = document.createElement('img')
            img.setAttribute('data-index', currentPage)
            img.src = node.src
            container.appendChild(img)

            if (currentPage < lastPage) {
              window.DM5_PAGE = ++currentPage
              ajaxloadimage(originalContainer, false)
            }
          }, 200)
        }

        if (cpImg.length > 0) {
          loadImage(cpImg)
        }

        observer.observe(originalContainer, {
          attributes: true,
          childList: true
        })
      }

      function waiting () {
        setTimeout(function () {
          return document.querySelector(selector) ? initDM5() : waiting()
        }, 200)
      }

      waiting()
    }
    // end load_dm5

    load_178 = function () {
      var img = document.querySelector(selector)

      if (!img) {
        return
      }

      var parent = img.parentElement,
        currentPage = parseInt(document.querySelector('#jump_select2').value, 10),
        url_taste = /(.*\/\d+)(?:-\d+)?(\..*)/i.exec(location.href),
        url = {
          prefix: url_taste[1] + '-',
          format: url_taste[2]
        },
        callback = function () {
          var page = parseInt(this.getAttribute('data-index'), 10)
          if (page < window.COMIC_PAGE.page_count) {
            window.location.href = url.prefix + (page + 1) + url.format
            return
          }

          if ($('#next_chapter').size() > 0) {
            nextChapterMsgBox()
          } else {
            if (window.final_page_url) {
              window.location.href = window.final_page_url
              return
            }
            window.alert('你已经浏览完所有内容。')
            window.location.href = 'http://manhua.178.com'
          }
        }

      for (var i = currentPage, len = window.arr_pages.length, el; i < len; i++) {
        el = document.createElement('img')
        el.src = window.img_prefix + window.arr_pages[i]
        el.setAttribute('data-index', i + 1)
        el.addEventListener('mouseup', callback, false)
        parent.appendChild(el)
      }
    }

    load_manhua8 = function () {
      var img = document.querySelector(selector)

      if (!img) {
        return
      }

      var parent = img.parentElement,
        pager = document.querySelector('#topSelect'),
        total_page = pager.querySelector('option:last-child').value,
        current_page = parseInt(pager.value, 10),
        url_taste = /(.+?)(\d+)(\.[a-z]{3,4})$/i.exec(img.src),
        url = {
          prefix: url_taste[1],
          page_num_length: url_taste[2].length,
          format: url_taste[3]
        },
        formatURL = function (index) {
          index = String(index)
          var len = url.page_num_length - index.length
          while (len) {
            index = '0' + index
            len--
          }
          return url.prefix + index + url.format
        }

      while (++current_page <= total_page) {
        let el = document.createElement('img')
        el.classList.add('ImgComic')
        el.src = formatURL(current_page)
        el.setAttribute('data-index', current_page)
        parent.appendChild(el)
      }
    }

    load_073 = function () {
      $(function () {
        window.loadAllimg()
      })
    }

    function load_tuku () {
      function format_number (n, digit) {
        var s = String(n)

        for (var i = 0; i < digit; i++) {
          if (s.length < digit) {
            s = '0' + s
          }
        }

        return s
      }

      var imageContainer = document.querySelector('#imageShow')

      var container = document.createElement('div')
      container.classList.add('ml-image-container')
      imageContainer.parentElement.insertBefore(container, imageContainer)

      var pager = document.querySelector('select[name=select_page1]')
      var currentPage = pager.selectedIndex + 1
      var lastPage = pager.querySelectorAll('option').length

      let observer

      function run (node) {
        imageContainer.style.display = 'none'

        var img = node.querySelector('img')
        var clone = img.cloneNode()
        clone.removeAttribute('id')
        clone.removeAttribute('border')
        container.appendChild(clone)

        var url = clone.src
        var digit = url.slice(url.lastIndexOf('/') + 1)

        url = url.slice(0, url.lastIndexOf('/') + 1)
        digit = digit.slice(0, digit.lastIndexOf('.')).length

        while (currentPage++ < lastPage) {
          (function (index) {
            var clone = document.createElement('img')
            clone.src = url + format_number(index, digit) + '.jpg'
            clone.setAttribute('data-prefix', url + format_number(index, digit))
            clone.onerror = function () {
              this.src = clone.getAttribute('data-prefix') + '.png'
            }
            container.appendChild(clone)
          })(currentPage)
        }
        observer.disconnect()
      }

      observer = new MutationObserver(function (records) {
        records.forEach(function (mutation) {
          var node = mutation.addedNodes[0]

          if (!node || node.id !== 'comicNextA') {
            return
          }

          run(node)
        })
      })
      observer.observe(imageContainer, {
        attributes: true,
        childList: true
      })

      var targetButton = document.querySelector('.readPageBox .pages a')
      var button = document.createElement('button')
      button.classList.add('btn')
      button.type = 'button'
      button.textContent = 'Load Manga'
      button.addEventListener('click', function () {
        var elem = document.querySelector('#comicNextA')
        if (elem) {
          run(elem)
        }
      }, false)
      targetButton.parentElement.insertBefore(button, targetButton)
    }

    if (/dmzj\.com|178\.com/.test(location.host)) {
      selector = 'img[id*=bigimg]'
      callback = load_178
    } else if (location.host.includes('dm5.com')) {
      selector = '#showimage'
      callback = load_dm5
    } else if (/manhua\d+.(com|net)/.test(location.host)) {
      selector = '#comicImg'
      callback = load_manhua8
    } else if (/(073|476).cc/.test(location.host)) {
      selector = 'body'
      callback = load_073
    } else if (/(tuku).cc/.test(location.host)) {
      selector = 'body'
      callback = load_tuku
    }

    var ready = function () {
      if (document.querySelector(selector)) {
        callback.call()
        return
      }

      if (document.readyState !== 'complete') {
        setTimeout(ready, 1000)
      }
    }

    ready()
  } // end init()

  document.body.style.minHeight = screen.availHeight + 100 + 'px'
  resize()
  window.addEventListener('resize', resize, false)
  document.body.style.minWidth = '980px'

  function styles () {
    /*
      .ml-image-container img,
      .content .ImgComic, .inner_img img, .manga_image {
        box-sizing: border-box;
        padding: 1px!important;
        border: 2px solid gray!important;
        margin: 0 auto 10px!important;
        display: block!important;
        max-width: 99%!important;
        width: auto!important;
        height: auto!important;
        cursor: pointer;
      }
      .ml-image-container {
        text-align: center;
      }
      #next_chapter_box {
        background: #333;
        position: fixed;
        top: 50%;
        left: 50%;
        margin: 0;
        z-index: 999999;
        padding: 20px;
        color: #fff;
        font-size: 16px;
        box-shadow: 0 0 15px #000;
        border-radius: 5px;
      }
      #next_chapter_box a {
        color: #FF4E00;
        cursor: pointer;
      }
      .close {
        position: absolute;
        top: 5px;
        right: 5px;
        font-size: 12px;
      }
      */
  }

  style = document.createElement('style')
  style.innerHTML = styles.toString().match(/\/\*([\S\s]+)\*\//)[1]
  document.head.appendChild(style)

  script = document.createElement('script')
  script.textContent = '(' + init.toString() + ')( window )'
  document.head.appendChild(script)
})(window)
