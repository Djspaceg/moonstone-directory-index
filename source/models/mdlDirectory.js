enyo.kind({
	name: "mdlDirectory",
	kind: enyo.Model,
	readOnly: true,
	attributes: {
		path: "path",
		name: function () { 
			return this.get("name");
		},
		title: function () { 
			var strDir = this.get("name");
			return strDir === "/" ? "/Home" : strDir.toWordCase();
		},
		// contents: []
	},
	computed: {
		title: [{cached: true}],
	},
	primaryKey: 'path',
	parse: function (data) {
		// the data comes back as an object with a property that is the
		// array of days with games that week
		data.contents = new enyo.Collection(data.contents, {model: mdlFile, didFetch: true}); // owner: this <- causes .getId error
		// console.log("mdlDirectory:Data", data);

		return data;
	},
});
