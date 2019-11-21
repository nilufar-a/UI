$(document).ready(function() { Main(); });
var VC
var board

function Main() {
    VC = new ViewControl();
    //board = new GameBoard(24, 24, VC);
    board = new EditorBoard(24, 24, VC);
    var list = [{ Test: 'text 1' }, { Test: '2nd text' }, { Test: 'third example' }];


    //==================================================================================================
    //===================TESTING AND DEMONSTRATION======================================================



    console.log(VC);
    VC.DisplayList(list, "test_elem");
    // VC.ChangeView("editor");
    VC.ChangeView("main_menu");
    $.getJSON("./exampleJsonFiles/gameState.json", function(json) {
        console.log(json); // this will show the info it in firebug console
        board.LoadState(json);
    });
}