'use strict';

module.exports = function (app) {
    app.service('Drawers', [serviceFun]);
};

function serviceFun() {

    var service = {
        showDrawer: function (drawer_id) {

            $('body').addClass('drawer-open');
            $('#drawer-backdrop').show().animate({'opacity': 1.0}, 300);

            if ($('html').attr('dir') == 'ltr') {
                $('.drawer#' + drawer_id).show().removeClass('fadeOutRight').addClass('fadeInRight');
            } else {
                $('.drawer#' + drawer_id).show().removeClass('fadeOutLeft').addClass('fadeInLeft');
            }
        },

        hideDrawer: function () {

            $('body').removeClass('drawer-open');

            if ($('html').attr('dir') == 'ltr') {
                $('.drawer').removeClass('fadeInRight').addClass('fadeOutRight');
            } else {
                $('.drawer').removeClass('fadeInLeft').addClass('fadeOutLeft');
            }

            $('#drawer-backdrop').animate({'opacity': 0.0}, 300, function () {
                $('#drawer-backdrop').hide();
            });
        }
    };

    $(document).ready(function () {
        // Show authentication drawer
        $('#button-close-drawer').click(function () {

            $('#drawer-authenticate').removeClass('active');
            $('#drawer-backdrop').removeClass('active');
        });

        // Hide drawer on backdrop click
        $('#drawer-backdrop').click(service.hideDrawer);

        // Hide drawer on close button click
        $('.button-close-drawer').click(service.hideDrawer);

        $('.btn-drawer').click(function () {
            service.showDrawer($(this).attr('data-drawer'));
        });
    });

    return service;
}