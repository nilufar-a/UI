

class Entity {
	constructor(value, displayValue, name) {
		this.value = value;
		this.displayValue = displayValue;
		this.name = name;
	}
	Copy() {
		return new Entity(this.value, this.displayValue, this.name);
	}
	secondClickAction() { };
}

const playerDirections = [
	{ name: "UP", value: 2 },
	{ name: "RIGHT", value: 3 },
	{ name: "DOWN", value: 0 },
	{ name: "LEFT", value: 1 }
];

class PlayerEntity extends Entity {
	constructor() {
		super("Player", "Player", "Player");
		this.directionIndex = 0;
		this.refreshValue();
		this.secondClickAction.bind(this);
	}

	secondClickAction() {
		this.directionIndex++;
		if (this.directionIndex >= playerDirections.length) this.directionIndex = 0;
		this.refreshValue();
		return true;
	};

	refreshValue() {
		this.value = this.GetPlayerChar(playerDirections[this.directionIndex].value);
		this.displayValue = this.value;
	}

	GetPlayerChar(directionValue) {
		if (directionValue == 0) return iconMap.player.fromTop;//player cooming from the Top
		else if (directionValue == 2) return iconMap.player.fromBottom;//player cooming from the Bottom
		else if (directionValue == 3) return iconMap.player.fromLeft;//player cooming from the Left
		else if (directionValue == 1) return iconMap.player.fromRight;//player cooming from the Right
		else console.error("getPlayerChar invalid parameters :" + JSON.stringify(previus) + ', ' + JSON.stringify(player));
		return "P";
	}

	GetPlayerObject(x, y) {
		return { headPosition: { x: x, y: y }, lookDirection: playerDirections[this.directionIndex].name }
	}

	Copy() {
		let ret = new PlayerEntity();
		ret.directionIndex = this.directionIndex;
		ret.refreshValue();
		return ret;
	}
}

const editorEntities = [
	new Entity(iconMap.entities.obstacle, iconMap.entities.obstacle, "Obstacle"),
	new Entity(iconMap.entities.powerUp, iconMap.entities.powerUp, "Boost Charge"),
];

class EditorEntityManager {

	constructor(VC) {
		this.VC = VC;
		this.selected = undefined;
		this.populate();
	};

	GetCurrent() {
		return this.selected.Copy();
	}

	populate() {
		this.entities = [];
		editorEntities.forEach(editorEntity => {
			this.entities.push(editorEntity);
		});
		this.entities.push(new PlayerEntity());
		this.entities.push(new Entity("", "X", "Clear"));
		this.selected = this.findEntity("");
		this.display();
	}

	display() {
		this.VC.DisplayList(this.entities, "editor_entity");
		var func = this.entityClickAction.bind(this);
		$(".editor_entity").click(function () {
			func($(this).attr("value"));
		});
	}

	entityClickAction(value) {
		if (this.selected == this.findEntity(value)) {
			if (this.selected.secondClickAction()) this.display();
		}
		else {
			this.selected = this.findEntity(value);
		}
	}

	findEntity(value) {
		var ret = undefined;
		this.entities.forEach(entity => {
			if (value == entity.value || value == entity.name) {
				ret = entity;
			}
		})
		return ret;
	}
}

class EditorBoard extends Board {

	constructor(VC, Acc) {
		super(64, 64, VC, Acc, $("#editor-board")); // hardcodedd initial dimentions.
		this.EEM = new EditorEntityManager(VC);
		this.name = "New Map";
	}

	LoadState(state, synchState = true) {
		state.map.obstacles.forEach(obstacle => {
			this.state[obstacle.y][obstacle.x].entity = this.EEM.findEntity("Obstacle");
		});
		state.map["power-ups"].forEach(boost => {
			this.state[boost.y][boost.x].entity = this.EEM.findEntity("Boost Charge");
		});
		if (synchState) this.SynchState();
	}

	BuildBoard() {
		super.BuildBoard(this.cellClickAction.bind(this));
	}

	cellClickAction(cell) {
		var point = this.ParceCellID(cell.attr("id"));
		this.state[point.y][point.x].entity = this.EEM.GetCurrent();
		this.SynchState();
		console.log(this.GetMapObject());
		console.log(JSON.stringify(this.GetMapObject()));
	}

	GetMapObject() {
		let ret = { map: { width: this.width, height: this.height, name: this.name, obstacles: [] }, players: [] };
		ret.map["power-ups"] = [];
		for (let r = 0; r < this.height; r++) {
			for (let i = 0; i < this.width; i++) {
				if (this.state[r][i] != undefined && this.state[r][i].entity != undefined) {
					if (this.state[r][i].entity.name == this.EEM.findEntity("Obstacle").name)
						ret.map.obstacles.push({ x: i, y: r });
					if (this.state[r][i].entity.name == this.EEM.findEntity("Boost Charge").name)
						ret.map["power-ups"].push({ x: i, y: r });
					if (this.state[r][i].entity.name == this.EEM.findEntity("Player").name)
						ret.players.push(this.state[r][i].entity.GetPlayerObject(i, r))
				}
			}
		}
		return ret;
	}
}