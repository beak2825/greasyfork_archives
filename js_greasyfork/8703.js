// ==UserScript==
// @name تويتر بدون سبام
// @namespace http://www.adslgate.com/dsl/member.php?u=491125
// @include https://twitter.com/hashtag/*
// @include https://twitter.com/search?*
// @version 1.21
// @grant none
// @description   ازالة السبام من تويتر  بالضغط على زر pause في الكيبورد.  
// @downloadURL https://update.greasyfork.org/scripts/8703/%D8%AA%D9%88%D9%8A%D8%AA%D8%B1%20%D8%A8%D8%AF%D9%88%D9%86%20%D8%B3%D8%A8%D8%A7%D9%85.user.js
// @updateURL https://update.greasyfork.org/scripts/8703/%D8%AA%D9%88%D9%8A%D8%AA%D8%B1%20%D8%A8%D8%AF%D9%88%D9%86%20%D8%B3%D8%A8%D8%A7%D9%85.meta.js
// ==/UserScript==
 
timeLine = document.getElementById("timeline");
 
 
function removeSpam(){
numberofSpamsTweets = 0;
Tweets = timeLine.querySelectorAll('[id^="stream-item-tweet-"]');
 
numberofTweets = Tweets.length;
 
for (i=0; i<numberofTweets; i++){
//try to find the link in the tweet
  tweet = Tweets[i]
  spamLink = tweet.getElementsByClassName("twitter-timeline-link");
  //if the tweet contain link
  doesthisTweetContainPhoneNumber = tweetContainPhoneNumber(tweet.textContent)
  if (spamLink.length > 0 || doesthisTweetContainPhoneNumber){
    tweet.remove();
    numberofSpamsTweets++;
  }
  }
console.log("تم التنفيذ. يوجد "+numberofTweets+" تغريدة, "+numberofSpamsTweets+" تم حذفها");
}
 
 
 
 
phoneNumberRegex = new RegExp(/05\d{8}/i);
function tweetContainPhoneNumber(tweetText){
return phoneNumberRegex.test(tweetText)
}
 
document.addEventListener("keypress",function(e){e = e || window.event;if (e.keyCode == 19) removeSpam()}  );   //19 is the keycode for 'pause' key.