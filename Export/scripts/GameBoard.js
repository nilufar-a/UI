
class GameBoard extends Board {

	constructor(width, height, VC) {
		super(width, height, VC, $("#game-board"));
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
			else console.error("getTrailChar invalid parameters (previus):" + JSON.stringify(previus) + ', ' + JSON.stringify(current) + ', ' + JSON.stringify(next));
		}
		if (next != undefined) {
			if (next.x - current.x == 0 && current.y - next.y == 1) next_d = 0
			else if (next.x - current.x == 0 && current.y - next.y == -1) next_d = 2;
			else if (next.y - current.y == 0 && current.x - next.x == 1) next_d = 3;
			else if (next.y - current.y == 0 && current.x - next.x == -1) next_d = 1;
			else console.error("getTrailChar invalid parameters (next): " + JSON.stringify(previus) + ', ' + JSON.stringify(current) + ', ' + JSON.stringify(next));
		}
		if (previus_d == undefined) previus_d = (next_d + 2) % 4;
		if (next_d == undefined) next_d = (previus_d + 2) % 4;
		if (next_d == undefined) console.error("getTrailChar invalid parameters (all): " + JSON.stringify(previus) + ', ' + JSON.stringify(current) + ', ' + JSON.stringify(next));

		if ((previus_d == 0 && next_d == 2) || (previus_d == 2 && next_d == 0)) return iconMap.trail.line.vertical;
		if ((previus_d == 1 && next_d == 3) || (previus_d == 3 && next_d == 1)) return iconMap.trail.line.horizontal;
		if ((previus_d == 0 && next_d == 1) || (previus_d == 1 && next_d == 0)) return iconMap.trail.turn.topRight;
		if ((previus_d == 1 && next_d == 2) || (previus_d == 2 && next_d == 1)) return iconMap.trail.turn.bottomRight;
		if ((previus_d == 2 && next_d == 3) || (previus_d == 3 && next_d == 2)) return iconMap.trail.turn.bottomLeft;
		if ((previus_d == 3 && next_d == 0) || (previus_d == 0 && next_d == 3)) return iconMap.trail.turn.topLeft;
		console.error("getTrailChar invalid result");
		return previus_d + "" + next_d;// texhnically valid return value that is usefull for debugging
	}
}