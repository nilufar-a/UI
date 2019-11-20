
$(document).ready(function () { Main(); });

function Main() {
	var VC = new ViewControl();
	var board = new GameBoard(64, 64, VC);
	var list = [{ Test: 'text 1' }, { Test: '2nd text' }, { Test: 'third example' }];


	//==================================================================================================
	//===================TESTING AND DEMONSTRATION======================================================



	console.log(VC);
	VC.DisplayList(list, "test_elem");
	VC.ChangeView("game");
	$.getJSON("./exampleJsonFiles/gameState.json", function (json) {
		console.log(json); // this will show the info it in firebug console
		board.LoadState(json);
	});
}
