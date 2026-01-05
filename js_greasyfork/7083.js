// ==UserScript==
// @name        MyMunzeeProfile
// @namespace   MyMunzeeProfile
// @include     https://www.munzee.com/m/*
// @version     1.1.4
// @grant       none
// @description my Munzee profile script
// @downloadURL https://update.greasyfork.org/scripts/7083/MyMunzeeProfile.user.js
// @updateURL https://update.greasyfork.org/scripts/7083/MyMunzeeProfile.meta.js
// ==/UserScript==
// 1.1.2: Added new badges
// 1.1.3: https support
// 1.1.4: More badges

jQuery(document).ready(function ($) {
  function handleBatches() {
    var badges = {
      achievements: {
        description: 'Achievement badges', 
        searches: [{
          attr: 'data-title',
          search: '=',
          titles: [
            'Perfect 10', 'Over The Hill', 'Centurion', 
            '1k Day', '5k Day', '10k Day', '25k Day', 
            '#1', 'Top 10', 'Top 50', 'Top 100', 
            'Winner', 'First Loser', 'Lucky', 'Unlucky',
            'Rover Walker', 'Rover Mover', 'Rover Transporter', 
            'Easy as Pi', 'Repeater', 'Family Jewels'
          ]
        }]
      },
      captures: {
        description: 'Capture badges', 
        searches: [{
          attr: 'data-title',
          search: '=',
          titles: [
            'Seeker', 'Capture Streak', 'Capture Super Streak', 'First Responder', 'Sampler', 
            'ROY G BIV', 'It\\\'s a Blast!', 'Dirty Dozen', 
            'Hunter', 'Collector', 'Hoarder', 'Curator', 'Historian', '5 by 5', 
            'Breakfast', 'Wifi', 'Pool', 'Hotel Bellhop', 'Hotel Valet', 'Hotel Concierge'
          ]
        }]
      },
      deploys: {
        description: 'Deploy badges', 
        searches: [{
        attr: 'data-title',
        search: '=',
          titles: [
            'Hider', 'Deploy Streak', 'Deploy Super Streak', 'Super Streak', 'Super Duper ULTRA Streak',
            'Air Munzee', '5 by 5 deployed', '100 Green', '1000 Green', '5000 Green',
            'Virtual High 5', 'Watson', 'Holmes', 
            'VardemInn', 'Foster\\\'s Palace', 'Founders\\\' Towers', 
            'Overview Hotel', 'Hilly Hotel', 'Fates Hotel'
          ]
        }]
      },
      battle: {
        description: 'Battle badges', 
        searches: [{
          attr: 'data-title',
          search: '=',
          titles: [
            'Clan Gold', 'Clan Silver', 'Clan Bronze',
            'Battle Ready', 'Warrior', 'Combat Chuck', 'SuperChuck'
          ]
        }]
      },
      socials: {
        description: 'Social badges', 
        attr: 'data-title',
        searches: [
          {
            attr: 'data-title',
            search: '=',
            titles: [
              'Social Caterpillar', 'Social Cocoon', 'Social Butterfly', 'Social Princess', 'Social Queen', 
              'Social Tadpole', 'Social Froglet', 'Social Frog', 'Social Prince'
            ]
          }
        ]
      },
      munzee: {
        description: 'Munzee special badges', 
        searches: [
          {
            attr: 'data-title',
            search: '=',
            titles: [
              'Early Bird', 'Munzee HQ', 'MHQ Badge', 
              'Grand Opening', 'Munzee Marketplace', 'Behind the Wall', 
              'Player Of The Week', 'Meet the Makers', 'Reseller', 
              'MHQ Bash 2014', 'Worlds Collide MHQ', 'Munzee Garden'
            ]
          }
        ]
      },
      christmas: {
        description: 'Christmas badges', 
        searches: [
          {
            attr: 'data-title',
            search: '^=',
            titles: [
              'Christmas '
            ]
          }
        ]
      },
      event: {
        description: 'Event badges', 
        searches: [
          {
            attr: 'data-title',
            search: '=',
            titles: [
              'Event Host', 'Twice The Fun', 'CoExist'
            ]
          }, 
          {
            attr: 'data-content',
            search: '*=',
            titles: [
              'Thanks for having fun in Cologne! Hope you tried some Kölsch!',
              'Thanks for participating, hope you have fun'
            ]
          }
        ]
      },
      eventzee: {
        description: 'Eventzee', 
        searches: [
          {
            attr: 'data-title',
            search: '=',
            titles: [
              'Pin Hole Camera', 'Instant Camera', 'Point and Shoot Camera', 'The Lucky Penny', 
              'The Silver Bullets', 'The Midas Touch', 'Pliny\\\'s Fool\\\'s Gold', 'Grizzly Adams\\\' Gold Rush',
              'Blackbeard\\\'s Booty', 'Fun Flamingo', 'Social Serpents', 'Gala Giraffe', 'Warhol\\\'s Wunderbar',
              'Da Vinci\\\'s Design', 'Van Gogh\\\'s Vision', 'Monthly Video Contest Participant', 'Monthly Video Contest Winner',
              'Premium Photo'
            ]
          }
        ]
      }};
                
    $('#badges-listing').prepend('<div class="page-header" id="badges-listing-all"><h2><small>Other badges</small></h2></div>');
    
    $.each(badges, function (key, data) {
      var category = '<div class="page-header" style="padding-bottom: 5px; margin: 10px 0px 0px" id="badges-listing-' + key + '">' +
                     '<h2 style="margin: 0px 0px 0px;"><small>' + data['description'] + '</small></h2></div>';
      for(var h = data['searches'].length - 1; h >= 0; h--) {
        var search = data['searches'][h];
        for(var i = search['titles'].length - 1; i >= 0; i--) {
          var badge = $("li.badge-helper[" + search['attr'] + search['search'] + "'" + search['titles'][i] + "']");
          if ($(badge).length != 0) {
            if (category != '' && data['description'] != '.hidden') {
              $('#badges-listing-all').before(category);
              category = '';
            }
            if (data['description'] == '.hidden') {
              $(badge).hide();
            }
            else  {
              $('#badges-listing-' + key).after(badge);
            }
          }
        }
      }
    });
  }
  
  if (window.location.href.substring(window.location.href.length - 8) == '/badges/') {
    handleBatches()
  }
});
