$(function(){
	
	var graduated_list = $('#graduated-ideas'),
		project_template = $('#issue-project').text(),
		graduate_template = $('#graduate-project').text(),
		ongoing = $('#ongoing-ideas'),
		active_repo = "paulirish/lazyweb-requests",
		output,
		converter = new Showdown.converter();
		
		// AaronLayton/GitTest
		
	// Compile the markdown
	$('.markdown').each(function(){
		$(this).html( converter.makeHtml( $(this).text() ) ).show();	
	});	
	
	// Get all the issues that are closed and 'Complete'
	$.getJSON("https://api.github.com/repos/" + active_repo + "/issues?state=closed&labels=Complete&callback=?", function(data){
		
		var processedResults = {
			data: []
		};
		
		$.each(data.data, function(i,e){
			processedResults.data.push(e);
		});
		
		graduated_list.append( Mustache.render( graduate_template , processedResults) );
		
		// Once all of the projects have been appended we can show them
		$('.project',graduated_list).each(function(i,e){
			
			// Check if there is a writeup for this project
			var writeup_link = $('.writeup a', this);
			console.log(writeup_link.attr('href'));
			if ( $( writeup_link.attr('href') ).length ){
				writeup_link.parent().show();
				console.log("show");
			}
			
			$(this).delay(i*50).fadeIn();	
		});
	});
	
	// Get all issues that are still ongoing 
	$.getJSON("https://api.github.com/repos/" + active_repo + "/issues?sort=updated&callback=?", function(data){
		
		var processedResults = {
			data: []
		};
		
		$.each(data.data, function(i,e){
			
			var tmpArray = jQuery.grep(e.labels, function (a) {
				var tag = a.name;
				if (tag.indexOf("%")) {
					console.log(tag.replace('%',''));
					return tag.replace('%','');
				}
			});
			
			e.progress = (tmpArray.length) ? tmpArray[0].name.replace('%','') : 0;
			
			processedResults.data.push(e);
		});
		
		ongoing.append( Mustache.render( project_template , processedResults) );
		
		// Once all of the projects have been appended we can show them
		$('.project',ongoing).each(function(i,e){
			
			// Check if there is a writeup for this project
			var writeup_link = $('.writeup a', this);
			if ( $( writeup_link.attr('href') ).length ){
				writeup_link.parent().show();
			}
			
			$(this).delay(i*50).fadeIn();	
		});
	});
});