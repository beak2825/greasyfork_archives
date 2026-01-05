// ==UserScript==
// @name         Gelbrec161225
// @namespace    http://tampermonkey.net/
// @version      2025-12-10
// @description  Gelbooru recommender desc
// @author       You
// @match        https://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/559062/Gelbrec161225.user.js
// @updateURL https://update.greasyfork.org/scripts/559062/Gelbrec161225.meta.js
// ==/UserScript==

document.body.style=""
document.body.innerHTML = ""
document.head.innerHTML = ""
let style = document.createElement("style")
style.innerHTML = `
body{
  padding: 0;
  margin: 0;
  overflow: hidden;
}
.comparison-container {
  display: flex;
  width: 100vw;
  height: 80vh;
}
.post-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.responsiveMedia {
  max-height: 100%;
  max-width: 100%;
  object-fit: contain;
}
.voting-container {
  height: 20vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.vote-button {
  font-size: 24px;
  padding: 20px 40px;
  margin: 0 20px;
  cursor: pointer;
}
.notCurrentlyViewing{
  display: none;
}`
document.head.appendChild(style)

// Create main containers
let comparisonDiv = document.createElement("div")
comparisonDiv.className = "comparison-container"
let leftContainer = document.createElement("div")
leftContainer.className = "post-container"
leftContainer.id = "left-container"
let rightContainer = document.createElement("div")
rightContainer.className = "post-container"
rightContainer.id = "right-container"

// Create media elements for left side
let leftImageImg = document.createElement("img")
let leftVideoVideo = document.createElement("video")
leftImageImg.className = "responsiveMedia"
leftVideoVideo.className = "responsiveMedia"
leftVideoVideo.classList.add("notCurrentlyViewing")

// Create media elements for right side
let rightImageImg = document.createElement("img")
let rightVideoVideo = document.createElement("video")
rightImageImg.className = "responsiveMedia"
rightVideoVideo.className = "responsiveMedia"
rightVideoVideo.classList.add("notCurrentlyViewing")

// Append media elements to containers
leftContainer.appendChild(leftImageImg)
leftContainer.appendChild(leftVideoVideo)
rightContainer.appendChild(rightImageImg)
rightContainer.appendChild(rightVideoVideo)

comparisonDiv.appendChild(leftContainer)
comparisonDiv.appendChild(rightContainer)

// Create voting buttons
let votingDiv = document.createElement("div")
votingDiv.className = "voting-container"
let leftBetterButton = document.createElement("button")
leftBetterButton.className = "vote-button"
leftBetterButton.textContent = "← Left is Better"
let rightBetterButton = document.createElement("button")
rightBetterButton.className = "vote-button"
rightBetterButton.textContent = "Right is Better →"

votingDiv.appendChild(leftBetterButton)
votingDiv.appendChild(rightBetterButton)

// Add everything to body
document.body.appendChild(comparisonDiv)
document.body.appendChild(votingDiv)

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

// Global state
let prefs = {}
let leftTags = []
let rightTags = []
let leftPostData = null
let rightPostData = null

// Core functions
function theTagToUse() {
  // Simple implementation - returns random tags for now
    if(Object.entries(prefs).length == 0) return ["1girl"]
  let sortedPrefs = Object.entries(prefs).map(i=>[i[0], scoreFunction(i[1])]).sort((value1, value2)=>value2[1]-value1[1])
  let topValue = sortedPrefs[0][1]
  let allWithTopValue = sortedPrefs.filter(([tag, value])=>value==topValue)
  let random = Math.floor(Math.random()*allWithTopValue.length)
  console.log(allWithTopValue[random])
  return [allWithTopValue[random][0]]
}

function getPredictedTagScore(tags){
    
}
function scoreFunction(obj){
    if(!obj) return 0
    let {wins, seen} = obj
    if(seen == wins) return 0.5
    return seen/(seen-wins)
}
let totalRounds = 0
function updatePreferences({winner, loser}) {
  totalRounds++
  // Simple implementation - track which tags appear in winning posts
  // This should be enhanced with your preference logic
  console.log("winner tags should have had score ", winner.map(i=>scoreFunction(prefs[i])).reduce((acc,cur)=>acc+cur) / winner.length)
  console.log("loser tags should have had score ", loser.map(i=>scoreFunction(prefs[i])).reduce((acc,cur)=>acc+cur) / loser.length)
  // For now, just track that we've seen these tags
    let x = winner.filter(item=>!loser.includes(item))
    let y = winner.filter(item=>loser.includes(item))
    let z = loser.filter(item=>!winner.includes(item))
    x.forEach(tag => {
        prefs[tag] = prefs[tag] || { seen: 0, wins: 0 }
        prefs[tag].seen++
        prefs[tag].wins++
    })
  
   y.forEach(tag => {
        prefs[tag] = prefs[tag] || { seen: 0, wins: 0 }
        prefs[tag].seen++
        prefs[tag].wins++
    })
    z.forEach(tag => {
        prefs[tag] = prefs[tag] || { seen: 0, wins: 0 }
        prefs[tag].seen++
    })
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
    if(url.endsWith("&tags=")) {url = url.replace("&tags=", "&tags=all")}
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
    if(postNumberCache[joined]) return postNumberCache[joined]
    let result = await get(getTagsURL(tags))
    let doc = parseAsDocument(result)
    let paginator = doc.querySelector("#paginator")
    if(paginator.children.length == 0) return 0
    if(paginator.children.length == 1) return getThumbnailContainer(doc).children.length
    let query = [...doc.querySelector("#paginator").children].at(-1).href.slice(1)
    let toCache = +fromQueryString(query).get("pid")
    postNumberCache[joined] = toCache
    return toCache
}

async function getRandomPostTags(tags = []) {
    let totalese = await getNumberOfPosts(tags)
    if(totalese == 0){
        tags.pop()
        console.log(`too restrictive! Calling with ${tags.join(",")} instead.`)
        return await getRandomPostTags(tags)
    }
    let total = Math.min(42069,totalese)
    let random = Math.floor(Math.random() * total)
    let buildUp = 0
    let all = await getNumberOfPosts(["all"])
    let id = all
    while (buildUp + 20000 < random) {
        buildUp += 20000
        let pid20000 = createNewSearch({
            page: "post",
            s: "list",
            tags: id==all ? tagsIntoQuery(tags) : tagsIntoQuery([...tags, `id:<${id+1}`]),
            pid: "20000"
        })
        let pid20000page = await get(pid20000)
        let pid20000doc = parseAsDocument(pid20000page)
        id = +fromQueryString(getThumbnailContainer(pid20000doc).children[0].children[0].href.split("?")[1].slice(1)).get("id")
    }
    let post = createNewSearch({
        page: "post",
        s: "list",
        tags: id==all ? tagsIntoQuery(tags) : tagsIntoQuery([...tags, `id:<${id+1}`]),
        pid: `${random-buildUp}`
    })
    let page = await get(post)
    let thedoc = parseAsDocument(page)
    let a = getThumbnailContainer(thedoc).children[0].children[0]
    let img = a.children[0]
    let postId = +fromQueryString(a.href.split("?")[1].slice(1)).get("id")
    let postTags = img.title.toLowerCase().split(" ").filter(i=>i!="")
    return {postId, postTags}
}

async function getIdImageTags({postId, postTags}){
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
    if(imageContainer == null){
        let gelcomVideoPlayer = parsed.querySelector("#gelcomVideoPlayer")
        src = gelcomVideoPlayer.children[0].src
        type = "video"
    } else {
        src = imageContainer.children[0].children[0].src
        type = "image"
    }
    return {tags: postTags, src, type}
}

async function loadPostToSide(side, tags) {
    const container = document.getElementById(`${side}-container`)
    const image = container.querySelector('img')
    const video = container.querySelector('video')
    
    try {
        const postTags = await getRandomPostTags(tags)
        const { tags: postTagsList, src, type } = await getIdImageTags(postTags)
        
        // Store tags for voting
        if (side === 'left') {
            leftTags = postTagsList
            leftPostData = { src, type }
        } else {
            rightTags = postTagsList
            rightPostData = { src, type }
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
        const fallbackTags = ["1girl"]
        loadPostToSide(side, fallbackTags)
    }
}

// Voting handlers
leftBetterButton.onclick = async () => {
    updatePreferences({winner: leftTags, loser: rightTags})
    // Update preference tracking for winner
    
    // Load new posts for both sides
    await Promise.all([
        loadPostToSide('left', theTagToUse()),
        loadPostToSide('right', theTagToUse())
    ])
}

rightBetterButton.onclick = async () => {
    updatePreferences({loser: leftTags, winner: rightTags})
    // Update preference tracking for winner
    
    // Load new posts for both sides
    await Promise.all([
        loadPostToSide('left', theTagToUse()),
        loadPostToSide('right', theTagToUse())
    ])
}

// Initialize
async function initialize() {
    await Promise.all([
        loadPostToSide('left', theTagToUse()),
        loadPostToSide('right', theTagToUse())
    ])
}

// Start the application
initialize()