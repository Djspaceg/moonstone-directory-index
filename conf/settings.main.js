enyo.Settings.Main = {
	// Name of our directory browser
	// (The base name used in the page or application title)
	titleBase: "Blake's Dev Server",

	// fileServers Section
	// Each line in this section represents a different server.
	// Below, each part ("attribute") of the following lines are described.
	// Each line should end with a comma "," except for the last one.
	fileServers: [
		// hostname: This is the hostname, domain name, or IP address of our data-source
		// port: The port our Noche server above is serving from. A default Noche install will be on port 8888
		// title: What you want to call this server.
		{hostname: "dev", port: "8888", title: "Blake's Dev Server"},
		{hostname: "zion.resourcefork.com", port: "4043", title: "Zion"}
	],

	// Title separator
	// Separate each directory name in the title with this string
	// titleDelimiter: " | "
	// titleDelimiter: " < "
	titleDelimiter: " - "
};
