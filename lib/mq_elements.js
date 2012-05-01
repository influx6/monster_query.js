MonsterQuery.core.Element = Stub.create("MonsterQuery.Element",{
	
	initialize: function(root){
		this.module = MonsterQuery.core;
		this.root = root;
		this.data = {};

	},
	
	elements: function(){
			return this.root;
	},
		
	pushData : function(key,value){
		this.data[key]=value;
	},
	
	popData: function(key){
		delete this.data[key];
	},
	
	clearData: function(){
		this.data = {};
	},
	
	_query_sanitize: function(word,token,rtoken){
		word = word.replace(token,rtoken);
		return word;
	},
	
	_querinize_string: function(selector){
		selector = this._query_sanitize(selector,/^[\s]+/ig,'');
		selector = this._query_sanitize(selector,/>+|\++/ig,'');
		selector = this._query_sanitize(selector,/\s+/ig,' ');
		selector = this._query_sanitize(selector,/(\s+)$/ig,'');

		return selector;
	},
	
	_checker : {
			'class':/(^\.[a-zA-Z0-9-_]+)/,
			'id':/(^#[a-zA-Z0-9-_]+)/,
			'tag_id':/(^[a-zA-z]+#[-_A-Za-z0-9]+)/,
			'tag_class':/(^[a-zA-z]+\.[-_A-Za-z0-9]+)/
	},
		
	_search: function(m,selector,attribute,value){
		var search = m,result=[];
		this.map(search,function(o){
			if(!attribute && !value){
				var c = this._getElement(o,selector);
			}else{
				var c = this._getElementWithAttribute(o,selector,attribute,value)
			}
			if(c && c.length > 0){
				this.onEach(c,function(o){ result.push(o);},this);
			}
		},this);
		
		return result;
	},

	_getElementWithAttribute: function(root,selector,attribute,value){
		return this._getMapSelector(root,selector,attribute,value);
	},
	
	_getElement: function(root,selector){
		var s = selector;
		var tests = this._checker;
		
		if(tests.id.test(selector)){
			return this._getMapSelector(root,'*','id',selector.split('#')[1]);
		}else if(tests.class.test(selector)){
			return this._getMapSelector(root,'*','class',selector.split('.')[1]);
		}else if(tests.tag_id.test(selector)){
			var v=selector.split('#');
			return this._getMapSelector(root,v[0],'id',v[1]);
		}else if(tests.tag_class.test(selector)){
			var v=selector.split('.')
			return this._getMapSelector(root,v[0],'class',v[1]);
		}else{
			return this._getTag(root,selector);
		}
	}, 

	_getTag: function(root,selector){
		if(!root || !selector){ throw new Error("Arguments giving is Incorrect")};
			return root.getElementsByTagName(selector);
	},

	_getMapSelector: function(root,tag,attribute,selector){
		if(!root || !selector || !tag || !attribute){
			 throw new Error("Arguments giving is Incorrect")
		};

			var result=[],i,nodes = root.getElementsByTagName(tag);
			for(i=0; i < nodes.length; i++){
				if(nodes[i].getAttribute(attribute) == selector){
					result.push(nodes[i]);
				}
			}
			return result;
	},

	useResult: function(callback,obj){
		if(!callback){  return this; };
		
		this.onEach(this.root, function(o,b,i){
			callback.call(this,o,b,i);
		},this); 
		return this;
	},
	
	grab: function(pos){	
		if(pos){return this.root[pos];}
		return this.root;
	},
	
	parent: function(callback){
		var map = this.map(this.root,function(o,b,i){
			return o.parentNode;
		});
		
		return new this.module.Element(map).useResult(callback);	
	},
	
	odd: function(callback){
			var self = this;
		  	var odd = this.map(this.root,function(o,b,i){
				if(i%2 == 0){
					if(callback){ callback.call(self,o); }
					return o;
				}
			});
			
			return odd;
	},
	
	even: function(callback){
		var self = this;
		var even = this.map(this.root,function(o,b,i){
			if(i%2 != 0){
				if(callback){ callback.call(self,o); }
				return o;
			}
		});
		
		return even;
	},
	
	size: function(){
		return this.root.length;
	},
	
	addClass: function(c){
	  this.onEach(this.root, function(o){
		if(o.nodeType == 1 && o.className && !this.has(c,o.className.split(/\s+/))){
				o.className += " "+ c;
		 }
		},this);
		return this;
	},
	
	removeClass: function(c){
		this.onEach(this.root, function(o){
			var p = o.className.split(/\s+/);
			if(o.nodeType == 1 && o.className && this.has(p,c)){
				o.className = this.map(p,function(o){
					if(o != c){
						return o;
					}
				}).join(' ');
			 }
		},this);
		return this;
	},
	
	css: function(prop,o){
		if(o && 'nodeType' in o){
			
			this.onEach(prop, function(e,b){
				if(o.nodeType == 1){
					o.style[e]=b[e];
		 	 	}
			});
					
		}else{
			
			var obj=o;
			if(!o){ obj = this.root; }
			this.map(obj,function(f){
				this.onEach(prop, function(e,b){
					if(f.nodeType == 1){
						f.style[e]=b[e];
		 	 		}
				});
				},this);
		}
		return this;
	},
	
	
	get: function(selector,callback){
		var res = this._search(this.root,selector);
				
		return new this.module.Element(res).useResult(callback);
	},
	
	getAttr: function(selector,attr,value,callback){
		var res = this._search(this.root,selector,attr,value);
				
		return new this.module.Element(res).useResult(callback);
	},
	
	getSelector: function(selector,callback){
		
		if(this.isObjectType(selector,"string")){
			var map = this._querinize_string(selector).split(' ');
		}else{
			var map = selector;
		}
		
		var res = this.root;
		
		while(map.length > 0){
			res = this._search(res,map[0]);
			map = map.splice(1,map.length);
		}
			
		return new this.module.Element(res).useResult(callback);
	},
	
	toString: function(){
		return this.className;
	}
});