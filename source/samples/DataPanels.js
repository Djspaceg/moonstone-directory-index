enyo.kind({
	name: "B.samples.DataPanels",
	classes: "moon enyo-fit enyo-unselectable",
	// attributes: {
		panelList: {},
	// },
	components: [
		{name: "panels", kind: "B.DataPanels", classes: "enyo-fit", pattern: "activity",
		components: [
			{kind: "moon.Panel", title: "", headerComponents: [
				{kind: "moon.Button", content: "Add a Panel", ontap: "addPanel"},
				{kind: "moon.Button", content: "Remove Last Panel", ontap: "removePanel"}
			],
			components: [
				{kind: "moon.IconButton", icon: "search", small: false}
			]}
		]}
	],
	bindings: [
		{from: ".panelCollection", to: ".$.panels.collection"}
	],
	published: {
		count: 0
	},
	panelCollection: null,
	create: function() {
		this.inherited(arguments);
		this.set("panelCollection", new enyo.Collection([
			{kind: "moon.Panel", title: this.nextInt() + " Panel", titleBelow: "title below contains content too..."},
			{title: this.nextInt() + " Panel", titleBelow: "title below contains content too..."},
			{title: this.nextInt() + " Panel", titleBelow: "title below contains content too..."},
			{title: this.nextInt() + " Panel", titleBelow: "title below contains content too..."}
		]));
		console.log("B.samples.DataPanels Create:", this);
		// this.$.panels.set("model", this.get("panelCollection"));
	},
	addPanel: function(inSender, inEvent) {
		console.log("addPanel: inSender",inSender, "inEvent", inEvent);
		// this.panelCollection.add({title: "Generated Panel "+ this.get("count"), titleBelow: "title below contains content too..."});
		// console.log("addPanel:this:", this);
	},
	removePanel: function(inSender, inEvent) {
		console.log("removePanel: inSender",inSender, "inEvent", inEvent);
		// this.$.panels.popPanel();
	},
	nextInt: function() {
		this.set("count", this.get("count") + 1);
		return this.get("count");
	}
});
