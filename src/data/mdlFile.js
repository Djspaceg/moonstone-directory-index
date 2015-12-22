/// File Model ////////////////////////////////////////////
var
	kind = require('enyo/kind'),
	Model = require('enyo/Model');

module.exports = kind({
	name: 'mdlFile',
	kind: Model,

	readOnly: true,
	icon: function () {
		var media = this.get('hasMedia');
		if (media) {
			return 'http://' + this.get('app').get('fileServerHost') + this.get('path') + media;
		}
		return this.getIconSrc(this.get('ext'));
	},
	lastModified: function () {
		return new Date(this.get('mtime'));
	},
	prettySize: function() {
		return this.formatSize(this.get('size'));
	},
	prettyLastModified: function () {
		var d = this.get('lastModified');
		return this.formatDate(d);
	},
	computed: {
		icon: [{cached: true}, 'ext'],
		lastModified: [{cached: true}],
		prettySize: [{cached: true}, 'size'],
		prettyLastModified: [{cached: true}, 'lastModified']
	},
	primaryKey: 'path',
	icons: {
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
	},
	formatSize: function(size) {
		var arrSizes = ['bytes','KB','MB','GB','TB'];
		if (size > 0) {
			for (var i = 0; i < arrSizes.length; i++) {
				if ((size >> (10 * i)) === 0) {
					return (size >> (10 * (i-1))) + ' ' + arrSizes[i-1];
				}
			}
		}
		return '0 ' + arrSizes[0];
	},
	zeroPad: function(inNum) {
		return (inNum < 10 && inNum > -10) ? '0' + inNum : inNum;
	},
	formatDate: function(date) {
		var arrMonths = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
		return arrMonths[date.getMonth()] + ' ' + date.getDate() + ' ' + (1900 + date.getYear()) + ' ' + date.getHours() + ':' + this.zeroPad(date.getMinutes()) + ':' + this.zeroPad(date.getSeconds());
	},
	getIconSrc: function(ext) {
		return this.icons[ext] || this.icons['generic'];
	}
});
