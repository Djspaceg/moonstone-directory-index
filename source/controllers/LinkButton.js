enyo.kind({
	name: "B.LinkButton",
	kind: "moon.ToggleButton",
	small: true,
	onContent: "",
	offContent: "",
	labelSeparator: "",
	classes: "moon enyo-fit",
	published: {
		href: ""
	},
	handlers: {
		ontap: "onTap"
	},
	onTap: function() {
		if (this.href) this.app.goToHref(this.href);
	}
});