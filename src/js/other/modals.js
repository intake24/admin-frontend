'use strict';

var $ = require('jquery');

module.exports = function () {
    $(document).ready(function () {

        // Show authentication modal
        $('#button-close-modal').click(function () {

            $('#modal-authenticate').removeClass('active');
            $('#modal-backdrop').removeClass('active');
        });

        // Hide modal on backdrop click
        $('#modal-backdrop').click(hideModal);

        // Hide modal on close button click
        $('.button-close-modal').click(hideModal);

        $('.btn-modal').click(function () {
            showModal($(this).attr('data-modal'));
        });
    });

    window.showModal = function (modal_id) {

        $('body').addClass('modal-open');
        $('#modal-backdrop').show().animate({'opacity': 1.0}, 300);
        $('.intake-modal#' + modal_id).show().removeClass('fadeOutDown').addClass('fadeInUp');
    };

    window.hideModal = function () {

        $('body').removeClass('modal-open');
        $('.intake-modal').removeClass('fadeInUp').addClass('fadeOutDown').hide();

        $('#modal-backdrop').animate({'opacity': 0.0}, 300, function () {
            $('#modal-backdrop').hide();
        });
    }
};