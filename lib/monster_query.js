var MonsterQuery = MonsterQuery || {};

//sub-spacing
MonsterQuery.core = MonsterQuery.core || {};


//query class
MonsterQuery.core.Query= Stub.create("MonsterQuery.Query",{

reg_checker : {
	tests : {
		'selector':/(^[.|#][_a-z0-9A-Z-]+)/,
		'tag_selector':/(^[a-zA-Z]+)\W/
	},
	
	selectors: {
		'tag':/^[^\W][a-zA-Z]+/,
		'id':/^#[a-zA-Z0-9-_]+/,
		'class':/^\.[a-zA-Z0-9-_]+/,
		'tag_and_id':/(^[a-zA-z]+#[-_A-Za-z0-9]+)([\W\w]+)?/,
		'tag_and_class':/([a-zA-z]+\.[-_A-Za-z0-9]+)([\W\w]+)?/,
		'pseudo_class':''
	}
},

_query_sanitize: function(word,token,rtoken){
	word = word.replace(token,rtoken);
	return word;
},

_query_reg: function(q){
	
	
	if(!result){
		console.error("Selector string is Incorrect!");
	}

},

initialize : function(global){
	this.cache = {};
	this.object_cache = {};
	this.dom = global;
	this.new_properties= this.chkDOMProperties();
},

chkDOMProperties : function(){
	var new_properties={
		'querySelector': false,
		'querySelectorAll': false
	};
	
	if('querySelector' in document){
		new_properties['querySelector']=true;
	}
	if('querySelectorAll' in document){
		new_properties['querySelectorAll']=true;
	}
	
	return new_properties;
},

getDOMHandler: function(type){
	var dom = this.dom;
	if(type == 'id') return dom.getElementById;
	if(type == 'tag') return dom.getElementsByTagName;
	if(type == 'class') return dom.getElementByClass ? dom.getElementByClass('') : this.getClass;
	if(type == 'qs') return dom.querySelector;
	if(type == 'qsa') return dom.querySelectorAll;
},

mapQuery : function(selector){
	if(typeof selector != "string"){ throw new Error("selector is not a string") }
	
    selector = this._query_sanitize(selector,/(^\s+)?/,'');
    selector = this._query_sanitize(selector,' > ',' ');
    selector = this._query_sanitize(selector,' + ',' ');

	var id_string = this._query_reg(selector);

	return id_string;
},


get : function(selector){
	var handler;
	
	if(this.new_properties['querySelector']){
		handler = this.getDOMHandler('qs');
	}
	
	return handler.call(this.dom,selector);
},



});


MonsterQuery.core.Event = Stub.create("MonsterQuery.Event",{});
//aliases



var MQ = {
	Query: MonsterQuery.core.Query,
	Event: MonsterQuery.core.Event
}

