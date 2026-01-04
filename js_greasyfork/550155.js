// ==UserScript==
// @name         通用网页图片灯箱(WebImageBox)
// @author       setube
// @namespace    https://github.com/setube/webImageBox
// @version      1.6.4
// @description  通用网页图片灯箱：旋转、缩放、拖拽、切换、单张/批量下载，让你看图下图不再受限
// @match        *://*/*
// @require      https://registry.npmmirror.com/fflate/0.8.2/files/umd/index.js
// @require      https://unpkg.com/qmsg@1.4.0/dist/index.umd.js
// @resource     iconFontCSS https://at.alicdn.com/t/c/font_5026690_6mvd6y6o6pr.css
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      *
// @license      Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/550155/%E9%80%9A%E7%94%A8%E7%BD%91%E9%A1%B5%E5%9B%BE%E7%89%87%E7%81%AF%E7%AE%B1%28WebImageBox%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550155/%E9%80%9A%E7%94%A8%E7%BD%91%E9%A1%B5%E5%9B%BE%E7%89%87%E7%81%AF%E7%AE%B1%28WebImageBox%29.meta.js
// ==/UserScript==

;(function () {
  'use strict'
  // 读取资源
  const css = GM_getResourceText('iconFontCSS')
  // 注入到页面
  GM_addStyle(css)
  // 内联 CSS
  const style = document.createElement('style')

  style.textContent = `
  #myLightboxOverlay {
    position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);
    display:flex;flex-direction:column;justify-content:center;align-items:center;z-index:100;
    overflow:hidden;
  }
  .lb-main-container { position:relative; width:90%; height:70%; overflow:hidden; display:flex; justify-content:center; align-items:center; }
  .lb-main { max-width:100%; max-height:100%; position:absolute; }
  .lb-buttons { position:absolute; top:20px; right:20px; display:flex; gap:8px; z-index:100001; }
  .lb-buttons button { background: rgba(0,0,0,0.5); color:#fff; border:none; padding:6px 10px; cursor:pointer; border-radius:4px; }
  .lb-nav-button, .lb-buttons button {
    background: rgba(0,0,0,0.6); color: #fff; border: none; width: 34px; height: 34px; display: flex;
    justify-content: center; align-items: center; cursor: pointer; border-radius: 50%; transition: background 0.3s, transform 0.2s;
  }
  .lb-nav-button:hover, .lb-buttons button:hover { background: rgba(255,255,255,0.2); }
  button svg { pointer-events: none; }
  .lb-prev { position: fixed; left:20px; top:50%; transform:translateY(-50%); }
  .lb-next { position: fixed; right:20px; top:50%; transform:translateY(-50%); }
  .lb-thumbs { display:flex; gap:5px; margin-top:10px; overflow-x:auto; max-width:90%; }
  .lb-thumbs::-webkit-scrollbar { display: none; }
  .lb-thumbs img { height:60px; cursor:pointer; opacity:0.5; transition:0.3s; flex-shrink:0; }
  .lb-thumbs img.active { opacity:1; border:2px solid #fff; }
  .qmsg { z-index: 100002; }
  @media (max-width: 768px) {
    .lb-nav-button:hover, .lb-buttons button:hover { background: rgba(0,0,0,0.6); }
  }
  `
  document.head.appendChild(style)

  // 创建遮罩和主图片容器
  const overlay = document.createElement('div')
  overlay.id = 'myLightboxOverlay'
  overlay.style.display = 'none'

  const mainContainer = document.createElement('div')
  mainContainer.className = 'lb-main-container'

  const lbImg = document.createElement('img')
  lbImg.className = 'lb-main'
  mainContainer.appendChild(lbImg)
  overlay.appendChild(mainContainer)

  // 控制按钮（右上角）
  const controls = document.createElement('div')
  controls.className = 'lb-buttons'

  const btnConfig = [
    { title: '左旋转', icon: 'undo' },
    { title: '右旋转', icon: 'redo' },
    { title: '放大', icon: 'fullscreen' },
    { title: '缩小', icon: 'fullscreen-exit' },
    { title: '下载', icon: 'download' },
    { title: '下载所有', icon: 'file-zip' },
    { title: 'Github', icon: 'github-fill' },
    { title: '关闭', icon: 'close' }
  ]

  btnConfig.forEach(cfg => {
    const btn = document.createElement('button')
    btn.title = cfg.title
    btn.className = `iconfont icon-${cfg.icon}`
    controls.appendChild(btn)
  })
  overlay.appendChild(controls)

  // 左右切换按钮
  const prevBtn = document.createElement('button')
  prevBtn.className = 'lb-prev lb-nav-button iconfont icon-left'
  prevBtn.title = '上一张'
  prevBtn.setAttribute('aria-label', '上一张')
  const nextBtn = document.createElement('button')
  nextBtn.className = 'lb-next lb-nav-button iconfont icon-right'
  nextBtn.title = '下一张'
  nextBtn.setAttribute('aria-label', '下一张')
  overlay.appendChild(prevBtn)
  overlay.appendChild(nextBtn)

  // 缩略图列表
  const thumbBar = document.createElement('div')
  thumbBar.className = 'lb-thumbs'
  overlay.appendChild(thumbBar)

  document.body.appendChild(overlay)

  // 图片数组
  let imgs = []
  let currentIndex = 0
  let rotation = 0
  let scale = 1
  const imgStates = new Map() // key: 图片 src, value: { rotation, scale }

  // 图片切换动画参数
  let isAnimating = false

  const updateTransform = () => {
    lbImg.style.transform = `rotate(${rotation}deg) scale(${scale})`
  }

  // 缩略图居中
  const updateThumbs = () => {
    thumbBar.innerHTML = ''
    imgs.forEach((img, i) => {
      const thumb = document.createElement('img')
      thumb.src = img.src
      if (i === currentIndex) thumb.classList.add('active')
      thumb.addEventListener('click', () => showImage(i))
      thumbBar.appendChild(thumb)
    })

    // 缩略图滚动条，让当前图片居中
    const activeThumb = thumbBar.querySelector('img.active')
    if (activeThumb) {
      const offset = activeThumb.offsetLeft + activeThumb.offsetWidth / 2 - thumbBar.clientWidth / 2
      thumbBar.scrollTo({ left: offset, behavior: 'smooth' })
    }
  }

  // 打开灯箱
  const showImage = (index, direction = 0) => {
    if (imgs.length === 0 || isAnimating) return
    currentIndex = (index + imgs.length) % imgs.length
    // 获取该图片的状态，如果没有则初始化
    const state = imgStates.get(imgs[currentIndex].src) || { rotation: 0, scale: 1 }
    rotation = state.rotation
    scale = state.scale

    isAnimating = true
    const newSrc = imgs[currentIndex].src
    if (lbImg.src) {
      const tempImg = document.createElement('img')
      tempImg.src = newSrc
      tempImg.style.position = 'absolute'
      tempImg.style.maxWidth = '100%'
      tempImg.style.maxHeight = '100%'
      tempImg.style.left = direction >= 0 ? '100%' : '-100%'
      tempImg.style.top = 'auto'
      mainContainer.appendChild(tempImg)

      setTimeout(() => {
        tempImg.style.left = 'auto'
        lbImg.style.left = direction >= 0 ? '-100%' : '100%'
      }, 50)

      setTimeout(() => {
        lbImg.src = newSrc
        lbImg.style.left = 'auto'
        mainContainer.removeChild(tempImg)
        updateTransform()
        overlay.style.display = 'flex'
        updateThumbs()
        isAnimating = false
      }, 50)
    } else {
      lbImg.src = newSrc
      overlay.style.display = 'flex'
      updateThumbs()
      isAnimating = false
    }
  }

  const isSmallOrAvatar = img => {
    // 跳过灯箱内部的缩略图和主图
    if (img.closest('#myLightboxOverlay')) return
    // 忽略头像、小图、被广告插件屏蔽的图片
    if (
      !img.complete ||
      !img.naturalWidth ||
      !img.naturalHeight ||
      !img.width ||
      !img.height ||
      img.width < 100 ||
      img.height < 100
    )
      return false
    // 图片元素必须在页面中可见
    const rect = img.getBoundingClientRect()
    if (!rect.width || !rect.height) return false
    // CSS 隐藏或无尺寸
    const style = getComputedStyle(img)
    if (style.display === 'none' || style.visibility === 'hidden') return false
    const keywords = [
      'icon',
      'ico',
      'avatar',
      'ava',
      'emoji',
      'biaoqing',
      'logo',
      'btn',
      'button',
      'qrcode',
      'advertisement',
      'ads',
      'promotation'
    ]
    const checkString = str => keywords.some(k => (str || '').toLowerCase().includes(k))
    // 检查 img 本身
    if (checkString(img.src) || checkString(img.className) || checkString(img.id)) return false
    for (let attr of img.attributes) {
      if (checkString(attr.value)) return false
    }
    // 检查父 a 标签
    let parent = img.parentElement
    while (parent) {
      if (checkString(parent.href) || checkString(parent.className) || checkString(parent.id)) return false
      parent = parent.parentElement
    }
    return true
  }

  // 设置图片，过滤重复（按 URL 或文件名）
  const setupImages = () => {
    const pageImgs = Array.from(document.querySelectorAll('img'))
    const uniqueSrc = new Set()
    const uniqueName = new Set()
    imgs = []
    pageImgs.forEach(img => {
      if (!isSmallOrAvatar(img)) return
      const fileName = img.src.split('/').pop()
      if (!uniqueSrc.has(img.src) && !uniqueName.has(fileName)) {
        uniqueSrc.add(img.src)
        uniqueName.add(fileName)
        imgs.push(img)
        // 避免重复绑定
        if (!img.dataset.lb) {
          img.dataset.lb = 'true'
          img.style.cursor = 'zoom-in'
          // 绑定点击事件，打开灯箱
          img.addEventListener('click', e => {
            e.preventDefault()
            e.stopPropagation()
            const index = imgs.indexOf(img)
            openLightbox(index)
          })
        }
      }
    })
  }

  const openLightbox = index => {
    if (imgs.length === 0) return
    currentIndex = index
    rotation = 0
    scale = 1
    // 显示 overlay，初始化透明度和缩放
    overlay.style.display = 'flex'
    overlay.style.opacity = '0'
    lbImg.style.opacity = '0'
    lbImg.src = imgs[currentIndex].src
    // 强制浏览器渲染
    requestAnimationFrame(() => {
      overlay.style.transition = 'opacity 0.35s'
      overlay.style.opacity = '1'
      lbImg.style.transition = 'transform 0.35s, opacity 0.35s'
      lbImg.style.opacity = '1'
      overlay.style.transition = ''
      lbImg.style.transition = ''
    })
    updateThumbs()
    lockBodyScroll()
  }

  const closeLightbox = () => {
    // 淡出动画
    overlay.style.opacity = '0'
    lbImg.style.opacity = '0'
    setTimeout(() => {
      overlay.style.display = 'none'
      // 重置样式，确保下一次打开动画生效
      lbImg.style.transition = ''
      lbImg.style.opacity = '0'
    }, 350)
    unlockBodyScroll()
  }

  const lockBodyScroll = () => {
    // 保存当前滚动位置
    const scrollY = window.scrollY
    // 阻止页面滚动
    document.body.style.overflow = 'hidden'
    document.body.dataset.scrollY = scrollY // 保存 scrollY 方便解锁
  }

  const unlockBodyScroll = () => {
    const scrollY = document.body.dataset.scrollY || 0
    document.body.style.overflow = 'auto'
    window.scrollTo(0, scrollY)
  }

  const observer = new MutationObserver(setupImages)
  observer.observe(document.body, { childList: true, subtree: true })
  setupImages()

  // 控制按钮事件
  const [rotateL, rotateR, zoomIn, zoomOut, download, downloadAll, github, closeBtn] =
    controls.querySelectorAll('button')

  // 左旋转按钮
  rotateL.addEventListener('click', () => {
    rotation -= 90
    imgStates.set(lbImg.src, { rotation, scale })
    updateTransform()
  })

  // 右旋转按钮
  rotateR.addEventListener('click', () => {
    rotation += 90
    imgStates.set(lbImg.src, { rotation, scale })
    updateTransform()
  })

  // 放大按钮
  zoomIn.addEventListener('click', () => {
    scale *= 1.2
    imgStates.set(lbImg.src, { rotation, scale })
    updateTransform()
  })

  // 缩小按钮
  zoomOut.addEventListener('click', () => {
    scale /= 1.2
    imgStates.set(lbImg.src, { rotation, scale })
    updateTransform()
  })

  // 打开 Github
  github.addEventListener('click', () => {
    window.open('https://github.com/setube/webImageBox', '_blank')
  })

  // 关闭按钮
  closeBtn.addEventListener('click', closeLightbox)

  const fetchBlob = url => {
    const Referer = new URL(url).origin
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url,
        headers: {
          Referer
        },
        responseType: 'blob',
        onload: res => resolve(res.response),
        onerror: err => reject(err)
      })
    })
  }

  // 单张下载
  download.addEventListener('click', async () => {
    try {
      let blob, filename
      const src = lbImg.src
      if (src.startsWith('data:')) {
        const [header, data] = src.split(',')
        const mimeMatch = header.match(/:(.*?)(;|$)/)
        const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream'
        if (header.includes('base64')) {
          // base64 解码
          const bstr = atob(data)
          const n = bstr.length
          const u8arr = new Uint8Array(n)
          for (let i = 0; i < n; i++) u8arr[i] = bstr.charCodeAt(i)
          blob = new Blob([u8arr], { type: mime })
        } else {
          // URI 编码解码（如 SVG）
          blob = new Blob([decodeURIComponent(data)], { type: mime })
        }
        // 自动扩展名
        let ext = 'png'
        if (mime === 'image/png') ext = 'png'
        else if (mime === 'image/jpeg') ext = 'jpg'
        else if (mime === 'image/svg+xml') ext = 'svg'
        else if (mime.includes('/')) ext = mime.split('/')[1]
        filename = `image.${ext}`
      } else if (src.startsWith('blob:')) {
        blob = await fetchBlob(src)
        const mime = blob.type || 'image/png'
        let ext = mime.includes('/') ? mime.split('/')[1] : 'png'
        filename = `image.${ext}`
      } else {
        const cleanUrl = src.split('?')[0]
        try {
          blob = await fetchBlob(cleanUrl)
          const mime = blob.type || 'image/png'
          let ext = mime.includes('/') ? mime.split('/')[1] : 'png'
          filename = cleanUrl.split('/').pop() || `image.${ext}`
        } catch (err) {
          Qmsg.error('无法下载 URL:' + cleanUrl)
          console.error('无法下载 URL:', cleanUrl, err)
          return // 直接退出，不触发下载
        }
      }
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      Qmsg.success('图片下载成功！')
    } catch (err) {
      Qmsg.error('下载失败:' + src)
      console.error('下载失败', err)
    }
  })

  // 下载相册
  downloadAll.addEventListener('click', async () => {
    if (!window.fflate) {
      Qmsg.error('fflate未加载，请稍等')
      return
    }

    let dataUrlCount = 1
    const zipFiles = {}
    const total = imgs.length
    let completed = 0

    // 显示加载条
    const loadingMsg = Qmsg.loading(`正在下载图片 0/${total} ...`)

    // 构建下载任务
    const tasks = imgs.map(async img => {
      try {
        const src = img.src
        let uint8arr, filename

        if (src.startsWith('data:')) {
          const [header, data] = src.split(',')
          const mimeMatch = header.match(/:(.*?)(;|$)/)
          const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream'

          if (header.includes('base64')) {
            const bstr = atob(data)
            const n = bstr.length
            uint8arr = new Uint8Array(n)
            for (let i = 0; i < n; i++) uint8arr[i] = bstr.charCodeAt(i)
          } else {
            const decoded = decodeURIComponent(data)
            uint8arr = new Uint8Array(decoded.length)
            for (let i = 0; i < decoded.length; i++) uint8arr[i] = decoded.charCodeAt(i)
          }

          let ext = mime.split('/')[1] || 'bin'
          if (mime === 'image/svg+xml') ext = 'svg'
          filename = `image_${dataUrlCount++}.${ext}`
        } else if (src.startsWith('blob:')) {
          Qmsg.warn('blob URL 图片无法下载，已跳过')
          return
        } else {
          let cleanUrl = src.split('?')[0].replace(/\/([^\/]+):[^\/]+$/, '/$1')
          try {
            const blob = await fetchBlob(cleanUrl)
            const arrayBuffer = await blob.arrayBuffer()
            uint8arr = new Uint8Array(arrayBuffer)

            const mime = blob.type || 'image/png'
            let ext = mime.split('/')[1] || 'png'
            if (mime === 'image/svg+xml') ext = 'svg'
            const baseName = cleanUrl.split('/').pop()
            filename = baseName.includes('.') ? baseName : `image_${dataUrlCount++}.${ext}`
          } catch (err) {
            Qmsg.error('无法下载 URL: ' + cleanUrl)
            console.warn('无法下载 URL:', cleanUrl, err)
            return
          }
        }
        zipFiles[filename] = uint8arr
      } catch (err) {
        console.warn('下载失败:', img.src, err)
      } finally {
        // 更新进度
        completed++
        loadingMsg.setText(`正在下载图片 ${completed}/${total} ...`)
      }
    })
    await Promise.all(tasks)
    loadingMsg.setText(`图片下载完成，正在生成 ZIP...`)
    try {
      const zipped = fflate.zipSync(zipFiles)
      const blob = new Blob([zipped], { type: 'application/zip' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'album.zip'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      Qmsg.success('批量下载任务完成！')
    } catch (err) {
      Qmsg.error('生成 ZIP 失败')
      console.error(err)
    } finally {
      loadingMsg.close()
    }
  })

  // 左右切换
  prevBtn.addEventListener('click', () => showImage(currentIndex - 1, -1))
  nextBtn.addEventListener('click', () => showImage(currentIndex + 1, 1))

  // 点击背景或 ESC 关闭
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeLightbox()
  })

  window.addEventListener('keydown', e => {
    // 灯箱没打开就不处理
    if (overlay.style.display !== 'flex') return
    if (e.key === 'Escape') closeLightbox()
    else if (e.key === 'ArrowLeft') showImage(currentIndex - 1, -1)
    else if (e.key === 'ArrowRight') showImage(currentIndex + 1, 1)
  })

  // 滚轮缩放
  window.addEventListener(
    'wheel',
    e => {
      // 只有灯箱打开时才缩放
      if (overlay.style.display === 'flex') {
        e.preventDefault() // 阻止页面滚动
        const delta = e.deltaY || e.detail || e.wheelDelta
        if (delta < 0) {
          scale *= 1.1 // 放大
        } else {
          scale /= 1.1 // 缩小
        }
        updateTransform()
      }
    },
    { passive: false }
  )

  // 双击图片放大 / 恢复
  lbImg.addEventListener('dblclick', () => {
    scale = scale === 1 ? 2 : 1
    updateTransform()
  })

  let translateX = 0
  let translateY = 0
  let isDragging = false
  let dragStartX = 0
  let dragStartY = 0
  let spacePressed = false

  // 阻止浏览器默认拖拽图片
  lbImg.addEventListener('dragstart', e => {
    // 灯箱没打开就不处理
    if (overlay.style.display !== 'flex') return
    e.preventDefault()
  })

  // 监听空格键
  document.addEventListener('keydown', e => {
    // 灯箱没打开就不处理
    if (overlay.style.display !== 'flex') return
    if (e.code === 'Space') {
      e.preventDefault() // 阻止页面滚动
      spacePressed = true
      lbImg.style.cursor = 'grab'
    }
  })

  // 监听空格键
  document.addEventListener('keyup', e => {
    // 灯箱没打开就不处理
    if (overlay.style.display !== 'flex') return
    if (e.code === 'Space') {
      spacePressed = false
      lbImg.style.cursor = '' // 恢复默认
    }
  })

  // 鼠标按下
  lbImg.addEventListener('mousedown', e => {
    // 灯箱没打开就不处理
    if (overlay.style.display !== 'flex') return
    if (!spacePressed) return
    e.preventDefault() // 阻止默认点击/拖拽行为
    isDragging = true
    dragStartX = e.clientX - translateX
    dragStartY = e.clientY - translateY
    lbImg.style.cursor = 'grabbing'
  })

  // 鼠标移动
  document.addEventListener('mousemove', e => {
    // 灯箱没打开就不处理
    if (overlay.style.display !== 'flex') return
    if (!isDragging) return
    translateX = e.clientX - dragStartX
    translateY = e.clientY - dragStartY
    lbImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale}) rotate(${rotation}deg)`
  })

  // 鼠标松开
  window.addEventListener('mouseup', () => {
    // 灯箱没打开就不处理
    if (overlay.style.display !== 'flex') return
    isDragging = false
    lbImg.style.cursor = spacePressed ? 'grab' : 'default'
  })
})()
