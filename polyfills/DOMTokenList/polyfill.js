(function (global) {
	var nativeImpl = "DOMTokenList" in global && global.DOMTokenList;

	if (!nativeImpl) {
		global.DOMTokenList = _DOMTokenList;
	} else {
		// Add second argument to native DOMTokenList.toggle() if necessary
		(function () {
			if (!('DOMTokenList' in this)) return;
			var e = document.createElement('span');
			if (!('classList' in e)) return;
			e.classList.toggle('x', false);
			if (!e.classList.contains('x')) return;
			this.DOMTokenList.prototype.toggle = function toggle(token /*, force*/) {
				var force = arguments[1];
				if (force === undefined) {
					var add = !this.contains(token);
					this[add ? 'add' : 'remove'](token);
					return add;
				}
				force = !!force;
				this[force ? 'add' : 'remove'](token);
				return force;
			};
		}());

	}

}(this));
