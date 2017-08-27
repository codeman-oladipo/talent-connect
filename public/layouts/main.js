$(document).ready(function(){
    this.response = "";
	$('#deleteEvent').on('click', function(e){
		e.preventDefault();
		myPrompt();
	});
    
    function myPrompt() {
    if (confirm("Press a button!") === true) {
        var deleteId = $('#deleteEvent').data('delete');
		$.ajax({
			url: '/jobs/delete/'+deleteId,
			type:'DELETE',
			success: function(result){
				console.log(result);
			}
		});
		window.location = '/myjobs';
    } else {
        this.response = 0;
    }
}
    
    
});