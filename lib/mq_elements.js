MonsterQuery.core.Element = Stub.create("MonsterQuery.Element",{
	
	initialize: function(root){
		this.root = this._getElement(root);
		this.current = this.root;
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

	_getId: function(root,selector){
			if(!root || !selector){ throw new Error("Arguments giving is Incorrect")};

			if(selector.match(/^#\w/)){
				selector = selector.split('#')[1];
			}
			return [root.getElementById(selector)];
	},

	_getClass: function(root,selector){
		if(!root || !selector){ throw new Error("Arguments giving is Incorrect")};
			var result=[],i,nodes = root.getElementsByTagName('*');
			for(i = 0;i < nodes.length;i++){
				if(nodes[i].className === selector){
					result.push(nodes[i]);
				}
			}

			return result;
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

	useResult: function(callback){ callback.call(this,this.current); },
	
	grab: function(pos){	
		if(pos){return this.current[pos];}
		return this.current;
	},
	
	first: function(){
		if(this.current){
			return this.current[0];
	  	}
	},
	
	last: function(){
		if(this.current && this.current.length > 1){
			return this.current[this.current.length - 1];
		}else{
			return this.first();
		}
	},
	
	size: function(){
		return this.current.length;
	},
	
	get: function(selector,callback){
		var m = this.current;
		var g = this._search(m,selector);
		this.current = g;
		
		if(callback){ this.useResult(callback); }
		
		return this;
	},
	
	getAttr: function(selector,attr,value,callback){
		var m = this.current;
		var g = this._search(m,selector,attr,value);
		this.current = g;
		
		if(callback){ this.useResult(callback); }
		return this;
	},
	
	getSelector: function(){
		
	},
	
	toString: function(){
		return this.className;
	}
});