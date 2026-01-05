// ==UserScript==
// @name        Filler or not
// @author      One Shade
// @namespace   http://lifenanime.blogspot.ca/
// @include     http://www.animefansftw.org/*
// @description It's a script for the site AnimeFansFTW that adds a tag in parenthesis to indicate if the episode is a filler or not.
// @version     1.1
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/8580/Filler%20or%20not.user.js
// @updateURL https://update.greasyfork.org/scripts/8580/Filler%20or%20not.meta.js
// ==/UserScript==
function findFirstDescendant(parent, tagname)
{
  ancestor = document.getElementById(parent);
  var descendants = ancestor.getElementsByTagName(tagname);
  if (descendants.length)
  return descendants[0];
  return null;
}
function findAllDescendantsTag(target, parent, tagname)
{
  ancestor = target.getElementById(parent);
  var descendants = ancestor.getElementsByTagName(tagname);
  if (descendants.length)
  return descendants;
  return null;
}
//In the anime individual section list

/**if (document.URL.indexOf('/anime/') >= 0)
{
  var newList = findAllDescendantsTag(document, 'content', 'li');
  for (i = 0; i < newList.length; i++)
  {
    searchForFiller(newList[i]);
  }
} 
else if ((document.URL.indexOf('/latest-anime-episodes/') >= 0) || (document.URL.indexOf('/page/') >= 0) || (document.URL.split('.com')[1] == '/')) //In the latest anime episodes list
{
  var animeList = findAllDescendantsTag(document, 'updates', 'h4');
  for (i = 0; i < animeList.length; i++)
  {
    searchForFiller(animeList[i]);
  }
} 
else
//Individual anime post
{
  var header = findFirstDescendant('main-content', 'h1');
  searchForFiller(header);
}**/
//Primary function that searches and add the (filler) tag when necessary
var animeList = findAllDescendantsTag(document, 'main-content', 'h1');
if (animeList == null)
{
    animeList = findAllDescendantsTag(document, 'main-content', 'li');
}
for (i = 0; i < animeList.length; i++)
{
  searchForFiller(animeList[i]);
}

function searchForFiller(parent)
{
  //if (parent.innerHTML.indexOf('</a>') != -1)
  //{
    //var animeInfo = parent.getElementsByTagName('a');
    //animeInfo = animeInfo[0].innerHTML;
    /**var indInfo = animeInfo.indexOf('</span>');
    if (indInfo != - 1)
    {
      animeInfo = animeInfo.split('</span>') [1];
    }**/
     var animeInfo = parent.textContent;
    
    //Remove Tabs and line breaks from the anime info
    animeInfo = animeInfo.replace(/\t|\n/g, '');
    //Seperate the anime name and number
    var urlName = animeInfo.split(' Episode ') [0];
    var episodeNum = animeInfo.split(' Episode ') [1];
    //Prepare url name for web format
    urlName = urlName.replace(/ /g, '-');
    urlName = urlName.replace(/!/g, '');
    //EXCEPTIONS
    urlName = urlName.replace(/Shippuuden/g, 'shippuden');
    //All to lower
    urlName = urlName.toLowerCase();
    //Open request for page source code
    var filler = false;
    var sourceCode = '';
    var url = 'http://www.animefillerlist.com/shows/' + urlName + '/';
    var ret = GM_xmlhttpRequest({
      method: 'GET',
      url: url,
      onload: function (response) {
        sourceCode = response.responseText;
        //If the anime does not have a page for fillers
        var indexName = sourceCode.indexOf('EpisodeList');
        if (indexName != - 1)
        {
          //Skim through code to get the status of filler or not for the episode number
          var firstToCut = sourceCode.indexOf('<table');
          var lastToCut = sourceCode.indexOf('</table>');
          var sourceCode = sourceCode.substr(firstToCut, lastToCut - firstToCut);
          //Remove bits from the number
          episodeNum = episodeNum.split(' Final') [0];
          episodeNum = episodeNum.split('-') [0];
         
          firstToCut = sourceCode.indexOf('eps-' + episodeNum);
          lastToCut = sourceCode.indexOf('</span>', firstToCut);
          sourceCode = sourceCode.substr(firstToCut, lastToCut - firstToCut);
          //If filler mark as true
          if (sourceCode.indexOf('Filler') != - 1)
          {
            filler = true;
          }
          var textToAdd = '';
          if (filler == true)
          {
            textToAdd = 'Filler';
          }
          //Add the tag in parenthesis

          if (textToAdd != '')
          {
            parent.innerHTML += ' ' + '(' + textToAdd + ')';
          }
        }
      }
    });
  //}
}