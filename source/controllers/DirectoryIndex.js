/// DataList, B.DirectoryIndex ///
enyo.kind({
	name: "B.DirectoryIndex",
	kind: "moon.Panel",
	classes: "moon-7h",
	smallHeader: true,
	title:"Directory Index",
	titleBelow:"Sub-title",
	headerComponents: [
		{name: "toolbar", components: [
			{kind: "moon.IconButton", icon: "drawer", classes: "icon-refresh", ontap: "update"}
		]}
	],
	published: {
		path: "",
		ontaprow: "someEvent",
	},
	components: [
		{name: "directoryList", kind: moon.DataList,
			components: [
				{kind: "B.File", //ontap: ".ontoprow",
					bindings: [
						{from: ".model.path", to: ".path"},
						{from: ".model.isDir", to: ".isDir"},
						{from: ".model.icon", to: ".icon"},
						{from: ".model.name", to: ".title"},
						{from: ".model.hasIndex", to: ".hasIndex"},
						{from: ".model.hasMedia", to: ".hasMedia"},
						{from: ".model.prettySize", to: ".size"},
						{from: ".model.prettyLastModified", to: ".lastModified"},
					]
				}
			],
		}
	],
	bindings: [
		{from: ".model.title", to: ".title"},
		{from: ".model.path", to: ".titleBelow"},
		{from: ".model.contents", to: ".$.directoryList.collection"}
	]
});
