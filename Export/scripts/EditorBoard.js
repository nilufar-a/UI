

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
	{ name: "up", value: 2 },
	{ name: "right", value: 3 },
	{ name: "down", value: 0 },
	{ name: "left", value: 1 }]

class PlayerEntity extends Entity {
	constructor() {
		super("Player", "Player", "Player");
		this.directionIndex = 0;
		this.value = this.GetPlayerChar(playerDirections[this.directionIndex].value);
		this.displayValue = this.value;
		this.secondClickAction.bind(this);
	}

	secondClickAction() {
		this.directionIndex++;
		if (this.directionIndex >= playerDirections.length) this.directionIndex = 0;
		this.value = this.GetPlayerChar(playerDirections[this.directionIndex].value);
		this.displayValue = this.value;
		return true;
	};

	GetPlayerChar(directionValue) {
		if (directionValue == 0) return iconMap.player.fromTop;//player cooming from the Top
		else if (directionValue == 2) return iconMap.player.fromBottom;//player cooming from the Bottom
		else if (directionValue == 3) return iconMap.player.fromLeft;//player cooming from the Left
		else if (directionValue == 1) return iconMap.player.fromRight;//player cooming from the Right
		else Console.exception("getPlayerChar invalid parameters :" + JSON.stringify(previus) + ', ' + JSON.stringify(player));
		return "P";
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
			if (value == entity.value) {
				ret = entity;
			}
		})
		return ret;
	}
}

class EditorBoard extends Board {

	constructor(width, height, VC) {
		super(width, height, VC, $("#editor-board"));
		this.EEM = new EditorEntityManager(VC);
	}

	BuildBoard() {
		super.BuildBoard(this.cellClickAction.bind(this));
	}

	cellClickAction(cell) {
		var point = this.ParceCellID(cell.attr("id"));
		this.state[point.y][point.x].entity = this.EEM.GetCurrent();
		this.SynchState();
	}
}