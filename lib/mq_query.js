//query class
MonsterQuery.core.Query = Stub.create("MonsterQuery.Query",{

initialize : function(global){
		this.module = MonsterQuery.core;
		this.map_cache = {};
		this.dom = global;
		if(!global){ throw new Error("No Argument error!");}
},

_checker : {
		'class':/(^\.[a-zA-Z0-9-_]+)/,
		'id':/(^#[a-zA-Z0-9-_]+)/,
		'tag_id':/(^[a-zA-z]+#[-_A-Za-z0-9]+)/,
		'tag_class':/(^[a-zA-z]+\.[-_A-Za-z0-9]+)/
},

_query_sanitize: function(word,token,rtoken){
	word = word.replace(token,rtoken);
	return word;
},

_pushCache: function(key,e){
	var status = this.has(key,this.map_cache);
	if(!status){
		this.map_cache[key] = e;
	}
},

_querinize_string: function(selector){
	selector = this._query_sanitize(selector,/^[\s]+/ig,'');
	selector = this._query_sanitize(selector,/>+|\++/ig,'');
	selector = this._query_sanitize(selector,/\s+/ig,' ');
	selector = this._query_sanitize(selector,/(\s+)$/ig,'');
	
	return selector;
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

get : function(selector,callback){
	if(typeof selector != "string"){ throw new Error("selector is not a string"); }
		
	selector = this._querinize_string(selector).split(' ')[0];
	
	var element = new this.module.Element(this._getElement(this.dom,selector));
	if(callback){ element.useResult(callback); }
	
	return element;
},

getSelector: function(selector,callback){
	if(typeof selector != "string"){ throw new Error("selector is not a string") }
	
	selector = this._querinize_string(selector).split(' ');
	var root = selector[0];
	var map = selector.splice(1,selector.length);

	var element = new this.module.Element(this._getElement(this.dom,root)).getSelector(map);
	if(callback){ element.useResult(callback); }

	return element;
},



});

