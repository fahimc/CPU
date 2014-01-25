(function(){
	var count=Math.random();
	var result=Math.floor(Math.random() * 1000) + 100;
	function loopTest(){
		setInterval(function(){
		var done=false;
		var D = new Date();
		
		cpu.start('test');
		
		while(!cpu.exit()){
			count=Math.floor(Math.random() * 10000) + 1;
			var m = (Math.tan(count) * Math.tan(Math.random() ) * Math.tan(Math.random() ))/Math.tan(Math.random());
			
			if(count==result)
			{
				
					cpu.exit(true);
					done=true;
					count=Math.random();
					result=Math.floor(Math.random() * 1000) + 100;
			}
			cpu.check();
		}
		
		cpu.start('test2');
		for(var a=0;a<1000;a++){
			cpu.check();
			var m = (Math.tan(count) * Math.tan(Math.random() ) * Math.tan(Math.random() ))/Math.tan(Math.random());
			a--;
			if(cpu.exit())a=1000;
		}
	},1000);
	}
	
	
	function healthTest(){
		cpu.debug();
		cpu.global();
	}
	healthTest();
	loopTest();
})();
