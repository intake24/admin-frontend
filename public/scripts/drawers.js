$(document).ready(function() {

	// Show authentication drawer
	$('#button-close-drawer').click(function() {

		$('#drawer-authenticate').removeClass('active');
		$('#drawer-backdrop').removeClass('active');
	});

	// Hide drawer on backdrop click
	$('#drawer-backdrop').click(hideDrawer);

	// Hide drawer on close button click
	$('.button-close-drawer').click(hideDrawer);

	$('.btn-drawer').click(function() {
		showDrawer($(this).attr('data-drawer'));
	});
});

function showDrawer(drawer_id) {

	$('body').addClass('drawer-open');
	$('#drawer-backdrop').show().animate({'opacity': 1.0}, 300);
	$('.drawer#' + drawer_id).show().removeClass('fadeOutRight').addClass('fadeInRight');
}

function hideDrawer() {

	$('body').removeClass('drawer-open');
	$('.drawer').removeClass('fadeInRight').addClass('fadeOutRight');

	$('#drawer-backdrop').animate({'opacity': 0.0}, 300, function() {
		$('#drawer-backdrop').hide();
	});
}