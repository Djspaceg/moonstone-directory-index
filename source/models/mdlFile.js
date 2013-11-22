enyo.kind({
	name: "mdlFile",
	kind: enyo.Model,
	// mergeKeys: ["day"],
	// this is a read-only example, and this flag means if _destroy_ is called on this
	// model it will only do the local routines
	readOnly: true,
	attributes: {
		title: "",
		size: "",
		// icon: "",
		ext: "",
		href: "",
		lastModified: function () { 
			return new Date(this.get("mtime"));
		},
		prettyLastModified: function () {
			var d = this.get("lastModified");
			// var d = this.get("mtime");
			// d = d.replace(/T/, " ");
			// d = d.replace(/\..*$/, "");
			// var objDate = enyo.dateToIlib(d);
			var objDate = new ilib.Date.GregDate({unixtime: d.getTime()});
			var objDateFmt = new ilib.DateFmt({date: 'dmw', length: 'long'});
			// console.log("objDateFmt.format(objDate)",objDateFmt.format(objDate));
			return objDateFmt.format(objDate);
		},
	},
	computed: {
		lastModified: [{cached: true}],
		prettyLastModified: [{cached: true}, "lastModified"]
	},
	primaryKey: 'name',
	parse: function (data) {
		// convert the array of games data hashes into a collection
		// of game records
		
		// var f = this.get("file");
		// we know that if there isn't a _home_ already this is our first time receiving
		// this data so we don't want to merge, we create our school entries
		// if (!f) {
			// data = new B.File(data);
		// } else {
			// since we're just merging the data and we know its current structure
			// doesn't need to be parsed we just call this to let anything know if
			// something has changed
			// h.setObject(data.home);
			// a.setObject(data.away);
			// remove these entries from the dataset so
			// they won't override our current objects
			// delete data.home;
			// delete data.away;
		// }
		// var objNewFile = enyo.createComponent({name: "fileManual", kind: "B.File"}, data);
		// var objNewFile = new enyo.Component({name: "fileManual", kind: "B.File"}); // owner: this <- causes .getId error
		console.log('parse.data:', data);
		// return data;
		// if (data && !(data.games instanceof enyo.Collection)) {
			// because this collection is getting its data from us here it doesn't know if
			// it needs to tell the records to parse the data when they are instanced so we
			// use the _didFetch_ flag and now the `parse` method of the Game model kind will be called
			// also note the use of the _owner_ property here that is only useful if you destroy this
			// GameDay model (the owner of the the collection we're creating) it will also destroy
			// the collection since we _own_ it
			// data = this.$.createComponent({kind: "B.File", owner: this});
			// this.set("directoryContents", data.games);
			// console.log('Creating a new games collection with %s games in it.', data.games.length);
		// }
		// return data;
		// data.file = new B.File(data);
	// 	console.log("mdlFile:Data", data);

		return data;
	}
});
