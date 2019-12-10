$(document).ready(function () { Main(); });
var VC;
var GB;
var Acc;

function Main() {
    VC = new ViewControl();
    Acc = new Account();
    VC.ChangeView("login_page");

    $("#save_token_btn").click(function () {
        Acc.RegisterToken($("#token_input").val());
    });
    $("#goto_game_btn").click(function () {
        VC.ChangeView("game");
        GB = new GameBoard(24, 24, VC, Acc);
        GB.StartGame($("#game_id_input").val(), 0);
    });
    $("#goto_editor_btn").click(function () {
        VC.ChangeView("editor");
        GB = new EditorBoard(VC, Acc);
    });
    var list = [{ Test: 'text 1' }, { Test: '2nd text' }, { Test: 'third example' }];
    //==================================================================================================
    //===================TESTING AND DEMONSTRATION======================================================

    $.getJSON("./exampleJsonFiles/gameState.json", function (json) {
        //GB.LoadState(json);
        //GB.StartGame(0)
    });

}


