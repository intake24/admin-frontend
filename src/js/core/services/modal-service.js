'use strict';

module.exports = function (app) {
    app.service('ModalService', [serviceFun]);
};

function serviceFun() {
    var modalLogOutVisible = false,
        modalAuthenticateVisible = false,
        modalPasswordResetVisible = false,
        arbitraryModalStates = {};

    return {
        showLogoutModal: function () {
            this.hideAll();
            modalLogOutVisible = true;
        },
        showAuthenticateModal: function () {
            this.hideAll();
            modalAuthenticateVisible = true;
        },
        showPasswordResetModal: function () {
            modalPasswordResetVisible = true;
        },
        showArbitraryModal: function (id) {
            arbitraryModalStates[id] = true;
        },
        hideLogoutModal: function () {
            modalLogOutVisible = false;
        },
        hideAuthenticateModal: function () {
            modalAuthenticateVisible = false;
        },
        hidePasswordResetModal: function() {
          modalPasswordResetVisible = false;
        },
        hideAll: function () {
            modalLogOutVisible = false;
            modalAuthenticateVisible = false;
        },
        hideArbitraryModal: function (id) {
            arbitraryModalStates[id] = false;
        },
        getModalLogOutVisible: function() {
            return modalLogOutVisible;
        },
        getModalAuthenticateVisible: function() {
            return modalAuthenticateVisible;
        },
        getModalResetPasswordVisible: function() {
            return modalPasswordResetVisible;
        },
        getModalIsVisible: function () {
            var arbitraryModalsOpen = false;
            for (var i in arbitraryModalStates) {
                arbitraryModalsOpen = arbitraryModalsOpen || arbitraryModalStates[i];
            }
            return this.getModalLogOutVisible() ||
                this.getModalAuthenticateVisible() ||
                this.getModalResetPasswordVisible()
                arbitraryModalsOpen;
        }
    }
}