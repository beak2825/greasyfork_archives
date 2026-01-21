// ==UserScript==
// @name         GB20012026
// @namespace    http://tampermonkey.net/
// @version      2025-12-10
// @description  Gelbooru recommender desc
// @author       You
// @match        https://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gelbooru.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563403/GB20012026.user.js
// @updateURL https://update.greasyfork.org/scripts/563403/GB20012026.meta.js
// ==/UserScript==

document.body.style = ""
document.body.innerHTML = ""
document.head.innerHTML = ""
let style = document.createElement("style")
style.innerHTML = `
body{
  padding: 0;
  margin: 0;
  overflow: hidden;
  background-color: black;
}
.comparison-container {
  display: flex;
  flex-direction: column;  /* Changed from row to column */
  width: 100vw;
  height: 100vh;
}
.post-container {
  flex: 1;  /* Each container takes equal height */
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  width: 100vw;  /* Full width for both containers */
}
.responsiveMedia {
  max-height: 100%;
  max-width: 100%;
  object-fit: contain;
}
.voting-container {
  height: 0vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.vote-button {
  display: none;
  font-size: 24px;
  padding: 20px 40px;
  margin: 0 20px;
  cursor: pointer;
}
.notCurrentlyViewing{
  display: none;
}
.fullscreenButton{
    width: 7vh;
    height: 7vh;
    position: absolute;
    right: 0;
    top: 0;
}
.loadingIndicator{
    font-size: 2.5vh;
    color: white;
    position: absolute;
    left: 0;
    top:0;
}`
document.head.appendChild(style)

// Create main containers
let comparisonDiv = document.createElement("div")
comparisonDiv.className = "comparison-container"
let topContainer = document.createElement("div")
// Renamed from topContainer
topContainer.className = "post-container"
topContainer.id = "top-container"
// Changed ID
let bottomContainer = document.createElement("div")
// Renamed from bottomContainer
bottomContainer.className = "post-container"
bottomContainer.id = "bottom-container"
// Changed ID

// Create media elements for top side
let topImageImg = document.createElement("img")
let topVideoVideo = document.createElement("video")
topImageImg.className = "responsiveMedia"
topVideoVideo.className = "responsiveMedia"
topVideoVideo.classList.add("notCurrentlyViewing")

// Create media elements for bottom side
let bottomImageImg = document.createElement("img")
let bottomVideoVideo = document.createElement("video")
bottomImageImg.className = "responsiveMedia"
bottomVideoVideo.className = "responsiveMedia"
bottomVideoVideo.classList.add("notCurrentlyViewing")

// Append media elements to containers
topContainer.appendChild(topImageImg)
topContainer.appendChild(topVideoVideo)
bottomContainer.appendChild(bottomImageImg)
bottomContainer.appendChild(bottomVideoVideo)
topImageImg.draggable = false
bottomImageImg.draggable = false
topVideoVideo.controls = true
bottomVideoVideo.controls = true
let topClickEvent = () => {}
let bottomClickEvent = () => {}
topContainer.addEventListener('click', (e) => {
    e.preventDefault();
    topClickEvent(e)
    return false;
}
, true);
// Use capture phase to intercept before native handlers
let toplastclick = 0
topContainer.addEventListener("touchstart", e => {
    let now = Date.now()
    if (now - toplastclick < 500) {
        toplastclick = 0
        topClickEvent(e)
    } else {
        toplastclick = now
    }
    return false
}
, true)
bottomContainer.addEventListener('click', (e) => {
    e.preventDefault();
    bottomClickEvent(e)
    return false;
}
, true);
// Use capture phase to intercept before native handlers
let bottomlastclick = 0
bottomContainer.addEventListener("touchstart", e => {
    let now = Date.now()
    if (now - bottomlastclick < 500) {
        toplastclick = 0
        bottomClickEvent(e)
    }
    bottomlastclick = now
    return false
}
, true)
comparisonDiv.appendChild(topContainer)
comparisonDiv.appendChild(bottomContainer)
document.body.appendChild(comparisonDiv)
// Don't forget to append to body!
// Add everything to body
let fullscreenButton = document.createElement("div")
let div = document.createElement("div")
let svg = document.createElement("svg")
div.appendChild(svg)
svg.outerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="#fff" viewBox="0 0 16 16">\n    <path d="M14 3.414L9.414 8 14 12.586v-2.583h2V16h-6v-1.996h2.59L8 9.414l-4.59 4.59H6V16H0v-5.997h2v2.583L6.586 8 2 3.414v2.588H0V0h16v6.002h-2V3.414zm-1.415-1.413H10V0H6v2H3.415L8 6.586 12.585 2z" fill-rule="evenodd"/>\n</svg>`
div.className = "fullscreenButton"
let fullscreenEnabled = false
div.onclick = () => {
    if (fullscreenEnabled) {
        document.exitFullscreen()
    } else {
        document.body.requestFullscreen()
    }
    fullscreenEnabled = !fullscreenEnabled
}
document.body.appendChild(div)
let loadingIndicator = document.createElement("div")
loadingIndicator.className = "loadingIndicator"
document.body.appendChild(loadingIndicator)
document.body.appendChild(comparisonDiv)
// Helper function to update media display
function updateMediaDisplay(type, element) {
    let image = element.querySelector('img')
    let video = element.querySelector('video')

    if (type === "image") {
        image.classList.remove("notCurrentlyViewing")
        video.classList.add("notCurrentlyViewing")
        video.pause()
    } else {
        image.classList.add("notCurrentlyViewing")
        video.classList.remove("notCurrentlyViewing")
        video.play()
        video.loop = true
    }
}

Object.prototype.entries = function() {
    return Object.entries(this)
}
Array.prototype.entries = function() {
    return Object.entries(this)
}
Array.prototype.fromEntries = function() {
    return Object.fromEntries(this)
}
let prefs = {}
let topTags = []
let bottomTags = []
let topPostData = null
let bottomPostData = null

// Core functions
function sortByNEl(n, arrs) {
    console.log(arrs)
    return arrs.sort( (value1, value2) => value2[n] - value1[n])
}
function sortPrefArray(preferences, scorefunc=scoreFunction(defaultOffset)) {
    let arrs = preferences.map(i => [i[0], scorefunc(i[1])])
    return sortByNEl(1, arrs)
}
function sortPrefs(preferences, scorefunc=scoreFunction(defaultOffset)) {
    return sortPrefArray(preferences.entries(), scorefunc)
}
function tagToCost(tagArr, iterations) {
    return [tagArr[0], (iterations + 1) / prefs[tagArr[0]].seen]
}
let tagsToCosts = tags => tags.map( (i, iterations) => tagToCost(i, iterations))
function filterAvailableCosts(costs, currentBudget) {
    return sortByNEl(1, costs.filter( ([tag,cost]) => cost < currentBudget)).toReversed()
}
function stpagc(preferences, currentBudget) {
    let sorted = sortPrefs(preferences)
    let sortedToCosts = tagsToCosts(sorted)
    let firstCost = sortedToCosts[0][1]
    let normalizedCosts = sortedToCosts.map( ([tag,cost]) => [tag, cost / firstCost])
    let finalCosts = filterAvailableCosts(normalizedCosts, currentBudget)
    if (finalCosts.length == 0)
        return undefined
    let random = Math.random()
    let iterations = 0
    let firstChance = 1 / 10
    while (random < (1 - firstChance)) {
        iterations++
        random *= 1 / (1 - firstChance)
    }
    if (iterations >= finalCosts.length)
        iterations = finalCosts.length - 1
    return {
        chosen: finalCosts[iterations][0],
        cost: finalCosts[iterations][1]
    }
}
function gtubro(preferences) {
    if (preferences.entries().length == 0)
        return []
    let tempBudget = budget
    let tags = []
    let stuck = 0
    while (true) {
        let tag = stpagc(preferences, tempBudget)
        if (!tag)
            break;
        if (tags.includes(tag.chosen)) {
            stuck++
            if (stuck < 5) {
                continue;
            }
            stuck = 0
        }
        tempBudget -= tag.cost
        tags.push(tag.chosen)
    }
    return [...new Set(tags)];
}
let budget = 10
function theTagToUse(preferences) {
    return ["sort:score", ...gtubro(preferences)]
}

function getPredictedTagScore(tags) {}
function testOffsets(number, start=0) {
    let i = start
    let arr = []
    while (i++ < number) {
        let top10 = sortPrefs(prefs, scoreFunction([i, i, i])).slice(0, 10)
        arr.push([i, top10])
    }
    return arr.fromEntries()
}
let defaultOffset = [0, 0, 0]
let scoreFunction = () => {}
let setScoreFunction = func => {
    scoreFunction = ([likeOffset,neutralOffset,dislikeOffset]) => obj => {
        if (!obj) {
            //console.log(obj, 0)
            return 0
        }
        let {likes, neutrals, dislikes} = obj
        likes += likeOffset
        neutrals += neutralOffset
        dislikes += dislikeOffset
        return func(likes, neutrals, dislikes)
    }
}
setScoreFunction( (likes, neutrals, dislikes) => likes - dislikes)
let totalRounds = 0
let rights = 0
let wrongs = 0
let tagsToAverage = tags => tags.map(i => scoreFunction(defaultOffset)(prefs[i])).reduce( (acc, cur) => acc + cur) / tags.length
function updatePreferences({winner, loser}) {
    // Simple implementation - track which tags appear in winning posts
    // This should be enhanced with your preference logic
    let topPrevious = tagsToAverage(topTags)
    let bottomPrevious = tagsToAverage(bottomTags)
    let winnerPrevious = topTags == winner ? topPrevious : bottomPrevious
    let loserPrevious = topTags == winner ? bottomPrevious : topPrevious
    // For now, just track that we've seen these tags
    let x = winner.filter(item => !loser.includes(item))
    let y = winner.filter(item => loser.includes(item))
    let z = loser.filter(item => !winner.includes(item))
    let generator = () => {
        return {
            likes: 0,
            neutrals: 0,
            dislikes: 0
        }
    }
    x.forEach(tag => {
        prefs[tag] = prefs[tag] || generator()
        prefs[tag].likes++
    }
    )

    y.forEach(tag => {
        prefs[tag] = prefs[tag] || generator()
        prefs[tag].neutrals++
    }
    )
    z.forEach(tag => {
        prefs[tag] = prefs[tag] || generator()
        prefs[tag].dislikes++
    }
    )
    let topNow = tagsToAverage(topTags)
    let bottomNow = tagsToAverage(bottomTags)
    let topDiff = topNow - topPrevious
    let bottomDiff = bottomNow - bottomPrevious
    console.log(`top (${topTags == winner ? "winner" : "loser"}) tags: ${topPrevious} (now ${topNow}, ${Math.sign(topDiff) === 1 ? "+" : ""}${topDiff})`)
    console.log(`bottom (${bottomTags == winner ? "winner" : "loser"}) tags: ${bottomPrevious} (now ${bottomNow}, ${Math.sign(bottomDiff) === 1 ? "+" : ""}${bottomDiff})`)
    totalRounds++
    if (loserPrevious > winnerPrevious) {
        console.log("UNEXPECTED LOSS!")
        wrongs++
    } else {
        rights++
    }
    console.log(`right rate: ${rights / totalRounds}`)
}

// API functions (from original code)
let indexPhp = "https://gelbooru.com/index.php"
let intoQueryString = object => (new URLSearchParams(object)).toString()
let fromQueryString = queryString => new URLSearchParams(queryString)
let createNewSearch = object => `${indexPhp}?${intoQueryString(object)}`.replaceAll("%2B", "+")
let tagsIntoQuery = tags => tags.join("+")
let getTagsURL = tags => createNewSearch({
    page: "post",
    s: "list",
    tags: tagsIntoQuery(tags)
})
let postNumberCache = {}

async function get(url) {
    if (url.endsWith("&tags=")) {
        url = url.replace("&tags=", "&tags=all")
    }
    url = url.replace("&tags=&", "&tags=all&")
    let result = await (await fetch(url)).text()
    return result
}

function parseAsDocument(text) {
    return new DOMParser().parseFromString(text, "text/html")
}

function getThumbnailContainer(doc) {
    return doc.querySelector("div.thumbnail-container")
}

async function getNumberOfPosts(tags) {
    let joined = tags.join(" ")
    if (postNumberCache[joined])
        return postNumberCache[joined]
    let result = await get(getTagsURL(tags))
    let doc = parseAsDocument(result)
    let paginator = doc.querySelector("#paginator")
    if (paginator.children.length == 0)
        return 0
    if (paginator.children.length == 1)
        return getThumbnailContainer(doc).children.length
    let query = [...doc.querySelector("#paginator").children].at(-1).href.slice(1)
    let toCache = +fromQueryString(query).get("pid")
    postNumberCache[joined] = toCache
    return toCache
}

async function getRandomPostTags(tags=[]) {

    let totalese = await getNumberOfPosts(tags)
    if (totalese < 100) {
        tags.pop()
        console.log(`too restrictive! Calling with ${tags.join(",")} instead.`)
        return await getRandomPostTags(tags)
    }
    let total = Math.min(42069, totalese)
    let random = Math.floor(Math.random() * total)
    let buildUp = 0
    let all = await getNumberOfPosts(["all"])
    let id = all
    while (buildUp + 20000 < random) {
        buildUp += 20000
        let pid20000 = createNewSearch({
            page: "post",
            s: "list",
            tags: id == all ? tagsIntoQuery(tags) : tagsIntoQuery([...tags, `id:<${id + 1}`]),
            pid: "20000"
        })
        let pid20000page = await get(pid20000)
        let pid20000doc = parseAsDocument(pid20000page)
        id = +fromQueryString(getThumbnailContainer(pid20000doc).children[0].children[0].href.split("?")[1].slice(1)).get("id")
    }
    let post = createNewSearch({
        page: "post",
        s: "list",
        tags: id == all ? tagsIntoQuery(tags) : tagsIntoQuery([...tags, `id:<${id + 1}`]),
        pid: `${random - buildUp}`
    })
    let page = await get(post)
    let thedoc = parseAsDocument(page)
    let a = getThumbnailContainer(thedoc).children[0].children[0]
    let img = a.children[0]
    let postId = +fromQueryString(a.href.split("?")[1].slice(1)).get("id")
    let postTags = img.title.toLowerCase().split(" ").filter(i => i != "")
    return {
        postId,
        postTags
    }
}

async function getIdImageTags({postId, postTags}) {
    let search = createNewSearch({
        page: "post",
        s: "view",
        id: `${postId}`
    })
    let doc = await get(search)
    let parsed = parseAsDocument(doc)
    let imageContainer = parsed.querySelector(".image-container.note-container")
    let src;
    let type;
    if (imageContainer == null) {
        let gelcomVideoPlayer = parsed.querySelector("#gelcomVideoPlayer")
        src = gelcomVideoPlayer.children[0].src
        type = "video"
    } else {
        src = imageContainer.children[0].children[0].src
        type = "image"
    }
    return {
        tags: postTags,
        src,
        type
    }
}

async function loadPostToSide(side, tags) {
    const container = document.getElementById(`${side}-container`)
    const image = container.querySelector('img')
    const video = container.querySelector('video')

    try {
        const postTags = await getRandomPostTags(tags)
        const {tags: postTagsList, src, type} = await getIdImageTags(postTags)

        // Store tags for voting
        if (side === 'top') {
            topTags = postTagsList
            topPostData = {
                src,
                type
            }
        } else {
            bottomTags = postTagsList
            bottomPostData = {
                src,
                type
            }
        }

        // Update media element
        if (type === "image") {
            image.src = src
            updateMediaDisplay(type, container)
        } else {
            video.src = src
            updateMediaDisplay(type, container)
        }

    } catch (error) {
        console.error(`Error loading ${side} post:`, error)
        // Fallback to default tags
        const fallbackTags = ["sort:score", "video", "1girl"]
        loadPostToSide(side, fallbackTags)
    }
}
async function get2RandomTagArrays() {
    let firstTags = theTagToUse(prefs)
    let clone = prefs.entries().fromEntries()
    //firstTags.forEach(tag => delete clone[tag])
    let secondTags = theTagToUse(clone)
    let result = await Promise.all([loadPostToSide('top', firstTags), loadPostToSide('bottom', secondTags)])
    return result
}
// Voting handlers
let loadingState = {
    top: false,
    bottom: false
}
let loadingStateChange = (side, loading) => {
    loadingState[side] = loading
    if (loadingState.top || loadingState.bottom) {
        let both = loadingState.top && loadingState.bottom
        if (both) {
            let topstop5 = sortPrefs(topTags.map(i => [i, prefs[i]]).fromEntries()).slice(0,5)
            let bottomstop5 = sortPrefs(bottomTags.map(i => [i, prefs[i]]).fromEntries()).slice(0,5)
            console.log(`tops top 5: ${topstop5.join(", ")}, bottoms top 5: ${bottomstop5.join(", ")}`)
            let topstop5average = topstop5.reduce( (acc, cur) => cur[1] + acc, 0) / 5
            let bottomstop5average = bottomstop5.reduce( (acc, cur) => cur[1] + acc, 0) / 5
            console.log(`tops top 5 average: ${topstop5average}, bottoms top 5 average: ${bottomstop5average}`)
        }
        loadingIndicator.textContent = `loading ${loadingState.top ? "top" : ""}${both ? " and " : ""}${loadingState.bottom ? "bottom" : ""} post${both ? "s" : ""}`
    } else {
        loadingIndicator.textContent = ""
        console.log("----------------")
    }
}
let topLoaded = () => {
    loadingStateChange("top", false)
}
topVideoVideo.addEventListener("durationchange", topLoaded)
topImageImg.addEventListener("load", topLoaded)
let bottomLoaded = () => {
    loadingStateChange("bottom", false)
}
bottomVideoVideo.addEventListener("durationchange", bottomLoaded)
bottomImageImg.addEventListener("load", bottomLoaded)

topClickEvent = async () => {
    if (loadingState.top && loadingState.bottom)
        return
    loadingStateChange("top", true)
    loadingStateChange("bottom", true)
    updatePreferences({
        winner: topTags,
        loser: bottomTags
    })
    // Update preference tracking for winner

    // Load new posts for both sides
    await get2RandomTagArrays()
}

bottomClickEvent = async () => {
    if (loadingState.top && loadingState.bottom)
        return
    loadingStateChange("top", true)
    loadingStateChange("bottom", true)
    updatePreferences({
        loser: topTags,
        winner: bottomTags
    })
    // Update preference tracking for winner

    // Load new posts for both sides
    await get2RandomTagArrays()
}

// Initialize
async function initialize() {
    loadingStateChange("top", true)
    loadingStateChange("bottom", true)
    await get2RandomTagArrays()
}

// Start the application
initialize()
