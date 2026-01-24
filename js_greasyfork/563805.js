// ==UserScript==
// @name         01
// @namespace    http://tampermonkey.net/
// @version      2025-05-26
// @description  ass
// @author       You
// @license none
// @match        https://moodle.ut.ee/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ut.ee
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563805/01.user.js
// @updateURL https://update.greasyfork.org/scripts/563805/01.meta.js
// ==/UserScript==
const buttonHTML = `<button type="submit" class="btn btn-primary" id="single_button6971dd03eb5df22">Lisa esitatav töö</button>`;
const esitamineHTML = `<tr class="">
<th class="cell c0" style="" scope="row">Faili esitamine</th>
<td class="cell c1 lastcol" style=""><div class="box py-3 boxaligncenter plugincontentsummary summary_assignsubmission_file_4271894"><div id="assign_files_tree6973cb467dcaa23"><div class="ygtvitem" id="ygtv0"><div class="ygtvchildren" id="ygtvc0"><div class="ygtvitem" id="ygtv1"><table id="ygtvtableel1" border="0" cellpadding="0" cellspacing="0" class="ygtvtable ygtvdepth0 ygtv-expanded ygtv-highlight0"><tbody><tr class="ygtvrow"><td class="ygtvcell ygtvln"><div class="ygtvspacer"></div></td><td id="ygtvcontentel1" class="ygtvcell ygtvhtml ygtvcontent"><div><div class="fileuploadsubmission"><img class="icon icon" alt="Alexander_Rassadin_kaitsmine.pdf" title="Alexander_Rassadin_kaitsmine.pdf" src="https://moodle.ut.ee/theme/image.php/classic_ut/core/1767850292/f/pdf"> <a target="_blank" href="https://moodle.ut.ee/pluginfile.php/2998016/assignsubmission_file/submission_files/4271894/Alexander_Rassadin_kaitsmine.pdf?forcedownload=1">Alexander_Rassadin_kaitsmine.pdf</a> <span class="core_plagiarism_links"><span class="strikeplagiarismreport"></span></span> <a href="https://moodle.ut.ee/portfolio/add.php?ca_cmid=1381426&amp;ca_fileid=62376958&amp;sesskey=c2J2nXYxJ9&amp;callbackcomponent=mod_assign&amp;callbackclass=assign_portfolio_caller&amp;course=7161&amp;callerformats=pdf%2Cleap2a" id="action_link6973cb467dcaa25" class="action-icon mx-1 p-1 btn btn-link icon-no-margin" title="Ekspordi portfooliosse (Lisavõimalus isiklikuks säilitamiseks)" aria-label="Ekspordi portfooliosse (Lisavõimalus isiklikuks säilitamiseks)"><i class="icon fa fa-plus fa-fw portfolio-add-icon smallicon" aria-hidden="true"></i></a> </div><div class="fileuploadsubmissiontime">23.01.2026 21:39:54</div></div></td></tr></tbody></table><div class="ygtvchildren" id="ygtvc1" style="display:none;"></div></div></div></div></div><a class="portfolio-add-link" title="Ekspordi portfooliosse (Lisavõimalus isiklikuks säilitamiseks)" href="https://moodle.ut.ee/portfolio/add.php?ca_cmid=1381426&amp;ca_sid=4271894&amp;ca_area=submission_files&amp;ca_component=assignsubmission_file&amp;sesskey=c2J2nXYxJ9&amp;callbackcomponent=mod_assign&amp;callbackclass=assign_portfolio_caller&amp;course=7161&amp;callerformats=file%2Cleap2a">Ekspordi portfooliosse (Lisavõimalus isiklikuks säilitamiseks)</a></div></td>
</tr>`;
const submissionFOrmHTML = `<div class="box py-3 boxaligncenter editsubmissionform">
<form autocomplete="off" action="https://moodle.ut.ee/mod/assign/view.php" method="post" accept-charset="utf-8" id="mform1_8q3RUW2ClLTIpA4" class="mform" data-boost-form-errors-enhanced="1">
	<div style="display: none;"><input name="lastmodified" type="hidden" value="1769069819">
<input name="id" type="hidden" value="482058">
<input name="userid" type="hidden" value="155301">
<input name="action" type="hidden" value="savesubmission">
<input name="sesskey" type="hidden" value="SsQdbNwHyR">
<input name="_qf__mod_assign_submission_form" type="hidden" value="1">
<input name="mform_isexpanded_id_submissionheader" type="hidden" value="1">
</div>


	<fieldset class="clearfix collapsible" id="id_submissionheader"><legend class="sr-only">Lisa esitatav töö</legend>
<div class="d-flex align-items-center mb-2">
    <div class="position-relative d-flex ftoggler align-items-center position-relative me-1">
            <a data-toggle="collapse" href="#id_submissionheadercontainer" role="button" aria-expanded="true" aria-controls="id_submissionheadercontainer" class="btn btn-icon me-3 icons-collapse-expand stretched-link fheader ">
                <span class="expanded-icon icon-no-margin p-2" title="Ahenda">
                    <i class="icon fa fa-chevron-down fa-fw " aria-hidden="true"></i>
                </span>
                <span class="collapsed-icon icon-no-margin p-2" title="Laienda">
                    <span class="dir-rtl-hide"><i class="icon fa fa-chevron-right fa-fw " aria-hidden="true"></i></span>
                    <span class="dir-ltr-hide"><i class="icon fa fa-chevron-left fa-fw " aria-hidden="true"></i></span>
                </span>
                <span class="sr-only">Lisa esitatav töö</span>
            </a>
        <h3 class="d-flex align-self-stretch align-items-center mb-0" aria-hidden="true" data-target="#id_submissionheadercontainer" data-toggle="collapse" role="button">
            Lisa esitatav töö
        </h3>
    </div>

</div>
<div id="id_submissionheadercontainer" class="fcontainer collapseable collapse  show"><div id="fitem_id_files_filemanager" class="mb-3 row  fitem    ">
    <div class="col-md-3 col-form-label d-flex pb-0 pe-md-0">
                    <p id="id_files_filemanager_label" class="mb-0 d-inline" aria-hidden="true" style="cursor: default;">
                Faili esitamine
            </p>

        <div class="form-label-addon d-flex align-items-center align-self-start">

        </div>
    </div>
    <div class="col-md-9 d-flex flex-wrap align-items-start felement" data-fieldtype="filemanager">
        <fieldset class="w-100 m-0 p-0 border-0" id="id_files_filemanager_fieldset">
            <legend class="sr-only">Faili esitamine</legend>
            <div id="filemanager-6971deeab7fc3" class="filemanager w-100 fm-loaded fm-nofiles fm-noitems">
    <div class="fp-restrictions">
        <span>Lisatavate failide maksimaalne suurus: 1&nbsp;GB, arv: 20</span>
        <span class="dnduploadnotsupported-message"> - lohistamist ei toetata<a class="btn btn-link p-0 me-2 icon-no-margin" role="button" data-container="body" data-toggle="popover" data-placement="right" data-content="&lt;div class=&quot;no-overflow&quot;&gt;&lt;p&gt;Kui kaustas on mitu faili, on peamine fail see, mis kuvatakse vaatelehel. Teised failid, nt pildid või videod, võivad olla sellele manustatud. Failihalduris on peamine fail märgitud paksus kirjas nimega.&lt;/p&gt;
&lt;/div&gt; " data-html="true" tabindex="0" data-trigger="focus" aria-label="Abiteave" data-original-title="" title="">
  <i class="icon fa fa-circle-question text-info fa-fw " title="Määra peamine fail – abi" role="img" aria-label="Määra peamine fail – abi"></i>
</a></span>
    </div>
    <div class="fp-navbar bg-faded card mb-0">
        <div class="filemanager-toolbar icon-no-spacing">
            <div class="fp-toolbar">
                <div class="fp-btn-add">
                    <a role="button" title="Lisa..." class="btn btn-secondary btn-sm" href="#">
                        <i class="icon fa fa-circle-plus fa-fw " aria-hidden="true"></i>
                    </a>
                </div>
                <div class="fp-btn-mkdir">
                    <a role="button" title="Loo kaust" class="btn btn-secondary btn-sm" href="#">
                        <i class="icon fa fa-folder-plus fa-fw " aria-hidden="true"></i>
                    </a>
                </div>
                <div class="fp-btn-download">
                    <a role="button" title="Laadi alla" class="btn btn-secondary btn-sm" href="#">
                        <i class="icon fa fa-download fa-fw " aria-hidden="true"></i>
                    </a>
                </div>
                <div class="fp-btn-delete">
                    <a role="button" title="Kustuta" class="btn btn-secondary btn-sm" href="#">
                        <i class="icon fa fa-trash-can fa-fw " aria-hidden="true"></i>
                    </a>
                </div>
                <span class="fp-img-downloading">
                    <span class="sr-only">Laadimine...</span>
                    <i class="icon fa fa-spinner fa-spin fa-sm fa-fw " aria-hidden="true"></i>
                </span>
            </div>
            <div class="fp-viewbar btn-group float-sm-end">
                <a title="Kuva kaust faili ikoonidega" class="fp-vb-icons btn btn-secondary btn-sm" href="#">
                    <i class="icon fa fa-border-all fa-fw " aria-hidden="true"></i>
                </a>
                <a title="Kuva kaust faili üksikasjadega" class="fp-vb-details btn btn-secondary btn-sm checked" href="#">
                    <i class="icon fa fa-list fa-fw " aria-hidden="true"></i>
                </a>
                <a title="Kuva kaust failipuuna" class="fp-vb-tree btn btn-secondary btn-sm" href="#">
                    <i class="icon fa fa-folder-tree fa-fw " aria-hidden="true"></i>
                </a>
            </div>
        </div>
        <div class="fp-pathbar"><span class="fp-path-folder first last odd" id="yui_3_18_1_1_1769070315567_302"><a class="fp-path-folder-name aalink" href="#">Failid</a></span></div>
    </div>
    <div class="filemanager-loading mdl-align"><i class="icon fa fa-spinner fa-spin fa-sm fa-fw " aria-hidden="true"></i><span class="sr-only">Laadimine...</span></div>
    <div class="filemanager-container card" id="yui_3_18_1_1_1769070315567_52">
        <div class="fm-content-wrapper">
            <div class="fp-content"></div>
            <div class="fm-empty-container">
                <div class="dndupload-message">Lohista fail(id) hiirega siia<br>
                    <div class="dndupload-arrow d-flex">
                        <i class="fa fa-arrow-circle-o-down fa-3x m-auto"></i>
                    </div>
                </div>
            </div>
            <div class="dndupload-target">Aseta failid üleslaadimiseks siia<br>
                <div class="dndupload-arrow d-flex">
                    <i class="fa fa-arrow-circle-o-down fa-3x m-auto"></i>
                </div>
            </div>
            <div class="dndupload-progressbars"></div>
            <div class="dndupload-uploadinprogress"><i class="icon fa fa-spinner fa-spin fa-sm fa-fw " aria-hidden="true"></i><span class="sr-only">Laadimine...</span></div>
        </div>
        <div class="filemanager-updating"><i class="icon fa fa-spinner fa-spin fa-sm fa-fw " aria-hidden="true"></i><span class="sr-only">Laadimine...</span></div>
    </div>
</div><noscript><div><object type='text/html' data='https://moodle.ut.ee/repository/draftfiles_manager.php?env=filemanager&amp;action=browse&amp;itemid=381368865&amp;subdirs=1&amp;maxbytes=1572864000&amp;areamaxbytes=-1&amp;maxfiles=20&amp;ctx_id=960915&amp;course=7161&amp;sesskey=SsQdbNwHyR' height='160' width='600' style='border:1px solid #000'></object></div></noscript><input value="381368865" name="files_filemanager" type="hidden" id="id_files_filemanager">
        </fieldset>
        <div class="form-control-feedback invalid-feedback" id="id_error_files_filemanager">

        </div>
    </div>
</div><div id="fitem_id_onlinetext_editor" class="mb-3 row  fitem    ">
    <div class="col-md-3 col-form-label d-flex pb-0 pe-md-0">

                <label id="id_onlinetext_editor_label" class="d-inline word-break " for="id_onlinetext_editor">
                    Onlain tekst
                </label>

        <div class="form-label-addon d-flex align-items-center align-self-start">

        </div>
    </div>
    <div class="col-md-9 d-flex flex-wrap align-items-start felement" data-fieldtype="editor">
        <div><div>
<textarea id="id_onlinetext_editor" name="onlinetext_editor[text]" class="form-control" rows="15" cols="80" spellcheck="true" style="display: none;" aria-hidden="true" data-fieldtype="editor"></textarea><div role="application" class="tox tox-tinymce" aria-disabled="false" style="visibility: hidden; height: 350px;"><div class="tox-editor-container"><div data-alloy-vertical-dir="toptobottom" class="tox-editor-header"><div role="menubar" data-alloy-tabstop="true" class="tox-menubar"><button aria-haspopup="true" role="menuitem" type="button" tabindex="-1" data-alloy-tabstop="true" unselectable="on" class="tox-mbtn tox-mbtn--select" aria-expanded="false" style="user-select: none; width: 59.7969px;"><span class="tox-mbtn__select-label">Muuda</span><div class="tox-mbtn__select-chevron"><svg width="10" height="10" focusable="false"><path d="M8.7 2.2c.3-.3.8-.3 1 0 .4.4.4.9 0 1.2L5.7 7.8c-.3.3-.9.3-1.2 0L.2 3.4a.8.8 0 0 1 0-1.2c.3-.3.8-.3 1.1 0L5 6l3.7-3.8Z" fill-rule="nonzero"></path></svg></div></button><button aria-haspopup="true" role="menuitem" type="button" tabindex="-1" data-alloy-tabstop="true" unselectable="on" class="tox-mbtn tox-mbtn--select" style="user-select: none; width: 53.4844px;" aria-expanded="false"><span class="tox-mbtn__select-label">Vaade</span><div class="tox-mbtn__select-chevron"><svg width="10" height="10" focusable="false"><path d="M8.7 2.2c.3-.3.8-.3 1 0 .4.4.4.9 0 1.2L5.7 7.8c-.3.3-.9.3-1.2 0L.2 3.4a.8.8 0 0 1 0-1.2c.3-.3.8-.3 1.1 0L5 6l3.7-3.8Z" fill-rule="nonzero"></path></svg></div></button><button aria-haspopup="true" role="menuitem" type="button" tabindex="-1" data-alloy-tabstop="true" unselectable="on" class="tox-mbtn tox-mbtn--select" style="user-select: none; width: 57.9062px;" aria-expanded="false"><span class="tox-mbtn__select-label">Sisesta</span><div class="tox-mbtn__select-chevron"><svg width="10" height="10" focusable="false"><path d="M8.7 2.2c.3-.3.8-.3 1 0 .4.4.4.9 0 1.2L5.7 7.8c-.3.3-.9.3-1.2 0L.2 3.4a.8.8 0 0 1 0-1.2c.3-.3.8-.3 1.1 0L5 6l3.7-3.8Z" fill-rule="nonzero"></path></svg></div></button><button aria-haspopup="true" role="menuitem" type="button" tabindex="-1" data-alloy-tabstop="true" unselectable="on" class="tox-mbtn tox-mbtn--select" style="user-select: none; width: 82.3594px;" aria-expanded="false"><span class="tox-mbtn__select-label">Vormindus</span><div class="tox-mbtn__select-chevron"><svg width="10" height="10" focusable="false"><path d="M8.7 2.2c.3-.3.8-.3 1 0 .4.4.4.9 0 1.2L5.7 7.8c-.3.3-.9.3-1.2 0L.2 3.4a.8.8 0 0 1 0-1.2c.3-.3.8-.3 1.1 0L5 6l3.7-3.8Z" fill-rule="nonzero"></path></svg></div></button><button aria-haspopup="true" role="menuitem" type="button" tabindex="-1" data-alloy-tabstop="true" unselectable="on" class="tox-mbtn tox-mbtn--select" style="user-select: none; width: 76.0781px;" aria-expanded="false"><span class="tox-mbtn__select-label">Tööriistad</span><div class="tox-mbtn__select-chevron"><svg width="10" height="10" focusable="false"><path d="M8.7 2.2c.3-.3.8-.3 1 0 .4.4.4.9 0 1.2L5.7 7.8c-.3.3-.9.3-1.2 0L.2 3.4a.8.8 0 0 1 0-1.2c.3-.3.8-.3 1.1 0L5 6l3.7-3.8Z" fill-rule="nonzero"></path></svg></div></button><button aria-haspopup="true" role="menuitem" type="button" tabindex="-1" data-alloy-tabstop="true" unselectable="on" class="tox-mbtn tox-mbtn--select" style="user-select: none; width: 47.8281px;" aria-expanded="false"><span class="tox-mbtn__select-label">Tabel</span><div class="tox-mbtn__select-chevron"><svg width="10" height="10" focusable="false"><path d="M8.7 2.2c.3-.3.8-.3 1 0 .4.4.4.9 0 1.2L5.7 7.8c-.3.3-.9.3-1.2 0L.2 3.4a.8.8 0 0 1 0-1.2c.3-.3.8-.3 1.1 0L5 6l3.7-3.8Z" fill-rule="nonzero"></path></svg></div></button><button aria-haspopup="true" role="menuitem" type="button" tabindex="-1" data-alloy-tabstop="true" unselectable="on" class="tox-mbtn tox-mbtn--select" style="user-select: none; width: 36.6562px;" aria-expanded="false"><span class="tox-mbtn__select-label">Abi</span><div class="tox-mbtn__select-chevron"><svg width="10" height="10" focusable="false"><path d="M8.7 2.2c.3-.3.8-.3 1 0 .4.4.4.9 0 1.2L5.7 7.8c-.3.3-.9.3-1.2 0L.2 3.4a.8.8 0 0 1 0-1.2c.3-.3.8-.3 1.1 0L5 6l3.7-3.8Z" fill-rule="nonzero"></path></svg></div></button></div><div role="group" class="tox-toolbar-overlord" aria-disabled="false"><div role="group" class="tox-toolbar__primary"><div title="ajalugu" role="toolbar" data-alloy-tabstop="true" tabindex="-1" class="tox-toolbar__group"><button aria-label="Võta tagasi" data-mce-name="undo" type="button" tabindex="-1" class="tox-tbtn tox-tbtn--disabled" aria-disabled="true" style="width: 34px;"><span class="tox-icon tox-tbtn__icon-wrap"><svg width="24" height="24" focusable="false"><path d="M6.4 8H12c3.7 0 6.2 2 6.8 5.1.6 2.7-.4 5.6-2.3 6.8a1 1 0 0 1-1-1.8c1.1-.6 1.8-2.7 1.4-4.6-.5-2.1-2.1-3.5-4.9-3.5H6.4l3.3 3.3a1 1 0 1 1-1.4 1.4l-5-5a1 1 0 0 1 0-1.4l5-5a1 1 0 0 1 1.4 1.4L6.4 8Z" fill-rule="nonzero"></path></svg></span></button><button aria-label="Tee uuesti" data-mce-name="redo" type="button" tabindex="-1" class="tox-tbtn tox-tbtn--disabled" aria-disabled="true" style="width: 34px;"><span class="tox-icon tox-tbtn__icon-wrap"><svg width="24" height="24" focusable="false"><path d="M17.6 10H12c-2.8 0-4.4 1.4-4.9 3.5-.4 2 .3 4 1.4 4.6a1 1 0 1 1-1 1.8c-2-1.2-2.9-4.1-2.3-6.8.6-3 3-5.1 6.8-5.1h5.6l-3.3-3.3a1 1 0 1 1 1.4-1.4l5 5a1 1 0 0 1 0 1.4l-5 5a1 1 0 0 1-1.4-1.4l3.3-3.3Z" fill-rule="nonzero"></path></svg></span></button></div><div title="vormindamine" role="toolbar" data-alloy-tabstop="true" tabindex="-1" class="tox-toolbar__group"><button aria-label="Rasvane" data-mce-name="bold" type="button" tabindex="-1" class="tox-tbtn" aria-disabled="false" aria-pressed="false" style="width: 34px;"><span class="tox-icon tox-tbtn__icon-wrap"><svg width="24" height="24" focusable="false"><path d="M7.8 19c-.3 0-.5 0-.6-.2l-.2-.5V5.7c0-.2 0-.4.2-.5l.6-.2h5c1.5 0 2.7.3 3.5 1 .7.6 1.1 1.4 1.1 2.5a3 3 0 0 1-.6 1.9c-.4.6-1 1-1.6 1.2.4.1.9.3 1.3.6s.8.7 1 1.2c.4.4.5 1 .5 1.6 0 1.3-.4 2.3-1.3 3-.8.7-2.1 1-3.8 1H7.8Zm5-8.3c.6 0 1.2-.1 1.6-.5.4-.3.6-.7.6-1.3 0-1.1-.8-1.7-2.3-1.7H9.3v3.5h3.4Zm.5 6c.7 0 1.3-.1 1.7-.4.4-.4.6-.9.6-1.5s-.2-1-.7-1.4c-.4-.3-1-.4-2-.4H9.4v3.8h4Z" fill-rule="evenodd"></path></svg></span></button><button aria-label="Kaldkiri" data-mce-name="italic" type="button" tabindex="-1" class="tox-tbtn" aria-disabled="false" aria-pressed="false" style="width: 34px;"><span class="tox-icon tox-tbtn__icon-wrap"><svg width="24" height="24" focusable="false"><path d="m16.7 4.7-.1.9h-.3c-.6 0-1 0-1.4.3-.3.3-.4.6-.5 1.1l-2.1 9.8v.6c0 .5.4.8 1.4.8h.2l-.2.8H8l.2-.8h.2c1.1 0 1.8-.5 2-1.5l2-9.8.1-.5c0-.6-.4-.8-1.4-.8h-.3l.2-.9h5.8Z" fill-rule="evenodd"></path></svg></span></button><button aria-label="Puhasta vorming" data-mce-name="removeformat" type="button" tabindex="-1" class="tox-tbtn" aria-disabled="false" style="width: 34px;"><span class="tox-icon tox-tbtn__icon-wrap"><svg width="24" height="24" focusable="false"><path d="M13.2 6a1 1 0 0 1 0 .2l-2.6 10a1 1 0 0 1-1 .8h-.2a.8.8 0 0 1-.8-1l2.6-10H8a1 1 0 1 1 0-2h9a1 1 0 0 1 0 2h-3.8ZM5 18h7a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Zm13 1.5L16.5 18 15 19.5a.7.7 0 0 1-1-1l1.5-1.5-1.5-1.5a.7.7 0 0 1 1-1l1.5 1.5 1.5-1.5a.7.7 0 0 1 1 1L17.5 17l1.5 1.5a.7.7 0 0 1-1 1Z" fill-rule="evenodd"></path></svg></span></button></div><div title="content" role="toolbar" data-alloy-tabstop="true" tabindex="-1" class="tox-toolbar__group"><button aria-label="Image" data-mce-name="tiny_media_image" type="button" tabindex="-1" class="tox-tbtn" aria-disabled="false" aria-pressed="false" style="width: 34px;"><span class="tox-icon tox-tbtn__icon-wrap"><svg width="24" height="24" focusable="false"><path d="m5 15.7 3.3-3.2c.3-.3.7-.3 1 0L12 15l4.1-4c.3-.4.8-.4 1 0l2 1.9V5H5v10.7ZM5 18V19h3l2.8-2.9-2-2L5 17.9Zm14-3-2.5-2.4-6.4 6.5H19v-4ZM4 3h16c.6 0 1 .4 1 1v16c0 .6-.4 1-1 1H4a1 1 0 0 1-1-1V4c0-.6.4-1 1-1Zm6 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" fill-rule="nonzero"></path></svg></span></button><button aria-label="Multimedia" data-mce-name="tiny_media_video" type="button" tabindex="-1" class="tox-tbtn" aria-disabled="false" aria-pressed="false" style="width: 34px;"><span class="tox-icon tox-tbtn__icon-wrap"><svg width="24" height="24" focusable="false"><path d="M4 3h16c.6 0 1 .4 1 1v16c0 .6-.4 1-1 1H4a1 1 0 0 1-1-1V4c0-.6.4-1 1-1Zm1 2v14h14V5H5Zm4.8 2.6 5.6 4a.5.5 0 0 1 0 .8l-5.6 4A.5.5 0 0 1 9 16V8a.5.5 0 0 1 .8-.4Z" fill-rule="nonzero"></path></svg></span></button><button aria-label="Salvesta audio" data-mce-name="tiny_recordrtc_audio" type="button" tabindex="-1" class="tox-tbtn" aria-disabled="false" style="width: 34px;"><span class="tox-icon tox-tbtn__icon-wrap"><svg data-buttonsource="moodle" width="24" height="24" xmlns="http://www.w3.org/2000/svg" focusable="false">
        <image href="https://moodle.ut.ee/theme/image.php/classic_ut/tiny_recordrtc/1767850292/audio" width="24" height="24"></image>
</svg></span></button><button aria-label="Salvesta video" data-mce-name="tiny_recordrtc_video_context_menu" type="button" tabindex="-1" class="tox-tbtn" aria-disabled="false" style="width: 34px;"><span class="tox-icon tox-tbtn__icon-wrap"><svg data-buttonsource="moodle" width="24" height="24" xmlns="http://www.w3.org/2000/svg" focusable="false">
        <image href="https://moodle.ut.ee/theme/image.php/classic_ut/tiny_recordrtc/1767850292/video" width="24" height="24"></image>
</svg></span></button><button aria-label="Sisesta akordion" data-mce-name="tiny_accordion_accordion" type="button" tabindex="-1" class="tox-tbtn" aria-disabled="false" style="width: 34px;"><span class="tox-icon tox-tbtn__icon-wrap"><svg data-buttonsource="moodle" width="24" height="24" xmlns="http://www.w3.org/2000/svg" focusable="false">
        <image href="https://moodle.ut.ee/theme/image.php/classic_ut/tiny_accordion/1767850292/icon" width="24" height="24"></image>
</svg></span></button><button aria-label="Sisesta hüpikaken" data-mce-name="tiny_popup_popup" type="button" tabindex="-1" class="tox-tbtn" aria-disabled="false" style="width: 34px;"><span class="tox-icon tox-tbtn__icon-wrap"><svg data-buttonsource="moodle" width="24" height="24" xmlns="http://www.w3.org/2000/svg" focusable="false">
        <image href="https://moodle.ut.ee/theme/image.php/classic_ut/tiny_popup/1767850292/icon" width="24" height="24"></image>
</svg></span></button><button aria-label="Link" data-mce-name="tiny_link_link" type="button" tabindex="-1" class="tox-tbtn" aria-disabled="false" aria-pressed="false" style="width: 34px;"><span class="tox-icon tox-tbtn__icon-wrap"><svg width="24" height="24" focusable="false"><path d="M6.2 12.3a1 1 0 0 1 1.4 1.4l-2 2a2 2 0 1 0 2.6 2.8l4.8-4.8a1 1 0 0 0 0-1.4 1 1 0 1 1 1.4-1.3 2.9 2.9 0 0 1 0 4L9.6 20a3.9 3.9 0 0 1-5.5-5.5l2-2Zm11.6-.6a1 1 0 0 1-1.4-1.4l2-2a2 2 0 1 0-2.6-2.8L11 10.3a1 1 0 0 0 0 1.4A1 1 0 1 1 9.6 13a2.9 2.9 0 0 1 0-4L14.4 4a3.9 3.9 0 0 1 5.5 5.5l-2 2Z" fill-rule="nonzero"></path></svg></span></button><button aria-label="Unlink" data-mce-name="tiny_link_unlink" type="button" tabindex="-1" class="tox-tbtn" aria-disabled="false" aria-pressed="false" style="width: 34px;"><span class="tox-icon tox-tbtn__icon-wrap"><svg width="24" height="24" focusable="false"><path d="M6.2 12.3a1 1 0 0 1 1.4 1.4l-2 2a2 2 0 1 0 2.6 2.8l4.8-4.8a1 1 0 0 0 0-1.4 1 1 0 1 1 1.4-1.3 2.9 2.9 0 0 1 0 4L9.6 20a3.9 3.9 0 0 1-5.5-5.5l2-2Zm11.6-.6a1 1 0 0 1-1.4-1.4l2.1-2a2 2 0 1 0-2.7-2.8L11 10.3a1 1 0 0 0 0 1.4A1 1 0 1 1 9.6 13a2.9 2.9 0 0 1 0-4L14.4 4a3.9 3.9 0 0 1 5.5 5.5l-2 2ZM7.6 6.3a.8.8 0 0 1-1 1.1L3.3 4.2a.7.7 0 1 1 1-1l3.2 3.1ZM5.1 8.6a.8.8 0 0 1 0 1.5H3a.8.8 0 0 1 0-1.5H5Zm5-3.5a.8.8 0 0 1-1.5 0V3a.8.8 0 0 1 1.5 0V5Zm6 11.8a.8.8 0 0 1 1-1l3.2 3.2a.8.8 0 0 1-1 1L16 17Zm-2.2 2a.8.8 0 0 1 1.5 0V21a.8.8 0 0 1-1.5 0V19Zm5-3.5a.7.7 0 1 1 0-1.5H21a.8.8 0 0 1 0 1.5H19Z" fill-rule="nonzero"></path></svg></span></button><button aria-label="No auto-link" data-mce-name="tiny_noautolink" type="button" tabindex="-1" class="tox-tbtn" aria-disabled="false" aria-pressed="false" style="width: 34px;"><span class="tox-icon tox-tbtn__icon-wrap"><svg data-buttonsource="moodle" width="24" height="24" xmlns="http://www.w3.org/2000/svg" focusable="false">
        <image href="https://moodle.ut.ee/theme/image.php/classic_ut/tiny_noautolink/1767850292/icon" width="24" height="24"></image>
</svg></span></button><button aria-label="Add Panopto Video" data-mce-name="tiny_panoptoltibutton" type="button" tabindex="-1" class="tox-tbtn" aria-disabled="false" aria-pressed="false" style="width: 34px;"><span class="tox-icon tox-tbtn__icon-wrap"><svg data-buttonsource="moodle" width="24" height="24" xmlns="http://www.w3.org/2000/svg" focusable="false">
        <image href="https://moodle.ut.ee/theme/image.php/classic_ut/tiny_panoptoltibutton/1767850292/icon" width="24" height="24"></image>
</svg></span></button></div><div title="Vaade" role="toolbar" data-alloy-tabstop="true" tabindex="-1" class="tox-toolbar__group"><button aria-label="Täisekraan" data-mce-name="fullscreen" type="button" tabindex="-1" class="tox-tbtn" aria-disabled="false" aria-pressed="false" style="width: 34px;"><span class="tox-icon tox-tbtn__icon-wrap"><svg width="24" height="24" focusable="false"><path d="m15.3 10-1.2-1.3 2.9-3h-2.3a.9.9 0 1 1 0-1.7H19c.5 0 .9.4.9.9v4.4a.9.9 0 1 1-1.8 0V7l-2.9 3Zm0 4 3 3v-2.3a.9.9 0 1 1 1.7 0V19c0 .5-.4.9-.9.9h-4.4a.9.9 0 1 1 0-1.8H17l-3-2.9 1.3-1.2ZM10 15.4l-2.9 3h2.3a.9.9 0 1 1 0 1.7H5a.9.9 0 0 1-.9-.9v-4.4a.9.9 0 1 1 1.8 0V17l2.9-3 1.2 1.3ZM8.7 10 5.7 7v2.3a.9.9 0 0 1-1.7 0V5c0-.5.4-.9.9-.9h4.4a.9.9 0 0 1 0 1.8H7l3 2.9-1.3 1.2Z" fill-rule="nonzero"></path></svg></span></button></div><div title="joondamine" role="toolbar" data-alloy-tabstop="true" tabindex="-1" class="tox-toolbar__group"><button aria-label="Joonda vasakule" data-mce-name="alignleft" type="button" tabindex="-1" class="tox-tbtn" aria-disabled="false" aria-pressed="false" style="width: 34px;"><span class="tox-icon tox-tbtn__icon-wrap"><svg width="24" height="24" focusable="false"><path d="M5 5h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm0 4h8c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm0 8h8c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Zm0-4h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Z" fill-rule="evenodd"></path></svg></span></button><button aria-label="Joonda keskele" data-mce-name="aligncenter" type="button" tabindex="-1" class="tox-tbtn" aria-disabled="false" aria-pressed="false" style="width: 34px;"><span class="tox-icon tox-tbtn__icon-wrap"><svg width="24" height="24" focusable="false"><path d="M5 5h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm3 4h8c.6 0 1 .4 1 1s-.4 1-1 1H8a1 1 0 1 1 0-2Zm0 8h8c.6 0 1 .4 1 1s-.4 1-1 1H8a1 1 0 0 1 0-2Zm-3-4h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Z" fill-rule="evenodd"></path></svg></span></button><button aria-label="Joonda paremale" data-mce-name="alignright" type="button" tabindex="-1" class="tox-tbtn" aria-disabled="false" aria-pressed="false" style="width: 34px;"><span class="tox-icon tox-tbtn__icon-wrap"><svg width="24" height="24" focusable="false"><path d="M5 5h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm6 4h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2Zm0 8h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2Zm-6-4h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Z" fill-rule="evenodd"></path></svg></span></button></div><div title="directionality" role="toolbar" data-alloy-tabstop="true" tabindex="-1" class="tox-toolbar__group"><button aria-label="Vasakult paremale" data-mce-name="ltr" type="button" tabindex="-1" class="tox-tbtn tox-tbtn--enabled" aria-disabled="false" aria-pressed="true" style="width: 34px;"><span class="tox-icon tox-tbtn__icon-wrap"><svg width="24" height="24" focusable="false"><path d="M11 5h7a1 1 0 0 1 0 2h-1v11a1 1 0 0 1-2 0V7h-2v11a1 1 0 0 1-2 0v-6c-.5 0-1 0-1.4-.3A3.4 3.4 0 0 1 7.8 10a3.3 3.3 0 0 1 0-2.8 3.4 3.4 0 0 1 1.8-1.8L11 5ZM4.4 16.2 6.2 15l-1.8-1.2a1 1 0 0 1 1.2-1.6l3 2a1 1 0 0 1 0 1.6l-3 2a1 1 0 1 1-1.2-1.6Z" fill-rule="evenodd"></path></svg></span></button><button aria-label="Paremalt vasakule" data-mce-name="rtl" type="button" tabindex="-1" class="tox-tbtn" aria-disabled="false" aria-pressed="false" style="width: 34px;"><span class="tox-icon tox-tbtn__icon-wrap"><svg width="24" height="24" focusable="false"><path d="M8 5h8v2h-2v12h-2V7h-2v12H8v-7c-.5 0-1 0-1.4-.3A3.4 3.4 0 0 1 4.8 10a3.3 3.3 0 0 1 0-2.8 3.4 3.4 0 0 1 1.8-1.8L8 5Zm12 11.2a1 1 0 1 1-1 1.6l-3-2a1 1 0 0 1 0-1.6l3-2a1 1 0 1 1 1 1.6L18.4 15l1.8 1.2Z" fill-rule="evenodd"></path></svg></span></button></div><div title="taane" role="toolbar" data-alloy-tabstop="true" tabindex="-1" class="tox-toolbar__group"><button aria-label="Vähenda taanet" data-mce-name="outdent" type="button" tabindex="-1" class="tox-tbtn tox-tbtn--disabled" aria-disabled="true" style="width: 34px;"><span class="tox-icon tox-tbtn__icon-wrap"><svg width="24" height="24" focusable="false"><path d="M7 5h12c.6 0 1 .4 1 1s-.4 1-1 1H7a1 1 0 1 1 0-2Zm5 4h7c.6 0 1 .4 1 1s-.4 1-1 1h-7a1 1 0 0 1 0-2Zm0 4h7c.6 0 1 .4 1 1s-.4 1-1 1h-7a1 1 0 0 1 0-2Zm-5 4h12a1 1 0 0 1 0 2H7a1 1 0 0 1 0-2Zm1.6-3.8a1 1 0 0 1-1.2 1.6l-3-2a1 1 0 0 1 0-1.6l3-2a1 1 0 0 1 1.2 1.6L6.8 12l1.8 1.2Z" fill-rule="evenodd"></path></svg></span></button><button aria-label="Suurenda taanet" data-mce-name="indent" type="button" tabindex="-1" class="tox-tbtn" aria-disabled="false" style="width: 34px;"><span class="tox-icon tox-tbtn__icon-wrap"><svg width="24" height="24" focusable="false"><path d="M7 5h12c.6 0 1 .4 1 1s-.4 1-1 1H7a1 1 0 1 1 0-2Zm5 4h7c.6 0 1 .4 1 1s-.4 1-1 1h-7a1 1 0 0 1 0-2Zm0 4h7c.6 0 1 .4 1 1s-.4 1-1 1h-7a1 1 0 0 1 0-2Zm-5 4h12a1 1 0 0 1 0 2H7a1 1 0 0 1 0-2Zm-2.6-3.8L6.2 12l-1.8-1.2a1 1 0 0 1 1.2-1.6l3 2a1 1 0 0 1 0 1.6l-3 2a1 1 0 1 1-1.2-1.6Z" fill-rule="evenodd"></path></svg></span></button></div><div title="lists" role="toolbar" data-alloy-tabstop="true" tabindex="-1" class="tox-toolbar__group"><button aria-label="Järjestamata loend" data-mce-name="bullist" type="button" tabindex="-1" class="tox-tbtn" aria-disabled="false" aria-pressed="false" style="width: 34px;"><span class="tox-icon tox-tbtn__icon-wrap"><svg width="24" height="24" focusable="false"><path d="M11 5h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2Zm0 6h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2Zm0 6h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2ZM4.5 6c0-.4.1-.8.4-1 .3-.4.7-.5 1.1-.5.4 0 .8.1 1 .4.4.3.5.7.5 1.1 0 .4-.1.8-.4 1-.3.4-.7.5-1.1.5-.4 0-.8-.1-1-.4-.4-.3-.5-.7-.5-1.1Zm0 6c0-.4.1-.8.4-1 .3-.4.7-.5 1.1-.5.4 0 .8.1 1 .4.4.3.5.7.5 1.1 0 .4-.1.8-.4 1-.3.4-.7.5-1.1.5-.4 0-.8-.1-1-.4-.4-.3-.5-.7-.5-1.1Zm0 6c0-.4.1-.8.4-1 .3-.4.7-.5 1.1-.5.4 0 .8.1 1 .4.4.3.5.7.5 1.1 0 .4-.1.8-.4 1-.3.4-.7.5-1.1.5-.4 0-.8-.1-1-.4-.4-.3-.5-.7-.5-1.1Z" fill-rule="evenodd"></path></svg></span></button><button aria-label="Järjestatud loend" data-mce-name="numlist" type="button" tabindex="-1" class="tox-tbtn" aria-disabled="false" aria-pressed="false" style="width: 34px;"><span class="tox-icon tox-tbtn__icon-wrap"><svg width="24" height="24" focusable="false"><path d="M10 17h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2Zm0-6h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2Zm0-6h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 1 1 0-2ZM6 4v3.5c0 .3-.2.5-.5.5a.5.5 0 0 1-.5-.5V5h-.5a.5.5 0 0 1 0-1H6Zm-1 8.8.2.2h1.3c.3 0 .5.2.5.5s-.2.5-.5.5H4.9a1 1 0 0 1-.9-1V13c0-.4.3-.8.6-1l1.2-.4.2-.3a.2.2 0 0 0-.2-.2H4.5a.5.5 0 0 1-.5-.5c0-.3.2-.5.5-.5h1.6c.5 0 .9.4.9 1v.1c0 .4-.3.8-.6 1l-1.2.4-.2.3ZM7 17v2c0 .6-.4 1-1 1H4.5a.5.5 0 0 1 0-1h1.2c.2 0 .3-.1.3-.3 0-.2-.1-.3-.3-.3H4.4a.4.4 0 1 1 0-.8h1.3c.2 0 .3-.1.3-.3 0-.2-.1-.3-.3-.3H4.5a.5.5 0 1 1 0-1H6c.6 0 1 .4 1 1Z" fill-rule="evenodd"></path></svg></span></button></div><div title="Täpsem" role="toolbar" data-alloy-tabstop="true" tabindex="-1" class="tox-toolbar__group"><button aria-label="Võrrandiredaktor" data-mce-name="tiny_equation" type="button" tabindex="-1" class="tox-tbtn" aria-disabled="false" aria-pressed="false" style="width: 34px;"><span class="tox-icon tox-tbtn__icon-wrap"><svg data-buttonsource="moodle" width="24" height="24" xmlns="http://www.w3.org/2000/svg" focusable="false">
        <image href="https://moodle.ut.ee/theme/image.php/classic_ut/tiny_equation/1767850292/icon" width="24" height="24"></image>
</svg></span></button></div></div><div role="group" class="tox-toolbar__overflow tox-toolbar__overflow--closed" style="height: 0px;"></div></div><div class="tox-anchorbar"></div></div><div class="tox-sidebar-wrap" style="height: 337.5px;"><div class="tox-edit-area"><iframe id="id_onlinetext_editor_ifr" frameborder="0" allowtransparency="true" title="Rich text area" class="tox-edit-area__iframe" srcdoc="&lt;!DOCTYPE html&gt;&lt;html&gt;&lt;head&gt;&lt;meta http-equiv=&quot;Content-Type&quot; content=&quot;text/html; charset=UTF-8&quot; /&gt;&lt;/head&gt;&lt;body id=&quot;tinymce&quot; class=&quot;mce-content-body &quot; data-id=&quot;id_onlinetext_editor&quot; aria-label=&quot;Rikasteksti ala. Abi saamiseks vajutage ALT-0.&quot;&gt;&lt;br&gt;&lt;/body&gt;&lt;/html&gt;"></iframe></div><div role="presentation" class="tox-sidebar"><div data-alloy-tabstop="true" tabindex="-1" class="tox-sidebar__slider tox-sidebar--sliding-closed" style="width: 0px;"><div class="tox-sidebar__pane-container"></div></div></div></div><div class="tox-bottom-anchorbar"></div></div><div aria-hidden="true" class="tox-view-wrap" style="display: none;"><div class="tox-view-wrap__slot-container"></div></div><div class="tox-statusbar"><div class="tox-statusbar__text-container tox-statusbar__text-container--flex-start"><div role="navigation" data-alloy-tabstop="true" class="tox-statusbar__path" aria-disabled="false"><div data-index="0" role="button" tabindex="-1" class="tox-statusbar__path-item" aria-disabled="false">p</div></div><div class="tox-statusbar__right-container"><button type="button" tabindex="-1" data-alloy-tabstop="true" class="tox-statusbar__wordcount">0 sõna</button><span class="tox-statusbar__branding"><a href="https://www.tiny.cloud/powered-by-tiny?utm_campaign=poweredby&amp;utm_source=tiny&amp;utm_medium=referral&amp;utm_content=v7" rel="noopener" target="_blank" aria-label="Build with TinyMCE" tabindex="-1">Build with <svg height="16" viewBox="0 0 80 16" width="80" xmlns="http://www.w3.org/2000/svg"><g opacity=".8"><path d="m80 3.537v-2.202h-7.976v11.585h7.976v-2.25h-5.474v-2.621h4.812v-2.069h-4.812v-2.443zm-10.647 6.929c-.493.217-1.13.337-1.864.337s-1.276-.156-1.805-.47a3.732 3.732 0 0 1 -1.3-1.298c-.324-.554-.48-1.191-.48-1.877s.156-1.335.48-1.877a3.635 3.635 0 0 1 1.3-1.299 3.466 3.466 0 0 1 1.805-.481c.65 0 .914.06 1.263.18.36.12.698.277.986.47.289.192.578.384.842.6l.12.085v-2.586l-.023-.024c-.385-.35-.855-.614-1.384-.818-.53-.205-1.155-.313-1.877-.313-.721 0-1.6.144-2.333.445a5.773 5.773 0 0 0 -1.937 1.251 5.929 5.929 0 0 0 -1.324 1.9c-.324.735-.48 1.565-.48 2.455s.156 1.72.48 2.454c.325.734.758 1.383 1.324 1.913.553.53 1.215.938 1.937 1.25a6.286 6.286 0 0 0 2.333.434c.819 0 1.384-.108 1.961-.313.59-.216 1.083-.505 1.468-.866l.024-.024v-2.49l-.12.096c-.41.337-.878.626-1.396.866zm-14.869-4.15-4.8-5.04-.024-.025h-.902v11.67h2.502v-6.847l2.827 3.08.385.409.397-.41 2.791-3.067v6.845h2.502v-11.679h-.902l-4.788 5.052z"></path><path clip-rule="evenodd" d="m15.543 5.137c0-3.032-2.466-5.113-4.957-5.137-.36 0-.745.024-1.094.096-.157.024-3.85.758-3.85.758-3.032.602-4.62 2.466-4.704 4.788-.024.89-.024 4.27-.024 4.27.036 3.165 2.406 5.138 5.017 5.126.337 0 1.119-.109 1.287-.145.144-.024.385-.084.746-.144.661-.12 1.684-.325 3.067-.602 2.37-.409 4.103-2.009 4.44-4.33.156-1.023.084-4.692.084-4.692zm-3.213 3.308-2.346.457v2.31l-5.859 1.143v-5.75l2.346-.458v3.441l3.513-.686v-3.44l-3.513.685v-2.297l5.859-1.143v5.75zm20.09-3.296-.083-1.023h-2.13v8.794h2.346v-4.884c0-1.107.95-1.985 2.057-1.997 1.095 0 1.901.89 1.901 1.997v4.884h2.346v-5.245c-.012-2.105-1.588-3.777-3.67-3.765a3.764 3.764 0 0 0 -2.778 1.25l.012-.011zm-6.014-4.102 2.346-.458v2.298l-2.346.457z" fill-rule="evenodd"></path><path d="m28.752 4.126h-2.346v8.794h2.346z"></path><path clip-rule="evenodd" d="m43.777 15.483 4.043-11.357h-2.418l-1.54 4.355-.445 1.324-.36-1.324-1.54-4.355h-2.418l3.151 8.794-1.083 3.08zm-21.028-5.51c0 .722.541 1.034.878 1.034s.638-.048.95-.144l.518 1.708c-.217.145-.879.518-2.13.518a2.565 2.565 0 0 1 -2.562-2.587c-.024-1.082-.024-2.49 0-4.21h-1.54v-2.142h1.54v-1.912l2.346-.458v2.37h2.201v2.142h-2.2v3.693-.012z" fill-rule="evenodd"></path></g></svg></a></span></div></div><div aria-label="Press the Up and Down arrow keys to resize the editor." data-mce-name="resize-handle" data-alloy-tabstop="true" tabindex="-1" class="tox-statusbar__resize-handle"><svg width="10" height="10" focusable="false"><g fill-rule="nonzero"><path d="M8.1 1.1A.5.5 0 1 1 9 2l-7 7A.5.5 0 1 1 1 8l7-7ZM8.1 5.1A.5.5 0 1 1 9 6l-3 3A.5.5 0 1 1 5 8l3-3Z"></path></g></svg></div></div><div aria-hidden="true" class="tox-throbber" style="display: none;"></div></div><div class="tox tox-silver-sink tox-silver-popup-sink tox-tinymce-aux" style="position: relative;"></div>
</div>
<div>
        <input name="onlinetext_editor[format]" id="menuonlinetext_editorformat" type="hidden" value="1">
</div><input type="hidden" name="onlinetext_editor[itemid]" value="577030184"><noscript><div><object type='text/html' data='https://moodle.ut.ee/repository/draftfiles_manager.php?action=browse&amp;env=editor&amp;itemid=577030184&amp;subdirs=0&amp;maxbytes=0&amp;areamaxbytes=-1&amp;maxfiles=-1&amp;ctx_id=960915&amp;course=7161&amp;sesskey=SsQdbNwHyR' height='160' width='600' style='border:1px solid #000'></object></div></noscript></div>
        <div class="form-control-feedback invalid-feedback" id="id_error_onlinetext_editor">

        </div>
    </div>
</div>
		</div></fieldset><div id="fgroup_id_buttonar" class="mb-3 row  fitem femptylabel   " data-groupname="buttonar">
    <div class="col-md-3 col-form-label d-flex pb-0 pe-md-0">

        <div class="form-label-addon d-flex align-items-center align-self-start">

        </div>
    </div>
    <div class="col-md-9 d-flex flex-wrap align-items-start felement" data-fieldtype="group">
            <div class="w-100 m-0 p-0 border-0">
                <div class="d-flex flex-wrap align-items-center">

                    <div class="mb-3  fitem  ">
    <span data-fieldtype="submit">
        <input type="submit" class="btn
                        btn-primary


                    " name="submitbutton" id="id_submitbutton" value="Salvesta muudatused">
    </span>
    <div class="form-control-feedback invalid-feedback" id="id_error_submitbutton">

    </div>
</div>

                    <div class="mb-3  fitem   btn-cancel">
    <span data-fieldtype="submit">
        <input type="submit" class="btn

                        btn-secondary

                    " name="cancel" id="id_cancel" value="Tühista" data-skip-validation="1" data-cancel="1" onclick="skipClientValidation = true; return true;">
    </span>
    <div class="form-control-feedback invalid-feedback" id="id_error_cancel">

    </div>
</div>
                </div>
            </div>
        <div class="form-control-feedback invalid-feedback" id="fgroup_id_error_buttonar">

        </div>
    </div>
</div>
</form></div>`
function getTimeUntilJan24_2026() {
    const now = new Date();
    const targetDate = new Date('2026-01-24T00:00:00');

    const diffMs = targetDate - now;

    if (diffMs <= 0) {
        return { days: 0, hours: 0 };
    }

    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.ceil(totalHours / 24);
    const hours = totalHours % 24;

    return { days, hours };
}

// Example usage:
const { days, hours } = getTimeUntilJan24_2026();
console.log(`${days} days and ${hours} hours remaining`);

if (location.href.includes("view.php?id=7161")){
    const allSpans = document.querySelectorAll("span");
    const span1 = Array.from(allSpans).filter(span=>{return span.textContent.includes("Lõputööde kaitsmisele esitamise tähtaeg 19.01.2026")})[0];
    span1.textContent = "Lõputööde kaitsmisele esitamise tähtaeg 24.01.2026";
    const allPs = document.querySelectorAll("p");
    const p1 = Array.from(allPs).filter(span=>{return span.textContent.includes("Siia postitage lõputöö lõplik PDF-fail")})[0];
    p1.textContent = `Siia postitage lõputöö lõplik PDF-fail. `
}
if (location.href.includes("assign/index.php?id=7161")){
    const allSpans = document.querySelectorAll("td");
    const span1 = Array.from(allSpans).filter(span=>{return span.textContent.includes("19.01.2026 23:59:00")})[0];
    span1.textContent = "24.01.2026 23:59:00";
}
if (location.href.includes("id=1381428")){
const allTr = document.querySelectorAll("tr");
        const trViimati = Array.from(allTr).filter(span=>{return span.textContent.includes("Viimati muudetud")})[0];
trViimati.insertAdjacentHTML("afterend", esitamineHTML);
        const allTd = document.querySelectorAll("td");
    const tdStatus = Array.from(allTd).filter(span=>{return span.textContent.includes("Ühtegi tööd pole veel esitatud")})[0];
    tdStatus.textContent = "Esitatud hindamiseks";
    tdStatus.classList.add("submissionstatussubmitted");
        const tdMuudetud = Array.from(allTd).filter(span=>{return span.textContent==="-"})[0];
    tdMuudetud.textContent = "23.01.2026 21:39:54"
    const allSpans = document.querySelectorAll("span");
    const span1 = Array.from(allSpans).filter(span=>{return span.textContent.includes("Lõputööde kaitsmisele esitamise tähtaeg 19.01.2026")})[0];
    span1.textContent = "Lõputööde kaitsmisele esitamise tähtaeg 24.01.2026";
    const allFonts = document.querySelectorAll("font");
    const font1 = Array.from(allFonts).filter(span=>{return span.textContent.includes("Ülesande tähtajast on möödunud")})[0];
    font1.parentNode.classList.remove("overdue");
    font1.parentNode.classList.add("submissionstatussubmitted");
    font1.style.color="black";
        const allPs = document.querySelectorAll("p");
    const p1 = Array.from(allPs).filter(span=>{return span.textContent.includes("Siia postitage lõputöö lõplik PDF-fail")})[0];
    p1.textContent = `Siia postitage lõputöö lõplik PDF-fail. `
    // const { days, hours } = getTimeUntilJan24_2026();
    font1.textContent = `Töö on esitatud 1 päeva 2 tundi varem`;
    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode(node) {
                // ignore empty / whitespace-only text nodes
                if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;

                // OPTIONAL: ignore text inside certain tags
                const parentTag = node.parentElement?.tagName;
                if (['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(parentTag)) {
                    return NodeFilter.FILTER_REJECT;
                }

                return NodeFilter.FILTER_ACCEPT;
            }
        }
    );

    let node;
    while ((node = walker.nextNode())) {
        if (node.nodeValue.includes(` 19.01.2026 23:59:00`)) {
            node.nodeValue = node.nodeValue.replace(
                '19.01.2026 23:59:00',
                '24.01.2026 23:59:00'
            );
        }
    }
    // document.querySelector("#region-main > div:nth-child(5) > div.submissionstatustable").insertAdjacentHTML("beforeend", buttonHTML);
    // document.querySelector("#single_button6971dd03eb5df22").addEventListener("click", event=>{
    //     event.preventDefault();
    //     document.querySelector("#single_button6971dd03eb5df22").insertAdjacentHTML("afterend", submissionFOrmHTML);
    // })


}


// const string2 = 'Siia postitage lõputöö lõplik PDF-fail DigiDoc4-konteineris, mis on digitaalselt allkirjastatud teie endi ja juhendaja poolt (lihtlitsents peab olema PDF-faili sees ).';
// const allSpans = document.querySelectorAll("span");
// const theSpan = Array.from(allSpans).filter(span => {return span.textContent === 'Lõputöö esitamine kaitsmiseks  Ülesanne'})[0];
// theSpan.parentElement.remove();
// const allPs = document.querySelectorAll("p");
// const theP = Array.from(allPs).filter(span => {return span.textContent === string2})[0];
// theP.remove();