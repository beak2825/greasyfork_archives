// ==UserScript==
// @name         Gelbooru KonaStyle
// @namespace    http://Aestellar.homepage/
// @version      0.15
// @description  Change gelbooru.com theme to darker, similar to konachan style. Added filtration image options, images with blacklist tags will be remove from search result. Also adden upvote&downvote button to preview page. Added buttons to hide submenu and red message in header.
// @author       Aestellar
// @include       *://gelbooru.com/*
// @resource    gelbooruCss1 https://userstyles.org/styles/111063/gelbooru-konastyle-test.css
// @grant GM_getResourceText
// @grant GM_addStyle

// @run-at      document-start

// @downloadURL https://update.greasyfork.org/scripts/7742/Gelbooru%20KonaStyle.user.js
// @updateURL https://update.greasyfork.org/scripts/7742/Gelbooru%20KonaStyle.meta.js
// ==/UserScript==
/*jshint multistr: true */
(function(){
    var win = window;
    var ls = localStorage;
    var css = GM_getResourceText ("gelbooruCss1");

    var searcher;
    if(!win){
        console.log(win + "Failed to load window object");
        return;
    }

    if(win.self != win.top){
        return;
    }


    addStyle(css);
    document.addEventListener("DOMContentLoaded",updateUI, false);

    function loadPrereq(){
        var hrefVar = win.location.href;
        if(/(htt[ps]:\/\/gelbooru\.com[\/]*)$/.test(hrefVar)){
            document.body.className = 'main-page';
        }
        var fontAwesomeLoader = document.createElement('div');
        //Font awesome support Don't work with @resource
        fontAwesomeLoader.innerHTML = '<link rel="stylesheet" type="text/css" media="screen" href="//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.0.3/css/font-awesome.css" />';
        fontAwesomeLoader = fontAwesomeLoader.children[0];
        document.head.appendChild(fontAwesomeLoader);
    }


    function updateUI(){
        loadPrereq();
        checkLastVisit();
        searcher = new SearchWidget();
        searcher.init();
        createSettingsWindow();
        updateNav();
        updateThumbs();
    }

    function SearchWidget (){
        this.searchElt = undefined; 
        this.searchForm = undefined;
        this.filtersList = [];
        var self = this;
        this.submit = function(e){          
            var text = self.searchElt.value;
            text = self.applySearchFilters(text);
            self.searchElt.value = text;
        };

        this.applySearchFilters = function(text){
            for (var i = 0; i < this.filtersList.length; i++) {
                text = this.filtersList[i](text);
            }
            return text;
        };

        this.init = function(){
            this.searchElt = qS('#stags')||qS('#tags');
            if (!this.searchElt) {
                throw new Error('Search field not found');
            }
            this._createFilters();
            this.searchForm = qS('.sidebar3 form');
             if (!this.searchForm) {
                throw new Error('Search form not found');
            }           
            this.searchForm.onsubmit = this.submit;
        };
        this._createFilters = function(){
            var newImageFilter = function(text){
                if (ls.getItem('onlyNewSearch')==='true') {
                    if (!!getLastImageId()) {
                        var newId = ' id:>' + getLastImageId() + ' ';
                        if (text.indexOf(newId)===-1) {
                            text+=newId;
                        }
                    }
                }
                return text;
            };
            this.filtersList.push(newImageFilter);
        };       
    }

    function updateThumbs(){
        var c = qS('.thumb');
        if (!c){
            return;
        }

        var thumbsContainer = c.parentNode;
        c = thumbsContainer.parentNode;
        processThumbs(thumbsContainer);

        observeDOM(c, function(e){
            var temp =e.forEach;
            if (!!temp) {
                e.forEach(function(elt){
                    var test;
                    var  t = elt.addedNodes;
                    if (!!t) {
                        t = t[0];

                        if (!t) {
                            return;
                        }

                        if (!t.getElementsByClassName){
                            return;
                        }
                        test = t.getElementsByClassName('thumb');
                        if (!!test.length) {

                            processThumbs(t);
                        }
                    }
                });
            }
        });
    }

    function appendThumbPane(thumb){
        var test = makeDiv('thumb-pane');
        var url = getImageRefFromThumb(thumb);
        url = url.replace('thumbnails','images');
        url = url.replace('thumbnail_','');
        if(getTagListFromThumb(thumb).search('animated_gif')!=-1){
            makeRef('gif');
        }
        else if (getTagListFromThumb(thumb).search('webm')!=-1) {
            makeRef('webm');
        }
        else{
            var ext = ['png','jpeg','jpg'];
            for (var i = ext.length - 1; i >= 0; i--) {
                makeRef(ext[i]);
            }
        }

        function makeRef(extension){
            var ref = document.createElement('a');
            ref.textContent  = extension;
            var url2 = url.replace('jpg',extension);
            ref.setAttribute('href', url2);
            test.appendChild(ref);
        }


        var dataId = getIdFromThumb(thumb);
        test.setAttribute('data-id', dataId);
        test.setAttribute('data-voted', 'false');

        var upBtn = document.createElement('span');
        var downBtn = document.createElement('span');

        makeSimpleButton(upBtn,
            {name:'upBtn',
                glyph:'fa-thumbs-up',
                callback:voteUp
            });

        makeSimpleButton(downBtn,
            {name:'downBtn',
                glyph:'fa-thumbs-down',
                callback:voteDown
            });

        test.insertBefore(upBtn,test.firstChild);
        //test.appendChild(ref);
        test.appendChild(downBtn);

        thumb.appendChild(test);
    }

    function voteImage(e, vote){
        var parent = e.bindedElt;
        var pane = parent.parentNode;
        if (pane.getAttribute('data-voted')!=='false') {
            return;
        }
        var id = pane.getAttribute('data-id');

        handleXHRDoc('index.php?page=post&s=vote&id='+id+'&type='+vote, function(doc){
            var score = doc.body.textContent;
            parent.textContent=score;
            pane.setAttribute('data-voted', 'true');
        });
    }

    function voteUp(e){
        voteImage(e, 'up');
    }

    function voteDown(e){
        voteImage(e, 'down');
    }


    function isImageFiltering(){
        return ls.getItem('disableImageFiltering')==='false';
    }

    function isPreviewPaneEnabled(){
        return ls.getItem('disablePreviewPane')==='false';
    }


    function processThumbs(container){
        if (!!container) {
            for (var i = 0; i <container.children.length; i++) {
                var loop = container.children[i];

                if(filterThumb(loop)){
                    continue;
                }
                if (isPreviewPaneEnabled()) {
                    appendThumbPane(loop);
                }
            }
        }
    }

    function increaseFilterCount(){
        var countElt = qS('#filterCount');
        var count = countElt.textContent;
        count = parseInt(count);
        count+=1;
        countElt.textContent=count;
    }

    function filterThumb(thumb){
        if (!isImageFiltering()) {
            return false;
        }

        var thumbTags = getTagListFromThumb(thumb);
        if (!!thumbTags) {
            if (isBannedThumb(thumbTags)) {
                hide(thumb);
                increaseFilterCount();
                return true;
            }
        }
        return false;
    }

    function isBannedThumb(thumbList){
        var bannedList = getBannedList();
        var loop;

        if (!bannedList) {
            return false;
        }
        bannedList = bannedList.replace('\n', ' ');
        bannedList = bannedList.replace(/\s+/g, ' ');
        bannedList = bannedList.replace(/(\s+)$/g, '');
        bannedList = bannedList.replace(/^(\s+)/g, '');
        bannedList = bannedList.split(' ');
        for (var i = bannedList.length - 1; i >= 0; i--) {
            loop = bannedList[i];
            loop = new RegExp('\\b'+ loop + '\\b');
            if (thumbList.search(loop)!=-1) {
                return true;
            }
        }
        return false;
    }

    function getIdFromThumb(thumb){
        var id = thumb.getAttribute('id');
        if (!!id) {
            id = id.replace('s', '');
        }
        return id;
    }

    function getImageRefFromThumb(thumb){
        var img = thumb.getElementsByTagName('img')[0];
        if (!!img) {
            return img.getAttribute('src');
        }
    }

    function getTagListFromThumb(thumb){
        if (!thumb) {
            return;
        }
        var thumbImg = thumb.getElementsByClassName('preview')[0];
        if (!!thumbImg) {
            return thumbImg.getAttribute('alt');
        }
    }

    function getBannedList(){
        var bannedList = ls.getItem('bannedTagsList');
        return bannedList;
    }
    function getFavoritesTagsList(){
        var favoritesList = ls.getItem('favoritesTagsList');
        return favoritesList;        
    }


    function updateNav() {
        var navBar = qS('.flat-list');
        var settingsBtn = document.createElement("li");
        var navBtn = document.createElement("li");
        var advNav = document.createElement("li");
        navBar.insertBefore(settingsBtn, navBar.firstChild);
        navBar.insertBefore(advNav, navBar.firstChild);
        navBar.insertBefore(navBtn, navBar.firstChild);

        var s = {name:'settingsBtn',
            glyph:'fa-gear',
            callback:showSettingsWindow};

        makeUserNavBar();

        var sett = {name:'navCollapse', glyphOff:'fa-minus-square-o', glyphOn:'fa-plus-square-o',
            callbackOff:makeToggleFunc(['.submenu', '.noticeError'], show), callbackOn:makeToggleFunc(['.submenu', '.noticeError'], hide)};

        var sett2 = {name:'advNavCollapse', glyphOff:'fa-search-minus', glyphOn:'fa-search-plus',
            callbackOff:makeToggleFunc(['#usernavbar'], show), callbackOn:makeToggleFunc(['#usernavbar'], hide)};

        makeSimpleButton(settingsBtn, s);
        makeToggleButton(navBtn,sett);
        makeToggleButton(advNav,sett2);
    }

    function createSettingsWindow(){
        var mod = document.createElement('div');
        mod.className = 'modalDialog';
        mod.innerHTML = '<div class = modalDialogBox>\
		<span title="Close" class="close"></span>\
		</div>';
        document.body.appendChild(mod);
        mod.addEventListener('click',hideModalWindow,false);

        var close = qS('.modalDialog .close');

        makeSimpleButton(close,
            {name:'settingsBtn',
                glyph:'fa-times',
                callback:hideSettingsWindow
            });

        var dialog = qS('.modalDialogBox');
        dialog.appendChild(makeSettingsInner());

    }

    function makeSettingsInner(){
        var div = document.createElement('div');
        div.innerHTML = '<span class="modalName">Settings</span>';

        var settTab = new TabbedPane();
        div.appendChild(settTab.tabbedPane);

        var mainSetting = makeDiv('main-settings');

        var disableFilteringRule = makeDiv('settings-rule');
        disableFilteringRule.textContent = 'Disable image filtering: ';
        disableFilteringRule.appendChild(makeCheckBox('disableImageFiltering'));
        mainSetting.appendChild(disableFilteringRule);


        var disableThumbPane = makeDiv('settings-rule');
        disableThumbPane.textContent = 'Don\' show preview panel: ';
        disableThumbPane.appendChild(makeCheckBox('disablePreviewPane'));
        mainSetting.appendChild(disableThumbPane);

        var bannedTagsTab = document.createElement('textarea');
        bannedTagsTab.className = 'bannedList';
        bannedTagsTab.value = getBannedList();
        bannedTagsTab.addEventListener('input',function(e){
            ls.setItem('bannedTagsList',e.target.value);
        },false);

        var favoritesTagsTab = document.createElement('textarea');
        favoritesTagsTab.className = 'bannedList';
        favoritesTagsTab.value = getFavoritesTagsList();
        favoritesTagsTab.addEventListener('input',function(e){
            ls.setItem('favoritesTagsList',e.target.value);
        },false);


        settTab.addTab('sett1', 'Settings', mainSetting);
        settTab.addTab('sett2','Banned tags', bannedTagsTab);
        //settTab.addTab('sett3','Favorites tags', favoritesTagsTab);        
        //console.log(settTab);

        // var iTest = makeDiv('');
        // iTest.innerHTML = '<img src="http://i.nhentai.net/galleries/795920/cover.jpg">';
        // settTab.addTab('sett3','imageTest', iTest);
        settTab.selectDefault();


        return div;
    }

    function showSettingsWindow(e){
        var mod = qS('.modalDialog');
        mod.classList.add('modalActive');
    }

    function hideModalWindow(e){
        var mod = qS('.modalDialog');
        if (e && (e.target!== mod)) {
            return;
        }
        hideSettingsWindow(e);
    }

    function hideSettingsWindow(e){
        var mod = qS('.modalDialog');
        mod.classList.remove('modalActive');
    }


    function makeUserNavBar(){
        var userBar = document.createElement('ul');
        userBar.className = 'flat-list';
        userBar.setAttribute('id', 'usernavbar');
        var navBar = qS('.submenu');
        var navParent = navBar.parentNode;
        navParent.insertBefore(userBar,navBar.nextSibling);

        makeFitImageBtn(userBar);
        makeAdvSearchPane(userBar);

    }

    function makeToggleFunc(sel,action){

        var activeFoo = function(){
            for (var i = sel.length - 1; i >= 0; i--) {
                action(qS(sel[i]));
            }
        };
        return activeFoo;
    }

    function makeFitImageBtn(userBar){
        var fitBtn = document.createElement("li");
        userBar.appendChild(fitBtn);
        fitBtn.title = 'Autofit image or webm to page width';
        var imageFit = makeToggleButton(fitBtn, {name:'fitImage',
            glyphOff:'fa fa-compress',
            glyphOn:'fa fa-expand',
            callbackOff:fitImage,
            callbackOn:fitImage});
        function fitImage(){
            var img = qS('#image')||qS('#gelcomVideoPlayer');
            if (img === undefined) {
                return;
            }

            img.removeAttribute('width');
            img.removeAttribute('height');

            if ((localStorage.getItem('fitImage')==='true')) {
                img.style.maxWidth = '100%';
            }

            else{
                img.style.maxWidth = '';
            }

            if(!!img){
                img.addEventListener('load', fitImage, false);
            }
        }
    }

    function makeAdvSearchPane(userBar){
        var advSearch = document.createElement('div');
        advSearch.innerHTML = '<div id = "adv-search">\
	<li><span>Advanced Search: </span>\
	<span id = "only-new">Only new images </span></li>\
	<li><span>Filtered images: <span id="filterCount">0</span></span></li>\
	</div>';
        advSearch = advSearch.firstChild;
        userBar.appendChild(advSearch);
        var onlyNew = document.getElementById('only-new');

        makeToggleButton(onlyNew, {name:'onlyNewSearch',
            glyphOff:'fa-square-o',
            glyphOn:'fa-check-square-o'
        });
        return advSearch;
    }

    function makeCheckBox(rname){
        var box = makeSpan('checkbox-span');
        makeToggleButton(box,
            {name:rname,
                glyphOff:'fa-square-o',
                glyphOn:'fa-check-square-o'
            });
        return box;
    }

    function makeToggleButton(elem, settings){
        var btn = new ButtonToggle(settings);
        btn.bindElement(elem);
        btn.load();
        elem.addEventListener('click', btn.handlerClick, false);
        return btn;
    }

    function makeSimpleButton(elem, settings){
        var btn = new ButtonSimple(settings);
        btn.bindElement(elem);
        elem.addEventListener('click', btn.handlerClick, false);
        return btn;
    }


    function ButtonSimple(settings){
        var self = this;
        var modGliph = 'fa-lg';
        this.name = settings.name;

        this.glyphElt = document.createElement('i');
        this.active = false;
        this.bindedElt = null;
        this.callback = settings.callback;
        this.bindElement = function (elem) {
            self.bindedElt = elem;
            if (self.bindedElt.length > 0) {
                elem.insertChildBefore(self.glyphElt, elem.FirstChild);
            }
            else {
                elem.appendChild(self.glyphElt);
            }
        };
        this.glyph = 'fa ' + settings.glyph + ' ' + modGliph;
        self.glyphElt.className = self.glyph;

        this.handlerClick = function (e) {
            self.callback(self);
        };
    }

    function ButtonToggle(settings) {
        var self = this;

        var modGliph = 'fa-lg';
        this.name = settings.name;

        this.active = false;
        this.bindedElt = null;
        this.glyphElt = document.createElement('i');
        this.bindElement = function (elem) {
            self.bindedElt = elem;
            if (self.bindedElt.length > 0) {
                elem.insertChildBefore(self.glyphElt, elem.FirstChild);
            }
            else {
                elem.appendChild(self.glyphElt);
            }
        };

        this.glyphOn = 'fa ' + settings.glyphOn + ' ' + modGliph;
        this.glyphOff = 'fa ' + settings.glyphOff + ' ' + modGliph;
        this.callbackOn = settings.callbackOn;
        this.callbackOff = settings.callbackOff;
        this.save = function () {
            localStorage.setItem(self.name, self.active);
        };
        this.load = function () {
            var t = localStorage.getItem(self.name);
            if (t === 'true') {
                self.setActive(true);
            }
            else {
                self.setActive(false);
            }
        };
        this.handlerClick = function (e) {
            if (self.active) {
                self.setActive(false);
            }

            else {
                self.setActive(true);
            }
        };

        this.setActive = function (val) {
            val = !!val;
            self.active = val;
            self.save(val);

            if (val) {
                if (!!self.bindedElt) {
                    self.bindedElt.classList.add('activeBtn');
                    self.glyphElt.className = self.glyphOn;
                }

                if (!!self.callbackOn) {
                    self.callbackOn(self);
                }
            }

            else {
                if (!!self.bindedElt) {
                    self.bindedElt.classList.remove('activeBtn');
                    self.glyphElt.className = self.glyphOff;
                }

                if (!!self.callbackOff) {
                    self.callbackOff(self);
                }
            }
        };
    }


// LastVisit functions              
    function checkLastVisit(){
        var timer = 7200000;
        var lastVisit = parseInt(ls.getItem('lastVisit'));
        var prevVisit = parseInt(ls.getItem('preLastVisit'));

        var currentVisit = new Date().valueOf();
        if ((!lastVisit)||(!prevVisit)) {
            updateLastVisit();
        }
        if ((lastVisit + timer) < currentVisit) {
            updateLastVisit();
        }
    }

    function updateLastVisit(){
        var posts = 'http://gelbooru.com/index.php?page=post&s=list&tags=all';
        handleXHRDoc(posts, function(doc){
            var lastIdElt = doc.getElementsByClassName('thumb')[0];
            var lastID = lastIdElt.getAttribute('id');
            lastID = lastID.replace('s', '');

            if (!!ls.getItem('lastVisit')) {
                ls.setItem('preLastVisit',ls.getItem('lastVisit'));
            }
            else{
                ls.setItem('preLastVisit',new Date().valueOf());
            }
            if (ls.getItem('lastImageId')) {
                ls.setItem('preImageId',ls.getItem('lastImageId'));
            }
            else{
                ls.setItem('preImageId',lastID);
            }

            localStorage.setItem('lastVisit',new Date().valueOf());
            localStorage.setItem('lastImageId', lastID);
        });
    }

    function getLastImageId(){
        var t = localStorage.getItem('preImageId');
        return parseInt(t);
    }

})();

function handleXHRDoc(reqString, callback){
    var doc = document.implementation.createHTMLDocument("example");

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', reqString, true);
    xmlhttp.send(null);
    xmlhttp.onreadystatechange = handle;

    function handle(){
        if (xmlhttp.readyState == 4) {
            if(xmlhttp.status == 200) {
                doc.documentElement.innerHTML = xmlhttp.responseText;
                console.log(doc);
                callback(doc);
            }

            else{
                console.log('Error xhr of ' + reqString);
            }
        }
    }
}


//from http://stackoverflow.com/questions/2246901/how-can-i-use-jquery-in-greasemonkey-scripts-in-google-chrome
function load(a, b, c) {
    var d;
    d = document.createElement("script"), d.setAttribute("src", a), b !== null && d.addEventListener("load", b), c !== null && d.addEventListener("error", c), document.body.appendChild(d);
    return d;
}
function execute(a) {
    var b, c;
    typeof a == "function" ? b = "(" + a + ")();" : b = a, c = document.createElement("script"), c.textContent = b, document.body.appendChild(c);
    return c;
}
function loadAndExecute(a, b) {
    return load(a, function () {
        return execute(b);
    });
}
//
function qS(selector){
    return document.querySelectorAll(selector)[0];
}

function hide(elt){
    if (!!elt) {
        elt.style.display = 'none';
    }
    else{
        console.log('Not found' + elt );
    }

}
function show(elt){
    if (!!elt) {
        elt.style.display = '';
    }
    else{
        console.log('Not found' + elt );
    }

}

function removeAllChild(elem){
    while (elem.hasChildNodes()) {
        elem.removeChild(elem.lastChild);
    }
}

function hasClass(elem, name) {
    if (!!elem) {
        if (!!elem.classList) {
            if (elem.classList.contains(name)) {
                return true;
            }
        }
    }
    return false;
}

function addStyle(css){
    if (typeof GM_addStyle != "undefined") {
        GM_addStyle(css);
    } else if (typeof PRO_addStyle != "undefined") {
        PRO_addStyle(css);
    } else if (typeof addStyle != "undefined") {
        addStyle(css);
    } else {
        var node = document.createElement("style");
        node.type = "text/css";
        node.appendChild(document.createTextNode(css));
        var heads = document.getElementsByTagName("head");
        if (heads.length > 0) {
            heads[0].appendChild(node);
        } else {
            // no head yet, stick it whereever
            document.documentElement.appendChild(node);
        }
    }
}


function applyCSSRulesFromJS(){
    var style = document.createElement("style");
    style.appendChild(document.createTextNode(getCSSText()));

    // Add the <style> element to the page
    document.head.appendChild(style);

    return style.sheet;
}

function makeDiv(className){
    var div = document.createElement('div');
    div.className = className;
    return div;
}

function makeSpan(className){
    var div = document.createElement('span');
    div.className = className;
    return div;
}

function TabbedPane (){
    var self = this;
    var tabbedPane = makeDiv("tabbed-Pane");
    var navPane = makeDiv("nav-Pane");
    var contentPane = makeDiv("content-Pane");
    tabbedPane.appendChild(navPane);
    tabbedPane.appendChild(contentPane);
    this.tabbedPane = tabbedPane;
    this.navPane = navPane;
    this.navMap= {};
    this.contentPane = contentPane;
    this.addTab = function(realName,visibleName,content){
        var head = makeDiv('tab-Head');
        head.textContent  = visibleName;
        var tab = new TabPane(self, realName, head, content);
        self.navMap[realName]= tab;
        self.navPane.appendChild(head);
        head.addEventListener('click', tab.clickHandler, false);
    };
    this.selectTab = function(tab){
        var loopTab;

        for (var key in self.navMap) {
            if (self.navMap.hasOwnProperty(key)){
                loopTab = self.navMap[key];
                loopTab.setSelected(false);
            }
        }

        removeAllChild(self.contentPane);
        tab.setSelected(true);
        self.contentPane.appendChild(tab.content);
    };
    this.selectDefault = function(){
        for (var key in self.navMap) {
            if (self.navMap.hasOwnProperty(key)){
                self.navMap[key].clickHandler();
                break;
            }
        }
    };
}

function TabPane(master,name,head,content){
    var self = this;
    this.name = name;
    this.masterPane = master;
    this.head = head;
    this.content = content;
    this.selected = false;
    this.setSelected = function(val){
        if (!!val) {
            self.head.classList.add('activeTab');
            self.selected = true;
        }
        else{
            self.head.classList.remove('activeTab');
            self.selected = false;
        }
    };
    this.clickHandler = function(e){
        self.setSelected(true);
        master.selectTab(self);
    };

}

var observeDOM = (function(){
    var MutationObserver = window.MutationObserver;

    return function(obj, callback){
        // define a new observer
        var obs = new MutationObserver(function(mutations, observer){
            if( mutations[0].addedNodes.length || mutations[0].removedNodes.length )
            //console.log(obj)
                callback(mutations);
        });
        // have the observer observe foo for changes in children
        obs.observe( obj, { childList:true, subtree:false });
    }
})();
