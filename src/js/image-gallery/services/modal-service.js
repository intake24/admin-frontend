'use strict';

module.exports = function (app) {
    app.service('ModalService', [serviceFun]);
};

function serviceFun() {
    var modalLogOutVisible = false,
        modalAuthenticateVisible = false;

    return {
        showLogoutModal: function () {
            this.hideAll();
            modalLogOutVisible = true;
        },
        showAuthenticateModal: function () {
            this.hideAll();
            modalAuthenticateVisible = true;
        },
        hideLogoutModal: function () {
            modalLogOutVisible = false;
        },
        hideAuthenticateModal: function () {
            modalAuthenticateVisible = false;
        },
        hideAll: function () {
            modalLogOutVisible = false;
            modalAuthenticateVisible = false;
        },
        getModalLogOutVisible: function() {
            return modalLogOutVisible;
        },
        getModalAuthenticateVisible: function() {
            return modalAuthenticateVisible;
        }
    }
}