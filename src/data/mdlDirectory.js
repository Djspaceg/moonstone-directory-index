/// Directory Model ///////////////////////////////////////
var
	kind = require('enyo/kind'),
	util = require('enyo/utils'),
	Model = require('enyo/Model');

var
	mdlFiles = require('./mdlFiles');

module.exports = kind({
	name: 'mdlDirectory',
	kind: Model,
	readOnly: true,
	options: {
		parse: true
	},
	attributes: {
		basename: '',
		nfo: '',
		poster: '',
		fanart: '',
		videos: []
	},
	primaryKey: 'key',
	parse: function (data) {
		var collectionId = 'mdlDirectory:' + data.path;
		// data.contents = new enyo.Collection(data.contents, {id: collectionId, model: 'mdlFile', didFetch: true, owner: this}); // owner: this <- causes .getId error
		data.contents = new mdlFiles(data.contents, {id: collectionId, app: data.app, didFetch: true, owner: this}); // owner: this <- causes .getId error
		// data.contents = this.createComponent({kind: 'enyo.Collection', collection: data.contents, model: 'mdlFile', didFetch: true}); // owner: this <- causes .getId error
		// data.contents = this.createComponent({name: data.path, url: data.path, kind: 'mdlFiles'});
		data.host = data.app.get('fileServerHost');
		data.key = data.host + data.path;
		data.title = (data.name == '/') ? '/Home' : data.name.toWordCase();
		if (data.hasMedia) {
			var objMedia = this.mediaFolderRecon(data);
			util.mixin(data, objMedia);
		}
		return data;
	},
	/**
	 * for files that match the filetypes patterns, set the keyed (filetype-key) property.
	 * Also set the basename, using any of the file patterns bases.
	 */
	mediaFolderRecon: function(inModel) {
		var filetypes = {
				nfo: /\.nfo$/i,
				poster: /(\.tbn|-poster\.(jpg|png))$/i,
				fanart: /-fanart\.(jpg|png)$/i,
				videos: /\.(mkv|mp4|m4v|avi|mov)$/i
			},
			outData = {
				basename: '',
				nfo: '',
				poster: '',
				fanart: '',
				videos: []
			};

		if (inModel.contents && inModel.contents.map) {
			inModel.contents.map( function(file, index) {
				var name = file.get('name');
				for (var filepattern in filetypes) {
					if (name.match(filetypes[filepattern])) {
						if (util.isArray(outData[filepattern])) {
							outData[filepattern].push( name );
						}
						else {
							outData[filepattern] = name;
						}
						outData.basename = name.replace(filetypes[filepattern], '');
					}
				}
			});
		}
		return outData;
	}
});
