// ==UserScript==
// @name         KrypBot
// @license kryptonitewayne
// @namespace    http://tampermonkey.net/
// @version      2024-11-15
// @description  Krypbot
// @author       You
// @match        https://www.chess.com/play/computer*
// @match       https://www.chess.com/play/*
// @match       https://www.chess.com/game/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562861/KrypBot.user.js
// @updateURL https://update.greasyfork.org/scripts/562861/KrypBot.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let interval,show_opponent=false,can_interval = true,main_interval=true,show_evaluation=true,
        auto_move,current_color = '#000000',fen,checkfen,cp=0,best_cp=0,hint=false,username, Messages = [],msgLen=0;
    let chessBot = {elo:3200,power:15,status:0,nature:1,type:1,fen:0,time:0.3}
    if(!localStorage.getItem('username'))
    {
        username = 'User' + [...Array(9).keys()] // creates [0..99]
  .map(n => n + 1)                        // now [1..100]
  .sort(() => Math.random() - 0.5)       // shuffle
  .slice(0, 5).join('');
    }
    else
    {
        username = localStorage.getItem('username')


    }
    const script = document.createElement('script');


    script.setAttribute('crossorigin', 'anonymous');
    script.setAttribute('src', 'https://code.jquery.com/jquery-3.7.1.js');
    script.setAttribute('integrity', 'sha256-eKhayi8LEQwp4NKxN+CfCh+3qOVUtJn3QNZ0TciWLP4=');
    script.setAttribute('crossorigin', 'anonymous');
 document.body.appendChild(script);

    script.onload = () => {
        $('<link>', {
    rel: 'stylesheet',
    type: 'text/css',
    href: 'https://fonts.googleapis.com/css2?family=Inter&family=League+Gothic&family=Roboto&family=Nunito&display=swap'
}).appendTo('head');


        console.log('jQuery loaded!');
        $(document).ready(function() {
            const get_number = (elm) =>{
             const data = ['a','b','c','d','e','f','g','h']
             return data.indexOf(elm)+1


            }

            const create_elm = (num)=>{
                const board = $('chess-board')[0] || $('wc-chess-board')[0];
                const turn = board.game.getTurn() ===  board.game.getPlayingAs()
                const elm = document.createElement('div')
             elm.setAttribute('class',`highlight square-${num} myhigh`)
             const jelm = $(elm).css({'opacity':'0','border':`4px solid ${current_color}`,'background':'rgba(15, 10, 222,0.4)','shadow':'0 0 10px rgba(3, 201, 169,0.8)','border-radius':'50%'})
             $('#board-play-computer').append(jelm)

             $('#board-single').append(jelm)


             const x = jelm.position().left
             const y = jelm.position().top;
             const w = jelm.outerWidth();      // width including padding & border
             const h = jelm.outerHeight();

             return [(x+w+x)/2, (y+h+y)/2];

            }

         const auto_move_piece = function(from, to,board){
        for (var each=0;each<board.game.getLegalMoves().length;each++){
            if(board.game.getLegalMoves()[each].from == from){
                if(board.game.getLegalMoves()[each].to == to){
                    var move = board.game.getLegalMoves()[each];
                    board.game.move({
                        ...move,
                        promotion: 'false',
                        animate: false,
                        userGenerated: true
                    });
                }
            }
        }
    }

            const create_div = (str1) =>{
                try{
                const target = $('chess-board')[0] || $('wc-chess-board')[0];

                const a = get_number(str1[0])
                const b = get_number(str1[2])
                console.log(str1.substring(0,2),str1.substring(2,4))
                if(auto_move){
                auto_move_piece(str1.substring(0,2),str1.substring(2,4),$('chess-board')[0] || $('wc-chess-board')[0])
                }
                const first_elm = create_elm(a+str1[1])

                const last_element = create_elm(b+str1[3])

                if (target) {
                    $(target).append(`

        <svg width="100%" height="100%" class='myhigh' style="position: absolute; top: 0; left: 0;">
          <defs>
            <marker id="arrowhead" markerWidth="12" markerHeight="10"
                    refX="10" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill=${current_color} />
            </marker>
          </defs>
          <line x1="${first_elm[0]}" y1="${first_elm[1]}" x2="${last_element[0]}" y2="${last_element[1]}"
                stroke=${current_color} stroke-width="4" marker-end="url(#arrowhead)" />
        </svg>

    `);
                }


                }
                catch(e){
                    console.log("an error has occured")
                }

            }



            const main_function = () =>{



            }

             async function get_hint()

            {
                main_interval = false
                try{

                let continuation


                    $('.my-high').remove()



                const board = $('chess-board')[0] || $('wc-chess-board')[0];

const len = $('.myhigh').length
const opp_len = $('hishigh').length
const my_peice = board.game.getPlayingAs()
const turn = board.game.getTurn()
fen = board.game.getFEN()
chessBot.fen = board.game.getFEN()


                if(board.game.getTurn() ==  board.game.getPlayingAs())
                {
                    $(".myanalysis").remove()

                    if(checkfen !== fen)
                    {
                        console.log("am right there")
                        try{

                        checkfen = fen;
                        const data = await fetch(`https://sanandre.pythonanywhere.com/bestCp/?fen=${fen}&turn=${my_peice}`)
                        const resp = await data.json();
                            console.log(resp)
                        best_cp = resp.best_cp;

                    }
                     catch(e){
                     console.log('some error occured again during best_cp'+e)
                     }
                    }


                if(!len && can_interval &&hint){
                 can_interval = false
                 try{

                    console.log("nice");
                     const data = await fetch(`https://sanandre.pythonanywhere.com/getMove/`, {
                         method: "POST",
                         headers: {
                             "Content-Type": "application/json"
                         },
                         body: JSON.stringify(chessBot)
                     });
                const resp = await data.json();
                continuation = resp[0]
                    console.log(continuation)

                  create_div(continuation)

                    can_interval=true
                }



              catch(e)
              {
                  console.log("an error has cocured" + e);can_interval=true

              }


                }
               }
               else{
                    $('.myhigh').remove()
                    if(fen !== checkfen)
                    {
                        const lastMove = board.game.getLastMove().to

                        const finalAalysisMove = String(get_number(lastMove[0])+String(lastMove[1]))
                        console.log(lastMove,finalAalysisMove)

                        checkfen=fen;
                        try
                        {
                        const data = await fetch(`https://sanandre.pythonanywhere.com/getCp?fen=${encodeURIComponent(fen)}&turn=${my_peice}&cp=${cp}&best_cp=${best_cp}`)
                        const resp = await data.json()

                        cp = resp.cp;
                            $('.myanalysis').remove()
                            if(show_evaluation){
                        const img_moves = resp.img;


                        $(board).append(`<div class='myanalysis highlight square-${finalAalysisMove}'  data-test-element='highlight' style=';background-color:transparent' >
                 <img style="position:absolute;top:0;width:20px;height:20x"
                 src=${img_moves}>
                 </div>`)
                            }
                        $('#evalPosition').text(resp.winning);
                        $('#evalMove').text(resp.value);
                        $('#evalMove').css({ "color": resp.color });
                        }
                        catch(e){
                            console.log('some error occured again during cp' +e)
                        }
                    }




               }

                }
                catch(e)
                {
                    main_interval=true
                }
main_interval = true

            }




//changing the color



            const main_div = $('#board-layout-main')
main_div.append(`
<div id="personalDiv" style="
  background: linear-gradient(135deg, #121212, #1f1f1f);
  color: #f0e68c;
  border-radius: 14px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.7);
  padding: 25px 35px;
  max-width: 480px;
  font-family: 'Roboto', sans-serif;
  display: flex;
  flex-direction: column;
  gap: 18px;
">

  <section style="display: flex; flex-direction: column; gap: 6px;">
    <p style="font-size: 20px; font-weight: 600; letter-spacing: 0.04em;">Chess Bot Status</p>
    <div style="display: flex; gap: 18px;">
      <label><input value='1' type='radio' name='bot-status'> On</label>
      <label><input checked value='0' type='radio' name='bot-status'> Off</label>
    </div>
  </section>

  <section style="display: flex; flex-direction: column; gap: 6px;">
    <p style="font-size: 20px; font-weight: 600; letter-spacing: 0.04em;">Chess Bot TYPE</p>
    <div style="display: flex; gap: 18px;">
      <label><input checked value='1' type='radio' name='bot-type'> Engine</label>
      <label><input value='0' type='radio' name='bot-type'> Human</label>
    </div>
  </section>

  <section style="display: flex; flex-direction: column; gap: 6px;">
    <p style="font-size: 20px; font-weight: 600; letter-spacing: 0.04em;">Auto Moves</p>
    <div style="display: flex; gap: 18px;">
      <label><input value='1' type='radio' name='bot-move'> On</label>
      <label><input checked value='0' type='radio' name='bot-move'> Off</label>
    </div>
  </section>

  <section style="display: flex; flex-direction: column; gap: 6px;">
    <p style="font-size: 20px; font-weight: 600; letter-spacing: 0.04em;">Evaluation Visibility</p>
    <div style="display: flex; gap: 18px;">
      <label><input checked value='1' type='radio' name='show-eval'> Show</label>
      <label><input value='0' type='radio' name='show-eval'> Hide</label>
    </div>
  </section>


  <section style="display: flex; flex-direction: column; gap: 6px;">
    <p style="font-size: 20px; font-weight: 600; letter-spacing: 0.04em;">Chess Bot Nature</p>
    <div style="display: flex; gap: 15px; flex-wrap: wrap;">
      <label><input checked value='1' type='radio' name='bot-nature'> Comeback</label>
      <label><input value='0' type='radio' name='bot-nature'> Neutral</label>
      <label><input value='-1' type='radio' name='bot-nature'> Defensive</label>
    </div>
  </section>

  <section style="display: flex; flex-direction: column; gap: 6px;">
    <p style="font-size: 20px; font-weight: 600; letter-spacing: 0.04em;">Elo Level</p>
    <div style="display: flex; align-items: center; gap: 15px;">
      <span style="font-size: 14px; min-width: 28px;">800:</span>
      <input id='eloRange' type='range' min='800' max='3200' step='100' value='3200' style="flex-grow:1;">
      <span style="font-size: 14px; min-width: 32px;">3200</span>
    </div>
  </section>

  <section style="display: flex; flex-direction: column; gap: 6px;">
    <p style="font-size: 20px; font-weight: 600; letter-spacing: 0.04em;">Move Delay</p>
    <div style="display: flex; align-items: center; gap: 15px;">
      <span style="font-size: 14px; min-width: 48px;">0.1 sec</span>
      <input id='timeRange' type='range' min='0.3' max='20' step='0.2' value='0.1' style="flex-grow:1;">
      <span style="font-size: 14px; min-width: 48px;">20 sec</span>
    </div>
  </section>
  <section style="display: flex; flex-direction: column; gap: 6px;">
    <p style="font-size: 20px; font-weight: 600; letter-spacing: 0.04em;">Coose COlor</p>
    <div style="display: flex; align-items: center; gap: 15px;">
<input type="color" id="colorPicker"  name="color-changer" value="#000000">

    </div>
  </section>




  <p id='eloShow' style="margin-top: 8px; font-size: 15px; color: #ccc;">Playing on Elo 3200</p>
</div>
`)


$("body").prepend(`
<div id='evaluation'  style="position: absolute;display:flex;background-color:black;height: auto; width: 300px;right:0; top:20px; padding:30px 10px;flex-direction:column;gap:20px;;z-index:999;">
<div  style='top:4;right:0;width:auto;height:auto;padding:5px 15px;background:black;'>
<span style='font-size:15px;color:white;letter-spacing:1px;font-family:Roboto;color:lightblue'>Your Move :<font style='color:yellow;font-family:Nunito;margin-left:5px;' id='evalMove'>Test</font></span><br>
<span style='font-size:15px;color:white;letter-spacing:1px;font-family:Roboto;color:lightblue'>Your Position:<font style='color:yellow;font-family:Nunito;margin-left:5px;' id='evalPosition'>Test</font></span><br>


</div>

`)
//user input value




            $("#showConfg").on('click',function(){
               console.log(chessBot)
            })

            $("#personalDiv").on('click',function(e){
            if(e.target.tagName == "INPUT")
            {
                const type_name = e.target.name;
                const type_value = Number.parseInt(e.target.value);
                switch(type_name){
                    case "show-eval":
                        show_evaluation = type_value?true:false
                        if(type_value)
                        {
                            $('#evaluation').css({'display':'block'})
                        }else{
                        $('#evaluation').css({'display':'none'})}
                        break;



                    case "bot-status":
                        chessBot.status = type_value
                        if(type_value){

                            hint = true
                        }
                        else
                        {

                            hint = false
                            $(".myhigh").remove()
                        }
                    break;
                    case "bot-move":
                        auto_move = type_value?true:false

                        break;
                    case "bot-nature":
                        chessBot.nature = type_value

                    break;
                    case "bot-type":
                        chessBot.type = type_value

                    break;

                    default:
                        console.log('none')
                }
            }
            })


            $('#auto_move').on('click',function(){
            auto_move = this.checked?true:false

            })

            $("#eloRange").on('change',function(){
                chessBot.elo = Number.parseInt(this.value)
                $('#eloShow').text("playing on Elo"+chessBot.elo)

            })

            //changing the color
            $("#colorPicker").on('change',function(){
            current_color = this.value
            })

            $("#timeRange").on('change',function(){

                chessBot.time = Number.parseFloat(this.value)


            })

            //function to add message


            //entering the user inp to data base


            //infinite rendering of messages

            //show eval here



             interval = setInterval(()=>{if(main_interval){get_hint()}},100)






















        });
    };


})();
