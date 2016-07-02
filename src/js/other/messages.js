'use strict';

var $ = require('jquery');

module.exports = function () {
    window.showMessage = function (message, type) {

        if ($('.flash-message').hasClass('active')) {

            setTimeout(function () {
                showMessage(message, type);
            }, 500);

        } else {

            $('.flash-message #message').html(message);
            $('.flash-message').removeClass('success warning danger').addClass(type).addClass('active');
            setTimeout(function () {
                hideMessage();
            }, 1500);
        }
    };

    window.hideMessage = function () {
        $('.flash-message').removeClass('active');
    };
};