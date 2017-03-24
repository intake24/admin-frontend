"use strict";

module.exports = function (app) {
    app.constant('uiDatetimePickerConfig', {
        dateFormat: 'dd/MM/yy HH:mm',
        defaultTime: '00:00:00',
        html5Types: {
            date: 'yyyy-MM-dd',
            'datetime-local': 'yyyy-MM-ddTHH:mm:ss.sss',
            'month': 'yyyy-MM'
        },
        initialPicker: 'date',
        reOpenDefault: false,
        enableDate: true,
        enableTime: true,
        buttonBar: {
            show: true,
            now: {
                show: true,
                text: 'Now',
                cls: 'btn-sm btn-default'
            },
            today: {
                show: true,
                text: 'Today',
                cls: 'btn-sm btn-default'
            },
            clear: {
                show: true,
                text: 'Clear',
                cls: 'btn-sm btn-default'
            },
            date: {
                show: true,
                text: 'Date',
                cls: 'btn-sm btn-default'
            },
            time: {
                show: true,
                text: 'Time',
                cls: 'btn-sm btn-default'
            },
            close: {
                show: true,
                text: 'Close',
                cls: 'btn-sm btn-default'
            }
        },
        closeOnDateSelection: true,
        closeOnTimeNow: true,
        appendToBody: false,
        altInputFormats: [],
        ngModelOptions: {},
        saveAs: false,
        readAs: false,
        timepickerOptions: {
            showMeridian: false
        }
    });
};