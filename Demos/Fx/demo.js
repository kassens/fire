window.addEvent('domready', function(){
	var h1 = document.getElement('h1');

	var sizes = [
		{x: '0%', y: '100%'},
		{x: '50%', y: '10%'},
		{x: '100%', y: '0%'},
		[400, 100, 320, 300],
		{x: 0, y: 0, width: 0, height: 0},
		{x: '50%', y: 100},
		{x: '50%', y: '50%', width: '100%', height: '100%'}
	];

	var fx = new Fx.Window();
	sizes.each(function(size){
		el = new Element('button', {
			text: JSON.encode(size),
			events: {
				click: function(){
					fx.start(size);
				}
			}
		}).injectAfter(h1);
	});

});
