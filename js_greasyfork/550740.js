// ==UserScript==
// @name        digger for TPB description
// @namespace   https://github.com/sbugzu/digger_for_TPB_description
// @require     https://code.jquery.com/jquery-3.6.0.min.js
// @match       https://thepiratebay.org/description.php*
// @grant       none
// @version     0.1.0
// @author      sbugzu
// @description The script to display images and URLs in descriptions for thepiratebay.com
// @license     Unlicense
// @downloadURL https://update.greasyfork.org/scripts/550740/digger%20for%20TPB%20description.user.js
// @updateURL https://update.greasyfork.org/scripts/550740/digger%20for%20TPB%20description.meta.js
// ==/UserScript==

'use strict';

/*
const isYouTubeUrl = function(url) {
  try {
    const parsedUrl = new URL(url);
    return (
      parsedUrl.hostname === "www.youtube.com" ||
      parsedUrl.hostname === "youtube.com" ||
      parsedUrl.hostname === "m.youtube.com" ||
      parsedUrl.hostname === "youtu.be"
    );
  } catch (e) {
    return false; // Invalid URL
  }
}
*/

const buildUrl = function(url) {
  /*
  if(isYouTubeUrl(url)) {
    const { id, service} = getVideoId(url);
    if(id !== undefined) {
      return "https://www.youtube.com/embed/${id}";
    }
  }
  */

  const { id, service} = getVideoId(url);
  if( service !== undefined && id !== undefined) {
    if( service === "youtube" ) {
      return "https://www.youtube.com/embed/" + id;
    }
  }
  return url;
}


const text = $("#descr").text();

//const images = text.match(/https?:\/\/\S+\.(?:jpg|jpeg|png|gif|webp|bmp|svg)/gi) || [];
//const pages = text.match(/https?:\/\/[^\s]+?(?<!\.(jpg|jpeg|png|gif|webp|bmp|svg))(?=\s|$)/gi) || [];
//console.log(images)

const urlRegex = /https?:\/\/[^\s\[\]\)\}<>"']+/gi;
const urls = text.match(urlRegex) || [];
const imageRegex = /\.(jpg|jpeg|png|gif|webp|bmp|svg)(?=[?&#\[]|$)/i;
const images = urls.filter(url => imageRegex.test(url));
const pages = urls.filter(url => !imageRegex.test(url));

const $metadata = $("#metadata").first();
const $preview = $('<div id="preview"></div>').css({"text-align": "center"});

images.forEach(url => {
  const $img = $("<img>").attr("src", url);
  $img.css({
    "max-width": "95%",
    "height": "auto",
    "margin": "10px 0",
    "display": "inline-block"
  });
  $preview.append($img);
  const $link = $("<p>").append($("<a>")
                                .attr("href", url)
                                .attr("target", "_blank")
                                .attr("rel", "noopener noreferrer")
                                .text("☝️ " + url)
  );
  $preview.append($link);
});


pages.forEach(url => {
  const dstUrl = buildUrl(url);
  const $iframe = $("<iframe>").attr("src", dstUrl).css({
    "width": "95%",
    "height": "512px",
    "border": "0"
  });

  $preview.append($iframe);
  const $link = $("<p>").append($("<a>")
                                .attr("href", url)
                                .attr("target", "_blank")
                                .attr("rel", "noopener noreferrer")
                                .text("☝️ " + url)
  );
  $preview.append($link);
});

$metadata.after($preview);

/* =========== embedded get-video-id ============ */

/*! get-video-id v4.1.7 | @license MIT © Michael Wuergler | https://github.com/radiovisual/get-video-id */

/**
 * Strip away any remaining parameters following `?` or `/` or '&' for YouTube shortcode strings.
 *
 * @note this function is not meant to work with url strings containing a protocol like https://
 * @param {String} shortcodeString - the parameter string
 * @returns {String}
 */
function stripParameters(shortcodeString) {
  // Split parameters or split folder separator
  if (shortcodeString.includes('?')) {
    shortcodeString = shortcodeString.split('?')[0];
  }
  if (shortcodeString.includes('/')) {
    shortcodeString = shortcodeString.split('/')[0];
  }
  if (shortcodeString.includes('&')) {
    shortcodeString = shortcodeString.split('&')[0];
  }
  return shortcodeString;
}

/**
 * Get the Youtube Video id.
 * @param {string} youtubeStr - the url from which you want to extract the id
 * @returns {string|undefined}
 */
function youtube(youtubeString) {
  let string_ = youtubeString;

  // Remove the '-nocookie' flag from youtube urls
  string_ = string_.replace('-nocookie', '');

  // Remove time hash at the end of the string
  string_ = string_.replace(/#t=.*$/, '');

  // Strip the leading protocol
  string_ = string_.replace(/^https?:\/\//, '');

  // Shortcode
  const shortcode = /youtube:\/\/|youtu\.be\/|y2u\.be\//g;
  if (shortcode.test(string_)) {
    const shortcodeid = string_.split(shortcode)[1];
    return stripParameters(shortcodeid);
  }

  // Shorts
  const shortsUrl = /\/shorts\//g;
  if (shortsUrl.test(string_)) {
    return stripParameters(string_.split(shortsUrl)[1]);
  }

  // V= or vi=
  const parameterv = /v=|vi=/g;
  if (parameterv.test(string_)) {
    const array = string_.split(parameterv);
    return stripParameters(array[1].split('&')[0]);
  }

  // /v/ or /vi/ or /watch/
  const inlinev = /\/v\/|\/vi\/|\/watch\//g;
  if (inlinev.test(string_)) {
    const inlineid = string_.split(inlinev)[1];
    return stripParameters(inlineid);
  }

  // Format an_webp
  const parameterwebp = /\/an_webp\//g;
  if (parameterwebp.test(string_)) {
    const webp = string_.split(parameterwebp)[1];
    return stripParameters(webp);
  }

  // /e/
  const eformat = /\/e\//g;
  if (eformat.test(string_)) {
    const estring = string_.split(eformat)[1];
    return stripParameters(estring);
  }

  // Embed
  const embedreg = /\/embed\//g;
  if (embedreg.test(string_)) {
    const embedid = string_.split(embedreg)[1];
    return stripParameters(embedid);
  }

  // ignore /user/username pattern
  const usernamereg = /\/user\/([a-zA-Z\d]*)$/g;
  if (usernamereg.test(string_)) {
    return undefined;
  }

  // User
  const userreg = /\/user\/(?!.*videos)/g;
  if (userreg.test(string_)) {
    const elements = string_.split('/');
    return stripParameters(elements.pop());
  }

  // Attribution_link
  const attrreg = /\/attribution_link\?.*v%3D([^%&]*)(%26|&|$)/;
  if (attrreg.test(string_)) {
    return stripParameters(string_.match(attrreg)[1]);
  }

  // Live
  const livereg = /\/live\//g;
  if (livereg.test(string_)) {
    const liveid = string_.split(livereg)[1];
    return stripParameters(liveid);
  }
  return undefined;
}

/**
 * Get the vimeo id.
 *
 * @param {String} vimeoString the url from which you want to extract the id
 * @returns {String|undefined}
 */
function vimeo(vimeoString) {
  let string_ = vimeoString;
  if (string_.includes('#')) {
    [string_] = string_.split('#');
  }
  if (string_.includes('?') && !string_.includes('clip_id=')) {
    [string_] = string_.split('?');
  }
  let id;
  let array;
  const event = /https?:\/\/vimeo\.com\/event\/(\d+)$/;
  const eventMatches = event.exec(string_);
  if (eventMatches && eventMatches[1]) {
    return eventMatches[1];
  }
  const primary = /https?:\/\/vimeo\.com\/(\d+)/;
  const matches = primary.exec(string_);
  if (matches && matches[1]) {
    return matches[1];
  }
  const vimeoPipe = ['https?://player.vimeo.com/video/[0-9]+$', 'https?://vimeo.com/channels', 'groups', 'album'].join('|');
  const vimeoRegex = new RegExp(vimeoPipe, 'gim');
  if (vimeoRegex.test(string_)) {
    array = string_.split('/');
    if (array && array.length > 0) {
      id = array.pop();
    }
  } else if (/clip_id=/gim.test(string_)) {
    array = string_.split('clip_id=');
    if (array && array.length > 0) {
      [id] = array[1].split('&');
    }
  }
  return id;
}

/**
 * Get the vine id.
 * @param {string} string_ - the url from which you want to extract the id
 * @returns {string|undefined}
 */
function vine(string_) {
  const regex = /https:\/\/vine\.co\/v\/([a-zA-Z\d]*)\/?/;
  const matches = regex.exec(string_);
  if (matches && matches.length > 1) {
    return matches[1];
  }
  return undefined;
}

/**
 * Get the VideoPress id.
 * @param {string} urlString - the url from which you want to extract the id
 * @returns {string|undefined}
 */
function videopress(urlString) {
  let idRegex;
  if (urlString.includes('embed')) {
    idRegex = /embed\/(\w{8})/;
    return urlString.match(idRegex)[1];
  }
  idRegex = /\/v\/(\w{8})/;
  const matches = urlString.match(idRegex);
  if (matches && matches.length > 0) {
    return matches[1];
  }
  return undefined;
}

/**
 * Get the Microsoft Stream id.
 * @param {string} urlString - the url from which you want to extract the id
 * @returns {string|undefined}
 */
function microsoftStream(urlString) {
  const regex = urlString.includes('embed') ? /https:\/\/web\.microsoftstream\.com\/embed\/video\/([a-zA-Z\d-]*)\/?/ : /https:\/\/web\.microsoftstream\.com\/video\/([a-zA-Z\d-]*)\/?/;
  const matches = regex.exec(urlString);
  if (matches && matches.length > 1) {
    return matches[1];
  }
  return undefined;
}

/**
 * Get the tiktok id.
 * @param {string} urlString - the url from which you want to extract the id
 * @returns {string|undefined}
 */
function tiktok(urlString) {
  // Parse basic url and embeds
  const basicReg = /tiktok\.com(.*)\/video\/(\d+)/gm;
  const basicParsed = basicReg.exec(urlString);
  if (basicParsed && basicParsed.length > 2) {
    return basicParsed[2];
  }
  return undefined;
}

/**
 * Get the dailymotion id.
 * @param {string} urlString - the url from which you want to extract the id
 * @returns {string|undefined}
 */
function dailymotion(urlString) {
  // Parse basic url and embeds
  const basicReg = /dailymotion\.com(.*)(video)\/([a-zA-Z\d]+)/gm;
  const basicParsed = basicReg.exec(urlString);
  if (basicParsed) {
    return basicParsed[3];
  }

  // Parse shortlink
  const shortRegex = /dai\.ly\/([a-zA-Z\d]+)/gm;
  const shortParsed = shortRegex.exec(urlString);
  if (shortParsed && shortParsed.length > 1) {
    return shortParsed[1];
  }

  // Dynamic link
  const dynamicRegex = /dailymotion\.com(.*)video=([a-zA-Z\d]+)/gm;
  const dynamicParsed = dynamicRegex.exec(urlString);
  if (dynamicParsed && dynamicParsed.length > 2) {
    return dynamicParsed[2];
  }
  return undefined;
}

/**
 * Get the loom id.
 * @param {string} urlString - the url from which you want to extract the id
 * @returns {string|undefined}
 */
function loom(urlString) {
  const regex = /^https?:\/\/(?:www\.)?loom\.com\/(?:share|embed)\/([\da-zA-Z]+)\/?/;
  const matches = regex.exec(urlString);
  if (matches && matches.length > 1) {
    return matches[1];
  }
  return undefined;
}

/**
 * Get the value assigned to a "src" attribute in a string, or undefined.
 * @param {String} input
 * @returns {String|undefined}
 */
function getSrc(input) {
  if (typeof input !== 'string') {
    throw new TypeError('getSrc expected a string');
  }
  const srcRegEx = /src="(.*?)"/gm;
  const matches = srcRegEx.exec(input);
  if (matches && matches.length >= 2) {
    return matches[1];
  }
  return undefined;
}

/**
 * Prepare the URL by doing common cleanup operations common for all URL types.
 * @param {String} input
 * @returns {String}
 */
function sanitizeUrl(input) {
  if (typeof input !== 'string') {
    throw new TypeError(`sanitizeUrl expected a string, got ${typeof input}`);
  }
  let string_ = input;
  if (/<iframe/gi.test(string_)) {
    string_ = getSrc(string_) || '';
  }

  // Remove surrounding whitespaces or linefeeds
  string_ = string_.trim();

  // Remove any leading `www.`
  string_ = string_.replace('/www.', '/');
  return string_;
}

/**
 * Extract the url query parameter from a Google redirect url.
 *
 * @example
 * ```javascript
 * const url = extractGoogleRedirectionUrl('https://www.google.cz/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&ved=0ahUKEwj30L2MvpDVAhUFZVAKHb8CBaYQuAIIIjAA&url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DdQw4w9WgXcQ')
 * // => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
 * ```
 * @param {String} input
 * @returns {String}
 */
function extractGoogleRedirectionUrl(input) {
  if (typeof input !== 'string') {
    throw new TypeError(`extractGoogleRedirectionUrl expected a string, got ${typeof input}`);
  }
  const string_ = input.trim();

  // Try to handle google redirection uri
  if (/\/\/google|www\.google/.test(string_)) {
    try {
      const urlObject = new URL(input);
      const parameters = new URLSearchParams(urlObject.search);
      const extractedUrl = parameters.get('url');
      if (extractedUrl) {
        return decodeURIComponent(extractedUrl);
      }
    } catch {
      // If there's an error (e.g., input is not a valid URL), return the trimmed input
      return string_;
    }
  }
  return string_;
}

/**
 * Get the id and service from a video url.
 * @param {String} urlString - the url from which you want to extract the id
 * @returns {Object}
 */
function getVideoId(urlString) {
  if (typeof urlString !== 'string') {
    throw new TypeError('get-video-id expects a string');
  }
  const string_ = sanitizeUrl(urlString);
  const url = extractGoogleRedirectionUrl(string_);
  let metadata = {
    id: undefined,
    service: undefined
  };
  if (/youtube|youtu\.be|y2u\.be|i.ytimg\./.test(url)) {
    metadata = {
      id: youtube(url),
      service: 'youtube'
    };
  } else if (/vimeo/.test(url)) {
    metadata = {
      id: vimeo(url),
      service: 'vimeo'
    };
  } else if (/vine/.test(url)) {
    metadata = {
      id: vine(url),
      service: 'vine'
    };
  } else if (/videopress/.test(url)) {
    metadata = {
      id: videopress(url),
      service: 'videopress'
    };
  } else if (/microsoftstream/.test(url)) {
    metadata = {
      id: microsoftStream(url),
      service: 'microsoftstream'
    };
  } else if (/tiktok\.com/.test(url)) {
    metadata = {
      id: tiktok(url),
      service: 'tiktok'
    };
  } else if (/(dailymotion\.com|dai\.ly)/.test(url)) {
    metadata = {
      id: dailymotion(url),
      service: 'dailymotion'
    };
  } else if (/loom\.com/.test(url)) {
    metadata = {
      id: loom(url),
      service: 'loom'
    };
  }
  return metadata;
}
