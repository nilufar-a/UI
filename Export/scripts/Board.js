
const iconMap = {
	player: {
		fromTop: "╧",
		fromBottom: "╤",
		fromLeft: "╢",
		fromRight: "╟"
	},
	trail: {
		line: {
			horizontal: "━",
			vertical: "┃"
		},
		turn: {
			topRight: "┗",
			bottomRight: "┏",
			bottomLeft: "┓",
			topLeft: "┛"
		}
	},
	entities: {
		powerUp: "⟰",
		obstacle: "▚"
	}
}


class Board {
	constructor(width, height, VC, Acc, board) {
		this.Acc = Acc;
		this.VC = VC;
		this.width = width;
		this.height = height;
		this.board = board;
		this.state = [];
		this.running = false;
		this.BuildBoard();
		VC.SubscribreResize(this.resizeAction.bind(this));
	}

	BuildBoard() {
		var ret = "";
		for (let r = 0; r < this.height; r++) {
			ret += '<tr class="board_row">';
			this.state[r] = [];
			for (let i = 0; i < this.width; i++) {
				ret += '<td class="board_cell icon" id="bc_x' + i + 'y' + r + '" ></td>'
				this.state[r][i] = {};
			}
			ret += '</tr>';
		}
		this.board.html(ret);
		if (this.cellClickAction != undefined) {
			let ccl = this.cellClickAction.bind(this);
			$(".board_cell").click(function () {
				ccl($(this));
			});
		}
		this.resizeAction();
	}

	DistroyBoard() {
		this.state = [];
		this.board.html("");
	}

	LoadState(state, synchState = true) {
		if (state.map.width != this.width || state.map.height != this.height) {
			this.DistroyBoard();
			this.width = state.map.width;
			this.height = state.map.height;
			this.BuildBoard();
		}
		state.map.obstacles.forEach(obstacle => {
			this.state[obstacle.y][obstacle.x].char = iconMap.entities.obstacle;
		});
		state.map["power-ups"].forEach(boost => {
			this.state[boost.y][boost.x].char = iconMap.entities.powerUp;
		});
		if (synchState) this.SynchState();
	}

	SynchState() {
		for (let r = 0; r < this.height; r++) {
			for (let i = 0; i < this.width; i++) {
				if (this.state[r][i] != undefined) {
					let target = $('#bc_x' + i + 'y' + r);
					if (this.state[r][i].entity != undefined) this.state[r][i].char = this.state[r][i].entity.value;
					if (this.state[r][i].char != undefined) target.text(this.state[r][i].char);
					if (this.state[r][i].color != undefined) target.css('color', this.state[r][i].color);
				}
			}
		}
	}

	ParceCellID(id) {
		let regex = /bc_x(\d{1,})y(\d{1,})/;
		let ret = id.match(regex);
		return {
			x: ret[1], y: ret[2]
		};
	}

	resizeAction() {
		let cellDim = (this.VC.height / this.height) * 0.8;
		console.log("working")
		let board_cell =
			".board_cell{\n" +
			"width: " + cellDim + "px;\n" +
			"font-size: " + (cellDim * 0.8) + "px;\n" +
			"line-height: " + (cellDim * 0.8) + "px;\n" +
			"height: " + cellDim + "px;\n" +
			"max-width: " + cellDim + "px;\n" +
			"}\n" +
			".board_row{\n" +
			"width: " + (cellDim * this.width) + "px;\n" +
			"}\n";
		$("#board_styles").html(board_cell);
		$(".board_table").height(cellDim * this.height);
		$(".board_table").width(cellDim * this.width);
	}
}

