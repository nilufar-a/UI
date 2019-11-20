
const iconMap = {
	player: {
		fromTop: "Pt",
		fromBottom: "Pb",
		fromLeft: "Pl",
		fromRight: "Pr"
	},
	trail: {
		line: {
			horizontal: "h",
			vertical: "v"
		},
		turn: {
			topRight: "tr",
			bottomRight: "br",
			bottomLeft: "bl",
			topLeft: "tl"
		}
	},
	entities: {
		powerUp: "B",
		obstacle: "O"
	}
}


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
			ret += '</tr>';
		}
		board.html(ret);
		this.resizeAction();
	}

	LoadState(state, synchState = true) {
		state.map.obstacles.forEach(obstacle => {
			this.state[obstacle.y][obstacle.x].char = iconMap.entities.obstacle;
		});
		state.map["power-ups"].forEach(boost => {
			this.state[boost.y][boost.x].char = iconMap.entities.powerUp;
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

	resizeAction() {
		let cellDim = (window.innerHeight / this.boardDims.height) * 0.8;

		let board_cell =
			".board_cell{\n" +
			"width: " + cellDim + "px;\n" +
			"font-size: " + cellDim + "px;\n" +
			"line-height: " + cellDim + "px;\n" +
			"height: " + cellDim + "px;\n" +
			"max-width: " + cellDim + "px;\n" +
			"}\n" +
			".board_row{\n" +
			"width: " + (cellDim * this.boardDims.width) + "px;\n" +
			"}\n";
		$("#board_styles").html(board_cell);
		$(".board_table").height(cellDim * this.boardDims.height);
		$(".board_table").width(cellDim * this.boardDims.width);
	}
}

