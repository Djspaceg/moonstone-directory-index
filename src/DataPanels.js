//
// DataPanels
//
// Panels that mymic data repeater...
// so, the collection assigned to 'panels' will automatically
// push/pop panels when a new item or items are added/removed
// from the collection.
//
// Each member of the collection will have all the necessary
// models and metadata to populate any/all fields of the panel
// including the models.
//
var
	kind = require('enyo/kind'),
	DataRepeater = require('enyo/DataRepeater');

module.exports = kind({
	name: 'B.DataPanels',
	kind: DataRepeater,
	// mixins: [moon.Panels],
	components: [],
	// componentsTemplate: [],
	create: function() {
		this.inherited(arguments);
		console.log('At least we created DataPanels...');
		// this.prepareTemplate();
	},
	/**
		Overloaded to call a method of the delegate strategy.
	*/
	modelsAdded: function (c, e, props) {
		this.inherited(arguments);
		console.log('modelsAdded:c:', c, e, props);
		// if (c === this.collection && this.$.scroller.canGenerate) {
		// 	if (this.get('absoluteShowing')) {
		// 		this.delegate.modelsAdded(this, props);
		// 	} else {
		// 		this._addToShowingQueue('refresh', function () {
		// 			this.refresh();
		// 		});
		// 	}
		// }
	},
	/**
		Overloaded to call a method of the delegate strategy.
	*/
	modelsRemoved: function (c, e, props) {
		this.inherited(arguments);
		console.log('modelsRemoved:c:', c, e, props);
		// if (c === this.collection && this.$.scroller.canGenerate) {
		// 	if (this.get('absoluteShowing')) {
		// 		this.delegate.modelsRemoved(this, props);
		// 	} else {
		// 		this._addToShowingQueue('refresh', function () {
		// 			this.refresh();
		// 		});
		// 	}
		// }
	}
});
