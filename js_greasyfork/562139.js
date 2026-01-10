// ==UserScript==
// @name        Flow Name & Screen ( + Saved State ) In Browser Tab / Page Title (Power Automate/powerautomate.com)
// @namespace   Eliot Cole Scripts
// @match       https://make.powerautomate.com/environments/*/flows/*
// @grant       none
// @license     MIT
// @run-at      document-end
// @version     1.0
// @author      -
// @description This will tell you the name of a 10/01/2026, 14:30:05
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @require     https://cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/562139/Flow%20Name%20%20Screen%20%28%20%2B%20Saved%20State%20%29%20In%20Browser%20Tab%20%20Page%20Title%20%28Power%20Automatepowerautomatecom%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562139/Flow%20Name%20%20Screen%20%28%20%2B%20Saved%20State%20%29%20In%20Browser%20Tab%20%20Page%20Title%20%28Power%20Automatepowerautomatecom%29.meta.js
// ==/UserScript==

VM.observe(document.body, () => {
  let UriPostFlow = document.URL.split('/flows/')[1];
  let UriPreFlow = document.URL.split('/flows/')[0];
  console.log('EllyPAuto:: Identifying Type From: '+UriPostFlow);
  let PostFlowHasSlash = UriPostFlow.toLowerCase().includes('/');
  let IsNewFlow = false;
  let CnLg;
  let $node;
  let FlowScreen;
  let FlowScreenType;
  if(PostFlowHasSlash){
    let NonEditScreen = UriPostFlow.toLowerCase().split('/')[1];
    FlowScreenType = 'nonedit';
    if ( NonEditScreen.startsWith('runs') ) {
      FlowScreen = 'runs';
      let urlEndy = document.URL.split('/runs')[0].split('/environments/')[1];
      console.log('EllyPAuto:: urlEndy: '+urlEndy);
      let Selecty1 = 'div.fl-PageHeader * li.ms-Breadcrumb-listItem a.ms-Link.ms-Breadcrumb-itemLink[href="/environments/'+urlEndy+'/details"]';
      console.log('EllyPAuto:: Selecty1: '+Selecty1);
      let Selecty2 = 'div.fl-PageHeader * li.ms-Breadcrumb-listItem a.ms-Link.ms-Breadcrumb-itemLink[href="https://make.powerautomate.com/environments/'+urlEndy+'/details"]';
      console.log('EllyPAuto:: Selecty2: '+Selecty2);
      $node = $(''+Selecty1+','+Selecty2+'');
      console.log('EllyPAuto:: FULL SELECTY: '+Selecty2);
    } else {
      FlowScreen = 'details';
      $node = $('h2[data-automation-id="flowNameText"]'); // YES I AM AWARE I NEED TO LOOK AT THE OTHER SCREENS RELATED TO A FLOW (see 'Runs selector' above as first example therein)
    };
    CnLg = 'EllyPAuto - Flow page is '+FlowScreen+'.';

  } else {
    CnLg = 'EllyPAuto - Flow page IS edit!';
    FlowScreen = 'edit';
    FlowScreenType = 'edit';
    let IsNewFlow = UriPostFlow.toLowerCase().startsWith('new');
    if(IsNewFlow){
      FlowScreen = 'new';
    };
    $node = $('div#fl-ActionHeadingTitle-label');
  };
  console.log(CnLg);
  if ($node.length) {

    $node.each(function(){
      //console.log('EllyPAuto:: Itsa NEWBIE!'); //just here for testing
      let PAutoTit = $(this).text();
      //let FlowScreen = 'edit'; //just here for testing
      let EllyPAutoTit = FlowScreen.concat(': ', PAutoTit);
      document.title = EllyPAutoTit;
      if (FlowScreenType == 'edit') {
        VM.observe(document.body, () => {
          const $node = $('button[data-automation-id="flow_save_success_message"]');
          if ($node.length) {
            $node.each(function(){
              document.title = '! SAVED ! '+PAutoTit;
              setTimeout(function() {
                document.title = EllyPAutoTit;
              }, 5000);
            });

            // disconnect observer - This is disabled as if you disconnect you cannot enter more comments
            //return true;
          }
        });
      };
    });
    // disconnect observer - This is disabled as if you disconnect you cannot enter more comments
    //return true;
  }
});