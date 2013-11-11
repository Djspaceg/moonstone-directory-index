/// DataList, B.DirectoryIndex ///
enyo.kind({
	name: "B.DirectoryIndex",
	kind: "moon.DataList",
	published: {
		url: "",
		pageSource: "",
		baseTableData: []
	},
	components: [
		{kind: "B.DirectoryIndexRow", 
			// handlers: {
				// ontap: "fetch",
				// ontap: ".fetch"
				// ontap: ".$.fetch"
				// ontap: ".model.fetch"
				// ontap: ".controller.fetch"
				// ontap: ".owner.fetch"
				// ontap: ".$.owner.fetch"
				// ontap: ".container.fetch"
				// ontap: ".$.container.fetch"
				// ontap: "$.container.fetch"
				// ontap: "container.fetch"
				// ontap: "self.fetch"
				// ontap: "this.fetch"
				// ontap: ".this.fetch"
			// },
			bindings: [
				{from: ".model.href", to: ".href"},
				{from: ".model.icon", to: ".icon"},
				{from: ".model.title", to: ".title"},
				{from: ".model.size", to: ".size"},
				{from: ".model.date", to: ".date"}
			]
		}
	],
	create: function() {
		this.inherited(arguments);
		this.loadTable( document.getElementsByTagName("table")[0] );
		this.buildTable();
	},
	// rendered: function () {
	// 	this.inherited(arguments);
	// },
	buildTable: function() {
		var c = new enyo.Collection();
		for (var i=0, r=[]; i < this.baseTableData.length; i++) {
			r.push({
				href: this.baseTableData[i][1].href,
				icon: this.baseTableData[i][0].src,
				title: this.baseTableData[i][1].content,
				size: this.baseTableData[i][3].content,
				date: this.baseTableData[i][2].content
			});
		}
		c.add(r);
		this.set("collection", c);
	},
	loadTable: function(eleTable) {
		if (typeof eleTable === "string") eleTable = document.getElementById(eleTable);
		this.baseTableData = [];
		for (var i = 0; i < eleTable.rows.length; i++) {
			this.baseTableData[i] = [];
			for (var j=0; j < eleTable.rows[i].cells.length; j++) {
				var eleTag,
					r = {},
					eleCell = eleTable.rows[i].cells[j];
				r.content = eleCell.textContent;
				eleTag = eleCell.getElementsByTagName("a") || [];
				if (eleTag.length) r.href = eleTag[0].href;
				eleTag = eleCell.getElementsByTagName("img") || [];
				if (eleTag.length) r.src = eleTag[0].src;
				this.baseTableData[i].push( r );
			};
		};
	},
	// fetchTable: function() {

	// },
	fetchMe: function() {
		console.log("firing fetch");
		var ajax = new enyo.Ajax({
			url: this.get("url")
		});
		// send parameters the remote service using the 'go()' method
		// ajax.go({
		// 	q: this.$.query.getValue()
		// });
		// attach responders to the transaction object
		ajax.response(this, "processResponse");
		// handle error
		ajax.error(this, "processError");
	},
	processResponse: function(inSender, inResponse) {
		// do something with it
		// this.$.textArea.setValue(JSON.stringify(inResponse, null, 2));
		console.log("inResponse",inResponse);

	},
	processError: function(inSender, inResponse) {
		var errorLog = "Error" + ": " + inResponse + "! " + (JSON.parse(inSender.xhrResponse.body)).error.description;
		// this.$.textArea.setValue(JSON.stringify(inSender.xhrResponse, null, 2));
		window.alert(errorLog);
		// this.$.basicPopup.show();
	}
});
