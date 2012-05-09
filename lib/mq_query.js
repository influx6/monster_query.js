//query class
MonsterQuery.core.Query = Stubs.create("MonsterQuery.Query",{

init : function(global){
		this.module = MonsterQuery.core;
		this.cache = {};
		this.dom = global;
		if(!global){ return; }
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
		return this._getID(root,selector.split('#')[1]);
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

_getID: function(root,id){
	return [root.getElementByID(id)];
},

_getTag: function(root,selector){
	if(!root || !selector){ return };
		return root.getElementsByTagName(selector);
},

_getMapSelector: function(root,tag,attribute,selector){
	if(!root || !selector || !tag || !attribute){
		return;
	};
	
	var result=[],i,nodes = root.getElementsByTagName(tag);
	for(i=0; i < nodes.length; i++){
			if(nodes[i].getAttribute(attribute) == selector){
				result.push(nodes[i]);
			}
	}
	return result;
},


get: function(selector,callback){
	var res = this._getElement(this.dom,selector);
	return this.module.Element.extend(res);
},

getAttr: function(tag,attr,value,callback){
	var res = this._getMapSelector(this.dom,tag,attr,value);
	
	return this.module.Element.extend(res);
},

getSelector: function(selector,callback){
 
	if(this.isObjectType(selector,"string")){
		var map = this._querinize_string(selector).split(' ');
	}else{
		var map = selector;
	}
	
	var res = this._getElement(this.dom,map[0]);
	map = map.splice(1,map.length);
	
	while(map.length > 0){
		res = this._search(res,map[0]);
		map = map.splice(1,map.length);
	}
	
	return this.module.Element.extend(res);	
},


});

