// ==UserScript==
// @name        Canadian Common CV Tweak
// @author      Sylvain Hallé
// @description Tweak the Canadian Common CV's interface
// @match       https://ccv-cvc.ca/researcherProcManageGenericCV*
// @require     http://code.jquery.com/jquery-1.11.2.min.js
// @date        2015-02-07
// @version     1.0
// @namespace   CVC
// @license     Mozilla Public License 2.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/7940/Canadian%20Common%20CV%20Tweak.user.js
// @updateURL https://update.greasyfork.org/scripts/7940/Canadian%20Common%20CV%20Tweak.meta.js
// ==/UserScript==

// Initialize jQuery; since the CCV uses Dojo, we must run it
// in no-conflict mode
var $j = jQuery.noConflict();

// -----------------------------
// Configuration settings. This is editable if you like.
// -----------------------------

var ccv_config = {
  "pageWidth" : 1280, // Global width of the page in pixels
  
  // Text replacements to improve the display of data
  // You can add your own custom replacements here
  "replacements" : [
    // Months in French and English
    ["Janvier", "01"], ["Février", "02"], ["Mars", "03"],
    ["Avril", "04"], ["Mai", "05"], ["Juin", "06"],
    ["Juillet", "07"], ["Août", "08"], ["Septembre", "09"],
    ["Octobre", "10"], ["Novembre", "11"], ["Décembre", "12"],
    ["January", "01"], ["February", "02"], ["March", "03"],
    ["April", "04"], ["May", "05"], ["June", "06"],
    ["July", "07"], ["August", "08"], ["September", "09"],
    ["October", "10"], ["November", "11"], ["December", "12"],
    // French replacements for the students page
    ["Institution de l'étudiant", "Institution"],
    ["Conseiller académique", "Cons. acad."],
    ["Superviseur principal", "Sup. princ."],
    ["Baccalauréat", "B.Sc."], ["Doctorat", "Ph.D."],
    ["Maîtrise avec mémoire", "M.Sc. mémoire"],
    ["Maîtrise sans mémoire", "M.Sc. stage"],
    ["Université du Québec à Chicoutimi", "UQAC"],
    
  ],
  
  // Parameters for the "conference papers" page
  "conferencePapers" : {
    // Width of each column in pixels
    "columns" : [
      { "width" : 40,  "showHeader" : false },
      { "width" : 40,  "showHeader" : false },
      { "width" : 40,  "showHeader" : false },
      { "width" : 400, "showHeader" : true },
      { "width" : 60,  "showHeader" : false },
      { "width" : 400, "showHeader" : true },
      { "width" : 100, "showHeader" : true },
      { "width" : 100, "showHeader" : true }
    ]
  },
  // Parameters for the "student supervision" page
  "students" : {
    // Width of each column in pixels
    "columns" : [
      { "width" : 40,  "showHeader" : false },
      { "width" : 40,  "showHeader" : false },
      { "width" : 60, "showHeader" : true },
      { "width" : 40,  "showHeader" : false },
      { "width" : 40,  "showHeader" : false },
      { "width" : 120, "showHeader" : true },
      { "width" : 100, "showHeader" : true },
      { "width" : 100, "showHeader" : false },
      { "width" : 60,  "showHeader" : false },
      { "width" : 60,  "showHeader" : false },
      { "width" : 60,  "showHeader" : false },
      { "width" : 60,  "showHeader" : false },
      { "width" : 60,  "showHeader" : false }
    ]
  },
  // Parameters for the "conference reviews" page
  "conferenceReviews" : {
    // Width of each column in pixels
    "columns" : [
      { "width" : 70,  "showHeader" : false },
      { "width" : 30,  "showHeader" : false },
      { "width" : 40,  "showHeader" : false },
      { "width" : 70,  "showHeader" : false },
      { "width" : 500, "showHeader" : true },
      { "width" : 200, "showHeader" : true },
      { "width" : 100, "showHeader" : true },
      { "width" : 100, "showHeader" : true }
    ]
  }
};

// Replace month names by digits (shorter)
var replace_text = function(s) {
  for (var i in ccv_config.replacements) {
    var replacement = ccv_config.replacements[i];
    s = s.replace(replacement[0], replacement[1]);
  }
  return s;
};

if ($j("#table").length !== 0 // Main page
    || $j("#tableConferencePublications").length !== 0 // Publications page
    || $j("table[id*='tableStudent/PostdoctoralSupervision']").length !== 0 // Students
    || $j("#tableConferenceReviewActivities").length !== 0
) { // OK, we are in a page where we should do something

// -----------------------------
// Global settings
// -----------------------------

// We must first override the 800px page width that is hard-coded
// in the style of lots of elements inside the page
$j("body").width(ccv_config.pageWidth);
$j("#cn-head-inner > header > div").width(ccv_config.pageWidth);
$j("#cn-cmb").width(ccv_config.pageWidth);
$j("#cn-cols > div").width(ccv_config.pageWidth);
$j("#cn-cols > div > table").width(ccv_config.pageWidth);
$j("#cn-body-inner-1col").width(ccv_config.pageWidth);
$j("#cen-centre-col").width(ccv_config.pageWidth);
$j("#cn-centre-col-inner table").width(ccv_config.pageWidth);

// For every "rectangle" of data...
// We first set it to the new width, and set its height to
// auto. Its contents will fill the page vertically, instead of only
// using up 300px.
$j("#divSurroundTable").width(ccv_config.pageWidth).height("auto");

// We then change the text style of every rectangle. To display more
// data, we remove boldface and set the text to be slightly smaller
$j("#divSurroundTable > table th > a").add("#divSurroundTable > table td").css(
  {
    "font-weight" : "normal",
    "color" : "black",
    "font-size" : "16px",
    "font-family" : "'Liberation Sans Narrow', 'Arial Narrow', sans-serif"
  });

// -----------------------------
// Conference papers
// -----------------------------

// Force the table to listen to our dimensions
$j("#tableConferencePublications").css(
  {
    "table-layout" : "fixed",
    "width" : ccv_config.pageWidth
  }
);

// Re-enable word-wrapping for table cells
$j("#tableConferencePublications th").add(
  "#tableConferencePublications th a").add(
  "#tableConferencePublications td").css(
  {
    "word-wrap" : "break-word",
    "white-space" : "normal"
  }
);

// Manually force the width of each table cell according to config
$j("#tableConferencePublications thead th").each(function(index, el) {
  $j(this).width(ccv_config.conferencePapers.columns[index].width);
  if (ccv_config.conferencePapers.columns[index].showHeader === false) {
    $j(this).children("a").css({"display" : "none"});
  }
});
$j("#tableConferencePublications tbody tr").each(function(i, el) {
  $j(this).children("td").each(function(index, e) {
    $j(this).width(ccv_config.conferencePapers.columns[index].width);  
  })
});

// -----------------------------
// Students supervised
// -----------------------------

// Force the table to listen to our dimensions
$j("table[id*='tableStudent/PostdoctoralSupervision']").css(
  {
    "table-layout" : "fixed",
    "width" : ccv_config.pageWidth
  }
);

// Re-enable word-wrapping for table cells
$j("table[id*='tableStudent/PostdoctoralSupervision'] th").add(
  "table[id*='tableStudent/PostdoctoralSupervision'] th a").add(
  "table[id*='tableStudent/PostdoctoralSupervision'] td").css(
  {
    "word-wrap" : "break-word",
    "white-space" : "normal"
  }
);

// Manually force the width of each table cell according to config
$j("table[id*='tableStudent/PostdoctoralSupervision'] thead th").each(function(index, el) {
  $j(this).width(ccv_config.students.columns[index].width);
  if (ccv_config.students.columns[index].showHeader === false) {
    $j(this).children("a").css({"display" : "none"});
  }
});
$j("table[id*='tableStudent/PostdoctoralSupervision'] tbody tr").each(function(i, el) {
  $j(this).children("td").each(function(index, e) {
    $j(this).width(ccv_config.students.columns[index].width);  
    var span = $j(this).children("span");
    span.html(replace_text(span.text()));
  })
});

// -----------------------------
// Conference reviews
// -----------------------------

// Force the table to listen to our dimensions
$j("#tableConferenceReviewActivities").css(
  {
    "table-layout" : "fixed",
    "width" : ccv_config.pageWidth
  }
);

// Re-enable word-wrapping for table cells
$j("#tableConferenceReviewActivities th").add(
  "#tableConferenceReviewActivities th a").add(
  "#tableConferenceReviewActivities td").css(
  {
    "word-wrap" : "break-word",
    "white-space" : "normal"
  }
);

// Manually force the width of each table cell according to config
$j("#tableConferenceReviewActivities thead th").each(function(index, el) {
  $j(this).width(ccv_config.conferenceReviews.columns[index].width);
  if (ccv_config.conferenceReviews.columns[index].showHeader === false) {
    $j(this).children("a").css({"display" : "none"});
  }
});
$j("#tableConferenceReviewActivities tbody tr").each(function(i, el) {
  $j(this).children("td").each(function(index, e) {
    $j(this).width(ccv_config.conferenceReviews.columns[index].width);  
  })
});
  
};