MonsterQuery.core.Elements = Stub.create("MonsterQuery.Elements",{
	create: function(node){
		this.node = node;
		this.map = this.mapNode();
	},
	
	mapNode: function(){
	 	this.onEach(this.node.children,function(o,b){
			console.log(o);
		},this);
	},
	
	children: function(){},
	
	
});