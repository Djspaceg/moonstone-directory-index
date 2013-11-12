String.prototype.toUCFirst = function() {
	return this.charAt(0).toUpperCase() + this.substr(1);
};
String.prototype.toWordCase = function() {
	return this.replace(/\w\S*/g, function(txt) {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};
