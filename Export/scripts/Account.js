class Account {
	constructor(newToken) {
		this.token = newToken;
	}

	RegisterToken(newToken) {
		this.token = newToken;
	}

	Sign(obj) {
		obj.token = this.token
		return obj;
	}

	URIfromObject(object) {
		let ret = ""
		let keys = Object.keys(object);
		keys.forEach(key => {
			let value = object[key];
			if (ret == "")
				ret += "?"
			else
				ret += "&";
			ret += key + "=" + encodeURIComponent(value.toString());
		});
		return ret;
	}

	getHeaderFunction() {
		return function (xhr) {
			xhr.setRequestHeader("Authorization", this.token);
		}.bind(this);
	}
}