$(document).ready(function () { Main(); });
var VC;
var GB;
var Acc;

function Main() {
    VC = new ViewControl();
    Acc = new Account();
    Acc.RegisterToken("Token");
    GB = new GameBoard(24, 24, VC, Acc);
    //board = new EditorBoard(24, 24, VC);
    var list = [{ Test: 'text 1' }, { Test: '2nd text' }, { Test: 'third example' }];

    //this is how you add a token to an object.
    console.log(Acc.Sign({ content: "stuff" }));

    //==================================================================================================
    //===================TESTING AND DEMONSTRATION======================================================



    console.log(VC);
    VC.DisplayList(list, "test_elem");
    VC.ChangeView("game");
    $.getJSON("./exampleJsonFiles/gameState.json", function (json) {
        console.log(json);
        GB.LoadState(json);
    });
}
