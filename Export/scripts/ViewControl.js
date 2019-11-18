
// minimum aspect ratio
const ASPECT_RATIO_VERTICAL = 3;
const ASPECT_RATIO_HOEIZONTAL = 3;

class ViewControl {
	constructor() {
		this.fld_data = { test_fld: { name: "Daniil" } };
		this.elems = [];
		this.flds = [];
		this.views = [];
		this.resizeSubscribers = [];
		this.currentView = "splash";
		this.changingview = false;
		this.CollectViews();
		this.CollectElems();
		this.CollectFlds();
		this.UpdateAllfields();
		var VS = this;

		$(".prevent_default_click").click(function (event) {
			event.preventDefault()
		});
		$(window).resize(function () {
			VS.onResize();
		});
		$('.hide_children_until_load_complete').removeClass("hide_children_until_load_complete");
	}

	CollectElems() {
		var VC = this;
		$('elem').each(function () {
			let key = $(this).attr("name");
			VC.elems[key] = { html: $(this).html(), container: $(this).parent() };;
			$(this).remove();
		});
	}

	CollectFlds() {
		var VC = this;
		$('fld').each(function () {
			let key = $(this).attr("name");
			VC.flds[key] = { html: $(this).html(), container: $(this).parent() };
		});
	}

	CollectViews() {
		var VC = this;
		$('view').each(function () {
			let key = $(this).attr("name");
			VC.views[key] = { view: $(this), container: $(this).parent() };
			if (key != VC.currentView)
				$(this).hide();
			else
				$(this).show();
		});
	}

	ChangeView(viewName) {
		var VC = this;
		if (this.views[viewName] != null && viewName != this.currentView && !this.changingview) {
			this.changingview = true;
			this.views[this.currentView].view.hide(500, function () {
				VC.views[viewName].view.show(500, function () {
					VC.currentView = viewName;
					VC.currentView = false;
				});
			});
		}
	}

	DisplayList(data, elemName) {
		if (Array.isArray(data)) {
			let retHtml = "";
			data.forEach(row => {
				let line = this.elems[elemName].html;
				line = this.fillPlaceholders(line, row);
				retHtml += line;
			});
			this.elems[elemName].container.html(retHtml);
		}
	}

	UpdateAllfields() {
		var VC = this;
		$('fld').each(function () {
			let key = $(this).attr("name");
			let html = VC.flds[key].html;
			html = VC.fillPlaceholders(html, VC.fld_data[key]);
			$(this).html(html);
		});
	}

	fillPlaceholders(html, data) {
		let keys = Object.keys(data);
		keys.forEach(key => {
			let value = data[key];
			html = html.replace("%" + key + "%", value);
		});
		return html;
	}

	SubscribreResize(resizeAction) {
		this.resizeSubscribers.push(resizeAction);
	}

	onResize() {
		this.resizeSubscribers.forEach(subscriber => {
			subscriber();
		});

		if (window.innerHeight * ASPECT_RATIO_HOEIZONTAL > window.innerWidth * ASPECT_RATIO_VERTICAL)
			alert("Resize your window such that the width is noticebly greater than height.\n Otherwise area of the screen will become unuseable");
	}
}
