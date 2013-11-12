#!/usr/bin/env node
// 
// original:
// https://gist.github.com/rpflorence/701407
// 

var http = require("http"),
	url  = require("url"),
	path = require("path"),
	fs   = require("fs"),
	B    = require("./getDirectory.js"),
	port = process.argv[2] || 8888;

http.createServer(function(request, response) {

	var uri = url.parse(request.url).pathname
		, filename = path.join(process.cwd(), uri);
	
	var writeEntireResponse = function(intStatus, strContent, objOptions) {
		if (arguments.length == 1) {
			strContent = arguments[0];
			intStatus = 200;
		}
		if (!objOptions) objOptions = {"Content-Type": "text/html"};
		if (strContent === undefined) strContent = "";
		else if (!(strContent instanceof String)) {
			objOptions["Content-Type"] = "application/json";
			strContent = JSON.stringify(strContent);
		}
		response.writeHead(intStatus, objOptions);
		response.write(strContent, "binary");
		response.end();		
	};

	fs.exists(filename, function(exists) {
		if (!exists) {
			// response.writeHead(404, {"Content-Type": "text/plain"});
			// response.write("404 Not Found\n");
			// response.end();
			writeEntireResponse(404, "404 Not Found\n", {"Content-Type": "text/plain"})
			return;
		}

		if (fs.statSync(filename).isDirectory()) {
			fs.exists(filename + '/index.html', function(indexExists) {
				if (indexExists) {
					filename += '/index.html';
				}
				else {
					var directoryIndex = B.getDirectory(filename, function(arrFiles) {
						// console.log("filename", filename, "directoryIndex", arrFiles);
						writeEntireResponse(arrFiles);						
					});
				}
			})
		}

		fs.readFile(filename, "binary", function(err, file) {
			if (err) {        
				// response.writeHead(500, {"Content-Type": "text/plain"});
				// response.write(err + "\n");
				// response.end();
				writeEntireResponse(500, err + "\n", {"Content-Type": "text/plain"})
				return;
			}

			writeEntireResponse(file);
			// response.writeHead(200);
			// response.write(file, "binary");
			// response.end();
		});
	});
}).listen(parseInt(port, 10));

console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");
