$(document).ready(function() {

	// Hide modal on backdrop click
	$('#modal-backdrop').click(hideModal);

	// Hide modal on close button click
	$('#button-close-modal').click(hideModal);

	$('.btn-modal').click(function() {
		showModal($(this).attr('data-modal'));
	});
});

function showModal(modal_id) {

	$('#modal-backdrop').show().animate({'opacity': 1.0}, 300);
	$('.modal#' + modal_id).show().removeClass('fadeOutDown').addClass('fadeInUp');
}

function hideModal() {

	$('.modal').removeClass('fadeInUp').addClass('fadeOutDown').hide();

	$('#modal-backdrop').animate({'opacity': 0.0}, 300, function() {
		$('#modal-backdrop').hide();
	});
}