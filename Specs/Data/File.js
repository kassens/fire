var myFile = new File('app:/Specs/mytmp');

describe("File", {

	'should read the contents': function(){
		value_of(myFile.read()).should_be('cows are cool');
	}

});

describe("File.Temp", {

	'should create unique temp files': function(){
		var a = new File.Temp();
		var b = new File.Temp();
		value_of(a.getPath()).should_not_be(b.getPath());
	}

});