// ==UserScript==
// @name        Mikan-bgm-rating
// @description 在Mikan上显示Bangumi评分
// @match       https://mikanani.me/
// @match       https://mikanani.me/Home/Bangumi/*
// @match       https://mikan.tangbai.cc/
// @match       https://mikan.tangbai.cc/Home/Bangumi/*
// @version     1.0.3
// @author      Simon
// @license     MIT
// @supportURL  https://github.com/simon300000/userscripts/issues
// @namespace https://greasyfork.org/users/397026
// @downloadURL https://update.greasyfork.org/scripts/552814/Mikan-bgm-rating.user.js
// @updateURL https://update.greasyfork.org/scripts/552814/Mikan-bgm-rating.meta.js
// ==/UserScript==

const ONE_DAY = 24 * 60 * 60 * 1000
const ONE_MONTH = 30 * ONE_DAY

const wait = ms => new Promise(res => setTimeout(res, ms))

// 配置Mikan的主页和番组页面URL
const HOMEPAGES = [
  'https://mikanani.me/',
  'https://mikan.tangbai.cc/'
]
const BANGUMI_PAGES = [
  'https://mikanani.me/Home/Bangumi/',
  'https://mikan.tangbai.cc/Home/Bangumi/'
]

const accessCurrentCache = (key, param) => {
  const cacheKey = `mikan-cache-${key}-${param}`
  const cached = localStorage.getItem(cacheKey)
  if (cached) {
    return JSON.parse(cached).value
  }
}

const accessCache = async (key, param, func, cacheLife) => {
  const cacheKey = `mikan-cache-${key}-${param}`
  const cached = localStorage.getItem(cacheKey)
  if (cached) {
    const { value, timestamp } = JSON.parse(cached)
    if (Date.now() - timestamp < cacheLife) {
      return { value, hit: true }
    }
  }
  const result = await func(param)
  if (result) {
    localStorage.setItem(cacheKey, JSON.stringify({ value: result, timestamp: Date.now() }))
  }
  return { value: result, hit: false }
}

const getBGMSubjectFromDoc = doc => {
  const containers = doc.getElementsByClassName('bangumi-info')
  const subject = [...containers].filter(e => e.innerText.includes('Bangumi番组计划链接'))
  if (subject) {
    const a = [...subject[0].children].filter(e => e.tagName === 'A')[0]
    if (a) {
      const href = a.href
      const id = href.split('/subject/')[1]
      return { subject, id }
    }
  }
}

const getBGMSubject = async href => {
  const data = await fetch(href)
  const text = await data.text()
  const parser = new DOMParser()
  const doc = parser.parseFromString(text, 'text/html')
  return getBGMSubjectFromDoc(doc).id
}

const getBGMRating = async id => {
  const url = `https://api.bgm.tv/v0/subjects/${id}`
  const data = await fetch(url)
  if (data.status === 200) {
    const json = await data.json()
    return json.rating.score
  }
}

const getColorForScore = score => {
  if (score > 7.5) return '#e74c3c' // red
  if (score < 6) return '#95a5a6' // gray
  return '#f39c12' // orange
}

const showBGMRating = async (span, id) => {
  const rating = await accessCache('bgm-rating', id, getBGMRating, ONE_DAY)
  const { value: score, hit } = rating
  console.log('bgm id', id, 'rating', score, 'cache hit:', hit)
  if (score) {
    span.style.color = getColorForScore(score)
    span.innerText = `Bangumi评分: ${score}`
  }
  return hit
}

const showRatings = async hostname => {
  const divs = document.getElementsByClassName('an-info-group')

  const pending = []

  for (let i = 0; i < divs.length; i++) {
    const div = divs[i]
    const a = [...div.children].filter(e => e.tagName === 'A' && e.href.includes(hostname))[0]
    if (a) {

      const span = document.createElement('span')
      span.style.color = '#f39c12'
      span.style.fontWeight = 'bold'
      span.style.marginLeft = '8px'
      span.innerText = `Bangumi评分: ...`
      a.parentElement.appendChild(span)

      const { href } = a
      pending.push({ href, span })
    }
  }

  const pending2 = []

  for (const { href, span } of pending) {
    const { value: id, hit } = await accessCache('bgm-id', href, getBGMSubject, ONE_MONTH)
    if (!hit) {
      await wait(100)
    }
    console.log('mikan', href, 'bgm id', id, 'cache hit:', hit)
    if (id) {
      const currentRating = accessCurrentCache('bgm-rating', id)
      if (currentRating) {
        span.style.color = getColorForScore(currentRating)
        span.innerText = `Bangumi评分: ${currentRating}...`
      }
      if (hit) {
        pending2.push({ id, span })
      } else {
        showBGMRating(span, id)
      }
    }
  }

  for (const { id, span } of pending2) {
    const hit = await showBGMRating(span, id)
    if (!hit) {
      await wait(100)
    }
  }
}

const showRating = async () => {
  const { subject, id } = getBGMSubjectFromDoc(document)

  const br = document.createElement('br')
  subject.forEach(e => e.appendChild(br))
  const span = document.createElement('span')
  span.style.color = '#f39c12'
  span.style.fontWeight = 'bold'
  span.innerText = `Bangumi评分: ...`
  subject.forEach(e => e.appendChild(span))

  const { value: score, hit } = await accessCache('bgm-rating', id, getBGMRating, ONE_DAY)
  console.log('bgm id', id, 'rating', score, 'cache hit:', hit)
  if (score) {
    span.style.color = getColorForScore(score)
    span.innerText = `Bangumi评分: ${score}`
  }
}

console.log('Mikan-bgm-rating script loaded')
console.log('Current URL:', location.href)

if (HOMEPAGES.includes(location.href)) {
  showRatings(location.hostname)
}

if (BANGUMI_PAGES.some(prefix => location.href.startsWith(prefix))) {
  showRating()
}

