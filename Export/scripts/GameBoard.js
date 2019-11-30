const UP = 0;
const DOWN = 2;
const LEFT = 3;
const RIGHT = 1;



class GameBoard extends Board {

	constructor(width, height, VC, Acc) {
		super(width, height, VC, Acc, $("#game-board"));
		this.running = false;
		this.GameState = { TurboFlag: false, turn: 0 }
		this.StartGame(1000);
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

	LoadState(state, synchState = true) {
		super.LoadState(state, false);
		this.UpdateState(state, synchState);
	}


	UpdateState(state, synchState = true) {
		state.players.forEach(player => {
			this.drawPlayer(player.tracer, player.headPosition, player.color);
		});
		this.displayPlayerList(state);
		if (synchState) this.SynchState();
	}

	displayPlayerList(state) {
		VC.DisplayList(state.players, "game_player_list_item");
	}

	getPlayerChar(previus, player) {
		if (previus.x - player.x == 0 && player.y - previus.y == 1) return iconMap.player.fromTop;//player cooming from the Top
		else if (previus.x - player.x == 0 && player.y - previus.y == -1) return iconMap.player.fromBottom;//player cooming from the Bottom
		else if (previus.y - player.y == 0 && player.x - previus.x == 1) return iconMap.player.fromLeft;//player cooming from the Left
		else if (previus.y - player.y == 0 && player.x - previus.x == -1) return iconMap.player.fromRight;//player cooming from the Right
		else console.error("getPlayerChar invalid parameters :" + JSON.stringify(previus) + ', ' + JSON.stringify(player));
		return "P";
	}

	getTrailChar(previus, current, next) {
		let previus_d;
		let next_d;
		if (previus != undefined) {
			if (previus.x - current.x == 0 && current.y - previus.y == 1) previus_d = UP
			else if (previus.x - current.x == 0 && current.y - previus.y == -1) previus_d = DOWN;
			else if (previus.y - current.y == 0 && current.x - previus.x == 1) previus_d = LEFT;
			else if (previus.y - current.y == 0 && current.x - previus.x == -1) previus_d = RIGHT;
			else console.error("getTrailChar invalid parameters (previus):" + JSON.stringify(previus) + ', ' + JSON.stringify(current) + ', ' + JSON.stringify(next));
		}
		if (next != undefined) {
			if (next.x - current.x == 0 && current.y - next.y == 1) next_d = UP
			else if (next.x - current.x == 0 && current.y - next.y == -1) next_d = DOWN;
			else if (next.y - current.y == 0 && current.x - next.x == 1) next_d = LEFT;
			else if (next.y - current.y == 0 && current.x - next.x == -1) next_d = RIGHT;
			else console.error("getTrailChar invalid parameters (next): " + JSON.stringify(previus) + ', ' + JSON.stringify(current) + ', ' + JSON.stringify(next));
		}
		if (previus_d == undefined) previus_d = (next_d + 2) % 4;
		if (next_d == undefined) next_d = (previus_d + 2) % 4;
		if (next_d == undefined) console.error("getTrailChar invalid parameters (all): " + JSON.stringify(previus) + ', ' + JSON.stringify(current) + ', ' + JSON.stringify(next));

		if ((previus_d == UP && next_d == DOWN) || (previus_d == DOWN && next_d == UP)) return iconMap.trail.line.vertical;
		if ((previus_d == RIGHT && next_d == LEFT) || (previus_d == LEFT && next_d == RIGHT)) return iconMap.trail.line.horizontal;
		if ((previus_d == UP && next_d == RIGHT) || (previus_d == RIGHT && next_d == UP)) return iconMap.trail.turn.topRight;
		if ((previus_d == RIGHT && next_d == DOWN) || (previus_d == DOWN && next_d == RIGHT)) return iconMap.trail.turn.bottomRight;
		if ((previus_d == DOWN && next_d == LEFT) || (previus_d == LEFT && next_d == DOWN)) return iconMap.trail.turn.bottomLeft;
		if ((previus_d == LEFT && next_d == UP) || (previus_d == UP && next_d == LEFT)) return iconMap.trail.turn.topLeft;
		console.error("getTrailChar invalid result");
		return previus_d + "" + next_d;// texhnically valid return value that is usefull for debugging
	}

	StartGame(delay) {
		this.running = true;
		$(document).keydown(this.onKeyPress.bind(this));
		this.requestState(delay);
	}

	EndGame() {
		this.running = false;
		$(document).off("keydown");
	}

	onKeyPress(e) {
		var move = {};
		switch (e.keyCode) {
			case 38:
			case 87:
				move.Direction = "UP";
				break;
			case 39:
			case 68:
				move.Direction = "RIGHT";
				break;
			case 40:
			case 83:
				move.Direction = "DOWN";
				break;
			case 37:
			case 65:
				move.Direction = "LEFT";
				break;
			case 66:
			case 84:
				// B for boost or T for Turbo
				move.TurboFlag = this.GameState.TurboFlag = !this.GameState.TurboFlag;
		}
		if (move != {}) this.postMove(move)
	}

	requestState(delay) {
		if (this.running) {
			setTimeout(function () {
				$.ajax({
					type: "GET",
					url: "/GetState",
					data: JSON.stringify(Acc.Sign({})),
					contentType: "application/json; charset=utf-8",
					dataType: "json",
					success: this.procesState
				});
			}.bind(this), delay);
		}
	}

	procesState(newState) {
		if (newState.turnCounter != this.GameState.turn) {
			this.GameState.TurboFlag = false;
			this.LoadState(newState);
		}
		this.requestState(newState.timeToUpdate);
	}

	postMove(moveObject) {
		if (moveObject.Direction != undefined || moveObject.TurboFlag) {
			$.ajax({
				type: "POST",
				url: "/PostMove",
				data: JSON.stringify(Acc.Sign(moveObject)), // moveObject is sent, Acc.Sign() adds a "token" field for the authentication, JSON.stringify() converts object to string
				contentType: "application/json; charset=utf-8",
				dataType: "json",
				success: function (data) {
					//play a sound or whatever.
				},
				failure: function (errMsg) {
					//error handeling
				}
			});
		}
	}
}