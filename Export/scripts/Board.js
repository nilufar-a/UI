
var trailTest = [{ x: 5, y: 5 }, { x: 6, y: 5 }, { x: 7, y: 5 }, { x: 8, y: 5 }, { x: 8, y: 6 }, { x: 8, y: 7 }, { x: 8, y: 8 }, { x: 7, y: 8 }, { x: 6, y: 8 }, { x: 5, y: 8 }, { x: 5, y: 9 }]


class Board {
	constructor(width, height, VC) {
		this.boardDims = { width: width, height: height };
		this.state = [];
		this.BuildBoard($("#game-board"));
		VC.SubscribreResize(this.resizeAction.bind(this));

		this.drawTrail(trailTest);
	}

	BuildBoard(board) {
		var ret = "";
		for (let r = 0; r < this.boardDims.height; r++) {
			ret += '<tr class="board_row">';
			this.state[r] = [];
			for (let i = 0; i < this.boardDims.width; i++) {
				ret += '<td class="board_cell" id="bc_x' + i + 'y' + r + '" ></td>'
				this.state[r][i] = "";
			}
			ret += '</tr>'
		}
		board.html(ret);
		this.resizeAction();
	}

	drawTrail(trail) {
		let previus;
		let previus2;
		trail.forEach(element => {
			if (previus != undefined) this.state[previus.y][previus.x] = this.getTrailChar(previus2, previus, element);
			previus2 = previus;
			previus = element;
		});
		this.state[previus.y][previus.x] = this.getTrailChar(previus2, previus, undefined);
		this.synchState();
	}

	synchState() {
		for (let r = 0; r < this.boardDims.height; r++) {
			for (let i = 0; i < this.boardDims.width; i++) {
				$('#bc_x' + i + 'y' + r).text(this.state[r][i]);
			}
		}
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
	//previus and mext are disguised as 
	getTrailChar(previus, current, next) {
		let previus_d;
		let next_d;
		if (previus != undefined) {
			if (previus.x - current.x == 0 && current.y - previus.y == 1) previus_d = 0
			else if (previus.x - current.x == 0 && current.y - previus.y == -1) previus_d = 2;
			else if (previus.y - current.y == 0 && current.x - previus.x == 1) previus_d = 3;
			else if (previus.y - current.y == 0 && current.x - previus.x == -1) previus_d = 1;
			else Console.exception("getTrailChar invalid parameters: (previus)" + JSON.stringify(previus) + ', ' + JSON.stringify(current) + ', ' + JSON.stringify(next));
		}
		if (next != undefined) {
			if (next.x - current.x == 0 && current.y - next.y == 1) next_d = 0
			else if (next.x - current.x == 0 && current.y - next.y == -1) next_d = 2;
			else if (next.y - current.y == 0 && current.x - next.x == 1) next_d = 3;
			else if (next.y - current.y == 0 && current.x - next.x == -1) next_d = 1;
			else Console.exception("getTrailChar invalid parameters (next): " + JSON.stringify(previus) + ', ' + JSON.stringify(current) + ', ' + JSON.stringify(next));
		}
		if (previus_d == undefined) previus_d = (next_d + 2) % 4;
		if (next_d == undefined) next_d = (previus_d + 2) % 4;
		if (next_d == undefined) Console.exception("getTrailChar invalid parameters (all): " + JSON.stringify(previus) + ', ' + JSON.stringify(current) + ', ' + JSON.stringify(next));

		if ((previus_d == 0 && next_d == 2) || (previus_d == 2 && next_d == 0)) return "V" //vertical
		if ((previus_d == 1 && next_d == 3) || (previus_d == 3 && next_d == 1)) return "H" //horizontal
		if ((previus_d == 0 && next_d == 1) || (previus_d == 1 && next_d == 0)) return "tr" //top+right
		if ((previus_d == 1 && next_d == 2) || (previus_d == 2 && next_d == 1)) return "br" //bottom+right
		if ((previus_d == 2 && next_d == 3) || (previus_d == 3 && next_d == 2)) return "bl" //bottom+left
		if ((previus_d == 3 && next_d == 0) || (previus_d == 0 && next_d == 3)) return "tl" //top+left
		return previus_d + "" + next_d;
	}
}

