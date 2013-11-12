#!/usr/bin/env node

// 
// Consider using this instead of Apache:
// `twistd -n web -p 8888 --path .`
// 

/// From:
/// http://nodeexamples.com/2012/09/28/getting-a-directory-listing-using-the-fs-module-in-node-js/
///

var fs = require("fs"),
	path = require("path");

exports.getDirectory = function(p, funIn) {
	p = path.normalize(p);
	fs.readdir(p, function (err, files) {
		var arrFiles = [];
		if (err) {
			throw err;
		}

		files.map(function (file) {
			return path.join(p, file);
		}).filter(function (file) {
			return fs.statSync(file).isFile();
		}).forEach(function (file) {
			// console.log("%s (%s)", file, path.extname(file));
			var objStats = fs.statSync(file),
				objFile = {
					name: path.basename(p),
					size: objStats.size,
					mtime: objStats.mtime,
					path: file,
					ext: path.extname(file).replace(/^\./, "")
			};
			// console.log("File: ", objFile);
			arrFiles.push(objFile);
		});
		// console.log("arrFiles: ", arrFiles);
		funIn(arrFiles);
	});
};
