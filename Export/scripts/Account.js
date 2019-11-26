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
}