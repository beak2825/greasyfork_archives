// ==UserScript==
// @name         WaniKani Quick Info
// @namespace    WKQI
// @version      0.2
// @description  Shows available information while waiting for the server response
// @author       Ethan
// @include      http*://www.wanikani.com/review/session*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/9814/WaniKani%20Quick%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/9814/WaniKani%20Quick%20Info.meta.js
// ==/UserScript==


function getComponents(vocab){
    //takes in a string and returns an array containing only the kanji characters in the string.
    var components = [];

    for (var c = 0; c < vocab.length; c++){
        if(/^[\u4e00-\u9faf]+$/.test(vocab[c])) {
            components.push(vocab[c]);
        }
    }
    return components; 
}

function doubleKanjiWithFill(charArray, fill){
    //takes an array of kanji, and returns a string array with html filling.
    var htmlArray =[];
    for (var i = 0; i < charArray.length; i++){
        htmlArray.push(charArray[i] + fill + charArray[i]);
    }
    return htmlArray;
}

//Modified WaniKani functions with new features and meaningful names.
if (typeof additionalContent !== 'undefined'){
    console.log(additionalContent);
    additionalContent.itemInfo = function (){

        var regex,htmlify;
        return regex=function(e){
            switch(e){
                case"radical":return/\[(?:radical)\]/gi;
                case"kanji":return/\[(?:kanji)\]/gi;
                case"vocabulary":return/\[(?:vocabulary)\]/gi;
                case"meaning":return/\[(?:meaning)\]/gi;
                case"reading":return/\[(?:reading)\]/gi;
                case"ja":return/\[(?:ja)\]/gi;
                case"closeTagSpan":return/\[\/(?:radical|kanji|vocabulary|meaning|reading|ja)\]/gi
            }
        },
            htmlify=function(t){
                var n,r,i;
                t=t.replace("\r\n","<br><br>"),
                    i=["radical","kanji","vocabulary","meaning","reading","ja","closeTagSpan"];
                for(n in i)
                    r=i[n],
                        t=function(){
                        switch(r){
                            case"ja":return t.replace(regex(r),'<span lang="ja">');
                            case"closeTagSpan":return t.replace(regex(r),"</span>");
                            default:return t.replace(regex(r),'<span class="highlight-'+r+'">')
                        }
                    }();
                return t
            },
                $("#option-item-info").click(function(){
                    var s,e,n,r,i,o,u,loading, loadingImg;
                    s=$("#item-info"),
                        r=$.jStorage.get("currentItem"),
                        o=$.jStorage.get("questionType"),
                        i=r.rad?"r":r.kan?"k":r.voc?"v":void 0;
                    if(s.is(":visible")&&(s.data("question-type")!==o||s.data("id")!==i+r.id)){
                        $("#additional-content-load").hide(),
                            $("#information-offline").hide(),
                            e=$("#item-info-col1"),
                            n=$("#item-info-col2"),
                            loading = "<img height = '40px' src='https://s3.amazonaws.com/s3.wanikani.com/assets/v03/loading-100x100.gif'>";//put crabigator here
                        e.empty(),n.empty();
                        if(r.rad){
                            e.html("<section><h2>Name</h2>"+r.en.join(", ")+'</section><section class="user-synonyms"><h2>User Synonyms</h2>' + r.syn.join("    ") + '</section>'),
                                n.html("<section><h2>Mnemonics</h2>"+loading+'</section><section id="note-meaning"></section>');
                        

                                return u="/json/radical/"+r.id,
                                $.getJSON(u,function(i){
                                    return i.mnemonic=htmlify(i.mnemonic),
                                        e.html("<section><h2>Name</h2>"+i.en+'</section><section class="user-synonyms"><h2>User Synonyms</h2></section>'),
                                        n.html("<section><h2>Mnemonics</h2>"+i.mnemonic+'</section><section id="note-meaning"><h2>Name Note</h2></section>'),
                                        UserSynonyms.load("radical",r.syn.join(),r.id,!0),
                                        Notes.add("radical","meaning",r.id,i.meaning_note,$("#note-meaning")),
                                        $("#all-info").hide(),
                                        //                                    $("#additional-content-load").fadeOut(200),
                                        s.data("id","r"+r.id),
                                        s.data("question-type",o)
                                }
                                         ).fail(function(){return $("#information-offline").show(),s.show()});
                        }
                        if(r.kan){
                            var l=r.emph==="onyomi"?r.on:r.kun;
                            e.html('<section id="item-info-meaning"><h2>Meanings</h2>'+r.en.join(", ")+'</section><section class="user-synonyms"><h2>User Synonyms</h2>' + r.syn.join("    ") + '</section><section id="item-info-reading"><h2>Important Readings ('+r.emph+")</h2>"+l+'</section><section id="related-items"><h2>Radical Combination</h2>'+loading+"</section>");
                            n.html('<section id="item-info-meaning-mnemonic"><h2>Meaning Mnemonic</h2>'+loading+'</section><section id="note-meaning"></section><section id="item-info-reading-mnemonic"><h2>Reading Mnemonic</h2>'+loading+'</section><section id="note-reading"></section>'),
                                o==="meaning"?$("#item-info-reading, #item-info-reading-mnemonic, #note-reading").hide():$("#item-info-meaning, #item-info-meaning-mnemonic, #note-meaning, .user-synonyms").hide();
                        


                            u="/json/kanji/"+r.id;
                            return $.getJSON(u,function(i){
                                var u,a,f,c,h;

                                i.meaning_mnemonic=htmlify(i.meaning_mnemonic),
                                    i.reading_mnemonic=htmlify(i.reading_mnemonic),
                                    i.meaning_hint=htmlify(i.meaning_hint),
                                    i.reading_hint=htmlify(i.reading_hint),
                                    c="",
                                    h=i.related;
                                for(f in h)a=h[f],
                                    u=a.custom_font_name?'<i class="radical-'+a.custom_font_name+'"></i>':/.png/i.test(a.rad)?'<img src="https://s3.amazonaws.com/s3.wanikani.com/images/radicals/'+a.rad+'">':a.rad,
                                    c+='<li><a title="View radical information page" target="_blank" href="/radicals/'+a.slug+'"><span class="radical" lang="ja">'+u+"</span> "+a.en.split(",")[0]+"</li>";
                                return e.html('<section id="item-info-meaning"><h2>Meanings</h2>'+i.en+'</section><section class="user-synonyms"><h2>User Synonyms</h2></section><section id="item-info-reading"><h2>Important Readings ('+r.emph+")</h2>"+l+'</section><section id="related-items"><h2>Radical Combination</h2><ul class="radical">'+c+"</ul></section>"),
                                    n.html('<section id="item-info-meaning-mnemonic"><h2>Meaning Mnemonic</h2>'+i.meaning_mnemonic+'<blockquote><h3><i class="icon-question-sign"></i> HINT</h3>'+i.meaning_hint+'</blockquote></section><section id="note-meaning"><h2>Meaning Note</h2></section><section id="item-info-reading-mnemonic"><h2>Reading Mnemonic</h2>'+i.reading_mnemonic+'<blockquote><h3><i class="icon-question-sign"></i> HINT</h3>'+i.reading_hint+'</blockquote></section><section id="note-reading"><h2>Reading Note</h2></section>'),
                                    Notes.add("kanji","meaning",r.id,i.meaning_note,$("#note-meaning")),
                                    Notes.add("kanji","reading",r.id,i.reading_note,$("#note-reading")),
                                    UserSynonyms.load("kanji",r.syn.join(),r.id,!0),
                                    o==="meaning"?$("#item-info-reading, #item-info-reading-mnemonic, #note-reading")
                                .hide():$("#item-info-meaning, #item-info-meaning-mnemonic, #note-meaning, .user-synonyms")
                                .hide(),$("#all-info")
                                .show(),//$("#additional-content-load")
                                    // .fadeOut(200),
                                    s.data("id","k"+r.id),
                                    s.data("question-type",o)
                            }).fail(function(){return $("#information-offline").show(),s.show()});
                        }
                        if(r.voc){
                            e.html('<section id="item-info-meaning"><h2>Meanings</h2>'+r.en.join(", ")+'</section><section class="user-synonyms"><h2>User Synonyms</h2>' + r.syn.join("    ") +'</section><section id="item-info-reading"><h2>Reading</h2>'+r.kana.join(", ")+'</section><section id="part-of-speech"><h2>Part of Speech</h2>'+loading+'</section><section id="related-items"><h2>Related Kanji</h2><ul class="kanji"><li><a title="View kanji information page" target="_blank" href="/kanji/' + doubleKanjiWithFill(getComponents(r.voc), '"><span class="kanji" lang="ja">').join('</span></a></li><li><a title="View kanji information page" target="_blank" href="/kanji/') + '</li></ul></section>');//Remember you can get the kanji components from the word
                            n.html('<section id="item-info-meaning-mnemonic"><h2>Meaning Explanation</h2>'+loading+'</section><section id="note-meaning"></section><section id="item-info-reading-mnemonic"><h2>Reading Explanation</h2>'+loading+'</section><section id="note-reading"></section><section id="item-info-context-sentences"><h2>Context Sentence</h2>'+loading+"</section>"),
                                o==="meaning"?$("#item-info-reading, #item-info-reading-mnemonic, #note-reading").hide():$("#item-info-meaning, #item-info-meaning-mnemonic, #note-meaning, .user-synonyms").hide();
                        
                            return u="/json/vocabulary/"+r.id,
                                $.getJSON(u,function(i){
                                    var u,a,f,l,c;
                                    i.meaning_explanation=htmlify(i.meaning_explanation),
                                        i.reading_explanation=htmlify(i.reading_explanation),
                                        l="",
                                        c=i.related;
                                    for(f in c)a=c[f],
                                        l+='<li><a title="View kanji information page" target="_blank" href="/kanji/'+a.slug+'"><span class="kanji" lang="ja">'+a.kan+"</span> "+a.en+"</a></li>";
                                    return u=i.sentences.length===0?"<p>N/A</p>":"<p>"+i.sentences[0][0]+"</p><p>"+i.sentences[0][1]+"</p>",
                                        e.html('<section id="item-info-meaning"><h2>Meanings</h2>'+i.en+'</section><section class="user-synonyms"><h2>User Synonyms</h2></section><section id="item-info-reading"><h2>Reading</h2>'+i.kana+'</section><section id="part-of-speech"><h2>Part of Speech</h2>'+i.part_of_speech+'</section><section id="related-items"><h2>Related Kanji</h2><ul class="kanji">'+l+"</ul></section>"),
                                        n.html('<section id="item-info-meaning-mnemonic"><h2>Meaning Explanation</h2>'+i.meaning_explanation+'</section><section id="note-meaning"><h2>Meaning Note</h2></section><section id="item-info-reading-mnemonic"><h2>Reading Explanation</h2>'+i.reading_explanation+'</section><section id="note-reading"><h2>Reading Note</h2></section><section id="item-info-context-sentences"><h2>Context Sentence</h2>'+u+"</section>"),
                                        Notes.add("vocabulary","meaning",r.id,i.meaning_note,$("#note-meaning")),
                                        Notes.add("vocabulary","reading",r.id,i.reading_note,$("#note-reading")),
                                        UserSynonyms.load("vocabulary",r.syn.join(),r.id,!0),
                                        o==="meaning"?$("#item-info-reading, #item-info-reading-mnemonic, #note-reading").hide():$("#item-info-meaning, #item-info-meaning-mnemonic, #note-meaning, .user-synonyms").hide(),
                                        $("#all-info").show(),
                                        //  alert("stop"),
                                        //$("#additional-content-load").fadeOut(200),
                                        s.data("id","v"+r.id),
                                        s.data("question-type",o)}).fail(function(){return $("#information-offline").show(),s.show()})
                        }
                    }
                });
    }
}else{
    console.log("WKQI: additionalContent object not found");
}
additionalContent.itemInfo();