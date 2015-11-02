$(document).ready(function() {
	// Click handler on menu button to toggle sidebar
	$('#sidebar-button').click(function() { $('.sidebar').toggleClass('active') });

	$('#view-all-foods-btn').click(function() {
		$('#properties-col').removeClass('fullwidth');
		$('.properties-container').hide();
		$('#add-new-food-container').fadeOut();
	
		$('#food-list-col').show().animate({'opacity':1}, function() { 
			$('#properties-col').addClass('active');
		});
	});

	$('.sidebar-btn').click(function() {
		if ($(this).closest("li").children("ul").length == 0) {
			$('.sidebar').removeClass('active');
		}
	});

	$('#add-new-food-btn').click(function() {
		expandProperties();
		showContainer('#add-new-food-container');
	});

	$('#add-new-category-btn').click(function() {
		expandProperties();
		showContainer('#add-new-category-container');
	});
});

function expandProperties() {
	$('#food-list-col').animate({'opacity':0}, function() { $('#food-list-col').hide(); $('#properties-col').addClass('fullwidth'); });
}

function showContainer(container_id) {
	$('.properties-container').hide();
	$(container_id).fadeIn();
}