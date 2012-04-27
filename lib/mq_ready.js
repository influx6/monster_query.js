//aliases

var MQ = (function(w){
	var window = w;
	var dom = window.document;
	var domReady=false
		
		
		var domContentLoaded = function(){
		  if(!domReady){
			if(dom.addEventListener){
				dom.addEventListener("DOMContentLoaded",function(){
					domReady = true;
				},false);
			}
		 }
		};
		
		var readyStateCheck = function(){
			if(!domReady){
				var timer = window.setInterval(function(){
					if("loaded|complete".indexOf(document.readyState) != -1){
						domReady = true;
					}
					if(domReady){
						window.clearInterval(timer);
					}
				},0);
			}			
		};
		
		var insertElementTest = function(){
			var span = dom.createElement('span');
			var ms = 0;
			if(!domReady){
			var timer = window.setInterval(function(){
				if(dom.body && !domReady){
					if(dom.body.appendChild(span) && dom.body.removeChild(span)){
						domReady = true;
					}
				};
				if(domReady){
					window.clearInterval(timer);
				}
			},ms);
		  }		
		};
		
		
		return {
			Query: new MonsterQuery.core.Query(document),
			Event: MonsterQuery.core.Event,
			Element: MonsterQuery.core.Element,
			
			onReady: function(fn){
				var empty = function(){};
				
				domContentLoaded();
				readyStateCheck();
				insertElementTest();
				
				var poll = window.setTimeout(function(){
					if(domReady){
						window.clearTimeout(poll);
						fn.call(empty);
					}
				},30);
				
			}
		};
		
})(window);



