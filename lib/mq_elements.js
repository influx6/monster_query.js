MonsterQuery.core.Element = {
	
	ObjectClassName: "MonsterQuery.Element",	
	
	extend : function(o){
			var elem = {};
			elem.elements = o;
			elem.size = elem.length = o.length;
			
			elem.get=function(selector,callback){
				var res = this.super._search(this.elements,selector);
				
				return MonsterQuery.core.Element.extend(res);
			};
			
			elem.getAttr = function(selector,attr,value,callback){
				var res = this.super._search(this.elements,selector,attr,value);
				
				return MonsterQuery.core.Element.extend(res);
			};
			
			elem.getSelector = function(selector,callback){
				
				if(this.super.isObjectType(selector,"string")){
					var map = this.super._querinize_string(selector).split(' ');
				}else{
					var map = selector;
				}

				var res = this.elements;
				
				while(map.length > 0){
					res = this.super._search(res,map[0]);
					map = map.splice(1,map.length);
				}
				
				return MonsterQuery.core.Element.extend(res);
				
			};
			
			elem.useResult = function(callback){
					if(!callback){  return this; };

					this.onEach(this.elements, function(o,b,i){
						callback.call(this,o,b,i);
					},this); 
					return this;
			};
			
			elem.super= {
				
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
					var tests = {
							'class':/(^\.[a-zA-Z0-9-_]+)/,
							'id':/(^#[a-zA-Z0-9-_]+)/,
							'tag_id':/(^[a-zA-z]+#[-_A-Za-z0-9]+)/,
							'tag_class':/(^[a-zA-z]+\.[-_A-Za-z0-9]+)/
					};

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

			}
			
			Stubs.share(elem.super,['proxy','map','onEach','getObjectType','isObjectType']);
			
			return elem;
	},

	
};