$(document).ready(function() {
	$('button').on('click', function(evt){
		var txt = $(evt.target).text().trim();
		console.log('Click ' + txt);
		if (txt != '') {
			$.ajax({
		        url: "/" + txt
		    }).then(function(data) {
		    	console.log(data);
		    	console.log(data.content);
		       // $('.greeting-id').append(data.id);
		       // $('.greeting-content').append(data.content);
		    });
		}
	});
    /*$.ajax({
        url: "http://rest-service.guides.spring.io/greeting"
    }).then(function(data) {
       $('.greeting-id').append(data.id);
       $('.greeting-content').append(data.content);
    });*/
});
