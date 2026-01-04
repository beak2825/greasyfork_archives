// ==UserScript==
// @name         Gelbooru recommender2
// @namespace    http://tampermonkey.net/
// @version      2025-12-10
// @description  Gelbooru recommender descr
// @author       You
// @match        https://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/558680/Gelbooru%20recommender2.user.js
// @updateURL https://update.greasyfork.org/scripts/558680/Gelbooru%20recommender2.meta.js
// ==/UserScript==

document.body.innerHTML = ""
document.head.innerHTML = ""
let style = document.createElement("style")
style.innerHTML = `
body{
  padding: 0;
  margin: 0;
  font-family: sans-serif;
}
.comparison-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
}
.posts-container {
  display: flex;
  height: 80vh;
  width: 100%;
}
.post {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  box-sizing: border-box;
}
.post-title {
  font-size: 1.5em;
  margin-bottom: 10px;
  text-align: center;
  height: 30px;
}
.media-container {
  flex: 1;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.responsive-media {
  max-height: 100%;
  max-width: 100%;
  object-fit: contain;
}
.video {
  background-color: #000;
}
.tags-container {
  height: 20vh;
  overflow-y: auto;
  padding: 10px;
  box-sizing: border-box;
  font-size: 0.9em;
  border-top: 1px solid #ccc;
}
.tags-title {
  font-weight: bold;
  margin-bottom: 5px;
}
.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}
.tag {
  background-color: #f0f0f0;
  padding: 2px 6px;
  border-radius: 3px;
  white-space: nowrap;
}
.voting-buttons {
  display: flex;
  height: 10vh;
  width: 100%;
  background-color: #f5f5f5;
  border-top: 1px solid #ccc;
}
.vote-button {
  flex: 1;
  font-size: 2em;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}
.vote-button:hover {
  background-color: #e0e0e0;
}
.vote-left {
  background-color: #ff6b6b;
  color: white;
}
.vote-right {
  background-color: #4ecdc4;
  color: white;
}
.vote-equal {
  background-color: #45b7d1;
  color: white;
}
.hidden {
  display: none;
}
.notCurrentlyViewing {
  display: none;
}
.tag-diff {
  margin: 5px 0;
  padding: 5px;
  border-radius: 3px;
}
.tag-left-only {
  background-color: #ffe6e6;
  color: #cc0000;
}
.tag-right-only {
  background-color: #e6ffe6;
  color: #006600;
}
.tag-both {
  background-color: #f0f0f0;
  color: #666;
}`
document.head.appendChild(style)

let mainContainer = document.createElement("div")
mainContainer.className = "comparison-container"
document.body.appendChild(mainContainer)

let postsContainer = document.createElement("div")
postsContainer.className = "posts-container"
mainContainer.appendChild(postsContainer)

// Left post
let leftPost = document.createElement("div")
leftPost.className = "post"
postsContainer.appendChild(leftPost)

let leftTitle = document.createElement("div")
leftTitle.className = "post-title"
leftTitle.textContent = "Left Post"
leftPost.appendChild(leftTitle)

let leftMediaContainer = document.createElement("div")
leftMediaContainer.className = "media-container"
leftPost.appendChild(leftMediaContainer)

let leftImage = document.createElement("img")
leftImage.className = "responsive-media"
leftMediaContainer.appendChild(leftImage)

let leftVideo = document.createElement("video")
leftVideo.className = "responsive-media video"
leftVideo.controls = true
leftMediaContainer.appendChild(leftVideo)

// Right post
let rightPost = document.createElement("div")
rightPost.className = "post"
postsContainer.appendChild(rightPost)

let rightTitle = document.createElement("div")
rightTitle.className = "post-title"
rightTitle.textContent = "Right Post"
rightPost.appendChild(rightTitle)

let rightMediaContainer = document.createElement("div")
rightMediaContainer.className = "media-container"
rightPost.appendChild(rightMediaContainer)

let rightImage = document.createElement("img")
rightImage.className = "responsive-media"
rightMediaContainer.appendChild(rightImage)

let rightVideo = document.createElement("video")
rightVideo.className = "responsive-media video"
rightVideo.controls = true
rightMediaContainer.appendChild(rightVideo)

// Tags display container
let tagsContainer = document.createElement("div")
tagsContainer.className = "tags-container"
mainContainer.appendChild(tagsContainer)

let tagsTitle = document.createElement("div")
tagsTitle.className = "tags-title"
tagsTitle.textContent = "Tag Comparison"
tagsContainer.appendChild(tagsTitle)

let tagsList = document.createElement("div")
tagsList.className = "tags-list"
tagsContainer.appendChild(tagsList)

// Voting buttons
let votingButtons = document.createElement("div")
votingButtons.className = "voting-buttons"
mainContainer.appendChild(votingButtons)

let voteLeftButton = document.createElement("button")
voteLeftButton.className = "vote-button vote-left"
voteLeftButton.textContent = "← Left is Better"
votingButtons.appendChild(voteLeftButton)

let voteEqualButton = document.createElement("button")
voteEqualButton.className = "vote-button vote-equal"
voteEqualButton.textContent = "≈ Equal"
votingButtons.appendChild(voteEqualButton)

let voteRightButton = document.createElement("button")
voteRightButton.className = "vote-button vote-right"
voteRightButton.textContent = "Right is Better →"
votingButtons.appendChild(voteRightButton)

// Helper functions
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

let lastGet = 0;
let get = async url => {
    if(url.endsWith("&tags=")) {url = url.replace("&tags=", "&tags=all")}
    url = url.replace("&tags=&", "&tags=all&")
    let result = await (await fetch(url)).text()
    return result
}

let parseAsDocument = text => new DOMParser().parseFromString(text, "text/html")
let getThumbnailContainer = doc => doc.querySelector("div.thumbnail-container")
let postNumberCache = {}

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
    console.log("Fetching random post with tags:", tags)
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

// State management
let prefs = {}
let currentLeftPost = null
let currentRightPost = null

function updateMediaDisplay(element, postData) {
    if (!postData) return
    
    const { src, type } = postData
    const img = element.querySelector('img')
    const video = element.querySelector('video')
    
    if (type === 'video') {
        img.style.display = 'none'
        video.style.display = 'block'
        video.src = src
        video.load()
    } else {
        img.style.display = 'block'
        video.style.display = 'none'
        img.src = src
    }
}

function displayTagComparison(leftTags, rightTags) {
    tagsList.innerHTML = ''
    
    const leftSet = new Set(leftTags)
    const rightSet = new Set(rightTags)
    
    // Tags only in left post
    const leftOnly = [...leftSet].filter(tag => !rightSet.has(tag))
    leftOnly.forEach(tag => {
        const tagElement = document.createElement('span')
        tagElement.className = 'tag tag-left-only'
        tagElement.textContent = tag
        tagElement.title = 'Only in left post'
        tagsList.appendChild(tagElement)
    })
    
    // Tags only in right post
    const rightOnly = [...rightSet].filter(tag => !leftSet.has(tag))
    rightOnly.forEach(tag => {
        const tagElement = document.createElement('span')
        tagElement.className = 'tag tag-right-only'
        tagElement.textContent = tag
        tagElement.title = 'Only in right post'
        tagsList.appendChild(tagElement)
    })
    
    // Tags in both posts
    const both = [...leftSet].filter(tag => rightSet.has(tag))
    both.forEach(tag => {
        const tagElement = document.createElement('span')
        tagElement.className = 'tag tag-both'
        tagElement.textContent = tag
        tagElement.title = 'In both posts'
        tagsList.appendChild(tagElement)
    })
    
    if (leftOnly.length === 0 && rightOnly.length === 0 && both.length === 0) {
        const noTagsMsg = document.createElement('div')
        noTagsMsg.textContent = 'No tags to display'
        tagsList.appendChild(noTagsMsg)
    }
}

function handleVote(direction) {
    if (!currentLeftPost || !currentRightPost) return
    
    const leftTags = new Set(currentLeftPost.tags)
    const rightTags = new Set(currentRightPost.tags)
    
    if (direction === 'left') {
        // Right is better: like tags in right but not in left, dislike tags in left but not in right
        const rightOnly = [...rightTags].filter(tag => !leftTags.has(tag))
        const leftOnly = [...leftTags].filter(tag => !rightTags.has(tag))
        
        rightOnly.forEach(tag => {
            prefs[tag] = prefs[tag] || [0, 0]
            prefs[tag][0] += 1 // Like
        })
        
        leftOnly.forEach(tag => {
            prefs[tag] = prefs[tag] || [0, 0]
            prefs[tag][1] += 1 // Dislike
        })
        
        console.log(`Voted: Right is better`)
        console.log(`Liked tags (right only): ${rightOnly.join(', ')}`)
        console.log(`Disliked tags (left only): ${leftOnly.join(', ')}`)
    } 
    else if (direction === 'right') {
        // Left is better: like tags in left but not in right, dislike tags in right but not in left
        const leftOnly = [...leftTags].filter(tag => !rightTags.has(tag))
        const rightOnly = [...rightTags].filter(tag => !leftTags.has(tag))
        
        leftOnly.forEach(tag => {
            prefs[tag] = prefs[tag] || [0, 0]
            prefs[tag][0] += 1 // Like
        })
        
        rightOnly.forEach(tag => {
            prefs[tag] = prefs[tag] || [0, 0]
            prefs[tag][1] += 1 // Dislike
        })
        
        console.log(`Voted: Left is better`)
        console.log(`Liked tags (left only): ${leftOnly.join(', ')}`)
        console.log(`Disliked tags (right only): ${rightOnly.join(', ')}`)
    }
    else if (direction === 'equal') {
        // Both are equal: no preference changes
        console.log(`Voted: Equal - no preference changes`)
    }
    
    // Load new posts
    loadNewComparison()
}

function getMostPromisingTags() {
    const entries = Object.entries(prefs)
    if (entries.length === 0) return ["1girl"]
    
    // Calculate scores (likes - dislikes)
    const scored = entries.map(([tag, [likes, dislikes]]) => ({
        tag,
        score: likes - dislikes
    }))
    
    // Sort by score (highest first)
    scored.sort((a, b) => b.score - a.score)
    
    // Take top 2-3 tags with positive scores
    const promising = scored.filter(item => item.score > 0).slice(0, 3)
    
    if (promising.length > 0) {
        return promising.map(item => item.tag)
    }
    
    return ["1girl"]
}

async function loadNewComparison() {
    try {
        const promisingTags = getMostPromisingTags()
        console.log(`Loading posts with promising tags: ${promisingTags.join(', ')}`)
        
        // Load two random posts
        const [leftData, rightData] = await Promise.all([
            getRandomPostTags(promisingTags),
            getRandomPostTags(promisingTags)
        ])
        
        // Get full post info (including media URL)
        const [leftFull, rightFull] = await Promise.all([
            getIdImageTags(leftData),
            getIdImageTags(rightData)
        ])
        
        currentLeftPost = leftFull
        currentRightPost = rightFull
        
        // Update displays
        updateMediaDisplay(leftPost, leftFull)
        updateMediaDisplay(rightPost, rightFull)
        
        // Display tag comparison
        displayTagComparison(leftFull.tags, rightFull.tags)
        
        console.log("Loaded new comparison")
        console.log("Left post tags:", leftFull.tags)
        console.log("Right post tags:", rightFull.tags)
        
    } catch (error) {
        console.error("Error loading comparison:", error)
        // Fallback to default tags
        setTimeout(loadNewComparison, 1000)
    }
}

// Event listeners
voteLeftButton.addEventListener('click', () => handleVote('left'))
voteRightButton.addEventListener('click', () => handleVote('right'))
voteEqualButton.addEventListener('click', () => handleVote('equal'))

// Initialize
loadNewComparison()

// Debug function to show current preferences
window.showPrefs = function() {
    console.log("Current preferences:", prefs)
    const sorted = Object.entries(prefs)
        .map(([tag, [likes, dislikes]]) => ({
            tag,
            likes,
            dislikes,
            score: likes - dislikes
        }))
        .sort((a, b) => b.score - a.score)
    console.log("Sorted preferences:", sorted)
}