// ==UserScript==
// @name        Plex-IMDB
// @namespace   plex.tv
// @description Add IMDB link and ratings to Plex movies
// @author      John Woods
// @include     http://127.0.0.1:32400/web/index.html#!/server/*
// @include     http://plex.tv/web/app#!/server/*
// @require     http://code.jquery.com/jquery-1.11.0.min.js
// @require     https://greasyfork.org/scripts/1003-wait-for-key-elements/code/Wait%20for%20key%20elements.js?version=2765
// @version     0.0.2
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/8045/Plex-IMDB.user.js
// @updateURL https://update.greasyfork.org/scripts/8045/Plex-IMDB.meta.js
// ==/UserScript==

waitForKeyElements(".metadata-right", run);

// var loadingImg = "data:image/gif;base64,R0lGODlhEAAQAPQAAPbx7pmZmfPu662sq8jGxJqamqampefj4NXS0KCfn8PAv727uuvn5NDNy+Dc2rKxsLi2tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAAFUCAgjmRpnqUwFGwhKoRgqq2YFMaRGjWA8AbZiIBbjQQ8AmmFUJEQhQGJhaKOrCksgEla+KIkYvC6SJKQOISoNSYdeIk1ayA8ExTyeR3F749CACH5BAkKAAAALAAAAAAQABAAAAVoICCKR9KMaCoaxeCoqEAkRX3AwMHWxQIIjJSAZWgUEgzBwCBAEQpMwIDwY1FHgwJCtOW2UDWYIDyqNVVkUbYr6CK+o2eUMKgWrqKhj0FrEM8jQQALPFA3MAc8CQSAMA5ZBjgqDQmHIyEAIfkECQoAAAAsAAAAABAAEAAABWAgII4j85Ao2hRIKgrEUBQJLaSHMe8zgQo6Q8sxS7RIhILhBkgumCTZsXkACBC+0cwF2GoLLoFXREDcDlkAojBICRaFLDCOQtQKjmsQSubtDFU/NXcDBHwkaw1cKQ8MiyEAIfkECQoAAAAsAAAAABAAEAAABVIgII5kaZ6AIJQCMRTFQKiDQx4GrBfGa4uCnAEhQuRgPwCBtwK+kCNFgjh6QlFYgGO7baJ2CxIioSDpwqNggWCGDVVGphly3BkOpXDrKfNm/4AhACH5BAkKAAAALAAAAAAQABAAAAVgICCOZGmeqEAMRTEQwskYbV0Yx7kYSIzQhtgoBxCKBDQCIOcoLBimRiFhSABYU5gIgW01pLUBYkRItAYAqrlhYiwKjiWAcDMWY8QjsCf4DewiBzQ2N1AmKlgvgCiMjSQhACH5BAkKAAAALAAAAAAQABAAAAVfICCOZGmeqEgUxUAIpkA0AMKyxkEiSZEIsJqhYAg+boUFSTAkiBiNHks3sg1ILAfBiS10gyqCg0UaFBCkwy3RYKiIYMAC+RAxiQgYsJdAjw5DN2gILzEEZgVcKYuMJiEAOwAAAAAAAAAAAA==";
var loadingImg = "data:image/gif;base64,R0lGODlhEAAQAPIAAP////////7+/v7+/v////7+/v7+/v7+/iH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==";
var targetPopup = 'imdb';
var running = false;

function processImdbInfo(content, title) {
  var movieInfo = content;
  var imdbUrl = 'http://www.imdb.com/title/'+movieInfo.imdbID;
  if (content.code == 404) {
    $('#loading_image').html('<em>Could not find <a style="color:#dd0000;" href="http://www.imdb.com/find?q='+title+'&s=tt&ttype=ft" target="'+targetPopup+'">IMDB</a> info</em>');
  } else {
    $('#loading_image').html('&raquo;&nbsp;<a href="'+imdbUrl+
        '" target="'+targetPopup+'">IMDB: </a>'+movieInfo.imdbRating);
  }
}

function getImdbInfo(title, year) {
  if (title === '') {
    return null;
  }
  var t = title.replace(/\s/g, '+');
  var url = 'http://omdbapi.com/?t='+t+'&y='+year;
  GM_xmlhttpRequest({
    method: "GET",
    url: url,
    onload: function(response) {
      // We've received a response from the API
      var data = JSON.parse(response.responseText);
      processImdbInfo(data, title);
    },
    onerror: function(response) {
      var data = JSON.parse(response.responseText);
      console.log('error:'+data);
      $('#loading_image').html('<em>IMDB Error</em>');
    }
  });
}

function run(jNode) {
  var div = $(".metadata-right");
  var movieTitle = $(".item-title").text();
  var movieYear = $(".item-year").text();
  div.append("<span id='loading_image'><img src='" + loadingImg + "' alt='Loading...'></span>");
  getImdbInfo(movieTitle, movieYear);
}
