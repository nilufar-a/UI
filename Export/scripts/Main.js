
$(document).ready(function () { Main(); });

function Main() {
	var VC = new ViewControl();
	var board = new Board(64, 64, VC);
	var list = [{ Test: 'text 1' }, { Test: '2nd text' }, { Test: 'third example' }];
	console.log(VC);
	VC.DisplayList(list, "test_elem");
	VC.ChangeView("game");
}