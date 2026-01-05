
//// ==UserScript==
// @name            VPorn.com - A New Layout II - updated
// @namespace       http://use.i.E.your.homepage/
// @version         0.50
// @description     A unique great site got A new layout, with som added functionality and lost some. This script adds browser full video, bigger thumbnails, key and mouse navigation and interaction.

// @match           http://www.vporn.com/*
// @exclude         http://www.vporn.com/embed/*
// @match			http://www.wporns.info/*

// @require         http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @require         https://greasyfork.org/scripts/9160-my-function-library/code/My%20Function%20library.js?version=128176
// @require         https://greasyfork.org/scripts/6883-tinysort-tsort/code/TinySorttsort.js?version=27466

// @grant           GM_getValue
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_deleteValue
// @grant           GM_listValues
// @grant           GM_xmlhttpRequest

// @run-at          document-start

// @created         2015-01-28
// @released        2014-00-00
// @updated         2016-07-04

// @history         @version 0.25 - first version: public@released - 2015-02-11
// @history         @version 0.38 - pre release second version: public@released - 2015-04-24
// @history         @version 0.39 - Second Public release: 2015-04-24
// @history         @version 0.40 - Third Public release: 2015-05-02
// @history         @version 0.41 - Forth Public release: 2015-05-03
// @history         @version 0.48 - Fifth Public release: 2016-06-20
// @history         @version 0.49 - Sixth Public release: 2016-07-03
// @history         @version 0.50 - Seventh Public release: 2016-07-04

// @compatible      Greasemonkey, Tampermonkey
// @license         GNU GPL v3 (http://www.gnu.org/copyleft/gpl.html)
// @copyright       2014+, Magnus Fohlström
// @downloadURL https://update.greasyfork.org/scripts/9478/VPorncom%20-%20A%20New%20Layout%20II%20-%20updated.user.js
// @updateURL https://update.greasyfork.org/scripts/9478/VPorncom%20-%20A%20New%20Layout%20II%20-%20updated.meta.js
// ==/UserScript==

/*global $, jQuery*/

/*jshint -W014*/
// -W014, lax break, Bad line breaking before '+'
// -W030, Expected assignment or function call instead saw an expression
// -W082, a function declaration inside a block statement

(function($){
    //GM_lister( true );
    var w           = function( text, tag, style ){
            style = style || '';
            return fn.obj2Str( html.wrapTag( text, tag, style ) );
        },
        cl          = function( text, style ){
            style = style || '';
            return fn.obj2Str( $( '<span/>',{ class: style, text: text }) );
        },
        em          = function( text ){
            return fn.obj2Str( $( '<em/>' ).html(text) );
        },
        b           = function( text ){
            return fn.obj2Str( $( '<b/>' ).html(text) );
        },
        v           = function( text, width, height, src, firstLine, backTo, page ){
            return fn.obj2Str( $( '<span/>',{ class:'videolink menuTM', text:text, 'data-command':'video', 'data-back':backTo, 'data-page':page,
                'data-width':width, 'data-height':height, 'data-src':src }).append( $( '<span/>' ).text( firstLine ).hide() ) );
        },
        p           = function( text, style ){
            style = style || '';
            var obj = $( '<span/>', { class: style });
            $.each( text.split('\r'), function(id,elem){
                obj.append( $('<p/>').html(
                    elem.split('\n').join('<br>')
                        .split('\t').join('&nbsp;&nbsp;&nbsp;')
                        .split(/\s+/g).join(' ')
                ));
            });
            return fn.obj2Str( obj );
        },
        a           = function( txt, href ){
            var link = href.search('mailto:') === 0 ? '' : 'http://';
            return fn.obj2Str( $( '<a/>',{ href: link + href, class:'external', target: '_blank', text: txt }) );
        },
        l           = function( txt, cl, data, page ){
            return fn.obj2Str( $( '<a/>',{ class: cl, 'data-command': data, 'data-text': txt, 'data-page': page, text: txt }) );
        },
        GM          = {
            show    : function( dialog ){
                setTimeout(function(){
                    render.tm();
                    $('#holderTM').show();
                    dialog == 'update' && (
                        html.latestTM()
                    );
                    c.i('firstRun');
                },2000);
            },
            first   : function(){
                GM_setValue('firstRun','Done');
                this.manager('set');
                this.show();
            },
            manager : function( fn ){
                var engine = function( val ){
                        switch (fn){
                            case 'set':     GM_setValue( val.name, val.default );           break;
                            case 'get':     config[ val.name ] = GM_getValue( val.name ) || GM_getValue( val.default );   break;
                            case 'del':     GM_deleteValue( val.name );                     break;
                        }
                    },  yourVer = GM_getValue('yourVer'),
                    latest = sharedData.latestVersion;

                c.i('mlatest',latest);
                c.i('myourVer',yourVer);

                yourVer !== undefined && yourVer < latest && this.show('update');
                GM_setValue('yourVer',latest);

                fn === 'del' && (GM_deleteValue( 'firstRun' ),GM_deleteValue( 'yourVer' ));
                $.each( sharedData.GM(), function(i,val){ engine(val) });
                $.each( sharedData.settings2(), function(i,val){ engine(val) });
                //$.each( sharedData.thumbSort(), function(i,val){ engine(val) });
            }
        },
        config      = {
            fullWidth   : 100,
            d80Width    : 80,
            orgWidth    : 960,
            normWidth   : 1100,
            wideWidth   : 1400,
            extraWidth  : 1800,
            startWidth	: function(){
                var winWidth = $w.width(),
                    corr = 80,
                    min = 960,
                    uiWidth = this.pageWidth === 'fullWidth'
                        ? winWidth * ( this[ this.pageWidth ] / 100 ) - corr
                        : this[ this.pageWidth ],
                    setWidth = uiWidth + corr > winWidth
                        ? winWidth - corr
                        : uiWidth;

                this.pageWidthNR = setWidth < min
                    ? min
                    : setWidth;
                //c.l('this.pageWidth',this.pageWidth);c.l('this.pageWidth === fullWidth',this.pageWidth === 'fullWidth');
                //c.l('this[ this.pageWidth ]',this[ this.pageWidth ]);c.l('uiWidth',uiWidth);c.l('setWidth',setWidth);c.l('this.pageWidthNR',this.pageWidthNR);
                //c.l('',);c.l('',);
            },
            locDoc      : window.location.href,
            sorting     : false,
            prevDoc     : 'prev',
            nextDoc     : 'next'
        },
        sharedData  = {
            latestVersion   : 0.50,
            updatesPerPage  : 3,
            updatesFirstPage: 0,
            dialogWidth     : 400,
            myName          : 'Magnus Fohlström',
            copyrightYear   : '2015 - 2016, ',
            update          : function( ){
                return [
                    { on:1	,ver:'0.50',	date:'2016-07-03',	type:'update',	visible:'y',	magnitude:'MAJOR',	name:'Page Navigation',	    desc:'Faster safer and not breaking layout, not running out of space - to show page buttons' },
                    { on:1	,ver:'0.50',	date:'2016-07-03',	type:'fixed',	visible:'y',	magnitude:'mini',	name:'Copyright',	        desc:'Added a space after Copyright symbol' },
                    { on:1	,ver:'0.50',	date:'2016-07-03',	type:'update',	visible:'y',	magnitude:'major',	name:'Refresh button',	    desc:'A new refresh button, with a hover, mouse-over - function' },
                    { on:1	,ver:'0.50',	date:'2016-07-03',	type:'fixed',	visible:'y',	magnitude:'mini',	name:'Update box width',	desc:'The box now is filled in width of the update dialog' },
                    { on:1	,ver:'0.50',	date:'2016-07-03',	type:'fixed',	visible:'y',	magnitude:'minor',	name:'menuState',		    desc:'Saving state of always show' },
                    { on:1	,ver:'0.50',	date:'2016-07-03',	type:'fixed',	visible:'y',	magnitude:'minor',	name:'Show Menu click',		desc:'Checkbox is now click-able' },
                    { on:1	,ver:'0.49',	date:'2016-06-20',	type:'new',		visible:'y',	magnitude:'minor',	name:'Latest version',		desc:'Latest update version is now displayed in the dialog' },
                    { on:1	,ver:'0.49',	date:'2016-06-20',	type:'fixed',	visible:'y',	magnitude:'mini',	name:'menu Button',	        desc:'Are now only reacting to left click mouse-up, now things happens in right order' },
                    { on:1	,ver:'0.49',	date:'2016-06-20',	type:'fixed',	visible:'y',	magnitude:'major',	name:'Copyright',	        desc:'Layout fixed - is now centered, when menu is hidden. Down under in code, many change was needed' },
                    { on:1	,ver:'0.49',	date:'2016-06-20',	type:'update',	visible:'y',	magnitude:'mini',	name:'A Dot',	            desc:'Update description is always followed, by a dot' },
                    { on:1	,ver:'0.49',	date:'2016-06-20',	type:'fixed',	visible:'y',	magnitude:'mini',	name:'menuState',	        desc:'Always show menu, is true. By default' },
                    { on:1	,ver:'0.49',	date:'2016-06-20',	type:'new',	    visible:'y',	magnitude:'major',	name:'Dynamic width size',	desc:'Dynamically changes when browser width size changes, Full witdh of the browser' },
                    { on:1	,ver:'0.48',	date:'2016-06-18',	type:'update',	visible:'n',	magnitude:'major',	name:'myFunction Library',	desc:'Added latest version of myFunction\'s Library' },
                    { on:1	,ver:'0.48',	date:'2016-06-18',	type:'fixed',	visible:'y',	magnitude:'mini',	name:'Center pager',	    desc:'The pager is now displaying page buttons centered' },
                    { on:1	,ver:'0.48',	date:'2016-06-18',	type:'new',		visible:'y',	magnitude:'mini',	name:'Buttons left click',	desc:'Make sure that only right mouse button - work' },
                    { on:1	,ver:'0.48',	date:'2016-06-18',	type:'new',		visible:'y',	magnitude:'major',	name:'Latest Button',		desc:'You can now, push a button for latest update and isn\'t  repeated' },
                    { on:1	,ver:'0.48',	date:'2016-06-18',	type:'fixed',	visible:'y',	magnitude:'mini',	name:'Fix Reverce Order',	desc:'Now Reverce order button always working, before needed some extra clicks' },
                    { on:1	,ver:'0.47',	date:'2016-06-12',	type:'fixed',	visible:'y',	magnitude:'mini',	name:'Center Pager',	    desc:'Pager now centers everywhere - css fix' },
                    { on:1	,ver:'0.47',	date:'2016-06-11',	type:'fixed',	visible:'y',	magnitude:'major',	name:'Fixed Latest Update',	desc:'Now shows latest updates, instead of blank' },
                    { on:1	,ver:'0.47',	date:'2016-06-11',	type:'new',		visible:'y',	magnitude:'minor',	name:'Visible Thumbs',		desc:'In sort menu, shows how many thumbs are visible of the total, delivered' },
                    { on:1	,ver:'0.46',	date:'2016-04-08',	type:'fixed',	visible:'y',	magnitude:'mini',	name:'Fix thumb info',		desc:'Title was messed up by other info, now fixed' },
                    { on:1	,ver:'0.46',	date:'2016-04-07',	type:'new',		visible:'y',	magnitude:'minor',	name:'Reverse Order',		desc:'Reverse the order of that sort function, a small bug is remaining' },
                    { on:1	,ver:'0.46',	date:'2016-04-05',	type:'new',		visible:'y',	magnitude:'minor',	name:'Video minMax',		desc:'Now you can show thumbs between minimum and maximum length' },
                    { on:1	,ver:'0.45',	date:'2015-12-29',	type:'new',		visible:'y',	magnitude:'major',	name:'Thumb Sorter',		desc:'On each thumb pages individual you can sort by date or length and choice only to show HD thumbs' },
                    { on:1	,ver:'0.44',	date:'2015-12-27',	type:'update',	visible:'y',	magnitude:'minor',	name:'Page Navigation',		desc:'Error Correcting and faster function to navigate thumb pages' },
                    { on:1	,ver:'0.43',	date:'2015-10-09',	type:'new',		visible:'y',	magnitude:'minor',	name:'Active Button',		desc:'Visually mark active button' },
                    { on:1	,ver:'0.43',	date:'2015-10-08',	type:'fixed',	visible:'y',	magnitude:'minor',	name:'Foot',				desc:'Now is foot always  close to bottom, not jumping around' },
                    { on:1	,ver:'0.43',	date:'2015-10-08',	type:'update',	visible:'n',	magnitude:'minor',	name:'Updates Management',	desc:'Simpler way to manage the updates information page' },
                    { on:1	,ver:'0.43',	date:'2015-10-08',	type:'new',		visible:'y',	magnitude:'minor',	name:'Fullplayer border',	desc:'Smaller white border with boxShadow and red background' },
                    { on:1	,ver:'0.42',	date:'2015-05-12',	type:'update',	visible:'y',	magnitude:'major',	name:'Video Dialog',		desc:'A video dialog there presentation - can be shown - example made' },
                    { on:1	,ver:'0.41',	date:'2015-05-03',	type:'fixed',	visible:'y',	magnitude:'minor',	name:'Button Click',		desc:'From now on it\'s when clicking a button, something will happened'},
                    { on:1	,ver:'0.41',	date:'2015-05-03',	type:'new',		visible:'y',	magnitude:'minor',	name:'Update Pager',		desc:'Update Dialog got pager' },
                    { on:1	,ver:'0.41',	date:'2015-05-03',	type:'new',		visible:'y',	magnitude:'minor',	name:'Update Latest ',		desc:'When new version ii shows latest changes, in update dialog' },
                    { on:1	,ver:'0.41',	date:'2015-05-02',	type:'new',		visible:'y',	magnitude:'minor',	name:'Auto Show Update',	desc:'Shows Update Dialog when this script is updated to new version' },
                    { on:1	,ver:'0.40',	date:'2015-05-02',	type:'new',		visible:'y',	magnitude:'major',	name:'Update Dialog',		desc:'Now you can see the latest changes' },
                    { on:1	,ver:'0.40',	date:'2015-04-30',	type:'update',	visible:'n',	magnitude:'major',	name:'Code Rewrite',		desc:'95 lines lesser code - same result, easier to manage and add information' },
                    { on:1	,ver:'0.40',	date:'2015-04-29',	type:'fixed',	visible:'y',	magnitude:'mini',	name:'Video Dialog size',	desc:'Are now fixed - if dialog height are too big' },
                    { on:1	,ver:'0.40',	date:'2015-04-26',	type:'new',		visible:'y',	magnitude:'mini',	name:'Return',				desc:'Navigation back to where you where before you entered video dialog' },
                    { on:1	,ver:'0.39',	date:'2015-04-24',	type:'new',		visible:'y',	magnitude:'major',	name:'Video Dialog',		desc:'A dialog that will show media like videos' },
                    { on:0	,ver:false,		date:'2015-04-26',	type:'',		visible:'',		magnitude:'',		name:'menuState',			desc:''       }
                ];
            },
            dialogs         : function( ){
                return [
                    { on:1,	order:4, name:'Update Info',		command:'update',			type:'menuTM',		width: 515,			id:'updatedTM',		head:'Updates v' + this.latestVersion,	page:1,
                        firstLine:'Here can you see all the uppdates that are made.'    },
                    { on:1,	order:1, name:'About',				command:'about',			type:'menuTM',		width: 450,			id:'aboutTM',		head:'About',
                        firstLine:'Script Details.'    },
                    { on:1,	order:2, name:'Welcome',			command:'firstIntro',		type:'menuTM',		width:'default',	id:'welcomeTM',		head:'Welcome',
                        firstLine:'Hi THANKS for using this fabulous script.'    },
                    { on:1,	order:3, name:'Settings',			command:'config',			type:'menuTM',		width:'default',	id:'configTM',		head:'Set your settings',	page:1,
                        firstLine:'We all have our own preferences, choice is yours.' },
                    { on:1,	order:9, name:'Contact',			command:'contact',			type:'menuTM',		width:'default',	id:'contactTM',		head:'Contact Me',
                        firstLine:'Here you have a simple form to contact me.'    },
                    { on:1,	order:5, name:'Instruction/Help',	command:'help',				type:'menuTM',		width:'default',	id:'helpTM',		head:'Instructions - ',	page:1,
                        firstLine:'How to operate this special script.' },
                    { on:0,	order:6, name:'Other Scripts',		command:'similarScripts',	type:'menuTM',		width:'default',	id:'otherTM',		head:'',
                        firstLine:''     },
                    { on:0,	order:6, name:'Other Sites',		command:'OtherSites',		type:'menuTM',		width:'default',	id:'sitesTM',		head:'',
                        firstLine:'All the Sites this script is working on'     },
                    { on:1,	order:8, name:'Donate',				command:'donate',			type:'menuTM',		width:'default',	id:'donateTM',		head:'Donating',
                        firstLine:'What amount are you willing to lose or invest in me.'    },
                    { on:0,	order:8, name:'Video',				command:'video',			type:'menuTM',		width:'default',	id:'videoTM',		head:'',
                        firstLine:''    },
                    { on:0,	order:7, name:'Feedback',			command:'feedback',			type:'menuTM',		width:'',			id:'feedbackTM',		head:'Make a feedback',
                        firstLine:''    },
                    { on:0,	order:7, name:'My Home Page',		command:'www.myDom.com',	type:'external',	width:'default',	id:'',				head:'',
                        firstLine:''    }
                ];
            },
            about           : function( ){
                return [
                    { on:1	,name:'Name',				desc:'VPorn.com - A New Layout II'},
                    { on:1	,name:'Description',		desc:'A unique great site got A new layout, with som added functionality and lost some. ' +
                                                             'This script adds browser full video, bigger thumbnails, key and mouse navigation and interaction.'},
                    { on:1	,name:'Version',			desc: this.latestVersion },
                    { on:1	,name:'Site',				desc:'www.vporn.com'},
                    { on:1	,name:'Runs at',			desc:'document start'},
                    { on:1	,name:'Created',			desc:'2015-01-28'},
                    { on:1	,name:'Updated',			desc:'2016-07-04'},
                    { on:1	,name:'History v0.25',		desc:'1st Public: 2015-02-11'},
                    { on:1	,name:'History v0.39',		desc:'2nd Public: 2015-04-24'},
                    { on:1	,name:'History v0.40',		desc:'3rd Public: 2015-05-02'},
                    { on:1	,name:'History v0.41',		desc:'4th Public: 2015-05-03'},
                    { on:1	,name:'History v0.48',		desc:'5th Public: 2016-06-20'},
                    { on:1	,name:'History v0.49',		desc:'6th Public: 2016-07-03'},
                    { on:1	,name:'History v0.50',		desc:'7th Public: 2016-07-04'},
                    { on:0	,name:'History v0.48',		desc:'8th Public: 2016-06-20'},
                    { on:0	,name:'History v0.48',		desc:'9th Public: 2016-06-20'},
                    { on:1	,name:'Compatible',			desc:'Greasemonkey, Tampermonkey'},
                    { on:1	,name:'License',			desc:'GNU GPL v3 (http://www.gnu.org/copyleft/gpl.html)'},
                    { on:1	,name:'Copyright',			desc: this.copyrightYear + this.myName },
                    { on:0	,name:'Updated',			desc:'2015-04-18'},
                    { on:0	,name:'Updated',			desc:'2015-04-18'},
                    { on:0	,name:'Updated',			desc:'2015-04-18'},
                    { on:0	,name:'Updated',			desc:'2015-04-18'},
                    { on:0	,name:'Updated',			desc:'2015-04-18'}
                ];
            },
            minMax          : function( ){
                return [
                    { name:'Zero', unite:'Min', min:0 },
                    { name:'Five', unite:'Min', min:5 },
                    { name:'Ten', unite:'Min', min:10 },
                    { name:'Fifteen', unite:'Min', min:15 },
                    { name:'Thirty', unite:'Min', min:30 },
                    { name:'One', unite:'Hour', min:60 },
                    { name:'Two', unite:'Hour', min:120 },
                    { name:'Ten', unite:'Hour', min:600 }
                ];
            },
            thumbSort       : function( ){
                return [
                    { default : false,    name : 'Count'  ,    chk : 0,   sort : 'asc'   },
                    { default : false,    name : 'HD'     ,    chk : 0,   sort : 'asc'   },
                    { default : false,    name : 'min'    ,    chk : 0,   sort : 'dec'   },
                    { default : true ,    name : 'Length' ,    chk : 1,   sort : 'dec'   },
                    { default : false,    name : 'max'    ,    chk : 0,   sort : 'dec'   },
                    { default : true ,    name : 'Date'   ,    chk : 1,   sort : 'asc'   },
                    { default : false,    name : 'Views'   ,   chk : 1,   sort : 'dec'   },
                    { default : false,    name : 'Rating'   ,  chk : 1,   sort : 'dec'   },
                    { default : false,    name : 'Unsorted',   chk : 1,   sort : 'asc'   },
                    { default : true,     name : 'sortOrder',  chk : 0,   sort : 'asc'   }
                ];
            },
            GM              : function( ){
                return [
                    { default : true,           name :'menuState'       },
                    { default : 4,              name :'thumbCol'        },
                    { default : 'normWidth',    name :'pageWidth'       },
                    { default : false,          name :'inMenu'          },
                    { default : 0,              name :'imgHeight'       },
                    { default : 0,              name :'videoMin'        },
                    { default : 36000,          name :'videoMax'        },
                    { default : false,          name :'sortOrder'       },
                    { default : 'unsorted',     name :'sortState'       },
                    { default : false,          name :'HD'              },
                    { default : 'r',            name :'randis'          }
                ];
            },
            settings2       : function( ){
                return [
                    { on:0	,default : true,   name :'dynThumb',       title : 'Show thumbs in correct ratio aspect' },
                    { on:0	,default : false,  name :'startButton',    title : 'Inside the user menu / as a separated button' },
                    { on:0	,default : false,  name :'ads',            title : 'Show Ads' },
                    { on:1	,default : true,   name :'welcome',        title : 'Show welcome Screen' },
                    { on:0	,default : true,   name :'menuPos',        title : '' },
                    { on:1	,default : false,  name :'menuVisible',    title : 'Show menu' },
                    { on:1	,default : false,  name :'start',          title : 'Do you know how to find this dialog' },
                    { on:1	,default : false,  name :'resetDelete',    title : 'Reset All Settings' },
                    { on:1	,default : 'Auto', name :'fullPlayer',     title : 'Set full player size - when video page loads' }
                ];
            },
            sites           : function( ){
                return [
                    { on:1, name :'', href : '', added : '', workablity : '', howFast : '', ratings: '', state : '', stateChanges : '' },
                    { on:1, name :'', href : '', added : '', workablity : '', howFast : '', ratings: '', state : '', stateChanges : '' }
                ];
            }
        },
        css         = {
            head        : function( ){
                $('<style id="fontsCss"></style>'
                    + '<style id="mainCss"></style>'
                    + '<style id="bxCss"></style>'
                    + '<style id="tmCss"></style>'
                    + '<style id="fullCss"></style>').appendTo('head');
            },
            fontsCss    : function( ){
                var CssHead = $( '#fontsCss' ),
                    css = '@import url(https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.3.0/css/font-awesome.css);';
                CssHead.html().length < 10 && CssHead.empty().append( css.formatString() );
            },
            basicCss    : function( ){
                var css, CssHead = $('#mainCss'), pageWidth = config.pageWidthNR, thumbCol = config.thumbCol;

                css = ''
                    +	'.overheaderbanner, #vz_im_ad, #video-right-holder, .red-adv, '
                    +	".topSbanner, div[style*='width: 720px'], .leftbanner, #leftmenu, #video-banner {"
                    +		'display: none !important;'
                    +		'}'
                    +	'#head, .navwrap, .nwrap, #footer-nav4, .warapper-menu {'
                    +		'width: '+pageWidth+'px !important;'
                    +		'max-width: '+pageWidth+'px !important;'
                    +		'min-width: 960px !important;'
                    +		'}'
                    +	'.account-videos {'
                    +		'width: calc( 100% - 190px );'
                    +		'}'
                    +	'.video-details {'
                    +		'width: calc( '+pageWidth+'px - 18px );'
                    +		'}'

                    +	'.video-details.small {'
                    +		'padding-bottom: 45px;'
                    +		'}'

                    +	'.playerholder {'
                    +		'width: calc( '+pageWidth+'px - 18px );'
                    +		'height: 0;'
                    +		'padding-bottom: calc(100% / 16 * 9);'
                    +		'}'

                    +	'.menu-video-left > span {'
                    +		'width: 100%;'
                    +		'max-width: none !important;'
                    +		'}'
                    +	'.menu-video-left {'
                    +		'width: calc( 100% - 65px );'
                    +		'height: 39px;'
                    +		'line-height: 39px;'
                    +		'padding-left: 5px;'
                    +		'}'

                    +	'object#as3_js, #video_player video {'
                    +		'width: 100%;'
                    +		'height: 100%;'
                    +		'position: absolute;'

                    +		'}'
                    +	'.conteiner, .conteiner>div, #video, .related, .related_outer, .related_container, #leftmenu ~ div {'
                    +		'width: 100% !important;'
                    +		'}'
                    +	'#content {'
                    +		'padding-top: 0;'
                    +		'overflow: visible;'
                    +		'}'
                    +	'.nwrap >  * , body >  *  {'
                    +		'position: relative;'
                    +		'}'
                    +	'.related_outer, .related_container {'
                    +		'overflow: visible !important;'
                    +		'position: static !important;'
                    +		'height: initial !important;'
                    +		'}'
                    +	'.tplace {'
                    +		'width: 100%;'
                    +		'height: inherit;'
                    +		'}'
                    +	'.time {'
                    +		'top: inherit;'
                    +		'bottom: 85px;'
                    +		'}'
                    +	'.thumblist .bx {'
                    +		'width: calc( 100% / '+thumbCol+' - 15px ) !important;'
                    //                +		'height: calc( ('+pageWidth+'px / 5 - 15px )*(215/210)) !important;'
                    //                +		'min-height: 227px;'
                    +		'}'




                    +	'.thumblist .bx .time {'
                    +		'top: inherit;'
                    +		'bottom: 5px;'
                    +		'}'
                    +	'.thumblist .bx .thumb {'
                    +		'position: relative;'
                    /*                +		'width: 100%;'
                     +		'height: 100%;'
                     +		'display: inline;'
                     */                +		'}'
                    +	'.cholder, .cholder>div {'
                    +		'width: calc( '+pageWidth+'px  ) !important;'
                    +		'clear: both;'
                    +		'overflow: visible;'
                    +		'}'
                    +	'.bx {'
                    +		'margin-right: 13px !important;'
                    +		'}'
                    +	'.thumblist .bx .bx_title a {'
                    +		'height: 32px !important;'
                    +		'}'
                    +	'.thumblist .bx {'
                    +		'width: calc( 100% / '+thumbCol+' - 15px ) !important;'
                    +		'position: relative;'
                    +		'z-index: 1000;'
                    +		'transition: all 500ms ease-in-out 500ms;'
                    +		'}'
                    +	'.thumblist .bx:hover {'
                    +		'transform: scale( 1.25 );'
                    +		'z-index: 10000;'
                    +		'position: relative;'
                    +		'box-shadow: 0px 0px 18px 4px rgba(82, 25, 24, 0.4);'
                    +		'border: rgba(89, 35, 35, 0.79) solid 1px;'
                    +		'}'

                    +	'.cholder .thumblist, .related_outer .thumblist {'
                    +		'width: calc( 100% + 14px );'
                    +		'}'
                    +	'.thumblist div.bx div:nth-last-child( 1 ) {'
                    +		'bottom: 3px;'
                    +		'}'
                    +	'.thumblist div.bx div:nth-last-child( 2 ) {'
                    +		'bottom: 22px;'
                    +		'}'

                    +	'.thumblist .bx  {'
                    +		'display: none !;'
                    +		'}'
                    +	'.thumblist .bx.showThumb {'
                    +		'display: block !;'
                    +		'}'

                    +	'.grayarea.wline {'
                    +		'height: 39px;'
                    +		'line-height: 39px;'
                    +		'text-align: center;'
                    +		'width: 100%;'
                    +		'}'


                    +	'.warapper-menu {'
                    +		'background-color: white;'
                    +		'border-width: 1px;'
                    +		'border-style: solid;'
                    +		'border-color: rgb( 228, 228, 228 );'
                    +		'border-radius: 12px;'
                    +		'overflow: hidden;'
                    +		'}'
                    +	'.account-menu {'
                    +		'border-width: 0;'
                    +		'margin-right: 0;'
                    +		'}'
                    +	'.account-videos {'
                    +		'width: calc( 100% - 178px );'
                    +		'}'
                    +	'.account-title {'
                    +		'border: 0px solid #e4e4e4;'
                    +		'border-bottom: 1px solid #e4e4e4;'
                    +		'}'
                    +	'.account-videos-wrapp.clearfix {'
                    +		'border: 0px solid #e4e4e4;'
                    +		'}'

                    +	'i.btn.btn-default {'
                    +		'float: left;'
                    +		'padding: 11px 9px 12px 9px;'
                    +		'margin: 9px;'
                    +		'margin-top: 15px;'
                    +		'color: white;'
                    //               +		'font-family: "Open Sans", Arial, Helvetica, sans-serif;'
                    +		'font-weight: 600;'
                    +		'font-size: 12px;'
                    +		'border-radius: 3px;'
                    +		'background-color: rgb( 253, 69, 66 );'
                    +		'cursor: pointer;'
                    +		'}'
                    +	'.search {'
                    +		'width: initial !important;'
                    +		'margin: 15px 0px 0 15px !important;'
                    +		'}'
                    +	'.reloadButton {'
                    +		'position: absolute;'
                    +		'top: 49px;'
                    +		'right: 55px;background-image: linear-gradient(0,#f5f5f5 0,#fff 100%);'
                    +		'border-color: #e4e4e4;'
                    +		'border-radius: 2px;'
                    +		'border-style: solid;'
                    +		'border-width: 1px;'
                    +		'margin-top: -42px;'
                    +		'width: 40px; height: 39px;'
                    +		'}'
                    +	'.reloadButton span {'
                    +		'width: 100%;'
                    +		'height: 100%;'
                    +		'background-image: url(http://eu-st.xhamster.com/images/tpl2/icons.png?5);'
                    +		'background-position: 2px -50px;'
                    +		'zoom: 2.3;'
                    +		'display: block;'
                    +		'}'
                    +	'.reloadButton span:hover {'
                    +		'background-position: -16px -50px;'
                    +		'}'

                    +	'.thumbSort ul.sortscontain a {'
                    +		'float: left;'
                    +		'}'
                    +	'.thumbSort .sortscontain {'
                    +		'display: inline-block;'
                    +		'}'
                    +	'.thumbSort li {'
                    +		'display: block;'
                    +		'float: left;'
                    +		'font-size: 12px;'
                    +		'margin: 8px 2px 0 2px;'
                    +		'padding: 8px 11px 7px 11px;'
                    +		'background-color: #fff;'
                    +		'-moz-border-radius: 2px;'
                    +		'-webkit-border-radius: 2px;'
                    +		'border-radius: 2px;'
                    +		'-moz-box-shadow: 0 1px 1px rgba( 0, 0, 0, 0.03 );'
                    +		'-webkit-box-shadow: 0 1px 1px rgba( 0, 0, 0, 0.03 );'
                    +		'box-shadow: 0 1px 1px rgba( 0, 0, 0, 0.03 );'
                    +		'font-weight: normal;'
                    +		'line-height: 12px;'
                    +		'}'
                    +	'.thumbSort li.current {'
                    +		'font-weight: 600;'
                    +		'height: 18px;'
                    +		'padding-left: 15px;'
                    +		'padding-right: 15px;'
                    +		'margin-top: 5px;'
                    +		'-moz-border-radius: 0;'
                    +		'-webkit-border-radius: 0;'
                    +		'border-radius: 0;'
                    +		'-moz-box-shadow: none;'
                    +		'-webkit-box-shadow: none;'
                    +		'box-shadow: none;'
                    +		'border-top: 1px solid #e4e4e4;'
                    +		'border-left: 1px solid #e4e4e4;'
                    +		'border-radius: 1px solid #e4e4e4;'
                    +		'line-height: 16px;'
                    +		'background: url( "/images/new/s-active.png" ) no-repeat center top;'
                    +		'}'
                    +	'.sortline .sortscontain {'
                    +		'margin: 0;'
                    +		'}'
                    +	'.thumbSort {'
                    +		'float: right !important;'
                    +		'position: relative;'
                    +		'z-index: 100000;'
                    +		'}'

                    +	'.minititle h1 span {'
                    +		'margin-top: 11px;'
                    +		'display: inline-block;'
                    +		'}'

                    +	'.pagerwrap {'
                    +		'position: relative;'
                    +		'z-index: 100000;'
                    +		'}'
                    +	'li#sortOrder {'
                    +		'width: 91.8px;'
                    +		'padding-left: 15px;'
                    +		'padding-right: 15px;'
                    +		'}'
                    +	'li#sortOrder:not( .current ) {'
                    +		'border-top: 1px solid rgb( 255, 255, 255 );'
                    +		'border-left: 1px solid rgb( 255, 255, 255 );'
                    +		'}'

                    +	'li.max, li.min {'
                    +		'float: none;'
                    +		'margin: 0 !important;'
                    +		'border-top: 0px solid !important;'
                    +		'}'
                    +	'ul.minMax {'
                    +		'position: absolute;'
                    +		'z-index: 10000;'
                    +		'display: none;'
                    +		'margin: 19px 0 0 -30px;'
                    +		'}'
                    +	'li.minMaxWrapper:hover .minMax {'
                    +		'display: inline;'
                    +		'}'

                    +	'.HD .thumblist > div:not( .hd ) {'
                    +		'display: none !;'
                    +		'}'

                    +	'.video-details .thumbSort {'
                    +		'position: absolute;'
                    +		'width: 100%;'
                    +		'right: initial;'
                    +		'bottom: -2px;'
                    +		'text-align: center;'
                    +		'transform: initial;'
                    +		'}'
                    +	'.video-details {'
                    +		'position: relative;'
                    +		'padding-bottom: 40px;'
                    +		'}'

                    +	'.sortline {'
                    //                +		'width: 1338px;'
                    +		'}'
                    +	'.minititle {'
                    +		'background-color: #EAEAEA;'
                    +		'margin-bottom: 10px;'
                    +		'padding: 0 5px 0 10px;'
                    +		'height: 42px;'
                    +		'}'
                    +	'.minititle h2 {'
                    +		'line-height: 42px;'
                    +		'}'
                    +	'ul.navlinks {'
                    +		'margin: 0 0 0 46px;'
                    +		'}';

                pageWidth < 1800 && ( css += ''
                    +	'.thumblist .bx .bx_1line {'
                    +		'position: absolute;'
                    +		'width: calc( 100% - 17px );'
                    +		'}' );
                //CssHead.html().length < 10 &&
                CssHead.empty().append( css.formatString() );
            },
            fullCss     : function( input ){
                $('html').addClass('fullplayer');
                var css, CssHead = $('#fullCss'),
                    margin = 8,
                    inputSize = input || 3,
                    pageWidth = $(window).width() - ( ( margin * 2 ) + inputSize ),
                    pageHeight = $(window).height() - ( ( margin * 2 )  + 14 );
                css = ''
                    +	'.reloadButton, header, br, .menu-video, .video-details, .video_panel, .related-videos, '
                    +	'.clear, .related, #popup_content, .overheaderbanner, footer, #vz_im_ad {'
                    +		'display: none !important;'
                    +		'}'
                    +	'html {'
                    +		'overflow: hidden;'
                    +		'background-color: rgba(247, 54, 28, 0.85);'
                    +		'}'
                    +	'body {'
                    +		'padding-right: 2px;'
                    +		'height: 0px;'
                    +		'}'
                    +	'.conteiner>div {'
                    +		'margin: '+( 7 + margin )+'px auto !important;'
                    +		''
                    +		'}'
                    +	'.nwrap {'
                    +		'width: '+pageWidth+'px !important;'
                    +		'max-width: '+pageWidth+'px !important;'
                    +		'}'
                    +	'#video {'
                    +		'box-shadow: 0.4px 0px 10px 4px rgba(141, 0, 0, 0.87);'
                    +		'border-radius: 6px;'
                    +		'}'
                    +	'.video-details {'
                    +		'width: calc( '+pageWidth+'px - 18px );'
                    +		'}'
                    +	'.playerholder {'
                    +		'width: calc( '+pageWidth+'px - 9px ) !important;'
                    +		'height: calc( '+pageHeight+'px - 11px ) !important;'
                    +		'margin: 4px; padding-bottom: 0 !important'
                    +		'}';
                CssHead.empty().append( css.formatString() );
            },
            bxCss       : function( i ){
                var css, CssHead = $('#bxCss');
                css = ''
                    +	'.thumblist .bx {'
                    +		'min-height: '+( i + ( 13 + 13 + 21 + 29 ) )+'px;'
                    +		'}';
                CssHead.empty().append( css.formatString() );
            },
            tmCss       : function( ){
                var css, CssHead = $('#tmCss');
                css = ''
                    +	'#holderTM {'
                    +		'position: fixed;'
                    +		'top: 50%;'
                    +		'left: 50%;'
                    +		'width: 0px;'
                    +		'height: 0px;'
                    +		'z-index: 100000;'
                    +		'}'
                    +	'.wrapperTM {'
                    +		'position: absolute;'
                    +		'transform: translate( -50%, -50% );'
                    +		'background-color: rgba( 250, 244, 241, 0.91 );'
                    +		'border-radius: 20px;'
                    +		'border-width: 5px;'
                    +		'border-style: ridge;'
                    +		'border-color: rgb( 229, 78, 41 );'
                    +		'padding-bottom: 15px;'
                    +		'}'
                    +	'.contentTM {'
                    +		'padding: 20px;'
                    +		'box-sizing: border-box;'
                    +		'float: left;'
                    +		'overflow: auto;'
                    +		'min-height: 300px'
                    +		'}'

                    +	'a.monkeySettings.openCloseTM span {'
                    +		'cursor: pointer;'
                    +		'}'

                    +	'i#closeButton {'
                    +		'position: absolute;'
                    +		'z-index: 1000;'
                    +		'right: 4px;'
                    +		'top: 2px;'
                    +		'text-shadow: 0px 0px 3px rgb( 178, 37, 37 );'
                    +		'color: rgb( 244, 244, 244 );'
                    +		'}'
                    +	'i#closeButton:hover {'
                    +		'color: rgb( 145, 49, 26 );'
                    +		'text-shadow: 0px 0px 4px #91311A;'
                    +		'margin-left: -1px;'
                    +		'cursor: pointer;'
                    +		'}'
                    +	'i#menuButton {'
                    +		'position: absolute;'
                    +		'z-index: 1000;'
                    +		'left: 4px;'
                    +		'top: 2px;'
                    +		'text-shadow: 0px 0px 3px rgb( 178, 37, 37 );'
                    +		'color: rgb( 244, 244, 244 );'
                    +		'}'
                    +	'i#menuButton:hover {'
                    +		'color: rgb( 145, 49, 26 );'
                    +		'text-shadow: 0px 0px 4px #91311A;'
                    +		'margin-left: -1px;'
                    +		'cursor: pointer;'
                    +		'}'

                    +	'.contHeadTM {'
                    +		'text-align: center;'
                    +		'font-weight: bold;'
                    +		'font-variant: small-caps;'
                    +		'font-size: 46px;'
                    +		'}'
                    +	'.firstLine {'
                    +		'font-style: italic;'
                    +		'font-weight: bold;'
                    +		'font-size: 20px;'
                    +		'}'
                    +	'.normPresentation {'
                    +		'font-size: 18px;'
                    +		'line-height: 22px;'
                    +		'}'
                    +	'.normPresentation p {'
                    +		'text-indent: 32px;'
                    +		'margin-bottom: 10px;'
                    +		'}'

                    +	'.contBodyTM em {'
                    +		'color: rgb( 217, 78, 44 );'
                    +		'}'
                    +	'.contBodyTM .menuTM:not(.pageLi), .contBodyTM .external {'
                    +		'color: blue;'
                    +		'cursor: pointer;'
                    +		'}'
                    +	'.contBodyTM .click {'
                    +		'color: blue;'
                    +		'cursor: pointer;'
                    +		'}'

                    +	'#holderTM .foot {'
                    +		'position: absolute;'
                    +		'bottom: 0;'
                    +		'width: 100%;'
                    +		'padding: 0 6px;'
                    +		'box-sizing: border-box;'
                    +		'}'

                    +	'#holderTM span.checkbox {'
                    +		'float: left;'
                    +		'line-height: 34px;'
                    +		'margin-left: 2px;'
                    +		'width: 164px;'
                    +		'position: absolute;'
                    +		'bottom: 0px;'
                    +		'left: 5px;'
                    +		'z-index: 10;'
                    +		'}'
                    +	'#holderTM .foot .copyright {'
                    +		'float: right;'
                    +		'line-height: 34px;'
                    +		'margin-right: 5px;'
                    +		'}'

                    +	'#holderTM .menuOff .foot {'
                    +		'text-align: center;'
                    +		'}'
                    +	'#holderTM .menuOff .foot .copyright {'
                    +		'float: none;'
                    +		'margin-left: 12.5px;'
                    +		'}'


                    +	'.myMenu li, .myMenu li a {'
                    +		'line-height: 28px;'
                    +		'height: 28px;'
                    +		'width: 100%;'
                    +		'display: inline-block;'
                    +		'cursor: pointer;'
                    +		'}'

                    +	'ul.pagerUl.myMenu li:not(.nPageShow):not(.active) {'
                    +		'display:none;'
                    +		'}'
                    +	'ul.myMenu {'
                    +		'margin-left: -10px;'
                    +		'}'
                    +	'.myMenu li {'
                    +		'padding-left: 10px;'
                    +		'border-radius: 5px;'
                    +		'border-style: groove;'
                    +		'border-width: 2px;'
                    +		'margin-bottom: 5px;'
                    +		'background-color: rgb( 244, 244, 244 );'
                    +		'}'
                    +	'.myMenu li:hover:not(.active ) {'
                    +		'background-color: rgb( 145, 49, 26 );'
                    +		'box-shadow: 1px 1px 2px 0px #1D0601;'
                    +		'border-color: rgb( 229, 78, 41 );'
                    +		'border-style: outset;'
                    +		'border-width: 2px;'
                    +		'margin-left: -1px;'
                    +		'}'
                    +	'.myMenu li:active {'
                    +		'background-color: rgb( 117, 93, 12 );'
                    +		'}'
                    +	'.myMenu li:hover:not(.active ) a {'
                    +		'color: rgb( 233, 228, 224 );'
                    +		'text-shadow: 0px 0px 6px rgba( 255, 255, 255, 0.6 );'
                    +		'}'
                    +	'kk.myMenu li.pageHide:not(:nth-last-child(-n+2)):not(:nth-child(-n+3)):not(.active) {'
                    +		'display: none;'
                    +		'}'

                    +	'#myForm input, #myForm textarea {'
                    +		'float: right;'
                    +		'width: 200px;'
                    +		'}'
                    +	'#myForm textarea {'
                    +		'width: 198px;'
                    +		'height: 80px;'
                    +		'}'
                    +	'#myForm ul.myMenu {'
                    +		'width: 64px;'
                    +		'margin-left: 20px;'
                    +		'}'
                    +	'#myForm ul.myMenu li {'
                    +		'padding: 5px 12px 5px 20px;'
                    +		'}'

                    +	'#aboutTM #table {'
                    +		'display: table;'
                    +		'}'
                    +	'#aboutTM #table .row {'
                    +		'display: table-row;'
                    +		'}'
                    +	'#aboutTM #table .label, #aboutTM #table .details {'
                    +		'display: table-cell;'
                    +		'padding-bottom: 8px;'
                    +		'line-height: 20px;'
                    +		'}'
                    +	'#aboutTM #table .label {'
                    +		'width: 120px;'
                    +		'font-weight: bold;'
                    +		'}'

                    +	'#helpTM .row {'
                    +		'display: table-row;'
                    +		'}'
                    +	'#helpTM .label, #helpTM .details {'
                    +		'display: table-cell;'
                    +		'}'
                    +	'#helpTM .label {'
                    +		'padding-left: 33px;'
                    +		'width: 133px;'
                    +		'}'
                    +	'#helpTM .details {'
                    +		'padding-bottom: 8px;'
                    +		'line-height: 20px;'
                    +		'}'
                    +	'#helpTM h4 {'
                    +		'padding-bottom: 10px;'
                    +		'}'
                    +	'#helpTM .mouseNav {'
                    +		'padding-left: 33px;'
                    +		'padding-top: 10px;'
                    +		'}'

                    +	'#configTM .description {'
                    +		'margin: 10px 0 5px 10px;'
                    +		'}'
                    +	'#configTM .row {'
                    +		'display: table-row;'
                    +		'}'
                    +	'#configTM .label, #configTM .details {'
                    +		'display: table-cell;'
                    +		'}'
                    +	'#configTM .label {'
                    +		'padding-left: 25px;'
                    +		'width: 75px;'
                    +		'}'
                    +	'#configTM input[type="radio"] {'
                    +		'margin-right: 7px;'
                    +		'top: 1.5px;'
                    +		'cursor: pointer;'
                    +		'transform: scale(1.4);'
                    +		'transform-origin: center center;'
                    +		'position: relative;'
                    +		'}'

                    +	'#configTM #full .row {'
                    +		'padding: 10px 0;'
                    +		'display: table;'
                    +		'}'
                    +	'#configTM #full .row span {'
                    +		'margin-right: 10px;'
                    +		'}'

                    +	'#configTM #more .label {'
                    +		'width: 200px;'
                    +		'padding-right: 20px;'
                    +		'padding-bottom: 10px;'
                    +		'padding-top: 5px;'
                    +		'font-weight: 600;'
                    +		'}'
                    +	'#configTM #more .details {'
                    +		'vertical-align: middle;'
                    +		'}'

                    +	'#configTM form#columns {'
                    +		'margin: 16px 0;'
                    +		'}'
                    +	'#configTM form#columns h4 {'
                    +		'margin-bottom: 10px;'
                    +		'}'
                    +	'#configTM form#columns .details span {'
                    +		'margin-right: 15px;'
                    +		'}'
                    +	'#configTM ul#setColSize {'
                    +		'margin: auto;'
                    +		'width: 250px;'
                    +		'}'
                    +	'#configTM ul#setColSize li a.menuTM {'
                    +		'text-align: center;'
                    +		'color: black;'
                    +		'}'
                    +	'#configTM ul#setColSize li {'
                    +		'padding: 0;'
                    +		'}'
                    +	'#configTM ul#setColSize li:hover a.menuTM {'
                    +		'color: aliceblue;'
                    +		'}'
                    +	'#configTM #pageSize span, #configTM #columns span {'
                    +		'line-height: 24px;'
                    +		'}'

                    +	'#pagerTM {'
                    +		'text-align: center;'
                    +		'position: relative;'
                    +		'height: 40px;'
                    +		'line-height: 40px;'
                    +		'overflow: hidden;'
                    +		'}'

                    +	'#pagerTM ul.pagerUl {'
            //        +		'position: absolute;'
            //        +		'left: 66%;'
            //        +		'transform: translateX( -50% );'
            //        +		'width: 100%;'

                    +		'display: inline-block;'
                    +		'margin: 0;'

                    +		'}'
                    +	'#pagerTM ul.pagerUl li {'
                    +		'float: left;'
                    +		'padding: 0px 10px;'
                    +		'width: initial;'
                    +		'margin: 0 5px;'
                    +		'}'

                    +	'#videoTM {'
                    +		'width: 100% !important;'
                    +		'margin-bottom: -20px;'
                    +		'margin-top: -25px;'
                    +		'}'
                    +	'#videoTM p.firstLine {'
                    +		'margin-bottom: 5px;'
                    +		'text-align: center;'
                    +		'}'
                    +	'#videoTM .firstLine a.menuTM {'
                    +		'font-size: 13px;'
                    +		'font-weight: 400;'
                    +		'line-height: 22px;'
                    +		'position: relative;'
                    +		'top: -2px;'
                    +		'margin-left: 10px;'
                    +		'display: inline-block;'
                    +		'color: blue;'
                    +		'}'

                    +	'#updatedTM span.table {'
                    +		'display: table;'
                    +		'}'
                    +	'#updatedTM .group {'
                    +		'display: table-row-group;'
                    +		'}'
                    +	'#updatedTM .block {'
                    +		'display: table-row;'
                    +		'}'
                    +	'#updatedTM .cell {'
                    +		'display: table-cell;'
                    +		'}'
                    +	'#updatedTM .cell.c1 {'
                    +		'width: 40px;'
                    +		'}'
                    +	'#updatedTM .cell.c2 {'
                    +		'width: 90px;'
                    +		'}'
                    +	'#updatedTM .block .c12 {'
                    +		'padding-bottom: 15px;'
                    +		'}'

                    +	'#updatedTM .group:nth-child( 2n+1 ) {'
                    +		'background-color: rgb( 244, 244, 244 );'
                    +		'}'
                    +	'#updatedTM .group:nth-child( 2n+2 ) {'
                    +		'background-color: rgba( 243, 222, 217, 0.36 );'
                    +		'}'
                    +	'#updatedTM .block.top .cell {'
                    +		'border-top-width: 1px;'
                    +		'padding: 5px 8px 0px;'
                    +		'font-weight: 600;'
                    +		'}'
                    +	'#updatedTM .block.botton .cell {'
                    +		'vertical-align: middle;'
                    +		'padding: 8px 8px;'
                    +		'}'
                    +	'#updatedTM .block .cell.c1, #updatedTM .block .cell.c10 {'
                    +		'border-left-width: 1px;'
                    +		'}'
                    +	'#updatedTM .block .cell.c3, #updatedTM .block .cell.c12 {'
                    +		'border-right-width: 1px;'
                    +		'}'
                    +	'#updatedTM .contBodyTM {'
                    +		'border-bottom: 1px;'
                    +		'border-style: outset;'
                    +		'}'
                    +	'#updatedTM *:not(li) {'
                    +		'border-color: rgb( 157, 138, 125 );'
                    +		'border-style: double;'
                    +		'}'
                    +	'#updatedTM #pagerTM {'
                    +		'margin-top: 10px;'
                    +		'}'

                    +	'.wrapperTM li.active {'
                    +		'border-color: #91311A;'
                    +		'background-color: #F1E5E1;'
                    +		'border-width: 1px;'
                    +		'margin: 1px 6px 7px 1px !important;'
                    +		'line-height: 27px;'
                    +		'height: 27px;'
                    +		'}'
                    +	'.wrapperTM li.active a {'
                    +		'margin-top: -1px;'
                    +		'}'
                    +	'.wrapperTM #pagerTM ul.pagerUl li {'
                    +		'margin-left: 5px !important;'
                    +		'}';

                CssHead.empty().append( css.formatString() );
            }
        },
        fn          = {
            isNumeric   : function( value ) {
                return /^\d+$/.test( value );
            },
            obj2Str     : function( obj ){
                var objArr = $.makeArray(obj);
                return objArr[0].outerHTML;
            },
            imgHeightSub: function( id ){
                var imgHeight = config.imgHeight || 0, thisImg = $( id ).height();
                imgHeight = thisImg > imgHeight ? thisImg : imgHeight;
                imgHeight > 66 && imgHeight > config.imgHeight && (
                    css.bxCss( imgHeight + 1 ),
                        config.imgHeight = imgHeight );
            },
            imgHeight   : function( ){
                $('.thumblist').find('.bx').each(function(){
                    var $this = $( this ), id = '#' + $this.find('.tplace').attr('id');
                    fn.imgHeightSub( id );
                });
            },
            minMaxCurrent : function(  ){
                var minElem = $('li.min.current'),
                    min =  parseInt( minElem.data('minute') ),
                    maxElem = $('li.max.current'),
                    max =  parseInt( maxElem.data('minute') );
                $('.minMaxWrapper').removeClass('current');
                ( min !== 0 || min > max ) && minElem.parents('.minMaxWrapper').addClass('current');
                ( max !== 36000 || max < min ) && maxElem.parents('.minMaxWrapper').addClass('current');
            },
            minMax      : function( min, max ){
                min = min === undefined ? GM_getValue( 'videoMin' ) : min;
                max = max === undefined ? GM_getValue( 'videoMax' ) : max;

                $('.thumblist').find('.bx').each(function( i, e ){
                    var $this = $( e ),
                        len = parseInt( $this.attr('data-length') );
                    $this[ ( len >= min && len <= max ) ? 'addClass' : 'removeClass' ]( 'showThumb' );
                });
            },
            videoAttributes : function( ){
                //        if( $('.bx.hd, .bx.sd').length === $('.bx').length ) return false;
                $('.thumblist').find('.bx').each(function( i, e ){
                    i++;
                    var $this = $( e ),
                        unsorted = $this.data('unsorted'),
                        id = '#' + $this.find('.tplace').attr('id');
                    $this.removeClass('lastrow')
                        .attr('data-unsorted',  unsorted !== undefined ? unsorted : i.toString().lpad('0',2) )
                        .attr('data-length',    fn.videoLen( $this.find('.time').text() ).toString().lpad('0',6 ) )
                        .attr('data-date',      fn.videoDate( $this.find('.vtime').text() ).toString().lpad('0',8 ) )
                        .attr('data-views',     fn.videoViews( $this.find('.ileft').text() ).toString().lpad('0',8 ) )
                        .attr('data-rating',    fn.videoRating( $this.find('.iright.upperc').text() ).toString().lpad('0',3 ) )
                        .addClass( $this.find('.time img').length ? 'hd' : 'sd' )
                        .find('.time').appendTo( $this.find('.thumb') );
                    $( id ).load(function() {
                        fn.imgHeightSub( id ); });
                });
            },
            videoRating : function( val ){ // 88%
                return val.split('%').shift();
            },
            videoViews  : function( val ){ // 12,889 views
                return val.split(' ').shift().split(',').join('');
            },
            videoDate   : function( val ){  // 24mo ago,  11days ago,  4h ago,  49min ago
                var arr    = ['mo','day','h','min'],
                    multi  = [ 60*24*30, 60*24, 60, 1 ],
                    newVal = 0, type = 0;
                $.each( arr, function( i, e ){
                    newVal = val.search( e ) !== -1 ? val.split( e ) : '';
                    newVal.length > 0 && ( newVal = parseInt( newVal[0] ), type = i );
                    if( newVal > 0 ) return false;
                });
                return newVal * multi[ type ] + '';
            },
            videoLen    : function( val ){  // 1:24:16
                var sec = 0;
                $.each( val.replace(/\s+/g, '').split(':').reverse(), function( i, e ){
                    e = parseInt( e );
                    sec += i === 0 ? e : i === 2 ? 60 * 60 * e : 60 * e;
                });
                return sec;
            },
            thumbCounter: function( ){
                $('#Count').html( 'Count: ' + $('.thumblist .bx:visible').length + ' / ' +  $('.thumblist .bx').length );
            },
            esc         : function( ){
                $('#fullCss').empty();
                $('html').removeClass('fullplayer');
            },
            active      : function( command ){
                $( '#menuTM').find('.active' ).removeClass('active').end()
                    .find('a[data-command=' + command + ']' ).parent().addClass('active');
            },
            sortMenu    : function( ){
                var arr = ['newest','longest','views','rating','favorites','comments','votes'],
                    locDoc = config.locDoc, thisSort = '';

                $.each(arr,function(key,value){
                    locDoc.search( value ) > 0 && ( thisSort = value );
                });

                thisSort = thisSort.length < 2 ? 'newest' : thisSort;

                $('.account-menu').find('a').each(function(i,el){
                    var elem = $( el );
                    elem.attr('href', elem.attr('href') + thisSort );
                });

                GM_xmlhttpRequest({
                    method: "GET",
                    url: "http://www.vporn.com/",
                    crossDomain: false,
                    onload: function( res ) {
                        res = $( res.responseText ).find('.grayarea.wline');
                        $( res )
                            .find('ul>li').removeClass('current').wrap('<a href="http://www.vporn.com/newest"></a>').end()
                            .find('.sorts').attr('style','width: 100%;').end()
                            .find('.maincat').remove().end()
                            .find('.timefilter').remove().end()
                            .find('a').each(function(i,el){
                                var elem = $( el ), elemType = elem.attr('href').split('/').pop();
                                elem.attr('href', locDoc.search( thisSort ) > 0 ? locDoc.replace( thisSort, elemType ) : locDoc + '/' + thisSort );
                                thisSort === elemType && elem.find('li').addClass('current').unwrap();
                            });
                        $('.grayarea.wline').replaceWith( res );
                    }
                });
            },
            sortButtons : function( $e ){
                var sortFN = $e.data('fn'),
                    sortOrderElem = $('#sortOrder'),
                    sortOrder = sortOrderElem.attr('sortorder'),
                    tsortElem = $( '.thumblist .bx' ),
                    thisSort = $e.data('sort'),
                    activeElem = $('.thumbSort li[data-chk="1"].current'),
                    activeFN = activeElem.data('fn'),
                    activeSort = activeElem.data('sort');

                sortFN === 'sortOrder'
                    ? (
                        sortOrder = sortOrder != 'true',
        //                sortOrder = GM_getValue( 'sortOrder' ) || false,

                        sortOrderElem[ sortOrder ? 'addClass' : 'removeClass' ]('current'),
                        sortOrderElem.attr('sortOrder', sortOrder),
                        tsortElem.tsort({attr:'data-' + activeFN, order: ( sortOrder ? ( activeSort === 'asc' ? 'dec' : 'asc' ) : activeSort ) }),
                        GM_setValue('sortOrder', sortOrder )
                    ):
                    sortFN === 'HD'
                        ? (
                        toggleClassState( config, 'HD', 'Toggle' ),
                            GM_setValue('HD', $('html').hasClass('HD') ),
                            $e.toggleClass('current','off')
                            )
                        : $e.data('chk') === 1
                            && (
                                $('.thumbSort li[data-chk="1"]').removeClass('current'),
                                $e.addClass('current'),
                                tsortElem.tsort({attr:'data-' + sortFN, order: ( sortOrder ? ( thisSort === 'asc' ? 'dec' : 'asc' ) : thisSort ) }),
                                GM_setValue('sortState', sortFN )
                            );

                fn.thumbCounter();
            },
            initSort    : function( ){
                //noinspection JSJQueryEfficiency
                GM_getValue( 'sortOrder' ) && $('#sortOrder').addClass('current');
                //noinspection JSJQueryEfficiency
                $('#sortOrder').attr('sortOrder', GM_getValue( 'sortOrder' ) ? false : true );

                $('.sortscontain')
                    .find('li.min[data-minute='+ GM_getValue( 'videoMin' )+ ']').addClass('current').end()
                    .find('li.max[data-minute='+ GM_getValue( 'videoMax' )+ ']').addClass('current');
                fn.minMaxCurrent();

                GM_getValue('HD') === true && fn.sortButtons( $('li#HD') ) ;
                fn.sortButtons( $('.thumbSort li[data-fn='+ GM_getValue('sortState') +']') );
                fn.sortButtons( $('.thumbSort li[data-fn=sortOrder]') );
            },
            chkPager    : function( ){
                var elem = $('.pagerwrap');
                elem.parents().is('.related') && elem.hide();
            },
            timeDate    : function( d, /* Date instance */ fo /* Format string */ ){
                var f = fo || ' ';
                return f.replace( // Replace all tokens
                    /{(.+?)(?::(.*?))?}/g, // {<part>:<padding>}
                    function (
                        v, // Matched string (ignored, used as local var)
                        c, // Date component name
                        p // Padding amount
                        ) {
                        //noinspection StatementWithEmptyBodyJS
                        for(v = d["get" + c]() // Execute date component getter
                            + /h/.test(c) // Increment Mont(h) components by 1
                            + ""; // Cast to String
                            v.length < p; // While padding needed,
                            v = 0 + v); // pad with zeros
                        return v; // Return padded result
                    });
            },
            submitForm  : function( ){
                var name       = $('#cname').val(),
                    email      = $('#cemail').val(),
                    subject    = $('#csubject').val(),
                    text       = $('#ccomment').val(),
                    dateParam  = function(){
                        return "{FullYear}-{Month:2}-{Date:2} {Hours:2}:{Minutes:2}:{Seconds:2}";
                    },
                    date       = function(){
                        return new Date();
                    };
                $.ajax({
                    type: 'POST',
                    url: 'https://mandrillapp.com/api/1.0/messages/send.json',
                    data: {
                        'key': 'Hk5nxsMx5Ov4zVL7GHJkSQ',
                        'message': {
                            'from_name' : name,
                            'from_email': email,
                            'to': [{ 'email': 'magnus.fohlstrom@gmail.com' }],
                            'auto_text': true,
                            'subject': 'myUserScript: VPorn.com' + subject,
                            'text': text + '\r\r\t TimeStamp: ' + date //fn.timeDate(date,dateParam)
                        }
                    }
                }).done(function(response) {
                        console.log(response); // if you're into that sorta thing
                    });
            },
            setColSize  : function( page ){
                var configTM = $( '#configTM' );
                if( $('.switchAble').data('page') == 1 ) {
                    GM_setValue('pageWidth', configTM.find('#pageSize input.size:checked').val()),
                        GM_setValue('thumbCol', configTM.find('#columns input.col:checked').val());
                } else {
                    $.each( sharedData.settings2(), function(i,e) {
                        c.i('nr: ' + i +', ' + e.name + ', ' + e.title + '.');
                        GM_setValue( e.name, configTM.find( '#more input.' + e.name ).val() );
                    });
                }
                configTM.find('#setColSize .menuTM').text('Settings are now Saved');
            },
            fullPlayer 	: function( type ){
//                $( '#fullPlayer' ).length || css.style('fullPlayer');
                config.pageWidth === 'orgWidth' || toggleClassState( config, 'fullPlayer', type );
                $('.pager').length || config.pageWidth === 'orgWidth' || GM_setValue('fullPlayer', config.fullPlayer );
            },
            loadHref	: function( dir ){
                var pager = $('.pager').find( 'a.' + dir ).attr('href');
                pager !== undefined && $( location ).attr('href', pager );
            },
            runCommand  : function( elem ){
                c.i('menuTM', elem );
                var $this = elem, command = $this.data('command'), page = $this.data('page'), back = $this.data('back'),
                    vHeight = $this.data('height'), vWidth = $this.data('width'), vSrc = $this.data('src'), firstLine = $this.find('span').text();
                c.i('command',command);
                c.i('page',page);
                config.commandos = command;
                switch( command ){
                    case 'about'      : html.aboutTM();                                                 break;
                    case 'firstIntro' : html.welcomeTM();                                               break;
                    case 'config'     : html.configTM( page );                                          break;
                    case 'help'       : html.helpTM( page , 400);                                       break;
                    //    case 'similar'    : html.otherScript();                                               break;
                    case 'update'     : html.updatedTM.render( page );                                  break;
                    case 'latest'     : html.latestTM();                                              break;
                    case 'video'      : html.videoTM( vHeight, vWidth, vSrc, firstLine, back, page );   break;
                    case 'menu'       : html.sideTM();                                                  break;
                    case 'donate'     : html.donateTM();                                                break;
                    case 'submit'     : fn.submitForm();                                                break;
                    case 'setColSize' : fn.setColSize();                                                break;
                    case 'contact'    : html.contactTM();                                               break;
                    default           :                                                                 break;
                }
                command !== 'setColSize' && fn.active( command === 'latest' ? 'update' : command );
            }
        },
        listeners   = {
            resize      : function( ){
                $(window).resize(function(){
                   $('html').hasClass('fullplayer')
                       ? css.fullCss(18)
                       : (
                           config.startWidth(),
                           css.basicCss(),
                           config.imgHeight = 0,
                           fn.imgHeight()
                       );
                });
            },
            navKey      : function( ){
                document.addEventListener('keydown', function(e){
                    if( $('input').is(':focus') ) return false;

                    var key = e.keyCode;
                    ( key == 37 || key == 39 ) && ( fn.loadHref( key == 37 ? config.prevDoc : config.nextDoc ));
                    key == 66 && css.fullCss();
                    key == 27 && fn.esc();
                }, false);
            },
            navThumb    : function( e ){
                c.i('navThumb');
                var ContentElem     =   $( e ),
                    ContentLeft     =   parseInt( ContentElem.offset().left ),
                    ContentRight    =   ContentLeft + ContentElem.width();
                $(document).on('mouseup','body, #content',function(e){
                    var X_spot      =   e.clientX;
                    this == e.target && e.which == 1 && (
                        ( X_spot < ContentLeft || X_spot > ContentRight ) && (
                            fn.loadHref( config[ X_spot < ContentLeft ? 'prevDoc' : 'nextDoc' ] ) ) ); });
                listeners.navKey();
            },
            navVideo    : function( ){
                $(document).on('mouseup','#content, html.fullplayer',function(e){
                    this == e.target && e.which == 1 && g.ms === 0 && (
                        g.timer(64), $('html').hasClass('fullplayer') ? fn.esc() : css.fullCss() );
                });
                listeners.navKey();
                listeners.resize();
                html.reloadButton();
                listeners.reloadButton();
            },
            reloadButton: function( ){
                $( document ).on('mousedown', '.reloadButton img', function(e){
                    this == e.target && e.which == 1 && $( location ).attr( 'href', config.locDoc );
                });
            },
            sortButtons : function( ){
                $( document ).on('click', '.thumbSort li', function(e){
                    this == e.target && e.which == 1 && (
                        fn.sortButtons( $( this ) ),
                        fn.thumbCounter()
                    );
                });
            },
            minMax      : function( ){
                $( document ).on('mousedown', '.minMaxWrapper li', function(e){
                    var min,max;
                    $( this ).hasClass('min') && ( min = $( this ).data('minute') );
                    $( this ).hasClass('max') && ( max = $( this ).data('minute') );
                    this == e.target && e.which == 1 && (
                        $( this ).addClass('current').siblings().removeClass('current'),
                            min !== undefined && GM_setValue('videoMin', min ),
                            max !== undefined && GM_setValue('videoMax', max ),
                            fn.minMax( min,max ),
                            fn.minMaxCurrent(),
                            fn.thumbCounter()
                    );
                });
            },
            menuButtonTM: function( ){
                $( document ).on('mouseup','#menuButton',function(evt){
                    var elem = $('#menuTM'), width = $('.switchAble').width();
                    evt.which === 1 && evt.target === this && (
                        config.menuState = config.menuState ? false : true,
                        $('.wrapperTM')[ !config.menuState ? 'addClass' : 'removeClass' ]('menuOff'),
                        elem.length == 1 ? elem.toggle(0) : html.sideTM(),
                        html.wrapWidth( width + 40 )
                    );
                });
            },
            openCloseTM : function( ){
                $( document ).on('mousedown','.openCloseTM',function(evt){
                    var elem = $('#holderTM');
                    evt.which === 1 && evt.target === this && (
                        evt.ctrlKey
                            ? (
                                GM.manager('del'),
                                alert('GM Settings are deleted')
                                )
                            : elem.length == 1 ? elem.toggle(256) : render.tm()
                    );
                });
            },
            menuTM      : function( ){

                $( document ).on('mouseup','li',function(e){
                    e.which === 1 && e.target === this && fn.runCommand( $(this).find('.menuTM') );
                });
                $( document ).on('mouseup','.menuTM',function(e){
                    e.which === 1 && e.target === this && fn.runCommand( $(this) );
                    c.i('menuTM');
                    e.preventDefault();
                });
                $( document ).on('mouseup','#holderTM .contentTM ul.myMenu + span input',function(){
                    GM_setValue('menuState', $( this ).is(':checked') ? false : true );
                });
            },
            setColSize  : function( ){
                var reloadCss = function(){
                    html.configTM( $('.switchAble').data('page')  );
                    c.i('Save Settings');
                    $( '#setColSize' ).find('.menuTM').text('Save Settings');

                    config.startWidth();
                    css.basicCss();

                    setTimeout(function(){
                        config.imgHeight = 0;
                        fn.imgHeight();
                    },1000);

                    c.i('setColSize');
                    $('.video-details')[ config.pageWidthNR < 1400 ? 'addClass' : 'removeClass']('small');
                };
                $(document).on('click','#configTM #pageSize input.size', function(){
                    c.i('setSize input.size');
                    var val = $( this ).val();
                    config.pageWidth = val;
                    config.pageWidthNR = config[val];
                    reloadCss(); });

                $(document).on('click','#configTM #columns input.col', function(){
                    c.i('setCol input.col');
                    config.thumbCol = $( this ).val();
                    reloadCss(); });
            }
        },
        html        = {
            createDialog  : function( id, content, width, state ){
                var elem = '', inWidth = width, valWidth;
                $.each( sharedData.dialogs(), function(i,val){
                    if( val.id == id ){
                        c.i('createDialog id', val.id );
                        valWidth = val.width;
                        width = inWidth || valWidth == 'default' ? sharedData.dialogWidth : valWidth;
                        elem = html.contentTM( id, 'switchAble', width )
                            .prepend( html.contHeadTM( val.head ) )
                            .append( html.contBodyTM( $('<span/>',{ html: html.wrapTag( val.firstLine, 'p', 'firstLine' ) }).append( content ).html() ) );
                        return false;
                    }
                });
                html.wrapWidth( width );
                html.switcher( elem, state );
                c.i('createDialog Elements', elem.find('*').length ); c.i('createDialog html', fn.obj2Str( elem ) ); c.i('createDialog length', fn.obj2Str( elem ).length );
            },
            wrapWidth   : function ( width ){
                var menuWidth = config.menuState ? 175 : 0;
                $('.wrapperTM').width(menuWidth + width);
            },

            switcher    : function ( elem, state ){
                state === false && ( config.menuState = false, $('#menuTM').hide() );
                var switchAble = $('.switchAble');
                switchAble.length == 1
                    ? switchAble.replaceWith( elem )
                    : elem.prependTo('.wrapperTM');
            },
            wrapTag     : function ( text, tag, style ){
                style = style || '';
                return $('<' + tag + '/>', {class: style, html: text});
            },

            li_Item     : function ( txt, cl, data, page ){
                return $('<li>').append(cl == 'external' ? a(txt, data) : l(txt, cl, data, page));
            },
            singleRow   : function ( label, text ){
                var outer = $('<div/>', {class: 'row'});
                return outer
                    .append($('<span/>', {class: 'label', text: label + ':'}))
                    .append($('<span/>', {class: 'details', html: text}));
            },
            pager       : function ( pageType, page, pageEnd, text ){
                var elem    = $('<div/>', { id: 'pagerTM' }),
                    ul      = $('<ul/>', { class: 'pagerUl myMenu' }),
                    txt     = text || 'page: ',
                    back = txt,
                    BA      = 2,
                    that    = this,
                    li      = function ( i, first, last, next, prev ) {
                       // txt = parseInt(txt).length ? parseInt(txt) : txt;
                        txt = txt !== back ? txt.removeEnds( back.length ).replace('Firs','').replace('Nex','').replace('Pre','') : txt;
                        //txt = txt.inElem('Firs') ? txt : txt;
                        txt = config.commandos === 'latest' ? 'Archive' :
                            ( first || last || next || prev )
                                ? first ? 'First' : last ? 'Last' : next ? 'Next' : prev && 'Prev'
                                : txt + i;

                        return that .li_Item( txt, 'menuTM pageLi', pageType, i )
                                    .addClass( i === page ? 'active' : '' )
                                   // .addClass( i === page ? 'active' : i < page ? 'newer' : i > page && 'older' )
                                   // .addClass( 'page' + ( i < ( page - BA ) || i > ( page + BA ) ? 'Hide':'Show' ) )
                        ;
                    };

                var i = 1, first, last, next, prev;
                for ( i; i < pageEnd + 1; i++) {
                    first = i === 1, last = i === ( pageEnd ), next = i === page + 1, prev = i === page - 1;
                    config.commandos !== 'latest'
                        ? ul.append( li( i, first, last, next, prev ) )
                        : config.commandos === 'latest' && first && ul.append( li( i, first, last ) );

                }

                pageType === 'update' && ul.prepend( this.li_Item( 'Latest', 'menuTM pageLi', 'latest', 0 ) );

                ul.find('a[data-text="Latest"], a[data-text="First"], a[data-text="Prev"], a[data-text="Next"], a[data-text="Last"], a[data-text="Archive"], a[data-command="help"]').parent().addClass('nPageShow');

                return elem.append( ul );
            },
            embeded     : function ( height, width, src ){
                return $('<iframe/>', {height: height, width: width, src: src, frameborder: 0, wmode:'transparent', allowfullscreen: true});
            },
            closeButton : function ( ){
                return $('<i/>', {id: 'closeButton', class: 'fa fa-times-circle fa-2x openCloseTM'});
            },
            menuButton  : function ( ){
                return $('<i/>', {id: 'menuButton', class: 'fa fa-bars fa-2x'});
            },
            copyright   : function ( ){
                var span = function (cl) {
                        return $('<span/>', {class: cl});
                    },
                    copy = $('<i/>', {class: 'fa fa-copyright'}),
                    span1 = span('copyright').text( ' ' + sharedData.copyrightYear + sharedData.myName ).prepend(copy);
                $('<div/>', {class: 'foot'}).append(span1).appendTo('.wrapperTM');
            },
            reloadButton   : function ( ){
                var span = function () { return $('<div/>', {class: 'reloadButton'}); },
                    alink = function () { return $('<a/>', {href: 'javascript:;'}) },
                    img = function () { return $('<span/>', {src: ''}) };

                span().append( alink().append( img() ) ).prependTo('#video'); //.menu-video-right
            },

            thumbSort   : function( ){
                if( $('.thumbSort').length ) return false;
                var inserts = $('object#as3_js, #video_player video').length ? '.video-details' : '.minititle h1',
                    wrap    = $('<div/>', { class : 'thumbSort' }),
                    ul      = $('<ul/>', { class : 'sortscontain' }),
                    list    = function( text ){
                        var ul = $('<ul/>',{ class:'minMax' });
                        $.each( sharedData.minMax() , function( i, val ) {
                            ul.append( $('<li/>',{ class: text, text: val.min + 'min', 'data-minute': val.min * 60 }) ); });
                        return ul;
                    },
                    button  = function( text, sort, check ){
                        return $('<a/>',{ href: 'javascript:;' }).append(
                            ( text === 'min' || text === 'max' )
                                ? $('<li/>',{ class:'minMaxWrapper', html: list( text ) }).prepend( ( text === 'min' ? '<':'>' ) )
                                : $('<li/>',{ id: text, text: text.toUpperCase(), 'data-sort': sort, 'data-fn': text, 'data-chk': check } ) )
                    },
                    H1    = $('.minititle').find(' > h1').html();

                $.each( sharedData.thumbSort(), function(i,val){
                    ul.append( button( val.name, val.sort, val.chk )); });

                ul.find('#sortOrder').text('REVERCEORDER');

                $('.minititle > h1').empty().prepend( $('<span/>').append( H1 ) );

                wrap.append( ul )[ inserts === '.video-details' ? 'appendTo' : 'prependTo' ]( inserts );
                config.sorting = true;

            },
            StartTM     : {
                button      : $( '<i/>', { class: 'btn btn-default btn-sm openCloseTM', href: '#', text: 'TM' } ),
                menu        : function ( ){
                    return $( '<a/>', { class: 'monkeySettings openCloseTM' } )
                        .append( $( '<li/>', { html: $( '<span/>',{ text:'MonkeyScript Setting' } ) } )
                            .prepend( $( '<img>', {
                                src   : "http://www.vporn.com/images/new_images/my-settings.png",
                                width : "16", height: "16", alt: " "
                            } ) ) )
                        .append( $( '<hr>' ) );
                },
                render      : function ( ){
                    //noinspection JSCheckFunctionSignatures
                    config.inMenu
                        ? (
                            $(this.menu()).insertBefore('#open-small-log .pcl'),
                            refreshElement('.monkeySettings.openCloseTM',1000)
                        )
                        : $(this.button ).insertBefore('.authsection');
                }
            },
            holderTM    : function( ){
                $( '<span/>', { id: 'holderTM' }).appendTo('body');
            },
            wrapperTM   : function( ){
                $( '<div/>', { class: 'wrapperTM' })
                    .prepend( this.menuButton() )
                    .append( this.closeButton() )
                    .appendTo('#holderTM');
            },

            contHeadTM  : function( text ){
                return $( '<div/>', { class: 'contHeadTM', text: text });
            },
            contBodyTM  : function( html ){
                return $( '<div/>', { class: 'contBodyTM', html: html });
            },
            contentTM   : function( id, cl, width ){
                return $( '<div/>', { id:id, class: 'contentTM ' + cl, style:'width:' + width + 'px' });
            },
            sideTM      : function( ){
                var elem = html.contentTM(),
                    firstLine       = 'Menu',
                    render          = function(){
                        return  p(firstLine,'firstLine');
                    },
                    chk = $('<input/>', {type: 'checkbox'}).prop("checked", config.menuState ),
                    span1 = this.wrapTag( 'Always show menu', 'span', 'checkbox' ).prepend( chk );

                elem.attr('id','menuTM')
                    .css({'width':'175px'})
                    .append( this.contBodyTM( render() ))
                    .append( this.menuTM() )
                    .append( span1 );

                config.menuState ? elem.css('display','block') : elem.css('display','none');
                elem.prependTo('.wrapperTM');
                $('.wrapperTM')[ !config.menuState ? 'addClass' : 'removeClass' ]('menuOff');
                fn.active( 'firstIntro' );
                listeners.menuTM();
            },
            menuTM      : function( ){
                var elul = $( '<ul>', { class: 'myMenu' }),
                    sorted = sharedData.dialogs().sort(function(a, b){
                        return a.order - b.order; });
                $.each( sorted, function(i,val){
                    val.on == 1 && elul.append( html.li_Item( val.name, val.type, val.command, val.page ) );
                });
                return elul;
            },
            updatedTM   : {
                cell    : function( cl, html ){
                    return $('<span/>',{ class:'cell ' + cl, html: html } );
                },
                row1    : function( val ){
                    return $( '<div/>',{ class:'block top' } )
                        .append( this.cell( 'c1', val.ver ), this.cell( 'c2', val.date ), this.cell( 'c3', val.type + '-' + val.magnitude ) );
                },
                row2    : function( val ){
                    return $( '<div/>',{ class:'block botton' } )
                        .append( this.cell( 'c10', val.visible ), this.cell( 'c11', val.name ), this.cell( 'c12', val.desc + '.') );
                },
                fillArr : function( mode ){
                    var table  = $( '<span/>',{ class:'table'} ),
                        latest = sharedData.latestVersion,
                        page   = sharedData.updatesFirstPage,
                        append = function ( val ){
                            table.append(
                                $( '<div/>',{ class:'group', 'data-page': page } )
                                    .addClass( val.ver == latest ? 'latest':'old' )
                                    .append( that.row1( val ), that.row2( val ) ) )
                        },
                        lc     = 0,
                        that   = this;

                    $.each( sharedData.update(), function( i, val ){
                        latest == val.ver && lc++;
                        val.on == 1 && (
                            checkDividedIsInteger( i - lc, sharedData.updatesPerPage ) && page++,
                            mode == 'latest'
                                ? latest == val.ver && append( val )
                                : mode == page && append( val )
                        );
                    });

                    table.append( $( '<div/>',{ class:'group', html: html.pager( 'update', mode, page, ' ' ) }) );

                    return table;
                },
                render  : function( mode ){
                    html.createDialog( 'updatedTM', this.fillArr( mode ) );
                    $('#pagerTM').appendTo('#updatedTM');
                }
            },
            latestTM      : function () {
                html.updatedTM.render('latest');
                $('div#updatedTM .contHeadTM').text('Latest Update v' + sharedData.latestVersion);
                $('a.menuTM.pageLi[data-command = "latest"]').parent().addClass('active');
                fn.active('update');
            },
            aboutTM     : function( ){
                var table = $('<div/>',{ id: 'table', class:'test' });
                $.each( sharedData.about(), function( i, val ){
                    val.on == 1 && table.append( html.singleRow( val.name, val.desc ) );
                }),
                    html.createDialog( 'aboutTM', table );
            },
            welcomeTM   : function( ){
                var presentation    = 'Now you are part of something bigger. A New way to use this great site VPorn.com.\
                        \rThis is my first in line of series of scripts that will work with unique library of my functions. And this \
                        script will also inform you about whats '+cl('new','black')+' if there was an update. Also tells the news about other scripts that you \
                        may also be interested in.\rBefore you '+ em('start') +' using this script read the ' + l('instructions','menuTM','help',1) +' and listen ' +
                    'to my '+( v("video. ","1080","802","https://www.youtube-nocookie.com/embed/9chDANQxF2M?rel=0&amp;theme=light&amp;autohide=1","My First Test Embeded",'firstIntro',1 ) ) +
                    ' about this script.\rAlso Take a look at the '+ l('settings','menuTM','config',1) + ' that this user-script has.';

                html.createDialog( 'welcomeTM', p( presentation.toString(), 'normPresentation') );

            },
            configTM    : function( page ){
                var form            = function( ){
                        var objForm = function( name ){
                                return $('<form/>',{ id:name, name:name })
                            },
                            rad = function( value, no_Info ){
                                var Info    = value.length < 2 ? value : no_Info === undefined ? config[ value ] + ( value === 'fullWidth' ? ' %':' pixels.' ) : value,
                                    name    = value.length < 2 ? 'col'+ ' col' + value : 'size'+ ' ' + value,
                                    wrap    = $('<span/>',{ text: Info }),
                                    input   = $('<input/>',{ type:'radio', name:name, class:name, value:value });
                                return wrap.prepend( input );
                            },
                            chbox = function( val ){
                                var name    = 'cMore'+ ' ' + val.name,
                                    wrap    = $('<span/>',{ text: ' ' }),
                                    input   = $('<input/>',{ type:'checkbox', name:name, class:name, value:val.name });
                                return wrap.prepend( input );
                            },
                            pageTmp = $('<span/>'),
                            button  = $( '<ul>', { class: 'myMenu' });

                        switch( page ){
                            case 1:
                                var size = objForm('pageSize'), col = objForm('columns'), full = objForm('full');
                                size.append( html.wrapTag('These fixed sizes can you choice', 'div', 'description') )
                                    .append( html.singleRow('Orginal', rad('orgWidth')) )
                                    .append( html.singleRow('Normal', rad('normWidth')) )
                                    .append( html.singleRow('Wide', rad('wideWidth')) )
                                    .append( html.singleRow('Extreme', rad('extraWidth')) )
                                //    .append( p(' ') )
                                    .append( html.wrapTag('Dynamically changes when browser <br>width size changes', 'div', 'description'))
                                    .append( html.singleRow('Dynamic', rad('fullWidth'))  )
                                ;
                                //.append( html.wrapTag('Dynamically changes when browser width size changes', 'div', 'description'))
                                //.append( html.singleRow('Full', rad('fullWidth', 1)) )
                                //.append( html.singleRow('80%', rad('d80Width', 1)) );

                                col.append( html.wrapTag('Number of columns video thumb nails are shown.', 'h4') )
                                    .append(
                                        html.singleRow('Columns',
                                            $('<span/>').append(rad('1')).append(rad('2')).append(rad('3')).append(rad('4')).append($('<br>'))
                                                .append(rad('5')).append(rad('6')).append(rad('7')).append(rad('8')).html()
                                        ));

        //                        full.append( html.wrapTag('Set state of full player', 'h4') )
        //                            .append( html.singleRow('Choice','' ).append( rad('ON',1), rad('OFF',1), rad('Auto',1) ) );

                                pageTmp  = $('<span/>').append( size, col //, full
                                );
                                break;
                            case 2:
                                var more = objForm('more');
                                more.append( html.wrapTag('These fixed sizes can you choice', 'div', 'description'));
                                $.each( sharedData.settings2(), function( i, val ){
                                    val.on && more.append(
                                        html.singleRow( val.title, chbox( val )//.attr('checked', config[ val.name ] ) //.prop('checked', config[ val.name ] )
                                    ) );
                                    c.i('nr: ' + i +', ' + val.name + ', ' + val.title+'.');
                                });
                                pageTmp  = $('<span/>').append( more );
                                break;
                        }
                        c.i('button','----------------==================--------------');
                        c.i('configTM page ', page);

                        button.attr( 'id', 'setColSize' ).attr( 'data-page', page ).append( html.li_Item('Save Settings','menuTM','setColSize') );
                        return pageTmp.append( button )//.append( html.pager( 'config', page, 2 ) )
                      ;
                    },
                    render          = function(){
                        return  '\n '
                            +   w('Page Width:', 'h4')
                            +   fn.obj2Str( form() );
                    };
                html.createDialog( 'configTM', this.contBodyTM( render() ) );
                //config.fullPlayer = 'Auto'
                //c.i('config.fullPlayer',config.fullPlayer)
                $('#configTM').data('page',page);
                $('#pageSize').find('input.size.'+config.pageWidth).attr('checked', true );
                $('#columns').find('input.col'+config.thumbCol).attr('checked', true );
                $('#full').find('input.'+config.fullPlayer).attr('checked', true );
            },
            helpTM      : function( page ){
                var cl = 'normPresentation',
                    pageContent  = {
                        1 : function(){
                            return p( w('Choice what do you want help with:', 'h3')
                                +   '\r If you want to know about the Keyboard navigation and interaction then you click '+l('here','menuTM','help', 2)+'.'
                                +   '\r Where do you click with the mouse pointer to get something to react, find out '+l('here','menuTM','help', 3)+'.'
                                +   '\r A instruction video coming soon to you. The show coming '
                                +   v('here','title','videoLink','https://www.youtube-nocookie.com/embed/9chDANQxF2M?rel=0&amp;theme=light&amp;autohide=1', 3)+'.', cl );
                        },
                        2 : function(){
                            return p( w('Keyboard interaction navigation:', 'h3')
                                +   w('Video page:', 'h4')
                                +   fn.obj2Str( html.singleRow('N','Normal') )
                                +   fn.obj2Str( html.singleRow('W','Wide') )
                                +   fn.obj2Str( html.singleRow('O','Orginal') )
                                +   fn.obj2Str( html.singleRow('B','Enter Full Browser Player Mode') )
                                +   fn.obj2Str( html.singleRow('ESC','Exit Full Browser Player Mode') )
                                +   w('Thumb page:', 'h4')
                                +   fn.obj2Str( html.singleRow('Left arrow','Prev Page') )
                                +   fn.obj2Str( html.singleRow('Light arrow','Next Page') ),cl);
                        },
                        3 : function(){
                            return p( w('Mouse Navigation:', 'h3')
                                +   w('You can click right side of page', 'div', 'mouseNav')
                                +   '\n '
                                +   w('Thumb page:', 'h4')
                                +   fn.obj2Str( html.singleRow('Left','Prev Page') )
                                +   fn.obj2Str( html.singleRow('Right','Next Page') )
                                +   '\n '
                                +   w('Video page:', 'h4')
                                +   fn.obj2Str( html.singleRow('Left or Right','Enter Full Browser Player Mode') ),cl);
                        }
                    };
                html.createDialog( 'helpTM', pageContent[ page ] );
                $('#helpTM').find('.contHeadTM').append( page ).end().find('.contBodyTM').append( html.pager( 'help', page, 3 ) );
            },
            donateTM    : function( ){
                var elem = $('<div/>',{ id: 'table', class:'test' });

                html.createDialog( 'donateTM', elem );
            },
            videoTM     : function( height, width, src, firstLine, back, page ){
                var ow = width-1, oh = height-1, corr = 100, wh = $( window ).height();
                height + corr > wh ? ( ( height = wh - corr ), ( width = ow * ( height/oh ) ) ) : ( height = oh-8 );

                c.i('src',src);
                html.createDialog( 'videoTM', this.contBodyTM( this.embeded( height, width, src ) ),null,false );
                $('#videoTM').find('.firstLine').prepend( firstLine ).append( l('Previous Page', 'menuTM', back, page ) );

                this.wrapWidth( width + 40 );
            },

            contactForm : function( id ){
                var elul = $( '<ul>', { class: 'myMenu' }),
                    form = $( '<div/>',{ id:id }),
                    formObj = function(type,name,txt,size,cl,min){
                        var isInput = type == 'input',
                            typeVal = isInput ? '<input/>' : '<textarea/>',
                            elem = $(typeVal,{ id: 'c'+name, name:name, minlength: min }),
                            obj = $('<p/>',{ class: 'obj' })
                                .append( $('<label/>',{ for: 'c'+name, text: txt }) )
                                .append( isInput ? elem.attr('size',size ) : elem.attr('col',size ) );
                        return obj;
                    };
                return form
        /*            .append( formObj('input','name','Your Name:',30,'required',2) )
                    .append( formObj('input','email','Your E-Mail:',30,'required',5) )
                    .append( formObj('input','subject','Enter Subject:',30,'required',5) )
                    .append( formObj('text','comment','Enter Message:',30,'required',5) )
                    .append( elul.append( this.li_Item('Submit','menuTM','submit') ) )
        */
                ;
            },
            contactTM   : function( ){
                var presentation  = //'If you want to use your web e-mail or program click '
                    'Contact form is now down so for now, contact me by using your web e-mail or program - Click '
                    + a('here','mailto:magnus.fohlstrom@gmail.com?subject=Tag:vporn.com:%20Enter%20Your%20Here') + '.';
                html.createDialog( 'contactTM', $('<span/>').append( this.contactForm('myForm') )
                    .append(
                        p( presentation,'normPresentation'),
                        p( 'E-Mail: magnus.fohlstrom@gmail.com <br>Subject: Tag: vporn.com, Tag: Enter Your Here')
                    ) );
            },
            FileName    : function( ){
                var title = $('h1#vtitle').text();
                $('#videolinks').find('a').each(function( i, e ){
                    var $e = $(e), hl = $e.attr('href').split('initDownload(').pop().split("', '").shift();
                    c.i('hl', hl);
                    $e.attr('download', title + '.mp4' ).attr('href', hl );
                })
            },
            preSortMenu : function( ){
                $( '<div/>', { class: 'grayarea wline', text: 'Sort Menu is loading' }).insertAfter('.catsmenu');
            }
        },
        render      = {
            main        : function( ){
                GM.manager('get');
                config.startWidth();
                css.head();
                css.basicCss();
                listeners.sortButtons();
                listeners.minMax();
                listeners.resize();

            },
            tm          : function( ){
                c.i('open TM');
                css.fontsCss();
                css.tmCss();
                html.holderTM();
                html.wrapperTM();
                html.welcomeTM();
                html.sideTM();
                listeners.setColSize();
                listeners.menuButtonTM();
                html.copyright();
                c.i('Done TM');
            },
            videoThumbs : function( ){
                fn.videoAttributes();
                //noinspection JSUnresolvedVariable
                fn.minMax( config.videoMin, config.videoMax );
                fn.minMaxCurrent();

                var sorting = setInterval(function(){
                    c.i('sorting');
                    fn.initSort();
                    config.sorting && clearInterval( sorting );
//            html.FileName();
                }, 10 );
            }
        },
        observer    = new MutationObserver( function( mutations /*, observer */) {
            mutations.forEach( function( mutation ) {
                var newNodes = mutation.addedNodes; // DOM NodeList
                newNodes !== null &&
                $( newNodes ).each( function( i, e ){
                    var $e = $(e);
                    $e.hasClass('bx')                   && fn.videoAttributes();
                    ( $e.attr('id') === 'as3_js' || $e.isTag('video') ) && ( listeners.navVideo(), html.thumbSort() );
                    $e.hasClass('minititle')            && listeners.navThumb('.cholder');
                    $e.hasClass('left-account-menu')    && ( listeners.navThumb('.warapper-menu'), fn.sortMenu() );
                    $e.hasClass('warapper-menu')        && html.preSortMenu();
                    $e.hasClass('authsection')          && html.StartTM.render();
                    $e.hasClass('pagerwrap')            && fn.chkPager();
                    ( $e.hasClass('minititle') || $e.hasClass('video-details') ) && html.thumbSort();
                });
            });
        });

    GM_getValue('firstRun') === undefined && GM.first();

    //noinspection JSCheckFunctionSignatures
    observer.observe( document, { subtree: true, childList: true });
    render.main();
    c.i('VPorn ANewLayout','',2012, 'black' );

    $(document).ready(function(){
        render.videoThumbs();
        $('.video-details')[ config.pageWidthNR < 1400 ? 'addClass' : 'removeClass']('small');
        listeners.openCloseTM();
        config.imgHeight = null;
        fn.imgHeight();
        $('body font > :first-child').unwrap();
    });
}(jQuery));