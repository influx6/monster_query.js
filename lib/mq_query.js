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

findHandler:{
	'tag': function(root,selector){
		return root.getElementsByTagName(selector);
	},
	
	'id': function(root,selector){
		return [root.getElementById(selector)];
	},
	
	'class': function(root,selector){
		var result=[],i,nodes = root.getElementsByTagName('*');
		for(i = 0;i < nodes.length;i++){
			if(nodes[i].className.match(selector)){
				result.push(nodes[i]);
			}
		}
		
		return result;
	},
	
	'tag_id': function(root,tag,selector){
		var result,i,nodes = root.getElementsByTagName(tag);
		for(i=0; i < nodes.length; i++){
			if(nodes[i].getAttribute('id') == selector){
				result.push(nodes[i]);
			}
		}
		return result;
	},
	
	'tag_class': function(root,tag,selector){
		var result,i,nodes = root.getElementsByTagName(tag);
		for(i=0; i < nodes.length; i++){
			if(nodes[i].getAttribute('class') == selector){
				result.push(nodes[i]);
			}
		}
		return result;
	}
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
	}else if(tests.tag.test(selector)){
		this._sorter(selector,checks.tags_combo,result);
		type="tag";
	}
	
	map['selector']=result; map['type']=type;
	
	return map;
},


mapQuery : function(selector){
	if(typeof selector != "string"){ throw new Error("selector is not a string") }
	
	var result=[];
	var reg = this._checker;
	
	selector = this._query_sanitize(selector,/^[\s]+/ig,'');
	selector = this._query_sanitize(selector,/>+|\++/ig,'');
	selector = this._query_sanitize(selector,/\s+/ig,' ');
	
	return this.mapBreaker(selector);
},


get : function(selector){
	var handler,selector = this.mapQuery(selector);
	
	//if(this.new_properties['querySelector']){
	//	handler = this.dom.querySelectorAll;
	//};
	
	handler = this.findHandler[selector.type];
	
	var root = selector.selector[0];
	
	this.onEach(selector.selector,function(o,b,i){
		console.log(o,i);
	},this);
	
	return handler;
},

getAll: function(selector){
	var handler;
	
	//if(this.new_properties['querySelectorAll']){
	//	handler = this.dom.querySelector;
	//}
	
}

});

