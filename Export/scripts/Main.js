$(document).ready(function () { Main(); });
var VC;
var GB;
var Acc;

function Main() {
    VC = new ViewControl();
    Acc = new Account();
    Acc.RegisterToken("Token");
    GB = new GameBoard(24, 24, VC, Acc);
    //GB = new EditorBoard(VC, Acc);
    var list = [{ Test: 'text 1' }, { Test: '2nd text' }, { Test: 'third example' }];

    //this is how you add a token to an object.
    //console.log(Acc.Sign({ content: "stuff" }));

    //==================================================================================================
    //===================TESTING AND DEMONSTRATION======================================================



    VC.DisplayList(list, "test_elem");
    VC.ChangeView("game");
    $.getJSON("./exampleJsonFiles/gameState.json", function (json) {
        GB.LoadState(json);
        GB.StartGame(0)
    });

}
