enyo.Settings = {};
enyo.depends(
	// Cordova (PhoneGap) library
	// "$lib/enyo-cordova",
	// webOS-specific kind library
	// "$lib/enyo-webos",
	// Layout library
	"$lib/layout",
	// Internationalization library
	// "$lib/enyo-ilib",
	// Moonstone UI library
	"$lib/moonstone",
	// Focus support library for TV applications
	"$lib/spotlight",
	// CSS/LESS style files
	"style",

	// Configuration files and definitions
	"../conf",
	// Model and data definitions
	"data",
	// Controller kinds for the application(s)
	"controllers",
	// View kind definitions
	"views",
	// Include our default entry point
	"app.js"
);
