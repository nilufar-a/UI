
class Board {
	constructor(width, height, VC) {
		this.boardDims = { width: width, height: height };
		this.BuildBoards();
		VC.SubscribreResize(this.resizeAction.bind(this));
	}

	BuildBoards() {
		let ret = "";
		for (let r = 0; r < this.boardDims.height; r++) {
			ret += '<tr class="board_row">';
			for (let i = 0; i < this.boardDims.width; i++) {
				ret += '<td class="board_cell" id="bc_x' + i + 'y' + r + '" >&#x2501</td>'
			}
			ret += '</tr>'
		}
		$(".board_table").html(ret);
		this.resizeAction();
	}

	resizeAction() {

		let cellDim = (window.innerHeight / this.boardDims.height) * 0.8;

		let board_cell =
			".board_cell{\n" +
			"width: " + cellDim + "px;\n" +
			"font-size: " + (cellDim * 1) + "px;\n" +
			"line-height: " + cellDim + "px;\n" +
			"height: " + cellDim + "px;\n" +
			"}";
		$("#board_styles").html(board_cell);
	}
}

