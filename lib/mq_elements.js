MonsterQuery.core.Elements = Stub.create("MonsterQuery.Elements",{
	create: function(parent,map){
		this.parent = parent;
		this.map = map;
	},
	
	mapNode: function(){
	 	this.onEach(this.node.children,function(o,b){
			console.log(o);
		},this);
	},
	
	children: function(){},
	

	tag: function(selector){
			console.log(selector);
			return this.dom.getElementsByTagName(selector);
		},

	id: function(selector){
			return this.dom.getElementById(selector);
		},

	class: function(root,selector){
			var result=[],i,nodes = this.dom.getElementsByTagName('*');
			for(i = 0;i < nodes.length;i++){
				if(nodes[i].className === selector){
					result.push(nodes[i]);
				}
			}

			return result;
		},

	tag_id: function(root,selector){
			var result,i,nodes = this.dom.getElementsByTagName(tag);
			for(i=0; i < nodes.length; i++){
				if(nodes[i].getAttribute('id') == selector){
					result.push(nodes[i]);
				}
			}
			return result;
		},

	tag_class: function(root,selector){
			var result,i,nodes = this.dom.getElementsByTagName(tag);
			for(i=0; i < nodes.length; i++){
				if(nodes[i].getAttribute('class') == selector){
					result.push(nodes[i]);
				}
			}
			return result;
		},
	
});