// Flash messages (notifications)

function showMessage(message, type) {

    if ($('.flash-message').hasClass('active')) {
        
        setTimeout(function() { showMessage(message, type); }, 500);

    } else {

        $('.flash-message #message').html(message);
        $('.flash-message').removeClass('success warning danger').addClass(type).addClass('active');
        setTimeout(function() { hideMessage(); }, 1500);
    }
}

function hideMessage() {
	$('.flash-message').removeClass('active');
}