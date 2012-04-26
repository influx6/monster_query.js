//now monsterQuery works different from other selector engines in that:
	//you get the first element in the dom and then search within that element for
	//specific properties and elements
	
//monsterquery initialization,requires the dom's document

mq = new MQ.Query(document);

//using the query get method,which returns an Monster.Element object with the result

mq.get('div');

//using the query get method with a callback to manipulate the result,do note that it
//it doesnt affect the elements being store,just allows you to access and manipulate
//them

mq.get('div',function(o){console.log(o)});

//every query get method returns an Element object which has get methods to search 
//the result attained also has a getAttr to search for specific attributes of the
//results children elements

mq.get('section').get('section#editor-view',function(o){ console.log(o)});

mq.get('section').getAttr('div','class','text-writer',function(o){ console.log(o)});

mq.get('section').getAttr('*','class','text-writer',function(o){ console.log(o)});

mq.get('section').getAttr('*','class','text-writer');

mq.get('section').getAttr('*','id','js-writer',function(o){ console.log(o)});