//query class
MonsterQuery.core.Query= Stub.create("MonsterQuery.Query",{

initialize : function(global){
		if(!global){ throw new Error("No Argument error!");}
		this.module = MonsterQuery.core;
		this.cache = {};
		this.dom = global;
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

_querinize_string: function(selector){
	selector = this._query_sanitize(selector,/^[\s]+/ig,'');
	selector = this._query_sanitize(selector,/>+|\++/ig,'');
	selector = this._query_sanitize(selector,/\s+/ig,' ');
	selector = this._query_sanitize(selector,/(\s+)$/ig,'');
	
	return selector;
},

get : function(selector,callback){
	if(typeof selector != "string"){ throw new Error("selector is not a string") }
		
	selector = this._querinize_string(selector).split(' ')[0];
	var element = new this.module.Element(selector,this.dom);
	
	if(callback){ element.useResult(callback); }
	
	return element;
},

getSelector: function(selector,callback){
	if(typeof selector != "string"){ throw new Error("selector is not a string") }
		
	var s = this._querinize_string(selector).split(' ');
	var root = s[0];
	var map = s.splice(1,selector.length);
		
	var element = new this.module.Element(root,this.dom);
	element.getSelector(map);
	
	if(callback){ element.useResult(callback); }
	
	return element;
}

});

