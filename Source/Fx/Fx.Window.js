(function(){

var dimensions = ['x', 'y', 'width', 'height'];

var parse = function(value, min, max){
	if (typeof value == 'string'){
		var match = value.match(/^(\d+)(%?)$/);
		value = match[1].toInt();
		if (match[2]) value = (max - min) * value / 100 + min;
	}
	return value.limit(min, max);
};

Window.implement({
	getBounds: function(){
		var bounds = {};
		var x, y, width, height, args = Array.flatten(arguments);
		if (args.length == 4) {
			dimensions.each(function(dim, index){
				bounds[dim] = args[index];
			});
		} else {
			args = args[0] || {};
			var current = window.nativeWindow.bounds;
			dimensions.each(function(dim){
				bounds[dim] = $pick(args[dim], current[dim]);
			});
		}
		var sb = air.Screen.mainScreen.bounds,
			svb = air.Screen.mainScreen.visibleBounds,
			minSize = window.nativeWindow.minSize,
			maxSize = window.nativeWindow.maxSize;
		bounds.width = parse(bounds.width, minSize.x, Math.min(maxSize.x, svb.width));
		bounds.height = parse(bounds.height, minSize.y, Math.min(maxSize.y, svb.height));
		bounds.x = parse(bounds.x, svb.x, sb.width - bounds.width);
		bounds.y = parse(bounds.y, svb.y, sb.height - bounds.height);
		return bounds;
	},

	setBounds: function(){
		var bounds = this.getBounds(arguments);
		window.nativeWindow.bounds = new air.Rectangle(bounds.x, bounds.y, bounds.width, bounds.height);
	}
});

Fx.Window = new Class({

	Extends: Fx,

	set: function(bounds){
		window.nativeWindow.bounds = new air.Rectangle(bounds.x, bounds.y, bounds.width, bounds.height);
	},

	compute: function(from, to, delta){
		var obj = {};
		dimensions.each(function(dim){
			obj[dim] = Fx.compute(from[dim], to[dim], delta);
		});
		return obj;
	},

	start: function(from, to){
		if (!this.check(arguments.callee, from, to)) return this;
		if (!to){
			to = from;
			from = null;
		}
		return this.parent(window.getBounds(from), window.getBounds(to));
	}

});

})();
