// ==UserScript==
// @name         Gelbooru recommender
// @namespace    http://tampermonkey.net/
// @version      2025-12-10
// @description  Gelbooru recommender desc
// @author       You
// @match        https://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/558556/Gelbooru%20recommender.user.js
// @updateURL https://update.greasyfork.org/scripts/558556/Gelbooru%20recommender.meta.js
// ==/UserScript==

document.body.innerHTML = ""
document.head.innerHTML = ""
let style = document.createElement("style")
style.innerHTML = `
body{
  padding: 0;
  margin: 0;
}
.responsiveDiv {
  max-height: 50vh;
  height: 50vh;
  width: auto;
  max-width: 100vw;
  object-fit: contain;
  display: block;
}
.tasteButton{
  padding: 0;
  height: 100%;
  width: 50%;
  font-size: 10vw;
}
.notCurrentlyViewing{
    display: none;
}`
document.head.appendChild(style)
let tastemenu = document.createElement("div")
tastemenu.id = "tastemenu"
document.body.appendChild(tastemenu)
let imageImg = document.createElement("img")
imageImg.classList.add("responsiveDiv")
let videoVideo = document.createElement("video")
let currentlyHidden = videoVideo
let currentlyViewing = imageImg
let typeToNode = {image: imageImg, video: videoVideo}
let updateToType = type => {
    if(currentlyViewing == typeToNode[type]) return
    currentlyHidden.classList.remove("notCurrentlyViewing")
    currentlyViewing.classList.add("notCurrentlyViewing")
    let viewing = currentlyViewing
    let hidden = currentlyHidden
    currentlyViewing = hidden
    currentlyHidden = viewing
}
videoVideo.classList.add("responsiveDiv")
let tasteDiv = document.createElement("div")
tasteDiv.style.display = "flex"
tasteDiv.classList.add("responsiveDiv")
tastemenu.appendChild(imageImg)
tastemenu.appendChild(videoVideo)
tastemenu.appendChild(tasteDiv)
let numberOfButtons = 10
let i = numberOfButtons
let buttons = []
let onButtonPress = value=>{console.log(value)}
while(i--){
    let index = numberOfButtons-i-1
    // 0 1 2 3 4 -> -1 -0.5 0 0.5 1
    let value = ((2*index)/(numberOfButtons-1))-1
    console.log(value)
    let button = document.createElement("button")
    button.style.padding = "0"
    button.style.height = "100%"
    button.style.width = `${100/numberOfButtons}%`
    button.style.fontSize = "50px"
    button.innerHTML = `${value}`
    buttons.push(button)
    button.onclick = ()=>onButtonPress(value)
}
buttons.forEach(button=>tasteDiv.appendChild(button))
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
let post = url => async body => await (await fetch(url, {
    method: "POST",
    body
})).text()
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
    console.log(tags)
    let totalese = await getNumberOfPosts(tags)
    if(totalese == 0){
        tags.pop()
        console.log(`too restrictive! Calling with ${tags.join(",")} instead.`)
        return await getRandomPostTags(tags)
    }
    let total = Math.min(42069,totalese)
    let random = Math.floor(Math.random() * total)
    let buildUp = 0
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
    // let prom  = new Promise(resolve=>{
    //    setTimeout(()=>{resolve(result)}, 200)
    //})
    //return await prom
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
let prefs = {}
let yess = 0
let nos = 0
let objectMap = (obj, func,outputObj)=>{
    let entries = Object.entries(obj)
    let result = entries.map(([key,value])=>func(key,value))
    if(outputObj) return Object.fromEntries(result)
    return result
}
function getTagFreq(tag){
    let totalCount = yess + nos
    let tagCount = prefs[tag][0] + prefs[tag][1]
    return tagCount / totalCount
}
let likesToDislikes = (likes, dislikes) => likes / dislikes
let likesSubtractDislikes = (likes, dislikes) => likes - dislikes
let scoreTimesFreq = (likes, dislikes) => (likes - dislikes) * (likes + dislikes)
function getMostPromising(scoreFunction){
    let toPromise = objectMap(prefs, (key, [likes, dislikes])=>[key, scoreFunction(likes,dislikes)],false)
    let sorted = toPromise.sort(([value1, promise1], [value2, promise2])=>promise2-promise1)
    return sorted
}
let firstChance = 1/2
function getProportionallyRandomPromising(scoreFunction){
    let promise = getMostPromising(scoreFunction)
    let random = Math.random()
    while(random < 1-firstChance){
        random *= 1/(1-firstChance)
        promise.shift()
    }
    return promise[0][0]
}
function getnPRP(n, scoreFunction){
    let tags = []
    while(n--){
        tags.push(getProportionallyRandomPromising(scoreFunction))
    }
    return tags
}
function convertTagsToScore(tags){
    let result = tags.map(tag=>{
        return [
        tag,
        !prefs[tag] ? 0 : prefs[tag][0] - prefs[tag][1]
        ]
    })
    console.log(result)
    return result.map(i=>i[1]).reduce((acc,cur)=>acc+cur) / tags.length
}
function sortPrefsByScore(){
    let entries = Object.entries(prefs)
    return entries.sort(([key1, [likes1, dislikes1]], [key2, [likes2, dislikes2]])=>{
        let score1 = likes1 - dislikes1
        let score2 = likes2 - dislikes2
        return score2-score1
    })
}
async function serveRandomImage(tagsInput){
    let {tags, src, type} = await getIdImageTags(await getRandomPostTags(tagsInput))

    updateToType(type)
    currentlyViewing.src = src
    let mostPromisingTags;
    try{
        mostPromisingTags = getnPRP(2, scoreTimesFreq)
        let postScore = convertTagsToScore(tags)
        let allScore = convertTagsToScore(Object.entries(prefs).map(i=>i[0]))
        console.log("prediction", postScore - allScore)
        console.log("scores", sortPrefsByScore())
    } catch(e){
        console.warn(e)
        mostPromisingTags = ["1girl"]
    }
    if(type=="video") await currentlyViewing.play()
    currentlyViewing.loop = true
    onButtonPress = value => {
        currentlyViewing.src = ""
        let isNegative = Math.sign(value) == -1
        if(isNegative){
            nos+=(-value)
            tags.forEach(tag=>{
                prefs[tag] ??= [0,0]
                prefs[tag][1]+=(-value)
            })
        } else {
            yess+=value
            tags.forEach(tag=>{
                prefs[tag] ??= [0,0]
                prefs[tag][0]+=value
            })
        }
        serveRandomImage(mostPromisingTags)
    }
}
serveRandomImage(["video"])