//query class
MonsterQuery.core.Query= Stub.create("MonsterQuery.Query",{

initialize : function(global){
		this.module = MonsterQuery.core;
		this.cache = {};
		this.object_cache = {};
		this.dom = global;
		this.new_properties= this.chkDOMProperties();
},

_sorter : function(obj,reg,result){	
	if(!obj){ return; }	

		var o = obj.match(reg),self=this;
		if(o){
			result.push(o[1]);
			if(o[2] != undefined){
				self._sorter(o[2],reg,result);
			}
		}
	
},

_checker : {
	
	tests:{
		'tag':/^([^\W][a-zA-Z]*)/,
		'class':/(^\.[a-zA-Z0-9-_]+)/,
		'id':/(^#[a-zA-Z0-9-_]+)/,
		'tag_id':/(^[a-zA-z]+#[-_A-Za-z0-9]+)/,
		'tag_class':/([a-zA-z]+\.[-_A-Za-z0-9]+)/
	},
	
	selectors:{
		'id_class':/(^[#|\.][a-zA-Z0-9-_]+)[^\S]?([\w\W]+)?/,
		'tag_id_class':/(^[a-zA-z]+[#|\.][-_A-Za-z0-9]+)[^\S]?([\W\w]+)?/,
		'tags_combo':/([\w]+|[\.\w|#\w]+)[^\S]?([\w\W]+)?/,
	}
},

_query_sanitize: function(word,token,rtoken){
	word = word.replace(token,rtoken);
	return word;
},

chkDOMProperties : function(){
	var new_properties={
		'querySelector': false,
		'querySelectorAll': false,
		'getElementByClassName': false
	};
	
	if('querySelector' in this.dom){
		new_properties['querySelector']=true;
	}
	if('querySelectorAll' in this.dom){
		new_properties['querySelectorAll']=true;
	}
	
	
	return new_properties;
},

mapBreaker: function(selector){
	var self=this,result=[],tests = this._checker.tests,checks=this._checker.selectors;
	var map={},type="";
	
	if(tests.id.test(selector)){
		this._sorter(selector,checks.id_class,result);
		type="id";
	}else if(tests.class.test(selector)){
		this._sorter(selector,checks.id_class,result);
		type="class";
	}else if(tests.tag_id.test(selector)){
		this._sorter(selector,checks.tag_id_class,result);
		type="tag_id";
	}else if(tests.tag_class.test(selector)){
		this._sorter(selector,checks.tag_id_class,result);
		type="tag_class";	
	}else{
		this._sorter(selector,checks.tags_combo,result);
		type="tag_bomb";
	}
	
	map['selector']=result; map['type']=type;
	
	return map;
},


get : function(selector){
	if(typeof selector != "string"){ throw new Error("selector is not a string") }
	
	var result=[],map;
	var reg = this._checker;
	
	selector = this._query_sanitize(selector,/^[\s]+/ig,'');
	selector = this._query_sanitize(selector,/>+|\++/ig,'');
	selector = this._query_sanitize(selector,/\s+/ig,' ');
	
	var root = this.mapBreaker(selector);
	var map = root.splice(1,root.length);
	
	return module.Elements.create(root,map);
},


});

