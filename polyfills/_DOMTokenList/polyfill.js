function _DOMTokenList(o, p) {
	function split(s) {
		return s.length ? s.split(/\s+/g) : [];
	}

	// NOTE: This does not exactly match the spec.
	function removeTokenFromString(token, string) {
		var tokens = split(string);
		var index = tokens.indexOf(token);
		while (index !== -1) {
			tokens.splice(index, 1);
			index = tokens.indexOf(token);
		}
		return tokens.join(' ');
	}

	Object.defineProperties(
		this, {
			length: {
				get: function () {
					return split(o[p]).length;
				}
			},

			item: {
				value: function (idx) {
					var tokens = split(o[p]);
					return 0 <= idx && idx < tokens.length ? tokens[idx] : null;
				}
			},

			contains: {
				value: function (token) {
					token = String(token);
					if (token.length === 0) {
						throw SyntaxError();
					}
					if (/\s/.test(token)) {
						throw Error("InvalidCharacterError");
					}
					var tokens = split(o[p]);

					return tokens.indexOf(token) !== -1;
				}
			},

			add: {
				value: function ( /*tokens...*/ ) {
					var tokens = Array.prototype.slice.call(arguments).map(String);
					if (tokens.some(function (token) {
							return token.length === 0;
						})) {
						throw SyntaxError();
					}
					if (tokens.some(function (token) {
							return (/\s/).test(token);
						})) {
						throw Error("InvalidCharacterError");
					}

					try {
						var underlying_string = o[p];
						var token_list = split(underlying_string);
						tokens = tokens.filter(function (token) {
							return token_list.indexOf(token) === -1;
						});
						if (tokens.length === 0) {
							return;
						}
						if (underlying_string.length !== 0 && !(/\s$/).test(underlying_string)) {
							underlying_string += ' ';
						}
						underlying_string += tokens.join(' ');
						o[p] = underlying_string;
					} finally {
						var length = split(o[p]).length;
						if (this.length !== length) {
							this.length = length;
						}
					}
				}
			},

			remove: {
				value: function ( /*tokens...*/ ) {
					var tokens = Array.prototype.slice.call(arguments).map(String);
					if (tokens.some(function (token) {
							return token.length === 0;
						})) {
						throw SyntaxError();
					}
					if (tokens.some(function (token) {
							return (/\s/).test(token);
						})) {
						throw Error("InvalidCharacterError");
					}

					try {
						var underlying_string = o[p];
						tokens.forEach(function (token) {
							underlying_string = removeTokenFromString(token, underlying_string);
						});
						o[p] = underlying_string;
					} finally {
						var length = split(o[p]).length;
						if (this.length !== length) {
							this.length = length;
						}
					}
				}
			},

			toggle: {
				value: function (token /*, force*/ ) {
					var force = arguments[1];
					try {
						token = String(token);
						if (token.length === 0) {
							throw SyntaxError();
						}
						if (/\s/.test(token)) {
							throw Error("InvalidCharacterError");
						}
						var tokens = split(o[p]),
							index = tokens.indexOf(token);

						if (index !== -1 && (!force || force === (void 0))) {
							o[p] = removeTokenFromString(token, o[p]);
							return false;
						}
						if (index !== -1 && force) {
							return true;
						}
						var underlying_string = o[p];
						if (underlying_string.length !== 0 && !/\s$/.test(underlying_string)) {
							underlying_string += ' ';
						}
						underlying_string += token;
						o[p] = underlying_string;
						return true;
					} finally {
						var length = split(o[p]).length;
						if (this.length !== length) {
							this.length = length;
						}
					}
				}
			},

			toString: {
				value: function () {
					return o[p];
				}
			}
		});
	if (!('length' in this)) {
		// In case getters are not supported
		this.length = split(o[p]).length;
	} else {
		// If they are, shim in index getters (up to 100)
		for (var i = 0; i < 100; ++i) {
			Object.defineProperty(this, String(i), {
				get: (function (n) {
					return function () {
						return this.item(n);
					};
				}(i))
			});
		}
	}
}
