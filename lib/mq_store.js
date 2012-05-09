MonsterQuery.core.Store = {
	storage:{},
	
	pushStore: function(selector,elem){
		if(this.storage[selector]){
			this.storage[selector]=elem;
		}
	},
	
	clearStore: function(){
		this.storage = {};
	},
	
	getItem: function(s){
		return this.storage[s];
	},
	
	removeItem: function(s){
		if(this.storage[s]){
			delete this.storage[s];
		}
	}
};

