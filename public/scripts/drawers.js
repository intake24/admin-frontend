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

	if ($('html').attr('dir') == 'ltr') {
		$('.drawer#' + drawer_id).show().removeClass('fadeOutRight').addClass('fadeInRight');
	} else {
		$('.drawer#' + drawer_id).show().removeClass('fadeOutLeft').addClass('fadeInLeft');
	}

	// Black magic to make sure Angular picks up object changes from non-Angular code
	var scope = angular.element($('.drawer#' + drawer_id)).scope();
	scope.$apply(function() { scope.onShow(); });
}

function hideDrawer() {

	$('body').removeClass('drawer-open');

	if ($('html').attr('dir') == 'ltr') {
		$('.drawer').removeClass('fadeInRight').addClass('fadeOutRight');
	} else {
		$('.drawer').removeClass('fadeInLeft').addClass('fadeOutLeft');
	}

	$('#drawer-backdrop').animate({'opacity': 0.0}, 300, function() {
		$('#drawer-backdrop').hide();
	});
}
