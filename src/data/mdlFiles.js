/// Files Collection //////////////////////////////////////
var
	kind = require('enyo/kind'),
	Model = require('enyo/Model');

var
	NocheCollection = require('./NocheCollection');

var icons = {
	// GENERAL ICONS (BLANK, DIRECTORY, PARENT DIRECTORY)
	'folder':	'@@./assets/icons/128/folder-128.png',
	'parent':	'@@./assets/icons/128/fill-folder-128.png',
	'generic':	'@@./assets/icons/128/blank-file-128.png',

	// EXTENSION SPECIFIC ICONS
	'txt':		'@@./assets/icons/128/text-file-128.png',
	'md':		'@@./assets/icons/128/text-file-128.png',
	'gif':		'@@./assets/icons/128/gif-128.png',
	'png':		'@@./assets/icons/128/png-128.png',
	'jpg':		'@@./assets/icons/128/jpg-128.png',
	'jpeg':		'@@./assets/icons/128/jpg-128.png',
	'css':		'@@./assets/icons/128/css-128.png',
	'less':		'@@./assets/icons/128/css-128.png',
	'js':		'@@./assets/icons/128/js-128.png',
	'design':	'@@./assets/icons/128/text-file-128.png',
	'json':		'@@./assets/icons/128/text-file-128.png',
	'html':		'@@./assets/icons/128/html-128.png',
	'htm':		'@@./assets/icons/128/html-128.png',
	'php':		'@@./assets/icons/128/logo-php-128.png',
	'dmg':		'@@./assets/icons/128/dmg-128.png',
	'exe':		'@@./assets/icons/128/exe-128.png',
	'mov':		'@@./assets/icons/128/mov-128.png',
	'ogg':		'@@./assets/icons/128/ogg-128.png',
	'avi':		'@@./assets/icons/128/avi-128.png',
	'mpg':		'@@./assets/icons/128/mpg-128.png',
	'pdf':		'@@./assets/icons/128/pdf-128.png',
	'rar':		'@@./assets/icons/128/rar-128.png',
	'wma':		'@@./assets/icons/128/wma-128.png',
	'zip':		'@@./assets/icons/128/zip-128.png',
	'mp3':		'@@./assets/icons/128/mp3-128.png',
	'flv':		'@@./assets/icons/128/flv-128.png'
};

// Utility functions for pretty formatting of the model data.
var formatSize = function(size) {
	var arrSizes = ['bytes','KB','MB','GB','TB'];
	if (size > 0) {
		for (var i = 0; i < arrSizes.length; i++) {
			if ((size >> (10 * i)) === 0) {
				return (size >> (10 * (i-1))) + ' ' + arrSizes[i-1];
			}
		}
	}
	return '0 ' + arrSizes[0];
};
var zeroPad = function(inNum) {
	return (inNum < 10 && inNum > -10) ? '0' + inNum : inNum;
};
var formatDate = function(date) {
	var arrMonths = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	return arrMonths[date.getMonth()] + ' ' + date.getDate() + ' ' + (1900 + date.getYear()) + ' ' + date.getHours() + ':' + zeroPad(date.getMinutes()) + ':' + zeroPad(date.getSeconds());
};
var getIconSrc = function(model) {
	if (model.ext.match(/^(jpg|jpeg|png|gif|webp|tbn)$/i)) {
		return model.fullUrl;
	} else if (model.hasMedia) {
		return model.fullUrl + model.hasMedia;
	}
	return icons[model.ext] || icons['generic'];
};

// File model
var mdlFile = kind({
	name: 'mdlFile',
	kind: Model,
	readOnly: true,
	primaryKey: 'path'
});

module.exports = kind({
	name: 'mdlFiles',
	kind: NocheCollection,
	model: mdlFile,
	options: {
		parse: true
	},
	// primaryKey: 'name',
	parse: function (data) {
		// Give our precious app reference to all of our file models
		for (var i = data.length - 1; i >= 0; i--) {
			var m = data[i];
			m.app = this.app;
			m.fullUrl = 'http://' + this.app.get('fileServerHost') + m.path;
			m.icon = getIconSrc(m);
			m.lastModified = new Date(m.mtime);
			m.prettySize = formatSize(m.size);
			m.prettyLastModified = formatDate(m.lastModified);
		}
		return data;
	}
});
