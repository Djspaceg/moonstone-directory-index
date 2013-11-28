enyo.kind({
	name: "B.File",
	kind: "moon.Item",
	// kind: "FittableColumns",
	// mixins: ["FittableColumns"],
	classes: "directory-index-row",
	published: {
		href: "",
		// icon: "",
		title: "",
		size: "",
		lastModified: new Date()
	},
	handlers: {
		ontap: "goToHref"
		// ontap: "fetch"
	},
	// layoutKind: "FittableColumnsLayout",
	components: [
		{kind: "FittableColumns", components: [
			{kind: "moon.Icon", name: "icon", classes: "row-icon"},
			{name: "title", classes: "row-title", fit: true,  mixins: ["moon.MarqueeSupport", "moon.MarqueeItem"]},
			{name: "size", classes: "row-size text", mixins: ["moon.MarqueeItem"]},
			{name: "lastModified", classes: "row-date-mod text", mixins: ["moon.MarqueeSupport", "moon.MarqueeItem"]}
		]},
	],
	// bindings: [
	// 	{from: ".model.href", to: ".href"},
		// {from: ".model.icon", to: ".$.icon.src"},
		// {from: ".model.name", to: ".$.title.content"},
	// 	{from: ".model.size", to: ".$.size.content"},
	// 	{from: ".model.date", to: ".$.date.content"},
	// ],
    create: function() {
        this.inherited(arguments);
        this.hrefChanged();
        // this.iconChanged();
        // this.titleChanged();
        this.sizeChanged();
        this.lastModifiedChanged();
    },
	hrefChanged: function() {
		// this.$.icon.set("src", this.icon);
	},
	// iconChanged: function() {
	// 	this.$.icon.set("src", this.icon);
	// },
	// titleChanged: function() {
	// 	console.log("Manually setting title, from changeEvent.");
	// 	this.$.title.setContent(this.title +" : Directly Set");
	// },
	sizeChanged: function() {
		this.$.size.setContent(this.size);
	},
	lastModifiedChanged: function() {
		this.$.lastModified.setContent(this.lastModified);
	},
	goToHref: function() {
		// this.app.goToHref(this.href);
		// window.alert("Go to: " + this.href);
		console.log("goToHref",this);
	},
	fetch: function() {
		/// Yes, this is stupid, but how else can I call the parent FROM the parent?
		// console.log("Running ignorant local fetch.", this.container);
		console.dir(this.container);
		// this.container.$.fetch();
	}
});
