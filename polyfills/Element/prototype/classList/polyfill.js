Object.defineProperty(Element.prototype, 'classList', {
	get: function () {
		return new DOMTokenList(this, 'className');
	},
	configurable: true
});

if ("SVGElement" in this) {
	Object.defineProperty(SVGElement.prototype, 'classList', {
		get: function () {
			return new DOMTokenList(this.className, 'baseVal');
		},
		configurable: true
	});
}
