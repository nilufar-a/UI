
//var trailTest = [{ x: 5, y: 5 }, { x: 6, y: 5 }, { x: 7, y: 5 }, { x: 8, y: 5 }, { x: 8, y: 6 }, { x: 8, y: 7 }, { x: 8, y: 8 }, { x: 7, y: 8 }, { x: 6, y: 8 }, { x: 5, y: 8 }, { x: 5, y: 9 }]


class Board {
	constructor(width, height, VC) {
		this.boardDims = { width: width, height: height };
		this.state = [];
		this.BuildBoard($("#game-board"));
		VC.SubscribreResize(this.resizeAction.bind(this));
	}

	BuildBoard(board) {
		var ret = "";
		for (let r = 0; r < this.boardDims.height; r++) {
			ret += '<tr class="board_row">';
			this.state[r] = [];
			for (let i = 0; i < this.boardDims.width; i++) {
				ret += '<td class="board_cell" id="bc_x' + i + 'y' + r + '" ></td>'
				this.state[r][i] = {};
			}
			ret += '</tr>'
		}
		board.html(ret);
		this.resizeAction();
	}

	LoadState(state, synchState = true) {
		state.map.obstacles.forEach(obstacle => {
			this.state[obstacle.y][obstacle.x].char = "X"; // TODO extract mapping
		});
		state.map["power-ups"].forEach(boost => {
			this.state[boost.y][boost.x].char = "B"; // TODO extract mapping
		});
		state.players.forEach(player => {
			this.drawPlayer(player.tracer, player.headPosition, player.color);
		});
		if (synchState) this.SynchState();
	}

	SynchState() {
		for (let r = 0; r < this.boardDims.height; r++) {
			for (let i = 0; i < this.boardDims.width; i++) {
				if (this.state[r][i] != undefined) {
					let target = $('#bc_x' + i + 'y' + r);
					if (this.state[r][i].char != undefined) target.text(this.state[r][i].char);
					if (this.state[r][i].color != undefined) target.css('color', this.state[r][i].color);
				}
			}
		}
	}

	drawPlayer(trail, player, color) {
		let previus;
		let previus2;
		trail.forEach(element => {
			if (previus != undefined) {
				this.state[previus.y][previus.x].char = this.getTrailChar(previus2, previus, element);
				this.state[previus.y][previus.x].color = color;
			}
			previus2 = previus;
			previus = element;
		});
		this.state[previus.y][previus.x].char = this.getTrailChar(previus2, previus, player);
		this.state[previus.y][previus.x].color = color;
		this.state[player.y][player.x].char = this.getPlayerChar(previus, player);
		this.state[player.y][player.x].color = color;
	}


	resizeAction() {
		let cellDim = (window.innerHeight / this.boardDims.height) * 0.8;

		let board_cell =
			".board_cell{\n" +
			"width: " + cellDim + "px;\n" +
			"font-size: " + cellDim + "px;\n" +
			"line-height: " + cellDim + "px;\n" +
			"height: " + cellDim + "px;\n" +
			"}";
		$("#board_styles").html(board_cell);
	}

	getPlayerChar(previus, player) {

		if (previus.x - player.x == 0 && player.y - previus.y == 1) return "Pt";//player cooming from the Top
		else if (previus.x - player.x == 0 && player.y - previus.y == -1) return "Pb";//player cooming from the Bottom
		else if (previus.y - player.y == 0 && player.x - previus.x == 1) return "Pl";//player cooming from the Left
		else if (previus.y - player.y == 0 && player.x - previus.x == -1) return "Pr";//player cooming from the Right
		else Console.exception("getPlayerChar invalid parameters :" + JSON.stringify(previus) + ', ' + JSON.stringify(player));
		return "P";
	}

	getTrailChar(previus, current, next) {
		let previus_d;
		let next_d;
		if (previus != undefined) {
			if (previus.x - current.x == 0 && current.y - previus.y == 1) previus_d = 0
			else if (previus.x - current.x == 0 && current.y - previus.y == -1) previus_d = 2;
			else if (previus.y - current.y == 0 && current.x - previus.x == 1) previus_d = 3;
			else if (previus.y - current.y == 0 && current.x - previus.x == -1) previus_d = 1;
			else Console.exception("getTrailChar invalid parameters (previus):" + JSON.stringify(previus) + ', ' + JSON.stringify(current) + ', ' + JSON.stringify(next));
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
		Console.exception("getTrailChar invalid result");
		return previus_d + "" + next_d;// texhnically valid return value that is usefull for debugging
	}
}

