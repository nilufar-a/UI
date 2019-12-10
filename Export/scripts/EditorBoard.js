

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
		this.entities.forEach(entity => {
			if (this.selected.name == entity.name)
				entity.class = "active";
			else
				entity.class = "";
		});
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
			this.entities.forEach(entity => {
				if (this.selected.name == entity.name)
					entity.class = "active";
				else
					entity.class = "";
			});

			this.display();
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
		super(24, 24, VC, Acc, $("#editor-board")); // hardcodedd initial dimentions.
		this.EEM = new EditorEntityManager(VC);
		this.name = "New Map";
		this.ECF = new EditorConfigurationForm(24, 24, this, VC);
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

	cellClickAction(cell) {
		let point = this.ParceCellID(cell.attr("id"));
		this.state[point.y][point.x].entity = this.EEM.GetCurrent();
		this.SynchState();
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

const MAP_MIN_DIMENTION = 16;
const MAP_MAX_DIMENTION = 64;
const IS_VALID_CLASS = "is-valid";
const IS_INVALID_CLASS = "is-invalid";
const FORM_DURATIO = 0;

class EditorConfigurationForm {
	constructor(width, height, EB, VC) {
		this.nameChecked = false;
		this.nameOccupied = false;
		this.width = width;
		this.height = height;
		this.EB = EB;
		this.VC = VC;
		this.DOMobjects = {
			input: {
				name: $("#mapName"),
				width: $("#mapWidthInput"),
				height: $("#mapHeightInput")
			},
			button: {
				check: $("#check_name_btn"),
				load: $("#editor_lodad_btn"),
				save: $("#editor_save_btn"),
				update: $("#editor_update_btn"),
				rebuild: $("#editor_rebuild_btn"),
				json: $("#json_btn")
			},
			alert: {
				check: $("#editor_alert_check"),
				save: $("#editor_alert_save"),
				update: $("#editor_alert_update"),
				dimention: $("#editor_alert_dimention"),
				width: $("#editor_alert_width"),
			},
			state: {
				input: {
					width: undefined,
					height: undefined
				},
				button: {
					load: false,
					save: false,
					update: false,
					rebuild: false,
				},
				alert: {
					check: false,
					save: false,
					update: false,
					dimention: false,
					width: false,
				}
			}
		};

		this.validateAndDraw();


		this.DOMobjects.input.name.keyup((function (e) {
			this.nameChecked = false;
			this.validateAndDraw();
		}).bind(this));
		this.DOMobjects.input.width.change((function (e) {
			this.nameChecked = false;
			this.validateAndDraw();
		}).bind(this));
		this.DOMobjects.input.height.change((function (e) {
			this.nameChecked = false;
			this.validateAndDraw();
		}).bind(this));
		this.DOMobjects.button.check.click((function (e) {
			this.CheckName(this.DOMobjects.input.name.val());
		}).bind(this));
		this.DOMobjects.button.load.click((function (e) {
			this.LoadMap(this.DOMobjects.input.name.val());
		}).bind(this));
		this.DOMobjects.button.save.click((function (e) {
			this.UploadMap();
		}).bind(this));
		this.DOMobjects.button.update.click((function (e) {
			this.UpdateMap();
		}).bind(this));
		this.DOMobjects.button.rebuild.click((function (e) {
			this.EB.DistroyBoard();
			this.EB.width = this.DOMobjects.input.width.val();
			this.EB.height = this.DOMobjects.input.height.val();
			this.EB.BuildBoard();
		}).bind(this));
		this.DOMobjects.button.json.click((function (e) {
			console.log(JSON.stringify(this.EB.GetMapObject()));
			alert("Printed map json to console, use developer/inspect mode to view it")
		}).bind(this));
	}

	CheckName(name) {
		$.ajax({
			type: "GET",
			url: "/isNameOccupied" + Acc.URIfromObject({ mapid: name }), //TODO !!!!MISIING API GATEWAY,
			data: JSON.stringify({ mapid: name }), //TODO MISSING REQUEST SPECIFICATION
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: (function (data) {
				this.nameChecked = true;
				this.nameOccupied = this.data.occupied;
				this.validateAndDraw();
			}).bind(this),
			beforeSend: this.Acc.getHeaderFunction()
		});
	}

	LoadMap(name) {
		$.ajax({
			type: "GET",
			url: "/getMap" + Acc.URIfromObject({ mapid: name }), //TODO !!!!MISIING API GATEWAY,
			data: JSON.stringify({
				mapid: name
			}), //TODO MISSING REQUEST SPECIFICATION
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: (function (data) {
				data = JSON.parse(data);
				this.EB.LoadState(data);
				this.nameChecked = true;
				this.nameOccupied = true;
				this.validateAndDraw();
			}).bind(this),
			beforeSend: this.Acc.getHeaderFunction()
		});
	}

	UploadMap() {
		$.ajax({
			type: "POST",
			url: "/uploadMap" + Acc.URIfromObject({ mapid: name }), //TODO !!!!MISIING API GATEWAY,
			data: JSON.stringify(this.EB.GetMapObject()), //TODO MISSING REQUEST SPECIFICATION
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: (function (data) {
				this.nameChecked = true;
				this.nameOccupied = true;
				this.validateAndDraw();
			}).bind(this),
			beforeSend: this.Acc.getHeaderFunction()
		});
	}

	UpdateMap() {
		$.ajax({
			type: "POST",
			url: "/updateMap" + Acc.URIfromObject({ mapid: name }), //TODO !!!!MISIING API GATEWAY,
			data: JSON.stringify(this.EB.GetMapObject()), //TODO MISSING REQUEST SPECIFICATION
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: (function (data) {
				this.nameChecked = true;
				this.nameOccupied = true;
				this.validateAndDraw();
			}).bind(this),
			beforeSend: this.Acc.getHeaderFunction()
		});
	}

	draw() {
		if (this.DOMobjects.state.alert.check)
			this.DOMobjects.alert.check.slideDown(FORM_DURATIO);
		else
			this.DOMobjects.alert.check.slideUp(FORM_DURATIO);
		if (this.DOMobjects.state.alert.save)
			this.DOMobjects.alert.save.slideDown(FORM_DURATIO);
		else
			this.DOMobjects.alert.save.slideUp(FORM_DURATIO);
		if (this.DOMobjects.state.alert.update)
			this.DOMobjects.alert.update.slideDown(FORM_DURATIO);
		else
			this.DOMobjects.alert.update.slideUp(FORM_DURATIO);
		if (this.DOMobjects.state.alert.dimention)
			this.DOMobjects.alert.dimention.slideDown(FORM_DURATIO);
		else
			this.DOMobjects.alert.dimention.slideUp(FORM_DURATIO);

		if (this.DOMobjects.state.alert.width)
			this.DOMobjects.alert.width.slideDown(FORM_DURATIO);
		else
			this.DOMobjects.alert.width.slideUp(FORM_DURATIO);

		this.DOMobjects.button.load.attr("disabled", !this.DOMobjects.state.button.load);
		this.DOMobjects.button.save.attr("disabled", !this.DOMobjects.state.button.save);
		this.DOMobjects.button.update.attr("disabled", !this.DOMobjects.state.button.update);
		this.DOMobjects.button.rebuild.attr("disabled", !this.DOMobjects.state.button.rebuild)

		this.DOMobjects.input.width.removeClass(IS_VALID_CLASS);
		this.DOMobjects.input.width.removeClass(IS_INVALID_CLASS);
		this.DOMobjects.input.height.removeClass(IS_VALID_CLASS);
		this.DOMobjects.input.height.removeClass(IS_INVALID_CLASS);

		if (this.DOMobjects.state.input.height == undefined) { }
		else if (this.DOMobjects.state.input.height)
			this.DOMobjects.input.height.addClass(IS_VALID_CLASS);
		else
			this.DOMobjects.input.height.addClass(IS_INVALID_CLASS);
		if (this.DOMobjects.state.input.width == undefined) { }
		else if (this.DOMobjects.state.input.width)
			this.DOMobjects.input.width.addClass(IS_VALID_CLASS);
		else
			this.DOMobjects.input.width.addClass(IS_INVALID_CLASS);

	}

	reset() {
		this.DOMobjects.state.input.width = undefined;
		this.DOMobjects.state.input.height = undefined;
		this.DOMobjects.state.input.height = undefined;
		this.DOMobjects.state.button.load = false;
		this.DOMobjects.state.button.save = false;
		this.DOMobjects.state.button.update = false;
		this.DOMobjects.state.button.rebuild = false;
		this.DOMobjects.state.alert.check = false;
		this.DOMobjects.state.alert.save = false;
		this.DOMobjects.state.alert.update = false;
		this.DOMobjects.state.alert.dimention = false;
		this.DOMobjects.state.alert.width = false;
	}

	validateAndDraw() {
		this.reset();
		if (this.nameChecked) {
			if (this.nameOccupied) {
				this.DOMobjects.state.alert.update = true;
				this.DOMobjects.state.button.update = true;
				this.DOMobjects.state.button.load = true;
			} else {
				this.DOMobjects.state.alert.save = true;
				this.DOMobjects.state.button.save = true;
			}
		} else {
			this.DOMobjects.state.alert.check = true;
		}

		let w = this.DOMobjects.input.width.val();
		let h = this.DOMobjects.input.height.val();
		this.DOMobjects.state.input.height = h >= 16 && h <= 64;
		this.DOMobjects.state.input.width = w >= 16 && w <= 64 && w <= h;
		this.DOMobjects.state.alert.dimention = h < 16 || h > 64 || w < 16 || w > 64;
		this.DOMobjects.state.alert.width = w != "" && h != "" && w > h;
		this.DOMobjects.state.button.rebuild = !this.DOMobjects.state.alert.dimention && !this.DOMobjects.state.alert.width
		this.draw();
	}
}